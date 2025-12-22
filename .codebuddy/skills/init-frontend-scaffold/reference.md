---
name: init-frontend-scaffold
type: reference
description: 初始化前端脚手架 - 详细参考文档
---

# 初始化前端脚手架 - 详细参考文档

## 深入理解脚手架初始化

### 什么是脚手架？

脚手架（Scaffold）是一个预配置的项目模板，包含：
- 项目结构和目录组织
- 基础配置文件（package.json、tsconfig.json 等）
- 构建和开发工具配置
- 示例代码和组件
- 开发规范和最佳实践

使用脚手架的好处：
- ✅ 快速启动项目，无需从零开始
- ✅ 统一团队的项目结构和规范
- ✅ 包含最佳实践和优化配置
- ✅ 减少初始化时间和错误

### 脚手架初始化流程

```
克隆脚手架 → 移除 Git 历史 → 改造配置 → 验证完整性
```

每个步骤的目的：

| 步骤 | 目的 | 关键操作 |
|------|------|---------|
| **克隆脚手架** | 获取标准项目模板 | `git clone` |
| **移除 Git 历史** | 使其成为独立项目 | 删除 .git，初始化新仓库 |
| **改造配置** | 适配项目需求 | 修改 package.json、README.md 等 |
| **验证完整性** | 确保项目可用 | 安装依赖、启动服务器 |

---

## 详细操作指南

### 1. 克隆脚手架仓库

#### 基本命令

```bash
# 克隆脚手架仓库到项目目录
git clone https://git.woa.com/hr-team/sdc-std-devkit-team/scaffold-web/sdc-std-scaffold-vue-next.git {project-name}

# 进入项目目录
cd {project-name}
```

#### 脚手架结构说明

脚手架已经是完整的项目结构，包含以下主要目录：
- `src/` - 源代码目录
- `public/` - 静态资源目录
- `package.json` - 项目配置文件
- `vite.config.ts` - Vite 构建配置
- `tsconfig.json` - TypeScript 配置

#### 克隆失败排查

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| `fatal: unable to access` | 网络问题或权限问题 | 检查网络连接，确认有访问权限 |
| `Repository not found` | 仓库地址错误 | 验证仓库地址是否正确 |
| `Permission denied` | SSH 密钥问题 | 配置 SSH 密钥或使用 HTTPS |
| `Timeout` | 网络超时 | 检查网络连接，尝试使用代理 |

---

### 2. 移除脚手架的 Git 历史并初始化新仓库

#### 为什么要移除 Git 历史？

脚手架仓库包含完整的 Git 历史记录，这些历史记录对新项目没有意义。移除 Git 依赖的好处：

- ✅ 减少项目大小（删除 `.git` 目录）
- ✅ 清除脚手架的历史记录
- ✅ 创建独立的项目版本控制
- ✅ 避免与脚手架仓库的混淆

#### 完整步骤

```bash
# 1. 进入项目目录
cd {project-name}

# 2. 删除脚手架的 .git 目录
rm -rf .git

# 3. 初始化新的 Git 仓库
git init

# 4. 配置 Git 用户信息（可选，如果全局配置过可跳过）
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 5. 添加所有文件到暂存区
git add .

# 6. 创建初始提交
git commit -m "chore: initial commit from scaffold"

# 7. 验证
git log
```

#### 验证结果

执行 `git log` 后应该看到：
```
commit abc123... (HEAD -> main)
Author: Your Name <your.email@example.com>
Date:   Mon Nov 4 10:00:00 2025 +0800

    chore: initial commit from scaffold
```

---

### 3. 改造项目配置（可选）

#### package.json 配置

**需要修改的字段**:

```json
{
  "name": "my-project",              // 项目名称（小写字母 + 连字符）
  "version": "0.1.0",                // 项目版本（Semantic Versioning）
  "description": "My awesome project", // 项目描述
  "author": "Your Name",             // 作者信息
  "license": "MIT",                  // 许可证
  "homepage": "https://example.com", // 项目主页（可选）
  "repository": {                    // 仓库信息（可选）
    "type": "git",
    "url": "https://github.com/user/project.git"
  }
}
```

**修改方法**:

方法 1：使用编辑器直接修改
```bash
# 使用 VS Code 打开
code package.json

# 使用 Vim 编辑
vim package.json
```

方法 2：使用命令行工具修改
```bash
# macOS/Linux
sed -i '' 's/"name": ".*"/"name": "my-project"/' package.json

# Linux
sed -i 's/"name": ".*"/"name": "my-project"/' package.json

# 使用 npm 工具
npm set name my-project
npm set version 0.1.0
npm set description "My awesome project"
```

