/*
 * Color Master - Obsidian Plugin
 * Version: 1.0.4
 * Author: Yazan Ammar (GitHub : https://github.com/YazanAmmar )
 * Description: Provides a comprehensive UI to control all Obsidian CSS color variables directly,
 * removing the need for Force Mode and expanding customization options.
 */

const STRINGS = {
  en: {
    PLUGIN_NAME: "Color Master",
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
    RESET_BUTTON_TOOLTIP: "Reset to default",
    EXPORT_BUTTON_TOOLTIP: "Export active profile",
    IMPORT_BUTTON_TOOLTIP: "Import new profile",
    OPTIONS_HEADING: "Options",
    UPDATE_FREQUENCY_NAME: "Live Update FPS",
    UPDATE_FREQUENCY_DESC:
      "Sets how many times per second the UI previews color changes while dragging (0 = disable live preview). Lower values can improve performance.",
    ICONIZE_PLUGIN: "Iconize Plugin",
    OVERRIDE_ICONIZE: "Override Iconize Plugin Colors",
    OVERRIDE_ICONIZE_DESC:
      "Let Color Master control all icon colors from the Iconize plugin. For best results, disable the color settings within Iconize itself.",
    ICONIZE_NOT_FOUND_NOTICE:
      "Iconize plugin not found. Please install and enable it to use this feature.",
    // Color Categories
    BACKGROUNDS: "Backgrounds",
    TEXT: "Text",
    INTERACTIVE_ELEMENTS: "Interactive Elements",
    UI_ELEMENTS: "UI Elements",
    MISC: "Misc",
    // Modals
    NEW_PROFILE_TITLE: "Create New Profile",
    PROFILE_NAME_LABEL: "Profile Name",
    PROFILE_NAME_PLACEHOLDER: "Enter profile name...",
    CREATE_BUTTON: "Create",
    CANCEL_BUTTON: "Cancel",
    EMPTY_PROFILE_NAME_NOTICE: "Profile name cannot be empty.",
    PROFILE_EXISTS_NOTICE: (name) => `Profile "${name}" already exists.`,
    DELETE_PROFILE_TITLE: "Delete Profile",
    DELETE_PROFILE_CONFIRMATION: (name) =>
      `Are you sure you want to delete the profile "${name}"? This action cannot be undone.`,
    PROFILE_DELETED_NOTICE: "Profile deleted.",
    CANNOT_DELETE_LAST_PROFILE: "Cannot delete the last profile.",
    PROFILE_THEME_TYPE: "Profile Theme Type",
    PROFILE_THEME_TYPE_DESC:
      "Set whether this profile should force a specific theme (Dark/Light) when activated.",
    THEME_TYPE_AUTO: "Obsidian's Default Theme",
    THEME_TYPE_DARK: "Force Dark Mode",
    THEME_TYPE_LIGHT: "Force Light Mode",
    SUPPORT_HEADER: "Like the Plugin?",
    SUPPORT_GITHUB_STAR: "Would you mind supporting us with a ☆ on",
    SUPPORT_GITHUB_ISSUES:
      "If you have any issues or feature requests, please let us know at this link.",
    GITHUB_LINK_TEXT: "Github?",
    ISSUES_LINK_TEXT: "this link.",
    BUILT_IN_PROFILES: "Built-in Profiles",
    CUSTOMIZABLE_COLORS: "Customizable Colors",
    GITHUB_STAR_BUTTON: "Star on GitHub",
    ISSUES_BUTTON: "Report an Issue",
    FORCE_REFRESH_TOOLTIP: "Force Refresh UI",
    SUPPORT_DESC:
      "If you like the plugin, would you mind giving us a star on GitHub? If you have an issue or a feature request, don't hesitate to click 'Report an Issue' and let us know!",
  },
  ar: {
    PLUGIN_NAME: "متحكم الألوان",
    ENABLE_PLUGIN: "تفعيل متحكم الألوان",
    ENABLE_PLUGIN_DESC:
      "أطفئ هذا الخيار لتعطيل جميع الألوان المخصصة مؤقتاً والعودة إلى ثيم Obsidian النشط.",
    PLUGIN_ENABLED_NOTICE: "تم تفعيل متحكم الألوان",
    PLUGIN_DISABLED_NOTICE: "تم تعطيل متحكم الألوان",
    LANGUAGE: "اللغة",
    LANGUAGE_DESC: "اختر لغة واجهة الإضافة.",
    PROFILE_MANAGER: "إدارة التشكيلات",
    RESET_CONFIRM_TITLE: "تأكيد استرجاع التشكيلة",
    RESET_CONFIRM_DESC:
      "هل أنت متأكد من رغبتك في استرجاع هذه التشكيلة لآخر لقطة تم تثبيتها؟ سيتم الكتابة فوق الألوان الحالية ولا يمكن التراجع عن هذا الإجراء.",
    ACTIVE_PROFILE: "التشكيلة النشطة",
    ACTIVE_PROFILE_DESC: "تنقل بين التشكيلات أو أنشئ واحدة جديدة.",
    NEW_BUTTON: "جديد",
    DELETE_BUTTON: "حذف",
    RESET_BUTTON_TOOLTIP: "إعادة تعيين للقيمة الافتراضية",
    EXPORT_BUTTON_TOOLTIP: "تصدير التشكيلة النشطة",
    IMPORT_BUTTON_TOOLTIP: "استيراد تشكيلة جديدة",
    OPTIONS_HEADING: "الخيارات",
    UPDATE_FREQUENCY_NAME: "معدل التحديث المباشر (إطار بالثانية)",
    UPDATE_FREQUENCY_DESC:
      "يحدد عدد مرات تحديث معاينة الألوان في الثانية أثناء السحب (0 = تعطيل المعاينة). القيم المنخفضة تحسن الأداء.",
    // ICONIZE_PLUGIN:
    OVERRIDE_ICONIZE: "تجاوز ألوان إضافة Iconize",
    OVERRIDE_ICONIZE_DESC:
      "اسمح لـ Color Master بالتحكم في كل ألوان أيقونات Iconize. لأفضل النتائج، قم بتعطيل إعدادات الألوان في إضافة Iconize نفسها.",
    ICONIZE_NOT_FOUND_NOTICE:
      "إضافة Iconize غير موجودة. يرجى تثبيتها وتفعيلها لاستخدام هذه الميزة.",
    // Color Categories
    BACKGROUNDS: "الخلفيات",
    TEXT: "النصوص",
    INTERACTIVE_ELEMENTS: "العناصر التفاعلية",
    UI_ELEMENTS: "عناصر الواجهة",
    MISC: "متنوع",
    // Modals
    NEW_PROFILE_TITLE: "إنشاء تشكيلة جديدة",
    PROFILE_NAME_LABEL: "اسم التشكيلة",
    PROFILE_NAME_PLACEHOLDER: "أدخل اسم التشكيلة...",
    CREATE_BUTTON: "إنشاء",
    CANCEL_BUTTON: "إلغاء",
    EMPTY_PROFILE_NAME_NOTICE: "لا يمكن ترك اسم التشكيلة فارغاً.",
    PROFILE_EXISTS_NOTICE: (name) => `التشكيلة "${name}" موجودة بالفعل.`,
    DELETE_PROFILE_TITLE: "حذف التشكيلة",
    DELETE_PROFILE_CONFIRMATION: (name) =>
      `هل أنت متأكد من رغبتك في حذف التشكيلة "${name}"؟ لا يمكن التراجع عن هذا الإجراء.`,
    PROFILE_DELETED_NOTICE: "تم حذف التشكيلة.",
    CANNOT_DELETE_LAST_PROFILE: "لا يمكن حذف آخر تشكيلة.",
    PROFILE_THEME_TYPE: "نوع ثيم التشكيلة",
    PROFILE_THEME_TYPE_DESC:
      "حدد ما إذا كانت هذه التشكيلة ستفرض ثيماً معيناً (غامق/فاتح) عند تفعيلها.",
    THEME_TYPE_AUTO: "الثيم الافتراضي لأوبسيديان",
    THEME_TYPE_DARK: "فرض الوضع الغامق",
    THEME_TYPE_LIGHT: "فرض الوضع الفاتح",
    SUPPORT_HEADER: "هل أعجبتك الإضافة؟",
    SUPPORT_GITHUB_STAR: "هل تمانع لو دعمتنا بنجمة ☆ على",
    SUPPORT_GITHUB_ISSUES:
      "إذا واجهتك مشكلة أو لديك اقتراح لميزة جديدة، يسعدنا أن تخبرنا عبر",
    GITHUB_LINK_TEXT: "Github؟",
    ISSUES_LINK_TEXT: "هذا الرابط.",
    ISSUES_LINK_TEXT: "هذا الرابط.",
    BUILT_IN_PROFILES: "تشكيلات جاهزة",
    CUSTOMIZABLE_COLORS: "لون قابل للتخصيص",
    GITHUB_STAR_BUTTON: "أضف نجمة على Github",
    ISSUES_BUTTON: "أبلغ عن مشكلة",
    FORCE_REFRESH_TOOLTIP: "فرض تحديث الواجهة",
    SUPPORT_DESC:
      "هل تمانع لو منحتنا نجمة على Github إذا أعجبتك الاضافة ؟ وإذا كنت تعاني من مشكلة او تريد ميّزة ف لا تتردد بالضغط على زر (أبلغ عن مشكلة) وإخبارنا بها !",
  },
};

