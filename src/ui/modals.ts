import {
  App,
  ButtonComponent,
  DropdownComponent,
  MarkdownRenderer,
  Modal,
  Notice,
  SearchComponent,
  setIcon,
  Setting,
  TextAreaComponent,
  TextComponent,
  requestUrl,
  Component,
} from 'obsidian';
import Sortable from 'sortablejs';
import { DEFAULT_VARS, DEFAULT_PROFILE } from '../constants';
import { CORE_LOCALES, flattenStrings, getFallbackStrings, loadLanguage, t } from '../i18n/strings';
import { type LocaleCode, CORE_LANGUAGES, LocalizedValue } from '../i18n/types';
import type ColorMaster from '../main';
import type { CustomTranslation, CustomVarType, NoticeRule, Profile, Snippet } from '../types';
import { debounce, flattenVars, unflattenStrings } from '../utils';
import type { ColorMasterSettingTab } from './settingsTab';

/**
 * A new Base Modal that all Color Master modals should extend from.
 * It automatically handles applying the correct RTL/LTR direction.
 */
class ColorMasterBaseModal extends Modal {
  plugin: ColorMaster;

  constructor(app: App, plugin: ColorMaster) {
    super(app);
    this.plugin = plugin;
    this.modalEl.classList.add('color-master-modal');
  }

  /**
   * Overridden onOpen to apply RTL settings automatically.
   * Child classes MUST call super.onOpen() if they override this.
   */
  onOpen() {
    const langCode = this.plugin.settings.language;
    const customLang = this.plugin.settings.customLanguages?.[langCode];
    const isCoreRtlLang = langCode === 'ar' || langCode === 'fa';
    const isCustomRtlLang = customLang?.isRtl === true;
    const isRtlEnabled = this.plugin.settings.useRtlLayout;
    const isRTL = (isCoreRtlLang || isCustomRtlLang) && isRtlEnabled;

    this.modalEl.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  }
}

/**
 * A simple modal for showing informational text, rendered as markdown.
 */
export class LanguageInfoModal extends ColorMasterBaseModal {
  constructor(app: App, plugin: ColorMaster) {
    super(app, plugin);
  }

  onOpen() {
    super.onOpen();
    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.classList.add('color-master-modal', 'cm-info-modal');

    contentEl.createEl('h3', { text: t('modals.langInfo.title') });

    const infoContainer = contentEl.createDiv({ cls: 'cm-info-content' });

    const comp = new Component();

    void MarkdownRenderer.render(
      this.app,
      t('modals.langInfo.desc'),
      infoContainer,
      '',
      comp,
    ).catch((err) => {
      console.error('Failed to render markdown:', err);
    });

    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container',
    });

    new ButtonComponent(buttonContainer)
      .setButtonText(t('buttons.apply'))
      .setCta()
      .onClick(() => {
        this.close();
      });
  }

  onClose() {
    this.contentEl.empty();
  }
}

export class ProfileJsonImportModal extends ColorMasterBaseModal {
  plugin: ColorMaster;
  settingTab: ColorMasterSettingTab;
  textarea: HTMLTextAreaElement;
  nameInput: TextComponent;
  profileName: string = '';

  constructor(app: App, plugin: ColorMaster, settingTabInstance: ColorMasterSettingTab) {
    super(app, plugin);
    this.settingTab = settingTabInstance;
  }

  onOpen() {
    super.onOpen();

    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h3', { text: t('modals.jsonImport.title') });
    new Setting(contentEl).setName(t('modals.newProfile.nameLabel')).addText((text) => {
      this.nameInput = text;
      text.setPlaceholder(t('modals.newProfile.namePlaceholder')).onChange((value) => {
        this.profileName = value.trim();
      });
    });
    contentEl.createEl('hr');

    contentEl.createEl('p', {
      text: t('modals.jsonImport.desc1'),
    });
    this.textarea = contentEl.createEl('textarea', {
      cls: 'cm-search-input cm-import-textarea',
      attr: { rows: '20', placeholder: t('modals.jsonImport.placeholder') },
    });

    // Add an 'input' event listener to parse JSON on-the-fly
    const debouncedParse = debounce(() => {
      const content = this.textarea.value;
      if (!content.trim()) return;

      try {
        const parsed = JSON.parse(content);

        // Check if the parsed object has a 'name' property and it's a string
        if (parsed && typeof parsed.name === 'string' && parsed.name) {
          this.nameInput.setValue(parsed.name);
          this.profileName = parsed.name;
        }
      } catch {
        // ignore invalid JSON
      }
    }, 0);

    // Attach the debounced function to the textarea's input event
    this.textarea.addEventListener('input', debouncedParse);

    // File import button
    new Setting(contentEl)
      .setName(t('modals.jsonImport.settingName'))
      .setDesc(t('modals.jsonImport.settingDesc'))
      .addButton((button) => {
        button.setButtonText(t('buttons.chooseFile')).onClick(() => {
          this._handleFileImport();
        });
      });

    // Action buttons (Replace/Create New)
    const ctrl = contentEl.createDiv({ cls: 'modal-button-container' });
    const replaceBtn = ctrl.createEl('button', {
      text: t('modals.jsonImport.replaceActiveButton'),
    });
    const createBtn = ctrl.createEl('button', {
      text: t('modals.jsonImport.createNewButton'),
      cls: 'mod-cta',
    });

    replaceBtn.addEventListener('click', () => void this._applyImport('replace'));
    createBtn.addEventListener('click', () => void this._applyCreate());
  }

  _handleFileImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = () => {
      void (async () => {
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];
        const content = await file.text();
        this.textarea.value = content;

        try {
          const parsed = JSON.parse(content);
          const profileNameFromJson =
            parsed.name || file.name.replace('.profile.json', '').replace('.json', '');
          this.nameInput.setValue(profileNameFromJson);
          this.profileName = profileNameFromJson;
        } catch {
          // ignore json parsing errors
        }

        new Notice(t('notices.fileLoaded', file.name));
      })().catch((err) => {
        console.error('Failed to load profile JSON:', err);
      });
    };
    input.click();
  }

  onClose() {
    this.contentEl.empty();
  }

  async _applyCreate() {
    const name = this.profileName;
    if (!name) {
      new Notice(t('notices.varNameEmpty'));
      return;
    }

    if (this.plugin.settings.profiles[name]) {
      new Notice(t('notices.profileNameExists', name));
      return;
    }

    const raw = this.textarea.value.trim();
    if (!raw) {
      new Notice(t('notices.textboxEmpty'));
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      new Notice(t('notices.invalidJson'));
      return;
    }

    const profileObj: Profile = parsed.profile ? parsed.profile : parsed;
    profileObj.noticeRules = profileObj.noticeRules || {
      text: [],
      background: [],
    };

    this.plugin.settings.profiles[name] = profileObj;
    this.plugin.settings.activeProfile = name;

    await this.plugin.saveSettings();
    this.settingTab.display();
    this.close();
    new Notice(t('notices.profileCreatedSuccess', name));
  }
  async _applyImport(mode: 'replace') {
    const raw = this.textarea.value.trim();
    if (!raw) {
      new Notice(t('notices.textboxEmpty'));
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      new Notice(t('notices.invalidJson'));
      return;
    }

    const profileObj = parsed.profile ? parsed.profile : parsed;
    if (typeof profileObj !== 'object' || profileObj === null) {
      // Added null check for safety
      new Notice(t('notices.invalidProfileObject'));
      return;
    }

    const activeName = this.plugin.settings.activeProfile;
    const activeProfile = this.plugin.settings.profiles[activeName];
    if (!activeProfile) {
      new Notice(t('notices.profileNotFound'));
      return;
    }

    const importedVars = 'vars' in profileObj ? profileObj.vars : {};
    const importedSnippets = 'snippets' in profileObj ? profileObj.snippets : [];
    const themeType = 'themeType' in profileObj ? profileObj.themeType : 'auto';

    if (mode === 'replace') {
      activeProfile.vars = importedVars as { [key: string]: string };
      activeProfile.snippets = importedSnippets as Snippet[];
      activeProfile.themeType = themeType as 'auto' | 'dark' | 'light';
    }

    await this.plugin.saveSettings();
    if (activeProfile.vars) {
      Object.keys(activeProfile.vars).forEach((k) => {
        this.plugin.pendingVarUpdates[k] = activeProfile.vars[k];
      });
    }
    this.plugin.applyPendingNow();

    this.settingTab.display();
    this.close();
    new Notice(t('notices.profileImportedSuccess'));
  }
}

export class NewProfileModal extends ColorMasterBaseModal {
  onSubmit: (result: { name: string; themeType: 'auto' | 'dark' | 'light' }) => void;
  plugin: ColorMaster;

  constructor(
    app: App,
    plugin: ColorMaster,
    onSubmit: (result: { name: string; themeType: 'auto' | 'dark' | 'light' }) => void,
  ) {
    super(app, plugin);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    super.onOpen();

    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h3', { text: t('modals.newProfile.title') });

    let profileName = '';
    let themeType: 'auto' | 'dark' | 'light' = 'auto';

    new Setting(contentEl).setName(t('modals.newProfile.nameLabel')).addText((text) => {
      text.setPlaceholder(t('modals.newProfile.namePlaceholder')).onChange((value) => {
        profileName = value;
      });
    });

    new Setting(contentEl)
      .setName(t('profileManager.themeType'))
      .setDesc(t('profileManager.themeTypeDesc'))
      .addDropdown((dropdown) => {
        dropdown.addOption('auto', t('profileManager.themeAuto'));
        dropdown.addOption('dark', t('profileManager.themeDark'));
        dropdown.addOption('light', t('profileManager.themeLight'));
        dropdown.setValue(themeType);
        dropdown.onChange((value: 'auto' | 'dark' | 'light') => {
          themeType = value;
        });
      });

    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container',
    });

    const cancelButton = buttonContainer.createEl('button', {
      text: t('buttons.cancel'),
    });
    cancelButton.addEventListener('click', () => this.close());

    const createButton = buttonContainer.createEl('button', {
      text: t('buttons.create'),
      cls: 'mod-cta',
    });

    const submit = () => {
      const trimmedName = profileName.trim();
      if (trimmedName) {
        this.onSubmit({ name: trimmedName, themeType: themeType });
        this.close();
        new Notice(t('notices.profileCreated', trimmedName));
      } else {
        new Notice(t('notices.varNameEmpty'));
      }
    };

    createButton.addEventListener('click', submit);

    contentEl
      .querySelector('input[type="text"]')
      ?.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          submit();
        }
      });
  }

  onClose() {
    this.contentEl.empty();
  }
}

export class ConfirmationModal extends ColorMasterBaseModal {
  plugin: ColorMaster;
  title: string;
  message: string | DocumentFragment;
  onConfirm: () => void;
  confirmButtonText: string;
  confirmButtonClass: string;

  constructor(
    app: App,
    plugin: ColorMaster,
    title: string,
    message: string | DocumentFragment,
    onConfirm: () => void,
    options: { buttonText?: string; buttonClass?: string } = {},
  ) {
    super(app, plugin);
    this.title = title;
    this.message = message;
    this.onConfirm = onConfirm;
    this.confirmButtonText = options.buttonText || t('buttons.delete');
    this.confirmButtonClass = options.buttonClass || 'mod-warning';
  }

  onOpen() {
    super.onOpen();

    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h3', { text: this.title });
    contentEl.createEl('p').append(this.message);

    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container',
    });

    const cancelButton = buttonContainer.createEl('button', {
      text: t('buttons.cancel'),
    });
    cancelButton.addEventListener('click', () => this.close());

    const confirmButton = buttonContainer.createEl('button', {
      text: this.confirmButtonText,
      cls: this.confirmButtonClass,
    });
    confirmButton.addEventListener('click', () => {
      this.onConfirm();
      this.close();
    });
  }

  onClose() {
    this.contentEl.empty();
  }
}

export class PasteCssModal extends ColorMasterBaseModal {
  plugin: ColorMaster;
  settingTab: ColorMasterSettingTab;
  existingProfileData: {
    name: string;
    css: string;
    id?: string;
  } | null;
  isEditing: boolean;
  modalTitleEl: HTMLHeadingElement;
  nameSetting: Setting;
  nameInput: TextComponent;
  cssTextarea: HTMLTextAreaElement;
  profileName: string;
  isSaving: boolean = false;

  constructor(
    app: App,
    plugin: ColorMaster,
    settingTab: ColorMasterSettingTab,
    existingProfileData: {
      name: string;
      css: string;
      id?: string;
    } | null = null,
  ) {
    super(app, plugin);
    this.settingTab = settingTab;
    this.existingProfileData = existingProfileData;
    this.isEditing = !!existingProfileData;
    this.profileName = existingProfileData ? existingProfileData.name : '';
  }

  _handleFileImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.css';

