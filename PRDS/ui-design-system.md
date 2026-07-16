# 一帧.life — UI 设计系统

> 完整项目文档见 `./project-document.md`

---

## 一、设计概述

| 特征 | 说明 |
|------|------|
| **背景** | WebGL 粒子动画（橙色 `#F97316` 粒子，深色画布 `#0a0a0f`） |
| **配色** | 高饱和撞色（黄/蓝/红/青/粉/绿）点缀于暗色背景之上 |
| **风格** | 平面化无阴影，卡片毛玻璃，标题叠加 text-shadow，无圆角（卡片例外） |
| **字体** | 霞鹜文楷（LXGW WenKai）+ 系统 Serif 回退 |
| **hover** | 青色 `#00F0FF` 发光效果 |

---

## 二、配色系统

### 2.1 实际使用的 CSS 变量

```css
:root {
  /* 背景 */
  --bg-primary: rgba(10, 10, 15, 0.85);   /* 半透明深色 */
  --bg-card: #1E293B;                       /* 卡片/内容区底色 */
  --bg-code: #2a2a2a;                       /* 代码块底色 */

  /* 文字 */
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --text-muted: #888888;

  /* 全局 */
  --accent: #FFE600;                        /* 默认链接色 */
  --accent-hover: #FFCC00;
  --border: #666666;
  --border-light: #555555;
  --shadow: none;
  --shadow-hover: none;
  --radius: 0px;
  --max-width: 720px;

  /* 高饱和撞色 */
  --deco-yellow: #FFE600;
  --deco-blue: #0066FF;
  --deco-red: #FF0033;
  --deco-pink: #FF69B4;
  --deco-green: #39FF14;
  --deco-cyan: #00FFFF;

  /* 半透明（仅用到一个） */
  --deco-pink-20: rgba(255, 105, 180, 0.2);
}
```

### 2.2 各颜色实际用途

| 变量 | 颜色 | 用途 |
|------|------|------|
| `--deco-yellow` | `#FFE600` | Logo 文字、标题 hover、H1 色、列表标记、统计数字、分割线、图片描边、链接 hover |
| `--deco-cyan` | `#00FFFF` | hover 发光、时间显示、H2 色、签名/引号/信息标签、Prose 链接 |
| `--deco-pink` | `#FF69B4` | Footer 边框、选中色、H3 色、引用块、分割线、生活页/照片墙标题 |
| `--deco-red` | `#FF0033` | 仅用于 text-shadow 叠加层（不与背景同时出现） |
| `--deco-blue` | `#0066FF` | text-shadow 叠加层、代码块/表格描边、印章卡片、技术页标题 |
| `--deco-green` | `#39FF14` | 行内代码文字色、印章卡片 |
| `--deco-pink-20` | 20% 粉 | 引用块背景 |

### 2.3 粒子背景参数

| 参数 | 值 |
|------|-----|
| 画布色 | `#0a0a0f` / `clearColor(0.05, 0.05, 0.06, 1.0)` |
| 粒子色 | `#F97316`（橙色，单色） |
| 数量 | 600 |
| 扩散 | 10 |
| 速度 | 0.1 |
| 大小 | 100（基础） |
| 像素比 | 5 |
| 透明度 | 关闭（实心圆点） |
| 鼠标交互 | 关闭 |

### 2.4 hover 发光

| 属性 | 值 |
|------|-----|
| 发光色 | `#00F0FF` |
| 卡片 hover 背景 | `rgba(0, 240, 255, 0.12)` |
| 卡片 hover 边框 | `rgba(0, 240, 255, 0.45)` |
| 外发光 | `0 0 12px rgba(0, 240, 255, 0.15)` |
| 内发光 | `inset 0 0 8px rgba(0, 240, 255, 0.06)` |

---

## 三、字体规范

| 场景 | 字体栈 | 来源 |
|------|------|------|
| 中文正文 | `'LXGW WenKai', 'Noto Serif SC', serif` | Google Fonts |
| 代码 | `'JetBrains Mono', 'Fira Code', 'SF Mono', monospace` | 系统字体栈 |

### 3.1 字号层级

