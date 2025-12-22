# MyBatis 3 - SQL Mapper Framework

MyBatis is a first-class persistence framework that simplifies database interactions in Java applications by coupling objects with SQL statements or stored procedures using XML descriptors or annotations. Unlike heavyweight ORM tools, MyBatis provides a lightweight approach that gives developers direct control over SQL while eliminating the boilerplate code typically required for JDBC programming. The framework handles the mapping between SQL result sets and Java objects, manages database connections, and provides powerful dynamic SQL capabilities.

MyBatis supports two primary configuration approaches: XML-based mapping and annotation-based mapping. The XML approach offers flexibility and separation of concerns by keeping SQL in external files, while annotations provide a more compact inline alternative. Core features include automatic parameter mapping, result set handling, transaction management, caching, lazy loading, and dynamic SQL generation. The framework integrates seamlessly with dependency injection containers and works with any JDBC-compliant database including MySQL, PostgreSQL, Oracle, SQL Server, and H2.

## Core APIs and Functions

### SqlSessionFactory - Database Session Factory

Factory interface for creating SqlSession instances that interact with the database. Manages database configuration, connection pooling, and transaction settings.

```java
// Build SqlSessionFactory from XML configuration
String resource = "mybatis-config.xml";
InputStream inputStream = Resources.getResourceAsStream(resource);
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

// Build with environment and properties
Properties properties = new Properties();
properties.setProperty("username", "dbuser");
properties.setProperty("password", "dbpass");
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder()
    .build(inputStream, "production", properties);

// Build programmatically without XML
DataSource dataSource = new PooledDataSource("org.hsqldb.jdbcDriver",
    "jdbc:hsqldb:mem:mybatis", "sa", "");
TransactionFactory transactionFactory = new JdbcTransactionFactory();
Environment environment = new Environment("development", transactionFactory, dataSource);
Configuration configuration = new Configuration(environment);
configuration.addMapper(UserMapper.class);
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(configuration);
```

### SqlSession - Database Operations Interface

Primary interface for executing SQL commands, retrieving mappers, and managing transactions. Implements AutoCloseable for try-with-resources support.

```java
// Basic CRUD operations
try (SqlSession session = sqlSessionFactory.openSession()) {
    // Insert with auto-generated keys
    User user = new User();
    user.setName("John Doe");
    user.setEmail("john@example.com");
    int rowsAffected = session.insert("UserMapper.insertUser", user);
    System.out.println("Inserted user ID: " + user.getId()); // Auto-populated

    // Select single object
    User retrieved = session.selectOne("UserMapper.selectUserById", 1);

    // Select list
    List<User> users = session.selectList("UserMapper.selectAllUsers");

    // Update
    user.setEmail("newemail@example.com");
    session.update("UserMapper.updateUser", user);

    // Delete
    session.delete("UserMapper.deleteUser", 1);

    // Commit transaction (required for changes to persist)
    session.commit();
} catch (Exception e) {
    session.rollback(); // Rollback on error
    throw e;
}

// Auto-commit mode
try (SqlSession session = sqlSessionFactory.openSession(true)) {
    session.insert("UserMapper.insertUser", user); // Auto-committed
}

// Using mapper interface (type-safe approach)
try (SqlSession session = sqlSessionFactory.openSession()) {
    UserMapper mapper = session.getMapper(UserMapper.class);
    User user = mapper.selectUserById(1);
    List<User> activeUsers = mapper.selectUsersByStatus("ACTIVE");
    session.commit();
}

// Pagination with RowBounds
RowBounds rowBounds = new RowBounds(10, 20); // offset 10, limit 20
List<User> page = session.selectList("UserMapper.selectAllUsers", null, rowBounds);

// Large result set with Cursor (lazy loading)
try (SqlSession session = sqlSessionFactory.openSession();
     Cursor<User> cursor = session.selectCursor("UserMapper.selectAllUsers")) {
    for (User user : cursor) {
        // Process one row at a time without loading all into memory
        processUser(user);
    }
}
```