    input.onchange = () => {
      void (async () => {
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];
        const content = await file.text();
        this.cssTextarea.value = content;
        new Notice(t('notices.fileLoaded', file.name));
      })().catch((err) => {
        console.error('Failed to load CSS file:', err);
      });
    };
    input.click();
  }

  onOpen() {
    super.onOpen();

    const { contentEl } = this;
    contentEl.empty();

    const titleContainer = contentEl.createDiv({ cls: 'cm-title-container' });

    const titleText = this.isEditing
      ? t('modals.cssImport.titleEdit')
      : t('modals.cssImport.title');

    this.modalTitleEl = titleContainer.createEl('h3', { text: titleText });

    const installedThemes = (this.app as unknown).customCss.themes || {};
    const themeNames = Object.keys(installedThemes);
    let selectedTheme = themeNames.length > 0 ? themeNames[0] : '';

    const themeImporterEl = new Setting(contentEl)
      .setName(t('modals.cssImport.importFromTheme'))
      .setDesc(t('modals.cssImport.importFromThemeDesc'));
    themeImporterEl.settingEl.addClass('cm-theme-importer-setting');

    themeImporterEl.addDropdown((dropdown) => {
      if (themeNames.length > 0) {
        themeNames.forEach((themeName) => {
          dropdown.addOption(themeName, themeName);
        });
        dropdown.onChange((value) => {
          selectedTheme = value;
        });
      } else {
        dropdown.addOption('', t('modals.cssImport.noThemes'));
        dropdown.setDisabled(true);
      }
    });

    themeImporterEl.addButton((button) => {
      button
        .setButtonText(t('buttons.import'))
        .setCta()
        .setDisabled(themeNames.length === 0)
        .onClick(async () => {
          if (!selectedTheme) return;
          const themePath = `${this.app.vault.configDir}/themes/${selectedTheme}/theme.css`;
          try {
            const cssContent = await this.app.vault.adapter.read(themePath);
            this.cssTextarea.value = cssContent;
            this.nameInput.setValue(selectedTheme);
            this.profileName = selectedTheme;
            new Notice(t('notices.themeCssLoaded', selectedTheme));
          } catch (error) {
            new Notice(t('notices.themeReadFailed', selectedTheme));
            console.error(`Color Master: Failed to read theme CSS at ${themePath}`, error);
          }
        });
    });

    let nameLabelText = t('modals.newProfile.nameLabel');
    this.nameSetting = new Setting(contentEl).setName(nameLabelText).addText((text) => {
      this.nameInput = text;
      let placeholderText = t('modals.newProfile.namePlaceholder');

      text
        .setValue(this.isEditing && this.existingProfileData ? this.existingProfileData.name : '')
        .setPlaceholder(placeholderText)
        .onChange((value) => {
          this.profileName = value.trim();
        });
    });

    this.cssTextarea = contentEl.createEl('textarea', {
      cls: 'cm-search-input cm-large-textarea',
      attr: {
        rows: '18',
        placeholder: t('modals.snippetEditor.cssPlaceholder'),
      },
    });

    contentEl.createDiv({
      text: t('modals.cssImport.note'),
      cls: 'cm-modal-warning-note',
    });
    new Setting(contentEl)
      .setName(t('modals.cssImport.importFromFile'))
      .setDesc(t('modals.cssImport.importFromFileDesc'))
      .addButton((button) => {
        button.setButtonText(t('buttons.chooseFile')).onClick(() => {
          this._handleFileImport();
        });
      });

    const historyId =
      this.isEditing && this.existingProfileData
        ? `profile-${this.existingProfileData.name}`
        : null;

    const initialCss =
      this.isEditing && this.existingProfileData ? this.existingProfileData.css : '';

    if (historyId) {
      const lastState = this.plugin.cssHistory[historyId]?.undoStack.last();
      this.cssTextarea.value = lastState ?? initialCss;

      if (
        !this.plugin.cssHistory[historyId] ||
        this.plugin.cssHistory[historyId].undoStack.length === 0
      ) {
        this.plugin.pushCssHistory(historyId, initialCss);
      }
    } else {
      this.cssTextarea.value = initialCss;
    }

    const debouncedPushHistory = debounce((id, value) => {
      this.plugin.pushCssHistory(id, value);
    }, 500);

    this.cssTextarea.addEventListener('input', () => {
      if (historyId) {
        debouncedPushHistory(historyId, this.cssTextarea.value);
      }
    });

    this.cssTextarea.addEventListener('keydown', (e) => {
      if (historyId && e.ctrlKey) {
        if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          const prevState = this.plugin.undoCssHistory(historyId);
          if (prevState !== null) {
            this.cssTextarea.value = prevState;
          }
        } else if (e.key.toLowerCase() === 'y') {
          e.preventDefault();
          const nextState = this.plugin.redoCssHistory(historyId);
          if (nextState !== null) {
            this.cssTextarea.value = nextState;
          }
        }
      }
    });
    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container',
    });

    buttonContainer
      .createEl('button', { text: t('buttons.cancel') })
      .addEventListener('click', () => this.close());

    buttonContainer
      .createEl('button', {
        text: this.isEditing ? t('buttons.update') : t('buttons.create'),
        cls: 'mod-cta',
      })
      .addEventListener('click', () => {
        void this.handleSave().catch((err) => {
          console.error('Failed to save CSS snippet:', err);
        });
      });
    setTimeout(() => this.nameInput.inputEl.focus(), 0);
  }

  async handleSave() {
    if (this.isEditing && !this.existingProfileData) {
      console.error('Attempted to save in editing mode without an existing snippet.');
      return;
    }

    const cssText = this.cssTextarea.value.trim();
    let name = (this.profileName || '').trim();

    if (!name) {
      new Notice(t('notices.varNameEmpty'));
      return;
    }

    const activeProfile = this.plugin.settings.profiles[this.plugin.settings.activeProfile];
    if (!activeProfile) return;

    const isNameTaken = Object.keys(this.plugin.settings.profiles || {}).some(
      (profileName) =>
        profileName.toLowerCase() === name.toLowerCase() &&
        (!this.isEditing ||
          (this.existingProfileData &&
            this.existingProfileData.name.toLowerCase() !== name.toLowerCase())),
    );
    if (isNameTaken) {
      new Notice(t('notices.profileNameExists', name));
      return;
    }

    // 1. UI Feedback
    const saveBtn = this.contentEl.querySelector<HTMLButtonElement>('.mod-cta');
    if (saveBtn) {
      saveBtn.textContent = t('modals.addBackground.processing') + '...';
      saveBtn.disabled = true;
    }

    // 2. Backup Current State
    const customCss = (this.app as unknown).customCss;
    const originalObsidianTheme = customCss?.theme;

    // 3. SWITCH TO GHOST PROFILE
    // Create a temporary blank profile in settings so we can switch to it
    const tempProfileName = '__cm_temp_clean_slate__';
    this.plugin.settings.profiles[tempProfileName] = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
    this.plugin.settings.activeProfile = tempProfileName;

    // Force apply the blank profile (removes all plugin colors instantly)
    await this.plugin.applyStyles();

    // 4. Disable Obsidian Theme (Back to Default)
    if (originalObsidianTheme) {
      customCss.setTheme('');
    }

    // 5. FORCE REFLOW & WAIT
    void document.body.offsetHeight;
    await new Promise((resolve) => setTimeout(resolve, 0));

    // 6. Inject New CSS (Minimal)
    // eslint-disable-next-line obsidianmd/no-forbidden-elements
    const tempStyleEl = document.createElement('style');
    tempStyleEl.id = 'cm-temp-import-style';
    tempStyleEl.textContent = cssText;
    document.head.appendChild(tempStyleEl);

    // 7. Wait for Paint
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => setTimeout(resolve, 0));

    // 8. Capture Colors (Pure CSS + Default Base)
    const capturedVars = await this.plugin.captureCurrentComputedVars();

    // 9. Cleanup Temporary Stuff
    tempStyleEl.remove();

    // Restore Obsidian Theme
    if (originalObsidianTheme) {
      customCss.setTheme(originalObsidianTheme);
    }

    // Delete the Ghost Profile
    delete this.plugin.settings.profiles[tempProfileName];

    // --- Save New Profile ---
    if (this.isEditing && this.existingProfileData) {
      const oldName = this.existingProfileData.name;
      const oldProfileData = this.plugin.settings.profiles[oldName] || {};

      if (oldName !== name) {
        if (this.plugin.settings.pinnedSnapshots[oldName]) {
          this.plugin.settings.pinnedSnapshots[name] =
            this.plugin.settings.pinnedSnapshots[oldName];
          delete this.plugin.settings.pinnedSnapshots[oldName];
        }
        delete this.plugin.settings.profiles[oldName];
      }

      this.plugin.settings.profiles[name] = {
        ...oldProfileData,
        isCssProfile: true,
        customCss: cssText,
        vars: capturedVars,
      };

      this.plugin.settings.activeProfile = name;
      new Notice(t('notices.profileUpdated', name));
    } else {
      this.plugin.settings.profiles[name] = {
        vars: capturedVars,
        themeType: 'auto',
        isCssProfile: true,
        customCss: cssText,
        snippets: [],
        noticeRules: { text: [], background: [] },
      };

      this.plugin.settings.activeProfile = name;
      new Notice(t('notices.profileCreatedFromCss', name));
    }

    this.isSaving = true;
    this.plugin.pendingVarUpdates = {};

    await this.plugin.saveSettings();
    this.plugin.applyCssSnippets();

    this.settingTab.display();
    this.close();
  }

  onClose() {
    // If the save button is not pressed
    if (!this.isSaving) {
      const historyId =
        this.isEditing && this.existingProfileData
          ? `profile-${this.existingProfileData.name}`
          : null;
      // If there is a temporary date delete it.
      if (historyId && this.plugin.cssHistory[historyId]) {
        delete this.plugin.cssHistory[historyId];
      }
    }
    this.contentEl.empty();
  }
}

export class SnippetCssModal extends ColorMasterBaseModal {
  plugin: ColorMaster;
  settingTab: ColorMasterSettingTab;
  existingSnippet: Snippet | null;
  isEditing: boolean;
  modalTitleEl: HTMLHeadingElement;
  nameSetting: Setting;
  nameInput: TextComponent;
  cssTextarea: TextAreaComponent;
  snippetName: string;
  isGlobalSnippet: boolean;
  isSaving: boolean = false;

