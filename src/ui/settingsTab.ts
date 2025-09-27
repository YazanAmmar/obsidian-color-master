import {
  App,
  ButtonComponent,
  PluginSettingTab,
  Setting,
  ToggleComponent,
  setIcon,
  Notice,
} from "obsidian";
import type ColorMaster from "../main";
import { t } from "../i18n";
import {
  BUILT_IN_PROFILES_VARS,
  DEFAULT_VARS,
  TEXT_TO_BG_MAP,
  COLOR_NAMES_AR,
  COLOR_NAMES,
  COLOR_DESCRIPTIONS_AR,
  COLOR_DESCRIPTIONS,
} from "../constants";
import {
  getContrastRatio,
  getAccessibilityRating,
  flattenVars,
} from "../utils";
import { drawProfileManager } from "./components/profile-manager";
import { drawImportExport } from "./components/import-export";
import { drawOptionsSection } from "./components/options-section";
import { drawCssSnippetsUI } from "./components/snippets-ui";
import { drawColorPickers } from "./components/color-pickers";
import { drawLikePluginCard } from "./components/like-plugin-card";
import Sortable = require("sortablejs");
import { COLOR_NAMES_FR, COLOR_DESCRIPTIONS_FR } from "../constants";
import { COLOR_NAMES_FA, COLOR_DESCRIPTIONS_FA } from "../constants";
import { LanguageSettingsModal } from "./modals";

export class ColorMasterSettingTab extends PluginSettingTab {
  plugin: ColorMaster;
  graphViewTempState: Record<string, string> | null;
  graphViewWorkingState: Record<string, string> | null;
  graphHeaderButtonsEl: HTMLElement | null;
  searchContainer: HTMLElement;
  searchInput: HTMLInputElement;
  caseToggle: HTMLButtonElement;
  regexToggle: HTMLButtonElement;
  sectionSelect: HTMLSelectElement;
  searchInfo: HTMLElement;
  clearBtn: HTMLButtonElement;
  _searchState: {
    query: string;
    regex: boolean;
    caseSensitive: boolean;
    section: string;
  };
  staticContentContainer: HTMLDivElement;
  resetPinBtn: ButtonComponent;
  pinBtn: ButtonComponent;
  snippetSortable: Sortable | null;

  constructor(app: App, plugin: ColorMaster) {
    super(app, plugin);
    this.plugin = plugin;
    this.graphViewTempState = null;
    this.graphViewWorkingState = null;
    this.graphHeaderButtonsEl = null;
    this.snippetSortable = null;
  }

  updateColorPickerAppearance(
    textInput: HTMLInputElement,
    colorPicker: HTMLInputElement
  ) {
    if (textInput.value.toLowerCase() === "transparent") {
      colorPicker.classList.add("is-transparent");
    } else {
      colorPicker.classList.remove("is-transparent");
    }
  }

