# 技术文档生成示例

本文档提供三个完整的实际项目文档生成示例，展示 `doc-tutorial` Skill 四步连续流程的实际应用。

---

## 📚 示例列表

1. [Spring Boot 用户管理系统](#示例1-spring-boot-用户管理系统)
2. [Vue 电商管理后台](#示例2-vue-电商管理后台)
3. [Python CLI 日志分析工具](#示例3-python-cli-日志分析工具)

---

## 示例1: Spring Boot 用户管理系统

### 项目背景

- **项目名称**: UserManagementSystem
- **项目类型**: Web 应用（RESTful API）
- **技术栈**: Spring Boot 2.7.8 + MyBatis-Plus + MySQL 8.0
- **目标**: 为已有的用户管理系统生成完整的技术文档

---

### 四步流程执行示例

#### 步骤1: 项目分析

**执行的工具调用**:
```bash
# 扫描项目结构
list_files(target_directory=/path/to/UserManagementSystem, depth=2)

# 读取配置文件
read_file(pom.xml)
read_file(src/main/resources/application.yml)

# 读取核心代码
read_file(src/main/java/com/example/ums/UmsApplication.java)
read_file(src/main/java/com/example/ums/controller/UserController.java)
```

**生成的分析报告**:
```markdown
# 项目分析报告

## 技术架构
- 项目类型: Web 应用（RESTful API）
- 编程语言: Java 17
- 核心框架: Spring Boot 2.7.8
- 数据层: MyBatis-Plus 3.5.3
- 数据库: MySQL 8.0

## 核心模块
- 用户管理模块（CRUD操作）
- 角色权限模块
- 认证授权模块（JWT）
- 入口点: UmsApplication.java

## 配置方式
- 配置文件: src/main/resources/application.yml
- 启动命令: mvn spring-boot:run
- 构建命令: mvn clean package
```

---

#### 步骤2: 大纲设计

**生成的文档大纲**:
```markdown
# UserManagementSystem 技术文档

## 1. 概述
- 项目简介
- 主要特性
- 技术栈

## 2. 快速开始
- 环境准备
- 安装与部署
  异常：数据库连接失败 → 检查MySQL服务和配置
- 运行第一个API请求

## 3. 核心应用
- 用户管理API
  - 创建用户
  - 查询用户
  - 更新用户
  - 删除用户
  异常：权限不足 → 检查JWT令牌
- 角色管理API
- 权限管理API

## 4. 配置说明
- 数据库配置
- JWT配置
- 日志配置

## 5. 异常处理
- 常见HTTP错误码
- 数据库连接问题
- 认证授权问题
```

---

#### 步骤3: 内容编写

**生成的文档片段示例**:

```markdown
## 2. 快速开始

### 2.1 环境准备

**系统要求**:
- 操作系统: Linux/macOS/Windows
- JDK 版本: >= 17
- Maven 版本: >= 3.6.0
- MySQL 版本: >= 8.0

**检查环境**:
```bash
# 检查 Java 版本
java -version  # 期望输出: openjdk version "17.0.x"

# 检查 Maven 版本
mvn -version   # 期望输出: Apache Maven 3.6.x
```

### 2.2 安装与部署

**步骤1**: 克隆项目
```bash
git clone https://github.com/example/ums.git
cd ums
```

**步骤2**: 配置数据库
```bash
# 创建数据库
mysql -u root -p
CREATE DATABASE ums_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

**步骤3**: 修改配置文件
在 `src/main/resources/application.yml` 中配置数据库连接：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ums_db
    username: root
    password: your-password
```

将 `your-password` 替换为你的 MySQL 密码。

> ⚠️ **异常处理**:
> 
> **错误1**: `Communications link failure`
> - **原因**: MySQL 服务未启动
> - **解决**: 启动 MySQL 服务 `sudo service mysql start`
> - **验证**: 运行 `mysql -u root -p` 测试连接
> 
> **错误2**: `Access denied for user 'root'@'localhost'`
> - **原因**: 数据库密码错误
> - **解决**: 检查 application.yml 中的密码配置
> - **验证**: 使用配置的密码登录 MySQL

**步骤4**: 启动应用
```bash
mvn spring-boot:run
```

**验证**: 在控制台看到以下输出即表示启动成功：
```
Started UmsApplication in 3.254 seconds (JVM running for 3.8)
```

### 2.3 运行第一个API请求

**创建用户示例**:
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**预期响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "createdAt": "2025-11-07T10:30:00Z"
  }
}
```

## 3. 核心应用

### 3.1 用户管理API

#### 创建用户

**端点**: `POST /api/users`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| username | String | 是 | 用户名，3-20字符 | "john" |
| email | String | 是 | 邮箱地址 | "john@example.com" |
| password | String | 是 | 密码，6-20字符 | "password123" |

**返回值**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，200表示成功 |
| message | String | 消息 |
| data.id | Long | 用户ID |
| data.username | String | 用户名 |
| data.createdAt | DateTime | 创建时间 |

**代码示例**:
```java
// 1. 导入必要的类
import com.example.ums.entity.User;
import com.example.ums.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

// 2. 定义控制器
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    // 3. 注入服务
    @Autowired
    private UserService userService;
    
    // 4. 创建用户接口
    @PostMapping
    public Result<User> createUser(@RequestBody UserDTO userDTO) {
        // 调用服务层创建用户
        User user = userService.create(userDTO);
        
        // 返回结果
        return Result.success(user);
    }
}
```

> ⚠️ **常见错误**:
> 
> **错误1**: `400 Bad Request - Email already exists`
> - **原因**: 邮箱已被注册
> - **解决**: 使用不同的邮箱地址
> 
> **错误2**: `422 Unprocessable Entity - Password too short`
> - **原因**: 密码少于6个字符
> - **解决**: 确保密码长度在6-20字符之间
```

---

#### 步骤4: 校验优化

**执行的验证**:
```bash
# 验证文件路径
read_file(src/main/resources/application.yml)

# 验证配置项
search_content(directory=., pattern="server.port")

# 确认依赖版本
read_file(pom.xml)
```

**修改说明**:
```markdown
## 修正内容

1. **启动命令更正**
   - 原: `java -jar target/ums.jar`
   - 正: `mvn spring-boot:run`（开发模式）
   - 原因: 根据pom.xml，项目使用spring-boot-maven-plugin

2. **配置文件路径更正**
   - 原: `config/application.yml`
   - 正: `src/main/resources/application.yml`
   - 原因: 根据Maven标准目录结构

3. **端口号确认**
   - 配置项: server.port=8080
   - 来源: application.yml第5行

## 补充内容

1. **JWT配置说明**
   - 补充章节: 4.2 JWT配置
   - 原因: 项目分析报告显示使用JWT认证

2. **异常处理章节**
   - 补充错误: `401 Unauthorized - Invalid token`
   - 原因: 用户手册中提到的常见问题
```

**最终输出**:
- ✅ 技术文档终稿（25页，包含所有修正）
- ✅ 所有文件路径已验证存在
- ✅ 所有命令已确认可执行
- ✅ 所有配置项与项目对齐
- ✅ 参数全部表格化
- ✅ 代码示例完整可运行

---

## 示例2: Vue 电商管理后台

### 项目背景

- **项目名称**: E-Commerce Admin
- **项目类型**: Web 应用（前端）
- **技术栈**: Vue 3 + TypeScript + Vite + TDesign
- **目标**: 为电商管理后台生成开发文档

---

### 关键步骤示例

#### 步骤1: 项目分析（部分）

```markdown
# 项目分析报告

## 技术架构
- 项目类型: Web 应用（前端SPA）
- 编程语言: TypeScript 5.0
- 核心框架: Vue 3.4.0
- 构建工具: Vite 4.3.9
- UI库: TDesign Vue Next 1.3.0
- 状态管理: Pinia 2.1.0

## 核心模块
- 商品管理模块（src/views/products/）
- 订单管理模块（src/views/orders/）
- 用户管理模块（src/views/users/）
- 入口点: src/main.ts

## 配置方式
- 配置文件: vite.config.ts
- 启动命令: npm run dev
- 构建命令: npm run build
```

---

#### 步骤3: 内容编写（片段）

```markdown
## 2. 快速开始

### 2.1 环境准备

**系统要求**:
- Node.js: >= 18.16.0
- npm: >= 9.5.0

**检查环境**:
```bash
node --version  # 期望: v18.16.0 或更高
npm --version   # 期望: 9.5.0 或更高
```

### 2.2 安装与启动

**步骤1**: 克隆项目
```bash
git clone https://github.com/example/ecommerce-admin.git
cd ecommerce-admin
```

**步骤2**: 安装依赖
```bash
npm install
```

> ⚠️ **异常处理**:
> 
> **错误**: `npm ERR! code ERESOLVE`
> - **原因**: 依赖版本冲突
> - **解决**: 使用 `npm install --legacy-peer-deps`
> - **验证**: 检查 node_modules 目录已创建

**步骤3**: 启动开发服务器
```bash
npm run dev
```

**验证**: 在控制台看到以下输出即表示成功：
```
VITE v4.3.9  ready in 325 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

### 2.3 访问应用

打开浏览器访问 http://localhost:5173，看到登录页面即为成功。

**默认账号**:
- 用户名: admin
- 密码: admin123

## 3. 核心应用

### 3.1 商品管理

#### 商品列表组件

**文件位置**: `src/views/products/ProductList.vue`

**代码示例**:
```vue
<script setup lang="ts">
// 1. 导入必要的库
import { ref, onMounted } from 'vue';
import { Table, Button, Space, MessagePlugin } from 'tdesign-vue-next';
import type { Product } from '@/types/product';
import { getProducts, deleteProduct } from '@/services/product';

// 2. 状态管理
const products = ref<Product[]>([]);
const loading = ref(false);

// 3. 加载数据
const loadProducts = async () => {
  loading.value = true;
  try {
    const data = await getProducts();
    products.value = data;
  } catch (error) {
    MessagePlugin.error('加载商品列表失败');
  } finally {
    loading.value = false;
  }
};

// 4. 挂载时加载数据
onMounted(() => {
  loadProducts();
});

// 5. 表格列定义
const columns = [
  { colKey: 'id', title: 'ID', width: 80 },
  { colKey: 'name', title: '商品名称' },
  { colKey: 'price', title: '价格' },
  { colKey: 'stock', title: '库存' },
  {
    colKey: 'operation',
    title: '操作',
    cell: (h, { row }) => (
      <Space>
        <Button onClick={() => handleEdit(row)}>编辑</Button>
        <Button theme="danger" onClick={() => handleDelete(row.id)}>
          删除
        </Button>
      </Space>
    ),
  },
];
</script>

<template>
  <t-table
    :data="products"
    :columns="columns"
    :loading="loading"
    row-key="id"
  />
</template>
```

**参数说明**:

**Product 类型定义**:

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| id | number | 商品ID | 1001 |
| name | string | 商品名称 | "iPhone 15 Pro" |
| price | number | 价格（元） | 7999.00 |
| stock | number | 库存数量 | 100 |
| categoryId | number | 分类ID | 5 |
```

---

## 示例3: Python CLI 日志分析工具

### 项目背景

- **项目名称**: LogAnalyzer
- **项目类型**: CLI 工具
- **技术栈**: Python 3.11 + Click + Pandas
- **目标**: 为日志分析工具生成使用指南

---

### 关键步骤示例

#### 步骤1: 项目分析（部分）

```markdown
# 项目分析报告

## 技术架构
- 项目类型: CLI 工具
- 编程语言: Python 3.11
- CLI框架: Click 8.1.3
- 数据处理: Pandas 2.0.3

## 核心模块
- 日志解析模块（src/parser.py）
- 统计分析模块（src/analyzer.py）
- 报告生成模块（src/reporter.py）
- 入口点: src/cli.py

## 配置方式
- 运行命令: python src/cli.py
- 安装: pip install -e .
```

---

#### 步骤3: 内容编写（片段）

```markdown
## 2. 安装

### 2.1 通过 pip 安装

```bash
pip install log-analyzer
```

### 2.2 从源码安装

**步骤1**: 克隆仓库
```bash
git clone https://github.com/example/log-analyzer.git
cd log-analyzer
```

**步骤2**: 创建虚拟环境（推荐）
```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
# 或
venv\Scripts\activate  # Windows
```

**步骤3**: 安装依赖
```bash
pip install -r requirements.txt
```

> ⚠️ **异常处理**:
> 
> **错误**: `error: Microsoft Visual C++ 14.0 is required`
> - **原因**: Windows 环境缺少 C++ 编译器（pandas 依赖）
> - **解决**: 安装 Microsoft C++ Build Tools
>   https://visualstudio.microsoft.com/visual-cpp-build-tools/
> - **验证**: 重新运行 `pip install -r requirements.txt`

**步骤4**: 安装为可执行命令
```bash
pip install -e .
```

**验证**: 运行以下命令确认安装成功：
```bash
log-analyzer --version
# 期望输出: log-analyzer, version 1.0.0
```

## 3. 基础用法

### 3.1 命令行语法

```bash
log-analyzer [OPTIONS] COMMAND [ARGS]...
```

### 3.2 常用命令

#### analyze - 分析日志文件

**用法**:
```bash
log-analyzer analyze <log-file> [OPTIONS]
```

**参数**:

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
|--------|------|------|------|--------|
| log-file | Path | 是 | 日志文件路径 | - |
| --format | String | 否 | 日志格式 | auto |
| --output | Path | 否 | 输出文件路径 | report.html |
| --level | String | 否 | 过滤日志级别 | all |

**示例**:
```bash
# 基础用法
log-analyzer analyze /var/log/app.log

# 指定输出格式
log-analyzer analyze /var/log/app.log --output /tmp/report.json

# 只分析ERROR级别
log-analyzer analyze /var/log/app.log --level ERROR
```

**代码示例**（在Python脚本中使用）:
```python
# 1. 导入必要的模块
from log_analyzer import LogAnalyzer
from pathlib import Path

# 2. 创建分析器实例
analyzer = LogAnalyzer()

# 3. 加载日志文件
log_file = Path('/var/log/app.log')
analyzer.load(log_file)

# 4. 执行分析
results = analyzer.analyze(
    level='ERROR',
    time_range=('2025-11-01', '2025-11-07')
)

# 5. 生成报告
analyzer.generate_report(
    results,
    output='report.html',
    format='html'
)

# 6. 打印统计信息
print(f"Total errors: {results.error_count}")
print(f"Unique errors: {results.unique_errors}")
```

> ⚠️ **常见错误**:
> 
> **错误1**: `FileNotFoundError: [Errno 2] No such file or directory`
> - **原因**: 日志文件路径不存在
> - **解决**: 检查路径是否正确，使用绝对路径
> - **验证**: 运行 `ls /var/log/app.log` 确认文件存在
> 
> **错误2**: `PermissionError: [Errno 13] Permission denied`
> - **原因**: 没有读取日志文件的权限
> - **解决**: 使用 `sudo` 或修改文件权限
>   ```bash
>   sudo log-analyzer analyze /var/log/app.log
>   # 或
>   sudo chmod 644 /var/log/app.log
>   ```
```

---

## 总结

以上三个示例展示了 `doc-tutorial` Skill 在不同项目类型中的应用：

1. **Spring Boot 项目**: 完整展示四步流程，重点在 API 文档和异常处理
2. **Vue 项目**: 展示前端项目的组件文档和类型定义
3. **Python CLI 工具**: 展示命令行工具的参数表格和使用示例

**共同特点**:
- ✅ 结构层次清晰（概述 → 快速开始 → 核心应用 → 配置 → 异常处理）
- ✅ 内容准确完整（基于实际文件，无编造）
- ✅ 示例可复现（完整代码，可直接运行）
- ✅ 表述无歧义（明确路径、版本、命令）
- ✅ 参数表格化（清晰展示）
- ✅ 异常处理完善（错误 + 原因 + 解决 + 验证）
