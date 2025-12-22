
### Spring Data MongoDB Application Examples (Imperative & Reactive)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/getting-started.adoc

Provides example Java applications for Spring Data MongoDB, demonstrating both imperative and reactive programming models. These examples show how to configure and use `MongoTemplate` to interact with a MongoDB instance.

```java
package example;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;

@SpringBootApplication
public class MongoApplication {

    public static void main(String[] args) {
        SpringApplication.run(MongoApplication.class, args);
    }

    @Bean
    public CommandLineRunner runner(MongoTemplate mongoTemplate) {
        return args -> {
            Person person = new Person("Joe", 34);
            mongoTemplate.save(person);
            Person loadedPerson = mongoTemplate.findOne(org.springframework.data.mongodb.core.query.Query.query(org.springframework.data.mongodb.core.query.Criteria.where("name").is("Joe")),
                    Person.class);
            System.out.println(loadedPerson);
            mongoTemplate.dropCollection(Person.class);
        };
    }
}
```

```java
package example;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import reactor.core.publisher.Mono;

@SpringBootApplication
public class ReactiveMongoApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReactiveMongoApplication.class, args);
    }

    @Bean
    public CommandLineRunner runner(ReactiveMongoTemplate reactiveMongoTemplate) {
        return args -> {
            Person person = new Person("Joe", 34);
            reactiveMongoTemplate.save(person).block();
            reactiveMongoTemplate.findOne(new org.springframework.data.mongodb.core.query.Query(org.springframework.data.mongodb.core.query.Criteria.where("name").is("Joe")),
                    Person.class).subscribe(System.out::println);
            reactiveMongoTemplate.dropCollection(Person.class).block();
        };
    }
}
```

--------------------------------

### Example Console Output for Spring Data MongoDB Application

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/getting-started.adoc

This snippet displays the typical console output when running the Spring Data MongoDB 'Hello World' application. It includes debug logs from MongoTemplate detailing database operations and the final retrieved Person object.

```log
10:01:32,265 DEBUG o.s.data.mongodb.core.MongoTemplate - insert Document containing fields: [_class, age, name] in collection: Person
10:01:32,765 DEBUG o.s.data.mongodb.core.MongoTemplate - findOne using query: { "name" : "Joe"} in db.collection: database.Person
Person [id=4ddbba3c0be56b7e1b210166, name=Joe, age=34]
10:01:32,984 DEBUG o.s.data.mongodb.core.MongoTemplate - Dropped collection [database.person]
```

--------------------------------

### XML: Basic MongoClient Configuration

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/migration-guide/migration-guide-2.x-to-3.x.adoc

Example of configuring a basic MongoDB client using default settings in XML. This sets up the connection without specific host or port details.

```xml
<mongo:mongo.mongo-client id="with-defaults" />
```

--------------------------------

### Start MongoDB Server

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/README.adoc

Command to start a MongoDB server instance. It specifies the database path, IP version, port, and replica set name. Requires MongoDB to be installed and MONGODB_HOME environment variable set.

```bash
$MONGODB_HOME/bin/mongod --dbpath $MONGODB_HOME/runtime/data --ipv6 --port 27017 --replSet rs0
...
"msg":"Successfully connected to host"
```

--------------------------------

### XML: MongoClient with Host/Port and Connection String

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/migration-guide/migration-guide-2.x-to-3.x.adoc

Demonstrates configuring a MongoDB client by specifying host and port, or by using a connection string. This allows for flexible connection setup based on environment variables or direct URI.

```xml
<context:property-placeholder location="classpath:..."/>

<mongo:mongo.mongo-client id="client-just-host-port"
                          host="${mongo.host}" port="${mongo.port}" />

<mongo:mongo.mongo-client id="client-using-connection-string"
                          connection-string="mongodb://${mongo.host}:${mongo.port}/?replicaSet=rs0" />
```

--------------------------------

### Query by Example using Repository

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/repositories/query-by-example.adoc

Demonstrates how to use Spring Data MongoDB's Query by Example feature with a repository. It shows a `PersonRepository` extending `QueryByExampleExecutor` and a `PersonService` that uses `findAll(Example.of(probe))` to retrieve `Person` objects based on a `Person` probe object.

```java
public interface PersonRepository extends QueryByExampleExecutor<Person> {

}

public class PersonService {

  @Autowired PersonRepository personRepository;

  public List<Person> findPeople(Person probe) {
    return personRepository.findAll(Example.of(probe));
  }
}
```

--------------------------------

### Wildcard Index Setup

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-index-management.adoc

Illustrates setting up wildcard indexes, which index all fields or specific ones based on a pattern. This includes programmatic setup and annotation-based approaches for domain types and properties.

```java
mongoOperations
    .indexOps(User.class)
    .ensureIndex(new WildcardIndex("userMetadata"));
```

```java
@Document
@WildcardIndexed
public class Product {
	// …
}
```

```java
@Document
@WildcardIndexed(wildcardProjection = "{ 'userMetadata.age' : 0 }")
public class User {
    private @Id String id;
    private UserMetadata userMetadata;
}
```

```java
@Document
public class User {
    private @Id String id;

    @WildcardIndexed
    private UserMetadata userMetadata;
}
```

--------------------------------

### Reactive Pagination and Sorting Example

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Example of using `Pageable` with a reactive repository to fetch paginated and sorted results, demonstrating how to apply offset and sorting parameters.

```java
Pageable page = PageRequest.of(1, 10, Sort.by("lastname"));
Flux<Person> persons = repository.findByFirstnameOrderByLastname("luke", page);
```

--------------------------------

### Manual Collection Setup for Queryable Encryption

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-encryption.adoc

Illustrates the manual setup for collections utilizing Queryable Encryption (QE) in Spring Data MongoDB. This involves creating data keys, defining collection options with encryption details and queryable attributes, and then creating the collection using MongoOperations.

```java
BsonBinary pinDK = clientEncryption.createDataKey("local", new com.mongodb.client.model.vault.DataKeyOptions());
BsonBinary ssnDK = clientEncryption.createDataKey("local", new com.mongodb.client.model.vault.DataKeyOptions());
BsonBinary ageDK = clientEncryption.createDataKey("local", new com.mongodb.client.model.vault.DataKeyOptions());
BsonBinary signDK = clientEncryption.createDataKey("local", new com.mongodb.client.model.vault.DataKeyOptions());

CollectionOptions collectionOptions = CollectionOptions.encryptedCollection(options -> options
    .encrypted(string("pin"), pinDK)
    .queryable(encrypted(string("ssn")).algorithm("Indexed").keyId(ssnDK.asUuid()), equality().contention(0))
    .queryable(encrypted(int32("age")).algorithm("Range").keyId(ageDK.asUuid()), range().contention(8).min(0).max(150))
    .queryable(encrypted(int64("address.sign")).algorithm("Range").keyId(signDK.asUuid()), range().contention(2).min(-10L).max(10L))
);

mongoTemplate.createCollection(Patient.class, collectionOptions); <1>
```

--------------------------------

### Imperative MongoTemplate Setup

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/configuration.adoc

Demonstrates how to instantiate MongoTemplate for imperative MongoDB operations using SimpleMongoClientDatabaseFactory. This approach is suitable for standard Java applications.

```java
public class MongoApplication {

  public static void main(String[] args) throws Exception {

    MongoOperations mongoOps = new MongoTemplate(new SimpleMongoClientDatabaseFactory(MongoClients.create(), "database"));

    // ...
  }
}
```

--------------------------------

### Reactive MongoTemplate Setup

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/configuration.adoc

Demonstrates how to instantiate ReactiveMongoTemplate for reactive MongoDB operations using SimpleReactiveMongoDatabaseFactory. This approach is suitable for reactive programming models.

```java
public class ReactiveMongoApplication {

  public static void main(String[] args) throws Exception {

    ReactiveMongoOperations mongoOps = new MongoTemplate(new SimpleReactiveMongoDatabaseFactory(MongoClients.create(), "database"));

    // ...
  }
}
```

--------------------------------

### Build and Install Spring Data MongoDB with Maven and Antora

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/README.adoc

This command uses Maven Wrapper (`mvnw`) to clean the project, install dependencies, and build the project with the 'antora' profile. It's typically used to generate project documentation.

```shell
$ ./mvnw clean install -Pantora

```

--------------------------------

### Define Person Class for MongoDB Persistence

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/getting-started.adoc

Defines a simple Java POJO class `Person` with fields for name and age, intended for persistence with Spring Data MongoDB. It includes getters and relies on field access for mapping.

```java
package example;

public class Person {

    private String id;

    private String name;

    private int age;

    public Person() {
    }

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public int getAge() {
        return this.age;
    }

    @Override
    public String toString() {
        return "Person [id=" + this.id + ", name=" + this.name + ", age=" + this.age + "]";
    }
}
```

--------------------------------

### Spring Data MongoDB Aggregation Pipeline Example

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

Illustrates building and executing a complex MongoDB aggregation pipeline using Spring Data MongoDB's fluent API. This example finds the biggest and smallest cities per state by population, demonstrating grouping, sorting, and projection operations.

```java
import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

TypedAggregation<ZipInfo> aggregation = newAggregation(ZipInfo.class,
    group("state", "city")
       .sum("population").as("pop"),
    sort(ASC, "pop", "state", "city"),
    group("state")
       .last("city").as("biggestCity")
       .last("pop").as("biggestPop")
       .first("city").as("smallestCity")
       .first("pop").as("smallestPop"),
    project()
       .and("state").previousOperation()
       .and("biggestCity")
          .nested(bind("name", "biggestCity").and("population", "biggestPop"))
       .and("smallestCity")
          .nested(bind("name", "smallestCity").and("population", "smallestPop")),
    sort(ASC, "state")
);

AggregationResults<ZipInfoStats> result = mongoTemplate.aggregate(aggregation, ZipInfoStats.class);
ZipInfoStats firstZipInfoStats = result.getMappedResults().get(0);
```

--------------------------------

### Build Spring Data MongoDB with Maven Wrapper

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/README.adoc

Command to clean and install the Spring Data MongoDB project using the Maven Wrapper. This is the recommended way to build the project from source.

```bash
$ ./mvnw clean install
```

--------------------------------

### MongoDB Document Example

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-mapreduce.adoc

Illustrates the structure of documents used in the Map-Reduce example, featuring an array of values associated with a key.

```json
{ "_id" : ObjectId("4e5ff893c0277826074ec533"), "x" : [ "a", "b" ] }
{ "_id" : ObjectId("4e5ff893c0277826074ec534"), "x" : [ "b", "c" ] }
{ "_id" : ObjectId("4e5ff893c0277826074ec535"), "x" : [ "c", "d" ] }
```

--------------------------------

### Wildcard Index MongoDB Equivalents

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-index-management.adoc

Provides the equivalent MongoDB shell commands for creating wildcard indexes as demonstrated in the Java examples. This helps understand the underlying database operations.

```javascript
db.user.createIndex({ "userMetadata.$**" : 1 }, {})
```

```javascript
db.product.createIndex({ "$**" : 1 },{})
```

```javascript
db.user.createIndex(
  { "$**" : 1 },
  { "wildcardProjection" :
    { "userMetadata.age" : 0 }
  }
)
```

```javascript
db.user.createIndex({ "userMetadata.$**" : 1 }, {})
```

--------------------------------

### Java Configuration with Authentication and Cluster Settings

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/configuration.adoc

Configures MongoClient settings, including authentication credentials and cluster host addresses, by extending AbstractMongoClientConfiguration. This allows for detailed client setup.

```java
@Configuration
public class MongoAppConfig extends AbstractMongoClientConfiguration {

  @Override
  public String getDatabaseName() {
    return "database";
  }

  @Override
  protected void configureClientSettings(Builder builder) {

    builder
        .credential(MongoCredential.createCredential("name", "db", "pwd".toCharArray()))
        .applyToClusterSettings(settings  -> {
          settings.hosts(singletonList(new ServerAddress("127.0.0.1", 27017)));
        });
  }
}
```

--------------------------------

### Run test.sh Locally with Docker

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/ci/README.adoc

Launches a Docker container with the Spring Data MongoDB source code mounted and executes the `test.sh` script. This allows for local debugging and testing of CI scripts before submitting pull requests. Requires Docker to be installed.

```shell
docker run -it --mount type=bind,source="$(pwd)",target=/spring-data-mongodb-github springci/spring-data-openjdk17-with-mongodb-5.0.3 /bin/bash
```

```shell
PROFILE=none spring-data-mongodb-github/ci/test.sh
```

--------------------------------

### Build Spring Data MongoDB Reference Documentation

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/README.adoc

This Bash command uses Maven to clean and install the Spring Data MongoDB project, specifically activating the 'Antora' profile to generate the reference documentation. This process builds the project without executing tests.

```bash
$ ./mvnw clean install -Pantora
```

--------------------------------

### Spring Data MongoDB Aggregation Example: Tag Count

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

An example demonstrating a common aggregation pipeline to count tag occurrences. It uses `project`, `unwind`, `group`, `sort`, and `previousOperation` to achieve the desired result.

```java
class TagCount {
 String tag;
 int n;
}
```

```java
import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

Aggregation agg = newAggregation(
    project("tags"),
    unwind("tags"),
    group("tags").count().as("n"),
    project("n").and("tag").previousOperation(),
    sort(DESC, "n")
);

AggregationResults<TagCount> results = mongoTemplate.aggregate(agg, "tags", TagCount.class);
List<TagCount> tagCount = results.getMappedResults();
```

--------------------------------

### Build Spring Data MongoDB with Maven Wrapper

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/README.adoc

This command uses the Maven wrapper (mvnw) to perform a clean build and install of the Spring Data MongoDB project. It ensures all dependencies are resolved and the project artifacts are built and installed into the local Maven repository.

```bash
$ ./mvnw clean install
```

--------------------------------

### Resume Change Stream with Server Time (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/change-streams.adoc

Demonstrates resuming a MongoDB Change Stream using server time in Spring Data MongoDB. It utilizes the `resumeAt` method with an `Instant` to specify the starting point. The example highlights obtaining server time via `getTimestamp` or `getResumeToken` and suggests using `BsonTimestamp` for greater precision.

```java
Flux<ChangeStreamEvent<User>> resumed = template.changeStream(User.class)
    .watchCollection("people")
    .resumeAt(Instant.now().minusSeconds(1)) <1>
    .listen();
```

--------------------------------

### XML: MongoClient with Advanced Client Settings

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/migration-guide/migration-guide-2.x-to-3.x.adoc

Configures a MongoDB client with advanced settings such as cluster connection mode, type, timeouts, and specific host configurations. This provides fine-grained control over the client's behavior and connection pooling.

```xml
<mongo:mongo.mongo-client id="client-with-settings" replica-set="rs0">
		<mongo:client-settings cluster-connection-mode="MULTIPLE"
																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																
```

--------------------------------

### Perform Untyped Query by Example in Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

This example demonstrates how to use UntypedExampleMatcher to bypass the default type restriction in Query by Example. This allows for flexible matching across different domain types as long as field names correspond.

```java
class JustAnArbitraryClassWithMatchingFieldName {
  @Field("lastname") String value;
}

JustAnArbitraryClassWithMatchingFieldNames probe = new JustAnArbitraryClassWithMatchingFieldNames();
probe.value = "stark";

Example example = Example.of(probe, UntypedExampleMatcher.matching());

Query query = new Query(new Criteria().alike(example));
List<Person> result = template.find(query, Person.class);
```

--------------------------------

### Spring Data MongoDB StringMatcher Options Reference

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

This section provides a reference for the StringMatcher options available in Spring Data MongoDB for Query by Example. It details each matching type, its case-sensitivity, and the corresponding MongoDB query syntax generated.

```APIDOC
Matching: DEFAULT (case-sensitive)
Logical result: {\"firstname\" : firstname}

Matching: DEFAULT (case-insensitive)
Logical result: {\"firstname\" : { $regex: firstname, $options: 'i'}}

Matching: EXACT (case-sensitive)
Logical result: {\"firstname\" : { $regex: /^firstname$/}}

Matching: EXACT (case-insensitive)
Logical result: {\"firstname\" : { $regex: /^firstname$/, $options: 'i'}}

Matching: STARTING (case-sensitive)
Logical result: {\"firstname\" : { $regex: /^firstname/}}

Matching: STARTING (case-insensitive)
Logical result: {\"firstname\" : { $regex: /^firstname/, $options: 'i'}}
```

--------------------------------

### XML Configuration for Mongo Database Factory

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/configuration.adoc

Configures a MongoDB database factory using XML-based Spring configuration. This is a simpler approach for basic setups, specifying the database name directly.

```xml
<mongo:db-factory dbname="database" />
```

--------------------------------

### Spring Data MongoDB Query and MapReduce Example (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-mapreduce.adoc

This example shows how to create a MongoDB query using Spring Data's fluent API and execute a MapReduce operation. It specifies input collections, JavaScript files for map and reduce functions, and output options. Note that while limit and sort can be applied, skipping values is not supported for this type of query.

```java
import org.springframework.data.mongodb.core.query.Query;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.mapreduce.MapReduceOptions.options;

// Assuming mongoOperations is an instance of MongoOperations
// Assuming ValueObject is a custom class for the result

Query query = new Query(where("x").ne(new String[] { "a", "b" }));
MapReduceResults<ValueObject> results = mongoOperations.mapReduce(query, "jmr1", "classpath:map.js", "classpath:reduce.js",
                                                                     options().outputCollection("jmr1_out"), ValueObject.class);

// Note: You can specify additional limit and sort values on the query, but you cannot skip values.
```

--------------------------------

### Query by Example (Untyped)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Enables Query by Example without strict type restrictions using `UntypedExampleMatcher`. This allows using arbitrary classes as probes as long as field names match, making it suitable for collections storing diverse entities or when type hints are omitted. It bypasses the default `_class` type restriction.

```java
class JustAnArbitraryClassWithMatchingFieldName {
  @Field("lastname") String value;
}

JustAnArbitraryClassWithMatchingFieldName probe = new JustAnArbitraryClassWithMatchingFieldName();
probe.value = "stark";

Example example = Example.of(probe, UntypedExampleMatcher.matching());

Query query = new Query(new Criteria().alike(example));
List<Person> result = template.find(query, Person.class);
```

--------------------------------

### MongoTemplate findAndModify Example

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Demonstrates how to use `findAndModify` to update a document, showing the difference between returning the old and new values, and how to use `FindAndModifyOptions`.

```java
template.insert(new Person("Tom", 21));
template.insert(new Person("Dick", 22));
template.insert(new Person("Harry", 23));

Query query = new Query(Criteria.where("firstName").is("Harry"));
Update update = new Update().inc("age", 1);

Person oldValue = template.update(Person.class)
  .matching(query)
  .apply(update)
  .findAndModifyValue(); // oldValue.age == 23

Person newValue = template.query(Person.class)
  .matching(query)
  .findOneValue(); // newValye.age == 24

Person newestValue = template.update(Person.class)
  .matching(query)
  .apply(update)
  .withOptions(FindAndModifyOptions.options().returnNew(true)) // Now return the newly updated document when updating
  .findAndModifyValue(); // newestValue.age == 25
```

--------------------------------

### Initialize MongoDB Replica Set

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/README.adoc

Steps to initialize a MongoDB replica set using the mongo shell. This is typically done once when starting the server for the first time. It configures the replica set with a single member.

```APIDOC
MongoDB Replica Set Initialization:

1. Start a mongo client:
   $MONGODB_HOME/bin/mongo

2. Initiate the replica set configuration:
   mongo> rs.initiate({ _id: 'rs0', members: [ { _id: 0, host: '127.0.0.1:27017' } ] })
```

--------------------------------

### MongoCustomConversions Configuration

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/property-converters.adoc

Provides an example of configuring MongoCustomConversions, including setting up PropertyValueConversions and registering converters programmatically via a PropertyValueConverterRegistrar.

```java
MongoCustomConversions.create(configurationAdapter -> {

    SimplePropertyValueConversions valueConversions = new SimplePropertyValueConversions();
    valueConversions.setConverterFactory(…);
    valueConversions.setValueConverterRegistry(new PropertyValueConverterRegistrar()
        .registerConverter(…)
        .buildRegistry());

    configurationAdapter.setPropertyValueConversions(valueConversions);
});
```

--------------------------------

### Applying Index Hints

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Shows how to apply index hints to queries using either the index name or its field definition. This helps optimize query performance by guiding MongoDB to use a specific index.

```java
template.query(Person.class)
    .matching(query("...").withHint("index-to-use"));

template.query(Person.class)
    .matching(query("...").withHint("{ firstname : 1 }"));
```

--------------------------------

### Package Project Locally with Docker (OpenJDK 8)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/CI.adoc

This sequence outlines how to package the project locally using Docker. It requires Docker installation. The steps include launching a Docker container with OpenJDK 8 and MongoDB 4.0, mounting the current directory, changing into the mounted directory, and executing Maven commands to clean, list dependencies, and package the project.

```shell
docker run -it --mount type=bind,source="$(pwd)",target=/spring-data-mongodb-github springci/spring-data-openjdk8-with-mongodb-4.0:latest /bin/bash
```

```shell
cd spring-data-mongodb-github
```

```shell
./mvnw clean dependency:list package -Dsort -Dbundlor.enabled=false -B
```

--------------------------------

### Configure GeoJSON Jackson Serializers

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/geo-json.adoc

Example Java configuration class to register GeoJSON serializers with Jackson using Spring Data's `SpringDataJacksonModules` interface. This is necessary for a symmetric setup as `GeoJsonModule` only registers deserializers by default.

```java
import com.fasterxml.jackson.databind.Module;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jackson.SpringDataJacksonModules;
import org.springframework.data.mongodb.core.geo.GeoJsonModule;

class GeoJsonConfiguration implements SpringDataJacksonModules {

	@Bean
	public Module geoJsonSerializers() {
		return GeoJsonModule.serializers();
	}
}
```

--------------------------------

### Imperative Evaluation Context Extension

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Provides an example of an imperative Spring Data MongoDB evaluation context extension. This class, `SampleEvaluationContextExtension`, extends `EvaluationContextExtensionSupport` to define custom properties for SpEL evaluation.

```java
public class SampleEvaluationContextExtension extends EvaluationContextExtensionSupport {

    @Override
    public String getExtensionId() {
        return "security";
    }

    @Override
    public Map<String, Object> getProperties() {
        return Collections.singletonMap("principal", SecurityContextHolder.getCurrent().getPrincipal());
    }
}
```

--------------------------------

### Query by Example (Typed)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Utilizes Spring Data MongoDB's Query by Example feature to construct queries based on a probe object. By default, it performs strictly typed matching, ensuring that the query restricts results to probe assignable types, such as a specific class like `Person`.

```java
Person probe = new Person();
probe.lastname = "stark";

Example example = Example.of(probe);

Query query = new Query(new Criteria().alike(example));
List<Person> result = template.find(query, Person.class);
```

--------------------------------

### Run CI Tests Locally with Docker (OpenJDK 17)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/CI.adoc

This sequence demonstrates how to run the Continuous Integration tests locally. It requires Docker to be installed. The process involves launching a Docker container with OpenJDK 17 and MongoDB 5.0.3, mounting the current directory as a volume, navigating into the mounted directory, and executing Maven commands to clean, list dependencies, and run tests.

```shell
docker run -it --mount type=bind,source="$(pwd)",target=/spring-data-mongodb-github springci/spring-data-openjdk17-with-mongodb-5.0.3:latest /bin/bash
```

```shell
cd spring-data-mongodb-github
```

```shell
./mvnw clean dependency:list test -Dsort -Dbundlor.enabled=false -B
```

--------------------------------

### Perform Typed Query by Example in Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

This snippet illustrates how to use Spring Data MongoDB's Query by Example feature with a strictly typed probe. By default, this approach includes a type match restriction, limiting results to assignable types.

```java
Person probe = new Person();
probe.lastname = "stark";

Example example = Example.of(probe);

Query query = new Query(new Criteria().alike(example));
List<Person> result = template.find(query, Person.class);
```

--------------------------------

### MongoTemplate findAndModify Example (findAndUpdate)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

An example demonstrating how to insert multiple 'Person' objects and then perform a findAndModify operation to increment the 'age' of a specific person. It shows how to retrieve both the old and the newly updated document values.

```java
template.insert(new Person("Tom", 21));
template.insert(new Person("Dick", 22));
template.insert(new Person("Harry", 23));

Query query = new Query(Criteria.where("firstName").is("Harry"));
Update update = new Update().inc("age", 1);

Person oldValue = template.update(Person.class)
  .matching(query)
  .apply(update)
  .findAndModifyValue(); // oldValue.age == 23

Person newValue = template.query(Person.class)
  .matching(query)
  .findOneValue(); // newValye.age == 24

Person newestValue = template.update(Person.class)
  .matching(query)
  .apply(update)
  .withOptions(FindAndModifyOptions.options().returnNew(true)) // Now return the newly updated document when updating
  .findAndModifyValue(); // newestValue.age == 25
```

--------------------------------

### Java DocumentReference Mapping Example

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/document-references.adoc

Shows how to map MongoDB documents using the @DocumentReference annotation, offering an alternative to DBRefs. This example defines relationships where referenced entities are stored by their _id.

```java
@Document
class Account {

  @Id
  String id;
  Float total;
}

@Document
class Person {

  @Id
  String id;

  @DocumentReference                                   <1>
  List<Account> accounts;
}
```

--------------------------------

### Imperative PersonRepository Query Methods

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Demonstrates defining query methods in an imperative Spring Data MongoDB repository. Shows examples for finding by last name, paginated results, querying by complex types, finding the first result, and streaming all results.

```java
public interface PersonRepository extends PagingAndSortingRepository<Person, String> {

    List<Person> findByLastname(String lastname);                      

    Page<Person> findByFirstname(String firstname, Pageable pageable); 

    Person findByShippingAddresses(Address address);                   

    Person findFirstByLastname(String lastname);                       

    Stream<Person> findAllBy();                                        
}
```

--------------------------------

### SpEL to MongoDB Projection Translation Example

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

Illustrates a complex SpEL expression and its corresponding translation into a MongoDB projection expression part, demonstrating the power of SpEL for dynamic data manipulation in aggregation queries.

```javascript
{
  "$add": [
    1,
    {
      "$divide": [
        {
          "$add": ["$q", 1]
        },
        {
          "$subtract": [
            "$q",
            1
          ]
        }
      ]
    }
  ]
}
```

--------------------------------

### Configuring MongoExceptionTranslator

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-api.adoc

Provides an example of configuring a custom MongoExceptionTranslator for a SimpleMongoClientDatabaseFactory to customize exception handling.

```java
ConnectionString uri = new ConnectionString("mongodb://username:password@localhost/database");
SimpleMongoClientDatabaseFactory mongoDbFactory = new SimpleMongoClientDatabaseFactory(uri);
mongoDbFactory.setExceptionTranslator(myCustomExceptionTranslator);
```

--------------------------------

### Reactive PersonRepository Query Methods

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Illustrates defining query methods for reactive Spring Data MongoDB repositories. Includes examples for finding by first name (with Publisher), paginated results with sorting, finding single entities, and finding the first entity.

```java
public interface ReactivePersonRepository extends ReactiveSortingRepository<Person, String> {

    Flux<Person> findByFirstname(String firstname);                                   

    Flux<Person> findByFirstname(Publisher<String> firstname);                        

    Flux<Person> findByFirstnameOrderByLastname(String firstname, Pageable pageable); 

    Mono<Person> findByFirstnameAndLastname(String firstname, String lastname);       

    Mono<Person> findFirstByLastname(String lastname);                                
}
```

--------------------------------

### Reactive Transactions with ReactiveMongoTransactionManager

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/client-session-transactions.adoc

Illustrates the setup for ReactiveMongoTransactionManager and ReactiveMongoTemplate in reactive Spring applications. It covers bean registration and applying @Transactional to reactive methods returning Mono or Flux.

```java
@Configuration
public class Config extends AbstractReactiveMongoConfiguration {

    @Bean
    ReactiveMongoTransactionManager transactionManager(ReactiveMongoDatabaseFactory factory) {  // <1>
        return new ReactiveMongoTransactionManager(factory);
    }

    @Bean
    ReactiveMongoTemplate reactiveMongoTemplate(ReactiveMongoDatabaseFactory dbFactory) {       // <1>
        return new ReactiveMongoTemplate(dbFactory);
    }

    // ...
}

@Service
public class StateService {

    @Transactional
    Mono<UpdateResult> someBusinessFunction(Step step) {                                  // <2>

        return template.insert(step)
            .then(process(step))
            .then(template.update(Step.class).apply(Update.set("state", …));
    };
});
```

--------------------------------

### Custom MongoDB Writing Converter (Person to Document)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/custom-conversions.adoc

Provides an example of a custom `Converter` implementation that converts a `Person` domain object into a `org.bson.Document` for MongoDB persistence.

```java
import org.springframework.core.convert.converter.Converter;
import org.bson.Document;

public class PersonWriteConverter implements Converter<Person, Document> {

  public Document convert(Person source) {
    Document document = new Document();
    document.put("_id", source.getId());
    document.put("name", source.getFirstName());
    document.put("age", source.getAge());
    return document;
  }
}
```

--------------------------------

### Spring Data MongoDB MongoEncryptionConverter Configuration

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-encryption.adoc

Illustrates the Spring configuration for setting up `MongoEncryptionConverter`, including `ClientEncryption` and `EncryptionKeyResolver` beans, and registering the converter factory. This setup is crucial for explicit Queryable Encryption.

```java
class Config extends AbstractMongoClientConfiguration {

    @Autowired ApplicationContext appContext;

    @Bean
    ClientEncryption clientEncryption() {                                                            
        ClientEncryptionSettings encryptionSettings = ClientEncryptionSettings.builder();
        // …

        return ClientEncryptions.create(encryptionSettings);
    }

    @Bean
    MongoEncryptionConverter encryptingConverter(ClientEncryption clientEncryption) {

        Encryption<BsonValue, BsonBinary> encryption = MongoClientEncryption.just(clientEncryption);
        EncryptionKeyResolver keyResolver = EncryptionKeyResolver.annotated((ctx) -> …);             

        return new MongoEncryptionConverter(encryption, keyResolver);                                
    }

    @Override
    protected void configureConverters(MongoConverterConfigurationAdapter adapter) {

        adapter
            .registerPropertyValueConverterFactory(PropertyValueConverterFactory.beanFactoryAware(appContext)); 
    }
}
```

--------------------------------

### Spring Data MongoDB Repository and Service Example

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/README.adoc

Demonstrates defining a `PersonRepository` interface extending `CrudRepository` for MongoDB operations, including custom query methods. It also shows a `MyService` class utilizing this repository for data persistence and retrieval, along with an `ApplicationConfig` class to enable MongoDB repositories.

```java
public interface PersonRepository extends CrudRepository<Person, Long> {

  List<Person> findByLastname(String lastname);

  List<Person> findByFirstnameLike(String firstname);
}

@Service
public class MyService {

  private final PersonRepository repository;

  public MyService(PersonRepository repository) {
    this.repository = repository;
  }

  public void doWork() {

    repository.deleteAll();

    Person person = new Person();
    person.setFirstname("Oliver");
    person.setLastname("Drotbohm");
    repository.save(person);

    List<Person> lastNameResults = repository.findByLastname("Drotbohm");
    List<Person> firstNameResults = repository.findByFirstnameLike("Oli*");
 }
}

@Configuration
@EnableMongoRepositories
class ApplicationConfig extends AbstractMongoClientConfiguration {

  @Override
  protected String getDatabaseName() {
    return "springdata";
  }
}
```

--------------------------------

### Type-safe MongoDB Queries with Querydsl (Reactive)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/repositories/core-extensions.adoc

Illustrates type-safe query execution for MongoDB within a reactive Spring Data application using Querydsl. This example shows how to retrieve entities asynchronously based on defined predicates.

```java
QPerson person = QPerson.person;

Flux<Person> result = repository.findAll(person.address.zipCode.eq("C0123"));
```

--------------------------------

### Type-safe MongoDB Queries with Querydsl (Imperative)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/repositories/core-extensions.adoc

Demonstrates how to perform type-safe queries against MongoDB using Querydsl in an imperative Spring Data context. It shows examples of finding entities by specific criteria and paginating results.

```java
QPerson person = QPerson.person;
List<Person> result = repository.findAll(person.address.zipCode.eq("C0123"));

Page<Person> page = repository.findAll(person.lastname.contains("a"),
                                       PageRequest.of(0, 2, Direction.ASC, "lastname"));
```

--------------------------------

### MongoTemplate Delete Operations

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Provides examples of different `remove` and `findAllAndRemove` methods to delete documents from a MongoDB collection based on an entity, query, or limit.

```java
template.remove(tywin, "GOT");                                              <1>

template.remove(query(where("lastname").is("lannister")), "GOT");           <2>

template.remove(new Query().limit(3), "GOT");                               <3>

template.findAllAndRemove(query(where("lastname").is("lannister"), "GOT");  <4>

template.findAllAndRemove(new Query().limit(3), "GOT");                     <5>
```

--------------------------------

### MongoDB Facet Aggregation Example

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

Demonstrates the use of the facet aggregation operator in Spring Data MongoDB to perform multiple aggregation pipelines on a single document. It includes grouping and sorting operations within the facet.

```java
facet(match(Criteria.where("country").exists(true)), sortByCount("country")).as("categorizedByCountry"))
```

```java
facet(project("title").and("publicationDate").extractYear().as("publicationYear"),
      bucketAuto("publicationYear", 5).andOutput("title").push().as("titles"))
  .as("categorizedByYear")
```

--------------------------------

### MongoDB _id Field Mapping Examples

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping.adoc

Illustrates how Java field definitions and annotations translate to the `_id` field name in MongoDB documents, showing precedence rules.

```APIDOC
Field definition
| Resulting Id-Fieldname in MongoDB

| `String` id
| `_id`

| `@Field` `String` id
| `_id`

| `@Field("x")` `String` id
| `x`

| `@Id` `String` x
| `_id`

| `@Field("x")` `@Id` `String` y
| `_id` (`@Field(name)` is ignored, `@Id` takes precedence)
```

--------------------------------

### Repository Query for GeoJSON Polygon

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Defines a repository method `findByLocationWithin` that accepts a `Polygon` and generates a GeoJSON query using the `$geometry` operator. Includes examples for both GeoJSON and legacy polygon formats.

```java
public interface StoreRepository extends CrudRepository<Store, String> {

	List<Store> findByLocationWithin(Polygon polygon); 
}
```

```json
{
  "location": {
    "$geoWithin": {
      "$geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [-73.992514,40.758934],
            [-73.961138,40.760348],
            [-73.991658,40.730006],
            [-73.992514,40.758934]
          ]
        ]
      }
    }
  }
}
```

```java
repo.findByLocationWithin(
  new GeoJsonPolygon(
    new Point(-73.992514, 40.758934),
    new Point(-73.961138, 40.760348),
    new Point(-73.991658, 40.730006),
    new Point(-73.992514, 40.758934)));
```

```json
{
  "location" : {
    "$geoWithin" : {
       "$polygon" : [ [-73.992514,40.758934] , [-73.961138,40.760348] , [-73.991658,40.730006] ]
    }
  }
}
```

```java
repo.findByLocationWithin(
  new Polygon(
    new Point(-73.992514, 40.758934),
    new Point(-73.961138, 40.760348),
    new Point(-73.991658, 40.730006)));
```

--------------------------------

### Run build.sh Locally with Docker

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/ci/README.adoc

Sets up a Docker environment to run the `build.sh` script locally. It mounts the project source code and a temporary directory for build artifacts. This process allows testing build scripts and observing artifact generation without actual deployment to Artifactory. Requires Docker.

```shell
mkdir /tmp/spring-data-mongodb-artifactory
```

```shell
docker run -it --mount type=bind,source="$(pwd)",target=/spring-data-mongodb-github --mount type=bind,source="/tmp/spring-data-mongodb-artifactory",target=/spring-data-mongodb-artifactory springci/spring-data-openjdk17-with-mongodb-5.0.3 /bin/bash
```

```shell
spring-data-mongodb-github/ci/build.sh
```

--------------------------------

### MongoTemplate Collection Operations

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-collection-management.adoc

Lists common operations provided by `MongoTemplate` for managing MongoDB collections. These include getting collection names, checking existence, creating, dropping, and retrieving collections.

```APIDOC
MongoTemplate Collection Methods:
  getCollectionNames(): Set<String>
    Returns a set of all collection names in the database.
  collectionExists(String collectionName): boolean
    Checks if a collection with the given name exists.
  createCollection(String collectionName): MongoCollection<Document>
    Creates an uncapped collection with the specified name.
  dropCollection(String collectionName): void
    Drops the collection with the specified name.
  getCollection(String collectionName): MongoCollection<Document>
    Gets a collection by name, creating it if it does not exist.
```

--------------------------------

### Applying Collation with @Collation Annotation

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

This example demonstrates the usage of the @Collation meta-annotation. It can be applied to domain classes and repository methods, providing a concise way to define collation. The snippet also highlights that @Collation takes precedence over @Query's collation definition.

```Java
@Collation("en_US")
class Game {
  // ...
}

interface GameRepository extends Repository<Game, String> {

  @Collation("en_GB")
  List<Game> findByTitle(String title);

  @Collation("de_AT")
  @Query(collation="en_GB")
  List<Game> findByDescriptionContaining(String keyword);
}
```

--------------------------------

### Configure MongoDB Repositories via XML

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/repositories.adoc

Demonstrates configuring Spring Data MongoDB repositories and a `MongoTemplate` bean using XML configuration. It sets up a MongoDB client and specifies the base package for repository scanning.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:mongo="http://www.springframework.org/schema/data/mongo"
  xsi:schemaLocation="http://www.springframework.org/schema/beans
    https://www.springframework.org/schema/beans/spring-beans-3.0.xsd
    http://www.springframework.org/schema/data/mongo
    https://www.springframework.org/schema/data/mongo/spring-mongo-1.0.xsd">

  <mongo:mongo-client id="mongoClient" />

  <bean id="mongoTemplate" class="org.springframework.data.mongodb.core.MongoTemplate">
    <constructor-arg ref="mongoClient" />
    <constructor-arg value="databaseName" />
  </bean>

  <mongo:repositories base-package="com.acme.*.repositories" />

</beans>
```

--------------------------------

### Spring Data MongoDB Result Projection Example

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Illustrates how to project query results onto a different domain type using the `as()` method in Spring Data MongoDB. This allows mapping query results to a DTO or a different model.

```java
class SWCharacter {
    // ... fields ...
}

class Jedi {
    // ... fields mapped from SWCharacter ...
}

// Project query results from SWCharacter.class to Jedi.class
template.query(SWCharacter.class)
    .as(Jedi.class);
```

--------------------------------

### Java DBRef Mapping Example

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/document-references.adoc

Demonstrates mapping MongoDB documents with relationships using the @DBRef annotation. It shows how to define parent and child documents, where the child documents are referenced via DBRefs.

```java
@Document
public class Account {

