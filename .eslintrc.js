module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
    'cypress/globals': true,
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
    'arrow-parens': ['error', 'as-needed'],
    'arrow-spacing': ['error', { before: true, after: true }],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'only-multiline',
        exports: 'only-multiline',
        functions: 'never',
      },
    ],
    'eol-last': ['error', 'always'],
    eqeqeq: 'error',
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'no-console': 'error',
    'no-param-reassign': ['error', { props: false }],
    'no-trailing-spaces': 'error',
    'no-underscore-dangle': ['error', { allow: ['_id', '__v'] }],
    'object-curly-spacing': ['error', 'always'],
    quotes: ['error', 'single'],
    'react/prop-types': 0,
    semi: ['error', 'always', { omitLastInOneLineBlock: true }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
