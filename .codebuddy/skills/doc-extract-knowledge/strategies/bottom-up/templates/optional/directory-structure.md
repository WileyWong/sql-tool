# 项目目录结构

> **项目**: {{PROJECT_NAME}}  
> **生成时间**: {{SCAN_DATE}}

---

## 📁 目录树

```
{{PROJECT_NAME}}/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── {{BASE_PACKAGE}}/
│   │   │       ├── controller/     # 控制器层
│   │   │       ├── service/        # 业务逻辑层
│   │   │       │   └── impl/       # 服务实现
│   │   │       ├── mapper/         # 数据访问层
│   │   │       ├── entity/         # 实体类
│   │   │       ├── dto/            # 数据传输对象
│   │   │       ├── vo/             # 视图对象
│   │   │       ├── request/        # 请求对象
│   │   │       ├── config/         # 配置类
│   │   │       ├── common/         # 公共组件
│   │   │       │   ├── exception/  # 异常处理
│   │   │       │   ├── result/     # 统一响应
│   │   │       │   └── constant/   # 常量定义
│   │   │       ├── handler/        # 处理器
│   │   │       ├── interceptor/    # 拦截器
│   │   │       ├── aspect/         # 切面
│   │   │       ├── annotation/     # 自定义注解
│   │   │       ├── feign/          # Feign 客户端
│   │   │       ├── job/            # 定时任务
│   │   │       ├── listener/       # MQ 监听器
│   │   │       └── utils/          # 工具类
│   │   └── resources/
│   │       ├── mapper/             # MyBatis XML
│   │       ├── application.yml     # 主配置
│   │       └── application-*.yml   # 环境配置
│   └── test/
│       └── java/                   # 测试代码
├── pom.xml                         # Maven 配置
└── README.md                       # 项目说明
```

---

## 📊 目录统计

| 目录 | 文件数 | 代码行数 | 说明 |
|------|:------:|:--------:|------|
| controller/ | {{COUNT}} | {{LOC}} | 控制器 |
| service/ | {{COUNT}} | {{LOC}} | 业务服务 |
| mapper/ | {{COUNT}} | {{LOC}} | 数据访问 |
| entity/ | {{COUNT}} | {{LOC}} | 实体类 |
| dto/ | {{COUNT}} | {{LOC}} | DTO |
| vo/ | {{COUNT}} | {{LOC}} | VO |
| request/ | {{COUNT}} | {{LOC}} | 请求对象 |
| config/ | {{COUNT}} | {{LOC}} | 配置类 |
| handler/ | {{COUNT}} | {{LOC}} | 处理器 |
| utils/ | {{COUNT}} | {{LOC}} | 工具类 |
| **总计** | **{{TOTAL_COUNT}}** | **{{TOTAL_LOC}}** | - |

---

## 📝 目录说明

### controller/
存放 REST API 控制器，处理 HTTP 请求。

**命名规范**: `XxxController.java`

**典型方法签名**:
```java
@RestController
@RequestMapping("/api/xxx")
public class XxxController {

    @GetMapping("/{id}")
    public Result<XxxVO> getById(@PathVariable("id") Long id)

    @PostMapping
    public Result<Long> create(@RequestBody @Valid XxxDTO dto)

    @PutMapping("/{id}")
    public Result<Void> update(
        @PathVariable("id") Long id,
        @RequestBody @Valid XxxDTO dto
    )

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable("id") Long id)
}
```

### service/
业务逻辑层，包含接口定义和实现。

**命名规范**: 
- 接口: `XxxService.java`
- 实现: `impl/XxxServiceImpl.java`

**典型方法签名**:
```java
public interface XxxService {

    XxxVO getById(Long id);

    @Transactional
    Long create(XxxDTO dto);

    @Transactional
    void update(Long id, XxxDTO dto);

    @Transactional
    void delete(Long id);
}
```

### mapper/
MyBatis Mapper 接口，数据库操作。

**命名规范**: `XxxMapper.java`

**典型方法签名**:
```java
@Mapper
public interface XxxMapper extends BaseMapper<Xxx> {

    Xxx selectById(@Param("id") Long id);

    List<Xxx> selectByCondition(
        @Param("status") Integer status,
        @Param("keyword") String keyword
    );

    int insert(Xxx entity);

    int updateById(Xxx entity);
}
```

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
