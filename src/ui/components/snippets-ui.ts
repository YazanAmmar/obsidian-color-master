import {
  Setting,
  ButtonComponent,
  Notice,
  ToggleComponent,
  setIcon,
} from "obsidian";
import Sortable = require("sortablejs");
import { t } from "../../i18n";
import type { ColorMasterSettingTab } from "../settingsTab";
import { ConfirmationModal, PasteCssModal } from "../modals";

function initSnippetDrag(
  containerEl: HTMLElement,
  settingTab: ColorMasterSettingTab
) {
  const plugin = settingTab.plugin;
  if (settingTab.snippetSortable) {
    settingTab.snippetSortable.destroy();
  }

  if (!Sortable) {
    console.warn("Color Master: SortableJS library not found.");
    return;
  }

  settingTab.snippetSortable = new Sortable(containerEl, {
    handle: ".cm-snippet-drag-handle",
    animation: 160,
    ghostClass: "cm-snippet-ghost",
    dragClass: "cm-snippet-dragged",

    onEnd: async (evt: any) => {
      const { oldIndex, newIndex } = evt;
      if (oldIndex === newIndex) return;

      const snippets =
        plugin.settings.profiles[plugin.settings.activeProfile].snippets;

      const [movedItem] = snippets.splice(oldIndex, 1);
      snippets.splice(newIndex, 0, movedItem);

      await plugin.saveSettings();
      settingTab.display();
    },
  });
}

export function drawCssSnippetsUI(
  containerEl: HTMLElement,
  settingTab: ColorMasterSettingTab
) {
  const plugin = settingTab.plugin;

  const headerContainer = containerEl.createDiv({
    cls: "cm-snippets-header",
  });
  headerContainer.createEl("h3", { text: t("SNIPPETS_HEADING") });
  new Setting(headerContainer)
    .setClass("cm-snippets-add-button")
    .addButton((button) => {
      button
        .setButtonText(t("CREATE_SNIPPET_BUTTON"))
        .setCta()
        .onClick(() => {
          new PasteCssModal(
            settingTab.app,
            plugin,
            settingTab,
            null,
            "Snippet"
          ).open();
        });
    });

  const activeProfile = plugin.settings.profiles[plugin.settings.activeProfile];
  if (!activeProfile) return;

  const snippets = Array.isArray(activeProfile.snippets)
    ? activeProfile.snippets
    : [];

  const snippetsContainer = containerEl.createDiv({
    cls: "cm-snippets-list-container",
  });

  if (snippets.length === 0) {
    const emptyState = snippetsContainer.createDiv("cm-snippets-empty-state");
    emptyState.setText(t("NO_SNIPPETS_DESC"));
  } else {
    snippets.forEach((snippet, index) => {
      const snippetEl = snippetsContainer.createDiv({
        cls: "setting-item cm-snippet-item",
      });

      const dragContainer = snippetEl.createDiv({
        cls: "cm-snippet-drag-container",
      });
      const handle = dragContainer.createDiv({
        cls: "cm-snippet-drag-handle",
      });
      setIcon(handle, "grip-vertical");
      dragContainer.createEl("span", {
        cls: "cm-snippet-divider",
        text: "|",
      });
      dragContainer.createDiv({
        cls: "cm-snippet-order-number",
        text: `${index + 1}`,
      });

      const infoEl = snippetEl.createDiv("setting-item-info");
      infoEl.createDiv({
        cls: "setting-item-name",
        text: snippet.name,
      });

      const controlEl = snippetEl.createDiv("setting-item-control");

      new ToggleComponent(controlEl)
        .setValue(snippet.enabled)
        .onChange(async (value) => {
          snippet.enabled = value;
          await plugin.saveSettings();
        });

      new ButtonComponent(controlEl)
        .setIcon("pencil")
        .setTooltip(t("TOOLTIP_EDIT_SNIPPET"))
        .onClick(() => {
          new PasteCssModal(settingTab.app, plugin, settingTab, snippet).open();
        });

      new ButtonComponent(controlEl)
        .setIcon("copy")
        .setTooltip(t("TOOLTIP_COPY_SNIPPET_CSS"))
        .onClick(async (evt) => {
          if (!snippet.css) {
            new Notice(t("NOTICE_SNIPPET_EMPTY"));
            return;
          }
          await navigator.clipboard.writeText(snippet.css);
          new Notice(t("NOTICE_SNIPPET_COPIED"));
          const buttonEl = evt.currentTarget as HTMLElement;
          if (!buttonEl) return;
          setIcon(buttonEl, "check");
          buttonEl.classList.add("is-success");
          (buttonEl as any).disabled = true;
          setTimeout(() => {
            buttonEl.classList.remove("is-success");
            setIcon(buttonEl, "copy");
            (buttonEl as any).disabled = false;
          }, 2000);
        });

      new ButtonComponent(controlEl)
        .setIcon("trash")
        .setTooltip(t("TOOLTIP_DELETE_SNIPPET"))
        .onClick(() => {
          new ConfirmationModal(
            settingTab.app,
            plugin,
            t("MODAL_DELETE_SNIPPET_TITLE", snippet.name),
            t("MODAL_DELETE_SNIPPET_DESC"),
            async () => {
              const snippetsArray =
                plugin.settings.profiles[plugin.settings.activeProfile]
                  .snippets;
              snippetsArray.splice(index, 1);
              await plugin.saveSettings();
              settingTab.display();
            }
          ).open();
        });
    });
  }
  initSnippetDrag(snippetsContainer, settingTab);
}