| 元素 | 字号 | 字重 |
|------|------|------|
| 落地页标题 | 3.5rem | 900 |
| 文章标题（详情页） | 1.85rem | 700 |
| 关于页标题 | 1.8rem | 700 |
| 全局 H1 | 1.75rem | 700 |
| Prose H1 | 1.6rem | 700 |
| 分类页标题 | 1.6rem | 700 |
| 统计数字 | 1.5rem | 800 |
| 标签页/照片墙标题 | 1.5rem | 700 |
| 全局 H2 / 博客章节标题 | 1.4rem | 700 |
| Prose H2 | 1.35rem | 700 |
| 特色卡片标题 | 1.3rem | 700 |
| 全局 H3 | 1.2rem | 700 |
| Logo | 1.15rem | 800 |
| Prose H3 / 当前时间 | 1.15rem / 1.1rem | 700 |
| 正文 | 1rem | 400 |
| 辅助文字 | 0.85–0.9rem | 400–600 |
| 小字/标签 | 0.75–0.78rem | 400–700 |

---

## 四、Logo

**导航栏：**

```css
.logo-text {
  color: #FFE600;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-shadow: 1px 1px 0 #FF0033, 2px 2px 0 #0066FF;
}
```

**落地页大标题：**

```css
.site-name {
  color: #FFE600;
  font-size: 3.5rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-shadow: 3px 3px 0 #FF0033, 6px 6px 0 #0066FF;
}
```

---

## 五、组件规范

### 5.1 粒子背景（ParticlesBackground）

WebGL 3D 粒子动画，全站背景。

| 属性 | 值 |
|------|-----|
| 定位 | `position: fixed; inset: 0; z-index: -1` |
| 容器背景 | `#0a0a0f` |
| 渲染 | ogl（WebGL），`depth: false`，无透明度通道 |
| 相机 | FOV 15，距离 18 |
| 粒子分布 | 单位球体内均匀分布 |
| 运动 | 正弦波振荡 + 缓慢自转 |
| 生命周期 | `astro:before-swap` 时清理 |

### 5.2 导航栏（Header）

| 属性 | 值 |
|------|-----|
| 定位 | `position: fixed`，`z-index: 100` |
| 背景 | `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.35))` |
| 毛玻璃 | `backdrop-filter: blur(16px) saturate(1.4)` |
| 底部边框 | `1px solid rgba(255, 255, 255, 0.08)` |
| 宽度 | `max-width: 1100px`，居中 |
| 高度 | 52px（nav），~71px 含 padding |

**导航链接（胶囊按钮）：**

| 状态 | 背景 | 边框 | 文字 |
|------|------|------|------|
| 默认 | `rgba(255,255,255,0.06)` | `1.5px solid rgba(255,255,255,0.15)` | `rgba(255,255,255,0.88)` |
| hover | `rgba(0,240,255,0.12)` | `rgba(0,240,255,0.45)` | `#fff` |
| active | `rgba(0,240,255,0.18)` | `rgba(0,240,255,0.55)` | `#fff`（+ 底部 4px 青色指示圆点） |

- 字号 0.85rem，字重 600，圆角 999px
- hover 上浮 `translateY(-1px)`

### 5.3 毛玻璃卡片（通用规范）

PostCard、Sidebar 资料卡、CategorySidebar、SiteStats、RightSidebar 区块共享：

```css
.card {
  background: rgba(255, 255, 255, 0.06);
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  backdrop-filter: blur(8px);
  transition: background 0.25s ease, border-color 0.25s ease,
              box-shadow 0.25s ease, transform 0.15s ease;
}
.card:hover {
  background: rgba(0, 240, 255, 0.12);
  border-color: rgba(0, 240, 255, 0.45);
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.15),
              inset 0 0 8px rgba(0, 240, 255, 0.06);
  transform: translateY(-1px);
}
```

### 5.4 文章卡片（PostCard）

| 属性 | 值 |
|------|-----|
| 内边距 | `1.4rem 1.5rem 1.2rem` |
| 日期 | `var(--text-muted)`，0.8rem |
| 分类标签 | `var(--text-muted)`，0.72rem，无边框无圆角 |
| 标题 | 1.1rem，700，hover 时变 `#FFE600` |
| 描述 | 0.88rem，`var(--text-secondary)`，限制 2 行 |
| 底部 | `border-top: 2px dashed var(--border)` |
| hover | 青色发光 + `scale(1.02)` + 旋转归正 |
| 特色卡片 | `padding: 1.8rem 2rem 1.5rem`，标题 1.3rem，描述 3 行 |

### 5.5 标签（Tag）

| 属性 | 值 |
|------|-----|
| 背景 | `rgba(255, 255, 255, 0.08)`（统一，不区分类型） |
| 文字 | `var(--text-secondary)` |
| 圆角 | 0（直角） |
| 边框 | 无 |
| 内边距 | `0.15em 0.7em` |
| 字号 | 0.75rem，字重 700 |
| hover | `transform: scale(1.08)` |

### 5.6 头像

