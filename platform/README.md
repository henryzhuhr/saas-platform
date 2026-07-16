# Platform

平台控制面领域模块。领域边界与部署边界分离；各模块保持独立模型、接口和数据所有权，实际部署拓扑由容量和可靠性验证决定。

## 模块地图

| 模块 | 索引 | 职责 |
| --- | --- | --- |
| IAM | [iam/README.md](iam/README.md) | 身份、认证、会话、角色、权限和策略 |
| Tenant | [tenant/README.md](tenant/README.md) | 租户生命周期、成员、组织、标签和隔离策略 |
| Subscription | [subscription/README.md](subscription/README.md) | 产品、功能、套餐版本和订阅状态 |
| Entitlement | [entitlement/README.md](entitlement/README.md) | 权益定义、授权、覆盖和配额计算 |
| Application | [application/README.md](application/README.md) | 应用注册、清单版本、启停和开通范围 |
| Navigation | [navigation/README.md](navigation/README.md) | 菜单树、入口和可见性计算 |
| Routing | [routing/README.md](routing/README.md) | 网络流量规则、灰度、发布快照和回滚 |
| Audit | [audit/README.md](audit/README.md) | 审计契约、完整性、查询和运营治理 |

完整模块边界见 [项目结构与模块边界](../docs/architecture/project-structure.md)。
