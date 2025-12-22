# 运营平台 API

> **领域**: Operation | **服务**: operating-platform | **版本**: v1.9

---

## 📋 接口概览

运营平台提供配置管理、文案管理、灰度配置等功能，是招聘协同平台的配置中心，包括：

- 列表配置查询（下拉框、单选框等）
- 树形配置查询（部门树、岗位分类树等）
- 文案管理（提示信息、帮助文本）
- 灰度配置（功能开关、A/B 测试）
- 配置项动态管理

---

## 🔌 FeignClient 接口

### OperationApi

**服务名称**: `operating-platform`  
**配置类**: `RecruitFeignHeaderInterceptor`  
**服务地址**:
- 生产环境: `${NTS_GW_ESB}/operating-platform`
- 测试环境: `${DEMO_NTS_GW_ESB}/operating-platform`

---

## 📡 接口详情

### 1. 列表配置查询

#### 1.1 根据编码查询列表配置

```java
@GetMapping("/external/getListConfig")
Result<List<SelectOptionDTO>> getListConfig(
    @RequestParam(value = "appCode") String appCode,
    @RequestParam(value = "configCode") String configCode,
    @RequestParam(value = "intValue") Boolean intValue
);
```

**参数说明**:
- `appCode`: 应用编码，如 `recruit`
- `configCode`: 配置编码，如 `education_level`（学历）、`degree`（学位）
- `intValue`: 是否返回整型值，true 则 key 和 value 都是数字

**返回值**: `Result<List<SelectOptionDTO>>`

**使用场景**: 
- 查询下拉框选项（学历、学位、专业等）
- 查询单选框选项
- 查询复选框选项

**使用示例**:

```java
@Autowired
private OperationApi operationApi;

// 查询学历配置
Result<List<SelectOptionDTO>> result = operationApi.getListConfig(
    "recruit", "education_level", false
);

if (result.isSuccess()) {
    result.getData().forEach(option -> {
        log.info("学历: {} - {}", option.getKey(), option.getValue());
    });
}

// 前端使用示例
<select>
    <option v-for="item in educationList" :value="item.key">
        {{ item.label }}
    </option>
</select>
```

**常用配置编码**:

| 配置编码 | 说明 | 示例 |
|---------|------|------|
| `education_level` | 学历 | 本科、硕士、博士 |
| `degree` | 学位 | 学士、硕士、博士 |
| `major_category` | 专业大类 | 计算机类、管理类 |
| `work_years` | 工作年限 | 1-3年、3-5年 |
| `language_level` | 语言水平 | 流利、熟练、一般 |

---

#### 1.2 批量查询配置（多个 code）

```java
@GetMapping("/external/multiConfigList")
Result<Map<String, List<SelectOptionDTO>>> getMultiConfigList(
    @RequestParam(value = "appCode") String appCode,
    @RequestParam(value = "code") String code,
    @RequestParam(value = "intValue") Boolean intValue
);
```

**参数说明**:
- `code`: 多个配置编码，逗号分割，如 `"education,degree,major"`

**返回值**: `Result<Map<String, List<SelectOptionDTO>>>`
- Key: 配置编码
- Value: 配置选项列表

**使用示例**:

```java
// 批量查询多个配置
Result<Map<String, List<SelectOptionDTO>>> result = 
    operationApi.getMultiConfigList("recruit", "education,degree,major", false);

if (result.isSuccess()) {
    Map<String, List<SelectOptionDTO>> configs = result.getData();
    
    List<SelectOptionDTO> educations = configs.get("education");
    List<SelectOptionDTO> degrees = configs.get("degree");
    List<SelectOptionDTO> majors = configs.get("major");
    
    log.info("学历: {} 个选项", educations.size());
    log.info("学位: {} 个选项", degrees.size());
    log.info("专业: {} 个选项", majors.size());
}
```

**性能优化**: 建议使用批量接口一次性获取多个配置，减少网络请求

---

### 2. 单个配置查询

#### 2.1 根据编码查询配置

```java
@GetMapping("/external/getConfig")
Result<DataConfigDTO> getConfig(
    @RequestParam(value = "appCode") String appCode,
    @RequestParam(value = "configCode") String configCode
);
```

**参数说明**:
- `appCode`: 应用编码
- `configCode`: 配置编码

**返回值**: `Result<DataConfigDTO>` - 包含配置详细信息

