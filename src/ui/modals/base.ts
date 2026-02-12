import { App, Modal } from 'obsidian';
import type ColorMaster from '../../main';

/**
 * A new Base Modal that all Color Master modals should extend from.
 * It automatically handles applying the correct RTL/LTR direction.
 */
export class ColorMasterBaseModal extends Modal {
  plugin: ColorMaster;

  constructor(app: App, plugin: ColorMaster) {
    super(app);
    this.plugin = plugin;
    this.modalEl.classList.add('color-master-modal');
  }

  /**
   * Overridden onOpen to apply RTL settings automatically.
   * Child classes MUST call super.onOpen() if they override this.
   */
  onOpen() {
    const langCode = this.plugin.settings.language;
    const customLang = this.plugin.settings.customLanguages?.[langCode];
    const isCoreRtlLang = langCode === 'ar' || langCode === 'fa';
    const isCustomRtlLang = customLang?.isRtl === true;
    const isRtlEnabled = this.plugin.settings.useRtlLayout;
    const isRTL = (isCoreRtlLang || isCustomRtlLang) && isRtlEnabled;

    this.modalEl.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  }
}
