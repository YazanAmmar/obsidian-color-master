/*
 * Color Master - Obsidian Plugin
 * Version: 1.0.1 
 * Author: Yazan_Amar (GitHub : https://github.com/yazanammar )
 * Description: Provides a comprehensive UI to control all Obsidian CSS color variables directly, 
 * removing the need for Force Mode and expanding customization options.
*/

const STRINGS = {
    en: {
        PLUGIN_NAME: "Color Master",
        ENABLE_PLUGIN: "Enable Color Master",
        ENABLE_PLUGIN_DESC: "Turn this off to temporarily disable all custom colors and revert to your active Obsidian theme.",
        PLUGIN_ENABLED_NOTICE: "Color Master Enabled",
        PLUGIN_DISABLED_NOTICE: "Color Master Disabled",
        LANGUAGE: "Language",
        LANGUAGE_DESC: "Set the interface language for the plugin.",
        PROFILE_MANAGER: "Profile Manager",
        ACTIVE_PROFILE: "Active Profile",
        ACTIVE_PROFILE_DESC: "Manage and switch between color profiles.",
        NEW_BUTTON: "New",
        DELETE_BUTTON: "Delete",
        RESET_BUTTON_TOOLTIP: "Reset to default",
        EXPORT_BUTTON_TOOLTIP: "Export active profile",
        IMPORT_BUTTON_TOOLTIP: "Import new profile",
        ICONIZE_PLUGIN: "Iconize Plugin",
        OVERRIDE_ICONIZE: "Override Iconize Plugin Colors", 
        OVERRIDE_ICONIZE_DESC: "Let Color Master control all icon colors from the Iconize plugin. For best results, disable the color settings within Iconize itself.", 
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
        DELETE_PROFILE_CONFIRMATION: (name) => `Are you sure you want to delete the profile "${name}"? This action cannot be undone.`,
        PROFILE_DELETED_NOTICE: "Profile deleted.",
        CANNOT_DELETE_LAST_PROFILE: "Cannot delete the last profile.",
    },
    ar: {
        PLUGIN_NAME: "متحكم الألوان",
        ENABLE_PLUGIN: "تفعيل متحكم الألوان",
        ENABLE_PLUGIN_DESC: "أطفئ هذا الخيار لتعطيل جميع الألوان المخصصة مؤقتاً والعودة إلى ثيم Obsidian النشط.",
        PLUGIN_ENABLED_NOTICE: "تم تفعيل متحكم الألوان",
        PLUGIN_DISABLED_NOTICE: "تم تعطيل متحكم الألوان",
        LANGUAGE: "اللغة",
        LANGUAGE_DESC: "اختر لغة واجهة الإضافة.",
        PROFILE_MANAGER: "إدارة التشكيلات",
        ACTIVE_PROFILE: "التشكيلة النشطة",
        ACTIVE_PROFILE_DESC: "تنقل بين التشكيلات أو أنشئ واحدة جديدة.",
        NEW_BUTTON: "جديد",
        DELETE_BUTTON: "حذف",
        RESET_BUTTON_TOOLTIP: "إعادة تعيين للقيمة الافتراضية",
        EXPORT_BUTTON_TOOLTIP: "تصدير التشكيلة النشطة",
        IMPORT_BUTTON_TOOLTIP: "استيراد تشكيلة جديدة",
        ICONIZE_PLUGIN: "إضافة Iconize",
        OVERRIDE_ICONIZE: "تجاوز ألوان إضافة Iconize", 
        OVERRIDE_ICONIZE_DESC: "اسمح لـ Color Master بالتحكم في كل ألوان أيقونات Iconize. لأفضل النتائج، قم بتعطيل إعدادات الألوان في إضافة Iconize نفسها.", 
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
        DELETE_PROFILE_CONFIRMATION: (name) => `هل أنت متأكد من رغبتك في حذف التشكيلة "${name}"؟ لا يمكن التراجع عن هذا الإجراء.`,
        PROFILE_DELETED_NOTICE: "تم حذف التشكيلة.",
        CANNOT_DELETE_LAST_PROFILE: "لا يمكن حذف آخر تشكيلة.",
    }
};

