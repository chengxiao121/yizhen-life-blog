---
name: handcraft-journal-style
description: 手帐拼贴风格设计系统 - 温暖活泼的个人博客首页设计
metadata:
  type: feedback
---

用户喜欢手帐/日记本拼贴风格的博客设计，要求温暖活泼、有记忆点。

**Why:** 用户希望博客像精心编排的手帐拼贴，而不是传统的文章列表。这种风格更个性化、更有温度。

**How to apply:**
1. 配色：使用奶油米白底色 + 珊瑚粉(#ff8c7c)、明黄(#ffd166)、薄荷绿(#a8e6cf)等暖色点缀
2. 布局：自由拼贴风格，卡片轻微旋转错落排列
3. 装饰：胶带效果、虚线边框、手绘风格贴纸标签
4. 交互：悬浮时卡片上浮并回正，入场时有 fadeInUp 动画
5. 字体：继续使用霞鹜文楷，保持温暖文艺感

关键 CSS 变量已添加到 global.css:
- --cream, --coral, --sunny, --mint, --lavender 等暖色调
- --shadow-sticker, --shadow-sticker-hover 贴纸阴影

参考实现: D:\AI\my-blog\src\pages\blog\index.astro (2026-05-27 重写)
