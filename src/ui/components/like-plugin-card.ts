import { setIcon } from 'obsidian';
import { DEFAULT_VARS } from '../../constants';
import { t } from '../../i18n/strings';
import { flattenVars } from '../../utils';
import type { ColorMasterSettingTab } from '../settingsTab';

const GITHUB_REPO_URL = 'https://github.com/YazanAmmar/obsidian-color-master';
const ISSUE_URL = 'https://github.com/YazanAmmar/obsidian-color-master/issues';
const SYNC_WIKI_URL = 'https://github.com/YazanAmmar/SyncEveryThing';
const TELEGRAM_URL = 'https://t.me/ThemeEngine';

function calcProfilesCount(settingTab: ColorMasterSettingTab): number {
  return Object.keys(settingTab.plugin.settings.profiles || {}).length;
}

function calcSnippetsCount(settingTab: ColorMasterSettingTab): number {
  const settings = settingTab.plugin.settings;
  const profiles = settings.profiles || {};

  let totalSnippets = settings.globalSnippets ? settings.globalSnippets.length : 0;

  for (const profileName in profiles) {
    const profile = profiles[profileName];
    if (profile && Array.isArray(profile.snippets)) {
      totalSnippets += profile.snippets.length;
    }
  }
  return totalSnippets;
}

function calcVarsCount(settingTab: ColorMasterSettingTab): number {
  const allVars = new Set(Object.keys(flattenVars(DEFAULT_VARS)));
  const activeProfile =
    settingTab.plugin.settings.profiles[settingTab.plugin.settings.activeProfile];
  if (activeProfile && activeProfile.vars) {
    Object.keys(activeProfile.vars).forEach((varName) => allVars.add(varName));
  }
  return allVars.size;
}

function calcPluginIntegrations(): number {
  try {
    if (DEFAULT_VARS && DEFAULT_VARS['Plugin Integrations']) {
      return Object.keys(DEFAULT_VARS['Plugin Integrations']).length;
    }
  } catch (e) {
    console.error('Color Master: Failed to calculate plugin integrations.', e);
  }
  return 0;
}

export function drawLikePluginCard(
  containerEl: HTMLElement,
  settingTab: ColorMasterSettingTab,
): HTMLElement {
  const likeCardEl = containerEl.createDiv('cm-like-card');

  const headerSection = likeCardEl.createDiv('cm-like-card-header');

  const headerText = headerSection.createDiv('cm-like-card-header-text');
  headerText.createEl('h3', { text: t('plugin.name') });
  headerText.createEl('p', { text: t('likeCard.description') });

  const statsSection = likeCardEl.createDiv('cm-like-card-stats');

  const profilesCount = calcProfilesCount(settingTab);
  const snippetsCount = calcSnippetsCount(settingTab);
  const varsCount = calcVarsCount(settingTab);
  const integrationsCount = calcPluginIntegrations();
  const sinceInstalled = settingTab.plugin.settings.installDate || new Date().toISOString();
  const days = Math.max(
    1,
    Math.floor((Date.now() - new Date(sinceInstalled).getTime()) / (1000 * 60 * 60 * 24)),
  );

  const createStat = (iconName: string, label: string, value: string | number) => {
    const statItem = statsSection.createDiv('cm-stat-item');
    const iconEl = statItem.createDiv('cm-stat-icon');
    setIcon(iconEl, iconName);
    const textEl = statItem.createDiv('cm-stat-text');
    textEl.createDiv({ cls: 'cm-stat-value', text: String(value) });
    textEl.createDiv({ cls: 'cm-stat-label', text: label });
  };

  createStat(
    'folder-tree',
    t('likeCard.profilesAndSnippets'),
    `${profilesCount} / ${snippetsCount}`,
  );
  createStat('palette', t('likeCard.customizableColors'), varsCount);
  createStat('plug-zap', t('categories.pluginintegrations'), integrationsCount);
  createStat('calendar-clock', t('likeCard.daysOfUse'), days);

  const actionsSection = likeCardEl.createDiv('cm-like-card-actions');

  const createActionButton = (iconName: string, tooltip: string, url: string) => {
    const btn = actionsSection.createEl('a', {
      cls: 'cm-action-button',
      href: url,
      attr: {
        'aria-label': tooltip,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    });
    setIcon(btn, iconName);
  };

  createActionButton('github', t('likeCard.githubButton'), GITHUB_REPO_URL);
  createActionButton('bug', t('likeCard.reportIssueButton'), ISSUE_URL);
  createActionButton('git-pull-request-arrow', t('likeCard.syncVaultButton'), SYNC_WIKI_URL);
  createActionButton('send', t('likeCard.telegramButton'), TELEGRAM_URL);

  return likeCardEl;
}