方法 3：使用 Node.js 脚本修改
```javascript
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.name = 'my-project';
pkg.version = '0.1.0';
pkg.description = 'My awesome project';
pkg.author = 'Your Name';

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
```

#### README.md 改造

**需要修改的内容**:

```markdown
# 项目名称

项目简介（1-2 句话）

## 功能特性

- 功能 1
- 功能 2
- 功能 3

## 快速开始

### 前置要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

### 构建生产版本

\`\`\`bash
npm run build
\`\`\`

## 项目结构

\`\`\`
src/
├── components/     # 组件
├── pages/          # 页面
├── styles/         # 样式
├── utils/          # 工具函数
└── App.vue         # 根组件
\`\`\`

## 开发规范

- 遵循 ESLint 规范
- 使用 Prettier 格式化代码
- 编写单元测试

## 许可证

MIT
```

#### 其他配置文件

**tsconfig.json** - TypeScript 配置
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

**vite.config.ts** - Vite 构建配置
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
```

**.env.example** - 环境变量示例
```
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=My Project
```

---

### 4. 改造项目内容

#### 项目结构调整

**常见的结构调整**:

```bash
# 重命名目录
mv src/components/HelloWorld src/components/MyComponent

# 删除不需要的文件
rm src/components/HelloWorld.vue

# 创建新的目录
mkdir -p src/pages
mkdir -p src/services
mkdir -p src/stores
```

#### 源代码修改

**修改组件名称**:
```vue
<!-- 原始 -->
<template>
  <div class="hello-world">
    <h1>Hello World</h1>
  </div>
</template>

<script setup lang="ts">
// ...
</script>

<!-- 修改后 -->
<template>
  <div class="my-component">
    <h1>My Component</h1>
  </div>
</template>

<script setup lang="ts">
// ...
</script>
```

**更新导入路径**:
```typescript
// 原始
import HelloWorld from './components/HelloWorld.vue'

// 修改后
import MyComponent from './components/MyComponent.vue'
```

#### 资源文件替换

```bash
# 替换 Logo
cp /path/to/new/logo.png public/logo.png

# 替换 Favicon
cp /path/to/new/favicon.ico public/favicon.ico

# 替换样式
cp /path/to/new/styles.css src/styles/main.css
```

---

### 5. 依赖管理

#### 安装依赖

```bash
# 安装所有依赖
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

#### 添加新依赖

```bash
# 添加生产依赖
npm install package-name

# 添加开发依赖
npm install --save-dev package-name

# 添加特定版本
npm install package-name@1.2.3
```

#### 更新依赖

```bash
# 检查过期的依赖
npm outdated

# 更新所有依赖
npm update

# 更新特定依赖
npm update package-name
```

#### 清理依赖

```bash
# 删除未使用的依赖
npm prune

# 清除 npm 缓存
npm cache clean --force

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

---

### 6. 启动和验证

#### 启动开发服务器

```bash
# 启动开发服务器
npm run dev

# 指定端口
npm run dev -- --port 3000

# 允许外部访问
npm run dev -- --host
```

#### 构建生产版本

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

#### 常见问题排查

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 端口被占用 | 其他进程占用了端口 | 更改端口或关闭占用进程 |
| 依赖安装失败 | 网络问题或版本冲突 | 清除缓存，重新安装 |
| 启动失败 | 配置错误或依赖缺失 | 检查配置文件，重新安装依赖 |
| 编译错误 | 代码错误或类型错误 | 查看错误信息，修复代码 |

---

## 高级技巧

### 1. 使用脚本自动化初始化

创建 `init-project.sh` 脚本自动化初始化过程：

```bash
#!/bin/bash

PROJECT_NAME=$1
PROJECT_DESC=$2

# 克隆脚手架
git clone --depth 1 https://git.woa.com/hr-team/sdc-std-devkit-team/sdc-std-web.git $PROJECT_NAME
cd $PROJECT_NAME

# 移除 Git 依赖
rm -rf .git
git init
git add .
git commit -m "chore: initial commit from scaffold"

# 修改配置
sed -i '' "s/\"name\": \".*\"/\"name\": \"$PROJECT_NAME\"/" package.json
sed -i '' "s/\"description\": \".*\"/\"description\": \"$PROJECT_DESC\"/" package.json

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

使用方法：
```bash
chmod +x init-project.sh
./init-project.sh my-project "My awesome project"
```

### 2. 使用 Node.js 脚本改造项目

创建 `customize-project.js` 脚本：

