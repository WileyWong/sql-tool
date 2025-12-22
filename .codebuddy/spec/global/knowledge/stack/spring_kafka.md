# Spring Kafka

Spring Kafka provides a high-level abstraction for Apache Kafka integration within the Spring ecosystem. It simplifies the process of building Kafka-based messaging systems by offering annotation-driven configuration, automatic serialization/deserialization, and seamless integration with Spring's dependency injection and transaction management. The framework supports both message production and consumption with features like dead letter queues, retry mechanisms, and comprehensive error handling.

The project consists of three main modules: spring-kafka (core functionality), spring-kafka-test (testing utilities with embedded Kafka brokers), and spring-kafka-bom (bill of materials for dependency management). It leverages Spring's programming model to provide type-safe message handling, flexible listener containers with concurrency control, and extensive support for message conversion formats including JSON, Avro, and custom serializers. Spring Kafka is built on top of Apache Kafka clients and integrates with Spring Boot for auto-configuration and production-ready features.

## Producer API - KafkaTemplate

KafkaTemplate provides the primary API for sending messages to Kafka topics with support for synchronous and asynchronous operations, transactions, and observability.

```java
@RestController
public class MessageController {
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @PostMapping("/send")
    public CompletableFuture<SendResult<String, String>> sendMessage(@RequestBody String message) {
        // Asynchronous send with CompletableFuture
        CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send("my-topic", "key", message);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                RecordMetadata metadata = result.getRecordMetadata();
                System.out.println("Sent message=[" + message +
                    "] with offset=[" + metadata.offset() +
                    "] to partition=[" + metadata.partition() + "]");
            } else {
                System.err.println("Unable to send message=[" + message + "] due to: " + ex.getMessage());
            }
        });

        return future;
    }

    @PostMapping("/send/object")
    public void sendObject(@RequestBody User user) {
        // Send object with automatic JSON serialization
        kafkaTemplate.send("user-topic", user.getId(), user);
    }

    @PostMapping("/send/default")
    public void sendToDefaultTopic(@RequestBody String message) {
        // Send to default topic configured in template
        kafkaTemplate.sendDefault(message);
    }
}
```

## Consumer API - @KafkaListener

@KafkaListener annotation enables declarative message consumption with flexible method signatures supporting various parameter types including ConsumerRecord, Message, headers, and acknowledgments.

```java
@Component
public class MessageConsumer {
    private static final Logger logger = LoggerFactory.getLogger(MessageConsumer.class);

    // Simple listener with automatic deserialization
    @KafkaListener(id = "simple-listener", topics = "my-topic")
    public void listen(String message) {
        logger.info("Received message: {}", message);
    }

    // Listener with ConsumerRecord for metadata access
    @KafkaListener(id = "metadata-listener", topics = "user-topic", groupId = "user-group")
    public void listenWithMetadata(ConsumerRecord<String, User> record) {
        logger.info("Received user: {} from partition: {} at offset: {}",
            record.value(), record.partition(), record.offset());
    }

    // Listener with manual acknowledgment
    @KafkaListener(id = "ack-listener", topics = "orders",
        containerFactory = "kafkaListenerContainerFactory",
        properties = {"spring.kafka.consumer.enable-auto-commit=false"})
    public void listenWithAck(Order order, Acknowledgment acknowledgment) {
        try {
            processOrder(order);
            acknowledgment.acknowledge(); // Manual commit
        } catch (Exception e) {
            logger.error("Error processing order", e);
            acknowledgment.nack(Duration.ofSeconds(1)); // Negative acknowledgment with delay
        }
    }

    // Batch listener
    @KafkaListener(id = "batch-listener", topics = "events")
    public void listenBatch(List<Event> events,
                           @Header(KafkaHeaders.RECEIVED_PARTITION) List<Integer> partitions,
                           @Header(KafkaHeaders.OFFSET) List<Long> offsets) {
        logger.info("Received {} events", events.size());
        for (int i = 0; i < events.size(); i++) {
            logger.info("Event {} from partition {} at offset {}",
                events.get(i), partitions.get(i), offsets.get(i));
        }
    }

    private void processOrder(Order order) {
        // Business logic
    }
}
```

## Configuration - Producer and Consumer Factory Setup

Producer and consumer factories provide centralized configuration for Kafka clients with support for serializers, deserializers, and client properties.

