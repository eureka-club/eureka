module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint', // disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // display prettier errors as ESLint errors. Make sure this is always the last configuration!
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // type is enforced by callers, not entirely, but it's good enough
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_$', varsIgnorePattern: '^_$' }],
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }], // enforce arrow functions only is afaik not possible - this helps
    'import/extensions': ['error', 'never'],
    'import/prefer-default-export': 'off',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'lines-between-class-members': 'off', // this is fine
    'no-nested-ternary': 'off', // they are fine sometimes
    'no-shadow': 'off', // shadowing is a nice language feature
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }], // fix for TypeScript
    'react/jsx-uses-react': 'off', // not needed since new JSX transform
    'react/no-multi-comp': 'off', // it's fine
    'react/prop-types': 'off', // we have types
    'react/react-in-jsx-scope': 'off', // not needed since new JSX transform
  },
};
