//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

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
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  {
    rules: {
      "import/order": "off", // Use VS Code "Organize Imports" command instead
      "@typescript-eslint/array-type": ["error", { default: "array" }],
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "react/no-unescaped-entities": "off",
    },
  },
]);
