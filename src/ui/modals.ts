import {
  App,
  Modal,
  Setting,
  ButtonComponent,
  Notice,
  setIcon,
  TextComponent,
  TextAreaComponent,
  DropdownComponent,
} from "obsidian";
import { t } from "../i18n/strings";
import type ColorMaster from "../main";
import type { ColorMasterSettingTab } from "./settingsTab";
import type { Profile, Snippet, NoticeRule, CustomVarType } from "../types";
import Sortable = require("sortablejs");
import { DEFAULT_VARS } from "../constants";
import { flattenVars, debounce } from "../utils";

export class ProfileJsonImportModal extends Modal {
  plugin: ColorMaster;
  settingTab: ColorMasterSettingTab;
  textarea: HTMLTextAreaElement;
  nameInput: TextComponent;
  profileName: string = "";

  constructor(
    app: App,
    plugin: ColorMaster,
    settingTabInstance: ColorMasterSettingTab
  ) {
    super(app);
    this.modalEl.classList.add("color-master-modal");
    this.plugin = plugin;
    this.settingTab = settingTabInstance;
  }

  onOpen() {
    const lang = this.plugin.settings.language;
    const isRTL =
      (lang === "ar" || lang === "fa") && this.plugin.settings.useRtlLayout;
    this.modalEl.setAttribute("dir", isRTL ? "rtl" : "ltr");

    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: t("modals.jsonImport.title") });
    new Setting(contentEl)
      .setName(t("modals.newProfile.nameLabel"))
      .addText((text) => {
        this.nameInput = text;
        text
          .setPlaceholder(t("modals.newProfile.namePlaceholder"))
          .onChange((value) => {
            this.profileName = value.trim();
          });
      });
    contentEl.createEl("hr");

    contentEl.createEl("p", {
      text: t("modals.jsonImport.desc1"),
    });
    this.textarea = contentEl.createEl("textarea", {
      cls: "cm-search-input cm-import-textarea",
      attr: { rows: "12", placeholder: t("modals.jsonImport.placeholder") },
    });

    // File import button
    new Setting(contentEl)
      .setName(t("modals.jsonImport.settingName"))
      .setDesc(t("modals.jsonImport.settingDesc"))
      .addButton((button) => {
        button.setButtonText(t("buttons.chooseFile")).onClick(() => {
          this._handleFileImport();
        });
      });

    // Action buttons (Replace/Create New)
    const ctrl = contentEl.createDiv({ cls: "cm-profile-actions" });
    ctrl.createDiv({ cls: "cm-profile-action-spacer" });
    const replaceBtn = ctrl.createEl("button", {
      text: t("modals.jsonImport.replaceActiveButton"),
    });
    const createBtn = ctrl.createEl("button", {
      text: t("modals.jsonImport.createNewButton"),
      cls: "cm-profile-action-btn mod-cta",
    });

    replaceBtn.addEventListener(
      "click",
      () => void this._applyImport("replace")
    );
    createBtn.addEventListener("click", () => void this._applyCreate());
  }

  _handleFileImport() {
    const input = createEl("input", {
      type: "file",
      attr: { accept: ".json" },
    });
    input.onchange = () => {
      (async () => {
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];
        const content = await file.text();
        this.textarea.value = content;
        try {
          const parsed = JSON.parse(content);
          const profileNameFromJson =
            parsed.name ||
            file.name.replace(".profile.json", "").replace(".json", "");
          this.nameInput.setValue(profileNameFromJson);
          this.profileName = profileNameFromJson;
        } catch (e) {
          /* ignore json parsing errors here */
        }

        new Notice(t("notices.fileLoaded", file.name));
      })();
    };
    input.click();
  }

  onClose() {
    this.contentEl.empty();
  }

  async _applyCreate() {
    const name = this.profileName;
    if (!name) {
      new Notice(t("notices.varNameEmpty"));
      return;
    }

    if (this.plugin.settings.profiles[name]) {
      new Notice(t("notices.profileNameExists", name));
      return;
    }

    const raw = this.textarea.value.trim();
    if (!raw) {
      new Notice(t("notices.textboxEmpty"));
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      new Notice(t("notices.invalidJson"));
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
    new Notice(t("notices.profileCreatedSuccess", name));
  }
  async _applyImport(mode: "replace") {
    const raw = this.textarea.value.trim();
    if (!raw) {
      new Notice(t("notices.textboxEmpty"));
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      new Notice(t("notices.invalidJson"));
      return;
    }

    const profileObj = parsed.profile ? parsed.profile : parsed;
    if (typeof profileObj !== "object" || profileObj === null) {
      // Added null check for safety
      new Notice(t("notices.invalidProfileObject"));
      return;
    }

    const activeName = this.plugin.settings.activeProfile;
    const activeProfile = this.plugin.settings.profiles[activeName];
    if (!activeProfile) {
      new Notice(t("notices.profileNotFound"));
      return;
    }

    const importedVars = "vars" in profileObj ? profileObj.vars : {};
    const importedSnippets =
      "snippets" in profileObj ? profileObj.snippets : [];
    const themeType = "themeType" in profileObj ? profileObj.themeType : "auto";

    if (mode === "replace") {
      activeProfile.vars = importedVars as { [key: string]: string };
      activeProfile.snippets = importedSnippets as Snippet[];
      activeProfile.themeType = themeType as "auto" | "dark" | "light";
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
    new Notice(t("notices.profileImportedSuccess", mode));
  }
}

export class NewProfileModal extends Modal {
  onSubmit: (result: {
    name: string;
    themeType: "auto" | "dark" | "light";
  }) => void;
  plugin: ColorMaster;

  constructor(
    app: App,
    plugin: ColorMaster,
    onSubmit: (result: {
      name: string;
      themeType: "auto" | "dark" | "light";
    }) => void
  ) {
    super(app);
    this.plugin = plugin;
    this.modalEl.classList.add("color-master-modal");
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const lang = this.plugin.settings.language;
    const isRTL =
      (lang === "ar" || lang === "fa") && this.plugin.settings.useRtlLayout;
    this.modalEl.setAttribute("dir", isRTL ? "rtl" : "ltr");

    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: t("modals.newProfile.title") });

    let profileName = "";
    let themeType: "auto" | "dark" | "light" = "auto";

    new Setting(contentEl)
      .setName(t("modals.newProfile.nameLabel"))
      .addText((text) => {
        text
          .setPlaceholder(t("modals.newProfile.namePlaceholder"))
          .onChange((value) => {
            profileName = value;
          });
      });

    new Setting(contentEl)
      .setName(t("profileManager.themeType"))
      .setDesc(t("profileManager.themeTypeDesc"))
      .addDropdown((dropdown) => {
        dropdown.addOption("auto", t("profileManager.themeAuto"));
        dropdown.addOption("dark", t("profileManager.themeDark"));
        dropdown.addOption("light", t("profileManager.themeLight"));
        dropdown.setValue(themeType);
        dropdown.onChange((value: "auto" | "dark" | "light") => {
          themeType = value;
        });
      });

    const buttonContainer = contentEl.createDiv({
      cls: "modal-button-container",
    });

    const cancelButton = buttonContainer.createEl("button", {
      text: t("buttons.cancel"),
    });
    cancelButton.addEventListener("click", () => this.close());

    const createButton = buttonContainer.createEl("button", {
      text: t("buttons.create"),
      cls: "mod-cta",
    });

    const submit = () => {
      const trimmedName = profileName.trim();
      if (trimmedName) {
        this.onSubmit({ name: trimmedName, themeType: themeType });
        this.close();
        new Notice(t("notices.profileCreated", trimmedName));
      } else {
        new Notice(t("notices.varNameEmpty"));
      }
    };

    createButton.addEventListener("click", submit);

    contentEl
      .querySelector('input[type="text"]')
      ?.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          submit();
        }
      });
  }

  onClose() {
    this.contentEl.empty();
  }
}

export class ConfirmationModal extends Modal {
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
    options: { buttonText?: string; buttonClass?: string } = {}
  ) {
    super(app);
    this.plugin = plugin;
    this.modalEl.classList.add("color-master-modal");
    this.title = title;
    this.message = message;
    this.onConfirm = onConfirm;
    this.confirmButtonText = options.buttonText || t("buttons.delete");
    this.confirmButtonClass = options.buttonClass || "mod-warning";
  }

  onOpen() {
    const lang = this.plugin.settings.language;
    const isRTL =
      (lang === "ar" || lang === "fa") && this.plugin.settings.useRtlLayout;
    this.modalEl.setAttribute("dir", isRTL ? "rtl" : "ltr");

    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: this.title });
    contentEl.createEl("p").append(this.message);

    const buttonContainer = contentEl.createDiv({
      cls: "modal-button-container",
    });

    const cancelButton = buttonContainer.createEl("button", {
      text: t("buttons.cancel"),
    });
    cancelButton.addEventListener("click", () => this.close());

    const confirmButton = buttonContainer.createEl("button", {
      text: this.confirmButtonText,
      cls: this.confirmButtonClass,
    });
    confirmButton.addEventListener("click", () => {
      this.onConfirm();
      this.close();
    });
  }

  onClose() {
    this.contentEl.empty();
  }
}

