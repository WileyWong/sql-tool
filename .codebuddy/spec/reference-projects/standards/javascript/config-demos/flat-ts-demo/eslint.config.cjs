const tencentEslintConfig = require('@tencent/eslint-config-tencent/flat');

const configs = tencentEslintConfig({
  tsconfigRootDir: __dirname,
});

module.exports = configs;
