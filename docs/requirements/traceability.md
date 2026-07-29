# 需求追踪矩阵

| 属性 | 内容 |
| --- | --- |
| 状态 | 草案，随需求、契约和测试持续维护 |
| 追踪方向 | 用户需求 → 系统需求 → 验收场景 |
| 当前范围 | 8 个平台领域、跨模块接口和全局非功能要求 |

## 1. 使用规则

- 模块文档是用户需求、功能系统需求和验收场景正文的权威来源；本文件只维护映射。
- 一个用户需求可以映射多个系统需求和验收场景。
- P0 用户需求必须至少映射一个功能系统需求和一个验收场景。
- 后续契约、ADR 和自动化测试在本矩阵增加对应列或独立机器可读映射，不改写需求语义。
- 需求废弃时保留所在行，标记状态并链接替代项。

## 2. 身份与访问管理

| 用户需求 | 系统需求 | 验收场景 |
| --- | --- | --- |
| `UR-IAM-001` | `SR-IAM-001`、`SR-IAM-002`、`SR-IAM-006` | `AC-IAM-001`、`AC-IAM-002`、`AC-IAM-006` |
| `UR-IAM-002` | `SR-IAM-005`、`SR-TEN-002` | `AC-IAM-003` |
| `UR-IAM-003` | `SR-IAM-003`、`SR-IAM-005`、`SR-TEN-006` | `AC-IAM-004` |
| `UR-IAM-004` | `SR-IAM-004`、`SR-IAM-005`、`SR-IAM-010`、`SR-TEN-006` | `AC-IAM-005` |
| `UR-IAM-005` | `SR-IAM-008` | `AC-IAM-010` |
| `UR-IAM-006` | `SR-IAM-009` | `AC-IAM-008` |
| `UR-IAM-007` | `SR-IAM-007` | `AC-IAM-007` |
| `UR-IAM-008` | `SR-IAM-001`、`SR-IAM-006` | `AC-IAM-009` |

## 3. 租户、组织与隔离

| 用户需求 | 系统需求 | 验收场景 |
| --- | --- | --- |
| `UR-TEN-001` | `SR-TEN-001`、`SR-TEN-005`、`SR-TEN-008` | `AC-TEN-001`、`AC-TEN-006`、`AC-TEN-007` |
| `UR-TEN-002` | `SR-TEN-002`、`SR-TEN-003` | `AC-TEN-002`、`AC-TEN-003`、`AC-TEN-004` |
| `UR-TEN-003` | `SR-TEN-001`、`SR-TEN-008` | `AC-TEN-010` |
| `UR-TEN-004` | `SR-TEN-004` | `AC-TEN-008` |
| `UR-TEN-005` | `SR-TEN-006`、`SR-TEN-007` | `AC-TEN-005`、`AC-TEN-006`、`AC-TEN-009` |
| `UR-TEN-006` | `SR-TEN-008`、`SR-API-005` | `AC-TEN-011` |

## 4. 产品与订阅

| 用户需求 | 系统需求 | 验收场景 |
| --- | --- | --- |
| `UR-SUB-001` | `SR-SUB-001`、`SR-SUB-007` | `AC-SUB-001`、`AC-SUB-002` |
| `UR-SUB-002` | `SR-SUB-002`、`SR-SUB-007`、`SR-API-003` | `AC-SUB-003` 至 `AC-SUB-008` |

## 5. 权益与配额

| 用户需求 | 系统需求 | 验收场景 |
| --- | --- | --- |
| `UR-SUB-003` | `SR-SUB-003`、`SR-SUB-004`、`SR-SUB-008` | `AC-ENT-001`、`AC-ENT-002`、`AC-ENT-006` |
| `UR-SUB-004` | `SR-SUB-006`、`SR-API-003` | `AC-ENT-004`、`AC-ENT-005` |
| `UR-SUB-005` | `SR-SUB-005`、`SR-SUB-007` | `AC-ENT-003`、`AC-ENT-008` |
| `UR-SUB-006` | `SR-SUB-004`、`SR-SUB-008`、`SR-API-005` | `AC-ENT-007` |

## 6. 应用管理

| 用户需求 | 系统需求 | 验收场景 |
| --- | --- | --- |
| `UR-APP-001` | `SR-APP-001` 至 `SR-APP-003` | `AC-APP-001`、`AC-APP-004` |
| `UR-APP-002` | `SR-APP-005`、`SR-APP-006` | `AC-APP-005`、`AC-APP-008`、`AC-APP-009` |
| `UR-APP-003` | `SR-APP-002`、`SR-APP-004` | `AC-APP-002` 至 `AC-APP-004` |
| `UR-APP-004` | `SR-APP-001`、`SR-APP-004`、`SR-APP-006`、`SR-APP-007` | `AC-APP-003`、`AC-APP-006` |
| `UR-APP-005` | `SR-APP-005`、`SR-API-003` | `AC-APP-007`、`AC-APP-008` |

