# MyBatis-Plus 开发规范

## Entity 实体类

### 基本规范

> **强制要求**: 所有字段必须使用 `@TableField` 注解标注实际的数据库字段名，确保字段映射明确可追溯。

```java
@Data
@TableName("t_user")
public class User {
    
    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;
    
    /**
     * 用户名
     */
    @TableField("username")
    private String username;
    
    /**
     * 密码（加密存储）
     */
    @TableField("password")
    private String password;
    
    /**
     * 邮箱
     */
    @TableField("email")
    private String email;
    
    /**
     * 状态：0-禁用，1-启用
     */
    @TableField("status")
    private Integer status;
    
    /**
     * 创建时间
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    /**
     * 逻辑删除标记：0-未删除，1-已删除
     */
    @TableField("deleted")
    @TableLogic(value = "0", delval = "1")
    private Integer deleted;
    
    /**
     * 乐观锁版本号
     */
    @TableField("version")
    @Version
    private Integer version;
}
```

### 常用注解

| 注解 | 说明 | 示例 |
|------|------|------|
| `@TableName` | 表名映射 | `@TableName("t_user")` |
| `@TableId` | 主键标识 | `@TableId(value = "id", type = IdType.ASSIGN_ID)` |
| `@TableField` | **字段映射（必填）** | `@TableField("user_name")` |
| `@TableLogic` | 逻辑删除 | `@TableField("deleted") @TableLogic(value = "0", delval = "1")` |
| `@Version` | 乐观锁 | `@TableField("version") @Version` |

### @TableField 使用规范

> **强制**: 所有字段必须添加 `@TableField` 注解，明确标注数据库字段名。

```java
// ✅ 正确：所有字段都有 @TableField
@TableField("username")
private String username;

@TableField("user_name")  // 驼峰转下划线
private String userName;

@TableField(value = "create_time", fill = FieldFill.INSERT)  // 带自动填充
private LocalDateTime createTime;

// ❌ 错误：缺少 @TableField
private String username;  // 依赖隐式映射，不可追溯
```

**为什么强制要求 @TableField**：
1. **明确映射关系** - 代码即文档，字段与数据库列一一对应
2. **避免隐式转换问题** - 不依赖 MyBatis-Plus 的驼峰转换配置
3. **便于代码审查** - 一眼可见数据库字段名
4. **支持字段重命名** - 数据库字段变更时只需修改注解

### 主键策略

| 策略 | 说明 | 推荐场景 |
|------|------|---------|
| `IdType.ASSIGN_ID` | 雪花算法（推荐） | 分布式系统 |
| `IdType.AUTO` | 数据库自增 | 单机系统 |
| `IdType.ASSIGN_UUID` | UUID | 需要字符串主键 |
| `IdType.INPUT` | 手动输入 | 特殊场景 |

### 基础实体类

```java
@Data
public abstract class BaseEntity {
    
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;
    
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableField(value = "create_by", fill = FieldFill.INSERT)
    private Long createBy;
    
    @TableField(value = "update_by", fill = FieldFill.INSERT_UPDATE)
    private Long updateBy;
    
    @TableField("deleted")
    @TableLogic(value = "0", delval = "1")
    private Integer deleted;
}

// 业务实体继承基础实体
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("t_user")
public class User extends BaseEntity {
    
    @TableField("username")
    private String username;
    
    @TableField("password")
    private String password;
    
    @TableField("email")
    private String email;
    
    @TableField("status")
    private Integer status;
}
```

## Mapper 接口

### 基本定义

```java
@Mapper
public interface UserMapper extends BaseMapper<User> {
    
    /**
     * 根据用户名查询
     */
    default User selectByUsername(String username) {
        return selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, username));
    }
    
    /**
     * 根据邮箱查询
     */
    default User selectByEmail(String email) {
        return selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getEmail, email));
    }
    
    /**
     * 批量查询用户
     */
    default List<User> selectByIds(Collection<Long> ids) {
        if (CollectionUtils.isEmpty(ids)) {
            return Collections.emptyList();
        }
        return selectList(new LambdaQueryWrapper<User>()
                .in(User::getId, ids));
    }
}
```

### 复杂查询（XML）

```xml
<!-- UserMapper.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" 
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.mapper.UserMapper">
    
    <!-- 关联查询 -->
    <select id="selectUserWithRoles" resultMap="UserWithRolesMap">
        SELECT u.*, r.id as role_id, r.name as role_name
        FROM t_user u
        LEFT JOIN t_user_role ur ON u.id = ur.user_id
        LEFT JOIN t_role r ON ur.role_id = r.id
        WHERE u.id = #{id} AND u.deleted = 0
    </select>
    
    <resultMap id="UserWithRolesMap" type="User">
        <id property="id" column="id"/>
        <result property="username" column="username"/>
        <collection property="roles" ofType="Role">
            <id property="id" column="role_id"/>
            <result property="name" column="role_name"/>
        </collection>
    </resultMap>
    
</mapper>
```

