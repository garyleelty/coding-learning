# HackRust

> 用打怪升级的方式学 Rust。

[![Deploy to GitHub Pages](https://github.com/garyleelty/coding-learning/actions/workflows/deploy.yml/badge.svg)](https://github.com/garyleelty/coding-learning/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen.svg)](https://garyleelty.github.io/coding-learning/)

赛博朋克 RPG 风格的交互式 Rust 学习站：**24 个世界 · 7 个阶段 · 121 个关卡**。纯前端 SPA，无后端，通过 GitHub Actions 自动部署到 GitHub Pages。

**在线体验 → https://garyleelty.github.io/coding-learning/**

## 玩法

- **小关卡**：单选、填空、代码排序、判断正误
- **Boss 战**：每个世界一场，在浏览器编辑器里写**真实的 Rust 代码**，编译并执行，输出正确才能对 Boss 造成伤害；答错扣 10 HP
- **成长系统**：XP / 等级 / HP / 连击 / 连续答对，进度持久化到 `localStorage`
  - 等级公式 `level = floor(sqrt(xp / 100)) + 1`
  - 连击 3 / 5 / 10 次分别获得 1.2× / 1.5× / 2× XP

## 课程覆盖

24 个世界分 7 个阶段，从 `变量 → 控制流 → 集合 → 所有权 → 结构体与枚举 → 泛型 / trait / 生命周期 → 错误处理 → 模块与测试 → 迭代器与闭包 → 智能指针 → 并发 → async → unsafe` 一路到综合项目。每个 code 关卡都配有一份能被 `rustc` 真正编译、输出也对得上的参考实现。

## 技术栈

| 层 | 选型 |
| --- | --- |
| 前端 | React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Zustand · React Router (HashRouter) |
| 代码执行 | Rust Playground API（真实 rustc）→ 断网回退本地 WASM 解释器 |
| WASM 解释器 | Rust crate：`syn` / `quote` / `proc-macro2` / `wasm-bindgen`，`parse → analyze → execute` 三阶段 |
| 测试 | Vitest + Testing Library · `cargo test` · `wasm-bindgen-test` |
| 部署 | GitHub Actions → GitHub Pages |

### 双层编译回退

`compileRust()` 先请求 `play.rust-lang.org/execute` 获取真实 rustc 输出；网络不可用时回退到 `wasm/code-validator/`——用 `syn` 把源码解析成自定义 IR，做语义分析（未使用变量、死代码等 warnings），再解释执行产出 stdout。

解释器覆盖课程所需的 Rust 子集：函数、结构体、枚举、trait、impl、泛型、闭包、迭代器、match、Option/Result、HashMap、Vec、`?` 运算符。**不实现真正的借用检查与生命周期分析**——这部分以在线 rustc 为准。

## 目录结构

```
hackrust/frontend/       Vite + React + TS SPA（游戏主体、课件数据、状态管理）
wasm/code-validator/     Rust→WASM 代码解释器，pkg/ 已预构建并提交
scripts/                 CI 课件校验脚本
.github/workflows/       GitHub Pages 自动部署
docs/superpowers/        设计文档与实施计划
CLAUDE.md                AI 协作时的项目指引
```

## 本地开发

```bash
cd hackrust/frontend
npm ci
npm run dev          # 启动开发服务器
npm run test         # Vitest 单测
npm run build        # tsc 类型检查 + Vite 构建，产物在 dist/
```

改动 Rust 解释器后需重建 WASM（前端通过 `wasmLoader.ts` 懒加载 `pkg/`）：

```bash
cd wasm/code-validator
cargo test
wasm-pack build --target web --release
```

## CI / 部署

推送到 `main` 触发 `.github/workflows/deploy.yml`：安装依赖 → 前端单测 → `scripts/verify_solutions.py` 校验每个 code 关卡都有可运行的参考实现 → 构建 → 部署 GitHub Pages。也可在 Actions 页面手动 `workflow_dispatch`。

## 设计约束

- WASM 产物保持在 5MB 以内（`opt-level = "s"` + LTO）
- 使用 `HashRouter` 以兼容 GitHub Pages 的 SPA 路由
- WASM crate 全量 `#![forbid(unsafe_code)]`
- 纯静态，无服务端、无数据库

## License

[MIT](LICENSE) © 2026 Gary Lee
