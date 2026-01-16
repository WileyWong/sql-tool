/**
 * Tree Filter Composable
 * 封装树节点的过滤功能
 */

import { ref, type ComponentPublicInstance } from 'vue'
import type { TreeNode } from '@shared/types'

export interface FilterState {
  isFilterMode: boolean
  keyword: string
  appliedKeyword: string
}

export function useTreeFilter() {
  // 当前悬浮的节点 ID
  const hoveredNodeId = ref<string | null>(null)
  
  // 每个节点的过滤状态 Map<nodeId, FilterState>
  const filterStates = ref<Map<string, FilterState>>(new Map())
  
  // 过滤输入框引用
  const filterInputRefs = ref<Map<string, HTMLInputElement | null>>(new Map())

  /**
   * 鼠标进入节点
   */
  function handleNodeMouseEnter(data: TreeNode) {
    hoveredNodeId.value = data.id
  }

  /**
   * 鼠标离开节点
   */
  function handleNodeMouseLeave(data: TreeNode) {
    if (hoveredNodeId.value === data.id) {
      hoveredNodeId.value = null
    }
  }

  /**
   * 获取过滤状态
   */
  function getFilterState(data: TreeNode): FilterState {
    if (!filterStates.value.has(data.id)) {
      filterStates.value.set(data.id, { isFilterMode: false, keyword: '', appliedKeyword: '' })
    }
    return filterStates.value.get(data.id)!
  }

  /**
   * 是否处于过滤输入模式
   */
  function isFilterMode(data: TreeNode): boolean {
    return getFilterState(data).isFilterMode
  }

  /**
   * 是否有激活的过滤
   */
  function hasActiveFilter(data: TreeNode): boolean {
    return getFilterState(data).appliedKeyword !== ''
  }

  /**
   * 设置过滤输入框引用
   */
  function setFilterInputRef(data: TreeNode, el: Element | ComponentPublicInstance | null) {
    filterInputRefs.value.set(data.id, el as HTMLInputElement | null)
  }

  /**
   * 进入过滤模式
   */
  function enterFilterMode(data: TreeNode) {
    const state = getFilterState(data)
    state.isFilterMode = true
    state.keyword = state.appliedKeyword // 恢复之前的过滤关键字
    // 下一帧聚焦输入框
    setTimeout(() => {
      const input = filterInputRefs.value.get(data.id)
      if (input) {
        input.focus()
        input.select()
      }
    }, 0)
  }

  /**
   * 退出过滤模式
   */
  function exitFilterMode(data: TreeNode) {
    const state = getFilterState(data)
    state.isFilterMode = false
    state.keyword = state.appliedKeyword // 恢复到已应用的关键字
  }

  /**
   * 应用过滤
   * @returns 是否有变化
   */
  function applyFilter(data: TreeNode): boolean {
    const state = getFilterState(data)
    const newKeyword = state.keyword.trim()
    const hasChanged = newKeyword !== state.appliedKeyword
    state.appliedKeyword = newKeyword
    state.isFilterMode = false
    return hasChanged
  }

  /**
   * 处理输入框失焦
   * @returns 是否需要刷新
   */
  function handleFilterInputBlur(data: TreeNode): boolean {
    const state = getFilterState(data)
    // 如果关键字没有变化，直接退出过滤模式
    if (state.keyword.trim() === state.appliedKeyword) {
      state.isFilterMode = false
      return false
    } else {
      // 如果关键字有变化，应用过滤
      return applyFilter(data)
    }
  }

  /**
   * 获取数据库节点的过滤关键字
   */
  function getDatabaseFilterKeyword(connectionId: string, databaseName: string): string {
    const nodeId = `${connectionId}-${databaseName}`
    const state = filterStates.value.get(nodeId)
    return state?.appliedKeyword || ''
  }

  /**
   * 获取连接节点的过滤关键字
   */
  function getConnectionFilterKeyword(connectionId: string): string {
    const state = filterStates.value.get(connectionId)
    return state?.appliedKeyword || ''
  }

  /**
   * 清除指定节点的过滤
   */
  function clearFilter(nodeId: string) {
    const state = filterStates.value.get(nodeId)
    if (state) {
      state.keyword = ''
      state.appliedKeyword = ''
      state.isFilterMode = false
    }
  }

  /**
   * 清除所有过滤
   */
  function clearAllFilters() {
    filterStates.value.clear()
  }

  return {
    // 状态
    hoveredNodeId,
    filterStates,
    
    // 鼠标事件
    handleNodeMouseEnter,
    handleNodeMouseLeave,
    
    // 过滤状态管理
    getFilterState,
    isFilterMode,
    hasActiveFilter,
    setFilterInputRef,
    
    // 过滤模式控制
    enterFilterMode,
    exitFilterMode,
    applyFilter,
    handleFilterInputBlur,
    
    // 获取过滤关键字
    getDatabaseFilterKeyword,
    getConnectionFilterKeyword,
    
    // 清除过滤
    clearFilter,
    clearAllFilters
  }
}