  initSearchUI(containerEl: HTMLElement) {
    this.searchContainer = containerEl.createDiv({
      cls: "cm-search-container",
    });
    const left = this.searchContainer.createDiv({ cls: "cm-search-left" });
    const right = this.searchContainer.createDiv({ cls: "cm-search-controls" });
    const searchWrapper = left.createDiv({ cls: "cm-search-wrapper" });
    const iconEl = searchWrapper.createDiv({ cls: "cm-search-icon" });
    setIcon(iconEl, "search");

    this.searchInput = searchWrapper.createEl("input", {
      cls: "cm-search-input",
      type: "search",
      placeholder: t("SEARCH_PLACEHOLDER"),
    });

    this.caseToggle = right.createEl("button", {
      cls: "cm-search-small",
      text: "Aa",
    });
    this.caseToggle.setAttr("aria-label", t("ARIA_LABEL_CASE_SENSITIVE"));

    this.regexToggle = right.createEl("button", {
      cls: "cm-search-small",
      text: "/ /",
    });
    this.regexToggle.setAttr("aria-label", t("ARIA_LABEL_REGEX_SEARCH"));

    this.sectionSelect = right.createEl("select", { cls: "cm-search-small" });
    this.sectionSelect.createEl("option", {
      value: "",
      text: t("ALL_SECTIONS"),
    });

    try {
      Object.keys(DEFAULT_VARS || {}).forEach((category) => {
        const translatedCategory =
          t(category.toUpperCase().replace(/ /g, "_")) || category;
        this.sectionSelect.createEl("option", {
          value: category,
          text: translatedCategory,
        });
      });
    } catch (e) {}

    const activeProfile =
      this.plugin.settings.profiles[this.plugin.settings.activeProfile];
    if (
      activeProfile?.customVarMetadata &&
      Object.keys(activeProfile.customVarMetadata).length > 0
    ) {
      this.sectionSelect.createEl("option", {
        value: "Custom",
        text: t("CUSTOM_VARIABLES_HEADING"),
      });
    }

    this.searchInfo = right.createEl("div", {
      cls: "cm-search-info",
      text: " ",
    });
    this.clearBtn = right.createEl("button", {
      cls: "cm-search-small cm-search-icon-button",
    });
    const brushIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brush-cleaning-icon lucide-brush-cleaning"><path d="m16 22-1-4"/><path d="M19 13.99a1 1 0 0 0 1-1V12a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v.99a1 1 0 0 0 1 1"/><path d="M5 14h14l1.973 6.767A1 1 0 0 1 20 22H4a1 1 0 0 1-.973-1.233z"/><path d="m8 22 1-4"/></svg>`;
    const parser = new DOMParser();
    const iconDoc = parser.parseFromString(brushIconSvg, "image/svg+xml");

    if (iconDoc.documentElement) {
      this.clearBtn.appendChild(iconDoc.documentElement);
    }

    this.clearBtn.setAttr("aria-label", t("CLEAR_BUTTON"));
    this._searchState = {
      query: "",
      regex: false,
      caseSensitive: false,
      section: "",
    };

    const debouncedFilter = this._debounce(
      () => this._applySearchFilter(),
      180
    );

    this.searchInput.addEventListener("input", (e: Event) => {
      this._searchState.query = (e.target as HTMLInputElement).value;
      debouncedFilter();
    });
    this.caseToggle.addEventListener("click", () => {
      this._searchState.caseSensitive = !this._searchState.caseSensitive;
      this.caseToggle.toggleClass("is-active", this._searchState.caseSensitive);
      debouncedFilter();
    });
    this.regexToggle.addEventListener("click", () => {
      this._searchState.regex = !this._searchState.regex;
      this.regexToggle.toggleClass("is-active", this._searchState.regex);
      debouncedFilter();
    });
    this.sectionSelect.addEventListener("change", (e: Event) => {
      this._searchState.section = (e.target as HTMLSelectElement).value;
      debouncedFilter();
    });
    this.clearBtn.addEventListener("click", () => {
      this.searchInput.value = "";
      this.sectionSelect.value = "";
      this._searchState = {
        query: "",
        regex: false,
        caseSensitive: false,
        section: "",
      };
      this.caseToggle.removeClass("is-active");
      this.regexToggle.removeClass("is-active");
      this._applySearchFilter();
    });

    this._applySearchFilter();
  }

