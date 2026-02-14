import { App, ButtonComponent, Setting } from 'obsidian';
import { t } from '../../../i18n/strings';
import type ThemeEngine from '../../../main';
import { ThemeEngineBaseModal } from '../base';

/**
 * Modal for granular data reset operations.
 * Allows users to select specific data categories to wipe or preserve.
 */
export class AdvancedResetModal extends ThemeEngineBaseModal {
  plugin: ThemeEngine;

  private defaultResetOptions = {
    deleteProfiles: false,
    deleteSnippets: false,
    deleteSettings: false,
    deleteBackgrounds: false,
    deleteLanguages: false,
  };

  // Hydrated reset state: Merges persisted user preferences with defaults
  resetOptions = {
    // Merge saved preferences with defaults, prioritizing saved state
    ...(this.plugin.settings.advancedResetOptions || this.defaultResetOptions),
    // Safety: Ensure background deletion defaults to false unless explicitly saved
    deleteBackgrounds:
      this.plugin.settings.advancedResetOptions?.deleteBackgrounds ||
      this.defaultResetOptions.deleteBackgrounds,
  };

  deleteButton: ButtonComponent;

  constructor(app: App, plugin: ThemeEngine) {
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

    // Execution Button: Triggers the reset process only if a category is selected
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

  /**
   * Syncs the delete button's state with the current selection.
   * Ensures the UI prevents empty reset operations.
   */
  validateButton() {
    const hasSelection = Object.values(this.resetOptions).some((v) => v === true);
    this.deleteButton.setDisabled(!hasSelection);
    this.deleteButton.setButtonText(hasSelection ? t('buttons.delete') : t('buttons.selectOption'));
  }

  onClose() {
    this.contentEl.empty();
  }
}
