import { Notice } from "obsidian";
import { t } from "../i18n/strings";
import type ColorMaster from "../main";

/**
 * Registers all commands for the Color Master plugin.
 * @param plugin - The instance of the Color Master plugin.
 */
export function registerCommands(plugin: ColorMaster) {
  // Command to toggle the plugin on and off.
  plugin.addCommand({
    id: "toggle-color-master",
    name: t("commands.enableDisable"),
    callback: async () => {
      plugin.settings.pluginEnabled = !plugin.settings.pluginEnabled;
      await plugin.saveSettings();
      new Notice(
        plugin.settings.pluginEnabled
          ? t("notices.pluginEnabled")
          : t("notices.pluginDisabled")
      );
    },
  });

  // Command to cycle to the next color profile in the list.
  plugin.addCommand({
    id: "cycle-next-color-profile",
    name: t("commands.cycleNext"),
    callback: async () => {
      const names = Object.keys(plugin.settings.profiles || {});
      if (names.length === 0) {
        new Notice(t("notices.noProfilesFound"));
        return;
      }
      const idx = names.indexOf(plugin.settings.activeProfile);
      const next = names[(idx + 1) % names.length];
      plugin.settings.activeProfile = next;
      await plugin.saveSettings();
      new Notice(t("notices.activeProfileSwitched", next));
    },
  });

  // Command to cycle to the previous color profile in the list.
  plugin.addCommand({
    id: "cycle-previous-color-profile",
    name: t("commands.cyclePrevious"),
    callback: async () => {
      const names = Object.keys(plugin.settings.profiles || {});
      if (names.length === 0) {
        new Notice(t("notices.noProfilesFound"));
        return;
      }
      const currentIndex = names.indexOf(plugin.settings.activeProfile);
      const previousIndex = (currentIndex - 1 + names.length) % names.length;
      const previousProfile = names[previousIndex];

      plugin.settings.activeProfile = previousProfile;
      await plugin.saveSettings();
      new Notice(t("notices.activeProfileSwitched", previousProfile));
    },
  });

  // Command to open the plugin's settings tab directly.
  plugin.addCommand({
    id: "open-color-master-settings-tab",
    name: t("commands.openSettings"),
    callback: () => {
      (plugin.app as any).setting.open();
      (plugin.app as any).setting.openTabById(plugin.manifest.id);
    },
  });

  // Command to cycle through the active profile's theme (light, dark, auto).
  plugin.addCommand({
    id: "toggle-active-profile-theme",
    name: t("commands.toggleTheme"),
    callback: async () => {
      const activeProfileName = plugin.settings.activeProfile;
      const activeProfile = plugin.settings.profiles[activeProfileName];

      if (!activeProfile) {
        new Notice("notices.profileNotFound");
        return;
      }

      const currentTheme = activeProfile.themeType || "auto";
      let nextTheme: "auto" | "dark" | "light";
      let noticeMessage: string;

      if (currentTheme === "light") {
        nextTheme = "dark";
        noticeMessage = t("notices.themeSwitchedDark");
      } else if (currentTheme === "dark") {
        nextTheme = "auto";
        noticeMessage = t("notices.themeSwitchedAuto");
      } else {
        nextTheme = "light";
        noticeMessage = t("notices.themeSwitchedLight");
      }

      activeProfile.themeType = nextTheme;
      await plugin.saveSettings();
      new Notice(noticeMessage);
    },
  });
}