  @Id
  private ObjectId id;
  private Float total;
}

@Document
public class Person {

  @Id
  private ObjectId id;
  @Indexed
  private Integer ssn;
  @DBRef
  private List<Account> accounts;
}
```

--------------------------------

### Configure Reactive EntityCallbacks in MongoTemplate (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-config.adoc

Enables setting custom `EntityCallbacks` for the reactive `ReactiveMongoTemplate`. This allows for reactive custom logic during entity lifecycle events. The example shows how to create and set these callbacks using `ReactiveEntityCallbacks.create(...)`.

```java
@Bean
ReactiveMongoOperations mongoTemplate(MongoClient mongoClient) {
    ReactiveMongoTemplate template = new ReactiveMongoTemplate(mongoClient, "...");
	template.setEntityCallbacks(ReactiveEntityCallbacks.create(...));
	// ...
}
```

--------------------------------

### Full-text Search Document Example

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Illustrates a Spring Data MongoDB entity class, `FullTextDocument`, annotated for full-text search. It includes an `@Id` field and is intended to be used with a document that has a text index.

```java
@Document
class FullTextDocument {

  @Id String id;
  // Other fields would follow...
```

--------------------------------

### Spring Data MongoDB Full-Text Search

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Demonstrates how to perform full-text searches using TextCriteria and integrate dynamic sorting and pagination with Spring Data MongoDB repositories. It shows examples of finding documents based on text criteria and ordering results.

```java
interface FullTextRepository extends Repository<FullTextDocument, String> {

  // Execute a full-text search and define sorting dynamically
  List<FullTextDocument> findAllBy(TextCriteria criteria, Sort sort);

  // Paginate over a full-text search result
  Page<FullTextDocument> findAllBy(TextCriteria criteria, Pageable pageable);

  // Combine a derived query with a full-text search
  List<FullTextDocument> findByTitleOrderByScoreDesc(String title, TextCriteria criteria);
}

// Example Usage:
Sort sort = Sort.by("score");
TextCriteria criteria = TextCriteria.forDefaultLanguage().matchingAny("spring", "data");
List<FullTextDocument> result = repository.findAllBy(criteria, sort);

criteria = TextCriteria.forDefaultLanguage().matching("film");
Page<FullTextDocument> page = repository.findAllBy(criteria, PageRequest.of(1, 1, sort));
List<FullTextDocument> result = repository.findByTitleOrderByScoreDesc("mongodb", criteria);
```

--------------------------------

### Batch and Bulk Inserts in Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Provides examples for performing batch and bulk inserts of multiple documents into MongoDB using Spring Data MongoDB. It includes imperative and reactive variations for both batch and bulk operations.

```java
Collection<Person> inserted = template.insert(List.of(...), Person.class);
```

```java
Flux<Person> inserted = template.insert(List.of(...), Person.class);
```

```java
BulkWriteResult result = template.bulkOps(BulkMode.ORDERED, Person.class)
    .insert(List.of(...))
    .execute();
```

```java
Mono<BulkWriteResult> result = template.bulkOps(BulkMode.ORDERED, Person.class)
    .insert(List.of(...))
    .execute();
```

--------------------------------

### Configure Imperative EntityCallbacks in MongoTemplate (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-config.adoc

Allows setting custom `EntityCallbacks` for the imperative `MongoTemplate`. This enables custom logic to be executed during entity lifecycle events. The example demonstrates how to create and set these callbacks using `EntityCallbacks.create(...)`.

```java
@Bean
MongoOperations mongoTemplate(MongoClient mongoClient) {
    MongoTemplate template = new MongoTemplate(mongoClient, "...");
	template.setEntityCallbacks(EntityCallbacks.create(...));
	// ...
}
```

--------------------------------

### Spring Data MongoDB Aggregation: Conditional Projection

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

Illustrates conditional projection using `applyCondition` to calculate a 'discount' based on 'qty' (greater than or equal to 250) and a second conditional projection for the 'description' field using `ifNull`. This example shows how to transform and enrich documents based on specific criteria within the aggregation pipeline.

```Java
import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

TypedAggregation<InventoryItem> agg = newAggregation(InventoryItem.class,
  project("item").and("discount")
    .applyCondition(ConditionalOperator.newBuilder().when(Criteria.where("qty").gte(250))
      .then(30)
      .otherwise(20))
    .and(ifNull("description", "Unspecified")).as("description")
);

AggregationResults<InventoryItemProjection> result = mongoTemplate.aggregate(agg, "inventory", InventoryItemProjection.class);
List<InventoryItemProjection> stateStatsList = result.getMappedResults();
```

--------------------------------

### Spring Data MongoDB Geo-spatial Queries (Imperative Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Imperative Java examples for Spring Data MongoDB geo-spatial queries. Demonstrates repository methods for finding entities near a point with distance constraints and within various geographical shapes.

```java
public interface PersonRepository extends MongoRepository<Person, String> {

    // { 'location' : { '$near' : [point.x, point.y], '$maxDistance' : distance } }
    List<Person> findByLocationNear(Point location, Distance distance);

    // { 'location' : { $geoWithin: { $center: [ [ circle.center.x, circle.center.y ], circle.radius ] } } }
    List<Person> findByLocationWithin(Circle circle);

    // { 'location' : { $geoWithin: { $box: [ [ box.first.x, box.first.y ], [ box.second.x, box.second.y ] ] } } }
    List<Person> findByLocationWithin(Box box);

    // { 'location' : { $geoWithin: { $polygon: [ [ polygon.x1, polygon.y1 ], [ polygon.x2, polygon.y2 ], ... ] } } }
    List<Person> findByLocationWithin(Polygon polygon);

    // { 'location' : { $geoWithin: { $geometry: { $type : 'polygon', coordinates: [[ polygon.x1, polygon.y1 ], [ polygon.x2, polygon.y2 ], ... ] } } } }
    List<Person> findByLocationWithin(GeoJsonPolygon polygon);
}
```

--------------------------------

### Configuring Custom MongoTypeMapper

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/converters-type-mapping.adoc

Shows how to configure a custom `MongoTypeMapper` within `MappingMongoConverter` to customize type mapping behavior. Includes examples for both Java configuration and XML bean definition.

```Java
@Configuration
class SampleMongoConfiguration extends AbstractMongoClientConfiguration {

  @Override
  protected String getDatabaseName() {
    return "database";
  }

  @Bean
  @Override
  public MappingMongoConverter mappingMongoConverter(MongoDatabaseFactory databaseFactory,
			MongoCustomConversions customConversions, MongoMappingContext mappingContext) {
    MappingMongoConverter mmc = super.mappingMongoConverter();
    mmc.setTypeMapper(customTypeMapper());
    return mmc;
  }

  @Bean
  public MongoTypeMapper customTypeMapper() {
    return new CustomMongoTypeMapper();
  }
}
```

```XML
<mongo:mapping-converter type-mapper-ref="customMongoTypeMapper"/>

<bean name="customMongoTypeMapper" class="com.acme.CustomMongoTypeMapper"/>
```

--------------------------------

### Configure MongoTemplate with Imperative, Reactive, and XML

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-config.adoc

Demonstrates how to instantiate and register `MongoTemplate` and `ReactiveMongoTemplate` using Java configuration (imperative and reactive) and XML configuration. It shows setting up a `MongoClient` and specifying the database name.

```java
@Configuration
class ApplicationConfiguration {

  @Bean
  MongoClient mongoClient() {
      return MongoClients.create("mongodb://localhost:27017");
  }

  @Bean
  MongoOperations mongoTemplate(MongoClient mongoClient) {
      return new MongoTemplate(mongoClient, "geospatial");
  }
}
```

```java
@Configuration
class ReactiveApplicationConfiguration {

  @Bean
  MongoClient mongoClient() {
      return MongoClients.create("mongodb://localhost:27017");
  }

  @Bean
  ReactiveMongoOperations mongoTemplate(MongoClient mongoClient) {
      return new ReactiveMongoTemplate(mongoClient, "geospatial");
  }
}
```

```xml
<mongo:mongo-client host="localhost" port="27017" />

<bean id="mongoTemplate" class="org.springframework.data.mongodb.core.MongoTemplate">
  <constructor-arg ref="mongoClient" />
  <constructor-arg name="databaseName" value="geospatial" />
</bean>
```

--------------------------------

### Spring Data MongoDB: Stream Aggregation Results (Basic Grouping)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Allows aggregation methods to return a `Stream` to consume results directly from an underlying cursor. This example groups first names by last name.

```java
@Aggregation("{ $group: { _id : $lastname, names : { $addToSet : $firstname } } }")
  Stream<PersonAggregate> groupByLastnameAndFirstnamesAsStream();
```

--------------------------------

### MongoDB Aggregation: Group, Sort, Match States by Population (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

This example demonstrates grouping states by population, sorting the results, and filtering for states with over 10 million people. It showcases the use of `group`, `sort`, and `match` operations within the Spring Data MongoDB Aggregation Framework.

```java
class StateStats {
   @Id String id;
   String state;
   @Field("totalPop") int totalPopulation;
}
```

```java
import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

TypedAggregation<ZipInfo> agg = newAggregation(ZipInfo.class,
    group("state").sum("population").as("totalPop"),
    sort(ASC, previousOperation(), "totalPop"),
    match(where("totalPop").gte(10 * 1000 * 1000))
);

AggregationResults<StateStats> result = mongoTemplate.aggregate(agg, StateStats.class);
List<StateStats> stateStatsList = result.getMappedResults();
```

--------------------------------

### MongoTemplate findAndModify Example (upsert)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Illustrates using findAndModify with FindAndModifyOptions to perform an upsert operation. If the document does not exist, it will be inserted, and the operation is configured to return the newly updated document.

```java
Person upserted = template.update(Person.class)
  .matching(new Query(Criteria.where("firstName").is("Mary")))
  .apply(update)
  .withOptions(FindAndModifyOptions.options().upsert(true).returnNew(true))
  .findAndModifyValue()
```

--------------------------------

### MongoDB Aggregation: Arithmetic Projection with Simple Operations (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

This example illustrates how to perform simple arithmetic operations directly within the projection stage of a MongoDB aggregation pipeline using Spring Data MongoDB. It demonstrates adding, subtracting, multiplying, dividing, and modulo operations on fields.

```java
class Product {
    String id;
    String name;
    double netPrice;
    int spaceUnits;
}
```

```java
import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

TypedAggregation<Product> agg = newAggregation(Product.class,
    project("name", "netPrice")
        .and("netPrice").plus(1).as("netPricePlus1")
        .and("netPrice").minus(1).as("netPriceMinus1")
        .and("netPrice").multiply(1.19).as("grossPrice")
        .and("netPrice").divide(2).as("netPriceDiv2")
        .and("spaceUnits").mod(2).as("spaceUnitsMod2")
);

AggregationResults<Document> result = mongoTemplate.aggregate(agg, Document.class);
List<Document> resultList = result.getMappedResults();
```

--------------------------------

### Spring Data MongoDB Geo-spatial Queries (Reactive Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Reactive Java examples for Spring Data MongoDB geo-spatial queries. Demonstrates reactive repository methods for finding entities near a point with distance constraints and within various geographical shapes.

```java
interface PersonRepository extends ReactiveMongoRepository<Person, String> {

    // { 'location' : { '$near' : [point.x, point.y], '$maxDistance' : distance } }
    Flux<Person> findByLocationNear(Point location, Distance distance);

    // { 'location' : { $geoWithin: { $center: [ [ circle.center.x, circle.center.y ], circle.radius ] } } }
    Flux<Person> findByLocationWithin(Circle circle);

    // { 'location' : { $geoWithin: { $box: [ [ box.first.x, box.first.y ], [ box.second.x, box.second.y ] ] } } }
    Flux<Person> findByLocationWithin(Box box);

    // { 'location' : { $geoWithin: { $polygon: [ [ polygon.x1, polygon.y1 ], [ polygon.x2, polygon.y2 ], ... ] } } }
    Flux<Person> findByLocationWithin(Polygon polygon);

    // { 'location' : { $geoWithin: { $geometry: { $type : 'polygon', coordinates: [[ polygon.x1, polygon.y1 ], [ polygon.x2, polygon.y2 ], ... ] } } } }
    Flux<Person> findByLocationWithin(GeoJsonPolygon polygon);
}
```

--------------------------------

### Programmatic Transaction Control (Imperative Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/client-session-transactions.adoc

Demonstrates manual transaction management in Spring Data MongoDB using the imperative Java model. It shows how to obtain a ClientSession, start, commit, and abort transactions, and ensures the session is closed properly.

```java
ClientSession session = client.startSession(options);                   <1>

template.withSession(session)
    .execute(action -> {

        session.startTransaction();                                     <2>

        try {

            Step step = // ...; // Example step object
            action.insert(step);

            process(step);

            action.update(Step.class).apply(Update.set("state", // ...

            session.commitTransaction();                                <3>

        } catch (RuntimeException e) {
            session.abortTransaction();                                 <4>
        }
    }, ClientSession::close)                                            <5>
```

--------------------------------

### Register MongoClient via FactoryBean (Java Config - Reactive)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/configuration.adoc

Configures a reactive `MongoClient` using Spring's `ReactiveMongoClientFactoryBean` via Java-based bean metadata. This `FactoryBean` facilitates the creation of a reactive MongoDB client instance.

```java
@Configuration
public class AppConfig {

    /*
     * Factory bean that creates the com.mongodb.reactivestreams.client.MongoClient instance
     */
     public @Bean ReactiveMongoClientFactoryBean mongo() {
          ReactiveMongoClientFactoryBean mongo = new ReactiveMongoClientFactoryBean();
          mongo.setHost("localhost");
          return mongo;
     }
}
```

--------------------------------

### Using Distance with Metrics in Geo-spatial Queries

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Example demonstrating the use of `Distance` with `Metrics` (e.g., KILOMETERS) in Spring Data MongoDB geo-spatial queries. This automatically switches the query to use `$nearSphere` for calculations on a spherical model.

```java
Point point = new Point(43.7, 48.8);
Distance distance = new Distance(200, Metrics.KILOMETERS);
… = repository.findByLocationNear(point, distance);
```

--------------------------------

### Define Compound Index with @CompoundIndex (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-index-management.adoc

Illustrates how to define a compound index at the class level using the @CompoundIndex annotation. This example creates an index on 'lastName' in ascending order and 'age' in descending order for the Person entity.

```java
package com.mycompany.domain;

@Document
@CompoundIndex(name = "age_idx", def = "{'lastName': 1, 'age': -1}")
public class Person {

  @Id
  private ObjectId id;
  private Integer age;
  private String firstName;
  private String lastName;

}
```

--------------------------------

### Spring Data MongoDB: Create Custom Annotation for Aggregation Options

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

This example illustrates how to define a custom annotation, @AllowDiskUse, by composing the @Meta annotation. This approach promotes code readability and reusability, allowing developers to apply common aggregation options semantically across multiple repository methods.

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.METHOD })
@Meta(allowDiskUse = true)
@interface AllowDiskUse { }

interface PersonRepository extends CrudRepository<Person, String> {

  @AllowDiskUse
  @Aggregation("{ $group: { _id : $lastname, names : { $addToSet : $firstname } } }")
  List<PersonAggregate> groupByLastnameAndFirstnames();
}
```

--------------------------------

### Configure Imperative MongoDB Repositories (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/repositories.adoc

Shows how to configure Spring Data MongoDB repositories for imperative applications using the `@EnableMongoRepositories` annotation and extending `AbstractMongoClientConfiguration`. It specifies the database name and mapping base package.

```java
@Configuration
@EnableMongoRepositories("com.acme.*.repositories")
class ApplicationConfig extends AbstractMongoClientConfiguration {

  @Override
  protected String getDatabaseName() {
    return "e-store";
  }

  @Override
  protected String getMappingBasePackage() {
    return "com.acme.*.repositories";
  }
}
```

--------------------------------

### Java Group Operation with Criteria and External JavaScript Resources

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-group.adoc

This Java example demonstrates an advanced MongoDB group operation using `mongoTemplate.group`. It applies a `Criteria` (`where("x").gt(0)`) to filter documents before grouping. Instead of inline JavaScript, it references external JavaScript files (`classpath:keyFunction.js` and `classpath:groupReduce.js`) for the `keyFunction` and `reduceFunction` using Spring's Resource abstraction, showcasing how to externalize code.

```Java
import static org.springframework.data.mongodb.core.mapreduce.GroupBy.keyFunction;
import static org.springframework.data.mongodb.core.query.Criteria.where;

GroupByResults<XObject> results = mongoTemplate.group(where("x").gt(0),
                                        "group_test_collection",
                                        keyFunction("classpath:keyFunction.js").initialDocument("{ count: 0 }").reduceFunction("classpath:groupReduce.js"), XObject.class);
```

--------------------------------

### Sorting by Unwrapped Object Fields

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/unwrapping-entities.adoc

Explains how to sort documents based on fields within an unwrapped object. The example shows using the property path of the unwrapped field in the sort criteria.

```java
Query findByUserLastName = query(where("name.lastname").is("Romanoff"));
List<User> user = template.findAll(findByUserLastName.withSort(Sort.by("name.firstname")), User.class);
```

--------------------------------

### Define Multiple Compound Indexes with @CompoundIndexes (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-index-management.adoc

Shows how to define multiple compound indexes on a single entity using the repeatable @CompoundIndexes annotation. This example defines two distinct compound indexes for the Person entity.

```java
@Document
@CompoundIndex(name = "cmp-idx-one", def = "{'firstname': 1, 'lastname': -1}")
@CompoundIndex(name = "cmp-idx-two", def = "{'address.city': -1, 'address.street': 1}")
public class Person {

  String firstname;
  String lastname;

  Address address;

  // ...
}
```

--------------------------------

### Spring Data MongoDB Map-Reduce with Static Import Options

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-mapreduce.adoc

Demonstrates a more concise syntax for configuring Map-Reduce options, specifically setting the output collection, by using a static import for `MapReduceOptions.options()`.

```java
import static org.springframework.data.mongodb.core.mapreduce.MapReduceOptions.options;

MapReduceResults<ValueObject> results = mongoOperations.mapReduce("jmr1", "classpath:map.js", "classpath:reduce.js",
                                                                     options().outputCollection("jmr1_out"), ValueObject.class);
```

--------------------------------

### Spring Data MongoDB Field Selection Example

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Demonstrates how to select specific fields to include or exclude in MongoDB query results using the Query class. It shows selecting top-level fields, nested fields, and excluding the default '_id' field.

```java
public class Person {

    @Id String id;
    String firstname;

    @Field("last_name")
    String lastname;

    Address address;
}

// Include only 'lastname'
query.fields().include("lastname"); 
// Result projection: { "_id" : 1, "last_name" : 1 }

// Exclude 'id' and include 'lastname'
query.fields().exclude("id").include("lastname") 
// Result projection: { "_id" : 0, "last_name" : 1 }

// Include the entire 'address' object
query.fields().include("address") 
// Result projection: { "_id" : 1, "address" : 1 }

// Include only the 'city' field within the 'address' object
query.fields().include("address.city") 
// Result projection: { "_id" : 1, "address.city" : 1 }
```

--------------------------------

### Spring Data MongoDB: Updating an Entire Unwrapped Object

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/unwrapping-entities.adoc

Demonstrates how to update an entire unwrapped object in Spring Data MongoDB, replacing all its fields. Examples are provided for both Java API and the corresponding MongoDB shell command.

```java
Update update = new Update().set("name", new Name("Janet", "van Dyne"));
template.update(User.class).matching(where("id").is("Wasp"))
   .apply(update).first()
```

```json
db.collection.update({
  "_id" : "Wasp"
},
{
  "$set" : {
    "firstname" : "Janet",
    "lastname" : "van Dyne"
  }
},
{ ... }
)
```

--------------------------------

### Register MongoClient (Java Config - Imperative)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/configuration.adoc

Configures a `MongoClient` instance using Java-based bean metadata for imperative Spring applications. This approach leverages the standard Mongo driver API and Spring's `@Configuration` and `@Bean` annotations.

```java
@Configuration
public class AppConfig {

  /*
   * Use the standard Mongo driver API to create a com.mongodb.client.MongoClient instance.
   */
   public @Bean com.mongodb.client.MongoClient mongoClient() {
       return com.mongodb.client.MongoClients.create("mongodb://localhost:27017");
   }
}
```

--------------------------------

### Complex Person Class Mapping Example

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping.adoc

Demonstrates a complex mapping scenario for a `Person` class using various Spring Data MongoDB annotations. It includes document definition, indexing, field mapping, DBRef, transient fields, and a specific constructor marked with @PersistenceCreator.

```java
@Document
@CompoundIndex(name = "age_idx", def = "{'lastName': 1, 'age': -1}")
public class Person<T extends Address> {

  @Id
  private String id;

  @Indexed(unique = true)
  private Integer ssn;

  @Field("fName")
  private String firstName;

  @Indexed
  private String lastName;

  private Integer age;

  @Transient
  private Integer accountTotal;

  @DBRef
  private List<Account> accounts;

  private T address;

  public Person(Integer ssn) {
    this.ssn = ssn;
  }

  @PersistenceCreator
  public Person(Integer ssn, String firstName, String lastName, Integer age, T address) {
    this.ssn = ssn;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.address = address;
  }

  public String getId() {
    return id;
  }

  // no setter for Id.  (getter is only exposed for some unit testing)

  public Integer getSsn() {
    return ssn;
  }

// other getters/setters omitted
}
```

--------------------------------

### Define Phrases in Spring Data MongoDB Full-Text Query

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

This example demonstrates two ways to search for exact phrases in a full-text query. Phrases can be defined by enclosing them in double quotation marks within matching() or by using the dedicated phrase() method on TextCriteria.

```java
// search for phrase 'coffee cake'
TextQuery.queryText(new TextCriteria().matching("\"coffee cake\""));
TextQuery.queryText(new TextCriteria().phrase("coffee cake"));
```

--------------------------------

### Configure Spring Data MongoDB Entity Callbacks (Imperative and Reactive)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-config.adoc

This example demonstrates how to configure `EntityCallbacks` for both imperative and reactive `MongoTemplate` instances. Entity callbacks provide a mechanism to intercept and modify entities during their lifecycle, offering a flexible alternative or complement to traditional lifecycle events in Spring Data MongoDB.

```java
@Bean
MongoOperations mongoTemplate(MongoClient mongoClient) {
    MongoTemplate template = new MongoTemplate(mongoClient, "...");
	template.setEntityCallbacks(EntityCallbacks.create(...));
	// ...
}
```

```java
@Bean
ReactiveMongoOperations mongoTemplate(MongoClient mongoClient) {
    ReactiveMongoTemplate template = new ReactiveMongoTemplate(mongoClient, "...");
	template.setEntityCallbacks(ReactiveEntityCallbacks.create(...));
	// ...
}
```

--------------------------------

### Java Configuration for ReactiveMongoDatabaseFactory

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/configuration.adoc

Configures a ReactiveMongoDatabaseFactory bean using Java-based Spring configuration. This involves creating a SimpleReactiveMongoDatabaseFactory with a MongoClient and database name.

```java
@Configuration
public class ReactiveMongoConfiguration {

  @Bean
  public ReactiveMongoDatabaseFactory mongoDatabaseFactory() {
    return new SimpleReactiveMongoDatabaseFactory(MongoClients.create(), "database");
  }
}
```

--------------------------------

### Example Domain Object

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping.adoc

Demonstrates a simple domain object annotated for MongoDB mapping. The @Document annotation marks the class for persistence, @Id specifies the primary key field, and @Indexed indicates fields that should have indexes created for faster queries. Automatic index creation is disabled by default.

```java
package com.mycompany.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ObjectId;

@Document
public class Person {

  @Id
  private ObjectId id;

  @Indexed
  private Integer ssn;

  private String firstName;

  @Indexed
  private String lastName;
}
```

--------------------------------

### MongoDB Aggregation: Arithmetic Projection with SpEL Expressions (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

This example shows how to leverage Spring Expression Language (SpEL) for more complex arithmetic operations within the projection stage of a MongoDB aggregation pipeline. It allows for dynamic calculation of new fields based on existing ones.

```java
class Product {
    String id;
    String name;
    double netPrice;
    int spaceUnits;
}
```

```java
import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

TypedAggregation<Product> agg = newAggregation(Product.class,
    project("name", "netPrice")
        .andExpression("netPrice + 1").as("netPricePlus1")
        .andExpression("netPrice - 1").as("netPriceMinus1")
        .andExpression("netPrice / 2").as("netPriceDiv2")
        .andExpression("netPrice * 1.19").as("grossPrice")
        .andExpression("spaceUnits % 2").as("spaceUnitsMod2")
        .andExpression("(netPrice * 0.8  + 1.2) * 1.19").as("grossPriceIncludingDiscountAndCharge")

);

AggregationResults<Document> result = mongoTemplate.aggregate(agg, Document.class);
List<Document> resultList = result.getMappedResults();
```

--------------------------------

### Check Index Existence using Execute Callback

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-api.adoc

An example demonstrating how to use the `execute` callback with a `CollectionCallback` to check for the existence of a specific index ('location_2d') on a MongoDB collection named 'geolocation'. It shows both imperative and reactive approaches.

```java
boolean hasIndex = template.execute("geolocation", collection ->
    Streamable.of(collection.listIndexes(org.bson.Document.class))
        .stream()
        .map(document -> document.get("name"))
        .anyMatch("location_2d"::equals)
);
```

```java
Mono<Boolean> hasIndex = template.execute("geolocation", collection ->
    Flux.from(collection.listIndexes(org.bson.Document.class))
        .map(document -> document.get("name"))
        .filterWhen(name -> Mono.just("location_2d".equals(name)))
        .map(it -> Boolean.TRUE)
        .single(Boolean.FALSE)
    ).next();
```

--------------------------------

### Configuring a Custom MongoTypeMapper

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/converters-type-mapping.adoc

Illustrates how to integrate a custom MongoTypeMapper into Spring Data MongoDB's MappingMongoConverter. The examples show both Java-based configuration, overriding the mappingMongoConverter bean in AbstractMongoClientConfiguration, and the equivalent XML configuration using type-mapper-ref.

```Java
@Configuration
class SampleMongoConfiguration extends AbstractMongoClientConfiguration {

  @Override
  protected String getDatabaseName() {
    return "database";
  }

  @Bean
  @Override
  public MappingMongoConverter mappingMongoConverter(MongoDatabaseFactory databaseFactory,
			MongoCustomConversions customConversions, MongoMappingContext mappingContext) {
    MappingMongoConverter mmc = super.mappingMongoConverter();
    mmc.setTypeMapper(customTypeMapper());
    return mmc;
  }

  @Bean
  public MongoTypeMapper customTypeMapper() {
    return new CustomMongoTypeMapper();
  }
}
```

```XML
<mongo:mapping-converter type-mapper-ref="customMongoTypeMapper"/>

<bean name="customMongoTypeMapper" class="com.acme.CustomMongoTypeMapper"/>
```

--------------------------------

### Register MongoClient (Java Config - Reactive)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/configuration.adoc

Configures a reactive `MongoClient` instance using Java-based bean metadata for reactive Spring applications. This method uses Spring's `@Configuration` and `@Bean` annotations with the reactive driver.

```java
@Configuration
public class AppConfig {

  /*
   * Use the standard Mongo driver API to create a com.mongodb.client.MongoClient instance.
   */
   public @Bean com.mongodb.reactivestreams.client.MongoClient mongoClient() {
       return com.mongodb.reactivestreams.client.MongoClients.create("mongodb://localhost:27017");
   }
}
```

--------------------------------

### Create Query from JSON String

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Demonstrates creating a `BasicQuery` instance from a plain JSON string to query documents based on age and account balance.

```java
BasicQuery query = new BasicQuery("{ age : { $lt : 50 }, accounts.balance : { $gt : 1000.00 }}");
List<Person> result = mongoTemplate.find(query, Person.class);
```

--------------------------------

### MongoDB Aggregation: Complex SpEL Arithmetic Projection (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

This example demonstrates advanced arithmetic operations using SpEL expressions in the projection stage, including referencing parameters passed to `addExpression`. This allows for dynamic calculations with external variables integrated into the aggregation pipeline.

```java
class Product {
    String id;
    String name;
    double netPrice;
    int spaceUnits;
}
```

```java
import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

double shippingCosts = 1.2;

TypedAggregation<Product> agg = newAggregation(Product.class,
    project("name", "netPrice")
```

--------------------------------

### Register MongoClient via FactoryBean (Java Config - Imperative)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/configuration.adoc

Configures an imperative `MongoClient` using Spring's `MongoClientFactoryBean` via Java-based bean metadata. This `FactoryBean` provides exception translation to Spring's `DataAccessException` hierarchy.

```java
@Configuration
public class AppConfig {

    /*
     * Factory bean that creates the com.mongodb.client.MongoClient instance
     */
     public @Bean MongoClientFactoryBean mongo() {
          MongoClientFactoryBean mongo = new MongoClientFactoryBean();
          mongo.setHost("localhost");
          return mongo;
     }
}
```

--------------------------------

### Custom Object Construction with @PersistenceCreator and SpEL

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping.adoc

Shows how to customize object construction in Spring Data MongoDB using the `@PersistenceCreator` annotation on a constructor. This allows for flexible parameter resolution from the input document, including using SpEL expressions with `@Value` for fallback values. The example demonstrates reading a constructed `OrderItem` from a `Document`.

```java
class OrderItem {

  private @Id String id;
  private int quantity;
  private double unitPrice;

  OrderItem(String id, @Value("#root.qty ?: 0") int quantity, double unitPrice) {
    this.id = id;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
  }

  // getters/setters ommitted
}

Document input = new Document("id", "4711");
input.put("unitPrice", 2.5);
input.put("qty",5);
OrderItem item = converter.read(OrderItem.class, input);
```

--------------------------------

### Configure GridFsTemplate via XML

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-gridfs.adoc

Provides an XML configuration for setting up `GridFsTemplate` using Spring's bean definition. It specifies the database factory and converter beans required for GridFS operations.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:mongo="http://www.springframework.org/schema/data/mongo" xsi:schemaLocation="http://www.springframework.org/schema/data/mongo
https://www.springframework.org/schema/data/mongo/spring-mongo.xsd
http://www.springframework.org/schema/beans
https://www.springframework.org/schema/beans/spring-beans.xsd">

  <mongo:db-factory id="mongoDbFactory" dbname="database" />
  <mongo:mapping-converter id="converter" />

  <bean class="org.springframework.data.mongodb.gridfs.GridFsTemplate">
    <constructor-arg ref="mongoDbFactory" />
    <constructor-arg ref="converter" />
  </bean>

</beans>
```

--------------------------------

### Configure Reactive MongoDB Repositories (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/repositories.adoc

Shows how to configure Spring Data MongoDB repositories for reactive applications using the `@EnableReactiveMongoRepositories` annotation and extending `AbstractReactiveMongoConfiguration`. It specifies the database name and mapping base package.

```java
@Configuration
@EnableReactiveMongoRepositories("com.acme.*.repositories")
class ApplicationConfig extends AbstractReactiveMongoConfiguration {

  @Override
  protected String getDatabaseName() {
    return "e-store";
  }

  @Override
  protected String getMappingBasePackage() {
    return "com.acme.*.repositories";
  }
}
```

--------------------------------

### Programmatic Index Creation for All Initial Entities (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-index-management.adoc

Shows how to programmatically create indexes for all entities annotated with @Document on application startup. It iterates through the mapping context, filters for @Document entities, and ensures their indexes are created.

```java
class MyListener{

  @EventListener(ContextRefreshedEvent.class)
  public void initIndicesAfterStartup() {

    MappingContext<? extends MongoPersistentEntity<?>, MongoPersistentProperty> mappingContext = mongoTemplate
        .getConverter().getMappingContext();

    // consider only entities that are annotated with @Document
    mappingContext.getPersistentEntities()
                            .stream()
                            .filter(it -> it.isAnnotationPresent(Document.class))
                            .forEach(it -> {

    IndexOperations indexOps = mongoTemplate.indexOps(it.getType());
    resolver.resolveIndexFor(it.getType()).forEach(indexOps::ensureIndex);
    });
  }
}
```

--------------------------------

### Java Type Mapping Example

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/converters-type-mapping.adoc

Demonstrates Spring Data MongoDB's default type mapping by saving a `Person` object. The `MappingMongoConverter` stores the fully qualified classname under `_class` for top-level documents and complex nested types.

```Java
class Sample {
  Contact value;
}

abstract class Contact { … }

class Person extends Contact { … }

Sample sample = new Sample();
sample.value = new Person();

mongoTemplate.save(sample);
```

```JSON
{
  "value" : { "_class" : "com.acme.Person" },
  "_class" : "com.acme.Sample"
}
```

--------------------------------

### Configure Spring Data MongoDB Client in Java

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/configuration.adoc

This snippet demonstrates how to configure a MongoDB client using Spring Boot's `AbstractMongoClientConfiguration`. It sets the database name, host, port, and connection pool settings by reading properties from the `Environment`.

```java
import com.mongodb.MongoClientSettings.Builder;
import com.mongodb.ServerAddress;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

import java.util.concurrent.TimeUnit;

import static java.util.Collections.singletonList;

@Configuration
public class MongoAppConfig extends AbstractMongoClientConfiguration {

  @Autowired
  Environment env;

  @Override
  public String getDatabaseName() {
    return "database";
  }

  @Override
  protected void configureClientSettings(Builder builder) {

    builder.applyToClusterSettings(settings -> {
    settings.hosts(singletonList(
          new ServerAddress(env.getProperty("mongo.host"), env.getProperty("mongo.port", Integer.class))));
    });

    builder.applyToConnectionPoolSettings(settings -> {

      settings.maxConnectionLifeTime(env.getProperty("mongo.pool-max-life-time", Integer.class), TimeUnit.MILLISECONDS)
          .minSize(env.getProperty("mongo.pool-min-size", Integer.class))
          .maxSize(env.getProperty("mongo.pool-max-size", Integer.class))
          .maintenanceFrequency(10, TimeUnit.MILLISECONDS)
          .maintenanceInitialDelay(11, TimeUnit.MILLISECONDS)
          .maxConnectionIdleTime(30, TimeUnit.SECONDS)
          .maxWaitTime(15, TimeUnit.MILLISECONDS);
    });
  }
}
```

--------------------------------

### Spring Data MongoDB Vector Search Repository Methods

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/partials/vector-search-repository-include.adoc

Demonstrates how to define repository methods for vector search operations in Spring Data MongoDB. It includes the use of the `@VectorSearch` annotation with parameters like `indexName`, `numCandidates`, `limit`, and `score`, along with an example of calling such a method.

```java
interface CommentRepository extends Repository<Comment, String> {

  @VectorSearch(indexName = "my-index", numCandidates="{#limit.max() * 20}")
  SearchResults<Comment> searchByCountryAndEmbeddingNear(String country, Vector vector, Score score, Limit limit);

  @VectorSearch(indexName = "my-index", limit="10", numCandidates="200")
  SearchResults<Comment> searchByCountryAndEmbeddingWithin(String country, Vector embedding, Score score);

}

SearchResults<Comment> results = repository.searchByCountryAndEmbeddingNear("en", Vector.of(…), Score.of(0.9), Limit.of(10));
```

--------------------------------

### Perform Reactive Upsert Operation with Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

This example demonstrates a reactive upsert operation using `MongoTemplate`. An upsert performs an insert if no document matches the query, otherwise it updates the first matching document. The inserted document combines the query and update criteria, returning a `Mono<UpdateResult>`.

```Java
Mono<UpdateResult> result = template.update(Person.class)
  .matching(query(where("ssn").is(1111).and("firstName").is("Joe").and("Fraizer").is("Update")))
  .apply(update("address", addr))
  .upsert();
```

--------------------------------

### Configure Spring Data MongoDB Client in XML

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/configuration.adoc

This XML configuration defines the MongoDB client and database factory using Spring's namespace. It externalizes connection details and pool settings via properties, and sets up a `MongoTemplate`.

```xml
<context:property-placeholder location="classpath:/com/myapp/mongodb/config/mongo.properties"/>

<mongo:mongo-client host="${mongo.host}" port="${mongo.port}">
  <mongo:client-settings connection-pool-max-connection-life-time="${mongo.pool-max-life-time}"
    connection-pool-min-size="${mongo.pool-min-size}"
    connection-pool-max-size="${mongo.pool-max-size}"
    connection-pool-maintenance-frequency="10"
    connection-pool-maintenance-initial-delay="11"
    connection-pool-max-connection-idle-time="30"
    connection-pool-max-wait-time="15" />
</mongo:mongo-client>

<mongo:db-factory dbname="database" mongo-ref="mongoClient"/>

<bean id="anotherMongoTemplate" class="org.springframework.data.mongodb.core.MongoTemplate">
  <constructor-arg name="mongoDbFactory" ref="mongoDbFactory"/>
</bean>
```

--------------------------------

### Manually Configure GeoJSON Serializers for Jackson ObjectMapper in Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/geo-json.adoc

Example Java configuration demonstrating how to manually provide `JsonSerializer`s for GeoJSON types to the Jackson `ObjectMapper` by exposing `GeoJsonModule.serializers()` as a Spring Bean. This is necessary for symmetric de/serialization in Spring Data MongoDB versions prior to 4.0.

```Java
class GeoJsonConfiguration implements SpringDataJacksonModules {

	@Bean
	public Module geoJsonSerializers() {
		return GeoJsonModule.serializers();
	}
}
```

--------------------------------

### Reactive Java ReactiveMongoTemplate CRUD Operations

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Illustrates saving, finding, updating, and removing a Person object using the reactive ReactiveMongoTemplate. This example uses Project Reactor's Mono and Flux for asynchronous operations. Dependencies include ReactiveMongoTemplate and reactive stream operators.

```java
public class ReactiveMongoApplication {

  private static final Logger log = LoggerFactory.getLogger(ReactiveMongoApplication.class);

  public static void main(String[] args) throws Exception {

    CountDownLatch latch = new CountDownLatch(1);

    ReactiveMongoTemplate template = new ReactiveMongoTemplate(MongoClients.create(), "database");

    template.insert(new Person("Joe", 34)).doOnNext(person -> log.info("Insert: " + person))
      .flatMap(person -> template.findById(person.getId(), Person.class))
      .doOnNext(person -> log.info("Found: " + person))
      .zipWith(person -> template.updateFirst(query(where("name").is("Joe")), update("age", 35), Person.class))
      .flatMap(tuple -> template.remove(tuple.getT1())).flatMap(deleteResult -> template.findAll(Person.class))
      .count().doOnSuccess(count -> {
        log.info("Number of people: " + count);
        latch.countDown();
      })

      .subscribe();

    latch.await();
  }
}
```

--------------------------------

### Using Aggregation Framework with MongoTemplate (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

Demonstrates how to construct an aggregation pipeline using Spring Data MongoDB's `Aggregation` class and execute it via `MongoTemplate`. It shows how to define pipeline operations and retrieve mapped results.

```Java
import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

Aggregation agg = newAggregation(
    pipelineOP1(),
    pipelineOP2(),
    pipelineOPn()
);

AggregationResults<OutputType> results = mongoTemplate.aggregate(agg, "INPUT_COLLECTION_NAME", OutputType.class);
List<OutputType> mappedResult = results.getMappedResults();
```

--------------------------------

### Spring Data MongoDB: Define Collation for Repository Queries

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

This example illustrates how to specify collation settings for queries in Spring Data MongoDB repositories. By using the collation attribute within the @Query annotation, developers can define language-specific rules for string comparison, ensuring correct sorting and filtering for different locales.

```java
public interface PersonRepository extends MongoRepository<Person, String> {

  @Query(collation = "en_US")
  List<Person> findByFirstname(String firstname);

  @Query(collation = "{ 'locale' : 'en_US' }")
  List<Person> findPersonByFirstname(String firstname);

  @Query(collation = "?1")
  List<Person> findByFirstname(String firstname, Object collation);
}
```

--------------------------------

### MongoTemplate and ReactiveMongoTemplate Constructors

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-config.adoc

Details the available constructors for `MongoTemplate` and `ReactiveMongoTemplate`, including those taking a `MongoClient` and database name, a `MongoDatabaseFactory`, or a `MongoDatabaseFactory` with a `MongoConverter`.

```APIDOC
MongoTemplate(MongoClient mongo, String databaseName)
  - Description: Takes the `MongoClient` object and the default database name to operate against.
  - Parameters:
    - mongo: The `MongoClient` instance.
    - databaseName: The default database name.

MongoTemplate(MongoDatabaseFactory mongoDbFactory)
  - Description: Takes a `MongoDbFactory` object that encapsulates the `MongoClient` object, database name, and credentials.
  - Parameters:
    - mongoDbFactory: The `MongoDatabaseFactory` instance.

MongoTemplate(MongoDatabaseFactory mongoDbFactory, MongoConverter mongoConverter)
  - Description: Adds a `MongoConverter` to use for mapping objects.
  - Parameters:
    - mongoDbFactory: The `MongoDatabaseFactory` instance.
    - mongoConverter: The `MongoConverter` to use for mapping.
```

--------------------------------

### Publish Entity Lifecycle Events in MongoTemplate (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-config.adoc

Configures the MongoTemplate to publish entity lifecycle events. This feature can be disabled if no listeners are present, potentially improving performance. The example shows how to disable this feature by setting `entityLifecycleEventsEnabled` to `false` on a `MongoTemplate` instance.

```java
@Bean
MongoOperations mongoTemplate(MongoClient mongoClient) {
    MongoTemplate template = new MongoTemplate(mongoClient, "geospatial");
	template.setEntityLifecycleEventsEnabled(false);
	// ...
}
```

--------------------------------

### Reactive Tailable Cursors with ReactiveMongoOperations

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/tailable-cursors.adoc

Shows how to create infinite streams using reactive tailable cursors with `ReactiveMongoOperations`. The `template.tail()` method is used to create a `Flux` that emits documents matching the query as they arrive. The subscription must be disposed to close the stream.

```java
Flux<Person> stream = template.tail(query(where("name").is("Joe")), Person.class);

Disposable subscription = stream.doOnNext(person -> System.out.println(person)).subscribe();

// …

// Later: Dispose the subscription to close the stream
subscription.dispose();
```

--------------------------------

### Define Encrypted Field in JSON Schema

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-schema.adoc

Example of programmatically defining an encrypted field within a JSON Schema using Spring Data MongoDB's builder API. Specifies algorithm and key ID for deterministic encryption.

```java
MongoJsonSchema schema = MongoJsonSchema.builder()
    .properties(
        encrypted(string("ssn"))
            .algorithm("AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic")
            .keyId("*key0_id")
	).build();
```

--------------------------------

### Create MongoDB Collection with MongoTemplate

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-collection-management.adoc

Demonstrates creating a new MongoDB collection using `MongoTemplate` or `ReactiveMongoTemplate`. It includes logic to check for the collection's existence before creation.

```java
MongoCollection<Document> collection = null;
if (!template.getCollectionNames().contains("MyNewCollection")) {
    collection = mongoTemplate.createCollection("MyNewCollection");
}
```

```java
MongoCollection<Document> collection = template.getCollectionNames().collectList()
    .flatMap(collectionNames -> {
        if(!collectionNames.contains("MyNewCollection")) {
            return template.createCollection("MyNewCollection");
        }
        return template.getMongoDatabase().map(db -> db.getCollection("MyNewCollection"));
    });
```

--------------------------------

### Spring Data MongoDB: Annotated Vector Search with ANN and Dynamic Limit

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/partials/vector-search-method-annotated-include.adoc

Shows an alternative configuration for @VectorSearch, specifying the search type as Approximate Nearest Neighbor (ANN). This example uses a dynamic limit value derived from a method argument via a Value Expression and a calculated numCandidates based on the limit.

```java
interface CommentRepository extends Repository<Comment, String> {

  @VectorSearch(indexName = "my-index", filter = "{country: ?0}", limit="?3", numCandidates = "{#limit * 20}",
					searchType = VectorSearchOperation.SearchType.ANN)
  List<Comment> findAnnotatedByCountryAndEmbeddingWithin(String country, Vector embedding, Score distance, int limit);
}
```

--------------------------------

### Spring Data Repository Vector Search with Custom Sorting

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/partials/vector-search.adoc

Demonstrates how to define repository search methods in Spring Data to perform vector searches and apply custom sorting. It shows examples of methods using a `Vector` parameter and a `Score` or `Sort` parameter to control search behavior and result ordering. Note that custom sorting can only refer to domain properties, not the score itself.

```java
interface CommentRepository extends Repository<Comment, String> {

  SearchResults<Comment> searchByEmbeddingNearOrderByCountry(Vector vector, Score score);

  SearchResults<Comment> searchByEmbeddingWithin(Vector vector, Score score, Sort sort);
}
```

--------------------------------

### Optimistic Locking with @Version Annotation in Java

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Demonstrates how the @Version annotation in Spring Data MongoDB ensures updates are applied only to documents with a matching version. It shows an example of inserting a document, updating it, and then attempting to update a stale version, which results in an OptimisticLockingFailureException.

```java
@Document
class Person {

  @Id String id;
  String firstname;
  String lastname;
  @Version Long version;
}

Person daenerys = template.insert(new Person("Daenerys"));                            <1>

Person tmp = template.findOne(query(where("id").is(daenerys.getId())), Person.class); <2>

daenerys.setLastname("Targaryen");
template.save(daenerys);                                                              <3>

template.save(tmp); // throws OptimisticLockingFailureException                       <4>
```

--------------------------------

### Sync Tailable Cursors with MessageListener

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/tailable-cursors.adoc

Demonstrates using tailable cursors with a synchronous `MessageListenerContainer`. It involves setting up a container, defining a listener, and registering a `TailableCursorRequest` with collection, filter, and publish-to details. The container manages the lifecycle of tasks listening to the cursor.

```java
MessageListenerContainer container = new DefaultMessageListenerContainer(template);
container.start();

MessageListener<Document, User> listener = System.out::println;

TailableCursorRequest request = TailableCursorRequest.builder()
  .collection("orders")
  .filter(query(where("value").lt(100)))
  .publishTo(listener)
  .build();

container.register(request, User.class);

// ...

container.stop();
```

--------------------------------

### ReactiveMongoDatabaseFactory Interface

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/configuration.adoc

Defines the contract for obtaining a MongoDatabase instance asynchronously using reactive types. Supports retrieving the default database or a database by name, returning a Mono.

```java
public interface ReactiveMongoDatabaseFactory {

  Mono<MongoDatabase> getDatabase() throws DataAccessException;

  Mono<MongoDatabase> getDatabase(String dbName) throws DataAccessException;
}
```

--------------------------------

### Java Configuration for MongoDatabaseFactory

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/configuration.adoc

Configures a MongoDatabaseFactory bean using Java-based Spring configuration. This involves creating a SimpleMongoClientDatabaseFactory with a MongoClient and database name.

```java
@Configuration
public class MongoConfiguration {

  @Bean
  public MongoDatabaseFactory mongoDatabaseFactory() {
    return new SimpleMongoClientDatabaseFactory(MongoClients.create(), "database");
  }
}
```

--------------------------------

### Reactive Paging Access

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/repositories.adoc

Illustrates accessing the first page of entities using a reactive Spring Data repository with Project Reactor's Flux. It uses `Sort` and `Limit` for data retrieval.

```java
@ExtendWith(SpringExtension.class)
@ContextConfiguration
class PersonRepositoryTests {

    @Autowired PersonRepository repository;

    @Test
    void readsFirstPageCorrectly() {

        Flux<Person> persons = repository.findAll(Sort.unsorted(), Limit.of(10));

        persons.as(StepVerifer::create)
            .expectNextCount(10)
            .verifyComplete();
    }
}
```

--------------------------------

### Replace or Upsert a Single Document in Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

This example demonstrates replacing a document with an upsert option. If a document matching the query is found, it's replaced; otherwise, a new document is inserted. The `_id` value needs to be present in the replacement document for upsert, otherwise MongoDB might create a new potentially incompatible `ObjectId`.

```Java
Person tom = new Person("id-123", "Tom", 21)
Query query = Query.query(Criteria.where("firstName").is(tom.getFirstName()));
template.replace(query, tom, ReplaceOptions.replaceOptions().upsert());
```

--------------------------------

### Register MongoClient (XML Config)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/configuration.adoc

Configures a `MongoClient` instance using XML-based bean metadata for Spring applications. This approach uses the `mongo:mongo-client` namespace element to define the MongoDB client connection.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:mongo="http://www.springframework.org/schema/data/mongo"
xsi:schemaLocation=
"
http://www.springframework.org/schema/data/mongo https://www.springframework.org/schema/data/mongo/spring-mongo.xsd
http://www.springframework.org/schema/beans
https://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- Default bean name is 'mongo' -->
    <mongo:mongo-client host="localhost" port="27017"/>

</beans>
```

--------------------------------

### Aggregation Options with @Meta Annotation

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Demonstrates how to use the @Meta annotation to configure aggregation options like maximum execution time, comments, or disk usage. This allows for finer control over aggregation pipeline execution.

```java
interface PersonRepository extends CrudRepository<Person, String> {

  @Meta(allowDiskUse = true)
  @Aggregation("{ $group: { _id : $lastname, names : { $addToSet : $firstname } } }")
  List<PersonAggregate> groupByLastnameAndFirstnames();
}
```

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.METHOD })
@Meta(allowDiskUse = true)
@interface AllowDiskUse { }

interface PersonRepository extends CrudRepository<Person, String> {