**使用场景**: 查询配置的元数据信息（配置名称、描述、创建时间等）

---

#### 2.2 查询所有配置

```java
@GetMapping("/external/getAllConfig")
Result<DataConfigDTO> getAllConfig(
    @RequestParam(value = "appCode") String appCode,
    @RequestParam(value = "configCode") String configCode
);
```

**说明**: 返回配置的完整信息，包括所有配置项和元数据

---

### 3. 树形配置查询

#### 3.1 根据编码查询树形列表配置

```java
@GetMapping("/external/getTreeConfig")
Result<List<TreeOptionDTO>> getTreeConfig(
    @RequestParam(value = "appCode") String appCode,
    @RequestParam(value = "configCode") String configCode,
    @RequestParam(value = "intValue") Boolean intValue
);
```

**参数说明**:
- `appCode`: 应用编码
- `configCode`: 配置编码，如 `dept_tree`（部门树）、`post_category`（岗位分类）
- `intValue`: 是否返回整型值

**返回值**: `Result<List<TreeOptionDTO>>` - 树形结构数据

**使用场景**: 
- 查询部门树
- 查询岗位分类树
- 查询区域树

**使用示例**:

```java
// 查询部门树
Result<List<TreeOptionDTO>> result = operationApi.getTreeConfig(
    "recruit", "dept_tree", false
);

if (result.isSuccess()) {
    List<TreeOptionDTO> deptTree = result.getData();
    printTree(deptTree, 0);
}

// 递归打印树形结构
private void printTree(List<TreeOptionDTO> nodes, int level) {
    nodes.forEach(node -> {
        String indent = "  ".repeat(level);
        log.info("{}|- {} ({})", indent, node.getLabel(), node.getKey());
        
        if (node.getChildren() != null && !node.getChildren().isEmpty()) {
            printTree(node.getChildren(), level + 1);
        }
    });
}

// 前端树形组件使用
<el-tree 
    :data="deptTree" 
    node-key="key"
    :props="{ label: 'label', children: 'children' }">
</el-tree>
```

---

### 4. 文案管理

#### 4.1 查询文案

```java
@GetMapping("/external/getTextCopy")
Result<Map<String, String>> getTextCopy(
    @RequestParam(value = "appCode") String appCode,
    @RequestParam(value = "configCode") String configCode
);
```

**参数说明**:
- `appCode`: 应用编码
- `configCode`: 文案配置编码

**返回值**: `Result<Map<String, String>>`
- Key: 文案编码
- Value: 文案内容

**使用场景**: 
- 查询页面提示信息
- 查询帮助文本
- 查询错误提示
- 查询操作说明

**使用示例**:

```java
// 查询页面提示文案
Result<Map<String, String>> result = operationApi.getTextCopy(
    "recruit", "resume_upload_tips"
);

if (result.isSuccess()) {
    Map<String, String> tips = result.getData();
    
    String formatTip = tips.get("format_tip");      // "支持PDF、Word格式"
    String sizeTip = tips.get("size_tip");          // "文件大小不超过10MB"
    String nameTip = tips.get("name_tip");          // "建议使用真实姓名命名"
    
    log.info("上传提示:\n{}\n{}\n{}", formatTip, sizeTip, nameTip);
}
```

---

### 5. 配置项管理

#### 5.1 查询应用配置 code

```java
@GetMapping("/external/configCode")
Result<List<ConfigCodeDTO>> getConfigCode(
    @RequestParam(value = "appCode") String appCode
);
```

**参数说明**:
- `appCode`: 应用编码

**返回值**: `Result<List<ConfigCodeDTO>>` - 应用下所有配置编码列表

**使用场景**: 查询某个应用下有哪些配置，用于配置管理后台

---

#### 5.2 添加配置项

```java
@GetMapping("/external/appendConfigItemValue")
Result<Boolean> appendConfigItemValue(
    @RequestParam(value = "appCode") String appCode,
    @RequestParam(value = "configCode") String configCode,
    @RequestParam(value = "configItemKey") String configItemKey,
    @RequestParam(value = "appendConfigItemValue") String appendConfigItemValue,
    @RequestParam(value = "separator") String separator,
    @RequestParam(value = "presuffix") Boolean presuffix
);
```

**参数说明**:
- `appCode`: 应用编码
- `configCode`: 配置编码
- `configItemKey`: 配置项 Key
- `appendConfigItemValue`: 要追加的值
- `separator`: 分隔符，如 `,`、`;`
- `presuffix`: 是否在前缀/后缀位置追加

