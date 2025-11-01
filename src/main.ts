/*
 * Color Master - Obsidian Plugin
 * Version: 1.1.1
 * Author: Yazan Ammar (GitHub : https://github.com/YazanAmmar )
 * Description: Provides a comprehensive UI to control all Obsidian CSS color variables directly,
 * removing the need for Force Mode and expanding customization options.
 */
import { ButtonComponent, moment, Notice, Plugin, requestUrl } from "obsidian";
import { registerCommands } from "./commands";
import {
  DEFAULT_SETTINGS,
  DEFAULT_VARS,
  BUILT_IN_PROFILES_VARS,
} from "./constants";
import { initializeT, t } from "./i18n/strings";
import { PluginSettings } from "./types";
import { ColorMasterSettingTab } from "./ui/settingsTab";
import {
  flattenVars,
  findNextAvailablePath,
  maybeConvertToJpg,
  isIconizeEnabled,
} from "./utils";
import { FileConflictModal } from "./ui/modals";

let T: ColorMaster;

export default class ColorMaster extends Plugin {
  settings: PluginSettings;
  iconizeWatcherInterval: number | null = null;
  colorUpdateInterval: number | null = null;
  pendingVarUpdates: Record<string, string> = {};
  settingTabInstance: ColorMasterSettingTab | null = null;
  liveNoticeRules: any[] | null = null;
  liveNoticeRuleType: "text" | "background" | null = null;
  iconizeObserver: MutationObserver;
  noticeObserver: MutationObserver;
  cssHistory: Record<string, { undoStack: string[]; redoStack: string[] }> = {};

