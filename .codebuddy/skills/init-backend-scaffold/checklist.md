---
name: init-backend-scaffold
type: checklist
description: 初始化后端脚手架 - 验证清单
---

# 初始化后端脚手架 - 验证清单

## 📋 完成检查清单

使用此清单验证项目初始化是否完成。

### 阶段 1: 环境检查和信息收集

**环境检查**:
- [ ] Java 已安装（JDK 11+）
- [ ] Maven 已安装（推荐，用于 Archetype 方式）
- [ ] Git 已安装（备选，用于克隆方式）

**验证命令**:
```bash
java -version
mvn -version  # 如果使用 Maven Archetype
git --version  # 如果使用 Git 克隆
```

**创建方式选择**:
- [ ] 已检查 Maven 是否安装
- [ ] 已确定使用 Maven Archetype 方式或 Git 克隆方式

#### Maven Archetype 方式信息收集

如果使用 Maven Archetype 方式，需要收集以下信息：

**步骤 1: Spring Boot 版本选择**:
- [ ] 选项 1: Spring Boot 3.x（推荐，Java 17+）
- [ ] 选项 2: Spring Boot 2.x（Java 11+）
- [ ] 已确认 Java 版本满足所选 Spring Boot 版本要求

**步骤 2: 项目包名（groupId）选择**:
- [ ] 选项 1: `com.tencent.hr`（腾讯 HR 团队项目）
- [ ] 选项 2: `com.example`（示例/学习项目）
- [ ] 选项 3: 自定义包名（已输入符合 Java 包名规范的名称）
- [ ] 包名符合规范（全小写、点号分隔、反向域名格式）

**步骤 3: 项目名称（artifactId）输入**:
- [ ] 已输入项目名称
- [ ] 项目名称使用小写字母
- [ ] 多个单词使用连字符（-）分隔
- [ ] 项目名称简洁且具有描述性
- [ ] 项目名称示例：`user-service`、`order-management`

**信息收集示例**:
```
Spring Boot 版本: 选项 1（Spring Boot 3.x）
项目包名: 选项 1（com.tencent.hr）
项目名称: user-service
```

#### Git 克隆方式信息收集

如果使用 Git 克隆方式，需要在后续步骤中手动配置：

**需要准备的信息**:
- [ ] 项目名称（artifactId）
- [ ] 包名（groupId）
- [ ] Spring Boot 版本（2.x 或 3.x）

### 阶段 2: 项目创建

#### 方式 A: Maven Archetype（推荐）

- [ ] Maven 命令执行成功
- [ ] 项目目录已创建
- [ ] `pom.xml` 中的 groupId 和 artifactId 正确
- [ ] 包名已自动配置
- [ ] 所有源代码文件的包名正确
- [ ] 没有创建错误或警告

**验证命令**:
```bash
ls -la {project-name}
cat {project-name}/pom.xml | grep -E "<groupId>|<artifactId>"
find {project-name}/src/main/java -name "*.java" | head -5
```

#### 方式 B: Git 克隆（备选）

- [ ] Git 已安装并配置
- [ ] 有访问脚手架仓库的权限
- [ ] 克隆命令执行成功
- [ ] 项目目录已创建
- [ ] 所有脚手架文件已复制
- [ ] `pom.xml` 文件存在
- [ ] 临时目录已删除
- [ ] 没有克隆错误或警告

**验证命令**:
```bash
ls -la {project-name}
cat {project-name}/pom.xml | head -20
```

### 阶段 3: Git 仓库初始化

- [ ] 新的 `.git` 目录已创建
- [ ] Git 用户信息已配置（可选）
- [ ] 所有文件已添加到暂存区
- [ ] 初始提交已完成
- [ ] 提交信息为 "chore: initial commit from scaffold"
- [ ] `git log` 显示只有一个提交

**验证命令**:
```bash
git log --oneline
git status
```

### 阶段 4: 项目配置验证

> **注意**: 如果使用 Maven Archetype 方式，配置已自动完成，只需验证。

