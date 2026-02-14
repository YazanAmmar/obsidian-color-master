# Changelog

## [v2.0.0](https://github.com/YazanAmmar/obsidian-theme-engine/releases/tag/2.0.0) - 2026-02-14 (The Theme Engine Rebrand)

This release completes the structural transition from **Color Master** to **Theme Engine** and prepares the project for long-term maintainability.

### Theme Engine Rebrand & Migration

- **Plugin Identity Updated:** Manifest ID is now `theme-engine` with the new public name **Theme Engine**.
- **Backward-Compatible Migration:** Added first-run migration for users coming from legacy IDs (`obsidian-theme-engine`, `color-master`, `obsidian-color-master`).
- **Data Continuity:** Existing `data.json`, command hotkeys namespace, and enabled-plugin entries are migrated safely to the new identity.
- **Non-Destructive Migration Design:** No manual steps required.
- **Compatibility Safeguards:** Legacy identifiers are intentionally kept only where required for migration and compatibility paths.

### UX, Settings, and UI Improvements

- Added empty-results search badge and hides the Like card when no results match.
- Polished CSS snippets behavior and removed reorder flicker.
- Grouped related settings using native `SettingGroup` with a safe fallback path.
- Improved search behavior alignment and cleaned up profile manager layout.
- Applied multiple visual and spacing improvements, including better light-mode action-button visibility.
- Redesigned the Like Plugin card to better match Obsidian settings aesthetics.

### Architecture, Types, and Code Quality

- Refactored UI modals into a modular directory architecture.
- Migrated styles into a modular SCSS architecture.
- Strengthened typings for settings and removed unsafe/unknown cast patterns.
- Fixed typing issues and prevented pinned profile variable reset regressions.
- Aligned ESLint configuration with Obsidian bot validation expectations.
- Resolved all lint warnings/errors and normalized formatting with Prettier.

### Maintenance and Project Hygiene

- Updated dependencies and manifest handling.
- Stopped tracking generated build artifacts (`main.js`, `styles.css`).
- Removed unused empty-state file.
- Updated external project links (repo, issues, wiki/related references).

## [v1.2.0](https://github.com/YazanAmmar/obsidian-theme-engine/releases/tag/1.2.0) - 2025-11-29 (The Theme Engine Update)

This update represents a fundamental shift in how Theme Engine interacts with Obsidian. We've rewritten the core color engine, overhauled the translation system, and introduced a suite of "smart" UI behaviors that make customizing your vault feel more natural and responsive than ever.

### The New Theme Engine

Theme Engine is no longer just a list of colors; it's now a smart layer on top of your Obsidian theme.

- **Dynamic Theme Capture:** When you create a new profile or use the "Default" profile, the plugin now **captures the actual CSS values** of your currently active Obsidian theme (e.g., Minimal, Things, ITS). No more hardcoded static colors that clash with your theme.
- **Smart "Default" Profile:** The default profile is now a clean slate. It acts as a transparent pass-through layer, adopting your current theme's colors automatically. This eliminates conflicts when switching between different community themes while Theme Engine is active.
- **Intelligent UI Feedback (Dim/Bright):**
  - **Pristine State:** Settings that match the default theme value are now **dimmed** (`opacity: 0.6`), letting you focus on what matters.
  - **Modified State:** As soon as you change a color, its row **lights up** (`opacity: 1`), clearly highlighting your customizations.
  - **Smart Delete:** Clearing a color value (making it empty) removes the variable from the profile entirely and restores the row to its dimmed state.
  - **Smart Undo:** The undo button now respects this state, dimming the row if you revert to the original value.

### Complete i18n Overhaul (Translation System)

We've rebuilt the translation architecture from the ground up to be robust, type-safe, and extensible.