```java
@Configuration
@EnableKafka
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        configProps.put(ProducerConfig.ACKS_CONFIG, "all");
        configProps.put(ProducerConfig.RETRIES_CONFIG, 3);
        configProps.put(ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION, 1);
        return new DefaultKafkaProducerFactory<>(configProps);
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        KafkaTemplate<String, Object> template = new KafkaTemplate<>(producerFactory());
        template.setDefaultTopic("default-topic");
        return template;
    }

    @Bean
    public ConsumerFactory<String, Object> consumerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configProps.put(ConsumerConfig.GROUP_ID_CONFIG, "default-group");
        configProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        configProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        configProps.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        configProps.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, true);
        configProps.put(JsonDeserializer.TRUSTED_PACKAGES, "com.example.*");
        return new DefaultKafkaConsumerFactory<>(configProps);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Object> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, Object> factory =
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.setConcurrency(3); // 3 concurrent consumer threads
        factory.setBatchListener(false);
        factory.setCommonErrorHandler(errorHandler(kafkaTemplate()));
        return factory;
    }

    @Bean
    public CommonErrorHandler errorHandler(KafkaTemplate<String, Object> template) {
        DefaultErrorHandler handler = new DefaultErrorHandler(
            new DeadLetterPublishingRecoverer(template),
            new FixedBackOff(1000L, 2) // 2 retries with 1 second delay
        );
        handler.addNotRetryableExceptions(IllegalArgumentException.class);
        return handler;
    }
}
```

## Error Handling - Dead Letter Topics and Retry Logic

Dead Letter Publishing Recoverer automatically publishes failed messages to dead letter topics after exhausting retry attempts.

```java
@Configuration
public class ErrorHandlingConfig {

    @Bean
    public CommonErrorHandler errorHandler(KafkaOperations<Object, Object> template) {
        // Configure dead letter publishing with custom topic naming
        DeadLetterPublishingRecoverer recoverer = new DeadLetterPublishingRecoverer(template,
            (record, ex) -> {
                // Custom DLT topic naming: original-topic.DLT
                return new TopicPartition(record.topic() + ".DLT", record.partition());
            });

        // Exponential backoff: 1s, 2s, 4s, 8s (max 4 attempts)
        ExponentialBackOff backOff = new ExponentialBackOff(1000L, 2.0);
        backOff.setMaxAttempts(4);

        DefaultErrorHandler handler = new DefaultErrorHandler(recoverer, backOff);

        // Don't retry for validation errors
        handler.addNotRetryableExceptions(
            ValidationException.class,
            IllegalArgumentException.class
        );

        return handler;
    }

    // DLT listener to handle permanently failed messages
    @Component
    public static class DeadLetterListener {
        @KafkaListener(id = "dlt-listener", topics = "orders.DLT")
        public void handleDeadLetter(ConsumerRecord<String, String> record,
                                    @Header(KafkaHeaders.EXCEPTION_MESSAGE) String exceptionMessage) {
            System.err.println("Dead letter received from topic: " + record.topic());
            System.err.println("Original value: " + record.value());
            System.err.println("Exception: " + exceptionMessage);

            // Log to monitoring system, send alert, or persist for manual review
            alertOpsTeam(record, exceptionMessage);
        }

        private void alertOpsTeam(ConsumerRecord<String, String> record, String error) {
            // Implementation for alerting
        }
    }
}
```

## Message Conversion - JSON Serialization with Type Mapping

RecordMessageConverter provides automatic conversion between Java objects and Kafka messages with support for JSON, Avro, and custom formats.

```java
@Configuration
public class MessageConversionConfig {

    @Bean
    public RecordMessageConverter converter() {
        JsonMessageConverter converter = new JsonMessageConverter();

        // Configure type mapper for polymorphic deserialization
        DefaultJackson2JavaTypeMapper typeMapper = new DefaultJackson2JavaTypeMapper();
        typeMapper.setTypePrecedence(TypePrecedence.TYPE_ID); // Use __TypeId__ header
        typeMapper.addTrustedPackages("com.example.model", "com.common");

        // Map type IDs to classes
        Map<String, Class<?>> mappings = new HashMap<>();
        mappings.put("order", OrderEvent.class);
        mappings.put("payment", PaymentEvent.class);
        mappings.put("shipment", ShipmentEvent.class);
        typeMapper.setIdClassMapping(mappings);

        converter.setTypeMapper(typeMapper);
        return converter;
    }

    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);

        // Configure JsonSerializer with type mappings
        config.put(JsonSerializer.TYPE_MAPPINGS,
            "order:com.example.model.OrderEvent," +
            "payment:com.example.model.PaymentEvent," +
            "shipment:com.example.model.ShipmentEvent");

        return new DefaultKafkaProducerFactory<>(config);
    }
}
```