  @AllowDiskUse
  @Aggregation("{ $group: { _id : $lastname, names : { $addToSet : $firstname } } }")
  List<PersonAggregate> groupByLastnameAndFirstnames();
}
```

--------------------------------

### Implementing Optimistic Locking with Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

This Java code demonstrates how to implement optimistic locking using Spring Data MongoDB's `@Version` annotation. It defines a `Person` document with an `@Id` and `@Version` field. The example illustrates an initial document insertion (where version is 0), loading the same document, updating it (which increments the version), and then attempting to save an outdated version of the document. This last operation correctly throws an `OptimisticLockingFailureException`, preventing concurrent modifications from overwriting each other. Optimistic locking requires `WriteConcern` to be `ACKNOWLEDGED`. As of version 2.2, `MongoOperations` and `CrudRepository` also consider the `@Version` property during removal operations, raising `OptimisticLockingFailureException` if the version has changed. To bypass version checks during deletion, use `MongoOperations#remove(Query,...)` or `CrudRepository.deleteById(ID)`.

```java
@Document
class Person {

  @Id String id;
  String firstname;
  String lastname;
  @Version Long version;
}

Person daenerys = template.insert(new Person("Daenerys"));                            

Person tmp = template.findOne(query(where("id").is(daenerys.getId())), Person.class); 

daenerys.setLastname("Targaryen");
template.save(daenerys);                                                              

template.save(tmp); // throws OptimisticLockingFailureException
```

--------------------------------

### Using @Hint and @Query hint alias

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Demonstrates how to use the `@Hint` annotation to override MongoDB's default index selection, forcing the database to use a specified index. It also shows the equivalent usage via the `hint` alias within the `@Query` annotation.

```java
@Hint("lastname-idx")
List<Person> findByLastname(String lastname);

@Query(value = "{ 'firstname' : ?0 }", hint = "firstname-idx")
List<Person> findByFirstname(String firstname);
```

--------------------------------

### Create Vector Index

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-search-indexes.adoc

Demonstrates creating a vector index using `SearchIndexOperationsProvider` in Java and MongoDB Shell. It defines index name, vector embeddings with dimensions and similarity, and filter fields.

```java
VectorIndex index = new VectorIndex("vector_index")
  .addVector("plotEmbedding", vector -> vector.dimensions(1536).similarity(COSINE)) <1>
  .addFilter("year"); <2>
mongoTemplate.searchIndexOps(Movie.class) <3>
  .createIndex(index);
```

```console
db.movie.createSearchIndex("movie", "vector_index",
  {
    "fields": [
      {
        "type": "vector",
        "numDimensions": 1536,
        "path": "plot_embedding", <1>
        "similarity": "cosine"
      },
      {
        "type": "filter",
        "path": "year"
      }
    ]
  }
)
```

--------------------------------

### Bucket Operations in Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

Demonstrates how to use the `bucket()` method to group documents into predefined, sorted boundaries. It shows how to define boundaries, set a default bucket for documents outside the boundaries, and specify output fields like counts or pushed values.

```java
bucket("price").withBoundaries(0, 100, 400);

bucket("price").withBoundaries(0, 100).withDefault("Other");

bucket("price").withBoundaries(0, 100).andOutputCount().as("count");

bucket("price").withBoundaries(0, 100).andOutput("title").push().as("titles");
```

--------------------------------

### Repository Collation Definitions

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Illustrates various methods for defining collation settings in Spring Data MongoDB repositories. This includes static string definitions, dynamic collation based on method arguments, and applying `Collation` objects directly or via annotations like `@Query` and `@Collation`.

```java
public interface PersonRepository extends MongoRepository<Person, String> {

  @Query(collation = "en_US")
  List<Person> findByFirstname(String firstname);

  @Query(collation = "{ 'locale' : 'en_US' }")
  List<Person> findPersonByFirstname(String firstname);

  @Query(collation = "?1")
  List<Person> findByFirstname(String firstname, Object collation);

  @Query(collation = "{ 'locale' : '?1' }")
  List<Person> findByFirstname(String firstname, String collation);

  List<Person> findByFirstname(String firstname, Collation collation);

  @Query(collation = "{ 'locale' : 'en_US' }")
  List<Person> findByFirstname(String firstname, @Nullable Collation collation);
}
```

```java
@Collation("en_US")
class Game {
  // ...
}

interface GameRepository extends Repository<Game, String> {

  @Collation("en_GB")
  List<Game> findByTitle(String title);

  @Collation("de_AT")
  @Query(collation="en_GB")
  List<Game> findByDescriptionContaining(String keyword);
}
```

--------------------------------

### Criteria Class Methods for MongoDB Operators

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Lists and describes the methods available in the `Criteria` class, which correspond to native MongoDB query operators, enabling fluent construction of query conditions.

```APIDOC
Criteria Class Methods:

* all(Object o)
  - Creates a criterion using the `$all` operator.

* and(String key)
  - Adds a chained `Criteria` with the specified `key` to the current `Criteria` and returns the newly created one.

* andOperator(Criteria... criteria)
  - Creates an `AND` query using the `$and` operator for all provided criteria (requires MongoDB 2.0 or later).

* andOperator(Collection<Criteria> criteria)
  - Creates an `AND` query using the `$and` operator for all provided criteria (requires MongoDB 2.0 or later).

* elemMatch(Criteria c)
  - Creates a criterion using the `$elemMatch` operator.

* exists(boolean b)
  - Creates a criterion using the `$exists` operator.

* gt(Object o)
  - Creates a criterion using the `$gt` (greater than) operator.

* gte(Object o)
  - Creates a criterion using the `$gte` (greater than or equal to) operator.

* in(Object... o)
  - Creates a criterion using the `$in` operator for a varargs argument.

* in(Collection<?> collection)
  - Creates a criterion using the `$in` operator using a collection.

* is(Object o)
  - Creates a criterion using field matching (`{ key:value }`). If the specified value is a document, the order of the fields and exact equality in the document matters.

* lt(Object o)
  - Creates a criterion using the `$lt` (less than) operator.

* lte(Object o)
  - Creates a criterion using the `$lte` (less than or equal to) operator.

* mod(Number value, Number remainder)
  - Creates a criterion using the `$mod` operator.

* ne(Object o)
  - Creates a criterion using the `$ne` (not equal) operator.

* nin(Object... o)
  - Creates a criterion using the `$nin` (not in) operator.
```

--------------------------------

### Create Imperative Person Repository Interface (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/repositories.adoc

Demonstrates defining a Java interface for a MongoDB repository that extends `PagingAndSortingRepository`. This interface is used for imperative (synchronous) data access operations on `Person` entities.

```java
public interface PersonRepository extends PagingAndSortingRepository<Person, String> {

    // additional custom query methods go here
}
```

--------------------------------

### Reactive Evaluation Context Extension

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Demonstrates a reactive Spring Data MongoDB evaluation context extension. This implementation of `ReactiveEvaluationContextExtension` provides a `Mono` that resolves to an `EvaluationContextExtensionSupport` for reactive SpEL evaluations.

```java
public class SampleEvaluationContextExtension implements ReactiveEvaluationContextExtension {

    @Override
    public String getExtensionId() {
        return "security";
    }

    @Override
    public Mono<? extends EvaluationContextExtension> getExtension() {
        return Mono.just(new EvaluationContextExtensionSupport() { /* ... */ });
    }
}
```

--------------------------------

### ObservationConvention Implementations

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/observability/conventions.adoc

Lists the `ObservationConvention` implementations available in Spring Data MongoDB and the `ObservationContext` classes they apply to. These conventions help in defining and categorizing observations for monitoring and tracing MongoDB operations.

```APIDOC
ObservationConvention Implementations:

- `org.springframework.data.mongodb.observability.DefaultMongoHandlerObservationConvention`
  - Applicable Context: `MongoHandlerContext`
  - Description: Provides default conventions for MongoDB handler observations.

- `org.springframework.data.mongodb.observability.MongoHandlerObservationConvention`
  - Applicable Context: `MongoHandlerContext`
  - Description: Custom conventions for MongoDB handler observations.
```

--------------------------------

### Imperative Paging Access

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/repositories.adoc

Demonstrates accessing the first page of entities using an imperative Spring Data repository. It utilizes `PageRequest` to specify pagination details.

```java
@ExtendWith(SpringExtension.class)
@ContextConfiguration
class PersonRepositoryTests {

    @Autowired PersonRepository repository;

    @Test
    void readsFirstPageCorrectly() {

      Page<Person> persons = repository.findAll(PageRequest.of(0, 10));
      assertThat(persons.isFirstPage()).isTrue();
    }
}
```

--------------------------------

### Configure Imperative GridFsTemplate

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-gridfs.adoc

Shows how to configure an imperative `GridFsTemplate` bean using `MongoDatabaseFactory` and `MongoConverter`. This template is used for interacting with MongoDB's GridFS for file storage and retrieval.

```java
class GridFsConfiguration extends AbstractMongoClientConfiguration {

  // … further configuration omitted

  @Bean
  public GridFsTemplate gridFsTemplate() {
    return new GridFsTemplate(mongoDbFactory(), mappingMongoConverter());
  }
}
```

--------------------------------

### Configure Reactive GridFsTemplate

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-gridfs.adoc

Demonstrates the configuration of a reactive `ReactiveGridFsTemplate` bean, requiring a `ReactiveMongoDatabaseFactory` and `MongoConverter`. This is used for asynchronous file operations with GridFS.

```java
class ReactiveGridFsConfiguration extends AbstractReactiveMongoConfiguration {

  // … further configuration omitted

  @Bean
  public ReactiveGridFsTemplate reactiveGridFsTemplate() {
    return new ReactiveGridFsTemplate(reactiveMongoDbFactory(), mappingMongoConverter());
  }
}
```

--------------------------------

### Reactive GridFS: Read Files by Pattern

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-gridfs.adoc

Illustrates reading files from GridFS reactively with `ReactiveGridFsTemplate`. Similar to the imperative version, it uses an Ant-style path pattern to fetch files, returning a `Flux` of `ReactiveGridFsResource`.

```java
class ReactiveGridFsClient {

  @Autowired
  ReactiveGridFsOperations operations;

  public Flux<ReactiveGridFsResource> readFilesFromGridFs() {
     return operations.getResources("*.txt");
  }
}
```

--------------------------------

### Imperative GridFS: Read Files by Pattern

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-gridfs.adoc

Shows how to read files from GridFS using the `GridFsTemplate` and the `ResourcePatternResolver` interface. This method accepts an Ant-style path pattern to retrieve multiple files, returning an array of `GridFsResources`.

```java
class GridFsClient {

  @Autowired
  GridFsOperations operations;

  public GridFsResources[] readFilesFromGridFs() {
     return operations.getResources("*.txt");
  }
}
```

--------------------------------

### BucketAuto Operations in Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

Illustrates the use of `bucketAuto()` to distribute documents evenly across a specified number of buckets. This method automatically calculates boundaries. It also shows how to specify a granularity for boundary rounding and define output fields.

```java
bucketAuto("price", 5);

bucketAuto("price", 5).withGranularity(Granularities.E24).withDefault("Other");

bucketAuto("price", 5).andOutput("title").push().as("titles");
```

--------------------------------

### MongoDatabaseFactory Interface

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/configuration.adoc

Defines the contract for obtaining a MongoDatabase instance. Supports retrieving the default database or a database by name, throwing DataAccessException on failure.

```java
public interface MongoDatabaseFactory {

  MongoDatabase getDatabase() throws DataAccessException;

  MongoDatabase getDatabase(String dbName) throws DataAccessException;
}
```

--------------------------------

### Gradle Configuration for Annotation Processing

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/repositories/core-extensions.adoc

Configures Gradle to use the Spring Data MongoDB annotation processor and includes Querydsl dependencies. It specifies annotation processors for both main and test compilation tasks.

```groovy
dependencies {
    implementation 'com.querydsl:querydsl-mongodb:${querydslVersion}'

    annotationProcessor 'com.querydsl:querydsl-apt:${querydslVersion}:jakarta'
    annotationProcessor 'org.springframework.data:spring-data-mongodb'

    testAnnotationProcessor 'com.querydsl:querydsl-apt:${querydslVersion}:jakarta'
    testAnnotationProcessor 'org.springframework.data:spring-data-mongodb'
}

tasks.withType(JavaCompile).configureEach {
    options.compilerArgs += [
            "-processor",
            "org.springframework.data.mongodb.repository.support.MongoAnnotationProcessor"]
}
```

--------------------------------

### Spring Data MongoDB: Dynamic Aggregation with Placeholder

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Demonstrates a dynamic aggregation pipeline where `?0` is replaced with the provided `property` value, allowing for flexible aggregation based on runtime input.

```java
@Aggregation("{ $group: { _id : $lastname, names : { $addToSet : ?0 } } }")
  List<PersonAggregate> groupByLastnameAnd(String property);
```

--------------------------------

### Create Wildcard Index with Projection in Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-index-management.adoc

Illustrates how to use `wildcardProjection` with `@WildcardIndexed` to include or exclude specific fields from the wildcard index in Java, and the corresponding MongoDB shell command.

```java
@Document
@WildcardIndexed(wildcardProjection = "{ 'userMetadata.age' : 0 }")
public class User {
    private @Id String id;
    private UserMetadata userMetadata;
}
```

```javascript
db.user.createIndex(
  { "$**" : 1 },
  { "wildcardProjection" :
    { "userMetadata.age" : 0 }
  }
)
```

--------------------------------

### Programmatic Index Creation for Single Domain Type (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-index-management.adoc

Demonstrates how to programmatically create indexes for a specific domain type on application startup. It uses IndexResolver to resolve indexes defined by annotations like @GeoSpatialIndexed and IndexOperations to ensure their creation via MongoTemplate.

```java
class MyListener {

  @EventListener(ContextRefreshedEvent.class)
  public void initIndicesAfterStartup() {

    MappingContext<? extends MongoPersistentEntity<?>, MongoPersistentProperty> mappingContext = mongoTemplate
                .getConverter().getMappingContext();

    IndexResolver resolver = new MongoPersistentEntityIndexResolver(mappingContext);

    IndexOperations indexOps = mongoTemplate.indexOps(DomainType.class);
    resolver.resolveIndexFor(DomainType.class).forEach(indexOps::ensureIndex);
  }
}
```

--------------------------------

### Query Documents with MongoTemplate (Imperative & Reactive)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Shows how to query documents using `MongoTemplate` with a fluent API style, supporting both imperative and reactive execution. It uses `Criteria.where` for defining query conditions.

```java
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

// ...

List<Person> result = template.query(Person.class)
  .matching(query(where("age").lt(50).and("accounts.balance").gt(1000.00d)))
  .all();
```

```java
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

// ...

Flux<Person> result = template.query(Person.class)
  .matching(query(where("age").lt(50).and("accounts.balance").gt(1000.00d)))
  .all();
```

--------------------------------

### Create MongoDB Collection and Index with Collation in Java

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/collation.adoc

Shows how to create a MongoDB collection and ensure an index with specific collations using `MongoOperations` and `Index` builder in Spring Data MongoDB. Collations applied at collection creation are used for subsequent index creation and queries.

```java
Collation french = Collation.of("fr");
Collation german = Collation.of("de");

template.createCollection(Person.class, CollectionOptions.just(collation));

template.indexOps(Person.class).ensureIndex(new Index("name", Direction.ASC).collation(german));
```

--------------------------------

### Spring Data MongoDB: Stream Aggregation with Match and Project

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Demonstrates an aggregation pipeline returning a `Stream`, including `$match` to filter by `lastname` and `$project` to select specific fields. Users must close the stream to release the server-side cursor.

```java
@Aggregation(pipeline = {
      "{ '$match' :  { 'lastname' :  '?0'} }",
      "{ '$project': { _id : 0, firstname : 1, lastname : 1 } }"
  })
  Stream<PersonAggregate> groupByLastnameAndFirstnamesAsStream();
```

--------------------------------

### Create and Configure MongoDB Collation in Java

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/collation.adoc

Demonstrates creating a `Collation` object in Java for MongoDB, configuring locale, strength, numeric ordering, diacritic sorting, and normalization. This requires the Spring Data MongoDB library.

```java
Collation collation = Collation.of("fr")
  .strength(ComparisonLevel.secondary()
    .includeCase())
  .numericOrderingEnabled()
  .alternate(Alternate.shifted().punct())
  .forwardDiacriticSort()
  .normalizationEnabled();
```

--------------------------------

### StringMatcher Options

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Details the various `StringMatcher` options available in Spring Data MongoDB for constructing queries. It specifies how string comparisons are performed, including case sensitivity, exact matches, and prefix matching, along with their corresponding MongoDB query projections.

```APIDOC
StringMatcher Options:

|=== 
| Matching | Logical result

| `DEFAULT` (case-sensitive)
| `{"firstname" : firstname}`

| `DEFAULT` (case-insensitive)
| `{"firstname" : { $regex: firstname, $options: 'i'}}

| `EXACT`  (case-sensitive)
| `{"firstname" : { $regex: /^firstname$/}}

| `EXACT` (case-insensitive)
| `{"firstname" : { $regex: /^firstname$/, $options: 'i'}}

| `STARTING`  (case-sensitive)
| `{"firstname" : { $regex: /^firstname/}}

| `STARTING` (case-insensitive)
| `{"firstname" : { $regex: /^firstname/, $options: 'i'}}
|=== 

Note: `null` values in `ExampleSpec` trigger embedded document matching instead of dot notation property matching, forcing exact document matching for all property values and order.
```

--------------------------------

### MongoDB Compatibility Matrix for Spring Data

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/preface.adoc

Summarizes the compatibility between Spring Data MongoDB release trains, Spring Data MongoDB versions, MongoDB Java Driver versions, and compatible MongoDB database versions. Database versions indicate server generations that pass the Spring Data test suite.

```APIDOC
Compatibility Matrix:
  Spring Data Release Train | Spring Data MongoDB | Driver Version | Database Versions
  2025.0                  | 4.5.x               | 5.3.x          | 6.x to 8.x
  2024.1                  | 4.4.x               | 5.2.x          | 4.4.x to 8.x
  2024.0                  | 4.3.x               | 4.11.x & 5.x   | 4.4.x to 7.x
  2023.1                  | 4.2.x               | 4.9.x          | 4.4.x to 7.x
  2023.0 (*)              | 4.1.x               | 4.9.x          | 4.4.x to 6.x
  2022.0 (*)              | 4.0.x               | 4.7.x          | 4.4.x to 6.x
  2021.2 (*)              | 3.4.x               | 4.6.x          | 4.4.x to 5.0.x
  2021.1 (*)              | 3.3.x               | 4.4.x          | 4.4.x to 5.0.x
  2021.0 (*)              | 3.2.x               | 4.1.x          | 4.4.x
  2020.0 (*)              | 3.1.x               | 4.1.x          | 4.4.x
  Neumann (*)             | 3.0.x               | 4.0.x          | 4.4.x
  Moore (*)               | 2.2.x               | 3.11.x/Reactive Streams 1.12.x | 4.2.x
  Lovelace (*)            | 2.1.x               | 3.8.x/Reactive Streams 1.9.x | 4.0.x

  (*) End of OSS Support
```

--------------------------------

### Adjust Ulimit for Open Files

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/README.adoc

Command to adjust the 'open files' limit on UNIX-based systems. A higher limit is recommended for running MongoDB, with 32768 being a common suggestion.

```bash
$ ulimit -n 32768
```

--------------------------------

### Imperative Transactions with MongoTransactionManager

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/client-session-transactions.adoc

Demonstrates setting up MongoTransactionManager and MongoTemplate for imperative Java applications. It shows how to register the transaction manager and template beans and how to mark business methods with @Transactional for automatic transaction management.

```java
@Configuration
static class Config extends AbstractMongoClientConfiguration {

    @Bean
    MongoTransactionManager transactionManager(MongoDatabaseFactory dbFactory) {  // <1>
        return new MongoTransactionManager(dbFactory);
    }

    @Bean
    MongoTemplate mongoTemplate(MongoDatabaseFactory dbFactory) {                 // <1>
        return new MongoTemplate(dbFactory);
    }

    // ...
}

@Component
public class StateService {

    @Transactional
    void someBusinessFunction(Step step) {                                        // <2>

        template.insert(step);

        process(step);

        template.update(Step.class).apply(Update.set("state", // ...
    };
});
```

--------------------------------

### Facet Operations in Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

Explains how to use the `facet()` method to create multi-faceted aggregations. This allows multiple, independent aggregation pipelines to run on the same input documents, with results stored in separate fields. It shows how to combine matching and bucketing operations within facets.

```java
facet(match(Criteria.where("price").exists(true)), bucketAuto("price", 5)).as("categorizedByPrice");

facet(match(Criteria.where("country").exists(true)), sortByCount("$country")).as("categorizedByCountry");
```

--------------------------------

### Configure Spring Data MongoDB Mapping

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping.adoc

Demonstrates how to configure `MappingMongoConverter` and `MongoTemplate` using Java-based configuration (`AbstractMongoClientConfiguration`) and XML configuration. Covers setting the database name, mapping base package, and registering custom converters.

```java
@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

  @Override
  public String getDatabaseName() {
    return "database";
  }

  // the following are optional

  @Override
  void configureConverters(MongoConverterConfigurationAdapter adapter) { 

  	adapter.registerConverter(new org.springframework.data.mongodb.test.PersonReadConverter());
  	adapter.registerConverter(new org.springframework.data.mongodb.test.PersonWriteConverter());
  }

  @Bean
  public LoggingEventListener<MongoMappingEvent> mappingEventsListener() {
    return new LoggingEventListener<MongoMappingEvent>();
  }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:mongo="http://www.springframework.org/schema/data/mongo"
  xsi:schemaLocation="
    http://www.springframework.org/schema/data/mongo https://www.springframework.org/schema/data/mongo/spring-mongo.xsd
    http://www.springframework.org/schema/beans https://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

  <!-- Default bean name is 'mongo' -->
  <mongo:mongo-client host="localhost" port="27017"/>

  <mongo:db-factory dbname="database" mongo-ref="mongoClient"/>

  <!-- by default look for a Mongo object named 'mongo' - default name used for the converter is 'mappingConverter' -->
  <mongo:mapping-converter base-package="com.bigbank.domain">
    <mongo:custom-converters>
      <mongo:converter ref="readConverter"/>
      <mongo:converter>
        <bean class="org.springframework.data.mongodb.test.PersonWriteConverter"/>
      </mongo:converter>
    </mongo:custom-converters>
  </mongo:mapping-converter>

  <bean id="readConverter" class="org.springframework.data.mongodb.test.PersonReadConverter"/>

  <!-- set the mapping converter to be used by the MongoTemplate -->
  <bean id="mongoTemplate" class="org.springframework.data.mongodb.core.MongoTemplate">
    <constructor-arg name="mongoDbFactory" ref="mongoDbFactory"/>
    <constructor-arg name="mongoConverter" ref="mappingConverter"/>
  </bean>

  <bean class="org.springframework.data.mongodb.core.mapping.event.LoggingEventListener"/>

</beans>
```

--------------------------------

### Create Text Index with Language and Weighting in Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-index-management.adoc

Shows how to create a text index across multiple fields using `@TextIndexed` and set a default language for the document using `@Document(language="spanish")`. Also demonstrates per-field weighting and per-document language override.

```java
@Document(language = "spanish")
class SomeEntity {

    @TextIndexed String foo;

    @Language String lang;

    Nested nested;
}

class Nested {

    @TextIndexed(weight=5) String bar;
    String roo;
}
```

--------------------------------

### CDI MongoTemplate Producer

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/cdi-integration.adoc

This Java snippet demonstrates how to produce a MongoTemplate bean for CDI environments. It utilizes Spring Data MongoDB's SimpleMongoClientDatabaseFactory and MongoTemplate to create a usable MongoOperations instance.

```java
class MongoTemplateProducer {

    @Produces
    @ApplicationScoped
    public MongoOperations createMongoTemplate() {

        MongoDatabaseFactory factory = new SimpleMongoClientDatabaseFactory(MongoClients.create(), "database");
        return new MongoTemplate(factory);
    }
}
```

--------------------------------

### Create MongoDB Index with MongoTemplate

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-collection-management.adoc

Demonstrates how to create a MongoDB index on a specified field using `MongoTemplate` or `ReactiveMongoTemplate`. It utilizes the `ensureIndex` method with an `IndexDefinition` to guarantee the index's existence.

```java
template.indexOps(Person.class)
    .ensureIndex(new Index().on("name",Order.ASCENDING));
```

```java
Mono<String> createIndex = template.indexOps(Person.class)
    .ensureIndex(new Index().on("name",Order.ASCENDING));
```

--------------------------------

### Enable MongoDB Auditing with XML Configuration

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/auditing.adoc

Configures auditing for Spring Data MongoDB using XML. Specifies the auditor-aware-ref to link to the custom auditor implementation.

```xml
<mongo:auditing mapping-context-ref="customMappingContext" auditor-aware-ref="yourAuditorAwareImpl"/>
```

--------------------------------

### Create Reactive Person Repository Interface (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/repositories.adoc

Demonstrates defining a Java interface for a MongoDB repository that extends `ReactiveSortingRepository`. This interface is used for reactive (non-blocking) data access operations on `Person` entities.

```java
public interface PersonRepository extends ReactiveSortingRepository<Person, String> {

    // additional custom query methods go here
}
```

--------------------------------

### Query Files in GridFS (Imperative)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-gridfs.adoc

Shows how to query for files stored in GridFS using the `GridFsOperations` template. The `find` method accepts a `Query` object, which can be constructed using `GridFsCriteria` for specifying criteria like filename.

```java
class GridFsClient {

  @Autowired
  GridFsOperations operations;

  @Test
  public void findFilesInGridFs() {
    GridFSFindIterable result = operations.find(query(whereFilename().is("filename.txt")));
  }
}
```

--------------------------------

### Store File to GridFS (Reactive)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-gridfs.adoc

Demonstrates storing a file reactively to GridFS using `ReactiveGridFsTemplate`. The `store` method takes a `Publisher<DataBuffer>` representing the file content, a filename, and optional metadata. The operation returns a `Mono<ObjectId>` upon completion.

```java
class ReactiveGridFsClient {

  @Autowired
  ReactiveGridFsTemplate operations;

  @Test
  public Mono<ObjectId> storeFileToGridFs() {

    FileMetadata metadata = new FileMetadata();
    // populate metadata
    Publisher<DataBuffer> file = … // lookup File or Resource

    return operations.store(file, "filename.txt", metadata);
  }
}
```

--------------------------------

### Hashed Index Annotations

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-index-management.adoc

Demonstrates how to define hashed indexes using Spring Data MongoDB annotations. This includes simple hashed indexes, combined with other index types, and using composed annotations for brevity.

```java
@Document
public class DomainType {

  @HashIndexed @Id String id;

  // ...
}
```

```java
@Document
public class DomainType {

  @Indexed
  @HashIndexed
  String value;

  // ...
}
```

```java
@Document
public class DomainType {

  @IndexAndHash(name = "idx...")
  String value;

  // ...
}

@Indexed
@HashIndexed
@Retention(RetentionPolicy.RUNTIME)
public @interface IndexAndHash {

  @AliasFor(annotation = Indexed.class, attribute = "name")
  String name() default "";
}
```

--------------------------------

### Create Time Series Collection with CollectionOptions

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-collection-management.adoc

Shows how to create a Time Series collection named 'weather' using Spring Data MongoDB's `CollectionOptions` helper, specifying 'timestamp' as the time field.

```java
template.createCollection("weather", CollectionOptions.timeSeries("timestamp"));
```

--------------------------------

### Inserting and Retrieving Documents

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Demonstrates how to insert a new document and then retrieve it based on a specific field value using Spring Data MongoDB's MongoTemplate in both imperative and reactive styles.

```java
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Criteria.query;

//...

template.insert(new Person("Bob", 33));

Person person = template.query(Person.class)
    .matching(query(where("age").is(33)))
    .oneValue();
```

```java
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Criteria.query;

//...

Mono<Person> person = mongoTemplate.insert(new Person("Bob", 33))
    .then(mongoTemplate.query(Person.class)
        .matching(query(where("age").is(33)))
        .one());
```

--------------------------------

### Spring Data MongoDB Aggregation Framework Integration

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Provides comprehensive API documentation for integrating the MongoDB aggregation framework with Spring Data MongoDB repositories. It covers defining aggregation pipelines using the @Aggregation annotation, including dynamic parameters, sorting, projection, and outputting results.

```APIDOC
PersonRepository extends CrudRepository<Person, String>

