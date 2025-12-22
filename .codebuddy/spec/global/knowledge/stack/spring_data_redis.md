# Spring Data Redis

Spring Data Redis is a comprehensive integration library that provides easy configuration and access to Redis from Spring applications. It offers a high-level abstraction for Redis operations, supporting both imperative and reactive programming models. The library simplifies Redis data access by providing connection management, exception translation, automatic serialization/deserialization, and support for various Redis features including pub/sub, transactions, pipelining, Sentinel, and Cluster configurations.

The core of Spring Data Redis revolves around `RedisTemplate` and `ReactiveRedisTemplate` classes that handle all low-level Redis operations. It supports multiple Redis drivers (Lettuce and Jedis), provides Spring Cache abstraction implementation, enables declarative repository support with `@EnableRedisRepositories`, and offers comprehensive serialization strategies for different data types. The library integrates seamlessly with Spring's transaction management and provides extensive support for Redis data structures including strings, lists, sets, sorted sets, hashes, geo-spatial data, and streams.

## Core APIs and Key Functions

### RedisTemplate - Main Template for Redis Operations

`RedisTemplate` is the central class for Redis data access in Spring Data Redis. It provides high-level abstractions for performing various Redis operations with automatic serialization/deserialization, connection management, and exception translation. The template is thread-safe once configured and supports both synchronous operations and transaction management.

```java
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import java.util.concurrent.TimeUnit;

// Configuration
@Configuration
public class RedisConfig {
    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        LettuceConnectionFactory factory = new LettuceConnectionFactory("localhost", 6379);
        factory.afterPropertiesSet();
        return factory;
    }

    @Bean
    public RedisTemplate<String, User> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, User> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new Jackson2JsonRedisSerializer<>(User.class));
        template.afterPropertiesSet();
        return template;
    }
}

// Usage
@Service
public class UserService {
    @Autowired
    private RedisTemplate<String, User> redisTemplate;

    public void saveUser(User user) {
        // Simple set with expiration
        redisTemplate.opsForValue().set("user:" + user.getId(), user, 1, TimeUnit.HOURS);

        // Set if absent
        Boolean wasAbsent = redisTemplate.opsForValue()
            .setIfAbsent("user:lock:" + user.getId(), user, 30, TimeUnit.SECONDS);

        // Get value
        User retrieved = redisTemplate.opsForValue().get("user:" + user.getId());

        // Increment counter
        Long views = redisTemplate.opsForValue().increment("user:views:" + user.getId());

        // Delete key
        Boolean deleted = redisTemplate.delete("user:" + user.getId());
    }

    public void workWithLists(String userId) {
        String key = "user:notifications:" + userId;

        // Push to list
        redisTemplate.opsForList().leftPush(key, new Notification("Welcome!"));
        redisTemplate.opsForList().rightPush(key, new Notification("New message"));

        // Pop from list
        Notification notif = redisTemplate.opsForList().rightPop(key);

        // Get range
        List<Notification> recent = redisTemplate.opsForList().range(key, 0, 9);
    }
}
```

### StringRedisTemplate - Optimized Template for String Operations

`StringRedisTemplate` is a specialized extension of `RedisTemplate` pre-configured with `StringRedisSerializer` for all operations. It eliminates the need for manual serializer configuration when working exclusively with String keys and values, making it ideal for simple caching, counters, and string-based data storage.

