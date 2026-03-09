const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettier = require('eslint-plugin-prettier');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    plugins: { prettier },
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-empty-pattern': 'off',
      'no-unused-expressions': 'off',
      'react/display-name': 'error',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-useless-constructor': 'off',
      'prettier/prettier': 'error',
    },
  },
]);
