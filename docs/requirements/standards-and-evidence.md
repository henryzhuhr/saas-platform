# 安全、可靠性与多租户规范依据

| 属性 | 内容 |
| --- | --- |
| 状态 | 已启用，随需求和规范版本持续维护 |
| 适用范围 | 用户需求、系统需求、架构、测试与技术选型 |
| 目的 | 记录需求依据、适用方式和验证范围 |

## 1. 使用原则

- 正式标准、最佳现行实践、验证标准和工程指南必须区分，不混称为“强制标准”。
- 引用资料用于支撑需求和评审，不代表项目已经通过认证或合规审计。
- 需求使用自己的稳定编号；外部规范升级时更新映射，不直接改变已确认需求语义。
- 采用具体身份协议后，必须固定协议版本、安全配置和互操作范围，并形成 ADR。
- 采用具体安全控制前，应根据数据分类、威胁模型、法规和业务风险裁剪。
- 可靠性目标必须由可测量的 SLI 支撑；设计目标不等同于对外 SLA。

## 2. 依据类型

| 类型 | 含义 | 本项目使用方式 |
| --- | --- | --- |
| 标准 / 指南 | 政府或标准组织发布的正式规范 | 形成术语、身份、安全和控制基线 |
| 最佳现行实践 | 标准组织发布的当前安全实践 | 约束已选协议的安全配置和禁用项 |
| 验证标准 | 可用于检查技术安全控制的要求集合 | 建立安全测试范围和偏差记录 |
| 行业工程指南 | 权威组织公开的架构和运维实践 | 支撑多租户、容量和可靠性设计，不构成产品选型 |

## 3. 身份与访问管理依据

