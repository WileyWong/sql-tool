/**
 * Monaco Editor 主题配置
 * 
 * 此模块负责管理 Monaco Editor 的自定义主题
 * 便于后续扩展和用户自定义
 */
import * as monaco from 'monaco-editor'

// 主题名称常量
export const THEME_SQL_DARK = 'sql-dark'

/**
 * 主题颜色配置
 * 便于后续扩展为用户可配置
 */
export const themeColors = {
  /** 字符串颜色（橙色） */
  string: 'f5b801',
}

/**
 * 主题 token 规则
 * 定义各种语法元素的颜色
 */
export const themeRules: monaco.editor.ITokenThemeRule[] = [
  { token: 'string.sql', foreground: themeColors.string },
  { token: 'string', foreground: themeColors.string },
]

/**
 * 主题 UI 颜色配置
 * 定义编辑器 UI 元素的颜色（如背景、边框等）
 */
export const themeEditorColors: monaco.editor.IColors = {}

/**
 * 注册自定义 SQL 暗色主题
 * 基于 vs-dark 主题，覆盖特定样式
 */
export function registerSqlDarkTheme(): void {
  monaco.editor.defineTheme(THEME_SQL_DARK, {
    base: 'vs-dark',
    inherit: true,
    rules: themeRules,
    colors: themeEditorColors,
  })
}

/**
 * 获取默认主题名称
 */
export function getDefaultTheme(): string {
  return THEME_SQL_DARK
}
