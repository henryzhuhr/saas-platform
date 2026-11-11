# ADR-0005：IAM 独立 Go 模块与职责拆分

| 属性 | 内容 |
| --- | --- |
| 状态 | Accepted |
| 日期 | 2026-11-11 |
| 来源 | 用户要求详细注释、纠正大文件组织、遵循 Go 官方建议，并明确全部代码和 go.mod 必须在 platform/iam |
| 关联 | [ADR-0004](0004-go-gin-iam-implementation.md)、IAM 模块边界与仓库可维护性要求 |

后续 [ADR-0006](0006-iam-gorm-model-layer.md) 将存储包明确为 `internal/model` 并采用 GORM；本 ADR 的独立模块、cmd/internal、职责拆分及详细注释规则继续有效。

## 背景

首版实现将超过千行的 IAM 用例放入一个 `service.go`，Gin 路由也集中在单文件，并把命令、适配器、测试与模块元数据分散在仓库多处。这增加导航、评审和后续维护成本。用户明确要求修正，最终指定 `platform/iam` 包含全部 IAM 代码和 `go.mod`。

## 决策

1. `platform/iam` 是独立 Go 模块，包含自己的 `go.mod` 与 `go.sum`；不保留根 Go 模块，也不新增不必要的根 `go.work`。
2. 模块内 `cmd/iam-api` 放运行入口，`internal` 放私有实现。
3. `internal/iam` 按账号、认证、挑战、会话、MFA、权限、角色、授权、服务身份、邀请、事件和限流拆文件，同包共享内部实现；不为了文件拆分制造新领域或层间接口。
4. Gin 注册入口与各职责路由分开；持久化、安全算法和外部集成保留独立内部包。
5. 全部测试和夹具随 IAM 模块保存，数据库迁移也位于该模块；仓库级目录只保留原本的说明与未来职责。
6. 为领域模型、方法、端口、安全检查、事务、副作用、算法、SQL 和测试补充详细中文注释。
7. 同步 npm 命令、CI、架构图和文档地图；执行 Go 检查时显式定位模块。

2026-11-11 用户进一步明确模块名使用 `module iam`。模块内导入统一从 `iam/internal/...` 开始，不再采用仓库托管路径作为前缀；目录位置、私有包边界与 HTTP 接口不变。这是当前项目内部模块的命名决定。

## 官方依据

- [Go: Organizing a Go module](https://go.dev/doc/modules/layout)：服务模块、私有 `internal`、命令目录以及同包多文件与测试组织。
- [Go Blog: Package names](https://go.dev/blog/package-names)：以明确能力为边界的包命名。
- [Effective Go: Commentary](https://go.dev/doc/effective_go#commentary)：包和导出标识符的文档注释。

`internal` 是工具链边界，`cmd` 是惯例。本项目选取的具体包名与用例文件划分由自身职责决定，官方没有发布统一 DDD 分层模板。

## 备选方案与取舍

| 方案 | 取舍 |
| --- | --- |
| 保留根 Go 模块和分散目录 | 不符合用户最终要求，IAM 难以独立运行与检查 |
| 只把大文件切成编号文件 | 缺少职责语义，不能改善导航和领域理解 |
| 每个方法一个包 | 产生过多导入和边界接口，容易形成循环依赖 |
| 按职责拆文件，全部实现保留在独立模块 | 符合用户边界、Go 私有包建议，并保留已有业务语义 |

## 影响、迁移与验证

原根 `go.mod/go.sum` 移入 `platform/iam`；原 `services/platform-api` 的 IAM Go 代码与根测试夹具一并迁入模块。命令改为 `go -C platform/iam run ./cmd/iam-api`；测试与静态检查使用同样模块定位。内部导入路径相应更新，公开 HTTP v1 契约保持不变。

重构通过迁移前后的领域声明、方法及 HTTP 处理器语法指纹对比，辅以编译、竞态测试、数据库集成与文档检查。注释不引入新的认证方式或产品决策，也不把生产验收未完成项标记为完成。

ADR-0004 中的语言、框架、算法和存储适配取舍继续有效；本 ADR 调整其目录组织部分。历史记录保留，通过链接解释演进，不删除原始决定。

具体规则见 [Go 工程规范](../../standards/go.md)，当前运行方式见 [IAM 模块](../../../platform/iam/README.md)。
