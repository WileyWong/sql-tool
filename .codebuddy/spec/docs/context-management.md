# 上下文管理机制

> 长任务 Agent 的上下文管理设计，解决跨会话、跨功能的上下文过大问题。
> 支持**轻量级 RAG 检索**和**外部知识库引用**。

## 🎯 问题背景

长任务执行过程中，上下文会随着设计文档的累积而不断增长：

```
会话 1: 需求分析 → 生成 requirement.md (2000 tokens)
会话 2: 数据库设计 → 生成 database-design.md (3000 tokens)
会话 3: API 设计 → 生成 api-design.md (4000 tokens)
会话 4: 编码 F005 → 需要读取所有设计文档 (9000+ tokens) ← 上下文爆炸！
```

**核心问题**：
- ❌ 每次编码都要读取完整设计文档
- ❌ 上下文 tokens 随功能增加线性增长
- ❌ 跨会话恢复时需要重新读取所有文档
- ❌ 无法区分"必需"和"可选"上下文

## 🏗️ 解决方案架构

### 三层上下文模型

```
┌─────────────────────────────────────────────────────────────────┐
│                     上下文管理架构                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: 摘要层 (Summary)                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  feature-list.json 中的 context.summary 字段              │   │
│  │  - 每个功能的 1-2 句话摘要                                 │   │
│  │  - 约 50-100 tokens/功能                                  │   │
│  │  - 用于快速理解和路由决策                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                   │
│  Layer 2: 索引层 (Index)                                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  design/index.json - 设计文档索引                          │   │
│  │  - 实体 → 文档位置映射                                     │   │
│  │  - API → 文档位置映射                                      │   │
│  │  - 功能 → 相关文档映射                                     │   │
│  │  - 约 500-1000 tokens                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                   │
│  Layer 3: 详情层 (Detail)                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  完整设计文档 (按需加载)                                    │   │
│  │  - design/requirement.md                                  │   │
│  │  - design/database-design.md                              │   │
│  │  - design/api-design.md                                   │   │
│  │  - 仅在需要时读取相关 section                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 上下文加载策略

```python
def prepare_context(feature, max_tokens=8000):
    """
    智能上下文准备，确保不超过 token 限制
    
    策略：
    1. 始终加载摘要层 (必需，约 100-300 tokens)
    2. 加载相关索引 (必需，约 200-500 tokens)  
    3. 按需加载详情层 (可选，按优先级裁剪)
    """
    context = {}
    tokens_used = 0
    
    # === Layer 1: 摘要层 (始终加载) ===
    summary = feature["context"]["summary"]
    context["summary"] = summary
    tokens_used += estimate_tokens(summary)
    
    # === Layer 2: 索引层 (始终加载) ===
    index = read_json("design/index.json")
    relevant_index = extract_relevant_index(index, feature)
    context["index"] = relevant_index
    tokens_used += estimate_tokens(relevant_index)
    
    # === Layer 3: 详情层 (按需加载) ===
    remaining_tokens = max_tokens - tokens_used - 2000  # 预留输出空间
    
    # 3.1 必需上下文 (优先级最高)
    for item in feature["context"]["required"]:
        content = load_context_item(item)
        item_tokens = estimate_tokens(content)
        
        if tokens_used + item_tokens <= max_tokens * 0.7:
            context[item["key"]] = content
            tokens_used += item_tokens
        else:
            # 超限时使用摘要替代
            context[item["key"]] = item.get("fallback_summary", summary)
    
    # 3.2 可选上下文 (填充剩余空间)
    for item in feature["context"]["optional"]:
        if remaining_tokens > 500:
            content = load_context_item(item)
            item_tokens = estimate_tokens(content)
            
            if item_tokens <= remaining_tokens:
                context[item["key"]] = content
                tokens_used += item_tokens
                remaining_tokens -= item_tokens
    
    return context, tokens_used
