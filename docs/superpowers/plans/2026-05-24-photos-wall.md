# 照片墙页面实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为「一帧.life」博客新增照片墙页面，采用瀑布流布局 + PhotoSwipe 灯箱，提供优秀的照片浏览体验

**Architecture:** 使用 Mason.js 实现瀑布流布局，PhotoSwipe 实现灯箱功能，照片元数据存储在 JSON 文件中

**Tech Stack:** Masonry.js, PhotoSwipe, Astro, CSS

---

## 文件结构

### 新增文件
- `public/data/photos.json` — 照片元数据
- `src/pages/photos/index.astro` — 照片墙页面
- `src/components/PhotoGrid.astro` — 瀑布流网格组件
- `src/components/PhotoCard.astro` — 单个照片卡片组件
- `src/styles/photos.css` — 照片墙专用样式

### 修改文件
- `package.json` — 添加 Masonry.js 和 PhotoSwipe 依赖
- `src/components/Header.astro` — 添加照片墙导航链接

### 测试照片
- `public/images/photos/2024/01/test1.jpg` — 测试照片 1
- `public/images/photos/2024/01/test2.jpg` — 测试照片 2
- `public/images/photos/2024/01/test3.jpg` — 测试照片 3

---

## Task 1: 安装依赖

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 安装 Masonry.js 和 PhotoSwipe**

Run: `npm install masonry-layout photoswipe`

Expected: 依赖安装成功，package.json 更新

- [ ] **Step 2: 验证安装**

Run: `npm list masonry-layout photoswipe`

Expected: 显示已安装的版本号

- [ ] **Step 3: 提交依赖变更**

```bash
git add package.json package-lock.json
git commit -m "feat: 添加 Masonry.js 和 PhotoSwipe 依赖"
```

---

## Task 2: 创建照片元数据

**Files:**
- Create: `public/data/photos.json`
- Create: `public/images/photos/2024/01/test1.jpg`
- Create: `public/images/photos/2024/01/test2.jpg`
- Create: `public/images/photos/2024/01/test3.jpg`

- [ ] **Step 1: 创建照片目录结构**

Run: `mkdir -p public/images/photos/2024/01`

Expected: 目录创建成功

- [ ] **Step 2: 创建测试照片**

创建 3 张测试照片（可以使用在线工具生成或复制现有照片）：
- `test1.jpg` — 800x600
- `test2.jpg` — 600x800
- `test3.jpg` — 800x800

- [ ] **Step 3: 创建照片元数据文件**

```json
{
  "photos": [
    {
      "id": "photo-001",
      "filename": "test1.jpg",
      "path": "/images/photos/2024/01/test1.jpg",
      "title": "测试照片 1",
      "description": "这是一张测试照片",
      "date": "2024-01-15",
      "width": 800,
      "height": 600,
      "tags": ["测试"]
    },
    {
      "id": "photo-002",
      "filename": "test2.jpg",
      "path": "/images/photos/2024/01/test2.jpg",
      "title": "测试照片 2",
      "description": "这是另一张测试照片",
      "date": "2024-01-16",
      "width": 600,
      "height": 800,
      "tags": ["测试"]
    },
    {
      "id": "photo-003",
      "filename": "test3.jpg",
      "path": "/images/photos/2024/01/test3.jpg",
      "title": "测试照片 3",
      "description": "这是第三张测试照片",
      "date": "2024-01-17",
      "width": 800,
      "height": 800,
      "tags": ["测试"]
    }
  ]
}
```

- [ ] **Step 4: 提交照片数据**

```bash
git add public/data/photos.json public/images/
git commit -m "feat: 添加照片元数据和测试照片"
```

---

## Task 3: 创建照片墙样式

**Files:**
- Create: `src/styles/photos.css`

- [ ] **Step 1: 创建照片墙样式文件**

