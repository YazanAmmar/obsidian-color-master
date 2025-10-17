import { Setting, Notice, setIcon } from "obsidian";
import { t } from "../../i18n";
import type { ColorMasterSettingTab } from "../settingsTab";
import { CustomVariableMetaModal, ConfirmationModal } from "../modals";

export function drawOptionsSection(
  containerEl: HTMLElement,
  settingTab: ColorMasterSettingTab
) {
  const plugin = settingTab.plugin;

  containerEl.createEl("h3", { text: t("OPTIONS_HEADING") });
  containerEl.createEl("hr");
  const advancedSettingsGrid = containerEl.createDiv(
    "cm-advanced-settings-grid"
  );

  // --- Live Update FPS ---
  const fpsSetting = new Setting(advancedSettingsGrid)
  .setName(t("UPDATE_FREQUENCY_NAME"))
  .setDesc(t("UPDATE_FREQUENCY_DESC"))
  .addSlider((slider) => {
    slider
    .setLimits(0, 60, 1)
    .setValue(plugin.settings.colorUpdateFPS)
    .setDynamicTooltip()
    .onChange(async (value) => {
      plugin.settings.colorUpdateFPS = value;
      await plugin.saveSettings();
      plugin.restartColorUpdateLoop();
      new Notice(t("NOTICE_FPS_UPDATED", value));
    });
  });
  
  // Move the slider control next to the name
  fpsSetting.nameEl.appendChild(fpsSetting.controlEl);
  fpsSetting.settingEl.classList.add("cm-card-with-header-control");
  
  // --- Add Custom Variable ---
  const customVarSetting = new Setting(advancedSettingsGrid)
    .setName(t("ADD_CUSTOM_VARIABLE_NAME"))
    .setDesc(t("ADD_CUSTOM_VARIABLE_DESC"))
    .addButton((button) => {
      button
        .setButtonText(t("ADD_NEW_VARIABLE_BUTTON"))
        .setClass("cm-add-variable-button")
        .onClick(() => {
          new CustomVariableMetaModal(
            settingTab.app,
            plugin,
            settingTab,
            async (result) => {
              const activeProfile =
                plugin.settings.profiles[plugin.settings.activeProfile];
              if (!activeProfile.customVarMetadata) {
                activeProfile.customVarMetadata = {};
              }

              activeProfile.vars[result.varName] = result.varValue;
              activeProfile.customVarMetadata[result.varName] = {
                name: result.displayName,
                desc: result.description,
              };

              await plugin.saveSettings();
              new Notice(t("NOTICE_VAR_ADDED", result.varName));
              settingTab.display();
            }
          ).open();
        });
    });
  // Move the button control next to the name
  customVarSetting.nameEl.appendChild(customVarSetting.controlEl);
  customVarSetting.settingEl.classList.add("cm-card-with-header-control");

  // --- Reset Plugin Settings ---
  const resetSetting = new Setting(advancedSettingsGrid)
    .setName(t("RESET_PLUGIN_NAME"))
    .setDesc(t("RESET_PLUGIN_DESC"))
    .addButton((button) => {
      button
        .setButtonText(t("RESET_PLUGIN_BUTTON"))
        .setWarning()
        .onClick(() => {
          new ConfirmationModal(
            settingTab.app,
            plugin,
            t("RESET_CONFIRM_MODAL_TITLE"),
            t("RESET_CONFIRM_MODAL_DESC"),
            () => {
              plugin.resetPluginData();
            },
            { buttonText: t("DELETE_BUTTON"), buttonClass: "mod-warning" }
          ).open();
        });
      setIcon(button.buttonEl, "database-backup");
      button.buttonEl.classList.add("cm-reset-plugin-icon-button");
    });
  // Move the icon button control next to the name
  resetSetting.nameEl.appendChild(resetSetting.controlEl);
  resetSetting.settingEl.classList.add("cm-card-with-header-control");
  // Remove the text from the reset button to only keep the icon
  const resetButtonText = resetSetting.controlEl.querySelector(
    ".setting-editor-button"
  );
  if (resetButtonText) {
    resetButtonText.textContent = "";
  }
}