## 7. 导航管理

| 用户需求 | 系统需求 | 验收场景 |
| --- | --- | --- |
| `UR-NAV-001` | `SR-NAV-001`、`SR-NAV-003`、`SR-NAV-004`、`SR-NAV-006` | `AC-NAV-001`、`AC-NAV-005`、`AC-NAV-006` |
| `UR-NAV-002` | `SR-NAV-002`、`SR-NAV-003`、`SR-NAV-006` | `AC-NAV-002`、`AC-NAV-003`、`AC-NAV-008` |
| `UR-NAV-003` | `SR-NAV-002`、`SR-NAV-006` | `AC-NAV-004` |
| `UR-NAV-004` | `SR-NAV-005` | `AC-NAV-007` |

## 8. 流量发布控制

| 用户需求 | 系统需求 | 验收场景 |
| --- | --- | --- |
| `UR-ROUTE-001` | `SR-ROUTE-001`、`SR-ROUTE-009` | `AC-ROUTE-001`、`AC-ROUTE-002` |
| `UR-ROUTE-002` | `SR-ROUTE-002`、`SR-ROUTE-003` | `AC-ROUTE-001`、`AC-ROUTE-002` |
| `UR-ROUTE-003` | `SR-ROUTE-003` 至 `SR-ROUTE-005`、`SR-ROUTE-008`、`SR-ROUTE-009` | `AC-ROUTE-003` 至 `AC-ROUTE-005`、`AC-ROUTE-009` |
| `UR-ROUTE-004` | `SR-ROUTE-006` | `AC-ROUTE-007` |
| `UR-ROUTE-005` | `SR-ROUTE-007` | `AC-ROUTE-006` |

## 9. 审计与运营治理

| 用户需求 | 系统需求 | 验收场景 |
| --- | --- | --- |
| `UR-AUD-001` | `SR-AUD-001` 至 `SR-AUD-004` | `AC-AUD-001`、`AC-AUD-004` 至 `AC-AUD-006` |
| `UR-AUD-002` | `SR-AUD-001`、`SR-AUD-002`、`SR-AUD-004`、`SR-API-004` | `AC-AUD-002` |
| `UR-AUD-003` | `SR-AUD-002`、`SR-AUD-005` | `AC-AUD-003` |
| `UR-OPS-001` | `SR-AUD-006`、`NFR-CAP-006`、`NFR-SEC-009` | `AC-AUD-007` |
| `UR-OPS-002` | `SR-AUD-006`、`NFR-CAP-007` | `AC-AUD-008` |
| `UR-OPS-003` | `SR-ROUTE-004`、`SR-AUD-001`、交付与运行要求 | `AC-ROUTE-007`、`AC-AUD-010` |

## 10. 跨模块接口需求映射

| 系统需求 | 主要用户需求来源 |
| --- | --- |
| `SR-API-001` | `UR-APP-001`、`UR-APP-004`、`UR-AUD-003` |
| `SR-API-002` | `UR-TEN-002`、`UR-SUB-002`、`UR-AUD-001` |
| `SR-API-003` | `UR-TEN-001`、`UR-SUB-002`、`UR-SUB-004`、`UR-APP-005`、`UR-ROUTE-003` |
| `SR-API-004` | `UR-AUD-002` |
| `SR-API-005` | `UR-IAM-002`、`UR-TEN-006`、`UR-SUB-006`、`UR-NAV-001` |
| `SR-API-006` | `UR-IAM-006`、`UR-TEN-002`、`UR-OPS-001` |
| `SR-API-007` | `UR-TEN-001`、`UR-SUB-002`、`UR-APP-005`、`UR-ROUTE-003`、`UR-AUD-001` |

## 11. 跨模块非功能映射

| 质量属性 | 主要需求 | 重点模块与场景 |
| --- | --- | --- |
| 容量与伸缩 | `NFR-CAP-001` 至 `NFR-CAP-008` | IAM、Tenant、Entitlement、Audit；大租户和混合负载 |
| 性能与传播 | `NFR-PERF-001` 至 `NFR-PERF-008` | 登录、授权、权益、导航和流量发布传播 |
| 可用性与恢复 | `NFR-AVL-001` 至 `NFR-AVL-007` | 运行时读取、执行面最后有效配置和权威数据恢复 |
| 安全与隐私 | `NFR-SEC-001` 至 `NFR-SEC-010` | 全模块；身份、跨租户、供应链、数据生命周期和审计 |

## 12. 后续扩展

进入契约设计后，本矩阵增加：

- API 操作或 Schema 标识。
- Domain Event 类型和版本。
- ADR 编号。
- 自动化测试标识和测试层级。
- 首次实现版本、当前状态和验证证据链接。
