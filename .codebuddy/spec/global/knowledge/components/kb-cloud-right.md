# HR云权限鉴权接口完整说明文档

> **文档版本**: v2.0.0 | **更新日期**: 2025-11-12 | **状态**: 生产可用

---

## 1. 基础信息层

### 1.1 组件标识

- **接口名称**: HR Cloud Right API
- **所属模块**: hrright-cloud-api  
- **版本**: v1.0.0
- **负责团队**: HR数据服务中心
- **状态**: ✅ 稳定，生产推荐使用

### 1.2 版本兼容性

| 版本 | 状态 | 兼容性 |
|------|------|--------|
| v1.0.0 | 稳定 | 向后兼容 |

---

## 2. 功能概述层

### 2.1 核心职责 (What)

提供企业级统一权限鉴权服务:
- 权限校验与鉴权
- 基于角色的访问控制 (RBAC)
- 数据范围管理
- 字段级权限控制  
- 多租户权限隔离

### 2.2 使用场景 (When/Where)

**适用场景**:
- 企业HR系统权限控制
- 多租户环境权限隔离
- 细粒度数据权限控制
- 动态角色权限分配

**典型应用**:
- 人力资源管理系统(HRMS)
- 员工自助服务门户
- 绩效/薪酬管理系统

### 2.3 设计目的 (Why)

- **统一管理**: 解决多系统权限分散问题
- **安全隔离**: 多租户数据安全隔离
- **细粒度控制**: 支持菜单到字段级权限
- **灵活配置**: 动态配置,无需重启

### 2.4 业务价值

- 降低权限管理复杂度
- 提高系统安全性
- 支持灵活组织架构变更
- 减少开发维护成本

---

## 3. 环境依赖层

### 3.1 环境配置

| 环境 | 地址 | VPC要求 |
|------|------|---------|
| 测试 | http://gateway.testihrtas.com/api/esb/hrright-cloud-api | 需配置host: gateway.testihrtas.com 10.0.0.21 |
| UAT | http://gateway.uathr.tencent-cloud.com/api/esb/hrright-cloud-api | 无 |
| 生产 | http://gateway.prodihrtas.com/api/esb/hrright-cloud-api | 无 |

### 3.2 访问凭证获取

**必需凭证**:
- `AppKey`: 应用唯一标识
- `Token`: 数据调用凭证

**申请流程**: 向HR数据服务中心提交应用注册申请

---

## 4. 接口定义层

### 4.1 请求规范

#### 4.1.1 请求头配置

**所有接口必须包含以下请求头**:

| 请求头 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| EHR-DATA-APPKEY | string | ✅ | 应用AppKey |
| EHR-DATA-TIMESTAMP | string | ✅ | 时间戳(秒) |
| EHR-DATA-SIGNATURE | string | ✅ | 请求签名 |

#### 4.1.2 签名算法

```
EHR-DATA-SIGNATURE = SHA256(AppKey + Timestamp + Token)
```

**Java示例**:
```java
import cn.hutool.crypto.digest.DigestUtil;

public String generateSignature(String appKey, String timestamp, String token) {
    String data = appKey + timestamp + token;
    return DigestUtil.sha256Hex(data);
}
```

**JavaScript示例**:
```javascript
import CryptoJS from 'crypto-js';

function generateSignature(appKey, timestamp, token) {
    const data = appKey + timestamp + token;
    return CryptoJS.SHA256(data).toString();
}
```

**重要提示**:
- ⚠️ Token必须保密,不得硬编码在前端
- ⚠️ 时间戳与服务器误差不超过5分钟
- ⚠️ 严格按顺序拼接: AppKey + Timestamp + Token

#### 4.1.3 统一返回格式

```json
{
  "success": true,
  "code": "0",
  "msg": "成功",
  "data": {}
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| success | boolean | true=成功, false=失败 |
| code | string | "0"=成功, "-1"及其他=失败 |
| msg | string | 提示信息 |
| data | any | 业务数据 |

---

### 4.2 权限查询接口

#### 4.2.1 根据权限编号获取所有成员

**接口**: `GET /api/getStaffByOperate`

**功能**: 查询拥有指定权限的所有员工ID列表

**请求参数**:

| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| corpkey | string | ✅ | 租户key | "tencent_001" |
| appkey | string | ✅ | 应用key | "hrms" |
| operatecode | string | ✅ | 权限编号 | "DeclareBatchManager" |

**返回示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "",
  "data": [1131383035216793600, 1135769716854362113]
}
```

**使用场景**: 权限批量校验、人员筛选

---

#### 4.2.2 根据员工ID获取权限编号列表

**接口**: `GET /api/getOperations`

**功能**: 获取员工在应用下的所有权限编号

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| corpkey | string | ✅ | 租户key |
| appkey | string | ✅ | 应用key |
| globalid | BigInteger | ✅ | 员工ID |

