---
title: "用 Hugo 搭建个人博客：我踩过的那些坑"
date: 2026-05-10T14:30:00+08:00
lastmod: 2026-05-10T14:30:00+08:00
draft: false
description: "从零搭建 Hugo 博客的完整记录，含主题配置、GitHub Pages 部署和常见问题解决。"
tags: ["Hugo", "博客搭建", "技术"]
categories: ["技术"]
showToc: true
TocOpen: true
---

## 为什么选 Hugo

搭博客这件事，我前后折腾了好几次。

用过 WordPress，太重了，一个博客系统需要数据库、PHP、各种插件，维护成本高。  
试过 Hexo，不错，但 Node.js 依赖太多，每次换电脑都要重新配一遍。  
最后用了 Hugo——一个用 Go 写的静态网站生成器。

为什么喜欢 Hugo：

- **快**：生成几百篇文章只需要几秒
- **简单**：一个二进制文件，没有依赖
- **免费部署**：静态文件，GitHub Pages 直接托管

---

## 安装

Windows 用户推荐用 winget：

```powershell
winget install Hugo.Hugo.Extended
```

> ⚠️ 注意安装 **Extended** 版本，很多主题需要 SCSS 支持。

安装后验证：

```bash
hugo version
```

---

## 主题选择：PaperMod

我用的是 [PaperMod](https://github.com/adityatelange/hugo-PaperMod)，原因简单粗暴：

- 颜值高，简洁不花哨
- 功能齐全：暗色模式、目录、阅读时间、代码高亮
- 中文支持好
- Star 数多，维护活跃

---

## 坑1：主题目录名称问题

`hugo.toml` 里的 `theme` 字段必须和 `themes/` 目录下的**文件夹名字完全一致**。

```toml
theme = "PaperMod"  # themes/ 下必须有名为 PaperMod 的文件夹
```

如果你是下载 zip 解压的，文件夹可能叫 `hugo-PaperMod-master`，记得改名：

```bash
mv themes/hugo-PaperMod-master themes/PaperMod
```

---

## 坑2：content 目录必须有内容

Hugo 不会帮你生成空页面。如果 `content/posts/` 是空的，列表页就是空的。

至少建一篇文章：

```bash
hugo new posts/my-first-post.md
```

---

## 本地预览

```bash
hugo server -D
```

`-D` 表示包含草稿（draft: true）。打开 http://localhost:1313 就能看到效果。

---

## 部署到 GitHub Pages

1. 新建一个仓库，名字格式：`你的用户名.github.io`
2. 在仓库 Settings → Pages，选择 GitHub Actions
3. 项目根目录新建 `.github/workflows/hugo.yml`，内容参考 Hugo 官方文档

之后每次 `git push`，GitHub Actions 自动构建并发布。

---

## 小结

Hugo + PaperMod + GitHub Pages = 免费、快速、好看的个人博客。

搭建过程可能会遇到各种小问题，但基本都是配置问题，搜一下都能解决。

最难的其实是：**坚持写**。
