# 一帧.life 个人博客 实现计划

> **For agentic workers:** 按任务顺序逐步执行，每完成一个任务后检查效果再继续。

**Goal:** 搭建一个基于 Astro 的个人博客网站，包含文章列表、文章详情、关于我、标签分类四个页面，温暖文艺风格，部署到 Vercel 并绑定 yizhen.life 域名。

**Architecture:** 使用 Astro 框架 + Content Collections 管理 Markdown 文章，纯静态输出。组件化拆分布局、导航、文章卡片等，通过 CSS 变量统一管理配色方案。

**Tech Stack:** Astro, Markdown, CSS (自定义属性), Vercel

---

## 文件结构总览

```
my-blog/
├── .gitignore
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   └── avatar.jpg              # 个人头像（用户自行替换）
├── src/
│   ├── styles/
│   │   └── global.css          # 全局样式 + 配色变量
│   ├── layouts/
│   │   └── BaseLayout.astro    # 全局布局壳
│   ├── components/
│   │   ├── Header.astro        # 导航栏
│   │   ├── Footer.astro        # 页脚
│   │   ├── PostCard.astro      # 文章卡片
│   │   └── TagList.astro       # 标签列表
│   ├── content/
│   │   ├── posts/              # Markdown 文章
│   │   │   ├── hello-world.md
│   │   │   └── first-tech-post.md
│   │   └── config.ts           # Content Collections schema
│   └── pages/
│       ├── index.astro         # 首页（文章列表）
│       ├── about.astro         # 关于我
│       ├── posts/
│       │   └── [...slug].astro # 文章详情
│       └── tags/
│           ├── index.astro     # 标签总览
│           └── [tag].astro     # 按标签筛选
├── vercel.json                 # Vercel 部署配置（可选）
└── README.md
```

---

### Task 1: 初始化 Astro 项目

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`

- [ ] **Step 1: 创建项目基础文件**

```json
// package.json
{
  "name": "yizhen-life-blog",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^5.7.0",
    "@astrojs/mdx": "^4.2.0",
    "sharp": "^0.33.0"
  }
}
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://yizhen.life',
  output: 'static',
});
```

```json
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict"
}
```

```
// .gitignore
node_modules/
dist/
.astro/
.DS_Store
```

- [ ] **Step 2: 安装依赖并验证**

Run: `npm install`
Expected: 安装成功，无报错

Run: `npx astro --version`
Expected: 显示 Astro 版本号

- [ ] **Step 3: 提交初始项目**

```bash
git add .
git commit -m "chore: 初始化 Astro 项目"
```

---

### Task 2: 配置 Content Collections + 写示例文章

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/posts/hello-world.md`
- Create: `src/content/posts/first-tech-post.md`

- [ ] **Step 1: 创建 Content Collections 配置**

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.string(),
    tags: z.array(z.string()).default([]),
    description: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
```

- [ ] **Step 2: 创建第一篇示例文章（生活随笔）**

```markdown
---
title: "你好，世界"
slug: "hello-world"
date: "2026-05-21"
tags: ["生活", "随笔"]
description: "这是我的第一篇博客，记录新的开始。"
---

# 你好，世界

欢迎来到「一帧.life」。

世界那么大，我先溜达溜达。

这是一个新的开始，我打算在这里记录自己的生活和思考。
```

- [ ] **Step 3: 创建第二篇示例文章（技术笔记）**

```markdown
---
title: "我的第一个 Astro 博客"
slug: "my-first-astro-blog"
date: "2026-05-21"
tags: ["技术", "Astro"]
description: "记录用 Astro 搭建个人博客的过程。"
---

# 我的第一个 Astro 博客

最近用 Astro 搭建了自己的个人博客，在这里记录一下过程。

## 为什么选 Astro

- 性能好，输出纯静态 HTML
- 对内容型网站特别友好
- 写文章就是写 Markdown

