module.exports = {
  files: ['**/*.ts', '**/*.tsx'],
  rules: {
    'brace-style': 'off',
    'no-empty-function': 'off',
    // https://github.com/typescript-eslint/typescript-eslint/issues/491
    'no-invalid-this': 'off',
    'no-magic-numbers': 'off',
    'react/sort-comp': 'off',
    'func-call-spacing': 'off',
    'comma-spacing': 'off',
    'dot-notation': ['off', {}],
    indent: 'off',
    'keyword-spacing': 'off',
    camelcase: 'off',
    'no-underscore-dangle': 'off',
    'no-array-constructor': 'off',
    'no-dupe-class-members': 'off',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-useless-constructor': 'off',
    quotes: 'off',
    semi: 'off',
    'space-before-function-paren': 'off',
    // https://git.woa.com/standards/javascript/issues/199
    // https://github.com/typescript-eslint/typescript-eslint/issues/600
    'spaced-comment': ['error', 'always', { markers: ['/'] }]
  },
};
