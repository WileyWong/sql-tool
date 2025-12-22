# 环境配置索引

> **项目**: {{PROJECT_NAME}}  
> **生成时间**: {{SCAN_DATE}}

---

## 环境列表

| 环境 | 配置文件 | 用途 |
|------|----------|------|
| local | application-local.yml | 本地开发 |
| dev | application-dev.yml | 开发环境 |
| test | application-test.yml | 测试环境 |
| prod | application-prod.yml | 生产环境 |

---

## 配置差异

### 数据库配置

| 环境 | 数据库地址 | 数据库名 |
|------|-----------|---------|
| local | localhost:3306 | project_local |
| dev | dev-db:3306 | project_dev |
| prod | prod-db:3306 | project_prod |

### Redis配置

| 环境 | Redis地址 | 数据库 |
|------|----------|--------|
| local | localhost:6379 | 0 |
| dev | dev-redis:6379 | 0 |
| prod | prod-redis:6379 | 0 |

---

## 启动方式

```bash
# 本地开发
java -jar app.jar --spring.profiles.active=local

# 生产环境
java -jar app.jar --spring.profiles.active=prod
```
