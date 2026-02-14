import { t } from '../../i18n/strings';
import { PasteCssModal, ProfileJsonImportModal } from '../modals';
import type { ThemeEngineSettingTab } from '../settingsTab';

export function drawImportExport(containerEl: HTMLElement, settingTab: ThemeEngineSettingTab) {
  const profileShell = containerEl.querySelector<HTMLElement>('.cm-profile-manager-shell');
  const actionsHost = profileShell || containerEl;
  const actionsEl = actionsHost.createDiv('cm-profile-actions');
  const outputGroup = actionsEl.createDiv(
    'cm-profile-actions-group cm-profile-actions-group-export',
  );
  const inputGroup = actionsEl.createDiv(
    'cm-profile-actions-group cm-profile-actions-group-import',
  );

  // Output Actions (Export / Copy)
  outputGroup
    .createEl('button', {
      text: t('buttons.exportFile'),
      cls: 'cm-profile-action-btn',
    })
    .addEventListener('click', () => settingTab._exportProfileToFile());

  outputGroup
    .createEl('button', {
      text: t('buttons.copyJson'),
      cls: 'cm-profile-action-btn',
    })
    .addEventListener('click', () => {
      void settingTab._copyProfileToClipboard().catch((err) => {
        console.error('Failed to copy profile to clipboard:', err);
      });
    });

  // Input Actions (Import CSS / JSON)
  const pasteCssBtn = inputGroup.createEl('button', {
    text: t('buttons.importCss'),
    cls: 'cm-profile-action-btn cm-paste-css-btn',
  });

  pasteCssBtn.addEventListener('click', () => {
    new PasteCssModal(settingTab.app, settingTab.plugin, settingTab, null).open();
  });

  inputGroup
    .createEl('button', {
      text: t('buttons.importJson'),
      cls: 'cm-profile-action-btn mod-cta',
    })
    .addEventListener('click', () =>
      new ProfileJsonImportModal(settingTab.app, settingTab.plugin, settingTab).open(),
    );
}