```javascript
const fs = require('fs');
const path = require('path');

const projectName = process.argv[2] || 'my-project';
const projectDesc = process.argv[3] || 'My awesome project';

// 修改 package.json
const pkgPath = path.join(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.name = projectName;
pkg.description = projectDesc;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

// 修改 README.md
const readmePath = path.join(process.cwd(), 'README.md');
let readme = fs.readFileSync(readmePath, 'utf8');
readme = readme.replace(/# .+/, `# ${projectName}`);
readme = readme.replace(/> .+/, `> ${projectDesc}`);
fs.writeFileSync(readmePath, readme);

console.log(`✅ Project customized: ${projectName}`);
```

使用方法：
```bash
node customize-project.js my-project "My awesome project"
```

### 3. 使用 Git Hooks 自动化验证

创建 `.git/hooks/pre-commit` 钩子：

```bash
#!/bin/bash

# 运行 ESLint
npm run lint

# 运行测试
npm run test

# 如果有错误，阻止提交
if [ $? -ne 0 ]; then
  echo "❌ Commit failed due to linting or test errors"
  exit 1
fi
```

---

## 性能优化

### 1. 加快克隆速度

```bash
# 使用浅克隆
git clone --depth 1 https://git.woa.com/hr-team/sdc-std-devkit-team/sdc-std-web.git

# 使用单分支克隆
git clone --single-branch https://git.woa.com/hr-team/sdc-std-devkit-team/sdc-std-web.git

# 组合使用
git clone --depth 1 --single-branch https://git.woa.com/hr-team/sdc-std-devkit-team/sdc-std-web.git
```

### 2. 加快依赖安装速度

```bash
# 使用 npm ci（推荐用于 CI/CD）
npm ci

# 使用 pnpm（更快的包管理器）
pnpm install

# 使用 yarn（另一个快速的包管理器）
yarn install

# 使用 npm 镜像
npm install --registry https://registry.npmmirror.com
```

### 3. 优化构建速度

在 `vite.config.ts` 中：
```typescript
export default defineConfig({
  build: {
    // 并行构建
    rollupOptions: {
      output: {
        manualChunks: {
          'vue': ['vue'],
          'vendor': ['axios', 'lodash'],
        },
      },
    },
    // 启用 minify
    minify: 'terser',
    // 启用 sourcemap（仅开发环境）
    sourcemap: process.env.NODE_ENV === 'development',
  },
})
```

---

## 常见场景

### 场景 1: 创建多个相似项目

```bash
# 创建第一个项目
./init-project.sh project-1 "Project 1"

# 创建第二个项目
./init-project.sh project-2 "Project 2"

# 创建第三个项目
./init-project.sh project-3 "Project 3"
```

### 场景 2: 为现有项目添加脚手架功能

```bash
# 在现有项目中添加脚手架的配置
cp /path/to/scaffold/vite.config.ts ./
cp /path/to/scaffold/tsconfig.json ./
cp /path/to/scaffold/.eslintrc.json ./

# 安装脚手架的依赖
npm install
```

### 场景 3: 创建团队标准脚手架

```bash
# 基于现有脚手架创建团队标准
git clone https://git.woa.com/hr-team/sdc-std-devkit-team/sdc-std-web.git team-scaffold
cd team-scaffold

# 自定义脚手架
# ... 修改配置和内容 ...

# 推送到团队仓库
git remote add origin https://git.woa.com/team/team-scaffold.git
git push -u origin main
```

---

## 故障排除

### 问题 1: 克隆速度慢

**症状**: 克隆脚手架仓库花费很长时间

**解决方案**:
- 使用浅克隆：`git clone --depth 1`
- 检查网络连接
- 尝试使用 VPN 或代理
- 使用 SSH 而不是 HTTPS

### 问题 2: 依赖冲突

**症状**: 安装依赖时出现版本冲突错误

**解决方案**:
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 和 lock 文件
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 如果仍然有问题，尝试强制安装
npm install --force
```

### 问题 3: 启动失败

**症状**: `npm run dev` 失败

**解决方案**:
- 检查 Node.js 版本：`node --version`
- 检查 npm 版本：`npm --version`
- 查看错误信息，找出具体问题
- 尝试删除 `node_modules` 和 `package-lock.json`，重新安装

---


## 总结

初始化前端脚手架是一个系统化的过程，包括克隆、配置、改造和验证。你可以选择：

1. **手动执行** - 按照 SKILL.md 中的步骤手动执行
2. **使用脚本** - 使用自动化脚本一键完成

两种方式都能达到相同的结果，选择哪种方式取决于你的偏好和需求。通过遵循本指南，你可以快速创建符合团队规范的前端项目。
