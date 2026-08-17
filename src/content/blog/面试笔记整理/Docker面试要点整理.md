---
title: "Docker面试要点整理"
description: "Docker"
pubDate: 2026-08-17
tags: ["Java工程", "Docker"]
series: "面试笔记整理"
---

# docker底层依托于linux怎么实现资源隔离的？
- **基于Namespace的视图隔离**：每个容器都运行在自己的一组命名空间中，包括PID（进程）、网络、挂载点、IPC（进程间通信）等。容器中的进程只能看到自己所在命名空间内的进程，而不会影响其他容器中的进程。
- **基于 cgroups 的资源隔离**：cgroups允许在进程组之间分配、限制和优先处理系统资源，如CPU、内存和磁盘I/O。提供了一种机制，用于管理和隔离进程集合的资源使用，有助于资源限制、工作负载隔离以及在不同进程组之间进行资源优先处理。

# Docker和虚拟机的区别
- **虚拟机**：每台 VM 都跑着一个完整的 Guest OS 内核，隔离性极强但开销大
- **Docker**：所有容器共享宿主机的 Linux 内核，**通过 Namespace 做视图隔离、cgroups 做资源限制**

VM 像"独立的房子"，容器像"同一栋楼里的房间"。

# Docker的三个核心组件
- **镜像**：只读模版，包含运行一个应用所需要的**代码、依赖、环境变量、配置**等
- **容器**：镜像的运行时实例，可以启动、停止、删除，是一个独立隔离的进程组
- **仓库**：存储和分发镜像的地方

三者的协作流程是：从 Registry 拉镜像 → 由镜像启动容器 → 容器运行应用。

# Docker 镜像的分层原理是什么？
Docker 镜像采用**分层只读**的结构，Dockerfile 里每一条指令都会产生一个新的镜像层 。

当容器启动时，Docker 会在所有只读层之上再叠加一层**可写层（容器层）**，容器对文件的任何修改都发生在这一层，通过 **Copy-on-Write（写时复制）** 机制实现。

# Docker镜像分层的好处
- 共享与复用：多个镜像可以共享相同的底层
- 构建缓存：重新构建时，只要某一层没变就直接复用缓存
- 增量分发：`docker pull` 只会下载变化的那一层

# Dockerfile的常用命令
- `FROM`：指定基础镜像，必须是 Dockerfile 的第一条指令
- `WORKDIR`：设置容器内的工作目录，相当于 `cd`
- `COPY` / `ADD`：把宿主机的文件拷贝到镜像里
- `RUN`：在构建阶段执行命令（如安装依赖），每条 `RUN` 产生一个新层
- `ENV`：设置环境变量（运行时也能看到）
- `ARG`：构建时的参数，只在 `docker build` 阶段有效
- `EXPOSE`：声明容器要监听的端口（只是声明，不会真的开放端口）
- `VOLUME`：声明数据卷挂载点
- `CMD` / `ENTRYPOINT`：指定容器启动时默认要运行的命令
- `USER`：切换到非 root 用户运行

# Dockerfile 中 CMD 和 ENTRYPOINT 有什么区别
- `CMD`：提供“默认命令”，**可以被 `docker run` 后面跟的参数完全覆盖**。
- `ENTRYPOINT`：设置容器的“主命令”，**不会被 `docker run` 覆盖**，后面跟的参数会作为参数追加到 `ENTRYPOINT` 后面。

# Dockerfile 中 COPY 和 ADD 有什么区别？
两者都是把文件从宿主机拷贝到镜像里，但 `ADD` 多了两个“魔法”功能：

- **自动解压**：如果源文件是 `tar.gz` 之类的压缩包，`ADD` 会自动解压到目标目录
- **支持 URL**：`ADD` 可以直接从 URL 下载远程文件到镜像里

听起来方便，但官方和 Docker 最佳实践都推荐**优先使用 `COPY`**。

