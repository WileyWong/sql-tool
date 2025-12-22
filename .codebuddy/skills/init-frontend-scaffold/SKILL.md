---
name: init-frontend-scaffold
description: 初始化前端脚手架项目 - 直接克隆标准脚手架、移除 Git 历史、根据用户需求改造项目配置，快速启动新的前端项目
category: initialization
keywords: [前端脚手架, 项目初始化, Vue3, Vite, 项目模板]
---

# Skill: 初始化前端脚手架

> 📚 **项目记忆引用**
> - 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md) 的核心原则
> - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的 Skill 编写规范
> - 了解 [项目上下文](mdc:.spec-code/memory/context.md) 的技术栈

## 🎯 目标

快速初始化一个新的前端项目，通过克隆标准脚手架、移除 Git 依赖、改造项目配置，帮助开发者在几分钟内启动一个符合团队规范的前端项目。

**适用场景**:
- 创建新的前端项目
- 快速启动 Vue项目
- 统一团队前端项目结构
- 复用团队最佳实践和配置

**触发词**:
- 初始化前端项目
- 创建前端脚手架
- 快速启动前端项目
- 克隆脚手架
- 初始化脚手架

**不适用场景**:
- 已有的项目改造（应该使用迁移工具）
- 非前端项目
- 需要自定义脚手架的项目（应该先创建脚手架）

## 📋 前置条件

- [ ] Git 已安装并配置
- [ ] Node.js 和 npm 已安装
- [ ] 有访问脚手架仓库的权限
- [ ] 了解项目的基本需求（项目名称、描述、功能等）
- [ ] 确定项目输出位置

## 🔄 执行步骤

### 步骤 1: 收集项目信息

在开始克隆脚手架之前，收集以下信息：

**基本信息**:
- 项目名称（英文，小写字母 + 连字符，如 `my-awesome-project`）
- 项目简介（1-2 句话，说明项目的功能和目标）
- 项目版本（初始版本，通常为 `0.1.0` 或 `1.0.0`）

**技术信息**:
- 主要依赖库（UI 框架、HTTP 客户端等）
- 开发环境要求（Node.js 版本等）

**项目信息**:
- 项目描述（详细的功能说明）
- 作者/团队信息
- 许可证类型
- 仓库地址（如果有）

**关键点**:
- 项目名称应该简洁、易记、符合命名规范
- 版本号遵循 Semantic Versioning（MAJOR.MINOR.PATCH）
- 确保所有信息准确，避免后续修改

**示例**:
```
项目名称: user-management-system
项目简介: 用户管理系统前端，提供用户注册、登录、信息管理等功能
版本: 0.1.0
前端类型: PC 端（默认）
框架: Vue 3
```

#### 验证信息完整性

- 项目名称：小写字母、数字、连字符，长度 <= 128

若验证项目名称失败，让用户修正。

### 步骤 2: 克隆脚手架仓库，注意克隆的仓库地址不能出错

从标准脚手架仓库直接克隆项目代码到项目目录：

> 注意克隆的仓库地址不能出错

**执行命令**:
```bash
# 克隆脚手架仓库到项目目录
git clone https://git.woa.com/hr-team/sdc-std-devkit-team/scaffold-web/sdc-std-scaffold-vue-next.git {project-name}

# 进入项目目录
cd {project-name}
```

**关键点**:
- 直接克隆脚手架到项目目录，无需选择子目录
- 脚手架已经是完整的项目结构，可以直接使用
- 使用项目名称作为克隆的目标目录名
- 确保克隆成功（检查是否有错误信息）

**验证**:
- [ ] 项目目录已创建，名称为 `{project-name}`
- [ ] 所有脚手架文件已克隆到项目目录
- [ ] 可以看到 `package.json` 文件
- [ ] 可以看到 `src/` 目录结构

### 步骤 3: 移除脚手架的 Git 历史并初始化新仓库

移除脚手架仓库的 Git 历史，为项目创建独立的版本控制：

**执行命令**:
```bash
# 进入项目目录
cd {project-name}

# 删除脚手架的 .git 目录
rm -rf .git

# 初始化新的 Git 仓库
git init

# 配置 Git 用户信息（如果需要）
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 添加所有文件到暂存区
git add .

# 创建初始提交
git commit -m "chore: initial commit from scaffold"
```

