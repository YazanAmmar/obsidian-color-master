import { ButtonComponent, Notice, ToggleComponent, setIcon } from 'obsidian';
import { t } from '../../i18n/strings';
import type { Snippet } from '../../types';
import { ConfirmationModal, SnippetCssModal } from '../modals';
import type { ThemeEngineSettingTab } from '../settingsTab';
import Sortable from 'sortablejs';

function initSnippetDrag(containerEl: HTMLElement, settingTab: ThemeEngineSettingTab) {
  const plugin = settingTab.plugin;

  const refreshVisualOrder = () => {
    const orderEls = containerEl.querySelectorAll<HTMLElement>('.cm-snippet-order-number');
    orderEls.forEach((el, index) => {
      el.setText(`${index + 1}`);
    });
  };

  if (settingTab.snippetSortable) {
    settingTab.snippetSortable.destroy();
  }

  if (!Sortable) {
    console.warn('Theme Engine: SortableJS library not found.');
    return;
  }

  const isLocked = plugin.settings.snippetsLocked || false;

  settingTab.snippetSortable = new Sortable(containerEl, {
    handle: '.cm-snippet-drag-handle',
    animation: 160,
    ghostClass: 'cm-snippet-ghost',
    dragClass: 'cm-snippet-dragged',
    disabled: isLocked, // Disable dragging via Sortable API

    onEnd: (evt: unknown) => {
      void (async () => {
        const { oldIndex, newIndex } = evt as {
          oldIndex: number;
          newIndex: number;
        };
        if (oldIndex === newIndex) return;

        const globalSnippets = plugin.settings.globalSnippets || [];
        const profileSnippets =
          plugin.settings.profiles[plugin.settings.activeProfile].snippets || [];
        const numGlobal = globalSnippets.length;

        if (oldIndex < numGlobal) {
          if (newIndex >= numGlobal) {
            settingTab.display();
            new Notice(t('notices.snippetScopeMove'));
            return;
          }
          const [movedItem] = globalSnippets.splice(oldIndex, 1);
          globalSnippets.splice(newIndex, 0, movedItem);
        } else {
          if (newIndex < numGlobal) {
            settingTab.display();
            new Notice(t('notices.snippetScopeMove'));
            return;
          }

          const adjustedOldIndex = oldIndex - numGlobal;
          const adjustedNewIndex = newIndex - numGlobal;

          const [movedItem] = profileSnippets.splice(adjustedOldIndex, 1);
          profileSnippets.splice(adjustedNewIndex, 0, movedItem);
        }

        await plugin.saveSettings();
        refreshVisualOrder();
      })().catch((err) => {
        console.error('Failed to reorder snippets:', err);
      });
    },
  });
}

