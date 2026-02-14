/*
 * Theme Engine - Obsidian Plugin
 * Version: 2.2.0
 * Author: Yazan Ammar (GitHub : https://github.com/YazanAmmar )
 * Description: Provides a comprehensive UI to control all Obsidian CSS color variables directly,
 * removing the need for Force Mode and expanding customization options.
 */
import { ButtonComponent, moment, Notice, Plugin, requestUrl } from 'obsidian';
import { PLUGIN_COMMAND_SUFFIXES, registerCommands } from './commands';
import { DEFAULT_SETTINGS, DEFAULT_VARS, BUILT_IN_PROFILES_VARS } from './constants';
import { initializeT, t } from './i18n/strings';
import { NoticeRule, PluginSettings, Profile, Snippet } from './types';
import { ThemeEngineSettingTab } from './ui/settingsTab';
import {
  flattenVars,
  findNextAvailablePath,
  maybeConvertToJpg,
  isIconizeEnabled,
  convertColorToHex,
} from './utils';
import { FileConflictModal } from './ui/modals';

type StylableElement = Element & {
  setCssProps: (props: Record<string, string | null>) => void;
};

type AppWithSettingsManager = {
  setting: {
    open: () => void;
    openTabById: (id: string) => void;
  };
};

type AppWithCommands = {
  commands: {
    executeCommandById: (commandId: string) => void;
  };
};

type VaultWithConfigGetter = {
  getConfig: (key: string) => string;
};

type ReloadableView = {
  reload?: () => void;
};

type LegacyPinnedSnapshot = {
  vars?: Record<string, string>;
  customCss?: string;
  snippets?: Snippet[];
  noticeRules?: {
    text: NoticeRule[];
    background: NoticeRule[];
  };
};

type LegacySnippetData = {
  css?: string;
  enabled?: boolean;
};

const LEGACY_PLUGIN_IDS = [
  'obsidian-theme-engine',
  'color-master',
  'obsidian-color-master',
] as const;
const LEGACY_COMMAND_PLUGIN_IDS = [
  'obsidian-theme-engine',
  'color-master',
  'obsidian-color-master',
] as const;
const CURRENT_PLUGIN_ID = 'theme-engine';

export default class ThemeEngine extends Plugin {
  settings: PluginSettings;
  iconizeWatcherInterval: number | null = null;
  colorUpdateInterval: number | null = null;
  pendingVarUpdates: Record<string, string> = {};
  runtimeStyleSheets: Record<string, CSSStyleSheet> = {};
  runtimeStyleSheetSupportWarned = false;
  settingTabInstance: ThemeEngineSettingTab | null = null;
  liveNoticeRules: NoticeRule[] | null = null;
  liveNoticeRuleType: 'text' | 'background' | null = null;
  iconizeObserver: MutationObserver;
  noticeObserver: MutationObserver;
  cssHistory: Record<string, { undoStack: string[]; redoStack: string[] }> = {};
  cachedThemeDefaults: Record<string, string> | null = null;
  lastCachedThemeMode: 'dark' | 'light' | null = null;

  startColorUpdateLoop() {
    this.stopColorUpdateLoop();

    const fps = this.settings.colorUpdateFPS;
    if (!this.settings.pluginEnabled || !fps || fps <= 0) return;

    const intervalMs = 1000 / fps;

    this.colorUpdateInterval = window.setInterval(() => {
      const pendingKeys = Object.keys(this.pendingVarUpdates);
      if (pendingKeys.length === 0) return;

      // Optimization: Check specifically for Iconize var to avoid expensive DOM updates later
      const iconizeUpdateNeeded = pendingKeys.includes('--iconize-icon-color');

      for (const varName of pendingKeys) {
        const value = this.pendingVarUpdates[varName] ?? null;
        document.body.setCssProps({ [varName]: value });
      }

      this.pendingVarUpdates = {};

      // Notify Obsidian components (e.g., Graph View) to repaint
      this.app.workspace.trigger('css-change');

      if (iconizeUpdateNeeded) {
        try {
          this.forceIconizeColors();
        } catch (e) {
          console.warn('forceIconizeColors failed in update loop', e);
        }
      }
    }, intervalMs);
  }

  // New method to stop the update loop
  stopColorUpdateLoop() {
    if (this.colorUpdateInterval) {
      window.clearInterval(this.colorUpdateInterval);
      this.colorUpdateInterval = null;
    }
  }

  // New method to easily restart the loop when settings change
  restartColorUpdateLoop() {
    this.stopColorUpdateLoop();
    this.startColorUpdateLoop();
  }

  private isObjectRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  private normalizeHotkeyArray(value: unknown): Array<{ modifiers: string[]; key: string }> {
    const normalized: Array<{ modifiers: string[]; key: string }> = [];
    const seen = new Set<string>();

    if (!Array.isArray(value)) {
      return normalized;
    }

    for (const item of value) {
      if (!this.isObjectRecord(item)) continue;

      const keyRaw = item.key;
      if (typeof keyRaw !== 'string' || keyRaw.trim() === '') continue;

      const modifiersRaw = item.modifiers;
      const modifiers = Array.isArray(modifiersRaw)
        ? modifiersRaw.filter((modifier): modifier is string => typeof modifier === 'string')
        : [];

      const entry = { modifiers, key: keyRaw };
      const signature = JSON.stringify(entry);

      if (seen.has(signature)) continue;
      seen.add(signature);
      normalized.push(entry);
    }

    return normalized;
  }

  private mergeHotkeyArrays(
    currentValue: unknown,
    legacyValue: unknown,
  ): Array<{ modifiers: string[]; key: string }> {
    const merged = [
      ...this.normalizeHotkeyArray(currentValue),
      ...this.normalizeHotkeyArray(legacyValue),
    ];
    const deduped: Array<{ modifiers: string[]; key: string }> = [];
    const seen = new Set<string>();

    for (const entry of merged) {
      const signature = JSON.stringify(entry);
      if (seen.has(signature)) continue;
      seen.add(signature);
      deduped.push(entry);
    }

    return deduped;
  }

  private async writeJsonWithBackup(
    path: string,
    backupPath: string,
    data: unknown,
  ): Promise<void> {
    const adapter = this.app.vault.adapter;

    if (!(await adapter.exists(backupPath)) && (await adapter.exists(path))) {
      const currentRaw = await adapter.read(path);
      await adapter.write(backupPath, currentRaw);
    }

    await adapter.write(path, JSON.stringify(data, null, 2));
  }

  private async migrateLegacyPluginDataIfNeeded(): Promise<{
    migrated: boolean;
    sourcePath?: string;
  }> {
    let currentData: unknown = null;

    try {
      currentData = await this.loadData();
    } catch (error) {
      console.warn('Theme Engine: Failed to read current plugin data before migration.', error);
    }

    if (this.isObjectRecord(currentData) && Object.keys(currentData).length > 0) {
      return { migrated: false };
    }

    const adapter = this.app.vault.adapter;
    const pluginsDir = `${this.app.vault.configDir}/plugins`;

    for (const legacyPluginId of LEGACY_PLUGIN_IDS) {
      const sourcePath = `${pluginsDir}/${legacyPluginId}/data.json`;

      try {
        if (!(await adapter.exists(sourcePath))) continue;

        const raw = await adapter.read(sourcePath);
        const parsed = JSON.parse(raw) as unknown;
        if (!this.isObjectRecord(parsed)) {
          console.warn(
            `Theme Engine: Legacy data at "${sourcePath}" is not an object. Skipping migration source.`,
          );
          continue;
        }

        const migratedSettings: Record<string, unknown> = { ...parsed };
        migratedSettings.idMigration = {
          from: legacyPluginId,
          to: CURRENT_PLUGIN_ID,
          at: new Date().toISOString(),
          sourcePath,
        };

        await this.saveData(migratedSettings);
        console.debug(`Theme Engine: Migrated settings data from "${sourcePath}".`);
        return { migrated: true, sourcePath };
      } catch (error) {
        console.warn(`Theme Engine: Failed to migrate data from "${sourcePath}".`, error);
      }
    }

    return { migrated: false };
  }