- **Custom Languages Support:** You are no longer limited to the built-in languages. You can add **any language** (e.g., Bulgarian, Chinese, Spanish) directly from the settings.
- **Tree-View Translation Editor:** A powerful new modal allows you to browse and edit translations in a nested tree structure.
  - **Deep Search:** Search by key, English text, or translated value.
  - **Highlighting:** Search terms are highlighted in real-time.
  - **RTL Support:** Custom languages can explicitly set Right-to-Left directionality.
- **Smart Fallback Engine:** The plugin now gracefully falls back to English for any missing keys, preventing UI crashes or empty labels in incomplete translations.
- **Management Tools:** Import, Export, Copy, and Paste translations as JSON. Added specific "Delete" and "Restore" actions for managing custom and core language overrides.

### Performance & Graph View

- **Optimized Render Loop:** We've separated lightweight CSS updates from heavy DOM operations (like repainting icons). Dragging color pickers is now significantly smoother.
- **Instant Graph Refresh:** The Graph View coloring logic has been simplified and optimized. Changes are applied instantly without the need for "Apply" buttons or reloading tabs.
- **Unified HEX Converter:** All captured colors (RGB, HSL) are automatically converted to standard HEX/HEXA format for consistent editing.

### Advanced Notice Styling

The `processNotice` system has been upgraded for precision styling.

- **Keyword Highlighting:** Added a new "Highlight Only" mode. This uses a `TreeWalker` to surgically wrap specific keywords in `<span>` tags within notices, applying color **only** to the word without affecting the rest of the message.
- **Priority Rules:** Full-message coloring rules are applied first, followed by specific keyword highlights using `!important` to ensure visibility.

### Quality of Life Improvements

- **Hexa Transparency Support:** Fixed an issue where 8-digit Hex codes (colors with alpha transparency) rendered incorrectly in the color picker.
- **Refined "Pin" Behavior:** Pinning a snapshot now treats the current state as the "baseline," dimming unmodified rows to allow for a fresh round of iteration.
- **Selective Data Reset:** The "Reset Plugin" feature is now granular. You can choose to delete only specific categories of data (Profiles, Snippets, Backgrounds, Settings, or Languages).
- **Custom Variable Polish:** The "Add Custom Variable" modal now initializes with an empty value instead of white, encouraging cleaner overrides.
- **Snippet Locking:** Added a "Lock" button to the CSS Snippets section to prevent accidental reordering.

### Housekeeping

- **Removed Legacy Profiles:** The "Cyberpunk" and "Solarized Nebula" profiles have been retired to focus on the new dynamic engine.
- **SCSS Migration:** The project's styling has been fully migrated to SCSS for better maintainability.
- **ESLint Implementation:** The codebase now adheres to strict linting rules tailored for Obsidian plugin development, ensuring cleaner and safer code.

## [v1.1.1](https://github.com/YazanAmmar/obsidian-theme-engine/releases/tag/1.1.1) - 2025-11-01

This update introduces the plugin's most-requested feature: **Video Backgrounds**. You can now fully customize your workspace with looped videos, alongside a host of performance improvements and smart new settings.

### New Feature: Video Backgrounds

Bring your workspace to life by setting looped videos as your background, in addition to static images.

- **Video Background Support:** The plugin now fully supports `.mp4` and `.webm` video files as backgrounds.
- **Redesigned Settings Modal:** The "Background Settings" (⚙️) modal has been completely redesigned with a new "Setting Type" toggle.
- **Dedicated Media Settings:**
  - **Image Tab:** Now contains image-specific settings, including the new **"Convert to JPG"** feature.
  - **Video Tab:** Contains new video-specific settings:
    - **Video Opacity:** A slider to control the video's transparency for better readability.
    - **Mute Video:** A toggle to mute the video (enabled by default).
- **Interactive Previews:** Video previews in the "Browse Backgrounds" modal are now interactive. You can click to play/pause them.
- **Active Background Highlight:** The currently active background (image or video) is now highlighted with a border and shadow in the "Browse Backgrounds" modal for easy identification.

### Improvements & UX Enhancements

