import { Notice, Setting } from "obsidian";
import { DEFAULT_VARS, TEXT_TO_BG_MAP } from "../../constants";
import { t } from "../../i18n/strings";
import {
  flattenVars,
  getAccessibilityRating,
  getContrastRatio,
  isIconizeEnabled,
} from "../../utils";
import { IconizeSettingsModal, NoticeRulesModal } from "../modals";
import type { ColorMasterSettingTab } from "../settingsTab";

export function drawColorPickers(
  containerEl: HTMLElement,
  settingTab: ColorMasterSettingTab
) {
  const plugin = settingTab.plugin;
  const activeProfileVars =
    plugin.settings.profiles[plugin.settings.activeProfile].vars;

  for (const [category, vars] of Object.entries(DEFAULT_VARS)) {
    // Map specific category names to their short keys defined in i18n.ts
    let categoryKey: string;
    const lowerCategory = category.toLowerCase();

    if (lowerCategory === "interactive elements") {
      categoryKey = "interactive";
    } else if (lowerCategory === "ui elements") {
      categoryKey = "ui";
    } else if (lowerCategory === "graph view") {
      categoryKey = "graph";
    } else if (lowerCategory === "plugin integrations") {
      // Handle this explicitly too for safety
      categoryKey = "pluginintegrations";
    } else {
      // Default: remove spaces for other potential categories
      categoryKey = lowerCategory.replace(/ /g, "");
    }

    const headingText = t(`categories.${categoryKey}`) || category; // Use the derived categoryKey
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
      const description = t(`colors.descriptions.${varName}`) || "";

      const setting = new Setting(containerEl)
        .setName(t(`colors.names.${varName}`) || varName)
        .setDesc(description);

      if (
        categoryKey === "pluginintegrations" &&
        varName === "--iconize-icon-color"
      ) {
        if (!isIconizeEnabled(plugin.app)) {
          const badgeEl = setting.nameEl.createSpan({
            text: t("options.badgeNotInstalled"),
            cls: "cm-not-installed-badge",
          });
          badgeEl.setAttr("aria-label", t("tooltips.iconizeNotInstalled"));
        }
      }

      if (varName === "--iconize-icon-color") {
        setting.addExtraButton((button) => {
          button
            .setIcon("settings")
            .setTooltip(t("tooltips.iconizeSettings"))
            .onClick(() => {
              new IconizeSettingsModal(settingTab.app, plugin).open();
            });
        });
      }

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
          .setTooltip(t("tooltips.setTransparent"))
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
          .setTooltip(t("tooltips.undoChange"))
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
              new Notice(t("notices.colorRestored", safeRestoredColor));
            } else {
              new Notice(t("notices.noColorHistory"));
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
      text: t("categories.custom"),
      cls: "cm-section-heading",
    });

    const activeProfile =
      plugin.settings.profiles[plugin.settings.activeProfile];

    for (const [varName, varValue] of Object.entries(customVars)) {
      // Get metadata, falling back to defaults if not set
      const meta = activeProfile.customVarMetadata?.[varName];
      const varType = meta?.type || "color"; // Default to 'color' for safety
      const displayName = meta?.name || varName;
      const displayDesc = meta?.desc || t("categories.customDesc");

      const setting = new Setting(customVarsContainer)
        .setName(displayName)
        .setDesc(displayDesc);

      setting.settingEl.classList.add("cm-var-row");
      setting.settingEl.dataset.var = varName;
      setting.settingEl.dataset.category = "Custom";
      setting.nameEl.classList.add("cm-var-name");

      const handleCustomVarChange = (newValue: string) => {
        activeProfile.vars[varName] = newValue;

        if (plugin.settings.colorUpdateFPS > 0) {
          plugin.pendingVarUpdates[varName] = newValue;
        } else {
          document.body.style.setProperty(varName, newValue);
          plugin.saveSettings();
        }

        if (plugin.settings.colorUpdateFPS > 0) {
          plugin.saveSettings();
        }
      };

      switch (varType) {
        case "color":
          const colorPicker = setting.controlEl.createEl("input", {
            type: "color",
          });
          const textInput = setting.controlEl.createEl("input", {
            type: "text",
            cls: "color-master-text-input",
          });

          colorPicker.value = varValue;
          textInput.value = varValue;
          settingTab.updateColorPickerAppearance(textInput, colorPicker);

          colorPicker.addEventListener("input", (e) => {
            const newColor = (e.target as HTMLInputElement).value;
            textInput.value = newColor;
            if (plugin.settings.colorUpdateFPS > 0) {
              plugin.pendingVarUpdates[varName] = newColor;
            }
          });
          colorPicker.addEventListener("change", (e) => {
            handleCustomVarChange((e.target as HTMLInputElement).value);
            settingTab.updateColorPickerAppearance(textInput, colorPicker);
          });
          textInput.addEventListener("change", (e) => {
            const newColor = (e.target as HTMLInputElement).value;
            try {
              colorPicker.value = newColor;
            } catch (err) {
            }
            handleCustomVarChange(newColor);
            settingTab.updateColorPickerAppearance(textInput, colorPicker);
          });

          setting.addExtraButton((button) => {
            button
              .setIcon("eraser")
              .setTooltip(t("tooltips.setTransparent"))
              .onClick(() => {
                const newColor = "transparent";
                textInput.value = newColor;
                handleCustomVarChange(newColor);
                settingTab.updateColorPickerAppearance(textInput, colorPicker);
              });
          });
          break;

        case "size":
          const sizeMatch = varValue.match(
            /(-?\d*\.?\d+)\s*(px|em|rem|%|vw|vh|auto)?/
          );
          let numValue = sizeMatch?.[1] || "10";
          let unitValue = sizeMatch?.[2] || "px";

          const sizeInput = setting.controlEl.createEl("input", {
            type: "number",
            cls: "color-master-text-input",
          });
          sizeInput.value = numValue;
          sizeInput.style.width = "80px";

          const unitDropdown = setting.controlEl.createEl("select", {
            cls: "dropdown cm-search-small",
          });
          const units = ["px", "em", "rem", "%", "vw", "vh", "auto"];
          if (!units.includes(unitValue)) unitValue = "px";

          units.forEach((unit) => {
            unitDropdown.createEl("option", { text: unit, value: unit });
          });
          unitDropdown.value = unitValue;

          const updateSize = () => {
            const newNum = sizeInput.value || "0";
            const newUnit = unitDropdown.value;
            const newValue =
              newUnit === "auto" ? "auto" : `${newNum}${newUnit}`;
            sizeInput.disabled = newUnit === "auto";

            handleCustomVarChange(newValue);
          };

          sizeInput.addEventListener("change", updateSize);
          unitDropdown.addEventListener("change", updateSize);

          // Run the function the first time to disable the field if the value is 'auto'
          sizeInput.disabled = unitValue === "auto";
          break;

        case "text":
          setting.controlEl.classList.add("cm-full-width-control");
          const textInputArea = setting.controlEl.createEl("input", {
            type: "text",
            cls: "cm-wide-text-input",
          });
          textInputArea.value = varValue;
          textInputArea.placeholder = "Enter text value...";

          textInputArea.addEventListener("change", (e) => {
            handleCustomVarChange((e.target as HTMLInputElement).value);
          });
          break;

        case "number":
          const numInput = setting.controlEl.createEl("input", {
            type: "number",
            cls: "color-master-text-input",
          });
          numInput.value = varValue;
          numInput.style.width = "100px";

          numInput.addEventListener("change", (e) => {
            handleCustomVarChange((e.target as HTMLInputElement).value);
          });
          break;

        default:
          setting.controlEl.classList.add("cm-full-width-control");
          const defaultInput = setting.controlEl.createEl("input", {
            type: "text",
            cls: "cm-wide-text-input",
          });
          defaultInput.value = varValue;
          defaultInput.addEventListener("change", (e) => {
            handleCustomVarChange((e.target as HTMLInputElement).value);
          });
      }

      setting.addExtraButton((button) => {
        button
          .setIcon("trash")
          .setTooltip(t("tooltips.deleteCustomVar"))
          .onClick(async () => {
            delete activeProfile.vars[varName];
            // Remove the property from the DOM
            document.body.style.removeProperty(varName);

            if (activeProfile.customVarMetadata?.[varName]) {
              delete activeProfile.customVarMetadata[varName];
            }
            await plugin.saveSettings();

            // Force redraw of settings tab
            settingTab.display();
          });
      });
    }
  }
}
