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
/blog              → 博客首页（2 列文章网格，特色文章大卡片横跨两列）
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
├── layouts/BaseLayout.astro       # 唯一布局：hero 背景图 + 导航栏 + flex 左右布局（sidebar 个人资料卡片 + main + footer）
├── components/
│   ├── Header.astro               # 固定导航栏（毛玻璃效果，青色胶囊药丸链接，z-index: 100）
│   ├── Footer.astro               # 页脚（粉色顶部边框）
│   ├── PostCard.astro             # 文章卡片（半透明胶囊风格，border-radius: 20px，hover 青色发光）
│   ├── TagList.astro              # 标签列表（粗描边胶囊）
│   ├── PhotoGrid.astro            # 照片墙瀑布流布局
│   └── PhotoCard.astro            # 照片卡片
├── pages/
│   ├── index.astro                # 欢迎页（视频背景，自动检测竖屏旋转）
│   ├── blog/index.astro           # 博客首页（2 列网格，特色文章 + 普通卡片，拼贴旋转效果）
│   ├── tech/index.astro           # 技术分类
│   ├── life/index.astro           # 生活分类
│   ├── about.astro                # 关于我
│   ├── photos/index.astro         # 照片墙
│   ├── posts/[...slug].astro      # 文章详情
│   └── tags/                      # 标签页
├── styles/global.css              # 全局样式和 CSS 变量
```

## 设计风格 - 原宿 Decora 潮流

- 黑色底色（`#333333`），高饱和黄(#FFE600)/蓝(#0066FF)/红(#FF0033)撞色
- 平面化无阴影（`--shadow: none`），大部分圆角为 0，卡片类组件使用 `border-radius: 20px`
- 粗描边 3-4px，不同组件不同颜色区分
- 大量 Kawaii 符号装饰：★ ♥ ✿ ♪ ♡ ☆
- CSS 变量以 `--deco-*` 命名（`--deco-yellow`, `--deco-pink` 等）
- **「一帧.life」Logo 文字**使用三层 text-shadow 叠加：`color: #FFE600`（黄）+ `text-shadow: #FF0033`（红）+ `#0066FF`（蓝），根据字号等比缩小偏移量
- **导航栏和卡片**使用毛玻璃胶囊风格：半透明白色默认态，青色（`#00F0FF`）hover/active 态，`backdrop-filter: blur(8px)`

## 关键设计决策

- **Slug 由文件名自动生成**，不要在 frontmatter 中加 `slug` 字段（Astro 5 行为，加了会报错）
- **所有页面**使用 `BaseLayout`，通过 `<slot />` 插入内容
- **date 字段必须加引号**，否则 YAML 解析为日期对象会报 `Expected type "string", received "date"` 错误
- **文章内容**用 `.prose` class 包裹，有专门的排版样式
- **组件样式**用 Astro 的 `<style>` 作用域样式，引用全局 CSS 变量
- **欢迎页**是独立页面，不使用 BaseLayout，视频背景自动检测竖屏旋转
- **页面背景图**在 BaseLayout 中，`public/page-bg.png`（注意是 png 不是 jpg）
- **BaseLayout 布局**采用 flex 左右结构：左侧 sidebar（sticky, 300px）+ 右侧 main（flex: 1）+ 底部 footer（width: 100%）
- **BaseLayout 接受 `mainClass` 和 `noSidebar` props**，`noSidebar` 为 true 时隐藏侧边栏，main 全宽
- **Header** 是 `position: fixed`，高度约 71px（0.6rem padding × 2 + 52px nav）；sidebar 的 `top` 值需要略大于 Header 高度避免遮挡
- **Astro scoped styles 中的 `@keyframes`** 会被重命名（加组件 hash），跨组件引用动画名会失效

## 滚动行为

- **hero-bg**（`position: sticky, top: 0, z-index: 1`）：背景图粘在视口顶部，被 content-wrapper（z-index: 2）向上滚动时覆盖
- **Header**（`position: fixed, top: 0, z-index: 100`）：始终固定在最顶层
- **sidebar**（`position: sticky, top: 72px`）：滚动时粘在导航栏正下方，像固定侧边栏
- **content-wrapper** 的 `z-index: 2` + 灰色背景覆盖 hero 区域，形成视差过渡效果

## 静态资源

- `public/avatar.jpg` — 头像，左侧 sidebar 和关于我页面使用
- `public/page-bg.png` — 博客页面顶部 hero 背景图（sticky, 50vh），底部波浪 SVG 过渡到内容区
- `public/landing-bg.mp4` — 欢迎页视频背景，替换同名文件即可更换