```

## 📋 数据结构设计

### 1. feature-list.json 扩展

```json
{
  "task_id": "user-management-2025-12-05",
  "title": "用户管理模块",
  "features": [
    {
      "id": "F005",
      "category": "coding",
      "name": "用户注册接口",
      "description": "实现用户注册 API",
      
      "context": {
        "summary": "POST /api/user/register, 参数: username/password/email, 返回: user_id + token, 业务规则: 用户名唯一/密码加密/邮箱验证",
        
        "required": [
          {
            "key": "api_spec",
            "type": "design_section",
            "file": "design/api-design.md",
            "section": "用户注册接口",
            "fallback_summary": "POST /api/user/register, 参数: username/password/email"
          },
          {
            "key": "db_schema",
            "type": "design_section", 
            "file": "design/database-design.md",
            "section": "user表",
            "fallback_summary": "user表: id/username/password_hash/email/created_at"
          }
        ],
        
        "optional": [
          {
            "key": "architecture",
            "type": "design_file",
            "file": "design/architecture.md"
          },
          {
            "key": "code_example",
            "type": "code_file",
            "file": "src/common/BaseController.java"
          }
        ],
        
        "dependencies": ["F001", "F002", "F003"],
        
        "estimated_tokens": {
          "summary": 80,
          "required": 1500,
          "optional": 2000,
          "total": 3580
        }
      },
      
      "passes": false,
      "in_progress": true
    }
  ]
}
```

### 2. design/index.json (新增)

```json
{
  "version": "1.0",
  "updated_at": "2025-12-05T14:30:00Z",
  
  "entities": {
    "User": {
      "description": "用户实体，包含基本信息和认证信息",
      "table": "t_user",
      "design_refs": {
        "entity": "design/database-design.md#User实体",
        "table": "design/database-design.md#user表",
        "ddl": "design/ddl.sql#CREATE TABLE t_user"
      },
      "related_features": ["F001", "F002", "F005", "F006"],
      "fields": ["id", "username", "password_hash", "email", "phone", "status", "created_at"]
    },
    "Role": {
      "description": "角色实体，用于权限管理",
      "table": "t_role",
      "design_refs": {
        "entity": "design/database-design.md#Role实体",
        "table": "design/database-design.md#role表"
      },
      "related_features": ["F002", "F007"],
      "fields": ["id", "name", "code", "description"]
    }
  },
  
  "apis": {
    "POST /api/user/register": {
      "description": "用户注册接口",
      "design_ref": "design/api-design.md#用户注册接口",
      "related_entities": ["User"],
      "related_features": ["F005"],
      "request": "UserRegisterRequest",
      "response": "UserRegisterResponse"
    },
    "POST /api/user/login": {
      "description": "用户登录接口",
      "design_ref": "design/api-design.md#用户登录接口",
      "related_entities": ["User"],
      "related_features": ["F006"],
      "request": "UserLoginRequest",
      "response": "UserLoginResponse"
    }
  },
  
  "features": {
    "F001": {
      "name": "需求分析",
      "outputs": ["design/requirement.md"],
      "provides_context_for": ["F002", "F003", "F004"]
    },
    "F002": {
      "name": "数据库设计",
      "outputs": ["design/database-design.md", "design/ddl.sql"],
      "depends_on": ["F001"],
      "provides_context_for": ["F003", "F005", "F006", "F007"]
    },
    "F003": {
      "name": "API设计",
      "outputs": ["design/api-design.md"],
      "depends_on": ["F001", "F002"],
      "provides_context_for": ["F005", "F006", "F007"]
    },
    "F005": {
      "name": "用户注册接口",
      "outputs": ["src/controller/UserController.java", "src/service/UserService.java"],
      "depends_on": ["F002", "F003"],
      "required_context": {
        "from_F002": ["user表结构"],
        "from_F003": ["用户注册接口规格"]
      }
    }
  }
}
```

### 3. design/summary.md (新增)

```markdown
# 设计摘要

> 自动生成的设计文档摘要，用于快速上下文加载。每次设计完成后自动更新。

## 需求摘要 (F001)

**核心功能**:
- 用户注册: 用户名/密码/邮箱，支持邮箱验证
- 用户登录: 账号密码登录，JWT Token 认证
- 权限管理: RBAC 模型，角色-权限-用户三级关系

**业务规则**:
- 用户名: 4-20字符，字母数字下划线，唯一
- 密码: 8-32字符，包含字母和数字，BCrypt加密
- 邮箱: 标准格式，需验证，唯一

---

## 数据库摘要 (F002)

**表结构**:

| 表名 | 说明 | 核心字段 |
|-----|------|---------|
| t_user | 用户表 | id, username, password_hash, email, status |
| t_role | 角色表 | id, name, code, description |
| t_permission | 权限表 | id, name, code, resource, action |
| t_user_role | 用户角色关联 | user_id, role_id |
| t_role_permission | 角色权限关联 | role_id, permission_id |

**关键索引**:
- t_user: uk_username, uk_email
- t_role: uk_code

---

## API 摘要 (F003)

