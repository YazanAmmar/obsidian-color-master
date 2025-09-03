# Changelog

## v1.0.3 - 2025-09-03 (The Power User Update) 

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

## v1.0.2 - 2025-08-30

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

## v1.0.1 - 2025-08-28

- **New Feature:** Added integration with the Iconize plugin, allowing full control over its icon colors from within Color Master.
- **Fixed:** Resolved a bug where Iconize colors would persist after the main plugin was disabled.
- **Improved:** Relocated the "Override Iconize Colors" toggle to a more logical position in the settings for a better user experience.

## v1.0.0 - 2025-08-22

- Initial release of Color Master!
- Live color editor for all core Obsidian CSS variables.
- Full profile management (create, delete, switch).
- Import/export profiles as `.json` files.
- Bilingual UI (English & Arabic) with RTL support.
- Includes 5 beautiful default themes: Default, OLED Matrix, Solarized Nebula, Cyberpunk Sunset, and Citrus Zest.
