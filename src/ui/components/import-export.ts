import { t } from "../../i18n/strings";
import { PasteCssModal, ProfileJsonImportModal } from "../modals";
import type { ColorMasterSettingTab } from "../settingsTab";

export function drawImportExport(
  containerEl: HTMLElement,
  settingTab: ColorMasterSettingTab
) {
  const actionsEl = containerEl.createDiv("cm-profile-actions");

  // --- 1. Output Actions (Export / Copy) ---
  actionsEl
    .createEl("button", {
      text: t("buttons.exportFile"),
      cls: "cm-profile-action-btn",
    })
    .addEventListener("click", () => settingTab._exportProfileToFile());

  actionsEl
    .createEl("button", {
      text: t("buttons.copyJson"),
      cls: "cm-profile-action-btn",
    })
    .addEventListener("click", () => {
      void settingTab._copyProfileToClipboard().catch((err) => {
        console.error("Failed to copy profile to clipboard:", err);
      });
    });

  // Spacer to push input actions to the right
  actionsEl.createDiv({ cls: "cm-profile-action-spacer" });

  // --- 2. Input Actions (Import CSS / JSON) ---
  const pasteCssBtn = actionsEl.createEl("button", {
    text: t("buttons.importCss"),
    cls: "cm-profile-action-btn cm-paste-css-btn",
  });

  pasteCssBtn.addEventListener("click", () => {
    new PasteCssModal(
      settingTab.app,
      settingTab.plugin,
      settingTab,
      null
    ).open();
  });

  actionsEl
    .createEl("button", {
      text: t("buttons.importJson"),
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