### 用户注册
- **路径**: POST /api/user/register
- **参数**: username(必填), password(必填), email(必填)
- **返回**: { user_id, token }
- **规则**: 用户名唯一, 密码加密, 邮箱验证

### 用户登录
- **路径**: POST /api/user/login
- **参数**: username, password
- **返回**: { user_id, token, expires_in }
- **规则**: 密码验证, JWT生成, 登录日志

### 权限管理
- **角色CRUD**: GET/POST/PUT/DELETE /api/roles
- **权限分配**: POST /api/roles/{id}/permissions
- **用户角色**: POST /api/users/{id}/roles

---

## 架构摘要 (F004)

**技术选型**:
- 后端: Spring Boot 3.2 + MyBatis-Plus 3.5
- 数据库: MySQL 8.0
- 认证: JWT + Spring Security
- 缓存: Redis (Token存储)

**分层架构**:
```
Controller → Service → Mapper → Database
    ↓           ↓
   DTO       Entity
```

**包结构**:
- controller: REST 接口层
- service: 业务逻辑层
- mapper: 数据访问层
- entity: 实体类
- dto: 数据传输对象
- common: 公共组件
```

## 🔄 工作流程

### 1. 设计完成时生成摘要

```python
# design-worker 完成设计后
def on_design_complete(feature, design_doc):
    """
    设计完成后的钩子函数
    """
    # 1. 生成摘要
    summary = generate_summary(design_doc)
    
    # 2. 更新 feature-list.json
    update_feature_context(
        feature_id=feature["id"],
        summary=summary,
        required_context=extract_required_context(design_doc),
        estimated_tokens=estimate_tokens(design_doc)
    )
    
    # 3. 更新设计索引
    update_design_index(feature, design_doc)
    
    # 4. 更新摘要文档
    append_to_summary_doc(feature, summary)
```

### 2. 编码时加载上下文

```python
# coding-worker 开始编码前
def prepare_coding_context(feature):
    """
    为编码任务准备上下文
    """
    # 1. 读取摘要层
    summary = feature["context"]["summary"]
    
    # 2. 读取索引层
    index = read_json("design/index.json")
    relevant_apis = get_relevant_apis(index, feature)
    relevant_entities = get_relevant_entities(index, feature)
    
    # 3. 按需读取详情层
    context = {
        "summary": summary,
        "apis": relevant_apis,
        "entities": relevant_entities
    }
    
    # 4. 检查 token 预算
    tokens_used = estimate_tokens(context)
    if tokens_used > 6000:  # 预警阈值
        log_warning(f"上下文较大: {tokens_used} tokens")
    
    return context
```

### 3. 跨会话恢复时

```python
# master-orchestrator 会话启动时
def session_start():
    """
    会话启动，智能恢复上下文
    """
    # 1. 读取 feature-list.json (包含摘要)
    feature_list = read_json("feature-list.json")
    
    # 2. 读取设计索引 (轻量级)
    design_index = read_json("design/index.json")
    
    # 3. 识别下一个功能
    next_feature = select_next_feature(feature_list)
    
    # 4. 仅加载该功能需要的上下文
    context = prepare_context(next_feature)
    
    # 5. 展示状态 (不需要读取完整设计文档)
    display_progress(feature_list)
    
    return context
```

## 📊 Token 预算管理

### 预算分配

| 层级 | 预算占比 | 典型 tokens | 说明 |
|-----|---------|------------|------|
| 摘要层 | 5% | 200-400 | 始终加载 |
| 索引层 | 10% | 400-800 | 始终加载 |
| 必需详情 | 50% | 2000-4000 | 优先加载 |
| 可选详情 | 20% | 800-1600 | 按需加载 |
| 输出预留 | 15% | 600-1200 | 预留给生成 |
| **总计** | 100% | 4000-8000 | 单次调用上限 |

### 监控指标

```json
// progress.md 中增加上下文监控
{
  "context_usage": {
    "F001": { "tokens": 1200, "status": "normal" },
    "F002": { "tokens": 2500, "status": "normal" },
    "F003": { "tokens": 3200, "status": "warning" },
    "F005": { "tokens": 4800, "status": "warning" }
  },
  "total_design_tokens": 9700,
  "average_per_feature": 2425,
  "recommendations": [
    "F003 上下文较大(3200 tokens)，建议使用摘要",
    "F005 编码时考虑分批加载"
  ]
}
```

## 🛠️ 工具函数

### generate_summary

```python
def generate_summary(design_doc: str, max_tokens: int = 200) -> str:
    """
    生成设计文档摘要
    
    Args:
        design_doc: 完整设计文档内容
        max_tokens: 摘要最大 tokens
    
    Returns:
        结构化摘要字符串
    
    摘要格式:
        - API: {method} {path}, 参数: {params}, 返回: {response}
        - 表: {table_name} ({key_fields})
        - 规则: {business_rules}
    """
    # 使用 LLM 生成摘要
    prompt = f"""
    请为以下设计文档生成简洁摘要，格式要求：
    1. 每个 API 用一行描述：METHOD /path, 参数: xxx, 返回: xxx
    2. 每个表用一行描述：表名 (核心字段)
    3. 关键业务规则用简短句子
    4. 总长度控制在 {max_tokens} tokens 以内
    
    设计文档:
    {design_doc}
    """
    return llm_generate(prompt)
