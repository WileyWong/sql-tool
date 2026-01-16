/**
 * Editor Model Composable
 * 封装 Monaco Editor 的 Model 管理逻辑
 */

import * as monaco from 'monaco-editor'
import { useEditorStore } from '../stores/editor'

export function useEditorModel() {
  const editorStore = useEditorStore()
  
  // 每个标签页的 Monaco Model 缓存
  const modelCache = new Map<string, monaco.editor.ITextModel>()
  
  // 标志：是否正在程序化设置内容（防止触发 isDirty）
  let isSettingContent = false

  /**
   * 获取或创建标签页的 Monaco Model
   */
  function getOrCreateModel(
    tabId: string,
    content: string,
    onContentChange?: () => void
  ): monaco.editor.ITextModel {
    let model = modelCache.get(tabId)
    
    if (!model || model.isDisposed()) {
      // 创建新的 Model
      const uri = monaco.Uri.parse(`sql://tab/${tabId}.sql`)
      model = monaco.editor.createModel(content, 'sql', uri)
      modelCache.set(tabId, model)
      
      // 监听 Model 内容变化
      model.onDidChangeContent(() => {
        if (!isSettingContent) {
          const value = model!.getValue()
          editorStore.updateContent(value)
        }
        // 触发回调（如语法验证）
        onContentChange?.()
      })
    }
    
    return model
  }

  /**
   * 切换到指定标签页的 Model
   */
  function switchToTabModel(
    editor: monaco.editor.IStandaloneCodeEditor | null,
    tabId: string,
    content: string,
    onContentChange?: () => void
  ) {
    if (!editor) return
    
    const model = getOrCreateModel(tabId, content, onContentChange)
    const currentModel = editor.getModel()
    
    // 如果已经是当前 Model，检查内容是否需要更新
    if (currentModel === model) {
      if (model.getValue() !== content) {
        isSettingContent = true
        model.setValue(content)
        isSettingContent = false
      }
      return
    }
    
    // 切换 Model（比 setValue 快得多）
    editor.setModel(model)
  }

  /**
   * 清理标签页的 Model
   */
  function disposeTabModel(tabId: string) {
    const model = modelCache.get(tabId)
    if (model && !model.isDisposed()) {
      model.dispose()
    }
    modelCache.delete(tabId)
  }

  /**
   * 清理所有 Model
   */
  function disposeAllModels() {
    for (const [tabId] of modelCache) {
      disposeTabModel(tabId)
    }
    modelCache.clear()
  }

  /**
   * 获取缓存的 Model
   */
  function getCachedModel(tabId: string): monaco.editor.ITextModel | undefined {
    return modelCache.get(tabId)
  }

  /**
   * 检查 Model 是否存在
   */
  function hasModel(tabId: string): boolean {
    const model = modelCache.get(tabId)
    return !!model && !model.isDisposed()
  }

  /**
   * 设置内容标志（用于外部控制）
   */
  function setIsSettingContent(value: boolean) {
    isSettingContent = value
  }

  return {
    // Model 管理
    getOrCreateModel,
    switchToTabModel,
    disposeTabModel,
    disposeAllModels,
    getCachedModel,
    hasModel,
    
    // 工具方法
    setIsSettingContent
  }
}