| 位置 | 尺寸 | 样式 |
|------|------|------|
| Sidebar | 90×90px | 六边形 clip-path，黄色内边距 + 粉色 3px 边框 |
| About 页 | 120×120px | 六边形 clip-path，黄色 4px 边框 |

六边形：`clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)`

### 5.7 按钮

```css
.enter-btn {
  background: #FFE600;
  border: 4px solid #FFE600;
  border-radius: 0;
  color: #000;
  font-size: 1.1rem;
  font-weight: 800;
  padding: 0.7em 2.4em;
}
.enter-btn:hover {
  background: #FF0033;
  border-color: #FF0033;
  color: #fff;
  transform: scale(1.05);
}
```

---

## 六、文章内容样式（Prose）

Markdown 渲染的文章正文。

| 元素 | 样式 |
|------|------|
| 容器 | `max-width: 720px`，居中，`line-height: 1.9` |
| H1 | 黄色 `#FFE600`，1.6rem |
| H2 | 青色 `#00FFFF`，1.35rem |
| H3 | 粉色 `#FF69B4`，1.15rem |
| 段落 | `margin-bottom: 1.2em` |
| 链接 | 青色 + 下划线，hover 变黄色 |
| 行内代码 | 深灰背景，绿色文字，1px `#666` 描边 |
| 代码块 | `#2a2a2a` 背景，蓝色 3px 描边，`#cdd6f4` 文字 |
| 引用块 | 粉色 4px 左边框 + 20% 粉色背景，斜体 |
| 图片 | 黄色 3px 描边 |
| 分割线 | 粉色 3px 虚线 |
| 列表 | `::marker` 黄色 |
| 表格 | 蓝色 2px 边框，蓝色表头 |

---

## 七、布局系统

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

### 7.3 左侧资料卡（Sidebar）

| 属性 | 值 |
|------|-----|
| 定位 | sticky，top: 72px，`z-index: 50` |
| 宽度 | 280px |
| 入场 | `fadeInUp` 0.6s ease-out |
| 内容 | 六边形头像 → 名称（黄色 + 红蓝 text-shadow） → 签名（青色） → 个人信息列表（虚线分隔） |
| 隐藏 | ≤1100px |

### 7.4 右侧栏目（RightSidebar）

| 属性 | 值 |
|------|-----|
| 定位 | sticky，top: 72px，`z-index: 50` |
| 宽度 | 250px |
| 间距 | `flex-direction: column; gap: 1.2rem` |
| 内容 | CategorySidebar → PhotoCarousel → RandomQuote |
| 区块样式 | 毛玻璃卡片，hover 淡青色背景 |
| 隐藏 | ≤1100px |

**CategorySidebar：**
- 标题：黄色 + 红色 text-shadow，底部虚线分隔
- 分类项：圆角 12px，hover 右移 3px + 青色
- active：青色背景 + 边框 + 发光

**PhotoCarousel：**
- 比例 3:2，4 秒自动播放，hover 暂停
- 淡入淡出切换（600ms）
- 32px 圆形箭头 + 8px 圆点指示器

**RandomQuote：**
- 居中斜体，青色引号装饰

### 7.5 站点统计（SiteStats）

| 属性 | 值 |
|------|-----|
| 定位 | 内容底部，`max-width: 900px` 居中 |
| 卡片 | 毛玻璃，hover 青色发光 |
| 当前时间 | 青色，1.1rem，等宽数字，每秒刷新 |
| 运行天数 | 黄色数字（1.5rem）+ 红蓝 text-shadow |
| 始于 | 2026-05-21 |

### 7.6 Footer

| 属性 | 值 |
|------|-----|
| 上边框 | `4px solid var(--deco-pink)` |
| 宽度 | `max-width: 1100px` |
| 内容 | 版权 `var(--text-secondary)` + "Made with love"（粉色） |

---

## 八、页面规范

### 8.1 落地页（`/`）

独立页面，不使用 BaseLayout。

| 属性 | 值 |
|------|-----|
| 背景 | `landing-bg.mp4` 全屏视频，opacity 0.4 |
| 标题 | `一帧.life`，3.5rem，黄色 + 红蓝 text-shadow |
| 副标题 | `世界那么大，我先溜达溜达`，青色，1.2rem |
| 按钮 | 黄底黑字 → hover 红底白字 + scale(1.05) |
| 入场 | `fadeUp` 1.2s ease-out |

### 8.2 博客首页（`/blog`）

