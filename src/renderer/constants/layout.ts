/**
 * Layout Constants
 * 统一管理布局相关的常量，避免魔法数字
 */

// ============= 通用尺寸 =============

/** 标签页高度 */
export const TAB_HEIGHT = 32

/** 工具栏高度 */
export const TOOLBAR_HEIGHT = 40

/** 状态栏高度 */
export const STATUSBAR_HEIGHT = 24

/** 分隔线高度/宽度 */
export const DIVIDER_SIZE = 1

// ============= 输入框/选择器尺寸 =============

/** 小型输入框高度 */
export const INPUT_HEIGHT_SMALL = 28

/** 默认输入框高度 */
export const INPUT_HEIGHT_DEFAULT = 32

/** 小型选择器宽度 */
export const SELECT_WIDTH_SMALL = 80

/** 中等选择器宽度 */
export const SELECT_WIDTH_MEDIUM = 120

/** 默认选择器宽度 */
export const SELECT_WIDTH_DEFAULT = 180

/** 大型选择器宽度 */
export const SELECT_WIDTH_LARGE = 200

// ============= 弹窗/面板尺寸 =============

/** 小型弹窗最小宽度 */
export const DIALOG_MIN_WIDTH_SMALL = 400

/** 小型弹窗最大宽度 */
export const DIALOG_MAX_WIDTH_SMALL = 500

/** 下拉菜单最小宽度 */
export const DROPDOWN_MIN_WIDTH = 150

/** 子菜单最小宽度 */
export const SUBMENU_MIN_WIDTH = 180

/** 子菜单最大宽度 */
export const SUBMENU_MAX_WIDTH = 500

// ============= 树/列表尺寸 =============

/** 空状态区域高度 */
export const EMPTY_STATE_HEIGHT = 200

/** 过滤输入框宽度 */
export const FILTER_INPUT_WIDTH = 100

/** 过滤输入框高度 */
export const FILTER_INPUT_HEIGHT = 20

// ============= 表格/结果面板尺寸 =============

/** 表格行高度 */
export const TABLE_ROW_HEIGHT = 24

/** 列最小宽度 */
export const COLUMN_MIN_WIDTH = 100

/** 内容预览最大高度 */
export const CONTENT_PREVIEW_MAX_HEIGHT = 400

/** 表格管理对话框最小高度 */
export const TABLE_DIALOG_MIN_HEIGHT = 350

/** 表格管理对话框最大高度 */
export const TABLE_DIALOG_MAX_HEIGHT = 400

// ============= 图标尺寸 =============

/** 展开/折叠图标宽度 */
export const ICON_EXPAND_WIDTH = 16

// ============= 其他常量 =============

/** 默认最大返回行数 */
export const DEFAULT_MAX_ROWS = 5000

/** 最近文件列表最大数量 */
export const MAX_RECENT_FILES = 10

/** 语法验证延迟时间(ms) */
export const VALIDATE_DEBOUNCE_MS = 500

// ============= 样式工具函数 =============

/**
 * 生成 px 字符串
 */
export function px(value: number): string {
  return `${value}px`
}

/**
 * 生成宽度样式对象
 */
export function widthStyle(value: number): { width: string } {
  return { width: px(value) }
}

/**
 * 生成高度样式对象
 */
export function heightStyle(value: number): { height: string } {
  return { height: px(value) }
}
