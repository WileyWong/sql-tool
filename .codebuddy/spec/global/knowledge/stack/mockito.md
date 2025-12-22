### Mockito Versioning Scheme Example

Source: https://github.com/mockito/mockito/wiki/Semantic-Versioning

Illustrates the format and compatibility of Mockito's semantic versioning, including beta and release candidate tags. This helps understand version progression and potential binary incompatibilities.

```text
major.minor.patch-tag.tagVersion

Examples:
* 2.0.0 and 2.0.0-beta.5 are binary incompatible with 1.10.19.
* 2.0.0-beta.5 is the fifth release beta of version 2.0.0.
* 2.0.0-beta.5 could be (but is not necessarily) binary incompatible with version 2.0.0.
* 2.0.0-RC.1 is binary compatible with release 2.0.0.

Version progression example:
2.0.111-beta < 2.0.0-beta.112 < 2.0.0-RC.1 < 2.0.0-beta.200 < 2.0.0
```

--------------------------------

### Using Mockito's @Mock Annotation for Test Setup

Source: https://github.com/mockito/mockito/wiki/Features-And-Motivations

This snippet demonstrates the basic usage of Mockito's `@Mock` annotation to create mock objects. The `@Mock` annotation simplifies the setup process by automatically creating mock instances for the annotated fields. These mocks are then available for use in test methods.

```java
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ExampleTest {

    @Mock
    private Dependency dependency;

    @Test
    void testMethod() {
        // Arrange
        // Mock is automatically created by @Mock annotation

        // Act
        // Example: Call a method on the system under test that uses the dependency
        // systemUnderTest.performAction(dependency);

        // Assert
        // Verify that a method on the mock was called
        // verify(dependency).someMethod("some argument");
    }
}

// Assume Dependency is an interface or class used by your system under test.
interface Dependency {
    void someMethod(String arg);
}
```

--------------------------------

### Build Mockito Locally with Gradle

Source: https://github.com/mockito/mockito/blob/main/README.md

This command is used to build the Mockito project locally. It requires Gradle to be installed and configured on your system. The output will be the compiled project files.

```shell
./gradlew build
```

--------------------------------

### JUnit 5 Extension for Mockito (Java)

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

Provides an example of using a third-party JUnit 5 extension (`MockitoExtension`) to integrate Mockito with JUnit 5. This allows for injecting mocks into test classes and setup methods via annotations like `@Mock` and `@ExtendWith`.

```java
@ExtendWith(MockitoExtension.class)
class MockitoExtensionInBaseClassTest {

  @Mock private NumberGenerator numberGenerator;
  @BeforeEach void set_stubs(@Mock MyType myType, TestInfo testInfo) {
      // do some stubs
  }

  @Test
  void firstTestWithInjectedMock(@Mock MyType myType) {
      // play with mock
  }
}
```

--------------------------------

### Mockito Versioning Scheme Example

Source: https://github.com/mockito/mockito/wiki/Continuous-Delivery-Details

Illustrates the versioning scheme used by Mockito, particularly the format for build numbers within major versions and beta releases. This scheme evolved to accommodate continuous delivery practices.

```text
1.10.<build number>

2.0.<build number>-beta

1.10.19 < 2.0.0-beta < 2.0.1-beta < 2.0.111-beta < 2.1.0-beta.112 < 2.1.0 < 2.2.0.beta.1 < 2.2.0 < ...
```

--------------------------------

### Mockito - Add EditorConfig for Code Style

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This improvement, referenced by pull request #966, adds an EditorConfig file to the project. This helps ensure that all contributors adhere to a consistent code style guide automatically.

```editorconfig
/*
 * Add editor config to automatically adhere to code style guide [(#966)]
 */
[*] 
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.java] 
indent_style = space
indent_size = 4
```

--------------------------------

### Example: Mocking a Final Class and Method with Mockito

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

Demonstrates how to mock a final class and its final method after enabling the opt-in feature. It shows mocking the `FinalClass` and stubbing its `finalMethod` to return a different value than the original concrete instance.

```java
final class FinalClass {
  final String finalMethod() { return "something"; }
}

FinalClass concrete = new FinalClass(); 

FinalClass mock = mock(FinalClass.class);
given(mock.finalMethod()).willReturn("not anymore");

assertThat(mock.finalMethod()).isNotEqualTo(concrete.finalMethod());
```

--------------------------------

### Mockito - Javadoc Example Compilation Fix

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This improvement, referenced by issue #952, addresses a compilation error in a Javadoc code example for Answer1. This ensures that the provided examples in the documentation are correct and functional.

```java
/**
 * Javadoc, Answer1 code example does not compile. [(#952)]
 */
// No direct code snippet, but implies a fix in a Javadoc example.
```

--------------------------------

### Improved BDDMockito API (Java)

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

Showcases the enhanced `BDDMockito` API, which now better mirrors the `when/then` stubbing API and provides augmented BDD-style verification methods. Examples include `then(mock).should().doSomething()` and checking for zero interactions.

```java
BDDMockito.then(mock).should(inOrder).doSomething();
BDDMockito.then(mock).shouldHaveZeroInteractions();
BDDMockito.then(person).shouldHaveNoMoreInteractions();
```

--------------------------------

### Using Mockito @Spy for Dummy Objects

Source: https://github.com/mockito/mockito/wiki/Using-Spies-(and-Fakes)

Illustrates using Mockito's @Spy annotation as a field for dummy objects. This is a concise alternative when dummy objects are stateless and simplifies setup.

```java
@Spy private DummySubModel subModel;

... // in test method
Model model = mock(Model.class);
when(model.getSubModel()).thenReturn(subModel);
...

static abstract class DummySubModel implements SubModel {
  @Override public String getName() {
    return "anything but null";
  }
}
```

--------------------------------

### Mockito - Use Constructor with Arguments

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This code example illustrates how to utilize constructor arguments when creating mocks with Mockito, addressing feature request #935. This allows for more control over mock object initialization, especially when constructors require specific parameters.

```java
/**
 * New feature - enable mocking using constructor arguments.
 */
@Test
public void should_allow_mocking_with_constructor_arguments() {
    MyClass mock = Mockito.mock(MyClass.class, Mockito.withSettings().useConstructor(1, "test").defaultAnswer(invocation -> null));
    // Further assertions or interactions with the mock can be added here
}
```

--------------------------------

### Mockito JUnit Rule for Stub Detection (Java)

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

Shows how to use Mockito JUnit rules to manage unused stub detection. It includes examples for both enabling the default detection behavior and configuring a silent mode.

```java
// detect unused stubs
@Rule public MockitoRule mrule = MockitoJUnit.rule();

// don't warn user about misusage, old behaviour
@Rule public MockitoRule mrule = MockitoJUnit.rule()
                                             .silent();
```

--------------------------------

### Mockito InOrder with atLeast() and times()

Source: https://github.com/mockito/mockito/wiki/Greedy-algorithm-of-verification-InOrder

Shows examples of using `atLeast()` and `times()` with Mockito's InOrder verification. It highlights that `atLeast(2)` might not fit the greedy paradigm as cleanly as `times(2)` when multiple identical calls occur.

```java
mock.add("A");
mock.add("A");
mock.add("B");
mock.add("A");
```

```java
//fails:
inOrder.verify(mock, atLeast(2)).add("A");
inOrder.verify(mock, atLeast(1)).add("B");

//passes:
inOrder.verify(mock, times(2)).add("A");
inOrder.verify(mock, atLeast(1)).add("B");
```

--------------------------------

### Custom Answers with AdditionalAnswers (Java)

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

Presents how to use `AdditionalAnswers` in Mockito to create custom answers, including Java 8 friendly lambda expressions. The example shows an answer that returns the string representation of the argument.

```java
AdditionalAnswers.answer(arg1 -> arg1.toString())
```

--------------------------------

### Using Mockito Argument Matchers for Flexible Verification

Source: https://github.com/mockito/mockito/wiki/Features-And-Motivations

This example showcases the use of Mockito's argument matchers, such as `anyString()` and `anyObject()`, for flexible verification of method calls. Argument matchers allow you to specify conditions for arguments rather than requiring exact matches, which is useful when the exact argument value is not important or is hard to predict. Mockito also supports custom and Hamcrest matchers.

```java
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ArgumentMatcherExampleTest {

    @Mock
    private Processor processor;

    @Test
    void testAnyStringMatcher() {
        // Arrange
        // Stubbing with a matcher
        when(processor.processData(Mockito.anyString())).thenReturn("Processed");

        // Act
        String result = processor.processData("some input string");

        // Assert
        // verify(processor).processData(Mockito.anyString()); // Verifying with matcher
        // assertEquals("Processed", result);
    }

    @Test
    void testRefEqMatcher() {
        // Arrange
        MyObject obj1 = new MyObject("val1");
        MyObject obj2 = new MyObject("val1"); // Same content as obj1

        // Stubbing using refEq for content-based matching
        when(processor.processObject(Mockito.refEq(obj1))).thenReturn("Matched");

        // Act
        String result = processor.processObject(obj2);

        // Assert
        // verify(processor).processObject(Mockito.refEq(obj1));
        // assertEquals("Matched", result);
    }
}

interface Processor {
    String processData(String data);
    String processObject(MyObject obj);
}

class MyObject {
    private String value;

    public MyObject(String value) {
        this.value = value;
    }

    // Getters and setters, equals/hashCode if needed for other contexts
}
```

