# HackRust - GitHub Pages 部署指南

## 快速部署（纯前端）

```bash
# 1. 构建前端
cd hackrust/frontend
npm run build

# 2. 部署到 GitHub Pages
# 在 GitHub 仓库设置中，Source 选择 "GitHub Actions"
# 或者用 gh-pages 分支：
npm install -g gh-pages
gh-pages -d dist
```

## 完整部署（带后端）

### 前端部署
- Vercel: `vercel deploy`
- Netlify: 拖拽 `dist` 文件夹

### 后端部署
- Railway: `railway deploy`
- Fly.io: `fly deploy`
- Docker: 见 Dockerfile
