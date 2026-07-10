# 一帧.life — 开发指南

> 面向开发者的技术实现参考
> 完整项目文档见 `./project-document.md`

---

## 一、项目架构

### 1.1 目录结构

```
src/
├── components/              # 可复用组件
│   ├── Header.astro         # 固定导航栏
│   ├── RightSidebar.astro   # 右侧边栏（分类 + 轮播 + 句子）
│   ├── CategorySidebar.astro # 文章分类（内部组件）
│   ├── PhotoCarousel.astro  # 照片轮播（内部组件）
│   ├── RandomQuote.astro    # 随机句子（内部组件）
│   ├── Footer.astro         # 页脚
│   ├── PostCard.astro       # 文章卡片
│   ├── TagList.astro        # 标签列表
│   ├── PhotoGrid.astro      # 照片墙网格（client-side JS）
│   └── PhotoCard.astro      # 照片卡片
├── content/
│   ├── config.ts            # Zod Schema 定义
│   └── posts/               # Markdown 文章
├── layouts/
│   └── BaseLayout.astro     # 基础布局（Hero + Header + Sidebar + Main + RightSidebar + Footer）
├── pages/                   # 路由页面
│   ├── index.astro          # 欢迎页（独立布局）
│   ├── blog/index.astro     # 博客首页
│   ├── tech/index.astro     # 技术分类
│   ├── life/index.astro     # 生活分类
│   ├── photos/index.astro   # 照片墙
│   ├── about.astro          # 关于我
│   ├── posts/[...slug].astro # 文章详情
│   └── tags/                # 标签页
└── styles/
    ├── global.css           # 全局样式 + CSS 变量
    └── photos.css           # 照片墙专用样式
```

### 1.2 组件依赖关系

```
BaseLayout.astro
├── Header.astro
├── Footer.astro
└── [页面内容]
    ├── PostCard.astro
    │   └── TagList.astro
    ├── PhotoGrid.astro
    │   └── PhotoCard.astro
    ├── RightSidebar.astro
    │   ├── CategorySidebar.astro
    │   ├── PhotoCarousel.astro
    │   └── RandomQuote.astro
    └── ...
```

### 1.3 构建流程

```bash
npm run dev      # Astro Dev Server (localhost:4321)
npm run build    # 静态 HTML 输出到 dist/
npm run preview  # 预览构建结果
# git push     # Vercel 自动构建部署
```

---

## 二、关键设计决策

### 2.1 Slug 规则

- **Slug 由文件名自动生成**，不要在 frontmatter 中加 `slug` 字段（Astro 5 行为，加了会报错）
- 文件名即 URL slug：`my-post.md` → `/posts/my-post`

### 2.2 date 字段

- **date 字段必须加引号**，否则 YAML 解析为日期对象会报 `Expected type "string", received "date"` 错误

### 2.3 布局系统

- **所有页面**使用 `BaseLayout`，通过 `<slot />` 插入内容
- **欢迎页**是独立页面，不使用 BaseLayout，视频背景自动检测竖屏旋转
- **BaseLayout 接受 `mainClass`、`noSidebar` 和 `showCategorySidebar` props**，`noSidebar` 为 true 时隐藏侧边栏，`showCategorySidebar` 为 true 时显示右侧分类栏目

### 2.4 样式规范

- **组件样式**用 Astro 的 `<style>` 作用域样式，引用全局 CSS 变量
- **文章内容**用 `.prose` class 包裹，有专门的排版样式
- **Astro scoped styles 中的 `@keyframes`** 会被重命名（加组件 hash），跨组件引用动画名会失效

### 2.5 静态资源

- `public/avatar.jpg` — 头像，左侧 sidebar 和关于我页面使用
- `public/page-bg.png` — 博客页面顶部 hero 背景图（sticky, 50vh），底部波浪 SVG 过渡到内容区
- `public/landing-bg.mp4` — 欢迎页视频背景，替换同名文件即可更换

---

## 三、滚动行为

### 3.1 各元素定位