**使用场景**: 动态添加配置项值

**使用示例**:

```java
// 在白名单配置中追加新的员工 ID
Result<Boolean> result = operationApi.appendConfigItemValue(
    "recruit",          // 应用编码
    "admin_whitelist",  // 配置编码
    "staff_ids",        // 配置项 Key
    "100001",           // 要追加的员工 ID
    ",",                // 分隔符
    false               // 追加在后面
);

if (result.isSuccess() && result.getData()) {
    log.info("白名单添加成功");
}
```

---

### 6. 灰度配置

#### 6.1 查询灰度配置

```java
@GetMapping("/external/getGrayConfig")
Result<GrayConfigDTO> getGrayConfig(
    @RequestParam(value = "appCode") String appCode,
    @RequestParam(value = "configCode") String configCode
);
```

**参数说明**:
- `appCode`: 应用编码
- `configCode`: 灰度配置编码

**返回值**: `Result<GrayConfigDTO>`

**使用场景**: 
- 查询功能灰度开关
- 查询 A/B 测试配置
- 查询用户分组配置

**使用示例**:

```java
// 查询新功能灰度开关
Result<GrayConfigDTO> result = operationApi.getGrayConfig(
    "recruit", "ai_resume_parse_v2"
);

if (result.isSuccess()) {
    GrayConfigDTO grayConfig = result.getData();
    
    // 判断当前用户是否在灰度范围内
    boolean inGray = grayConfig.isUserInGray(currentUserId);
    
    if (inGray) {
        log.info("使用新版 AI 简历解析");
        // 使用新功能
    } else {
        log.info("使用旧版简历解析");
        // 使用旧功能
    }
}
```

---

## 📊 数据模型

### SelectOptionDTO

```java
public class SelectOptionDTO {
    private String key;               // 配置项 key
    private String value;             // 配置项 value
    private String label;             // 显示标签
    private Integer sort;             // 排序
    private String remark;            // 备注
}
```

### TreeOptionDTO

```java
public class TreeOptionDTO {
    private String key;               // 节点 key
    private String value;             // 节点 value
    private String label;             // 显示标签
    private String parentKey;         // 父节点 key
    private Integer level;            // 层级
    private Integer sort;             // 排序
    private List<TreeOptionDTO> children; // 子节点列表
}
```

### DataConfigDTO

```java
public class DataConfigDTO {
    private String appCode;           // 应用编码
    private String configCode;        // 配置编码
    private String configName;        // 配置名称
    private String configDesc;        // 配置描述
    private Integer configType;       // 配置类型：1-列表，2-树形，3-文本
    private Map<String, Object> configData; // 配置数据
    private Date createTime;          // 创建时间
    private Date updateTime;          // 更新时间
}
```

### GrayConfigDTO

```java
public class GrayConfigDTO {
    private String configCode;        // 配置编码
    private Integer grayType;         // 灰度类型：1-百分比，2-白名单
    private Integer grayPercent;      // 灰度百分比
    private List<Long> whiteList;     // 白名单用户 ID 列表
    
    // 判断用户是否在灰度范围
    public boolean isUserInGray(Long userId) {
        if (grayType == 2) {
            return whiteList != null && whiteList.contains(userId);
        } else if (grayType == 1) {
            return userId % 100 < grayPercent;
        }
        return false;
    }
}
```

### ConfigCodeDTO

```java
public class ConfigCodeDTO {
    private String configCode;        // 配置编码
    private String configName;        // 配置名称
    private Integer configType;       // 配置类型
}
```

---

## ⚠️ 注意事项

### 1. 配置缓存策略

- **必须使用缓存**: 运营平台配置变化不频繁，必须使用本地缓存
- **缓存时间**: 建议 5-10 分钟
- **缓存更新**: 配置变更后通过消息通知各服务刷新缓存

### 2. 批量查询优化

- 优先使用 `getMultiConfigList` 批量获取多个配置
- 避免循环调用 `getListConfig`

### 3. 灰度配置使用

- 灰度配置实时查询，不建议缓存
- 白名单模式适合小范围灰度
- 百分比模式适合大规模灰度

### 4. 配置编码规范

- 使用小写字母和下划线，如 `education_level`
- 避免使用中文编码
- 保持语义清晰

---

## 💡 最佳实践

