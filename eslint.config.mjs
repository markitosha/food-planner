import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next'),
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'plugin:@next/next/recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
      'plugin:prettier/recommended',
      'plugin:import/recommended',
      'plugin:jsx-a11y/recommended',
    ],
    rules: {
      'prettier/prettier': ['error', { singleQuote: true }],
      'import/no-unresolved': 'off',
      'jsx-a11y/ no-static-element-interactions': 'warn',
    },
  })
];

export default eslintConfig;
