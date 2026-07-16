# Markdown 与文档地图规范

| 属性 | 内容 |
| --- | --- |
| 状态 | 已启用 |
| 适用范围 | 仓库自有的全部 `*.md` 文件 |
| 配置 | `.markdownlint.jsonc` |
| 地图检查器 | `scripts/check-docs-map.ts`，要求 Node.js 24+ |
| CI 门禁 | `.github/workflows/docs.yml` |

## 1. 目标

文档既服务于人，也服务于 Agent。仓库采用渐进式披露：根地图提供稳定入口，分类地图提供局部上下文，具体文档保存完整事实。

该模式参考 OpenAI [Harness engineering](https://openai.com/index/harness-engineering/) 的实践：把仓库知识作为事实系统，把 `AGENTS.md` 作为地图，并通过机械检查限制文档漂移。

## 2. 强制命令

```sh
npm run docs:lint
npm run docs:format
npm run docs:map
npm run docs:check
```

- `docs:lint`：使用 `markdownlint-cli2` 检查全部仓库自有 Markdown。
- `docs:format`：自动修复 markdownlint 支持修复的问题。
- `docs:map`：检查本地链接、Markdown 锚点、仓库边界和逐层 README 索引覆盖。
- `docs:map:json`：输出机器可读的文档地图检查结果。
- `docs:check`：提交前执行完整文档检查。

第三方依赖目录如 `node_modules/` 和本地虚拟环境不属于仓库自有文档，不参与检查。

地图检查器使用 Node.js 24 的原生 TypeScript 类型擦除直接运行，不引入额外 TypeScript 编译运行时。脚本只能使用可擦除的类型语法；如果未来需要完整静态类型检查，再单独引入 `typescript` 和 `tsconfig.json`。

Pull Request 或 `main` 分支上的文档相关变更会触发 Documentation 工作流。根据当前临时[依赖管理规范](dependencies.md)，CI 使用 `npm install --ignore-scripts --no-package-lock` 安装工具，并执行 `npm run docs:check`；检查失败时不得合并。

## 3. Markdown 格式

- 每个文件只使用一个一级标题，并以一级标题开始。
- 标题使用 ATX 风格，层级按顺序递进，不跳级。
- 标题、列表、代码块和表格前后保留空行。
- 无序列表使用 `-`；嵌套列表缩进 2 个空格。
- 有序步骤按实际顺序编号。
- 围栏代码块使用反引号并标注语言，如 `text`、`json`、`sh` 或 `mermaid`。
- 表格使用首尾管道和紧凑分隔符，单元格两侧保留空格。
- 不保留行尾空格，不使用制表符缩进 Markdown。
- 中文技术文档不强制单行字符数；长 URL 和表格不手工硬换行。
- 仓库内链接使用相对路径，外部来源使用完整 HTTPS 地址。
- 链接文字必须说明目标含义，避免使用“点击这里”。

必要的 HTML 元素由 `.markdownlint.jsonc` 白名单控制。新增元素前应确认 Markdown 无法表达同等结构。

## 4. 分层文档地图

```text
README.md
├── AGENTS.md
├── ARCHITECTURE.md
└── docs/README.md
    ├── requirements/README.md
    ├── architecture/README.md
    │   └── decisions/README.md
    └── standards/README.md
```

地图规则：

1. 每个含 Markdown 的目录必须有 `README.md`。
2. `README.md` 必须链接本目录中的所有其他 Markdown 文件。
3. `README.md` 必须链接每个含文档的直接子目录的 `README.md`。
4. 父索引只负责指向下一层索引；具体文档由最近索引负责解释。
5. 新增、移动、重命名或删除文档时，同一变更必须更新最近索引。
6. 文档不得依赖聊天记录、个人知识库或未入库文件才能理解。

`npm run docs:map` 会机械检查以上索引规则、重复索引、仓库边界、Markdown 锚点以及所有本地 Markdown 链接是否存在。

## 5. 文档内容约束

- 规范性文档应标明状态；建议使用 `草案`、`待评审`、`已确认` 或 `已废弃`。
- 已确认事实与建议基线、假设和待确认事项必须明确区分。
- 需求使用稳定编号，不能无说明删除已经被引用的编号。
- 重大架构决策写入 ADR，不只保留在聊天、Issue 或提交信息中。
- 示例必须明确是说明性示例还是稳定契约。
- 文档引用实现行为时，应在同一变更中验证实现与文档一致。
- 过期文档应更新、标记废弃并链接替代项，不能保留为无提示的冲突来源。

## 6. Agent 修改要求

Agent 修改任何 Markdown 时必须：

1. 从根 README 和最近索引定位事实来源。
2. 保持文档只承担其所在层级的职责。
3. 更新受到影响的索引和交叉链接。
4. 先运行 `npm run docs:format`，再运行 `npm run docs:check`。
5. 在交付说明中报告文档检查结果。