// Helper for multi-language support.
const t = (key, ...args) => {
  const lang = T.settings?.language || "en";
  const string = STRINGS[lang][key] || STRINGS["en"][key];
  if (typeof string === "function") {
    return string(...args);
  }
  return string;
};

let T;

const {
  Plugin,
  PluginSettingTab,
  Setting,
  Notice,
  Modal,
} = require("obsidian");

// A comprehensive list of Obsidian's themeable color variables.

const COLOR_DESCRIPTIONS = {
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
  "--text-normal": "The default text color for all notes and most of the UI.",
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
  "--text-highlight-bg":
    "The background color for text highlighted with ==highlight== syntax.",
  // Headings
  "--h1-color": "The color of H1 heading text.",
  "--h2-color": "The color of H2 heading text.",
  "--h3-color": "The color of H3 heading text.",
  "--h4-color": "The color of H4 heading text.",
  "--h5-color": "The color of H5 heading text.",
  "--h6-color": "The color of H6 heading text.",
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
  "--sidebar-border-color": "The color of the border next to the sidebars.",
  "--header-background":
    "The background for headers within panes (e.g., note title header).",
  "--header-border-color": "The border color below pane headers.",
  "--vault-name-color":
    "The color of your vault's name in the top-left corner.",
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
  "--scrollbar-thumb-bg": "The color of the draggable part of the scrollbar.",
  "--scrollbar-bg": "The color of the scrollbar track (the background).",
  "--divider-color":
    "The color of horizontal lines (`---`) and other dividers in the UI.",
  "--checklist-done-color":
    "The color of the checkmark and text for a completed to-do item.",
};

const COLOR_DESCRIPTIONS_AR = {
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
  "--text-normal": "لون النص الافتراضي لجميع الملاحظات ومعظم عناصر الواجهة.",
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
  "--text-highlight-bg": "لون خلفية النص المظلل باستخدام صيغة ==التظليل==.",
  // Headings
  "--h1-color": "لون نصوص العناوين من نوع H1.",
  "--h2-color": "لون نصوص العناوين من نوع H2.",
  "--h3-color": "لون نصوص العناوين من نوع H3.",
  "--h4-color": "لون نصوص العناوين من نوع H4.",
  "--h5-color": "لون نصوص العناوين من نوع H5.",
  "--h6-color": "لون نصوص العناوين من نوع H6.",
  // Interactive Elements
  "--interactive-normal": "لون خلفية العناصر التفاعلية مثل الأزرار.",
  "--interactive-hover": "لون خلفية العناصر التفاعلية عند مرور الفأرة فوقها.",
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
  "--header-background": "خلفية العناوين داخل اللوحات (مثل عنوان الملاحظة).",
  "--header-border-color": "لون الخط الفاصل تحت عناوين اللوحات.",
  "--vault-name-color": "لون اسم القبو (Vault) الخاص بك في الزاوية العلوية.",
  // Graph View
  "--graph-line": "لون الخطوط الواصلة بين الملاحظات في عرض الرسم البياني.",
  "--graph-node": "لون النقاط الدائرية للملاحظات الموجودة.",
  "--graph-text": "لون النصوص (أسماء الملاحظات) على النقاط في الرسم البياني.",
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
  "--divider-color": "لون الخطوط الأفقية (`---`) والفواصل الأخرى في الواجهة.",
  "--checklist-done-color": "لون علامة الصح والنص لمهمة منجزة في قائمة المهام.",
};

const DEFAULT_VARS = {
  "Plugin Integrations": {
    "--iconize-icon-color": "#00aaff",
  },
  Backgrounds: {
    "--background-primary": "#1e1e1e",
    "--background-primary-alt": "#252525",
    "--background-secondary": "#2a2a2a",
    "--background-secondary-alt": "#303030",
    "--background-modifier-border": "#444444",
    "--background-modifier-border-hover": "#555555",
    "--background-modifier-border-focus": "#007acc",
    "--background-modifier-flair": "#3a3a3a",
    "--background-modifier-hover": "#3a3a3a",
    "--background-modifier-active": "#4a4a4a",
  },
  Text: {
    "--text-normal": "#e0e0e0",
    "--text-muted": "#999999",
    "--text-faint": "#666666",
    "--text-on-accent": "#ffffff",
    "--text-accent": "#00aaff",
    "--text-accent-hover": "#33bbff",
    "--text-selection": "#007acc66",
    "--text-highlight-bg": "#ffff0066",
    "--h1-color": "#e0e0e0",
    "--h2-color": "#d0d0d0",
    "--h3-color": "#c0c0c0",
    "--h4-color": "#b0b0b0",
    "--h5-color": "#a0a0a0",
    "--h6-color": "#909090",
  },
  "Interactive Elements": {
    "--interactive-normal": "#5a5a5a",
    "--interactive-hover": "#6a6a6a",
    "--interactive-accent": "#007acc",
    "--interactive-accent-hover": "#3399dd",
    "--interactive-success": "#28a745",
    "--interactive-error": "#dc3545",
    "--interactive-warning": "#ffc107",
  },
  "UI Elements": {
    "--titlebar-background": "#252525",
    "--titlebar-background-focused": "#303030",
    "--titlebar-text-color": "#e0e0e0",
    "--sidebar-background": "#252525",
    "--sidebar-border-color": "#333333",
    "--header-background": "#2a2a2a",
    "--header-border-color": "#333333",
    "--vault-name-color": "#e0e0e0",
  },
  "Graph View": {
    "--graph-line": "#444444",
    "--graph-node": "#999999",
    "--graph-text": "#e0e0e0",
    "--graph-node-unresolved": "#dc3545",
    "--graph-node-focused": "#ffffff",
    "--graph-node-tag": "#86efac",
    "--graph-node-attachment": "#60a5fa",
  },
  Misc: {
    "--scrollbar-thumb-bg": "#444444",
    "--scrollbar-bg": "#2a2a2a",
    "--divider-color": "#444444",
    "--checklist-done-color": "#28a745",
  },
};

const OLED_MATRIX_VARS = {
  "--iconize-icon-color": "#00ff00",
  "--background-primary": "#000000",
  "--background-primary-alt": "#0a0a0a",
  "--background-secondary": "#050505",
  "--background-secondary-alt": "#101010",
  "--background-modifier-border": "#223322",
  "--background-modifier-border-hover": "#44ff44",
  "--background-modifier-border-focus": "#00ff00",
  "--background-modifier-flair": "#111111",
  "--background-modifier-hover": "#1a1a1a",
  "--background-modifier-active": "#002a00",
  "--text-normal": "#f0f0f0",
  "--text-muted": "#666666",
  "--text-faint": "#444444",
  "--text-on-accent": "#000000",
  "--text-accent": "#00ff00",
  "--text-accent-hover": "#88ff88",
  "--text-selection": "rgba(0, 255, 0, 0.3)",
  "--text-highlight-bg": "#00640080",
  "--interactive-normal": "#1c1c1c",
  "--interactive-hover": "#2c2c2c",
  "--interactive-accent": "#008a00",
  "--interactive-accent-hover": "#00ff00",
  "--interactive-success": "#28a745",
  "--interactive-error": "#dc3545",
  "--interactive-warning": "#ffc107",
  "--titlebar-background": "#000000",
  "--titlebar-background-focused": "#000000",
  "--titlebar-text-color": "#f0f0f0",
  "--sidebar-background": "#000000",
  "--sidebar-border-color": "#002a00",
  "--header-background": "#050505",
  "--header-border-color": "#223322",
  "--vault-name-color": "#00ff00",
  "--scrollbar-thumb-bg": "#222222",
  "--scrollbar-bg": "#000000",
  "--divider-color": "#223322",
  "--checklist-done-color": "#00ff00",
  "--graph-line": "#000000",
  "--graph-node": "#00ff00",
  "--graph-text": "#000000",
  "--graph-node-unresolved": "#00ff00",
  "--graph-node-focused": "#000000",
  "--graph-node-tag": "#000000",
  "--graph-node-attachment": "#00ff00",
};

