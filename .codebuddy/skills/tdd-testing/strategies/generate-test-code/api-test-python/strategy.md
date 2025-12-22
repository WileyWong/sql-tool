# Python API 测试代码生成策略

根据测试用例文档生成 Python API 自动化测试代码，使用 pytest + requests，支持请求构建、响应校验和数据清理。

---

## 适用场景

- 已通过标准化检查的 API 测试用例文档
- 集成测试/接口测试
- 需要真实调用 API 端点

---

## 技术栈

| 组件 | 版本 | 用途 |
|------|------|------|
| pytest | 7.0+ | 测试框架 |
| requests | 2.28+ | HTTP 客户端 |
| filelock | 3.0+ | 并发文件锁 |
| Python | 3.8+ | 运行环境 |

**依赖安装**:

```bash
pip install pytest requests filelock pytest-html
```

---

## 代码结构

### 测试文件模板

```python
"""
{模块名} API 自动化测试（真实接口测试，非Mock）
基于测试用例说明书生成
遵循 AAA 模式 (Arrange-Act-Assert)

⚠️ 重要说明:
    - 本测试进行【真实接口测试】，直接调用实际 API 端点
    - 不使用 Mock，验证真实服务行为
    - 需要启动真实测试环境后执行
    - 测试数据使用 UUID 生成唯一值，需手动调用清理方法

执行命令:
    pytest test_{module}_api.py -v                    # 运行全部测试
    pytest test_{module}_api.py -m p0 -v              # 仅运行P0用例
    pytest test_{module}_api.py -m "p0 or p1" -v      # 运行P0+P1用例
    pytest test_{module}_api.py --html=report.html    # 生成HTML报告
"""

import pytest
import requests
import time
import uuid
from dataclasses import dataclass
from typing import Optional, Dict, Any, List


# ============================================================
# 配置与常量
# ============================================================

class Config:
    """测试配置"""
    BASE_URL = "http://localhost:8080"
    API_PREFIX = "/api/v1"
    TIMEOUT = 10
    RESPONSE_TIME_THRESHOLD_MS = 500


class Tokens:
    """测试Token"""
    ADMIN = "Bearer admin_test_token"
    READONLY = "Bearer readonly_test_token"
    INVALID = "Bearer invalid_token"
    EXPIRED = "Bearer expired_token"


@dataclass
class TestData:
    """测试数据"""
    
    class Valid:
        # 有效数据
        pass
    
    class Boundary:
        # 边界值数据
        pass
    
    class Invalid:
        # 无效数据
        pass
    
    class Security:
        SQL_INJECTION = "' OR '1'='1"
        XSS_PAYLOAD = "<script>alert(1)</script>"
    
    class ExistingData:
        # 已存在数据
        pass


# ============================================================
# 工具函数
# ============================================================

def unique_id() -> str:
    """生成唯一ID"""
    return uuid.uuid4().hex[:8]


def api_url(path: str) -> str:
    """构建完整API URL"""
    return f"{Config.BASE_URL}{Config.API_PREFIX}{path}"


def auth_headers(token: str = Tokens.ADMIN) -> Dict[str, str]:
    """构建认证请求头"""
    return {
        "Authorization": token,
        "Content-Type": "application/json"
    }
```

### 正常场景测试方法

```python
class TestCreate{Resource}:
    """{资源}创建接口测试"""
    
    @pytest.mark.p0
    def test_post_{resource}_with_valid_data_returns_201(self, admin_headers, valid_data):
        """TC_001: 有效数据创建"""
        # Arrange - 准备阶段
        url = api_url("/{resources}")
        
        # Act - 执行阶段
        response = requests.post(url, json=valid_data, headers=admin_headers, timeout=Config.TIMEOUT)
        
        # Assert - 断言阶段
        assert response.status_code == 201, f"期望201，实际{response.status_code}"
        data = response.json()
        assert data["code"] == 0
        assert "id" in data["data"]
        
        # 记录创建的数据ID，用于后续手动清理
        track_created_resource(response, "test_post_{resource}_with_valid_data_returns_201")
```

### 异常场景测试方法

```python
@pytest.mark.p0
def test_post_{resource}_missing_required_field_returns_400(self, admin_headers):
    """TC_010: 缺少必填字段"""
    # Arrange
    url = api_url("/{resources}")
    invalid_data = {
        # 缺少必填字段
    }
    
    # Act
    response = requests.post(url, json=invalid_data, headers=admin_headers, timeout=Config.TIMEOUT)
    
    # Assert
    assert response.status_code == 400
    data = response.json()
    assert data["code"] == 40001
```

### 边界值测试方法

```python
@pytest.mark.p1
def test_post_{resource}_field_at_max_returns_201(self, admin_headers):
    """TC_020: 字段最大长度"""
    # Arrange
    url = api_url("/{resources}")
    data = {
        "field": "a" * 20  # 假设最大长度 20
    }
    
    # Act
    response = requests.post(url, json=data, headers=admin_headers, timeout=Config.TIMEOUT)
    
    # Assert
    assert response.status_code == 201
    
    # 记录创建的数据ID，用于后续手动清理
    track_created_resource(response, "test_post_{resource}_field_at_max_returns_201")
```

