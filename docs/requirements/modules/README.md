# 模块需求地图

本目录按平台领域拆分详细用户需求和系统需求。每份模块文档同时维护范围、用户故事、系统行为、状态与不变量、异常规则、数据要求和验收场景，使领域需求可以独立评审，又能通过[需求追踪矩阵](../traceability.md)形成完整链路。

## 模块

| 模块 | 详细需求 | 对应工程边界 |
| --- | --- | --- |
| 身份与访问管理 | [iam.md](iam.md) | `platform/iam` |
| 租户、组织与隔离 | [tenant.md](tenant.md) | `platform/tenant` |
| 产品与订阅 | [subscription.md](subscription.md) | `platform/subscription` |
| 权益与配额 | [entitlement.md](entitlement.md) | `platform/entitlement` |
| 应用管理 | [application.md](application.md) | `platform/application` |
| 导航管理 | [navigation.md](navigation.md) | `platform/navigation` |
| 流量发布控制 | [routing.md](routing.md) | `platform/routing` |
| 审计与运营治理 | [audit.md](audit.md) | `platform/audit` |

## 文档结构要求

每份模块需求至少包含：

1. 目标、范围和非目标。
2. 参与角色与上下游依赖。
3. 带稳定编号的用户需求和系统需求。
4. 状态模型、领域不变量和异常处理原则。
5. 数据、权限、审计和状态传播要求。
6. 可独立转化为测试的验收场景。
7. 待确认事项和后续契约输入。

模块需求描述逻辑能力和可观察行为，不决定服务数量、数据库、消息系统、网关或部署平台。

## 编号规则

- 用户需求：`UR-<DOMAIN>-NNN`。
- 功能系统需求：`SR-<DOMAIN>-NNN`。
- 非功能需求：`NFR-<QUALITY>-NNN`，统一维护在[系统需求](../system-requirements.md)。
- 验收场景：`AC-<DOMAIN>-NNN`。

已经建立引用的编号保持稳定。`UR-SUB-003` 至 `UR-SUB-006` 和 `SR-SUB-003` 至 `SR-SUB-008` 现归属 Entitlement 模块，但保留历史前缀；后续新增权益需求使用 `ENT` 前缀。
