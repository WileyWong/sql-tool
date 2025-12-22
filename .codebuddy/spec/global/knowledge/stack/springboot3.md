### Check Maven Installation

Source: https://docs.spring.io/spring-boot/tutorial/first-application/index

Confirms that Apache Maven is installed and shows its version and home directory. Maven is a build automation tool used for Java projects.

```shell
$ mvn -v
Apache Maven 3.9.11 (3e54c93a704957b63ee3494413a2b544fd3d825b)
Maven home: /Users/developer/.sdkman/candidates/maven/current
Java version: 17.0.16, vendor: BellSoft, runtime: /Users/developer/.sdkman/candidates/java/17.0.16-librca
```

--------------------------------

### Maven Project Setup (pom.xml)

Source: https://docs.spring.io/spring-boot/tutorial/first-application/index

Defines the basic structure for a Spring Boot project using Maven. It includes group ID, artifact ID, version, and specifies the Spring Boot starter parent for dependency management.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>

	<groupId>com.example</groupId>
	<artifactId>myproject</artifactId>
	<version>0.0.1-SNAPSHOT</version>

	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.5.7</version>
	</parent>

	<!-- Additional lines to be added here... -->

</project>
```

--------------------------------

### Spring Boot Web Controller Example (Java)

Source: https://docs.spring.io/spring-boot/tutorial/first-application/index

This Java code demonstrates a simple Spring Boot web controller. The @RestController annotation marks the class as a controller where every method returns a domain object instead of a view. The @RequestMapping annotation maps web requests to specific handler methods. This setup allows for handling incoming web requests and returning direct responses.

```java
@RestController
@RequestMapping("/")
public class MyApplication {

    @RequestMapping
    public String home() {
        return "Hello World!";
    }

}
```

--------------------------------

### Spring Boot Elasticsearch Test Setup

Source: https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications

Demonstrates the basic setup for integration testing Elasticsearch applications with Spring Boot using the @DataElasticsearchTest annotation. This annotation auto-configures ElasticsearchTemplate and scans for @Document classes.

```Java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.elasticsearch.DataElasticsearchTest;

@DataElasticsearchTest
class MyDataElasticsearchTests {

	@Autowired
	private SomeRepository repository;

	// ...

}
```

```Kotlin
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.data.elasticsearch.DataElasticsearchTest

@DataElasticsearchTest
class MyDataElasticsearchTests(@Autowired val repository: SomeRepository) {

	// ...

}
```

--------------------------------

### Configure Gradle Build File for Spring Boot

Source: https://docs.spring.io/spring-boot/tutorial/first-application/index

This snippet shows the basic configuration for a Gradle build file (build.gradle) for a Spring Boot project. It includes applying necessary plugins and setting up repositories. No external dependencies are declared in this initial setup.

```gradle
plugins {
	id 'java'
	id 'org.springframework.boot' version '3.5.7'
}

apply plugin: 'io.spring.dependency-management'

group = 'com.example'
version = '0.0.1-SNAPSHOT'

java {
	sourceCompatibility = '17'
}

repositories {
	mavenCentral()
}

dependencies {
}

```

--------------------------------

### Actuator Conditions Evaluation Report API

Source: https://docs.spring.io/spring-boot/specification/configuration-metadata/manual-hints

Exposes a report detailing the conditions that were evaluated when starting the application.

```APIDOC
## GET /actuator/conditions

### Description
Retrieves a report on the conditions evaluated during application startup.

### Method
GET

### Endpoint
/actuator/conditions

### Response
#### Success Response (200)
- **contexts** (object) - Contains condition evaluation details per context.
  - **applicationContext** (object)
    - **parent** (string) - Parent context name.
    - **beans** (object) - Beans and their associated condition evaluation results.
      - **beanId** (object)
        - **positive** (array) - List of conditions that were met.
        - **negative** (array) - List of conditions that were not met.
        - **error** (string) - Error message if condition evaluation failed.

#### Response Example
{
  "contexts": {
    "applicationContext": {
      "parent": null,
      "beans": {
        "dataSource": {
          "positive": [
            {
              "name": "DataSourceExists",
              "expression": "@ConditionalOnClass.exists('javax.sql.DataSource')"
            }
          ],
          "negative": [],
          "error": null
        }
      }
    }
  }
}
```

--------------------------------

### Logger Name Provider for Logging Levels and Keys

Source: https://docs.spring.io/spring-boot/specification/configuration-metadata/manual-hints

The 'logger-name' provider assists in autocompleting valid logger names and groups within a project. This example demonstrates its application for 'logging.level.keys' and 'logging.level.values', including predefined log levels and custom groups like 'root', 'sql', and 'web'. The 'group' parameter (defaulting to true) controls whether logger groups are considered.

```json
{
	"hints": [
		{
			"name": "logging.level.keys",
			"values": [
				{
					"value": "root",
					"description": "Root logger used to assign the default logging level."
				},
				{
					"value": "sql",
					"description": "SQL logging group including Hibernate SQL logger."
				},
				{
					"value": "web",
					"description": "Web logging group including codecs."
				}
			],
			"providers": [
				{
					"name": "logger-name"
				}
			]
		},
		{
			"name": "logging.level.values",
			"values": [
				{
					"value": "trace"
				},
				{
					"value": "debug"
				},
				{
					"value": "info"
				},
				{
					"value": "warn"
				},
				{
					"value": "error"
				},
				{
					"value": "fatal"
				},
				{
					"value": "off"
				}
			
			],
			"providers": [
				{
					"name": "any"
				}
			]
		}
	]
}
```

--------------------------------

### Customizing Spring Security User Credentials

Source: https://docs.spring.io/spring-boot/reference/web/spring-security

This example shows how to override the default username and password for Spring Security by setting the 'spring.security.user.name' and 'spring.security.user.password' properties in the application configuration.

```properties
spring.security.user.name=myUsername
spring.security.user.password=myPassword
```

--------------------------------

### Customizing Access Rules with SecurityFilterChain and EndpointRequest

Source: https://docs.spring.io/spring-boot/reference/web/spring-security

This example demonstrates how to override access rules for Actuator endpoints using Spring Boot's convenience methods. It involves creating a custom SecurityFilterChain and using EndpointRequest to match Actuator endpoints based on the management base path.

```java
import org.springframework.boot.actuate.autoconfigure.endpoint.web.EndpointRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class ActuatorSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.securityMatcher(EndpointRequest.toAnyEndpoint())
            .authorizeHttpRequests(requests -> requests.anyRequest().hasRole("ADMIN")); // Example: Only ADMIN role can access Actuator endpoints
        return http.build();
    }
}
```

--------------------------------

### Spring Boot Application Entry Point (Java)

Source: https://docs.spring.io/spring-boot/tutorial/first-application/index

This Java code defines the main method for a Spring Boot application. It uses SpringApplication.run() to bootstrap the application, specifying the primary Spring component class and passing command-line arguments. This is the standard entry point for most Spring Boot applications.

```java
public static void main(String[] args) {
  SpringApplication.run(MyApplication.class, args);
}
```

--------------------------------

### Actuator - Info (`info`)

Source: https://docs.spring.io/spring-boot/reference/using/structuring-your-code

Displays arbitrary application information. Can include build information, version, etc.

```APIDOC
## GET /actuator/info

### Description
Retrieves arbitrary application information, such as build information, version, and other custom details. This endpoint is customizable to provide relevant information about the application.

### Method
GET

### Endpoint
/actuator/info

### Parameters
N/A

### Request Example
N/A (GET request)

### Response
#### Success Response (200)
- **[customKey]** (any) - Custom key-value pairs defined in the `application.properties` or `application.yml` file under the `info.*` namespace.

#### Response Example
```json
{
  "app": {
    "name": "My Application",
    "version": "1.0.0"
  },
  "build": {
    "artifact": "my-app",
    "time": "2024-01-01T12:00:00.000Z"
  }
}
```
```

--------------------------------

### Actuator Info API

Source: https://docs.spring.io/spring-boot/specification/configuration-metadata/manual-hints

Exposes arbitrary application information.

```APIDOC
## GET /actuator/info

### Description
Retrieves general information about the application.

### Method
GET

### Endpoint
/actuator/info

### Response
#### Success Response (200)
- **build** (object) - Build information.
  - **version** (string) - Application version.
  - **time** (datetime) - Build time.
- **git** (object) - Git repository information.
  - **commit** (object)
    - **id** (string) - Git commit ID.
    - **time** (datetime) - Commit time.

#### Response Example
{
  "build": {
    "version": "1.0.0",
    "time": "2023-10-27T09:00:00Z"
  },
  "git": {
    "commit": {
      "id": "a1b2c3d4e5f6",
      "time": "2023-10-26T15:30:00Z"
    }
  }
}
```

--------------------------------

### Actuator Flyway API

Source: https://docs.spring.io/spring-boot/specification/configuration-metadata/manual-hints

Provides information about Flyway database migrations.

```APIDOC
## GET /actuator/flyway

### Description
Retrieves information about Flyway database migrations.

### Method
GET

### Endpoint
/actuator/flyway

### Response
#### Success Response (200)
- **flywayBeans** (object) - Details about each Flyway bean.
  - **beanName** (object)
    - **schemas** (array) - The schemas managed by Flyway.
    - **migrations** (array) - The list of applied migrations.
      - **version** (string) - The version of the migration.
      - **description** (string) - Description of the migration.
      - **type** (string) - Type of the migration (e.g., JDBC, SPRING).
      - **script** (string) - The script file name.
      - **checksum** (integer) - Checksum of the migration script.
      - **installedOn** (datetime) - Timestamp when the migration was installed.
      - **installedBy** (string) - User who installed the migration.
      - **executionTime** (integer) - Execution time in milliseconds.
      - **success** (boolean) - Whether the migration was successful.

#### Response Example
{
  "flywayBeans": {
    "defaultDatasourceFlyway": {
      "schemas": ["public"],
      "migrations": [
        {
          "version": "1",
          "description": "create_users_table",
          "type": "JDBC",
          "script": "V1__create_users_table.sql",
          "checksum": 1234567890,
          "installedOn": "2023-10-27T10:30:00Z",
          "installedBy": "app_user",
          "executionTime": 50,
          "success": true
        }
      ]
    }
  }
}
```

--------------------------------

### Spring Boot Actuator Info API

Source: https://docs.spring.io/spring-boot/upgrading

Exposes arbitrary application information.

```APIDOC
## GET /actuator/info

### Description
Returns custom information about the application, such as version, build details, or Git commit hash, as configured in `application.properties` or `application.yml`.

### Method
GET

### Endpoint
/actuator/info

### Parameters
N/A

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **(custom info object)** - A JSON object containing arbitrary application information.

#### Response Example
```json
{
  "example": "{\"app\": {\"version\": \"1.0.0\", \"name\": \"MyApplication\"}}"
}
```
```

--------------------------------

### Actuator - Metrics (`metrics`)

Source: https://docs.spring.io/spring-boot/reference/using/structuring-your-code

Shows metrics information for the current application. Provides insights into application performance and resource usage.

```APIDOC
## GET /actuator/metrics

### Description
Retrieves available metrics names for the application. This endpoint provides a list of available metrics that can be queried for more detailed information.

### Method
GET

### Endpoint
/actuator/metrics

### Parameters
N/A

### Request Example
N/A (GET request)

### Response
#### Success Response (200)
- **names** (array) - An array of metric names.

#### Response Example
```json
{
  "names": [
    "jvm.memory.max",
    "jvm.memory.used",
    "process.cpu.usage",
    "system.cpu.usage"
  ]
}
```

## GET /actuator/metrics/{requiredMetricName}

### Description
Retrieves detailed information about a specific metric.

### Method
GET

### Endpoint
/actuator/metrics/{requiredMetricName}

