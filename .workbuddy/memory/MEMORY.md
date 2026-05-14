# MEMORY.md — 长期记忆

## 项目：个人博客

- **框架**：Hugo v0.161.1 extended
- **主题**：Kopi（位于 `themes/kopi/`）— 暗色模式、2栏布局、Turbo.js
- **配置文件**：`hugo.yaml`（Kopi 使用 YAML 格式，不是 TOML）
- **项目路径**：`D:\Bolg\taiyang`
- **部署目标**：GitHub Pages（tai-yng.github.io）
- **GitHub 用户名**：Tai-Yng
- **网站风格**：综合博客（生活/技术/思考），现代暗色风格
- **语言**：中文（zh-cn）

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
