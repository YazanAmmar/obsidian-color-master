/*
 * Color Master - Obsidian Plugin
 * Version: 1.0.8
 * Author: Yazan Ammar (GitHub : https://github.com/YazanAmmar )
 * Description: Provides a comprehensive UI to control all Obsidian CSS color variables directly,
 * removing the need for Force Mode and expanding customization options.
 */
import { flattenVars } from "./utils";
import { initializeT, t } from "./i18n";
import {
  Plugin,
  moment,
  PluginSettingTab,
  Setting,
  Notice,
  Modal,
  ButtonComponent,
  setIcon,
} from "obsidian";
import { PluginSettings } from "./types";
import {
  DEFAULT_VARS,
  DEFAULT_SETTINGS,
  TEXT_TO_BG_MAP,
  BUILT_IN_PROFILES_VARS,
  BUILT_IN_PROFILES_DATA,
  COLOR_DESCRIPTIONS,
  COLOR_DESCRIPTIONS_AR,
  COLOR_NAMES,
  COLOR_NAMES_AR,
} from "./constants";
import { ColorMasterSettingTab } from "./ui/settingsTab";

let T: ColorMaster;

export default class ColorMaster extends Plugin {
  settings: PluginSettings;
  iconizeWatcherInterval: number | null = null;
  colorUpdateInterval: number | null = null;
  pendingVarUpdates: Record<string, string> = {};
  settingTabInstance: ColorMasterSettingTab | null = null;
  liveNoticeRules: any[] | null = null;
  liveNoticeRuleType: "text" | "background" | null = null;
  iconizeObserver: MutationObserver;
  noticeObserver: MutationObserver;
  cssHistory: Record<string, { undoStack: string[]; redoStack: string[] }> = {};

  startColorUpdateLoop() {
    this.stopColorUpdateLoop();

    const fps = this.settings.colorUpdateFPS;
    if (!this.settings.pluginEnabled || !fps || fps <= 0) {
      return; // Stop if disabled or FPS is 0
    }

    const intervalMs = 1000 / fps;
    this.colorUpdateInterval = window.setInterval(() => {
      const pendingKeys = Object.keys(this.pendingVarUpdates);
      if (pendingKeys.length === 0) return; // Do nothing if the box is empty

      for (const varName of pendingKeys) {
        document.body.style.setProperty(
          varName,
          this.pendingVarUpdates[varName]
        );
      }

      this.pendingVarUpdates = {}; // Empty the box after applying

      // Trigger updates for Graph View and accessibility checkers
      this.app.workspace.trigger("css-change");

      if (this.settingTabInstance) {
        this.settingTabInstance?.updateAccessibilityCheckers();
      }
      // ensure iconize icons update live using current computed var
      try {
        this.forceIconizeColors();
      } catch (e) {
        console.warn("forceIconizeColors failed in update loop", e);
      }
    }, intervalMs);
  }

  // New method to stop the update loop
  stopColorUpdateLoop() {
    if (this.colorUpdateInterval) {
      window.clearInterval(this.colorUpdateInterval);
      this.colorUpdateInterval = null;
    }
  }

  // New method to easily restart the loop when settings change
  restartColorUpdateLoop() {
    this.stopColorUpdateLoop();
    this.startColorUpdateLoop();
  }

  applyCustomCssForProfile(profileName: string) {
    try {
      if (!profileName) profileName = this.settings.activeProfile;
      const profile = this.settings.profiles?.[profileName];
      this.removeInjectedCustomCss();

      if (!profile || !profile.isCssProfile || !profile.customCss) {
        return;
      }

      const el = document.createElement("style");
      el.id = `cm-custom-css-for-profile`;
      el.textContent = profile.customCss;
      document.head.appendChild(el);
    } catch (e) {
      console.warn("applyCustomCssForProfile failed", e);
    }
  }

  removeInjectedCustomCss() {
    try {
      const oldStyle = document.getElementById("cm-custom-css-for-profile");
      if (oldStyle) oldStyle.remove();
    } catch (e) {
      console.warn(e);
    }
  }

