# Python 日志规范

> 继承自 [通用日志规范](../common/logging.md)，本文档补充 Python 特有规则

## 日志框架选择

### 推荐组合

| 场景 | 推荐框架 | 说明 |
|------|---------|------|
| 通用项目 | `logging` (标准库) | 内置、稳定、生态完善 |
| 快速开发 | `loguru` | 开箱即用、语法简洁 |
| 高性能场景 | `structlog` | 结构化日志、高性能 |

### 依赖安装

```bash
# loguru（推荐快速开发）
pip install loguru

# structlog（推荐生产环境）
pip install structlog
```

---

## Logger 配置

### 标准库 logging 配置

```python
# ✅ 推荐：配置文件方式
import logging
import logging.config
import json

# logging_config.json
LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(asctime)s [%(levelname)s] [%(name)s] [%(trace_id)s] - %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S"
        },
        "json": {
            "()": "pythonjsonlogger.jsonlogger.JsonFormatter",
            "format": "%(asctime)s %(levelname)s %(name)s %(trace_id)s %(message)s"
        }
    },
    "filters": {
        "trace_id": {
            "()": "myapp.logging.TraceIdFilter"
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": "DEBUG",
            "formatter": "standard",
            "filters": ["trace_id"],
            "stream": "ext://sys.stdout"
        },
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "level": "INFO",
            "formatter": "json",
            "filters": ["trace_id"],
            "filename": "logs/app.log",
            "maxBytes": 10485760,  # 10MB
            "backupCount": 5,
            "encoding": "utf-8"
        }
    },
    "loggers": {
        "myapp": {
            "level": "DEBUG",
            "handlers": ["console", "file"],
            "propagate": False
        }
    },
    "root": {
        "level": "INFO",
        "handlers": ["console"]
    }
}

logging.config.dictConfig(LOGGING_CONFIG)
```

### Logger 获取方式

```python
import logging

# ✅ 推荐：使用 __name__ 获取 logger
logger = logging.getLogger(__name__)

# ✅ 模块级别声明
class UserService:
    def __init__(self):
        self.logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")
    
    def create_user(self, user_data: dict) -> User:
        self.logger.info("创建用户, username=%s", user_data.get("username"))

# ❌ 错误示例
logger = logging.getLogger()  # 使用 root logger，不推荐
logger = logging.getLogger("mylogger")  # 硬编码名称，不利于追踪
```

### Loguru 配置

```python
from loguru import logger
import sys

# ✅ 移除默认 handler，自定义配置
logger.remove()

# 控制台输出
logger.add(
    sys.stdout,
    level="DEBUG",
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
           "<level>{level: <8}</level> | "
           "<cyan>{extra[trace_id]}</cyan> | "
           "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
           "<level>{message}</level>",
    filter=lambda record: record["extra"].get("trace_id", "N/A")
)

# 文件输出（JSON 格式）
logger.add(
    "logs/app.log",
    level="INFO",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {extra[trace_id]} | {name} - {message}",
    rotation="10 MB",
    retention="7 days",
    compression="gz",
    serialize=True  # JSON 格式
)

# 错误日志单独文件
logger.add(
    "logs/error.log",
    level="ERROR",
    rotation="10 MB",
    retention="30 days"
)
```

---

## 日志级别使用

### 级别对照

| 级别 | 使用场景 | 示例 |
|------|---------|------|
| **CRITICAL** | 系统崩溃，需立即处理 | 数据库连接池耗尽、关键服务不可用 |
| **ERROR** | 系统错误，影响功能 | 外部 API 调用失败、数据处理异常 |
| **WARNING** | 潜在问题，不影响主流程 | 配置缺失使用默认值、重试成功 |
| **INFO** | 关键业务节点 | 用户登录、订单创建、支付完成 |
| **DEBUG** | 调试信息 | 方法入参、中间变量、SQL 语句 |

### 代码示例

