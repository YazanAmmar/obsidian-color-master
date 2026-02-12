import { App, ButtonComponent, Component, MarkdownRenderer } from 'obsidian';
import { t } from '../../i18n/strings';
import type ColorMaster from '../../main';
import { ColorMasterBaseModal } from './base';

/**
 * A simple modal for showing informational text, rendered as markdown.
 */
export class LanguageInfoModal extends ColorMasterBaseModal {
  constructor(app: App, plugin: ColorMaster) {
    super(app, plugin);
  }

  onOpen() {
    super.onOpen();
    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.classList.add('color-master-modal', 'cm-info-modal');

    contentEl.createEl('h3', { text: t('modals.langInfo.title') });

    const infoContainer = contentEl.createDiv({ cls: 'cm-info-content' });

    const comp = new Component();

    void MarkdownRenderer.render(
      this.app,
      t('modals.langInfo.desc'),
      infoContainer,
      '',
      comp,
    ).catch((err) => {
      console.error('Failed to render markdown:', err);
    });

    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container',
    });

    new ButtonComponent(buttonContainer)
      .setButtonText(t('buttons.apply'))
      .setCta()
      .onClick(() => {
        this.close();
      });
  }

  onClose() {
    this.contentEl.empty();
  }
}