  startColorUpdateLoop() {
    this.stopColorUpdateLoop();

    const fps = this.settings.colorUpdateFPS;
    if (!this.settings.pluginEnabled || !fps || fps <= 0) {
      return; // Stop if disabled or FPS is 0
    }

    const intervalMs = 1000 / fps;
    this.colorUpdateInterval = window.setInterval(() => {
      const pendingKeys = Object.keys(this.pendingVarUpdates);
      if (pendingKeys.length === 0) return; // Do nothing if the box is empty

      for (const varName of pendingKeys) {
        document.body.style.setProperty(
          varName,
          this.pendingVarUpdates[varName]
        );
      }

      this.pendingVarUpdates = {}; // Empty the box after applying

      // Trigger updates for Graph View and accessibility checkers
      this.app.workspace.trigger("css-change");

      if (this.settingTabInstance) {
        this.settingTabInstance?.updateAccessibilityCheckers();
      }
      // ensure iconize icons update live using current computed var
      try {
        this.forceIconizeColors();
      } catch (e) {
        console.warn("forceIconizeColors failed in update loop", e);
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

  // Removes background image CSS variable and body classes.
  _clearBackgroundMedia() {
    document.body.style.removeProperty("--cm-background-image");
    document.body.classList.remove("cm-workspace-background-active");
    document.body.classList.remove("cm-settings-background-active");

    // Delete any old video
    const oldVideo = document.getElementById("cm-background-video");
    if (oldVideo) oldVideo.remove();
  }

  async applyTransparencyToVars(): Promise<boolean> {
    const profile = this.settings.profiles?.[this.settings.activeProfile];
    if (!profile) return false;

    const activeProfileName = this.settings.activeProfile;
    const profileOriginalVars =
      BUILT_IN_PROFILES_VARS[
        activeProfileName as keyof typeof BUILT_IN_PROFILES_VARS
      ];
    const baseVars = profileOriginalVars || BUILT_IN_PROFILES_VARS.Default;

    const varsToMakeTransparent = [
      "--background-primary",
      "--background-secondary",
      "--background-modifier-border",
      "--titlebar-background-focused",
      "--background-modifier-hover",
    ];

    let settingsChanged = false;
    for (const varName of varsToMakeTransparent) {
      if (profile.vars[varName] !== "transparent") {
        const defaultValue = baseVars[varName as keyof typeof baseVars];
        if (!profile.vars[varName] || profile.vars[varName] === defaultValue) {
          profile.vars[varName] = "transparent";
          settingsChanged = true;
          if (this.settings.colorUpdateFPS > 0) {
            this.pendingVarUpdates[varName] = "transparent";
          }
        }
      }
    }

    if (settingsChanged) {
      await this.saveData(this.settings);
      if (
        this.settingTabInstance &&
        this.settingTabInstance.containerEl.offsetHeight > 0
      ) {
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
    if (
      !profile ||
      profile.backgroundEnabled === false ||
      !profile.backgroundPath
    ) {
      if (profile && profile.backgroundEnabled === false) {
        await this._restoreDefaultBackgroundVars();
      }
      return;
    }

    // 3. Apply transparency
    await this.applyTransparencyToVars();

    const path = profile.backgroundPath;
    const type = profile.backgroundType;
    if (type === "image") {
      const imageUrl = this.app.vault.adapter.getResourcePath(path);
      document.body.style.setProperty(
        "--cm-background-image",
        `url("${imageUrl}")`
      );
      document.body.classList.add("cm-workspace-background-active");
    } else if (type === "video") {
      const videoUrl = this.app.vault.adapter.getResourcePath(path);

      let videoEl = document.getElementById(
        "cm-background-video"
      ) as HTMLVideoElement;
      if (!videoEl) {
        videoEl = document.createElement("video");
        videoEl.id = "cm-background-video";
        document.body.appendChild(videoEl);
      }

      videoEl.src = videoUrl;
      videoEl.autoplay = true;
      videoEl.loop = true;
      videoEl.muted = profile.videoMuted !== false;
      videoEl.playsInline = true;
      videoEl.style.opacity = (profile.videoOpacity || 0.5).toString(); // Apply transparency
      videoEl.load();
      document.body.classList.add("cm-workspace-background-active");
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
      BUILT_IN_PROFILES_VARS[
        activeProfileName as keyof typeof BUILT_IN_PROFILES_VARS
      ];
    const baseVars = profileOriginalVars || BUILT_IN_PROFILES_VARS.Default;

    // List of variables to check and potentially restore
    const varsToRestore = [
      "--background-primary",
      "--background-secondary",
      "--background-modifier-border",
      "--titlebar-background-focused",
      "--background-modifier-hover",
    ];

    let settingsRestored = false;
    for (const varName of varsToRestore) {
      // Only restore if currently 'transparent'
      if (profile.vars[varName] === "transparent") {
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
      if (
        this.settingTabInstance &&
        this.settingTabInstance.containerEl.offsetHeight > 0
      ) {
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
    const backgroundsPath = ".obsidian/backgrounds";
    try {
      // Check if the folder does NOT exist
      if (!(await this.app.vault.adapter.exists(backgroundsPath))) {
        // Create the folder if it's missing
        await this.app.vault.adapter.mkdir(backgroundsPath);
        console.log(
          "Color Master: Created global backgrounds folder at .obsidian/backgrounds"
        );
      }
    } catch (error) {
      console.error(
        "Color Master: Failed to create backgrounds folder on startup.",
        error
      );
    }
  }

  // This function now deletes the file AND clears the path from ALL profiles using it.
  async removeBackgroundMediaByPath(pathToDelete: string) {
    if (!pathToDelete) return;

    // 1. Clear the path from all profiles that use it
    let settingsChanged = false;
    for (const profileName in this.settings.profiles) {
      const profile = this.settings.profiles[profileName];
      if (profile.backgroundPath === pathToDelete) {
        profile.backgroundPath = "";
        profile.backgroundType = undefined;
        // Also disable background if we remove it
        profile.backgroundEnabled = false;
        settingsChanged = true;
      }
    }

    // 2. Restore default vars for the active profile if it was affected
    const activeProfile = this.settings.profiles[this.settings.activeProfile];
    if (activeProfile.backgroundPath === "") {
      await this._restoreDefaultBackgroundVars();
    }

    // 3. Try to delete the actual file
    try {
      if (await this.app.vault.adapter.exists(pathToDelete)) {
        await this.app.vault.adapter.remove(pathToDelete);
      }
    } catch (error) {
      console.warn(
        `Color Master: Could not delete background file '${pathToDelete}'.`,
        error
      );
    }

    if (settingsChanged) {
      await this.saveSettings();
    }

    // Refresh settings tab UI
    if (this.settingTabInstance) {
      this.settingTabInstance.display();
    }
  }

  // Adds or replaces a background image file in the global folder.
  async setBackgroundMedia(
    arrayBuffer: ArrayBuffer,
    fileName: string,
    conflictChoice: "replace" | "keep" | "prompt" = "prompt"
  ) {
    const activeProfile = this.settings.profiles?.[this.settings.activeProfile];
    if (!activeProfile) return;

    const { arrayBuffer: finalArrayBuffer, fileName: finalFileName } =
      await maybeConvertToJpg(activeProfile, arrayBuffer, fileName);

    const fileExt = finalFileName.split(".").pop()?.toLowerCase();
    const mediaType: "image" | "video" =
      fileExt === "mp4" || fileExt === "webm" ? "video" : "image";

    const backgroundsPath = `.obsidian/backgrounds`;

    let targetPath = `${backgroundsPath}/${finalFileName}`; // Use finalFileName

    // 1. Ensure folder exists
    try {
      if (!(await this.app.vault.adapter.exists(backgroundsPath))) {
        await this.app.vault.adapter.mkdir(backgroundsPath);
      }

      const fileExists = await this.app.vault.adapter.exists(targetPath);

      // 2. Resolve conflicts if file exists
      if (fileExists && conflictChoice === "prompt") {
        new FileConflictModal(
          this.app,
          this,
          finalArrayBuffer,
          finalFileName,
          async (choice) => {
            await this.setBackgroundMedia(
              finalArrayBuffer,
              finalFileName,
              choice
            );
          }
        ).open();
        return;
      }

      if (fileExists && conflictChoice === "keep") {
        targetPath = await findNextAvailablePath(
          this.app.vault.adapter,
          targetPath
        );
      }
      if (fileExists && conflictChoice === "replace") {
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
      new Notice(t("notices.bgSet"));

      // 6. Cleanup previous file if replacing original name and paths differ
      if (
        oldImagePath &&
        oldImagePath !== targetPath &&
        conflictChoice === "replace" // Only delete if 'replace'
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
      new Notice(t("notices.backgroundLoadError"));
      console.error("Color Master: Error setting background media:", error);
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

      const el = document.createElement("style");
      el.id = `cm-custom-css-for-profile`;
      el.textContent = profile.customCss;
      document.head.appendChild(el);
    } catch (e) {
      console.warn("applyCustomCssForProfile failed", e);
    }
  }

  removeInjectedCustomCss() {
    try {
      const oldStyle = document.getElementById("cm-custom-css-for-profile");
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
    const profileSnippets = Array.isArray(activeProfile.snippets)
      ? activeProfile.snippets
      : [];

    const allSnippets = [...globalSnippets, ...profileSnippets].filter(Boolean);

    const enabledCss = allSnippets
      .filter((s) => s.enabled && s.css)
      .map((s) => {
        const upgradedCss = s.css.replace(
          /\bbody\s*(?=\{)/g,
          "body.theme-dark, body.theme-light"
        );
        return `/* Snippet: ${s.name} ${
          s.isGlobal ? "(Global)" : ""
        } */\n${upgradedCss}`;
      })
      .join("\n\n");

    if (enabledCss) {
      const el = document.createElement("style");
      el.id = "cm-css-snippets";
      el.textContent = enabledCss;
      document.head.appendChild(el);
    }
  }

  removeCssSnippets() {
    const el = document.getElementById("cm-css-snippets");
    if (el) el.remove();
  }

  // New method to apply pending changes instantly
  applyPendingNow() {
    try {
      const pending = this.pendingVarUpdates || {};
      const keys = Object.keys(pending);
      if (keys.length === 0) {
        // If nothing is pending, still trigger a repaint for safety
        this.app.workspace.trigger("css-change");
        window.dispatchEvent(new Event("resize"));
        return;
      }

      // Apply all pending CSS properties
      for (const k of keys) {
        document.body.style.setProperty(k, pending[k]);
      }

      // Clear pending updates
      this.pendingVarUpdates = {};

      // Notify Obsidian and other components to update
      this.app.workspace.trigger("css-change");
      this.forceIconizeColors();

      // Force graph view to repaint by dispatching a resize event
      window.dispatchEvent(new Event("resize"));
    } catch (e) {
      console.error("Color Master: applyPendingNow failed", e);
    }
  }

  pinProfileSnapshot(profileName: string) {
    if (!profileName) profileName = this.settings.activeProfile;
    this.settings.pinnedSnapshots = this.settings.pinnedSnapshots || {};
    const profile = this.settings.profiles?.[profileName];
    if (!profile) {
      new Notice(t("notices.profileNotFound"));
      return;
    }

    const snapshotData = {
      vars: JSON.parse(JSON.stringify(profile.vars || {})),
      customCss: profile.customCss || "",
      snippets: JSON.parse(JSON.stringify(profile.snippets || {})),
      noticeRules: JSON.parse(
        JSON.stringify(profile.noticeRules || { text: [], background: [] })
      ),
    };

    this.settings.pinnedSnapshots[profileName] = {
      pinnedAt: new Date().toISOString(),
      ...snapshotData,
    };
    return this.saveSettings();
  }

  async resetProfileToPinned(profileName: string): Promise<void> {
    if (!profileName) profileName = this.settings.activeProfile;
    const snap = this.settings.pinnedSnapshots?.[profileName];
    if (!snap || !snap.vars) {
      new Notice(t("notices.noPinnedSnapshot"));
      return;
    }

    const activeProfile = this.settings.profiles[profileName];
    if (!activeProfile) {
      new Notice(t("notices.profileNotFound"));
      return;
    }

    activeProfile.vars = JSON.parse(JSON.stringify(snap.vars));
    activeProfile.customCss = snap.customCss || "";
    activeProfile.snippets = snap.snippets
      ? JSON.parse(JSON.stringify(snap.snippets))
      : {};
    activeProfile.noticeRules = snap.noticeRules
      ? JSON.parse(JSON.stringify(snap.noticeRules))
      : { text: [], background: [] };

    Object.keys(snap.vars).forEach((k) => {
      this.pendingVarUpdates[k] = snap.vars[k];
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
    initializeT(this);
    T = this;
    await this.loadSettings();
    await this._ensureBackgroundsFolderExists();
    this.liveNoticeRules = null;
    this.liveNoticeRuleType = null;
    if (this.settings.language === "auto") {
      const obsidianLang = moment.locale();
      if (obsidianLang === "ar") {
        this.settings.language = "ar"; // If it is Arabic, we will designate it as Arabic.
      } else {
        this.settings.language = "en"; // For any other language, we set it to English.
      }
      await this.saveSettings();
    }

    T = this;
    registerCommands(this);

    // Add a ribbon icon to the left gutter
    this.addRibbonIcon(
      "paint-bucket",
      t("plugin.ribbonTooltip"),
      (evt: MouseEvent) => {
        // Open the settings tab when the icon is clicked
        (this.app as any).setting.open();
        (this.app as any).setting.openTabById(this.manifest.id);
      }
    );

    // Store a reference to the settings tab and add it
    this.settingTabInstance = new ColorMasterSettingTab(this.app, this);
    this.addSettingTab(this.settingTabInstance);

    this.app.workspace.onLayoutReady(() => {
      this.applyStyles();
      setTimeout(() => this.app.workspace.trigger("css-change"), 100);

      // Start the update engine
      this.startColorUpdateLoop();
      this.iconizeObserver = new MutationObserver(() => {
        if (
          this.settings.pluginEnabled &&
          this.settings.overrideIconizeColors
        ) {
          this.forceIconizeColors();
        }
      });

      this.noticeObserver = new MutationObserver((mutations) => {
        if (!this.settings.pluginEnabled) return;
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType !== 1) return;

            if ((node as Element).matches(".notice, .toast")) {
              this.processNotice(node as HTMLElement);
            }
            (node as Element)
              .querySelectorAll(".notice, .toast")
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

  async onunload() {
    if (this.noticeObserver) this.noticeObserver.disconnect();
    if (this.iconizeObserver) this.iconizeObserver.disconnect();

    if (this.settings) {
      this.settings.lastSearchQuery = "";
      this.settings.lastScrollPosition = 0;
      await this.saveData(this.settings);
    }

    this.clearStyles();
    this.removeInjectedCustomCss();
    this.stopColorUpdateLoop();
    this._clearBackgroundMedia();
    console.log("Color Master v1.1.1 unloaded.");
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
      console.log("Color Master Observers: Enabled");
    } catch (e) {
      console.error("Color Master: Failed to enable observers", e);
    }
  }

  public disableObservers(): void {
    try {
      this.iconizeObserver.disconnect();
      this.noticeObserver.disconnect();
      console.log("Color Master Observers: Disabled");
    } catch (e) {
      console.error("Color Master: Failed to disable observers", e);
    }
  }

  async refreshOpenGraphViews() {
    const graphLeaves = this.app.workspace.getLeavesOfType("graph");
    if (graphLeaves.length === 0) {
      return;
    }

    console.log(
      `Color Master: Found ${graphLeaves.length} graph(s). Applying Plan C (programmatic rebuild).`
    );

    for (const leaf of graphLeaves) {
      const currentState = leaf.getViewState();

      await leaf.setViewState({
        ...currentState,
        type: "graph",
        state: { ...currentState.state },
      });
    }
  }

  forceIconizeColors() {
    // read the *computed* CSS var first (this covers live-preview via pendingVarUpdates)
    let computedIconizeColor = null;
    try {
      const cssVal = getComputedStyle(document.body).getPropertyValue(
        "--iconize-icon-color"
      );
      if (cssVal) computedIconizeColor = cssVal.trim();
    } catch (e) {
      console.warn(
        "Color Master: failed to read computed --iconize-icon-color",
        e
      );
      computedIconizeColor = null;
    }

    // fallback to stored profile value if computed is empty
    const storedIconizeColor =
      this.settings.profiles?.[this.settings.activeProfile]?.vars?.[
        "--iconize-icon-color"
      ];

    const iconizeColor = this.settings.overrideIconizeColors
      ? computedIconizeColor || storedIconizeColor || null
      : null;

    // Iterate over elements that Iconize marks (keep the original safe logic)
    document.querySelectorAll(".iconize-icon").forEach((iconNode) => {
      const svg = iconNode.querySelector("svg");
      if (!svg) return;

      [svg, ...svg.querySelectorAll("*")].forEach((el: any) => {
        if (typeof el.hasAttribute !== "function") return;

        if (!iconizeColor) {
          // remove inline overrides to let theme/defaults show
          el.style.fill = "";
          el.style.stroke = "";
          return;
        }

        const originalFill = el.getAttribute("fill");
        const originalStroke = el.getAttribute("stroke");

        // apply with !important so plugin/theme inline styles are overridden
        if (
          originalFill &&
          originalFill !== "none" &&
          !originalFill.startsWith("url(")
        ) {
          try {
            el.style.setProperty("fill", iconizeColor, "important");
          } catch (e) {
            el.style.fill = iconizeColor;
          }
        }

        if (originalStroke && originalStroke !== "none") {
          try {
            el.style.setProperty("stroke", iconizeColor, "important");
          } catch (e) {
            el.style.stroke = iconizeColor;
          }
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
      console.log(
        "Color Master: Iconize plugin not found. Disabling override setting."
      );
      this.settings.overrideIconizeColors = false;
      settingsChanged = true;
    }

    // Find all elements with the .iconize-icon class and check if they have content.
    const orphanedIcons = document.querySelectorAll(".iconize-icon");

    if (orphanedIcons.length > 0) {
      console.log(
        `Color Master: Found ${orphanedIcons.length} orphaned Iconize elements. Cleaning up...`
      );
      orphanedIcons.forEach((icon) => icon.remove());
    }

    if (settingsChanged) {
      this.saveSettings();
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
      console.error("Color Master: Active profile not found!");
      return;
    }

    const profileVars = Object.entries(profile.vars);
    if (profileVars.length > 0) {
      const cssString = `body.theme-dark, body.theme-light {
    ${profileVars
      .map(([key, value]) => `${key}: ${value};`)
      .join("\n            ")}
}`;

      const styleEl = document.createElement("style");
      styleEl.id = "cm-profile-variables";
      styleEl.textContent = cssString;

      document.head.appendChild(styleEl);
    }

    this.forceIconizeColors();
    setTimeout(() => this.forceIconizeColors(), 100);

    const themeType = profile.themeType || "auto";

    if (themeType === "dark") {
      document.body.classList.remove("theme-light");
      document.body.classList.add("theme-dark");
    } else if (themeType === "light") {
      document.body.classList.remove("theme-dark");
      document.body.classList.add("theme-light");
    }
    this.applyCustomCssForProfile(this.settings.activeProfile);
    this.applyCssSnippets();
    // Add/Remove body class for RTL notices
    if (this.settings.language === "ar" || this.settings.language === "fa") {
      document.body.classList.add("color-master-rtl");
    } else {
      document.body.classList.remove("color-master-rtl");
    }
    await this.applyBackgroundMedia();
  }

  clearStyles() {
    const profileStyleEl = document.getElementById("cm-profile-variables");
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
      document.body.style.removeProperty(key);
    });

    document.querySelectorAll(".iconize-icon").forEach((iconNode) => {
      const svg = iconNode.querySelector("svg");
      if (!svg) return;

      [svg, ...svg.querySelectorAll("*")].forEach((el: any) => {
        if (typeof el.hasAttribute !== "function") return;

        el.style.removeProperty("fill");
        el.style.removeProperty("stroke");
      });
    });

    const styleId = "color-master-overrides";
    const overrideStyleEl = document.getElementById(styleId);
    if (overrideStyleEl) {
      overrideStyleEl.remove();
    }
    this.app.workspace.trigger("css-change");
    document.body.classList.remove("color-master-rtl");
    this._clearBackgroundMedia();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

    let migrationNeeded = false;
    if (
      this.settings.noticeRules &&
      Object.keys(this.settings.profiles || {}).length > 0
    ) {
      console.log(
        "Color Master: Detected old global notice rules. Starting migration..."
      );
      for (const profileName in this.settings.profiles) {
        const profile = this.settings.profiles[profileName];
        if (!profile.noticeRules) {
          profile.noticeRules = JSON.parse(
            JSON.stringify(this.settings.noticeRules)
          );
        }
      }
      delete (this.settings as any).noticeRules;
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
      console.log(
        "Color Master: Notice rules migration complete. Saving new settings structure."
      );
      await this.saveData(this.settings);
    }

    if (!this.settings.installDate) {
      this.settings.installDate = new Date().toISOString();

      // Check the current Obsidian theme to set a smart default profile.
      const isDarkMode = document.body.classList.contains("theme-dark");
      if (isDarkMode) {
        this.settings.activeProfile = "Default";
      } else {
        this.settings.activeProfile = "Citrus Zest";
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
        typeof profile.snippets === "object"
      ) {
        snippetsMigrationNeeded = true;
        const snippetsArray = Object.entries(profile.snippets).map(
          ([name, data]: [string, any]) => ({
            id: `snippet-${Date.now()}-${Math.random()}`,
            name: name,
            css: data.css || "",
            enabled: data.enabled !== false,
          })
        );
        profile.snippets = snippetsArray;
      }
    }

    if (snippetsMigrationNeeded) {
      console.log(
        "Color Master: The clipping data structure is being migrated to the new format (array)."
      );
      await this.saveData(this.settings);
    }

    let profileMigrationNeeded = false;
    for (const profileName in this.settings.profiles) {
      const profile = this.settings.profiles[profileName];
      // If background exists but enabled status is not set, default it to true
      if (
        profile &&
        profile.backgroundPath &&
        typeof profile.backgroundEnabled === "undefined"
      ) {
        profile.backgroundEnabled = true;
        profileMigrationNeeded = true;
      }
      // If background doesn't exist, ensure enabled is false or undefined
      else if (
        profile &&
        !profile.backgroundPath &&
        profile.backgroundEnabled === true
      ) {
        profile.backgroundEnabled = false;
        profileMigrationNeeded = true;
      }
    }
    if (profileMigrationNeeded) {
      console.log(
        "Color Master: Setting default backgroundEnabled status for profiles."
      );
      await this.saveData(this.settings); // Save changes if migration happened
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
    await this.applyStyles();
    await this.refreshOpenGraphViews();
    this.app.workspace.trigger("css-change");
  }

  async resetPluginData() {
    // Keep important data first
    const oldInstallDate = this.settings.installDate;
    const oldLanguage = this.settings.language;
    const oldRtl = this.settings.useRtlLayout;

    const backgroundsPath = ".obsidian/backgrounds";
    let dataReset = false;

    try {
      // 1. Make a new copy of the default settings
      this.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));

      // 2. Return the data we want to preserve
      this.settings.installDate = oldInstallDate;
      this.settings.language = oldLanguage;
      this.settings.useRtlLayout = oldRtl;

      // 3. Save new settings (default + saved data)
      await this.saveData(this.settings);
      dataReset = true;
      console.log(
        "Color Master: Settings object reset to default, preserving installDate and language."
      );

      // 4. Show reload notification
      if (dataReset) {
        const notice = new Notice(t("notices.resetSuccess"), 0);
        const noticeEl = notice.noticeEl;
        const buttonContainer = noticeEl.createDiv({
          cls: "modal-button-container",
        });
        new ButtonComponent(buttonContainer)
          .setButtonText(t("buttons.reload"))
          .setCta()
          .onClick(() => {
            (this.app as any).commands.executeCommandById("app:reload");
          });
      } else {
        new Notice("Failed to reset plugin settings.");
        return;
      }

      // 5. Delete the backgrounds folder
      try {
        if (await this.app.vault.adapter.exists(backgroundsPath)) {
          console.log(
            "Color Master: Attempting to delete backgrounds folder..."
          );
          await this.app.vault.adapter.rmdir(backgroundsPath, true);
          console.log(
            "Color Master: Backgrounds folder deleted successfully (or was already gone)."
          );
        }
      } catch (folderError) {
        // Specifically ignore EBUSY or similar errors during folder removal
        if (folderError.code === "EBUSY") {
          console.warn(
            `Color Master: Could not delete backgrounds folder due to EBUSY. It will be ignored after reload. Path: ${backgroundsPath}`
          );
        } else {
          console.error(
            `Color Master: Unexpected error deleting backgrounds folder: ${folderError.message}`,
            folderError
          );
        }
      }
    } catch (dataError) {
      new Notice(`Failed to reset plugin data: ${dataError.message}`);
      console.error(
        "Color Master: Failed to reset plugin settings object.",
        dataError
      );
    }
  }

  processNotice(el: HTMLElement) {
    let noticeText = (el.textContent || "").toLowerCase();
    const testKeywordEl = el.querySelector(".cm-test-keyword") as HTMLElement;

    if (testKeywordEl) {
      noticeText = (testKeywordEl.textContent || "").toLowerCase();
    }
    if (!el || !el.classList || el.dataset.cmProcessed === "true") return;

    el.dataset.cmProcessed = "true";

    try {
      const settings = this.settings;
      const activeProfile = settings.profiles[settings.activeProfile];

      if (!activeProfile) return;

      const liveRules = this.liveNoticeRules;
      const liveRuleType = this.liveNoticeRuleType;

      const bgRules =
        liveRuleType === "background" && liveRules
          ? liveRules
          : activeProfile?.noticeRules?.background || [];

      const textRules =
        liveRuleType === "text" && liveRules
          ? liveRules
          : activeProfile?.noticeRules?.text || [];

      let finalBgColor = activeProfile.vars["--cm-notice-bg-default"];
      let finalTextColor = activeProfile.vars["--cm-notice-text-default"];

      for (const rule of bgRules) {
        if (!rule.keywords || !rule.keywords.trim()) continue;
        const keywords = (rule.keywords || "").toLowerCase();
        let match = false;

        if (rule.isRegex) {
          try {
            const regex = new RegExp(keywords, "i");
            if (regex.test(noticeText)) match = true;
          } catch (e) {}
        } else {
          const keywordArray = keywords
            .split(",")
            .map((k: string) => k.trim())
            .filter(Boolean);
          for (const keyword of keywordArray) {
            if (noticeText.includes(keyword)) {
              match = true;
              break;
            }
          }
        }
        if (match) {
          finalBgColor = rule.color;
          break;
        }
      }

      for (const rule of textRules) {
        if (!rule.keywords || !rule.keywords.trim()) continue;
        const keywords = (rule.keywords || "").toLowerCase();
        let match = false;

        if (rule.isRegex) {
          try {
            const regex = new RegExp(keywords, "i");
            if (regex.test(noticeText)) match = true;
          } catch (e) {}
        } else {
          const keywordArray = keywords
            .split(",")
            .map((k: string) => k.trim())
            .filter(Boolean);
          for (const keyword of keywordArray) {
            if (noticeText.includes(keyword)) {
              match = true;
              break;
            }
          }
        }

        if (match) {
          finalTextColor = rule.color;
          break;
        }
      }

      if (finalBgColor) {
        el.dataset.cmNoticeBg = finalBgColor;
      }
      if (finalTextColor) {
        el.dataset.cmNoticeText = finalTextColor;
      }
      this.updateNoticeStyles();
    } catch (e) {
      console.warn("Color Master: processNotice failed", e);
    }
  }

  updateNoticeStyles() {
    const styleId = "cm-dynamic-notice-styles";
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

    const notices = document.querySelectorAll<HTMLElement>(
      "[data-cm-notice-bg], [data-cm-notice-text]"
    );
    if (notices.length === 0) {
      if (styleEl) styleEl.remove();
      return;
    }

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
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
      rule += " }";
      cssRules.push(rule);
    });

    styleEl.textContent = cssRules.join("\n");
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
      new Notice(t("notices.backgroundUrlLoadError"));
      return;
    }
    try {
      const response = await requestUrl({ url });
      const arrayBuffer = response.arrayBuffer;

      // Extract filename, remove query params
      let fileName = url.split("/").pop();

      // Clean up potential query parameters
      if (fileName) {
        fileName = fileName.split("?")[0]; // Get image data as ArrayBuffer
      }

      // Generate fallback name if needed
      if (!fileName || fileName.indexOf(".") === -1 || fileName.length > 50) {
        const extension =
          response.headers["content-type"]?.split("/")[1] || "png";
        fileName = `image-${Date.now()}.${extension}`;
      }

      // Pass to main function
      await this.setBackgroundMedia(arrayBuffer, fileName, "prompt");
    } catch (error) {
      new Notice(t("notices.backgroundUrlLoadError"));
      console.error("Color Master: Error fetching image from URL:", error);
    }
  }

  // Sets an existing media file as the active background.
  async selectBackgroundMedia(newPath: string, mediaType: "image" | "video") {
    const activeProfile = this.settings.profiles?.[this.settings.activeProfile];
    if (!activeProfile) return;

    // Set the new path and type in the settings
    activeProfile.backgroundPath = newPath;
    activeProfile.backgroundType = mediaType;
    activeProfile.backgroundEnabled = true;

    // Save settings (this will trigger applyBackgroundMedia to show it)
    await this.saveSettings();

    new Notice(t("notices.bgSet"));
  }

  // Renames a background file and updates ALL profiles using it.
  async renameBackgroundMedia(
    oldPath: string,
    newFullName: string
  ): Promise<string | false> {
    const adapter = this.app.vault.adapter;

    // Validate name
    if (
      !newFullName ||
      newFullName.includes("/") ||
      newFullName.includes("\\")
    ) {
      new Notice(t("notices.invalidFilename"));
      return false;
    }

    const pathParts = oldPath.split("/");
    const originalFileName = pathParts.pop() || "";
    const folderPath = pathParts.join("/");
    const newPath = `${folderPath}/${newFullName}`;
    const oldExtMatch = originalFileName.match(/\.([a-zA-Z0-9]+)$/);
    const oldExt = oldExtMatch ? oldExtMatch[0] : "";

    if (oldExt && !newFullName.toLowerCase().endsWith(oldExt.toLowerCase())) {
      console.warn(
        `Color Master: Rename blocked. Attempted to change extension from "${oldExt}" in "${newFullName}".`
      );
      new Notice(t("notices.invalidFilename") + " (Extension mismatch)");
      return false;
    }

    // Prevent overwriting *different* existing file
    if (await adapter.exists(newPath)) {
      if (oldPath.toLowerCase() !== newPath.toLowerCase()) {
        new Notice(t("notices.filenameExists", newFullName));
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

      new Notice(t("notices.renameSuccess", newFullName));
      return newPath;
    } catch (error) {
      new Notice(t("notices.renameError"));
      console.error("Color Master: Error renaming background image:", error);
      return false;
    }
  }
}
