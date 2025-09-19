import { Setting, Notice } from "obsidian";
import { t } from "../../i18n";
import {
  DEFAULT_VARS,
  COLOR_DESCRIPTIONS_AR,
  COLOR_NAMES_AR,
  COLOR_DESCRIPTIONS,
  COLOR_NAMES,
  TEXT_TO_BG_MAP,
} from "../../constants";
import {
  getAccessibilityRating,
  getContrastRatio,
  flattenVars,
} from "../../utils";
import type { ColorMasterSettingTab } from "../settingsTab";
import { NoticeRulesModal, CustomVariableMetaModal } from "../modals";
import { COLOR_NAMES_FR, COLOR_DESCRIPTIONS_FR } from "../../constants";
import { COLOR_NAMES_FA, COLOR_DESCRIPTIONS_FA } from "../../constants";

export function drawColorPickers(
  containerEl: HTMLElement,
  settingTab: ColorMasterSettingTab
) {
  const plugin = settingTab.plugin;
  const activeProfileVars =
    plugin.settings.profiles[plugin.settings.activeProfile].vars;

  for (const [category, vars] of Object.entries(DEFAULT_VARS)) {
    const headingText =
      t(category.toUpperCase().replace(/ /g, "_") as any) || category;
    const categoryContainerClasses = ["cm-category-container"];

    if (category === "Graph View") {
      categoryContainerClasses.push("cm-graph-header");
    }

    const categoryContainer = containerEl.createDiv({
      cls: categoryContainerClasses.join(" "),
    });
    categoryContainer.dataset.category = category;
    categoryContainer.createEl("h3", { text: headingText });
    if (category === "Graph View") {
      const buttonContainer = categoryContainer.createDiv({
        cls: "cm-buttons-wrapper",
      });
      settingTab.graphHeaderButtonsEl = buttonContainer.createDiv({
        cls: "cm-temporary-buttons",
      });
    }

    for (const [varName, defaultValue] of Object.entries(vars)) {
      const lang = plugin.settings.language;
      const description =
        lang === "ar"
          ? COLOR_DESCRIPTIONS_AR[
              varName as keyof typeof COLOR_DESCRIPTIONS_AR
            ] || ""
          : lang === "fa"
          ? COLOR_DESCRIPTIONS_FA[
              varName as keyof typeof COLOR_DESCRIPTIONS_FA
            ] || ""
          : lang === "fr"
          ? COLOR_DESCRIPTIONS_FR[
              varName as keyof typeof COLOR_DESCRIPTIONS_FR
            ] || ""
          : COLOR_DESCRIPTIONS[varName as keyof typeof COLOR_DESCRIPTIONS] ||
            "";

      const setting = new Setting(containerEl)
        .setName(
          lang === "ar"
            ? COLOR_NAMES_AR[varName as keyof typeof COLOR_NAMES_AR] || varName
            : lang === "fa"
            ? COLOR_NAMES_FA[varName as keyof typeof COLOR_NAMES_FA] || varName
            : lang === "fr"
            ? COLOR_NAMES_FR[varName as keyof typeof COLOR_NAMES_FR] || varName
            : COLOR_NAMES[varName as keyof typeof COLOR_NAMES] || varName
        )
        .setDesc(description);

      if (category === "Notices") {
        setting.addExtraButton((button) => {
          button.setIcon("settings").onClick(() => {
            const ruleType = varName.includes("-text-") ? "text" : "background";
            new NoticeRulesModal(
              settingTab.app,
              plugin,
              settingTab,
              ruleType
            ).open();
          });
        });
      }

      setting.settingEl.classList.add("cm-var-row");
      setting.settingEl.dataset.var = varName;
      setting.settingEl.dataset.category = category;
      setting.nameEl.classList.add("cm-var-name");

      const bgVarForTextColor =
        TEXT_TO_BG_MAP[varName as keyof typeof TEXT_TO_BG_MAP];

      if (bgVarForTextColor) {
        let textColor = activeProfileVars[varName] || defaultValue;
        let bgColor =
          activeProfileVars[bgVarForTextColor] ||
          flattenVars(DEFAULT_VARS)[bgVarForTextColor];

        if (varName === "--text-highlight-bg") {
          [textColor, bgColor] = [bgColor, textColor];
        }

        const ratio = getContrastRatio(bgColor, textColor);
        const rating = getAccessibilityRating(ratio);

        const checkerEl = setting.controlEl.createDiv({
          cls: `cm-accessibility-checker ${rating.cls}`,
        });
        checkerEl.dataset.varName = varName;
        checkerEl.setText(`${rating.text} (${rating.score})`);
      }

      const colorPicker = setting.controlEl.createEl("input", {
        type: "color",
      });
      const textInput = setting.controlEl.createEl("input", {
        type: "text",
        cls: "color-master-text-input",
      });

      let initialValue;
      if (
        category === "Graph View" &&
        settingTab.graphViewWorkingState &&
        settingTab.graphViewWorkingState[varName] !== undefined
      ) {
        initialValue = settingTab.graphViewWorkingState[varName];
      } else {
        initialValue = activeProfileVars[varName] || defaultValue;
      }
      colorPicker.value = initialValue;
      textInput.value = initialValue;
      settingTab.updateColorPickerAppearance(textInput, colorPicker);

      colorPicker.addEventListener("input", (e) => {
        const newColor = (e.target as HTMLInputElement).value;
        textInput.value = newColor;
        if (plugin.settings.colorUpdateFPS > 0) {
          plugin.pendingVarUpdates[varName] = newColor;
        }
      });

      const handleFinalChange = (newColor: string) => {
        settingTab.updateColorPickerAppearance(textInput, colorPicker);

        const profile = plugin.settings.profiles[plugin.settings.activeProfile];
        const oldColor = profile.vars[varName] || defaultValue;

        if (oldColor.toLowerCase() !== newColor.toLowerCase()) {
          profile.history = profile.history || {};
          profile.history[varName] = profile.history[varName] || [];
          profile.history[varName].unshift(oldColor);
          profile.history[varName] = profile.history[varName].slice(0, 5);
        }
        if (category === "Graph View") {
          if (!settingTab.graphViewTempState) {
            settingTab.graphViewTempState = {};
            const profileVars =
              plugin.settings.profiles[plugin.settings.activeProfile].vars ||
              {};
            Object.keys(DEFAULT_VARS["Graph View"]).forEach((key) => {
              if (!settingTab.graphViewTempState) {
                settingTab.graphViewTempState = {};
              }
              settingTab.graphViewTempState[key] =
                profileVars[key] ??
                DEFAULT_VARS["Graph View"][
                  key as keyof (typeof DEFAULT_VARS)["Graph View"]
                ];
            });
          }

          if (!settingTab.graphViewWorkingState) {
            settingTab.graphViewWorkingState = {
              ...settingTab.graphViewTempState,
            };
          }

          settingTab.graphViewWorkingState[varName] = newColor;
          settingTab.showGraphActionButtons();

          plugin.pendingVarUpdates[varName] = newColor;
          if (plugin.settings.colorUpdateFPS === 0) {
            plugin.applyPendingNow();
          } else {
            plugin.startColorUpdateLoop();
          }
          return;
        }

        activeProfileVars[varName] = newColor;

        if (plugin.settings.colorUpdateFPS === 0) {
          plugin.pendingVarUpdates[varName] = newColor;
          plugin.applyPendingNow();
          plugin.saveSettings();
          return;
        }

        plugin.pendingVarUpdates[varName] = newColor;
        plugin.saveSettings();
        setTimeout(() => settingTab.app.workspace.trigger("css-change"), 50);
      };

      colorPicker.addEventListener("change", (e) => {
        handleFinalChange((e.target as HTMLInputElement).value);
      });

      textInput.addEventListener("change", (e) => {
        colorPicker.value = (e.target as HTMLInputElement).value;
        handleFinalChange((e.target as HTMLInputElement).value);
      });

      setting.addExtraButton((button) => {
        button
          .setIcon("eraser")
          .setTooltip(t("TOOLTIP_SET_TRANSPARENT"))
          .onClick(() => {
            const newColor = "transparent";
            textInput.value = newColor;
            handleFinalChange(newColor);
            settingTab.updateColorPickerAppearance(textInput, colorPicker);
          });
      });

      setting.addExtraButton((button) => {
        button
          .setIcon("reset")
          .setTooltip(t("TOOLTIP_UNDO_CHANGE"))
          .onClick(async () => {
            const profile =
              plugin.settings.profiles[plugin.settings.activeProfile];
            const history = profile.history?.[varName];

            if (history && history.length > 0) {
              const restoredColor = history.shift();

              const safeRestoredColor = restoredColor ?? defaultValue;
              activeProfileVars[varName] = safeRestoredColor;
              colorPicker.value = safeRestoredColor;
              textInput.value = safeRestoredColor;

              settingTab.updateColorPickerAppearance(textInput, colorPicker);

              await plugin.saveSettings();
              settingTab.updateAccessibilityCheckers();
              new Notice(t("NOTICE_COLOR_RESTORED", safeRestoredColor));
            } else {
              new Notice(t("NOTICE_NO_COLOR_HISTORY"));
            }
          });
      });
    }
  }

  const allDefaultVarNames = new Set(Object.keys(flattenVars(DEFAULT_VARS)));
  const customVars: Record<string, string> = {};

  for (const varName in activeProfileVars) {
    if (!allDefaultVarNames.has(varName)) {
      customVars[varName] = activeProfileVars[varName];
    }
  }

  if (Object.keys(customVars).length > 0) {
    const customVarsContainer = containerEl.createDiv();
    customVarsContainer.createEl("h3", {
      text: t("CUSTOM_VARIABLES_HEADING"),
      cls: "cm-section-heading",
    });

    const activeProfile =
      plugin.settings.profiles[plugin.settings.activeProfile];

    for (const [varName, varValue] of Object.entries(customVars)) {
      const meta = activeProfile.customVarMetadata?.[varName];
      const displayName = meta?.name || varName;
      const displayDesc = meta?.desc || t("CUSTOM_VARIABLE_DESC");

      const setting = new Setting(customVarsContainer)
        .setName(displayName)
        .setDesc(displayDesc);

      setting.settingEl.classList.add("cm-var-row");
      setting.settingEl.dataset.var = varName;
      setting.settingEl.dataset.category = "Custom";

      const colorPicker = setting.controlEl.createEl("input", {
        type: "color",
      });
      const textInput = setting.controlEl.createEl("input", {
        type: "text",
        cls: "color-master-text-input",
      });

      const handleCustomVarChange = (newColor: string) => {
        activeProfile.vars[varName] = newColor;
        plugin.saveSettings();
        settingTab.updateColorPickerAppearance(textInput, colorPicker);
      };

      colorPicker.value = varValue;
      textInput.value = varValue;
      settingTab.updateColorPickerAppearance(textInput, colorPicker);

      colorPicker.addEventListener("input", (e) => {
        textInput.value = (e.target as HTMLInputElement).value;
      });
      colorPicker.addEventListener("change", (e) => {
        handleCustomVarChange((e.target as HTMLInputElement).value);
      });
      textInput.addEventListener("change", (e) => {
        colorPicker.value = (e.target as HTMLInputElement).value;
        handleCustomVarChange((e.target as HTMLInputElement).value);
      });

      setting.addExtraButton((button) => {
        button
          .setIcon("eraser")
          .setTooltip(t("TOOLTIP_SET_TRANSPARENT"))
          .onClick(() => {
            const newColor = "transparent";
            textInput.value = newColor;
            handleCustomVarChange(newColor);
          });
      });

      setting.addExtraButton((button) => {
        button
          .setIcon("trash")
          .setTooltip(t("TOOLTIP_DELETE_CUSTOM_VARIABLE"))
          .onClick(async () => {
            delete activeProfile.vars[varName];
            document.body.style.removeProperty(varName);
            if (activeProfile.customVarMetadata?.[varName]) {
              delete activeProfile.customVarMetadata[varName];
            }
            await plugin.saveSettings();
            settingTab.display();
          });
      });
    }
  }
}
