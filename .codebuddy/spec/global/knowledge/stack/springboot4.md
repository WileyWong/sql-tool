# Spring Boot Framework

## Introduction

Spring Boot is an opinionated framework for building production-ready Spring applications with minimal configuration and setup. It eliminates the need for extensive XML configuration and boilerplate code by providing intelligent defaults, auto-configuration, and embedded servers. The framework enables developers to create standalone, production-grade applications that can be launched using `java -jar` or deployed as traditional WAR files. Spring Boot's convention-over-configuration approach allows developers to focus on business logic rather than infrastructure concerns. The current version (4.0.0) requires JDK 24 and leverages Spring Framework 7.0, bringing modern Java features including virtual threads, enhanced observability, and improved developer experience.

At its core, Spring Boot provides the `SpringApplication` class for bootstrapping applications, an extensive auto-configuration mechanism that automatically configures beans based on classpath content, and a comprehensive starter system for dependency management with over 150 starters available. The framework includes embedded web servers (Tomcat, Jetty, or Undertow), first-class externalized configuration support, production-ready actuator endpoints for monitoring and management, developer tools for enhanced productivity, native Docker Compose support, and seamless Testcontainers integration for testing. Spring Boot seamlessly integrates with the entire Spring ecosystem while maintaining the flexibility to override defaults as requirements evolve.

## APIs and Key Functions

### SpringApplication.run() - Bootstrap Spring Boot Application

The static `run()` method is the primary entry point for launching a Spring Boot application. It creates an appropriate ApplicationContext, registers command-line properties, refreshes the context, and triggers CommandLineRunner beans.

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class MyApplication {

    @GetMapping("/")
    public String home() {
        return "Hello World!";
    }

    @GetMapping("/api/status")
    public Status getStatus() {
        return new Status("running", System.currentTimeMillis());
    }

    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }

    record Status(String state, long timestamp) {}
}
```

### SpringApplication Customization - Configure Application Before Launch

Create and customize a `SpringApplication` instance to configure banner mode, add listeners, set default properties, or modify application behavior before running.

```java
import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;

import java.util.Properties;

@SpringBootApplication
public class CustomApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(CustomApplication.class);

        // Customize banner
        app.setBannerMode(Banner.Mode.OFF);

        // Set default properties
        Properties props = new Properties();
        props.setProperty("server.port", "8081");
        props.setProperty("spring.application.name", "custom-app");
        app.setDefaultProperties(props);

        // Add application listener
        app.addListeners(new ApplicationListener<ApplicationReadyEvent>() {
            @Override
            public void onApplicationEvent(ApplicationReadyEvent event) {
                System.out.println("Application is ready!");
            }
        });

        // Set additional profiles
        app.setAdditionalProfiles("dev", "local");

        app.run(args);
    }
}
```

### @SpringBootApplication - All-in-One Configuration Annotation

The `@SpringBootApplication` annotation combines `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan` into a single convenience annotation for application bootstrapping.

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(
    scanBasePackages = {"com.example.app", "com.example.shared"},
    exclude = {DataSourceAutoConfiguration.class}
)
@EnableScheduling
public class ConfiguredApplication {

    @Bean
    public AppConfig appConfig() {
        return new AppConfig("production", 30);
    }

    public static void main(String[] args) {
        SpringApplication.run(ConfiguredApplication.class, args);
    }
}

class AppConfig {
    private final String environment;
    private final int timeout;

    public AppConfig(String environment, int timeout) {
        this.environment = environment;
        this.timeout = timeout;
    }

    public String getEnvironment() { return environment; }
    public int getTimeout() { return timeout; }
}
```

### CommandLineRunner - Execute Code on Application Startup

The `CommandLineRunner` interface allows beans to run specific code after the application context is loaded, with access to command-line arguments.

