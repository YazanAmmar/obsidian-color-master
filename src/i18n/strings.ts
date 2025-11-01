import type ColorMaster from "../main";
import type { LocaleCode } from "./types";
import { DEFAULT_LOCALE } from "./types";

let T: ColorMaster;
let FLATTENED_STRINGS: Record<string, string | Function | any[]> = {};

interface LocaleStrings {
  plugin: {
    name: string;
    ribbonTooltip: string;
  };

  // Common buttons used everywhere
  buttons: {
    new: string;
    delete: string;
    create: string;
    reset: string;
    restore: string;
    update: string;
    apply: string;
    cancel: string;
    reload: string;
    exportFile: string;
    copyJson: string;
    importCss: string;
    importJson: string;
    chooseFile: string;
    import: string;
    select: string;
    browse: string;
    deleteAnyway: string;
  };

  // Strings for the main settings tab (settingsTab.ts)
  settings: {
    enablePlugin: string;
    enablePluginDesc: string;
    language: string;
    languageDesc: string;
    languageSettingsModalTitle: string;
    rtlLayoutName: string;
    rtlLayoutDesc: string;
    searchPlaceholder: string;
    regexPlaceholder: string;
    searchResultsFound: (count: number) => string;
    allSections: string;
    clear: string;
    ariaCase: string;
    ariaRegex: string;
    themeWarningTooltip: (theme: string) => string;
  };

  // Strings for profile-manager.ts
  profileManager: {
    heading: string;
    activeProfile: string;
    activeProfileDesc: string;
    themeType: string;
    themeTypeDesc: string;
    themeAuto: string;
    themeDark: string;
    themeLight: string;
    tooltipThemeAuto: string;
    tooltipThemeDark: string;
    tooltipThemeLight: string;
    tooltipExport: string;
    tooltipCopyJson: string;
  };

  // Strings for options-section.ts
  options: {
    heading: string;
    liveUpdateName: string;
    liveUpdateDesc: string;
    iconizeModalTitle: string;
    overrideIconizeName: string;
    overrideIconizeDesc: string;
    cleanupIntervalName: string;
    cleanupIntervalDesc: string;
    addCustomVarName: string;
    addCustomVarDesc: string;
    addNewVarButton: string;
    resetPluginName: string;
    resetPluginDesc: string;
    resetPluginButton: string;
    backgroundName: string;
    backgroundDesc: string;
    videoOpacityName: string;
    videoOpacityDesc: string;
    videoMuteName: string;
    videoMuteDesc: string;
    settingType: string;
    settingTypeImage: string;
    settingTypeVideo: string;
    backgroundModalSettingsTitle: string;
    backgroundEnableName: string;
    backgroundEnableDesc: string;
    convertImagesName: string;
    convertImagesDesc: string;
    jpgQualityName: string;
    jpgQualityDesc: string;
    badgeNotInstalled: string;
  };

  // Strings for snippets-ui.ts
  snippets: {
    heading: string;
    createButton: string;
    noSnippetsDesc: string;
    globalName: string;
    globalDesc: string;
  };

  // Strings for color-pickers.ts
  categories: {
    pluginintegrations: string;
    backgrounds: string;
    text: string;
    interactive: string;
    ui: string;
    misc: string;
    graph: string;
    markdown: string;
    notices: string;
    custom: string;
    customDesc: string;
    helpTextPre: string;
    helpTextLink: string;
  };

  // Strings for all modals in modals.ts
  modals: {
    newProfile: {
      title: string;
      nameLabel: string;
      namePlaceholder: string;
    };
    deleteProfile: {
      title: string;
      confirmation: (name: string) => string;
    };
    restoreProfile: {
      title: (name: string) => string;
      desc: (name: string) => string;
    };
    jsonImport: {
      title: string;
      desc1: string;
      placeholder: string;
      settingName: string;
      settingDesc: string;
      replaceActiveButton: string;
      createNewButton: string;
    };
    cssImport: {
      title: string;
      titleEdit: string;
      note: string;
      importFromFile: string;
      importFromFileDesc: string;
      importFromTheme: string;
      importFromThemeDesc: string;
      noThemes: string;
    };
    snippetEditor: {
      title: string;
      titleEdit: string;
      nameLabel: string;
      namePlaceholder: string;
      importFromSnippet: string;
      importFromSnippetDesc: string;
      noSnippets: string;
      cssPlaceholder: string;
    };
    confirmation: {
      resetProfileTitle: string;
      resetProfileDesc: string;
      deleteSnippetTitle: (name: string) => string;
      deleteSnippetDesc: string;
      resetPluginTitle: string;
      resetPluginDesc: string;
      deleteGlobalBgTitle: string;
      deleteGlobalBgDesc: string;
      deleteBackgroundTitle: string;
      deleteBackgroundDesc: (name: string) => string;
    };
    noticeRules: {
      titleText: string;
      titleBg: string;
      desc: string;
      addNewRule: string;
      keywordPlaceholder: string;
      useRegex: string;
    };
    duplicateProfile: {
      title: string;
      descParts: [string, string];
      placeholder: string;
    };
    customVar: {
      title: string;
      desc: string;
      displayName: string;
      displayNameDesc: string;
      displayNamePlaceholder: string;
      varName: string;
      varNameDesc: string;
      varNamePlaceholder: string;
      varType: string;
      varTypeDesc: string;
      types: {
        color: string;
        size: string;
        text: string;
        number: string;
      };
      varValue: string;
      varValueDesc: string;
      varValuePlaceholder: string;
      description: string;
      descriptionDesc: string;
      descriptionPlaceholder: string;
      addVarButton: string;
      textValuePlaceholder: string;
    };
    addBackground: {
      title: string;
      importFromFile: string;
      importFromFileDesc: string;
      pasteBoxPlaceholder: string;
      dropToAdd: string;
      processing: string;
    };
    fileConflict: {
      title: string;
      desc: (name: string) => string;
      replaceButton: string;
      keepButton: string;
    };
    backgroundBrowser: {
      title: string;
      noImages: string;
    };
  };

  // All floating Notice() messages
  notices: {
    pluginEnabled: string;
    pluginDisabled: string;
    profilePinned: string;
    profileReset: string;
    noPinnedSnapshot: string;
    profileNotFound: string;
    noProfilesFound: string;
    activeProfileSwitched: (name: string) => string;
    cannotFindOriginalProfile: string;
    profileRestored: (name: string) => string;
    graphColorsApplied: string;
    invalidJson: string;
    jsonMustHaveName: string;
    profileCreatedSuccess: (name: string) => string;
    profileImportedSuccess: (mode: string) => string;
    noActiveProfileToCopy: string;
    noActiveProfileToExport: string;
    snippetCssCopied: string;
    snippetEmpty: string;
    cssContentEmpty: string;
    snippetNameExists: (name: string) => string;
    profileNameExists: (name: string) => string;
    profileUpdated: (name: string) => string;
    snippetUpdated: (name: string) => string;
    snippetCreated: (name: string) => string;
    snippetScopeMove: string;
    profileCreatedFromCss: (name: string) => string;
    noColorHistory: string;
    colorRestored: (color: string) => string;
    textboxEmpty: string;
    fileLoaded: (fileName: string) => string;
    exportSuccess: string;
    jsonCopied: string;
    resetSuccess: string;
    fpsUpdated: (value: number) => string;
    invalidProfileObject: string;
    profileCreated: (name: string) => string;
    settingsSaved: string;
    testSentence: (word: string) => string;
    varNameEmpty: string;
    varNameFormat: string;
    varExists: (name: string) => string;
    varAdded: (name: string) => string;
    iconizeNotFound: string;
    themeCssLoaded: (theme: string) => string;
    themeReadFailed: (theme: string) => string;
    snippetLoaded: (snippet: string) => string;
    snippetReadFailed: (snippet: string) => string;
    themeSwitchedLight: string;
    themeSwitchedDark: string;
    themeSwitchedAuto: string;
    bgSet: string;
    bgRemoved: string;
    backgroundLoadError: string;
    noBgToRemove: string;
    bgDeleted: string;
    backgroundUrlLoadError: string;
    backgroundPasteError: string;
    invalidFilename: string;
    filenameExists: (name: string) => string;
    renameSuccess: (name: string) => string;
    renameError: string;
    profileDeleted: string;
    jpgQualitySet: (value: number) => string;
  };

  // All tooltips
  tooltips: {
    restoreBuiltin: string;
    editCssProfile: string;
    pinSnapshot: string;
    pinSnapshotDate: (date: string) => string;
    resetToPinned: string;
    editSnippet: string;
    copySnippetCss: string;
    deleteSnippet: string;
    setTransparent: string;
    undoChange: string;
    dragReorder: string;
    testRule: string;
    deleteCustomVar: string;
    iconizeSettings: string;
    themeLight: string;
    themeDark: string;
    themeAuto: string;
    addBg: string;
    removeBg: string;
    bgSettings: string;
    browseBg: string;
    iconizeNotInstalled: string;
  };

  // All commands
  commands: {
    toggleTheme: string;
    enableDisable: string;
    cycleNext: string;
    cyclePrevious: string;
    openSettings: string;
  };

  // Like Plugin Card strings
  likeCard: {
    profilesStat: (p: number, s: number) => string;
    colorsStat: string;
    integrationsStat: string;
    daysStat: string;
    starButton: string;
    issueButton: string;
    syncButton: string;
    telegramButton: string;
  };

  // Color Variable Names and Descriptions
  colors: {
    names: {
      [key: string]: string;
    };
    descriptions: {
      [key: string]: string;
    };
  };
}

// flattenStrings --> It takes a nested object (like {a: {b: "c"}})
// and turns it into a flat object (like {"a.b": "c"})
function flattenStrings(
  obj: any,
  parentKey: string = "",
  result: Record<string, string | Function | any[]> = {}
): Record<string, string | Function | any[]> {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      const value = obj[key];

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        flattenStrings(value, newKey, result);
      } else {
        result[newKey] = value;
      }
    }
  }
  return result;
}

