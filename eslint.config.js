// eslint.config.js
// Configuration for ESLint: which files to check and which rules to apply.
// Run it with:  npm run lint

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]), // never lint the production build output
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended, // JavaScript best practices (undefined vars, unused vars...)
      reactHooks.configs.flat["recommended-latest"], // React hook rules (react/rules-of-hooks)
      reactRefresh.configs.vite, // warns when a file exports non-components
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser, // browser objects: window, document, localStorage...
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true }, // allows ESLint to parse JSX
        sourceType: "module",
      },
    },
    rules: {
      // AuthContext.jsx exports a hook next to a component. That only affects
      // hot reload behaviour, so we report it as a warning instead of an error.
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
]);
