import { PLUGIN_COMMAND_SUFFIXES } from '../commands';
import type ThemeEngine from '../main';

type HotkeyEntry = { modifiers: string[]; key: string };

export const LEGACY_PLUGIN_IDS = [
  'obsidian-theme-engine',
  'color-master',
  'obsidian-color-master',
] as const;
const LEGACY_COMMAND_PLUGIN_IDS = [
  'obsidian-theme-engine',
  'color-master',
  'obsidian-color-master',
] as const;
export const CURRENT_PLUGIN_ID = 'theme-engine';

const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const normalizeHotkeyArray = (value: unknown): HotkeyEntry[] => {
  const normalized: HotkeyEntry[] = [];
  const seen = new Set<string>();

  if (!Array.isArray(value)) {
    return normalized;
  }

  for (const item of value) {
    if (!isObjectRecord(item)) continue;

    const keyRaw = item.key;
    if (typeof keyRaw !== 'string' || keyRaw.trim() === '') continue;

    const modifiersRaw = item.modifiers;
    const modifiers = Array.isArray(modifiersRaw)
      ? modifiersRaw.filter((modifier): modifier is string => typeof modifier === 'string')
      : [];

    const entry = { modifiers, key: keyRaw };
    const signature = JSON.stringify(entry);

    if (seen.has(signature)) continue;
    seen.add(signature);
    normalized.push(entry);
  }

  return normalized;
};

const mergeHotkeyArrays = (currentValue: unknown, legacyValue: unknown): HotkeyEntry[] => {
  const merged = [...normalizeHotkeyArray(currentValue), ...normalizeHotkeyArray(legacyValue)];
  const deduped: HotkeyEntry[] = [];
  const seen = new Set<string>();

  for (const entry of merged) {
    const signature = JSON.stringify(entry);
    if (seen.has(signature)) continue;
    seen.add(signature);
    deduped.push(entry);
  }

  return deduped;
};

const writeJsonWithBackup = async (
  plugin: ThemeEngine,
  path: string,
  backupPath: string,
  data: unknown,
): Promise<void> => {
  const adapter = plugin.app.vault.adapter;

  if (!(await adapter.exists(backupPath)) && (await adapter.exists(path))) {
    const currentRaw = await adapter.read(path);
    await adapter.write(backupPath, currentRaw);
  }

  await adapter.write(path, JSON.stringify(data, null, 2));
};

export const migrateLegacyPluginDataIfNeeded = async (
  plugin: ThemeEngine,
): Promise<{
  migrated: boolean;
  sourcePath?: string;
}> => {
  let currentData: unknown = null;

  try {
    currentData = await plugin.loadData();
  } catch (error) {
    console.warn('Theme Engine: Failed to read current plugin data before migration.', error);
  }

  if (isObjectRecord(currentData) && Object.keys(currentData).length > 0) {
    return { migrated: false };
  }

  const adapter = plugin.app.vault.adapter;
  const pluginsDir = `${plugin.app.vault.configDir}/plugins`;

  for (const legacyPluginId of LEGACY_PLUGIN_IDS) {
    const sourcePath = `${pluginsDir}/${legacyPluginId}/data.json`;

    try {
      if (!(await adapter.exists(sourcePath))) continue;

      const raw = await adapter.read(sourcePath);
      const parsed = JSON.parse(raw) as unknown;
      if (!isObjectRecord(parsed)) {
        console.warn(
          `Theme Engine: Legacy data at "${sourcePath}" is not an object. Skipping migration source.`,
        );
        continue;
      }

      const migratedSettings: Record<string, unknown> = { ...parsed };
      migratedSettings.idMigration = {
        from: legacyPluginId,
        to: CURRENT_PLUGIN_ID,
        at: new Date().toISOString(),
        sourcePath,
      };

      await plugin.saveData(migratedSettings);
      console.debug(`Theme Engine: Migrated settings data from "${sourcePath}".`);
      return { migrated: true, sourcePath };
    } catch (error) {
      console.warn(`Theme Engine: Failed to migrate data from "${sourcePath}".`, error);
    }
  }

  return { migrated: false };
};

