import { Notice } from "obsidian";
import { t } from "../i18n";
import type ColorMaster from "../main";

/**
 * Registers all commands for the Color Master plugin.
 * @param plugin - The instance of the Color Master plugin.
 */
export function registerCommands(plugin: ColorMaster) {
  // Command to toggle the plugin on and off.
  plugin.addCommand({
    id: "toggle-color-master",
    name: t("COMMAND_ENABLE_DISABLE"),
    callback: async () => {
      plugin.settings.pluginEnabled = !plugin.settings.pluginEnabled;
      await plugin.saveSettings();
      new Notice(
        plugin.settings.pluginEnabled
          ? t("PLUGIN_ENABLED_NOTICE")
          : t("PLUGIN_DISABLED_NOTICE")
      );
    },
  });

  // Command to cycle to the next color profile in the list.
  plugin.addCommand({
    id: "cycle-next-color-profile",
    name: t("COMMAND_CYCLE_NEXT"),
    callback: async () => {
      const names = Object.keys(plugin.settings.profiles || {});
      if (names.length === 0) {
        new Notice(t("NOTICE_NO_PROFILES_FOUND"));
        return;
      }
      const idx = names.indexOf(plugin.settings.activeProfile);
      const next = names[(idx + 1) % names.length];
      plugin.settings.activeProfile = next;
      await plugin.saveSettings();
      new Notice(t("NOTICE_ACTIVE_PROFILE_SWITCHED", next));
    },
  });

  // Command to cycle to the previous color profile in the list.
  plugin.addCommand({
    id: "cycle-previous-color-profile",
    name: t("COMMAND_CYCLE_PREVIOUS"),
    callback: async () => {
      const names = Object.keys(plugin.settings.profiles || {});
      if (names.length === 0) {
        new Notice(t("NOTICE_NO_PROFILES_FOUND"));
        return;
      }
      const currentIndex = names.indexOf(plugin.settings.activeProfile);
      const previousIndex = (currentIndex - 1 + names.length) % names.length;
      const previousProfile = names[previousIndex];

      plugin.settings.activeProfile = previousProfile;
      await plugin.saveSettings();
      new Notice(t("NOTICE_ACTIVE_PROFILE_SWITCHED", previousProfile));
    },
  });

  // Command to open the plugin's settings tab directly.
  plugin.addCommand({
    id: "open-color-master-settings-tab",
    name: t("COMMAND_OPEN_SETTINGS"),
    callback: () => {
      (plugin.app as any).setting.open();
      (plugin.app as any).setting.openTabById(plugin.manifest.id);
    },
  });

  // Command to cycle through the active profile's theme (light, dark, auto).
  plugin.addCommand({
    id: "toggle-active-profile-theme",
    name: t("TOGGLE_THEME_COMMAND"),
    callback: async () => {
      const activeProfileName = plugin.settings.activeProfile;
      const activeProfile = plugin.settings.profiles[activeProfileName];

      if (!activeProfile) {
        new Notice("No active profile found.");
        return;
      }

      const currentTheme = activeProfile.themeType || "auto";
      let nextTheme: "auto" | "dark" | "light";
      let noticeMessage: string;

      if (currentTheme === "light") {
        nextTheme = "dark";
        noticeMessage = t("NOTICE_THEME_SWITCHED_DARK");
      } else if (currentTheme === "dark") {
        nextTheme = "auto";
        noticeMessage = t("NOTICE_THEME_SWITCHED_AUTO");
      } else {
        nextTheme = "light";
        noticeMessage = t("NOTICE_THEME_SWITCHED_LIGHT");
      }

      activeProfile.themeType = nextTheme;
      await plugin.saveSettings();
      new Notice(noticeMessage);
    },
  });
}