- **New: Convert to JPG (Performance):** A new option in the "Image" settings tab allows you to automatically convert PNG, WEBP, or BMP images to JPG on upload. This significantly reduces file size and improves performance. (GIFs are automatically skipped to preserve animation).
- **New: Remember Settings State:** The plugin now remembers your last search query and scroll position in the settings tab. When you reopen the settings, it auto-filters and scrolls down to your last position. (This state is cleared when the plugin unloads).
- **Smart Plugin Integration (Iconize):**
  - Added a "Not Installed" badge next to the "Iconize" color setting if the plugin is missing or disabled.
  - The "Override Iconize Colors" toggle will now automatically disable itself if the Iconize plugin is uninstalled.
- **Smarter Plugin Reset:** When using the "Reset All Data" function, the plugin will now preserve your installation date ("Days of Use"), language preference, and RTL/LTR layout settings.
- **Unified Media System:** The entire background system has been refactored (`backgroundPath`, `backgroundType`) to intelligently handle both images and videos. All related functions have been updated for cleaner, more maintainable code.
- **Translation Updates:** All relevant UI text (buttons, descriptions, modals) has been updated from "Image" to "Background" or "Image/Video" across all supported languages.

### Smart Custom Variables

The "Add Custom Variable" feature has been completely rebuilt from the ground up to be smarter, more powerful, and easier to use.

- **Support for Multiple Data Types:** You can now create variables that are not just colors. The modal fully supports 'Color', 'Size (px/em)', 'Text', and 'Number' types.
- **Context-Aware Controls:**
  - The "Add" modal provides the correct input for each type (e.g., a number input + unit dropdown for 'Size').
  - The main settings page now renders the correct control for each custom variable (e.g., a size input for `--my-font-size` instead of a color picker).
- **Duplicate Variable Prevention:** The modal now intelligently checks against all default and existing custom variables to prevent you from creating a duplicate (e.g., `--h1-color`).
- **Improved Search & Highlighting:** Custom variables are now fully searchable by their name _and_ their description. Search term highlighting also works correctly on both the name and description.

## [v1.1.0](https://github.com/YazanAmmar/obsidian-theme-engine/releases/tag/1.1.0) - 2025-10-25

This update introduces the most requested feature: **Custom Background Images**. You now have full control over your workspace's appearance with custom background images, which can be assigned uniquely to each profile.

### New Feature: Custom Backgrounds

- **Add & Manage Images:** A new "Set Custom Background" option has been added to the Advanced Settings card.
- **Multiple Input Methods:** Add images easily via file upload, pasting a URL, pasting a copied image, or dragging & dropping directly into the "Add New" modal.
- **Global Storage & Access:** All background images are now stored centrally in the **global backgrounds folder** (`.obsidian/backgrounds`).
- **Image Browser:** A new "Browse" (📦) icon opens a modal gallery displaying all images saved to the backgrounds folder.
- **Full Control:** From the browser, you can select an image, delete it (with confirmation), or rename it directly in the UI. The file extension is locked during rename to prevent errors.
- **Enable/Disable Toggle:** A new settings icon (⚙️) opens a modal where you can quickly enable or disable the background image for the current profile without removing it.

### Improvements & UX Enhancements

- **Smart Transparency:** When a background is applied, key UI variables (like `--background-primary`) are automatically set to `transparent`. Disabling or removing the background intelligently restores these variables to their default theme values.

### Fixes & Code Quality

- **Fixed: Plugin Reset Bug:** Resolved an `EBUSY` error that could occur when resetting the plugin. The process now reliably shows the "Reload" notice _before_ attempting to delete the (potentially locked) backgrounds folder.
- **Cleanup:** Removed the default "OLED Green Glow" and "OLED Active Line Highlight" snippets from the "OLED Matrix" profile for a cleaner start.

## [v1.0.9](https://github.com/YazanAmmar/obsidian-theme-engine/releases/tag/1.0.9) - 2025-10-17

