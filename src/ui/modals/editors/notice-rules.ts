import { App, ButtonComponent, Notice, setIcon, Setting } from 'obsidian';
import Sortable from 'sortablejs';
import { t } from '../../../i18n/strings';
import type ThemeEngine from '../../../main';
import type { NoticeRule } from '../../../types';
import type { ThemeEngineSettingTab } from '../../settingsTab';
import { ThemeEngineBaseModal } from '../base';

export class NoticeRulesModal extends ThemeEngineBaseModal {
  plugin: ThemeEngine;
  settingTab: ThemeEngineSettingTab;
  ruleType: 'text' | 'background';
  localRules: NoticeRule[];
  newlyAddedRuleId: string | null = null;
  rulesContainer: HTMLElement;
  sortable: Sortable | null = null;

  constructor(
    app: App,
    plugin: ThemeEngine,
    settingTab: ThemeEngineSettingTab,
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
    this.modalEl.classList.add('theme-engine-modal', 'cm-rules-modal');

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
        const textRule = rule as NoticeRule & { highlightOnly: boolean };

        const highlightBtn = new ButtonComponent(ruleEl)
          .setIcon('highlighter')
          .setClass('cm-rule-icon-button')
          .setTooltip(t('modals.noticeRules.highlightOnly'))
          .onClick(() => {
            textRule.highlightOnly = !textRule.highlightOnly;
            highlightBtn.buttonEl.classList.toggle('is-active', textRule.highlightOnly);
          });
        highlightBtn.buttonEl.classList.toggle('is-active', textRule.highlightOnly);
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
      console.warn('Theme Engine: SortableJS not found, drag & drop disabled.');
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
