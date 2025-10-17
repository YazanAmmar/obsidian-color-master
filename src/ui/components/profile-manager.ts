import { App, Notice, setIcon, Setting } from "obsidian";
import {
  BUILT_IN_PROFILES_DATA,
  BUILT_IN_PROFILES_VARS,
  DEFAULT_VARS,
} from "../../constants";
import { t } from "../../i18n";
import { flattenVars } from "../../utils";
import { ConfirmationModal, NewProfileModal, PasteCssModal } from "../modals";
import type { ColorMasterSettingTab } from "../settingsTab";

interface AppWithCustomCss extends App {
  customCss: {
    theme: string;
  };
}

export function drawProfileManager(
  containerEl: HTMLElement,
  settingTab: ColorMasterSettingTab
) {
  const plugin = settingTab.plugin;

  containerEl.createEl("h3", {
    text: t("PROFILE_MANAGER"),
    cls: "cm-section-heading",
  });
  const activeProfileName = plugin.settings.activeProfile;
  const activeProfile = plugin.settings.profiles[activeProfileName];
  const isBuiltInProfile = Object.keys(BUILT_IN_PROFILES_VARS).includes(
    activeProfileName
  );
  const isCssProfile = activeProfile?.isCssProfile;

  const profileSetting = new Setting(containerEl)
    .setName(t("ACTIVE_PROFILE"))
    .setDesc(t("ACTIVE_PROFILE_DESC"))
    .setClass("cm-profile-manager-controls")
    .addDropdown((dropdown) => {
      for (const profileName in plugin.settings.profiles) {
        let displayName = profileName;
        if (plugin.settings.profiles[profileName]?.isCssProfile) {
          displayName += " (CSS)";
        }
        dropdown.addOption(profileName, displayName);
      }
      dropdown.setValue(activeProfileName);
      dropdown.onChange(async (value) => {
        plugin.removeInjectedCustomCss();
        plugin.settings.activeProfile = value;
        await plugin.saveSettings();
        settingTab.display();
      });
    })

.addButton((button) => {
  const activeProfile = plugin.settings.profiles[plugin.settings.activeProfile];
  if (!activeProfile) {
    button.buttonEl.hide();
    return;
  }

  button.buttonEl.classList.add("cm-control-button");

  // Helper function to update the button's appearance
  const updateButtonAppearance = (themeType: 'auto' | 'dark' | 'light') => {
    switch (themeType) {
      case 'light':
        button
          .setIcon('sun')
          .setTooltip(t('TOOLTIP_THEME_LIGHT'));
        break;
      case 'dark':
        button
          .setIcon('moon')
          .setTooltip(t('TOOLTIP_THEME_DARK'));
        break;
      case 'auto':
      default:
        button
          .setIcon('sun-moon')
          .setTooltip(t('TOOLTIP_THEME_AUTO'));
        break;
    }
  };

  // Set the initial state of the button on load
  updateButtonAppearance(activeProfile.themeType);

  // Add the click logic to cycle through themes
  button.onClick(async () => {
    const currentType = activeProfile.themeType;
    let nextType: 'auto' | 'dark' | 'light';

    if (currentType === 'light') {
      nextType = 'dark';
    } else if (currentType === 'dark') {
      nextType = 'auto';
    } else { // 'auto'
      nextType = 'light';
    }

    activeProfile.themeType = nextType;
    updateButtonAppearance(nextType); // Update UI instantly
    await plugin.saveSettings(); // Save and apply styles
  });
})

    .addButton((button) => {
      if (isBuiltInProfile) {
        button
          .setIcon("history")
          .setTooltip(t("TOOLTIP_RESTORE_BUILTIN"))
          .onClick(() => {
            new ConfirmationModal(
              settingTab.app,
              plugin,
              t("RESTORE_PROFILE_MODAL_TITLE", activeProfileName),
              t("RESTORE_PROFILE_MODAL_DESC", activeProfileName),
              async () => {
                const originalProfileData =
                  BUILT_IN_PROFILES_DATA[
                    activeProfileName as keyof typeof BUILT_IN_PROFILES_DATA
                  ];
                if (!originalProfileData) {
                  new Notice(t("NOTICE_CANNOT_FIND_ORIGINAL_PROFILE"));
                  return;
                }

                plugin.settings.profiles[activeProfileName] = JSON.parse(
                  JSON.stringify(originalProfileData)
                );

                await plugin.saveSettings();
                new Notice(t("NOTICE_PROFILE_RESTORED", activeProfileName));
                settingTab.display();
              },
              { buttonText: t("RESTORE_BUTTON"), buttonClass: "mod-cta" }
            ).open();
          });
      } else if (isCssProfile && activeProfile) {
        button
          .setIcon("pencil")
          .setTooltip(t("TOOLTIP_EDIT_CSS_PROFILE"))
          .onClick(() => {
            const profileData = {
              name: activeProfileName,
              css: activeProfile.customCss || "",
              isProfile: true,
            };
            new PasteCssModal(
              settingTab.app,
              plugin,
              settingTab,
              profileData
            ).open();
          });
      } else {
        button.buttonEl.hide();
      }
      button.buttonEl.classList.add("cm-control-button");
    })

    .addButton((button) => {
      settingTab.pinBtn = button;
      button
        .setIcon("pin")
        .setTooltip(t("TOOLTIP_PIN_SNAPSHOT"))
        .onClick(async () => {
          await plugin.pinProfileSnapshot(plugin.settings.activeProfile);
          new Notice(t("NOTICE_PROFILE_PINNED"));
          settingTab._updatePinButtons();
        });
      button.buttonEl.classList.add("cm-control-button");
    })
    .addButton((button) => {
      settingTab.resetPinBtn = button;
      button
        .setIcon("reset")
        .setTooltip(t("TOOLTIP_RESET_TO_PINNED"))

        .onClick(() => {
          const name = plugin.settings.activeProfile;
          new ConfirmationModal(
            settingTab.app,
            plugin,
            t("RESET_CONFIRM_TITLE"),
            t("RESET_CONFIRM_DESC"),
            async () => {
              await plugin.resetProfileToPinned(name);
              new Notice(t("NOTICE_PROFILE_RESET"));
              settingTab.display();
            },
            { buttonText: t("RESET_BUTTON"), buttonClass: "mod-cta" }
          ).open();
        });
      button.buttonEl.classList.add("cm-control-button");
    })
    .addButton((button) => {
      button.setButtonText(t("NEW_BUTTON")).onClick(() => {
        new NewProfileModal(settingTab.app, plugin, (result) => {
          if (result && result.name && !plugin.settings.profiles[result.name]) {
            let newProfileVars: Record<string, string> = {};
            if (result.themeType === "light") {
              newProfileVars = {
                ...BUILT_IN_PROFILES_DATA["Citrus Zest"].vars,
              };
            } else {
              newProfileVars = { ...flattenVars(DEFAULT_VARS) };
            }

            plugin.settings.profiles[result.name] = {
              vars: newProfileVars,
              themeType: result.themeType,
              snippets: [],
              noticeRules: { text: [], background: [] },
            };

            plugin.settings.activeProfile = result.name;
            void plugin.saveSettings();
            settingTab.display();
          } else if (result && result.name) {
            new Notice(t("PROFILE_EXISTS_NOTICE", result.name));
          }
        }).open();
      });
      button.buttonEl.classList.add("cm-control-button");
    })
    .addButton((button) => {
      button.setButtonText(t("DELETE_BUTTON")).onClick(() => {
        if (Object.keys(plugin.settings.profiles).length <= 1) {
          new Notice(t("CANNOT_DELETE_LAST_PROFILE"));
          return;
        }
        const message = t(
          "DELETE_PROFILE_CONFIRMATION",
          plugin.settings.activeProfile
        );
        new ConfirmationModal(
          settingTab.app,
          plugin,
          t("DELETE_PROFILE_TITLE"),
          message,
          () => {
            plugin.removeInjectedCustomCss();
            delete plugin.settings.profiles[plugin.settings.activeProfile];
            plugin.settings.activeProfile = Object.keys(
              plugin.settings.profiles
            )[0];
            void plugin.saveSettings();
            settingTab.display();
            new Notice(t("PROFILE_DELETED_NOTICE"));
          }
        ).open();
      });
      button.buttonEl.classList.add("cm-control-button");
    });

  const currentTheme = (plugin.app as AppWithCustomCss).customCss.theme;

  if (currentTheme) {
    const iconEl = profileSetting.nameEl.createSpan({
      cls: "cm-theme-warning-icon",
    });

    setIcon(iconEl, "alert-triangle");
    iconEl.setAttr("aria-label", t("THEME_WARNING_TOOLTIP", currentTheme));
  }

  profileSetting.settingEl.classList.add("cm-active-profile-controls");
  settingTab._updatePinButtons();
}
