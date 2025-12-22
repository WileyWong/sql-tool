# 重构后端项目模板

## 项目信息

**项目名称**: [项目名称]

**项目描述**: [项目描述]

**项目类型**: 重构项目 (技术栈升级或架构调整)

**开发周期**: [开始日期] - [结束日期]

**负责人**: [负责人姓名]

**团队成员**: [成员列表]

## 重构背景

### 现状分析

**技术债务**:
- 技术栈老旧: [具体问题]
- 代码质量差: [具体问题]
- 性能瓶颈: [具体问题]
- 维护成本高: [具体问题]

**业务影响**:
- 开发效率低: [具体影响]
- 上线周期长: [具体影响]
- 故障率高: [具体影响]

### 重构目标

**技术目标**:
- 技术栈升级: [目标版本]
- 代码质量提升: [目标指标]
- 性能提升: [目标指标]
- 可维护性提升: [目标指标]

**业务目标**:
- 开发效率提升: [目标指标]
- 上线周期缩短: [目标指标]
- 故障率降低: [目标指标]

## 重构方案

### 技术栈升级

#### 升级前

| 组件 | 版本 | 问题 |
|------|------|------|
| Java | 8 | 版本老旧,缺少新特性 |
| Spring Boot | 2.3 | 安全漏洞,性能问题 |
| MyBatis | 3.4 | 功能不足 |
| MySQL | 5.7 | 性能瓶颈 |

#### 升级后

| 组件 | 版本 | 优势 |
|------|------|------|
| Java | 17 | 新特性,性能提升 |
| Spring Boot | 3.0 | 安全性,性能提升 |
| MyBatis Plus | 3.5 | 功能丰富,开发效率高 |
| MySQL | 8.0 | 性能提升,新特性 |

### 架构调整

#### 调整前

```
单体架构
├── Controller
├── Service
├── DAO
└── Entity
```

**问题**:
- 模块耦合严重
- 难以扩展
- 部署困难

#### 调整后

```
微服务架构
├── 用户服务
├── 订单服务
├── 商品服务
└── 支付服务
```

**优势**:
- 模块解耦
- 易于扩展
- 独立部署

### 代码重构

#### 重构原则

1. **单一职责原则** (SRP)
   - 一个类只负责一个功能

2. **开闭原则** (OCP)
   - 对扩展开放,对修改关闭

3. **依赖倒置原则** (DIP)
   - 依赖抽象,不依赖具体

4. **接口隔离原则** (ISP)
   - 接口应该小而专

5. **迪米特法则** (LoD)
   - 最少知识原则

#### 重构示例

**重构前**:
```java
public class UserService {
    
    public void createUser(String username, String password, String email) {
        // 参数校验
        if (username == null || username.isEmpty()) {
            throw new IllegalArgumentException("用户名不能为空");
        }
        
        // 密码加密
        String encryptedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
        
        // 保存用户
        User user = new User();
        user.setUsername(username);
        user.setPassword(encryptedPassword);
        user.setEmail(email);
        userRepository.save(user);
        
        // 发送邮件
        emailService.sendWelcomeEmail(email);
    }
}
```

**重构后**:
```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private EmailService emailService;
    
    @Transactional
    public User createUser(CreateUserRequest request) {
        // 参数校验 (使用 Bean Validation)
        validateRequest(request);
        
        // 创建用户
        User user = buildUser(request);
        user = userRepository.save(user);
        
        // 发送欢迎邮件 (异步)
        emailService.sendWelcomeEmailAsync(user.getEmail());
        
        return user;
    }
    
    private void validateRequest(CreateUserRequest request) {
        // 使用 Bean Validation
    }
    
    private User buildUser(CreateUserRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        return user;
    }
}
```

## 数据迁移

### 迁移策略

#### 双写方案

```
1. 新旧系统同时运行
2. 写操作同时写入新旧系统
3. 读操作从旧系统读取
4. 数据一致性校验
5. 切换读操作到新系统
6. 下线旧系统
```

#### 迁移步骤

1. **数据结构迁移**
   ```sql
   -- 创建新表
   CREATE TABLE new_users LIKE old_users;
   
   -- 迁移数据
   INSERT INTO new_users SELECT * FROM old_users;
   ```

2. **数据校验**
   ```sql
   -- 校验数据一致性
   SELECT COUNT(*) FROM old_users;
   SELECT COUNT(*) FROM new_users;
   ```

3. **增量同步**
   ```sql
   -- 同步增量数据
   INSERT INTO new_users 
   SELECT * FROM old_users 
   WHERE id > (SELECT MAX(id) FROM new_users);
   ```

## 兼容性处理

### API 兼容性