## 代码示例

\`\`\`javascript
console.log('Hello, 一帧.life!');
\`\`\`
```

- [ ] **Step 4: 验证内容集合可用**

创建一个临时测试文件来验证配置是否正确：

```bash
git add src/content/
git commit -m "feat: 配置 content collections 并添加示例文章"
```

---

### Task 3: 创建全局样式

**Files:**
- Create: `src/styles/global.css`
- Create: `public/favicon.svg`

- [ ] **Step 1: 创建全局 CSS**

```css
/* src/styles/global.css */

/* ===== 配色变量 ===== */
:root {
  --bg-primary: #faf8f5;
  --bg-card: #ffffff;
  --text-primary: #3d3d3d;
  --text-secondary: #6b6b6b;
  --text-muted: #999999;
  --accent: #c87941;
  --accent-hover: #b56830;
  --border: #e8e4df;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  --radius: 12px;
  --max-width: 720px;
  --tag-green: #e8f5e9;
  --tag-green-text: #2e7d32;
  --tag-blue: #e3f2fd;
  --tag-blue-text: #1565c0;
  --tag-pink: #fce4ec;
  --tag-pink-text: #c62828;
  --tag-yellow: #fff8e1;
  --tag-yellow-text: #f57f17;
  --tag-purple: #f3e5f5;
  --tag-purple-text: #6a1b9a;
  --tag-gray: #f5f5f5;
  --tag-gray-text: #616161;
}

/* ===== 基础重置 ===== */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: 'LXGW WenKai', 'Noto Serif SC', serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.8;
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: var(--accent-hover);
}

img {
  max-width: 100%;
  height: auto;
}

/* ===== 排版 ===== */
h1, h2, h3, h4 {
  line-height: 1.4;
  font-weight: 600;
}

h1 { font-size: 1.875rem; }
h2 { font-size: 1.5rem; }
h3 { font-size: 1.25rem; }

p {
  margin-bottom: 1.2em;
}

/* ===== 文章内容样式 ===== */
.prose {
  max-width: var(--max-width);
  margin: 0 auto;
}

.prose h1 { margin: 2em 0 0.8em; }
.prose h2 { margin: 1.8em 0 0.6em; }
.prose h3 { margin: 1.5em 0 0.5em; }

.prose p {
  margin-bottom: 1.2em;
}

.prose blockquote {
  border-left: 3px solid var(--accent);
  padding: 0.5em 1em;
  margin: 1.5em 0;
  background: rgba(200, 121, 65, 0.05);
  color: var(--text-secondary);
  border-radius: 0 var(--radius) var(--radius) 0;
}

.prose code {
  background: #f4f0ec;
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-size: 0.9em;
}

.prose pre {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 1.2em;
  border-radius: var(--radius);
  overflow-x: auto;
  margin: 1.5em 0;
}

.prose pre code {
  background: none;
  padding: 0;
  color: inherit;
}

.prose ul, .prose ol {
  padding-left: 1.5em;
  margin-bottom: 1.2em;
}

.prose li {
  margin-bottom: 0.4em;
}

.prose img {
  border-radius: var(--radius);
  margin: 1.5em 0;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  html { font-size: 15px; }
}
```

- [ ] **Step 2: 创建 favicon**

```svg
<!-- public/favicon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text y=".9em" font-size="90"> </text>
</svg>
```

- [ ] **Step 3: 提交**

```bash
git add src/styles/global.css public/favicon.svg
git commit -m "feat: 添加全局样式和 favicon"
```

---

### Task 4: 创建布局组件

**Files:**
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: 创建 Header 组件**

