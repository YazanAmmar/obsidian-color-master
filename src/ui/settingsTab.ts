import {
  App,
  ButtonComponent,
  DropdownComponent,
  Notice,
  PluginSettingTab,
  Setting,
  setIcon,
} from "obsidian";
import {
  COLOR_DESCRIPTIONS,
  COLOR_DESCRIPTIONS_AR,
  COLOR_DESCRIPTIONS_FA,
  COLOR_DESCRIPTIONS_FR,
  COLOR_NAMES,
  COLOR_NAMES_AR,
  COLOR_NAMES_FA,
  COLOR_NAMES_FR,
  DEFAULT_VARS,
  TEXT_TO_BG_MAP,
} from "../constants";
import { t } from "../i18n";
import type ColorMaster from "../main";
import {
  flattenVars,
  getAccessibilityRating,
  getContrastRatio,
} from "../utils";
import { drawColorPickers } from "./components/color-pickers";
import { drawImportExport } from "./components/import-export";
import { drawLikePluginCard } from "./components/like-plugin-card";
import { drawOptionsSection } from "./components/options-section";
import { drawProfileManager } from "./components/profile-manager";
import { drawCssSnippetsUI } from "./components/snippets-ui";
import { LanguageSettingsModal } from "./modals";
import Sortable = require("sortablejs");

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

  _clearSearchAndFilters() {
    if (!this.searchInput || !this.sectionSelect) return;

    // 1. Clear the search field and reset the drop-down list
    this.searchInput.value = "";
    this.sectionSelect.value = "";

    // 2. Reset the search "state".
    this._searchState.query = "";
    this._searchState.section = "";

    // 3. Update the interface: hide filters and deactivate buttons
    const filterButton = this.containerEl.querySelector(
      'button[data-cm-action="filter"]'
    );
    const filterOptionsContainer = this.containerEl.querySelector(
      ".cm-search-filter-options"
    );

    if (filterButton) filterButton.classList.remove("is-active");
    if (filterOptionsContainer)
      filterOptionsContainer.classList.add("is-hidden");

    // 4. Reapply the filter to display everything again
    this._applySearchFilter();
  }

  initSearchUI(containerEl: HTMLElement) {
    const searchBarContainer = containerEl.createDiv({
      cls: "cm-search-bar-container",
    });
    const originalPlaceholder = t("SEARCH_PLACEHOLDER");

    //---1. Input field section---
    const searchInputContainer = searchBarContainer.createDiv({
      cls: "cm-search-input-container",
    });
    const searchIcon = searchInputContainer.createDiv({
      cls: "cm-search-input-icon",
    });
    setIcon(searchIcon, "search");
    this.searchInput = searchInputContainer.createEl("input", {
      cls: "cm-search-input",
      type: "search",
      placeholder: originalPlaceholder,
    });

    // --- 2. Control buttons section ---
    const searchActions = searchBarContainer.createDiv({
      cls: "cm-search-actions",
    });

    this.caseToggle = searchActions.createEl("button", {
      cls: "cm-search-action-btn",
    });
    this.caseToggle.textContent = "Aa";
    this.caseToggle.setAttr("aria-label", t("ARIA_LABEL_CASE_SENSITIVE"));

    this.regexToggle = searchActions.createEl("button", {
      cls: "cm-search-action-btn",
    });
    setIcon(this.regexToggle, "regex");
    this.regexToggle.setAttr("aria-label", t("ARIA_LABEL_REGEX_SEARCH"));

    const filterOptionsContainer = searchActions.createDiv({
      cls: "cm-search-filter-options is-hidden", // We start by hiding it
    });

    // --- New code using the official component ---
    const dropdown = new DropdownComponent(filterOptionsContainer)
      .addOption("", t("ALL_SECTIONS"))
      .onChange(async (value) => {
        this._searchState.section = value;
        filterOptionsContainer.classList.toggle(
          "is-filter-active",
          value !== ""
        );
        debouncedFilter();
      });

    // Add the rest of the options to the list
    try {
      Object.keys(DEFAULT_VARS || {}).forEach((category) => {
        const translatedCategory =
          t(category.toUpperCase().replace(/ /g, "_")) || category;
        dropdown.addOption(category, translatedCategory);
      });
    } catch (e) {}

    const activeProfile =
      this.plugin.settings.profiles[this.plugin.settings.activeProfile];
    if (
      activeProfile?.customVarMetadata &&
      Object.keys(activeProfile.customVarMetadata).length > 0
    ) {
      dropdown.addOption("Custom", t("CUSTOM_VARIABLES_HEADING"));
    }

    // Add our own format and maintain a reference to the element
    dropdown.selectEl.classList.add("cm-search-small");
    this.sectionSelect = dropdown.selectEl;

    this.clearBtn = filterOptionsContainer.createEl("button", {
      cls: "cm-search-action-btn",
    });
    setIcon(this.clearBtn, "x");
    this.clearBtn.setAttr("aria-label", t("CLEAR_BUTTON"));

    const filterButton = searchActions.createEl("button", {
      cls: "cm-search-action-btn",
    });
    setIcon(filterButton, "filter");
    filterButton.dataset.cmAction = "filter";

    this.searchInfo = searchActions.createEl("div", { cls: "cm-search-info" });
    this.searchInfo.style.display = "none";

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
      // If Regex mode is enabled, do nothing and wait for Enter to be pressed.
      if (this._searchState.regex) return;

      this._searchState.query = (e.target as HTMLInputElement).value;
      debouncedFilter();
    });

    this.searchInput.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        // Make sure we are in Regex mode before performing the search.
        if (this._searchState.regex) {
          this._searchState.query = (e.target as HTMLInputElement).value;
          debouncedFilter();
        }
      }
    });

    this.caseToggle.addEventListener("click", () => {
      this._searchState.caseSensitive = !this._searchState.caseSensitive;
      this.caseToggle.toggleClass("is-active", this._searchState.caseSensitive);
      debouncedFilter();
    });

    this.regexToggle.addEventListener("click", () => {
      // Toggle Regex State
      this._searchState.regex = !this._searchState.regex;
      this.regexToggle.toggleClass("is-active", this._searchState.regex);

      // Check Regex State to Change Temporary Text
      if (this._searchState.regex) {
        // If Regex is enabled, change the temporary text
        this.searchInput.placeholder = t("REGEX_PLACEHOLDER");
      } else {
        // If Regex is deactivated, return the original temporary text
        this.searchInput.placeholder = originalPlaceholder;
      }

      // Reapply filter immediately if text exists
      this._searchState.query = this.searchInput.value;
      debouncedFilter();
    });

    filterButton.addEventListener("click", () => {
      if (filterButton.classList.contains("is-active")) {
        this._clearSearchAndFilters();
      } else {
        filterOptionsContainer.classList.remove("is-hidden");
        filterButton.classList.add("is-active");
      }
    });

    this.sectionSelect.addEventListener("change", (e: Event) => {
      this._searchState.section = (e.target as HTMLSelectElement).value;
      debouncedFilter();
    });

    this.clearBtn.addEventListener("click", () => {
      this._clearSearchAndFilters();
    });
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

    const query = this._searchState.query.trim();

    // If in search text, show the number of results
    if (query) {
      this.searchInfo.setText(t("SEARCH_RESULTS_FOUND", visibleCount));
      this.searchInfo.style.display = "inline-block"; // Make sure it is shown
    } else {
      // If the search field is empty, hide the counter
      this.searchInfo.setText("");
      this.searchInfo.style.display = "none";
    }
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

    const langIcon = languageSetting.nameEl.createSpan({
      cls: "cm-setting-icon",
    });
    setIcon(langIcon, "languages");
    languageSetting.nameEl.prepend(langIcon);

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
    this.staticContentContainer.createEl("hr");
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