```

### extract_section

```python
def extract_section(file_path: str, section_name: str) -> str:
    """
    从 Markdown 文件中提取指定 section
    
    Args:
        file_path: 文件路径
        section_name: section 标题 (支持模糊匹配)
    
    Returns:
        section 内容
    """
    content = read_file(file_path)
    
    # 使用正则匹配 section
    pattern = rf"(#{1,3}\s*{section_name}.*?)(?=#{1,3}\s|\Z)"
    match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
    
    if match:
        return match.group(1).strip()
    else:
        return ""
```

### estimate_tokens

```python
def estimate_tokens(text: str) -> int:
    """
    估算文本的 token 数量
    
    简单估算: 中文约 1.5 字/token, 英文约 4 字符/token
    """
    chinese_chars = len(re.findall(r'[\u4e00-\u9fff]', text))
    other_chars = len(text) - chinese_chars
    
    return int(chinese_chars / 1.5 + other_chars / 4)
```

## 🔍 轻量级 RAG 检索机制

### 设计理念

采用**关键词索引 + 智能检索**的轻量级 RAG 方案，无需向量数据库：

```
┌─────────────────────────────────────────────────────────────────┐
│                     轻量级 RAG 架构                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  用户查询 / 功能描述                                              │
│       ↓                                                         │
│  关键词提取 (extract_keywords)                                   │
│       ↓                                                         │
│  多路检索:                                                       │
│  ├── 1. 设计索引检索 (design/index.json)                         │
│  ├── 2. 关键词索引检索 (design/keywords.json)                    │
│  └── 3. 外部知识库检索 (knowledge_bases)                         │
│       ↓                                                         │
│  结果合并 + 相关性排序                                            │
│       ↓                                                         │
│  上下文组装 (受 token 预算限制)                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 关键词索引 (design/keywords.json)

```json
{
  "version": "1.0",
  "updated_at": "2025-12-05T14:30:00Z",
  
  "keywords": {
    "用户": {
      "features": ["F001", "F002", "F005", "F006"],
      "entities": ["User"],
      "apis": ["POST /api/user/register", "POST /api/user/login"],
      "files": ["design/database-design.md", "design/api-design.md"]
    },
    "注册": {
      "features": ["F005"],
      "entities": ["User"],
      "apis": ["POST /api/user/register"],
      "files": ["design/api-design.md#用户注册接口"]
    },
    "登录": {
      "features": ["F006"],
      "entities": ["User"],
      "apis": ["POST /api/user/login"],
      "files": ["design/api-design.md#用户登录接口"]
    },
    "权限": {
      "features": ["F007"],
      "entities": ["Role", "Permission"],
      "apis": ["GET /api/roles", "POST /api/roles/{id}/permissions"],
      "files": ["design/database-design.md#权限表", "design/api-design.md#权限管理"]
    },
    "JWT": {
      "features": ["F004", "F006"],
      "entities": [],
      "apis": ["POST /api/user/login"],
      "files": ["design/architecture.md#认证机制"]
    },
    "RBAC": {
      "features": ["F007"],
      "entities": ["Role", "Permission", "UserRole"],
      "apis": [],
      "files": ["design/database-design.md#RBAC模型"]
    }
  },
  
  "synonyms": {
    "登陆": "登录",
    "注冊": "注册",
    "鉴权": "权限",
    "授权": "权限",
    "token": "JWT"
  }
}
```

### RAG 检索函数