  _debounce(func: (...args: unknown[]) => void, delay: number) {
    let timeout: number;
    return (...args: unknown[]) => {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => func.apply(this, args), delay);
    };
  }

  constructor(
    app: App,
    plugin: ColorMaster,
    settingTab: ColorMasterSettingTab,
    existingSnippet: Snippet | null = null,
  ) {
    super(app, plugin);
    this.settingTab = settingTab;
    this.existingSnippet = existingSnippet;
    this.isEditing = !!existingSnippet;
    this.snippetName = existingSnippet ? existingSnippet.name : '';
    this.isGlobalSnippet = existingSnippet ? !!existingSnippet.isGlobal : false;
  }

  _handleFileImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.css';

    input.onchange = () => {
      void (async () => {
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];
        const content = await file.text();
        this.cssTextarea.inputEl.value = content;
        new Notice(t('notices.fileLoaded', file.name));
      })().catch((err) => {
        console.error('Failed to load CSS file:', err);
      });
    };
    input.click();
  }

  onOpen() {
    super.onOpen();

    const { contentEl } = this;
    contentEl.empty();

    const titleContainer = contentEl.createDiv({ cls: 'cm-title-container' });

    let titleText = this.isEditing
      ? t('modals.snippetEditor.titleEdit')
      : t('modals.snippetEditor.title');

    this.modalTitleEl = titleContainer.createEl('h3', { text: titleText });

    const installedSnippets = (this.app as unknown).customCss.snippets || [];
    let selectedSnippet = installedSnippets.length > 0 ? installedSnippets[0] : '';

    const snippetImporterEl = new Setting(contentEl)
      .setName(t('modals.snippetEditor.importFromSnippet'))
      .setDesc(t('modals.snippetEditor.importFromSnippetDesc'));
    snippetImporterEl.settingEl.addClass('cm-theme-importer-setting');

    snippetImporterEl.addDropdown((dropdown) => {
      if (installedSnippets.length > 0) {
        installedSnippets.forEach((snippetName: string) => {
          dropdown.addOption(snippetName, snippetName);
        });
        dropdown.onChange((value) => {
          selectedSnippet = value;
        });
      } else {
        dropdown.addOption('', t('modals.snippetEditor.noSnippets'));
        dropdown.setDisabled(true);
      }
    });

    snippetImporterEl.addButton((button) => {
      button
        .setButtonText(t('buttons.import'))
        .setCta()
        .setDisabled(installedSnippets.length === 0)
        .onClick(async () => {
          if (!selectedSnippet) return;
          const snippetPath = `${this.app.vault.configDir}/snippets/${selectedSnippet}.css`;
          try {
            const cssContent = await this.app.vault.adapter.read(snippetPath);
            this.cssTextarea.setValue(cssContent);
            this.nameInput.setValue(selectedSnippet);
            this.snippetName = selectedSnippet;
            new Notice(t('notices.snippetLoaded', selectedSnippet));
          } catch (error) {
            new Notice(t('notices.snippetReadFailed', selectedSnippet));
            console.error(`Color Master: Failed to read snippet CSS at ${snippetPath}`, error);
          }
        });
    });

    const nameLabelText = t('modals.snippetEditor.nameLabel');

    this.nameSetting = new Setting(contentEl).setName(nameLabelText).addText((text) => {
      this.nameInput = text;
      let placeholderText = t('modals.snippetEditor.namePlaceholder');

      text
        .setValue(this.isEditing && this.existingSnippet ? this.existingSnippet.name : '')
        .setPlaceholder(placeholderText)
        .onChange((value) => {
          this.snippetName = value.trim();
        });
    });

    new Setting(contentEl)
      .setName(t('snippets.globalName'))
      .setDesc(t('snippets.globalDesc'))
      .addToggle((toggle) => {
        toggle.setValue(this.isGlobalSnippet).onChange((value) => {
          this.isGlobalSnippet = value;
        });
      });

    this.cssTextarea = new TextAreaComponent(contentEl);
    contentEl.createDiv({
      text: t('modals.cssImport.note'),
      cls: 'cm-modal-warning-note',
    });

    new Setting(contentEl)
      .setName(t('modals.cssImport.importFromFile'))
      .setDesc(t('modals.cssImport.importFromFileDesc'))
      .addButton((button) => {
        button.setButtonText(t('buttons.chooseFile')).onClick(() => {
          this._handleFileImport();
        });
      });

    this.cssTextarea.inputEl.classList.add('cm-search-input', 'cm-large-textarea');
    this.cssTextarea.inputEl.rows = 18;
    this.cssTextarea.setPlaceholder(t('modals.snippetEditor.cssPlaceholder'));

    const historyId = this.isEditing && this.existingSnippet ? this.existingSnippet.id : null;

    const initialCss = this.isEditing && this.existingSnippet ? this.existingSnippet.css : '';

    if (historyId) {
      const lastState = this.plugin.cssHistory[historyId]?.undoStack.last();
      this.cssTextarea.setValue(lastState ?? initialCss);

      if (
        !this.plugin.cssHistory[historyId] ||
        this.plugin.cssHistory[historyId].undoStack.length === 0
      ) {
        this.plugin.pushCssHistory(historyId, initialCss);
      }
    } else {
      this.cssTextarea.setValue(initialCss);
    }

    const debouncedPushHistory = debounce((id, value) => {
      this.plugin.pushCssHistory(id, value);
    }, 500);

    this.cssTextarea.onChange((value: string) => {
      if (historyId) {
        debouncedPushHistory(historyId, value);
      }
    });

    this.cssTextarea.inputEl.addEventListener('keydown', (e: KeyboardEvent) => {
      if (historyId && e.ctrlKey) {
        if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          const prevState = this.plugin.undoCssHistory(historyId);
          if (prevState !== null) {
            this.cssTextarea.setValue(prevState);
          }
        } else if (e.key.toLowerCase() === 'y') {
          e.preventDefault();
          const nextState = this.plugin.redoCssHistory(historyId);
          if (nextState !== null) {
            this.cssTextarea.setValue(nextState);
          }
        }
      }
    });
    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container',
    });

    buttonContainer
      .createEl('button', { text: t('buttons.cancel') })
      .addEventListener('click', () => this.close());

    buttonContainer
      .createEl('button', {
        text: this.isEditing ? t('buttons.update') : t('buttons.create'),
        cls: 'mod-cta',
      })
      .addEventListener('click', () => this.handleSave());
    setTimeout(() => this.nameInput.inputEl.focus(), 0);
  }

  handleSave() {
    const cssText = this.cssTextarea.getValue().trim();
    const name = (this.snippetName || '').trim();

    if (!name) {
      new Notice(t('notices.varNameEmpty'));
      return;
    }
    if (!cssText) {
      new Notice(t('notices.cssContentEmpty'));
      return;
    }

    const activeProfile = this.plugin.settings.profiles[this.plugin.settings.activeProfile];
    if (!activeProfile) return;

    if (!Array.isArray(this.plugin.settings.globalSnippets)) {
      this.plugin.settings.globalSnippets = [];
    }

    const targetList = this.isGlobalSnippet
      ? this.plugin.settings.globalSnippets
      : activeProfile.snippets;

    const isNameTaken = targetList.some(
      (s) =>
        s.name.toLowerCase() === name.toLowerCase() &&
        (!this.isEditing || (this.existingSnippet && this.existingSnippet.id !== s.id)),
    );

    if (isNameTaken) {
      new Notice(t('notices.snippetNameExists', name));
      return;
    }

    if (this.isEditing && this.existingSnippet) {
      const originalIsGlobal = !!this.existingSnippet.isGlobal;
      const originalList = originalIsGlobal
        ? this.plugin.settings.globalSnippets
        : activeProfile.snippets;
      const targetList = this.isGlobalSnippet
        ? this.plugin.settings.globalSnippets
        : activeProfile.snippets;

      const snippetIndex = originalList.findIndex((s) => s.id === this.existingSnippet!.id);

      if (snippetIndex > -1) {
        // First case If the clip type does not change (remains public or private)
        if (originalIsGlobal === this.isGlobalSnippet) {
          // Update directly in the same place
          originalList[snippetIndex].name = name;
          originalList[snippetIndex].css = cssText;
        }
        // Second case If the clip type changes (from public to private or vice versa)
        else {
          // delete from the old list
          const [snippetToMove] = originalList.splice(snippetIndex, 1);

          snippetToMove.name = name;
          snippetToMove.css = cssText;
          snippetToMove.isGlobal = this.isGlobalSnippet;

          targetList.push(snippetToMove);
        }
        new Notice(t('notices.snippetUpdated', name));
      }
    } else {
      targetList.push({
        id: `snippet-${Date.now()}`,
        name: name,
        css: cssText,
        enabled: true,
        isGlobal: this.isGlobalSnippet,
      });
      new Notice(t('notices.snippetCreated', name));
    }

    this.isSaving = true;
    void this.plugin
      .saveSettings()
      .then(() => {
        this.plugin.applyCssSnippets();
        this.settingTab.display();
        this.close();
      })
      .catch((err) => {
        console.error('Failed to save settings:', err);
      });
  }

  onClose() {
    // If the save button is not pressed
    if (!this.isSaving) {
      const historyId = this.isEditing && this.existingSnippet ? this.existingSnippet.id : null;
      // If there is a temporary date delete it.
      if (historyId && this.plugin.cssHistory[historyId]) {
        delete this.plugin.cssHistory[historyId];
      }
    }
    this.contentEl.empty();
  }
}

export class NoticeRulesModal extends ColorMasterBaseModal {
  plugin: ColorMaster;
  settingTab: ColorMasterSettingTab;
  ruleType: 'text' | 'background';
  localRules: NoticeRule[];
  newlyAddedRuleId: string | null = null;
  rulesContainer: HTMLElement;
  sortable: Sortable | null = null;

  constructor(
    app: App,
    plugin: ColorMaster,
    settingTab: ColorMasterSettingTab,
    ruleType: 'text' | 'background',
  ) {
    super(app, plugin);
    this.settingTab = settingTab;
    this.ruleType = ruleType; // 'text' or 'background'
    const activeProfile = this.plugin.settings.profiles[this.plugin.settings.activeProfile];
    this.localRules = JSON.parse(JSON.stringify(activeProfile?.noticeRules?.[this.ruleType] || []));
    if (this.localRules.length === 0) {
      this.localRules.push({
        id: `rule-${Date.now()}`,
        keywords: '',
        color: this.ruleType === 'text' ? '#ffffff' : '#444444',
        isRegex: false,
        highlightOnly: false,
      });
    }
  }