## Multi-Method Listeners - Type-Based Message Routing

@KafkaHandler enables class-level listeners with multiple handler methods that route messages based on payload type.

```java
@Component
@KafkaListener(id = "multi-handler", topics = {"events", "notifications"})
public class MultiMethodListener {
    private static final Logger logger = LoggerFactory.getLogger(MultiMethodListener.class);

    @KafkaHandler
    public void handleOrder(OrderEvent order) {
        logger.info("Processing order: {}", order.getOrderId());
        // Order-specific processing
        validateOrder(order);
        updateInventory(order);
    }

    @KafkaHandler
    public void handlePayment(PaymentEvent payment) {
        logger.info("Processing payment: {}", payment.getPaymentId());
        // Payment-specific processing
        processPayment(payment);
        notifyCustomer(payment);
    }

    @KafkaHandler
    public void handleShipment(ShipmentEvent shipment) {
        logger.info("Processing shipment: {}", shipment.getTrackingNumber());
        // Shipment-specific processing
        updateShippingStatus(shipment);
    }

    @KafkaHandler(isDefault = true)
    public void handleUnknown(Object message) {
        logger.warn("Received unknown message type: {}", message.getClass().getName());
        // Handle unexpected message types
    }

    private void validateOrder(OrderEvent order) { /* implementation */ }
    private void updateInventory(OrderEvent order) { /* implementation */ }
    private void processPayment(PaymentEvent payment) { /* implementation */ }
    private void notifyCustomer(PaymentEvent payment) { /* implementation */ }
    private void updateShippingStatus(ShipmentEvent shipment) { /* implementation */ }
}
```

## Topic Administration - Automatic Topic Creation

KafkaAdmin and TopicBuilder provide programmatic topic management with automatic creation and configuration at application startup.

```java
@Configuration
public class TopicConfig {

    @Bean
    public KafkaAdmin kafkaAdmin() {
        Map<String, Object> configs = new HashMap<>();
        configs.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        return new KafkaAdmin(configs);
    }

    @Bean
    public NewTopic ordersTopic() {
        return TopicBuilder.name("orders")
            .partitions(10)
            .replicas(3)
            .compact() // Enable log compaction
            .config(TopicConfig.RETENTION_MS_CONFIG, String.valueOf(Duration.ofDays(7).toMillis()))
            .config(TopicConfig.SEGMENT_MS_CONFIG, String.valueOf(Duration.ofHours(1).toMillis()))
            .build();
    }

    @Bean
    public NewTopic ordersDlt() {
        return TopicBuilder.name("orders.DLT")
            .partitions(10)
            .replicas(3)
            .config(TopicConfig.RETENTION_MS_CONFIG, String.valueOf(Duration.ofDays(30).toMillis()))
            .build();
    }

    @Bean
    public NewTopic paymentsTopic() {
        return TopicBuilder.name("payments")
            .partitions(5)
            .replicas(3)
            .config(TopicConfig.MIN_IN_SYNC_REPLICAS_CONFIG, "2")
            .config(TopicConfig.RETENTION_MS_CONFIG, String.valueOf(Duration.ofDays(90).toMillis()))
            .build();
    }

    @Bean
    public NewTopic compactedTopic() {
        // Topic for maintaining latest state per key (e.g., user profiles)
        return TopicBuilder.name("user-states")
            .partitions(10)
            .replicas(3)
            .compact()
            .config(TopicConfig.DELETE_RETENTION_MS_CONFIG, String.valueOf(Duration.ofDays(1).toMillis()))
            .config(TopicConfig.MIN_COMPACTION_LAG_MS_CONFIG, String.valueOf(Duration.ofMinutes(5).toMillis()))
            .build();
    }
}
```

