# Groovy 技术参考

## 默认技术栈

| 组件 | 版本 | 说明 |
|------|------|------|
| Groovy | 4.0+ | 主语言版本 |
| Gradle | 8.x | 构建工具 |
| Spock | 2.3+ | 测试框架 |

## 常用场景

### 1. Gradle 构建脚本

```groovy
// build.gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.5'
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    testImplementation 'org.spockframework:spock-core:2.3-groovy-4.0'
}

// 自定义任务
tasks.register('generateDocs', GenerateDocsTask) {
    sourceDir = file('src/main/java')
    outputDir = file('build/docs')
}
```

### 2. Spock 测试

```groovy
class CalculatorSpec extends Specification {
    
    @Subject
    def calculator = new Calculator()
    
    def "两数相加"() {
        expect:
        calculator.add(a, b) == result
        
        where:
        a | b || result
        1 | 2 || 3
        0 | 0 || 0
        -1| 1 || 0
    }
    
    def "除零抛出异常"() {
        when:
        calculator.divide(10, 0)
        
        then:
        thrown(ArithmeticException)
    }
}
```

### 3. DSL 定义

```groovy
// 定义 DSL
class PipelineDsl {
    List<Stage> stages = []
    
    void stage(String name, @DelegatesTo(Stage) Closure config) {
        def stage = new Stage(name: name)
        config.delegate = stage
        config.resolveStrategy = Closure.DELEGATE_FIRST
        config()
        stages << stage
    }
}

// 使用 DSL
pipeline {
    stage('Build') {
        steps {
            sh 'mvn clean package'
        }
    }
    stage('Test') {
        steps {
            sh 'mvn test'
        }
    }
}
```

## 相关规范

- [Groovy 命名规范](../standards/groovy/naming.md)
- [Spock 测试规范](../standards/groovy/spock.md)

## 最佳实践

### Gradle 脚本

1. **使用 Kotlin DSL 或 Groovy DSL 保持一致**
2. **提取公共配置到 buildSrc**
3. **使用 version catalog 管理依赖版本**
4. **避免在构建脚本中写复杂逻辑**

### Spock 测试

1. **使用 given-when-then 结构**
2. **数据驱动测试使用 where 块**
3. **Mock 对象使用 `Mock()` 或 `Stub()`**
4. **测试方法名使用中文描述业务场景**