### Parameters
#### Path Parameters
- **requiredMetricName** (string) - Required - The name of the metric to retrieve.
#### Query Parameters
- **tag** (string) - Optional - Metrics tags to filter results.

### Request Example
N/A (GET request)

### Response
#### Success Response (200)
- **name** (string) - The name of the metric.
- **description** (string) - A description of the metric.
- **baseUnit** (string) - The base unit of the metric.
- **measurements** (array) - An array of measurement objects.
  - **statistic** (string) - The statistic type (e.g., COUNT, TOTAL, MAX).
  - **value** (number) - The value of the measurement.
- **availableTags** (array) - An array of tag objects.
  - **tag** (string) - The tag name (e.g., status, outcome).
  - **values** (array) - The possible tag values.
#### Response Example
```json
{
  "name": "jvm.memory.used",
  "description": "The amount of used memory",
  "baseUnit": "bytes",
  "measurements": [
    {
      "statistic": "VALUE",
      "value": 123456789
    }
  ],
  "availableTags": []
}
```
```

--------------------------------

### Spring Boot Actuator Configuration Properties API

Source: https://docs.spring.io/spring-boot/upgrading

Lists all available configuration properties and their descriptions.

```APIDOC
## GET /actuator/configprops

### Description
Exposes a hierarchical listing of all configuration properties, including their default values and descriptions.

### Method
GET

### Endpoint
/actuator/configprops

### Parameters
N/A

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- ** +#+** (object) - A nested object where keys are configuration property group names and values contain property details.
  - **properties** (object) - An object detailing individual configuration properties.
    - **defaultValue** (any) - The default value of the property.
    - **value** (any) - The current value of the property.
    - **description** (string) - Description of the property.

#### Response Example
```json
{
  "example": "{\"server.port\": {\"properties\": {\"defaultValue\": 8080, \"value\": 8080, \"description\": \"The port to run the application on.\"}}}"
}
```
```

--------------------------------

### Actuator Liquibase API

Source: https://docs.spring.io/spring-boot/specification/configuration-metadata/manual-hints

Provides information about Liquibase database migrations.

```APIDOC
## GET /actuator/liquibase

### Description
Retrieves information about Liquibase database migrations.

### Method
GET

### Endpoint
/actuator/liquibase

### Response
#### Success Response (200)
- **liquibaseBeans** (object) - Details about each Liquibase bean.
  - **beanName** (object)
    - **changeSets** (array) - The list of applied Liquibase change sets.
      - **id** (string) - The ID of the change set.
      - **author** (string) - The author of the change set.
      - **tag** (string) - The tag associated with the change set.
      - **lastRun** (datetime) - Timestamp when the change set was last run.
      - **md5sum** (string) - MD5 checksum of the change set.

#### Response Example
{
  "liquibaseBeans": {
    "defaultDatasourceLiquibase": {
      "changeSets": [
        {
          "id": "createUsersTable",
          "author": "admin",
          "tag": "v1.0",
          "lastRun": "2023-10-27T10:45:00Z",
          "md5sum": "a1b2c3d4e5f67890abcdef1234567890"
        }
      ]
    }
  }
}
```

--------------------------------

### Actuator - Flyway (`flyway`)

Source: https://docs.spring.io/spring-boot/reference/using/structuring-your-code

Shows Flyway database migrations. Useful for checking the status of database migrations.

```APIDOC
## GET /actuator/flyway

### Description
Retrieves information about Flyway database migrations. This endpoint allows you to check the status of database migrations and verify that they have been applied correctly.

### Method
GET

### Endpoint
/actuator/flyway

### Parameters
N/A

### Request Example
N/A (GET request)

### Response
#### Success Response (200)
- **contexts** (object) - An object containing information about the application contexts and their Flyway migrations.
  - **[contextId]** (object) - An object representing a specific application context.
    - **flywayBeans** (object) - An object containing the Flyway beans.
      - **[beanName]** (object) - An object representing a specific Flyway bean.
        - **migrations** (array) - An array of migration objects.
          - **version** (string) - The version of the migration.
          - **description** (string) - The description of the migration.
          - **script** (string) - The script used for the migration.
          - **type** (string) - The type of migration (e.g., SQL, Java).
          - **state** (string) - The state of the migration (e.g., Success, Pending).
          - **installedOn** (string) - The date and time the migration was installed.
          - **executionTime** (number) - The execution time of the migration in milliseconds.

#### Response Example
```json
{
  "contexts": {
    "application": {
      "flywayBeans": {
        "flyway": {
          "migrations": [
            {
              "version": "1",
              "description": "Create table",
              "script": "V1__Create_table.sql",
              "type": "SQL",
              "state": "Success",
              "installedOn": "2024-01-01T12:00:00.000Z",
              "executionTime": 123
            }
          ]
        }
      }
    }
  }
}
```
```

--------------------------------

### Actuator - Configuration Properties (`configprops`)

Source: https://docs.spring.io/spring-boot/reference/using/structuring-your-code

Displays all @ConfigurationProperties beans. It helps in understanding the available configuration options and their current values.

```APIDOC
## GET /actuator/configprops

### Description
Retrieves all `@ConfigurationProperties` beans and their properties. This endpoint is useful for understanding the available configuration options and their current values in a Spring Boot application.

### Method
GET

### Endpoint
/actuator/configprops

### Parameters
N/A

### Request Example
N/A (GET request)

### Response
#### Success Response (200)
- **contexts** (object) - An object containing information about the application contexts and their configuration properties.
  - **[contextId]** (object) - An object representing a specific application context.
    - **beans** (object) - An object containing the configuration properties beans.
      - **[beanName]** (object) - An object representing a specific configuration properties bean.
        - **prefix** (string) - The prefix used for the configuration properties.
        - **properties** (object) - An object containing the properties of the bean and their values.

#### Response Example
```json
{
  "contexts": {
    "application": {
      "beans": {
        "serverProperties": {
          "prefix": "server",
          "properties": {
            "port": 8080,
            "address": null
          }
        }
      }
    }
  }
}
```
```

--------------------------------

### Actuator Environment API

Source: https://docs.spring.io/spring-boot/specification/configuration-metadata/manual-hints

Exposes the current environment properties, including system properties, environment variables, and configuration properties.

```APIDOC
## GET /actuator/env

### Description
Retrieves the current application environment properties.

### Method
GET

### Endpoint
/actuator/env

### Response
#### Success Response (200)
- **propertySources** (array) - A list of property sources.
  - **name** (string) - The name of the property source.
  - **properties** (object) - A map of property names and their values.

#### Response Example
{
  "propertySources": [
    {
      "name": "systemProperties",
      "properties": {
        "java.version": "17.0.8",
        "os.name": "Linux"
      }
    },
    {
      "name": "applicationConfig: [classpath:/application.properties]",
      "properties": {
        "app.message": "Hello Spring Boot"
      }
    }
  ]
}
```

--------------------------------

### Actuator - Mappings (`mappings`)

Source: https://docs.spring.io/spring-boot/reference/using/structuring-your-code

Displays all request mappings. Provides insight into the application's endpoints and how they are mapped to handlers.

```APIDOC
## GET /actuator/mappings

### Description
Retrieves all request mappings in the application. This endpoint provides insight into the application's endpoints and how they are mapped to handlers.

### Method
GET

### Endpoint
/actuator/mappings

### Parameters
N/A

### Request Example
N/A (GET request)

### Response
#### Success Response (200)
- **contexts** (object) - An object containing information about the application contexts and their request mappings.
  - **[contextId]** (object) - An object representing a specific application context.
    - **mappings** (object) - An object containing the request mappings.
      - **[handlerName]** (array) - An array of mapping details for a specific handler.
        - **predicate** (string) - A description of the predicate (e.g., request method and path).
        - **handler** (string) - The name of the handler method.
        - **details** (object) - Additional details about the mapping.

#### Response Example
```json
{
  "contexts": {
    "application": {
      "mappings": {
        "public java.lang.String com.example.MyController.hello()": [
          {
            "predicate": "{[/hello],methods=[GET]}",
            "handler": "com.example.MyController.hello()",
            "details": {
              "requestMappingConditions": {
                "consumes": [],
                "produces": [],
                "methods": ["GET"],
                "params": [],
                "headers": [],
                "patterns": ["/hello"]
              }
            }
          }
        ]
      }
    }
  }
}
```
```

--------------------------------

### Actuator - Liquibase (`liquibase`)

Source: https://docs.spring.io/spring-boot/reference/using/structuring-your-code

Shows Liquibase database migrations. Useful for checking the status of database migrations.

```APIDOC
## GET /actuator/liquibase

### Description
Retrieves information about Liquibase database migrations. This endpoint allows you to check the status of database migrations and verify that they have been applied correctly.

### Method
GET

### Endpoint
/actuator/liquibase

### Parameters
N/A

### Request Example
N/A (GET request)

### Response
#### Success Response (200)
- **contexts** (object) - An object containing information about the application contexts and their Liquibase migrations.
  - **[contextId]** (object) - An object representing a specific application context.
    - **liquibaseBeans** (object) - An object containing the Liquibase beans.
      - **[beanName]** (object) - An object representing a specific Liquibase bean.
        - **changeSets** (array) - An array of change set objects.
          - **id** (string) - The ID of the change set.
          - **author** (string) - The author of the change set.
          - **description** (string) - The description of the change set.
          - **contexts** (string) - The contexts in which the change set is applied.
          - **labels** (string) - The labels associated with the change set.
          - **dateExecuted** (string) - The date and time the change set was executed.
          - **orderExecuted** (number) - The order in which the change set was executed.
          - **exectype** (string) - The execution type of the change set.
          - **comments** (string) - Comments associated with the change set.

#### Response Example
```json
{
  "contexts": {
    "application": {
      "liquibaseBeans": {
        "liquibase": {
          "changeSets": [
            {
              "id": "1",
              "author": "admin",
              "description": "Create table",
              "contexts": "",
              "labels": "",
              "dateExecuted": "2024-01-01T12:00:00.000Z",
              "orderExecuted": 1,
              "exectype": "EXECUTED",
              "comments": ""
            }
          ]
        }
      }
    }
  }
}
```
```

--------------------------------

### Actuator Metrics API

Source: https://docs.spring.io/spring-boot/specification/configuration-metadata/manual-hints

Exposes application metrics.

```APIDOC
## GET /actuator/metrics

### Description
Retrieves a list of available metrics in the application.

### Method
GET

### Endpoint
/actuator/metrics

### Response
#### Success Response (200)
- **names** (array) - List of available metric names.

#### Response Example
{
  "names": [
    "jvm.memory.used",
    "http.server.requests",
    "process.cpu.usage"
  ]
}

## GET /actuator/metrics/{required metric name}

### Description
Retrieves the value(s) of a specific metric.

### Method
GET

### Endpoint
/actuator/metrics/{required metric name}

### Parameters
#### Path Parameters
- **required metric name** (string) - Required - The name of the metric to retrieve.
#### Query Parameters
- **tag** (string) - Optional - Filter metrics by tags (e.g., tag=status:200).

### Response
#### Success Response (200)
- **name** (string) - The name of the metric.
- **description** (string) - Description of the metric.
- **baseUnit** (string) - The base unit of the metric.
- **measurements** (array) - List of measurements for the metric.
  - **statistic** (string) - The statistic type (e.g., COUNT, TOTAL_TIME).
  - **value** (number) - The value of the measurement.
- **availableTags** (array) - List of tags available for filtering this metric.

#### Response Example
{
  "name": "http.server.requests",
  "description": "",
  "baseUnit": "seconds",
  "measurements": [
    {
      "statistic": "TOTAL_COUNT",
      "value": 150
    },
    {
      "statistic": "TOTAL_TIME",
      "value": 12.345
    }
  ],
  "availableTags": [
    {
      "tag": "uri",
      "values": ["/api/users", "/api/products"]
    },
    {
      "tag": "status",
      "values": ["200", "500"]
    }
  ]
}
```

--------------------------------

### Actuator Mappings API

Source: https://docs.spring.io/spring-boot/specification/configuration-metadata/manual-hints

Exposes a listing of all the request mappings in the application.

```APIDOC
## GET /actuator/mappings

