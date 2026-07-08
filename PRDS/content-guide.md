# 一帧.life — 内容创作指南

> 面向内容作者的写作规范与流程
> 完整项目文档见 `./project-document.md`

---

## 一、新建文章流程

### 1.1 创建文件

在 `src/content/posts/` 目录下新建 `.md` 文件：

```
src/content/posts/
├── my-first-post.md      ← 新建这个文件
├── another-post.md
└── ...
```

**文件名规则**：
- 使用 **kebab-case**（短横线连接）
- 文件名即 URL slug：`my-first-post.md` → `/posts/my-first-post`
- **不要在 frontmatter 中加 `slug` 字段**（Astro 5 会自动从文件名生成，加了会报错）

### 1.2 编写 Frontmatter

```yaml
---
title: "文章标题"
date: "2026-05-23"        # ← 必须加引号！
tags: ["标签1", "标签2"]
category: "技术"           # ← 必须是 "技术" 或 "生活"
description: "文章摘要，显示在卡片上"
draft: false               # true 则隐藏不出现在列表中
---
```

### 1.3 字段说明

| 字段 | 必填 | 说明 | 注意事项 |
|------|------|------|---------|
| `title` | ✅ | 文章标题 | 显示在页面标题和卡片上 |
| `date` | ✅ | 发布日期 | **必须加引号**，否则 YAML 解析为日期对象导致 schema 校验失败 |
| `tags` | ✅ | 标签数组 | 自由定义，用于分类和筛选 |
| `category` | ✅ | 分类 | **必须是 "技术" 或 "生活"** |
| `description` | ✅ | 文章摘要 | 显示在文章卡片上 |
| `draft` | ❌ | 草稿标记 | 默认 `false`，`true` 时文章不显示在列表中 |

---

## 二、文章正文

Frontmatter 下方直接写 Markdown 正文：

```markdown
---
title: "示例文章"
date: "2026-05-23"
tags: ["Astro", "教程"]
category: "技术"
description: "这是一篇示例文章"
draft: false
---

## 小标题

正文内容支持标准 Markdown 语法：

- **粗体**
- *斜体*
- `代码`
- [链接](https://example.com)

### 代码块

```javascript
const greeting = "Hello, World!"
console.log(greeting)
```

### 图片

![图片描述](/images/my-image.jpg)
```

---

## 三、写作工具

### 3.1 推荐编辑器

- **Obsidian**：Markdown 原生支持，实时预览
- **VS Code**：配合 Markdown 插件
- **任意文本编辑器**：纯文本即可

### 3.2 Obsidian 配置

`.obsidian/` 目录已加入 `.gitignore`，可以放心使用 Obsidian 的个性化配置而不会影响仓库。

---

## 四、发布前检查清单

- [ ] 文件名使用 kebab-case
- [ ] `date` 字段加了引号
- [ ] `category` 是 "技术" 或 "生活"
- [ ] `description` 已填写
- [ ] 文章内容已检查
- [ ] `draft: false`（如果要发布）

---

## 五、添加照片

### 5.1 照片管理流程

目前照片通过 `public/data/photos.json` 手动管理：

1. 将照片放入 `public/images/photos/` 目录
2. 在 `public/data/photos.json` 中添加记录：

```json
{
  "photos": [
    {
      "id": "photo-001",
      "filename": "my-photo.jpg",
      "path": "/images/photos/my-photo.jpg",
      "title": "照片标题",
      "description": "照片描述",
      "date": "2026-05-24",
      "width": 1706,
      "height": 1279,
      "tags": []
    }
  ]
}
```

### 5.2 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `id` | ✅ | 唯一标识 |
| `filename` | ✅ | 文件名 |
| `path` | ✅ | 图片路径（相对于 public） |
| `title` | ❌ | 照片标题 |
| `description` | ❌ | 照片描述 |
| `date` | ✅ | 拍摄日期 |
| `width` | ✅ | 图片宽度（像素） |
| `height` | ✅ | 图片高度（像素） |
| `tags` | ❌ | 照片标签 |

---

## 六、常用命令

```bash
# 本地预览（写文章时）
npm run dev

# 构建检查
npm run build
```

---

## 附录：相关文档

| 文档 | 路径 |
|------|------|
| 项目总览 | `./project-document.md` |
| UI 设计系统 | `./ui-design-system.md` |
| 开发指南 | `./development-guide.md` |