--------------------------------

### Mockito Greedy InOrder Verification Example

Source: https://github.com/mockito/mockito/wiki/Greedy-algorithm-of-verification-InOrder

Demonstrates the 'greedy' behavior of Mockito's InOrder verification with simple method calls. It shows how `times(2)` correctly passes when the method is called twice, contrasting with a non-greedy approach.

```java
mock.foo();
mock.foo();
mock.bar();
```

```java
//greedy algorithm (Mockito way):
inOrder.verify(mock, times(2)).foo(); //pass - I'm greedy - called 2 times, must be times(2)
inOrder.verify(mock, times(1)).bar(); //pass

//non-greedy algorithm allows this:
inOrder.verify(mock, times(1)).foo(); //pass - I'm not greedy, one instance is enough
inOrder.verify(mock, times(1)).bar(); //pass
```

--------------------------------

### Mockito JUnit Runner for Stub Detection (Java)

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

Illustrates how to configure the Mockito JUnit runner to detect unused stubs. It provides examples for both enabling and disabling this feature using `MockitoJUnitRunner` and `MockitoJUnitRunner.Silent`.

```java
// detect unused stubs
@RunWith(MockitoJUnitRunner.class)

// don't detect, old behaviour
@RunWith(MockitoJUnitRunner.Silent.class)
```

--------------------------------

### Non-Greedy Algorithm Bug Example

Source: https://github.com/mockito/mockito/wiki/Greedy-algorithm-of-verification-InOrder

Illustrates a theoretical scenario where a non-greedy algorithm fails to detect a bug (double entity save) while Mockito's greedy algorithm correctly identifies the issue.

```java
//production code:
service.saveEntity();
service.commit();

//test:
inOrder.verify(service, times(1)).saveEntity(); //this has to happen *once*
inOrder.verify(service, times(1)).commit();
```

```java
//production code:
service.saveEntity();
service.saveEntity(); // <<-- dev introduces bug: saving the entity twice leads to runtime exception
service.commit();

//non-greedy algorithm does not detect the bug and the *test passes*
inOrder.verify(service, times(1)).saveEntity(); // <<-- passes in non-greedy mode
inOrder.verify(service).commit();

//greedy algorithm *detects the bug*
inOrder.verify(service, times(1)).saveEntity(); // <<-- fails in greedy mode
inOrder.verify(service).commit();
```

--------------------------------

### Get Mock Stubbing Statements (Java)

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

This code snippet demonstrates how to access stubbing statements for a mock object using Mockito's mockingDetails API. This allows inspection of configured stubs, such as those created with `given(...).when(...)` or `when(...).then(...)`.

```java
Mockito.mockingDetails(a_mock).getStubbing()
```

--------------------------------

### Get Mock Method Invocations (Java)

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

This code snippet shows how to retrieve details about mock method invocations using Mockito's mockingDetails API. It's part of a set of new APIs for advanced framework integrations.

```java
Mockito.mockingDetails(a_mock).printInvocations()
```

--------------------------------

### Mockito - Inline Mocking with Interface Default Methods

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This example addresses issue #944 where Mockito would throw an exception when mocking an interface with a default method while inline mocking was enabled. This fix ensures seamless mocking of such interfaces.

```java
/**
 * With Inline Mocking enabled, Mockito throws when mocking interface with default method.
 */
@Test
public void should_handle_interface_with_default_method_when_inline_mocking_enabled() {
    MyInterfaceWithDefaultMethod mock = Mockito.mock(MyInterfaceWithDefaultMethod.class);
    Mockito.when(mock.getSomeValue()).thenReturn("test");
    assertEquals("test", mock.getSomeValue());
}
```

--------------------------------

### Java Mockito Unfinished Stubbing and Verification Errors

Source: https://github.com/mockito/mockito/wiki/FAQ

Examples of incorrect usage in Mockito that lead to unfinished stubbing or verification errors. These snippets highlight common mistakes like forgetting `thenReturn()`, placing the verified method call inside `verify()`, or forgetting to specify the method to verify. Mockito throws exceptions to catch these errors, sometimes in subsequent tests.

```java
  //Oups, someone forgot thenReturn() part:
  when(mock.get());

  //Oups, someone put the verified method call inside verify() where it should be outside:
  verify(mock.execute());

  //Oups, someone has used EasyMock for too long and forgot to specify the method to verify:
  verify(mock);
```

--------------------------------

### Stubbing Mockito Mocks for Controlled Behavior

Source: https://github.com/mockito/mockito/wiki/Features-And-Motivations

This example shows how to stub methods on a Mockito mock object to define its return values or behavior when called. Stubbing is crucial for isolating the system under test by controlling the responses from its dependencies. This is typically done before executing the code that depends on the mock.

```java
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StubbingExampleTest {

    @Mock
    private Service service;

    @Test
    void testStubbing() {
        // Arrange: Stub the behavior of the mock
        when(service.getData()).thenReturn("Mocked Data");

        // Act: Call a method that uses the stubbed service
        String result = service.getData();

        // Assert: Verify the result matches the stubbed behavior
        // assertEquals("Mocked Data", result);
    }
}

interface Service {
    String getData();
}
```

--------------------------------

### Mockito - Spying on Interfaces for Java 8 Default Methods

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This example demonstrates how Mockito allows spying on interfaces, making it convenient to work with Java 8 default methods, as addressed in pull request #942. This feature enhances Mockito's compatibility with modern Java features.

```java
/**
 * Allow spying on interfaces so that it is convenient to work with Java 8 default methods.
 */
@Test
public void should_allow_spying_on_interface_with_default_methods() {
    MyInterface mock = Mockito.spy(MyInterface.class);
    Mockito.when(mock.defaultMethod()).thenReturn("mocked");
    assertEquals("mocked", mock.defaultMethod());
}
```

--------------------------------

### Basic Mocking with Mockito

Source: https://github.com/mockito/mockito/wiki/Mockito-vs-EasyMock

Illustrates basic mock creation, stubbing, and verification using Mockito. It highlights the 'when-then' syntax for stubbing and explicit verification calls.

```java
import static org.mockito.Mockito.*;

List mock = mock(List.class);

when(mock.get(0)).thenReturn("one");
when(mock.get(1)).thenReturn("two");

someCodeThatInteractsWithMock();

verify(mock).clear();
```

--------------------------------

### Basic Mocking with EasyMock

Source: https://github.com/mockito/mockito/wiki/Mockito-vs-EasyMock

Demonstrates basic mock creation, stubbing, and verification using EasyMock. It shows how to define expected method calls and their return values before replaying the mock and verifying interactions.

```java
import static org.easymock.classextension.EasyMock.*;

List mock = createNiceMock(List.class);

expect(mock.get(0)).andStubReturn("one");
expect(mock.get(1)).andStubReturn("two");
mock.clear();

replay(mock);

someCodeThatInteractsWithMock();

verify(mock);
```

--------------------------------

### Tag and Push Git Repository for Release

Source: https://github.com/mockito/mockito/blob/main/README.md

This snippet demonstrates how to create an annotated Git tag and push it to the origin repository to initiate a release. Ensure you replace 'v3.4.5' with the desired version number.

```shell
git tag -a -m "Release 3.4.5" v3.4.5
git push origin v3.4.5
```

--------------------------------

### Kotlin Mock Creation in Mockito

Source: https://github.com/mockito/mockito/wiki/Mockito-for-Kotlin

Demonstrates how to create mock objects in Kotlin using Mockito's syntax. It shows basic mock creation and how to configure mocks with stub-only settings.

```kotlin
val mock = mock<MyClass> {
    when { getText() } thenReturn "text"
    given { getText() } willReturn "text"
}
val mock = mock<MyClass>(withSettings().stubOnly()) {
    //...
}
```

--------------------------------

### Exact Verification Counts and Argument Matchers with EasyMock

Source: https://github.com/mockito/mockito/wiki/Mockito-vs-EasyMock

Shows how to specify the exact number of times a method should be called and use general argument matchers like `anyObject()` with EasyMock. It also demonstrates verifying with `atLeastOnce()`.

```java
List mock = createNiceMock(List.class);

mock.clear();
expectLastCall().times(3);

expect(mock.add(anyObject())).andReturn(true).atLeastOnce();

replay(mock);

someCodeThatInteractsWithMock();

verify(mock);
```

--------------------------------

### Exact Verification Counts and Argument Matchers with Mockito

Source: https://github.com/mockito/mockito/wiki/Mockito-vs-EasyMock

Demonstrates verifying method calls for a specific number of times (`times()`) and using argument matchers like `anyObject()` with Mockito. It also includes `atLeastOnce()` verification.

```java
List mock = mock(List.class);

someCodeThatInteractsWithMock();

verify(mock, times(3)).clear();
verify(mock, atLeastOnce()).add(anyObject());
```

