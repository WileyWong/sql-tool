import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@shared': resolve(__dirname, 'src/shared'),
      // 主进程代码会在模块加载时引用 electron（如 connection-store 读取 userData 路径），
      // 单测环境用 stub 替换，使 service 可在纯 Node 下被导入测试。
      electron: resolve(__dirname, 'test/mocks/electron.ts'),
    },
  },
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts', 'src/**/*.test.ts'],
  },
})