export function drawCssSnippetsUI(containerEl: HTMLElement, settingTab: ThemeEngineSettingTab) {
  const plugin = settingTab.plugin;

  const snippetsSection = containerEl.createDiv({
    cls: 'cm-snippets-section cm-fallback-setting-group',
  });

  const headerContainer = snippetsSection.createDiv({
    cls: 'cm-snippets-header',
  });

  const isLocked = plugin.settings.snippetsLocked || false;

  headerContainer.createEl('h3', { text: t('snippets.heading') });

  const controlsContainer = headerContainer.createDiv({
    cls: 'cm-snippets-header-controls',
  });

  // --- Lock Button ---
  new ButtonComponent(controlsContainer)
    .setIcon(isLocked ? 'lock' : 'lock-open')
    .setTooltip(isLocked ? t('tooltips.unlockSnippets') : t('tooltips.lockSnippets'))
    .onClick(async () => {
      plugin.settings.snippetsLocked = !isLocked;
      await plugin.saveSettings();

      settingTab.display();

      new Notice(isLocked ? t('notices.snippetsUnlocked') : t('notices.snippetsLocked'));
    });

  const lockButton = controlsContainer.lastElementChild as HTMLButtonElement | null;
  if (lockButton) {
    lockButton.classList.add('cm-snippet-lock-btn');
    if (isLocked) {
      lockButton.classList.add('is-locked');
    }
  }

  new ButtonComponent(controlsContainer)
    .setButtonText(t('snippets.createButton'))
    .setCta()
    .onClick(() => {
      new SnippetCssModal(settingTab.app, plugin, settingTab, null).open();
    });

  const createButton = controlsContainer.lastElementChild as HTMLButtonElement | null;
  if (createButton) {
    createButton.classList.add('cm-snippets-create-btn');
  }

  const snippetsGroupBody = snippetsSection.createDiv({
    cls: 'cm-setting-group-body cm-snippets-group-body',
  });

  const activeProfile = plugin.settings.profiles[plugin.settings.activeProfile];
  if (!activeProfile) return;

  const globalSnippets = plugin.settings.globalSnippets || [];
  const profileSnippets = Array.isArray(activeProfile.snippets) ? activeProfile.snippets : [];

  const snippetsContainer = snippetsGroupBody.createDiv({
    cls: 'cm-snippets-list-container',
  });

  if (globalSnippets.length === 0 && profileSnippets.length === 0) {
    const emptyState = snippetsContainer.createDiv('cm-snippets-empty-state');
    emptyState.setText(t('snippets.noSnippetsDesc'));
    return;
  }

  const renderSnippet = (snippet: Snippet, index: number, isGlobal: boolean) => {
    const snippetEl = snippetsContainer.createDiv({
      cls: 'setting-item cm-snippet-item',
    });

    const dragContainer = snippetEl.createDiv({
      cls: 'cm-snippet-drag-container',
    });

    const handle = dragContainer.createDiv({
      cls: 'cm-snippet-drag-handle',
    });
    setIcon(handle, 'grip-vertical');

    if (isLocked) {
      handle.classList.add('is-locked');
    }

    dragContainer.createEl('span', {
      cls: 'cm-snippet-divider',
      text: '|',
    });
    dragContainer.createDiv({
      cls: 'cm-snippet-order-number',
      text: `${index + 1}`,
    });

    const infoEl = snippetEl.createDiv('setting-item-info');
    const nameEl = infoEl.createDiv({
      cls: 'setting-item-name',
    });

    nameEl.createSpan({ text: snippet.name });

    if (isGlobal) {
      nameEl.createSpan({
        text: t('snippets.global'),
        cls: 'cm-snippet-global-badge',
      });
    }

    const controlEl = snippetEl.createDiv('setting-item-control');

    new ToggleComponent(controlEl).setValue(snippet.enabled).onChange(async (value) => {
      snippet.enabled = value;
      await plugin.saveSettings();
    });

    new ButtonComponent(controlEl)
      .setIcon('pencil')
      .setTooltip(t('tooltips.editSnippet'))
      .onClick(() => {
        new SnippetCssModal(settingTab.app, plugin, settingTab, snippet).open();
      });

    new ButtonComponent(controlEl)
      .setIcon('copy')
      .setTooltip(t('tooltips.copySnippetCss'))
      .onClick(async (evt) => {
        if (!snippet.css) {
          new Notice(t('notices.snippetEmpty'));
          return;
        }
        await navigator.clipboard.writeText(snippet.css);
        new Notice(t('notices.snippetCssCopied'));
        const buttonEl = evt.currentTarget as HTMLButtonElement;
        if (!buttonEl) return;
        setIcon(buttonEl, 'check');
        buttonEl.classList.add('is-success');
        buttonEl.disabled = true;
        setTimeout(() => {
          buttonEl.classList.remove('is-success');
          setIcon(buttonEl, 'copy');
          buttonEl.disabled = false;
        }, 1000);
      });

    new ButtonComponent(controlEl)
      .setIcon('trash')
      .setTooltip(t('tooltips.deleteSnippet'))
      .onClick(() => {
        new ConfirmationModal(
          settingTab.app,
          plugin,
          t('modals.confirmation.deleteSnippetTitle', snippet.name),
          t('modals.confirmation.deleteSnippetDesc'),
          () => {
            void (async () => {
              const list = isGlobal
                ? plugin.settings.globalSnippets
                : plugin.settings.profiles[plugin.settings.activeProfile].snippets;

              const snippetIndex = list.findIndex((s) => s.id === snippet.id);
              if (snippetIndex > -1) {
                list.splice(snippetIndex, 1);
              }

              await plugin.saveSettings();
              settingTab.display();
              new Notice(t('notices.snippetDeleted'));
            })().catch((err) => {
              console.error('Failed to delete snippet:', err);
            });
          },
        ).open();
      });
  };

  globalSnippets.forEach((snippet, index) => renderSnippet(snippet, index, true));

  profileSnippets.forEach((snippet, index) =>
    renderSnippet(snippet, index + globalSnippets.length, false),
  );

  initSnippetDrag(snippetsContainer, settingTab);
}
