import { PluginSettings } from "./types";
import { flattenVars } from "./utils";

// A comprehensive list of Obsidian's themeable color variables.

export const COLOR_DESCRIPTIONS = {
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
  "--checklist-done-color":
    "The color of the checkmark and text for a completed to-do item.",
  "--tag-color": "Sets the text color of #tags.",
  "--tag-color-hover": "Sets the text color of #tags when hovering over them.",
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
  "--hr-color": "The color of the horizontal rule line created with `---`.",
  "--blockquote-border-color":
    "The color of the vertical border on the left side of a blockquote.",
  "--blockquote-color": "The text color for content inside of a blockquote.",
  "--blockquote-bg": "Sets the background color of blockquote elements (>).",
  "--code-normal":
    "Sets the text color inside inline code (between backticks).",
  "--code-background": "Sets the background color for inline code blocks.",
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
  "--sidebar-border-color": "The color of the border next to the sidebars.",
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
  "--scrollbar-thumb-bg": "The color of the draggable part of the scrollbar.",
  "--scrollbar-bg": "The color of the scrollbar track (the background).",
  "--divider-color":
    "The color for general UI separator lines, like the borders between settings.",
};

export const COLOR_DESCRIPTIONS_AR = {
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
  "--checklist-done-color": "لون علامة الصح والنص لمهمة منجزة في قائمة المهام.",
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
  "--cm-notice-text-default":
    "يحدد لون النص الافتراضي لكل الإشعارات، ما لم يتم تجاوزه بقاعدة مخصصة.",
  "--cm-notice-bg-default":
    "يحدد لون الخلفية الافتراضي لكل الإشعارات، ما لم يتم تجاوزه بقاعدة مخصصة.",
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
  "--divider-color":
    "لون الخطوط الفاصلة في واجهة المستخدم، مثل الخطوط بين الإعدادات.",
};

// A comprehensive list of Obsidian's themeable color variables in Persian.
export const COLOR_DESCRIPTIONS_FA = {
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
  "--background-modifier-border-hover": "رنگ کادر هنگام بردن ماوس روی یک عنصر.",
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
  "--text-selection": "رنگ پس‌زمینه متنی که با مکان‌نمای خود انتخاب کرده‌اید.",
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
  "--code-normal": "رنگ متن داخل کد درون‌خطی (بین بک‌تیک‌ها) را تنظیم می‌کند.",
  "--code-background":
    "رنگ پس‌زمینه برای بلوک‌های کد درون‌خطی را تنظیم می‌کند.",
  "--text-highlight-bg":
    "رنگ پس‌زمینه برای متن هایلایت‌شده (==مانند این==) را تنظیم می‌کند.",
  // Interactive Elements
  "--interactive-normal": "رنگ پس‌زمینه برای عناصر تعاملی مانند دکمه‌ها.",
  "--interactive-hover": "رنگ پس‌زمینه برای عناصر تعاملی هنگام هاور.",
  "--interactive-accent":
    "رنگ تأکیدی برای عناصر تعاملی مهم (مثلاً، دکمه 'ایجاد').",
  "--interactive-accent-hover": "رنگ تأکیدی برای عناصر تعاملی مهم هنگام هاور.",
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
};

// A comprehensive list of Obsidian's themeable color variables in French.
export const COLOR_DESCRIPTIONS_FR = {
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
  "--tag-color-hover": "Définit la couleur du texte des #tags lors du survol.",
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
  "--blockquote-bg": "Définit la couleur de fond des éléments de citation (>).",
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
  "--interactive-error": "Couleur indiquant une erreur (par exemple, rouge).",
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
  "--graph-node": "La couleur des nœuds circulaires pour les notes existantes.",
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
};

// A dictionary for custom display names of CSS variables in English.
export const COLOR_NAMES = {
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
};

// A dictionary for custom display names of CSS variables in Arabic.
export const COLOR_NAMES_AR = {
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
};

// A dictionary for custom display names of CSS variables in Persian.
export const COLOR_NAMES_FA = {
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
};

// A dictionary for custom display names of CSS variables in French.
export const COLOR_NAMES_FR = {
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
};