```astro
---
// src/components/Header.astro
const currentPath = Astro.url.pathname;
---

<header class="site-header">
  <nav class="nav">
    <a href="/" class="logo">
      <span class="logo-text">一帧.life</span>
    </a>
    <ul class="nav-links">
      <li><a href="/" class:list={["nav-link", { active: currentPath === "/" }]}>首页</a></li>
      <li><a href="/tags" class:list={["nav-link", { active: currentPath.startsWith("/tags") }]}>标签</a></li>
      <li><a href="/about" class:list={["nav-link", { active: currentPath === "/about" }]}>关于我</a></li>
    </ul>
  </nav>
</header>

<style>
  .site-header {
    padding: 1.5rem 2rem;
    max-width: 900px;
    margin: 0 auto;
  }
  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .logo-text {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--text-primary);
  }
  .logo:hover .logo-text {
    color: var(--accent);
  }
  .nav-links {
    display: flex;
    list-style: none;
    gap: 1.5rem;
  }
  .nav-link {
    color: var(--text-secondary);
    font-size: 0.95rem;
    padding: 0.3em 0;
    position: relative;
  }
  .nav-link:hover,
  .nav-link.active {
    color: var(--accent);
  }
  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--accent);
    border-radius: 1px;
  }
</style>
```

- [ ] **Step 2: 创建 Footer 组件**

```astro
---
// src/components/Footer.astro
const year = new Date().getFullYear();
---

<footer class="site-footer">
  <p class="footer-text">© {year} 一帧.life · 世界那么大，我先溜达溜达</p>
</footer>

<style>
  .site-footer {
    text-align: center;
    padding: 3rem 2rem 2rem;
    color: var(--text-muted);
    font-size: 0.85rem;
  }
</style>
```

- [ ] **Step 3: 创建 BaseLayout**

```astro
---
// src/layouts/BaseLayout.astro
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = '一帧.life - 世界那么大，我先溜达溜达' } = Astro.props;
---

<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content={description} />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=LXGW+WenKai&display=swap" rel="stylesheet" />
  <title>{title} | 一帧.life</title>
</head>
<body>
  <Header />
  <main>
    <slot />
  </main>
  <Footer />
</body>
</html>

<style>
  main {
    min-height: calc(100vh - 200px);
    padding: 2rem;
    max-width: 900px;
    margin: 0 auto;
  }
</style>
```

- [ ] **Step 4: 验证布局**

创建临时 `src/pages/index.astro` 测试：

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="首页">
  <p>布局测试</p>
</BaseLayout>
```

Run: `npx astro dev`，浏览器访问 `http://localhost:4321` 确认导航栏和页脚正常显示。

- [ ] **Step 5: 提交**

```bash
git add src/components/ src/layouts/ src/pages/index.astro
git commit -m "feat: 创建 Header、Footer、BaseLayout 布局组件"
```

---

### Task 5: 创建文章卡片组件

**Files:**
- Create: `src/components/PostCard.astro`
- Create: `src/components/TagList.astro`

- [ ] **Step 1: 创建 TagList 组件**

```astro
---
// src/components/TagList.astro
interface Props {
  tags: string[];
  linkable?: boolean;
}

const { tags, linkable = true } = Astro.props;

const tagColors: Record<string, { bg: string; text: string }> = {
  '技术': { bg: 'var(--tag-blue)', text: 'var(--tag-blue-text)' },
  '生活': { bg: 'var(--tag-pink)', text: 'var(--tag-pink-text)' },
  '随笔': { bg: 'var(--tag-yellow)', text: 'var(--tag-yellow-text)' },
  'Astro': { bg: 'var(--tag-purple)', text: 'var(--tag-purple-text)' },
};

const defaultColor = { bg: 'var(--tag-gray)', text: 'var(--tag-gray-text)' };
---

<div class="tag-list">
  {tags.map((tag) => {
    const color = tagColors[tag] || defaultColor;
    return linkable ? (
      <a href={`/tags/${tag}`} class="tag" style={`background: ${color.bg}; color: ${color.text};`}>
        {tag}
      </a>
    ) : (
      <span class="tag" style={`background: ${color.bg}; color: ${color.text};`}>{tag}</span>
    );
  })}
</div>

<style>
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .tag {
    display: inline-block;
    padding: 0.2em 0.7em;
    border-radius: 20px;
    font-size: 0.8rem;
    transition: opacity 0.2s;
  }
  a.tag:hover {
    opacity: 0.8;
  }
</style>
```

