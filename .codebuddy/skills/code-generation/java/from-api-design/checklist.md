# Java 从 API 设计生成代码 - 检查清单

## 输入解析检查

- [ ] 解析所有 API 端点（paths）
- [ ] 提取 HTTP 方法（GET/POST/PUT/DELETE）
- [ ] 提取路径参数（path parameters）
- [ ] 提取查询参数（query parameters）
- [ ] 提取请求体结构（request body）
- [ ] 提取响应结构（response schema）
- [ ] 提取错误码定义

## Entity 生成检查

- [ ] 包名正确（`com.xxx.entity`）
- [ ] 类名使用 PascalCase
- [ ] 使用 `@Data` 注解
- [ ] 使用 `@TableName` 指定表名
- [ ] 使用 `@TableId(value = "xxx", type = ...)` 指定主键
- [ ] **所有字段使用 `@TableField("column_name")` 标注数据库字段名**
- [ ] 字段类型正确
- [ ] 字段注释完整

## DTO 生成检查

### Request DTO
- [ ] 包名正确（`com.xxx.dto`）
- [ ] 类名使用 `XxxRequest` 格式
- [ ] 使用 `@Data` 注解
- [ ] 必填字段使用 `@NotNull`/`@NotBlank`
- [ ] 字符串长度使用 `@Size`
- [ ] 邮箱使用 `@Email`
- [ ] 字段注释完整

### Response DTO
- [ ] 类名使用 `XxxVO`/`XxxResponse` 格式
- [ ] 只包含需要暴露的字段
- [ ] 敏感字段已排除

## Mapper 生成检查

- [ ] 包名正确（`com.xxx.mapper`）
- [ ] 接口名使用 `XxxMapper` 格式
- [ ] 使用 `@Mapper` 注解
- [ ] 继承 `BaseMapper<Entity>`
- [ ] 自定义方法签名清晰

## Service 生成检查

### 接口
- [ ] 包名正确（`com.xxx.service`）
- [ ] 接口名使用 `XxxService` 格式
- [ ] 方法签名清晰
- [ ] JavaDoc 注释完整

### 实现类
- [ ] 包名正确（`com.xxx.service.impl`）
- [ ] 类名使用 `XxxServiceImpl` 格式
- [ ] 使用 `@Service` 注解
- [ ] 使用 `@Slf4j` 注解
- [ ] 使用 `@RequiredArgsConstructor` 注解
- [ ] 写操作使用 `@Transactional`
- [ ] 参数校验完整
- [ ] 异常处理完善
- [ ] 日志记录完整

## Controller 生成检查

- [ ] 包名正确（`com.xxx.controller`）
- [ ] 类名使用 `XxxController` 格式
- [ ] 使用 `@RestController` 注解
- [ ] 使用 `@RequestMapping` 指定基础路径
- [ ] 使用 `@Slf4j` 注解
- [ ] 使用 `@RequiredArgsConstructor` 注解
- [ ] 使用 `@Tag` 注解（Swagger）
- [ ] 每个方法使用 `@Operation` 注解
- [ ] 使用正确的 HTTP 方法注解
- [ ] 请求体使用 `@Valid` 验证
- [ ] 路径参数使用 `@PathVariable`
- [ ] 查询参数使用 `@RequestParam`
- [ ] 返回统一响应格式

## 编译验证

```bash
mvn compile -DskipTests
```

- [ ] 编译成功
- [ ] 无编译错误
- [ ] 无编译警告（可选）
