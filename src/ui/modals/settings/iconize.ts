import { App, Notice, Setting } from 'obsidian';
import { t } from '../../../i18n/strings';
import type ThemeEngine from '../../../main';
import { ThemeEngineBaseModal } from '../base';

interface AppWithPlugins extends App {
  plugins: {
    getPlugin(id: string): unknown;
  };
}

export class IconizeSettingsModal extends ThemeEngineBaseModal {
  plugin: ThemeEngine;

  constructor(app: App, plugin: ThemeEngine) {
    super(app, plugin);
  }

  onOpen() {
    super.onOpen();
    this.modalEl.classList.add('theme-engine-modal');
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
            const pluginManager = (this.app as AppWithPlugins).plugins;
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