```python
import logging

logger = logging.getLogger(__name__)

class OrderService:
    def create_order(self, request: CreateOrderRequest) -> Order:
        # INFO: 关键业务节点
        logger.info(
            "开始创建订单, user_id=%s, product_id=%s",
            request.user_id, request.product_id
        )
        
        try:
            # DEBUG: 调试信息
            logger.debug("订单详情: %s", request.dict())
            
            order = self._build_order(request)
            self.order_repo.save(order)
            
            # INFO: 操作成功
            logger.info(
                "订单创建成功, order_id=%s, amount=%s",
                order.id, order.total_amount
            )
            return order
            
        except DuplicateOrderError as e:
            # WARNING: 可恢复的问题
            logger.warning(
                "订单重复创建, user_id=%s, 幂等返回",
                request.user_id
            )
            return self.order_repo.get_by_user_and_product(
                request.user_id, request.product_id
            )
            
        except Exception as e:
            # ERROR: 系统错误（包含堆栈）
            logger.exception(
                "订单创建失败, user_id=%s",
                request.user_id
            )
            raise OrderCreateError("订单创建失败") from e
```

---

## 占位符使用

### 正确用法

```python
# ✅ 使用 % 格式化（logging 推荐，延迟求值）
logger.info("用户登录成功, user_id=%s, ip=%s", user_id, ip)
logger.debug("查询结果: count=%d, items=%s", count, items)

# ✅ 异常使用 exception 方法（自动包含堆栈）
try:
    process_data()
except Exception:
    logger.exception("处理失败, order_id=%s", order_id)

# ✅ loguru 使用 {} 占位符
from loguru import logger
logger.info("用户登录成功, user_id={}, ip={}", user_id, ip)

# ❌ 错误示例
logger.info(f"用户登录成功, user_id={user_id}")  # f-string 立即求值
logger.info("用户登录成功, user_id=" + str(user_id))  # 字符串拼接
logger.info("用户登录成功, user_id={}".format(user_id))  # format 立即求值
```

### 性能考虑

```python
# ✅ 推荐：% 格式化，日志级别不满足时不会执行格式化
logger.debug("详细信息: %s", expensive_operation())

# ✅ 复杂计算使用 isEnabledFor 检查
if logger.isEnabledFor(logging.DEBUG):
    logger.debug("详细信息: %s", very_expensive_operation())

# ✅ loguru 使用 opt(lazy=True)
logger.opt(lazy=True).debug("详细信息: {}", lambda: expensive_operation())
```

---

## 必须记录日志的场景

### 外部调用

```python
import time
import logging

logger = logging.getLogger(__name__)

class PaymentClient:
    def pay(self, request: PaymentRequest) -> PaymentResult:
        start_time = time.time()
        
        # 入参日志
        logger.info(
            "调用支付接口, order_id=%s, amount=%s",
            request.order_id, request.amount
        )
        
        try:
            result = self._do_payment(request)
            
            # 出参日志（含耗时）
            logger.info(
                "支付接口返回, order_id=%s, status=%s, cost_ms=%.2f",
                request.order_id, result.status,
                (time.time() - start_time) * 1000
            )
            return result
            
        except Exception as e:
            logger.exception(
                "支付接口异常, order_id=%s, cost_ms=%.2f",
                request.order_id,
                (time.time() - start_time) * 1000
            )
            raise
```

### 定时任务

```python
import logging
from apscheduler.schedulers.background import BackgroundScheduler

logger = logging.getLogger(__name__)

def cancel_timeout_orders():
    logger.info("开始执行订单超时取消任务")
    start_time = time.time()
    
    try:
        count = order_service.cancel_timeout_orders()
        logger.info(
            "订单超时取消任务完成, 处理数量=%d, 耗时=%.2fms",
            count, (time.time() - start_time) * 1000
        )
    except Exception:
        logger.exception(
            "订单超时取消任务异常, 耗时=%.2fms",
            (time.time() - start_time) * 1000
        )

scheduler = BackgroundScheduler()
scheduler.add_job(cancel_timeout_orders, 'cron', minute='*/5')
```

### 异常处理

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger(__name__)
app = FastAPI()

