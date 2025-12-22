# 扩建后端项目模板

## 项目信息

**项目名称**: [项目名称]

**项目描述**: [项目描述]

**项目类型**: 扩建项目 (在现有系统上增加新功能)

**开发周期**: [开始日期] - [结束日期]

**负责人**: [负责人姓名]

**团队成员**: [成员列表]

## 现有系统概况

### 系统架构
- **架构模式**: [单体 / 微服务 / SOA]
- **技术栈**: [Java / Node.js / Python]
- **数据库**: [MySQL / PostgreSQL / MongoDB]
- **缓存**: [Redis / Memcached]

### 现有模块
- 模块 1: [模块说明]
- 模块 2: [模块说明]
- 模块 3: [模块说明]

### 代码库
- 代码库地址: [Git 地址]
- 分支策略: [分支说明]
- 部署环境: [环境说明]

## 扩建内容

### 新增模块

#### 模块 1: [模块名称]

**功能描述**: [功能描述]

**业务价值**: [业务价值]

**技术方案**: [技术方案]

**数据库表**:
- `table_1` - 表说明
- `table_2` - 表说明

**API 接口**:
- `POST /api/v1/resource` - 接口说明
- `GET /api/v1/resource/{id}` - 接口说明

**依赖关系**:
- 依赖现有模块: [模块名称]
- 被依赖模块: [模块名称]

### 修改模块

#### 模块 2: [模块名称]

**修改原因**: [修改原因]

**修改内容**:
- 修改点 1: [修改说明]
- 修改点 2: [修改说明]

**影响范围**:
- 影响模块: [模块名称]
- 影响接口: [接口列表]

**兼容性**: [向后兼容 / 不兼容]

## 技术方案

### 架构设计

#### 模块划分

```
现有系统
├── 模块 A (现有)
├── 模块 B (现有)
└── 模块 C (新增) ← 本次扩建
    ├── Controller
    ├── Service
    ├── DAO
    └── Entity
```

#### 数据流

```
用户请求 → API Gateway → 模块 C (新增) → 模块 A (现有) → 数据库
```

### 数据库设计

#### 新增表

```sql
CREATE TABLE `new_table` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` VARCHAR(100) NOT NULL COMMENT '名称',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` VARCHAR(50) NULL COMMENT '创建人',
  `update_by` VARCHAR(50) NULL COMMENT '更新人',
  `enable_flag` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '启用标记',
  `delete_time` DATETIME NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='新表说明';
```

#### 修改表

```sql
-- 添加字段
ALTER TABLE `existing_table` ADD COLUMN `new_field` VARCHAR(50) NULL COMMENT '新字段';

-- 添加索引
ALTER TABLE `existing_table` ADD INDEX `idx_new_field` (`new_field`);
```

### API 设计

#### 新增接口

**接口路径**: `POST /api/v1/new-resource`

**请求参数**:
```json
{
  "name": "示例",
  "status": 1
}
```

**响应参数**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "name": "示例"
  }
}
```

#### 修改接口

**接口路径**: `PUT /api/v1/existing-resource/{id}`

**修改内容**:
- 新增请求参数: `new_field`
- 新增响应参数: `new_field`

**兼容性**: 向后兼容 (新增字段为可选)

## 集成方案

### 与现有模块集成

#### 调用现有服务

```java
@Service
public class NewService {
    
    @Autowired
    private ExistingService existingService;
    
    public void newMethod() {
        // 调用现有服务
        existingService.existingMethod();
    }
}
```

#### 被现有模块调用

```java
@Service
public class ExistingService {
    
    @Autowired
    private NewService newService;
    
    public void existingMethod() {
        // 调用新服务
        newService.newMethod();
    }
}
```

### 数据迁移

#### 迁移脚本

```sql
-- 数据迁移
INSERT INTO new_table (name, status, create_time)
SELECT name, status, create_time FROM existing_table;
```

#### 迁移策略
- 迁移时间: [时间]
- 迁移方式: [在线 / 离线]
- 回滚方案: [回滚方案]

## 开发规范

### 代码规范
- 遵循现有项目的编码规范
- 保持代码风格一致
- 添加必要的注释

### 测试规范
- 单元测试覆盖率 80%+
- 集成测试覆盖核心流程
- 回归测试确保不影响现有功能

### 文档规范
- 更新 API 文档
- 更新数据库文档
- 更新部署文档

## 部署方案

### 部署步骤

1. **数据库变更**
   - 执行数据库迁移脚本
   - 验证数据迁移结果

2. **代码部署**
   - 部署新代码
   - 验证新功能

3. **配置更新**
   - 更新配置文件
   - 重启服务

4. **验证测试**
   - 功能测试
   - 回归测试

### 回滚方案

1. **代码回滚**
   - 回滚到上一个版本
   - 重启服务

2. **数据库回滚**
   - 执行回滚脚本
   - 验证数据一致性

## 风险评估

### 技术风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|----------|
| 数据迁移失败 | 高 | 低 | 提前测试,准备回滚方案 |
| 性能下降 | 中 | 中 | 性能测试,优化查询 |
| 兼容性问题 | 高 | 低 | 充分测试,灰度发布 |

### 业务风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|----------|
| 影响现有功能 | 高 | 低 | 回归测试,灰度发布 |
| 用户体验下降 | 中 | 低 | 用户测试,快速迭代 |

## 测试方案

### 单元测试
- 新增模块单元测试
- 修改模块单元测试

### 集成测试
- 新旧模块集成测试
- 端到端测试

### 回归测试
- 现有功能回归测试
- 性能回归测试

## 监控与日志

### 监控指标
- 新接口 QPS
- 新接口响应时间
- 新接口错误率

### 日志规范
- 遵循现有日志规范
- 添加必要的日志

## 常见问题

### Q1: 如何确保不影响现有功能?
A: 充分的回归测试 + 灰度发布

### Q2: 如何处理数据迁移?
A: 提前测试 + 准备回滚方案

### Q3: 如何处理兼容性问题?
A: 向后兼容设计 + 版本控制

## 参考资料

- [现有系统文档](link)
- [API 文档](link)
- [数据库文档](link)
