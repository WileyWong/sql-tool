---
command_id: tools.init-project
command_name: 初始化项目
category: tools
description: 初始化项目 - 通过交互式对话询问用户需要初始化前端、后端还是前后端，然后调用对应的 Skill 快速创建完整的项目结构，并初始化项目记忆系统
---

## 🎯 用途

通过交互式对话与用户沟通，询问用户需要初始化的项目类型（前端、后端或前后端），然后根据用户的选择调用对应的 Skill，快速创建完整的项目结构，包括：

- ✅ 前端项目脚手架（可选）
- ✅ 后端项目脚手架（可选）
- ✅ 配置开发环境
- ✅ 生成基础代码结构
- ✅ 安装项目依赖
- ✅ 初始化项目记忆系统（constitution.md、guidelines.md、context.md）

## 📋 前置条件

**通用前置条件**:
- [ ] Git 已安装并配置
- [ ] 当前工作目录有写入权限
- [ ] 项目名称未被占用（目录不存在）

**前端项目前置条件**:
- [ ] Node.js 和 npm 已安装（版本 >= 16.0.0）
- [ ] 有访问前端脚手架仓库的权限

**后端项目前置条件**:
- [ ] Java Jdk 已安装
- [ ] 有访问后端脚手架仓库的权限

## 🔄 执行流程

### 步骤 1: 一次性收集所有信息

与用户进行单次交互，收集所有必要信息。若信息不完整，提供推荐值让用户选择,尽可能给出推荐建议让用户选择减少用户初始化负担。

> **重要**：如果用户明确说明了是前端，那么只调用前端 Skill，如果用户说了“仅后端”，那么只调用后端端 Skill，用户没说你就要问用户选择，最好一次性收集，不要有太多交互

**交互示例**:
```
🚀 项目初始化向导

【1️⃣ 项目类型】请选择项目类型:
  [仅前端 (Vue 3 + Vite)]  [仅后端 (Spring Boot)]  [前后端一体]

---

【2️⃣ 前端配置】(如果选择了前端)
项目名称: 
  [使用推荐名称: my-frontend]  [自定义名称...]

---

【3️⃣ 后端配置】(如果选择了后端)
项目名称:
  [使用推荐名称: my-backend]  [自定义名称...]

Spring Boot 版本:
  [Spring Boot 2.x]  [Spring Boot 3.x (推荐)]

---

【4️⃣ 可选信息】
项目描述:
  [跳过]  [填写描述...]

作者信息:
  [跳过]  [填写作者...]

---

✅ 配置确认
请确认以上配置:
  • 项目类型: [显示用户选择]
  • 前端项目: [显示项目名或"无"]
  • 后端项目: [显示项目名或"无"]
  • Spring Boot版本: [显示版本或"无"]
  • 项目描述: [显示描述或"无"]
  • 作者信息: [显示作者或"无"]

[✓ 确认并开始初始化]  [✗ 取消]
```

**信息收集规范**:

| 字段 | 必需 | 来源 | 处理          |
|------|------|------|-------------|
| 项目类型 | ✅ | 用户选择 | 决定调用 Skill  |
| 前端项目名 | ✅ | 用户输入 | 验证格式        |
| 后端项目名 | ✅ | 用户输入 | 验证格式        |
| Spring Boot | ❌ | 用户选择 | 选择2.x 或 3.x |
| 描述 | ❌ | 用户输入 | 默认=项目名      |
| 作者 | ❌ | 用户输入 | 默认=空        |

### 步骤 2: 验证信息完整性

- 项目名称：小写字母、数字、连字符，长度 <= 128
- 目录检查：项目目录不存在

若验证失败，返回步骤 1 让用户修正。

### 步骤 3: 调用对应的 Skill

根据用户选择的项目类型，传递完整信息调用对应技能来初始化项目 技能Skill：`init-frontend-scaffold`，`init-backend-scaffold`

> 如果用户说了“仅前端”，则只调用前端 Skill，如果用户说了“仅后端”，则只调用后端端 Skill，用户没说你就要问用户选择，最好一次性收集

**选项 1 (仅前端)**: 
```
skill: init-frontend-scaffold
input:
  project_name: {前端项目名}
  description: {描述}
  author: {用户信息}
```

**选项 2 (仅后端)**:
```
skill: init-backend-scaffold
input:
  project_name: {后端项目名}
  springboot_version: {Spring Boot版本}
  description: {描述}
  author: {用户信息}
```

**选项 3 (前后端)**:
```
# 先调用前端 Skill，再调用后端 Skill（传递同一组参数）
```

### 步骤 3: 初始化项目记忆系统

项目脚手架创建完成后，回到工程根目录，调用技能 `init-project-memory` 初始化项目记忆 初始化项目记忆系统。AI 助手需要：
  **触发 Skill**
   - 调用 [init-project-memory Skill](mdc:skills/init-project-memory/SKILL.md)
   - 传递必要的参数（项目信息、用户语言等）

**参考**: [init-memory Command](mdc:global/commands/init/init-memory.md) 了解详细的项目记忆初始化流程