export const DEFAULT_VARS = {
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
    "--h1-color": "#e0e0e0",
    "--h2-color": "#d0d0d0",
    "--h3-color": "#c0c0c0",
    "--h4-color": "#b0b0b0",
    "--h5-color": "#a0a0a0",
    "--h6-color": "#909090",
  },
  Markdown: {
    "--hr-color": "#444444",
    "--blockquote-border-color": "#007acc",
    "--blockquote-color": "#d0d0d0",
    "--blockquote-bg": "transparent",
    "--tag-color": "#33bbff",
    "--tag-color-hover": "#33bbff",
    "--tag-bg": "#1e1e1e",
    "--checklist-done-color": "#33bbff",
    "--code-normal": "#e0e0e0",
    "--code-background": "#2d2d2d",
    "--text-highlight-bg": "#2c6887",
  },
  Notices: {
    "--cm-notice-text-default": "#e0e0e0",
    "--cm-notice-bg-default": "#2a2a2a",
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
  },
};

const DEFAULT_PROFILE = {
  vars: flattenVars(DEFAULT_VARS),
  themeType: "dark",
  snippets: [],
};

const OLED_MATRIX_PROFILE = {
  vars: {
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
    "--graph-text": "#ffffff",
    "--graph-node-unresolved": "#00ff00",
    "--graph-node-focused": "#000000",
    "--graph-node-tag": "#000000",
    "--graph-node-attachment": "#54ee20",
    "--blockquote-color": "#54ee20",
    "--tag-color": "#0bd62d",
  },
  themeType: "dark",
  snippets: [
    {
      id: "oled-glow-default-snippet",
      name: "OLED Green Glow Effect",
      css: `/* OLED Green Glow Effect */
/* Adds a subtle green glow to text, perfect for the Matrix feel. */
body {
    --text-glow-oled: 0 0 5px rgba(0, 255, 0, 0.7), 0 0 10px rgba(0, 255, 0, 0.5);
}

.markdown-preview-view, .markdown-source-view {
    text-shadow: var(--text-glow-oled);
}

h1, h2, h3 {
    text-shadow: var(--text-glow-oled);
}`,
      enabled: false,
    },
    {
      id: "oled-active-line-snippet",
      name: "OLED Active Line Highlight",
      css: `/* Highlights the active line with a faint green background */
.cm-active.cm-line {
    background-color: rgba(0, 255, 0, 0.1) !important;
}`,
      enabled: true,
    },
  ],
};

const CITRUS_ZEST_PROFILE = {
  vars: {
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
  },
  themeType: "light",
  snippets: [],
};

const SOLARIZED_NEBULA_PROFILE = {
  vars: {
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
  },
  themeType: "dark",
  snippets: [],
};

const CYBERPUNK_SUNSET_PROFILE = {
  vars: {
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
  },
  themeType: "dark",
  snippets: [],
};

export const BUILT_IN_PROFILES_VARS = {
  Default: DEFAULT_PROFILE.vars,
  "OLED Matrix": OLED_MATRIX_PROFILE.vars,
  "Citrus Zest": CITRUS_ZEST_PROFILE.vars,
  "Solarized Nebula": SOLARIZED_NEBULA_PROFILE.vars,
  CyberPunk: CYBERPUNK_SUNSET_PROFILE.vars,
};

export const BUILT_IN_PROFILES_DATA = {
  Default: DEFAULT_PROFILE,
  "OLED Matrix": OLED_MATRIX_PROFILE,
  "Citrus Zest": CITRUS_ZEST_PROFILE,
  "Solarized Nebula": SOLARIZED_NEBULA_PROFILE,
  CyberPunk: CYBERPUNK_SUNSET_PROFILE,
};

export const DEFAULT_SETTINGS: PluginSettings = {
  pluginEnabled: true,
  language: "auto",
  useRtlLayout: true,
  overrideIconizeColors: true,
  cleanupInterval: 5,
  colorUpdateFPS: 10,
  activeProfile: "Default",
  profiles: JSON.parse(JSON.stringify(BUILT_IN_PROFILES_DATA)),
  globalSnippets: [],
  pinnedSnapshots: {},
};

// Maps text color variables to their common backgrounds for contrast checking.
export const TEXT_TO_BG_MAP = {
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
  "--blockquote-color": "--background-primary",
  "--text-on-accent": "--interactive-accent",
  "--vault-name-color": "--sidebar-background",
  "--titlebar-text-color": "--titlebar-background",
  "--graph-text": "--graph-node",
  "--checklist-done-color": "--background-primary",
  "--text-highlight-bg": "--text-normal",
  "--tag-color": "--tag-bg",
  // "--iconize-icon-color": "--background-secondary",
  // "--cm-notice-text-default": "--cm-notice-bg-default",
};