const NESTED_STRINGS: Record<LocaleCode, LocaleStrings> = {
  en: {
    plugin: {
      name: "Color Master - v1.1.1",
      ribbonTooltip: "Color Master Settings",
    },
    buttons: {
      new: "New",
      delete: "Delete",
      create: "Create",
      reset: "Reset",
      restore: "Restore",
      update: "Update",
      apply: "Apply",
      cancel: "Cancel",
      reload: "Reload",
      exportFile: "Export File",
      copyJson: "Copy JSON",
      importCss: "Import / Paste (.css)",
      importJson: "Import / Paste (.json)",
      chooseFile: "Choose File...",
      import: "Import",
      select: "Select",
      browse: "Browse...",
      deleteAnyway: "Delete Anyway",
    },
    settings: {
      enablePlugin: "Enable Color Master",
      enablePluginDesc:
        "Turn this off to temporarily disable all custom colors and revert to your active Obsidian theme.",
      language: "Language",
      languageDesc: "Set the interface language for the plugin.",
      languageSettingsModalTitle: "Language Settings",
      rtlLayoutName: "Enable Right-to-Left (RTL) Layout",
      rtlLayoutDesc:
        "When enabled, the plugin's interface is flipped to properly support languages written from right to left.",
      searchPlaceholder: "Search variables (name or value)...",
      regexPlaceholder: "Enter Regex and press Enter...",
      searchResultsFound: (count: number) => `${count} found`,
      allSections: "All Sections",
      clear: "Clear",
      ariaCase: "Case-sensitive search",
      ariaRegex: "Use regular expression",
      themeWarningTooltip: (currentTheme: string) =>
        `The community theme "${currentTheme}" is active, which may interfere with the profile's appearance. For best results, switch to Obsidian's default theme, or import "${currentTheme}" as a new CSS profile to customize it directly.`,
    },
    profileManager: {
      heading: "Profile Manager",
      activeProfile: "Active Profile",
      activeProfileDesc: "Manage and switch between color profiles.",
      themeType: "Profile Theme Type",
      themeTypeDesc:
        "Set whether this profile should force a specific theme (Dark/Light) when activated.",
      themeAuto: "Obsidian's Default Theme",
      themeDark: "Force Dark Mode",
      themeLight: "Force Light Mode",
      tooltipThemeAuto:
        "Theme: Auto (Follows Obsidian) (Click to switch to Light)",
      tooltipThemeDark: "Theme: Force Dark Mode (Click to switch to Auto)",
      tooltipThemeLight: "Theme: Force Light Mode (Click to switch to Dark)",
      tooltipExport: "Export current profile as JSON file",
      tooltipCopyJson: "Copy current profile JSON to clipboard",
    },
    options: {
      heading: "Advanced Settings",
      liveUpdateName: "Live Update FPS",
      liveUpdateDesc:
        "Sets how many times per second the UI previews color changes while dragging (0 = disable live preview). Lower values can improve performance.",
      iconizeModalTitle: "Iconize Integration Settings",
      overrideIconizeName: "Override Iconize Plugin Colors",
      overrideIconizeDesc:
        "Let Color Master control all icon colors from the Iconize plugin. For best results, disable the color settings within Iconize itself.",
      cleanupIntervalName: "Cleanup Interval",
      cleanupIntervalDesc:
        "Sets how often (in seconds) the plugin checks for uninstalled Iconize plugin to clean up its icons.",
      addCustomVarName: "Add Custom Variable",
      addCustomVarDesc:
        "Add a new CSS variable that isn't in the default list. The name must start with '--'.",
      addNewVarButton: "Add New Variable...",
      resetPluginName: "Reset Plugin Settings",
      resetPluginDesc:
        "This will delete all profiles, snippets, settings, and backgrounds, resetting the plugin to its original state. This action requires an app reload and cannot be undone.",
      resetPluginButton: "Reset All Data...",
      backgroundName: "Set Custom Background",
      backgroundDesc: "Manage the background image or video for this profile.",

      backgroundModalSettingsTitle: "Background Settings",
      backgroundEnableName: "Enable Background",
      backgroundEnableDesc:
        "Toggle the visibility of the custom background for this profile.",
      convertImagesName: "Convert images to JPG",
      convertImagesDesc:
        "Automatically convert PNG, WEBP, or BMP images to JPG on upload to reduce file size and improve loading performance. (Note: Transparency will be lost)",
      jpgQualityName: "JPG Quality",
      jpgQualityDesc:
        "Set the compression quality (1-100). Lower values mean smaller files but lower quality.",
      badgeNotInstalled: "Not Installed",
      videoOpacityName: "Video Opacity",
      videoOpacityDesc:
        "Controls the transparency of the video background for better readability.",
      videoMuteName: "Mute Video",
      videoMuteDesc: "Mutes the video background. Highly recommended.",
      settingType: "Setting Type",
      settingTypeImage: "Image",
      settingTypeVideo: "Video",
    },
    snippets: {
      heading: "CSS Snippets",
      createButton: "Create New Snippet",
      noSnippetsDesc: "No CSS snippets created for this profile yet.",
      globalName: "Save as Global Snippet",
      globalDesc: "A global snippet is applied to all of your profiles.",
    },
    categories: {
      pluginintegrations: "Plugin Integrations",
      backgrounds: "Backgrounds",
      text: "Text",
      interactive: "Interactive Elements",
      ui: "UI Elements",
      misc: "Misc",
      graph: "Graph View",
      markdown: "Markdown",
      notices: "Notices",
      custom: "Custom Variables",
      customDesc: "Variable added by the user.",
      helpTextPre: "Can't find the variable you're looking for? ",
      helpTextLink: "Browse the official list of Obsidian CSS variables.",
    },
    modals: {
      newProfile: {
        title: "Create New Profile",
        nameLabel: "Profile Name",
        namePlaceholder: "Enter profile name...",
      },
      deleteProfile: {
        title: "Delete Profile",
        confirmation: (name: string) =>
          `Are you sure you want to delete the profile "${name}"? This action cannot be undone.`,
      },
      restoreProfile: {
        title: (name: string) => `Restore Profile: ${name}`,
        desc: (name: string) =>
          `Are you sure you want to restore "${name}" to its original colors? All your customizations for this profile will be lost.`,
      },
      jsonImport: {
        title: "Paste or Import Profile JSON",
        desc1: "You can paste a profile JSON in the box below.",
        placeholder: '{ "name": "...", "profile": { ... } }',
        settingName: "Import from File",
        settingDesc: "Or, select a (.json) profile file from your computer.",
        replaceActiveButton: "Replace Active",
        createNewButton: "Create New",
      },
      cssImport: {
        title: "Import / Paste CSS & Create Profile",
        titleEdit: "Edit CSS Profile",
        note: "Note : Pasted CSS can affect UI, proceed only with trusted CSS.",
        importFromFile: "Import from File",
        importFromFileDesc: "Or, select a (.css) file from your computer.",
        importFromTheme: "Import from installed theme",
        importFromThemeDesc:
          "Quickly load the CSS from one of your installed community themes.",
        noThemes: "No community themes installed",
      },
      snippetEditor: {
        title: "Create New CSS Snippet",
        titleEdit: "Edit CSS Snippet",
        nameLabel: "Snippet Name",
        namePlaceholder: "Enter snippet name...",
        importFromSnippet: "Import from installed snippet",
        importFromSnippetDesc:
          "Quickly load the CSS from one of your enabled Obsidian snippets.",
        noSnippets: "No snippets installed",
        cssPlaceholder: "Paste your CSS here...",
      },
      confirmation: {
        resetProfileTitle: "Reset Profile Confirmation",
        resetProfileDesc:
          "Are you sure you want to reset this profile to the last pinned snapshot? This will overwrite your current colors and cannot be undone.",
        deleteSnippetTitle: (name: string) => `Delete Snippet: ${name}`,
        deleteSnippetDesc:
          "Are you sure you want to delete this snippet? This action cannot be undone.",
        resetPluginTitle: "Are you sure?",
        resetPluginDesc:
          "This will permanently delete all your Color Master data (profiles, snippets, settings, and backgrounds). This is irreversible.",
        deleteGlobalBgTitle: "Confirm Background Deletion",
        deleteGlobalBgDesc:
          "Are you sure you want to permanently delete this background? The following profiles are using it and will be reset:",
        deleteBackgroundTitle: "Delete Background?",
        deleteBackgroundDesc: (
          name: string
        ) => `Are you sure you want to permanently delete '${name}'?`,
      },
      noticeRules: {
        titleText: "Advanced Text Color Rules",
        titleBg: "Advanced Background Color Rules",
        desc: "Create prioritized rules to color notices based on their content. The first matching rule from top to bottom will be applied.",
        addNewRule: "Add New Rule",
        keywordPlaceholder: "Type a keyword and press Space...",
        useRegex: "Regex",
      },
      duplicateProfile: {
        title: "Duplicate Profile Name",
        descParts: [
          `The profile name "`,
          `" already exists. Please choose a different name.`,
        ],
        placeholder: "Enter new profile name...",
      },
      customVar: {
        title: "Add New Custom CSS Variable",
        desc: "Define a new CSS variable (e.g., --my-color: #f00). This variable will be added to your active profile.",
        displayName: "Display Name",
        displayNameDesc:
          "A friendly name for your variable (e.g., 'My Custom Primary Color').",
        displayNamePlaceholder: "e.g., My Primary Color",
        varName: "Variable Name",
        varNameDesc:
          "The actual CSS variable name. Must start with '--' (e.g., '--my-primary-color').",
        varNamePlaceholder: "e.g., --my-primary-color",
        varValue: "Variable Value",
        varType: "Variable Type",
        varTypeDesc: "Select the type of data this variable holds.",
        types: {
          color: "Color",
          size: "Size (e.g., px, em)",
          text: "Text",
          number: "Number",
        },
        varValueDesc:
          "The value of the CSS variable (e.g., 'red', '#ff0000', 'rgb(255,0,0)').",
        varValuePlaceholder: "e.g., #FF0000 or red",
        description: "Description (Optional)",
        descriptionDesc: "A brief description of what this variable controls.",
        descriptionPlaceholder: "e.g., Main color for headings",
        addVarButton: "Add",
        textValuePlaceholder: "Enter text value...",
      },
      addBackground: {
        title: "Add New Background (Image/Video)",
        importFromFile: "Import from File",
        importFromFileDesc:
          "Import an image file from your computer to use as a background.",
        pasteBoxPlaceholder:
          "Drag & Drop / Paste a background or URL here (Ctrl+V)",
        dropToAdd: "Drop to add background...",
        processing: "Processing",
      },
      fileConflict: {
        title: "File Exists",
        desc: (name: string) =>
          `A file named '${name}' already exists in your backgrounds folder. What would you like to do?`,
        replaceButton: "Replace File",
        keepButton: "Keep Both (Rename)",
      },
      backgroundBrowser: {
        title: "Stored Backgrounds",
        noImages: "No images or videos found in your backgrounds folder.",
      },
    },
    notices: {
      pluginEnabled: "Color Master Enabled",
      pluginDisabled: "Color Master Disabled",
      profilePinned: "Profile colors pinned successfully!",
      profileReset: "Profile has been reset to the pinned snapshot.",
      noPinnedSnapshot: "No pinned snapshot found for this profile.",
      profileNotFound: "Active profile could not be found.",
      noProfilesFound: "No profiles found.",
      activeProfileSwitched: (name: string) => `Active profile: ${name}`,
      cannotFindOriginalProfile:
        "Could not find original data for this profile.",
      profileRestored: (name: string) =>
        `Profile "${name}" has been restored to its default state.`,
      graphColorsApplied: "Graph colors applied!",
      invalidJson: "Invalid JSON.",
      jsonMustHaveName:
        "The imported JSON must have a 'name' property to create a new profile.",
      profileCreatedSuccess: (name: string) =>
        `Profile "${name}" was created successfully.`,
      profileImportedSuccess: (mode: string) =>
        `Profile ${mode}d successfully.`,
      noActiveProfileToCopy: "No active profile to copy.",
      noActiveProfileToExport: "No active profile to export.",
      snippetCssCopied: "Snippet CSS copied to clipboard!",
      snippetEmpty: "This snippet is empty.",
      cssContentEmpty: "CSS content cannot be empty.",
      snippetNameExists: (name: string) =>
        `Snippet name "${name}" already exists.`,
      profileNameExists: (name: string) =>
        `Profile name "${name}" already exists.`,
      profileUpdated: (name: string) => `Profile "${name}" updated.`,
      snippetUpdated: (name: string) => `Snippet "${name}" updated.`,
      snippetCreated: (name: string) =>
        `Snippet "${name}" has been created successfully!`,
      snippetScopeMove: "Use the edit modal to move a snippet between scopes.",
      profileCreatedFromCss: (name: string) =>
        `Profile "${name}" has been created successfully!`,
      noColorHistory: "No color history to restore.",
      colorRestored: (color: string) => `Restored: ${color}`,
      textboxEmpty:
        "The text box is empty. Paste some JSON or import a file first.",
      fileLoaded: (fileName: string) =>
        `File "${fileName}" loaded into the text area.`,
      exportSuccess: "Profile exported successfully!",
      jsonCopied: "Profile JSON copied to clipboard.",
      resetSuccess:
        "Color Master data has been deleted. Please reload Obsidian to apply the changes.",
      fpsUpdated: (value: number) => `Live Update FPS set to: ${value}`,
      invalidProfileObject:
        "JSON does not appear to be a valid profile object.",
      profileCreated: (name: string) =>
        `Profile "${name}" created successfully!`,
      settingsSaved: "Settings applied successfully!",
      testSentence: (word: string) =>
        `Notice color for "${word}" looks like this:`,
      varNameEmpty: "Variable name cannot be empty.",
      varNameFormat: "Variable name must start with '--'.",
      varExists: (name: string) => `Variable "${name}" already exists.`,
      varAdded: (name: string) => `Variable "${name}" added successfully.`,
      iconizeNotFound:
        "Iconize plugin not found. Please install and enable it to use this feature.",
      themeCssLoaded: (theme: string) =>
        `Successfully loaded CSS from "${theme}" theme.`,
      themeReadFailed: (theme: string) =>
        `Could not read the theme file for "${theme}". It might be protected or missing.`,
      snippetLoaded: (snippet: string) =>
        `Successfully loaded CSS from "${snippet}" snippet.`,
      snippetReadFailed: (snippet: string) =>
        `Could not read the snippet file for "${snippet}".`,
      themeSwitchedLight: "Switched to Light Mode",
      themeSwitchedDark: "Switched to Dark Mode",
      themeSwitchedAuto: "Switched to Auto Mode",
      bgSet: "Background has been set successfully.",
      bgRemoved: "Background has been removed.",
      backgroundLoadError: "Failed to load the background.",
      noBgToRemove: "There is no active background for this profile to remove.",
      bgDeleted: "Background media and file have been deleted.",
      backgroundUrlLoadError: "Failed to download background from URL.",
      backgroundPasteError:
        "Pasted content is not a valid background file or URL.",
      invalidFilename: "Invalid file name.",
      filenameExists: (name: string) => `File name "${name}" already exists.`,
      renameSuccess: (name: string) => `Renamed to "${name}"`,
      renameError: "Error renaming file.",
      profileDeleted: "Profile deleted successfully.",
      jpgQualitySet: (value: number) => `JPG Quality set to ${value}%`,
    },
    tooltips: {
      restoreBuiltin: "Restore to original built-in colors",
      editCssProfile: "Edit CSS Profile",
      pinSnapshot: "Pin current colors as a snapshot",
      pinSnapshotDate: (date: string) =>
        `Colors pinned on ${date}. Click to re-pin.`,
      resetToPinned: "Reset to pinned colors",
      editSnippet: "Edit Snippet",
      copySnippetCss: "Copy CSS to clipboard",
      deleteSnippet: "Delete Snippet",
      setTransparent: "Set to transparent",
      undoChange: "Undo last change",
      dragReorder: "Drag to reorder",
      testRule: "Test this rule with a random keyword",
      deleteCustomVar: "Delete Custom Variable",
      iconizeSettings: "Iconize Settings",
      themeLight: "Theme: Force Light Mode (Click to switch to Dark)",
      themeDark: "Theme: Force Dark Mode (Click to switch to Auto)",
      themeAuto: "Theme: Auto (Follows Obsidian) (Click to switch to Light)",
      addBg: "Add background media",
      removeBg: "Remove background media",
      bgSettings: "Background media settings",
      browseBg: "Browse stored background media",
      iconizeNotInstalled:
        "Plugin not installed or disabled. Please install and enable 'Iconize' to use this feature.",
    },
    commands: {
      toggleTheme: "Cycle active profile theme",
      enableDisable: "Enable & Disable",
      cycleNext: "Cycle to next profile",
      cyclePrevious: "Cycle to previous profile",
      openSettings: "Open settings tab",
    },
    likeCard: {
      profilesStat: (p: number, s: number) => `Profiles: ${p} & Snippets: ${s}`,
      colorsStat: "Customizable Colors",
      integrationsStat: "Plugin Integrations",
      daysStat: "Days of Use",
      starButton: "Star on GitHub",
      issueButton: "Report an Issue",
      syncButton: "Sync Your Vault",
      telegramButton: "Telegram",
    },
    colors: {
      names: {
        // Iconize
        "--iconize-icon-color": "Iconize Icon Color",
        // Backgrounds
        "--background-primary": "Background Primary",
        "--background-primary-alt": "Background Primary Alt",
        "--background-secondary": "Background Secondary",
        "--background-secondary-alt": "Background Secondary Alt",
        "--background-modifier-border": "Border",
        "--background-modifier-border-hover": "Border (Hover)",
        "--background-modifier-border-focus": "Border (Focus)",
        "--background-modifier-flair": "Flair Background",
        "--background-modifier-hover": "Hover Background",
        "--background-modifier-active": "Active Background",
        // Text
        "--text-normal": "Normal Text",
        "--text-muted": "Muted Text",
        "--text-faint": "Faint Text",
        "--text-on-accent": "Text on Accent",
        "--text-accent": "Accent Text",
        "--text-accent-hover": "Accent Text (Hover)",
        "--text-selection": "Text Selection",
        "--checklist-done-color": "Checklist Done",
        "--tag-color": "Tag Text",
        "--tag-color-hover": "Tag Text (Hover)",
        "--tag-bg": "Tag Background",
        // Headings
        "--h1-color": "H1 Color",
        "--h2-color": "H2 Color",
        "--h3-color": "H3 Color",
        "--h4-color": "H4 Color",
        "--h5-color": "H5 Color",
        "--h6-color": "H6 Color",
        // Markdown
        "--hr-color": "Horizontal Rule",
        "--blockquote-border-color": "Blockquote Border",
        "--blockquote-color": "Blockquote Text",
        "--blockquote-bg": "Blockquote Background",
        "--code-normal": "Inline code text",
        "--code-background": "Inline code background",
        "--text-highlight-bg": "Highlighted text background",
        // Interactive Elements
        "--interactive-normal": "Interactive Normal",
        "--interactive-hover": "Interactive (Hover)",
        "--interactive-accent": "Interactive Accent",
        "--interactive-accent-hover": "Interactive Accent (Hover)",
        "--interactive-success": "Success Color",
        "--interactive-error": "Error Color",
        "--interactive-warning": "Warning Color",
        // UI Elements
        "--titlebar-background": "Titlebar Background",
        "--titlebar-background-focused": "Titlebar Background (Focused)",
        "--titlebar-text-color": "Titlebar Text",
        "--sidebar-background": "Sidebar Background",
        "--sidebar-border-color": "Sidebar Border",
        "--header-background": "Header Background",
        "--header-border-color": "Header Border",
        "--vault-name-color": "Vault Name",
        // Notices
        "--cm-notice-text-default": "Default Notice Text",
        "--cm-notice-bg-default": "Default Notice Background",
        // Graph View
        "--graph-line": "Graph Line",
        "--graph-node": "Graph Node",
        "--graph-text": "Graph Text",
        "--graph-node-unresolved": "Graph Unresolved Node",
        "--graph-node-focused": "Graph Focused Node",
        "--graph-node-tag": "Graph Tag Node",
        "--graph-node-attachment": "Graph Attachment Node",
        // Misc
        "--scrollbar-thumb-bg": "Scrollbar Thumb",
        "--scrollbar-bg": "Scrollbar Background",
        "--divider-color": "Divider",
      },
      descriptions: {
        // Iconize
        "--iconize-icon-color":
          "Sets the color for all icons added by the Iconize plugin. This will override Iconize's own color settings.",
        // Backgrounds
        "--background-primary":
          "Main background color for the entire app, especially for editor and note panes.",
        "--background-primary-alt":
          "An alternate background color, often used for the active line in the editor.",
        "--background-secondary":
          "Secondary background, typically used for sidebars and other UI panels.",
        "--background-secondary-alt":
          "An alternate secondary background, used for the file explorer's active file.",
        "--background-modifier-border":
          "The color of borders on various UI elements like buttons and inputs.",
        "--background-modifier-border-hover":
          "The border color when you hover over an element.",
        "--background-modifier-border-focus":
          "The border color for a focused element, like a selected text field.",
        "--background-modifier-flair":
          "Background color for special UI elements, like the 'Syncing' or 'Indexing' status.",
        "--background-modifier-hover":
          "The background color of elements when you hover over them (e.g., list items).",
        "--background-modifier-active":
          "The background color of an element when it's actively being clicked or is selected.",
        // Text
        "--text-normal":
          "The default text color for all notes and most of the UI.",
        "--text-muted":
          "A slightly faded text color, used for less important information like file metadata.",
        "--text-faint":
          "The most faded text color, for very subtle UI text or disabled elements.",
        "--text-on-accent":
          "Text color that appears on top of accented backgrounds (like on a primary button).",
        "--text-accent":
          "The primary accent color for text, used for links and highlighted UI elements.",
        "--text-accent-hover":
          "The color of accent text (like links) when you hover over it.",
        "--text-selection":
          "The background color of text that you have selected with your cursor.",
        "--checklist-done-color":
          "The color of the checkmark and text for a completed to-do item.",
        "--tag-color": "Sets the text color of #tags.",
        "--tag-color-hover":
          "Sets the text color of #tags when hovering over them.",
        "--tag-bg":
          "Sets the background color of #tags, allowing for a 'pill' shape.",
        // Headings
        "--h1-color": "The color of H1 heading text.",
        "--h2-color": "The color of H2 heading text.",
        "--h3-color": "The color of H3 heading text.",
        "--h4-color": "The color of H4 heading text.",
        "--h5-color": "The color of H5 heading text.",
        "--h6-color": "The color of H6 heading text.",
        // Markdown
        "--hr-color":
          "The color of the horizontal rule line created with `---`.",
        "--blockquote-border-color":
          "The color of the vertical border on the left side of a blockquote.",
        "--blockquote-color":
          "The text color for content inside of a blockquote.",
        "--blockquote-bg":
          "Sets the background color of blockquote elements (>).",
        "--code-normal":
          "Sets the text color inside inline code (between backticks).",
        "--code-background":
          "Sets the background color for inline code blocks.",
        "--text-highlight-bg":
          "Sets the background color for highlighted text (==like this==).",
        // Interactive Elements
        "--interactive-normal":
          "The background color for interactive elements like buttons.",
        "--interactive-hover":
          "The background color for interactive elements when hovered.",
        "--interactive-accent":
          "The accent color for important interactive elements (e.g., the 'Create' button).",
        "--interactive-accent-hover":
          "The accent color for important interactive elements when hovered.",
        "--interactive-success":
          "Color indicating a successful operation (e.g., green).",
        "--interactive-error": "Color indicating an error (e.g., red).",
        "--interactive-warning": "Color indicating a warning (e.g., yellow).",
        // UI Elements
        "--titlebar-background":
          "The background color of the main window's title bar.",
        "--titlebar-background-focused":
          "The title bar background color when the window is active.",
        "--titlebar-text-color": "The text color in the title bar.",
        "--sidebar-background":
          "Specifically targets the background of the sidebars.",
        "--sidebar-border-color":
          "The color of the border next to the sidebars.",
        "--header-background":
          "The background for headers within panes (e.g., note title header).",
        "--header-border-color": "The border color below pane headers.",
        "--vault-name-color":
          "The color of your vault's name in the top-left corner.",
        "--cm-notice-text-default":
          "Sets the default text color for all notices, unless overridden by a rule.",
        "--cm-notice-bg-default":
          "Sets the default background color for all notices, unless overridden by a rule.",
        // Graph View
        "--graph-line":
          "The color of the connection lines between notes in the Graph View.",
        "--graph-node": "The color of the circular nodes for existing notes.",
        "--graph-text": "The color of the text labels on the graph nodes.",
        "--graph-node-unresolved":
          "The color of nodes for notes that do not exist yet (unresolved links).",
        "--graph-node-focused":
          "Color of the node that is focused or hovered (highlighted node).",
        "--graph-node-tag":
          "Color of nodes representing tags when tags are shown in the graph.",
        "--graph-node-attachment":
          "Color of nodes representing attachments (e.g., image or other linked files).",
        // Misc
        "--scrollbar-thumb-bg":
          "The color of the draggable part of the scrollbar.",
        "--scrollbar-bg": "The color of the scrollbar track (the background).",
        "--divider-color":
          "The color for general UI separator lines, like the borders between settings.",
      },
    },
  },

  ar: {
    plugin: {
      name: "متحكم الألوان - v1.1.1",
      ribbonTooltip: "إعدادات Color Master",
    },
    buttons: {
      new: "جديد",
      delete: "حذف",
      create: "إنشاء",
      reset: "إعادة تعيين",
      restore: "استعادة",
      update: "تحديث",
      apply: "تطبيق",
      cancel: "إلغاء",
      reload: "إعادة تحميل",
      exportFile: "تصدير ملف",
      copyJson: "نسخ JSON",
      importCss: "استيراد / لصق (.css)",
      importJson: "استيراد / لصق (.json)",
      chooseFile: "اختر ملف...",
      import: "استيراد",
      select: "اختيار",
      browse: "استعراض...",
      deleteAnyway: "حذف على أي حال",
    },
    settings: {
      enablePlugin: "تفعيل متحكم الألوان",
      enablePluginDesc:
        "أطفئ هذا الخيار لتعطيل جميع الألوان المخصصة مؤقتاً والعودة إلى ثيم Obsidian النشط.",
      language: "اللغة",
      languageDesc: "اختر لغة واجهة الإضافة.",
      languageSettingsModalTitle: "إعدادات اللغة",
      rtlLayoutName: "تفعيل تنسيق اليمين لليسار (RTL)",
      rtlLayoutDesc:
        "عند تفعيله، يتم قلب واجهة الإضافة لتتناسب مع اللغات التي تكتب من اليمين لليسار.",
      searchPlaceholder: "ابحث عن المتغيرات (بالاسم أو القيمة)...",
      regexPlaceholder: "أدخل التعبير النمطي واضغط Enter...",
      searchResultsFound: (count: number) => `تم العثور على ${count}`,
      allSections: "كل الأقسام",
      clear: "تنظيف",
      ariaCase: "بحث حساس لحالة الأحرف",
      ariaRegex: "استخدام التعابير النمطية (Regex)",
      themeWarningTooltip: (currentTheme: string) =>
        `الثيم "${currentTheme}" مطبّق حالياً، وقد يتعارض مع مظهر الملف الشخصي. للحصول على أفضل النتائج، ننصح بالتبديل إلى الثيم الافتراضي لأوبسيديان، أو يمكنك استيراد ثيم "${currentTheme}" كملف شخصي جديد لتعديله مباشرةً.`,
    },
    profileManager: {
      heading: "إدارة الملفّات الشخصيّة",
      activeProfile: "الملف الشخصي النشط",
      activeProfileDesc: "تنقل بين الملفّات الشخصيّة أو أنشئ واحد جديد.",
      themeType: "نوع ثيم الملف الشخصي",
      themeTypeDesc:
        "حدد ما إذا كانت هذا الملف الشخصي سيفرض ثيماً معيناً (غامق/فاتح) عند تفعيله.",
      themeAuto: "الثيم الافتراضي لأوبسيديان",
      themeDark: "فرض الوضع الغامق",
      themeLight: "فرض الوضع الفاتح",
      tooltipThemeAuto: "الثيم: تلقائي (يتبع أوبسيديان) (اضغط للتبديل للفاتح)",
      tooltipThemeDark: "الثيم: فرض الوضع الغامق (اضغط للتبديل للتلقائي)",
      tooltipThemeLight: "الثيم: فرض الوضع الفاتح (اضغط للتبديل للغامق)",
      tooltipExport: "تصدير الملف الشخصي الحالي كملف JSON",
      tooltipCopyJson: "نسخ JSON للملف الشخصي الحالي إلى الحافظة",
    },
    options: {
      heading: "إعدادات متقدمة",
      liveUpdateName: "معدل التحديث المباشر (إطار بالثانية)",
      liveUpdateDesc:
        "يحدد عدد مرات تحديث معاينة الألوان في الثانية أثناء السحب (0 = تعطيل المعاينة). القيم المنخفضة تحسن الأداء.",
      iconizeModalTitle: "إعدادات تكامل Iconize",
      overrideIconizeName: "تجاوز ألوان إضافة Iconize",
      overrideIconizeDesc:
        "اسمح لـ Color Master بالتحكم في كل ألوان أيقونات Iconize. لأفضل النتائج، قم بتعطيل إعدادات الألوان في إضافة Iconize نفسها.",
      cleanupIntervalName: "فترة التنظيف",
      cleanupIntervalDesc:
        "تحدد عدد المرات (بالثواني) التي تتحقق فيها الإضافة من إلغاء تثبيت إضافة Iconize لتنظيف أيقوناتها.",
      addCustomVarName: "إضافة متغير مخصص",
      addCustomVarDesc:
        "أضف متغير CSS جديد غير موجود بالقائمة الافتراضية. يجب أن يبدأ الاسم بـ '--'.",
      addNewVarButton: "إضافة متغير جديد...",
      resetPluginName: "إعادة تعيين الإضافة",
      resetPluginDesc:
        "سيؤدي هذا إلى حذف جميع الملفات الشخصية، والمقتطفات، والإعدادات، والخلفيات، وإعادة ضبط الإضافة إلى حالتها الأصلية. يتطلب هذا الإجراء إعادة تحميل التطبيق، ولا يمكن التراجع عنه.",
      resetPluginButton: "إعادة تعيين كل البيانات...",
      backgroundName: "تعيين خلفية مخصصة",
      backgroundDesc: "إدارة صورة أو فيديو الخلفية لهذا الملف الشخصي.",
      backgroundModalSettingsTitle: "إعدادات الخلفية",
      backgroundEnableName: "تفعيل الخلفية",
      backgroundEnableDesc:
        "التحكم بظهور أو إخفاء الخلفية المخصصة لهذا الملف الشخصي.",
      convertImagesName: "تحويل الصور إلى JPG",
      convertImagesDesc:
        "تحويل صور PNG أو WEBP أو BMP تلقائياً إلى JPG عند الرفع لتقليل حجم الملف وتحسين أداء التحميل. (ملاحظة: ستفقد الصور شفافيتها)",
      jpgQualityName: "جودة JPG",
      jpgQualityDesc:
        "حدد جودة الضغط (من 1 إلى 100). القيم الأقل تعني ملفات أصغر ولكن بجودة أدنى.",
      badgeNotInstalled: "غير مُثبّت",
      videoOpacityName: "شفافية الفيديو",
      videoOpacityDesc: "التحكم بشفافية خلفية الفيديو لتحسين قابلية القراءة.",
      videoMuteName: "كتم الفيديو",
      videoMuteDesc: "كتم صوت خلفية الفيديو. موصى به بشدة.",
      settingType: "نوع الإعدادات",
      settingTypeImage: "صورة",
      settingTypeVideo: "فيديو",
    },
    snippets: {
      heading: "قصاصات CSS",
      createButton: "إنشاء قصاصة جديدة",
      noSnippetsDesc: "لم يتم إنشاء أي قصاصات CSS لهذا الملف الشخصي بعد.",
      globalName: "حفظ كقصاصة عامة",
      globalDesc: "القصاصة العامة يتم تطبيقها على جميع ملفاتك الشخصية.",
    },
    categories: {
      pluginintegrations: "تكامل الإضافات",
      backgrounds: "الخلفيات",
      text: "النصوص",
      interactive: "العناصر التفاعلية",
      ui: "عناصر الواجهة",
      misc: "متنوع",
      graph: "عرض الرسم البياني",
      markdown: "عناصر الماركدوان",
      notices: "الإشعارات",
      custom: "المتغيرات المخصصة",
      customDesc: "متغير مضاف من قبل المستخدم.",
      helpTextPre: "لم تجد المتغير الذي تبحث عنه؟ ",
      helpTextLink: "تصفح قائمة متغيرات CSS الرسمية في Obsidian.",
    },
    modals: {
      newProfile: {
        title: "إنشاء ملف شخصي جديد",
        nameLabel: "اسم الملف الشخصي",
        namePlaceholder: "أدخل اسم الملف الشخصي...",
      },
      deleteProfile: {
        title: "حذف الملف الشخصي",
        confirmation: (name: string) =>
          `هل أنت متأكد من رغبتك في حذف الملف الشخصي "${name}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      },
      restoreProfile: {
        title: (name: string) => `استعادة الملف الشخصي: ${name}`,
        desc: (name: string) =>
          `هل أنت متأكد من رغبتك في استعادة "${name}" إلى ألوانه الأصلية؟ ستفقد جميع تخصيصاتك للملف الشخصي هذا.`,
      },
      jsonImport: {
        title: "لصق أو استيراد ملف JSON للملف شخصي",
        desc1: "يمكنك لصق بيانات الملف الشخصي (JSON) في الصندوق أدناه.",
        placeholder: '{ "name": "...", "profile": { ... } }',
        settingName: "استيراد من ملف",
        settingDesc:
          "أو، اختر ملف الملف الشخصي (.json) من جهاز الكمبيوتر الخاص بك.",
        replaceActiveButton: "استبدال النشط",
        createNewButton: "إنشاء جديدة",
      },
      cssImport: {
        title: "استيراد / لصق CSS وإنشاء ملف شخصي",
        titleEdit: "تعديل الملف الشخصي",
        note: "ملاحظة : كود CSS الذي تلصقه قد يؤثر على واجهة البرنامج، استخدم فقط الأكواد الموثوقة.",
        importFromFile: "استيراد من ملف",
        importFromFileDesc: "أو، اختر ملف (.css) من جهاز الكمبيوتر الخاص بك.",
        importFromTheme: "استيراد من ثيم مثبّت",
        importFromThemeDesc:
          "قم بتحميل CSS مباشرة من أحد الثيمات المثبتة لديك.",
        noThemes: "لا يوجد ثيمات مثبتة",
      },
      snippetEditor: {
        title: "إنشاء قصاصة CSS جديدة",
        titleEdit: "تعديل قصاصة CSS",
        nameLabel: "اسم القصاصة",
        namePlaceholder: "أدخل اسم القصاصة...",
        importFromSnippet: "استيراد من قصاصة مثبتة",
        importFromSnippetDesc:
          "قم بتحميل CSS مباشرة من إحدى قصاصات Obsidian المثبتة لديك.",
        noSnippets: "لا يوجد قصاصات مثبتة",
        cssPlaceholder: "الصق كود CSS الخاص بك هنا...",
      },
      confirmation: {
        resetProfileTitle: "تأكيد استرجاع الملف الشخصي",
        resetProfileDesc:
          "هل أنت متأكد من رغبتك في استرجاع هذا الملف الشخصي لآخر لقطة تم تثبيتها؟ سيتم الكتابة فوق الألوان الحالية ولا يمكن التراجع عن هذا الإجراء.",
        deleteSnippetTitle: (name: string) => `حذف القصاصة: ${name}`,
        deleteSnippetDesc:
          "هل أنت متأكد من رغبتك في حذف هذه القصاصة؟ لا يمكن التراجع عن هذا الإجراء.",
        resetPluginTitle: "هل أنت متأكد؟",
        resetPluginDesc:
          "سيتم حذف جميع بيانات Color Master بشكل دائم (الملفات الشخصية، القصاصات، الإعدادات، والخلفيات). هذا الإجراء لا يمكن التراجع عنه.",
        deleteGlobalBgTitle: "تأكيد حذف الخلفية",
        deleteGlobalBgDesc:
          "هل أنت متأكد من رغبتك في حذف هذه الخلفية بشكل دائم؟ البروفايلات التالية تستخدمها حالياً وسيتم إزالتها منها:",
        deleteBackgroundTitle: "حذف الخلفية؟",
        deleteBackgroundDesc: (
          name: string
        ) => `هل أنت متأكد من رغبتك في حذف '${name}' بشكل دائم؟`,
      },
      noticeRules: {
        titleText: "قواعد لون النص المتقدمة",
        titleBg: "قواعد لون الخلفية المتقدمة",
        desc: "أنشئ قواعد ذات أولوية لتلوين الإشعارات بناءً على محتواها. سيتم تطبيق أول قاعدة مطابقة من الأعلى إلى الأسفل.",
        addNewRule: "إضافة قاعدة جديدة",
        keywordPlaceholder: "اكتب كلمة ثم اضغط مسافة...",
        useRegex: "Regex",
      },
      duplicateProfile: {
        title: "اسم الملف الشخصي مكرر",
        descParts: [
          `الملف الشخصي "`,
          `" موجود بالفعل. الرجاء اختيار اسم مختلف.`,
        ],
        placeholder: "أدخل اسم الملف الشخصي الجديد...",
      },
      customVar: {
        title: "إضافة متغير CSS مخصص جديد",
        desc: "حدد متغير CSS جديد (مثال: --my-color: #f00). سيتم إضافة هذا المتغير إلى ملفك الشخصي النشط.",
        displayName: "اسم العرض",
        displayNameDesc:
          "اسم ودي للمتغير الخاص بك (مثال: 'لون أساسي مخصص لي').",
        displayNamePlaceholder: "مثال: لوني الأساسي",
        varName: "اسم المتغير",
        varNameDesc:
          "الاسم الفعلي لمتغير CSS. يجب أن يبدأ بـ '--' (مثال: '--my-primary-color').",
        varNamePlaceholder: "مثال: --my-primary-color",
        varValue: "قيمة المتغير",
        varType: "نوع المتغير",
        varTypeDesc: "اختر نوع البيانات التي يحملها هذا المتغير.",
        types: {
          color: "لون",
          size: "حجم (مثل px, em)",
          text: "نص",
          number: "رقم",
        },
        varValueDesc:
          "قيمة متغير CSS (مثال: 'red', '#ff0000', 'rgb(255,0,0)').",
        varValuePlaceholder: "مثال: #FF0000 أو أحمر",
        description: "الوصف (اختياري)",
        descriptionDesc: "وصف موجز لما يتحكم فيه هذا المتغير.",
        descriptionPlaceholder: "مثال: اللون الأساسي للعناوين",
        addVarButton: "إضافة",
        textValuePlaceholder: "أدخل القيمة النصية...",
      },
      addBackground: {
        title: "إضافة خلفية جديدة (صورة/فيديو)",
        importFromFile: "استيراد من ملف",
        importFromFileDesc: "استيراد ملف صورة أو فيديو من جهاز الكمبيوتر.",
        pasteBoxPlaceholder: "اسحب وأفلت / أو الصق خلفية / رابط هنا (Ctrl+V)",
        dropToAdd: "أفلتها لإضافة الخلفية...",
        processing: "جاري المعالجة",
      },
      fileConflict: {
        title: "الملف موجود",
        desc: (name: string) =>
          `يوجد ملف باسم '${name}' موجود مسبقاً في مجلد الخلفيات. ماذا تريد أن تفعل؟`,
        replaceButton: "استبدال الملف",
        keepButton: "الاحتفاظ بكليهما (إعادة تسمية)",
      },
      backgroundBrowser: {
        title: "استعراض الخلفيات",
        noImages: "لا توجد صور أو فيديوهات في مجلد الخلفيات.",
      },
    },
    notices: {
      pluginEnabled: "تم تفعيل متحكم الألوان",
      pluginDisabled: "تم تعطيل متحكم الألوان",
      profilePinned: "تم تثبيت ألوان الملف الشخصي بنجاح!",
      profileReset: "تمت إعادة تعيين الملف الشخصي إلى اللقطة المثبتة.",
      noPinnedSnapshot: "لا توجد لقطة مثبتة لهذا الملف الشخصي.",
      profileNotFound: "تعذر العثور على الملف الشخصي النشط.",
      noProfilesFound: "لا توجد أيّة ملفات شخصيّة.",
      activeProfileSwitched: (name: string) => `الملف الشخصي النشط: ${name}`,
      cannotFindOriginalProfile:
        "تعذر العثور على البيانات الأصلية لهذا الملف الشخصي.",
      profileRestored: (name: string) =>
        `تمت استعادة الملف الشخصي "${name}" إلى حالته الافتراضية.`,
      graphColorsApplied: "تم تطبيق ألوان الرسم البياني!",
      invalidJson: "ملف JSON غير صالح.",
      jsonMustHaveName:
        "يجب أن يحتوي ملف JSON المستورد على خاصية 'name' لإنشاء ملف شخصي جديد.",
      profileCreatedSuccess: (name: string) =>
        `تم إنشاء الملف الشخصي "${name}" بنجاح.`,
      profileImportedSuccess: (mode: string) =>
        `تم استيراد الملف الشخصي بنجاح.`,
      noActiveProfileToCopy: "لا يوجد ملف شخصي نشط لنسخه",
      noActiveProfileToExport: "لا يوجد ملف شخصي نشط لتصديره.",
      snippetCssCopied: "تم نسخ CSS القصاصة إلى الحافظة!",
      snippetEmpty: "هذه القصاصة فارغة.",
      cssContentEmpty: "لا يمكن أن يكون محتوى CSS فارغاً.",
      snippetNameExists: (name: string) =>
        `اسم القصاصة "${name}" موجود بالفعل.`,
      profileNameExists: (name: string) =>
        `اسم الملف الشخصي "${name}" موجود بالفعل.`,
      profileUpdated: (name: string) => `تم تحديث الملف الشخصي "${name}".`,
      snippetUpdated: (name: string) => `تم تحديث القصاصة "${name}".`,
      snippetCreated: (name: string) => `تم إنشاء القصاصة "${name}" بنجاح!`,
      snippetScopeMove: "استخدم نافذة التعديل لنقل القصاصة بين الأقسام.",
      profileCreatedFromCss: (name: string) =>
        `تم إنشاء الملف الشخصي "${name}" بنجاح!`,
      noColorHistory: "لا يوجد سجل ألوان لاستعادته.",
      colorRestored: (color: string) => `تمت الاستعادة: ${color}`,
      textboxEmpty:
        "صندوق النص فارغ. الصق بعض بيانات JSON أو استورد ملفاً أولاً.",
      fileLoaded: (fileName: string) =>
        `تم تحميل الملف "${fileName}" في منطقة النص.`,
      exportSuccess: "تم تصدير الملف الشخصي بنجاح!",
      jsonCopied: "تم نسخ JSON للملف الشخصي إلى الحافظة بنجاح!",
      resetSuccess:
        "تم حذف بيانات Color Master. يرجى إعادة تحميل Obsidian لتطبيق التغييرات.",
      fpsUpdated: (value: number) =>
        `تم تعيين معدل التحديث المباشر إلى: ${value}`,
      invalidProfileObject: "لا يبدو أن ملف JSON هو كائن ملف شخصي صالح.",
      profileCreated: (name: string) =>
        `تم إنشاء الملف الشخصي "${name}" بنجاح!`,
      settingsSaved: "تم تطبيق الإعدادات بنجاح!",
      testSentence: (word: string) =>
        `هكذا سيبدو لون إشعار يحتوي على كلمة "${word}"`,
      varNameEmpty: "اسم المتغير لا يمكن أن يكون فارغاً.",
      varNameFormat: "يجب أن يبدأ اسم المتغير بـ '--'.",
      varExists: (name: string) => `المتغير "${name}" موجود بالفعل.`,
      varAdded: (name: string) => `تمت إضافة المتغير "${name}" بنجاح.`,
      iconizeNotFound:
        "إضافة Iconize غير موجودة. يرجى تثبيتها وتفعيلها لاستخدام هذه الميزة.",
      themeCssLoaded: (theme: string) =>
        `تم تحميل CSS بنجاح من ثيم "${theme}".`,
      themeReadFailed: (theme: string) =>
        `تعذّر قراءة ملف الثيم "${theme}". قد يكون الملف محمياً أو مفقوداً.`,
      snippetLoaded: (snippet: string) =>
        `تم تحميل CSS بنجاح من قصاصة "${snippet}".`,
      snippetReadFailed: (snippet: string) =>
        `تعذّرت قراءة ملف القصاصة "${snippet}".`,
      themeSwitchedLight: "تم التبديل إلى الوضع الفاتح",
      themeSwitchedDark: "تم التبديل إلى الوضع الغامق",
      themeSwitchedAuto: "تم التبديل إلى الوضع التلقائي",
      bgSet: "تم تعيين الخلفية بنجاح.",
      bgRemoved: "تمت إزالة الخلفية.",
      backgroundLoadError: "فشل تحميل الخلفية.",
      noBgToRemove: "لا توجد خلفية نشطة لهذا الملف الشخصي لإزالتها.",
      bgDeleted: "تم حذف الخلفية وملفها بنجاح.",
      backgroundUrlLoadError: "فشل تحميل الخلفية من الرابط.",
      backgroundPasteError: "المحتوى الذي تم لصقه ليس ملف خلفية أو رابط صالح.",
      invalidFilename: "اسم الملف غير صالح.",
      filenameExists: (name: string) => `اسم الملف "${name}" موجود مسبقاً.`,
      renameSuccess: (name: string) => `تمت إعادة التسمية إلى "${name}"`,
      renameError: "خطأ أثناء إعادة تسمية الملف.",
      profileDeleted: "تم حذف الملف الشخصي بنجاح.",
      jpgQualitySet: (value: number) => `تم ضبط جودة JPG على ${value}%`,
    },
    tooltips: {
      restoreBuiltin: "استعادة الألوان الأساسية المدمجة",
      editCssProfile: "تعديل تشكيلة CSS",
      pinSnapshot: "تثبيت الألوان الحالية كلقطة",
      pinSnapshotDate: (date: string) =>
        `تم تثبيت الألوان بتاريخ ${date}. انقر لإعادة التثبيت.`,
      resetToPinned: "إعادة التعيين إلى الألوان المثبتة",
      editSnippet: "تعديل القصاصة",
      copySnippetCss: "نسخ كود CSS إلى الحافظة",
      deleteSnippet: "حذف القصاصة",
      setTransparent: "تعيين إلى شفاف",
      undoChange: "تراجع عن آخر تغيير",
      dragReorder: "اسحب لإعادة الترتيب",
      testRule: "تجربة القاعدة بكلمة عشوائية",
      deleteCustomVar: "حذف المتغير المخصص",
      iconizeSettings: "إعدادات Iconize",
      themeLight: "الثيم: فرض الوضع الفاتح (اضغط للتبديل للغامق)",
      themeDark: "الثيم: فرض الوضع الغامق (اضغط للتبديل للتلقائي)",
      themeAuto: "الثيم: تلقائي (يتبع أوبسيديان) (اضغط للتبديل للفاتح)",
      addBg: "إضافة خلفية",
      removeBg: "إزالة الخلفية",
      bgSettings: "إعدادات الخلفية",
      browseBg: "استعراض الخلفيات المخزنة",
      iconizeNotInstalled:
        "الإضافة غير مُثبتة أو مُعطلة. الرجاء تثبيت وتفعيل 'Iconize' لاستخدام هذه الميزة.",
    },
    commands: {
      toggleTheme: "تبديل ثيم الملف الشخصي النشط",
      enableDisable: "تفعيل وتعطيل",
      cycleNext: "الانتقال للبروفايل التالي",
      cyclePrevious: "الانتقال للبروفايل السابق",
      openSettings: "فتح نافذة الإعدادات",
    },
    likeCard: {
      profilesStat: (p: number, s: number) =>
        `ملفّات شخصيّة: ${p} & قصاصات: ${s}`,
      colorsStat: "ألوان قابلة للتخصيص",
      integrationsStat: "تكامل الإضافات",
      daysStat: "أيام الاستخدام",
      starButton: "أضف  ★ على GitHub",
      issueButton: "أبلغ عن مشكلة",
      syncButton: "مزامنة خزنتك",
      telegramButton: "تيليجرام",
    },
    colors: {
      names: {
        // Iconize
        "--iconize-icon-color": "لون أيقونات Iconize",
        // Backgrounds
        "--background-primary": "الخلفية الأساسية",
        "--background-primary-alt": "الخلفية الأساسية (بديل)",
        "--background-secondary": "الخلفية الثانوية",
        "--background-secondary-alt": "الخلفية الثانوية (بديل)",
        "--background-modifier-border": "الإطار",
        "--background-modifier-border-hover": "الإطار (عند التمرير)",
        "--background-modifier-border-focus": "الإطار (عند التحديد)",
        "--background-modifier-flair": "خلفية العناصر الخاصة",
        "--background-modifier-hover": "خلفية (عند التمرير)",
        "--background-modifier-active": "خلفية (عند النقر)",
        // Text
        "--text-normal": "النص العادي",
        "--text-muted": "النص الباهت",
        "--text-faint": "النص الخافت",
        "--text-on-accent": "النص فوق اللون المميز",
        "--text-accent": "النص المميز",
        "--text-accent-hover": "النص المميز (عند التمرير)",
        "--text-selection": "تحديد النص",
        "--checklist-done-color": "عنصر منجز",
        "--tag-color": "نص الوسم (Tag)",
        "--tag-color-hover": "نص الوسم (عند التمرير)",
        "--tag-bg": "خلفية الوسم (Tag)",
        // Headings
        "--h1-color": "لون H1",
        "--h2-color": "لون H2",
        "--h3-color": "لون H3",
        "--h4-color": "لون H4",
        "--h5-color": "لون H5",
        "--h6-color": "لون H6",
        // Markdown
        "--hr-color": "الخط الفاصل",
        "--blockquote-border-color": "إطار الاقتباس",
        "--blockquote-color": "نص الاقتباس",
        "--blockquote-bg": "خلفية الاقتباس",
        "--code-normal": "نص الكود المضمن",
        "--code-background": "خلفية الكود المضمن",
        "--text-highlight-bg": "خلفية النص المظلل",
        // Interactive Elements
        "--interactive-normal": "عنصر تفاعلي",
        "--interactive-hover": "عنصر تفاعلي (عند التمرير)",
        "--interactive-accent": "عنصر تفاعلي مميز",
        "--interactive-accent-hover": "عنصر تفاعلي مميز (عند التمرير)",
        "--interactive-success": "لون النجاح",
        "--interactive-error": "لون الخطأ",
        "--interactive-warning": "لون التحذير",
        // UI Elements
        "--titlebar-background": "خلفية شريط العنوان",
        "--titlebar-background-focused": "خلفية شريط العنوان (محدد)",
        "--titlebar-text-color": "نص شريط العنوان",
        "--sidebar-background": "خلفية الشريط الجانبي",
        "--sidebar-border-color": "إطار الشريط الجانبي",
        "--header-background": "خلفية الترويسة",
        "--header-border-color": "إطار الترويسة",
        "--vault-name-color": "اسم الخزنة (Vault)",
        // Notices
        "--cm-notice-text-default": "لون نص الإشعار الافتراضي",
        "--cm-notice-bg-default": "لون خلفية الإشعار الافتراضي",
        // Graph View
        "--graph-line": "خط الرسم البياني",
        "--graph-node": "عقدة الرسم البياني",
        "--graph-text": "نص الرسم البياني",
        "--graph-node-unresolved": "عقدة (غير موجودة)",
        "--graph-node-focused": "عقدة (محددة)",
        "--graph-node-tag": "عقدة وسم (Tag)",
        "--graph-node-attachment": "عقدة مرفق",
        // Misc
        "--scrollbar-thumb-bg": "مقبض شريط التمرير",
        "--scrollbar-bg": "خلفية شريط التمرير",
        "--divider-color": "الفاصل",
      },
      descriptions: {
        // Iconize
        "--iconize-icon-color":
          "يحدد لون جميع الأيقونات المضافة بواسطة إضافة Iconize. هذا الخيار سيتجاوز إعدادات الألوان الخاصة بالإضافة.",
        // Backgrounds
        "--background-primary":
          "لون الخلفية الأساسي للتطبيق بالكامل، خصوصاً للمحرر وصفحات الملاحظات.",
        "--background-primary-alt":
          "لون خلفية بديل، يستخدم غالباً للسطر النشط في المحرر.",
        "--background-secondary":
          "خلفية ثانوية، تستخدم عادةً للأشرطة الجانبية واللوحات الأخرى.",
        "--background-secondary-alt":
          "خلفية ثانوية بديلة، تستخدم لعناصر مثل الملف النشط في مستكشف الملفات.",
        "--background-modifier-border":
          "لون الإطارات (Borders) على مختلف عناصر الواجهة كالأزرار وحقول الإدخال.",
        "--background-modifier-border-hover":
          "لون الإطار عند مرور مؤشر الفأرة فوق العنصر.",
        "--background-modifier-border-focus":
          "لون الإطار عندما يكون العنصر محدداً، مثل حقل نصي نشط.",
        "--background-modifier-flair":
          "لون خلفية لعناصر واجهة خاصة، مثل حالة 'المزامنة' أو 'الفهرسة'.",
        "--background-modifier-hover":
          "لون خلفية العناصر عند مرور مؤشر الفأرة فوقها (مثل عناصر القوائم).",
        "--background-modifier-active":
          "لون خلفية العنصر عند النقر عليه أو عندما يكون محدداً ونشطاً.",
        // Text
        "--text-normal":
          "لون النص الافتراضي لجميع الملاحظات ومعظم عناصر الواجهة.",
        "--text-muted":
          "لون نص باهت قليلاً، يستخدم للمعلومات الأقل أهمية مثل بيانات الملف.",
        "--text-faint":
          "أكثر لون نص باهت، يستخدم لنصوص الواجهة الخفية جداً أو العناصر المعطلة.",
        "--text-on-accent":
          "لون النص الذي يظهر فوق الخلفيات الملونة (Accent)، مثل نص على زر أساسي.",
        "--text-accent":
          "اللون المميز (Accent) الأساسي للنصوص، يستخدم للروابط وعناصر الواجهة الهامة.",
        "--text-accent-hover":
          "لون النص المميز (مثل الروابط) عند مرور مؤشر الفأرة فوقه.",
        "--text-selection": "لون خلفية النص الذي تحدده بمؤشر الفأرة.",
        "--checklist-done-color":
          "لون علامة الصح والنص لمهمة منجزة في قائمة المهام.",
        "--tag-color": "يحدد لون نص التاغات (#tags).",
        "--tag-color-hover": "يحدد لون نص التاغات عند تمرير الماوس فوقها.",
        "--tag-bg": "يحدد لون خلفية التاغات، مما يسمح بإنشاء شكل 'الحبة'.",
        // Headings
        "--h1-color": "لون نصوص العناوين من نوع H1.",
        "--h2-color": "لون نصوص العناوين من نوع H2.",
        "--h3-color": "لون نصوص العناوين من نوع H3.",
        "--h4-color": "لون نصوص العناوين من نوع H4.",
        "--h5-color": "لون نصوص العناوين من نوع H5.",
        "--h6-color": "لون نصوص العناوين من نوع H6.",
        // Markdown
        "--hr-color": "لون الخط الفاصل الأفقي الذي يتم إنشاؤه باستخدام `---`.",
        "--blockquote-border-color":
          "لون الإطار العمودي الذي يظهر على يسار نص الاقتباس.",
        "--blockquote-color": "لون النص داخل فقرة الاقتباس.",
        "--blockquote-bg": "يحدد لون خلفية عناصر الاقتباس (>) في النص.",
        "--code-normal":
          "يحدد لون النص داخل الكود المضمن (بين علامات الاقتباس المعكوسة).",
        "--code-background": "يحدد لون خلفية الكود المضمن.",
        "--text-highlight-bg": "يحدد لون خلفية النص المظلل (==بهذا الشكل==).",
        // Interactive Elements
        "--interactive-normal": "لون خلفية العناصر التفاعلية مثل الأزرار.",
        "--interactive-hover":
          "لون خلفية العناصر التفاعلية عند مرور الفأرة فوقها.",
        "--interactive-accent":
          "اللون المميز للعناصر التفاعلية الهامة (مثل زر 'إنشاء').",
        "--interactive-accent-hover":
          "اللون المميز للعناصر التفاعلية الهامة عند مرور الفأرة فوقها.",
        "--interactive-success": "لون يدل على عملية ناجحة (مثل الأخضر).",
        "--interactive-error": "لون يدل على حدوث خطأ (مثل الأحمر).",
        "--interactive-warning": "لون يدل على وجود تحذير (مثل الأصفر).",
        // UI Elements
        "--titlebar-background": "لون خلفية شريط العنوان للنافذة الرئيسية.",
        "--titlebar-background-focused":
          "لون خلفية شريط العنوان عندما تكون النافذة نشطة.",
        "--titlebar-text-color": "لون النص في شريط العنوان.",
        "--sidebar-background": "يستهدف بشكل خاص خلفية الأشرطة الجانبية.",
        "--sidebar-border-color": "لون الخط الفاصل بجانب الأشرطة الجانبية.",
        "--header-background":
          "خلفية العناوين داخل اللوحات (مثل عنوان الملاحظة).",
        "--header-border-color": "لون الخط الفاصل تحت عناوين اللوحات.",
        "--vault-name-color":
          "لون اسم القبو (Vault) الخاص بك في الزاوية العلوية.",
        "--cm-notice-text-default":
          "يحدد لون النص الافتراضي لكل الإشعارات، ما لم يتم تجاوزه بقاعدة مخصصة.",
        "--cm-notice-bg-default":
          "يحدد لون الخلفية الافتراضي لكل الإشعارات، ما لم يتم تجاوزه بقاعدة مخصصة.",
        // Graph View
        "--graph-line":
          "لون الخطوط الواصلة بين الملاحظات في عرض الرسم البياني.",
        "--graph-node": "لون النقاط الدائرية للملاحظات الموجودة.",
        "--graph-text":
          "لون النصوص (أسماء الملاحظات) على النقاط في الرسم البياني.",
        "--graph-node-unresolved":
          "لون النقاط الخاصة بالملاحظات التي لم يتم إنشاؤها بعد (روابط غير موجودة).",
        "--graph-node-focused":
          "لون العقدة التي عليها التركيز (عندما تمرر الفأرة عليها أو تحددها).",
        "--graph-node-tag":
          "لون العقد التي تمثل الوسوم (Tags) إذا كانت ظاهرة في الرسم البياني.",
        "--graph-node-attachment":
          "لون العقد التي تمثل المرفقات (مثل الصور أو الملفات الأخرى) في الرسم البياني.",
        // Misc
        "--scrollbar-thumb-bg": "لون الجزء القابل للسحب من شريط التمرير.",
        "--scrollbar-bg": "لون مسار شريط التمرير (الخلفية).",
        "--divider-color":
          "لون الخطوط الفاصلة في واجهة المستخدم، مثل الخطوط بين الإعدادات.",
      },
    },
  },

  fa: {
    plugin: {
      name: "استاد رنگ - v1.1.1",
      ribbonTooltip: "تنظیمات استاد رنگ",
    },
    buttons: {
      new: "جدید",
      delete: "حذف",
      create: "ایجاد",
      reset: "بازنشانی",
      restore: "بازیابی",
      update: "به‌روزرسانی",
      apply: "اعمال",
      cancel: "لغو",
      reload: "بارگذاری مجدد",
      exportFile: "خروجی گرفتن از فایل",
      copyJson: "کپی کردن JSON",
      importCss: "وارد کردن / چسباندن (.css)",
      importJson: "وارد کردن / چسباندن (.json)",
      chooseFile: "انتخاب فایل...",
      import: "وارد کردن",
      select: "انتخاب",
      browse: "مرور...",
      deleteAnyway: "در هر صورت حذف کن",
    },
    settings: {
      enablePlugin: "فعال کردن استاد رنگ",
      enablePluginDesc:
        "این گزینه را برای غیرفعال کردن موقت تمام رنگ‌های سفارشی و بازگشت به تم فعال Obsidian خود خاموش کنید.",
      language: "زبان",
      languageDesc: "زبان رابط کاربری افزونه را تنظیم کنید.",
      languageSettingsModalTitle: "تنظیمات زبان",
      rtlLayoutName: "فعال کردن چیدمان راست به چپ (RTL)",
      rtlLayoutDesc:
        "هنگامی که فعال باشد، رابط کاربری افزونه برای پشتیبانی صحیح از زبان‌های راست به چپ برعکس می‌شود.",
      searchPlaceholder: "جستجوی متغیرها (نام یا مقدار)...",
      regexPlaceholder: "عبارت منظم را وارد کنید و Enter را بزنید...",
      searchResultsFound: (count: number) => `${count} مورد یافت شد`,
      allSections: "همه بخش‌ها",
      clear: "پاک کردن",
      ariaCase: "جستجوی حساس به حروف بزرگ و کوچک",
      ariaRegex: "استفاده از عبارت منظم",
      themeWarningTooltip: (currentTheme: string) =>
        `تم انجمن "${currentTheme}" فعال است که ممکن است با ظاهر پروفایل تداخل داشته باشد. برای بهترین نتیجه، به تم پیش‌فرض Obsidian بروید یا تم "${currentTheme}" را به عنوان یک پروفایل CSS جدید وارد کرده و مستقیماً آن را ویرایش کنید.`,
    },
    profileManager: {
      heading: "مدیریت پروفایل",
      activeProfile: "پروفایل فعال",
      activeProfileDesc: "مدیریت و جابجایی بین پروفایل‌های رنگ.",
      themeType: "نوع تم پروفایل",
      themeTypeDesc:
        "تنظیم کنید که آیا این پروفایل باید هنگام فعال شدن یک تم خاص (تاریک/روشن) را اعمال کند.",
      themeAuto: "تم پیش‌فرض Obsidian",
      themeDark: "اعمال حالت تاریک",
      themeLight: "اعمال حالت روشن",
      tooltipThemeAuto:
        "تم: خودکار (مطابق با Obsidian) (برای تغییر به روشن کلیک کنید)",
      tooltipThemeDark: "تم: اعمال حالت تاریک (برای تغییر به خودکار کلیک کنید)",
      tooltipThemeLight: "تم: اعمال حالت روشن (برای تغییر به تاریک کلیک کنید)",
      tooltipExport: "صادر کردن نمایه (پروفایل) فعلی به صورت فایل JSON",
      tooltipCopyJson: "کپی کردن JSON نمایه فعلی در کلیپ‌بورد",
    },
    options: {
      heading: "تنظیمات پیشرفته",
      liveUpdateName: "فریم در ثانیه به‌روزرسانی زنده",
      liveUpdateDesc:
        "تعداد دفعاتی که رابط کاربری در هر ثانیه پیش‌نمایش تغییرات رنگ را هنگام کشیدن نشان می‌دهد تنظیم می‌کند (0 = غیرفعال کردن پیش‌نمایش زنده). مقادیر کمتر می‌تواند عملکرد را بهبود بخشد.",
      iconizeModalTitle: "تنظیمات ادغام Iconize",
      overrideIconizeName: "نادیده گرفتن رنگ‌های افزونه Iconize",
      overrideIconizeDesc:
        "اجازه دهید استاد رنگ تمام رنگ‌های آیکون‌های افزونه Iconize را کنترل کند. برای بهترین نتایج، تنظیمات رنگ را در خود Iconize غیرفعال کنید.",
      cleanupIntervalName: "فاصله زمانی پاکسازی",
      cleanupIntervalDesc:
        "هر چند ثانیه یکبار افزونه برای پاکسازی آیکون‌های افزونه حذف شده Iconize بررسی می‌کند.",
      addCustomVarName: "افزودن متغیر سفارشی",
      addCustomVarDesc:
        "یک متغیر CSS جدید که در لیست پیش‌فرض نیست اضافه کنید. نام باید با '--' شروع شود.",
      addNewVarButton: "افزودن متغیر جدید...",
      resetPluginName: "بازنشانی تنظیمات افزونه",
      resetPluginDesc:
        "این کار تمام پروفایل‌ها، قطعه کدها، تنظیمات و پس‌زمینه‌ها را حذف می‌کند و افزونه را به حالت اولیه‌اش بازنشانی می‌کند. این عمل نیاز به بارگذاری مجدد برنامه دارد و قابل بازگشت نیست.",
      resetPluginButton: "بازنشانی تمام داده‌ها...",
      backgroundName: "تنظیم پس‌زمینه سفارشی",
      backgroundDesc: "مدیریت تصویر یا ویدئو پس‌زمینه برای این پروفایل.",
      backgroundModalSettingsTitle: "تنظیمات پس‌زمینه",
      backgroundEnableName: "فعال کردن پس‌زمینه",
      backgroundEnableDesc:
        "نمایش یا پنهان کردن پس‌زمینه سفارشی برای این پروفایل را تغییر دهید.",
      convertImagesName: "تبدیل تصاویر به JPG",
      convertImagesDesc:
        "تبدیل خودکار تصاویر PNG، WEBP، یا BMP به JPG هنگام بارگذاری برای کاهش حجم فایل و بهبود عملکرد بارگیری. (توجه: شفافیت از دست خواهد رفت)",
      jpgQualityName: "کیفیت JPG",
      jpgQualityDesc:
        "کیفيت فشرده‌سازی (از 1 تا 100) را تنظیم کنید. مقادیر پایین‌تر به معنای فایل‌های کوچک‌تر اما کیفیت پایین‌تر است.",
      badgeNotInstalled: "نصب نشده",
      videoOpacityName: "شفافیت ویدئو",
      videoOpacityDesc: "کنترل شفافیت پس‌زمینه ویدئو برای خوانایی بهتر.",
      videoMuteName: "بی‌صدا کردن ویدئو",
      videoMuteDesc: "بی‌صدا کردن پس‌زمینه ویدئو. به شدت توصیه می‌شود.",
      settingType: "نوع تنظیمات",
      settingTypeImage: "تصویر",
      settingTypeVideo: "ویدئو",
    },
    snippets: {
      heading: "قطعه کدهای CSS",
      createButton: "ایجاد قطعه کد جدید",
      noSnippetsDesc: "هنوز هیچ قطعه کد CSS برای این پروفایل ایجاد نشده است.",
      globalName: "ذخیره به عنوان قطعه کد سراسری",
      globalDesc: "یک قطعه کد سراسری بر روی تمام پروفایل‌های شما اعمال می‌شود.",
    },
    categories: {
      pluginintegrations: "ادغام با افزونه‌ها",
      backgrounds: "پس‌زمینه‌ها",
      text: "متن",
      interactive: "عناصر تعاملی",
      ui: "عناصر رابط کاربری",
      misc: "متفرقه",
      graph: "نمای گراف",
      markdown: "مارک‌داون",
      notices: "اعلان‌ها",
      custom: "متغیرهای سفارشی",
      customDesc: "متغیر اضافه شده توسط کاربر.",
      helpTextPre: "متغیری که به دنبال آن هستید را پیدا نمی‌کنید؟ ",
      helpTextLink: "لیست رسمی متغیرهای CSS Obsidian را مرور کنید.",
    },
    modals: {
      newProfile: {
        title: "ایجاد پروفایل جدید",
        nameLabel: "نام پروفایل",
        namePlaceholder: "نام پروفایل را وارد کنید...",
      },
      deleteProfile: {
        title: "حذف پروفایل",
        confirmation: (name: string) =>
          `آیا مطمئن هستید که می‌خواهید پروفایل "${name}" را حذف کنید؟ این عمل قابل بازگشت نیست.`,
      },
      restoreProfile: {
        title: (name: string) => `بازیابی پروفایل: ${name}`,
        desc: (name: string) =>
          `آیا مطمئن هستید که می‌خواهید "${name}" را به رنگ‌های اصلی خود بازگردانید؟ تمام سفارشی‌سازی‌های شما برای این پروفایل از بین خواهد رفت.`,
      },
      jsonImport: {
        title: "چسباندن یا وارد کردن JSON پروفایل",
        desc1: "می‌توانید یک JSON پروفایل را در کادر زیر بچسبانید.",
        placeholder: '{ "name": "...", "profile": { ... } }',
        settingName: "وارد کردن از فایل",
        settingDesc:
          "یا، یک فایل پروفایل (.json) را از کامپیوتر خود انتخاب کنید.",
        replaceActiveButton: "جایگزینی فعال",
        createNewButton: "ایجاد جدید",
      },
      cssImport: {
        title: "وارد کردن / چسباندن CSS و ایجاد پروفایل",
        titleEdit: "ویرایش پروفایل CSS",
        note: "توجه: CSS چسبانده شده می‌تواند بر رابط کاربری تأثیر بگذارد، فقط با CSS معتبر ادامه دهید.",
        importFromFile: "وارد کردن از فایل",
        importFromFileDesc:
          "یا، یک فایل (.css) را از کامپیوتر خود انتخاب کنید.",
        importFromTheme: "وارد کردن از تم نصب شده",
        importFromThemeDesc:
          "به سرعت CSS را از یکی از تم‌های نصب شده خود بارگیری کنید.",
        noThemes: "هیچ تمی نصب نشده است",
      },
      snippetEditor: {
        title: "ایجاد قطعه کد CSS جدید",
        titleEdit: "ویرایش قطعه کد CSS",
        nameLabel: "نام قطعه کد",
        namePlaceholder: "نام قطعه کد را وارد کنید...",
        importFromSnippet: "وارد کردن از قطعه کد نصب شده",
        importFromSnippetDesc:
          "به سرعت CSS را از یکی از قطعه کدهای نصب شده Obsidian خود بارگیری کنید.",
        noSnippets: "هیچ قطعه کدی نصب نشده است",
        cssPlaceholder: "کد CSS خود را اینجا جایگذاری کنید...",
      },
      confirmation: {
        resetProfileTitle: "تأیید بازنشانی پروفایل",
        resetProfileDesc:
          "آیا مطمئن هستید که می‌خواهید این پروفایل را به آخرین عکس فوری پین شده بازنشانی کنید؟ این کار رنگ‌های فعلی شما را بازنویسی می‌کند و قابل بازگشت نیست.",
        deleteSnippetTitle: (name: string) => `حذف قطعه کد: ${name}`,
        deleteSnippetDesc:
          "آیا مطمئن هستید که می‌خواهید این قطعه کد را حذف کنید؟ این عمل قابل بازگشت نیست.",
        resetPluginTitle: "آیا مطمئن هستید؟",
        resetPluginDesc:
          "این کار تمام داده‌های Color Master شما (پروفایل‌ها، قطعه کدها، تنظیمات و پس‌زمینه‌ها) را برای همیشه حذف می‌کند. این غیرقابل برگشت است.",
        deleteGlobalBgTitle: "تأیید حذف پس‌زمینه",
        deleteGlobalBgDesc:
          "آیا مطمئن هستید که می‌خواهید این پس‌زمینه را برای همیشه حذف کنید؟ پروفایل‌های زیر از آن استفاده می‌کنند و بازنشانی خواهند شد:",
        deleteBackgroundTitle: "حذف پس‌زمینه؟",
        deleteBackgroundDesc: (
          name: string
        ) => `آیا مطمئن هستید که می‌خواهید '${name}' را برای همیشه حذف کنید؟`,
      },
      noticeRules: {
        titleText: "قوانین پیشرفته رنگ متن",
        titleBg: "قوانین پیشرفته رنگ پس‌زمینه",
        desc: "قوانین اولویت‌بندی شده برای رنگ‌آمیزی اعلان‌ها بر اساس محتوای آنها ایجاد کنید. اولین قانون منطبق از بالا به پایین اعمال خواهد شد.",
        addNewRule: "افزودن قانون جدید",
        keywordPlaceholder: "یک کلمه کلیدی تایپ کنید و فاصله را فشار دهید...",
        useRegex: "عبارت منظم",
      },
      duplicateProfile: {
        title: "نام پروفایل تکراری",
        descParts: [
          `نام پروفایل "`,
          `" از قبل وجود دارد. لطفاً نام دیگری انتخاب کنید.`,
        ],
        placeholder: "نام پروفایل جدید را وارد کنید...",
      },
      customVar: {
        title: "افزودن متغیر جدید CSS سفارشی",
        desc: "یک متغیر CSS جدید تعریف کنید (مانند --my-color: #f00). این متغیر به پروفایل فعال شما اضافه خواهد شد.",
        displayName: "نام نمایشی",
        displayNameDesc:
          "یک نام دوستانه برای متغیر شما (مانند 'رنگ اصلی سفارشی من').",
        displayNamePlaceholder: "مثال: رنگ اصلی من",
        varName: "نام متغیر",
        varNameDesc:
          "نام واقعی متغیر CSS. باید با '--' شروع شود (مانند '--my-primary-color').",
        varNamePlaceholder: "مثال: --my-primary-color",
        varValue: "مقدار متغیر",
        varType: "نوع متغیر",
        varTypeDesc: "نوع داده‌ای که این متغیر نگهداری می‌کند را انتخاب کنید.",
        types: {
          color: "رنگ",
          size: "اندازه (مانند px, em)",
          text: "متن",
          number: "عدد",
        },
        varValueDesc:
          "مقدار متغیر CSS (مانند 'red', '#ff0000', 'rgb(255,0,0)').",
        varValuePlaceholder: "مثال: #FF0000 یا قرمز",
        description: "توضیحات (اختیاری)",
        descriptionDesc: "توضیح مختصری در مورد آنچه این متغیر کنترل می‌کند.",
        descriptionPlaceholder: "مثال: رنگ اصلی برای عناوین",
        addVarButton: "افزودن",
        textValuePlaceholder: "مقدار متنی را وارد کنید...",
      },
      addBackground: {
        title: "افزودن پس‌زمینه جدید (تصویر/ویدئو)",
        importFromFile: "وارد کردن از فایل",
        importFromFileDesc: "وارد کردن یک فایل تصویر یا ویدئو از کامپیوتر شما.",
        pasteBoxPlaceholder:
          "پس‌زمینه یا URL را بکشید و رها کنید / یا اینجا بچسبانید (Ctrl+V)",
        dropToAdd: "برای افزودن پس‌زمینه رها کنید...",
        processing: "در حال پردازش",
      },
      fileConflict: {
        title: "فایل موجود است",
        desc: (name: string) =>
          `فایلی با نام '${name}' قبلاً در پوشه پس‌زمینه‌های شما وجود دارد. چه کاری می‌خواهید انجام دهید؟`,
        replaceButton: "جایگزینی فایل",
        keepButton: "نگه داشتن هر دو (تغییر نام)",
      },
      backgroundBrowser: {
        title: "مرورگر پس‌زمینه‌ها",
        noImages: "هیچ تصویر یا ویدئویی در پوشه پس‌زمینه‌های شما یافت نشد.",
      },
    },
    notices: {
      pluginEnabled: "استاد رنگ فعال شد",
      pluginDisabled: "استاد رنگ غیرفعال شد",
      profilePinned: "رنگ‌های پروفایل با موفقیت پین شدند!",
      profileReset: "پروفایل به عکس فوری پین شده بازنشانی شد.",
      noPinnedSnapshot: "هیچ عکس فوری پین شده‌ای برای این پروفایل یافت نشد.",
      profileNotFound: "پروفایل فعال یافت نشد.",
      noProfilesFound: "هیچ پروفایلی یافت نشد.",
      activeProfileSwitched: (name: string) => `پروفایل فعال: ${name}`,
      cannotFindOriginalProfile: "داده‌های اصلی برای این پروفایل یافت نشد.",
      profileRestored: (name: string) =>
        `پروفایل "${name}" به حالت پیش‌فرض خود بازگردانده شد.`,
      graphColorsApplied: "رنگ‌های گراف اعمال شد!",
      invalidJson: "JSON نامعتبر است.",
      jsonMustHaveName:
        "JSON وارد شده برای ایجاد پروفایل جدید باید دارای ویژگی 'name' باشد.",
      profileCreatedSuccess: (name: string) =>
        `پروفایل "${name}" با موفقیت ایجاد شد.`,
      profileImportedSuccess: (mode: string) => `پروفایل با موفقیت ${mode} شد.`,
      noActiveProfileToCopy: "هیچ پروفایل فعالی برای کپی وجود ندارد.",
      noActiveProfileToExport: "هیچ پروفایل فعالی برای خروجی گرفتن وجود ندارد.",
      snippetCssCopied: "CSS قطعه کد در کلیپ‌بورد کپی شد!",
      snippetEmpty: "این قطعه کد خالی است.",
      cssContentEmpty: "محتوای CSS نمی‌تواند خالی باشد.",
      snippetNameExists: (name: string) =>
        `نام قطعه کد "${name}" از قبل وجود دارد.`,
      profileNameExists: (name: string) =>
        `نام پروفایل "${name}" از قبل وجود دارد.`,
      profileUpdated: (name: string) => `پروفایل "${name}" به‌روزرسانی شد.`,
      snippetUpdated: (name: string) => `قطعه کد "${name}" به‌روزرسانی شد.`,
      snippetCreated: (name: string) => `قطعه کد "${name}" با موفقیت ایجاد شد!`,
      snippetScopeMove:
        "برای جابجایی قطعه کد بین بخش‌ها از پنجره ویرایش استفاده کنید.",
      profileCreatedFromCss: (name: string) =>
        `پروفایل "${name}" با موفقیت ایجاد شد!`,
      noColorHistory: "هیچ تاریخچه رنگی برای بازیابی وجود ندارد.",
      colorRestored: (color: string) => `بازیابی شد: ${color}`,
      textboxEmpty:
        "کادر متنی خالی است. ابتدا مقداری JSON بچسبانید یا یک فایل وارد کنید.",
      fileLoaded: (fileName: string) =>
        `فایل "${fileName}" در ناحیه متنی بارگذاری شد.`,
      exportSuccess: "پروفایل با موفقیت خروجی گرفته شد!",
      jsonCopied: "JSON نمایه با موفقیت در کلیپ‌بورد کپی شد!",
      resetSuccess:
        "داده‌های استاد رنگ حذف شد. لطفاً برای اعمال تغییرات Obsidian را مجدداً بارگذاری کنید.",
      fpsUpdated: (value: number) =>
        `فریم در ثانیه به‌روزرسانی زنده روی ${value} تنظیم شد`,
      invalidProfileObject: "JSON به نظر نمی‌رسد یک شی پروفایل معتبر باشد.",
      profileCreated: (name: string) => `پروفایل "${name}" با موفقیت ایجاد شد!`,
      settingsSaved: "تنظیمات با موفقیت اعمال شد!",
      testSentence: (word: string) =>
        `رنگ اعلان برای "${word}" به این شکل است:`,
      varNameEmpty: "نام متغیر نمی‌تواند خالی باشد.",
      varNameFormat: "نام متغیر باید با '--' شروع شود.",
      varExists: (name: string) => `متغیر "${name}" از قبل وجود دارد.`,
      varAdded: (name: string) => `متغیر "${name}" با موفقیت اضافه شد.`,
      iconizeNotFound:
        "افزونه Iconize یافت نشد. لطفاً برای استفاده از این ویژگی آن را نصب و فعال کنید.",
      themeCssLoaded: (theme: string) =>
        `CSS با موفقیت از تم "${theme}" بارگیری شد.`,
      themeReadFailed: (theme: string) =>
        `فایل تم "${theme}" خوانده نشد. ممکن است فایل محافظت شده یا موجود نباشد.`,
      snippetLoaded: (snippet: string) =>
        `CSS با موفقیت از قطعه کد "${snippet}" بارگیری شد.`,
      snippetReadFailed: (snippet: string) =>
        `فایل قطعه کد "${snippet}" خوانده نشد.`,
      themeSwitchedLight: "به حالت روشن تغییر کرد",
      themeSwitchedDark: "به حالت تاریک تغییر کرد",
      themeSwitchedAuto: "به حالت خودکار تغییر کرد",
      bgSet: "پس‌زمینه با موفقیت تنظیم شد.",
      bgRemoved: "پس‌زمینه حذف شد.",
      backgroundLoadError: "بارگیری پس‌زمینه ناموفق بود.",
      noBgToRemove: "هیچ پس‌زمینه فعالی برای حذف در این نمایه وجود ندارد.",
      bgDeleted: "پس‌زمینه و فایل آن حذف شدند.",
      backgroundUrlLoadError: "دانلود پس‌زمینه از URL ناموفق بود.",
      backgroundPasteError:
        "محتوای چسبانده شده یک فایل پس‌زمینه یا URL معتبر نیست.",
      invalidFilename: "نام فایل نامعتبر است.",
      filenameExists: (name: string) => `نام فایل "${name}" از قبل وجود دارد.`,
      renameSuccess: (name: string) => `تغییر نام به "${name}"`,
      renameError: "خطا در تغییر نام فایل.",
      profileDeleted: "پروفایل با موفقیت حذف شد.",
      jpgQualitySet: (value: number) => `کیفیت JPG روی ${value}% تنظیم شد`,
    },
    tooltips: {
      restoreBuiltin: "بازیابی به رنگ‌های اصلی داخلی",
      editCssProfile: "ویرایش پروفایل CSS",
      pinSnapshot: "پین کردن رنگ‌های فعلی به عنوان یک عکس فوری",
      pinSnapshotDate: (date: string) =>
        `رنگ‌ها در تاریخ ${date} پین شدند. برای پین مجدد کلیک کنید.`,
      resetToPinned: "بازنشانی به رنگ‌های پین شده",
      editSnippet: "ویرایش قطعه کد",
      copySnippetCss: "کپی کردن CSS در کلیپ‌بورد",
      deleteSnippet: "حذف قطعه کد",
      setTransparent: "تنظیم به شفاف",
      undoChange: "لغو آخرین تغییر",
      dragReorder: "برای ترتیب مجدد بکشید",
      testRule: "این قانون را با یک کلمه کلیدی تصادفی آزمایش کنید",
      deleteCustomVar: "حذف متغیر سفارشی",
      iconizeSettings: "تنظیمات Iconize",
      themeLight: "تم: اعمال حالت روشن (برای تغییر به تاریک کلیک کنید)",
      themeDark: "تم: اعمال حالت تاریک (برای تغییر به خودکار کلیک کنید)",
      themeAuto:
        "تم: خودکار (مطابق با Obsidian) (برای تغییر به روشن کلیک کنید)",
      addBg: "اضافه کردن پس‌زمینه",
      removeBg: "حذف پس‌زمینه",
      bgSettings: "تنظیمات پس‌زمینه",
      browseBg: "مرور پس‌زمینه‌های ذخیره شده",
      iconizeNotInstalled:
        "افزونه نصب نشده یا غیرفعال است. لطفاً 'Iconize' را نصب و فعال کنید تا از این ویژگی استفاده کنید.",
    },
    commands: {
      toggleTheme: "تغییر تم پروفایل فعال",
      enableDisable: "فعال/غیرفعال کردن",
      cycleNext: "رفتن به پروفایل بعدی",
      cyclePrevious: "رفتن به پروفایل قبلی",
      openSettings: "باز کردن تنظیمات",
    },
    likeCard: {
      profilesStat: (p: number, s: number) =>
        `پروفایل‌ها: ${p} و قطعه کدها: ${s}`,
      colorsStat: "رنگ‌های قابل تنظیم",
      integrationsStat: "ادغام با افزونه‌ها",
      daysStat: "روزهای استفاده",
      starButton: "ستاره در گیت‌هاب",
      issueButton: "گزارش مشکل",
      syncButton: "همگام‌سازی صندوق شما",
      telegramButton: "تلگرام",
    },
    colors: {
      names: {
        // Iconize
        "--iconize-icon-color": "رنگ آیکون Iconize",
        // Backgrounds
        "--background-primary": "پس‌زمینه اصلی",
        "--background-primary-alt": "پس‌زمینه اصلی (جایگزین)",
        "--background-secondary": "پس‌زمینه ثانویه",
        "--background-secondary-alt": "پس‌زمینه ثانویه (جایگزین)",
        "--background-modifier-border": "کادر",
        "--background-modifier-border-hover": "کادر (هاور)",
        "--background-modifier-border-focus": "کادر (فوکوس)",
        "--background-modifier-flair": "پس‌زمینه Flair",
        "--background-modifier-hover": "پس‌زمینه (هاور)",
        "--background-modifier-active": "پس‌زمینه (فعال)",
        // Text
        "--text-normal": "متن عادی",
        "--text-muted": "متن کم‌رنگ",
        "--text-faint": "متن بسیار کم‌رنگ",
        "--text-on-accent": "متن روی رنگ تأکیدی",
        "--text-accent": "متن تأکیدی",
        "--text-accent-hover": "متن تأکیدی (هاور)",
        "--text-selection": "انتخاب متن",
        "--checklist-done-color": "چک‌لیست انجام‌شده",
        "--tag-color": "متن تگ",
        "--tag-color-hover": "متن تگ (هاور)",
        "--tag-bg": "پس‌زمینه تگ",
        // Headings
        "--h1-color": "رنگ H1",
        "--h2-color": "رنگ H2",
        "--h3-color": "رنگ H3",
        "--h4-color": "رنگ H4",
        "--h5-color": "رنگ H5",
        "--h6-color": "رنگ H6",
        // Markdown
        "--hr-color": "خط افقی",
        "--blockquote-border-color": "کادر نقل‌قول",
        "--blockquote-color": "متن نقل‌قول",
        "--blockquote-bg": "پس‌زمینه نقل‌قول",
        "--code-normal": "متن کد درون‌خطی",
        "--code-background": "پس‌زمینه کد درون‌خطی",
        "--text-highlight-bg": "پس‌زمینه متن هایلایت‌شده",
        // Interactive Elements
        "--interactive-normal": "تعاملی عادی",
        "--interactive-hover": "تعاملی (هاور)",
        "--interactive-accent": "تعاملی تأکیدی",
        "--interactive-accent-hover": "تعاملی تأکیدی (هاور)",
        "--interactive-success": "رنگ موفقیت",
        "--interactive-error": "رنگ خطا",
        "--interactive-warning": "رنگ هشدار",
        // UI Elements
        "--titlebar-background": "پس‌زمینه نوار عنوان",
        "--titlebar-background-focused": "پس‌زمینه نوار عنوان (فوکوس)",
        "--titlebar-text-color": "متن نوار عنوان",
        "--sidebar-background": "پس‌زمینه نوار کناری",
        "--sidebar-border-color": "کادر نوار کناری",
        "--header-background": "پس‌زمینه سربرگ",
        "--header-border-color": "کادر سربرگ",
        "--vault-name-color": "نام والت",
        // Notices
        "--cm-notice-text-default": "متن پیش‌فرض اعلان",
        "--cm-notice-bg-default": "پس‌زمینه پیش‌فرض اعلان",
        // Graph View
        "--graph-line": "خط گراف",
        "--graph-node": "گره گراف",
        "--graph-text": "متن گراف",
        "--graph-node-unresolved": "گره حل‌نشده",
        "--graph-node-focused": "گره در فوکوس",
        "--graph-node-tag": "گره تگ",
        "--graph-node-attachment": "گره پیوست",
        // Misc
        "--scrollbar-thumb-bg": "شستی اسکرول‌بار",
        "--scrollbar-bg": "پس‌زمینه اسکرول‌بار",
        "--divider-color": "جداکننده",
      },
      descriptions: {
        // Iconize
        "--iconize-icon-color":
          "رنگ تمام آیکون‌های اضافه‌شده توسط افزونه Iconize را تنظیم می‌کند. این تنظیمات رنگ خود Iconize را نادیده می‌گیرد.",
        // Backgrounds
        "--background-primary":
          "رنگ پس‌زمینه اصلی برای کل برنامه، به‌ویژه برای ویرایشگر و پنل‌های یادداشت.",
        "--background-primary-alt":
          "یک رنگ پس‌زمینه جایگزین، که اغلب برای خط فعال در ویرایشگر استفاده می‌شود.",
        "--background-secondary":
          "پس‌زمینه ثانویه، معمولاً برای نوارهای کناری و سایر پنل‌های رابط کاربری استفاده می‌شود.",
        "--background-secondary-alt":
          "یک پس‌زمینه ثانویه جایگزین، که برای فایل فعال در کاوشگر فایل استفاده می‌شود.",
        "--background-modifier-border":
          "رنگ کادرها در عناصر مختلف رابط کاربری مانند دکمه‌ها و ورودی‌ها.",
        "--background-modifier-border-hover":
          "رنگ کادر هنگام بردن ماوس روی یک عنصر.",
        "--background-modifier-border-focus":
          "رنگ کادر برای یک عنصر در حالت فوکوس، مانند یک فیلد متنی انتخاب‌شده.",
        "--background-modifier-flair":
          "رنگ پس‌زمینه برای عناصر ویژه رابط کاربری، مانند وضعیت 'در حال همگام‌سازی' یا 'در حال نمایه‌سازی'.",
        "--background-modifier-hover":
          "رنگ پس‌زمینه عناصر هنگام بردن ماوس روی آنها (مثلاً، موارد لیست).",
        "--background-modifier-active":
          "رنگ پس‌زمینه یک عنصر هنگامی که فعالانه کلیک می‌شود یا انتخاب شده است.",
        // Text
        "--text-normal":
          "رنگ متن پیش‌فرض برای تمام یادداشت‌ها و بیشتر بخش‌های رابط کاربری.",
        "--text-muted":
          "یک رنگ متن کمی کم‌رنگ‌تر، برای اطلاعات کم‌اهمیت‌تر مانند فراداده فایل استفاده می‌شود.",
        "--text-faint":
          "کم‌رنگ‌ترین رنگ متن، برای متن‌های بسیار ظریف رابط کاربری یا عناصر غیرفعال.",
        "--text-on-accent":
          "رنگ متنی که روی پس‌زمینه‌های تأکیدی ظاهر می‌شود (مانند روی یک دکمه اصلی).",
        "--text-accent":
          "رنگ تأکیدی اصلی برای متن، برای پیوندها و عناصر برجسته رابط کاربری استفاده می‌شود.",
        "--text-accent-hover":
          "رنگ متن تأکیدی (مانند پیوندها) هنگام بردن ماوس روی آن.",
        "--text-selection":
          "رنگ پس‌زمینه متنی که با مکان‌نمای خود انتخاب کرده‌اید.",
        "--checklist-done-color":
          "رنگ علامت تیک و متن برای یک مورد انجام‌شده در فهرست کارها.",
        "--tag-color": "رنگ متن #تگ‌ها را تنظیم می‌کند.",
        "--tag-color-hover": "رنگ متن #تگ‌ها را هنگام هاور کردن تنظیم می‌کند.",
        "--tag-bg":
          "رنگ پس‌زمینه #تگ‌ها را تنظیم می‌کند، که امکان ایجاد شکل 'قرص' را فراهم می‌کند.",
        // Headings
        "--h1-color": "رنگ متن عنوان‌های H1.",
        "--h2-color": "رنگ متن عنوان‌های H2.",
        "--h3-color": "رنگ متن عنوان‌های H3.",
        "--h4-color": "رنگ متن عنوان‌های H4.",
        "--h5-color": "رنگ متن عنوان‌های H5.",
        "--h6-color": "رنگ متن عنوان‌های H6.",
        // Markdown
        "--hr-color": "رنگ خط افقی که با `---` ایجاد می‌شود.",
        "--blockquote-border-color": "رنگ کادر عمودی در سمت چپ یک نقل‌قول.",
        "--blockquote-color": "رنگ متن برای محتوای داخل یک نقل‌قول.",
        "--blockquote-bg": "رنگ پس‌زمینه عناصر نقل‌قول (>) را تنظیم می‌کند.",
        "--code-normal":
          "رنگ متن داخل کد درون‌خطی (بین بک‌تیک‌ها) را تنظیم می‌کند.",
        "--code-background":
          "رنگ پس‌زمینه برای بلوک‌های کد درون‌خطی را تنظیم می‌کند.",
        "--text-highlight-bg":
          "رنگ پس‌زمینه برای متن هایلایت‌شده (==مانند این==) را تنظیم می‌کند.",
        // Interactive Elements
        "--interactive-normal": "رنگ پس‌زمینه برای عناصر تعاملی مانند دکمه‌ها.",
        "--interactive-hover": "رنگ پس‌زمینه برای عناصر تعاملی هنگام هاور.",
        "--interactive-accent":
          "رنگ تأکیدی برای عناصر تعاملی مهم (مثلاً، دکمه 'ایجاد').",
        "--interactive-accent-hover":
          "رنگ تأکیدی برای عناصر تعاملی مهم هنگام هاور.",
        "--interactive-success": "رنگ نشان‌دهنده یک عملیات موفق (مثلاً، سبز).",
        "--interactive-error": "رنگ نشان‌دهنده یک خطا (مثلاً، قرمز).",
        "--interactive-warning": "رنگ نشان‌دهنده یک هشدار (مثلاً، زرد).",
        // UI Elements
        "--titlebar-background": "رنگ پس‌زمینه نوار عنوان پنجره اصلی.",
        "--titlebar-background-focused":
          "رنگ پس‌زمینه نوار عنوان زمانی که پنجره فعال است.",
        "--titlebar-text-color": "رنگ متن در نوار عنوان.",
        "--sidebar-background":
          "به‌طور خاص پس‌زمینه نوارهای کناری را هدف قرار می‌دهد.",
        "--sidebar-border-color": "رنگ کادر کنار نوارهای کناری.",
        "--header-background":
          "پس‌زمینه برای سربرگ‌ها در داخل پنل‌ها (مثلاً، سربرگ عنوان یادداشت).",
        "--header-border-color": "رنگ کادر زیر سربرگ‌های پنل.",
        "--vault-name-color": "رنگ نام والت شما در گوشه بالا سمت چپ.",
        "--cm-notice-text-default":
          "رنگ متن پیش‌فرض برای تمام اعلان‌ها را تنظیم می‌کند، مگر اینکه توسط یک قانون بازنویسی شود.",
        "--cm-notice-bg-default":
          "رنگ پس‌زمینه پیش‌فرض برای تمام اعلان‌ها را تنظیم می‌کند، مگر اینکه توسط یک قانون بازنویسی شود.",
        // Graph View
        "--graph-line": "رنگ خطوط اتصال بین یادداشت‌ها در نمای گراف.",
        "--graph-node": "رنگ گره‌های دایره‌ای برای یادداشت‌های موجود.",
        "--graph-text": "رنگ برچسب‌های متنی روی گره‌های گراف.",
        "--graph-node-unresolved":
          "رنگ گره‌ها برای یادداشت‌هایی که هنوز وجود ندارند (پیوندهای حل‌نشده).",
        "--graph-node-focused":
          "رنگ گره‌ای که در حالت فوکوس یا هاور است (گره برجسته‌شده).",
        "--graph-node-tag":
          "رنگ گره‌های نماینده تگ‌ها زمانی که تگ‌ها در گراف نمایش داده می‌شوند.",
        "--graph-node-attachment":
          "رنگ گره‌های نماینده پیوست‌ها (مثلاً، تصویر یا فایل‌های پیوند داده شده دیگر).",
        // Misc
        "--scrollbar-thumb-bg": "رنگ قسمت قابل کشیدن اسکرول‌بار.",
        "--scrollbar-bg": "رنگ مسیر اسکرول‌بار (پس‌زمینه).",
        "--divider-color":
          "رنگ برای خطوط جداکننده عمومی رابط کاربری، مانند کادرهای بین تنظیمات.",
      },
    },
  },

  fr: {
    plugin: {
      name: "Maître des Couleurs - v1.1.1",
      ribbonTooltip: "Paramètres de Color Master",
    },
    buttons: {
      new: "Nouveau",
      delete: "Supprimer",
      create: "Créer",
      reset: "Réinitialiser",
      restore: "Restaurer",
      update: "Mettre à jour",
      apply: "Appliquer",
      cancel: "Annuler",
      reload: "Recharger",
      exportFile: "Exporter le fichier",
      copyJson: "Copier JSON",
      importCss: "Importer / Coller (.css)",
      importJson: "Importer / Coller (.json)",
      chooseFile: "Choisir un fichier...",
      import: "Importer",
      select: "Sélectionner",
      browse: "Parcourir...",
      deleteAnyway: "Supprimer quand même",
    },
    settings: {
      enablePlugin: "Activer Maître des Couleurs",
      enablePluginDesc:
        "Désactivez cette option pour désactiver temporairement toutes les couleurs personnalisées et revenir à votre thème Obsidian actif.",
      language: "Langue",
      languageDesc: "Définissez la langue de l'interface pour le plugin.",
      languageSettingsModalTitle: "Paramètres de langue",
      rtlLayoutName: "Activer la disposition de droite à gauche (RTL)",
      rtlLayoutDesc:
        "Lorsque cette option est activée, l'interface du plugin est inversée pour prendre en charge correctement les langues écrites de droite à gauche.",
      searchPlaceholder: "Rechercher des variables (nom ou valeur)...",
      regexPlaceholder: "Entrez Regex et appuyez sur Entrée...",
      searchResultsFound: (count: number) => `${count} trouvé(s)`,
      allSections: "Toutes les sections",
      clear: "Effacer",
      ariaCase: "Recherche sensible à la casse",
      ariaRegex: "Utiliser une expression régulière",
      themeWarningTooltip: (currentTheme: string) =>
        `Le thème communautaire "${currentTheme}" est actif, ce qui peut interférer avec l'apparence du profil. Pour de meilleurs résultats, passez au thème par défaut d'Obsidian, ou importez "${currentTheme}" comme un nouveau profil CSS pour le personnaliser directement.`,
    },
    profileManager: {
      heading: "Gestionnaire de Profils",
      activeProfile: "Profil Actif",
      activeProfileDesc: "Gérez et basculez entre les profils de couleurs.",
      themeType: "Type de thème du profil",
      themeTypeDesc:
        "Définissez si ce profil doit forcer un thème spécifique (Sombre/Clair) lors de son activation.",
      themeAuto: "Thème par défaut d'Obsidian",
      themeDark: "Forcer le mode sombre",
      themeLight: "Forcer le mode clair",
      tooltipThemeAuto:
        "Thème : Auto (Suit Obsidian) (Cliquer pour passer au Clair)",
      tooltipThemeDark:
        "Thème : Forcer le mode Sombre (Cliquer pour passer en Auto)",
      tooltipThemeLight:
        "Thème : Forcer le mode Clair (Cliquer pour passer au Sombre)",
      tooltipExport: "Exporter le profil actuel en tant que fichier JSON",
      tooltipCopyJson: "Copier le JSON du profil actuel dans le presse-papiers",
    },
    options: {
      heading: "Paramètres avancés",
      liveUpdateName: "FPS de la mise à jour en direct",
      liveUpdateDesc:
        "Définit le nombre de fois par seconde où l'interface prévisualise les changements de couleur lors du glissement (0 = désactiver l'aperçu en direct). Des valeurs plus basses peuvent améliorer les performances.",
      iconizeModalTitle: "Paramètres d'intégration d'Iconize",
      overrideIconizeName: "Outrepasser les couleurs du plugin Iconize",
      overrideIconizeDesc:
        "Laissez Maître des Couleurs contrôler toutes les couleurs d'icônes du plugin Iconize. Pour de meilleurs résultats, désactivez les paramètres de couleur dans Iconize lui-même.",
      cleanupIntervalName: "Intervalle de nettoyage",
      cleanupIntervalDesc:
        "Définit la fréquence (en secondes) à laquelle le plugin recherche un plugin Iconize désinstallé pour nettoyer ses icônes.",
      addCustomVarName: "Ajouter une variable personnalisée",
      addCustomVarDesc:
        "Ajoutez une nouvelle variable CSS qui n'est pas dans la liste par défaut. Le nom doit commencer par '--'.",
      addNewVarButton: "Ajouter une nouvelle variable...",
      resetPluginName: "Réinitialiser les paramètres du plugin",
      resetPluginDesc:
        "Cette action supprimera tous les profils, extraits, paramètres et arrière-plans, réinitialisant ainsi l'extension à son état d'origine. Cette action nécessite un rechargement de l'application et est irréversible.",
      resetPluginButton: "Réinitialiser toutes les données...",
      backgroundName: "Définir un arrière-plan personnalisé",
      backgroundDesc:
        "Gérer l'image ou la vidéo d'arrière-plan pour ce profil.",
      backgroundModalSettingsTitle: "Paramètres d'arrière-plan",
      backgroundEnableName: "Activer l'arrière-plan",
      backgroundEnableDesc:
        "Activer/désactiver la visibilité de l'arrière-plan personnalisé pour ce profil.",
      convertImagesName: "Convertir les images en JPG",
      convertImagesDesc:
        "Convertir automatiquement les images PNG, WEBP ou BMP en JPG lors du téléversement pour réduire la taille du fichier et améliorer les performances de chargement. (Note : La transparence sera perdue)",
      jpgQualityName: "Qualité JPG",
      jpgQualityDesc:
        "Définissez la qualité de compression (1-100). Des valeurs plus basses signifient des fichiers plus petits mais une qualité inférieure.",
      badgeNotInstalled: "Non installé",
      videoOpacityName: "Opacité de la vidéo",
      videoOpacityDesc:
        "Contrôle la transparence de la vidéo d'arrière-plan pour une meilleure lisibilité.",
      videoMuteName: "Désactiver le son",
      videoMuteDesc:
        "Désactive le son de la vidéo d'arrière-plan. Fortement recommandé.",
      settingType: "Type de paramètre",
      settingTypeImage: "Image",
      settingTypeVideo: "Vidéo",
    },
    snippets: {
      heading: "Extraits CSS",
      createButton: "Créer un nouvel extrait",
      noSnippetsDesc: "Aucun extrait CSS n'a encore été créé pour ce profil.",
      globalName: "Enregistrer comme extrait global",
      globalDesc: "Un extrait global est appliqué à tous vos profils.",
    },
    categories: {
      pluginintegrations: "Intégrations de plugins",
      backgrounds: "Arrière-plans",
      text: "Texte",
      interactive: "Éléments Interactifs",
      ui: "Éléments d'Interface",
      misc: "Divers",
      graph: "Vue Graphique",
      markdown: "Markdown",
      notices: "Notifications",
      custom: "Variables personnalisées",
      customDesc: "Variable ajoutée par l'utilisateur.",
      helpTextPre: "Vous ne trouvez pas la variable que vous cherchez ? ",
      helpTextLink:
        "Parcourez la liste officielle des variables CSS d'Obsidian.",
    },
    modals: {
      newProfile: {
        title: "Créer un nouveau profil",
        nameLabel: "Nom du profil",
        namePlaceholder: "Entrez le nom du profil...",
      },
      deleteProfile: {
        title: "Supprimer le profil",
        confirmation: (name: string) =>
          `Êtes-vous sûr de vouloir supprimer le profil "${name}" ? Cette action est irréversible.`,
      },
      restoreProfile: {
        title: (name: string) => `Restaurer le profil : ${name}`,
        desc: (name: string) =>
          `Êtes-vous sûr de vouloir restaurer "${name}" à ses couleurs d'origine ? Toutes vos personnalisations pour ce profil seront perdues.`,
      },
      jsonImport: {
        title: "Coller ou Importer le JSON du Profil",
        desc1: "Vous pouvez coller un JSON de profil dans la case ci-dessous.",
        placeholder: '{ "name": "...", "profile": { ... } }',
        settingName: "Importer depuis un fichier",
        settingDesc:
          "Ou, sélectionnez un fichier de profil (.json) depuis votre ordinateur.",
        replaceActiveButton: "Remplacer l'actuel",
        createNewButton: "Créer un nouveau",
      },
      cssImport: {
        title: "Importer / Coller du CSS et créer un profil",
        titleEdit: "Modifier le profil CSS",
        note: "Remarque : Le CSS collé peut affecter l'interface utilisateur, n'utilisez que du CSS de confiance.",
        importFromFile: "Importer depuis un fichier",
        importFromFileDesc:
          "Ou, sélectionnez un fichier (.css) depuis votre ordinateur.",
        importFromTheme: "Importer depuis un thème installé",
        importFromThemeDesc:
          "Chargez rapidement le CSS de l'un de vos thèmes communautaires installés.",
        noThemes: "Aucun thème installé",
      },
      snippetEditor: {
        title: "Créer un nouvel extrait CSS",
        titleEdit: "Modifier l'extrait CSS",
        nameLabel: "Nom de l'extrait",
        namePlaceholder: "Entrez le nom de l'extrait...",
        importFromSnippet: "Importer depuis un extrait installé",
        importFromSnippetDesc:
          "Chargez rapidement le CSS de l'un de vos extraits Obsidian installés.",
        noSnippets: "Aucun extrait installé",
        cssPlaceholder: "Collez votre code CSS ici...",
      },
      confirmation: {
        resetProfileTitle: "Confirmation de la réinitialisation du profil",
        resetProfileDesc:
          "Êtes-vous sûr de vouloir réinitialiser ce profil à la dernière capture épinglée ? Cela écrasera vos couleurs actuelles et ne pourra pas être annulé.",
        deleteSnippetTitle: (name: string) => `Supprimer l'extrait : ${name}`,
        deleteSnippetDesc:
          "Êtes-vous sûr de vouloir supprimer cet extrait ? Cette action est irréversible.",
        resetPluginTitle: "Êtes-vous sûr ?",
        resetPluginDesc:
          "Cela supprimera définitivement toutes vos données Color Master (profils, extraits, paramètres et arrière-plans). C'est irréversible.",
        deleteGlobalBgTitle: "Confirmer la suppression de l'arrière-plan",
        deleteGlobalBgDesc:
          "Voulez-vous vraiment supprimer définitivement cet arrière-plan ? Les profils suivants l'utilisent et seront réinitialisés :",
        deleteBackgroundTitle: "Supprimer l'arrière-plan ?",
        deleteBackgroundDesc: (
          name: string
        ) => `Êtes-vous sûr de vouloir supprimer définitivement '${name}' ?`,
      },
      noticeRules: {
        titleText: "Règles avancées pour la couleur du texte",
        titleBg: "Règles avancées pour la couleur de fond",
        desc: "Créez des règles priorisées pour colorer les notifications en fonction de leur contenu. La première règle correspondante de haut en bas sera appliquée.",
        addNewRule: "Ajouter une nouvelle règle",
        keywordPlaceholder: "Tapez un mot-clé et appuyez sur Espace...",
        useRegex: "Regex",
      },
      duplicateProfile: {
        title: "Nom de profil en double",
        descParts: [
          `Le nom de profil "`,
          `" existe déjà. Veuillez choisir un nom différent.`,
        ],
        placeholder: "Entrez un nouveau nom de profil...",
      },
      customVar: {
        title: "Ajouter une nouvelle variable CSS personnalisée",
        desc: "Définissez une nouvelle variable CSS (ex: --my-color: #f00). Cette variable sera ajoutée à votre profil actif.",
        displayName: "Nom d'affichage",
        displayNameDesc:
          "Un nom convivial pour votre variable (ex: 'Ma couleur primaire personnalisée').",
        displayNamePlaceholder: "Ex: Ma couleur primaire",
        varName: "Nom de la variable",
        varNameDesc:
          "Le nom réel de la variable CSS. Doit commencer par '--' (ex: '--ma-couleur-primaire').",
        varNamePlaceholder: "Ex: --ma-couleur-primaire",
        varValue: "Valeur de la variable",
        varType: "Type de variable",
        varTypeDesc:
          "Sélectionnez le type de données que cette variable contient.",
        types: {
          color: "Couleur",
          size: "Taille (ex: px, em)",
          text: "Texte",
          number: "Nombre",
        },
        varValueDesc:
          "La valeur de la variable CSS (ex: 'red', '#ff0000', 'rgb(255,0,0)').",
        varValuePlaceholder: "Ex: #FF0000 ou rouge",
        description: "Description (Optionnel)",
        descriptionDesc:
          "Une brève description de ce que cette variable contrôle.",
        descriptionPlaceholder: "Ex: Couleur principale des titres",
        addVarButton: "Ajouter",
        textValuePlaceholder: "Entrez la valeur du texte...",
      },
      addBackground: {
        title: "Ajouter un nouvel arrière-plan (Image/Vidéo)",
        importFromFile: "Importer depuis un fichier",
        importFromFileDesc:
          "Importer un fichier image ou vidéo depuis votre ordinateur.",
        pasteBoxPlaceholder:
          "Glissez-déposez / Collez un arrière-plan ou URL ici (Ctrl+V)",
        dropToAdd: "Relâchez pour ajouter l'arrière-plan...",
        processing: "Traitement",
      },
      fileConflict: {
        title: "Le fichier existe",
        desc: (name: string) =>
          `Un fichier nommé '${name}' existe déjà dans votre dossier d'arrière-plans. Que souhaitez-vous faire ?`,
        replaceButton: "Remplacer le fichier",
        keepButton: "Garder les deux (Renommer)",
      },
      backgroundBrowser: {
        title: "Arrière-plans stockés",
        noImages:
          "Aucune image ou vidéo trouvée dans votre dossier d'arrière-plans.",
      },
    },
    notices: {
      pluginEnabled: "Maître des Couleurs activé",
      pluginDisabled: "Maître des Couleurs désactivé",
      profilePinned: "Couleurs du profil épinglées avec succès !",
      profileReset: "Le profil a été réinitialisé à la capture épinglée.",
      noPinnedSnapshot: "Aucune capture épinglée trouvée pour ce profil.",
      profileNotFound: "Le profil actif n'a pas pu être trouvé.",
      noProfilesFound: "Aucun profil trouvé.",
      activeProfileSwitched: (name: string) => `Profil actif : ${name}`,
      cannotFindOriginalProfile:
        "Impossible de trouver les données originales pour ce profil.",
      profileRestored: (name: string) =>
        `Le profil "${name}" a été restauré à son état par défaut.`,
      graphColorsApplied: "Couleurs du graphique appliquées !",
      invalidJson: "JSON invalide.",
      jsonMustHaveName:
        "Le JSON importé doit avoir une propriété 'name' pour créer un nouveau profil.",
      profileCreatedSuccess: (name: string) =>
        `Le profil "${name}" a été créé avec succès.`,
      profileImportedSuccess: (mode: string) => `Profil ${mode} avec succès.`,
      noActiveProfileToCopy: "Aucun profil actif à copier.",
      noActiveProfileToExport: "Aucun profil actif à exporter.",
      snippetCssCopied: "CSS de l'extrait copié dans le presse-papiers !",
      snippetEmpty: "Cet extrait est vide.",
      cssContentEmpty: "Le contenu CSS ne peut pas être vide.",
      snippetNameExists: (name: string) =>
        `Le nom d'extrait "${name}" existe déjà.`,
      profileNameExists: (name: string) =>
        `Le nom de profil "${name}" existe déjà.`,
      profileUpdated: (name: string) => `Profil "${name}" mis à jour.`,
      snippetUpdated: (name: string) => `Extrait "${name}" mis à jour.`,
      snippetCreated: (name: string) =>
        `L'extrait "${name}" a été créé avec succès !`,
      snippetScopeMove:
        "Utilisez la fenêtre de modification pour déplacer un extrait.",
      profileCreatedFromCss: (name: string) =>
        `Le profil "${name}" a été créé avec succès !`,
      noColorHistory: "Aucun historique de couleur à restaurer.",
      colorRestored: (color: string) => `Restauré : ${color}`,
      textboxEmpty:
        "La zone de texte est vide. Collez du JSON ou importez d'abord un fichier.",
      fileLoaded: (fileName: string) =>
        `Fichier "${fileName}" chargé dans la zone de texte.`,
      exportSuccess: "Profil exporté avec succès !",
      jsonCopied: "JSON du profil copié dans le presse-papiers avec succès !",
      resetSuccess:
        "Les données de Color Master ont été supprimées. Veuillez recharger Obsidian pour appliquer les changements.",
      fpsUpdated: (value: number) =>
        `FPS de la mise à jour en direct défini sur : ${value}`,
      invalidProfileObject:
        "Le JSON ne semble pas être un objet de profil valide.",
      profileCreated: (name: string) =>
        `Le profil "${name}" a été créé avec succès !`,
      settingsSaved: "Paramètres appliqués avec succès !",
      testSentence: (word: string) =>
        `La couleur de notification pour "${word}" ressemble à ceci :`,
      varNameEmpty: "Le nom de la variable ne peut pas être vide.",
      varNameFormat: "Le nom de la variable doit commencer par '--'.",
      varExists: (name: string) => `La variable "${name}" existe déjà.`,
      varAdded: (name: string) =>
        `La variable "${name}" a été ajoutée avec succès.`,
      iconizeNotFound:
        "Plugin Iconize non trouvé. Veuillez l'installer et l'activer pour utiliser cette fonctionnalité.",
      themeCssLoaded: (theme: string) =>
        `CSS du thème "${theme}" chargé avec succès.`,
      themeReadFailed: (theme: string) =>
        `Impossible de lire le fichier du thème "${theme}". Il est peut-être protégé ou manquant.`,
      snippetLoaded: (snippet: string) =>
        `CSS de l'extrait "${snippet}" chargé avec succès.`,
      snippetReadFailed: (snippet: string) =>
        `Impossible de lire le fichier de l'extrait "${snippet}".`,
      themeSwitchedLight: "Passage en mode Clair",
      themeSwitchedDark: "Passage en mode Sombre",
      themeSwitchedAuto: "Passage en mode Auto",
      bgSet: "L'arrière-plan a été défini avec succès.",
      bgRemoved: "L'arrière-plan a été supprimé.",
      backgroundLoadError: "Échec du chargement de l'arrière-plan.",
      noBgToRemove:
        "Il n'y a pas d'arrière-plan actif à supprimer for ce profil.",
      bgDeleted: "L'arrière-plan et son fichier ont été supprimés.",
      backgroundUrlLoadError:
        "Échec du téléchargement de l'arrière-plan depuis l'URL.",
      backgroundPasteError:
        "Le contenu collé n'est pas un fichier d'arrière-plan ou une URL valide.",
      invalidFilename: "Nom de fichier invalide.",
      filenameExists: (name: string) =>
        `Le nom de fichier "${name}" existe déjà.`,
      renameSuccess: (name: string) => `Renommé en "${name}"`,
      renameError: "Erreur lors du changement de nom du fichier.",
      profileDeleted: "Profil supprimé avec succès.",
      jpgQualitySet: (value: number) => `Qualité JPG réglée sur ${value}%`,
    },
    tooltips: {
      restoreBuiltin: "Restaurer les couleurs d'origine intégrées",
      editCssProfile: "Modifier le profil CSS",
      pinSnapshot: "Épingler les couleurs actuelles comme une capture",
      pinSnapshotDate: (date: string) =>
        `Couleurs épinglées le ${date}. Cliquez pour ré-épingler.`,
      resetToPinned: "Réinitialiser aux couleurs épinglées",
      editSnippet: "Modifier l'extrait",
      copySnippetCss: "Copier le CSS dans le presse-papiers",
      deleteSnippet: "Supprimer l'extrait",
      setTransparent: "Rendre transparent",
      undoChange: "Annuler la dernière modification",
      dragReorder: "Glisser pour réorganiser",
      testRule: "Tester cette règle avec un mot-clé aléatoire",
      deleteCustomVar: "Supprimer la variable personnalisée",
      iconizeSettings: "Paramètres d'Iconize",
      themeLight:
        "Thème : Forcer le mode Clair (Cliquer pour passer au Sombre)",
      themeDark: "Thème : Forcer le mode Sombre (Cliquer pour passer en Auto)",
      themeAuto: "Thème : Auto (Suit Obsidian) (Cliquer pour passer au Clair)",
      addBg: "Ajouter un arrière-plan",
      removeBg: "Supprimer l'arrière-plan",
      bgSettings: "Paramètres d'arrière-plan",
      browseBg: "Parcourir les arrière-plans stockés",
      iconizeNotInstalled:
        "Plugin non installé ou désactivé. Veuillez installer et activer 'Iconize' pour utiliser cette fonctionnalité.",
    },
    commands: {
      toggleTheme: "Changer le thème du profil actif",
      enableDisable: "Activer & Désactiver",
      cycleNext: "Profil suivant",
      cyclePrevious: "Profil précédent",
      openSettings: "Ouvrir les paramètres",
    },
    likeCard: {
      profilesStat: (p: number, s: number) => `Profils: ${p} & Extraits: ${s}`,
      colorsStat: "Couleurs personnalisables",
      integrationsStat: "Intégrations de plugins",
      daysStat: "Jours d'utilisation",
      starButton: "Étoile sur GitHub",
      issueButton: "Signaler un problème",
      syncButton: "Synchronisez votre coffre",
      telegramButton: "Telegram",
    },
    colors: {
      names: {
        // Iconize
        "--iconize-icon-color": "Couleur des icônes Iconize",
        // Backgrounds
        "--background-primary": "Arrière-plan principal",
        "--background-primary-alt": "Arrière-plan principal (Alt)",
        "--background-secondary": "Arrière-plan secondaire",
        "--background-secondary-alt": "Arrière-plan secondaire (Alt)",
        "--background-modifier-border": "Bordure",
        "--background-modifier-border-hover": "Bordure (Survol)",
        "--background-modifier-border-focus": "Bordure (Focus)",
        "--background-modifier-flair": "Arrière-plan Flair",
        "--background-modifier-hover": "Arrière-plan (Survol)",
        "--background-modifier-active": "Arrière-plan (Actif)",
        // Text
        "--text-normal": "Texte normal",
        "--text-muted": "Texte estompé",
        "--text-faint": "Texte faible",
        "--text-on-accent": "Texte sur accent",
        "--text-accent": "Texte accentué",
        "--text-accent-hover": "Texte accentué (Survol)",
        "--text-selection": "Sélection de texte",
        "--checklist-done-color": "Tâche cochée",
        "--tag-color": "Texte des tags",
        "--tag-color-hover": "Texte des tags (Survol)",
        "--tag-bg": "Fond des tags",
        // Headings
        "--h1-color": "Couleur H1",
        "--h2-color": "Couleur H2",
        "--h3-color": "Couleur H3",
        "--h4-color": "Couleur H4",
        "--h5-color": "Couleur H5",
        "--h6-color": "Couleur H6",
        // Markdown
        "--hr-color": "Ligne horizontale",
        "--blockquote-border-color": "Bordure de citation",
        "--blockquote-color": "Texte de citation",
        "--blockquote-bg": "Fond de citation",
        "--code-normal": "Texte de code en ligne",
        "--code-background": "Fond de code en ligne",
        "--text-highlight-bg": "Fond de texte surligné",
        // Interactive Elements
        "--interactive-normal": "Interactif Normal",
        "--interactive-hover": "Interactif (Survol)",
        "--interactive-accent": "Interactif Accent",
        "--interactive-accent-hover": "Interactif Accent (Survol)",
        "--interactive-success": "Couleur de succès",
        "--interactive-error": "Couleur d'erreur",
        "--interactive-warning": "Couleur d'avertissement",
        // UI Elements
        "--titlebar-background": "Fond de la barre de titre",
        "--titlebar-background-focused": "Fond de la barre de titre (Focus)",
        "--titlebar-text-color": "Texte de la barre de titre",
        "--sidebar-background": "Fond de la barre latérale",
        "--sidebar-border-color": "Bordure de la barre latérale",
        "--header-background": "Fond de l'en-tête",
        "--header-border-color": "Bordure de l'en-tête",
        "--vault-name-color": "Nom du coffre",
        // Notices
        "--cm-notice-text-default": "Texte de notification par défaut",
        "--cm-notice-bg-default": "Fond de notification par défaut",
        // Graph View
        "--graph-line": "Ligne du graphique",
        "--graph-node": "Nœud du graphique",
        "--graph-text": "Texte du graphique",
        "--graph-node-unresolved": "Nœud non résolu",
        "--graph-node-focused": "Nœud focalisé",
        "--graph-node-tag": "Nœud de tag",
        "--graph-node-attachment": "Nœud de pièce jointe",
        // Misc
        "--scrollbar-thumb-bg": "Curseur de la barre de défilement",
        "--scrollbar-bg": "Fond de la barre de défilement",
        "--divider-color": "Séparateur",
      },
      descriptions: {
        // Iconize
        "--iconize-icon-color":
          "Définit la couleur de toutes les icônes ajoutées par le plugin Iconize. Cela remplacera les propres paramètres de couleur d'Iconize.",
        // Backgrounds
        "--background-primary":
          "Couleur de fond principale pour toute l'application, en particulier pour les volets d'édition et de notes.",
        "--background-primary-alt":
          "Une couleur de fond alternative, souvent utilisée pour la ligne active dans l'éditeur.",
        "--background-secondary":
          "Arrière-plan secondaire, généralement utilisé pour les barres latérales et autres panneaux d'interface.",
        "--background-secondary-alt":
          "Un arrière-plan secondaire alternatif, utilisé pour le fichier actif de l'explorateur de fichiers.",
        "--background-modifier-border":
          "La couleur des bordures sur divers éléments de l'interface comme les boutons et les entrées.",
        "--background-modifier-border-hover":
          "La couleur de la bordure lorsque vous survolez un élément.",
        "--background-modifier-border-focus":
          "La couleur de la bordure pour un élément focalisé, comme un champ de texte sélectionné.",
        "--background-modifier-flair":
          "Couleur de fond pour les éléments spéciaux de l'interface, comme l'état 'Synchronisation' ou 'Indexation'.",
        "--background-modifier-hover":
          "La couleur de fond des éléments lorsque vous les survolez (par exemple, les éléments de liste).",
        "--background-modifier-active":
          "La couleur de fond d'un élément lorsqu'il est activement cliqué ou sélectionné.",
        // Text
        "--text-normal":
          "La couleur de texte par défaut pour toutes les notes et la plupart de l'interface.",
        "--text-muted":
          "Une couleur de texte légèrement estompée, utilisée pour des informations moins importantes comme les métadonnées de fichier.",
        "--text-faint":
          "La couleur de texte la plus estompée, pour un texte d'interface très subtil ou des éléments désactivés.",
        "--text-on-accent":
          "Couleur de texte qui apparaît sur des fonds accentués (comme sur un bouton principal).",
        "--text-accent":
          "La couleur d'accentuation principale pour le texte, utilisée pour les liens et les éléments d'interface mis en évidence.",
        "--text-accent-hover":
          "La couleur du texte accentué (comme les liens) lorsque vous le survolez.",
        "--text-selection":
          "La couleur de fond du texte que vous avez sélectionné avec votre curseur.",
        "--checklist-done-color":
          "La couleur de la coche et du texte pour une tâche terminée.",
        "--tag-color": "Définit la couleur du texte des #tags.",
        "--tag-color-hover":
          "Définit la couleur du texte des #tags lors du survol.",
        "--tag-bg":
          "Définit la couleur de fond des #tags, permettant une forme de 'pilule'.",
        // Headings
        "--h1-color": "La couleur du texte des titres H1.",
        "--h2-color": "La couleur du texte des titres H2.",
        "--h3-color": "La couleur du texte des titres H3.",
        "--h4-color": "La couleur du texte des titres H4.",
        "--h5-color": "La couleur du texte des titres H5.",
        "--h6-color": "La couleur du texte des titres H6.",
        // Markdown
        "--hr-color":
          "La couleur de la ligne de séparation horizontale créée avec `---`.",
        "--blockquote-border-color":
          "La couleur de la bordure verticale sur le côté gauche d'une citation.",
        "--blockquote-color":
          "La couleur du texte pour le contenu à l'intérieur d'une citation.",
        "--blockquote-bg":
          "Définit la couleur de fond des éléments de citation (>).",
        "--code-normal":
          "Définit la couleur du texte à l'intérieur du code en ligne (entre apostrophes inverses).",
        "--code-background":
          "Définit la couleur de fond pour les blocs de code en ligne.",
        "--text-highlight-bg":
          "Définit la couleur de fond pour le texte surligné (==comme ceci==).",
        // Interactive Elements
        "--interactive-normal":
          "La couleur de fond pour les éléments interactifs comme les boutons.",
        "--interactive-hover":
          "La couleur de fond pour les éléments interactifs lors du survol.",
        "--interactive-accent":
          "La couleur d'accentuation pour les éléments interactifs importants (par exemple, le bouton 'Créer').",
        "--interactive-accent-hover":
          "La couleur d'accentuation pour les éléments interactifs importants lors du survol.",
        "--interactive-success":
          "Couleur indiquant une opération réussie (par exemple, vert).",
        "--interactive-error":
          "Couleur indiquant une erreur (par exemple, rouge).",
        "--interactive-warning":
          "Couleur indiquant un avertissement (par exemple, jaune).",
        // UI Elements
        "--titlebar-background":
          "La couleur de fond de la barre de titre de la fenêtre principale.",
        "--titlebar-background-focused":
          "La couleur de fond de la barre de titre lorsque la fenêtre est active.",
        "--titlebar-text-color": "La couleur du texte dans la barre de titre.",
        "--sidebar-background":
          "Cible spécifiquement l'arrière-plan des barres latérales.",
        "--sidebar-border-color":
          "La couleur de la bordure à côté des barres latérales.",
        "--header-background":
          "L'arrière-plan pour les en-têtes dans les volets (par exemple, l'en-tête du titre de la note).",
        "--header-border-color":
          "La couleur de la bordure sous les en-têtes de volet.",
        "--vault-name-color":
          "La couleur du nom de votre coffre dans le coin supérieur gauche.",
        "--cm-notice-text-default":
          "Définit la couleur de texte par défaut pour toutes les notifications, sauf si elle est remplacée par une règle.",
        "--cm-notice-bg-default":
          "Définit la couleur de fond par défaut pour toutes les notifications, sauf si elle est remplacée par une règle.",
        // Graph View
        "--graph-line":
          "La couleur des lignes de connexion entre les notes dans la vue graphique.",
        "--graph-node":
          "La couleur des nœuds circulaires pour les notes existantes.",
        "--graph-text":
          "La couleur des étiquettes de texte sur les nœuds du graphique.",
        "--graph-node-unresolved":
          "La couleur des nœuds pour les notes qui n'existent pas encore (liens non résolus).",
        "--graph-node-focused":
          "Couleur du nœud qui est focalisé ou survolé (nœud en surbrillance).",
        "--graph-node-tag":
          "Couleur des nœuds représentant les tags lorsque les tags sont affichés dans le graphique.",
        "--graph-node-attachment":
          "Couleur des nœuds représentant les pièces jointes (par exemple, image ou autres fichiers liés).",
        // Misc
        "--scrollbar-thumb-bg":
          "La couleur de la partie déplaçable de la barre de défilement.",
        "--scrollbar-bg":
          "La couleur de la piste de la barre de défilement (l'arrière-plan).",
        "--divider-color":
          "La couleur pour les lignes de séparation générales de l'interface, comme les bordures entre les paramètres.",
      },
    },
  },
};

