---
title: "Mini Claude Code ZH"
description: "一个从零构建的中文 Python Agent Runtime，用清晰的教学代码串起工具调用、权限控制、Hook、上下文压缩、长期记忆、持久任务、多 Agent 协作、自治认领和 Worktree 隔离。"
date: 2026-07-09
tags: ["Python", "Agent", "Claude Code", "MCP"]
role: "AI Agent Runtime Learner / Developer"
repo: "https://github.com/sswewe111/Mini-Claude-Code-ZH"
featured: true
---

Mini Claude Code ZH 是一个中文教学版 Agent 运行时项目。它的目标不是做一个完整商业 CLI，而是把 Claude Code 类编码智能体背后的运行机制拆成可读、可运行、可逐步扩展的 Python 模块：模型调用、工具执行、权限与 Hook、计划管理、子 Agent、技能加载、上下文压缩、长期记忆、错误恢复、持久任务、后台任务、定时调度、团队协作、自治任务认领和 Git worktree 隔离。

项目仓库：[sswewe111/Mini-Claude-Code-ZH](https://github.com/sswewe111/Mini-Claude-Code-ZH)

## 项目定位

这个项目围绕 `agent_loop.py` 展开，核心循环是：

```text
用户任务
  -> 运行时组装 system prompt
  -> 模型产生普通回复或 tool_call
  -> 权限系统和 Hook 检查
  -> handler 执行工具
  -> tool_result 写回 messages
  -> 进入下一轮推理
```

它把 Agent 工程拆成多个独立层次：`tools_configs/` 负责暴露给模型的工具 schema，`handlers/` 负责工具分发和执行，`managers/` 保存跨轮次状态，`prompts/` 负责系统提示词片段，`state/` 定义运行态数据结构，`utils/` 提供配置、路径沙箱、日志、消息规范化和权限检查。

## 核心能力

### Agent Loop 与工具系统

入口文件 `agent_loop.py` 使用 OpenAI 兼容客户端读取 `ANTHROPIC_BASE_URL`、`ANTHROPIC_AUTH_TOKEN` 和 `MODEL_ID`，把动态 system prompt、历史消息和 `BASE_TOOLS` 一起传给模型。模型返回工具调用后，运行时通过 `handlers.dispatcher.dispatch_tool_call` 找到对应 handler，把执行结果以 `tool` 消息写回上下文，直到模型给出最终回答。

基础工具包括 `bash`、`read_file`、`write_file`、`edit_file`。工具执行前会经过路径沙箱和权限策略，避免模型随意访问工作区外文件或执行高风险命令。

### 权限、Hook 与错误恢复

权限配置集中在 `configs/permission_config.yml`，支持 allow、deny、ask 以及危险命令拦截。`hooks/` 提供会话启动、模型调用前后、工具调用前后、停止阶段等扩展点，让日志、校验和自定义策略可以挂在主循环之外。

`RecoveryManager` 负责处理模型调用中的临时错误、上下文过长和输出截断。它会在必要时触发上下文压缩或续写提示，让 Agent 运行过程具备基础恢复能力。

### 计划、任务与调度

项目同时实现了短期计划和持久任务：

- `todo` 用于当前会话内的多步骤计划和进度同步。
- `.tasks/` 使用 JSON 文件保存跨会话任务，支持依赖、阻塞、认领、完成、取消和事件记录。
- `.runtime-tasks/` 保存后台任务和定时任务运行态。

后台任务可以把慢命令放到后台执行，避免阻塞当前 Agent 循环。定时调度器支持 `schedule_cron`、`list_crons`、`cancel_cron`，把“什么时候生产任务”和“谁来执行任务”解耦。

### 子 Agent、技能与长期记忆

`task` 工具可以启动子 Agent，把复杂探索或局部分析放进独立上下文中执行，只把最终摘要返回主 Agent。`load_skill` 会按需读取 `skills/` 下的 `SKILL.md`，让 PDF、PPT、XLSX、前端设计等专门能力在需要时才进入上下文。

长期记忆写入 `.memory/`，通过 `save_memory` 和 `forget_memory` 管理。记忆适合保存跨会话仍然有价值的信息，例如用户偏好、项目约定、历史反馈和外部资源入口。系统提示词构建阶段会把相关记忆、技能摘要、工具目录、配置规则和当前运行环境拼接成主 Agent 的行为上下文。

### Agent Teams 与 Worktree 隔离

团队系统允许 Lead Agent 使用 `spawn_teammate` 创建 teammate。成员之间通过 `.team/` 下的 inbox 和协议请求协作，支持发送消息、广播、检查收件箱、请求关闭、计划审批和协议状态追踪。

自治模块会让 teammate 在空闲时扫描任务看板，自动认领 ready task。Worktree Isolation 则通过 `worktree_create`、`worktree_bind`、`worktree_status`、`worktree_keep`、`worktree_remove` 给任务绑定独立 Git worktree，让并行 teammate 在隔离目录中读写文件，降低互相覆盖主工作区的风险。

## 项目结构

```text
agent_loop.py        # 主入口和 Agent Loop
model_client.py      # OpenAI 兼容客户端创建
configs/             # 权限、Hook、记忆、任务、团队、worktree 等配置
handlers/            # 工具 handler 与分发
hooks/               # Hook 管理器和内置 Hook
managers/            # 有状态能力管理器
prompts/             # 系统提示词和规则片段
skills/              # 可按需加载的技能说明
state/               # 运行态数据结构
subagents/           # 子 Agent、teammate 和团队协议
tools/               # bash、文件、消息总线等底层工具
tools_configs/       # 暴露给模型的工具 schema
utils/               # 配置、沙箱、日志、权限、消息规范化
docs/                # 19 个阶段的设计与实现说明
```

运行态目录包括 `.tasks/`、`.team/`、`.runtime-tasks/`、`.memory/`、`.task_outputs/`、`.transcripts/`、`.worktrees/` 和 `logs/`，用于调试、恢复和审计，不适合提交敏感内容。

## 学习路线

`docs/` 把项目拆成 19 个阶段：

1. Agent 循环
2. 工具调用
3. 权限控制
4. Hook 机制
5. 计划管理
6. 子 Agent
7. 技能加载
8. 上下文压缩
9. 长期记忆
10. 系统提示词
11. 错误恢复
12. 任务系统
13. 后台任务
14. 定时调度器
15. 智能体团队
16. 团队协议
17. 自治智能体
18. 工作树隔离
19. MCP Tools

每一章都对应一组新增模块或运行机制，适合按“最小 Agent Loop -> 工具 -> 安全边界 -> 状态持久化 -> 多 Agent 协作 -> 隔离执行”的顺序学习。

## 快速运行

依赖非常轻量：

```bash
pip install -r requirements.txt
```

`.env` 中配置 OpenAI 兼容接口：

```env
ANTHROPIC_BASE_URL=你的模型服务地址
ANTHROPIC_AUTH_TOKEN=你的 API Key
MODEL_ID=你的模型 ID
```

启动入口：

```bash
python agent_loop.py
```

当前 `agent_loop.py` 中的 `question` 是本地验证用的固定任务。测试不同阶段能力时，可以直接切换或修改其中的任务文本。

## 项目收获

通过 Mini Claude Code ZH，我把“让模型调用工具”拆成了一个完整运行时问题：怎样定义工具 schema，怎样保证 tool call 和 tool result 的消息顺序合法，怎样在执行前做权限判断，怎样把大输出压缩或落盘，怎样保存跨会话记忆，怎样把大目标变成可恢复的任务图，怎样让多个 teammate 通过文件 inbox 协作，以及怎样用 worktree 给并行修改提供工程隔离。

这个项目的价值在于把 Agent Harness 的关键部件放在一个中文、可读、可调试的代码库里。它不是为了堆功能，而是为了看清楚一个长期运行的编码 Agent 需要哪些边界、状态和协议。