```java
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import java.util.concurrent.TimeUnit;
import java.util.Map;
import java.util.HashMap;

@Service
public class CacheService {
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    public void stringOperations() {
        ValueOperations<String, String> ops = stringRedisTemplate.opsForValue();

        // Basic string operations
        ops.set("session:abc123", "user@example.com", 30, TimeUnit.MINUTES);
        String email = ops.get("session:abc123");

        // Multi-get/set for efficiency
        Map<String, String> sessions = new HashMap<>();
        sessions.put("session:abc123", "user1@example.com");
        sessions.put("session:def456", "user2@example.com");
        ops.multiSet(sessions);

        List<String> emails = ops.multiGet(Arrays.asList("session:abc123", "session:def456"));

        // Atomic operations
        Long counter = ops.increment("page:views");
        ops.decrement("inventory:item123");

        // Bit operations
        ops.setBit("user:active:20250101", 12345L, true);
        Boolean isActive = ops.getBit("user:active:20250101", 12345L);
    }

    public void hashOperations() {
        String key = "user:profile:123";

        // Store hash fields
        stringRedisTemplate.opsForHash().put(key, "name", "John Doe");
        stringRedisTemplate.opsForHash().put(key, "email", "john@example.com");
        stringRedisTemplate.opsForHash().put(key, "age", "30");

        // Get single field
        String name = (String) stringRedisTemplate.opsForHash().get(key, "name");

        // Get all fields
        Map<Object, Object> profile = stringRedisTemplate.opsForHash().entries(key);

        // Increment hash field
        Long loginCount = stringRedisTemplate.opsForHash().increment(key, "loginCount", 1L);
    }

    public void setOperations() {
        // Add members to set
        stringRedisTemplate.opsForSet().add("user:123:tags", "java", "spring", "redis");

        // Check membership
        Boolean isMember = stringRedisTemplate.opsForSet().isMember("user:123:tags", "java");

        // Get all members
        Set<String> tags = stringRedisTemplate.opsForSet().members("user:123:tags");

        // Set operations
        Set<String> common = stringRedisTemplate.opsForSet()
            .intersect("user:123:tags", "user:456:tags");
    }
}
```

### LettuceConnectionFactory - Lettuce-based Connection Factory

`LettuceConnectionFactory` provides connection factory implementation using the Lettuce Redis client. It supports standalone, Sentinel, and cluster configurations, connection pooling, and both synchronous and reactive operations. Lettuce connections are thread-safe and can be shared across multiple operations.

```java
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.RedisSentinelConfiguration;
import org.springframework.data.redis.connection.RedisClusterConfiguration;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import io.lettuce.core.ClientOptions;
import java.time.Duration;

@Configuration
public class RedisConnectionConfig {

    // Standalone configuration
    @Bean
    public LettuceConnectionFactory standaloneFactory() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration();
        config.setHostName("localhost");
        config.setPort(6379);
        config.setPassword("secret");
        config.setDatabase(0);

        LettuceClientConfiguration clientConfig = LettuceClientConfiguration.builder()
            .commandTimeout(Duration.ofSeconds(2))
            .shutdownTimeout(Duration.ofMillis(100))
            .build();

        LettuceConnectionFactory factory = new LettuceConnectionFactory(config, clientConfig);
        factory.afterPropertiesSet();
        return factory;
    }

    // Sentinel configuration
    @Bean
    public LettuceConnectionFactory sentinelFactory() {
        RedisSentinelConfiguration sentinelConfig = new RedisSentinelConfiguration()
            .master("mymaster")
            .sentinel("127.0.0.1", 26379)
            .sentinel("127.0.0.1", 26380)
            .sentinel("127.0.0.1", 26381);
        sentinelConfig.setPassword("secret");

        LettuceConnectionFactory factory = new LettuceConnectionFactory(sentinelConfig);
        factory.afterPropertiesSet();
        return factory;
    }

    // Cluster configuration
    @Bean
    public LettuceConnectionFactory clusterFactory() {
        RedisClusterConfiguration clusterConfig = new RedisClusterConfiguration();
        clusterConfig.addClusterNode(new RedisNode("127.0.0.1", 7000));
        clusterConfig.addClusterNode(new RedisNode("127.0.0.1", 7001));
        clusterConfig.addClusterNode(new RedisNode("127.0.0.1", 7002));
        clusterConfig.setMaxRedirects(3);

        LettuceConnectionFactory factory = new LettuceConnectionFactory(clusterConfig);
        factory.afterPropertiesSet();
        return factory;
    }

    // Connection pooling
    @Bean
    public LettuceConnectionFactory pooledFactory() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration("localhost", 6379);

        GenericObjectPoolConfig poolConfig = new GenericObjectPoolConfig();
        poolConfig.setMaxTotal(20);
        poolConfig.setMaxIdle(10);
        poolConfig.setMinIdle(5);
        poolConfig.setTestOnBorrow(true);
        poolConfig.setTestOnReturn(true);

        LettuceClientConfiguration clientConfig = LettuceClientConfiguration.builder()
            .commandTimeout(Duration.ofSeconds(2))
            .clientOptions(ClientOptions.builder()
                .autoReconnect(true)
                .build())
            .poolConfig(poolConfig)
            .build();

        LettuceConnectionFactory factory = new LettuceConnectionFactory(config, clientConfig);
        factory.setValidateConnection(true);
        factory.setShareNativeConnection(false);
        factory.afterPropertiesSet();
        return factory;
    }
}
```