### Description
Retrieves a list of all request mappings (endpoints) in the application.

### Method
GET

### Endpoint
/actuator/mappings

### Response
#### Success Response (200)
- **dispatcherServlets** (object) - Mappings categorized by dispatcher servlet.
  - **dispatcherServletName** (object)
    - **#root** (object) - Contains mappings for different HTTP methods.
      - **HTTP_METHOD** (array) - List of endpoint details for a specific HTTP method.
        - **path** (string) - The URL path.
        - **predicate** (string) - The predicate used for matching.
        - **handler** (string) - The handler method or class.
        - **supportedMethods** (array) - Supported HTTP methods for this mapping.
        - **consumes** (array) - Consumes media types.
        - **produces** (array) - Produces media types.

#### Response Example
{
  "dispatcherServlets": {
    "dispatcherServlet": {
      "GET": [
        {
          "path": "/api/users/{id}",
          "predicate": "Paths: [/api/users/{id}]",
          "handler": "UserController#getUserById",
          "supportedMethods": ["GET"],
          "consumes": [],
          "produces": ["application/json"]
        }
      ],
      "POST": [
        {
          "path": "/api/users",
          "predicate": "Paths: [/api/users]",
          "handler": "UserController#createUser",
          "supportedMethods": ["POST"],
          "consumes": ["application/json"],
          "produces": ["application/json"]
        }
      ]
    }
  }
}
```

--------------------------------

### Actuator Beans API

Source: https://docs.spring.io/spring-boot/specification/configuration-metadata/manual-hints

Exposes a listing of all Spring beans within the application context.

```APIDOC
## GET /actuator/beans

### Description
Retrieves a list of all beans in the Spring application context.

### Method
GET

### Endpoint
/actuator/beans

### Response
#### Success Response (200)
- **contexts** (object) - Contains beans categorized by context.
  - **applicationContext** (object) - Beans within the main application context.
    - **beans** (object) - A map where keys are bean IDs and values contain bean details.
      - **beanId** (object)
        - **aliases** (array) - Aliases for the bean.
        - **type** (string) - The class type of the bean.
        - **resource** (string) - The resource where the bean is defined.
        - **dependencies** (array) - Dependencies of the bean.

#### Response Example
{
  "contexts": {
    "applicationContext": {
      "beans": {
        "sampleBean": {
          "aliases": [],
          "type": "com.example.SampleBean",
          "resource": "file:/path/to/your/app.jar:com/example/SampleBean.class",
          "dependencies": []
        }
      }
    }
  }
}
```

--------------------------------

### Actuator - Prometheus (`prometheus`)

Source: https://docs.spring.io/spring-boot/reference/using/structuring-your-code

Exposes metrics in a format that can be

--------------------------------

### Spring Boot Actuator Mappings API

Source: https://docs.spring.io/spring-boot/upgrading

Exposes a listing of all available request mappings.

```APIDOC
## GET /actuator/mappings

### Description
Lists all the request mappings (URL endpoints) configured in your application, along with the handler methods they are mapped to.

### Method
GET

### Endpoint
/actuator/mappings

### Parameters
N/A

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **dispatcherServlets** (object) - An object containing mappings for each dispatcher servlet.
  - **[servletName]** (object)
    - **#cdot** (array) - An array of mapping details.
      - **produces** (array) - Content types the mapping produces.
      - **methods** (array) - HTTP methods supported by the mapping.
      - **path** (string) - The URL path pattern.
      - **handler** (string) - The handler method or controller class.
      - **operationFullNames** (array) - Full names of operations.

#### Response Example
```json
{
  "example": "{\"dispatcherServlets\": {\"dispatcherServlet\": {\"#cdot\": [{\"produces\": [\"application/json;charset=UTF-8\"], \"methods\": [\"GET\"], \"path\": \"/api/users/{id}\", \"handler\": \"com.example.UserController#getUser(Long)\", \"operationFullNames\": [\"getUserById\"]}]}}}"
}
```
```

--------------------------------

### Actuator - Conditions Evaluation Report (`conditions`)

Source: https://docs.spring.io/spring-boot/reference/using/structuring-your-code

Shows the conditions that were evaluated during auto-configuration. It provides insight into why certain auto-configurations were applied or not.

```APIDOC
## GET /actuator/conditions

### Description
Retrieves a report of the conditions that were evaluated during auto-configuration. This endpoint helps to understand why certain auto-configurations were applied or not, providing insights into the application's configuration.

### Method
GET

### Endpoint
/actuator/conditions

### Parameters
N/A

### Request Example
N/A (GET request)

### Response
#### Success Response (200)
- **contexts** (object) - An object containing information about the application contexts and their conditions evaluation.
  - **[contextId]** (object) - An object representing a specific application context.
    - **positiveMatches** (object) - Conditions that matched.
      - **[className]** (object) - Details about matching class
    - **negativeMatches** (object) - Conditions that did not match.
      - **[className]** (object) - Details about non-matching class

#### Response Example
```json
{
  "contexts": {
    "application": {
      "positiveMatches": {
        "org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration": {
          "bean": "dataSource",
          "message": "@ConditionalOnClass found required class 'javax.sql.DataSource'"
        }
      },
      "negativeMatches": {
        "org.springframework.boot.autoconfigure.jmx.JmxAutoConfiguration": {
          "searchable": "true",
          "status": "Did not match",
          "message": "@ConditionalOnProperty (spring.jmx.enabled=true) found different value in property 'spring.jmx.enabled'"
        }
      }
    }
  }
}
```
```

--------------------------------

### Actuator Heap Dump API

Source: https://docs.spring.io/spring-boot/specification/configuration-metadata/manual-hints

Provides a heap dump of the Java virtual machine.

```APIDOC
## GET /actuator/heapdump

### Description
Triggers and downloads a heap dump of the JVM.

### Method
GET

### Endpoint
/actuator/heapdump

### Response
#### Success Response (200)
- **Content-Type**: application/octet-stream
- **Content-Disposition**: attachment; filename="heapdump.hprof"

The response body will be the binary heap dump file.

### Response Example
(Binary data representing a heap dump)
```

--------------------------------

### Actuator - Caches (`caches`)

Source: https://docs.spring.io/spring-boot/reference/using/structuring-your-code

Provides details about the application's caches. It allows you to inspect cache configurations and statistics.

```APIDOC
## GET /actuator/caches

### Description
Retrieves details about the application's caches, including configuration and statistics. This endpoint is helpful for monitoring and managing cache performance.

### Method
GET

### Endpoint
/actuator/caches

### Parameters
N/A

### Request Example
N/A (GET request)

### Response
#### Success Response (200)
- **cacheManagers** (object) - An object containing information about the cache managers and their caches.
  - **[cacheManagerName]** (object) - An object representing a specific cache manager.
    - **caches** (object) - An object containing information about the caches managed by this cache manager.
      - **[cacheName]** (object) - An object representing a specific cache.
        - **target** (string) - The target of the cache.
        - **cacheConfiguration** (object) - cache configuration details


#### Response Example
```json
{
  "cacheManagers": {
    "cacheManager": {
      "caches": {
        "myCache": {
          "target": "com.example.MyCache",
          "cacheConfiguration": {
            "name": "myCache",
            "statisticsEnabled": false
          }
        }
      }
    }
  }
}
```
```

--------------------------------

### Actuator - Environment (`env`)

Source: https://docs.spring.io/spring-boot/reference/using/structuring-your-code

Exposes the application's environment properties. This endpoint is helpful for understanding the various environment variables and system properties.

```APIDOC
## GET /actuator/env

### Description
Retrieves the application's environment properties, including environment variables, system properties, and application configuration. This endpoint provides insight into the various configuration sources and their values.

### Method
GET

### Endpoint
/actuator/env

### Parameters
N/A

### Request Example
N/A (GET request)

### Response
#### Success Response (200)
- **activeProfiles** (array) - An array of active profiles.
- **propertySources** (array) - An array of property source objects.
  - **name** (string) - The name of the property source.
  - **properties** (object) - An object containing the properties in the property source.
    - **[propertyName]** (object) - An object representing a specific property.
      - **value** (any) - The value of the property.
      - **origin** (string) - The origin of the property (where it was defined).

#### Response Example
```json
{
  "activeProfiles": [],
  "propertySources": [
    {
      "name": "server.ports",
      "properties": {
        "local.server.port": {
          "value": 8080,
          "origin": "EmbeddedWebApplicationContextInitializer.onApplicationEvent(EmbeddedWebApplicationContextInitializer.java:80)"
        }
      }
    },
    {
      "name": "systemProperties",
      "properties": {
        "java.runtime.name": {
          "value": "Java(TM) SE Runtime Environment"
        }
      }
    }
  ]
}
```
```

--------------------------------

### Actuator - Spring Integration Graph (`integrationgraph`)

Source: https://docs.spring.io/spring-boot/reference/using/structuring-your-code

Shows the Spring Integration graph. Useful for visualizing and debugging Spring Integration flows.

```APIDOC
## GET /actuator/integrationgraph

### Description
Retrieves the Spring Integration graph, allowing visualization and debugging of Spring Integration flows within the application.

### Method
GET

### Endpoint
/actuator/integrationgraph

### Parameters
N/A

### Request Example
N/A (GET request)

### Response
#### Success Response (200)
- The response is a JSON representation of the Spring Integration graph.

#### Response Example
```json
{
  "nodes": [
    {
      "id": "channel1",
      "componentType": "channel",
      "name": "inputChannel"
    },
    {
      "id": "serviceActivator1",
      "componentType": "serviceActivator",
      "name": "myServiceActivator"
    }
  ],
  "links": [
    {
      "source": "channel1",
      "target": "serviceActivator1"
    }
  ]
}
```
```

--------------------------------

### Actuator Prometheus API

Source: https://docs.spring.io/spring-boot/specification/configuration-metadata/manual-hints

Exposes application metrics in Prometheus format.

```APIDOC
## GET /actuator/prometheus

### Description
Retrieves application metrics in Prometheus exposition format.

### Method
GET

### Endpoint
/actuator/prometheus

### Response
#### Success Response (200)
- **Content-Type**: text/plain; version=0.0.4; charset=utf-8

The response body contains metrics in Prometheus text format.

### Response Example
# HELP jvm_memory_used_bytes JVM memory usage in bytes
# TYPE jvm_memory_used_bytes gauge
jvm_memory_used_bytes{area="heap",} 123456789
jvm_memory_used_bytes{area="nonheap",} 98765432

# HELP http_server_requests_seconds Total time of HTTP server requests in seconds
# TYPE http_server_requests_seconds summary
http_server_requests_seconds{method="GET",uri="/api/users",status="200",quantile="0.5",} 0.05
http_server_requests_seconds_sum{method="GET",uri="/api/users",status="200",} 12.345
http_server_requests_seconds_count{method="GET",uri="/api/users",status="200",} 150
```

--------------------------------

### Spring Boot Actuator Environment API

Source: https://docs.spring.io/spring-boot/upgrading

Exposes environment properties, including system properties, environment variables, and application properties.

```APIDOC
## GET /actuator/env

### Description
Retrieves a comprehensive view of the application's environment, including properties from various sources like system properties, environment variables, and configuration files.

### Method
GET

### Endpoint
/actuator/env

### Parameters
N/A

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **properties** (object) - An object containing various environment properties.
  - **systemProperties** (object) - System properties.
  - **environment** (object) - Environment variables.
  - **applicationConfig: [classpath*:application.yml]** (object) - Application-specific configuration properties.

