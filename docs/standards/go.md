# Go 工程规范

| 属性 | 内容 |
| --- | --- |
| 状态 | 已确认，适用于 IAM 当前实现 |
| Go 模块 | `platform/iam` |
| 历史决定 | [ADR-0005](../architecture/decisions/0005-iam-module-layout-and-comments.md) |

## 官方依据与项目选择

Go 官方 [Organizing a Go module](https://go.dev/doc/modules/layout) 建议服务项目把私有实现放入 `internal`，并介绍使用 `cmd` 组织命令的惯例；同包可以有多个源码文件与相邻测试。`internal` 由 Go 工具链实施导入边界，`cmd` 是组织惯例。

官方没有规定统一的 `domain/application/infrastructure` 目录模板。本项目根据用户要求，把整个 IAM 建为 `platform/iam` 独立模块，再按职责划分内部包与文件；不把项目自己的分层选择称为 Go 强制标准。

包命名参考 [Go Blog: Package names](https://go.dev/blog/package-names)，注释参考 [Effective Go: Commentary](https://go.dev/doc/effective_go#commentary)。

## 模块边界

- IAM 的 `go.mod`、`go.sum`、命令、实现、SQL、单元/HTTP/集成测试与测试夹具全部位于 `platform/iam`。
- IAM 作为可独立迁出的子项目维护，必要配置、忽略规则、许可证与使用文档也须保存在项目内；README 列出从实际依赖清单核对的技术栈，以项目目录执行开发/运行命令。
- IAM 现在是独立 Git 仓库和父项目 submodule，路径保持不变；源码和自己的 CI 在子仓库提交，父项目只更新固定提交指针。共同开发使用同名分支，普通检出和 CI 不跟随远端分支最新版本。
- 模块名按用户决定使用 `module iam`，内部导入统一为 `iam/internal/...`，不附带仓库托管地址；这属于项目命名选择。
- 仓库根目录不放 IAM Go 模块，`services/` 与根 `tests/` 不分散 IAM 源码。
- `cmd/iam-api` 只管理配置、依赖组装、运维命令和进程生命周期。
- `internal/iam` 管理身份、认证、授权等领域用例，当前只依赖标准库和自身端口。
- `internal/httpapi`、`model`、`security`、`integrations` 分别承载协议、GORM 持久化、算法和外部能力适配。
- `internal/model` 统一管理 GORM 表模型、仓储、迁移和 outbox；领域包不引入 ORM 标签或驱动类型。具体选择见 [ADR-0006](../architecture/decisions/0006-iam-gorm-model-layer.md)。该包名与 ORM 是项目约定，不是 Go 官方强制目录。
- 内部代码不能被其他 Go 模块直接导入；业务应用通过公开 API、事件或未来独立 SDK 接入。
- 独立运行不把 Tenant、消息等外部能力并入 IAM；可选集成的能力边界和缺省行为必须在项目 README 说明。必要文档的相对链接应始终落在 IAM 项目内部。

## 包与文件

- 一个包承担清楚的能力；包名短小、清晰、小写，不用无职责的 `common`、`utils` 收集代码。
- 一个包可按业务职责拆文件，文件名不代表必须新增包或接口。
- 账号、认证、挑战、会话、MFA、角色权限、服务身份和邀请保持独立文件；Gin 路由同样按职责注册。
- `Service` 可以继续组合相关用例，但 `service.go` 只放依赖与公共内部辅助，不汇集全部实现。
- 领域测试与被测包相邻，HTTP/数据库/算法测试在对应适配包内；共享测试夹具只放模块内 `internal/testutil/iamtest`。
- 文件长度不是唯一拆分依据；出现多个独立职责、难以命名或导航成本明显增加时应重新拆分。

## 详细注释

- 使用中文解释项目语义，保留 Go 标识符与准确的协议/算法名称。
- 包注释说明职责与依赖边界；导出类型、函数、方法与端口写 GoDoc，并以对应名称开头。
- 模型字段优先解释身份与凭据区别、作用域、版本、验证状态、秘密的存储形态及生命周期。
- 关键步骤说明为什么这样做：默认拒绝、认证与授权分离、所有权检查、资源租户校验、MFA 新鲜度与重放保护。
- 事务注释说明原子边界、错误时的提交/回滚、并发冲突及外部副作用的幂等责任。
- 密码、随机数、摘要、密文注释说明用途和约束；不把 HMAC 当密码派生、不把格式校验当所有权验证。
- 测试注释说明场景、被保护的边界与测试替身的局限，不对每个重复错误分支逐句复述。
- 注释必须与代码一起维护，不描述尚未实现的校验、吞吐、恢复或生产保证。

## 检查

从仓库根运行：

```sh
go -C platform/iam test -race ./...
go -C platform/iam vet ./...
go -C platform/iam build ./...
npm run docs:check
```

模块内运行则省略 `-C platform/iam`。CI 的工作目录、Go 版本文件和缓存校验文件必须指向该模块。数据库测试只允许显式配置的专用临时库，格式化使用 `gofmt`，导入整理使用 Go 官方 `x/tools` 的 `goimports`。