This is a massive quality-of-life update focused on professional workflows, UI polish, and deep integration with your Obsidian environment. We've introduced direct importing from your installed themes, a smarter UI that warns you about conflicts, and a host of powerful new features and commands to streamline your customization process.

### New Features

- **Import from Installed Themes & Snippets**: You can now directly import CSS from your installed community themes and local snippets to create new, editable CSS-based profiles. This is a powerful way to start customizing your favorite themes without needing to find the source code manually.
- **Quick Theme Toggle for Profiles**: A new icon button (`sun`/`moon`/`sun-moon`) has been added to the Profile Manager. It allows you to instantly cycle the active profile's theme setting between "Force Light," "Force Dark," and "Auto (follows Obsidian)" without needing to create a new profile.
- **New Command: Cycle Profile Theme**: A new command, `Theme Engine: Cycle active profile theme`, has been added. You can assign a hotkey to it for rapid switching between light, dark, and auto modes, with a confirmation notice for each change.
- **Reset Plugin Settings**: A powerful and safe "Reset Plugin Settings" option has been added to the Advanced Settings. It allows you to completely reset the plugin to its factory state by deleting the `data.json` file, which is useful for troubleshooting or starting fresh.

### Improvements & UX Enhancements

- **Theme Interference Warning**: The plugin is now smarter! A warning icon (⚠️) will appear next to your active profile if you have a community theme enabled. The tooltip explains that the external theme might interfere with your profile's appearance and recommends switching to the default theme for best results.
- **Redesigned "Advanced Settings" Section**: The old "Options" section has been completely redesigned into a modern, card-based layout and renamed to "Advanced Settings" for better clarity and aesthetics.
- **Streamlined JSON Import**: The "Import / Paste JSON" modal now includes a "Profile Name" input field, which is automatically filled from the imported file's name. This improves the workflow and removes the need for the previous duplicate-name warning modal.
- **Complete Search Bar Overhaul**: The search bar has been significantly improved with a cleaner design, more efficient filtering logic, and better handling of different states, building upon all the iterative improvements from previous versions.
- **On-Demand Snapshots for Built-in Profiles**: To give users a cleaner start, built-in profiles (like "OLED Matrix") no longer come with a pre-made snapshot. You now have full control to create the first snapshot yourself, while the "Restore to original" functionality remains available.

### Bug Fixes & Code Quality

- **Fixed: Multi-Word Tag Styling**: Fixed a long-standing rendering bug where tags containing underscores (e.g., `#tag_with_words`) were incorrectly highlighted instead of being styled as a single, continuous tag pill in Live Preview.
- **Major Refactoring & Security Hardening**:
  - Removed all instances of inline `.style` from the TypeScript code, allowing all UI elements to be themed more easily via external CSS.
  - Replaced all uses of `.innerHTML` with safer DOM manipulation methods (`createEl`, `setText`) to eliminate the risk of XSS vulnerabilities.
  - Cleaned up all command names by removing the "Theme Engine" prefix, as Obsidian adds this automatically, resulting in a cleaner command palette.
- And many other minor performance enhancements and bug fixes.

## [v1.0.8](https://github.com/YazanAmmar/obsidian-theme-engine/releases/tag/1.0.8) - 2025-09-22

This version introduces powerful new features like **Global CSS Snippets** and a suite of workflow enhancements, including new hotkeys and a complete UI redesign for a more intuitive and polished user experience.

### New Features

- **Global CSS Snippets:**
  - A major new feature that allows you to create **Global Snippets**. These are special CSS snippets that remain active across **all** of your profiles.
  - **Use Case:** Perfect for applying universal styles—like a custom font, a small UI tweak, or hiding an element—that you want to persist regardless of which color theme is active.
  - **Implementation:** A "Save as Global Snippet" toggle has been added to the snippet creation modal. Global snippets are clearly distinguished in the UI with a "Global" badge and are listed separately above profile-specific snippets.