**返回示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "",
  "data": ["DeclareBatchManager", "PerformanceEdit"]
}
```

**最佳实践**:
- ✅ 用户登录时调用并缓存30分钟
- ⚠️ 避免每个页面重复调用

---

#### 4.2.3 检查员工权限

**接口**: `GET /api/checkRight`

**功能**: 检查员工是否拥有某个权限

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| corpkey | string | ✅ | 租户key |
| appkey | string | ✅ | 应用key |
| globalid | BigInteger | ✅ | 员工ID |
| operatecode | string | ✅ | 权限编号 |

**返回示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "",
  "data": true
}
```

**使用场景**: 关键操作前的权限二次校验

---

#### 4.2.4 获取用户拥有的角色

**接口**: `GET /api/getOrgRoles`

**功能**: 查询用户的所有角色及数据范围

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| corpkey | string | ✅ | 租户key |
| globalid | BigInteger | ✅ | 员工ID |

**返回示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "",
  "data": [
    {
      "roleCode": "hr_admin",
      "roleName": "HR管理员",
      "dataScopes": {
        "Org": ["-1"],
        "Staff": ["1", "2", "3"]
      }
    }
  ]
}
```

---

#### 4.2.5 获取用户数据范围

**接口**: `GET /api/getDataScope`

**功能**: 获取用户在应用下的数据访问范围

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| corpkey | string | ✅ | 租户key |
| appkey | string | ✅ | 应用key |
| globalid | BigInteger | ✅ | 员工ID |

**返回示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "",
  "data": [
    {
      "dataScopes": {
        "Org": ["3", "88"],
        "Position": ["manager", "director"]
      }
    }
  ]
}
```

**说明**:
- `"-1"` 表示全部数据
- 可自定义数据范围类型(Org/Position/Staff等)

---

#### 4.2.6 获取租户下所有角色字段配置

**接口**: `GET /api/getOrgRoleDefaultScope`

**功能**: 获取所有角色的字段权限配置

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| corpkey | string | ✅ | 租户key |

**返回示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "success",
  "data": {
    "roleCode-xxx": {
      "personnelDashboard": {
        "1": {
          "birthday": ["read", "write"],
          "salary": ["read"]
        }
      }
    }
  }
}
```

**字段权限说明**:
- `["read"]`: 只读
- `["write"]`: 只写(少见)
- `["read", "write"]`: 可读可写

---

### 4.3 系统配置接口

#### 4.3.1 新增系统

**接口**: `POST /api/cfg/createSysInfo`

**功能**: 注册新系统到权限平台

**请求参数** (JSON Body):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| sysCode | string | ✅ | 系统编码(唯一) |
| sysName | string | ✅ | 系统名称 |
| sysDomainScope | string | ✅ | 系统域范围 |
| sysOwer | string | ❌ | 负责人JSON数组 |
| sysUrl | string | ❌ | 系统地址 |
| remark | string | ❌ | 备注 |

**请求示例**:
```json
{
  "sysCode": "ehrnew",
  "sysName": "新版E人事",
  "sysDomainScope": "",
  "sysOwer": "[{\"id\":\"57447\",\"name\":\"loyliu(刘存)\"}]",
  "sysUrl": "",
  "remark": ""
}
```

**注意事项**:
- ⚠️ sysCode一旦创建不可修改
- ⚠️ sysOwer必须是有效JSON数组字符串

---

#### 4.3.2 修改系统权限树

**接口**: `POST /api/cfg/saveSysTreeItems`

**功能**: 更新系统权限树结构

**请求参数** (JSON Body):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| sysCode | string | ✅ | 系统编码 |
| version | string | ❌ | 版本号 |
| data | string | ✅ | 权限树JSON字符串 |

**权限树数据结构**:
```json
{
  "id": "menu_home",
  "name": "首页",
  "remark": "",
  "children": [
    {
      "id": "menu_dashboard",
      "name": "仪表盘",
      "remark": "",
      "children": []
    }
  ]
}
```

---

### 4.4 角色管理接口

#### 4.4.1 新增/更新角色

**接口**: `POST /api/saveRole?corpkey={corpkey}`

**功能**: 创建新角色或更新已有角色

**请求参数** (JSON Body):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | ❌ | 角色编码(不传=新增,传=更新) |
| name | string | ✅ | 角色名称 |
| inside | int | ✅ | 0=普通,1=内置(不可删除) |
| roleType | int | ✅ | 0=普通,1=标准,2=特殊标准 |
| defaultops | object | ✅ | 默认权限配置 |
| remark | string | ❌ | 备注 |

**请求示例**:
```json
{
  "code": "hr_admin",
  "name": "HR管理员",
  "inside": 0,
  "roleType": 0,
  "defaultops": {
    "4": ["employee_view", "employee_edit"]
  },
  "remark": "HR部门管理员"
}
```

**返回**: 角色编码(code)

---

#### 4.4.2 删除角色

**接口**: `POST /api/deleteRole?id={id}&corpkey={corpkey}`

**功能**: 删除指定角色

**限制**: 
- 内置角色(inside=1)不可删除
- 标准角色(roleType=1)不可删除

---

#### 4.4.3 批量新增角色用户

**接口**: `POST /api/saveRoleUser?corpkey={corpkey}`

**功能**: 批量为角色添加用户并设置数据范围

**请求参数** (JSON Body):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uIdDes | array | ✅ | 员工列表 |
| rolecode | string | ✅ | 角色编码 |
| rolename | string | ❌ | 角色名称 |
| scopes | object | ❌ | 数据范围 |
| remark | string | ❌ | 备注 |

**请求示例**:
```json
{
  "uIdDes": [
    {"id": "1610927154282516480", "name": "childqiu(邱钰程)"}
  ],
  "rolecode": "hr_admin",
  "scopes": {
    "Org": [
      {"id": "88", "name": "腾佳/集团四部", "fullName": "腾佳/集团四部", "parentId": ""}
    ]
  },
  "remark": "批量添加"
}
```

**性能建议**: 单次添加不超过100个用户

---

#### 4.4.4 获取角色用户

**接口**: `GET /api/getRoleUser?corpkey={corpkey}&rolecode={rolecode}`

**功能**: 查询指定角色下的所有用户

**返回示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "success",
  "data": [
    {
      "uId": 1580835081936326656,
      "uName": "qiqi",
      "scope": {"Org": ["-1"]}
    }
  ]
}
```