#### pom.xml 验证

- [ ] `groupId` 正确
- [ ] `artifactId` 正确
- [ ] `version` 正确
- [ ] `name` 正确（可选）
- [ ] `description` 正确（可选）
- [ ] XML 格式正确（无语法错误）
- [ ] 所有必要的依赖都存在

**验证命令**:
```bash
cat pom.xml | grep -E "<groupId>|<artifactId>|<version>|<name>|<description>"
mvn validate
```

#### application.yml 修改

- [ ] `spring.application.name` 已更新
- [ ] 数据库连接信息已更新
- [ ] 数据库用户名已更新
- [ ] 数据库密码已更新
- [ ] 服务器端口已配置
- [ ] 日志级别已配置
- [ ] YAML 格式正确

**验证命令**:
```bash
cat src/main/resources/application.yml
```

#### README.md 修改

- [ ] 项目标题已更新
- [ ] 项目描述已更新
- [ ] 快速开始指南已更新
- [ ] 项目结构说明已更新
- [ ] 开发规范已说明
- [ ] 许可证信息已更新
- [ ] Markdown 格式正确

### 阶段 5: 项目结构验证

> **注意**: 如果使用 Maven Archetype 方式，包名已自动配置。

#### 项目结构

- [ ] 包名结构正确
- [ ] 源代码目录存在
- [ ] 资源目录存在
- [ ] 测试目录存在

**验证命令**:
```bash
find src/main/java -type d
find src/main/resources -type f
find src/test/java -type d
```

#### 源代码验证

- [ ] 启动类存在
- [ ] 启动类包名正确
- [ ] 配置文件存在
- [ ] 所有导入语句正确
- [ ] 没有编译错误

**验证命令**:
```bash
mvn clean compile
```

### 阶段 6: 项目编译

- [ ] Java 版本满足要求（11+）
- [ ] Maven 版本满足要求（3.6+）
- [ ] `mvn clean compile` 执行成功
- [ ] 没有编译错误
- [ ] 没有编译警告（或只有可接受的警告）
- [ ] `target` 目录已创建
- [ ] 编译产物已生成

**验证命令**:
```bash
java -version
mvn -version
mvn clean compile
ls -la target/
```

### 阶段 7: 项目测试

- [ ] `mvn test` 执行成功
- [ ] 所有测试都通过
- [ ] 没有测试失败
- [ ] 测试覆盖率满足要求

**验证命令**:
```bash
mvn test
```

### 阶段 8: 项目启动

- [ ] 数据库已启动
- [ ] 数据库连接信息正确
- [ ] `mvn spring-boot:run` 执行成功
- [ ] 应用启动成功
- [ ] 没有启动错误
- [ ] 应用监听正确的端口
- [ ] 没有明显的警告

**验证命令**:
```bash
mvn spring-boot:run
# 在另一个终端检查
curl http://localhost:8080/api/actuator/health
```

### 阶段 9: 项目完整性检查

- [ ] 所有改造都不影响项目启动
- [ ] 项目功能正常
- [ ] 没有破坏脚手架的核心功能
- [ ] 代码遵循项目规范
- [ ] 没有拼写错误
- [ ] 没有格式错误

---

## 🔍 质量检查清单

### 创建方式选择

- [ ] 已检查 Maven 是否安装
- [ ] 已选择合适的创建方式（Archetype 或 Git）
- [ ] 已选择正确的 Spring Boot 版本

### 代码质量

- [ ] 代码遵循 Java 编码规范
- [ ] 没有 IDE 警告
- [ ] 没有未使用的变量或导入
- [ ] 没有控制台错误或警告

**验证命令**:
```bash
mvn clean compile
```

### 文档质量

- [ ] README.md 清晰易懂
- [ ] 所有配置都有说明
- [ ] 快速开始指南完整
- [ ] 项目结构说明准确
- [ ] 没有拼写错误

### 项目结构

- [ ] 目录结构清晰
- [ ] 文件命名规范
- [ ] 没有冗余文件
- [ ] 没有未使用的目录

