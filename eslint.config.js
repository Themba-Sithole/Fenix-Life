import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

/** Import boundaries per docs/28_Project_Architecture.md §8 */
const boundaryRules = {
  'import/no-restricted-paths': [
    'error',
    {
      zones: [
        {
          target: './packages/**',
          from: './apps/**',
          message: 'Packages must not import from apps (dependencies point inward).',
        },
        {
          target: './packages/domain/**',
          from: ['./packages/simulation-engine/**', './packages/api-contracts/**'],
          message: 'Domain package must remain framework-free and not depend on other packages yet.',
        },
      ],
    },
  ],
};

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
  {
    files: ['apps/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      ...boundaryRules,
    },
  },
);