| 元素 | 定位方式 | z-index | 说明 |
|------|---------|---------|------|
| **hero-bg** | `position: sticky, top: 0` | 1 | 背景图粘在视口顶部，被 content-wrapper 覆盖 |
| **Header** | `position: fixed, top: 0` | 100 | 始终固定在最顶层 |
| **sidebar** | `position: sticky, top: 72px` | 50 | 滚动时粘在导航栏正下方 |
| **category-sidebar** | `position: sticky, top: 72px` | 50 | 右侧分类栏目，滚动时固定 |
| **content-wrapper** | `position: relative` | 2 | 灰色背景覆盖 hero 区域，形成视差过渡 |

### 3.2 Header 高度参考

- Header 是 `position: fixed`，高度约 71px（0.6rem padding × 2 + 52px nav）
- sidebar 的 `top` 值需要略大于 Header 高度避免遮挡

---

## 四、功能模块

### 4.1 文章系统

| 功能 | 说明 |
|------|------|
| **文章列表** | 按时间倒序排列，2 列网格布局 |
| **特色文章** | 最新文章大卡片横跨两列 |
| **文章分类** | 技术 / 生活 两大分类 |
| **标签系统** | 自由标签，支持标签筛选 |
| **文章详情** | Markdown 渲染，代码高亮 |
| **草稿模式** | `draft: true` 的文章不显示 |

### 4.2 照片墙

| 功能 | 说明 |
|------|------|
| **瀑布流布局** | Masonry 自适应列数（client-side） |
| **灯箱查看** | PhotoSwipe 支持缩放、滑动（client-side） |
| **懒加载** | 图片进入视口后加载 |
| **响应式** | 桌面 6 列 → 平板 5 列 → 手机 3 列 |

### 4.3 导航与布局

| 功能 | 说明 |
|------|------|
| **固定导航栏** | 毛玻璃效果，始终置顶 |
| **粘性侧边栏** | 个人资料卡片，滚动时固定 |
| **右侧分类栏** | 文章分类列表，显示数量，当前高亮 |
| **照片轮播** | 右侧边栏照片轮播，5张，4秒切换，淡入淡出 |
| **随机句子** | 右侧边栏底部，每次刷新随机显示一句 |
| **响应式适配** | 1100px 以下隐藏侧边栏，768px 以下单列 |
| **Hero 背景** | 50vh 背景图 + 波浪 SVG 过渡 |

---

## 五、数据模型

### 5.1 文章 Schema（Zod）

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

### 5.2 照片数据结构

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

## 六、开发规范

### 6.1 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 页面文件 | `index.astro` 或 `[slug].astro` | `blog/index.astro` |
| 组件文件 | PascalCase | `PostCard.astro` |
| 样式文件 | kebab-case | `global.css` |
| 文章文件 | kebab-case | `my-first-post.md` |

### 6.2 样式规范

| 项目 | 规范 |
|------|------|
| 全局样式 | `src/styles/global.css` |
| 组件样式 | Astro `<style>` 标签（scoped） |
| CSS 变量命名 | `--deco-*` 用于 Decora 主题色 |
| 响应式断点 | `1100px` / `768px` / `480px` |

### 6.3 性能优化原则

- 优先使用 CSS 动画（`transform`、`opacity`）
- 避免动画化 `width`、`height`、`top`、`left`
- 滚动事件使用 `{ passive: true }`
- 复杂库（如 GSAP）按需动态导入

---

## 七、部署与运维

| 配置项 | 值 |
|--------|-----|
| **平台** | Vercel |
| **触发方式** | Git push 到 GitHub 自动构建 |
| **输出模式** | `output: 'static'` |
| **站点** | https://yizhen.life |

### 环境要求

| 依赖 | 版本 |
|------|------|
| Node.js | ≥ 18 |
| npm | ≥ 9 |

---

## 附录：相关文档

| 文档 | 路径 |
|------|------|
| 项目总览 | `./project-document.md` |
| UI 设计系统 | `./ui-design-system.md` |
| 内容创作指南 | `./content-guide.md` |
| AI 助手指南 | `../CLAUDE.md` |
