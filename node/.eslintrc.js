module.exports = {
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  env: {
    node: true,
    commonjs: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  extends: ['eslint:recommended', 'airbnb-base', 'plugin:security/recommended'],
  plugins: ['promise', 'jsdoc', 'security', 'import', 'promise', 'prettier'],
  rules: {
    indent: ['error'],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    semi: ['error', 'always'],
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
    'comma-dangle': [
      'error',
      {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }
    ],
    'max-len': [
      'warn',
      {
        code: 120
      }
    ],
    'no-underscore-dangle': 0,
    'no-await-in-loop': 'off',
    'no-console': 'error',
    'promise/always-return': 'error',
    'promise/no-return-wrap': 'error',
    'promise/param-names': 'error',
    'promise/catch-or-return': 'error',
    'promise/no-native': 'off',
    'promise/no-nesting': 'error',
    'promise/no-promise-in-callback': 'error',
    'promise/no-callback-in-promise': 'error',
    'promise/no-return-in-finally': 'error',
    'prefer-arrow-callback': 'error',
    'jsdoc/check-alignment': 1, // Recommended
    'jsdoc/check-examples': 1,
    'jsdoc/check-indentation': 1,
    'jsdoc/check-param-names': 1, // Recommended
    'jsdoc/check-syntax': 1,
    'jsdoc/check-tag-names': 1, // Recommended
    'jsdoc/check-types': 1, // Recommended
    'jsdoc/implements-on-classes': 1, // Recommended
    'jsdoc/match-description': 1,
    'jsdoc/newline-after-description': 1, // Recommended
    'jsdoc/no-types': 1,
    'jsdoc/no-undefined-types': 1, // Recommended
    'jsdoc/require-description': 0,
    'jsdoc/require-description-complete-sentence': 1,
    'jsdoc/require-example': 0,
    'jsdoc/require-hyphen-before-param-description': 1,
    'jsdoc/require-jsdoc': 1, // Recommended
    'jsdoc/require-param': 1, // Recommended
    'jsdoc/require-param-description': 1, // Recommended
    'jsdoc/require-param-name': 1, // Recommended
    'jsdoc/require-param-type': 0, // Recommended
    'jsdoc/require-returns': 1, // Recommended
    'jsdoc/require-returns-check': 1, // Recommended
    'jsdoc/require-returns-description': 1, // Recommended
    'jsdoc/require-returns-type': 0, // Recommended
    'jsdoc/valid-types': 1 // Recommended
  }
};
