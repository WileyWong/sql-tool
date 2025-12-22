本目录封装了golangci-lint。

提供功能：

+ 下载最新配置文件并执行检查。
+ 在支持plugin的平台自动构建golangci-lint的plugin。

```shell
go install git.woa.com/standards/go/cmd/tencentlint@master # 安装lint
tencentlint # 在当前目录运行检查
tencentlint -config-version $tag # 指定配置版本检查
tencentlint -verbose # 透传-v给golangci-lint
tencentlint -lint-version v1.64.8 # 指定golangci-lint版本
```

# 兼容性

golangci-lint从v1.48.0开始需要go1.18以上版本

| 最小go版本 | golangci-lint版本 | tencentlint版本                            |
|--------|-----------------|------------------------------------------|
| 1.22.1 | v1.62.2         | master                                   |
| 1.21   | v1.59.1         | 7f389d43bc39412f6d495c0eb268e94689ea4b60 |
| 1.18   | v1.50.1         | 0b4a250a0a041697946fe322042716c5a9f010e9 |
| 1.17   | v1.47.2         | a777082f82f9e6a59acc7278476020ca17b9de9c |
| 1.16   | v1.45.2         | e566a29a686f7f08e5b775d946875fa0f5597cd8 |

go1.16以下版本不支持直接go install安装

使用go1.16时需要`go install git.woa.com/standards/go/cmd/tencentlint@e566a29a686f7f08e5b775d946875fa0f5597cd8`

go1.17同理

go1.18及以上可以使用master