const SOLARIZED_NEBULA_VARS = {
  "--iconize-icon-color": "#00a7b3",
  "--background-primary": "#002b36",
  "--background-primary-alt": "#073642",
  "--background-secondary": "#00212b",
  "--background-secondary-alt": "#073642",
  "--background-modifier-border": "#2a5f6f",
  "--background-modifier-border-hover": "#6c71c4",
  "--background-modifier-border-focus": "#268bd2",
  "--background-modifier-flair": "#073642",
  "--background-modifier-hover": "#073642",
  "--background-modifier-active": "#004354",
  "--text-normal": "#839496",
  "--text-muted": "#586e75",
  "--text-faint": "#4a5f68",
  "--text-on-accent": "#ffffff",
  "--text-accent": "#268bd2",
  "--text-accent-hover": "#5bb3e6ff",
  "--text-selection": "#586e7580",
  "--text-highlight-bg": "#cb4b1666",
  "--interactive-normal": "#073642",
  "--interactive-hover": "#004354",
  "--interactive-accent": "#268bd2",
  "--interactive-accent-hover": "#5ab3e6",
  "--interactive-success": "#859900",
  "--interactive-error": "#dc322f",
  "--interactive-warning": "#b58900",
  "--titlebar-background": "#00212b",
  "--titlebar-background-focused": "#073642",
  "--titlebar-text-color": "#839496",
  "--sidebar-background": "#00212b",
  "--sidebar-border-color": "#073642",
  "--header-background": "#002b36",
  "--header-border-color": "#073642",
  "--vault-name-color": "#b58900",
  "--scrollbar-thumb-bg": "#586e75",
  "--scrollbar-bg": "#00212b",
  "--divider-color": "#073642",
  "--checklist-done-color": "#859900",
  "--graph-line": "#444444",
  "--graph-node": "#999999",
  "--graph-text": "#e0e0e0",
  "--graph-node-unresolved": "#dc3545",
  "--graph-node-focused": "#ffffff",
  "--graph-node-tag": "#86efac",
  "--graph-node-attachment": "#60a5fa",
};

const CITRUS_ZEST_VARS = {
  "--iconize-icon-color": "#FF8C00",
  "--background-primary": "#F5F5F5",
  "--background-primary-alt": "#f2eded",
  "--background-secondary": "#f2eded",
  "--background-secondary-alt": "#F0F0F0",
  "--background-modifier-border": "#E0E0E0",
  "--background-modifier-border-hover": "#FF8C00",
  "--background-modifier-border-focus": "#F57C00",
  "--background-modifier-flair": "#FFFFFF",
  "--background-modifier-hover": "#EEEEEE",
  "--background-modifier-active": "#E0E0E0",
  "--text-normal": "#3c3434",
  "--text-muted": "#ff7300",
  "--text-faint": "#ff7b00",
  "--text-on-accent": "#FFFFFF",
  "--text-accent": "#F57C00",
  "--text-accent-hover": "#FF9800",
  "--text-selection": "#f27602",
  "--text-highlight-bg": "#E0E0E0",
  "--interactive-normal": "#F5F5F5",
  "--interactive-hover": "#EEEEEE",
  "--interactive-accent": "#FF8C00",
  "--interactive-accent-hover": "#FFA726",
  "--interactive-success": "#4CAF50",
  "--interactive-error": "#F44336",
  "--interactive-warning": "#FFC107",
  "--titlebar-background": "#FFFFFF",
  "--titlebar-background-focused": "#F7F7F7",
  "--titlebar-text-color": "#e0e0e0",
  "--sidebar-background": "#FFFFFF",
  "--sidebar-border-color": "#E0E0E0",
  "--header-background": "#FDFDFD",
  "--header-border-color": "#E0E0E0",
  "--vault-name-color": "#F57C00",
  "--scrollbar-thumb-bg": "#BDBDBD",
  "--scrollbar-bg": "#F5F5F5",
  "--divider-color": "#E0E0E0",
  "--checklist-done-color": "#757575",
  "--graph-line": "#F57C00",
  "--graph-node": "#999999",
  "--graph-text": "#e0e0e0",
  "--graph-node-unresolved": "#F57C00",
  "--graph-node-focused": "#ffffff",
  "--graph-node-tag": "#F57C00",
  "--graph-node-attachment": "#F57C00",
};

const CYBERPUNK_SUNSET_VARS = {
  "--iconize-icon-color": "#737aa2",
  "--background-primary": "#1a1b26",
  "--background-primary-alt": "#1f202e",
  "--background-secondary": "#16161e",
  "--background-secondary-alt": "#24283b",
  "--background-modifier-border": "#414868",
  "--background-modifier-border-hover": "#ff79c6",
  "--background-modifier-border-focus": "#bb9af7",
  "--background-modifier-flair": "#2a2e42",
  "--background-modifier-hover": "#292e42",
  "--background-modifier-active": "#414868",
  "--text-normal": "#c0caf5",
  "--text-muted": "#737aa2",
  "--text-faint": "#565f89",
  "--text-on-accent": "#1a1b26",
  "--text-accent": "#bb9af7",
  "--text-accent-hover": "#dbb2ff",
  "--text-selection": "#bb9af74d",
  "--text-highlight-bg": "#ff79c64d",
  "--interactive-normal": "#24283b",
  "--interactive-hover": "#414868",
  "--interactive-accent": "#bb9af7",
  "--interactive-accent-hover": "#dbb2ff",
  "--interactive-success": "#9ece6a",
  "--interactive-error": "#f7768e",
  "--interactive-warning": "#e0af68",
  "--titlebar-background": "#16161e",
  "--titlebar-background-focused": "#1f202e",
  "--titlebar-text-color": "#c0caf5",
  "--sidebar-background": "#16161e",
  "--sidebar-border-color": "#414868",
  "--header-background": "#1f202e",
  "--header-border-color": "#414868",
  "--vault-name-color": "#ff79c6",
  "--scrollbar-thumb-bg": "#414868",
  "--scrollbar-bg": "#16161e",
  "--divider-color": "#414868",
  "--checklist-done-color": "#9ece6a",
  "--graph-line": "#414868",
  "--graph-node": "#999999",
  "--graph-text": "#414868",
  "--graph-node-unresolved": "#414868",
  "--graph-node-focused": "#ffffff",
  "--graph-node-tag": "#86efac",
  "--graph-node-attachment": "#414868",
};

// Function to flatten the nested VARS object for easier processing
function flattenVars(varsObject) {
  let flatVars = {};
  for (const category in varsObject) {
    flatVars = { ...flatVars, ...varsObject[category] };
  }
  return flatVars;
}

const DEFAULT_SETTINGS = {
  pluginEnabled: true,
  language: "en",
  overrideIconizeColors: true,
  cleanupInterval: 5,
  colorUpdateFPS: 10,
  activeProfile: "Default",
  profiles: {
    Default: { vars: flattenVars(DEFAULT_VARS) },
    "OLED Matrix": { vars: OLED_MATRIX_VARS, themeType: "dark" },
    "Citrus Zest": { vars: CITRUS_ZEST_VARS, themeType: "light" },
    "Solarized Nebula": { vars: SOLARIZED_NEBULA_VARS, themeType: "dark" },
    CyberPunk: { vars: CYBERPUNK_SUNSET_VARS, themeType: "dark" },
  },
  pinnedSnapshots: {},
};

class ColorMaster extends Plugin {
  iconizeWatcherInterval = null;

  colorUpdateInterval = null;
  pendingVarUpdates = {};
  settingTabInstance = null;

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
        this.settingTabInstance.updateAccessibilityCheckers();
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

