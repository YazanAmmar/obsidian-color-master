import js from "@eslint/js";
import tseslint from "typescript-eslint";
import obsidianmd from "eslint-plugin-obsidianmd";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "dist/",
      "build/",
      "main.js",
      "styles.css",
      "*.min.js",
      "**/*.scss",
      "esbuild.config.mjs",
      "node_modules/",
      ".git/",
    ],
  },

  js.configs.recommended,
  ...obsidianmd.configs.recommended,

  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "no-console": ["error", { allow: ["warn", "error", "debug"] }],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "obsidianmd/hardcoded-config-path": "error",
      "obsidianmd/ui/sentence-case": "warn",
      "obsidianmd/no-forbidden-elements": "error",
      "@typescript-eslint/await-thenable": "error",

      "@typescript-eslint/no-unsafe-function-type": "error",
      "obsidianmd/settings-tab/no-manual-html-headings": "error",

      "prefer-spread": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/no-this-alias": "error",
      "obsidianmd/no-static-styles-assignment": "error",

      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^T$" },
      ],
      "no-restricted-globals": [
        "error",
        {
          name: "fetch",
          message: "Use requestUrl from 'obsidian' instead.",
        },
      ],
    },
  }
);