  _debounce(fn: (...args: any[]) => void, ms = 200) {
    let t: NodeJS.Timeout | null = null;
    return (...args: any[]) => {
      if (t) clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  _applySearchFilter() {
    const s = this._searchState;
    if (this.staticContentContainer) {
      const isSearching = s.query.trim().length > 0 || s.section !== "";
      this.staticContentContainer.toggleClass("cm-hidden", isSearching);
    }
    const rows = Array.from(
      this.containerEl.querySelectorAll(".cm-var-row, .cm-searchable-row")
    ) as HTMLElement[];

    let visibleCount = 0;
    let qRegex: RegExp | null = null;

    if (s.query && s.query.trim()) {
      if (s.regex) {
        try {
          qRegex = new RegExp(s.query, s.caseSensitive ? "" : "i");
        } catch (e) {
          qRegex = null;
        }
      }
    }

    rows.forEach((row) => {
      const varName = row.dataset.var || "";
      const snippetName = row.dataset.name || "";
      const textInput = row.querySelector(
        "input[type='text']"
      ) as HTMLInputElement;
      const varValue = textInput ? textInput.value.trim() : "";

      const lang = this.plugin.settings.language;
      const displayName =
        (lang === "ar"
          ? COLOR_NAMES_AR[varName as keyof typeof COLOR_NAMES_AR]
          : lang === "fa"
          ? COLOR_NAMES_FA[varName as keyof typeof COLOR_NAMES_FA]
          : lang === "fr"
          ? COLOR_NAMES_FR[varName as keyof typeof COLOR_NAMES_FR]
          : COLOR_NAMES[varName as keyof typeof COLOR_NAMES]) || snippetName;

      const description =
        (lang === "ar"
          ? COLOR_DESCRIPTIONS_AR[varName as keyof typeof COLOR_DESCRIPTIONS_AR]
          : lang === "fa"
          ? COLOR_DESCRIPTIONS_FA[varName as keyof typeof COLOR_DESCRIPTIONS_FA]
          : lang === "fr"
          ? COLOR_DESCRIPTIONS_FR[varName as keyof typeof COLOR_DESCRIPTIONS_FR]
          : COLOR_DESCRIPTIONS[varName as keyof typeof COLOR_DESCRIPTIONS]) ||
        "";

      if (s.section && s.section !== row.dataset.category) {
        row.classList.add("cm-hidden");
        return;
      }

      if (s.query && s.query.trim()) {
        const q = s.query.trim();
        let isMatch = false;

        if (s.regex && qRegex) {
          isMatch =
            qRegex.test(varName) ||
            qRegex.test(varValue) ||
            qRegex.test(displayName) ||
            qRegex.test(description);
        } else {
          const queryLower = s.caseSensitive ? q : q.toLowerCase();
          const nameLower = s.caseSensitive ? varName : varName.toLowerCase();
          const valueLower = s.caseSensitive
            ? varValue
            : varValue.toLowerCase();
          const displayNameLower = s.caseSensitive
            ? displayName
            : displayName.toLowerCase();
          const descriptionLower = s.caseSensitive
            ? description
            : description.toLowerCase();

          isMatch =
            nameLower.includes(queryLower) ||
            valueLower.includes(queryLower) ||
            displayNameLower.includes(queryLower) ||
            descriptionLower.includes(queryLower);
        }

        if (!isMatch) {
          row.classList.add("cm-hidden");
          return;
        }
      }

      row.classList.remove("cm-hidden");
      visibleCount++;
      this._highlightRowMatches(row, s);
    });

    const headings = this.containerEl.querySelectorAll(
      ".cm-category-container"
    ) as NodeListOf<HTMLElement>;
    headings.forEach((heading) => {
      const category = heading.dataset.category;
      const hasVisibleRows = this.containerEl.querySelector(
        `.cm-var-row[data-category="${category}"]:not(.cm-hidden)`
      );

      if (hasVisibleRows) {
        heading.classList.remove("cm-hidden");
      } else {
        heading.classList.add("cm-hidden");
      }
    });
    this.searchInfo.setText(t("SEARCH_RESULTS_FOUND", visibleCount));
  }

  _highlightRowMatches(row: HTMLElement, state: typeof this._searchState) {
    const query = state.query.trim();

    const highlightElement = (element: HTMLElement | null) => {
      if (!element) return;

      if (!element.dataset.originalText) {
        element.dataset.originalText = element.textContent || "";
      }
      const originalText = element.dataset.originalText;

      element.empty();

      if (!query) {
        element.setText(originalText);
        return;
      }

      const flags = state.caseSensitive ? "g" : "gi";
      let regex: RegExp;

      try {
        regex = state.regex
          ? new RegExp(query, flags)
          : new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);

        let lastIndex = 0;
        let match;

        while ((match = regex.exec(originalText)) !== null) {
          if (match.index > lastIndex) {
            element.appendText(originalText.substring(lastIndex, match.index));
          }
          element.createSpan({ cls: "cm-highlight", text: match[0] });
          lastIndex = regex.lastIndex;
        }

        if (lastIndex < originalText.length) {
          element.appendText(originalText.substring(lastIndex));
        }
      } catch (e) {
        element.setText(originalText);
      }
    };

    const nameEl = row.querySelector(".cm-var-name") as HTMLElement;
    const descEl = row.querySelector(
      ".setting-item-description"
    ) as HTMLElement;

    highlightElement(nameEl);
    highlightElement(descEl);
  }

  _updatePinButtons() {
    const name = this.plugin.settings.activeProfile;
    const snapshot = this.plugin.settings.pinnedSnapshots?.[name];

    if (this.resetPinBtn) {
      this.resetPinBtn
        .setTooltip(t("TOOLTIP_RESET_TO_PINNED"))
        .setDisabled(!snapshot);
    }

    if (this.pinBtn) {
      if (snapshot && snapshot.pinnedAt) {
        const dateObj = new Date(snapshot.pinnedAt);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const formattedDate = `${year}-${month}-${day}`;

        this.pinBtn.setTooltip(t("TOOLTIP_PIN_SNAPSHOT_DATE", formattedDate));
      } else {
        this.pinBtn.setTooltip(t("TOOLTIP_PIN_SNAPSHOT"));
      }
    }
  }

  _getCurrentProfileJson() {
    const p =
      this.plugin.settings.profiles?.[this.plugin.settings.activeProfile];
    if (!p) return null;
    return {
      name: this.plugin.settings.activeProfile,
      exportedAt: new Date().toISOString(),
      profile: p,
    };
  }

  async _copyProfileToClipboard() {
    const payload = this._getCurrentProfileJson();
    if (!payload) {
      new Notice(t("NOTICE_NO_ACTIVE_PROFILE_TO_COPY"));
      return;
    }
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    new Notice(t("NOTICE_JSON_COPIED_CLIPBOARD"));
  }

  _exportProfileToFile() {
    const payload = this._getCurrentProfileJson();
    if (!payload) {
      new Notice(t("NOTICE_NO_ACTIVE_PROFILE_TO_EXPORT"));
      return;
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `${this.plugin.settings.activeProfile}.profile.json`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
    new Notice(t("NOTICE_EXPORT_SUCCESS"));
  }

  // --- Smart update function for contrast checkers ---
  updateAccessibilityCheckers() {
    const activeProfileVars =
      this.plugin.settings.profiles[this.plugin.settings.activeProfile].vars;
    const allDefaultVars = flattenVars(DEFAULT_VARS);

    const checkerElements = this.containerEl.querySelectorAll(
      ".cm-accessibility-checker"
    );

    checkerElements.forEach((checkerEl) => {
      const varName = (checkerEl as HTMLElement).dataset.varName;
      if (!varName) return;

      const bgVarForTextColor =
        TEXT_TO_BG_MAP[varName as keyof typeof TEXT_TO_BG_MAP];
      if (!bgVarForTextColor) return;

      let textColor = activeProfileVars[varName] || allDefaultVars[varName];
      let bgColor =
        activeProfileVars[bgVarForTextColor] ||
        allDefaultVars[bgVarForTextColor];

      if (varName === "--text-highlight-bg") {
        [textColor, bgColor] = [bgColor, textColor];
      }

      const ratio = getContrastRatio(bgColor, textColor);
      const rating = getAccessibilityRating(ratio);

      checkerEl.className = `cm-accessibility-checker ${rating.cls}`;
      checkerEl.setText(`${rating.text} (${rating.score})`);
    });
  }

  display() {
    const { containerEl } = this;
    containerEl.classList.add("color-master-settings-tab");
    containerEl.empty();

    const lang = this.plugin.settings.language;
    const isRTL =
      (lang === "ar" || lang === "fa") && this.plugin.settings.useRtlLayout;
    this.containerEl.setAttribute("dir", isRTL ? "rtl" : "ltr");

    containerEl.createEl("h2", { text: t("PLUGIN_NAME") });

    new Setting(containerEl)
      .setName(t("ENABLE_PLUGIN"))
      .setDesc(t("ENABLE_PLUGIN_DESC"))
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.pluginEnabled)
          .onChange(async (value) => {
            this.plugin.settings.pluginEnabled = value;

            if (value) {
              this.plugin.enableObservers();
            } else {
              this.plugin.disableObservers();
            }

            await this.plugin.saveSettings();
            this.plugin.restartColorUpdateLoop();
            new Notice(
              value ? t("PLUGIN_ENABLED_NOTICE") : t("PLUGIN_DISABLED_NOTICE")
            );
          });
      });

