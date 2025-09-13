# Color Master for Obsidian

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![GitHub release (latest by date)](https://img.shields.io/github/v/release/YazanAmmar/obsidian-color-master?color=blue&label=version)](https://github.com/YazanAmmar/obsidian-color-master/releases)

Take full control of your Obsidian theme with **Color Master**. This plugin provides a comprehensive user interface to edit every core CSS color variable in Obsidian. Create, save, and share your own color schemes with a powerful profile manager, or even paste raw CSS to instantly use any theme you want—all without writing a single line of code.

<img width="2560" height="640" alt="Color Master Screenshot" src="Images/color-master-logo.png" />

---

## ✨ Features

Color Master is packed with features designed for both beginners and power-users, giving you ultimate control over your workspace's appearance.

#### 🏛️ Foundational Features
* **Live Color Editor**: An intuitive UI with color pickers and text inputs to see your changes instantly.
* **Full Profile Management**: Create, delete, and switch between multiple color profiles. Each profile can have its own colors, snippets, and theme settings.
* **Bilingual Interface**: Full support for both English and Arabic (العربية), with automatic Right-to-Left (RTL) mode.
* **Beautiful Default Themes**: Comes with five stunning, ready-to-use profiles to get you started.

#### 🚀 Power-User Tools
* **NEW - Per-Profile CSS Snippets!**: The "Paste CSS" feature has evolved! Snippets are **no longer global** and are now saved directly to the active profile. This means your small CSS tweaks are perfectly organized and are **exported automatically** with your theme.
* **NEW - Powerful Import/Export**:
    * **Create New Profile from JSON**: Easily import a `.json` file to create a brand new profile instantly, without needing to create an empty one first.
    * **Complete Profile Sync**: The "Replace" function now updates *everything* from the imported file—colors, snippets, and the Dark/Light mode theme setting.
* **NEW - One-Click Restore**: A new **Restore (`history`) button** appears next to the default profiles. If you've modified a built-in theme, you can instantly revert it back to its original state, including any future default snippets.
* **Reliable Profile Snapshots**: Safely experiment with your colors! The **Pin** button now saves a complete snapshot of your profile (colors, CSS, and snippets). When you rename a profile, its snapshot is intelligently renamed with it.
* **Multi-Step Color Undo**: The "Undo" button (`reset` icon) remembers the last 5 changes you made to each color.
* **Profile-Specific Themes**: Force Obsidian into **Dark Mode** or **Light Mode** automatically when you activate a specific profile.

####  workflow & UI
* **Full CSS Editing**: Create and **edit** your CSS-based profiles and snippets at any time.
* **Smart Search UI**: A powerful search bar to filter colors and snippets, with toggles for case-sensitivity and Regular Expressions.
* **NEW - Eraser Tool**: A handy **Eraser (`eraser`) button** has been added to every color picker to instantly set any color to `transparent`.
* **Workflow Hotkeys**: Assign hotkeys to toggle the plugin on/off or instantly cycle to your next profile.
* **Performance Control (FPS Slider)**: Adjust the live preview frame rate to ensure a smooth experience.
* **Plugin Integrations**: Full color control for the **Iconize** plugin, with an automated cleanup system.

---

## Included Profiles

The plugin comes with these hand-crafted profiles by default:

1.  **OLED Matrix**: A true-black, high-contrast theme with vibrant green accents.
2.  **Citrus Zest**: A brilliant light theme with a clean design and stunning orange highlights.
3.  **Solarized Nebula**: A calm, low-contrast theme based on the popular "Solarized" palette.
4.  **Cyberpunk Sunset**: A stylish dark theme with neon purple and pink highlights.
5.  **Default**: The standard Obsidian dark theme variables.

---

## Theme Previews

### 1. OLED Matrix
<img alt="OLED Matrix Preview" src="Images/oled-matrix.png" />

### 2. Citrus Zest
<img alt="Citrus Zest Preview" src="Images/citruz-zest.png" />

### 3. Solarized Nebula
<img alt="Solarized Nebula Preview" src="Images/solarized-nebula.png" />

### 4. Cyberpunk Sunset
<img alt="Cyberpunk Sunset Preview" src="Images/cyber-punk.png" />

### 5. Default
<img alt="Default Preview" src="Images/default.png" />

---

## Color Variable Reference

For advanced users who want to know exactly what they're changing, here is a complete list of the CSS variables controlled by this plugin and their descriptions.

<details>
<summary><strong>🎨 Click to expand the full list of variables</strong></summary>

| Variable | Description |
|---|---|
| **Plugin Integrations** | |
| `--iconize-icon-color` | Sets the color for all icons added by the Iconize plugin, overriding its native color settings for a unified look.<br><br>This entire feature is controlled by the **"Override Iconize Plugin Colors"** toggle in the settings. This override is completely non-destructive:<br>- When turned **ON**, Color Master applies this custom color to the icons.<br>- When turned **OFF**, Color Master stops managing the colors, and your original settings from the Iconize plugin are instantly restored without any permanent changes to your configuration. |
| **Backgrounds** | |
| `--background-primary` | Main background color for the entire app, especially for editor and note panes. |
| `--background-primary-alt` | An alternate background color, often used for the active line in the editor. |
| `--background-secondary` | Secondary background, typically used for sidebars and other UI panels. |
| `--background-secondary-alt`| An alternate secondary background, used for the file explorer's active file. |
| `--background-modifier-border`| The color of borders on various UI elements like buttons and inputs. |
| `--background-modifier-border-hover`| The border color when you hover over an element. |
| `--background-modifier-border-focus`| The border color for a focused element, like a selected text field. |
| `--background-modifier-flair`| Background color for special UI elements, like the 'Syncing' or 'Indexing' status. |
| `--background-modifier-hover` | The background color of elements when you hover over them (e.g., list items). |
| `--background-modifier-active`| The background color of an element when it's actively being clicked or is selected. |
| **Text** | |
| `--text-normal` | The default text color for all notes and most of the UI. |
| `--text-muted` | A slightly faded text color, used for less important information like file metadata. |
| `--text-faint` | The most faded text color, for very subtle UI text or disabled elements. |
| `--text-on-accent` | Text color that appears on top of accented backgrounds (like on a primary button). |
| `--text-accent` | The primary accent color for text, used for links and highlighted UI elements. |
| `--text-accent-hover` | The color of accent text (like links) when you hover over it. |
| `--text-selection` | The background color of text that you have selected with your cursor. |
| `--text-highlight-bg` | The background color for text highlighted with `==highlight==` syntax. |
| `--tag-color` | Sets the text color of #tags. |
| `--tag-color-hover` | Sets the text color of #tags when hovering over them. |
| `--tag-bg` | Sets the background color of #tags, allowing for a 'pill' shape. |
| **Headings** | |
| `-h1-color` | The color of H1 heading text. |
| `-h2-color` | The color of H2 heading text. |
| `-h3-color` | The color of H3 heading text. |
| `-h4-color` | The color of H4 heading text. |
| `-h5-color` | The color of H5 heading text. |
| `-h6-color` | The color of H6 heading text. |
| **Interactive Elements** | |
| `--interactive-normal` | The background color for interactive elements like buttons. |
| `--interactive-hover` | The background color for interactive elements when hovered. |
| `--interactive-accent` | The accent color for important interactive elements (e.g., the 'Create' button). |
| `--interactive-accent-hover`| The accent color for important interactive elements when hovered. |
| `--interactive-success` | Color indicating a successful operation (e.g., green). |
| `--interactive-error` | Color indicating an error (e.g., red). |
| `--interactive-warning` | Color indicating a warning (e.g., yellow). |
| **UI Elements** | |
| `--titlebar-background` | The background color of the main window's title bar. |
| `--titlebar-background-focused`| The title bar background color when the window is active. |
| `--titlebar-text-color` | The text color in the title bar. |
| `--sidebar-background` | Specifically targets the background of the sidebars. |
| `--sidebar-border-color` | The color of the border next to the sidebars. |
| `--header-background` | The background for headers within panes (e.g., note title header). |
| `--header-border-color` | The border color below pane headers. |
| `--vault-name-color` | The color of your vault's name in the top-left corner. |
| **Graph View** | |
| `--graph-line` | The color of the connection lines between notes in the Graph View. |
| `--graph-node` | The color of the circular nodes for existing notes. |
| `--graph-text` | The color of the text labels on the graph nodes. |
| `--graph-node-unresolved` | The color of nodes for notes that do not exist yet (unresolved links). |
| `--graph-node-focused` | Color of the node that is focused or hovered (highlighted node). |
| `--graph-node-tag`| Color of nodes representing tags when tags are shown in the graph. |
| `--graph-node-attachment` | Color of nodes representing attachments (e.g., image or other linked files). |
| **Misc** | |
| `--scrollbar-thumb-bg` | The color of the draggable part of the scrollbar. |
| `--scrollbar-bg` | The color of the scrollbar track (the background). |
| `--divider-color` | The color of horizontal lines (`---`) and other dividers in the UI. |
| `--checklist-done-color` | The color of the checkmark and text for a completed to-do item. |

</details>

---

## Installation

1.  Download the latest release from the [GitHub Releases page](https://github.com/yazanammar/obsidian-color-master/releases).
2.  Extract the `color-master` folder into your vault's plugins folder: `<YourVault>/.obsidian/plugins/`.
3.  In Obsidian, go to `Settings` -> `Community plugins`.
4.  Enable the "Color Master" plugin.
5.  Open the plugin settings to start customizing!
