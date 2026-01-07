# 常见问题模式

各技术栈代码审查中的常见问题及修复建议。

## Java 常见问题

| 问题 | 风险 | 修复 |
|------|------|------|
| 缺少 `@Transactional` | 数据不一致 | 添加事务注解 |
| SQL 字符串拼接 | SQL 注入 | 使用参数化查询 |
| 日志打印密码 | 信息泄露 | 脱敏处理 |
| N+1 查询 | 性能问题 | 批量查询 |

详见：[java/java-review.md](java/java-review.md)

## Go 常见问题

| 问题 | 风险 | 修复 |
|------|------|------|
| 忽略错误 (`_`) | 静默失败 | 检查并处理错误 |
| goroutine 泄漏 | 资源耗尽 | 使用 context 控制 |
| 循环内字符串拼接 | 性能问题 | 使用 strings.Builder |
| 未预分配切片 | 多次扩容 | make 指定容量 |

详见：[go/go-review.md](go/go-review.md)

## MySQL 常见问题

| 问题 | 风险 | 修复 |
|------|------|------|
| SELECT * | 性能浪费 | 明确指定字段 |
| 索引字段用函数 | 索引失效 | 改写条件 |
| 字符串拼接 SQL | SQL 注入 | 参数化查询 |
| 无事务控制 | 数据不一致 | 添加事务 |

详见：[mysql/mysql-review.md](mysql/mysql-review.md)

## Vue 常见问题

| 问题 | 风险 | 修复 |
|------|------|------|
| `v-html` 直接渲染 | XSS | 使用 DOMPurify |
| 解构 `reactive` (Vue 3) | 响应性丢失 | 使用 `toRefs` |
| 新增属性不响应 (Vue 2) | 数据不更新 | 使用 `$set` |
| Mixins 命名冲突 (Vue 2) | 属性覆盖 | 转为工具函数 |
| 大列表直接渲染 | 性能问题 | 虚拟滚动 |
| 未清理副作用 | 内存泄漏 | 生命周期清理 |

详见：[vue3/vue3-review.md](vue3/vue3-review.md)、[vue2/vue2-review.md](vue2/vue2-review.md)

## 小程序常见问题

| 问题 | 风险 | 修复 |
|------|------|------|
| 频繁 setData | 性能卡顿 | 合并更新，减少数据量 |
| 主包过大 | 启动慢 | 分包加载，按需引入 |
| 敏感数据明文 | 信息泄露 | 加密传输和存储 |
| 未清理监听器 | 内存泄漏 | onUnload 中清理 |

详见：[miniprogram/miniprogram-review.md](miniprogram/miniprogram-review.md)

## Python 常见问题

| 问题 | 风险 | 修复 |
|------|------|------|
| 裸 `except:` | 隐藏错误 | 捕获具体异常类型 |
| SQL 字符串拼接 | SQL 注入 | 使用 ORM 或参数化查询 |
| `pickle` 反序列化 | 代码执行 | 使用 JSON 或验证签名 |
| 可变默认参数 | 意外共享 | 使用 `None` 作为默认值 |
| 循环内字符串拼接 | 性能问题 | 使用 `join()` |
| 忘记 `await` | 协程未执行 | 添加 `await` 关键字 |

详见：[python/python-review.md](python/python-review.md)