let cachedLang: LocaleCode | null = null;

export const t = (key: string, ...args: (string | number)[]): any => {
  if (!T) {
    console.error("ColorMaster: 'T' is not initialized yet.");
    return key;
  }

  // Load strings on first call
  const currentLang = (T.settings?.language as LocaleCode) || DEFAULT_LOCALE;
  if (
    Object.keys(FLATTENED_STRINGS).length === 0 ||
    currentLang !== cachedLang
  ) {
    cachedLang = currentLang;
    console.log(
      `Color Master: Rebuilding translation cache for language: ${currentLang}`
    );

    const lang = currentLang;
    const stringsForLang =
      NESTED_STRINGS[lang] || NESTED_STRINGS[DEFAULT_LOCALE];
    FLATTENED_STRINGS = flattenStrings(stringsForLang);

    if (lang !== DEFAULT_LOCALE) {
      const defaultLangStrings = flattenStrings(NESTED_STRINGS[DEFAULT_LOCALE]);
      FLATTENED_STRINGS = { ...defaultLangStrings, ...FLATTENED_STRINGS };
    }
  }

  const string = FLATTENED_STRINGS[key];

  if (typeof string === "function") {
    return string.apply(null, args);
  }
  if (typeof string === "string") {
    return string;
  }
  // Handle arrays
  if (Array.isArray(string)) {
    return string as any;
  }

  console.warn(`ColorMaster: Missing translation for key: ${key}`);
  return key;
};

export function initializeT(plugin: ColorMaster) {
  T = plugin;
  // Reset flattened strings on language change
  FLATTENED_STRINGS = {};
}