#### Response Example
```json
{
  "example": "{\"properties\": {\"systemProperties\": {\"os.name\": \"Linux\"}, \"environment\": {\"PATH\": \"/usr/bin:/bin\"}, \"applicationConfig: [classpath*:application.yml]\": {\"server.port\": 8080}}}"
}
```
```

--------------------------------

### Actuator Configuration Properties API

Source: https://docs.spring.io/spring-boot/specification/configuration-metadata/manual-hints

Exposes the configuration properties available in your application.

```APIDOC
## GET /actuator/configprops

### Description
Retrieves a hierarchical view of all configuration properties.

### Method
GET

### Endpoint
/actuator/configprops

### Response
#### Success Response (200)
- **contexts** (object) - Contains configuration properties categorized by context.
  - **applicationContext** (object)
    - **beans** (object) - A map where keys are bean IDs and values contain their properties.
      - **beanId** (object)
        - **prefix** (string) - The prefix for the configuration properties.
        - **properties** (object) - A map of property names and their values.

#### Response Example
{
  "contexts": {
    "applicationContext": {
      "beans": {
        "serverProperties": {
          "prefix": "server",
          "properties": {
            "port": 8080,
            "ssl": {
              "enabled": false
            }
          }
        }
      }
    }
  }
}
```

--------------------------------

### Spring Boot Actuator Flyway API

Source: https://docs.spring.io/spring-boot/upgrading

Provides information about Flyway database migration states.

```APIDOC
## GET /actuator/flyway

### Description
Lists the status of Flyway database migrations, including applied migrations and their details.

### Method
GET

### Endpoint
/actuator/flyway

### Parameters
N/A

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **flyway** (object) - An object containing Flyway migration details.
  - **locations** (array) - Locations where Flyway looks for migration scripts.
  - **schemas** (array) - Database schemas managed by Flyway.
  - **migrations** (array) - Details of applied migrations.
    - **version** (string) - The version of the migration.
    - **description** (string) - Description of the migration.
    - **type** (string) - Type of migration (e.g., JDBC, SQL).
    - **script** (string) - The migration script file name.
    - **state** (string) - The state of the migration (e.g., APPLIED).
    - **checksum** (string) - Checksum of the migration script.
    - **appliedOn** (string) - Timestamp when the migration was applied.
    - **appliedBy** (string) - User who applied the migration.

#### Response Example
```json
{
  "example": "{\"flyway\": {\"locations\": [\"classpath:db/migration\"], \"schemas\": [\"public\"], \"migrations\": [{\"version\": \"1\", \"description\": \"initial schema\", \"type\": \"JDBC\", \"script\": \"V1__initial_schema.sql\", \"state\": \"APPLIED\", \"checksum\": \"1234567890\", \"appliedOn\": \"2023-10-27T10:00:00Z\", \"appliedBy\": \"user1\"}]}}"
}
```
```

--------------------------------

### Spring Boot Actuator Beans API

Source: https://docs.spring.io/spring-boot/upgrading

Exposes a listing of all Spring beans within the application context.

```APIDOC
## GET /actuator/beans

### Description
Retrieves a JSON structure representing all Spring beans in the application context, categorized by their context.

### Method
GET

### Endpoint
/actuator/beans

### Parameters
N/A

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **contexts** (object) - An object where keys are context IDs and values are objects containing beans.
  - **beans** (object) - An object where keys are bean IDs and values are bean details.
    - **aliases** (array) - Aliases for the bean.
    - **type** (string) - The class name of the bean.
    - **resource** (string) - The resource associated with the bean.
    - **dependencies** (array) - Dependencies of the bean.

#### Response Example
```json
{
  "example": "{\"applicationContext\": {\"beans\": {\"myBean\": {\"aliases\": [], \"type\": \"com.example.MyBean\", \"resource\": \"file:/path/to/MyBean.class\", \"dependencies\": [\"anotherBean\"]}}}}"
}
```
```

--------------------------------

### Actuator Spring Integration Graph API

Source: https://docs.spring.io/spring-boot/specification/configuration-metadata/manual-hints

Exposes a graph of Spring Integration components.

```APIDOC
## GET /actuator/integrationgraph

### Description
Retrieves a graph representation of Spring Integration components and their connections.

### Method
GET

### Endpoint
/actuator/integrationgraph

### Response
#### Success Response (200)
- **nodes** (array) - List of integration components.
  - **id** (string) - Unique identifier for the component.
  - **label** (string) - Display name of the component.
  - **type** (string) - Type of the component (e.g., 'channel', 'service-activator').
- **edges** (array) - List of connections between components.
  - **fromId** (string) - ID of the source component.
  - **toId** (string) - ID of the target component.
  - **label** (string) - Label for the connection (e.g., 'output').

#### Response Example
{
  "nodes": [
    {
      "id": "inputChannel",
      "label": "Input Channel",
      "type": "channel"
    },
    {
      "id": "serviceActivator",
      "label": "My Service Activator",
      "type": "service-activator"
    }
  ],
  "edges": [
    {
      "fromId": "inputChannel",
      "toId": "serviceActivator",
      "label": "output"
    }
  ]
}
```

--------------------------------

### Spring Boot Actuator Liquibase API

Source: https://docs.spring.io/spring-boot/upgrading

Provides information about Liquibase database migration states.

```APIDOC
## GET /actuator/liquibase

### Description
Lists the status of Liquibase database migrations, including applied changesets and their details.

### Method
GET

### Endpoint
/actuator/liquibase

### Parameters
N/A

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **liquibase** (object) - An object containing Liquibase migration details.
  - **contexts** (array) - Liquibase contexts.
  - **changesets** (array) - Details of applied changesets.
    - **id** (string) - The ID of the changeset.
    - **author** (string) - The author of the changeset.
    - **tag** (string) - The tag associated with the changeset.
    - **md5sum** (string) - MD5 checksum of the changeset.
    - **deployed** (string) - Timestamp when the changeset was deployed.
    - **execType** (string) - Type of execution.

#### Response Example
```json
{
  "example": "{\"liquibase\": {\"contexts\": [\"test\"], \"changesets\": [{\"id\": \"create-user-table\", \"author\": \"admin\", \"tag\": \"v1.0\", \"md5sum\": \"abcdef123456\", \"deployed\": \"2023-10-27T10:00:00Z\", \"execType\": \"EXECUTED\"}]}}"
}
```
```

--------------------------------

### Actuator API Endpoints

Source: https://docs.spring.io/spring-boot/reference/web/servlet

This section details the various endpoints provided by Spring Boot Actuator for monitoring and managing applications.

```APIDOC
## Actuator API Endpoints

### Description
Spring Boot Actuator provides a comprehensive set of REST endpoints for monitoring and managing your application in production. These endpoints allow you to inspect application state, view metrics, and perform management tasks.

### GET /actuator/auditevents

#### Description
Exposes audit events recorded by the application.

### GET /actuator/beans

#### Description
Displays a list of all beans configured in the Spring application context.

### GET /actuator/caches

#### Description
Exposes information about the available caches and their statistics.

### GET /actuator/conditions

#### Description
Shows the conditions that were evaluated during application startup, indicating why beans were or were not created.

### GET /actuator/configprops

#### Description
Displays all the configuration properties that are available in the application.

### GET /actuator/env

#### Description
Exposes the current environment properties, including system properties, environment variables, and application configuration.

### GET /actuator/flyway

#### Description
Provides details about the Flyway database migrations applied to the application.

### GET /actuator/health

#### Description
Shows the health information of the application, including the status of various components.

### GET /actuator/heapdump

#### Description
Triggers and returns a heap dump of the Java virtual machine.

### GET /actuator/httpexchanges

#### Description
Records and exposes recent HTTP exchanges (requests and responses) made by the application.

### GET /actuator/info

#### Description
Exposes arbitrary application information, typically configured via the `info` properties.

### GET /actuator/integrationgraph

#### Description
Displays the Spring Integration graph, showing the flow of messages between components.

### GET /actuator/liquibase

#### Description
Provides details about the Liquibase database migrations applied to the application.

### GET /actuator/logfile

#### Description
Returns the contents of the application log file.

### GET /actuator/loggers

#### Description
Allows you to view and modify the logging levels of different loggers at runtime.

### GET /actuator/mappings

#### Description
Displays a listing of all the request mappings configured in the application.

### GET /actuator/metrics

#### Description
Exposes a wide range of application metrics, such as JVM memory usage, thread counts, and HTTP request statistics.

### GET /actuator/prometheus

#### Description
Exposes the application's metrics in a format compatible with Prometheus monitoring systems.
```

--------------------------------

### WebMvcTest Unit Test with Kotlin

Source: https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications

Demonstrates a unit test for a Spring MVC controller using `@WebMvcTest` and Mockito for mocking service dependencies. This test verifies controller logic by mocking the `UserVehicleService` and asserting the response from a web endpoint.

```kotlin
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.beans.factory.annotation.Autowired
import org.junit.jupiter.api.Test
import org.assertj.core.api.Assertions.assertThat
import org.mockito.BDDMockito.given
import com.gargoylesoftware.htmlunit.WebClient
import com.gargoylesoftware.htmlunit.html.HtmlPage

// Assuming UserVehicleController, UserVehicleService, and VehicleDetails are defined elsewhere

@WebMvcTest(UserVehicleController::class)
class MyHtmlUnitTests(@Autowired val webClient: WebClient) {

	@MockitoBean
	lateinit var userVehicleService: UserVehicleService

	@Test
	fun testExample() {
		// Mock the service call to return specific data
		given(userVehicleService.getVehicleDetails("sboot")).willReturn(VehicleDetails("Honda", "Civic"))
		
		// Interact with the web endpoint using WebClient
		val page = webClient.getPage<HtmlPage>("/sboot/vehicle.html")
		
		// Assert the expected content on the page
		assertThat(page.body.textContent).isEqualTo("Honda Civic")
	}

}
```

--------------------------------

### Actuator Loggers API

Source: https://docs.spring.io/spring-boot/specification/configuration-metadata/manual-hints

Provides information about the application's loggers and allows their configuration.

```APIDOC
## GET /actuator/loggers

### Description
Retrieves a list of all configured loggers and their levels.

### Method
GET

### Endpoint
/actuator/loggers

### Response
#### Success Response (200)
- **loggers** (object) - A map where keys are logger names and values contain their configuration.
  - **loggerName** (object)
    - **levels** (object) - Available levels for the logger.
    - **configuredLevel** (string) - The currently configured level for the logger.

#### Response Example
{
  "loggers": {
    "ROOT": {
      "levels": {
        "OFF": "OFF",
        "ERROR": "ERROR",
        "WARN": "WARN",
        "INFO": "INFO",
        "DEBUG": "DEBUG",
        "TRACE": "TRACE"
      },
      "configuredLevel": "INFO"
    },
    "com.example": {
      "levels": {
        "OFF": "OFF",
        "ERROR": "ERROR",
        "WARN": "WARN",
        "INFO": "INFO",
        "DEBUG": "DEBUG",
        "TRACE": "TRACE"
      },
      "configuredLevel": "DEBUG"
    }
  }
}

## POST /actuator/loggers/{name}

### Description
Configures the logging level for a specific logger.

### Method
POST

### Endpoint
/actuator/loggers/{name}

### Parameters
#### Path Parameters
- **name** (string) - Required - The name of the logger to configure.
#### Request Body
- **configuredLevel** (string) - Required - The desired logging level (e.g., 'INFO', 'DEBUG').

### Request Example
POST /actuator/loggers/com.example

Body:
```json
{
  "configuredLevel": "TRACE"
}
```

### Response
#### Success Response (200)
- **levels** (object) - Available levels for the logger.
- **configuredLevel** (string) - The newly configured level for the logger.
```

--------------------------------

### Spring Boot Actuator Metrics API

Source: https://docs.spring.io/spring-boot/upgrading

Exposes application metrics.

```APIDOC
## GET /actuator/metrics

