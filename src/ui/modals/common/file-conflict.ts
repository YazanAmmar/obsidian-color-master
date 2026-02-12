import { App, ButtonComponent } from 'obsidian';
import { t } from '../../../i18n/strings';
import type ColorMaster from '../../../main';
import { ColorMasterBaseModal } from '../base';

/**
 * Modal shown when adding a background image that already exists
 */
export class FileConflictModal extends ColorMasterBaseModal {
  plugin: ColorMaster;
  arrayBuffer: ArrayBuffer;
  fileName: string;
  onResolve: (choice: 'replace' | 'keep') => void;

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
