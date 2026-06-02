# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目简介

「一帧.life」个人博客，技术 + 生活分类，原宿 Decora 潮流风格。域名 yizhen.life，Vercel 自动部署。

## 常用命令

```bash
npm run dev      # 本地开发，http://localhost:4321（端口被占时自动切换到 4322）
npm run build    # 生产构建，输出到 dist/
npm run preview  # 预览构建结果
```

## 写文章

在 `src/content/posts/` 下新建 `.md` 文件，文件名即为 URL slug（`my-post.md` → `/posts/my-post`）：

```yaml
---
title: "文章标题"
date: "2026-05-23"    # 必须加引号，否则 YAML 会解析为日期对象导致 schema 校验失败
tags: ["标签1", "标签2"]
category: "技术"       # 必须是 "技术" 或 "生活"
description: "文章摘要"
draft: false           # true 则隐藏不出现在列表中
---
```

用 Obsidian 编辑文章，`.obsidian/` 目录已 gitignore。

## 技术栈

- Astro 5.x 静态生成，`output: 'static'`
- 纯 CSS + CSS 自定义属性（无 Tailwind/框架）
- 霞鹜文楷（LXGW WenKai）Google Font
- Vercel 静态部署，推送到 GitHub 自动构建

## 路由结构

```
/                  → 欢迎页（视频背景 + 进入按钮）
/blog              → 博客文章列表（左侧个人信息 + 右侧文章拼贴）
/tech              → 技术分类
/life              → 生活分类
/photos            → 照片墙（Masonry 瀑布流 + PhotoSwipe 灯箱）
/about             → 关于我
/posts/[slug]      → 文章详情
/tags              → 标签页
```

## 架构

```
src/
├── content/config.ts              # 文章 schema（Zod 验证）
├── content/posts/                 # Markdown 文章
├── layouts/BaseLayout.astro       # 唯一布局，Header + slot + Footer，页面背景图
├── components/
│   ├── Header.astro               # 贴纸式导航栏（粗描边，荧光笔高亮）
│   ├── Footer.astro               # 页脚（Kawaii 装饰线）
│   ├── PostCard.astro             # 文章卡片（拼贴式，分类彩色粗描边，hover 放大）
│   ├── TagList.astro              # 标签列表（粗描边胶囊）
│   ├── PhotoGrid.astro            # 照片墙瀑布流布局
│   └── PhotoCard.astro            # 照片卡片
├── pages/
│   ├── index.astro                # 欢迎页（视频背景，自动检测竖屏旋转）
│   ├── blog/index.astro           # 博客首页（左右布局）
│   ├── tech/index.astro           # 技术分类
│   ├── life/index.astro           # 生活分类
│   ├── about.astro                # 关于我
│   ├── photos/index.astro         # 照片墙
│   ├── posts/[...slug].astro      # 文章详情
│   └── tags/                      # 标签页
├── styles/global.css              # 全局样式和 CSS 变量
```

## 设计风格 - 原宿 Decora 潮流

- 黑色底色，高饱和黄(#FFE600)/蓝(#0066FF)/红(#FF0033)撞色
- 满版涂鸦背景（`global.css` 的 `body::before` 实现星星/圆点/十字图案）
- 平面化无阴影（`--shadow: none`），所有圆角为 0
- 粗描边 3-4px，不同组件不同颜色区分
- 大量 Kawaii 符号装饰：★ ♥ ✿ ♪ ♡ ☆
- CSS 变量以 `--deco-*` 命名（`--deco-yellow`, `--deco-pink` 等）

## 关键设计决策

- **Slug 由文件名自动生成**，不要在 frontmatter 中加 `slug` 字段（Astro 5 行为，加了会报错）
- **所有页面**使用 `BaseLayout`，通过 `<slot />` 插入内容
- **date 字段必须加引号**，否则 YAML 解析为日期对象会报 `Expected type "string", received "date"` 错误
- **文章内容**用 `.prose` class 包裹，有专门的排版样式
- **组件样式**用 Astro 的 `<style>` 作用域样式，引用全局 CSS 变量
- **欢迎页**是独立页面，不使用 BaseLayout，视频背景自动检测竖屏旋转
- **页面背景图**在 BaseLayout 中，`public/page-bg.jpg`，竖屏自动逆时针旋转 90 度铺满

## 静态资源

- `public/avatar.jpg` — 头像，关于我页面和博客首页使用
- `public/page-bg.jpg` — 博客页面背景图（导航栏以下），竖屏自动旋转
- `public/landing-bg.mp4` — 欢迎页视频背景，替换同名文件即可更换
