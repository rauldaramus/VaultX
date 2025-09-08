import nx from '@nx/eslint-plugin';
import importPlugin from 'eslint-plugin-import';

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
      '**/middleware-build-manifest.js'
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
      '*.jsx'
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
      '*.ts',
      '*.tsx',
      '*.js',
      '*.jsx'
    ],
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Code quality rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'off', // Handled by TypeScript
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // Import rules
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

      // Best practices
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
    },
  },
];