```python
def rag_search(query: str, feature: dict, max_results: int = 5) -> list:
    """
    轻量级 RAG 检索
    
    Args:
        query: 查询文本（功能描述或用户问题）
        feature: 当前功能对象
        max_results: 最大返回结果数
    
    Returns:
        相关上下文列表，按相关性排序
    """
    results = []
    
    # 1. 提取关键词
    keywords = extract_keywords(query)
    
    # 2. 加载索引
    design_index = read_json("design/index.json")
    keyword_index = read_json("design/keywords.json")
    
    # 3. 多路检索
    # 3.1 设计索引检索
    for keyword in keywords:
        if keyword in design_index.get("entities", {}):
            entity = design_index["entities"][keyword]
            results.append({
                "type": "entity",
                "keyword": keyword,
                "content": entity,
                "relevance": 0.9,
                "source": entity.get("design_ref")
            })
        
        for api_path, api_info in design_index.get("apis", {}).items():
            if keyword in api_path or keyword in api_info.get("description", ""):
                results.append({
                    "type": "api",
                    "keyword": keyword,
                    "content": api_info,
                    "relevance": 0.85,
                    "source": api_info.get("design_ref")
                })
    
    # 3.2 关键词索引检索
    for keyword in keywords:
        # 同义词处理
        normalized = keyword_index.get("synonyms", {}).get(keyword, keyword)
        
        if normalized in keyword_index.get("keywords", {}):
            kw_info = keyword_index["keywords"][normalized]
            for file_ref in kw_info.get("files", []):
                results.append({
                    "type": "file",
                    "keyword": normalized,
                    "file": file_ref,
                    "relevance": 0.8,
                    "source": file_ref
                })
    
    # 4. 去重和排序
    unique_results = deduplicate_by_source(results)
    sorted_results = sorted(unique_results, key=lambda x: x["relevance"], reverse=True)
    
    return sorted_results[:max_results]

def extract_keywords(text: str) -> list:
    """
    从文本中提取关键词
    
    策略:
    1. 中文分词（简单实现：按标点和空格分割）
    2. 过滤停用词
    3. 提取实体名词
    """
    # 简单实现：提取中文词汇和英文单词
    import re
    
    # 中文词汇（2-4字）
    chinese_words = re.findall(r'[\u4e00-\u9fff]{2,4}', text)
    
    # 英文单词
    english_words = re.findall(r'[a-zA-Z]{3,}', text)
    
    # 停用词过滤
    stopwords = {"的", "是", "在", "和", "了", "有", "个", "这", "那", "一", "不"}
    keywords = [w for w in chinese_words if w not in stopwords]
    keywords.extend([w.lower() for w in english_words])
    
    return list(set(keywords))

def deduplicate_by_source(results: list) -> list:
    """
    按 source 去重，保留相关性最高的
    """
    seen = {}
    for result in results:
        source = result.get("source", "")
        if source not in seen or result["relevance"] > seen[source]["relevance"]:
            seen[source] = result
    return list(seen.values())
```

### 智能上下文检索

```python
def smart_context_search(feature: dict, query: str = None, max_tokens: int = 8000) -> dict:
    """
    智能上下文检索（增强版）
    
    1. 优先使用 feature.context 中预定义的上下文
    2. 使用 RAG 检索补充相关上下文
    3. 如果有外部知识库，检索并合并
    4. 控制总 tokens 不超过预算
    
    Args:
        feature: 当前功能对象
        query: 额外的查询文本（可选）
        max_tokens: token 预算
    
    Returns:
        context: 组装好的上下文字典
        tokens_used: 使用的 tokens 数
    """
    context = {}
    tokens_used = 0
    
    # === 1. 加载预定义上下文（摘要 + 必需）===
    if "context" in feature:
        # 摘要层
        summary = feature["context"].get("summary", "")
        context["summary"] = summary
        tokens_used += estimate_tokens(summary)
        
        # 必需上下文
        for item in feature["context"].get("required", []):
            content = load_context_item(item)
            context[item["key"]] = content
            tokens_used += estimate_tokens(content)
    
    # === 2. RAG 检索补充 ===
    if query and tokens_used < max_tokens * 0.7:
        rag_query = query or feature.get("description", feature.get("name", ""))
        rag_results = rag_search(rag_query, feature, max_results=3)
        
        for result in rag_results:
            if tokens_used >= max_tokens * 0.85:
                break
            
            # 跳过已加载的
            if result["source"] in [item.get("file") for item in feature["context"].get("required", [])]:
                continue
            
            content = load_from_source(result["source"])
            item_tokens = estimate_tokens(content)
            
            if tokens_used + item_tokens < max_tokens * 0.85:
                context[f"rag_{result['type']}_{result['keyword']}"] = content
                tokens_used += item_tokens
    
    # === 3. 外部知识库检索 ===
    knowledge_bases = feature.get("knowledge_bases", [])
    if knowledge_bases and tokens_used < max_tokens * 0.9:
        kb_context = search_knowledge_bases(
            knowledge_bases=knowledge_bases,
            query=query or feature.get("description", ""),
            max_tokens=max_tokens - tokens_used - 1000  # 预留输出空间
        )
        if kb_context:
            context["external_knowledge"] = kb_context
            tokens_used += estimate_tokens(kb_context)
    
    return context, tokens_used
```

