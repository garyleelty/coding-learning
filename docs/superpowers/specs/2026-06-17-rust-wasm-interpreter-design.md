# Rust WASM Interpreter — HackRust Local Compilation

## 目标

在浏览器内通过 WASM 实现 Rust 代码的**语义分析**（输出 rustc 级别 warnings）+ **解释执行**（输出 stdout），使 HackRust Boss 战完全离线可用。

## 编译路径设计

```
compileRust(code, expectedOutput)
  ├─ Playground API (在线) → 编译+执行，返回真实 rustc 结果
  └─ WASM 解释器 (离线)   → 语义分析 + 解释执行
```

- **Playground API** 作为主要路径（在线时走它，获取完整 rustc 输出）
- **WASM 解释器** 作为离线降级（网络不可用时自动切换）
- **backend/** 目录完全删除

## 支持的特性范围

覆盖 w00-w18 所有关卡涉及的特性：

### 语法 (syn 解析)

- fn main() 入口，自定义函数定义和调用
- let / let mut 变量声明，赋值
- println!() / print!() 宏（字符串字面量 + {} 占位符）
- if / else / else if 条件表达式
- loop / while / for..in 循环，break / continue
- match 表达式（基础模式：字面量、通配符 _）
- struct / enum 定义和构造
- impl 块和方法定义
- 泛型 struct / impl / fn（单类型参数 <T>）
- trait 定义和 impl Trait for
- use / mod / pub 模块系统
- #[derive(Debug)] / #[cfg(test)] / #[test]
- 闭包 |x| x + 1 简写

### 类型系统

- i32, f64, bool, String, &str, char
- Vec<T>, HashMap<K, V>
- Option<T>, Result<T, E>
- 引用 &T, &mut T
- 元组 (T, U)，数组 [T; N]
- 泛型参数 T 和 trait 约束 T: Trait
- 生命周期标注 'a（仅在签名中传递，不做完整 lifetime 检查）

### 运算符

- 算术: + - * / %
- 比较: == != < > <= >=
- 逻辑: && || !
- 复合赋值: += -= *= /=
- 类型转换 as
- 方法调用 . 和关联函数 ::

### 支持的标准库函数

- `println!(...)` / `print!(...)`
- `format!(...)`
- `String::from(...)`, `.clone()`, `.push_str(...)`, `.len()`
- `Vec::new()`, `.push()`, `.pop()`, `.len()`
- `HashMap::new()`, `.insert(...)`, `map[key]`
- `.iter()`, `.filter(...)`, `.map(...)`, `.sum()`
- `Option::unwrap()`, `Result::?` 运算符（仅解析，不运行时检查）
- `std::f64::consts::PI`
- `assert_eq!`

### 明确不支持（不涉及游戏课程）

- 多线程 / 并发
- unsafe Rust
- 文件 IO / 网络
- 自定义宏
- 复杂生命周期（多个标注交织）
- 原生指针
- 第三方 crate（仅支持上述标准库子集）

## 语义分析 — Warnings 规则

| Warning | 触发条件 |
|---------|---------|
| unused variable | `let x = ...` 后未在任何后续代码中使用 |
| unused function | 函数定义后未被调用 |
| unused struct/enum | struct/enum 定义后未被使用 |
| dead code | `return` / `break` 后的语句 |
| unused assignment | `x = ...` 后未读取就被覆盖 |
| variable shadows | `let x = ...; let x = ...` |

以上 warning 信息格式尽量贴近 rustc 输出（`warning: unused variable: x`）。

## WASM 模块接口

```rust
// wasm/code-validator/src/lib.rs

#[wasm_bindgen]
pub struct InterpResult {
    success: bool,
    output: Option<String>,
    warnings: Vec<String>,
    errors: Vec<String>,
}

#[wasm_bindgen]
pub fn run_code(code: &str) -> InterpResult;
```

所有验证+执行逻辑封装在一个函数里，输入 Rust 代码，输出执行结果或错误/警告。

## 前端集成

### 文件变更

| 文件 | 操作 |
|------|------|
| `wasm/code-validator/` | 新建 Rust crate |
| `frontend/src/lib/api.ts` | 重写 compileRust：Playground → WASM |
| `frontend/src/lib/wasmLoader.ts` | 新建：懒加载 WASM 模块 |
| `frontend/src/game/codeValidator.ts` | 删除（功能被 WASM 替代） |
| `frontend/src/game/codeValidator.test.ts` | 删除（或重写为集成测试） |
| `frontend/src/Boss.tsx` | 微调：离线模式不显示"暂不支持动态输出校验"，显示 warnings |
| `frontend/src/types.ts` | CompileResult 新增 `warnings?: string[]` 字段 |
| `backend/` | 删除整个目录 |

### compileRust 新逻辑

```typescript
export async function compileRust(code: string, expectedOutput?: string): Promise<CompileResult> {
  // 1. 尝试 Playground API
  try {
    const result = await compileViaPlayground(code);
    if (expectedOutput !== undefined && result.success && result.output) {
      result.matchExpected = result.output.trimEnd() === expectedOutput.trimEnd();
    }
    return result;
  } catch {
    // Playground 不可用
  }

  // 2. 降级到 WASM 解释器
  const wasm = await getWasmInterpreter();
  const result = wasm.run_code(code);
  
  let matchExpected = null;
  if (expectedOutput !== undefined && result.success && result.output) {
    matchExpected = result.output.trimEnd() === expectedOutput.trimEnd();
  }

  return {
    success: result.success,
    output: result.output || null,
    compilationErrors: result.errors.length > 0 ? result.errors.join('\n') : null,
    runtimeErrors: null,
    warnings: result.warnings,
    matchExpected,
  };
}
```

### Boss UI 变更

离线模式下，Boss 页面显示黄色提示条：
> ⚡ 离线模式 · 结果基于 WASM 解释器，可能与真实 rustc 有差异

同时将 warnings 显示在反馈弹窗中（之前 warnings 被忽略了）。

## 实现顺序

### Phase 1 — Rust 项目骨架 + 解析层

1. 初始化 `wasm/code-validator/` Cargo 项目，配置 `wasm-bindgen` + `syn`
2. 编写 `parse.rs`：用 `syn` 将源代码解析为 AST
3. 编写 `ast.rs`：自定义 IR 类型（简化后的 AST 节点）
4. 验证：能正确解析 w00-w18 所有 boss 模板代码

### Phase 2 — 语义分析 + Warnings

1. 编写 `analysis.rs`：作用域追踪、变量生命周期追踪
2. 实现 unused variable / function / struct 检测
3. 实现 dead code 检测
4. 验证：对 `let x = 42; println!("hi");` 输出 `unused variable: x` warning

### Phase 3 — 解释执行

1. 编写 `eval.rs`：表达式求值引擎
2. 实现变量帧、作用域链、函数调用栈
3. 实现各类型字面量、运算符、方法调用
4. 实现 `println!` / `print!` 宏模拟（stdout 收集）
5. 实现 `Vec` / `HashMap` 等集合类型
6. 实现控制流（if, loop, for, match）
7. 实现函数、struct、enum、impl
8. 验证：w00-w18 所有 boss 答案正确执行并输出匹配

### Phase 4 — WASM 编译 + 前端集成

1. `wasm-pack build` 编译为 WASM
2. 编写 `wasmLoader.ts`：懒加载 + 缓存
3. 重写 `api.ts`：Playground → WASM 路径
4. 删除 `codeValidator.ts` 后端 + backend/ 目录
5. Boss UI：warnings 展示 + 离线提示条

## 测试策略

- Rust 层：cargo test 单元测试（parse/analysis/eval 各模块）
- WASM 层：wasm-pack test（node 环境）
- 前端层：vitest mock WASM 模块，测试 api.ts 逻辑
- 集成测试：Playwright 在无网络时验证 Boss 战走 WASM 路径

## 删除清单

- `backend/` 整个目录
- `frontend/src/game/codeValidator.ts`
- `frontend/src/game/codeValidator.test.ts`
- `frontend/src/lib/api.ts` 中的 `compileViaBackend` 函数
- `Boss.tsx` 中的 `checkSyntax` / `validateCode` 离线 fallback
- `api.ts` 中的 `CompileResult` 定义（移至 types.ts）

## 设计约束

- WASM binary 大小控制在 5MB 以内（gzip 后 ~1.5MB）
- WASM 模块懒加载：主页渲染后后台下载，Boss 页面进入时若未加载完则显示 loading
- 全部 Rust 代码使用 `#![forbid(unsafe_code)]`
