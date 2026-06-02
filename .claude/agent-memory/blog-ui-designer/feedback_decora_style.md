---
name: decora-style-redesign
description: 2026-05-27 全站改为原宿 Decora 潮流风格 - 黑底高饱和撞色、贴纸式导航、拼贴卡片、Kawaii 装饰
metadata:
  type: project
---

全站视觉风格从温暖文艺手帐风改为原宿 Decora 潮流风格。

**Why:** 用户要求全新的视觉方向 - 原宿 Decora 风格更年轻、更有活力、更 maximalist。

**How to apply:**
- 黑色底色 #000000，高饱和撞色黄 #FFE600 / 蓝 #0066FF / 红 #FF0033
- 所有边框用 3-4px solid 粗描边，无圆角 border-radius: 0
- 无阴影 flat design（box-shadow: none）
- 导航栏是贴纸式（粗描边彩色按钮，无背景模糊）
- 文章卡片拼贴式（不同颜色边框，轻微旋转角度）
- 大量 Kawaii 符号装饰：★ ♥ ✿ ♪ ♡ ○ △
- CSS 实现满版涂鸦背景（radial-gradient 点状图案）
- 文字用白色或高对比度亮色
- 动画：星星旋转、爱心脉动、元素浮动
- 分类页标题用 text-shadow 做彩色描边效果

已修改文件：
- src/styles/global.css - 全新 Decora 配色变量和基础样式
- src/components/Header.astro - 贴纸式导航栏
- src/components/Footer.astro - 匹配风格的页脚
- src/components/PostCard.astro - 拼贴式卡片
- src/components/TagList.astro - 粗描边标签
- src/layouts/BaseLayout.astro - 涂鸦背景层
- src/pages/blog/index.astro - 角落吉祥物、浮动装饰
- src/pages/tech/index.astro - 技术分类页
- src/pages/life/index.astro - 生活分类页
- src/pages/photos/index.astro - 照片墙页
- src/pages/about.astro - 关于页
- src/pages/index.astro - 着陆页 Decora 风格
