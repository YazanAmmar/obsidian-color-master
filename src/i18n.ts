import type ColorMaster from "./main";

let T: ColorMaster;

// A function to set the instance from main.ts
export function initializeT(plugin: ColorMaster) {
  T = plugin;
}

export const STRINGS = {
  en: {
    PLUGIN_NAME: "Color Master - v1.1.0",
    ENABLE_PLUGIN: "Enable Color Master",
    ENABLE_PLUGIN_DESC:
      "Turn this off to temporarily disable all custom colors and revert to your active Obsidian theme.",
    PLUGIN_ENABLED_NOTICE: "Color Master Enabled",
    PLUGIN_DISABLED_NOTICE: "Color Master Disabled",
    LANGUAGE: "Language",
    LANGUAGE_DESC: "Set the interface language for the plugin.",
    PROFILE_MANAGER: "Profile Manager",
    RESET_CONFIRM_TITLE: "Reset Profile Confirmation",
    RESET_CONFIRM_DESC:
      "Are you sure you want to reset this profile to the last pinned snapshot? This will overwrite your current colors and cannot be undone.",
    ACTIVE_PROFILE: "Active Profile",
    ACTIVE_PROFILE_DESC: "Manage and switch between color profiles.",
    NEW_BUTTON: "New",
    DELETE_BUTTON: "Delete",
    OPTIONS_HEADING: "Advanced Settings",
    UPDATE_FREQUENCY_NAME: "Live Update FPS",
    UPDATE_FREQUENCY_DESC:
      "Sets how many times per second the UI previews color changes while dragging (0 = disable live preview). Lower values can improve performance.",
    OVERRIDE_ICONIZE: "Override Iconize Plugin Colors",
    OVERRIDE_ICONIZE_DESC:
      "Let Color Master control all icon colors from the Iconize plugin. For best results, disable the color settings within Iconize itself.",
    ICONIZE_NOT_FOUND_NOTICE:
      "Iconize plugin not found. Please install and enable it to use this feature.",
    BACKGROUNDS: "Backgrounds",
    TEXT: "Text",
    INTERACTIVE_ELEMENTS: "Interactive Elements",
    UI_ELEMENTS: "UI Elements",
    MISC: "Misc",
    NEW_PROFILE_TITLE: "Create New Profile",
    PROFILE_NAME_LABEL: "Profile Name",
    PROFILE_NAME_PLACEHOLDER: "Enter profile name...",
    CREATE_BUTTON: "Create",
    EMPTY_PROFILE_NAME_NOTICE: "Profile name cannot be empty.",
    PROFILE_EXISTS_NOTICE: (name: string) =>
      `Profile "${name}" already exists.`,
    DELETE_PROFILE_TITLE: "Delete Profile",
    DELETE_PROFILE_CONFIRMATION: (name: string) =>
      `Are you sure you want to delete the profile "${name}"? This action cannot be undone.`,
    SNIPPETS_HEADING: "CSS Snippets",
    SAVE_AS_TYPE: "Save as Type",
    SAVE_AS_PROFILE: "Profile",
    SAVE_AS_SNIPPET: "Snippet",
    EDIT_SNIPPET_TITLE: "Edit CSS Snippet",
    EDIT_PROFILE_TITLE: "Edit CSS Profile",
    PROFILE_DELETED_NOTICE: "Profile deleted.",
    CANNOT_DELETE_LAST_PROFILE: "Cannot delete the last profile.",
    PROFILE_THEME_TYPE: "Profile Theme Type",
    PROFILE_THEME_TYPE_DESC:
      "Set whether this profile should force a specific theme (Dark/Light) when activated.",
    THEME_TYPE_AUTO: "Obsidian's Default Theme",
    THEME_TYPE_DARK: "Force Dark Mode",
    THEME_TYPE_LIGHT: "Force Light Mode",
    RESTORE_BUTTON: "Restore",
    RESET_BUTTON: "Reset",
    UPDATE_BUTTON: "Update",
    SEARCH_PLACEHOLDER: "Search variables (name or value)...",
    CLEAR_BUTTON: "Clear",
    SEARCH_RESULTS_FOUND: (count: number) => `${count} found`,
    ALL_SECTIONS: "All Sections",
    EXPORT_FILE_BUTTON: "Export File",
    COPY_JSON_BUTTON: "Copy JSON",
    IMPORT_PASTE_CSS_BUTTON: "Import / Paste (.css)",
    IMPORT_PASTE_JSON_BUTTON: "Import / Paste (.json)",
    CREATE_SNIPPET_BUTTON: "Create New Snippet",
    NO_SNIPPETS_DESC: "No CSS snippets created for this profile yet.",
    CLEANUP_INTERVAL_NAME: "Cleanup Interval",
    CLEANUP_INTERVAL_DESC:
      "Sets how often (in seconds) the plugin checks for uninstalled Iconize plugin to clean up its icons.",
    PLUGIN_INTEGRATIONS: "Plugin Integrations",
    GRAPH_VIEW: "Graph View",
    LIKE_CARD_PROFILES_STAT: (p: number, s: number) =>
      `Profiles: ${p} & Snippets: ${s}`,
    LIKE_CARD_COLORS_STAT: "Customizable Colors",
    LIKE_CARD_INTEGRATIONS_STAT: "Plugin Integrations",
    LIKE_CARD_DAYS_STAT: "Days of Use",
    LIKE_CARD_STAR_BUTTON: "Star on GitHub",
    LIKE_CARD_ISSUE_BUTTON: "Report an Issue",
    LIKE_CARD_SYNC_BUTTON: "Sync Your Vault",
    LIKE_CARD_GITHUB_BUTTON: "My GitHub",
    PASTE_CSS_MODAL_TITLE: "Import / Paste CSS",
    PASTE_CSS_MODAL_NOTE:
      "Note : Pasted CSS can affect UI, proceed only with trusted CSS.",
    IMPORT_FROM_FILE: "Import from File",
    IMPORT_FROM_FILE_DESC: "Or, select a (.css) file from your computer.",
    CHOOSE_FILE_BUTTON: "Choose File...",
    CSS_TEXTAREA_PLACEHOLDER: "Paste your CSS here...",
    SNIPPET_NAME_LABEL: "Snippet Name",
    CREATE_SNIPPET_TITLE: "Create New CSS Snippet",
    IMPORT_PROFILE_TITLE: "Import / Paste CSS and create profile",
    SNIPPET_NAME_PLACEHOLDER: "Enter snippet name...",
    NOTICE_PROFILE_PINNED: "Profile colors pinned successfully!",
    NOTICE_PROFILE_RESET: "Profile has been reset to the pinned snapshot.",
    NOTICE_NO_PINNED_SNAPSHOT: "No pinned snapshot found for this profile.",
    NOTICE_PROFILE_NOT_FOUND: "Active profile could not be found.",
    NOTICE_NO_PROFILES_FOUND: "No profiles found.",
    NOTICE_ACTIVE_PROFILE_SWITCHED: (name: string) => `Active profile: ${name}`,
    NOTICE_CANNOT_FIND_ORIGINAL_PROFILE:
      "Could not find original data for this profile.",
    NOTICE_PROFILE_RESTORED: (name: string) =>
      `Profile "${name}" has been restored to its default state.`,
    NOTICE_GRAPH_COLORS_APPLIED: "Graph colors applied!",
    NOTICE_INVALID_JSON: "Invalid JSON.",
    NOTICE_JSON_MUST_HAVE_NAME:
      "The imported JSON must have a 'name' property to create a new profile.",
    NOTICE_PROFILE_CREATED_SUCCESS: (name: string) =>
      `Profile "${name}" was created successfully.`,
    NOTICE_PROFILE_IMPORTED_SUCCESS: (mode: string) =>
      `Profile ${mode}d successfully.`,
    NOTICE_NO_ACTIVE_PROFILE_TO_COPY: "No active profile to copy.",
    NOTICE_NO_ACTIVE_PROFILE_TO_EXPORT: "No active profile to export.",
    NOTICE_SNIPPET_CSS_COPIED: "Snippet CSS copied to clipboard!",
    NOTICE_SNIPPET_EMPTY: "This snippet is empty.",
    NOTICE_CSS_CONTENT_EMPTY: "CSS content cannot be empty.",
    NOTICE_SNIPPET_NAME_EXISTS: (name: string) =>
      `Snippet name "${name}" already exists.`,
    NOTICE_PROFILE_NAME_EXISTS: (name: string) =>
      `Profile name "${name}" already exists.`,
    NOTICE_PROFILE_UPDATED: (name: string) => `Profile "${name}" updated.`,
    NOTICE_SNIPPET_UPDATED: (name: string) => `Snippet "${name}" updated.`,
    NOTICE_SNIPPET_CREATED: (name: string) =>
      `Snippet "${name}" has been created successfully!`,
    NOTICE_PROFILE_CREATED_FROM_CSS: (name: string) =>
      `Profile "${name}" has been created successfully!`,
    NOTICE_NO_COLOR_HISTORY: "No color history to restore.",
    NOTICE_COLOR_RESTORED: (color: string) => `Restored: ${color}`,
    NOTICE_TEXTBOX_EMPTY:
      "The text box is empty. Paste some JSON or import a file first.",
    IMPORT_JSON_MODAL_TITLE: "Paste or Import Profile JSON",
    IMPORT_JSON_MODAL_DESC_1: "You can paste a profile JSON in the box below.",
    IMPORT_JSON_MODAL_PLACEHOLDER: '{ "name": "...", "profile": { ... } }',
    IMPORT_JSON_MODAL_SETTING_NAME: "Import from File",
    IMPORT_JSON_MODAL_SETTING_DESC:
      "Or, select a (.json) profile file from your computer.",
    REPLACE_ACTIVE_BUTTON: "Replace Active",
    CREATE_NEW_BUTTON: "Create New",
    NOTICE_FILE_LOADED: (fileName: string) =>
      `File "${fileName}" loaded into the text area.`,
    NOTICE_EXPORT_SUCCESS: "Profile exported successfully!",
    TOOLTIP_RESTORE_BUILTIN: "Restore to original built-in colors",
    TOOLTIP_EDIT_CSS_PROFILE: "Edit CSS Profile",
    TOOLTIP_PIN_SNAPSHOT: "Pin current colors as a snapshot",
    TOOLTIP_PIN_SNAPSHOT_DATE: (date: string) =>
      `Colors pinned on ${date}. Click to re-pin.`,
    TOOLTIP_RESET_TO_PINNED: "Reset to pinned colors",
    TOOLTIP_EDIT_SNIPPET: "Edit Snippet",
    TOOLTIP_COPY_SNIPPET_CSS: "Copy CSS to clipboard",
    TOOLTIP_DELETE_SNIPPET: "Delete Snippet",
    TOOLTIP_SET_TRANSPARENT: "Set to transparent",
    TOOLTIP_UNDO_CHANGE: "Undo last change",
    ARIA_LABEL_CASE_SENSITIVE: "Case-sensitive search",
    ARIA_LABEL_REGEX_SEARCH: "Use regular expression",
    NOTICE_JSON_COPIED_CLIPBOARD: "Profile JSON copied to clipboard.",
    MODAL_DELETE_SNIPPET_TITLE: (name: string) => `Delete Snippet: ${name}`,
    MODAL_DELETE_SNIPPET_DESC:
      "Are you sure you want to delete this snippet? This action cannot be undone.",
    RESET_PLUGIN_NAME: "Reset Plugin Settings",
    RESET_PLUGIN_DESC:
      "This will delete all profiles, snippets, settings, and backgrounds, resetting the plugin to its original state. This action requires an app reload and cannot be undone.",
    RESET_PLUGIN_BUTTON: "Reset All Data...",
    RESET_CONFIRM_MODAL_TITLE: "Are you sure?",
    RESET_CONFIRM_MODAL_DESC:
      "This will permanently delete all your Color Master data (profiles, snippets, settings, and backgrounds). This is irreversible.",
    RESET_SUCCESS_NOTICE:
      "Color Master data has been deleted. Please reload Obsidian to apply the changes.",
    RELOAD_BUTTON: "Reload",
    NOTICE_FPS_UPDATED: (value: number) => `Live Update FPS set to: ${value}`,
    NOTICE_SNIPPET_COPIED: "Snippet CSS copied to clipboard!",
    NOTICE_INVALID_PROFILE_OBJECT:
      "JSON does not appear to be a valid profile object.",
    NEW_PROFILE: "New",
    RESTORE_PROFILE_MODAL_TITLE: (name: string) => `Restore Profile: ${name}`,
    RESTORE_PROFILE_MODAL_DESC: (name: string) =>
      `Are you sure you want to restore "${name}" to its original colors? All your customizations for this profile will be lost.`,
    NOTICE_PROFILE_CREATED: (name: string) =>
      `Profile "${name}" created successfully!`,
    MARKDOWN: "Markdown",
    NOTICES: "Notices",
    ADVANCED_NOTICE_TEXT_RULES_TITLE: "Advanced Text Color Rules",
    ADVANCED_NOTICE_BG_RULES_TITLE: "Advanced Background Color Rules",
    ADD_NEW_RULE: "Add New Rule",
    KEYWORD_PLACEHOLDER: "Type a keyword and press Space...",
    USE_REGEX_LABEL: "Regex",
    DRAG_RULE_TOOLTIP: "Drag to reorder",
    APPLY_BUTTON: "Apply",
    CANCEL_BUTTON: "Cancel",
    MODAL_ADD_VAR_TITLE: "Add New Custom CSS Variable",
    MODAL_ADD_VAR_DESC:
      "Define a new CSS variable (e.g., --my-color: #f00). This variable will be added to your active profile.",
    MODAL_VAR_DISPLAY_NAME: "Display Name",
    MODAL_VAR_DISPLAY_NAME_DESC:
      "A friendly name for your variable (e.g., 'My Custom Primary Color').",
    MODAL_VAR_DISPLAY_NAME_PLACEHOLDER: "e.g., My Primary Color",
    MODAL_VAR_NAME: "Variable Name",
    MODAL_VAR_NAME_DESC:
      "The actual CSS variable name. Must start with '--' (e.g., '--my-primary-color').",
    MODAL_VAR_NAME_PLACEHOLDER: "e.g., --my-primary-color",
    MODAL_VAR_VALUE: "Variable Value",
    MODAL_VAR_VALUE_DESC:
      "The value of the CSS variable (e.g., 'red', '#ff0000', 'rgb(255,0,0)').",
    MODAL_VAR_VALUE_PLACEHOLDER: "e.g., #FF0000 or red",
    MODAL_VAR_DESCRIPTION: "Description (Optional)",
    MODAL_VAR_DESCRIPTION_DESC:
      "A brief description of what this variable controls.",
    MODAL_VAR_DESCRIPTION_PLACEHOLDER: "e.g., Main color for headings",
    ERROR_VAR_NAME_PREFIX: "Variable name must start with '--'",

    SETTINGS_SAVED: "Settings applied successfully!",
    MOVE_RULE_UP_TOOLTIP: "Move rule up",
    MOVE_RULE_DOWN_TOOLTIP: "Move rule down",
    DRAG_HANDLE_TOOLTIP: "Drag to reorder",
    TOOLTIP_TEST_RULE: "Test this rule with a random keyword",
    NOTICE_TEST_SENTENCE: (word: string) =>
      `Notice color for "${word}" looks like this:`,
    DUPLICATE_PROFILE_TITLE: "Duplicate Profile Name",
    DUPLICATE_PROFILE_DESC_PARTS: [
      `The profile name "`,
      `" already exists. Please choose a different name.`,
    ],
    DUPLICATE_PROFILE_PLACEHOLDER: "Enter new profile name...",
    NOTICE_RULES_DESC:
      "Create prioritized rules to color notices based on their content. The first matching rule from top to bottom will be applied.",
    CUSTOM_VARIABLES_HEADING: "Custom Variables",
    CUSTOM_VARIABLE_DESC: "Variable added by the user.",
    TOOLTIP_DELETE_CUSTOM_VARIABLE: "Delete Custom Variable",
    ADD_CUSTOM_VARIABLE_NAME: "Add Custom Variable",
    ADD_CUSTOM_VARIABLE_DESC:
      "Add a new CSS variable that isn't in the default list. The name must start with '--'.",
    ADD_NEW_VARIABLE_BUTTON: "Add New Variable...",
    VARIABLE_NAME_LABEL: "Variable Name",
    VARIABLE_NAME_DESC: "The technical CSS name, e.g., --my-custom-color.",
    COLOR_LABEL: "Color Value",
    VARIABLE_NAME_PLACEHOLDER: "--variable-name",
    NOTICE_VAR_NAME_EMPTY: "Variable name cannot be empty.",
    NOTICE_VAR_NAME_FORMAT: "Variable name must start with '--'.",
    NOTICE_VAR_EXISTS: (name: string) => `Variable "${name}" already exists.`,
    NOTICE_VAR_ADDED: (name: string) =>
      `Variable "${name}" added successfully.`,
    HELP_TEXT_PRE_LINK: "Can't find the variable you're looking for? ",
    HELP_TEXT_LINK: "Browse the official list of Obsidian CSS variables.",
    MODAL_CUSTOM_VAR_TITLE: "Add Custom Variable Details",
    ADD_BUTTON: "Add",
    DISPLAY_NAME_LABEL: "Display Name",
    DISPLAY_NAME_DESC:
      "This is the user-friendly name that will appear in the settings list.",
    DESCRIPTION_LABEL: "Description",
    DESCRIPTION_DESC: "Describe what this color variable is used for.",
    SAVE_BUTTON: "Save Variable",
    PLACEHOLDER_DISPLAY_NAME: "e.g., Main Background Color",
    PLACEHOLDER_DESCRIPTION: "e.g., Used to change the font size...",
    RTL_LAYOUT_NAME: "Enable Right-to-Left (RTL) Layout",
    RTL_LAYOUT_DESC:
      "When enabled, the plugin's interface is flipped to properly support languages written from right to left.",
    LANGUAGE_SETTINGS_TITLE: "Language Settings",
    SAVE_AS_GLOBAL_SNIPPET_NAME: "Save as Global Snippet",
    SAVE_AS_GLOBAL_SNIPPET_DESC:
      "A global snippet is applied to all of your profiles.",
    NOTICE_MOVE_SNIPPET_SCOPE:
      "Use the edit modal to move a snippet between scopes.",
    ICONIZE_SETTINGS_MODAL_TITLE: "Iconize Integration Settings",
    TOOLTIP_ICONIZE_SETTINGS: "Iconize Settings",
    THEME_WARNING_TOOLTIP: (currentTheme: string) =>
      `The community theme "${currentTheme}" is active, which may interfere with the profile's appearance. For best results, switch to Obsidian's default theme, or import "${currentTheme}" as a new CSS profile to customize it directly.`,
    IMPORT_FROM_INSTALLED_THEME: "Import from installed theme",
    IMPORT_FROM_INSTALLED_THEME_DESC:
      "Quickly load the CSS from one of your installed community themes.",
    IMPORT_BUTTON: "Import",
    NOTICE_THEME_CSS_LOADED: (theme: string) =>
      `Successfully loaded CSS from "${theme}" theme.`,
    NOTICE_THEME_READ_FAILED: (theme: string) =>
      `Could not read the theme file for "${theme}". It might be protected or missing.`,
    IMPORT_FROM_INSTALLED_SNIPPET: "Import from installed snippet",
    IMPORT_FROM_INSTALLED_SNIPPET_DESC:
      "Quickly load the CSS from one of your enabled Obsidian snippets.",
    NOTICE_SNIPPET_LOADED: (snippet: string) =>
      `Successfully loaded CSS from "${snippet}" snippet.`,
    NOTICE_SNIPPET_READ_FAILED: (snippet: string) =>
      `Could not read the snippet file for "${snippet}".`,
    NO_THEMES_INSTALLED: "No community themes installed",
    NO_SNIPPETS_INSTALLED: "No snippets installed",
    TOOLTIP_THEME_LIGHT: "Theme: Force Light Mode (Click to switch to Dark)",
    TOOLTIP_THEME_DARK: "Theme: Force Dark Mode (Click to switch to Auto)",
    TOOLTIP_THEME_AUTO:
      "Theme: Auto (Follows Obsidian) (Click to switch to Light)",
    TOOLTIP_EXPORT_PROFILE: "Export current profile as JSON file",
    TOOLTIP_COPY_JSON: "Copy current profile JSON to clipboard",
    NOTICE_JSON_COPIED: "Profile JSON copied to clipboard successfully!",
    TOGGLE_THEME_COMMAND: "Cycle active profile theme",
    NOTICE_THEME_SWITCHED_LIGHT: "Switched to Light Mode",
    NOTICE_THEME_SWITCHED_DARK: "Switched to Dark Mode",
    NOTICE_THEME_SWITCHED_AUTO: "Switched to Auto Mode",
    COMMAND_ENABLE_DISABLE: "Enable & Disable",
    COMMAND_CYCLE_NEXT: "Cycle to next profile",
    COMMAND_CYCLE_PREVIOUS: "Cycle to previous profile",
    COMMAND_OPEN_SETTINGS: "Open settings tab",
    RIBBON_TOOLTIP_SETTINGS: "Color Master Settings",
    REGEX_PLACEHOLDER: "Enter Regex and press Enter...",
    SET_BACKGROUND_IMAGE_NAME: "Set Custom Background",
    SET_BACKGROUND_IMAGE_DESC:
      "Set a custom background image for your active profile.",
    SET_BACKGROUND_IMAGE_BUTTON: "Choose Image...",
    REMOVE_BACKGROUND_IMAGE_BUTTON: "Remove Background",
    NOTICE_BACKGROUND_IMAGE_SET: "Background image has been set successfully.",
    NOTICE_BACKGROUND_IMAGE_REMOVED: "Background image has been removed.",
    NOTICE_IMAGE_LOAD_ERROR: "Failed to load the image.",
    TOOLTIP_ADD_BACKGROUND_IMAGE: "Add background image",
    TOOLTIP_REMOVE_BACKGROUND_IMAGE: "Remove background image",
    TOOLTIP_BACKGROUND_IMAGE_SETTINGS: "Background image settings",
    TOOLTIP_BROWSE_BACKGROUND_IMAGES: "Browse stored background images",
    NOTICE_NO_BACKGROUND_IMAGE_TO_REMOVE:
      "There is no active background image for this profile to remove.",
    NOTICE_BACKGROUND_IMAGE_DELETED:
      "Background image and file have been deleted.",
    CONFIRM_BACKGROUND_DELETION_TITLE: "Confirm Background Deletion",
    CONFIRM_BACKGROUND_DELETION_DESC:
      "Are you sure you want to delete the current background image? The image file will be permanently removed from your vault.",
    DELETE_ANYWAY_BUTTON: "Delete Anyway",
    NOTICE_BACKGROUND_IMAGE_NOT_FOUND: (path: string) =>
      `Profile requires background image at '${path}', but the file was not found. Please add the image to this path.`,
    NOTICE_BACKGROUND_FOLDER_NOT_FOUND:
      "Backgrounds folder '.obsidian/backgrounds' not found.",
    FILE_CONFLICT_TITLE: "File Exists",
    FILE_CONFLICT_DESC: (name: string) =>
      `A file named '${name}' already exists in your backgrounds folder. What would you like to do?`,
    REPLACE_FILE_BUTTON: "Replace File",
    KEEP_BOTH_BUTTON: "Keep Both (Rename)",
    ADD_NEW_BACKGROUND_IMAGE_TITLE: "Add New Background Image",
    IMPORT_FROM_FILE_BUTTON: "Import from File",
    NOTICE_URL_LOAD_ERROR: "Failed to download image from URL.",
    IMPORT_FROM_FILE_DESC_MODAL:
      "Import an image file from your computer to use as a background.",
    PASTE_BOX_PLACEHOLDER: "Drag & Drop / Paste an image or URL here (Ctrl+V)",
    NOTICE_PASTE_ERROR: "Pasted content is not a valid image or URL.",
    DROP_TO_ADD_IMAGE: "Drop to add image...",
    PROCESSING_IMAGE: "Processing",
    PROFILE_IMAGE_BROWSER_TITLE: "Profile Backgrounds",
    NO_IMAGES_FOUND: "No images found in your profile's background folder.",
    SELECT_BUTTON: "Select",
    CONFIRM_IMAGE_DELETE_TITLE: "Delete Image?",
    CONFIRM_IMAGE_DELETE_DESC: (name: string) =>
      `Are you sure you want to permanently delete '${name}'?`,
    BROWSE_BUTTON: "Browse...",
    NOTICE_INVALID_FILENAME: "Invalid file name.",
    NOTICE_FILENAME_EXISTS: (name: string) =>
      `File name "${name}" already exists.`,
    NOTICE_RENAME_SUCCESS: (name: string) => `Renamed to "${name}"`,
    NOTICE_RENAME_ERROR: "Error renaming file.",
    SETTING_BACKGROUND_ENABLE_NAME: "Enable Background Image",
    SETTING_BACKGROUND_ENABLE_DESC:
      "Toggle the visibility of the custom background image for this profile.",
  },
  ar: {
    PLUGIN_NAME: "متحكم الألوان - v1.1.0",
    ENABLE_PLUGIN: "تفعيل متحكم الألوان",
    ENABLE_PLUGIN_DESC:
      "أطفئ هذا الخيار لتعطيل جميع الألوان المخصصة مؤقتاً والعودة إلى ثيم Obsidian النشط.",
    PLUGIN_ENABLED_NOTICE: "تم تفعيل متحكم الألوان",
    PLUGIN_DISABLED_NOTICE: "تم تعطيل متحكم الألوان",
    LANGUAGE: "اللغة",
    LANGUAGE_DESC: "اختر لغة واجهة الإضافة.",
    PROFILE_MANAGER: "إدارة الملفّات الشخصيّة",
    RESET_CONFIRM_TITLE: "تأكيد استرجاع الملف الشخصي",
    RESET_CONFIRM_DESC:
      "هل أنت متأكد من رغبتك في استرجاع هذا الملف الشخصي لآخر لقطة تم تثبيتها؟ سيتم الكتابة فوق الألوان الحالية ولا يمكن التراجع عن هذا الإجراء.",
    ACTIVE_PROFILE: "الملف الشخصي النشط",
    ACTIVE_PROFILE_DESC: "تنقل بين الملفّات الشخصيّة أو أنشئ واحد جديد.",
    NEW_BUTTON: "جديد",
    DELETE_BUTTON: "حذف",
    OPTIONS_HEADING: "إعدادات متقدمة",
    UPDATE_FREQUENCY_NAME: "معدل التحديث المباشر (إطار بالثانية)",
    UPDATE_FREQUENCY_DESC:
      "يحدد عدد مرات تحديث معاينة الألوان في الثانية أثناء السحب (0 = تعطيل المعاينة). القيم المنخفضة تحسن الأداء.",
    OVERRIDE_ICONIZE: "تجاوز ألوان إضافة Iconize",
    OVERRIDE_ICONIZE_DESC:
      "اسمح لـ Color Master بالتحكم في كل ألوان أيقونات Iconize. لأفضل النتائج، قم بتعطيل إعدادات الألوان في إضافة Iconize نفسها.",
    ICONIZE_NOT_FOUND_NOTICE:
      "إضافة Iconize غير موجودة. يرجى تثبيتها وتفعيلها لاستخدام هذه الميزة.",
    BACKGROUNDS: "الخلفيات",
    TEXT: "النصوص",
    INTERACTIVE_ELEMENTS: "العناصر التفاعلية",
    UI_ELEMENTS: "عناصر الواجهة",
    MISC: "متنوع",
    NEW_PROFILE_TITLE: "إنشاء ملف شخصي جديد",
    PROFILE_NAME_LABEL: "اسم الملف الشخصي",
    PROFILE_NAME_PLACEHOLDER: "أدخل اسم الملف الشخصي...",
    CREATE_BUTTON: "إنشاء",
    EMPTY_PROFILE_NAME_NOTICE: "لا يمكن ترك اسم الملف الشخصي فارغاً.",
    PROFILE_EXISTS_NOTICE: (name: string) =>
      `الملف الشخصي "${name}" موجودة بالفعل.`,
    DELETE_PROFILE_TITLE: "حذف الملف الشخصي",
    DELETE_PROFILE_CONFIRMATION: (name: string) =>
      `هل أنت متأكد من رغبتك في حذف الملف الشخصي "${name}"؟ لا يمكن التراجع عن هذا الإجراء.`,
    SNIPPETS_HEADING: "قصاصات CSS",
    SAVE_AS_TYPE: "حفظ كـ :",
    SAVE_AS_PROFILE: "ملف شخصي",
    SAVE_AS_SNIPPET: "قصاصة",
    EDIT_SNIPPET_TITLE: "تعديل قصاصة CSS",
    EDIT_PROFILE_TITLE: "تعديل الملف الشخصي",
    PROFILE_DELETED_NOTICE: "تم حذف الملف الشخصي.",
    CANNOT_DELETE_LAST_PROFILE: "لا يمكن حذف آخر ملف شخصي.",
    PROFILE_THEME_TYPE: "نوع ثيم الملف الشخصي",
    PROFILE_THEME_TYPE_DESC:
      "حدد ما إذا كانت هذا الملف الشخصي سيفرض ثيماً معيناً (غامق/فاتح) عند تفعيله.",
    THEME_TYPE_AUTO: "الثيم الافتراضي لأوبسيديان",
    THEME_TYPE_DARK: "فرض الوضع الغامق",
    THEME_TYPE_LIGHT: "فرض الوضع الفاتح",
    RESTORE_BUTTON: "استعادة",
    RESET_BUTTON: "إعادة تعيين",
    UPDATE_BUTTON: "تحديث",
    SEARCH_PLACEHOLDER: "ابحث عن المتغيرات (بالاسم أو القيمة)...",
    CLEAR_BUTTON: "تنظيف",
    SEARCH_RESULTS_FOUND: (count: number) => `تم العثور على ${count}`,
    ALL_SECTIONS: "كل الأقسام",
    EXPORT_FILE_BUTTON: "تصدير ملف",
    COPY_JSON_BUTTON: "نسخ JSON",
    IMPORT_PASTE_CSS_BUTTON: "استيراد / لصق (.css)",
    IMPORT_PASTE_JSON_BUTTON: "استيراد / لصق (.json)",
    CREATE_SNIPPET_BUTTON: "إنشاء قصاصة جديدة",
    NO_SNIPPETS_DESC: "لم يتم إنشاء أي قصاصات CSS لهذا الملف الشخصي بعد.",
    CLEANUP_INTERVAL_NAME: "فترة التنظيف",
    CLEANUP_INTERVAL_DESC:
      "تحدد عدد المرات (بالثواني) التي تتحقق فيها الإضافة من إلغاء تثبيت إضافة Iconize لتنظيف أيقوناتها.",
    PLUGIN_INTEGRATIONS: "تكامل الإضافات",
    GRAPH_VIEW: "عرض الرسم البياني",
    LIKE_CARD_PROFILES_STAT: (p: number, s: number) =>
      `ملفّات شخصيّة: ${p} & قصاصات: ${s}`,
    LIKE_CARD_COLORS_STAT: "ألوان قابلة للتخصيص",
    LIKE_CARD_INTEGRATIONS_STAT: "تكامل الإضافات",
    LIKE_CARD_DAYS_STAT: "أيام الاستخدام",
    LIKE_CARD_STAR_BUTTON: "أضف  ★ على GitHub",
    LIKE_CARD_ISSUE_BUTTON: "أبلغ عن مشكلة",
    LIKE_CARD_SYNC_BUTTON: "مزامنة خزنتك",
    LIKE_CARD_GITHUB_BUTTON: "حسابي على GitHub",
    PASTE_CSS_MODAL_TITLE: "استيراد / لصق CSS",
    PASTE_CSS_MODAL_NOTE:
      "ملاحظة : كود CSS الذي تلصقه قد يؤثر على واجهة البرنامج، استخدم فقط الأكواد الموثوقة.",
    IMPORT_FROM_FILE: "استيراد من ملف",
    IMPORT_FROM_FILE_DESC: "أو، اختر ملف (.css) من جهاز الكمبيوتر الخاص بك.",
    CHOOSE_FILE_BUTTON: "اختر ملف...",
    CSS_TEXTAREA_PLACEHOLDER: "الصق كود CSS الخاص بك هنا...",
    SNIPPET_NAME_LABEL: "اسم القصاصة",
    CREATE_SNIPPET_TITLE: "إنشاء قصاصة CSS جديدة",
    IMPORT_PROFILE_TITLE: "استيراد / لصق CSS وإنشاء ملف شخصي",
    SNIPPET_NAME_PLACEHOLDER: "أدخل اسم القصاصة...",
    NOTICE_PROFILE_PINNED: "تم تثبيت ألوان الملف الشخصي بنجاح!",
    NOTICE_PROFILE_RESET: "تمت إعادة تعيين الملف الشخصي إلى اللقطة المثبتة.",
    NOTICE_NO_PINNED_SNAPSHOT: "لا توجد لقطة مثبتة لهذا الملف الشخصي.",
    NOTICE_PROFILE_NOT_FOUND: "تعذر العثور على الملف الشخصي النشط.",
    NOTICE_NO_PROFILES_FOUND: "لا توجد أيّة ملفات شخصيّة.",
    NOTICE_ACTIVE_PROFILE_SWITCHED: (name: string) =>
      `الملف الشخصي النشط: ${name}`,
    NOTICE_CANNOT_FIND_ORIGINAL_PROFILE:
      "تعذر العثور على البيانات الأصلية لهذا الملف الشخصي.",
    NOTICE_PROFILE_RESTORED: (name: string) =>
      `تمت استعادة الملف الشخصي "${name}" إلى حالته الافتراضية.`,
    NOTICE_GRAPH_COLORS_APPLIED: "تم تطبيق ألوان الرسم البياني!",
    NOTICE_INVALID_JSON: "ملف JSON غير صالح.",
    NOTICE_JSON_MUST_HAVE_NAME:
      "يجب أن يحتوي ملف JSON المستورد على خاصية 'name' لإنشاء ملف شخصي جديد.",
    NOTICE_PROFILE_CREATED_SUCCESS: (name: string) =>
      `تم إنشاء الملف الشخصي "${name}" بنجاح.`,
    NOTICE_PROFILE_IMPORTED_SUCCESS: (mode: string) =>
      `تم استيراد الملف الشخصي بنجاح.`,
    NOTICE_NO_ACTIVE_PROFILE_TO_COPY: "لا يوجد ملف شخصي نشط لنسخه",
    NOTICE_NO_ACTIVE_PROFILE_TO_EXPORT: "لا يوجد ملف شخصي نشط لتصديره.",
    NOTICE_SNIPPET_CSS_COPIED: "تم نسخ CSS القصاصة إلى الحافظة!",
    NOTICE_SNIPPET_EMPTY: "هذه القصاصة فارغة.",
    NOTICE_CSS_CONTENT_EMPTY: "لا يمكن أن يكون محتوى CSS فارغاً.",
    NOTICE_SNIPPET_NAME_EXISTS: (name: string) =>
      `اسم القصاصة "${name}" موجود بالفعل.`,
    NOTICE_PROFILE_NAME_EXISTS: (name: string) =>
      `اسم الملف الشخصي "${name}" موجود بالفعل.`,
    NOTICE_PROFILE_UPDATED: (name: string) =>
      `تم تحديث الملف الشخصي "${name}".`,
    NOTICE_SNIPPET_UPDATED: (name: string) => `تم تحديث القصاصة "${name}".`,
    NOTICE_SNIPPET_CREATED: (name: string) =>
      `تم إنشاء القصاصة "${name}" بنجاح!`,
    NOTICE_PROFILE_CREATED_FROM_CSS: (name: string) =>
      `تم إنشاء الملف الشخصي "${name}" بنجاح!`,
    NOTICE_NO_COLOR_HISTORY: "لا يوجد سجل ألوان لاستعادته.",
    NOTICE_COLOR_RESTORED: (color: string) => `تمت الاستعادة: ${color}`,
    NOTICE_TEXTBOX_EMPTY:
      "صندوق النص فارغ. الصق بعض بيانات JSON أو استورد ملفاً أولاً.",
    IMPORT_JSON_MODAL_TITLE: "لصق أو استيراد ملف JSON للملف شخصي",
    IMPORT_JSON_MODAL_DESC_1:
      "يمكنك لصق بيانات الملف الشخصي (JSON) في الصندوق أدناه.",
    IMPORT_JSON_MODAL_PLACEHOLDER: '{ "name": "...", "profile": { ... } }',
    IMPORT_JSON_MODAL_SETTING_NAME: "استيراد من ملف",
    IMPORT_JSON_MODAL_SETTING_DESC:
      "أو، اختر ملف الملف الشخصي (.json) من جهاز الكمبيوتر الخاص بك.",
    REPLACE_ACTIVE_BUTTON: "استبدال النشط",
    CREATE_NEW_BUTTON: "إنشاء جديدة",
    NOTICE_FILE_LOADED: (fileName: string) =>
      `تم تحميل الملف "${fileName}" في منطقة النص.`,
    NOTICE_EXPORT_SUCCESS: "تم تصدير الملف الشخصي بنجاح!",
    TOOLTIP_RESTORE_BUILTIN: "استعادة الألوان الأساسية المدمجة",
    TOOLTIP_EDIT_CSS_PROFILE: "تعديل تشكيلة CSS",
    TOOLTIP_PIN_SNAPSHOT: "تثبيت الألوان الحالية كلقطة",
    TOOLTIP_PIN_SNAPSHOT_DATE: (date: string) =>
      `تم تثبيت الألوان بتاريخ ${date}. انقر لإعادة التثبيت.`,
    TOOLTIP_RESET_TO_PINNED: "إعادة التعيين إلى الألوان المثبتة",
    TOOLTIP_EDIT_SNIPPET: "تعديل القصاصة",
    TOOLTIP_COPY_SNIPPET_CSS: "نسخ كود CSS إلى الحافظة",
    TOOLTIP_DELETE_SNIPPET: "حذف القصاصة",
    TOOLTIP_SET_TRANSPARENT: "تعيين إلى شفاف",
    TOOLTIP_UNDO_CHANGE: "تراجع عن آخر تغيير",
    ARIA_LABEL_CASE_SENSITIVE: "بحث حساس لحالة الأحرف",
    ARIA_LABEL_REGEX_SEARCH: "استخدام التعابير النمطية (Regex)",
    NOTICE_JSON_COPIED_CLIPBOARD:
      "تم نسخ الملف الشخصي بصيغة (.json) إلى الحافظة",
    MODAL_DELETE_SNIPPET_TITLE: (name: string) => `حذف القصاصة: ${name}`,
    MODAL_DELETE_SNIPPET_DESC:
      "هل أنت متأكد من رغبتك في حذف هذه القصاصة؟ لا يمكن التراجع عن هذا الإجراء.",
    RESET_PLUGIN_NAME: "إعادة تعيين الإضافة",
    RESET_PLUGIN_DESC:
      "سيؤدي هذا إلى حذف جميع الملفات الشخصية، والمقتطفات، والإعدادات، والخلفيات، وإعادة ضبط الإضافة إلى حالتها الأصلية. يتطلب هذا الإجراء إعادة تحميل التطبيق، ولا يمكن التراجع عنه.",
    RESET_PLUGIN_BUTTON: "إعادة تعيين كل البيانات...",
    RESET_CONFIRM_MODAL_TITLE: "هل أنت متأكد؟",
    RESET_CONFIRM_MODAL_DESC:
      "سيتم حذف جميع بيانات Color Master بشكل دائم (الملفات الشخصية، القصاصات، الإعدادات، والخلفيات). هذا الإجراء لا يمكن التراجع عنه.",
    RESET_SUCCESS_NOTICE:
      "تم حذف بيانات Color Master. يرجى إعادة تحميل Obsidian لتطبيق التغييرات.",
    RELOAD_BUTTON: "إعادة تحميل",
    NOTICE_FPS_UPDATED: (value: number) =>
      `تم تعيين معدل التحديث المباشر إلى: ${value}`,
    NOTICE_SNIPPET_COPIED: "تم نسخ كود القصاصة إلى الحافظة!",
    NOTICE_INVALID_PROFILE_OBJECT: "لا يبدو أن ملف JSON هو كائن ملف شخصي صالح.",
    NEW_PROFILE: "جديد",
    RESTORE_PROFILE_MODAL_TITLE: (name: string) =>
      `استعادة الملف الشخصي: ${name}`,
    RESTORE_PROFILE_MODAL_DESC: (name: string) =>
      `هل أنت متأكد من رغبتك في استعادة "${name}" إلى ألوانه الأصلية؟ ستفقد جميع تخصيصاتك للملف الشخصي هذا.`,
    NOTICE_PROFILE_CREATED: (name: string) =>
      `تم إنشاء الملف الشخصي "${name}" بنجاح!`,
    MARKDOWN: "عناصر الماركدوان",
    NOTICES: "الإشعارات",
    ADVANCED_NOTICE_TEXT_RULES_TITLE: "قواعد لون النص المتقدمة",
    ADVANCED_NOTICE_BG_RULES_TITLE: "قواعد لون الخلفية المتقدمة",
    ADD_NEW_RULE: "إضافة قاعدة جديدة",
    KEYWORD_PLACEHOLDER: "اكتب كلمة ثم اضغط مسافة...",
    USE_REGEX_LABEL: "Regex",
    DRAG_RULE_TOOLTIP: "اسحب لإعادة الترتيب",
    APPLY_BUTTON: "تطبيق",
    CANCEL_BUTTON: "إلغاء",
    MODAL_ADD_VAR_TITLE: "إضافة متغير CSS مخصص جديد",
    MODAL_ADD_VAR_DESC:
      "حدد متغير CSS جديد (مثال: --my-color: #f00). سيتم إضافة هذا المتغير إلى ملفك الشخصي النشط.",
    MODAL_VAR_DISPLAY_NAME: "اسم العرض",
    MODAL_VAR_DISPLAY_NAME_DESC:
      "اسم ودي للمتغير الخاص بك (مثال: 'لون أساسي مخصص لي').",
    MODAL_VAR_DISPLAY_NAME_PLACEHOLDER: "مثال: لوني الأساسي",
    MODAL_VAR_NAME: "اسم المتغير",
    MODAL_VAR_NAME_DESC:
      "الاسم الفعلي لمتغير CSS. يجب أن يبدأ بـ '--' (مثال: '--my-primary-color').",
    MODAL_VAR_NAME_PLACEHOLDER: "مثال: --my-primary-color",
    MODAL_VAR_VALUE: "قيمة المتغير",
    MODAL_VAR_VALUE_DESC:
      "قيمة متغير CSS (مثال: 'red', '#ff0000', 'rgb(255,0,0)').",
    MODAL_VAR_VALUE_PLACEHOLDER: "مثال: #FF0000 أو أحمر",
    MODAL_VAR_DESCRIPTION: "الوصف (اختياري)",
    MODAL_VAR_DESCRIPTION_DESC: "وصف موجز لما يتحكم فيه هذا المتغير.",
    MODAL_VAR_DESCRIPTION_PLACEHOLDER: "مثال: اللون الأساسي للعناوين",
    ERROR_VAR_NAME_PREFIX: "يجب أن يبدأ اسم المتغير بـ '--'",
    SETTINGS_SAVED: "تم تطبيق الإعدادات بنجاح!",
    MOVE_RULE_UP_TOOLTIP: "تحريك القاعدة للأعلى",
    MOVE_RULE_DOWN_TOOLTIP: "تحريك القاعدة للأسفل",
    DRAG_HANDLE_TOOLTIP: "اسحب لإعادة الترتيب",
    TOOLTIP_TEST_RULE: "تجربة القاعدة بكلمة عشوائية",
    NOTICE_TEST_SENTENCE: (word: string) =>
      `هكذا سيبدو لون إشعار يحتوي على كلمة "${word}"`,
    DUPLICATE_PROFILE_TITLE: "اسم الملف الشخصي مكرر",
    DUPLICATE_PROFILE_DESC_PARTS: [
      `الملف الشخصي "`,
      `" موجود بالفعل. الرجاء اختيار اسم مختلف.`,
    ],
    DUPLICATE_PROFILE_PLACEHOLDER: "أدخل اسم الملف الشخصي الجديد...",
    NOTICE_RULES_DESC:
      "أنشئ قواعد ذات أولوية لتلوين الإشعارات بناءً على محتواها. سيتم تطبيق أول قاعدة مطابقة من الأعلى إلى الأسفل.",
    CUSTOM_VARIABLES_HEADING: "المتغيرات المخصصة",
    CUSTOM_VARIABLE_DESC: "متغير مضاف من قبل المستخدم.",
    TOOLTIP_DELETE_CUSTOM_VARIABLE: "حذف المتغير المخصص",
    ADD_CUSTOM_VARIABLE_NAME: "إضافة متغير مخصص",
    ADD_CUSTOM_VARIABLE_DESC:
      "أضف متغير CSS جديد غير موجود بالقائمة الافتراضية. يجب أن يبدأ الاسم بـ '--'.",
    ADD_NEW_VARIABLE_BUTTON: "إضافة متغير جديد...",
    VARIABLE_NAME_LABEL: "اسم المتغير",
    VARIABLE_NAME_DESC:
      "الاسم التقني للمتغير في CSS، مثلاً: --my-custom-color.",
    COLOR_LABEL: "قيمة اللون",
    VARIABLE_NAME_PLACEHOLDER: "--اسم-المتغير",
    NOTICE_VAR_NAME_EMPTY: "اسم المتغير لا يمكن أن يكون فارغاً.",
    NOTICE_VAR_NAME_FORMAT: "يجب أن يبدأ اسم المتغير بـ '--'.",
    NOTICE_VAR_EXISTS: (name: string) => `المتغير "${name}" موجود بالفعل.`,
    NOTICE_VAR_ADDED: (name: string) => `تمت إضافة المتغير "${name}" بنجاح.`,
    HELP_TEXT_PRE_LINK: "لم تجد المتغير الذي تبحث عنه؟ ",
    HELP_TEXT_LINK: "تصفح قائمة متغيرات CSS الرسمية في Obsidian.",
    MODAL_CUSTOM_VAR_TITLE: "إضافة تفاصيل المتغير المخصص",
    ADD_BUTTON: "إضافة",
    DISPLAY_NAME_LABEL: "اسم العرض",
    DISPLAY_NAME_DESC: "هذا هو الاسم السهل الذي سيظهر في قائمة الإعدادات.",
    DESCRIPTION_LABEL: "الوصف",
    DESCRIPTION_DESC: "اشرح الغرض من استخدام متغير اللون هذا.",
    SAVE_BUTTON: "حفظ المتغير",
    PLACEHOLDER_DISPLAY_NAME: "مثلاً: لون الخلفية الأساسي",
    PLACEHOLDER_DESCRIPTION: "مثلاً: يستخدم لخلفية المحرر الرئيسية...",
    RTL_LAYOUT_NAME: "تفعيل تنسيق اليمين لليسار (RTL)",
    RTL_LAYOUT_DESC:
      "عند تفعيله، يتم قلب واجهة الإضافة لتتناسب مع اللغات التي تكتب من اليمين لليسار.",
    LANGUAGE_SETTINGS_TITLE: "إعدادات اللغة",
    SAVE_AS_GLOBAL_SNIPPET_NAME: "حفظ كقصاصة عامة",
    SAVE_AS_GLOBAL_SNIPPET_DESC:
      "القصاصة العامة يتم تطبيقها على جميع ملفاتك الشخصية.",
    NOTICE_MOVE_SNIPPET_SCOPE: "استخدم نافذة التعديل لنقل القصاصة بين الأقسام.",
    ICONIZE_SETTINGS_MODAL_TITLE: "إعدادات تكامل Iconize",
    TOOLTIP_ICONIZE_SETTINGS: "إعدادات Iconize",
    THEME_WARNING_TOOLTIP: (currentTheme: string) =>
      `الثيم "${currentTheme}" مطبّق حالياً، وقد يتعارض مع مظهر الملف الشخصي. للحصول على أفضل النتائج، ننصح بالتبديل إلى الثيم الافتراضي لأوبسيديان، أو يمكنك استيراد ثيم "${currentTheme}" كملف شخصي جديد لتعديله مباشرةً.`,
    IMPORT_FROM_INSTALLED_THEME: "استيراد من ثيم مثبّت",
    IMPORT_FROM_INSTALLED_THEME_DESC:
      "قم بتحميل CSS مباشرة من أحد الثيمات المثبتة لديك.",
    IMPORT_BUTTON: "استيراد",
    NOTICE_THEME_CSS_LOADED: (theme: string) =>
      `تم تحميل CSS بنجاح من ثيم "${theme}".`,
    NOTICE_THEME_READ_FAILED: (theme: string) =>
      `تعذّر قراءة ملف الثيم "${theme}". قد يكون الملف محمياً أو مفقوداً.`,
    IMPORT_FROM_INSTALLED_SNIPPET: "استيراد من قصاصة مثبتة",
    IMPORT_FROM_INSTALLED_SNIPPET_DESC:
      "قم بتحميل CSS مباشرة من إحدى قصاصات Obsidian المثبتة لديك.",
    NOTICE_SNIPPET_LOADED: (snippet: string) =>
      `تم تحميل CSS بنجاح من قصاصة "${snippet}".`,
    NOTICE_SNIPPET_READ_FAILED: (snippet: string) =>
      `تعذّرت قراءة ملف القصاصة "${snippet}".`,
    NO_THEMES_INSTALLED: "لا يوجد ثيمات مثبتة",
    NO_SNIPPETS_INSTALLED: "لا يوجد قصاصات مثبتة",
    TOOLTIP_THEME_LIGHT: "الثيم: فرض الوضع الفاتح (اضغط للتبديل للغامق)",
    TOOLTIP_THEME_DARK: "الثيم: فرض الوضع الغامق (اضغط للتبديل للتلقائي)",
    TOOLTIP_THEME_AUTO: "الثيم: تلقائي (يتبع أوبسيديان) (اضغط للتبديل للفاتح)",
    TOOLTIP_EXPORT_PROFILE: "تصدير الملف الشخصي الحالي كملف JSON",
    TOOLTIP_COPY_JSON: "نسخ JSON للملف الشخصي الحالي إلى الحافظة",
    NOTICE_JSON_COPIED: "تم نسخ JSON للملف الشخصي إلى الحافظة بنجاح!",
    TOGGLE_THEME_COMMAND: "تبديل ثيم الملف الشخصي النشط",
    NOTICE_THEME_SWITCHED_LIGHT: "تم التبديل إلى الوضع الفاتح",
    NOTICE_THEME_SWITCHED_DARK: "تم التبديل إلى الوضع الغامق",
    NOTICE_THEME_SWITCHED_AUTO: "تم التبديل إلى الوضع التلقائي",
    COMMAND_ENABLE_DISABLE: "تفعيل وتعطيل",
    COMMAND_CYCLE_NEXT: "الانتقال للبروفايل التالي",
    COMMAND_CYCLE_PREVIOUS: "الانتقال للبروفايل السابق",
    COMMAND_OPEN_SETTINGS: "فتح نافذة الإعدادات",
    RIBBON_TOOLTIP_SETTINGS: "إعدادات Color Master",
    REGEX_PLACEHOLDER: "أدخل التعبير النمطي واضغط Enter...",
    SET_BACKGROUND_IMAGE_NAME: "تعيين خلفية مخصصة",
    SET_BACKGROUND_IMAGE_DESC: "تعيين صورة خلفية مخصصة لملفك الشخصي النشط.",
    SET_BACKGROUND_IMAGE_BUTTON: "اختر صورة...",
    REMOVE_BACKGROUND_IMAGE_BUTTON: "إزالة الخلفية",
    NOTICE_BACKGROUND_IMAGE_SET: "تم تعيين صورة الخلفية بنجاح.",
    NOTICE_BACKGROUND_IMAGE_REMOVED: "تمت إزالة صورة الخلفية.",
    NOTICE_IMAGE_LOAD_ERROR: "فشل تحميل الصورة.",
    TOOLTIP_ADD_BACKGROUND_IMAGE: "إضافة صورة خلفية",
    TOOLTIP_REMOVE_BACKGROUND_IMAGE: "إزالة صورة الخلفية",
    TOOLTIP_BACKGROUND_IMAGE_SETTINGS: "إعدادات صورة الخلفية",
    TOOLTIP_BROWSE_BACKGROUND_IMAGES: "استعراض صور الخلفية المخزنة",
    NOTICE_NO_BACKGROUND_IMAGE_TO_REMOVE:
      "لا توجد صورة خلفية نشطة لهذا الملف الشخصي لإزالتها.",
    NOTICE_BACKGROUND_IMAGE_DELETED: "تم حذف صورة الخلفية وملفها بنجاح.",
    CONFIRM_BACKGROUND_DELETION_TITLE: "تأكيد حذف الخلفية",
    CONFIRM_BACKGROUND_DELETION_DESC:
      "هل أنت متأكد من رغبتك في حذف صورة الخلفية الحالية؟ سيتم حذف ملف الصورة بشكل دائم من القبو الخاص بك.",
    DELETE_ANYWAY_BUTTON: "حذف على أي حال",
    NOTICE_BACKGROUND_IMAGE_NOT_FOUND: (path: string) =>
      `الملف الشخصي يتطلب صورة خلفية في المسار '${path}'، لكن لم يتم العثور على الملف. يرجى إضافة الصورة إلى هذا المسار.`,
    NOTICE_BACKGROUND_FOLDER_NOT_FOUND:
      "تعذر العثور على مجلد الخلفيات '.obsidian/backgrounds'.",
    FILE_CONFLICT_TITLE: "الملف موجود",
    FILE_CONFLICT_DESC: (name: string) =>
      `يوجد ملف باسم '${name}' موجود مسبقاً في مجلد الخلفيات. ماذا تريد أن تفعل؟`,
    REPLACE_FILE_BUTTON: "استبدال الملف",
    KEEP_BOTH_BUTTON: "الاحتفاظ بكليهما (إعادة تسمية)",
    ADD_NEW_BACKGROUND_IMAGE_TITLE: "إضافة صورة خلفية جديدة",
    IMPORT_FROM_FILE_BUTTON: "استيراد من ملف",
    NOTICE_URL_LOAD_ERROR: "فشل تحميل الصورة من الرابط.",
    IMPORT_FROM_FILE_DESC_MODAL:
      "استيراد ملف صورة من جهاز الكمبيوتر الخاص بك لاستخدامه كخلفية.",
    PASTE_BOX_PLACEHOLDER: "اسحب وأفلت / أو الصق صورة / رابط هنا (Ctrl+V)",
    NOTICE_PASTE_ERROR: "المحتوى الذي تم لصقه ليس صورة أو رابط صالح.",
    DROP_TO_ADD_IMAGE: "أفلتها لإضافة الصورة...",
    PROCESSING_IMAGE: "جاري المعالجة",
    PROFILE_IMAGE_BROWSER_TITLE: "خلفيات الملف الشخصي",
    NO_IMAGES_FOUND: "لا توجد صور في مجلد الخلفيات الخاص بهذا الملف الشخصي.",
    SELECT_BUTTON: "اختيار",
    CONFIRM_IMAGE_DELETE_TITLE: "حذف الصورة؟",
    CONFIRM_IMAGE_DELETE_DESC: (name: string) =>
      `هل أنت متأكد من رغبتك في حذف '${name}' بشكل دائم؟`,
    BROWSE_BUTTON: "استعراض...",
    NOTICE_INVALID_FILENAME: "اسم الملف غير صالح.",
    NOTICE_FILENAME_EXISTS: (name: string) =>
      `اسم الملف "${name}" موجود مسبقاً.`,
    NOTICE_RENAME_SUCCESS: (name: string) => `تمت إعادة التسمية إلى "${name}"`,
    NOTICE_RENAME_ERROR: "خطأ أثناء إعادة تسمية الملف.",
    SETTING_BACKGROUND_ENABLE_NAME: "تفعيل صورة الخلفية",
    SETTING_BACKGROUND_ENABLE_DESC:
      "التحكم بظهور أو إخفاء صورة الخلفية المخصصة لهذا الملف الشخصي.",
  },
  fa: {
    PLUGIN_NAME: "استاد رنگ - v1.1.0",
    ENABLE_PLUGIN: "فعال کردن استاد رنگ",
    ENABLE_PLUGIN_DESC:
      "این گزینه را برای غیرفعال کردن موقت تمام رنگ‌های سفارشی و بازگشت به تم فعال Obsidian خود خاموش کنید.",
    PLUGIN_ENABLED_NOTICE: "استاد رنگ فعال شد",
    PLUGIN_DISABLED_NOTICE: "استاد رنگ غیرفعال شد",
    LANGUAGE: "زبان",
    LANGUAGE_DESC: "زبان رابط کاربری افزونه را تنظیم کنید.",
    PROFILE_MANAGER: "مدیریت پروفایل",
    RESET_CONFIRM_TITLE: "تأیید بازنشانی پروفایل",
    RESET_CONFIRM_DESC:
      "آیا مطمئن هستید که می‌خواهید این پروفایل را به آخرین عکس فوری پین شده بازنشانی کنید؟ این کار رنگ‌های فعلی شما را بازنویسی می‌کند و قابل بازگشت نیست.",
    ACTIVE_PROFILE: "پروفایل فعال",
    ACTIVE_PROFILE_DESC: "مدیریت و جابجایی بین پروفایل‌های رنگ.",
    NEW_BUTTON: "جدید",
    DELETE_BUTTON: "حذف",
    OPTIONS_HEADING: "تنظیمات پیشرفته",
    UPDATE_FREQUENCY_NAME: "فریم در ثانیه به‌روزرسانی زنده",
    UPDATE_FREQUENCY_DESC:
      "تعداد دفعاتی که رابط کاربری در هر ثانیه پیش‌نمایش تغییرات رنگ را هنگام کشیدن نشان می‌دهد تنظیم می‌کند (0 = غیرفعال کردن پیش‌نمایش زنده). مقادیر کمتر می‌تواند عملکرد را بهبود بخشد.",
    OVERRIDE_ICONIZE: "نادیده گرفتن رنگ‌های افزونه Iconize",
    OVERRIDE_ICONIZE_DESC:
      "اجازه دهید استاد رنگ تمام رنگ‌های آیکون‌های افزونه Iconize را کنترل کند. برای بهترین نتایج، تنظیمات رنگ را در خود Iconize غیرفعال کنید.",
    ICONIZE_NOT_FOUND_NOTICE:
      "افزونه Iconize یافت نشد. لطفاً برای استفاده از این ویژگی آن را نصب و فعال کنید.",
    BACKGROUNDS: "پس‌زمینه‌ها",
    TEXT: "متن",
    INTERACTIVE_ELEMENTS: "عناصر تعاملی",
    UI_ELEMENTS: "عناصر رابط کاربری",
    MISC: "متفرقه",
    NEW_PROFILE_TITLE: "ایجاد پروفایل جدید",
    PROFILE_NAME_LABEL: "نام پروفایل",
    PROFILE_NAME_PLACEHOLDER: "نام پروفایل را وارد کنید...",
    CREATE_BUTTON: "ایجاد",
    EMPTY_PROFILE_NAME_NOTICE: "نام پروفایل نمی‌تواند خالی باشد.",
    PROFILE_EXISTS_NOTICE: (name: string) =>
      `پروفایل "${name}" از قبل وجود دارد.`,
    DELETE_PROFILE_TITLE: "حذف پروفایل",
    DELETE_PROFILE_CONFIRMATION: (name: string) =>
      `آیا مطمئن هستید که می‌خواهید پروفایل "${name}" را حذف کنید؟ این عمل قابل بازگشت نیست.`,
    SNIPPETS_HEADING: "قطعه کدهای CSS",
    SAVE_AS_TYPE: "ذخیره به عنوان",
    SAVE_AS_PROFILE: "پروفایل",
    SAVE_AS_SNIPPET: "قطعه کد",
    EDIT_SNIPPET_TITLE: "ویرایش قطعه کد CSS",
    EDIT_PROFILE_TITLE: "ویرایش پروفایل CSS",
    PROFILE_DELETED_NOTICE: "پروفایل حذف شد.",
    CANNOT_DELETE_LAST_PROFILE: "نمی‌توان آخرین پروفایل را حذف کرد.",
    PROFILE_THEME_TYPE: "نوع تم پروفایل",
    PROFILE_THEME_TYPE_DESC:
      "تنظیم کنید که آیا این پروفایل باید هنگام فعال شدن یک تم خاص (تاریک/روشن) را اعمال کند.",
    THEME_TYPE_AUTO: "تم پیش‌فرض Obsidian",
    THEME_TYPE_DARK: "اعمال حالت تاریک",
    THEME_TYPE_LIGHT: "اعمال حالت روشن",
    RESTORE_BUTTON: "بازیابی",
    RESET_BUTTON: "بازنشانی",
    UPDATE_BUTTON: "به‌روزرسانی",
    SEARCH_PLACEHOLDER: "جستجوی متغیرها (نام یا مقدار)...",
    CLEAR_BUTTON: "پاک کردن",
    SEARCH_RESULTS_FOUND: (count: number) => `${count} مورد یافت شد`,
    ALL_SECTIONS: "همه بخش‌ها",
    EXPORT_FILE_BUTTON: "خروجی گرفتن از فایل",
    COPY_JSON_BUTTON: "کپی کردن JSON",
    IMPORT_PASTE_CSS_BUTTON: "وارد کردن / چسباندن (.css)",
    IMPORT_PASTE_JSON_BUTTON: "وارد کردن / چسباندن (.json)",
    CREATE_SNIPPET_BUTTON: "ایجاد قطعه کد جدید",
    NO_SNIPPETS_DESC: "هنوز هیچ قطعه کد CSS برای این پروفایل ایجاد نشده است.",
    CLEANUP_INTERVAL_NAME: "فاصله زمانی پاکسازی",
    CLEANUP_INTERVAL_DESC:
      "هر چند ثانیه یکبار افزونه برای پاکسازی آیکون‌های افزونه حذف شده Iconize بررسی می‌کند.",
    PLUGIN_INTEGRATIONS: "ادغام با افزونه‌ها",
    GRAPH_VIEW: "نمای گراف",
    LIKE_CARD_PROFILES_STAT: (p: number, s: number) =>
      `پروفایل‌ها: ${p} و قطعه کدها: ${s}`,
    LIKE_CARD_COLORS_STAT: "رنگ‌های قابل تنظیم",
    LIKE_CARD_INTEGRATIONS_STAT: "ادغام با افزونه‌ها",
    LIKE_CARD_DAYS_STAT: "روزهای استفاده",
    LIKE_CARD_STAR_BUTTON: "ستاره در گیت‌هاب",
    LIKE_CARD_ISSUE_BUTTON: "گزارش مشکل",
    LIKE_CARD_SYNC_BUTTON: "همگام‌سازی صندوق شما",
    LIKE_CARD_GITHUB_BUTTON: "گیت‌هاب من",
    PASTE_CSS_MODAL_TITLE: "وارد کردن / چسباندن CSS",
    PASTE_CSS_MODAL_NOTE:
      "توجه: CSS چسبانده شده می‌تواند بر رابط کاربری تأثیر بگذارد، فقط با CSS معتبر ادامه دهید.",
    IMPORT_FROM_FILE: "وارد کردن از فایل",
    IMPORT_FROM_FILE_DESC: "یا، یک فایل (.css) را از کامپیوتر خود انتخاب کنید.",
    CHOOSE_FILE_BUTTON: "انتخاب فایل...",
    CSS_TEXTAREA_PLACEHOLDER: "کد CSS خود را اینجا جایگذاری کنید...",
    SNIPPET_NAME_LABEL: "نام قطعه کد",
    CREATE_SNIPPET_TITLE: "ایجاد قطعه کد CSS جدید",
    IMPORT_PROFILE_TITLE: "وارد کردن / چسباندن CSS و ایجاد پروفایل",
    SNIPPET_NAME_PLACEHOLDER: "نام قطعه کد را وارد کنید...",
    NOTICE_PROFILE_PINNED: "رنگ‌های پروفایل با موفقیت پین شدند!",
    NOTICE_PROFILE_RESET: "پروفایل به عکس فوری پین شده بازنشانی شد.",
    NOTICE_NO_PINNED_SNAPSHOT:
      "هیچ عکس فوری پین شده‌ای برای این پروفایل یافت نشد.",
    NOTICE_PROFILE_NOT_FOUND: "پروفایل فعال یافت نشد.",
    NOTICE_NO_PROFILES_FOUND: "هیچ پروفایلی یافت نشد.",
    NOTICE_ACTIVE_PROFILE_SWITCHED: (name: string) => `پروفایل فعال: ${name}`,
    NOTICE_CANNOT_FIND_ORIGINAL_PROFILE:
      "داده‌های اصلی برای این پروفایل یافت نشد.",
    NOTICE_PROFILE_RESTORED: (name: string) =>
      `پروفایل "${name}" به حالت پیش‌فرض خود بازگردانده شد.`,
    NOTICE_GRAPH_COLORS_APPLIED: "رنگ‌های گراف اعمال شد!",
    NOTICE_INVALID_JSON: "JSON نامعتبر است.",
    NOTICE_JSON_MUST_HAVE_NAME:
      "JSON وارد شده برای ایجاد پروفایل جدید باید دارای ویژگی 'name' باشد.",
    NOTICE_PROFILE_CREATED_SUCCESS: (name: string) =>
      `پروفایل "${name}" با موفقیت ایجاد شد.`,
    NOTICE_PROFILE_IMPORTED_SUCCESS: (mode: string) =>
      `پروفایل با موفقیت ${mode} شد.`,
    NOTICE_NO_ACTIVE_PROFILE_TO_COPY: "هیچ پروفایل فعالی برای کپی وجود ندارد.",
    NOTICE_NO_ACTIVE_PROFILE_TO_EXPORT:
      "هیچ پروفایل فعالی برای خروجی گرفتن وجود ندارد.",
    NOTICE_SNIPPET_CSS_COPIED: "CSS قطعه کد در کلیپ‌بورد کپی شد!",
    NOTICE_SNIPPET_EMPTY: "این قطعه کد خالی است.",
    NOTICE_CSS_CONTENT_EMPTY: "محتوای CSS نمی‌تواند خالی باشد.",
    NOTICE_SNIPPET_NAME_EXISTS: (name: string) =>
      `نام قطعه کد "${name}" از قبل وجود دارد.`,
    NOTICE_PROFILE_NAME_EXISTS: (name: string) =>
      `نام پروفایل "${name}" از قبل وجود دارد.`,
    NOTICE_PROFILE_UPDATED: (name: string) =>
      `پروفایل "${name}" به‌روزرسانی شد.`,
    NOTICE_SNIPPET_UPDATED: (name: string) =>
      `قطعه کد "${name}" به‌روزرسانی شد.`,
    NOTICE_SNIPPET_CREATED: (name: string) =>
      `قطعه کد "${name}" با موفقیت ایجاد شد!`,
    NOTICE_PROFILE_CREATED_FROM_CSS: (name: string) =>
      `پروفایل "${name}" با موفقیت ایجاد شد!`,
    NOTICE_NO_COLOR_HISTORY: "هیچ تاریخچه رنگی برای بازیابی وجود ندارد.",
    NOTICE_COLOR_RESTORED: (color: string) => `بازیابی شد: ${color}`,
    NOTICE_TEXTBOX_EMPTY:
      "کادر متنی خالی است. ابتدا مقداری JSON بچسبانید یا یک فایل وارد کنید.",
    IMPORT_JSON_MODAL_TITLE: "چسباندن یا وارد کردن JSON پروفایل",
    IMPORT_JSON_MODAL_DESC_1:
      "می‌توانید یک JSON پروفایل را در کادر زیر بچسبانید.",
    IMPORT_JSON_MODAL_PLACEHOLDER: '{ "name": "...", "profile": { ... } }',
    IMPORT_JSON_MODAL_SETTING_NAME: "وارد کردن از فایل",
    IMPORT_JSON_MODAL_SETTING_DESC:
      "یا، یک فایل پروفایل (.json) را از کامپیوتر خود انتخاب کنید.",
    REPLACE_ACTIVE_BUTTON: "جایگزینی فعال",
    CREATE_NEW_BUTTON: "ایجاد جدید",
    NOTICE_FILE_LOADED: (fileName: string) =>
      `فایل "${fileName}" در ناحیه متنی بارگذاری شد.`,
    NOTICE_EXPORT_SUCCESS: "پروفایل با موفقیت خروجی گرفته شد!",
    TOOLTIP_RESTORE_BUILTIN: "بازیابی به رنگ‌های اصلی داخلی",
    TOOLTIP_EDIT_CSS_PROFILE: "ویرایش پروفایل CSS",
    TOOLTIP_PIN_SNAPSHOT: "پین کردن رنگ‌های فعلی به عنوان یک عکس فوری",
    TOOLTIP_PIN_SNAPSHOT_DATE: (date: string) =>
      `رنگ‌ها در تاریخ ${date} پین شدند. برای پین مجدد کلیک کنید.`,
    TOOLTIP_RESET_TO_PINNED: "بازنشانی به رنگ‌های پین شده",
    TOOLTIP_EDIT_SNIPPET: "ویرایش قطعه کد",
    TOOLTIP_COPY_SNIPPET_CSS: "کپی کردن CSS در کلیپ‌بورد",
    TOOLTIP_DELETE_SNIPPET: "حذف قطعه کد",
    TOOLTIP_SET_TRANSPARENT: "تنظیم به شفاف",
    TOOLTIP_UNDO_CHANGE: "لغو آخرین تغییر",
    ARIA_LABEL_CASE_SENSITIVE: "جستجوی حساس به حروف بزرگ و کوچک",
    ARIA_LABEL_REGEX_SEARCH: "استفاده از عبارت منظم",
    NOTICE_JSON_COPIED_CLIPBOARD: "JSON پروفایل در کلیپ‌بورد کپی شد.",
    MODAL_DELETE_SNIPPET_TITLE: (name: string) => `حذف قطعه کد: ${name}`,
    MODAL_DELETE_SNIPPET_DESC:
      "آیا مطمئن هستید که می‌خواهید این قطعه کد را حذف کنید؟ این عمل قابل بازگشت نیست.",
    RESET_PLUGIN_NAME: "بازنشانی تنظیمات افزونه",
    RESET_PLUGIN_DESC:
      "این کار تمام پروفایل‌ها، قطعه کدها، تنظیمات و پس‌زمینه‌ها را حذف می‌کند و افزونه را به حالت اولیه‌اش بازنشانی می‌کند. این عمل نیاز به بارگذاری مجدد برنامه دارد و قابل بازگشت نیست.",
    RESET_PLUGIN_BUTTON: "بازنشانی تمام داده‌ها...",
    RESET_CONFIRM_MODAL_TITLE: "آیا مطمئن هستید؟",
    RESET_CONFIRM_MODAL_DESC:
      "این کار تمام داده‌های Color Master شما (پروفایل‌ها، قطعه کدها، تنظیمات و پس‌زمینه‌ها) را برای همیشه حذف می‌کند. این غیرقابل برگشت است.",
    RESET_SUCCESS_NOTICE:
      "داده‌های استاد رنگ حذف شد. لطفاً برای اعمال تغییرات Obsidian را مجدداً بارگذاری کنید.",
    RELOAD_BUTTON: "بارگذاری مجدد",
    NOTICE_FPS_UPDATED: (value: number) =>
      `فریم در ثانیه به‌روزرسانی زنده روی ${value} تنظیم شد`,
    NOTICE_SNIPPET_COPIED: "CSS قطعه کد در کلیپ‌بورد کپی شد!",
    NOTICE_INVALID_PROFILE_OBJECT:
      "JSON به نظر نمی‌رسد یک شی پروفایل معتبر باشد.",
    NEW_PROFILE: "جدید",
    RESTORE_PROFILE_MODAL_TITLE: (name: string) => `بازیابی پروفایل: ${name}`,
    RESTORE_PROFILE_MODAL_DESC: (name: string) =>
      `آیا مطمئن هستید که می‌خواهید "${name}" را به رنگ‌های اصلی خود بازگردانید؟ تمام سفارشی‌سازی‌های شما برای این پروفایل از بین خواهد رفت.`,
    NOTICE_PROFILE_CREATED: (name: string) =>
      `پروفایل "${name}" با موفقیت ایجاد شد!`,
    MARKDOWN: "مارک‌داون",
    NOTICES: "اعلان‌ها",
    ADVANCED_NOTICE_TEXT_RULES_TITLE: "قوانین پیشرفته رنگ متن",
    ADVANCED_NOTICE_BG_RULES_TITLE: "قوانین پیشرفته رنگ پس‌زمینه",
    ADD_NEW_RULE: "افزودن قانون جدید",
    KEYWORD_PLACEHOLDER: "یک کلمه کلیدی تایپ کنید و فاصله را فشار دهید...",
    USE_REGEX_LABEL: "عبارت منظم",
    DRAG_RULE_TOOLTIP: "برای ترتیب مجدد بکشید",
    APPLY_BUTTON: "اعمال",
    CANCEL_BUTTON: "لغو",
    MODAL_ADD_VAR_TITLE: "افزودن متغیر جدید CSS سفارشی",
    MODAL_ADD_VAR_DESC:
      "یک متغیر CSS جدید تعریف کنید (مانند --my-color: #f00). این متغیر به پروفایل فعال شما اضافه خواهد شد.",
    MODAL_VAR_DISPLAY_NAME: "نام نمایشی",
    MODAL_VAR_DISPLAY_NAME_DESC:
      "یک نام دوستانه برای متغیر شما (مانند 'رنگ اصلی سفارشی من').",
    MODAL_VAR_DISPLAY_NAME_PLACEHOLDER: "مثال: رنگ اصلی من",
    MODAL_VAR_NAME: "نام متغیر",
    MODAL_VAR_NAME_DESC:
      "نام واقعی متغیر CSS. باید با '--' شروع شود (مانند '--my-primary-color').",
    MODAL_VAR_NAME_PLACEHOLDER: "مثال: --my-primary-color",
    MODAL_VAR_VALUE: "مقدار متغیر",
    MODAL_VAR_VALUE_DESC:
      "مقدار متغیر CSS (مانند 'red', '#ff0000', 'rgb(255,0,0)').",
    MODAL_VAR_VALUE_PLACEHOLDER: "مثال: #FF0000 یا قرمز",
    MODAL_VAR_DESCRIPTION: "توضیحات (اختیاری)",
    MODAL_VAR_DESCRIPTION_DESC:
      "توضیح مختصری در مورد آنچه این متغیر کنترل می‌کند.",
    MODAL_VAR_DESCRIPTION_PLACEHOLDER: "مثال: رنگ اصلی برای عناوین",
    ERROR_VAR_NAME_PREFIX: "نام متغیر باید با '--' شروع شود",
    SETTINGS_SAVED: "تنظیمات با موفقیت اعمال شد!",
    MOVE_RULE_UP_TOOLTIP: "قانون را به بالا ببرید",
    MOVE_RULE_DOWN_TOOLTIP: "قانون را به پایین ببرید",
    DRAG_HANDLE_TOOLTIP: "برای ترتیب مجدد بکشید",
    TOOLTIP_TEST_RULE: "این قانون را با یک کلمه کلیدی تصادفی آزمایش کنید",
    NOTICE_TEST_SENTENCE: (word: string) =>
      `رنگ اعلان برای "${word}" به این شکل است:`,
    DUPLICATE_PROFILE_TITLE: "نام پروفایل تکراری",
    DUPLICATE_PROFILE_DESC_PARTS: [
      `نام پروفایل "`,
      `" از قبل وجود دارد. لطفاً نام دیگری انتخاب کنید.`,
    ],
    DUPLICATE_PROFILE_PLACEHOLDER: "نام پروفایل جدید را وارد کنید...",
    NOTICE_RULES_DESC:
      "قوانین اولویت‌بندی شده برای رنگ‌آمیزی اعلان‌ها بر اساس محتوای آنها ایجاد کنید. اولین قانون منطبق از بالا به پایین اعمال خواهد شد.",
    CUSTOM_VARIABLES_HEADING: "متغیرهای سفارشی",
    CUSTOM_VARIABLE_DESC: "متغیر اضافه شده توسط کاربر.",
    TOOLTIP_DELETE_CUSTOM_VARIABLE: "حذف متغیر سفارشی",
    ADD_CUSTOM_VARIABLE_NAME: "افزودن متغیر سفارشی",
    ADD_CUSTOM_VARIABLE_DESC:
      "یک متغیر CSS جدید که در لیست پیش‌فرض نیست اضافه کنید. نام باید با '--' شروع شود.",
    ADD_NEW_VARIABLE_BUTTON: "افزودن متغیر جدید...",
    VARIABLE_NAME_LABEL: "نام متغیر",
    VARIABLE_NAME_DESC: "نام فنی CSS، به عنوان مثال --my-custom-color.",
    COLOR_LABEL: "مقدار رنگ",
    VARIABLE_NAME_PLACEHOLDER: "--variable-name",
    NOTICE_VAR_NAME_EMPTY: "نام متغیر نمی‌تواند خالی باشد.",
    NOTICE_VAR_NAME_FORMAT: "نام متغیر باید با '--' شروع شود.",
    NOTICE_VAR_EXISTS: (name: string) => `متغیر "${name}" از قبل وجود دارد.`,
    NOTICE_VAR_ADDED: (name: string) => `متغیر "${name}" با موفقیت اضافه شد.`,
    HELP_TEXT_PRE_LINK: "متغیری که به دنبال آن هستید را پیدا نمی‌کنید؟ ",
    HELP_TEXT_LINK: "لیست رسمی متغیرهای CSS Obsidian را مرور کنید.",
    MODAL_CUSTOM_VAR_TITLE: "افزودن جزئیات متغیر سفارشی",
    ADD_BUTTON: "افزودن",
    DISPLAY_NAME_LABEL: "نام نمایشی",
    DISPLAY_NAME_DESC: "این نام کاربرپسندی است که در لیست تنظیمات ظاهر می‌شود.",
    DESCRIPTION_LABEL: "توضیحات",
    DESCRIPTION_DESC: "توضیح دهید که این متغیر رنگ برای چه استفاده می‌شود.",
    SAVE_BUTTON: "ذخیره متغیر",
    PLACEHOLDER_DISPLAY_NAME: "مثلاً: رنگ پس‌زمینه اصلی",
    PLACEHOLDER_DESCRIPTION: "مثلاً: برای تغییر اندازه فونت استفاده می‌شود...",
    RTL_LAYOUT_NAME: "فعال کردن چیدمان راست به چپ (RTL)",
    RTL_LAYOUT_DESC:
      "هنگامی که فعال باشد، رابط کاربری افزونه برای پشتیبانی صحیح از زبان‌های راست به چپ برعکس می‌شود.",
    LANGUAGE_SETTINGS_TITLE: "تنظیمات زبان",
    SAVE_AS_GLOBAL_SNIPPET_NAME: "ذخیره به عنوان قطعه کد سراسری",
    SAVE_AS_GLOBAL_SNIPPET_DESC:
      "یک قطعه کد سراسری بر روی تمام پروفایل‌های شما اعمال می‌شود.",
    NOTICE_MOVE_SNIPPET_SCOPE:
      "برای جابجایی قطعه کد بین بخش‌ها از پنجره ویرایش استفاده کنید.",
    ICONIZE_SETTINGS_MODAL_TITLE: "تنظیمات ادغام Iconize",
    TOOLTIP_ICONIZE_SETTINGS: "تنظیمات Iconize",
    THEME_WARNING_TOOLTIP: (currentTheme: string) =>
      `تم انجمن "${currentTheme}" فعال است که ممکن است با ظاهر پروفایل تداخل داشته باشد. برای بهترین نتیجه، به تم پیش‌فرض Obsidian بروید یا تم "${currentTheme}" را به عنوان یک پروفایل CSS جدید وارد کرده و مستقیماً آن را ویرایش کنید.`,
    IMPORT_FROM_INSTALLED_THEME: "وارد کردن از تم نصب شده",
    IMPORT_FROM_INSTALLED_THEME_DESC:
      "به سرعت CSS را از یکی از تم‌های نصب شده خود بارگیری کنید.",
    IMPORT_BUTTON: "وارد کردن",
    NOTICE_THEME_CSS_LOADED: (theme: string) =>
      `CSS با موفقیت از تم "${theme}" بارگیری شد.`,
    NOTICE_THEME_READ_FAILED: (theme: string) =>
      `فایل تم "${theme}" خوانده نشد. ممکن است فایل محافظت شده یا موجود نباشد.`,
    IMPORT_FROM_INSTALLED_SNIPPET: "وارد کردن از قطعه کد نصب شده",
    IMPORT_FROM_INSTALLED_SNIPPET_DESC:
      "به سرعت CSS را از یکی از قطعه کدهای نصب شده Obsidian خود بارگیری کنید.",
    NOTICE_SNIPPET_LOADED: (snippet: string) =>
      `CSS با موفقیت از قطعه کد "${snippet}" بارگیری شد.`,
    NOTICE_SNIPPET_READ_FAILED: (snippet: string) =>
      `فایل قطعه کد "${snippet}" خوانده نشد.`,
    NO_THEMES_INSTALLED: "هیچ تمی نصب نشده است",
    NO_SNIPPETS_INSTALLED: "هیچ قطعه کدی نصب نشده است",
    TOOLTIP_THEME_LIGHT: "تم: اعمال حالت روشن (برای تغییر به تاریک کلیک کنید)",
    TOOLTIP_THEME_DARK: "تم: اعمال حالت تاریک (برای تغییر به خودکار کلیک کنید)",
    TOOLTIP_THEME_AUTO:
      "تم: خودکار (مطابق با Obsidian) (برای تغییر به روشن کلیک کنید)",
    TOOLTIP_EXPORT_PROFILE: "صادر کردن نمایه (پروفایل) فعلی به صورت فایل JSON",
    TOOLTIP_COPY_JSON: "کپی کردن JSON نمایه فعلی در کلیپ‌بورد",
    NOTICE_JSON_COPIED: "JSON نمایه با موفقیت در کلیپ‌بورد کپی شد!",
    TOGGLE_THEME_COMMAND: "تغییر تم پروفایل فعال",
    NOTICE_THEME_SWITCHED_LIGHT: "به حالت روشن تغییر کرد",
    NOTICE_THEME_SWITCHED_DARK: "به حالت تاریک تغییر کرد",
    NOTICE_THEME_SWITCHED_AUTO: "به حالت خودکار تغییر کرد",
    COMMAND_ENABLE_DISABLE: "فعال/غیرفعال کردن",
    COMMAND_CYCLE_NEXT: "رفتن به پروفایل بعدی",
    COMMAND_CYCLE_PREVIOUS: "رفتن به پروفایل قبلی",
    COMMAND_OPEN_SETTINGS: "باز کردن تنظیمات",
    RIBBON_TOOLTIP_SETTINGS: "تنظیمات استاد رنگ",
    REGEX_PLACEHOLDER: "عبارت منظم را وارد کنید و Enter را بزنید...",
    SET_BACKGROUND_IMAGE_NAME: "تنظیم پس‌زمینه سفارشی",
    SET_BACKGROUND_IMAGE_DESC:
      "یک تصویر پس‌زمینه سفارشی برای پروفایل فعال خود تنظیم کنید.",
    SET_BACKGROUND_IMAGE_BUTTON: "تصویر را انتخاب کنید...",
    REMOVE_BACKGROUND_IMAGE_BUTTON: "حذف پس‌زمینه",
    NOTICE_BACKGROUND_IMAGE_SET: "تصویر پس‌زمینه با موفقیت تنظیم شد.",
    NOTICE_BACKGROUND_IMAGE_REMOVED: "تصویر پس‌زمینه حذف شد.",
    NOTICE_IMAGE_LOAD_ERROR: "بارگیری تصویر ناموفق بود.",
    TOOLTIP_ADD_BACKGROUND_IMAGE: "اضافه کردن تصویر پس‌زمینه",
    TOOLTIP_REMOVE_BACKGROUND_IMAGE: "حذف تصویر پس‌زمینه",
    TOOLTIP_BACKGROUND_IMAGE_SETTINGS: "تنظیمات تصویر پس‌زمینه",
    TOOLTIP_BROWSE_BACKGROUND_IMAGES: "مرور تصاویر پس‌زمینه ذخیره شده",
    NOTICE_NO_BACKGROUND_IMAGE_TO_REMOVE:
      "هیچ تصویر پس‌زمینه فعالی برای حذف در این نمایه وجود ندارد.",
    NOTICE_BACKGROUND_IMAGE_DELETED: "تصویر پس‌زمینه و فایل آن حذف شدند.",
    CONFIRM_BACKGROUND_DELETION_TITLE: "تأیید حذف پس‌زمینه",
    CONFIRM_BACKGROUND_DELETION_DESC:
      "آیا مطمئن هستید که می‌خواهید تصویر پس‌زمینه فعلی را حذف کنید؟ فایل تصویر برای همیشه از والت شما حذف خواهد شد.",
    DELETE_ANYWAY_BUTTON: "در هر صورت حذف کن",
    NOTICE_BACKGROUND_IMAGE_NOT_FOUND: (path: string) =>
      `پروفایل به تصویر پس‌زمینه در '${path}' نیاز دارد، اما فایل پیدا نشد. لطفاً تصویر را به این مسیر اضافه کنید.`,
    NOTICE_BACKGROUND_FOLDER_NOT_FOUND:
      "پوشه پس‌زمینه‌ها '.obsidian/backgrounds' پیدا نشد.",
    FILE_CONFLICT_TITLE: "فایل موجود است",
    FILE_CONFLICT_DESC: (name: string) =>
      `فایلی با نام '${name}' قبلاً در پوشه پس‌زمینه‌های شما وجود دارد. چه کاری می‌خواهید انجام دهید؟`,
    REPLACE_FILE_BUTTON: "جایگزینی فایل",
    KEEP_BOTH_BUTTON: "نگه داشتن هر دو (تغییر نام)",
    ADD_NEW_BACKGROUND_IMAGE_TITLE: "افزودن تصویر پس‌زمینه جدید",
    IMPORT_FROM_FILE_BUTTON: "وارد کردن از فایل",
    NOTICE_URL_LOAD_ERROR: "دانلود تصویر از URL ناموفق بود.",
    IMPORT_FROM_FILE_DESC_MODAL:
      "وارد کردن یک فایل تصویر از کامپیوتر شما برای استفاده به عنوان پس‌زمینه.",
    PASTE_BOX_PLACEHOLDER:
      "تصویر یا URL را بکشید و رها کنید / یا اینجا بچسبانید (Ctrl+V)",
    NOTICE_PASTE_ERROR: "محتوای چسبانده شده یک تصویر یا URL معتبر نیست.",
    DROP_TO_ADD_IMAGE: "برای افزودن تصویر رها کنید...",
    PROCESSING_IMAGE: "در حال پردازش",
    PROFILE_IMAGE_BROWSER_TITLE: "پس‌زمینه‌های پروفایل",
    NO_IMAGES_FOUND: "هیچ تصویری در پوشه پس‌زمینه این پروفایل یافت نشد.",
    SELECT_BUTTON: "انتخاب",
    CONFIRM_IMAGE_DELETE_TITLE: "حذف تصویر؟",
    CONFIRM_IMAGE_DELETE_DESC: (name: string) =>
      `آیا مطمئن هستید که می‌خواهید '${name}' را برای همیشه حذف کنید؟`,
    BROWSE_BUTTON: "مرور...",
    NOTICE_INVALID_FILENAME: "نام فایل نامعتبر است.",
    NOTICE_FILENAME_EXISTS: (name: string) =>
      `نام فایل "${name}" از قبل وجود دارد.`,
    NOTICE_RENAME_SUCCESS: (name: string) => `تغییر نام به "${name}"`,
    NOTICE_RENAME_ERROR: "خطا در تغییر نام فایل.",
    SETTING_BACKGROUND_ENABLE_NAME: "فعال کردن تصویر پس‌زمینه",
    SETTING_BACKGROUND_ENABLE_DESC:
      "نمایش یا پنهان کردن تصویر پس‌زمینه سفارشی برای این پروفایل را تغییر دهید.",
  },
  fr: {
    PLUGIN_NAME: "Maître des Couleurs - v1.1.0",
    ENABLE_PLUGIN: "Activer Maître des Couleurs",
    ENABLE_PLUGIN_DESC:
      "Désactivez cette option pour désactiver temporairement toutes les couleurs personnalisées et revenir à votre thème Obsidian actif.",
    PLUGIN_ENABLED_NOTICE: "Maître des Couleurs activé",
    PLUGIN_DISABLED_NOTICE: "Maître des Couleurs désactivé",
    LANGUAGE: "Langue",
    LANGUAGE_DESC: "Définissez la langue de l'interface pour le plugin.",
    PROFILE_MANAGER: "Gestionnaire de Profils",
    RESET_CONFIRM_TITLE: "Confirmation de la réinitialisation du profil",
    RESET_CONFIRM_DESC:
      "Êtes-vous sûr de vouloir réinitialiser ce profil à la dernière capture épinglée ? Cela écrasera vos couleurs actuelles et ne pourra pas être annulé.",
    ACTIVE_PROFILE: "Profil Actif",
    ACTIVE_PROFILE_DESC: "Gérez et basculez entre les profils de couleurs.",
    NEW_BUTTON: "Nouveau",
    DELETE_BUTTON: "Supprimer",
    OPTIONS_HEADING: "Paramètres avancés",
    UPDATE_FREQUENCY_NAME: "FPS de la mise à jour en direct",
    UPDATE_FREQUENCY_DESC:
      "Définit le nombre de fois par seconde où l'interface prévisualise les changements de couleur lors du glissement (0 = désactiver l'aperçu en direct). Des valeurs plus basses peuvent améliorer les performances.",
    OVERRIDE_ICONIZE: "Outrepasser les couleurs du plugin Iconize",
    OVERRIDE_ICONIZE_DESC:
      "Laissez Maître des Couleurs contrôler toutes les couleurs d'icônes du plugin Iconize. Pour de meilleurs résultats, désactivez les paramètres de couleur dans Iconize lui-même.",
    ICONIZE_NOT_FOUND_NOTICE:
      "Plugin Iconize non trouvé. Veuillez l'installer et l'activer pour utiliser cette fonctionnalité.",
    BACKGROUNDS: "Arrière-plans",
    TEXT: "Texte",
    INTERACTIVE_ELEMENTS: "Éléments Interactifs",
    UI_ELEMENTS: "Éléments d'Interface",
    MISC: "Divers",
    NEW_PROFILE_TITLE: "Créer un nouveau profil",
    PROFILE_NAME_LABEL: "Nom du profil",
    PROFILE_NAME_PLACEHOLDER: "Entrez le nom du profil...",
    CREATE_BUTTON: "Créer",
    EMPTY_PROFILE_NAME_NOTICE: "Le nom du profil ne peut pas être vide.",
    PROFILE_EXISTS_NOTICE: (name: string) => `Le profil "${name}" existe déjà.`,
    DELETE_PROFILE_TITLE: "Supprimer le profil",
    DELETE_PROFILE_CONFIRMATION: (name: string) =>
      `Êtes-vous sûr de vouloir supprimer le profil "${name}" ? Cette action est irréversible.`,
    SNIPPETS_HEADING: "Extraits CSS",
    SAVE_AS_TYPE: "Enregistrer en tant que",
    SAVE_AS_PROFILE: "Profil",
    SAVE_AS_SNIPPET: "Extrait",
    EDIT_SNIPPET_TITLE: "Modifier l'extrait CSS",
    EDIT_PROFILE_TITLE: "Modifier le profil CSS",
    PROFILE_DELETED_NOTICE: "Profil supprimé.",
    CANNOT_DELETE_LAST_PROFILE: "Impossible de supprimer le dernier profil.",
    PROFILE_THEME_TYPE: "Type de thème du profil",
    PROFILE_THEME_TYPE_DESC:
      "Définissez si ce profil doit forcer un thème spécifique (Sombre/Clair) lors de son activation.",
    THEME_TYPE_AUTO: "Thème par défaut d'Obsidian",
    THEME_TYPE_DARK: "Forcer le mode sombre",
    THEME_TYPE_LIGHT: "Forcer le mode clair",
    RESTORE_BUTTON: "Restaurer",
    RESET_BUTTON: "Réinitialiser",
    UPDATE_BUTTON: "Mettre à jour",
    SEARCH_PLACEHOLDER: "Rechercher des variables (nom ou valeur)...",
    CLEAR_BUTTON: "Effacer",
    SEARCH_RESULTS_FOUND: (count: number) => `${count} trouvé(s)`,
    ALL_SECTIONS: "Toutes les sections",
    EXPORT_FILE_BUTTON: "Exporter le fichier",
    COPY_JSON_BUTTON: "Copier JSON",
    IMPORT_PASTE_CSS_BUTTON: "Importer / Coller (.css)",
    IMPORT_PASTE_JSON_BUTTON: "Importer / Coller (.json)",
    CREATE_SNIPPET_BUTTON: "Créer un nouvel extrait",
    NO_SNIPPETS_DESC: "Aucun extrait CSS n'a encore été créé pour ce profil.",
    CLEANUP_INTERVAL_NAME: "Intervalle de nettoyage",
    CLEANUP_INTERVAL_DESC:
      "Définit la fréquence (en secondes) à laquelle le plugin recherche un plugin Iconize désinstallé pour nettoyer ses icônes.",
    PLUGIN_INTEGRATIONS: "Intégrations de plugins",
    GRAPH_VIEW: "Vue Graphique",
    LIKE_CARD_PROFILES_STAT: (p: number, s: number) =>
      `Profils: ${p} & Extraits: ${s}`,
    LIKE_CARD_COLORS_STAT: "Couleurs personnalisables",
    LIKE_CARD_INTEGRATIONS_STAT: "Intégrations de plugins",
    LIKE_CARD_DAYS_STAT: "Jours d'utilisation",
    LIKE_CARD_STAR_BUTTON: "Étoile sur GitHub",
    LIKE_CARD_ISSUE_BUTTON: "Signaler un problème",
    LIKE_CARD_SYNC_BUTTON: "Synchronisez votre coffre",
    LIKE_CARD_GITHUB_BUTTON: "Mon GitHub",
    PASTE_CSS_MODAL_TITLE: "Importer / Coller CSS",
    PASTE_CSS_MODAL_NOTE:
      "Remarque : Le CSS collé peut affecter l'interface utilisateur, n'utilisez que du CSS de confiance.",
    IMPORT_FROM_FILE: "Importer depuis un fichier",
    IMPORT_FROM_FILE_DESC:
      "Ou, sélectionnez un fichier (.css) depuis votre ordinateur.",
    CHOOSE_FILE_BUTTON: "Choisir un fichier...",
    CSS_TEXTAREA_PLACEHOLDER: "Collez votre code CSS ici...",
    SNIPPET_NAME_LABEL: "Nom de l'extrait",
    CREATE_SNIPPET_TITLE: "Créer un nouvel extrait CSS",
    IMPORT_PROFILE_TITLE: "Importer / Coller du CSS et créer un profil",
    SNIPPET_NAME_PLACEHOLDER: "Entrez le nom de l'extrait...",
    NOTICE_PROFILE_PINNED: "Couleurs du profil épinglées avec succès !",
    NOTICE_PROFILE_RESET: "Le profil a été réinitialisé à la capture épinglée.",
    NOTICE_NO_PINNED_SNAPSHOT:
      "Aucune capture épinglée trouvée pour ce profil.",
    NOTICE_PROFILE_NOT_FOUND: "Le profil actif n'a pas pu être trouvé.",
    NOTICE_NO_PROFILES_FOUND: "Aucun profil trouvé.",
    NOTICE_ACTIVE_PROFILE_SWITCHED: (name: string) => `Profil actif : ${name}`,
    NOTICE_CANNOT_FIND_ORIGINAL_PROFILE:
      "Impossible de trouver les données originales pour ce profil.",
    NOTICE_PROFILE_RESTORED: (name: string) =>
      `Le profil "${name}" a été restauré à son état par défaut.`,
    NOTICE_GRAPH_COLORS_APPLIED: "Couleurs du graphique appliquées !",
    NOTICE_INVALID_JSON: "JSON invalide.",
    NOTICE_JSON_MUST_HAVE_NAME:
      "Le JSON importé doit avoir une propriété 'name' pour créer un nouveau profil.",
    NOTICE_PROFILE_CREATED_SUCCESS: (name: string) =>
      `Le profil "${name}" a été créé avec succès.`,
    NOTICE_PROFILE_IMPORTED_SUCCESS: (mode: string) =>
      `Profil ${mode} avec succès.`,
    NOTICE_NO_ACTIVE_PROFILE_TO_COPY: "Aucun profil actif à copier.",
    NOTICE_NO_ACTIVE_PROFILE_TO_EXPORT: "Aucun profil actif à exporter.",
    NOTICE_SNIPPET_CSS_COPIED:
      "CSS de l'extrait copié dans le presse-papiers !",
    NOTICE_SNIPPET_EMPTY: "Cet extrait est vide.",
    NOTICE_CSS_CONTENT_EMPTY: "Le contenu CSS ne peut pas être vide.",
    NOTICE_SNIPPET_NAME_EXISTS: (name: string) =>
      `Le nom d'extrait "${name}" existe déjà.`,
    NOTICE_PROFILE_NAME_EXISTS: (name: string) =>
      `Le nom de profil "${name}" existe déjà.`,
    NOTICE_PROFILE_UPDATED: (name: string) => `Profil "${name}" mis à jour.`,
    NOTICE_SNIPPET_UPDATED: (name: string) => `Extrait "${name}" mis à jour.`,
    NOTICE_SNIPPET_CREATED: (name: string) =>
      `L'extrait "${name}" a été créé avec succès !`,
    NOTICE_PROFILE_CREATED_FROM_CSS: (name: string) =>
      `Le profil "${name}" a été créé avec succès !`,
    NOTICE_NO_COLOR_HISTORY: "Aucun historique de couleur à restaurer.",
    NOTICE_COLOR_RESTORED: (color: string) => `Restauré : ${color}`,
    NOTICE_TEXTBOX_EMPTY:
      "La zone de texte est vide. Collez du JSON ou importez d'abord un fichier.",
    IMPORT_JSON_MODAL_TITLE: "Coller ou Importer le JSON du Profil",
    IMPORT_JSON_MODAL_DESC_1:
      "Vous pouvez coller un JSON de profil dans la case ci-dessous.",
    IMPORT_JSON_MODAL_PLACEHOLDER: '{ "name": "...", "profile": { ... } }',
    IMPORT_JSON_MODAL_SETTING_NAME: "Importer depuis un fichier",
    IMPORT_JSON_MODAL_SETTING_DESC:
      "Ou, sélectionnez un fichier de profil (.json) depuis votre ordinateur.",
    REPLACE_ACTIVE_BUTTON: "Remplacer l'actuel",
    CREATE_NEW_BUTTON: "Créer un nouveau",
    NOTICE_FILE_LOADED: (fileName: string) =>
      `Fichier "${fileName}" chargé dans la zone de texte.`,
    NOTICE_EXPORT_SUCCESS: "Profil exporté avec succès !",
    TOOLTIP_RESTORE_BUILTIN: "Restaurer les couleurs d'origine intégrées",
    TOOLTIP_EDIT_CSS_PROFILE: "Modifier le profil CSS",
    TOOLTIP_PIN_SNAPSHOT: "Épingler les couleurs actuelles comme une capture",
    TOOLTIP_PIN_SNAPSHOT_DATE: (date: string) =>
      `Couleurs épinglées le ${date}. Cliquez pour ré-épingler.`,
    TOOLTIP_RESET_TO_PINNED: "Réinitialiser aux couleurs épinglées",
    TOOLTIP_EDIT_SNIPPET: "Modifier l'extrait",
    TOOLTIP_COPY_SNIPPET_CSS: "Copier le CSS dans le presse-papiers",
    TOOLTIP_DELETE_SNIPPET: "Supprimer l'extrait",
    TOOLTIP_SET_TRANSPARENT: "Rendre transparent",
    TOOLTIP_UNDO_CHANGE: "Annuler la dernière modification",
    ARIA_LABEL_CASE_SENSITIVE: "Recherche sensible à la casse",
    ARIA_LABEL_REGEX_SEARCH: "Utiliser une expression régulière",
    NOTICE_JSON_COPIED_CLIPBOARD:
      "JSON du profil copié dans le presse-papiers.",
    MODAL_DELETE_SNIPPET_TITLE: (name: string) =>
      `Supprimer l'extrait : ${name}`,
    MODAL_DELETE_SNIPPET_DESC:
      "Êtes-vous sûr de vouloir supprimer cet extrait ? Cette action est irréversible.",
    RESET_PLUGIN_NAME: "Réinitialiser les paramètres du plugin",
    RESET_PLUGIN_DESC:
      "Cette action supprimera tous les profils, extraits, paramètres et arrière-plans, réinitialisant ainsi l'extension à son état d'origine. Cette action nécessite un rechargement de l'application et est irréversible.",
    RESET_PLUGIN_BUTTON: "Réinitialiser toutes les données...",
    RESET_CONFIRM_MODAL_TITLE: "Êtes-vous sûr ?",
    RESET_CONFIRM_MODAL_DESC:
      "Cela supprimera définitivement toutes vos données Color Master (profils, extraits, paramètres et arrière-plans). C'est irréversible.",
    RESET_SUCCESS_NOTICE:
      "Les données de Color Master ont été supprimées. Veuillez recharger Obsidian pour appliquer les changements.",
    RELOAD_BUTTON: "Recharger",
    NOTICE_FPS_UPDATED: (value: number) =>
      `FPS de la mise à jour en direct défini sur : ${value}`,
    NOTICE_SNIPPET_COPIED: "CSS de l'extrait copié dans le presse-papiers !",
    NOTICE_INVALID_PROFILE_OBJECT:
      "Le JSON ne semble pas être un objet de profil valide.",
    NEW_PROFILE: "Nouveau",
    RESTORE_PROFILE_MODAL_TITLE: (name: string) =>
      `Restaurer le profil : ${name}`,
    RESTORE_PROFILE_MODAL_DESC: (name: string) =>
      `Êtes-vous sûr de vouloir restaurer "${name}" à ses couleurs d'origine ? Toutes vos personnalisations pour ce profil seront perdues.`,
    NOTICE_PROFILE_CREATED: (name: string) =>
      `Le profil "${name}" a été créé avec succès !`,
    MARKDOWN: "Markdown",
    NOTICES: "Notifications",
    ADVANCED_NOTICE_TEXT_RULES_TITLE:
      "Règles avancées pour la couleur du texte",
    ADVANCED_NOTICE_BG_RULES_TITLE: "Règles avancées pour la couleur de fond",
    ADD_NEW_RULE: "Ajouter une nouvelle règle",
    KEYWORD_PLACEHOLDER: "Tapez un mot-clé et appuyez sur Espace...",
    USE_REGEX_LABEL: "Regex",
    DRAG_RULE_TOOLTIP: "Glisser pour réorganiser",
    APPLY_BUTTON: "Appliquer",
    CANCEL_BUTTON: "Annuler",
    MODAL_ADD_VAR_TITLE: "Ajouter une nouvelle variable CSS personnalisée",
    MODAL_ADD_VAR_DESC:
      "Définissez une nouvelle variable CSS (ex: --my-color: #f00). Cette variable sera ajoutée à votre profil actif.",
    MODAL_VAR_DISPLAY_NAME: "Nom d'affichage",
    MODAL_VAR_DISPLAY_NAME_DESC:
      "Un nom convivial pour votre variable (ex: 'Ma couleur primaire personnalisée').",
    MODAL_VAR_DISPLAY_NAME_PLACEHOLDER: "Ex: Ma couleur primaire",
    MODAL_VAR_NAME: "Nom de la variable",
    MODAL_VAR_NAME_DESC:
      "Le nom réel de la variable CSS. Doit commencer par '--' (ex: '--ma-couleur-primaire').",
    MODAL_VAR_NAME_PLACEHOLDER: "Ex: --ma-couleur-primaire",
    MODAL_VAR_VALUE: "Valeur de la variable",
    MODAL_VAR_VALUE_DESC:
      "La valeur de la variable CSS (ex: 'red', '#ff0000', 'rgb(255,0,0)').",
    MODAL_VAR_VALUE_PLACEHOLDER: "Ex: #FF0000 ou rouge",
    MODAL_VAR_DESCRIPTION: "Description (Optionnel)",
    MODAL_VAR_DESCRIPTION_DESC:
      "Une brève description de ce que cette variable contrôle.",
    MODAL_VAR_DESCRIPTION_PLACEHOLDER: "Ex: Couleur principale des titres",
    ERROR_VAR_NAME_PREFIX: "Le nom de la variable doit commencer par '--'",
    SETTINGS_SAVED: "Paramètres appliqués avec succès !",
    MOVE_RULE_UP_TOOLTIP: "Déplacer la règle vers le haut",
    MOVE_RULE_DOWN_TOOLTIP: "Déplacer la règle vers le bas",
    DRAG_HANDLE_TOOLTIP: "Glisser pour réorganiser",
    TOOLTIP_TEST_RULE: "Tester cette règle avec un mot-clé aléatoire",
    NOTICE_TEST_SENTENCE: (word: string) =>
      `La couleur de notification pour "${word}" ressemble à ceci :`,
    DUPLICATE_PROFILE_TITLE: "Nom de profil en double",
    DUPLICATE_PROFILE_DESC_PARTS: [
      `Le nom de profil "`,
      `" existe déjà. Veuillez choisir un nom différent.`,
    ],
    DUPLICATE_PROFILE_PLACEHOLDER: "Entrez un nouveau nom de profil...",
    NOTICE_RULES_DESC:
      "Créez des règles priorisées pour colorer les notifications en fonction de leur contenu. La première règle correspondante de haut en bas sera appliquée.",
    CUSTOM_VARIABLES_HEADING: "Variables personnalisées",
    CUSTOM_VARIABLE_DESC: "Variable ajoutée par l'utilisateur.",
    TOOLTIP_DELETE_CUSTOM_VARIABLE: "Supprimer la variable personnalisée",
    ADD_CUSTOM_VARIABLE_NAME: "Ajouter une variable personnalisée",
    ADD_CUSTOM_VARIABLE_DESC:
      "Ajoutez une nouvelle variable CSS qui n'est pas dans la liste par défaut. Le nom doit commencer par '--'.",
    ADD_NEW_VARIABLE_BUTTON: "Ajouter une nouvelle variable...",
    VARIABLE_NAME_LABEL: "Nom de la variable",
    VARIABLE_NAME_DESC: "Le nom technique CSS, ex: --ma-couleur-perso.",
    COLOR_LABEL: "Valeur de la couleur",
    VARIABLE_NAME_PLACEHOLDER: "--nom-variable",
    NOTICE_VAR_NAME_EMPTY: "Le nom de la variable ne peut pas être vide.",
    NOTICE_VAR_NAME_FORMAT: "Le nom de la variable doit commencer par '--'.",
    NOTICE_VAR_EXISTS: (name: string) => `La variable "${name}" existe déjà.`,
    NOTICE_VAR_ADDED: (name: string) =>
      `La variable "${name}" a été ajoutée avec succès.`,
    HELP_TEXT_PRE_LINK: "Vous ne trouvez pas la variable que vous cherchez ? ",
    HELP_TEXT_LINK:
      "Parcourez la liste officielle des variables CSS d'Obsidian.",
    MODAL_CUSTOM_VAR_TITLE: "Ajouter les détails de la variable personnalisée",
    ADD_BUTTON: "Ajouter",
    DISPLAY_NAME_LABEL: "Nom d'affichage",
    DISPLAY_NAME_DESC:
      "C'est le nom convivial qui apparaîtra dans la liste des paramètres.",
    DESCRIPTION_LABEL: "Description",
    DESCRIPTION_DESC: "Décrivez à quoi sert cette variable de couleur.",
    SAVE_BUTTON: "Enregistrer la variable",
    PLACEHOLDER_DISPLAY_NAME: "ex: Couleur de fond principale",
    PLACEHOLDER_DESCRIPTION:
      "ex: Utilisé pour changer la taille de la police...",
    RTL_LAYOUT_NAME: "Activer la disposition de droite à gauche (RTL)",
    RTL_LAYOUT_DESC:
      "Lorsque cette option est activée, l'interface du plugin est inversée pour prendre en charge correctement les langues écrites de droite à gauche.",
    LANGUAGE_SETTINGS_TITLE: "Paramètres de langue",
    SAVE_AS_GLOBAL_SNIPPET_NAME: "Enregistrer comme extrait global",
    SAVE_AS_GLOBAL_SNIPPET_DESC:
      "Un extrait global est appliqué à tous vos profils.",
    NOTICE_MOVE_SNIPPET_SCOPE:
      "Utilisez la fenêtre de modification pour déplacer un extrait.",
    ICONIZE_SETTINGS_MODAL_TITLE: "Paramètres d'intégration d'Iconize",
    TOOLTIP_ICONIZE_SETTINGS: "Paramètres d'Iconize",
    THEME_WARNING_TOOLTIP: (currentTheme: string) =>
      `Le thème communautaire "${currentTheme}" est actif, ce qui peut interférer avec l'apparence du profil. Pour de meilleurs résultats, passez au thème par défaut d'Obsidian, ou importez "${currentTheme}" comme un nouveau profil CSS pour le personnaliser directement.`,
    IMPORT_FROM_INSTALLED_THEME: "Importer depuis un thème installé",
    IMPORT_FROM_INSTALLED_THEME_DESC:
      "Chargez rapidement le CSS de l'un de vos thèmes communautaires installés.",
    IMPORT_BUTTON: "Importer",
    NOTICE_THEME_CSS_LOADED: (theme: string) =>
      `CSS du thème "${theme}" chargé avec succès.`,
    NOTICE_THEME_READ_FAILED: (theme: string) =>
      `Impossible de lire le fichier du thème "${theme}". Il est peut-être protégé ou manquant.`,
    IMPORT_FROM_INSTALLED_SNIPPET: "Importer depuis un extrait installé",
    IMPORT_FROM_INSTALLED_SNIPPET_DESC:
      "Chargez rapidement le CSS de l'un de vos extraits Obsidian installés.",
    NOTICE_SNIPPET_LOADED: (snippet: string) =>
      `CSS de l'extrait "${snippet}" chargé avec succès.`,
    NOTICE_SNIPPET_READ_FAILED: (snippet: string) =>
      `Impossible de lire le fichier de l'extrait "${snippet}".`,
    NO_THEMES_INSTALLED: "Aucun thème installé",
    NO_SNIPPETS_INSTALLED: "Aucun extrait installé",
    TOOLTIP_THEME_LIGHT:
      "Thème : Forcer le mode Clair (Cliquer pour passer au Sombre)",
    TOOLTIP_THEME_DARK:
      "Thème : Forcer le mode Sombre (Cliquer pour passer en Auto)",
    TOOLTIP_THEME_AUTO:
      "Thème : Auto (Suit Obsidian) (Cliquer pour passer au Clair)",
    TOOLTIP_EXPORT_PROFILE:
      "Exporter le profil actuel en tant que fichier JSON",
    TOOLTIP_COPY_JSON: "Copier le JSON du profil actuel dans le presse-papiers",
    NOTICE_JSON_COPIED:
      "JSON du profil copié dans le presse-papiers avec succès !",
    TOGGLE_THEME_COMMAND: "Changer le thème du profil actif",
    NOTICE_THEME_SWITCHED_LIGHT: "Passage en mode Clair",
    NOTICE_THEME_SWITCHED_DARK: "Passage en mode Sombre",
    NOTICE_THEME_SWITCHED_AUTO: "Passage en mode Auto",
    COMMAND_ENABLE_DISABLE: "Activer & Désactiver",
    COMMAND_CYCLE_NEXT: "Profil suivant",
    COMMAND_CYCLE_PREVIOUS: "Profil précédent",
    COMMAND_OPEN_SETTINGS: "Ouvrir les paramètres",
    RIBBON_TOOLTIP_SETTINGS: "Paramètres de Color Master",
    REGEX_PLACEHOLDER: "Entrez Regex et appuyez sur Entrée...",
    SET_BACKGROUND_IMAGE_NAME: "Définir un arrière-plan personnalisé",
    SET_BACKGROUND_IMAGE_DESC:
      "Définissez une image d'arrière-plan personnalisée pour votre profil actif.",
    SET_BACKGROUND_IMAGE_BUTTON: "Choisissez une image...",
    REMOVE_BACKGROUND_IMAGE_BUTTON: "Supprimer l'arrière-plan",
    NOTICE_BACKGROUND_IMAGE_SET:
      "L'image d'arrière-plan a été définie avec succès.",
    NOTICE_BACKGROUND_IMAGE_REMOVED: "L'image d'arrière-plan a été supprimée.",
    NOTICE_IMAGE_LOAD_ERROR: "Échec du chargement de l'image.",
    TOOLTIP_ADD_BACKGROUND_IMAGE: "Ajouter une image d'arrière-plan",
    TOOLTIP_REMOVE_BACKGROUND_IMAGE: "Supprimer l'image d'arrière-plan",
    TOOLTIP_BACKGROUND_IMAGE_SETTINGS: "Paramètres de l'image d'arrière-plan",
    TOOLTIP_BROWSE_BACKGROUND_IMAGES:
      "Parcourir les images d'arrière-plan stockées",
    NOTICE_NO_BACKGROUND_IMAGE_TO_REMOVE:
      "Il n'y a pas d'image d'arrière-plan active à supprimer pour ce profil.",
    NOTICE_BACKGROUND_IMAGE_DELETED:
      "L'image d'arrière-plan et son fichier ont été supprimés.",
    CONFIRM_BACKGROUND_DELETION_TITLE:
      "Confirmer la suppression de l'arrière-plan",
    CONFIRM_BACKGROUND_DELETION_DESC:
      "Êtes-vous sûr de vouloir supprimer l'image d'arrière-plan actuelle ? Le fichier image sera définitivement supprimé de votre coffre.",
    DELETE_ANYWAY_BUTTON: "Supprimer quand même",
    NOTICE_BACKGROUND_IMAGE_NOT_FOUND: (path: string) =>
      `Le profil nécessite l'image d'arrière-plan à '${path}', mais le fichier n'a pas été trouvé. Veuillez ajouter l'image à ce chemin.`,
    NOTICE_BACKGROUND_FOLDER_NOT_FOUND:
      "Dossier d'arrière-plans '.obsidian/backgrounds' non trouvé.",
    FILE_CONFLICT_TITLE: "Le fichier existe",
    FILE_CONFLICT_DESC: (name: string) =>
      `Un fichier nommé '${name}' existe déjà dans votre dossier d'arrière-plans. Que souhaitez-vous faire ?`,
    REPLACE_FILE_BUTTON: "Remplacer le fichier",
    KEEP_BOTH_BUTTON: "Garder les deux (Renommer)",
    ADD_NEW_BACKGROUND_IMAGE_TITLE: "Ajouter une nouvelle image d'arrière-plan",
    IMPORT_FROM_FILE_BUTTON: "Importer depuis un fichier",
    NOTICE_URL_LOAD_ERROR: "Échec du téléchargement de l'image depuis l'URL.",
    IMPORT_FROM_FILE_DESC_MODAL:
      "Importer un fichier image depuis votre ordinateur pour l'utiliser comme arrière-plan.",
    PASTE_BOX_PLACEHOLDER:
      "Glissez-déposez / Collez une image ou URL ici (Ctrl+V)",
    NOTICE_PASTE_ERROR:
      "Le contenu collé n'est pas une image ou une URL valide.",
    DROP_TO_ADD_IMAGE: "Relâchez pour ajouter l'image...",
    PROCESSING_IMAGE: "Traitement",
    PROFILE_IMAGE_BROWSER_TITLE: "Arrière-plans du profil",
    NO_IMAGES_FOUND:
      "Aucune image trouvée dans le dossier d'arrière-plans de ce profil.",
    SELECT_BUTTON: "Sélectionner",
    CONFIRM_IMAGE_DELETE_TITLE: "Supprimer l'image ?",
    CONFIRM_IMAGE_DELETE_DESC: (name: string) =>
      `Êtes-vous sûr de vouloir supprimer définitivement '${name}' ?`,
    BROWSE_BUTTON: "Parcourir...",
    NOTICE_INVALID_FILENAME: "Nom de fichier invalide.",
    NOTICE_FILENAME_EXISTS: (nom: string) =>
      `Le nom de fichier "${name}" existe déjà.`,
    NOTICE_RENAME_SUCCESS: (nom: string) => `Renommé en "${name}"`,
    NOTICE_RENAME_ERROR: "Erreur lors du changement de nom du fichier.",
    SETTING_BACKGROUND_ENABLE_NAME: "Activer l'image d'arrière-plan",
    SETTING_BACKGROUND_ENABLE_DESC:
      "Activer/désactiver la visibilité de l'image d'arrière-plan personnalisée pour ce profil.",
  },
};

export const t = (key: string, ...args: (string | number)[]): string => {
  if (!T) {
    console.error("ColorMaster: 'T' is not initialized yet.");
    return key; // Return key as a fallback
  }
  const lang = T.settings?.language || "en";
  const stringsForLang = STRINGS[lang as keyof typeof STRINGS] || STRINGS.en;
  const string =
    stringsForLang[key as keyof typeof stringsForLang] ||
    STRINGS.en[key as keyof (typeof STRINGS)["en"]];

  if (typeof string === "function") {
    return string.apply(null, args);
  }
  return string as string;
};
