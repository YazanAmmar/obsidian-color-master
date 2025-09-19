# Changelog

## [v1.0.7](https://github.com/YazanAmmar/obsidian-color-master/releases/tag/1.0.7) - 2025-09-19 (TypeScript)

### Major Milestone: The TypeScript Rewrite!

The entire Color Master codebase has been successfully migrated from JavaScript to **TypeScript**! This is a massive step forward for the project's health, stability, and future development.

-   **Enhanced Stability:** TypeScript's static typing catches common errors during development, significantly reducing the chance of bugs making it into a release.
-   **Easier Maintenance:** A strongly-typed codebase is easier to read, refactor, and build upon.
-   **Faster Future Development:** This migration paves the way for adding more complex features with greater confidence and speed.

> **A personal note from the developer:** I sincerely apologize for the delay in this migration (spanning several versions). As I was learning TypeScript from scratch with limited time, I wanted to ensure the transition was done right. Thank you for your patience! The foundation is now rock-solid for the future.

### New Features

* **Drag & Drop to Reorder CSS Snippets**
    -   You can now drag and drop snippets in the list to control their execution order. This gives you precise control over the CSS cascade; rules in snippets lower in the list will override those above them in case of a conflict.
    -   *Example:* If Snippet A makes `h1` blue and Snippet B makes `h1` red, placing Snippet B *after* Snippet A will result in a red `h1`.

* **Add Custom CSS Variables**
    -   A new feature that allows you to add any CSS variable from Obsidian's official documentation directly into the plugin.
    -   Your custom variables are saved with your profile and are included when you export or share it.

* **Session-Persistent Undo/Redo for Editors**
    -   The CSS editor for snippets and profiles now remembers your changes for the entire Obsidian session.
    -   You can now close the editor modal, test your changes, and re-open it to continue using **Ctrl+Z** (Undo) and **Ctrl+Y** (Redo) without losing your history. The history is cleared when Obsidian is closed.

* **New Languages**
    -   Added full UI translations for **French** and **Persian**.

### Improvements & Fixes

* **RTL/LTR:** Vastly improved Right-to-Left (RTL) language support. Fixed major UI layout issues that occurred when using an LTR plugin language (like English) inside an RTL Obsidian interface (like Arabic), and vice-versa.
* **Notice Rules:**
    -   Rules are now **case-insensitive**. A keyword like "Success" will now match "success" and "SUCCESS".
    -   Fixed a critical bug where notice rules failed to match non-Latin keywords (e.g., Arabic, Persian) due to incorrect Regex logic.
* **Custom Variables:** Custom variables are now correctly included in the statistics card count.
* **UI:** The "Create New Snippet" button is now always visible at the top of the snippets list for quicker access.
* **And many other minor bug fixes and performance enhancements.**

## [v1.0.6](https://github.com/YazanAmmar/obsidian-color-master/releases/tag/1.0.6) - 2025-09-13 (The Thematic Intelligence Update)

This update focuses on two core principles: **intelligence and elegance**. We're introducing the revolutionary Advanced Notice Coloring system, adding a new layer of interactive intelligence to your workspace. This comes alongside a comprehensive UI overhaul and precise enhancements to every corner of the plugin, making your experience smoother and more professional than ever.

### New Features & Major Improvements

* **Introducing Advanced Notice Coloring!** 
* For the first time, you can now control the background and text color of notices based on their content. Create prioritized rules using keywords or Regex to make your workspace more dynamic and informative. 
* The user interface for creating rules has been redesigned with an intuitive tag-based input for keywords, smart duplicate detection, and smooth animations for adding/deleting rules. 
* Includes a new “Test Rule” button (🔔) to instantly preview how a notice will look.

* **Full Right-to-Left (RTL) Language Support:** 
* The plugin now has foundational support for RTL languages, starting with a complete **Arabic** translation. 
* All UI components, including new mods and controls, have been re-engineered to display perfectly in both LTR and RTL layouts. This centralized architecture makes adding new languages ​​in the future incredibly simple.

* **Expanded Markdown Color Control:** 
* Added several new color variables for finer control over your notes' appearance, including: 
* `--blockquote-bg`: A brand new variable to control the background color of blockquotes. 
* `--hr-color`: For horizontal styling rules. 
* `--code-normal` & `--code-background`: For inline code blocks. 
* `--text-highlight-bg`: For highlighted text.

### UI/UX Enhancements & Polish

* **Massive Search & Filtering Overhaul:** 
* **Deeper Search:** The search function is now more powerful and searches within variable **descriptions**, not just their names. 
* **Animated Highlighting:** Search terms are now highlighted with a beautiful, animated wave gradient wherever they appear, making results easy to spot. 
* The search bar has been enhanced with a new search icon for a cleaner look.

* **Smarter & Safer Profile Importing:** 
* Importing a profile with a name that already exists will now open a new dialog prompting you for a different name, preventing you from accidentally overwriting your work.

