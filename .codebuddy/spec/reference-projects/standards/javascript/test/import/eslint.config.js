const { rules } = require('eslint-plugin-import');

module.exports = {
  plugins: {
    import: {
      meta: { name: 'eslint-plugin-import' },
      rules,
    },
  },
  files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
  languageOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
};
