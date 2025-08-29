# Changelog

## v1.0.2 - 2025-08-30

### New Features & Major Improvements

-   **Advanced Graph View Control:**
    -   A dedicated control system has been introduced for the **Graph View** to solve the old live-update issue. Color changes in this section are no longer applied instantly.
    -   **Apply** and **Cancel** buttons now appear *only* when you modify Graph View colors, giving you full control and preventing accidental changes.
    -   The settings panel is now smarter! If you change Graph View colors and then close the settings window without saving, your changes are **automatically discarded**.

-   **Smart & Robust Iconize Integration:**
    -   A **MutationObserver** has been integrated to watch for any changes in the app's interface, re-applying `Iconize` colors instantly and reliably, even for dynamically loaded icons.
    -   An automated **cleanup system** now periodically checks for and removes orphaned `Iconize` icons if the plugin is ever uninstalled, keeping your vault clean.
    -   A new **"Cleanup Interval"** slider has been added to the settings, allowing you to control how often this check runs.

-   **Enhanced User Experience:**
    -   A new "Like the Plugin?" support section has been added with live stats (number of profiles, customizable colors) and quick links to star the project on GitHub or report an issue.

### Bug Fixes & Other Improvements

-   **Improved:** Color overrides for `Iconize` are now more robust, using `!important` to ensure they take priority over other styles.
-   **Fixed:** Correctly handles cases where `Iconize` icon colors would "stick" even after disabling the override toggle or the main plugin. The cleanup process is now more thorough.
-   **Fixed:** The automated cleanup process is now safer and will only remove orphaned icons if it confirms the `Iconize` plugin is actually uninstalled.

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