```java
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.annotation.Order;

@SpringBootApplication
public class StartupApplication {

    public static void main(String[] args) {
        SpringApplication.run(StartupApplication.class, args);
    }

    @Bean
    @Order(1)
    public CommandLineRunner initDatabase() {
        return args -> {
            System.out.println("Initializing database schema...");
            // Database initialization logic
            System.out.println("Database ready");
        };
    }

    @Bean
    @Order(2)
    public CommandLineRunner loadData() {
        return args -> {
            System.out.println("Loading initial data...");
            if (args.length > 0) {
                System.out.println("Data file: " + args[0]);
            }
            System.out.println("Data loaded successfully");
        };
    }

    @Bean
    @Order(3)
    public CommandLineRunner startScheduler() {
        return args -> {
            System.out.println("Starting background scheduler");
            // Scheduler initialization
        };
    }
}
```

### Spring Boot Starters - Dependency Management

Starters are curated dependency descriptors that provide all necessary dependencies for specific functionality without hunting through sample code.

```gradle
// build.gradle - Example of using Spring Boot starters
plugins {
    id 'org.springframework.boot' version '4.0.0-SNAPSHOT'
    id 'io.spring.dependency-management' version '1.1.0'
    id 'java'
}

group = 'com.example'
version = '1.0.0'
sourceCompatibility = '24'

repositories {
    mavenCentral()
    maven { url 'https://repo.spring.io/snapshot' }
}

dependencies {
    // Core starter with auto-configuration, logging, and YAML
    implementation 'org.springframework.boot:spring-boot-starter'

    // Web starter with embedded Tomcat and Spring MVC
    implementation 'org.springframework.boot:spring-boot-starter-web'

    // JPA starter with Hibernate and Spring Data JPA
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'

    // Security starter with Spring Security
    implementation 'org.springframework.boot:spring-boot-starter-security'

    // Actuator starter for monitoring and management
    implementation 'org.springframework.boot:spring-boot-starter-actuator'

    // Docker Compose support for local development
    implementation 'org.springframework.boot:spring-boot-docker-compose'

    // Testcontainers support for integration testing
    testImplementation 'org.springframework.boot:spring-boot-testcontainers'
    testImplementation 'org.testcontainers:postgresql'

    // Test starter with JUnit, Mockito, and AssertJ
    testImplementation 'org.springframework.boot:spring-boot-starter-test'

    // Database driver
    runtimeOnly 'org.postgresql:postgresql'
}

tasks.named('test') {
    useJUnitPlatform()
}
```

### Externalized Configuration - Application Properties

Spring Boot supports flexible externalized configuration through application.properties, application.yml, environment variables, and command-line arguments with automatic property binding.

```yaml
# application.yml - Comprehensive configuration example
spring:
  application:
    name: my-application

  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: dbuser
    password: ${DB_PASSWORD:default}
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5

  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

  security:
    oauth2:
      client:
        registration:
          github:
            client-id: ${GITHUB_CLIENT_ID}
            client-secret: ${GITHUB_CLIENT_SECRET}

server:
  port: 8080
  compression:
    enabled: true
  error:
    include-message: always

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,env
  endpoint:
    health:
      show-details: when-authorized

logging:
  level:
    root: INFO
    com.example: DEBUG
  file:
    name: logs/application.log
    max-size: 10MB
```

```java
// Configuration properties binding
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name;
    private Security security = new Security();
    private List<String> servers = new ArrayList<>();

    public static class Security {
        private boolean enabled = true;
        private int tokenExpiry = 3600;

        // Getters and setters
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
        public int getTokenExpiry() { return tokenExpiry; }
        public void setTokenExpiry(int tokenExpiry) { this.tokenExpiry = tokenExpiry; }
    }

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Security getSecurity() { return security; }
    public void setSecurity(Security security) { this.security = security; }
    public List<String> getServers() { return servers; }
    public void setServers(List<String> servers) { this.servers = servers; }
}
```

### Actuator Endpoints - Production Monitoring

Spring Boot Actuator provides production-ready features for monitoring and managing applications through HTTP or JMX endpoints.

```java
// Custom health indicator
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    private final DatabaseService databaseService;

    public DatabaseHealthIndicator(DatabaseService databaseService) {
        this.databaseService = databaseService;
    }

    @Override
    public Health health() {
        try {
            long responseTime = databaseService.ping();
            if (responseTime < 100) {
                return Health.up()
                    .withDetail("database", "PostgreSQL")
                    .withDetail("responseTime", responseTime + "ms")
                    .build();
            } else {
                return Health.outOfService()
                    .withDetail("responseTime", responseTime + "ms")
                    .withDetail("reason", "Slow response")
                    .build();
            }
        } catch (Exception ex) {
            return Health.down()
                .withDetail("error", ex.getMessage())
                .build();
        }
    }
}
```

