<!--
  Vue 3.x 组件模板
  使用 Composition API + script setup 语法
-->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// ============ 类型定义 ============
interface Props {
  /** 数据ID */
  id: string | number
  /** 初始数据 */
  initialData?: Record<string, unknown> | null
  /** 是否自动加载 */
  autoLoad?: boolean
}

interface Emits {
  (e: 'loaded', data: unknown): void
  (e: 'error', error: Error): void
  (e: 'update', data: unknown): void
}

// ============ Props & Emits ============
const props = withDefaults(defineProps<Props>(), {
  initialData: null,
  autoLoad: true
})

const emit = defineEmits<Emits>()

// ============ 响应式状态 ============
const data = ref<unknown>(props.initialData)
const loading = ref(false)
const error = ref<Error | null>(null)

// ============ 计算属性 ============
const isEmpty = computed(() => {
  return !data.value || (Array.isArray(data.value) && data.value.length === 0)
})

// ============ 方法 ============
async function fetchData() {
  loading.value = true
  error.value = null

  try {
    // 替换为实际的 API 调用
    // data.value = await api.getData(props.id)
    emit('loaded', data.value)
  } catch (err) {
    error.value = err as Error
    emit('error', err as Error)
  } finally {
    loading.value = false
  }
}

function retry() {
  fetchData()
}

// ============ 侦听器 ============
watch(() => props.id, () => {
  fetchData()
})

// ============ 生命周期 ============
onMounted(() => {
  if (props.autoLoad && !props.initialData) {
    fetchData()
  }
})

// 清理逻辑示例
let timer: ReturnType<typeof setInterval> | null = null

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})

// ============ 暴露方法 ============
defineExpose({
  refresh: fetchData,
  retry
})
</script>

<template>
  <div class="component-name">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <slot name="loading">加载中...</slot>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <slot name="error" :error="error">
        <p>{{ error.message }}</p>
        <button @click="retry">重试</button>
      </slot>
    </div>

    <!-- 空状态 -->
    <div v-else-if="isEmpty" class="empty-state">
      <slot name="empty">暂无数据</slot>
    </div>

    <!-- 正常内容 -->
    <div v-else class="content">
      <slot :data="data"></slot>
    </div>
  </div>
</template>

<style scoped>
.component-name {
  /* 组件容器样式 */
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}

.error-state {
  color: var(--td-error-color, #e34d59);
}

.error-state button {
  margin-top: 8px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
