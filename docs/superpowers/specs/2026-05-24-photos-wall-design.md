# 照片墙页面设计文档

## 概述

为「一帧.life」博客新增照片墙页面，用于展示个人生活照片。采用瀑布流布局 + 灯箱查看的交互方式，提供优秀的视觉和浏览体验。

## 需求背景

- **主要目的**：个人生活记录展示
- **核心要求**：视觉效果好，交互体验流畅
- **技术偏好**：效果优先，选择功能最强大的方案

## 技术方案

### 技术栈选择

- **瀑布流布局**：Masonry.js
  - 最成熟的瀑布流库，布局算法优秀
  - 支持响应式，自动适应不同屏幕尺寸
  - 支持动态加载和重新布局

- **灯箱功能**：PhotoSwipe
  - 功能最强大的灯箱库
  - 支持触摸手势、滑动切换
  - 性能优秀，支持大图加载
  - 响应式设计，移动端体验好

### 依赖说明

```json
{
  "dependencies": {
    "masonry-layout": "^4.2.2",
    "photoswipe": "^5.4.3"
  }
}
```

## 架构设计

### 目录结构

```
public/
├── images/
│   └── photos/
│       ├── 2024/
│       │   ├── 01/
│       │   │   ├── photo1.jpg
│       │   │   └── photo2.jpg
│       │   └── 02/
│       └── 2025/
└── data/
    └── photos.json          # 照片元数据

src/
├── pages/
│   └── photos/
│       └── index.astro      # 照片墙页面
├── components/
│   ├── PhotoGrid.astro      # 瀑布流网格组件
│   └── PhotoCard.astro      # 单个照片卡片组件
└── styles/
    └── photos.css           # 照片墙专用样式
```

### 数据管理

照片元数据存储在 `public/data/photos.json`：

```json
{
  "photos": [
    {
      "id": "photo-001",
      "filename": "sunset.jpg",
      "path": "/images/photos/2024/01/sunset.jpg",
      "title": "日落时分",
      "description": "在海边看到的美丽日落",
      "date": "2024-01-15",
      "width": 800,
      "height": 600,
      "tags": ["风景", "日落"]
    }
  ]
}
```

**字段说明**：
- `id`：唯一标识符
- `filename`：原始文件名
- `path`：相对于 public 目录的路径
- `title`：照片标题（可选）
- `description`：照片描述（可选）
- `date`：拍摄日期
- `width` / `height`：图片尺寸（用于瀑布流布局计算）
- `tags`：标签数组（可选，用于未来扩展）

## 页面设计

### 瀑布流布局

#### 响应式列数

| 屏幕尺寸 | 列数 | 间距 |
|---------|------|------|
| > 1200px | 3 列 | 16px |
| 768px - 1200px | 2 列 | 16px |
| < 768px | 1 列 | 12px |

#### 卡片样式

```css
.photo-card {
  border-radius: var(--radius);      /* 10px 圆角 */
  box-shadow: var(--shadow);         /* 柔和阴影 */
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.photo-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);   /* hover 时阴影加深 */
}
```

#### 图片处理

- **懒加载**：使用 `loading="lazy"` 属性
- **尺寸保持**：通过 width/height 属性保持原图比例
- **占位符**：加载前显示浅灰色背景

### 灯箱功能

#### PhotoSwipe 配置

```javascript
import PhotoSwipe from 'photoswipe';
import 'photoswipe/style.css';

const lightbox = new PhotoSwipe({
  showHideAnimationType: 'zoom',
  bgOpacity: 0.9,
  padding: { top: 20, bottom: 20, left: 20, right: 20 },
  // ... 其他配置
});
```

#### 交互细节

1. **打开动画**：从小图位置放大到全屏
2. **导航**：左右箭头按钮 + 触摸滑动
3. **信息展示**：底部显示标题、描述、日期
4. **关闭方式**：
   - 点击遮罩层
   - 按 ESC 键
   - 点击关闭按钮
5. **键盘支持**：左右方向键切换，ESC 关闭

## 导航集成

### Header 修改

在 `src/components/Header.astro` 的导航栏中添加照片墙链接：

```html
<ul class="nav-links">
  <li><a href="/" class:list={["nav-link", { active: currentPath === "/" }]}>首页</a></li>
  <li><a href="/tech" class:list={["nav-link", { active: currentPath.startsWith("/tech") }]}>技术</a></li>
  <li><a href="/life" class:list={["nav-link", { active: currentPath.startsWith("/life") }]}>生活</a></li>
  <li><a href="/photos" class:list={["nav-link", { active: currentPath.startsWith("/photos") }]}>照片墙</a></li>
  <li><a href="/about" class:list={["nav-link", { active: currentPath === "/about" }]}>关于我</a></li>
</ul>
```

### 路由设计

- **URL**：`/photos`
- **页面标题**：照片墙
- **面包屑**：首页 > 照片墙

## 样式设计

### 全局变量复用

使用 `global.css` 中已有的 CSS 变量：

- `--bg-primary`：页面背景
- `--bg-card`：卡片背景
- `--shadow` / `--shadow-hover`：阴影效果
- `--radius`：圆角大小
- `--text-primary` / `--text-secondary`：文字颜色

### 页面布局

```css
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
```

## 性能优化

### 图片优化

1. **压缩**：建议使用 WebP 格式，保持质量的同时减小文件大小
2. **尺寸**：提供缩略图用于列表展示，原图用于灯箱查看
3. **懒加载**：首屏外的图片延迟加载

### 加载策略

1. **首屏优先**：优先加载首屏可见的图片
2. **预加载**：灯箱打开时预加载相邻图片
3. **缓存**：合理设置 HTTP 缓存头

## 未来扩展

### 可选功能（暂不实现）

1. **分类筛选**：按标签或时间筛选照片
2. **无限滚动**：滚动到底部自动加载更多
3. **照片上传**：后台管理界面上传照片
4. **社交分享**：分享单张照片到社交媒体

### 扩展性考虑

- 数据结构支持标签字段，便于未来添加筛选功能
- 组件设计支持分页加载，便于未来实现无限滚动
- 灯箱配置支持自定义，便于未来添加分享功能

## 验收标准

### 功能验收

- [ ] 照片墙页面可正常访问（/photos）
- [ ] 瀑布流布局正确显示，响应式工作正常
- [ ] 点击照片可打开灯箱查看大图
- [ ] 灯箱支持左右滑动切换照片
- [ ] 灯箱可正常关闭（ESC、点击遮罩）
- [ ] 导航栏正确显示照片墙链接
- [ ] 移动端体验良好

### 性能验收

- [ ] 首屏加载时间 < 3 秒
- [ ] 图片懒加载正常工作
- [ ] 灯箱切换流畅，无卡顿

### 兼容性验收

- [ ] Chrome、Firefox、Safari 最新版本
- [ ] iOS Safari、Android Chrome
- [ ] 响应式布局在不同尺寸下正常显示
