# SaaS Platform

SaaS Platform 是一个面向多业务应用的 SaaS 平台 Monorepo。平台以控制面为核心，为业务应用提供统一的身份与访问管理、租户管理、订阅权益、应用注册、导航、流量发布和审计能力。

## 项目状态

当前项目正在进行需求评审，并已按维护者要求启动 Go + Gin 的 IAM 首期实现。设计容量基线为 10,000 个活跃租户和 1,000,000 个注册用户；该规模尚未完成容量验收。其他平台领域仍处于需求和框架阶段。

## 解决的问题

多个业务应用接入 SaaS 平台时，通常需要重复建设以下能力：

- 用户登录、身份认证和权限管理。
- 租户、成员和租户隔离。
- 套餐、订阅、功能权益和资源配额。
- 应用入口、菜单和页面导航。
- 租户灰度、版本发布和流量路由。
- 平台操作审计和统一治理。

本项目将这些能力沉淀为平台标准，业务应用通过公开 API、应用清单、领域事件和 SDK 接入平台。

## 平台边界

平台负责管理规则、配置和治理状态；业务应用负责具体的业务流程、业务 API 和业务数据。

```text
SaaS 平台控制面
├── 身份与访问控制
├── 租户与订阅权益
├── 应用与菜单导航
├── 路由与发布控制
└── 审计与平台配置

业务应用数据面
├── 业务服务 A
├── 业务服务 B
└── 业务服务 N
```

核心边界如下：

1. 权限决定用户是否可以执行操作。
2. 权益决定租户是否开通某项能力或额度。
3. 菜单决定前端展示哪些入口，但不替代后端鉴权。
4. 路由决定请求进入哪个服务、版本或部署单元。
5. API 网关负责执行网络流量规则，平台流量模块负责规则校验、发布和回滚；具体网关尚未选型。

## 仓库结构

| 区域 | 说明 |
| --- | --- |
| [`platform/`](platform/README.md) | SaaS 平台控制面领域模块 |
| [`applications/`](applications/README.md) | 接入平台的业务应用和应用模板 |
| [`api/`](api/README.md) | API、事件和应用清单契约 |
| [`services/`](services/README.md) | 可部署服务的组装和适配入口 |
| [`frontend/`](frontend/README.md) | Portal、Console 和公共前端包 |
| [`sdk/`](sdk/README.md) | 业务应用接入 SDK |
| [`deploy/`](deploy/README.md) | 部署、环境和运行拓扑定义 |
| [`build/`](build/README.md) | 构建元数据、版本和发布产物定义 |
| [`tests/`](tests/README.md) | 集成、端到端和冒烟测试 |
| [`scripts/`](scripts/README.md) | 仓库级开发和校验脚本 |
| [`docs/`](docs/README.md) | 需求、架构、工程规范和历史决策 |

## 文档入口

- [`ARCHITECTURE.md`](ARCHITECTURE.md)：系统边界、逻辑架构、核心流程和演进约束。
- [`ROADMAP.md`](ROADMAP.md)：项目里程碑、当前阶段和未来迭代计划。
- [`docs/requirements/`](docs/requirements/README.md)：用户需求、系统需求和验收范围。
- [`docs/architecture/`](docs/architecture/README.md)：项目结构、架构说明和 ADR。
- [`docs/standards/`](docs/standards/README.md)：Markdown、依赖、版本和分支管理规范。

重要的架构和工程历史决策记录在 [`docs/architecture/decisions/`](docs/architecture/decisions/README.md)，用于解释当前结构形成的原因及后续演进依据。

## 开始参与

IAM 由独立仓库 `git@github.com:henryzhuhr/saas-platform-iam.git` 维护，通过 Git submodule 挂载于 `platform/iam`。主项目锁定具体提交；共同开发使用同名分支，先推子仓库再更新父指针。技术栈和启动步骤见 [IAM 项目](platform/iam/README.md)，接口见 [IAM v1 导航](api/iam-v1.md)，覆盖范围见 [IAM 实现说明导航](docs/architecture/iam-implementation.md)。IAM 需要 Go 1.26.11+，服务运行需要 PostgreSQL；Node.js 24+ 只用于文档工具。

首次克隆使用 `git clone --recurse-submodules git@github.com:henryzhuhr/saas-platform.git`；已有工作区先运行 `git submodule update --init --recursive`。私有 IAM 仓库需要访问权限；主项目 CI 还需配置跨仓库只读的 `SUBMODULES_READ_TOKEN` secret，详细协作和合并顺序见 [版本与分支规范](docs/standards/versioning-and-branching.md)。

提交变更前，运行：

```sh
npm install
npm run docs:check
go -C platform/iam test -race ./...
go -C platform/iam vet ./...
```

`docs:check` 会检查 Markdown 格式、本地链接和分层文档索引。

维护者可进一步阅读 [`AGENTS.md`](AGENTS.md)，了解仓库协作规则、变更流程和自动化检查约束。
