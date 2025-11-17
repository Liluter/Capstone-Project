// import {defineConfig} from "eslint/config";
// import globals from "globals";
// import js from "@eslint/js";
// import sonarjs from "eslint-plugin-sonarjs";

// export default defineConfig([
// 	{files: ["**/*.js"], languageOptions: {globals: globals.browser}},
// 	{
// 		files: ["**/*.js"],
// 		plugins: {js, sonarjs},
// 		extends: ["js/recommended", "plugin:sonarjs/recommended"],
// 	},

// 	{
// 		rules: {
// 			// Pokrywa S1481, S1854, S1068
// 			"no-unused-vars": "error",
// 			// Pokrywa S905, S1121
// 			"no-unused-expressions": "error",
// 			// Pokrywa S125 (musisz włączyć w SonarJS)
// 			// "sonarjs/no-commented-out-code": "error",
// 			// Pokrywa S1994
// 			"for-direction": "error",
// 		},
// 	},
// ]);
// eslint.config.js (Poprawna, scalona składnia)

import {defineConfig} from "eslint/config";

import globals from "globals";
import js from "@eslint/js";
import sonarjs from "eslint-plugin-sonarjs";

// Exportujemy bezpośrednio tablicę, co jest czystszą praktyką.
// Usunięcie defineConfig, jeśli powoduje błędy importu.

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