--------------------------------

### Accessing Mock Creation Settings (Java)

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

Details how to access the detailed settings of a mock object using `Mockito.mockingDetails(mock).getMockCreationSettings()`. This provides advanced users with insights into how mocks were configured.

```java
Mockito.mockingDetails(mock).getMockCreationSettings()
```

--------------------------------

### Migration: argThat and charThat from Matchers to MockitoHamcrest

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

Demonstrates how to update calls from the deprecated `Matchers.argThat()` and `Matchers.charThat()` to their new equivalents in `MockitoHamcrest` to maintain compatibility with Mockito 2. This change is necessary because `Matchers` no longer directly supports Hamcrest matchers.

```java
  // Change these 

  Matchers.argThat()
  Matchers.charThat()
  // similar hamcrest method
```

```java
  // to 

  MockitoHamcrest.argThat()
  MockitoHamcrest.charThat()
  // similar hamcrest method
```

--------------------------------

### Verify Method Call: Mockito vs. RMock

Source: https://github.com/mockito/mockito/wiki/Mockito-VS-RMock

Demonstrates how to verify if a method was called on a mock object. RMock uses a 'startVerification' approach, while Mockito directly uses the 'verify' method after the action.

```java
//RMock:
Runnable runnable = (Runnable)mock(Runnable.class);
runnable.run();
startVerification();
//run
```

```java
//Mockito:
Runnable runnable = mock(Runnable.class);
//run
verify(runnable).run();
```

--------------------------------

### JUnit 5 Mockito Extension for Mock Creation

Source: https://github.com/mockito/mockito/wiki/Related-Projects

The JUnit 5 Mockito extension simplifies mock creation and injection into test methods and setup/teardown phases. It requires the JUnit 5 Jupiter API and Mockito dependencies. It automatically initializes mocks annotated with @Mock.

```java
@ExtendWith(MockitoExtension.class)
class MockitoExtensionInBaseClassTest {

	@Mock
	private NumberGenerator numberGenerator;

	@BeforeEach
	void initialize(@Mock MyType myType, TestInfo testInfo) {
		when(myType.getName()).thenReturn(testInfo.getDisplayName());
		when(numberGenerator.next()).thenReturn(42);
	}

	@Test
	void firstTestWithInjectedMock(@Mock MyType myType) {
		assertEquals("firstTestWithInjectedMock(MyType)", myType.getName());
		assertEquals(42, numberGenerator.next());
	}
}
```

--------------------------------

### Flexible Argument Matching: Mockito vs. RMock

Source: https://github.com/mockito/mockito/wiki/Mockito-VS-RMock

Compares flexible argument matching for method calls. RMock uses 'is.ANYTHING' and 'is.AS_RECORDED', while Mockito utilizes Hamcrest matchers like 'anyString()' and 'eq()'.

```java
//RMock:
mock.twoArguments("anything", someObj);
modify().args(is.ANYTHING, is.AS_RECORDED);
startVerification();
//run
```

```java
//Mockito:
//run
verify(mock).twoArguments(anyString(), eq(someObj));
```

--------------------------------

### Create Factory Methods for Value Objects - Java

Source: https://github.com/mockito/mockito/wiki/How-to-write-good-tests

Illustrates the creation of static factory methods within a dedicated class to simplify the instantiation of complex value objects for testing. This promotes cleaner and more readable test fixtures by encapsulating the object creation logic.

```java
final class CustomerCreations {
   private CustomerCreations() {}
   public static Customer customer_with_a_single_item_in_the_basket() {
	   // long init sequence
   }
}
```

--------------------------------

### Mockito - Enable Local Testing of Release Tools

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This improvement, referenced by pull request #968, enables local testing of the release tools. This streamlines the release process by allowing developers to test tools on their local machines before deploying.

```bash
/*
 * Enabled local testing of release tools [(#968)]
 */
// This implies configuration changes in build scripts or CI/CD pipelines.
```

--------------------------------

### Java: Basic Mockito Usage for Stubbing and Verification

Source: https://github.com/mockito/mockito/wiki/Home

Demonstrates the basic usage of Mockito in Java for creating mocks, stubbing method calls to return specific values, and verifying that methods were invoked on the mock object. This is essential for isolating code under test.

```java
import static org.mockito.Mockito.*;

// You can mock concrete classes and interfaces
TrainSeats seats = mock(TrainSeats.class);

// stubbing appears before the actual execution
when(seats.book(Seat.near(WINDOW).in(FIRST_CLASS))).thenReturn(BOOKED);

// the following prints "BOOKED"
System.out.println(seats.book(Seat.near(WINDOW).in(FIRST_CLASS)));

// the following prints "null" because 
// .book(Seat.near(AISLE).in(FIRST_CLASS))) was not stubbed
System.out.println(seats.book(Seat.near(AISLE).in(FIRST_CLASS)));

// the following verification passes because 
// .book(Seat.near(WINDOW).in(FIRST_CLASS)) has been invoked
verify(seats).book(Seat.near(WINDOW).in(FIRST_CLASS));

// the following verification fails because 
// .book(Seat.in(SECOND_CLASS)) has not been invoked
verify(seats).book(Seat.in(SECOND_CLASS));
```

--------------------------------

### Interactive Rebase - Git Bash

Source: https://github.com/mockito/mockito/wiki/Using-git-to-prepare-your-PR-to-have-a-clean-history

Initiates an interactive rebase session for a specified number of recent commits. This enables granular control over each commit, allowing actions like 'pick', 'fixup', and 'squash'.

```bash
git rebase --interactive HEAD~7
```

--------------------------------

### Enable Mocking of Final Classes/Methods in Mockito

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

This configuration enables Mockito's incubating feature to mock final classes and methods. It requires creating a specific file within the `mockito-extensions` directory. This approach uses a new engine for mock creation.

```text
mock-maker-inline
```

--------------------------------

### Creating Dummy Objects with Mockito spy()

Source: https://github.com/mockito/mockito/wiki/Using-Spies-(and-Fakes)

Demonstrates how to create dummy objects using Mockito's spy() method, which minimizes caveats compared to returning mocks from helper methods. This approach avoids the 'unfinished stubbing' error.

```java
Model model = mock(Model.class);
when(model.getSubModel()).thenReturn(dummySubModel());

private SubModel dummySubModel() {
  return spy(DummySubModel.class);
}

static abstract class DummySubModel implements SubModel {
  @Override public String getName() {
    return "anything but null";
  }
  // other dummy states...
}
```

--------------------------------

### Mockito InOrder with Argument Matchers

Source: https://github.com/mockito/mockito/wiki/Greedy-algorithm-of-verification-InOrder

Demonstrates how Mockito's greedy InOrder verification interacts with argument matchers like `startsWith()`. It shows that only the verification adhering to the exact number of calls (times(2)) passes, reinforcing the greedy approach's consistency.

```java
mock.add("10 EURO");
mock.add("10 GBP");
mock.add("20 GBP");
```

```java
//non-greedy - passes:
inOrder.verify(mock, times(1)).add(startsWith("10"));
inOrder.verify(mock).add(startsWith("20"));

//non-greedy - also passes:
inOrder.verify(mock, times(2)).add(startsWith("10"));
inOrder.verify(mock).add(startsWith("20"));
```

```java
//In Mockito only this passes:
inOrder.verify(mock, times(2)).add(startsWith("10"));
inOrder.verify(mock).add(startsWith("20"));
```

--------------------------------

### Verification in Order with Mockito

Source: https://github.com/mockito/mockito/wiki/Mockito-vs-EasyMock

Demonstrates how to verify the order of method calls on mocks using Mockito's `InOrder` class. This allows for strict sequencing checks in tests.

```java
List one = mock(List.class);
List two = mock(List.class);

someCodeThatInteractsWithMocks();

InOrder inOrder = inOrder(one, two);
                                                          
inOrder.verify(one).add("one");
inOrder.verify(two).add("two");
```

--------------------------------

### IDE Regex: argThat import migration

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

A regular expression to assist in migrating `argThat` imports. It changes the import statement from `org.mockito.(Mockito|Matchers).argThat` to `org.mockito.hamcrest.MockitoHamcrest.argThat`, reflecting the API changes in Mockito 2.

```regex
replace `import (.*) org.mockito.(Mockito|Matchers).argThat;` with `import $1 org.mockito.hamcrest.MockitoHamcrest.argThat;`
```

--------------------------------

### Mockito ArgumentCaptor for Varargs

Source: https://github.com/mockito/mockito/wiki/Draft-Mockito-5-release-notes

Illustrates the updated usage of ArgumentCaptor in Mockito 5 for capturing varargs. It explains how to capture a single string argument versus capturing all string arguments.

```java
// Will capture 1 string
@Captor private ArgumentCaptor<String> captor;
// Will capture all strings
@Captor private ArgumentCaptor<String[]> captor;
```

--------------------------------

### Set Return Value: Mockito vs. RMock

Source: https://github.com/mockito/mockito/wiki/Mockito-VS-RMock

Illustrates how to configure a mock object to return a specific value when a method is called. RMock uses a 'modify().returnValue()' approach, whereas Mockito uses the 'when().thenReturn()' syntax.

