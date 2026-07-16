# SaaS Platform 术语表

| 属性 | 内容 |
| --- | --- |
| 状态 | 已启用 |
| 适用范围 | 需求、架构、契约、实现与测试 |
| 来源规则 | 外部术语链接原始来源；无统一外部定义的词明确标记为“本项目定义” |

## 1. 使用规则

- 面向业务和通用读者时优先使用中文；专业术语首次出现时附英文全称和缩写。
- 同一术语在用户需求、系统需求、架构和代码中保持同一语义。
- `路由` 必须明确是页面导航路由、API 资源路由还是网络流量路由。
- 具体产品名只能出现在技术选型 ADR、适配器文档或实现说明中，不能替代逻辑角色。
- 示例技术不构成选型；正式选型必须说明约束、备选方案、验证证据和退出策略。
- 外部来源只支撑该术语在相应上下文中的含义，不代表来源组织认可本项目。
- 标记为“本项目定义”的术语由本项目需求和架构赋予稳定语义，不伪称行业标准。

## 2. 平台与多租户术语

| 术语 | 英文 | 定义 | 来源 / 性质 |
| --- | --- | --- | --- |
| SaaS 平台控制面 | SaaS Control Plane | 用于开通、管理、运营和治理多租户环境的平台能力，不承载具体业务功能。 | 本项目架构定义；参考 [AWS SaaS Lens 通用设计原则](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/general-design-principles.html) |
| 业务应用平面 | Application Plane | 承载租户实际业务功能、业务规则和业务数据的应用集合。 | 本项目架构定义 |
| 接入执行面 | Access / Execution Plane | 接收、保护、匹配和转发网络请求的运行时组件集合。 | 本项目架构定义 |
| 租户 | Tenant | 在平台中拥有独立成员、配置、订阅、权益和数据边界的客户或组织。 | 项目定义参考 [AWS SaaS Lens Definitions](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/definitions.html) |
| 租户上下文 | Tenant Context | 当前操作所针对的唯一租户身份及其可信来源信息。 | [AWS SaaS Identity](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/saas-identity.html)、[OWASP Multi-Tenant Security](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html) |
| 租户隔离 | Tenant Isolation | 阻止一个租户访问或影响另一个租户资源的独立安全与资源治理机制。 | [AWS SaaS Tenant Isolation](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/tenant-isolation.html)、[OWASP Multi-Tenant Security](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html) |
| 噪声邻居 | Noisy Neighbor | 单个租户过度消耗共享资源，导致其他租户性能或可用性下降的现象。 | [AWS SaaS Lens Performance Selection](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/pe-selection.html) |
| 共享模式 | Pool | 多个租户共享计算或存储资源，并通过逻辑策略隔离。 | [AWS SaaS Lens Definitions](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/definitions.html) |
| 独占模式 | Silo | 为租户提供独立计算、存储或完整部署单元的隔离方式。 | [AWS SaaS Lens Definitions](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/definitions.html) |
| 混合模式 | Bridge | 根据领域、租户等级或合规要求混合共享与独占资源的方式。 | [AWS SaaS Lens Bridge Model](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/bridge-model.html) |

认证成功不等于完成租户隔离。系统必须分别验证主体身份、操作权限和目标资源的租户归属；依据见 [OWASP Multi-Tenant Security](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html)。

## 3. 身份与授权术语

