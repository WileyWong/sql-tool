<template>
  <div v-if="visible" class="dialog-overlay" @click.self="handleCancel">
    <div class="dialog">
      <div class="dialog-header">
        <h3>{{ $t('dialog.saveConfirm.title') }}</h3>
      </div>
      <div class="dialog-body">
        <p>{{ $t('dialog.saveConfirm.message', { name: fileName }) }}</p>
      </div>
      <div class="dialog-footer">
        <button class="btn btn-primary" @click="handleSave">{{ $t('dialog.saveConfirm.save') }}</button>
        <button class="btn btn-secondary" @click="handleDontSave">{{ $t('dialog.saveConfirm.dontSave') }}</button>
        <button class="btn btn-cancel" @click="handleCancel">{{ $t('common.cancel') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 对话框状态
const visible = ref(false)
const currentTabId = ref<string | null>(null)
const currentFilePath = ref<string | undefined>(undefined)
const currentTitle = ref('')

// 回调函数
let resolvePromise: ((result: 'save' | 'dontSave' | 'cancel') => void) | null = null

const fileName = computed(() => {
  if (currentFilePath.value) {
    return currentFilePath.value.split(/[/\\]/).pop() || currentTitle.value
  }
  return currentTitle.value || t('editor.untitled')
})

// 显示对话框
function show(tabId: string, title: string, filePath?: string): Promise<'save' | 'dontSave' | 'cancel'> {
  currentTabId.value = tabId
  currentTitle.value = title
  currentFilePath.value = filePath
  visible.value = true
  
  return new Promise((resolve) => {
    resolvePromise = resolve
  })
}

function handleSave() {
  visible.value = false
  resolvePromise?.('save')
  resolvePromise = null
}

function handleDontSave() {
  visible.value = false
  resolvePromise?.('dontSave')
  resolvePromise = null
}

function handleCancel() {
  visible.value = false
  resolvePromise?.('cancel')
  resolvePromise = null
}

// 暴露方法
defineExpose({
  show
})
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.dialog {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.dialog-header {
  padding: 16px 20px;
  border-bottom: 1px solid #444;
}

.dialog-header h3 {
  margin: 0;
  font-size: 16px;
  color: #e0e0e0;
}

.dialog-body {
  padding: 20px;
}

.dialog-body p {
  margin: 0;
  color: #d4d4d4;
  font-size: 14px;
  line-height: 1.5;
}

.dialog-footer {
  padding: 16px 20px;
  border-top: 1px solid #444;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.btn-secondary {
  background: #5a5a5a;
  color: #e0e0e0;
}

.btn-secondary:hover {
  background: #6a6a6a;
}

.btn-cancel {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-cancel:hover {
  background: var(--bg-elevated);
}
</style>