---

## 📚 外部知识库支持

### 设计目标

支持用户在任务初始化时指定外部知识库，并在整个任务生命周期中传递给所有 Sub-Agent。

### 知识库配置格式

```json
{
  "knowledge_bases": [
    {
      "id": "kb_spring_boot",
      "type": "local_docs",
      "name": "Spring Boot 开发规范",
      "path": "docs/spring-boot-guide/",
      "description": "公司内部 Spring Boot 开发规范和最佳实践",
      "file_patterns": ["*.md", "*.txt"],
      "priority": "high"
    },
    {
      "id": "kb_api_standards",
      "type": "local_docs", 
      "name": "API 设计规范",
      "path": "docs/api-standards/",
      "description": "RESTful API 设计规范",
      "file_patterns": ["*.md"],
      "priority": "medium"
    },
    {
      "id": "kb_existing_code",
      "type": "codebase",
      "name": "现有代码参考",
      "path": "src/main/java/com/example/",
      "description": "现有项目代码，用于保持风格一致",
      "file_patterns": ["*.java"],
      "priority": "medium"
    },
    {
      "id": "kb_external_api",
      "type": "external_url",
      "name": "第三方 API 文档",
      "url": "https://api.example.com/docs",
      "description": "需要集成的第三方服务 API 文档",
      "priority": "low"
    }
  ]
}
```

### feature-list.json 中的知识库引用

```json
{
  "task_id": "user-management-2025-12-05",
  "title": "用户管理模块",
  
  "knowledge_bases": [
    {
      "id": "kb_spring_boot",
      "type": "local_docs",
      "name": "Spring Boot 开发规范",
      "path": "docs/spring-boot-guide/",
      "priority": "high"
    },
    {
      "id": "kb_api_standards",
      "type": "local_docs",
      "name": "API 设计规范", 
      "path": "docs/api-standards/",
      "priority": "medium"
    }
  ],
  
  "features": [
    {
      "id": "F005",
      "name": "用户注册接口",
      "context": {
        "summary": "POST /api/user/register...",
        "required": [...],
        "knowledge_bases": ["kb_spring_boot", "kb_api_standards"]
      }
    }
  ]
}
```

### 知识库检索函数

