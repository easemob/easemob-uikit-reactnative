import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { defineConfig } from 'eslint/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    extends: fixupConfigRules(compat.extends('@react-native', 'prettier')),
    plugins: { prettier, 'simple-import-sort': simpleImportSort },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'react-native/no-inline-styles': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'prettier/prettier': 'error',
    },
  },
  {
    ignores: ['node_modules/', 'lib/'],
  },
]);