  applyCssSnippets() {
    this.removeCssSnippets();
    const activeProfile = this.settings.profiles[this.settings.activeProfile];
    if (!activeProfile) return;

    const globalSnippets = this.settings.globalSnippets || [];
    const profileSnippets = Array.isArray(activeProfile.snippets)
      ? activeProfile.snippets
      : [];

    const allSnippets = [...globalSnippets, ...profileSnippets].filter(Boolean);

    const enabledCss = allSnippets
      .filter((s) => s.enabled && s.css)
      .map(
        (s) =>
          `/* Snippet: ${s.name} ${s.isGlobal ? "(Global)" : ""} */\n${s.css}`
      )
      .join("\n\n");

    if (enabledCss) {
      const el = document.createElement("style");
      el.id = "cm-css-snippets";
      el.textContent = enabledCss;
      document.head.appendChild(el);
    }
  }

  removeCssSnippets() {
    const el = document.getElementById("cm-css-snippets");
    if (el) el.remove();
  }

  // New method to apply pending changes instantly
  applyPendingNow() {
    try {
      const pending = this.pendingVarUpdates || {};
      const keys = Object.keys(pending);
      if (keys.length === 0) {
        // If nothing is pending, still trigger a repaint for safety
        this.app.workspace.trigger("css-change");
        window.dispatchEvent(new Event("resize"));
        return;
      }

      // Apply all pending CSS properties
      for (const k of keys) {
        document.body.style.setProperty(k, pending[k]);
      }

      // Clear pending updates
      this.pendingVarUpdates = {};

      // Notify Obsidian and other components to update
      this.app.workspace.trigger("css-change");
      this.forceIconizeColors();

      // Force graph view to repaint by dispatching a resize event
      window.dispatchEvent(new Event("resize"));
    } catch (e) {
      console.error("Color Master: applyPendingNow failed", e);
    }
  }

  pinProfileSnapshot(profileName: string) {
    if (!profileName) profileName = this.settings.activeProfile;
    this.settings.pinnedSnapshots = this.settings.pinnedSnapshots || {};
    const profile = this.settings.profiles?.[profileName];
    if (!profile) {
      new Notice(t("NOTICE_PROFILE_NOT_FOUND"));
      return;
    }

    const snapshotData = {
      vars: JSON.parse(JSON.stringify(profile.vars || {})),
      customCss: profile.customCss || "",
      snippets: JSON.parse(JSON.stringify(profile.snippets || {})),
      noticeRules: JSON.parse(
        JSON.stringify(profile.noticeRules || { text: [], background: [] })
      ),
    };

    this.settings.pinnedSnapshots[profileName] = {
      pinnedAt: new Date().toISOString(),
      ...snapshotData,
    };
    return this.saveSettings();
  }

  async resetProfileToPinned(profileName: string): Promise<void> {
    if (!profileName) profileName = this.settings.activeProfile;
    const snap = this.settings.pinnedSnapshots?.[profileName];
    if (!snap || !snap.vars) {
      new Notice(t("NOTICE_NO_PINNED_SNAPSHOT"));
      return;
    }

    const activeProfile = this.settings.profiles[profileName];
    if (!activeProfile) {
      new Notice(t("NOTICE_PROFILE_NOT_FOUND"));
      return;
    }

    activeProfile.vars = JSON.parse(JSON.stringify(snap.vars));
    activeProfile.customCss = snap.customCss || "";
    activeProfile.snippets = snap.snippets
      ? JSON.parse(JSON.stringify(snap.snippets))
      : {};
    activeProfile.noticeRules = snap.noticeRules
      ? JSON.parse(JSON.stringify(snap.noticeRules))
      : { text: [], background: [] };

    Object.keys(snap.vars).forEach((k) => {
      this.pendingVarUpdates[k] = snap.vars[k];
    });

    await this.saveSettings();
    this.applyPendingNow();
  }

  resetIconizeWatcher() {
    if (this.iconizeWatcherInterval) {
      window.clearInterval(this.iconizeWatcherInterval);
    }

    const intervalMilliseconds = this.settings.cleanupInterval * 1000;

    this.iconizeWatcherInterval = window.setInterval(() => {
      const iconizeIDs = ["obsidian-icon-folder", "iconize"];
      const isIconizeInstalled = iconizeIDs.some(
        (id) => (this.app as any).plugins.plugins[id]
      );

      if (!isIconizeInstalled) {
        this.removeOrphanedIconizeElements();
      }
    }, intervalMilliseconds);

    this.registerInterval(this.iconizeWatcherInterval);
  }

