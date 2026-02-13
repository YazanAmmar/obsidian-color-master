import {
  App,
  ButtonComponent,
  DropdownComponent,
  Notice,
  PluginSettingTab,
  Setting,
  setIcon,
  SearchComponent,
} from 'obsidian';
import { DEFAULT_VARS, TEXT_TO_BG_MAP } from '../constants';
import { t } from '../i18n/strings';
import type ColorMaster from '../main';
import { flattenVars, getAccessibilityRating, getContrastRatio, debounce } from '../utils';
import { drawColorPickers } from './components/color-pickers';
import { drawImportExport } from './components/import-export';
import { drawLikePluginCard } from './components/like-plugin-card';
import { drawOptionsSection } from './components/options-section';
import { drawProfileManager } from './components/profile-manager';
import { drawCssSnippetsUI } from './components/snippets-ui';
import { LanguageSettingsModal } from './modals';
import Sortable from 'sortablejs';
import { loadLanguage } from '../i18n/strings';
import { CORE_LANGUAGES, LocaleCode } from '../i18n/types';
import {
  AddNewLanguageModal,
  LanguageTranslatorModal,
  ConfirmationModal,
  LanguageInfoModal,
} from './modals';

export class ColorMasterSettingTab extends PluginSettingTab {
  plugin: ColorMaster;
  searchContainer: HTMLElement;
  searchInput: HTMLInputElement;
  caseToggle: HTMLButtonElement;
  regexToggle: HTMLButtonElement;
  sectionSelect: HTMLSelectElement;
  _searchState: {
    query: string;
    regex: boolean;
    caseSensitive: boolean;
    section: string;
  };
  staticContentContainer: HTMLDivElement;
  resetPinBtn: ButtonComponent | null = null;
  pinBtn: ButtonComponent | null = null;
  snippetSortable: Sortable | null;

  constructor(app: App, plugin: ColorMaster) {
    super(app, plugin);
    this.plugin = plugin;
    this.snippetSortable = null;
  }

  updateColorPickerAppearance(textInput: HTMLInputElement, colorPicker: HTMLInputElement) {
    const value = textInput.value.toLowerCase().trim();

    if (value === 'transparent' || value === '') {
      colorPicker.classList.add('is-transparent');
      colorPicker.value = '#ffffff';
    } else if (value.startsWith('#') && (value.length === 9 || value.length === 5)) {
      colorPicker.classList.remove('is-transparent');

      let rgbHex = '#ffffff';
      if (value.length === 9) {
        rgbHex = value.substring(0, 7);
      } else if (value.length === 5) {
        const r = value[1];
        const g = value[2];
        const b = value[3];
        rgbHex = `#${r}${r}${g}${g}${b}${b}`;
      }

      try {
        colorPicker.value = rgbHex;
      } catch {
        console.warn(`Color Master: Invalid HEX for color picker: ${rgbHex}`);
        colorPicker.value = '#ffffff';
      }
    } else {
      colorPicker.classList.remove('is-transparent');
      try {
        colorPicker.value = value;
      } catch {
        colorPicker.value = '#ffffff';
      }
    }
  }

  _clearSearchAndFilters() {
    if (!this.searchInput || !this.sectionSelect) return;

    this.searchInput.value = '';
    this.sectionSelect.value = '';

    this._searchState.query = '';
    this._searchState.section = '';

    // Clear saved settings
    this.plugin.settings.lastSearchQuery = '';
    this.plugin.settings.lastSearchSection = '';
    void this.plugin.saveData(this.plugin.settings).catch((err) => {
      console.error('Failed to save search input state:', err);
    });

    const filterButton = this.containerEl.querySelector('button[data-cm-action="filter"]');
    const filterOptionsContainer = this.containerEl.querySelector('.cm-search-filter-options');

    if (filterButton) filterButton.classList.remove('is-active');
    if (filterOptionsContainer) filterOptionsContainer.classList.add('is-hidden');

    this._applySearchFilter();
  }

