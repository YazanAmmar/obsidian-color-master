import { DEFAULT_VARS } from "../../constants";
import { t } from "../../i18n";
import { flattenVars } from "../../utils";
import type { ColorMasterSettingTab } from "../settingsTab";

function createStatBar(
  parentEl: HTMLElement,
  label: string,
  value: number,
  max: number
) {
  const skillBox = parentEl.createDiv("cm-stat-box");
  const header = skillBox.createDiv("cm-stat-header");
  header.createEl("span", { cls: "title", text: label });
  header.createEl("span", { cls: "value", text: String(value) });
  const skillBar = skillBox.createDiv("skill-bar");
  const percentage = Math.min(100, Math.round((value / max) * 100));
  const skillPer = skillBar.createEl("span", {
    cls: "skill-per cm-skill-gradient",
  });
  skillPer.style.setProperty("--skill-percentage", `${percentage}%`);
}

function calcProfilesCount(settingTab: ColorMasterSettingTab): number {
  return Object.keys(settingTab.plugin.settings.profiles || {}).length;
}

function calcSnippetsCount(settingTab: ColorMasterSettingTab): number {
  const settings = settingTab.plugin.settings;
  const profiles = settings.profiles || {};

  let totalSnippets = settings.globalSnippets
    ? settings.globalSnippets.length
    : 0;

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
    settingTab.plugin.settings.profiles[
      settingTab.plugin.settings.activeProfile
    ];
  if (activeProfile && activeProfile.vars) {
    Object.keys(activeProfile.vars).forEach((varName) => allVars.add(varName));
  }
  return allVars.size;
}

function calcPluginIntegrations(): number {
  try {
    if (DEFAULT_VARS && DEFAULT_VARS["Plugin Integrations"]) {
      return Object.keys(DEFAULT_VARS["Plugin Integrations"]).length;
    }
  } catch (e) {
    console.error("Color Master: Failed to calculate plugin integrations.", e);
  }
  return 0;
}

export function drawLikePluginCard(
  containerEl: HTMLElement,
  settingTab: ColorMasterSettingTab
) {
  const likeCardEl = containerEl.createDiv("cm-like-card");
  const bannerContainer = likeCardEl.createDiv("cm-banner-container");
  const bannerSvgString = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="240" viewBox="0 0 1280 240" role="img" aria-label="Color Master banner" class="cm-banner-svg">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#0066FF"/> <stop offset="14%" stop-color="#7A00FF"/> <stop offset="28%" stop-color="#FF1E56"/>
      <stop offset="42%" stop-color="#FF3EB5"/> <stop offset="56%" stop-color="#FF7A00"/> <stop offset="70%" stop-color="#FFD200"/>
      <stop offset="84%" stop-color="#00D166"/> <stop offset="100%" stop-color="#00C2FF"/>
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="6" dy="6" stdDeviation="6" flood-color="#000" flood-opacity="0.45"/>
    </filter>
    <filter id="blackEdge" x="-200%" y="-200%" width="400%" height="400%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2.0" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" result="edge"/>
      <feMerge> <feMergeNode in="edge"/> <feMergeNode in="SourceGraphic"/> </feMerge>
    </filter>
  </defs>
  <rect width="1280" height="240" rx="16" ry="16" fill="url(#g)"/>
  <g filter="url(#shadow)">
    <text x="50%" y="55%" text-anchor="middle" font-family="Montserrat, 'Poppins', Arial, sans-serif" font-weight="800" font-size="110" fill="#000000" opacity="0.85" font-style="normal" stroke="none" > Color Master </text>
    <text x="50%" y="55%" text-anchor="middle" font-family="Montserrat, 'Poppins', Arial, sans-serif" font-weight="800" font-size="110" fill="#FFFFFF" stroke="#000000" stroke-width="4.2" stroke-linejoin="round" paint-order="stroke fill" font-style="normal" filter="url(#blackEdge)"> Color Master </text>
  </g>
  <text x="50%" y="74%" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="18" fill="#FFFFFF" opacity="0.95"> Theme your Obsidian — edit, save &amp; share color profiles </text>
  <text x="50%" y="84%" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="18" fill="#FFFFFF" opacity="0.95"> Color Master for Obsidian — control themes &amp; color schemes </text>
</svg>`;

  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(bannerSvgString, "image/svg+xml");
  const svgElement = svgDoc.documentElement;

  bannerContainer.appendChild(svgElement);

  const contentWrapper = likeCardEl.createDiv("cm-content-wrapper");

  const statsContainer = contentWrapper.createDiv("cm-like-stats");
  const profilesCount = calcProfilesCount(settingTab);
  const snippetsCount = calcSnippetsCount(settingTab);
  const sinceInstalled =
    settingTab.plugin.settings.installDate || new Date().toISOString();
  const days = Math.max(
    1,
    Math.floor(
      (Date.now() - new Date(sinceInstalled).getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  createStatBar(
    statsContainer,
    t("LIKE_CARD_PROFILES_STAT", profilesCount, snippetsCount),
    profilesCount + snippetsCount,
    50
  );
  createStatBar(
    statsContainer,
    t("LIKE_CARD_COLORS_STAT"),
    calcVarsCount(settingTab),
    calcVarsCount(settingTab)
  );
  createStatBar(
    statsContainer,
    t("LIKE_CARD_INTEGRATIONS_STAT"),
    calcPluginIntegrations(),
    5
  );
  createStatBar(statsContainer, t("LIKE_CARD_DAYS_STAT"), days, 365);

  const actions = contentWrapper.createDiv("cm-like-actions");
  const starButtonWrapper = actions.createDiv({ cls: "codepen-button" });
  starButtonWrapper.createEl("span", { text: t("LIKE_CARD_STAR_BUTTON") });
  starButtonWrapper.addEventListener("click", () => {
    window.open(
      "https://github.com/YazanAmmar/obsidian-color-master",
      "_blank"
    );
  });

  const reportButtonWrapper = actions.createDiv({ cls: "codepen-button" });
  reportButtonWrapper.createEl("span", { text: t("LIKE_CARD_ISSUE_BUTTON") });
  reportButtonWrapper.addEventListener("click", () => {
    window.open(
      "https://github.com/YazanAmmar/obsidian-color-master/issues",
      "_blank"
    );
  });

  const syncPromoContainer = actions.createDiv({ cls: "cm-promo-container" });
  const syncButtonWrapper = syncPromoContainer.createDiv({
    cls: "codepen-button",
  });
  syncButtonWrapper.createEl("span", { text: t("LIKE_CARD_SYNC_BUTTON") });
  syncButtonWrapper.addEventListener("click", () => {
    window.open("https://github.com/YazanAmmar/SyncEveryThing", "_blank");
  });

  const myGithubButtonWrapper = actions.createDiv({ cls: "codepen-button" });
  myGithubButtonWrapper.createEl("span", {
    text: t("LIKE_CARD_TELEGRAM_CHANNEL_BUTTON"),
  });
  myGithubButtonWrapper.addEventListener("click", () => {
    window.open("https://t.me/ObsidianColorMaster", "_blank");
  });
}