### RedisCacheManager - Spring Cache Abstraction Implementation

`RedisCacheManager` implements Spring's Cache abstraction backed by Redis. It provides automatic cache creation, TTL configuration per cache, and statistics collection. Enables declarative caching with `@Cacheable`, `@CachePut`, and `@CacheEvict` annotations.

```java
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheWriter;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        // Default cache configuration
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10))
            .disableCachingNullValues()
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new Jackson2JsonRedisSerializer<>(Object.class)))
            .prefixCacheNameWith("myapp:");

        // Per-cache configurations
        Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();

        // Users cache with 1 hour TTL
        cacheConfigs.put("users", RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofHours(1))
            .prefixCacheNameWith("users:"));

        // Sessions cache with 30 minutes TTL
        cacheConfigs.put("sessions", RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30))
            .prefixCacheNameWith("sessions:"));

        // Permanent cache (no TTL)
        cacheConfigs.put("config", RedisCacheConfiguration.defaultCacheConfig()
            .prefixCacheNameWith("config:"));

        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(defaultConfig)
            .withInitialCacheConfigurations(cacheConfigs)
            .transactionAware()
            .build();
    }
}

// Usage with annotations
@Service
public class ProductService {

    @Cacheable(value = "products", key = "#id")
    public Product findById(Long id) {
        // This will only execute if not in cache
        return productRepository.findById(id).orElse(null);
    }

    @Cacheable(value = "products", key = "#category + ':' + #page")
    public List<Product> findByCategory(String category, int page) {
        return productRepository.findByCategory(category, PageRequest.of(page, 20));
    }

    @CachePut(value = "products", key = "#product.id")
    public Product save(Product product) {
        // Updates cache after saving
        return productRepository.save(product);
    }

    @CacheEvict(value = "products", key = "#id")
    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    @CacheEvict(value = "products", allEntries = true)
    public void deleteAll() {
        productRepository.deleteAll();
    }

    @Cacheable(value = "products", key = "#id", unless = "#result == null")
    public Product findByIdConditional(Long id) {
        // Won't cache null results
        return productRepository.findById(id).orElse(null);
    }
}
```

### ReactiveRedisTemplate - Reactive Programming Support

`ReactiveRedisTemplate` provides reactive Redis operations using Project Reactor. It returns `Mono` and `Flux` types for non-blocking, asynchronous operations. Requires Lettuce driver for reactive support and integrates with Spring WebFlux applications.

