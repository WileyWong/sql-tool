# 示例 4: Python API 测试代码生成

本示例展示使用 Python (pytest + requests) 生成 API 测试代码的完整流程。

## 输入：API 接口文档

```yaml
openapi: 3.0.0
info:
  title: 用户管理 API
  version: 1.0.0
paths:
  /api/v1/users:
    post:
      summary: 创建用户
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [username, email, password]
              properties:
                username:
                  type: string
                  minLength: 3
                  maxLength: 20
                email:
                  type: string
                  format: email
                password:
                  type: string
                  minLength: 8
      responses:
        201:
          description: 创建成功
        400:
          description: 参数错误
        409:
          description: 用户名或邮箱已存在
```

## 步骤 0: 输入判断

```yaml
输入类型: 文档
文档类型: API 接口文档 (OpenAPI)
判断依据:
  - 包含 openapi 版本声明
  - 包含 paths 定义
  - 不是测试用例文档
选择策略: design-test-case/api-test
测试类型: 集成测试
目标语言: Python
```

## 步骤 1: 生成测试用例设计文档

（省略，与 Java 版本相同）

## 步骤 2: 生成 Python 测试代码

```python
"""
用户管理 API 自动化测试（真实接口测试，非Mock）
基于测试用例说明书生成
遵循 AAA 模式 (Arrange-Act-Assert)

执行命令:
    pytest test_user_api.py -v                    # 运行全部测试
    pytest test_user_api.py -m p0 -v              # 仅运行P0用例
    pytest test_user_api.py --html=report.html    # 生成HTML报告
"""

import pytest
import requests
import uuid
from typing import Dict, Any


# ============================================================
# 配置与常量
# ============================================================

class Config:
    """测试配置"""
    BASE_URL = "http://localhost:8080"
    API_PREFIX = "/api/v1"
    TIMEOUT = 10


class Tokens:
    """测试Token"""
    ADMIN = "Bearer admin_test_token"
    INVALID = "Bearer invalid_token"


class TestData:
    """测试数据"""
    
    class Valid:
        USERNAME = "testuser"
        EMAIL = "test@example.com"
        PASSWORD = "Test@123456"
    
    class Boundary:
        USERNAME_MIN = "abc"           # 3字符
        USERNAME_MAX = "a" * 20        # 20字符
    
    class Invalid:
        SHORT_USERNAME = "ab"          # 2字符 < min
        LONG_USERNAME = "a" * 21       # 21字符 > max
        INVALID_EMAILS = ["invalid", "test@", "@example.com"]


# ============================================================
# 工具函数
# ============================================================

def unique_username() -> str:
    return f"test_{uuid.uuid4().hex[:8]}"


def unique_email() -> str:
    return f"test_{uuid.uuid4().hex[:8]}@example.com"


def api_url(path: str) -> str:
    return f"{Config.BASE_URL}{Config.API_PREFIX}{path}"


def auth_headers(token: str = Tokens.ADMIN) -> Dict[str, str]:
    return {
        "Authorization": token,
        "Content-Type": "application/json"
    }


# ============================================================
# Fixtures
# ============================================================

@pytest.fixture
def admin_headers():
    """管理员认证头"""
    return auth_headers(Tokens.ADMIN)


@pytest.fixture
def valid_user_data():
    """有效用户数据"""
    return {
        "username": unique_username(),
        "email": unique_email(),
        "password": TestData.Valid.PASSWORD
    }


# ============================================================
# 清理机制
# ============================================================

import json
import os
from datetime import datetime
from filelock import FileLock


class CleanupRegistry:
    """测试数据清理注册表"""
    
    _registry_file = ".cleanup_registry.json"
    _lock_file = ".cleanup_registry.lock"
    
    @classmethod
    def track_created_user(cls, response, test_name: str = "") -> None:
        """记录创建的用户ID"""
        if response.status_code == 201:
            try:
                user_id = response.json()["data"]["id"]
                if user_id:
                    with FileLock(cls._lock_file, timeout=10):
                        registry = cls._read_registry()
                        if user_id not in registry["pending_user_ids"]:
                            registry["pending_user_ids"].append(user_id)
                            registry["records"].append({
                                "user_id": user_id,
                                "test_name": test_name,
                                "created_at": datetime.now().isoformat()
                            })
                            cls._write_registry(registry)
            except (KeyError, TypeError):
                pass
    
    @classmethod
    def _read_registry(cls) -> Dict[str, Any]:
        if not os.path.exists(cls._registry_file):
            return {"pending_user_ids": [], "records": []}
        with open(cls._registry_file, 'r') as f:
            return json.load(f)
    
    @classmethod
    def _write_registry(cls, data: Dict[str, Any]) -> None:
        with open(cls._registry_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    @classmethod
    def execute_cleanup(cls, headers: Dict[str, str] = None) -> Dict[str, Any]:
        """执行清理"""
        if headers is None:
            headers = auth_headers(Tokens.ADMIN)
        
        registry = cls._read_registry()
        results = {"success": 0, "failed": 0}
        
        for user_id in registry["pending_user_ids"]:
            try:
                response = requests.delete(
                    api_url(f"/users/{user_id}"),
                    headers=headers,
                    timeout=Config.TIMEOUT
                )
                if response.status_code in [200, 204, 404]:
                    results["success"] += 1
                else:
                    results["failed"] += 1
            except Exception:
                results["failed"] += 1
        
        cls._write_registry({"pending_user_ids": [], "records": []})
        return results
    
    @classmethod
    def get_cleanup_report(cls) -> Dict[str, Any]:
        """获取清理报告"""
        registry = cls._read_registry()
        return {
            "pending_count": len(registry["pending_user_ids"]),
            "pending_user_ids": registry["pending_user_ids"]
        }


# 便捷函数
def track_created_user(response, test_name: str = "") -> None:
    CleanupRegistry.track_created_user(response, test_name)


def execute_cleanup() -> Dict[str, Any]:
    return CleanupRegistry.execute_cleanup()


def get_cleanup_report() -> Dict[str, Any]:
    return CleanupRegistry.get_cleanup_report()


# ============================================================
# 测试用例
# ============================================================

class TestCreateUser:
    """创建用户接口测试"""
    
    @pytest.mark.p0
    def test_post_users_with_valid_data_returns_201(self, admin_headers, valid_user_data):
        """TC_CU_001: 有效数据创建用户"""
        # Arrange
        url = api_url("/users")
        
        # Act
        response = requests.post(
            url, json=valid_user_data, 
            headers=admin_headers, 
            timeout=Config.TIMEOUT
        )
        
        # Assert
        assert response.status_code == 201
        data = response.json()
        assert data["code"] == 0
        assert data["data"]["username"] == valid_user_data["username"]
        assert "id" in data["data"]
        
        # 记录创建的用户，用于后续清理
        track_created_user(response, "test_post_users_with_valid_data_returns_201")
    
    @pytest.mark.p0
    def test_post_users_missing_username_returns_400(self, admin_headers):
        """TC_CU_010: 缺少username"""
        # Arrange
        url = api_url("/users")
        user_data = {
            "email": unique_email(),
            "password": TestData.Valid.PASSWORD
        }
        
        # Act
        response = requests.post(
            url, json=user_data, 
            headers=admin_headers, 
            timeout=Config.TIMEOUT
        )
        
        # Assert
        assert response.status_code == 400
    
    @pytest.mark.p1
    def test_post_users_username_below_min_returns_400(self, admin_headers):
        """TC_CU_020: username < min (2字符)"""
        # Arrange
        url = api_url("/users")
        user_data = {
            "username": TestData.Invalid.SHORT_USERNAME,
            "email": unique_email(),
            "password": TestData.Valid.PASSWORD
        }
        
        # Act
        response = requests.post(
            url, json=user_data, 
            headers=admin_headers, 
            timeout=Config.TIMEOUT
        )
        
        # Assert
        assert response.status_code == 400
    
    @pytest.mark.p1
    @pytest.mark.parametrize("invalid_email", TestData.Invalid.INVALID_EMAILS)
    def test_post_users_with_invalid_email_returns_400(self, admin_headers, invalid_email):
        """TC_CU_013: 无效邮箱格式"""
        # Arrange
        url = api_url("/users")
        user_data = {
            "username": unique_username(),
            "email": invalid_email,
            "password": TestData.Valid.PASSWORD
        }
        
        # Act
        response = requests.post(
            url, json=user_data, 
            headers=admin_headers, 
            timeout=Config.TIMEOUT
        )
        
        # Assert
        assert response.status_code == 400
    
    @pytest.mark.p0
    def test_post_users_without_token_returns_401(self, valid_user_data):
        """TC_CU_030: 无Token"""
        # Arrange
        url = api_url("/users")
        headers = {"Content-Type": "application/json"}
        
        # Act
        response = requests.post(
            url, json=valid_user_data, 
            headers=headers, 
            timeout=Config.TIMEOUT
        )
        
        # Assert
        assert response.status_code == 401


# ============================================================
# pytest 配置 (pytest.ini)
# ============================================================
"""
[pytest]
markers =
    p0: 冒烟测试 - 核心功能
    p1: 核心测试 - 重要功能
    p2: 完整测试 - 边缘场景
"""


# ============================================================
# 主程序入口
# ============================================================
if __name__ == "__main__":
    import sys
    exit_code = pytest.main([__file__, "-v"] + sys.argv[1:])
    
    # 显示清理报告
    report = get_cleanup_report()
    if report["pending_count"] > 0:
        print(f"\n待清理数据: {report['pending_count']} 条")
        print("运行 execute_cleanup() 执行清理")
    
    sys.exit(exit_code)
```

