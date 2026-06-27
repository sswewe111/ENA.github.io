# Ena Blog

这是我的个人博客仓库，用来记录学习笔记、项目经历和一些个人兴趣内容。

在线访问：

```text
https://sswewe111.github.io/ENA.github.io/
```

## 关于这个博客

这个博客目前主要用于整理 AI 学习、计算机视觉学习、OpenCV 笔记、项目实践和日常学习过程中的想法。相比一个展示型主页，我更希望它是一个长期维护的知识库：文章可以持续补充，项目可以慢慢沉淀，之后回看时也能找到当时的思路。

当前内容包括：

- OpenCV 学习笔记
- AI / CV 方向学习记录
- 个人项目与练习作品
- 一些和兴趣、折腾、工具使用有关的记录

## 技术栈

本站基于 Astro 构建，并从 Atlas 项目改造而来。

- Astro
- TypeScript
- Tailwind CSS
- Markdown 内容管理
- GitHub Pages 自动部署

## 目录说明

```text
src/content/blog/       博客文章和文章相关图片
src/content/projects/   项目介绍内容
src/config/site.ts      站点名称、导航、首页文案等配置
src/pages/              页面路由
src/components/         页面组件
src/layouts/            页面布局
public/                 头像、favicon 等静态资源
.github/workflows/      GitHub Pages 部署配置
```

## 本地开发

本项目需要 Node.js `>=22.12.0`。

```sh
npm install
npm run dev
```

构建静态站点：

```sh
npm run build
```

本地预览构建结果：

```sh
npm run preview
```

## 部署

博客通过 GitHub Actions 自动部署到 GitHub Pages。推送到 `main` 分支后，工作流会自动构建并发布。

当前 GitHub Pages 地址为：

```text
https://sswewe111.github.io/ENA.github.io/
```

因为这是 GitHub Pages 项目页，站点资源路径需要带上仓库名前缀 `/ENA.github.io/`。相关配置在 [astro.config.mjs](./astro.config.mjs) 中。

## License

本项目基于原 Atlas 项目改造，遵循仓库中的 [GNU General Public License v3.0](./LICENSE)。