- **New Hotkeys for Faster Workflow:**
  - **Cycle Previous Profile**: A new command, Theme Engine: Cycle to previous profile, has been added. You can now assign a hotkey to navigate backward through your profile list, complementing the existing command for cycling forward.
  - **Open Settings Hotkey:** A new command, `Theme Engine: Open settings tab`, lets you assign a hotkey to instantly jump to the plugin's settings panel.
- **Quick Access Ribbon Icon:**
  - A paint bucket icon has been added to the app ribbon, providing one-click access to the Theme Engine settings from anywhere in your workspace.
- **Flexible RTL Layout Option:**
  - A new settings modal, accessible via a gear icon next to the language dropdown, now appears for users of RTL languages (Arabic, Persian).
  - This contains a toggle to **Enable Right-to-Left (RTL) Layout**, giving users the freedom to disable the flipped interface if they prefer the standard LTR layout even while using an RTL language.

## [v1.0.7](https://github.com/YazanAmmar/obsidian-theme-engine/releases/tag/1.0.7) - 2025-09-19 (TypeScript)

### Major Milestone: The TypeScript Rewrite

The entire Theme Engine codebase has been successfully migrated from JavaScript to **TypeScript**! This is a massive step forward for the project's health, stability, and future development.

- **Enhanced Stability:** TypeScript's static typing catches common errors during development, significantly reducing the chance of bugs making it into a release.
- **Easier Maintenance:** A strongly-typed codebase is easier to read, refactor, and build upon.
- **Faster Future Development:** This migration paves the way for adding more complex features with greater confidence and speed.

> **A personal note from the developer:** I sincerely apologize for the delay in this migration (spanning several versions). As I was learning TypeScript from scratch with limited time, I wanted to ensure the transition was done right. Thank you for your patience! The foundation is now rock-solid for the future.

### New Features

- **Drag & Drop to Reorder CSS Snippets**
  - You can now drag and drop snippets in the list to control their execution order. This gives you precise control over the CSS cascade; rules in snippets lower in the list will override those above them in case of a conflict.
  - _Example:_ If Snippet A makes `h1` blue and Snippet B makes `h1` red, placing Snippet B _after_ Snippet A will result in a red `h1`.

- **Add Custom CSS Variables**
  - A new feature that allows you to add any CSS variable from Obsidian's official documentation directly into the plugin.
  - Your custom variables are saved with your profile and are included when you export or share it.

- **Session-Persistent Undo/Redo for Editors**
  - The CSS editor for snippets and profiles now remembers your changes for the entire Obsidian session.
  - You can now close the editor modal, test your changes, and re-open it to continue using **Ctrl+Z** (Undo) and **Ctrl+Y** (Redo) without losing your history. The history is cleared when Obsidian is closed.

- **New Languages**
  - Added full UI translations for **French** and **Persian**.

### Improvements & Fixes

- **RTL/LTR:** Vastly improved Right-to-Left (RTL) language support. Fixed major UI layout issues that occurred when using an LTR plugin language (like English) inside an RTL Obsidian interface (like Arabic), and vice-versa.
- **Notice Rules:**
  - Rules are now **case-insensitive**. A keyword like "Success" will now match "success" and "SUCCESS".
  - Fixed a critical bug where notice rules failed to match non-Latin keywords (e.g., Arabic, Persian) due to incorrect Regex logic.
- **Custom Variables:** Custom variables are now correctly included in the statistics card count.
- **UI:** The "Create New Snippet" button is now always visible at the top of the snippets list for quicker access.
- **And many other minor bug fixes and performance enhancements.**

## [v1.0.6](https://github.com/YazanAmmar/obsidian-theme-engine/releases/tag/1.0.6) - 2025-09-13 (The Thematic Intelligence Update)

