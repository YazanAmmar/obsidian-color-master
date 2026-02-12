import { App, Notice, Setting } from 'obsidian';
import { t } from '../../../i18n/strings';
import type ColorMaster from '../../../main';
import { ColorMasterBaseModal } from '../base';

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
