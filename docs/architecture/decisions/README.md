# 架构决策记录地图

本目录存放 Architecture Decision Record（ADR）。ADR 是仓库的重要历史记录，用来保存架构选择的背景、取舍、影响和演进关系。

## 已登记决策

- [ADR-0001：仓库知识库与 README 分层地图](0001-repository-knowledge-and-readme-map.md)：解释为什么各层目录保留自己的 README，以及它们如何组成 Agent 可导航的知识地图。
- [ADR-0002：技术中立且规模优先的架构基线](0002-technology-neutral-scale-first-baseline.md)：记录移除未确认产品选型、明确专业术语来源以及建立万级租户和百万级用户设计基线的原因。
- [ADR-0003：模块化需求与稳定追踪关系](0003-modular-requirements-and-traceability.md)：记录为何将产品级需求、模块详细需求和追踪矩阵分层，并保留已有需求编号。
- [ADR-0004：Go + Gin IAM 首期实现](0004-go-gin-iam-implementation.md)：记录维护者指定的语言和框架、可替换存储、安全实现及首期验证边界。
- [ADR-0005：IAM 独立 Go 模块与职责拆分](0005-iam-module-layout-and-comments.md)：全部 IAM 代码与依赖元数据归属 platform/iam，采用模块内 cmd/internal，拆分职责并完善注释。
- [ADR-0006：IAM 使用 internal/model 与 GORM 持久化](0006-iam-gorm-model-layer.md)：记录 GORM 表模型、仓储、事务、outbox、既有数据兼容与数据库验证边界。
- [ADR-0007：IAM 作为可独立使用的 Go 子项目](0007-iam-standalone-subproject.md)：历史独立项目边界；Git 集成方式已由 ADR-0008 替代。
- [ADR-0008：IAM 独立 Git 子仓库与同名分支协作](0008-iam-git-submodule.md)：固定 gitlink、推送/合并顺序、独立 CI 与私有仓库检出权限。

## 命名

```text
NNNN-short-kebab-case-title.md
```

## 状态

- `Proposed`：待评审。
- `Accepted`：已确认并生效。
- `Superseded`：已被新 ADR 替代，必须链接替代项。
- `Deprecated`：不再推荐，但可能仍存在历史使用。

## 最小内容

每个 ADR 至少包含背景、决策、备选方案、影响、迁移方式、状态和关联需求。新增 ADR 后必须在本索引中登记。

已被替代的决策不得删除；应保留原文，更新状态为 `Superseded`，并链接新的 ADR。