@app.exception_handler(BusinessException)
async def business_exception_handler(request: Request, exc: BusinessException):
    # WARNING: 业务异常
    logger.warning(
        "业务异常: code=%s, message=%s, path=%s",
        exc.code, exc.message, request.url.path
    )
    return JSONResponse(
        status_code=400,
        content={"code": exc.code, "message": exc.message}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # ERROR: 系统异常（含堆栈）
    logger.exception(
        "系统异常, path=%s, method=%s",
        request.url.path, request.method
    )
    return JSONResponse(
        status_code=500,
        content={"code": "SYSTEM_ERROR", "message": "系统繁忙，请稍后重试"}
    )
```

---

## 敏感信息处理

### 脱敏工具

```python
import re
from typing import Optional

class LogMaskUtils:
    """日志脱敏工具类"""
    
    @staticmethod
    def mask_phone(phone: Optional[str]) -> str:
        """手机号脱敏: 138****1234"""
        if not phone or len(phone) != 11:
            return phone or ""
        return f"{phone[:3]}****{phone[7:]}"
    
    @staticmethod
    def mask_id_card(id_card: Optional[str]) -> str:
        """身份证脱敏: 110***********1234"""
        if not id_card or len(id_card) < 8:
            return id_card or ""
        return f"{id_card[:3]}{'*' * (len(id_card) - 7)}{id_card[-4:]}"
    
    @staticmethod
    def mask_bank_card(bank_card: Optional[str]) -> str:
        """银行卡脱敏: 6222************1234"""
        if not bank_card or len(bank_card) < 8:
            return bank_card or ""
        return f"{bank_card[:4]}{'*' * (len(bank_card) - 8)}{bank_card[-4:]}"
    
    @staticmethod
    def mask_email(email: Optional[str]) -> str:
        """邮箱脱敏: u***@example.com"""
        if not email or "@" not in email:
            return email or ""
        local, domain = email.split("@", 1)
        if len(local) <= 1:
            return f"*@{domain}"
        return f"{local[0]}***@{domain}"
    
    @staticmethod
    def mask_dict(data: dict, sensitive_keys: set[str]) -> dict:
        """字典敏感字段脱敏"""
        result = {}
        for key, value in data.items():
            if key.lower() in sensitive_keys:
                result[key] = "***"
            elif isinstance(value, dict):
                result[key] = LogMaskUtils.mask_dict(value, sensitive_keys)
            else:
                result[key] = value
        return result

# 敏感字段集合
SENSITIVE_KEYS = {
    "password", "passwd", "pwd",
    "token", "access_token", "refresh_token",
    "secret", "secret_key", "api_key",
    "authorization", "auth",
    "credit_card", "card_number",
}

# 使用示例
logger.info(
    "用户注册, phone=%s, email=%s",
    LogMaskUtils.mask_phone(user.phone),
    LogMaskUtils.mask_email(user.email)
)
```

### 日志过滤器

```python
import logging
import re

class SensitiveDataFilter(logging.Filter):
    """敏感信息过滤器"""
    
    PATTERNS = [
        (re.compile(r'password["\']?\s*[:=]\s*["\']?[^"\'&\s]+', re.I), 'password=***'),
        (re.compile(r'token["\']?\s*[:=]\s*["\']?[^"\'&\s]+', re.I), 'token=***'),
        (re.compile(r'\b\d{11}\b'), '***'),  # 手机号
        (re.compile(r'\b\d{15,19}\b'), '****'),  # 银行卡号
    ]
    
    def filter(self, record: logging.LogRecord) -> bool:
        if isinstance(record.msg, str):
            for pattern, replacement in self.PATTERNS:
                record.msg = pattern.sub(replacement, record.msg)
        return True

# 配置过滤器
logger = logging.getLogger(__name__)
logger.addFilter(SensitiveDataFilter())
```

### 禁止记录

```python
# ❌ 禁止记录
logger.info("用户登录, password=%s", password)
logger.debug("Token: %s", access_token)
logger.info("身份证: %s", id_card)  # 未脱敏
logger.debug("请求体: %s", request.json())  # 可能包含敏感信息

# ✅ 正确做法
logger.info("用户登录, username=%s", username)
logger.info("身份证: %s", LogMaskUtils.mask_id_card(id_card))
logger.debug("请求体: %s", LogMaskUtils.mask_dict(request.json(), SENSITIVE_KEYS))
```

---

## TraceId 追踪

### 标准库实现

```python
import logging
import uuid
import contextvars
from typing import Optional

# 上下文变量存储 trace_id
trace_id_var: contextvars.ContextVar[str] = contextvars.ContextVar(
    'trace_id', default=''
)

class TraceIdFilter(logging.Filter):
    """TraceId 过滤器"""
    
    def filter(self, record: logging.LogRecord) -> bool:
        record.trace_id = trace_id_var.get() or '-'
        return True

def get_trace_id() -> str:
    """获取当前 trace_id"""
    return trace_id_var.get()

def set_trace_id(trace_id: Optional[str] = None) -> str:
    """设置 trace_id"""
    tid = trace_id or uuid.uuid4().hex[:16]
    trace_id_var.set(tid)
    return tid
```

### FastAPI 中间件

```python
from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware
import uuid

app = FastAPI()

class TraceIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # 从请求头获取或生成 trace_id
        trace_id = request.headers.get("X-Trace-Id") or uuid.uuid4().hex[:16]
        set_trace_id(trace_id)
        
        response = await call_next(request)
        response.headers["X-Trace-Id"] = trace_id
        return response

app.add_middleware(TraceIdMiddleware)
```

### Django 中间件

```python
import uuid
from django.utils.deprecation import MiddlewareMixin

class TraceIdMiddleware(MiddlewareMixin):
    def process_request(self, request):
        trace_id = request.headers.get("X-Trace-Id") or uuid.uuid4().hex[:16]
        set_trace_id(trace_id)
        request.trace_id = trace_id
    
    def process_response(self, request, response):
        if hasattr(request, 'trace_id'):
            response["X-Trace-Id"] = request.trace_id
        return response
```

---

## 结构化日志

### JSON 格式输出

```python
import logging
import json
from datetime import datetime

class JsonFormatter(logging.Formatter):
    """JSON 格式化器"""
    
    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "trace_id": getattr(record, 'trace_id', '-'),
        }
        
        # 添加异常信息
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        
        # 添加额外字段
        if hasattr(record, 'extra_fields'):
            log_data.update(record.extra_fields)
        
        return json.dumps(log_data, ensure_ascii=False)

