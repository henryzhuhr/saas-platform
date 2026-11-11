# ADR-0006：IAM 使用 internal/model 与 GORM 持久化

| 属性 | 内容 |
| --- | --- |
| 状态 | Accepted |
| 日期 | 2026-11-11 |
| 来源 | 用户明确要求持久化目录为 internal/model，并使用 GORM 实现 |
| 关联 | [ADR-0004](0004-go-gin-iam-implementation.md)、[ADR-0005](0005-iam-module-layout-and-comments.md)、IAM 存储端口与可靠状态传播要求 |

## 背景

此前 IAM 通过 `internal/postgres` 中直接使用 pgx 的仓储访问数据库。用户现在指定 `internal/model` 与 GORM。该调整涉及表模型、事务、查询、消息/事件 outbox、命令组装与数据库测试，需要整体迁移，不能只重命名目录或只给原有驱动调用包一层 ORM 类型。

## 决策

- IAM 持久化统一位于 `platform/iam/internal/model`，使用 GORM PostgreSQL 驱动；旧 `internal/postgres` 源码移除。
- `models.go` 定义 GORM `Record` 与 `Outbox` 表模型，固定既有表名与复合主键，identity 字段只读。不嵌入 `gorm.Model`，避免无意引入软删除、额外主键或自动时间列。
- `json.go` 实现 JSONB 的 SQL 扫描与值编码；非法数据拒绝写入，读取时复制驱动缓冲区。
- `repository.go` 通过 GORM 查询、创建、删除和冲突子句实现 `iam.Tx`；所有输入参数绑定，有界范围查询继续拒绝超过 1,000 条的聚合集合。
- `Store.Update` 使用 GORM 显式可串行化事务；不自动重放可能含跨服务副作用的领域回调。ORM/SQLSTATE 错误在模型包转换为既有领域错误。
- outbox 使用 GORM `FOR UPDATE SKIP LOCKED` 领取记录，成功后逐项 ACK，失败时提交尝试次数与数据库时钟退避；消费者继续按记录 ID 去重。
- 关闭默认 SQL 日志，避免身份标识、凭据摘要、密文或连接秘密进入 ORM 日志。
- GORM 底层 `database/sql` 连接池显式设置上限，当前初值为 16 个打开连接、4 个空闲连接、5 分钟空闲期限和 30 分钟连接生命周期；生产连接预算需另行容量验证。
- 域模型和用例仍位于 `internal/iam`，不加入 GORM 标签、不依赖数据库驱动；公开 HTTP 接口不因 ORM 调整而变化。
- 本次依赖扫描发现 Go 1.26.10 标准库的 HTTP 漏洞已有修复，项目工具链更新为 Go 1.26.11；系统安装保持不变，具体版本由模块 `go.mod` 约束。

## 数据与迁移兼容

本次沿用 `iam_records`、`iam_outbox` 与初始结构版本标记，模型层映射原聚合信封，不重新设计用户/角色的领域存储语义，也不重置既有记录。具体实体表拆分、分区和读模型仍需对应负载与迁移评审。

`Migrate` 通过 GORM 事务执行明确的初始化 SQL，以保留既有 identity、索引和外键定义；不在每个服务副本启动时自动执行 `AutoMigrate`。引入 ORM 不改变版本化迁移、历史保留和发布审计规则。

GORM 的 PostgreSQL 驱动仍可间接依赖 pgx，但应用仓储不再直接使用 pgx API。选择 `internal/model` 是本项目的职责约定，不是 Go 官方对所有项目的强制目录名称。

## 备选方案

| 方案 | 取舍 |
| --- | --- |
| 只把 postgres 目录改成 model | 没有实现用户指定的 ORM 调整，未采用 |
| 在原 pgx 仓储旁再新增 GORM 仓储 | 两套行为与迁移易漂移，未并行保留 |
| 同时改成全新用户/角色表结构 | 超出当前目录与 ORM 调整范围，会引入额外数据迁移，未采用 |
| GORM 模型与仓储映射当前表 | 满足用户选择，并保留既有接口、记录和事务要求 |

## 验证与后续

数据库测试覆盖重复迁移、JSONB 零值更新、复合主键、identity 生成、范围隔离、超限拒绝、事件只追加、事务回滚、共享会话、挑战并发消费、outbox 重试与并发领取。测试必须连接专用可丢弃 PostgreSQL，不能依赖内存仓库来证明真实 ORM 事务语义。

完整生产容量、备份恢复、密钥轮换和高吞吐调优继续按原里程碑验证。本 ADR 只调整 ADR-0004 的直接驱动实现及 ADR-0005 的存储包位置，其他领域与模块组织决定保留。

## 参考来源

- [GORM 数据库连接](https://gorm.io/docs/connecting_to_the_database.html)：PostgreSQL 适配与连接管理。
- [GORM 事务](https://gorm.io/docs/transactions.html)：回调事务与提交/回滚。
- [GORM 高级查询](https://gorm.io/docs/advanced_query.html)：行锁与 `SKIP LOCKED`。
- [GORM 错误处理](https://gorm.io/docs/error_handling.html)：不存在及驱动错误处理边界。
- [GORM 迁移](https://gorm.io/docs/migration.html)：模型迁移能力和 `AutoMigrate` 的行为范围。
