# 项目目录结构

> **项目**: {{PROJECT_NAME}}  
> **生成时间**: {{SCAN_DATE}}

---

## 目录树

```
{{PROJECT_NAME}}/
├── src/main/java/{{BASE_PACKAGE_PATH}}/
│   ├── controller/          # Controller层
│   ├── service/             # Service层
│   │   └── impl/            # Service实现
│   ├── mapper/              # Mapper层
│   ├── entity/              # 实体类
│   ├── dto/                 # DTO对象
│   │   ├── request/         # 请求对象
│   │   └── response/        # 响应对象
│   ├── vo/                  # 视图对象
│   ├── config/              # 配置类
│   ├── common/              # 公共类
│   ├── utils/               # 工具类
│   ├── handler/             # 处理器
│   ├── interceptor/         # 拦截器
│   ├── aspect/              # 切面
│   ├── job/                 # 定时任务
│   ├── listener/            # 消息监听
│   └── feign/               # Feign客户端
├── src/main/resources/
│   ├── mapper/              # MyBatis XML
│   ├── application.yml      # 主配置
│   └── application-*.yml    # 环境配置
└── pom.xml                  # Maven配置
```

---

## 包说明

| 包名 | 职责 | 文件数 |
|------|------|--------|
| controller | HTTP接口入口 | {{CONTROLLER_COUNT}} |
| service | 业务逻辑 | {{SERVICE_COUNT}} |
| mapper | 数据访问 | {{MAPPER_COUNT}} |
| entity | 数据库实体 | {{ENTITY_COUNT}} |
| dto | 数据传输对象 | {{DTO_COUNT}} |
| config | Spring配置 | {{CONFIG_COUNT}} |
| utils | 工具类 | {{UTIL_COUNT}} |