  async onload() {
    initializeT(this);
    T = this;
    await this.loadSettings();
    this.liveNoticeRules = null;
    this.liveNoticeRuleType = null;
    if (this.settings.language === "auto") {
      const obsidianLang = moment.locale();
      if (obsidianLang === "ar") {
        this.settings.language = "ar"; // If it is Arabic, we will designate it as Arabic.
      } else {
        this.settings.language = "en"; // For any other language, we set it to English.
      }
      await this.saveSettings();
    }

    T = this;
    this.addCommand({
      id: "toggle-color-master",
      name: "Toggle Color Master",
      callback: async () => {
        this.settings.pluginEnabled = !this.settings.pluginEnabled;
        await this.saveSettings();
        new Notice(
          this.settings.pluginEnabled
            ? t("PLUGIN_ENABLED_NOTICE")
            : t("PLUGIN_DISABLED_NOTICE")
        );
      },
    });

    this.addCommand({
      id: "cycle-next-color-profile",
      name: "Color Master: Cycle to next profile",
      callback: async () => {
        const names = Object.keys(this.settings.profiles || {});
        if (names.length === 0) {
          new Notice(t("NOTICE_NO_PROFILES_FOUND"));
          return;
        }
        const idx = names.indexOf(this.settings.activeProfile);
        const next = names[(idx + 1) % names.length];
        this.settings.activeProfile = next;
        await this.saveSettings();
        new Notice(t("NOTICE_ACTIVE_PROFILE_SWITCHED", next));
      },
    });

    this.addCommand({
      id: "cycle-previous-color-profile",
      name: "Color Master: Cycle to previous profile",
      callback: () => {
        (async () => {
          const names = Object.keys(this.settings.profiles || {});
          if (names.length === 0) {
            new Notice(t("NOTICE_NO_PROFILES_FOUND"));
            return;
          }
          const currentIndex = names.indexOf(this.settings.activeProfile);
          // This formula calculates the previous index, wrapping around from 0 to the end
          const previousIndex =
            (currentIndex - 1 + names.length) % names.length;
          const previousProfile = names[previousIndex];

          this.settings.activeProfile = previousProfile;
          await this.saveSettings();
          new Notice(t("NOTICE_ACTIVE_PROFILE_SWITCHED", previousProfile));
        })();
      },
    });

    this.addCommand({
      id: "open-color-master-settings-tab",
      name: "Color Master: Open settings tab",
      callback: () => {
        (this.app as any).setting.open();
        (this.app as any).setting.openTabById(this.manifest.id);
      },
    });

    // Add a ribbon icon to the left gutter
    this.addRibbonIcon(
      "paint-bucket",
      "Color Master Settings",
      (evt: MouseEvent) => {
        // Open the settings tab when the icon is clicked
        (this.app as any).setting.open();
        (this.app as any).setting.openTabById(this.manifest.id);
      }
    );

    // Store a reference to the settings tab and add it
    this.settingTabInstance = new ColorMasterSettingTab(this.app, this);
    this.addSettingTab(this.settingTabInstance);

    this.app.workspace.onLayoutReady(() => {
      this.applyStyles();
      setTimeout(() => this.app.workspace.trigger("css-change"), 100);

      // Start the update engine
      this.startColorUpdateLoop();
      this.iconizeObserver = new MutationObserver(() => {
        if (
          this.settings.pluginEnabled &&
          this.settings.overrideIconizeColors
        ) {
          this.forceIconizeColors();
        }
      });

      this.noticeObserver = new MutationObserver((mutations) => {
        if (!this.settings.pluginEnabled) return;
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType !== 1) return;

            if ((node as Element).matches(".notice, .toast")) {
              this.processNotice(node as HTMLElement);
            }
            (node as Element)
              .querySelectorAll(".notice, .toast")
              .forEach(this.processNotice.bind(this));
          });
        });
      });

      if (this.settings.pluginEnabled) {
        this.enableObservers();
      }

      this.register(() => this.disableObservers());
    });
    this.resetIconizeWatcher();
  }

  onunload() {
    if (this.noticeObserver) this.noticeObserver.disconnect();
    if (this.iconizeObserver) this.iconizeObserver.disconnect();
    this.clearStyles();
    this.removeInjectedCustomCss();
    this.stopColorUpdateLoop();
    console.log("Color Master v1.0.8 unloaded.");
  }

  public enableObservers(): void {
    try {
      this.iconizeObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
      this.noticeObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
      console.log("Color Master Observers: Enabled");
    } catch (e) {
      console.error("Color Master: Failed to enable observers", e);
    }
  }

  public disableObservers(): void {
    try {
      this.iconizeObserver.disconnect();
      this.noticeObserver.disconnect();
      console.log("Color Master Observers: Disabled");
    } catch (e) {
      console.error("Color Master: Failed to disable observers", e);
    }
  }

  async refreshOpenGraphViews() {
    const graphLeaves = this.app.workspace.getLeavesOfType("graph");
    if (graphLeaves.length === 0) {
      return;
    }

    console.log(
      `Color Master: Found ${graphLeaves.length} graph(s). Applying Plan C (programmatic rebuild).`
    );

    for (const leaf of graphLeaves) {
      const currentState = leaf.getViewState();

      await leaf.setViewState({
        ...currentState,
        type: "graph",
        state: { ...currentState.state },
      });
    }
  }

  forceIconizeColors() {
    // read the *computed* CSS var first (this covers live-preview via pendingVarUpdates)
    let computedIconizeColor = null;
    try {
      const cssVal = getComputedStyle(document.body).getPropertyValue(
        "--iconize-icon-color"
      );
      if (cssVal) computedIconizeColor = cssVal.trim();
    } catch (e) {
      console.warn(
        "Color Master: failed to read computed --iconize-icon-color",
        e
      );
      computedIconizeColor = null;
    }

    // fallback to stored profile value if computed is empty
    const storedIconizeColor =
      this.settings.profiles?.[this.settings.activeProfile]?.vars?.[
        "--iconize-icon-color"
      ];

    const iconizeColor = this.settings.overrideIconizeColors
      ? computedIconizeColor || storedIconizeColor || null
      : null;

    // Iterate over elements that Iconize marks (keep the original safe logic)
    document.querySelectorAll(".iconize-icon").forEach((iconNode) => {
      const svg = iconNode.querySelector("svg");
      if (!svg) return;

      [svg, ...svg.querySelectorAll("*")].forEach((el: any) => {
        if (typeof el.hasAttribute !== "function") return;

        if (!iconizeColor) {
          // remove inline overrides to let theme/defaults show
          el.style.fill = "";
          el.style.stroke = "";
          return;
        }

        const originalFill = el.getAttribute("fill");
        const originalStroke = el.getAttribute("stroke");

        // apply with !important so plugin/theme inline styles are overridden
        if (
          originalFill &&
          originalFill !== "none" &&
          !originalFill.startsWith("url(")
        ) {
          try {
            el.style.setProperty("fill", iconizeColor, "important");
          } catch (e) {
            el.style.fill = iconizeColor;
          }
        }

        if (originalStroke && originalStroke !== "none") {
          try {
            el.style.setProperty("stroke", iconizeColor, "important");
          } catch (e) {
            el.style.stroke = iconizeColor;
          }
        }
      });
    });
  }

  removeOrphanedIconizeElements() {
    const iconizeIDs = ["obsidian-icon-folder", "iconize"];
    const isIconizeInstalled = iconizeIDs.some(
      (id) => (this.app as any).plugins.plugins[id]
    );

    // We only proceed if Iconize is actually installed. If so, we do nothing.
    if (isIconizeInstalled) {
      return;
    }
    // Find all elements with the .iconize-icon class and check if they have content.
    const orphanedIcons = document.querySelectorAll(".iconize-icon");

    // If we found any potential orphans, we log it for debugging.
    if (orphanedIcons.length > 0) {
      console.log(
        `Color Master: Found ${orphanedIcons.length} orphaned Iconize elements. Cleaning up...`
      );
      orphanedIcons.forEach((icon) => icon.remove());
    }
  }

  applyStyles() {
    this.removeOrphanedIconizeElements();
    this.clearStyles();
    if (!this.settings.pluginEnabled) {
      this.removeInjectedCustomCss();
      return;
    }

    const profile = this.settings.profiles[this.settings.activeProfile];
    if (!profile) {
      console.error("Color Master: Active profile not found!");
      return;
    }

    for (const [key, value] of Object.entries(profile.vars)) {
      document.body.style.setProperty(key, value);
    }

    this.forceIconizeColors();
    setTimeout(() => this.forceIconizeColors(), 100);

    const themeType = profile.themeType || "auto";

    if (themeType === "dark") {
      document.body.classList.remove("theme-light");
      document.body.classList.add("theme-dark");
    } else if (themeType === "light") {
      document.body.classList.remove("theme-dark");
      document.body.classList.add("theme-light");
    }
    this.applyCustomCssForProfile(this.settings.activeProfile);
    this.applyCssSnippets();
    // Add/Remove body class for RTL notices
    if (this.settings.language === "ar" || this.settings.language === "fa") {
      document.body.classList.add("color-master-rtl");
    } else {
      document.body.classList.remove("color-master-rtl");
    }
  }

  clearStyles() {
    this.removeCssSnippets();
    const allVars = new Set();

    Object.keys(flattenVars(DEFAULT_VARS)).forEach((key) => allVars.add(key));

    for (const profileName in this.settings.profiles) {
      const profile = this.settings.profiles[profileName];
      if (profile && profile.vars) {
        Object.keys(profile.vars).forEach((key) => allVars.add(key));
      }
    }

    allVars.forEach((key: string) => {
      document.body.style.removeProperty(key);
    });

    document.querySelectorAll(".iconize-icon").forEach((iconNode) => {
      const svg = iconNode.querySelector("svg");
      if (!svg) return;

      [svg, ...svg.querySelectorAll("*")].forEach((el: any) => {
        if (typeof el.hasAttribute !== "function") return;

        el.style.removeProperty("fill");
        el.style.removeProperty("stroke");
      });
    });

    const styleId = "color-master-overrides";
    const overrideStyleEl = document.getElementById(styleId);
    if (overrideStyleEl) {
      overrideStyleEl.remove();
    }
    this.app.workspace.trigger("css-change");
    document.body.classList.remove("color-master-rtl");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

    let migrationNeeded = false;
    if (
      this.settings.noticeRules &&
      Object.keys(this.settings.profiles || {}).length > 0
    ) {
      console.log(
        "Color Master: Detected old global notice rules. Starting migration..."
      );
      for (const profileName in this.settings.profiles) {
        const profile = this.settings.profiles[profileName];
        if (!profile.noticeRules) {
          profile.noticeRules = JSON.parse(
            JSON.stringify(this.settings.noticeRules)
          );
        }
      }
      delete (this.settings as any).noticeRules;
      migrationNeeded = true;
    }

    for (const profileName in this.settings.profiles) {
      const profile = this.settings.profiles[profileName];
      if (!profile.noticeRules) {
        profile.noticeRules = { text: [], background: [] };
        migrationNeeded = true;
      }
    }

    if (migrationNeeded) {
      console.log(
        "Color Master: Notice rules migration complete. Saving new settings structure."
      );
      await this.saveData(this.settings);
    }

    // --- End of migration logic ---
    if (!this.settings.installDate) {
      this.settings.installDate = new Date().toISOString();
      await this.saveData(this.settings);
    }
    if (!this.settings.pinnedSnapshots) {
      this.settings.pinnedSnapshots = {};
    }

    // Seed pinned snapshots for up to the first 5 profiles if they don't have one
    try {
      const profileNames = Object.keys(this.settings.profiles || {});
      let changed = false;
      for (let i = 0; i < Math.min(5, profileNames.length); i++) {
        const name = profileNames[i];
        if (!this.settings.pinnedSnapshots[name]) {
          const vars = this.settings.profiles[name]?.vars || {};
          this.settings.pinnedSnapshots[name] = {
            pinnedAt: new Date().toISOString(),
            vars: JSON.parse(JSON.stringify(vars)),
          };
          changed = true;
        }
      }
      if (changed) {
        console.log("Color Master: Seeding initial pinned snapshots.");
        await this.saveData(this.settings);
      }
      let snippetsMigrationNeeded = false;
      for (const profileName in this.settings.profiles) {
        const profile = this.settings.profiles[profileName];
        if (
          profile &&
          profile.snippets &&
          !Array.isArray(profile.snippets) &&
          typeof profile.snippets === "object"
        ) {
          snippetsMigrationNeeded = true;
          const snippetsArray = Object.entries(profile.snippets).map(
            ([name, data]: [string, any]) => ({
              id: `snippet-${Date.now()}-${Math.random()}`,
              name: name,
              css: data.css || "",
              enabled: data.enabled !== false,
            })
          );
          profile.snippets = snippetsArray;
        }
      }

      if (snippetsMigrationNeeded) {
        console.log(
          "Color Master: The clipping data structure is being migrated to the new format (array)."
        );
        await this.saveData(this.settings);
      }
    } catch (e) {
      console.warn("Color Master: failed to seed pinnedSnapshots", e);
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.applyStyles();
    await this.refreshOpenGraphViews();
    this.app.workspace.trigger("css-change");
  }

  processNotice(el: HTMLElement) {
    let noticeText = (el.textContent || "").toLowerCase();
    const testKeywordEl = el.querySelector(".cm-test-keyword") as HTMLElement;

    if (testKeywordEl) {
      noticeText = (testKeywordEl.textContent || "").toLowerCase();
    }
    if (!el || !el.classList || el.dataset.cmProcessed === "true") return;

    el.dataset.cmProcessed = "true";

    try {
      const settings = this.settings;
      const activeProfile = settings.profiles[settings.activeProfile];

      if (!activeProfile) return;

      const liveRules = this.liveNoticeRules;
      const liveRuleType = this.liveNoticeRuleType;

      const bgRules =
        liveRuleType === "background" && liveRules
          ? liveRules
          : activeProfile?.noticeRules?.background || [];

      const textRules =
        liveRuleType === "text" && liveRules
          ? liveRules
          : activeProfile?.noticeRules?.text || [];

      let finalBgColor = activeProfile.vars["--cm-notice-bg-default"];
      let finalTextColor = activeProfile.vars["--cm-notice-text-default"];

      for (const rule of bgRules) {
        if (!rule.keywords || !rule.keywords.trim()) continue;
        const keywords = (rule.keywords || "").toLowerCase();
        let match = false;

        if (rule.isRegex) {
          try {
            const regex = new RegExp(keywords, "i");
            if (regex.test(noticeText)) match = true;
          } catch (e) {}
        } else {
          const keywordArray = keywords
            .split(",")
            .map((k: string) => k.trim())
            .filter(Boolean);
          for (const keyword of keywordArray) {
            if (noticeText.includes(keyword)) {
              match = true;
              break;
            }
          }
        }
        if (match) {
          finalBgColor = rule.color;
          break;
        }
      }

      for (const rule of textRules) {
        if (!rule.keywords || !rule.keywords.trim()) continue;
        const keywords = (rule.keywords || "").toLowerCase();
        let match = false;

        if (rule.isRegex) {
          try {
            const regex = new RegExp(keywords, "i");
            if (regex.test(noticeText)) match = true;
          } catch (e) {}
        } else {
          const keywordArray = keywords
            .split(",")
            .map((k: string) => k.trim())
            .filter(Boolean);
          for (const keyword of keywordArray) {
            if (noticeText.includes(keyword)) {
              match = true;
              break;
            }
          }
        }

        if (match) {
          finalTextColor = rule.color;
          break;
        }
      }
      el.style.setProperty("background-color", finalBgColor, "important");
      el.style.setProperty("color", finalTextColor, "important");
    } catch (e) {
      console.warn("Color Master: processNotice failed", e);
    }
  }

  /**
   * Pushes a new state to the history for a given CSS snippet/profile.
   * @param id - A unique identifier for the snippet or profile.
   * @param content - The new CSS content to save.
   */
  pushCssHistory(id: string, content: string) {
    if (!this.cssHistory[id]) {
      this.cssHistory[id] = { undoStack: [], redoStack: [] };
    }
    const history = this.cssHistory[id];
    const lastState = history.undoStack[history.undoStack.length - 1];

    // Only add to history if the content has actually changed
    if (lastState !== content) {
      history.undoStack.push(content);
      // When a new action is taken, the redo stack must be cleared
      history.redoStack = [];
    }
  }

  /**
   * Undoes the last change for a given ID and returns the previous state.
   * @param id - The unique identifier.
   * @returns The previous content, or null if no history.
   */
  undoCssHistory(id: string): string | null {
    const history = this.cssHistory[id];
    if (history && history.undoStack.length > 1) {
      const currentState = history.undoStack.pop()!;
      history.redoStack.push(currentState);
      return history.undoStack[history.undoStack.length - 1];
    }
    return null; // Can't undo the initial state
  }

  /**
   * Redoes the last undone change for a given ID.
   * @param id - The unique identifier.
   * @returns The next content, or null if no redo history.
   */
  redoCssHistory(id: string): string | null {
    const history = this.cssHistory[id];
    if (history && history.redoStack.length > 0) {
      const nextState = history.redoStack.pop()!;
      history.undoStack.push(nextState);
      return nextState;
    }
    return null;
  }
}
