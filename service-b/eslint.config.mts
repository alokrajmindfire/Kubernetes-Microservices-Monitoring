import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    ignores: ["dist", "node_modules"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
     "prefer-const": "warn",
      "no-constant-binary-expression": "error",
      "no-unused-vars": "warn",
      "no-undef": "error",
      "eqeqeq": "error",
      "indent": ["error", 2],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "no-console": "warn",
      "no-trailing-spaces": "error" 
    },
  },
  tseslint.configs.recommended,
]);
