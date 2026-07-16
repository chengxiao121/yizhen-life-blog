# 一帧.life — UI 设计系统

> 完整项目文档见 `./project-document.md`

---

## 一、设计概述

| 特征 | 说明 |
|------|------|
| **背景** | WebGL 粒子动画（橙色 `#F97316` 粒子，深色画布 `#0a0a0f`） |
| **主色** | 黄色 `#FFE600` + 橙色 `#F97316`，白色文字，暗色背景 |
| **风格** | 暗色主题，毛玻璃卡片，圆形头像，无装饰图标，干净克制 |
| **字体** | 霞鹜文楷（LXGW WenKai）+ 系统 Serif 回退 + JetBrains Mono 代码 |
| **hover** | 黄色边框 `rgba(255,230,0,0.45)` + 橙色发光阴影 |

---

## 二、配色系统

### 2.1 CSS 变量

```css
:root {
  /* 背景 */
  --bg-primary: rgba(10, 10, 15, 0.85);
  --bg-card: #1E293B;
  --bg-code: #2a2a2a;

  /* 文字 */
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --text-muted: #888888;

  /* 点缀色 */
  --deco-yellow: #FFE600;
  --deco-blue: #F97316;
  --deco-red: #F97316;
  --deco-pink: #F97316;
  --deco-green: #F97316;
  --deco-cyan: #F97316;

  /* 半透明 */
  --deco-yellow-20: rgba(255, 230, 0, 0.2);
  --deco-blue-20: rgba(249, 115, 22, 0.2);
  --deco-pink-20: rgba(249, 115, 22, 0.2);

  /* 全局 */
  --accent: #FFE600;
  --accent-hover: #FFCC00;
  --border: #666666;
  --border-light: #555555;
  --shadow: none;
  --radius: 0px;
  --max-width: 720px;
}
```

### 2.2 实际使用的颜色

| 颜色 | 用途 |
|------|------|
| `#FFE600` 黄 | Logo、Sidebar 名称、默认链接、落地页标题/按钮、Prose H1、图片描边、列表标记 |
| `#F97316` 橙 | 粒子、hover 发光、Sidebar 签名/标签、时间、Prose H2/H3/链接/引用/分割线/表格、Footer 线、落地页副标题/按钮 hover |
| `#ffffff` 白 | 正文、标题 |
| `#cccccc` 浅灰 | 辅助文字 |
| `#888888` 灰 | 日期、次要信息 |

### 2.3 粒子背景参数

| 参数 | 值 |
|------|-----|
| 画布色 | `#0a0a0f` |
| 粒子色 | `#F97316` |
| 数量 / 扩散 / 速度 / 大小 | 600 / 10 / 0.1 / 100 |

### 2.4 hover 发光

| 属性 | 值 |
|------|-----|
| 发光色 | `#F97316` |
| 边框 | `rgba(255, 230, 0, 0.45)` |
| 外发光 | `0 0 12px rgba(249, 115, 22, 0.15)` |
| 内发光 | `inset 0 0 8px rgba(249, 115, 22, 0.06)` |
| 上浮 | `translateY(-1px)` |

---

## 三、字体

| 场景 | 字体栈 |
|------|------|
| 中文正文 | `'LXGW WenKai', 'Noto Serif SC', serif` |
| 代码 | `'JetBrains Mono', 'Fira Code', 'SF Mono', monospace` |

### 字号层级

| 元素 | 字号 | 字重 |
|------|------|------|
| 落地页标题 | 3.5rem | 900 |
| 关于页/文章标题 | 1.8-1.85rem | 700 |
| 页面标题 H1 | 1.6-1.75rem | 700 |
| 统计数字 | 1.5rem | 800 |
| Prose H2 / 博客章节 | 1.35-1.4rem | 700 |
| Logo / Prose H3 | 1.15-1.2rem | 700-800 |
| 正文 | 1rem | 400 |
| 辅助/标签 | 0.75-0.9rem | 400-700 |

---

## 四、Logo

纯色，无 text-shadow 叠加：

```css
.logo-text {
  color: #FFE600;
  font-size: 1.15rem;
  font-weight: 800;
}
```

落地页大标题：

```css
.site-name {
  color: #FFE600;
  font-size: 3.5rem;
  font-weight: 900;
  text-shadow: 3px 3px 0 #F97316;
}
```

---

## 五、组件

### 5.1 粒子背景

