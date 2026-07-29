# 架构决策记录地图

本目录存放 Architecture Decision Record（ADR）。ADR 是仓库的重要历史记录，用来保存架构选择的背景、取舍、影响和演进关系。

## 已登记决策

- [ADR-0001：仓库知识库与 README 分层地图](0001-repository-knowledge-and-readme-map.md)：解释为什么各层目录保留自己的 README，以及它们如何组成 Agent 可导航的知识地图。
- [ADR-0002：技术中立且规模优先的架构基线](0002-technology-neutral-scale-first-baseline.md)：记录移除未确认产品选型、明确专业术语来源以及建立万级租户和百万级用户设计基线的原因。
- [ADR-0003：模块化需求与稳定追踪关系](0003-modular-requirements-and-traceability.md)：记录为何将产品级需求、模块详细需求和追踪矩阵分层，并保留已有需求编号。

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
