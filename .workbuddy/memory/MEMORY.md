# MEMORY.md — 长期记忆

## 项目：个人博客

- **框架**：Hugo v0.161.1 extended
- **主题**：PaperMod（位于 `themes/PaperMod/`）
- **项目路径**：`D:\Bolg\taiyang`
- **部署目标**：GitHub Pages（Tai-Yng.github.io）
- **GitHub 用户名**：Tai-Yng
- **网站风格**：综合博客（生活/技术/思考），温暖有趣风格
- **语言**：中文（zh-cn）

## Hugo 常用命令

```bash
# 本地预览（含草稿）
hugo server -D

# 构建生产版本
hugo --minify

# 新建文章
hugo new posts/文章名.md
```

## 注意事项

- 主题目录名必须与 hugo.toml 中 `theme = "PaperMod"` 完全一致
- 需要 JSON 输出才能使用站内搜索（已在 outputs.home 中配置）
- 部署到 GitHub Pages 需要仓库名为 `taiyang.github.io`
