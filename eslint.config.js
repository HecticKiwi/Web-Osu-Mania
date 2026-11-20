// @ts-check
import eslintReact from "@eslint-react/eslint-plugin";
import { tanstackConfig } from "@tanstack/eslint-config";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: [
      "dist/**",
      "wrangler/**",
      "node_modules/**",
      "src/components/ui/**",
      "worker-configuration.d.ts",
      "cloudflare-env.d.ts",
      "postcss.config.js",
    ],
  },
  ...tanstackConfig,
  reactHooks.configs.flat.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    extends: [eslintReact.configs["recommended-typescript"]],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: null,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "import/order": "off", // Use VS Code "Organize Imports" command instead
      "@typescript-eslint/array-type": ["error", { default: "array" }],
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@eslint-react/no-array-index-key": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);
