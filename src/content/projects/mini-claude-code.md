---
title: "Mini Claude Code"
description: "一个用于学习和复刻 Claude Code 核心机制的 Python Agent 运行时项目，覆盖工具调用、权限、记忆、上下文压缩、多 Agent 协作、Worktree 隔离和 MCP 插件等能力。"
date: 2026-06-28
tags: ["Python", "Agent", "Claude Code", "MCP"]
role: "AI Agent Runtime Learner / Developer"
repo: "https://github.com/sswewe111/Mini-Claude-Code/tree/main"
featured: true
---

Mini Claude Code 是一个面向学习和实验的 Python 项目，目标是用可读、可拆解的代码复刻 Claude Code 类编码智能体的核心运行机制。它不是完整商业 CLI，而是把 Agent 主循环、工具调用、路径沙箱、计划管理、子代理、技能系统、记忆、上下文压缩、权限、Hook、任务系统、后台任务、定时调度、团队协作、Worktree 隔离以及 MCP/插件接入等能力拆成独立模块，形成从概念到代码再到流程的学习路径。

项目仓库：[Mini Claude Code](https://github.com/sswewe111/Mini-Claude-Code/tree/main)

## 项目目标

- 用最小可读代码实现 Agent Loop：模型产生工具调用，宿主程序执行工具，再把结果写回上下文继续推理。
- 将工具系统从基础文件读写和命令执行，扩展到任务管理、后台运行、定时调度、团队协作和 MCP 外部工具。
- 演示 Claude Code 类产品中的关键工程机制，包括权限检查、上下文压缩、记忆注入、技能加载、Worktree 隔离和协议化协作。
- 通过 `docs/` 中 01 到 19 的章节文档，对应代码模块，沉淀一条完整学习路线。

## 核心架构

项目主流程从 `agent_loop.py` 进入。运行时会加载模型配置，动态构建 system prompt，注入工具列表、技能摘要、长期记忆、`CLAUDE.md` 指令和运行时上下文。模型返回 assistant 消息后，如果没有工具调用则结束本轮；如果存在工具调用，则根据工具名在 `TOOL_HANDLERS` 中找到处理函数，将执行结果以 `tool` 消息写回 `messages`，再进入下一轮模型调用。

简化流程可以概括为：

```text
user input
  -> build system prompt
  -> model call
  -> assistant text: finish
  -> assistant tool_call
       -> local handler / manager / MCP router
       -> tool_result
       -> append messages
       -> next model call
```

## 主要实现内容

### Agent 循环与工具系统

项目实现了主 Agent 的推理与工具执行循环，负责模型调用、消息维护、工具分发、消息日志保存、输出截断续写，以及 API 错误、连接错误和上下文过长后的恢复。

工具定义集中在 `tools_configs.py`，工具分发集中在 `tools_handlers.py`。内置工具覆盖 `bash`、`read_file`、`write_file`、`edit_file`、`todo`、`task`、`load_skill`、`compact`、`save_memory`、后台任务、定时调度、团队消息、持久任务和 worktree 管理等能力。

### 路径沙箱、权限与 Hook

文件访问通过路径沙箱限制在允许的工作目录中，避免工具随意读写工作区外部文件。权限系统基于配置文件按工具、命令内容和路径执行 allow/deny/ask 判断，并对高风险命令做基础拦截。

Hook 系统允许在关键执行点插入外部命令或校验逻辑，使权限、日志、格式检查和自定义策略可以通过统一机制接入主循环。

### Todo、持久任务与调度

项目区分了两类任务状态：

- `todo`：当前会话内的轻量计划，适合多步骤推理和进度同步。
- `.tasks/` 持久任务：使用 JSON 文件保存任务状态，支持负责人、依赖关系、阻塞关系和 worktree 绑定。

后台任务系统可以把耗时命令放入后台线程执行，立即返回 `task_id`，完成后将摘要通知注入下一轮 Agent 上下文。定时调度系统则支持一次性任务和持久化 cron 记录，用于处理未来触发的任务。

### 子代理与团队协作

子代理用于一次性委派读取、分析或探索任务，适合把局部上下文隔离出去，最终只把摘要结果返回主 Agent。

团队系统进一步扩展到长期运行的 teammate：可以创建队友、分配角色和初始任务，通过 inbox 发送消息，让 teammate 在空闲后自动轮询新任务，并通过结构化协议处理关机、计划审批等协作请求。

### 上下文压缩、记忆与系统提示词

上下文压缩模块提供上下文估算、工具输出压缩、大输出落盘、转录保存和历史总结能力。当 prompt 过长或工具结果过大时，系统会把关键内容压缩成可继续工作的摘要，并把完整输出保存到运行时文件中。

长期记忆默认写入 `.memory/`，每条记忆是带 frontmatter 的 Markdown 文件，并通过 `MEMORY.md` 维护索引。记忆用于保存跨会话仍有价值且不容易从代码直接推导的信息，例如用户偏好、项目约定和历史反馈。

系统提示词由多个 section 动态拼接，包括核心行为指令、可用工具列表、技能摘要、长期记忆、`CLAUDE.md` 指令，以及当前日期、工作目录、模型和平台信息。

### Worktree 隔离与 MCP 插件

Worktree 管理器使用 Git worktree 为任务创建隔离工作区，并维护 `.worktrees/index.json`。任务可以在独立目录中运行命令，完成后通过 closeout 决定保留或移除 worktree，从而降低多 Agent 并行修改代码时的互相干扰。

`mcp/` 目录实现了教学版 MCP/插件接入层，包括插件发现、MCP server 连接、工具路由、本地工具与 MCP 工具池合并，以及外部能力权限闸门。外部工具不会绕过主系统，而是统一进入权限检查、路由分发和结果标准化流程。

## 项目收获

这个项目让我把“AI 编码助手”从一个模型调用问题，拆解成一个运行时系统问题。真正困难的部分不只是让模型回答问题，而是围绕模型建立稳定的工程边界：哪些内容进入上下文，哪些状态需要持久化，哪些操作需要权限审批，哪些任务应该交给子代理，哪些并行工作必须用 worktree 隔离，以及外部插件如何进入统一治理管道。

通过实现 Mini Claude Code，我系统理解了 Claude Code 类产品背后的关键组成：Agent Loop 是心脏，工具系统是手脚，权限和沙箱是边界，记忆和压缩保证长期运行，任务与团队机制让系统从单轮对话走向持续协作。