### Description
Provides a list of available application metrics. You can query specific metrics for detailed information.

### Method
GET

### Endpoint
/actuator/metrics

### Parameters
#### Query Parameters
- **tag** (string) - Optional - Filter metrics by tag (e.g., `jvm_memory_used_bytes{area=heap}`).

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **names** (array) - A list of available metric names.

#### Response Example
```json
{
  "example": "{\"names\": [\"jvm.memory.used\", \"http.server.requests\"]}"
}
```
```

```APIDOC
## GET /actuator/metrics/{metricName}

### Description
Retrieves detailed information for a specific application metric, including its current value and historical data if available.

### Method
GET

### Endpoint
/actuator/metrics/{metricName}

### Parameters
#### Path Parameters
- **metricName** (string) - Required - The name of the metric to retrieve.

#### Query Parameters
- **tag** (string) - Optional - Filter metric values by tag (e.g., `method=GET`).

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **name** (string) - The name of the metric.
- **description** (string) - Description of the metric.
- **baseUnit** (string) - The base unit of the metric (e.g., bytes, seconds).
- **measurements** (array) - A list of measurements for the metric.
  - **statistic** (string) - The type of statistic (e.g., COUNT, TOTAL_TIME).
  - **value** (number) - The measured value.

#### Response Example
```json
{
  "example": "{\"name\": \"http.server.requests\", \"description\": \"Total HTTP server requests.\", \"baseUnit\": \"s\", \"measurements\": [{\"statistic\": \"COUNT\", \"value\": 150}, {\"statistic\": \"TOTAL_TIME\", \"value\": 12.5}]}"
}
```
```

--------------------------------

### Actuator - HTTP Exchanges (`httpexchanges`)

Source: https://docs.spring.io/spring-boot/reference/using/structuring-your-code

Provides access to HTTP trace information. It is used for monitoring HTTP requests and responses.

```APIDOC
## GET /actuator/httpexchanges

### Description
Retrieves HTTP exchange information. This endpoint is used for monitoring HTTP requests and responses handled by the application.

### Method
GET

### Endpoint
/actuator/httpexchanges

### Parameters
#### Query Parameters
- **page** (integer) - Optional - The page number to retrieve.
- **size** (integer) - Optional - The number of exchanges per page.

### Request Example
N/A (GET request)

### Response
#### Success Response (200)
- **content** (array) - An array of HTTP exchange objects.
  - **timestamp** (string) - The timestamp of the exchange.
  - **requestMethod** (string) - The HTTP request method (e.g., GET, POST).
  - **requestUri** (string) - The URI of the request.
  - **responseStatus** (integer) - The HTTP response status code.
  - **timeTaken** (number) - The time taken to process the request in milliseconds.

#### Response Example
```json
{
  "content": [
    {
      "timestamp": "2024-01-01T12:00:00.000Z",
      "requestMethod": "GET",
      "requestUri": "/api/example",
      "responseStatus": 200,
      "timeTaken": 50
    }
  ]
}
```
```

--------------------------------

### Actuator Health API

Source: https://docs.spring.io/spring-boot/specification/configuration-metadata/manual-hints

Exposes application health information.

```APIDOC
## GET /actuator/health

### Description
Retrieves the health status of the application.

### Method
GET

### Endpoint
/actuator/health

### Parameters
#### Query Parameters
- **showDetails** (string) - Optional - 'true' to show detailed health information.

### Response
#### Success Response (200)
- **status** (string) - The overall health status (e.g., 'UP', 'DOWN').
- **components** (object) - Detailed health information for each component (if showDetails=true).
  - **componentName** (object)
    - **status** (string) - Status of the component (e.g., 'UP', 'DOWN').
    - **details** (object) - Specific details about the component's health.

#### Response Example
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "hello": 1
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 512000000000,
        "free": 204800000000,
        "threshold": 10485760000
      }
    }
  }
}
```

--------------------------------

### Actuator Log File API

Source: https://docs.spring.io/spring-boot/specification/configuration-metadata/manual-hints

Exposes the content of the application's log file.

```APIDOC
## GET /actuator/logfile

### Description
Retrieves the content of the application's log file.

### Method
GET

### Endpoint
/actuator/logfile

### Response
#### Success Response (200)
- **Content-Type**: text/plain

The response body contains the content of the log file.

### Response Example
2023-10-27 11:00:00.000 INFO 12345 --- [           main] c.e.MyApp                  : Application started successfully.
```

--------------------------------

### Actuator - Log File (`logfile`)

Source: https://docs.spring.io/spring-boot/reference/using/structuring-your-code

Returns the application's log file content. This endpoint can be used to remotely access application logs.

```APIDOC
## GET /actuator/logfile

### Description
Returns the application's log file content. This endpoint allows you to remotely access application logs for debugging and monitoring purposes.

### Method
GET

### Endpoint
/actuator/logfile

### Parameters
#### Query Parameters
- **start** (integer) - Optional - The starting byte position in the log file.
- **length** (integer) - Optional - The number of bytes to retrieve.

### Request Example
N/A (GET request)

### Response
#### Success Response (200)
- The response is the content of the log file, either the entire file or a portion of it based on the `start` and `length` parameters.

#### Response Example
```text
2024-01-01 12:00:00.000 INFO  [main] ...
2024-01-01 12:00:01.000 DEBUG [main] ...
```
```

--------------------------------

### Actuator - Health (`health`)

Source: https://docs.spring.io/spring-boot/reference/using/structuring-your-code

Shows application health information. Indicates whether the application is up and running.

```APIDOC
## GET /actuator/health

### Description
Retrieves application health information. This endpoint indicates whether the application is up and running and provides details about the health of various components.

### Method
GET

### Endpoint
/actuator/health

### Parameters
N/A

### Request Example
N/A (GET request)

### Response
#### Success Response (200)
- **status** (string) - The overall health status of the application (e.g., UP, DOWN).
- **components** (object) - An object containing health information about individual components.
  - **[componentName]** (object) - An object representing a specific component.
    - **status** (string) - The health status of the component.
    - **details** (object) - Additional details about the component's health.

#### Response Example
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "H2",
        "validationQuery": "SELECT 1"
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 250685655040,
        "free": 238862172160,
        "threshold": 10485760
      }
    }
  }
}
```
```

--------------------------------

### Spring Boot Actuator Prometheus API

Source: https://docs.spring.io/spring-boot/upgrading

Exposes application metrics in Prometheus format.

```APIDOC
## GET /actuator/prometheus

### Description
Exports application metrics in the Prometheus exposition format, allowing Prometheus to scrape and collect them.

### Method
GET

### Endpoint
/actuator/prometheus

### Parameters
N/A

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **(Prometheus metrics text format)** - A plain text response containing metrics in Prometheus format.

#### Response Example
```json
{
  "example": "# HELP jvm_memory_used_bytes JVM memory usage in bytes.\n# TYPE jvm_memory_used_bytes gauge\njvm_memory_used_bytes{area=heap} 123456789\njvm_memory_used_bytes{area=nonheap} 98765432\n# HELP http_server_requests Total HTTP server requests.\n# TYPE http_server_requests counter\nhttp_server_requests_total{method=\"GET\",uri=\"/api/users\",status=200} 150"
}
```
```

--------------------------------

### Spring Boot Actuator Conditions Evaluation Report API

Source: https://docs.spring.io/spring-boot/upgrading

Exposes a report detailing the conditions that were evaluated for auto-configuration.

```APIDOC
## GET /actuator/conditions

### Description
Provides a detailed report on which auto-configuration classes were applied and why, including any conditions that were not met.

### Method
GET

### Endpoint
/actuator/conditions

### Parameters
N/A

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- ** +#+** (object) - A nested object detailing auto-configuration evaluations, grouped by class and condition.

#### Response Example
```json
{
  "example": "{\" +#+\": {\"//org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration#mvcCore\": {\"positiveMatches\": [\"@ConditionalOnClass\"], \"negativeMatches\": []}}}"
}
```
```

--------------------------------

### Spring Boot Actuator Heap Dump API

Source: https://docs.spring.io/spring-boot/upgrading

Generates a heap dump of the Java virtual machine.

```APIDOC
## GET /actuator/heapdump

### Description
Triggers the creation of a heap dump for the running JVM. The response is a binary file in HPROF format.

### Method
GET

### Endpoint
/actuator/heapdump

### Parameters
N/A

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **(binary data)** - The heap dump in HPROF format.

#### Response Example
```json
{
  "example": "(binary data of heap dump)"
}
```
```

--------------------------------

### Spring Boot Actuator Spring Integration Graph API

Source: https://docs.spring.io/spring-boot/upgrading

Displays the Spring Integration graph.

```APIDOC
## GET /actuator/integrationgraph

### Description
Visualizes the Spring Integration message flow as a graph.

### Method
GET

### Endpoint
/actuator/integrationgraph

### Parameters
N/A

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **(graph data)** - Data representing the Spring Integration graph, typically in a format like GraphML or JSON.

#### Response Example
```json
{
  "example": "(Graph data in GraphML or JSON format)"
}
```
```

--------------------------------

### Actuator Caches API

Source: https://docs.spring.io/spring-boot/specification/configuration-metadata/manual-hints

Provides information and management capabilities for the application's caches.

```APIDOC
## GET /actuator/caches

### Description
Retrieves a list of available caches.

### Method
GET

### Endpoint
/actuator/caches

### Response
#### Success Response (200)
- **caches** (array) - List of cache names.

#### Response Example
{
  "caches": [
    "usersCache",
    "productsCache"
  ]
}

## GET /actuator/caches/{name}

### Description
Retrieves details about a specific cache.

### Method
GET

### Endpoint
/actuator/caches/{name}

### Parameters
#### Path Parameters
- **name** (string) - Required - The name of the cache.

### Response
#### Success Response (200)
- **name** (string) - The name of the cache.
- **target** (string) - The underlying cache manager implementation.
- **size** (integer) - The current size of the cache (if available).

#### Response Example
{
  "name": "usersCache",
  "target": "org.springframework.cache.concurrent.ConcurrentMapCacheManager",
  "size": 100
}

## POST /actuator/caches/{name}?action=clear

### Description
Clears all entries from a specific cache.

### Method
POST

### Endpoint
/actuator/caches/{name}

### Parameters
#### Path Parameters
- **name** (string) - Required - The name of the cache to clear.
#### Query Parameters
- **action** (string) - Required - Must be 'clear'.

### Response
#### Success Response (204)
No content.

### Request Example
POST /actuator/caches/usersCache?action=clear
```

--------------------------------

### Spring Boot Actuator Caches API

Source: https://docs.spring.io/spring-boot/upgrading

Provides information about the available cache managers and their caches.

```APIDOC
## GET /actuator/caches

### Description
Retrieves a list of configured cache managers and the names of the caches they manage.

### Method
GET

### Endpoint
/actuator/caches

### Parameters
N/A

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **cacheManagers** (object) - An object where keys are cache manager names and values are objects listing their caches.
  - **caches** (object) - An object where keys are cache names and values contain cache details (e.g., size, memory usage).

#### Response Example
```json
{
  "example": "{\"cacheManager\": {\"caches\": {\"myCache\": {\"size\": 100}}}}"
}
```
```

--------------------------------

### Actuator - Heap Dump (`heapdump`)

Source: https://docs.spring.io/spring-boot/reference/using/structuring-your-code

Returns a heap dump. This endpoint is useful for analyzing memory usage.

```APIDOC
## GET /actuator/heapdump

### Description
Returns a heap dump of the application. This endpoint is useful for analyzing memory usage and identifying potential memory leaks.

### Method
GET

### Endpoint
/actuator/heapdump

### Parameters
N/A

### Request Example
N/A (GET request)

### Response
#### Success Response (200)
- The response is a binary file containing the heap dump in HPROF format.

#### Response Example
N/A (Binary file)
```

--------------------------------