---

#### 4.4.5 更新角色用户

**接口**: `POST /api/updateRoleUser?corpkey={corpkey}`

**功能**: 更新用户的数据范围配置

**请求参数** (JSON Body):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uId | string | ✅ | 员工ID |
| rolecode | string | ✅ | 角色编码 |
| scopes | object | ❌ | 数据范围 |

---

#### 4.4.6 删除角色用户

**接口**: `POST /api/deleteRoleUser?corpkey={corpkey}&rolecode={rolecode}&uid={uid}`

**功能**: 从角色中移除用户

**注意**: 移除后用户立即失去权限

---

## 5. 数据契约层

### 5.1 核心数据模型

#### 角色类型枚举

| 值 | 说明 | 特性 |
|----|------|------|
| 0 | 普通角色 | 可删除、可修改人员 |
| 1 | 标准角色 | 不可删除、不可在页面修改已有人员 |
| 2 | 特殊标准角色 | 不可删除、可修改已有人员 |

#### 数据范围对象

```typescript
interface DataScope {
  [scopeType: string]: Array<{
    id: string;
    name: string;
    fullName: string;
    parentId: string;
  }>;
}
```

**常见scopeType**:
- `Org`: 组织范围
- `Staff`: 员工范围
- `Position`: 职位范围
- 可自定义其他类型

#### 特殊值说明

| 值 | 含义 |
|----|------|
| "-1" | 全部数据(在Org中表示全部组织) |

---

## 6. 运行时行为层

### 6.1 性能特性

- **QPS限制**: 建议不超过1000 QPS
- **超时时间**: 建议设置5秒超时
- **批量操作**: 建议单次不超过100条记录

### 6.2 缓存策略

- **权限列表**: 建议缓存30分钟
- **数据范围**: 建议缓存30分钟
- **角色信息**: 建议缓存1小时

### 6.3 异步特性

- 所有接口均为同步调用
- 批量操作建议客户端异步处理

---

## 7. 错误处理层

### 7.1 常见错误

| 错误场景 | 错误信息 | 解决方案 |
|----------|----------|----------|
| 签名验证失败 | "签名错误" | 检查Token、时间戳、算法 |
| 权限编号不存在 | "权限不存在" | 确认operatecode已配置 |
| 角色不存在 | "角色不存在" | 检查rolecode是否正确 |
| 时间戳过期 | "时间戳无效" | 同步服务器时间 |

### 7.2 错误码表

| 错误码 | 含义 |
|--------|------|
| 0 | 成功 |
| -1 | 通用错误 |

### 7.3 降级策略

- 权限接口失败时,建议默认拒绝访问
- 可配置降级白名单用户
- 记录错误日志便于排查

---

## 8. 最佳实践

### 8.1 签名安全

```javascript
// ✅ 正确: 后端生成签名
const headers = await fetch('/api/getAuthHeaders').then(r => r.json());

// ❌ 错误: 前端暴露Token
const signature = generateSignature(appKey, timestamp, token); // 不安全!
```

### 8.2 权限校验流程