| 术语 | 英文 | 定义 | 来源 / 性质 |
| --- | --- | --- | --- |
| 身份与访问管理 | Identity and Access Management，IAM | 管理身份生命周期、认证、会话、角色和访问权限的总称。 | [NIST IAM Glossary](https://csrc.nist.gov/glossary/term/Identity_and_access_management) |
| 身份 | Identity | 在系统范围内可唯一识别的自然人、服务或设备主体。 | 项目定义参考 [NIST SP 800-63-4](https://www.nist.gov/publications/nist-sp-800-63-4-digital-identity-guidelines) |
| 身份验证 | Authentication | 建立对主体身份可信度的过程，回答“你是谁”。 | [NIST Authentication Glossary](https://csrc.nist.gov/glossary/term/authentication) |
| 授权 | Authorization | 判断主体能否对目标资源执行某项操作，回答“你能做什么”。 | [NIST Access Control Glossary](https://csrc.nist.gov/glossary/term/access_control)、[OWASP Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) |
| 会话 | Session | 一次已验证访问关系的状态及其生命周期，不限定具体凭证格式。 | 本项目定义；安全约束参考 [NIST SP 800-63-4](https://www.nist.gov/publications/nist-sp-800-63-4-digital-identity-guidelines) |
| 多因素认证 | Multi-Factor Authentication，MFA | 使用两个或更多不同因素类别完成身份验证。 | [NIST MFA Glossary](https://csrc.nist.gov/glossary/term/Multi_Factor_Authentication) |
| 单点登录 | Single Sign-On，SSO | 使用同一账号及认证器无缝访问多个应用的认证过程。 | [NIST SSO Glossary](https://csrc.nist.gov/glossary/term/Single_Sign_On) |
| 身份联合 | Identity Federation | 在不同安全域之间基于信任关系交换身份和认证信息。 | [NIST SP 800-63-4](https://www.nist.gov/publications/nist-sp-800-63-4-digital-identity-guidelines) |
| 基于角色的访问控制 | Role-Based Access Control，RBAC | 通过角色聚合权限，再把角色授予主体的授权模型。 | [NIST RBAC Glossary](https://csrc.nist.gov/glossary/term/rbac) |
| 基于属性的访问控制 | Attribute-Based Access Control，ABAC | 根据主体、资源、操作和环境属性与策略动态判断访问的授权模型。 | [NIST SP 800-162](https://csrc.nist.gov/pubs/sp/800/162/upd2/final) |
| 权限 | Permission | 对某类资源执行某个动作的授权原子，例如 `member.invite`。 | 本项目领域定义；参考 [NIST Access Control Glossary](https://csrc.nist.gov/glossary/term/access_control) |
| 策略 | Policy | 将权限与主体、资源、租户和环境条件组合后的决策规则。 | 本项目领域定义；参考 [NIST SP 800-162](https://csrc.nist.gov/pubs/sp/800/162/upd2/final) |
| 服务身份 | Service Identity | 代表应用、任务或自动化程序进行非人工访问的身份。 | 本项目领域定义 |

`Token`、Cookie、API Key 或其他凭证是实现形式，不是身份与访问管理本身。需求文档默认使用“访问凭证”或“会话”，只有协议或实现明确后才使用具体名称。

## 4. 商业化与体验术语

本节术语没有一套适用于所有 SaaS 产品的统一标准模型，均作为本项目领域定义使用。

| 术语 | 英文 | 定义 | 来源 / 性质 |
| --- | --- | --- | --- |
| 产品 | Product | 对外提供并可被订阅的一组业务能力。 | 本项目领域定义 |
| 功能 | Feature | 产品内可独立标识、开通或限制的能力。 | 本项目领域定义 |
| 套餐 | Plan | 某一版本下功能与配额的组合定义。 | 本项目领域定义 |
| 订阅 | Subscription | 租户在一段时间内获得某产品或套餐的商业关系。 | 本项目领域定义 |
| 权益 | Entitlement | 根据订阅、覆盖和策略计算出的租户实际可用能力或额度。 | 本项目领域定义 |
| 配额 | Quota | 对某类资源数量、速率、容量或用量的限制。 | 本项目领域定义 |
| 用量 | Usage | 租户对可计量资源的实际消费记录。 | 本项目领域定义 |
| 应用 | Application | 通过平台契约注册、可独立版本化和交付的业务能力单元。 | 本项目领域定义 |
| 导航 | Navigation | 面向用户展示的应用和页面入口结构，不是安全边界。 | 本项目领域定义 |

权限属于主体，权益属于租户；二者都允许时，用户才可能使用相应业务能力。该关系是本项目授权模型，不宣称为外部统一标准。

## 5. 流量与发布术语

| 术语 | 英文 | 定义 | 来源 / 性质 |
| --- | --- | --- | --- |
| API 网关 | API Gateway | 承担外部请求接入、协议处理、流量策略和请求转发的逻辑角色，不指代具体产品。 | 本项目架构定义 |
| 网络流量路由 | Traffic Routing | 根据入口、请求属性、租户或版本把网络请求转发到目标的规则。 | 本项目架构定义 |
| 页面路由 | Page Route | 前端地址与页面组件或视图之间的映射。 | 本项目架构定义 |
| API 资源 | API Resource | 可被授权和调用的接口动作，不等同于网关路由配置。 | 本项目领域定义 |
| 控制面 | Control Plane | 创建、校验、审核和发布流量规则的一侧。 | 本项目架构定义 |
| 执行面 | Data / Execution Plane | 在运行时匹配规则并转发请求的一侧。 | 本项目架构定义 |
| 发布快照 | Release Snapshot | 一次发布所使用的完整、不可变且可校验的配置版本。 | 本项目架构定义 |
| 灰度发布 | Progressive Delivery | 先让受控范围使用候选版本，再根据结果扩大或回退的发布方式。 | 本项目工程定义 |

## 6. 可靠性术语

| 术语 | 英文 | 定义 | 来源 / 性质 |
| --- | --- | --- | --- |
| 服务等级指标 | Service Level Indicator，SLI | 对可用性、延迟、错误率、吞吐或正确性的定量测量。 | [Google SRE Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) |
| 服务等级目标 | Service Level Objective，SLO | 某个 SLI 在指定范围和时间窗口内的内部目标。 | [Google SRE Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) |
| 服务等级协议 | Service Level Agreement，SLA | 对外承诺及未达成时的责任约定，不等同于内部 SLO。 | [Google SRE Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) |
| 恢复点目标 | Recovery Point Objective，RPO | 故障后数据必须恢复到的时间点目标，用于约束可接受的数据丢失范围。 | [NIST RPO Glossary](https://csrc.nist.gov/glossary/term/Recovery_Point_Objective) |
| 恢复时间目标 | Recovery Time Objective，RTO | 系统恢复阶段在影响业务任务前所允许的时间目标。 | [NIST RTO Glossary](https://csrc.nist.gov/glossary/term/Recovery_Time_Objective) |
| 最终一致性 | Eventual Consistency | 状态允许短暂不一致，但在规定传播窗口内收敛到一致。 | 本项目工程定义 |
| 幂等 | Idempotency | 同一操作重复执行时，预期业务效果与执行一次相同。 | 项目定义参考 [RFC 9110 §9.2.2](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2) |

## 7. 来源维护

- 外部来源及其需求映射统一维护在[安全、可靠性与多租户规范依据](standards-and-evidence.md)。
- NIST 术语可能因来源文档和上下文存在多个定义；本表采用与本项目最相关的语义，并保留原始链接。
- 外部规范升级后先评估语义和兼容性影响，不直接静默改写项目定义。
- 本项目定义发生实质变化时，更新相关需求、架构和契约；重大变化形成 ADR。