export class PasteCssModal extends Modal {
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
    } | null = null
  ) {
    super(app);
    this.modalEl.classList.add("color-master-modal");
    this.plugin = plugin;
    this.settingTab = settingTab;
    this.existingProfileData = existingProfileData;
    this.isEditing = !!existingProfileData;
    this.profileName = existingProfileData ? existingProfileData.name : "";
  }

  _handleFileImport() {
    const input = createEl("input", {
      type: "file",
      attr: { accept: ".css" },
    });
    input.onchange = () => {
      (async () => {
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];
        const content = await file.text();
        this.cssTextarea.value = content;
        new Notice(t("notices.fileLoaded", file.name));
      })();
    };
    input.click();
  }

  onOpen() {
    const lang = this.plugin.settings.language;
    const isRTL =
      (lang === "ar" || lang === "fa") && this.plugin.settings.useRtlLayout;
    this.modalEl.setAttribute("dir", isRTL ? "rtl" : "ltr");

    const { contentEl } = this;
    contentEl.empty();

    const titleContainer = contentEl.createDiv({ cls: "cm-title-container" });

    const titleText = this.isEditing
      ? t("modals.cssImport.titleEdit")
      : t("modals.cssImport.title");

    this.modalTitleEl = titleContainer.createEl("h3", { text: titleText });

    const installedThemes = (this.app as any).customCss.themes || {};
    const themeNames = Object.keys(installedThemes);
    let selectedTheme = themeNames.length > 0 ? themeNames[0] : "";

    const themeImporterEl = new Setting(contentEl)
      .setName(t("modals.cssImport.importFromTheme"))
      .setDesc(t("modals.cssImport.importFromThemeDesc"));
    themeImporterEl.settingEl.addClass("cm-theme-importer-setting");

    themeImporterEl.addDropdown((dropdown) => {
      if (themeNames.length > 0) {
        themeNames.forEach((themeName) => {
          dropdown.addOption(themeName, themeName);
        });
        dropdown.onChange((value) => {
          selectedTheme = value;
        });
      } else {
        dropdown.addOption("", t("modals.cssImport.noThemes"));
        dropdown.setDisabled(true);
      }
    });

    themeImporterEl.addButton((button) => {
      button
        .setButtonText(t("buttons.import"))
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
            new Notice(t("notices.themeCssLoaded", selectedTheme));
          } catch (error) {
            new Notice(t("notices.themeReadFailed", selectedTheme));
            console.error(
              `Color Master: Failed to read theme CSS at ${themePath}`,
              error
            );
          }
        });
    });

    let nameLabelText = t("modals.newProfile.nameLabel");
    this.nameSetting = new Setting(contentEl)
      .setName(nameLabelText)
      .addText((text) => {
        this.nameInput = text;
        let placeholderText = t("modals.newProfile.namePlaceholder");

        text
          .setValue(
            this.isEditing && this.existingProfileData
              ? this.existingProfileData.name
              : ""
          )
          .setPlaceholder(placeholderText)
          .onChange((value) => {
            this.profileName = value.trim();
          });
      });

    this.cssTextarea = contentEl.createEl("textarea", {
      cls: "cm-search-input cm-large-textarea",
      attr: {
        rows: "12",
        placeholder: t("modals.snippetEditor.cssPlaceholder"),
      },
    });

    contentEl.createDiv({
      text: t("modals.cssImport.note"),
      cls: "cm-modal-warning-note",
    });
    new Setting(contentEl)
      .setName(t("modals.cssImport.importFromFile"))
      .setDesc(t("modals.cssImport.importFromFileDesc"))
      .addButton((button) => {
        button.setButtonText(t("buttons.chooseFile")).onClick(() => {
          this._handleFileImport();
        });
      });

    const historyId =
      this.isEditing && this.existingProfileData
        ? `profile-${this.existingProfileData.name}`
        : null;

    const initialCss =
      this.isEditing && this.existingProfileData
        ? this.existingProfileData.css
        : "";

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

    this.cssTextarea.addEventListener("input", () => {
      if (historyId) {
        debouncedPushHistory(historyId, this.cssTextarea.value);
      }
    });

    this.cssTextarea.addEventListener("keydown", (e) => {
      if (historyId && e.ctrlKey) {
        if (e.key.toLowerCase() === "z") {
          e.preventDefault();
          const prevState = this.plugin.undoCssHistory(historyId);
          if (prevState !== null) {
            this.cssTextarea.value = prevState;
          }
        } else if (e.key.toLowerCase() === "y") {
          e.preventDefault();
          const nextState = this.plugin.redoCssHistory(historyId);
          if (nextState !== null) {
            this.cssTextarea.value = nextState;
          }
        }
      }
    });
    const buttonContainer = contentEl.createDiv({
      cls: "modal-button-container",
    });

    buttonContainer
      .createEl("button", { text: t("buttons.cancel") })
      .addEventListener("click", () => this.close());

    buttonContainer
      .createEl("button", {
        text: this.isEditing ? t("buttons.update") : t("buttons.create"),
        cls: "mod-cta",
      })
      .addEventListener("click", () => this.handleSave());
    setTimeout(() => this.nameInput.inputEl.focus(), 0);
  }

  handleSave() {
    if (this.isEditing && !this.existingProfileData) {
      console.error(
        "Attempted to save in editing mode without an existing snippet."
      );
      return;
    }

    const cssText = this.cssTextarea.value.trim();
    let name = (this.profileName || "").trim();

    if (!name) {
      new Notice(t("notices.varNameEmpty"));
      return;
    }

    const activeProfile =
      this.plugin.settings.profiles[this.plugin.settings.activeProfile];
    if (!activeProfile) return;

    const isNameTaken = Object.keys(this.plugin.settings.profiles || {}).some(
      (profileName) =>
        profileName.toLowerCase() === name.toLowerCase() &&
        (!this.isEditing ||
          (this.existingProfileData &&
            this.existingProfileData.name.toLowerCase() !== name.toLowerCase()))
    );
    if (isNameTaken) {
      new Notice(t("notices.profileNameExists", name));
      return;
    }

    if (this.isEditing && this.existingProfileData) {
      // Logic for editing a CSS-based profile
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
      };
      this.plugin.settings.activeProfile = name;
      new Notice(t("notices.profileUpdated", name));
    } else {
      // Logic for creating a new CSS-based profile
      this.plugin.settings.profiles[name] = {
        vars: {},
        themeType: "auto",
        isCssProfile: true,
        customCss: cssText,
        snippets: [],
      };
      this.plugin.settings.activeProfile = name;
      new Notice(t("notices.profileCreatedFromCss", name));
    }

    this.isSaving = true;
    this.plugin.saveSettings().then(() => {
      this.plugin.applyCssSnippets();
      this.settingTab.display();
      this.close();
    });
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

export class SnippetCssModal extends Modal {
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