This update focuses on two core principles: **intelligence and elegance**. We're introducing the revolutionary Advanced Notice Coloring system, adding a new layer of interactive intelligence to your workspace. This comes alongside a comprehensive UI overhaul and precise enhancements to every corner of the plugin, making your experience smoother and more professional than ever.

### New Features & Major Improvements

- **Introducing Advanced Notice Coloring!**
- For the first time, you can now control the background and text color of notices based on their content. Create prioritized rules using keywords or Regex to make your workspace more dynamic and informative.
- The user interface for creating rules has been redesigned with an intuitive tag-based input for keywords, smart duplicate detection, and smooth animations for adding/deleting rules.
- Includes a new “Test Rule” button (🔔) to instantly preview how a notice will look.

- **Full Right-to-Left (RTL) Language Support:**
- The plugin now has foundational support for RTL languages, starting with a complete **Arabic** translation.
- All UI components, including new mods and controls, have been re-engineered to display perfectly in both LTR and RTL layouts. This centralized architecture makes adding new languages ​​in the future incredibly simple.

- **Expanded Markdown Color Control:**
- Added several new color variables for finer control over your notes' appearance, including:
- `--blockquote-bg`: A brand new variable to control the background color of blockquotes.
- `--hr-color`: For horizontal styling rules.
- `--code-normal` & `--code-background`: For inline code blocks.
- `--text-highlight-bg`: For highlighted text.

### UI/UX Enhancements & Polish

- **Massive Search & Filtering Overhaul:**
- **Deeper Search:** The search function is now more powerful and searches within variable **descriptions**, not just their names.
- **Animated Highlighting:** Search terms are now highlighted with a beautiful, animated wave gradient wherever they appear, making results easy to spot.
- The search bar has been enhanced with a new search icon for a cleaner look.

- **Smarter & Safer Profile Importing:**
- Importing a profile with a name that already exists will now open a new dialog prompting you for a different name, preventing you from accidentally overwriting your work.

- **Polished & Redesigned Modals:**
- The "Advanced Notice Rules" and "Duplicate Profile Name" modals have been completely redesigned with a modern, clean, and more intuitive interface.

### Behind the Scenes

- **Architectural Upgrade: Profile-Specific Rules:**
- Notice rules are no longer a global setting. They are now an integral part of each profile and are **automatically exported and imported** with them.

- **Professional Development Workflow:**
- The project has now officially integrated the `SortableJS` library for smooth drag-and-drop functionality and has adopted a professional `npm run build` workflow, enhancing stability and maintainability.

> and many other important fixes, performance and interface improvements!

## [v1.0.5](https://github.com/YazanAmmar/obsidian-theme-engine/releases/tag/1.0.5) - 2025-09-08 (The Snippet & Polish Update)

### New Features & Major Improvements

- **Introducing CSS Snippets!**
  - The "Paste CSS" feature has been completely upgraded and now allows you to save code as either a full **Profile** or a lightweight **Snippet**.
  - **Why is this a game-changer?** Now you can save small, reusable CSS tweaks (like coloring a specific header or styling checkboxes) without creating an entire profile. This keeps your setup clean, organized, and powerful. You can toggle snippets on and off, edit them, and even copy their code with a new dedicated button.

- **Full Editing for CSS Profiles:**
  - You can now edit your existing CSS-based profiles directly. Change the name or update the CSS code at any time without needing to create a new profile from scratch.

- **Restore Built-in Profiles with One Click!**
  - A new **Restore (`history`) button** now appears next to the default profiles (like OLED Matrix). If you've modified a built-in theme and want to go back to its original state, just click this button.
  - **Smart Recovery:** Accidentally deleted a default profile? No problem! Just create a new, empty profile with the _exact same name_ (e.g., "OLED Matrix"), and the restore button will magically reappear, allowing you to bring it back to its factory settings.

- **Complete Tag Styling Control:**
  - Added three new color variables specifically for styling tags, giving you pixel-perfect control over their appearance:
    - `--tag-color`: Sets the main text color of the tag.
    - `--tag-color-hover`: The text color when you hover over the tag.
    - `--tag-bg`: The background color of the tag "pill".

