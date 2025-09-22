import { Setting, Notice } from "obsidian";
import { t } from "../../i18n";
import type { ColorMasterSettingTab } from "../settingsTab";
import { CustomVariableMetaModal } from "../modals";

export function drawOptionsSection(
  containerEl: HTMLElement,
  settingTab: ColorMasterSettingTab
) {
  const plugin = settingTab.plugin;

  containerEl.createEl("h3", { text: t("OPTIONS_HEADING") });

  new Setting(containerEl)
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

  const customVarSetting = new Setting(containerEl)
    .setName(t("ADD_CUSTOM_VARIABLE_NAME"))
    .addButton((button) => {
      button.setButtonText(t("ADD_NEW_VARIABLE_BUTTON")).onClick(() => {
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

  customVarSetting.descEl.empty();
  customVarSetting.descEl.appendText(t("ADD_CUSTOM_VARIABLE_DESC"));
  customVarSetting.settingEl.addClass("cm-add-variable-setting");
}
