import {
  App,
  Modal,
  Setting,
  ButtonComponent,
  Notice,
  setIcon,
  TextComponent,
  TextAreaComponent,
} from "obsidian";
import { t } from "../i18n";
import type ColorMaster from "../main";
import type { ColorMasterSettingTab } from "./settingsTab";
import type { Profile, Snippet, NoticeRule } from "../types";
import Sortable = require("sortablejs");

export class ProfileJsonImportModal extends Modal {
  plugin: ColorMaster;
  settingTab: ColorMasterSettingTab;
  textarea: HTMLTextAreaElement;

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
    this.modalEl.setAttribute(
      "dir",
      lang === "ar" || lang === "fa" ? "rtl" : "ltr"
    );

    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: t("IMPORT_JSON_MODAL_TITLE") });
    contentEl.createEl("p", {
      text: t("IMPORT_JSON_MODAL_DESC_1"),
    });
    this.textarea = contentEl.createEl("textarea", {
      cls: "cm-search-input",
      attr: { rows: "8", placeholder: t("IMPORT_JSON_MODAL_PLACEHOLDER") },
    });
    this.textarea.style.width = "100%";
    this.textarea.style.marginBottom = "15px";

    // File import button
    contentEl.createEl("p", {
      text: t("IMPORT_JSON_MODAL_DESC_2"),
    });
    contentEl.createEl("hr");
    new Setting(contentEl)
      .setName(t("IMPORT_JSON_MODAL_SETTING_NAME"))
      .setDesc(t("IMPORT_JSON_MODAL_SETTING_DESC"))
      .addButton((button) => {
        button.setButtonText(t("CHOOSE_FILE_BUTTON")).onClick(() => {
          this._handleFileImport();
        });
      });

    // Action buttons (Replace/Create New)
    const ctrl = contentEl.createDiv({ cls: "cm-profile-actions" });
    ctrl.createDiv({ cls: "cm-profile-action-spacer" });
    const replaceBtn = ctrl.createEl("button", {
      text: t("REPLACE_ACTIVE_BUTTON"),
      cls: "cm-profile-action-btn",
    });
    const createBtn = ctrl.createEl("button", {
      text: t("CREATE_NEW_BUTTON"),
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
        new Notice(t("NOTICE_FILE_LOADED", file.name));
      })();
    };
    input.click();
  }

  onClose() {
    this.contentEl.empty();
  }

  async _applyCreate() {
    const raw = this.textarea.value.trim();
    if (!raw) {
      new Notice(t("NOTICE_TEXTBOX_EMPTY"));
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      new Notice(t("NOTICE_INVALID_JSON"));
      return;
    }

    const newProfileName = parsed.name;
    const profileObj: Profile = parsed.profile ? parsed.profile : parsed;

    if (!newProfileName) {
      new Notice(t("NOTICE_JSON_MUST_HAVE_NAME"));
      return;
    }

    if (this.plugin.settings.profiles[newProfileName]) {
      new DuplicateProfileModal(
        this.app,
        this.plugin,
        newProfileName,
        profileObj,
        this.settingTab,
        (newName) => {
          this.plugin.settings.profiles[newName] = profileObj;
          this.plugin.settings.activeProfile = newName;
          this.plugin.saveSettings();
          this.settingTab.display();
          new Notice(t("NOTICE_PROFILE_CREATED_SUCCESS", newName));
        }
      ).open();

      this.close();
      return;
    }

    profileObj.noticeRules = profileObj.noticeRules || {
      text: [],
      background: [],
    };
    this.plugin.settings.profiles[newProfileName] = profileObj;
    this.plugin.settings.activeProfile = newProfileName;

    await this.plugin.saveSettings();
    this.settingTab.display();
    this.close();
    new Notice(t("NOTICE_PROFILE_CREATED_SUCCESS", newProfileName));
  }

  async _applyImport(mode: "replace") {
    const raw = this.textarea.value.trim();
    if (!raw) {
      new Notice(t("NOTICE_TEXTBOX_EMPTY"));
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      new Notice(t("NOTICE_INVALID_JSON"));
      return;
    }

    const profileObj = parsed.profile ? parsed.profile : parsed;
    if (typeof profileObj !== "object" || profileObj === null) {
      // Added null check for safety
      new Notice(t("NOTICE_INVALID_PROFILE_OBJECT"));
      return;
    }

    const activeName = this.plugin.settings.activeProfile;
    const activeProfile = this.plugin.settings.profiles[activeName];
    if (!activeProfile) {
      new Notice(t("NOTICE_PROFILE_NOT_FOUND"));
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
    new Notice(t("NOTICE_PROFILE_IMPORTED_SUCCESS", mode));
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
    this.modalEl.setAttribute(
      "dir",
      lang === "ar" || lang === "fa" ? "rtl" : "ltr"
    );

    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: t("NEW_PROFILE_TITLE") });

    let profileName = "";
    let themeType: "auto" | "dark" | "light" = "auto";

    new Setting(contentEl).setName(t("PROFILE_NAME_LABEL")).addText((text) => {
      text.setPlaceholder(t("PROFILE_NAME_PLACEHOLDER")).onChange((value) => {
        profileName = value;
      });
    });

    new Setting(contentEl)
      .setName(t("PROFILE_THEME_TYPE"))
      .setDesc(t("PROFILE_THEME_TYPE_DESC"))
      .addDropdown((dropdown) => {
        dropdown.addOption("auto", t("THEME_TYPE_AUTO"));
        dropdown.addOption("dark", t("THEME_TYPE_DARK"));
        dropdown.addOption("light", t("THEME_TYPE_LIGHT"));
        dropdown.setValue(themeType);
        dropdown.onChange((value: "auto" | "dark" | "light") => {
          themeType = value;
        });
      });

    const buttonContainer = contentEl.createDiv({
      cls: "modal-button-container",
      attr: { style: "justify-content: flex-end;" },
    });

    const cancelButton = buttonContainer.createEl("button", {
      text: t("CANCEL_BUTTON"),
    });
    cancelButton.addEventListener("click", () => this.close());

    const createButton = buttonContainer.createEl("button", {
      text: t("CREATE_BUTTON"),
      cls: "mod-cta",
    });

    const submit = () => {
      const trimmedName = profileName.trim();
      if (trimmedName) {
        this.onSubmit({ name: trimmedName, themeType: themeType });
        this.close();
        new Notice(t("NOTICE_PROFILE_CREATED", trimmedName));
      } else {
        new Notice(t("EMPTY_PROFILE_NAME_NOTICE"));
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
  message: string;
  onConfirm: () => void;
  confirmButtonText: string;
  confirmButtonClass: string;

  constructor(
    app: App,
    plugin: ColorMaster,
    title: string,
    message: string,
    onConfirm: () => void,
    options: { buttonText?: string; buttonClass?: string } = {}
  ) {
    super(app);
    this.plugin = plugin;
    this.modalEl.classList.add("color-master-modal");
    this.title = title;
    this.message = message;
    this.onConfirm = onConfirm;
    this.confirmButtonText = options.buttonText || t("DELETE_BUTTON");
    this.confirmButtonClass = options.buttonClass || "mod-warning";
  }

  onOpen() {
    const lang = this.plugin.settings.language;
    this.modalEl.setAttribute(
      "dir",
      lang === "ar" || lang === "fa" ? "rtl" : "ltr"
    );

    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: this.title });
    contentEl.createEl("p", { text: this.message });

    const buttonContainer = contentEl.createDiv({
      cls: "modal-button-container",
      attr: { style: "justify-content: flex-end;" },
    });

    const cancelButton = buttonContainer.createEl("button", {
      text: t("CANCEL_BUTTON"),
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
  existingSnippet: {
    name: string;
    css: string;
    id?: string;
    isProfile?: boolean;
  } | null;
  isEditing: boolean;
  saveType: "Profile" | "Snippet";
  modalTitleEl: HTMLHeadingElement;
  nameSetting: Setting;
  nameInput: TextComponent;
  cssTextarea: HTMLTextAreaElement;
  snippetName: string;

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
    existingSnippet: {
      name: string;
      css: string;
      id?: string;
      isProfile?: boolean;
    } | null = null,
    defaultSaveType: "Profile" | "Snippet" = "Profile"
  ) {
    super(app);
    this.modalEl.classList.add("color-master-modal");
    this.plugin = plugin;
    this.settingTab = settingTab;
    this.existingSnippet = existingSnippet;
    this.isEditing = !!existingSnippet;
    this.saveType = defaultSaveType;
    this.snippetName = existingSnippet ? existingSnippet.name : "";
  }

  _updateUIForSaveType(saveType: "Profile" | "Snippet") {
    if (this.isEditing) return;

    const isSnippet = saveType === "Snippet";
    const titleText = isSnippet
      ? t("CREATE_SNIPPET_TITLE")
      : t("IMPORT_PROFILE_TITLE");
    const nameLabel = isSnippet
      ? t("SNIPPET_NAME_LABEL")
      : t("PROFILE_NAME_LABEL");
    const namePlaceholder = isSnippet
      ? t("SNIPPET_NAME_PLACEHOLDER")
      : t("PROFILE_NAME_PLACEHOLDER");
    if (this.modalTitleEl) this.modalTitleEl.setText(titleText);
    if (this.nameSetting) this.nameSetting.setName(nameLabel);
    if (this.nameInput) this.nameInput.setPlaceholder(namePlaceholder);
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
        new Notice(t("NOTICE_FILE_LOADED", file.name));
      })();
    };
    input.click();
  }

  onOpen() {
    const lang = this.plugin.settings.language;
    this.modalEl.setAttribute(
      "dir",
      lang === "ar" || lang === "fa" ? "rtl" : "ltr"
    );

    const { contentEl } = this;
    contentEl.empty();

    const titleContainer = contentEl.createDiv({ cls: "cm-title-container" });

    let titleText = t("PASTE_CSS_MODAL_TITLE");
    if (this.isEditing && this.existingSnippet) {
      titleText = this.existingSnippet.isProfile
        ? t("EDIT_PROFILE_TITLE")
        : t("EDIT_SNIPPET_TITLE");
    }

    this.modalTitleEl = titleContainer.createEl("h3", { text: titleText });
    contentEl.createEl("p", { text: t("PASTE_CSS_MODAL_NOTE") });

    let saveType: "Profile" | "Snippet" = this.saveType || "Profile";

    if (!this.isEditing) {
      new Setting(contentEl)
        .setName(t("SAVE_AS_TYPE"))
        .setClass("cm-segmented-control-setting")
        .then((setting) => {
          const profileButton = setting.controlEl.createEl("button", {
            text: t("SAVE_AS_PROFILE"),
          });
          const snippetButton = setting.controlEl.createEl("button", {
            text: t("SAVE_AS_SNIPPET"),
          });

          setting.controlEl.classList.add("cm-segmented-control");
          const updateActiveButton = (activeType: "Profile" | "Snippet") => {
            profileButton.classList.toggle(
              "is-active",
              activeType === "Profile"
            );
            snippetButton.classList.toggle(
              "is-active",
              activeType === "Snippet"
            );
          };

          profileButton.addEventListener("click", () => {
            saveType = "Profile";
            updateActiveButton(saveType);
            this._updateUIForSaveType(saveType);
          });

          snippetButton.addEventListener("click", () => {
            saveType = "Snippet";
            updateActiveButton(saveType);
            this._updateUIForSaveType(saveType);
          });

          updateActiveButton(saveType);
        });
    }

    let nameLabelText = t("PROFILE_NAME_LABEL");
    if (
      this.isEditing &&
      this.existingSnippet &&
      !this.existingSnippet.isProfile
    ) {
      nameLabelText = t("SNIPPET_NAME_LABEL");
    }

    this.nameSetting = new Setting(contentEl)
      .setName(nameLabelText)
      .addText((text) => {
        this.nameInput = text;
        let placeholderText = t("PROFILE_NAME_PLACEHOLDER");
        if (this.isEditing && this.existingSnippet) {
          placeholderText = this.existingSnippet.isProfile
            ? t("PROFILE_NAME_PLACEHOLDER")
            : t("SNIPPET_NAME_PLACEHOLDER");
        } else if (!this.isEditing) {
          placeholderText =
            this.saveType === "Snippet"
              ? t("SNIPPET_NAME_PLACEHOLDER")
              : t("PROFILE_NAME_PLACEHOLDER");
        }

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
      .setName(t("IMPORT_FROM_FILE"))
      .setDesc(t("IMPORT_FROM_FILE_DESC"))
      .addButton((button) => {
        button.setButtonText(t("CHOOSE_FILE_BUTTON")).onClick(() => {
          this._handleFileImport();
        });
      });

    this.cssTextarea = contentEl.createEl("textarea", {
      cls: "cm-search-input",
      attr: { rows: "12", placeholder: t("CSS_TEXTAREA_PLACEHOLDER") },
    });
    this.cssTextarea.style.width = "100%";

    // Specify a unique identifier for the history (profile name or snippet id)
    const historyId =
      this.isEditing && this.existingSnippet
        ? this.existingSnippet.isProfile
          ? `profile-${this.existingSnippet.name}`
          : this.existingSnippet.id
        : null;

    const initialCss =
      this.isEditing && this.existingSnippet ? this.existingSnippet.css : "";

    // If there is an ID, it means we are modifying something that exists.
    if (historyId) {
      // Get the latest copy from memory, or use the saved copy if there is nothing in memory
      const lastState = this.plugin.cssHistory[historyId]?.undoStack.last();
      this.cssTextarea.value = lastState ?? initialCss;

      // If it was previously in a register, add the initial state to memory
      if (
        !this.plugin.cssHistory[historyId] ||
        this.plugin.cssHistory[historyId].undoStack.length === 0
      ) {
        this.plugin.pushCssHistory(historyId, initialCss);
      }
    } else {
      this.cssTextarea.value = initialCss;
    }

    const debouncedPushHistory = this._debounce((id, value) => {
      this.plugin.pushCssHistory(id, value);
    }, 500); // Wait 500ms after writing stops

    // Observe the writing inside the box
    this.cssTextarea.addEventListener("input", () => {
      if (historyId) {
        debouncedPushHistory(historyId, this.cssTextarea.value);
      }
    });

    // Monitor keyboard shortcuts
    this.cssTextarea.addEventListener("keydown", (e) => {
      if (historyId && e.ctrlKey) {
        if (e.key.toLowerCase() === "z") {
          e.preventDefault();
          const prevState = this.plugin.undoCssHistory(historyId);
          if (prevState !== null) {
            this.cssTextarea.value = prevState;
          }
        } else if (e.key.toLowerCase() === "y") {
          e.preventDefault(); // Prevent default browser behavior
          const nextState = this.plugin.redoCssHistory(historyId);
          if (nextState !== null) {
            this.cssTextarea.value = nextState;
          }
        }
      }
    });
    const buttonContainer = contentEl.createDiv({
      cls: "modal-button-container",
      attr: { style: "justify-content: flex-end;" },
    });

    buttonContainer
      .createEl("button", { text: t("CANCEL_BUTTON") })
      .addEventListener("click", () => this.close());

    buttonContainer
      .createEl("button", {
        text: this.isEditing ? t("UPDATE_BUTTON") : t("CREATE_BUTTON"),
        cls: "mod-cta",
      })
      .addEventListener("click", () => this.handleSave(saveType));

    this._updateUIForSaveType(saveType);
  }

  handleSave(saveType: "Profile" | "Snippet") {
    if (this.isEditing && !this.existingSnippet) {
      console.error(
        "Attempted to save in editing mode without an existing snippet."
      );
      return;
    }

    const cssText = this.cssTextarea.value.trim();
    let name = (this.snippetName || "").trim();

    if (!name) {
      new Notice(t("EMPTY_PROFILE_NAME_NOTICE"));
      return;
    }
    if (!cssText && saveType === "Snippet") {
      new Notice(t("NOTICE_CSS_CONTENT_EMPTY"));
      return;
    }

    const activeProfile =
      this.plugin.settings.profiles[this.plugin.settings.activeProfile];
    if (!activeProfile) return;

    if (!Array.isArray(activeProfile.snippets)) {
      activeProfile.snippets = [];
    }
    const snippetsArray = activeProfile.snippets;

    let isNameTaken = false;
    if (saveType === "Snippet") {
      isNameTaken = snippetsArray.some(
        (s) =>
          s.name.toLowerCase() === name.toLowerCase() &&
          (!this.isEditing ||
            (this.existingSnippet &&
              this.existingSnippet.name.toLowerCase() !== name.toLowerCase()))
      );
      if (isNameTaken) {
        new Notice(t("NOTICE_SNIPPET_NAME_EXISTS", name));
        return;
      }
    } else {
      isNameTaken = Object.keys(this.plugin.settings.profiles || {}).some(
        (profileName) =>
          profileName.toLowerCase() === name.toLowerCase() &&
          (!this.isEditing ||
            (this.existingSnippet &&
              this.existingSnippet.name.toLowerCase() !== name.toLowerCase()))
      );
      if (isNameTaken) {
        new Notice(t("NOTICE_PROFILE_NAME_EXISTS", name));
        return;
      }
    }

    if (this.isEditing && this.existingSnippet) {
      if (this.existingSnippet.isProfile) {
        const oldName = this.existingSnippet.name;
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
        new Notice(t("NOTICE_PROFILE_UPDATED", name));
      } else {
        const existing = snippetsArray.find(
          (s) => s.id === this.existingSnippet!.id // Using non-null assertion here is safe due to the check
        );
        if (existing) {
          existing.name = name;
          existing.css = cssText;
        }
        new Notice(t("NOTICE_SNIPPET_UPDATED", name));
      }
    } else {
      if (saveType === "Snippet") {
        snippetsArray.push({
          id: `snippet-${Date.now()}`,
          name: name,
          css: cssText,
          enabled: true,
        });
        new Notice(t("NOTICE_SNIPPET_CREATED", name));
      } else {
        this.plugin.settings.profiles[name] = {
          vars: {},
          themeType: "auto",
          isCssProfile: true,
          customCss: cssText,
          snippets: [],
        };
        this.plugin.settings.activeProfile = name;
        new Notice(t("NOTICE_PROFILE_CREATED_FROM_CSS", name));
      }
    }
    this.plugin.saveSettings().then(() => {
      this.plugin.applyCssSnippets();
      this.settingTab.display();
      this.close();
    });
  }

  onClose() {
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
    this.modalEl.setAttribute(
      "dir",
      lang === "ar" || lang === "fa" ? "rtl" : "ltr"
    );

    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.classList.add("color-master-modal", "cm-rules-modal");

    const title =
      this.ruleType === "text"
        ? t("ADVANCED_NOTICE_TEXT_RULES_TITLE")
        : t("ADVANCED_NOTICE_BG_RULES_TITLE");

    const headerContainer = contentEl.createDiv({
      cls: "cm-rules-modal-header",
    });
    const iconEl = headerContainer.createDiv({
      cls: "cm-rules-modal-header-icon",
    });
    setIcon(iconEl, "bell");
    headerContainer.createEl("h3", { text: title });
    const descAndButtonContainer = contentEl.createDiv({
      attr: {
        style:
          "display: flex; align-items: center; gap: 16px; margin-bottom: 15px;",
      },
    });

    descAndButtonContainer.createEl("p", {
      text: t("NOTICE_RULES_DESC"),
      cls: "cm-rules-modal-desc",
      attr: {
        style: "margin-bottom: 0; flex-grow: 1;",
      },
    });
    const buttonSettingContainer = descAndButtonContainer.createDiv();
    const settingEl = new Setting(buttonSettingContainer).addButton(
      (button) => {
        button
          .setButtonText(t("ADD_NEW_RULE"))
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

    settingEl.settingEl.style.padding = "0";
    settingEl.settingEl.style.borderTop = "none";

    this.rulesContainer = contentEl.createDiv("cm-rules-container");
    this.displayRules();

    const buttonContainer = contentEl.createDiv({
      cls: "modal-button-container",
    });

    buttonContainer
      .createEl("button", { text: t("CANCEL_BUTTON") })
      .addEventListener("click", () => this.close());

    buttonContainer
      .createEl("button", { text: t("APPLY_BUTTON"), cls: "mod-cta" })
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

        new Notice(t("SETTINGS_SAVED"));
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
        .setTooltip(t("DRAG_HANDLE_TOOLTIP") || "Drag to reorder");

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
        .setTooltip(t("TOOLTIP_SET_TRANSPARENT"))
        .onClick(() => {
          rule.color = "transparent";
          colorInput.classList.add("is-transparent");
        });

      const regexContainer = ruleEl.createDiv({ cls: "cm-regex-container" });
      regexContainer.createSpan({ text: t("USE_REGEX_LABEL") });
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
        .setTooltip(t("TOOLTIP_TEST_RULE"))
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
      container.innerHTML = "";
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
      inputEl.placeholder = t("KEYWORD_PLACEHOLDER");

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
    this.modalEl.setAttribute(
      "dir",
      lang === "ar" || lang === "fa" ? "rtl" : "ltr"
    );

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
    headerContainer.createEl("h3", { text: t("DUPLICATE_PROFILE_TITLE") });

    const descriptionFragment = new DocumentFragment();
    const [part1, part2] = t("DUPLICATE_PROFILE_DESC_PARTS");
    descriptionFragment.append(part1);
    descriptionFragment.createEl("strong", { text: this.existingName });
    descriptionFragment.append(part2);

    new Setting(contentEl).setDesc(descriptionFragment).addText((text) => {
      text
        .setPlaceholder(t("DUPLICATE_PROFILE_PLACEHOLDER"))
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
      .setButtonText(t("CANCEL_BUTTON"))
      .onClick(() => this.close());
    new ButtonComponent(buttonContainer)
      .setButtonText(t("CREATE_BUTTON"))
      .setCta()
      .onClick(() => this.handleConfirm());
  }

  handleConfirm() {
    if (!this.newName) {
      new Notice(t("EMPTY_PROFILE_NAME_NOTICE"));
      return;
    }
    if (this.plugin.settings.profiles[this.newName]) {
      new Notice(t("PROFILE_EXISTS_NOTICE", this.newName));
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
  }) => void;
  varName: string = "";
  varValue: string = "#ffffff";
  displayName: string = "";
  description: string = "";

  constructor(
    app: App,
    plugin: ColorMaster,
    settingTab: ColorMasterSettingTab,
    onSubmit: (details: {
      varName: string;
      varValue: string;
      displayName: string;
      description: string;
    }) => void
  ) {
    super(app);
    this.plugin = plugin;
    this.settingTab = settingTab;
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const lang = this.plugin.settings.language;
    this.modalEl.setAttribute(
      "dir",
      lang === "ar" || lang === "fa" ? "rtl" : "ltr"
    );

    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.classList.add("color-master-modal");
    contentEl.createEl("h3", { text: t("MODAL_CUSTOM_VAR_TITLE") });

    let displayNameInput: TextComponent;

    const varNameSetting = new Setting(contentEl)
      .setName(t("VARIABLE_NAME_LABEL"))
      .addText((text) => {
        text.setPlaceholder("--variable-name").onChange((value) => {
          this.varName = value.trim();
          const suggestedName = this.varName
            .replace(/^--/, "")
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
          if (displayNameInput) {
            displayNameInput.setValue(suggestedName);
          }
          this.displayName = suggestedName;
        });
      });

    varNameSetting.descEl.appendText(t("VARIABLE_NAME_DESC"));
    varNameSetting.descEl.createEl("br");
    const modalHelpContainer = varNameSetting.descEl.createEl("div", {
      cls: "cm-docs-link-container",
    });
    modalHelpContainer.appendText(t("HELP_TEXT_PRE_LINK"));
    modalHelpContainer.createEl("a", {
      href: "https://docs.obsidian.md/Reference/CSS+variables/Foundations/Colors",
      text: t("HELP_TEXT_LINK"),
      cls: "cm-docs-link",
      attr: {
        target: "_blank",
        rel: "noopener noreferrer",
      },
    });

    new Setting(contentEl).setName(t("COLOR_LABEL")).addColorPicker((color) => {
      color.setValue(this.varValue).onChange((value) => {
        this.varValue = value;
      });
    });

    new Setting(contentEl)
      .setName(t("DISPLAY_NAME_LABEL"))
      .setDesc(t("DISPLAY_NAME_DESC"))
      .addText((text) => {
        displayNameInput = text;
        text.setPlaceholder(t("PLACEHOLDER_DISPLAY_NAME")).onChange((value) => {
          this.displayName = value.trim();
        });
      });

    new Setting(contentEl)
      .setName(t("DESCRIPTION_LABEL"))
      .setDesc(t("DESCRIPTION_DESC"))
      .addTextArea((text) => {
        text.setPlaceholder(t("PLACEHOLDER_DESCRIPTION")).onChange((value) => {
          this.description = value.trim();
        });
        text.inputEl.rows = 3;
      });

    const buttonContainer = contentEl.createDiv({
      cls: "modal-button-container",
    });

    new ButtonComponent(buttonContainer)
      .setButtonText(t("CANCEL_BUTTON"))
      .onClick(() => this.close());

    new ButtonComponent(buttonContainer)
      .setButtonText(t("SAVE_BUTTON"))
      .setCta()
      .onClick(() => {
        const activeProfile =
          this.plugin.settings.profiles[this.plugin.settings.activeProfile];

        if (!this.varName) {
          new Notice(t("NOTICE_VAR_NAME_EMPTY"));
          return;
        }
        if (!this.varName.startsWith("--")) {
          new Notice(t("NOTICE_VAR_NAME_FORMAT"));
          return;
        }
        if (activeProfile.vars[this.varName]) {
          new Notice(t("NOTICE_VAR_EXISTS", this.varName));
          return;
        }

        const finalDisplayName = this.displayName || this.varName;

        this.onSubmit({
          varName: this.varName,
          varValue: this.varValue,
          displayName: finalDisplayName,
          description: this.description,
        });
        this.close();
      });
  }

  onClose() {
    this.contentEl.empty();
  }
}
