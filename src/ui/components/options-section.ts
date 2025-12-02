import { Setting, Notice, setIcon } from "obsidian";
import { t } from "../../i18n/strings";
import type { ColorMasterSettingTab } from "../settingsTab";
import {
  CustomVariableMetaModal,
  ConfirmationModal,
  BackgroundImageSettingsModal,
  AddBackgroundModal,
  ProfileImageBrowserModal,
  AdvancedResetModal,
} from "../modals";

export function drawOptionsSection(
  containerEl: HTMLElement,
  settingTab: ColorMasterSettingTab,
) {
  const plugin = settingTab.plugin;
  const activeProfile = plugin.settings.profiles[plugin.settings.activeProfile];

  containerEl.createEl("h3", { text: t("options.heading") });
  containerEl.createEl("hr");
  const advancedSettingsGrid = containerEl.createDiv(
    "cm-advanced-settings-grid",
  );

  // --- Live Update FPS ---
  const fpsSetting = new Setting(advancedSettingsGrid)
    .setName(t("options.liveUpdateName"))
    .setDesc(t("options.liveUpdateDesc"))
    .addSlider((slider) => {
      slider
        .setLimits(0, 60, 1)
        .setValue(plugin.settings.colorUpdateFPS)
        .setDynamicTooltip()
        .onChange(async (value) => {
          plugin.settings.colorUpdateFPS = value;
          await plugin.saveSettings();
          plugin.restartColorUpdateLoop();
          new Notice(t("notices.fpsUpdated", value));
        });
    });

  fpsSetting.nameEl.appendChild(fpsSetting.controlEl);
  fpsSetting.settingEl.classList.add("cm-card-with-header-control");

  // --- Add Custom Variable ---
  const customVarSetting = new Setting(advancedSettingsGrid)
    .setName(t("options.addCustomVarName"))
    .setDesc(t("options.addCustomVarDesc"))
    .addButton((button) => {
      button
        .setButtonText(t("options.addNewVarButton"))
        .setClass("cm-add-variable-button")
        .onClick(() => {
          new CustomVariableMetaModal(
            settingTab.app,
            plugin,
            settingTab,
            (result) => {
              void (async () => {
                if (!activeProfile.customVarMetadata) {
                  activeProfile.customVarMetadata = {};
                }

                activeProfile.vars[result.varName] = result.varValue;
                activeProfile.customVarMetadata[result.varName] = {
                  name: result.displayName,
                  desc: result.description,
                  type: result.varType,
                };

                await plugin.saveSettings();
                new Notice(t("notices.varAdded", result.varName));
                settingTab.display();
              })().catch((err) => {
                console.error("Failed to add custom variable:", err);
              });
            },
          ).open();
        });
    });
  customVarSetting.nameEl.appendChild(customVarSetting.controlEl);
  customVarSetting.settingEl.classList.add("cm-card-with-header-control");

  // --- Reset Plugin Settings ---
  const resetSetting = new Setting(advancedSettingsGrid)
    .setName(t("options.resetPluginName"))
    .setDesc(t("options.resetPluginDesc"))
    .addButton((button) => {
      button
        .setButtonText(t("options.resetPluginButton"))
        .setWarning()
        .onClick(() => {
          new AdvancedResetModal(settingTab.app, plugin).open();
        });
      setIcon(button.buttonEl, "database-backup");
      button.buttonEl.classList.add("cm-reset-plugin-icon-button");
    });
  resetSetting.nameEl.appendChild(resetSetting.controlEl);
  resetSetting.settingEl.classList.add("cm-card-with-header-control");
  const resetButtonText = resetSetting.controlEl.querySelector(
    ".setting-editor-button",
  );
  if (resetButtonText) {
    resetButtonText.textContent = "";
  }

  // --- Set Background Image ---
  const backgroundSetting = new Setting(advancedSettingsGrid)
    .setName(t("options.backgroundName"))
    .setDesc(t("options.backgroundDesc"));

  backgroundSetting.nameEl.appendChild(backgroundSetting.controlEl);
  backgroundSetting.settingEl.classList.add("cm-card-with-header-control");

  backgroundSetting
    .addButton((button) => {
      // Add/Choose Button
      button
        .setIcon("plus")
        .setTooltip(t("tooltips.addBg"))
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
        .setTooltip(t("tooltips.browseBg"))
        .setClass("cm-control-icon-button")
        .onClick(() => {
          // Directly open the browser modal
          new ProfileImageBrowserModal(
            settingTab.app,
            plugin,
            settingTab,
            () => {},
          ).open();
        });
    })
    .addButton((button) => {
      // Remove Button
      button
        .setIcon("trash")
        .setTooltip(t("tooltips.removeBg"))
        .setClass("cm-control-icon-button")
        .onClick(() => {
          const profile =
            plugin.settings.profiles[plugin.settings.activeProfile];
          const imagePathToDelete = profile?.backgroundPath;

          if (!imagePathToDelete) {
            new Notice(t("notices.noBgToRemove"));
            return;
          }

          const profilesUsingImage: string[] = [];
          for (const profileName in plugin.settings.profiles) {
            if (
              plugin.settings.profiles[profileName].backgroundPath ===
              imagePathToDelete
            ) {
              profilesUsingImage.push(profileName);
            }
          }

          const messageFragment = new DocumentFragment();
          messageFragment.append(t("modals.confirmation.deleteGlobalBgDesc"));

          if (profilesUsingImage.length > 0) {
            const profileListEl = messageFragment.createEl("ul", {
              cls: "cm-profile-list-modal",
            });
            profilesUsingImage.forEach((name) => {
              profileListEl.createEl("li").createEl("strong", { text: name });
            });
          }

          new ConfirmationModal(
            settingTab.app,
            plugin,
            t("modals.confirmation.deleteGlobalBgTitle"),
            messageFragment,
            () => {
              void (async () => {
                await plugin.removeBackgroundMediaByPath(imagePathToDelete);
                new Notice(t("notices.bgDeleted"));
              })().catch((err) => {
                console.error("Failed to delete background image:", err);
              });
            },
            {
              buttonText: t("buttons.deleteAnyway"),
              buttonClass: "mod-warning",
            },
          ).open();
        });
    })
    .addButton((button) => {
      // Settings Button
      button
        .setIcon("settings")
        .setTooltip(t("tooltips.bgSettings"))
        .setClass("cm-control-icon-button")
        .onClick(() => {
          new BackgroundImageSettingsModal(settingTab.app, plugin).open();
        });
    });
}