  onOpen() {
    super.onOpen();

    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.classList.add('color-master-modal', 'cm-rules-modal');

    const title =
      this.ruleType === 'text'
        ? t('modals.noticeRules.titleText')
        : t('modals.noticeRules.titleBg');

    const headerContainer = contentEl.createDiv({
      cls: 'cm-rules-modal-header',
    });
    const iconEl = headerContainer.createDiv({
      cls: 'cm-rules-modal-header-icon',
    });
    setIcon(iconEl, 'bell');
    headerContainer.createEl('h3', { text: title });
    const descAndButtonContainer = contentEl.createDiv({
      cls: 'cm-rules-header',
    });

    descAndButtonContainer.createEl('p', {
      text: t('modals.noticeRules.desc'),
      cls: 'cm-rules-modal-desc',
    });
    const buttonSettingContainer = descAndButtonContainer.createDiv();
    const settingEl = new Setting(buttonSettingContainer).addButton((button) => {
      button
        .setButtonText(t('modals.noticeRules.addNewRule'))
        .setCta()
        .onClick(() => {
          const newRule: NoticeRule = {
            id: `rule-${Date.now()}`,
            keywords: '',
            color: this.ruleType === 'text' ? '#ffffff' : '#444444',
            isRegex: false,
            highlightOnly: false,
          };
          this.localRules.push(newRule);

          this.newlyAddedRuleId = newRule.id;

          this.displayRules();
        });
    });

    settingEl.settingEl.classList.add('cm-rules-add-button-setting');

    this.rulesContainer = contentEl.createDiv('cm-rules-container');
    this.displayRules();

    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container',
    });

    buttonContainer
      .createEl('button', { text: t('buttons.cancel') })
      .addEventListener('click', () => this.close());

    buttonContainer
      .createEl('button', { text: t('buttons.apply'), cls: 'mod-cta' })
      .addEventListener('click', () => {
        void (async () => {
          const allTagInputs =
            this.rulesContainer.querySelectorAll<HTMLInputElement>('.cm-tag-input-field');

          allTagInputs.forEach((inputEl, index) => {
            const newKeyword = inputEl.value.trim().replace(/,/g, '');
            if (newKeyword) {
              const rule = this.localRules[index];
              if (rule) {
                const keywords =
                  typeof rule.keywords === 'string' && rule.keywords
                    ? rule.keywords
                        .split(',')
                        .map((k) => k.trim())
                        .filter(Boolean)
                    : [];

                if (!keywords.includes(newKeyword)) {
                  rule.keywords = [...keywords, newKeyword].join(',');
                }
              }
            }
          });

          const activeProfile = this.plugin.settings.profiles[this.plugin.settings.activeProfile];

          if (!activeProfile.noticeRules) {
            activeProfile.noticeRules = { text: [], background: [] };
          }

          activeProfile.noticeRules[this.ruleType] = this.localRules;

          await this.plugin.saveSettings();
          this.plugin.liveNoticeRules = null;
          this.plugin.liveNoticeRuleType = null;

          new Notice(t('notices.settingsSaved'));
          this.close();
        })().catch((err) => {
          console.error('Failed to save notice rules:', err);
        });
      });
  }

  displayRules() {
    const container = this.rulesContainer;
    container.empty();

    this.localRules.forEach((rule, index) => {
      const ruleEl = container.createDiv({ cls: 'cm-rule-item' });
      ruleEl.dataset.ruleId = rule.id;

      if (this.newlyAddedRuleId && rule.id === this.newlyAddedRuleId) {
        ruleEl.classList.add('newly-added');
        this.newlyAddedRuleId = null;
      }

      const actionButtonsContainer = ruleEl.createDiv({
        cls: 'cm-rule-actions',
      });

      const moveButtons = actionButtonsContainer.createDiv({
        cls: 'cm-rule-action-buttons',
      });

      const handleBtn = new ButtonComponent(moveButtons)
        .setIcon('grip-vertical')
        .setTooltip(t('tooltips.dragReorder'));

      handleBtn.buttonEl.classList.add('cm-drag-handle');
      handleBtn.buttonEl.addEventListener('mousedown', (e) => {
        e.stopPropagation();
      });

      actionButtonsContainer.createDiv({
        cls: 'cm-rule-order-number',
        text: `${index + 1}`,
      });

      const tagInputWrapper = ruleEl.createDiv({
        cls: 'cm-rule-input-wrapper',
      });
      this._createTagInput(tagInputWrapper, rule);

      const colorContainer = ruleEl.createDiv({ cls: 'cm-color-container' });

      const colorInput = colorContainer.createEl('input', { type: 'color' });
      colorInput.value = rule.color;
      if (rule.color && rule.color.toLowerCase() === 'transparent') {
        colorInput.classList.add('is-transparent');
      }
      colorInput.addEventListener('input', (evt) => {
        rule.color = (evt.target as HTMLInputElement).value;
        this.plugin.liveNoticeRules = this.localRules;
        this.plugin.liveNoticeRuleType = this.ruleType;
        colorInput.classList.remove('is-transparent');
      });

      new ButtonComponent(colorContainer)
        .setIcon('eraser')
        .setClass('cm-rule-icon-button')
        .setTooltip(t('tooltips.setTransparent'))
        .onClick(() => {
          rule.color = 'transparent';
          colorInput.classList.add('is-transparent');
        });

      const regexBtn = new ButtonComponent(ruleEl)
        .setIcon('regex')
        .setClass('cm-rule-icon-button')
        .setTooltip(t('modals.noticeRules.useRegex'))
        .onClick(() => {
          rule.isRegex = !rule.isRegex;
          regexBtn.buttonEl.classList.toggle('is-active', rule.isRegex);
        });
      regexBtn.buttonEl.classList.toggle('is-active', rule.isRegex);

      if (this.ruleType === 'text') {
        const highlightBtn = new ButtonComponent(ruleEl)
          .setIcon('highlighter')
          .setClass('cm-rule-icon-button')
          .setTooltip(t('modals.noticeRules.highlightOnly'))
          .onClick(() => {
            (rule as unknown).highlightOnly = !(rule as unknown).highlightOnly;
            highlightBtn.buttonEl.classList.toggle('is-active', (rule as unknown).highlightOnly);
          });
        highlightBtn.buttonEl.classList.toggle('is-active', (rule as unknown).highlightOnly);
      }

      new ButtonComponent(ruleEl)
        .setIcon('bell')
        .setClass('cm-rule-icon-button')
        .setTooltip(t('tooltips.testRule'))
        .onClick(() => {
          this._handleTestRule(rule);
        });

      new ButtonComponent(ruleEl)
        .setIcon('trash')
        .setClass('cm-rule-icon-button')
        .setWarning()
        .onClick(() => {
          this._handleDeleteRule(index);
        });
    });
    this._initDrag();
  }

  _initDrag() {
    if (!this.rulesContainer) return;

    if (this.sortable) {
      try {
        this.sortable.destroy();
      } catch (e) {
        console.warn('Could not destroy sortable instance', e);
      }
      this.sortable = null;
    }

    if (!Sortable) {
      console.warn('Color Master: SortableJS not found, drag & drop disabled.');
      return;
    }

    this.sortable = new Sortable(this.rulesContainer, {
      handle: '.cm-drag-handle',
      animation: 160,
      ghostClass: 'cm-rule-ghost',
      dataIdAttr: 'data-rule-id',
      onEnd: (evt: Sortable.SortableEvent) => {
        const { oldIndex, newIndex } = evt;
        if (oldIndex === newIndex || oldIndex == null || newIndex == null) return;

        const [moved] = this.localRules.splice(oldIndex, 1);
        if (moved) {
          this.localRules.splice(newIndex, 0, moved);
        }
        this.displayRules();
      },
    });
  }

  onClose() {
    this.contentEl.empty();
    this.plugin.liveNoticeRules = null;
    this.plugin.liveNoticeRuleType = null;
  }

  _createTagInput(parentEl: HTMLElement, rule: NoticeRule) {
    const container = parentEl.createDiv({ cls: 'cm-tag-input-container' });

    const renderTags = () => {
      container.empty();
      const keywords =
        typeof rule.keywords === 'string' && rule.keywords
          ? rule.keywords
              .split(',')
              .map((k) => k.trim())
              .filter(Boolean)
          : [];

      keywords.forEach((keyword, index) => {
        const tagEl = container.createDiv({ cls: 'cm-tag-item' });
        tagEl.dataset.keyword = keyword;
        tagEl.createSpan({ cls: 'cm-tag-text', text: keyword });
        const removeEl = tagEl.createSpan({
          cls: 'cm-tag-remove',
          text: '×',
        });
        removeEl.addEventListener('click', (e) => {
          e.stopPropagation();
          keywords.splice(index, 1);
          rule.keywords = keywords.join(',');
          renderTags();
        });
      });

      const inputEl = container.createEl('input', {
        type: 'text',
        cls: 'cm-tag-input-field',
      });
      inputEl.placeholder = t('modals.noticeRules.keywordPlaceholder');

      const addKeywordFromInput = () => {
        const newKeyword = inputEl.value.trim().replace(/,/g, '');
        if (!newKeyword) return;

        const keywords =
          typeof rule.keywords === 'string' && rule.keywords
            ? rule.keywords
                .split(',')
                .map((k) => k.trim())
                .filter(Boolean)
            : [];

        const keywordsLower = keywords.map((k) => k.toLowerCase());
        const newKeywordLower = newKeyword.toLowerCase();

        if (!keywordsLower.includes(newKeywordLower)) {
          rule.keywords = [...keywords, newKeyword].join(',');
          renderTags();
        } else {
          const existingTagEl = container.querySelector(
            `.cm-tag-item[data-keyword="${keywords[keywordsLower.indexOf(newKeywordLower)]}"]`,
          );
          if (existingTagEl) {
            existingTagEl.classList.add('cm-tag-duplicate-flash');
            setTimeout(() => {
              existingTagEl.classList.remove('cm-tag-duplicate-flash');
            }, 700);
          }
          inputEl.value = '';
        }
      };

      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          addKeywordFromInput();
        } else if (e.key === 'Backspace' && inputEl.value === '') {
          if (keywords.length > 0) {
            keywords.pop();
            rule.keywords = keywords.join(',');
            renderTags();
          }
        }
      });

      inputEl.addEventListener('blur', addKeywordFromInput);

      inputEl.focus();
    };

    container.addEventListener('click', () => {
      container.querySelector<HTMLInputElement>('.cm-tag-input-field')?.focus();
    });

    renderTags();
  }
  _handleDeleteRule(index: number) {
    const ruleEl = this.rulesContainer.children[index];
    if (!ruleEl) return;

    ruleEl.classList.add('removing');

    setTimeout(() => {
      if (this.localRules.length === 1) {
        this.localRules.splice(index, 1);
        const newRule: NoticeRule = {
          id: `rule-${Date.now()}`,
          keywords: '',
          color: this.ruleType === 'text' ? '#ffffff' : '#444444',
          isRegex: false,
          highlightOnly: false,
        };
        this.localRules.push(newRule);
        this.newlyAddedRuleId = newRule.id;
      } else {
        this.localRules.splice(index, 1);
      }
      this.displayRules();
    }, 100);
  }
  _handleTestRule(rule: NoticeRule & { _lastTestIndex?: number }) {
    const keywordsString = rule.keywords || '';
    if (!keywordsString.trim()) {
      new Notice(t('notices.noKeywordsToTest'));
      return;
    }

    const keywordsArray = keywordsString
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    if (keywordsArray.length === 0) {
      new Notice(t('notices.noKeywordsToTest'));
      return;
    }
    if (rule._lastTestIndex === undefined || rule._lastTestIndex === null) {
      rule._lastTestIndex = -1;
    }
    rule._lastTestIndex++;
    if (rule._lastTestIndex >= keywordsArray.length) {
      rule._lastTestIndex = 0;
    }

    const sequentialKeyword = keywordsArray[rule._lastTestIndex];
    const fragment = new DocumentFragment();
    const text = t('notices.testSentence', sequentialKeyword).split(
      new RegExp(`(${sequentialKeyword})`, 'i'),
    );

    fragment.append(text[0]);

    const keywordSpan = fragment.createSpan({
      cls: 'cm-test-keyword',
      text: text[1],
    });
    fragment.append(keywordSpan);
    fragment.append(text[2] || '');
    new Notice(fragment);
  }
}

export class CustomVariableMetaModal extends ColorMasterBaseModal {
  plugin: ColorMaster;
  settingTab: ColorMasterSettingTab;
  onSubmit: (details: {
    varName: string;
    varValue: string;
    displayName: string;
    description: string;
    varType: CustomVarType;
  }) => void;

  // Instance variables
  varName: string = '';
  varValue: string = '';
  displayName: string = '';
  description: string = '';
  varType: CustomVarType = 'color';
  sizeUnit: string = 'px';
  valueInputContainer: HTMLElement;

  constructor(
    app: App,
    plugin: ColorMaster,
    settingTab: ColorMasterSettingTab,
    onSubmit: (details: {
      varName: string;
      varValue: string;
      displayName: string;
      description: string;
      varType: CustomVarType;
    }) => void,
  ) {
    super(app, plugin);
    this.settingTab = settingTab;
    this.onSubmit = onSubmit;
  }

  // A function to plot the input field based on the type
  renderValueInput(container: HTMLElement) {
    container.empty(); // Clean up the old field
    const valueSetting = new Setting(container)
      .setName(t('modals.customVar.varValue'))
      .setDesc(t('modals.customVar.varValueDesc'));

    switch (this.varType) {
      case 'color': {
        if (this.varValue !== '' && !this.varValue.match(/^(#|rgb|hsl|transparent|var\(--)/i)) {
          this.varValue = '';
        }

        const colorPicker = valueSetting.controlEl.createEl('input', {
          type: 'color',
        });
        const textInput = valueSetting.controlEl.createEl('input', {
          type: 'text',
          cls: 'color-master-text-input',
        });

        colorPicker.value = this.varValue;
        textInput.value = this.varValue;

        colorPicker.addEventListener('input', (e) => {
          const newColor = (e.target as HTMLInputElement).value;
          textInput.value = newColor;
          this.varValue = newColor;
        });

        textInput.addEventListener('change', (e) => {
          const newColor = (e.target as HTMLInputElement).value;
          colorPicker.value = newColor;
          this.varValue = newColor;
        });

        break;
      }

      case 'size': {
        // If the current value is not a size, return it to the default
        if (!this.varValue.match(/^(-?\d+)(\.\d+)?(px|em|rem|%)$/)) {
          this.varValue = '10px';
        }

        // Extract the number and unit
        const sizeMatch = this.varValue.match(/(-?\d+)(\.\d+)?(\D+)/);

        let num = sizeMatch ? (sizeMatch[1] || '') + (sizeMatch[2] || '') : '10';

        let unit = sizeMatch ? sizeMatch[3] || '' : 'px';
        if (!['px', 'em', 'rem', '%'].includes(unit)) unit = 'px';

        this.sizeUnit = unit;

        const sizeInput = valueSetting.controlEl.createEl('input', {
          type: 'number',
          cls: 'color-master-text-input',
        });
        sizeInput.setCssProps({ width: '80px' });
        sizeInput.value = num;

        const unitDropdown = new DropdownComponent(valueSetting.controlEl);

        // eslint-disable-next-line obsidianmd/ui/sentence-case
        unitDropdown.addOption('px', 'px');
        // eslint-disable-next-line obsidianmd/ui/sentence-case
        unitDropdown.addOption('em', 'em');
        // eslint-disable-next-line obsidianmd/ui/sentence-case
        unitDropdown.addOption('rem', 'rem');
        unitDropdown.addOption('%', '%');

        unitDropdown.setValue(this.sizeUnit);

        const updateSizeValue = () => {
          this.varValue = (sizeInput.value || '0') + this.sizeUnit;
        };

        sizeInput.addEventListener('change', updateSizeValue);

        unitDropdown.onChange((newUnit) => {
          this.sizeUnit = newUnit;
          updateSizeValue();
        });

        break;
      }

      case 'text': {
        // Dump the value if the type is different
        if (this.varType !== 'text') this.varValue = '';

        valueSetting.addTextArea((text) => {
          text
            .setValue(this.varValue)
            .setPlaceholder(t('modals.customVar.textValuePlaceholder'))
            .onChange((value) => {
              this.varValue = value;
            });

          text.inputEl.setCssProps({ width: '100%' });
          text.inputEl.classList.add('cm-textarea-size');
        });

        break;
      }

      case 'number': {
        // If the value is NaN, return it to 0
        if (isNaN(parseFloat(this.varValue))) this.varValue = '0';

        valueSetting.addText((text) => {
          text.inputEl.type = 'number';
          text.setValue(this.varValue).onChange((value) => {
            this.varValue = value;
          });
        });

        break;
      }
    }
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.classList.add('color-master-modal');

    super.onOpen();

    contentEl.createEl('h3', { text: t('modals.customVar.title') });
    contentEl.createEl('p', { text: t('modals.customVar.desc') });

    new Setting(contentEl)
      .setName(t('modals.customVar.displayName'))
      .setDesc(t('modals.customVar.displayNameDesc'))
      .addText((text) =>
        text
          .setPlaceholder(t('modals.customVar.displayNamePlaceholder'))
          .setValue(this.displayName)
          .onChange((value) => {
            this.displayName = value;
          }),
      );

    new Setting(contentEl)
      .setName(t('modals.customVar.varName'))
      .setDesc(t('modals.customVar.varNameDesc'))
      .addText((text) =>
        text
          .setPlaceholder(t('modals.customVar.varNamePlaceholder'))
          .setValue(this.varName)
          .onChange((value) => {
            if (value.length > 0 && !value.startsWith('--')) {
              if (value.startsWith('-')) {
                this.varName = '-' + value;
              } else {
                this.varName = '--' + value;
              }
            } else {
              this.varName = value;
            }
          }),
      );

    new Setting(contentEl)
      .setName(t('modals.customVar.varType'))
      .setDesc(t('modals.customVar.varTypeDesc'))
      .addDropdown((dropdown) => {
        dropdown
          .addOption('color', t('modals.customVar.types.color'))
          .addOption('size', t('modals.customVar.types.size'))
          .addOption('text', t('modals.customVar.types.text'))
          .addOption('number', t('modals.customVar.types.number'))
          .setValue(this.varType)
          .onChange((value: CustomVarType) => {
            this.varType = value;

            switch (value) {
              case 'color':
                this.varValue = '';
                break;
              case 'size':
                this.varValue = '10px';
                break;
              case 'number':
                this.varValue = '0';
                break;
              case 'text':
                this.varValue = '';
                break;
            }
            this.renderValueInput(this.valueInputContainer);
          });
      });

    this.valueInputContainer = contentEl.createDiv('cm-value-input-container');
    this.renderValueInput(this.valueInputContainer);

    // Description
    new Setting(contentEl)
      .setName(t('modals.customVar.description'))
      .setDesc(t('modals.customVar.descriptionDesc'))
      .addTextArea((text) =>
        text
          .setPlaceholder(t('modals.customVar.descriptionPlaceholder'))
          .setValue(this.description)
          .onChange((value) => {
            this.description = value;
          }),
      );

    // Buttons
    new Setting(contentEl)
      .setClass('modal-button-container')
      .addButton((button) => button.setButtonText(t('buttons.cancel')).onClick(() => this.close()))
      .addButton((button) =>
        button
          .setButtonText(t('modals.customVar.addVarButton'))
          .setCta()
          .onClick(() => {
            const trimmedVarName = this.varName.trim();

            if (!trimmedVarName.startsWith('--')) {
              new Notice(t('notices.varNameFormat'));
              return;
            }
            if (!this.displayName.trim()) {
              new Notice(t('notices.varNameEmpty'));
              return;
            }

            const allDefaultVars = Object.keys(flattenVars(DEFAULT_VARS));
            const activeProfile = this.plugin.settings.profiles[this.plugin.settings.activeProfile];
            const allProfileVars = Object.keys(activeProfile.vars || {});
            const allVarNames = new Set([...allDefaultVars, ...allProfileVars]);

            if (allVarNames.has(trimmedVarName)) {
              new Notice(t('notices.varExists', trimmedVarName));
              return;
            }

            this.onSubmit({
              displayName: this.displayName.trim(),
              varName: trimmedVarName,
              varValue: this.varValue.trim(),
              description: this.description.trim(),
              varType: this.varType,
            });
            this.close();
          }),
      );
  }

  onClose() {
    this.contentEl.empty();
  }
}

export class LanguageSettingsModal extends ColorMasterBaseModal {
  plugin: ColorMaster;

  constructor(app: App, plugin: ColorMaster) {
    super(app, plugin);
  }

  onOpen() {
    super.onOpen();
    this.modalEl.classList.add('color-master-modal');
    const { contentEl } = this;

    contentEl.empty();
    contentEl.createEl('h3', {
      text: t('settings.languageSettingsModalTitle'),
    });

    new Setting(contentEl)
      .setName(t('settings.rtlLayoutName'))
      .setDesc(t('settings.rtlLayoutDesc'))
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.useRtlLayout).onChange(async (value) => {
          this.plugin.settings.useRtlLayout = value;
          await this.plugin.saveSettings();
          // Refresh the main settings tab to reflect the change
          this.plugin.settingTabInstance?.display();
        });
      });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

export class IconizeSettingsModal extends ColorMasterBaseModal {
  plugin: ColorMaster;