  _debounce(func: (...args: any[]) => void, delay: number) {
    let timeout: number;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => func.apply(this, args), delay);
    };
  }

  constructor(
    app: App,
    plugin: ColorMaster,
    settingTab: ColorMasterSettingTab,
    existingSnippet: Snippet | null = null
  ) {
    super(app);
    this.modalEl.classList.add("color-master-modal");
    this.plugin = plugin;
    this.settingTab = settingTab;
    this.existingSnippet = existingSnippet;
    this.isEditing = !!existingSnippet;
    this.snippetName = existingSnippet ? existingSnippet.name : "";
    this.isGlobalSnippet = existingSnippet ? !!existingSnippet.isGlobal : false;
  }

  _handleFileImport() {
    const input = createEl("input", {
      type: "file",
      attr: { accept: ".css" },
    });
    input.onchange = () => {
      (async () => {
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];
        const content = await file.text();
        this.cssTextarea.inputEl.value = content;
        new Notice(t("notices.fileLoaded", file.name));
      })();
    };
    input.click();
  }

  onOpen() {
    const lang = this.plugin.settings.language;
    const isRTL =
      (lang === "ar" || lang === "fa") && this.plugin.settings.useRtlLayout;
    this.modalEl.setAttribute("dir", isRTL ? "rtl" : "ltr");

    const { contentEl } = this;
    contentEl.empty();

    const titleContainer = contentEl.createDiv({ cls: "cm-title-container" });

    let titleText = this.isEditing
      ? t("modals.snippetEditor.titleEdit")
      : t("modals.snippetEditor.title");

    this.modalTitleEl = titleContainer.createEl("h3", { text: titleText });

    const installedSnippets = (this.app as any).customCss.snippets || [];
    let selectedSnippet =
      installedSnippets.length > 0 ? installedSnippets[0] : "";

    const snippetImporterEl = new Setting(contentEl)
      .setName(t("modals.snippetEditor.importFromSnippet"))
      .setDesc(t("modals.snippetEditor.importFromSnippetDesc"));
    snippetImporterEl.settingEl.addClass("cm-theme-importer-setting");

    snippetImporterEl.addDropdown((dropdown) => {
      if (installedSnippets.length > 0) {
        installedSnippets.forEach((snippetName: string) => {
          dropdown.addOption(snippetName, snippetName);
        });
        dropdown.onChange((value) => {
          selectedSnippet = value;
        });
      } else {
        dropdown.addOption("", t("modals.snippetEditor.noSnippets"));
        dropdown.setDisabled(true);
      }
    });

    snippetImporterEl.addButton((button) => {
      button
        .setButtonText(t("buttons.import"))
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
            new Notice(t("notices.snippetLoaded", selectedSnippet));
          } catch (error) {
            new Notice(t("notices.snippetReadFailed", selectedSnippet));
            console.error(
              `Color Master: Failed to read snippet CSS at ${snippetPath}`,
              error
            );
          }
        });
    });

    const nameLabelText = t("modals.snippetEditor.nameLabel");

    this.nameSetting = new Setting(contentEl)
      .setName(nameLabelText)
      .addText((text) => {
        this.nameInput = text;
        let placeholderText = t("modals.snippetEditor.namePlaceholder");

        text
          .setValue(
            this.isEditing && this.existingSnippet
              ? this.existingSnippet.name
              : ""
          )
          .setPlaceholder(placeholderText)
          .onChange((value) => {
            this.snippetName = value.trim();
          });
      });

    new Setting(contentEl)
      .setName(t("snippets.globalName"))
      .setDesc(t("snippets.globalDesc"))
      .addToggle((toggle) => {
        toggle.setValue(this.isGlobalSnippet).onChange((value) => {
          this.isGlobalSnippet = value;
        });
      });

    this.cssTextarea = new TextAreaComponent(contentEl);
    contentEl.createDiv({
      text: t("modals.cssImport.note"),
      cls: "cm-modal-warning-note",
    });

    new Setting(contentEl)
      .setName(t("modals.cssImport.importFromFile"))
      .setDesc(t("modals.cssImport.importFromFileDesc"))
      .addButton((button) => {
        button.setButtonText(t("buttons.chooseFile")).onClick(() => {
          this._handleFileImport();
        });
      });

    this.cssTextarea.inputEl.classList.add(
      "cm-search-input",
      "cm-large-textarea"
    );
    this.cssTextarea.inputEl.rows = 12;
    this.cssTextarea.setPlaceholder(t("modals.snippetEditor.cssPlaceholder"));

    const historyId =
      this.isEditing && this.existingSnippet ? this.existingSnippet.id : null;

    const initialCss =
      this.isEditing && this.existingSnippet ? this.existingSnippet.css : "";

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

    this.cssTextarea.inputEl.addEventListener("keydown", (e: KeyboardEvent) => {
      if (historyId && e.ctrlKey) {
        if (e.key.toLowerCase() === "z") {
          e.preventDefault();
          const prevState = this.plugin.undoCssHistory(historyId);
          if (prevState !== null) {
            this.cssTextarea.setValue(prevState);
          }
        } else if (e.key.toLowerCase() === "y") {
          e.preventDefault();
          const nextState = this.plugin.redoCssHistory(historyId);
          if (nextState !== null) {
            this.cssTextarea.setValue(nextState);
          }
        }
      }
    });
    const buttonContainer = contentEl.createDiv({
      cls: "modal-button-container",
    });

    buttonContainer
      .createEl("button", { text: t("buttons.cancel") })
      .addEventListener("click", () => this.close());

    buttonContainer
      .createEl("button", {
        text: this.isEditing ? t("buttons.update") : t("buttons.create"),
        cls: "mod-cta",
      })
      .addEventListener("click", () => this.handleSave());
    setTimeout(() => this.nameInput.inputEl.focus(), 0);
  }

  handleSave() {
    const cssText = this.cssTextarea.getValue().trim();
    const name = (this.snippetName || "").trim();

    if (!name) {
      new Notice(t("notices.varNameEmpty"));
      return;
    }
    if (!cssText) {
      new Notice(t("notices.cssContentEmpty"));
      return;
    }

    const activeProfile =
      this.plugin.settings.profiles[this.plugin.settings.activeProfile];
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
        (!this.isEditing ||
          (this.existingSnippet && this.existingSnippet.id !== s.id))
    );

    if (isNameTaken) {
      new Notice(t("notices.snippetNameExists", name));
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

      const snippetIndex = originalList.findIndex(
        (s) => s.id === this.existingSnippet!.id
      );

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
        new Notice(t("notices.snippetUpdated", name));
      }
    } else {
      targetList.push({
        id: `snippet-${Date.now()}`,
        name: name,
        css: cssText,
        enabled: true,
        isGlobal: this.isGlobalSnippet,
      });
      new Notice(t("notices.snippetCreated", name));
    }

    this.isSaving = true;
    this.plugin.saveSettings().then(() => {
      this.plugin.applyCssSnippets();
      this.settingTab.display();
      this.close();
    });
  }

  onClose() {
    // If the save button is not pressed
    if (!this.isSaving) {
      const historyId =
        this.isEditing && this.existingSnippet ? this.existingSnippet.id : null;
      // If there is a temporary date delete it.
      if (historyId && this.plugin.cssHistory[historyId]) {
        delete this.plugin.cssHistory[historyId];
      }
    }
    this.contentEl.empty();
  }
}

export class NoticeRulesModal extends Modal {
  plugin: ColorMaster;
  settingTab: ColorMasterSettingTab;
  ruleType: "text" | "background";
  localRules: NoticeRule[];
  newlyAddedRuleId: string | null = null;
  rulesContainer: HTMLElement;
  sortable: Sortable | null = null;

  constructor(
    app: App,
    plugin: ColorMaster,
    settingTab: ColorMasterSettingTab,
    ruleType: "text" | "background"
  ) {
    super(app);
    this.plugin = plugin;
    this.settingTab = settingTab;
    this.ruleType = ruleType; // 'text' or 'background'
    const activeProfile =
      this.plugin.settings.profiles[this.plugin.settings.activeProfile];
    this.localRules = JSON.parse(
      JSON.stringify(activeProfile?.noticeRules?.[this.ruleType] || [])
    );
    if (this.localRules.length === 0) {
      this.localRules.push({
        id: `rule-${Date.now()}`,
        keywords: "",
        color: this.ruleType === "text" ? "#ffffff" : "#444444",
        isRegex: false,
      });
    }
  }

  onOpen() {
    const lang = this.plugin.settings.language;
    const isRTL =
      (lang === "ar" || lang === "fa") && this.plugin.settings.useRtlLayout;
    this.modalEl.setAttribute("dir", isRTL ? "rtl" : "ltr");

    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.classList.add("color-master-modal", "cm-rules-modal");

    const title =
      this.ruleType === "text"
        ? t("modals.noticeRules.titleText")
        : t("modals.noticeRules.titleBg");

    const headerContainer = contentEl.createDiv({
      cls: "cm-rules-modal-header",
    });
    const iconEl = headerContainer.createDiv({
      cls: "cm-rules-modal-header-icon",
    });
    setIcon(iconEl, "bell");
    headerContainer.createEl("h3", { text: title });
    const descAndButtonContainer = contentEl.createDiv({
      cls: "cm-rules-header",
    });

    descAndButtonContainer.createEl("p", {
      text: t("modals.noticeRules.desc"),
      cls: "cm-rules-modal-desc",
    });
    const buttonSettingContainer = descAndButtonContainer.createDiv();
    const settingEl = new Setting(buttonSettingContainer).addButton(
      (button) => {
        button
          .setButtonText(t("modals.noticeRules.addNewRule"))
          .setCta()
          .onClick(() => {
            const newRule: NoticeRule = {
              id: `rule-${Date.now()}`,
              keywords: "",
              color: this.ruleType === "text" ? "#ffffff" : "#444444",
              isRegex: false,
            };
            this.localRules.push(newRule);

            this.newlyAddedRuleId = newRule.id;

            this.displayRules();
          });
      }
    );

    settingEl.settingEl.classList.add("cm-rules-add-button-setting");

    this.rulesContainer = contentEl.createDiv("cm-rules-container");
    this.displayRules();

    const buttonContainer = contentEl.createDiv({
      cls: "modal-button-container",
    });

    buttonContainer
      .createEl("button", { text: t("buttons.cancel") })
      .addEventListener("click", () => this.close());

    buttonContainer
      .createEl("button", { text: t("buttons.apply"), cls: "mod-cta" })
      .addEventListener("click", async () => {
        const allTagInputs =
          this.rulesContainer.querySelectorAll<HTMLInputElement>(
            ".cm-tag-input-field"
          );
        allTagInputs.forEach((inputEl, index) => {
          const newKeyword = inputEl.value.trim().replace(/,/g, "");
          if (newKeyword) {
            const rule = this.localRules[index];
            if (rule) {
              const keywords =
                typeof rule.keywords === "string" && rule.keywords
                  ? rule.keywords
                      .split(",")
                      .map((k) => k.trim())
                      .filter(Boolean)
                  : [];

              if (!keywords.includes(newKeyword)) {
                rule.keywords = [...keywords, newKeyword].join(",");
              }
            }
          }
        });
        const activeProfile =
          this.plugin.settings.profiles[this.plugin.settings.activeProfile];
        if (!activeProfile.noticeRules)
          activeProfile.noticeRules = { text: [], background: [] };
        activeProfile.noticeRules[this.ruleType] = this.localRules;
        await this.plugin.saveSettings();
        this.plugin.liveNoticeRules = null;
        this.plugin.liveNoticeRuleType = null;

        new Notice(t("notices.settingsSaved"));
        this.close();
      });
  }