  applyCustomCssForProfile(profileName) {
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

  pinProfileSnapshot(profileName) {
    if (!profileName) profileName = this.settings.activeProfile;
    this.settings.pinnedSnapshots = this.settings.pinnedSnapshots || {};
    const profileVars = this.settings.profiles?.[profileName]?.vars || {};
    this.settings.pinnedSnapshots[profileName] = {
      pinnedAt: new Date().toISOString(),
      vars: JSON.parse(JSON.stringify(profileVars)),
    };
    return this.saveSettings();
  }

  async resetProfileToPinned(profileName) {
    if (!profileName) profileName = this.settings.activeProfile;
    const snap = this.settings.pinnedSnapshots?.[profileName];
    if (!snap || !snap.vars)
      throw new Error("No pinned snapshot for profile " + profileName);

    this.settings.profiles[profileName].vars = JSON.parse(
      JSON.stringify(snap.vars)
    );

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
        (id) => this.app.plugins.plugins[id]
      );

      if (!isIconizeInstalled) {
        this.removeOrphanedIconizeElements();
      }
    }, intervalMilliseconds);

    this.registerInterval(this.iconizeWatcherInterval);
  }

  async onload() {
    await this.loadSettings();
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
      id: "cycle-color-profile",
      name: "Cycle Color Master Profile",
      callback: async () => {
        const names = Object.keys(this.settings.profiles || {});
        if (names.length === 0) {
          new Notice("No profiles found.");
          return;
        }
        const idx = names.indexOf(this.settings.activeProfile);
        const next = names[(idx + 1) % names.length];
        this.settings.activeProfile = next;
        await this.saveSettings();
        new Notice(`Active profile: ${next}`);
      },
    });

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

      this.iconizeObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      this.register(() => this.iconizeObserver.disconnect());
    });
    this.resetIconizeWatcher();
    console.log("Color Master loaded with smart Iconize cleanup.");
  }

  onunload() {
    this.clearStyles();
    this.removeInjectedCustomCss();
    this.stopColorUpdateLoop();
    console.log("Color Master v1.0.4 unloaded.");
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

      [svg, ...svg.querySelectorAll("*")].forEach((el) => {
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
      (id) => this.app.plugins.plugins[id]
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
  }

  clearStyles() {
    const allVars = new Set();
    const activeProfile = this.settings.profiles[this.settings.activeProfile];
    if (activeProfile && activeProfile.vars) {
      Object.keys(activeProfile.vars).forEach((key) => allVars.add(key));
    }
    Object.keys(flattenVars(DEFAULT_VARS)).forEach((key) => allVars.add(key));

    allVars.forEach((key) => {
      document.body.style.removeProperty(key);
    });

    document.querySelectorAll(".iconize-icon").forEach((iconNode) => {
      const svg = iconNode.querySelector("svg");
      if (!svg) return;

      [svg, ...svg.querySelectorAll("*")].forEach((el) => {
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
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
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
}

// Maps text color variables to their common backgrounds for contrast checking.
const TEXT_TO_BG_MAP = {
  "--text-normal": "--background-primary",
  "--text-muted": "--background-primary",
  "--text-faint": "--background-primary",
  "--text-accent": "--background-primary",
  "--text-accent-hover": "--background-primary",
  "--h1-color": "--background-primary",
  "--h2-color": "--background-primary",
  "--h3-color": "--background-primary",
  "--h4-color": "--background-primary",
  "--h5-color": "--background-primary",
  "--h6-color": "--background-primary",
  "--text-on-accent": "--interactive-accent",
  "--vault-name-color": "--sidebar-background",
  "--titlebar-text-color": "--titlebar-background",
  "--graph-text": "--graph-node",
  "--checklist-done-color": "--background-primary",
  "--text-highlight-bg": "--text-normal",
};
// Paste / Import modal - UPGRADED with File Import
class ProfileJsonImportModal extends Modal {
  constructor(app, plugin, settingTabInstance) {
    super(app);
    this.plugin = plugin;
    this.settingTab = settingTabInstance;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: "Paste or Import Profile JSON" });

    // Text area for pasting
    contentEl.createEl("p", {
      text: "You can paste a profile JSON in the box below.",
    });
    this.textarea = contentEl.createEl("textarea", {
      cls: "cm-search-input",
      attr: { rows: 8, placeholder: '{ "name": "...", "profile": { ... } }' },
    });
    this.textarea.style.width = "100%";
    this.textarea.style.marginBottom = "15px";

    // File import button
    contentEl.createEl("p", {
      text: "Or, you can import directly from a file.",
    });
    new Setting(contentEl)
      .setName("Import from File")
      .setDesc("Select a .json profile file from your computer.")
      .addButton((button) => {
        button.setButtonText("Choose File...").onClick(() => {
          this._handleFileImport();
        });
      });

    // Action buttons (Merge/Replace)
    const ctrl = contentEl.createDiv({ cls: "cm-profile-actions" });
    ctrl.createDiv({ cls: "cm-profile-action-spacer" }); // Spacer
    const mergeBtn = ctrl.createEl("button", {
      text: "Merge",
      cls: "cm-profile-action-btn",
    });
    const replaceBtn = ctrl.createEl("button", {
      text: "Replace",
      cls: "cm-profile-action-btn mod-cta",
    });

    mergeBtn.addEventListener("click", () => this._applyImport("merge"));
    replaceBtn.addEventListener("click", () => this._applyImport("replace"));
  }

  _handleFileImport() {
    const input = createEl("input", {
      type: "file",
      attr: { accept: ".json" },
    });
    input.onchange = async () => {
      if (!input.files || input.files.length === 0) return;
      const file = input.files[0];
      const content = await file.text();
      this.textarea.value = content;
      new Notice(`File "${file.name}" loaded. You can now Merge or Replace.`);
    };
    input.click();
  }

  onClose() {
    this.contentEl.empty();
  }

  async _applyImport(mode) {
    const raw = this.textarea.value.trim();
    if (!raw) {
      new Notice(
        "The text box is empty. Paste some JSON or import a file first."
      );
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      new Notice("Invalid JSON.");
      return;
    }

    const profileObj = parsed.profile ? parsed.profile : parsed;
    if (!profileObj || typeof profileObj !== "object" || !profileObj.vars) {
      new Notice("JSON does not look like a valid profile (missing 'vars').");
      return;
    }

    const activeName = this.plugin.settings.activeProfile;
    if (!activeName) {
      new Notice("No active profile selected.");
      return;
    }

    if (mode === "replace") {
      this.plugin.settings.profiles[activeName].vars = { ...profileObj.vars };
    } else {
      this.plugin.settings.profiles[activeName].vars = {
        ...this.plugin.settings.profiles[activeName].vars,
        ...profileObj.vars,
      };
    }

    await this.plugin.saveSettings();
    Object.keys(profileObj.vars).forEach((k) => {
      this.plugin.pendingVarUpdates[k] = profileObj.vars[k];
    });
    this.plugin.applyPendingNow();
    this.settingTab.display();
    this.close();
    new Notice(`Profile ${mode}d successfully.`);
  }
}
class ColorMasterSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.graphViewTempState = null;
    this.graphViewWorkingState = null;
    this.graphHeaderButtonsEl = null;
  }

  initSearchUI(containerEl) {
    // create container
    this.searchContainer = containerEl.createDiv({
      cls: "cm-search-container",
    });
    const left = this.searchContainer.createDiv({ cls: "cm-search-left" });
    const right = this.searchContainer.createDiv({ cls: "cm-search-controls" });

    // Search input
    this.searchInput = left.createEl("input", {
      cls: "cm-search-input",
      type: "search",
      placeholder: "Search variables (name or value)...",
    });

    // controls: case toggle, regex toggle, section dropdown, clear button
    this.caseToggle = right.createEl("button", {
      cls: "cm-search-small",
      text: "Aa",
    });
    this.caseToggle.setAttr("aria-label", "Case-sensitive search");

    this.regexToggle = right.createEl("button", {
      cls: "cm-search-small",
      text: "/ /",
    });
    this.regexToggle.setAttr("aria-label", "Use regular expression");

    this.sectionSelect = right.createEl("select", { cls: "cm-search-small" });
    this.sectionSelect.createEl("option", { value: "", text: "All Sections" });

    try {
      Object.keys(DEFAULT_VARS || {}).forEach((k) => {
        this.sectionSelect.createEl("option", { value: k, text: k });
      });
    } catch (e) {}

    this.searchInfo = right.createEl("div", {
      cls: "cm-search-info",
      text: " ",
    });
    this.clearBtn = right.createEl("button", {
      cls: "cm-search-small",
      text: "Clear",
    });

    // state
    this._searchState = {
      query: "",
      regex: false,
      caseSensitive: false,
      section: "",
    };

    const debouncedFilter = this._debounce(
      () => this._applySearchFilter(),
      180
    );

    // events
    this.searchInput.addEventListener("input", (e) => {
      this._searchState.query = e.target.value;
      debouncedFilter();
    });
    this.caseToggle.addEventListener("click", () => {
      this._searchState.caseSensitive = !this._searchState.caseSensitive;
      this.caseToggle.toggleClass("is-active", this._searchState.caseSensitive);
      debouncedFilter();
    });
    this.regexToggle.addEventListener("click", () => {
      this._searchState.regex = !this._searchState.regex;
      this.regexToggle.toggleClass("is-active", this._searchState.regex);
      debouncedFilter();
    });
    this.sectionSelect.addEventListener("change", (e) => {
      this._searchState.section = e.target.value;
      debouncedFilter();
    });
    this.clearBtn.addEventListener("click", () => {
      this.searchInput.value = "";
      this.sectionSelect.value = "";
      this._searchState = {
        query: "",
        regex: false,
        caseSensitive: false,
        section: "",
      };
      this.caseToggle.removeClass("is-active");
      this.regexToggle.removeClass("is-active");
      this._applySearchFilter();
    });

    // initial populate
    this._applySearchFilter();
  }

  _debounce(fn, ms = 200) {
    let t = null;
    return (...args) => {
      if (t) clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  _getAllVarRows() {
    return Array.from(this.containerEl.querySelectorAll(".cm-var-row"));
  }

  _applySearchFilter() {
    const s = this._searchState;
    if (this.staticContentContainer) {
      const isSearching = s.query.trim().length > 0;
      this.staticContentContainer.toggleClass("cm-hidden", isSearching);
    }
    const rows = this._getAllVarRows();
    let visibleCount = 0;

    let qRegex = null;
    if (s.query && s.query.trim()) {
      if (s.regex) {
        try {
          qRegex = new RegExp(s.query, s.caseSensitive ? "" : "i");
        } catch (e) {
          qRegex = null;
        }
      }
    }

    rows.forEach((row) => {
      const varName = row.dataset.var || "";
      const category = row.dataset.category || "";
      const textInput = row.querySelector("input[type='text']");
      const varValue = textInput ? textInput.value.trim() : "";

      // Section filter
      if (s.section && s.section !== category) {
        row.classList.add("cm-hidden");
        return;
      }

      // Name/Value filter
      if (s.query && s.query.trim()) {
        const q = s.query.trim();
        let isMatch = false;

        if (s.regex && qRegex) {
          isMatch = qRegex.test(varName) || qRegex.test(varValue);
        } else {
          const queryLower = s.caseSensitive ? q : q.toLowerCase();
          const nameLower = s.caseSensitive ? varName : varName.toLowerCase();
          const valueLower = s.caseSensitive
            ? varValue
            : varValue.toLowerCase();
          isMatch =
            nameLower.includes(queryLower) || valueLower.includes(queryLower);
        }

        if (!isMatch) {
          row.classList.add("cm-hidden");
          return;
        }
      }

      row.classList.remove("cm-hidden");
      visibleCount++;
      this._highlightRowMatches(row, s);
    });
    const headings = this.containerEl.querySelectorAll(
      ".cm-category-container"
    );
    headings.forEach((heading) => {
      const category = heading.dataset.category;
      const hasVisibleRows = this.containerEl.querySelector(
        `.cm-var-row[data-category="${category}"]:not(.cm-hidden)`
      );

      if (hasVisibleRows) {
        heading.classList.remove("cm-hidden");
      } else {
        heading.classList.add("cm-hidden");
      }
    });
    this.searchInfo.setText(`${visibleCount} found`);
  }

  _highlightRowMatches(row, state) {
    const nameEl = row.querySelector(".cm-var-name");
    if (!nameEl) return;

    const originalText = nameEl.dataset.originalText || nameEl.textContent;
    nameEl.dataset.originalText = originalText;

    const query = state.query.trim();
    if (!query) {
      nameEl.innerHTML = originalText;
      return;
    }

    const flags = state.caseSensitive ? "g" : "gi";
    const regex = state.regex
      ? new RegExp(query, flags)
      : new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);

    try {
      nameEl.innerHTML = originalText.replace(
        regex,
        (match) => `<span class="cm-highlight">${match}</span>`
      );
    } catch (e) {
      nameEl.innerHTML = originalText;
    }
  }

  initProfileCopyUI(containerEl) {
    const actionsEl = containerEl.createDiv("cm-profile-actions");

    actionsEl
      .createEl("button", { text: "Export File", cls: "cm-profile-action-btn" })
      .addEventListener("click", () => this._exportProfileToFile());

    actionsEl
      .createEl("button", { text: "Copy JSON", cls: "cm-profile-action-btn" })
      .addEventListener("click", () => this._copyProfileToClipboard());

    actionsEl.createDiv({ cls: "cm-profile-action-spacer" });

    const pasteCssBtn = actionsEl.createEl("button", {
      text: "Paste CSS",
      cls: "cm-profile-action-btn cm-paste-css-btn",
    });
    const newBadge = pasteCssBtn.createSpan({
      cls: "cm-badge-new",
      text: "New",
    });
    pasteCssBtn.addEventListener("click", () => {
      new PasteCssModal(this.app, this.plugin, this).open();
    });

    actionsEl
      .createEl("button", {
        text: "Paste / Import...",
        cls: "cm-profile-action-btn mod-cta",
      })
      .addEventListener("click", () =>
        new ProfileJsonImportModal(this.app, this.plugin, this).open()
      );
  }

  _updatePinButtons() {
    const name = this.plugin.settings.activeProfile;
    const snapshot = this.plugin.settings.pinnedSnapshots?.[name];

    if (this.resetPinBtn) {
      this.resetPinBtn.setDisabled(!snapshot);
    }

    if (this.pinBtn) {
      if (snapshot && snapshot.pinnedAt) {
        const dateObj = new Date(snapshot.pinnedAt);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const formattedDate = `${year}-${month}-${day}`;

        this.pinBtn.setTooltip(
          `Colors pinned on ${formattedDate}. Click to re-pin.`
        );
      } else {
        this.pinBtn.setTooltip("Pin current colors as a snapshot");
      }
    }
  }

  initLikePluginUI(containerEl) {
    const likeCardEl = containerEl.createDiv("cm-like-card");
    const bannerContainer = likeCardEl.createDiv("cm-banner-container");
    bannerContainer.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="240" viewBox="0 0 1280 240" role="img" aria-label="Color Master banner" class="cm-banner-svg">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#0066FF"/>
      <stop offset="14%" stop-color="#7A00FF"/>
      <stop offset="28%" stop-color="#FF1E56"/>
      <stop offset="42%" stop-color="#FF3EB5"/>
      <stop offset="56%" stop-color="#FF7A00"/>
      <stop offset="70%" stop-color="#FFD200"/>
      <stop offset="84%" stop-color="#00D166"/>
      <stop offset="100%" stop-color="#00C2FF"/>
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="6" dy="6" stdDeviation="6" flood-color="#000" flood-opacity="0.45"/>
    </filter>
    <filter id="blackEdge" x="-200%" y="-200%" width="400%" height="400%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2.0" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" result="edge"/>
      <feMerge>
        <feMergeNode in="edge"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="1280" height="240" rx="16" ry="16" fill="url(#g)"/>
  <g filter="url(#shadow)">
    <text x="50%" y="55%" text-anchor="middle"
          font-family="Montserrat, 'Poppins', Arial, sans-serif"
          font-weight="800" font-size="110"
          fill="#000000" opacity="0.85" font-style="normal"
          stroke="none" >
      Color Master
    </text>
    <text x="50%" y="55%" text-anchor="middle"
          font-family="Montserrat, 'Poppins', Arial, sans-serif"
          font-weight="800" font-size="110"
          fill="#FFFFFF"
          stroke="#000000" stroke-width="4.2"
          stroke-linejoin="round"
          paint-order="stroke fill"
          font-style="normal"
          filter="url(#blackEdge)">
      Color Master
    </text>
  </g>
  <text x="50%" y="74%" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="18" fill="#FFFFFF" opacity="0.95">
    Theme your Obsidian — edit, save &amp; share color profiles
  </text>
  <text x="50%" y="84%" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="18" fill="#FFFFFF" opacity="0.95">
    Color Master for Obsidian — control themes &amp; color schemes
  </text>
</svg>
    `;

    const contentWrapper = likeCardEl.createDiv("cm-content-wrapper");

    // --- Stats Progress Bars ---
    const statsContainer = contentWrapper.createDiv("cm-like-stats");
    const profilesCount = this._calcProfilesCount();
    const varsCount = this._calcVarsCount();
    const integrationsCount = this._calcPluginIntegrations();
    const sinceInstalled =
      this.plugin.settings.installDate || new Date().toISOString();
    const days = Math.max(
      1,
      Math.floor(
        (Date.now() - new Date(sinceInstalled)) / (1000 * 60 * 60 * 24)
      )
    );

    this._createStatBar(
      statsContainer,
      "Profiles",
      profilesCount,
      10,
      "#00b3ffff"
    );
    this._createStatBar(
      statsContainer,
      "Customizable Colors",
      varsCount,
      varsCount,
      "#ffbb00ff"
    );
    this._createStatBar(
      statsContainer,
      "Plugin Integrations",
      integrationsCount,
      5,
      "#8000ffff"
    );
    this._createStatBar(statsContainer, "Days of Use", days, 365, "#ff0008ff");

    // --- Action Buttons ---
    const actions = contentWrapper.createDiv("cm-like-actions");

    const starButtonWrapper = actions.createDiv({ cls: "codepen-button" });
    starButtonWrapper.createEl("span", { text: "Star on GitHub" });
    starButtonWrapper.addEventListener("click", () => {
      window.open(
        "https://github.com/YazanAmmar/obsidian-color-master",
        "_blank"
      );
    });

    const reportButtonWrapper = actions.createDiv({ cls: "codepen-button" });
    reportButtonWrapper.createEl("span", { text: "Report an Issue" });
    reportButtonWrapper.addEventListener("click", () => {
      window.open(
        "https://github.com/YazanAmmar/obsidian-color-master/issues",
        "_blank"
      );
    });
    const syncPromoContainer = actions.createDiv({ cls: "cm-promo-container" });

    const syncButtonWrapper = syncPromoContainer.createDiv({
      cls: "codepen-button",
    });
    syncButtonWrapper.createEl("span", { text: "Sync Your Vault" });
    syncButtonWrapper.addEventListener("click", () => {
      window.open("https://github.com/YazanAmmar/SyncEveryThing", "_blank");
    });
    const myGithubButtonWrapper = actions.createDiv({ cls: "codepen-button" });
    myGithubButtonWrapper.createEl("span", { text: "My GitHub" });
    myGithubButtonWrapper.addEventListener("click", () => {
      window.open("https://github.com/YazanAmmar", "_blank");
    });
  }

  _launchLikeConfetti(hostEl) {
    const colors = ["#ff9a9e", "#ffd76b", "#6dd3ff", "#a6c1ee", "#b8ffb0"];
    for (let i = 0; i < 20; i++) {
      const p = hostEl.createDiv("piece");
      p.style.background = colors[i % colors.length];
      p.style.left = `${10 + Math.random() * 80}%`;
      p.style.top = `${-10 + Math.random() * 10}px`;

      const anim = p.animate(
        [
          { transform: "translate3d(0, 0, 0) rotate(0deg)", opacity: 1 },
          {
            transform: `translate3d(${
              (Math.random() - 0.5) * 200
            }px, 150px, 0) rotate(${(Math.random() - 0.5) * 540}deg)`,
            opacity: 0,
          },
        ],
        {
          duration: 1000 + Math.random() * 800,
          easing: "cubic-bezier(.15,.85,.25,1)",
          delay: Math.random() * 100,
        }
      );

      anim.onfinish = () => p.remove();
    }
  }

  _createStatBar(parentEl, label, value, max) {
    const skillBox = parentEl.createDiv("cm-stat-box");

    // --- Header with Title and Value ---
    const header = skillBox.createDiv("cm-stat-header");
    header.createEl("span", { cls: "title", text: label });
    header.createEl("span", { cls: "value", text: value });

    // --- Progress Bar ---
    const skillBar = skillBox.createDiv("skill-bar");
    const percentage = Math.min(100, Math.round((value / max) * 100));

    const skillPer = skillBar.createEl("span", { cls: "skill-per" });
    skillPer.style.width = `${percentage}%`;
    skillPer.style.background = `linear-gradient(115deg, #33ff00, #ffcc00, #8000ff, #00b7ff, #00ff66)`;
  }

  _calcProfilesCount() {
    return Object.keys(this.plugin.settings.profiles || {}).length;
  }

  _calcVarsCount() {
    return Object.keys(flattenVars(DEFAULT_VARS)).length;
  }

  _calcPluginIntegrations() {
    try {
      if (DEFAULT_VARS && DEFAULT_VARS["Plugin Integrations"]) {
        return Object.keys(DEFAULT_VARS["Plugin Integrations"]).length;
      }
    } catch (e) {
      console.error(
        "Color Master: Failed to calculate plugin integrations.",
        e
      );
    }
    return 0;
  }

  _getCurrentProfileJson() {
    const p =
      this.plugin.settings.profiles?.[this.plugin.settings.activeProfile];
    if (!p) return null;
    return {
      name: this.plugin.settings.activeProfile,
      exportedAt: new Date().toISOString(),
      profile: p,
    };
  }

  async _copyProfileToClipboard() {
    const payload = this._getCurrentProfileJson();
    if (!payload) {
      new Notice("No active profile to copy.");
      return;
    }
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    new Notice("Profile JSON copied to clipboard.");
  }

  _exportProfileToFile() {
    const payload = this._getCurrentProfileJson();
    if (!payload) {
      new Notice("No active profile to export.");
      return;
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `${this.plugin.settings.activeProfile}.profile.json`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }

  // --- Smart update function for contrast checkers ---
  updateAccessibilityCheckers() {
    const activeProfileVars =
      this.plugin.settings.profiles[this.plugin.settings.activeProfile].vars;
    const allDefaultVars = flattenVars(DEFAULT_VARS);

    const checkerElements = this.containerEl.querySelectorAll(
      ".cm-accessibility-checker"
    );

    checkerElements.forEach((checkerEl) => {
      const varName = checkerEl.dataset.varName;
      if (!varName) return;

      const bgVarForTextColor = TEXT_TO_BG_MAP[varName];
      if (!bgVarForTextColor) return;

      let textColor = activeProfileVars[varName] || allDefaultVars[varName];
      let bgColor =
        activeProfileVars[bgVarForTextColor] ||
        allDefaultVars[bgVarForTextColor];

      if (varName === "--text-highlight-bg") {
        [textColor, bgColor] = [bgColor, textColor];
      }

      if (!textColor || !bgColor) return;

      const ratio = getContrastRatio(bgColor, textColor);
      const rating = getAccessibilityRating(ratio);

      checkerEl.className = `cm-accessibility-checker ${rating.cls}`;
      checkerEl.setText(`${rating.text} (${rating.score})`);
    });
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    const isRTL = this.plugin.settings.language === "ar";
    this.containerEl.toggleClass("is-rtl", isRTL);
    this.containerEl.toggleClass("is-ltr", !isRTL);

    containerEl.createEl("h2", { text: t("PLUGIN_NAME") });

    new Setting(containerEl)
      .setName(t("ENABLE_PLUGIN"))
      .setDesc(t("ENABLE_PLUGIN_DESC"))
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.pluginEnabled)
          .onChange(async (value) => {
            this.plugin.settings.pluginEnabled = value;
            await this.plugin.saveSettings();
            this.plugin.restartColorUpdateLoop();
            new Notice(
              value ? t("PLUGIN_ENABLED_NOTICE") : t("PLUGIN_DISABLED_NOTICE")
            );
          });
      });

    new Setting(containerEl)
      .setName(t("LANGUAGE"))
      .setDesc(t("LANGUAGE_DESC"))
      .addDropdown((dropdown) => {
        dropdown.addOption("en", "English");
        dropdown.addOption("ar", "العربية");
        dropdown.setValue(this.plugin.settings.language);
        dropdown.onChange(async (value) => {
          this.plugin.settings.language = value;
          await this.plugin.saveSettings();
          this.display();
        });
      });

    this.initSearchUI(containerEl);
    this.staticContentContainer = containerEl.createDiv({
      cls: "cm-static-sections",
    });
    this.staticContentContainer.createEl("hr");
    this.drawProfileManager(this.staticContentContainer);
    this.initProfileCopyUI(this.staticContentContainer);
    this.staticContentContainer.createEl("h3", { text: t("OPTIONS_HEADING") });

    new Setting(this.staticContentContainer)
      .setName(t("UPDATE_FREQUENCY_NAME"))
      .setDesc(t("UPDATE_FREQUENCY_DESC"))
      .addSlider((slider) => {
        slider
          .setLimits(0, 60, 1)
          .setValue(this.plugin.settings.colorUpdateFPS)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.colorUpdateFPS = value;
            await this.plugin.saveSettings();
            this.plugin.restartColorUpdateLoop();
            new Notice(`Live Update FPS set to: ${value}`);
          });
      });

    new Setting(this.staticContentContainer)
      .setName(t("OVERRIDE_ICONIZE"))
      .setDesc(t("OVERRIDE_ICONIZE_DESC"))
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.overrideIconizeColors)
          .onChange(async (value) => {
            if (value) {
              const iconizeIDs = ["obsidian-icon-folder", "iconize"];
              const isIconizeInstalled = iconizeIDs.some(
                (id) => this.app.plugins.plugins[id]
              );

              if (!isIconizeInstalled) {
                new Notice(t("ICONIZE_NOT_FOUND_NOTICE"));
                toggle.setValue(false);
                return;
              }
            }
            this.plugin.settings.overrideIconizeColors = value;
            await this.plugin.saveSettings();
          });
        new Setting(this.staticContentContainer)
          .setName("Cleanup Interval")
          .setDesc(
            "Sets how often (in seconds) the plugin checks for uninstalled Iconize plugin to clean up its icons."
          )
          .addSlider((slider) => {
            slider
              .setLimits(1, 10, 1)
              .setValue(this.plugin.settings.cleanupInterval)
              .setDynamicTooltip()
              .onChange(async (value) => {
                this.plugin.settings.cleanupInterval = value;
                await this.plugin.saveSettings();
                this.plugin.resetIconizeWatcher();
              });
          });
      });

    this.drawColorPickers();
    containerEl.createEl("hr");
    this.initLikePluginUI(containerEl);
  }

  // ---------- Replacement hide() that acts like "Cancel" on accidental close ----------
  hide() {
    // If user had pending graph edits, treat closing the settings as a CANCEL action.
    if (this.graphViewTempState) {
      console.log(
        "Color Master: Settings closed with pending Graph edits. Performing Cancel (revert) instead of applying partial state."
      );

      // 1) Restore saved profile vars from the temp snapshot
      const profileVars =
        this.plugin.settings.profiles[this.plugin.settings.activeProfile]
          .vars || {};
      Object.assign(profileVars, this.graphViewTempState);

      // 2) Enqueue them so visuals update immediately (works for FPS==0 or >0)
      for (const k in this.graphViewTempState) {
        if (Object.prototype.hasOwnProperty.call(this.graphViewTempState, k)) {
          this.plugin.pendingVarUpdates[k] = this.graphViewTempState[k];
        }
      }

      // 3) Apply pending now to force visual restore
      try {
        this.plugin.applyPendingNow();
      } catch (e) {
        console.warn("Color Master: applyPendingNow failed during hide()", e);
        // fallback: trigger css-change
        this.app.workspace.trigger("css-change");
      }

      // 4) Clean up internal temporary state and UI buttons (but do NOT call this.display())
      this.graphViewTempState = null;
      this.graphViewWorkingState = null;
      this.hideGraphActionButtons && this.hideGraphActionButtons();

      // 5) Refresh graph views if plugin enabled
      if (this.plugin.settings.pluginEnabled) {
        try {
          this.plugin.refreshOpenGraphViews();
        } catch (e) {
          console.warn(
            "Color Master: refreshOpenGraphViews failed during hide()",
            e
          );
        }
      }

      // Ensure Obsidian re-evaluates styles
      this.app.workspace.trigger("css-change");
    }
  }

  async onGraphApply() {
    if (!this.graphViewWorkingState) return;
    const profileVars =
      this.plugin.settings.profiles[this.plugin.settings.activeProfile].vars ||
      {};

    Object.assign(profileVars, this.graphViewWorkingState);

    await this.plugin.saveSettings();

    this.graphViewTempState = null;
    this.graphViewWorkingState = null;
    this.hideGraphActionButtons();
    new Notice("Graph colors applied!");
  }

  onGraphCancel() {
    if (!this.graphViewTempState) {
      this.hideGraphActionButtons();
      return;
    }

    const profileVars =
      this.plugin.settings.profiles[this.plugin.settings.activeProfile].vars ||
      {};

    Object.assign(profileVars, this.graphViewTempState);

    for (const key in this.graphViewTempState) {
      this.plugin.pendingVarUpdates[key] = this.graphViewTempState[key];
    }
    this.plugin.applyPendingNow();

    this.graphViewTempState = null;
    this.graphViewWorkingState = null;
    this.hideGraphActionButtons();
    this.display();
  }

  showGraphActionButtons() {
    this.graphHeaderButtonsEl.empty();

    const applyButton = this.graphHeaderButtonsEl.createEl("button", {
      text: "Apply",
      cls: "mod-cta",
    });
    applyButton.addEventListener("click", () => this.onGraphApply());

    const cancelButton = this.graphHeaderButtonsEl.createEl("button", {
      text: "Cancel",
    });
    cancelButton.addEventListener("click", () => this.onGraphCancel());
  }
  // ---------- Ensure hideGraphActionButtons also clears workingState ----------
  hideGraphActionButtons() {
    // Clear both states
    this.graphViewTempState = null;
    this.graphViewWorkingState = null;

    if (this.graphHeaderButtonsEl) {
      this.graphHeaderButtonsEl.empty();
    }
  }
  drawProfileManager(containerEl) {
    containerEl.createEl("h3", { text: t("PROFILE_MANAGER") });

    new Setting(containerEl)
      .setName(t("ACTIVE_PROFILE"))
      .setDesc(t("ACTIVE_PROFILE_DESC"))
      .addDropdown((dropdown) => {
        for (const profileName in this.plugin.settings.profiles) {
          let displayName = profileName;
          if (this.plugin.settings.profiles[profileName]?.isCssProfile) {
            displayName += " (CSS)";
          }
          dropdown.addOption(profileName, displayName);
        }
        dropdown.setValue(this.plugin.settings.activeProfile);
        dropdown.onChange(async (value) => {
          this.plugin.removeInjectedCustomCss();

          this.plugin.settings.activeProfile = value;
          await this.plugin.saveSettings();
          this.display();
        });
      })
      .addButton((button) => {
        this.pinBtn = button; // Save reference to the button component
        button
          .setIcon("pin")
          .setTooltip("Pin current colors as a snapshot")
          .onClick(async () => {
            await this.plugin.pinProfileSnapshot(
              this.plugin.settings.activeProfile
            );
            new Notice("Profile colors pinned successfully!");
            this._updatePinButtons();
          });
      })
      .addButton((button) => {
        this.resetPinBtn = button; // Save reference
        button
          .setIcon("reset")
          .setTooltip("Reset to pinned colors")
          .onClick(() => {
            const name = this.plugin.settings.activeProfile;
            new ConfirmationModal(
              this.app,
              t("RESET_CONFIRM_TITLE"),
              t("RESET_CONFIRM_DESC"),
              async () => {
                await this.plugin.resetProfileToPinned(name);
                new Notice("Profile has been reset to the pinned snapshot.");
                this.display();
              }
            ).open();
          });
      })
      .addButton((button) => {
        button.setButtonText(t("NEW_BUTTON")).onClick(() => {
          new NewProfileModal(this.app, (result) => {
            if (
              result &&
              result.name &&
              !this.plugin.settings.profiles[result.name]
            ) {
              this.plugin.settings.profiles[result.name] = {
                vars: { ...flattenVars(DEFAULT_VARS) },
                themeType: result.themeType,
              };
              this.plugin.settings.activeProfile = result.name;
              this.plugin.saveSettings();
              this.display();
            } else if (result && result.name) {
              new Notice(t("PROFILE_EXISTS_NOTICE", result.name));
            }
          }).open();
        });
      })
      .addButton((button) => {
        button.setButtonText(t("DELETE_BUTTON")).onClick(() => {
          this.plugin.removeInjectedCustomCss();

          if (Object.keys(this.plugin.settings.profiles).length <= 1) {
            new Notice(t("CANNOT_DELETE_LAST_PROFILE"));
            return;
          }
          const message = t(
            "DELETE_PROFILE_CONFIRMATION",
            this.plugin.settings.activeProfile
          );
          new ConfirmationModal(
            this.app,
            t("DELETE_PROFILE_TITLE"),
            message,
            () => {
              delete this.plugin.settings.profiles[
                this.plugin.settings.activeProfile
              ];
              this.plugin.settings.activeProfile = Object.keys(
                this.plugin.settings.profiles
              )[0];
              this.plugin.saveSettings();
              this.display();
              new Notice(t("PROFILE_DELETED_NOTICE"));
            }
          ).open();
        });
      });

    this._updatePinButtons(); // Update buttons on initial draw
  }

  drawColorPickers() {
    const { containerEl } = this;
    const activeProfileVars =
      this.plugin.settings.profiles[this.plugin.settings.activeProfile].vars;

    for (const [category, vars] of Object.entries(DEFAULT_VARS)) {
      if (category === "Graph View") {
        const graphHeader = containerEl.createDiv({
          cls: ["cm-graph-header", "cm-category-container"],
        });
        graphHeader.dataset.category = category;

        const graphHeading = graphHeader.createEl("h3", {
          text: t("GRAPH_VIEW") || category,
        });

        const buttonContainer = graphHeader.createDiv({
          cls: "cm-buttons-wrapper",
        });

        new Setting(buttonContainer)
          .setClass("cm-refresh-button-setting")
          .addButton((button) => {
            button
              .setIcon("refresh-cw")
              .setTooltip(t("FORCE_REFRESH_TOOLTIP"))
              .onClick(() => {
                this.app.workspace.trigger("css-change");
                new Notice("UI Refreshed!");
              });
          });

        this.graphHeaderButtonsEl = buttonContainer.createDiv({
          cls: "cm-temporary-buttons",
        });
      } else {
        const headingEl = containerEl.createEl("h3", {
          text: t(category.toUpperCase().replace(" ", "_")) || category,
          cls: "cm-category-container",
        });
        headingEl.dataset.category = category;
      }

      for (const [varName, defaultValue] of Object.entries(vars)) {
        const description =
          this.plugin.settings.language === "ar"
            ? COLOR_DESCRIPTIONS_AR[varName] || ""
            : COLOR_DESCRIPTIONS[varName] || "";
        const setting = new Setting(containerEl)
          .setName(varName.replace("--", "").replace(/-/g, " "))
          .setDesc(description);

        setting.settingEl.classList.add("cm-var-row");
        setting.settingEl.dataset.var = varName;
        setting.settingEl.dataset.category = category;
        setting.nameEl.classList.add("cm-var-name");

        const bgVarForTextColor = TEXT_TO_BG_MAP[varName];

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
          this.graphViewWorkingState &&
          this.graphViewWorkingState[varName] !== undefined
        ) {
          initialValue = this.graphViewWorkingState[varName];
        } else {
          initialValue = activeProfileVars[varName] || defaultValue;
        }
        colorPicker.value = initialValue;
        textInput.value = initialValue;

        // --- New Performance-Optimized Event Handling ---

        // Event 1: While dragging (input event) - for live preview
        colorPicker.addEventListener("input", (e) => {
          const newColor = e.target.value;
          textInput.value = newColor; // Update text field immediately

          // If live preview is enabled, put the change in the "pending box"
          if (this.plugin.settings.colorUpdateFPS > 0) {
            this.plugin.pendingVarUpdates[varName] = newColor;
          }
        });

        const handleFinalChange = (newColor) => {
          const profile =
            this.plugin.settings.profiles[this.plugin.settings.activeProfile];
          const oldColor = profile.vars[varName] || defaultValue;

          if (oldColor.toLowerCase() !== newColor.toLowerCase()) {
            profile.history = profile.history || {};
            profile.history[varName] = profile.history[varName] || [];

            profile.history[varName].unshift(oldColor);

            profile.history[varName] = profile.history[varName].slice(0, 5);
          }
          if (category === "Graph View") {
            if (!this.graphViewTempState) {
              this.graphViewTempState = {};
              const profileVars =
                this.plugin.settings.profiles[
                  this.plugin.settings.activeProfile
                ].vars || {};
              Object.keys(DEFAULT_VARS["Graph View"]).forEach((key) => {
                this.graphViewTempState[key] =
                  profileVars[key] ?? DEFAULT_VARS["Graph View"][key];
              });
            }

            if (!this.graphViewWorkingState) {
              this.graphViewWorkingState = { ...this.graphViewTempState };
            }

            this.graphViewWorkingState[varName] = newColor;
            this.showGraphActionButtons();

            this.plugin.pendingVarUpdates[varName] = newColor;
            if (this.plugin.settings.colorUpdateFPS === 0) {
              this.plugin.applyPendingNow();
            } else {
              this.plugin.startColorUpdateLoop();
            }
            return;
          }

          activeProfileVars[varName] = newColor;

          if (this.plugin.settings.colorUpdateFPS === 0) {
            this.plugin.pendingVarUpdates[varName] = newColor;
            this.plugin.applyPendingNow();
            this.plugin.saveSettings();
            return;
          }

          this.plugin.pendingVarUpdates[varName] = newColor;
          this.plugin.saveSettings();
          setTimeout(() => this.app.workspace.trigger("css-change"), 50);
        };

        colorPicker.addEventListener("change", (e) => {
          handleFinalChange(e.target.value);
        });

        textInput.addEventListener("change", (e) => {
          colorPicker.value = e.target.value;
          handleFinalChange(e.target.value);
        });

        setting.addExtraButton((button) => {
          button
            .setIcon("reset")
            .setTooltip("Undo last change")
            .onClick(async () => {
              const profile =
                this.plugin.settings.profiles[
                  this.plugin.settings.activeProfile
                ];
              const history = profile.history?.[varName];

              let restoredColor;
              let noticeMessage = "";

              if (history && history.length > 0) {
                const restoredColor = history.shift();

                activeProfileVars[varName] = restoredColor;
                colorPicker.value = restoredColor;
                textInput.value = restoredColor;

                await this.plugin.saveSettings();
                this.updateAccessibilityCheckers();
                new Notice(`Restored: ${restoredColor}`);
              } else {
                new Notice("No color history to restore.");
              }
            });
        });
      }
    }
  }
}