## ✅ 检查点2: Python 代码验证

```yaml
检查点2验证结果:

代码完整性: ✅ 通过
  - [x] 所有测试方法已生成
  - [x] 所有 import 语句完整
  - [x] 清理代码已生成

语法检查: ✅ 通过
  - [x] 无 Python 语法错误
  - [x] 缩进正确
  - [x] 字符串闭合正确
  - [x] 装饰器使用正确

验证命令:
  python -m py_compile test_user_api.py    # 语法检查 ✅
  pytest --collect-only                     # 收集测试用例 ✅

规范检查: ✅ 通过
  - [x] 测试方法命名规范
  - [x] 遵循 AAA 模式
  - [x] HTTP 请求配置正确

检查点2结论: ✅ 通过，可以进入步骤3
```

## 步骤 3: 执行测试

```bash
# 执行所有测试
pytest test_user_api.py -v

# 输出示例
============================= test session starts ==============================
collected 5 items

test_user_api.py::TestCreateUser::test_post_users_with_valid_data_returns_201 PASSED
test_user_api.py::TestCreateUser::test_post_users_missing_username_returns_400 PASSED
test_user_api.py::TestCreateUser::test_post_users_username_below_min_returns_400 PASSED
test_user_api.py::TestCreateUser::test_post_users_with_invalid_email_returns_400[invalid] PASSED
test_user_api.py::TestCreateUser::test_post_users_with_invalid_email_returns_400[test@] PASSED
test_user_api.py::TestCreateUser::test_post_users_with_invalid_email_returns_400[@example.com] PASSED
test_user_api.py::TestCreateUser::test_post_users_without_token_returns_401 PASSED

============================= 7 passed in 2.34s ================================
```