```java
//RMock:
mock.getStuff();
modify().returnValue(stuff);
startVerification();
//run
```

```java
//Mockito:
when(mock.getStuff()).thenReturn(stuff);
//run
```

--------------------------------

### Mockito Varargs Matching with Exact Argument Counts

Source: https://github.com/mockito/mockito/wiki/Draft-Mockito-5-release-notes

Demonstrates how to use Mockito's new 'type' method to match varargs calls with a specific number of arguments. Previously, matching exact counts was difficult with varargs.

```java
long call(String... args);

// Will match calls with exactly zero arguments:
when(mock.call()).thenReturn(0L);

// Will match calls with exactly two arguments:
when(mock.call(any(), any())).thenReturn(0L);

// Match any number of arguments:
when(mock.call(any(String[].class))).thenReturn(1L);
// Match invocations with no arguments:
when(mock.call()).thenReturn(1L);
// Match invocations with exactly one argument:
when(mock.call(any())).thenReturn(1L);
// Alternative to match invocations with exactly one argument:
when(mock.call(any(String.class))).thenReturn(1L);
// Match invocations with exactly two arguments:
when(mock.call(any(), any())).thenReturn(1L);
```

--------------------------------

### Implementing Custom ArgumentMatcher with Varargs Support

Source: https://github.com/mockito/mockito/wiki/Draft-Mockito-5-release-notes

This demonstrates how to implement a custom ArgumentMatcher with the new 'type()' method, enabling support for varargs. This allows for more targeted argument matching in Mockito tests.

```java
import org.mockito.ArgumentMatcher;

// Example of a custom ArgumentMatcher that supports varargs
public class MyVarargMatcher implements ArgumentMatcher<String[]> {

    private final String[] expectedArgs;

    public MyVarargMatcher(String... expectedArgs) {
        this.expectedArgs = expectedArgs;
    }

    @Override
    public boolean matches(String[] actualArgs) {
        if (actualArgs == null) {
            return expectedArgs == null;
        }
        if (expectedArgs == null || actualArgs.length != expectedArgs.length) {
            return false;
        }
        for (int i = 0; i < actualArgs.length; i++) {
            if (!actualArgs[i].equals(expectedArgs[i])) {
                return false;
            }
        }
        return true;
    }

    @Override
    public String toString() {
        return "expected: " + java.util.Arrays.toString(expectedArgs);
    }

    // The new type() method is implicitly handled by the JVM for functional interfaces
    // or can be explicitly provided if needed in more complex scenarios.
    // For this functional interface, the compiler infers the type.
}
```

```java
// Usage example:
// import static org.mockito.Mockito.*;
// import static org.mockito.ArgumentMatchers.*;

// SomeService service = mock(SomeService.class);
// when(service.processItems(anyVararg())).thenAnswer(invocation -> {
//     String[] items = invocation.getArgument(0);
//     System.out.println("Received items: " + java.util.Arrays.toString(items));
//     return null;
// });

// Example of mocking a method with varargs using the custom matcher
// service.processItems("apple", "banana", "cherry"); 
// verify(service).processItems(argThat(new MyVarargMatcher("apple", "banana", "cherry")));
```

--------------------------------

### Maven Dependency for Weak Lock-Free Hash Map

Source: https://github.com/mockito/mockito/blob/main/mockito-core/src/main/java/org/mockito/internal/util/concurrent/README.md

This XML snippet shows how to add the weak-lock-free library as a dependency to a Maven project. It specifies the group ID, artifact ID, and version for the library.

```xml
<dependency>
  <groupId>com.blogspot.mydailyjava</groupId>
  <artifactId>weak-lock-free</artifactId>
  <version>0.11</version>
</dependency>
```

--------------------------------

### Java: BDD Style Mockito Usage with given() and then()

Source: https://github.com/mockito/mockito/wiki/Home

Illustrates the Behavior-Driven Development (BDD) style of using Mockito in Java, employing `given()` for stubbing and `then()` for verification. This style can improve readability for tests that follow a given-when-then structure.

```java
import static org.mockito.BDDMockito.*;

// You can mock concrete classes and interfaces
TrainSeats seats = mock(TrainSeats.class);

// stubbing appears before the actual execution
given(seats.book(Seat.near(WINDOW).in(FIRST_CLASS))).willReturn(BOOKED);

// the following prints "BOOKED"
System.out.println(seats.book(Seat.near(WINDOW).in(FIRST_CLASS)));

// the following prints "null" because 
// .book(Seat.near(AISLE).in(FIRST_CLASS))) was not stubbed
System.out.println(seats.book(Seat.near(AISLE).in(FIRST_CLASS)));

// the following verification passes because 
// .book(Seat.near(WINDOW).in(FIRST_CLASS)) has been invoked
then(seats).should().book(Seat.near(WINDOW).in(FIRST_CLASS));

// the following verification fails because 
// .book(Seat.in(SECOND_CLASS)) has not been invoked
then(seats).should().book(Seat.in(SECOND_CLASS));
```

--------------------------------

### IDE Regex: Simplified getArgumentAt to getArgument migration

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

A simpler regular expression for IDEs to migrate from `getArgumentAt` to `getArgument`. This pattern focuses on extracting the argument index for the new method signature, useful for cases where explicit type casting is not directly inferred by the regex.

```regex
replace `.getArgumentAt[(]([a-zA-Z0-9]*),.*?[)]` with `.getArgument($1)`
```

--------------------------------

### IDE Regex: MockitoJUnitRunner import migration

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

Provides a regular expression for IDEs (IntelliJ, Eclipse) to automatically update the import statement for `MockitoJUnitRunner` from the old `org.mockito.runners` package to the new `org.mockito.junit` package.

```regex
replace `import org.mockito.runners.MockitoJUnitRunner;` with `import org.mockito.junit.MockitoJUnitRunner;`
```

--------------------------------

### Kotlin Stubbing and Verification in Mockito

Source: https://github.com/mockito/mockito/wiki/Mockito-for-Kotlin

Illustrates how to define stubbed return values for methods and verify method invocations on Kotlin mocks using Mockito.

```kotlin
given(mock.foo(argThat { x < 100 })).willReturn("x")

verify {
  mock.foo(any())
  mock.bar()
  mock.baz(argThat { x > 100 })
}
```

--------------------------------

### Using Hamcrest Matchers with MockitoHamcrest.argThat()

Source: https://github.com/mockito/mockito/blob/main/doc/design-docs/custom-argument-matching.md

Shows how to use existing Hamcrest matchers with Mockito 2.0+ by utilizing the `MockitoHamcrest.argThat()` method. This ensures interoperability while maintaining Mockito's reduced dependency on Hamcrest.

```java
import static org.mockito.hamcrest.MockitoHamcrest.argThat;
import static org.hamcrest.Matchers.startsWith;

// ... in a test method ...

verify(mockObject).someMethod(argThat(startsWith("prefix")));
```

--------------------------------

### IDE Regex: getArgumentAt to getArgument migration

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

Provides a regular expression for IDEs to automate the refactoring of `getArgumentAt` calls to the new `getArgument` method. This regex handles type casting and argument extraction, simplifying the migration of custom answer implementations.

```regex
replace `(\\w+).getArgumentAt([a-zA-Z0-9]*),\s*(.*?).class[)].` with `(($3)$1.getArgument($2)).`
```

--------------------------------

### Spock Subjects-Collaborators Extension for @InjectMocks Equivalent

Source: https://github.com/mockito/mockito/wiki/Related-Projects

This Spock extension mimics Mockito's @InjectMocks functionality, allowing you to annotate the system under test with @Subject and collaborators with @Collaborator. Unlike Mockito, mocks in Spock need to be created manually.

```groovy
// Example usage (conceptual, requires setup of Spock and extension)

@Subject
def myService

@Collaborator
def dependency1
@Collaborator
def dependency2

// ... mocks for dependency1 and dependency2 would be defined and injected ...

def "test something"() {
    when:
        myService.doSomething()
    then:
        // assertions
}
```

--------------------------------

### Mockito - Enable Mocking Using Constructor Arguments

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This new feature, introduced via pull request #935, enables mocking using constructor arguments. This provides greater flexibility in initializing mock objects with specific constructor parameters.

```java
/*
 * New feature - enable mocking using constructor arguments [(#935)]
 */
@Test
public void testMockWithConstructorArgs() {
    MyClass obj = Mockito.mock(MyClass.class, Mockito.withSettings().useConstructor(arg1, arg2));
    // ... assertions ...
}
```

--------------------------------

### Springockito XML Configuration for Mocking Beans

Source: https://github.com/mockito/mockito/wiki/Related-Projects

Springockito provides an XML namespace for defining mocks and spies within a Spring context. This allows for easy replacement of beans with mock objects during testing. It requires the Spring framework and Springockito dependencies.

```xml
<mockito:mock class="java.util.Date" id="mockedDate" />
<mockito:spy id="beanToBeSpied" />
```

--------------------------------

### Configure Mockito to Use Subclass Mockmaker