```css
/* ===== 照片墙页面 ===== */
.photos-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.photos-page h1 {
  font-size: 1.5rem;
  margin-bottom: 0.4rem;
}

.photos-count {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: 2rem;
}

/* ===== 瀑布流网格 ===== */
.photo-grid {
  margin: 0 auto;
}

.photo-grid::after {
  content: '';
  display: block;
  clear: both;
}

/* ===== 照片卡片 ===== */
.photo-card {
  float: left;
  width: calc(33.333% - 11px);
  margin-bottom: 16px;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  background: var(--bg-card);
}

.photo-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.photo-card img {
  width: 100%;
  height: auto;
  display: block;
  transition: opacity 0.3s ease;
}

.photo-card img[loading="lazy"] {
  opacity: 0;
}

.photo-card img.loaded {
  opacity: 1;
}

/* ===== 照片信息 ===== */
.photo-info {
  padding: 0.8rem 1rem;
}

.photo-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.2rem;
  line-height: 1.4;
}

.photo-date {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* ===== 响应式 ===== */
@media (max-width: 1200px) {
  .photo-card {
    width: calc(50% - 8px);
  }
}

@media (max-width: 768px) {
  .photo-card {
    width: 100%;
    margin-bottom: 12px;
  }
  
  .photos-page {
    padding: 1.5rem 1rem;
  }
}
```

- [ ] **Step 2: 提交样式文件**

```bash
git add src/styles/photos.css
git commit -m "feat: 添加照片墙样式"
```

---

## Task 4: 创建 PhotoCard 组件

**Files:**
- Create: `src/components/PhotoCard.astro`

- [ ] **Step 1: 创建 PhotoCard 组件**

```astro
---
interface Props {
  id: string;
  path: string;
  title?: string;
  date: string;
  width: number;
  height: number;
}

const { id, path, title, date, width, height } = Astro.props;
---

<div 
  class="photo-card" 
  data-id={id}
  data-src={path}
  data-width={width}
  data-height={height}
  data-title={title}
  data-date={date}
>
  <img 
    src={path} 
    alt={title || '照片'} 
    loading="lazy"
    width={width}
    height={height}
    onload="this.classList.add('loaded')"
  />
  {title && (
    <div class="photo-info">
      <div class="photo-title">{title}</div>
      <div class="photo-date">{date}</div>
    </div>
  )}
</div>
```

- [ ] **Step 2: 提交 PhotoCard 组件**

```bash
git add src/components/PhotoCard.astro
git commit -m "feat: 添加 PhotoCard 组件"
```

---

## Task 5: 创建 PhotoGrid 组件

**Files:**
- Create: `src/components/PhotoGrid.astro`

- [ ] **Step 1: 创建 PhotoGrid 组件**

```astro
---
import PhotoCard from './PhotoCard.astro';

interface Photo {
  id: string;
  path: string;
  title?: string;
  date: string;
  width: number;
  height: number;
}

interface Props {
  photos: Photo[];
}

const { photos } = Astro.props;
---

<div class="photo-grid" id="photo-grid">
  {photos.map((photo) => (
    <PhotoCard
      id={photo.id}
      path={photo.path}
      title={photo.title}
      date={photo.date}
      width={photo.width}
      height={photo.height}
    />
  ))}
</div>

<script>
  import Masonry from 'masonry-layout';
  import PhotoSwipe from 'photoswipe';
  import 'photoswipe/style.css';

  // 初始化 Masonry
  const grid = document.getElementById('photo-grid');
  if (grid) {
    const masonry = new Masonry(grid, {
      itemSelector: '.photo-card',
      columnWidth: '.photo-card',
      percentPosition: true,
      gutter: 16,
      fitWidth: true
    });

    // 图片加载完成后重新布局
    const images = grid.querySelectorAll('img');
    let loadedCount = 0;
    
    images.forEach((img) => {
      if (img.complete) {
        loadedCount++;
        if (loadedCount === images.length) {
          masonry.layout();
        }
      } else {
        img.addEventListener('load', () => {
          loadedCount++;
          if (loadedCount === images.length) {
            masonry.layout();
          }
        });
      }
    });
  }

  // 初始化 PhotoSwipe
  const cards = document.querySelectorAll('.photo-card');
  
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const items = Array.from(cards).map((c) => ({
        src: c.dataset.src,
        width: parseInt(c.dataset.width),
        height: parseInt(c.dataset.height),
        title: c.dataset.title
      }));
      
      const clickedIndex = Array.from(cards).indexOf(card);
      
      const lightbox = new PhotoSwipe({
        dataSource: items,
        index: clickedIndex,
        showHideAnimationType: 'zoom',
        bgOpacity: 0.9,
        padding: { top: 20, bottom: 20, left: 20, right: 20 }
      });
      
      lightbox.init();
    });
  });
</script>
```

- [ ] **Step 2: 提交 PhotoGrid 组件**