```bash
# Actuator endpoint usage examples

# Check application health
curl http://localhost:8080/actuator/health
# Response:
# {
#   "status": "UP",
#   "components": {
#     "database": {
#       "status": "UP",
#       "details": {
#         "database": "PostgreSQL",
#         "responseTime": "45ms"
#       }
#     },
#     "diskSpace": {
#       "status": "UP",
#       "details": {
#         "total": 500000000000,
#         "free": 250000000000,
#         "threshold": 10485760
#       }
#     }
#   }
# }

# View environment properties
curl http://localhost:8080/actuator/env

# Check metrics
curl http://localhost:8080/actuator/metrics/jvm.memory.used

# View all beans
curl http://localhost:8080/actuator/beans

# Check configuration properties
curl http://localhost:8080/actuator/configprops
```

### EnvironmentEndpoint - Environment Information Access

The `@Endpoint` annotation allows creation of custom actuator endpoints for exposing application-specific information.

```java
import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;
import org.springframework.boot.actuate.endpoint.annotation.Selector;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@Endpoint(id = "appinfo")
public class AppInfoEndpoint {

    private final AppMetricsService metricsService;

    public AppInfoEndpoint(AppMetricsService metricsService) {
        this.metricsService = metricsService;
    }

    @ReadOperation
    public Map<String, Object> getAppInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("version", "1.0.0");
        info.put("buildTime", "2025-01-15T10:30:00Z");
        info.put("activeUsers", metricsService.getActiveUserCount());
        info.put("requestsProcessed", metricsService.getTotalRequests());
        return info;
    }

    @ReadOperation
    public Map<String, Object> getMetric(@Selector String metricName) {
        Map<String, Object> result = new HashMap<>();
        result.put("name", metricName);
        result.put("value", metricsService.getMetricValue(metricName));
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }
}

// Access with:
// GET http://localhost:8080/actuator/appinfo
// GET http://localhost:8080/actuator/appinfo/activeUsers
```

### Auto-Configuration - Conditional Bean Configuration

Spring Boot's auto-configuration mechanism automatically configures beans based on classpath content, allowing customization through properties or custom beans.

```java
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnClass(RedisTemplate.class)
@EnableConfigurationProperties(CacheProperties.class)
public class CacheAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    @ConditionalOnProperty(prefix = "app.cache", name = "enabled", havingValue = "true")
    public CacheManager cacheManager(CacheProperties properties) {
        RedisCacheManager manager = new RedisCacheManager();
        manager.setHost(properties.getHost());
        manager.setPort(properties.getPort());
        manager.setTtl(properties.getTtl());
        return manager;
    }

    @Bean
    @ConditionalOnMissingBean
    public CacheService cacheService(CacheManager cacheManager) {
        return new CacheService(cacheManager);
    }
}

@ConfigurationProperties(prefix = "app.cache")
class CacheProperties {
    private boolean enabled = true;
    private String host = "localhost";
    private int port = 6379;
    private int ttl = 3600;

    // Getters and setters
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public String getHost() { return host; }
    public void setHost(String host) { this.host = host; }
    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }
    public int getTtl() { return ttl; }
    public void setTtl(int ttl) { this.ttl = ttl; }
}
```

### RESTful Web Services - Building REST APIs

Spring Boot simplifies creating RESTful web services with embedded servers and automatic JSON serialization.

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@SpringBootApplication
public class RestApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(RestApiApplication.class, args);
    }
}

@RestController
@RequestMapping("/api/users")
class UserController {

    private final ConcurrentHashMap<Long, User> users = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong();

    @GetMapping
    public List<User> getAllUsers() {
        return new ArrayList<>(users.values());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return Optional.ofNullable(users.get(id))
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        user.setId(idCounter.incrementAndGet());
        users.put(user.getId(), user);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        if (!users.containsKey(id)) {
            return ResponseEntity.notFound().build();
        }
        user.setId(id);
        users.put(id, user);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (users.remove(id) != null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("Invalid request", ex.getMessage()));
    }
}

