# 版本演进与分支管理规范

| 属性 | 内容 |
| --- | --- |
| 状态 | 草案，待发布策略评审 |
| 适用范围 | SaaS Platform Monorepo、平台组件、业务应用和公开契约 |
| 版本模型 | Semantic Versioning（SemVer） |
| 开发模型 | Trunk-Based Development（主干开发） |

## 1. 目标

本规范统一产品版本、公开契约、业务应用、数据库迁移、Git 分支、发布、回补和停止维护规则，保证每个版本都可以回答：

- 包含哪些平台和业务组件。
- 对外行为是否兼容。
- 从哪个 Git Commit 构建。
- 应执行哪些数据迁移。
- 当前是否仍受支持。
- 修复应进入哪个分支，以及是否需要回补。

## 2. 基本原则

1. `main` 是唯一长期开发主干，并保持可构建、可测试和可发布。
2. 日常开发使用短生命周期分支，通过 Pull Request 合并。
3. 产品发布使用统一 SemVer 和 Git Tag，不从普通功能分支发布。
4. 产品版本与 API、Event、Manifest 等契约版本分开管理。
5. 已发布的 Tag、数据库迁移和发布清单不可修改。
6. 破坏性变更必须显式升级版本并提供迁移方案。
7. 修复优先进入 `main`；只有受支持旧版本确实需要时才回补。
8. 不创建长期 `develop` 分支，不使用多条永久开发主线。

## 3. 版本体系

### 3.1 产品版本

SaaS Platform 产品版本使用：

```text
MAJOR.MINOR.PATCH
```

示例：

```text
0.1.0
1.4.0
1.4.2
2.0.0-rc.1
```

版本递增规则：

| 类型 | 使用条件 | 示例 |
| --- | --- | --- |
| `MAJOR` | 存在无法通过兼容层解决的产品级破坏性变化 | `1.6.3 → 2.0.0` |
| `MINOR` | 新增向后兼容能力、应用或管理功能 | `1.6.3 → 1.7.0` |
| `PATCH` | 向后兼容缺陷、安全或文档/配置修复 | `1.6.3 → 1.6.4` |

在 `0.x` 阶段仍不得静默破坏公开契约。需要破坏 API、Event 或 Manifest 时，仍应升级对应契约主版本并提供迁移说明。

进入首次可发布版本前，应在仓库根目录创建 `VERSION`，作为产品版本的唯一事实来源。项目元数据、运行产物、部署包和发布清单中的产品版本应由工具从 `VERSION` 同步，不得长期手工维护多个不一致版本。

### 3.2 预发布版本

预发布标识遵循 SemVer：

```text
0.2.0-alpha.1    # 内部早期验证
0.2.0-beta.1     # 功能基本完整，扩大验证
0.2.0-rc.1       # 发布候选，只接受阻断性修复
```

同一阶段序号单调递增。正式版本发布后，不得继续发布同版本号的预发布构建。

### 3.3 Git Tag

正式和预发布版本使用带 `v` 前缀的注释 Tag：

```text
v0.2.0
v0.3.0-rc.1
v1.4.2
```

Tag 必须指向通过发布检查的提交。已推送 Tag 不得移动、覆盖或复用；发布错误通过新版本修复。

### 3.4 版本维度

| 对象 | 版本方式 | 说明 |
| --- | --- | --- |
| SaaS Platform 产品 | SemVer | 对外发布和统一交付版本 |
| 平台运行产物 | 跟随产品版本 | 同一次产品发布使用相同产品版本并记录内容摘要 |
| 部署包 | 跟随产品版本 | 记录产品版本、组件版本和部署 Schema 版本 |
| 业务应用 | 独立 SemVer | 在 Release Manifest 中映射到产品版本 |
| HTTP API | 主版本 | 例如 `/api/v1`，破坏性变更创建 `v2` |
| Domain Event | Schema 主版本 | 事件类型和 Schema 版本显式记录 |
| Application Manifest | `apiVersion` | 例如 `platform.example.com/v1` |
| SDK | 独立 SemVer | 兼容对应 API 与契约版本 |
| 持久化数据结构 | 顺序迁移 | 已发布迁移不可修改，只能追加 |

