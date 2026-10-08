# 一帧.life 个人博客

世界那么大，我先溜达溜达。

## 本地开发

```bash
npm install
npm run dev
```

访问 http://localhost:4321

## 写文章

用 Obsidian 打开 `src/content/posts/` 作为仓库直接写作。frontmatter 每篇手写，必填 `title`、`description`，`category` 只能是 `技术` 或 `生活`；`draft: true` 为草稿（网站不可见），写完改为 `false` 发布。完整规范见 [docs/publishing.md](./docs/publishing.md)。

```yaml
---
title: "文章标题"
date: "2026-05-21"
tags: ["标签1", "标签2"]
category: "技术"
description: "文章摘要"
draft: false
---
正文内容...
```

文件名即为 URL slug，例如 `my-first-blog.md` 对应 `/posts/my-first-blog`。**发布前确保文件名已改好。**

图片放 `src/content/posts/img/`，正文用相对路径 `![](img/xxx.png)` 引用，构建时自动优化。

## 部署

手动部署：本地 `npm run build`，将 `dist/` 上传到阿里云服务器。push 到 GitHub 仅作备份，不会自动部署。

详细的项目约定和 AI 助手须知见 [AGENTS.md](./AGENTS.md)，发文流程详见 [docs/publishing.md](./docs/publishing.md)。

## 替换头像

将你的头像图片重命名为 `avatar.jpg` 放到 `public/` 目录下。
