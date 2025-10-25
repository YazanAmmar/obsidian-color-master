import { Setting, Notice, setIcon } from "obsidian";
import { t } from "../../i18n";
import type { ColorMasterSettingTab } from "../settingsTab";
import {
  CustomVariableMetaModal,
  ConfirmationModal,
  BackgroundImageSettingsModal,
  FileConflictModal,
  AddBackgroundModal,
  ProfileImageBrowserModal,
} from "../modals";

export function drawOptionsSection(
  containerEl: HTMLElement,
  settingTab: ColorMasterSettingTab
) {
  const plugin = settingTab.plugin;
  const activeProfile = plugin.settings.profiles[plugin.settings.activeProfile];

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
  resetSetting.nameEl.appendChild(resetSetting.controlEl);
  resetSetting.settingEl.classList.add("cm-card-with-header-control");
  const resetButtonText = resetSetting.controlEl.querySelector(
    ".setting-editor-button"
  );
  if (resetButtonText) {
    resetButtonText.textContent = "";
  }

  // --- Set Background Image ---
  const backgroundSetting = new Setting(advancedSettingsGrid)
    .setName(t("SET_BACKGROUND_IMAGE_NAME"))
    .setDesc(t("SET_BACKGROUND_IMAGE_DESC"));

  backgroundSetting.nameEl.appendChild(backgroundSetting.controlEl);
  backgroundSetting.settingEl.classList.add("cm-card-with-header-control");

  backgroundSetting
    .addButton((button) => {
      // Add/Choose Button
      button
        .setIcon("plus")
        .setTooltip(t("TOOLTIP_ADD_BACKGROUND_IMAGE"))
        .setClass("cm-control-icon-button")
        .onClick(() => {
          // Pass the settingTab instance to the modal
          new AddBackgroundModal(settingTab.app, plugin, settingTab).open();
        });
    })
    .addButton((button) => {
      // Browse Button
      button
        .setIcon("package-search")
        .setTooltip(t("TOOLTIP_BROWSE_BACKGROUND_IMAGES"))
        .setClass("cm-control-icon-button")
        .onClick(() => {
          // Directly open the browser modal
          new ProfileImageBrowserModal(
            settingTab.app,
            plugin,
            settingTab,
            () => {}
          ).open();
        });
    })
    .addButton((button) => {
      // Remove Button
      button
        .setIcon("trash")
        .setTooltip(t("TOOLTIP_REMOVE_BACKGROUND_IMAGE"))
        .setClass("cm-control-icon-button")
        .onClick(async () => {
          const profile =
            plugin.settings.profiles[plugin.settings.activeProfile];
          if (!profile?.backgroundImage) {
            new Notice(t("NOTICE_NO_BACKGROUND_IMAGE_TO_REMOVE"));
            return;
          }
          new ConfirmationModal(
            settingTab.app,
            plugin,
            t("CONFIRM_BACKGROUND_DELETION_TITLE"),
            t("CONFIRM_BACKGROUND_DELETION_DESC"),
            async () => {
              await plugin.removeBackgroundImage();
              new Notice(t("NOTICE_BACKGROUND_IMAGE_DELETED"));
            },
            {
              buttonText: t("DELETE_ANYWAY_BUTTON"),
              buttonClass: "mod-warning",
            }
          ).open();
        });
    })
    .addButton((button) => {
      // Settings Button
      button
        .setIcon("settings")
        .setTooltip(t("TOOLTIP_BACKGROUND_IMAGE_SETTINGS"))
        .setClass("cm-control-icon-button")
        .onClick(() => {
          new BackgroundImageSettingsModal(settingTab.app, plugin).open();
        });
    });
}
