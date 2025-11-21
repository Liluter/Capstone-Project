import {defineConfig} from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import sonarjs from "eslint-plugin-sonarjs";
import html from "@html-eslint/eslint-plugin";

export default defineConfig([
	{
		files: ["**/*.js"],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			globals: globals.browser,
		},
		extends: [js.configs.recommended, sonarjs.configs.recommended],
		rules: {
			"no-unused-vars": "error",
			"no-unused-expressions": "error",
			"for-direction": "error",
			"sonarjs/pseudo-random": "off",
		},
	},
	{
		files: ["**/*.html"],
		ignores: ["src/html/temp/**"],
		plugins: {
			html,
		},
		extends: ["html/recommended"],
		language: "html/html",
		rules: {
			"html/no-duplicate-class": "error",
			"html/indent": "off",
			"html/attrs-newline": "off",
			"html/require-closing-tags": ["error", {selfClosing: "always"}],
			"html/no-extra-spacing-attrs": ["off", {enforceBeforeSelfClose: false}],
		},
	},
]);
