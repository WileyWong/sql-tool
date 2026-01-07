# Java 最佳实践

## Java 8+ 特性

### Stream API

```java
// ✅ 推荐：链式处理
List<UserVO> userVOs = users.stream()
        .filter(user -> user.getStatus() == 1)
        .map(this::convertToVO)
        .sorted(Comparator.comparing(UserVO::getCreateTime).reversed())
        .collect(Collectors.toList());

// ✅ 分组
Map<Integer, List<User>> usersByStatus = users.stream()
        .collect(Collectors.groupingBy(User::getStatus));

// ✅ 转 Map
Map<Long, User> userMap = users.stream()
        .collect(Collectors.toMap(User::getId, Function.identity()));

// ✅ 统计
long count = users.stream()
        .filter(user -> user.getAge() > 18)
        .count();

// ✅ 求和
int totalAge = users.stream()
        .mapToInt(User::getAge)
        .sum();

// ❌ 避免：并行流滥用
users.parallelStream()  // 小数据量不需要并行
        .map(this::convertToVO)
        .collect(Collectors.toList());
```

### Optional

```java
// ✅ 推荐用法
String cityName = Optional.ofNullable(user)
        .map(User::getAddress)
        .map(Address::getCity)
        .map(City::getName)
        .orElse("未知城市");

// ✅ orElseThrow
User user = userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("用户", id));

// ✅ ifPresent
userRepository.findById(id)
        .ifPresent(user -> log.info("找到用户: {}", user.getUsername()));

// ✅ filter
Optional<User> activeUser = userRepository.findById(id)
        .filter(user -> user.getStatus() == 1);

// ❌ 错误：直接 get()
User user = userOpt.get();  // 可能 NoSuchElementException

// ❌ 错误：Optional 作为字段
private Optional<String> nickname;  // 不推荐
```

### LocalDateTime

```java
// ✅ 获取当前时间
LocalDateTime now = LocalDateTime.now();
LocalDate today = LocalDate.now();
LocalTime currentTime = LocalTime.now();

// ✅ 格式化
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
String formatted = now.format(formatter);

// ✅ 解析
LocalDateTime parsed = LocalDateTime.parse("2024-01-01 12:00:00", formatter);

// ✅ 时间计算
LocalDateTime tomorrow = now.plusDays(1);
LocalDateTime lastMonth = now.minusMonths(1);
LocalDateTime startOfDay = today.atStartOfDay();

// ✅ 比较
boolean isAfter = date1.isAfter(date2);
boolean isBefore = date1.isBefore(date2);

// ❌ 避免：使用 Date
Date date = new Date();  // 不推荐
```

### Lambda 表达式

```java
// ✅ 方法引用
users.stream().map(User::getName).collect(Collectors.toList());
users.forEach(System.out::println);

// ✅ 简洁的 Lambda
list.sort((a, b) -> a.getName().compareTo(b.getName()));
list.sort(Comparator.comparing(User::getName));

// ✅ 函数式接口
@FunctionalInterface
public interface UserValidator {
    boolean validate(User user);
}

UserValidator validator = user -> user.getAge() > 0 && user.getName() != null;
```

## 集合操作

### 创建集合

```java
// ✅ Java 9+ 不可变集合
List<String> list = List.of("a", "b", "c");
Set<String> set = Set.of("a", "b", "c");
Map<String, Integer> map = Map.of("a", 1, "b", 2);

// ✅ 可变集合
List<String> list = new ArrayList<>();
Set<String> set = new HashSet<>();
Map<String, Integer> map = new HashMap<>();

// ✅ 指定初始容量（已知大小时）
List<String> list = new ArrayList<>(100);
Map<String, Integer> map = new HashMap<>(16);

// ❌ 避免：Arrays.asList 返回固定大小列表
List<String> list = Arrays.asList("a", "b");
list.add("c");  // UnsupportedOperationException
```

### 空集合处理

```java
// ✅ 返回空集合而非 null
public List<User> findUsers() {
    List<User> users = userMapper.selectList(null);
    return users != null ? users : Collections.emptyList();
}

// ✅ 使用 CollectionUtils 判空
if (CollectionUtils.isEmpty(users)) {
    return Collections.emptyList();
}

// ❌ 避免：返回 null
public List<User> findUsers() {
    return null;  // 调用方需要判空
}
```

### 集合遍历

```java
// ✅ forEach（只读遍历）
users.forEach(user -> log.info("User: {}", user.getName()));

// ✅ for-each（需要 break/continue）
for (User user : users) {
    if (user.getStatus() == 0) {
        continue;
    }
    process(user);
}

// ✅ Iterator（需要删除元素）
Iterator<User> iterator = users.iterator();
while (iterator.hasNext()) {
    User user = iterator.next();
    if (user.getStatus() == 0) {
        iterator.remove();
    }
}

// ❌ 避免：遍历中直接删除
for (User user : users) {
    if (user.getStatus() == 0) {
        users.remove(user);  // ConcurrentModificationException
    }
}
```

## 字符串处理