### Spring Boot Actuator Log File API

Source: https://docs.spring.io/spring-boot/upgrading

Returns the contents of the application's log file.

```APIDOC
## GET /actuator/logfile

### Description
Retrieves the contents of the application's log file. The response is a plain text file.

### Method
GET

### Endpoint
/actuator/logfile

### Parameters
N/A

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **(plain text)** - The content of the log file.

#### Response Example
```json
{
  "example": "2023-10-27 10:00:00.123 INFO 12345 --- [main] com.example.MyApp : Application started...\n2023-10-27 10:01:00.456 DEBUG 12345 --- [http-nio-8080-exec-1] com.example.controller.UserController : Handling request..."
}
```
```

--------------------------------

### User Handler Functions in Kotlin (Spring MVC)

Source: https://docs.spring.io/spring-boot/reference/web/servlet

Defines a Spring MVC component 'MyUserHandler' with functions to handle user-related requests. It uses ServerRequest and ServerResponse for request and response handling, common in reactive Spring applications.

```kotlin
import org.springframework.stereotype.Component
import org.springframework.web.servlet.function.ServerRequest
import org.springframework.web.servlet.function.ServerResponse

@Component
class MyUserHandler {

	fun getUser(request: ServerRequest?): ServerResponse {
		... 
	}

	fun getUserCustomers(request: ServerRequest?): ServerResponse {
		... 
	}

	fun deleteUser(request: ServerRequest?): ServerResponse {
		... 
	}

}
```

--------------------------------

### Actuator - Loggers (`loggers`)

Source: https://docs.spring.io/spring-boot/reference/using/structuring-your-code

Shows and modifies the configuration of loggers in the application. Allows runtime control of logging levels.

```APIDOC
## GET /actuator/loggers

### Description
Retrieves and modifies the configuration of loggers in the application. This endpoint allows runtime control of logging levels for different loggers.

### Method
GET

### Endpoint
/actuator/loggers

### Parameters
N/A

### Request Example
N/A (GET request)

### Response
#### Success Response (200)
- **levels** (array) - An array of available logging levels (e.g., OFF, ERROR, WARN, INFO, DEBUG, TRACE).
- **loggers** (object) - An object containing the configuration of individual loggers.
  - **[loggerName]** (object) - An object representing a specific logger.
    - **configuredLevel** (string) - The configured logging level for the logger (or null if not explicitly configured).
    - **effectiveLevel** (string) - The effective logging level for the logger (taking into account parent loggers).

```json
{
  "levels": ["OFF", "ERROR", "WARN", "INFO", "DEBUG", "TRACE"],
  "loggers": {
    "ROOT": {
      "configuredLevel": null,
      "effectiveLevel": "INFO"
    },
    "com.example": {
      "configuredLevel": "DEBUG",
      "effectiveLevel": "DEBUG"
    }
  }
}
```

## POST /actuator/loggers/{name}

### Description
Updates the logging level for a specified logger.

### Method
POST

### Endpoint
/actuator/loggers/{name}

### Parameters
#### Path Parameters
- **name** (string) - Required - The name of the logger to update.

#### Request Body
- **configuredLevel** (string) - Required - The desired logging level for the logger.

### Request Example
```json
{
  "configuredLevel": "DEBUG"
}
```

```

--------------------------------

### Actuator HTTP Exchanges API

Source: https://docs.spring.io/spring-boot/specification/configuration-metadata/manual-hints

Exposes a log of recent HTTP exchanges (requests and responses).

```APIDOC
## GET /actuator/httpexchanges

### Description
Retrieves a list of recent HTTP exchanges.

### Method
GET

### Endpoint
/actuator/httpexchanges

### Parameters
#### Query Parameters
- **limit** (integer) - Optional - The maximum number of exchanges to return.

### Response
#### Success Response (200)
- **httpexchanges** (array) - List of HTTP exchange objects.
  - **request** (object)
    - **method** (string) - HTTP method.
    - **uri** (string) - Request URI.
    - **headers** (object) - Request headers.
  - **response** (object)
    - **status** (integer) - HTTP status code.
    - **headers** (object) - Response headers.
  - **elapsedTime** (integer) - Time taken for the exchange in milliseconds.
  - **timestamp** (datetime) - Timestamp of the exchange.

#### Response Example
{
  "httpexchanges": [
    {
      "request": {
        "method": "GET",
        "uri": "/api/users",
        "headers": {
          "Accept": "application/json"
        }
      },
      "response": {
        "status": 200,
        "headers": {
          "Content-Type": "application/json"
        }
      },
      "elapsedTime": 150,
      "timestamp": "2023-10-27T11:00:00Z"
    }
  ]
}
```

--------------------------------

### Spring Boot Jackson JSON Testing (Java)

Source: https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications

Demonstrates how to use @JsonTest and JacksonTester in Java to serialize and deserialize VehicleDetails objects. It shows assertions against a JSON file and using JSON path. This requires Jackson and Spring Boot testing dependencies.

```java
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

import static org.assertj.core.api.Assertions.assertThat;

@JsonTest
class MyJsonTests {

	@Autowired
	private JacksonTester<VehicleDetails> json;

	@Test
	serialize() throws Exception {
		VehicleDetails details = new VehicleDetails("Honda", "Civic");
		// Assert against a `.json` file in the same package as the test
		assertThat(this.json.write(details)).isEqualToJson("expected.json");
		// Or use JSON path based assertions
		assertThat(this.json.write(details)).hasJsonPathStringValue("@.make");
		assertThat(this.json.write(details)).extractingJsonPathStringValue("@.make").isEqualTo("Honda");
	}

	@Test
	deserialize() throws Exception {
		String content = "{\"make\":\"Ford\",\"model\":\"Focus\"}";
		assertThat(this.json.parse(content)).isEqualTo(new VehicleDetails("Ford", "Focus"));
		assertThat(this.json.parseObject(content).getMake()).isEqualTo("Ford");
	}

}

```

--------------------------------

### Actuator - Beans (`beans`)

Source: https://docs.spring.io/spring-boot/reference/using/structuring-your-code

Exposes information about the Spring beans in the application context. This endpoint can be used to inspect the managed beans.

```APIDOC
## GET /actuator/beans

### Description
Retrieves information about the Spring beans in the application context. This endpoint is useful for inspecting the managed beans and their properties.

### Method
GET

### Endpoint
/actuator/beans

### Parameters
N/A

### Request Example
N/A (GET request)

### Response
#### Success Response (200)
- **contexts** (object) - An object containing information about the application contexts and their beans.
  - **[contextId]** (object) - An object representing a specific application context.
    - **beans** (array) - An array of bean objects.
      - **bean** (string) - The name of the bean.
      - **aliases** (array) - An array of aliases for the bean.
      - **scope** (string) - The scope of the bean (e.g., singleton, prototype).
      - **type** (string) - The fully qualified class name of the bean.
      - **resource** (string) - The resource where the bean is defined.
      - **dependencies** (array) - An array of bean names that this bean depends on.

#### Response Example
```json
{
  "contexts": {
    "application": {
      "beans": [
        {
          "bean": "exampleBean",
          "aliases": [],
          "scope": "singleton",
          "type": "com.example.ExampleBean",
          "resource": "URL [file:src/main/java/com/example/ExampleBean.java]",
          "dependencies": []
        }
      ]
    }
  }
}
```
```

--------------------------------

### Spring Boot Actuator REST APIs

Source: https://docs.spring.io/spring-boot/reference/web/spring-security

This section details the RESTful endpoints provided by Spring Boot Actuator for monitoring and managing applications.

```APIDOC
## Spring Boot Actuator REST APIs

### Description

Provides a set of RESTful endpoints for monitoring and managing your Spring Boot application. These endpoints offer insights into the application's state, configuration, and performance.

### Method

GET

### Endpoint

`/actuator/{path}`

### Parameters

#### Path Parameters

- **path** (string) - Required - The specific Actuator endpoint to access (e.g., `auditevents`, `beans`, `health`).

#### Query Parameters

None

### Request Example

```bash
GET /actuator/health
```

### Response

#### Success Response (200)

- **body** (object) - A JSON object containing the requested information. The structure varies depending on the endpoint.

#### Response Example

For `/actuator/health`:

```json
{
  "status": "UP",
  "components": {
    "db": {
      "details": {
        "database": "MySQL",
        "hello": "Values"
      },
      "status": "UP"
    },
    "diskSpace": {
      "details": {
        "free": 1024000000,
        "total": 10737418240
      },
      "status": "UP"
    }
  }
}
```

### Available Endpoints (Examples)

- **Audit Events (`auditevents`)**: Exposes audit events. Requires `auditing` dependency.
- **Beans (`beans`)**: Displays a list of all Spring beans in your application context.
- **Caches (`caches`)**: Shows information about configured caches.
- **Conditions Evaluation Report (`conditions`)**: Displays the conditions that were evaluated during application startup.
- **Configuration Properties (`configprops`)**: Exposes configuration properties gathered from the `ConfigurationProperties` annotated beans.
- **Environment (`env`)**: Displays the current environment properties.
- **Flyway (`flyway`)**: Shows any Flyway database migrations.
- **Health (`health`)**: Exposes application health information.
- **Heap Dump (`heapdump`)**: Returns a heap dump of the JVM.
- **HTTP Exchanges (`httpexchanges`)**: Records and displays HTTP exchange details.
- **Info (`info`)**: Displays arbitrary application information.
- **Spring Integration Graph (`integrationgraph`)**: Shows the Spring Integration graph.
- **Liquibase (`liquibase`)**: Shows any Liquibase database migrations.
- **Log File (`logfile`)**: Returns the contents of the application log file.
- **Loggers (`loggers`)**: Allows viewing and modifying the log levels for your application.
- **Mappings (`mappings`)**: Displays a list of all the Spring MVC mappings.
- **Metrics (`metrics`)**: Exposes various application metrics.
- **Prometheus (`prometheus`)**: Exposes metrics in Prometheus format.
```

--------------------------------

### Actuator REST APIs

Source: https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications

This section details the available REST endpoints for Spring Boot Actuator, covering aspects like audit events, beans, caching, environment, health, metrics, and more.