#### 版本控制

**旧版本 API**:
```
GET /api/v1/users
```

**新版本 API**:
```
GET /api/v2/users
```

**兼容策略**:
- 保留旧版本 API (6 个月)
- 新版本 API 提供新功能
- 逐步迁移用户到新版本
- 6 个月后下线旧版本

### 数据兼容性

#### 字段映射

**旧字段**:
```java
private String userName;  // 驼峰命名
```

**新字段**:
```java
private String username;  // 小写命名
```

**兼容策略**:
```java
@JsonProperty("userName")  // 兼容旧字段
private String username;
```

## 灰度发布

### 灰度策略

#### 阶段 1: 内部测试 (1%)

- 时间: 1 周
- 用户: 内部员工
- 监控: 错误率、性能指标

#### 阶段 2: 小范围灰度 (10%)

- 时间: 1 周
- 用户: 部分用户
- 监控: 错误率、性能指标、用户反馈

#### 阶段 3: 扩大灰度 (50%)

- 时间: 1 周
- 用户: 一半用户
- 监控: 错误率、性能指标、用户反馈

#### 阶段 4: 全量发布 (100%)

- 时间: 1 周
- 用户: 所有用户
- 监控: 错误率、性能指标、用户反馈

### 灰度实现

```java
@Service
public class FeatureToggleService {
    
    public boolean useNewSystem(Long userId) {
        // 根据用户 ID 灰度
        int percentage = getGrayPercentage();
        return userId % 100 < percentage;
    }
    
    private int getGrayPercentage() {
        // 从配置中心获取灰度比例
        return configService.getInt("gray.percentage", 0);
    }
}
```

## 测试方案

### 单元测试

- 测试框架: JUnit 5
- 覆盖率要求: 80%+
- Mock 工具: Mockito

### 集成测试

- 测试框架: Spring Boot Test
- 测试场景: API 接口测试

### 性能测试

- 测试工具: JMeter
- 测试指标: QPS、响应时间、错误率
- 测试场景: 核心业务流程

### 压力测试

- 测试工具: JMeter
- 测试目标: 找到系统瓶颈
- 测试场景: 高并发场景

## 监控与日志

### 监控指标

**系统指标**:
- CPU 使用率
- 内存使用率
- 磁盘使用率
- 网络流量

**应用指标**:
- QPS
- 响应时间
- 错误率
- 慢查询

**业务指标**:
- 用户活跃度
- 转化率
- 订单量

### 日志规范

- 日志级别: DEBUG, INFO, WARN, ERROR
- 日志格式: `[时间] [级别] [类名] - 日志内容`
- 日志存储: 文件 + ELK

## 回滚方案

### 回滚条件

- 错误率超过 5%
- 性能下降超过 30%
- 用户反馈严重问题

### 回滚步骤

1. **停止灰度发布**
2. **切换流量到旧系统**
3. **回滚数据库**
4. **验证功能**

## 风险评估

### 技术风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|----------|
| 数据迁移失败 | 高 | 中 | 充分测试,准备回滚方案 |
| 性能下降 | 高 | 中 | 性能测试,灰度发布 |
| 兼容性问题 | 高 | 中 | 充分测试,版本控制 |

### 业务风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|----------|
| 业务中断 | 高 | 低 | 灰度发布,快速回滚 |
| 用户流失 | 高 | 低 | 用户沟通,快速迭代 |

## 上线计划

### 上线步骤

1. **准备阶段** (1 周)
   - 代码审查
   - 测试验证
   - 部署准备

2. **灰度发布** (4 周)
   - 内部测试 (1%)
   - 小范围灰度 (10%)
   - 扩大灰度 (50%)
   - 全量发布 (100%)

3. **稳定观察** (2 周)
   - 监控指标
   - 用户反馈
   - 问题修复

4. **下线旧系统** (1 周)
   - 数据归档
   - 系统下线

### 上线检查清单

- [ ] 代码审查完成
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 性能测试通过
- [ ] 数据迁移方案确定
- [ ] 灰度发布计划确定
- [ ] 监控指标确定
- [ ] 回滚方案准备

## 常见问题

### Q1: 如何确保数据不丢失?
A: 双写方案 + 数据校验 + 回滚方案

### Q2: 如何处理兼容性问题?
A: 版本控制 + 向后兼容设计

### Q3: 如何快速回滚?
A: 准备回滚方案 + 自动化部署

## 参考资料

- [重构: 改善既有代码的设计](https://book.douban.com/subject/4262627/)
- [微服务架构设计模式](https://book.douban.com/subject/33425123/)
- [Spring Boot 官方文档](https://spring.io/projects/spring-boot)
