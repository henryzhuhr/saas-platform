# ADR-0001：仓库知识库与 README 分层地图

| 属性 | 内容 |
| --- | --- |
| 状态 | Accepted |
| 日期 | 2026-07-16 |
| 范围 | 仓库结构、Markdown 文档、Agent 导航和目录 README |
| 关联规则 | `AGENTS.md`、Markdown 与文档地图规范 |

## 1. 背景

本仓库是一个面向 SaaS 平台控制面和多个业务应用的 Monorepo。它同时包含平台领域、可部署服务、业务应用、前端、契约、部署、脚本和测试等多个边界。

如果只在根目录维护一个 README，使用者和 Agent 进入某个深层目录时仍然不知道：

- 当前目录的职责是什么。
- 该目录下有哪些模块和下一层入口。
- 哪些文件是事实来源，哪些只是实现或模板。
- 该目录与相邻目录的边界如何划分。

同时，OpenAI Harness engineering 的实践强调：仓库知识应成为事实系统，Agent 应从短入口逐层发现相关上下文，而不是把所有规则塞进一个巨大的 `AGENTS.md`。

## 2. 决策

采用“根地图 + 分类地图 + 局部 README”的分层知识地图：

```text
README.md
├── AGENTS.md
├── ARCHITECTURE.md
└── docs/README.md
    ├── requirements/README.md
    ├── architecture/README.md
    │   └── decisions/README.md
    └── standards/README.md

platform/README.md
├── iam/README.md
├── tenant/README.md
└── ...
```

### 2.1 根 README

根 `README.md` 负责：

- 说明产品定位和当前项目阶段。
- 链接 `AGENTS.md`、`ARCHITECTURE.md` 和 `docs/README.md`。
- 索引所有含文档的一级目录。
- 提供进入仓库的最小上下文和常用检查命令。

根 README 不承载所有模块的详细设计，也不复制需求正文。

### 2.2 `AGENTS.md`

根 `AGENTS.md` 负责：

- 告诉 Agent 如何开始工作。
- 提供最短的事实来源地图。
- 规定必须运行的 lint、地图和验证命令。
- 保存长期有效的仓库协作约束。

它不是架构百科全书。具体需求、架构、工程规范和历史决策必须放在 `docs/` 中，再由 `AGENTS.md` 指向这些来源。

### 2.3 目录 README

每个含 Markdown 的目录必须有一个 `README.md`，作为该层的局部索引，负责：

- 说明目录职责和边界。
- 链接本目录内的文档。
- 链接含文档的直接子目录 README。
- 指向更深层的事实来源，而不是复制正文。

因此，`platform/iam/README.md` 说明 IAM 模块边界，`services/platform-api/README.md` 说明部署入口，`docs/requirements/README.md` 说明需求文档地图；它们不是重复文件，而是不同作用域的导航入口。

## 3. 为什么保留多个 README

### 3.1 渐进式披露

Agent 或新成员不需要一开始加载整个仓库。它可以先读取根地图，再根据任务进入 `platform/`、`services/` 或 `docs/requirements/`，最后只读取目标模块的局部说明。

### 3.2 降低上下文噪声

把所有说明集中到根 README 或根 `AGENTS.md` 会让无关规则挤占工作上下文，也会让真正重要的约束失去优先级。

### 3.3 目录边界可见

一个目录 README 是该目录的责任声明。它帮助使用者区分平台能力、业务实现、服务组装和公开契约，减少跨边界修改。

### 3.4 变更局部化

新增模块时只需要更新最近的目录 README 和必要的父级地图，不需要重写一个巨大的全局说明文件。

### 3.5 适合自动化维护

分层索引可以被 `scripts/check-docs-map.ts` 机械检查：

- 是否存在目录 README。
- 每个 Markdown 是否被最近索引引用。
- 子目录索引是否被父索引引用。
- 本地链接和 Markdown 锚点是否有效。
- 是否有重复索引或越出仓库边界的链接。

## 4. 被否决的备选方案

### 4.1 只保留根 README

否决原因：深层目录缺少局部职责说明，Agent 必须扫描大量文件才能建立上下文，目录边界和文档覆盖难以自动检查。

### 4.2 把所有规则写入一个巨大的 AGENTS.md

否决原因：上下文成本高、规则容易腐化、来源难以分层，也无法清楚区分长期协作规则、需求、架构和历史决策。

### 4.3 每个版本复制一套完整 README

否决原因：内容会快速漂移并产生多个互相冲突的事实来源。历史状态由 Git Tag 和必要的 Release Baseline 保存，当前 README 只描述当前地图。

### 4.4 只依赖外部 Wiki 或聊天记录

否决原因：Agent 在仓库任务中无法稳定访问这些上下文，版本也无法随代码一起审查、回滚和复现。

## 5. 约束与维护规则

1. 每个含 Markdown 的目录必须有 `README.md`。
2. README 必须索引本目录内的其他 Markdown 和含文档的直接子目录。
3. README 负责地图和边界，不复制下层文档正文。
4. 文档移动、重命名和删除必须同步更新最近索引。
5. 所有 Markdown 变更必须通过 `npm run docs:check`。
6. 重要历史决策必须形成 ADR，并进入 `docs/architecture/decisions/README.md`。
7. 被替代的 ADR 不删除，必须保留状态、替代链接和迁移说明。

## 6. 后果

### 正面影响

- 仓库入口清晰，Agent 可以按任务渐进加载上下文。
- 模块边界和责任在目录级别可见。
- 文档覆盖、链接和索引关系可自动校验。
- 历史决策、需求和架构规则可以与代码一起版本化。
- 新模块接入时拥有可复制的文档入口模式。

### 成本

- 新增或移动 Markdown 时需要维护最近索引。
- README 数量会增加，不能只靠文件名判断其是否重复。
- 需要维护地图检查器和 CI 门禁。
- README 过长或包含正文时仍可能形成新的上下文噪声，需要持续文档整理。

## 7. 后续演进

如果仓库继续扩大，可以在不改变本 ADR 原则的情况下增加：

- `docs/plans/`：执行计划、活动计划和已完成计划。
- `docs/generated/`：由代码生成并可验证的架构或数据库文档。
- `docs/references/`：经过审查的外部技术参考资料。
- 文档所有者、评审周期和新鲜度检查。
- 定期 doc-gardening 任务，发现孤立、过期或与实现不一致的文档。