  constructor(app: App, plugin: ColorMaster) {
    super(app, plugin);
  }

  onOpen() {
    super.onOpen();
    this.modalEl.classList.add('color-master-modal');
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h3', { text: t('options.iconizeModalTitle') });

    new Setting(contentEl)
      .setName(t('options.overrideIconizeName'))
      .setDesc(t('options.overrideIconizeDesc'))
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.overrideIconizeColors).onChange(async (value) => {
          if (value) {
            const iconizeIDs = ['obsidian-icon-folder', 'iconize'];
            const pluginManager = (this.app as unknown).plugins;
            const isIconizeInstalled = iconizeIDs.some(
              (id: string) => !!pluginManager.getPlugin(id),
            );

            if (!isIconizeInstalled) {
              new Notice(t('notices.iconizeNotFound'));
              toggle.setValue(false);
              return;
            }
          }
          this.plugin.settings.overrideIconizeColors = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(contentEl)
      .setName(t('options.cleanupIntervalName'))
      .setDesc(t('options.cleanupIntervalDesc'))
      .addSlider((slider) => {
        slider
          .setLimits(1, 10, 1)
          .setValue(this.plugin.settings.cleanupInterval)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.cleanupInterval = value;
            await this.plugin.saveSettings();
            this.plugin.resetIconizeWatcher();
          });
      });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

export class BackgroundImageSettingsModal extends ColorMasterBaseModal {
  plugin: ColorMaster;

  constructor(app: App, plugin: ColorMaster) {
    super(app, plugin);
  }

  onOpen() {
    super.onOpen();
    this.modalEl.classList.add('color-master-modal');
    const { contentEl } = this;
    const activeProfile = this.plugin.settings.profiles[this.plugin.settings.activeProfile];

    contentEl.empty();
    contentEl.createEl('h3', {
      text: t('options.backgroundModalSettingsTitle'),
    });

    // --- Enable/Disable Toggle ---
    new Setting(contentEl)
      .setName(t('options.backgroundEnableName'))
      .setDesc(t('options.backgroundEnableDesc'))
      .addToggle((toggle) => {
        const isCurrentlyEnabled = activeProfile?.backgroundEnabled !== false;
        toggle.setValue(isCurrentlyEnabled).onChange(async (value) => {
          const profile = this.plugin.settings.profiles[this.plugin.settings.activeProfile];
          if (profile) {
            profile.backgroundEnabled = value;
            await this.plugin.saveSettings();
          }
          this.onOpen();
        });
      });

    const settingTypeSetting = new Setting(contentEl).setName(t('options.settingType'));

    let imageButton: ButtonComponent;
    let videoButton: ButtonComponent;

    const imageSettingsEl = contentEl.createDiv('cm-settings-group');
    imageSettingsEl.setCssProps({ display: 'none' });

    const videoSettingsEl = contentEl.createDiv('cm-settings-group');
    videoSettingsEl.setCssProps({ display: 'none' });

    // --- Fill the Image Settings container ---
    new Setting(imageSettingsEl)
      .setName(t('options.convertImagesName'))
      .setDesc(t('options.convertImagesDesc'))
      .addToggle((toggle) => {
        toggle.setValue(activeProfile?.convertImagesToJpg || false).onChange(async (value) => {
          activeProfile.convertImagesToJpg = value;
          if (value && !activeProfile.jpgQuality) {
            activeProfile.jpgQuality = 85;
          }
          await this.plugin.saveSettings();
          this.onOpen();
        });
      });

    if (activeProfile?.convertImagesToJpg === true) {
      new Setting(imageSettingsEl)
        .setName(t('options.jpgQualityName'))
        .setDesc(t('options.jpgQualityDesc'))
        .addSlider((slider) => {
          slider
            .setLimits(1, 100, 1)
            .setValue(activeProfile?.jpgQuality || 85)
            .setDynamicTooltip()
            .onChange((value) => {
              this.debouncedSaveSettings(value);
            });
        });
    }

    // --- Fill the video settings container (it is still hidden) ---
    new Setting(videoSettingsEl)
      .setName(t('options.videoOpacityName'))
      .setDesc(t('options.videoOpacityDesc'))
      .addSlider((slider) => {
        slider
          .setLimits(0.1, 1, 0.1)
          .setValue(activeProfile.videoOpacity || 0.5)
          .setDynamicTooltip()
          .onChange(async (value) => {
            activeProfile.videoOpacity = value;
            await this.plugin.saveSettings();
          });

        slider.sliderEl.oninput = (e) => {
          const value = parseFloat((e.target as HTMLInputElement).value);
          const videoEl = document.querySelector<HTMLVideoElement>('#cm-background-video');
          if (videoEl) {
            videoEl.setCssProps({ opacity: value.toString() });
          }
        };
      });

    new Setting(videoSettingsEl)
      .setName(t('options.videoMuteName'))
      .setDesc(t('options.videoMuteDesc'))
      .addToggle((toggle) =>
        toggle.setValue(activeProfile.videoMuted !== false).onChange(async (value) => {
          activeProfile.videoMuted = value;
          await this.plugin.saveSettings();

          const videoEl = document.querySelector<HTMLVideoElement>('#cm-background-video');
          if (videoEl) {
            videoEl.muted = value;
          }
        }),
      );

    // --- Attaching buttons to containers ---
    const setActiveButton = (active: 'image' | 'video') => {
      if (active === 'image') {
        imageButton.setCta();
        videoButton.buttonEl.classList.remove('mod-cta');
        imageSettingsEl.setCssProps({ display: 'block' });
        videoSettingsEl.setCssProps({ display: 'none' });
      } else {
        imageButton.buttonEl.classList.remove('mod-cta');
        videoButton.setCta();
        imageSettingsEl.setCssProps({ display: 'none' });
        videoSettingsEl.setCssProps({ display: 'block' });
      }
    };

    settingTypeSetting.addButton((button) => {
      imageButton = button;
      button.setButtonText(t('options.settingTypeImage')).onClick(() => setActiveButton('image'));
    });

    settingTypeSetting.addButton((button) => {
      videoButton = button;
      button.setButtonText(t('options.settingTypeVideo')).onClick(() => setActiveButton('video'));
    });

    const currentType = activeProfile?.backgroundType || 'image';
    setActiveButton(currentType);
  }

  debouncedSaveSettings = debounce((value: number) => {
    void (async () => {
      const profile = this.plugin.settings.profiles[this.plugin.settings.activeProfile];

      if (profile) {
        profile.jpgQuality = value;
        await this.plugin.saveSettings();
        new Notice(t('notices.jpgQualitySet', value));
      }
    })().catch((err) => {
      console.error('Failed to save JPG quality:', err);
    });
  }, 0);

  debounce(func: (...args: unknown[]) => void, wait: number) {
    let timeout: ReturnType<typeof setTimeout> | null;
    return (...args: unknown[]) => {
      const later = () => {
        timeout = null;
        func(...args);
      };
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(later, wait);
    };
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

// Modal shown when adding a background image that already exists
export class FileConflictModal extends ColorMasterBaseModal {
  plugin: ColorMaster;
  arrayBuffer: ArrayBuffer; // The image data to save
  fileName: string; // The conflicting filename
  onResolve: (choice: 'replace' | 'keep') => void; // Callback with user's choice

  constructor(
    app: App,
    plugin: ColorMaster,
    arrayBuffer: ArrayBuffer,
    fileName: string,
    onResolve: (choice: 'replace' | 'keep') => void,
  ) {
    super(app, plugin);
    this.arrayBuffer = arrayBuffer;
    this.fileName = fileName;
    this.onResolve = onResolve;
  }

  onOpen() {
    super.onOpen();
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl('h3', { text: t('modals.fileConflict.title') });
    contentEl.createEl('p', {
      text: t('modals.fileConflict.desc', this.fileName),
    });

    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container',
    });

    // Replace Button
    new ButtonComponent(buttonContainer)
      .setButtonText(t('modals.fileConflict.replaceButton'))

      .onClick(() => {
        this.onResolve('replace');
        this.close();
      });

    // Keep Both Button
    new ButtonComponent(buttonContainer)
      .setButtonText(t('modals.fileConflict.keepButton'))
      .setCta()
      .onClick(() => {
        this.onResolve('keep');
        this.close();
      });
  }

  onClose() {
    this.contentEl.empty();
  }
}

// Modal for adding a new background image via file upload, paste, or drag/drop
export class AddBackgroundModal extends ColorMasterBaseModal {
  plugin: ColorMaster;
  settingTab: ColorMasterSettingTab;

  constructor(app: App, plugin: ColorMaster, settingTab: ColorMasterSettingTab) {
    super(app, plugin);
    this.settingTab = settingTab;
  }

  // Process pasted image files
  async handlePastedFile(file: File) {
    new Notice(t('notices.pastedImage', file.name));
    await this.processFileWithProgress(file);
  }

  // Process pasted URLs (http/https or data URLs)
  async handlePastedUrl(url: string) {
    const pasteBox = this.contentEl.querySelector<HTMLElement>('.cm-paste-box');

    // Handle data URLs directly
    if (url.startsWith('data:image')) {
      try {
        if (pasteBox) {
          pasteBox.textContent = t('modals.addBackground.processing') + '...';
        }
        const response = await requestUrl({ url });
        const arrayBuffer = response.arrayBuffer;
        const contentType = response.headers['content-type'] || 'image/png';
        const fileName = `pasted-image-${Date.now()}.${contentType.split('/')[1]}`;
        new Notice(t('notices.pastedBase64Image'));

        await this.plugin.setBackgroundMedia(arrayBuffer, fileName, 'prompt');
        this.close();
        return; // Exit after handling
      } catch (error) {
        new Notice(t('notices.backgroundLoadError'));
        console.error('Color Master: Error handling pasted data URL:', error);
        this.close();
        return; // Exit on error
      }
    }

    // Handle regular URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      new Notice(t('notices.downloadingFromUrl', url));
      if (pasteBox) {
        // Show processing (no percentage)
        pasteBox.textContent = t('modals.addBackground.processing') + '...';
      }
      await this.plugin.setBackgroundMediaFromUrl(url); // Use dedicated function
      this.close();
      return; // Exit after handling
    }
    // If neither type matched
    new Notice(t('notices.pasteError'));
  }

