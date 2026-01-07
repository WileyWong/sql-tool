# 反序列化安全检测规则

## 规则概述

| 规则ID | 规则名称 | 风险等级 |
|--------|---------|---------|
| DESER-001 | 不可信数据反序列化 | 🟠 高危 |
| DESER-002 | ObjectInputStream | 🟡 中危 |
| DESER-003 | Fastjson 不安全配置 | 🟠 高危 |

---

## DESER-001: 不可信数据反序列化

### 检测模式

```regex
ObjectInputStream.*readObject
XMLDecoder.*readObject
XStream.*fromXML
```

### 危险代码示例

```java
// ❌ 危险: 反序列化用户输入
@PostMapping("/deserialize")
public Result deserialize(@RequestBody byte[] data) {
    ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(data));
    Object obj = ois.readObject(); // 可执行任意代码
    return Result.success(obj);
}

// ❌ 危险: XMLDecoder 反序列化
@PostMapping("/xml")
public Result parseXml(@RequestBody String xml) {
    XMLDecoder decoder = new XMLDecoder(new ByteArrayInputStream(xml.getBytes()));
    Object obj = decoder.readObject();
    return Result.success(obj);
}

// ❌ 危险: XStream 反序列化
@PostMapping("/xstream")
public Result parseXml(@RequestBody String xml) {
    XStream xstream = new XStream();
    Object obj = xstream.fromXML(xml);
    return Result.success(obj);
}
```

### 安全代码示例

```java
// ✅ 安全: 使用 JSON 替代 Java 序列化
@PostMapping("/data")
public Result parseData(@RequestBody DataDTO data) {
    // Jackson/Gson 自动处理 JSON
    return Result.success(data);
}

// ✅ 安全: 使用白名单过滤
public class SafeObjectInputStream extends ObjectInputStream {
    private static final Set<String> ALLOWED_CLASSES = Set.of(
        "com.example.dto.UserDTO",
        "com.example.dto.OrderDTO"
    );
    
    @Override
    protected Class<?> resolveClass(ObjectStreamClass desc) throws IOException, ClassNotFoundException {
        if (!ALLOWED_CLASSES.contains(desc.getName())) {
            throw new InvalidClassException("不允许反序列化的类: " + desc.getName());
        }
        return super.resolveClass(desc);
    }
}

// ✅ 安全: XStream 配置安全设置
XStream xstream = new XStream();
xstream.addPermission(NoTypePermission.NONE);
xstream.addPermission(NullPermission.NULL);
xstream.addPermission(PrimitiveTypePermission.PRIMITIVES);
xstream.allowTypes(new Class[]{UserDTO.class, OrderDTO.class});
```

---

## DESER-002: ObjectInputStream

### 检测模式

```regex
new\s+ObjectInputStream
ObjectInputStream\s+\w+\s*=
\.readObject\(\)
```

### 危险代码示例

```java
// ❌ 危险: 直接使用 ObjectInputStream
public Object loadFromFile(String path) {
    try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(path))) {
        return ois.readObject();
    }
}

// ❌ 危险: 从网络读取序列化数据
public Object receiveObject(Socket socket) {
    ObjectInputStream ois = new ObjectInputStream(socket.getInputStream());
    return ois.readObject();
}
```

### 安全代码示例

```java
// ✅ 安全: 使用 ValidatingObjectInputStream
import org.apache.commons.io.serialization.ValidatingObjectInputStream;

public Object loadFromFile(String path) {
    try (ValidatingObjectInputStream vois = new ValidatingObjectInputStream(new FileInputStream(path))) {
        vois.accept(UserDTO.class, OrderDTO.class);
        vois.reject("*"); // 拒绝所有其他类
        return vois.readObject();
    }
}

// ✅ 安全: 使用 JEP 290 过滤器 (Java 9+)
ObjectInputFilter filter = ObjectInputFilter.Config.createFilter(
    "com.example.dto.*;!*"
);
ObjectInputStream ois = new ObjectInputStream(new FileInputStream(path));
ois.setObjectInputFilter(filter);
```