| 属性 | 值 |
|------|-----|
| 定位 | `position: fixed; inset: 0; z-index: -1` |
| 渲染 | ogl WebGL，FOV 15，距离 18 |
| 运动 | 正弦波 + 缓慢自转 |
| 生命周期 | `astro:before-swap` 清理 |

### 5.2 导航栏

| 属性 | 值 |
|------|-----|
| 定位 | fixed，z-index: 100 |
| 背景 | `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.35))` |
| 毛玻璃 | `blur(16px) saturate(1.4)` |
| 高度 | 52px（nav），~71px 含 padding |
| 宽度 | max-width: 1100px |

导航链接胶囊：

| 状态 | 背景 | 边框 | 文字 |
|------|------|------|------|
| 默认 | `rgba(255,255,255,0.06)` | `1.5px solid rgba(255,255,255,0.15)` | `rgba(255,255,255,0.88)` |
| hover | 不变 | `rgba(255,230,0,0.45)` | `#fff` |
| active | 不变 | `rgba(249,115,22,0.55)` + 发光 | `#fff` |

### 5.3 毛玻璃卡片

PostCard、Sidebar 资料卡、SiteStats 共享：

```css
.card {
  background: rgba(255, 255, 255, 0.06);
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  backdrop-filter: blur(8px);
}
.card:hover {
  border-color: rgba(255, 230, 0, 0.45);
  box-shadow: 0 0 12px rgba(249, 115, 22, 0.15),
              inset 0 0 8px rgba(249, 115, 22, 0.06);
  transform: translateY(-1px);
}
```

### 5.4 标签

| 属性 | 值 |
|------|-----|
| 背景 | `rgba(255, 255, 255, 0.08)` |
| 圆角 | 0 |
| 字号 | 0.75rem，字重 700 |
| hover | `scale(1.08)` |

### 5.5 头像

| 位置 | 尺寸 | 样式 |
|------|------|------|
| Sidebar | 90×90px | 圆形 `border-radius: 50%` |
| About 页 | 120×120px | 圆形 `border-radius: 50%` |

### 5.6 按钮

```css
.enter-btn {
  background: #FFE600;
  border: 4px solid #FFE600;
  color: #000;
}
.enter-btn:hover {
  background: #F97316;
  border-color: #F97316;
  color: #fff;
  transform: scale(1.05);
}
```

---

## 六、文章样式（Prose）

| 元素 | 样式 |
|------|------|
| 容器 | max-width: 720px，居中 |
| H1 | 黄色 `#FFE600`，1.6rem |
| H2 | 橙色 `#F97316`，1.35rem |
| H3 | 橙色 `#F97316`，1.15rem |
| 段落 | margin-bottom: 1.2em |
| 链接 | 橙色 `#F97316` + 下划线，hover 变黄 |
| 行内代码 | 深灰背景 `#2a2a2a`，1px `#666` 描边 |
| 代码块 | 深色背景 `#2a2a2a`，无边框 |
| 引用块 | 橙色 `#F97316` 4px 左边框 + 半透明橙色背景，斜体 |
| 图片 | 黄色 `#FFE600` 3px 描边 |
| 分割线 | 橙色 `#F97316` 3px 虚线 |
| 列表 | `::marker` 黄色 |
| 表格 | 橙色 2px 边框，表头无背景 |

---

## 七、布局

### 7.1 整体结构

```
┌──────────────────────────────────────┐
│     粒子背景（fixed，全屏，z:-1）       │
├──────────────────────────────────────┤
│         导航栏（fixed，z:100）          │
├──────────────────────────────────────┤
│         Hero 图片 50vh                │
├──────────────────────────────────────┤
│    波浪 SVG（fixed，z:10，#0a0a0f）    │
├──────────────────────────────────────┤
│  ┌────────┐  ┌──────────┐  ┌──────┐ │
│  │ 左侧   │  │  主内容  │  │ 右侧 │ │
│  │ 280px  │  │  flex:1  │  │250px │ │
│  └────────┘  └──────────┘  └──────┘ │
├──────────────────────────────────────┤
│         站点统计（max 900px）          │
├──────────────────────────────────────┤
│               Footer                 │
└──────────────────────────────────────┘
```

### 7.2 z-index 层级

