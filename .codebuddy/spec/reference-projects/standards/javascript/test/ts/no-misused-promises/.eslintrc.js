module.exports = {
  rules: {
    /**
     * 禁止对 promise 的误用，详见示例
     */
    '@typescript-eslint/no-misused-promises': ['error', {
      checksConditionals: true,
    }],
  },
};