class NewProfileModal extends Modal {
  constructor(app, onSubmit) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: t("NEW_PROFILE_TITLE") });

    let profileName = "";
    let themeType = "auto";

    new Setting(contentEl).setName(t("PROFILE_NAME_LABEL")).addText((text) => {
      text.setPlaceholder(t("PROFILE_NAME_PLACEHOLDER")).onChange((value) => {
        profileName = value;
      });
    });

    new Setting(contentEl)
      .setName(t("PROFILE_THEME_TYPE"))
      .setDesc(t("PROFILE_THEME_TYPE_DESC"))
      .addDropdown((dropdown) => {
        dropdown.addOption("auto", t("THEME_TYPE_AUTO"));
        dropdown.addOption("dark", t("THEME_TYPE_DARK"));
        dropdown.addOption("light", t("THEME_TYPE_LIGHT"));
        dropdown.setValue(themeType);
        dropdown.onChange((value) => {
          themeType = value;
        });
      });

    const buttonContainer = contentEl.createDiv({
      cls: "modal-button-container",
      attr: { style: "justify-content: flex-end;" },
    });

    const cancelButton = buttonContainer.createEl("button", {
      text: t("CANCEL_BUTTON"),
    });
    cancelButton.addEventListener("click", () => this.close());

    const createButton = buttonContainer.createEl("button", {
      text: t("CREATE_BUTTON"),
      cls: "mod-cta",
    });

    const submit = () => {
      if (profileName.trim() !== "") {
        this.onSubmit({ name: profileName.trim(), themeType: themeType });
        this.close();
      } else {
        new Notice(t("EMPTY_PROFILE_NAME_NOTICE"));
      }
    };

    createButton.addEventListener("click", submit);

    contentEl
      .querySelector('input[type="text"]')
      .addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          submit();
        }
      });
  }

  onClose() {
    this.contentEl.empty();
  }
}