record User(Long id, String name, String email) {
    public User withId(Long newId) {
        return new User(newId, name, email);
    }
    public void setId(Long id) {} // Placeholder for mutable operations
}

record ErrorResponse(String error, String message) {}
```

### Virtual Threads Support - Modern Concurrency

Spring Boot 4.0 provides first-class support for Java virtual threads, enabling highly scalable applications with simplified concurrency patterns. Virtual threads dramatically reduce resource consumption for I/O-bound workloads.

```yaml
# application.yml - Enable virtual threads
spring:
  threads:
    virtual:
      enabled: true
```

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.task.SimpleAsyncTaskExecutorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;

@SpringBootApplication
@EnableAsync
public class VirtualThreadsApplication {

    public static void main(String[] args) {
        SpringApplication.run(VirtualThreadsApplication.class, args);
    }

    @Bean
    public AsyncTaskExecutor applicationTaskExecutor(SimpleAsyncTaskExecutorBuilder builder) {
        return builder
            .virtualThreads(true)
            .threadNamePrefix("vthread-")
            .build();
    }
}

@Service
class AsyncService {

    @Async
    public CompletableFuture<String> performAsyncTask(String input) {
        // This runs on a virtual thread automatically
        try {
            Thread.sleep(1000); // Simulated I/O operation
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return CompletableFuture.completedFuture("Processed: " + input);
    }
}

@RestController
class VirtualThreadController {

    private final AsyncService asyncService;

    VirtualThreadController(AsyncService asyncService) {
        this.asyncService = asyncService;
    }

    @GetMapping("/async")
    public CompletableFuture<String> handleAsync() {
        return asyncService.performAsyncTask("request-data");
    }
}
```

### Docker Compose Support - Local Development

Spring Boot 4.0 includes native Docker Compose support that automatically starts and stops services defined in `compose.yaml` during development.

```yaml
# compose.yaml - Local development services
services:
  postgres:
    image: 'postgres:16'
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: mydb
    ports:
      - '5432:5432'
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: 'redis:7'
    ports:
      - '6379:6379'

volumes:
  postgres-data:
```

```yaml
# application.yml - Docker Compose configuration
spring:
  docker:
    compose:
      enabled: true
      file: compose.yaml
      lifecycle-management: start-and-stop
      startup: wait
      stop:
        command: down
        timeout: 10s

  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: myuser
    password: secret

  data:
    redis:
      host: localhost
      port: 6379
```

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.docker.compose.core.RunningService;
import org.springframework.boot.docker.compose.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import java.util.List;

@SpringBootApplication
public class DockerComposeApplication {

    public static void main(String[] args) {
        SpringApplication.run(DockerComposeApplication.class, args);
    }
}

@Entity
class Product {
    @Id @GeneratedValue
    private Long id;
    private String name;
    private Double price;

    // Constructors, getters, setters
    public Product() {}
    public Product(String name, Double price) {
        this.name = name;
        this.price = price;
    }
    public Long getId() { return id; }
    public String getName() { return name; }
    public Double getPrice() { return price; }
}

@Repository
interface ProductRepository extends JpaRepository<Product, Long> {}

@RestController
@RequestMapping("/api/products")
class ProductController {

    private final ProductRepository repository;
    private final RedisTemplate<String, Object> redisTemplate;