  // Read file as ArrayBuffer, update progress, and call setBackgroundImage
  async processFileWithProgress(file: File) {
    await Promise.resolve();
    const reader = new FileReader();
    const pasteBox = this.contentEl.querySelector<HTMLElement>('.cm-paste-box');

    // Update progress text in paste box
    reader.onprogress = (event) => {
      if (event.lengthComputable && pasteBox) {
        const percent = Math.round((event.loaded / event.total) * 100);
        pasteBox.textContent = t('modals.addBackground.processing') + `${percent}%`;
      }
    };

    // On successful load, pass data to main plugin function
    reader.onload = async () => {
      if (pasteBox) {
        pasteBox.textContent = t('modals.addBackground.processing') + ' 100%';
      }
      const arrayBuffer = reader.result as ArrayBuffer;
      await this.plugin.setBackgroundMedia(arrayBuffer, file.name, 'prompt');
      this.close();
    };

    // Handle read errors
    reader.onerror = () => {
      new Notice(t('notices.backgroundLoadError'));
      this.close();
    };

    // Start reading the file
    if (pasteBox) {
      pasteBox.textContent = t('modals.addBackground.processing') + '0%';
    }
    reader.readAsArrayBuffer(file);
  }

  onOpen() {
    super.onOpen();
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl('h3', { text: t('modals.addBackground.title') });

    // --- File Import Button ---
    new Setting(contentEl)
      .setName(t('modals.addBackground.importFromFile'))
      .setDesc(t('modals.addBackground.importFromFileDesc'))
      .addButton((button) => {
        // Hidden input element to handle file selection
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*, video/mp4, video/webm';

        button
          .setCta()
          .setButtonText(t('buttons.chooseFile'))
          .onClick(() => {
            input.click();
          });

        input.onchange = async () => {
          if (!input.files || input.files.length === 0) return;
          const file = input.files[0];

          await this.processFileWithProgress(file);
        };
      });

    contentEl.createEl('hr');

    // --- Paste Box (URL or Image via Paste/DragDrop) ---
    const pasteBox = contentEl.createDiv({
      cls: 'cm-paste-box',
      text: t('modals.addBackground.pasteBoxPlaceholder'),
    });
    pasteBox.setAttribute('contenteditable', 'true');

    pasteBox.addEventListener('paste', (event: ClipboardEvent) => {
      event.preventDefault();

      const clipboardData = event.clipboardData;
      if (!clipboardData) return;

      // Check for pasted files first
      if (clipboardData.files && clipboardData.files.length > 0) {
        const file = clipboardData.files[0];
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          void this.handlePastedFile(file).catch((err) => {
            console.error('Failed to handle pasted file:', err);
          });
          return;
        }
      }

      // Check for pasted text (URLs)
      const pastedText = clipboardData.getData('text/plain');
      if (
        pastedText &&
        (pastedText.startsWith('http://') ||
          pastedText.startsWith('https://') ||
          pastedText.startsWith('data:image'))
      ) {
        void this.handlePastedUrl(pastedText).catch((err) => {
          console.error('Failed to handle pasted URL:', err);
        });
        return;
      }
      // If neither worked
      new Notice(t('notices.backgroundPasteError'));
    });

    // --- Drag and Drop Listeners ---
    pasteBox.addEventListener('dragover', (event: DragEvent) => {
      event.preventDefault(); // Required to allow drop
      pasteBox.classList.add('is-over');
      pasteBox.textContent = t('modals.addBackground.dropToAdd');
    });

    pasteBox.addEventListener('dragleave', () => {
      pasteBox.classList.remove('is-over');
      pasteBox.textContent = t('modals.addBackground.pasteBoxPlaceholder');
    });

    pasteBox.addEventListener('drop', (event: DragEvent) => {
      event.preventDefault(); // Prevent default browser file handling
      pasteBox.classList.remove('is-over');
      pasteBox.textContent = t('modals.addBackground.pasteBoxPlaceholder');

      if (!event.dataTransfer) return;

      // Check for dropped files first
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        const file = event.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
          void this.handlePastedFile(file);
          return;
        }
      }

      // Check for dropped URLs (less common, but possible)
      const url =
        event.dataTransfer.getData('text/uri-list') || event.dataTransfer.getData('text/plain');
      if (url && (url.startsWith('http') || url.startsWith('data:image'))) {
        void this.handlePastedUrl(url);
        return;
      }
      // If neither worked
      new Notice(t('notices.backgroundPasteError'));
    });
  }

  onClose() {
    this.contentEl.empty();
  }
}

// Modal for browsing, selecting, renaming, and deleting background images for the active profile
export class ProfileImageBrowserModal extends ColorMasterBaseModal {
  plugin: ColorMaster;
  settingTab: ColorMasterSettingTab;
  closeCallback: () => void;
  galleryEl: HTMLElement;
  private videoPlayers: HTMLVideoElement[] = [];

  constructor(
    app: App,
    plugin: ColorMaster,
    settingTab: ColorMasterSettingTab,
    closeCallback: () => void,
  ) {
    super(app, plugin);
    this.settingTab = settingTab;
    this.closeCallback = closeCallback; // Store the callback
  }

  onOpen(): void {
    super.onOpen();
    const { contentEl } = this;
    contentEl.empty();
    this.videoPlayers = [];
    contentEl.createEl('h3', { text: t('modals.backgroundBrowser.title') });

    this.galleryEl = contentEl.createDiv({ cls: 'cm-image-gallery' });

    // run async tasks safely
    void this._renderImages().catch((err) => {
      console.error('Failed to render images:', err);
    });
  }

  private async _renderImages(): Promise<void> {
    await this.displayImages();
  }

  // Fetches media from vault and populates the gallery UI
  async displayImages() {
    this.galleryEl.empty();
    const backgroundsPath = `${this.app.vault.configDir}/backgrounds`;
    const mediaExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.mp4', '.webm'];

    let files: string[] = [];
    try {
      if (await this.app.vault.adapter.exists(backgroundsPath)) {
        const list = await this.app.vault.adapter.list(backgroundsPath);
        files = list.files;
      }
    } catch (e) {
      console.warn('Color Master: Error listing background folder.', e);
    }

    const mediaFiles = files.filter((path) =>
      mediaExtensions.some((ext) => path.toLowerCase().endsWith(ext)),
    );

    if (mediaFiles.length === 0) {
      this.galleryEl.createDiv({
        cls: 'cm-image-browser-empty',
        text: t('modals.backgroundBrowser.noImages'),
      });
      return;
    }

    const activeProfile = this.plugin.settings.profiles[this.plugin.settings.activeProfile];
    const activeMediaPath = activeProfile?.backgroundPath;

    // Optimization: Helper to parse filenames (defined once outside the loop)
    const splitName = (fullFileName: string) => {
      const decoded = decodeURIComponent(fullFileName || '');
      const lastDot = decoded.lastIndexOf('.');
      if (lastDot > 0 && lastDot < decoded.length - 1) {
        return {
          basename: decoded.substring(0, lastDot),
          ext: decoded.substring(lastDot),
        };
      }
      return { basename: decoded, ext: '' };
    };

    // Optimization: Use DocumentFragment to minimize DOM reflows
    const fragment = document.createDocumentFragment();

    for (const mediaPath of mediaFiles) {
      const cardEl = document.createElement('div');
      cardEl.className = 'cm-image-card';
      if (mediaPath === activeMediaPath) cardEl.classList.add('is-active');

      const mediaUrl = this.app.vault.adapter.getResourcePath(mediaPath);
      const fileName = mediaPath.split('/').pop();
      const isVideo =
        mediaPath.toLowerCase().endsWith('.mp4') || mediaPath.toLowerCase().endsWith('.webm');

      // --- Media Preview Section ---
      const previewContainer = cardEl.createDiv({
        cls: 'cm-media-preview-container',
      });

      if (isVideo) {
        const videoEl = previewContainer.createEl('video', {
          cls: 'cm-image-card-preview',
          attr: {
            src: mediaUrl,
            muted: true,
            loop: true,
            playsinline: true,
            'data-path': mediaPath,
          },
        });

        this.videoPlayers.push(videoEl);

        const playOverlay = previewContainer.createDiv({
          cls: 'cm-media-play-overlay',
        });
        setIcon(playOverlay, 'play');

        const muteButton = previewContainer.createDiv({
          cls: 'cm-media-mute-toggle',
        });

        const updateMuteIcon = () => {
          setIcon(muteButton, videoEl.muted ? 'volume-x' : 'volume-2');
          muteButton.setCssProps({ opacity: '0' });
        };
        updateMuteIcon();

        // Mute Toggle Logic
        muteButton.addEventListener('click', (e) => {
          e.stopPropagation();
          videoEl.muted = !videoEl.muted;
          updateMuteIcon();
          muteButton.setCssProps({
            opacity: videoEl.muted ? '0.8' : '1',
          });
        });

        // Video Play/Pause & Exclusive Play Logic
        previewContainer.addEventListener('click', () => {
          // Pause other playing videos
          for (const player of this.videoPlayers) {
            if (player !== videoEl && !player.paused) {
              player.pause();
              const container = player.closest<HTMLElement>('.cm-media-preview-container');
              if (container) {
                const playOverlay = container.querySelector<HTMLElement>('.cm-media-play-overlay');
                const muteToggle = container.querySelector<HTMLElement>('.cm-media-mute-toggle');

                playOverlay?.setCssProps({ opacity: '1' });
                muteToggle?.setCssProps({ opacity: '0' });
              }
            }
          }

          if (videoEl.paused) {
            void videoEl.play().catch((err) => {
              console.error('Failed to play video:', err);
            });
            playOverlay.setCssProps({ opacity: '0' });
            muteButton.setCssProps({
              opacity: videoEl.muted ? '0.8' : '1',
            });
          } else {
            muteButton.setCssProps({ opacity: '0' });
            videoEl.pause();
            playOverlay.setCssProps({ opacity: '1' });
          }
        });
      } else {
        previewContainer.createEl('img', {
          cls: 'cm-image-card-preview',
          attr: { src: mediaUrl, 'data-path': mediaPath },
        });
      }

      // --- Rename Input Section ---
      const nameSettingEl = cardEl.createDiv({
        cls: 'setting-item cm-image-card-name-input',
      });
      const nameControlEl = nameSettingEl.createDiv({
        cls: 'setting-item-control',
      });
      const nameInputContainer = nameControlEl.createDiv({
        cls: 'cm-name-input-container',
      });

      const nameInput = nameInputContainer.createEl('input', {
        type: 'text',
        cls: 'cm-name-input-basename',
      });
      const extensionSpan = nameInputContainer.createSpan({
        cls: 'cm-name-input-extension',
      });

      // State tracking for rename logic
      let currentImagePath = mediaPath;
      let currentFileName = fileName || '';
      let { basename, ext } = splitName(currentFileName);

      nameInput.value = basename;
      extensionSpan.setText(ext);

      nameInput.addEventListener('focus', (e) => (e.target as HTMLInputElement).select());

      const saveName = async () => {
        const newBasename = nameInput.value.trim();
        const currentBase = splitName(currentFileName).basename;

        if (newBasename && newBasename !== currentBase) {
          const newFullName = newBasename + ext;
          const renameResult = await this.plugin.renameBackgroundMedia(
            currentImagePath,
            newFullName,
          );

          if (renameResult && typeof renameResult === 'string') {
            // Update local state upon success
            currentImagePath = renameResult;
            currentFileName = renameResult.split('/').pop() || '';
            const updatedSplit = splitName(currentFileName);
            basename = updatedSplit.basename;

            // Partial UI update to avoid full reload
            const imgEl = cardEl.querySelector<HTMLImageElement>('.cm-image-card-preview');
            const selectBtn = cardEl.querySelector<HTMLButtonElement>('.cm-image-card-select-btn');
            const deleteBtn = cardEl.querySelector<HTMLButtonElement>('.cm-image-card-delete-btn');

            if (imgEl) imgEl.src = this.app.vault.adapter.getResourcePath(renameResult);
            if (selectBtn) selectBtn.onclick = () => this.selectMedia(renameResult);
            if (deleteBtn) deleteBtn.onclick = () => this.deleteMedia(renameResult, cardEl);
          } else {
            nameInput.value = currentBase; // Revert on failure
          }
        } else {
          nameInput.value = currentBase;
        }
      };

      nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          nameInput.blur(); // Triggers focusout
        }
      });
      nameInput.addEventListener('focusout', () => {
        void saveName().catch((err) => {
          console.error('Failed to save snippet name:', err);
        });
      });

      // --- Actions (Select / Delete) ---
      const controlsEl = cardEl.createDiv({ cls: 'cm-image-card-controls' });

      const selectButton = new ButtonComponent(controlsEl)
        .setButtonText(t('buttons.select'))
        .setCta()
        .onClick(() => this.selectMedia(currentImagePath));
      selectButton.buttonEl.classList.add('cm-image-card-select-btn');

      const deleteButton = new ButtonComponent(controlsEl)
        .setIcon('trash')
        .setClass('mod-warning')
        .onClick(() => this.deleteMedia(currentImagePath, cardEl));
      deleteButton.buttonEl.classList.add('cm-image-card-delete-btn');

      fragment.appendChild(cardEl);
    }

    // Single DOM injection
    this.galleryEl.appendChild(fragment);
  }

  async selectMedia(path: string) {
    // Infer media type from extension to ensure correct rendering tag (img vs video)
    const fileExt = path.split('.').pop()?.toLowerCase();
    const mediaType: 'image' | 'video' =
      fileExt === 'mp4' || fileExt === 'webm' ? 'video' : 'image';

    await this.plugin.selectBackgroundMedia(path, mediaType);

    this.settingTab.display();
    this.closeCallback();
    this.close();
  }

  deleteMedia(path: string, cardEl: HTMLElement) {
    // Identify profiles currently using this background to warn the user
    const profiles = this.plugin.settings.profiles;
    const affectedProfiles = Object.keys(profiles).filter(
      (name) => profiles[name].backgroundPath === path,
    );

    // Construct warning UI with list of affected profiles
    const messageFragment = new DocumentFragment();
    messageFragment.append(t('modals.confirmation.deleteGlobalBgDesc'));

    if (affectedProfiles.length > 0) {
      const listEl = messageFragment.createEl('ul', {
        cls: 'cm-profile-list-modal',
      });
      affectedProfiles.forEach((name) => {
        listEl.createEl('li').createEl('strong', { text: name });
      });
    }

    new ConfirmationModal(
      this.app,
      this.plugin,
      t('modals.confirmation.deleteBackgroundTitle'),
      messageFragment,
      () => {
        void (async () => {
          // Perform deletion
          await this.plugin.removeBackgroundMediaByPath(path);
          new Notice(t('notices.bgDeleted'));

          // Update browser UI
          cardEl.remove();

          if (this.galleryEl.childElementCount === 0) {
            this.galleryEl.createDiv({
              cls: 'cm-image-browser-empty',
              text: t('modals.backgroundBrowser.noImages'),
            });
          }

          // Sync main settings tab
          this.settingTab.display();
        })().catch((err) => {
          console.error('Failed to delete background:', err);
        });
      },
      { buttonText: t('buttons.deleteAnyway'), buttonClass: 'mod-warning' },
    ).open();
  }

  onClose() {
    for (const player of this.videoPlayers) {
      player.pause();
    }
    this.videoPlayers = [];
    this.contentEl.empty();
  }
}

