import nx from '@nx/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
// Note: Next's ESLint config already provides 'import' for the web app.
// We only register it for api/libs to avoid plugin redefinition.

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/build',
      '**/.next',
      '**/node_modules',
      '**/coverage',
      '**/.nx',
      '**/tmp',
      '**/temp',
      '**/*.min.js',
      '**/vendor-chunks',
      '**/middleware-build-manifest.js',
    ],
  },
  {
    files: [
      'apps/**/*.ts',
      'apps/**/*.tsx',
      'apps/**/*.js',
      'apps/**/*.jsx',
      'libs/**/*.ts',
      'libs/**/*.tsx',
      'libs/**/*.js',
      'libs/**/*.jsx',
      '*.ts',
      '*.tsx',
      '*.js',
      '*.jsx',
    ],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  // Provide 'import' plugin for API and shared libs only (not for web)
  {
    files: [
      'libs/**/*.ts',
      'libs/**/*.tsx',
      'libs/**/*.cts',
      'libs/**/*.mts',
      'libs/**/*.js',
      'libs/**/*.jsx',
      'libs/**/*.cjs',
      'libs/**/*.mjs',
      'apps/vaultx-api/**/*.ts',
      'apps/vaultx-api/**/*.tsx',
      'apps/vaultx-api/**/*.cts',
      'apps/vaultx-api/**/*.mts',
      'apps/vaultx-api/**/*.js',
      'apps/vaultx-api/**/*.jsx',
      'apps/vaultx-api/**/*.cjs',
      'apps/vaultx-api/**/*.mjs',
    ],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  {
    files: [
      'apps/**/*.ts',
      'apps/**/*.tsx',
      'apps/**/*.cts',
      'apps/**/*.mts',
      'apps/**/*.js',
      'apps/**/*.jsx',
      'apps/**/*.cjs',
      'apps/**/*.mjs',
      'libs/**/*.ts',
      'libs/**/*.tsx',
      'libs/**/*.cts',
      'libs/**/*.mts',
      'libs/**/*.js',
      'libs/**/*.jsx',
      'libs/**/*.cjs',
      'libs/**/*.mjs',
      '*.ts',
      '*.tsx',
      '*.js',
      '*.jsx',
    ],
    rules: {
      // Code quality rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'off', // Handled by TypeScript
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // Best practices
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
    },
  },
  {
    files: ['apps/**/next-env.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
];