  @Aggregation("{ $group: { _id : $lastname, names : { $addToSet : $firstname } } }")
  List<PersonAggregate> groupByLastnameAndFirstnames();
    // Executes a MongoDB aggregation pipeline to group documents by lastname and collect unique firstnames.
    // Returns a list of PersonAggregate objects.

  @Aggregation("{ $group: { _id : $lastname, names : { $addToSet : $firstname } } }")
  List<PersonAggregate> groupByLastnameAndFirstnames(Sort sort);
    // Appends a $sort stage to the aggregation pipeline, affecting the order of final results.
    // Sort properties are mapped against the return type (e.g., Sort.by("lastname") maps to { $sort : { '_id', 1 } }).

  @Aggregation("{ $group: { _id : $lastname, names : { $addToSet : ?0 } } }")
  List<PersonAggregate> groupByLastnameAnd(String property);
    // Dynamically includes a property in the aggregation pipeline using a placeholder (?0).
    // The 'property' parameter replaces ?0, allowing for dynamic aggregation stages.

  @Aggregation("{ $group: { _id : $lastname, names : { $addToSet : ?0 } } }")
  Slice<PersonAggregate> groupByLastnameAnd(String property, Pageable page);
    // Similar to the above, but returns paginated results using Pageable.

  @Aggregation("{ $group: { _id : $lastname, names : { $addToSet : $firstname } } }")
  Stream<PersonAggregate> groupByLastnameAndFirstnamesAsStream();
    // Returns results as a Java Stream, suitable for reactive or stream-based processing.

  @Aggregation(pipeline = {
      "{ '$match' :  { 'lastname' :  '?0'} }",
      "{ '$project': { _id : 0, firstname : 1, lastname : 1 } }"
  })
  Stream<PersonAggregate> groupByLastnameAndFirstnamesAsStream();
    // Uses a pipeline array for more complex, multi-stage aggregations, including $match and $project.
    // Supports dynamic parameters (?0) within the pipeline stages.

  @Aggregation("{ $group : { _id : null, total : { $sum : $age } } }")
  SumValue sumAgeUsingValueWrapper();
    // Aggregates documents to calculate the sum of the 'age' field, returning the result wrapped in a custom SumValue object.

  @Aggregation("{ $group : { _id : null, total : { $sum : $age } } }")
  Long sumAge();
    // Calculates the sum of the 'age' field and returns the raw Long value.

  @Aggregation("{ $group : { _id : null, total : { $sum : $age } } }")
  AggregationResults<SumValue> sumAgeRaw();
    // Returns the aggregation results in a raw AggregationResults object, allowing access to mapped and mapped results.

  @Aggregation("{ '$project': { '_id' : '$lastname' } }")
  List<String> findAllLastnames();
    // Projects only the 'lastname' field and returns a list of strings.

  @Aggregation(pipeline = {
		  "{ $group : { _id : '$author', books: { $push: '$title' } } }",
		  "{ $out : 'authors' }"
  })
  void groupAndOutSkippingOutput();
    // Executes an aggregation pipeline that groups data and outputs the results to a new collection ('authors') using $out.
    // This method does not return a value.

// Related Classes:
// PersonAggregate: Represents the result of a grouping aggregation, typically containing fields like 'lastname' and 'names'.
// SumValue: A wrapper class to hold the total sum calculated by an aggregation.
// PersonProjection: An interface defining getters for projected fields, used in aggregation results.
```

--------------------------------

### Using Collations in Queries

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Demonstrates how to apply collations to collection operations by specifying a `Collation` instance. This allows for language-sensitive string comparisons and sorting.

```java
Collation collation = Collation.of("de");

Query query = new Query(Criteria.where("firstName").is("Amél"))
    .collation(collation);

List<Person> results = template.find(query, Person.class);
```

--------------------------------

### Text Index Configuration

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-index-management.adoc

Details how to create a text index in Spring Data MongoDB, allowing full-text search across multiple fields. It covers setting the default language, per-document language overrides, and field weighting for ranking.

```java
@Document(language = "spanish")
class SomeEntity {

    @TextIndexed String foo;

    @Language String lang;

    Nested nested;
}

class Nested {

    @TextIndexed(weight=5) String bar;
    String roo;
}
```

--------------------------------

### Reactive Tailable Cursors with ReactiveMongoRepository

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/tailable-cursors.adoc

Illustrates using the `@Tailable` annotation on repository methods that return reactive types like `Flux`. This simplifies the creation of infinite streams from capped collections by automatically configuring tailable cursor behavior for the query method.

```java
public interface PersonRepository extends ReactiveMongoRepository<Person, String> {

  @Tailable
  Flux<Person> findByFirstname(String firstname);

}

Flux<Person> stream = repository.findByFirstname("Joe");

Disposable subscription = stream.doOnNext(System.out::println).subscribe();

// …

// Later: Dispose the subscription to close the stream
subscription.dispose();
```

--------------------------------

### Projection Expressions in Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

Defines how to create projection expressions for aggregation steps using the `project` method in Spring Data MongoDB. It covers basic field inclusion, aliasing, and multi-stage operations.

```APIDOC
Projection Expressions:

Used to define output fields in an aggregation step.
Can be defined via `project` method of `Aggregation` class.

Methods:
- `project(String... fields)`: Includes specified fields.
- `project().and(String fieldName).as(String alias)`: Includes a field and aliases it.
- `Fields.field(String fieldName)`: Static factory for creating field instances.

Referencing Fields:
- References to projected fields in later stages are valid only for included fields or their aliases.
- Fields not included in projection cannot be referenced later.

Examples:
1. Basic Projection:
   `project("name", "netPrice")`
   // Generates: {$project: {name: 1, netPrice: 1}}

2. Aliased Projection:
   `project().and("thing1").as("thing2")`
   // Generates: {$project: {thing2: $thing1}}

3. Combined Projection with Alias:
   `project("a", "b").and("thing1").as("thing2")`
   // Generates: {$project: {a: 1, b: 1, thing2: $thing1}}

Multi-Stage Aggregation (Projection and Sorting):

1. Project and Sort:
   `project("name", "netPrice"), sort(ASC, "name")`
   // Generates: {$project: {name: 1, netPrice: 1}}, {$sort: {name: 1}}

2. Aliased Projection and Sort:
   `project().and("firstname").as("name"), sort(ASC, "name")`
   // Generates: {$project: {name: $firstname}}, {$sort: {name: 1}}

3. Invalid Reference:
   `project().and("firstname").as("name"), sort(ASC, "firstname")`
   // Does not work as 'firstname' is not directly projected or aliased for sorting.

Further details can be found in the MongoDB Aggregation Framework documentation for the `$project` operator.
```

--------------------------------

### Imperative Query with SpEL Expression

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Demonstrates an imperative Spring Data MongoDB repository method using a SpEL expression to dynamically bind a query parameter. The SpEL expression `?#{[0]}` references the first method argument.

```java
public interface PersonRepository extends MongoRepository<Person, String> {

    @Query("{'lastname': ?#{[0]} }")
    List<Person> findByQueryWithExpression(String param0);
}
```

--------------------------------

### MongoTemplate Find and Replace Documents

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Shows how to use the fluent update API with `replaceWith` to find and replace an entire document based on a query, including options like `upsert` and projection. It highlights key steps of the operation.

```java
Optional<User> result = template.update(Person.class)      <1>
    .matching(query(where("firstame").is("Tom")))          <2>
    .replaceWith(new Person("Dick"))
    .withOptions(FindAndReplaceOptions.options().upsert()) <3>
    .as(User.class)                                        <4>
    .findAndReplace();                                     <5>
```

--------------------------------

### Configuring MongoDB Read Preferences

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Shows how to configure MongoDB's read preferences using annotations like `@ReadPreference` and the `readPreference` attribute within the `@Query` annotation. It covers repository-level defaults and method-specific overrides.

```java
@ReadPreference("primaryPreferred")
public interface PersonRepository extends CrudRepository<Person, String> {

    @ReadPreference("secondaryPreferred")
    List<Person> findWithReadPreferenceAnnotationByLastname(String lastname);

    @Query(readPreference = "nearest")
    List<Person> findWithReadPreferenceAtTagByFirstname(String firstname);

    List<Person> findWithReadPreferenceAtTagByFirstname(String firstname);
}
```

--------------------------------

### Access Index Information with MongoTemplate

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-collection-management.adoc

Shows how to retrieve information about all indexes defined on a MongoDB collection using `MongoTemplate` or `ReactiveMongoTemplate`. The `getIndexInfo` method returns a list of `IndexInfo` objects.

```java
template.indexOps(Person.class)
    .ensureIndex(new Index().on("age", Order.DESCENDING).unique());

List<IndexInfo> indexInfoList = template.indexOps(Person.class)
   .getIndexInfo();
```

```java
Mono<String> ageIndex = template.indexOps(Person.class)
    .ensureIndex(new Index().on("age", Order.DESCENDING).unique());

Flux<IndexInfo> indexInfo = ageIndex.then(template.indexOps(Person.class)
   .getIndexInfo());
```

--------------------------------

### Spring Data MongoDB: Lookup with SpEL Placeholders

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/document-references.adoc

Shows how to use SpEL placeholders within the @DocumentReference lookup query to dynamically form the reference document. The placeholder 'acc' is used here to match a field in the target 'Publisher' document.

```java
@Document
class Book {

  @Id
  ObjectId id;
  String title;
  List<String> author;

  @DocumentReference(lookup = "{ 'acronym' : ?#{acc} }" ) <1> <2>
  Publisher publisher;
}

@Document
class Publisher {

  @Id
  ObjectId id;
  String acronym;                                        <1>
  String name;

  // ...
}
```

```json
/* Book Document */
{
  "_id" : 9a48e32,
  "title" : "The Warded Man",
  "author" : ["Peter V. Brett"],
  "publisher" : {
    "acc" : "DOC"
  }
}
```

--------------------------------

### Execute and Register MongoDB Scripts with ScriptOperations

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-server-side-scripts.adoc

This snippet demonstrates using Spring Data MongoDB's ScriptOperations to interact with server-side JavaScript. It shows how to execute a script directly, register a script with a name for later use, and call a registered script with parameters.

```java
ScriptOperations scriptOps = template.scriptOps();

ExecutableMongoScript echoScript = new ExecutableMongoScript("function(x) { return x; }");
scriptOps.execute(echoScript, "directly execute script");     

scriptOps.register(new NamedMongoScript("echo", echoScript)); 
scriptOps.call("echo", "execute script via name");            
```

--------------------------------

### Maven Configuration for Annotation Processing

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/repositories/core-extensions.adoc

Configures Maven to use the Spring Data MongoDB annotation processor and includes necessary dependencies for Querydsl integration. It specifies the annotation processor class and directories for generated sources.

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.data</groupId>
        <artifactId>spring-data-mongodb</artifactId>
    </dependency>

    <dependency>
        <groupId>com.querydsl</groupId>
        <artifactId>querydsl-mongodb</artifactId>
        <version>${querydslVersion}</version>

        <!-- Recommended: Exclude the mongo-java-driver to avoid version conflicts -->
        <exclusions>
            <exclusion>
                <groupId>org.mongodb</groupId>
                <artifactId>mongo-java-driver</artifactId>
            </exclusion>
        </exclusions>
    </dependency>

    <dependency>
        <groupId>com.querydsl</groupId>
        <artifactId>querydsl-apt</artifactId>
        <version>${querydslVersion}</version>
        <classifier>jakarta</classifier>
        <scope>provided</scope>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <configuration>
                <annotationProcessors>
                    <annotationProcessor>
                        org.springframework.data.mongodb.repository.support.MongoAnnotationProcessor
                    </annotationProcessor>
                </annotationProcessors>

                <!-- Recommended: Some IDE's might require this configuration to include generated sources for IDE usage -->
                <generatedTestSourcesDirectory>target/generated-test-sources</generatedTestSourcesDirectory>
                <generatedSourcesDirectory>target/generated-sources</generatedSourcesDirectory>
            </configuration>
        </plugin>
    </plugins>
</build>
```

--------------------------------

### Reactive GridFS: Find Files

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-gridfs.adoc

Demonstrates how to find files in GridFS using the `ReactiveGridFsTemplate`. It utilizes a `Query` object to specify search criteria, such as filename. Note that any sort criteria defined on the `Query` instance are disregarded by the current MongoDB driver for GridFS operations.

```java
class ReactiveGridFsClient {

  @Autowired
  ReactiveGridFsTemplate operations;

  @Test
  public Flux<GridFSFile> findFilesInGridFs() {
    return operations.find(query(whereFilename().is("filename.txt")))
  }
}
```

--------------------------------

### PropertyValueConverter Implementation

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/property-converters.adoc

Demonstrates a basic implementation of a PropertyValueConverter for reversing string values. It includes the read and write methods, utilizing ValueConversionContext for additional information.

```java
class ReversingValueConverter implements PropertyValueConverter<String, String, ValueConversionContext> {

  @Override
  public String read(String value, ValueConversionContext context) {
    return reverse(value);
  }

  @Override
  public String write(String value, ValueConversionContext context) {
    return reverse(value);
  }
}
```

--------------------------------

### Spring Data MongoDB Maven Dependencies

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/README.adoc

Provides the Maven dependency configurations for integrating Spring Data MongoDB into a project. Includes the standard dependency for release versions and an alternative for snapshot versions, along with the necessary repository declaration for snapshots.

```xml
<dependency>
  <groupId>org.springframework.data</groupId>
  <artifactId>spring-data-mongodb</artifactId>
  <version>${version}</version>
</dependency>
```

```xml
<dependency>
  <groupId>org.springframework.data</groupId>
  <artifactId>spring-data-mongodb</artifactId>
  <version>${version}-SNAPSHOT</version>
</dependency>

<repository>
  <id>spring-snapshot</id>
  <name>Spring Snapshot Repository</name>
  <url>https://repo.spring.io/snapshot</url>
</repository>
```

--------------------------------

### Spring Data MongoDB Command Metrics

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/observability/metrics.adoc

Details the observability metrics for MongoDB command executions within Spring Data MongoDB. It includes metric names, types, and a comprehensive list of low-cardinality key-value pairs used for tagging observations, such as connection details, collection names, database operations, and network peer information.

```APIDOC
Mongodb Command Observation:
  Description: Timer created around a MongoDB command execution.

  Metrics:
    - spring.data.mongodb.command: Type timer
    - spring.data.mongodb.command.active: Type long task timer

  KeyValues (Low Cardinality):
    - db.connection_string (required): MongoDB connection string.
    - db.mongodb.collection (required): MongoDB collection name.
    - db.name (required): MongoDB database name.
    - db.operation (required): MongoDB command value.
    - db.system (required): MongoDB database system.
    - db.user (required): MongoDB user.
    - net.peer.name (required): Name of the database host.
    - net.peer.port (required): Logical remote port number.
    - net.sock.peer.addr (required): Mongo peer address.
    - net.sock.peer.port (required): Mongo peer port.
    - net.transport (required): Network transport.
    - spring.data.mongodb.cluster_id (required): MongoDB cluster identifier.

