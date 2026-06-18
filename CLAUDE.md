# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HackRust is a gamified Rust learning website with a cyberpunk RPG theme. Users learn Rust by completing quiz levels and boss coding challenges. It's a pure frontend SPA deployed to GitHub Pages — no backend.

## Repository Structure

```
hackrust/frontend/       # Vite + React + TypeScript SPA
wasm/code-validator/     # Rust crate compiled to WASM — parses and interprets user Rust code
docs/superpowers/        # Design specs and implementation plans
```

## Build & Dev Commands

### Frontend (hackrust/frontend/)

```bash
npm run dev          # Start dev server
npm run build        # TypeScript check + Vite build (outputs to dist/)
npm run lint         # ESLint
npm run test         # Run tests once (vitest run)
npm run test:watch   # Watch mode
```

### WASM code-validator (wasm/code-validator/)

```bash
cargo check                  # Type-check without building
cargo test                   # Run Rust unit tests
wasm-pack build --target web --release   # Build WASM (outputs to pkg/)
```

The WASM pkg/ output is imported by the frontend via `wasmLoader.ts`. Rebuild the WASM after any Rust changes before frontend testing.

## Architecture

### Compilation Pipeline (api.ts)

Boss battles validate user Rust code via a two-tier fallback:

1. **Rust Playground API** (online) — sends code to `play.rust-lang.org/execute`, gets real rustc output
2. **WASM interpreter** (offline fallback) — `wasm/code-validator/` parses with `syn`, runs semantic analysis for warnings, interprets to produce stdout

The `compileRust()` function in `api.ts` tries Playground first, falls back to WASM on network failure. `wasmLoader.ts` lazy-loads the WASM module.

### WASM code-validator Architecture

The Rust crate follows a 3-phase pipeline: **parse → analyze → execute**.

- `lib.rs` — WASM entry point, exports `run_code(code) -> InterpResult`
- `parse.rs` — converts `syn::File` AST into custom IR (`ast.rs` types)
- `analysis.rs` — semantic analysis producing warnings (unused vars, dead code, etc.)
- `eval.rs` — expression/statement evaluator with scope chains
- `value.rs` — runtime `Value` enum (Int, Float, String, Vec, HashMap, Struct, EnumVariant, etc.)
- `scope.rs` — variable frames with shadowing support
- `stdlib.rs` — builtin macros (println!, format!, assert_eq!, vec!) and format string handling

The interpreter covers Rust features needed for worlds w00-w18: functions, structs, enums, traits, impl blocks, generics, closures, iterators, match, Option/Result, HashMap, Vec, and the `?` operator. It does **not** implement real borrow checking or lifetime analysis.

### Frontend Architecture

- **Routing:** `HashRouter` (for GitHub Pages SPA compatibility) with routes: `/`, `/worlds`, `/worlds/:id`, `/worlds/:id/level/:n`, `/worlds/:id/boss`
- **State:** Zustand store (`gameStore.ts`) with `persist` middleware → localStorage. Tracks player XP/level/HP/combo/streak and per-world/level completion progress.
- **Game data:** World definitions in `data/worlds.ts` — level types are `choice`, `fill`, `order`, `judge`. Boss challenges include code templates and validation rules.
- **Components:** `HPBar`, `XPBar`, `ComboIndicator`, `Feedback`, `CodeBlock`, `TerminalText`, `Layout`

### Game Mechanics

- **Small levels:** Multiple choice, fill-in-the-blank, code ordering, true/false
- **Boss battles:** User writes real Rust code in an editor. Code is compiled+executed; correct output damages the Boss. Wrong submissions cost HP. 10 HP lost per mistake, Boss HP varies by world.
- **XP formula:** `level = floor(sqrt(xp / 100)) + 1`
- **Combo multipliers:** 3+ correct = 1.2x, 5+ = 1.5x, 10+ = 2x XP

## Key Constraints

- The WASM binary should stay under 5MB (`opt-level = "s"`, LTO enabled)
- Frontend uses `HashRouter` for GitHub Pages SPA routing
- The `#base` in vite.config.ts is conditional on `GITHUB_PAGES` env var
- All Rust code in the WASM crate uses `#![forbid(unsafe_code)]`
- CI deploys via `.github/workflows/deploy.yml` — builds frontend only (WASM pkg/ is committed)

## Course Content

24 worlds across 7 phases covering: variables → control flow → collections → ownership → structs/enums → generics/traits/lifetimes → error handling → modules/testing → iterators/closures → smart pointers → concurrency → async → unsafe → capstone project.