Source: https://github.com/mockito/mockito/wiki/Draft-Mockito-5-release-notes

This configuration allows users to explicitly choose the subclass mockmaker, which is necessary for specific environments like GraalVM native image or when avoiding mocking final classes. It involves adding a new artifact to your project dependencies.

```java
<!-- Add this dependency if you want to use the subclass mockmaker -->
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-subclass</artifactId>
    <version>5.0.0</version> <!-- Use the appropriate Mockito 5 version -->
    <scope>test</scope>
</dependency>
```

--------------------------------

### Migration: getArgumentAt to getArgument

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

Illustrates the change in method signature for retrieving arguments from an invocation on a mock. The `InvocationOnMock.getArgumentAt(int, Class)` method has been simplified to `InvocationOnMock.getArgument(int)`, making custom answer implementations easier.

```java
  // Change these
  ```java
  public Object answer(InvocationOnMock invocation) {
    MyClass first = getArgumentAt(0,MyClass.class);
    ...
  }
  ```
```

```java
  // to
  ```java
  public Object answer(InvocationOnMock invocation) {
    MyClass first = getArgument(0);
    ...
  }
  ```
```

--------------------------------

### Mockito: Mocking new object creation via spy

Source: https://github.com/mockito/mockito/wiki/Mocking-Object-Creation

This pattern demonstrates how to mock the creation of a new object (`Foo`) within a class (`MyClass`) by factoring the creation into a one-line method (`makeFoo`) and using Mockito's `spy` functionality. The test class spies on `MyClass` and overrides `makeFoo` to return a mock `Foo` object. This approach is simpler but has limitations with final classes.

```Java
public class MyClass {
    Foo makeFoo( A a, B b, C c ){
        return new Foo( a, b, c );
    }
    // ... other methods
}

// In test class:
@Mock private Foo mockFoo;
private MyClass toTest = spy( new MyClass());

doReturn( mockFoo )
    .when( toTest )
    .makeFoo( any( A.class ), any( B.class ), any( C.class ));
```

--------------------------------

### IDE Regex: MockitoJUnitRunner annotation migration

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

Offers a regular expression for IDEs to refactor the `@RunWith` annotation when migrating to Mockito 2. It suggests changing to `MockitoJUnitRunner.Silent.class` for a smoother migration, with a note to revert to the non-silent mode later.

```regex
replace `@RunWith(MockitoJUnitRunner.class)` with `@RunWith(MockitoJUnitRunner.Silent.class)` (Only for a softer migration. Should be switched back to non silent mode after everything compiles)
```

--------------------------------

### Verify Method Called At Least Once: Mockito vs. RMock

Source: https://github.com/mockito/mockito/wiki/Mockito-VS-RMock

Shows how to assert that a method on a mock object was invoked at least once. RMock uses 'modify().multiplicity(expect.atLeastOnce())', while Mockito employs 'verify(..., atLeastOnce())'.

```java
//RMock
runnable.run()
modify().multiplicity(expect.atLeastOnce());
startVerification();
//run
```

```java
//Mockito:
//run
verify(runnable, atLeastOnce()).run();
```

--------------------------------

### Mockito - Add Explicit Mention for Code Style Check

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This improvement, referenced by pull request #996, adds an explicit mention of the code style check process. This clarifies the development workflow and ensures adherence to coding standards.

```markdown
/*
 * Add explicit mention for code style check [(#996)]
 */
// This implies adding text or instructions to documentation or contribution guides.
```

--------------------------------

### Stubbing Void Methods to Throw Exception with Mockito

Source: https://github.com/mockito/mockito/wiki/Mockito-vs-EasyMock

Demonstrates how to stub a void method in Mockito to throw an exception. This uses the `doThrow` syntax, which is specific to void methods.

```java
List mock = mock(List.class);

doThrow(new RuntimeException()).when(mock).clear();
```

--------------------------------

### Creating Real Partial Mocks with Mockito

Source: https://github.com/mockito/mockito/wiki/Mockito-features-in-Korean

Introduces the capability to create partial mocks using the spy() method or by configuring specific methods to call their real implementation using thenCallRealMethod(). This feature, once considered a code smell, is now supported for specific use cases.

```java
import static org.mockito.Mockito.*;

import java.util.LinkedList;
import java.util.List;

// Creating a partial mock using spy()
List list = spy(new LinkedList());

// Configuring a mock to call its real method for a specific method
Foo mock = mock(Foo.class);
when(mock.someMethod()).thenCallRealMethod();
```

--------------------------------

### Void Method Throw Exception: Mockito vs. RMock

Source: https://github.com/mockito/mockito/wiki/Mockito-VS-RMock

Demonstrates how to make a void method on a mock object throw an exception. RMock uses 'modify().throwException(exc)', while Mockito uses the 'doThrow().when()' syntax.

```java
//RMock:
runnable.run();
modify().throwException(exc);
startVerification();
//run
```

```java
//Mockito:
doThrow(exc).when(runnable).run();
//run
```

--------------------------------

### Stubbing Void Methods to Throw Exception with EasyMock

Source: https://github.com/mockito/mockito/wiki/Mockito-vs-EasyMock

Illustrates how to stub a void method in EasyMock to throw an exception when called. This is useful for testing exception handling logic.

```java
List mock = createNiceMock(List.class);

mock.clear();
expectLastCall().andThrow(new RuntimeException());

replay(mock);
```

--------------------------------

### Verification in Order with EasyMock

Source: https://github.com/mockito/mockito/wiki/Mockito-vs-EasyMock

Shows how to enforce the order of method invocations on mocks using EasyMock's strict control. This is useful for testing scenarios where the sequence of operations is critical.

```java
Control control = createStrictControl();

List one = control.createMock(List.class);
List two = control.createMock(List.class);

expect(one.add("one")).andReturn(true);
expect(two.add("two")).andReturn(true);

control.replay();

someCodeThatInteractsWithMocks();

control.verify();
```

--------------------------------

### Avoid Tautology in Assertions - Java

Source: https://github.com/mockito/mockito/wiki/How-to-write-good-tests

Demonstrates how to write assertions that test the actual output of a function rather than replicating the logic within the assertion itself. This avoids redundancy and potential inconsistencies between test code and production code.

```java
import static org.assertj.core.api.Assertions.assertThat;

// ...

// use
assertThat(processTemplate("param1", "param2")).isEqualTo("this is 'param1', and this is 'param2'"));

// instead of
// assertThat(processTemplate("param1", "param2")).isEqualTo(String.format("this is '%s', and this is '%s'", param1, param2));
```

--------------------------------

### Declare Mockito-core with Gradle

Source: https://github.com/mockito/mockito/wiki/Declaring-mockito-dependency

This snippet shows how to add the Mockito-core testing library as a test implementation dependency in a Gradle project. It assumes the 'jcenter()' repository is configured.

```gradle
repositories {
    jcenter()
}
dependencies {
    testImplementation "org.mockito:mockito-core:1.+"
}
```

--------------------------------

### Mockito - Tidy-up in Build Automation

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This improvement, referenced by pull request #1011, involves tidying up the build automation process for Mockito. This typically involves refactoring scripts or configurations to improve efficiency and maintainability.

```bash
/*
 * Tidy-up in build automation [(#1011)]
 */
// This refers to changes in build scripts (e.g., Maven POM, Gradle files, shell scripts).
```

--------------------------------

### Mockito: Mocking new object creation via factory pattern

Source: https://github.com/mockito/mockito/wiki/Mocking-Object-Creation

This pattern, the factory helper pattern, addresses limitations of using spies with final classes. It involves creating a nested static factory class (`FactoryHelper`) responsible for object creation. `MyClass` takes an instance of this helper via its constructor, allowing tests to inject a mocked `FactoryHelper` to control the creation of dependent objects. This is a more robust solution when spies are not suitable.

```Java
public class MyClass{
    static class FactoryHelper{
        Foo makeFoo( A a, B b, C c ){
            return new Foo( a, b, c );
        }
    }

    private FactoryHelper helper;
    public MyClass( X x, Y y ){
        this( x, y, new FactoryHelper());
    }

    MyClass( X x, Y, y, FactoryHelper helper ){
        this.helper = helper;
    }

    // ...
    Foo foo = helper.makeFoo( a, b, c );
}

// In test class:
@Mock private MyClass.FactoryHelper mockFactoryHelper;
@Mock private Foo mockFoo;
private MyClass toTest;

toTest = new MyClass( x, y, mockFactoryHelper );
when( mockFactoryHelper.makeFoo(
    any( A.class ), any( B.class ), any( C.class )))
    .thenReturn( mockFoo );
```

--------------------------------

### Mocking Interface Clone Method with Mockito

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This snippet demonstrates how to enable mocking of the clone method for interfaces using Mockito. It addresses issue #688 and includes an acceptance test to prevent regressions. This functionality is particularly useful for specific mocking scenarios.

```java
/**
 * Verifies #688: Acceptance test to prevent future regression.
 */
@Test
public void should_allow_mocking_of_clone_method() {
    Cloneable mock = Mockito.mock(Cloneable.class);
    Mockito.when(mock.clone()).thenReturn(mock);
    Cloneable cloned = mock.clone();
    assertNotNull(cloned);
    assertSame(mock, cloned);
}
```

