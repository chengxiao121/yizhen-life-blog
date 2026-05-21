# 一帧.life 个人博客

世界那么大，我先溜达溜达。

## 本地开发

```bash
npm install
npm run dev
```

访问 http://localhost:4321

## 写文章

在 `src/content/posts/` 下新建 `.md` 文件：

```yaml
---
title: "文章标题"
date: "2026-05-21"
tags: ["标签1", "标签2"]
description: "文章摘要"
---
正文内容...
```

文件名即为 URL slug，例如 `my-first-blog.md` 对应 `/posts/my-first-blog`。

## 部署

推送到 GitHub 后，Vercel 会自动构建部署。

## 替换头像

将你的头像图片重命名为 `avatar.jpg` 放到 `public/` 目录下。
