/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, unknown>
  export default component
}

// 扩展 Window 接口
import type { Api } from '../preload/index'

declare global {
  interface Window {
    api: Api
  }
}