```java
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.core.ReactiveRedisOperations;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import java.time.Duration;

@Configuration
public class ReactiveRedisConfig {

    @Bean
    public ReactiveRedisTemplate<String, Product> reactiveRedisTemplate(
            ReactiveRedisConnectionFactory factory) {

        Jackson2JsonRedisSerializer<Product> serializer =
            new Jackson2JsonRedisSerializer<>(Product.class);

        RedisSerializationContext<String, Product> context =
            RedisSerializationContext.<String, Product>newSerializationContext()
                .key(StringRedisSerializer.UTF_8)
                .value(serializer)
                .hashKey(StringRedisSerializer.UTF_8)
                .hashValue(serializer)
                .build();

        return new ReactiveRedisTemplate<>(factory, context);
    }
}

@Service
public class ReactiveProductService {

    @Autowired
    private ReactiveRedisTemplate<String, Product> reactiveRedis;

    public Mono<Product> getProduct(String id) {
        return reactiveRedis.opsForValue()
            .get("product:" + id)
            .switchIfEmpty(Mono.defer(() ->
                loadFromDatabase(id)
                    .flatMap(product -> reactiveRedis.opsForValue()
                        .set("product:" + id, product, Duration.ofHours(1))
                        .thenReturn(product))
            ));
    }

    public Mono<Boolean> saveProduct(Product product) {
        return reactiveRedis.opsForValue()
            .set("product:" + product.getId(), product, Duration.ofHours(1));
    }

    public Flux<Product> getAllProducts(String pattern) {
        return reactiveRedis.keys(pattern)
            .flatMap(key -> reactiveRedis.opsForValue().get(key));
    }

    public Mono<Long> incrementViews(String productId) {
        return reactiveRedis.opsForValue()
            .increment("product:views:" + productId);
    }

    public Flux<Product> getProductsStream() {
        return reactiveRedis.opsForList()
            .range("products:new", 0, -1)
            .delayElements(Duration.ofMillis(100));
    }

    // Transaction support
    public Mono<Boolean> transferInventory(String fromId, String toId, int amount) {
        return reactiveRedis.execute(connection -> {
            return connection.multiExec().flatMap(tx -> {
                Mono<Long> decrement = connection.numberCommands()
                    .decrement(ByteBuffer.wrap(("inventory:" + fromId).getBytes()));
                Mono<Long> increment = connection.numberCommands()
                    .increment(ByteBuffer.wrap(("inventory:" + toId).getBytes()));

                return decrement.then(increment).then(tx.exec());
            });
        }).hasElement();
    }
}
```

### RedisMessageListenerContainer - Pub/Sub Message Listener

`RedisMessageListenerContainer` provides pub/sub functionality for message-driven POJOs. It handles low-level subscription management, message dispatching, and automatic reconnection. Supports pattern-based subscriptions and multiple listeners per topic.

```java
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.StringRedisTemplate;
import java.util.concurrent.CountDownLatch;

@Configuration
public class PubSubConfig {

    @Bean
    public RedisMessageListenerContainer messageListenerContainer(
            RedisConnectionFactory connectionFactory,
            MessageListenerAdapter orderListener,
            MessageListenerAdapter notificationListener) {

        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);

        // Subscribe to specific channels
        container.addMessageListener(orderListener, new ChannelTopic("orders"));
        container.addMessageListener(orderListener, new ChannelTopic("payments"));

        // Subscribe to pattern
        container.addMessageListener(notificationListener,
            new PatternTopic("notifications.*"));

        // Configuration
        container.setTaskExecutor(taskExecutor());
        container.setSubscriptionExecutor(subscriptionExecutor());
        container.setRecoveryInterval(5000L);

        return container;
    }

    @Bean
    public MessageListenerAdapter orderListener(OrderProcessor processor) {
        MessageListenerAdapter adapter = new MessageListenerAdapter(processor, "processOrder");
        adapter.setSerializer(new Jackson2JsonRedisSerializer<>(Order.class));
        return adapter;
    }

    @Bean
    public MessageListenerAdapter notificationListener() {
        return new MessageListenerAdapter(new MessageListener() {
            @Override
            public void onMessage(Message message, byte[] pattern) {
                String channel = new String(message.getChannel());
                String body = new String(message.getBody());
                System.out.println("Received on " + channel + ": " + body);
            }
        });
    }
}

// Message processor
@Component
public class OrderProcessor {

    public void processOrder(Order order) {
        System.out.println("Processing order: " + order.getId());
        // Process the order
    }
}

// Publisher
@Service
public class EventPublisher {

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private RedisTemplate<String, Order> orderTemplate;

    public void publishOrder(Order order) {
        orderTemplate.convertAndSend("orders", order);
    }

    public void publishNotification(String type, String message) {
        redisTemplate.convertAndSend("notifications." + type, message);
    }

    public void publishToMultipleChannels(String message) {
        redisTemplate.convertAndSend("channel1", message);
        redisTemplate.convertAndSend("channel2", message);
        redisTemplate.convertAndSend("channel3", message);
    }
}

// Synchronous listener for testing
@Component
public class SyncMessageListener implements MessageListener {

    private final CountDownLatch latch = new CountDownLatch(1);
    private String receivedMessage;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        receivedMessage = new String(message.getBody());
        latch.countDown();
    }

    public String awaitMessage(long timeout, TimeUnit unit) throws InterruptedException {
        latch.await(timeout, unit);
        return receivedMessage;
    }
}
```