- [ ] **Step 2: 创建 PostCard 组件**

```astro
---
// src/components/PostCard.astro
import TagList from './TagList.astro';

interface Props {
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string[];
}

const { title, slug, date, description, tags } = Astro.props;
---

<article class="post-card">
  <a href={`/posts/${slug}`} class="post-card-link">
    <h2 class="post-title">{title}</h2>
    <p class="post-desc">{description}</p>
  </a>
  <div class="post-meta">
    <time class="post-date">{date}</time>
    <TagList tags={tags} />
  </div>
</article>

<style>
  .post-card {
    background: var(--bg-card);
    border-radius: var(--radius);
    padding: 1.5rem;
    margin-bottom: 1.2rem;
    box-shadow: var(--shadow);
    transition: transform 0.2s, box-shadow 0.2s;
    border: 1px solid var(--border);
  }
  .post-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  .post-card-link {
    display: block;
    color: inherit;
  }
  .post-card-link:hover {
    color: inherit;
  }
  .post-title {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }
  .post-desc {
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 0;
  }
  .post-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 0.8rem;
    border-top: 1px solid var(--border);
  }
  .post-date {
    color: var(--text-muted);
    font-size: 0.85rem;
  }
</style>
```

- [ ] **Step 3: 提交**

```bash
git add src/components/PostCard.astro src/components/TagList.astro
git commit -m "feat: 创建 PostCard 和 TagList 组件"
```

---

### Task 6: 创建首页（文章列表）

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: 编写首页**

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import PostCard from '../components/PostCard.astro';
import { getCollection } from 'astro:content';