**关键点**:
- 删除脚手架的 `.git` 目录，移除脚手架的历史记录
- 初始化新的 Git 仓库，使项目成为独立的版本控制
- 初始提交应该包含所有脚手架文件

**验证**:
- [ ] 脚手架的 `.git` 目录已删除
- [ ] 新的 `.git` 目录已创建
- [ ] 初始提交已完成
- [ ] `git log` 显示只有一个提交

### 步骤 4: 改造项目配置

根据用户需求改造项目配置文件，使其符合项目要求。主要修改项目元数据：

**需要改造的文件**:

1. **package.json** - 项目元数据和依赖
   ```json
   {
     "name": "project-name",
     "version": "0.1.0",
     "description": "Project description",
     "author": "Your Name",
     "license": "MIT"
   }
   ```
   - 修改 `name` 为项目名称
   - 修改 `version` 为初始版本
   - 修改 `description` 为项目简介
   - 修改 `author` 为作者信息
   - 修改 `license` 为许可证类型

2. **README.md** - 项目说明文档（可选）
   - 修改项目标题
   - 修改项目描述
   - 其他内容保持不变

3. **其他配置文件**（可选）:
   - `tsconfig.json` - TypeScript 配置
   - `vite.config.ts` - Vite 构建配置
   - `.env.example` - 环境变量示例

**关键点**:
- 只修改必要的配置，避免破坏项目结构
- 保持脚手架的最佳实践和规范
- 确保修改后项目仍能正常启动
- 不要删除或修改脚手架的核心目录结构

**示例**:
```bash
# 修改 package.json 中的 name
sed -i '' 's/"name": ".*"/"name": "my-project"/' package.json

# 修改 package.json 中的 description
sed -i '' 's/"description": ".*"/"description": "My awesome project"/' package.json

# 修改 package.json 中的 author
sed -i '' 's/"author": ".*"/"author": "Your Name"/' package.json
```

**验证**:
- [ ] package.json 已更新（name、version、description、author）
- [ ] README.md 已更新（如需要）
- [ ] 其他配置文件已更新（如需要）
- [ ] 项目信息准确无误

### 步骤 5: 验证项目完整性

确保改造后的项目能够正常启动和运行：