### 字符串判断

```java
// ✅ Spring StringUtils
import org.springframework.util.StringUtils;

if (StringUtils.hasText(str)) {  // 非空且非空白
    // ...
}

if (StringUtils.hasLength(str)) {  // 非空
    // ...
}

// ✅ Apache Commons
import org.apache.commons.lang3.StringUtils;

if (StringUtils.isNotBlank(str)) {
    // ...
}

// ❌ 避免：手动判断
if (str != null && !str.trim().isEmpty()) {
    // ...
}
```

### 字符串拼接

```java
// ✅ 少量拼接：+
String result = "Hello, " + name + "!";

// ✅ 循环拼接：StringBuilder
StringBuilder sb = new StringBuilder();
for (String item : items) {
    sb.append(item).append(",");
}

// ✅ 集合拼接：String.join
String result = String.join(",", items);

// ✅ Stream 拼接
String result = users.stream()
        .map(User::getName)
        .collect(Collectors.joining(", "));

// ❌ 避免：循环中用 +
String result = "";
for (String item : items) {
    result += item;  // 每次创建新字符串
}
```

## 对象操作

### 对象比较

```java
// ✅ Objects.equals（null 安全）
if (Objects.equals(a, b)) {
    // ...
}

// ✅ 常量在前
if ("ACTIVE".equals(status)) {
    // ...
}

// ❌ 避免：可能 NPE
if (a.equals(b)) {  // a 可能为 null
    // ...
}
```

### 对象复制

```java
// ✅ BeanUtils（Spring）
UserVO vo = new UserVO();
BeanUtils.copyProperties(user, vo);

// ✅ MapStruct（推荐，编译时生成）
@Mapper(componentModel = "spring")
public interface UserConverter {
    UserVO toVO(User user);
    List<UserVO> toVOList(List<User> users);
}

// ❌ 避免：手动逐字段复制（容易遗漏）
vo.setId(user.getId());
vo.setName(user.getName());
// ...
```

### Builder 模式

```java
// ✅ Lombok @Builder
@Data
@Builder
public class User {
    private Long id;
    private String name;
    private String email;
}

User user = User.builder()
        .id(1L)
        .name("张三")
        .email("zhangsan@example.com")
        .build();
```

## 并发编程

### 线程安全集合

```java
// ✅ ConcurrentHashMap
Map<String, User> cache = new ConcurrentHashMap<>();

// ✅ CopyOnWriteArrayList（读多写少）
List<String> list = new CopyOnWriteArrayList<>();

// ✅ Collections.synchronizedXxx（简单场景）
List<String> syncList = Collections.synchronizedList(new ArrayList<>());
```

### CompletableFuture

```java
// ✅ 异步执行
CompletableFuture<User> future = CompletableFuture.supplyAsync(() -> {
    return userService.getUser(id);
});

// ✅ 组合多个异步任务
CompletableFuture<String> nameFuture = CompletableFuture.supplyAsync(() -> getName());
CompletableFuture<Integer> ageFuture = CompletableFuture.supplyAsync(() -> getAge());

CompletableFuture<String> result = nameFuture.thenCombine(ageFuture, 
        (name, age) -> name + " is " + age + " years old");

// ✅ 等待所有完成
CompletableFuture.allOf(future1, future2, future3).join();

// ✅ 超时处理
User user = future.get(5, TimeUnit.SECONDS);
```

### 线程池

```java
// ✅ 自定义线程池
@Configuration
public class ThreadPoolConfig {
    
    @Bean("asyncExecutor")
    public Executor asyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10);
        executor.setMaxPoolSize(20);
        executor.setQueueCapacity(100);
        executor.setKeepAliveSeconds(60);
        executor.setThreadNamePrefix("async-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }
}

// ❌ 避免：Executors 创建线程池
Executors.newFixedThreadPool(10);  // 队列无界，可能 OOM
Executors.newCachedThreadPool();   // 线程数无界，可能 OOM
```

## 资源管理

### try-with-resources

```java
// ✅ 自动关闭资源
try (InputStream is = new FileInputStream(file);
     BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
    String line;
    while ((line = reader.readLine()) != null) {
        process(line);
    }
} catch (IOException e) {
    log.error("读取文件失败", e);
}

// ❌ 避免：手动关闭（容易遗漏）
InputStream is = null;
try {
    is = new FileInputStream(file);
    // ...
} finally {
    if (is != null) {
        is.close();
    }
}
```

## 检查清单

- [ ] 使用 Stream API 处理集合
- [ ] 使用 Optional 避免 NPE
- [ ] 使用 LocalDateTime 替代 Date
- [ ] 返回空集合而非 null
- [ ] 使用 Objects.equals 比较对象
- [ ] 使用 try-with-resources 管理资源
- [ ] 使用自定义线程池而非 Executors
- [ ] 并发场景使用线程安全集合

## 参考

- [Effective Java](https://www.oreilly.com/library/view/effective-java/9780134686097/)
- [Java 8 实战](https://www.manning.com/books/java-8-in-action)
