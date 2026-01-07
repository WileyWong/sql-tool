# Java 错误示例集

> 本文档收集常见的 Java 编码错误和反模式

## Optional 误用

```java
// ❌ 错误：不检查直接 get()
Optional<User> userOpt = userRepository.findById(id);
String name = userOpt.get().getName();  // NoSuchElementException!

// ✅ 正确
String name = userRepository.findById(id)
        .map(User::getName)
        .orElseThrow(() -> new ResourceNotFoundException("用户", id));

// ❌ 错误：Optional 作为字段
public class User {
    private Optional<String> nickname;  // 不推荐
}

// ❌ 错误：Optional.of(null)
Optional<User> userOpt = Optional.of(null);  // NullPointerException!
```

## Stream 误用

```java
// ❌ 错误：小数据量使用并行流
List<UserVO> vos = users.parallelStream()  // 只有 10 条数据
        .map(this::convertToVO)
        .collect(Collectors.toList());

// ❌ 错误：Stream 中有副作用
List<String> results = new ArrayList<>();
stream.forEach(item -> results.add(item));  // 副作用！

// ✅ 正确
List<String> results = stream.collect(Collectors.toList());

// ❌ 错误：重复使用 Stream
Stream<User> stream = users.stream();
long count = stream.count();
List<User> list = stream.collect(Collectors.toList());  // IllegalStateException!
```

## 事务误用

```java
// ❌ 错误：内部调用事务失效
@Service
public class OrderServiceImpl {
    public void createOrder(Order order) {
        this.saveOrder(order);  // 内部调用，@Transactional 失效!
    }
    
    @Transactional
    public void saveOrder(Order order) {
        orderMapper.insert(order);
    }
}

// ✅ 正确：通过代理调用
@Autowired
private OrderService self;

public void createOrder(Order order) {
    self.saveOrder(order);  // 通过代理调用
}

// ❌ 错误：捕获异常不抛出，事务不回滚
@Transactional
public void createOrder(Order order) {
    try {
        orderMapper.insert(order);
    } catch (Exception e) {
        log.error("失败", e);  // 异常被吞掉，不回滚！
    }
}
```

## 空指针陷阱

```java
// ❌ 错误：拆箱 NPE
Integer count = null;
int total = count + 1;  // NullPointerException!

// ❌ 错误：链式调用 NPE
String cityName = user.getAddress().getCity().getName();  // NPE!

// ✅ 正确
String cityName = Optional.ofNullable(user)
        .map(User::getAddress)
        .map(Address::getCity)
        .map(City::getName)
        .orElse("未知");
```

## 并发问题

```java
// ❌ 错误：SimpleDateFormat 非线程安全
private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

// ✅ 正确：DateTimeFormatter 线程安全
private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

// ❌ 错误：HashMap 非线程安全
private Map<String, User> cache = new HashMap<>();

// ✅ 正确
private Map<String, User> cache = new ConcurrentHashMap<>();
```

## 资源泄漏

```java
// ❌ 错误：流未关闭
public String readFile(String path) throws IOException {
    FileInputStream fis = new FileInputStream(path);
    return new BufferedReader(new InputStreamReader(fis)).readLine();
}

// ✅ 正确：try-with-resources
public String readFile(String path) throws IOException {
    try (var reader = new BufferedReader(new FileReader(path))) {
        return reader.readLine();
    }
}
```

## 参考

- [通用错误处理规范](../common/error-handling.md)
- [Java 最佳实践](best-practices.md)