  displayRules() {
    const container = this.rulesContainer;
    container.empty();

    this.localRules.forEach((rule, index) => {
      const ruleEl = container.createDiv({ cls: "cm-rule-item" });
      ruleEl.dataset.ruleId = rule.id;

      if (this.newlyAddedRuleId && rule.id === this.newlyAddedRuleId) {
        ruleEl.classList.add("newly-added");
        this.newlyAddedRuleId = null;
      }

      const actionButtonsContainer = ruleEl.createDiv({
        cls: "cm-rule-actions",
      });

      const moveButtons = actionButtonsContainer.createDiv({
        cls: "cm-rule-action-buttons",
      });

      const handleBtn = new ButtonComponent(moveButtons)
        .setIcon("grip-vertical")
        .setTooltip(t("tooltips.dragReorder"));

      handleBtn.buttonEl.classList.add("cm-drag-handle");
      handleBtn.buttonEl.addEventListener("mousedown", (e) => {
        e.stopPropagation();
      });

      actionButtonsContainer.createDiv({
        cls: "cm-rule-order-number",
        text: `${index + 1}`,
      });

      const tagInputWrapper = ruleEl.createDiv({
        cls: "cm-rule-input-wrapper",
      });
      this._createTagInput(tagInputWrapper, rule);

      const colorContainer = ruleEl.createDiv({ cls: "cm-color-container" });

      const colorInput = colorContainer.createEl("input", { type: "color" });
      colorInput.value = rule.color;
      if (rule.color && rule.color.toLowerCase() === "transparent") {
        colorInput.classList.add("is-transparent");
      }
      colorInput.addEventListener("input", (evt) => {
        rule.color = (evt.target as HTMLInputElement).value;
        this.plugin.liveNoticeRules = this.localRules;
        this.plugin.liveNoticeRuleType = this.ruleType;
        colorInput.classList.remove("is-transparent");
      });

      new ButtonComponent(colorContainer)
        .setIcon("eraser")
        .setClass("cm-rule-icon-button")
        .setTooltip(t("tooltips.setTransparent"))
        .onClick(() => {
          rule.color = "transparent";
          colorInput.classList.add("is-transparent");
        });

      const regexContainer = ruleEl.createDiv({ cls: "cm-regex-container" });
      regexContainer.createSpan({ text: t("modals.noticeRules.useRegex") });
      const regexCheckbox = regexContainer.createEl("input", {
        type: "checkbox",
      });
      regexCheckbox.checked = rule.isRegex;
      regexCheckbox.addEventListener("change", () => {
        rule.isRegex = regexCheckbox.checked;
      });

      new ButtonComponent(ruleEl)
        .setIcon("bell")
        .setClass("cm-rule-icon-button")
        .setTooltip(t("tooltips.testRule"))
        .onClick(() => {
          this._handleTestRule(rule);
        });

      new ButtonComponent(ruleEl)
        .setIcon("trash")
        .setClass("cm-rule-icon-button")
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
        console.warn("Could not destroy sortable instance", e);
      }
      this.sortable = null;
    }

    if (!Sortable) {
      console.warn("Color Master: SortableJS not found, drag & drop disabled.");
      return;
    }

    this.sortable = new Sortable(this.rulesContainer, {
      handle: ".cm-drag-handle",
      animation: 160,
      ghostClass: "cm-rule-ghost",
      dataIdAttr: "data-rule-id",
      onEnd: (evt: Sortable.SortableEvent) => {
        const { oldIndex, newIndex } = evt;
        if (oldIndex === newIndex || oldIndex == null || newIndex == null)
          return;

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
    const container = parentEl.createDiv({ cls: "cm-tag-input-container" });

    const renderTags = () => {
      container.empty();
      const keywords =
        typeof rule.keywords === "string" && rule.keywords
          ? rule.keywords
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean)
          : [];

      keywords.forEach((keyword, index) => {
        const tagEl = container.createDiv({ cls: "cm-tag-item" });
        tagEl.dataset.keyword = keyword;
        tagEl.createSpan({ cls: "cm-tag-text", text: keyword });
        const removeEl = tagEl.createSpan({
          cls: "cm-tag-remove",
          text: "×",
        });
        removeEl.addEventListener("click", (e) => {
          e.stopPropagation();
          keywords.splice(index, 1);
          rule.keywords = keywords.join(",");
          renderTags();
        });
      });

      const inputEl = container.createEl("input", {
        type: "text",
        cls: "cm-tag-input-field",
      });
      inputEl.placeholder = t("modals.noticeRules.keywordPlaceholder");

      const addKeywordFromInput = () => {
        const newKeyword = inputEl.value.trim().replace(/,/g, "");
        if (!newKeyword) return;

        const keywords =
          typeof rule.keywords === "string" && rule.keywords
            ? rule.keywords
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean)
            : [];

        const keywordsLower = keywords.map((k) => k.toLowerCase());
        const newKeywordLower = newKeyword.toLowerCase();

        if (!keywordsLower.includes(newKeywordLower)) {
          rule.keywords = [...keywords, newKeyword].join(",");
          renderTags();
        } else {
          const existingTagEl = container.querySelector(
            `.cm-tag-item[data-keyword="${
              keywords[keywordsLower.indexOf(newKeywordLower)]
            }"]`
          );
          if (existingTagEl) {
            existingTagEl.classList.add("cm-tag-duplicate-flash");
            setTimeout(() => {
              existingTagEl.classList.remove("cm-tag-duplicate-flash");
            }, 700);
          }
          inputEl.value = "";
        }
      };

      inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          addKeywordFromInput();
        } else if (e.key === "Backspace" && inputEl.value === "") {
          if (keywords.length > 0) {
            keywords.pop();
            rule.keywords = keywords.join(",");
            renderTags();
          }
        }
      });

      inputEl.addEventListener("blur", addKeywordFromInput);