```APIDOC
## Audit Events (`auditevents`)

### Description
Retrieves audit events recorded by the application.

### Method
GET

### Endpoint
`/actuator/auditevents`

### Parameters
#### Query Parameters
- **principal** (string) - Optional - Filter events by principal.
- **after** (datetime) - Optional - Filter events after a specific timestamp.
- **before** (datetime) - Optional - Filter events before a specific timestamp.
- **type** (string) - Optional - Filter events by type.
- **tag** (string) - Optional - Filter events by tag.

### Response
#### Success Response (200)
- **message** (string) - A success message indicating the audit events were retrieved.
- **events** (array) - A list of audit event objects.
  - **timestamp** (datetime) - The time the event occurred.
  - **principal** (string) - The principal associated with the event.
  - **type** (string) - The type of the event.
  - **tags** (object) - Additional tags associated with the event.

#### Response Example
```json
{
  "message": "Audit events retrieved successfully.",
  "events": [
    {
      "timestamp": "2023-10-27T10:00:00Z",
      "principal": "user1",
      "type": "LOGIN",
      "tags": {
        "ipAddress": "192.168.1.100"
      }
    }
  ]
}
```

## Beans (`beans`)

### Description
Exposes a list of all Spring beans (ApplicationContext) within the application.

### Method
GET

### Endpoint
`/actuator/beans`

### Response
#### Success Response (200)
- **message** (string) - A success message indicating the beans were retrieved.
- **beans** (object) - A map where keys are bean names and values are bean details.
  - **beans** (array) - A list of beans with their context and aliases.
  - **contexts** (object) - Details about the application contexts.

#### Response Example
```json
{
  "message": "Beans retrieved successfully.",
  "beans": [
    {
      "name": "myBean",
      "type": "com.example.MyBean",
      "scope": "singleton",
      "resource": "file:/path/to/MyBean.class",
      "dependencies": []
    }
  ],
  "contexts": {
    "applicationContext": {
      "beans": [],
      "parent": null
    }
  }
}
```

## Caches (`caches`)

### Description
Exposes JCache statistics for the application.

### Method
GET

### Endpoint
`/actuator/caches`

### Response
#### Success Response (200)
- **message** (string) - A success message indicating cache statistics were retrieved.
- **caches** (object) - A map of cache names to their statistics.
  - **cacheName** (object) - Statistics for a specific cache.
    - **hitCount** (long) - The number of times a cache entry was found.
    - **missCount** (long) - The number of times a cache entry was not found.
    - **size** (long) - The current number of entries in the cache.

#### Response Example
```json
{
  "message": "Cache statistics retrieved successfully.",
  "caches": {
    "myCache": {
      "hitCount": 100,
      "missCount": 20,
      "size": 50
    }
  }
}
```

## Conditions Evaluation Report (`conditions`)

### Description
Provides details about the conditions that were evaluated when starting the application.

### Method
GET

### Endpoint
`/actuator/conditions`

### Response
#### Success Response (200)
- **message** (string) - A success message indicating the conditions report was retrieved.
- **content** (object) - The conditions evaluation report.

#### Response Example
```json
{
  "message": "Conditions evaluation report retrieved successfully.",
  "content": {
    "http.clients": {
      "positiveMatches": [
        {
          "condition": "OnClassCondition",
          "entity": "org.springframework.boot.autoconfigure.web.client.RestTemplateAutoConfiguration",
          "match": true,
          "message": "Found org.springframework.web.client.RestTemplate"
        }
      ],
      "negativeMatches": []
    }
  }
}
```

## Configuration Properties (`configprops`)

### Description
Exposes the configuration properties available in the application.

### Method
GET

### Endpoint
`/actuator/configprops`

### Response
#### Success Response (200)
- **message** (string) - A success message indicating the configuration properties were retrieved.
- **configProps** (object) - A map of configuration property groups.
  - **groupName** (object) - Details about a specific configuration property group.
    - **properties** (object) - A map of property names to their values and origins.

#### Response Example
```json
{
  "message": "Configuration properties retrieved successfully.",
  "configProps": {
    "server.port": {
      "properties": {
        "server.port": {
          "value": 8080,
          "origin": "application.properties",
          "source": "server.port=8080"
        }
      }
    }
  }
}
```

## Environment (`env`)

### Description
Exposes the environment properties of the running application.

### Method
GET

### Endpoint
`/actuator/env`

### Response
#### Success Response (200)
- **message** (string) - A success message indicating the environment properties were retrieved.
- **properties** (object) - A map of environment property sources.

#### Response Example
```json
{
  "message": "Environment properties retrieved successfully.",
  "properties": {
    "systemProperties": {
      "java.version": "17.0.8",
      "os.name": "Linux"
    },
    "systemEnvironment": {
      "PATH": "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
      "JAVA_HOME": "/usr/lib/jvm/java-17-openjdk-amd64"
    }
  }
}
```

## Flyway (`flyway`)

### Description
Shows any available Flyway database migrations.

### Method
GET

### Endpoint
`/actuator/flyway`

### Response
#### Success Response (200)
- **message** (string) - A success message indicating Flyway migrations were retrieved.
- **flywayMigrations** (array) - A list of Flyway migration details.
  - **version** (string) - The migration version.
  - **description** - The migration description.
  - **type** (string) - The type of migration (e.g., JDBC, SPRING).
  - **state** (string) - The state of the migration (e.g., SUCCESS, PENDING).
  - **appliedDate** (datetime) - The date the migration was applied.
  - **checksum** (long) - The checksum of the migration script.

#### Response Example
```json
{
  "message": "Flyway migrations retrieved successfully.",
  "flywayMigrations": [
    {
      "version": "1",
      "description": "initial schema",
      "type": "JDBC",
      "state": "SUCCESS",
      "appliedDate": "2023-10-27T09:00:00Z",
      "checksum": 1234567890
    }
  ]
}
```

## Health (`health`)

### Description
Shows application health information.

### Method
GET

### Endpoint
`/actuator/health`

### Response
#### Success Response (200)
- **status** (string) - The overall health status of the application (e.g., "UP", "DOWN").
- **components** (object) - Detailed health status of individual components (e.g., "db", "diskSpace").
  - **componentName** (object) - Health status of a specific component.
    - **status** (string) - The status of the component (e.g., "UP", "DOWN").
    - **details** (object) - Specific details about the component's health.

#### Response Example
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "hello": "1"
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 53687091200,
        "free": 10737418240,
        "threshold": 10485760
      }
    }
  }
}
```

## Heap Dump (`heapdump`)

### Description
Returns a heap dump of the JVM.

### Method
GET

### Endpoint
`/actuator/heapdump`

### Response
#### Success Response (200)
- **Binary Data** - The heap dump in HPROF format.

#### Response Example
(Response is binary data, not a JSON object.)

## HTTP Exchanges (`httpexchanges`)

### Description
Shows the last recorded HTTP exchanges.

### Method
GET

### Endpoint
`/actuator/httpexchanges`

### Parameters
#### Query Parameters
- **max-requests** (integer) - Optional - The maximum number of HTTP exchanges to return.

### Response
#### Success Response (200)
- **message** (string) - A success message indicating the HTTP exchanges were retrieved.
- **exchanges** (array) - A list of recorded HTTP exchanges.
  - **request** (object) - Details of the request.
    - **method** (string) - The HTTP method.
    - **uri** (string) - The request URI.
    - **headers** (object) - Request headers.
  - **response** (object) - Details of the response.
    - **status** (integer) - The HTTP status code.
    - **headers** (object) - Response headers.
  - **timeTaken** (string) - The time taken for the exchange.

#### Response Example
```json
{
  "message": "HTTP exchanges retrieved successfully.",
  "exchanges": [
    {
      "request": {
        "method": "GET",
        "uri": "/api/users",
        "headers": {
          "Content-Type": "application/json"
        }
      },
      "response": {
        "status": 200,
        "headers": {
          "Content-Type": "application/json"
        }
      },
      "timeTaken": "50ms"
    }
  ]
}
```

## Info (`info`)

### Description
Shows arbitrary application information.

### Method
GET

### Endpoint
`/actuator/info`

### Response
#### Success Response (200)
- **message** (string) - A success message indicating info was retrieved.
- **build** (object) - Build information.
  - **version** (string) - The application version.
  - **artifact** (string) - The artifact name.
- **git** (object) - Git information.
  - **commit** (object) - Git commit details.
    - **id** (string) - The commit ID.
    - **user** (object) - Commit user details.
      - **name** (string) - The user's name.
    - **timestamp** (datetime) - The commit timestamp.

#### Response Example
```json
{
  "message": "Application info retrieved successfully.",
  "build": {
    "version": "1.0.0",
    "artifact": "my-app"
  },
  "git": {
    "commit": {
      "id": "a1b2c3d4e5f6",
      "user": {
        "name": "John Doe"
      },
      "timestamp": "2023-10-27T10:30:00Z"
    }
  }
}
```

## Spring Integration Graph (`integrationgraph`)

### Description
Shows the Spring Integration graph for the application.

### Method
GET

### Endpoint
`/actuator/integrationgraph`

### Response
#### Success Response (200)
- **message** (string) - A success message indicating the integration graph was retrieved.
- **graph** (object) - The Spring Integration graph representation.

#### Response Example
```json
{
  "message": "Spring Integration graph retrieved successfully.",
  "graph": {
    "nodes": [
      {
        "id": "inputChannel",
        "label": "Input Channel"
      }
    ],
    "edges": [
      {
        "source": "inputChannel",
        "target": "processorBean",
        "label": "to"
      }
    ]
  }
}
```

## Liquibase (`liquibase`)

### Description
Shows any available Liquibase database migrations.

### Method
GET

### Endpoint
`/actuator/liquibase`

### Response
#### Success Response (200)
- **message** (string) - A success message indicating Liquibase migrations were retrieved.
- **liquibaseMigrations** (array) - A list of Liquibase migration details.
  - **id** (string) - The migration ID.
  - **author** (string) - The author of the migration.
  - **changeSetName** (string) - The change set name.
  - **comment** (string) - The comment for the migration.
  - **dateExecuted** (datetime) - The date the migration was executed.
  - **orderExecuted** (integer) - The order in which the migration was executed.
  - **exceutionTimestamp** (datetime) - The timestamp of the execution.
  - **md5sum** (string) - The MD5 checksum of the migration.
  - **description** (string) - The description of the migration.
  - **tag** (string) - The tag associated with the migration.
  - **deploymentId** (string) - The deployment ID.
  - **objects** (array) - Objects affected by the migration.

#### Response Example
```json
{
  "message": "Liquibase migrations retrieved successfully.",
  "liquibaseMigrations": [
    {
      "id": "1",
      "author": "admin",
      "changeSetName": "my-changelog.xml::1::admin",
      "comment": "Create users table",
      "dateExecuted": "2023-10-27T09:00:00Z",
      "orderExecuted": 1,
      "executionTimestamp": "2023-10-27T09:05:00Z",
      "md5sum": "abcdef123456",
      "description": "Create users table",
      "tag": null,
      "deploymentId": "app-instance-1",
      "objects": [
        {
          "name": "users",
          "type": "TABLE"
        }
      ]
    }
  ]
}
```

## Log File (`logfile`)

### Description
Returns the contents of the application log file.

### Method
GET

### Endpoint
`/actuator/logfile`

### Response
#### Success Response (200)
- **Log Content** - The content of the application log file.

#### Response Example
(Response is plain text, not a JSON object.)
```
2023-10-27 10:00:00.123 INFO 12345 --- [main] com.example.MyApp : Application started successfully.
```

## Loggers (`loggers`)

### Description
Shows and modifies the loggers for the application.

### Method
GET / POST

### Endpoint
`/actuator/loggers`

### Response (GET)
#### Success Response (200)
- **message** (string) - A success message indicating the loggers were retrieved.
- **loggers** (object) - A map of logger names to their configuration.
  - **loggerName** (object) - Configuration for a specific logger.
    - **level** (string) - The current logging level (e.g., "INFO", "DEBUG").
    - **effectiveLevel** (string) - The effective logging level.
    - **configuredLevel** (string) - The configured logging level.

### Request Body (POST)
- **level** (string) - Required - The new logging level to set.

### Request Example (POST)
```json
{
  "level": "DEBUG"
}
```

### Response Example (GET)
```json
{
  "message": "Loggers retrieved successfully.",
  "loggers": {
    "org.springframework": {
      "level": "INFO",
      "effectiveLevel": "INFO",
      "configuredLevel": "INFO"
    },
    "com.example": {
      "level": "DEBUG",
      "effectiveLevel": "DEBUG",
      "configuredLevel": "DEBUG"
    }
  }
}
```

## Mappings (`mappings`)

### Description
Exposes information about all the `@RequestMapping` paths.

### Method
GET

### Endpoint
`/actuator/mappings`

### Response
#### Success Response (200)
- **message** (string) - A success message indicating the mappings were retrieved.
- **dispatcherServlets** (object) - A map of dispatcher servlets to their mappings.
  - **servletName** (object) - Mappings for a specific servlet.
    - **#root** (object) - Mappings grouped by HTTP method.
      - **method** (string) - The HTTP method.
      - **path** (string) - The request path.
      - **predicate** (string) - The predicate for the mapping.
      - **handler** (string) - The handler method.
      - **produces** (string) - The produces media type.

#### Response Example
```json
{
  "message": "Mappings retrieved successfully.",
  "dispatcherServlets": {
    "dispatcherServlet": {
      "GET": [
        {
          "method": "GET",
          "path": "/api/users/{id}",
          "predicate": "Path: [/api/users/{id}]",
          "handler": "com.example.UserController#getUser(Long)",
          "produces": "application/json"
        }
      ]
    }
  }
}
```

