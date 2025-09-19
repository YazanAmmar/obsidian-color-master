import { t } from "../../i18n";
import { PasteCssModal, ProfileJsonImportModal } from "../modals";
import type { ColorMasterSettingTab } from "../settingsTab";

export function drawImportExport(
  containerEl: HTMLElement,
  settingTab: ColorMasterSettingTab
) {
  const actionsEl = containerEl.createDiv("cm-profile-actions");

  actionsEl
    .createEl("button", {
      text: t("EXPORT_FILE_BUTTON"),
      cls: "cm-profile-action-btn",
    })
    .addEventListener("click", () => settingTab._exportProfileToFile());

  actionsEl
    .createEl("button", {
      text: t("COPY_JSON_BUTTON"),
      cls: "cm-profile-action-btn",
    })

    .addEventListener("click", () => settingTab._copyProfileToClipboard());

  actionsEl.createDiv({ cls: "cm-profile-action-spacer" });

  const pasteCssBtn = actionsEl.createEl("button", {
    text: t("IMPORT_PASTE_CSS_BUTTON"),
    cls: "cm-profile-action-btn cm-paste-css-btn",
  });
  pasteCssBtn.createSpan({
    cls: "cm-badge-new",
    text: t("NEW_PROFILE"),
  });

  pasteCssBtn.addEventListener("click", () => {
    new PasteCssModal(
      settingTab.app,
      settingTab.plugin,
      settingTab,
      null,
      "Profile"
    ).open();
  });

  actionsEl
    .createEl("button", {
      text: t("IMPORT_PASTE_JSON_BUTTON"),
      cls: "cm-profile-action-btn mod-cta",
    })
    .addEventListener("click", () =>
      new ProfileJsonImportModal(
        settingTab.app,
        settingTab.plugin,
        settingTab
      ).open()
    );
}
