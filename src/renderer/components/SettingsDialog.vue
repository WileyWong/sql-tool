<template>
  <el-dialog
    v-model="visible"
    :title="$t('settings.title')"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    @close="handleClose"
  >
    <div class="settings-container">
      <!-- 左侧导航 -->
      <div class="settings-nav">
        <div
          v-for="item in navItems"
          :key="item.key"
          class="nav-item"
          :class="{ active: activeNav === item.key }"
          @click="activeNav = item.key"
        >
          {{ item.label }}
        </div>
      </div>
      
      <!-- 右侧内容 -->
      <div class="settings-content">
        <!-- 语言设置 -->
        <div v-if="activeNav === 'language'" class="settings-section">
          <h3 class="section-title">{{ $t('settings.interfaceLanguage') }}</h3>
          <el-radio-group v-model="tempLocale" class="locale-radio-group">
            <el-radio
              v-for="option in localeOptions"
              :key="option.value"
              :value="option.value"
              class="locale-radio"
            >
              {{ option.label }}
            </el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleReset">{{ $t('common.reset') }}</el-button>
        <el-button type="primary" @click="handleApply">{{ $t('common.apply') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { LOCALE_OPTIONS, type SupportedLocale } from '../i18n'

const { t, locale } = useI18n()

// 对话框可见性
const visible = ref(false)

// 当前导航项
const activeNav = ref('language')

// 临时语言设置（未应用前）
const tempLocale = ref<SupportedLocale>(locale.value as SupportedLocale)

// 导航项
const navItems = computed(() => [
  { key: 'language', label: t('settings.language') }
])

// 语言选项
const localeOptions = LOCALE_OPTIONS

// 监听对话框打开，同步当前设置
watch(visible, (val) => {
  if (val) {
    tempLocale.value = locale.value as SupportedLocale
  }
})

// 打开对话框
function show() {
  visible.value = true
}

// 关闭对话框
function handleClose() {
  visible.value = false
}

// 重置设置
function handleReset() {
  tempLocale.value = locale.value as SupportedLocale
}

// 应用设置
function handleApply() {
  // 应用语言设置
  if (tempLocale.value !== locale.value) {
    locale.value = tempLocale.value
    // 通知主进程更新菜单语言并持久化保存
    window.api?.locale?.setLocale(tempLocale.value)
  }
  visible.value = false
}

// 暴露方法
defineExpose({
  show
})
</script>

<style scoped>
.settings-container {
  display: flex;
  min-height: 300px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  overflow: hidden;
}

.settings-nav {
  width: 150px;
  background: var(--el-fill-color-light);
  border-right: 1px solid var(--el-border-color-light);
  flex-shrink: 0;
}

.nav-item {
  padding: 12px 16px;
  cursor: pointer;
  color: var(--el-text-color-regular);
  transition: all 0.2s;
}

.nav-item:hover {
  background: var(--el-fill-color);
}

.nav-item.active {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-weight: 500;
}

.settings-content {
  flex: 1;
  padding: 20px;
}

.settings-section {
  /* section styles */
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin: 0 0 16px 0;
}

.locale-radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.locale-radio {
  margin-right: 0;
  height: auto;
  padding: 8px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