--------------------------------

### Mocking Interface with Default Method (Java)

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

Demonstrates how to mock an interface with a default method in Java using Mockito. It shows stubbing the base method and then using `willCallRealMethod()` for the default method to ensure it behaves as expected. This is relevant for Java 8 and later.

```java
interface DM {
    int contract();
    default int default_contract() { return contract() + 1; }
}

DM dm = mock(DM.class);
given(dm.contract()).willReturn(2);

// necessary otherwise default method is stubbed
given(dm.default_contract()).willCallRealMethod();

assertThat(dm.default_contract()).isEqualTo(3);
```

--------------------------------

### Implementing Default Behavior with Mockito @Spy and Abstract Classes

Source: https://github.com/mockito/mockito/wiki/Using-Spies-(and-Fakes)

Shows how to implement default behavior in Mockito using @Spy on an abstract class. This approach enhances readability and maintainability compared to using doAnswer() with matchers and casts.

```java
@Spy private StubUserService userService;

// No need for setUp() method anymore.

static abstract class StubUserService implements UserService {
  @Override public boolean addUsers(List<User> users, Policy policy) {
    assertThat(users).isNotEmpty();
    ...
    return true;
  }
}
```

--------------------------------

### Migration: BDDMockito willThrow varargs change

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

Shows the modification in the `BDDMockito.given().willThrow()` syntax for handling exceptions. Mockito 2.x now uses varargs for `willThrow`, allowing multiple exceptions to be specified.

```java
  ```java
  BDDMockito.given(mock.invocation()).willThrow(Throwable) // mockito 1.x
  ```
```

```java
  ```java
  BDDMockito.given(mock.invocation()).willThrow(Throwable...) // mockito 2.x
  ```
```

--------------------------------

### Mockito - Release Build to JDK 7 Compatibility for Java 6

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This improvement, referenced by pull request #1021, changes the release build of Mockito to use JDK 7 while maintaining binary compatibility for Java 6. This allows newer features to be used during the build process without breaking compatibility for older Java environments.

```java
/**
 * Change release build to JDK 7 with binary compatibility for Java 6 [(#1021)]
 */
// This is a build configuration change, not direct code.
```

--------------------------------

### Spying on Real Objects with Mockito

Source: https://github.com/mockito/mockito/wiki/Mockito-features-in-Korean

Demonstrates how to create a spy for a real object, allowing selective stubbing of methods while letting others call the real implementation. This is useful for partial mocking, especially with legacy code. Be cautious when stubbing methods that might throw exceptions on the real object or when dealing with final methods.

```java
import static org.mockito.Mockito.*;

import java.util.LinkedList;
import java.util.List;

// ...

List list = new LinkedList();
List spy = spy(list);

// Stubbing a specific method
when(spy.size()).thenReturn(100);

// Calling real methods
spy.add("one");
spy.add("two");

// Accessing stubbed method
System.out.println(spy.get(0)); // "one"
System.out.println(spy.size()); // 100 (stubbed value)

// Verification
verify(spy).add("one");
verify(spy).add("two");
```

```java
import static org.mockito.Mockito.*;

import java.util.LinkedList;
import java.util.List;

// ...

List list = new LinkedList();
List spy = spy(list);

// Incorrect stubbing for a method that calls the real implementation and might throw an exception
// when(spy.get(0)).thenReturn("foo"); // This would cause IndexOutOfBoundsException before stubbing

// Correct way to stub using doReturn
doReturn("foo").when(spy).get(0);

System.out.println(spy.get(0)); // "foo"
verify(spy).get(0);
```

--------------------------------

### Nullable Argument Matcher (Java)

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

Introduces the `<T> T nullable(Class<T>)` matcher in Mockito, which allows specifying a nullable argument of a given type `T`. This enhances flexibility in defining argument matchers for mocks.

```java
T nullable(Class<T> type)
```

--------------------------------

### Lazy Verification with VerificationCollector (Java)

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

Demonstrates the use of the incubating `VerificationCollector` Rule in Mockito for lazy verification. This allows all verifications within a test method to be collected and reported at the end, rather than failing on the first failed verification.

```java
@Rule
public VerificationCollector collector = MockitoJUnit.collector();

IMethods methods = mock(IMethods.class);
// Both methods are not called, but will be reported at once
verify(methods).simpleMethod();
verify(methods).byteReturningMethod();
```

--------------------------------

### Verifying Mockito Interactions After Execution

Source: https://github.com/mockito/mockito/wiki/Features-And-Motivations

This snippet illustrates how to verify that specific methods were called on a Mockito mock object, and with what arguments. Verification is performed after the code under test has executed, allowing you to assert that the interactions with dependencies occurred as expected. This is a core aspect of Mockito's 'verify-after-execution' philosophy.

```java
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class VerificationExampleTest {

    @Mock
    private Repository repository;

    @Test
    void testVerification() {
        // Arrange
        // Assume a method 'saveData' exists in the system under test
        // that calls repository.save(data);

        // Act
        // systemUnderTest.saveData("some data");

        // Assert: Verify that repository.save was called with the specific data
        // verify(repository).save("some data");
    }

    @Test
    void testVerificationWithArgumentMatcher() {
        // Arrange
        // Assume a method 'process' exists that calls repository.update(anyString())

        // Act
        // systemUnderTest.process("important info");

        // Assert: Verify that repository.update was called with any String argument
        // verify(repository).update(Mockito.anyString());
    }
}

interface Repository {
    void save(String data);
    void update(String data);
}
```

--------------------------------

### Mockito - Spying on Abstract Classes with Constructor Parameters

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This snippet shows how to enable spying on abstract classes while providing constructor parameters, as per issue #685. This is beneficial when the abstract class's constructor needs specific arguments for proper initialization during the spying process.

```java
/**
 * Support constructor parameters for spying on abstract classes.
 */
@Test
public void should_allow_spying_on_abstract_class_with_constructor_parameters() {
    AbstractClass mock = Mockito.spy(AbstractClass.class, Mockito.withSettings().useConstructor(10).defaultAnswer(invocation -> null));
    // Further assertions or interactions with the spy can be added here
}
```

--------------------------------

### Mockito - Bumped Version to Fix CI Build

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This improvement, referenced by pull request #1010, involved bumping a version number. This was done to fix an issue with the Continuous Integration (CI) build, ensuring that builds can proceed correctly.

```bash
/*
 * Bumped version to fix CI build [(#1010)]
 */
// This implies changes in version management within build configuration files.
```

--------------------------------

### Mockito - Acceptance Test for Clone Method Mocking

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This improvement, referenced by pull request #972, includes an acceptance test to verify the mocking of the clone method, directly addressing issue #688. This test ensures that the functionality remains stable and prevents future regressions.

```java
/*
 * Verifies #688: Acceptance test to prevent future regression [(#972)]
 */
@Test
public void should_allow_mocking_of_clone_method() {
    Cloneable mock = Mockito.mock(Cloneable.class);
    Mockito.when(mock.clone()).thenReturn(mock);
    Cloneable cloned = mock.clone();
    assertNotNull(cloned);
    assertSame(mock, cloned);
}
```

--------------------------------

### Implementing Custom ArgumentMatcher in Mockito

Source: https://github.com/mockito/mockito/blob/main/doc/design-docs/custom-argument-matching.md

Demonstrates how to implement a custom argument matcher by implementing the ArgumentMatcher interface and overriding the toString() method. This approach is necessary for Mockito 2.0+ to avoid Hamcrest dependencies and simplify the API.

```java
import org.mockito.ArgumentMatcher;

public class MyCustomMatcher implements ArgumentMatcher<String> {

    private String expectedValue;

    public MyCustomMatcher(String expectedValue) {
        this.expectedValue = expectedValue;
    }

    @Override
    public boolean matches(String actualValue) {
        return expectedValue.equals(actualValue);
    }

    @Override
    public String toString() {
        return "argThat(\"" + expectedValue + "\")";
    }
}
```

--------------------------------

### Declare Mockito-core with Maven

Source: https://github.com/mockito/mockito/wiki/Declaring-mockito-dependency

This snippet demonstrates how to declare a dependency on the Mockito-core library within a Maven project's pom.xml file. The provided link can be used to find the latest version information on Maven Central.

```xml
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <version>1.+</version>
    <scope>test</scope>
</dependency>
```

--------------------------------

### Mockito - Support Constructor Parameters for Spying Abstract Classes

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This improvement, referenced by issue #685 and pull request #935, adds support for constructor parameters when spying on abstract classes. This allows for more robust spying on abstract classes that require arguments for their constructors.

```java
/*
 * Support constructor parameters for spying on abstract classes [(#685)]
 */
@Test
public void testSpyAbstractClassWithConstructorArgs() {
    MyAbstractClass obj = Mockito.spy(MyAbstractClass.class, Mockito.withSettings().useConstructor(param1));
    // ... assertions ...
}
```

--------------------------------

