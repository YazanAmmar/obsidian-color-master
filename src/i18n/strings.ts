import type ColorMaster from "../main";
import type { PluginSettings } from "../types";
import type { LocaleStrings } from "./types";
import { DEFAULT_LOCALE, LocaleCode } from "./types";
import type { LocaleFunc } from "./types";
import arStrings from "./locales/ar";
import enStrings from "./locales/en";
import faStrings from "./locales/fa";
import frStrings from "./locales/fr";

let T: ColorMaster;

// Built-in languages
export const CORE_LOCALES: Record<LocaleCode, LocaleStrings> = {
  en: enStrings,
  ar: arStrings,
  fa: faStrings,
  fr: frStrings,
};

// Flat maps for O(1) lookups
let FALLBACK_STRINGS: Record<string, string | LocaleFunc> = {};
let ACTIVE_STRINGS: Record<string, string | LocaleFunc> = {};

// Called once on plugin load
export function initializeT(plugin: ColorMaster) {
  T = plugin;
  // Always load English as the safety net
  FALLBACK_STRINGS = flattenStrings(CORE_LOCALES[DEFAULT_LOCALE]);
  loadLanguage(plugin.settings);
}

// Switches the active language map based on settings
export function loadLanguage(settings: PluginSettings) {
  const langCode = settings.language as LocaleCode;
  const customLang = settings.customLanguages?.[langCode];

  if (CORE_LOCALES[langCode]) {
    console.debug(`Color Master: Loading core language "${langCode}"`);

    // Load the base strings first from the code
    const baseStrings = flattenStrings(CORE_LOCALES[langCode]);

    if (customLang && customLang.translations) {
      console.debug(
        `Color Master: Applying ${
          Object.keys(customLang.translations).length
        } overrides for "${langCode}"`,
      );
      ACTIVE_STRINGS = { ...baseStrings, ...customLang.translations };
    } else {
      ACTIVE_STRINGS = baseStrings;
    }
  } else if (customLang) {
    console.debug(`Color Master: Loading custom language "${langCode}"`);
    ACTIVE_STRINGS = customLang.translations;
  } else {
    console.debug(
      `Color Master: Language "${langCode}" not found, using default.`,
    );
    ACTIVE_STRINGS = FALLBACK_STRINGS;
  }
}

// Main translation helper
export const t = (key: string, ...args: (string | number)[]): string => {
  if (!T) {
    console.error("ColorMaster: 'T' is not initialized yet.");
    return key;
  }

  // Try active language first, then fallback to English
  let string = ACTIVE_STRINGS[key];

  if (string === undefined) {
    string = FALLBACK_STRINGS[key];
  }

  if (string === undefined) {
    console.warn(`ColorMaster: Missing translation for key: ${key}`);
    return key;
  }

  // Handle dynamic strings with arguments
  if (typeof string === "function") {
    return string(...args);
  }

  return string;
};

// Recursively flattens nested objects into dot-notation keys
export function flattenStrings(
  obj: Record<string, unknown>,
  parentKey = "",
  result: Record<string, string | LocaleFunc> = {},
): Record<string, string | LocaleFunc> {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      const value = obj[key];

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        typeof value !== "function"
      ) {
        flattenStrings(value, newKey, result);
      } else if (!Array.isArray(value)) {
        result[newKey] = value;
      }
    }
  }
  return result;
}

// Expose fallback strings for the editor modal
export function getFallbackStrings(): Record<string, string | LocaleFunc> {
  return FALLBACK_STRINGS;
}