**3.5 验证项目记忆**:
- [ ] `.spec-code/memory/constitution.md` 已创建
- [ ] `.spec-code/memory/guidelines.md` 已创建
- [ ] `.spec-code/memory/context.md` 已创建
- [ ] 所有文件格式正确 (Markdown + YAML Frontmatter)
- [ ] 所有必填字段已填充
- [ ] 所有内容使用了用户的语言 (中文/英文，不混合)

### 步骤 4: 显示初始化结果

初始化完成后，向用户显示以下信息：

**成功提示**:
```
✨ 项目初始化完成！

📁 项目位置:
  - 前端: {当前工作目录}/{前端项目名称}
  - 后端: {当前工作目录}/{后端项目名称}

📚 项目记忆系统:
  - ✅ .spec-code/memory/constitution.md - 项目宪章
  - ✅ .spec-code/memory/guidelines.md - 开发指南
  - ✅ .spec-code/memory/context.md - 项目上下文

🚀 后续步骤:

【前端项目】
  1. 进入项目目录: cd {前端项目名称}
  2. 启动开发服务器: npm run dev
  3. 访问应用: http://localhost:5173

【后端项目】
  1. 进入项目目录: cd {后端项目名称}
  2. 启动应用: mvn spring-boot:run
  3. 访问应用: http://localhost:8080/api/doc.html

【项目记忆】
  1. 查看项目宪章: cat .spec-code/memory/constitution.md
  2. 查看开发指南: cat .spec-code/memory/guidelines.md
  3. 查看项目上下文: cat .spec-code/memory/context.md

📚 更多信息:
  - 查看各项目的 README.md 了解项目结构
  - 查看各项目的配置文件了解依赖和脚本
  - 查看 src/ 目录了解源代码
```

### 步骤 5: 验证项目完整性

验证初始化后的项目是否完整（参考各 Command 的验证清单）。

## 📝 输出格式

### 项目结构（前后端一体）

```
工程根目录/
├── {frontend-project-name}/        # 前端项目
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── README.md
│   └── .git/
└── {backend-project-name}/         # 后端项目
    ├── src/
    ├── pom.xml
    ├── README.md
    └── .git/
```

## ✅ 验证清单

初始化完成后，验证以下项目：

**前端项目**:
- [ ] 前端项目目录已创建
- [ ] 所有前端脚手架文件已克隆
- [ ] package.json 已正确修改
- [ ] README.md 已正确修改
- [ ] npm 依赖已安装
- [ ] 前端项目可以启动

**后端项目**:
- [ ] 后端项目目录已创建
- [ ] 所有后端脚手架文件已克隆
- [ ] pom.xml 已正确修改
- [ ] application.yml 已正确修改
- [ ] README.md 已正确修改
- [ ] Maven 依赖已安装
- [ ] 后端项目可以启动

**通用**:
- [ ] 所有项目的 .git 目录已初始化
- [ ] 所有项目的初始提交已完成
- [ ] 没有错误或警告

## 🔗 相关资源

### Commands
- **前端初始化**: [init-frontend](./init-frontend.md) - 初始化前端项目（Vue 3 + Vite + TypeScript）
- **后端初始化**: [init-backend](./init-backend.md) - 初始化后端项目（Spring Boot + Maven）
- **项目记忆**: [init-memory](init-memory.md) - 初始化项目记忆系统

### Skills
- **前端脚手架 Skill**: [init-frontend-scaffold](mdc:global/skills/init-frontend-scaffold/SKILL.md)
- **后端脚手架 Skill**: [init-backend-scaffold](mdc:global/skills/init-backend-scaffold/SKILL.md)
- **后端脚手架 Skill**: [init-project-memory](mdc:global/skills/init-project-memory/SKILL.md)

### 文档
- **Init Commands 总览**: [README.md](README.md)
- **文档生成原则**: [document-generation-rules.md](mdc:.codebuddy/spec/global/standards/common/document-generation-rules.md)

## ❓ 常见问题

### Q: 如何只初始化前端或后端？

**A**: 在步骤 1 选择对应的选项即可。选项 1 仅初始化前端，选项 2 仅初始化后端。

### Q: 前后端项目名称可以相同吗？

**A**: 不建议相同，因为它们会在同一目录下创建。建议使用不同的名称，如 `my-frontend` 和 `my-backend`。

### Q: 项目记忆系统是什么？

**A**: 项目记忆系统包括三个文件：
- **constitution.md** - 项目宪章，定义核心原则和技术约束
- **guidelines.md** - 开发指南，定义编码规范和最佳实践
- **context.md** - 项目上下文，记录当前技术栈和项目状态

这些文件帮助 AI 助手更好地理解项目，提供更准确的建议。

### Q: 如何修改项目记忆？

**A**: 初始化完成后，可以直接编辑工程目录下 `.spec-code/memory/` 目录中的文件，或重新运行 [init-memory](init-memory.md) Command 覆盖。

### Q: 如何修改项目信息？

**A**: 初始化完成后，可以手动修改各项目的配置文件（package.json、pom.xml 等）。

### Q: 如何处理初始化失败？

**A**: 检查前置条件是否满足，查看错误信息，然后根据错误信息进行修复。