## 查询构造器

### LambdaQueryWrapper

```java
// ✅ 推荐：Lambda 方式（类型安全）
LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
wrapper.eq(User::getStatus, 1)
       .like(StringUtils.hasText(name), User::getUsername, name)
       .ge(startTime != null, User::getCreateTime, startTime)
       .le(endTime != null, User::getCreateTime, endTime)
       .orderByDesc(User::getCreateTime);

List<User> users = userMapper.selectList(wrapper);

// ❌ 不推荐：字符串方式（容易出错）
QueryWrapper<User> wrapper = new QueryWrapper<>();
wrapper.eq("status", 1)
       .like("username", name);  // 字段名拼写错误不会编译报错
```

### LambdaUpdateWrapper

```java
// ✅ 推荐：Lambda 更新方式
LambdaUpdateWrapper<User> updateWrapper = new LambdaUpdateWrapper<>();
updateWrapper.set(User::getStatus, 0)
             .set(User::getUpdateTime, LocalDateTime.now())
             .eq(User::getId, userId);
userMapper.update(null, updateWrapper);

// 条件更新示例
LambdaUpdateWrapper<User> wrapper = new LambdaUpdateWrapper<>();
wrapper.set(User::getStatus, 1)
       .set(StringUtils.hasText(email), User::getEmail, email)  // 条件设置
       .eq(User::getId, userId)
       .eq(User::getStatus, 0);  // 只更新状态为0的记录
int rows = userMapper.update(null, wrapper);
```

### 常用条件方法

| 方法 | SQL | 示例 |
|------|-----|------|
| `eq` | `=` | `.eq(User::getStatus, 1)` |
| `ne` | `<>` | `.ne(User::getStatus, 0)` |
| `gt` / `ge` | `>` / `>=` | `.ge(User::getAge, 18)` |
| `lt` / `le` | `<` / `<=` | `.le(User::getAge, 60)` |
| `like` | `LIKE '%x%'` | `.like(User::getName, "张")` |
| `likeLeft` | `LIKE '%x'` | `.likeLeft(User::getName, "三")` |
| `likeRight` | `LIKE 'x%'` | `.likeRight(User::getName, "张")` |
| `in` | `IN` | `.in(User::getId, ids)` |
| `notIn` | `NOT IN` | `.notIn(User::getId, ids)` |
| `between` | `BETWEEN` | `.between(User::getAge, 18, 60)` |
| `isNull` | `IS NULL` | `.isNull(User::getEmail)` |
| `isNotNull` | `IS NOT NULL` | `.isNotNull(User::getEmail)` |
| `orderByAsc` | `ORDER BY ASC` | `.orderByAsc(User::getCreateTime)` |
| `orderByDesc` | `ORDER BY DESC` | `.orderByDesc(User::getCreateTime)` |

### 条件判断

```java
// ✅ 使用 condition 参数（推荐）
wrapper.eq(status != null, User::getStatus, status)
       .like(StringUtils.hasText(name), User::getUsername, name);

// ❌ 不推荐：外部 if 判断
if (status != null) {
    wrapper.eq(User::getStatus, status);
}
if (StringUtils.hasText(name)) {
    wrapper.like(User::getUsername, name);
}
```

## 分页查询

### 配置分页插件

```java
@Configuration
public class MybatisPlusConfig {
    
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        // 分页插件
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        // 乐观锁插件
        interceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor());
        return interceptor;
    }
}
```

### 分页查询示例

```java
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    
    @Override
    public PageResult<User> listUsers(UserQueryRequest request, Integer pageNum, Integer pageSize) {
        // 1. 构建分页对象（推荐使用静态方法）
        Page<User> page = Page.of(pageNum, pageSize);
        
        // 2. 构建查询条件
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(request.getUsername()), 
                    User::getUsername, request.getUsername())
               .eq(request.getStatus() != null, User::getStatus, request.getStatus())
               .orderByDesc(User::getCreateTime);
        
        // 3. 执行分页查询
        Page<User> result = userMapper.selectPage(page, wrapper);
        
        // 4. 封装返回结果
        return PageResult.of(result.getRecords(), result.getTotal(), pageNum, pageSize);
    }
}
```

### 分页结果封装

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageResult<T> {
    
    private List<T> records;
    private long total;
    private int pageNum;
    private int pageSize;
    private int pages;
    
    public static <T> PageResult<T> of(List<T> records, long total, int pageNum, int pageSize) {
        PageResult<T> result = new PageResult<>();
        result.setRecords(records);
        result.setTotal(total);
        result.setPageNum(pageNum);
        result.setPageSize(pageSize);
        result.setPages((int) Math.ceil((double) total / pageSize));
        return result;
    }
    
    public <R> PageResult<R> map(Function<T, R> converter) {
        List<R> newRecords = records.stream()
                .map(converter)
                .collect(Collectors.toList());
        return PageResult.of(newRecords, total, pageNum, pageSize);
    }
}
```

## 自动填充

### 配置填充处理器

```java
@Component
public class MyMetaObjectHandler implements MetaObjectHandler {
    