## Retry Topics - Automatic Retry with @RetryableTopic

@RetryableTopic annotation provides declarative retry configuration with automatic creation of retry and dead letter topics.

```java
@Component
public class RetryableListener {

    @RetryableTopic(
        attempts = "4", // Total of 4 attempts (1 original + 3 retries)
        backoff = @Backoff(delay = 1000, multiplier = 2.0, maxDelay = 10000),
        autoCreateTopics = "true",
        include = {NetworkException.class, TimeoutException.class},
        exclude = {ValidationException.class}
    )
    @KafkaListener(topics = "payments")
    public void processPayment(PaymentRequest payment) {
        // This method will be retried with exponential backoff
        // Retry topics: payments-retry-1000, payments-retry-2000, payments-retry-4000
        // DLT: payments-dlt

        if (payment.getAmount() <= 0) {
            throw new ValidationException("Invalid amount"); // Goes directly to DLT
        }

        // Simulate transient failure
        if (!externalPaymentGateway.isAvailable()) {
            throw new NetworkException("Gateway unavailable"); // Will be retried
        }

        externalPaymentGateway.process(payment);
    }

    @DltHandler
    public void handleDlt(PaymentRequest payment,
                         @Header(KafkaHeaders.EXCEPTION_MESSAGE) String exception) {
        System.err.println("Payment failed permanently: " + payment);
        System.err.println("Reason: " + exception);

        // Persist failed payment for manual review
        saveFailedPayment(payment, exception);
        notifyAdministrator(payment, exception);
    }

    @Autowired
    private ExternalPaymentGateway externalPaymentGateway;

    private void saveFailedPayment(PaymentRequest payment, String error) { /* implementation */ }
    private void notifyAdministrator(PaymentRequest payment, String error) { /* implementation */ }
}
```

## Testing - Embedded Kafka for Integration Tests

EmbeddedKafka annotation provides an embedded Kafka broker for integration testing with automatic topic creation and Spring context integration.

```java
@SpringBootTest
@EmbeddedKafka(
    partitions = 1,
    topics = {"test-topic", "test-dlt"},
    brokerProperties = {
        "listeners=PLAINTEXT://localhost:9092",
        "port=9092"
    }
)
class KafkaIntegrationTest {

    @Autowired
    private EmbeddedKafkaBroker embeddedKafkaBroker;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private MessageConsumer consumer;

    private Consumer<String, String> testConsumer;

    @BeforeEach
    void setUp() {
        Map<String, Object> consumerProps = KafkaTestUtils.consumerProps(
            "test-group", "true", embeddedKafkaBroker);
        consumerProps.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        DefaultKafkaConsumerFactory<String, String> factory =
            new DefaultKafkaConsumerFactory<>(consumerProps);
        testConsumer = factory.createConsumer();
        testConsumer.subscribe(Collections.singletonList("test-topic"));
    }

    @Test
    void shouldProduceAndConsumeMessages() throws Exception {
        // Given
        String testMessage = "Hello Kafka";

        // When
        CompletableFuture<SendResult<String, String>> future =
            kafkaTemplate.send("test-topic", "key1", testMessage);

        // Then - verify send was successful
        SendResult<String, String> result = future.get(10, TimeUnit.SECONDS);
        assertThat(result.getRecordMetadata().topic()).isEqualTo("test-topic");

        // Consume and verify
        ConsumerRecord<String, String> record =
            KafkaTestUtils.getSingleRecord(testConsumer, "test-topic");
        assertThat(record.value()).isEqualTo(testMessage);
        assertThat(record.key()).isEqualTo("key1");
    }

    @Test
    void shouldHandleErrorsAndPublishToDlt() throws Exception {
        // Given
        String invalidMessage = "fail-message";

        // When
        kafkaTemplate.send("test-topic", invalidMessage);

        // Then - wait for message to be processed and sent to DLT
        ConsumerRecords<String, String> dltRecords =
            KafkaTestUtils.getRecords(testConsumer);

        assertThat(dltRecords.count()).isGreaterThan(0);
    }

    @AfterEach
    void tearDown() {
        testConsumer.close();
    }
}
```

## Listener Container Management - Programmatic Control

KafkaListenerEndpointRegistry provides programmatic access to listener containers for dynamic start, stop, and pause operations.

