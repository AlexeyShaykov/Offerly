import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const layerImportRule = (forbiddenLayers) => ({
  'no-restricted-imports': [
    'error',
    {
      patterns: forbiddenLayers.map((layer) => ({
        group: [`@/${layer}`, `@/${layer}/*`],
        message: `Lower FSD layers must not import from "${layer}" (app → features → entities → shared).`,
      })),
    },
  ],
});

const config = [
  { ignores: ['.next/**', '.next-e2e/**', 'node_modules/**', 'next-env.d.ts', 'src/generated/**'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': 'error',
    },
  },
  { files: ['src/shared/**/*.{ts,tsx}'], rules: layerImportRule(['app', 'features', 'entities']) },
  { files: ['src/entities/**/*.{ts,tsx}'], rules: layerImportRule(['app', 'features']) },
  { files: ['src/features/**/*.{ts,tsx}'], rules: layerImportRule(['app']) },
];

export default config;