export const migrateLegacyHotkeysIfNeeded = async (plugin: ThemeEngine): Promise<boolean> => {
  const adapter = plugin.app.vault.adapter;
  const configDir = plugin.app.vault.configDir;
  const hotkeysPath = `${configDir}/hotkeys.json`;
  const backupPath = `${configDir}/hotkeys.${CURRENT_PLUGIN_ID}-id-migration.bak.json`;

  try {
    if (!(await adapter.exists(hotkeysPath))) return false;

    const raw = await adapter.read(hotkeysPath);
    const parsed = JSON.parse(raw) as unknown;
    if (!isObjectRecord(parsed)) return false;

    const hotkeyMap = parsed;
    let changed = false;

    for (const suffix of PLUGIN_COMMAND_SUFFIXES) {
      const newCommandId = `${CURRENT_PLUGIN_ID}:${suffix}`;
      const currentValue = hotkeyMap[newCommandId];
      const normalizedCurrent = normalizeHotkeyArray(currentValue);
      let merged: HotkeyEntry[] = normalizedCurrent;

      for (const legacyCommandPluginId of LEGACY_COMMAND_PLUGIN_IDS) {
        const oldCommandId = `${legacyCommandPluginId}:${suffix}`;
        const legacyValue = hotkeyMap[oldCommandId];

        if (typeof legacyValue === 'undefined') continue;

        merged = mergeHotkeyArrays(merged, legacyValue);
        delete hotkeyMap[oldCommandId];
        changed = true;
      }

      if (JSON.stringify(normalizedCurrent) !== JSON.stringify(merged)) {
        hotkeyMap[newCommandId] = merged;
        changed = true;
      }
    }

    if (!changed) return false;

    await writeJsonWithBackup(plugin, hotkeysPath, backupPath, hotkeyMap);
    console.debug(
      `Theme Engine: Migrated hotkeys from legacy namespaces to "${CURRENT_PLUGIN_ID}:*".`,
    );
    return true;
  } catch (error) {
    console.warn('Theme Engine: Failed to migrate hotkeys.', error);
    return false;
  }
};

export const migrateCommunityPluginListIfNeeded = async (plugin: ThemeEngine): Promise<boolean> => {
  const adapter = plugin.app.vault.adapter;
  const configDir = plugin.app.vault.configDir;
  const listPath = `${configDir}/community-plugins.json`;
  const backupPath = `${configDir}/community-plugins.${CURRENT_PLUGIN_ID}-id-migration.bak.json`;

  try {
    if (!(await adapter.exists(listPath))) return false;

    const raw = await adapter.read(listPath);
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return false;

    const entries = parsed.filter((entry): entry is string => typeof entry === 'string');
    let changed = entries.length !== parsed.length;
    const updatedEntries: string[] = [];
    let hasCurrentId = false;

    for (const entry of entries) {
      if (entry === CURRENT_PLUGIN_ID) {
        if (!hasCurrentId) {
          updatedEntries.push(entry);
          hasCurrentId = true;
        } else {
          changed = true;
        }
        continue;
      }

      if (LEGACY_PLUGIN_IDS.some((legacyId) => legacyId === entry)) {
        if (!hasCurrentId) {
          updatedEntries.push(CURRENT_PLUGIN_ID);
          hasCurrentId = true;
        }
        changed = true;
        continue;
      }

      updatedEntries.push(entry);
    }

    if (!changed) return false;

    await writeJsonWithBackup(plugin, listPath, backupPath, updatedEntries);
    console.debug(
      `Theme Engine: Migrated community plugin list entry from legacy IDs to "${CURRENT_PLUGIN_ID}".`,
    );
    return true;
  } catch (error) {
    console.warn('Theme Engine: Failed to migrate community plugin list.', error);
    return false;
  }
};
