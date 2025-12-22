<template>
  <div class="{{COMPONENT_CLASS}}">
    <!-- 组件内容 -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props 定义
interface Props {
  // 在此定义 Props 类型
}

const props = withDefaults(defineProps<Props>(), {
  // 默认值
})

// 事件定义
const emit = defineEmits<{
  // 在此定义事件类型
}>()

// 响应式数据
const loading = ref(false)

// 计算属性
const computedValue = computed(() => {
  // 计算逻辑
  return ''
})

// 方法定义
const handleClick = () => {
  // 事件处理逻辑
}
</script>

<style lang="less" scoped>
.{{COMPONENT_CLASS}} {
  // 组件样式
}
</style>