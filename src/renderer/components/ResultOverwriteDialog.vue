<template>
  <el-dialog
    v-model="visible"
    title="未保存的修改"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    class="result-overwrite-dialog"
  >
    <div class="dialog-content">
      <div class="warning-icon">⚠️</div>
      <p class="message">当前查询结果有未保存的修改，是否继续执行新的查询？</p>
      <p class="hint">继续执行将覆盖当前结果。</p>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="warning" @click="handleDiscard">放弃</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type DialogResult = 'submit' | 'discard' | 'cancel'

const visible = ref(false)
let resolvePromise: ((value: DialogResult) => void) | null = null

// 显示对话框
function show(): Promise<DialogResult> {
  visible.value = true
  return new Promise((resolve) => {
    resolvePromise = resolve
  })
}

// 提交修改
function handleSubmit() {
  visible.value = false
  resolvePromise?.('submit')
  resolvePromise = null
}

// 放弃修改
function handleDiscard() {
  visible.value = false
  resolvePromise?.('discard')
  resolvePromise = null
}

// 取消
function handleCancel() {
  visible.value = false
  resolvePromise?.('cancel')
  resolvePromise = null
}

defineExpose({
  show
})
</script>

<style scoped>
.result-overwrite-dialog :deep(.el-dialog) {
  background: #2d2d2d;
  border: 1px solid #555;
}

.result-overwrite-dialog :deep(.el-dialog__header) {
  background: #2d2d2d;
  border-bottom: 1px solid #555;
  padding: 16px 20px;
}

.result-overwrite-dialog :deep(.el-dialog__title) {
  color: #e6a23c;
  font-size: 16px;
}

.result-overwrite-dialog :deep(.el-dialog__body) {
  background: #2d2d2d;
  padding: 20px;
}

.result-overwrite-dialog :deep(.el-dialog__footer) {
  background: #2d2d2d;
  border-top: 1px solid #555;
  padding: 16px 20px;
}

.dialog-content {
  text-align: center;
}

.warning-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.message {
  color: #d4d4d4;
  font-size: 14px;
  margin-bottom: 8px;
}

.hint {
  color: #858585;
  font-size: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-footer :deep(.el-button) {
  min-width: 80px;
}
</style>