  private async migrateLegacyHotkeysIfNeeded(): Promise<boolean> {
    const adapter = this.app.vault.adapter;
    const configDir = this.app.vault.configDir;
    const hotkeysPath = `${configDir}/hotkeys.json`;
    const backupPath = `${configDir}/hotkeys.${CURRENT_PLUGIN_ID}-id-migration.bak.json`;

    try {
      if (!(await adapter.exists(hotkeysPath))) return false;

      const raw = await adapter.read(hotkeysPath);
      const parsed = JSON.parse(raw) as unknown;
      if (!this.isObjectRecord(parsed)) return false;

      const hotkeyMap = parsed;
      let changed = false;

      for (const suffix of PLUGIN_COMMAND_SUFFIXES) {
        const newCommandId = `${CURRENT_PLUGIN_ID}:${suffix}`;
        const currentValue = hotkeyMap[newCommandId];
        const normalizedCurrent = this.normalizeHotkeyArray(currentValue);
        let merged = normalizedCurrent;

        for (const legacyCommandPluginId of LEGACY_COMMAND_PLUGIN_IDS) {
          const oldCommandId = `${legacyCommandPluginId}:${suffix}`;
          const legacyValue = hotkeyMap[oldCommandId];

          if (typeof legacyValue === 'undefined') continue;

          merged = this.mergeHotkeyArrays(merged, legacyValue);
          delete hotkeyMap[oldCommandId];
          changed = true;
        }

        if (JSON.stringify(normalizedCurrent) !== JSON.stringify(merged)) {
          hotkeyMap[newCommandId] = merged;
          changed = true;
        }
      }

      if (!changed) return false;

      await this.writeJsonWithBackup(hotkeysPath, backupPath, hotkeyMap);
      console.debug(
        `Theme Engine: Migrated hotkeys from legacy namespaces to "${CURRENT_PLUGIN_ID}:*".`,
      );
      return true;
    } catch (error) {
      console.warn('Theme Engine: Failed to migrate hotkeys.', error);
      return false;
    }
  }

  private async migrateCommunityPluginListIfNeeded(): Promise<boolean> {
    const adapter = this.app.vault.adapter;
    const configDir = this.app.vault.configDir;
    const listPath = `${configDir}/community-plugins.json`;
    const backupPath = `${configDir}/community-plugins.${CURRENT_PLUGIN_ID}-id-migration.bak.json`;

    try {
      if (!(await adapter.exists(listPath))) return false;

      const raw = await adapter.read(listPath);
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return false;

      const entries = parsed.filter((entry): entry is string => typeof entry === 'string');
      let changed = entries.length !== parsed.length;
      const updatedEntries: string[] = [];
      let hasCurrentId = false;

      for (const entry of entries) {
        if (entry === CURRENT_PLUGIN_ID) {
          if (!hasCurrentId) {
            updatedEntries.push(entry);
            hasCurrentId = true;
          } else {
            changed = true;
          }
          continue;
        }

        if (LEGACY_PLUGIN_IDS.some((legacyId) => legacyId === entry)) {
          if (!hasCurrentId) {
            updatedEntries.push(CURRENT_PLUGIN_ID);
            hasCurrentId = true;
          }
          changed = true;
          continue;
        }

        updatedEntries.push(entry);
      }

      if (!changed) return false;

      await this.writeJsonWithBackup(listPath, backupPath, updatedEntries);
      console.debug(
        `Theme Engine: Migrated community plugin list entry from legacy IDs to "${CURRENT_PLUGIN_ID}".`,
      );
      return true;
    } catch (error) {
      console.warn('Theme Engine: Failed to migrate community plugin list.', error);
      return false;
    }
  }

  private supportsRuntimeStyleSheets(): boolean {
    return typeof CSSStyleSheet !== 'undefined' && Array.isArray(document.adoptedStyleSheets);
  }

  private getOrCreateRuntimeStyleSheet(styleId: string): CSSStyleSheet | null {
    if (!this.supportsRuntimeStyleSheets()) {
      if (!this.runtimeStyleSheetSupportWarned) {
        this.runtimeStyleSheetSupportWarned = true;
        console.warn(
          'Theme Engine: Constructable stylesheets are not supported in this environment.',
        );
      }
      return null;
    }

    let styleSheet = this.runtimeStyleSheets[styleId];
    if (!styleSheet) {
      styleSheet = new CSSStyleSheet();
      this.runtimeStyleSheets[styleId] = styleSheet;
    }

    if (!document.adoptedStyleSheets.includes(styleSheet)) {
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
    }

    return styleSheet;
  }

  private setRuntimeStyle(styleId: string, cssText: string): void {
    const styleSheet = this.getOrCreateRuntimeStyleSheet(styleId);
    if (!styleSheet) return;

    try {
      styleSheet.replaceSync(cssText);
    } catch (e) {
      console.error(`Theme Engine: Failed to apply runtime stylesheet "${styleId}"`, e);
    }
  }