# 配置使用
handler = logging.StreamHandler()
handler.setFormatter(JsonFormatter())
logger.addHandler(handler)
```

### Structlog 配置

```python
import structlog
import logging

structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer()
    ],
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
    context_class=dict,
    logger_factory=structlog.PrintLoggerFactory(),
    cache_logger_on_first_use=True,
)

# 使用
logger = structlog.get_logger()
logger.info("用户登录", user_id=123, ip="192.168.1.1")
# 输出: {"event": "用户登录", "user_id": 123, "ip": "192.168.1.1", "level": "info", "timestamp": "..."}
```

---

## 框架集成

### Flask 集成

```python
from flask import Flask, request, g
import logging
import uuid

app = Flask(__name__)

@app.before_request
def before_request():
    g.trace_id = request.headers.get("X-Trace-Id") or uuid.uuid4().hex[:16]
    g.start_time = time.time()
    set_trace_id(g.trace_id)

@app.after_request
def after_request(response):
    # 请求日志
    logger.info(
        "请求完成, method=%s, path=%s, status=%d, cost_ms=%.2f",
        request.method, request.path, response.status_code,
        (time.time() - g.start_time) * 1000
    )
    response.headers["X-Trace-Id"] = g.trace_id
    return response
```

### Django 集成

```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'trace_id': {
            '()': 'myapp.logging.TraceIdFilter',
        },
    },
    'formatters': {
        'verbose': {
            'format': '{asctime} [{levelname}] [{name}] [{trace_id}] - {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
            'filters': ['trace_id'],
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/django.log',
            'maxBytes': 10485760,
            'backupCount': 5,
            'formatter': 'verbose',
            'filters': ['trace_id'],
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
        },
        'myapp': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}
```

### FastAPI 集成

```python
from fastapi import FastAPI
from contextlib import asynccontextmanager
import logging

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("应用启动")
    yield
    logger.info("应用关闭")

app = FastAPI(lifespan=lifespan)

# 请求日志中间件
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    response = await call_next(request)
    
    logger.info(
        "请求完成, method=%s, path=%s, status=%d, cost_ms=%.2f",
        request.method, request.url.path, response.status_code,
        (time.time() - start_time) * 1000
    )
    return response
```

---

## 检查清单

- [ ] 使用 `logging` 标准库或 `loguru`/`structlog`
- [ ] Logger 使用 `__name__` 获取
- [ ] 使用 `%` 格式化（logging）或 `{}` 格式化（loguru）
- [ ] 异常使用 `logger.exception()` 记录完整堆栈
- [ ] 关键业务节点有 INFO 日志
- [ ] 外部调用记录入参、出参、耗时
- [ ] 敏感信息已脱敏
- [ ] 配置 TraceId 追踪
- [ ] 生产环境使用 JSON 格式日志
- [ ] 配置日志轮转（RotatingFileHandler）

---

## 参考

- [通用日志规范](../common/logging.md)
- [Python logging 官方文档](https://docs.python.org/3/library/logging.html)
- [loguru 文档](https://loguru.readthedocs.io/)
- [structlog 文档](https://www.structlog.org/)