// Helper function to get the correct translation
const t = (key, ...args) => {
    const lang = T.settings?.language || 'en';
    const string = STRINGS[lang][key] || STRINGS['en'][key];
    if (typeof string === 'function') {
        return string(...args);
    }
    return string;
};

let T;

const { Plugin, PluginSettingTab, Setting, Notice, Modal } = require('obsidian');

// A comprehensive list of Obsidian's themeable color variables.
const OBSIDIAN_COLOR_VARS = {
    "": { 
        "--iconize-icon-color": "#808080"
    },
    "Backgrounds": {
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
    "Text": {
        "--text-normal": "#e0e0e0",
        "--text-muted": "#999999",
        "--text-faint": "#666666",
        "--text-on-accent": "#ffffff",
        "--text-accent": "#00aaff",
        "--text-accent-hover": "#33bbff",
        "--text-selection": "rgba(0, 122, 204, 0.4)",
        "--text-highlight-bg": "rgba(255, 255, 0, 0.4)",
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
    "Misc": {
        "--scrollbar-thumb-bg": "#444444",
        "--scrollbar-bg": "#2a2a2a",
        "--divider-color": "#444444",
        "--checklist-done-color": "#28a745",
    },
};


const COLOR_DESCRIPTIONS = {
    // Iconize
    "--iconize-icon-color": "Sets the color for all icons added by the Iconize plugin. This will override Iconize's own color settings.",
    // Backgrounds
    "--background-primary": "Main background color for the entire app, especially for editor and note panes.",
    "--background-primary-alt": "An alternate background color, often used for the active line in the editor.",
    "--background-secondary": "Secondary background, typically used for sidebars and other UI panels.",
    "--background-secondary-alt": "An alternate secondary background, used for the file explorer's active file.",
    "--background-modifier-border": "The color of borders on various UI elements like buttons and inputs.",
    "--background-modifier-border-hover": "The border color when you hover over an element.",
    "--background-modifier-border-focus": "The border color for a focused element, like a selected text field.",
    "--background-modifier-flair": "Background color for special UI elements, like the 'Syncing' or 'Indexing' status.",
    "--background-modifier-hover": "The background color of elements when you hover over them (e.g., list items).",
    "--background-modifier-active": "The background color of an element when it's actively being clicked or is selected.",
    // Text
    "--text-normal": "The default text color for all notes and most of the UI.",
    "--text-muted": "A slightly faded text color, used for less important information like file metadata.",
    "--text-faint": "The most faded text color, for very subtle UI text or disabled elements.",
    "--text-on-accent": "Text color that appears on top of accented backgrounds (like on a primary button).",
    "--text-accent": "The primary accent color for text, used for links and highlighted UI elements.",
    "--text-accent-hover": "The color of accent text (like links) when you hover over it.",
    "--text-selection": "The background color of text that you have selected with your cursor.",
    "--text-highlight-bg": "The background color for text highlighted with ==highlight== syntax.",
    // Interactive Elements
    "--interactive-normal": "The background color for interactive elements like buttons.",
    "--interactive-hover": "The background color for interactive elements when hovered.",
    "--interactive-accent": "The accent color for important interactive elements (e.g., the 'Create' button).",
    "--interactive-accent-hover": "The accent color for important interactive elements when hovered.",
    "--interactive-success": "Color indicating a successful operation (e.g., green).",
    "--interactive-error": "Color indicating an error (e.g., red).",
    "--interactive-warning": "Color indicating a warning (e.g., yellow).",
    // UI Elements
    "--titlebar-background": "The background color of the main window's title bar.",
    "--titlebar-background-focused": "The title bar background color when the window is active.",
    "--titlebar-text-color": "The text color in the title bar.",
    "--sidebar-background": "Specifically targets the background of the sidebars.",
    "--sidebar-border-color": "The color of the border next to the sidebars.",
    "--header-background": "The background for headers within panes (e.g., note title header).",
    "--header-border-color": "The border color below pane headers.",
    "--vault-name-color": "The color of your vault's name in the top-left corner.",
    // Misc
    "--scrollbar-thumb-bg": "The color of the draggable part of the scrollbar.",
    "--scrollbar-bg": "The color of the scrollbar track (the background).",
    "--divider-color": "The color of horizontal lines (`---`) and other dividers in the UI.",
    "--checklist-done-color": "The color of the checkmark and text for a completed to-do item.",
};

const COLOR_DESCRIPTIONS_AR = {
    // Iconize
    "--iconize-icon-color": "يحدد لون جميع الأيقونات المضافة بواسطة إضافة Iconize. هذا الخيار سيتجاوز إعدادات الألوان الخاصة بالإضافة.",
    // Backgrounds
    "--background-primary": "لون الخلفية الأساسي للتطبيق بالكامل، خصوصاً للمحرر وصفحات الملاحظات.",
    "--background-primary-alt": "لون خلفية بديل، يستخدم غالباً للسطر النشط في المحرر.",
    "--background-secondary": "خلفية ثانوية، تستخدم عادةً للأشرطة الجانبية واللوحات الأخرى.",
    "--background-secondary-alt": "خلفية ثانوية بديلة، تستخدم لعناصر مثل الملف النشط في مستكشف الملفات.",
    "--background-modifier-border": "لون الإطارات (Borders) على مختلف عناصر الواجهة كالأزرار وحقول الإدخال.",
    "--background-modifier-border-hover": "لون الإطار عند مرور مؤشر الفأرة فوق العنصر.",
    "--background-modifier-border-focus": "لون الإطار عندما يكون العنصر محدداً، مثل حقل نصي نشط.",
    "--background-modifier-flair": "لون خلفية لعناصر واجهة خاصة، مثل حالة 'المزامنة' أو 'الفهرسة'.",
    "--background-modifier-hover": "لون خلفية العناصر عند مرور مؤشر الفأرة فوقها (مثل عناصر القوائم).",
    "--background-modifier-active": "لون خلفية العنصر عند النقر عليه أو عندما يكون محدداً ونشطاً.",
    // Text
    "--text-normal": "لون النص الافتراضي لجميع الملاحظات ومعظم عناصر الواجهة.",
    "--text-muted": "لون نص باهت قليلاً، يستخدم للمعلومات الأقل أهمية مثل بيانات الملف.",
    "--text-faint": "أكثر لون نص باهت، يستخدم لنصوص الواجهة الخفية جداً أو العناصر المعطلة.",
    "--text-on-accent": "لون النص الذي يظهر فوق الخلفيات الملونة (Accent)، مثل نص على زر أساسي.",
    "--text-accent": "اللون المميز (Accent) الأساسي للنصوص، يستخدم للروابط وعناصر الواجهة الهامة.",
    "--text-accent-hover": "لون النص المميز (مثل الروابط) عند مرور مؤشر الفأرة فوقه.",
    "--text-selection": "لون خلفية النص الذي تحدده بمؤشر الفأرة.",
    "--text-highlight-bg": "لون خلفية النص المظلل باستخدام صيغة ==التظليل==.",
    // Interactive Elements
    "--interactive-normal": "لون خلفية العناصر التفاعلية مثل الأزرار.",
    "--interactive-hover": "لون خلفية العناصر التفاعلية عند مرور الفأرة فوقها.",
    "--interactive-accent": "اللون المميز للعناصر التفاعلية الهامة (مثل زر 'إنشاء').",
    "--interactive-accent-hover": "اللون المميز للعناصر التفاعلية الهامة عند مرور الفأرة فوقها.",
    "--interactive-success": "لون يدل على عملية ناجحة (مثل الأخضر).",
    "--interactive-error": "لون يدل على حدوث خطأ (مثل الأحمر).",
    "--interactive-warning": "لون يدل على وجود تحذير (مثل الأصفر).",
    // UI Elements
    "--titlebar-background": "لون خلفية شريط العنوان للنافذة الرئيسية.",
    "--titlebar-background-focused": "لون خلفية شريط العنوان عندما تكون النافذة نشطة.",
    "--titlebar-text-color": "لون النص في شريط العنوان.",
    "--sidebar-background": "يستهدف بشكل خاص خلفية الأشرطة الجانبية.",
    "--sidebar-border-color": "لون الخط الفاصل بجانب الأشرطة الجانبية.",
    "--header-background": "خلفية العناوين داخل اللوحات (مثل عنوان الملاحظة).",
    "--header-border-color": "لون الخط الفاصل تحت عناوين اللوحات.",
    "--vault-name-color": "لون اسم القبو (Vault) الخاص بك في الزاوية العلوية.",
    // Misc
    "--scrollbar-thumb-bg": "لون الجزء القابل للسحب من شريط التمرير.",
    "--scrollbar-bg": "لون مسار شريط التمرير (الخلفية).",
    "--divider-color": "لون الخطوط الأفقية (`---`) والفواصل الأخرى في الواجهة.",
    "--checklist-done-color": "لون علامة الصح والنص لمهمة منجزة في قائمة المهام.",
};

const OLED_MATRIX_VARS = {
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
    "--text-highlight-bg": "rgba(0, 100, 0, 0.5)",
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
    "--checklist-done-color": "#00ff00"
};

const SOLARIZED_NEBULA_VARS = {
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
    "--text-accent-hover": "#5ab3e6",
    "--text-selection": "rgba(88, 110, 117, 0.5)",
    "--text-highlight-bg": "rgba(203, 75, 22, 0.4)",
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
    "--checklist-done-color": "#859900"
};

const CITRUS_ZEST_VARS = {
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
    "--checklist-done-color": "#757575"
};

const CYBERPUNK_SUNSET_VARS = {
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
    "--text-selection": "rgba(187, 154, 247, 0.3)",
    "--text-highlight-bg": "rgba(255, 121, 198, 0.3)",
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
    "--checklist-done-color": "#9ece6a"
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
    activeProfile: "Default",
    profiles: {
        "Default": { vars: flattenVars(OBSIDIAN_COLOR_VARS) },
        "OLED Matrix": { vars: OLED_MATRIX_VARS },
        "Solarized Nebula": { vars: SOLARIZED_NEBULA_VARS },
        "CyberPunk": { vars: CYBERPUNK_SUNSET_VARS },
        "Citrus Zest": { vars: CITRUS_ZEST_VARS },
    }
};

class ColorMaster extends Plugin {

    async onload() {
        await this.loadSettings();
        T = this;
        this.addSettingTab(new ColorMasterSettingTab(this.app, this));
    
        this.app.workspace.onLayoutReady(() => {
            this.applyStyles();
        });

        console.log("Color Master v1.0.1 loaded.");
    }

    onunload() {
        this.clearStyles();
        console.log("Color Master v1.0.1 unloaded.");
    }

forceIconizeColors() {
    const iconizeColor = this.settings.overrideIconizeColors 
        ? this.settings.profiles[this.settings.activeProfile]?.vars['--iconize-icon-color']
        : null;

    document.querySelectorAll('.iconize-icon').forEach(iconNode => {
        const svg = iconNode.querySelector('svg');
        if (!svg) return;

        [svg, ...svg.querySelectorAll('*')].forEach(el => {
            if (typeof el.hasAttribute !== 'function') return;

            if (!iconizeColor) {
                el.style.fill = '';
                el.style.stroke = '';
                return;
            }
            
            const originalFill = el.getAttribute('fill');
            const originalStroke = el.getAttribute('stroke');

            if (originalFill && originalFill !== 'none' && !originalFill.startsWith('url(')) {
                el.style.setProperty('fill', iconizeColor, 'important');
            }
            
            if (originalStroke && originalStroke !== 'none') {
                el.style.setProperty('stroke', iconizeColor, 'important');
            }
        });
    });
}
    
applyStyles() {
    this.clearStyles(); 
    if (!this.settings.pluginEnabled) {
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

    const activeProfileName = this.settings.activeProfile.toLowerCase();
    const forceDarkProfiles = ["oled matrix", "cyberpunk sunset", "solarized nebula", "default"]; 

    if (activeProfileName === "citrus zest") {
        document.body.classList.remove("theme-dark");
        document.body.classList.add("theme-light");
    } 
    else if (forceDarkProfiles.includes(activeProfileName)) {
        document.body.classList.remove("theme-light");
        document.body.classList.add("theme-dark");
    }
}


clearStyles() {
    const allVars = new Set();
    const activeProfile = this.settings.profiles[this.settings.activeProfile];
    if (activeProfile && activeProfile.vars) {
        Object.keys(activeProfile.vars).forEach(key => allVars.add(key));
    }
    Object.keys(flattenVars(OBSIDIAN_COLOR_VARS)).forEach(key => allVars.add(key));

    allVars.forEach(key => {
        document.body.style.removeProperty(key);
    });

    document.querySelectorAll('.iconize-icon').forEach(iconNode => {
        const svg = iconNode.querySelector('svg');
        if (!svg) return;

        [svg, ...svg.querySelectorAll('*')].forEach(el => {
            if (typeof el.hasAttribute !== 'function') return;
            
            el.style.removeProperty('fill');
            el.style.removeProperty('stroke');
        });
    });

    const styleId = 'color-master-overrides';
    const overrideStyleEl = document.getElementById(styleId);
    if (overrideStyleEl) {
        overrideStyleEl.remove();
    }
}

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
        this.applyStyles();
    }
}

class ColorMasterSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        const isRTL = this.plugin.settings.language === 'ar'; 
        this.containerEl.toggleClass('is-rtl', isRTL);
        this.containerEl.toggleClass('is-ltr', !isRTL);

        containerEl.createEl('h2', { text: t('PLUGIN_NAME') });

        // --- GENERAL SETTINGS ---
        new Setting(containerEl)
            .setName(t('ENABLE_PLUGIN'))
            .setDesc(t('ENABLE_PLUGIN_DESC'))
            .addToggle(toggle => {
                toggle
                    .setValue(this.plugin.settings.pluginEnabled)
                    .onChange(async (value) => {
                        this.plugin.settings.pluginEnabled = value;
                        await this.plugin.saveSettings();
                        new Notice(value ? t('PLUGIN_ENABLED_NOTICE') : t('PLUGIN_DISABLED_NOTICE'));
                    });
            });

        new Setting(containerEl)
            .setName(t('LANGUAGE'))
            .setDesc(t('LANGUAGE_DESC'))
            .addDropdown(dropdown => {
                dropdown.addOption('en', 'English');
                dropdown.addOption('ar', 'العربية');
                dropdown.setValue(this.plugin.settings.language);
                dropdown.onChange(async (value) => {
                    this.plugin.settings.language = value;
                    await this.plugin.saveSettings();
                    this.display(); 
                });
            });
        
        containerEl.createEl('hr');

        this.drawProfileManager();
        this.drawColorPickers();
    }

    drawProfileManager() {
        const { containerEl } = this;
        containerEl.createEl('h3', { text: t('PROFILE_MANAGER') });
        
        new Setting(containerEl)
            .setName(t('ACTIVE_PROFILE'))
            .setDesc(t('ACTIVE_PROFILE_DESC'))
            .addDropdown(dropdown => {
                for (const profileName in this.plugin.settings.profiles) {
                    dropdown.addOption(profileName, profileName);
                }
                dropdown.setValue(this.plugin.settings.activeProfile);
                dropdown.onChange(async (value) => {
                    this.plugin.settings.activeProfile = value;
                    await this.plugin.saveSettings();
                    this.display(); 
                });
            })
            .addButton(button => {
                button.setButtonText(t('NEW_BUTTON'))
                .onClick(() => {
                    new NewProfileModal(this.app, (newName) => {
                        if (newName && !this.plugin.settings.profiles[newName]) {
                            this.plugin.settings.profiles[newName] = { vars: { ...flattenVars(OBSIDIAN_COLOR_VARS) } };
                            this.plugin.settings.activeProfile = newName;
                            this.plugin.saveSettings();
                            this.display();
                        } else if (newName) {
                            new Notice(t('PROFILE_EXISTS_NOTICE', newName));
                        }
                    }).open();
                });
            })
            .addButton(button => {
                button.setButtonText(t('DELETE_BUTTON'))
                .onClick(() => {
                    if (Object.keys(this.plugin.settings.profiles).length <= 1) {
                        new Notice(t('CANNOT_DELETE_LAST_PROFILE'));
                        return;
                    }
                    
                    const message = t('DELETE_PROFILE_CONFIRMATION', this.plugin.settings.activeProfile);
                    
                    new ConfirmationModal(this.app, t('DELETE_PROFILE_TITLE'), message, () => {
                        delete this.plugin.settings.profiles[this.plugin.settings.activeProfile];
                        this.plugin.settings.activeProfile = Object.keys(this.plugin.settings.profiles)[0];
                        this.plugin.saveSettings();
                        this.display();
                        new Notice(t('PROFILE_DELETED_NOTICE'));
                    }).open();
                });
            })
            .addButton(button => { 
                button.setIcon('lucide-upload')
                .setTooltip(t('EXPORT_BUTTON_TOOLTIP'))
                .onClick(() => {
                    this.exportProfile();
                });
            })
            .addButton(button => { 
                button.setIcon('lucide-download')
                .setTooltip(t('IMPORT_BUTTON_TOOLTIP'))
                .onClick(() => {
                    this.importProfile();
                });
            });
    }

    drawColorPickers() {
        const { containerEl } = this;
        const activeProfileVars = this.plugin.settings.profiles[this.plugin.settings.activeProfile].vars;

        new Setting(containerEl)
            .setName(t('OVERRIDE_ICONIZE'))
            .setDesc(t('OVERRIDE_ICONIZE_DESC'))
            .addToggle(toggle => {
                toggle
                .setValue(this.plugin.settings.overrideIconizeColors)
                .onChange(async (value) => {
                    this.plugin.settings.overrideIconizeColors = value;
                    await this.plugin.saveSettings();
                    });
            });

        for (const [category, vars] of Object.entries(OBSIDIAN_COLOR_VARS)) {
            containerEl.createEl('h3', { text: t(category.toUpperCase().replace(' ', '_')) || category });
            for (const [varName, defaultValue] of Object.entries(vars)) {
                
                const description = this.plugin.settings.language === 'ar' ? (COLOR_DESCRIPTIONS_AR[varName] || '') : (COLOR_DESCRIPTIONS[varName] || '');
                const setting = new Setting(containerEl).setName(varName.replace('--', '').replace(/-/g, ' ')).setDesc(description);             
                const colorPicker = setting.controlEl.createEl('input', { type: 'color' });
                const textInput = setting.controlEl.createEl('input', { type: 'text', cls: 'color-master-text-input' });
                
                const initialValue = activeProfileVars[varName] || defaultValue;
                colorPicker.value = initialValue;
                textInput.value = initialValue;

                colorPicker.addEventListener('input', async (e) => {
                    const newColor = e.target.value;
                    textInput.value = newColor;
                    activeProfileVars[varName] = newColor;
                    await this.plugin.saveSettings();
                });

                textInput.addEventListener('change', async (e) => {
                    const newColor = e.target.value;
                    colorPicker.value = newColor;
                    activeProfileVars[varName] = newColor;
                    await this.plugin.saveSettings();
                });

                setting.addExtraButton(button => {
                     button.setIcon("reset")
                     .setTooltip(t('RESET_BUTTON_TOOLTIP'))
                     .onClick(async () => {
                         activeProfileVars[varName] = defaultValue;
                         await this.plugin.saveSettings();
                         this.display();
                     });
                });
            }
        }
    }

    exportProfile() {
        const activeProfileName = this.plugin.settings.activeProfile;
        const activeProfile = this.plugin.settings.profiles[activeProfileName];
        if (!activeProfile) {
            new Notice("Active profile not found.");
            return;
        }

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeProfile, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${activeProfileName}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        new Notice(`Profile "${activeProfileName}" exported.`);
    }

    importProfile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';

        input.onchange = async (e) => {
            const file = (e.target).files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);
                    
                    const vars = importedData.vars || importedData;

                    if (typeof vars !== 'object' || vars === null) {
                        throw new Error("Invalid JSON structure.");
                    }

                    new NewProfileModal(this.app, (newName) => {
                        if (newName && !this.plugin.settings.profiles[newName]) {
                            this.plugin.settings.profiles[newName] = { vars: vars };
                            this.plugin.settings.activeProfile = newName;
                            this.plugin.saveSettings();
                            this.display(); 
                            new Notice(`Profile "${newName}" imported successfully.`);
                        } else if (newName) {
                            new Notice(t('PROFILE_EXISTS_NOTICE', newName));
                        }
                    }).open();

                } catch (error) {
                    new Notice("Failed to parse profile file. Make sure it's a valid JSON.");
                    console.error("Color Master Import Error:", error);
                }
            };
            reader.readAsText(file);
        };

        input.click();
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
    contentEl.createEl("h3", { text: t('NEW_PROFILE_TITLE') });

    let profileName = "";

    new Setting(contentEl)
      .setName(t('PROFILE_NAME_LABEL'))
      .addText((text) => {
        text.setPlaceholder(t('PROFILE_NAME_PLACEHOLDER'))
            .onChange((value) => {
                profileName = value;
            });
        text.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && profileName.trim() !== '') {
                e.preventDefault();
                this.onSubmit(profileName.trim());
                this.close();
            }
        });
      });
      
    const buttonContainer = contentEl.createDiv({ cls: 'modal-button-container', attr: { 'style': 'justify-content: flex-end;' } });
    
    const cancelButton = buttonContainer.createEl('button', { text: t('CANCEL_BUTTON') });
    cancelButton.addEventListener('click', () => this.close());

    const createButton = buttonContainer.createEl('button', { text: t('CREATE_BUTTON'), cls: 'mod-cta' });
    createButton.addEventListener('click', () => {
        if (profileName.trim() !== '') {
            this.onSubmit(profileName.trim());
            this.close();
        } else {
            new Notice(t('EMPTY_PROFILE_NAME_NOTICE'));
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

    const buttonContainer = contentEl.createDiv({ cls: 'modal-button-container', attr: { 'style': 'justify-content: flex-end;' } });

    const cancelButton = buttonContainer.createEl('button', { text: t('CANCEL_BUTTON') });
    cancelButton.addEventListener('click', () => this.close());

    const confirmButton = buttonContainer.createEl('button', { text: t('DELETE_BUTTON'), cls: 'mod-warning' });
    confirmButton.addEventListener('click', () => {
        this.onConfirm();
        this.close();
    });
  }

  onClose() {
    this.contentEl.empty();
  }
}

module.exports = ColorMaster;