  initSearchUI(containerEl: HTMLElement) {
    // Load saved section here
    this._searchState = {
      query: this.plugin.settings.lastSearchQuery || '',
      regex: false,
      caseSensitive: false,
      section: this.plugin.settings.lastSearchSection || '',
    };

    const searchBarContainer = containerEl.createDiv({
      cls: 'cm-search-bar-container',
    });

    // --- 1. Input field section ---
    const searchInputContainer = searchBarContainer.createDiv({
      cls: 'cm-search-input-container',
    });

    const searchComponent = new SearchComponent(searchInputContainer)
      .setPlaceholder(t('settings.searchPlaceholder'))
      .setValue(this._searchState.query)
      .onChange((value) => {
        if (this._searchState.regex) return;
        this._searchState.query = value;
        this.plugin.settings.lastSearchQuery = value;
        void this.plugin.saveData(this.plugin.settings).catch((err) => {
          console.error('Failed to save search/filter reset state:', err);
        });
        debouncedFilter();
      });

    this.searchInput = searchComponent.inputEl;

    this.searchInput.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && this._searchState.regex) {
        this._searchState.query = (e.target as HTMLInputElement).value;
        debouncedFilter();
      }
    });

    // --- 2. Control buttons section ---
    const searchActions = searchBarContainer.createDiv({
      cls: 'cm-search-actions',
    });

    this.caseToggle = searchActions.createEl('button', {
      cls: 'cm-search-action-btn',
    });
    this.caseToggle.textContent = 'Aa';
    this.caseToggle.setAttr('aria-label', t('settings.ariaCase'));

    this.regexToggle = searchActions.createEl('button', {
      cls: 'cm-search-action-btn',
    });
    setIcon(this.regexToggle, 'regex');
    this.regexToggle.setAttr('aria-label', t('settings.ariaRegex'));

    const filterOptionsContainer = searchActions.createDiv({
      cls: 'cm-search-filter-options is-hidden',
    });

    const dropdown = new DropdownComponent(filterOptionsContainer)
      .addOption('', t('settings.allSections'))
      .onChange(async (value) => {
        this._searchState.section = value;

        // Save the filter section
        this.plugin.settings.lastSearchSection = value;
        await this.plugin.saveData(this.plugin.settings);

        filterOptionsContainer.classList.toggle('is-filter-active', value !== '');
        debouncedFilter();
      });

    // Restore filter state
    dropdown.setValue(this._searchState.section);
    if (this._searchState.section) {
      filterOptionsContainer.classList.remove('is-hidden');
    }

    try {
      Object.keys(DEFAULT_VARS || {}).forEach((category) => {
        let categoryKey: string;
        const lowerCategory = category.toLowerCase();

        if (lowerCategory === 'interactive elements') categoryKey = 'interactive';
        else if (lowerCategory === 'ui elements') categoryKey = 'ui';
        else if (lowerCategory === 'graph view') categoryKey = 'graph';
        else if (lowerCategory === 'plugin integrations') categoryKey = 'pluginintegrations';
        else categoryKey = lowerCategory.replace(/ /g, '');

        const translatedCategory = t(`categories.${categoryKey}`) || category;
        dropdown.addOption(category, translatedCategory);
      });
    } catch {
      // ignore invalid category translation
    }

    const activeProfile = this.plugin.settings.profiles[this.plugin.settings.activeProfile];
    if (
      activeProfile?.customVarMetadata &&
      Object.keys(activeProfile.customVarMetadata).length > 0
    ) {
      dropdown.addOption('Custom', t('categories.custom'));
    }

    dropdown.selectEl.classList.add('cm-search-small');
    this.sectionSelect = dropdown.selectEl;

    const filterButton = searchActions.createEl('button', {
      cls: 'cm-search-action-btn',
    });
    setIcon(filterButton, 'sliders-horizontal');
    filterButton.dataset.cmAction = 'filter';

    // Activate button if section is saved
    if (this._searchState.section) filterButton.classList.add('is-active');

    const debouncedFilter = debounce(() => this._applySearchFilter(), 180);

    this.caseToggle.addEventListener('click', () => {
      this._searchState.caseSensitive = !this._searchState.caseSensitive;
      this.caseToggle.toggleClass('is-active', this._searchState.caseSensitive);
      debouncedFilter();
    });

    this.regexToggle.addEventListener('click', () => {
      this._searchState.regex = !this._searchState.regex;
      this.regexToggle.toggleClass('is-active', this._searchState.regex);
      if (this._searchState.regex) {
        searchComponent.setPlaceholder(t('settings.regexPlaceholder'));
      } else {
        searchComponent.setPlaceholder(t('settings.searchPlaceholder'));
      }
      this._searchState.query = this.searchInput.value;
      debouncedFilter();
    });

    filterButton.addEventListener('click', () => {
      if (filterButton.classList.contains('is-active')) {
        this._clearSearchAndFilters();
      } else {
        filterOptionsContainer.classList.remove('is-hidden');
        filterButton.classList.add('is-active');
      }
    });

    this.sectionSelect.addEventListener('change', (e: Event) => {
      this._searchState.section = (e.target as HTMLSelectElement).value;
      debouncedFilter();
    });
  }

  _applySearchFilter() {
    const s = this._searchState;
    const activeProfile = this.plugin.settings.profiles[this.plugin.settings.activeProfile];
    if (this.staticContentContainer) {
      const isSearching = s.query.trim().length > 0 || s.section !== '';
      this.staticContentContainer.toggleClass('cm-hidden', isSearching);
    }
    const rows = Array.from(
      this.containerEl.querySelectorAll<HTMLElement>('.cm-var-row, .cm-searchable-row'),
    );

    let qRegex: RegExp | null = null;

    if (s.query && s.query.trim()) {
      if (s.regex) {
        try {
          qRegex = new RegExp(s.query, s.caseSensitive ? '' : 'i');
        } catch {
          qRegex = null;
        }
      }
    }

    rows.forEach((row) => {
      const varName = row.dataset.var || '';
      const snippetName = row.dataset.name || '';
      const textInput = row.querySelector<HTMLInputElement>("input[type='text']");
      const varValue = textInput ? textInput.value.trim() : '';

      let displayName = '';
      let description = '';
      const customMeta = activeProfile?.customVarMetadata?.[varName];

      if (customMeta) {
        displayName = customMeta.name;
        description = customMeta.desc;
      } else {
        displayName = t(`colors.names.${varName}`) || snippetName;
        description = t(`colors.descriptions.${varName}`) || '';
      }

      if (s.section && s.section !== row.dataset.category) {
        row.classList.add('cm-hidden');
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
          const valueLower = s.caseSensitive ? varValue : varValue.toLowerCase();
          const displayNameLower = s.caseSensitive ? displayName : displayName.toLowerCase();
          const descriptionLower = s.caseSensitive ? description : description.toLowerCase();

          isMatch =
            nameLower.includes(queryLower) ||
            valueLower.includes(queryLower) ||
            displayNameLower.includes(queryLower) ||
            descriptionLower.includes(queryLower);
        }

        if (!isMatch) {
          row.classList.add('cm-hidden');
          return;
        }
      }

      row.classList.remove('cm-hidden');
      this._highlightRowMatches(row, s);
    });

    const headings = this.containerEl.querySelectorAll<HTMLElement>('.cm-category-container');
    headings.forEach((heading) => {
      const category = heading.dataset.category;
      const hasVisibleRows = this.containerEl.querySelector(
        `.cm-var-row[data-category="${category}"]:not(.cm-hidden)`,
      );

      if (hasVisibleRows) {
        heading.classList.remove('cm-hidden');
      } else {
        heading.classList.add('cm-hidden');
      }
    });
  }

  _highlightRowMatches(row: HTMLElement, state: typeof this._searchState) {
    const query = state.query.trim();

    const highlightElement = (element: HTMLElement | null) => {
      if (!element) return;

      if (!element.dataset.originalText) {
        element.dataset.originalText = element.textContent || '';
      }
      const originalText = element.dataset.originalText;

      element.empty();

      if (!query) {
        element.setText(originalText);
        return;
      }

      const flags = state.caseSensitive ? 'g' : 'gi';
      let regex: RegExp;

      try {
        regex = state.regex
          ? new RegExp(query, flags)
          : new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);

        let lastIndex = 0;
        let match;

        while ((match = regex.exec(originalText)) !== null) {
          if (match.index > lastIndex) {
            element.appendText(originalText.substring(lastIndex, match.index));
          }
          element.createSpan({ cls: 'cm-search-match', text: match[0] });
          lastIndex = regex.lastIndex;
        }

        if (lastIndex < originalText.length) {
          element.appendText(originalText.substring(lastIndex));
        }
      } catch {
        element.setText(originalText);
      }
    };

    const nameEl = row.querySelector<HTMLElement>('.cm-var-name');
    const descEl = row.querySelector<HTMLElement>('.setting-item-description');

    highlightElement(nameEl);
    highlightElement(descEl);
  }

  _updatePinButtons() {
    const name = this.plugin.settings.activeProfile;
    const snapshot = this.plugin.settings.pinnedSnapshots?.[name];

    if (this.resetPinBtn) {
      this.resetPinBtn.setTooltip(t('tooltips.resetToPinned')).setDisabled(!snapshot);
    }

    if (this.pinBtn) {
      if (snapshot && snapshot.pinnedAt) {
        const dateObj = new Date(snapshot.pinnedAt);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const formattedDate = `${year}-${month}-${day}`;

        this.pinBtn.setTooltip(t('tooltips.pinSnapshotDate', formattedDate));
      } else {
        this.pinBtn.setTooltip(t('tooltips.pinSnapshot'));
      }
    }
  }

  _getCurrentProfileJson() {
    const p = this.plugin.settings.profiles?.[this.plugin.settings.activeProfile];
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
      new Notice(t('notices.noActiveProfileToCopy'));
      return;
    }
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    new Notice(t('notices.jsonCopied'));
  }

  _exportProfileToFile() {
    const payload = this._getCurrentProfileJson();
    if (!payload) {
      new Notice(t('notices.noActiveProfileToExport'));
      return;
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `${this.plugin.settings.activeProfile}.profile.json`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
    new Notice(t('notices.exportSuccess'));
  }

  updateAccessibilityCheckers() {
    const activeProfileVars =
      this.plugin.settings.profiles[this.plugin.settings.activeProfile].vars;
    const allDefaultVars = flattenVars(DEFAULT_VARS);

    const checkerElements = this.containerEl.querySelectorAll('.cm-accessibility-checker');

    checkerElements.forEach((checkerEl) => {
      const varName = (checkerEl as HTMLElement).dataset.varName;
      if (!varName) return;

      const bgVarForTextColor = TEXT_TO_BG_MAP[varName as keyof typeof TEXT_TO_BG_MAP];
      if (!bgVarForTextColor) return;

      let textColor = activeProfileVars[varName] || allDefaultVars[varName];
      let bgColor = activeProfileVars[bgVarForTextColor] || allDefaultVars[bgVarForTextColor];

      if (varName === '--text-highlight-bg') {
        [textColor, bgColor] = [bgColor, textColor];
      }

      const ratio = getContrastRatio(bgColor, textColor);
      const rating = getAccessibilityRating(ratio);

      checkerEl.className = `cm-accessibility-checker ${rating.cls}`;
      checkerEl.setText(`${rating.text} (${rating.score})`);
    });
  }

  display(): void {
    // call the async renderer and handle any error
    void this.renderDisplay().catch((err) => {
      console.error('Error in SettingsTab.renderDisplay:', err);
    });
  }

  private async renderDisplay(): Promise<void> {
    const themeDefaults = await this.plugin.getThemeDefaults();

    const { containerEl } = this;
    containerEl.classList.add('color-master-settings-tab');
    containerEl.empty();
    containerEl.classList.add('color-master-hidden');

    const langCode = this.plugin.settings.language;
    const customLang = this.plugin.settings.customLanguages?.[langCode];
    const isCoreRtlLang = langCode === 'ar' || langCode === 'fa';
    const isCustomRtlLang = customLang?.isRtl === true;
    const isRtlCapable = isCoreRtlLang || isCustomRtlLang;
    const isRtlEnabled = this.plugin.settings.useRtlLayout;
    const isRTL = isRtlCapable && isRtlEnabled;
    const isCustom = !!customLang;
    const isCore = !!CORE_LANGUAGES[langCode as LocaleCode];

    this.containerEl.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

    new Setting(containerEl)
      .setName(t('settings.enablePlugin'))
      .setDesc(t('settings.enablePluginDesc'))
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.pluginEnabled).onChange(async (value) => {
          this.plugin.settings.pluginEnabled = value;

          if (value) {
            this.plugin.enableObservers();
          } else {
            this.plugin.disableObservers();
          }

          await this.plugin.saveSettings();
          this.plugin.restartColorUpdateLoop();
          new Notice(value ? t('notices.pluginEnabled') : t('notices.pluginDisabled'));
        });
      });

    const languageSetting = new Setting(containerEl)
      .setName(t('settings.language'))
      .setDesc(t('settings.languageDesc'));

    const langIcon = languageSetting.nameEl.createSpan({
      cls: 'cm-setting-icon',
    });
    setIcon(langIcon, 'languages');
    languageSetting.nameEl.prepend(langIcon);

    const flyoutContainer = languageSetting.controlEl.createDiv({
      cls: 'cm-flyout-menu-container',
    });

    const buttonListEl = flyoutContainer.createDiv({
      cls: 'cm-flyout-menu-buttons',
    });

    const triggerBtn = new ButtonComponent(flyoutContainer)
      .setIcon('settings')
      .setTooltip(t('tooltips.langMenu'))
      .setClass('cm-flyout-trigger-btn')
      .onClick(() => {
        buttonListEl.toggleClass('is-open', !buttonListEl.classList.contains('is-open'));
      });
    triggerBtn.buttonEl.classList.add('cm-control-icon-button');

    // Info Button
    new ButtonComponent(buttonListEl)
      .setIcon('info')
      .setTooltip(t('tooltips.langInfo'))
      .setClass('cm-control-icon-button')
      .onClick(() => {
        new LanguageInfoModal(this.app, this.plugin).open();
      });

    // Edit Button
    new ButtonComponent(buttonListEl)
      .setIcon('pencil')
      .setTooltip(t('tooltips.editLang'))
      .setClass('cm-control-icon-button')
      .onClick(() => {
        const langCode = this.plugin.settings.language;
        new LanguageTranslatorModal(this.app, this.plugin, this, langCode).open();
      });

    // Add Button
    new ButtonComponent(buttonListEl)
      .setIcon('plus')
      .setTooltip(t('modals.addLang.title'))
      .setClass('cm-control-icon-button')
      .onClick(() => {
        new AddNewLanguageModal(this.app, this.plugin, this).open();
      });

    // RTL Button
    if (isRtlCapable) {
      new ButtonComponent(buttonListEl)
        .setIcon('settings-2') //
        .setTooltip(t('settings.languageSettingsModalTitle'))
        .setClass('cm-control-icon-button')
        .onClick(() => {
          new LanguageSettingsModal(this.app, this.plugin).open();
        });
    }

    // History/Restore Button for Core Languages that are customized
    if (isCore && isCustom) {
      const restoreBtn = new ButtonComponent(buttonListEl)
        .setIcon('history')
        .setTooltip(t('tooltips.restoreDefaultLang'))
        .setClass('mod-warning')
        .onClick(() => {
          new ConfirmationModal(
            this.app,
            this.plugin,
            t('modals.confirmation.restoreLangTitle'),
            t('modals.confirmation.restoreLangDesc', CORE_LANGUAGES[langCode as LocaleCode]),
            () => {
              void (async () => {
                if (this.plugin.settings.customLanguages) {
                  delete this.plugin.settings.customLanguages[langCode];
                  loadLanguage(this.plugin.settings);
                  await this.plugin.saveSettings();
                  this.display();
                  new Notice(t('notices.langRestored'));
                }
              })().catch((err) => {
                // Short human comment in English (as you requested)
                console.error('Failed to restore language:', err);
              });
            },
            { buttonText: t('buttons.restore'), buttonClass: 'mod-warning' },
          ).open();
        });
      restoreBtn.buttonEl.classList.add('cm-control-icon-button');
    }

    if (isCustom && !isCore) {
      const deleteBtn = new ButtonComponent(buttonListEl)
        .setIcon('trash')
        .setTooltip(t('buttons.delete') + ` (${customLang.languageName})`)
        .setClass('mod-warning')
        .onClick(() => {
          new ConfirmationModal(
            this.app,
            this.plugin,
            t('modals.confirmation.deleteLangTitle'),
            t('modals.confirmation.deleteLangDesc', customLang.languageName),
            () => {
              void (async () => {
                if (!this.plugin.settings.customLanguages) return;
                delete this.plugin.settings.customLanguages[langCode];
                this.plugin.settings.language = 'en';
                loadLanguage(this.plugin.settings);
                await this.plugin.saveSettings();
                this.display();
                new Notice(t('notices.langDeleted', customLang.languageName));
              })().catch((err) => {
                console.error('Failed to delete custom language:', err);
              });
            },
            { buttonText: t('buttons.delete'), buttonClass: 'mod-warning' },
          ).open();
        });
      deleteBtn.buttonEl.classList.add('cm-control-icon-button');
    }

    languageSetting.addDropdown((dropdown) => {
      const customLangs = this.plugin.settings.customLanguages || {};

      // 1. Add Core languages FIRST
      for (const code in CORE_LANGUAGES) {
        // Use custom name if it exists, otherwise use core name
        let displayName = CORE_LANGUAGES[code as LocaleCode];
        if (customLangs[code]) {
          displayName = customLangs[code].languageName;
        }
        dropdown.addOption(code, displayName);
      }

      // 2. Add purely Custom languages (that are NOT core overrides)
      const customCodes = Object.keys(customLangs);
      for (const code of customCodes) {
        if (CORE_LANGUAGES[code as LocaleCode]) continue;

        const langName = customLangs[code].languageName;
        dropdown.addOption(code, langName);
      }

      dropdown.setValue(this.plugin.settings.language);
      dropdown.onChange(async (value) => {
        this.plugin.settings.language = value;
        loadLanguage(this.plugin.settings);

        await this.plugin.saveSettings();
        this.display();
      });
    });

    this.initSearchUI(containerEl);
    this.staticContentContainer = containerEl.createDiv({
      cls: 'cm-static-sections',
    });
    drawProfileManager(this.staticContentContainer, this);
    drawImportExport(this.staticContentContainer, this);
    drawOptionsSection(this.staticContentContainer, this);
    this.staticContentContainer.createEl('hr');
    drawCssSnippetsUI(this.staticContentContainer, this);
    drawColorPickers(this.containerEl, this, themeDefaults);
    containerEl.createEl('hr');
    drawLikePluginCard(containerEl, this);

    //---Implement automatic search and scrolling---

    // Make sure that the filter is applied
    this._applySearchFilter();

    if (this._searchState.query) {
      setTimeout(() => {
        // Find the first "visible" line
        const firstVisibleRow = this.containerEl.querySelector<HTMLElement>(
          '.cm-var-row:not(.cm-hidden)',
        );

        if (firstVisibleRow) {
          firstVisibleRow.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 0);
    }
    const scrollContainer = this.containerEl.closest<HTMLElement>('.vertical-tab-content');

    if (!scrollContainer) {
      console.warn('Color Master: Could not find scroll container.');
    } else {
      const debouncedScrollSave = debounce(() => {
        this.plugin.settings.lastScrollPosition = scrollContainer.scrollTop;
        void this.plugin.saveData(this.plugin.settings).catch((err) => {
          console.error('Failed to save scroll position:', err);
        });
      }, 200);

      this.plugin.registerDomEvent(scrollContainer, 'scroll', debouncedScrollSave);

      if (!this._searchState.query && this.plugin.settings.lastScrollPosition) {
        scrollContainer.scrollTo({
          top: this.plugin.settings.lastScrollPosition,
          behavior: 'auto',
        });
      }
    }

    containerEl.classList.remove('color-master-hidden');
  }
}
