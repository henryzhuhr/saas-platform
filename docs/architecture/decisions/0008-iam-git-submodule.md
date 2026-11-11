# ADR-0008：IAM 独立 Git 子仓库与同名分支协作

| 属性 | 内容 |
| --- | --- |
| 状态 | Accepted |
| 日期 | 2026-11-11 |
| 来源 | 维护者要求将 IAM 转为 saas-platform-iam Git 子模块，保持目录并推送 GitHub，分支命名与主项目一致同步 |
| 替代 | [ADR-0007](0007-iam-standalone-subproject.md) 的普通目录 Git 管理方式；其他独立项目原则保留 |
| 相关约束 | Go 模块仍为 iam；路径仍为 platform/iam；认证和租户行为不变 |

## 背景

IAM 已是完整、自包含的 Go 服务项目，但原方案仍由父仓库跟踪全部源码。维护者现在明确选择独立 Git 仓库，希望单独开发和交付，同时维持现有目录和父项目分支习惯。

## 决策

- 独立远端固定为 `git@github.com:henryzhuhr/saas-platform-iam.git`，以私有仓库初始化，避免未经确认公开 IAM 代码；公开可见性以后单独决定。
- `platform/iam` 转为 Git submodule，父仓库跟踪 `.gitmodules` 和精确 gitlink SHA，不再复制该目录源码。
- 新仓库建立 `main` 最小初始化基线，业务实现位于与父项目同名的 `codex/feat-iam`；之后使用与父项目一致的短分支、PR 和按需维护分支，不引入 `develop`。
- 共同开发使用相同分支名。`.gitmodules` 配置 `branch = .`，但普通检出、CI 和发布仍使用固定 SHA，不自动跟随分支头，也不自动重置工作树。
- 先提交并推送子仓库，确认提交可达，再提交和推送父指针；父推送使用 `--recurse-submodules=check`。
- 子 PR 合并后，父 PR 必须更新至实际合并后的子主干提交，尤其处理 Squash/Rebase 产生的新 SHA，再合并父 PR。两仓库提交不宣称原子一致。
- Go 模块名、目录与内部 API 保持不变；配置、许可证、必要文档、Markdown 工具、Agent 规则及 Go/文档 CI 随子仓库维护。
- 产品版本仍按父项目统一规范，发布追踪增加 IAM 仓库和源码 SHA；不提前引入独立组件的版本节奏或自动发布。
- 私有子模块 CI 使用维护者提供的 `SUBMODULES_READ_TOKEN` secret，权限限定为父子仓库 Contents 只读，关闭 checkout 凭据持久化；本次不自动上传本机认证信息或配置新的访问凭据。

## 备选方案与取舍

| 方案 | 取舍 |
| --- | --- |
| 继续使用普通 Monorepo 目录 | Git 操作简单，但不满足本次明确的独立仓库要求 |
| Git subtree 或复制源码 | 父库可直接检出，但增加同步与重复事实来源，不采用 |
| submodule 跟随最新分支提交 | 容易产生构建漂移，破坏固定版本验收，不采用 |
| submodule 固定 SHA、同名分支协作 | 满足独立维护和可复现集成，代价是两仓库提交、PR 和私有检出权限需要协调 |

首次导入不重写父项目历史：保留父仓库中原有文档历史，子仓库为新历史，功能代码第一次在子仓库提交。尚未提交的其他需求与评审改动不能因此顺带纳入迁移提交。

## 迁移与验证

1. 核实目标仓库无既有内容、当前分支和本地未提交改动。
2. 在现有 IAM 目录初始化 Git，创建最小主干与同名功能分支，验证后推送。
3. 父仓库仅从索引移除原目录文件，不删除工作树；添加子模块和同名分支配置，再吸收 Git 元数据。
4. 父子仓库分别校验 Markdown、Go 和状态；在仓库外递归检出父提交，确认取得相同的子 SHA 和完整工具/文档。
5. 子提交远端可达后提交父 gitlink 和本次必需的规范、导航及 CI 变更，推送当前功能分支，不直接更新父主干。

私有子模块 CI 的跨仓库只读 secret 需维护者配置后才可通过检出。未配置不能以本地 SSH 验证代替 CI 授权验收。

## 回滚与后续

集成回滚只变更 gitlink，不 force push、不改写已推送历史、不自动回滚数据库。若以后撤销子模块方式，必须另立 ADR 明确历史与源码迁回策略。

## 依据

- [Git gitmodules](https://git-scm.com/docs/gitmodules)：路径、地址、同名远端分支选项。
- [Git submodule](https://git-scm.com/docs/git-submodule)：固定版本检出、远端更新及 Git 元数据吸收。
- [actions/checkout](https://github.com/actions/checkout)：私有仓库与子模块的凭据行为。
- [版本演进与分支管理](../../standards/versioning-and-branching.md)：本项目主干、PR、发布与维护约束。