---

## ⚠️ 常见问题检查

### Maven Archetype 问题

- [ ] Maven 是否已安装？
- [ ] Maven 版本是否满足要求（3.6+）？
- [ ] 是否有网络连接问题？
- [ ] Archetype 版本号是否正确？
- [ ] groupId 和 artifactId 是否符合规范？

### Git 克隆问题

- [ ] 克隆命令是否正确？
- [ ] 是否有网络连接问题？
- [ ] 是否有权限问题？
- [ ] 仓库地址是否正确？

### 配置问题

- [ ] pom.xml 格式是否正确？
- [ ] application.yml 格式是否正确？
- [ ] 是否删除了必要的依赖？
- [ ] 配置文件是否有语法错误？

### 编译问题

- [ ] Java 版本是否满足要求？
- [ ] Maven 版本是否满足要求？
- [ ] 依赖是否完整安装？
- [ ] 是否有编译错误？

### 启动问题

- [ ] 数据库是否已启动？
- [ ] 数据库连接信息是否正确？
- [ ] 端口是否被占用？
- [ ] 是否有配置错误？

### 功能问题

- [ ] 项目是否能正常启动？
- [ ] API 是否能正常访问？
- [ ] 是否有控制台错误？
- [ ] 功能是否正常？

---

## 📊 验证结果

### 全部通过 ✅

如果所有检查项都通过，项目初始化成功！

**Maven Archetype 方式**:
```
✅ 环境检查完成
✅ 项目信息收集完成
✅ Maven Archetype 创建成功
✅ Git 仓库初始化成功
✅ 项目配置验证通过
✅ 项目编译成功
✅ 项目测试通过
✅ 项目启动成功

🎉 项目初始化完成！
```

**Git 克隆方式**:
```
✅ 环境检查完成
✅ 项目信息收集完成
✅ 脚手架克隆成功
✅ Git 仓库初始化成功
✅ 项目配置改造完成
✅ 项目编译成功
✅ 项目测试通过
✅ 项目启动成功

🎉 项目初始化完成！
```

### 部分失败 ⚠️

如果有检查项失败，请：

1. 查看失败的检查项
2. 参考 [常见错误](./SKILL.md#⚠️-常见错误) 部分
3. 查看 [详细参考](./reference.md) 文档
4. 查看 [使用示例](./examples.md) 文档

### 全部失败 ❌

如果大部分检查项失败，建议：

1. 从头开始初始化
2. 仔细阅读 [执行步骤](./SKILL.md#🔄-执行步骤) 部分
3. 参考 [使用示例](./examples.md) 中的完整示例
4. 检查网络连接和权限

---

## 🚀 后续步骤

项目初始化完成后，可以进行以下操作：

### 1. 开始开发

```bash
# 启动开发服务器
mvn spring-boot:run

# 开始编写代码
# 修改 src/main/java 目录下的文件
```

### 2. 提交到 Git

```bash
# 创建功能分支
git checkout -b feature/my-feature

# 提交代码
git add .
git commit -m "feat: add my feature"

# 推送到远程
git push origin feature/my-feature
```

### 3. 构建生产版本

```bash
# 构建 JAR 包
mvn clean package

# 运行 JAR 包
java -jar target/user-service-0.1.0.jar
```

### 4. 部署项目

```bash
# 使用 Docker 部署
docker build -t user-service:0.1.0 .
docker run -p 8080:8080 user-service:0.1.0

# 或使用 Docker Compose
docker-compose up
```

---

## 📞 需要帮助？

如果在初始化过程中遇到问题，请：

1. 查看 [常见错误](./SKILL.md#⚠️-常见错误) 部分
2. 查看 [详细参考](./reference.md) 文档
3. 查看 [使用示例](./examples.md) 文档
4. 查看 [常见问题](./SKILL.md#❓-常见问题) 部分

---

## 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.0 | 2025-11-04 | 初始版本 |

---

## 许可证

MIT
