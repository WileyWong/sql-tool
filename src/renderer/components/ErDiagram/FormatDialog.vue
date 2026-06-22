<template>
  <el-dialog v-model="visible" :title="$t('erd.format')" width="400px" :close-on-click-modal="false" append-to-body>
    <div class="format-dialog">
      <div class="format-item">
        <span class="label">{{ $t('erd.backgroundColor') }}:</span>
        <div class="color-row">
          <input type="color" v-model="selectedColor" class="color-picker" />
          <span class="color-value">{{ selectedColor }}</span>
        </div>
      </div>
      <div class="format-item">
        <span class="label">{{ $t('erd.defaultColor') }}:</span>
        <div class="color-row">
          <span class="color-swatch" :style="{ background: '#2d2d2d' }" @click="selectedColor = '#2d2d2d'"></span>
          <span class="color-swatch" :style="{ background: '#3a3a5c' }" @click="selectedColor = '#3a3a5c'"></span>
          <span class="color-swatch" :style="{ background: '#3c5a3a' }" @click="selectedColor = '#3c5a3a'"></span>
          <span class="color-swatch" :style="{ background: '#5a3c3c' }" @click="selectedColor = '#5a3c3c'"></span>
          <span class="color-swatch" :style="{ background: '#3c4a5a' }" @click="selectedColor = '#3c4a5a'"></span>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: boolean; currentColor: string }>()
const emit = defineEmits<{ 'update:modelValue': [v: boolean]; confirm: [color: string] }>()

const visible = ref(props.modelValue)
const selectedColor = ref(props.currentColor || '#2d2d2d')

watch(() => props.modelValue, v => { visible.value = v })
watch(visible, v => emit('update:modelValue', v))
watch(() => props.currentColor, c => { selectedColor.value = c || '#2d2d2d' })

function handleConfirm() { emit('confirm', selectedColor.value); visible.value = false }
</script>

<style scoped>
.format-item { margin-bottom: 16px; }
.format-item .label { display: block; color: var(--text-primary); margin-bottom: 8px; font-size: 13px; }
.color-row { display: flex; align-items: center; gap: 10px; }
.color-picker { width: 40px; height: 30px; border: 1px solid var(--border-color); border-radius: 4px; cursor: pointer; }
.color-value { color: var(--text-placeholder); font-size: 12px; }
.color-swatch { width: 28px; height: 28px; border-radius: 4px; border: 1px solid var(--border-color); cursor: pointer; transition: transform 0.15s; }
.color-swatch:hover { transform: scale(1.15); border-color: var(--color-primary); }
</style>