### @EnableRedisRepositories - Repository Support

`@EnableRedisRepositories` enables automatic implementation of Redis repository interfaces with custom finder methods. Provides JPA-like repository pattern for Redis with support for query derivation, indexing, and TTL management.

```java
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.annotation.Id;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableRedisRepositories(basePackages = "com.example.repository")
public class RepositoryConfig {
}

// Entity
@RedisHash("users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed
    private String email;

    @Indexed
    private String department;

    private int age;

    @TimeToLive(unit = TimeUnit.HOURS)
    private Long ttl = 24L;

    // Constructors, getters, setters

    public User(String id, String name, String email, String department, int age) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
        this.age = age;
    }
}

// Repository interface
public interface UserRepository extends CrudRepository<User, String> {

    // Derived query methods
    List<User> findByEmail(String email);

    List<User> findByDepartment(String department);

    List<User> findByDepartmentAndAgeLessThan(String department, int age);

    List<User> findByNameContaining(String nameFragment);

    Long countByDepartment(String department);

    boolean existsByEmail(String email);
}

// Usage
@Service
public class UserManagementService {

    @Autowired
    private UserRepository userRepository;

    public void demonstrateRepositoryOperations() {
        // Save user
        User user = new User("1", "John Doe", "john@example.com", "Engineering", 30);
        userRepository.save(user);

        // Save multiple users
        List<User> users = Arrays.asList(
            new User("2", "Jane Smith", "jane@example.com", "Engineering", 28),
            new User("3", "Bob Wilson", "bob@example.com", "Sales", 35),
            new User("4", "Alice Brown", "alice@example.com", "Engineering", 25)
        );
        userRepository.saveAll(users);

        // Find by ID
        Optional<User> found = userRepository.findById("1");

        // Find by indexed field
        List<User> engineers = userRepository.findByDepartment("Engineering");

        // Complex query
        List<User> youngEngineers =
            userRepository.findByDepartmentAndAgeLessThan("Engineering", 30);

        // Count
        Long engineerCount = userRepository.countByDepartment("Engineering");

        // Check existence
        boolean exists = userRepository.existsByEmail("john@example.com");

        // Get all
        Iterable<User> allUsers = userRepository.findAll();

        // Delete
        userRepository.deleteById("1");

        // Delete all from department
        List<User> salesUsers = userRepository.findByDepartment("Sales");
        userRepository.deleteAll(salesUsers);
    }
}

// Custom TTL per entity
@RedisHash("sessions")
public class Session {

    @Id
    private String id;

    private String userId;

    private LocalDateTime createdAt;

    @TimeToLive
    private Long ttl;

    public Session(String id, String userId, long ttlSeconds) {
        this.id = id;
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
        this.ttl = ttlSeconds;
    }
}
```

### Redis Transactions and Pipelining

Redis transactions and pipelining support for executing multiple commands efficiently. Transactions provide atomic execution with MULTI/EXEC, while pipelining reduces round-trip latency by batching commands.

