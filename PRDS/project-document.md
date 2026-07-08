# 一帧.life 个人博客 — 项目文档

> 文档版本：v1.0
> 最后更新：2026-07-08
> 项目域名：https://yizhen.life

---

## 目录

1. [项目概述](#一项目概述)
2. [页面结构](#二页面结构)
3. [技术栈选型](#三技术栈选型)
4. [UI 设计风格](#四ui-设计风格)
5. [项目架构](#五项目架构)
6. [功能模块](#六功能模块)
7. [数据模型](#七数据模型)
8. [部署与运维](#八部署与运维)
9. [开发规范](#九开发规范)
10. [附录](#十附录)

---

## 一、项目概述

### 1.1 项目简介

「一帧.life」是一个采用**原宿 Decora 潮流风格**设计的个人博客，主打高饱和撞色、平面化无阴影、粗描边等视觉特征。博客内容涵盖技术文章与生活随笔，同时包含照片墙展示功能。

| 项目 | 说明 |
|------|------|
| **项目名称** | 一帧.life |
| **项目域名** | https://yizhen.life |
| **项目类型** | 个人博客（技术 + 生活） |
| **目标用户** | 博主本人、技术爱好者、访客 |
| **核心功能** | 文章发布与展示、照片墙、标签分类、关于页面 |
| **部署平台** | Vercel（GitHub 自动构建部署） |

### 1.2 项目定位

- **内容定位**：记录技术学习的思考与生活中的所见所感
- **风格定位**：原宿 Decora 潮流 — 高饱和撞色、平面化、Kawaii 装饰元素
- **技术定位**：轻量级静态博客，追求极致性能与独特视觉体验

### 1.3 项目状态

| 指标 | 当前状态 |
|------|---------|
| 版本 | v1.0.0 |
| 文章数量 | 4 篇（含草稿） |
| 照片数量 | 18 张 |
| 部署状态 | ✅ 已上线（Vercel） |
| 维护状态 | 🟢 活跃开发中 |

---

## 二、页面结构

### 2.1 页面总览

```
┌─────────────────────────────────────────────────────────────┐
│                         一帧.life                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐   ┌─────────────────────────────────┐   │
│  │             │   │                                 │   │
│  │  欢迎页     │──▶│  博客首页 (/blog)                │   │
│  │  (/)        │   │  ├─ 技术分类 (/tech)              │   │
│  │  视频背景   │   │  ├─ 生活分类 (/life)              │   │
│  │  进入按钮   │   │  ├─ 文章详情 (/posts/[slug])     │   │
│  │             │   │  ├─ 标签页 (/tags)               │   │
│  │             │   │  ├─ 标签详情 (/tags/[tag])       │   │
│  │             │   │  ├─ 照片墙 (/photos)             │   │
│  │             │   │  └─ 关于我 (/about)              │   │
│  │             │   │                                 │   │
│  └─────────────┘   └─────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 页面详情

| 页面 | 路由 | 布局 | 说明 |
|------|------|------|------|
| **欢迎页** | `/` | 独立布局 | 视频背景 + 进入按钮，无 BaseLayout |
| **博客首页** | `/blog` | BaseLayout | 2 列文章网格，特色文章大卡片横跨两列 |
| **技术分类** | `/tech` | BaseLayout | 技术类文章列表 |
| **生活分类** | `/life` | BaseLayout | 生活类文章列表 |
| **照片墙** | `/photos` | BaseLayout | Masonry 瀑布流 + PhotoSwipe 灯箱 |
| **关于我** | `/about` | BaseLayout | 个人介绍页面 |
| **文章详情** | `/posts/[slug]` | BaseLayout | 动态路由渲染 Markdown 文章 |
| **标签索引** | `/tags` | BaseLayout | 所有标签统计展示 |
| **标签详情** | `/tags/[tag]` | BaseLayout | 按标签筛选文章 |

### 2.3 布局结构

```
BaseLayout.astro
├── Hero 背景图区域 (50vh)
│   └── 波浪 SVG（动态定位到 hero 底部）
├── Header（固定导航栏，z-index: 100）
└── Content Wrapper
    ├── Sidebar（粘性定位，300px，个人资料卡片）
    │   ├── 头像
    │   ├── 昵称
    │   ├── 签名
    │   └── 个人信息列表
    ├── Main（flex: 1）
    │   └── <slot />（页面内容）
    └── Footer（页脚）
```

---

## 三、技术栈选型

### 3.1 核心技术栈

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| **框架** | Astro | ^5.7.0 | 静态站点生成（SSG） |
| **语言** | TypeScript | — | 类型安全 |
| **内容渲染** | @astrojs/mdx | ^4.2.0 | Markdown/MDX 内容支持 |
| **Schema 校验** | Zod | Astro 内置 | Frontmatter 数据校验 |
| **样式** | 纯 CSS | — | 无 Tailwind/框架 |
| **字体** | LXGW WenKai | Google Fonts | 中文字体 |
| **照片墙** | masonry-layout | ^4.2.2 | 瀑布流布局 |
| **图片灯箱** | photoswipe | ^5.4.4 | 照片查看器 |
| **图片处理** | sharp | ^0.33.0 | 构建时图片优化 |
| **部署** | Vercel | — | 静态托管 + CI/CD |

### 3.2 技术选型理由

| 技术 | 选择理由 |
|------|---------|
| **Astro** | 零 JS 默认、Islands 架构、Content Collections 类型安全、静态输出性能优异 |
| **纯 CSS** | 完全可控的样式系统，与 Decora 风格高度契合，无构建开销 |
| **Zod** | 与 Astro Content Collections 深度集成，编译时类型安全 |
| **masonry-layout** | 成熟的瀑布流方案，与 Astro 客户端脚本兼容 |
| **photoswipe** | 轻量级、高性能的图片灯箱，支持触摸手势 |
| **Vercel** | 与 GitHub 无缝集成，零配置自动部署 |

### 3.3 不使用的技术（及原因）

| 技术 | 不使用的原因 |
|------|-------------|
| React / Vue / Svelte | 项目以内容展示为主，无需组件级状态管理 |
| Tailwind CSS | 手写 CSS 更灵活，避免工具类命名与 Decora 风格冲突 |
| Next.js / Nuxt | 不需要 SSR，Astro 静态生成更轻量 |
| CMS（Sanity/Strapi）| 个人博客，Markdown 文件管理已足够 |
| 数据库 | 内容静态化，无需持久化存储 |

---

## 四、UI 设计风格

### 4.1 设计主题：原宿 Decora 潮流

| 特征 | 说明 |
|------|------|
| **底色** | 深灰 `#333333` |
| **撞色** | 黄 `#FFE600`、蓝 `#0066FF`、红 `#FF0033` |
| **平面化** | 无阴影（`--shadow: none`） |
| **圆角** | 大部分为 0，卡片类使用 `border-radius: 20px` |
| **描边** | 3-4px 粗描边，不同组件不同颜色 |
| **装饰** | Kawaii 符号（★ ♥ ✿ ♪ ♡ ☆） |
| **毛玻璃** | `backdrop-filter: blur(8px)` |

### 4.2 配色系统

```css
:root {
  /* 背景 */
  --bg-primary: #333333;
  --bg-card: #1E293B;

  /* 文字 */
  --text-primary: #ffffff;
  --text-secondary: #cccccc;

  /* Decora 撞色 */
  --deco-yellow: #FFE600;
  --deco-blue: #0066FF;
  --deco-red: #FF0033;
  --deco-pink: #FF69B4;
  --deco-green: #39FF14;
  --deco-cyan: #00FFFF;
  --deco-purple: #CC00FF;
  --deco-orange: #FF6600;
}
```

### 4.3 字体

| 场景 | 字体 | 来源 |
|------|------|------|
| 中文正文 | 霞鹜文楷（LXGW WenKai） | Google Fonts |
| 代码块 | JetBrains Mono / Fira Code | 系统字体栈 |

### 4.4 Logo 设计

三层 text-shadow 叠加效果：
- 主色：`#FFE600`（黄）
- 第一层阴影：`#FF0033`（红）
- 第二层阴影：`#0066FF`（蓝）

### 4.5 组件视觉规范

| 组件 | 风格 |
|------|------|
| **导航栏** | 毛玻璃胶囊风格，青色 hover/active |
| **文章卡片** | 半透明胶囊，border-radius: 20px，hover 青色发光 |
| **标签** | 粗描边胶囊，不同颜色区分 |
| **按钮** | 高饱和撞色，无边框或粗边框 |
| **头像** | 六边形 clip-path，黄色边框 + 粉色描边 |

---

## 五、项目架构

### 5.1 目录结构

```
my-blog/
├── .astro/                    # Astro 构建缓存
├── dist/                      # 构建输出（静态 HTML）
├── docs/                      # 项目文档（可选）
├── node_modules/              # 依赖
├── public/                      # 静态资源
│   ├── avatar.jpg               # 头像
│   ├── favicon.svg              # 网站图标
│   ├── landing-bg.mp4           # 欢迎页视频背景
│   ├── page-bg.png              # 博客页面 Hero 背景
│   ├── data/photos.json         # 照片元数据
│   └── images/photos/           # 照片资源
├── scripts/                     # 构建脚本（可选）
├── src/
│   ├── components/              # 可复用组件
│   │   ├── Header.astro         # 固定导航栏
│   │   ├── Footer.astro         # 页脚
│   │   ├── PostCard.astro       # 文章卡片
│   │   ├── TagList.astro        # 标签列表
│   │   ├── PhotoGrid.astro      # 照片墙网格
│   │   └── PhotoCard.astro      # 照片卡片
│   ├── content/
│   │   ├── config.ts            # Zod Schema 定义
│   │   └── posts/               # Markdown 文章
│   ├── layouts/
│   │   └── BaseLayout.astro     # 基础布局
│   ├── pages/                   # 路由页面
│   │   ├── index.astro          # 欢迎页
│   │   ├── blog/index.astro     # 博客首页
│   │   ├── tech/index.astro     # 技术分类
│   │   ├── life/index.astro     # 生活分类
│   │   ├── photos/index.astro   # 照片墙
│   │   ├── about.astro          # 关于我
│   │   ├── posts/[...slug].astro # 文章详情
│   │   └── tags/                # 标签页
│   └── styles/
│       ├── global.css           # 全局样式 + CSS 变量
│       └── photos.css           # 照片墙专用样式
├── astro.config.mjs             # Astro 配置
├── package.json                 # 依赖管理
├── tsconfig.json                # TypeScript 配置
├── README.md                    # 项目说明
├── CLAUDE.md                    # AI 助手指南
└── .gitignore                   # Git 忽略规则
```

### 5.2 组件依赖关系

```
BaseLayout.astro
├── Header.astro
├── Footer.astro
└── [页面内容]
    ├── PostCard.astro
    │   └── TagList.astro
    ├── PhotoGrid.astro
    │   └── PhotoCard.astro
    └── ...
```

### 5.3 构建流程

```
开发: npm run dev      → Astro Dev Server (localhost:4321)
构建: npm run build    → 静态 HTML 输出到 dist/
预览: npm run preview  → 预览构建结果
部署: git push         → Vercel 自动构建部署
```

---

## 六、功能模块

### 6.1 文章系统

| 功能 | 说明 |
|------|------|
| **文章列表** | 按时间倒序排列，2 列网格布局 |
| **特色文章** | 最新文章大卡片横跨两列 |
| **文章分类** | 技术 / 生活 两大分类 |
| **标签系统** | 自由标签，支持标签筛选 |
| **文章详情** | Markdown 渲染，代码高亮 |
| **草稿模式** | `draft: true` 的文章不显示 |

### 6.2 照片墙

| 功能 | 说明 |
|------|------|
| **瀑布流布局** | Masonry 自适应列数 |
| **灯箱查看** | PhotoSwipe 支持缩放、滑动 |
| **懒加载** | 图片进入视口后加载 |
| **响应式** | 桌面 6 列 → 平板 5 列 → 手机 3 列 |

### 6.3 导航与布局

| 功能 | 说明 |
|------|------|
| **固定导航栏** | 毛玻璃效果，始终置顶 |
| **粘性侧边栏** | 个人资料卡片，滚动时固定 |
| **响应式适配** | 1100px 以下隐藏侧边栏，768px 以下单列 |
| **Hero 背景** | 50vh 背景图 + 波浪 SVG 过渡 |

---

## 七、数据模型

### 7.1 文章 Schema（Zod）

```typescript
import { defineCollection, z } from 'astro:content'

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),           // 文章标题
    date: z.string(),            // 发布日期（必须加引号）
    tags: z.array(z.string()).default([]),  // 标签数组
    category: z.enum(["技术", "生活"]),       // 分类
    description: z.string(),       // 文章摘要
    draft: z.boolean().default(false),        // 草稿标记
  }),
})
```

### 7.2 照片数据结构

```json
{
  "photos": [
    {
      "id": "photo-001",
      "filename": "...",
      "path": "/images/photos/...",
      "title": "",
      "description": "",
      "date": "2026-05-24",
      "width": 1706,
      "height": 1279,
      "tags": []
    }
  ]
}
```

---

## 八、部署与运维

### 8.1 部署配置

| 配置项 | 值 |
|--------|-----|
| **平台** | Vercel |
| **触发方式** | Git push 到 GitHub 自动构建 |
| **输出模式** | `output: 'static'` |
| **站点** | https://yizhen.life |

### 8.2 环境要求

| 依赖 | 版本 |
|------|------|
| Node.js | ≥ 18 |
| npm | ≥ 9 |

---

## 九、开发规范

### 9.1 文件命名

- 页面文件：`index.astro`（目录路由）或 `[slug].astro`（动态路由）
- 组件文件：`PascalCase.astro`
- 样式文件：`kebab-case.css`
- 文章文件：`slug-name.md`（文件名即 URL slug）

### 9.2 样式规范

- 全局样式：`src/styles/global.css`
- 组件样式：Astro `<style>` 标签（scoped）
- CSS 变量命名：`--deco-*` 用于 Decora 主题色
- 响应式断点：`1100px`（侧边栏隐藏）、`768px`（移动端）、`480px`（小屏）

### 9.3 文章编写规范

```yaml
---
title: "文章标题"
date: "2026-05-21"    # 必须加引号
tags: ["标签1", "标签2"]
category: "技术"       # 必须是 "技术" 或 "生活"
description: "文章摘要"
draft: false
---
```

---

## 十、附录

### 附录 A：常用命令

```bash
npm install        # 安装依赖
npm run dev        # 本地开发（http://localhost:4321）
npm run build      # 生产构建
npm run preview    # 预览构建结果
```

### 附录 B：相关文档

| 文档 | 路径 | 说明 |
|------|------|------|
| 项目 README | `./README.md` | 项目快速入门 |
| **AI 助手指南** | `./CLAUDE.md` | AI 专用参考（关键设计决策、滚动行为等） |
| **动效扩展方案** | `./PRDS/animation-interaction-roadmap.md` | 动效与交互扩展路线图 |

### 附录 C：外部资源

| 资源 | URL |
|------|-----|
| Astro 文档 | https://docs.astro.build |
| Vercel 文档 | https://vercel.com/docs |
| LXGW WenKai 字体 | https://github.com/lxgw/LxgwWenKai |

---

*文档结束*