## ✅ 检查点3: 测试报告

```markdown
# 测试执行报告

## 基本信息
- **执行时间**: 2025-12-18 15:30:00
- **测试环境**: 开发环境
- **测试范围**: 用户管理 API - 创建用户接口

## 测试统计

| 指标 | 数值 | 百分比 |
|------|------|--------|
| 总用例数 | 7 | 100% |
| 通过 | 7 | 100% |
| 失败 | 0 | 0% |
| 跳过 | 0 | 0% |
| 执行耗时 | 2.34s | - |

## 详细结果

### 通过的测试
- ✅ test_post_users_with_valid_data_returns_201
- ✅ test_post_users_missing_username_returns_400
- ✅ test_post_users_username_below_min_returns_400
- ✅ test_post_users_with_invalid_email_returns_400[invalid]
- ✅ test_post_users_with_invalid_email_returns_400[test@]
- ✅ test_post_users_with_invalid_email_returns_400[@example.com]
- ✅ test_post_users_without_token_returns_401

## 总结

### 测试结论
✅ 通过 - 所有测试用例执行成功

### 风险评估
低 - 核心功能测试全部通过

### 后续建议
1. 补充更多边界值测试
2. 添加性能测试用例
```

## 步骤 4: 清理询问

```
测试执行完成。

📊 待清理数据摘要:
- 待清理用户数: 1
- 用户ID列表: [12345]

❓ 是否需要执行清理代码清理测试数据？[是/否]
```

用户确认后执行清理：

```python
>>> from test_user_api import execute_cleanup, get_cleanup_report
>>> report = get_cleanup_report()
>>> print(f"待清理: {report['pending_count']} 条")
待清理: 1 条
>>> result = execute_cleanup()
>>> print(f"清理完成: 成功={result['success']}, 失败={result['failed']}")
清理完成: 成功=1, 失败=0
```
