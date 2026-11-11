# AGENTS.md

本文件适用于整个 `saas-platform` 仓库。更深目录中的 `AGENTS.md` 只补充该子树的局部规则；冲突时以距离目标文件最近的规则为准。

## 1. Harness engineering 工作模式

本仓库采用 OpenAI [Harness engineering](https://openai.com/index/harness-engineering/) 提出的仓库知识组织方式：

- `AGENTS.md` 是短小稳定的导航地图，不是百科全书。
- `docs/` 是版本化的项目知识与事实系统。
- 通过逐层索引实现渐进式披露，先读地图，再按任务深入。
- 格式、链接、索引覆盖和架构边界应尽量机械化校验。
- 重复出现的错误应转化为文档规则、lint 或结构测试。

## 2. 必读地图

任何任务先从最小必要上下文开始：

1. [README](README.md)：项目定位、阶段和仓库地图。
2. [ARCHITECTURE](ARCHITECTURE.md)：系统边界、领域模块和架构不变量。
3. [文档总地图](docs/README.md)：进入需求、架构和工程规范。
4. 目标目录最近的 `README.md`：了解局部职责和下一级地图。

按任务类型继续阅读：

| 任务 | 事实来源 |
| --- | --- |
| 产品范围、用户故事、优先级 | [需求地图](docs/requirements/README.md) |
| 系统边界、模块职责、依赖方向 | [架构地图](docs/architecture/README.md) |
| Markdown、文档索引和校验 | [工程规范地图](docs/standards/README.md) |
| 依赖清单和锁文件策略 | [依赖管理规范](docs/standards/dependencies.md) |
| 产品版本、分支、发布与版本维护 | [版本演进与分支管理规范](docs/standards/versioning-and-branching.md) |
| 业务应用接入 | [Applications](applications/README.md) 与未来 `api/manifests/` 契约 |
| 平台领域修改 | [Platform](platform/README.md) 与对应模块 README |
| 部署单元修改 | [Services](services/README.md) 与对应服务 README |

事实优先级：用户当前明确指令 > 已确认需求 > 已确认 ADR/契约 > 草案文档 > 当前实现。发现冲突时必须指出并修正事实来源，不能静默选择。

## 3. 当前项目阶段

当前处于需求、架构和项目框架阶段。除非用户明确要求进入实现：

- 可以维护文档、契约草案、目录地图和工程校验工具。
- 不新增业务实现、数据库迁移、部署模板或未经确认的技术选型。
- 不把示例格式描述成已经稳定的正式契约。

`pyproject.toml` 和 `package.json` 当前用于项目元数据及仓库工具。引入运行时依赖或框架仍需明确任务授权。

维护者已明确授权 Go + Gin IAM 实现。IAM 必须是位于 `platform/iam`、声明 `module iam` 的独立 Go 模块，内部导入使用 `iam/internal/...`，包含其 `go.mod`、入口、私有代码、适配器、SQL 和全部测试；不在仓库根目录或 `services/`、`tests/` 分散 IAM Go 代码。相关范围见 [IAM 实现说明](docs/architecture/iam-implementation.md)；其他领域仍遵守上述阶段限制。

IAM 使用独立仓库 `git@github.com:henryzhuhr/saas-platform-iam.git`，通过 Git submodule 保持 `platform/iam` 目录；必要配置、许可证、文档、文档校验和 CI 随子仓库维护，必需文档不得依赖父路径。先初始化父项目锁定提交，再阅读子模块自己的 `AGENTS.md`；共同开发保持同名分支。先提交并推送子仓库，再提交父 gitlink，推送父仓库使用 `--recurse-submodules=check`。普通检出/CI 不使用 `update --remote`，不得为了同步分支覆盖已有改动。迁移与合并顺序见 [ADR-0008](docs/architecture/decisions/0008-iam-git-submodule.md)。

Go 目录与注释遵循 [Go 工程规范](docs/standards/go.md)：模块内使用 `cmd/` 与 `internal/`，包和文件按职责组织；导出符号写 GoDoc，关键安全判断、状态传播、事务与跨服务副作用写详细中文注释，不再将全部用例或路由集中在一个文件。

IAM 持久化代码统一在 `platform/iam/internal/model`，使用 GORM；表模型、查询/写入、事务、迁移与 outbox 保持职责拆分，领域包只依赖存储端口。不再维护并行的 `internal/postgres` 手写驱动仓储。选择与兼容策略见 [ADR-0006](docs/architecture/decisions/0006-iam-gorm-model-layer.md)。

## 4. 强制工作流

开始修改前：

1. 运行 `git status --short`，保护用户已有改动。
2. 沿文档地图读取目标任务所需的最小事实来源。
3. 明确本次修改对应的需求、架构边界和验收方式。

修改过程中：

- 保持范围小而聚焦，不顺手实现未确认的相邻能力。
- 搜索文件和文本优先使用 `rg --files` 和 `rg`。
- 不直接读写其他领域模块的数据表，不引入循环依赖。
- 重大、跨模块、难以撤销或具有历史影响的决定必须形成 ADR，并登记到 [ADR 索引](docs/architecture/decisions/README.md)。
- 历史决策即使后来被替代，也必须保留原 ADR，并标记 `Superseded`、链接替代决策和说明迁移原因。
- 需求和总体架构必须使用逻辑角色；具体供应商、产品和部署方案只有在选型 ADR 接受后才能成为规范性基线。
- 参考输入中的技术名称默认只视为示例，不能在没有确认和验证的情况下写成项目决策。
- 新增或修改安全、可靠性和多租户隔离要求时，必须同步更新[规范依据矩阵](docs/requirements/standards-and-evidence.md)及对应验证方式。
- 需求变化先更新需求文档，再更新架构、契约、实现和测试。

完成前：

1. 运行与变更相关的最小测试。
2. 运行文档和仓库级必需检查。
3. 确认没有孤立文档、失效链接或未记录的边界变化。
4. 汇报已完成内容、验证结果和仍待确认的事项。

## 5. Markdown 与文档地图强制规则

所有仓库自有 Markdown 文件都必须遵循 [Markdown 与文档地图规范](docs/standards/markdown.md)。第三方依赖目录不属于仓库自有文档。

必需命令：

```sh
npm run docs:lint      # lint 全部仓库自有 Markdown
npm run docs:format    # 自动修复可格式化问题
npm run docs:map       # 校验本地链接和逐层 README 索引
npm run docs:check     # 提交前完整文档检查
go -C platform/iam test -race ./...  # IAM 用例、HTTP 与可选数据库集成测试
go -C platform/iam vet ./...        # IAM 静态检查
```

文档地图必须满足：

- 根 `README.md` 索引根文档和所有含文档的一级目录。
- 每个含 Markdown 的目录必须有 `README.md` 作为该层索引。
- 索引必须链接本目录内的每个 Markdown 文件。
- 索引必须链接每个含文档的直接子目录的 `README.md`。
- 文档使用相对链接，不能出现无法从仓库内导航到的孤立文档。
- 新增、移动或删除 Markdown 时，同一变更必须更新最近索引。

任何 Markdown 变更完成前必须运行 `npm run docs:check`。不能以“只改文档”为理由跳过 lint。

## 6. 核心架构护栏

- 平台是 SaaS 控制面；API 网关是流量执行面的逻辑角色；业务应用属于业务应用平面。
- 领域边界与部署边界分离，不预先假设模块化单体、微服务数量或进程拓扑。
- Permission、Entitlement、Menu 和 Routing 是独立概念，不能相互替代。
- 菜单隐藏不是安全控制，业务 API 必须独立鉴权。
- `tenant_id` 来自可信身份上下文，不能信任客户端任意传值。
- 业务应用依赖公开 API、事件、清单和 SDK，不依赖平台内部实现。
- 流量发布使用不可变快照；控制面故障不能破坏网关执行面的上一有效配置。
- 设计与测试至少覆盖 10,000 个活跃租户、1,000,000 个注册用户及系统需求定义的派生容量。

完整规则见 [ARCHITECTURE](ARCHITECTURE.md) 和 [系统需求](docs/requirements/system-requirements.md)。

## 7. Git 与安全

- 不使用 `git reset --hard`、`git checkout --` 等命令覆盖用户改动。
- 不修改与当前任务无关的文件，不提交生成缓存或 IDE 私有状态。
- 密钥、存储凭据、网关凭据、完整访问凭证和生产环境配置不得进入仓库或日志。
- 平台跨租户管理操作必须显式授权并审计。

技术栈落地后，应把统一格式化、静态检查、单元测试、契约测试和架构检查补充到本文件的命令地图中。
