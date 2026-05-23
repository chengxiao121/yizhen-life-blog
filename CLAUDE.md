# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目简介

一帧.life — 基于 Astro 5 的中文个人博客，部署在 Vercel，域名为 yizhen.life。

## 常用命令

```bash
npm run dev      # 启动开发服务器 (localhost:4321)
npm run build    # 构建静态站点，输出到 dist/
npm run preview  # 预览构建产物
```

## 架构概览

**框架**: Astro 5.7，纯静态输出（`output: 'static'`）。

**内容管理**: Markdown 文件放在 `src/content/posts/`，使用 Astro Content Collections + zod 校验。**重要**: Astro 5 的 slug 由文件名自动生成，不要在 frontmatter 或 schema 中手动定义 slug 字段，否则会构建失败。

**页面路由**:
- `src/pages/index.astro` — 首页，文章列表
- `src/pages/posts/[...slug].astro` — 文章详情（动态路由）
- `src/pages/tags/index.astro` — 标签总览
- `src/pages/tags/[tag].astro` — 按标签筛选
- `src/pages/about.astro` — 关于我

**组件**（`src/components/`）:
- `BaseLayout.astro` — 全局布局，包裹 Header + Footer
- `PostCard.astro` — 文章卡片，接收 props: title, slug, date, description, tags
- `TagList.astro` — 标签列表，支持颜色映射（技术=蓝、生活=粉、随笔=黄、Astro=紫）
- `Header.astro` / `Footer.astro` — 导航和页脚

**样式**: 全局 CSS 变量定义在 `src/styles/global.css`，使用暖色调配色（accent: #c87941）。字体为 LXGW WenKai（霞鹜文楷）。

## 写文章格式

```yaml
---
title: "文章标题"
date: "2026-05-21"
tags: ["标签1", "标签2"]
description: "文章摘要"
---
```

文件名即 URL slug，例如 `my-post.md` → `/posts/my-post`。

## 部署

推送到 GitHub 后 Vercel 自动构建部署。