```bash
git add src/components/PhotoGrid.astro
git commit -m "feat: 添加 PhotoGrid 组件"
```

---

## Task 6: 创建照片墙页面

**Files:**
- Create: `src/pages/photos/index.astro`

- [ ] **Step 1: 创建照片墙页面**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PhotoGrid from '../../components/PhotoGrid.astro';

// 读取照片数据
const response = await fetch('/data/photos.json');
const data = await response.json();
const photos = data.photos;

// 按日期排序（最新的在前）
const sortedPhotos = photos.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);
---

<BaseLayout title="照片墙">
  <div class="photos-page">
    <h1>照片墙</h1>
    <p class="photos-count">共 {sortedPhotos.length} 张照片</p>
    <PhotoGrid photos={sortedPhotos} />
  </div>
</BaseLayout>

<style>
  @import '../../styles/photos.css';
</style>
```

- [ ] **Step 2: 提交照片墙页面**

```bash
git add src/pages/photos/index.astro
git commit -m "feat: 添加照片墙页面"
```

---

## Task 7: 更新导航栏

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: 添加照片墙导航链接**

在 `Header.astro` 的 `<ul class="nav-links">` 中添加：

```html
<li><a href="/photos" class:list={["nav-link", { active: currentPath.startsWith("/photos") }]}>照片墙</a></li>
```

完整代码：

```astro
<ul class="nav-links">
  <li><a href="/" class:list={["nav-link", { active: currentPath === "/" }]}>首页</a></li>
  <li><a href="/tech" class:list={["nav-link", { active: currentPath.startsWith("/tech") }]}>技术</a></li>
  <li><a href="/life" class:list={["nav-link", { active: currentPath.startsWith("/life") }]}>生活</a></li>
  <li><a href="/photos" class:list={["nav-link", { active: currentPath.startsWith("/photos") }]}>照片墙</a></li>
  <li><a href="/about" class:list={["nav-link", { active: currentPath === "/about" }]}>关于我</a></li>
</ul>
```

- [ ] **Step 2: 提交导航栏更新**

```bash
git add src/components/Header.astro
git commit -m "feat: 添加照片墙导航链接"
```

---

## Task 8: 测试和验证

**Files:**
- None (testing only)

- [ ] **Step 1: 启动开发服务器**

Run: `npm run dev`

Expected: 开发服务器启动成功

- [ ] **Step 2: 访问照片墙页面**

在浏览器中访问：`http://localhost:4321/photos`

Expected: 
- 页面正常加载
- 显示 3 张测试照片
- 瀑布流布局正确显示

- [ ] **Step 3: 测试灯箱功能**

点击任意一张照片

Expected:
- 灯箱正常打开
- 显示大图
- 可以左右切换照片
- 可以关闭灯箱

- [ ] **Step 4: 测试响应式布局**

调整浏览器窗口大小

Expected:
- 桌面端：3 列布局
- 平板：2 列布局
- 手机：1 列布局

- [ ] **Step 5: 测试导航栏**

检查导航栏

Expected:
- 照片墙链接正常显示
- 点击可以跳转到照片墙页面
- 当前页面时链接高亮

- [ ] **Step 6: 提交所有变更**

```bash
git add .
git commit -m "feat: 完成照片墙页面功能"
```

---

## 自我审查

### 1. 规范覆盖检查

✅ 照片元数据结构 — Task 2
✅ 瀑布流布局 — Task 5
✅ 灯箱功能 — Task 5
✅ 响应式设计 — Task 3
✅ 导航集成 — Task 7
✅ 懒加载 — Task 4
✅ 样式设计 — Task 3

### 2. 占位符扫描

✅ 无 TBD、TODO 或不完整的部分
✅ 所有代码都是完整的
✅ 所有命令都有明确的执行步骤

### 3. 类型一致性检查

✅ PhotoCard 组件的 Props 接口一致
✅ PhotoGrid 组件的 Photo 接口一致
✅ 照片元数据结构一致

---

## 执行选项

**计划已完成并保存到 `docs/superpowers/plans/2026-05-24-photos-wall.md`**

两种执行方式：

**1. Subagent-Driven（推荐）** — 我为每个任务派发独立的子代理，任务间进行审查，快速迭代

**2. Inline Execution** — 在当前会话中执行任务，批量执行并设置检查点

你选择哪种方式？
