/**
 * 单元测试用 electron stub
 * 仅提供 service 在模块加载/运行时会用到的最小 API。
 */
import { tmpdir } from 'os'

export const app = {
  getPath: (_name?: string) => tmpdir(),
}

export const dialog = {
  showOpenDialog: async () => ({ canceled: true, filePaths: [] as string[] }),
  showSaveDialog: async () => ({ canceled: true, filePath: undefined as string | undefined }),
}

export default { app, dialog }