    const languageSetting = new Setting(containerEl)
      .setName(t("LANGUAGE"))
      .setDesc(t("LANGUAGE_DESC"));

    if (
      this.plugin.settings.language === "ar" ||
      this.plugin.settings.language === "fa"
    ) {
      languageSetting.addExtraButton((button) => {
        button
          .setIcon("settings-2")
          .setTooltip("Language Settings")
          .onClick(() => {
            new LanguageSettingsModal(this.app, this.plugin).open();
          });
      });

      languageSetting.addDropdown((dropdown) => {
        dropdown.addOption("en", "English");
        dropdown.addOption("ar", "العَرَبيَّةُ");
        dropdown.addOption("fa", "فارسی");
        dropdown.addOption("fr", "Français");
        dropdown.setValue(this.plugin.settings.language);
        dropdown.onChange(async (value) => {
          this.plugin.settings.language = value;
          await this.plugin.saveSettings();
          this.display();
        });
      });
    } else {
      languageSetting.addDropdown((dropdown) => {
        dropdown.addOption("en", "English");
        dropdown.addOption("ar", "العَرَبيَّةُ");
        dropdown.addOption("fa", "فارسی");
        dropdown.addOption("fr", "Français");
        dropdown.setValue(this.plugin.settings.language);
        dropdown.onChange(async (value) => {
          this.plugin.settings.language = value;
          await this.plugin.saveSettings();
          this.display();
        });
      });
    }