### Mockito - Clean Up Unused Imports

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This improvement, referenced by pull request #1009, involves cleaning up unused import statements in the codebase. This is a standard practice for improving code readability and maintainability.

```java
/*
 * Clean up unused imports [(#1009)]
 */
// This implies code refactoring to remove unused import statements.
```

--------------------------------

### Mocking Builders with RETURNS_SELF (Java)

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

Introduces the `Answers.RETURNS_SELF` answer in Mockito, which is particularly useful for mocking builder patterns. This answer makes a mock object return itself, facilitating chained method calls common in builder implementations.

```java
// Example usage is not directly provided, but described as useful for builders.
```

--------------------------------

### Verifying Parameters with ArgumentCaptor in Mockito (1.8.0+)

Source: https://github.com/mockito/mockito/wiki/Mockito-features-in-Korean

Enables capturing arguments passed to mock methods for detailed verification after the method call. This provides a natural Java-style assertion. ArgumentCaptor should be used for verification only, not for stubbing, to maintain test readability and isolate failures.

```java
import static org.mockito.Mockito.*;
import org.mockito.ArgumentCaptor;

// Assuming Person is a class with getName()
Person person = new Person("John");

// Assuming mock is a mock object of a class with doSomething(Person)
// ArgumentCaptor<Person> argument = ArgumentCaptor.forClass(Person.class);
// verify(mock).doSomething(argument.capture());
// assertEquals("John", argument.getValue().getName());
```

--------------------------------

### Mockito - Update Javadoc about 'mockito-inline' Artifact

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This improvement, referenced by pull request #985, updates the Javadoc to provide more accurate information about the 'mockito-inline' artifact, addressing issue #981. This ensures users have correct documentation regarding this specific artifact.

```java
/*
 * Fixes #981: Update Javadoc about the 'mockito-inline' artifact [(#985)]
 */
// This implies a change in Javadoc comments related to the mockito-inline artifact.
```

--------------------------------

### Mockito - Fix Release Notes Badge

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This improvement, referenced by pull request #1001, corrects a broken or incorrect release notes badge. This ensures that project status indicators in documentation or readmes are accurate.

```markdown
/*
 * Fix release notes badge [(#1001)]
 */
// This relates to badges in README or documentation files, often Markdown or HTML.
```

--------------------------------

### Test JobScheduler with FakeExecutor and Clock (Java)

Source: https://github.com/mockito/mockito/wiki/Using-Spies-(and-Fakes)

This Java code snippet demonstrates a test for a JobScheduler using Mockito's @Spy. It sets up a FakeClock and FakeScheduledExecutorService to simulate time progression and task execution, allowing verification of job rescheduling logic when a task fails.

```java
public class JobSchdulerTest {
  @Spy private FakeClock clock;
  @Spy private FakeScheduledExecutorService executor;
  @Mock private Task task;

  @Test public void testJobsFailedWithTooBusyGetsRescheduled() {
    scheduler().add(task, Duration.ofMillis(10));
    elapse(Duration.ofMillis(9));
    // should not have run
    verify(task, never()).run();

    // at scheduled time, it runs, but failed with TOO_BUSY
    when(task.run()).thenReturn(SERVER_TOO_BUSY);
    elapse(Duration.ofMillis(1));
    verify(task).run();
    reset(task);

    // so it's retried.
    when(task.run()).thenReturn(OK);
    elapse(Duration.ofMillis(20));
    verify(task).run();
    reset(task);

    // Retry succeeded. No more runs.
    elapse(Duration.ofMillis(10000));
    verify(task, never()).run();
  }

  private JobScheduler scheduler() {
    return new JobScheduler(clock, executor);
  }

  // Moves time and invokes ready jobs.
  private void elapse(Duration time) {
    clock.elapse(time);
    executor.run();
  }

  static abstract class FakeClock extends Clock {
    private Instant now = Instant.ofEpochMilli(0);

    @Override public Instant instant() {
      return now;
    }

    void elapse(Duration duration) {
      now = now.plus(duration);
    }
  }

  abstract class FakeScheduledExecutorService
      implements ScheduledExecutorService {
    private List<Job> jobs = new ArrayList<>();

    @Override public ScheduledFuture<?> schedule(
        Runnable command, long delay, TimeUnit unit) {
      jobs.add(new Job(command, delay, unit));
    }

    /** Runs all jobs that are ready by now. Leaves the rest. */
    void run() {
      Instant now = clock.instant();
      List<Job> ready = jobs.stream().filter(job -> job.ready(now)).collect(toList());
      jobs = jobs.stream()
          .filter(job -> job.pending(now))
          .collect(toCollection(ArrayList::new));
      ready.forEach(Job::run);
    }
  }
}

```

--------------------------------

### Stubbing HttpServletRequest with Mockito

Source: https://github.com/mockito/mockito/wiki/Using-Spies-(and-Fakes)

Demonstrates how to stub the `getParameterMap` method of an `HttpServletRequest` using Mockito. This approach can lead to brittle tests due to the various ways the subject under test might interact with the request object.

```java
HttpServletRequest reqStub = mock(HttpServletRequest.class);
when(reqStub.getParameterMap()).thenReturn(ImmutableMap.of(key, new String[]{val}));
```

--------------------------------

### Workaround for Mockito Matchers with List Elements using @Spy

Source: https://github.com/mockito/mockito/wiki/Using-Spies-(and-Fakes)

Provides a workaround for Mockito's limitations with matchers on List elements. It utilizes an abstract class with a varargs method to enable stubbing and verification with matchers.

```java
@Spy private MockUserService userService;

@Test public void testSecondUser() {
  User user = ...;
  when(userService.doAddUsers(notNull(), eq(user))).thenReturn(false);
  ...
}

static abstract class MockUserService implements UserService {
  @Override public boolean addUsers(List<User> users, Policy policy) {
    return doAddUsers(users.toArray(new User[0]));
  }

  abstract boolean doAddUsers(User... users);
}
```

--------------------------------

### Squash Commits - Git Bash

Source: https://github.com/mockito/mockito/wiki/Using-git-to-prepare-your-PR-to-have-a-clean-history

Resets the branch to a previous commit softly, preserving changes, and then creates a new single commit with a specified message. This is effective for consolidating multiple small commits into one.

```bash
git reset --soft HEAD~7
git commit --message="Adds awesome feature"
```

--------------------------------

### Force Push Git Branch

Source: https://github.com/mockito/mockito/wiki/Using-git-to-prepare-your-PR-to-have-a-clean-history

This command forces the push of a local branch to its remote counterpart, overwriting any divergent history on the remote. It is essential when local history has been rewritten (e.g., via rebase) and the remote repository needs to be updated to reflect these changes. Ensure you understand the implications of rewriting history before using this command.

```bash
git push -f origin pr_that_improve_stuffs
```

--------------------------------

### Setting Default Return Values in Mockito (1.7+)

Source: https://github.com/mockito/mockito/wiki/Mockito-features-in-Korean

Allows defining default return values for unstubbed methods on mocks. This is particularly useful when working with legacy systems where many methods might be called. Mockito provides built-in answers like RETURNS_SMART_NULLS.

```java
import org.mockito.Mockito;

// Assuming Foo is a class with methods
Foo mock = mock(Foo.class, Mockito.RETURNS_SMART_NULLS);

// Example with a custom Answer
// YourOwnAnswer customAnswer = new YourOwnAnswer();
// Foo mockTwo = mock(Foo.class, customAnswer);
```

--------------------------------

### Using Mockito timeout feature for concurrency testing

Source: https://github.com/mockito/mockito/wiki/FAQ

Demonstrates how to use Mockito's 'timeout()' feature to test concurrency scenarios. This feature helps in scenarios where multiple threads might interact with a shared mock object, allowing for testing of concurrent conditions.

```java
import static org.mockito.Mockito.timeout;
import static org.mockito.Mockito.verify;

// Assuming 'someObject' is a mock object and 'someMethod()' is a method on it
// This example verifies that 'someMethod()' is called on 'someObject' within 100 milliseconds.
verify(someObject, timeout(100)).someMethod();
```

--------------------------------

### Using Mockito @Spy with FakeHttpServletRequest

Source: https://github.com/mockito/mockito/wiki/Using-Spies-(and-Fakes)

Illustrates using Mockito's `@Spy` annotation with a custom `FakeHttpServletRequest` abstract class. This allows testing specific interactions (like `setAttribute` and `logout`) while leaving other methods abstract, reducing boilerplate code compared to implementing the full `HttpServletRequest` interface.

```java
@Spy private FakeHttpServletRequest request;

@Test public void testBadAttributeCausesAutoLogout() {
  request.setAttribute(MAGIC_ATTRIBUTE_KEY, "bad");
  new LoginServlet().service(request, response);
  verify(request).logout();
}

static abstract class FakeHttpServletRequest implements HttpServletRequest {
  private final Map<String, Object> attributes = new LinkedHashMap<>();

  @Override public Object getAttribute(String name) {
    return attributes.get(name);
  }

  @Override public Enumeration<String> getAttributeNames() {
    return Iterators.asEnumeration(attributes.keySet().iterator());
  }

  @Override public void setAttribute(String name, Object value) {
    attributes.put(name, value);
  }
}
```

