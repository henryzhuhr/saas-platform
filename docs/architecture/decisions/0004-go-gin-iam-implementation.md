# ADR-0004：Go + Gin IAM 首期实现

| 属性 | 内容 |
| --- | --- |
| 状态 | Accepted，仅限当前实验性 IAM 实现；生产存储和容量选型仍待验证 |
| 日期 | 2026-11-10 |
| 来源 | 维护者要求实现 IAM，并明确指定 Go + Gin |
| 关联需求 | `SR-IAM-001` 至 `SR-IAM-011`、`NFR-SEC-004`、`NFR-SEC-005` |

2026-11-11 的 [ADR-0005](0005-iam-module-layout-and-comments.md) 调整了下述历史方案中的目录与模块位置：IAM 的全部代码和 `go.mod` 已迁入 `platform/iam`，模块内部采用 `cmd`/`internal`。本 ADR 其余技术与安全取舍继续有效；历史描述保留以解释演进过程。

同日的 [ADR-0006](0006-iam-gorm-model-layer.md) 替代了下述直接 pgx 仓储实现：持久化改为 `internal/model` 中的 GORM 模型与仓储，PostgreSQL、事务及原表数据兼容策略保留。直接驱动访问属于历史方案。

## 背景

仓库此前只有需求与框架。M0 评审已经确认全局用户、多租户成员、登录标识唯一性、手机号/邮箱验证、原生认证、服务身份、关闭公开注册和复用已有用户等规则。维护者现在授权进入 IAM 实现，并指定 Go + Gin。Q12 尚未确认，不能把“邀请尚不存在的用户后如何激活”写成已确认需求。

## 决策

- 使用根 Go module，Go 1.26.10+；Gin 只出现在 HTTP 适配层。首次扫描发现本机 1.26.3 标准库与 QUIC 间接依赖已有修复版本，因此项目指定修复工具链并升级依赖，不修改系统安装。
- `platform/iam` 只依赖标准库，通过端口访问持久化、安全组件、租户目录、应用所有权和消息发送。
- 当前 PostgreSQL/pgx 适配器使用带主键、所有者及租户索引的 JSONB 聚合信封；这是可运行的初始适配方案，生产表拆分、分区和读模型需结合负载测试复审。
- 数据库事务使用 Serializable；唯一性、角色变更、挑战消费、会话轮换与事件写入原子提交。并发冲突返回 `409`，不自动重放包含外部调用的用例。
- 会话使用不透明随机 Bearer 凭据，数据库只保存 HMAC 摘要；不签发自定义 JWT 或复制完整权限集合。
- 密码使用 `golang.org/x/crypto/argon2` 的 Argon2id。一次性挑战使用带服务器密钥的摘要；TOTP 和消息秘密使用 AES-GCM 加密。
- 强化认证采用 TOTP 初始适配器；平台管理操作要求近期 MFA，接口允许后续替换或增加认证方式。
- 邮件和短信先原子写入加密消息队列，由 worker 发送。审计事件写入逐项 ACK 的 outbox，消费者按事件 ID 去重。
- Tenant 继续拥有成员关系和邀请接受。IAM 只支持已存在用户的邀请协调；新用户激活、企业 SSO、LDAP、目录同步和开放注册只有扩展边界，未启用。
- `go.mod` 与 `go.sum` 跟踪；已有 Python/npm 锁文件临时策略不变。

## 备选方案与取舍

| 方案 | 取舍 |
| --- | --- |
| Python + FastAPI | 初始草稿被维护者指定 Go + Gin 后撤回，不保留第二套后端 |
| Gin 同时包含领域和存储逻辑 | 容易让 HTTP 和数据库类型穿透模块边界，未采用 |
| 仅内存仓库作为运行服务 | 无法跨副本共享撤销和唯一性状态；只用于测试 |
| 直接在登录接口同步发送邮件 | 会使供应商失败和网络时间影响账号枚举防护；改为加密持久队列 |
| 自包含长生命周期访问声明 | 撤销与权限变化不易及时生效；当前使用服务端会话及实时状态校验 |
| 所有领域立即拆成独立服务 | 当前需求与容量证据不足；本次只组装 IAM，其他领域保持端口 |

## 影响与限制

当前版本为 `Experimental`。PostgreSQL 集成测试可以验证事务、跨连接持久化、挑战并发消费和 outbox，但不能证明百万用户、万租户、99.95% 可用性或生产 SLO。业务应用热路径的本地授权读模型和撤销分发尚待实现，不能把当前远程接口作为所有业务请求的强制串行依赖。

默认安全参数是可复审的工程基线，不是新增的用户确认结论。MFA 恢复、账号恢复、审计保留、消息清理、数据库备份及密钥轮换仍需后续运营方案。

## 迁移与退出策略

领域端口和 `/api/v1/iam` 语义作为替换边界。存储表结构演进时追加迁移、保留旧适配器兼容窗口并迁移聚合数据；认证方式通过凭据端口扩展。进入 Stable 前必须增加容量、故障恢复、完整身份生命周期和供应链验证，不修改历史已发布迁移。

## 依据

- [Gin 官方文档](https://gin-gonic.com/en/docs/)：HTTP 路由和框架边界。
- [Go Argon2 文档](https://pkg.go.dev/golang.org/x/crypto/argon2)：使用受维护的密码派生实现。
- [pgx 官方文档](https://pkg.go.dev/github.com/jackc/pgx/v5)：连接池和事务适配。
- [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)：Argon2id 密码存储基线。
- [OWASP MFA](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html)：认证因素与敏感操作控制。

实现范围与测试映射见 [IAM 实现说明](../iam-implementation.md)。
