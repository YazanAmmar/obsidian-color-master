import { Notice, App } from "obsidian";
import { t } from "../i18n/strings";
import type ColorMaster from "../main";

interface AppWithSetting extends App {
  setting: {
    open: () => void;
    openTabById: (id: string) => void;
  };
}

/**
 * Registers all commands for the Color Master plugin.
 * @param plugin - The instance of the Color Master plugin.
 */
export function registerCommands(plugin: ColorMaster) {
  // Toggle plugin on/off
  plugin.addCommand({
    id: "toggle",
    name: t("commands.enableDisable"),
    callback: async () => {
      plugin.settings.pluginEnabled = !plugin.settings.pluginEnabled;
      await plugin.saveSettings();
      new Notice(
        plugin.settings.pluginEnabled
          ? t("notices.pluginEnabled")
          : t("notices.pluginDisabled"),
      );
    },
  });

  // Select next profile
  plugin.addCommand({
    id: "profile-next",
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

  // Select previous profile
  plugin.addCommand({
    id: "profile-prev",
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

  // Open plugin settings
  plugin.addCommand({
    id: "open-settings",
    name: t("commands.openSettings"),
    callback: () => {
      const app = plugin.app as AppWithSetting;
      app.setting.open();
      app.setting.openTabById(plugin.manifest.id);
    },
  });

  // Toggle active profile theme
  plugin.addCommand({
    id: "toggle-theme",
    name: t("commands.toggleTheme"),
    callback: async () => {
      const activeProfileName = plugin.settings.activeProfile;
      const activeProfile = plugin.settings.profiles[activeProfileName];

      if (!activeProfile) {
        new Notice(t("notices.profileNotFound"));
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
