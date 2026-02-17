import { Notice } from 'obsidian';
import { t } from '../i18n/strings';
import type ThemeEngine from '../main';
import type { NoticeRule, Profile, Snippet } from '../types';

type LegacyPinnedSnapshot = {
  vars?: Record<string, string>;
  customCss?: string;
  snippets?: Snippet[];
  noticeRules?: {
    text: NoticeRule[];
    background: NoticeRule[];
  };
};

export const pinProfileSnapshot = async (
  plugin: ThemeEngine,
  profileName: string,
): Promise<void> => {
  const targetProfile = profileName || plugin.settings.activeProfile;
  plugin.settings.pinnedSnapshots = plugin.settings.pinnedSnapshots || {};
  const profile = plugin.settings.profiles?.[targetProfile];
  if (!profile) {
    new Notice(t('notices.profileNotFound'));
    return;
  }

  const snapshotProfile: Profile = JSON.parse(
    JSON.stringify({
      ...profile,
      vars: profile.vars || {},
      themeType: profile.themeType || 'auto',
      snippets: Array.isArray(profile.snippets) ? profile.snippets : [],
      customCss: profile.customCss || '',
      noticeRules: profile.noticeRules || { text: [], background: [] },
    }),
  );

  plugin.settings.pinnedSnapshots[targetProfile] = {
    pinnedAt: new Date().toISOString(),
    profile: snapshotProfile,
  };
  await plugin.saveSettings();
};

export const resetProfileToPinned = async (
  plugin: ThemeEngine,
  profileName: string,
): Promise<void> => {
  const targetProfile = profileName || plugin.settings.activeProfile;
  const snap = plugin.settings.pinnedSnapshots?.[targetProfile];
  if (!snap) {
    new Notice(t('notices.noPinnedSnapshot'));
    return;
  }

  const activeProfile = plugin.settings.profiles[targetProfile];
  if (!activeProfile) {
    new Notice(t('notices.profileNotFound'));
    return;
  }

  const legacySnap = snap as LegacyPinnedSnapshot;
  const pinnedProfile: Profile | null = snap.profile
    ? JSON.parse(JSON.stringify(snap.profile))
    : legacySnap.vars
      ? {
          vars: JSON.parse(JSON.stringify(legacySnap.vars)),
          themeType: activeProfile.themeType || 'auto',
          snippets: Array.isArray(legacySnap.snippets)
            ? JSON.parse(JSON.stringify(legacySnap.snippets))
            : [],
          customCss: legacySnap.customCss || '',
          noticeRules: legacySnap.noticeRules
            ? JSON.parse(JSON.stringify(legacySnap.noticeRules))
            : { text: [], background: [] },
        }
      : null;

  if (!pinnedProfile || !pinnedProfile.vars) {
    new Notice(t('notices.noPinnedSnapshot'));
    return;
  }

  activeProfile.vars = pinnedProfile.vars;
  activeProfile.customCss = pinnedProfile.customCss || '';
  activeProfile.snippets = Array.isArray(pinnedProfile.snippets) ? pinnedProfile.snippets : [];
  activeProfile.noticeRules = pinnedProfile.noticeRules || { text: [], background: [] };

  Object.keys(pinnedProfile.vars).forEach((key) => {
    plugin.pendingVarUpdates[key] = pinnedProfile.vars[key];
  });

  await plugin.saveSettings();
  plugin.applyPendingNow();
};

export const pushCssHistory = (plugin: ThemeEngine, id: string, content: string): void => {
  if (!plugin.cssHistory[id]) {
    plugin.cssHistory[id] = { undoStack: [], redoStack: [] };
  }
  const history = plugin.cssHistory[id];
  const lastState = history.undoStack[history.undoStack.length - 1];

  if (lastState !== content) {
    history.undoStack.push(content);
    history.redoStack = [];
  }
};

export const undoCssHistory = (plugin: ThemeEngine, id: string): string | null => {
  const history = plugin.cssHistory[id];
  if (history && history.undoStack.length > 1) {
    const currentState = history.undoStack.pop();
    if (typeof currentState === 'string') {
      history.redoStack.push(currentState);
    }
    return history.undoStack[history.undoStack.length - 1];
  }
  return null;
};

export const redoCssHistory = (plugin: ThemeEngine, id: string): string | null => {
  const history = plugin.cssHistory[id];
  if (history && history.redoStack.length > 0) {
    const nextState = history.redoStack.pop();
    if (typeof nextState === 'string') {
      history.undoStack.push(nextState);
      return nextState;
    }
  }
  return null;
};