const allPosts = await getCollection('posts', ({ data }) => !data.draft);
const sortedPosts = allPosts.sort(
  (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
);
---

<BaseLayout title="首页">
  <section class="hero">
    <h1>一帧.life</h1>
    <p class="slogan">世界那么大，我先溜达溜达</p>
  </section>

  <section class="post-list">
    {sortedPosts.map((post) => (
      <PostCard
        title={post.data.title}
        slug={post.data.slug}
        date={post.data.date}
        description={post.data.description}
        tags={post.data.tags}
      />
    ))}
  </section>
</BaseLayout>

<style>
  .hero {
    text-align: center;
    padding: 3rem 0 2rem;
  }
  .hero h1 {
    font-size: 2.2rem;
    margin-bottom: 0.5rem;
  }
  .slogan {
    color: var(--text-secondary);
    font-size: 1rem;
  }
  .post-list {
    max-width: 720px;
    margin: 0 auto;
  }
</style>
```

- [ ] **Step 2: 验证首页**

Run: `npx astro dev`，访问首页，确认文章卡片正确显示。

- [ ] **Step 3: 提交**

```bash
git add src/pages/index.astro
git commit -m "feat: 创建首页文章列表"
```

---

### Task 7: 创建文章详情页

**Files:**
- Create: `src/pages/posts/[...slug].astro`

- [ ] **Step 1: 创建文章详情页**

```astro
---
// src/pages/posts/[...slug].astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import TagList from '../../components/TagList.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { slug: post.data.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BaseLayout title={post.data.title} description={post.data.description}>
  <article class="article">
    <header class="article-header">
      <h1>{post.data.title}</h1>
      <div class="article-meta">
        <time>{post.data.date}</time>
        <TagList tags={post.data.tags} />
      </div>
    </header>
    <div class="prose">
      <Content />
    </div>
    <footer class="article-footer">
      <a href="/" class="back-link">← 返回首页</a>
    </footer>
  </article>
</BaseLayout>

<style>
  .article {
    max-width: var(--max-width);
    margin: 0 auto;
  }
  .article-header {
    text-align: center;
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
  }
  .article-header h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  .article-meta {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    color: var(--text-muted);
    font-size: 0.9rem;
  }
  .article-footer {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
    text-align: center;
  }
  .back-link {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
</style>
```

- [ ] **Step 2: 验证文章详情页**

访问 `http://localhost:4321/posts/hello-world` 和 `http://localhost:4321/posts/my-first-astro-blog`，确认 Markdown 渲染正常。

- [ ] **Step 3: 提交**

```bash
git add src/pages/posts/
git commit -m "feat: 创建文章详情页"
```

---

### Task 8: 创建关于我页面

**Files:**
- Create: `src/pages/about.astro`
- Create: `public/avatar.jpg`（放一个占位图）

- [ ] **Step 1: 创建关于我页面**

```astro
---
// src/pages/about.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="关于我">
  <div class="about">
    <div class="about-avatar">
      <img src="/avatar.jpg" alt="头像" />
    </div>
    <h1>关于我</h1>
    <div class="about-content prose">
      <p>你好，欢迎来到「一帧.life」。</p>
      <p>我是一名大三学生，对技术充满好奇，也热爱生活中的点点滴滴。</p>
      <p>这个博客是我的小小天地，记录技术学习的思考，也记录生活中的所见所感。</p>
      <p>世界那么大，我先溜达溜达。</p>
    </div>
  </div>
</BaseLayout>

<style>
  .about {
    max-width: var(--max-width);
    margin: 0 auto;
    text-align: center;
  }
  .about-avatar {
    margin-bottom: 1.5rem;
  }
  .about-avatar img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--border);
  }
  .about h1 {
    margin-bottom: 1.5rem;
  }
  .about-content {
    text-align: left;
  }
</style>
```

- [ ] **Step 2: 添加占位头像**

创建一个简单的 SVG 作为占位头像：

```bash
# 简单处理：复制 favicon 作为占位头像，后续用户自行替换
cp public/favicon.svg public/avatar-placeholder.svg
```

实际使用时，用户需要准备一张正方形照片放到 `public/avatar.jpg`。

- [ ] **Step 3: 验证**

访问 `http://localhost:4321/about`，确认页面正常显示。

- [ ] **Step 4: 提交**

```bash
git add src/pages/about.astro
git commit -m "feat: 创建关于我页面"
```

---

### Task 9: 创建标签页面

**Files:**
- Create: `src/pages/tags/index.astro`
- Create: `src/pages/tags/[tag].astro`

- [ ] **Step 1: 创建标签总览页**

```astro
---
// src/pages/tags/index.astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const allPosts = await getCollection('posts', ({ data }) => !data.draft);
const tagMap = new Map<string, number>();

allPosts.forEach((post) => {
  post.data.tags.forEach((tag) => {
    tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
  });
});

const tags = Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1]);
---

<BaseLayout title="标签">
  <div class="tags-page">
    <h1>标签</h1>
    <p class="tags-subtitle">共 {tags.length} 个标签</p>
    <div class="tags-grid">
      {tags.map(([tag, count]) => (
        <a href={`/tags/${tag}`} class="tag-card">
          <span class="tag-name">{tag}</span>
          <span class="tag-count">{count} 篇</span>
        </a>
      ))}
    </div>
  </div>
</BaseLayout>

<style>
  .tags-page {
    max-width: var(--max-width);
    margin: 0 auto;
  }
  .tags-page h1 {
    margin-bottom: 0.5rem;
  }
  .tags-subtitle {
    color: var(--text-muted);
    margin-bottom: 2rem;
  }
  .tags-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
  }
  .tag-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.2rem;
    background: var(--bg-card);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    color: var(--text-primary);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .tag-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    color: var(--accent);
  }
  .tag-name {
    font-weight: 600;
    font-size: 1rem;
  }
  .tag-count {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-top: 0.3rem;
  }
</style>
```

- [ ] **Step 2: 创建按标签筛选页**

```astro
---
// src/pages/tags/[tag].astro
import BaseLayout from '../../../layouts/BaseLayout.astro';
import PostCard from '../../../components/PostCard.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const allPosts = await getCollection('posts', ({ data }) => !data.draft);
  const tagSet = new Set<string>();
  allPosts.forEach((post) => post.data.tags.forEach((tag) => tagSet.add(tag)));

  return Array.from(tagSet).map((tag) => ({
    params: { tag },
    props: { tag },
  }));
}

const { tag } = Astro.props;
const allPosts = await getCollection('posts', ({ data }) => !data.draft);
const filteredPosts = allPosts
  .filter((post) => post.data.tags.includes(tag))
  .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
---

<BaseLayout title={`标签: ${tag}`}>
  <div class="tag-filter">
    <div class="tag-header">
      <a href="/tags" class="back-tags">← 所有标签</a>
      <h1>{tag}</h1>
      <p class="tag-info">共 {filteredPosts.length} 篇文章</p>
    </div>
    <div class="post-list">
      {filteredPosts.map((post) => (
        <PostCard
          title={post.data.title}
          slug={post.data.slug}
          date={post.data.date}
          description={post.data.description}
          tags={post.data.tags}
        />
      ))}
    </div>
  </div>
</BaseLayout>

<style>
  .tag-filter {
    max-width: 720px;
    margin: 0 auto;
  }
  .tag-header {
    margin-bottom: 2rem;
  }
  .back-tags {
    color: var(--text-muted);
    font-size: 0.85rem;
  }
  .tag-header h1 {
    margin: 0.5rem 0;
  }
  .tag-info {
    color: var(--text-muted);
    font-size: 0.9rem;
  }
</style>
```

- [ ] **Step 3: 验证标签功能**

访问 `http://localhost:4321/tags` 确认标签总览正常。
访问 `http://localhost:4321/tags/技术` 确认筛选功能正常。

- [ ] **Step 4: 提交**

```bash
git add src/pages/tags/
git commit -m "feat: 创建标签总览和筛选页面"
```

---

### Task 10: 最终检查与部署配置

**Files:**
- Create: `README.md`
- Modify: `public/avatar.jpg`（用户自行替换真实头像）

- [ ] **Step 1: 完整构建测试**

Run: `npx astro build`
Expected: 构建成功，`dist/` 目录下生成静态文件

- [ ] **Step 2: 预览构建结果**

Run: `npx astro preview`
Expected: 访问所有页面确认正常

- [ ] **Step 3: 创建 README**

```markdown
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
slug: "url-slug"
date: "2026-05-21"
tags: ["标签1", "标签2"]
description: "文章摘要"
---
正文内容...
```

## 部署

推送到 GitHub 后，Vercel 会自动构建部署。

## 替换头像

将你的头像图片重命名为 `avatar.jpg` 放到 `public/` 目录下。
```

- [ ] **Step 4: 最终提交**

```bash
git add .
git commit -m "chore: 添加 README 和最终检查"
```

---

## 部署指南（Vercel）

1. 将项目推送到 GitHub 仓库
2. 登录 Vercel，导入该 GitHub 仓库
3. Vercel 自动识别 Astro 项目，直接部署
4. 在 Vercel 项目设置中添加自定义域名 `yizhen.life`
5. 去域名注册商添加 CNAME 记录：`yizhen.life` → `cname.vercel-dns.com`
6. 等待 DNS 生效（通常几分钟到几小时）

## 后续可扩展功能（不在本期范围）

- [ ] 深色模式切换
- [ ] 文章搜索
- [ ] 归档页面（按年月）
- [ ] RSS 订阅
- [ ] 文章评论系统
- [ ] 访问统计