/**
 * Modal for granular data reset operations.
 * Allows users to select specific data categories to wipe or preserve.
 */
export class AdvancedResetModal extends ColorMasterBaseModal {
  plugin: ColorMaster;

  private defaultResetOptions = {
    deleteProfiles: false,
    deleteSnippets: false,
    deleteSettings: false,
    deleteBackgrounds: false,
    deleteLanguages: false,
  };

  resetOptions = {
    // Merge saved preferences with defaults, prioritizing saved state
    ...(this.plugin.settings.advancedResetOptions || this.defaultResetOptions),
    // Safety: Ensure background deletion defaults to false unless explicitly saved
    deleteBackgrounds:
      this.plugin.settings.advancedResetOptions?.deleteBackgrounds ||
      this.defaultResetOptions.deleteBackgrounds,
  };

  deleteButton: ButtonComponent;

  constructor(app: App, plugin: ColorMaster) {
    super(app, plugin);
  }

  onOpen() {
    super.onOpen();
    const { contentEl } = this;

    contentEl.empty();
    contentEl.createEl('h3', { text: t('modals.advancedReset.title') });
    contentEl.createEl('p', { text: t('modals.advancedReset.desc') });
    contentEl.addClass('cm-advanced-reset-options');

    // 1. Profiles & Snapshots
    new Setting(contentEl)
      .setName(t('modals.advancedReset.profilesLabel'))
      .addExtraButton((btn) => {
        btn.setIcon('info').setTooltip(t('modals.advancedReset.profilesDesc'));
      })
      .addToggle((toggle) => {
        toggle.setValue(this.resetOptions.deleteProfiles).onChange((value) => {
          this.resetOptions.deleteProfiles = value;
          this.validateButton();
        });
        toggle.toggleEl.blur();
      });

    // 2. Snippets
    new Setting(contentEl)
      .setName(t('modals.advancedReset.snippetsLabel'))
      .addExtraButton((btn) => {
        btn.setIcon('info').setTooltip(t('modals.advancedReset.snippetsDesc'));
      })
      .addToggle((toggle) => {
        toggle.setValue(this.resetOptions.deleteSnippets).onChange((value) => {
          this.resetOptions.deleteSnippets = value;
          this.validateButton();
        });
        toggle.toggleEl.blur();
      });

    // 3. Plugin Settings
    new Setting(contentEl)
      .setName(t('modals.advancedReset.settingsLabel'))
      .addExtraButton((btn) => {
        btn.setIcon('info').setTooltip(t('modals.advancedReset.settingsDesc'));
      })
      .addToggle((toggle) => {
        toggle.setValue(this.resetOptions.deleteSettings).onChange((value) => {
          this.resetOptions.deleteSettings = value;
          this.validateButton();
        });
        toggle.toggleEl.blur();
      });

    // 4. Backgrounds Folder
    new Setting(contentEl)
      .setName(t('modals.advancedReset.backgroundsLabel'))
      .addExtraButton((btn) => {
        btn.setIcon('info').setTooltip(t('modals.advancedReset.backgroundsDesc'));
      })
      .addToggle((toggle) => {
        toggle.setValue(this.resetOptions.deleteBackgrounds).onChange((value) => {
          this.resetOptions.deleteBackgrounds = value;
          this.validateButton();
        });
        toggle.toggleEl.blur();
      });

    // 5. Custom Languages (Handles optional type safely)
    new Setting(contentEl)
      .setName(t('modals.advancedReset.languagesLabel'))
      .addExtraButton((btn) => {
        btn.setIcon('info').setTooltip(t('modals.advancedReset.languagesDesc'));
      })
      .addToggle((toggle) => {
        toggle.setValue(this.resetOptions.deleteLanguages ?? false).onChange((value) => {
          this.resetOptions.deleteLanguages = value;
          this.validateButton();
        });
        toggle.toggleEl.blur();
      });

    // --- Action Buttons ---
    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container',
    });

    new ButtonComponent(buttonContainer)
      .setButtonText(t('buttons.cancel'))
      .onClick(() => this.close());

    this.deleteButton = new ButtonComponent(buttonContainer)
      .setButtonText(t('buttons.delete'))
      .setWarning()
      .onClick(() => {
        if (Object.values(this.resetOptions).every((v) => v === false)) return;

        this.plugin.settings.advancedResetOptions = this.resetOptions;
        void this.plugin.resetPluginData(this.resetOptions).catch((err) => {
          console.error('Failed to reset plugin data:', err);
        });

        this.close();
      });

    this.validateButton();
  }

  validateButton() {
    const hasSelection = Object.values(this.resetOptions).some((v) => v === true);
    this.deleteButton.setDisabled(!hasSelection);
    this.deleteButton.setButtonText(hasSelection ? t('buttons.delete') : t('buttons.selectOption'));
  }

  onClose() {
    this.contentEl.empty();
  }
}

/**
 * Modal for creating a new custom language definition.
 */
export class AddNewLanguageModal extends ColorMasterBaseModal {
  settingTab: ColorMasterSettingTab;
  langName: string = '';
  langCode: string = '';
  isRtl: boolean = false;

  constructor(app: App, plugin: ColorMaster, settingTab: ColorMasterSettingTab) {
    super(app, plugin);
    this.settingTab = settingTab;
  }

  onOpen() {
    super.onOpen();
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl('h3', { text: t('modals.addLang.title') });
    contentEl.createEl('p', { text: t('modals.addLang.desc') });

    // 1. Language Name Input
    new Setting(contentEl)
      .setName(t('modals.addLang.nameLabel'))
      .setDesc(t('modals.addLang.nameDesc'))
      .addText((text) => {
        text.setPlaceholder(t('modals.addLang.namePlaceholder')).onChange((value) => {
          this.langName = value.trim();
        });
      });

    // 2. Language Code Input (Sanitized)
    new Setting(contentEl)
      .setName(t('modals.addLang.codeLabel'))
      .setDesc(t('modals.addLang.codeDesc'))
      .addText((text) => {
        text.setPlaceholder(t('modals.addLang.codePlaceholder')).onChange((value) => {
          // Enforce lowercase alphanumeric format for safe keys
          this.langCode = value
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, '');
          if (text.inputEl.value !== this.langCode) {
            text.setValue(this.langCode);
          }
        });
      });

    // 3. RTL Toggle
    new Setting(contentEl)
      .setName(t('modals.addLang.rtlLabel'))
      .setDesc(t('modals.addLang.rtlDesc'))
      .addToggle((toggle) => {
        toggle.setValue(this.isRtl).onChange((value) => {
          this.isRtl = value;
        });
      });

    // 4. Action Buttons
    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container',
    });

    new ButtonComponent(buttonContainer)
      .setButtonText(t('buttons.cancel'))
      .onClick(() => this.close());

    new ButtonComponent(buttonContainer)
      .setButtonText(t('buttons.create'))
      .setCta()
      .onClick(() => this.handleCreate());
  }

  async handleCreate() {
    // --- Validation ---
    if (!this.langName) {
      new Notice(t('notices.langNameEmpty'));
      return;
    }
    if (!this.langCode) {
      new Notice(t('notices.langCodeEmpty'));
      return;
    }

    // Prevent overriding core languages
    const coreCodes = ['en', 'ar', 'fa', 'fr'];
    if (coreCodes.includes(this.langCode)) {
      new Notice(t('notices.langCodeCore', this.langCode));
      return;
    }

    if (!this.plugin.settings.customLanguages) {
      this.plugin.settings.customLanguages = {};
    }

    // Check for duplicate codes
    if (this.plugin.settings.customLanguages[this.langCode]) {
      new Notice(t('notices.langCodeExists', this.langCode));
      return;
    }

    // Check for duplicate names (Custom)
    const existingLangs = Object.values(this.plugin.settings.customLanguages);
    const nameExists = existingLangs.some(
      (lang) => lang.languageName.toLowerCase() === this.langName.toLowerCase(),
    );
    if (nameExists) {
      new Notice(t('notices.langNameExists', this.langName));
      return;
    }

    // Check for duplicate names (Core)
    const coreLangNames = Object.values(CORE_LANGUAGES).map((name) => name.toLowerCase());
    if (coreLangNames.includes(this.langName.toLowerCase())) {
      new Notice(t('notices.langNameCore', this.langName));
      return;
    }

    // --- Creation & Activation ---
    this.plugin.settings.customLanguages[this.langCode] = {
      languageName: this.langName,
      translations: {},
      isRtl: this.isRtl,
    };

    // Auto-switch to the new language
    this.plugin.settings.language = this.langCode;

    await this.plugin.saveSettings();
    loadLanguage(this.plugin.settings); // Refresh i18n engine
    new Notice(t('notices.langCreated', this.langName));
    this.settingTab.display(); // Refresh UI
    this.close();

    // Open translator immediately for convenience
    new LanguageTranslatorModal(this.app, this.plugin, this.settingTab, this.langCode).open();
  }

  onClose() {
    this.contentEl.empty();
  }
}

/**
 * Complex modal for editing language translation strings.
 * Features a recursive tree view, live search, and import/export capabilities.
 */
export class LanguageTranslatorModal extends ColorMasterBaseModal {
  settingTab: ColorMasterSettingTab;
  langCode: string;
  langName: string;
  translations: CustomTranslation;
  fallbackStrings: Record<string, LocalizedValue>;
  nestedFallback: Record<string, LocalizedValue | Record<string, unknown>>; // Optimization: Cache nested structure
  listContainer: HTMLElement;
  isCoreLanguage: boolean;
  isRtl: boolean = false;
  searchQuery: string = '';
  caseSensitive: boolean = false;
  filterMissing: boolean = false;
  searchInput: HTMLInputElement;
  debouncedRender: () => void;

  constructor(app: App, plugin: ColorMaster, settingTab: ColorMasterSettingTab, langCode: string) {
    super(app, plugin);
    this.settingTab = settingTab;
    this.langCode = langCode;
    this.fallbackStrings = getFallbackStrings();

    // Pre-calculate nested structure once to avoid overhead during render loops
    this.nestedFallback = unflattenStrings(this.fallbackStrings as CustomTranslation);

    const customLangData = this.plugin.settings.customLanguages?.[langCode];
    const coreLangNameString = CORE_LANGUAGES[langCode as LocaleCode];

    // Handle Core Languages smarter (Base + Overrides)
    if (coreLangNameString) {
      this.isCoreLanguage = true;
      this.langName = coreLangNameString;

      // 1. Load the BASE core strings from source code
      const flatCoreLang = flattenStrings(CORE_LOCALES[langCode as LocaleCode]);
      const baseStrings: CustomTranslation = {};
      for (const key in flatCoreLang) {
        if (typeof flatCoreLang[key] === 'string') baseStrings[key] = flatCoreLang[key];
      }

      // 2. If we have saved overrides, merge them on top of base strings
      if (customLangData && customLangData.translations) {
        this.translations = { ...baseStrings, ...customLangData.translations };
        this.isRtl = customLangData.isRtl ?? (langCode === 'ar' || langCode === 'fa');
      } else {
        // No overrides yet, just show full base strings
        this.translations = baseStrings;
        this.isRtl = langCode === 'ar' || langCode === 'fa';
      }
    } else if (customLangData) {
      // Purely custom language (not core) - load as is
      this.langName = customLangData.languageName;
      this.translations = JSON.parse(JSON.stringify(customLangData.translations || {}));
      this.isCoreLanguage = false;
      this.isRtl = customLangData.isRtl || false;
    } else {
      // Brand new custom language
      this.langName = langCode;
      this.translations = {};
      this.isCoreLanguage = false;
    }
  }