```java
@RestController
@RequestMapping("/admin/kafka")
public class KafkaAdminController {

    @Autowired
    private KafkaListenerEndpointRegistry registry;

    @PostMapping("/listeners/{id}/pause")
    public ResponseEntity<String> pauseListener(@PathVariable String id) {
        MessageListenerContainer container = registry.getListenerContainer(id);
        if (container != null) {
            container.pause();
            return ResponseEntity.ok("Listener " + id + " paused");
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/listeners/{id}/resume")
    public ResponseEntity<String> resumeListener(@PathVariable String id) {
        MessageListenerContainer container = registry.getListenerContainer(id);
        if (container != null) {
            container.resume();
            return ResponseEntity.ok("Listener " + id + " resumed");
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/listeners/{id}/stop")
    public ResponseEntity<String> stopListener(@PathVariable String id) {
        MessageListenerContainer container = registry.getListenerContainer(id);
        if (container != null) {
            container.stop();
            return ResponseEntity.ok("Listener " + id + " stopped");
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/listeners/{id}/start")
    public ResponseEntity<String> startListener(@PathVariable String id) {
        MessageListenerContainer container = registry.getListenerContainer(id);
        if (container != null) {
            container.start();
            return ResponseEntity.ok("Listener " + id + " started");
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/listeners")
    public ResponseEntity<Map<String, String>> getAllListeners() {
        Map<String, String> listeners = registry.getListenerContainers().stream()
            .collect(Collectors.toMap(
                container -> container.getListenerId(),
                container -> container.isRunning() ? "RUNNING" : "STOPPED"
            ));
        return ResponseEntity.ok(listeners);
    }
}
```

## Spring Boot Auto-Configuration - YAML Properties

Spring Boot auto-configuration enables zero-code setup through application properties with support for all Kafka client configurations.

```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092,localhost:9093,localhost:9094

    # Producer Configuration
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
      acks: all
      retries: 3
      properties:
        max.in.flight.requests.per.connection: 1
        enable.idempotence: true
        compression.type: snappy

    # Consumer Configuration
    consumer:
      group-id: my-application-group
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      auto-offset-reset: earliest
      enable-auto-commit: false
      properties:
        spring.json.trusted.packages: com.example.model,com.common
        max.poll.records: 500
        max.poll.interval.ms: 300000
        session.timeout.ms: 30000

    # Listener Configuration
    listener:
      ack-mode: manual
      concurrency: 3
      poll-timeout: 3000

    # Admin Configuration
    admin:
      properties:
        request.timeout.ms: 30000

    # SSL Configuration
    ssl:
      trust-store-location: classpath:kafka.truststore.jks
      trust-store-password: truststore-password
      key-store-location: classpath:kafka.keystore.jks
      key-store-password: keystore-password
      key-password: key-password

    # SASL Configuration
    properties:
      security.protocol: SASL_SSL
      sasl.mechanism: PLAIN
      sasl.jaas.config: org.apache.kafka.common.security.plain.PlainLoginModule required username="admin" password="admin-secret";

# Application-specific configuration
logging:
  level:
    org.springframework.kafka: DEBUG
    org.apache.kafka: INFO
```

## Summary and Use Cases

Spring Kafka is designed for building event-driven microservices, real-time data pipelines, and scalable message processing systems within the Spring ecosystem. Primary use cases include order processing systems with guaranteed delivery through dead letter topics, real-time analytics pipelines with batch processing capabilities, event sourcing architectures using CQRS patterns, and inter-service communication in distributed systems. The framework excels at scenarios requiring transactional message processing, automatic retry with exponential backoff, and seamless integration with Spring's transaction management and Spring Boot auto-configuration.

Integration patterns supported by Spring Kafka include request-reply messaging using ReplyingKafkaTemplate, transactional outbox pattern with @Transactional support, saga orchestration with message correlation, and event streaming with Kafka Streams DSL integration. The framework provides production-ready features such as consumer health indicators, metrics through Micrometer observability, distributed tracing integration, and comprehensive testing utilities with embedded brokers. Spring Kafka's declarative programming model with @KafkaListener and automatic JSON serialization reduces boilerplate code while maintaining flexibility for advanced configurations including custom serializers, partition assignment strategies, and container lifecycle management through KafkaListenerEndpointRegistry.
