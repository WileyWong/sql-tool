# 检查镜像工具

目前采用 [checkstyle](https://checkstyle.sourceforge.io/) 配合配置检查

## Docker Image

已经封装了Docker镜像

- `mirrors.tencent.com/standards/checkstyle-tencent:latest` - (推荐)
- `mirrors.tencent.com/standards/checkstyle-tencent:$TAG`
- `csighub.tencentyun.com/standards/checkstyle-tencent:latest`
- `csighub.tencentyun.com/standards/checkstyle-tencent:$TAG`

## 本地运行

```shell
docker run --rm -it \
  -v $(pwd):$(pwd) \
  -w $(pwd) \
  -e PLUGIN_DIR=. \
  -e PLUGIN_FORMAT=plain \
  mirrors.tencent.com/standards/checkstyle-tencent:latest
```

## Runs on Orange-ci

### 全量检查

```yaml
master:
  merge_request:
    - stages:
        - name: checkstyle
          image: mirrors.tencent.com/standards/checkstyle-tencent:latest
          settings:
            dir: src # 如果需要指定某个子目录需要设置dir
            output: a.xml # 检查结果输出文件 默认为report.xml
            format: xml # 检查结果文件格式 默认为xml 可设置为plain
            epc: true # 使用epc检查标准 默认为false
            level: warning # 触发错误的level级别 默认为warning 可设置为error/info
```

### 增量检查

```yaml
master:
  merge_request:
    - stages:
        - name: list changed
          type: git:changeList
          options:
            changed: changed.txt
        - name: checkstyle
          image: mirrors.tencent.com/standards/checkstyle-tencent:latest
          settings:
            filelist: changed.txt
```

## 忽略 checkstyle 验证

在使用过程中，遇到一些无法遵守规则的场景，比如自动生成的代码，
native方法名,需要忽略验证，这里提供多种方法让工具跳过验证：

1. 使用@SuppressWarnings，这种使用多种开发工具，使用较为广泛,可用于字段，类，方法等；
   ```java
   //可以指定多个规则，规则名忽略大小写
   @SuppressWarnings({"checkstyle:membername", "checkstyle:methodname"})
   class Foo {}
   //可以忽略全部
   @SuppressWarnings("checkstyle:all")
   class Bar {}
   ```
2. 使用注释开启及关闭验证；
   ```java
   // CHECKSTYLE:OFF
   /* your unstylish code */
   // CHECKSTYLE:ON
   ```