```python
def search_knowledge_bases(
    knowledge_bases: list,
    query: str,
    max_tokens: int = 2000
) -> str:
    """
    检索外部知识库
    
    Args:
        knowledge_bases: 知识库配置列表
        query: 查询文本
        max_tokens: 最大返回 tokens
    
    Returns:
        合并后的知识库内容
    """
    results = []
    tokens_used = 0
    
    # 按优先级排序
    sorted_kbs = sorted(
        knowledge_bases,
        key=lambda x: {"high": 0, "medium": 1, "low": 2}.get(x.get("priority", "medium"), 1)
    )
    
    for kb in sorted_kbs:
        if tokens_used >= max_tokens:
            break
        
        kb_content = search_single_kb(kb, query)
        if kb_content:
            content_tokens = estimate_tokens(kb_content)
            if tokens_used + content_tokens <= max_tokens:
                results.append({
                    "source": kb["name"],
                    "content": kb_content
                })
                tokens_used += content_tokens
    
    # 格式化输出
    if not results:
        return ""
    
    output = "## 外部知识库参考\n\n"
    for result in results:
        output += f"### 来源: {result['source']}\n\n"
        output += result["content"] + "\n\n"
    
    return output

def search_single_kb(kb: dict, query: str) -> str:
    """
    检索单个知识库
    """
    kb_type = kb.get("type", "local_docs")
    
    if kb_type == "local_docs":
        return search_local_docs(kb["path"], query, kb.get("file_patterns", ["*.md"]))
    
    elif kb_type == "codebase":
        return search_codebase(kb["path"], query, kb.get("file_patterns", ["*.java"]))
    
    elif kb_type == "external_url":
        # 外部 URL 需要特殊处理，可能需要缓存
        return fetch_and_cache_url(kb["url"], query)
    
    return ""

def search_local_docs(path: str, query: str, patterns: list) -> str:
    """
    在本地文档目录中搜索
    """
    keywords = extract_keywords(query)
    results = []
    
    # 遍历文件
    for pattern in patterns:
        files = glob.glob(f"{path}/**/{pattern}", recursive=True)
        for file_path in files:
            content = read_file(file_path)
            
            # 计算相关性分数
            score = sum(1 for kw in keywords if kw.lower() in content.lower())
            if score > 0:
                # 提取相关段落
                relevant_sections = extract_relevant_sections(content, keywords)
                if relevant_sections:
                    results.append({
                        "file": file_path,
                        "score": score,
                        "content": relevant_sections
                    })
    
    # 排序并返回 Top 结果
    results.sort(key=lambda x: x["score"], reverse=True)
    
    output = ""
    for result in results[:3]:  # Top 3
        output += f"**文件: {result['file']}**\n\n"
        output += result["content"] + "\n\n"
    
    return output

def extract_relevant_sections(content: str, keywords: list, context_lines: int = 5) -> str:
    """
    从文档中提取包含关键词的相关段落
    """
    lines = content.split("\n")
    relevant_ranges = set()
    
    for i, line in enumerate(lines):
        for keyword in keywords:
            if keyword.lower() in line.lower():
                # 添加上下文行
                start = max(0, i - context_lines)
                end = min(len(lines), i + context_lines + 1)
                for j in range(start, end):
                    relevant_ranges.add(j)
    
    if not relevant_ranges:
        return ""
    
    # 合并连续范围
    sorted_ranges = sorted(relevant_ranges)
    sections = []
    current_section = [sorted_ranges[0]]
    
    for i in range(1, len(sorted_ranges)):
        if sorted_ranges[i] - sorted_ranges[i-1] <= 2:
            current_section.append(sorted_ranges[i])
        else:
            sections.append(current_section)
            current_section = [sorted_ranges[i]]
    sections.append(current_section)
    
    # 提取内容
    output = ""
    for section in sections[:3]:  # 最多 3 个段落
        section_content = "\n".join(lines[section[0]:section[-1]+1])
        output += section_content + "\n\n---\n\n"
    
    return output.strip()
```

### 知识库传递机制

确保知识库配置在整个任务生命周期中正确传递给所有 Sub-Agent：

```python
def dispatch_worker_with_knowledge(feature: dict, task_config: dict) -> dict:
    """
    调度 Worker 时传递知识库配置
    
    Args:
        feature: 当前功能
        task_config: 任务级配置（包含知识库）
    
    Returns:
        Worker 执行结果
    """
    # 1. 准备上下文
    context, tokens_used = smart_context_search(
        feature=feature,
        query=feature.get("description"),
        max_tokens=8000
    )
    
    # 2. 获取功能级知识库引用
    feature_kb_ids = feature.get("context", {}).get("knowledge_bases", [])
    
    # 3. 从任务配置中获取完整知识库配置
    task_knowledge_bases = task_config.get("knowledge_bases", [])
    
    # 4. 过滤出功能需要的知识库
    if feature_kb_ids:
        relevant_kbs = [kb for kb in task_knowledge_bases if kb["id"] in feature_kb_ids]
    else:
        # 如果功能没有指定，使用所有高优先级知识库
        relevant_kbs = [kb for kb in task_knowledge_bases if kb.get("priority") == "high"]
    
    # 5. 构建 Worker 调用参数
    worker_params = {
        "feature": feature,
        "context": context,
        "knowledge_bases": relevant_kbs,  # 传递知识库配置
        "tokens_used": tokens_used
    }
    
    # 6. 调度 Worker
    if feature["category"] == "design":
        return invoke_worker("design-worker", **worker_params)
    elif feature["category"] == "coding":
        return invoke_worker("coding-worker", **worker_params)
    elif feature["category"] == "testing":
        return invoke_worker("coding-worker", **worker_params)
```

### Worker Agent 接收知识库

Worker Agent 需要在执行时使用传递的知识库：