--------------------------------

### Mockito Collections Injection for Generic Collections

Source: https://github.com/mockito/mockito/wiki/Related-Projects

Mockito-collections facilitates injecting objects into generic collections, particularly useful for mocking scenarios. It uses annotations to define mocks and injects them into a target object. This library requires Mockito and its own annotations.

```java
@InjectMocks private MyDelegate delegate;
@Mock private MyListener listener1;
@Mock private MyListener listener2;

@Before public void setup() { MockitoCollectionAnnotations.inject(this);}
```

--------------------------------

### Mockito - Corrected Comment in Exceptions Package

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This improvement, referenced by pull request #975, corrects a comment within the exceptions package-info file. This enhances the clarity and accuracy of the documentation within the codebase.

```java
/*
 * Corrected a comment in exceptions package-info [(#975)]
 */
// This implies a change in a package-info.java file.
```

--------------------------------

### Mockito - Correct Stubbing Location with Inline Mocking

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This fix, referenced by pull request #979, addresses an issue where the stubbing location was incorrectly identified when using inline mocking, related to issue #974. This ensures accurate reporting and debugging of stubbing configurations.

```java
/*
 * Fixes #974: Fix to get correct stubbing location with inline mocking [(#979)]
 */
// This implies modifications to Mockito's internal mechanisms for tracking stubbing.
```

--------------------------------

### Configure ByteBuddy Version for Android Testing in Mockito

Source: https://github.com/mockito/mockito/blob/main/mockito-integration-tests/android-tests/README.md

This configuration allows specifying a particular version of ByteBuddy for testing within the Android Testing Project. It demonstrates how to override the default ByteBuddy version used by Mockito's dependencies. If set to '0', Mockito's declared version is used. Note that Gradle's dependency resolution usually favors newer versions, so older explicit versions might not be applied without further configuration.

```gradle
bytebuddy_version = '0'

bytebuddy_version = '1.11.7'
```

--------------------------------

### Mockito - Resolve Ambiguous Constructors

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This fix, referenced by pull request #980, resolves issues related to ambiguous constructors, specifically addressing issue #976. It enhances Mockito's ability to correctly identify and use constructors when creating mocks or spies.

```java
/*
 * Fixes #976: Resolve ambiguous constructors [(#980)]
 */
// This implies changes in how Mockito handles constructor selection logic.
```

--------------------------------

### Mockito - Fixing Broken Link in Javadoc

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This improvement, referenced by pull request #1023, corrects a broken link within the Mockito Javadoc. This ensures that documentation links are accurate and lead to the intended resources.

```java
/**
 * Fix broken link in Mockito javadoc [(#1023)]
 */
// No direct code snippet, but implies a change in documentation generation or content.
```

--------------------------------

### Java Mockito Stubbing Inline Mock Creation Error

Source: https://github.com/mockito/mockito/wiki/FAQ

Demonstrates an incorrect way to stub a method that returns an inline mock creation. This construct is disallowed because it interferes with Mockito's unfinished stubbing detection. The corrected version shows how to extract the mock into a local variable before stubbing.

```java
  when(m.foo()).thenReturn(mock(Foo.class));
  //                         ^

  //extract local variable and start smiling:
  Foo foo = mock(Foo.class);
  when(m.foo()).thenReturn(foo);
```

--------------------------------

### Mockito - Fix Broken Link in Mockito.java

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This improvement, referenced by pull request #994, fixes a broken link located on line 1357 of the Mockito.java file. This ensures internal or external links within the source code are functional.

```java
/*
 * fix the broken link on 1357 line in Mockito.java [(#994)]
 */
// This implies a specific line change within the Mockito.java source file.
```

--------------------------------

### Amend Previous Commit - Git Bash

Source: https://github.com/mockito/mockito/wiki/Using-git-to-prepare-your-PR-to-have-a-clean-history

This command allows you to amend the most recent commit without changing its commit message. It's useful for adding forgotten files or making minor adjustments to the last commit.

```bash
git commit --amend --no-edit
```

--------------------------------

### Mockito - Inline Mocking Throws with Interface Default Method

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This issue, #944, details a situation where Mockito throws an exception when mocking an interface with a default method while inline mocking is enabled. This indicates a compatibility issue between inline mocking and default methods that needed resolution.

```java
/*
 * With Inline Mocking enabled, Mockito throws when mocking interface with default method [(#944)]
 */
// This describes a specific failure scenario related to inline mocking and default methods.
```

--------------------------------

### Mockito - Break Cyclical Compile-Time Dependency

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This improvement, referenced by pull request #983, breaks a cyclical compile-time dependency involving `hideRecursiveCall`. This resolves build issues and improves the overall compilation process.

```java
/*
 * Break cyclical compile time dependency on hideRecursiveCall [(#983)]
 */
// This implies changes in module dependencies or import order to resolve circular dependencies.
```

--------------------------------

### Mockito - Spying Interfaces for Java 8 Default Methods

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This improvement, referenced by pull request #942, allows spying on interfaces, which is particularly useful for working with Java 8 default methods. This enhances Mockito's ability to handle modern Java features.

```java
/*
 * Allow spying on interfaces so that it is convenient to work with Java 8 default methods [(#942)]
 */
@Test
public void testSpyInterfaceWithDefaultMethod() {
    MyInterface obj = Mockito.spy(MyInterface.class);
    Mockito.when(obj.defaultMethod()).thenReturn("test");
    assertEquals("test", obj.defaultMethod());
}
```

--------------------------------

### Java Mockito Stubbing Chained Getters

Source: https://github.com/mockito/mockito/wiki/FAQ

Illustrates stubbing chained getters in Mockito, where one mock returns another mock. This pattern is discouraged as it violates the Law of Demeter and indicates potential design issues. The documentation suggests using this sparingly and points to Mockito's deep stubs feature as an alternative.

```java
  when(mock.getA().getB()).thenReturn(...);
```

--------------------------------

### Resetting Mock State in Mockito (1.8.0+)

Source: https://github.com/mockito/mockito/wiki/Mockito-features-in-Korean

Provides the reset() function to clear all stubbings and interactions recorded on a mock object. However, its use is discouraged as it often indicates a poorly designed test. It's generally recommended to create new mocks for each test case, but reset() can be useful in specific scenarios like dealing with container-injected mocks.

```java
import static org.mockito.Mockito.*;

import java.util.List;

List mock = mock(List.class);
when(mock.size()).thenReturn(10);
mock.add(1);

reset(mock);
// All stubbings and interactions are now cleared from the mock.
```

--------------------------------

### Mockito - Handling Invalid Property with Inline Mocking

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This snippet addresses an issue where Mockito incorrectly reported an invalid property when inline mocking was enabled, as described in issue #963. This fix ensures correct behavior for property reporting in such scenarios.

```java
/**
 * Invalid property reported by mocks and partial mocks.
 */
@Test
public void should_not_report_invalid_property_with_inline_mocking_enabled() {
    MyClass mock = Mockito.mock(MyClass.class);
    // Code that would previously trigger the invalid property report
    // Assertions to verify the fix
}
```

--------------------------------

### Mockito - MatchersTest Numeric Literals Update

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This improvement, referenced by pull request #1022, involves updating numeric literals within the MatchersTest. This change likely pertains to code style or consistency within the test suite.

```java
/**
 * MatchersTest numeric literals [(#1022)]
 */
// No direct code snippet, but implies changes within test files related to numeric literals.
```

--------------------------------

### Mockito - Unnecessary Stubbing Detection with Inline Mocking

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This issue, #974, highlights that MockitoJUnitRunner.StrictStubs did not detect 'Unnecessary Stubbing' when the inline mock maker was enabled. The subsequent pull request #979 aimed to fix this behavior.

```java
/*
 * MockitoJUnitRunner.StrictStubs does not detect 'Unnecessary Stubbing' when inline mock maker is enabled [(#974)]
 */
// This describes a behavior related to Mockito's testing utilities and mock makers.
```

--------------------------------

### Clear Inline Mocks in Mockito (Kotlin)

Source: https://github.com/mockito/mockito/wiki/What's-new-in-Mockito-2

This snippet demonstrates how to clear inline mocks in Mockito, which is particularly useful for preventing memory leaks when using mockito-inline, especially with Kotlin and PowerMock. It should be added to all test classes.

```kotlin
/**
 * See [Memory leak in mockito-inline...](https://github.com/mockito/mockito/issues/1614)
 */
@After
fun clearMocks() {
    Mockito.framework().clearInlineMocks()
}
```

--------------------------------

### Mockito - Invalid Property Reported by Mocks and Partial Mocks

Source: https://github.com/mockito/mockito/blob/main/doc/release-notes/official.md

This issue, #963, describes a problem where an invalid property was reported by mocks and partial mocks in Mockito. The related pull request #963 likely contains the fix for this behavior.

```java
/*
 * Invalid property reported by mocks and partial mocks [(#963)]
 */
// This refers to a bug fix related to property introspection in mocks.
```

=== COMPLETE CONTENT === This response contains all available snippets from this library. No additional content exists. Do not make further requests.