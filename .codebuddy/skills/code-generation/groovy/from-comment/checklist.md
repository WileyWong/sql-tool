# Groovy 从注释生成代码 - 检查清单

## 注释解析检查

- [ ] 解析类/接口文档注释
- [ ] 解析方法功能描述
- [ ] 提取测试场景
- [ ] 提取预期结果
- [ ] 提取前置条件

## Spock 测试生成检查

### 基础结构
- [ ] 继承 `Specification`
- [ ] 类名使用 `XxxSpec` 格式
- [ ] 使用 `@Title` 注解（可选）

### 测试方法
- [ ] 方法名使用自然语言描述
- [ ] 使用 `given-when-then` 结构
- [ ] 使用 `expect-where` 数据驱动（可选）

### Mock 配置
- [ ] 使用 `Mock()` 创建 Mock 对象
- [ ] 使用 `>>` 定义返回值
- [ ] 使用 `* _` 匹配任意参数

### 断言
- [ ] 使用 `==` 进行相等断言
- [ ] 使用 `thrown()` 断言异常
- [ ] 使用 `notThrown()` 断言无异常

## Gradle 脚本生成检查

### 基础结构
- [ ] 使用 Kotlin DSL 或 Groovy DSL
- [ ] 插件声明正确
- [ ] 仓库配置正确

### 依赖配置
- [ ] 依赖声明正确
- [ ] 版本号明确
- [ ] 作用域正确（implementation/testImplementation）

### 任务定义
- [ ] 任务名称有意义
- [ ] 任务依赖正确
- [ ] 任务配置完整

## 编译验证

```bash
# Spock 测试
./gradlew test

# Gradle 脚本
./gradlew tasks
```

- [ ] 编译成功
- [ ] 测试可执行