### 参数化测试

```python
@pytest.mark.p1
@pytest.mark.parametrize("invalid_email", ["invalid", "test@", "@example.com"])
def test_post_{resource}_with_invalid_email_returns_400(self, admin_headers, invalid_email):
    """TC_013: 无效邮箱格式"""
    # Arrange
    url = api_url("/{resources}")
    data = {
        "email": invalid_email,
        # 其他字段...
    }
    
    # Act
    response = requests.post(url, json=data, headers=admin_headers, timeout=Config.TIMEOUT)
    
    # Assert
    assert response.status_code == 400
```

---

## Fixtures

### 认证 Fixture

```python
@pytest.fixture
def admin_headers():
    """管理员认证头"""
    return auth_headers(Tokens.ADMIN)


@pytest.fixture
def readonly_headers():
    """只读用户认证头"""
    return auth_headers(Tokens.READONLY)
```

### 数据 Fixture

```python
@pytest.fixture
def valid_data():
    """有效测试数据"""
    return {
        "field1": f"test_{unique_id()}",
        "field2": f"test_{unique_id()}@example.com",
        # 其他字段...
    }


@pytest.fixture
def created_resource(admin_headers, valid_data):
    """
    创建真实测试资源并返回，测试后清理
    """
    response = requests.post(
        api_url("/{resources}"),
        json=valid_data,
        headers=admin_headers,
        timeout=Config.TIMEOUT
    )
    if response.status_code == 201:
        resource_id = response.json()["data"]["id"]
        yield response.json()["data"]
        # 清理：删除真实创建的数据
        requests.delete(
            api_url(f"/{resources}/{resource_id}"),
            headers=admin_headers,
            timeout=Config.TIMEOUT
        )
    else:
        yield None
```

---

## 清理代码

### CleanupRegistry 类

```python
import json
import os
from pathlib import Path
from datetime import datetime
from filelock import FileLock


class CleanupRegistry:
    """
    测试数据清理注册表（基于磁盘文件存储）
    
    用于记录测试过程中创建的数据，支持手动调用清理方法。
    不会自动清理，需要显式调用 execute_cleanup() 方法。
    
    数据存储:
        - 清理注册表文件: .cleanup_registry.json
        - 清理历史文件: .cleanup_history.json
    """
    
    _registry_file = ".cleanup_registry.json"
    _history_file = ".cleanup_history.json"
    _lock_file = ".cleanup_registry.lock"
    
    @classmethod
    def _get_lock(cls) -> FileLock:
        """获取文件锁"""
        return FileLock(cls._lock_file, timeout=10)
    
    @classmethod
    def _read_registry(cls) -> Dict[str, Any]:
        """读取注册表文件"""
        if not os.path.exists(cls._registry_file):
            return {"pending_ids": [], "records": []}
        try:
            with open(cls._registry_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return {"pending_ids": [], "records": []}
    
    @classmethod
    def _write_registry(cls, data: Dict[str, Any]) -> None:
        """写入注册表文件"""
        with open(cls._registry_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    
    @classmethod
    def track_created(cls, response, resource_type: str, test_name: str = "") -> None:
        """
        从响应中提取ID并记录到磁盘文件，用于后续清理
        
        Args:
            response: HTTP响应对象
            resource_type: 资源类型（如 user, order）
            test_name: 测试用例名称
        """
        if response.status_code == 201:
            try:
                resource_id = response.json()["data"]["id"]
                if resource_id:
                    with cls._get_lock():
                        registry = cls._read_registry()
                        if resource_id not in registry["pending_ids"]:
                            registry["pending_ids"].append(resource_id)
                            registry["records"].append({
                                "id": resource_id,
                                "type": resource_type,
                                "test_name": test_name or "unknown",
                                "created_at": datetime.now().isoformat()
                            })
                            cls._write_registry(registry)
                            print(f"[CleanupRegistry] 记录待清理{resource_type}: ID={resource_id}")
            except (KeyError, TypeError):
                pass
    
    @classmethod
    def get_cleanup_report(cls) -> Dict[str, Any]:
        """获取清理报告"""
        with cls._get_lock():
            registry = cls._read_registry()
            return {
                "pending_count": len(registry["pending_ids"]),
                "pending_ids": registry["pending_ids"].copy(),
                "records": registry["records"].copy()
            }
    
    @classmethod
    def execute_cleanup(cls, resource_type: str, delete_path_template: str, 
                       headers: Dict[str, str] = None) -> Dict[str, Any]:
        """
        执行清理操作
        
        Args:
            resource_type: 资源类型
            delete_path_template: 删除路径模板，如 "/users/{id}"
            headers: 认证请求头
        """
        if headers is None:
            headers = auth_headers(Tokens.ADMIN)
        
        with cls._get_lock():
            registry = cls._read_registry()
            records = [r for r in registry["records"] if r["type"] == resource_type]
        
        results = {
            "total": len(records),
            "success": 0,
            "failed": 0,
            "details": []
        }
        
        print(f"\n[CleanupRegistry] 开始清理 {resource_type}，共 {results['total']} 条...")
        
        for record in records:
            resource_id = record["id"]
            try:
                path = delete_path_template.format(id=resource_id)
                response = requests.delete(
                    api_url(path),
                    headers=headers,
                    timeout=Config.TIMEOUT
                )
                if response.status_code in [200, 204, 404]:
                    results["success"] += 1
                    status = "success" if response.status_code != 404 else "not_found"
                else:
                    results["failed"] += 1
                    status = "failed"
                
                # 更新注册表
                with cls._get_lock():
                    registry = cls._read_registry()
                    if resource_id in registry["pending_ids"]:
                        registry["pending_ids"].remove(resource_id)
                        registry["records"] = [r for r in registry["records"] if r["id"] != resource_id]
                        cls._write_registry(registry)
                
                print(f"[CleanupRegistry] 清理 {resource_type} ID={resource_id}: {status}")
                
            except Exception as e:
                results["failed"] += 1
                print(f"[CleanupRegistry] 清理 {resource_type} ID={resource_id} 失败: {e}")
        
        print(f"[CleanupRegistry] 清理完成: 成功={results['success']}, 失败={results['failed']}")
        return results
    
    @classmethod
    def clear_registry(cls) -> None:
        """清空注册表"""
        with cls._get_lock():
            cls._write_registry({"pending_ids": [], "records": []})
        print("[CleanupRegistry] 注册表已清空")


# 便捷函数
def track_created_resource(response, test_name: str = "", resource_type: str = "resource") -> None:
    """记录创建的资源（便捷函数）"""
    CleanupRegistry.track_created(response, resource_type, test_name)


def execute_cleanup(resource_type: str = "resource", delete_path: str = "/{resources}/{id}") -> Dict[str, Any]:
    """执行清理（便捷函数）"""
    return CleanupRegistry.execute_cleanup(resource_type, delete_path)


def get_cleanup_report() -> Dict[str, Any]:
    """获取清理报告（便捷函数）"""
    return CleanupRegistry.get_cleanup_report()
```