* **Polished & Redesigned Modals:** 
* The "Advanced Notice Rules" and "Duplicate Profile Name" modals have been completely redesigned with a modern, clean, and more intuitive interface.

### Behind the Scenes

* **Architectural Upgrade: Profile-Specific Rules:** 
* Notice rules are no longer a global setting. They are now an integral part of each profile and are **automatically exported and imported** with them.

* **Professional Development Workflow:** 
* The project has now officially integrated the `SortableJS` library for smooth drag-and-drop functionality and has adopted a professional `npm run build` workflow, enhancing stability and maintainability.

> and many other important fixes, performance and interface improvements!

## [v1.0.5](https://github.com/YazanAmmar/obsidian-color-master/releases/tag/1.0.5) - 2025-09-08 (The Snippet & Polish Update)

### New Features & Major Improvements

* **Introducing CSS Snippets!**
    * The "Paste CSS" feature has been completely upgraded and now allows you to save code as either a full **Profile** or a lightweight **Snippet**.
    * **Why is this a game-changer?** Now you can save small, reusable CSS tweaks (like coloring a specific header or styling checkboxes) without creating an entire profile. This keeps your setup clean, organized, and powerful. You can toggle snippets on and off, edit them, and even copy their code with a new dedicated button.

* **Full Editing for CSS Profiles:**
    * You can now edit your existing CSS-based profiles directly. Change the name or update the CSS code at any time without needing to create a new profile from scratch.

* **Restore Built-in Profiles with One Click!**
    * A new **Restore (`history`) button** now appears next to the default profiles (like OLED Matrix). If you've modified a built-in theme and want to go back to its original state, just click this button.
    * **Smart Recovery:** Accidentally deleted a default profile? No problem! Just create a new, empty profile with the *exact same name* (e.g., "OLED Matrix"), and the restore button will magically reappear, allowing you to bring it back to its factory settings.

* **Complete Tag Styling Control:**
    * Added three new color variables specifically for styling tags, giving you pixel-perfect control over their appearance:
        * `--tag-color`: Sets the main text color of the tag.
        * `--tag-color-hover`: The text color when you hover over the tag.
        * `--tag-bg`: The background color of the tag "pill".

* **Powerful Import Modal:** The JSON import modal is now much more powerful. We've replaced the confusing "Merge" button with a highly-requested **"Create New"** button. You can now import a `.json` file and instantly create a new profile from it.

* **More Accurate Contrast Checker:** The accessibility checker is now more comprehensive and correctly checks the contrast for tags, icons, and interactive elements.

### Bug Fixes & Quality of Life Enhancements

* **Snapshots Now Save Everything!**
    * Fixed a critical issue where taking a Snapshot of a CSS Profile would only save the color variables but not the CSS code. Now, Snapshots correctly save and restore **both** the colors and the associated CSS code, making them completely reliable.

* **Smarter Profile Renaming:**
    * Fixed a bug where renaming a profile would cause its Snapshot to be lost. Now, when you rename a profile, its pinned Snapshot is intelligently renamed with it.
    * Fixed a related bug where updating a CSS profile's name would fail or not save correctly. The process is now seamless.

* **New "Transparent" Tool:**
    * Added a new **Eraser (`eraser`) button** next to each color picker. Clicking it instantly sets the color to `transparent`, which is perfect for removing backgrounds or borders.

* **UI & Wording Improvements:**
    * The "Paste CSS" button has been renamed to **"Paste / Import (CSS)..."** to better reflect its ability to Import and paste `.css` files.
    * Fixed a minor bug where updating a CSS profile with the same name would show two notifications. Now, it correctly shows only "Profile updated."

## [v1.0.4](https://github.com/YazanAmmar/obsidian-color-master/releases/tag/1.0.4) - 2025-09-04 (The CSS Freedom Update)

### New Features & Major Improvements

* **New: Paste CSS for Instant Theming!**
    * Introducing a revolutionary way to create color profiles! You can now click the new "Paste CSS" button to paste raw CSS code from any theme or snippet.
    * This creates a special "CSS Profile" that directly applies your pasted code, allowing you to use complex themes without needing to install them separately. It's the ultimate tool for theme experimentation and customization. 

* **New: Multi-Step Color Undo**
    * The "Reset" button next to each color picker has been upgraded to an intelligent **Undo** button .
    * It now remembers the last 5 changes you made to that specific color. If you make a mistake or want to go back, simply click Undo to step back through your recent edits.
    * If there's no history, it will simply notify you instead of reverting to default, giving you full control.

* **Complete Search Overhaul**
    * **Better Placement**: The entire search interface has been moved to the top of the settings panel, right where you'd expect it to be.
    * **Focus Mode**: When you start typing in the search bar, all irrelevant sections (like Profile Manager and Options) automatically disappear, providing a clean and focused view of your color variables and results. 
    * **Smarter Filtering**: Fixed a bug where searching for a term like `h1` would show empty category titles. Now, only the categories that actually contain a matching result will be displayed. 