```java
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.dao.DataAccessException;

@Service
public class TransactionService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    // Transaction with SessionCallback (recommended)
    public List<Object> transferWithTransaction(String fromAccount, String toAccount,
                                                 double amount) {
        return redisTemplate.execute(new SessionCallback<List<Object>>() {
            @Override
            public List<Object> execute(RedisOperations operations)
                    throws DataAccessException {

                String fromKey = "account:" + fromAccount;
                String toKey = "account:" + toAccount;

                // Watch keys for optimistic locking
                operations.watch(fromKey, toKey);

                // Check balance
                Double fromBalance = Double.parseDouble(
                    (String) operations.opsForValue().get(fromKey));

                if (fromBalance < amount) {
                    operations.unwatch();
                    throw new IllegalStateException("Insufficient funds");
                }

                // Start transaction
                operations.multi();

                // Queue commands
                operations.opsForValue().set(fromKey,
                    String.valueOf(fromBalance - amount));
                operations.opsForValue().set(toKey,
                    String.valueOf(
                        Double.parseDouble((String) operations.opsForValue().get(toKey))
                        + amount));
                operations.opsForValue().increment("transaction:count");

                // Execute transaction
                return operations.exec();
            }
        });
    }

    // Pipelining for bulk operations
    public List<Object> bulkOperations(List<String> userIds) {
        return redisTemplate.executePipelined(new RedisCallback<Object>() {
            @Override
            public Object doInRedis(RedisConnection connection)
                    throws DataAccessException {

                StringRedisConnection stringConn = (StringRedisConnection) connection;

                for (String userId : userIds) {
                    // All these commands are pipelined
                    stringConn.get("user:" + userId);
                    stringConn.incr("user:views:" + userId);
                    stringConn.hGetAll("user:profile:" + userId);
                }

                return null; // Results come from executePipelined return value
            }
        });
    }

    // Transaction with programmatic control
    public void multiKeyTransaction() {
        redisTemplate.setEnableTransactionSupport(true);

        try {
            redisTemplate.multi();

            redisTemplate.opsForValue().set("key1", "value1");
            redisTemplate.opsForValue().set("key2", "value2");
            redisTemplate.opsForValue().increment("counter");

            List<Object> results = redisTemplate.exec();

        } catch (Exception e) {
            redisTemplate.discard();
            throw e;
        }
    }

    // Pipelining with SessionCallback
    public void bulkInsertWithPipeline(Map<String, User> users) {
        redisTemplate.executePipelined(new SessionCallback<Object>() {
            @Override
            public Object execute(RedisOperations operations)
                    throws DataAccessException {

                users.forEach((id, user) -> {
                    operations.opsForValue().set("user:" + id, user.toString());
                    operations.opsForSet().add("users:all", id);
                    operations.opsForHash().put("user:index:email",
                        user.getEmail(), id);
                });

                return null;
            }
        });
    }
}
```

### Redis Streams Support

Redis Streams support for working with append-only log data structure. Provides consumer groups, message acknowledgment, and pending message tracking for building reliable message processing systems.

