# 进度清单

复制此清单跟踪进度：

```
生成进度:
- [ ] 步骤1: 扫描代码，统计各分类数量
- [ ] 步骤2: 生成 README.md（首先）
- [ ] 步骤3: 分批生成分类文档
  - [ ] 第1批: interface.md
  - [ ] 第2批: abstract.md
  - [ ] 第3批: service-api-http.md
  - [ ] 第4批: business-logic.md
  - [ ] 第5批: orm-mapper.md
  - [ ] 第6批: entity.md + dto.md
  - [ ] 第7批: service-response-object.md + front-end-request.md
  - [ ] 第8批: exception.md + enum.md
  - [ ] 第9批: feign.md + handler.md
  - [ ] 第10批: job-task.md + mq-listener.md
  - [ ] 第11批: utils.md + common.md
  - [ ] 第12批: annotation.md + constants.md
- [ ] 步骤4: 批量添加相关文档节
- [ ] 步骤5: 更新 README.md 统计数据
- [ ] 步骤6: 批量添加维护记录节
- [ ] 步骤7: 询问是否生成扩展文档
  - [ ] 展示扩展文档列表（10个可选）
  - [ ] 根据用户选择生成扩展文档
```

---

## 质量检查

```
质量检查:
- [ ] 21个核心文档完整（1 README + 19 分类 + 1 兜底 other.md）
- [ ] 每个类独立记录（无"其他 XXX"归类描述）
- [ ] 每章生成后询问用户
- [ ] 完整读取源码文件
- [ ] 每个类记录了代码行数（SLOC）
- [ ] 类型识别正确（基于注解/继承/关键字，完全忽略目录名）
- [ ] 相关文档节包含20个链接（19分类 + 1兜底）
- [ ] 维护记录节格式统一
- [ ] 核心文档完成后询问扩展文档
```

---

## 类记录完整性检查

```
类记录必填字段:
- [ ] 类路径（**类路径**:）
- [ ] 代码行数（**代码行数**: XXX 行（SLOC））
- [ ] 继承关系（**继承**: extends XXX 或 无）
- [ ] 实现接口（**实现**: implements XXX 或 无）
- [ ] 类注解（**类注解**: @Service, @Slf4j 等）
- [ ] 方法表格包含调用链列
- [ ] 被引用列表（哪些类引用了本类）
```

---

## 依赖关系检查

```
依赖关系:
- [ ] 每个文档包含依赖关系图（Mermaid）
- [ ] 每个类记录依赖注入列表
- [ ] 每个类记录被引用列表
- [ ] 跨模块依赖节完整（本模块→其他、其他→本模块）
- [ ] 方法表格包含调用链（→ targetMethod()）
```

---

## README 项目信息检查

```
README 项目信息:
- [ ] 技术栈（Spring Boot + MyBatis-Plus 等）
- [ ] JDK 版本
- [ ] 构建工具（Maven/Gradle）
- [ ] 启动类路径
- [ ] 启动命令
- [ ] 配置文件索引
```

---

## 新增类型检查

```
新增类型检查:
- [ ] Interface 类已识别（interface 关键字，非 @interface）
- [ ] Interface 类记录了方法签名和实现类
- [ ] Abstract 类已识别（abstract class 关键字）
- [ ] Abstract 类记录了抽象方法和子类
- [ ] Exception 类已识别（extends Exception/RuntimeException）
- [ ] Exception 类记录了错误码和构造方法
- [ ] Enum 类已识别（enum 关键字）
- [ ] Enum 类记录了所有枚举值和字段
- [ ] Annotation 类已识别（@interface 定义）
- [ ] Annotation 类记录了元注解和属性
- [ ] Constants 类已识别（*Constants.java 或全静态final字段）
- [ ] Constants 类记录了常量分组
- [ ] Other 类（兜底）已正确处理（无法匹配其他类型时使用 default.md 模板）
- [ ] Other 类记录在 other.md 文档中
```

---

## 常见错误自查

- **综合归档**: 搜索"其他"关键词
- **文件读取不完整**: 确保完整读取
- **忘记询问**: 每章必须询问
- **忘记先生成README**: 必须首先生成
- **类型识别错误**: 检查是否按目录名而非注解识别
- **遗漏 Interface**: 检查是否处理了接口定义
- **遗漏 Abstract**: 检查是否处理了抽象类
- **遗漏 Exception**: 检查是否处理了自定义异常类
- **遗漏 Enum**: 检查是否处理了枚举类
- **遗漏 Annotation**: 检查是否处理了自定义注解
- **遗漏 Constants**: 检查是否处理了常量类
- **缺少代码行数**: 每个类都应记录代码行数（SLOC）
