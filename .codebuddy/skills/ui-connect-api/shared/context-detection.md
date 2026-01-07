# 技术栈检测规则

## 检测优先级

```
优先级1: 用户明确指定 > 优先级2: 项目配置 > 优先级3: 知识库 > 优先级4: 默认值
```

## 优先级1: 用户明确指定

从用户输入中识别技术栈描述：

```yaml
识别模式:
  Vue3:
    - "Vue 3"
    - "Vue3"
    - "vue3"
    - "Composition API"
  
  Vue2:
    - "Vue 2"
    - "Vue2"
    - "vue2"
    - "Options API"
  
  小程序:
    - "小程序"
    - "miniprogram"
    - "微信小程序"
    - "wx"
```

## 优先级2: 项目配置检测

### Vue3 项目特征

```yaml
package.json:
  dependencies:
    vue: "^3.x.x"
  devDependencies:
    "@vitejs/plugin-vue": "*"
    "vite": "*"

vite.config.ts:
  存在此文件

tsconfig.json:
  compilerOptions.jsx: "preserve"
```

### Vue2 项目特征

```yaml
package.json:
  dependencies:
    vue: "^2.x.x"
  devDependencies:
    "@vue/cli-service": "*"
    "vue-template-compiler": "*"

vue.config.js:
  存在此文件
```

### 小程序项目特征

```yaml
app.json:
  存在此文件
  包含 pages 配置

project.config.json:
  存在此文件
  appid 字段

miniprogram/app.json:
  存在此路径
```

### 检测代码

```typescript
interface TechStack {
  type: 'vue3' | 'vue2' | 'miniprogram';
  source: 'user' | 'config' | 'knowledge' | 'default';
  details: {
    framework?: string;
    version?: string;
    buildTool?: string;
    typescript?: boolean;
  };
}

async function detectTechStack(projectPath: string): Promise<TechStack> {
  // 1. 检查 package.json
  const packageJson = await readPackageJson(projectPath);
  if (packageJson) {
    const vueVersion = packageJson.dependencies?.vue || packageJson.devDependencies?.vue;
    if (vueVersion) {
      if (vueVersion.startsWith('^3') || vueVersion.startsWith('3')) {
        return {
          type: 'vue3',
          source: 'config',
          details: {
            framework: 'Vue',
            version: vueVersion,
            buildTool: packageJson.devDependencies?.vite ? 'Vite' : 'Webpack',
            typescript: !!packageJson.devDependencies?.typescript,
          },
        };
      }
      if (vueVersion.startsWith('^2') || vueVersion.startsWith('2')) {
        return {
          type: 'vue2',
          source: 'config',
          details: {
            framework: 'Vue',
            version: vueVersion,
            buildTool: 'Vue CLI',
            typescript: !!packageJson.devDependencies?.typescript,
          },
        };
      }
    }
  }

  // 2. 检查小程序配置
  if (await fileExists(path.join(projectPath, 'app.json'))) {
    return {
      type: 'miniprogram',
      source: 'config',
      details: {
        framework: '微信小程序',
      },
    };
  }

  // 3. 默认值
  return {
    type: 'vue3',
    source: 'default',
    details: {
      framework: 'Vue',
      version: '3.x',
      buildTool: 'Vite',
      typescript: true,
    },
  };
}
```

## 优先级3: 知识库检测

### 项目记忆文件

```yaml
检测路径:
  - .spec-code/memory/context.md
  - .spec-code/memory/guidelines.md

提取内容:
  - 技术栈配置
  - 框架版本
  - 编码规范
  - API 请求配置（参考 request-util-detection.md）
```

### 项目记忆中的 API 请求配置

> 详见 [request-util-detection.md](request-util-detection.md)

在 `.spec-code/memory/context.md` 中可配置项目自有的请求工具：

```markdown
## API 请求配置

### 请求工具类
- **导入路径**: `@/utils/request`
- **导出名称**: `request`
- **调用风格**: 方法式 (request.get/post/put/delete)

### 请求方法映射
| 标准方法 | 项目方法 |
|---------|---------|
| GET | `request.get(url, params)` |
| POST | `request.post(url, data)` |
| PUT | `request.put(url, data)` |
| DELETE | `request.delete(url)` |

### 示例代码
```typescript
import { request } from '@/utils/request';

export function getUserList(params: UserQueryParams) {
  return request.get<UserListResponse>('/api/users', params);
}
```
```

## 优先级4: 默认值

```yaml
默认技术栈:
  type: vue3
  framework: Vue 3
  buildTool: Vite
  httpClient: Axios
  typescript: true
  stateManagement: Pinia

默认请求工具:
  Vue项目: Axios
  小程序: wx.request
```

## 输出格式

```yaml
技术上下文:
  类型: vue3
  框架: Vue 3.4.0
  构建工具: Vite 5.0
  HTTP客户端: Axios
  TypeScript: true
  
  来源:
    - [项目配置] 框架版本
    - [默认值] HTTP客户端
  
  代码规范:
    API目录: src/services/
    类型目录: src/types/
    Composable目录: src/composables/

请求工具配置:
  导入路径: @/utils/request
  导出名称: request
  调用风格: method
  来源: 项目记忆
```