    this.initSearchUI(containerEl);
    this.staticContentContainer = containerEl.createDiv({
      cls: "cm-static-sections",
    });
    drawProfileManager(this.staticContentContainer, this);
    drawImportExport(this.staticContentContainer, this);
    drawOptionsSection(this.staticContentContainer, this);
    drawCssSnippetsUI(this.staticContentContainer, this);
    drawColorPickers(this.containerEl, this);
    containerEl.createEl("hr");
    drawLikePluginCard(containerEl, this);
  }

  // ---------- Replacement hide() that acts like "Cancel" on accidental close ----------
  hide() {
    // If user had pending graph edits, treat closing the settings as a CANCEL action.
    if (this.graphViewTempState) {
      console.log(
        "Color Master: Settings closed with pending Graph edits. Performing Cancel (revert) instead of applying partial state."
      );

      // 1) Restore saved profile vars from the temp snapshot
      const profileVars =
        this.plugin.settings.profiles[this.plugin.settings.activeProfile]
          .vars || {};
      Object.assign(profileVars, this.graphViewTempState);

      // 2) Enqueue them so visuals update immediately (works for FPS==0 or >0)
      for (const k in this.graphViewTempState) {
        if (Object.prototype.hasOwnProperty.call(this.graphViewTempState, k)) {
          this.plugin.pendingVarUpdates[k] = this.graphViewTempState[k];
        }
      }

      // 3) Apply pending now to force visual restore
      try {
        this.plugin.applyPendingNow();
      } catch (e) {
        console.warn("Color Master: applyPendingNow failed during hide()", e);
        // fallback: trigger css-change
        this.app.workspace.trigger("css-change");
      }

      // 4) Clean up internal temporary state and UI buttons (but do NOT call this.display())
      this.graphViewTempState = null;
      this.graphViewWorkingState = null;
      this.hideGraphActionButtons && this.hideGraphActionButtons();

      // 5) Refresh graph views if plugin enabled
      if (this.plugin.settings.pluginEnabled) {
        try {
          this.plugin.refreshOpenGraphViews();
        } catch (e) {
          console.warn(
            "Color Master: refreshOpenGraphViews failed during hide()",
            e
          );
        }
      }

      this.app.workspace.trigger("css-change");
    }
  }

  async onGraphApply() {
    if (!this.graphViewWorkingState) return;
    const profileVars =
      this.plugin.settings.profiles[this.plugin.settings.activeProfile].vars ||
      {};

    Object.assign(profileVars, this.graphViewWorkingState);

    await this.plugin.saveSettings();

    this.graphViewTempState = null;
    this.graphViewWorkingState = null;
    this.hideGraphActionButtons();
    new Notice(t("NOTICE_GRAPH_COLORS_APPLIED"));
  }

  onGraphCancel() {
    if (!this.graphViewTempState) {
      this.hideGraphActionButtons();
      return;
    }

    const profileVars =
      this.plugin.settings.profiles[this.plugin.settings.activeProfile].vars ||
      {};

    Object.assign(profileVars, this.graphViewTempState);

    for (const key in this.graphViewTempState) {
      this.plugin.pendingVarUpdates[key] = this.graphViewTempState[key];
    }
    this.plugin.applyPendingNow();

    this.graphViewTempState = null;
    this.graphViewWorkingState = null;
    this.hideGraphActionButtons();
    this.display();
  }

  showGraphActionButtons() {
    if (!this.graphHeaderButtonsEl) return;

    this.graphHeaderButtonsEl.empty();

    const applyButton = this.graphHeaderButtonsEl.createEl("button", {
      text: "Apply",
      cls: "mod-cta",
    });
    applyButton.addEventListener("click", () => this.onGraphApply());

    const cancelButton = this.graphHeaderButtonsEl.createEl("button", {
      text: "Cancel",
    });
    cancelButton.addEventListener("click", () => this.onGraphCancel());
  }

  // ---------- Ensure hideGraphActionButtons also clears workingState ----------
  hideGraphActionButtons() {
    // Clear both states
    this.graphViewTempState = null;
    this.graphViewWorkingState = null;

    if (this.graphHeaderButtonsEl) {
      this.graphHeaderButtonsEl.empty();
    }
  }
}