class ConfirmationModal extends Modal {
  constructor(app, title, message, onConfirm) {
    super(app);
    this.title = title;
    this.message = message;
    this.onConfirm = onConfirm;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: this.title });
    contentEl.createEl("p", { text: this.message });

    const buttonContainer = contentEl.createDiv({
      cls: "modal-button-container",
      attr: { style: "justify-content: flex-end;" },
    });

    const cancelButton = buttonContainer.createEl("button", {
      text: t("CANCEL_BUTTON"),
    });
    cancelButton.addEventListener("click", () => this.close());

    const confirmButton = buttonContainer.createEl("button", {
      text: t("DELETE_BUTTON"),
      cls: "mod-warning",
    });
    confirmButton.addEventListener("click", () => {
      this.onConfirm();
      this.close();
    });
  }

  onClose() {
    this.contentEl.empty();
  }
}

// --- Accessibility (a11y) Checker Logic ---
function getLuminance(hex) {
  const rgb = parseInt(hex.startsWith("#") ? hex.substring(1) : hex, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function getAccessibilityRating(ratio) {
  const score = ratio.toFixed(2);
  if (ratio >= 7) {
    return { text: "AAA", score, cls: "cm-accessibility-pass" };
  }
  if (ratio >= 4.5) {
    return { text: "AA", score, cls: "cm-accessibility-pass" };
  }
  if (ratio >= 3) {
    return { text: "AA Large", score, cls: "cm-accessibility-warn" };
  }
  return { text: "Fail", score, cls: "cm-accessibility-fail" };
}

class PasteCssModal extends Modal {
  constructor(app, plugin, settingTab) {
    super(app);
    this.plugin = plugin;
    this.settingTab = settingTab;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: "Paste CSS and create profile" });
    contentEl.createEl("div", {
      text: "Note: Pasted CSS can affect UI; proceed only with trusted CSS.",
    });

    // name input
    const nameRow = contentEl.createDiv();
    nameRow.createEl("label", {
      text: "Profile name :",
      cls: "cm-modal-label",
    });
    this.nameInput = nameRow.createEl("input", {
      type: "text",
      placeholder: t("PROFILE_NAME_PLACEHOLDER"),
      attr: { style: "width:100%" },
    });

    // textarea
    this.textarea = contentEl.createEl("textarea", {
      cls: "cm-search-input",
      attr: { rows: 12, placeholder: "Paste your CSS here..." },
    });
    this.textarea.style.width = "100%";
    this.textarea.style.marginTop = "8px";

    // controls
    const ctrl = contentEl.createDiv({
      cls: "cm-profile-actions",
      attr: { style: "justify-content: flex-end; margin-top:8px; gap:8px;" },
    });
    const cancelBtn = ctrl.createEl("button", {
      text: "Cancel",
      cls: "cm-profile-action-btn",
    });
    const saveBtn = ctrl.createEl("button", {
      text: "Save as profile",
      cls: "mod-cta",
    });

    saveBtn.addEventListener("click", async () => {
      const cssText = this.textarea.value.trim();
      let name = this.nameInput.value.trim();

      if (!cssText) {
        new Notice("Paste some CSS first.");
        return;
      }
      if (!name) {
        name = `CSS Profile ${Date.now()}`;
      }

      const proceedWithSave = async () => {
        this.plugin.settings.profiles[name] =
          this.plugin.settings.profiles[name] || {};
        this.plugin.settings.profiles[name].vars =
          this.plugin.settings.profiles[name].vars || {};
        this.plugin.settings.profiles[name].isCssProfile = true;
        this.plugin.settings.profiles[name].customCss = cssText;
        this.plugin.settings.activeProfile = name;

        await this.plugin.saveSettings();
        this.settingTab.display();
        new Notice(`Profile "${name}" created and applied.`);
        this.close();
      };

      if (this.plugin.settings.profiles[name]) {
        new ConfirmationModal(
          this.app,
          "Overwrite Profile?",
          `Profile "${name}" already exists. Are you sure you want to overwrite it?`,
          proceedWithSave
        ).open();
      } else {
        proceedWithSave();
      }
    });

    cancelBtn.addEventListener("click", () => this.close());
  }

  onClose() {
    this.contentEl.empty();
  }
}

module.exports = ColorMaster;