---

## DESER-003: Fastjson 不安全配置

### 检测模式

```regex
JSON\.parseObject\(.*,\s*Object\.class
JSON\.parse\(
ParserConfig\.getGlobalInstance\(\)\.setAutoTypeSupport\(true\)
Feature\.SupportAutoType
```

### 危险代码示例

```java
// ❌ 危险: 开启 AutoType
ParserConfig.getGlobalInstance().setAutoTypeSupport(true);

// ❌ 危险: 解析为 Object 类型
Object obj = JSON.parseObject(jsonString, Object.class);

// ❌ 危险: 使用 Feature.SupportAutoType
Object obj = JSON.parseObject(jsonString, Object.class, Feature.SupportAutoType);

// ❌ 危险: 低版本 Fastjson (< 1.2.83)
// 存在多个已知的反序列化漏洞
```

### 安全代码示例

```java
// ✅ 安全: 使用最新版本 Fastjson2
// pom.xml
<dependency>
    <groupId>com.alibaba.fastjson2</groupId>
    <artifactId>fastjson2</artifactId>
    <version>2.0.43</version>
</dependency>

// ✅ 安全: 指定具体类型
UserDTO user = JSON.parseObject(jsonString, UserDTO.class);

// ✅ 安全: 禁用 AutoType
ParserConfig.getGlobalInstance().setAutoTypeSupport(false);

// ✅ 安全: 使用白名单
ParserConfig.getGlobalInstance().addAccept("com.example.dto.");

// ✅ 安全: 使用 Jackson 替代
ObjectMapper mapper = new ObjectMapper();
mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
UserDTO user = mapper.readValue(jsonString, UserDTO.class);
```

### Fastjson 安全版本

| 版本 | 安全性 | 建议 |
|------|--------|------|
| < 1.2.68 | ❌ 存在严重漏洞 | 立即升级 |
| 1.2.68-1.2.82 | ⚠️ 需要安全配置 | 建议升级 |
| ≥ 1.2.83 | ✅ 默认安全 | 推荐 |
| Fastjson2 | ✅ 安全 | 强烈推荐 |

---

## Jackson 安全配置

```java
// ✅ 安全: Jackson 配置
ObjectMapper mapper = new ObjectMapper();

// 禁用默认类型
mapper.deactivateDefaultTyping();

// 禁用危险特性
mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

// 使用白名单
mapper.activateDefaultTyping(
    LaissezFaireSubTypeValidator.instance,
    ObjectMapper.DefaultTyping.NON_FINAL,
    JsonTypeInfo.As.PROPERTY
);

// 或使用 @JsonTypeInfo 注解
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY)
@JsonSubTypes({
    @JsonSubTypes.Type(value = UserDTO.class, name = "user"),
    @JsonSubTypes.Type(value = OrderDTO.class, name = "order")
})
public abstract class BaseDTO {}
```

---

## 反序列化安全检查清单

```yaml
deserialization_checklist:
  通用:
    - [ ] 避免反序列化不可信数据
    - [ ] 使用 JSON 替代 Java 序列化
    - [ ] 指定具体类型而非 Object
  
  Java 序列化:
    - [ ] 使用 ValidatingObjectInputStream
    - [ ] 配置 JEP 290 过滤器
    - [ ] 实现类白名单
  
  Fastjson:
    - [ ] 使用 Fastjson2 或 >= 1.2.83
    - [ ] 禁用 AutoType
    - [ ] 配置类白名单
  
  Jackson:
    - [ ] 禁用默认类型
    - [ ] 使用 @JsonTypeInfo 白名单
```

---

## 参考资料

- [OWASP Deserialization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html)
- [CWE-502: Deserialization of Untrusted Data](https://cwe.mitre.org/data/definitions/502.html)
- [Fastjson 安全公告](https://github.com/alibaba/fastjson/wiki/security_update)

---

**版本**: 1.0.0  
**更新时间**: 2025-12-22