---

## pytest 配置

### pytest.ini

```ini
[pytest]
markers =
    p0: 冒烟测试 - 核心功能
    p1: 核心测试 - 重要功能
    p2: 完整测试 - 边缘场景
```

### pyproject.toml

```toml
[tool.pytest.ini_options]
markers = [
    "p0: 冒烟测试 - 核心功能",
    "p1: 核心测试 - 重要功能",
    "p2: 完整测试 - 边缘场景",
]
```

---

## 执行命令

```bash
# 运行全部测试
pytest test_{module}_api.py -v

# 仅运行P0用例
pytest test_{module}_api.py -m p0 -v

# 运行P0+P1用例
pytest test_{module}_api.py -m "p0 or p1" -v

# 生成HTML报告
pytest test_{module}_api.py --html=report.html

# 运行并显示打印输出
pytest test_{module}_api.py -v -s
```

---

## 输出产物

| 文件 | 路径 | 说明 |
|------|------|------|
| 测试文件 | `test_{module}_api.py` | 测试代码 |
| pytest配置 | `pytest.ini` 或 `pyproject.toml` | 测试标记配置 |
| 清理注册表 | `.cleanup_registry.json` | 待清理数据 |
| 清理历史 | `.cleanup_history.json` | 已清理记录 |

---

## 验证清单

- [ ] 测试文件命名正确 (`test_{module}_api.py`)
- [ ] 包含配置类 (Config, Tokens, TestData)
- [ ] 包含工具函数 (unique_id, api_url, auth_headers)
- [ ] 包含 Fixtures (admin_headers, valid_data)
- [ ] 包含清理机制 (CleanupRegistry)
- [ ] 测试方法遵循 AAA 模式
- [ ] 使用 `@pytest.mark.p0/p1/p2` 标记优先级
- [ ] 使用 `@pytest.mark.parametrize` 参数化测试
- [ ] 记录创建的数据用于清理
- [ ] 包含 pytest.ini 或 pyproject.toml 配置

---

## 数据清理使用说明

```python
# 1. 运行测试（数据会被记录到磁盘文件）
# pytest test_user_api.py -v

# 2. 查看待清理数据
from test_user_api import get_cleanup_report
report = get_cleanup_report()
print(f"待清理数据: {report['pending_count']} 条")

# 3. 执行清理
from test_user_api import execute_cleanup
result = execute_cleanup(resource_type="user", delete_path="/users/{id}")
print(f"清理结果: 成功={result['success']}, 失败={result['failed']}")
```

---

## 相关资源

- [Java API 测试策略](../api-test/strategy.md)
- [测试用例规范](../../../test-case-spec-standard.md)
- [完整示例](../../../examples/example-04-python.md)
