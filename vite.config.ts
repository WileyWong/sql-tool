import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    electron([
      {
        entry: 'src/main/index.ts',
        vite: {
          build: {
            outDir: 'dist-electron',
            sourcemap: true, // 启用 sourcemap 以便调试
            rollupOptions: {
              external: ['electron', 'mysql2', 'crypto-js', 'uuid', 'mssql']
            }
          },
          resolve: {
            alias: {
              '@shared': resolve(__dirname, 'src/shared')
            }
          }
        },
        onstart(args) {
          // 启动 Electron 时开启调试端口
          args.startup(['--inspect=9229', '.'])
        }
      },
      {
        entry: 'src/preload/index.ts',
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              output: {
                entryFileNames: 'preload.js'
              }
            }
          },
          resolve: {
            alias: {
              '@shared': resolve(__dirname, 'src/shared')
            }
          }
        }
      }
    ])
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/renderer'),
      '@shared': resolve(__dirname, 'src/shared')
    }
  },
  build: {
    outDir: 'dist'
  },
  // 定义环境变量，启用 vue-i18n 的运行时编译功能（使用 JIT 编译）
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_JIT_COMPILATION__: true,
    __INTLIFY_DROP_MESSAGE_COMPILER__: false
  }
})