### UI & UX Enhancements

* **Redesigned Support Area**: The "Like the Plugin?" section has been visually updated for a cleaner and more engaging look.
* **New 'My GitHub' Button**: Added a new button that links directly to Yazan Ammar's GitHub profile, making it easier to connect.

## [v1.0.3](https://github.com/YazanAmmar/obsidian-color-master/releases/tag/1.0.3) - 2025-09-03 (The Power User Update) 

### New Features & Major Improvements

* **Profile Snapshots:** Added new **Pin** and **Reset to Pinned** buttons, allowing users to save and restore a snapshot of their color profiles for risk-free editing.
* **Advanced Search & Filtering:** Implemented a powerful search bar in the Profile Manager to filter color variables by name or value, with toggles for case-sensitivity and Regular Expressions.
* **Workflow Hotkeys:** :Speed up your workflow with two new commands that you can assign to hotkeys:
    - Toggle Color Master: Quickly enable or disable the plugin without opening the settings.
    - Cycle Color Master Profile: Instantly switch to the next color profile in your list.

* **Performance Control (FPS Slider):** Added a `Live Update FPS` slider (0-60 FPS) to the settings, giving users control over live preview performance, which is especially useful for lower-spec devices.
* **Enhanced Profile Management:** Upgraded the profile actions with new `Copy JSON` and an advanced `Paste / Import` modal that supports both **Merge** and **Replace** actions for greater flexibility. The UI for these actions has been redesigned and repositioned for a cleaner look.
* **Polished UI & Stats:** The support card has been completely redesigned with a modern, professional look, featuring animated progress bars that display live stats about your usage (profiles, colors, and days of use) and stylish new buttons.

### Bug Fixes & Minor Enhancements

* **Robust Graph View Editing:** The editing experience for the Graph View has been completely overhauled for reliability. The `Apply` and `Cancel` buttons now use a temporary state system, ensuring changes are only saved when intended and `Cancel` reliably discards all edits.
* **Intuitive Hide Behavior:** Closing the settings window while editing Graph View colors now correctly and automatically cancels the changes, preventing accidental saves.
* **True Live Previews for Iconize:** Fixed a bug where Iconize plugin colors would not update instantly while dragging the color picker. Previews are now perfectly live.

## [v1.0.2](https://github.com/YazanAmmar/obsidian-color-master/releases/tag/1.0.2) - 2025-08-30

### New Features & Major Improvements

-   **Instant UI Refresh:**
    -   The **Apply** button for the Graph View now triggers an instant, workspace-wide refresh. All open views, including existing Graph View tabs, will now update their colors immediately. **No more need to open new tabs!**
    - We've added a **permanent Refresh** button to the Graph View section, to solve any color hang issue with the click of a button.
-   **Profile-Specific Themes:**
    -   You can now classify new profiles as **'Dark Mode'**, **'Light Mode'**, or **'Automatic'**.
    -   Activating a profile will now automatically switch Obsidian to the corresponding theme, giving you complete environmental control with a single click.

-   **Smart Iconize Cleanup & Integration:**
    -   Added an automated cleanup system that periodically checks for and removes orphaned `Iconize` icons if the plugin is ever uninstalled, keeping your vault clean.
    -   Added a "Cleanup Interval" slider in the settings, allowing you to control how often this check runs.
    -   Improved the reliability of color overrides for `Iconize` by using a `MutationObserver` to re-apply colors dynamically as your vault's interface changes.

-   **Enhanced User Experience:**
    -   The settings panel is now smarter! If you change Graph View colors and then close the settings window without saving, your changes are **automatically discarded**.
    -   Added a new "Like the Plugin?" support section with live stats and quick links to star the project on GitHub or report an issue.

### Bug Fixes

-   **Fixed: Graph View colors not updating!** The biggest fix of this release. The old issue where colors on existing Graph View tabs wouldn't update has been definitively solved with the new instant refresh system.

## [v1.0.1](https://github.com/YazanAmmar/obsidian-color-master/releases/tag/1.0.1) - 2025-08-28

- **New Feature:** Added integration with the Iconize plugin, allowing full control over its icon colors from within Color Master.
- **Fixed:** Resolved a bug where Iconize colors would persist after the main plugin was disabled.
- **Improved:** Relocated the "Override Iconize Colors" toggle to a more logical position in the settings for a better user experience.

## [v1.0.0](https://github.com/YazanAmmar/obsidian-color-master/releases/tag/1.0.0) - 2025-08-22

- Initial release of Color Master!
- Live color editor for all core Obsidian CSS variables.
- Full profile management (create, delete, switch).
- Import/export profiles as `.json` files.
- Bilingual UI (English & Arabic) with RTL support.
- Includes 5 beautiful default themes: Default, OLED Matrix, Solarized Nebula, Cyberpunk Sunset, and Citrus Zest.