  Notes:
    - KeyValues that are added after starting the Observation might be missing from the *.active metrics.
    - Micrometer internally uses `nanoseconds` for the baseunit. However, each backend determines the actual baseunit. (i.e. Prometheus uses seconds)
```

--------------------------------

### Reactive Query with SpEL Expression

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Illustrates a reactive Spring Data MongoDB repository method employing a SpEL expression for dynamic query parameter binding. The SpEL expression `?#{[0]}` accesses the first method argument.

```java
public interface PersonRepository extends ReactiveMongoRepository<Person, String> {

    @Query("{'lastname': ?#{[0]} }")
    Flux<Person> findByQueryWithExpression(String param0);
}
```

--------------------------------

### Store File to GridFS (Imperative)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-gridfs.adoc

Illustrates how to store a file to GridFS using an injected `GridFsOperations` instance. The `store` method accepts an `InputStream`, filename, and optional metadata, which can be any object marshaled by the configured `MongoConverter`.

```java
class GridFsClient {

  @Autowired
  GridFsOperations operations;

  @Test
  public void storeFileToGridFs() {

    FileMetadata metadata = new FileMetadata();
    // populate metadata
    Resource file = … // lookup File or Resource

    operations.store(file.getInputStream(), "filename.txt", metadata);
  }
}
```

--------------------------------

### Kotlin: Type-Safe Queries with Property References

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/kotlin/extensions.adoc

Illustrates building type-safe MongoDB queries in Kotlin using property references for improved readability and compile-time safety. It covers basic equality, existence checks, range queries, bitwise operations, and nested property access.

```kotlin
import org.springframework.data.mongodb.core.query.*

mongoOperations.find<Book>(
  Query(Book::title isEqualTo "Moby-Dick")               <1>
)

mongoOperations.find<Book>(
  Query(titlePredicate = Book::title exists true)
)

mongoOperations.find<Book>(
  Query(
    Criteria().andOperator(
      Book::price gt 5,
      Book::price lt 10
    ))
)

// Binary operators
mongoOperations.find<BinaryMessage>(
  Query(BinaryMessage::payload bits { allClear(0b101) }) <2>
)

// Nested Properties (i.e. refer to "book.author")
mongoOperations.find<Book>(
  Query(Book::author / Author::name regex "^H")          <3>
)
```

--------------------------------

### MongoTemplate findAndModify Overloaded Methods

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Lists the various overloaded `findAndModify` methods provided by `MongoTemplate` for updating documents and converting them to POJOs.

```java
<T> T findAndModify(Query query, Update update, Class<T> entityClass);

<T> T findAndModify(Query query, Update update, Class<T> entityClass, String collectionName);

<T> T findAndModify(Query query, Update update, FindAndModifyOptions options, Class<T> entityClass);

<T> T findAndModify(Query query, Update update, FindAndModifyOptions options, Class<T> entityClass, String collectionName);
```

--------------------------------

### Supported SpEL to MongoDB Expression Transformations

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

Lists common SpEL expressions and their equivalent MongoDB aggregation expression parts, covering logical, comparison, and arithmetic operations. This table serves as a reference for integrating SpEL with MongoDB aggregation.

```APIDOC
Supported SpEL transformations:

| SpEL Expression | Mongo Expression Part |
| a == b | { $eq : [$a, $b] } |
| a != b | { $ne : [$a , $b] } |
| a > b | { $gt : [$a, $b] } |
| a >= b | { $gte : [$a, $b] } |
| a < b | { $lt : [$a, $b] } |
| a <= b | { $lte : [$a, $b] } |
| a + b | { $add : [$a, $b] } |
| a - b | { $subtract : [$a, $b] } |
| a * b | { $multiply : [$a, $b] } |
| a / b | { $divide : [$a, $b] } |
| a^b | { $pow : [$a, $b] } |
| a % b | { $mod : [$a, $b] } |
| a && b | { $and : [$a, $b] } |
| a || b | { $or : [$a, $b] } |
| !a | { $not : [$a] } |
```

--------------------------------

### Projecting Computed Fields with Expressions

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Demonstrates projecting computed fields using native MongoDB expressions, AggregationExpressions, and SpEL. It covers assigning the projected field name and mapping field names to the domain model.

```java
query.fields()
  .project(MongoExpression.create("'$toUpper' : '$last_name'"))
  .as("last_name");

query.fields()
  .project(StringOperators.valueOf("lastname").toUpper())
  .as("last_name");

query.fields()
  .project(AggregationSpELExpression.expressionOf("toUpper(lastname)"))
  .as("last_name");
```

--------------------------------

### Change Streams with MessageListener

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/change-streams.adoc

Demonstrates using the synchronous MongoDB Java driver with Spring Data MongoDB's `MessageListenerContainer` to process change stream events. It covers creating a container, defining a listener, setting up a `ChangeStreamRequest`, registering it, and managing the container's lifecycle.

```java
MessageListenerContainer container = new DefaultMessageListenerContainer(template);
container.start();                                                                                              

MessageListener<ChangeStreamDocument<Document>, User> listener = System.out::println;                           
ChangeStreamRequestOptions options = new ChangeStreamRequestOptions("db", "user", ChangeStreamOptions.empty()); 

Subscription subscription = container.register(new ChangeStreamRequest<>(listener, options), User.class);       

// ...

container.stop();                                                                                               
```

--------------------------------

### Register MongoDB Micrometer Customizer

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/observability/observability.adoc

Registers a `MongoClientSettingsBuilderCustomizer` bean to integrate Spring Data MongoDB with Micrometer's `ObservationRegistry`. This customizer applies the `ContextProviderFactory` and adds a `MongoObservationCommandListener` to enable observability.

```java
@Bean
MongoClientSettingsBuilderCustomizer mongoMetricsSynchronousContextProvider(ObservationRegistry registry) {
    return (clientSettingsBuilder) -> {
        clientSettingsBuilder.contextProvider(ContextProviderFactory.create(registry))
                             .addCommandListener(new MongoObservationCommandListener(registry));
    };
}
```

--------------------------------

### Spring Data MongoDB: Apply Index Hints to Repository Queries

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

This snippet demonstrates how to use index hints to optimize query performance in Spring Data MongoDB. The @Hint annotation or the hint attribute within @Query allows developers to explicitly specify which index MongoDB should use, overriding its default index selection.

```java
@Hint("lastname-idx")
List<Person> findByLastname(String lastname);

@Query(value = "{ 'firstname' : ?0 }", hint = "firstname-idx")
List<Person> findByFirstname(String firstname);
```

--------------------------------

### Venue Java Class Definition

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Defines the Venue class used for GeoSpatial queries, including fields for ID, name, and location, with constructors and getters.

```java
@Document(collection="newyork")
public class Venue {

  @Id
  private String id;
  private String name;
  private double[] location;

  @PersistenceCreator
  Venue(String name, double[] location) {
    super();
    this.name = name;
    this.location = location;
  }

  public Venue(String name, double x, double y) {
    super();
    this.name = name;
    this.location = new double[] { x, y };
  }

  public String getName() {
    return name;
  }

  public double[] getLocation() {
    return location;
  }

  @Override
  public String toString() {
    return "Venue [id=" + id + ", name=" + name + ", location="
        + Arrays.toString(location) + "]";
  }
}
```

--------------------------------

### Configuring Read Preferences in Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

This snippet illustrates how to configure MongoDB read preferences using the @ReadPreference annotation on a repository interface and its methods. It also shows how to define read preferences directly within the @Query annotation and explains the precedence rules for these configurations.

```Java
@ReadPreference("primaryPreferred")
public interface PersonRepository extends CrudRepository<Person, String> {

    @ReadPreference("secondaryPreferred")
    List<Person> findWithReadPreferenceAnnotationByLastname(String lastname);

    @Query(readPreference = "nearest")
    List<Person> findWithReadPreferenceAtTagByFirstname(String firstname);

    List<Person> findWithReadPreferenceAtTagByFirstname(String firstname);
```

--------------------------------

### IndexOperations and ReactiveIndexOperations Interfaces

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-collection-management.adoc

Defines methods for managing MongoDB indexes. Includes operations for ensuring, altering, dropping, and retrieving index information for both imperative and reactive Spring Data MongoDB templates.

```APIDOC
IndexOperations:
  ensureIndex(IndexDefinition indexDefinition): String
    Ensures an index for the provided IndexDefinition exists.
  alterIndex(String name, IndexOptions options): void
    Alters an existing index with new options.
  dropIndex(String name): void
    Drops an index by its name.
  dropAllIndexes(): void
    Drops all indexes on the collection.
  getIndexInfo(): List<IndexInfo>
    Retrieves information about all indexes on the collection.

ReactiveIndexOperations:
  ensureIndex(IndexDefinition indexDefinition): Mono<String>
    Ensures an index for the provided IndexDefinition exists, returning a Mono.
  alterIndex(String name, IndexOptions options): Mono<Void>
    Alters an existing index with new options, returning a Mono<Void>.
  dropIndex(String name): Mono<Void>
    Drops an index by its name, returning a Mono<Void>.
  dropAllIndexes(): Mono<Void>
    Drops all indexes on the collection, returning a Mono<Void>.
  getIndexInfo(): Flux<IndexInfo>
    Retrieves information about all indexes on the collection, returning a Flux.
```

--------------------------------

### MongoDB Vector Search Aggregation Stage

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/partials/vector-search-repository-include.adoc

Provides guidance on the MongoDB vector search aggregation stage, highlighting the requirement to include necessary arguments like `limit` and adhere to defined restrictions.

```APIDOC
MongoDB Vector Search Aggregation Stage:
  - Required Arguments: Must include arguments such as `limit`.
  - Restrictions: Adhere to all guidelines and restrictions defined for the vector search stage.
  - Reference: https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-stage/
```

--------------------------------

### Full-Text Search with Exclusion and Phrases

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Demonstrates advanced full-text search capabilities, including excluding specific terms using a '-' prefix or the `notMatching` method, and searching for exact phrases using double quotes or the `phrase` method. These features allow for more precise query construction.

```java
// search for 'coffee' and not 'cake'
TextQuery.queryText(new TextCriteria().matching("coffee").matching("-cake"));
TextQuery.queryText(new TextCriteria().matching("coffee").notMatching("cake"));

// search for phrase 'coffee cake'
TextQuery.queryText(new TextCriteria().matching("\"coffee cake\""));
TextQuery.queryText(new TextCriteria().phrase("coffee cake"));
```

--------------------------------

### Imperative Query with MongoTemplate

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-api.adoc

Demonstrates an imperative query using MongoTemplate to retrieve a list of Jedi objects from a specific collection, applying a query filter.

```java
List<Jedi> all = template.query(SWCharacter.class)
  .inCollection("star-wars")
  .as(Jedi.class)
  .matching(query(where("jedi").is(true)))
  .all();
```

--------------------------------

### Spring Data MongoDB: Paginated Aggregation with Pageable

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Enables pagination for aggregation results by accepting a `Pageable` argument. `$skip`, `$limit`, and `$sort` operators are appended to the pipeline. Methods accepting `Pageable` can return `Slice` for easier pagination.

```java
@Aggregation("{ $group: { _id : $lastname, names : { $addToSet : ?0 } } }")
  Slice<PersonAggregate> groupByLastnameAnd(String property, Pageable page);
```

--------------------------------

### Java: Retrieve All SWCharacter Objects

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/kotlin/extensions.adoc

Demonstrates fetching all `SWCharacter` objects from a MongoDB table using Spring Data MongoDB in Java. It utilizes the `template.query()` method to specify the entity class and the `inTable()` and `all()` methods to execute the query.

```java
Flux<SWCharacter> characters = template.query(SWCharacter.class).inTable("star-wars").all()
```

--------------------------------

### Query Vector Index

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-search-indexes.adoc

Shows how to query a vector index using the `$vectorSearch` aggregation stage in Java and MongoDB Shell. It specifies the index name, vector path, query vector, candidate count, and limit for results.

```java
VectorSearchOperation search = VectorSearchOperation.search("vector_index") <1>
  .path("plotEmbedding") <2>
  .vector( ... )
  .numCandidates(150)
  .limit(10)
  .withSearchScore("score"); <3>

AggregationResults<MovieWithSearchScore> results = mongoTemplate
  .aggregate(newAggregation(Movie.class, search), MovieWithSearchScore.class);
```

```console
db.embedded_movies.aggregate([
  {
    "$vectorSearch": {
      "index": "vector_index",
      "path": "plot_embedding", <1>
      "queryVector": [ ... ],
      "numCandidates": 150,
      "limit": 10
    }
  },
  {
    "$addFields": {
      "score": { $meta: "vectorSearchScore" }
    }
  }
])
```

--------------------------------

### Imperative ClientSession Usage

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/client-session-transactions.adoc

Demonstrates how to use a MongoDB ClientSession with Spring Data MongoDB's imperative template. It shows obtaining a session, executing operations within the session context using `template.withSession().execute()`, and properly closing the session. Operations within the session are automatically associated with it.

```java
ClientSessionOptions sessionOptions = ClientSessionOptions.builder()
    .causallyConsistent(true)
    .build();

ClientSession session = client.startSession(sessionOptions); 

template.withSession(() -> session)
    .execute(action -> {

        Query query = query(where("name").is("Durzo Blint"));
        Person durzo = action.findOne(query, Person.class);  

        Person azoth = new Person("Kylar Stern");
        azoth.setMaster(durzo);

        action.insert(azoth);                                

        return azoth;
    });

session.close();
```

--------------------------------

### Spring Data MongoDB: Sort Query Results in Imperative and Reactive Repositories

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

This section showcases various methods for defining the sorting order of query results in both imperative and reactive Spring Data MongoDB repositories. It covers static sorting derived from method names, dynamic sorting using Sort objects, and explicit sorting definitions via the @Query annotation.

```java
public interface PersonRepository extends MongoRepository<Person, String> {

    List<Person> findByFirstnameSortByAgeDesc(String firstname);

    List<Person> findByFirstname(String firstname, Sort sort);

    @Query(sort = "{ age : -1 }")
    List<Person> findByFirstname(String firstname);

    @Query(sort = "{ age : -1 }")
    List<Person> findByLastname(String lastname, Sort sort);
}
```

```java
public interface PersonRepository extends ReactiveMongoRepository<Person, String> {

    Flux<Person> findByFirstnameSortByAgeDesc(String firstname);

    Flux<Person> findByFirstname(String firstname, Sort sort);

    @Query(sort = "{ age : -1 }")
    Flux<Person> findByFirstname(String firstname);

    @Query(sort = "{ age : -1 }")
    Flux<Person> findByLastname(String lastname, Sort sort);
}
```

--------------------------------

### Configure Sharded Collections with MongoDB Client API

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/sharding.adoc

Configure sharding for MongoDB collections programmatically using the MongoDB client API. This involves enabling sharding for the target database and then sharding a specific collection with a defined shard key. These commands must be executed against the 'admin' database.

```java
MongoDatabase adminDB = template.getMongoDbFactory()
    .getMongoDatabase("admin");

adminDB.runCommand(new Document("enableSharding", "db"));

Document shardCmd = new Document("shardCollection", "db.users")
	.append("key", new Document("country", 1).append("userid", 1));

adminDB.runCommand(shardCmd);
```

--------------------------------

### Reactive ClientSession Usage

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/client-session-transactions.adoc

Illustrates the use of MongoDB ClientSession with Spring Data MongoDB's reactive template. It shows obtaining a session as a Publisher, executing operations reactively using `template.withSession(session).execute()`, and ensuring the session is closed using a `doFinally` hook or similar mechanism. This approach defers session acquisition until subscription.

```java
ClientSessionOptions sessionOptions = ClientSessionOptions.builder()
.causallyConsistent(true)
.build();

Publisher<ClientSession> session = client.startSession(sessionOptions); 

template.withSession(session)
.execute(action -> {

        Query query = query(where("name").is("Durzo Blint"));
        return action.findOne(query, Person.class)
            .flatMap(durzo -> {

                Person azoth = new Person("Kylar Stern");
                azoth.setMaster(durzo);

                return action.insert(azoth);                            
            });
    }, ClientSession::close)                                            
    .subscribe();
```

--------------------------------

### Programmatic Transaction Control (Reactive Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/client-session-transactions.adoc

Illustrates manual transaction management in Spring Data MongoDB using the reactive Java model. It utilizes Reactor's Mono to manage the lifecycle of a ClientSession and its associated transaction, handling commit, abort, and session closure.

```java
Mono<DeleteResult> result = Mono
    .from(client.startSession())                                                             <1>

    .flatMap(session -> {
        session.startTransaction();                                                          <2>

        return Mono.from(collection.deleteMany(session, ...))                                <3> // Example operation

            .onErrorResume(e -> Mono.from(session.abortTransaction()).then(Mono.error(e)))   <4> 

            .flatMap(val -> Mono.from(session.commitTransaction()).then(Mono.just(val)))     <5> 

            .doFinally(signal -> session.close());                                           <6> 
      });
```

--------------------------------

### Create Geospatial Index with MongoTemplate

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-collection-management.adoc

Illustrates creating a geospatial index on a collection using `MongoTemplate`. It uses the `ensureIndex` method with a `GeospatialIndex` definition for location data, improving performance for geospatial queries.

```java
template.indexOps(Venue.class)
    .ensureIndex(new GeospatialIndex("location"));
```

--------------------------------

### Basic Update with MongoTemplate

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Demonstrates a typical update operation using `MongoTemplate`. It targets documents matching a specific query and applies an update, such as incrementing a balance within an array element.

```Java
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.query.Query;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import reactor.core.publisher.Mono;
import com.mongodb.client.result.UpdateResult;

// Assuming 'template' is an instance of ReactiveMongoTemplate or MongoTemplate
// and 'Account' is your entity class with an 'accounts' field which is an array.
// 'Type.SAVINGS' is an enum value for accountType.

Mono<UpdateResult> result = template.update(Account.class)
    .matching(where("accounts.accountType").is(Type.SAVINGS))
    .apply(new Update().inc("accounts.$.balance", 50.00))
    .all();
```

--------------------------------

### Setting Cursor Batch Size

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Defines the number of documents to return in each response batch for a MongoDB query. This is controlled via the `cursorBatchSize` method on the `Query` object.

```java
Query query = query(where("firstname").is("luke"))
    .cursorBatchSize(100);
```

--------------------------------

### Enable Imperative MongoDB Auditing with Java Config

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/auditing.adoc

Enables auditing for imperative Spring Data MongoDB applications using Java configuration. Requires the @EnableMongoAuditing annotation and an AuditorAware bean for user identification.

```java
@Configuration
@EnableMongoAuditing
class Config {

  @Bean
  public AuditorAware<AuditableUser> myAuditorProvider() {
      return new AuditorAwareImpl();
  }
}
```

--------------------------------

### Adding Custom Aggregation Stage with $search (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

Illustrates how to include unsupported aggregation stages, such as MongoDB Atlas `$search`, by providing their JSON representation using `Aggregation.stage`. This allows integration of advanced features not directly mapped by Spring Data MongoDB.

```Java
Aggregation.stage("{
    $search : {
        \"near\": {
          \"path\": \"released\",
          \"origin\": { \"$date\" : { \"$numberLong\" : \"...\" } } ,
          \"pivot\": 7
        }
      }
    }");
```

--------------------------------

### Kotlin: Type-Safe Updates with Property References

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/kotlin/extensions.adoc

Demonstrates performing type-safe updates on MongoDB documents in Kotlin using property references. It shows how to construct update operations like setting values, incrementing numbers, and adding elements to collections.

```kotlin
mongoOperations.updateMulti<Book>(
  Query(Book::title isEqualTo "Moby-Dick"),
  update(Book::title, "The Whale")                        <1>
    .inc(Book::price, 100)                               <2>
    .addToSet(Book::authors, "Herman Melville")          <3>
)
```

--------------------------------

### Programmatic Hashed Index Creation

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-index-management.adoc

Shows how to programmatically ensure a hashed index is created for a specific field using Spring Data MongoDB's IndexOperations. This provides more control over index creation.

```java
mongoOperations.indexOpsFor(Jedi.class)
  .ensureIndex(HashedIndex.hashed("useTheForce"));
```

--------------------------------

### MongoDB Collection Configuration for Queryable Encryption

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-encryption.adoc

Defines a MongoDB collection schema with encrypted fields, including equality and range query configurations for Queryable Encryption (QE). It specifies `keyId`, `path`, `bsonType`, and `queries` with `queryType` and `contention`.

```json
{
    name: 'patient',
    type: 'collection',
    options: {
      encryptedFields: {
        escCollection: 'enxcol_.test.esc',
        ecocCollection: 'enxcol_.test.ecoc',
        fields: [
          {
            keyId: ...,
            path: 'ssn',
            bsonType: 'string',
            queries: [ { queryType: 'equality', contention: Long('0') } ]
          },
          {
            keyId: ...,
            path: 'age',
            bsonType: 'int',
            queries: [ { queryType: 'range', contention: Long('8'), min: 0, max: 150 } ]
          },
          {
            keyId: ...,
            path: 'pin',
            bsonType: 'string'
          },
          {
            keyId: ...,
            path: 'address.sign',
            bsonType: 'long',
            queries: [ { queryType: 'range', contention: Long('2'), min: Long('-10'), max: Long('10') } ]
          }
        ]
      }
    }
}
```

--------------------------------

### Enable Reactive MongoDB Auditing with Java Config

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/auditing.adoc

Enables auditing for reactive Spring Data MongoDB applications using Java configuration. Requires the @EnableReactiveMongoAuditing annotation and a ReactiveAuditorAware bean for user identification.

```java
@Configuration
@EnableReactiveMongoAuditing
class Config {

  @Bean
  public ReactiveAuditorAware<AuditableUser> myAuditorProvider() {
      return new ReactiveAuditorAwareImpl();
  }
}
```

--------------------------------

### MongoTemplate findAndModify with Upsert Option

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Illustrates how to use `FindAndModifyOptions` to perform an upsert operation with `findAndModify`, creating a new document if no match is found.

```java
Person upserted = template.update(Person.class)
  .matching(new Query(Criteria.where("firstName").is("Mary")))
  .apply(update)
  .withOptions(FindAndModifyOptions.options().upsert(true).returnNew(true))
  .findAndModifyValue()
```

--------------------------------

### Registering Custom Converters in Spring Configuration

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/custom-conversions.adoc

Shows how to register custom `Converter` implementations with Spring Data MongoDB's `MongoConverter` by extending `AbstractMongoClientConfiguration` and overriding `configureConverters`.

```java
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.convert.MongoConverterConfigurationAdapter;

class MyMongoConfiguration extends AbstractMongoClientConfiguration {

	@Override
	public String getDatabaseName() {
		return "database";
	}

	@Override
	protected void configureConverters(MongoConverterConfigurationAdapter adapter) {
		adapter.registerConverter(new com.example.PersonReadConverter());
		adapter.registerConverter(new com.example.PersonWriteConverter());
	}
}
```

--------------------------------

### Perform Geo-Near Query with NearQuery

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Demonstrates how to use `NearQuery` to find entities near a specific location within a maximum distance, using `MongoOperations.geoNear()`.

```java
Point location = new Point(-73.99171, 40.738868);
NearQuery query = NearQuery.near(location).maxDistance(new Distance(10, Metrics.MILES));

GeoResults<Restaurant> = operations.geoNear(query, Restaurant.class);
```

--------------------------------

### TransactionTemplate Control (Imperative Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/client-session-transactions.adoc

Shows how to use Spring Data MongoDB's TransactionTemplate for simplified imperative transaction management. This approach abstracts away much of the manual session and transaction lifecycle handling.

```java
template.setSessionSynchronization(ALWAYS);                                     <1>

// ...

TransactionTemplate txTemplate = new TransactionTemplate(anyTxManager);         <2> // Assuming anyTxManager is a PlatformTransactionManager

txTemplate.execute(new TransactionCallbackWithoutResult() {

    @Override
    protected void doInTransactionWithoutResult(TransactionStatus status) {     <3> // TransactionStatus is managed by TransactionTemplate

        Step step = // ...; // Example step object
        template.insert(step);

        process(step);

        template.update(Step.class).apply(Update.set("state", // ...
    }
});
```

--------------------------------

### Spring Data MongoDB: Project Single Field to List of Strings

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Projects only the `lastname` field from documents and returns them as a `List` of `String` values, demonstrating direct extraction of single values from multiple result documents.

```java
@Aggregation("{ '$project': { '_id' : '$lastname' } }")
  List<String> findAllLastnames();
```

--------------------------------

### Spring Data MongoDB AOT Eligible Methods

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aot.adoc

Lists the types of methods in Spring Data MongoDB that are eligible for AOT repository processing, including derived queries, annotated queries, and specific return types.

```APIDOC
SpringDataMongoDB_AOT_EligibleMethods:
  Supported Features:
    - Derived find, count, exists, and delete methods
    - Query methods annotated with @Query (excluding SpEL)
    - Methods annotated with @Aggregation, @Update, and @VectorSearch
    - @Hint, @Meta, and @ReadPreference support
    - Page, Slice, and Optional return types
    - DTO Projections

  Limitations:
    - @Meta.allowDiskUse and flags are not evaluated.
    - Limited Collation detection.

  Excluded Methods:
    - CrudRepository and other base interface methods
    - Querydsl and Query by Example methods
    - Query Methods obtaining MQL from a file
```

--------------------------------

### Spring Data MongoDB Query Keywords

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

This section details various query keywords used in Spring Data MongoDB repository methods and their corresponding MongoDB query projections. It covers string operations, collection containment, boolean checks, existence checks, and case-insensitive searches.

```APIDOC
Query Keywords and Projections:

`NotLike` / `IsNotLike`:
  `findByFirstnameNotLike(String name)`
  - Description: Finds documents where the 'firstname' field does not match the provided regex pattern.
  - Projection: `{"firstname" : { "$not" : name }}` (name as regex)

`Containing` on String:
  `findByFirstnameContaining(String name)`
  - Description: Finds documents where the 'firstname' field contains the provided regex pattern.
  - Projection: `{"firstname" : name}` (name as regex)

`NotContaining` on String:
  `findByFirstnameNotContaining(String name)`
  - Description: Finds documents where the 'firstname' field does not contain the provided regex pattern.
  - Projection: `{"firstname" : { "$not" : name}}` (name as regex)

`Containing` on Collection:
  `findByAddressesContaining(Address address)`
  - Description: Finds documents where the 'addresses' collection contains the specified address object.
  - Projection: `{"addresses" : { "$in" : address}}`

`NotContaining` on Collection:
  `findByAddressesNotContaining(Address address)`
  - Description: Finds documents where the 'addresses' collection does not contain the specified address object.
  - Projection: `{"addresses" : { "$not" : { "$in" : address}}}`

`Regex`:
  `findByFirstnameRegex(String firstname)`
  - Description: Finds documents where the 'firstname' field matches the provided regex pattern.
  - Projection: `{"firstname" : {"$regex" : firstname }}`

`(No keyword)`:
  `findByFirstname(String name)`
  - Description: Finds documents where the 'firstname' field exactly matches the provided value.
  - Projection: `{"firstname" : name}`

`Not`:
  `findByFirstnameNot(String name)`
  - Description: Finds documents where the 'firstname' field does not exactly match the provided value.
  - Projection: `{"firstname" : {"$ne" : name}}`

`IsTrue` / `True`:
  `findByActiveIsTrue()`
  - Description: Finds documents where the 'active' field is true.
  - Projection: `{"active" : true}`

`IsFalse` / `False`:
  `findByActiveIsFalse()`
  - Description: Finds documents where the 'active' field is false.
  - Projection: `{"active" : false}`

`Exists`:
  `findByLocationExists(boolean exists)`
  - Description: Finds documents where the 'location' field either exists (if true) or does not exist (if false).
  - Projection: `{"location" : {"$exists" : exists }}`

`IgnoreCase`:
  `findByUsernameIgnoreCase(String username)`
  - Description: Finds documents where the 'username' field matches the provided value, ignoring case.
  - Projection: `{"username" : {"$regex" : "^username$", "$options" : "i" }}`

NOTE: If the property criterion compares a document, the order of the fields and exact equality in the document matters.
```

--------------------------------

### Performing MapReduce with Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-mapreduce.adoc

This Java snippet shows how to execute a MapReduce operation using `mongoOperations.mapReduce`. It includes constructing a `Query` to filter documents, specifying input collection ('jmr1'), JavaScript functions for map and reduce phases, and configuring output options like the output collection ('jmr1_out'). It also notes that `limit` and `sort` can be applied to the query, but `skip` is not supported for MapReduce.

```java
Query query = new Query(where("x").ne(new String[] { "a", "b" }));
MapReduceResults<ValueObject> results = mongoOperations.mapReduce(query, "jmr1", "classpath:map.js", "classpath:reduce.js",
                                                                     options().outputCollection("jmr1_out"), ValueObject.class);
```

--------------------------------

### Configure Automatic Encryption Settings in Java

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-encryption.adoc

Demonstrates how to configure `AutoEncryptionSettings` using `MongoClientSettingsBuilderCustomizer` for client-side field-level encryption. It involves creating a `MongoJsonSchema` and mapping it to a collection, requiring the MongoDB driver and Spring Data MongoDB dependencies.

```java
@Bean
MongoClientSettingsBuilderCustomizer customizer(MappingContext mappingContext) {
    return (builder) -> {

        // ... keyVaultCollection, kmsProvider, ...

        MongoJsonSchemaCreator schemaCreator = MongoJsonSchemaCreator.create(mappingContext);
        MongoJsonSchema patientSchema = schemaCreator
            .filter(MongoJsonSchemaCreator.encryptedOnly())
            .createSchemaFor(Patient.class);

        AutoEncryptionSettings autoEncryptionSettings = AutoEncryptionSettings.builder()
            .keyVaultNamespace(keyVaultCollection)
            .kmsProviders(kmsProviders)
            .extraOptions(extraOpts)
            .schemaMap(Collections.singletonMap("db.patient", patientSchema.schemaDocument().toBsonDocument()))
            .build();

        builder.autoEncryptionSettings(autoEncryptionSettings);
    };
}
```

--------------------------------

### Define Sample Person Entity (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/repositories.adoc

Defines a sample `Person` entity class with an `@Id` field, suitable for persistence in MongoDB. The `id` property is recognized by default as the document ID, supporting String, ObjectId, and BigInteger types.

```java
public class Person {

  @Id
  private String id;
  private String firstname;
  private String lastname;
  private Address address;

  // … getters and setters omitted
}
```

--------------------------------

### MongoDB Aggregation with Expression

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

Demonstrates calculating a 'salesPrice' field within a MongoDB aggregation pipeline using a SpEL expression that incorporates other fields and a variable.

```java
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.Document;
import java.util.List;

// Assuming 'mongoTemplate' and 'agg' are defined elsewhere
// Example snippet demonstrating an expression within aggregation:
// .andExpression("(netPrice * (1-discountRate)  + [0]) * (1+taxRate)", shippingCosts).as("salesPrice")

// AggregationResults<Document> result = mongoTemplate.aggregate(agg, Document.class);
// List<Document> resultList = result.getMappedResults();
```

--------------------------------

### Spring Data MongoDB Vector Search Methods

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/partials/vector-search-scoring-include.adoc

Demonstrates how to use the @VectorSearch annotation with different similarity criteria in Spring Data MongoDB repositories. It covers searching by a specific score, a similarity value, or a range of similarity values.

```java
interface CommentRepository extends Repository<Comment, String> {

  @VectorSearch(…) 
  SearchResults<Comment> searchTop10ByEmbeddingNear(Vector vector, Score similarity);

  @VectorSearch(…) 
  SearchResults<Comment> searchTop10ByEmbeddingNear(Vector vector, Similarity similarity);

  @VectorSearch(…) 
  SearchResults<Comment> searchTop10ByEmbeddingNear(Vector vector, Range<Similarity> range);
}

repository.searchByEmbeddingNear(Vector.of(…), Score.of(0.9)); 

repository.searchByEmbeddingNear(Vector.of(…), Similarity.of(0.9)); 

repository.searchByEmbeddingNear(Vector.of(…), Similarity.between(0.5, 1));
```

--------------------------------

### Perform Basic Group Operation in Java

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-group.adoc

Demonstrates the basic usage of Spring Data MongoDB's `group` operation using the `MongoTemplate`. It specifies the collection, a `GroupBy` object with initial document and reduce function, and the target POJO class for results. This method simplifies aggregation tasks similar to SQL's GROUP BY.

```java
GroupByResults<XObject> results = mongoTemplate.group("group_test_collection",
                                                      GroupBy.key("x").initialDocument("{ count: 0 }").reduceFunction("function(doc, prev) { prev.count += 1 }"),
                                                      XObject.class);

```

--------------------------------

### Customized Object Construction with @PersistenceCreator

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping.adoc

Explains how to customize the object construction process in Spring Data MongoDB by annotating a constructor with `@PersistenceCreator`. Parameter values are resolved by `@Value` annotations with SpEL expressions or by matching Java property names to document fields, requiring compilation with debug information or the `-parameters` flag.

```java
class OrderItem {

  private @Id String id;
  private int quantity;
  private double unitPrice;

  OrderItem(String id, @Value("#root.qty ?: 0") int quantity, double unitPrice) {
    this.id = id;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
  }

  // getters/setters ommitted
}

Document input = new Document("id", "4711");
input.put("unitPrice", 2.5);
input.put("qty",5);
OrderItem item = converter.read(OrderItem.class, input);
```

--------------------------------

### ReactiveQuerydslPredicateExecutor API (Reactive)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/repositories/core-extensions.adoc

Details the methods of the reactive `ReactiveQuerydslPredicateExecutor` interface for asynchronous, type-safe MongoDB queries. It covers finding entities, counting, and existence checks using reactive types like Mono and Flux.

```APIDOC
ReactiveQuerydslPredicateExecutor<T>:
  findOne(Predicate predicate): Mono<T>
    - Finds a single entity matching the predicate asynchronously.
    - Parameters:
      - predicate: The Querydsl predicate to apply.
    - Returns: A Mono emitting the found entity or an empty Mono if none matches.

  findAll(Predicate predicate): Flux<T>
    - Finds all entities matching the predicate asynchronously.
    - Parameters:
      - predicate: The Querydsl predicate to apply.
    - Returns: A Flux emitting all matching entities.

  findAll(Predicate predicate, Sort sort): Flux<T>
    - Finds all entities matching the predicate asynchronously, sorted by the provided Sort object.
    - Parameters:
      - predicate: The Querydsl predicate to apply.
      - sort: The Sort object specifying the ordering.
    - Returns: A Flux emitting sorted matching entities.

  findAll(Predicate predicate, OrderSpecifier<?>... orders): Flux<T>
    - Finds all entities matching the predicate asynchronously, ordered by the specified OrderSpecifiers.
    - Parameters:
      - predicate: The Querydsl predicate to apply.
      - orders: Varargs of OrderSpecifier for custom ordering.
    - Returns: A Flux emitting ordered matching entities.

  findAll(OrderSpecifier<?>... orders): Flux<T>
    - Finds all entities asynchronously, ordered by the specified OrderSpecifiers.
    - Parameters:
      - orders: Varargs of OrderSpecifier for custom ordering.
    - Returns: A Flux emitting ordered entities.

  count(Predicate predicate): Mono<Long>
    - Counts the number of entities matching the predicate asynchronously.
    - Parameters:
      - predicate: The Querydsl predicate to apply.
    - Returns: A Mono emitting the total count of matching entities.

  exists(Predicate predicate): Mono<Boolean>
    - Checks if any entity matches the predicate asynchronously.
    - Parameters:
      - predicate: The Querydsl predicate to apply.
    - Returns: A Mono emitting true if an entity matches, false otherwise.

  findBy(Predicate predicate, Function<FluentQuery.ReactiveFluentQuery<S>, P> queryFunction): P
    - Executes a custom query function against entities matching the predicate asynchronously.
    - Parameters:
      - predicate: The Querydsl predicate to apply.
      - queryFunction: A function defining the custom query logic using reactive fluent queries.
    - Returns: The result of the query function, typically a Publisher.
```

--------------------------------

### Updating Documents with MongoTemplate

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Illustrates how to update documents in MongoDB using Spring Data MongoDB's MongoTemplate and ReactiveMongoTemplate. It shows how to match documents based on criteria and apply updates, such as incrementing a field value.

```java
import static org.springframework.data.mongodb.core.query.Criteria.where;
import org.springframework.data.mongodb.core.query.Update;

UpdateResult result = template.update(Account.class)
    .matching(where("accounts.accountType").is(Type.SAVINGS))
    .apply(new Update().inc("accounts.$.balance", 50.00))
    .all();
```

```java
import static org.springframework.data.mongodb.core.query.Criteria.where;

Mono<UpdateResult> result = template.update(Account.class)
    .matching(where("accounts.accountType").is(Type.SAVINGS))
    .apply(new Update().inc("accounts.$.balance", 50.00))
    .all();
```

--------------------------------

### Implement WriteConcernResolver for Custom Write Concerns

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-config.adoc

Explains how to implement the `WriteConcernResolver` interface to define custom `WriteConcern` policies for different POJO classes during MongoDB write operations. It details the `MongoAction` parameter used to determine the appropriate `WriteConcern`.

```APIDOC
WriteConcernResolver
  - Description: Strategy interface for resolving `WriteConcern` on a per-operation basis.
  - Methods:
    - resolve(MongoAction action): WriteConcern
      - Description: Resolves the `WriteConcern` for a given MongoDB action.
      - Parameters:
        - action: `MongoAction` object containing contextual information about the operation (collection name, entity type, converted document, operation type, etc.).
      - Returns: The `WriteConcern` to be used for the operation.

Example Implementation:
public class MyAppWriteConcernResolver implements WriteConcernResolver {

  @Override
  public WriteConcern resolve(MongoAction action) {
    if (action.getEntityType().getSimpleName().contains("Audit")) {
      return WriteConcern.ACKNOWLEDGED;
    }
    // Default or other logic
    return WriteConcern.MAJORITY;
  }
}
```

--------------------------------

### Spring Data MongoDB Mapping Annotations Overview

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping.adoc

Provides an overview of annotations used for mapping Java objects to MongoDB documents in Spring Data MongoDB. These annotations control persistence, indexing, relationships, and more.

```APIDOC
Mapping Annotations:

* @Id: Applied at the field level to mark the field used for identity purpose.
* @MongoId: Applied at the field level to mark the field used for identity purpose. Accepts an optional `FieldType` to customize id conversion.
* @Document: Applied at the class level to indicate this class is a candidate for mapping to the database. You can specify the name of the collection where the data will be stored.
* @DBRef: Applied at the field to indicate it is to be stored using a com.mongodb.DBRef.
* @DocumentReference: Applied at the field to indicate it is to be stored as a pointer to another document. This can be a single value (the _id_ by default), or a `Document` provided via a converter.
* @Indexed: Applied at the field level to describe how to index the field.
* @CompoundIndex (repeatable): Applied at the type level to declare Compound Indexes.
* @GeoSpatialIndexed: Applied at the field level to describe how to geoindex the field.
* @TextIndexed: Applied at the field level to mark the field to be included in the text index.
* @HashIndexed: Applied at the field level for usage within a hashed index to partition data across a sharded cluster.
* @Language: Applied at the field level to set the language override property for text index.
* @Transient: By default, all fields are mapped to the document. This annotation excludes the field where it is applied from being stored in the database.
```

--------------------------------

### Spring Data MongoDB Mapping Annotations Overview

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping.adoc

Explains key annotations used in Spring Data MongoDB for mapping Java objects to MongoDB documents. Includes @PersistenceCreator for constructor selection, @Value for SpEL transformations, @Field for BSON field mapping, and @Version for optimistic locking.

```APIDOC
Annotations for Spring Data MongoDB Mapping:

* @PersistenceCreator: Marks a constructor or static factory method for object instantiation from the database. Constructor arguments are mapped by name to Document keys.

* @Value: Part of Spring Framework, can be applied to constructor arguments. Uses Spring Expression Language (SpEL) to transform retrieved database values before object construction. Reference document properties using expressions like `@Value("#root.myProperty")`.

* @Field: Applied at the field level to describe the name and type of the field in the MongoDB BSON document. Allows BSON field names and types to differ from class field names and types.

* @Version: Applied at the field level for optimistic locking. Checked for modifications on save operations. Initial value is zero (or one for primitives), automatically incremented on updates.
```

--------------------------------

### Document Reference with Collection Lookup

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/document-references.adoc

Explains how to specify a target collection dynamically using `collection = "?#{collection}"` in `@DocumentReference`. This requires a custom `Converter` to provide the collection name.

```java
class Entity {
  @DocumentReference(lookup = "{ '_id' : '?#{id}' }", collection = "?#{collection}") 
  private ReferencedObject ref;
}
```

```java
@WritingConverter
class ToDocumentPointerConverter implements Converter<ReferencedObject, DocumentPointer<Document>> {
	public DocumentPointer<Document> convert(ReferencedObject source) {
		return () -> new Document("id", source.id)                                   
                           .append("collection", … );                                
	}
}
```

```json
// entity
{
  "_id" : "8cfb002",
  "ref" : {
    "id" : "9a48e32",                                                                
    "collection" : "…"                                                               
  }
}
```

--------------------------------

### MongoDB Regex Query Patterns

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Provides common MongoDB query patterns using regular expressions for flexible string matching. Includes options for case-sensitive and case-insensitive searches, matching at the end of a string, containing a substring, or a general regex match.

```APIDOC
MongoDB Regex Query Patterns:

ENDING (case-sensitive):
  {"firstname" : { $regex: /firstname$/}}

ENDING (case-insensitive):
  {"firstname" : { $regex: /firstname$/, $options: 'i'}}

CONTAINING (case-sensitive):
  {"firstname" : { $regex: /.*firstname.*/}}

CONTAINING (case-insensitive):
  {"firstname" : { $regex: /.*firstname.*/, $options: 'i'}}

REGEX (case-sensitive):
  {"firstname" : { $regex: /firstname/}}

REGEX (case-insensitive):
  {"firstname" : { $regex: /firstname/, $options: 'i'}}
```

--------------------------------

### Spring Data MongoDB Vector Search API

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/partials/vector-search-scoring-include.adoc

Details the Spring Data MongoDB API for performing vector searches using similarity metrics. Explains the role of Score, Similarity, and Range objects in filtering search results based on vector embeddings.

```APIDOC
Spring Data MongoDB Vector Search API

MongoDB reports the score directly as similarity value. The scoring function must be specified in the index and therefore, Vector search methods do not consider the `Score.scoringFunction`.

The scoring function defaults to `ScoringFunction.unspecified()` as there is no information inside of search results how the score has been computed.

Repository Search Methods:

1.  `SearchResults<Comment> searchTop10ByEmbeddingNear(Vector vector, Score similarity)`
    -   Searches for the top 10 comments whose embeddings are near the provided `vector`.
    -   Filters results to include only those with a similarity score greater than or equal to the specified `similarity` value.
    -   Example Usage: `repository.searchByEmbeddingNear(Vector.of(…), Score.of(0.9));`

2.  `SearchResults<Comment> searchTop10ByEmbeddingNear(Vector vector, Similarity similarity)`
    -   Similar to the above, searches for top 10 comments near the `vector`.
    -   Filters results based on the `similarity` object, returning those with a similarity score greater than or equal to the specified value.
    -   Example Usage: `repository.searchByEmbeddingNear(Vector.of(…), Similarity.of(0.9));`

3.  `SearchResults<Comment> searchTop10ByEmbeddingNear(Vector vector, Range<Similarity> range)`
    -   Searches for top 10 comments near the `vector`.
    -   Filters results to include only those whose similarity scores fall within the specified `range` (inclusive).
    -   Example Usage: `repository.searchByEmbeddingNear(Vector.of(…), Similarity.between(0.5, 1));`

Parameters:
-   `vector`: The embedding vector to search near.
-   `similarity`: A `Score` or `Similarity` object specifying the minimum similarity threshold.
-   `range`: A `Range<Similarity>` object specifying the minimum and maximum similarity thresholds.

Return Value:
-   `SearchResults<Comment>`: A collection of `Comment` objects that match the search criteria.
```

--------------------------------

### Spring Data MongoDB: Aggregation with $out and Void Return

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Executes an aggregation pipeline that includes the `$out` stage to write results to a new collection (`authors`). When the return type is `void`, the output of the `$out` stage is skipped, meaning no results are returned to the application.

```java
@Aggregation(pipeline = {
		  "{ $group : { _id : '$author', books: { $push: '$title' } } }",
		  "{ $out : 'authors' }"
  })
  void groupAndOutSkippingOutput();
```

--------------------------------

### Create Full-Text Search Index

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Defines a full-text index on specified fields, allowing for text-based searches. It supports assigning weights to fields to influence relevance scoring during searches. This index is crucial for enabling efficient text search operations in MongoDB.

```javascript
db.foo.createIndex(
{
  title : "text",
  content : "text"
},
{
  weights : {
              title : 3
            }
}
)
```

--------------------------------

### MongoTemplate Execute Callbacks

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-api.adoc

Provides methods to execute callbacks for direct access to MongoDB driver objects like MongoCollection or MongoDatabase. These callbacks allow for lower-level operations and custom logic, translating exceptions as necessary. They are useful when the convenience methods are insufficient.

```APIDOC
MongoTemplate:
  execute(Class<?> entityClass, CollectionCallback<T> action)
    - Runs the given CollectionCallback for the entity collection of the specified class.

  execute(String collectionName, CollectionCallback<T> action)
    - Runs the given CollectionCallback on the collection of the given name.

  execute(DbCallback<T> action)
    - Runs a DbCallback, translating any exceptions as necessary. Supports Aggregation Framework.

  execute(String collectionName, DbCallback<T> action)
    - Runs a DbCallback on the collection of the given name, translating exceptions.

  executeInSession(DbCallback<T> action)
    - Runs a DbCallback within the same database connection for consistency, especially in write-heavy scenarios.
```

--------------------------------

### Programmatic PropertyValueConverter Registration

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/property-converters.adoc

Illustrates programmatic registration of PropertyValueConverter instances for properties within an entity model. It covers registration by field name and a type-safe approach using method references.

```java
PropertyValueConverterRegistrar registrar = new PropertyValueConverterRegistrar();

registrar.registerConverter(Address.class, "street", new PropertyValueConverter() { … }); 

// type safe registration
registrar.registerConverter(Person.class, Person::getSsn)
  .writing(value -> encrypt(value))
  .reading(value -> decrypt(value));
```

--------------------------------

### Replace a Single Document in Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

This snippet shows how to replace a single document matching a query using `MongoTemplate.replace()`. It first inserts a new document, then defines a query to identify it, sets up the replacement document (which must hold either the same `_id` as the existing or no `_id` at all), and finally runs the replace operation.

```Java
Person tom = template.insert(new Person("Motte", 21));
Query query = Query.query(Criteria.where("firstName").is(tom.getFirstName()));
tom.setFirstname("Tom");
template.replace(query, tom, ReplaceOptions.none());
```

--------------------------------

### Imperative Java MongoTemplate CRUD Operations

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Demonstrates saving, finding, updating, and removing a Person object using the imperative MongoTemplate. It shows basic CRUD operations and logging of results. Dependencies include MongoTemplate, query builders, and update builders.

```java
public class MongoApplication {

  private static final Log log = LogFactory.getLog(MongoApplication.class);

  public static void main(String[] args) {

    MongoOperations template = new MongoTemplate(new SimpleMongoClientDbFactory(MongoClients.create(), "database"));

    Person p = new Person("Joe", 34);

    // Insert is used to initially store the object into the database.
    template.insert(p);
    log.info("Insert: " + p);

    // Find
    p = template.findById(p.getId(), Person.class);
    log.info("Found: " + p);

    // Update
    template.updateFirst(query(where("name").is("Joe")), update("age", 35), Person.class);
    p = template.findOne(query(where("name").is("Joe")), Person.class);
    log.info("Updated: " + p);

    // Delete
    template.remove(p);

    // Check that deletion worked
    List<Person> people =  template.findAll(Person.class);
    log.info("Number of people = : " + people.size());


    template.dropCollection(Person.class);
  }
}
```

--------------------------------

### Simple Document Reference (_id)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/document-references.adoc

Demonstrates a basic document reference where the `_id` of the referenced document is stored directly in the referencing document. This is the simplest form of association.

```java
class Entity {
  @DocumentReference
  ReferencedObject ref;
}
```

```json
// entity
{
  "_id" : "8cfb002",
  "ref" : "9a48e32" 
}

// referenced object
{
  "_id" : "9a48e32" 
}
```

--------------------------------

### Kotlin: Retrieve All SWCharacter Objects

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/kotlin/extensions.adoc

Shows how to fetch all `SWCharacter` objects from a MongoDB table using Spring Data MongoDB with Kotlin extensions. It highlights Kotlin's type inference for a more concise syntax compared to Java.

```kotlin
val characters = template.query<SWCharacter>().inTable("star-wars").all()
// or (both are equivalent)
val characters : Flux<SWCharacter> = template.query().inTable("star-wars").all()
```

--------------------------------

### Reactive Query with Nested SpEL and Object

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Presents a reactive Spring Data MongoDB repository method with a nested SpEL expression for conditional query construction. The expression `?#{ [0] ? {$exists :true} : [1] }` dynamically sets query criteria based on the first parameter.

```java
public interface PersonRepository extends ReactiveMongoRepository<Person, String> {

    @Query("{'id': ?#{ [0] ? {$exists :true} : [1] }}")
    Flux<Person> findByQueryWithExpressionAndNestedObject(boolean param0, String param1);
}
```

--------------------------------

### MongoDB Aggregation Data Models

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

Defines Java classes to represent input, intermediate, and output structures for MongoDB aggregation operations. These classes map fields from MongoDB documents to Java objects, facilitating data processing and transformation within the aggregation pipeline.

```java
class ZipInfo {
   String id;
   String city;
   String state;
   @Field("pop") int population;
   @Field("loc") double[] location;
}

class City {
   String name;
   int population;
}

class ZipInfoStats {
   String id;
   String state;
   City biggestCity;
   City smallestCity;
}
```

--------------------------------

### Repository Interface Extension for Querydsl

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/repositories/core-extensions.adoc

Shows how to integrate Querydsl capabilities into a Spring Data MongoDB repository by extending the appropriate QuerydslPredicateExecutor interface. This allows the repository to leverage type-safe query methods.

```java
interface PersonRepository extends MongoRepository<Person, String>, QuerydslPredicateExecutor<Person> {

    // additional query methods go here
}
```

```java
interface PersonRepository extends ReactiveMongoRepository<Person, String>, ReactiveQuerydslPredicateExecutor<Person> {

    // additional query methods go here
}
```

--------------------------------

### Spring Data MongoDB: Configure Aggregation Options with @Meta

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

This snippet demonstrates how to apply additional options, such as allowDiskUse, to aggregation queries in Spring Data MongoDB. By using the @Meta annotation on a repository method, developers can control specific aggregation behaviors like maximum execution time or temporary disk usage.

```java
interface PersonRepository extends CrudRepository<Person, String> {

  @Meta(allowDiskUse = true)
  @Aggregation("{ $group: { _id : $lastname, names : { $addToSet : $firstname } } }")
  List<PersonAggregate> groupByLastnameAndFirstnames();
}
```

--------------------------------

### Aggregation Pipeline Updates

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Explains how to use aggregation pipelines for update operations, leveraging MongoDB 4.2+ features for more complex modifications within a single update call.

```APIDOC
Aggregation Pipeline Updates:

Spring Data MongoDB allows using aggregation pipelines for update operations via `AggregationUpdate`, supporting MongoDB 4.2+ features.

*   `AggregationUpdate.set(String key, Object value)`:
    *   Corresponds to the `$set` stage in an aggregation pipeline.
    *   Sets the value of a field.

*   `AggregationUpdate.unset(String key)`:
    *   Corresponds to the `$unset` stage in an aggregation pipeline.
    *   Removes a field.

*   `AggregationUpdate.replaceWith(Object document)`:
    *   Corresponds to the `$replaceWith` stage in an aggregation pipeline.
    *   Replaces the entire document with a new document.

Example Usage:

```java
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationUpdate;

// Example: Increment balance and set status to 'PROCESSED' using aggregation
AggregationUpdate update = Aggregation.newUpdate()
    .set("balance", "$balance + 100") // Using expression for increment
    .set("status", "PROCESSED");

// This update object can then be applied to MongoTemplate methods
// e.g., template.update(Account.class).matching(query).apply(update).first();

// Example using $replaceWith
AggregationUpdate replaceUpdate = Aggregation.newUpdate()
    .replaceWith(new Document("field1", "newValue1").append("field2", 123));
```
```

--------------------------------

### MongoTemplate findAndReplace Method

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Demonstrates replacing an entire document identified by a query using the fluent API. It allows specifying options like upsert and an optional projection type for the result. The replacement must not contain an ID, as the existing document's ID is carried over.

```java
Optional<User> result = template.update(Person.class)      <1>
    .matching(query(where("firstame").is("Tom")))          <2>
    .replaceWith(new Person("Dick"))
    .withOptions(FindAndReplaceOptions.options().upsert()) <3>
    .as(User.class)                                        <4>
    .findAndReplace();                                     <5>

<1> Use the fluent update API with the domain type given for mapping the query and deriving the collection name or just use `MongoOperations#findAndReplace`.
<2> The actual match query mapped against the given domain type. Provide `sort`, `fields` and `collation` settings via the query.
<3> Additional optional hook to provide options other than the defaults, like `upsert`.
<4> An optional projection type used for mapping the operation result. If none given the initial domain type is used.
<5> Trigger the actual processing. Use `findAndReplaceValue` to obtain the nullable result instead of an `Optional`.
```

--------------------------------

### Declare Wildcard Index on Document Type in Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-index-management.adoc

Shows how to apply the `@WildcardIndexed` annotation directly to a `@Document` class in Java to create a wildcard index for the entire document, along with the equivalent MongoDB shell command.

```java
@Document
@WildcardIndexed
public class Product {
	// …
}
```

```javascript
db.product.createIndex({ "$**" : 1 },{})
```

--------------------------------

### Setting Read Preference

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Allows setting the `ReadPreference` directly on the `Query` object, which will supersede the default `ReadPreference` of the `MongoTemplate`. This controls which MongoDB replica set member handles the read operation.

```java
template.find(Person.class)
    .matching(query(where(...)).withReadPreference(ReadPreference.secondary()))
    .all();
```

--------------------------------

### Intercepting BeforeConvert Event

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/lifecycle-events.adoc

Demonstrates how to extend AbstractMongoEventListener to intercept an object before it goes through the conversion process, allowing for auditing or manipulation.

```java
public class BeforeConvertListener extends AbstractMongoEventListener<Person> {
  @Override
  public void onBeforeConvert(BeforeConvertEvent<Person> event) {
    // ... does some auditing manipulation, set timestamps, whatever ...
  }
}
```

--------------------------------

### Spring Data MongoDB: Lazy Loading Document Reference

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/document-references.adoc

Illustrates lazy loading for back references using @DocumentReference(lazy = true). This defers the resolution of the referenced 'Book' documents until they are accessed, improving performance for large collections.

```java
@Document
class Publisher {

  @Id
  ObjectId id;
  String acronym;
  String name;

  @DocumentReference(lazy = true) <2>
  List<Book> books;

}

@Document
class Book {

  @Id
  ObjectId id;
  String title;
  List<String> author;

  @Field("publisher_ac")
  @DocumentReference(lookup = "{ 'acronym' : ?#{#target} }" ) <1>
  Publisher publisher;
}
```

--------------------------------

### Spring Data MongoDB Query Class Methods

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Details additional methods available on the Query class for managing query execution. These methods allow for adding criteria, selecting specific fields, limiting the number of results, skipping documents, and applying sorting.

```APIDOC
Query addCriteria(Criteria criteria)
  Used to add additional criteria to the query.

Field fields()
  Used to define fields to be included or excluded in the query results.

Query limit(int limit)
  Used to limit the size of the returned results to the provided limit (used for paging).

Query skip(int skip)
  Used to skip the provided number of documents in the results (used for paging).

Query with(Sort sort)
  Used to provide sort definition for the results.

Query with(ScrollPosition position)
  Used to provide a scroll position (Offset- or Keyset-based pagination) to start or resume a Scroll.
```

--------------------------------

### Reactive Query with MongoTemplate

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-api.adoc

Shows a reactive query using MongoTemplate to retrieve a Flux of Jedi objects from a specific collection, applying a query filter.

```java
Flux<Jedi> all = template.query(SWCharacter.class)
  .inCollection("star-wars")
  .as(Jedi.class)
  .matching(query(where("jedi").is(true)))
  .all();
```

--------------------------------

### Document Reference with Multi-Field Lookup

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/document-references.adoc

Demonstrates referencing using multiple fields (`firstname`, `lastname`) in the lookup query for `@DocumentReference`. This allows for more complex association criteria.

```java
class Entity {
  @DocumentReference(lookup = "{ 'firstname' : '?#{fn}', 'lastname' : '?#{ln}' }") 
  ReferencedObject ref;
}
```

```json
// entity
{
  "_id" : "8cfb002",
  "ref" : {
    "fn" : "Josh",           
    "ln" : "Long"            
  }
}

// referenced object
{
  "_id" : "9a48e32",
  "firstname" : "Josh",      
  "lastname" : "Long",       
}
```

--------------------------------

### Standard MongoDB Direct Count (JavaScript)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/client-session-transactions.adoc

Presents the typical MongoDB count() command that is *not* directly supported within multi-document transactions. This snippet serves as a contrast to the aggregation-based approach used by MongoTemplate.

```javascript
db.collection.find( { state: "active" } ).count()
```

--------------------------------

### Spring Data MongoDB AOT Repository Configuration

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aot.adoc

Configuration properties to enable or disable AOT repository generation for Spring Data MongoDB. Setting these properties controls the build-time pre-generation of query method implementations.

```properties
spring.aot.repositories.enabled=true
spring.aot.mongodb.repositories.enabled=false
```

--------------------------------

### Conditional Projection in MongoDB Aggregation

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

Illustrates conditional projection in Spring Data MongoDB aggregation. It sets a 'discount' based on the 'qty' field and provides a default 'Unspecified' value for missing or null 'description' fields.

```java
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.ConditionalOperator;
import org.springframework.data.mongodb.core.aggregation.Criteria;
import org.springframework.data.mongodb.core.aggregation.TypedAggregation;
import org.springframework.data.mongodb.core.query.Query;
import java.util.List;

// Define input and output classes
public class InventoryItem {
  @Id int id;
  String item;
  String description;
  int qty;
}

public class InventoryItemProjection {
  @Id int id;
  String item;
  String description;
  int qty;
  int discount;
}

// Example aggregation using conditional projection
// TypedAggregation<InventoryItem> agg = Aggregation.newAggregation(InventoryItem.class,
//   project("item")
//     .and("discount")
//       .applyCondition(ConditionalOperator.newBuilder().when(Criteria.where("qty").gte(250))
//         .then(30)
//         .otherwise(20))
//       .and(ifNull("description", "Unspecified")).as("description")
// );

// AggregationResults<InventoryItemProjection> result = mongoTemplate.aggregate(agg, "inventory", InventoryItemProjection.class);
// List<InventoryItemProjection> stateStatsList = result.getMappedResults();
```

--------------------------------

### MongoDB $sortByCount BSON Equivalent

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

Provides the equivalent BSON representation for the `$sortByCount` aggregation operation, showing how it translates to `$group` and `$sort` stages in the MongoDB aggregation pipeline.

```APIDOC
$sortByCount key
  - Removes members from a sorted set
  - Parameters:
    - key: The field or expression to group and sort by.
  - Returns: Documents grouped by the key, sorted by count in descending order.

Equivalent BSON:
{
  $group: { _id: <expression>, count: { $sum: 1 } }
},
{
  $sort: { count: -1 }
}
```

--------------------------------

### Controlling MongoDB Transaction Options via Labels

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/client-session-transactions.adoc

Explains how to control MongoDB-specific transaction options using labels within the @Transactional annotation. It details the use of the 'mongo:' prefix and the default MongoTransactionOptionsResolver.

```APIDOC
Transactional service methods can require specific transaction options to run a transaction.
Spring Data MongoDB's transaction managers support evaluation of transaction labels such as `@Transactional(label = { "mongo:readConcern=available" })`.

By default, the label namespace using the `mongo:` prefix is evaluated by `MongoTransactionOptionsResolver` that is configured by default.
Transaction labels are provided by `TransactionAttribute` and available to programmatic transaction control through `TransactionTemplate` and `TransactionalOperator`.
Due to their declarative nature, `@Transactional(label = …)` provides a good starting point that also can serve as documentation.

Currently, the following options are supported:

Max Commit Time::

Controls the maximum execution time on the server for the commitTransaction operation.
```

--------------------------------

### GeoJSON Point vs Legacy Coordinate Pairs in GeoNear

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Illustrates how both GeoJSON Point and legacy coordinate pairs can be used with the MongoDB `$geoNear` operator.

```java
NearQuery.near(new Point(-73.99171, 40.738868))
```

```json
{
  "$geoNear": {
    //...
    "near": [-73.99171, 40.738868]
  }
}
```

--------------------------------

### QuerydslPredicateExecutor API (Imperative)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/repositories/core-extensions.adoc

Defines the methods available in the imperative `QuerydslPredicateExecutor` interface for performing type-safe queries. It includes operations for finding single entities, multiple entities with sorting, pagination, counting, and existence checks.

```APIDOC
QuerydslPredicateExecutor<T>:
  findOne(Predicate predicate): Optional<T>
    - Finds a single entity matching the given predicate.
    - Parameters:
      - predicate: The Querydsl predicate to apply.
    - Returns: An Optional containing the found entity, or empty if none matches.

  findAll(Predicate predicate): List<T>
    - Finds all entities matching the given predicate.
    - Parameters:
      - predicate: The Querydsl predicate to apply.
    - Returns: A List of entities matching the predicate.

  findAll(Predicate predicate, Sort sort): List<T>
    - Finds all entities matching the predicate, sorted according to the provided Sort object.
    - Parameters:
      - predicate: The Querydsl predicate to apply.
      - sort: The Sort object specifying the ordering.
    - Returns: A List of sorted entities.

  findAll(Predicate predicate, OrderSpecifier<?>... orders): List<T>
    - Finds all entities matching the predicate, ordered by the specified OrderSpecifiers.
    - Parameters:
      - predicate: The Querydsl predicate to apply.
      - orders: Varargs of OrderSpecifier for custom ordering.
    - Returns: A List of ordered entities.

  findAll(Predicate predicate, Pageable pageable): Page<T>
    - Finds a page of entities matching the predicate, using the provided Pageable object for pagination and sorting.
    - Parameters:
      - predicate: The Querydsl predicate to apply.
      - pageable: The Pageable object specifying page number, size, and sort order.
    - Returns: A Page object containing the results.