    ProductController(ProductRepository repository, RedisTemplate<String, Object> redisTemplate) {
        this.repository = repository;
        this.redisTemplate = redisTemplate;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        String cacheKey = "products:all";
        List<Product> cached = (List<Product>) redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return cached;
        }
        List<Product> products = repository.findAll();
        redisTemplate.opsForValue().set(cacheKey, products);
        return products;
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        redisTemplate.delete("products:all");
        return repository.save(product);
    }
}
```

### Testing Spring Boot Applications

Spring Boot provides comprehensive testing support with `@SpringBootTest`, specialized test slices for focused testing, and Testcontainers integration for realistic integration tests.

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ApplicationIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testHealthEndpoint() {
        ResponseEntity<String> response = restTemplate.getForEntity("/actuator/health", String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("UP");
    }

    @Test
    void testCreateAndRetrieveUser() {
        User newUser = new User(null, "John Doe", "john@example.com");

        ResponseEntity<User> createResponse = restTemplate.postForEntity("/api/users", newUser, User.class);
        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(createResponse.getBody().name()).isEqualTo("John Doe");

        Long userId = createResponse.getBody().id();
        ResponseEntity<User> getResponse = restTemplate.getForEntity("/api/users/" + userId, User.class);
        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(getResponse.getBody().email()).isEqualTo("john@example.com");
    }
}

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGetAllUsers() throws Exception {
        mockMvc.perform(get("/api/users"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/json"));
    }

    @Test
    void testCreateUser() throws Exception {
        String userJson = "{\"name\":\"Jane Doe\",\"email\":\"jane@example.com\"}";

        mockMvc.perform(post("/api/users")
                .contentType("application/json")
                .content(userJson))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Jane Doe"))
            .andExpect(jsonPath("$.email").value("jane@example.com"))
            .andExpect(jsonPath("$.id").isNumber());
    }
}

// Testcontainers integration test
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class ProductIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
        .withDatabaseName("testdb")
        .withUsername("testuser")
        .withPassword("testpass");

    @Container
    static GenericContainer<?> redis = new GenericContainer<>("redis:7")
        .withExposedPorts(6379);

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.data.redis.host", redis::getHost);
        registry.add("spring.data.redis.port", redis::getFirstMappedPort);
    }

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void testProductLifecycle() {
        // Create product
        Product newProduct = new Product("Laptop", 999.99);
        ResponseEntity<Product> createResponse = restTemplate.postForEntity(
            "/api/products",
            newProduct,
            Product.class
        );

        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(createResponse.getBody().getName()).isEqualTo("Laptop");

        // Verify in database
        List<Product> products = productRepository.findAll();
        assertThat(products).hasSize(1);
        assertThat(products.get(0).getName()).isEqualTo("Laptop");

        // Test caching via Redis
        ResponseEntity<Product[]> getResponse = restTemplate.getForEntity(
            "/api/products",
            Product[].class
        );
        assertThat(getResponse.getBody()).hasSize(1);
    }
}
```

## Summary

Spring Boot revolutionizes Java application development by eliminating configuration overhead and providing sensible defaults while maintaining full customizability. Version 4.0 embraces modern Java with JDK 24 support, virtual threads for massive scalability, and enhanced developer experience through Docker Compose and Testcontainers integration. The framework's main use cases span microservices development, RESTful API backends, batch processing applications, reactive systems, and traditional web applications. Its embedded server support enables rapid prototyping and deployment as self-contained JAR files, while the extensive starter ecosystem with over 150 starters covers databases (JPA, MongoDB, Redis, Cassandra), messaging (Kafka, RabbitMQ, ActiveMQ), security (OAuth2, SAML, LDAP), monitoring (Actuator, Micrometer, distributed tracing), cloud platforms (AWS, Azure, Google Cloud, Kubernetes), and modern development tools (Docker Compose, Testcontainers, DevTools). The auto-configuration system intelligently adapts to classpath contents, automatically wiring components while allowing developers to override any default through properties or custom beans.

Integration with Spring Boot follows consistent patterns across all modules: add the appropriate starter dependency, configure through application.properties or application.yml, and leverage auto-configuration for automatic bean wiring. The framework's opinionated defaults mean most applications work out-of-the-box with minimal configuration, while production-ready features like health checks, metrics, distributed tracing, and externalized configuration come built-in through Actuator. Virtual threads enable handling millions of concurrent connections with minimal resource usage, Docker Compose support streamlines local development with automatic service lifecycle management, and Testcontainers integration ensures realistic integration tests with actual database and service instances. Developers can focus on business logic while Spring Boot handles infrastructure concerns, create modular applications using profiles and conditional configuration, test comprehensively with built-in testing support and Testcontainers, and deploy anywhere from traditional application servers to modern container platforms and serverless environments. This combination of simplicity, modern Java features, production-grade observability, and unmatched flexibility has made Spring Boot the de facto standard for building enterprise Java applications.
