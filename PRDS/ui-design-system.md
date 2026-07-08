# 一帧.life — UI 设计系统

> 原宿 Decora 潮流风格的完整视觉规范
> 完整项目文档见 `./project-document.md`

---

## 一、设计主题

### 1.1 原宿 Decora 潮流

| 特征 | 说明 |
|------|------|
| **底色** | 深灰 `#5e5a51` |
| **撞色** | 高饱和黄/蓝/红 |
| **平面化** | 无阴影（`--shadow: none`） |
| **圆角** | 大部分为 0，卡片类 `border-radius: 20px` |
| **描边** | 3-4px 粗描边，不同组件不同颜色 |
| **装饰** | Kawaii 符号（★ ♥ ✿ ♪ ♡ ☆） |
| **毛玻璃** | `backdrop-filter: blur(8px)` |

---

## 二、配色系统

### 2.1 CSS 变量

```css
:root {
  /* 背景 */
  --bg-primary: #5e5a51;
  --bg-card: #1E293B;
  --bg-code: #2a2a2a;

  /* 文字 */
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --text-muted: #888888;

  /* 核心 Decora 色 */
  --deco-yellow: #FFE600;
  --deco-blue: #0066FF;
  --deco-red: #FF0033;
  --deco-pink: #FF69B4;
  --deco-green: #39FF14;
  --deco-cyan: #00FFFF;
  --deco-purple: #CC00FF;
  --deco-orange: #FF6600;

  /* 半透明版本 */
  --deco-yellow-20: rgba(255, 230, 0, 0.2);
  --deco-blue-20: rgba(0, 102, 255, 0.2);
  --deco-red-20: rgba(255, 0, 51, 0.2);
  --deco-pink-20: rgba(255, 105, 180, 0.2);
  --deco-green-20: rgba(57, 255, 20, 0.2);
  --deco-cyan-20: rgba(0, 255, 255, 0.2);

  /* 标签颜色 */
  --tag-blue: #0066FF;
  --tag-pink: #FF69B4;
  --tag-yellow: #FFE600;
  --tag-purple: #CC00FF;
  --tag-green: #39FF14;
  --tag-gray: #555555;
}
```

### 2.2 标签配色

| 标签 | 背景色 | 文字色 |
|------|--------|--------|
| 技术/生活/随笔 | `rgba(255,255,255,0.08)` | `var(--text-secondary)` |
| Astro | `rgba(255,255,255,0.08)` | `var(--text-secondary)` |
| 默认 | `rgba(255,255,255,0.08)` | `var(--text-secondary)` |

---

## 三、字体规范

| 场景 | 字体 | 来源 |
|------|------|------|
| 中文正文 | 霞鹜文楷（LXGW WenKai） | Google Fonts |
| 代码块 | JetBrains Mono / Fira Code / SF Mono | 系统字体栈 |

### 3.1 字号层级

| 元素 | 字号 | 字重 | 说明 |
|------|------|------|------|
| H1 | 1.75rem | 700 | 页面标题 |
| H2 | 1.4rem | 700 | 章节标题 |
| H3 | 1.2rem | 700 | 小节标题 |
| 正文 | 1rem | 400 | 默认正文 |
| 小字 | 0.85rem | 400 | 辅助信息 |
| 标签 | 0.75rem | 700 | 文章标签 |

---

## 四、Logo 设计

三层 text-shadow 叠加效果：

```css
.logo-text {
  color: #FFE600;                                    /* 主色：黄 */
  text-shadow: 1px 1px 0 #FF0033,                    /* 第一层：红 */
               2px 2px 0 #0066FF;                    /* 第二层：蓝 */
}
```

---

## 五、组件视觉规范

### 5.1 导航栏（Header）

| 属性 | 值 |
|------|-----|
| 位置 | `position: fixed` |
| 高度 | ~71px（0.6rem padding × 2 + 52px nav） |
| 背景 | 线性渐变 + `backdrop-filter: blur(16px)` |
| 链接样式 | 毛玻璃胶囊，默认半透明白色 |
| hover | 青色发光 `#00F0FF` |
| active | 青色背景 + 底部指示点 |

### 5.2 文章卡片（PostCard）

| 属性 | 值 |
|------|-----|
| 背景 | `rgba(255, 255, 255, 0.06)` |
| 圆角 | `border-radius: 20px` |
| 边框 | `1.5px solid rgba(255, 255, 255, 0.15)` |
| 毛玻璃 | `backdrop-filter: blur(8px)` |
| hover | 青色发光 + 上移 1px |

### 5.3 标签（Tag）

| 属性 | 值 |
|------|-----|
| 形状 | 粗描边胶囊 |
| 圆角 | `0`（平面化风格） |
| 字号 | 0.75rem |
| 字重 | 700 |

### 5.4 按钮

| 属性 | 值 |
|------|-----|
| 背景 | 高饱和撞色（黄/红/蓝） |
| 边框 | 粗边框或无边框 |
| 圆角 | 0（平面化） |
| hover | 颜色切换 + 缩放 |

### 5.5 头像

| 属性 | 值 |
|------|-----|
| 形状 | 六边形（`clip-path: polygon`） |
| 边框 | 黄色 `#FFE600` + 粉色描边 `#FF69B4` |
| 尺寸 | 90px × 90px（sidebar）/ 120px × 120px（about） |

---

## 六、响应式断点

| 断点 | 行为 |
|------|------|
| `> 1100px` | 完整布局（sidebar + main） |
| `≤ 1100px` | 隐藏 sidebar，main 全宽 |
| `≤ 768px` | 移动端布局，单列 |
| `≤ 480px` | 小屏优化，导航栏精简 |

---

## 七、动画规范

### 7.1 已有动画

| 动画 | 实现 | 位置 |
|------|------|------|
| 星星旋转 | CSS `@keyframes spin-star` | Header Logo |
| 卡片入场 | CSS `@keyframes fadeInUp` | Sidebar |
| 拼贴旋转 | CSS `transform: rotate()` | 博客首页卡片 |
| 心跳脉冲 | CSS `@keyframes pulse-heart` | 生活分类页 |
| 花朵浮动 | CSS `@keyframes float-flower` | 照片墙 |

### 7.2 动画原则

- 优先使用 CSS 动画（`transform`、`opacity`）
- 避免动画化 `width`、`height`、`top`、`left`
- 使用 `{ passive: true }` 优化滚动监听

---

## 八、设计资产

### 8.1 静态资源

| 资源 | 路径 | 用途 |
|------|------|------|
| 头像 | `public/avatar.jpg` | Sidebar、关于我 |
| Hero 背景 | `public/page-bg.png` | 博客页面顶部背景 |
| 视频背景 | `public/landing-bg.mp4` | 欢迎页背景 |
| 网站图标 | `public/favicon.svg` | 浏览器标签页 |

---

*完整项目文档见 `./project-document.md`*
*开发指南见 `./development-guide.md`*