统一产品版本不意味着所有业务应用必须同步修改源码。未变化组件仍应记录其构建摘要和来源 Commit，以保证发布内容可追溯。

## 4. 兼容性和能力演进

### 4.1 兼容性分类

每个公开契约变更必须在 Pull Request 中回答：

1. 是否向后兼容。
2. 需要递增产品版本还是契约版本。
3. 是否需要迁移、弃用公告或双版本并行。

以下通常属于向后兼容：

- 增加可选字段且消费者可以忽略。
- 新增独立端点、事件类型或权益代码。
- 放宽输入限制且不改变现有语义。
- 修复不符合既有契约的实现。

以下属于破坏性变更：

- 删除或重命名公开字段、端点、事件或权限代码。
- 改变字段类型、单位、默认值或既有业务语义。
- 将可选字段改为必填。
- 改变错误代码、鉴权要求或租户边界。
- 修改已发布数据库迁移或使旧客户端无法继续工作。

### 4.2 生命周期

公开能力统一使用以下状态：

```text
Experimental → Stable → Deprecated → Removed
```

| 状态 | 约束 |
| --- | --- |
| `Experimental` | 可以演进，但必须明确不提供稳定性保证 |
| `Stable` | 遵守兼容性规则和维护承诺 |
| `Deprecated` | 仍可用，必须说明替代方案和最早移除版本 |
| `Removed` | 仅能在满足弃用窗口后移除，并记录迁移结果 |

弃用公告至少包含弃用对象、原因、替代方案、迁移步骤、开始弃用版本和最早移除版本。除紧急安全事件外，不允许在同一个 Minor 版本中完成“宣布弃用并移除”。

## 5. 分支模型

### 5.1 长期分支

| 分支 | 生命周期 | 用途 |
| --- | --- | --- |
| `main` | 永久 | 下一版本开发主干，必须保持健康 |
| `release/X.Y` | 按需、有限期 | 已发布 Minor 版本的补丁维护 |

不创建长期 `develop`、`integration` 或按环境划分的开发分支。开发、测试、预发和生产的差异由配置与部署系统管理，不通过长期环境分支管理。

### 5.2 为什么不使用长期 `develop` 分支

本项目选择 `main` 单主干，而不是 Git Flow 中长期存在的 `develop`，原因如下：

- `main` 与 `develop` 会形成两条长期事实来源，容易出现代码、版本和发布状态漂移。
- 功能通常需要先合入 `develop`、再合入 `main`，增加重复合并、冲突和漏合并风险。
- 长期集成分支容易积累尚未完成或无法独立发布的变化，使问题定位和回滚范围扩大。
- 分支存活时间越长，业务应用和平台模块并行修改产生的 Monorepo 冲突越多。
- Agent 和 CI 需要判断“哪条分支才是真实状态”，增加上下文和自动化复杂度。
- 开发、测试、预发、生产是部署环境，不应该与 Git 分支形成永久一一对应关系。
- 短分支加 Pull Request 能让每个变化独立验证、独立审查并快速删除，保持主干可理解。

替代流程为：

```text
短期 feat/fix/codex 分支
  → Pull Request
  → 自动化检查和评审
  → 合入 main
  → 从 main 创建 Tag 和发布产物
```

需要版本冻结或继续维护已发布 Minor 时，按需创建 `release/X.Y`。它只承担稳定和补丁维护，不替代下一版本开发主干。

只有同时出现以下情况，才重新评估额外集成分支：