| 属性 | 值 |
|------|-----|
| 布局 | 三栏（左侧 + 中间 + 右侧） |
| 文章网格 | 2 列 CSS Grid，第一篇跨两列 |
| 章节标题 | 黄色 + 红色 text-shadow + 黄色虚线 |
| 拼贴效果 | 卡片旋转 -1.5°~1°，hover 归正 + scale(1.03) |
| 入场 | `fadeInUp` 0.5s，交错 0.3s~0.6s |
| 响应式 | ≤768px 单列，取消旋转 |

### 8.3 分类页（`/tech`、`/life`）

| 属性 | 技术页 | 生活页 |
|------|--------|--------|
| 标题色 | 蓝 `#0066FF` | 粉 `#FF69B4` |
| text-shadow | 黄 | 红 |
| 图标 | ★ `spin-star` | ♥ `pulse-heart` |
| 卡片排列 | 单列，旋转 -0.8°~0.8° | 单列，旋转 -0.5°~0.8° |
| 最大宽度 | 720px | 720px |

### 8.4 照片墙（`/photos`）

| 属性 | 值 |
|------|-----|
| 布局 | 无右侧边栏，`max-width: 960px` |
| 页头 | ✿ `float-flower`，粉色标题 + 黄色 text-shadow |
| 网格 | Masonry 瀑布流，6→5→4→3 列响应式 |
| 卡片 | `#1E293B` 背景，hover `translateY(-4px)` |
| 灯箱 | PhotoSwipe |

### 8.5 文章详情（`/posts/[slug]`）

| 属性 | 值 |
|------|-----|
| 容器 | `max-width: 720px` |
| 标题 | 居中，1.85rem，底部细线分隔 |
| 正文 | `.prose` 样式 |
| 底部 | 返回链接，hover 黄色 |

### 8.6 关于我（`/about`）

| 属性 | 值 |
|------|-----|
| 容器 | `max-width: 720px`，居中 |
| 顶部装饰 | ★♥✿♪♡☆，`twinkle` 闪烁 |
| 头像 | 120px 六边形，黄色 4px 边框 |
| 标题 | 1.8rem，黄色 + 红色 text-shadow |
| 印章 | 三枚旋转卡片（蓝/红/绿），3px 边框，旋转 -4°~3° |

### 8.7 标签页（`/tags`、`/tags/[tag]`）

| 属性 | 值 |
|------|-----|
| 容器 | `max-width: 720px` |
| 标签网格 | `auto-fill, minmax(130px, 1fr)` |
| 标签卡片 | `#1E293B` 背景，hover 上浮 + 黄色 |
| 筛选页 | 匹配文章列表 + 返回链接 |

---

## 九、Hero 背景区域

| 属性 | 值 |
|------|-----|
| 图片 | `/page-bg.png` |
| 高度 | 50vh |
| 显示 | `object-fit: cover`，`object-position: top center` |
| 下方 | body 和 content-wrapper 均为 `transparent` |
| 波浪 | fixed，80px 高，`fill: #0a0a0f` |
| JS | 动态跟随 hero 底部，hero 滚出后隐藏 |

---

## 十、响应式断点

| 断点 | 变化 |
|------|------|
| ≤1100px | 隐藏左右侧边栏，main 全宽 |
| ≤768px | 单列网格，取消旋转，html 15px |
| ≤480px | 导航精简（隐藏图标），照片墙 3 列 |

---

## 十一、动画

| 动画 | 时长 | 缓动 | 位置 |
|------|------|------|------|
| `spin-star` | 3-4s | linear ∞ | Header Logo、技术页 |
| `fadeInUp` | 0.5-0.6s | ease-out | Sidebar、博客卡片 |
| `fadeUp` | 1.2s | ease-out | 落地页 |
| `pulse-heart` | 1.5s | ease-in-out ∞ | 生活页 |
| `float-flower` | 3s | ease-in-out ∞ | 照片墙 |
| `twinkle` | 2s | ease-in-out ∞ | 关于页 |

**过渡规范：**
- 毛玻璃卡片：`background/border-color/box-shadow 0.25s ease` + `transform 0.15s ease`
- 链接/文字：`color 0.2s ease`
- 简单变换：`transform 0.2s ease`
- 轮播切换：`opacity 600ms ease`

---

## 十二、静态资源

| 资源 | 路径 | 用途 |
|------|------|------|
| 头像 | `public/avatar.jpg` | Sidebar、关于页 |
| Hero 图 | `public/page-bg.png` | 博客页面顶部 |
| 视频 | `public/landing-bg.mp4` | 落地页背景 |
| Favicon | `public/favicon.svg` | 浏览器标签页 |
| 照片数据 | `public/data/photos.json` | 照片墙 + 轮播 |
| 句子数据 | `public/data/quotes.json` | 随机句子 |

---

## 十三、依赖

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