| 依据 | 类型 | 支撑内容 | 对应需求 |
| --- | --- | --- | --- |
| [NIST Identity and Access Management glossary](https://csrc.nist.gov/glossary/term/Identity_and_access_management) | NIST 术语 | IAM 的行业定义以及身份、角色和访问权限管理范围 | `UR-IAM-*`、`SR-IAM-*`、[术语表](glossary.md) |
| [NIST SP 800-63-4 Digital Identity Guidelines](https://www.nist.gov/publications/nist-sp-800-63-4-digital-identity-guidelines) | NIST 指南 | 数字身份风险管理、身份验证和联合保证要求 | `SR-IAM-001`、`SR-IAM-002`、`SR-IAM-007`、`NFR-SEC-001` |
| [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html) | 开放协议 | 在采用 OpenID Connect 时定义身份层、ID Token 和身份声明语义 | `SR-IAM-008`；仅在协议 ADR 接受后成为约束 |
| [IETF RFC 9700 OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/info/rfc9700/) | IETF BCP 240 | 在采用 OAuth 2.0 时约束重定向流程、重放防护、最小权限和弃用的不安全模式 | `SR-IAM-002`、`SR-IAM-008`、`NFR-SEC-003`、`NFR-SEC-007` |

OpenID Connect 和 OAuth 2.0 当前是候选开放协议，不是已经确认的实现选型。其链接用于避免未来选型仍按过时或不安全流程实现。

## 4. 应用安全与审计依据

| 依据 | 类型 | 支撑内容 | 对应需求 |
| --- | --- | --- | --- |
| [OWASP Application Security Verification Standard 5.0](https://owasp.org/www-project-application-security-verification-standard/) | 安全验证标准 | Web、API、身份验证、会话、授权、Token、通信、数据保护和安全日志验证 | `NFR-SEC-002` 至 `NFR-SEC-010`、系统验收第 11 项 |
| [NIST SP 800-53 Rev. 5](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final) | NIST 控制目录 | Access Control、Audit and Accountability、Identification and Authentication、Contingency Planning、System Integrity 与供应链控制 | `SR-AUD-*`、`NFR-AVL-005` 至 `NFR-AVL-007`、`NFR-SEC-006`、`NFR-SEC-008` 至 `NFR-SEC-010` |
| [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) | 安全工程指南 | 默认拒绝、最小权限、服务端执行授权，以及认证和授权的职责区分 | `UR-IAM-003`、`UR-IAM-004`、`SR-IAM-005`、`NFR-SEC-005` |

ASVS Level 2 是当前内部验证目标，不代表 OWASP 对本项目进行认证。采用具体 ASVS 控制时，应使用带版本的控制编号记录测试映射。

## 5. 多租户安全与规模依据

| 依据 | 类型 | 支撑内容 | 对应需求 |
| --- | --- | --- | --- |
| [AWS SaaS Lens: General design principles](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/general-design-principles.html) | SaaS 架构指南 | 绑定用户与租户身份、隔离所有租户资源、按负载与隔离特征拆分、租户级指标和规模化开通 | `SR-TEN-002`、`SR-TEN-006` 至 `SR-TEN-008`、`NFR-CAP-*`、`SR-AUD-006` |
| [AWS SaaS Lens: SaaS Identity](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/saas-identity.html) | SaaS 架构指南 | 身份与租户上下文结合，并在多租户策略中使用可信租户身份 | `UR-IAM-002`、`SR-TEN-002`、`SR-TEN-006`、可信访问上下文 |
| [AWS SaaS Lens: Tenant Isolation](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/tenant-isolation.html) | SaaS 架构指南 | 每个 SaaS 架构都必须阻止租户访问其他租户资源，隔离策略由领域和合规要求决定 | `UR-TEN-005`、`SR-TEN-006`、`SR-TEN-007`、`NFR-SEC-005` |
| [AWS SaaS Lens: Performance selection](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/pe-selection.html) | SaaS 性能指南 | 识别租户负载差异，通过隔离、伸缩和限流控制噪声邻居 | `UR-OPS-001`、`UR-OPS-002`、`NFR-CAP-005` 至 `NFR-CAP-008` |
| [OWASP Multi-Tenant Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html) | 多租户安全指南 | 可信租户上下文、资源归属校验、缓存和会话隔离、租户限流、审计与跨租户测试 | `SR-TEN-006`、`NFR-CAP-007`、`NFR-SEC-005`、系统验收第 3、4、8、11 项 |

AWS 资料用于多租户架构原则，不表示选择 AWS 服务。具体计算、存储和网络产品仍需单独选型。

## 6. 可靠性与 SLO 依据

| 依据 | 类型 | 支撑内容 | 对应需求 |
| --- | --- | --- | --- |
| [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) | 可靠性工程指南 | 区分 SLI、SLO 和 SLA；按用户目标定义可用性、延迟、错误率和吞吐指标 | `NFR-PERF-*`、`NFR-AVL-001`、`NFR-AVL-002`、可观测性要求 |
| [NIST SP 800-53 Rev. 5](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final) | NIST 控制目录 | Contingency Planning、System and Communications Protection、System and Information Integrity 等恢复与连续性控制 | `NFR-AVL-003` 至 `NFR-AVL-007`、备份与恢复验收 |
| [AWS SaaS Lens: General design principles](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/general-design-principles.html) | SaaS 架构指南 | 按租户负载与隔离特征设计、采集租户指标并支持增长 | `NFR-CAP-*`、`NFR-PERF-*`、租户级可观测性 |

当前延迟、可用性、RPO 和 RTO 是内部设计基线。进入生产承诺前，必须补充 SLI 计算公式、统计窗口、排除规则、数据来源和错误预算策略。

## 7. 需求到验证的使用方式

```text
外部依据
  → 本项目稳定需求编号
  → 架构原则或 ADR
  → 威胁模型 / SLI 定义 / 测试用例
  → 自动化验证与评审证据
```

示例：

```text
OWASP Multi-Tenant Security Cheat Sheet
  → NFR-SEC-005 默认拒绝并独立验证租户隔离
  → 可信租户上下文与数据访问层隔离设计
  → 两租户交叉访问测试矩阵
  → CI 安全回归结果
```

## 8. 维护规则

- 新增或修改安全、可靠性、多租户隔离需求时，同一变更更新本矩阵。
- 引用具体控制编号时必须包含规范版本，例如 `ASVS v5.0.0-...`。
- 外部资料被废弃或出现新稳定版本时，评估影响并记录迁移结果。
- 外部资料与本项目需求冲突时，以明确的风险评审和 ADR 处理，不能静默忽略。
- 认证、合规或审计结论必须由相应证据支持，不能仅凭文档引用宣称达标。
