---
name: blog-structure-2026
description: 一帧.life Astro 博客的路由结构、组件关系和设计系统
metadata:
  type: project
---

「一帧.life」Astro 博客项目结构 (2026-05-27)

**路由结构:**
- `/` - 着陆页（独立 HTML，有视频背景，不使用 BaseLayout）
- `/blog` - 博客首页（左右布局，左侧个人介绍，右侧文章网格）
- `/tech` - 技术分类文章
- `/life` - 生活分类文章
- `/photos` - 照片墙（Masonry.js + PhotoSwipe）
- `/about` - 关于我
- `/posts/[slug]` - 文章详情（.prose 排版）
- `/tags/` 和 `/tags/[tag]` - 标签页

**Why:** 用户需要一个有个性的个人博客，技术+生活分类，原宿 Decora 潮流风格。

**How to apply:**
- 所有内页使用 BaseLayout.astro 布局（着陆页除外）
- Header 贴纸式导航栏（粗描边彩色按钮，无阴影无背景模糊）
- PostCard 组件支持 category 和 featured 属性，拼贴式设计
- 文章数据通过 getCollection('posts') 获取

关键组件:
- Header.astro - 贴纸式导航栏，不同颜色粗描边
- PostCard.astro - 拼贴式卡片，彩色粗描边，轻微旋转
- TagList.astro - 粗描边标签
- Footer.astro - Kawaii 装饰页脚

设计系统变量: src/styles/global.css
详见 [[feedback_decora_style]]