- **Powerful Import Modal:** The JSON import modal is now much more powerful. We've replaced the confusing "Merge" button with a highly-requested **"Create New"** button. You can now import a `.json` file and instantly create a new profile from it.

- **More Accurate Contrast Checker:** The accessibility checker is now more comprehensive and correctly checks the contrast for tags, icons, and interactive elements.

### Bug Fixes & Quality of Life Enhancements

- **Snapshots Now Save Everything!**
  - Fixed a critical issue where taking a Snapshot of a CSS Profile would only save the color variables but not the CSS code. Now, Snapshots correctly save and restore **both** the colors and the associated CSS code, making them completely reliable.

- **Smarter Profile Renaming:**
  - Fixed a bug where renaming a profile would cause its Snapshot to be lost. Now, when you rename a profile, its pinned Snapshot is intelligently renamed with it.
  - Fixed a related bug where updating a CSS profile's name would fail or not save correctly. The process is now seamless.

- **New "Transparent" Tool:**
  - Added a new **Eraser (`eraser`) button** next to each color picker. Clicking it instantly sets the color to `transparent`, which is perfect for removing backgrounds or borders.

- **UI & Wording Improvements:**
  - The "Paste CSS" button has been renamed to **"Paste / Import (CSS)..."** to better reflect its ability to Import and paste `.css` files.
  - Fixed a minor bug where updating a CSS profile with the same name would show two notifications. Now, it correctly shows only "Profile updated."

## [v1.0.4](https://github.com/YazanAmmar/obsidian-theme-engine/releases/tag/1.0.4) - 2025-09-04 (The CSS Freedom Update)

### New Features & Major Improvements

- **New: Paste CSS for Instant Theming!**
  - Introducing a revolutionary way to create color profiles! You can now click the new "Paste CSS" button to paste raw CSS code from any theme or snippet.
  - This creates a special "CSS Profile" that directly applies your pasted code, allowing you to use complex themes without needing to install them separately. It's the ultimate tool for theme experimentation and customization.

- **New: Multi-Step Color Undo**
  - The "Reset" button next to each color picker has been upgraded to an intelligent **Undo** button .
  - It now remembers the last 5 changes you made to that specific color. If you make a mistake or want to go back, simply click Undo to step back through your recent edits.
  - If there's no history, it will simply notify you instead of reverting to default, giving you full control.

- **Complete Search Overhaul**
  - **Better Placement**: The entire search interface has been moved to the top of the settings panel, right where you'd expect it to be.
  - **Focus Mode**: When you start typing in the search bar, all irrelevant sections (like Profile Manager and Options) automatically disappear, providing a clean and focused view of your color variables and results.
  - **Smarter Filtering**: Fixed a bug where searching for a term like `h1` would show empty category titles. Now, only the categories that actually contain a matching result will be displayed.

### UI & UX Enhancements

- **Redesigned Support Area**: The "Like the Plugin?" section has been visually updated for a cleaner and more engaging look.
- **New 'My GitHub' Button**: Added a new button that links directly to Yazan Ammar's GitHub profile, making it easier to connect.

## [v1.0.3](https://github.com/YazanAmmar/obsidian-theme-engine/releases/tag/1.0.3) - 2025-09-03 (The Power User Update)

### New Features & Major Improvements

- **Profile Snapshots:** Added new **Pin** and **Reset to Pinned** buttons, allowing users to save and restore a snapshot of their color profiles for risk-free editing.
- **Advanced Search & Filtering:** Implemented a powerful search bar in the Profile Manager to filter color variables by name or value, with toggles for case-sensitivity and Regular Expressions.
- **Workflow Hotkeys:** :Speed up your workflow with two new commands that you can assign to hotkeys:
  - Toggle Theme Engine: Quickly enable or disable the plugin without opening the settings.
  - Cycle Theme Engine Profile: Instantly switch to the next color profile in your list.

