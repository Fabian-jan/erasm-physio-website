// @ts-check
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default defineConfig(
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'test-results/**',
      'playwright-report/**',
      '.lighthouseci/**',
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginAstro.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    // Config Node.js (fichiers de config à la racine + tests Playwright/Vitest, exécutés
    // côté Node, jamais dans le navigateur — les îlots React auront leur propre contexte
    // browser le jour où ils apparaîtront, cf. E1-US4).
    languageOptions: {
      globals: { ...globals.node },
    },
  },
);
