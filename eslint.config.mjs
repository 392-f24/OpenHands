import { zlAsicaTsReactConfig } from 'eslint-config-zl-asica';

export default [
  ...zlAsicaTsReactConfig,
  {
    ignores: [
      'vite-env.d.ts',
      'prettier.config.cjs',
      'eslint.config.mjs',
      'dist',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.app.json',
      },
    },
    rules: {
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'unicorn/prefer-string-replace-all': 'off',
    },
  },
];