```java
import org.springframework.data.redis.connection.stream.*;
import org.springframework.data.redis.core.StreamOperations;
import org.springframework.data.redis.stream.StreamListener;
import org.springframework.data.redis.stream.StreamMessageListenerContainer;
import org.springframework.data.redis.stream.Subscription;
import java.time.Duration;
import java.util.Map;

@Configuration
public class StreamConfig {

    @Bean
    public StreamMessageListenerContainer<String, MapRecord<String, String, String>>
            streamContainer(RedisConnectionFactory connectionFactory) {

        StreamMessageListenerContainer.StreamMessageListenerContainerOptions<String,
            MapRecord<String, String, String>> options =
                StreamMessageListenerContainer.StreamMessageListenerContainerOptions
                    .builder()
                    .pollTimeout(Duration.ofMillis(100))
                    .targetType(String.class)
                    .build();

        StreamMessageListenerContainer<String, MapRecord<String, String, String>> container =
            StreamMessageListenerContainer.create(connectionFactory, options);

        container.start();
        return container;
    }
}

@Service
public class StreamService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private StreamMessageListenerContainer<String, MapRecord<String, String, String>>
        streamContainer;

    // Producer - Add messages to stream
    public RecordId publishEvent(String stream, Map<String, String> event) {
        StreamOperations<String, String, String> streamOps =
            redisTemplate.opsForStream();

        return streamOps.add(stream, event);
    }

    public RecordId publishOrderEvent(String orderId, String status) {
        Map<String, String> event = Map.of(
            "orderId", orderId,
            "status", status,
            "timestamp", String.valueOf(System.currentTimeMillis())
        );

        return redisTemplate.opsForStream().add("orders:events", event);
    }

    // Consumer - Read from stream
    public List<MapRecord<String, String, String>> readEvents(String stream,
                                                                String offset) {
        StreamOperations<String, String, String> streamOps =
            redisTemplate.opsForStream();

        return streamOps.range(stream, Range.closed(offset, "+"));
    }

    // Consumer Group
    public void createConsumerGroup(String stream, String group) {
        try {
            redisTemplate.opsForStream().createGroup(stream, group);
        } catch (Exception e) {
            // Group might already exist
        }
    }

    public List<MapRecord<String, String, String>> consumeFromGroup(
            String stream, String group, String consumer) {

        StreamOperations<String, String, String> streamOps =
            redisTemplate.opsForStream();

        return streamOps.read(Consumer.from(group, consumer),
            StreamReadOptions.empty().count(10).block(Duration.ofSeconds(2)),
            StreamOffset.create(stream, ReadOffset.lastConsumed()));
    }

    // Acknowledge messages
    public Long acknowledgeMessages(String stream, String group,
                                    RecordId... recordIds) {
        return redisTemplate.opsForStream().acknowledge(stream, group, recordIds);
    }

    // Listener-based consumption
    public Subscription subscribeToStream() {
        return streamContainer.receive(
            Consumer.from("order-group", "processor-1"),
            StreamOffset.create("orders:events", ReadOffset.lastConsumed()),
            message -> {
                String orderId = message.getValue().get("orderId");
                String status = message.getValue().get("status");

                // Process message
                processOrder(orderId, status);

                // Acknowledge
                redisTemplate.opsForStream().acknowledge(
                    "orders:events", "order-group", message.getId());
            }
        );
    }

    // Get pending messages
    public PendingMessages getPendingMessages(String stream, String group) {
        return redisTemplate.opsForStream()
            .pending(stream, group, Range.unbounded(), 100L);
    }

    // Claim pending messages
    public List<MapRecord<String, String, String>> claimMessages(
            String stream, String group, String newConsumer,
            Duration minIdleTime, RecordId... recordIds) {

        return redisTemplate.opsForStream().claim(
            stream, group, newConsumer, minIdleTime, recordIds);
    }

    private void processOrder(String orderId, String status) {
        System.out.println("Processing order " + orderId + " with status " + status);
    }
}
```

## Integration and Use Cases

Spring Data Redis is designed for high-performance caching, session management, real-time analytics, and message-driven architectures in Spring applications. It excels in scenarios requiring fast data access, distributed caching across microservices, and pub/sub messaging patterns. The library seamlessly integrates with Spring Boot through auto-configuration, requiring minimal setup with `spring-boot-starter-data-redis` dependency. Common use cases include HTTP session storage with Spring Session, distributed locking, rate limiting, leaderboards with sorted sets, geospatial queries for location-based services, and event streaming with Redis Streams.

The integration patterns center around dependency injection of `RedisTemplate` or repository interfaces into Spring-managed beans. For reactive applications, `ReactiveRedisTemplate` integrates with WebFlux to provide non-blocking operations throughout the stack. The cache abstraction enables transparent caching with simple annotations, while repository support allows domain-driven design with Redis as the persistence layer. Connection factories support various deployment topologies including standalone, Sentinel for high availability, and Cluster for horizontal scaling. Custom serializers enable efficient storage of domain objects, and transaction support ensures data consistency across multiple operations. The library also provides comprehensive observability through Micrometer integration for metrics and distributed tracing.

