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
    };
  };
}

export interface PluginSettings {
  noticeRules?: any; // To handle old settings structure during migration
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