### @Mapper and @Select - Annotation-Based Query Mapping

Annotation for marking mapper interfaces and defining SELECT queries inline without XML configuration.

```java
@Mapper
public interface UserMapper {
    // Simple select by ID
    @Select("SELECT id, name, email, created_at FROM users WHERE id = #{id}")
    User selectUserById(int id);

    // Select with multiple parameters using @Param
    @Select("SELECT * FROM users WHERE name = #{name} AND status = #{status}")
    List<User> selectUsersByNameAndStatus(
        @Param("name") String name,
        @Param("status") String status
    );

    // Dynamic SQL with script tags
    @Select({
        "<script>",
        "SELECT * FROM users",
        "<where>",
        "  <if test='name != null'>AND name LIKE #{name}</if>",
        "  <if test='email != null'>AND email = #{email}</if>",
        "  <if test='status != null'>AND status = #{status}</if>",
        "</where>",
        "ORDER BY created_at DESC",
        "</script>"
    })
    List<User> searchUsers(
        @Param("name") String name,
        @Param("email") String email,
        @Param("status") String status
    );

    // Complex result mapping with nested objects
    @Select("SELECT * FROM users WHERE id = #{id}")
    @Results(id = "userResultMap", value = {
        @Result(property = "id", column = "id", id = true),
        @Result(property = "name", column = "name"),
        @Result(property = "profile", column = "id",
                one = @One(select = "selectProfileByUserId", fetchType = FetchType.LAZY)),
        @Result(property = "orders", column = "id",
                many = @Many(select = "selectOrdersByUserId", fetchType = FetchType.LAZY))
    })
    User selectUserWithDetails(int id);

    @Select("SELECT * FROM profiles WHERE user_id = #{userId}")
    Profile selectProfileByUserId(int userId);

    @Select("SELECT * FROM orders WHERE user_id = #{userId}")
    List<Order> selectOrdersByUserId(int userId);
}
```

### @Insert, @Update, @Delete - Data Modification Annotations

Annotations for defining INSERT, UPDATE, and DELETE operations with automatic key generation support.

```java
@Mapper
public interface UserMapper {
    // Insert with auto-generated key
    @Insert("INSERT INTO users (name, email, created_at) VALUES (#{name}, #{email}, NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "id")
    int insertUser(User user);

    // Batch insert
    @Insert({
        "<script>",
        "INSERT INTO users (name, email) VALUES",
        "<foreach collection='users' item='user' separator=','>",
        "(#{user.name}, #{user.email})",
        "</foreach>",
        "</script>"
    })
    int insertUsers(@Param("users") List<User> users);

    // Update with dynamic fields
    @Update({
        "<script>",
        "UPDATE users",
        "<set>",
        "  <if test='name != null'>name = #{name},</if>",
        "  <if test='email != null'>email = #{email},</if>",
        "  updated_at = NOW()",
        "</set>",
        "WHERE id = #{id}",
        "</script>"
    })
    int updateUser(User user);

    // Delete with condition
    @Delete("DELETE FROM users WHERE id = #{id}")
    int deleteUser(int id);

    // Soft delete
    @Update("UPDATE users SET deleted = true, deleted_at = NOW() WHERE id = #{id}")
    int softDeleteUser(int id);

    // Complex insert with SelectKey
    @Insert("INSERT INTO users (id, name, email) VALUES (#{id}, #{name}, #{email})")
    @SelectKey(
        statement = "SELECT NEXT VALUE FOR user_seq",
        keyProperty = "id",
        before = true,
        resultType = Integer.class
    )
    int insertUserWithSequence(User user);
}

// Usage with transaction management
try (SqlSession session = sqlSessionFactory.openSession()) {
    UserMapper mapper = session.getMapper(UserMapper.class);

    User newUser = new User();
    newUser.setName("Jane Smith");
    newUser.setEmail("jane@example.com");

    mapper.insertUser(newUser);
    System.out.println("Generated ID: " + newUser.getId());

    newUser.setEmail("updated@example.com");
    mapper.updateUser(newUser);

    session.commit(); // Must commit for changes to persist
} catch (Exception e) {
    // Transaction automatically rolled back if commit not called
    throw e;
}
```