### 配置缓存服务

```java
@Service
public class ConfigCacheService {
    
    @Autowired
    private OperationApi operationApi;
    
    // 使用 Guava Cache
    private final Cache<String, List<SelectOptionDTO>> configCache = 
        CacheBuilder.newBuilder()
            .expireAfterWrite(10, TimeUnit.MINUTES)
            .maximumSize(100)
            .recordStats() // 记录统计信息
            .build();
    
    /**
     * 获取配置（带缓存）
     */
    public List<SelectOptionDTO> getConfig(String configCode) {
        String cacheKey = "recruit:" + configCode;
        
        try {
            return configCache.get(cacheKey, () -> {
                Result<List<SelectOptionDTO>> result = 
                    operationApi.getListConfig("recruit", configCode, false);
                return result.isSuccess() ? result.getData() : Collections.emptyList();
            });
        } catch (Exception e) {
            log.error("查询配置失败: {}", configCode, e);
            return Collections.emptyList();
        }
    }
    
    /**
     * 刷新指定配置缓存
     */
    public void refreshConfig(String configCode) {
        String cacheKey = "recruit:" + configCode;
        configCache.invalidate(cacheKey);
        log.info("配置缓存已刷新: {}", configCode);
    }
    
    /**
     * 刷新所有缓存
     */
    public void refreshAll() {
        configCache.invalidateAll();
        log.info("所有配置缓存已刷新");
    }
    
    /**
     * 获取缓存统计信息
     */
    public void printStats() {
        CacheStats stats = configCache.stats();
        log.info("缓存统计 - 命中率: {}, 加载次数: {}, 驱逐次数: {}",
            stats.hitRate(),
            stats.loadCount(),
            stats.evictionCount());
    }
}
```

### 批量初始化配置

```java
@Component
public class ConfigInitializer implements ApplicationRunner {
    
    @Autowired
    private ConfigCacheService configCacheService;
    
    @Override
    public void run(ApplicationArguments args) {
        // 应用启动时预加载常用配置
        List<String> commonConfigs = Arrays.asList(
            "education_level",
            "degree",
            "major_category",
            "work_years",
            "language_level"
        );
        
        log.info("开始预加载配置...");
        commonConfigs.forEach(configCode -> {
            try {
                List<SelectOptionDTO> options = configCacheService.getConfig(configCode);
                log.info("配置 {} 加载成功，共 {} 个选项", configCode, options.size());
            } catch (Exception e) {
                log.error("配置 {} 加载失败", configCode, e);
            }
        });
        log.info("配置预加载完成");
    }
}
```

### 灰度功能开关封装

```java
@Service
public class FeatureToggleService {
    
    @Autowired
    private OperationApi operationApi;
    
    /**
     * 判断功能是否对用户开放
     */
    public boolean isFeatureEnabled(String featureCode, Long userId) {
        try {
            Result<GrayConfigDTO> result = 
                operationApi.getGrayConfig("recruit", featureCode);
            
            if (result.isSuccess()) {
                GrayConfigDTO grayConfig = result.getData();
                return grayConfig.isUserInGray(userId);
            }
        } catch (Exception e) {
            log.error("查询灰度配置失败: {}", featureCode, e);
        }
        
        // 默认不开放
        return false;
    }
    
    /**
     * 根据灰度配置执行不同逻辑
     */
    public <T> T executeWithToggle(String featureCode, Long userId,
                                    Supplier<T> newFeature,
                                    Supplier<T> oldFeature) {
        if (isFeatureEnabled(featureCode, userId)) {
            log.info("用户 {} 使用新功能: {}", userId, featureCode);
            return newFeature.get();
        } else {
            log.info("用户 {} 使用旧功能: {}", userId, featureCode);
            return oldFeature.get();
        }
    }
}

// 使用示例
@Service
public class ResumeParseService {
    
    @Autowired
    private FeatureToggleService featureToggleService;
    
    public ResumeData parseResume(String fileUuid, Long userId) {
        return featureToggleService.executeWithToggle(
            "ai_resume_parse_v2",
            userId,
            () -> parseResumeV2(fileUuid),  // 新版 AI 解析
            () -> parseResumeV1(fileUuid)   // 旧版解析
        );
    }
}
```

---

## 🔗 相关文档

- [API 索引](./index.md)
- [领域事件汇总](./domain-events-summary.md)

---

**最后更新**: 2025-11-12