  private clearRuntimeStyle(styleId: string): void {
    const styleSheet = this.runtimeStyleSheets[styleId];
    if (!styleSheet) return;

    delete this.runtimeStyleSheets[styleId];

    if (document.adoptedStyleSheets.includes(styleSheet)) {
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
        (sheet) => sheet !== styleSheet,
      );
    }
  }

  // Removes background image CSS variable and body classes.
  _clearBackgroundMedia() {
    document.body.setCssProps({ '--cm-background-image': null });
    document.body.classList.remove('cm-workspace-background-active');
    document.body.classList.remove('cm-settings-background-active');

    // Delete any old video
    const oldVideo = document.getElementById('cm-background-video');
    if (oldVideo) oldVideo.remove();
  }

  async applyTransparencyToVars(): Promise<boolean> {
    const profile = this.settings.profiles?.[this.settings.activeProfile];
    if (!profile) return false;

    const activeProfileName = this.settings.activeProfile;
    const profileOriginalVars =
      BUILT_IN_PROFILES_VARS[activeProfileName as keyof typeof BUILT_IN_PROFILES_VARS];
    const baseVars = profileOriginalVars || BUILT_IN_PROFILES_VARS.Default;

    const varsToMakeTransparent = [
      '--background-primary',
      '--background-secondary',
      '--background-modifier-border',
      '--titlebar-background-focused',
      '--background-modifier-hover',
    ];

    let settingsChanged = false;
    for (const varName of varsToMakeTransparent) {
      if (profile.vars[varName] !== 'transparent') {
        const defaultValue = baseVars[varName as keyof typeof baseVars];
        if (!profile.vars[varName] || profile.vars[varName] === defaultValue) {
          profile.vars[varName] = 'transparent';
          settingsChanged = true;
          if (this.settings.colorUpdateFPS > 0) {
            this.pendingVarUpdates[varName] = 'transparent';
          }
        }
      }
    }

    if (settingsChanged) {
      await this.saveData(this.settings);
      if (this.settingTabInstance && this.settingTabInstance.containerEl.offsetHeight > 0) {
        this.settingTabInstance.display();
      }
    }
    return settingsChanged;
  }

  // Applies the current profile's background image and transparency settings.
  async applyBackgroundMedia() {
    const profile = this.settings.profiles?.[this.settings.activeProfile];

    // 1. Clean any old background (image or video)
    this._clearBackgroundMedia();

    // 2. Exit if the add-on is off, there is no profile, or the background is off
    if (!profile || profile.backgroundEnabled === false || !profile.backgroundPath) {
      if (profile && profile.backgroundEnabled === false) {
        await this._restoreDefaultBackgroundVars();
      }
      return;
    }

    // 3. Apply transparency
    await this.applyTransparencyToVars();

    const path = profile.backgroundPath;
    const type = profile.backgroundType;
    if (type === 'image') {
      const imageUrl = this.app.vault.adapter.getResourcePath(path);
      document.body.setCssProps({
        '--cm-background-image': `url("${imageUrl}")`,
      });

      document.body.classList.add('cm-workspace-background-active');
    } else if (type === 'video') {
      const videoUrl = this.app.vault.adapter.getResourcePath(path);

      let videoEl = document.querySelector<HTMLVideoElement>('#cm-background-video');
      if (!videoEl) {
        videoEl = document.createElement('video');
        videoEl.id = 'cm-background-video';
        document.body.appendChild(videoEl);
      }

      videoEl.src = videoUrl;
      videoEl.autoplay = true;
      videoEl.loop = true;
      videoEl.muted = profile.videoMuted !== false;
      videoEl.playsInline = true;
      videoEl.setCssProps({
        opacity: (profile.videoOpacity || 0.5).toString(),
      });

      videoEl.load();
      document.body.classList.add('cm-workspace-background-active');
    }
  }

  /**
   * Restores specific UI CSS variables from 'transparent' back to default values.
   * @returns True if settings were changed and saved, false otherwise.
   */
  async _restoreDefaultBackgroundVars(): Promise<boolean> {
    const profile = this.settings.profiles?.[this.settings.activeProfile];
    if (!profile) return false;

    const activeProfileName = this.settings.activeProfile;
    const profileOriginalVars =
      BUILT_IN_PROFILES_VARS[activeProfileName as keyof typeof BUILT_IN_PROFILES_VARS];
    const baseVars = profileOriginalVars || BUILT_IN_PROFILES_VARS.Default;

    // List of variables to check and potentially restore
    const varsToRestore = [
      '--background-primary',
      '--background-secondary',
      '--background-modifier-border',
      '--titlebar-background-focused',
      '--background-modifier-hover',
    ];

    let settingsRestored = false;
    for (const varName of varsToRestore) {
      // Only restore if currently 'transparent'
      if (profile.vars[varName] === 'transparent') {
        const defaultValue = baseVars[varName as keyof typeof baseVars];
        if (defaultValue) {
          profile.vars[varName] = defaultValue;
          settingsRestored = true;
          // Update pending immediately if live preview is on
          if (this.settings.colorUpdateFPS > 0) {
            this.pendingVarUpdates[varName] = defaultValue;
          }
        }
      }
    }

    // Save and update UI only if changes were made
    if (settingsRestored) {
      await this.saveData(this.settings); // Persist
      // Refresh settings UI if visible
      if (this.settingTabInstance && this.settingTabInstance.containerEl.offsetHeight > 0) {
        this.settingTabInstance.display();
      }
      if (this.settings.colorUpdateFPS === 0) {
        this.applyPendingNow(); // Apply changes immediately if live preview is off
      }
      return true;
    }

    return false;
  }

  /**
   * Ensures the global .obsidian/backgrounds folder exists on startup.
   */
  async _ensureBackgroundsFolderExists(): Promise<void> {
    const backgroundsPath = `${this.app.vault.configDir}/backgrounds`;
    try {
      // Check if the folder does NOT exist
      if (!(await this.app.vault.adapter.exists(backgroundsPath))) {
        // Create the folder if it's missing
        await this.app.vault.adapter.mkdir(backgroundsPath);
        console.debug(`Theme Engine: Created global backgrounds folder at ${backgroundsPath}`);
      }
    } catch (error) {
      console.error('Theme Engine: Failed to create backgrounds folder on startup.', error);
    }
  }

  // This function now deletes the file AND clears the path from ALL profiles using it.
  async removeBackgroundMediaByPath(pathToDelete: string) {
    if (!pathToDelete) return;

    const varsToRestore = [
      '--background-primary',
      '--background-secondary',
      '--background-modifier-border',
      '--titlebar-background-focused',
      '--background-modifier-hover',
    ];

    let settingsChanged = false;

    // 1. Iterate through ALL profiles to find who is using this image
    for (const profileName in this.settings.profiles) {
      const profile = this.settings.profiles[profileName];

      if (profile.backgroundPath === pathToDelete) {
        // Clear the path
        profile.backgroundPath = '';
        profile.backgroundType = undefined;
        // Disable background automatically to prevent issues
        profile.backgroundEnabled = false;

        // Restore colors for THIS profile (Active or Inactive)
        const profileOriginalVars =
          BUILT_IN_PROFILES_VARS[profileName as keyof typeof BUILT_IN_PROFILES_VARS] ||
          BUILT_IN_PROFILES_VARS.Default;

        for (const varName of varsToRestore) {
          if (profile.vars[varName] === 'transparent') {
            const defaultValue = profileOriginalVars[varName as keyof typeof profileOriginalVars];

            if (defaultValue) {
              profile.vars[varName] = defaultValue;
            } else {
              // If no default exists, remove the var to let theme handle it
              delete profile.vars[varName];
            }
          }
        }

        settingsChanged = true;
      }
    }

    // 2. Try to delete the actual file
    try {
      if (await this.app.vault.adapter.exists(pathToDelete)) {
        await this.app.vault.adapter.remove(pathToDelete);
      }
    } catch (error) {
      console.warn(`Theme Engine: Could not delete background file '${pathToDelete}'.`, error);
    }

    if (settingsChanged) {
      await this.saveSettings();

      // If the active profile was affected, we need to apply changes immediately
      // We use pending updates to make it smooth if live preview is on
      const activeProfile = this.settings.profiles[this.settings.activeProfile];
      if (activeProfile.backgroundPath === '') {
        // Re-apply pending updates for the active profile just in case
        for (const varName of varsToRestore) {
          const val = activeProfile.vars[varName];
          if (val) this.pendingVarUpdates[varName] = val;
        }
        this.applyPendingNow();
      }
    }

    // 3. Refresh settings tab UI
    if (this.settingTabInstance) {
      this.settingTabInstance.display();
    }
  }

  // Adds or replaces a background image file in the global folder.
  async setBackgroundMedia(
    arrayBuffer: ArrayBuffer,
    fileName: string,
    conflictChoice: 'replace' | 'keep' | 'prompt' = 'prompt',
  ) {
    const activeProfile = this.settings.profiles?.[this.settings.activeProfile];
    if (!activeProfile) return;

    const { arrayBuffer: finalArrayBuffer, fileName: finalFileName } = await maybeConvertToJpg(
      activeProfile,
      arrayBuffer,
      fileName,
    );

    const fileExt = finalFileName.split('.').pop()?.toLowerCase();
    const mediaType: 'image' | 'video' =
      fileExt === 'mp4' || fileExt === 'webm' ? 'video' : 'image';

    const backgroundsPath = `${this.app.vault.configDir}/backgrounds`;

    let targetPath = `${backgroundsPath}/${finalFileName}`; // Use finalFileName

    // 1. Ensure folder exists
    try {
      if (!(await this.app.vault.adapter.exists(backgroundsPath))) {
        await this.app.vault.adapter.mkdir(backgroundsPath);
      }

      const fileExists = await this.app.vault.adapter.exists(targetPath);

      // 2. Resolve conflicts if file exists
      if (fileExists && conflictChoice === 'prompt') {
        new FileConflictModal(this.app, this, finalArrayBuffer, finalFileName, (choice) => {
          // run async logic safely
          void (async () => {
            await this.setBackgroundMedia(finalArrayBuffer, finalFileName, choice);
          })().catch((err) => {
            console.error('Failed to set background media:', err);
          });
        }).open();
        return;
      }

      if (fileExists && conflictChoice === 'keep') {
        targetPath = await findNextAvailablePath(this.app.vault.adapter, targetPath);
      }
      if (fileExists && conflictChoice === 'replace') {
        await this.app.vault.adapter.remove(targetPath);
      }

      // 3. Save image data
      await this.app.vault.createBinary(targetPath, finalArrayBuffer);

      const oldImagePath = activeProfile.backgroundPath;

      // 4. Update settings
      activeProfile.backgroundPath = targetPath;
      activeProfile.backgroundType = mediaType;

      // 5. Save settings (this will trigger applyBackgroundMedia)
      await this.saveSettings();
      new Notice(t('notices.bgSet'));

      // 6. Cleanup previous file if replacing original name and paths differ
      if (
        oldImagePath &&
        oldImagePath !== targetPath &&
        conflictChoice === 'replace' // Only delete if 'replace'
      ) {
        if (await this.app.vault.adapter.exists(oldImagePath)) {
          await this.app.vault.adapter.remove(oldImagePath);
        }
      }

      // 7. Refresh settings tab UI
      if (this.settingTabInstance) {
        this.settingTabInstance.display();
      }
    } catch (error) {
      new Notice(t('notices.backgroundLoadError'));
      console.error('Theme Engine: Error setting background media:', error);
    }
  }

  applyCustomCssForProfile(profileName: string) {
    try {
      if (!profileName) profileName = this.settings.activeProfile;
      const profile = this.settings.profiles?.[profileName];
      this.removeInjectedCustomCss();

      if (!profile || !profile.isCssProfile || !profile.customCss) {
        return;
      }

      this.setRuntimeStyle('cm-custom-css-for-profile', profile.customCss);
    } catch (e) {
      console.warn('applyCustomCssForProfile failed', e);
    }
  }

  removeInjectedCustomCss() {
    try {
      this.clearRuntimeStyle('cm-custom-css-for-profile');
      const oldStyle = document.getElementById('cm-custom-css-for-profile');
      if (oldStyle) oldStyle.remove();
    } catch (e) {
      console.warn(e);
    }
  }

  applyCssSnippets() {
    this.removeCssSnippets();
    const activeProfile = this.settings.profiles[this.settings.activeProfile];
    if (!activeProfile) return;

    const globalSnippets = this.settings.globalSnippets || [];
    const profileSnippets = Array.isArray(activeProfile.snippets) ? activeProfile.snippets : [];

    const allSnippets = [...globalSnippets, ...profileSnippets].filter(Boolean);

    const enabledCss = allSnippets
      .filter((s) => s.enabled && s.css)
      .map((s) => {
        const upgradedCss = s.css.replace(/\bbody\s*(?=\{)/g, 'body.theme-dark, body.theme-light');
        return `/* Snippet: ${s.name} ${s.isGlobal ? '(Global)' : ''} */\n${upgradedCss}`;
      })
      .join('\n\n');

    if (enabledCss) {
      this.setRuntimeStyle('cm-css-snippets', enabledCss);
    }
  }

  removeCssSnippets() {
    this.clearRuntimeStyle('cm-css-snippets');
    const el = document.getElementById('cm-css-snippets');
    if (el) el.remove();
  }

  // New method to apply pending changes instantly
  applyPendingNow() {
    try {
      const pending = this.pendingVarUpdates || {};
      const keys = Object.keys(pending);
      if (keys.length === 0) {
        // If nothing is pending, still trigger a repaint for safety
        this.app.workspace.trigger('css-change');
        window.dispatchEvent(new Event('resize'));
        return;
      }

      // Apply all pending CSS properties
      for (const k of keys) {
        const value = pending[k] ?? null;
        document.body.setCssProps({ [k]: value });
      }

      // Clear pending updates
      this.pendingVarUpdates = {};

      // Notify Obsidian and other components to update
      this.app.workspace.trigger('css-change');
      this.forceIconizeColors();

      // Force graph view to repaint by dispatching a resize event
      window.dispatchEvent(new Event('resize'));
    } catch (e) {
      console.error('Theme Engine: applyPendingNow failed', e);
    }
  }

  pinProfileSnapshot(profileName: string) {
    if (!profileName) profileName = this.settings.activeProfile;
    this.settings.pinnedSnapshots = this.settings.pinnedSnapshots || {};
    const profile = this.settings.profiles?.[profileName];
    if (!profile) {
      new Notice(t('notices.profileNotFound'));
      return;
    }

    const snapshotProfile: Profile = JSON.parse(
      JSON.stringify({
        ...profile,
        vars: profile.vars || {},
        themeType: profile.themeType || 'auto',
        snippets: Array.isArray(profile.snippets) ? profile.snippets : [],
        customCss: profile.customCss || '',
        noticeRules: profile.noticeRules || { text: [], background: [] },
      }),
    );

    this.settings.pinnedSnapshots[profileName] = {
      pinnedAt: new Date().toISOString(),
      profile: snapshotProfile,
    };
    return this.saveSettings();
  }

  async resetProfileToPinned(profileName: string): Promise<void> {
    if (!profileName) profileName = this.settings.activeProfile;
    const snap = this.settings.pinnedSnapshots?.[profileName];
    if (!snap) {
      new Notice(t('notices.noPinnedSnapshot'));
      return;
    }

    const activeProfile = this.settings.profiles[profileName];
    if (!activeProfile) {
      new Notice(t('notices.profileNotFound'));
      return;
    }

    const legacySnap = snap as LegacyPinnedSnapshot;
    const pinnedProfile: Profile | null = snap.profile
      ? JSON.parse(JSON.stringify(snap.profile))
      : legacySnap.vars
        ? {
            vars: JSON.parse(JSON.stringify(legacySnap.vars)),
            themeType: activeProfile.themeType || 'auto',
            snippets: Array.isArray(legacySnap.snippets)
              ? JSON.parse(JSON.stringify(legacySnap.snippets))
              : [],
            customCss: legacySnap.customCss || '',
            noticeRules: legacySnap.noticeRules
              ? JSON.parse(JSON.stringify(legacySnap.noticeRules))
              : { text: [], background: [] },
          }
        : null;

    if (!pinnedProfile || !pinnedProfile.vars) {
      new Notice(t('notices.noPinnedSnapshot'));
      return;
    }

    activeProfile.vars = pinnedProfile.vars;
    activeProfile.customCss = pinnedProfile.customCss || '';
    activeProfile.snippets = Array.isArray(pinnedProfile.snippets) ? pinnedProfile.snippets : [];
    activeProfile.noticeRules = pinnedProfile.noticeRules || { text: [], background: [] };

    Object.keys(pinnedProfile.vars).forEach((k) => {
      this.pendingVarUpdates[k] = pinnedProfile.vars[k];
    });

    await this.saveSettings();
    this.applyPendingNow();
  }

  resetIconizeWatcher() {
    if (this.iconizeWatcherInterval) {
      window.clearInterval(this.iconizeWatcherInterval);
    }

    const intervalMilliseconds = this.settings.cleanupInterval * 1000;

    this.iconizeWatcherInterval = window.setInterval(() => {
      const isIconizeInstalled = isIconizeEnabled(this.app);

      if (!isIconizeInstalled) {
        this.removeOrphanedIconizeElements();
      }
    }, intervalMilliseconds);

    this.registerInterval(this.iconizeWatcherInterval);
  }

  async onload() {
    const dataMigration = await this.migrateLegacyPluginDataIfNeeded();
    const hotkeysMigrated = await this.migrateLegacyHotkeysIfNeeded();
    const communityPluginsMigrated = await this.migrateCommunityPluginListIfNeeded();

    await this.loadSettings();

    const migrationHappened = dataMigration.migrated || hotkeysMigrated || communityPluginsMigrated;

    if (migrationHappened) {
      const sourcePath =
        dataMigration.sourcePath ||
        this.settings.idMigration?.sourcePath ||
        `${this.app.vault.configDir}/plugins/${LEGACY_PLUGIN_IDS[0]}/data.json`;

      this.settings.idMigration = {
        from: this.settings.idMigration?.from || LEGACY_PLUGIN_IDS[0],
        to: CURRENT_PLUGIN_ID,
        at: new Date().toISOString(),
        sourcePath,
        hotkeysMigrated,
        communityPluginsMigrated,
      };

      await this.saveData(this.settings);
    }

    initializeT(this);

    if (migrationHappened) {
      const migratedParts: string[] = [];
      if (dataMigration.migrated) migratedParts.push('settings data');
      if (hotkeysMigrated) migratedParts.push('hotkeys');
      if (communityPluginsMigrated) migratedParts.push('enabled plugin list');

      new Notice(`Theme Engine migration completed: ${migratedParts.join(', ')}.`);
    }

    await this._ensureBackgroundsFolderExists();
    this.liveNoticeRules = null;
    this.liveNoticeRuleType = null;
    if (this.settings.language === 'auto') {
      const obsidianLang = moment.locale();

      // Determine the language based on Obsidian's current locale
      if (obsidianLang === 'ar') {
        this.settings.language = 'ar';
      } else if (obsidianLang === 'fa') {
        this.settings.language = 'fa';
      } else if (obsidianLang === 'fr') {
        this.settings.language = 'fr';
      } else {
        this.settings.language = 'en'; // The default
      }
      await this.saveSettings();
    }

    registerCommands(this);

    // Add a ribbon icon to the left gutter
    this.addRibbonIcon('paint-bucket', t('plugin.ribbonTooltip'), (_evt: MouseEvent) => {
      // Open the settings tab when the icon is clicked
      const appWithSettings = this.app as typeof this.app & AppWithSettingsManager;
      appWithSettings.setting.open();
      appWithSettings.setting.openTabById(this.manifest.id);
    });

    // Store a reference to the settings tab and add it
    this.settingTabInstance = new ThemeEngineSettingTab(this.app, this);
    this.addSettingTab(this.settingTabInstance);

    this.app.workspace.onLayoutReady(() => {
      void this.applyStyles();
      setTimeout(() => this.app.workspace.trigger('css-change'), 100);

      // Start the update engine
      this.startColorUpdateLoop();
      this.iconizeObserver = new MutationObserver(() => {
        if (this.settings.pluginEnabled && this.settings.overrideIconizeColors) {
          this.forceIconizeColors();
        }
      });

      this.noticeObserver = new MutationObserver((mutations) => {
        if (!this.settings.pluginEnabled) return;
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType !== 1) return;

            if ((node as Element).matches('.notice, .toast')) {
              this.processNotice(node as HTMLElement);
            }
            (node as Element)
              .querySelectorAll('.notice, .toast')
              .forEach(this.processNotice.bind(this));
          });
        });
      });

      if (this.settings.pluginEnabled) {
        this.enableObservers();
      }

      this.register(() => this.disableObservers());
    });
    this.resetIconizeWatcher();
  }

  onunload(): void {
    if (this.noticeObserver) this.noticeObserver.disconnect();
    if (this.iconizeObserver) this.iconizeObserver.disconnect();

    if (this.settings) {
      this.settings.lastSearchQuery = '';
      this.settings.lastScrollPosition = 0;
      this.saveData(this.settings).catch((err) => {
        console.error('Theme Engine: Failed to save settings on unload.', err);
      });
    }

    this.clearStyles();
    this.removeInjectedCustomCss();
    this.stopColorUpdateLoop();
    this._clearBackgroundMedia();
    console.debug('Theme Engine unloaded.');
  }

  public enableObservers(): void {
    try {
      this.iconizeObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
      this.noticeObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
      console.debug('Theme Engine Observers: Enabled');
    } catch (e) {
      console.error('Theme Engine: Failed to enable observers', e);
    }
  }

  public disableObservers(): void {
    try {
      this.iconizeObserver.disconnect();
      this.noticeObserver.disconnect();
      console.debug('Theme Engine Observers: Disabled');
    } catch (e) {
      console.error('Theme Engine: Failed to disable observers', e);
    }
  }

  async refreshOpenGraphViews() {
    const graphLeaves = this.app.workspace.getLeavesOfType('graph');
    if (graphLeaves.length === 0) {
      return;
    }

    console.debug(
      `Theme Engine: Found ${graphLeaves.length} graph(s). Applying Plan C (programmatic rebuild).`,
    );

    for (const leaf of graphLeaves) {
      const currentState = leaf.getViewState();

      await leaf.setViewState({
        ...currentState,
        type: 'graph',
        state: { ...currentState.state },
      });
    }
  }

  forceIconizeColors() {
    // read the *computed* CSS var first (this covers live-preview via pendingVarUpdates)
    let computedIconizeColor = null;
    try {
      const cssVal = getComputedStyle(document.body).getPropertyValue('--iconize-icon-color');
      if (cssVal) computedIconizeColor = cssVal.trim();
    } catch (e) {
      console.warn('Theme Engine: failed to read computed --iconize-icon-color', e);
      computedIconizeColor = null;
    }

    // fallback to stored profile value if computed is empty
    const storedIconizeColor =
      this.settings.profiles?.[this.settings.activeProfile]?.vars?.['--iconize-icon-color'];

    const iconizeColor = this.settings.overrideIconizeColors
      ? computedIconizeColor || storedIconizeColor || null
      : null;

    // Iterate over elements that Iconize marks (keep the original safe logic)
    document.querySelectorAll('.iconize-icon').forEach((iconNode) => {
      const svg = iconNode.querySelector('svg');
      if (!svg) return;

      ([svg, ...svg.querySelectorAll('*')] as StylableElement[]).forEach((el) => {
        if (typeof el.setCssProps !== 'function') return;

        if (!iconizeColor) {
          // remove inline overrides to let theme/defaults show
          el.setCssProps({
            fill: null,
            stroke: null,
          });
          return;
        }

        const originalFill = el.getAttribute('fill');
        const originalStroke = el.getAttribute('stroke');

        // apply with !important so plugin/theme inline styles are overridden
        if (originalFill && originalFill !== 'none' && !originalFill.startsWith('url(')) {
          el.setCssProps({ fill: iconizeColor });
        }

        if (originalStroke && originalStroke !== 'none') {
          el.setCssProps({ stroke: iconizeColor });
        }
      });
    });
  }

  removeOrphanedIconizeElements() {
    const iconizeInstalled = isIconizeEnabled(this.app);

    // We only proceed if Iconize is actually installed. If so, we do nothing.
    if (iconizeInstalled) {
      return;
    }

    // If not installed, check if the override setting is still on.
    let settingsChanged = false;
    if (this.settings.overrideIconizeColors === true) {
      console.debug('Theme Engine: Iconize plugin not found. Disabling override setting.');
      this.settings.overrideIconizeColors = false;
      settingsChanged = true;
    }

    // Find all elements with the .iconize-icon class and check if they have content.
    const orphanedIcons = document.querySelectorAll('.iconize-icon');

    if (orphanedIcons.length > 0) {
      console.debug(
        `Theme Engine: Found ${orphanedIcons.length} orphaned Iconize elements. Cleaning up...`,
      );
      orphanedIcons.forEach((icon) => icon.remove());
    }

    if (settingsChanged) {
      void this.saveSettings().catch((err) => {
        console.error('Failed to save settings after removing Iconize leftovers:', err);
      });
    }
  }

  async applyStyles() {
    this.removeOrphanedIconizeElements();
    this.clearStyles();
    if (!this.settings.pluginEnabled) {
      this.removeInjectedCustomCss();
      return;
    }

    const profile = this.settings.profiles[this.settings.activeProfile];
    if (!profile) {
      console.error('Theme Engine: Active profile not found!');
      return;
    }

    const profileVars = Object.entries(profile.vars);
    if (profileVars.length > 0) {
      const cssString = `body.theme-dark, body.theme-light {
    ${profileVars
      .map(([key, value]) => (value ? `${key}: ${value};` : ''))
      .filter(Boolean)
      .join('\n            ')}
    }`;

      this.setRuntimeStyle('cm-profile-variables', cssString);
    }

    this.forceIconizeColors();
    setTimeout(() => this.forceIconizeColors(), 100);

    const themeType = profile.themeType || 'auto';

    // Handle theme toggle (Dark/Light/Auto)
    if (themeType === 'dark') {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
    } else if (themeType === 'light') {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
    } else {
      const vaultWithConfig = this.app.vault as typeof this.app.vault & VaultWithConfigGetter;
      const currentConfig = vaultWithConfig.getConfig('theme');
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (currentConfig === 'obsidian' || (currentConfig === 'system' && isSystemDark)) {
        document.body.classList.remove('theme-light');
        document.body.classList.add('theme-dark');
      } else {
        document.body.classList.remove('theme-dark');
        document.body.classList.add('theme-light');
      }
    }
    this.applyCustomCssForProfile(this.settings.activeProfile);
    this.applyCssSnippets();

    // Add/Remove body class for RTL notices
    const langCode = this.settings.language;
    const customLang = this.settings.customLanguages?.[langCode];
    const isCoreRtlLang = langCode === 'ar' || langCode === 'fa';
    const isCustomRtlLang = customLang?.isRtl === true;
    const isRtlEnabled = this.settings.useRtlLayout;
    const isRTL = (isCoreRtlLang || isCustomRtlLang) && isRtlEnabled;

    if (isRTL) {
      document.body.classList.add('theme-engine-rtl');
    } else {
      document.body.classList.remove('theme-engine-rtl');
    }
    await this.applyBackgroundMedia();
    this.app.workspace.trigger('css-change');
    window.dispatchEvent(new Event('resize'));

    setTimeout(() => {
      this.app.workspace.trigger('css-change');
      const graphLeaves = this.app.workspace.getLeavesOfType('graph');
      graphLeaves.forEach((leaf) => {
        const view = leaf.view as ReloadableView | null;
        if (view?.reload) {
          view.reload();
        }
      });
    }, 300);
  }

  clearStyles() {
    this.clearRuntimeStyle('cm-profile-variables');
    this.clearRuntimeStyle('cm-dynamic-notice-styles');

    const profileStyleEl = document.getElementById('cm-profile-variables');
    if (profileStyleEl) {
      profileStyleEl.remove();
    }

    this.removeCssSnippets();

    const allVars = new Set();
    Object.keys(flattenVars(DEFAULT_VARS)).forEach((key) => allVars.add(key));
    for (const profileName in this.settings.profiles) {
      const profile = this.settings.profiles[profileName];
      if (profile && profile.vars) {
        Object.keys(profile.vars).forEach((key) => allVars.add(key));
      }
    }
    allVars.forEach((key: string) => {
      document.body.setCssProps({ [key]: null });
    });

    document.querySelectorAll('.iconize-icon').forEach((iconNode) => {
      const svg = iconNode.querySelector('svg');
      if (!svg) return;

      ([svg, ...svg.querySelectorAll('*')] as StylableElement[]).forEach((el) => {
        if (typeof el.setCssProps !== 'function') return;

        el.setCssProps({
          fill: null,
          stroke: null,
        });
      });
    });

    const styleId = 'theme-engine-overrides';
    const overrideStyleEl = document.getElementById(styleId);
    if (overrideStyleEl) {
      overrideStyleEl.remove();
    }
    this.app.workspace.trigger('css-change');
    document.body.classList.remove('theme-engine-rtl');
    this._clearBackgroundMedia();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

    let migrationNeeded = false;
    if (this.settings.noticeRules && Object.keys(this.settings.profiles || {}).length > 0) {
      console.debug('Theme Engine: Detected old global notice rules. Starting migration...');
      for (const profileName in this.settings.profiles) {
        const profile = this.settings.profiles[profileName];
        if (!profile.noticeRules) {
          profile.noticeRules = JSON.parse(JSON.stringify(this.settings.noticeRules));
        }
      }
      delete this.settings.noticeRules;
      migrationNeeded = true;
    }

    for (const profileName in this.settings.profiles) {
      const profile = this.settings.profiles[profileName];
      if (!profile.noticeRules) {
        profile.noticeRules = { text: [], background: [] };
        migrationNeeded = true;
      }
    }

    if (migrationNeeded) {
      console.debug(
        'Theme Engine: Notice rules migration complete. Saving new settings structure.',
      );
      await this.saveData(this.settings);
    }

    if (!this.settings.installDate) {
      this.settings.installDate = new Date().toISOString();

      // Check the current Obsidian theme to set a smart default profile.
      const isDarkMode = document.body.classList.contains('theme-dark');
      if (isDarkMode) {
        this.settings.activeProfile = 'Default';
      } else {
        this.settings.activeProfile = 'Citrus Zest';
      }

      await this.saveData(this.settings);
    }
    if (!this.settings.pinnedSnapshots) {
      this.settings.pinnedSnapshots = {};
    }

    let snippetsMigrationNeeded = false;
    for (const profileName in this.settings.profiles) {
      const profile = this.settings.profiles[profileName];
      if (
        profile &&
        profile.snippets &&
        !Array.isArray(profile.snippets) &&
        typeof profile.snippets === 'object'
      ) {
        snippetsMigrationNeeded = true;
        const legacySnippets = profile.snippets as unknown as Record<string, LegacySnippetData>;
        const snippetsArray = Object.entries(legacySnippets).map(([name, data]) => ({
          id: `snippet-${Date.now()}-${Math.random()}`,
          name: name,
          css: data.css || '',
          enabled: data.enabled !== false,
        }));
        profile.snippets = snippetsArray;
      }
    }

    if (snippetsMigrationNeeded) {
      console.debug(
        'Theme Engine: The clipping data structure is being migrated to the new format (array).',
      );
      await this.saveData(this.settings);
    }

    let profileMigrationNeeded = false;
    for (const profileName in this.settings.profiles) {
      const profile = this.settings.profiles[profileName];
      // If background exists but enabled status is not set, default it to true
      if (profile && profile.backgroundPath && typeof profile.backgroundEnabled === 'undefined') {
        profile.backgroundEnabled = true;
        profileMigrationNeeded = true;
      }
      // If background doesn't exist, ensure enabled is false or undefined
      else if (profile && !profile.backgroundPath && profile.backgroundEnabled === true) {
        profile.backgroundEnabled = false;
        profileMigrationNeeded = true;
      }
    }
    if (profileMigrationNeeded) {
      console.debug('Theme Engine: Setting default backgroundEnabled status for profiles.');
      await this.saveData(this.settings); // Save changes if migration happened
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
    await this.applyStyles();
    await this.refreshOpenGraphViews();
    this.app.workspace.trigger('css-change');
  }

  async resetPluginData(options: {
    deleteProfiles: boolean;
    deleteSnippets: boolean;
    deleteSettings: boolean;
    deleteBackgrounds: boolean;
    deleteLanguages?: boolean;
  }) {
    const oldInstallDate = this.settings.installDate;

    // Deep clone defaults to ensure a clean slate before merging preserved data
    const newSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS)) as PluginSettings;

    // 1. Preserve Settings (if not deleting)
    if (!options.deleteSettings) {
      newSettings.language = this.settings.language;
      newSettings.useRtlLayout = this.settings.useRtlLayout;
      newSettings.overrideIconizeColors = this.settings.overrideIconizeColors;
      newSettings.cleanupInterval = this.settings.cleanupInterval;
      newSettings.colorUpdateFPS = this.settings.colorUpdateFPS;
      newSettings.lastSearchQuery = this.settings.lastSearchQuery;
      newSettings.lastScrollPosition = this.settings.lastScrollPosition;
      newSettings.advancedResetOptions = this.settings.advancedResetOptions;
    }

    // 2. Preserve Profiles
    if (!options.deleteProfiles) {
      newSettings.profiles = this.settings.profiles;
      newSettings.activeProfile = this.settings.activeProfile;
      newSettings.pinnedSnapshots = this.settings.pinnedSnapshots;
    }

    // 3. Preserve Snippets
    if (!options.deleteSnippets) {
      newSettings.globalSnippets = this.settings.globalSnippets;
    }

    // 4. Preserve Languages
    if (!options.deleteLanguages) {
      newSettings.customLanguages = this.settings.customLanguages;
    }

    // Edge Case: Deleting snippets but keeping profiles -> clear snippets from preserved profiles
    if (options.deleteSnippets && !options.deleteProfiles) {
      for (const profileName in newSettings.profiles) {
        if (newSettings.profiles[profileName]) {
          newSettings.profiles[profileName].snippets = [];
        }
      }
    }

    newSettings.installDate = oldInstallDate;

    // Reset specific settings if requested
    if (options.deleteSettings) {
      newSettings.advancedResetOptions = this.settings.advancedResetOptions;
      newSettings.language = 'auto';
    }

    this.settings = newSettings;
    await this.saveData(this.settings);

    console.debug('Theme Engine: Selective data reset complete.', options);

    // Handle File System operations (Backgrounds)
    if (options.deleteBackgrounds) {
      const backgroundsPath = `${this.app.vault.configDir}/backgrounds`;
      try {
        if (await this.app.vault.adapter.exists(backgroundsPath)) {
          console.debug('Theme Engine: Deleting backgrounds folder...');
          await this.app.vault.adapter.rmdir(backgroundsPath, true);
        }

        // If profiles are kept but backgrounds deleted, remove references from profiles
        if (!options.deleteProfiles) {
          for (const profileName in this.settings.profiles) {
            const profile = this.settings.profiles[profileName];
            if (profile) {
              profile.backgroundPath = undefined;
              profile.backgroundType = undefined;
            }
          }
          await this.saveData(this.settings);
        }
      } catch (folderError) {
        console.error(`Theme Engine: Error deleting backgrounds: ${folderError.message}`);
        new Notice(t('notices.deleteBackgroundsError', folderError.message));
      }
    }

    // UI Feedback & Reload
    const notice = new Notice(t('notices.resetSuccess'), 15000);
    const buttonContainer = notice.messageEl.createDiv({
      cls: 'modal-button-container',
    });
    new ButtonComponent(buttonContainer)
      .setButtonText(t('buttons.reload'))
      .setCta()
      .onClick(() => {
        const appWithCommands = this.app as typeof this.app & AppWithCommands;
        appWithCommands.commands.executeCommandById('app:reload');
      });
  }

  processNotice(el: HTMLElement) {
    // Prevent processing the same element multiple times
    if (!el || !el.classList || el.dataset.cmProcessed === 'true') return;

    // Extract text content (handle test keywords if present)
    let noticeText = (el.textContent || '').toLowerCase();
    const testKeywordEl = el.querySelector<HTMLElement>('.cm-test-keyword');
    if (testKeywordEl) {
      noticeText = (testKeywordEl.textContent || '').toLowerCase();
    }

    el.dataset.cmProcessed = 'true';

    try {
      const settings = this.settings;
      const activeProfile = settings.profiles[settings.activeProfile];
      if (!activeProfile) return;

      const liveRules = this.liveNoticeRules;
      const liveRuleType = this.liveNoticeRuleType;

      // --- 1. Background Rules (Base Style) ---
      const bgRules: NoticeRule[] =
        liveRuleType === 'background' && liveRules
          ? liveRules
          : activeProfile?.noticeRules?.background || [];

      let finalBgColor = activeProfile.vars['--cm-notice-bg-default'];

      for (const rule of bgRules) {
        if (!rule.keywords?.trim()) continue;
        const keywords = rule.keywords.toLowerCase();
        let match = false;

        if (rule.isRegex) {
          try {
            if (new RegExp(keywords, 'i').test(noticeText)) match = true;
          } catch {
            // ignore invalid regex
          }
        } else {
          // Optimize: Only process if keyword array isn't empty
          const keywordArray = keywords
            .split(',')
            .map((k: string) => k.trim())
            .filter(Boolean);
          if (keywordArray.length > 0) {
            const escaped = keywordArray.map((k: string) =>
              k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
            );
            // Enforce whole-word matching to avoid partial false positives
            if (new RegExp(`\\b(${escaped.join('|')})\\b`, 'i').test(noticeText)) {
              match = true;
            }
          }
        }

        if (match) {
          finalBgColor = rule.color;
          break; // Priority: First match wins
        }
      }

      if (finalBgColor) {
        el.dataset.cmNoticeBg = finalBgColor;
      }

      // --- 2. Text Rules (Split: Base Color vs. DOM Highlights) ---
      const textRules: NoticeRule[] =
        liveRuleType === 'text' && liveRules ? liveRules : activeProfile?.noticeRules?.text || [];

      let finalTextColor = activeProfile.vars['--cm-notice-text-default'];
      const highlightRules: NoticeRule[] = [];
      const fullColorRules: NoticeRule[] = [];

      // Pre-sort rules to avoid multiple iterations later
      for (const rule of textRules) {
        if (rule.highlightOnly) {
          highlightRules.push(rule);
        } else {
          fullColorRules.push(rule);
        }
      }

      // 2a. Apply Base Text Color
      for (const rule of fullColorRules) {
        if (!rule.keywords?.trim()) continue;
        const keywords = rule.keywords.toLowerCase();
        let match = false;

        if (rule.isRegex) {
          try {
            if (new RegExp(keywords, 'i').test(noticeText)) match = true;
          } catch {
            // ignore invalid regex
          }
        } else {
          const keywordArray = keywords
            .split(',')
            .map((k: string) => k.trim())
            .filter(Boolean);
          if (keywordArray.length > 0) {
            const escaped = keywordArray.map((k: string) =>
              k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
            );
            if (new RegExp(`\\b(${escaped.join('|')})\\b`, 'i').test(noticeText)) {
              match = true;
            }
          }
        }
        if (match) {
          finalTextColor = rule.color;
          break;
        }
      }

      if (finalTextColor) {
        el.dataset.cmNoticeText = finalTextColor;
      }

      // 2b. Apply Keyword Highlights (DOM Manipulation)
      if (highlightRules.length > 0) {
        const textNodes: Node[] = [];

        // Use TreeWalker to safely traverse text nodes without breaking nested HTML
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
          acceptNode: (node) => {
            return node.parentElement?.classList.contains('cm-keyword-highlight')
              ? NodeFilter.FILTER_REJECT // Skip already highlighted
              : NodeFilter.FILTER_ACCEPT;
          },
        });

        while (walker.nextNode()) textNodes.push(walker.currentNode);

        for (const node of textNodes) {
          const nodeContent = node.textContent;
          if (!nodeContent?.trim()) continue;

          const parent = node.parentElement;
          if (!parent) continue;

          // Collect all matches from all highlight rules
          const allMatches: { start: number; end: number; color: string }[] = [];

          for (const rule of highlightRules) {
            if (!rule.keywords?.trim()) continue;
            const color = rule.color;

            if (rule.isRegex) {
              try {
                const regex = new RegExp(rule.keywords, 'gi');
                let match;
                while ((match = regex.exec(nodeContent)) !== null) {
                  if (match[0].length === 0) break;
                  allMatches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    color,
                  });
                }
              } catch (e) {
                console.warn('Theme Engine: Invalid Regex in notice rule', e);
              }
            } else {
              const keywords = rule.keywords
                .split(',')
                .map((k: string) => k.trim())
                .filter(Boolean);
              if (keywords.length > 0) {
                const escaped = keywords.map((k: string) =>
                  k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                );
                const ruleRegex = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');
                let match;
                while ((match = ruleRegex.exec(nodeContent)) !== null) {
                  allMatches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    color,
                  });
                }
              }
            }
          }

          if (allMatches.length === 0) continue;

          // Sort and filter matches to prevent overlapping spans
          allMatches.sort((a, b) => a.start - b.start);
          const uniqueMatches = [];
          let currentEnd = -1;

          for (const match of allMatches) {
            if (match.start >= currentEnd) {
              uniqueMatches.push(match);
              currentEnd = match.end;
            }
          }

          if (uniqueMatches.length === 0) continue;

          // Rebuild DOM fragment with highlights
          const fragments = new DocumentFragment();
          let lastIndex = 0;

          for (const match of uniqueMatches) {
            if (match.start > lastIndex) {
              fragments.appendChild(
                document.createTextNode(nodeContent.substring(lastIndex, match.start)),
              );
            }
            const span = document.createElement('span');
            span.className = 'cm-keyword-highlight';
            span.setCssProps({ color: match.color });
            span.textContent = nodeContent.substring(match.start, match.end);
            fragments.appendChild(span);
            lastIndex = match.end;
          }

          if (lastIndex < nodeContent.length) {
            fragments.appendChild(document.createTextNode(nodeContent.substring(lastIndex)));
          }

          parent.replaceChild(fragments, node);
        }
      }

      this.updateNoticeStyles();
    } catch (e) {
      console.warn('Theme Engine: processNotice failed', e);
    }
  }

  updateNoticeStyles() {
    const styleId = 'cm-dynamic-notice-styles';

    const notices = document.querySelectorAll<HTMLElement>(
      '[data-cm-notice-bg], [data-cm-notice-text]',
    );
    if (notices.length === 0) {
      this.clearRuntimeStyle(styleId);
      return;
    }

    const cssRules: string[] = [];
    notices.forEach((notice, i) => {
      const uniqueId = notice.dataset.cmNoticeId || `cm-notice-${i}`;
      notice.dataset.cmNoticeId = uniqueId;

      const bgColor = notice.dataset.cmNoticeBg;
      const textColor = notice.dataset.cmNoticeText;

      let rule = `[data-cm-notice-id="${uniqueId}"] {`;
      if (bgColor) {
        rule += ` background-color: ${bgColor} !important;`;
      }
      if (textColor) {
        rule += ` color: ${textColor} !important;`;
      }
      rule += ' }';
      cssRules.push(rule);
    });

    this.setRuntimeStyle(styleId, cssRules.join('\n'));
  }

  /**
   * Pushes a new state to the history for a given CSS snippet/profile.
   * @param id - A unique identifier for the snippet or profile.
   * @param content - The new CSS content to save.
   */
  pushCssHistory(id: string, content: string) {
    if (!this.cssHistory[id]) {
      this.cssHistory[id] = { undoStack: [], redoStack: [] };
    }
    const history = this.cssHistory[id];
    const lastState = history.undoStack[history.undoStack.length - 1];

    // Only add to history if the content has actually changed
    if (lastState !== content) {
      history.undoStack.push(content);
      // When a new action is taken, the redo stack must be cleared
      history.redoStack = [];
    }
  }

  /**
   * Undoes the last change for a given ID and returns the previous state.
   * @param id - The unique identifier.
   * @returns The previous content, or null if no history.
   */
  undoCssHistory(id: string): string | null {
    const history = this.cssHistory[id];
    if (history && history.undoStack.length > 1) {
      const currentState = history.undoStack.pop()!;
      history.redoStack.push(currentState);
      return history.undoStack[history.undoStack.length - 1];
    }
    return null; // Can't undo the initial state
  }

  /**
   * Redoes the last undone change for a given ID.
   * @param id - The unique identifier.
   * @returns The next content, or null if no redo history.
   */
  redoCssHistory(id: string): string | null {
    const history = this.cssHistory[id];
    if (history && history.redoStack.length > 0) {
      const nextState = history.redoStack.pop()!;
      history.undoStack.push(nextState);
      return nextState;
    }
    return null;
  }

  // Downloads an image from a URL and sets it as the background.
  async setBackgroundMediaFromUrl(url: string) {
    if (!url) {
      new Notice(t('notices.backgroundUrlLoadError'));
      return;
    }
    try {
      const response = await requestUrl({ url });
      const arrayBuffer = response.arrayBuffer;

      // Extract filename, remove query params
      let fileName = url.split('/').pop();

      // Clean up potential query parameters
      if (fileName) {
        fileName = fileName.split('?')[0]; // Get image data as ArrayBuffer
      }

      // Generate fallback name if needed
      if (!fileName || fileName.indexOf('.') === -1 || fileName.length > 50) {
        const extension = response.headers['content-type']?.split('/')[1] || 'png';
        fileName = `image-${Date.now()}.${extension}`;
      }

      // Pass to main function
      await this.setBackgroundMedia(arrayBuffer, fileName, 'prompt');
    } catch (error) {
      new Notice(t('notices.backgroundUrlLoadError'));
      console.error('Theme Engine: Error fetching image from URL:', error);
    }
  }

  // Sets an existing media file as the active background.
  async selectBackgroundMedia(newPath: string, mediaType: 'image' | 'video') {
    const activeProfile = this.settings.profiles?.[this.settings.activeProfile];
    if (!activeProfile) return;

    // Set the new path and type in the settings
    activeProfile.backgroundPath = newPath;
    activeProfile.backgroundType = mediaType;
    activeProfile.backgroundEnabled = true;

    // Save settings (this will trigger applyBackgroundMedia to show it)
    await this.saveSettings();

    new Notice(t('notices.bgSet'));
  }

  // Renames a background file and updates ALL profiles using it.
  async renameBackgroundMedia(oldPath: string, newFullName: string): Promise<string | false> {
    const adapter = this.app.vault.adapter;

    // Validate name
    if (!newFullName || newFullName.includes('/') || newFullName.includes('\\')) {
      new Notice(t('notices.invalidFilename'));
      return false;
    }

    const pathParts = oldPath.split('/');
    const originalFileName = pathParts.pop() || '';
    const folderPath = pathParts.join('/');
    const newPath = `${folderPath}/${newFullName}`;
    const oldExtMatch = originalFileName.match(/\.([a-zA-Z0-9]+)$/);
    const oldExt = oldExtMatch ? oldExtMatch[0] : '';

    if (oldExt && !newFullName.toLowerCase().endsWith(oldExt.toLowerCase())) {
      console.warn(
        `Theme Engine: Rename blocked. Attempted to change extension from "${oldExt}" in "${newFullName}".`,
      );
      new Notice(t('notices.invalidFilename') + ' (Extension mismatch)');
      return false;
    }

    // Prevent overwriting *different* existing file
    if (await adapter.exists(newPath)) {
      if (oldPath.toLowerCase() !== newPath.toLowerCase()) {
        new Notice(t('notices.filenameExists', newFullName));
        return false;
      }
    }

    // Attempt rename
    try {
      await adapter.rename(oldPath, newPath);

      // Update the path in ALL profiles that were using the old path
      let settingsChanged = false;
      for (const profileName in this.settings.profiles) {
        const profile = this.settings.profiles[profileName];
        if (profile && profile.backgroundPath === oldPath) {
          profile.backgroundPath = newPath;
          settingsChanged = true;
        }
      }

      if (settingsChanged) {
        await this.saveSettings();
      }

      new Notice(t('notices.renameSuccess', newFullName));
      return newPath;
    } catch (error) {
      new Notice(t('notices.renameError'));
      console.error('Theme Engine: Error renaming background image:', error);
      return false;
    }
  }

  /**
   * Temporarily strips plugin styles to snapshot the underlying theme's CSS variables.
   * Essential for determining base theme defaults.
   */
  async captureCurrentComputedVars(): Promise<Record<string, string>> {
    console.debug('Theme Engine: Capturing current computed styles...');

    // 1. Flush plugin overrides and await repaint to expose base theme
    this.clearStyles();
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const capturedVars: Record<string, string> = {};
    const flatDefaultVars = flattenVars(DEFAULT_VARS);
    const allVarKeys = Object.keys(flatDefaultVars);

    const bodyStyles = getComputedStyle(document.body);

    // Heuristic: Only treat a variable as a color if its internal default definition is color-like.
    const isColorRegex =
      /^(#|rgb|hsl|transparent|var\(--)|(white|black|red|blue|green|yellow|orange|purple|cyan|magenta)$/i;

    for (const varName of allVarKeys) {
      const computedValue = bodyStyles.getPropertyValue(varName).trim();
      const defaultValue = flatDefaultVars[varName] || '';

      if (computedValue) {
        if (isColorRegex.test(defaultValue)) {
          // Standardize computed values (often rgb()) to Hex for UI consistency
          try {
            capturedVars[varName] = convertColorToHex(computedValue);
          } catch (e) {
            console.warn(`Failed to convert color ${varName}: ${computedValue}`, e);
            capturedVars[varName] = computedValue;
          }
        } else {
          capturedVars[varName] = computedValue;
        }
      }
    }

    console.debug(`Theme Engine: Captured ${Object.keys(capturedVars).length} variables.`);

    // 2. Restore plugin state
    void this.applyStyles();
    await new Promise((resolve) => requestAnimationFrame(resolve));

    return capturedVars;
  }

  /**
   * Memoized wrapper for captureCurrentComputedVars.
   * Prevents UI flickering by caching defaults until theme mode (dark/light) changes.
   */
  async getThemeDefaults(): Promise<Record<string, string>> {
    const currentThemeMode = document.body.classList.contains('theme-dark') ? 'dark' : 'light';

    if (this.cachedThemeDefaults && this.lastCachedThemeMode === currentThemeMode) {
      return this.cachedThemeDefaults;
    }

    console.debug('Theme Engine: Cache miss or theme change. Refreshing defaults...');

    const newDefaults = await this.captureCurrentComputedVars();

    this.cachedThemeDefaults = newDefaults;
    this.lastCachedThemeMode = currentThemeMode;

    return newDefaults;
  }
}
