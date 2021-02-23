module.exports = {
  env: {
    browser: true,
    es6: true,
    'jest/globals': true,
    "cypress/globals": true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'jest', 'cypress'],
  rules: {
    eqeqeq: 'error',
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always', { omitLastInOneLineBlock: true }],
    'arrow-spacing': ['error', { before: true, after: true }],
    'linebreak-style': ['error', 'unix'],
    'no-console': 0,
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'react/prop-types': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