- **Performance Control (FPS Slider):** Added a `Live Update FPS` slider (0-60 FPS) to the settings, giving users control over live preview performance, which is especially useful for lower-spec devices.
- **Enhanced Profile Management:** Upgraded the profile actions with new `Copy JSON` and an advanced `Paste / Import` modal that supports both **Merge** and **Replace** actions for greater flexibility. The UI for these actions has been redesigned and repositioned for a cleaner look.
- **Polished UI & Stats:** The support card has been completely redesigned with a modern, professional look, featuring animated progress bars that display live stats about your usage (profiles, colors, and days of use) and stylish new buttons.

### Bug Fixes & Minor Enhancements

- **Robust Graph View Editing:** The editing experience for the Graph View has been completely overhauled for reliability. The `Apply` and `Cancel` buttons now use a temporary state system, ensuring changes are only saved when intended and `Cancel` reliably discards all edits.
- **Intuitive Hide Behavior:** Closing the settings window while editing Graph View colors now correctly and automatically cancels the changes, preventing accidental saves.
- **True Live Previews for Iconize:** Fixed a bug where Iconize plugin colors would not update instantly while dragging the color picker. Previews are now perfectly live.

## [v1.0.2](https://github.com/YazanAmmar/obsidian-theme-engine/releases/tag/1.0.2) - 2025-08-30

### New Features & Major Improvements

- **Instant UI Refresh:**
  - The **Apply** button for the Graph View now triggers an instant, workspace-wide refresh. All open views, including existing Graph View tabs, will now update their colors immediately. **No more need to open new tabs!**
  - We've added a **permanent Refresh** button to the Graph View section, to solve any color hang issue with the click of a button.
- **Profile-Specific Themes:**
  - You can now classify new profiles as **'Dark Mode'**, **'Light Mode'**, or **'Automatic'**.
  - Activating a profile will now automatically switch Obsidian to the corresponding theme, giving you complete environmental control with a single click.

- **Smart Iconize Cleanup & Integration:**
  - Added an automated cleanup system that periodically checks for and removes orphaned `Iconize` icons if the plugin is ever uninstalled, keeping your vault clean.
  - Added a "Cleanup Interval" slider in the settings, allowing you to control how often this check runs.
  - Improved the reliability of color overrides for `Iconize` by using a `MutationObserver` to re-apply colors dynamically as your vault's interface changes.

- **Enhanced User Experience:**
  - The settings panel is now smarter! If you change Graph View colors and then close the settings window without saving, your changes are **automatically discarded**.
  - Added a new "Like the Plugin?" support section with live stats and quick links to star the project on GitHub or report an issue.

### Bug Fixes

- **Fixed: Graph View colors not updating!** The biggest fix of this release. The old issue where colors on existing Graph View tabs wouldn't update has been definitively solved with the new instant refresh system.

## [v1.0.1](https://github.com/YazanAmmar/obsidian-theme-engine/releases/tag/1.0.1) - 2025-08-28

- **New Feature:** Added integration with the Iconize plugin, allowing full control over its icon colors from within Theme Engine.
- **Fixed:** Resolved a bug where Iconize colors would persist after the main plugin was disabled.
- **Improved:** Relocated the "Override Iconize Colors" toggle to a more logical position in the settings for a better user experience.

## [v1.0.0](https://github.com/YazanAmmar/obsidian-theme-engine/releases/tag/1.0.0) - 2025-08-22

- Initial release of Theme Engine!
- Live color editor for all core Obsidian CSS variables.
- Full profile management (create, delete, switch).
- Import/export profiles as `.json` files.
- Bilingual UI (English & Arabic) with RTL support.
- Includes 5 beautiful default themes: Default, OLED Matrix, Solarized Nebula, Cyberpunk Sunset, and Citrus Zest.
