import {
  ButtonComponent,
  Notice,
  Setting,
  ToggleComponent,
  setIcon,
} from "obsidian";
import { t } from "../../i18n/strings";
import type { Snippet } from "../../types";
import { ConfirmationModal, SnippetCssModal } from "../modals";
import type { ColorMasterSettingTab } from "../settingsTab";
import Sortable = require("sortablejs");

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

      const globalSnippets = plugin.settings.globalSnippets || [];
      const profileSnippets =
        plugin.settings.profiles[plugin.settings.activeProfile].snippets || [];
      const numGlobal = globalSnippets.length;

      if (oldIndex < numGlobal) {
        if (newIndex >= numGlobal) {
          settingTab.display();
          new Notice(t("notices.snippetScopeMove"));
          return;
        }
        const [movedItem] = globalSnippets.splice(oldIndex, 1);
        globalSnippets.splice(newIndex, 0, movedItem);
      } else {
        if (newIndex < numGlobal) {
          settingTab.display();
          new Notice(t("notices.snippetScopeMove"));
          return;
        }
        const adjustedOldIndex = oldIndex - numGlobal;
        const adjustedNewIndex = newIndex - numGlobal;

        const [movedItem] = profileSnippets.splice(adjustedOldIndex, 1);
        profileSnippets.splice(adjustedNewIndex, 0, movedItem);
      }

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
  headerContainer.createEl("h3", { text: t("snippets.heading") });
  new Setting(headerContainer)
    .setClass("cm-snippets-add-button")
    .addButton((button) => {
      button
        .setButtonText(t("snippets.createButton"))
        .setCta()
        .onClick(() => {
          new SnippetCssModal(settingTab.app, plugin, settingTab, null).open();
        });
    });

  const activeProfile = plugin.settings.profiles[plugin.settings.activeProfile];
  if (!activeProfile) return;

  const globalSnippets = plugin.settings.globalSnippets || [];
  const profileSnippets = Array.isArray(activeProfile.snippets)
    ? activeProfile.snippets
    : [];

  const snippetsContainer = containerEl.createDiv({
    cls: "cm-snippets-list-container",
  });

  if (globalSnippets.length === 0 && profileSnippets.length === 0) {
    const emptyState = snippetsContainer.createDiv("cm-snippets-empty-state");
    emptyState.setText(t("snippets.noSnippetsDesc"));
    return;
  }

  const renderSnippet = (
    snippet: Snippet,
    index: number,
    isGlobal: boolean
  ) => {
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
    const nameEl = infoEl.createDiv({
      cls: "setting-item-name",
    });

    nameEl.createSpan({ text: snippet.name });

    if (isGlobal) {
      nameEl.createSpan({
        text: "Global",
        cls: "cm-snippet-global-badge",
      });
    }

    const controlEl = snippetEl.createDiv("setting-item-control");

    new ToggleComponent(controlEl)
      .setValue(snippet.enabled)
      .onChange(async (value) => {
        snippet.enabled = value;
        await plugin.saveSettings();
      });

    new ButtonComponent(controlEl)
      .setIcon("pencil")
      .setTooltip(t("tooltips.editSnippet"))
      .onClick(() => {
        new SnippetCssModal(settingTab.app, plugin, settingTab, snippet).open();
      });

    new ButtonComponent(controlEl)
      .setIcon("copy")
      .setTooltip(t("tooltips.copySnippetCss"))
      .onClick(async (evt) => {
        if (!snippet.css) {
          new Notice(t("notices.snippetEmpty"));
          return;
        }
        await navigator.clipboard.writeText(snippet.css);
        new Notice(t("notices.snippetCssCopied"));
        const buttonEl = evt.currentTarget as HTMLElement;
        if (!buttonEl) return;
        setIcon(buttonEl, "check");
        buttonEl.classList.add("is-success");
        (buttonEl as any).disabled = true;
        setTimeout(() => {
          buttonEl.classList.remove("is-success");
          setIcon(buttonEl, "copy");
          (buttonEl as any).disabled = false;
        }, 1000);
      });

    new ButtonComponent(controlEl)
      .setIcon("trash")
      .setTooltip(t("tooltips.deleteSnippet"))
      .onClick(() => {
        new ConfirmationModal(
          settingTab.app,
          plugin,
          t("modals.confirmation.deleteSnippetTitle", snippet.name),
          t("modals.confirmation.deleteSnippetDesc"),
          async () => {
            const list = isGlobal
              ? plugin.settings.globalSnippets
              : plugin.settings.profiles[plugin.settings.activeProfile]
                  .snippets;

            const snippetIndex = list.findIndex((s) => s.id === snippet.id);
            if (snippetIndex > -1) {
              list.splice(snippetIndex, 1);
            }
            await plugin.saveSettings();
            settingTab.display();
          }
        ).open();
      });
  };

  globalSnippets.forEach((snippet, index) =>
    renderSnippet(snippet, index, true)
  );

  profileSnippets.forEach((snippet, index) =>
    renderSnippet(snippet, index + globalSnippets.length, false)
  );

  initSnippetDrag(snippetsContainer, settingTab);
}