  findAll(OrderSpecifier<?>... orders): List<T>
    - Finds all entities, ordered by the specified OrderSpecifiers.
    - Parameters:
      - orders: Varargs of OrderSpecifier for custom ordering.
    - Returns: A List of ordered entities.

  count(Predicate predicate): long
    - Counts the number of entities matching the given predicate.
    - Parameters:
      - predicate: The Querydsl predicate to apply.
    - Returns: The total count of matching entities.

  exists(Predicate predicate): boolean
    - Checks if any entity matches the given predicate.
    - Parameters:
      - predicate: The Querydsl predicate to apply.
    - Returns: True if at least one entity matches, false otherwise.

  findBy(Predicate predicate, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction): R
    - Executes a custom query function against entities matching the predicate.
    - Parameters:
      - predicate: The Querydsl predicate to apply.
      - queryFunction: A function that defines the custom query logic.
    - Returns: The result of the query function.
```

--------------------------------

### Configure MappingMongoConverter for Dot Replacement in Map Keys

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping.adoc

Shows how to use MappingMongoConverter#setMapKeyDotReplacement to substitute dots in Map keys with another character during write operations, which was necessary for MongoDB versions prior to 5.0.

```java
converter.setMapKeyDotReplacement("-");
// ...

source.map = Map.of("key.with.dot", "value")
converter.write(source,...) // -> map : { 'key-with-dot', 'value' }
```

--------------------------------

### Custom MongoDB Reading Converter (Document to Person)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/custom-conversions.adoc

Illustrates a custom `Converter` implementation for converting a `org.bson.Document` read from MongoDB back into a `Person` domain object.

```java
import org.springframework.core.convert.converter.Converter;
import org.bson.Document;
import org.bson.types.ObjectId;

public class PersonReadConverter implements Converter<Document, Person> {

