# 基于[golangci-lint](https://github.com/golangci/golangci-lint)的[腾讯GoLang代码规范](https://git.code.oa.com/standards/go)检查镜像

![](https://metrics.woa.com/git/standards/go/-/latest/ci/status/push)
![](https://metrics.woa.com/git/standards/go/-/latest/ci/status/tag_push)
![](https://metrics.woa.com/git/standards/go/-/latest/ci/pipeline-as-code)

## Docker

- `mirrors.tencent.com/standards/golangci-lint-tencent:latest` - (推荐)
- `mirrors.tencent.com/standards/golangci-lint-tencent:${tag}`

## Usage


### 本地运行

```shell
docker run --rm -it \
  -v $(pwd):$(pwd) \
  -w $(pwd) \
  -e PLUGIN_DIR=. \
  mirrors.tencent.com/standards/golangci-lint-tencent:latest
```  


### Runs on Orange-ci

```yaml
master:
  merge_request:
  - runner:
      network: devnet
    docker:
      volumes:
        # cache for golangci-lint-tencent
        - /root/.cache:copy-on-write
    stages:
    - name: golang-ci lint
      image: mirrors.tencent.com/standards/golangci-lint-tencent:latest
      settings:
        # 具体代码子目录，默认为根目录
        DIR: some/dir 
        EXTRA_ARGS: --skip-files a.go # extra args passed to goalngci-lint run

```

### Runs on 工蜂CI

```yaml
- taskType: dockerRun@latest
  displayName: dockerRun
  env:
    PLUGIN_DIR: some/dir
  inputs:
    image: mirrors.tencent.com/standards/golangci-lint-tencent:latest
```