**执行命令**:
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 在浏览器中访问 http://localhost:5173（或配置的端口）
```

**检查项目**:
- [ ] 依赖安装成功
- [ ] 开发服务器启动成功
- [ ] 浏览器能访问项目
- [ ] 没有控制台错误

**常见问题**:
- 如果依赖安装失败，检查 Node.js 版本和网络连接
- 如果启动失败，检查配置文件是否正确
- 如果有错误，查看错误信息并修复

**验证**:
- [ ] 项目启动成功
- [ ] 浏览器显示项目页面
- [ ] 没有明显的错误或警告

## 💡 最佳实践

### 1. 项目命名规范

- ✅ 使用小写字母和连字符：`my-awesome-project`
- ✅ 名称简洁易记：`user-dashboard`
- ✅ 避免特殊字符和空格
- ❌ 避免大写字母：`MyAwesomeProject`
- ❌ 避免下划线：`my_awesome_project`

### 2. 版本管理

- ✅ 遵循 Semantic Versioning：`MAJOR.MINOR.PATCH`
- ✅ 初始版本通常为 `0.1.0` 或 `1.0.0`
- ✅ 每个版本都有明确的变更说明
- ❌ 避免随意修改版本号

### 3. Git 管理

- ✅ 初始提交应该包含所有脚手架文件
- ✅ 使用清晰的提交信息：`chore: initial commit from scaffold`
- ✅ 定期提交代码变更
- ❌ 避免提交 `node_modules` 和构建产物

### 4. 配置管理

- ✅ 只修改必要的配置
- ✅ 保持脚手架的最佳实践
- ✅ 使用环境变量管理敏感信息
- ❌ 避免硬编码配置值

### 5. 代码质量

- ✅ 遵循项目的编码规范
- ✅ 保持代码的可读性和可维护性
- ✅ 定期进行代码审查
- ❌ 避免复制粘贴代码

## ⚠️ 常见错误

### 错误 1: 克隆失败

**问题**: 执行 `git clone` 时出现错误
**原因**: 
- 网络连接问题
- 没有访问权限
- 仓库地址错误

**解决方案**:
- 检查网络连接
- 确认有访问脚手架仓库的权限
- 验证仓库地址是否正确
- 尝试使用 SSH 或 HTTPS 不同的方式克隆

### 错误 2: 删除 .git 后无法恢复

**问题**: 误删 `.git` 目录后无法恢复历史记录
**原因**: `.git` 目录包含所有版本控制信息

**解决方案**:
- 这是预期行为，删除 `.git` 就是为了移除历史记录
- 如果需要保留历史，不要删除 `.git` 目录
- 可以从远程仓库重新克隆

### 错误 3: 修改配置后项目无法启动

**问题**: 修改 `package.json` 或其他配置后，项目无法启动
**原因**: 
- 配置文件格式错误
- 删除了必要的依赖
- 修改了关键的配置项

**解决方案**:
- 检查 JSON 格式是否正确（使用 JSON 验证工具）
- 恢复删除的依赖
- 查看错误信息，找出问题所在
- 如果无法修复，从脚手架重新克隆

### 错误 4: 依赖安装失败

**问题**: 执行 `npm install` 时出现错误
**原因**: 
- Node.js 版本不兼容
- npm 缓存问题
- 网络连接问题
- 依赖版本冲突

**解决方案**:
- 检查 Node.js 版本是否满足要求
- 清除 npm 缓存：`npm cache clean --force`
- 删除 `node_modules` 和 `package-lock.json`，重新安装
- 检查网络连接
- 查看错误信息，找出具体的依赖问题

### 错误 5: 启动服务器失败

**问题**: 执行 `npm run dev` 时出现错误
**原因**: 
- 端口被占用
- 配置文件错误
- 依赖未正确安装

**解决方案**:
- 检查端口是否被占用：`lsof -i :5173`
- 修改配置文件中的端口
- 重新安装依赖
- 查看错误信息，找出具体问题

## ✅ 验证清单

完成后，验证以下项目：

- [ ] 项目目录已创建，名称符合规范
- [ ] 所有脚手架文件已复制到项目目录
- [ ] 新的 Git 仓库已初始化
- [ ] 初始提交已完成
- [ ] `package.json` 已更新（name、version、description、author）
- [ ] `README.md` 已更新（如需要）
- [ ] 其他配置文件已更新（如需要）
- [ ] 依赖安装成功
- [ ] 开发服务器启动成功
- [ ] 浏览器能访问项目
- [ ] 没有控制台错误
- [ ] 脚手架的核心结构保持不变

## 📚 相关资源

- **详细参考**: [reference.md](./reference.md)
- **使用示例**: [examples.md](./examples.md)
- **验证清单**: [checklist.md](./checklist.md)
- **自动化脚本**: [scripts/init-frontend-project.sh](./scripts/init-frontend-project.sh)
- **项目规范**: [通用规范索引](mdc:.codebuddy/spec/global/standards/common/index.md)
- **脚手架仓库**: https://git.woa.com/hr-team/sdc-std-devkit-team/sdc-std-web.git

## ❓ 常见问题

### Q: 如何修改项目名称？

**A**: 修改 `package.json` 中的 `name` 字段，然后更新 `README.md` 和其他相关文件中的项目名称。

### Q: 如何更改项目的框架（Vue 改 React）？

**A**: 这个 Skill 不支持框架转换。如果需要不同的框架，应该使用对应框架的脚手架。

### Q: 如何添加新的依赖？

**A**: 使用 `npm install package-name` 添加新的依赖，然后提交 `package.json` 和 `package-lock.json` 的变更。

### Q: 如何自定义项目结构？

**A**: 在步骤 5 中改造项目内容时，可以重新组织文件结构。确保不要删除必要的配置文件和启动文件。

### Q: 如何处理环境变量？

**A**: 创建 `.env.example` 文件列出所有需要的环境变量，然后在 `.env` 文件中设置实际值。不要提交 `.env` 文件到 Git。

### Q: 如何验证项目是否正确初始化？

**A**: 使用验证清单检查所有项目，特别是确保项目能够启动并在浏览器中正常显示。