  public Person convert(Document source) {
    Person p = new Person((ObjectId) source.get("_id"), (String) source.get("name"));
    p.setAge((Integer) source.get("age"));
    return p;
  }
}
```

--------------------------------

### Dynamic Collation in Spring Data MongoDB Queries

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

This snippet illustrates various ways to apply collation to Spring Data MongoDB queries. It shows how to use a dynamic collation string, a Collation object, and how a method-level Collation parameter can override a static @Query collation definition.

```Java
@Query(collation = "{ 'locale' : '?1' }")
List<Person> findByFirstname(String firstname, String collation);

List<Person> findByFirstname(String firstname, Collation collation);

@Query(collation = "{ 'locale' : 'en_US' }")
List<Person> findByFirstname(String firstname, @Nullable Collation collation);
```

--------------------------------

### Use Collation with MongoDB Aggregate Operation in Java

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/collation.adoc

Demonstrates applying a `Collation` instance to `AggregationOptions` for MongoDB aggregation pipelines using Spring Data MongoDB. This ensures that string comparisons within the aggregation process follow the defined collation.

```java
Collation collation = Collation.of("de");

AggregationOptions options = AggregationOptions.builder().collation(collation).build();

Aggregation aggregation = newAggregation(
  project("tags"),
  unwind("tags"),
  group("tags")
    .count().as("count")
).withOptions(options);

AggregationResults<TagCount> results = template.aggregate(aggregation, "tags", TagCount.class);
```

--------------------------------

### MongoDB Command Observation Span

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/observability/spans.adoc

Details the `spring.data.mongodb.command` span, which is a timer created around a MongoDB command execution. It is part of the `org.springframework.data.mongodb.observability.MongoObservation` class and includes various tags for detailed observability.

```APIDOC
Span Name: spring.data.mongodb.command
Class: org.springframework.data.mongodb.observability.MongoObservation
Description: Timer created around a MongoDB command execution.

Tag Keys:
  - db.connection_string (required): MongoDB connection string.
  - db.mongodb.collection (required): MongoDB collection name.
  - db.name (required): MongoDB database name.
  - db.operation (required): MongoDB command value.
  - db.system (required): MongoDB database system.
  - db.user (required): MongoDB user.
  - net.peer.name (required): Name of the database host.
  - net.peer.port (required): Logical remote port number.
  - net.sock.peer.addr (required): Mongo peer address.
  - net.sock.peer.port (required): Mongo peer port.
  - net.transport (required): Network transport.
  - spring.data.mongodb.cluster_id (required): MongoDB cluster identifier.
```

--------------------------------

### Update Methods in MongoTemplate

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Describes the primary methods provided by `MongoTemplate` (or `ReactiveMongoTemplate`) for executing update operations on MongoDB documents.

```APIDOC
MongoTemplate Update Execution Methods:

These methods are used to apply constructed `Update` objects to documents matching a given `Query`.

*   `updateFirst(Query query, Update update, Class<?> entityClass)`:
    *   Updates the first document that matches the query criteria with the provided update.
    *   Note: Does not support ordering for MongoDB versions below 8.0. For older versions, consider using `findAndModify` with `Sort`.
    *   Parameters:
        *   `query`: The `Query` object specifying the selection criteria.
        *   `update`: The `Update` object defining the modifications.
        *   `entityClass`: The class of the entity to update.
    *   Returns: An `UpdateResult` object indicating the outcome of the operation.

*   `updateMulti(Query query, Update update, Class<?> entityClass)`:
    *   Updates all documents that match the query criteria with the provided update.
    *   Parameters:
        *   `query`: The `Query` object specifying the selection criteria.
        *   `update`: The `Update` object defining the modifications.
        *   `entityClass`: The class of the entity to update.
    *   Returns: An `UpdateResult` object indicating the outcome of the operation.

*   `update(Class<?> entityClass)`:
    *   Initiates an update operation builder for the specified entity class.
    *   Chained methods like `.matching(Query query)`, `.apply(Update update)`, and `.first()` or `.all()` are used to define and execute the operation.
    *   Example:
        ```java
        Mono<UpdateResult> result = template.update(Account.class)
            .matching(where("accountType").is("SAVINGS"))
            .apply(new Update().set("balance", 1000.00))
            .first(); // or .all()
        ```

*   `withHint(String hint)`:
    *   Can be used with `Query` to provide index hints for the update operation.
    *   Example:
        ```java
        Query query = new Query(where("status").is("PENDING")).withHint("status_index");
        ```
```

--------------------------------

### TransactionalOperator Control (Reactive Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/client-session-transactions.adoc

Demonstrates the use of TransactionalOperator for managing transactions in a reactive Spring Data MongoDB context. This operator simplifies the composition of reactive streams with transactional guarantees.

```java
template.setSessionSynchronization(ALWAYS);                                          <1>

// ...

TransactionalOperator rxtx = TransactionalOperator.create(anyTxManager, // Assuming anyTxManager is a ReactiveTransactionManager
    // ... further configuration if needed
```

--------------------------------

### Sorting Query Results in Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Illustrates various methods for sorting query results in Spring Data MongoDB, including static sorting derived from method names, dynamic sorting via Sort arguments, and static sorting defined within the @Query annotation.

```java
public interface PersonRepository extends MongoRepository<Person, String> {

    List<Person> findByFirstnameSortByAgeDesc(String firstname); 

    List<Person> findByFirstname(String firstname, Sort sort);   

    @Query(sort = "{ age : -1 }")
    List<Person> findByFirstname(String firstname);              

    @Query(sort = "{ age : -1 }")
    List<Person> findByLastname(String lastname, Sort sort);     
}
```

```java
public interface PersonRepository extends ReactiveMongoRepository<Person, String> {

    Flux<Person> findByFirstnameSortByAgeDesc(String firstname);

    Flux<Person> findByFirstname(String firstname, Sort sort);

    @Query(sort = "{ age : -1 }")
    Flux<Person> findByFirstname(String firstname);

    @Query(sort = "{ age : -1 }")
    Flux<Person> findByLastname(String lastname, Sort sort);
}
```

--------------------------------

### MongoDB Query: Match Exact Regex (Case-Sensitive)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Demonstrates a MongoDB query using the `$regex` operator to find documents where the 'firstname' field matches the exact regular expression 'firstname' in a case-sensitive manner.

```JSON
{"firstname" : { $regex: /firstname/}}
```

--------------------------------

### Configure MongoDB Tracing Properties

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/observability/observability.adoc

Configures application properties to disable Spring Boot's autoconfigured MongoDB tracing and manually enable tracing. This ensures that Spring Data MongoDB's observability is correctly utilized.

```properties
# Disable Spring Boot's autoconfigured tracing
management.metrics.mongo.command.enabled=false
# Enable it manually
management.tracing.enabled=true
```

--------------------------------

### MongoDB $vectorSearch Aggregation Stage Parameters

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/partials/vector-search-method-annotated-include.adoc

Details the parameters supported by the MongoDB $vectorSearch aggregation stage, which are configurable via the Spring Data MongoDB @VectorSearch annotation. This includes core parameters for defining the search and filtering criteria.

```APIDOC
$vectorSearch:
  index: <string> (required) - The name of the vector index to use.
  path: <string> (required) - The path to the vector field in the documents.
  queryVector: <array> (required) - The vector to search for.
  filter: <document> (optional) - A document specifying pre-filter criteria using MongoDB query syntax.
  limit: <integer> (optional) - The maximum number of documents to return. Supports Value Expressions.
  numCandidates: <integer> (optional) - The number of nearest neighbors to consider. Supports Value Expressions.
  searchType: <string> (optional) - The type of search to perform (e.g., 'kNN', 'ANN'). Defaults to 'kNN'.
  includeSimilarity: <boolean> (optional) - Whether to include the similarity score in the output.
  groupBy: <string> (optional) - The field to group results by.
  groupLimit: <integer> (optional) - The number of results to return per group.
```

--------------------------------

### Adding Comments to Queries

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Enables adding comments to queries, which aids in identifying and tracking them in server logs. This is useful for debugging and monitoring query execution.

```java
template.find(Person.class)
    .matching(query(where(...)).comment("Use the force luke!"))
    .all();
```

--------------------------------

### Create Time Series Collection via MongoDB Driver

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-collection-management.adoc

Demonstrates creating a MongoDB Time Series collection named 'weather' using the native MongoDB Java driver's `CreateCollectionOptions`. The time field is specified as 'timestamp'.

```java
template.execute(db -> {

    com.mongodb.client.model.CreateCollectionOptions options = new com.mongodb.client.model.CreateCollectionOptions();
    options.timeSeriesOptions(new com.mongodb.client.model.TimeSeriesOptions("timestamp"));

    db.createCollection("weather", options);
    return "OK";
});
```

--------------------------------

### Configure MongoDB JMX Support with Spring XML

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/jmx.adoc

This XML configuration enables JMX support for MongoDB in Spring Data, setting up a MongoDB client and exposing various MBeans for monitoring and administration. Note that JMX support is deprecated and will be removed in future versions.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:context="http://www.springframework.org/schema/context"
  xmlns:mongo="http://www.springframework.org/schema/data/mongo"
  xsi:schemaLocation="
    http://www.springframework.org/schema/context
    https://www.springframework.org/schema/context/spring-context-3.0.xsd
    http://www.springframework.org/schema/data/mongo
    https://www.springframework.org/schema/data/mongo/spring-mongo-1.0.xsd
    http://www.springframework.org/schema/beans https://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

    <!-- Default bean name is 'mongo' -->
    <mongo:mongo-client host="localhost" port="27017"/>

    <!-- by default look for a Mongo object named 'mongo' -->
    <mongo:jmx/>

    <context:mbean-export/>

    <!-- To translate any MongoExceptions thrown in @Repository annotated classes -->
    <context:annotation-config/>

    <bean id="registry" class="org.springframework.remoting.rmi.RmiRegistryFactoryBean" p:port="1099" />

    <!-- Expose JMX over RMI -->
    <bean id="serverConnector" class="org.springframework.jmx.support.ConnectorServerFactoryBean"
        depends-on="registry"
        p:objectName="connector:name=rmi"
        p:serviceUrl="service:jmx:rmi://localhost/jndi/rmi://localhost:1099/myconnector" />

</beans>
```

--------------------------------

### Full-Text Search with Score Sorting

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Performs a full-text search and sorts the results by relevance score. The `sortByScore()` method enables sorting based on the text search score, and `includeScore()` adds the calculated score to the returned documents, allowing for relevance-based ordering.

```java
Query query = TextQuery
  .queryText(new TextCriteria().matchingAny("coffee", "cake"))
  .sortByScore() 
  .includeScore(); 

List<Document> page = template.find(query, Document.class);
```

--------------------------------

### Create Time Series Collection from Annotation

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-collection-management.adoc

Illustrates creating a Time Series collection based on a Java entity class annotated with `@TimeSeries`. The collection name and time field are derived from the annotation attributes.

```java
@TimeSeries(collection="weather", timeField = "timestamp")
public class Measurement {

    String id;
    Instant timestamp;
    // ...
}

template.createCollection(Measurement.class);
```

--------------------------------

### Spring Data MongoDB Aggregation Operators

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

Lists various aggregation operators supported by Spring Data MongoDB, categorized by their functionality. These operators are mapped or added by Spring Data MongoDB, with some operations not being supported.

```APIDOC
Set Operators:
setEquals, setIntersection, setUnion, setDifference, setIsSubset, anyElementTrue, allElementsTrue

Group/Accumulator Aggregation Operators:
addToSet, bottom, bottomN, covariancePop, covarianceSamp, expMovingAvg, first, firstN, last, lastN, max, maxN, min, minN, avg, push, sum, top, topN, count, median, percentile, stdDevPop, stdDevSamp

Arithmetic Aggregation Operators:
abs, acos, acosh, add (via plus), asin, atan, atan2, atanh, ceil, cos, cosh, derivative, divide, exp, floor, integral, ln, log, log10, mod, multiply, pow, round, sqrt, subtract (via minus), sin, sinh, tan, tanh, trunc

String Aggregation Operators:
concat, substr, toLower, toUpper, strcasecmp, indexOfBytes, indexOfCP, regexFind, regexFindAll, regexMatch, replaceAll, replaceOne, split, strLenBytes, strLenCP, substrCP, trim, ltrim, rtrim

Comparison Aggregation Operators:
eq (via is), gt, gte, lt, lte, ne

Array Aggregation Operators:
arrayElementAt, arrayToObject, concatArrays, filter, first, in, indexOfArray, isArray, last, range, reverseArray, reduce, size, sortArray, slice, zip

Literal Operators:
literal

Date Aggregation Operators:
dateSubstract, dateTrunc, dayOfYear, dayOfMonth, dayOfWeek, year, month, week, hour, minute, second, millisecond, dateAdd, dateDiff, dateToString, dateFromString, dateFromParts, dateToParts, isoDayOfWeek, isoWeek, isoWeekYear, tsIncrement, tsSecond

Variable Operators:
map

Conditional Aggregation Operators:
cond, ifNull, switch

Type Aggregation Operators:
type

Convert Aggregation Operators:
convert, degreesToRadians, toBool, toDate, toDecimal, toDouble, toInt, toLong, toObjectId, toString

Object Operators:
objectToArray, mergeObjects, getField, setField

Script Operators:
function, accumulator
```

--------------------------------

### Group Operation with Criteria and External JS in Java

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-group.adoc

Shows an advanced usage of the `group` operation with a `Criteria` object to filter documents before aggregation. It also demonstrates referencing JavaScript functions for key and reduce logic from external files using Spring's Resource abstraction, providing flexibility for complex operations.

```java
import static org.springframework.data.mongodb.core.mapreduce.GroupBy.keyFunction;
import static org.springframework.data.mongodb.core.query.Criteria.where;

GroupByResults<XObject> results = mongoTemplate.group(where("x").gt(0),
                                        "group_test_collection",
                                        keyFunction("classpath:keyFunction.js").initialDocument("{ count: 0 }").reduceFunction("classpath:groupReduce.js"), XObject.class);

```

--------------------------------

### Intercepting BeforeSave Event

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/lifecycle-events.adoc

Shows how to extend AbstractMongoEventListener to intercept an object before it is saved to the database, enabling modification of the domain object or the converted Document.

```java
public class BeforeSaveListener extends AbstractMongoEventListener<Person> {
  @Override
  public void onBeforeSave(BeforeSaveEvent<Person> event) {
    // ... change values, delete them, whatever ...
  }
}
```

--------------------------------

### Define Patient Model and Create Encrypted Collection

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-encryption.adoc

Demonstrates defining a Java model with various encryption annotations for fields like 'pin', 'ssn', 'age', and 'height'. It then shows how to generate a JSON schema for encrypted fields and use Spring Data MongoDB's template to create an encrypted collection with these configurations.

```java
class Patient {

    @Id String id;

    Address address;

    @Encrypted(algorithm = "Unindexed")
    String pin;

    @Encrypted(algorithm = "Indexed")
    @Queryable(queryType = "equality", contentionFactor = 0)
    String ssn;

    @RangeEncrypted(contentionFactor = 8, rangeOptions = "{ 'min' : 0, 'max' : 150 }")
    Integer age;

    @RangeEncrypted(contentionFactor = 0L,
        rangeOptions = "{\"min\": {\"$numberDouble\": \"0.3\"}, \"max\": {\"$numberDouble\": \"2.5\"}, \"precision\": 2 }")
    double height;
}

MongoJsonSchema patientSchema = MongoJsonSchemaCreator.create(mappingContext)
    .filter(MongoJsonSchemaCreator.encryptedOnly())
    .createSchemaFor(Patient.class);

Document encryptedFields = CollectionOptions.encryptedCollection(patientSchema)
        .getEncryptedFieldsOptions()
        .map(CollectionOptions.EncryptedFieldsOptions::toDocument)
        .orElseThrow();

template.execute(db -> clientEncryption.createEncryptedCollection(db, template.getCollectionName(Patient.class), new CreateCollectionOptions()
        .encryptedFields(encryptedFields), new CreateEncryptedCollectionParams("local")));
```

--------------------------------

### Spring Data MongoDB: Writing Converter for References

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/document-references.adoc

Provides a custom Spring Data MongoDB Converter to handle writing references when the target document's identifier is derived from a specific field (e.g., 'acronym'). This ensures correct association mapping during write operations.

```java
@WritingConverter
class PublisherReferenceConverter implements Converter<Publisher, DocumentPointer<String>> {

	@Override
	public DocumentPointer<String> convert(Publisher source) {
		return () -> source.getAcronym();
	}
}
```

--------------------------------

### GeoJSON Point in Domain Class

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Shows how to define a `GeoJsonPoint` field within a domain class for storing geospatial data.

```java
public class Store {

	String id;

	/**
	 * { "type" : "Point", "coordinates" : [ x, y ] }
	 */
	GeoJsonPoint location;
}
```

--------------------------------

### GeoSpatial Query: Find Venues Near Point (Min/Max Distance)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Finds venues located near a specified point, applying both minimum and maximum distance constraints.

```java
Point point = new Point(-73.99171, 40.738868);
List<Venue> venues =
    template.find(new Query(Criteria.where("location").near(point).minDistance(0.01).maxDistance(100)), Venue.class);
```

--------------------------------

### MongoDB 4.2 API Command Removals

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/preface.adoc

Highlights commands removed in MongoDB 4.2, specifically `geoNear` and `eval`, which are no longer supported.

```APIDOC
Relevant Changes in MongoDB 4.2:
  - Removal of geoNear command. See also https://docs.mongodb.com/manual/release-notes/4.2-compatibility/#remove-support-for-the-geonear-command[Removal of geoNear]
  - Removal of eval command. See also https://docs.mongodb.com/manual/release-notes/4.2-compatibility/#remove-support-for-the-eval-command[Removal of eval]
```

--------------------------------

### MongoDB Update Methods

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/modifying-methods.adoc

Demonstrates how to use the `@Update` annotation to define custom update operations on MongoDB documents within Spring Data MongoDB repositories. It covers various parameter binding techniques, including direct values, placeholders, and SpEL, as well as using aggregation pipelines for updates.

```java
public interface PersonRepository extends CrudRepository<Person, String> {

    @Update("{ '$inc' : { 'visits' : 1 } }")
    long findAndIncrementVisitsByLastname(String lastname); 

    @Update("{ '$inc' : { 'visits' : ?1 } }")
    void findAndIncrementVisitsByLastname(String lastname, int increment);

    @Update("{ '$inc' : { 'visits' : ?#{[1]} } }")
    long findAndIncrementVisitsUsingSpELByLastname(String lastname, int increment);

    @Update(pipeline = {"{ '$set' : { 'visits' : { '$add' : [ '$visits', ?1 ] } } }")
    void findAndIncrementVisitsViaPipelineByLastname(String lastname, int increment);

    @Update("{ '$push' : { 'shippingAddresses' : ?1 } }")
    long findAndPushShippingAddressByEmail(String email, Address address);

    @Query("{ 'lastname' : ?0 }")
    @Update("{ '$inc' : { 'visits' : ?1 } }")
    void updateAllByLastname(String lastname, int increment);
}
```

--------------------------------

### MongoDB Query: Match Exact Regex (Case-Insensitive)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Demonstrates a MongoDB query using the `$regex` operator with `$options: 'i'` to find documents where the 'firstname' field matches the exact regular expression 'firstname' in a case-insensitive manner.

```JSON
{"firstname" : { $regex: /firstname/, $options: 'i'}}
```

--------------------------------

### Java DBRef Operations and Storage

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/document-references.adoc

Illustrates performing operations with DBRefs, including saving and updating, and shows the resulting JSON structure in MongoDB. It highlights that cascading saves are not handled by default.

```java
Account account = …;

template.insert(account);

template.update(Person.class)
  .matching(where("id").is(…))
  .apply(new Update().push("accounts").value(account))
  .first();
```

```json
{
  "_id" : …,
  "accounts" : [ "6509b9e" … ]
}
```

--------------------------------

### Imperative Query with Nested SpEL and Object

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Shows an imperative Spring Data MongoDB repository method utilizing a nested SpEL expression for conditional query logic. The expression `?#{ [0] ? {$exists :true} : [1] }` conditionally applies a `$exists` check or uses the second parameter.

```java
public interface PersonRepository extends MongoRepository<Person, String> {

    @Query("{'id': ?#{ [0] ? {$exists :true} : [1] }}")
    List<Person> findByQueryWithExpressionAndNestedObject(boolean param0, String param1);
}
```

--------------------------------

### MongoDB Delete Methods

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/modifying-methods.adoc

Illustrates how to implement delete operations using derived query methods in Spring Data MongoDB repositories. It shows variations for imperative and reactive programming models, including different return types to control whether deleted documents are returned or just a count of removed documents.

```java
public interface PersonRepository extends MongoRepository<Person, String> {

    List <Person> deleteByLastname(String lastname);

    Long deletePersonByLastname(String lastname);

    @Nullable
    Person deleteSingleByLastname(String lastname);

    Optional<Person> deleteByBirthdate(Date birthdate);
}
```

```java
public interface PersonRepository extends ReactiveMongoRepository<Person, String> {

    Flux<Person> deleteByLastname(String lastname);

    Mono<Long> deletePersonByLastname(String lastname);

    Mono<Person> deleteSingleByLastname(String lastname);
}
```

--------------------------------

### Imperative Geo-spatial Query with MongoTemplate

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-api.adoc

Demonstrates an imperative geo-spatial query using MongoTemplate to find entities near a specified location, returning GeoResults.

```java
GeoResults<Jedi> results = template.query(SWCharacter.class)
  .as(Jedi.class)
  .near(alderaan) // NearQuery.near(-73.9667, 40.78).maxDis…
  .all();
```

--------------------------------

### Query with Custom Mapping and Projection

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-api.adoc

Illustrates using MongoTemplate to query for Person objects, mapping results to Jedi, applying a filter, and custom post-processing with a map function to return an Optional.

```java
List<Optional<Jedi>> result = template.query(Person.class)
    .as(Jedi.class)
    .matching(query(where("firstname").is("luke")))
    .map((document, reader) -> Optional.of(reader.get()))
    .all();
```

--------------------------------

### Java GeoNear Query with GeoJSON Point

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Demonstrates constructing a geospatial query using Spring Data MongoDB's `NearQuery` with a GeoJSON Point. This client-side representation specifies the center point for a proximity search.

```java
NearQuery.near(new GeoJsonPoint(-73.99171, 40.738868))
```

--------------------------------

### Spring Data MongoDB Map-Reduce Execution

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-mapreduce.adoc

Executes a Map-Reduce operation using Spring Data MongoDB, specifying the collection, map and reduce JavaScript files, and the target POJO class for results.

```java
MapReduceResults<ValueObject> results = mongoOperations.mapReduce("jmr1", "classpath:map.js", "classpath:reduce.js", ValueObject.class);
for (ValueObject valueObject : results) {
  System.out.println(valueObject);
}
```

--------------------------------

### MongoDB Full-Text Search Operator ($text)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Explains the use of the `$text` operator in MongoDB for full-text queries, available since version 2.6. It requires a text index to be set up and utilizes `TextQuery` and `TextCriteria` for search operations.

```APIDOC
MongoDB Full-Text Search ($text operator):
  Operator: $text
  Purpose: Enables full-text queries on indexed text fields.
  Availability: MongoDB version 2.6 and later.
  Requirements:
    - A text index must be created on the fields to be searched.
    - Refer to MongoDB documentation for behavior and limitations.
  Related Classes/Criteria:
    - TextQuery: Used for constructing text search queries.
    - TextCriteria: Used for defining text search criteria.
  Usage:
    - Queries are typically structured within a find() operation.
    - Example (conceptual):
      db.collection.find({ $text: { $search: "search terms" } })
  Indexing:
    - Text indexes are crucial for performance and functionality.
    - See xref:mongodb/mapping/mapping.adoc#mapping-usage-indexes.text-index[Text Index] for index creation details.
```

--------------------------------

### Spring Data Search Results API Definition

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/partials/vector-search.adoc

API documentation for `SearchResult<T>` and `SearchResults<T>` in Spring Data. These types encapsulate the outcomes of vector similarity queries, providing the matched domain object and a relevance score. They are crucial for structured result handling, ranking, and working with contextual relevance.

```APIDOC
SearchResult<T>:
  Description: Encapsulates the results of a vector similarity query.
  Contents:
    - Matched domain object (T).
    - Relevance score: Indicates how closely it matches the query vector.
  Usage:
    - Provides a structured way to handle result ranking.
    - Enables developers to easily work with both the data and its contextual relevance.

SearchResults<T>:
  Description: A collection type typically containing a list of SearchResult<T> instances.
  Example Usage:
    - searchByCountryAndEmbeddingNear method returns a SearchResults<Comment> object.
```

--------------------------------

### Configure MongoEncryptionConverter in Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-encryption.adoc

Demonstrates the Java configuration for `MongoEncryptionConverter` in Spring Data MongoDB. It involves setting up the `ClientEncryption` engine, an `EncryptionKeyResolver`, and integrating with Spring's `PropertyValueConverterFactory` for dynamic DEK resolution.

```java
class Config extends AbstractMongoClientConfiguration {

    @Autowired ApplicationContext appContext;

    @Bean
    ClientEncryption clientEncryption() {                                                            <1>
        ClientEncryptionSettings encryptionSettings = ClientEncryptionSettings.builder();
        // …

        return ClientEncryptions.create(encryptionSettings);
    }

    @Bean
    MongoEncryptionConverter encryptingConverter(ClientEncryption clientEncryption) {

        Encryption<BsonValue, BsonBinary> encryption = MongoClientEncryption.just(clientEncryption);
        EncryptionKeyResolver keyResolver = EncryptionKeyResolver.annotated((ctx) -> …);             <2>

        return new MongoEncryptionConverter(encryption, keyResolver);                                <3>
    }

    @Override
    protected void configureConverters(MongoConverterConfigurationAdapter adapter) {

        adapter
            .registerPropertyValueConverterFactory(PropertyValueConverterFactory.beanFactoryAware(appContext)); <4>
    }
}
```

--------------------------------

### MongoDB 4.4 API Behavior Changes

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/preface.adoc

Details relevant changes in MongoDB 4.4 that may affect applications, including restrictions on field lists with text search and requirements for sort documents in map-reduce operations.

```APIDOC
Relevant Changes in MongoDB 4.4:
  - Fields list must not contain text search score property when no $text criteria present. See also https://docs.mongodb.com/manual/reference/operator/query/text/[$text operator]
  - Sort must not be an empty document when running map reduce.
```

--------------------------------

### Spring Data MongoDB: Supporting Data Structures for Aggregation

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Defines the data structures used as return types or projections in Spring Data MongoDB aggregation queries. Includes `PersonAggregate` for grouped person data, `SumValue` for aggregation sums, and `PersonProjection` for interface-based projections.

```java
public class PersonAggregate {

  private @Id String lastname;
  private List<String> names;

  public PersonAggregate(String lastname, List<String> names) {
     // ...
  }

  // Getter / Setter omitted
}

public class SumValue {

  private final Long total;

  public SumValue(Long total) {
    // ...
  }

  // Getter omitted
}

interface PersonProjection {
    String getFirstname();
    String getLastname();
}
```

--------------------------------

### Spring Data Score and Scoring Functions API Definition

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/partials/vector-search.adoc

API documentation for `Score`, `Similarity`, and `Scoring Functions` in Spring Data. `Score` holds a numerical value for result relevance and ranking, with its interpretation depending on the similarity function. `ScoringFunction` computes this score, which can vary based on the underlying database, index, or input parameters.

```APIDOC
Score:
  Description: Holds a numerical value indicating the relevance of a search result.
  Purpose: Used to rank results based on their similarity to the query vector.
  Type: Typically a floating-point number.
  Interpretation: Depends on the specific similarity function used (higher can be better or worse).
  Note: A by-product of vector search, not required for successful search. Not part of a domain model.

ScoringFunction:
  Description: Computes the Score.
  Variability: The actual scoring function can depend on the underlying database and can be obtained from a search index or input parameters.
  Spring Data Support: Declares constants for commonly used functions.
```

--------------------------------

### MongoDB Value Expressions for $vectorSearch

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/partials/vector-search-method-annotated-include.adoc

Explains the concept of Value Expressions in MongoDB aggregation, which allows referencing method arguments or other dynamic values within parameters like 'limit' and 'numCandidates' in the $vectorSearch stage. This enables flexible query construction.

```APIDOC
Value Expressions:
  - Allow referencing method arguments in @VectorSearch parameters.
  - Syntax: `?N` for positional arguments (e.g., `?0` for the first argument).
  - Syntax: `?#<argumentName>` for named arguments (e.g., `?#limit`).
  - Syntax: `?#<expression>` for computed values (e.g., `?{#limit * 20}`).
  - Example: `limit="?3"` references the 4th argument (index 3) of the search method.
  - Example: `numCandidates="?{#limit * 20}"` calculates numCandidates based on the 'limit' argument.
```

--------------------------------

### Reactive Change Streams

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/change-streams.adoc

Illustrates how to leverage the reactive MongoDB Java driver with Spring Data MongoDB to consume change stream events. This approach uses a `Flux` to emit `ChangeStreamEvent`s, allowing for filtering via aggregation pipelines or criteria.

```java
Flux<ChangeStreamEvent<User>> flux = reactiveTemplate.changeStream(User.class) 
    .watchCollection("people")
    .filter(where("age").gte(38))                                              
    .listen();                                                                 
```

--------------------------------

### Document Reference with `refKey` Lookup

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/document-references.adoc

Illustrates using a custom field (`refKey`) for the lookup query in `@DocumentReference`. This requires a custom `Converter` to extract the `refKey` value from the referenced object during writing.

```java
class Entity {
  @DocumentReference(lookup = "{ '_id' : '?#{refKey}' }")  
  private ReferencedObject ref;
}
```

```java
@WritingConverter
class ToDocumentPointerConverter implements Converter<ReferencedObject, DocumentPointer<Document>> {
	public DocumentPointer<Document> convert(ReferencedObject source) {
		return () -> new Document("refKey", source.id);    
	}
}
```

```json
// entity
{
  "_id" : "8cfb002",
  "ref" : {
    "refKey" : "9a48e32"                                   
  }
}

// referenced object
{
  "_id" : "9a48e32"
}
```

--------------------------------

### CDI Repository Injection

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/cdi-integration.adoc

This Java snippet illustrates how to inject and use a Spring Data MongoDB repository within a CDI-managed bean. After a MongoTemplate is available as a CDI bean, the CDI extension automatically creates proxies for repository interfaces when requested.

```java
class RepositoryClient {

  @Inject
  PersonRepository repository;

  public void businessMethod() {
    List<Person> people = repository.findAll();
  }
}
```

--------------------------------

### Enable Automatic Index Creation in Spring Data MongoDB (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-index-management.adoc

Explains how to enable automatic index creation in Spring Data MongoDB by overriding the autoIndexCreation() method in your configuration class. Automatic index creation is disabled by default since version 3.0.

```java
@Configuration
public class Config extends AbstractMongoClientConfiguration {

  @Override
  public boolean autoIndexCreation() {
    return true;
  }

// ...
}
```

--------------------------------

### SpEL Expression Support in MongoDB Projections

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

Details how Spring Expression Language (SpEL) can be used within Spring Data MongoDB projection expressions for complex calculations. It shows the translation from SpEL to MongoDB aggregation expression parts.

```java
// { $setEquals : [$a, [5, 8, 13] ] }
.andExpression("setEquals(a, new int[]{5, 8, 13})");
```

--------------------------------

### Aggregation Update with Average and Conditional Grade

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Demonstrates how to perform an update operation using an aggregation pipeline. It calculates the average of a field and assigns a grade based on conditional logic, applying the update to all matching documents.

```java
UpdateResult result = template.update(Student.class)
    .apply(update("average", ArithmeticOperators.valueOf("tests").avg())
        .set("grade", ConditionalOperators.switchCases(
            when(valueOf("average").greaterThanEqualToValue(90)).then("A"),
            when(valueOf("average").greaterThanEqualToValue(80)).then("B"),
            when(valueOf("average").greaterThanEqualToValue(70)).then("C"),
            when(valueOf("average").greaterThanEqualToValue(60)).then("D"))
            .defaultTo("F")))
    .all();
```

```javascript
db.students.update(
   { },
   [
     { $set: { average : { $avg: "$tests" } } },
     { $set: { grade: { $switch: {
                           branches: [
                               { case: { $gte: [ "$average", 90 ] }, then: "A" },
                               { case: { $gte: [ "$average", 80 ] }, then: "B" },
                               { case: { $gte: [ "$average", 70 ] }, then: "C" },
                               { case: { $gte: [ "$average", 60 ] }, then: "D" }
                           ],
                           default: "F"
     } } } }
   ],
   { multi: true }
)
```

--------------------------------

### Geo-spatial Queries with Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Defines repository methods for geo-spatial queries using Spring Data MongoDB. Supports imperative and reactive approaches, leveraging Point and Distance objects. Geo-spatial queries can utilize $nearSphere or $near operators based on the Distance metric and configuration.

```java
public interface PersonRepository extends MongoRepository<Person, String> {

    // {'geoNear' : 'location', 'near' : [x, y] }
    GeoResults<Person> findByLocationNear(Point location);

    // No metric: {'geoNear' : 'person', 'near' : [x, y], maxDistance : distance }
    // Metric: {'geoNear' : 'person', 'near' : [x, y], 'maxDistance' : distance,
    //          'distanceMultiplier' : metric.multiplier, 'spherical' : true }
    GeoResults<Person> findByLocationNear(Point location, Distance distance);

    // Metric: {'geoNear' : 'person', 'near' : [x, y], 'minDistance' : min,
    //          'maxDistance' : max, 'distanceMultiplier' : metric.multiplier,
    //          'spherical' : true }
    GeoResults<Person> findByLocationNear(Point location, Distance min, Distance max);

    // {'geoNear' : 'location', 'near' : [x, y] }
    GeoResults<Person> findByLocationNear(Point location);
}
```

```java
interface PersonRepository extends ReactiveMongoRepository<Person, String>  {

    // {'geoNear' : 'location', 'near' : [x, y] }
    Flux<GeoResult<Person>> findByLocationNear(Point location);

    // No metric: {'geoNear' : 'person', 'near' : [x, y], maxDistance : distance }
    // Metric: {'geoNear' : 'person', 'near' : [x, y], 'maxDistance' : distance,
    //          'distanceMultiplier' : metric.multiplier, 'spherical' : true }
    Flux<GeoResult<Person>> findByLocationNear(Point location, Distance distance);

    // Metric: {'geoNear' : 'person', 'near' : [x, y], 'minDistance' : min,
    //          'maxDistance' : max, 'distanceMultiplier' : metric.multiplier,
    //          'spherical' : true }
    Flux<GeoResult<Person>> findByLocationNear(Point location, Distance min, Distance max);

    // {'geoNear' : 'location', 'near' : [x, y] }
    Flux<GeoResult<Person>> findByLocationNear(Point location);
}
```

--------------------------------

### Document Reference with Explicit Lookup (_id)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/document-references.adoc

Shows how to use an explicit lookup query with `@DocumentReference` when referencing by `_id`. The `?#{#target}` expression resolves to the value of the reference property.

```java
class Entity {
  @DocumentReference(lookup = "{ '_id' : '?#{#target}' }") 
  ReferencedObject ref;
}
```

```json
// entity
{
  "_id" : "8cfb002",
  "ref" : "9a48e32"                                        
}

// referenced object
{
  "_id" : "9a48e32"
}
```

--------------------------------

### Field Projection on Unwrapped Objects

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/unwrapping-entities.adoc

Shows how to project entire unwrapped objects or specific fields within them using Spring Data MongoDB queries and their corresponding MongoDB JSON syntax.

```java
Query findByUserLastName = query(where("name.firstname").is("Gamora"));
findByUserLastName.fields().include("name");
List<User> user = template.findAll(findByUserName, User.class);
```

```json
db.collection.find({
  "lastname" : "Gamora"
},
{
  "firstname" : 1,
  "lastname" : 1
})
```

```java
Query findByUserLastName = query(where("name.lastname").is("Smoak"));
findByUserLastName.fields().include("name.firstname");
List<User> user = template.findAll(findByUserName, User.class);
```

```json
db.collection.find({
  "lastname" : "Smoak"
},
{
  "firstname" : 1
})
```

--------------------------------

### Repository Queries on Unwrapped Objects

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/unwrapping-entities.adoc

Illustrates how Spring Data MongoDB's Repository abstraction can derive queries based on fields within unwrapped objects, matching either the entire object or specific nested fields.

```java
interface UserRepository extends CrudRepository<User, String> {

	List<User> findByName(UserName username); 

	List<User> findByNameFirstname(String firstname);
}
```

--------------------------------

### Declare Wildcard Index on Property in Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-index-management.adoc

Demonstrates how to apply the `@WildcardIndexed` annotation to a specific property within a Spring Data MongoDB `@Document` to create a wildcard index for that property, along with the equivalent MongoDB shell command.

```java
@Document
public class User {
    private @Id String id;

    @WildcardIndexed
    private UserMetadata userMetadata;
}
```

```javascript
db.user.createIndex({ "userMetadata.$**" : 1 }, {})
```

--------------------------------

### Reactive Geo-spatial Query with MongoTemplate

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-api.adoc

Shows a reactive geo-spatial query using MongoTemplate to find entities near a specified location, returning a Flux of GeoResults.

```java
Flux<GeoResult<Jedi>> results = template.query(SWCharacter.class)
  .as(Jedi.class)
  .near(alderaan) // NearQuery.near(-73.9667, 40.78).maxDis…
  .all();
```

--------------------------------

### Spring Data MongoDB: Group and Sort First Names by Lastname

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Extends the grouping aggregation by allowing a `Sort` argument. The `$sort` stage is appended after the declared pipeline, affecting the order of final results. Sort properties are mapped against the return type's `@Id` field.

```java
@Aggregation("{ $group: { _id : $lastname, names : { $addToSet : $firstname } } }")
  List<PersonAggregate> groupByLastnameAndFirstnames(Sort sort);
```

--------------------------------

### MongoTemplate Delete Methods

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Provides overloaded methods for removing objects from the database. These include removing a single entity by its ID, removing all documents matching a query, and removing a specified number of documents.

```java
template.remove(tywin, "GOT");                                              <1>

template.remove(query(where("lastname").is("lannister")), "GOT");           <2>

template.remove(new Query().limit(3), "GOT");                               <3>

template.findAllAndRemove(query(where("lastname").is("lannister"), "GOT");  <4>

template.findAllAndRemove(new Query().limit(3), "GOT");                     <5>

<1> Remove a single entity specified by its `_id` from the associated collection.
<2> Remove all documents that match the criteria of the query from the `GOT` collection.
<3> Remove a limited number of documents matching the query criteria.
<4> Find and remove all documents matching the query criteria.
<5> Find and remove a limited number of documents matching the query criteria.
```

--------------------------------

### MongoDB Query with Sorting

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/unwrapping-entities.adoc

Demonstrates a basic MongoDB query to find documents by 'lastname' and sort the results by 'firstname'.

```json
db.collection.find({
  "lastname" : "Romanoff"
}).sort({ "firstname" : 1 })
```

--------------------------------

### Use Collation with MongoDB Find Operation in Java

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/collation.adoc

Illustrates how to apply a `Collation` instance to a `Query` object for performing find operations in MongoDB using Spring Data MongoDB. This ensures string comparisons within the query adhere to the specified collation rules.

```java
Collation collation = Collation.of("de");

Query query = new Query(Criteria.where("firstName").is("Amél")).collation(collation);

List<Person> results = template.find(query, Person.class);
```

--------------------------------

### Perform Full-Text Search Query

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Executes a full-text search query using Spring Data MongoDB's TextQuery and TextCriteria. It searches for documents matching any of the specified terms. The results are returned as a list of Document objects.

```java
Query query = TextQuery
  .queryText(new TextCriteria().matchingAny("coffee", "cake"));

List<Document> page = template.find(query, Document.class);
```

--------------------------------

### Create JSON Schema with Java API (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-schema.adoc

Demonstrates how to programmatically create a JSON schema using Spring Data MongoDB's fluent API. This approach allows for building schemas dynamically within Java applications.

```java
MongoJsonSchema.builder()
    .required("lastname")
    .properties(
                required(string("firstname")).possibleValues("luke", "han"),
                object("address")
                     .properties(string("postCode").minLength(4).maxLength(5)))
    .build();
```

--------------------------------

### Spring Data MongoDB Map-Reduce with Output Collection

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-mapreduce.adoc

Configures a Map-Reduce operation to write its results to a specified output collection ('jmr1_out') using `MapReduceOptions`.

```java
MapReduceResults<ValueObject> results = mongoOperations.mapReduce("jmr1", "classpath:map.js", "classpath:reduce.js",
                                                                     new MapReduceOptions().outputCollection("jmr1_out"), ValueObject.class);
```

--------------------------------

### Retrieving Distinct Values

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Shows how to query for distinct values of a single field using the `distinct` operation. The results can be retrieved as a list of `Object` or strongly typed.

```java
template.query(Person.class)
  .distinct("lastname")
  .all();
```

```java
template.query(Person.class)
  .distinct("lastname")
  .as(String.class)
  .all();
```

--------------------------------

### Enable Bean Validation (Reactive)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/lifecycle-events.adoc

Configures the `ReactiveValidatingEntityCallback` to enable Bean Validation for MongoDB entities in a reactive Spring application context. This requires a `Validator` bean to be available.

```java
@Configuration
class Config {

  @Bean
  public ReactiveValidatingEntityCallback validatingEntityCallback(Validator validator) {
    return new ReactiveValidatingEntityCallback(validator);
  }
}
```

--------------------------------

### Vector Abstraction

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/partials/vector-search.adoc

Demonstrates the creation of a Vector object, representing an n-dimensional numerical embedding, using the `Vector.of()` factory method. This provides a type-safe way to handle vector data in Spring Data.

```java
Vector vector = Vector.of(0.23f, 0.11f, 0.77f);
```

--------------------------------

### GeoSpatial Query: Find Venues Near Point (Spherical)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Finds venues located near a specified point using spherical coordinates with a maximum distance constraint.

```java
Point point = new Point(-73.99171, 40.738868);
List<Venue> venues =
    template.find(
        new Query(
            Criteria.where("location").nearSphere(point).maxDistance(0.003712240453784)),
        Venue.class);

```

--------------------------------

### Update Class Methods and Fluent API

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Details the various methods available in the `Update` class for constructing MongoDB update operations. These methods support MongoDB's update modifiers and are designed for a fluent, chainable API style.

```APIDOC
Update Class Methods:

You can use the `Update` class to build update operations fluently. The class provides methods corresponding to MongoDB update modifiers.

*   `Update` *addToSet* `(String key, Object value)`: Updates using the `$addToSet` modifier. Adds a value to an array field if it's not already present.
*   `Update` *currentDate* `(String key)`: Updates a field to the current date.
*   `Update` *currentTimestamp* `(String key)`: Updates a field to the current timestamp.
*   `Update` *inc* `(String key, Number inc)`: Updates a numeric field by incrementing its value using the `$inc` modifier.
*   `Update` *max* `(String key, Object max)`: Updates a field to the specified value if the specified value is greater than the field's current value, using the `$max` modifier.
*   `Update` *min* `(String key, Object min)`: Updates a field to the specified value if the specified value is less than the field's current value, using the `$min` modifier.
*   `Update` *multiply* `(String key, Number multiplier)`: Updates a numeric field by multiplying its value by the specified multiplier, using the `$mul` modifier.
*   `Update` *pop* `(String key, Update.Position pos)`: Removes the first or last element of an array field, using the `$pop` modifier.
*   `Update` *pull* `(String key, Object value)`: Removes the first occurrence of a specified value from an array field, using the `$pull` modifier.
*   `Update` *pullAll* `(String key, Object[] values)`: Removes all occurrences of specified values from an array field, using the `$pullAll` modifier.
*   `Update` *push* `(String key, Object value)`: Appends a value to an array field, using the `$push` modifier.
*   `Update` *rename* `(String oldName, String newName)`: Renames a field, using the `$rename` modifier.
*   `Update` *set* `(String key, Object value)`: Sets the value of a field, using the `$set` modifier.
*   `Update` *setOnInsert* `(String key, Object value)`: Sets the value of a field only if the document is inserted, using the `$setOnInsert` modifier.
*   `Update` *unset* `(String key)`: Removes a field, using the `$unset` modifier.

Example Usage for `$push` and `$addToSet` with `$each`:

```java
// { $push : { "category" : { "$each" : [ "spring" , "data" ] } } }
new Update().push("category").each("spring", "data")

// { $push : { "key" : { "$position" : 0 , "$each" : [ "Arya" , "Arry" , "Weasel" ] } } }
new Update().push("key").atPosition(Position.FIRST).each(Arrays.asList("Arya", "Arry", "Weasel"));

// { $push : { "key" : { "$slice" : 5 , "$each" : [ "Arya" , "Arry" , "Weasel" ] } } }
new Update().push("key").slice(5).each(Arrays.asList("Arya", "Arry", "Weasel"));

// { $addToSet : { "values" : { "$each" : [ "spring" , "data" , "mongodb" ] } } }
new Update().addToSet("values").each("spring", "data", "mongodb");
```
```

--------------------------------

### Supported JSON Schema Types for MongoDB in Spring Data

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-schema.adoc

This section lists the JSON schema types supported by Spring Data MongoDB, their corresponding Java types, and the schema properties available for each type. It provides a comprehensive reference for defining MongoDB JSON schemas.

```APIDOC
Schema Type | Java Type | Schema Properties
------------|-----------|------------------
untyped     | -         | description, generated description, enum, allOf, anyOf, oneOf, not
object      | Object    | required, additionalProperties, properties, minProperties, maxProperties, patternProperties
array       | any array except byte[] | uniqueItems, additionalItems, items, minItems, maxItems
string      | String    | minLength, maxLentgth, pattern
int         | int, Integer | multipleOf, minimum, exclusiveMinimum, maximum, exclusiveMaximum
long        | long, Long | multipleOf, minimum, exclusiveMinimum, maximum, exclusiveMaximum
double      | float, Float, double, Double | multipleOf, minimum, exclusiveMinimum, maximum, exclusiveMaximum
decimal     | BigDecimal | multipleOf, minimum, exclusiveMinimum, maximum, exclusiveMaximum
number      | Number    | multipleOf, minimum, exclusiveMinimum, maximum, exclusiveMaximum
binData     | byte[]    | (none)
boolean     | boolean, Boolean | (none)
null        | null      | (none)
objectId    | ObjectId  | (none)
date        | java.util.Date | (none)
timestamp   | BsonTimestamp | (none)
regex       | java.util.regex.Pattern | (none)
```

--------------------------------

### MongoDB $geoNear Aggregation Stage (Legacy Coordinates)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Illustrates the `$geoNear` aggregation stage using legacy coordinate pairs (longitude, latitude). It requires a `distanceMultiplier` to convert radians to desired units (e.g., kilometers) and operates on a spherical model.

```APIDOC
MongoDB $geoNear Aggregation Stage (Legacy Coordinates):
  $geoNear:
    maxDistance: Maximum distance from center point in Radians.
    distanceMultiplier: Multiplier to convert radians to desired units (e.g., 6378.137 for Kilometers).
    num: Maximum number of documents to return.
    near: The center point for the query, specified as an array of [longitude, latitude].
    spherical: Indicates whether to use spherical geometry for calculations (true for legacy coordinates on a sphere).
    key: The index key to use for the query.
    distanceField: The field to add the calculated distance to.

  Example:
  {
    "$geoNear": {
      "maxDistance": 0.0000627142377,
      "distanceMultiplier": 6378.137,
      "num": 10,
      "near": [-73.99171, 40.738868],
      "spherical":true,
      "key": "location",
      "distanceField": "distance"
    }
  }

  Returns:
    Documents within the specified radius, with an added 'distance' field in the unit determined by `distanceMultiplier`.
    Example document:
    {
      "_id" : ObjectId("5c10f3735d38908db52796a6"),
      "name" : "10gen Office",
      "location" : { "type" : "Point", "coordinates" : [ -73.99171, 40.738868 ] },
      "distance" : 0.0
    }
```

--------------------------------

### Spring Data MongoDB Criteria Operators

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Defines various methods on the Criteria class for constructing MongoDB query operators. These include logical operators like $nor and $or, meta operators like $not, and specific query operators such as $regex, $sampleRate, $size, $type, and $jsonSchema.

```APIDOC
Criteria norOperator(Criteria... criteria)
  Creates an nor query using the $nor operator for all of the provided criteria.

Criteria norOperator(Collection<Criteria> criteria)
  Creates an nor query using the $nor operator for all of the provided criteria.

Criteria not()
  Creates a criterion using the $not meta operator which affects the clause directly following.

Criteria orOperator(Criteria... criteria)
  Creates an or query using the $or operator for all of the provided criteria.

Criteria orOperator(Collection<Criteria> criteria)
  Creates an or query using the $or operator for all of the provided criteria.

Criteria regex(String re)
  Creates a criterion using a $regex.

Criteria sampleRate(double sampleRate)
  Creates a criterion using the $sampleRate operator.

Criteria size(int s)
  Creates a criterion using the $size operator.

Criteria type(int t)
  Creates a criterion using the $type operator.

Criteria matchingDocumentStructure(MongoJsonSchema schema)
  Creates a criterion using the $jsonSchema operator for JSON schema criteria. $jsonSchema can only be applied on the top level of a query and not property specific. Use the properties attribute of the schema to match against nested fields.

Criteria bits()
  Gateway to MongoDB bitwise query operators like $bitsAllClear.
```

--------------------------------

### Built-in Type Conversions in Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping.adoc

This section details the built-in type conversions supported by Spring Data MongoDB. It maps various Java types to their BSON representations, including native mappings and conversions handled by Spring Data's converters. Understanding these mappings is crucial for efficient data persistence and retrieval.

```APIDOC
SpringDataMongoDBTypeConversions:
  description: "Maps Java types to BSON representations supported by Spring Data MongoDB."
  conversions:
    - javaType: "String"
      bsonType: "native"
      sample: "{\"firstname\" : \"Dave\"}"
    - javaType: "double, Double, float, Float"
      bsonType: "native"
      sample: "{\"weight\" : 42.5}"
    - javaType: "int, Integer, short, Short"
      bsonType: "native + 32-bit integer"
      sample: "{\"height\" : 42}"
    - javaType: "long, Long"
      bsonType: "native + 64-bit integer"
      sample: "{\"height\" : 42}"
    - javaType: "Date, Timestamp"
      bsonType: "native"
      sample: "{\"date\" : ISODate(\"2019-11-12T23:00:00.809Z\")}"
    - javaType: "byte[]"
      bsonType: "native"
      sample: "{\"bin\" : { \"$binary\" : \"AQIDBA==\", \"$type\" : \"00\" }}"
    - javaType: "java.util.UUID (Legacy UUID)"
      bsonType: "native"
      sample: "{\"uuid\" : { \"$binary\" : \"MEaf1CFQ6lSphaa3b9AtlA==\", \"$type\" : \"03\" }}"
    - javaType: "ObjectId"
      bsonType: "native"
      sample: "{\"_id\" : ObjectId(\"5707a2690364aba3136ab870\")}"
    - javaType: "Array, List, BasicDBList"
      bsonType: "native"
      sample: "{\"cookies\" : [ … ]}"
    - javaType: "boolean, Boolean"
      bsonType: "native"
      sample: "{\"active\" : true}"
    - javaType: "null"
      bsonType: "native"
      sample: "{\"value\" : null}"
    - javaType: "Document"
      bsonType: "native"
      sample: "{\"value\" : { … }}"
    - javaType: "Decimal128"
      bsonType: "native"
      sample: "{\"value\" : NumberDecimal(…)}"
    - javaType: "AtomicInteger (calling get() before conversion)"
      bsonType: "converter + 32-bit integer"
      sample: "{\"value\" : \"741\" }"
    - javaType: "AtomicLong (calling get() before conversion)"
      bsonType: "converter + 64-bit integer"
      sample: "{\"value\" : \"741\" }"
    - javaType: "BigInteger"
      bsonType: "converter + NumberDecimal, String"
      sample: "{\"value\" : NumberDecimal(741) }", "{\"value\" : \"741\" }"
    - javaType: "BigDecimal"
      bsonType: "converter + NumberDecimal, String"
      sample: "{\"value\" : NumberDecimal(741.99) }", "{\"value\" : \"741.99\" }"
    - javaType: "URL"
      bsonType: "converter"
      sample: "{\"website\" : \"https://spring.io/projects/spring-data-mongodb/\" }"
    - javaType: "Locale"
      bsonType: "converter"
      sample: "{\"locale\" : \"en_US\" }"
    - javaType: "char, Character"
      bsonType: "converter"
      sample: "{\"char\" : \"a\" }"
    - javaType: "NamedMongoScript"
      bsonType: "converter + Code"
      sample: "{\"_id\" : \"script name\", value: (some javascript code)}"
    - javaType: "java.util.Currency"
      bsonType: "converter"
      sample: "{\"currencyCode\" : \"EUR\"}"
    - javaType: "Instant (Java 8)"
      bsonType: "native"
      sample: "{\"date\" : ISODate(\"2019-11-12T23:00:00.809Z\")}"
    - javaType: "Instant (Joda, JSR310-BackPort)"
      bsonType: "converter"
      sample: "{\"date\" : ISODate(\"2019-11-12T23:00:00.809Z\")}"
    - javaType: "LocalDate (Joda, Java 8, JSR310-BackPort)"
      bsonType: "converter / native (Java8)"
      notes: "Uses UTC zone offset. Configure via MongoConverterConfigurationAdapter."
      sample: "{\"date\" : ISODate(\"2019-11-12T00:00:00.000Z\")}"
    - javaType: "LocalDateTime, LocalTime (Joda, Java 8, JSR310-BackPort)"
      bsonType: "converter / native (Java8)"
      notes: "Uses UTC zone offset. Configure via MongoConverterConfigurationAdapter."
      sample: "{\"date\" : ISODate(\"2019-11-12T23:00:00.809Z\")}"
    - javaType: "DateTime (Joda)"
      bsonType: "converter"
      sample: "{\"date\" : ISODate(\"2019-11-12T23:00:00.809Z\")}"
    - javaType: "ZoneId (Java 8, JSR310-BackPort)"
      bsonType: "converter"
      sample: "{\"zoneId\" : \"ECT - Europe/Paris\"}"
    - javaType: "Box"
      bsonType: "converter"
      sample: "{\"box\" : { \"first\" : { \"x\" : 1.0 , \"y\" : 2.0} , \"second\" : { \"x\" : 3.0 , \"y\" : 4.0}}}"
    - javaType: "Polygon"
      bsonType: "converter"
      sample: "{\"polygon\" : { \"points\" : [ { \"x\" : 1.0 , \"y\" : 2.0} , { \"x\" : 3.0 , \"y\" : 4.0} , { \"x\" : 4.0 , \"y\" : 5.0}]}}"
    - javaType: "Circle"
      bsonType: "converter"
      sample: "{\"circle\" : { \"center\" : { \"x\" : 1.0 , \"y\" : 2.0} , \"radius\" : 3.0 , \"metric\" : \"NEUTRAL\"}}"
    - javaType: "Point"
      bsonType: "converter"
      sample: "{\"point\" : { \"x\" : 1.0 , \"y\" : 2.0}}"
    - javaType: "GeoJsonPoint"
      bsonType: "converter"
      sample: "{\"point\" : { \"type\" : \"Point\" , \"coordinates\" : [3.0 , 4.0] }}"
    - javaType: "GeoJsonMultiPoint"
      bsonType: "converter"
      sample: "{ \"geoJsonLineString\" : {\"type\":\"MultiPoint\", \"coordinates\": [ [ 0 , 0 ], [ 0 , 1 ], [ 1 , 1 ] ] }}"
    - javaType: "Sphere"
      bsonType: "converter"
      sample: "{\"sphere\" : { \"center\" : { \"x\" : 1.0 , \"y\" : 2.0} , \"radius\" : 3.0 , \"metric\" : \"NEUTRAL\"}}"
    - javaType: "GeoJsonPolygon"
      bsonType: "converter"
      sample: "{\"polygon\" : { \"type\" : \"Polygon\", \"coordinates\" : [[ [ 0 , 0 ], [ 3 , 6 ], [ 6 , 1 ], [ 0 , 0  ] ]] }}"
    - javaType: "GeoJsonMultiPolygon"
      bsonType: "converter"
      sample: "{\"geoJsonMultiPolygon\" : { \"type\" : \"MultiPolygon\", \"coordinates\" : [
[ [ [ -73.958 , 40.8003 ] , [ -73.9498 , 40.7968 ] ] ],
[ [ [ -73.973 , 40.7648 ] , [ -73.9588 , 40.8003 ] ] ]
] }}"
    - javaType: "GeoJsonLineString"
      bsonType: "converter"
      sample: "{ \"geoJsonLineString\" : { \"type\" : \"LineString\", \"coordinates\" : [ [ 40 , 5 ], [ 41 , 6 ] ] }}"
    - javaType: "GeoJsonMultiLineString"
      bsonType: "converter"
      sample: "{\"geoJsonLineString\" : { \"type\" : \"MultiLineString\", coordinates: [

```

--------------------------------

### Define Custom SpEL EvaluationContextExtension for MongoDB Encryption Key IDs in Java

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-schema.adoc

This code defines an EncryptionExtension class that implements EvaluationContextExtension. It provides a custom 'mongocrypt.keyId' function, allowing for flexible computation of key IDs based on the target element name, which is crucial for dynamic key resolution in client-side encryption.

```java
public class EncryptionExtension implements EvaluationContextExtension {

    @Override
    public String getExtensionId() {
        return "mongocrypt";
    }

    @Override
    public Map<String, Function> getFunctions() {
        return Collections.singletonMap("keyId", new Function(getMethod("computeKeyId", String.class), this));
    }

    public String computeKeyId(String target) {
        // ... lookup via target element name
    }
}
```

--------------------------------

### Replace Operations

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Provides methods to replace the first matching document in a collection. If no match is found, a new document can be upserted by providing appropriate ReplaceOptions. It is not possible to change the `_id` of existing documents.

```APIDOC
// Replace one document
Person tom = template.insert(new Person("Motte", 21));
Query query = Query.query(Criteria.where("firstName").is(tom.getFirstName()));
tom.setFirstname("Tom");
template.replace(query, tom, ReplaceOptions.none());

// Replace one document with upsert
Person tom = new Person("id-123", "Tom", 21);
Query query = Query.query(Criteria.where("firstName").is(tom.getFirstName()));
template.replace(query, tom, ReplaceOptions.replaceOptions().upsert());

// Upsert behavior for _id:
// 1. The _id is used within the query (e.g., {"_id" : 1234 })
// 2. The _id is present in the replacement document.
// Note: On upsert, MongoDB uses these ways to determine the new id. 
// @Field(targetType) hints are not considered for ObjectId generation.
```

--------------------------------

### Spring Data MongoDB: One-To-Many Reference

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/document-references.adoc

Demonstrates modeling a one-to-many relationship where the owning document ('Book') stores a foreign key ('publisherId'), and the referenced document ('Publisher') uses @ReadOnlyProperty and @DocumentReference to fetch the associated 'Book' entities.

```java
@Document
class Book {

  @Id
  ObjectId id;
  String title;
  List<String> author;

  ObjectId publisherId;                                        <1>
}

@Document
class Publisher {

  @Id
  ObjectId id;
  String acronym;
  String name;

  @ReadOnlyProperty                                            <2>
  @DocumentReference(lookup="{'publisherId':?#{#self._id} }")  <3>
  List<Book> books;
}
```

```json
/* Book Document */
{
  "_id" : 9a48e32,
  "title" : "The Warded Man",
  "author" : ["Peter V. Brett"],
  "publisherId" : 8cfb002
}

/* Publisher Document */
{
  "_id" : 8cfb002,
  "acronym" : "DR",
  "name" : "Del Rey"
}
```

--------------------------------

### Spring Data MongoDB Repository Search Methods with @VectorSearch

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/partials/vector-search-method-derived-include.adoc

Demonstrates how to define repository methods for vector search using the @VectorSearch annotation. This annotation specifies the index name and other parameters like numCandidates for the MongoDB $vectorSearch aggregation stage. It supports searching for documents near a given vector or within a specified similarity range.

```java
interface CommentRepository extends Repository<Comment, String> {

  @VectorSearch(indexName = "my-index", numCandidates="200")
  SearchResults<Comment> searchTop10ByEmbeddingNear(Vector vector, Score score);

  @VectorSearch(indexName = "my-index", numCandidates="200")
  SearchResults<Comment> searchTop10ByEmbeddingWithin(Vector vector, Range<Similarity> range);

  @VectorSearch(indexName = "my-index", numCandidates="200")
  SearchResults<Comment> searchTop10ByCountryAndEmbeddingWithin(String country, Vector vector, Range<Similarity> range);
}
```

--------------------------------

### Implementing a Custom MongoTypeMapper

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/converters-type-mapping.adoc

Provides a basic class definition for creating a custom MongoTypeMapper by extending DefaultMongoTypeMapper. This allows for highly customized type mapping logic beyond the default behavior or @TypeAlias.

```Java
class CustomMongoTypeMapper extends DefaultMongoTypeMapper {
  //implement custom type mapping here
}
```

--------------------------------

### Querying Unwrapped Object Properties

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/unwrapping-entities.adoc

Demonstrates how to query based on the properties of an unwrapped object. It shows matching the entire unwrapped object and also directly accessing nested fields within the query.

```java
UserName userName = new UserName("Carol", "Danvers")
Query findByUserName = query(where("name").is(userName));
User user = template.findOne(findByUserName, User.class);
```

```json
db.collection.find({
  "firstname" : "Carol",
  "lastname" : "Danvers"
})
```

```java
Query findByUserFirstName = query(where("name.firstname").is("Shuri"));
List<User> users = template.findAll(findByUserFirstName, User.class);
```

```json
db.collection.find({
  "firstname" : "Shuri"
})
```

--------------------------------

### Customizing Field Types and Annotations

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping.adoc

Illustrates how to use `@Field(targetType=...)` to specify the native MongoDB type when inference is incorrect, such as for `BigDecimal`. Also shows how to create custom annotations that leverage `@Field` for specific type mappings.

```java
public class Balance {

  @Field(targetType = STRING)
  private BigDecimal value;

  // ...
}
```

```java
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Field(targetType = FieldType.STRING)
public @interface AsString { }

// ...

public class Balance {

  @AsString
  private BigDecimal value;

  // ...
}
```

--------------------------------

### GeoSpatial Query: Find Venues Near Point

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Finds venues located near a specified point with a maximum distance constraint.

```java
Point point = new Point(-73.99171, 40.738868);
List<Venue> venues =
    template.find(new Query(Criteria.where("location").near(point).maxDistance(0.01)), Venue.class);
```

--------------------------------

### Count Documents Using Template API

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-document-count.adoc

Demonstrates how to count documents matching a specific query criteria using the `MongoTemplate`'s query API. This method utilizes MongoDB's `countDocuments` for accurate counts.

```java
template.query(Person.class)
    .matching(query(where("firstname").is("luke")))
    .count();
```

--------------------------------

### Define Sample JSON Schema (JSON)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-schema.adoc

This snippet shows a sample JSON schema structure used for validating MongoDB documents. It defines document types, required fields, and property-specific constraints like data types and allowed values.

```json
{
  "type": "object",
  "required": [ "firstname", "lastname" ],
  "properties": {
    "firstname": {
      "type": "string",
      "enum": [ "luke", "han" ]
    },
    "address": {
      "type": "object",
      "properties": {
        "postCode": { "type": "string", "minLength": 4, "maxLength": 5 }
      }
    }
  }
}
```

--------------------------------

### Enable Bean Validation (Imperative)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/lifecycle-events.adoc

Configures the `ValidatingEntityCallback` to enable Bean Validation for MongoDB entities in an imperative Spring application context. This requires a `Validator` bean to be available.

```java
@Configuration
class Config {

  @Bean
  public ValidatingEntityCallback validatingEntityCallback(Validator validator) {
    return new ValidatingEntityCallback(validator);
  }
}
```

--------------------------------

### Enable Bean Validation Callbacks in Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/lifecycle-events.adoc

This configuration demonstrates how to enable Bean Validation for Spring Data MongoDB entities. It shows how to register ValidatingEntityCallback for imperative usage and ReactiveValidatingEntityCallback for reactive usage by providing a Validator bean in a Spring ApplicationContext.

```java
@Configuration
class Config {

  @Bean
  public ValidatingEntityCallback validatingEntityCallback(Validator validator) {
    return new ValidatingEntityCallback(validator);
  }
}
```

```java
@Configuration
class Config {

  @Bean
  public ReactiveValidatingEntityCallback validatingEntityCallback(Validator validator) {
    return new ReactiveValidatingEntityCallback(validator);
  }
}
```

--------------------------------

### MongoDB _id Field Type Handling

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping.adoc

Details the type conversion rules for Java properties mapped to the MongoDB `_id` field, including automatic conversion and manual assignment.

```APIDOC
Type Handling Rules for _id Field:

* String/BigInteger `id` field: Converted to ObjectId if possible. Stored as-is if conversion fails.
* `@Id` annotated field: Same conversion rules as a String/BigInteger `id` field.
* `@MongoId` annotated field: Uses its actual type. No further conversion unless `FieldType` is specified.
* `@MongoId(FieldType.XXX)` annotated field: Attempts conversion to the declared `FieldType`. Creates ObjectId if no value is provided.
* Non-String/BigInteger/ObjectId `id` field: Requires manual value assignment for 'as-is' storage.
* No `id` field: Implicit `_id` generated by the driver, not mapped to a Java property.
```

--------------------------------

### Geo-near Query with Distance Field

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Demonstrates using the `$geoNear` aggregation to find nearby documents and map the calculated distance into a domain type field.

```APIDOC
Geo-near Queries (Spring Data MongoDB 2.2+):

Note: MongoDB 4.2 removed support for the `geoNear` command. Spring Data MongoDB 2.2+ uses the `$geoNear` aggregation.

Example Usage:

[source, java]
----
GeoResults<VenueWithDistanceField> = template.query(Venue.class)
    .as(VenueWithDistanceField.class)
    .near(NearQuery.near(new GeoJsonPoint(-73.99, 40.73), KILOMETERS))
    .all();
----

Explanation:
<1> Domain type used to identify the target collection and potential query mapping.
<2> Target type containing a `dis` field of type `Number` to receive the calculated distance.

The calculated distance (previously returned within a wrapper type) is now embedded into the resulting document. If the domain type already contains a property named 'dis', the calculated distance is named 'calculated-distance' with a potentially random postfix.
```

--------------------------------

### Configuring BigDecimal Representation in Spring Data MongoDB

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/custom-conversions.adoc

Explains how to configure the representation for `BigDecimal` and `BigInteger` in Spring Data MongoDB, defaulting to `Decimal128` since version 5.0, and how to revert to `STRING` representation.

```APIDOC
MongoCustomConversions.create(config -> config.bigDecimal(BigDecimalRepresentation.STRING))
```

--------------------------------

### JSON Query with Parameter Substitution

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Allows specifying MongoDB JSON query strings directly in repository methods using the @Query annotation. Parameter values from method arguments are substituted into the query using placeholders like ?0. String parameter values are escaped, limiting direct use of MongoDB operators via arguments.

```java
public interface PersonRepository extends MongoRepository<Person, String> {

    @Query("{ 'firstname' : ?0 }")
    List<Person> findByThePersonsFirstname(String firstname);

}
```

```java
public interface PersonRepository extends ReactiveMongoRepository<Person, String> {

    @Query("{ 'firstname' : ?0 }")
    Flux<Person> findByThePersonsFirstname(String firstname);

}
```

--------------------------------

### Spring Data MongoDB Geospatial Queries

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Provides methods on the Criteria class for performing geospatial queries using MongoDB's geospatial operators. This includes $geoWithin and $near operators for location-based searches.

```APIDOC
Criteria within(Circle circle)
  Creates a geospatial criterion using $geoWithin $center operators.

Criteria within(Box box)
  Creates a geospatial criterion using a $geoWithin $box operation.

Criteria withinSphere(Circle circle)
  Creates a geospatial criterion using $geoWithin $center operators.

Criteria near(Point point)
  Creates a geospatial criterion using a $near operation.

Criteria nearSphere(Point point)
  Creates a geospatial criterion using $nearSphere$center operations. This is only available for MongoDB 1.7 and higher.

Criteria minDistance(double minDistance)
  Creates a geospatial criterion using the $minDistance operation, for use with $near.

Criteria maxDistance(double maxDistance)
  Creates a geospatial criterion using the $maxDistance operation, for use with $near.
```

--------------------------------

### Spring Data MongoDB: Obtain Raw AggregationResults

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Retrieves the raw `AggregationResults` object, mapped to a generic target wrapper type (`SumValue` in this case) or `org.bson.Document`, providing full control over the aggregation output.

```java
@Aggregation("{ $group : { _id : null, total : { $sum : $age } } }")
  AggregationResults<SumValue> sumAgeRaw();
```

--------------------------------

### Spring Data MongoDB: Sum Aggregation to Custom Wrapper Type

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Maps the result of an aggregation returning a single `Document` (e.g., from `$sum`) to an instance of a desired `SumValue` target type, encapsulating the total sum.

```java
@Aggregation("{ $group : { _id : null, total : { $sum : $age } } }")
  SumValue sumAgeUsingValueWrapper();
```

--------------------------------

### MongoTemplate findAndModify Method Signatures

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Provides the overloaded method signatures for findAndModify operations on MongoCollection. These methods allow updating a document and returning either the old or newly updated document in a single operation, supporting Query, Update, and FindAndModifyOptions.

```java
<T> T findAndModify(Query query, Update update, Class<T> entityClass);

<T> T findAndModify(Query query, Update update, Class<T> entityClass, String collectionName);

<T> T findAndModify(Query query, Update update, FindAndModifyOptions options, Class<T> entityClass);

<T> T findAndModify(Query query, Update update, FindAndModifyOptions options, Class<T> entityClass, String collectionName);
```

--------------------------------

### MongoDB Raw Representation of Dot Notation Field

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping.adoc

Shows the raw JSON document representation of an `Item` object where the `categoryId` property is stored under the `cat.id` field. This illustrates the actual MongoDB document structure for fields containing dots.

```json
{
    'cat.id' : "5b28b5e7-52c2",
    ...
}
```

--------------------------------

### Using @EncryptedField with Alternative Key Name

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-encryption.adoc

Demonstrates how to use the @EncryptedField annotation in Spring Data MongoDB to reference a Data Encryption Key (DEK) via its alternative name. It also shows how to use field references for key lookup, requiring the full document for save operations and limiting field usage in queries.

```java
@EncryptedField(algorithm=…, altKeyName = "secret-key") <1>
String ssn;

@EncryptedField(algorithm=…, altKeyName = "/name")      <2>
String ssn;

<1> Use the DEK stored with the alternative name `secret-key`.
<2> Uses a field reference that will read the actual field value and use that for key lookup.
```

--------------------------------

### Time Series Collection Annotation Options

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-collection-management.adoc

Details the `@TimeSeries` annotation used in Spring Data MongoDB for configuring Time Series collections. It highlights the `expireAfter` option for automatic data expiration.

```APIDOC
@TimeSeries
  - collection: The name of the MongoDB collection.
  - timeField: The field within documents that holds the time-series data.
  - expireAfter: (Optional) Specifies a TTL (Time To Live) for buckets in the time series collection. MongoDB automatically removes expired buckets. Supports various formats like '10s', '3h', expressions ('#{@mySpringBean.timeout}'), and property placeholders ('${my.property.timeout}').
```

--------------------------------

### MongoDB Query: Match Ending String (Case-Insensitive)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Demonstrates a MongoDB query using the `$regex` operator with `$options: 'i'` to find documents where the 'firstname' field ends with 'firstname' in a case-insensitive manner.

```JSON
{"firstname" : { $regex: /firstname$/, $options: 'i'}}
```

--------------------------------

### Geospatial Query Rewrites for Counting

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-document-count.adoc

Illustrates how Spring Data MongoDB rewrites geospatial queries for counting operations to work around limitations in MongoDB's native `countDocuments` and `$match` aggregation. It shows the transformation from `$near` to `$geoWithin` and handles `$minDistance`.

```javascript
{ location : { $near : [-73.99171, 40.738868], $maxDistance : 1.1 } } <1>
{ location : { $geoWithin : { $center: [ [-73.99171, 40.738868], 1.1] } } } <2>

{ location : { $near : [-73.99171, 40.738868], $minDistance : 0.1, $maxDistance : 1.1 } } <3>
{$and :[ { $nor :[ { location :{ $geoWithin :{ $center :[ [-73.99171, 40.738868 ], 0.01] } } } ]}, { location :{ $geoWithin :{ $center :[ [-73.99171, 40.738868 ], 1.1] } } } ] } <4>
```

--------------------------------

### MongoTemplate Save and Insert Operations

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Details the available methods on `MongoTemplate` for saving and inserting objects. Save operations perform an insert if the object is not already present. The `_id` field handling is crucial: properties annotated with `@Id` or named `id` map to the `_id` field. String or BigInteger `id` properties are converted to `ObjectId` if possible. If no `id` is provided, the driver auto-generates an `ObjectId`.

```APIDOC
MongoTemplate Operations:

Save Operations:
  void save(Object objectToSave)
    - Saves the given object to the default collection.
    - If the object's ID is not set, it's assumed to be auto-generated by the database.
    - The collection name is derived from the class name by default.

  void save(Object objectToSave, String collectionName)
    - Saves the given object to the specified collection.
    - Allows overriding the default collection name using mapping metadata.

Insert Operations:
  void insert(Object objectToSave)
    - Inserts the given object into the default collection.
    - Similar to save, assumes auto-generation of ID if not set.

  void insert(Object objectToSave, String collectionName)
    - Inserts the given object into the specified collection.

ID Field Handling:
  - MongoDB requires an `_id` field for all documents.
  - Mapping rules for the `_id` field:
    1. A property or field annotated with `@Id` (org.springframework.data.annotation.Id) maps to `_id`.
    2. A property or field named `id` (without annotation) maps to `_id`.
  - Type Conversion for `_id`:
    - String `id` property: Converted to `ObjectId` using `Converter<String, ObjectId>` if possible; otherwise, stored as a string.
    - BigInteger `id` property: Converted to `ObjectId` using `Converter<BigInteger, ObjectId>`.
  - Implicit `_id` Generation: If no `id` field/property is present, the driver generates an `_id` but it's not mapped to a Java property.
```

--------------------------------

### Flattening Objects with @Unwrapped.Nullable and Prefixes

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/unwrapping-entities.adoc

Illustrates using @Unwrapped.Nullable with a prefix attribute to prepend a string to flattened field names. This allows for distinct mapping when the same nested object type is unwrapped multiple times.

```java
class User {

    @Id
    String userId;

    @Unwrapped.Nullable(prefix = "u_") <1>
    UserName name;

    @Unwrapped.Nullable(prefix = "a_") <2>
    UserName name;
}

class UserName {

    String firstname;

    String lastname;
}
```

```json
{
  "_id" : "a6a805bd-f95f",
  "u_firstname" : "Jean",             <1>
  "u_lastname" : "Grey",
  "a_firstname" : "Something",        <2>
  "a_lastname" : "Else"
}
```

--------------------------------

### Spring Data MongoDB: Custom Document Reference

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/document-references.adoc

Demonstrates referencing a 'Publisher' document from a 'Book' document using a custom field ('acronym') via SpEL expressions in @DocumentReference. This allows flexible association based on non-ID fields.

```java
@Document
class Book {

  @Id
  ObjectId id;
  String title;
  List<String> author;

  @Field("publisher_ac")
  @DocumentReference(lookup = "{ 'acronym' : ?#{#target} }" ) <1>
  Publisher publisher;
}

@Document
class Publisher {

  @Id
  ObjectId id;
  String acronym;                                            <1>
  String name;

  @DocumentReference(lazy = true)                            <2>
  List<Book> books;

}
```

```json
/* Book Document */
{
  "_id" : 9a48e32,
  "title" : "The Warded Man",
  "author" : ["Peter V. Brett"],
  "publisher_ac" : "DR"
}

/* Publisher Document */
{
  "_id" : 1a23e45,
  "acronym" : "DR",
  "name" : "Del Rey",
  ...
}
```

--------------------------------

### MongoDB $geoNear Aggregation Stage (GeoJSON)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Defines the `$geoNear` aggregation stage for performing geospatial queries using GeoJSON format. It specifies the search center, maximum distance in meters, and other parameters like `num`, `spherical`, `key`, and `distanceField`.

```APIDOC
MongoDB $geoNear Aggregation Stage (GeoJSON):
  $geoNear:
    maxDistance: Maximum distance from center point in Meters.
    num: Maximum number of documents to return.
    near: The center point for the query, specified as a GeoJSON Point object.
    spherical: Indicates whether to use spherical geometry for calculations (true for GeoJSON).
    key: The index key to use for the query.
    distanceField: The field to add the calculated distance to.

  Example:
  {
    "$geoNear": {
      "maxDistance": 400,
      "num": 10,
      "near": { "type": "Point", "coordinates": [-73.99171, 40.738868] },
      "spherical":true,
      "key": "location",
      "distanceField": "distance"
    }
  }

  Returns:
    Documents within the specified radius, with an added 'distance' field.
    Example document:
    {
      "_id" : ObjectId("5c10f3735d38908db52796a6"),
      "name" : "10gen Office",
      "location" : { "type" : "Point", "coordinates" : [ -73.99171, 40.738868 ] },
      "distance" : 0.0
    }
```

--------------------------------

### Document Referencing with Sorting

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/document-references.adoc

Illustrates the use of the `@DocumentReference(sort)` attribute in Spring Data MongoDB to control the order of results fetched via document references. It also provides general advice regarding cyclic references, debugging lazy document references, and limitations with reactive infrastructure.

```Java
import org.springframework.data.mongodb.core.mapping.DocumentReference;

// ... within a mapped class
@DocumentReference(sort = "fieldName: 1") // Example: sort by 'fieldName' ascending
private OtherDocument referencedDocument;
```

--------------------------------

### Spring Data MongoDB Map-Reduce with Query

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-mapreduce.adoc

Applies a query to filter the documents processed by the Map-Reduce operation, reducing the dataset fed into the map function.

```java
// Example of specifying a query to filter data for Map-Reduce
// Query query = new Query();
// query.addCriteria(Criteria.where("x").ne(Arrays.asList("a", "b")));
// MapReduceResults<ValueObject> results = mongoOperations.mapReduce("jmr1", "classpath:map.js", "classpath:reduce.js", query, ValueObject.class);
```

--------------------------------

### Query Documents with JSON Schema

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Demonstrates how to query a MongoDB collection for documents that match a specified JSON schema using Spring Data MongoDB. It utilizes `MongoJsonSchema.builder()` to construct the schema and `query(matchingDocumentStructure(schema))` to apply it.

```java
MongoJsonSchema schema = MongoJsonSchema.builder().required("firstname", "lastname").build();

template.find(query(matchingDocumentStructure(schema)), Person.class);
```

--------------------------------

### Querying and Updating Fields with Dots

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping.adoc

Demonstrates how to query and update MongoDB fields that contain dots in their names. Due to the dot's special meaning, these fields require using the Aggregation Framework via Spring Data's template methods, such as `template.query` and `template.update`, often involving `$expr` or `$setField` operations.

```java
public class Item {

	@Field(name = "cat.id", fieldNameType = KEY)
	String categoryId;

	// ...
}
```

```json
{
    'cat.id' : "5b28b5e7-52c2",
    ...
}
```

```java
template.query(Item.class)
    // $expr : { $eq : [ { $getField : { input : '$$CURRENT', 'cat.id' }, '5b28b5e7-52c2' ] }
    .matching(expr(ComparisonOperators.valueOf(ObjectOperators.getValueOf("value")).equalToValue("5b28b5e7-52c2")))
    .all();
```

```java
template.update(Item.class)
    .matching(where("id").is("r2d2"))
    // $replaceWith: { $setField : { input: '$$CURRENT', field : 'cat.id', value : 'af29-f87f4e933f97' } }
    .apply(AggregationUpdate.newUpdate(ReplaceWithOperation.replaceWithValue(ObjectOperators.setValueTo("value", "af29-f87f4e933f97"))))
    .first();
```

--------------------------------

### Custom MongoDB ID Mapping with @MongoId

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Demonstrates how to use the @MongoId annotation to control how String and ObjectId values are mapped to MongoDB document IDs. It covers treating IDs as plain Strings, plain ObjectIds, or converting Strings to ObjectIds.

```java
public class PlainStringId {
  @MongoId String id; 
}

public class PlainObjectId {
  @MongoId ObjectId id;
}

public class StringToObjectId {
  @MongoId(FieldType.OBJECT_ID) String id;
}
```

--------------------------------

### Spring Data MongoDB: Query Documents by JSON Schema

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Illustrates how to query a MongoDB collection for documents that conform to a specified JSON schema using Spring Data MongoDB's `MongoJsonSchema` builder. This allows filtering documents based on their structural properties.

```Java
MongoJsonSchema schema = MongoJsonSchema.builder().required("firstname", "lastname").build();

template.find(query(matchingDocumentStructure(schema)), Person.class);
```

--------------------------------

### Define Java Class with Dot Notation Field

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping.adoc

Defines a Java class `Item` with a `categoryId` property mapped to a MongoDB field named `cat.id` using `@Field` annotation. This demonstrates how to represent fields with dots in their names, which require special handling in MongoDB.

```java
public class Item {

	@Field(name = "cat.id", fieldNameType = KEY)
	String categoryId;

	// ...
}
```

--------------------------------

### Java DocumentReference Operations and Storage

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/document-references.adoc

Demonstrates operations with @DocumentReference, including persisting referenced entities individually and updating the referencing entity. The JSON output shows references stored as an array of _id values.

```java
Account account = …;

template.insert(account);                               <2>

template.update(Person.class)
  .matching(where("id").is(…))
  .apply(new Update().push("accounts").value(account)) <3>
  .first();
```

```json
{
  "_id" : …,
  "accounts" : [ "6509b9e" … ]                        <4>
}
```

--------------------------------

### Custom EvaluationContextExtension for KeyId

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-schema.adoc

Provides a custom `EvaluationContextExtension` to define functions for SpEL expressions, enabling flexible computation of key IDs based on target element names.

```java
public class EncryptionExtension implements EvaluationContextExtension {

    @Override
    public String getExtensionId() {
        return "mongocrypt";
    }

    @Override
    public Map<String, Function> getFunctions() {
        return Collections.singletonMap("keyId", new Function(getMethod("computeKeyId", String.class), this));
    }

    public String computeKeyId(String target) {
        // ... lookup via target element name
        return "computed_key_id";
    }
}
```

--------------------------------

### Query MongoDB Fields with Dot Notation using Aggregation

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping.adoc

Demonstrates how to query fields containing dots in their names using Spring Data MongoDB's `template.query` and the Aggregation Framework. It leverages `$expr` and `$getField` operators, as direct targeting of dot-notation fields is not possible. The mapping layer automatically translates the property name `value` into the actual field name `cat.id`.

```java
template.query(Item.class)
    // $expr : { $eq : [ { $getField : { input : '$$CURRENT', 'cat.id' }, '5b28b5e7-52c2' ] }
    .matching(expr(ComparisonOperators.valueOf(ObjectOperators.getValueOf("value")).equalToValue("5b28b5e7-52c2")))
    .all();
```

--------------------------------

### JSON Schema Types Supported

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-schema.adoc

Lists the supported JSON schema types in Spring Data MongoDB, mapping them to Java types and detailing their corresponding schema properties.

```APIDOC
JSON Schema Types Supported:

| Schema Type
| Java Type
| Schema Properties

| untyped
| -
| description, generated description, enum, allOf, anyOf, oneOf, not

| object
| Object
| required, additionalProperties, properties, minProperties, maxProperties, patternProperties

| array
| any array except byte[]
| uniqueItems, additionalItems, items, minItems, maxItems

| string
| String
| minLength, maxLength, pattern

| int
| int, Integer
| multipleOf, minimum, exclusiveMinimum, maximum, exclusiveMaximum

| long
| long, Long
| multipleOf, minimum, exclusiveMinimum, maximum, exclusiveMaximum

| double
| float, Float, double, Double
| multipleOf, minimum, exclusiveMinimum, maximum, exclusiveMaximum

| decimal
| BigDecimal
| multipleOf, minimum, exclusiveMinimum, maximum, exclusiveMaximum

| number
| Number
| multipleOf, minimum, exclusiveMinimum, maximum, exclusiveMaximum

| binData
| byte[]
| (none)

| boolean
| boolean, Boolean
| (none)

| null
| null
| (none)

| objectId
| ObjectId
| (none)

| date
| java.util.Date
| (none)

| timestamp
| BsonTimestamp
| (none)

| regex
| java.util.regex.Pattern
| (none)

NOTE: `untyped` is a generic type that is inherited by all typed schema types. It provides all `untyped` schema properties to typed schema types.
```

--------------------------------

### MongoDB Query: Match Ending String (Case-Sensitive)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Demonstrates a MongoDB query using the `$regex` operator to find documents where the 'firstname' field ends with 'firstname' in a case-sensitive manner.

```JSON
{"firstname" : { $regex: /firstname$/}}
```

--------------------------------

### Declarative PropertyValueConverter Annotation

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/property-converters.adoc

Shows how to apply a PropertyValueConverter declaratively to a specific property within an entity class using the @ValueConverter annotation.

```java
class Person {

  @ValueConverter(ReversingValueConverter.class)
  String ssn;
}
```

--------------------------------

### Specify Additional Types for Schema Properties

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-schema.adoc

Illustrates how to use `MongoJsonSchemaCreator.property().withTypes()` to define multiple possible types for a property, merging their schemas into a single definition.

```java
class Root {
	Object value;
}

class A {
	String aValue;
}

class B {
	String bValue;
}

MongoJsonSchemaCreator.create()
    .property("value").withTypes(A.class, B.class)
```

```json
{
    'type' : 'object',
    'properties' : {
        'value' : {
            'type' : 'object',
            'properties' : {
                'aValue' : { 'type' : 'string' },
                'bValue' : { 'type' : 'string' }
            }
        }
    }
}
```

--------------------------------

### Spring Data MongoDB: Annotated Vector Search by Country

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/partials/vector-search-method-annotated-include.adoc

Demonstrates using the @VectorSearch annotation to perform a vector search filtered by a country code. It specifies the index name, a filter condition, the number of candidates to consider, and a limit for the results. The method returns a SearchResults object containing matching comments.

```java
interface CommentRepository extends Repository<Comment, String> {

  @VectorSearch(indexName = "cos-index", filter = "{country: ?0}", limit="100", numCandidates="2000")
  SearchResults<Comment> searchAnnotatedByCountryAndEmbeddingWithin(String country, Vector embedding, Score distance);
}
```

--------------------------------

### MongoDB $vectorSearch Aggregation Stage

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/partials/vector-search-method-derived-include.adoc

The $vectorSearch aggregation stage in MongoDB performs vector similarity searches. It requires an index that supports vector search and allows specifying the index name, the search vector, and parameters like numCandidates to control the search process. It can be used to find documents whose vector embeddings are similar to a query vector.

```APIDOC
$vectorSearch
  index: <string> (required) - The name of the vector index to use for the search.
  path: <string> (required) - The path to the vector field in the documents.
  queryVector: <array> (required) - The vector to search for.
  numCandidates: <integer> (required) - The number of nearest neighbors to return. Must be greater than 0.
  limit: <integer> (optional) - The maximum number of documents to return.
  filter: <document> (optional) - A query document to filter the results before performing the vector search.
  options: {
    similarity: <string> (optional) - The similarity metric to use (e.g., 'cosine', 'euclidean', 'dotProduct'). Defaults to 'euclidean'.
    randomSeed: <integer> (optional) - A seed for reproducible random sampling.
  }

Example:
{
  '$vectorSearch': {
    'index': 'myVectorIndex',
    'path': 'embedding',
    'queryVector': [0.1, 0.2, 0.3],
    'numCandidates': 100,
    'limit': 10,
    'filter': { 'country': 'USA' }
  }
}
```

--------------------------------

### Create Collection with JSON Schema (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-schema.adoc

Shows how to create a MongoDB collection with an associated JSON schema using Spring Data MongoDB. This ensures that all documents inserted into the collection adhere to the defined schema.

```java
MongoJsonSchema schema = MongoJsonSchema.builder().required("firstname", "lastname").build();

template.createCollection(Person.class, CollectionOptions.empty().schema(schema));
```

--------------------------------

### JSON Query with Field Restriction

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Extends JSON-based queries by allowing specific fields to be included or excluded from the result set using the 'fields' property within the @Query annotation. This optimizes data retrieval by mapping only the required properties into the Java object.

```java
public interface PersonRepository extends MongoRepository<Person, String> {

    @Query(value="{ 'firstname' : ?0 }", fields="{ 'firstname' : 1, 'lastname' : 1}")
    List<Person> findByThePersonsFirstname(String firstname);

}
```

```java
public interface PersonRepository extends ReactiveMongoRepository<Person, String> {

    @Query(value="{ 'firstname' : ?0 }", fields="{ 'firstname' : 1, 'lastname' : 1}")
    Flux<Person> findByThePersonsFirstname(String firstname);

}
```

--------------------------------

### MongoDB Query: Match Containing String (Case-Insensitive)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Demonstrates a MongoDB query using the `$regex` operator with `$options: 'i'` to find documents where the 'firstname' field contains 'firstname' anywhere within the string in a case-insensitive manner.

```JSON
{"firstname" : { $regex: /.*firstname.*/, $options: 'i'}}
```

--------------------------------

### GeoSpatial Query: Find Venues within Circle (Spherical)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Finds venues located within a specified circular area using spherical coordinates with the `withinSphere` criteria method.

```java
Circle circle = new Circle(-73.99171, 40.738868, 0.003712240453784);
List<Venue> venues =
    template.find(new Query(Criteria.where("location").withinSphere(circle)), Venue.class);
```

--------------------------------

### Handling Special Field Names with Dots

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping.adoc

Explains MongoDB's dot notation for nested structures and how Spring Data MongoDB handles field names containing dots. Covers `MappingMongoConverter#setMapKeyDotReplacement` for older MongoDB versions and `preserveMapKeys` for MongoDB 5.0+, along with `@Field` usage for path-like or literal dot names.

```APIDOC
Special Field Names and Dot Handling:

MongoDB uses the dot (`.`) character as a path separator for nested documents or arrays (e.g., `a.b.c` targets `{ 'a' : { 'b' : { 'c' : … } } }`).

Limitations (pre-MongoDB 5.0): Field names must not contain dots.

* `MappingMongoConverter#setMapKeyDotReplacement(String replacement)`: Substitutes dots on write with a specified character to circumvent limitations when storing `Map` structures. Example: `converter.setMapKeyDotReplacement("-");` for `Map.of("key.with.dot", "value")` results in `map : { 'key-with-dot', 'value' }`.

MongoDB 5.0+ Lifting Restrictions: Field names can contain special characters, including dots.

* `MappingMongoConverter.setPreserveMapKeys(boolean preserveMapKeys)`: Set to `true` to allow dots in `Map` keys.

Customizing Field Names with `@Field`:

1. `@Field(name = "a.b")`: The name is treated as a path. Operations expect a structure of nested objects like `{ a : { b : … } }`.

2. `@Field(name = "a.b", fieldNameType = KEY)`: The name is treated as a literal field name. Operations expect a field with the given value like `{ 'a.b' : ….. }`.

Recommendation: Refer to the MongoDB documentation for detailed considerations on using dots and dollar signs in field names.
```

--------------------------------

### MongoDB Query: Match Containing String (Case-Sensitive)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Demonstrates a MongoDB query using the `$regex` operator to find documents where the 'firstname' field contains 'firstname' anywhere within the string in a case-sensitive manner.

```JSON
{"firstname" : { $regex: /.*firstname.*/}}
```

--------------------------------

### JavaScript Map Function

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-mapreduce.adoc

A JavaScript function that iterates over an array ('x') in a MongoDB document and emits each element with a count of 1.

```javascript
function () {
    for (var i = 0; i < this.x.length; i++) {
        emit(this.x[i], 1);
    }
}
```

--------------------------------

### GeoSpatial Query: Find Venues within Circle

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Finds venues located within a specified circular area using the `within` criteria method.

```java
Circle circle = new Circle(-73.99171, 40.738868, 0.01);
List<Venue> venues =
    template.find(new Query(Criteria.where("location").within(circle)), Venue.class);
```

--------------------------------

### Generate JSON Schema from Java Domain Type

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-schema.adoc

Demonstrates creating a JSON schema for a Java class like 'Person' using Spring Data MongoDB's `MongoJsonSchemaCreator`. It shows how to generate the schema and apply it when creating a MongoDB collection.

```java
public class Person {

    private final String firstname;
    private final int age;
    private Species species;
    private Address address;
    private @Field(fieldType=SCRIPT) String theForce;
    private @Transient Boolean useTheForce;

    public Person(String firstname, int age) {

        this.firstname = firstname;
        this.age = age;
    }

    // gettter / setter omitted
}

MongoJsonSchema schema = MongoJsonSchemaCreator.create(mongoOperations.getConverter())
    .createSchemaFor(Person.class);

template.createCollection(Person.class, CollectionOptions.empty().schema(schema));
```

```json
{
    'type' : 'object',
    'required' : ['age'],
    'properties' : {
        'firstname' : { 'type' : 'string' },
        'age' : { 'bsonType' : 'int' }
        'species' : {
            'type' : 'string',
            'enum' : ['HUMAN', 'WOOKIE', 'UNKNOWN']
        }
        'address' : {
            'type' : 'object'
            'properties' : {
                'postCode' : { 'type': 'string' }
            }
        },
        'theForce' : { 'type' : 'javascript'}
     }
}
```

--------------------------------

### Explicit Target Type Mapping with @Field

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/custom-conversions.adoc

Demonstrates how to explicitly map Java types to MongoDB field types using the `@Field` annotation, such as mapping `BigDecimal` to `STRING` to avoid `Decimal128` representation.

```java
public class Payment {

  @Id String id; 

  @Field(targetType = FieldType.STRING) 
  BigDecimal value;

  Date date;

}
```

```json
{
  "_id"   : ObjectId("5ca4a34fa264a01503b36af8"), 
  "value" : "2.099",                              
  "date"  : ISODate("2019-04-03T12:11:01.870Z")   
}
```

--------------------------------

### Index Annotation on Unwrapped Object Properties

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/unwrapping-entities.adoc

Illustrates the correct usage of the `@Indexed` annotation on properties of an unwrapped type, and highlights an invalid combination with `@Unwrapped`.

```java
public class User {

	@Id
    private String userId;

    @Unwrapped(onEmpty = USE_NULL)
    UserName name;

    // Invalid -> InvalidDataAccessApiUsageException
    @Indexed
    @Unwrapped(onEmpty = USE_Empty)
    Address address;
}

public class UserName {

    private String firstname;

    @Indexed
    private String lastname;
}
```

--------------------------------

### MongoDB Sort By Count Operation

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

Explains and demonstrates the `$sortByCount` aggregation operator in Spring Data MongoDB. This operator groups documents by a specified expression and sorts them by the count of documents in each group.

```java
// generates { $sortByCount: "$country" }
sortByCount("country");
```

--------------------------------

### Update Entire Unwrapped Object

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/unwrapping-entities.adoc

Shows how to replace an entire unwrapped object with new values using Spring Data MongoDB's `Update` class and its corresponding MongoDB JSON update operation.

```java
Update update = new Update().set("name", new Name("Janet", "van Dyne"));
template.update(User.class).matching(where("id").is("Wasp"))
   .apply(update).first()
```

```json
db.collection.update({
  "_id" : "Wasp"
},
{
  "$set" {
    "firstname" : "Janet",
    "lastname" : "van Dyne",
  }
},
{ ... }
)
```

--------------------------------

### Flattening Objects with @Unwrapped and @Field

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/unwrapping-entities.adoc

Shows how to combine the @Unwrapped annotation with a prefix and the @Field annotation on properties within the unwrapped object. This allows for custom naming of flattened fields, resulting from the concatenation of the prefix and the @Field name.

```java
public class User {

	@Id
    private String userId;

    @Unwrapped.Nullable(prefix = "u-") <1>
    UserName name;
}

public class UserName {

	@Field("first-name")              <2>
    private String firstname;

	@Field("last-name")
    private String lastname;
}
```

```json
{
  "_id" : "2647f7b9-89da",
  "u-first-name" : "Barbara",         <2>
  "u-last-name" : "Gordon"
}
```

--------------------------------

### MongoDB Transaction Configuration Options

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/client-session-transactions.adoc

Configuration properties for managing MongoDB transactions within Spring Data. These settings control aspects like commit time, read concern, read preference, and write concern for transactional operations.

```APIDOC
mongo:maxCommitTime=PT1S
  - Sets the maximum commit time for a transaction using ISO-8601 duration format.

mongo:readConcern=LOCAL|MAJORITY|LINEARIZABLE|SNAPSHOT|AVAILABLE
  - Sets the read concern level for the transaction.

mongo:readPreference=PRIMARY|SECONDARY|SECONDARY_PREFERRED|PRIMARY_PREFERRED|NEAREST
  - Sets the read preference for the transaction.

mongo:writeConcern=ACKNOWLEDGED|W1|W2|W3|UNACKNOWLEDGED|JOURNALED|MAJORITY
  - Sets the write concern level for the transaction.
```

--------------------------------

### Using Sort in Repository Search Methods

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/partials/vector-search.adoc

Demonstrates how to override default score-based sorting in Spring Data MongoDB repository search methods by using the `Sort` parameter. Custom sorting does not allow the score to be used as a sorting criteria; it only allows domain properties.

```java
interface CommentRepository extends Repository<Comment, String> {

  SearchResults<Comment> searchByEmbeddingNearOrderByCountry(Vector vector, Score score);

  SearchResults<Comment> searchByEmbeddingWithin(Vector vector, Score score, Sort sort);
}
```

--------------------------------

### Spring Data MongoDB: Indexing Unwrapped Object Properties

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/unwrapping-entities.adoc

Explains how to apply the `@Indexed` annotation to properties within an unwrapped type in Spring Data MongoDB. It also highlights an invalid usage where `@Indexed` is combined with `@Unwrapped` on the same owning property.

```java
public class User {

	@Id
    private String userId;

    @Unwrapped(onEmpty = USE_NULL)
    UserName name;

    // Invalid -> InvalidDataAccessApiUsageException
    @Indexed
    @Unwrapped(onEmpty = USE_Empty)
    Address address;
}

public class UserName {

    private String firstname;

    @Indexed
    private String lastname;
}
```

--------------------------------

### ValueObject POJO for Map-Reduce Results

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-mapreduce.adoc

A Plain Old Java Object (POJO) designed to hold the results of a Map-Reduce operation, mapping MongoDB document fields '_id' and 'value' to Java properties.

```java
public class ValueObject {

  private String id;
  private float value;

  public String getId() {
    return id;
  }

  public float getValue() {
    return value;
  }

  public void setValue(float value) {
    this.value = value;
  }

  @Override
  public String toString() {
    return "ValueObject [id=" + id + ", value=" + value + "]";
  }
}
```

--------------------------------

### Raw MongoDB Group Operation Result (JSON)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-group.adoc

Illustrates the raw JSON output returned by a MongoDB group operation. This structure includes the 'retval' array containing the aggregated results, a total count of processed documents, the number of unique keys, and an 'ok' status field.

```json
{
  "retval" : [ { "x" : 1.0 , "count" : 2.0} ,
               { "x" : 2.0 , "count" : 1.0} ,
               { "x" : 3.0 , "count" : 3.0} ] ,
  "count" : 6.0 ,
  "keys" : 3 ,
  "ok" : 1.0
}

```

--------------------------------

### GeoSpatial Query: Find Venues within Box

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-query-operations.adoc

Finds venues located within a specified rectangular area (Box) using the `within` criteria method.

```java
//lower-left then upper-right
Box box = new Box(new Point(-73.99756, 40.73083), new Point(-73.988135, 40.741404));
List<Venue> venues =
    template.find(new Query(Criteria.where("location").within(box)), Venue.class);
```

--------------------------------

### Customize MongoDB Field Names with Dots using @Field

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping.adoc

Describes two distinct ways to use the @Field annotation to handle field names containing dots: either interpreting the dot as a path separator for nested objects or treating the entire string as a literal field name.

```APIDOC
@Field(name = "a.b"):
  Interpretation: The name is considered to be a path.
  Expected Structure: Operations expect a structure of nested objects such as { a : { b : … } }.

@Field(name = "a.b", fieldNameType = KEY):
  Interpretation: The name is considered a name as-is.
  Expected Structure: Operations expect a field with the given value as { 'a.b' : ….. }.
```

--------------------------------

### Spring Data MongoDB Geo-spatial Queries

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

This section covers geo-spatial query capabilities in Spring Data MongoDB, focusing on the `Near` and `Within` keywords. It demonstrates how to perform queries based on proximity and geographical boundaries using various shapes like Points, Circles, Boxes, and Polygons.

```APIDOC
Geo-spatial Queries:

`Near` Queries:
  `findByLocationNear(Point location)`
  - Description: Finds documents where the 'location' field is near the specified point.
  - Projection: `{"location" : {"$near" : [x,y]}}`

  `findByLocationNear(Point point, Distance max)`
  - Description: Finds documents where the 'location' field is near the specified point and within a maximum distance.
  - Projection: `{"location" : {"$near" : [point.x, point.y], "$maxDistance" : max}}`

  `findByLocationNear(Point point, Distance min, Distance max)`
  - Description: Finds documents where the 'location' field is near the specified point, within a minimum and maximum distance.
  - Projection: `{"location" : {"$near" : [point.x, point.y], "$minDistance" : min, "$maxDistance" : max}}`

  NOTE: If the `Distance` parameter uses `Metrics`, the query uses `$nearSphere` instead of `$near`.

`Within` Queries:
  `findByLocationWithin(Circle circle)`
  - Description: Finds documents where the 'location' field is geographically within the specified circle.
  - Projection: `{"location" : {"$geoWithin" : {"$center" : [ [x, y], distance]}}}`

  `findByLocationWithin(Box box)`
  - Description: Finds documents where the 'location' field is geographically within the specified rectangular box.
  - Projection: `{"location" : {"$geoWithin" : {"$box" : [ [x1, y1], x2, y2]}}}`

  `findByLocationWithin(Polygon polygon)`
  - Description: Finds documents where the 'location' field is geographically within the specified polygon.
  - Projection: `{"location" : {"$geoWithin" : {"$polygon" : [ [ polygon.x1, polygon.y1 ], [ polygon.x2, polygon.y2 ], ... ] }}}`

  `findByLocationWithin(GeoJsonPolygon polygon)`
  - Description: Finds documents where the 'location' field is geographically within the specified GeoJSON polygon.
  - Projection: `{"location" : {"$geoWithin" : {"$geometry" : { "$type" : 'polygon', "coordinates": [[ polygon.x1, polygon.y1 ], [ polygon.x2, polygon.y2 ], ... ] }}}}`
```

--------------------------------

### Flattening Objects with @Unwrapped

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/unwrapping-entities.adoc

Demonstrates how to use the @Unwrapped annotation to flatten properties of a nested object (UserName) into the parent document (User). It shows the Java domain model and the resulting flattened JSON structure.

```java
class User {

    @Id
    String userId;

    @Unwrapped(onEmpty = USE_NULL) <1>
    UserName name;
}

class UserName {

    String firstname;

    String lastname;

}
```

```json
{
  "_id" : "1da2ba06-3ba7",
  "firstname" : "Emma",
  "lastname" : "Frost"
}
```

--------------------------------

### XObject POJO for Group Operation Results

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-group.adoc

Defines the `XObject` class, which is used to map the 'retval' field from the MongoDB group operation's JSON output. This POJO structure corresponds to the aggregated data, typically containing the grouping key and calculated aggregate values.

```java
public class XObject {

  private float x;

  private float count;


  public float getX() {
    return x;
  }

  public void setX(float x) {
    this.x = x;
  }

  public float getCount() {
    return count;
  }

  public void setCount(float count) {
    this.count = count;
  }

  @Override
  public String toString() {
    return "XObject [x=" + x + " count = " + count + "]";
  }
}

```

--------------------------------

### Define Custom Property Validation (Java)

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-schema.adoc

Illustrates how to define custom validation rules for specific properties using Spring Data MongoDB's schema utilities. This includes specifying data types and adding descriptive messages.

```java
// "birthdate" : { "bsonType": "date" }
JsonSchemaProperty.named("birthdate").ofType(Type.dateType());

// "birthdate" : { "bsonType": "date", "description", "Must be a date" }
JsonSchemaProperty.named("birthdate").with(JsonSchemaObject.of(Type.dateType()).description("Must be a date"));
```

--------------------------------

### Upsert Operation

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/template-crud-operations.adoc

Performs an upsert operation, which inserts a document if no document matches the query. The inserted document is a combination of the query and update documents. Note that upsert does not support ordering; use findAndModify for sorting.

```APIDOC
template.update(Person.class)
  .matching(query(where("ssn").is(1111).and("firstName").is("Joe").and("Fraizer").is("Update"))
  .apply(update("address", addr))
  .upsert();

// Reactive version:
Mono<UpdateResult> result = template.update(Person.class)
  .matching(query(where("ssn").is(1111).and("firstName").is("Joe").and("Fraizer").is("Update"))
  .apply(update("address", addr))
  .upsert();

// Related: findAndModify for ordering with upsert-like behavior.
// @Version properties are automatically initialized if not included in the Update.
```

--------------------------------

### Comment Entity Definition

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/partials/vector-search-model-include.adoc

This Java class represents a comment document stored in MongoDB. It includes fields for a unique identifier, the country associated with the comment, the comment text itself, and a vector embedding for potential semantic search or analysis. The '@Id' annotation marks the 'id' field as the primary identifier.

```java
class Comment {

  @Id String id;
  String country;
  String comment;

  Vector embedding;

  // getters, setters, …
}
```

--------------------------------

### JavaScript Reduce Function

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-mapreduce.adoc

A JavaScript function that sums the values emitted by the map function for each key, calculating the total occurrence of each element.

```javascript
function (key, values) {
    var sum = 0;
    for (var i = 0; i < values.length; i++)
        sum += values[i];
    return sum;
}
```

--------------------------------

### Count Operation within Transactions

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/client-session-transactions.adoc

Demonstrates how Spring Data MongoDB handles count operations inside transactions by converting them to aggregation queries. This ensures consistency as direct count operations might not reflect the transaction's state accurately.

```javascript
session.startTransaction();

template.withSession(session)
    .execute(ops -> {
        return ops.count(query(where("state").is("active")), Step.class)
        });
```

```javascript
db.collection.aggregate(
   [
      { $match: { state: "active" } },
      { $count: "totalEntityCount" }
   ]
)
```

```javascript
db.collection.find( { state: "active" } ).count()
```

--------------------------------

### Annotate Document Fields for Encryption

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-schema.adoc

Demonstrates using the @Encrypted annotation on a Spring Data MongoDB document class to encrypt individual fields. Shows default settings and overriding the algorithm.

```java
@Document
@Encrypted(keyId = "xKVup8B1Q+CkHaVRx+qa+g==", algorithm = "AEAD_AES_256_CBC_HMAC_SHA_512-Random")
static class Patient {

    @Id String id;
    String name;

    @Encrypted
    String bloodType;

    @Encrypted(algorithm = "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic")
    Integer ssn;
}
```

--------------------------------

### Merge Multiple Schemas into a Single Definition

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-schema.adoc

Shows how to merge schemas from different classes, including those with inheritance, into a single schema definition using `MongoJsonSchemaCreator.mergedSchemaFor()`.

```java
abstract class Root {
	String rootValue;
}

class A extends Root {
	String aValue;
}

class B extends Root {
	String bValue;
}

MongoJsonSchemaCreator.mergedSchemaFor(A.class, B.class)
```

```json
{
    'type' : 'object',
       'properties' : {
           'rootValue' : { 'type' : 'string' },
           'aValue' : { 'type' : 'string' },
           'bValue' : { 'type' : 'string' }
       }
    }
}
```

--------------------------------

### SpEL Expression for Encrypted Field KeyId

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping-schema.adoc

Illustrates using SpEL expressions within the @Encrypted annotation to dynamically resolve key IDs, requiring additional environment metadata and a custom EvaluationContextExtension.

```java
@Document
@Encrypted(keyId = "#{mongocrypt.keyId(#target)}")
static class Patient {

    @Id String id;
    String name;

    @Encrypted(algorithm = "AEAD_AES_256_CBC_HMAC_SHA_512-Random")
    String bloodType;

    @Encrypted(algorithm = "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic")
    Integer ssn;
}

MongoJsonSchemaCreator schemaCreator = MongoJsonSchemaCreator.create(mappingContext);
MongoJsonSchema patientSchema = schemaCreator
    .filter(MongoJsonSchemaCreator.encryptedOnly())
    .createSchemaFor(Patient.class);
```

--------------------------------

### Annotate Entity for Sharding

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/sharding.adoc

Use the `@Sharded` annotation on a Spring Data MongoDB entity to mark it for storage in sharded collections. The `shardKey` attribute specifies the fields that constitute the shard key, which can be a single field or a composite of multiple fields.

```java
@Document("users")
@Sharded(shardKey = { "country", "userId" }) 
public class User {

	@Id
	Long id;

	@Field("userid")
	String userId;

	String country;
}
```

--------------------------------

### Update MongoDB Fields with Dot Notation using Aggregation

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/mapping.adoc

Illustrates how to update fields containing dots in their names using Spring Data MongoDB's `template.update` and the Aggregation Framework. It utilizes `$replaceWith` and `$setField` operators to modify the field value, as direct updates are not supported for dot-notation fields. The mapping layer automatically translates the property name `value` into the actual field name `cat.id`.

```java
template.update(Item.class)
    .matching(where("id").is("r2d2"))
    // $replaceWith: { $setField : { input: '$$CURRENT', field : 'cat.id', value : 'af29-f87f4e933f97' } }
    .apply(AggregationUpdate.newUpdate(ReplaceWithOperation.replaceWithValue(ObjectOperators.setValueTo("value", "af29-f87f4e933f97"))))
    .first();
```

--------------------------------

### MongoDB Encrypted Collection Schema Configuration

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mongo-encryption.adoc

This JSON object defines the schema configuration for encrypted fields within a MongoDB collection. It specifies details such as the collection name, encrypted fields, key IDs, paths, BSON types, and queryability options including query type and contention factors for indexed fields.

```json
{
    "name": "patient",
    "type": "collection",
    "options": {
      "encryptedFields": {
        "escCollection": "enxcol_.test.esc",
        "ecocCollection": "enxcol_.test.ecoc",
        "fields": [
          {
            "keyId": "...",
            "path": "ssn",
            "bsonType": "string",
            "queries": [ { "queryType": "equality", "contention": Long('0') } ]
          },
          {
            "keyId": "...",
            "path": "age",
            "bsonType": "int",
            "queries": [ { "queryType": "range", "contention": Long('8'), "min": 0, "max": 150 } ]
          },
          {
            "keyId": "...",
            "path": "pin",
            "bsonType": "string"
          },
          {
            "keyId": "...",
            "path": "address.sign",
            "bsonType": "long",
            "queries": [ { "queryType": "range", "contention": Long('2'), "min": Long('-10'), "max": Long('10') } ]
          }
        ]
      }
    }
}
```

--------------------------------

### Spring Data MongoDB: Sum Aggregation to Primitive Type

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/repositories/query-methods.adoc

Extracts a single accumulation result (like `$sum`) directly from the aggregation's result `Document` into a primitive `Long` type for convenience.

```java
@Aggregation("{ $group : { _id : null, total : { $sum : $age } } }")
  Long sumAge();
```

--------------------------------

### Spring Data MongoDB Aggregation: Exclude Field with Conditional Projection

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

Demonstrates how to conditionally exclude a field (`author.middle`) from a projection in Spring Data MongoDB aggregation using the `$$REMOVE` aggregation variable. If the field's value is empty, it is removed from the output document; otherwise, its value is retained.

```Java
TypedAggregation<Book> agg = Aggregation.newAggregation(Book.class,
  project("title")
    .and(ConditionalOperators.when(ComparisonOperators.valueOf("author.middle")
        .equalToValue(""))
        .then("$$REMOVE")
        .otherwiseValueOf("author.middle")
    )
	.as("author.middle"));
```

--------------------------------

### Java Entity Type Alias

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/converters-type-mapping.adoc

Illustrates using the `@TypeAlias` annotation to specify a custom, shorter alias for a class instead of its fully qualified name. The resulting document uses this alias in the `_class` field.

```Java
@TypeAlias("pers")
class Person {

}
```

--------------------------------

### Excluding Fields with Conditional Projection

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/aggregation-framework.adoc

Demonstrates how to conditionally exclude a field ('author.middle') from a MongoDB aggregation projection using `$$REMOVE`. This is useful when a field should only be included if it meets certain criteria.

```java
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.ConditionalOperators;
import org.springframework.data.mongodb.core.aggregation.ComparisonOperators;
import org.springframework.data.mongodb.core.aggregation.TypedAggregation;

// Assume 'Book' class and 'mongoTemplate' are defined
// Example of excluding a field conditionally
// TypedAggregation<Book> agg = Aggregation.newAggregation(Book.class,
//   project("title")
//     .and(ConditionalOperators.when(ComparisonOperators.valueOf("author.middle")
//         .equalToValue(""))
//         .then("$$REMOVE")
//         .otherwiseValueOf("author.middle")
//     )
// 	.as("author.middle"));
```

--------------------------------

### Update Single Field of Unwrapped Object

Source: https://github.com/spring-projects/spring-data-mongodb/blob/main/src/main/antora/modules/ROOT/pages/mongodb/mapping/unwrapping-entities.adoc

Demonstrates updating a single field within an unwrapped object using Spring Data MongoDB's `Update` class and its equivalent MongoDB JSON update operation.

```java
Update update = new Update().set("name.firstname", "Janet");
template.update(User.class).matching(where("id").is("Wasp"))
   .apply(update).first()
```

```json
db.collection.update({
  "_id" : "Wasp"
},
{
  "$set" { "firstname" : "Janet" }
},
{ ... }
)
```