| 层级 | 元素 | z-index |
|------|------|---------|
| 底 | ParticlesBackground | -1 |
| ↑ | hero-bg、正常流内容 | — |
| ↑ | content-wrapper | 2 |
| ↑ | hero-wave | 10 |
| ↑ | sidebar | 50 |
| ↑ | Header | 100 |

### 7.3 左侧资料卡

| 属性 | 值 |
|------|-----|
| 定位 | sticky，top: 72px |
| 宽度 | 280px |
| 内容 | 圆形头像 → 黄色名称 → 橙色签名 → 个人信息列表 |
| 隐藏 | ≤1100px |

### 7.4 右侧栏目

| 属性 | 值 |
|------|-----|
| 定位 | sticky，top: 72px |
| 宽度 | 250px |
| 内容 | 分类列表（CategorySidebar）→ 照片轮播（4s）→ 随机句子 |
| 隐藏 | ≤1100px |

### 7.5 站点统计

| 属性 | 值 |
|------|-----|
| 卡片 | 毛玻璃，hover 橙色发光 |
| 时间 | 橙色 `#F97316`，等宽数字，每秒刷新 |
| 运行数字 | 橙色 `#F97316`，1.5rem |

### 7.6 Footer

| 属性 | 值 |
|------|-----|
| 上边框 | `4px solid #F97316` |
| 文字 | 版权 + "Made with love"（橙色） |

---

## 八、页面规范

### 8.1 落地页（`/`）

| 属性 | 值 |
|------|-----|
| 背景 | `landing-bg.mp4`，opacity 0.4 |
| 标题 | 黄色 `#FFE600` + 橙色 text-shadow |
| 副标题 | 橙色 `#F97316` |
| 按钮 | 黄底黑字，hover 橙底白字 |
| 入场 | `fadeUp` 1.2s |

### 8.2 博客首页（`/blog`）

| 属性 | 值 |
|------|-----|
| 网格 | 2 列，第一篇跨两列 |
| 章节标题 | 白色，黄色虚线分隔 |
| 拼贴 | 旋转 -1.5°~1°，hover 归正 + scale |

### 8.3 分类页（`/tech`、`/life`）

| 属性 | 值 |
|------|-----|
| 标题 | 白色，1.6rem |
| 卡片 | 单列，旋转 -0.8°~0.8° |
| 最大宽度 | 720px |

### 8.4 照片墙（`/photos`）

| 属性 | 值 |
|------|-----|
| 标题 | 白色，1.6rem |
| 网格 | Masonry，6→3 列响应式 |
| 灯箱 | PhotoSwipe |

### 8.5 关于我（`/about`）

| 属性 | 值 |
|------|-----|
| 头像 | 120px 圆形 |
| 标题 | 白色，1.8rem |
| 内容 | 透明背景，无装饰元素 |

### 8.6 标签页（`/tags`）

| 属性 | 值 |
|------|-----|
| 标签网格 | `auto-fill, minmax(130px, 1fr)` |
| 卡片 | `#1E293B` 背景，hover 上浮 |

---

## 九、响应式

| 断点 | 变化 |
|------|------|
| ≤1100px | 隐藏左右侧边栏 |
| ≤768px | 单列、取消旋转、html 15px |
| ≤480px | 导航精简、照片墙 3 列 |

---

## 十、动画

| 动画 | 时长 | 位置 |
|------|------|------|
| `fadeInUp` | 0.5s | Sidebar、博客卡片入场 |
| `fadeUp` | 1.2s | 落地页入场 |
| 粒子旋转/振荡 | requestAnimationFrame | 全站背景 |

---

## 十一、静态资源

| 资源 | 路径 | 用途 |
|------|------|------|
| 头像 | `public/avatar.jpg` | Sidebar、关于页 |
| Hero 图 | `public/page-bg.png` | 博客 50vh 顶部 |
| 视频 | `public/landing-bg.mp4` | 落地页背景 |
| 照片数据 | `public/data/photos.json` | 照片墙 |
| 句子数据 | `public/data/quotes.json` | 随机句子 |

---

## 十二、依赖

| 包 | 用途 |
|------|------|
| `astro` ^5.7.0 | 静态站点 |
| `ogl` | WebGL 粒子背景 |
| `masonry-layout` ^4.2.2 | 照片瀑布流 |
| `photoswipe` ^5.4.4 | 照片灯箱 |
| `sharp` ^0.33.0 | 图片尺寸检测 |

---

*完整项目文档见 `./project-document.md`*
*开发指南见 `./development-guide.md`*
