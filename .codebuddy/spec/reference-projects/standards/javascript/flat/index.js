const tseslint = require('typescript-eslint');
const base = require('./base.js');
const ts = require('./ts.js');
const importexport = require('./import.js');

module.exports = function tencentEslintConfig(options) {
  const namedConfigs = [
    {
      ...base,
      name: '@tencent/eslint-config-base',
    },
    {
      ...importexport,
      name: '@tencent/eslint-config-import-export',
    },
  ];

  if (options.tsconfigRootDir) {
    return tseslint.config(
      ...namedConfigs,
      tseslint.configs.base,
      {
        languageOptions: {
          parserOptions: {
            project: options.project || true,
            tsconfigRootDir: options.tsconfigRootDir,
          },
        },
        ...ts,
        name: '@tencent/eslint-config-ts',
      },
    );
  }

  return namedConfigs;
};