      inputEl.focus();
    };

    container.addEventListener("click", () => {
      container.querySelector<HTMLInputElement>(".cm-tag-input-field")?.focus();
    });

    renderTags();
  }
  _handleDeleteRule(index: number) {
    const ruleEl = this.rulesContainer.children[index];
    if (!ruleEl) return;

    ruleEl.classList.add("removing");

    setTimeout(() => {
      if (this.localRules.length === 1) {
        this.localRules.splice(index, 1);
        const newRule: NoticeRule = {
          id: `rule-${Date.now()}`,
          keywords: "",
          color: this.ruleType === "text" ? "#ffffff" : "#444444",
          isRegex: false,
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
    const keywordsString = rule.keywords || "";
    if (!keywordsString.trim()) {
      new Notice("This rule has no keywords to test.");
      return;
    }

    const keywordsArray = keywordsString
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    if (keywordsArray.length === 0) {
      new Notice("This rule has no keywords to test.");
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
    const text = t("NOTICE_TEST_SENTENCE", sequentialKeyword).split(
      new RegExp(`(${sequentialKeyword})`, "i")
    );

    fragment.append(text[0]);

    const keywordSpan = fragment.createSpan({
      cls: "cm-test-keyword",
      text: text[1],
    });
    fragment.append(keywordSpan);
    fragment.append(text[2] || "");
    new Notice(fragment);
  }
}

export class DuplicateProfileModal extends Modal {
  plugin: ColorMaster;
  existingName: string;
  parsedProfile: Profile;
  settingTab: ColorMasterSettingTab;
  onSubmit: (newName: string) => void;
  newName: string = "";

  constructor(
    app: App,
    plugin: ColorMaster,
    existingName: string,
    parsedProfile: Profile,
    settingTab: ColorMasterSettingTab,
    onSubmit: (newName: string) => void
  ) {
    super(app);
    this.plugin = plugin;
    this.existingName = existingName;
    this.parsedProfile = parsedProfile;
    this.settingTab = settingTab;
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const lang = this.plugin.settings.language;
    const isRTL =
      (lang === "ar" || lang === "fa") && this.plugin.settings.useRtlLayout;
    this.modalEl.setAttribute("dir", isRTL ? "rtl" : "ltr");

    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.classList.add("color-master-modal", "cm-duplicate-modal");

    const headerContainer = contentEl.createDiv({
      cls: "cm-duplicate-modal-header",
    });
    const iconContainer = headerContainer.createDiv({
      cls: "cm-duplicate-modal-icon",
    });
    setIcon(iconContainer, "alert-triangle");
    headerContainer.createEl("h3", {
      text: t("modals.duplicateProfile.title"),
    });

    const descriptionFragment = new DocumentFragment();
    const [part1, part2] = t("modals.duplicateProfile.descParts") as [
      string,
      string
    ];
    descriptionFragment.append(part1);
    descriptionFragment.createEl("strong", { text: this.existingName });
    descriptionFragment.append(part2);

    new Setting(contentEl).setDesc(descriptionFragment).addText((text) => {
      text
        .setPlaceholder(t("modals.duplicateProfile.placeholder"))
        .onChange((value) => {
          this.newName = value.trim();
        });

      text.inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.handleConfirm();
        }
      });
    });

    const buttonContainer = contentEl.createDiv({
      cls: "modal-button-container",
    });
    new ButtonComponent(buttonContainer)
      .setButtonText(t("buttons.cancel"))
      .onClick(() => this.close());
    new ButtonComponent(buttonContainer)
      .setButtonText(t("buttons.create"))
      .setCta()
      .onClick(() => this.handleConfirm());
  }

  handleConfirm() {
    if (!this.newName) {
      new Notice(t("notices.varNameEmpty"));
      return;
    }
    if (this.plugin.settings.profiles[this.newName]) {
      new Notice(t("notices.profileNameExists", this.newName));
      return;
    }
    this.onSubmit(this.newName);
    this.close();
  }

  onClose() {
    this.contentEl.empty();
  }
}

export class CustomVariableMetaModal extends Modal {
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
  varName: string = "";
  varValue: string = "#ffffff"; // The default value will be color
  displayName: string = "";
  description: string = "";
  varType: CustomVarType = "color"; // Default type
  sizeUnit: string = "px";
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
    }) => void
  ) {
    super(app);
    this.plugin = plugin;
    this.settingTab = settingTab;
    this.onSubmit = onSubmit;
  }

  // A function to plot the input field based on the type
  renderValueInput(container: HTMLElement) {
    container.empty(); // Clean up the old field
    const valueSetting = new Setting(container)
      .setName(t("modals.customVar.varValue"))
      .setDesc(t("modals.customVar.varValueDesc"));

    switch (this.varType) {
      case "color":
        // If the current value is not a color, return it to default
        if (!this.varValue.match(/^(#|rgb|hsl|transparent)/)) {
          this.varValue = "#ffffff";
        }

        const colorPicker = valueSetting.controlEl.createEl("input", {
          type: "color",
        });
        const textInput = valueSetting.controlEl.createEl("input", {
          type: "text",
          cls: "color-master-text-input",
        });

        colorPicker.value = this.varValue;
        textInput.value = this.varValue;

        colorPicker.addEventListener("input", (e) => {
          const newColor = (e.target as HTMLInputElement).value;
          textInput.value = newColor;
          this.varValue = newColor;
        });
        textInput.addEventListener("change", (e) => {
          const newColor = (e.target as HTMLInputElement).value;
          colorPicker.value = newColor;
          this.varValue = newColor;
        });
        break;

      case "size":
        // If the current value is not a size, return it to the default
        if (!this.varValue.match(/^(-?\d+)(\.\d+)?(px|em|rem|%)$/)) {
          this.varValue = "10px";
        }

        // Extract the number and unit
        const sizeMatch = this.varValue.match(/(-?\d+)(\.\d+)?(\D+)/);
        let num = sizeMatch
          ? (sizeMatch[1] || "") + (sizeMatch[2] || "")
          : "10";
        let unit = sizeMatch ? sizeMatch[3] || "" : "px";
        if (!["px", "em", "rem", "%"].includes(unit)) unit = "px";
        this.sizeUnit = unit;

        const sizeInput = valueSetting.controlEl.createEl("input", {
          type: "number",
          cls: "color-master-text-input",
        });
        sizeInput.style.width = "80px";
        sizeInput.value = num;

        const unitDropdown = new DropdownComponent(valueSetting.controlEl);
        unitDropdown.addOption("px", "px");
        unitDropdown.addOption("em", "em");
        unitDropdown.addOption("rem", "rem");
        unitDropdown.addOption("%", "%");
        unitDropdown.setValue(this.sizeUnit);

        const updateSizeValue = () => {
          this.varValue = (sizeInput.value || "0") + this.sizeUnit;
        };
        sizeInput.addEventListener("change", updateSizeValue);
        unitDropdown.onChange((newUnit) => {
          this.sizeUnit = newUnit;
          updateSizeValue();
        });
        break;

      case "text":
        // Dump the value if the type is different
        if (this.varType !== "text") this.varValue = "";
        valueSetting.addTextArea((text) => {
          text
            .setValue(this.varValue)
            .setPlaceholder("modals.customVar.textValuePlaceholder")
            .onChange((value) => {
              this.varValue = value;
            });
          text.inputEl.style.width = "100%";
          text.inputEl.style.height = "80px";
        });
        break;

      case "number":
        // If the value is not a number, return it to 0
        if (isNaN(parseFloat(this.varValue))) this.varValue = "0";
        valueSetting.addText((text) => {
          text.inputEl.type = "number";
          text.setValue(this.varValue).onChange((value) => {
            this.varValue = value;
          });
        });
        break;
    }
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.classList.add("color-master-modal");

    const lang = this.plugin.settings.language;
    const isRTL =
      (lang === "ar" || lang === "fa") && this.plugin.settings.useRtlLayout;
    this.modalEl.setAttribute("dir", isRTL ? "rtl" : "ltr");

    contentEl.createEl("h3", { text: t("modals.customVar.title") });
    contentEl.createEl("p", { text: t("modals.customVar.desc") });

    new Setting(contentEl)
      .setName(t("modals.customVar.displayName"))
      .setDesc(t("modals.customVar.displayNameDesc"))
      .addText((text) =>
        text
          .setPlaceholder(t("modals.customVar.displayNamePlaceholder"))
          .setValue(this.displayName)
          .onChange((value) => {
            this.displayName = value;
          })
      );

    new Setting(contentEl)
      .setName(t("modals.customVar.varName"))
      .setDesc(t("modals.customVar.varNameDesc"))
      .addText((text) =>
        text
          .setPlaceholder(t("modals.customVar.varNamePlaceholder"))
          .setValue(this.varName)
          .onChange((value) => {
            if (value.length > 0 && !value.startsWith("--")) {
              if (value.startsWith("-")) {
                this.varName = "-" + value;
              } else {
                this.varName = "--" + value;
              }
            } else {
              this.varName = value;
            }
          })
      );

    new Setting(contentEl)
      .setName(t("modals.customVar.varType"))
      .setDesc(t("modals.customVar.varTypeDesc"))
      .addDropdown((dropdown) => {
        dropdown
          .addOption("color", t("modals.customVar.types.color"))
          .addOption("size", t("modals.customVar.types.size"))
          .addOption("text", t("modals.customVar.types.text"))
          .addOption("number", t("modals.customVar.types.number"))
          .setValue(this.varType)
          .onChange((value: CustomVarType) => {
            this.varType = value;

            switch (value) {
              case "color":
                this.varValue = "#ffffff";
                break;
              case "size":
                this.varValue = "10px";
                break;
              case "number":
                this.varValue = "0";
                break;
              case "text":
                this.varValue = "";
                break;
            }
            this.renderValueInput(this.valueInputContainer);
          });
      });

    this.valueInputContainer = contentEl.createDiv("cm-value-input-container");
    this.renderValueInput(this.valueInputContainer);

    // Description
    new Setting(contentEl)
      .setName(t("modals.customVar.description"))
      .setDesc(t("modals.customVar.descriptionDesc"))
      .addTextArea((text) =>
        text
          .setPlaceholder(t("modals.customVar.descriptionPlaceholder"))
          .setValue(this.description)
          .onChange((value) => {
            this.description = value;
          })
      );

    // Buttons
    new Setting(contentEl)
      .setClass("modal-button-container")
      .addButton((button) =>
        button.setButtonText(t("buttons.cancel")).onClick(() => this.close())
      )
      .addButton((button) =>
        button
          .setButtonText(t("modals.customVar.addVarButton"))
          .setCta()
          .onClick(() => {
            const trimmedVarName = this.varName.trim();

            if (!trimmedVarName.startsWith("--")) {
              new Notice(t("notices.varNameFormat"));
              return;
            }
            if (!this.displayName.trim()) {
              new Notice(t("notices.varNameEmpty"));
              return;
            }

            const allDefaultVars = Object.keys(flattenVars(DEFAULT_VARS));
            const activeProfile =
              this.plugin.settings.profiles[this.plugin.settings.activeProfile];
            const allProfileVars = Object.keys(activeProfile.vars || {});
            const allVarNames = new Set([...allDefaultVars, ...allProfileVars]);

            if (allVarNames.has(trimmedVarName)) {
              new Notice(t("notices.varExists", trimmedVarName));
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
          })
      );
  }

  onClose() {
    this.contentEl.empty();
  }
}

export class LanguageSettingsModal extends Modal {
  plugin: ColorMaster;

  constructor(app: App, plugin: ColorMaster) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    this.modalEl.classList.add("color-master-modal");
    const { contentEl } = this;
    const lang = this.plugin.settings.language;
    this.modalEl.setAttribute(
      "dir",
      (lang === "ar" || lang === "fa") && this.plugin.settings.useRtlLayout
        ? "rtl"
        : "ltr"
    );

    contentEl.empty();
    contentEl.createEl("h3", {
      text: t("settings.languageSettingsModalTitle"),
    });

    new Setting(contentEl)
      .setName(t("settings.rtlLayoutName"))
      .setDesc(t("settings.rtlLayoutDesc"))
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.useRtlLayout)
          .onChange(async (value) => {
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

export class IconizeSettingsModal extends Modal {
  plugin: ColorMaster;

  constructor(app: App, plugin: ColorMaster) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    this.modalEl.classList.add("color-master-modal");
    const { contentEl } = this;
    const lang = this.plugin.settings.language;
    this.modalEl.setAttribute(
      "dir",
      (lang === "ar" || lang === "fa") && this.plugin.settings.useRtlLayout
        ? "rtl"
        : "ltr"
    );

    contentEl.empty();
    contentEl.createEl("h3", { text: t("options.iconizeModalTitle") });

    new Setting(contentEl)
      .setName(t("options.overrideIconizeName"))
      .setDesc(t("options.overrideIconizeDesc"))
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.overrideIconizeColors)
          .onChange(async (value) => {
            if (value) {
              const iconizeIDs = ["obsidian-icon-folder", "iconize"];
              const pluginManager = (this.app as any).plugins;
              const isIconizeInstalled = iconizeIDs.some(
                (id: string) => !!pluginManager.getPlugin(id)
              );

              if (!isIconizeInstalled) {
                new Notice(t("notices.iconizeNotFound"));
                toggle.setValue(false);
                return;
              }
            }
            this.plugin.settings.overrideIconizeColors = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(contentEl)
      .setName(t("options.cleanupIntervalName"))
      .setDesc(t("options.cleanupIntervalDesc"))
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

export class BackgroundImageSettingsModal extends Modal {
  plugin: ColorMaster;

  constructor(app: App, plugin: ColorMaster) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    this.modalEl.classList.add("color-master-modal");
    const { contentEl } = this;
    const lang = this.plugin.settings.language;
    const activeProfile =
      this.plugin.settings.profiles[this.plugin.settings.activeProfile];

    this.modalEl.setAttribute(
      "dir",
      (lang === "ar" || lang === "fa") && this.plugin.settings.useRtlLayout
        ? "rtl"
        : "ltr"
    );

    contentEl.empty();
    contentEl.createEl("h3", {
      text: t("options.backgroundModalSettingsTitle"),
    });

    // --- Enable/Disable Toggle ---
    new Setting(contentEl)
      .setName(t("options.backgroundEnableName"))
      .setDesc(t("options.backgroundEnableDesc"))
      .addToggle((toggle) => {
        const isCurrentlyEnabled = activeProfile?.backgroundEnabled !== false;
        toggle.setValue(isCurrentlyEnabled).onChange(async (value) => {
          const profile =
            this.plugin.settings.profiles[this.plugin.settings.activeProfile];
          if (profile) {
            profile.backgroundEnabled = value;
            await this.plugin.saveSettings();
          }
          this.onOpen(); // Redraw the window
        });
      });

    const settingTypeSetting = new Setting(contentEl).setName(
      t("options.settingType")
    );

    let imageButton: ButtonComponent;
    let videoButton: ButtonComponent;

    const imageSettingsEl = contentEl.createDiv("cm-settings-group");
    imageSettingsEl.style.display = "none"; // It starts hidden

    const videoSettingsEl = contentEl.createDiv("cm-settings-group");
    videoSettingsEl.style.display = "none"; // It starts hidden

    // --- Fill the Image Settings container ---
    new Setting(imageSettingsEl)
      .setName(t("options.convertImagesName"))
      .setDesc(t("options.convertImagesDesc"))
      .addToggle((toggle) => {
        toggle
          .setValue(activeProfile?.convertImagesToJpg || false)
          .onChange(async (value) => {
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
        .setName(t("options.jpgQualityName"))
        .setDesc(t("options.jpgQualityDesc"))
        .addSlider((slider) => {
          slider
            .setLimits(1, 100, 1)
            .setValue(activeProfile?.jpgQuality || 85)
            .setDynamicTooltip()
            .onChange(async (value) => {
              this.debouncedSaveSettings(value);
            });
        });
    }

    // --- Fill the video settings container (it is still hidden) ---
    new Setting(videoSettingsEl)
      .setName(t("options.videoOpacityName"))
      .setDesc(t("options.videoOpacityDesc"))
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
          const videoEl = document.getElementById(
            "cm-background-video"
          ) as HTMLVideoElement;
          if (videoEl) {
            videoEl.style.opacity = value.toString();
          }
        };
      });

    new Setting(videoSettingsEl)
      .setName(t("options.videoMuteName"))
      .setDesc(t("options.videoMuteDesc"))
      .addToggle((toggle) =>
        toggle
          .setValue(activeProfile.videoMuted !== false)
          .onChange(async (value) => {
            activeProfile.videoMuted = value;
            await this.plugin.saveSettings();

            const videoEl = document.getElementById(
              "cm-background-video"
            ) as HTMLVideoElement;
            if (videoEl) {
              videoEl.muted = value;
            }
          })
      );

    // --- Attaching buttons to containers ---
    const setActiveButton = (active: "image" | "video") => {
      if (active === "image") {
        imageButton.setCta();
        videoButton.buttonEl.classList.remove("mod-cta");
        imageSettingsEl.style.display = "block";
        videoSettingsEl.style.display = "none";
      } else {
        imageButton.buttonEl.classList.remove("mod-cta");
        videoButton.setCta();
        imageSettingsEl.style.display = "none";
        videoSettingsEl.style.display = "block";
      }
    };

    settingTypeSetting.addButton((button) => {
      imageButton = button;
      button
        .setButtonText(t("options.settingTypeImage"))
        .onClick(() => setActiveButton("image"));
    });

    settingTypeSetting.addButton((button) => {
      videoButton = button;
      button
        .setButtonText(t("options.settingTypeVideo"))
        .onClick(() => setActiveButton("video"));
    });

    const currentType = activeProfile?.backgroundType || "image";
    setActiveButton(currentType);
  }

  debouncedSaveSettings = debounce(async (value: number) => {
    const profile =
      this.plugin.settings.profiles[this.plugin.settings.activeProfile];
    if (profile) {
      profile.jpgQuality = value;
      await this.plugin.saveSettings();
      new Notice("notices.jpgQualitySet");
    }
  }, 500);

  debounce(func: (...args: any[]) => void, wait: number) {
    let timeout: NodeJS.Timeout | null;
    return (...args: any[]) => {
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
export class FileConflictModal extends Modal {
  plugin: ColorMaster;
  arrayBuffer: ArrayBuffer; // The image data to save
  fileName: string; // The conflicting filename
  onResolve: (choice: "replace" | "keep") => void; // Callback with user's choice

  constructor(
    app: App,
    plugin: ColorMaster,
    arrayBuffer: ArrayBuffer,
    fileName: string,
    onResolve: (choice: "replace" | "keep") => void
  ) {
    super(app);
    this.plugin = plugin;
    this.arrayBuffer = arrayBuffer;
    this.fileName = fileName;
    this.onResolve = onResolve;
    this.modalEl.classList.add("color-master-modal");
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl("h3", { text: t("modals.fileConflict.title") });
    contentEl.createEl("p", {
      text: t("modals.fileConflict.desc", this.fileName),
    });

    const buttonContainer = contentEl.createDiv({
      cls: "modal-button-container",
    });

    // Replace Button
    new ButtonComponent(buttonContainer)
      .setButtonText(t("modals.fileConflict.replaceButton"))

      .onClick(async () => {
        this.onResolve("replace");
        this.close();
      });

    // Keep Both Button
    new ButtonComponent(buttonContainer)
      .setButtonText(t("modals.fileConflict.keepButton"))
      .setCta()
      .onClick(async () => {
        this.onResolve("keep");
        this.close();
      });
  }

  onClose() {
    this.contentEl.empty();
  }
}

// Modal for adding a new background image via file upload, paste, or drag/drop
export class AddBackgroundModal extends Modal {
  plugin: ColorMaster;
  settingTab: ColorMasterSettingTab;

  constructor(
    app: App,
    plugin: ColorMaster,
    settingTab: ColorMasterSettingTab
  ) {
    super(app);
    this.plugin = plugin;
    this.settingTab = settingTab;
    this.modalEl.classList.add("color-master-modal");
  }

  // Process pasted image files
  async handlePastedFile(file: File) {
    new Notice(`Pasted image "${file.name}"`);
    await this.processFileWithProgress(file);
  }

  // Process pasted URLs (http/https or data URLs)
  async handlePastedUrl(url: string) {
    const pasteBox = this.contentEl.querySelector(
      ".cm-paste-box"
    ) as HTMLElement;

    // Handle data URLs directly
    if (url.startsWith("data:image")) {
      try {
        if (pasteBox) {
          pasteBox.textContent = t("modals.addBackground.processing") + "...";
        }
        const response = await fetch(url);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const fileName = `pasted-image-${Date.now()}.${
          blob.type.split("/")[1] || "png"
        }`;
        new Notice("Pasted Base64 image");

        await this.plugin.setBackgroundMedia(arrayBuffer, fileName, "prompt");
        this.close();
        return; // Exit after handling
      } catch (error) {
        new Notice(t("notices.backgroundLoadError"));
        console.error("Color Master: Error handling pasted data URL:", error);
        this.close();
        return; // Exit on error
      }
    }

    // Handle regular URLs
    if (url.startsWith("http://") || url.startsWith("https://")) {
      new Notice(`Downloading from ${url}...`);
      if (pasteBox) {
        // Show processing (no percentage)
        pasteBox.textContent = t("modals.addBackground.processing") + "...";
      }
      await this.plugin.setBackgroundMediaFromUrl(url); // Use dedicated function
      this.close();
      return; // Exit after handling
    }
    // If neither type matched
    new Notice(t("notices.pasteError"));
  }

  // Read file as ArrayBuffer, update progress, and call setBackgroundImage
  async processFileWithProgress(file: File) {
    const reader = new FileReader();
    const pasteBox = this.contentEl.querySelector(
      ".cm-paste-box"
    ) as HTMLElement;

    // Update progress text in paste box
    reader.onprogress = (event) => {
      if (event.lengthComputable && pasteBox) {
        const percent = Math.round((event.loaded / event.total) * 100);
        pasteBox.textContent =
          t("modals.addBackground.processing") + `${percent}%`;
      }
    };

    // On successful load, pass data to main plugin function
    reader.onload = async () => {
      if (pasteBox) {
        pasteBox.textContent = t("modals.addBackground.processing") + " 100%";
      }
      const arrayBuffer = reader.result as ArrayBuffer;
      await this.plugin.setBackgroundMedia(arrayBuffer, file.name, "prompt");
      this.close(); // Close modal on success
    };

    // Handle read errors
    reader.onerror = () => {
      new Notice(t("notices.backgroundLoadError"));
      this.close();
    };

    // Start reading the file
    if (pasteBox) {
      pasteBox.textContent = t("modals.addBackground.processing") + "0%";
    }
    reader.readAsArrayBuffer(file);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    const lang = this.plugin.settings.language;
    this.modalEl.setAttribute(
      "dir",
      (lang === "ar" || lang === "fa") && this.plugin.settings.useRtlLayout
        ? "rtl"
        : "ltr"
    );

    contentEl.createEl("h3", { text: t("modals.addBackground.title") });

    // --- File Import Button ---
    new Setting(contentEl)
      .setName(t("modals.addBackground.importFromFile"))
      .setDesc(t("modals.addBackground.importFromFileDesc"))
      .addButton((button) => {
        // Hidden input element to handle file selection
        const input = createEl("input", {
          type: "file",
          attr: { accept: "image/*, video/mp4, video/webm" }, // Allow standard image types
        });

        button
          .setIcon("upload")
          .setCta()
          .setButtonText(t("buttons.chooseFile"))
          .onClick(() => {
            input.click(); // Open file dialog
          });

        input.onchange = async () => {
          if (!input.files || input.files.length === 0) return;
          const file = input.files[0];

          await this.processFileWithProgress(file); // Process selected file
        };
      });

    contentEl.createEl("hr");

    // --- Paste Box (URL or Image via Paste/DragDrop) ---
    const pasteBox = contentEl.createDiv({
      cls: "cm-paste-box",
      text: t("modals.addBackground.pasteBoxPlaceholder"),
    });
    pasteBox.setAttribute("contenteditable", "true"); // Allow paste

    pasteBox.addEventListener("paste", (event: ClipboardEvent) => {
      event.preventDefault();

      const clipboardData = event.clipboardData;
      if (!clipboardData) return;

      // Check for pasted files first
      if (clipboardData.files && clipboardData.files.length > 0) {
        const file = clipboardData.files[0];
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
          this.handlePastedFile(file);
          return;
        }
      }

      // Check for pasted text (URLs)
      const pastedText = clipboardData.getData("text/plain");
      if (
        pastedText &&
        (pastedText.startsWith("http://") ||
          pastedText.startsWith("https://") ||
          pastedText.startsWith("data:image"))
      ) {
        this.handlePastedUrl(pastedText);
        return;
      }
      // If neither worked
      new Notice(t("notices.backgroundPasteError"));
    });

    // --- Drag and Drop Listeners ---
    pasteBox.addEventListener("dragover", (event: DragEvent) => {
      event.preventDefault(); // Required to allow drop
      pasteBox.classList.add("is-over");
      pasteBox.textContent = t("modals.addBackground.dropToAdd");
    });

    pasteBox.addEventListener("dragleave", () => {
      pasteBox.classList.remove("is-over");
      pasteBox.textContent = t("modals.addBackground.pasteBoxPlaceholder");
    });

    pasteBox.addEventListener("drop", (event: DragEvent) => {
      event.preventDefault(); // Prevent default browser file handling
      pasteBox.classList.remove("is-over");
      pasteBox.textContent = t("modals.addBackground.pasteBoxPlaceholder");

      if (!event.dataTransfer) return;

      // Check for dropped files first
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        const file = event.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          this.handlePastedFile(file);
          return;
        }
      }

      // Check for dropped URLs (less common, but possible)
      const url =
        event.dataTransfer.getData("text/uri-list") ||
        event.dataTransfer.getData("text/plain");
      if (url && (url.startsWith("http") || url.startsWith("data:image"))) {
        this.handlePastedUrl(url);
        return;
      }
      // If neither worked
      new Notice(t("notices.backgroundPasteError"));
    });
  }

  onClose() {
    this.contentEl.empty();
  }
}

// Modal for browsing, selecting, renaming, and deleting background images for the active profile
export class ProfileImageBrowserModal extends Modal {
  plugin: ColorMaster;
  settingTab: ColorMasterSettingTab;
  closeCallback: () => void; // Used to potentially close the parent 'AddBackgroundModal'
  galleryEl: HTMLElement; // Container for image cards

  constructor(
    app: App,
    plugin: ColorMaster,
    settingTab: ColorMasterSettingTab,
    closeCallback: () => void
  ) {
    super(app);
    this.plugin = plugin;
    this.settingTab = settingTab;
    this.closeCallback = closeCallback; // Store the callback
    this.modalEl.classList.add("color-master-modal", "cm-image-browser-modal");
  }

  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: t("modals.backgroundBrowser.title") });

    this.galleryEl = contentEl.createDiv({ cls: "cm-image-gallery" });
    await this.displayImages(); // Load and display images
  }

  // Fetches and displays image cards in the gallery
  async displayImages() {
    this.galleryEl.empty();
    // Construct path to the global backgrounds folder
    const backgroundsPath = `.obsidian/backgrounds`;
    const mediaExtensions = [
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".webp",
      ".svg",
      ".mp4",
      ".webm",
    ];

    let files: string[] = [];
    try {
      // List files only if the profile's background folder exists
      if (await this.app.vault.adapter.exists(backgroundsPath)) {
        const list = await this.app.vault.adapter.list(backgroundsPath);
        files = list.files; // Get the list of file paths
      }
    } catch (e) {
      console.warn("Color Master: Error listing background folder.", e);
    }

    // Filter the list to include only supported image types
    const mediaFiles = files.filter((path) =>
      mediaExtensions.some((ext) => path.toLowerCase().endsWith(ext))
    );

    // Show empty state message if no images found
    if (mediaFiles.length === 0) {
      this.galleryEl.createDiv({
        cls: "cm-image-browser-empty",
        text: t("modals.backgroundBrowser.noImages"),
      });
      return;
    }

    // Create a card for each image file
    const activeProfile =
      this.plugin.settings.profiles[this.plugin.settings.activeProfile];
    const activeMediaPath = activeProfile?.backgroundPath;

    // Create a card for each image file
    for (const mediaPath of mediaFiles) {
      const cardEl = this.galleryEl.createDiv({ cls: "cm-image-card" });

      if (mediaPath === activeMediaPath) {
        cardEl.classList.add("is-active");
      }

      const mediaUrl = this.app.vault.adapter.getResourcePath(mediaPath);
      const fileName = mediaPath.split("/").pop();

      // --- 1. Image/Video Preview ---
      const isVideo =
        mediaPath.toLowerCase().endsWith(".mp4") ||
        mediaPath.toLowerCase().endsWith(".webm");

      const previewContainer = cardEl.createDiv({
        cls: "cm-media-preview-container",
      });

      if (isVideo) {
        const videoEl = previewContainer.createEl("video", {
          cls: "cm-image-card-preview",
          attr: {
            src: mediaUrl,
            muted: true,
            loop: true,
            playsinline: true,
            "data-path": mediaPath,
          },
        });

        const playOverlay = previewContainer.createDiv({
          cls: "cm-media-play-overlay",
        });
        setIcon(playOverlay, "play");

        previewContainer.addEventListener("click", () => {
          if (videoEl.paused) {
            videoEl.play();
            playOverlay.style.opacity = "0";
          } else {
            videoEl.pause();
            playOverlay.style.opacity = "1";
          }
        });
      } else {
        previewContainer.createEl("img", {
          cls: "cm-image-card-preview",
          attr: { src: mediaUrl, "data-path": mediaPath },
        });
      }
      // --- 2. Editable File Name (Basename + Extension) ---
      const nameSettingEl = cardEl.createDiv({
        cls: "setting-item cm-image-card-name-input",
      });
      const nameControlEl = nameSettingEl.createDiv({
        cls: "setting-item-control",
      });

      const nameInputContainer = nameControlEl.createDiv({
        cls: "cm-name-input-container",
      });
      const nameInput = nameInputContainer.createEl("input", {
        type: "text",
        cls: "cm-name-input-basename",
      });
      const extensionSpan = nameInputContainer.createSpan({
        cls: "cm-name-input-extension",
      });

      // Helper to safely split filename into basename and extension
      const splitName = (fullFileName: string) => {
        // Decode potential URI encoding in filenames
        const decodedName = decodeURIComponent(fullFileName || "");
        const lastDot = decodedName.lastIndexOf(".");
        // Check for valid extension (dot exists, not first char, content after dot)
        if (lastDot > 0 && lastDot < decodedName.length - 1) {
          return {
            basename: decodedName.substring(0, lastDot),
            ext: decodedName.substring(lastDot),
          };
        }
        // Fallback if no valid extension
        return { basename: decodedName, ext: "" };
      };

      let currentImagePath = mediaPath;
      let currentFileName = fileName || ""; // Track path locally for updates after rename

      // Set initial values
      let { basename, ext } = splitName(currentFileName);
      nameInput.value = basename;
      extensionSpan.setText(ext);

      // Select basename text on focus for easier editing
      nameInput.addEventListener("focus", (e) => {
        (e.target as HTMLInputElement).select();
      });

      // --- Save Rename Logic ---
      const saveName = async () => {
        const newBasename = nameInput.value.trim();
        const currentBasename = splitName(currentFileName).basename; // Split again to get current state

        // Only proceed if basename is valid and changed
        if (newBasename && newBasename !== currentBasename) {
          const newFullName = newBasename + ext; // Get current extension

          // Call main plugin rename function (returns new path or false)
          const renameResult = await this.plugin.renameBackgroundMedia(
            currentImagePath,
            newFullName
          );

          if (renameResult && typeof renameResult === "string") {
            // Update local state and necessary UI elements
            const newPath = renameResult;
            currentImagePath = newPath; // Update path for subsequent actions
            currentFileName = newPath.split("/").pop() || ""; // Update filename from the returned path
            const updatedSplit = splitName(currentFileName);
            basename = updatedSplit.basename; // Update displayed basename if needed
            // ext remains the same

            // Update associated elements (preview, buttons) without full redraw
            const imgEl = cardEl.querySelector(
              ".cm-image-card-preview"
            ) as HTMLImageElement | null;
            const selectBtn = cardEl.querySelector(
              ".cm-image-card-select-btn"
            ) as HTMLButtonElement | null;
            const deleteBtn = cardEl.querySelector(
              ".cm-image-card-delete-btn"
            ) as HTMLButtonElement | null;

            if (imgEl) {
              imgEl.src = this.app.vault.adapter.getResourcePath(newPath);
            }
            if (selectBtn) {
              selectBtn.onclick = () => this.selectMedia(newPath);
            }
            if (deleteBtn) {
              deleteBtn.onclick = () => this.deleteMedia(newPath, cardEl);
            }
          } else {
            // FAILURE - Revert input to the last known good basename
            nameInput.value = currentBasename;
          }
        } else {
          // If name empty or unchanged, ensure input reflects current basename
          nameInput.value = currentBasename;
        }
      };

      // Trigger save on Enter or losing focus
      nameInput.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          nameInput.blur(); // Trigger focusout event to save
        }
      });
      nameInput.addEventListener("focusout", () => {
        saveName(); // Triggers focusout
      });

      // --- 3. Action Buttons (Select/Delete) ---
      // Added directly to nameControlEl for inline display
      // Select Button (Icon + Tooltip)
      const controlsEl = cardEl.createDiv({ cls: "cm-image-card-controls" });

      // Select Button
      const selectButton = new ButtonComponent(controlsEl) // Add to name control container
        .setButtonText(t("buttons.select"))
        .setCta()
        .onClick(() => this.selectMedia(currentImagePath)); // Use current path
      selectButton.buttonEl.classList.add("cm-image-card-select-btn");

      // Delete Button
      const deleteButton = new ButtonComponent(controlsEl)
        .setIcon("trash")
        .setClass("mod-warning")
        .onClick(() => this.deleteMedia(currentImagePath, cardEl)); // Use currentImagePath
      deleteButton.buttonEl.classList.add("cm-image-card-delete-btn");
    }
  }

  // Action when user clicks the 'select' (check) button on an background card
  async selectMedia(path: string) {
    const fileExt = path.split(".").pop()?.toLowerCase();
    const mediaType: "image" | "video" =
      fileExt === "mp4" || fileExt === "webm" ? "video" : "image";

    await this.plugin.selectBackgroundMedia(path, mediaType);
    this.settingTab.display(); // Refresh settings tab
    this.closeCallback();
    this.close();
  }

  // Action when user clicks the 'delete' (trash) button on an image card
  async deleteMedia(path: string, cardEl: HTMLElement) {
    const fileName = path.split("/").pop();

    // Find all profiles using this specific image path
    const profilesUsingImage: string[] = [];
    for (const profileName in this.plugin.settings.profiles) {
      if (this.plugin.settings.profiles[profileName].backgroundPath === path) {
        profilesUsingImage.push(profileName);
      }
    }

    // Build the warning message
    const messageFragment = new DocumentFragment();
    messageFragment.append(t("modals.confirmation.deleteGlobalBgDesc"));

    if (profilesUsingImage.length > 0) {
      const profileListEl = messageFragment.createEl("ul", {
        cls: "cm-profile-list-modal",
      });
      profilesUsingImage.forEach((name) => {
        profileListEl.createEl("li").createEl("strong", { text: name });
      });
    }

    // Show confirmation dialog before deleting
    new ConfirmationModal(
      this.app,
      this.plugin,
      t("modals.confirmation.deleteBackgroundTitle"),
      messageFragment,
      async () => {
        await this.plugin.removeBackgroundMediaByPath(path);

        new Notice(t("notices.bgDeleted"));
        cardEl.remove();

        // Check if gallery is now empty
        if (this.galleryEl.childElementCount === 0) {
          this.galleryEl.createDiv({
            cls: "cm-image-browser-empty",
            text: t("modals.imageBrowser.noImages"),
          });
        }
        // Refresh settings tab in case we deleted the active image
        this.settingTab.display();
      },
      { buttonText: t("buttons.deleteAnyway"), buttonClass: "mod-warning" }
    ).open();
  }

  onClose() {
    this.contentEl.empty();
  }
}