### XML Mapper Configuration - External SQL Mapping

XML-based mapping configuration providing SQL separation from Java code with support for complex result maps and dynamic SQL.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.example.mapper.UserMapper">

    <!-- Reusable result map -->
    <resultMap id="userResultMap" type="com.example.model.User">
        <id property="id" column="id"/>
        <result property="name" column="name"/>
        <result property="email" column="email"/>
        <result property="createdAt" column="created_at"/>
        <!-- Nested association (one-to-one) -->
        <association property="profile" column="id"
                     select="selectProfileByUserId" fetchType="lazy"/>
        <!-- Nested collection (one-to-many) -->
        <collection property="orders" column="id"
                    select="selectOrdersByUserId" fetchType="lazy"/>
    </resultMap>

    <!-- Simple select -->
    <select id="selectUserById" parameterType="int" resultMap="userResultMap">
        SELECT id, name, email, created_at
        FROM users
        WHERE id = #{id}
    </select>

    <!-- Dynamic SQL with if/where -->
    <select id="searchUsers" resultType="User">
        SELECT * FROM users
        <where>
            <if test="name != null and name != ''">
                AND name LIKE CONCAT('%', #{name}, '%')
            </if>
            <if test="email != null">
                AND email = #{email}
            </if>
            <if test="status != null">
                AND status = #{status}
            </if>
        </where>
        ORDER BY created_at DESC
    </select>

    <!-- Dynamic SQL with choose/when/otherwise -->
    <select id="findUsers" resultType="User">
        SELECT * FROM users
        WHERE active = true
        <choose>
            <when test="orderBy == 'name'">
                ORDER BY name
            </when>
            <when test="orderBy == 'date'">
                ORDER BY created_at DESC
            </when>
            <otherwise>
                ORDER BY id
            </otherwise>
        </choose>
    </select>

    <!-- Insert with generated keys -->
    <insert id="insertUser" parameterType="User"
            useGeneratedKeys="true" keyProperty="id" keyColumn="id">
        INSERT INTO users (name, email, created_at)
        VALUES (#{name}, #{email}, #{createdAt})
    </insert>

    <!-- Batch insert with foreach -->
    <insert id="insertUserBatch" parameterType="list">
        INSERT INTO users (name, email) VALUES
        <foreach collection="list" item="user" separator=",">
            (#{user.name}, #{user.email})
        </foreach>
    </insert>

    <!-- Update with dynamic set -->
    <update id="updateUser" parameterType="User">
        UPDATE users
        <set>
            <if test="name != null">name = #{name},</if>
            <if test="email != null">email = #{email},</if>
            updated_at = NOW()
        </set>
        WHERE id = #{id}
    </update>

    <!-- Delete -->
    <delete id="deleteUser" parameterType="int">
        DELETE FROM users WHERE id = #{id}
    </delete>

    <!-- Result map with discriminator (polymorphic results) -->
    <resultMap id="orderResultMap" type="Order">
        <id property="id" column="id"/>
        <result property="orderNumber" column="order_number"/>
        <discriminator javaType="string" column="order_type">
            <case value="ONLINE" resultType="OnlineOrder">
                <result property="paymentMethod" column="payment_method"/>
            </case>
            <case value="RETAIL" resultType="RetailOrder">
                <result property="storeLocation" column="store_location"/>
            </case>
        </discriminator>
    </resultMap>
</mapper>
```

```java
// Corresponding mapper interface
public interface UserMapper {
    User selectUserById(int id);
    List<User> searchUsers(@Param("name") String name,
                           @Param("email") String email,
                           @Param("status") String status);
    List<User> findUsers(@Param("orderBy") String orderBy);
    int insertUser(User user);
    int insertUserBatch(List<User> users);
    int updateUser(User user);
    int deleteUser(int id);
}
```

### MyBatis Configuration - Framework Setup

Main configuration file defining database connections, settings, type aliases, and mapper registration.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>
    <!-- Properties can be loaded from external file -->
    <properties resource="database.properties">
        <property name="username" value="dev_user"/>
        <property name="password" value="dev_pass"/>
    </properties>

    <!-- Global settings -->
    <settings>
        <!-- Enable automatic camelCase mapping -->
        <setting name="mapUnderscoreToCamelCase" value="true"/>
        <!-- Enable lazy loading for associations -->
        <setting name="lazyLoadingEnabled" value="true"/>
        <setting name="aggressiveLazyLoading" value="false"/>
        <!-- Enable second-level cache -->
        <setting name="cacheEnabled" value="true"/>
        <!-- Set default executor type (SIMPLE, REUSE, BATCH) -->
        <setting name="defaultExecutorType" value="SIMPLE"/>
        <!-- Set JDBC timeout -->
        <setting name="defaultStatementTimeout" value="25"/>
        <!-- Log implementation -->
        <setting name="logImpl" value="SLF4J"/>
    </settings>

    <!-- Type aliases for shorter names -->
    <typeAliases>
        <typeAlias type="com.example.model.User" alias="User"/>
        <typeAlias type="com.example.model.Order" alias="Order"/>
        <!-- Or scan entire package -->
        <package name="com.example.model"/>
    </typeAliases>

    <!-- Type handlers for custom type conversion -->
    <typeHandlers>
        <typeHandler handler="com.example.handler.JsonTypeHandler"/>
    </typeHandlers>

    <!-- Environments for different deployment scenarios -->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${driver}"/>
                <property name="url" value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
                <property name="poolMaximumActiveConnections" value="20"/>
                <property name="poolMaximumIdleConnections" value="5"/>
            </dataSource>
        </environment>

        <environment id="production">
            <transactionManager type="MANAGED"/>
            <dataSource type="JNDI">
                <property name="data_source" value="java:comp/env/jdbc/mydb"/>
            </dataSource>
        </environment>
    </environments>

    <!-- Database vendor identification for multi-DB support -->
    <databaseIdProvider type="DB_VENDOR">
        <property name="MySQL" value="mysql"/>
        <property name="PostgreSQL" value="postgresql"/>
        <property name="Oracle" value="oracle"/>
    </databaseIdProvider>

    <!-- Mapper registration -->
    <mappers>
        <!-- Individual mapper files -->
        <mapper resource="com/example/mapper/UserMapper.xml"/>
        <mapper resource="com/example/mapper/OrderMapper.xml"/>

        <!-- Or mapper interfaces -->
        <mapper class="com.example.mapper.ProductMapper"/>

        <!-- Or scan entire package -->
        <package name="com.example.mapper"/>
    </mappers>
</configuration>
```

```properties
# database.properties
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/mydb?useSSL=false&serverTimezone=UTC
username=root
password=secret
```

### Advanced Features - Caching, Batch Operations, and Stored Procedures

Complex MyBatis features including second-level caching, batch execution for performance, and stored procedure invocation.

```java
// Second-level cache with annotations
@CacheNamespace(
    eviction = FifoCache.class,
    flushInterval = 60000,
    size = 512,
    readWrite = true
)
@Mapper
public interface ProductMapper {
    @Select("SELECT * FROM products WHERE id = #{id}")
    @Options(useCache = true)
    Product selectProduct(int id);
}

// Batch execution for high-performance bulk operations
try (SqlSession session = sqlSessionFactory.openSession(ExecutorType.BATCH)) {
    UserMapper mapper = session.getMapper(UserMapper.class);

    for (int i = 0; i < 10000; i++) {
        User user = new User();
        user.setName("User " + i);
        user.setEmail("user" + i + "@example.com");
        mapper.insertUser(user);

        // Flush every 1000 records to avoid memory issues
        if (i % 1000 == 0) {
            session.flushStatements();
            session.clearCache();
        }
    }

    session.commit();
    List<BatchResult> results = session.flushStatements();
    for (BatchResult result : results) {
        System.out.println("Affected rows: " + Arrays.toString(result.getUpdateCounts()));
    }
}

// Calling stored procedures
@Mapper
public interface OrderMapper {
    @Select("{CALL get_order_summary(#{orderId, mode=IN, jdbcType=INTEGER}, " +
            "#{totalAmount, mode=OUT, jdbcType=DECIMAL}, " +
            "#{itemCount, mode=OUT, jdbcType=INTEGER})}")
    @Options(statementType = StatementType.CALLABLE)
    void getOrderSummary(Map<String, Object> params);
}

// Using stored procedure
try (SqlSession session = sqlSessionFactory.openSession()) {
    OrderMapper mapper = session.getMapper(OrderMapper.class);

    Map<String, Object> params = new HashMap<>();
    params.put("orderId", 12345);

    mapper.getOrderSummary(params);

    BigDecimal totalAmount = (BigDecimal) params.get("totalAmount");
    Integer itemCount = (Integer) params.get("itemCount");

    System.out.println("Total: " + totalAmount + ", Items: " + itemCount);
}

// ResultHandler for streaming large datasets
try (SqlSession session = sqlSessionFactory.openSession()) {
    session.select("UserMapper.selectAllUsers", new ResultHandler<User>() {
        @Override
        public void handleResult(ResultContext<? extends User> context) {
            User user = context.getResultObject();
            // Process each row immediately without loading all into memory
            processUser(user);

            if (context.getResultCount() % 1000 == 0) {
                // Log progress
                System.out.println("Processed " + context.getResultCount() + " users");
            }
        }
    });
}

// Custom type handler for JSON columns
@MappedJdbcTypes(JdbcType.VARCHAR)
@MappedTypes(JsonObject.class)
public class JsonTypeHandler extends BaseTypeHandler<JsonObject> {
    @Override
    public void setNonNullParameter(PreparedStatement ps, int i,
                                     JsonObject parameter, JdbcType jdbcType)
            throws SQLException {
        ps.setString(i, parameter.toJson());
    }

    @Override
    public JsonObject getNullableResult(ResultSet rs, String columnName)
            throws SQLException {
        String json = rs.getString(columnName);
        return json != null ? JsonObject.fromJson(json) : null;
    }

    @Override
    public JsonObject getNullableResult(ResultSet rs, int columnIndex)
            throws SQLException {
        String json = rs.getString(columnIndex);
        return json != null ? JsonObject.fromJson(json) : null;
    }

    @Override
    public JsonObject getNullableResult(CallableStatement cs, int columnIndex)
            throws SQLException {
        String json = cs.getString(columnIndex);
        return json != null ? JsonObject.fromJson(json) : null;
    }
}
```

## Summary

MyBatis excels in scenarios where developers need fine-grained control over SQL while avoiding JDBC boilerplate. Primary use cases include legacy database integration where schema modification is impractical, complex query optimization requiring hand-tuned SQL, reporting applications with sophisticated analytical queries, and gradual migration from stored procedures to application code. The framework supports batch processing for high-throughput ETL operations, multi-tenancy through dynamic table name resolution, and microservices requiring lightweight persistence without JPA overhead. Performance-critical applications benefit from MyBatis's minimal abstraction layer and caching capabilities.

Integration patterns include Spring Boot via mybatis-spring-boot-starter for auto-configuration and transaction management, standalone Java SE applications using SqlSessionFactory directly, and hybrid approaches combining MyBatis for queries with JPA for CRUD operations. The framework supports multiple databases through databaseId providers, connection pooling via POOLED or external solutions like HikariCP, and distributed transactions through JTA integration. Common architectural patterns include repository interfaces wrapping mappers, service layer transaction boundaries using Spring's @Transactional, and DAO objects exposing SqlSession operations. MyBatis generators can reverse-engineer mappers from existing database schemas, while plugins enable cross-cutting concerns like logging, security, and tenant isolation.