  onOpen() {
    super.onOpen();
    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.classList.add(
      'color-master-modal',
      'cm-translator-modal',
      'cm-translator-tree-modal',
    );

    contentEl.createEl('h3', {
      text: t('modals.translator.title', this.langName),
    });

    this.debouncedRender = debounce(() => {
      this.renderTranslationTree();
    }, 250);

    this.renderControls(contentEl);
    this.listContainer = contentEl.createDiv('cm-translator-list');
    this.renderTranslationTree();

    const mainControls = new Setting(contentEl)
      .addButton((button) => {
        button
          .setButtonText(t('buttons.apply'))
          .setCta()
          .onClick(() => this.handleSave());
      })
      .addButton((button) => {
        button.setButtonText(t('buttons.cancel')).onClick(() => this.close());
      });
    mainControls.settingEl.classList.add('cm-translator-main-controls', 'modal-button-container');
  }

  renderControls(containerEl: HTMLElement) {
    const controlsEl = containerEl.createDiv('cm-translator-controls');

    // --- 1. Search Bar (Using Obsidian Component) ---
    const searchBarContainer = controlsEl.createDiv({
      cls: 'cm-search-bar-container',
    });

    const searchComponent = new SearchComponent(searchBarContainer)
      .setPlaceholder(t('modals.translator.searchPlaceholder'))
      .setValue(this.searchQuery)
      .onChange((value) => {
        this.searchQuery = value;
        this.debouncedRender();
      });

    this.searchInput = searchComponent.inputEl;

    searchBarContainer.addClass('cm-search-input-container');

    const searchActions = searchBarContainer.createDiv({
      cls: 'cm-search-actions',
    });

    // Case Sensitivity Toggle
    const caseToggle = searchActions.createEl('button', {
      cls: 'cm-search-action-btn',
      text: 'Aa',
    });
    caseToggle.setAttr('aria-label', t('settings.ariaCase'));
    caseToggle.classList.toggle('is-active', this.caseSensitive);
    caseToggle.addEventListener('click', () => {
      this.caseSensitive = !this.caseSensitive;
      caseToggle.classList.toggle('is-active', this.caseSensitive);
      this.debouncedRender();
    });

    // Filter Missing Toggle
    const missingToggle = searchActions.createEl('button', {
      cls: 'cm-search-action-btn',
    });
    setIcon(missingToggle, 'filter');
    missingToggle.setAttr('aria-label', t('modals.translator.showMissing'));
    missingToggle.classList.toggle('is-active', this.filterMissing);
    missingToggle.addEventListener('click', () => {
      this.filterMissing = !this.filterMissing;
      missingToggle.classList.toggle('is-active', this.filterMissing);
      this.debouncedRender();
    });

    // --- 2. IO Buttons (Import/Export) ---
    const ioControls = controlsEl.createDiv('cm-translator-io-controls');

    new Setting(ioControls)
      .addButton((btn) =>
        btn
          .setIcon('copy')
          .setTooltip(t('modals.translator.copyJson'))
          .onClick(() => this._copyJson()),
      )
      .addButton((btn) =>
        btn
          .setIcon('paste')
          .setTooltip(t('modals.translator.pasteJson'))
          .onClick(() => this._pasteJson()),
      )
      .addButton((btn) =>
        btn
          .setIcon('download')
          .setTooltip(t('modals.translator.importFile'))
          .onClick(() => this._importLanguageFile()),
      )
      .addButton((btn) =>
        btn
          .setIcon('upload')
          .setTooltip(t('modals.translator.exportFile'))
          .onClick(() => this._exportLanguageFile()),
      );
  }

  renderTranslationTree() {
    this.listContainer.empty();

    // Use cached structure instead of recalculating
    const counter = { index: 1 };
    const query = this.caseSensitive ? this.searchQuery : this.searchQuery.toLowerCase();

    const totalRendered = this.renderGroup(
      this.listContainer,
      this.nestedFallback,
      '',
      counter,
      query,
    );

    if (totalRendered === 0 && (this.searchQuery || this.filterMissing)) {
      this.listContainer.createEl('p', {
        cls: 'cm-translator-empty',
        text: t('modals.translator.noMatches'),
      });
    }
  }

  /**
   * Recursively renders groups and items.
   * Returns the count of visible items to handle filtering logic.
   */
  renderGroup(
    container: HTMLElement,
    fallbackGroup: Record<string, unknown>,
    path: string,
    counter: { index: number },
    query: string,
  ): number {
    let itemsRenderedInThisGroup = 0;

    // Sort: Groups (objects) first, then individual keys, alphabetically
    const keys = Object.keys(fallbackGroup).sort((a, b) => {
      const aVal = fallbackGroup[a];
      const bVal = fallbackGroup[b];
      const aIsObj = typeof aVal === 'object' && aVal !== null;
      const bIsObj = typeof bVal === 'object' && bVal !== null;

      if (aIsObj && !bIsObj) return -1;
      if (!aIsObj && bIsObj) return 1;
      return a.localeCompare(b);
    });

    for (const key of keys) {
      const newPath = path ? `${path}.${key}` : key;
      const fallbackValue = fallbackGroup[key];
      const currentValue = this.translations[newPath];

      // Prepare search terms once
      const keyStr = this.caseSensitive ? key : key.toLowerCase();

      let displayFallback = '';
      if (typeof fallbackValue === 'string') {
        displayFallback = fallbackValue;
      } else if (typeof fallbackValue === 'function') {
        displayFallback = t('modals.translator.dynamicValue');
      }

      const fallbackStr = this.caseSensitive ? displayFallback : displayFallback.toLowerCase();

      const valStr =
        typeof currentValue === 'string'
          ? this.caseSensitive
            ? currentValue
            : currentValue.toLowerCase()
          : '';

      const isMatch =
        !query || keyStr.includes(query) || fallbackStr.includes(query) || valStr.includes(query);

      // Recursive Case: Group/Folder (Must be object and NOT null)
      if (typeof fallbackValue === 'object' && fallbackValue !== null) {
        const details = container.createEl('details', {
          cls: 'cm-translator-group',
        });
        const summary = details.createEl('summary', {
          cls: 'cm-translator-group-title',
        });
        summary.createSpan({ text: key });

        const groupContainer = details.createDiv('cm-translator-group-content');

        const childrenCount = this.renderGroup(
          groupContainer,
          fallbackValue as Record<string, unknown>,
          newPath,
          counter,
          query,
        );

        // Prune empty groups if filtering is active
        if (childrenCount > 0) {
          itemsRenderedInThisGroup += childrenCount;
          if (query || this.filterMissing) {
            details.open = true; // Auto-expand relevant groups
          }
        } else {
          details.remove();
        }
      }
      // Base Case: Translation Item (String OR Function)
      else if (typeof fallbackValue === 'string' || typeof fallbackValue === 'function') {
        const isMissing = !currentValue;
        const matchesFilter = !this.filterMissing || isMissing;

        if (matchesFilter && isMatch) {
          itemsRenderedInThisGroup++;

          const itemEl = container.createDiv({
            cls: 'cm-translator-item setting-item',
          });
          itemEl.createSpan({
            cls: 'cm-translator-index',
            text: `${counter.index++}.`,
          });

          const infoEl = itemEl.createDiv('setting-item-info');
          const nameEl = infoEl.createDiv('setting-item-name cm-translator-key');

          const keySpan = nameEl.createSpan();
          this.highlightMatch(keySpan, key, query);

          const descEl = infoEl.createDiv({
            cls: 'setting-item-description',
          });

          const isLongText = displayFallback.length > 100;
          const isDesc =
            newPath.endsWith('.desc') || newPath.endsWith('Desc') || newPath.includes('langInfo');

          if (isDesc && isLongText) {
            const truncatedText = displayFallback.substring(0, 100) + '...';

            this.highlightMatch(descEl, truncatedText, query);

            const toggleBtn = infoEl.createEl('a', {
              cls: 'cm-translator-toggle',
              text: t('modals.translator.showMore'),
            });

            let isExpanded = false;
            toggleBtn.onclick = () => {
              isExpanded = !isExpanded;
              const textToShow = isExpanded ? displayFallback : truncatedText;

              this.highlightMatch(descEl, textToShow, query);

              toggleBtn.setText(
                isExpanded ? t('modals.translator.showLess') : t('modals.translator.showMore'),
              );
            };
          } else {
            this.highlightMatch(descEl, displayFallback, query);
          }

          const controlEl = itemEl.createDiv('setting-item-control');

          // Use TextArea for long strings
          const isMultiLine = this.isLongString(displayFallback);
          const component = isMultiLine
            ? new TextAreaComponent(controlEl)
            : new TextComponent(controlEl);

          component
            .setValue(currentValue || '')
            .setPlaceholder(displayFallback)
            .onChange((value) => {
              if (value) {
                this.translations[newPath] = value;
              } else {
                delete this.translations[newPath];
              }
            });
        }
      }
    }
    return itemsRenderedInThisGroup;
  }

  highlightMatch(element: HTMLElement, text: string, query: string) {
    element.empty();

    if (!query) {
      element.setText(text);
      return;
    }

    try {
      const flags = this.caseSensitive ? 'g' : 'gi';
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedQuery, flags);

      let lastIndex = 0;
      let match;

      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          element.appendText(text.substring(lastIndex, match.index));
        }
        element.createSpan({ cls: 'cm-search-match', text: match[0] });

        lastIndex = regex.lastIndex;
      }

      if (lastIndex < text.length) {
        element.appendText(text.substring(lastIndex));
      }
    } catch {
      element.setText(text);
    }
  }

  isLongString(str: string): boolean {
    return str.length > 50 || str.includes('\n');
  }

  async handleSave() {
    if (!this.plugin.settings.customLanguages) {
      this.plugin.settings.customLanguages = {};
    }

    let finalTranslations = this.translations;

    // If it's a Core Language, save ONLY the differences (Deltas)
    if (this.isCoreLanguage) {
      const flatCoreLang = flattenStrings(
        CORE_LOCALES[this.langCode as LocaleCode] as unknown as Record<string, unknown>,
      );
      const diffs: CustomTranslation = {};

      for (const key in this.translations) {
        const currentValue = this.translations[key];
        const originalValue = flatCoreLang[key];

        // Save only if value is different from original AND not empty
        // If user cleared the text, we assume they want to revert to default (so we don't save it)
        if (currentValue !== originalValue && currentValue !== undefined) {
          diffs[key] = currentValue;
        }
      }

      // If no changes at all, we store an empty object (effectively restoring default)
      finalTranslations = diffs;
    }

    const finalLangName = this.langName;

    this.plugin.settings.customLanguages[this.langCode] = {
      languageName: finalLangName,
      translations: finalTranslations,
      isRtl: this.isRtl,
    };
    await this.plugin.saveSettings();

    if (this.plugin.settings.language === this.langCode) {
      loadLanguage(this.plugin.settings);
    }

    new Notice(t('notices.langSaved', this.langName));
    this.settingTab.display();
    this.close();
  }

  _exportLanguageFile() {
    const nestedData = unflattenStrings(this.translations);
    const data = JSON.stringify(nestedData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.langCode}.json`;
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
    new Notice(t('notices.langExported', this.langCode));
  }

  _importLanguageFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = () => {
      void (async () => {
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];

        try {
          const content = await file.text();
          const nestedJson = JSON.parse(content);
          const importedTranslations = flattenStrings(nestedJson) as CustomTranslation;

          this.translations = {
            ...this.translations,
            ...importedTranslations,
          };

          new Notice(t('notices.langImported', file.name));
          this.renderTranslationTree();
        } catch (e) {
          new Notice(t('notices.invalidJson'));
          console.error('Failed to import language file:', e);
        }
      })().catch((err) => {
        console.error('Unhandled file import error:', err);
      });
    };

    input.click();
  }

  _copyJson() {
    const nestedData = unflattenStrings(this.translations);
    const jsonText = JSON.stringify(nestedData, null, 2);

    void navigator.clipboard.writeText(jsonText).catch((err) => {
      console.error('Failed to copy JSON to clipboard:', err);
    });

    new Notice(t('notices.langCopiedJson'));
  }

  _pasteJson(): void {
    // run async safely
    void (async () => {
      try {
        const pastedText = await navigator.clipboard.readText();
        if (!pastedText) return;

        const nestedJson = JSON.parse(pastedText);
        const parsedJson = flattenStrings(nestedJson) as CustomTranslation;

        let updateCount = 0;
        for (const key in parsedJson) {
          if (Object.prototype.hasOwnProperty.call(parsedJson, key)) {
            if (this.fallbackStrings[key] !== undefined) {
              this.translations[key] = parsedJson[key];
              updateCount++;
            }
          }
        }

        new Notice(t('notices.langPastedJson', updateCount));
        this.renderTranslationTree();
      } catch (e) {
        new Notice(t('notices.invalidJson'));
        console.error('Failed to paste JSON from clipboard:', e);
      }
    })().catch((err) => {
      console.error('Unhandled paste JSON error:', err);
    });
  }

  onClose() {
    this.contentEl.empty();
  }
}
