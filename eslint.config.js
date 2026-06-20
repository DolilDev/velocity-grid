// ESLint flat config (ESLint 9+). Lints the vanilla ES modules in js/.
import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'no-unused-vars': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
  {
    // The build tooling config itself runs in Node, not the browser.
    files: ['eslint.config.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
];
