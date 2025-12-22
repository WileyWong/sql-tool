/** 代替 JS 规则 camelCase 的 TS 规则 */

module.exports = {
  rules: {
    '@typescript-eslint/naming-convention': ['warn',
      // 函数可以使用驼峰
      // FIXME: #197 为了兼容 React 函数组件允许使用 PascalCase，但在未来 React 规则推出后将删除
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
      },
      // 内部变量使用驼峰法
      // FIXME: 因为 types 没有单独的对象参数，所以这里将 UPPPER_CASE 也加入了内部变量允许的写法，这样才能允许导出对象时使用 UPPER_CASE
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
      },
      // 全局对象各种写法都可以支持，以应对不同类库的支持
      {
        selector: 'variable',
        modifiers: ['global'],
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      },
      // 函数引用使用驼峰法、或者首字母大写（React 组件）
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase'],
        types: ['function'],
      },
      // 导出的布尔值，字符串、数字、数组使用全大写，下划线分割单词
      {
        selector: 'variable',
        modifiers: ['exported'],
        format: ['UPPER_CASE'],
        types: ['boolean', 'string', 'number', 'array'],
      },
      // 导出的 function 使用 camelCase
      {
        selector: 'variable',
        modifiers: ['exported'],
        format: ['camelCase', 'PascalCase'],
        types: ['function'],
      },
      // 类名和类型定义使用首字母大写
      {
        selector: ['class', 'typeLike'],
        format: ['PascalCase'],
      },

      // TODO: 增加 selector: 'property' 的 camelCase 限制，但目前 React 的 dangerouslySetInnerHTML 参数需要 __html 所以暂时不加

      // 类成员方法使用驼峰法，并阻止使用下划线开头和结尾
      {
        selector: ['classMethod', 'classProperty'],
        leadingUnderscore: 'forbid', // 阻止使用下划线开始
        trailingUnderscore: 'forbid', // 阻止使用下划线结尾
        format: ['camelCase'],
      },
    ],
  },
};
