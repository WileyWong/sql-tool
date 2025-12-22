本目录用golangci-lint的 [Module模式](https://golangci-lint.run/plugins/module-plugins) 实现部分开源linter中没有检查的部分。

可以有三种使用方式

1. 官方打包好的镜像，参见docker目录的[说明](../docker/README.md)

   适合纯go项目不存在cgo依赖的

2. 采用官方封装的一键工具，参见cmd/tencentlint目录的[说明](../cmd/tencentlint/README.md)

   实际封装执行了3的内容

3. 本地安装golangci-lint后自行下载配置文件,适合有特殊需求的修改配置文件的

    ```shell
    # copy .golangci.yml .custom-gcl.yml from this repository
    # install base lint
    go install github.com/golangci/golangci-lint/cmd/golangci-lint@v1.64.8
    # build custom lint
    golangci-lint custom -v
    # run lint
    ./custom-gcl
    ```

