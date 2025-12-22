# 注解类索引文档

> **生成时间**: 2025-11-21  
> **项目**: RecruitCenterThirdPartyStarter  
> **说明**: 本文档列出项目中的注解类

---

## 📋 注解清单

### 1. EnableRecruitConfig
**路径**: `annotation/EnableRecruitConfig.java`  
**类型**: 配置启用注解  
**目标**: TYPE（类级别）

**功能**: 开启招聘相关的接口服务

**自动导入**:
- RecruitEfficiencyConfiguration
- RecruitDataMarketConfiguration

**使用示例**:
```java
@EnableRecruitConfig
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

---

## 📊 统计信息

- **注解总数**: 1个
- **配置注解**: 1个

---

*文档生成完成*
