<!--
  Vue 2.x 组件模板
  用于重构后的标准组件结构
-->
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

<script>
/**
 * 组件名称
 * @description 组件功能描述
 */
export default {
  name: 'ComponentName',

  // Props 定义 - 必须有类型和验证
  props: {
    /**
     * 数据ID
     */
    id: {
      type: [String, Number],
      required: true
    },
    /**
     * 初始数据
     */
    initialData: {
      type: Object,
      default: null
    },
    /**
     * 是否自动加载
     */
    autoLoad: {
      type: Boolean,
      default: true
    }
  },

  // 响应式数据 - 保持精简
  data() {
    return {
      data: null,
      loading: false,
      error: null
    }
  },

  // 计算属性
  computed: {
    /**
     * 是否为空数据
     */
    isEmpty() {
      return !this.data || (Array.isArray(this.data) && this.data.length === 0)
    }
  },

  // 侦听器
  watch: {
    id: {
      handler: 'fetchData',
      immediate: false
    }
  },

  // 生命周期
  created() {
    if (this.initialData) {
      this.data = this.initialData
    } else if (this.autoLoad) {
      this.fetchData()
    }
  },

  // 方法
  methods: {
    /**
     * 获取数据
     */
    async fetchData() {
      this.loading = true
      this.error = null

      try {
        // 替换为实际的 API 调用
        this.data = await this.$api.getData(this.id)
        this.$emit('loaded', this.data)
      } catch (err) {
        this.error = err
        this.$emit('error', err)
      } finally {
        this.loading = false
      }
    },

    /**
     * 重试加载
     */
    retry() {
      this.fetchData()
    },

    /**
     * 刷新数据
     */
    refresh() {
      return this.fetchData()
    }
  }
}
</script>

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
