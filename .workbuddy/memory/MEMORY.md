# MEMORY.md — 长期记忆

## 项目：个人博客

- **框架**：Hugo v0.161.1 extended
- **主题**：Kopi（位于 `themes/kopi/`）— 暗色模式、2栏布局、Turbo.js
- **配置文件**：`hugo.yaml`（Kopi 使用 YAML 格式，不是 TOML）
- **项目路径**：`D:\Bolg\taiyang`
- **部署目标**：GitHub Pages（tai-yng.github.io）
- **GitHub 用户名**：Tai-Yng
- **网站风格**：综合博客（生活/技术/思考），哲学文艺气质 + 极简高级感
- **语言**：中文（zh-cn）

## 首页设计特点

- **Hero 区域**：全屏 NASA 地球背景图 + 张岱《湖心亭看雪》诗句
- **文章列表**：时间线布局，左侧日期节点 + 右侧卡片，悬停上浮效果
- **侧边栏**：个人资料组件（抽象头像「太」字 + 简介 + 社交链接）
- **配色**：黑白灰为主，深蓝星空 Hero 背景
- **字体**：标题用衬线体（宋体/思源宋体），正文用无衬线体

## 上传文章流程

```bash
cd D:/Bolg/taiyang
hugo new posts/文章标题.md   # 创建文章
hugo server -D               # 本地预览
git add -A && git commit -m "update" && git push origin main  # 推送到 GitHub
```

## 注意事项

- 配置文件用 `hugo.yaml`（YAML 格式），不是 TOML
- GitHub Pages URL 大小写敏感，必须用 `tai-yng`（小写）
- 如果网络连接 GitHub 失败，需要配置代理：
  ```bash
  git config --global http.proxy http://127.0.0.1:7890
  ```
- 上传指南文档：`D:\Bolg\taiyang\文章上传指南.md`

## 阅读成就系统
- 侧边栏成就小部件，locationStorage 存储
- 15 个成就：阅读数量、标签浏览、时段（夜读/晨读/深夜）、连续访问天数
- 解锁时弹出 Toast 通知
- JS: `themes/kopi/assets/js/modules/achievements.js`
- 样式: `_widgets.scss` / `_components.scss`

## 搜索功能修复 (2026-05-15)
- **问题**：搜索框无法工作
- **原因**：Hugo 在主题的 `layouts/page/` 子目录中无法正确识别特定布局的模板
- **解决方案**：将 `themes/kopi/layouts/page/search.html` 复制到 `layouts/_default/search.html`
- 搜索功能使用 Web Worker + index.json 索引，支持实时搜索和模糊匹配