    @Override
    public void insertFill(MetaObject metaObject) {
        LocalDateTime now = LocalDateTime.now();
        this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, now);
        this.strictInsertFill(metaObject, "updateTime", LocalDateTime.class, now);
        
        // 填充创建人（从上下文获取）
        Long userId = SecurityContextHolder.getUserId();
        if (userId != null) {
            this.strictInsertFill(metaObject, "createBy", Long.class, userId);
            this.strictInsertFill(metaObject, "updateBy", Long.class, userId);
        }
    }
    
    @Override
    public void updateFill(MetaObject metaObject) {
        this.strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
        
        Long userId = SecurityContextHolder.getUserId();
        if (userId != null) {
            this.strictUpdateFill(metaObject, "updateBy", Long.class, userId);
        }
    }
}
```

## 逻辑删除

### 配置

```yaml
mybatis-plus:
  global-config:
    db-config:
      logic-delete-field: deleted
      logic-delete-value: 1
      logic-not-delete-value: 0
```

### 使用

```java
// 逻辑删除（实际执行 UPDATE）
userMapper.deleteById(1L);
// SQL: UPDATE t_user SET deleted = 1 WHERE id = 1 AND deleted = 0

// 查询自动过滤已删除数据
userMapper.selectList(null);
// SQL: SELECT * FROM t_user WHERE deleted = 0
```

## 乐观锁

### 使用示例

```java
// 1. 先查询
User user = userMapper.selectById(1L);

// 2. 修改
user.setUsername("newName");

// 3. 更新（自动带上版本号条件）
int rows = userMapper.updateById(user);
// SQL: UPDATE t_user SET username='newName', version=version+1 
//      WHERE id=1 AND version=1

if (rows == 0) {
    throw new BusinessException("数据已被修改，请刷新后重试");
}
```

## 检查清单

- [ ] 实体类使用 `@TableName` 指定表名
- [ ] 主键使用 `@TableId(value = "xxx", type = ...)`
- [ ] **所有字段使用 `@TableField` 标注数据库字段名**
- [ ] `@TableLogic` 显式指定 `value` 和 `delval`
- [ ] 使用 `LambdaQueryWrapper` / `LambdaUpdateWrapper`（类型安全）
- [ ] 条件判断使用 condition 参数
- [ ] 配置分页插件，使用 `Page.of()` 静态方法
- [ ] 配置自动填充（createTime/updateTime）
- [ ] Service 继承 `IService<T>`，ServiceImpl 继承 `ServiceImpl<M, T>`
- [ ] 使用逻辑删除
- [ ] 并发场景使用乐观锁

## 批量操作

### 批量插入

```java
// Service 层（需继承 IService）
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    
    /**
     * 批量创建用户
     */
    @Transactional(rollbackFor = Exception.class)
    public boolean batchCreateUsers(List<CreateUserRequest> requests) {
        List<User> users = requests.stream()
                .map(this::convertToEntity)
                .toList();
        // 默认批次大小 1000
        return saveBatch(users);
    }
    
    /**
     * 批量保存或更新
     */
    @Transactional(rollbackFor = Exception.class)
    public boolean batchSaveOrUpdate(List<User> users) {
        return saveOrUpdateBatch(users, 500);  // 指定批次大小
    }
}
```

### 批量更新

```java
// 根据 ID 批量更新
@Transactional(rollbackFor = Exception.class)
public boolean batchUpdateStatus(List<Long> ids, Integer status) {
    return update(new LambdaUpdateWrapper<User>()
            .set(User::getStatus, status)
            .in(User::getId, ids));
}

// 使用 updateBatchById
@Transactional(rollbackFor = Exception.class)
public boolean batchUpdate(List<User> users) {
    return updateBatchById(users, 500);
}
```

## 链式调用

### @Accessors(chain = true)

```java
@Data
@Accessors(chain = true)
@TableName("t_user")
public class User {
    
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;
    
    @TableField("username")
    private String username;
    
    @TableField("email")
    private String email;
    
    @TableField("status")
    private Integer status;
}

// 使用链式调用
User user = new User()
    .setUsername("test")
    .setEmail("test@example.com")
    .setStatus(1);
userMapper.insert(user);
```

## 参考

- [MyBatis-Plus 官方文档](https://baomidou.com/)
- [MyBatis-Plus 最佳实践](https://baomidou.com/pages/a61e1b/)
