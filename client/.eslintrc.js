module.exports = {
  root: true,
  plugins: ['import'],
  ignorePatterns: ['src/**/*.spec.ts'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  overrides: [
    {
      files: ['src/**/*.ts'],
      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true,
        tsconfigRootDir: __dirname,
      },
      extends: [
        'airbnb-typescript/base',
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:prettier/recommended',
      ],
      rules: {
        '@angular-eslint/component-selector': [
          'error',
          {
            prefix: 'app',
            style: 'kebab-case',
            type: 'element',
          },
        ],
        '@angular-eslint/directive-selector': [
          'error',
          {
            prefix: 'app',
            style: 'camelCase',
            type: 'attribute',
          },
        ],
        '@angular-eslint/use-lifecycle-interface': ['off'],
        '@typescript-eslint/dot-notation': ['off'],
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          {
            overrides: {
              constructors: 'off',
            },
          },
        ],
        '@typescript-eslint/lines-between-class-members': ['off'],
        '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
        'import/no-unresolved': ['error', { caseSensitive: false }],
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'no-unused-vars': ['off'],
        'prettier/prettier': [
          'error',
          {
            endOfLine: 'auto',
          },
        ],
      },
    },
    {
      files: ['src/**/*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {},
    },
  ],
};
