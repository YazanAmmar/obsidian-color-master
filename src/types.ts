export type CustomVarType = "color" | "size" | "text" | "number";

export interface Snippet {
  id: string;
  name: string;
  css: string;
  enabled: boolean;
  isGlobal?: boolean;
}

export interface NoticeRule {
  id: string;
  keywords: string;
  color: string;
  isRegex: boolean;
}

export interface Profile {
  vars: { [key: string]: string };
  themeType: "auto" | "dark" | "light";
  snippets: Snippet[];
  isCssProfile?: boolean;
  customCss?: string;
  noticeRules?: {
    text: NoticeRule[];
    background: NoticeRule[];
  };
  history?: { [key: string]: string[] };
  customVarMetadata?: {
    [key: string]: {
      name: string;
      desc: string;
      type: CustomVarType;
    };
  };
  backgroundPath?: string;
  backgroundType?: "image" | "video";
  videoOpacity?: number;
  videoMuted?: boolean;
  backgroundEnabled?: boolean;
  convertImagesToJpg?: boolean;
  jpgQuality?: number;
}

export interface PluginSettings {
  lastSearchQuery?: string;
  lastScrollPosition?: number;
  noticeRules?: any;
  pluginEnabled: boolean;
  language: string;
  overrideIconizeColors: boolean;
  cleanupInterval: number;
  colorUpdateFPS: number;
  activeProfile: string;
  profiles: { [key: string]: Profile };
  globalSnippets: Snippet[];
  pinnedSnapshots: { [key: string]: any };
  useRtlLayout: boolean;
  installDate?: string;
}