- 存在无法通过 Feature Flag、兼容层或短期 Release 分支管理的大型版本开发。
- 新旧产品线需要长期并行且具有不同发布节奏。
- 已有数据证明单主干流程无法满足法规、认证或发布审批要求。
- 已明确额外分支的负责人、同步策略、退出条件和自动化防漂移检查。

即使满足重新评估条件，也应通过 ADR 记录决策，不直接创建永久 `develop`。

### 5.3 短期分支命名

人工开发分支：

```text
feat/<short-slug>
fix/<short-slug>
docs/<short-slug>
refactor/<short-slug>
chore/<short-slug>
hotfix/<version>-<short-slug>
```

Codex 创建的分支统一增加 `codex/` 前缀：

```text
codex/feat-tenant-lifecycle
codex/fix-routing-rollback
codex/docs-versioning-policy
```

分支名使用小写英文和连字符，不包含人员姓名、日期或含义不明的编号。Issue 编号可以作为后缀，例如 `fix/token-revoke-142`。

### 5.4 分支生命周期

- 从最新目标分支创建。
- 一个分支只服务一个明确目标。
- 优先在数天内完成并合并，避免长期漂移。
- 合并前同步目标分支并通过必需检查。
- 合并后删除远端短期分支。
- 禁止从未合并功能分支继续派生多层功能分支；确有依赖时应明确堆叠关系和合并顺序。

### 5.5 IAM 子仓库与同名分支协作

IAM 现在由 `git@github.com:henryzhuhr/saas-platform-iam.git` 独立维护，在 `platform/iam` 通过 Git submodule 集成；主项目只记录地址及固定 gitlink。IAM 使用本规范相同的 `main`、按需 `release/X.Y`、短期分支、提交消息与 PR 流程，不新增长期 `develop`。

父子仓库共同修改一个能力时，工作分支名称必须完全一致，例如两者都为 `codex/feat-iam`。仅修改父项目且不涉及 IAM 时不强制创建空的子仓库分支。子仓库 `main` 的首次空实现初始化是唯一引导例外，之后功能仍经 PR 合入。

`.gitmodules` 的 `branch = .` 仅在显式执行 `update --remote` 时选择同名远端分支，不会自动切换本地分支。普通 clone、CI 和发布只执行 `git submodule update --init --recursive`，检出父项目记录的精确 SHA；初始 detached HEAD 是正常的固定版本检出，修改前需创建/切换同名工作分支。

提交与推送顺序：

1. 在 IAM 完成实现、文档及测试，提交并推送同名子仓库分支。
2. 确认子仓库工作树干净、子提交可从远端取得。
3. 在父项目 `git add platform/iam`，提交固定 SHA 和相应集成变更。
4. 父项目使用 `git push --recurse-submodules=check` 防止推送不可取得的子提交。
5. 先通过 IAM PR 合入子仓库目标主干，再把父项目 PR 的 gitlink 更新到实际合并后的子提交；Squash/Rebase 后不可继续指向待删除分支的旧 SHA。

分支名相同不代表 commit SHA 相同，也不意味着自动合并/重置。正式产品版本和发布 Tag 仍按本规范统一管理，Release Manifest 额外记录 IAM 来源仓库与 SHA；尚不引入独立组件版本节奏。回滚通过评审回退父 gitlink，数据库迁移另行评估。

IAM 自带 Go、Markdown 与地图 CI；父项目 CI 递归取得锁定版本后验证集成。私有仓库场景需在父项目配置 `SUBMODULES_READ_TOKEN` Actions secret，使用仅能读取父、子两个仓库 Contents 的细粒度 token；默认 `GITHUB_TOKEN` 只具有当前仓库权限。工作流不持久化凭据，不创建或上传本机凭据；缺少 secret 时私有子模块检出会失败。

