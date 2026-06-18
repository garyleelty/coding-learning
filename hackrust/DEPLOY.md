# HackRust - 部署指南

## GitHub Pages（推荐）

项目通过 GitHub Actions 自动部署。推送到 `main` 分支会触发 `.github/workflows/deploy.yml`。

```bash
# 手动构建
cd hackrust/frontend
npm run build
# 输出在 dist/
```

## 其他静态托管

- **Vercel**: `vercel deploy`
- **Netlify**: 拖拽 `dist` 文件夹

## 注意事项

- 纯前端 SPA，无后端
- WASM 模块已预构建在 `wasm/code-validator/pkg/`，无需额外构建步骤
