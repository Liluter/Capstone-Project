import {defineConfig} from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import sonarjs from "eslint-plugin-sonarjs";

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
]);
