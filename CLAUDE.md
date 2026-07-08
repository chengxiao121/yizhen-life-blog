# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目简介

「一帧.life」个人博客，技术 + 生活分类，原宿 Decora 潮流风格。域名 yizhen.life，Vercel 自动部署。

> 📄 完整项目文档见 `./PRDS/project-document.md`

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

## 技术栈（精简）

- Astro 5.x 静态生成，`output: 'static'`
- 纯 CSS + CSS 自定义属性（无 Tailwind/框架）
- 霞鹜文楷（LXGW WenKai）Google Font
- Vercel 静态部署，推送到 GitHub 自动构建

> 详细技术栈见 `./PRDS/project-document.md` 第 3 章

## 路由结构

```
/                  → 欢迎页（视频背景 + 进入按钮）
/blog              → 博客首页（2 列文章网格，特色文章大卡片横跨两列）
/tech              → 技术分类
/life              → 生活分类
/photos            → 照片墙（Masonry 瀑布流 + PhotoSwipe 灯箱）
/about             → 关于我
/posts/[slug]      → 文章详情
/tags              → 标签页
```

> 完整页面结构见 `./PRDS/project-document.md` 第 2 章

## 关键设计决策（AI 必须知道）

### Slug 规则
- **Slug 由文件名自动生成**，不要在 frontmatter 中加 `slug` 字段（Astro 5 行为，加了会报错）

### date 字段
- **date 字段必须加引号**，否则 YAML 解析为日期对象会报 `Expected type "string", received "date"` 错误

### 布局系统
- **所有页面**使用 `BaseLayout`，通过 `<slot />` 插入内容
- **欢迎页**是独立页面，不使用 BaseLayout，视频背景自动检测竖屏旋转
- **BaseLayout 接受 `mainClass` 和 `noSidebar` props**，`noSidebar` 为 true 时隐藏侧边栏，main 全宽

### 样式规范
- **组件样式**用 Astro 的 `<style>` 作用域样式，引用全局 CSS 变量
- **文章内容**用 `.prose` class 包裹，有专门的排版样式
- **Astro scoped styles 中的 `@keyframes`** 会被重命名（加组件 hash），跨组件引用动画名会失效

### 静态资源
- `public/avatar.jpg` — 头像，左侧 sidebar 和关于我页面使用
- `public/page-bg.png` — 博客页面顶部 hero 背景图（sticky, 50vh），底部波浪 SVG 过渡到内容区
- `public/landing-bg.mp4` — 欢迎页视频背景，替换同名文件即可更换

## 滚动行为

- **hero-bg**（`position: sticky, top: 0, z-index: 1`）：背景图粘在视口顶部，被 content-wrapper（z-index: 2）向上滚动时覆盖
- **Header**（`position: fixed, top: 0, z-index: 100`）：始终固定在最顶层
- **sidebar**（`position: sticky, top: 72px`）：滚动时粘在导航栏正下方，像固定侧边栏
- **content-wrapper** 的 `z-index: 2` + 灰色背景覆盖 hero 区域，形成视差过渡效果

## Header 高度参考

- Header 是 `position: fixed`，高度约 71px（0.6rem padding × 2 + 52px nav）
- sidebar 的 `top` 值需要略大于 Header 高度避免遮挡
