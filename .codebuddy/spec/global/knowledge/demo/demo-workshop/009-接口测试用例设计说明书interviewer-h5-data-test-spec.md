# /interviewer/h5-data 真实接口测试用例说明书

> **来源**：`tdd-build-test-case` Skill（真实接口测试，不使用 Mock）
> 
> **目标**：验证 OpenApiController `/interviewer/h5-data` 接口在功能、参数校验、缓存性能、安全方面的真实行为，确保返回数据与数据库一致并具备可观测性。

---

## 1. 基本信息

| 项目 | Recruit-Bole |
|------|--------------|
| 模块 | `RecruitBoleBusiness_proj` → `OpenApiController` |
| 运行环境 | DEV / TEST（REST / JSON） |
| 鉴权方式 | `X-Bole-Token`（由运维发放），或内网白名单 |
| 外部依赖 | `interviewer_statistics` / `interview_like_statistics` / `company_statistics_2025` MySQL 表，Redis 二级缓存 |

---

## 2. 前置条件

1. `RecruitBoleBusinessService` 已部署并对外暴露 `https://<env>/api/open-api`。
2. Redis/本地缓存已清空（保障缓存用例可重复执行）。
3. `interviewer_statistics` 中存在 `interviewer_id=10001` 的数据，具备对应的点赞、公司统计数据；`interviewer_id=99999` 不存在。
4. HTTP 客户端通过系统属性或环境变量提供：
   - `openapi.base-url`（必填）、`openapi.token`（可选）、`openapi.token-header`（默认 `X-Bole-Token`）。
5. 所有测试均为只读操作，无需自动清理，但需在日志中记录缓存 key 以便手工验证。

---

## 3. 测试数据

| 标识 | 值 | 说明 |
|------|----|------|
| `INTV_VALID` | `10001` | 真实存在的面试官 ID，具备点赞与公司统计数据 |
| `INTV_MISSING` | `99999` | 数据库中不存在的面试官 ID |
| `INTV_ZERO` | `0` | 非法 ID，触发参数校验 |
| `INTV_INJECTION` | `' OR '1'='1` | SQL 注入 payload |

---

## 4. 用例列表

| 用例 ID | 场景 | Arrange | Act | Assert | 备注 |
|---------|------|---------|-----|--------|------|
| H5-001 | 有效面试官返回 200 | Redis 清空；`interviewer_id=10001` 存在 | GET `/interviewer/h5-data?interviewerId=10001` | 1）HTTP 200；2）`success=true`；3）`data.employeeId=10001`；4）`topLikeReasons` 数量≤2、内容与 DB 一致；5）`companyTotalInterviewers`>0；6）响应时间<300ms | 记录缓存 key `interviewer:h5:data:10001` |
| H5-002 | 缓存命中耗时下降 | 执行 H5-001 后立即再次请求 | 重复 GET | 1）HTTP 200；2）响应体与 H5-001 一致；3）响应时间显著下降（期望 `<50ms`，至少小于第一次） | 可记录 Redis 命中数 |
| H5-003 | 缺少 interviewerId 被拒绝 | 无 query 参数 | GET `/interviewer/h5-data` | 1）返回 4xx（期望 400）；2）返回消息包含 `interviewerId`；3）无数据返回 | - |
| H5-004 | interviewerId<=0 被拒绝 | `interviewerId=0` | GET | 1）HTTP 400；2）返回 `面试官ID必须大于0`；3）无缓存写入 | - |
| H5-005 | 面试官不存在 | `interviewerId=99999` | GET | 1）HTTP 4xx；2）`message=面试官数据不存在`；3）无缓存写入 | - |
| H5-006 | 注入参数被拒绝 | `interviewerId=' OR '1'='1` | GET | 1）HTTP 4xx；2）响应不包含 SQL 错误堆栈；3）接口日志无拼接语句 | - |

---

## 5. 断言层级

1. **状态码**：200 或 4xx；无 5xx。
2. **响应头**：`Content-Type=application/json`。
3. **响应结构**：`{ success, data, message, code }`。
4. **数据断言**：字段值与数据库一致，如 `employeeId`、`topLikeReasons`、`companyTotalInterviewers`。
5. **业务断言**：参数校验、缓存命中差异、注入防护。
6. **性能断言**：缓存前 <300ms，缓存后 <50ms（或明显小于首次）。

---

## 6. 执行说明

- 使用 `HttpClient` 直接调用真实接口。
- 通过系统属性注入 baseUrl/token，例如：
  ```bash
  mvn -Dopenapi.base-url=https://test.hr.tencent.com/api/open-api \
      -Dopenapi.token=xxx \
      -Dtest.interviewer.id=10001 \
      -Dtest=InterviewerH5DataIntegrationTest test
  ```
- 日志中输出首次/二次请求耗时对比，便于排查缓存命中问题。
- 由于接口只读，不需要在 `CleanupRegistry` 中登记，但若后续扩展为写操作可复用统一组件。
