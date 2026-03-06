// @ts-check

import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    ignores: [
      'dist',
      'node_modules',
      'tsconfig.json',
      '.prettier*',
      'eslint.config.mjs',
      'jest.config.ts',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        // tsconfigRootDir: import.meta.dirname
      },
    },
  },
  {
    rules: {
      'dot-notation': 'error',
      'no-unused-vars': 'off',
      "@typescript-eslint/no-unused-vars": ["error"]
    },
  },
  {
    files: ['test/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
)