```python
# design-worker / coding-worker 中

def execute_with_knowledge(feature: dict, context: dict, knowledge_bases: list):
    """
    使用知识库执行任务
    """
    # 1. 基础上下文
    full_context = context.copy()
    
    # 2. 检索知识库补充上下文
    if knowledge_bases:
        kb_content = search_knowledge_bases(
            knowledge_bases=knowledge_bases,
            query=feature.get("description", feature["name"]),
            max_tokens=2000
        )
        if kb_content:
            full_context["knowledge_base_reference"] = kb_content
    
    # 3. 执行任务（设计/编码/测试）
    result = execute_task(feature, full_context)
    
    return result
```

---

## 🔄 索引自动更新

### 设计完成时更新索引

```python
def on_design_complete(feature: dict, design_doc_path: str):
    """
    设计完成后自动更新索引
    """
    # 1. 读取设计文档
    content = read_file(design_doc_path)
    
    # 2. 生成摘要
    summary = generate_summary(content)
    
    # 3. 提取关键词
    keywords = extract_keywords(content)
    
    # 4. 更新 design/index.json
    update_design_index(feature, content)
    
    # 5. 更新 design/keywords.json
    update_keyword_index(feature, keywords, design_doc_path)
    
    # 6. 更新 feature-list.json 中的 context
    update_feature_context(feature["id"], {
        "summary": summary,
        "keywords": keywords
    })
    
    # 7. 追加到 design/summary.md
    append_to_summary_doc(feature, summary)

def update_keyword_index(feature: dict, keywords: list, file_path: str):
    """
    更新关键词索引
    """
    index_path = "design/keywords.json"
    
    if file_exists(index_path):
        index = read_json(index_path)
    else:
        index = {"version": "1.0", "keywords": {}, "synonyms": {}}
    
    # 更新每个关键词
    for keyword in keywords:
        if keyword not in index["keywords"]:
            index["keywords"][keyword] = {
                "features": [],
                "entities": [],
                "apis": [],
                "files": []
            }
        
        kw_info = index["keywords"][keyword]
        
        # 添加功能引用
        if feature["id"] not in kw_info["features"]:
            kw_info["features"].append(feature["id"])
        
        # 添加文件引用
        if file_path not in kw_info["files"]:
            kw_info["files"].append(file_path)
    
    # 更新时间戳
    index["updated_at"] = datetime.now().isoformat()
    
    # 保存
    write_json(index_path, index)
```

---

## ✅ 实施清单

### Phase 1: 数据结构扩展 (立即实施)

- [x] 修改 `feature-list.json` 格式，增加 `context` 字段
- [x] 创建 `design/index.json` 索引文件
- [x] 创建 `design/summary.md` 摘要文件
- [x] 创建 `design/keywords.json` 关键词索引文件（模板已定义，运行时生成）

### Phase 2: Agent 修改 (本次实施)

- [x] 修改 `master-orchestrator.md` 增加上下文准备逻辑
- [x] 修改 `design-worker.md` 增加摘要生成步骤
- [x] 修改 `coding-worker.md` 增加上下文加载逻辑
- [x] 修改 `initializer.md` 增加初始化索引文件和知识库配置

### Phase 3: 轻量级 RAG (本次实施)

- [x] 实现 `extract_keywords()` 关键词提取（伪代码已定义）
- [x] 实现 `rag_search()` RAG 检索（伪代码已定义）
- [x] 实现 `smart_context_search()` 智能上下文检索（伪代码已定义）
- [x] 实现索引自动更新机制（design-worker 步骤 4）

### Phase 4: 外部知识库支持 (本次实施)

- [x] 实现 `search_knowledge_bases()` 知识库检索（伪代码已定义）
- [x] 实现知识库配置解析（initializer 步骤 2.5）
- [x] 实现知识库传递机制（master-orchestrator dispatch_worker）
- [x] 更新 Worker Agent 接收知识库（coding-worker 步骤 1）

### Phase 5: 监控增强 (后续优化)

- [ ] 在 `progress.md` 中增加上下文使用统计
- [ ] 增加 token 预警机制
- [ ] 增加上下文压缩建议
- [ ] 增加知识库命中率统计

## 🔗 相关资源

- [master-orchestrator.md](../../agents/master-orchestrator.md) - 任务总控 Agent
- [design-worker.md](../../agents/design-worker.md) - 设计 Worker
- [coding-worker.md](../../agents/coding-worker.md) - 编码 Worker
- [Anthropic Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) - 官方最佳实践

---

**版本**: 1.0.0  
**最后更新**: 2025-12-05  
**维护者**: Spec-Code Team