## Metrics (`metrics`)

### Description
Shows metrics for the application.

### Method
GET

### Endpoint
`/actuator/metrics`

### Parameters
#### Query Parameters
- **tag** (string) - Optional - Filter metrics by tags (e.g., `http.server.requests:uri=/api/users`).

### Response
#### Success Response (200)
- **message** (string) - A success message indicating the metrics were retrieved.
- **names** (array) - A list of available metric names.
- **availableTags** (array) - A list of available tags for filtering metrics.

#### Response Example
```json
{
  "message": "Metrics retrieved successfully.",
  "names": [
    "jvm.memory.used",
    "http.server.requests",
    "system.cpu.usage"
  ],
  "availableTags": [
    {
      "tag": "method",
      "values": ["GET", "POST"]
    },
    {
      "tag": "uri",
      "values": ["/api/users", "/api/items"]
    }
  ]
}
```

## Prometheus (`prometheus`)

### Description
Exposes metrics in Prometheus format.

### Method
GET

### Endpoint
`/actuator/prometheus`

### Response
#### Success Response (200)
- **Prometheus Metrics** - Metrics exposed in Prometheus text format.

#### Response Example
(Response is plain text in Prometheus format, not a JSON object.)
```prom
# HELP jvm_memory_used_bytes Used memory in bytes
# TYPE jvm_memory_used_bytes gauge
jvm_memory_used_bytes{area="heap"} 1.23456789E8
jvm_memory_used_bytes{area="nonheap"} 1.23456789E7
# HELP http_server_requests_seconds_count Number of HTTP server requests
# TYPE http_server_requests_seconds_count counter
http_server_requests_seconds_count{uri="/api/users",method="GET",status="200"} 100.0
```
```

--------------------------------

### Spring Boot Actuator HTTP Exchanges API

Source: https://docs.spring.io/spring-boot/upgrading

Exposes details about recent HTTP requests and responses.

```APIDOC
## GET /actuator/httpexchanges

### Description
Provides a list of recent HTTP request and response exchanges handled by the application, useful for debugging.

### Method
GET

### Endpoint
/actuator/httpexchanges

### Parameters
N/A

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **httpexchanges** (array) - A list of HTTP exchange objects.
  - **request** (object) - Details of the HTTP request.
    - **method** (string) - The HTTP method.
    - **uri** (string) - The request URI.
    - **headers** (object) - Request headers.
  - **response** (object) - Details of the HTTP response.
    - **status** (integer) - The HTTP status code.
    - **headers** (object) - Response headers.
  - **timeTaken** (string) - The time taken for the exchange.

#### Response Example
```json
{
  "example": "{\"httpexchanges\": [{\"request\": {\"method\": \"GET\", \"uri\": \"/api/users\", \"headers\": {\"Content-Type\": \"application/json\"}}, \"response\": {\"status\": 200, \"headers\": {\"Content-Type\": \"application/json\"}}, \"timeTaken\": \"50ms\"}]}"
}
```
```

--------------------------------

### Actuator - Audit Events (`auditevents`)

Source: https://docs.spring.io/spring-boot/reference/using/structuring-your-code

Provides information about audit events within the Spring Boot application. It's an endpoint to monitor security-related events.

```APIDOC
## GET /actuator/auditevents

### Description
Retrieves audit events from the application. This endpoint allows you to monitor security-related events and activities within your Spring Boot application.

### Method
GET

### Endpoint
/actuator/auditevents

### Parameters
#### Query Parameters
- **after** (timestamp) - Optional - Filters audit events that occurred after the provided timestamp.
- **principal** (string) - Optional - Filters audit events by the principal (user) associated with the event.

### Request Example
N/A (GET request)

### Response
#### Success Response (200)
- **events** (array) - An array of audit event objects.
  - **timestamp** (timestamp) - The timestamp of the audit event.
  - **principal** (string) - The principal (user) associated with the event.
  - **type** (string) - The type of audit event.
  - **data** (object) - Additional data associated with the audit event.

#### Response Example
```json
{
  "events": [
    {
      "timestamp": "2024-01-01T12:00:00.000Z",
      "principal": "user1",
      "type": "AUTHENTICATION_SUCCESS",
      "data": {
        "details": "..."
      }
    }
  ]
}
```
```

--------------------------------

### Asserting JSON Numbers with Offset (Kotlin)

Source: https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications

Demonstrates asserting JSON number values using JacksonTester and AssertJ's `satisfies` in Kotlin, addressing potential floating-point inaccuracies. This approach uses `isCloseTo` for comparisons, suitable for standard unit tests with Spring Boot testing and AssertJ dependencies.

```kotlin
	@Test
	sunTest() {
		val value = SomeObject(0.152f)
		assertThat(json.write(value)).extractingJsonPathNumberValue("@.test.numberValue")
			.satisfies(ThrowingConsumer { number ->
				assertThat(number.toFloat()).isCloseTo(0.15f, within(0.01f))
			})
	}

```

--------------------------------

### Asserting JSON Numbers with Offset (Java)

Source: https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications

Shows how to use JacksonTester with AssertJ's `satisfies` method in Java to assert number values extracted via JSON path, especially when dealing with floating-point precision. This is useful when `isEqualTo` might fail due to small differences. Requires Spring Boot testing and AssertJ.

```java
	@Test
	someTest() throws Exception {
		SomeObject value = new SomeObject(0.152f);
		assertThat(this.json.write(value)).extractingJsonPathNumberValue("@.test.numberValue")
			.satisfies((number) -> assertThat(number.floatValue()).isCloseTo(0.15f, within(0.01f)));
	}

```

--------------------------------

### Actuator Audit Events API

Source: https://docs.spring.io/spring-boot/specification/configuration-metadata/manual-hints

Provides access to audit events recorded by Spring Boot Actuator.

```APIDOC
## GET /actuator/auditevents

### Description
Retrieves a list of audit events.

### Method
GET

### Endpoint
/actuator/auditevents

### Parameters
#### Query Parameters
- **principal** (string) - Optional - Filter events by principal.
- **type** (string) - Optional - Filter events by type.
- **after** (datetime) - Optional - Filter events after a specific timestamp.
- **before** (datetime) - Optional - Filter events before a specific timestamp.
- **sort** (string) - Optional - Sort order for events.

### Response
#### Success Response (200)
- **auditEvents** (array) - List of audit events.
  - **timestamp** (datetime) - The time the event occurred.
  - **principal** (string) - The user or system that performed the action.
  - **type** (string) - The type of audit event.
  - **data** (object) - Additional data related to the event.

#### Response Example
{
  "auditEvents": [
    {
      "timestamp": "2023-10-27T10:00:00Z",
      "principal": "user1",
      "type": "LOGIN",
      "data": {
        "sessionId": "abc123"
      }
    }
  ]
}
```

--------------------------------

### Customizing Access Rules for Static Resources

Source: https://docs.spring.io/spring-boot/reference/web/spring-security

This code shows how to override access rules for static resources using Spring Boot's convenience methods. It involves creating a custom SecurityFilterChain and using PathRequest to match resources in common locations.

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.PathRequest;

@Configuration
public class StaticResourceSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(authz -> authz
            .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
            .anyRequest().authenticated()
        );
        return http.build();
    }
}
```

--------------------------------

### Spring Boot Actuator Health API

Source: https://docs.spring.io/spring-boot/upgrading

Provides health information about the application and its components.

```APIDOC
## GET /actuator/health

### Description
Returns the overall health of the application, including the status of individual components like the database or disk space.

### Method
GET

### Endpoint
/actuator/health

### Parameters
N/A

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **status** (string) - The overall health status (e.g., UP, DOWN).
- **components** (object) - An object detailing the health of individual components.
  - **componentName** (object)
    - **status** (string) - The status of the component (e.g., UP, DOWN).
    - **details** (object) - Additional details about the component's health (optional).

#### Response Example
```json
{
  "example": "{\"status\": \"UP\", \"components\": {\"db\": {\"status\": \"UP\", \"details\": {\"database\": \"PostgreSQL\", \"hello\": 1}}}"
}
```
```

--------------------------------

### Spring Boot Actuator Loggers API

Source: https://docs.spring.io/spring-boot/upgrading

Provides access to and control over application loggers.

```APIDOC
## GET /actuator/loggers

### Description
Lists all configured loggers and their current levels. You can also use this endpoint to change the log level of a specific logger.

### Method
GET, POST

### Endpoint
/actuator/loggers

### Parameters
#### POST Parameters (Request Body)
- **configuredLevel** (string) - Optional - The new log level to set (e.g., DEBUG, INFO, WARN, ERROR).

### Request Example (GET)
```json
{
  "example": ""
}
```

### Request Example (POST)
```json
{
  "example": "{\"configuredLevel\": \"DEBUG\"}"
}
```

### Response
#### Success Response (200)
- **levels** (object) - An object where keys are logger names and values contain information about their levels.
  - **[loggerName]** (object)
    - **effectiveLevel** (string) - The currently effective log level.
    - **configuredLevel** (string) - The configured log level.

#### Response Example (GET)
```json
{
  "example": "{\"levels\": {\"ROOT\": {\"effectiveLevel\": \"INFO\", \"configuredLevel\": \"INFO\"}, \"com.example\": {\"effectiveLevel\": \"DEBUG\", \"configuredLevel\": \"DEBUG\"}}}"
}
```

#### Response Example (POST)
```json
{
  "example": "{\"message\": \"Logger level changed successfully.\"}"
}
```
```

--------------------------------

### Spring Boot Actuator Audit Events API

Source: https://docs.spring.io/spring-boot/upgrading

Provides access to audit events recorded by the application.

```APIDOC
## GET /actuator/auditevents

### Description
Retrieves a list of audit events recorded by the application.

### Method
GET

### Endpoint
/actuator/auditevents

### Parameters
#### Query Parameters
- **principal** (string) - Optional - Filter events by principal.
- **type** (string) - Optional - Filter events by type.
- **tag** (string) - Optional - Filter events by tag.

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **auditEvents** (array) - A list of audit event objects.
  - **timestamp** (string) - The time the event occurred.
  - **type** (string) - The type of the event.
  - **principal** (object) - Information about the principal who triggered the event.
  - **tags** (object) - Additional tags associated with the event.

#### Response Example
```json
{
  "example": "{\"auditEvents\": [{\"timestamp\": \"2023-10-27T10:00:00Z\", \"type\": \"AUTHENTICATION_SUCCESS\", \"principal\": {\"name\": \"user1\"}, \"tags\": {\"remoteAddress\": \"192.168.1.1\"}}]}"
}
```
```

--------------------------------

### Disabling UserDetailsService Configuration in Spring Boot

Source: https://docs.spring.io/spring-boot/reference/web/spring-security

To also disable the UserDetailsService configuration alongside the web security configuration, a bean of type UserDetailsService, AuthenticationProvider, or AuthenticationManager needs to be provided.

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;

@Configuration
public class CustomUserDetailsServiceConfig {

    @Bean
    public UserDetailsService userDetailsService() {
        // Provide a custom UserDetailsService or return null to disable
        // Example: Returning null to disable default UserDetailsService
        return null;
    }
}
```

--------------------------------

### Disabling Default Spring Boot Web Security Configuration

Source: https://docs.spring.io/spring-boot/reference/web/spring-security

This snippet illustrates how to disable the default web application security configuration in Spring Boot by providing a custom bean of type 'SecurityFilterChain'. This method does not disable the UserDetailsService configuration.

```~~java~~
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Configure security here or return a default chain to disable auto-configuration
        http.authorizeHttpRequests(authz -> authz.anyRequest().permitAll()); // Example: Allow all
        return http.build();
    }
}
```