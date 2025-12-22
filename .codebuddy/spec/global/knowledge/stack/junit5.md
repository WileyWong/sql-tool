### Pattern Matching Examples for Configuration Parameters

Source: https://docs.junit.org/current/user-guide/index

Provides examples of pattern matching syntax used with JUnit Platform configuration parameters. These patterns are applied to fully qualified class names (FQCN) for features like deactivating conditions or filtering extensions. The syntax allows for wildcard matching and specific class name matching.

```text
*
org.junit.*
*.MyCustomImpl
*System*
*System*, *Unit*
org.example.MyCustomImpl
org.example.MyCustomImpl, org.example.TheirCustomImpl
```

--------------------------------

### JUnit Platform Pattern Matching Syntax Examples

Source: https://docs.junit.org/current/user-guide

Provides examples of the pattern matching syntax used for JUnit Platform configuration parameters. This syntax is applied to features like deactivating conditions, listeners, and filtering extensions.

```plaintext
# Matches all candidate classes.
*

# Matches all candidate classes under the org.junit base package and its subpackages.
org.junit.*

# Matches every candidate class whose simple class name is exactly MyCustomImpl.
*.MyCustomImpl

# Matches every candidate class whose FQCN contains System.
*System*

# Matches every candidate class whose FQCN contains System or Unit.
*System*, *Unit*

# Matches the candidate class whose FQCN is exactly org.example.MyCustomImpl.
org.example.MyCustomImpl

# Matches candidate classes whose FQCN is exactly org.example.MyCustomImpl or org.example.TheirCustomImpl.
org.example.MyCustomImpl, org.example.TheirCustomImpl
```

--------------------------------

### Composed Annotation using @BeforeAll in Java

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/BeforeAll

This example shows how @BeforeAll can be used as a meta-annotation to create a custom composed annotation in Java. This allows for reusable test setup configurations by inheriting the semantics of @BeforeAll.

```java
import org.junit.jupiter.api.BeforeAll;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@BeforeAll
public @interface MyCustomBeforeAll {
    // Inherits all semantics from @BeforeAll
}
```

--------------------------------

### Get Started Events - Java

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Events

Filters and returns a new `Events` object containing only the events that represent the start of a test execution. This method is useful for tracking the initiation of tests. The returned `Events` object is guaranteed not to be null.

```java
public Events started()
Get the started `Events` contained in this `Events` object.

Returns:
    the filtered `Events`; never `null`
```

--------------------------------

### JUnit 5: Get Started Events Stream

Source: https://docs.junit.org/current/api/index-files/index-19

Retrieves a `Stream` of `Events` objects that have a `STARTED` status. This allows for functional-style processing of started events.

```java
Events.started().stream()
```

--------------------------------

### Get Started Executions - Java

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Executions

Retrieves all started executions from the current Executions object. This represents tests that have begun execution.

```java
Executions started()
```

--------------------------------

### Get Containers Started Count (Java) - org.junit.platform.launcher.listeners.TestExecutionSummary

Source: https://docs.junit.org/current/api/index-files/index-7

Gets the number of containers that were started during test execution. This is a count provided by the test execution summary.

```Java
long org.junit.platform.launcher.listeners.TestExecutionSummary.getContainersStartedCount()
```

--------------------------------

### Java @BeforeEach Annotation Example

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/BeforeEach

Demonstrates the usage of the @BeforeEach annotation in JUnit 5 for setup methods executed before each test. Methods annotated with @BeforeEach must have a void return type and cannot be static. They can optionally accept parameters resolved by ParameterResolvers.

```java
import org.junit.jupiter.api.BeforeEach;

public class ExampleTest {

    @BeforeEach
    void setUp() {
        System.out.println("Setting up before each test...");
        // Initialize test resources here
    }

    @Test
    void testSomething() {
        // Test logic
        System.out.println("Running testSomething...");
    }

    @Test
    void anotherTest() {
        // Another test logic
        System.out.println("Running anotherTest...");
    }
}
```

--------------------------------

### JUnit 5: Get Started Executions Stream

Source: https://docs.junit.org/current/api/index-files/index-19

Retrieves a `Stream` of `Executions` objects that have a `STARTED` status. This enables stream-based operations on started test executions.

```java
Executions.started().stream()
```

--------------------------------

### Get Started Events in Java

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Events

Retrieves a new `Events` object containing only the events that signify the start of a test or test execution phase. This is useful for focusing on the initiation of test activities.

```java
import org.junit.platform.testkit.engine.Events;

// Assuming 'events' is an instance of Events
Events startedEvents = events.started();
```

--------------------------------

### Get Started Executions (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/class-use/Executions

Retrieves the started `Executions` from an `Executions` object. This method is used to track the initiation of test executions within the JUnit Platform.

```java
Executions.started()
```

--------------------------------

### Get Started Events with JUnit Platform Test Kit

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/class-use/Events

Retrieves all started events contained within an Events object. This marks the beginning of test execution phases.

```java
Events.started()
```

--------------------------------

### VintageTestEngine Constructor

Source: https://docs.junit.org/current/api/org.junit.vintage.engine/org/junit/vintage/engine/VintageTestEngine

Initializes a new instance of the VintageTestEngine.

```APIDOC
## POST /constructor/VintageTestEngine

### Description
Initializes a new instance of the VintageTestEngine.

### Method
POST

### Endpoint
/constructor/VintageTestEngine

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "example": "No request body needed for constructor"
}
```

### Response
#### Success Response (200)
- **instance** (VintageTestEngine) - A new instance of VintageTestEngine.

#### Response Example
```json
{
  "example": "Instance of VintageTestEngine created successfully"
}
```
```

--------------------------------

### JUnit Platform Suite Annotation Example

Source: https://docs.junit.org/current/user-guide/index

Demonstrates how to annotate a class with @Suite to mark it as a test suite. It includes examples of selector and filter annotations like @SelectPackages and @IncludeClassNamePatterns to control the suite's contents. This requires the JUnit Platform Suite API.

```java
import org.junit.platform.suite.api.IncludeClassNamePatterns;
import org.junit.platform.suite.api.SelectPackages;
import org.junit.platform.suite.api.Suite;
import org.junit.platform.suite.api.SuiteDisplayName;

@Suite
@SuiteDisplayName("JUnit Platform Suite Demo")
@SelectPackages("example")
@IncludeClassNamePatterns(".*Tests")
class SuiteDemo {
}
```

--------------------------------

### SuiteLauncherDiscoveryRequestBuilder DSL Example

Source: https://docs.junit.org/current/api/index-files/index-19

Demonstrates the usage of `SuiteLauncherDiscoveryRequestBuilder` for creating a `LauncherDiscoveryRequest` tailored for suite execution. This builder provides a Domain Specific Language (DSL) for this purpose.

```java
LauncherDiscoveryRequest request = SuiteLauncherDiscoveryRequestBuilder.requestForSuite(MySuiteClass.class);
```

--------------------------------

### SuiteTestEngine Constructor

Source: https://docs.junit.org/current/api/org.junit.platform.suite.engine/org/junit/platform/suite/engine/SuiteTestEngine

Initializes a new instance of the SuiteTestEngine. This constructor is part of the core setup for the test engine.

```java
public SuiteTestEngine()
```

--------------------------------

### Get Started Executions in Java

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Executions

Filters and returns only the executions that have been started. This method is useful for tracking the progress of executions. It guarantees to return a non-null Executions object.

```java
public Executions started()
Get the started `Executions` contained in this `Executions` object.

Returns:
    the filtered `Executions`; never `null`
```

--------------------------------

### Implement Global Setup/Teardown with JUnit LauncherSessionListener in Java

Source: https://docs.junit.org/current/user-guide/index

This Java code defines a LauncherSessionListener that initializes an HTTP server before the first test execution and ensures it's stopped when the launcher session closes. It leverages the JUnit Platform's store mechanism for lazy initialization and resource management. Dependencies include JUnit Platform API and JDK's http.server module.

```java
package example.session;

import static java.net.InetAddress.getLoopbackAddress;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.InetSocketAddress;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.sun.net.httpserver.HttpServer;

import org.junit.platform.engine.support.store.Namespace;
import org.junit.platform.engine.support.store.NamespacedHierarchicalStore;
import org.junit.platform.launcher.LauncherSession;
import org.junit.platform.launcher.LauncherSessionListener;
import org.junit.platform.launcher.TestExecutionListener;
import org.junit.platform.launcher.TestPlan;

public class GlobalSetupTeardownListener implements LauncherSessionListener {

    @Override
    public void launcherSessionOpened(LauncherSession session) {
        // Avoid setup for test discovery by delaying it until tests are about to be executed
        session.getLauncher().registerTestExecutionListeners(new TestExecutionListener() {
            @Override
            public void testPlanExecutionStarted(TestPlan testPlan) {
                NamespacedHierarchicalStore<Namespace> store = session.getStore(); 
                store.getOrComputeIfAbsent(Namespace.GLOBAL, "httpServer", key -> {
                    InetSocketAddress address = new InetSocketAddress(getLoopbackAddress(), 0);
                    HttpServer server;
                    try {
                        server = HttpServer.create(address, 0);
                    }
                    catch (IOException e) {
                        throw new UncheckedIOException("Failed to start HTTP server", e);
                    }
                    server.createContext("/test", exchange -> {
                        exchange.sendResponseHeaders(204, -1);
                        exchange.close();
                    });
                    ExecutorService executorService = Executors.newCachedThreadPool();
                    server.setExecutor(executorService);
                    server.start(); 

                    return new CloseableHttpServer(server, executorService);
                });
            }
        });
    }

}
```

--------------------------------

### Open JUnit Launcher Session

Source: https://docs.junit.org/current/api/index-files/index-15

Factory method for opening a new `LauncherSession`. It can use the default configuration or a custom `LauncherConfig` for detailed setup.

```java
LauncherFactory.openSession()
```

```java
LauncherFactory.openSession(LauncherConfig launcherConfig)
```

--------------------------------

### Implement Global HTTP Server Setup/Teardown with LauncherSessionListener (Java)

Source: https://docs.junit.org/current/user-guide

This Java code defines a custom LauncherSessionListener that starts an HTTP server before the first test execution and stops it after the last test in a launcher session. It leverages the JUnit Platform's store mechanism to lazily initialize and manage the server lifecycle. Dependencies include JUnit Platform API and JDK's built-in HTTP server. The listener is registered via a service file.

```java
package example.session;

import static java.net.InetAddress.getLoopbackAddress;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.InetSocketAddress;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.sun.net.httpserver.HttpServer;

import org.junit.platform.engine.support.store.Namespace;
import org.junit.platform.engine.support.store.NamespacedHierarchicalStore;
import org.junit.platform.launcher.LauncherSession;
import org.junit.platform.launcher.LauncherSessionListener;
import org.junit.platform.launcher.TestExecutionListener;
import org.junit.platform.launcher.TestPlan;

public class GlobalSetupTeardownListener implements LauncherSessionListener {

    @Override
    public void launcherSessionOpened(LauncherSession session) {
        // Avoid setup for test discovery by delaying it until tests are about to be executed
        session.getLauncher().registerTestExecutionListeners(new TestExecutionListener() {
            @Override
            public void testPlanExecutionStarted(TestPlan testPlan) {
                NamespacedHierarchicalStore<Namespace> store = session.getStore(); 
                store.getOrComputeIfAbsent(Namespace.GLOBAL, "httpServer", key -> { 
                    InetSocketAddress address = new InetSocketAddress(getLoopbackAddress(), 0);
                    HttpServer server;
                    try {
                        server = HttpServer.create(address, 0);
                    }
                    catch (IOException e) {
                        throw new UncheckedIOException("Failed to start HTTP server", e);
                    }
                    server.createContext("/test", exchange -> {
                        exchange.sendResponseHeaders(204, -1);
                        exchange.close();
                    });
                    ExecutorService executorService = Executors.newCachedThreadPool();
                    server.setExecutor(executorService);
                    server.start(); 

                    return new CloseableHttpServer(server, executorService);
                });
            }
        });
    }

}

```

--------------------------------

### Retrieve Start Instant from Execution (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Execution

Gets the `Instant` at which the test execution started. This method is part of the execution metadata and helps in calculating the duration and analyzing the timing of test runs.

```java
public Instant getStartInstant()
{
    // Implementation details...
    return null;
}
```

--------------------------------

### Launcher Discovery and Execution

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/package-use

Details on how to use the `Launcher` to discover and execute tests, involving requests and listeners.

```APIDOC
## API Operations: Test Discovery and Execution

### Description
This section covers the core operations of discovering and executing tests using the `Launcher` API, including the use of requests and listeners.

### Methods

*   **Discover Tests**: `Launcher.discover(LauncherDiscoveryRequest request)`
*   **Execute Tests**: `Launcher.execute(LauncherDiscoveryRequest request)` or `Launcher.execute(TestPlan testPlan)`

### Endpoint
N/A (Java API)

### Parameters

#### `LauncherDiscoveryRequest` Parameters

*   **Engine Filters**: (`EngineFilter`) - Optional - Filters to apply to `TestEngines` before discovery.
*   **Post Discovery Filters**: (`PostDiscoveryFilter`) - Optional - Filters to apply to `TestDescriptors` after discovery.
*   **Listeners**: (`TestExecutionListener`, `LauncherDiscoveryListener`, etc.) - Optional - Listeners to register for events during discovery and execution.

### Request Example
(Illustrative Java code for setting up a request and executing)
```java
Launcher launcher = LauncherFactory.create();

LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder.request()
    .selectors(...) // Configure selectors (e.g., ClassSelector, MethodSelector)
    .filters(...) // Configure filters
    .listeners(...)
    .build();

TestPlan testPlan = launcher.discover(request);
launcher.execute(testPlan);
```

### Response

#### Success Response

*   **`discover()`**: Returns a `TestPlan` object representing the discovered tests.
*   **`execute()`**: Executes the tests. Results are reported via registered `TestExecutionListener` implementations.

#### Response Example
(Illustrative Java code showing listener callback)
```java
launcher.execute(testPlan, new TestExecutionListener() {
    @Override
    public void executionStarted(TestIdentifier testIdentifier) {
        System.out.println("Started: " + testIdentifier.getDisplayName());
    }

    @Override
    public void executionFinished(TestIdentifier testIdentifier, TestExecutionResult result) {
        System.out.println("Finished: " + testIdentifier.getDisplayName() + " - Result: " + result.getStatus());
    }
});
```
```

--------------------------------

### Launcher API Overview

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/module-summary

This section outlines the main packages, modules, and services provided by the JUnit Platform Launcher API.

```APIDOC
## JUnit Platform Launcher API

### Description
Public API for configuring and launching test plans. This API is typically used by IDEs and build tools.

### Packages
**Exports:**
- `org.junit.platform.launcher`: Public API for configuring and launching test plans.
- `org.junit.platform.launcher.core`: Core support classes for the `Launcher` including the `LauncherFactory` and the `LauncherDiscoveryRequestBuilder`.
- `org.junit.platform.launcher.listeners`: Common `TestExecutionListener` implementations and related support classes for the `Launcher`.
- `org.junit.platform.launcher.listeners.discovery`: Common `LauncherDiscoveryListener` implementations and factory methods.

### Modules
**Requires:**
- `org.junit.platform.commons` (transitive): Common APIs and support utilities for the JUnit Platform.
- `org.junit.platform.engine` (transitive): Public API for test engines.

### Services
**Uses:**
- `LauncherDiscoveryListener`: Listener for test discovery events.
- `LauncherInterceptor`: Interceptor for test discovery and execution.
- `LauncherSessionListener`: Listener for `LauncherSession` lifecycle events.
- `PostDiscoveryFilter`: Filter applied after test discovery.
- `TestEngine`: Facilitates discovery and execution of tests.
- `TestExecutionListener`: Listener for test execution events.
```

--------------------------------

### LauncherDiscoveryListener Interface Methods

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/LauncherDiscoveryListener

This snippet shows the core methods of the LauncherDiscoveryListener interface, including default implementations for starting and finishing launcher and engine discovery. These methods allow observation of the test discovery lifecycle.

```java
/**
 * Called when test discovery is about to be started.
 *
 * @param request the request for which discovery is being started
 */
default void launcherDiscoveryStarted(LauncherDiscoveryRequest request) {
    // Default implementation
}

/**
 * Called when test discovery has finished.
 *
 * @param request the request for which discovery has finished
 */
default void launcherDiscoveryFinished(LauncherDiscoveryRequest request) {
    // Default implementation
}

/**
 * Called when test discovery is about to be started for an engine.
 *
 * @param engineId the unique ID of the engine descriptor
 */
default void engineDiscoveryStarted(UniqueId engineId) {
    // Default implementation
}

/**
 * Called when test discovery has finished for an engine.
 * Exceptions thrown by implementations of this method will cause the complete test discovery to be aborted.
 *
 * @param engineId the unique ID of the engine descriptor
 * @param result the discovery result of the supplied engine
 */
default void engineDiscoveryFinished(UniqueId engineId, EngineDiscoveryResult result) {
    // Default implementation
}
```

--------------------------------

### TestInstancePostProcessor Interface for Post-Instantiation Logic

Source: https://docs.junit.org/current/api/index-files/index-20

The `TestInstancePostProcessor` interface allows extensions to perform actions after a test instance has been created but before it is used. This is useful for performing setup or modifications on the test object.

```java
package org.junit.jupiter.api.extension;

import org.junit.jupiter.api.extension.ExtensionContext;

/**
 * {@code TestInstancePostProcessor} defines the API for {@code Extensions} that wish to _post-process_ test instances.
 */
public interface TestInstancePostProcessor {
    /**
     * Post-process the supplied {@link TestInstance} for the supplied {@link ExtensionContext}.
     *
     * @param testInstance the test instance to post-process
     * @param context the current {@code ExtensionContext}
     * @throws Exception if post-processing fails
     */
    void postProcessTestInstance(Object testInstance, ExtensionContext context) throws Exception;
}
```

--------------------------------

### Initialize LauncherDiscoveryRequestBuilder (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherDiscoveryRequestBuilder

Creates a new instance of the LauncherDiscoveryRequestBuilder. This is the starting point for building a discovery request. It is deprecated and suggests using the `request()` method instead.

```Java
@API(status=DEPRECATED, since="1.8")
@Deprecated
public LauncherDiscoveryRequestBuilder()
```

```Java
public static LauncherDiscoveryRequestBuilder request()
```

--------------------------------

### Launch JUnit Tests from Console using Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/ConsoleLauncher

The `main` method in `ConsoleLauncher` is the entry point for running JUnit tests from the command line. It accepts string arguments to configure and execute the test suite.

```java
public static void main(String... args)
```

--------------------------------

### HttpServer Resource Implementation with AutoCloseable

Source: https://docs.junit.org/current/user-guide/index

This Java code defines a HttpServerResource that implements the AutoCloseable interface. It sets up an HTTP server with an example handler and provides a start method to begin the server and a close method to stop it. This allows for proper resource management within JUnit extensions.

```java
class HttpServerResource implements AutoCloseable {

    private final HttpServer httpServer;

    HttpServerResource(int port) throws IOException {
        InetAddress loopbackAddress = InetAddress.getLoopbackAddress();
        this.httpServer = HttpServer.create(new InetSocketAddress(loopbackAddress, port), 0);
    }

    HttpServer getHttpServer() {
        return httpServer;
    }

    void start() {
        // Example handler
        httpServer.createContext("/example", exchange -> {
            String body = "This is a test";
            exchange.sendResponseHeaders(200, body.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(body.getBytes(UTF_8));
            }
        });
        httpServer.setExecutor(null);
        httpServer.start();
    }

    @Override
    public void close() {
        httpServer.stop(0);
    }
}
```

--------------------------------

### Get Test Execution Timestamps - JUnit Platform Launcher

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the timestamps indicating when the test plan started and finished. These timestamps are in milliseconds and are useful for performance analysis and logging.

```java
/**
 * Get the timestamp (in milliseconds) when the test plan finished.
 */
long getTimeFinished();

/**
 * Get the timestamp (in milliseconds) when the test plan started.
 */
long getTimeStarted();
```

--------------------------------

### Execute JUnit Tests with Listeners and Summary

Source: https://docs.junit.org/current/user-guide/index

This code demonstrates how to execute JUnit tests using the Launcher API. It sets up a discovery request, registers a `SummaryGeneratingListener` to capture test execution details, and then executes the tests. The summary of the test execution can be retrieved from the listener afterwards. It utilizes `LauncherDiscoveryRequest`, `SummaryGeneratingListener`, `LauncherSession`, and `TestPlan`.

```java
LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder.request()
    .selectors(
        selectPackage("com.example.mytests"),
        selectClass(MyTestClass.class)
    )
    .filters(
        includeClassNamePatterns(".*Tests")
    )
    .build();

SummaryGeneratingListener listener = new SummaryGeneratingListener();

try (LauncherSession session = LauncherFactory.openSession()) {
    Launcher launcher = session.getLauncher();
    // Register a listener of your choice
    launcher.registerTestExecutionListeners(listener);
    // Discover tests and build a test plan
    TestPlan testPlan = launcher.discover(request);
    // Execute test plan
    launcher.execute(testPlan);
    // Alternatively, execute the request directly
    launcher.execute(request);
}

TestExecutionSummary summary = listener.getSummary();
// Do something with the summary...
```

--------------------------------

### Create New SuiteLauncherDiscoveryRequestBuilder

Source: https://docs.junit.org/current/api/org.junit.platform.suite.commons/org/junit/platform/suite/commons/SuiteLauncherDiscoveryRequestBuilder

Initiates the creation of a new SuiteLauncherDiscoveryRequestBuilder. This is the starting point for configuring test discovery requests.

```java
public static SuiteLauncherDiscoveryRequestBuilder request()

```

--------------------------------

### Console Launcher Help and Commands

Source: https://docs.junit.org/current/user-guide/index

Displays the usage information and available commands for the JUnit Console Launcher. This includes options for help, version, disabling ANSI colors, and subcommands like `discover`, `execute`, and `engines`.

```bash
Usage: junit [OPTIONS] [COMMAND]
Launches the JUnit Platform for test discovery and execution.
      [@<filename>...]   One or more argument files containing options.
  -h, --help             Display help information.
      --version          Display version information.
      --disable-ansi-colors
                         Disable ANSI colors in output (not supported by all terminals).
Commands:
  discover  Discover tests
  execute   Execute tests
  engines   List available test engines

For more information, please refer to the JUnit User Guide at
https://docs.junit.org/1.13.4/user-guide/
```

--------------------------------

### Get EngineDiscoveryRequest from InitializationContext (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/class-use/EngineDiscoveryRequest

This Java code retrieves an EngineDiscoveryRequest from an InitializationContext, typically used during the setup phase of test discovery.

```java
EngineDiscoveryRequest EngineDiscoveryRequestResolver.InitializationContext.getDiscoveryRequest()
```

--------------------------------

### Create Launcher Instance with Factory

Source: https://docs.junit.org/current/api/index-files/index-12

Demonstrates how to create Launcher instances using the LauncherFactory. This involves either a default creation or providing a custom LauncherConfig.

```java
Launcher launcher = LauncherFactory.create();

// Or with custom configuration
LauncherConfig config = LauncherConfig.builder().build();
Launcher customLauncher = LauncherFactory.create(config);
```

--------------------------------

### Configure JUnit Platform via Console Launcher (Command Line)

Source: https://docs.junit.org/current/user-guide

Illustrates how to specify configuration parameters when running tests using the JUnit Platform's Console Launcher. The `--config` option allows passing key-value pairs directly from the command line, overriding other configuration sources.

```bash
# Example: Setting a configuration parameter for JUnit Jupiter engine
java -jar junit-platform-console-standalone.jar \
  --select-package com.example.tests \
  --config "junit.jupiter.conditions.deactivate=*System*"

# Example: Setting multiple configuration parameters
java -jar junit-platform-console-standalone.jar \
  --select-package com.example.tests \
  --config "junit.jupiter.engine.extension.autodetetection.enabled=true" \
  --config "junit.jupiter.displayname.generator.default=org.junit.jupiter.api.DisplayNameGenerator.Simple"
```

--------------------------------

### Implementing BeforeTestExecutionCallback (Java Example)

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/extension/BeforeTestExecutionCallback

This is a conceptual example of how to implement the BeforeTestExecutionCallback interface in Java. It demonstrates overriding the `beforeTestExecution` method to add custom logic before a test runs.

```java
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.BeforeTestExecutionCallback;

public class MyTestExecutionCallback implements BeforeTestExecutionCallback {

    @Override
    public void beforeTestExecution(ExtensionContext context) throws Exception {
        // Add custom logic here that should run immediately before a test method is executed.
        System.out.println("About to execute test: " + context.getDisplayName());
        // You can access test method details, class details, etc. from the context.
        // For example: context.getRequiredTestMethod().getName()
    }
}
```

--------------------------------

### Get Event Type

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Event

Retrieves the `EventType` of this `Event`. The `EventType` indicates the nature of the event, such as execution start, finish, or skip. Requires JUnit 5.4+.

```java
@API(status=MAINTAINED, since="1.4")
public EventType getType() {
    // Implementation details not provided in the source text
    return null;
}
```

--------------------------------

### Get Event Type (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Event

Retrieves the type of an Event. This method returns the specific type of the event, such as STARTED, FINISHED, or SKIPPED. The return value is never null.

```java
public EventType getType()
```

--------------------------------

### Get Root TestDescriptor from ExecutionRequest

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/class-use/TestDescriptor

The ExecutionRequest class in the JUnit Platform provides a method to retrieve the root TestDescriptor. This descriptor represents the starting point for the engine that processes the execution request.

```java
TestDescriptor ExecutionRequest.getRootTestDescriptor()
```

--------------------------------

### JUnit Platform @BeforeSuite and @AfterSuite Example

Source: https://docs.junit.org/current/user-guide/index

Shows how to use @BeforeSuite and @AfterSuite annotations on methods within a @Suite-annotated class. These methods execute once before and after all tests in the suite, respectively. This requires the JUnit Platform Suite API.

```java
@Suite
@SelectPackages("example")
class BeforeAndAfterSuiteDemo {

    @BeforeSuite
    static void beforeSuite() {
        // executes before the test suite
    }

    @AfterSuite
    static void afterSuite() {
        // executes after the test suite
    }

}
```

--------------------------------

### Composed Annotation Example in Java

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/ParameterizedClass

Illustrates how to create a custom composed annotation that inherits the semantics of @ParameterizedClass. This allows for creating reusable configurations for parameterized tests, simplifying test setup.

```java
import org.junit.jupiter.params.ParameterizedClass;
import org.junit.jupiter.params.provider.CsvSource;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@ParameterizedClass
@CsvSource({"1,one", "2,two", "3,three"})
public @interface MyCsvParameterizedTest {
}

@MyCsvParameterizedTest
public class ComposedAnnotationTest {

    @org.junit.jupiter.params.ParameterizedTest
    void testWithComposedAnnotation(int number, String text) {
        System.out.println("Number: " + number + ", Text: " + text);
        // Assertions
    }
}
```

--------------------------------

### GET /configuration/parameters/keys

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/config/PrefixedConfigurationParameters

Gets the keys of all configuration parameters stored in this ConfigurationParameters instance.

```APIDOC
## GET /configuration/parameters/keys

### Description
Get the keys of all configuration parameters stored in this `ConfigurationParameters`.

### Method
GET

### Endpoint
`/configuration/parameters/keys`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
(No request body needed for this GET request)

### Response
#### Success Response (200)
- **keys** (Set<String>) - The set of keys contained in this `ConfigurationParameters`.

#### Response Example
```json
{
  "keys": ["key1", "key2", "key3"]
}
```
```

--------------------------------

### Get JUnit Root Test Descriptor (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/ExecutionRequest

Returns the root TestDescriptor for the engine processing the ExecutionRequest. This descriptor represents the top-level node in the test hierarchy and is the starting point for test discovery and execution.

```java
TestDescriptor getRootTestDescriptor()
```

--------------------------------

### Create LauncherConfig Builder in JUnit 5

Source: https://docs.junit.org/current/api/index-files/index-2

Shows how to instantiate a builder for configuring LauncherConfig in JUnit 5. This is used for setting up the test launcher's configuration.

```java
import org.junit.platform.launcher.core.LauncherConfig;

// ...

LauncherConfig.Builder configBuilder = LauncherConfig.builder();
```

--------------------------------

### Get JUnit Engine Execution Listener (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/ExecutionRequest

Returns the EngineExecutionListener for the current ExecutionRequest. This listener is crucial for notifying the test framework about various test execution events, such as test discovery, execution start, and completion.

```java
EngineExecutionListener getEngineExecutionListener()
```

--------------------------------

### JUnit 5 Nested Tests for Stack Operations

Source: https://docs.junit.org/current/user-guide/index

Demonstrates hierarchical testing of a stack using JUnit 5's @Nested annotation. It showcases setup methods (@BeforeEach) used across nested test classes to manage the stack's state for various test scenarios, including empty and populated states. This example utilizes standard Java Stack and JUnit assertions.

```java
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.EmptyStackException;
import java.util.Stack;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

@DisplayName("A stack")
class TestingAStackDemo {

    Stack<Object> stack;

    @Test
    @DisplayName("is instantiated with new Stack()")
    void isInstantiatedWithNew() {
        new Stack<>();
    }

    @Nested
    @DisplayName("when new")
    class WhenNew {

        @BeforeEach
        void createNewStack() {
            stack = new Stack<>();
        }

        @Test
        @DisplayName("is empty")
        void isEmpty() {
            assertTrue(stack.isEmpty());
        }

        @Test
        @DisplayName("throws EmptyStackException when popped")
        void throwsExceptionWhenPopped() {
            assertThrows(EmptyStackException.class, stack::pop);
        }

        @Test
        @DisplayName("throws EmptyStackException when peeked")
        void throwsExceptionWhenPeeked() {
            assertThrows(EmptyStackException.class, stack::peek);
        }

        @Nested
        @DisplayName("after pushing an element")
        class AfterPushing {

            String anElement = "an element";

            @BeforeEach
            void pushAnElement() {
                stack.push(anElement);
            }

            @Test
            @DisplayName("it is no longer empty")
            void isNotEmpty() {
                assertFalse(stack.isEmpty());
            }

            @Test
            @DisplayName("returns the element when popped and is empty")
            void returnElementWhenPopped() {
                assertEquals(anElement, stack.pop());
                assertTrue(stack.isEmpty());
            }

            @Test
            @DisplayName("returns the element when peeked but remains not empty")
            void returnElementWhenPeeked() {
                assertEquals(anElement, stack.peek());
                assertFalse(stack.isEmpty());
            }
        }
    }
}
```

--------------------------------

### Opening a LauncherSession with JUnit Platform LauncherFactory

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/class-use/LauncherSession

Demonstrates how to open a new LauncherSession using the LauncherFactory. It shows variations for using the default configuration or a custom LauncherConfig. These methods are essential for initiating test execution contexts.

```java
import org.junit.platform.launcher.LauncherFactory;
import org.junit.platform.launcher.LauncherSession;
import org.junit.platform.launcher.LauncherConfig;

// Using default configuration
LauncherSession sessionDefault = LauncherFactory.openSession();

// Using a custom configuration
LauncherConfig config = LauncherConfig.builder().build(); // Example configuration
LauncherSession sessionCustom = LauncherFactory.openSession(config);
```

--------------------------------

### Get First Indexed Parameter Declaration (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/support/ParameterDeclarations

Retrieves the first indexed parameter declaration, if one exists. This is useful for quickly accessing the initial parameter in a parameterized setup. It returns an Optional, which may be empty if no indexed declarations are present.

```Java
Optional<ParameterDeclaration> getFirst()

Returns the first _indexed_ parameter declaration, if available; never `null`.
```

--------------------------------

### JUnit ToolProvider Interface - run Method

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/ConsoleLauncherToolProvider

Demonstrates the signature of the `run` method as defined by the `ToolProvider` interface, which is implemented by `ConsoleLauncherToolProvider`. This method is responsible for executing the tool with provided output and error streams.

```java
/**
 * Runs the tool.
 *
 * @param out  the standard output stream
 * @param err  the standard error stream
 * @param args the command line arguments
 * @return the exit code
 */
@Override
public int run(PrintWriter out, PrintWriter err, String... args);
```

--------------------------------

### Create Launcher Instance - Java

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/class-use/Launcher

Factory methods for creating a new `Launcher` instance. One method uses the default configuration, while another accepts a custom `LauncherConfig`.

```java
Launcher launcher = LauncherFactory.create();

LauncherConfig config = LauncherConfig.builder()
    .build(); // Customize config as needed
Launcher launcherWithConfig = LauncherFactory.create(config);
```

--------------------------------

### Java HttpServerResource Implementing AutoCloseable

Source: https://docs.junit.org/current/user-guide

This Java class implements the `AutoCloseable` interface to manage an `HttpServer` resource. It handles server creation, starting with an example handler, and ensures proper shutdown via the `close()` method. This is useful for resources that need to be managed within the JUnit extension lifecycle.

```java
class HttpServerResource implements AutoCloseable {

    private final HttpServer httpServer;

    HttpServerResource(int port) throws IOException {
        InetAddress loopbackAddress = InetAddress.getLoopbackAddress();
        this.httpServer = HttpServer.create(new InetSocketAddress(loopbackAddress, port), 0);
    }

    HttpServer getHttpServer() {
        return httpServer;
    }

    void start() {
        // Example handler
        httpServer.createContext("/example", exchange -> {
            String body = "This is a test";
            exchange.sendResponseHeaders(200, body.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(body.getBytes(UTF_8));
            }
        });
        httpServer.setExecutor(null);
        httpServer.start();
    }

    @Override
    public void close() {
        httpServer.stop(0);
    }
}

```

--------------------------------

### Get Test Execution Summary Counts - JUnit Platform Launcher

Source: https://docs.junit.org/current/api/index-files/index-7

Provides methods to retrieve various counts from the test execution summary. These include the number of tests aborted, failed, found, skipped, started, succeeded, and the total failure count.

```java
/**
 * Get the number of tests aborted.
 */
long getTestsAbortedCount();

/**
 * Get the number of tests that failed.
 */
long getTestsFailedCount();

/**
 * Get the number of tests found.
 */
long getTestsFoundCount();

/**
 * Get the number of tests skipped.
 */
long getTestsSkippedCount();

/**
 * Get the number of tests started.
 */
long getTestsStartedCount();

/**
 * Get the number of tests that succeeded.
 */
long getTestsSucceededCount();

/**
 * Get the total number of failed containers and failed tests.
 */
long getTotalFailureCount();
```

--------------------------------

### Get Wrapper Type for Primitive in JUnit Platform

Source: https://docs.junit.org/current/api/index-files/index-7

This static utility method in ReflectionUtils returns the corresponding wrapper class for a given primitive type. For example, it would return `Integer.class` for `int.class`. This is useful for reflection-based operations.

```java
/**
 * Get the wrapper type for the supplied primitive type.
 */
static Class<?> getWrapperType(Class<?> primitiveType);
```

--------------------------------

### Launcher API Endpoints

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/Launcher

Documentation for the methods available in the Launcher API.

```APIDOC
## POST /registerLauncherDiscoveryListeners

### Description
Registers one or more listeners for test discovery events.

### Method
POST

### Endpoint
/registerLauncherDiscoveryListeners

### Parameters
#### Request Body
- **listeners** (LauncherDiscoveryListener[]) - Required - The listeners to be notified of test discovery events; never null or empty

### Request Example
```json
{
  "listeners": [
    // Array of LauncherDiscoveryListener objects
  ]
}
```

### Response
#### Success Response (200)
- **message** (string) - Indicates successful registration.

#### Response Example
```json
{
  "message": "Launcher discovery listeners registered successfully."
}
```

## POST /registerTestExecutionListeners

### Description
Registers one or more listeners for test execution events.

### Method
POST

### Endpoint
/registerTestExecutionListeners

### Parameters
#### Request Body
- **listeners** (TestExecutionListener[]) - Required - The listeners to be notified of test execution events; never null or empty

### Request Example
```json
{
  "listeners": [
    // Array of TestExecutionListener objects
  ]
}
```

### Response
#### Success Response (200)
- **message** (string) - Indicates successful registration.

#### Response Example
```json
{
  "message": "Test execution listeners registered successfully."
}
```

## POST /discover

### Description
Discovers tests and builds a `TestPlan` based on the provided `LauncherDiscoveryRequest`. This method queries all registered engines and collects their results.

### Method
POST

### Endpoint
/discover

### Parameters
#### Request Body
- **launcherDiscoveryRequest** (LauncherDiscoveryRequest) - Required - The launcher discovery request; never null

### Request Example
```json
{
  "launcherDiscoveryRequest": {
    // Details of the LauncherDiscoveryRequest object
  }
}
```

### Response
#### Success Response (200)
- **testPlan** (TestPlan) - An unmodifiable `TestPlan` containing all resolved identifiers from registered engines.

#### Response Example
```json
{
  "testPlan": {
    // Details of the TestPlan object
  }
}
```

### API Note
This method may be called to generate a preview of the test tree. The resulting `TestPlan` is unmodifiable and may be passed to `execute(TestPlan, TestExecutionListener...)` for execution at most once.

## POST /execute

### Description
Executes a `TestPlan` built according to the supplied `LauncherDiscoveryRequest`. This method queries all registered engines, collects their results, and notifies registered listeners about the progress and results of the execution.

### Method
POST

### Endpoint
/execute

### Parameters
#### Request Body
- **launcherDiscoveryRequest** (LauncherDiscoveryRequest) - Required - The launcher discovery request; never null
- **listeners** (TestExecutionListener[]) - Required - Additional test execution listeners; never null

### Request Example
```json
{
  "launcherDiscoveryRequest": {
    // Details of the LauncherDiscoveryRequest object
  },
  "listeners": [
    // Array of TestExecutionListener objects
  ]
}
```

### Response
#### Success Response (200)
- **message** (string) - Indicates successful execution.

#### Response Example
```json
{
  "message": "Test execution initiated successfully."
}
```

### API Note
Calling this method will cause test discovery to be executed for all registered engines. If the same `LauncherDiscoveryRequest` was previously passed to `discover(LauncherDiscoveryRequest)`, you should instead call `execute(TestPlan, TestExecutionListener...)` and pass the already acquired `TestPlan` to avoid potential performance degradation (e.g., classpath scanning) of running test discovery twice.

## POST /execute_plan

### Description
Executes a supplied `TestPlan` and notifies registered listeners about the progress and results of the execution.

### Method
POST

### Endpoint
/execute_plan

### Parameters
#### Request Body
- **testPlan** (TestPlan) - Required - The `TestPlan` to execute.
- **listeners** (TestExecutionListener[]) - Optional - Additional test execution listeners.

### Request Example
```json
{
  "testPlan": {
    // Details of the TestPlan object
  },
  "listeners": [
    // Array of TestExecutionListener objects
  ]
}
```

### Response
#### Success Response (200)
- **message** (string) - Indicates successful execution.

#### Response Example
```json
{
  "message": "Test plan execution initiated successfully."
}
```
```

--------------------------------

### Use Custom Temp Directory Factory

Source: https://docs.junit.org/current/user-guide

This snippet demonstrates how to provide a custom factory for creating temporary directories using the `factory` attribute of the @TempDir annotation. The custom factory can control aspects like the parent directory or the file system used. The example factory ensures the directory name starts with the test method name.

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.ParameterContext;
import org.junit.jupiter.api.extension.ParameterResolutionException;
import org.junit.jupiter.api.extension.support.TypeBasedArgumentsAccessor;
import org.junit.jupiter.api.io.TempDir;
import org.junit.jupiter.api.io.TempDirFactory;
import org.junit.jupiter.api.io.AnnotatedElementContext;

import java.io.IOException;
import java.lang.reflect.Parameter;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertTrue;

class TempDirFactoryDemo {

    @Test
    void factoryTest(@TempDir(factory = TempDirFactoryDemo.Factory.class) Path tempDir) {
        assertTrue(tempDir.getFileName().toString().startsWith("factoryTest"));
        System.out.println("Custom temp dir created: " + tempDir);
    }

    static class Factory implements TempDirFactory {

        @Override
        public Path createTempDirectory(AnnotatedElementContext elementContext, ExtensionContext extensionContext) throws IOException {
            String prefix = elementContext.getElement().map(element -> {
                if (element instanceof Parameter) {
                    return ((Parameter) element).getDeclaringExecutable().getName();
                }
                // Handle other element types if necessary, e.g., Field
                return "junit-factory";
            }).orElse("junit-factory");
            
            // Use Files.createTempDirectory with a custom prefix based on test method name
            return Files.createTempDirectory(prefix + "-");
        }

        // The close() method is called by the extension after the test.
        // For this example, we don't need to do anything specific here.
        @Override
        public void close() throws IOException {
            // Cleanup logic if needed, though @TempDir handles directory deletion by default
        }
    }

}
```

--------------------------------

### Setting Expected Started Events with EventStatistics

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/EventStatistics

This Java code demonstrates using the 'started' method from EventStatistics to define the expected count of started events. This is crucial for validating the initiation of processes or tasks within a test.

```java
public EventStatistics started(long expected)
Specify the number of expected _started_ events. 

Parameters:
    `expected` - the expected number of events 

Returns:
    this `EventStatistics` for method chaining
```

--------------------------------

### Dynamic Shared Resources Declaration with ResourceLocksProvider in Java

Source: https://docs.junit.org/current/user-guide

Illustrates how to dynamically add shared resources at runtime using a custom implementation of the ResourceLocksProvider interface. This example configures the test class to use dynamic resource locks for system properties, determining the access mode (READ or READ_WRITE) based on the test method name. It includes setup and teardown for managing system properties.

```java
@Execution(CONCURRENT)
@ResourceLock(providers = DynamicSharedResourcesDemo.Provider.class)
class DynamicSharedResourcesDemo {

    private Properties backup;

    @BeforeEach
    void backup() {
        backup = new Properties();
        backup.putAll(System.getProperties());
    }

    @AfterEach
    void restore() {
        System.setProperties(backup);
    }

    @Test
    void customPropertyIsNotSetByDefault() {
        assertNull(System.getProperty("my.prop"));
    }

    @Test
    void canSetCustomPropertyToApple() {
        System.setProperty("my.prop", "apple");
        assertEquals("apple", System.getProperty("my.prop"));
    }

    @Test
    void canSetCustomPropertyToBanana() {
        System.setProperty("my.prop", "banana");
        assertEquals("banana", System.getProperty("my.prop"));
    }

    static class Provider implements ResourceLocksProvider {

        @Override
        public Set<Lock> provideForMethod(List<Class<?>> enclosingInstanceTypes, Class<?> testClass,
                Method testMethod) {
            ResourceAccessMode mode = testMethod.getName().startsWith("canSet") ? READ_WRITE : READ;
            return Collections.singleton(new Lock(SYSTEM_PROPERTIES, mode));
        }
    }

}
```

--------------------------------

### Execution Started Listener (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/class-use/TestIdentifier

Handles the event when a test or container execution is starting. Implemented by listeners such as LoggingListener and SummaryGeneratingListener, this method receives the TestIdentifier of the test/container that is about to start execution.

```java
void executionStarted(TestIdentifier testIdentifier)
```

--------------------------------

### Build LauncherConfig Instance (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherConfig

Builds the final LauncherConfig instance based on the configurations set on the builder. This method finalizes the setup and returns the configured LauncherConfig object.

```Java
public LauncherConfig build()
Build the `LauncherConfig` that has been configured via this builder.
```

--------------------------------

### Configure JUnit Platform via Console Launcher

Source: https://docs.junit.org/current/user-guide/index

Shows how to specify configuration parameters when running tests using the JUnit Platform's Console Launcher. This method utilizes command-line arguments to pass custom settings to the test engine, listener, or extensions. It is useful for setting parameters directly from the terminal.

```bash
# Specify a single configuration parameter
java -jar junit-platform-console-standalone.jar --config key1=value1

# Specify multiple configuration parameters
java -jar junit-platform-console-standalone.jar --config key2=value2 --config key3=value3

# Specify a configuration resource file
java -jar junit-platform-console-standalone.jar --config-resource /path/to/config.properties
```

--------------------------------

### Create Execution Started Event

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Event

Factory method to create an `Event` signaling the beginning of a test execution. It takes the `TestDescriptor` of the test that is starting. Requires JUnit 5.4+.

```java
@API(status=MAINTAINED, since="1.4")
public static Event executionStarted(TestDescriptor testDescriptor) {
    // Implementation details not provided in the source text
    return null;
}
```

--------------------------------

### JUnit 5: Specify Expected Started Events Count

Source: https://docs.junit.org/current/api/index-files/index-19

An overload of the `started` method in `EventStatistics` that allows specifying the expected number of `STARTED` events. This is helpful for verifying test counts.

```java
EventStatistics.started(long)
```

--------------------------------

### Parameterized Test with @CsvSource Custom Delimiters and Quotes

Source: https://docs.junit.org/current/user-guide/index

Shows how to configure @CsvSource to use custom delimiters (e.g., '|') and quote characters (e.g., '"'). This example also utilizes a text block for the CSV data, includes comments within the text block (lines starting with '#'), and demonstrates custom formatting for readability.

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

class CsvSourceCustomDelimiterTest {

    @ParameterizedTest
    @CsvSource(delimiter = '|', quoteCharacter = '"', textBlock = """
        #-----------------------------
        #    FRUIT     |     RANK
        #-----------------------------
             apple     |      1
        #-----------------------------
             banana    |      2
        #-----------------------------
          "lemon lime" |     0xF1
        #-----------------------------
           strawberry  |    700_000
        #-----------------------------
        """)
    void testWithCsvSource(String fruit, int rank) {
        // Test logic here
        assertNotNull(fruit);
        assertNotEquals(0, rank);
    }
}
```

--------------------------------

### Create DefaultJupiterConfiguration with OutputDirectoryProvider

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/reporting/class-use/OutputDirectoryProvider

Illustrates the creation of a `DefaultJupiterConfiguration` by passing a `ConfigurationParameters` object and an `OutputDirectoryProvider`. This constructor is used to initialize the configuration with a specific output directory provider.

```java
/**
 * Constructs a new DefaultJupiterConfiguration.
 *
 * @param configurationParameters The configuration parameters.
 * @param outputDirectoryProvider The output directory provider.
 */
public DefaultJupiterConfiguration(ConfigurationParameters configurationParameters, OutputDirectoryProvider outputDirectoryProvider);
```

--------------------------------

### GET /configuration/parameters/size

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/config/PrefixedConfigurationParameters

Gets the number of configuration parameters stored directly in this ConfigurationParameters instance.

```APIDOC
## GET /configuration/parameters/size

### Description
Get the number of configuration parameters stored directly in this `ConfigurationParameters`.

### Method
GET

### Endpoint
`/configuration/parameters/size`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
(No request body needed for this GET request)

### Response
#### Success Response (200)
- **count** (int) - The number of configuration parameters.

#### Response Example
```json
{
  "count": 5
}
```
```

--------------------------------

### Static Shared Resources Declaration with @ResourceLock in Java

Source: https://docs.junit.org/current/user-guide

Demonstrates how to declare shared resources statically using the @ResourceLock annotation in JUnit Jupiter. This example shows how to lock the system properties for concurrent execution, ensuring that tests requiring READ or READ_WRITE access to system properties do not conflict when run in parallel. It includes setup and teardown methods to manage system properties.

```java
@Execution(CONCURRENT)
class StaticSharedResourcesDemo {

    private Properties backup;

    @BeforeEach
    void backup() {
        backup = new Properties();
        backup.putAll(System.getProperties());
    }

    @AfterEach
    void restore() {
        System.setProperties(backup);
    }

    @Test
    @ResourceLock(value = SYSTEM_PROPERTIES, mode = READ)
    void customPropertyIsNotSetByDefault() {
        assertNull(System.getProperty("my.prop"));
    }

    @Test
    @ResourceLock(value = SYSTEM_PROPERTIES, mode = READ_WRITE)
    void canSetCustomPropertyToApple() {
        System.setProperty("my.prop", "apple");
        assertEquals("apple", System.getProperty("my.prop"));
    }

    @Test
    @ResourceLock(value = SYSTEM_PROPERTIES, mode = READ_WRITE)
    void canSetCustomPropertyToBanana() {
        System.setProperty("my.prop", "banana");
        assertEquals("banana", System.getProperty("my.prop"));
    }

}
```

--------------------------------

### started

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/EventConditions

Creates a condition that matches if the event's type is STARTED.

```APIDOC
## started

### Description
Create a new `Condition` that matches if and only if an `Event`'s type is `EventType.STARTED`.

### Method
`public static Condition<Event> started()`

### Parameters
None

### Request Example
```json
{
  "event_type": "STARTED"
}
```

### Response
#### Success Response (200)
- **Condition<Event>** - A condition object that matches started events.

#### Response Example
```json
{
  "matches": true
}
```
```

--------------------------------

### SummaryGeneratingListener Constructor

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/listeners/SummaryGeneratingListener

Initializes a new instance of the SummaryGeneratingListener.

```APIDOC
## SummaryGeneratingListener Constructor

### Description
Initializes a new instance of the SummaryGeneratingListener.

### Method
`public SummaryGeneratingListener()`

### Endpoint
N/A (Constructor)

### Parameters
None

### Request Example
```java
SummaryGeneratingListener listener = new SummaryGeneratingListener();
```

### Response
N/A (Constructor)
```

--------------------------------

### Get Declaring Executable (Java) - org.junit.jupiter.api.extension.ParameterContext

Source: https://docs.junit.org/current/api/index-files/index-7

Gets the `Executable` (Method or Constructor) that declares the parameter for this context. This is part of the extension API.

```Java
java.lang.reflect.Executable org.junit.jupiter.api.extension.ParameterContext.getDeclaringExecutable()
```

--------------------------------

### Create Launcher Instance with Config (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherFactory

Factory method for creating a new Launcher using a supplied LauncherConfig. This provides full control over automatic registration and programmatic registration of test engines and listeners. It throws a PreconditionViolationException if the configuration is null or no test engines are detected.

```java
@API(status=STABLE, since="1.10") public static Launcher create(LauncherConfig config) throws PreconditionViolationException
```

--------------------------------

### Create JUnit Launcher with Default Configuration

Source: https://docs.junit.org/current/api/org.junit.platform.commons/org/junit/platform/commons/class-use/PreconditionViolationException

Factory method to create a new Launcher instance using the default LauncherConfig. This is the simplest way to obtain a Launcher.

```java
static Launcher
LauncherFactory.create()
```

--------------------------------

### Record Execution Start Event

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/ExecutionRecorder

Records an event for a container or test that has started execution. This signifies the beginning of a test or test suite.

```java
public void executionStarted(TestDescriptor testDescriptor)
```

--------------------------------

### Runtime Configuration Options

Source: https://docs.junit.org/current/user-guide/index

Options for configuring the classpath and setting runtime parameters for test discovery and execution. These are essential for including necessary libraries and engine dependencies.

```bash
# Add a directory to the classpath for engines and dependencies
java -jar junit-console.jar --classpath="lib/my-engine.jar:lib/dependency.jar"

# Set configuration parameters via a resource file
java -jar junit-console.jar --config-resource="junit-config.properties"

# Set a specific configuration parameter
java -jar junit-console.jar --config="junit.extensions.autodetection.enabled=true"
```

--------------------------------

### VintageTestEngine Constructor (Java)

Source: https://docs.junit.org/current/api/org.junit.vintage.engine/org/junit/vintage/engine/VintageTestEngine

Initializes a new instance of the VintageTestEngine. This is the default constructor and does not require any parameters.

```java
public VintageTestEngine()
```

--------------------------------

### Create LauncherDiscoveryRequestBuilder Request (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/class-use/LauncherDiscoveryRequestBuilder

This snippet shows how to create a new LauncherDiscoveryRequestBuilder instance. This is the starting point for building a discovery request.

```java
LauncherDiscoveryRequestBuilder request(){
    return LauncherDiscoveryRequestBuilder.request();
}
```

--------------------------------

### Create LauncherConfig.Builder

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/class-use/LauncherConfig

This snippet shows how to create a new instance of the LauncherConfig.Builder using the static builder() method. This builder is the entry point for configuring the LauncherConfig.

```java
LauncherConfig.Builder builder = LauncherConfig.builder();
```

--------------------------------

### LauncherConfig.Builder Configuration Methods

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherConfig

Methods to configure the auto-registration of various listeners and engines within the LauncherConfig.

```APIDOC
## POST /websites/junit_current/configure

### Description
Configures the auto-registration flags for various components like listeners and engines. This is a conceptual endpoint representing builder pattern usage.

### Method
POST

### Endpoint
/websites/junit_current

### Parameters
#### Query Parameters
- **enabled** (boolean) - Required - Flag to enable or disable auto-registration.

### Request Body
This section is not applicable as configuration is done via method chaining in the builder pattern.

### Request Example
```json
{
  "action": "configure",
  "component": "launcherSessionListenerAutoRegistration",
  "enabled": true
}
```

### Response
#### Success Response (200)
- **message** (string) - Indicates successful configuration.

#### Response Example
```json
{
  "message": "Configuration updated successfully."
}
```
```

--------------------------------

### JUnit Discover Command Usage

Source: https://docs.junit.org/current/user-guide/index

This snippet shows the basic usage of the 'junit discover' command. It lists the available options for controlling output and selecting tests. Note that the specific options and their behavior may vary based on the JUnit version.

```bash
Usage: junit discover [OPTIONS]
Discover tests
      [@<filename>...]       One or more argument files containing options.
      --disable-ansi-colors  Disable ANSI colors in output (not supported by all terminals).
      --disable-banner       Disable print out of the welcome message.
  -h, --help                 Display help information.
      --version              Display version information.
```

--------------------------------

### Get Result from ThrowingSupplier

Source: https://docs.junit.org/current/api/index-files/index-7

Represents a supplier that may throw an exception. The get() method attempts to retrieve a result.

```java
get()

```

--------------------------------

### Create Started Execution Event (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Event

Creates a 'started' Event for a given TestDescriptor, marking the beginning of its execution. This is fundamental for tracking test progress. It requires a non-null TestDescriptor.

```java
public static Event executionStarted(TestDescriptor testDescriptor)
```

--------------------------------

### Launcher Discovery Request

Source: https://docs.junit.org/current/api/index-files/index-18

APIs for building discovery requests for the JUnit launcher.

```APIDOC
## POST /launcher/discoveryRequestBuilder

### Description
Creates a new builder for constructing launcher discovery requests.

### Method
POST

### Endpoint
/launcher/discoveryRequestBuilder

### Parameters
None

### Request Example
(No request body needed)

### Response
#### Success Response (200)
- **builder** (LauncherDiscoveryRequestBuilder) - An instance of the builder.

#### Response Example
```json
{
  "builder": "LauncherDiscoveryRequestBuilder@some_hash"
}
```
```

--------------------------------

### Configure Launcher with Custom Engines and Listeners (Java)

Source: https://docs.junit.org/current/user-guide/index

Demonstrates how to configure the JUnit Launcher with custom test engines, session listeners, discovery listeners, post-discovery filters, and test execution listeners using a fluent builder API. This allows for fine-grained control over test discovery and execution.

```java
LauncherConfig launcherConfig = LauncherConfig.builder()
    .enableTestEngineAutoRegistration(false)
    .enableLauncherSessionListenerAutoRegistration(false)
    .enableLauncherDiscoveryListenerAutoRegistration(false)
    .enablePostDiscoveryFilterAutoRegistration(false)
    .enableTestExecutionListenerAutoRegistration(false)
    .addTestEngines(new CustomTestEngine())
    .addLauncherSessionListeners(new CustomLauncherSessionListener())
    .addLauncherDiscoveryListeners(new CustomLauncherDiscoveryListener())
    .addPostDiscoveryFilters(new CustomPostDiscoveryFilter())
    .addTestExecutionListeners(new LegacyXmlReportGeneratingListener(reportsDir, out))
    .addTestExecutionListeners(new CustomTestExecutionListener())
    .build();

LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder.request()
    .selectors(selectPackage("com.example.mytests"))
    .build();

try (LauncherSession session = LauncherFactory.openSession(launcherConfig)) {
    session.getLauncher().execute(request);
}
```

--------------------------------

### Create JUnit Platform Test Suite with JUnitPlatform Runner

Source: https://docs.junit.org/current/user-guide/index

This example shows how to create a test suite using JUnit 4's `@RunWith(JUnitPlatform.class)` annotation along with JUnit Platform's suite annotations like `@SuiteDisplayName` and `@SelectPackages`. This suite will discover and run tests within the specified package.

```java
import org.junit.platform.suite.api.SelectPackages;
import org.junit.platform.suite.api.SuiteDisplayName;
import org.junit.runner.RunWith;

@RunWith(org.junit.platform.runner.JUnitPlatform.class)
@SuiteDisplayName("JUnit Platform Suite Demo")
@SelectPackages("example")
public class JUnitPlatformSuiteDemo {
}
```

--------------------------------

### Record Started Test Execution - Java

Source: https://docs.junit.org/current/api/index-files/index-5

Records an event when the execution of a test or container is about to start. This method is available in the EngineExecutionListener interface and is used by various listeners like LoggingListener and SummaryGeneratingListener.

```java
void executionStarted(TestDescriptor)
```

```java
void executionStarted(TestIdentifier)
```

--------------------------------

### LauncherConfig Builder API

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherConfig

This section details the methods available on the LauncherConfig.Builder class for configuring various aspects of the LauncherConfig.

```APIDOC
## LauncherConfig.Builder Class

### Description
This is the builder API for `LauncherConfig`. It provides methods to configure and construct a `LauncherConfig` object.

### Methods

#### `addLauncherDiscoveryListeners(LauncherDiscoveryListener... listeners)`
- **Description**: Add all of the supplied launcher discovery listeners to the configuration.
- **Type**: Method
- **Returns**: `LauncherConfig.Builder`

#### `addLauncherSessionListeners(LauncherSessionListener... listeners)`
- **Description**: Add all of the supplied launcher session listeners to the configuration.
- **Type**: Method
- **Returns**: `LauncherConfig.Builder`

#### `addPostDiscoveryFilters(PostDiscoveryFilter... filters)`
- **Description**: Add all of the supplied `filters` to the configuration.
- **Type**: Method
- **Returns**: `LauncherConfig.Builder`

#### `addTestEngines(TestEngine... engines)`
- **Description**: Add all of the supplied test engines to the configuration.
- **Type**: Method
- **Returns**: `LauncherConfig.Builder`

#### `addTestExecutionListeners(TestExecutionListener... listeners)`
- **Description**: Add all of the supplied test execution listeners to the configuration.
- **Type**: Method
- **Returns**: `LauncherConfig.Builder`

#### `build()`
- **Description**: Build the `LauncherConfig` that has been configured via this builder.
- **Type**: Method
- **Returns**: `LauncherConfig`

#### `enableLauncherDiscoveryListenerAutoRegistration(boolean enabled)`
- **Description**: Configure the auto-registration flag for launcher discovery listeners.
- **Type**: Method
- **Returns**: `LauncherConfig.Builder`

#### `enableLauncherSessionListenerAutoRegistration(boolean enabled)`
- **Description**: Configure the auto-registration flag for launcher session listeners.
- **Type**: Method
- **Returns**: `LauncherConfig.Builder`

#### `enablePostDiscoveryFilterAutoRegistration(boolean enabled)`
- **Description**: Configure the auto-registration flag for post discovery filters.
- **Type**: Method
- **Returns**: `LauncherConfig.Builder`

#### `enableTestEngineAutoRegistration(boolean enabled)`
- **Description**: Configure the auto-registration flag for test engines.
- **Type**: Method
- **Returns**: `LauncherConfig.Builder`

#### `enableTestExecutionListenerAutoRegistration(boolean enabled)`
- **Description**: Configure the auto-registration flag for test execution listeners.
- **Type**: Method
- **Returns**: `LauncherConfig.Builder`
```

--------------------------------

### ThrowingSupplier API Documentation

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/function/ThrowingSupplier

Documentation for the ThrowingSupplier functional interface and its 'get' method.

```APIDOC
## ThrowingSupplier Functional Interface

### Description
`ThrowingSupplier<T>` is a functional interface that allows for a generic block of code to return an object of type `T` and potentially throw a `Throwable`. It is similar to the standard `Supplier` interface but provides the flexibility to throw any kind of exception, including checked exceptions.

### Type Parameters
- `T` - The type of the result supplied by this `ThrowingSupplier`.

### Functional Interface
This interface is annotated with `@FunctionalInterface`, meaning it can be used as the target for lambda expressions or method references.

### Rationale for throwing `Throwable`
While Java applications typically throw exceptions extending `Exception` or `Error`, `ThrowingSupplier` is designed to throw `Throwable` to support specialized use cases that might require throwing any kind of throwable object.

### Status
- Status: STABLE
- Since: 5.0

### See Also
- `Supplier`
- `Assertions.assertTimeout(java.time.Duration, ThrowingSupplier)`
- `Assertions.assertTimeoutPreemptively(java.time.Duration, ThrowingSupplier)`
- `Executable`
- `ThrowingConsumer`

## Method Summary

### Instance Methods

| Modifier and Type | Method          | Description                      |
|-------------------|-----------------|----------------------------------|
| `T`               | `get()`         | Get a result, potentially throwing an exception. |

## Method Details

### get

`T get() throws Throwable`

#### Description
Get a result, potentially throwing an exception.

#### Returns
- `T` - A result of type `T`.

#### Throws
- `Throwable` - Any `Throwable` that may be thrown during the execution of the supplier's logic.
```

--------------------------------

### SuiteLauncherDiscoveryRequestBuilder API

Source: https://docs.junit.org/current/api/org.junit.platform.suite.commons/org/junit/platform/suite/commons/SuiteLauncherDiscoveryRequestBuilder

Provides methods to build a `LauncherDiscoveryRequest` for suite execution.

```APIDOC
## SuiteLauncherDiscoveryRequestBuilder

### Description
Provides a light-weight DSL for generating a `LauncherDiscoveryRequest` specifically tailored for suite execution.

### Methods

#### Static Methods

##### `request()`
* **Description**: Creates a new `SuiteLauncherDiscoveryRequestBuilder`.
* **Returns**: `SuiteLauncherDiscoveryRequestBuilder`

#### Instance Methods

##### `selectors(List<? extends DiscoverySelector> selectors)`
* **Description**: Adds a list of `DiscoverySelector` objects to the request.
* **Parameters**:
  * `selectors` (List<DiscoverySelector>) - Required - The list of selectors to add.

##### `selectors(DiscoverySelector... selectors)`
* **Description**: Adds multiple `DiscoverySelector` objects to the request.
* **Parameters**:
  * `selectors` (DiscoverySelector...) - Required - The selectors to add.

##### `filters(Filter<?>... filters)`
* **Description**: Adds multiple `Filter` objects to the request.
* **Parameters**:
  * `filters` (Filter<?>...) - Required - The filters to add.

##### `configurationParameter(String key, String value)`
* **Description**: Adds a configuration parameter to the request.
* **Parameters**:
  * `key` (String) - Required - The key of the configuration parameter.
  * `value` (String) - Required - The value of the configuration parameter.

##### `enableImplicitConfigurationParameters(boolean enabled)`
* **Description**: Configures whether implicit configuration parameters should be considered.
* **Parameters**:
  * `enabled` (boolean) - Required - `true` to enable, `false` to disable.

##### `applyConfigurationParametersFromSuite(Class<?> suiteClass)`
* **Description**: Applies a suite's annotation-based configuration to this builder.
* **Parameters**:
  * `suiteClass` (Class<?>) - Required - The suite class to apply configuration from.

##### `applySelectorsAndFiltersFromSuite(Class<?> suiteClass)`
* **Description**: Applies a suite's annotation-based discovery selectors and filters to this builder.
* **Parameters**:
  * `suiteClass` (Class<?>) - Required - The suite class to apply selectors and filters from.

##### `build()`
* **Description**: Builds the `LauncherDiscoveryRequest` that has been configured via this builder.
* **Returns**: `LauncherDiscoveryRequest`

### Example Usage
```java
SuiteLauncherDiscoveryRequestBuilder.request()
   .selectors(
        selectPackage("org.example.user"),
        selectClass("org.example.payment.PaymentTests")
   )
   .filters(
        includeEngines("junit-jupiter"),
        includeTags("fast")
   )
   .configurationParameter("key", "value")
   .enableImplicitConfigurationParameters(true)
   .applyConfigurationParametersFromSuite(MySuite.class)
   .applySelectorsAndFiltersFromSuite(MySuite.class)
   .build();
```
```

--------------------------------

### BeforeEachCallback Interface Definition and beforeEach Method

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/extension/BeforeEachCallback

Defines the BeforeEachCallback interface, which provides a callback method to be executed before an individual test. Implementations of this interface can hook into the test lifecycle to perform setup actions. The `beforeEach` method accepts an `ExtensionContext` and can throw an `Exception`.

```java
@FunctionalInterface @API(status=STABLE, since="5.0") public interface BeforeEachCallback extends Extension {
    /**
     * Callback that is invoked _before_ an individual test and any user-defined setup methods for that test have been executed.
     *
     * @param context the current extension context; never {@code null}
     * @throws Exception if the callback method can throw an exception
     */
    void beforeEach(ExtensionContext context) throws Exception;
}
```

--------------------------------

### Build Launcher Discovery Request

Source: https://docs.junit.org/current/api/org.junit.platform.suite.commons/org/junit/platform/suite/commons/SuiteLauncherDiscoveryRequestBuilder

Builds the `LauncherDiscoveryRequest` that has been configured via this builder.

```APIDOC
## build

### Description
Build the `LauncherDiscoveryRequest` that has been configured via this builder.

### Method
`build`

### Endpoint
N/A (Java method)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
N/A

### Response
#### Success Response (N/A)
N/A

#### Response Example
N/A
```

--------------------------------

### Get Declared Constructor (Java) - org.junit.platform.commons.util.ReflectionUtils

Source: https://docs.junit.org/current/api/index-files/index-7

Gets the sole declared, non-synthetic constructor for a given class. This utility method is useful for reflection operations.

```Java
<T> java.lang.reflect.Constructor<T> org.junit.platform.commons.util.ReflectionUtils.getDeclaredConstructor(Class<T> clazz)
```

--------------------------------

### Create Condition for Started Event Type in Event

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/EventConditions

Creates a `Condition<Event>` that matches if the event's type is `EventType.STARTED`. This is a simple condition for detecting the start of an event.

```java
static Condition<Event> started()
```

--------------------------------

### Get Containers Succeeded Count (Java) - org.junit.platform.launcher.listeners.TestExecutionSummary

Source: https://docs.junit.org/current/api/index-files/index-7

Gets the number of containers that succeeded during test execution. This count is available in the test execution summary.

```Java
long org.junit.platform.launcher.listeners.TestExecutionSummary.getContainersSucceededCount()
```

--------------------------------

### LauncherSession API

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/LauncherSession

The LauncherSession API allows for discovering and executing tests.

```APIDOC
## LauncherSession

### Description
The `LauncherSession` API is the main entry point for client code that wishes to repeatedly _discover_ and _execute_ tests using one or more test engines.

### Method
Not Applicable (Interface)

### Endpoint
Not Applicable (Interface)

### Parameters
None

### Request Example
None

### Response
#### Success Response (Interface Definition)
- **getLauncher** (`Launcher`) - Get the `Launcher` associated with this session.
- **close** (`void`) - Close this session and notify all registered `LauncherSessionListeners`.
- **getStore** (`NamespacedHierarchicalStore<Namespace>`) - Get the `NamespacedHierarchicalStore` associated with this session.

#### Response Example
```json
{
  "getLauncher": "Launcher object",
  "close": "void",
  "getStore": "NamespacedHierarchicalStore object"
}
```

## getLauncher

### Description
Get the `Launcher` associated with this session. Any call to the launcher returned by this method after the session has been closed will throw an exception.

### Method
GET (conceptual, as it's an interface method)

### Endpoint
Not Applicable (Interface Method)

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **Launcher** (`Launcher`) - The launcher associated with the session.

#### Response Example
```json
{
  "launcher": "Launcher Instance"
}
```

## close

### Description
Close this session and notify all registered `LauncherSessionListeners`.

### Method
POST (conceptual, as it's an interface method)

### Endpoint
Not Applicable (Interface Method)

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **void** (void) - Indicates successful closure.

#### Response Example
"Session closed successfully"

## getStore

### Description
Get the `NamespacedHierarchicalStore` associated with this session. All stored values that implement `AutoCloseable` are notified by invoking their `close()` methods when this session is closed. Any call to the store returned by this method after the session has been closed will throw an exception.

### Method
GET (conceptual, as it's an interface method)

### Endpoint
Not Applicable (Interface Method)

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **NamespacedHierarchicalStore<Namespace>** (`NamespacedHierarchicalStore<Namespace>`) - The hierarchical store associated with the session.

#### Response Example
```json
{
  "store": "NamespacedHierarchicalStore Instance"
}
```
```

--------------------------------

### JUnit TestExecutionListener: executionStarted

Source: https://docs.junit.org/current/api/org.junit.platform.reporting/org/junit/platform/reporting/open/xml/OpenTestReportGeneratingListener

Called when the execution of a leaf or subtree of the TestPlan is about to start. This method is only called if the test or container has not been skipped. For containers, it's called before starting or skipping its children.

```java
public void executionStarted(TestIdentifier testIdentifier)

```

--------------------------------

### Get Containers Found Count (Java) - org.junit.platform.launcher.listeners.TestExecutionSummary

Source: https://docs.junit.org/current/api/index-files/index-7

Gets the total number of containers found during test discovery. This is reported by the test execution summary listener.

```Java
long org.junit.platform.launcher.listeners.TestExecutionSummary.getContainersFoundCount()
```

--------------------------------

### EngineExecutionOrchestrator Constructor

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/EngineExecutionOrchestrator

Initializes a new instance of the EngineExecutionOrchestrator class.

```APIDOC
## EngineExecutionOrchestrator()

### Description
Initializes a new instance of the EngineExecutionOrchestrator class.

### Method
CONSTRUCTOR

### Endpoint
N/A

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
None

#### Response Example
None
```

--------------------------------

### Get Containers Skipped Count (Java) - org.junit.platform.launcher.listeners.TestExecutionSummary

Source: https://docs.junit.org/current/api/index-files/index-7

Gets the number of containers that were skipped during test execution. This metric is part of the test execution summary.

```Java
long org.junit.platform.launcher.listeners.TestExecutionSummary.getContainersSkippedCount()
```

--------------------------------

### JUnit Jupiter @TestTemplate Annotation Example

Source: https://docs.junit.org/current/api/org.junit.platform.commons/org/junit/platform/commons/annotation/class-use/Testable

Provides an example of the @TestTemplate annotation in JUnit Jupiter. This annotation is used for methods that serve as templates for executing multiple tests, often with different parameters.

```java
import org.junit.jupiter.api.TestTemplate;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.ParameterContext;
import org.junit.jupiter.api.extension.ParameterResolutionException;
import org.junit.jupiter.api.extension.ParameterResolver;

// A simple parameter resolver for demonstration
class MyParameterResolver implements ParameterResolver {
    private String[] data = {"value1", "value2"};
    private int index = 0;

    @Override
    public boolean supportsParameter(ParameterContext parameterContext, ExtensionContext extensionContext) throws ParameterResolutionException {
        return parameterContext.getParameter().getType().equals(String.class);
    }

    @Override
    public Object resolveParameter(ParameterContext parameterContext, ExtensionContext extensionContext) throws ParameterResolutionException {
        if (index < data.length) {
            return data[index++];
        }
        throw new ParameterResolutionException("No more data");
    }
}

@ExtendWith(MyParameterResolver.class)
public class TemplateTests {

    @TestTemplate
    void templateMethod(String argument) {
        System.out.println("Executing template with: " + argument);
        // Test logic using 'argument'
    }
}
```

--------------------------------

### Get Boolean Configuration Parameter (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/ConfigurationParameters

Retrieves a boolean configuration parameter by its key. Similar to get(String key), it checks this instance, then system properties, and then the properties file. Returns an Optional<Boolean> which may be empty.

```java
Optional<Boolean> getBoolean(String key)
```

--------------------------------

### executionStarted

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/listeners/SummaryGeneratingListener

Called when the execution of a leaf or subtree of the TestPlan is about to be started.

```APIDOC
## executionStarted

### Description
Called when the execution of a leaf or subtree of the `TestPlan` is about to be started. The `TestIdentifier` may represent a test or a container. This method will only be called if the test or container has not been skipped. This method will be called for a container `TestIdentifier` _before_ starting or skipping any of its children.

### Method
`public void executionStarted(TestIdentifier testIdentifier)`

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```java
// This method is typically called by the JUnit framework
listener.executionStarted(identifier);
```

### Response
#### Success Response (200)
Void (This method does not return a value).

#### Response Example
N/A
```

--------------------------------

### Get Containers Failed Count (Java) - org.junit.platform.launcher.listeners.TestExecutionSummary

Source: https://docs.junit.org/current/api/index-files/index-7

Gets the number of containers that failed during test execution. This information is provided by the test execution summary listener.

```Java
long org.junit.platform.launcher.listeners.TestExecutionSummary.getContainersFailedCount()
```

--------------------------------

### List Available Test Engines with JUnit CLI

Source: https://docs.junit.org/current/user-guide

Lists all available test engines that can be used with the JUnit command-line interface. This command helps in discovering which engines are present and ready for test execution.

```bash
junit engines
```

--------------------------------

### Get Containers Aborted Count (Java) - org.junit.platform.launcher.listeners.TestExecutionSummary

Source: https://docs.junit.org/current/api/index-files/index-7

Gets the number of containers that were aborted during test execution. This is part of the test execution summary listener.

```Java
long org.junit.platform.launcher.listeners.TestExecutionSummary.getContainersAbortedCount()
```

--------------------------------

### VintageTestEngine Methods

Source: https://docs.junit.org/current/api/org.junit.vintage.engine/org/junit/vintage/engine/VintageTestEngine

Provides details on the methods available for the VintageTestEngine, including test discovery, execution, and engine identification.

```APIDOC
## GET /methods/VintageTestEngine

### Description
Provides details on the methods available for the VintageTestEngine, including test discovery, execution, and engine identification.

### Method
GET

### Endpoint
/methods/VintageTestEngine

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "example": "No request body needed for method details"
}
```

### Response
#### Success Response (200)
- **methods** (Array) - A list of available methods and their descriptions.

#### Response Example
```json
{
  "example": {
    "discover": {
      "description": "Discover tests according to the supplied EngineDiscoveryRequest.",
      "parameters": [
        {"name": "discoveryRequest", "type": "EngineDiscoveryRequest", "description": "the discovery request; never null"},
        {"name": "uniqueId", "type": "UniqueId", "description": "the unique ID to be used for this test engine's TestDescriptor; never null"}
      ],
      "returns": {
        "type": "TestDescriptor",
        "description": "the root TestDescriptor of this engine, typically an instance of EngineDescriptor"
      }
    },
    "execute": {
      "description": "Execute tests according to the supplied ExecutionRequest.",
      "parameters": [
        {"name": "request", "type": "ExecutionRequest", "description": "the request to execute tests for; never null"}
      ],
      "returns": {
        "type": "void",
        "description": "None"
      }
    },
    "getArtifactId": {
      "description": "Returns \"junit-vintage-engine\" as the artifact ID.",
      "returns": {
        "type": "Optional<String>",
        "description": "an Optional containing the artifact ID; never null but potentially empty if the artifact ID is unknown"
      }
    },
    "getGroupId": {
      "description": "Returns \"org.junit.vintage\" as the group ID.",
      "returns": {
        "type": "Optional<String>",
        "description": "an Optional containing the group ID; never null but potentially empty if the group ID is unknown"
      }
    },
    "getId": {
      "description": "Get the ID that uniquely identifies this test engine.",
      "returns": {
        "type": "String",
        "description": "the ID of this test engine; never null or blank"
      }
    }
  }
}
```
```

--------------------------------

### JUnit TestExecutionListener: Test Plan Execution Methods

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/listeners/SummaryGeneratingListener

Methods for managing the lifecycle of a test plan's execution. These include notifications for when the entire test plan starts and finishes, and callbacks for when individual tests or containers are skipped, start, or finish execution.

```java
public void testPlanExecutionStarted(TestPlan testPlan)
public void testPlanExecutionFinished(TestPlan testPlan)
public void executionSkipped(TestIdentifier testIdentifier, String reason)
public void executionStarted(TestIdentifier testIdentifier)
public void executionFinished(TestIdentifier testIdentifier, TestExecutionResult testExecutionResult)
```

--------------------------------

### Add Configuration Parameters from Resource File

Source: https://docs.junit.org/current/api/org.junit.platform.suite.commons/org/junit/platform/suite/commons/class-use/SuiteLauncherDiscoveryRequestBuilder

This snippet illustrates how to load configuration parameters from a resource file. This approach is useful for externalizing configurations and managing them separately from the code.

```java
builder.configurationParametersResource("junit-config.properties");
```

--------------------------------

### GET /configuration/parameters

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/config/PrefixedConfigurationParameters

Retrieves a configuration parameter by its key. It first checks the provided ConfigurationParameters, then JVM system properties, and finally the JUnit Platform properties file.

```APIDOC
## GET /configuration/parameters

### Description
Get the configuration parameter stored under the specified `key`. If no such key is present, an attempt will be made to look up the value as a JVM system property. If no such system property exists, an attempt will be made to look up the value in the JUnit Platform properties file.

### Method
GET

### Endpoint
`/configuration/parameters`

### Parameters
#### Path Parameters
None

#### Query Parameters
- **key** (string) - Required - The key to look up; never null or blank

#### Request Body
None

### Request Example
```json
{
  "key": "example.key"
}
```

### Response
#### Success Response (200)
- **value** (Optional<String>) - An Optional containing the configuration value; never null but potentially empty.

#### Response Example
```json
{
  "value": "example.value"
}
```
```

--------------------------------

### Extension Context and Store

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/extension/package-summary

APIs for managing the context and state during test execution for extensions.

```APIDOC
## Extension Context and Store

### Description
Provides mechanisms for extensions to access information about the current test execution context and to store/retrieve data.

### Method
N/A (These are interfaces/classes, not endpoints)

### Endpoint
N/A

### Parameters
N/A

### Request Example
N/A

### Response
N/A

## Key Components:

### `ExtensionContext`
Encapsulates the context in which the current test or container is being executed.

### `ExtensionContext.Store`
Provides methods for extensions to save and retrieve data within a scoped context.

### `ExtensionContext.Namespace`
Used to provide a scope for data saved within an `ExtensionContext.Store`.
```

--------------------------------

### testPlanExecutionStarted

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/listeners/SummaryGeneratingListener

Called when the execution of the TestPlan has started, before any test has been executed.

```APIDOC
## testPlanExecutionStarted

### Description
Called when the execution of the `TestPlan` has started, _before_ any test has been executed. This method is called from the same thread as `TestExecutionListener.testPlanExecutionFinished(TestPlan)`.

### Method
`public void testPlanExecutionStarted(TestPlan testPlan)`

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```java
// This method is typically called by the JUnit framework
listener.testPlanExecutionStarted(testPlan);
```

### Response
#### Success Response (200)
Void (This method does not return a value).

#### Response Example
N/A
```

--------------------------------

### Specify Expected Started Events (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/class-use/EventStatistics

Allows specifying the expected number of started test events using the `EventStatistics` class. This is used to verify that the correct number of tests have commenced execution.

```java
EventStatistics.started(long expected)
```

--------------------------------

### JUnit 5 @TestMethodOrder with @Order Annotation Example

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/TestMethodOrder

This example demonstrates how to use the @TestMethodOrder annotation with MethodOrderer.OrderAnnotation.class to control the execution order of test methods based on the @Order annotation.

```java
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
 class OrderedTests {

     @Test
     @Order(1)
     void nullValues() {}

     @Test
     @Order(2)
     void emptyValues() {}

     @Test
     @Order(3)
     void validValues() {}
 }
```

--------------------------------

### GenericBeforeAndAfterAdvice Interface

Source: https://docs.junit.org/current/api/org.junit.jupiter.migrationsupport/org/junit/jupiter/migrationsupport/rules/adapter/GenericBeforeAndAfterAdvice

This section details the methods available in the GenericBeforeAndAfterAdvice interface, including before, after, and handleTestExecutionException.

```APIDOC
## GenericBeforeAndAfterAdvice

### Description
This interface provides default methods for advice that executes before and after test methods, and for handling test execution exceptions.

### Status
INTERNAL

### Since
5.0

### Methods

#### `after()`

##### Description
Executes after the test method.

##### Method
default void

#### `before()`

##### Description
Executes before the test method.

##### Method
default void

#### `handleTestExecutionException(Throwable cause)`

##### Description
Handles exceptions thrown during test execution.

##### Method
default void

##### Throws
- `Throwable`
```

--------------------------------

### TestConsoleOutputOptions Constructor and Methods

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestConsoleOutputOptions

This section details the constructor and various methods available for the TestConsoleOutputOptions class, including methods for setting and getting output paths, color palettes, ANSI color output, details, and themes.

```APIDOC
## TestConsoleOutputOptions()

### Description
Constructs a new TestConsoleOutputOptions object.

### Method
Constructor

### Endpoint
N/A

### Parameters
None

### Request Example
```json
{
  "example": "new TestConsoleOutputOptions()"
}
```

### Response
#### Success Response (200)
Represents a new instance of TestConsoleOutputOptions.

#### Response Example
```json
{
  "example": "TestConsoleOutputOptions object"
}
```

## isAnsiColorOutputDisabled()

### Description
Checks if ANSI color output is disabled.

### Method
GET

### Endpoint
N/A

### Parameters
None

### Request Example
```json
{
  "example": "isAnsiColorOutputDisabled()"
}
```

### Response
#### Success Response (200)
- **boolean** - True if ANSI color output is disabled, false otherwise.

#### Response Example
```json
{
  "example": true
}
```

## setAnsiColorOutputDisabled(boolean ansiColorOutputDisabled)

### Description
Sets whether ANSI color output should be disabled.

### Method
POST

### Endpoint
N/A

### Parameters
#### Request Body
- **ansiColorOutputDisabled** (boolean) - Required - Specifies whether to disable ANSI color output.

### Request Example
```json
{
  "ansiColorOutputDisabled": true
}
```

### Response
#### Success Response (200)
Indicates successful setting of the ANSI color output disable flag.

#### Response Example
```json
{
  "example": "Settings updated"
}
```

## getColorPalettePath()

### Description
Gets the path to the color palette.

### Method
GET

### Endpoint
N/A

### Parameters
None

### Request Example
```json
{
  "example": "getColorPalettePath()"
}
```

### Response
#### Success Response (200)
- **Path** - The path to the color palette.

#### Response Example
```json
{
  "example": "/path/to/color/palette.json"
}
```

## setColorPalettePath(Path colorPalettePath)

### Description
Sets the path to the color palette.

### Method
POST

### Endpoint
N/A

### Parameters
#### Request Body
- **colorPalettePath** (Path) - Required - The path to the color palette.

### Request Example
```json
{
  "colorPalettePath": "/path/to/color/palette.json"
}
```

### Response
#### Success Response (200)
Indicates successful setting of the color palette path.

#### Response Example
```json
{
  "example": "Settings updated"
}
```

## isSingleColorPalette()

### Description
Checks if a single color palette is used.

### Method
GET

### Endpoint
N/A

### Parameters
None

### Request Example
```json
{
  "example": "isSingleColorPalette()"
}
```

### Response
#### Success Response (200)
- **boolean** - True if a single color palette is used, false otherwise.

#### Response Example
```json
{
  "example": false
}
```

## setSingleColorPalette(boolean singleColorPalette)

### Description
Sets whether to use a single color palette.

### Method
POST

### Endpoint
N/A

### Parameters
#### Request Body
- **singleColorPalette** (boolean) - Required - Specifies whether to use a single color palette.

### Request Example
```json
{
  "singleColorPalette": false
}
```

### Response
#### Success Response (200)
Indicates successful setting of the single color palette flag.

#### Response Example
```json
{
  "example": "Settings updated"
}
```

## getDetails()

### Description
Gets the details configuration for the output.

### Method
GET

### Endpoint
N/A

### Parameters
None

### Request Example
```json
{
  "example": "getDetails()"
}
```

### Response
#### Success Response (200)
- **Details** - The details configuration object.

#### Response Example
```json
{
  "example": {
    "type": "compact"
  }
}
```

## setDetails(Details details)

### Description
Sets the details configuration for the output.

### Method
POST

### Endpoint
N/A

### Parameters
#### Request Body
- **details** (Details) - Required - The details configuration object.

### Request Example
```json
{
  "details": {
    "type": "expanded"
  }
}
```

### Response
#### Success Response (200)
Indicates successful setting of the details configuration.

#### Response Example
```json
{
  "example": "Settings updated"
}
```

## getTheme()

### Description
Gets the theme for the console output.

### Method
GET

### Endpoint
N/A

### Parameters
None

### Request Example
```json
{
  "example": "getTheme()"
}
```

### Response
#### Success Response (200)
- **Theme** - The theme object for console output.

#### Response Example
```json
{
  "example": {
    "name": "default"
  }
}
```

## setTheme(Theme theme)

### Description
Sets the theme for the console output.

### Method
POST

### Endpoint
N/A

### Parameters
#### Request Body
- **theme** (Theme) - Required - The theme object for console output.

### Request Example
```json
{
  "theme": {
    "name": "dark"
  }
}
```

### Response
#### Success Response (200)
Indicates successful setting of the console theme.

#### Response Example
```json
{
  "example": "Settings updated"
}
```

## getStdoutPath()

### Description
Gets the path for standard output.

### Method
GET

### Endpoint
N/A

### Parameters
None

### Request Example
```json
{
  "example": "getStdoutPath()"
}
```

### Response
#### Success Response (200)
- **Path** - The path for standard output.

#### Response Example
```json
{
  "example": "/path/to/stdout.log"
}
```

## setStdoutPath(Path stdoutPath)

### Description
Sets the path for standard output.

### Method
POST

### Endpoint
N/A

### Parameters
#### Request Body
- **stdoutPath** (Path) - Required - The path for standard output.

### Request Example
```json
{
  "stdoutPath": "/path/to/stdout.log"
}
```

### Response
#### Success Response (200)
Indicates successful setting of the standard output path.

#### Response Example
```json
{
  "example": "Settings updated"
}
```

## getStderrPath()

### Description
Gets the path for standard error output.

### Method
GET

### Endpoint
N/A

### Parameters
None

### Request Example
```json
{
  "example": "getStderrPath()"
}
```

### Response
#### Success Response (200)
- **Path** - The path for standard error output.

#### Response Example
```json
{
  "example": "/path/to/stderr.log"
}
```

## setStderrPath(Path stderrPath)

### Description
Sets the path for standard error output.

### Method
POST

### Endpoint
N/A

### Parameters
#### Request Body
- **stderrPath** (Path) - Required - The path for standard error output.

### Request Example
```json
{
  "stderrPath": "/path/to/stderr.log"
}
```

### Response
#### Success Response (200)
Indicates successful setting of the standard error output path.

#### Response Example
```json
{
  "example": "Settings updated"
}
```
```

--------------------------------

### Open Launcher Session with Config (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherFactory

Factory method for opening a new LauncherSession using the supplied LauncherConfig. This allows for custom configuration of the session and launcher. It throws a PreconditionViolationException if the configuration is null or no test engines are detected.

```java
@API(status=STABLE, since="1.10") public static LauncherSession openSession(LauncherConfig config) throws PreconditionViolationException
```

--------------------------------

### Get Argument as String

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/aggregator/ArgumentsAccessor

Gets the argument at the specified index as a String, with automatic type conversion. Requires a valid index. The return value can be null. Throws ArgumentAccessException if access or conversion is not possible.

```java
String getString(int index) throws ArgumentAccessException
```

--------------------------------

### LauncherConfig.Builder Build Method

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherConfig

Method to finalize the configuration and build the LauncherConfig object.

```APIDOC
## POST /websites/junit_current/build

### Description
Builds and returns the final LauncherConfig object based on the configurations set via the builder methods.

### Method
POST

### Endpoint
/websites/junit_current

### Parameters
None

### Request Body
None

### Request Example
```json
{
  "action": "build"
}
```

### Response
#### Success Response (200)
- **launcherConfig** (object) - The constructed LauncherConfig object.

#### Response Example
```json
{
  "launcherConfig": {
    "testEngines": [],
    "launcherSessionListeners": [],
    "launcherDiscoveryListeners": [],
    "testExecutionListeners": [],
    "postDiscoveryFilters": []
  }
}
```
```

--------------------------------

### Get and Transform Configuration Parameter (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/ConfigurationParameters

Retrieves a configuration parameter by its key and transforms its String value into another type using a provided Function. It follows the same lookup order as get(String key). If the transformer throws an exception, it's wrapped in a JUnitException.

```java
default <T> Optional<T> get(String key, Function<String,T> transformer)
```

--------------------------------

### Get TestInstance.Lifecycle Enum Constants (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/class-use/TestInstance

This snippet demonstrates how to retrieve the enum constant of TestInstance.Lifecycle by its name and how to get all declared constants. These methods are part of the JUnit Jupiter API.

```java
static TestInstance.Lifecycle TestInstance.Lifecycle.valueOf(String name)
static TestInstance.Lifecycle[] TestInstance.Lifecycle.values()
```

--------------------------------

### TestInstances API Documentation

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/extension/TestInstances

This section details the methods available for interacting with test instances.

```APIDOC
## TestInstances API

### Description
`TestInstances` encapsulates the _test instances_ of a test. While top-level tests only have a single test instance, nested tests have one additional instance for each enclosing test class.

### API Details
- **Status**: STABLE
- **Since**: 5.7

### Methods

#### `findInstance(Class<T> requiredType)`

##### Description
Find the first test instance that is an instance of the supplied required type, checking from innermost to outermost.

##### Method
GET

##### Endpoint
`/api/testinstances/find`

##### Parameters

###### Query Parameters
- **requiredType** (Class) - Required - The type of the test instance to search for.

##### Response

###### Success Response (200)
- **instance** (Optional<T>) - The first test instance of the required type; never null but potentially empty.

###### Response Example
```json
{
  "instance": {
    "type": "com.example.MyTestInstance",
    "value": "..."
  }
}
```

#### `getAllInstances()`

##### Description
Get all test instances, ordered from outermost to innermost.

##### Method
GET

##### Endpoint
`/api/testinstances/all`

##### Response

###### Success Response (200)
- **instances** (List<Object>) - All test instances; never null, containing null, or empty.

###### Response Example
```json
{
  "instances": [
    {
      "type": "com.example.OuterInstance",
      "value": "..."
    },
    {
      "type": "com.example.InnerInstance",
      "value": "..."
    }
  ]
}
```

#### `getEnclosingInstances()`

##### Description
Get the enclosing test instances, excluding the innermost test instance, ordered from outermost to innermost.

##### Method
GET

##### Endpoint
`/api/testinstances/enclosing`

##### Response

###### Success Response (200)
- **instances** (List<Object>) - The enclosing test instances; never null or containing null, but potentially empty.

###### Response Example
```json
{
  "instances": [
    {
      "type": "com.example.OuterInstance",
      "value": "..."
    }
  ]
}
```

#### `getInnermostInstance()`

##### Description
Get the innermost test instance. The innermost instance is the one closest to the test method.

##### Method
GET

##### Endpoint
`/api/testinstances/innermost`

##### Response

###### Success Response (200)
- **instance** (Object) - The innermost test instance; never null.

###### Response Example
```json
{
  "instance": {
    "type": "com.example.InnermostInstance",
    "value": "..."
  }
}
```
```

--------------------------------

### Get Legacy Reporting Name - Java

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/descriptor/ClassBasedTestDescriptor

Gets the name of this descriptor in a format suitable for legacy reporting systems, such as the Ant-based XML reporting format for JUnit 4. The default implementation delegates to getDisplayName().

```java
public final String getLegacyReportingName()

Description copied from interface: TestDescriptor
Get the name of this descriptor in a format that is suitable for legacy reporting infrastructure — for example, for reporting systems built on the Ant-based XML reporting format for JUnit 4. 
The default implementation delegates to TestDescriptor.getDisplayName().

Specified by:
    getLegacyReportingName in interface TestDescriptor

Returns:
    the legacy reporting name; never null or blank
```

--------------------------------

### TestWatcher.testSuccessful Method Implementation Example (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/extension/TestWatcher

An example demonstrating the implementation of the `testSuccessful` method from the TestWatcher interface in Java. This method is called after a test completes successfully, providing an opportunity to perform actions such as recording metrics or logging success.

```java
@Override
default void testSuccessful(ExtensionContext context) {
    // Custom logic for successful tests
    System.out.println("Test successful: " + context.getDisplayName());
}
```

--------------------------------

### JUnit Jupiter Test Case Example

Source: https://docs.junit.org/current/user-guide/index

An example of a test class written using JUnit Jupiter, demonstrating various test annotations such as @Test, @Disabled, @Order, assertEquals, and assumeTrue. This class serves as a subject for testing with the JUnit Platform Test Kit.

```java
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import example.util.Calculator;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

@TestMethodOrder(OrderAnnotation.class)
public class ExampleTestCase {

    private final Calculator calculator = new Calculator();

    @Test
    @Disabled("for demonstration purposes")
    @Order(1)
    void skippedTest() {
        // skipped ...
    }

    @Test
    @Order(2)
    void succeedingTest() {
        assertEquals(42, calculator.multiply(6, 7));
    }

    @Test
    @Order(3)
    void abortedTest() {
        assumeTrue("abc".contains("Z"), "abc does not contain Z");
        // aborted ...
    }

    @Test
    @Order(4)
    void failingTest() {
        // The following throws an ArithmeticException: "/ by zero"
        calculator.divide(1, 0);
    }

}
```

--------------------------------

### LauncherDiscoveryListeners Factory Methods

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/listeners/discovery/LauncherDiscoveryListeners

Provides static factory methods for creating LauncherDiscoveryListener instances.

```APIDOC
## GET /launcher/discovery/listeners

### Description
This endpoint group provides factory methods for creating `LauncherDiscoveryListener` instances.

### Method
GET

### Endpoint
/launcher/discovery/listeners

### Parameters
#### Query Parameters
- **factory** (string) - Required - Specifies which factory method to use (e.g., `abortOnFailure`, `logging`, `composite`, `fromConfigurationParameter`).
- **listeners** (List<LauncherDiscoveryListener>) - Optional - Used with the `composite` factory to provide a list of listeners.
- **key** (string) - Optional - Used with the `fromConfigurationParameter` factory.
- **value** (string) - Optional - Used with the `fromConfigurationParameter` factory.

### Request Example
```json
{
  "factory": "logging"
}
```

### Response
#### Success Response (200)
- **LauncherDiscoveryListener** (object) - An instance of LauncherDiscoveryListener configured according to the specified factory method.

#### Response Example
```json
{
  "type": "LoggingLauncherDiscoveryListener"
}
```
```

--------------------------------

### TestWatcher.testDisabled Method Implementation Example (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/extension/TestWatcher

An example of how to implement the `testDisabled` method from the TestWatcher interface in Java. This method is invoked when a test is skipped due to being disabled, allowing for logging or other actions based on the provided reason.

```java
@Override
default void testDisabled(ExtensionContext context, Optional<String> reason) {
    // Custom logic for disabled tests
    System.out.println("Test disabled: " + context.getDisplayName() + ", Reason: " + reason.orElse("No reason provided"));
}
```

--------------------------------

### org.junit.platform.launcher Package Overview

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/package-use

This package contains the core public API for interacting with the JUnit Platform's test launching capabilities. It includes classes for discovering and executing tests, managing listeners, and defining filters.

```APIDOC
## Package: org.junit.platform.launcher

### Description
Public API for configuring and launching test plans.

### Key Classes

*   **Launcher**: The main entry point for discovering and executing tests.
*   **LauncherDiscoveryListener**: Interface for receiving notifications during test discovery.
*   **LauncherDiscoveryRequest**: Extends `EngineDiscoveryRequest` with additional filters for the `Launcher`.
*   **TestExecutionListener**: Interface for receiving notifications during test execution.
*   **TestIdentifier**: Represents a test or container in a `TestPlan`.
*   **TestPlan**: Describes the tree of tests and containers discovered by a `Launcher`.
```

--------------------------------

### LauncherConfig.Builder Add Methods

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherConfig

Methods for adding specific test engines, listeners, and filters to the LauncherConfig.

```APIDOC
## POST /websites/junit_current/add

### Description
Adds components such as test engines, listeners, and filters to the LauncherConfig. This is a conceptual endpoint representing builder pattern usage.

### Method
POST

### Endpoint
/websites/junit_current

### Parameters
#### Query Parameters
- **components** (array) - Required - An array of components (TestEngine, LauncherSessionListener, LauncherDiscoveryListener, TestExecutionListener, PostDiscoveryFilter) to add.

### Request Body
This section is not applicable as configuration is done via method chaining in the builder pattern.

### Request Example
```json
{
  "action": "add",
  "componentType": "testEngines",
  "components": [
    "com.example.MyTestEngine"
  ]
}
```

### Response
#### Success Response (200)
- **message** (string) - Indicates successful addition of components.

#### Response Example
```json
{
  "message": "Components added successfully."
}
```
```

--------------------------------

### Get Boolean Configuration Parameter by Key (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/config/PrefixedConfigurationParameters

Retrieves a boolean configuration parameter by its key. Similar to the String get method, it first checks the ConfigurationParameters, then JVM system properties, and finally the JUnit Platform properties file. Returns an Optional containing the Boolean value, which may be empty.

```Java
public Optional<Boolean> getBoolean(String key)
```

--------------------------------

### TestWatcher.testFailed Method Implementation Example (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/extension/TestWatcher

An example of implementing the `testFailed` method of the TestWatcher interface in Java. This method is executed when a test fails, enabling custom error handling or reporting based on the provided cause of failure.

```java
@Override
default void testFailed(ExtensionContext context, Throwable cause) {
    // Custom logic for failed tests
    System.err.println("Test failed: " + context.getDisplayName() + ", Cause: " + (cause != null ? cause.getMessage() : "null"));
}
```

--------------------------------

### JUnit Launcher Request Output Directory Provider Configuration

Source: https://docs.junit.org/current/api/index-files/index-15

Specifies how to set the OutputDirectoryProvider for a launcher discovery request. This provider is responsible for determining where test engines should write their reports and output files. Multiple builder classes support this configuration.

```java
LauncherDiscoveryRequestBuilder requestBuilder = LauncherDiscoveryRequestBuilder.request();
requestBuilder.outputDirectoryProvider(myProvider);
```

```java
SuiteLauncherDiscoveryRequestBuilder suiteBuilder = SuiteLauncherDiscoveryRequestBuilder.request();
suiteBuilder.outputDirectoryProvider(myProvider);
```

```java
EngineTestKit.Builder engineBuilder = EngineTestKit.builder();
engineBuilder.outputDirectoryProvider(myProvider);
```

--------------------------------

### Test Suite with JUnitPlatform Runner

Source: https://docs.junit.org/current/user-guide/index

Illustrates creating a test suite to run multiple test classes. Annotate the suite class with `@RunWith(JUnitPlatform.class)`, `@SuiteDisplayName`, and `@SelectPackages`.

```APIDOC
## RUNWITH JUNITPLATFORM SUITE

### Description
This section describes how to create a test suite using the `JUnitPlatform` runner to execute multiple test classes. It uses annotations like `@SelectPackages` to specify which packages to scan for tests.

### Method
N/A (Configuration via Annotation)

### Endpoint
N/A (Local Class Execution)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
```java
import org.junit.platform.suite.api.SelectPackages;
import org.junit.platform.suite.api.SuiteDisplayName;
import org.junit.runner.RunWith;

@RunWith(org.junit.platform.runner.JUnitPlatform.class)
@SuiteDisplayName("JUnit Platform Suite Demo")
@SelectPackages("example")
public class JUnitPlatformSuiteDemo {
}
```

### Response
#### Success Response (200)
All tests within the specified packages are discovered and executed.

#### Response Example
N/A (Execution output depends on test results)
```

--------------------------------

### Get Argument as Boolean

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/aggregator/DefaultArgumentsAccessor

Retrieves the argument at the specified index as a Boolean. This method performs automatic type conversion if the argument is not already a Boolean. It's a convenient way to get boolean values from test parameters.

```java
Boolean getBoolean(int index)
```

--------------------------------

### ThrowingSupplier get() Method (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/function/ThrowingSupplier

The abstract method 'get' within the ThrowingSupplier interface. It retrieves a result of type T and is declared to throw a Throwable, accommodating checked exceptions. This is the core method used in lambda implementations.

```java
T get() throws Throwable;
```

--------------------------------

### Creating FileEntry Instances in JUnit Platform

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/reporting/class-use/FileEntry

Shows how to create a FileEntry instance using a static factory method. This method takes a Path and a media type as input. It is primarily used within the JUnit Platform engine reporting.

```java
static FileEntry from(Path path, String mediaType)
```

--------------------------------

### Create LauncherDiscoveryListener from Configuration (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/listeners/discovery/LauncherDiscoveryListeners

Creates a LauncherDiscoveryListener based on a configuration parameter key and value. This allows for dynamic configuration of discovery listeners.

```java
LauncherDiscoveryListener listener = LauncherDiscoveryListeners.fromConfigurationParameter("some.key", "some.value");
```

--------------------------------

### Java Example: Using @DisabledIf with External Condition Method

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/condition/DisabledIf

This example illustrates using @DisabledIf with a condition method located in an external class. The condition method 'isEncryptionSupported' from 'com.example.Conditions' is referenced using its fully qualified name.

```java
@DisabledIf(value = "com.example.Conditions#isEncryptionSupported", disabledReason = "Encryption not supported")
@Test
void testSecureFeature() {
    // ... test logic ...
}
```

--------------------------------

### Java @TestFactory with DynamicContainer Example

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/TestFactory

This Java code example illustrates using @TestFactory to create a dynamic container that holds multiple dynamic tests. This allows for organizing related dynamic tests under a common name, improving test suite readability and structure.

```java
@TestFactory
public DynamicContainer dynamicContainer() {
    return DynamicContainer.dynamicContainer("Group 1", Stream.of(
        DynamicTest.dynamicTest("Add", () -> assertEquals(5, 2 + 3)),
        DynamicTest.dynamicTest("Subtract", () -> assertEquals(1, 3 - 2))
    ));
}
```

--------------------------------

### Get and Transform Configuration Parameter by Key (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/config/PrefixedConfigurationParameters

Retrieves a configuration parameter by its key and applies a transformer function to its value. It follows the same lookup order as other get methods. If the transformer throws an exception, it's wrapped in a JUnitException. Returns an Optional containing the transformed value.

```Java
public <T> Optional<T> get(String key, Function<String,T> transformer)
```

--------------------------------

### Get ArgumentCountValidationMode Enum Constants - Java

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/class-use/ArgumentCountValidationMode

Demonstrates how to retrieve all constants of the ArgumentCountValidationMode enum using the `values()` method, and how to get a specific constant by its name using the `valueOf()` method. These methods are part of the Java Reflection API.

```java
static ArgumentCountValidationMode[] values()
Returns an array containing the constants of this enum class, in the order they are declared.

static ArgumentCountValidationMode valueOf(String name)
Returns the enum constant of this class with the specified name.
```

--------------------------------

### Discover Tests with LauncherDiscoveryRequest (Launcher Interface)

Source: https://docs.junit.org/current/api/index-files/index-4

The `Launcher` interface's `discover` method discovers tests and builds a `TestPlan` based on the `LauncherDiscoveryRequest`. It queries all registered engines and aggregates their results. The input is a `LauncherDiscoveryRequest`, and the output is a `TestPlan`.

```java
Launcher launcher = ...; // Obtain a Launcher instance
TestPlan plan = launcher.discover(new LauncherDiscoveryRequest(...));
```

--------------------------------

### Detect Conflicting ParameterResolvers for Same Type in JUnit

Source: https://docs.junit.org/current/user-guide/index

This example demonstrates a scenario where multiple ParameterResolver implementations support the same parameter type (int). JUnit throws a ParameterResolutionException in such cases due to ambiguity. The example shows two competing resolvers for the 'int' type.

```java
public class ParameterResolverConflictDemo {

    @Test
    @ExtendWith({ FirstIntegerResolver.class, SecondIntegerResolver.class })
    void testInt(int i) {
        // Test will not run due to ParameterResolutionException
        assertEquals(1, i);
    }

    static class FirstIntegerResolver implements ParameterResolver {

        @Override
        public boolean supportsParameter(ParameterContext parameterContext, ExtensionContext extensionContext) {
            return parameterContext.getParameter().getType() == int.class;
        }

        @Override
        public Object resolveParameter(ParameterContext parameterContext, ExtensionContext extensionContext) {
            return 1;
        }
    }

    static class SecondIntegerResolver implements ParameterResolver {

        @Override
        public boolean supportsParameter(ParameterContext parameterContext, ExtensionContext extensionContext) {
            return parameterContext.getParameter().getType() == int.class;
        }

        @Override
        public Object resolveParameter(ParameterContext parameterContext, ExtensionContext extensionContext) {
            return 2;
        }
    }
}
```

--------------------------------

### FileEntry Class Documentation

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/reporting/FileEntry

Provides details on the FileEntry class, its constructors, and methods.

```APIDOC
## Class: FileEntry

### Description
`FileEntry` encapsulates a file or directory to be published to the reporting infrastructure.

Since: 1.12
Status: MAINTAINED
Since Version: 1.13.3

### Methods

#### `static FileEntry from(Path path, String mediaType)`
Factory for creating a new `FileEntry` from the supplied path and media type.

##### Parameters
- **path** (Path) - Required - the path to publish; never null
- **mediaType** (String) - Optional - the media type of the path to publish; may be null

#### `Optional<String> getMediaType()`
Get the media type of the path to be published.

##### Returns
- Optional<String> - the media type of the path to publish; never null

#### `Path getPath()`
Get the path to be published.

##### Returns
- Path - the path to publish; never null

#### `LocalDateTime getTimestamp()`
Get the timestamp for when this `FileEntry` was created.

##### Returns
- LocalDateTime - when this entry was created; never null

#### `String toString()`
Overrides the default toString method from Object.

##### Returns
- String - a string representation of the FileEntry object.

### See Also
- `from(Path, String)`
```

--------------------------------

### Constructor Summary

Source: https://docs.junit.org/current/api/org.junit.vintage.engine/org/junit/vintage/engine/descriptor/VintageTestDescriptor

Lists constructors available for `VintageTestDescriptor`.

```APIDOC
## Constructor Summary

### VintageTestDescriptor

- `VintageTestDescriptor(UniqueId uniqueId, Description description, TestSource source)`
  - Description: Creates a new `VintageTestDescriptor`.
```

--------------------------------

### JUnit JRE Get Current Version Number Method

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/condition/JRE

A static method to retrieve the integer version number of the currently executing JVM. This method is maintained and provides a direct way to get the numerical representation of the Java version.

```java
@API(status=MAINTAINED, since="5.13.3") public static int currentVersionNumber()

Returns:
```

--------------------------------

### Discover Tests with EngineTestKit Builder

Source: https://docs.junit.org/current/api/index-files/index-4

This snippet demonstrates how to use the `EngineTestKit.Builder` to discover tests. It configures the `TestEngine`, discovery selectors, filters, and configuration parameters for the test discovery process. No specific dependencies are mentioned, and the output is the discovered tests.

```java
EngineTestKit.builder().execute("my.test.engine.id").find("my.test.selector").build();
```

--------------------------------

### VintageTestDescriptor Constructor and Methods (Java)

Source: https://docs.junit.org/current/api/org.junit.vintage.engine/org/junit/vintage/engine/descriptor/VintageTestDescriptor

Demonstrates the constructor and key methods of the VintageTestDescriptor class. This includes methods for getting the description, legacy reporting name, type, tags, and for managing the descriptor's presence in the test hierarchy.

```java
public VintageTestDescriptor(UniqueId uniqueId, Description description, TestSource source)

public Description getDescription()

public String getLegacyReportingName()

public TestDescriptor.Type getType()

public Set<TestTag> getTags()

public void removeFromHierarchy()

protected boolean canBeRemovedFromHierarchy()

protected boolean tryToExcludeFromRunner(Description description)
```

--------------------------------

### Listing Available Test Engines

Source: https://docs.junit.org/current/user-guide/index

Command to list all available test engines discovered by JUnit. Useful for understanding which testing frameworks are integrated.

```bash
java -jar junit-console.jar engines
```

--------------------------------

### Accept Visitor - Java

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/TestDescriptor

Accepts a TestDescriptor.Visitor to traverse the subtree starting from this descriptor. This is a default method.

```java
default void accept(TestDescriptor.Visitor visitor)
// Parameters: `visitor` - the `TestDescriptor.Visitor` to accept.
```

--------------------------------

### JUnit 5 @AutoClose Extension Example

Source: https://docs.junit.org/current/user-guide

Demonstrates how to use the @AutoClose extension to automatically close a resource after a test method. The annotated field must implement a close() method or a custom close method name can be specified. This example assumes default TestInstance.PER_METHOD semantics.

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.RegisterExtension;
// Assuming WebClient and its close() method are defined elsewhere

class AutoCloseDemo {

    @RegisterExtension
    @AutoClose
    WebClient webClient = new WebClient();

    String serverUrl = "http://example.com"; // Specify server URL

    @Test
    void getProductList() {
        // Use WebClient to connect to web server and verify response
        // Example usage:
        // assertEquals(200, webClient.get(serverUrl + "/products").getResponseStatus());
    }

}

// Dummy WebClient class for demonstration purposes
class WebClient implements java.lang.AutoCloseable {
    public void close() {
        System.out.println("WebClient closed.");
    }
    // Dummy get method
    public Response get(String url) {
        return new Response(200);
    }
}

// Dummy Response class
class Response {
    private int status;
    public Response(int status) {
        this.status = status;
    }
    public int getResponseStatus() {
        return status;
    }
}

```

--------------------------------

### LauncherStoreFacade Constructor - Java

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/descriptor/LauncherStoreFacade

Initializes a new instance of the LauncherStoreFacade class. This constructor requires a NamespacedHierarchicalStore to manage requests at the namespace level.

```java
public LauncherStoreFacade(NamespacedHierarchicalStore<Namespace> requestLevelStore)
```

--------------------------------

### Broken Lifecycle Method Configuration Demo (Java)

Source: https://docs.junit.org/current/user-guide/index

An example class demonstrating a broken lifecycle method configuration in JUnit 5. This class highlights issues where test data insertion occurs before database connection and database connection closure happens before test data deletion, leading to potential test failures. It serves as a cautionary example regarding the deterministic but non-obvious execution order of lifecycle methods within a single test class.

```java
import static example.callbacks.Logger.afterEachMethod;
import static example.callbacks.Logger.beforeEachMethod;
import static example.callbacks.Logger.testMethod;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

/**
 * Example of "broken" lifecycle method configuration.
 *
 * <p>Test data is inserted before the database connection has been opened.
 *
 * <p>Database connection is closed before deleting test data.
 */
```

--------------------------------

### Create JUnit Launcher with Custom Configuration

Source: https://docs.junit.org/current/api/org.junit.platform.commons/org/junit/platform/commons/class-use/PreconditionViolationException

Factory method to create a new Launcher instance using a supplied LauncherConfig. This allows for customized Launcher behavior.

```java
static Launcher
LauncherFactory.create(LauncherConfig config)
```

--------------------------------

### JUnit 5 @AutoClose Extension Example

Source: https://docs.junit.org/current/user-guide/index

Demonstrates how to use the @AutoClose extension to automatically close resources. The annotated field must implement a close() method (or a method specified by the 'value' attribute), and it will be invoked after test execution. This example assumes default PER_METHOD lifecycle semantics.

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.AutoCloseableResource;

// Assuming WebClient implements AutoCloseable or has a close() method
class WebClient implements AutoCloseable {
    @Override
    public void close() {
        System.out.println("WebClient closed.");
    }
    public int getResponseStatus() {
        // Dummy implementation
        return 200;
    }
}

class AutoCloseDemo {

    @AutoCloseableResource
    WebClient webClient = new WebClient();

    String serverUrl = "http://example.com"; // specify server URL ...

    @Test
    void getProductList() {
        // Use WebClient to connect to web server and verify response
        assertEquals(200, webClient.getResponseStatus());
    }

    // Dummy assertEquals for compilation
    private void assertEquals(int expected, int actual) {
        if (expected != actual) {
            throw new AssertionError("Expected " + expected + " but got " + actual);
        }
    }

    // Dummy @AutoCloseableResource annotation for compilation
    @interface AutoCloseableResource {
        String value() default "close";
    }

    // Dummy @Test annotation for compilation
    @interface Test {
    }
}

```

--------------------------------

### Create SuiteLauncherDiscoveryRequestBuilder Instance

Source: https://docs.junit.org/current/api/org.junit.platform.suite.commons/org/junit/platform/suite/commons/class-use/SuiteLauncherDiscoveryRequestBuilder

This snippet demonstrates how to create a new instance of the SuiteLauncherDiscoveryRequestBuilder using the static `request()` method. This builder is essential for constructing discovery requests for JUnit test suites.

```java
SuiteLauncherDiscoveryRequestBuilder builder = SuiteLauncherDiscoveryRequestBuilder.request();
```

--------------------------------

### OS Enum - Get Current OS

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/condition/class-use/OS

Retrieves the current operating system.

```APIDOC
## GET /os/current

### Description
Get the current operating system.

### Method
GET

### Endpoint
/os/current

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **OS** (OS) - The current operating system.

#### Response Example
```json
{
  "os": "WINDOWS"
}
```
```

--------------------------------

### Java Example: Using @DisabledIf with a Condition Method

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/condition/DisabledIf

This example demonstrates how to use the @DisabledIf annotation in Java. It shows a test method annotated with @DisabledIf, specifying a condition method 'isNotProduction' to determine if the test should be disabled. The condition method is defined within the same class.

```java
@DisabledIf("isNotProduction")
@Test
void testSomethingOnlyInProduction() {
    // ... test logic ...
}

static boolean isNotProduction() {
    return !"production".equalsIgnoreCase(System.getenv("ENV"));
}
```

--------------------------------

### Get CleanupMode Enum Constants (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/io/class-use/CleanupMode

This snippet demonstrates how to retrieve CleanupMode enum constants in Java. It includes methods for obtaining an enum constant by its name and for getting all available constants in an array. These are fundamental operations for working with enums in Java.

```java
static CleanupMode valueOf(String name)
Returns the enum constant of this class with the specified name.
static CleanupMode[] values()
Returns an array containing the constants of this enum class, in the order they are declared.
```

--------------------------------

### Discovering Tests with JUnit Platform Launcher API

Source: https://docs.junit.org/current/user-guide

Demonstrates how to build a `LauncherDiscoveryRequest` to discover tests. It uses selectors to specify which tests to find (e.g., by package or class) and filters to refine the selection (e.g., by class name pattern). The request is then used to obtain a `TestPlan` via the `Launcher`.

```java
LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder.request()
    .selectors(
        selectPackage("com.example.mytests"),
        selectClass(MyTestClass.class)
    )
    .filters(
        includeClassNamePatterns(".*Tests")
    )
    .build();

try (LauncherSession session = LauncherFactory.openSession()) {
    TestPlan testPlan = session.getLauncher().discover(request);

    // ... discover additional test plans or execute tests
}
```

--------------------------------

### LauncherSessionListener Interface for Session Events

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/class-use/LauncherSession

Provides an example of implementing the LauncherSessionListener interface to react to launcher session lifecycle events. Implementations can perform actions when a session is opened or closed.

```java
import org.junit.platform.launcher.LauncherSession;
import org.junit.platform.launcher.LauncherSessionListener;

public class MySessionListener implements LauncherSessionListener {

    @Override
    public void launcherSessionOpened(LauncherSession session) {
        System.out.println("Launcher session opened: " + session);
        // Add custom logic for session opened event
    }

    @Override
    public void launcherSessionClosed(LauncherSession session) {
        System.out.println("Launcher session closed: " + session);
        // Add custom logic for session closed event
    }
}
```

--------------------------------

### JUnit Lifecycle Method Configuration Example (Java)

Source: https://docs.junit.org/current/user-guide

This Java code demonstrates a JUnit test class with multiple @BeforeEach and @AfterEach methods. It highlights a potential issue where the order of execution might not be as expected if dependencies exist between these methods, as recommended by JUnit.

```java
@ExtendWith({ Extension1.class, Extension2.class })
class BrokenLifecycleMethodConfigDemo {

    @BeforeEach
    void connectToDatabase() {
        beforeEachMethod(getClass().getSimpleName() + ".connectToDatabase()")
    }

    @BeforeEach
    void insertTestDataIntoDatabase() {
        beforeEachMethod(getClass().getSimpleName() + ".insertTestDataIntoDatabase()")
    }

    @Test
    void testDatabaseFunctionality() {
        testMethod(getClass().getSimpleName() + ".testDatabaseFunctionality()")
    }

    @AfterEach
    void deleteTestDataFromDatabase() {
        afterEachMethod(getClass().getSimpleName() + ".deleteTestDataFromDatabase()")
    }

    @AfterEach
    void disconnectFromDatabase() {
        afterEachMethod(getClass().getSimpleName() + ".disconnectFromDatabase()")
    }

}
```

--------------------------------

### LauncherDiscoveryListener Methods

Source: https://docs.junit.org/current/api/org.junit.platform.jfr/org/junit/platform/jfr/FlightRecordingDiscoveryListener

Methods related to the overall test discovery process for the launcher.

```APIDOC
## POST /junit-platform/launcher/discovery/started

### Description
Called when test discovery is about to be started by the launcher. This method is part of the `LauncherDiscoveryListener` interface.

### Method
POST

### Endpoint
`/junit-platform/launcher/discovery/started`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **request** (LauncherDiscoveryRequest) - Required - The request for which discovery is being started.

### Request Example
```json
{
  "request": { ... }
}
```

### Response
#### Success Response (200)
N/A (This is a listener callback, no direct response is expected).

#### Response Example
```json
{
  "status": "callback received"
}
```

## POST /junit-platform/launcher/discovery/finished

### Description
Called when test discovery has finished for the launcher. This method is part of the `LauncherDiscoveryListener` interface.

### Method
POST

### Endpoint
`/junit-platform/launcher/discovery/finished`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **request** (LauncherDiscoveryRequest) - Required - The request for which discovery has finished.

### Request Example
```json
{
  "request": { ... }
}
```

### Response
#### Success Response (200)
N/A (This is a listener callback, no direct response is expected).

#### Response Example
```json
{
  "status": "callback received"
}
```
```

--------------------------------

### JavaDoc Search Examples

Source: https://docs.junit.org/current/api/help-doc

Illustrates how to use the Javadoc search functionality with different query types, including partial names, camelCase abbreviations, and multiple search terms. The search can identify modules, packages, types, fields, methods, and system properties.

```text
"j.l.obj" matches "java.lang.Object"
"InpStr" matches "java.io.InputStream"
"math exact long" matches "java.lang.Math.absExact(long)"
```

--------------------------------

### Get OutputDirectoryProvider in JUnit Platform Launcher

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/reporting/class-use/OutputDirectoryProvider

Demonstrates retrieving the `OutputDirectoryProvider` from a `TestPlan` in the JUnit Platform launcher. This provider is associated with the test plan for managing output.

```java
/**
 * Get the {@code OutputDirectoryProvider} for this test plan.
 *
 * @return the {@code OutputDirectoryProvider}
 */
OutputDirectoryProvider getOutputDirectoryProvider();
```

--------------------------------

### TestConsoleOutputOptions Constructor

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestConsoleOutputOptions

The default constructor for the `TestConsoleOutputOptions` class. It initializes a new instance with default settings for console output configuration. No parameters are required.

```java
public TestConsoleOutputOptions()

```

--------------------------------

### LoggerFactory API

Source: https://docs.junit.org/current/api/org.junit.platform.commons/org/junit/platform/commons/logging/LoggerFactory

Provides methods to get a Logger for a given class and manage LogRecordListeners.

```APIDOC
## GET /logger/{className}

### Description
Get a `Logger` for the specified class.

### Method
GET

### Endpoint
/logger/{className}

### Parameters
#### Path Parameters
- **className** (string) - Required - The fully qualified name of the class for which to get the logger.

### Response
#### Success Response (200)
- **Logger** (object) - The logger instance for the specified class.

#### Response Example
```json
{
  "logger": {
    "name": "org.example.MyClass"
  }
}
```

---

## POST /logger/listeners

### Description
Add a `LogRecordListener` to the set of registered listeners.

### Method
POST

### Endpoint
/logger/listeners

### Parameters
#### Request Body
- **listener** (object) - Required - The LogRecordListener to add.

### Request Example
```json
{
  "listener": { 
    "type": "org.junit.platform.commons.logging.LogRecordListener"
  }
}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message that the listener was added.

#### Response Example
```json
{
  "message": "LogRecordListener added successfully."
}
```

---

## DELETE /logger/listeners

### Description
Remove a `LogRecordListener` from the set of registered listeners.

### Method
DELETE

### Endpoint
/logger/listeners

### Parameters
#### Request Body
- **listener** (object) - Required - The LogRecordListener to remove.

### Request Example
```json
{
  "listener": { 
    "type": "org.junit.platform.commons.logging.LogRecordListener"
  }
}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message that the listener was removed.

#### Response Example
```json
{
  "message": "LogRecordListener removed successfully."
}
```
```

--------------------------------

### ExtensionContext.Store Methods

Source: https://docs.junit.org/current/api/index-files/index-7

Methods for managing data within the Extension Context Store.

```APIDOC
## get(Object)

### Description
Get the value that is stored under the supplied `key`.

### Method
GET

### Endpoint
/junit-jupiter/api/extension/ExtensionContext/Store

### Parameters
#### Path Parameters
- **key** (Object) - Required - The key under which the value is stored.

### Request Example
```json
{
  "key": "myCustomKey"
}
```

### Response
#### Success Response (200)
- **value** (Object) - The value stored under the given key, or null if not found.

#### Response Example
```json
{
  "value": "storedData"
}
```

---

## get(Object, Class<V>)

### Description
Get the value of the specified required type that is stored under the supplied `key`.

### Method
GET

### Endpoint
/junit-jupiter/api/extension/ExtensionContext/Store

### Parameters
#### Path Parameters
- **key** (Object) - Required - The key under which the value is stored.
- **requiredType** (Class<V>) - Required - The required type of the value.

### Request Example
```json
{
  "key": "myCustomKey",
  "requiredType": "java.lang.String"
}
```

### Response
#### Success Response (200)
- **value** (V) - The value stored under the given key, cast to the required type, or null if not found.

#### Response Example
```json
{
  "value": "storedStringData"
}
```
```

--------------------------------

### Create Launcher Instance (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherFactory

Factory method for creating a new Launcher using the default LauncherConfig. This method automatically discovers test engines and listeners via ServiceLoader. It throws a PreconditionViolationException if no test engines are detected.

```java
public static Launcher create() throws PreconditionViolationException
```

--------------------------------

### Instantiate ServiceLoaderTestEngineRegistry Constructor - Java

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/ServiceLoaderTestEngineRegistry

This is the default constructor for the ServiceLoaderTestEngineRegistry class. It initializes a new instance of the registry. No parameters are required.

```java
public ServiceLoaderTestEngineRegistry()
```

--------------------------------

### Visiting Test Plans and Descriptors

Source: https://docs.junit.org/current/api/index-files/index-1

Shows how to accept visitors for depth-first traversal of a TestPlan and for visiting TestDescriptors and their subtrees.

```java
org.junit.platform.launcher.TestPlan.accept(TestPlan.Visitor)
org.junit.platform.engine.TestDescriptor.accept(TestDescriptor.Visitor)
```

--------------------------------

### TerminationInfo - Get Details

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/TerminationInfo

Methods to retrieve the skip reason or execution result from a TerminationInfo instance.

```APIDOC
## GET /api/terminationinfo/details

### Description
Retrieves specific details from a `TerminationInfo` instance.

### Method
GET

### Endpoint
/api/terminationinfo/{id}/details

### Parameters
#### Path Parameters
- **id** (String) - Required - The unique identifier for the `TerminationInfo` instance.

#### Query Parameters
- **detailType** (String) - Required - Specifies the detail to retrieve. Accepted values: "skipReason", "executionResult".

### Request Example
```json
{
  "example": "GET /api/terminationinfo/123/details?detailType=skipReason"
}
```

### Response
#### Success Response (200)
- **detail** (String or TestExecutionResult) - The requested detail (skip reason as a String, or `TestExecutionResult` object). Throws `UnsupportedOperationException` if the detail type is not applicable.

#### Response Example
```json
{
  "example": "Test was cancelled due to timeout."
}
```
```

--------------------------------

### Configure JUnit Platform via LauncherDiscoveryRequestBuilder

Source: https://docs.junit.org/current/user-guide/index

Demonstrates how to set configuration parameters for the JUnit Platform using the `LauncherDiscoveryRequestBuilder`. This method is part of the Launcher API for building discovery requests, allowing for fine-grained control over test execution and engine behavior through key-value pairs. It is a programmatic approach to configuration.

```java
LauncherDiscoveryRequestBuilder requestBuilder = LauncherDiscoveryRequestBuilder.request();

// Add a single configuration parameter
requestBuilder.configurationParameter("key1", "value1");

// Add multiple configuration parameters
Map<String, String> params = new HashMap<>();
params.put("key2", "value2");
params.put("key3", "value3");
requestBuilder.configurationParameters(params);
```

--------------------------------

### CompositeTestSource getSources()

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/class-use/TestSource

Gets an immutable list of the sources stored in this CompositeTestSource.

```APIDOC
## CompositeTestSource getSources()

### Description
Get an immutable list of the sources stored in this `CompositeTestSource`.

### Method
GET

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "example": "Not applicable for method call"
}
```

### Response
#### Success Response (200)
- **sources** (List<TestSource>) - An immutable list of TestSources.

#### Response Example
```json
{
  "sources": [
    "TestSource object 1",
    "TestSource object 2"
  ]
}
```
```

--------------------------------

### Get Selected Packages - Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestDiscoveryOptions

Retrieves a list of package selectors, specifying packages to scan for tests.

```java
List<PackageSelector> selectedPackages = discoveryOptions.getSelectedPackages();
```

--------------------------------

### Create Launcher Instance using LauncherFactory

Source: https://docs.junit.org/current/api/index-files/index-3

Factory method for creating a new `Launcher` instance. It can be created using default configuration or a custom `LauncherConfig`.

```java
Launcher launcher = LauncherFactory.create();
Launcher launcherWithConfig = LauncherFactory.create(launcherConfig);
```

--------------------------------

### Execute Test Plan with Launcher in JUnit

Source: https://docs.junit.org/current/api/index-files/index-5

Executes a test plan using the JUnit Launcher interface. This involves building a TestPlan based on discovery requests, querying registered engines, collecting results, and notifying listeners about the execution progress and outcomes.

```java
execute(LauncherDiscoveryRequest, TestExecutionListener...) - Method in interface org.junit.platform.launcher.Launcher
    
Execute a `TestPlan` which is built according to the supplied `LauncherDiscoveryRequest` by querying all registered engines and collecting their results, and notify registered listeners about the progress and results of the execution.
```

```java
execute(TestPlan, TestExecutionListener...) - Method in interface org.junit.platform.launcher.Launcher
    
Execute the supplied `TestPlan` and notify registered listeners about the progress and results of the execution.
```

--------------------------------

### Get Selected Directories - Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestDiscoveryOptions

Retrieves a list of directory selectors, specifying directories to scan for tests.

```java
List<DirectorySelector> selectedDirectories = discoveryOptions.getSelectedDirectories();
```

--------------------------------

### Open Launcher Session (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherFactory

Factory method for opening a new LauncherSession using the default LauncherConfig. This method automatically discovers test engines and listeners. It throws a PreconditionViolationException if no test engines are detected.

```java
public static LauncherSession openSession() throws PreconditionViolationException
```

--------------------------------

### Execute JUnit Tests with Selectors

Source: https://docs.junit.org/current/user-guide

This command-line usage demonstrates how to execute JUnit tests using various selectors to specify which tests to run. It supports selecting tests by URI, file, directory, package, class, method, resource, iteration, or unique ID. Options like '--scan-classpath' and '--scan-modules' are available for automatic test discovery.

```bash
Usage: junit execute [OPTIONS]
Execute tests
      [@<filename>...]       One or more argument files containing options.
      --disable-ansi-colors  Disable ANSI colors in output (not supported by all terminals).
      --disable-banner       Disable print out of the welcome message.
  -h, --help                 Display help information.
      --version              Display version information.

SELECTORS

      --scan-classpath, --scan-class-path[=PATH]
                             Scan all directories on the classpath or explicit classpath
                               roots. Without arguments, only directories on the system
                               classpath as well as additional classpath entries supplied via
                               -cp (directories and JAR files) are scanned. Explicit classpath
                               roots that are not on the classpath will be silently ignored.
                               This option can be repeated.
      --scan-modules         Scan all resolved modules for test discovery.
  -u, --select-uri=URI...    Select a URI for test discovery. This option can be repeated.
  -f, --select-file=FILE...  Select a file for test discovery. The line and column numbers can
                               be provided as URI query parameters (e.g. foo.txt?
                               line=12&column=34). This option can be repeated.
  -d, --select-directory=DIR...
                             Select a directory for test discovery. This option can be
                               repeated.
  -o, --select-module=NAME...
                             Select single module for test discovery. This option can be
                               repeated.
  -p, --select-package=PKG...
                             Select a package for test discovery. This option can be repeated.
  -c, --select-class=CLASS...
                             Select a class for test discovery. This option can be repeated.
  -m, --select-method=NAME...
                             Select a method for test discovery. This option can be repeated.
  -r, --select-resource=RESOURCE...
                             Select a classpath resource for test discovery. This option can
                               be repeated.
  -i, --select-iteration=PREFIX:VALUE[INDEX(..INDEX)?(,INDEX(..INDEX)?)*]...
                             Select iterations for test discovery via a prefixed identifier
                               and a list of indexes or index ranges (e.g. method:com.acme.
                               Foo#m()[1..2] selects the first and second iteration of the m()
                               method in the com.acme.Foo class). This option can be repeated.
      --uid, --select-unique-id=UNIQUE-ID...
                             Select a unique id for test discovery. This option can be
                               repeated.
      --select=PREFIX:VALUE...
                             Select via a prefixed identifier (e.g. method:com.acme.Foo#m
                               selects the m() method in the com.acme.Foo class). This option
                               can be repeated.

  For more information on selectors including syntax examples, see
  https://docs.junit.org/1.13.4/user-guide/#running-tests-discovery-selectors

```

--------------------------------

### Get Configuration Parameter (Java) - org.junit.jupiter.api.extension.ExtensionContext

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves a configuration parameter by its key. This method is available in the extension context.

```Java
java.lang.String org.junit.jupiter.api.extension.ExtensionContext.getConfigurationParameter(String key)
```

--------------------------------

### Java @Timeout Annotation Example for Polling Tests

Source: https://docs.junit.org/current/user-guide

Demonstrates how to use the @Timeout annotation in JUnit Jupiter to set a maximum execution time for asynchronous tests that involve polling. This prevents tests from hanging indefinitely if an asynchronous operation never completes. The example shows a test method that polls until a condition is met, with a timeout of 5 seconds.

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

class AsyncPollingTest {

    @Test
    @Timeout(5) // Poll at most 5 seconds
    void pollUntil() throws InterruptedException {
        while (asynchronousResultNotAvailable()) {
            Thread.sleep(250); // custom poll interval
        }
        // Obtain the asynchronous result and perform assertions
    }

    private boolean asynchronousResultNotAvailable() {
        // Placeholder for the actual asynchronous check
        return true;
    }
}
```

--------------------------------

### SuiteLauncherDiscoveryRequestBuilder Methods

Source: https://docs.junit.org/current/api/org.junit.platform.suite.commons/org/junit/platform/suite/commons/SuiteLauncherDiscoveryRequestBuilder

This section details the various methods available on the SuiteLauncherDiscoveryRequestBuilder to configure and build a discovery request.

```APIDOC
## SuiteLauncherDiscoveryRequestBuilder

### Description
Provides methods to construct a `SuiteLauncherDiscoveryRequestBuilder` and configure various aspects of the test discovery process.

### Methods

#### `request()`

- **Description**: Creates a new `SuiteLauncherDiscoveryRequestBuilder`.
- **Method**: `public static SuiteLauncherDiscoveryRequestBuilder request()`
- **Returns**: A new builder instance.

#### `selectors(DiscoverySelector... selectors)`

- **Description**: Adds supplied `DiscoverySelector` instances to the request.
- **Method**: `public SuiteLauncherDiscoveryRequestBuilder selectors(DiscoverySelector... selectors)`
- **Parameters**:
  - `selectors` (DiscoverySelector[]) - The discovery selectors to add; must not be null.
- **Returns**: This builder for method chaining.

#### `selectors(List<? extends DiscoverySelector> selectors)`

- **Description**: Adds supplied `DiscoverySelector` instances from a list to the request.
- **Method**: `public SuiteLauncherDiscoveryRequestBuilder selectors(List<? extends DiscoverySelector> selectors)`
- **Parameters**:
  - `selectors` (List<DiscoverySelector>) - The discovery selectors to add; must not be null.
- **Returns**: This builder for method chaining.

#### `filters(Filter<?>... filters)`

- **Description**: Adds supplied `Filter` instances to the request. Filters are combined using AND semantics.
- **Method**: `public SuiteLauncherDiscoveryRequestBuilder filters(Filter<?>... filters)`
- **Parameters**:
  - `filters` (Filter[]) - The filters to add; must not be null.
- **Returns**: This builder for method chaining.

#### `filterStandardClassNamePatterns(boolean filterStandardClassNamePatterns)`

- **Description**: Specifies whether to filter standard class name patterns.
- **Method**: `public SuiteLauncherDiscoveryRequestBuilder filterStandardClassNamePatterns(boolean filterStandardClassNamePatterns)`
- **Parameters**:
  - `filterStandardClassNamePatterns` (boolean) - `true` to filter standard class name patterns, `false` otherwise.
- **Returns**: This builder for method chaining.

#### `configurationParameter(String key, String value)`

- **Description**: Adds a configuration parameter to the request.
- **Method**: `public SuiteLauncherDiscoveryRequestBuilder configurationParameter(String key, String value)`
- **Parameters**:
  - `key` (String) - The configuration parameter key; must not be null or blank.
  - `value` (String) - The value to store.
- **Returns**: This builder for method chaining.

#### `configurationParameters(Map<String, String> configurationParameters)`

- **Description**: Adds all supplied configuration parameters to the request.
- **Method**: `public SuiteLauncherDiscoveryRequestBuilder configurationParameters(Map<String, String> configurationParameters)`
- **Parameters**:
  - `configurationParameters` (Map<String, String>) - The map of configuration parameters to add; must not be null.
- **Returns**: This builder for method chaining.

#### `configurationParametersResource(String resourceFile)`

- **Description**: Configures parameters from a resource file.
- **Method**: `public SuiteLauncherDiscoveryRequestBuilder configurationParametersResource(String resourceFile)`

#### `parentConfigurationParameters(ConfigurationParameters parentConfigurationParameters)`

- **Description**: Sets the parent configuration parameters for the request. Explicitly configured parameters take precedence.
- **Method**: `public SuiteLauncherDiscoveryRequestBuilder parentConfigurationParameters(ConfigurationParameters parentConfigurationParameters)`
- **Parameters**:
  - `parentConfigurationParameters` (ConfigurationParameters) - The parent instance to use for looking up parameters; must not be null.
- **Returns**: This builder for method chaining.

#### `enableImplicitConfigurationParameters(boolean enabled)`

- **Description**: Configures whether implicit configuration parameters (from system properties and `junit-platform.properties`) should be considered.
- **Method**: `public SuiteLauncherDiscoveryRequestBuilder enableImplicitConfigurationParameters(boolean enabled)`
- **Parameters**:
  - `enabled` (boolean) - `true` if implicit parameters should be considered.
- **Returns**: This builder for method chaining.

#### `outputDirectoryProvider(OutputDirectoryProvider outputDirectoryProvider)`

- **Description**: Sets the output directory provider.
- **Method**: `public SuiteLauncherDiscoveryRequestBuilder outputDirectoryProvider(OutputDirectoryProvider outputDirectoryProvider)`

#### `listener(LauncherDiscoveryListener listener)`

- **Description**: Adds a `LauncherDiscoveryListener` to the request.
- **Method**: `@API(status=INTERNAL, since="1.13") public SuiteLauncherDiscoveryRequestBuilder listener(LauncherDiscoveryListener listener)`
- **Parameters**:
  - `listener` (LauncherDiscoveryListener) - The listener to add.
- **Returns**: This builder for method chaining.

#### `suite(Class<?> suiteClass)`

- **Description**: Deprecated method to specify a suite class for the request.
- **Method**: `@Deprecated @API(status=DEPRECATED, since="1.11") public SuiteLauncherDiscoveryRequestBuilder suite(Class<?> suiteClass)`
- **Parameters**:
  - `suiteClass` (Class<?>) - The suite class to use.
- **Returns**: This builder for method chaining.
```

--------------------------------

### TestIdentifier getSource()

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/class-use/TestSource

Gets the source of the represented test or container, if available.

```APIDOC
## TestIdentifier getSource()

### Description
Get the source of the represented test or container, if available.

### Method
GET

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "example": "Not applicable for method call"
}
```

### Response
#### Success Response (200)
- **source** (Optional<TestSource>) - The source of the test or container.

#### Response Example
```json
{
  "source": "Optional[TestSource]"
}
```
```

--------------------------------

### Configure JUnit Platform via Gradle (DSL)

Source: https://docs.junit.org/current/user-guide

Shows how to set JUnit Platform configuration parameters when using Gradle. The `systemProperty` or `systemProperties` DSL can be used to pass properties that will be picked up by the JUnit Platform, similar to JVM system properties.

```groovy
test {
    useJUnitPlatform()
    systemProperty 'junit.jupiter.conditions.deactivate': '*System*'
    systemProperties System.properties.toSortedString()
    systemProperties [
        'junit.jupiter.engine.extension.autodetetection.enabled': 'true',
        'junit.jupiter.displayname.generator.default': 'org.junit.jupiter.api.DisplayNameGenerator.Simple'
    ]
}
```

--------------------------------

### Apply Configuration Parameters from Suite Class

Source: https://docs.junit.org/current/api/org.junit.platform.suite.commons/org/junit/platform/suite/commons/class-use/SuiteLauncherDiscoveryRequestBuilder

This snippet shows how to apply configuration parameters from a given suite class to the builder. This is useful for setting up test execution environments based on suite-specific annotations. It is the preferred method over the deprecated `suite()` method.

```java
builder.applyConfigurationParametersFromSuite(MySuiteClass.class);
```

--------------------------------

### Get Executions (Java)

Source: https://docs.junit.org/current/api/index-files/index-5

Retrieves the Executions facade from a set of Events in the JUnit Platform TestKit engine.

```Java
public Executions executions()

```

--------------------------------

### Getting Excluded Packages

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the packages that are excluded from test discovery. This setting is part of the TestDiscoveryOptions.

```java
TestDiscoveryOptions.getExcludedPackages()
```

--------------------------------

### Implement TestPlan Visitor Interface (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/TestPlan

This snippet shows how to implement the TestPlan.Visitor interface in Java. It includes default methods for visiting test identifiers and containers, allowing for custom traversal logic within a test plan.

```java
public interface TestPlan.Visitor {
    default void preVisitContainer(TestIdentifier testIdentifier) {
        // Default implementation
    }

    default void visit(TestIdentifier testIdentifier) {
        // Default implementation
    }

    default void postVisitContainer(TestIdentifier testIdentifier) {
        // Default implementation
    }
}
```

--------------------------------

### Get Resource Name (JUnit)

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the name of a resource. This method is part of the org.junit.platform.commons.support.Resource interface.

```java
String getName();
```

--------------------------------

### Launcher Store Facade Constructor - JUnit Jupiter Engine Descriptor

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/store/class-use/Namespace

Constructor for LauncherStoreFacade, which accepts a NamespacedHierarchicalStore for request-level storage. This is part of the 'org.junit.jupiter.engine.descriptor' package.

```java
LauncherStoreFacade(NamespacedHierarchicalStore<Namespace> requestLevelStore)
Constructor parameters in org.junit.jupiter.engine.descriptor with type arguments of type Namespace
```

--------------------------------

### Get Store with Scope and Namespace - JUnit Jupiter API

Source: https://docs.junit.org/current/api/index-files/index-7

Returns the `ExtensionContext.Store` for a specified scope and namespace. This allows for more granular control over data storage and retrieval within the extension context.

```java
ExtensionContext.Store store = extensionContext.getStore(ExtensionContext.StoreScope.GLOBAL, ExtensionContext.Namespace.create("my.custom.namespace"));
```

--------------------------------

### PackageSource Creation API

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/descriptor/PackageSource

API endpoints for creating PackageSource instances.

```APIDOC
## POST /junit/PackageSource

### Description
Creates a new PackageSource instance. This endpoint allows for the creation of PackageSource objects either from a Java Package object or a package name string.

### Method
POST

### Endpoint
/junit/PackageSource

### Parameters
#### Request Body
- **javaPackage** (Package) - Optional - The Java Package object to create the PackageSource from.
- **packageName** (String) - Optional - The name of the package to create the PackageSource from. Cannot be null or blank if javaPackage is not provided.

### Request Example
```json
{
  "packageName": "com.example.myproject"
}
```

### Response
#### Success Response (200)
- **PackageSource** (PackageSource) - A newly created PackageSource object.

#### Response Example
```json
{
  "packageName": "com.example.myproject"
}
```
```

--------------------------------

### Get Selected Classpath Entries - Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestDiscoveryOptions

Retrieves a list of specific classpath entries that should be scanned for tests.

```java
List<Path> selectedClasspathEntries = discoveryOptions.getSelectedClasspathEntries();
```

--------------------------------

### Configure JUnit Reporting via Console Launcher

Source: https://docs.junit.org/current/user-guide/index

Enables Open Test Reporting and sets the output directory when using the JUnit Platform Console Launcher. Configuration can be done directly via command-line arguments or by referencing a properties file.

```bash
$ java -jar junit-platform-console-standalone-1.13.4.jar <OPTIONS> \
  --config=junit.platform.reporting.open.xml.enabled=true \
  --config=junit.platform.reporting.output.dir=reports
```

```bash
$ java -jar junit-platform-console-standalone-1.13.4.jar <OPTIONS> \
  --config-resource=configuration.properties
```

--------------------------------

### Get Descendants of a TestDescriptor

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/TestDescriptor

Retrieves an immutable set of all descendants (children, grandchildren, etc.) of this TestDescriptor.

```java
Set<? extends TestDescriptor> descendants = testDescriptor.getDescendants();
```

--------------------------------

### afterAll Method

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/extension/AfterAllCallback

The `afterAll` method is a callback that gets invoked once after all tests within the current container have been executed.

```APIDOC
## POST /api/users

### Description
This endpoint is used for creating a new user in the system. It accepts user details in the request body and returns the newly created user's information upon successful creation.

### Method
POST

### Endpoint
`/api/users`

### Parameters
#### Request Body
- **username** (string) - Required - The desired username for the new user.
- **email** (string) - Required - The email address of the new user.
- **password** (string) - Required - The password for the new user.

### Request Example
```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

### Response
#### Success Response (201 Created)
- **id** (string) - The unique identifier for the newly created user.
- **username** (string) - The username of the created user.
- **email** (string) - The email address of the created user.

#### Response Example
```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "username": "johndoe",
  "email": "john.doe@example.com"
}
```

#### Error Response (400 Bad Request)
- **message** (string) - Description of the error (e.g., "Username already exists").

#### Error Response Example
```json
{
  "message": "Username already exists"
}
```
```

--------------------------------

### Get URI from UriSource (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/descriptor/UriSource

Retrieves the URI that represents this source. The returned URI will never be null.

```java
URI getUri()
```

--------------------------------

### LauncherFactory - create(LauncherConfig)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherFactory

Creates a new Launcher instance using a supplied LauncherConfig. This allows for custom configuration of test engine discovery and listener registration.

```APIDOC
## POST /launcher/create/{config}

### Description
Factory method for creating a new `Launcher` using the supplied `LauncherConfig`. This provides full control over automatic registration and programmatic registration of test engines and listeners.

### Method
POST

### Endpoint
/launcher/create/{config}

### Parameters

#### Path Parameters
- **config** (LauncherConfig) - Required - The configuration for the launcher; never null.

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "example": "No request body needed, config is a path parameter."
}
```

### Response
#### Success Response (200)
- **Launcher** (object) - An instance of the Launcher configured with the provided `LauncherConfig`.

#### Response Example
```json
{
  "example": "Launcher object details"
}
```

#### Error Response
- **PreconditionViolationException** - Thrown if the supplied configuration is null, or if no test engines are detected registered.
```

--------------------------------

### JUnit Jupiter Lifecycle - LifecycleMethodExecutionExceptionHandler (BeforeEach)

Source: https://docs.junit.org/current/user-guide

Extension code for handling exceptions thrown from @BeforeEach methods. This enables custom error handling for setup routines.

```java
package org.junit.jupiter.api.extension;

@FunctionalInterface
public interface LifecycleMethodExecutionExceptionHandler {
    void handleBeforeEachMethodExecutionException(ExtensionContext context, Throwable throwable) throws Throwable;
}
```

--------------------------------

### LauncherDiscoveryRequest Methods

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/LauncherDiscoveryRequest

Provides details on methods available within the LauncherDiscoveryRequest interface, including engine filters, post-discovery filters, and discovery listeners.

```APIDOC
## GET /launcher/discovery/request

### Description
Retrieves the discovery request, which includes engine filters, configuration parameters, discovery selectors, discovery filters, and post-discovery filters.

### Method
GET

### Endpoint
/launcher/discovery/request

### Parameters
#### Query Parameters
- **engineFilters** (List<EngineFilter>) - Optional - Filters applied before each TestEngine is executed.
- **configurationParameters** (ConfigurationParameters) - Optional - Parameters to influence the discovery process.
- **discoverySelectors** (List<DiscoverySelector>) - Optional - Components to select resources for test discovery.
- **discoveryFilters** (List<DiscoveryFilter>) - Optional - Filters applied by TestEngines during test discovery.
- **postDiscoveryFilters** (List<PostDiscoveryFilter>) - Optional - Filters applied by the Launcher after test discovery.
- **discoveryListener** (LauncherDiscoveryListener) - Optional - Listener for discovery events.

### Request Example
```json
{
  "engineFilters": [],
  "configurationParameters": {},
  "discoverySelectors": [],
  "discoveryFilters": [],
  "postDiscoveryFilters": [],
  "discoveryListener": {}
}
```

### Response
#### Success Response (200)
- **engineFilters** (List<EngineFilter>) - The list of EngineFilters for this request. These are combined using AND semantics.
- **postDiscoveryFilters** (List<PostDiscoveryFilter>) - The list of PostDiscoveryFilters for this request. These are combined using AND semantics.
- **discoveryListener** (LauncherDiscoveryListener) - The LauncherDiscoveryListener for this request.

#### Response Example
```json
{
  "engineFilters": [
    {
      "type": "EngineFilter"
    }
  ],
  "postDiscoveryFilters": [
    {
      "type": "PostDiscoveryFilter"
    }
  ],
  "discoveryListener": {
    "type": "LauncherDiscoveryListener"
  }
}
```
```

--------------------------------

### Get Ancestors of a TestDescriptor

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/TestDescriptor

Retrieves an immutable set of all ancestors (parent, grandparent, etc.) of this TestDescriptor, up to the root.

```java
Set<? extends TestDescriptor> ancestors = testDescriptor.getAncestors();
```

--------------------------------

### Get Selected Modules - Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestDiscoveryOptions

Retrieves a list of module selectors, specifying Java modules to scan for tests.

```java
List<ModuleSelector> selectedModules = discoveryOptions.getSelectedModules();
```

--------------------------------

### Execute Tests with Launcher API (Test Plan) in Java

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/Launcher

Executes a pre-discovered `TestPlan`. This method is more efficient if test discovery has already been performed, avoiding potential performance issues like classpath scanning. Registered listeners are notified of the execution's progress and results.

```java
void execute(TestPlan testPlan, TestExecutionListener... listeners)
```

--------------------------------

### Get Selected URIs - Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestDiscoveryOptions

Retrieves a list of URI selectors, specifying resources by their URIs to be discovered for testing.

```java
List<UriSelector> selectedUris = discoveryOptions.getSelectedUris();
```

--------------------------------

### Get Selected Files - Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestDiscoveryOptions

Retrieves a list of file selectors, specifying exact files to be discovered for testing.

```java
List<FileSelector> selectedFiles = discoveryOptions.getSelectedFiles();
```

--------------------------------

### Get Selected Methods - Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestDiscoveryOptions

Retrieves a list of method selectors, specifying exact methods to be discovered for testing.

```java
List<MethodSelector> selectedMethods = discoveryOptions.getSelectedMethods();
```

--------------------------------

### Create AssertionFailureBuilder Instance

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/AssertionFailureBuilder

This method initializes a new AssertionFailureBuilder, serving as the starting point for constructing an assertion failure. It is a static utility method.

```java
AssertionFailureBuilder builder = AssertionFailureBuilder.assertionFailure();
```

--------------------------------

### Test Suite Configuration

Source: https://docs.junit.org/current/user-guide

Illustrates how to create a test suite to run multiple test classes using the `JUnitPlatform` runner. This involves annotating a suite class with `@RunWith(JUnitPlatform.class)`, `@SuiteDisplayName`, and `@SelectPackages`.

```APIDOC
## Test Suite Configuration

### Description
This section describes how to create a test suite for running multiple test classes. The suite class is annotated with `@RunWith(JUnitPlatform.class)` and uses annotations like `@SuiteDisplayName` and `@SelectPackages` to define the suite's name and the packages to discover tests from.

### Method
N/A (Configuration via Annotation)

### Endpoint
N/A

### Parameters
N/A

### Request Example
```java
import org.junit.platform.suite.api.SelectPackages;
import org.junit.platform.suite.api.SuiteDisplayName;
import org.junit.runner.RunWith;

@RunWith(org.junit.platform.runner.JUnitPlatform.class)
@SuiteDisplayName("JUnit Platform Suite Demo")
@SelectPackages("example")
public class JUnitPlatformSuiteDemo {
}
```

### Response
N/A

### Note
Test classes and suites annotated with `@RunWith(JUnitPlatform.class)` can only be executed using JUnit 4 infrastructure.
```

--------------------------------

### Java: Implement OutputDirectoryProvider for Test Reports

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/reporting/OutputDirectoryProvider

This Java code defines an interface for providing output directories for test engines. It includes methods to create output directories for specific test descriptors and to get the root directory for all output files. Implementations should handle potential IOExceptions during directory creation.

```java
import java.io.IOException;
import java.nio.file.Path;

@API(status=MAINTAINED, since="1.13.3")
public interface OutputDirectoryProvider {

    /**
     * Returns the root directory for all output files; never {@code null}.
     *
     * @return the root directory for all output files; never {@code null}
     */
    Path getRootDirectory();

    /**
     * Create an output directory for the supplied test descriptor.
     *
     * @param testDescriptor the test descriptor for which to create an output directory; never {@code null}
     * @return the output directory
     * @throws IOException if the output directory could not be created
     */
    Path createOutputDirectory(TestDescriptor testDescriptor) throws IOException;
}
```

--------------------------------

### Construct TestPlan with OutputDirectoryProvider

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/reporting/class-use/OutputDirectoryProvider

Shows how to construct a `TestPlan` by providing an `OutputDirectoryProvider`. This allows configuring the test plan with a specific destination for any associated output.

```java
/**
 * Construct a new {@code TestPlan} from the supplied collection of {@code TestDescriptors}.
 *
 * @param containsTests            whether this plan contains tests
 * @param engineDescriptors        the discovered test descriptors for each engine
 * @param configurationParameters  the configuration parameters
 * @param outputDirectoryProvider the {@code OutputDirectoryProvider} to use for this plan
 */
static TestPlan from(boolean containsTests, Collection<TestDescriptor> engineDescriptors, ConfigurationParameters configurationParameters, OutputDirectoryProvider outputDirectoryProvider);
```

```java
/**
 * Protected constructor for {@code TestPlan}.
 *
 * @param containsTests            {@code true} if this plan contains tests
 * @param configurationParameters  the configuration parameters
 * @param outputDirectoryProvider the {@code OutputDirectoryProvider} to use for this plan
 */
protected TestPlan(boolean containsTests, ConfigurationParameters configurationParameters, OutputDirectoryProvider outputDirectoryProvider);
```

--------------------------------

### Dynamic Tests from IntStream (Java)

Source: https://docs.junit.org/current/user-guide/index

Illustrates generating dynamic tests from an IntStream. This example creates tests for the first 10 even integers, checking if each number is indeed even.

```java
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.DynamicTest.dynamicTest;

import java.util.stream.IntStream;

import org.junit.jupiter.api.TestFactory;

class DynamicTestsDemo {

    // ... other methods ...

    @TestFactory
    Stream<DynamicTest> dynamicTestsFromIntStream() {
        // Generates tests for the first 10 even integers.
        return IntStream.iterate(0, n -> n + 2).limit(10)
            .mapToObj(n -> dynamicTest("test" + n, () -> assertEquals(0, n % 2)));
    }

    // ... other methods ...
}
```

--------------------------------

### Get FilePosition from FileSource (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/descriptor/class-use/FilePosition

Retrieves the FilePosition associated with a FileSource, if available. This indicates the location within a regular file.

```java
final Optional<FilePosition> FileSource.getPosition()
```

--------------------------------

### Add Multiple Configuration Parameters

Source: https://docs.junit.org/current/api/org.junit.platform.suite.commons/org/junit/platform/suite/commons/class-use/SuiteLauncherDiscoveryRequestBuilder

This snippet shows how to add multiple configuration parameters to the builder using a Map. This is convenient for applying a set of predefined configurations to the test discovery process.

```java
Map<String, String> configParams = new HashMap<>();
configParams.put("junit.filter.package", "com.example.*");
builder.configurationParameters(configParams);
```

--------------------------------

### Initialize AnnotationConsumer Instance (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/support/AnnotationConsumerInitializer

The `initialize` method is a static utility function that takes an `AnnotatedElement` and an instance of `AnnotationConsumer`. It is responsible for setting up the provided `annotationConsumerInstance` based on the annotations present in the `annotatedElement`. This is an internal helper class.

```java
public static <T> T initialize(AnnotatedElement annotatedElement, T annotationConsumerInstance)
```

--------------------------------

### LauncherConfig: Getting Additional PostDiscoveryFilters

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/class-use/PostDiscoveryFilter

Explains how to access additional PostDiscoveryFilters configured for the Launcher. These filters are applied during the test launching process.

```java
Collection<PostDiscoveryFilter> LauncherConfig.getAdditionalPostDiscoveryFilters()
```

--------------------------------

### Get FilePosition from ClasspathResourceSource (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/descriptor/class-use/FilePosition

Retrieves the FilePosition associated with a ClasspathResourceSource, if available. This indicates the location within a resource on the classpath.

```java
final Optional<FilePosition> ClasspathResourceSource.getPosition()
```

--------------------------------

### Get Tags of a TestDescriptor

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/TestDescriptor

Retrieves the set of tags associated with a TestDescriptor. Tags can be used for filtering and organizing tests.

```java
Set<TestTag> tags = testDescriptor.getTags();
```

--------------------------------

### LoggingListener Factory Methods

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/listeners/LoggingListener

Methods for creating instances of LoggingListener with different configurations.

```APIDOC
## Factory Methods for LoggingListener

### `forJavaUtilLogging()`

*   **Description**: Creates a `LoggingListener` which delegates to a `Logger` using a log level of `FINE`.
*   **Method**: `public static LoggingListener forJavaUtilLogging()`
*   **Endpoint**: N/A
*   **See Also**: `forJavaUtilLogging(Level)`, `forBiConsumer(BiConsumer)`

### `forJavaUtilLogging(Level logLevel)`

*   **Description**: Creates a `LoggingListener` which delegates to a `Logger` using the supplied log level.
*   **Method**: `public static LoggingListener forJavaUtilLogging(Level logLevel)`
*   **Endpoint**: N/A
*   **Parameters**:
    *   `logLevel` (Level) - Required - The log level to use; never null.
*   **See Also**: `forJavaUtilLogging()`, `forBiConsumer(BiConsumer)`

### `forBiConsumer(BiConsumer<Throwable, Supplier<String>> logger)`

*   **Description**: Creates a `LoggingListener` which delegates to the supplied `BiConsumer` for consumption of logging messages. The `BiConsumer`'s arguments are a `Throwable` (potentially null) and a `Supplier` (never null) for the log message.
*   **Method**: `public static LoggingListener forBiConsumer(BiConsumer<Throwable, Supplier<String>> logger)`
*   **Endpoint**: N/A
*   **Parameters**:
    *   `logger` (BiConsumer) - Required - A logger implemented as a `BiConsumer`; never null.
*   **See Also**: `forJavaUtilLogging()`, `forJavaUtilLogging(Level)`
```

--------------------------------

### Implementing ArgumentsProvider in Java

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/provider/ArgumentsProvider

This Java code snippet demonstrates how to implement the `ArgumentsProvider` interface in JUnit 5. It shows the structure for providing arguments to parameterized tests, including handling the `ParameterDeclarations` and `ExtensionContext`.

```java
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.ArgumentsProvider;
import org.junit.jupiter.params.provider.ArgumentsSource;
import org.junit.jupiter.params.provider.ParameterDeclarations;

import java.util.stream.Stream;

public class MyArgumentsProvider implements ArgumentsProvider {

    @Override
    public Stream<? extends Arguments> provideArguments(ParameterDeclarations parameters, ExtensionContext context) throws Exception {
        // Implement logic to provide arguments here
        return Stream.of(
            Arguments.of("arg1", 1),
            Arguments.of("arg2", 2)
        );
    }

    // Deprecated method (for reference, not recommended for new implementations)
    @Deprecated
    public Stream<? extends Arguments> provideArguments(ExtensionContext context) throws Exception {
        // Deprecated implementation logic
        return Stream.empty();
    }
}
```

--------------------------------

### Get All HierarchyTraversalMode Constants

Source: https://docs.junit.org/current/api/org.junit.platform.commons/org/junit/platform/commons/util/ReflectionUtils

Retrieves all the declared enum constants for HierarchyTraversalMode. This is useful for iterating through all possible traversal strategies.

```java
ReflectionUtils.HierarchyTraversalMode[] modes = ReflectionUtils.HierarchyTraversalMode.values();
```

--------------------------------

### Get Selected Classes - Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestDiscoveryOptions

Retrieves a list of class selectors, specifying exact classes to be discovered for testing.

```java
List<ClassSelector> selectedClasses = discoveryOptions.getSelectedClasses();
```

--------------------------------

### JUnit Platform Launcher API - Discovering Tests

Source: https://docs.junit.org/current/user-guide/index

This section details how to use the JUnit Platform Launcher API to discover tests. It covers selecting tests by package or class, applying filters, and building a `LauncherDiscoveryRequest`.

```APIDOC
## JUnit Platform Launcher API - Discovering Tests

### Description
Demonstrates how to programmatically discover tests using the JUnit Platform Launcher API. This involves creating a `LauncherDiscoveryRequest` with specified selectors and filters.

### Method
Not applicable (Programmatic API usage)

### Endpoint
Not applicable (Programmatic API usage)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```java
import static org.junit.platform.engine.discovery.ClassNameFilter.includeClassNamePatterns;
import static org.junit.platform.engine.discovery.DiscoverySelectors.selectClass;
import static org.junit.platform.engine.discovery.DiscoverySelectors.selectPackage;

import org.junit.platform.launcher.LauncherDiscoveryRequest;
import org.junit.platform.launcher.LauncherSession;
import org.junit.platform.launcher.TestPlan;
import org.junit.platform.launcher.core.LauncherDiscoveryRequestBuilder;
import org.junit.platform.launcher.core.LauncherFactory;

// ... other imports

LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder.request()
    .selectors(
        selectPackage("com.example.mytests"),
        selectClass(MyTestClass.class)
    )
    .filters(
        includeClassNamePatterns(".*Tests")
    )
    .build();

try (LauncherSession session = LauncherFactory.openSession()) {
    TestPlan testPlan = session.getLauncher().discover(request);

    // Process the discovered testPlan
}
```

### Response
#### Success Response (TestPlan)
- **TestPlan** (object) - A hierarchical, read-only description of discovered tests.

#### Response Example
```json
{
  "description": "Discovered tests based on the request"
}
```
```

--------------------------------

### JUnit Launcher API: Core Imports for Test Discovery

Source: https://docs.junit.org/current/user-guide/index

This Java code snippet lists essential imports required for utilizing the JUnit Platform Launcher API, specifically for configuring test discovery requests. It includes static imports for selectors and filters, as well as imports for various listener and builder classes. These are fundamental for setting up and managing test discovery operations.

```java
import static org.junit.platform.engine.discovery.ClassNameFilter.includeClassNamePatterns;
import static org.junit.platform.engine.discovery.DiscoverySelectors.selectClass;
import static org.junit.platform.engine.discovery.DiscoverySelectors.selectPackage;

import java.io.PrintWriter;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.junit.platform.engine.FilterResult;
import org.junit.platform.engine.TestDescriptor;
import org.junit.platform.launcher.Launcher;
import org.junit.platform.launcher.LauncherDiscoveryListener;
import org.junit.platform.launcher.LauncherDiscoveryRequest;
import org.junit.platform.launcher.LauncherSession;
import org.junit.platform.launcher.LauncherSessionListener;
import org.junit.platform.launcher.PostDiscoveryFilter;
import org.junit.platform.launcher.TestExecutionListener;
import org.junit.platform.launcher.TestPlan;
import org.junit.platform.launcher.core.LauncherConfig;
import org.junit.platform.launcher.core.LauncherDiscoveryRequestBuilder;
import org.junit.platform.launcher.core.LauncherFactory;
import org.junit.platform.launcher.listeners.SummaryGeneratingListener;
import org.junit.platform.launcher.listeners.TestExecutionSummary;
import org.junit.platform.reporting.legacy.xml.LegacyXmlReportGeneratingListener;
```

--------------------------------

### Get Configuration Parameter

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves a configuration parameter from ConfigurationParameters by key. Supports optional functions for value conversion.

```java
get(String key)

```

```java
get(String key, Function<String, T> converter)

```

--------------------------------

### GET /websites/junit_current/testDescriptor

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/TestDescriptor

Retrieves information about a specific TestDescriptor. This endpoint is conceptual as TestDescriptor is an interface and typically accessed through an engine or plan.

```APIDOC
## GET /websites/junit_current/testDescriptor

### Description
This is a conceptual endpoint representing the retrieval of a `TestDescriptor`. In practice, you would interact with `TestDescriptor` objects through a `TestEngine` or by traversing the test plan hierarchy.

### Method
GET

### Endpoint
/websites/junit_current/testDescriptor

### Parameters

#### Query Parameters
- **uniqueId** (string) - Required - The unique identifier of the `TestDescriptor` to retrieve.

#### Request Body
None

### Response
#### Success Response (200)
- **uniqueId** (string) - The unique identifier of the `TestDescriptor`.
- **displayName** (string) - The human-readable display name of the `TestDescriptor`.
- **type** (string) - The type of the `TestDescriptor` (e.g., `CONTAINER`, `TEST`).
- **parent** (string) - The uniqueId of the parent `TestDescriptor`, if available.
- **children** (array) - An array of uniqueIds of the child `TestDescriptors`.

#### Response Example
```json
{
  "uniqueId": "engine:junit-jupiter",
  "displayName": "JUnit Jupiter",
  "type": "CONTAINER",
  "parent": null,
  "children": [
    "class:com.example.MyTestClass"
  ]
}
```
```

--------------------------------

### SuiteTestEngine Constructor

Source: https://docs.junit.org/current/api/index-files/index-19

Instantiates the `SuiteTestEngine`, which is the JUnit Platform's `TestEngine` specifically designed for executing test suites.

```java
SuiteTestEngine suiteEngine = new SuiteTestEngine();
```

--------------------------------

### Get EngineDiscoveryResult Status

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/EngineDiscoveryResult

This method retrieves the status of the test discovery result. It returns a non-null EngineDiscoveryResult.Status enum value.

```java
public EngineDiscoveryResult.Status getStatus()
{
    // Implementation omitted for brevity
    return null;
}
```

--------------------------------

### Configure JUnit Platform via LauncherDiscoveryRequestBuilder (Java)

Source: https://docs.junit.org/current/user-guide

Demonstrates how to provide custom configuration parameters to the JUnit Platform using the `LauncherDiscoveryRequestBuilder`. This is useful for fine-tuning test discovery and execution by specifying engine-specific settings or enabling/disabling certain features.

```java
LauncherDiscoveryRequestBuilder requestBuilder = LauncherDiscoveryRequestBuilder.request()
    .selectors(selectPackage("com.example.tests"))
    .configurationParameter("junit.jupiter.engine.extension.autodetetection.enabled", "true")
    .configurationParameters(new HashMap<String, String>() {{ 
        put("junit.jupiter.conditions.deactivate", "*System*"); 
        put("junit.jupiter.displayname.generator.default", "org.junit.jupiter.api.DisplayNameGenerator.Simple"); 
    }});

Launcher launcher = LauncherFactory.create();
launcher.discover(requestBuilder.build());
```

--------------------------------

### Arguments.ArgumentSet API

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/provider/Arguments

Details on the Arguments.ArgumentSet class and its methods.

```APIDOC
## Class: Arguments.ArgumentSet

### Description
Specialization of `Arguments` that associates a `name` with a set of `arguments`.

### Enclosing Interface
`Arguments`

### See Also
* `Arguments.argumentSet(String, Object...)`
* `ParameterizedTest.ARGUMENT_SET_NAME_PLACEHOLDER`
* `ParameterizedTest.ARGUMENT_SET_NAME_OR_ARGUMENTS_WITH_NAMES_PLACEHOLDER`

## Methods

### `getName()`

#### Description
Get the name of this `ArgumentSet`.

#### Method
GET

#### Endpoint
N/A (Instance Method)

#### Return Value
- **String** - The name of this `ArgumentSet`; never `null` or blank.

#### Example
```java
String name = argumentSet.getName();
```

### `get()`

#### Description
Get the arguments used for an invocation of the `@ParameterizedTest` method.

#### Method
GET

#### Endpoint
N/A (Instance Method)

#### Implements
`Arguments.get()`

#### Return Value
- **Object[]** - The arguments; never `null`.

#### Example
```java
Object[] args = argumentSet.get();
```

### `toString()`

#### Description
Return the `name` of this `ArgumentSet`.

#### Method
GET

#### Endpoint
N/A (Instance Method)

#### Overrides
`toString` in class `Object`

#### Return Value
- **String** - The name of this `ArgumentSet`.

#### Example
```java
String nameString = argumentSet.toString();
```
```

--------------------------------

### JUnit Platform Launcher API - Discovering Tests

Source: https://docs.junit.org/current/user-guide

This section details how to use the JUnit Platform Launcher API to discover tests. It covers selecting test classes, packages, and applying filters for a customized test discovery process.

```APIDOC
## JUnit Platform Launcher API - Discovering Tests

### Description
This endpoint demonstrates how to initiate test discovery using the JUnit Platform Launcher API. It allows for specifying selectors (like packages or classes) and filters to refine the discovery process.

### Method
Not Applicable (Programmatic API)

### Endpoint
Not Applicable (Programmatic API)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```java
import static org.junit.platform.engine.discovery.ClassNameFilter.includeClassNamePatterns;
import static org.junit.platform.engine.discovery.DiscoverySelectors.selectClass;
import static org.junit.platform.engine.discovery.DiscoverySelectors.selectPackage;

import org.junit.platform.launcher.LauncherDiscoveryRequest;
import org.junit.platform.launcher.LauncherSession;
import org.junit.platform.launcher.core.LauncherDiscoveryRequestBuilder;
import org.junit.platform.launcher.core.LauncherFactory;

LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder.request()
    .selectors(
        selectPackage("com.example.mytests"),
        selectClass(MyTestClass.class)
    )
    .filters(
        includeClassNamePatterns(".*Tests")
    )
    .build();

try (LauncherSession session = LauncherFactory.openSession()) {
    session.getLauncher().discover(request);
    // Further actions with the discovered TestPlan can be performed here
}
```

### Response
#### Success Response (200)
- **TestPlan** (org.junit.platform.launcher.TestPlan) - A hierarchical, read-only description of discovered tests.

#### Response Example
```java
// A TestPlan object is returned, representing the discovered tests.
// Example structure is conceptual as TestPlan is an object reference.
{
  "description": "TestPlan object representing discovered tests"
}
```
```

--------------------------------

### Argument Retrieval by Index

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/aggregator/ArgumentsAccessor

Methods to get argument values at a specific index, with support for automatic type conversion.

```APIDOC
## GET /arguments/{index}

### Description
Retrieves the value of an argument at a specified index, attempting automatic type conversion.

### Method
GET

### Endpoint
`/arguments/{index}`

### Parameters
#### Path Parameters
- **index** (int) - Required - The index of the argument to retrieve. Must be non-negative and less than the total number of arguments.

#### Query Parameters
- **type** (string) - Optional - The desired type to convert the argument to (e.g., `Byte`, `Short`, `Integer`, `Long`, `Float`, `Double`, `String`).

### Request Example
```json
{
  "example": "GET /arguments/0?type=String"
}
```

### Response
#### Success Response (200)
- **value** (any) - The argument value, potentially null, converted to the requested type if specified.

#### Response Example
```json
{
  "value": "example_string"
}
```

### Errors
- **ArgumentAccessException** - If the argument cannot be accessed or converted to the specified type.
```

```APIDOC
## getByte

### Description
Get the value of the argument at the given index as a `Byte`, performing automatic type conversion as necessary.

### Method
GET

### Endpoint
`/arguments/{index}?type=Byte`

### Parameters
#### Path Parameters
- **index** (int) - Required - The index of the argument to get; must be greater than or equal to zero and less than `size()`.

### Response
#### Success Response (200)
- **value** (Byte) - The value at the given index, potentially null.

### Errors
- **ArgumentAccessException** - if the value cannot be accessed or converted to the desired type.
```

```APIDOC
## getShort

### Description
Get the value of the argument at the given index as a `Short`, performing automatic type conversion as necessary.

### Method
GET

### Endpoint
`/arguments/{index}?type=Short`

### Parameters
#### Path Parameters
- **index** (int) - Required - The index of the argument to get; must be greater than or equal to zero and less than `size()`.

### Response
#### Success Response (200)
- **value** (Short) - The value at the given index, potentially null.

### Errors
- **ArgumentAccessException** - if the value cannot be accessed or converted to the desired type.
```

```APIDOC
## getInteger

### Description
Get the value of the argument at the given index as an `Integer`, performing automatic type conversion as necessary.

### Method
GET

### Endpoint
`/arguments/{index}?type=Integer`

### Parameters
#### Path Parameters
- **index** (int) - Required - The index of the argument to get; must be greater than or equal to zero and less than `size()`.

### Response
#### Success Response (200)
- **value** (Integer) - The value at the given index, potentially null.

### Errors
- **ArgumentAccessException** - if the value cannot be accessed or converted to the desired type.
```

```APIDOC
## getLong

### Description
Get the value of the argument at the given index as a `Long`, performing automatic type conversion as necessary.

### Method
GET

### Endpoint
`/arguments/{index}?type=Long`

### Parameters
#### Path Parameters
- **index** (int) - Required - The index of the argument to get; must be greater than or equal to zero and less than `size()`.

### Response
#### Success Response (200)
- **value** (Long) - The value at the given index, potentially null.

### Errors
- **ArgumentAccessException** - if the value cannot be accessed or converted to the desired type.
```

```APIDOC
## getFloat

### Description
Get the value of the argument at the given index as a `Float`, performing automatic type conversion as necessary.

### Method
GET

### Endpoint
`/arguments/{index}?type=Float`

### Parameters
#### Path Parameters
- **index** (int) - Required - The index of the argument to get; must be greater than or equal to zero and less than `size()`.

### Response
#### Success Response (200)
- **value** (Float) - The value at the given index, potentially null.

### Errors
- **ArgumentAccessException** - if the value cannot be accessed or converted to the desired type.
```

```APIDOC
## getDouble

### Description
Get the value of the argument at the given index as a `Double`, performing automatic type conversion as necessary.

### Method
GET

### Endpoint
`/arguments/{index}?type=Double`

### Parameters
#### Path Parameters
- **index** (int) - Required - The index of the argument to get; must be greater than or equal to zero and less than `size()`.

### Response
#### Success Response (200)
- **value** (Double) - The value at the given index, potentially null.

### Errors
- **ArgumentAccessException** - if the value cannot be accessed or converted to the desired type.
```

```APIDOC
## getString

### Description
Get the value of the argument at the given index as a `String`, performing automatic type conversion as necessary.

### Method
GET

### Endpoint
`/arguments/{index}?type=String`

### Parameters
#### Path Parameters
- **index** (int) - Required - The index of the argument to get; must be greater than or equal to zero and less than `size()`.

### Response
#### Success Response (200)
- **value** (String) - The value at the given index, potentially null.

### Errors
- **ArgumentAccessException** - if the value cannot be accessed or converted to the desired type.
```

--------------------------------

### Create JUnit ExecutionRequest (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/ExecutionRequest

Demonstrates creating an ExecutionRequest for a TestEngine. This factory method is used to bundle all necessary components for test execution. It requires a root TestDescriptor, an EngineExecutionListener, ConfigurationParameters, an OutputDirectoryProvider, and a NamespacedHierarchicalStore.

```java
static ExecutionRequest create(TestDescriptor rootTestDescriptor,
                                     EngineExecutionListener engineExecutionListener,
                                     ConfigurationParameters configurationParameters,
                                     OutputDirectoryProvider outputDirectoryProvider,
                                     NamespacedHierarchicalStore<Namespace> requestLevelStore)
```

--------------------------------

### ConsoleLauncherToolProvider Java Class Definition

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/ConsoleLauncherToolProvider

Defines the ConsoleLauncherToolProvider class which implements the ToolProvider interface for running the JUnit Platform Console Launcher. It includes a constructor and methods for name and running the launcher.

```java
package org.junit.platform.console;

import java.io.PrintWriter;
import java.util.spi.ToolProvider;

@API(status=STABLE, since="1.10")
public class ConsoleLauncherToolProvider extends Object implements ToolProvider {

    public ConsoleLauncherToolProvider() {
        // Constructor implementation
    }

    @Override
    public String name() {
        // Method implementation
        return "junit";
    }

    @Override
    public int run(PrintWriter out, PrintWriter err, String... args) {
        // Method implementation
        return 0; // Placeholder
    }
}
```

--------------------------------

### Get Package Name (JUnit)

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the name of a package. This can be from a selector used in discovery or from the source information of a test.

```java
String getPackageName();
```

--------------------------------

### Executing Tests with Custom Engines

Source: https://docs.junit.org/current/user-guide/index

This snippet demonstrates how to execute tests using custom test engines with the JUnit Platform's launcher API. It shows enabling specific engines and disabling auto-registration, followed by executing a built request and asserting resource sharing and closure.

```java
Launcher launcher = LauncherFactory.create();

LauncherConfiguration launcherConfiguration = LauncherConfiguration.builder()
        .addTestEngines(firstCustomEngine, secondCustomEngine)
        .enableTestEngineAutoRegistration(false)
        .build();

launcher.execute(request().build());

same.assert (firstCustomEngine.socket, secondCustomEngine.socket);
assertTrue (firstCustomEngine.socket.isClosed (), "socket should be closed");
```

--------------------------------

### Create Launcher Discovery Request Builder (Java)

Source: https://docs.junit.org/current/api/index-files/index-18

Creates a new builder for constructing launcher discovery requests. This static method is available in `org.junit.platform.launcher.core.LauncherDiscoveryRequestBuilder` and `org.junit.platform.suite.commons.SuiteLauncherDiscoveryRequestBuilder`.

```java
org.junit.platform.launcher.core.LauncherDiscoveryRequestBuilder org.junit.platform.launcher.core.LauncherDiscoveryRequestBuilder.request()
```

```java
org.junit.platform.suite.commons.SuiteLauncherDiscoveryRequestBuilder org.junit.platform.suite.commons.SuiteLauncherDiscoveryRequestBuilder.request()
```

--------------------------------

### TestDescriptor prepareExtensionContext Method - JUnit Jupiter

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/descriptor/TestMethodTestDescriptor

A protected helper method for preparing the ExtensionContext. This method is intended to be overridden by subclasses to customize the setup of the extension context before test execution.

```java
protected void prepareExtensionContext(ExtensionContext extensionContext)
```

--------------------------------

### Get Class Descriptors from ClassOrdererContext

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the list of class descriptors that need to be ordered within the context of a ClassOrderer.

```java
getClassDescriptors() - Method in interface org.junit.jupiter.api.ClassOrdererContext
    
Get the list of class descriptors to order.
```

--------------------------------

### ConfigurationParameters Constructor in DefaultJupiterConfiguration

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/class-use/ConfigurationParameters

Demonstrates the constructor for DefaultJupiterConfiguration which accepts ConfigurationParameters and an OutputDirectoryProvider. This is used for configuring the JUnit Jupiter test engine.

```java
DefaultJupiterConfiguration(ConfigurationParameters configurationParameters, OutputDirectoryProvider outputDirectoryProvider)
```

--------------------------------

### Get Parent Descriptor - Java

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/TestDescriptor

Retrieves the optional parent of this test descriptor. The parent may not be available if this is a root descriptor.

```java
Optional<TestDescriptor> getParent()
// Returns: Optional<TestDescriptor>
```

--------------------------------

### Getting Excluded Engines

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the list of engines that are explicitly excluded from test discovery. This option is available in TestDiscoveryOptions.

```java
TestDiscoveryOptions.getExcludedEngines()
```

--------------------------------

### Launcher Class API

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/package-use

The `Launcher` class is the primary entry point for client code to discover and execute tests using one or more test engines on the JUnit Platform.

```APIDOC
## Class: Launcher

### Description
The `Launcher` API is the main entry point for client code that wishes to _discover_ and _execute_ tests using one or more test engines.

### Method
This class primarily provides methods for launching test plans.

### Endpoint
N/A (This is a Java API, not a REST endpoint)

### Parameters
N/A for the class itself, methods have specific parameters.

### Request Example
(Illustrative Java code)
```java
Launcher launcher = LauncherFactory.create();
TestPlan testPlan = launcher.discover(request);
launcher.execute(request);
```

### Response
N/A for the class itself, methods return specific objects.

#### Success Response (N/A)
N/A

#### Response Example
(Illustrative Java code)
```java
// Methods like discover() return TestPlan
// Methods like execute() return void or specific listener events
```
```

--------------------------------

### Get ClassLoader from ClassLoaderUtils

Source: https://docs.junit.org/current/api/index-files/index-7

Safely retrieves the ClassLoader for a given Class, providing a fallback to the default ClassLoader if necessary.

```java
getClassLoader(Class<?>) - Static method in class org.junit.platform.commons.util.ClassLoaderUtils
    
Get the `ClassLoader` for the supplied `Class`, falling back to the `default class loader` if the class loader for the supplied class is `null`.
```

--------------------------------

### Get Source Information (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/TestIdentifier

Retrieves the source of the represented test or container, if available. The source information is provided as an `Optional<TestSource>`.

```java
public Optional<TestSource> getSource()
Get the source of the represented test or container, if available.

See Also:
    
      * `TestSource`
```

--------------------------------

### Get Type of a TestDescriptor

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/TestDescriptor

Retrieves the type of the TestDescriptor, which indicates whether it represents a container, a test, or potentially something else.

```java
TestDescriptor.Type type = testDescriptor.getType();
```

--------------------------------

### LauncherFactory - create()

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherFactory

Creates a new Launcher instance using the default LauncherConfig. This method discovers test engines via ServiceLoader by default.

```APIDOC
## GET /launcher/create

### Description
Factory method for creating a new `Launcher` using the default `LauncherConfig`. Test engines are discovered at runtime using the `ServiceLoader` mechanism.

### Method
GET

### Endpoint
/launcher/create

### Parameters

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "example": "No request body needed for this operation."
}
```

### Response
#### Success Response (200)
- **Launcher** (object) - An instance of the Launcher.

#### Response Example
```json
{
  "example": "Launcher object details"
}
```

#### Error Response
- **PreconditionViolationException** - Thrown if no test engines are detected.
```

--------------------------------

### JUnit Jupiter @TempDir Cleanup Modes and Factory Configuration

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/io/TempDir

This snippet details the supported values for the 'cleanup' and 'factory' attributes of the @TempDir annotation. It explains the different cleanup modes and the role of TempDirFactory, including default values and global configuration overrides. Note that no actual code examples were provided in the source text.

```Java
/**
 * Supported values for @TempDir cleanup mode:
 * - `per_context`: Creates a single temporary directory for the entire test class or method.
 * - `per_declaration`: Creates separate temporary directories for each declaration site.
 * Default is `per_declaration`.
 *
 * The `factory` attribute specifies the factory for the temporary directory. 
 * If "junit.jupiter.tempdir.scope" is `per_context`, no custom factory is allowed.
 * Defaults to `TempDirFactory.Standard`.
 * A global `TempDirFactory` can be configured via "junit.jupiter.tempdir.factory.default".
 * A custom `@TempDir` factory always overrides a global factory.
 *
 * The `cleanup` attribute defines how the temporary directory is cleaned up after the test.
 * Defaults to `DEFAULT`.
 */
```

--------------------------------

### LauncherConfig.Builder: Adding PostDiscoveryFilters

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/class-use/PostDiscoveryFilter

Demonstrates how to add multiple PostDiscoveryFilters to the LauncherConfig builder. This allows for custom filtering during test execution setup.

```java
LauncherConfig.Builder LauncherConfig.Builder.addPostDiscoveryFilters(PostDiscoveryFilter... filters)
```

--------------------------------

### Create Condition for started event

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/EventConditions

Creates a `Condition` that matches an `Event` if its type is `EventType.STARTED`. This is useful for tracking when tests begin execution.

```java
public static Condition<Event> started()
Create a new `Condition` that matches if and only if an `Event`'s type is `EventType.STARTED`.
```

--------------------------------

### Get Children of a TestDescriptor

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/TestDescriptor

Retrieves an immutable set of the direct children of this TestDescriptor. These children represent nested tests or containers.

```java
Set<? extends TestDescriptor> children = testDescriptor.getChildren();
```

--------------------------------

### EngineTestKit Builder Methods

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/EngineTestKit

This section details the various methods available on the EngineTestKit.Builder to configure test discovery and execution.

```APIDOC
## EngineTestKit.Builder

This class provides a builder pattern for configuring and executing tests with the JUnit Platform.

### Method Details

#### `selectors(DiscoverySelector... selectors)`

**Description**: Adds discovery selectors to configure which tests to discover.

**Method**: `public EngineTestKit.Builder selectors(DiscoverySelector... selectors)`

**Endpoint**: N/A (Builder Method)

**Parameters**:

*   **Path Parameters**: None
*   **Query Parameters**: None
*   **Request Body**: None

**Request Example**:
```json
{
  "selectors": [
    "org.junit.platform.suite.api.SelectClasses(MyTestClass.class)"
  ]
}
```

**Response**:

*   **Success Response (200)**: N/A (Builder Method)

**Response Example**:
```json
{
  "message": "Builder configured successfully"
}
```

#### `filters(DiscoveryFilter<?>... filters)`

**Description**: Adds discovery filters to filter discovered tests. This method is deprecated.

**Method**: `@Deprecated public EngineTestKit.Builder filters(DiscoveryFilter<?>... filters)`

**Endpoint**: N/A (Builder Method)

**Parameters**:

*   **Path Parameters**: None
*   **Query Parameters**: None
*   **Request Body**: None

**Request Example**:
```json
{
  "filters": [
    "org.junit.platform.engine.discovery.ClassNameFilter.includeClassNamePatterns(\"com.example.*\")"
  ]
}
```

**Response**:

*   **Success Response (200)**: N/A (Builder Method)

**Response Example**:
```json
{
  "message": "Builder configured successfully"
}
```

#### `filters(Filter<?>... filters)`

**Description**: Adds filters to filter discovered and post-discovered tests.

**Method**: `@API(status=STABLE, since="1.10") public EngineTestKit.Builder filters(Filter<?>... filters)`

**Endpoint**: N/A (Builder Method)

**Parameters**:

*   **Path Parameters**: None
*   **Query Parameters**: None
*   **Request Body**: None

**Request Example**:
```json
{
  "filters": [
    "org.junit.platform.engine.discovery.TagFilter.includeTags(\"fast\")"
  ]
}
```

**Response**:

*   **Success Response (200)**: N/A (Builder Method)

**Response Example**:
```json
{
  "message": "Builder configured successfully"
}
```

#### `configurationParameter(String key, String value)`

**Description**: Adds a single configuration parameter to the test engine.

**Method**: `public EngineTestKit.Builder configurationParameter(String key, String value)`

**Endpoint**: N/A (Builder Method)

**Parameters**:

*   **Path Parameters**: None
*   **Query Parameters**: None
*   **Request Body**: None

**Request Example**:
```json
{
  "key": "junit.jupiter.extensions.autodetection.enabled",
  "value": "true"
}
```

**Response**:

*   **Success Response (200)**: N/A (Builder Method)

**Response Example**:
```json
{
  "message": "Builder configured successfully"
}
```

#### `configurationParameters(Map<String, String> configurationParameters)`

**Description**: Adds multiple configuration parameters to the test engine.

**Method**: `public EngineTestKit.Builder configurationParameters(Map<String,String> configurationParameters)`

**Endpoint**: N/A (Builder Method)

**Parameters**:

*   **Path Parameters**: None
*   **Query Parameters**: None
*   **Request Body**: None

**Request Example**:
```json
{
  "configurationParameters": {
    "junit.jupiter.extensions.autodetection.enabled": "true",
    "junit.jupiter.execution.parallel.enabled": "false"
  }
}
```

**Response**:

*   **Success Response (200)**: N/A (Builder Method)

**Response Example**:
```json
{
  "message": "Builder configured successfully"
}
```

#### `enableImplicitConfigurationParameters(boolean enabled)`

**Description**: Configures whether implicit configuration parameters (from system properties and `junit-platform.properties`) should be considered.

**Method**: `@API(status=STABLE, since="1.10") public EngineTestKit.Builder enableImplicitConfigurationParameters(boolean enabled)`

**Endpoint**: N/A (Builder Method)

**Parameters**:

*   **Path Parameters**: None
*   **Query Parameters**: None
*   **Request Body**: None

**Request Example**:
```json
{
  "enabled": true
}
```

**Response**:

*   **Success Response (200)**: N/A (Builder Method)

**Response Example**:
```json
{
  "message": "Builder configured successfully"
}
```

#### `outputDirectoryProvider(OutputDirectoryProvider outputDirectoryProvider)`

**Description**: Sets the `OutputDirectoryProvider` to use for generating output files.

**Method**: `@API(status=MAINTAINED, since="1.13.3") public EngineTestKit.Builder outputDirectoryProvider(OutputDirectoryProvider outputDirectoryProvider)`

**Endpoint**: N/A (Builder Method)

**Parameters**:

*   **Path Parameters**: None
*   **Query Parameters**: None
*   **Request Body**: None

**Request Example**:
```json
{
  "outputDirectoryProvider": "com.example.MyOutputProvider"
}
```

**Response**:

*   **Success Response (200)**: N/A (Builder Method)

**Response Example**:
```json
{
  "message": "Builder configured successfully"
}
```

#### `discover()`

**Description**: Discovers tests based on the configured selectors, filters, and parameters.

**Method**: `@API(status=MAINTAINED, since="1.13.3") public EngineDiscoveryResults discover()`

**Endpoint**: N/A (Builder Method)

**Parameters**: None

**Request Example**: N/A (Method call)

**Response**:

*   **Success Response (200)**: `EngineDiscoveryResults` - The recorded discovery results.

    *   `containerCount` (int) - The number of test containers discovered.
    *   `testCount` (int) - The number of tests discovered.

**Response Example**:
```json
{
  "containerCount": 1,
  "testCount": 10
}
```

#### `execute()`

**Description**: Executes the discovered tests based on the configured selectors, filters, and parameters.

**Method**: `public EngineExecutionResults execute()`

**Endpoint**: N/A (Builder Method)

**Parameters**: None

**Request Example**: N/A (Method call)

**Response**:

*   **Success Response (200)**: `EngineExecutionResults` - The results of the test execution.

    *   `executionSummary` (ExecutionSummary) - Summary of the execution.

**Response Example**:
```json
{
  "executionSummary": {
    "startedCount": 10,
    "succeededCount": 9,
    "failedCount": 1,
    "abortedCount": 0,
    "skippedCount": 0,
    "containerExecutionResults": { ... },
    "testExecutionResults": [ ... ]
  }
}
```
```

--------------------------------

### LauncherDiscoveryListener Methods (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/class-use/LauncherDiscoveryRequest

These default methods in LauncherDiscoveryListener are callbacks for the start and end of test discovery, accepting a LauncherDiscoveryRequest. They are intended to be overridden by implementations.

```java
default void launcherDiscoveryFinished(LauncherDiscoveryRequest request)
```

```java
default void launcherDiscoveryStarted(LauncherDiscoveryRequest request)
```

--------------------------------

### Get Parent of a TestDescriptor

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/TestDescriptor

Retrieves the parent TestDescriptor of the current descriptor, if it exists. Returns an empty Optional if the descriptor is a root.

```java
Optional<TestDescriptor> parent = testDescriptor.getParent();
```

--------------------------------

### Create ReportEntry using Key-Value Pairs (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/reporting/class-use/ReportEntry

Demonstrates how to create a `ReportEntry` instance using a key-value pair. This factory method is useful for simple reporting data.

```java
import org.junit.platform.engine.reporting.ReportEntry;
import java.util.Map;

// ...

// Create a ReportEntry from a single key-value pair
ReportEntry entry1 = ReportEntry.from("customKey", "customValue");

// Create a ReportEntry from a map of key-value pairs
Map<String, String> data = Map.of("key1", "value1", "key2", "value2");
ReportEntry entry2 = ReportEntry.from(data);
```

--------------------------------

### Get TestTag Name in Java

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/TestTag

Retrieves the name of the TestTag instance. The returned name will never be null or blank.

```java
import org.junit.platform.engine.TestTag;

// ...

TestTag tag = TestTag.create("exampleTag");
String tagName = tag.getName();
System.out.println("Tag name: " + tagName); // Output: Tag name: exampleTag
```

--------------------------------

### Configure and Execute Test Engine with EngineTestKit.Builder (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/EngineTestKit

This snippet demonstrates how to use the EngineTestKit.Builder to configure a test engine with selectors, filters, and parameters, and then execute it. It's useful for testing custom test engines or understanding the execution flow of the JUnit Platform.

```java
import org.junit.platform.engine.ConfigurationParameters;
import org.junit.platform.engine.DiscoveryFilter;
import org.junit.platform.engine.Filter;
import org.junit.platform.engine.TestEngine;
import org.junit.platform.engine.discovery.DiscoverySelector;
import org.junit.platform.testkit.engine.EngineDiscoveryResults;
import org.junit.platform.testkit.engine.EngineExecutionResults;
import org.junit.platform.testkit.engine.EngineTestKit;

import java.util.Map;

public class EngineTestKitExample {

    public void exampleUsage(TestEngine testEngine) {
        // Example using selectors, filters, and configuration parameters
        EngineExecutionResults results = EngineTestKit
                .engine(testEngine)
                .selectors(new MyDiscoverySelector()) // Replace with actual DiscoverySelector
                .filters(new MyFilter()) // Replace with actual Filter
                .configurationParameter("key", "value")
                .configurationParameters(Map.of("anotherKey", "anotherValue"))
                .execute();

        // Example for discovery only
        EngineDiscoveryResults discoveryResults = EngineTestKit
                .engine(testEngine)
                .selectors(new MyDiscoverySelector()) // Replace with actual DiscoverySelector
                .discover();
    }

    // Placeholder classes for demonstration
    private static class MyDiscoverySelector implements DiscoverySelector {
        // Implementation details...
    }

    private static class MyFilter implements Filter<Object> {
        // Implementation details...
    }
}
```

--------------------------------

### Get Parameter Index of ParameterDeclaration

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/support/ParameterDeclaration

Returns the index of the parameter within the declaration. This method is provided by the ParameterDeclaration interface.

```java
int getParameterIndex()
```

--------------------------------

### ExternalResourceAdapter Lifecycle Methods - Java

Source: https://docs.junit.org/current/api/org.junit.jupiter.migrationsupport/org/junit/jupiter/migrationsupport/rules/adapter/ExternalResourceAdapter

These methods, 'before' and 'after', are part of the GenericBeforeAndAfterAdvice interface implemented by ExternalResourceAdapter. They are typically used to set up and tear down test environments before and after test execution, respectively.

```java
public void before()

```

```java
public void after()
```

--------------------------------

### AnnotationConsumer Interface (Java)

Source: https://docs.junit.org/current/api/index-files/index-1

A functional interface for consuming annotations. Implementations can be used to process annotations during test execution or setup.

```java
import org.junit.jupiter.params.support.AnnotationConsumer;
import java.lang.annotation.Annotation;

// Example implementation:
class MyAnnotationConsumer implements AnnotationConsumer<MyAnnotation> {
    private MyAnnotation consumedAnnotation;

    @Override
    public void consume(MyAnnotation annotation) {
        this.consumedAnnotation = annotation;
        System.out.println("Consumed annotation: " + annotation);
    }
}

// Dummy annotation for example:
@interface MyAnnotation {}

```

--------------------------------

### VintageEngineDescriptor Constructor

Source: https://docs.junit.org/current/api/org.junit.vintage.engine/org/junit/vintage/engine/descriptor/VintageEngineDescriptor

Initializes a new instance of the VintageEngineDescriptor class.

```APIDOC
## VintageEngineDescriptor(UniqueId uniqueId)

### Description
Constructs a new VintageEngineDescriptor with the given unique ID.

### Method
CONSTRUCTOR

### Endpoint
N/A

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
N/A

### Response
#### Success Response (200)
N/A

#### Response Example
N/A
```

--------------------------------

### Constructor for LegacyXmlReportGeneratingListener

Source: https://docs.junit.org/current/api/index-files/index-12

Initializes the LegacyXmlReportGeneratingListener which generates a separate XML report for each root in the TestPlan. It requires a Path and a PrintWriter for report output.

```java
LegacyXmlReportGeneratingListener(Path, PrintWriter)
```

--------------------------------

### Get Engine Execution Results

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/ExecutionRecorder

Retrieves the current state of the engine's execution. This method provides access to all recorded execution information.

```java
public EngineExecutionResults getExecutionResults()
```

--------------------------------

### JUnit Node Preparation Method

Source: https://docs.junit.org/current/api/index-files/index-16

The `prepare(C context)` method in the `org.junit.platform.engine.support.hierarchical.Node` interface is responsible for preparing a given context before execution. This method is intended to be overridden in subclasses to provide specific preparation logic for different types of nodes in the test plan.

```java
interface org.junit.platform.engine.support.hierarchical.Node<C> {
    void prepare(C context);
}
```

--------------------------------

### Getting Executable from DynamicTestInvocationContext

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the Executable for a dynamic test invocation context. This is part of the extension model for dynamic tests.

```java
DynamicTestInvocationContext.getExecutable()
```

--------------------------------

### Get Selected Iterations - Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestDiscoveryOptions

Retrieves a list of iteration selectors, specifying specific iterations to run for parameterized tests.

```java
List<IterationSelector> selectedIterations = discoveryOptions.getSelectedIterations();
```

--------------------------------

### JUnit 5 @BeforeAll Annotation

Source: https://docs.junit.org/current/user-guide/index

User code executed before all tests in a test class. This is typically used for one-time setup operations.

```java
import org.junit.jupiter.api.BeforeAll;

class MyTest {
    @BeforeAll
    static void setUp() {
        // Code to run once before all tests
    }

    // ... other tests ...
}
```

--------------------------------

### Getting ExecutableInvoker from ExtensionContext

Source: https://docs.junit.org/current/api/index-files/index-7

Obtains an ExecutableInvoker from an ExtensionContext. This invoker supports dynamic resolution of parameters when invoking methods and constructors.

```java
ExtensionContext.getExecutableInvoker()
```

--------------------------------

### JUnit 5 Suite Configuration with `@Suite` Annotation

Source: https://docs.junit.org/current/api/org.junit.platform.suite.api/org/junit/platform/suite/api/package-summary

Configure JUnit 5 test suites on the JUnit Platform using the `@Suite` annotation. This relies on the `junit-platform-suite-engine`.

```java
import org.junit.platform.suite.api.Suite;

@Suite
public class MySuiteTest {}
```

--------------------------------

### Get Artifact ID from VintageTestEngine

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the artifact ID for the Vintage Engine. This method is part of the VintageTestEngine class.

```java
getArtifactId() - Method in class org.junit.vintage.engine.VintageTestEngine
    
Returns `junit-vintage-engine` as the artifact ID.
```

--------------------------------

### EngineTestKit Builder Configuration

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/EngineTestKit

This section covers methods for configuring the test engine builder.

```APIDOC
## EngineTestKit.Builder API

### Description
This class provides a builder pattern for configuring and executing a `TestEngine`.

### Method Summary

#### Configuration Methods

- `configurationParameter(String key, String value)`: Add a single configuration parameter.
- `configurationParameters(Map<String, String> configurationParameters)`: Add multiple configuration parameters.
- `enableImplicitConfigurationParameters(boolean enabled)`: Configure whether implicit configuration parameters are considered.
- `filters(Filter<?>... filters)`: Add discovery filters.
- `selectors(DiscoverySelector... selectors)`: Add discovery selectors.
- `outputDirectoryProvider(OutputDirectoryProvider outputDirectoryProvider)`: Set the output directory provider.

#### Execution Methods

- `discover()`: Discovers tests based on the current configuration.
- `execute()`: Executes tests based on the current configuration.
```

--------------------------------

### Get Parameter Declaration

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves an indexed parameter declaration from ParameterDeclarations. Returns an empty Optional if the index is out of bounds.

```java
get(int index)

```

--------------------------------

### Configuring JUnit Platform Parameters (Gradle)

Source: https://docs.junit.org/current/user-guide/index

Demonstrates how to set JUnit Platform configuration parameters within a Gradle build script using system properties. These parameters can influence test discovery and execution.

```groovy
test {
    // ...
    systemProperty("junit.jupiter.conditions.deactivate", "*")
    systemProperty("junit.jupiter.extensions.autodetection.enabled", true)
    systemProperty("junit.jupiter.testinstance.lifecycle.default", "per_class")
    // ...
}
```

--------------------------------

### Get FilePosition from selectors (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/discovery/class-use/FilePosition

Retrieves the FilePosition associated with a ClasspathResourceSelector or a generic FileSelector. Returns an Optional as the position might not always be present.

```java
ClasspathResourceSelector.getPosition()
FileSelector.getPosition()
```

--------------------------------

### Get Configuration Parameters (Java) - org.junit.platform.launcher.TestPlan

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the `ConfigurationParameters` for a test plan. This allows access to configuration settings relevant to the entire test plan.

```Java
org.junit.platform.engine.ConfigurationParameters org.junit.platform.launcher.TestPlan.getConfigurationParameters()
```

--------------------------------

### Get Configuration Parameters in JUnit ExecutionRequest

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/ExecutionRequest

Retrieves the ConfigurationParameters for the test execution. These parameters can be used by the engine to influence how tests are executed.

```java
public ConfigurationParameters getConfigurationParameters()
```

--------------------------------

### DefaultResource Constructor and Methods (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.commons/org/junit/platform/commons/support/DefaultResource

This snippet shows the constructor and key methods of the DefaultResource class. It includes methods for retrieving the resource name and URI, as well as standard object methods like equals, hashCode, and toString. Note that this class is intended for internal JUnit framework use only.

```java
public class DefaultResource extends Object implements Resource {

    @API(status=INTERNAL, since="1.12")
    public DefaultResource(String name, URI uri)

    public boolean equals(Object o)

    public String getName()

    public URI getUri()

    public int hashCode()

    public String toString()

    // Methods inherited from class java.lang.Object
    // clone, finalize, getClass, notify, notifyAll, wait, wait, wait

    // Methods inherited from interface org.junit.platform.commons.support.Resource
    // getInputStream
}
```

--------------------------------

### Register Multiple Extensions Separately (Java)

Source: https://docs.junit.org/current/user-guide

This example shows an alternative method for registering multiple extensions by applying the @ExtendWith annotation multiple times to the same test class or method. The extensions will be executed in the order they appear in the source code.

```java
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(DatabaseExtension.class)
@ExtendWith(WebServerExtension.class)
class MySecondTests {
    // ... test methods here ...
}
```

--------------------------------

### Enable Auto-Registration for Launcher Discovery Listeners

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/class-use/LauncherConfig

Configures whether launcher discovery listeners should be automatically registered. This can simplify setup by allowing the system to find listeners automatically.

```java
LauncherConfig.Builder builder = LauncherConfig.builder();
builder.enableLauncherDiscoveryListenerAutoRegistration(true);
```

--------------------------------

### executionStarted Method (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/EngineExecutionListener

Callback method invoked before the execution of a test or a subtree begins. For containers, it must be called before starting or skipping any children. This method should only be called if the test or container has not been skipped. It is part of the `EngineExecutionListener` interface.

```java
default void executionStarted(TestDescriptor testDescriptor) {
    // Must be called when the execution of a leaf or subtree of the test tree is about to be started.
}
```

--------------------------------

### Get Test Source - Java

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/TestDescriptor

Retrieves the optional source of the test or container described by this descriptor. The source may not always be available.

```java
Optional<TestSource> getSource()
// Returns: Optional<TestSource>
```

--------------------------------

### Custom Test Engine: FirstCustomEngine Sharing ServerSocket

Source: https://docs.junit.org/current/user-guide/index

This Java code defines a custom test engine (`FirstCustomEngine`) that utilizes JUnit Platform's `NamespacedHierarchicalStore` to retrieve or create a shared `ServerSocket` instance. It demonstrates lazy initialization and ensures the `ServerSocket` is available for other engines.

```java
import static java.net.InetAddress.getLoopbackAddress;
import static org.junit.platform.engine.TestExecutionResult.successful;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.ServerSocket;

import org.junit.platform.engine.EngineDiscoveryRequest;
import org.junit.platform.engine.ExecutionRequest;
import org.junit.platform.engine.TestDescriptor;
import org.junit.platform.engine.TestEngine;
import org.junit.platform.engine.UniqueId;
import org.junit.platform.engine.support.descriptor.EngineDescriptor;
import org.junit.platform.engine.support.store.Namespace;
import org.junit.platform.engine.support.store.NamespacedHierarchicalStore;

/**
 * First custom test engine implementation.
 */
public class FirstCustomEngine implements TestEngine {

    public ServerSocket socket;

    @Override
    public String getId() {
        return "first-custom-test-engine";
    }

    @Override
    public TestDescriptor discover(EngineDiscoveryRequest discoveryRequest, UniqueId uniqueId) {
        return new EngineDescriptor(uniqueId, "First Custom Test Engine");
    }

    @Override
    public void execute(ExecutionRequest request) {
        request.getEngineExecutionListener()
                .executionStarted(request.getRootTestDescriptor());

        NamespacedHierarchicalStore<Namespace> store = request.getStore();
        socket = store.getOrComputeIfAbsent(Namespace.GLOBAL, "serverSocket", key -> {
            try {
                return new ServerSocket(0, 50, getLoopbackAddress());
            }
            catch (IOException e) {
                throw new UncheckedIOException("Failed to start ServerSocket", e);
            }
        }, ServerSocket.class);

        request.getEngineExecutionListener()
                .executionFinished(request.getRootTestDescriptor(), successful());
    }
}
```

--------------------------------

### Argument Collection and Invocation Info

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/aggregator/ArgumentsAccessor

Methods to retrieve all arguments as an array or list, and to get the current test invocation index.

```APIDOC
## GET /arguments/size

### Description
Get the number of arguments available in this accessor.

### Method
GET

### Endpoint
`/arguments/size`

### Response
#### Success Response (200)
- **count** (int) - The total number of arguments.

#### Response Example
```json
{
  "count": 5
}
```
```

```APIDOC
## GET /arguments/toArray

### Description
Get all arguments in this accessor as an array.

### Method
GET

### Endpoint
`/arguments/toArray`

### Response
#### Success Response (200)
- **arguments** (Array<Object>) - An array containing all arguments.

#### Response Example
```json
{
  "arguments": [
    "arg1",
    123,
    true
  ]
}
```
```

```APIDOC
## GET /arguments/toList

### Description
Get all arguments in this accessor as an immutable list.

### Method
GET

### Endpoint
`/arguments/toList`

### Response
#### Success Response (200)
- **arguments** (List<Object>) - An immutable list containing all arguments.

#### Response Example
```json
{
  "arguments": [
    "arg1",
    123,
    true
  ]
}
```
```

```APIDOC
## GET /invocation/index

### Description
Get the index of the current test invocation.

### Method
GET

### Endpoint
`/invocation/index`

### Response
#### Success Response (200)
- **index** (int) - The index of the current test invocation.

#### Response Example
```json
{
  "index": 2
}
```
```

--------------------------------

### Build JupiterEngineExecutionContext with Builder

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/execution/JupiterEngineExecutionContext

Demonstrates how to use the JupiterEngineExecutionContext.Builder to construct an execution context. This involves setting various providers and registries before building the final context object.

```java
JupiterEngineExecutionContext.Builder builder = new JupiterEngineExecutionContext.Builder();
bool success = builder
    .withExtensionContext(extensionContext)
    .withExtensionRegistry(extensionRegistry)
    .withTestInstancesProvider(testInstancesProvider)
    .withThrowableCollector(throwableCollector)
    .build();
```

--------------------------------

### Get Artifact ID (Java)

Source: https://docs.junit.org/current/api/org.junit.vintage.engine/org/junit/vintage/engine/VintageTestEngine

Retrieves the artifact ID for the JUnit Vintage engine, which is 'junit-vintage-engine'. The return value is an Optional and may be empty.

```java
public Optional<String> getArtifactId()
// Returns: an Optional containing the artifact ID; never null but potentially empty if the artifact ID is unknown
```

--------------------------------

### Get Configuration Parameter (Java) - org.junit.jupiter.api.ClassOrdererContext

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves a configuration parameter by its key. This is used in the context of ordering test classes.

```Java
java.lang.String org.junit.jupiter.api.ClassOrdererContext.getConfigurationParameter(String key)
```

--------------------------------

### Configure JUnit classpath and resources

Source: https://docs.junit.org/current/user-guide

Options for managing the classpath and setting configuration resources. The classpath option can be repeated to add multiple entries.

```CLI
-cp, --classpath, --class-path=PATH
                             Provide additional classpath entries -- for example, for adding
                               engines and their dependencies. This option can be repeated.
--config-resource=PATH Set configuration parameters for test discovery and execution via
                               a classpath resource. This option can be repeated.
```

--------------------------------

### Get Skipped Executions - Java

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Executions

Retrieves all skipped executions from the current Executions object. This is useful for identifying tests that were not run.

```java
Executions skipped()
```

--------------------------------

### Get Finished Executions - Java

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Executions

Retrieves all finished executions from the current Executions object. This includes both successful and failed executions.

```java
Executions finished()
```

--------------------------------

### JUnit Jupiter Engine Execution Context Preparation

Source: https://docs.junit.org/current/api/index-files/index-16

Several `JupiterTestDescriptor` subclasses implement the `prepare(JupiterEngineExecutionContext)` method. This method is crucial for setting up the execution context for test descriptors, ensuring that each descriptor operates with its own isolated `ExtensionContext` to prevent interference between test elements.

```java
class org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor {
    void prepare(JupiterEngineExecutionContext context);
}
class org.junit.jupiter.engine.descriptor.ClassTemplateInvocationTestDescriptor {
    void prepare(JupiterEngineExecutionContext context);
}
class org.junit.jupiter.engine.descriptor.JupiterEngineDescriptor {
    void prepare(JupiterEngineExecutionContext context);
}
class org.junit.jupiter.engine.descriptor.JupiterTestDescriptor {
    void prepare(JupiterEngineExecutionContext context);
}
class org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor {
    void prepare(JupiterEngineExecutionContext context);
}
class org.junit.jupiter.engine.descriptor.TestTemplateTestDescriptor {
    void prepare(JupiterEngineExecutionContext context);
}
```

--------------------------------

### Getting Executable from DynamicTest

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the executable code block associated with a DynamicTest. This allows for the execution of dynamically generated tests.

```java
DynamicTest.getExecutable()
```

--------------------------------

### Getting Execution Listener from ExecutionContext

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the execution listener from a JupiterEngineExecutionContext. This listener is used to report test execution events.

```java
JupiterEngineExecutionContext.getExecutionListener()
```

--------------------------------

### DiscoverySelector API

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/DiscoverySelector

Documentation for the DiscoverySelector interface.

```APIDOC
## interface DiscoverySelector

### Description
A selector defines what a `TestEngine` can use to discover tests — for example, the name of a Java class, the path to a file or directory, etc.

### Status
@API(status=STABLE, since="1.0")

### Implemented By
`ClasspathResourceSelector`, `ClasspathRootSelector`, `ClassSelector`, `DirectorySelector`, `FileSelector`, `IterationSelector`, `MethodSelector`, `ModuleSelector`, `NestedClassSelector`, `NestedMethodSelector`, `PackageSelector`, `UniqueIdSelector`, `UriSelector`

### See Also
* `EngineDiscoveryRequest`
* `DiscoverySelectors`
```

--------------------------------

### Getting Engine Filters

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the EngineFilters associated with a LauncherDiscoveryRequest. These filters determine which engines are included or excluded during test discovery.

```java
LauncherDiscoveryRequest.getEngineFilters()
```

--------------------------------

### JUnit Platform Reporting Configuration Parameters

Source: https://docs.junit.org/current/user-guide/index

Shows configuration parameters for JUnit Platform reporting. This includes setting the output directory for reports and enabling/disabling Open Test Reporting and its Git integration. These parameters control where and how test execution reports are generated.

```properties
junit.platform.reporting.output.dir=<path>
junit.platform.reporting.open.xml.enabled=true|false
junit.platform.reporting.open.xml.git.enabled=true|false

```

--------------------------------

### Get Method Name of MethodSource (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/descriptor/MethodSource

Retrieves the method name associated with this MethodSource. This returns the name of the method represented by this source.

```Java
public final String getMethodName()
```

--------------------------------

### Create OutputDir Instance

Source: https://docs.junit.org/current/api/index-files/index-3

Creates an `OutputDir` instance, which represents a directory for output, potentially from an `Optional<String>` path.

```java
OutputDir outputDir = OutputDir.create(Optional.of("/path/to/output"));
```

--------------------------------

### JUnit Test Execution Listener: Execution Started Handling

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/TestExecutionListener

Called before a test or container execution begins, provided it has not been skipped. This method is invoked for containers before their children are processed.

```java
default void executionStarted(TestIdentifier testIdentifier) {
    // implementation details
}
```

--------------------------------

### TestEngine Interface Documentation

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/TestEngine

Documentation for the TestEngine interface, including its purpose, methods, and parameters.

```APIDOC
## TestEngine Interface

### Description
A `TestEngine` facilitates discovery and execution of tests for a particular programming model. Every `TestEngine` must provide its own unique ID, discover tests from `EngineDiscoveryRequests`, and execute those tests according to `ExecutionRequests`. Implementations are encouraged to use the `@Testable` annotation for test discovery within IDEs and tools.

### Known Implementing Classes
- `HierarchicalTestEngine`
- `JupiterTestEngine`
- `SuiteTestEngine`
- `VintageTestEngine`

### Methods

#### `getId`
- **Method**: `String getId()`
- **Description**: Gets the ID that uniquely identifies this test engine. Each test engine must provide a unique ID (e.g., "junit-vintage", "junit-jupiter").
- **Returns**: The ID of this test engine; never `null` or blank.

#### `discover`
- **Method**: `TestDescriptor discover(EngineDiscoveryRequest discoveryRequest, UniqueId uniqueId)`
- **Description**: Discovers tests according to the supplied `EngineDiscoveryRequest`. The `uniqueId` is used as the root `TestDescriptor`'s ID and for creating child descriptor IDs.
- **Parameters**:
  - **`discoveryRequest`** (EngineDiscoveryRequest) - Required - The discovery request.
  - **`uniqueId`** (UniqueId) - Required - The unique ID to be used for this test engine's `TestDescriptor`.
- **Returns**: The root `TestDescriptor` of this engine.

#### `execute`
- **Method**: `void execute(ExecutionRequest request)`
- **Description**: Executes tests according to the supplied `ExecutionRequest`. The request contains the root `TestDescriptor`, `EngineExecutionListener`, and `ConfigurationParameters`.
- **Parameters**:
  - **`request`** (ExecutionRequest) - Required - The request to execute tests for.

#### `getGroupId`
- **Method**: `Optional<String> getGroupId()`
- **Description**: Gets the Group ID of the JAR in which this test engine is packaged, used for debugging and reporting. Returns an empty `Optional` if unknown.
- **Returns**: An `Optional` containing the group ID; never `null` but potentially empty.

#### `getArtifactId`
- **Method**: `Optional<String> getArtifactId()`
- **Description**: Gets the Artifact ID of the JAR in which this test engine is packaged, used for debugging and reporting. Tries to infer from the package attributes.
- **Returns**: An `Optional` containing the artifact ID; never `null` but potentially empty.

#### `getVersion`
- **Method**: `Optional<String> getVersion()`
- **Description**: Gets the version of this test engine. Returns an empty `Optional` if unknown.
- **Returns**: An `Optional` containing the version; never `null` but potentially empty.

### See Also
- `EngineDiscoveryRequest`
- `ExecutionRequest`
- `Testable`
- `EngineDescriptor`
```

--------------------------------

### Get Configuration Parameters - Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestDiscoveryOptions

Retrieves a map of configuration parameters for test discovery. These parameters can influence how tests are discovered and executed.

```java
Map<String, String> configurationParameters = discoveryOptions.getConfigurationParameters();
```

--------------------------------

### Get Descriptor Type - Java

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/TestDescriptor

Determines the type of this test descriptor (e.g., container, test). The returned type is never null.

```java
TestDescriptor.Type getType()
// Returns: the descriptor type; never `null`.
```

--------------------------------

### DefaultJupiterConfiguration Constructor (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/config/DefaultJupiterConfiguration

Constructs a DefaultJupiterConfiguration with the provided ConfigurationParameters and OutputDirectoryProvider. This constructor is essential for initializing the configuration settings for the Jupiter engine.

```java
DefaultJupiterConfiguration(ConfigurationParameters configurationParameters,  OutputDirectoryProvider outputDirectoryProvider)
```

--------------------------------

### Get Boolean Configuration Parameter

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves a boolean configuration parameter by its key. This is useful for setting up test execution environments.

```java
getBoolean(String) - Method in interface org.junit.platform.engine.ConfigurationParameters
    
Get the boolean configuration parameter stored under the specified `key`.
```

```java
getBoolean(String) - Method in class org.junit.platform.engine.support.config.PrefixedConfigurationParameters
     
```

--------------------------------

### Getting Excluded Method Name Patterns

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the patterns for method names that should be excluded from test discovery. This is part of the TestDiscoveryOptions.

```java
TestDiscoveryOptions.getExcludedMethodNamePatterns()
```

--------------------------------

### Configure junitlauncher to Select Test Classes from Multiple Locations

Source: https://docs.junit.org/current/user-guide/index

This Ant configuration demonstrates how to use the junitlauncher task to select multiple test classes residing in different directories. It utilizes filesets to include test classes from specified base directories.

```xml
<path id="test.classpath">
    <!-- The location where you have your compiled classes -->
    <pathelement location="${build.classes.dir}" />
</path>
<!-- ... -->
<junitlauncher>
    <classpath refid="test.classpath" />
    <testclasses outputdir="${output.dir}">
        <fileset dir="${build.classes.dir}">
            <include name="org/example/**/demo/**/" />
        </fileset>
        <fileset dir="${some.other.dir}">
            <include name="org/myapp/**/" />
        </fileset>
    </testclasses>
</junitlauncher>
```

--------------------------------

### Get Children from TestPlan

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves children from a TestPlan using different identifier types. The `getChildren(String)` method is deprecated.

```java
getChildren(String) - Method in class org.junit.platform.launcher.TestPlan
    
Deprecated.
Use `TestPlan.getChildren(UniqueId)` 
```

```java
getChildren(UniqueId) - Method in class org.junit.platform.launcher.TestPlan
    
Get the children of the supplied unique ID.
```

```java
getChildren(TestIdentifier) - Method in class org.junit.platform.launcher.TestPlan
    
Get the children of the supplied `TestIdentifier`.
```

--------------------------------

### Get ClassLoader from Discovery Selectors

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the ClassLoader used for loading classes or methods specified by various selector types.

```java
getClassLoader() - Method in class org.junit.platform.engine.discovery.ClassSelector
    
Get the `ClassLoader` used to load the selected class.
```

```java
getClassLoader() - Method in class org.junit.platform.engine.discovery.MethodSelector
    
Get the `ClassLoader` used to load the specified class.
```

```java
getClassLoader() - Method in class org.junit.platform.engine.discovery.NestedClassSelector
    
Get the `ClassLoader` used to load the selected nested class.
```

```java
getClassLoader() - Method in class org.junit.platform.engine.discovery.NestedMethodSelector
    
Get the `ClassLoader` used to load the nested class.
```

--------------------------------

### Get Source of a TestDescriptor

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/TestDescriptor

Retrieves the source of the test or container described by this descriptor, if available. This could be a class, method, or other source element.

```java
Optional<TestSource> source = testDescriptor.getSource();
```

--------------------------------

### Launcher Discovery Request DSL

Source: https://docs.junit.org/current/api/index-files/index-12

Illustrates the use of a lightweight DSL provided by LauncherDiscoveryRequestBuilder to generate a LauncherDiscoveryRequest. This DSL simplifies the process of defining discovery criteria.

```java
LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder.request()
    .selectors(selectPackage("com.example.tests"))
    .filters(includeClassNamePattern(".*Test"))
    .build();
```

--------------------------------

### Get Parent Selector from IterationSelector (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/class-use/DiscoverySelector

Retrieves the parent `DiscoverySelector` associated with an `IterationSelector`. This is useful for understanding the context of the selected iterations.

```java
DiscoverySelector IterationSelector.getParentSelector()
```

--------------------------------

### Create and Populate Extension Registry (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/extension/class-use/Extension

A factory method for creating a new extension registry, optionally populated from a parent registry and a stream of extension types. This is used for setting up the extension management infrastructure.

```java
static MutableExtensionRegistry MutableExtensionRegistry.createRegistryFrom(MutableExtensionRegistry parentRegistry, Stream<Class<? extends Extension>> extensionTypes)
```

--------------------------------

### Set OutputDirectoryProvider in SuiteLauncherDiscoveryRequestBuilder

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/reporting/class-use/OutputDirectoryProvider

Demonstrates setting the `OutputDirectoryProvider` on a `SuiteLauncherDiscoveryRequestBuilder`. This enables configuration of the output directory for suite-level discovery requests.

```java
/**
 * @param outputDirectoryProvider the {@code OutputDirectoryProvider} to use
 * @return this builder
 */
SuiteLauncherDiscoveryRequestBuilder outputDirectoryProvider(OutputDirectoryProvider outputDirectoryProvider);
```

--------------------------------

### SuiteLauncherDiscoveryRequestBuilder API

Source: https://docs.junit.org/current/api/org.junit.platform.suite.commons/org/junit/platform/suite/commons/class-use/SuiteLauncherDiscoveryRequestBuilder

Provides methods to construct and configure a test suite discovery request.

```APIDOC
## SuiteLauncherDiscoveryRequestBuilder Methods

### Description
Methods for building and configuring a test suite discovery request using the JUnit Platform.

### Methods

- **`SuiteLauncherDiscoveryRequestBuilder request()`**
  - **Description**: Creates a new `SuiteLauncherDiscoveryRequestBuilder` instance.
  - **Returns**: A new `SuiteLauncherDiscoveryRequestBuilder`.

- **`SuiteLauncherDiscoveryRequestBuilder applyConfigurationParametersFromSuite(Class<?> suiteClass)`**
  - **Description**: Applies suite's annotation-based configuration to this builder.
  - **Parameters**:
    - `suiteClass` (Class<?>) - The class of the test suite.
  - **Returns**: The updated `SuiteLauncherDiscoveryRequestBuilder`.

- **`SuiteLauncherDiscoveryRequestBuilder applySelectorsAndFiltersFromSuite(Class<?> suiteClass)`**
  - **Description**: Applies suite's annotation-based discovery selectors and filters to this builder.
  - **Parameters**:
    - `suiteClass` (Class<?>) - The class of the test suite.
  - **Returns**: The updated `SuiteLauncherDiscoveryRequestBuilder`.

- **`SuiteLauncherDiscoveryRequestBuilder configurationParameter(String key, String value)`**
  - **Description**: Adds a configuration parameter to the request.
  - **Parameters**:
    - `key` (String) - The key of the configuration parameter.
    - `value` (String) - The value of the configuration parameter.
  - **Returns**: The updated `SuiteLauncherDiscoveryRequestBuilder`.

- **`SuiteLauncherDiscoveryRequestBuilder configurationParameters(Map<String, String> configurationParameters)`**
  - **Description**: Adds multiple configuration parameters to the request.
  - **Parameters**:
    - `configurationParameters` (Map<String, String>) - A map of configuration parameters.
  - **Returns**: The updated `SuiteLauncherDiscoveryRequestBuilder`.

- **`SuiteLauncherDiscoveryRequestBuilder configurationParametersResource(String resourceFile)`**
  - **Description**: Configures parameters from a resource file.
  - **Parameters**:
    - `resourceFile` (String) - The path to the resource file.
  - **Returns**: The updated `SuiteLauncherDiscoveryRequestBuilder`.

- **`SuiteLauncherDiscoveryRequestBuilder enableImplicitConfigurationParameters(boolean enabled)`**
  - **Description**: Configures whether implicit configuration parameters should be considered.
  - **Parameters**:
    - `enabled` (boolean) - True to enable, false to disable.
  - **Returns**: The updated `SuiteLauncherDiscoveryRequestBuilder`.

- **`SuiteLauncherDiscoveryRequestBuilder filters(Filter<?>... filters)`**
  - **Description**: Adds discovery filters to the request.
  - **Parameters**:
    - `filters` (Filter<?>...) - Varargs of filters to apply.
  - **Returns**: The updated `SuiteLauncherDiscoveryRequestBuilder`.

- **`SuiteLauncherDiscoveryRequestBuilder filterStandardClassNamePatterns(boolean filterStandardClassNamePatterns)`**
  - **Description**: Specifies whether to filter standard class name patterns.
  - **Parameters**:
    - `filterStandardClassNamePatterns` (boolean) - True to enable filtering, false otherwise.
  - **Returns**: The updated `SuiteLauncherDiscoveryRequestBuilder`.

- **`SuiteLauncherDiscoveryRequestBuilder listener(LauncherDiscoveryListener listener)`**
  - **Description**: Adds a launcher discovery listener.
  - **Parameters**:
    - `listener` (LauncherDiscoveryListener) - The listener to add.
  - **Returns**: The updated `SuiteLauncherDiscoveryRequestBuilder`.

- **`SuiteLauncherDiscoveryRequestBuilder outputDirectoryProvider(OutputDirectoryProvider outputDirectoryProvider)`**
  - **Description**: Sets the output directory provider.
  - **Parameters**:
    - `outputDirectoryProvider` (OutputDirectoryProvider) - The provider to use.
  - **Returns**: The updated `SuiteLauncherDiscoveryRequestBuilder`.

- **`SuiteLauncherDiscoveryRequestBuilder parentConfigurationParameters(ConfigurationParameters parentConfigurationParameters)`**
  - **Description**: Sets the parent configuration parameters for the request.
  - **Parameters**:
    - `parentConfigurationParameters` (ConfigurationParameters) - The parent configuration parameters.
  - **Returns**: The updated `SuiteLauncherDiscoveryRequestBuilder`.

- **`SuiteLauncherDiscoveryRequestBuilder selectors(List<? extends DiscoverySelector> selectors)`**
  - **Description**: Adds discovery selectors to the request from a list.
  - **Parameters**:
    - `selectors` (List<? extends DiscoverySelector>) - A list of selectors.
  - **Returns**: The updated `SuiteLauncherDiscoveryRequestBuilder`.

- **`SuiteLauncherDiscoveryRequestBuilder selectors(DiscoverySelector... selectors)`**
  - **Description**: Adds discovery selectors to the request from varargs.
  - **Parameters**:
    - `selectors` (DiscoverySelector...) - Varargs of selectors to apply.
  - **Returns**: The updated `SuiteLauncherDiscoveryRequestBuilder`.

- **`SuiteLauncherDiscoveryRequestBuilder suite(Class<?> suiteClass)`**
  - **Deprecated**: as of JUnit Platform 1.11 in favor of `applyConfigurationParametersFromSuite(java.lang.Class<?>)` and `applySelectorsAndFiltersFromSuite(java.lang.Class<?>)`.
  - **Description**: Sets the test suite class (deprecated).
  - **Parameters**:
    - `suiteClass` (Class<?>) - The class of the test suite.
  - **Returns**: The updated `SuiteLauncherDiscoveryRequestBuilder`.
```

--------------------------------

### Create EngineTestKit Builder by TestEngine Instance (Java)

Source: https://docs.junit.org/current/api/index-files/index-5

Creates an `EngineTestKit.Builder` for a given `TestEngine` instance. This provides a way to build test execution kits for specific engines.

```java
static EngineTestKit.Builder engine(TestEngine testEngine)
```

--------------------------------

### Get Modifiable Children from VintageEngineDescriptor

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves a modifiable collection of children from a `VintageEngineDescriptor`. This is used internally by the vintage JUnit engine.

```java
Collection<? extends TestDescriptor> getModifiableChildren();
```

--------------------------------

### Getting Execution Mode from TestTask

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the execution mode of a TestTask. This indicates whether the task should be executed sequentially or in parallel.

```java
HierarchicalTestExecutorService.TestTask.getExecutionMode()
```

--------------------------------

### Configure JUnit Platform via Maven Surefire (Property)

Source: https://docs.junit.org/current/user-guide

Demonstrates how to configure the JUnit Platform with Maven Surefire. The `configurationParameters` property within the Surefire plugin configuration allows for passing custom parameters to the platform.

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>3.0.0-M5</version> <!-- Use the latest version -->
    <configuration>
        <configurationParameters>
            <junit.jupiter.conditions.deactivate>\*System\*</junit.jupiter.conditions.deactivate>
            <junit.jupiter.engine.extension.autodetetection.enabled>true</junit.jupiter.engine.extension.autodetetection.enabled>
            <junit.jupiter.displayname.generator.default>org.junit.jupiter.api.DisplayNameGenerator.Simple</junit.jupiter.displayname.generator.default>
        </configurationParameters>
    </configuration>
</plugin>
```

--------------------------------

### Get Additional Post-Discovery Filters (Java)

Source: https://docs.junit.org/current/api/index-files/index-7

Fetches a collection of filters that should be applied after test discovery but before test execution begins. This method is part of `LauncherConfig`.

```java
getAdditionalPostDiscoveryFilters()
```

--------------------------------

### LauncherFactory - openSession()

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherFactory

Opens a new LauncherSession using the default LauncherConfig. This method is useful for initiating a test session with default settings.

```APIDOC
## GET /launcher/session/open

### Description
Factory method for opening a new `LauncherSession` using the default `LauncherConfig`. Test execution listeners are discovered at runtime via the `ServiceLoader` mechanism and are automatically registered.

### Method
GET

### Endpoint
/launcher/session/open

### Parameters

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "example": "No request body needed for this operation."
}
```

### Response
#### Success Response (200)
- **LauncherSession** (object) - An instance of the LauncherSession.

#### Response Example
```json
{
  "example": "LauncherSession object details"
}
```

#### Error Response
- **PreconditionViolationException** - Thrown if no test engines are detected.
```

--------------------------------

### Get Test Class - Java

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/descriptor/MethodBasedTestDescriptor

Retrieves the Class<?> representing the test class for this descriptor. This method is specified in the TestClassAware interface.

```java
public final Class<?> getTestClass()
```

--------------------------------

### TestIdentifier Utility Methods

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/TestIdentifier

Documentation for utility methods like equals, hashCode, isContainer, isTest, and toString.

```APIDOC
## Methods: TestIdentifier Utilities

### Description
These methods provide utility functions for comparing, checking types, and representing the `TestIdentifier`.

#### `equals(Object obj)`
* **Description**: Checks if two `TestIdentifier` objects are equal.
* **Method**: Instance Method
* **Return Type**: `boolean`

#### `hashCode()`
* **Description**: Returns a hash code value for the `TestIdentifier`.
* **Method**: Instance Method
* **Return Type**: `int`

#### `isContainer()`
* **Description**: Determine if this identifier represents a container.
* **Method**: Instance Method
* **Return Type**: `boolean`

#### `isTest()`
* **Description**: Determine if this identifier represents a test.
* **Method**: Instance Method
* **Return Type**: `boolean`

#### `toString()`
* **Description**: Returns a string representation of the `TestIdentifier`.
* **Method**: Instance Method
* **Return Type**: `String>`
```

--------------------------------

### Get Output Directory Provider in JUnit ExecutionRequest

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/ExecutionRequest

Returns the OutputDirectoryProvider for the ExecutionRequest. This provider is responsible for writing reports and other output files. Throws PreconditionViolationException if not available.

```java
@API(status=MAINTAINED, since="1.13.3") public OutputDirectoryProvider getOutputDirectoryProvider()
```

--------------------------------

### Build LauncherConfig - Java

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherConfig

Builds and returns the final LauncherConfig instance based on the configurations set via the builder methods. This is the terminal operation for the builder pattern.

```java
LauncherConfig build()
```

--------------------------------

### Getting Excluded Tag Expressions

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the tag expressions used to exclude tests from discovery. This option is available in TestDiscoveryOptions.

```java
TestDiscoveryOptions.getExcludedTagExpressions()
```

--------------------------------

### Java: IdentifierParser Constructor and Methods

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/discovery/PackageSelector

This snippet shows the constructor and key methods of the IdentifierParser class in Java. The constructor initializes the parser. getPrefix() returns the supported prefix for package selectors, and parse() converts a discovery identifier into a PackageSelector, returning an Optional.

```java
public class PackageSelector {
    @API(status=INTERNAL, since="1.11")
    public static class IdentifierParser extends Object implements DiscoverySelectorIdentifierParser {
        public IdentifierParser() {
            // Constructor implementation
        }

        public String getPrefix() {
            // Returns the prefix supported by this parser
            return "somePrefix"; // Example prefix
        }

        public Optional<PackageSelector> parse(DiscoverySelectorIdentifier identifier, DiscoverySelectorIdentifierParser.Context context) {
            // Parses the DiscoverySelectorIdentifier
            // Returns an Optional containing the parsed PackageSelector or empty
            return Optional.empty(); // Example return
        }
    }
}
```

--------------------------------

### Getting Existing Additional Classpath Entries

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves any additional classpath entries that were already present before configuration. This option is part of TestDiscoveryOptions.

```java
TestDiscoveryOptions.getExistingAdditionalClasspathEntries()
```

--------------------------------

### Create ExecutionRequest with OutputDirectoryProvider

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/reporting/class-use/OutputDirectoryProvider

Provides an example of creating an `ExecutionRequest` using a factory method, which requires an `OutputDirectoryProvider`. This allows specifying where output files should be generated during test execution.

```java
/**
 * Factory for creating an execution request.
 *
 * @param rootTestDescriptor      the root test descriptor
 * @param engineExecutionListener the engine execution listener
 * @param configurationParameters the configuration parameters
 * @param outputDirectoryProvider the output directory provider
 * @param requestLevelStore       the request-level store
 * @return a new {@link ExecutionRequest}
 */
static ExecutionRequest create(TestDescriptor rootTestDescriptor, EngineExecutionListener engineExecutionListener, ConfigurationParameters configurationParameters, OutputDirectoryProvider outputDirectoryProvider, NamespacedHierarchicalStore<Namespace> requestLevelStore);
```

--------------------------------

### ResourceLock Interface API

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/hierarchical/ResourceLock

Documentation for the ResourceLock interface and its methods, including acquire, release, close, getResources, isExclusive, and isCompatible.

```APIDOC
## ResourceLock Interface

### Description
A lock for one or more resources.

### Methods

*   **acquire()**: Acquire this resource lock, potentially blocking.
*   **release()**: Release this resource lock.
*   **close()**: Close the resource lock (implements AutoCloseable).
*   **getResources()**: Returns the exclusive resources this lock represents.
*   **isExclusive()**: Returns whether this lock requires exclusiveness.
*   **isCompatible(ResourceLock other)**: Returns whether the given lock is compatible with this lock.

### Method Details

#### acquire

*   **Method**: `ResourceLock acquire()`
*   **Description**: Acquire this resource lock, potentially blocking.
*   **Returns**: This lock so it can easily be used in a try-with-resources statement.
*   **Throws**: `InterruptedException` - if the calling thread is interrupted while waiting to acquire this lock.

#### release

*   **Method**: `void release()`
*   **Description**: Release this resource lock.

#### close

*   **Method**: `default void close()`
*   **Description**: Close the resource lock.
*   **Implements**: `close` in interface `AutoCloseable`.

#### getResources

*   **Method**: `List<ExclusiveResource> getResources()`
*   **Description**: Returns the exclusive resources this lock represents.
*   **Returns**: The exclusive resources this lock represents.

#### isExclusive

*   **Method**: `boolean isExclusive()`
*   **Description**: Returns whether this lock requires exclusiveness.
*   **Returns**: Whether this lock requires exclusiveness.

#### isCompatible

*   **Method**: `default boolean isCompatible(ResourceLock other)`
*   **Description**: Returns whether the given lock is compatible with this lock.
*   **Parameters**:
    *   `other` (ResourceLock) - The other lock to check for compatibility.
*   **Returns**: Whether the given lock is compatible with this lock.
```

--------------------------------

### Get All Recorded Events - Java

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/EngineExecutionResults

Retrieves all recorded events from the test execution. This method is part of the fluent API provided by EngineExecutionResults.

```java
public Events allEvents()
Get all recorded events.
```

--------------------------------

### Get Configuration Parameters (Java) - org.junit.platform.console.options.TestDiscoveryOptions

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves all configuration parameters for test discovery options. This allows for setting and retrieving various discovery-related configurations.

```Java
org.junit.platform.engine.ConfigurationParameters org.junit.platform.console.options.TestDiscoveryOptions.getConfigurationParameters()
```

--------------------------------

### Method Summary

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/DisplayNameGenerator

Summary of the methods available in the DisplayNameGenerator interface.

```APIDOC
## Method Summary

### `generateDisplayNameForClass(Class<?> testClass)`
- **Modifier and Type**: `String`
- **Description**: Generate a display name for the given top-level or static nested test class.

### `generateDisplayNameForMethod(Class<?> testClass, Method testMethod)`
- **Modifier and Type**: `default String`
- **Deprecated**: in favor of `generateDisplayNameForMethod(List, Class, Method)`
- **Description**: Generate a display name for the given method.

### `generateDisplayNameForMethod(List<Class<?>> enclosingInstanceTypes, Class<?> testClass, Method testMethod)`
- **Modifier and Type**: `default String`
- **Description**: Generate a display name for the given method.

### `generateDisplayNameForNestedClass(Class<?> nestedClass)`
- **Modifier and Type**: `default String`
- **Deprecated**: in favor of `generateDisplayNameForNestedClass(List, Class)`
- **Description**: Generate a display name for the given `@Nested` inner test class.

### `generateDisplayNameForNestedClass(List<Class<?>> enclosingInstanceTypes, Class<?> nestedClass)`
- **Modifier and Type**: `default String`
- **Description**: Generate a display name for the given `@Nested` inner test class.

### `getDisplayNameGenerator(Class<?> generatorClass)`
- **Modifier and Type**: `static DisplayNameGenerator`
- **Description**: Return the `DisplayNameGenerator` instance corresponding to the given `Class`.

### `parameterTypesAsString(Method method)`
- **Modifier and Type**: `static String`
- **Description**: Generate a string representation of the formal parameters of the supplied method, consisting of the simple names of the parameter types, separated by commas, and enclosed in parentheses.
```

--------------------------------

### Get Test Executions as a List

Source: https://docs.junit.org/current/api/index-files/index-12

Retrieves all test executions and returns them as a List. This method is part of the testkit for inspecting execution flow.

```java
list() - Method in class org.junit.platform.testkit.engine.Executions
```

--------------------------------

### Get Configuration Parameters (Java) - org.junit.platform.engine.ExecutionRequest

Source: https://docs.junit.org/current/api/index-files/index-7

Returns the `ConfigurationParameters` that an engine can use to influence test execution. This is provided during the execution request.

```Java
org.junit.platform.engine.ConfigurationParameters org.junit.platform.engine.ExecutionRequest.getConfigurationParameters()
```

--------------------------------

### Get Explicit Selectors - Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestDiscoveryOptions

Retrieves a list of explicit discovery selectors. These selectors directly specify which tests or containers should be discovered.

```java
List<DiscoverySelector> explicitSelectors = discoveryOptions.getExplicitSelectors();
```

--------------------------------

### Get Configuration Parameters (Java) - org.junit.platform.engine.EngineDiscoveryRequest

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the `ConfigurationParameters` for an engine discovery request. This enables engines to access configuration during the discovery phase.

```Java
org.junit.platform.engine.ConfigurationParameters org.junit.platform.engine.EngineDiscoveryRequest.getConfigurationParameters()
```

--------------------------------

### AnnotationBasedArgumentsProvider Methods

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/provider/AnnotationBasedArgumentsProvider

Documentation for the methods available in AnnotationBasedArgumentsProvider.

```APIDOC
## Methods for AnnotationBasedArgumentsProvider

### Method: accept

#### Description

Accepts a single argument for consumption. This method is part of the `Consumer` interface.

#### Method

`POST`

#### Endpoint

`/websites/junit_current/AnnotationBasedArgumentsProvider/accept`

#### Parameters

##### Request Body

- **annotation** (Annotation) - Required - The annotation to be consumed.

#### Request Example

```json
{
  "annotation": "@MyAnnotation"
}
```

#### Response

##### Success Response (200)

- **message** (string) - Operation completed successfully.

##### Response Example

```json
{
  "message": "Annotation accepted."
}
```

### Method: provideArguments (deprecated)

#### Description

Deprecated method to provide a `Stream` of `Arguments` based on metadata in the provided annotation. Use the overload with `ParameterDeclarations` instead.

#### Method

`POST`

#### Endpoint

`/websites/junit_current/AnnotationBasedArgumentsProvider/provideArguments/deprecated`

#### Parameters

##### Request Body

- **context** (ExtensionContext) - Required - The current extension context.
- **annotation** (Annotation) - Required - The annotation to process.

#### Request Example

```json
{
  "context": "someContext",
  "annotation": "@MyAnnotation"
}
```

#### Response

##### Success Response (200)

- **argumentsStream** (Stream<Arguments>) - A stream of arguments.

##### Response Example

```json
{
  "argumentsStream": [
    {"arg1": "value1"}, 
    {"arg2": "value2"}
  ]
}
```

### Method: provideArguments (primary)

#### Description

Provide a `Stream` of `Arguments` to be passed to a `@ParameterizedClass` or `@ParameterizedTest`.

#### Method

`POST`

#### Endpoint

`/websites/junit_current/AnnotationBasedArgumentsProvider/provideArguments`

#### Parameters

##### Request Body

- **parameters** (ParameterDeclarations) - Required - The parameter declarations for the parameterized class or test.
- **context** (ExtensionContext) - Required - The current extension context.

#### Request Example

```json
{
  "parameters": "parameterDeclarations",
  "context": "someContext"
}
```

#### Response

##### Success Response (200)

- **argumentsStream** (Stream<Arguments>) - A stream of arguments.

##### Response Example

```json
{
  "argumentsStream": [
    {"arg1": "value1"}, 
    {"arg2": "value2"}
  ]
}
```

### Method: provideArguments (protected overload)

#### Description

Protected overload to provide a `Stream` of `Arguments`. The returned `Stream` will be properly closed by the default implementation.

#### Method

`POST`

#### Endpoint

`/websites/junit_current/AnnotationBasedArgumentsProvider/provideArguments/protected`

#### Parameters

##### Request Body

- **parameters** (ParameterDeclarations) - Required - The parameter declarations for the parameterized class or test.
- **context** (ExtensionContext) - Required - The current extension context.
- **annotation** (Annotation) - Required - The annotation to process.

#### Request Example

```json
{
  "parameters": "parameterDeclarations",
  "context": "someContext",
  "annotation": "@MyAnnotation"
}
```

#### Response

##### Success Response (200)

- **argumentsStream** (Stream<Arguments>) - A stream of arguments.

##### Response Example

```json
{
  "argumentsStream": [
    {"arg1": "value1"}, 
    {"arg2": "value2"}
  ]
}
```
```

--------------------------------

### testPlanExecutionStarted Method Detail - Java

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/TestExecutionListener

This Java code snippet shows the detailed signature and description for the `testPlanExecutionStarted` method of the `TestExecutionListener` interface. It is invoked before any test execution begins and is called from the same thread as `testPlanExecutionFinished`.

```java
default void testPlanExecutionStarted(TestPlan testPlan)
Called when the execution of the `TestPlan` has started, _before_ any test has been executed. 
Called from the same thread as `testPlanExecutionFinished(TestPlan)`.

Parameters:
    `testPlan` - describes the tree of tests about to be executed
```

--------------------------------

### Get FilePosition from ClassSource (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/descriptor/class-use/FilePosition

Retrieves the FilePosition associated with a ClassSource, if available. This indicates the location of a class definition within its source file.

```java
final Optional<FilePosition> ClassSource.getPosition()
```

--------------------------------

### Get Children from TestDescriptor

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the children of a test descriptor. This can be a stream of dynamic nodes or an immutable set, depending on the implementation.

```java
getChildren() - Method in class org.junit.jupiter.api.DynamicContainer
    
Get the `Stream` of `DynamicNodes` associated with this `DynamicContainer`.
```

```java
getChildren() - Method in class org.junit.platform.engine.support.descriptor.AbstractTestDescriptor
     
```

```java
getChildren() - Method in interface org.junit.platform.engine.TestDescriptor
    
Get the immutable set of _children_ of this descriptor.
```

--------------------------------

### Prefixed Configuration Parameters Class

Source: https://docs.junit.org/current/api/index-files/index-11

A concrete implementation of `ConfigurationParameters` that applies a prefix to all configuration keys. This helps in organizing and namespacing configuration settings, preventing potential conflicts. It inherits the `keySet()` method from its parent.

```java
class org.junit.platform.engine.support.config.PrefixedConfigurationParameters {

    // ... inherited keySet() method
}
```

--------------------------------

### Access ParameterInfo using ExtensionContext in Java

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/support/ParameterInfo

Demonstrates how to retrieve the ParameterInfo instance from the ExtensionContext's store. Extensions can use this to get details about parameterized tests.

```java
Extension extension = new MyExtension();
ExtensionContext context = ...;
ParameterInfo parameterInfo = extension.getStore(NAMESPACE).get(KEY, ParameterInfo.class);
// Alternatively:
ParameterInfo parameterInfo = ParameterInfo.get(context);
```

--------------------------------

### JUnit GenericBeforeAndAfterAdvice Interface Methods

Source: https://docs.junit.org/current/api/org.junit.jupiter.migrationsupport/org/junit/jupiter/migrationsupport/rules/adapter/GenericBeforeAndAfterAdvice

This snippet outlines the methods available in the `GenericBeforeAndAfterAdvice` interface. It includes default implementations for `before`, `after`, and `handleTestExecutionException`, enabling custom logic around test execution. No external dependencies are required.

```java
public interface GenericBeforeAndAfterAdvice {
    default void before() {}

    default void after() {}

    default void handleTestExecutionException(Throwable cause) throws Throwable {}
}
```

--------------------------------

### Get Character Argument from ArgumentsAccessor

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves a character value from the arguments at a specified index. Supports automatic type conversion.

```java
getCharacter(int) - Method in interface org.junit.jupiter.params.aggregator.ArgumentsAccessor
    
Get the value of the argument at the given index as a `Character`, performing automatic type conversion as necessary.
```

```java
getCharacter(int) - Method in class org.junit.jupiter.params.aggregator.DefaultArgumentsAccessor
     
```

--------------------------------

### Get Declarations (Java) - org.junit.jupiter.params.support.ParameterInfo

Source: https://docs.junit.org/current/api/index-files/index-7

Returns the declarations of all indexed parameters. This method is part of the parameter support utilities in JUnit Jupiter.

```Java
java.util.List<java.lang.reflect.AnnotatedElement> org.junit.jupiter.params.support.ParameterInfo.getDeclarations()
```

--------------------------------

### Get Included Packages - Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestDiscoveryOptions

Retrieves a list of package names to include in test discovery. Only classes within these packages will be discovered.

```java
List<String> includedPackages = discoveryOptions.getIncludedPackages();
```

--------------------------------

### Get Byte Argument from ArgumentsAccessor

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves a byte value from the arguments at a specified index. Supports automatic type conversion.

```java
getByte(int) - Method in interface org.junit.jupiter.params.aggregator.ArgumentsAccessor
    
Get the value of the argument at the given index as a `Byte`, performing automatic type conversion as necessary.
```

```java
getByte(int) - Method in class org.junit.jupiter.params.aggregator.DefaultArgumentsAccessor
     
```

--------------------------------

### Create LauncherDiscoveryListeners from Configuration Parameter (Java)

Source: https://docs.junit.org/current/api/index-files/index-6

Static method to create LauncherDiscoveryListeners from a configuration parameter key and value. Used for configuring discovery listeners.

```java
org.junit.platform.launcher.listeners.discovery.LauncherDiscoveryListeners.fromConfigurationParameter(String, String)
```

--------------------------------

### Configure JUnit Reporting for Gradle (Kotlin DSL)

Source: https://docs.junit.org/current/user-guide/index

Enables Open Test Reporting and sets the output directory for Gradle builds using Kotlin DSL. It adds the necessary dependency and configures test tasks to use system properties for reporting.

```kotlin
dependencies {
    testRuntimeOnly("org.junit.platform:junit-platform-reporting:1.13.4")
}
tasks.withType<Test>().configureEach {
    val outputDir = reports.junitXml.outputLocation
    jvmArgumentProviders += CommandLineArgumentProvider {
        listOf(
            "-Djunit.platform.reporting.open.xml.enabled=true",
            "-Djunit.platform.reporting.output.dir=${outputDir.get().asFile.absolutePath}"
        )
    }
}
```

--------------------------------

### Get Test Events as a List

Source: https://docs.junit.org/current/api/index-files/index-12

Retrieves all test events that have occurred during execution and returns them as a List. This is useful for inspecting the sequence of events.

```java
list() - Method in class org.junit.platform.testkit.engine.Events
```

--------------------------------

### Get Launcher from Session - Java

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/class-use/Launcher

Retrieves the `Launcher` instance associated with a `LauncherSession`. This is useful when working within an existing test session context.

```java
Launcher launcher = launcherSession.getLauncher();
```

--------------------------------

### Get Boolean Argument from ArgumentsAccessor

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves a boolean value from the arguments at a specified index. Supports automatic type conversion.

```java
getBoolean(int) - Method in interface org.junit.jupiter.params.aggregator.ArgumentsAccessor
    
Get the value of the argument at the given index as a `Boolean`, performing automatic type conversion as necessary.
```

```java
getBoolean(int) - Method in class org.junit.jupiter.params.aggregator.DefaultArgumentsAccessor
     
```

--------------------------------

### Handle Before/After Execution Context in JUnit Jupiter Descriptors

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/execution/class-use/JupiterEngineExecutionContext

Demonstrates the 'before' and 'after' methods in JUnit Jupiter descriptors that interact with the execution context. These methods are used to set up state before execution and to perform actions after execution, respectively, using the provided context.

```java
final JupiterEngineExecutionContext before(JupiterEngineExecutionContext context)
  {
    // Logic to execute before the main test or block
    return context;
  }
```

```java
void after(JupiterEngineExecutionContext context)
  {
    // Logic to execute after the main test or block
  }
```

--------------------------------

### Execute Tests using Console Launcher Classpath

Source: https://docs.junit.org/current/user-guide/index

Executes tests by invoking the `ConsoleLauncher` class directly via the Java classpath. This method is useful for including the launcher and its dependencies in the classpath, for example, by specifying `classes` and `testlib/*`.

```bash
java -cp classes:testlib/* org.junit.platform.console.ConsoleLauncher <OPTIONS>
```

--------------------------------

### MutableExtensionRegistry Creation with Configuration

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/config/class-use/JupiterConfiguration

Demonstrates the creation of a MutableExtensionRegistry using a JupiterConfiguration. This allows for the registration of default extensions based on the provided configuration.

```java
class MutableExtensionRegistry {
    static MutableExtensionRegistry createRegistryWithDefaultExtensions(JupiterConfiguration configuration) {
        // Factory method implementation
        return null;
    }
}
```

--------------------------------

### Get Excluded Packages - Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestDiscoveryOptions

Retrieves a list of package names that should be excluded from test discovery. All classes within these packages will be excluded.

```java
List<String> excludedPackages = discoveryOptions.getExcludedPackages();
```

--------------------------------

### ExtensionConfigurationException Overview

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/extension/ExtensionConfigurationException

Provides details about the ExtensionConfigurationException, including its purpose, inheritance, and constructors.

```APIDOC
## ExtensionConfigurationException

### Description
Thrown if an error is encountered regarding the configuration of an extension.

### Class Hierarchy
`java.lang.Object` -> `java.lang.Throwable` -> `java.lang.Exception` -> `java.lang.RuntimeException` -> `org.junit.platform.commons.JUnitException` -> `org.junit.jupiter.api.extension.ExtensionConfigurationException`

### Implemented Interfaces
`Serializable`

### Constructors

#### `ExtensionConfigurationException(String message)`
Constructs a new `ExtensionConfigurationException` with the specified detail message.

#### `ExtensionConfigurationException(String message, Throwable cause)`
Constructs a new `ExtensionConfigurationException` with the specified detail message and cause.
```

--------------------------------

### Get Test Method - Java

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/descriptor/MethodBasedTestDescriptor

Retrieves the Java Method associated with this test descriptor. This is a final method and directly accessible.

```java
public final Method getTestMethod()
```

--------------------------------

### AbstractTestDescriptor Constructor Example (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/descriptor/AbstractTestDescriptor

Demonstrates the protected constructors for creating an AbstractTestDescriptor. These constructors require a UniqueId and display name, with an optional TestSource.

```java
protected AbstractTestDescriptor(UniqueId uniqueId, String displayName)
protected AbstractTestDescriptor(UniqueId uniqueId, String displayName, TestSource source)
```

--------------------------------

### ClassTestDescriptor getExecutionMode Method

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/descriptor/ClassTestDescriptor

Gets the preferred execution mode for parallel execution of this node. It overrides the default implementation from JupiterTestDescriptor, which returns Node.ExecutionMode.CONCURRENT.

```java
public Node.ExecutionMode getExecutionMode()
```

--------------------------------

### Open JUnit Launcher Session with Default Configuration

Source: https://docs.junit.org/current/api/org.junit.platform.commons/org/junit/platform/commons/class-use/PreconditionViolationException

Factory method to open a new LauncherSession using the default LauncherConfig. A LauncherSession manages the execution of tests.

```java
static LauncherSession
LauncherFactory.openSession()
```

--------------------------------

### Configuring Logging for JUnit (Gradle)

Source: https://docs.junit.org/current/user-guide/index

Shows how to configure logging for JUnit, including redirecting Java Util Logging (JUL) messages to other frameworks like Log4j 2.x using system properties.

```groovy
test {
    systemProperty("java.util.logging.manager", "org.apache.logging.log4j.jul.LogManager")
    // Avoid overhead (see https://logging.apache.org/log4j/2.x/manual/jmx.html#enabling-jmx)
    systemProperty("log4j2.disableJmx", "true")
}
```

--------------------------------

### Get Succeeded Executions in JUnit Platform

Source: https://docs.junit.org/current/api/index-files/index-19

Retrieves the succeeded `Executions` from an `Executions` object. Useful for analyzing successful test runs.

```java
Executions succeededExecutions = executions.succeeded();
```

--------------------------------

### Get Configuration Parameter - Java

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/MethodOrdererContext

Retrieves a configuration parameter by its key. This method first checks the JUnit Platform's ConfigurationParameters, then JVM system properties, and finally the JUnit Platform properties file if the key is not found. It returns an Optional<String> which may be empty if the key is not found in any of these locations.

```java
Optional<String> getConfigurationParameter(String key)
```

--------------------------------

### Get Value from ExtensionContext Store

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves a stored value from an ExtensionContext.Store using a key. Supports retrieving values of a specific type.

```java
get(Object key)

```

```java
get(Object key, Class<T> type)

```

--------------------------------

### Get Directory - DirectorySelector Class

Source: https://docs.junit.org/current/api/index-files/index-7

Returns the selected directory as a File object. This is used in JUnit Platform for file-based test discovery.

```java
getDirectory() - Method in class org.junit.platform.engine.discovery.DirectorySelector
    
Get the selected directory as a `File`.
```

--------------------------------

### Get Current Operating System

Source: https://docs.junit.org/current/api/index-files/index-3

Retrieves the current operating system information. This is useful for conditional test execution based on the OS environment.

```java
current() - Static method in enum class org.junit.jupiter.api.condition.OS
    
Get the current operating system.
```

--------------------------------

### JUnit Jupiter Lifecycle - LifecycleMethodExecutionExceptionHandler (BeforeAll)

Source: https://docs.junit.org/current/user-guide

Extension code for handling exceptions thrown specifically from @BeforeAll methods. This allows custom error management during test setup.

```java
package org.junit.jupiter.api.extension;

@FunctionalInterface
public interface LifecycleMethodExecutionExceptionHandler {
    void handleBeforeAllMethodExecutionException(ExtensionContext context, Throwable throwable) throws Throwable;
}
```

--------------------------------

### Verify JUnit Jupiter Test Discovery with EngineTestKit

Source: https://docs.junit.org/current/user-guide/index

Demonstrates how to verify that a TestPlan was discovered as expected by the JUnit Jupiter TestEngine. It selects the engine, specifies the test class, discovers the plan, and asserts the engine's display name and absence of discovery issues.

```java
import static java.util.Collections.emptyList;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.platform.engine.discovery.DiscoverySelectors.selectClass;

import example.ExampleTestCase;

import org.junit.jupiter.api.Test;
import org.junit.platform.testkit.engine.EngineDiscoveryResults;
import org.junit.platform.testkit.engine.EngineTestKit;

class EngineTestKitDiscoveryDemo {

    @Test
    void verifyJupiterDiscovery() {
        EngineDiscoveryResults results = EngineTestKit.engine("junit-jupiter") 
                .selectors(selectClass(ExampleTestCase.class)) 
                .discover(); 

        assertEquals("JUnit Jupiter", results.getEngineDescriptor().getDisplayName()); 
        assertEquals(emptyList(), results.getDiscoveryIssues()); 
    }

}
```

--------------------------------

### Configure JUnit Platform via Gradle

Source: https://docs.junit.org/current/user-guide/index

Illustrates how to configure the JUnit Platform in a Gradle build script using system properties. This approach allows defining configuration parameters that are passed to the JVM running the tests, enabling customization of test execution within the Gradle environment. It's particularly useful for managing test-specific settings in a build.

```groovy
test {
    systemProperty 'key1', 'value1'
    systemProperties 'key2': 'value2', 'key3': 'value3'
}
```

--------------------------------

### Getting Execution Result from TerminationInfo

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the TestExecutionResult for a completed execution. This provides information about whether the execution succeeded, failed, or was aborted.

```java
TerminationInfo.getExecutionResult()
```

--------------------------------

### Ant: Launch JUnit Platform Tests with junitlauncher Task

Source: https://docs.junit.org/current/user-guide/index

This Ant task, `junitlauncher`, provides native support for launching tests on the JUnit Platform starting from Ant version 1.10.3. It manages test selection and delegates execution to registered test engines. Later versions (1.10.6+) support forking tests in a separate JVM.

```xml
<taskdef resource="junitlauncher.properties" classpathref="maven-ant-tasks.classpath" />

<junitlauncher haltOnfailure="true" printSummary="true".
  showStandardOutAndErr="true" >
  <classpath refid="project.classpath" />
  <testClassesWith or="true">
    <pathelement location="target/classes" />
  </testClassesWith>
</junitlauncher>
```

--------------------------------

### Get Succeeded Executions - Java

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Executions

Retrieves all succeeded executions from the current Executions object. This method is used to identify tests that passed.

```java
Executions succeeded()
```

--------------------------------

### reportingEntryPublished Method (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/EngineExecutionListener

Callback method to publish additional information to the reporting infrastructure. This can include output that would normally go to `System.out` or details about the test context. This method can be called for any `TestDescriptor` and is part of the `EngineExecutionListener` interface.

```java
default void reportingEntryPublished(TestDescriptor testDescriptor, ReportEntry entry) {
    // Can be called for any TestDescriptor in order to publish additional information to the reporting infrastructure.
}
```

--------------------------------

### Get Configuration Parameters - Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestDiscoveryOptions

Retrieves a map of configuration parameters used during test discovery. These parameters can influence how tests are discovered and run.

```java
public Map<String,String> getConfigurationParameters()
```

--------------------------------

### Get Failed Executions - Java

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Executions

Retrieves all failed executions from the current Executions object. This method is useful for analyzing test failures.

```java
Executions failed()
```

--------------------------------

### JUnit Launcher API: Discover and Execute Tests

Source: https://docs.junit.org/current/user-guide/index

This Java code demonstrates how to use the JUnit Platform Launcher API to discover tests based on package and class selectors, apply class name filters, and build a LauncherDiscoveryRequest. It then uses this request to discover a TestPlan within a LauncherSession. This is useful for integrating test execution into applications or custom runners.

```java
import static org.junit.platform.engine.discovery.ClassNameFilter.includeClassNamePatterns;
import static org.junit.platform.engine.discovery.DiscoverySelectors.selectClass;
import static org.junit.platform.engine.discovery.DiscoverySelectors.selectPackage;

import org.junit.platform.launcher.LauncherDiscoveryRequest;
import org.junit.platform.launcher.LauncherSession;
import org.junit.platform.launcher.TestPlan;
import org.junit.platform.launcher.core.LauncherDiscoveryRequestBuilder;
import org.junit.platform.launcher.core.LauncherFactory;

// Assuming MyTestClass is defined elsewhere
// class MyTestClass {}

LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder.request()
    .selectors(
        selectPackage("com.example.mytests"),
        selectClass(MyTestClass.class)
    )
    .filters(
        includeClassNamePatterns(".*Tests")
    )
    .build();

try (LauncherSession session = LauncherFactory.openSession()) {
    TestPlan testPlan = session.getLauncher().discover(request);

    // ... discover additional test plans or execute tests
}
```

--------------------------------

### Launcher Discovery: Getting TestEngines

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/class-use/TestEngine

Retrieves the collection of `TestEngine` instances involved in a `LauncherDiscoveryResult`. This can be used to inspect which engines participated in the discovery process.

```java
Collection<TestEngine> LauncherDiscoveryResult.getTestEngines()
```

--------------------------------

### JUnit 5: Configure Failure Phase for Discovery Issues

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/LauncherConstants

Configures when `DiscoveryIssueException` should be thrown for critical discovery issues. Supported values are 'discovery' or 'execution'. If not specified, the behavior depends on how `Launcher` is invoked.

```properties
junit.jupiter.extensions.discovery.issue.failure.phase=execution
```

--------------------------------

### JUnit Jupiter Lifecycle - BeforeEach Annotation

Source: https://docs.junit.org/current/user-guide

User code that executes before each individual test method. This annotation is processed by JUnit Jupiter for test setup.

```java
package org.junit.jupiter.api;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface BeforeEach {
}
```

--------------------------------

### Build LauncherDiscoveryRequest with Selectors and Filters - Java

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherDiscoveryRequestBuilder

This code snippet demonstrates how to use the LauncherDiscoveryRequestBuilder to construct a LauncherDiscoveryRequest. It utilizes static imports for discovery selectors, class name filters, engine filters, and tag filters. The builder allows chaining methods to specify packages, classes, methods, classpath roots, unique IDs, engine inclusions/exclusions, tag inclusions/exclusions, and class name patterns. It also shows how to set configuration parameters and finally build the request object.

```java
import static org.junit.platform.engine.discovery.DiscoverySelectors.*;
import static org.junit.platform.engine.discovery.ClassNameFilter.*;
import static org.junit.platform.launcher.EngineFilter.*;
import static org.junit.platform.launcher.TagFilter.*;

import java.util.Collections;
import java.nio.file.Paths;

// ... (assuming relevant classes like ShippingTests, OrderTests, testMethod, configParameterMap are defined)

LauncherDiscoveryRequestBuilder.request()
  .selectors(
     selectPackage("org.example.user"),
     selectClass("org.example.payment.PaymentTests"),
     selectClass(ShippingTests.class),
     selectMethod("org.example.order.OrderTests#test1"),
     selectMethod("org.example.order.OrderTests#test2()"),
     selectMethod("org.example.order.OrderTests#test3(java.lang.String)"),
     selectMethod("org.example.order.OrderTests", "test4"),
     selectMethod(OrderTests.class, "test5"),
     selectMethod(OrderTests.class, testMethod),
     selectClasspathRoots(Collections.singleton(Paths.get("/my/local/path1"))),
     selectUniqueId("unique-id-1"),
     selectUniqueId("unique-id-2")
  )
  .filters(
     includeEngines("junit-jupiter", "spek"),
     // excludeEngines("junit-vintage"),
     includeTags("fast"),
     // excludeTags("slow"),
     includeClassNamePatterns(".*Test[s]?")
     // includeClassNamePatterns("org\.example\.tests.*")
  )
  .configurationParameter("key1", "value1")
  .configurationParameters(configParameterMap)
  .build();
```

--------------------------------

### Get Class Name of MethodSource (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/descriptor/MethodSource

Retrieves the class name associated with this MethodSource. This returns the name of the class where the method is defined or should be found.

```Java
public String getClassName()
```

--------------------------------

### JUnit TestExecutionListener: testPlanExecutionStarted

Source: https://docs.junit.org/current/api/org.junit.platform.reporting/org/junit/platform/reporting/open/xml/OpenTestReportGeneratingListener

Called when the execution of the TestPlan has started, before any test has been executed. This method is part of the TestExecutionListener interface and is called on the same thread as testPlanExecutionFinished.

```java
public void testPlanExecutionStarted(TestPlan testPlan)

```

--------------------------------

### LauncherDiscoveryRequest: Getting PostDiscoveryFilters

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/class-use/PostDiscoveryFilter

Shows how to retrieve a list of PostDiscoveryFilters associated with a LauncherDiscoveryRequest. These filters are applied during test discovery to refine the set of tests to be executed.

```java
List<PostDiscoveryFilter> LauncherDiscoveryRequest.getPostDiscoveryFilters()
```

--------------------------------

### TestExecutionListener Methods

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/listeners/LoggingListener

Methods for handling various stages of test plan execution.

```APIDOC
## TestExecutionListener Methods

### `testPlanExecutionStarted(TestPlan testPlan)`

*   **Description**: Called when the execution of the `TestPlan` has started, before any test has been executed. Called from the same thread as `testPlanExecutionFinished(TestPlan)`.
*   **Method**: `public void testPlanExecutionStarted(TestPlan testPlan)`
*   **Endpoint**: N/A
*   **Parameters**:
    *   `testPlan` (TestPlan) - Required - Describes the tree of tests about to be executed.

### `testPlanExecutionFinished(TestPlan testPlan)`

*   **Description**: Called when the execution of the `TestPlan` has finished, after all tests have been executed. Called from the same thread as `testPlanExecutionStarted(TestPlan)`.
*   **Method**: `public void testPlanExecutionFinished(TestPlan testPlan)`
*   **Endpoint**: N/A
*   **Parameters**:
    *   `testPlan` (TestPlan) - Required - Describes the tree of tests that have been executed.

### `dynamicTestRegistered(TestIdentifier testIdentifier)`

*   **Description**: Called when a new, dynamic `TestIdentifier` has been registered. A dynamic test is a test that is not known a-priori and therefore not contained in the original `TestPlan`.
*   **Method**: `public void dynamicTestRegistered(TestIdentifier testIdentifier)`
*   **Endpoint**: N/A
*   **Parameters**:
    *   `testIdentifier` (TestIdentifier) - Required - The identifier of the newly registered test or container.

### `executionStarted(TestIdentifier testIdentifier)`

*   **Description**: Called when the execution of a leaf or subtree of the `TestPlan` is about to be started. The `TestIdentifier` may represent a test or a container. This method will only be called if the test or container has not been skipped. This method will be called for a container `TestIdentifier` before starting or skipping any of its children.
*   **Method**: `public void executionStarted(TestIdentifier testIdentifier)`
*   **Endpoint**: N/A
*   **Parameters**:
    *   `testIdentifier` (TestIdentifier) - Required - The identifier of the started test or container.

### `executionSkipped(TestIdentifier testIdentifier, String reason)`

*   **Description**: Called when the execution of a leaf or subtree of the `TestPlan` has been skipped. The `TestIdentifier` may represent a test or a container. In the case of a container, no listener methods will be called for any of its descendants. A skipped test or subtree of tests will never be reported as started or finished.
*   **Method**: `public void executionSkipped(TestIdentifier testIdentifier, String reason)`
*   **Endpoint**: N/A
*   **Parameters**:
    *   `testIdentifier` (TestIdentifier) - Required - The identifier of the skipped test or container.
    *   `reason` (String) - Required - A human-readable message describing why the execution has been skipped.

### `executionFinished(TestIdentifier testIdentifier, TestExecutionResult testExecutionResult)`

*   **Description**: Called when the execution of a leaf or subtree of the `TestPlan` has finished, regardless of the outcome. The `TestIdentifier` may represent a test or a container. This method will only be called if the test or container has not been skipped. This method will be called for a container `TestIdentifier` after all of its children have been skipped or have finished.
*   **Method**: `public void executionFinished(TestIdentifier testIdentifier, TestExecutionResult testExecutionResult)`
*   **Endpoint**: N/A
*   **Parameters**:
    *   `testIdentifier` (TestIdentifier) - Required - The identifier of the test or container.
    *   `testExecutionResult` (TestExecutionResult) - Required - The result of the test execution.
```

--------------------------------

### Register LauncherSessionListener as a Service (Plain Text)

Source: https://docs.junit.org/current/user-guide

This plain text file is used to register the custom LauncherSessionListener with the JUnit Platform. By placing this file in the 'META-INF/services' directory on the test classpath, the JUnit Platform can discover and utilize the custom listener for managing launcher sessions. No specific programming language is involved; it's a service configuration.

```text
example.session.GlobalSetupTeardownListener

```

--------------------------------

### Get Selected Unique IDs - Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestDiscoveryOptions

Retrieves a list of unique ID selectors, specifying tests or containers by their unique identifiers.

```java
List<UniqueIdSelector> selectedUniqueIds = discoveryOptions.getSelectedUniqueIds();
```

--------------------------------

### Configure Launcher Discovery Listeners - Java

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherConfig

Adds launcher discovery listeners to the LauncherConfig. This is useful for integrating custom logic that needs to be executed during the discovery phase of tests. No specific output is defined, but it modifies the builder's internal state.

```java
LauncherConfig.Builder addLauncherDiscoveryListeners(LauncherDiscoveryListener... listeners)
```

--------------------------------

### Record Test Execution Started Event

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/class-use/TestDescriptor

Records an `Event` for a container or test that has begun its execution. This is fundamental for monitoring the progress of test runs.

```java
void executionStarted(TestDescriptor testDescriptor)
```

--------------------------------

### Get Included Engines - Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestDiscoveryOptions

Retrieves a list of engine IDs that should be included in test discovery. Only tests executed by these engines will be discovered.

```java
List<String> includedEngines = discoveryOptions.getIncludedEngines();
```

--------------------------------

### JUnit Jupiter TestEngine Constructor

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/JupiterTestEngine

Initializes a new instance of the JupiterTestEngine. This is the default constructor for the engine.

```java
public JupiterTestEngine()

```

--------------------------------

### Execute Tests using Console Launcher JAR

Source: https://docs.junit.org/current/user-guide/index

Launches the JUnit Platform to execute tests using the standalone console launcher JAR. This command can be used to run JUnit Vintage and Jupiter tests and displays results in the console. It requires the `junit-platform-console-standalone-*.jar` to be present.

```bash
java -jar junit-platform-console-standalone-1.13.4.jar execute <OPTIONS>
```

--------------------------------

### Get Default Execution Mode (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/config/CachingJupiterConfiguration

Retrieves the default execution mode for tests. This method is specified by the JupiterConfiguration interface.

```java
public ExecutionMode getDefaultExecutionMode()
```

--------------------------------

### Create Condition for Started Event

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/class-use/Event

Creates a simple `Condition` that matches events only if their type is `EventType.STARTED`. This is useful for verifying the initiation of test execution.

```java
static Condition<Event> started()
Create a new `Condition` that matches if and only if an `Event`'s type is `EventType.STARTED`.
`static Condition<Event>`
EventConditions.`started()`
```

--------------------------------

### LauncherDiscoveryRequestBuilder

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherDiscoveryRequestBuilder

Provides methods to construct and configure a test discovery request.

```APIDOC
## LauncherDiscoveryRequestBuilder API

### Description
This class is used to build a `LauncherDiscoveryRequest`. It allows configuring selectors, filters, and various parameters for test discovery.

### Methods

#### `request()`

*   **Description**: Creates a new `LauncherDiscoveryRequestBuilder`.
*   **Method**: `static`
*   **Endpoint**: N/A (Factory method)
*   **Returns**: A new `LauncherDiscoveryRequestBuilder` instance.

#### `selectors(DiscoverySelector... selectors)`

*   **Description**: Adds the supplied `DiscoverySelector` instances to the request.
*   **Method**: `public`
*   **Endpoint**: N/A
*   **Parameters**:
    *   `selectors` (DiscoverySelector[]) - The discovery selectors to add; never `null`.
*   **Returns**: This builder for method chaining.

#### `selectors(List<? extends DiscoverySelector> selectors)`

*   **Description**: Adds the supplied `DiscoverySelector` instances from a list to the request.
*   **Method**: `public`
*   **Endpoint**: N/A
*   **Parameters**:
    *   `selectors` (List&lt;? extends DiscoverySelector&gt;) - The discovery selectors to add; never `null`.
*   **Returns**: This builder for method chaining.

#### `filters(Filter<?>... filters)`

*   **Description**: Adds the supplied `Filter` instances to the request. Filters are combined using AND semantics.
*   **Warning**: Be cautious when registering multiple competing `include` or `exclude` `EngineFilters` as it may lead to undesirable results.
*   **Method**: `public`
*   **Endpoint**: N/A
*   **Parameters**:
    *   `filters` (Filter&lt;?&gt;[]) - The filters to add; never `null`.
*   **Returns**: This builder for method chaining.

#### `configurationParameter(String key, String value)`

*   **Description**: Adds a configuration parameter to the request.
*   **Method**: `public`
*   **Endpoint**: N/A
*   **Parameters**:
    *   `key` (String) - The configuration parameter key; never `null` or blank.
    *   `value` (String) - The value to store.
*   **Returns**: This builder for method chaining.

#### `configurationParameters(Map<String, String> configurationParameters)`

*   **Description**: Adds all supplied configuration parameters from a map to the request.
*   **Method**: `public`
*   **Endpoint**: N/A
*   **Parameters**:
    *   `configurationParameters` (Map&lt;String, String&gt;) - The map of configuration parameters to add; never `null`.
*   **Returns**: This builder for method chaining.

#### `configurationParametersResources(String... paths)`

*   **Description**: Adds all supplied configuration parameters resource files to the request.
*   **Method**: `public`
*   **Endpoint**: N/A
*   **Parameters**:
    *   `paths` (String[]) - The classpath locations of the properties files; never `null`.
*   **Returns**: This builder for method chaining.

#### `parentConfigurationParameters(ConfigurationParameters parentConfigurationParameters)`

*   **Description**: Sets the parent configuration parameters to use for the request. Explicit configuration parameters take precedence.
*   **Method**: `public`
*   **Endpoint**: N/A
*   **Parameters**:
    *   `parentConfigurationParameters` (ConfigurationParameters) - The parent instance to use for looking up configuration parameters; never `null`.
*   **Returns**: This builder for method chaining.
*   **Since**: 1.8

#### `enableImplicitConfigurationParameters(boolean enabled)`

*   **Description**: Configures whether implicit configuration parameters should be considered. By default, parameters are read from system properties and `junit-platform.properties`. Passing `false` disables these sources.
*   **Method**: `public`
*   **Endpoint**: N/A
*   **Parameters**:
    *   `enabled` (boolean) - `true` if implicit configuration parameters should be considered.
*   **Returns**: This builder for method chaining.
*   **Since**: 1.7

#### `listeners(LauncherDiscoveryListener... listeners)`

*   **Description**: Adds all supplied discovery listeners to the request. A default listener may also be added via the "junit.platform.discovery.listener.default" configuration parameter.
*   **Method**: `public`
*   **Endpoint**: N/A
*   **Parameters**:
    *   `listeners` (LauncherDiscoveryListener[]) - The discovery listeners to add.
*   **Returns**: This builder for method chaining.
*   **Since**: 1.10

### Supported Values

*   `"logging"`
*   `"abortOnFailure"`

*Default Value*: `"abortOnFailure"`
```

--------------------------------

### ExternalResourceSupport: beforeEach Callback Implementation

Source: https://docs.junit.org/current/api/org.junit.jupiter.migrationsupport/org/junit/jupiter/migrationsupport/rules/ExternalResourceSupport

This Java method is part of the `ExternalResourceSupport` class. It is invoked by JUnit 5 before each test method execution. Its purpose is to trigger the 'before' logic of the associated JUnit 4 `ExternalResource` rule, ensuring resources are set up prior to the test running.

```java
public void beforeEach(ExtensionContext context) throws Exception {
    // Logic to find and execute the 'before' method of the ExternalResource
    // This is handled internally by the ExternalResourceSupport class
    System.out.println("ExternalResourceSupport: Executing beforeEach callback.");
}
```

--------------------------------

### Get Configuration Parameter by Key (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/ConfigurationParameters

Retrieves a configuration parameter by its key. It first checks this ConfigurationParameters instance, then JVM system properties, and finally the 'junit-platform.properties' file. Returns an Optional<String> which may be empty.

```java
Optional<String> get(String key)
```

--------------------------------

### Get Current JRE

Source: https://docs.junit.org/current/api/index-files/index-3

Retrieves the current Java Runtime Environment (JRE) version. This is useful for conditional test execution based on the JRE.

```java
currentJre() - Static method in enum class org.junit.jupiter.api.condition.JRE
```

--------------------------------

### Get Line Number

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/discovery/FilePosition

Retrieves the line number from a FilePosition object. This method always returns an integer representing the line number.

```java
public int getLine()
Get the line number of this `FilePosition`.

Returns:
    the line number
```

--------------------------------

### DefaultJupiterConfiguration Constructor

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/config/DefaultJupiterConfiguration

Initializes a new instance of the DefaultJupiterConfiguration class. It requires configuration parameters and an output directory provider. This constructor is essential for setting up the Jupiter test execution environment.

```java
public DefaultJupiterConfiguration(ConfigurationParameters configurationParameters, OutputDirectoryProvider outputDirectoryProvider)
```

--------------------------------

### TestExecutionListener Methods with TestIdentifier

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/class-use/TestIdentifier

Demonstrates the various `TestExecutionListener` methods that accept a `TestIdentifier` parameter. These methods are callbacks for test lifecycle events such as execution start, finish, skip, and reporting.

```java
void
FlightRecordingExecutionListener.executionFinished(TestIdentifier test,  TestExecutionResult result)
```

```java
void
FlightRecordingExecutionListener.executionSkipped(TestIdentifier test,  String reason)
```

```java
void
FlightRecordingExecutionListener.executionStarted(TestIdentifier test)
```

```java
void
FlightRecordingExecutionListener.fileEntryPublished(TestIdentifier testIdentifier,  FileEntry file)
```

```java
void
FlightRecordingExecutionListener.reportingEntryPublished(TestIdentifier test,  ReportEntry reportEntry)
```

```java
default void
TestExecutionListener.dynamicTestRegistered(TestIdentifier testIdentifier)
```

```java
default void
TestExecutionListener.executionFinished(TestIdentifier testIdentifier,  TestExecutionResult testExecutionResult)
```

```java
default void
TestExecutionListener.executionSkipped(TestIdentifier testIdentifier,  String reason)
```

```java
default void
TestExecutionListener.executionStarted(TestIdentifier testIdentifier)
```

```java
default void
TestExecutionListener.fileEntryPublished(TestIdentifier testIdentifier,  FileEntry file)
```

```java
default void
TestExecutionListener.reportingEntryPublished(TestIdentifier testIdentifier,  ReportEntry entry)
```

--------------------------------

### GET /configuration/parameters/boolean

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/config/PrefixedConfigurationParameters

Retrieves a boolean configuration parameter by its key. It follows the same lookup order as the string retrieval: ConfigurationParameters, JVM system properties, and JUnit Platform properties file.

```APIDOC
## GET /configuration/parameters/boolean

### Description
Get the boolean configuration parameter stored under the specified `key`. If no such key is present, an attempt will be made to look up the value as a JVM system property. If no such system property exists, an attempt will be made to look up the value in the JUnit Platform properties file.

### Method
GET

### Endpoint
`/configuration/parameters/boolean`

### Parameters
#### Path Parameters
None

#### Query Parameters
- **key** (string) - Required - The key to look up; never null or blank

#### Request Body
None

### Request Example
```json
{
  "key": "example.boolean.key"
}
```

### Response
#### Success Response (200)
- **value** (Optional<Boolean>) - An Optional containing the boolean value; never null but potentially empty.

#### Response Example
```json
{
  "value": true
}
```
```

--------------------------------

### Get Parameter Name of ParameterDeclaration

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/support/ParameterDeclaration

Retrieves the name of the parameter, if it is available. The returned Optional may be empty, but the Optional itself will never be null.

```java
Optional<String> getParameterName()
```

--------------------------------

### Extension Registry API

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/extension/ExtensionRegistry

This section details the methods available for interacting with the ExtensionRegistry.

```APIDOC
## ExtensionRegistry API

### Description
An `ExtensionRegistry` holds all registered extensions (i.e. instances of `Extension`) for a given `Node`.

### Methods

#### getExtensions

##### Description
Get all `Extensions` of the specified type that are present in this registry or one of its ancestors.

##### Method
`default <E extends Extension> List<E>`

##### Endpoint
N/A (This is a method within an interface)

##### Parameters

###### Path Parameters
None

###### Query Parameters
None

###### Request Body
None

##### Request Example
None

##### Response

###### Success Response (200)
- **extensions** (List<E>) - A list of extensions of the specified type.

###### Response Example
```json
{
  "extensions": [
    // List of extension objects
  ]
}
```

#### stream

##### Description
Stream all `Extensions` of the specified type that are present in this registry or one of its ancestors.

##### Method
`<E extends Extension> Stream<E>`

##### Endpoint
N/A (This is a method within an interface)

##### Parameters

###### Path Parameters
None

###### Query Parameters
None

###### Request Body
None

##### Request Example
None

##### Response

###### Success Response (200)
- **stream** (Stream<E>) - A stream of extensions of the specified type.

###### Response Example
```json
{
  "stream": [
    // Stream of extension objects
  ]
}
```
```

--------------------------------

### Get Parameter Type of ParameterDeclaration

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/support/ParameterDeclaration

Returns the type of the parameter. This method is part of the ParameterDeclaration interface and guarantees a non-null return value.

```java
Class<?> getParameterType()
```

--------------------------------

### Set Configuration Parameters Resource

Source: https://docs.junit.org/current/api/org.junit.platform.suite.commons/org/junit/platform/suite/commons/SuiteLauncherDiscoveryRequestBuilder

Specifies a resource file for configuration parameters. This method is used to load configuration from an external resource.

```java
public SuiteLauncherDiscoveryRequestBuilder configurationParametersResource(String resourceFile)

```

--------------------------------

### Get Enum Constants - Java

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/discovery/predicates/class-use/TestClassPredicates

Retrieves all constants of the TestClassPredicates.NestedClassInvalidityReason enum. This is useful for iteration or inspection of all possible reasons for nested class invalidity.

```java
TestClassPredicates.NestedClassInvalidityReason[] reasons = TestClassPredicates.NestedClassInvalidityReason.values();
```

--------------------------------

### Java Example: Inheriting @BeforeParameterizedClassInvocation

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/BeforeParameterizedClassInvocation

Illustrates the inheritance of @BeforeParameterizedClassInvocation methods in Java. Superclass methods are executed before subclass methods, provided they are not overridden.

```java
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.api.BeforeAll;

class BaseTest {
    @BeforeAll
    static void beforeBaseClass() {
        System.out.println("Base class @BeforeAll");
    }
}

class DerivedTest extends BaseTest {
    @BeforeAll
    static void beforeDerivedClass() {
        System.out.println("Derived class @BeforeAll");
    }

    @ParameterizedTest
    @ValueSource(ints = {1, 2, 3})
    void testWithParams(int i) {
        System.out.println("Test method: " + i);
    }
}
```

--------------------------------

### Open JUnit Launcher Session with Custom Configuration

Source: https://docs.junit.org/current/api/org.junit.platform.commons/org/junit/platform/commons/class-use/PreconditionViolationException

Factory method to open a new LauncherSession using a supplied LauncherConfig. This enables custom session configurations for test execution.

```java
static LauncherSession
LauncherFactory.openSession(LauncherConfig config)
```

--------------------------------

### Java @BeforeSuite Meta-Annotation Example

Source: https://docs.junit.org/current/api/org.junit.platform.suite.api/org/junit/platform/suite/api/BeforeSuite

This snippet shows how @BeforeSuite can be used as a meta-annotation to create a custom composed annotation in Java. This allows for the inheritance of @BeforeSuite's semantics into a new annotation.

```java
@Target(METHOD)
@Retention(RUNTIME)
@Documented
@BeforeSuite
public @interface SetupSuite {
    // Custom annotation inheriting @BeforeSuite semantics
}
```

--------------------------------

### Getting Excluded Class Name Patterns

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the patterns for class names that should be excluded from test discovery. This is configured via TestDiscoveryOptions.

```java
TestDiscoveryOptions.getExcludedClassNamePatterns()
```

--------------------------------

### Configuration Implementations

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/config/class-use/JupiterConfiguration

Details the classes that implement the JupiterConfiguration API within the org.junit.jupiter.engine.config package.

```APIDOC
## Classes implementing JupiterConfiguration

### Description
Classes in `org.junit.jupiter.engine.config` that implement `JupiterConfiguration`.

### Class
- **CachingJupiterConfiguration** (class) - Caching implementation of the `JupiterConfiguration` API.
- **DefaultJupiterConfiguration** (class) - Default implementation of the `JupiterConfiguration` API.
```

--------------------------------

### JUnit Platform @Suite Annotation Example

Source: https://docs.junit.org/current/api/org.junit.platform.commons/org/junit/platform/commons/annotation/class-use/Testable

Shows how to use the @Suite annotation from JUnit Platform to mark a class as a test suite. This allows for grouping multiple test classes or configurations into a single execution unit.

```java
import org.junit.platform.suite.api.SelectClasses;
import org.junit.platform.suite.api.Suite;

@Suite
@SelectClasses({ MyTest.class, AnotherTest.class })
public class MyTestSuite {
    // This class serves as a container for the tests specified in @SelectClasses
}
```

--------------------------------

### Create ClasspathRootSelectors

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/discovery/DiscoverySelectors

This method creates a list of ClasspathRootSelector objects for supplied classpath roots. It converts paths to URIs, requiring the FileSystem to be the default or created by an installed FileSystemProvider. The resulting selectors represent roots on the context class loader's classpath.

```java
public static List<ClasspathRootSelector> selectClasspathRoots(Set<Path> classpathRoots)
// Creates a list of ClasspathRootSelectors for the supplied classpath roots (directories or JAR files).
// Since the supplied paths are converted to URIs, the FileSystem that created them must be the default or one that has been created by an installed FileSystemProvider.
// Parameters: classpathRoots - set of directories and JAR files in the filesystem that represent classpath roots; never null
// Returns: a list of selectors for the supplied classpath roots; elements which do not physically exist in the filesystem will be filtered out
```

--------------------------------

### LauncherDiscoveryListener NOOP Implementation

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/LauncherDiscoveryListener

This snippet defines the NOOP (No-Operation) static final instance of LauncherDiscoveryListener. This is a no-op implementation useful when an instance is required but no action needs to be taken.

```java
/**
 * No-op implementation of `LauncherDiscoveryListener`
 */
static final LauncherDiscoveryListener NOOP = new LauncherDiscoveryListener() {};
```

--------------------------------

### Provide Primitive Integer Arguments with Local Factory Method (Java)

Source: https://docs.junit.org/current/user-guide/index

Illustrates using a local static factory method named 'range' to provide a 'IntStream' of integers for a parameterized test. This example demonstrates support for primitive streams.

```java
@ParameterizedTest
@MethodSource("range")
void testWithRangeMethodSource(int argument) {
    assertNotEquals(9, argument);
}

static IntStream range() {
    return IntStream.range(0, 20).skip(10);
}
```

--------------------------------

### Database Test Demo with Extensions (Java)

Source: https://docs.junit.org/current/user-guide/index

A concrete demonstration of extending AbstractDatabaseTests. This class, DatabaseTestsDemo, includes custom @BeforeAll, @BeforeEach, @Test, @AfterEach, and @AfterAll methods, along with JUnit extensions (Extension1, Extension2). It illustrates a correctly ordered execution of lifecycle methods for database operations and test data management.

```java
import static example.callbacks.Logger.afterEachMethod;
import static example.callbacks.Logger.beforeAllMethod;
import static example.callbacks.Logger.beforeEachMethod;
import static example.callbacks.Logger.testMethod;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

/**
 * Extension of {@link AbstractDatabaseTests} that inserts test data
 * into the database (after the database connection has been opened)
 * and deletes test data (before the database connection is closed).
 */
@ExtendWith({ Extension1.class, Extension2.class })
class DatabaseTestsDemo extends AbstractDatabaseTests {

    @BeforeAll
    static void beforeAll() {
        beforeAllMethod(DatabaseTestsDemo.class.getSimpleName() + ".beforeAll()");
    }

    @BeforeEach
    void insertTestDataIntoDatabase() {
        beforeEachMethod(getClass().getSimpleName() + ".insertTestDataIntoDatabase()");
    }

    @Test
    void testDatabaseFunctionality() {
        testMethod(getClass().getSimpleName() + ".testDatabaseFunctionality()");
    }

    @AfterEach
    void deleteTestDataFromDatabase() {
        afterEachMethod(getClass().getSimpleName() + ".deleteTestDataFromDatabase()");
    }

    @AfterAll
    static void afterAll() {
        beforeAllMethod(DatabaseTestsDemo.class.getSimpleName() + ".afterAll()");
    }

}
```

--------------------------------

### Get Configuration Resources - Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestDiscoveryOptions

Retrieves a list of resources used for test discovery configuration. These resources might include properties files or other configuration sources.

```java
public List<String> getConfigurationParametersResources()
```

--------------------------------

### Create Composite LauncherDiscoveryListener (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/listeners/discovery/LauncherDiscoveryListeners

Creates a composite LauncherDiscoveryListener that combines multiple listeners into a single one. This allows for applying several discovery listening strategies simultaneously.

```java
List<LauncherDiscoveryListener> listeners = Arrays.asList(LauncherDiscoveryListeners.logging(), LauncherDiscoveryListeners.abortOnFailure());
LauncherDiscoveryListener compositeListener = LauncherDiscoveryListeners.composite(listeners);
```

--------------------------------

### Get Current Repetition (Java) - org.junit.jupiter.api.RepetitionInfo

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the current repetition number for a repeated test method. This is part of the `RepetitionInfo` interface.

```Java
int org.junit.jupiter.api.RepetitionInfo.getCurrentRepetition()
```

--------------------------------

### Get File Column Number (Java) - org.junit.platform.engine.support.descriptor.FilePosition

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the column number of a file position, if available. This is used in descriptor support.

```Java
java.util.Optional<java.lang.Integer> org.junit.platform.engine.support.descriptor.FilePosition.getColumn()
```

--------------------------------

### Configuring JUnit Jupiter Test Engine (Gradle)

Source: https://docs.junit.org/current/user-guide/index

Shows how to configure support for JUnit Jupiter based tests in Gradle. This involves adding the JUnit Jupiter dependency or using Gradle's JVM Test Suite support with Kotlin or Groovy DSL.

```groovy
dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter:5.13.4")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}
```

```kotlin
testing {
    suites {
        named<JvmTestSuite>("test") {
            useJUnitJupiter("5.13.4")
        }
    }
}
```

```groovy
testing {
    suites {
        test {
            useJUnitJupiter("5.13.4")
        }
    }
}
```

--------------------------------

### Get File Column Number (Java) - org.junit.platform.engine.discovery.FilePosition

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the column number of a file position, if available. This is used in the discovery process.

```Java
java.util.Optional<java.lang.Integer> org.junit.platform.engine.discovery.FilePosition.getColumn()
```

--------------------------------

### Add Launcher Discovery Listener

Source: https://docs.junit.org/current/api/org.junit.platform.suite.commons/org/junit/platform/suite/commons/class-use/SuiteLauncherDiscoveryRequestBuilder

This snippet illustrates how to add a `LauncherDiscoveryListener` to the builder. Listeners can be used to observe and react to events during the test discovery process.

```java
LauncherDiscoveryListener listener = new MyDiscoveryListener();
builder.listener(listener);
```

--------------------------------

### Provide Test Instances (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/extension/class-use/TestInstances

Provides TestInstances based on the current execution context or extension registry. These methods are part of the TestInstancesProvider interface within the JUnit Jupiter engine execution package, responsible for supplying test instances during test execution.

```java
TestInstancesProvider.getTestInstances(JupiterEngineExecutionContext context)
```

```java
TestInstancesProvider.getTestInstances(ExtensionRegistry extensionRegistry, JupiterEngineExecutionContext executionContext)
```

--------------------------------

### Get Parameter Declarations using ParameterInfo in Java

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/support/ParameterInfo

Illustrates how to retrieve the declarations of all indexed parameters for a parameterized test using ParameterInfo. This can provide metadata about the parameters.

```java
ParameterInfo parameterInfo = ...;
ParameterDeclarations declarations = parameterInfo.getDeclarations();
// Use declarations to inspect parameter metadata.
```

--------------------------------

### Implement Class Template with Custom Context Provider in Java

Source: https://docs.junit.org/current/user-guide

Demonstrates how to create a JUnit 5 class template that is executed multiple times with different contexts provided by a custom `ClassTemplateInvocationContextProvider`. The example injects a fruit name into a test instance field.

```java
@ClassTemplate
@ExtendWith(ClassTemplateDemo.MyClassTemplateInvocationContextProvider.class)
class ClassTemplateDemo {

    static final List<String> WELL_KNOWN_FRUITS
        = unmodifiableList(Arrays.asList("apple", "banana", "lemon"));

    private String fruit;

    @Test
    void notNull() {
        assertNotNull(fruit);
    }

    @Test
    void wellKnown() {
        assertTrue(WELL_KNOWN_FRUITS.contains(fruit));
    }

    public class MyClassTemplateInvocationContextProvider
            implements ClassTemplateInvocationContextProvider {

        @Override
        public boolean supportsClassTemplate(ExtensionContext context) {
            return true;
        }

        @Override
        public Stream<ClassTemplateInvocationContext>
                provideClassTemplateInvocationContexts(ExtensionContext context) {

            return Stream.of(invocationContext("apple"), invocationContext("banana"));
        }

        private ClassTemplateInvocationContext invocationContext(String parameter) {
            return new ClassTemplateInvocationContext() {
                @Override
                public String getDisplayName(int invocationIndex) {
                    return parameter;
                }

                @Override
                public List<Extension> getAdditionalExtensions() {
                    return singletonList(new TestInstancePostProcessor() {
                        @Override
                        public void postProcessTestInstance(
                                Object testInstance, ExtensionContext context) {
                            ((ClassTemplateDemo) testInstance).fruit = parameter;
                        }
                    });
                }
            };
        }
    }
}
```

--------------------------------

### Build Launcher Discovery Request - Java

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherDiscoveryRequestBuilder

Constructs and returns a `LauncherDiscoveryRequest` object based on the configurations applied to the builder. This is the final step in creating the request object.

```java
public LauncherDiscoveryRequest build()
```

--------------------------------

### Get resolution status from SelectorResolver.Resolution

Source: https://docs.junit.org/current/api/index-files/index-9

Checks if this resolution contains matches or selectors. This method is part of the Resolution inner class within SelectorResolver.

```java
isResolved() - Method in class org.junit.platform.engine.support.discovery.SelectorResolver.Resolution
    
    Whether this resolution contains matches or selectors.
```

--------------------------------

### Custom Test Engine: SecondCustomEngine Sharing ServerSocket

Source: https://docs.junit.org/current/user-guide/index

This Java code defines a second custom test engine (`SecondCustomEngine`) that mirrors the functionality of `FirstCustomEngine`. It also uses `NamespacedHierarchicalStore` to access the shared `ServerSocket`, demonstrating that regardless of execution order, the same `ServerSocket` instance is used.

```java
/**
 * Second custom test engine implementation.
 */
public class SecondCustomEngine implements TestEngine {

    public ServerSocket socket;

    @Override
    public String getId() {
        return "second-custom-test-engine";
    }

    @Override
    public TestDescriptor discover(EngineDiscoveryRequest discoveryRequest, UniqueId uniqueId) {
        return new EngineDescriptor(uniqueId, "Second Custom Test Engine");
    }

    @Override
    public void execute(ExecutionRequest request) {
        request.getEngineExecutionListener()
                .executionStarted(request.getRootTestDescriptor());

        NamespacedHierarchicalStore<Namespace> store = request.getStore();
        socket = store.getOrComputeIfAbsent(Namespace.GLOBAL, "serverSocket", key -> {
            try {
                return new ServerSocket(0, 50, getLoopbackAddress());
            }
            catch (IOException e) {
                throw new UncheckedIOException("Failed to start ServerSocket", e);
            }
        }, ServerSocket.class);

        request.getEngineExecutionListener()
                .executionFinished(request.getRootTestDescriptor(), successful());
    }
}
```

--------------------------------

### Get OutputDirectoryProvider in JUnit Jupiter Configuration

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/reporting/class-use/OutputDirectoryProvider

Demonstrates retrieving an OutputDirectoryProvider instance from configuration classes within the JUnit Jupiter engine. These methods are essential for obtaining the provider used for output operations.

```java
/**
 * Gets the OutputDirectoryProvider for this configuration.
 * @return the OutputDirectoryProvider
 */
public OutputDirectoryProvider getOutputDirectoryProvider();
```

--------------------------------

### Constructor: PrefixedConfigurationParameters

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/config/PrefixedConfigurationParameters

Creates a new view of the supplied ConfigurationParameters that applies a supplied prefix to all queries.

```APIDOC
## Constructor: PrefixedConfigurationParameters

### Description
Creates a new view of the supplied `ConfigurationParameters` that applies the supplied prefix to all queries.

### Method
Constructor

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "delegate": "ConfigurationParameters object",
  "prefix": "string"
}
```

### Response
#### Success Response (200)
None (Constructor)

#### Response Example
None
```

--------------------------------

### Implementing Test Instance Post-processing in JUnit 5

Source: https://docs.junit.org/current/user-guide

The `TestInstancePostProcessor` interface allows extensions to modify test instances after they are created. This is useful for dependency injection, calling custom initialization methods, or performing other setup tasks before tests begin. Extensions implementing this interface can hook into the test instance lifecycle to enhance or configure the created instances.

```java
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.TestInstancePostProcessor;
import org.junit.jupiter.api.extension.ExtensionInstantiationException;

public class MyTestInstancePostProcessor implements TestInstancePostProcessor {

    @Override
    public void postProcessTestInstance(Object testInstance, ExtensionContext context) throws ExtensionInstantiationException {
        // Custom logic to post-process the test instance
        // Example: injectDependencies(testInstance);
        // Example: callCustomInitMethod(testInstance);
        System.out.println("Post-processing instance: " + testInstance.getClass().getName());
    }
}
```

--------------------------------

### Getting Execution Results from ExecutionRecorder

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the recorded state of an engine's execution in the form of EngineExecutionResults. This is useful for testing engine implementations.

```java
ExecutionRecorder.getExecutionResults()
```

--------------------------------

### Extension Store Management (JUnit)

Source: https://docs.junit.org/current/api/index-files/index-7

Methods for managing extensions within a store. These allow fetching existing extensions or computing and storing new ones, keyed by type or a specific key. These are part of the org.junit.jupiter.api.extension.ExtensionContext.Store interface and related classes.

```java
V getOrComputeIfAbsent(Class<V> type);
V getOrComputeIfAbsent(K key, Function<K, V> function);
V getOrComputeIfAbsent(K key, Function<K, V> function, Class<V> type);
V getOrDefault(Object key, Class<V> type, V defaultValue);
```

--------------------------------

### Get Succeeded Events in JUnit Platform

Source: https://docs.junit.org/current/api/index-files/index-19

Retrieves the succeeded `Events` from an `Events` object. This is a common operation for inspecting test execution outcomes.

```java
Events succeededEvents = events.succeeded();
```

--------------------------------

### Get All Configuration Parameter Keys (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/ConfigurationParameters

Returns a Set containing all keys for the configuration parameters stored directly in this ConfigurationParameters instance. This method is preferred over the deprecated size() method.

```java
Set<String> keySet()
```

--------------------------------

### EngineDiscoveryOrchestrator Constructor

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/EngineDiscoveryOrchestrator

Initializes the EngineDiscoveryOrchestrator with test engines and post-discovery filters.

```APIDOC
## EngineDiscoveryOrchestrator Constructor

### Description
Initializes the EngineDiscoveryOrchestrator with a collection of `TestEngine` instances and a collection of `PostDiscoveryFilter` objects.

### Method
CONSTRUCTOR

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "example": "// Constructor does not take a request body."
}
```

### Response
#### Success Response (200)
N/A (Constructor)

#### Response Example
```json
{
  "example": "// Constructor does not return a value."
}
```
```

--------------------------------

### Launcher: Getting Additional TestEngines

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/class-use/TestEngine

Retrieves a collection of additional `TestEngine` instances that should be incorporated into the `Launcher` configuration. This is useful for integrating custom or third-party test engines.

```java
Collection<TestEngine> LauncherConfig.getAdditionalTestEngines()
```

--------------------------------

### LoggingListener Factory Methods

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/listeners/class-use/LoggingListener

Provides methods for creating instances of LoggingListener with different logging configurations.

```APIDOC
## LoggingListener Factory Methods

### Description
Methods for creating `LoggingListener` instances with custom logging behavior or using Java Util Logging.

### Method
`static LoggingListener`

### Endpoint
N/A (Factory Methods)

### Parameters

#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "example": "No request body for factory methods"
}
```

### Response
#### Success Response (200)
- **LoggingListener** (object) - An instance of LoggingListener configured as specified.

#### Response Example
```json
{
  "example": "LoggingListener instance"
}
```

## LoggingListener.forBiConsumer(BiConsumer<Throwable,Supplier<String>> logger)

### Description
Creates a `LoggingListener` which delegates to the supplied `BiConsumer` for consumption of logging messages.

### Method
`static LoggingListener`

### Endpoint
N/A (Factory Method)

### Parameters

#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **logger** (BiConsumer<Throwable,Supplier<String>>) - The BiConsumer to handle log messages.

### Request Example
```json
{
  "example": "// Example usage with a lambda expression for BiConsumer"
}
```

### Response
#### Success Response (200)
- **LoggingListener** (object) - A new LoggingListener instance.

#### Response Example
```json
{
  "example": "LoggingListener instance"
}
```

## LoggingListener.forJavaUtilLogging()

### Description
Creates a `LoggingListener` which delegates to a `Logger` using a log level of `FINE`.

### Method
`static LoggingListener`

### Endpoint
N/A (Factory Method)

### Parameters
None

### Request Example
```json
{
  "example": "No request body needed"
}
```

### Response
#### Success Response (200)
- **LoggingListener** (object) - A new LoggingListener instance configured for Java Util Logging at FINE level.

#### Response Example
```json
{
  "example": "LoggingListener instance"
}
```

## LoggingListener.forJavaUtilLogging(Level logLevel)

### Description
Creates a `LoggingListener` which delegates to a `Logger` using the supplied log level.

### Method
`static LoggingListener`

### Endpoint
N/A (Factory Method)

### Parameters

#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **logLevel** (Level) - The desired log level for Java Util Logging.

### Request Example
```json
{
  "example": "// Example usage with Level.INFO"
}
```

### Response
#### Success Response (200)
- **LoggingListener** (object) - A new LoggingListener instance configured for Java Util Logging at the specified level.

#### Response Example
```json
{
  "example": "LoggingListener instance"
}
```
```

--------------------------------

### Execute with Store - JUnit Platform Launcher Core

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/store/class-use/Namespace

Executes tests based on discovery results, notifying listeners of execution events, and utilizing a NamespacedHierarchicalStore for request-level data. This method is part of the 'EngineExecutionOrchestrator' in 'org.junit.platform.launcher.core'.

```java
void
EngineExecutionOrchestrator.execute(LauncherDiscoveryResult discoveryResult, EngineExecutionListener engineExecutionListener, NamespacedHierarchicalStore<Namespace> requestLevelStore)
Executes tests for the supplied discovery results and notifies the supplied listener of execution events.
```

```java
void
EngineExecutionOrchestrator.execute(LauncherDiscoveryResult discoveryResult, EngineExecutionListener engineExecutionListener, TestExecutionListener testExecutionListener, NamespacedHierarchicalStore<Namespace> requestLevelStore)
Executes tests for the supplied discoveryResult and notifies the supplied engineExecutionListener and testExecutionListener of execution events.
```

--------------------------------

### JUnit Platform Console Launcher

Source: https://docs.junit.org/current/api/index-files/index-3

The main class for launching the JUnit Platform from the command line. It provides a standalone application for executing tests via the console.

```java
public class ConsoleLauncher
public ConsoleLauncher()
```

--------------------------------

### JUnit 4 Suite Configuration with JUnit Platform Runner

Source: https://docs.junit.org/current/api/org.junit.platform.suite.api/org/junit/platform/suite/api/package-summary

Configure JUnit 4 test suites to run on the JUnit Platform using the `junit-platform-runner`. This requires the `junit-platform-runner` dependency.

```java
import org.junit.runner.RunWith;
import org.junit.platform.runner.JUnitPlatform;

@RunWith(JUnitPlatform.class)
public class MySuiteTest {}
```

--------------------------------

### Accept Visitor on TestDescriptor Subtree

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/TestDescriptor

Accepts a TestDescriptor.Visitor to traverse the subtree starting from this descriptor. This is useful for operations like collecting all tests or performing analysis on the hierarchy.

```java
testDescriptor.accept(visitor);
```

--------------------------------

### Applying Filters in SuiteLauncherDiscoveryRequestBuilder

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/class-use/Filter

Demonstrates adding filters to a `SuiteLauncherDiscoveryRequestBuilder`. This is utilized in the context of launching test suites, allowing for fine-grained control over which tests are included in the suite execution.

```java
SuiteLauncherDiscoveryRequestBuilder filters(Filter<?>... filters)
Add all supplied `filters` to the request.
```

--------------------------------

### Getting Execution Exception from ExtensionContext

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves any exception that occurred during the execution of a test or container associated with the ExtensionContext. Returns null if no exception was thrown.

```java
ExtensionContext.getExecutionException()
```

--------------------------------

### Get Optional Payload

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Event

Retrieves the payload as an Optional. The payload type is expected and cannot be null. The returned Optional may be empty but will never be null.

```java
public Optional<Object> getPayload()
// Returns: an Optional containing the payload; never null but potentially empty
```

--------------------------------

### Add Launcher Discovery Listeners to Configuration (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherConfig

Adds all supplied launcher discovery listeners to the configuration. This method accepts multiple LauncherDiscoveryListener objects and adds them to the configuration. It guarantees that the input array and its elements are not null. Returns the builder for chaining.

```Java
public LauncherConfig.Builder addLauncherDiscoveryListeners(LauncherDiscoveryListener... listeners)
Add all of the supplied launcher discovery listeners to the configuration. 

Parameters:
    `listeners` - additional launcher discovery listeners to register; never `null` or containing `null` 

Returns:
    this builder for method chaining
```

--------------------------------

### Configure and Execute with Custom Test Engines (Java)

Source: https://docs.junit.org/current/user-guide

This snippet demonstrates configuring the JUnit Platform Launcher to use custom test engines and execute tests. It highlights enabling/disabling auto-registration and verifying engine socket states.

```java
Launcher launcher = LauncherFactory.create();

launcher.getRegistration().register(new TestEngineFactory() {
    @Override
    public TestEngine createTestEngine() {
        return firstCustomEngine;
    }
});
launcher.getRegistration().register(new TestEngineFactory() {
    @Override
    public TestEngine createTestEngine() {
        return secondCustomEngine;
    }
});

LauncherConfig config = LauncherConfig.builder()
        .addTestEngines(firstCustomEngine, secondCustomEngine)
        .enableTestEngineAutoRegistration(false)
        .build();

launcher.execute(request().build());

assertSame(firstCustomEngine.socket, secondCustomEngine.socket);
assertTrue(firstCustomEngine.socket.isClosed(), "socket should be closed");
```

--------------------------------

### Get Group ID (Java)

Source: https://docs.junit.org/current/api/org.junit.vintage.engine/org/junit/vintage/engine/VintageTestEngine

Returns the group ID associated with the JUnit Vintage engine. This is typically 'org.junit.vintage'. The return value is an Optional and may be empty.

```java
public Optional<String> getGroupId()
// Returns: an Optional containing the group ID; never null but potentially empty if the group ID is unknown
```

--------------------------------

### Getting Execution Condition Filter from JupiterConfiguration

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the execution condition filter from a JupiterConfiguration. This filter determines whether a test or container should be executed.

```java
JupiterConfiguration.getExecutionConditionFilter()
```

--------------------------------

### Get Aborted Executions - Java

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Executions

Retrieves all aborted executions from the current Executions object. This method is part of the facade for accessing execution states.

```java
Executions aborted()
```

--------------------------------

### Add Multiple Configuration Parameters (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/class-use/LauncherDiscoveryRequestBuilder

Shows how to add multiple configuration parameters at once using a Map. This is useful for applying a set of configurations.

```java
LauncherDiscoveryRequestBuilder configurationParameters(Map<String, String> configurationParameters){
    return this.configurationParameters(configurationParameters);
}
```

--------------------------------

### Get Event Type - Java

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/class-use/EventType

Retrieves the type of a given event. This method is part of the Event class within the org.junit.platform.testkit.engine package.

```java
Event.getType()
```

--------------------------------

### Get Discovery Listener - LauncherDiscoveryRequest Interface

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the LauncherDiscoveryListener for the launcher discovery request. This listener is used to receive notifications about the test discovery process.

```java
getDiscoveryListener() - Method in interface org.junit.platform.launcher.LauncherDiscoveryRequest
    
Get the `LauncherDiscoveryListener` for this request.
```

--------------------------------

### Get ExtensionContext Store - JUnit Jupiter API

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the `ExtensionContext.Store` associated with a given `ExtensionContext.Namespace`. This store is used for sharing data between extensions within the same namespace.

```java
ExtensionContext.Store store = extensionContext.getStore(ExtensionContext.Namespace.GLOBAL);
// or
ExtensionContext.Store store = extensionContext.getStore(ExtensionContext.Namespace.LOCAL);
```

--------------------------------

### Get Associated Tags (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/TestIdentifier

Returns a `Set` of `TestTag` objects associated with the represented test or container. Tags can be used for categorizing or filtering tests.

```java
public Set<TestTag> getTags()
Get the set of tags associated with the represented test or container.

See Also:
    
      * `TestTag`
```

--------------------------------

### Get Additional Test Engines (Java)

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves a collection of additional `TestEngine` implementations to be registered with the launcher. This allows for custom or third-party test engine integration. Defined in `LauncherConfig`.

```java
getAdditionalTestEngines()
```

--------------------------------

### Get Descriptor Type (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/TestIdentifier

Returns the type of the underlying descriptor, indicating whether it represents a test or a container. The return value is never null.

```java
public TestDescriptor.Type getType()
Get the underlying descriptor type.

Returns:
    the underlying descriptor type; never `null`
```

--------------------------------

### Configure JUnit Platform via Maven Surefire

Source: https://docs.junit.org/current/user-guide/index

Demonstrates setting JUnit Platform configuration parameters within a Maven Surefire configuration. This method uses the `configurationParameters` property in the `pom.xml` to pass key-value pairs directly to the Surefire provider, allowing for customization of test execution in Maven projects.

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>3.0.0-M5</version> <!-- Use the appropriate version -->
    <configuration>
        <configurationParameters>
            <configurationParameter>
                key1 = value1
            </configurationParameter>
            <configurationParameter>
                key2 = value2
            </configurationParameter>
        </configurationParameters>
    </configuration>
</plugin>
```

--------------------------------

### Get Additional Launcher Session Listeners (Java)

Source: https://docs.junit.org/current/api/index-files/index-7

Returns a collection of `LauncherSessionListener` instances to be registered with the launcher for session-level event handling. This is defined in the `LauncherConfig` interface.

```java
getAdditionalLauncherSessionListeners()
```

--------------------------------

### Get All Test Instances (Java)

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves all instances associated with a test, ordered from the outermost to the innermost scope. This method is implemented in `TestInstances` and `DefaultTestInstances`.

```java
getAllInstances()
```

--------------------------------

### Java @BeforeSuite Annotation Example

Source: https://docs.junit.org/current/api/org.junit.platform.suite.api/org/junit/platform/suite/api/BeforeSuite

This snippet demonstrates the usage of the @BeforeSuite annotation in Java. It is used to mark a method that should run before all tests in a test suite. The method must be static, have a void return type, and not be private.

```java
@BeforeSuite
public static void setupTestSuite() {
    // Code to be executed before all tests
    System.out.println("Setting up the test suite...");
}
```

--------------------------------

### DefaultJupiterConfiguration API

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/config/DefaultJupiterConfiguration

Details about the DefaultJupiterConfiguration class, its constructors, and methods.

```APIDOC
## Class: DefaultJupiterConfiguration

### Description
Default implementation of the `JupiterConfiguration` API.

### Fields inherited from interface org.junit.jupiter.engine.config.JupiterConfiguration
`CLOSING_STORED_AUTO_CLOSEABLE_ENABLED_PROPERTY_NAME, DEACTIVATE_CONDITIONS_PATTERN_PROPERTY_NAME, DEFAULT_CLASSES_EXECUTION_MODE_PROPERTY_NAME, DEFAULT_DISPLAY_NAME_GENERATOR_PROPERTY_NAME, DEFAULT_EXECUTION_MODE_PROPERTY_NAME, DEFAULT_TEST_CLASS_ORDER_PROPERTY_NAME, DEFAULT_TEST_INSTANCE_LIFECYCLE_PROPERTY_NAME, DEFAULT_TEST_INSTANTIATION_EXTENSION_CONTEXT_SCOPE_PROPERTY_NAME, DEFAULT_TEST_METHOD_ORDER_PROPERTY_NAME, EXTENSIONS_AUTODETECTION_ENABLED_PROPERTY_NAME, EXTENSIONS_AUTODETECTION_EXCLUDE_PROPERTY_NAME, EXTENSIONS_AUTODETECTION_INCLUDE_PROPERTY_NAME, EXTENSIONS_TIMEOUT_THREAD_DUMP_ENABLED_PROPERTY_NAME, PARALLEL_EXECUTION_ENABLED_PROPERTY_NAME`

### Constructor Summary
#### Constructor
- `DefaultJupiterConfiguration(ConfigurationParameters configurationParameters, OutputDirectoryProvider outputDirectoryProvider)` - Description of the constructor.

### Method Summary
#### Instance Methods
- `ExecutionMode getDefaultClassesExecutionMode()` - Returns the default execution mode for classes.
- `DisplayNameGenerator getDefaultDisplayNameGenerator()` - Returns the default display name generator.
- `ExecutionMode getDefaultExecutionMode()` - Returns the default execution mode.
- `CleanupMode getDefaultTempDirCleanupMode()` - Returns the default temporary directory cleanup mode.
- `Supplier<TempDirFactory> getDefaultTempDirFactorySupplier()` - Returns a supplier for the default temporary directory factory.
- `Optional<ClassOrderer> getDefaultTestClassOrderer()` - Returns the default test class orderer.
- `TestInstance.Lifecycle getDefaultTestInstanceLifecycle()` - Returns the default test instance lifecycle.
- `TestInstantiationAwareExtension.ExtensionContextScope getDefaultTestInstantiationExtensionContextScope()` - Returns the default test instantiation extension context scope.
- `Optional<MethodOrderer> getTestMethodOrderer()` - Returns the default test method orderer.
- `Predicate<ExecutionCondition> getExecutionConditionFilter()` - Returns the filter for execution conditions.
- `Predicate<Class<? extends Extension>> getFilterForAutoDetectedExtensions()` - Returns the filter for auto-detected extensions.
- `OutputDirectoryProvider getOutputDirectoryProvider()` - Returns the output directory provider.
- `Optional<String> getRawConfigurationParameter(String key)` - Retrieves a raw configuration parameter by key.
- `<T> Optional<T> getRawConfigurationParameter(String key, Function<String,T> transformer)` - Retrieves and transforms a raw configuration parameter.
- `boolean isClosingStoredAutoCloseablesEnabled()` - Checks if closing stored auto-closeables is enabled.
- `boolean isExtensionAutoDetectionEnabled()` - Checks if extension auto-detection is enabled.
- `boolean isParallelExecutionEnabled()` - Checks if parallel execution is enabled.
- `boolean isThreadDumpOnTimeoutEnabled()` - Checks if thread dump on timeout is enabled.
```

--------------------------------

### Create a Single Dynamic Test in Java

Source: https://docs.junit.org/current/user-guide/index

Shows how to create a single, standalone dynamic test. This example defines a dynamic test to verify that the string 'pop' is a palindrome.

```java
import org.junit.jupiter.api.DynamicNode;
import org.junit.jupiter.api.TestFactory;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.DynamicTest.dynamicTest;

// ... other imports and class definition

@TestFactory
DynamicNode dynamicNodeSingleTest() {
    return dynamicTest("'pop' is a palindrome", () -> assertTrue(isPalindrome("pop")));
}

// Assume isPalindrome is defined elsewhere, e.g.:
// static boolean isPalindrome(String text) {
//     return new StringBuilder(text).reverse().toString().equals(text);
// }
```

--------------------------------

### Get Executable Arguments from Invocation Context (Java)

Source: https://docs.junit.org/current/api/index-files/index-7

Fetches the arguments used for an executable within a reflective invocation context. This is provided by the `ReflectiveInvocationContext` interface.

```java
getArguments()
```

--------------------------------

### Java: Get Test Engines from LauncherDiscoveryResult

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherDiscoveryResult

Retrieves a collection of all discovered test engines from the LauncherDiscoveryResult. This is useful for iterating through and interacting with the engines that participated in test discovery.

```java
public Collection<TestEngine> getTestEngines()
```

--------------------------------

### PrefixedConfigurationParameters Constructor

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/config/PrefixedConfigurationParameters

Constructs a new PrefixedConfigurationParameters object with a delegate configuration and a prefix.

```APIDOC
## PrefixedConfigurationParameters(ConfigurationParameters delegate, String prefix)

### Description
Create a new view of the supplied `ConfigurationParameters` that applies the supplied prefix to all queries.

### Method
CONSTRUCTOR

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "delegate": "<instance of ConfigurationParameters>",
  "prefix": "<string>"
}
```

### Response
#### Success Response (200)
None (Constructor)

#### Response Example
None (Constructor)
```

--------------------------------

### Get Default Test Method Orderer (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/config/CachingJupiterConfiguration

Retrieves an optional test method orderer. This method is specified by the JupiterConfiguration interface.

```java
public Optional<MethodOrderer> getDefaultTestMethodOrderer()
```

--------------------------------

### Get Exclusive Resources (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/hierarchical/ResourceLock

Retrieves a list of exclusive resources that this lock represents. These are the resources that will be contended for when multiple threads attempt to acquire the lock.

```java
ResourceLock lock = ...;
List<ExclusiveResource> exclusiveResources = lock.getResources();
// Process the exclusive resources
```

--------------------------------

### Using Hamcrest Matchers in JUnit Jupiter Tests

Source: https://docs.junit.org/current/user-guide/index

Demonstrates how to use Hamcrest's fluent API and matchers with JUnit Jupiter for more readable assertions. This requires the Hamcrest library to be on the classpath. It shows static imports for Hamcrest methods and their usage within a JUnit test.

```java
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

import example.util.Calculator;

import org.junit.jupiter.api.Test;

class HamcrestAssertionsDemo {

    private final Calculator calculator = new Calculator();

    @Test
    void assertWithHamcrestMatcher() {
        assertThat(calculator.subtract(4, 1), is(equalTo(3)));
    }

}
```

--------------------------------

### Get Line Number from FilePosition (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/descriptor/FilePosition

Retrieves the line number from a FilePosition object. This method returns an integer representing the line number.

```java
public int getLine()

```

--------------------------------

### Configure JUnit Reporting for Maven

Source: https://docs.junit.org/current/user-guide/index

Enables Open Test Reporting and configures the output directory for Maven Surefire/Failsafe plugins. It includes the reporting dependency and sets configuration parameters within the Surefire plugin configuration.

```xml
<project>
    <!-- ... -->
    <dependencies>
        <dependency>
            <groupId>org.junit.platform</groupId>
            <artifactId>junit-platform-reporting</artifactId>
            <version>1.13.4</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.5.3</version>
                <configuration>
                    <properties>
                        <configurationParameters>
                            junit.platform.reporting.open.xml.enabled = true
                            junit.platform.reporting.output.dir = target/surefire-reports
                        </configurationParameters>
                    </properties>
                </configuration>
            </plugin>
        </plugins>
    </build>
    <!-- ... -->
</project>
```

--------------------------------

### Get Method Descriptors for Ordering

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the list of method descriptors that need to be ordered. This method is part of the context for method orderers in JUnit Jupiter.

```java
/**
 * Get the list of method descriptors to order.
 */
List<MethodDescriptor> getMethodDescriptors();
```

--------------------------------

### Greeting Function in Java

Source: https://docs.junit.org/current/user-guide

A simple Java method that returns a static greeting string. This function serves as a basic example of a method returning a String value.

```java
private static String greeting() {
        return "Hello, World!";
    }
```

--------------------------------

### JUnitException Constructors

Source: https://docs.junit.org/current/api/org.junit.platform.commons/org/junit/platform/commons/JUnitException

Details about the constructors available for the JUnitException class.

```APIDOC
## JUnitException Constructors

### Description
Provides constructors for creating JUnitException instances.

### Constructor Summary

| Modifier | Constructor | Description |
|---|---|---|
| | `JUnitException(String message)` | Creates a new JUnitException with the specified message. |
| | `JUnitException(String message, Throwable cause)` | Creates a new JUnitException with the specified message and cause. |
| `protected` | `JUnitException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace)` | Creates a new JUnitException with the specified message, cause, suppression, and stack trace enable flags. |

### Constructor Details

#### `public JUnitException(String message)`

**Description:** Creates a new JUnitException with the specified message.

#### `public JUnitException(String message, Throwable cause)`

**Description:** Creates a new JUnitException with the specified message and cause.

#### `protected JUnitException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace)`

**Description:** Creates a new JUnitException with the specified message, cause, suppression, and stack trace enable flags.

**Since:** 1.13
```

--------------------------------

### Get Current JRE Version (Java)

Source: https://docs.junit.org/current/api/index-files/index-3

Retrieves the current Java Runtime Environment version. This method is deprecated and recommends using `JRE.currentJre()` instead.

```java
org.junit.jupiter.api.condition.JRE.currentVersion()
org.junit.jupiter.api.condition.JRE.currentJre()
```

--------------------------------

### Get Children Descriptors - Java

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/TestDescriptor

Retrieves an immutable set of children for this test descriptor. The returned set is never null, is not mutable, and may be empty.

```java
Set<? extends TestDescriptor> getChildren()
// Returns: the set of children of this descriptor; neither `null` nor mutable, but potentially empty
```

--------------------------------

### AnnotationBasedArgumentsProvider Constructor

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/provider/AnnotationBasedArgumentsProvider

Details about the constructor for AnnotationBasedArgumentsProvider.

```APIDOC
## Constructor: AnnotationBasedArgumentsProvider

### Description

Initializes a new instance of the `AnnotationBasedArgumentsProvider` class.

### Method

`POST`

### Endpoint

`/websites/junit_current/AnnotationBasedArgumentsProvider`

### Parameters

(No specific parameters for the constructor)

### Request Example

```json
{
  "constructor": "AnnotationBasedArgumentsProvider()"
}
```

### Response

#### Success Response (201)

- **message** (string) - Constructor successfully invoked.

#### Response Example

```json
{
  "message": "AnnotationBasedArgumentsProvider created successfully."
}
```
```

--------------------------------

### Report Entry Handling

Source: https://docs.junit.org/current/api/index-files/index-18

APIs related to creating, matching, and publishing report entries.

```APIDOC
## POST /reporting/reportEntry

### Description
Creates a condition that matches events containing specific key-value pairs in their `ReportEntry` payload.

### Method
POST

### Endpoint
/reporting/reportEntry

### Parameters
#### Request Body
- **keyValuePairs** (Map<String, String>) - Required - The key-value pairs to match within the `ReportEntry`.

### Request Example
```json
{
  "keyValuePairs": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

### Response
#### Success Response (200)
- **condition** (Condition) - A condition object that can be used for event matching.

#### Response Example
```json
{
  "condition": "ReportEntryCondition{keyValuePairs={key1=value1, key2=value2}}"
}
```
```

```APIDOC
## POST /reporting/reportEntry/fromMap

### Description
Creates a `ReportEntry` from a map of key-value pairs.

### Method
POST

### Endpoint
/reporting/reportEntry/fromMap

### Parameters
#### Request Body
- **data** (Map<String, String>) - Required - The map of data to be included in the `ReportEntry`.

### Request Example
```json
{
  "data": {
    "logLevel": "INFO",
    "message": "Test execution started"
  }
}
```

### Response
#### Success Response (200)
- **reportEntry** (ReportEntry) - The created `ReportEntry` object.

#### Response Example
```json
{
  "reportEntry": {
    "timestamp": "2023-10-27T10:00:00Z",
    "data": {
      "logLevel": "INFO",
      "message": "Test execution started"
    }
  }
}
```
```

--------------------------------

### Get Test Tags - Java

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/TestDescriptor

Retrieves the set of tags associated with a test descriptor. This method always returns a non-null set, which may be empty.

```java
Set<TestTag> getTags()
// Returns: the set of tags associated with this descriptor; never `null` but potentially empty
```

--------------------------------

### Get OutputDirectoryProvider in JUnit Platform Engine

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/reporting/class-use/OutputDirectoryProvider

Shows how to obtain the `OutputDirectoryProvider` from `EngineDiscoveryRequest` and `ExecutionRequest` in the JUnit Platform engine. This provider is used for various purposes, including writing reports.

```java
/**
 * Get the {@code OutputDirectoryProvider} for this request.
 *
 * @return the {@code OutputDirectoryProvider}
 */
default OutputDirectoryProvider getOutputDirectoryProvider();
```

```java
/**
 * Returns the {@code OutputDirectoryProvider} for this request for writing reports and other output files.
 *
 * @return the {@code OutputDirectoryProvider}
 */
OutputDirectoryProvider getOutputDirectoryProvider();
```

--------------------------------

### SuiteTestEngine Class

Source: https://docs.junit.org/current/api/org.junit.platform.suite.engine/org/junit/platform/suite/engine/SuiteTestEngine

The JUnit Platform Suite TestEngine. Provides methods for discovering and executing tests.

```APIDOC
## SuiteTestEngine

### Description
The JUnit Platform Suite `TestEngine`.

### Class
`org.junit.platform.suite.engine.SuiteTestEngine`

### Implements
`TestEngine`

### Constructor Summary

| Constructor         | Description      |
|---------------------|------------------|
| `SuiteTestEngine()` |                  |

### Method Summary

| Modifier and Type | Method                                                                 | Description                                               |
|-------------------|------------------------------------------------------------------------|-----------------------------------------------------------|
| `TestDescriptor`  | `discover(EngineDiscoveryRequest discoveryRequest, UniqueId uniqueId)` | Discover tests according to the supplied `EngineDiscoveryRequest`. |
| `void`            | `execute(ExecutionRequest request)`                                    | Execute tests according to the supplied `ExecutionRequest`.   |
| `Optional<String>`| `getArtifactId()`                                                      | Returns `junit-platform-suite-engine` as the artifact ID. |
| `Optional<String>`| `getGroupId()`                                                         | Returns `org.junit.platform` as the group ID.             |
| `String`          | `getId()`                                                              | Get the ID that uniquely identifies this test engine.     |

### Constructor Details

#### `SuiteTestEngine()`
```java
public SuiteTestEngine()
```

### Method Details

#### `getId()`
```java
public String getId()
```
Description copied from interface: `TestEngine`

Get the ID that uniquely identifies this test engine. Each test engine must provide a unique ID. For example, JUnit Vintage and JUnit Jupiter use `"junit-vintage"` and `"junit-jupiter"`, respectively. When in doubt, you may use the fully qualified name of your custom `TestEngine` implementation class.

Specified by:
    `getId` in interface `TestEngine` 

Returns:
    the ID of this test engine; never `null` or blank

#### `getGroupId()`
```java
public Optional<String> getGroupId()
```
Returns `org.junit.platform` as the group ID.

Specified by:
    `getGroupId` in interface `TestEngine` 

Returns:
    an `Optional` containing the group ID; never `null` but potentially empty if the group ID is unknown

See Also:
    
      * `TestEngine.getArtifactId()`
      * `TestEngine.getVersion()`
    

#### `getArtifactId()`
```java
public Optional<String> getArtifactId()
```
Returns `junit-platform-suite-engine` as the artifact ID.

Specified by:
    `getArtifactId` in interface `TestEngine` 

Returns:
    an `Optional` containing the artifact ID; never `null` but potentially empty if the artifact ID is unknown

See Also:
    
      * `Class.getPackage()`
      * `Package.getImplementationTitle()`
      * `TestEngine.getGroupId()`
      * `TestEngine.getVersion()`
    

#### `discover()`
```java
public TestDescriptor discover(EngineDiscoveryRequest discoveryRequest, UniqueId uniqueId)
```
Description copied from interface: `TestEngine`

Discover tests according to the supplied `EngineDiscoveryRequest`. The supplied `UniqueId` must be used as the unique ID of the returned root `TestDescriptor`. In addition, the `UniqueId` must be used to create unique IDs for children of the root's descriptor by calling `UniqueId.append(java.lang.String, java.lang.String)`.

Specified by:
    `discover` in interface `TestEngine` 

Parameters:
    `discoveryRequest` - the discovery request; never `null`     `uniqueId` - the unique ID to be used for this test engine's `TestDescriptor`; never `null` 

Returns:
    the root `TestDescriptor` of this engine, typically an instance of `EngineDescriptor` 

See Also:
    
      * `EngineDescriptor`
    

#### `execute()`
```java
public void execute(ExecutionRequest request)
```
Description copied from interface: `TestEngine`

Execute tests according to the supplied `ExecutionRequest`. The `request` passed to this method contains the root `TestDescriptor` that was previously returned by `TestEngine.discover(org.junit.platform.engine.EngineDiscoveryRequest, org.junit.platform.engine.UniqueId)`, the `EngineExecutionListener` to be notified of test execution events, and `ConfigurationParameters` that may influence test execution.

Specified by:
    `execute` in interface `TestEngine` 

Parameters:
    `request` - the request to execute tests for; never `null`
```

--------------------------------

### Getting Executable from ReflectiveInvocationContext

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the method or constructor involved in a reflective invocation context. This is used for extensions that interact with test method or constructor execution.

```java
ReflectiveInvocationContext.getExecutable()
```

--------------------------------

### Java HttpServerExtension for Lazy Store Initialization

Source: https://docs.junit.org/current/user-guide

This Java class demonstrates a JUnit 5 `ParameterResolver` that lazily stores and retrieves an `HttpServerResource` from the root `ExtensionContext.Store`. It uses `getOrComputeIfAbsent` to ensure the resource is created only once and reused across tests. The extension resolves `HttpServer` instances for test methods.

```java
public class HttpServerExtension implements ParameterResolver {

    @Override
    public boolean supportsParameter(ParameterContext parameterContext, ExtensionContext extensionContext) {
        return HttpServer.class.equals(parameterContext.getParameter().getType());
    }

    @Override
    public Object resolveParameter(ParameterContext parameterContext, ExtensionContext extensionContext) {

        ExtensionContext rootContext = extensionContext.getRoot();
        ExtensionContext.Store store = rootContext.getStore(Namespace.GLOBAL);
        String key = HttpServerResource.class.getName();
        HttpServerResource resource = store.getOrComputeIfAbsent(key, __ -> {
            try {
                HttpServerResource serverResource = new HttpServerResource(0);
                serverResource.start();
                return serverResource;
            }
            catch (IOException e) {
                throw new UncheckedIOException("Failed to create HttpServerResource", e);
            }
        }, HttpServerResource.class);
        return resource.getHttpServer();
    }
}

```

--------------------------------

### Get Engine Execution Listener in JUnit ExecutionRequest

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/ExecutionRequest

Returns the EngineExecutionListener associated with this ExecutionRequest. This listener is used to receive notifications about test execution events.

```java
public EngineExecutionListener getEngineExecutionListener()
```

--------------------------------

### JUnit 5 Test Class as Java Record

Source: https://docs.junit.org/current/user-guide/index

Illustrates using a Java record as a test class in JUnit 5. This example demonstrates a simple test method for addition using JUnit assertions.

```java
import static org.junit.jupiter.api.Assertions.assertEquals;

import example.util.Calculator;

import org.junit.jupiter.api.Test;

record MyFirstJUnitJupiterRecordTests() {

    @Test
    void addition() {
        assertEquals(2, new Calculator().add(1, 1));
    }

}
```

--------------------------------

### Get Filter Reason (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/FilterResult

Instance method to retrieve the reason associated with the filter decision, if provided. The reason is returned as an Optional String.

```java
public Optional<String> getReason()
// Get the reason why the filtered object should be included or excluded, if available.
```

--------------------------------

### Enums: JRE and Theme

Source: https://docs.junit.org/current/api/index-files/index-21

Documentation for the JRE and Theme enums used within JUnit Jupiter.

```APIDOC
## Enums: JRE and Theme

### Description
Definitions for enumeration constants related to Java Runtime Environment (JRE) versions and console output themes.

### Enum: `org.junit.jupiter.api.condition.JRE`
- **`UNDEFINED`**: Represents an undefined JRE version.

### Enum: `org.junit.platform.console.options.Theme`
- **`UNICODE`**: Represents a theme using Unicode (extended ASCII) characters for displaying the test execution tree.

### Request Example
```json
{
  "example": "// Accessing enum constants:
JRE jre = JRE.UNDEFINED;
Theme theme = Theme.UNICODE;"
}
```

### Response
#### Success Response (Enum Constant)
- **Enum Constant**: The specified enum constant.

#### Response Example
```json
{
  "example": "// Successfully accessed the UNDEFINED JRE constant."
}
```
```

--------------------------------

### Get Resource InputStream - Java

Source: https://docs.junit.org/current/api/org.junit.platform.commons/org/junit/platform/commons/support/Resource

Provides an InputStream for reading the content of the resource. The default implementation uses URL.openStream(). This method is crucial for processing resource data.

```java
default InputStream getInputStream() throws IOException
Get an InputStream for reading this resource.
The default implementation delegates to URL.openStream() for this resource's URI.

Returns:
    an input stream for this resource; never null

Throws:
    IOException - if an I/O exception occurs
```

--------------------------------

### Get Arguments as Array - ArgumentsAccessor Java

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/aggregator/DefaultArgumentsAccessor

Returns all arguments contained within this accessor as an Object array. This provides a direct representation of all arguments.

```Java
public Object[] toArray()
```

--------------------------------

### Create DirectorySource from File in Java

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/descriptor/class-use/DirectorySource

This snippet demonstrates how to create a new DirectorySource instance using the static `from` method, which takes a File object representing the directory. This is a common pattern for initializing directory-based sources in test engines.

```java
DirectorySource directorySource = DirectorySource.from(new File("/path/to/your/directory"));
```

--------------------------------

### Retrieve TerminationInfo from Execution (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Execution

Gets the `TerminationInfo` associated with the test execution. This provides details about how the execution was terminated, which can be important for diagnosing issues.

```java
public TerminationInfo getTerminationInfo()
{
    // Implementation details...
    return null;
}
```

--------------------------------

### Add Multiple Configuration Parameters (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherDiscoveryRequestBuilder

Adds multiple configuration parameters to the discovery request from a map. This is an efficient way to set several parameters at once. The provided map must not be null.

```Java
public LauncherDiscoveryRequestBuilder configurationParameters(Map<String,String> configurationParameters)
```

--------------------------------

### Get Argument by Index (Object)

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/aggregator/DefaultArgumentsAccessor

Retrieves the argument at a specified index as a generic Object. The index must be within the bounds of the available arguments.

```java
public Object get(int index)
```

--------------------------------

### DynamicTest Factory Methods

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/DynamicTest

Factory methods for creating DynamicTest instances.

```APIDOC
## POST /api/dynamicTest

### Description
Factory for creating a new `DynamicTest` for the supplied display name, custom test source `URI`, and executable code block.

### Method
POST

### Endpoint
/api/dynamicTest

### Parameters
#### Query Parameters
- **displayName** (String) - Required - The display name for the dynamic test.
- **testSourceUri** (URI) - Optional - A custom URI for the test source.
- **executable** (Executable) - Required - The executable code block for the test.

### Request Example
```json
{
  "displayName": "My Dynamic Test",
  "testSourceUri": "http://example.com/uri",
  "executable": "// Your executable code here"
}
```

### Response
#### Success Response (200)
- **DynamicTest** (object) - The created DynamicTest instance.

#### Response Example
```json
{
  "displayName": "My Dynamic Test",
  "testSourceUri": "http://example.com/uri",
  "executable": "// Your executable code here"
}
```
```

```APIDOC
## POST /api/dynamicTest/simple

### Description
Factory for creating a new `DynamicTest` for the supplied display name and executable code block.

### Method
POST

### Endpoint
/api/dynamicTest/simple

### Parameters
#### Query Parameters
- **displayName** (String) - Required - The display name for the dynamic test.
- **executable** (Executable) - Required - The executable code block for the test.

### Request Example
```json
{
  "displayName": "My Simple Dynamic Test",
  "executable": "// Your executable code here"
}
```

### Response
#### Success Response (200)
- **DynamicTest** (object) - The created DynamicTest instance.

#### Response Example
```json
{
  "displayName": "My Simple Dynamic Test",
  "executable": "// Your executable code here"
}
```
```

--------------------------------

### Get Number of Arguments

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/aggregator/DefaultArgumentsAccessor

Returns the total number of arguments available in this accessor. This is helpful for iterating through arguments or validating the expected number of parameters.

```java
int size()
```

--------------------------------

### Get Explicit Selectors with DiscoverySelector (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/class-use/DiscoverySelector

Retrieves a list of explicit `DiscoverySelector` objects used for test discovery. This is commonly found in console launcher options.

```java
List<DiscoverySelector> TestDiscoveryOptions.getExplicitSelectors()
```

--------------------------------

### Get Executable - Java

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/extension/ReflectiveInvocationContext

Retrieves the executable (method or constructor) associated with this invocation context. This method is part of the `ReflectiveInvocationContext` interface and returns a non-null value.

```Java
T getExecutable()
// Returns: the executable of this invocation context; never null
```

--------------------------------

### Get all NestedClassInvalidityReason enum constants

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/discovery/predicates/TestClassPredicates

The `values()` method returns an array containing all the constants of the NestedClassInvalidityReason enum in the order they are declared. This is a standard method for Java enums.

```java
public static TestClassPredicates.NestedClassInvalidityReason[] values()
Returns an array containing the constants of this enum class, in the order they are declared.
```

--------------------------------

### PackageSource Equality and Hashing

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/descriptor/PackageSource

Information on how PackageSource objects are compared for equality and hashed.

```APIDOC
## GET /junit/PackageSource/utilities

### Description
Provides utilities for comparing PackageSource objects and generating hash codes.

### Method
GET

### Endpoint
/junit/PackageSource/utilities

### Parameters
None

### Response
#### Success Response (200)
- **equalityCheck** (Boolean) - Indicates if two PackageSource objects are equal.
- **hashCode** (Integer) - The hash code for a given PackageSource object.

#### Response Example
```json
{
  "equalityCheck": true,
  "hashCode": 123456789
}
```
```

--------------------------------

### Get TerminationInfo for Execution (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/class-use/TerminationInfo

This method retrieves the TerminationInfo associated with a specific execution. It is part of the Execution class and provides access to the termination status of a test execution.

```Java
TerminationInfo Execution.getTerminationInfo()
```

--------------------------------

### Default Constructor (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/EngineExecutionOrchestrator

Initializes a new instance of the EngineExecutionOrchestrator class. This is the default constructor and does not require any parameters.

```java
public EngineExecutionOrchestrator()
```

--------------------------------

### Get Only Element from Collection (JUnit)

Source: https://docs.junit.org/current/api/index-files/index-7

A utility method to retrieve the single element from a collection that is guaranteed to have exactly one element. This is found in org.junit.platform.commons.util.CollectionUtils.

```java
static <T> T getOnlyElement(Collection<T> collection);
```

--------------------------------

### Create LoggingListener with BiConsumer

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/listeners/class-use/LoggingListener

Creates a LoggingListener that delegates logging messages to a provided BiConsumer. This allows custom handling of exceptions and formatted log messages.

```java
static LoggingListener LoggingListener.forBiConsumer(BiConsumer<Throwable,Supplier<String>> logger)
```

--------------------------------

### Get Lock Mode for ExclusiveResource

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the lock mode of an `ExclusiveResource`. This method is part of the hierarchical execution support in the JUnit platform engine.

```java
/**
 * Get the lock mode of this resource.
 */
LockMode getLockMode();
```

--------------------------------

### Get Selectors by Type with DiscoverySelector (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/class-use/DiscoverySelector

Filters and retrieves `DiscoverySelector` objects of a specific type from an `EngineDiscoveryRequest`. This allows engines to obtain selectors relevant to their capabilities.

```java
<T extends DiscoverySelector> List<T> EngineDiscoveryRequest.getSelectorsByType(Class<T> selectorType)
```

--------------------------------

### Get Resource Name - Java

Source: https://docs.junit.org/current/api/org.junit.platform.commons/org/junit/platform/commons/support/Resource

Retrieves the name of the resource. The name is a '/' separated path relative to the classpath root. This method is essential for identifying resources.

```java
String getName()
Get the name of this resource.
The resource name is a /`-separated path. The path is relative to the classpath root in which the resource is located.

Returns:
    the resource name; never null
```

--------------------------------

### PrefixedConfigurationParameters Methods

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/config/PrefixedConfigurationParameters

Methods for retrieving configuration parameters, including prefixed access.

```APIDOC
## GET /config

### Description
Retrieves configuration parameters from PrefixedConfigurationParameters. Note: Actual endpoint might vary based on framework implementation. These are conceptual representations.

### Method
GET

### Endpoint
`/config`

### Parameters
#### Path Parameters
None

#### Query Parameters
* **key** (String) - Required - The key of the configuration parameter to retrieve.
* **transformer** (Function<String, T>) - Optional - A function to transform the retrieved string value.

#### Request Body
None

### Request Example
```json
{
  "key": "example.key"
}
```

### Response
#### Success Response (200)
* **value** (Optional<String> or Optional<T>) - The retrieved configuration parameter value.

#### Response Example
```json
{
  "value": "some_value"
}
```
```

```APIDOC
## GET /config/boolean

### Description
Retrieves a boolean configuration parameter.

### Method
GET

### Endpoint
`/config/boolean`

### Parameters
#### Path Parameters
None

#### Query Parameters
* **key** (String) - Required - The key of the boolean configuration parameter to retrieve.

#### Request Body
None

### Request Example
```json
{
  "key": "example.boolean.key"
}
```

### Response
#### Success Response (200)
* **value** (Optional<Boolean>) - The retrieved boolean configuration parameter value.

#### Response Example
```json
{
  "value": true
}
```
```

```APIDOC
## GET /config/keys

### Description
Retrieves all keys stored in the configuration.

### Method
GET

### Endpoint
`/config/keys`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{}
```

### Response
#### Success Response (200)
* **keys** (Set<String>) - A set of all configuration keys.

#### Response Example
```json
{
  "keys": ["key1", "key2"]
}
```
```

```APIDOC
## GET /config/size

### Description
Retrieves the number of configuration parameters.

### Method
GET

### Endpoint
`/config/size`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{}
```

### Response
#### Success Response (200)
* **size** (int) - The number of configuration parameters.

#### Response Example
```json
{
  "size": 5
}
```
```

--------------------------------

### Get Console Charset - Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/ConsoleUtils

This method returns the character set of the console. It's a static utility method provided by the ConsoleUtils class.

```java
public static Charset charset() {
    // Implementation returns the charset of the console
    return null; // Placeholder for actual implementation
}
```

--------------------------------

### Get File System Source

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the source file or directory from a file system source. This method is crucial for file-based test discovery and execution.

```java
getFile() - Method in class org.junit.platform.engine.discovery.FileSelector
    
Get the selected file as a `File`.
```

```java
getFile() - Method in class org.junit.platform.engine.support.descriptor.DirectorySource
    
Get the source directory.
```

```java
getFile() - Method in class org.junit.platform.engine.support.descriptor.FileSource
    
Get the source file.
```

```java
getFile() - Method in interface org.junit.platform.engine.support.descriptor.FileSystemSource
    
Get the source file or directory.
```

--------------------------------

### JUnit Test Plan Visitor Methods

Source: https://docs.junit.org/current/api/index-files/index-16

The `TestPlan.Visitor` interface includes the `preVisitContainer(TestIdentifier)` method, which is invoked before a test container is visited during the traversal of a test plan. This allows extensions to perform actions or gather information before processing the contents of a container.

```java
interface org.junit.platform.launcher.TestPlan {
    interface Visitor {
        void preVisitContainer(TestIdentifier identifier);
    }
}
```

--------------------------------

### LauncherFactory - openSession(LauncherConfig)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherFactory

Opens a new LauncherSession using a supplied LauncherConfig. This method allows for custom configuration of the test session, including engines and listeners.

```APIDOC
## POST /launcher/session/open/{config}

### Description
Factory method for opening a new `LauncherSession` using the supplied `LauncherConfig`. This provides fine-grained control over the session and launcher configuration.

### Method
POST

### Endpoint
/launcher/session/open/{config}

### Parameters

#### Path Parameters
- **config** (LauncherConfig) - Required - The configuration for the session and the launcher; never null.

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "example": "No request body needed, config is a path parameter."
}
```

### Response
#### Success Response (200)
- **LauncherSession** (object) - An instance of the LauncherSession configured with the provided `LauncherConfig`.

#### Response Example
```json
{
  "example": "LauncherSession object details"
}
```

#### Error Response
- **PreconditionViolationException** - Thrown if the supplied configuration is null, or if no test engines are detected.
```

--------------------------------

### Get Excluded Engines - Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestDiscoveryOptions

Retrieves a list of engine IDs that should be excluded from test discovery. This allows users to skip specific test engines.

```java
List<String> excludedEngines = discoveryOptions.getExcludedEngines();
```

--------------------------------

### DynamicDescendantFilter Methods (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/descriptor/DynamicDescendantFilter

Provides Java code examples for various methods of the DynamicDescendantFilter class, including allowing prefixes, indices, all elements, and testing unique IDs.

```java
public void allowUniqueIdPrefix(UniqueId uniqueId)
public void allowIndex(int index)
public void allowIndex(Set<Integer> indices)
public void allowAll()
public boolean test(UniqueId uniqueId, Integer index)
public DynamicDescendantFilter withoutIndexFiltering()
public DynamicDescendantFilter copy(UnaryOperator<UniqueId> uniqueIdTransformer)
protected DynamicDescendantFilter configure(UnaryOperator<UniqueId> uniqueIdTransformer, DynamicDescendantFilter copy)
```

--------------------------------

### Verify All JUnit Jupiter Events with EngineTestKit

Source: https://docs.junit.org/current/user-guide/index

This Java code snippet demonstrates how to use JUnit 5's EngineTestKit to execute tests and assert the exact sequence of all events fired by the JUnit Jupiter engine. It includes setup for selecting the engine and test class, executing the test plan, and performing detailed event assertions, with an option to debug events to a writer.

```java
import static org.junit.platform.engine.discovery.DiscoverySelectors.selectClass;
import static org.junit.platform.testkit.engine.EventConditions.abortedWithReason;
import static org.junit.platform.testkit.engine.EventConditions.container;
import static org.junit.platform.testkit.engine.EventConditions.engine;
import static org.junit.platform.testkit.engine.EventConditions.event;
import static org.junit.platform.testkit.engine.EventConditions.finishedSuccessfully;
import static org.junit.platform.testkit.engine.EventConditions.finishedWithFailure;
import static org.junit.platform.testkit.engine.EventConditions.skippedWithReason;
import static org.junit.platform.testkit.engine.EventConditions.started;
import static org.junit.platform.testkit.engine.EventConditions.test;
import static org.junit.platform.testkit.engine.TestExecutionResultConditions.instanceOf;
import static org.junit.platform.testkit.engine.TestExecutionResultConditions.message;

import java.io.StringWriter;
import java.io.Writer;

import example.ExampleTestCase;

import org.junit.jupiter.api.Test;
import org.junit.platform.testkit.engine.EngineTestKit;
import org.opentest4j.TestAbortedException;

class EngineTestKitAllEventsDemo {

    @Test
    void verifyAllJupiterEvents() {
        Writer writer = new StringWriter(); // create a java.io.Writer for debug output

        EngineTestKit.engine("junit-jupiter")
            .selectors(selectClass(ExampleTestCase.class))
            .execute()
            .allEvents()
            .debug(writer)
            .assertEventsMatchExactly(
                event(engine(), started()),
                event(container(ExampleTestCase.class), started()),
                event(test("skippedTest"), skippedWithReason("for demonstration purposes")),
                event(test("succeedingTest"), started()),
                event(test("succeedingTest"), finishedSuccessfully()),
                event(test("abortedTest"), started()),
                event(test("abortedTest"),
                    abortedWithReason(instanceOf(TestAbortedException.class),
                        message(m -> m.contains("abc does not contain Z")))),
                event(test("failingTest"), started()),
                event(test("failingTest"), finishedWithFailure(
                    instanceOf(ArithmeticException.class), message(it -> it.endsWith("by zero")))),
                event(container(ExampleTestCase.class), finishedSuccessfully()),
                event(engine(), finishedSuccessfully()));
    }

}
```

--------------------------------

### DynamicTest Creation

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/DynamicTest

Factory methods for creating individual dynamic tests with display names and executable code.

```APIDOC
## POST /junit/dynamicTest

### Description
Factory for creating a new `DynamicTest` for the supplied display name and executable code block.

### Method
POST

### Endpoint
/junit/dynamicTest

### Parameters
#### Request Body
- **displayName** (string) - Required - The display name for the dynamic test; never null or blank.
- **executable** (Executable) - Required - The executable code block for the dynamic test; never null.

### Request Example
```json
{
  "displayName": "My Dynamic Test",
  "executable": "// Your executable code here"
}
```

### Response
#### Success Response (200)
- **DynamicTest** (object) - The created DynamicTest object.

#### Response Example
```json
{
  "displayName": "My Dynamic Test",
  "executable": "// Your executable code here"
}
```

## POST /junit/dynamicTest/uri

### Description
Factory for creating a new `DynamicTest` for the supplied display name, custom test source URI, and executable code block.

### Method
POST

### Endpoint
/junit/dynamicTest/uri

### Parameters
#### Request Body
- **displayName** (string) - Required - The display name for the dynamic test; never null or blank.
- **testSourceUri** (URI) - Optional - A custom test source URI for the dynamic test; may be null if the framework should generate the test source based on the `@TestFactory` method.
- **executable** (Executable) - Required - The executable code block for the dynamic test; never null.

### Request Example
```json
{
  "displayName": "Test with URI",
  "testSourceUri": "custom://uri/for/test",
  "executable": "// Your executable code here"
}
```

### Response
#### Success Response (200)
- **DynamicTest** (object) - The created DynamicTest object.

#### Response Example
```json
{
  "displayName": "Test with URI",
  "testSourceUri": "custom://uri/for/test",
  "executable": "// Your executable code here"
}
```
```

--------------------------------

### Getting Exception from Test Failure

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the Throwable that caused a test failure. This method is part of the TestExecutionSummary.Failure interface and provides details about the error.

```java
TestExecutionSummary.Failure.getException()
```

--------------------------------

### Get Argument as Short

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/aggregator/DefaultArgumentsAccessor

Retrieves the argument at a specified index and attempts to convert it to a Short. Supports automatic type conversion. The index must be valid.

```java
public Short getShort(int index)
```

--------------------------------

### Configure JUnit Platform with Multiple Parameters

Source: https://docs.junit.org/current/api/index-files/index-3

Adds multiple configuration parameters to the test discovery request from a map. This allows for bulk configuration of the test environment.

```java
configurationParameters(Map<String, String> parameters)
```

--------------------------------

### Set Output Directory Provider

Source: https://docs.junit.org/current/api/org.junit.platform.suite.commons/org/junit/platform/suite/commons/class-use/SuiteLauncherDiscoveryRequestBuilder

This snippet demonstrates how to set an `OutputDirectoryProvider` for the discovery request. This provider determines where output related to test discovery should be placed.

```java
OutputDirectoryProvider provider = new MyOutputProvider();
builder.outputDirectoryProvider(provider);
```

--------------------------------

### Get Class Name Filter

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves a filter for class names, constructed from various name filters specified in the engine discovery request.

```java
getClassNameFilter() - Method in interface org.junit.platform.engine.support.discovery.EngineDiscoveryRequestResolver.InitializationContext
    
Get the class name filter built from the `ClassNameFilters` and `PackageNameFilters` in the `EngineDiscoveryRequest` that is about to be resolved.
```

--------------------------------

### Implement JUnit 5 Test Execution Timing with Java

Source: https://docs.junit.org/current/user-guide/index

This Java extension implements `BeforeTestExecutionCallback` and `AfterTestExecutionCallback` to measure and log the execution time of JUnit 5 test methods. It uses `ExtensionContext.Store` to manage the start time and logs the duration after each test method completes. This is useful for performance monitoring and debugging.

```java
import java.lang.reflect.Method;
import java.util.logging.Logger;

import org.junit.jupiter.api.extension.AfterTestExecutionCallback;
import org.junit.jupiter.api.extension.BeforeTestExecutionCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.ExtensionContext.Namespace;
import org.junit.jupiter.api.extension.ExtensionContext.Store;

public class TimingExtension implements BeforeTestExecutionCallback, AfterTestExecutionCallback {

    private static final Logger logger = Logger.getLogger(TimingExtension.class.getName());

    private static final String START_TIME = "start time";

    @Override
    public void beforeTestExecution(ExtensionContext context) throws Exception {
        getStore(context).put(START_TIME, System.currentTimeMillis());
    }

    @Override
    public void afterTestExecution(ExtensionContext context) throws Exception {
        Method testMethod = context.getRequiredTestMethod();
        long startTime = getStore(context).remove(START_TIME, long.class);
        long duration = System.currentTimeMillis() - startTime;

        logger.info(() ->
            String.format("Method [%s] took %s ms.", testMethod.getName(), duration));
    }

    private Store getStore(ExtensionContext context) {
        return context.getStore(Namespace.create(getClass(), context.getRequiredTestMethod()));
    }

}
```

--------------------------------

### Get Default Test Class Orderer (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/config/CachingJupiterConfiguration

Retrieves an optional test class orderer. This method is specified by the JupiterConfiguration interface.

```java
public Optional<ClassOrderer> getDefaultTestClassOrderer()
```

--------------------------------

### Create Output Directory using OutputDirectoryProvider

Source: https://docs.junit.org/current/api/index-files/index-3

Interface for providing output directories for test results. Implementations can define custom locations for storing reporting artifacts.

```java
createOutputDirectory(TestDescriptor) - Method in interface org.junit.platform.engine.reporting.OutputDirectoryProvider
    
Create an output directory for the supplied test descriptor.
```

--------------------------------

### Using Argument Files

Source: https://docs.junit.org/current/user-guide/index

Demonstrates how to use argument files (@-files) to pass command-line options, especially useful for long command lines or when system limits are reached. Arguments within the file can be space or newline separated, and support quoting for arguments with whitespace.

```bash
# Assuming 'my_options.txt' contains:
# --include-tag=fast
# --details=verbose
# "--config=some.property=value with spaces"

java -jar junit-console.jar @my_options.txt

# Escaping an argument that starts with '@'
java -jar junit-console.jar @@"@real_argument_value"
```

--------------------------------

### JUnit 5 Assertion: Greeting Method

Source: https://docs.junit.org/current/user-guide/index

A simple Java method returning a greeting string. This is a basic example of a static method within a JUnit test class.

```java
private static String greeting() {
    return "Hello, World!";
}
```

--------------------------------

### Get Argument as Byte

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/aggregator/DefaultArgumentsAccessor

Retrieves the argument at a specified index and attempts to convert it to a Byte. Automatic type conversion is supported. Ensure the index is valid.

```java
public Byte getByte(int index)
```

--------------------------------

### Get Parallelism Configuration (JUnit)

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the parallelism configuration, specifying how many tasks can be executed concurrently. This is part of the parallel execution configuration settings.

```java
int getParallelism();
```

--------------------------------

### Get Execution Condition Filter (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/config/CachingJupiterConfiguration

Retrieves a predicate used to filter execution conditions. This method is specified by the JupiterConfiguration interface.

```java
public Predicate<ExecutionCondition> getExecutionConditionFilter()
```

--------------------------------

### MethodDescriptor API Endpoints

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/MethodDescriptor

This section details the available methods for interacting with the MethodDescriptor.

```APIDOC
## GET /methodDescriptor/method

### Description
Retrieves the Method object associated with this descriptor.

### Method
GET

### Endpoint
/methodDescriptor/method

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **method** (Method) - The Method object.

#### Response Example
```json
{
  "method": "<Method object details>"
}
```

## GET /methodDescriptor/displayName

### Description
Retrieves the display name for this descriptor's method.

### Method
GET

### Endpoint
/methodDescriptor/displayName

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **displayName** (String) - The display name for the method.

#### Response Example
```json
{
  "displayName": "ExampleMethod"
}
```

## GET /methodDescriptor/isAnnotated

### Description
Determines if an annotation of a given type is present or meta-present on the Method for this descriptor.

### Method
GET

### Endpoint
/methodDescriptor/isAnnotated

### Parameters
#### Path Parameters
None

#### Query Parameters
- **annotationType** (Class<? extends Annotation>) - Required - The annotation type to search for.

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **isAnnotated** (boolean) - `true` if the annotation is present or meta-present, `false` otherwise.

#### Response Example
```json
{
  "isAnnotated": true
}
```

## GET /methodDescriptor/findAnnotation

### Description
Finds the first annotation of a given type that is either present or meta-present on the Method for this descriptor.

### Method
GET

### Endpoint
/methodDescriptor/findAnnotation

### Parameters
#### Path Parameters
None

#### Query Parameters
- **annotationType** (Class<A>) - Required - The annotation type to search for.

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **annotation** (Optional<A>) - An Optional containing the annotation; may be empty.

#### Response Example
```json
{
  "annotation": {
    "present": true,
    "value": "<Annotation details>"
  }
}
```

## GET /methodDescriptor/findRepeatableAnnotations

### Description
Finds all repeatable annotations of a given type that are either present or meta-present on the Method for this descriptor.

### Method
GET

### Endpoint
/methodDescriptor/findRepeatableAnnotations

### Parameters
#### Path Parameters
None

#### Query Parameters
- **annotationType** (Class<A>) - Required - The repeatable annotation type to search for.

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **annotations** (List<A>) - A list of all such annotations found; potentially empty.

#### Response Example
```json
{
  "annotations": [
    "<Annotation details 1>",
    "<Annotation details 2>"
  ]
}
```
```

--------------------------------

### JupiterTestEngine: Get ID

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/JupiterTestEngine

Retrieves the unique identifier for this test engine. This ID is used to reference the engine within the test platform.

```java
String getId()
```

--------------------------------

### Configure Classpath and Resources (JUnit)

Source: https://docs.junit.org/current/user-guide/index

Provides options to specify additional classpath entries for engines and dependencies, or to set configuration parameters via classpath resources.

```bash
# Example: Add a custom JAR to the classpath
java -jar junit-platform-console.jar --scan-classpath --classpath 'lib/my-engine.jar'

# Example: Set configuration from a resource file
java -jar junit-platform-console.jar --scan-classpath --config-resource 'junit-config.properties'

# Example: Add multiple classpath entries
java -jar junit-platform-console.jar --scan-classpath --classpath 'lib/engine1.jar:lib/engine2.jar'
```

--------------------------------

### Get Nested Class/Method Information (JUnit)

Source: https://docs.junit.org/current/api/index-files/index-7

Methods for retrieving information about nested classes and methods used in test discovery. These are part of the org.junit.platform.engine.discovery package.

```java
Class<?> getNestedClass();
String getNestedClassName();
```

--------------------------------

### Handle Test Plan Execution Start

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/listeners/LoggingListener

Callback method invoked when the execution of a TestPlan begins, prior to any tests being run. It receives a TestPlan object describing the tests to be executed. This method is called from the same thread as testPlanExecutionFinished.

```java
public void testPlanExecutionStarted(TestPlan testPlan) {
    // Implementation details omitted for brevity
}
```

--------------------------------

### Get All CleanupMode Enum Constants (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/io/CleanupMode

Retrieves all the defined constants of the `CleanupMode` enum. This method is useful for iterating through all possible cleanup strategies.

```java
public static CleanupMode[] values()
// Returns an array containing the constants of this enum class, in the order they are declared.
```

--------------------------------

### @TempDir Annotation Configuration

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/io/TempDir

Configuration details for the @TempDir annotation, covering cleanup modes, scope, and factory settings.

```APIDOC
## @TempDir Annotation Configuration

### Description
This section details the configurable aspects of the `@TempDir` annotation in JUnit Jupiter.

### Supported Values for Cleanup Mode

- `per_context`: Creates a single temporary directory for the entire test class or method, depending on where `@TempDir` is first declared.
- `per_declaration`: Creates separate temporary directories for each declaration site of the `@TempDir` annotation.

If not specified, the default is `per_declaration`.

Since: 5.8

### DEFAULT_CLEANUP_MODE_PROPERTY_NAME

@API(status=MAINTAINED, since="5.13.3")
static final String DEFAULT_CLEANUP_MODE_PROPERTY_NAME

The name of the configuration parameter used to configure the default `CleanupMode`.
If this configuration parameter is not set, `CleanupMode.ALWAYS` will be used as the default.

Since: 5.9

### factory

@API(status=MAINTAINED, since="5.13.3")
Class<? extends TempDirFactory> factory

Factory for the temporary directory. If the "junit.jupiter.tempdir.scope" configuration parameter is set to `per_context`, no custom factory is allowed. Defaults to `TempDirFactory.Standard`. As an alternative to setting this attribute, a global `TempDirFactory` can be configured for the entire test suite via the "junit.jupiter.tempdir.factory.default" configuration parameter. Note, however, that a `@TempDir` declaration with a custom `factory` always overrides a global `TempDirFactory`.

Returns: the type of `TempDirFactory` to use.

Since: 5.10

Default: `org.junit.jupiter.api.io.TempDirFactory.class`

### cleanup

@API(status=STABLE, since="5.11")
CleanupMode cleanup

How the temporary directory gets cleaned up after the test completes.

Since: 5.9

Default: `DEFAULT`
```

--------------------------------

### Get Test Class from ClassDescriptor

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/ClassDescriptor

Retrieves the actual Java Class object associated with this descriptor. This method is essential for further introspection or execution of test methods.

```java
Class<?> getTestClass()
// Get the class for this descriptor.
// Returns: the class; never null
```

--------------------------------

### Add Configuration Parameters from Resources (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/class-use/LauncherDiscoveryRequestBuilder

Illustrates adding configuration parameters by loading them from resource files. This allows externalizing configurations.

```java
LauncherDiscoveryRequestBuilder configurationParametersResources(String... paths){
    return this.configurationParametersResources(paths);
}
```

--------------------------------

### Set Default Test Instance Lifecycle via JUnit Platform Configuration File

Source: https://docs.junit.org/current/user-guide/index

Configure the default test instance lifecycle mode for a project by creating a `junit-platform.properties` file. This method is recommended for consistency across environments. This example sets the default to 'per_class'.

```properties
junit.jupiter.testinstance.lifecycle.default = per_class
```

--------------------------------

### Get Additional LauncherDiscoveryListeners from LauncherConfig

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/class-use/LauncherDiscoveryListener

The getAdditionalLauncherDiscoveryListeners() method returns a collection of extra LauncherDiscoveryListener instances that should be associated with the Launcher. These listeners are typically configured via LauncherConfig.

```java
Collection<LauncherDiscoveryListener> LauncherConfig.getAdditionalLauncherDiscoveryListeners()
```

--------------------------------

### Write a JUnit Jupiter Test Case

Source: https://docs.junit.org/current/user-guide/index

This snippet demonstrates the basic structure for writing a test case using JUnit Jupiter. It includes necessary imports for assertions and the @Test annotation, along with a simple test method that uses assertEquals to verify the functionality of a Calculator class. Ensure the Calculator class and its methods are available in your project.

```java
import static org.junit.jupiter.api.Assertions.assertEquals;

import example.util.Calculator;

import org.junit.jupiter.api.Test;

class MyFirstJUnitJupiterTests {

    private final Calculator calculator = new Calculator();

    @Test
    void addition() {
        assertEquals(2, calculator.add(1, 1));
    }

}
```

--------------------------------

### NamespaceAwareStore Constructor and Methods (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/execution/NamespaceAwareStore

This snippet demonstrates the core functionality of NamespaceAwareStore, including its constructor for initializing a store within a specific namespace and methods for getting, computing, putting, and removing values.

```java
NamespaceAwareStore(NamespacedHierarchicalStore<Namespace> valuesStore, Namespace namespace)

Object get(Object key)
<T> T get(Object key, Class<T> requiredType)
<K, V> Object getOrComputeIfAbsent(K key, Function<K, V> defaultCreator)
<K, V> V getOrComputeIfAbsent(K key, Function<K, V> defaultCreator, Class<V> requiredType)
void put(Object key, Object value)
Object remove(Object key)
<T> T remove(Object key, Class<T> requiredType)
```

--------------------------------

### Configure JUnit Platform with Configuration Files

Source: https://docs.junit.org/current/api/index-files/index-3

Adds configuration parameters from one or more Java properties files located on the classpath to the test discovery request. This is helpful for managing configurations externally.

```java
configurationParametersResources("file1.properties", "file2.properties")
```

--------------------------------

### Get Raw Configuration Parameter (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/config/CachingJupiterConfiguration

Retrieves an optional string value for a given configuration key. This method is specified by the JupiterConfiguration interface.

```java
public Optional<String> getRawConfigurationParameter(String key)
```

--------------------------------

### Get Resolution Matches using SelectorResolver

Source: https://docs.junit.org/current/api/index-files/index-7

Returns the collection of matches contained within a `SelectorResolver.Resolution`. This is used in the discovery process of the JUnit platform engine.

```java
/**
 * Returns the matches contained by this resolution.
 */
Collection<?> getMatches();
```

--------------------------------

### TestInstanceFactory API

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/extension/TestInstanceFactory

This section details the `TestInstanceFactory` interface, its purpose, usage, and method signatures.

```APIDOC
## `TestInstanceFactory` Interface

### Description

`TestInstanceFactory` defines the API for `Extensions` that wish to create test instances. Common use cases include creating test instances with special construction requirements or acquiring the test instance from a dependency injection framework. Extensions that implement `TestInstanceFactory` must be registered at the class level.

**Warning:** Only one `TestInstanceFactory` is allowed to be registered for any given test class. Registering multiple factories will result in an exception.

### Method

`createTestInstance`

### Endpoint

N/A (Interface definition)

### Parameters

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

None

### Request Example

N/A (Interface definition)

### Response

#### Success Response (200)

N/A (Interface definition)

#### Response Example

N/A (Interface definition)

### Methods Inherited

- `getTestInstantiationExtensionContextScope(ExtensionContext)` from `TestInstantiationAwareExtension`

### Method Details

#### `createTestInstance`

```java
Object createTestInstance(TestInstanceFactoryContext factoryContext, ExtensionContext extensionContext)
```

##### Description

Callback for creating a test instance for the supplied context. By default, the supplied `ExtensionContext` represents the test class that's about to be instantiated. Extensions may override `getTestInstantiationExtensionContextScope` to change the scope to the test method, unless the `PER_CLASS` lifecycle is used.

##### Parameters

- **`factoryContext`** (`TestInstanceFactoryContext`) - The context for the test class to be instantiated; never `null`.
- **`extensionContext`** (`ExtensionContext`) - The current extension context; never `null`.

##### Returns

- **`Object`** - The test instance; never `null`.

##### Throws

- **`TestInstantiationException`** - If an error occurs while creating the test instance.
```

--------------------------------

### ExpectedExceptionSupport Constructor (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.migrationsupport/org/junit/jupiter/migrationsupport/rules/ExpectedExceptionSupport

The default constructor for ExpectedExceptionSupport. It initializes the extension, enabling its functionality for test classes.

```java
public ExpectedExceptionSupport()
```

--------------------------------

### Get Reason for SkipResult in JUnit Platform

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the reason why the execution of a context should be skipped. This is used in the hierarchical test execution model of the JUnit Platform.

```java
getReason() - Method in class org.junit.platform.engine.support.hierarchical.Node.SkipResult
    
Get the reason that execution of the context should be skipped, if available.
```

--------------------------------

### ClassBasedTestDescriptor Test Class Instantiation

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/descriptor/ClassBasedTestDescriptor

Details the abstract and concrete methods for instantiating test classes within the JUnit Jupiter Engine. This includes `instantiateTestClass` which may involve extensions and contexts.

```java
`protected final TestInstances`
`instantiateTestClass(Optional<TestInstances> outerInstances,  ExtensionRegistry registry,  ExtensionContextSupplier extensionContext)`
`protected abstract TestInstances`
`instantiateTestClass(JupiterEngineExecutionContext parentExecutionContext,  ExtensionContextSupplier extensionContext,  ExtensionRegistry registry,  JupiterEngineExecutionContext context)`
```

--------------------------------

### Get Extensions by Type

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves registered extensions of a specific type from the current context or its ancestors. This method is useful for accessing extension implementations dynamically.

```java
getExtensions(Class<E>) - Method in interface org.junit.jupiter.engine.extension.ExtensionContextInternal
    
Returns a list of registered extension at this context of the passed `extensionType`.
```

```java
getExtensions(Class<E>) - Method in interface org.junit.jupiter.engine.extension.ExtensionRegistry
    
Get all `Extensions` of the specified type that are present in this registry or one of its ancestors.
```

--------------------------------

### Get Event Timestamp (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Event

Retrieves the Instant at which the Event occurred. This provides a precise timestamp for when the event was generated. The return value is never null.

```java
public Instant getTimestamp()
```

--------------------------------

### Add Post Discovery Filters with LauncherConfig.Builder

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/class-use/LauncherConfig

Shows the process of adding multiple PostDiscoveryFilter instances. These filters are applied after test discovery to include or exclude tests.

```java
LauncherConfig.Builder builder = LauncherConfig.builder();
builder.addPostDiscoveryFilters(filter1, filter2);
```

--------------------------------

### Get Test Engine ID (Java)

Source: https://docs.junit.org/current/api/org.junit.vintage.engine/org/junit/vintage/engine/VintageTestEngine

Retrieves the unique identifier for the test engine. Each test engine must provide a distinct ID, such as 'junit-vintage' for JUnit Vintage.

```java
public String getId()
// Returns: the ID of this test engine; never null or blank
```

--------------------------------

### Set Configuration Parameters (JUnit)

Source: https://docs.junit.org/current/user-guide/index

Allows setting individual configuration parameters for test discovery and execution directly via key-value pairs on the command line. This option can be repeated.

```bash
# Example: Set a specific configuration parameter
java -jar junit-platform-console.jar --scan-classpath --config 'junit.extensions.autodetection.enabled=true'

# Example: Set multiple configuration parameters
java -jar junit-platform-console.jar --scan-classpath --config 'junit.extensions.autodetection.enabled=true' --config 'junit.filter.skip=true'
```

--------------------------------

### Get Succeeded Executions (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/class-use/Executions

Retrieves the succeeded `Executions` from an `Executions` object. This method helps in analyzing the successful completion of tests.

```java
Executions.succeeded()
```

--------------------------------

### Get Theme from TestConsoleOutputOptions (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/class-use/Theme

Retrieves the current theme setting from TestConsoleOutputOptions. This method is part of the JUnit console launcher's configuration options.

```java
TestConsoleOutputOptions.
getTheme()
```

--------------------------------

### Create File with Prefix and Extension in Java (JUnit)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/listeners/OutputDir

Creates a file within the OutputDir with a specified prefix and extension. This method can throw an UncheckedIOException if file creation fails. It's useful for generating temporary or log files during test execution.

```java
@API(status=INTERNAL, since="1.9")
public class OutputDir extends Object {
    // ...

    public Path createFile(String prefix, String extension) throws UncheckedIOException

    // ...
}
```

--------------------------------

### Custom @JimfsTempDir Annotation for JUnit 5

Source: https://docs.junit.org/current/user-guide/index

Shows how to create a custom annotation, @JimfsTempDir, which meta-annotates JUnit 5's @TempDir with a specific Jimfs factory. This simplifies test setup by reducing boilerplate code.

```java
@Target({ ElementType.ANNOTATION_TYPE, ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
@TempDir(factory = InMemoryTempDirDemo.JimfsTempDirFactory.class)
public @interface JimfsTempDir {
}
```

--------------------------------

### Composite Launcher Discovery Listeners - JUnit Platform Launcher

Source: https://docs.junit.org/current/api/index-files/index-3

Aggregates multiple `LauncherDiscoveryListener` instances into a single listener. This allows for centralized handling of discovery events from various sources.

```java
LauncherDiscoveryListeners.composite(discoveryListeners);
```

--------------------------------

### Enable Flight Recorder Events for JUnit Tests

Source: https://docs.junit.org/current/user-guide/index

This snippet demonstrates the JVM option required to start Java Flight Recording when launching a test run, enabling the capture of events during test discovery and execution. Ensure the `junit-platform-jfr` module is on the classpath and you are using a compatible JDK version.

```bash
-XX:StartFlightRecording:filename=your_recording_file.jfr
```

--------------------------------

### Get Discovery Issues in Java

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/EngineDiscoveryResults

Retrieves a list of DiscoveryIssues encountered during the test discovery process. This method is crucial for identifying any problems that occurred while discovering tests.

```java
public List<DiscoveryIssue> getDiscoveryIssues() {
    // Returns the issues that were encountered during discovery
}
```

--------------------------------

### Execution Creation and Retrieval

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Execution

Provides methods for creating new Execution instances (both finished and skipped) and retrieving details about an existing execution.

```APIDOC
## POST /execution/finished

### Description
Creates a new instance of an `Execution` that finished with the provided `TestExecutionResult`.

### Method
POST

### Endpoint
/execution/finished

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **testDescriptor** (TestDescriptor) - Required - The `TestDescriptor` that finished.
- **startInstant** (Instant) - Required - The `Instant` that the `Execution` started.
- **endInstant** (Instant) - Required - The `Instant` that the `Execution` completed.
- **executionResult** (TestExecutionResult) - Required - The `TestExecutionResult` of the finished `TestDescriptor`.

### Request Example
```json
{
  "testDescriptor": {"id": "test-descriptor-id"}, 
  "startInstant": "2023-10-27T10:00:00Z", 
  "endInstant": "2023-10-27T10:05:00Z", 
  "executionResult": {"status": "SUCCESS"}
}
```

### Response
#### Success Response (200)
- **Execution** (Execution) - The newly created `Execution` instance.

#### Response Example
```json
{
  "testDescriptor": {"id": "test-descriptor-id"}, 
  "startInstant": "2023-10-27T10:00:00Z", 
  "endInstant": "2023-10-27T10:05:00Z", 
  "duration": "5M",
  "terminationInfo": null,
  "executionResult": {"status": "SUCCESS"}
}
```

## POST /execution/skipped

### Description
Creates a new instance of an `Execution` that was skipped with the provided `skipReason`.

### Method
POST

### Endpoint
/execution/skipped

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **testDescriptor** (TestDescriptor) - Required - The `TestDescriptor` that finished.
- **startInstant** (Instant) - Required - The `Instant` that the `Execution` started.
- **endInstant** (Instant) - Required - The `Instant` that the `Execution` completed.
- **skipReason** (String) - Optional - The reason the `TestDescriptor` was skipped.

### Request Example
```json
{
  "testDescriptor": {"id": "test-descriptor-id"}, 
  "startInstant": "2023-10-27T10:00:00Z", 
  "endInstant": "2023-10-27T10:01:00Z", 
  "skipReason": "Skipped due to configuration error"
}
```

### Response
#### Success Response (200)
- **Execution** (Execution) - The newly created `Execution` instance.

#### Response Example
```json
{
  "testDescriptor": {"id": "test-descriptor-id"}, 
  "startInstant": "2023-10-27T10:00:00Z", 
  "endInstant": "2023-10-27T10:01:00Z", 
  "duration": "1M",
  "terminationInfo": null,
  "skipReason": "Skipped due to configuration error"
}
```

## GET /execution/{testDescriptorId}

### Description
Retrieves the `TestDescriptor` for this `Execution`.

### Method
GET

### Endpoint
/execution/{testDescriptorId}

### Parameters
#### Path Parameters
- **testDescriptorId** (String) - Required - The ID of the `TestDescriptor`.

#### Query Parameters
None

#### Request Body
None

### Response
#### Success Response (200)
- **TestDescriptor** (TestDescriptor) - The `TestDescriptor` for this `Execution`.

#### Response Example
```json
{
  "id": "test-descriptor-id",
  "displayName": "My Test Case"
}
```

## GET /execution/{executionId}/startInstant

### Description
Get the start `Instant` of this `Execution`.

### Method
GET

### Endpoint
/execution/{executionId}/startInstant

### Parameters
#### Path Parameters
- **executionId** (String) - Required - The ID of the `Execution`.

#### Query Parameters
None

#### Request Body
None

### Response
#### Success Response (200)
- **Instant** (Instant) - The start `Instant` of this `Execution`.

#### Response Example
```json
{
  "time": "2023-10-27T10:00:00Z"
}
```

## GET /execution/{executionId}/endInstant

### Description
Get the end `Instant` of this `Execution`.

### Method
GET

### Endpoint
/execution/{executionId}/endInstant

### Parameters
#### Path Parameters
- **executionId** (String) - Required - The ID of the `Execution`.

#### Query Parameters
None

#### Request Body
None

### Response
#### Success Response (200)
- **Instant** (Instant) - The end `Instant` of this `Execution`.

#### Response Example
```json
{
  "time": "2023-10-27T10:05:00Z"
}
```

## GET /execution/{executionId}/duration

### Description
Get the `Duration` of this `Execution`.

### Method
GET

### Endpoint
/execution/{executionId}/duration

### Parameters
#### Path Parameters
- **executionId** (String) - Required - The ID of the `Execution`.

#### Query Parameters
None

#### Request Body
None

### Response
#### Success Response (200)
- **Duration** (Duration) - The `Duration` of this `Execution`.

#### Response Example
```json
{
  "seconds": 300,
  "nanos": 0
}
```

## GET /execution/{executionId}/terminationInfo

### Description
Get the `TerminationInfo` for this `Execution`.

### Method
GET

### Endpoint
/execution/{executionId}/terminationInfo

### Parameters
#### Path Parameters
- **executionId** (String) - Required - The ID of the `Execution`.

#### Query Parameters
None

#### Request Body
None

### Response
#### Success Response (200)
- **TerminationInfo** (TerminationInfo) - The `TerminationInfo` for this `Execution`.

#### Response Example
```json
{
  "status": "TERMINATED"
}
```

## GET /execution/{executionId}/toString

### Description
Returns a string representation of the `Execution` object.

### Method
GET

### Endpoint
/execution/{executionId}/toString

### Parameters
#### Path Parameters
- **executionId** (String) - Required - The ID of the `Execution`.

#### Query Parameters
None

#### Request Body
None

### Response
#### Success Response (200)
- **String** (String) - A string representation of the `Execution`.

#### Response Example
```json
"Execution[... details ...]"
```
```

--------------------------------

### EngineDescriptor Constructor

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/descriptor/EngineDescriptor

Details for creating a new EngineDescriptor instance.

```APIDOC
## EngineDescriptor Constructor

### Description
Create a new `EngineDescriptor` with the supplied `UniqueId` and display name.

### Method
`public EngineDescriptor(UniqueId uniqueId, String displayName)`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "example": "new EngineDescriptor(uniqueId, displayName)"
}
```

### Response
#### Success Response (200)
None

#### Response Example
```json
{
  "example": "EngineDescriptor instance"
}
```
```

--------------------------------

### Method Summary

Source: https://docs.junit.org/current/api/org.junit.vintage.engine/org/junit/vintage/engine/descriptor/VintageTestDescriptor

Details of methods available in `VintageTestDescriptor`, including inherited methods.

```APIDOC
## Method Summary

### Instance Methods in VintageTestDescriptor

- `protected boolean canBeRemovedFromHierarchy()`
- `Description getDescription()`
- `String getLegacyReportingName()`
  - Description: Gets the name of this descriptor for legacy reporting.
- `Set<TestTag> getTags()`
  - Description: Gets the set of tags associated with this descriptor.
- `TestDescriptor.Type getType()`
  - Description: Determines the `TestDescriptor.Type` of this descriptor.
- `void removeFromHierarchy()`
  - Description: Removes this non-root descriptor from its parent and its children.
- `protected boolean tryToExcludeFromRunner(Description description)`

### Methods Inherited from AbstractTestDescriptor

- `addChild`
- `equals`
- `findByUniqueId`
- `getChildren`
- `getDisplayName`
- `getParent`
- `getSource`
- `getUniqueId`
- `hashCode`
- `orderChildren`
- `removeChild`
- `setParent`
- `toString`

### Methods Inherited from Object

- `clone`
- `finalize`
- `getClass`
- `notify`
- `notifyAll`
- `wait`
```

--------------------------------

### Get Lock Mode of ExclusiveResource

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/hierarchical/class-use/ExclusiveResource

Retrieves the lock mode associated with an ExclusiveResource. This method is part of the support classes for hierarchical test engines.

```java
ExclusiveResource.LockMode ExclusiveResource.getLockMode()
// Returns the lock mode of this resource.
```

--------------------------------

### Register WebServerExtension for a Test Class (Java)

Source: https://docs.junit.org/current/user-guide

This example demonstrates registering the WebServerExtension for all tests within a particular class and its subclasses. This is achieved by annotating the test class itself with @ExtendWith, promoting reusability of the extension across multiple tests.

```java
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(WebServerExtension.class)
class MyTests {
    // ... test methods here ...
}
```

--------------------------------

### TestInstancePostProcessor Interface

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/extension/TestInstancePostProcessor

Defines the API for extensions that wish to post-process test instances, commonly used for dependency injection or custom initialization.

```APIDOC
## TestInstancePostProcessor Interface

### Description
`TestInstancePostProcessor` defines the API for `Extensions` that wish to post-process test instances. Common use cases include injecting dependencies into the test instance, invoking custom initialization methods on the test instance, etc. Extensions that implement `TestInstancePostProcessor` must be registered at the class level, declaratively via a field of the test class, or programmatically via a static field of the test class.

### Superinterfaces
- `Extension`
- `TestInstantiationAwareExtension`

### Functional Interface
This is a functional interface and can therefore be used as the assignment target for a lambda expression or method reference.

### Method
#### `postProcessTestInstance(Object testInstance, ExtensionContext context)`

##### Description
Callback for post-processing the supplied test instance.

##### Method Signature
`void postProcessTestInstance(Object testInstance, ExtensionContext context)`

##### Parameters
- **testInstance** (Object) - The instance to post-process; never null.
- **context** (ExtensionContext) - The current extension context; never null.

##### Throws
- `Exception`

##### Details
By default, the supplied `ExtensionContext` represents the test class that's being post-processed. Extensions may override `TestInstantiationAwareExtension.getTestInstantiationExtensionContextScope(org.junit.jupiter.api.extension.ExtensionContext)` to return `TEST_METHOD` in order to change the scope of the `ExtensionContext` to the test method, unless the `PER_CLASS` lifecycle is used. Changing the scope makes test-specific data available to the implementation of this method and allows keeping state on the test level by using the provided `Store` instance.

**Note**: the `ExtensionContext` supplied to a `TestInstancePostProcessor` will always return an empty `Optional` value from `getTestInstance()`. A `TestInstancePostProcessor` should therefore only attempt to process the supplied `testInstance`.

### See Also
- `postProcessTestInstance(Object, ExtensionContext)`
- `TestInstancePreDestroyCallback`
- `TestInstanceFactory`
- `ParameterResolver`

### Status
- **Status**: STABLE
- **Since**: 5.0
```

--------------------------------

### Build LauncherDiscoveryRequest with Selectors and Filters - Java

Source: https://docs.junit.org/current/api/org.junit.platform.suite.commons/org/junit/platform/suite/commons/SuiteLauncherDiscoveryRequestBuilder

This code snippet demonstrates how to use SuiteLauncherDiscoveryRequestBuilder to construct a LauncherDiscoveryRequest. It allows for specifying various selectors (package, class, method, classpath roots, unique ID) and filters (engine inclusion/exclusion, tag inclusion/exclusion, class name patterns). Dependencies include JUnit Platform's discovery modules.

```java
SuiteLauncherDiscoveryRequestBuilder.request()
  .selectors(
        selectPackage("org.example.user"),
        selectClass("org.example.payment.PaymentTests"),
        selectClass(ShippingTests.class),
        selectMethod("org.example.order.OrderTests#test1"),
        selectMethod("org.example.order.OrderTests#test2()")
   )
   .filters(
        includeEngines("junit-jupiter", "spek"),
        includeTags("fast"),
        includeClassNamePatterns(".*Test[s]?")
   )
   .configurationParameter("key", "value")
   .enableImplicitConfigurationParameters(true)
   .applyConfigurationParametersFromSuite(MySuite.class)
   .applySelectorsAndFiltersFromSuite(MySuite.class)
   .build();
```

--------------------------------

### Get Attribute from PackageUtils

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves an attribute from a package by its name or using a function. Handles cases where the attribute may not be found by returning an empty Optional.

```java
getAttribute(Class<?>, String) - Static method in class org.junit.platform.commons.util.PackageUtils
    
Get the value of the specified attribute name, specified as a string, or an empty `Optional` if the attribute was not found.
```

```java
getAttribute(Class<?>, Function<Package, String>) - Static method in class org.junit.platform.commons.util.PackageUtils
    
Get the package attribute for the supplied `type` using the supplied `function`.
```

--------------------------------

### Add Launcher Session Listeners to Configuration (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherConfig

Adds all supplied launcher session listeners to the configuration. This method accepts a variable number of LauncherSessionListener objects for registration. It ensures the provided listeners are not null and do not contain nulls. Returns the builder for chaining.

```Java
public LauncherConfig.Builder addLauncherSessionListeners(LauncherSessionListener... listeners)
Add all of the supplied launcher session listeners to the configuration. 

Parameters:
    `listeners` - additional launcher session listeners to register; never `null` or containing `null` 

Returns:
    this builder for method chaining
```

--------------------------------

### Get Ancestors - Java

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/TestDescriptor

Retrieves an immutable set of all ancestors for this test descriptor, recursively including parents. This method is stable and available since JUnit 1.10.

```java
@API(status=STABLE, since="1.10") default Set<? extends TestDescriptor> getAncestors()
// Returns: the immutable set of all _ancestors_ of this descriptor.
```

--------------------------------

### Get Default Test Instance Lifecycle (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/config/CachingJupiterConfiguration

Retrieves the default lifecycle strategy for test instances. This method is specified by the JupiterConfiguration interface.

```java
public TestInstance.Lifecycle getDefaultTestInstanceLifecycle()
```

--------------------------------

### Set JUnit configuration parameters

Source: https://docs.junit.org/current/user-guide

Allows setting configuration parameters for test discovery and execution. Parameters can be set via key-value pairs or classpath resources, and the option can be repeated.

```CLI
--config=KEY=VALUE     Set a configuration parameter for test discovery and execution.
                               This option can be repeated.
--config-resource=PATH Set configuration parameters for test discovery and execution via
                               a classpath resource. This option can be repeated.
```

--------------------------------

### Composed Annotation Example (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/condition/EnabledOnOs

This Java code demonstrates creating a custom composed annotation, @EnabledOnMacOrWindows, by meta-annotating with @EnabledOnOs. This allows for reusable conditional test configurations.

```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@EnabledOnOs(value = {OS.MAC, OS.WINDOWS})
public @interface EnabledOnMacOrWindows {}
```

--------------------------------

### Get Filter for Auto-Detected Extensions (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/config/CachingJupiterConfiguration

Retrieves a predicate used to filter extensions that are automatically detected. This method is specified by the JupiterConfiguration interface.

```java
public Predicate<Class<? extends Extension>> getFilterForAutoDetectedExtensions()
```

--------------------------------

### JUnit ToolProvider Interface - name Method

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/ConsoleLauncherToolProvider

Shows the signature of the `name` method from the `ToolProvider` interface. This method returns the name of the tool, which is implemented by `ConsoleLauncherToolProvider`.

```java
/**
 * Returns the name of the tool.
 *
 * @return the tool name
 */
@Override
public String name();
```

--------------------------------

### Aligning JUnit Versions with JUnit BOM (Gradle)

Source: https://docs.junit.org/current/user-guide/index

Demonstrates how to use the JUnit Platform Bill of Materials (BOM) in Gradle to manage and align versions of all JUnit 5 artifacts. This ensures consistent versions across your project's JUnit dependencies.

```groovy
dependencies {
    testImplementation(platform("org.junit:junit-bom:5.13.4"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}
```

```groovy
dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter:5.13.4") 
    testRuntimeOnly("org.junit.platform:junit-platform-launcher") 
}
```

--------------------------------

### Get Status of SelectorResolutionResult - Java

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/SelectorResolutionResult

This method retrieves the status of a SelectorResolutionResult, indicating the outcome of the selector resolution. The status is represented by the SelectorResolutionResult.Status enum and is guaranteed to be non-null.

```java
SelectorResolutionResult.Status status = result.getStatus();
```

--------------------------------

### TestIdentifier Class Overview

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/TestIdentifier

Provides an overview of the TestIdentifier class, its purpose, and its relationship with TestPlan.

```APIDOC
## Class: TestIdentifier

### Description
Immutable data transfer object that represents a test or container which is usually part of a `TestPlan`.

### Status
@API(status=STABLE, since="1.0")

### Implements
`Serializable`

### See Also
* `TestPlan`
* Serialized Form
```

--------------------------------

### Build JupiterEngineExecutionContext

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/execution/class-use/JupiterEngineExecutionContext

This method is part of the JupiterEngineExecutionContext builder pattern, responsible for constructing and returning a fully built JupiterEngineExecutionContext instance.

```java
JupiterEngineExecutionContext JupiterEngineExecutionContext.Builder.build()
```

--------------------------------

### Handle Exceptions in Lifecycle Methods

Source: https://docs.junit.org/current/api/index-files/index-12

Defines the API for Extensions to handle exceptions thrown during the execution of lifecycle methods like @BeforeAll, @BeforeEach, @AfterEach, and @AfterAll.

```java
LifecycleMethodExecutionExceptionHandler
```

--------------------------------

### Get Key Set of Configuration Parameters (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/config/PrefixedConfigurationParameters

Returns a set containing all the keys for the configuration parameters stored directly in this PrefixedConfigurationParameters instance. This method is specified by the ConfigurationParameters interface.

```Java
public Set<String> keySet()
```

--------------------------------

### Add Test Engines to Configuration (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherConfig

Adds all supplied test engines to the launcher configuration. This method takes a variable number of TestEngine objects. It is designed for registering custom test engines. The parameter must not be null or contain null elements. Returns the builder for chaining.

```Java
public LauncherConfig.Builder addTestEngines(TestEngine... engines)
Add all of the supplied test engines to the configuration. 

Parameters:
    `engines` - additional test engines to register; never `null` or containing `null` 

Returns:
    this builder for method chaining
```

--------------------------------

### Get Additional Launcher Discovery Listeners (Java)

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves a collection of `TestExecutionListener` instances to be added to the launcher for processing discovery events. This method is part of the `LauncherConfig` interface in JUnit Platform.

```java
getAdditionalLauncherDiscoveryListeners()
```

--------------------------------

### AbstractTestDescriptor Method Examples (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/descriptor/AbstractTestDescriptor

Illustrates common methods for managing test descriptors, including adding/removing children, retrieving parent/children, and accessing display name, unique ID, and tags.

```java
void addChild(TestDescriptor child)
final Set<? extends TestDescriptor> getChildren()
final String getDisplayName()
final Optional<TestDescriptor> getParent()
Set<TestTag> getTags()
final UniqueId getUniqueId()
void removeChild(TestDescriptor child)
void removeFromHierarchy()
```

--------------------------------

### Configuration in Extensions

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/config/class-use/JupiterConfiguration

Illustrates how JupiterConfiguration is used when creating extension registries in the org.junit.jupiter.engine.extension package.

```APIDOC
## Uses of JupiterConfiguration in org.junit.jupiter.engine.extension

### Description
Details methods in `org.junit.jupiter.engine.extension` that accept `JupiterConfiguration`.

### Methods accepting JupiterConfiguration
- **MutableExtensionRegistry.createRegistryWithDefaultExtensions(JupiterConfiguration configuration)** (static) - Factory for creating and populating a new root registry with the default extensions.
```

--------------------------------

### Get DisplayNameGenerator Instance (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/DisplayNameGenerator

Retrieves an instance of `DisplayNameGenerator` corresponding to the provided `Class`. The input `generatorClass` must be a non-null implementation of `DisplayNameGenerator`.

```Java
static DisplayNameGenerator getDisplayNameGenerator(Class<?> generatorClass)
```

--------------------------------

### ExpectedExceptionAdapter Constructor

Source: https://docs.junit.org/current/api/org.junit.jupiter.migrationsupport/org/junit/jupiter/migrationsupport/rules/adapter/ExpectedExceptionAdapter

Initializes a new instance of the ExpectedExceptionAdapter class. It requires a TestRuleAnnotatedMember to function.

```java
public ExpectedExceptionAdapter(TestRuleAnnotatedMember annotatedMember)
```

--------------------------------

### Get Argument Count - ArgumentsAccessor Java

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/aggregator/DefaultArgumentsAccessor

Returns the total number of arguments available in this accessor. This is a simple integer return value indicating the size.

```Java
public int size()
```

--------------------------------

### Get Argument as Double

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/aggregator/DefaultArgumentsAccessor

Retrieves the argument at a specified index and attempts to convert it to a Double. Supports automatic type conversion. The index must be valid.

```java
public Double getDouble(int index)
```

--------------------------------

### JUnit Jupiter Extension1: BeforeEach and AfterEach Callbacks

Source: https://docs.junit.org/current/user-guide/index

Demonstrates the implementation of BeforeEachCallback and AfterEachCallback interfaces in JUnit Jupiter. This extension logs calls to beforeEachCallback and afterEachCallback, illustrating wrapping behavior.

```java
import static example.callbacks.Logger.afterEachCallback;
import static example.callbacks.Logger.beforeEachCallback;

import org.junit.jupiter.api.extension.AfterEachCallback;
import org.junit.jupiter.api.extension.BeforeEachCallback;
import org.junit.jupiter.api.extension.ExtensionContext;

public class Extension1 implements BeforeEachCallback, AfterEachCallback {

    @Override
    public void beforeEach(ExtensionContext context) {
        beforeEachCallback(this);
    }

    @Override
    public void afterEach(ExtensionContext context) {
        afterEachCallback(this);
    }

}
```

--------------------------------

### POST /api/parameterResolutionUtils/resolveParameters (Executable with Supplier)

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/execution/ParameterResolutionUtils

Resolves parameters for a given executable, target, outer instance, extension context supplier, and extension registry.

```APIDOC
## POST /api/parameterResolutionUtils/resolveParameters (Executable with Supplier)

### Description
Resolve the array of parameters for the supplied executable, target, and outer instance, using an `ExtensionContextSupplier`.

### Method
POST

### Endpoint
/api/parameterResolutionUtils/resolveParameters

### Parameters
#### Request Body
- **executable** (Executable) - Required - The executable for which to resolve parameters
- **target** (Optional<Object>) - Required - An `Optional` containing the target on which the executable will be invoked; never `null` but should be empty for static methods and constructors
- **outerInstance** (Optional<Object>) - Required - The outer instance that will be supplied as the first argument to a constructor for an inner class; should be `null` for methods and constructors for top-level or static classes
- **extensionContext** (ExtensionContextSupplier) - Required - The `ExtensionContextSupplier` to provide the current `ExtensionContext`
- **extensionRegistry** (ExtensionRegistry) - Required - The `ExtensionRegistry` to retrieve `ParameterResolvers` from

### Request Example
{
  "executable": { ... },
  "target": "Optional.of(someTarget)",
  "outerInstance": "Optional.of(someOuterInstance)",
  "extensionContext": { ... },
  "extensionRegistry": { ... }
}

### Response
#### Success Response (200)
- **parameters** (Object[]) - An array of Objects to be used as parameters in the executable invocation; never `null` though potentially empty

#### Response Example
{
  "parameters": [ "param1", 123, true ]
}
```

--------------------------------

### Get Argument as Long

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/aggregator/DefaultArgumentsAccessor

Retrieves the argument at a specified index and attempts to convert it to a Long. Supports automatic type conversion. Ensure the index is valid.

```java
public Long getLong(int index)
```

--------------------------------

### FlightRecordingExecutionListener Methods - Java

Source: https://docs.junit.org/current/api/org.junit.platform.jfr/org/junit/platform/jfr/FlightRecordingExecutionListener

Provides methods to hook into the test execution lifecycle. These methods are called at various stages of test plan execution, including start, finish, skip, and reporting of entries or files. They are part of the TestExecutionListener interface.

```java
public void executionFinished(TestIdentifier test, TestExecutionResult result)
public void executionSkipped(TestIdentifier test, String reason)
public void executionStarted(TestIdentifier test)
public void fileEntryPublished(TestIdentifier testIdentifier, FileEntry file)
public void reportingEntryPublished(TestIdentifier test, ReportEntry reportEntry)
public void testPlanExecutionFinished(TestPlan plan)
public void testPlanExecutionStarted(TestPlan plan)
```

--------------------------------

### Get Event Timestamp

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Event

Retrieves the `Instant` representing the precise time when this `Event` occurred. This is valuable for timing analyses and event ordering. Requires JUnit 5.4+.

```java
@API(status=MAINTAINED, since="1.4")
public Instant getTimestamp() {
    // Implementation details not provided in the source text
    return null;
}
```

--------------------------------

### Get and Set DiscoverySelectorIdentifiers in Console Options

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/class-use/DiscoverySelectorIdentifier

Illustrates the methods for retrieving a list of DiscoverySelectorIdentifiers and setting them within the TestDiscoveryOptions. This is crucial for configuring the console launcher with specific discovery criteria.

```java
List<DiscoverySelectorIdentifier> getSelectorIdentifiers()
// Method parameters in org.junit.platform.console.options with type arguments of type DiscoverySelectorIdentifier

void setSelectorIdentifiers(List<DiscoverySelectorIdentifier> selectorIdentifiers)
// Method parameters in org.junit.platform.console.options with type arguments of type DiscoverySelectorIdentifier
```

--------------------------------

### Java: Getting a DisplayNameGenerator Instance

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/DisplayNameGenerator

Static utility method to retrieve an instance of a `DisplayNameGenerator` based on its class. This allows for programmatic access to configured generators.

```java
DisplayNameGenerator generator = DisplayNameGenerator.getDisplayNameGenerator(MyCustomGenerator.class);
// Use the generator...
```

--------------------------------

### Add Post Discovery Filters to Configuration (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/LauncherConfig

Adds all supplied post discovery filters to the configuration. This method accepts multiple PostDiscoveryFilter objects. It ensures that neither the array nor its elements are null. Returns the builder for method chaining.

```Java
@API(status=STABLE, since="1.10") public LauncherConfig.Builder addPostDiscoveryFilters(PostDiscoveryFilter... filters)
Add all of the supplied `filters` to the configuration. 

Parameters:
    `filters` - additional post discovery filters to register; never `null` or containing `null` 

Returns:
    this builder for method chaining

Since:
    1.7
```

--------------------------------

### JUnit TestExecutionListener: Get Summary

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/listeners/SummaryGeneratingListener

Retrieves the generated test execution summary. This method is part of the SummaryGeneratingListener and allows access to the aggregated results after test execution has completed.

```java
public TestExecutionSummary getSummary()
```

--------------------------------

### Get Test Descriptor from Event

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Event

Retrieves the `TestDescriptor` associated with this `Event`. The `TestDescriptor` provides metadata about the test or container that the event relates to. Requires JUnit 5.4+.

```java
@API(status=MAINTAINED, since="1.4")
public TestDescriptor getTestDescriptor() {
    // Implementation details not provided in the source text
    return null;
}
```

--------------------------------

### Create Namespace with Parts - JUnit Platform Engine

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/store/class-use/Namespace

Demonstrates creating a new Namespace by appending provided parts. This is used to restrict data access to extensions that use the same sequence of parts for namespace creation. It is part of the 'org.junit.platform.engine.support.store' package.

```java
static Namespace
Namespace.create(Object... parts)
Create a namespace which restricts access to data to all extensions which use the same sequence of "parts" for creating a namespace.
```

```java
static Namespace
Namespace.create(List<Object> objects)
Create a namespace which restricts access to data to all extensions which use the same sequence of "objects" for creating a namespace.
```

--------------------------------

### Get Dynamic Descendant Filter for TestTemplateTestDescriptor

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/descriptor/TestTemplateTestDescriptor

Retrieves the `DynamicDescendantFilter` associated with this descriptor. This filter is used to manage dynamic test descendants during test execution.

```java
public DynamicDescendantFilter getDynamicDescendantFilter()
```

--------------------------------

### Get Resource Locks Provider Evaluator in Java

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/descriptor/ClassBasedTestDescriptor

Retrieves a function that evaluates resource locks from a ResourceLocksProvider. This is used in determining exclusive resources for tests.

```java
Function<ResourceLocksProvider,Set<ResourceLocksProvider.Lock>> getResourceLocksProviderEvaluator()
```

--------------------------------

### Constructor for PrefixedConfigurationParameters (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/config/PrefixedConfigurationParameters

Initializes a new PrefixedConfigurationParameters object, creating a view of the provided ConfigurationParameters with a specified prefix applied to all queries. It ensures that both the delegate and prefix are non-null and non-blank.

```Java
public PrefixedConfigurationParameters(ConfigurationParameters delegate, String prefix)
```

--------------------------------

### Get Executions as List - Java

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/class-use/Execution

Retrieves all `Execution` objects in the collection as a standard Java `List`. This is useful for iterating over executions or performing list-specific operations.

```java
List<Execution> list()
```

--------------------------------

### Apply Suite Configuration, Selectors, and Filters

Source: https://docs.junit.org/current/api/org.junit.platform.suite.commons/org/junit/platform/suite/commons/SuiteLauncherDiscoveryRequestBuilder

Applies a suite's annotation-based configuration, selectors, and filters to the builder. This method is deprecated as of JUnit Platform 1.11 in favor of separate methods for configuration and selectors/filters.

```APIDOC
## applySuiteConfigurationAndDiscovery 

### Description
Applies a suite's annotation-based configuration, selectors, and filters to this builder. Deprecated as of JUnit Platform 1.11.

### Method
`applySuiteConfigurationAndDiscovery` (This is a conceptual grouping of deprecated functionality)

### Endpoint
N/A (Java method)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
N/A

### Response
#### Success Response (N/A)
N/A

#### Response Example
N/A
```

--------------------------------

### Launcher Discovery: Getting Engine TestDescriptor

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/class-use/TestEngine

Retrieves the `TestDescriptor` representing the root of the test plan for a given `TestEngine` within the `LauncherDiscoveryResult`. This descriptor outlines the structure of discovered tests.

```java
TestDescriptor LauncherDiscoveryResult.getEngineTestDescriptor(TestEngine testEngine)
```

--------------------------------

### Get Package Filter (JUnit)

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves a package name filter. This is used during engine discovery to control which packages are included in the test resolution process.

```java
Predicate<String> getPackageFilter();
```

--------------------------------

### Publishing Files and Directories with TestReporter

Source: https://docs.junit.org/current/user-guide

Demonstrates how to use the TestReporter to publish individual files and entire directories. This includes creating temporary files and directories, writing content to them, and then publishing them using the testReporter API. It showcases publishing a single file, a directory created via a lambda, and an existing directory.

```java
Path existingFile = Files.write(tempDir.resolve("test2.txt"), singletonList("Test 2"));
testReporter.publishFile(existingFile, MediaType.TEXT_PLAIN_UTF_8);

testReporter.publishDirectory("test3", dir -> {
    Files.write(dir.resolve("nested1.txt"), singletonList("Nested content 1"));
    Files.write(dir.resolve("nested2.txt"), singletonList("Nested content 2"));
});

Path existingDir = Files.createDirectory(tempDir.resolve("test4"));
Files.write(existingDir.resolve("nested1.txt"), singletonList("Nested content 1"));
Files.write(existingDir.resolve("nested2.txt"), singletonList("Nested content 2"));
testReporter.publishDirectory(existingDir);
```

--------------------------------

### Java JUnit 5 Nested Tests for Stack

Source: https://docs.junit.org/current/user-guide

This Java code demonstrates the use of JUnit 5's @Nested annotation to create hierarchical test suites for a Stack. It includes setup methods (@BeforeEach) and various test cases for different stack states (empty, after pushing). Dependencies include JUnit 5 Jupiter API. It covers instantiation, emptiness checks, push, pop, and peek operations.

```java
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.EmptyStackException;
import java.util.Stack;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

@DisplayName("A stack")
class TestingAStackDemo {

    Stack<Object> stack;

    @Test
    @DisplayName("is instantiated with new Stack()")
    void isInstantiatedWithNew() {
        new Stack<>();
    }

    @Nested
    @DisplayName("when new")
    class WhenNew {

        @BeforeEach
        void createNewStack() {
            stack = new Stack<>();
        }

        @Test
        @DisplayName("is empty")
        void isEmpty() {
            assertTrue(stack.isEmpty());
        }

        @Test
        @DisplayName("throws EmptyStackException when popped")
        void throwsExceptionWhenPopped() {
            assertThrows(EmptyStackException.class, stack::pop);
        }

        @Test
        @DisplayName("throws EmptyStackException when peeked")
        void throwsExceptionWhenPeeked() {
            assertThrows(EmptyStackException.class, stack::peek);
        }

        @Nested
        @DisplayName("after pushing an element")
        class AfterPushing {

            String anElement = "an element";

            @BeforeEach
            void pushAnElement() {
                stack.push(anElement);
            }

            @Test
            @DisplayName("it is no longer empty")
            void isNotEmpty() {
                assertFalse(stack.isEmpty());
            }

            @Test
            @DisplayName("returns the element when popped and is empty")
            void returnElementWhenPopped() {
                assertEquals(anElement, stack.pop());
                assertTrue(stack.isEmpty());
            }

            @Test
            @DisplayName("returns the element when peeked but remains not empty")
            void returnElementWhenPeeked() {
                assertEquals(anElement, stack.peek());
                assertFalse(stack.isEmpty());
            }
        }
    }
}

```

--------------------------------

### JupiterConfiguration Interface - Field Details (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/config/JupiterConfiguration

This snippet details specific fields within the JupiterConfiguration interface. It includes constants for property names related to extension auto-detection, parallel execution, and default behaviors, providing concrete examples of configuration keys used by JUnit Jupiter.

```Java
static final String EXTENSIONS_AUTODETECTION_INCLUDE_PROPERTY_NAME
static final String EXTENSIONS_AUTODETECTION_EXCLUDE_PROPERTY_NAME
static final String DEACTIVATE_CONDITIONS_PATTERN_PROPERTY_NAME
static final String PARALLEL_EXECUTION_ENABLED_PROPERTY_NAME
static final String CLOSING_STORED_AUTO_CLOSEABLE_ENABLED_PROPERTY_NAME
static final String DEFAULT_EXECUTION_MODE_PROPERTY_NAME
static final String DEFAULT_CLASSES_EXECUTION_MODE_PROPERTY_NAME
static final String EXTENSIONS_AUTODETECTION_ENABLED_PROPERTY_NAME
static final String EXTENSIONS_TIMEOUT_THREAD_DUMP_ENABLED_PROPERTY_NAME
static final String DEFAULT_TEST_INSTANCE_LIFECYCLE_PROPERTY_NAME
static final String DEFAULT_DISPLAY_NAME_GENERATOR_PROPERTY_NAME
static final String DEFAULT_TEST_METHOD_ORDER_PROPERTY_NAME
static final String DEFAULT_TEST_CLASS_ORDER_PROPERTY_NAME
static final String DEFAULT_TEST_INSTANTIATION_EXTENSION_CONTEXT_SCOPE_PROPERTY_NAME
```

--------------------------------

### Get Legacy Reporting Name (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/TestIdentifier

Retrieves the name suitable for legacy reporting systems, such as the Ant-based XML format for JUnit 4. By default, it delegates to `getDisplayName()`.

```java
public String getLegacyReportingName()
Get the name of this identifier in a format that is suitable for legacy reporting infrastructure — for example, for reporting systems built on the Ant-based XML reporting format for JUnit 4.
The default implementation delegates to `getDisplayName()`.

Returns:
    the legacy reporting name; never `null` or blank

See Also:
    
      * `TestDescriptor.getLegacyReportingName()`
      * `LegacyReportingUtils`
```

--------------------------------

### Configure JUnit Reporting for Gradle (Groovy DSL)

Source: https://docs.junit.org/current/user-guide/index

Enables Open Test Reporting and sets the output directory for Gradle builds using Groovy DSL. It adds the necessary dependency and configures test tasks to use system properties for reporting.

```groovy
dependencies {
    testRuntimeOnly("org.junit.platform:junit-platform-reporting:1.13.4")
}
tasks.withType(Test).configureEach {
    def outputDir = reports.junitXml.outputLocation
    jvmArgumentProviders << ({
        [
            "-Djunit.platform.reporting.open.xml.enabled=true",
            "-Djunit.platform.reporting.output.dir=${outputDir.get().asFile.absolutePath}"
        ]
    } as CommandLineArgumentProvider)
}
```

--------------------------------

### Enable Auto-Registration for Post Discovery Filters

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/class-use/LauncherConfig

Configures the auto-registration of post discovery filters. Enabling this feature allows for automatic discovery and registration of filters.

```java
LauncherConfig.Builder builder = LauncherConfig.builder();
builder.enablePostDiscoveryFilterAutoRegistration(true);
```

--------------------------------

### Standard TempDirFactory Implementation

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/io/TempDirFactory

The standard implementation of TempDirFactory, which uses Files.createTempDirectory to create temporary directories. It delegates the creation to the standard Java file system operations.

```java
static class TempDirFactory.Standard implements TempDirFactory {
    @Override
    public Path createTempDirectory(AnnotatedElementContext elementContext, ExtensionContext extensionContext) throws Exception {
        return Files.createTempDirectory("junit-");
    }

    @Override
    public void close() throws IOException {
        // No-op for standard implementation
    }
}
```

--------------------------------

### Get Method from MethodDescriptor or NestedMethodSelector

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the `Method` object associated with a descriptor or selector. This is used for identifying methods in test descriptions and selection mechanisms.

```java
/**
 * Get the method for this descriptor.
 */
java.lang.reflect.Method getMethod();
```

```java
/**
 * Get the selected `Method`.
 */
java.lang.reflect.Method getMethod();
```

--------------------------------

### Get Default Temporary Directory Factory Supplier

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/config/JupiterConfiguration

Retrieves a supplier for creating temporary directory factories. This allows customization of how temporary directories are provisioned for tests. Returns a Supplier<TempDirFactory>.

```java
Supplier<TempDirFactory> getDefaultTempDirFactorySupplier()
```

--------------------------------

### Get Output Directory Provider (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/config/CachingJupiterConfiguration

Retrieves the provider responsible for determining the output directory for test results. This method is specified by the JupiterConfiguration interface.

```java
public OutputDirectoryProvider getOutputDirectoryProvider()
```

--------------------------------

### TestIdentifier Factory Method

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/TestIdentifier

Details the static factory method for creating a TestIdentifier from a TestDescriptor.

```APIDOC
## Method: TestIdentifier.from(TestDescriptor testDescriptor)

### Description
Factory for creating a new `TestIdentifier` from a `TestDescriptor`.

### Method
`static TestIdentifier`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "example": "Not applicable for static factory methods"
}
```

### Response
#### Success Response (200)
* **TestIdentifier** (TestIdentifier) - A newly created TestIdentifier instance.

#### Response Example
```json
{
  "example": "Not applicable for static factory methods"
}
```
```

--------------------------------

### Get Engine TestDescriptor

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/class-use/TestDescriptor

Retrieves the root `TestDescriptor` for a specific `TestEngine`. This method is part of the `LauncherDiscoveryResult` and is used to obtain the hierarchical structure of tests discovered by an engine.

```java
TestDescriptor getEngineTestDescriptor(TestEngine testEngine)
```

--------------------------------

### Execute Tests with EngineTestKit Builder

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/EngineTestKit

Executes tests based on the configured `TestEngine`, selectors, filters, and configuration parameters. Returns `EngineExecutionResults`.

```java
public EngineExecutionResults execute()
```

--------------------------------

### Get File from DirectorySource - Java

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/descriptor/DirectorySource

Retrieves the File object representing the source directory. This method is part of the FileSystemSource interface and guarantees a non-null return value.

```java
public final File getFile()
```

--------------------------------

### Logging Listener for Test Execution

Source: https://docs.junit.org/current/api/index-files/index-12

A simple TestExecutionListener that logs informational messages for all events using a BiConsumer. It consumes Throwable and Supplier<String> for logging.

```java
LoggingListener - Class in org.junit.platform.launcher.listeners
```

--------------------------------

### Get Descendants - TestDescriptor Interface

Source: https://docs.junit.org/current/api/index-files/index-7

Returns an immutable set of all descendants for a given TestDescriptor. This is crucial for understanding the hierarchical structure of tests in JUnit Platform.

```java
getDescendants() - Method in interface org.junit.platform.engine.TestDescriptor
    
Get the immutable set of all _descendants_ of this descriptor.
```

--------------------------------

### Initialize LogRecordListener (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.commons/org/junit/platform/commons/logging/LogRecordListener

This snippet shows the default constructor for LogRecordListener. It initializes a new instance of the listener, ready to capture log records.

```java
public LogRecordListener()
```

--------------------------------

### Get ExtensionContext Store with Namespace

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/extension/class-use/ExtensionContext

Illustrates how to retrieve an ExtensionContext.Store using a specific ExtensionContext.Namespace. The store provides a mechanism to store and retrieve objects associated with the extension context.

```java
ExtensionContext extensionContext = ...; // Obtain an ExtensionContext instance
ExtensionContext.Namespace namespace = ExtensionContext.Namespace.create("my", "data");

ExtensionContext.Store store = extensionContext.getStore(namespace);

// You can also specify a scope:
ExtensionContext.Store scopedStore = extensionContext.getStore(ExtensionContext.StoreScope.GLOBAL, namespace);
```

--------------------------------

### Get Resource URI - Java

Source: https://docs.junit.org/current/api/org.junit.platform.commons/org/junit/platform/commons/support/Resource

Retrieves the Uniform Resource Identifier (URI) of the resource. This method is useful for locating and accessing the resource's location in a standardized format.

```java
URI getUri()
Get the URI of this resource.

Returns:
    the uri of the resource; never null
```

--------------------------------

### Create Dynamic Test with JUnit 5 (Executable)

Source: https://docs.junit.org/current/api/index-files/index-4

Factory method to create a `DynamicTest` with a display name and an executable code block. This is the standard way to define simple dynamic tests.

```java
org.junit.jupiter.api.DynamicTest dynamicTest(
    String displayName,
    org.junit.jupiter.api.Executable executable
)
```

--------------------------------

### Register WebServerExtension for a Test Method (Java)

Source: https://docs.junit.org/current/user-guide

This snippet shows how to register the WebServerExtension for a specific test method. The extension is assumed to start a web server and inject its URL into parameters annotated with @WebServerUrl. It demonstrates the basic usage of @ExtendWith at the method level.

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.junit.jupiter.api.Assertions.assertEquals;

// Assume WebServerExtension and WebClient are defined elsewhere
// Assume @WebServerUrl annotation is defined elsewhere

@Test
@ExtendWith(WebServerExtension.class)
void getProductList(@WebServerUrl String serverUrl) {
    WebClient webClient = new WebClient();
    // Use WebClient to connect to web server using serverUrl and verify response
    assertEquals(200, webClient.get(serverUrl + "/products").getResponseStatus());
}
```

--------------------------------

### Asserting Event Statistics with EventStatistics

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/EventStatistics

This snippet demonstrates how to use the EventStatistics class to assert the number of started and succeeded events. It's a common pattern for verifying event handling in tests.

```java
events.assertStatistics(stats -> stats.started(1).succeeded(1).failed(0));
```

--------------------------------

### Get Classpath Resource Name (Java) - org.junit.platform.engine.discovery.ClasspathResourceSelector

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the name of a selected classpath resource. This method is part of the discovery API for JUnit Platform.

```Java
String org.junit.platform.engine.discovery.ClasspathResourceSelector.getClasspathResourceName()
```

--------------------------------

### Get Test Instances with ExtensionRegistry

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/extension/class-use/ExtensionRegistry

Retrieves test instances by utilizing an ExtensionRegistry. The TestInstancesProvider uses the registry to facilitate the provision of test instances within the execution context.

```java
TestInstances getTestInstances(ExtensionRegistry extensionRegistry, JupiterEngineExecutionContext executionContext)
```

--------------------------------

### Java: Proceed with InvocationInterceptor.Invocation

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/extension/InvocationInterceptor

The `proceed()` method is used to continue with the current invocation. It returns the result of the invocation, which may be null, and can throw a `Throwable` if the invocation fails. This method is part of the `InvocationInterceptor.Invocation<T>` interface.

```java
T proceed() throws Throwable
```

--------------------------------

### Get Additional Classpath Entries (Java)

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves a collection of additional classpath entries that should be included for test discovery. This is a method of `TestDiscoveryOptions` in JUnit Platform Console.

```java
getAdditionalClasspathEntries()
```

--------------------------------

### Get Default Temp Directory Factory Supplier (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/config/CachingJupiterConfiguration

Retrieves a supplier for creating temporary directory factories. This method is specified by the JupiterConfiguration interface.

```java
public Supplier<TempDirFactory> getDefaultTempDirFactorySupplier()
```

--------------------------------

### Create Output File Listener Method

Source: https://docs.junit.org/current/api/index-files/index-3

Method for creating an output file within the JUnit Platform launcher's listener mechanism. This is likely used for logging or reporting purposes.

```java
createFile(String, String) - Method in class org.junit.platform.launcher.listeners.OutputDir
```

--------------------------------

### Configure Test Engine Execution with EngineTestKit.Builder

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/class-use/EngineTestKit

The EngineTestKit.Builder class allows for the programmatic configuration of a TestEngine's execution on the JUnit Platform. It supports setting configuration parameters, discovery filters, selectors, and specifying the test engine itself. Dependencies include JUnit Platform Test Kit and relevant testing interfaces.

```java
EngineTestKit.Builder builder = EngineTestKit.engine("testEngineId");
builder.configurationParameter("key", "value");
builder.filters(new SomeFilter());
builder.selectors(new SomeSelector());
EngineTestKit.execute(builder);
```

```java
TestEngine testEngine = new MyTestEngine();
EngineTestKit.Builder builder = EngineTestKit.engine(testEngine);
builder.enableImplicitConfigurationParameters(false);
builder.outputDirectoryProvider(new MyOutputDirectoryProvider());
EngineTestKit.execute(builder);
```

--------------------------------

### Get Arguments from ArgumentsAccessor

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves argument values from an ArgumentsAccessor, either as an Object or a specific type. Used in parameterized tests to access test data.

```java
get(int index)

```

```java
get(int index, Class<T> type)

```

--------------------------------

### JUnit Test Instance Lifecycle Callbacks

Source: https://docs.junit.org/current/api/index-files/index-16

Defines interfaces for callbacks during the test instance lifecycle. `TestInstancePreConstructCallback` allows actions before instance construction, while `TestInstancePreDestroyCallback` provides methods for actions before instance destruction. The latter includes a utility method for processing all test instances within a context.

```java
interface org.junit.jupiter.api.extension.TestInstancePreConstructCallback {
    void preConstructTestInstance(TestInstanceFactoryContext factoryContext, ExtensionContext extensionContext);
}

interface org.junit.jupiter.api.extension.TestInstancePreDestroyCallback {
    void preDestroyTestInstance(ExtensionContext extensionContext);
    static void preDestroyTestInstances(ExtensionContext extensionContext, java.util.function.Consumer<Object> processor) {
        // Implementation details omitted
    }
}
```

--------------------------------

### Get Additional Classpath Entries - Java

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/TestDiscoveryOptions

Retrieves a list of additional classpath entries configured for test discovery. These are paths that will be scanned for tests in addition to the default classpath.

```java
List<Path> additionalClasspathEntries = discoveryOptions.getAdditionalClasspathEntries();
```

--------------------------------

### EngineFilter Static Methods

Source: https://docs.junit.org/current/api/index-files/index-9

Methods for creating EngineFilters.

```APIDOC
## EngineFilter Static Methods

### Description
Provides static methods to create `EngineFilter` instances for including specific engines.

### Method
`includeEngines(String...)`
  Create a new _include_ `EngineFilter` based on the supplied engine IDs.
`includeEngines(List<String>)`
  Create a new _include_ `EngineFilter` based on the supplied engine IDs.

### Endpoint
N/A (Static Method)

### Parameters
- `engineIds` (String...) or `engineIds` (List<String>) - A variable number of or a list of engine IDs to include.

### Request Example
N/A

### Response
N/A

#### Success Response (N/A)
N/A

#### Response Example
N/A
```

--------------------------------

### Get Default Classes Execution Mode (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/config/CachingJupiterConfiguration

Retrieves the default execution mode for test classes. This method is specified by the JupiterConfiguration interface.

```java
public ExecutionMode getDefaultClassesExecutionMode()
```

--------------------------------

### JUnit 5 Test Execution Listener Methods

Source: https://docs.junit.org/current/api/org.junit.platform.jfr/org/junit/platform/jfr/FlightRecordingExecutionListener

This Java code demonstrates the implementation of various methods from the TestExecutionListener interface within the FlightRecordingExecutionListener class. These methods are callbacks triggered at different points during test plan execution, such as when a test plan starts or finishes, or when individual tests are executed, skipped, or finished.

```java
public class FlightRecordingExecutionListener implements TestExecutionListener {

    @Override
    public void testPlanExecutionStarted(TestPlan plan) {
        // Called when the execution of the TestPlan has started, before any test has been executed.
    }

    @Override
    public void testPlanExecutionFinished(TestPlan plan) {
        // Called when the execution of the TestPlan has finished, after all tests have been executed.
    }

    @Override
    public void executionSkipped(TestIdentifier test, String reason) {
        // Called when the execution of a leaf or subtree of the TestPlan has been skipped.
    }

    @Override
    public void executionStarted(TestIdentifier test) {
        // Called when the execution of a leaf or subtree of the TestPlan is about to be started.
    }

    @Override
    public void executionFinished(TestIdentifier test, TestExecutionResult result) {
        // Called when the execution of a leaf or subtree of the TestPlan has finished, regardless of the outcome.
    }

    @Override
    public void reportingEntryPublished(TestIdentifier test, ReportEntry reportEntry) {
        // Called when additional test reporting data has been published for the supplied TestIdentifier.
    }

    @Override
    public void fileEntryPublished(TestIdentifier testIdentifier, FileEntry file) {
        // Called when a file or directory has been published for the supplied TestIdentifier.
    }

    // Constructor
    public FlightRecordingExecutionListener() {
        // Constructor details.
    }
}
```

--------------------------------

### Test Discovery and Filtering

Source: https://docs.junit.org/current/api/index-files/index-1

Demonstrates how to create a LauncherDiscoveryListener that aborts test discovery on failures. Also shows how to adapt existing filters with custom logic.

```java
org.junit.platform.launcher.listeners.discovery.LauncherDiscoveryListeners.abortOnFailure()
org.junit.platform.engine.Filter.adaptFilter(Filter<V>, Function<T, V>)
```

--------------------------------

### Get Argument as String

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/aggregator/DefaultArgumentsAccessor

Retrieves the argument at the specified index as a String. This method converts the argument to its String representation, which can be useful for logging or when the argument is expected as text.

```java
String getString(int index)
```

--------------------------------

### Get All Parameter Declarations (Java)

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves all indexed parameter declarations from the `ParameterDeclarations` interface. The returned collection is never null and is sorted according to the parameter index.

```java
getAll()
```

--------------------------------

### GET /configuration/parameters/transformed

Source: https://docs.junit.org/current/api/org.junit.platform.engine/org/junit/platform/engine/support/config/PrefixedConfigurationParameters

Retrieves and transforms a configuration parameter using a provided transformer function. The lookup order is ConfigurationParameters, JVM system properties, and JUnit Platform properties file. Exceptions during transformation are wrapped in a JUnitException.

```APIDOC
## GET /configuration/parameters/transformed

### Description
Get and transform the configuration parameter stored under the specified `key` using the specified `transformer`. If no such key is present, an attempt will be made to look up the value as a JVM system property. If no such system property exists, an attempt will be made to look up the value in the JUnit Platform properties file. In case the transformer throws an exception, it will be wrapped in a `JUnitException` with a helpful message.

### Method
GET

### Endpoint
`/configuration/parameters/transformed`

### Parameters
#### Path Parameters
None

#### Query Parameters
- **key** (string) - Required - The key to look up; never null or blank
- **transformer** (Function<String, T>) - Required - The transformer to apply in case a value is found; never null

#### Request Body
None

### Request Example
```json
{
  "key": "example.transformed.key",
  "transformer": "function_to_transform_string_to_T"
}
```

### Response
#### Success Response (200)
- **value** (Optional<T>) - An Optional containing the transformed value; never null but potentially empty.

#### Response Example
```json
{
  "value": "transformed_value"
}
```
```

--------------------------------

### JupiterTestEngine: Get Artifact ID

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/JupiterTestEngine

Returns the artifact ID for the JUnit Jupiter engine, which is 'junit-jupiter-engine'. This identifies the specific artifact in a build system.

```java
public Optional<String> getArtifactId()
```

--------------------------------

### Configure JUnit Platform Reporting for Gradle (Kotlin)

Source: https://docs.junit.org/current/user-guide

Enables Open Test Reporting for Gradle using Kotlin DSL. It adds the junit-platform-reporting dependency and configures the test tasks to output reports to the same directory as Gradle's default XML reports.

```kotlin
dependencies {
    testRuntimeOnly("org.junit.platform:junit-platform-reporting:1.13.4")
}

tasks.withType<Test>().configureEach {
    val outputDir = reports.junitXml.outputLocation
    jvmArgumentProviders += CommandLineArgumentProvider {
        listOf(
            "-Djunit.platform.reporting.open.xml.enabled=true",
            "-Djunit.platform.reporting.output.dir=${outputDir.get().asFile.absolutePath}"
        )
    }
}
```

--------------------------------

### Get Argument as Integer

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/aggregator/DefaultArgumentsAccessor

Retrieves the argument at a specified index and attempts to convert it to an Integer. Automatic type conversion is handled. The index must be within bounds.

```java
public Integer getInteger(int index)
```

--------------------------------

### Loading Configuration from Multiple Properties Files with `@ConfigurationParametersResources`

Source: https://docs.junit.org/current/api/org.junit.platform.suite.api/org/junit/platform/suite/api/package-summary

The `@ConfigurationParametersResources` annotation acts as a container for multiple `@ConfigurationParametersResource` declarations, enabling the loading of configurations from several properties files.

```java
import org.junit.platform.suite.api.ConfigurationParametersResource;
import org.junit.platform.suite.api.ConfigurationParametersResources;

@ConfigurationParametersResources({
    @ConfigurationParametersResource(path = "config1.properties"),
    @ConfigurationParametersResource(path = "config2.properties")
})
public class MySuiteTest {}
```

--------------------------------

### Get Output Directory Provider

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/config/JupiterConfiguration

Retrieves the provider responsible for determining the output directory for test artifacts and reports. This is crucial for managing where test results and generated files are stored. Returns an OutputDirectoryProvider instance.

```java
OutputDirectoryProvider getOutputDirectoryProvider()
```

--------------------------------

### Get Test Instances with JupiterEngineExecutionContext

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/execution/class-use/JupiterEngineExecutionContext

These methods retrieve test instances using the Jupiter engine execution context. One overload uses only the context, while another also utilizes an ExtensionRegistry.

```java
default TestInstances TestInstancesProvider.getTestInstances(JupiterEngineExecutionContext context)
TestInstances TestInstancesProvider.getTestInstances(ExtensionRegistry extensionRegistry,  JupiterEngineExecutionContext executionContext)
```

--------------------------------

### TestIdentifier Accessor Methods

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/TestIdentifier

Documentation for methods that retrieve information about the TestIdentifier.

```APIDOC
## Methods: TestIdentifier Accessors

### Description
These methods provide access to the properties and characteristics of a `TestIdentifier`.

#### `getDisplayName()`
* **Description**: Get the display name of the represented test or container.
* **Method**: Instance Method
* **Return Type**: `String`

#### `getLegacyReportingName()`
* **Description**: Get the name of this identifier in a format that is suitable for legacy reporting infrastructure — for example, for reporting systems built on the Ant-based XML reporting format for JUnit 4.
* **Method**: Instance Method
* **Return Type**: `String`

#### `getParentId()`
* **Description**: Get the unique ID of this identifier's parent as a `String`, if available.
* **Method**: Instance Method
* **Return Type**: `Optional<String>`

#### `getParentIdObject()`
* **Description**: Get the unique ID of this identifier's parent as a `UniqueId`, if available.
* **Method**: Instance Method
* **Return Type**: `Optional<UniqueId>`

#### `getSource()`
* **Description**: Get the source of the represented test or container, if available.
* **Method**: Instance Method
* **Return Type**: `Optional<TestSource>`

#### `getTags()`
* **Description**: Get the set of tags associated with the represented test or container.
* **Method**: Instance Method
* **Return Type**: `Set<TestTag>`

#### `getType()`
* **Description**: Get the underlying descriptor type.
* **Method**: Instance Method
* **Return Type**: `TestDescriptor.Type`

#### `getUniqueId()`
* **Description**: Get the unique ID of the represented test or container as a `String`.
* **Method**: Instance Method
* **Return Type**: `String`

#### `getUniqueIdObject()`
* **Description**: Get the unique ID of the represented test or container as a `UniqueId`.
* **Method**: Instance Method
* **Return Type**: `UniqueId>`
```

--------------------------------

### Using Custom @JimfsTempDir Annotation in JUnit 5 Test

Source: https://docs.junit.org/current/user-guide

Demonstrates the practical application of the custom @JimfsTempDir annotation. This example shows a test method that uses the custom annotation to inject a temporary directory managed by the Jimfs in-memory file system.

```java
import org.junit.jupiter.api.Test;
import java.nio.file.Path;

class JimfsTempDirAnnotationDemo {

    @Test
    void test(@JimfsTempDir Path tempDir) {
        // perform test using the temporary directory provided by the custom annotation
        System.out.println("Temporary directory created via custom annotation: " + tempDir.toAbsolutePath());
    }

}
```

--------------------------------

### Get Display Name from ClassDescriptor

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/ClassDescriptor

Fetches the display name configured for the test class represented by this descriptor. The display name is used in test reporting and identification.

```java
String getDisplayName()
// Get the display name for this descriptor's class.
// Returns: the display name for this descriptor's class; never null or blank
```

--------------------------------

### Java Meta-Annotation Example for @BeforeParameterizedClassInvocation

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/BeforeParameterizedClassInvocation

Demonstrates how to create a custom composed annotation using @BeforeParameterizedClassInvocation as a meta-annotation. This allows for reusable custom annotations that inherit the behavior of @BeforeParameterizedClassInvocation.

```java
import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@BeforeParameterizedClassInvocation
public @interface MyCustomBeforeInvocation {
    // Inherits all semantics from @BeforeParameterizedClassInvocation
}
```

--------------------------------

### Get Classpath Resources (Java) - org.junit.platform.engine.discovery.ClasspathResourceSelector

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the selected classpath resources. This method is part of the discovery API for JUnit Platform and returns a collection of resources.

```Java
java.util.Set<java.lang.String> org.junit.platform.engine.discovery.ClasspathResourceSelector.getClasspathResources()
```

--------------------------------

### Create Test Instance using TestInstanceFactoryContext (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.api/org/junit/jupiter/api/extension/class-use/TestInstanceFactoryContext

This method is a callback for creating a test instance. It utilizes the TestInstanceFactoryContext and ExtensionContext to facilitate the creation process. This is part of the JUnit Jupiter API for writing extensions.

```java
Object TestInstanceFactory.createTestInstance(TestInstanceFactoryContext factoryContext, ExtensionContext extensionContext)
```

--------------------------------

### JupiterEngineDescriptor Methods (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/descriptor/JupiterEngineDescriptor

Provides methods for managing the execution context and configuration of the Jupiter engine. Includes methods to get the current configuration, determine the execution mode for parallel execution, prepare the execution context, and clean it up after execution.

```java
public JupiterConfiguration getConfiguration()

public Node.ExecutionMode getExecutionMode()

public JupiterEngineExecutionContext prepare(JupiterEngineExecutionContext context)

public void cleanUp(JupiterEngineExecutionContext context) throws Exception
```

--------------------------------

### JUnit Jupiter Extension2: BeforeEach and AfterEach Callbacks

Source: https://docs.junit.org/current/user-guide/index

Demonstrates the implementation of BeforeEachCallback and AfterEachCallback interfaces in JUnit Jupiter. This extension, similar to Extension1, logs calls to its lifecycle methods, contributing to the demonstration of wrapping behavior.

```java
import static example.callbacks.Logger.afterEachCallback;
import static example.callbacks.Logger.beforeEachCallback;

import org.junit.jupiter.api.extension.AfterEachCallback;
import org.junit.jupiter.api.extension.BeforeEachCallback;
import org.junit.jupiter.api.extension.ExtensionContext;

public class Extension2 implements BeforeEachCallback, AfterEachCallback {

    @Override
    public void beforeEach(ExtensionContext context) {
        beforeEachCallback(this);
    }

    @Override
    public void afterEach(ExtensionContext context) {
        afterEachCallback(this);
    }

}
```

--------------------------------

### Get Failures from Test Execution

Source: https://docs.junit.org/current/api/index-files/index-7

Provides an immutable list of failures encountered during the execution of a test plan. This is essential for analyzing test results and identifying issues.

```java
getFailures() - Method in interface org.junit.platform.launcher.listeners.TestExecutionSummary
    
Get an immutable list of the failures of the test plan execution.
```

--------------------------------

### JUnit 5: Create Event Started Condition

Source: https://docs.junit.org/current/api/index-files/index-19

Creates a condition to match `Event` objects of type `EventType.STARTED`. This is useful for filtering and asserting specific events during test execution.

```java
EventConditions.started()
```

--------------------------------

### newInstance

Source: https://docs.junit.org/current/api/org.junit.platform.commons/org/junit/platform/commons/support/ReflectionSupport

Creates a new instance of a given class with specified arguments.

```APIDOC
## newInstance

### Description
Creates a new instance of a given class using its constructor with provided arguments.

### Method
`POST` (assuming a RESTful interface, actual method depends on implementation)

### Endpoint
`/websites/junit_current/newInstance` (example endpoint)

### Parameters
#### Request Body
- **clazz** (Class<T>) - Required - the class for which to create an instance
- **args** (Object...) - Optional - the arguments to pass to the constructor

### Request Example
```json
{
  "clazz": "com.example.MyClass",
  "args": [
    "constructor_arg1",
    123
  ]
}
```

### Response
#### Success Response (200)
- **instance** (T) - the newly created instance of the specified class

#### Response Example
```json
{
  "message": "Instance created successfully"
}
```
```

--------------------------------

### JUnit Repeated Test Examples

Source: https://docs.junit.org/current/user-guide

Demonstrates various ways to use the @RepeatedTest annotation in JUnit to run test methods multiple times. Includes custom display names, German naming, and handling failures within repeated tests.

```java
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.RepetitionInfo;
import org.junit.jupiter.api.TestInfo;

class RepeatedTestsDemo {

    @RepeatedTest(value = 10, name = "{displayName} {currentRepetition}/{totalRepetitions}")
    @DisplayName("repeat test")
    void repeatedTest(TestInfo testInfo) {
        // ...
    }

    @RepeatedTest(5)
    void repeatedTestWithRepetitionInfo(RepetitionInfo repetitionInfo) {
        assertEquals(5, repetitionInfo.getTotalRepetitions());
    }

    @RepeatedTest(8)
    void repeatedTestWithFailureThreshold(RepetitionInfo repetitionInfo) {
        if (repetitionInfo.getCurrentRepetition() == 2 || repetitionInfo.getCurrentRepetition() == 4) {
            fail("Boom!");
        }
    }

    @RepeatedTest(value = 1, name = "{displayName} {currentRepetition}/{totalRepetitions}")
    @DisplayName("Repeat!")
    void customDisplayName(TestInfo testInfo) {
        assertEquals("Repeat! 1/1", testInfo.getDisplayName());
    }

    @RepeatedTest(value = 1, name = RepeatedTest.LONG_DISPLAY_NAME)
    @DisplayName("Details...")
    void customDisplayNameWithLongPattern(TestInfo testInfo) {
        assertEquals("Details... :: repetition 1 of 1", testInfo.getDisplayName());
    }

    @RepeatedTest(value = 5, name = "Wiederholung {currentRepetition} von {totalRepetitions}")
    void repeatedTestInGerman() {
        // ...
    }

}
```

--------------------------------

### Get Raw Configuration Parameter in JUnit Jupiter Configuration

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves a raw configuration parameter by its key. This method is available in caching and default implementations of JupiterConfiguration and the interface itself.

```java
getRawConfigurationParameter(String) - Method in class org.junit.jupiter.engine.config.CachingJupiterConfiguration
```

```java
getRawConfigurationParameter(String) - Method in class org.junit.jupiter.engine.config.DefaultJupiterConfiguration
```

```java
getRawConfigurationParameter(String) - Method in interface org.junit.jupiter.engine.config.JupiterConfiguration
```

--------------------------------

### Apply Configuration from Suite in JUnit 5

Source: https://docs.junit.org/current/api/index-files/index-1

Shows how to apply annotation-based configuration from a test suite class to a discovery request builder. This is part of the `SuiteLauncherDiscoveryRequestBuilder` in JUnit Platform.

```java
applyConfigurationParametersFromSuite(Class<?>) - Method in class org.junit.platform.suite.commons.SuiteLauncherDiscoveryRequestBuilder
    
    Apply a suite's annotation-based configuration to this builder.
```

--------------------------------

### Get Classpath Root URI (Java) - org.junit.platform.engine.discovery.ClasspathRootSelector

Source: https://docs.junit.org/current/api/index-files/index-7

Retrieves the selected classpath root directory as a URI. This method is part of the discovery API for JUnit Platform.

```Java
java.net.URI org.junit.platform.engine.discovery.ClasspathRootSelector.getClasspathRoot()
```

--------------------------------

### ArgumentsProvider Interface

Source: https://docs.junit.org/current/api/org.junit.jupiter.params/org/junit/jupiter/params/provider/ArgumentsProvider

This section details the ArgumentsProvider interface and its methods for providing arguments to parameterized tests.

```APIDOC
## ArgumentsProvider Interface

### Description
An `ArgumentsProvider` is responsible for providing a stream of arguments to be passed to a `@ParameterizedClass` or `@ParameterizedTest`. Implementations must provide a no-args constructor or a single unambiguous constructor to use parameter resolution.

### Parameters

#### Request Body
(Not applicable for interface definition)

### Request Example
(Not applicable for interface definition)

### Response
#### Success Response (200)
(Not applicable for interface definition)

#### Response Example
(Not applicable for interface definition)

## Method Summary

### provideArguments (Deprecated)

#### Description
Deprecated. Please implement `provideArguments(ParameterDeclarations, ExtensionContext)` instead.

#### Method
`default Stream<? extends Arguments>`

#### Endpoint
(Not applicable for interface method)

#### Parameters
- **context** (ExtensionContext) - Required - The current extension context; never `null`

#### Request Body
(Not applicable)

#### Response
- **Stream<? extends Arguments>** - A stream of arguments; never `null`

#### Request Example
(Not applicable)

#### Response Example
```java
// Example response structure (conceptual)
Stream<Arguments>
```

### provideArguments

#### Description
Provide a `Stream` of `Arguments` to be passed to a `@ParameterizedClass` or `@ParameterizedTest`.

#### Method
`default Stream<? extends Arguments>`

#### Endpoint
(Not applicable for interface method)

#### Parameters
- **parameters** (ParameterDeclarations) - Required - The parameter declarations for the parameterized class or test; never `null`
- **context** (ExtensionContext) - Required - The current extension context; never `null`

#### Request Body
(Not applicable)

#### Response
- **Stream<? extends Arguments>** - A stream of arguments; never `null`

#### Request Example
(Not applicable)

#### Response Example
```java
// Example response structure (conceptual)
Stream<Arguments>
```
```

--------------------------------

### Retrieve Duration from Execution (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Execution

Calculates and returns the `Duration` of the test execution. This is derived from the start and end instants and is a key metric for performance analysis.

```java
public Duration getDuration()
{
    // Implementation details...
    return null;
}
```

--------------------------------

### Get Additional Test Execution Listeners (Java)

Source: https://docs.junit.org/current/api/index-files/index-7

Returns a collection of `TestExecutionListener` instances to be added to the launcher for processing test execution events. This is specified in the `LauncherConfig` interface.

```java
getAdditionalTestExecutionListeners()
```

--------------------------------

### Get Default Temp Directory Cleanup Mode (Java)

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/config/CachingJupiterConfiguration

Retrieves the default mode for cleaning up temporary directories. This method is specified by the JupiterConfiguration interface.

```java
public CleanupMode getDefaultTempDirCleanupMode()
```

--------------------------------

### LauncherDiscoveryListener Interface

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/LauncherDiscoveryListener

The LauncherDiscoveryListener interface defines methods that can be implemented to receive notifications about the progress of test discovery.

```APIDOC
## Interface: LauncherDiscoveryListener

### Description
Register a concrete implementation of this interface with a `LauncherDiscoveryRequestBuilder` or `Launcher` to be notified of events that occur during test discovery. All methods in this interface have empty _default_ implementations. Concrete implementations may therefore override one or more of these methods to be notified of the selected events.

### Methods

#### `launcherDiscoveryStarted`

Called when test discovery is about to be started.

- **Method**: `default void launcherDiscoveryStarted(LauncherDiscoveryRequest request)`
- **Parameters**:
  - `request` (LauncherDiscoveryRequest) - Required - The request for which discovery is being started.
- **Since**: 1.8

#### `launcherDiscoveryFinished`

Called when test discovery has finished.

- **Method**: `default void launcherDiscoveryFinished(LauncherDiscoveryRequest request)`
- **Parameters**:
  - `request` (LauncherDiscoveryRequest) - Required - The request for which discovery has finished.
- **Since**: 1.8

#### `engineDiscoveryStarted`

Called when test discovery is about to be started for an engine.

- **Method**: `default void engineDiscoveryStarted(UniqueId engineId)`
- **Parameters**:
  - `engineId` (UniqueId) - Required - The unique ID of the engine descriptor.

#### `engineDiscoveryFinished`

Called when test discovery has finished for an engine.

- **Method**: `default void engineDiscoveryFinished(UniqueId engineId, EngineDiscoveryResult result)`
- **Parameters**:
  - `engineId` (UniqueId) - Required - The unique ID of the engine descriptor.
  - `result` (EngineDiscoveryResult) - Required - The discovery result of the supplied engine.
- **Exceptions**:
  - Exceptions thrown by implementations of this method will cause the complete test discovery to be aborted.

### Fields

#### `NOOP`

No-op implementation of `LauncherDiscoveryListener`.

- **Field**: `static final LauncherDiscoveryListener NOOP`
```

--------------------------------

### Theme Enum Constants (Java)

Source: https://docs.junit.org/current/api/org.junit.platform.console/org/junit/platform/console/options/class-use/Theme

Provides methods to access the constants of the Theme enum. This includes retrieving constants by name or charset, and getting all available constants.

```java
Theme.
valueOf(String name)
Theme.
valueOf(Charset charset)
Theme.
values()
```

--------------------------------

### Selecting Multiple Files with `@SelectFiles`

Source: https://docs.junit.org/current/api/org.junit.platform.suite.api/org/junit/platform/suite/api/package-summary

The `@SelectFiles` annotation acts as a container for multiple `@SelectFile` declarations, simplifying the selection of several specific files for the test suite.

```java
import org.junit.platform.suite.api.SelectFile;
import org.junit.platform.suite.api.SelectFiles;

@SelectFiles({
    @SelectFile("src/test/java/com/example/Test1.java"),
    @SelectFile("src/test/java/com/example/Test2.java")
})
public class MySuiteTest {}
```

--------------------------------

### Random Number Injection Demo

Source: https://docs.junit.org/current/user-guide/index

Provides an example class (RandomNumberDemo) showcasing the usage of the @Random composed annotation for injecting random numbers into static fields, instance fields, constructor parameters, and method parameters. It demonstrates the versatility of extensions for dependency injection.

```java
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class RandomNumberDemo {

    // Use static randomNumber0 field anywhere in the test class,
    // including @BeforeAll or @AfterEach lifecycle methods.
    @Random
    private static Integer randomNumber0;

    // Use randomNumber1 field in test methods and @BeforeEach
    // or @AfterEach lifecycle methods.
    @Random
    private int randomNumber1;

    RandomNumberDemo(@Random int randomNumber2) {
        // Use randomNumber2 in constructor.
    }

    @BeforeEach
    void beforeEach(@Random int randomNumber3) {
        // Use randomNumber3 in @BeforeEach method.
    }

    @Test
    void test(@Random int randomNumber4) {
        // Use randomNumber4 in test method.
    }

}
```

--------------------------------

### Prepare Extension Context for Test Method

Source: https://docs.junit.org/current/api/org.junit.jupiter.engine/org/junit/jupiter/engine/descriptor/TestMethodTestDescriptor

The `prepareExtensionContext` method is another protected helper that allows for the preparation of the `ExtensionContext` before the test method is executed. This is crucial for allowing extensions to interact with the test context.

```java
protected void
prepareExtensionContext(ExtensionContext extensionContext)
```

--------------------------------

### Get Aborted Executions in Java

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Executions

Filters and returns only the executions that were aborted. This is useful for identifying and handling unexpected terminations. It guarantees to return a non-null Executions object.

```java
public Executions aborted()
Get the aborted `Executions` contained in this `Executions` object.

Returns:
    the filtered `Executions`; never `null`
```

--------------------------------

### Count Executions in Java

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Executions

Returns the total number of executions contained within the Executions object. This provides a quick way to get the size of the execution collection.

```java
public long count()
Get the number of executions contained in this `Executions` object.
```

--------------------------------

### Get ParameterInfo from ExtensionContext (Java)

Source: https://docs.junit.org/current/api/index-files/index-7

A static method within `ParameterInfo` interface that retrieves the nearest `ParameterInfo` instance from an `ExtensionContext`. It may return null if no such instance is found.

```java
get(ExtensionContext context)
```

--------------------------------

### Add Launcher Discovery Listeners with LauncherConfig.Builder

Source: https://docs.junit.org/current/api/org.junit.platform.launcher/org/junit/platform/launcher/core/class-use/LauncherConfig

Demonstrates adding multiple LauncherDiscoveryListener instances to the configuration. These listeners are notified during the test discovery phase.

```java
LauncherConfig.Builder builder = LauncherConfig.builder();
builder.addLauncherDiscoveryListeners(listener1, listener2);
```

--------------------------------

### Get Executions as Stream in Java

Source: https://docs.junit.org/current/api/org.junit.platform.testkit/org/junit/platform/testkit/engine/Executions

Retrieves all recorded executions as a Stream. This method is useful for functional-style operations on the execution data. It guarantees to return a non-null stream.

```java
public Stream<Execution> stream()
Get the executions as a `Stream`.

Returns:
    the stream of executions; never `null`
```