背景和取舍见 [ADR-0008](../architecture/decisions/0008-iam-git-submodule.md)。行为依据：[Git gitmodules](https://git-scm.com/docs/gitmodules)、[Git submodule](https://git-scm.com/docs/git-submodule)、[actions/checkout](https://github.com/actions/checkout)。

## 6. Pull Request 与提交

### 6.1 合并要求

所有进入 `main` 或 `release/X.Y` 的变更都通过 Pull Request。合并前至少满足：

- 需求、范围和验收结果明确。
- 自动化检查通过。
- 文档和公开契约已同步。
- 破坏性变化附带迁移与版本方案。
- 数据库迁移具备升级验证；需要回滚时说明回滚策略。
- 不包含真实密钥、生成缓存或无关修改。

默认使用 Squash Merge，使一个 Pull Request 在目标分支形成一个可追踪提交。需要保留有意义的多提交历史时，可以使用 Rebase Merge；禁止无理由产生合并提交。

### 6.2 提交消息

提交消息采用以下格式：

```text
<type>(<scope>): <summary>
```

常用类型：

```text
feat      新能力
fix       缺陷修复
docs      仅文档
refactor  不改变外部行为的重构
test      测试
build     构建和依赖
ci        CI
chore     其他维护
revert    回退提交
```

示例：

```text
feat(tenant): define suspension lifecycle
fix(routing): preserve previous release on publish failure
docs(standards): add branch maintenance policy
```

## 7. 发布流程

### 7.1 正常发布

```text
main 保持健康
  → 确定发布范围和目标版本
  → 更新 VERSION、Changelog 和 Release Manifest
  → 运行完整测试、契约检查和安全检查
  → 构建不可变产物
  → 创建预发布或正式 Tag
  → 发布运行产物和部署包
  → 验证部署与关键业务旅程
  → 发布版本说明
```

发布产物必须从 Tag 对应 Commit 构建，不允许从存在未提交修改的工作树发布。

### 7.2 Release Manifest

每次正式发布应生成不可变 Release Manifest，至少记录：

- 产品版本和 Git Commit。
- 各平台服务、业务应用及其版本。
- 运行产物名称、版本和内容摘要。
- 部署包及其 Schema 版本。
- API、Event 和 Application Manifest 契约版本。
- 持久化数据迁移范围。
- 构建时间、构建流水线和软件物料清单引用。

Release Manifest 的正式 Schema 在发布实现阶段定义。

### 7.3 Changelog

首次发布前在仓库根目录创建 `CHANGELOG.md`。内容按版本组织，至少区分：

- Added
- Changed
- Fixed
- Security
- Deprecated
- Removed
- Migration

Changelog 面向使用者描述行为变化，不复制 Git 提交列表。

## 8. 维护分支和回补

### 8.1 创建维护分支

默认只维护 `main`。只有发布版本需要继续提供补丁时，才从对应正式 Tag 创建：

```text
release/1.4    # 从 v1.4.0 或当前最新 v1.4.x 创建
```

`release/X.Y` 只接受 PATCH 级修复、必要的测试、文档和发布配置变化，不接受新功能或无关重构。

### 8.2 回补条件

旧版本回补仅适用于：

- 高危或严重安全问题。
- 数据丢失、数据损坏或租户隔离问题。
- 服务不可用或核心业务链路阻断。
- 已承诺公开契约的严重回归。
- 法规、合规或客户支持承诺要求的修复。

普通体验优化、新功能、低风险重构和仅影响未发布能力的问题不回补。

### 8.3 回补流程

```text
先确认修复已进入 main
  → 从 release/X.Y 创建 hotfix/X.Y.Z-<slug>
  → 使用 cherry-pick -x 回补最小修复
  → 解决版本差异并补充旧版本测试
  → Pull Request 合入 release/X.Y
  → 发布 PATCH 版本和新 Tag
  → 更新维护状态和版本说明
```

如果问题只存在于旧版本，可以直接在维护分支修复，但必须明确说明为什么 `main` 不需要同等修改。禁止把维护分支整体合并回 `main`。

## 9. 支持与停止维护

### 9.1 当前建议基线

正式发布策略尚未评审，以下仅作为建议基线，不构成外部 SLA：

| 交付方式 | 建议维护范围 |
| --- | --- |
| 托管 SaaS | 只维护当前线上版本，通过持续升级完成修复 |
| 客户环境部署 | 维护当前 Minor 和前一个 Minor 的安全及严重缺陷 |
| `0.x` 阶段 | 默认只维护最新 Minor，旧版本不新增一般修复 |

正式对外发布前必须确认：

- 每条版本线的支持时长。
- 安全修复等级和响应时间。
- 前一个 Minor 的维护截止日期。
- Major 升级和数据迁移支持方式。
- EOL 通知周期和客户沟通渠道。

### 9.2 维护状态

| 状态 | 含义 |
| --- | --- |
| `Active` | 接受兼容功能、缺陷和安全修复 |
| `Maintenance` | 只接受安全及严重缺陷修复 |
| `End of Life` | 不再发布修复，必须升级到受支持版本 |

版本进入 Maintenance 或 End of Life 时，必须更新版本矩阵和发布说明。EOL 分支可保留用于历史追溯，但不再接受普通变更。

## 10. 数据库与契约维护

### 10.1 数据库迁移

- 迁移文件使用全局唯一、单调递增的版本标识。
- 已进入正式 Tag 的迁移不得修改或删除。
- 修复错误迁移时追加新迁移。
- 破坏性 Schema 变化优先使用 Expand → Migrate → Contract 分阶段实施。
- 应用滚动升级期间，新旧版本必须在明确窗口内兼容同一数据库状态。
- 发布说明必须列出迁移范围、预计耗时和不可逆操作。

### 10.2 多版本契约

- API 主版本在路径或协议中显式体现。
- Event 消费者必须忽略未知可选字段，生产者不能改变已发布字段语义。
- Application Manifest 的 `apiVersion` 决定解析和校验规则。
- 新旧契约并行期间必须明确流量、消费者和移除条件。
- SDK 应声明支持的 API 与契约版本范围。

## 11. 依赖版本

依赖声明和锁文件遵循[依赖管理规范](dependencies.md)。当前暂不提交 `uv.lock` 和 `package-lock.json`，因此尚不能把依赖树视为完全可复现。

开始生产交付、生成 SBOM 或建立正式发布流水线前，必须复审锁文件策略。发布版本不能在未记录依赖解析结果的情况下宣称可完全复现。

## 12. 自动化约束

随着实现推进，应逐步增加以下机械检查：

- 校验 `VERSION`、项目元数据、运行产物和部署包版本一致。
- 校验 Git Tag 与 `VERSION` 一致。
- 校验 Release Manifest 覆盖全部发布组件。
- 检测公开 API、Event 和 Manifest 的破坏性变化。
- 校验数据库迁移编号唯一且已发布迁移未被修改。
- 限制 `release/X.Y` 只接受允许的变更类型。
- 校验 Changelog、弃用公告和迁移说明完整。

在自动化检查建立前，Pull Request 评审必须人工验证对应项目。

## 13. 例外处理

违反本规范的例外必须在 Pull Request 中说明：

- 为什么常规流程无法满足需求。
- 风险和受影响版本。
- 验证、回滚和补救方案。
- 例外失效条件。

涉及长期分支、破坏性契约、支持周期或发布方式的永久例外，应形成 ADR，而不是只保留在 Pull Request 讨论中。

## 14. 待确认事项

- 首个对外版本是 `0.1.0` 还是其他版本。
- 托管 SaaS 与私有化版本是否使用同一发布节奏。
- 私有化版本的正式支持周期和 EOL 通知周期。
- 是否采用自动 Changelog 和版本提升工具。
- 业务应用是否允许独立于平台产品版本发布。
- Release Manifest、SBOM 和制品签名的具体格式。
- `release/X.Y` 是仅按需创建，还是每个正式 Minor 固定创建。