```javascript
// 1. 用户登录后获取权限
const permissions = await getOperations(globalId);
localStorage.setItem('permissions', JSON.stringify(permissions));

// 2. 前端控制菜单显示
const menus = allMenus.filter(menu => 
  permissions.includes(menu.permissionCode)
);

// 3. 关键操作前二次校验
async function deleteEmployee(id) {
  const hasPermission = await checkRight(globalId, 'employee_delete');
  if (!hasPermission) {
    alert('无权限');
    return;
  }
  // 执行删除
}
```

### 8.3 批量操作

```javascript
// ✅ 正确: 分批处理
const batchSize = 100;
for (let i = 0; i < users.length; i += batchSize) {
  const batch = users.slice(i, i + batchSize);
  await saveRoleUsers(batch);
}

// ❌ 错误: 一次性处理大量数据
await saveRoleUsers(allUsers); // 可能超时!
```

### 8.4 角色管理建议

- 明确角色类型,避免误设为内置角色
- 数据范围遵循最小权限原则
- 定期审计角色权限配置

---

## 9. FAQ

### Q1: 如何获取AppKey和Token?

**A**: 向HR数据服务中心提交应用注册申请,审批通过后分配。

### Q2: 签名验证总是失败?

**A**: 检查:
1. Token配置正确
2. 时间戳为秒级(不是毫秒)
3. 拼接顺序: AppKey + Timestamp + Token
4. 使用SHA256算法

### Q3: 用户权限更新后不生效?

**A**: 
1. 清除客户端缓存
2. 建议用户重新登录
3. 或调用接口刷新权限列表

### Q4: 数据范围"-1"是什么意思?

**A**: 在Org中表示全部组织,在其他范围中也表示全部数据。

### Q5: 如何实现字段级权限控制?

**A**: 
1. 调用`getOrgRoleDefaultScope`获取字段权限配置
2. 根据返回的read/write标识控制字段显示和编辑状态
3. 示例:
```javascript
const config = await getOrgRoleDefaultScope();
const fieldPerm = config[roleCode]['personnelDashboard']['1']['salary'];
// fieldPerm: ["read"] => 只读
// fieldPerm: ["read", "write"] => 可编辑
```

### Q6: 标准角色和普通角色的区别?

**A**: 
- 普通角色(roleType=0): 可删除、可修改人员
- 标准角色(roleType=1): 不可删除、不可在页面修改已有人员
- 特殊标准角色(roleType=2): 不可删除、可修改已有人员

### Q7: 如何实现权限的实时更新?

**A**: 
1. 后端修改权限后发送消息通知
2. 前端监听消息,清除缓存并重新加载权限
3. 或设置较短的缓存时间(如5分钟)

---

## 10. 变更历史

| 版本 | 日期 | 变更内容 | 兼容性 |
|------|------|----------|--------|
| v1.0.0 | 2024-XX-XX | 初始版本 | - |
| v2.0.0 | 2025-11-12 | 文档优化,增加最佳实践 | 向后兼容 |

---

## 11. 附录

### 11.1 快速开始示例

```javascript
/**
 * HR权限API快速使用示例
 */

// 1. 配置
const config = {
  baseUrl: 'http://gateway.testihrtas.com/api/esb/hrright-cloud-api',
  appKey: 'your_app_key',
  token: 'your_token',
  corpkey: 'tencent_001',
  appkey: 'hrms'
};

// 2. 生成请求头
function getHeaders() {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = CryptoJS.SHA256(
    config.appKey + timestamp + config.token
  ).toString();
  
  return {
    'EHR-DATA-APPKEY': config.appKey,
    'EHR-DATA-TIMESTAMP': timestamp,
    'EHR-DATA-SIGNATURE': signature,
    'Content-Type': 'application/json'
  };
}

// 3. 获取用户权限
async function getUserPermissions(globalId) {
  const response = await fetch(
    `${config.baseUrl}/api/getOperations?corpkey=${config.corpkey}&appkey=${config.appkey}&globalid=${globalId}`,
    { headers: getHeaders() }
  );
  return response.json();
}

// 4. 检查权限
async function checkPermission(globalId, operateCode) {
  const response = await fetch(
    `${config.baseUrl}/api/checkRight?corpkey=${config.corpkey}&appkey=${config.appkey}&globalid=${globalId}&operatecode=${operateCode}`,
    { headers: getHeaders() }
  );
  const result = await response.json();
  return result.data;
}

// 5. 使用示例
(async () => {
  const globalId = '123456789';
  
  // 获取权限列表
  const permissions = await getUserPermissions(globalId);
  console.log('用户权限:', permissions);
  
  // 检查具体权限
  const hasPermission = await checkPermission(globalId, 'employee_edit');
  console.log('是否有编辑权限:', hasPermission);
})();
```

---

**文档结束**