# 什么是多阶段构建（multi-stage build）？有什么好处？
多阶段构建是**把"构建环境"和"运行环境"分开，大幅减小最终镜像体积。**,案例如下所示，最终镜像只基于alpine。
```dockerfile
# 第一阶段：构建
FROM golang:1.21 AS builder
WORKDIR /src
COPY . .
RUN go build -o app

# 第二阶段：运行
FROM alpine:3.18
COPY --from=builder /src/app /app
CMD ["/app"]
```

# 如何减小Docker镜像
- 选小的基础镜像
- 多阶段构建
- 合并RUN指令，减少镜像层数
- 清理构建的中间产物
- 避免在镜像里装无关调试工具

# Docker镜像的持久化方式
- **Volume（数据卷）**：默认存储在宿主机的 /var/lib/docker/volumes/ 下
- **Bind Mount（目录挂载）**：把宿主机的任意路径直接挂进容器。不利于迁移，适合**开发阶段的热更新调试**。
- **tmpfs**：挂载到宿主机内存里，容器停止数据就没了。适合存放**敏感临时数据**。

# Docker网络模式
- `bridge`（默认）：Docker 创建一个 `docker0` 虚拟网桥，每个容器分配独立 IP，容器之间通过网桥通信，访问外网通过 NAT。**单机多容器的默认场景。**
- `host`：容器直接使用宿主机的网络栈，不做隔离。性能最好但会和宿主机抢端口，无法在一台机器上起多个监听同一端口的容器。
- `none`：容器没有任何网络，只有 loopback。适合完全不需要网络的纯计算任务。
- `container`：和指定的另一个容器共享同一个网络栈（Kubernetes 里 Pod 内多个容器就是类似机制）。
- `overlay`：跨宿主机的网络，通常在 Docker Swarm 或 Kubernetes 里使用。

# Docker Compose 是什么？什么场景用？
**Docker Compose 是 Docker 官方提供的单机容器编排工具**，用一个 YAML 文件定义一组相关服务，然后一条命令启动或停止整组服务。

# Docker 常用命令有哪些？
## 镜像相关：
- `docker pull <image>`：拉镜像
- `docker images`：列出本地镜像
- `docker rmi <image>`：删除镜像
- `docker build -t name:tag .`：基于当前目录的 Dockerfile 构建镜像

## 容器相关：
- `docker run -d -p 8080:80 --name web nginx`：启动一个后台容器
- `docker ps`：查看运行中的容器（加 `-a` 看所有）
- `docker stop / start / restart <container>`：停止 / 启动 / 重启
- `docker rm <container>`：删除容器
- `docker logs -f <container>`：查看日志（`-f` 实时跟踪）
- `docker exec -it <container> bash`：进入容器
- `docker inspect <container>`：查看详细信息（JSON 格式）
- `docker stats`：查看容器资源占用

## 系统相关：
- `docker system df`：查看 Docker 占用了多少磁盘
- `docker system prune`：清理无用资源

# 如何进入一个运行中的容器
`docker exec`
```sh
docker exec -it <container> bash
# 如果镜像里没有 bash（比如 alpine 只有 sh）
docker exec -it <container> sh
```

# 容器启动后立即退出，怎么排查
- 先看日志，从日志中分析错误原因
- 看退出代码，`docker ps -a` 的 STATUS 列会显示 Exited (X) 的退出码。0 是正常退出，137 通常是 OOM 被杀（128+9），139 是段错误，其他非 0 就是应用报错
- docker容器的主进程必须前台运行
- 临时用shell进去调试，把 ENTRYPOINT 覆盖成 shell 进去查看
- 检查资源限制

# `docker commit` 和 `docker build` 有什么区别？
- docker commit：把正在运行的容器的当前状态打包成镜像
- docker build：根据Dockerfile脚本自动构建镜像。可复现、可追溯、可版本控制的。**生产环境一定要用**。

# Docker 和 Kubernetes 是什么关系？
Docker 负责"怎么把一个容器跑起来"。Kubernetes 负责"怎么把一大堆容器跨多台机器跑起来、管起来"。