import { App } from 'obsidian';
import { t } from '../../../i18n/strings';
import type ColorMaster from '../../../main';
import { ColorMasterBaseModal } from '../base';

export class ConfirmationModal extends ColorMasterBaseModal {
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
    options: { buttonText?: string; buttonClass?: string } = {},
  ) {
    super(app, plugin);
    this.title = title;
    this.message = message;
    this.onConfirm = onConfirm;
    this.confirmButtonText = options.buttonText || t('buttons.delete');
    this.confirmButtonClass = options.buttonClass || 'mod-warning';
  }

  onOpen() {
    super.onOpen();

    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h3', { text: this.title });
    contentEl.createEl('p').append(this.message);

    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container',
    });

    const cancelButton = buttonContainer.createEl('button', {
      text: t('buttons.cancel'),
    });
    cancelButton.addEventListener('click', () => this.close());

    const confirmButton = buttonContainer.createEl('button', {
      text: this.confirmButtonText,
      cls: this.confirmButtonClass,
    });
    confirmButton.addEventListener('click', () => {
      this.onConfirm();
      this.close();
    });
  }

  onClose() {
    this.contentEl.empty();
  }
}
