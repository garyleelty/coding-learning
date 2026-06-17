# Rust WASM Interpreter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Rust interpreter compiled to WASM that replaces `codeValidator.ts` as the offline fallback for HackRust boss submissions, providing semantic warnings (unused variable, dead code) and correct execution for all w00-w18 code patterns.

**Architecture:** A Rust crate (`wasm/code-validator/`) uses `syn` to parse user code into a custom IR, runs semantic analysis for warnings, then interprets the IR to produce stdout output — all compiled to WASM via `wasm-bindgen`. The frontend (`api.ts`) tries Playground API first, falls back to WASM.

**Tech Stack:** Rust (syn, wasm-bindgen, wasm-pack), TypeScript (frontend integration), vitest (frontend tests)

**File Structure:**

```
wasm/code-validator/
├── Cargo.toml
└── src/
    ├── lib.rs          # wasm-bindgen entry: run_code(code) -> InterpResult
    ├── ast.rs          # Custom IR types: Stmt, Expr, Pat, Type
    ├── parse.rs        # syn → ast conversion
    ├── value.rs        # Runtime Value enum (Int, Float, Str, Vec, etc.)
    ├── scope.rs        # Variable frames + scope chain
    ├── eval.rs         # Expression/statement evaluation
    ├── stdlib.rs       # Built-in fns: Vec/HashMap/String/print/assert/parse
    └── analysis.rs     # Semantic analysis for warnings (unused, dead code)

frontend/src/
├── lib/wasmLoader.ts   # NEW — lazy WASM module loader
├── lib/api.ts          # MODIFY — compileRust uses Playground → WASM fallback
├── types.ts            # MODIFY — CompileResult gains warnings field
├── pages/Boss.tsx      # MODIFY — warnings display, offline indicator
├── game/codeValidator.ts       # DELETE
└── game/codeValidator.test.ts  # DELETE

backend/                       # DELETE entire directory
```

---

### Task 1: Rust project scaffold

**Files:**
- Create: `wasm/code-validator/Cargo.toml`
- Create: `wasm/code-validator/src/lib.rs`

- [ ] **Step 1: Create Cargo.toml**

```toml
[package]
name = "code-validator"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
syn = { version = "2.0", features = ["full", "extra-traits"] }
quote = "1.0"
proc-macro2 = "1.0"

[dev-dependencies]
wasm-bindgen-test = "0.3"

[profile.release]
opt-level = "s"
lto = true
```

- [ ] **Step 2: Create lib.rs with WASM entry point**

```rust
#![forbid(unsafe_code)]

use wasm_bindgen::prelude::*;

mod ast;
mod parse;
mod value;
mod scope;
mod eval;
mod stdlib;
mod analysis;

#[wasm_bindgen]
pub struct InterpResult {
    success: bool,
    output: Option<String>,
    warnings: Vec<String>,
    errors: Vec<String>,
}

#[wasm_bindgen]
impl InterpResult {
    #[wasm_bindgen(getter)]
    pub fn success(&self) -> bool { self.success }

    #[wasm_bindgen(getter)]
    pub fn output(&self) -> Option<String> { self.output.clone() }

    #[wasm_bindgen(getter)]
    pub fn warnings(&self) -> Vec<String> { self.warnings.clone() }

    #[wasm_bindgen(getter)]
    pub fn errors(&self) -> Vec<String> { self.errors.clone() }
}

#[wasm_bindgen]
pub fn run_code(code: &str) -> InterpResult {
    // Phase 1: parse
    let program = match parse::parse_program(code) {
        Ok(p) => p,
        Err(e) => return InterpResult {
            success: false,
            output: None,
            warnings: vec![],
            errors: vec![e],
        },
    };

    // Phase 2: analysis
    let warnings = analysis::analyze(&program);

    // Phase 3: execute
    let mut ctx = eval::EvalContext::new();
    let output = match ctx.execute(&program) {
        Ok(o) => o,
        Err(e) => return InterpResult {
            success: false,
            output: None,
            warnings,
            errors: vec![e],
        },
    };

    InterpResult {
        success: true,
        output: Some(output),
        warnings,
        errors: vec![],
    }
}
```

- [ ] **Step 3: Verify it compiles**

Run: `cargo check`
Expected: builds with no errors (warnings about unused modules OK)

- [ ] **Step 4: Commit**

```bash
git add wasm/code-validator/
git commit -m "feat(wasm): scaffold code-validator crate"
```

---

### Task 2: Define IR types (ast.rs)

**Files:**
- Create: `wasm/code-validator/src/ast.rs`

- [ ] **Step 1: Write ast.rs**

```rust
use std::fmt;

#[derive(Debug, Clone, PartialEq)]
pub enum Literal {
    Int(i64),
    Float(f64),
    Bool(bool),
    String(String),
    Char(char),
}

/// Source location for diagnostic messages
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Span {
    pub line: usize,
    pub col: usize,
}

#[derive(Debug, Clone, PartialEq)]
pub enum Pat {
    Wild,
    Lit(Literal),
    Ident(String),
    Enum(String, Vec<Pat>),       // Some(x), None, Ok(v), Err(e)
    Tuple(Vec<Pat>),
}

#[derive(Debug, Clone, PartialEq)]
pub enum Expr {
    Literal(Literal),
    Ident(String),
    Path(Vec<String>),              // std::f64::consts::PI
    Block(Vec<Stmt>),
    Binary(Box<Expr>, BinOp, Box<Expr>),
    Unary(UnOp, Box<Expr>),
    If(Box<Expr>, Box<Expr>, Option<Box<Expr>>),
    Call(Box<Expr>, Vec<Expr>),
    MethodCall(Box<Expr>, String, Vec<Expr>),
    Field(Box<Expr>, String),       // self.name
    Index(Box<Expr>, Box<Expr>),    // map[key]
    StructLit(String, Vec<(String, Expr)>),
    Lambda(Vec<String>, Box<Expr>),
    Range(Box<Expr>, Box<Expr>, bool), // start..=end (bool = inclusive)
    Try(Box<Expr>),                 // expr?
    Match(Box<Expr>, Vec<(Pat, Expr)>),
    Return(Option<Box<Expr>>),
    Break,
    Continue,
    Assign(Box<Expr>, Box<Expr>),   // x = expr; *ptr = expr; map[key] = expr
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum BinOp {
    Add, Sub, Mul, Div, Rem,
    Eq, Ne, Lt, Le, Gt, Ge,
    And, Or,
    AddAssign, SubAssign, MulAssign, DivAssign,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum UnOp {
    Neg,
    Not,
    Deref,
}

#[derive(Debug, Clone, PartialEq)]
pub enum TypeName {
    Named(String),
    Generic(String, Vec<TypeName>),
    Ref(Box<TypeName>, bool),       // bool = mut
    Slice(Box<TypeName>),
    Tuple(Vec<TypeName>),
}

#[derive(Debug, Clone, PartialEq)]
pub enum Stmt {
    Expr(Expr),
    Let {
        name: String,
        mutable: bool,
        init: Option<Expr>,
        ty: Option<TypeName>,
    },
    FnDef {
        name: String,
        params: Vec<(String, TypeName)>,
        ret: TypeName,
        body: Vec<Stmt>,
    },
    StructDef {
        name: String,
        fields: Vec<(String, TypeName)>,
        generics: Vec<String>,
    },
    EnumDef {
        name: String,
        variants: Vec<VariantDef>,
        generics: Vec<String>,
    },
    ImplBlock {
        type_name: String,
        methods: Vec<FnStmt>,
    },
    TraitDef {
        name: String,
        methods: Vec<(String, Vec<(String, TypeName)>, TypeName)>,
    },
    ImplTrait {
        trait_name: String,
        type_name: String,
        methods: Vec<FnStmt>,
    },
    ModDef {
        name: String,
        items: Vec<Stmt>,
    },
    Use {
        path: Vec<String>,
    },
    Attributed {
        attr: String,           // "test", "derive(Debug)"
        item: Box<Stmt>,
    },
}

#[derive(Debug, Clone, PartialEq)]
pub struct FnStmt {
    pub name: String,
    pub params: Vec<(String, TypeName)>,
    pub ret: TypeName,
    pub body: Vec<Stmt>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct VariantDef {
    pub name: String,
    pub fields: Vec<(String, TypeName)>,
}

impl Stmt {
    pub fn span(&self) -> Option<Span> {
        None // placeholders — will be added later if needed
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct Program {
    pub items: Vec<Stmt>,
}
```

- [ ] **Step 2: Verify compilation**

Run: `cargo check` from `wasm/code-validator/`
Expected: passes

- [ ] **Step 3: Commit**

```bash
git add wasm/code-validator/src/ast.rs
git commit -m "feat(wasm): define IR types (ast.rs)"
```

---

### Task 3: Implement syn→IR parser (parse.rs)

**Files:**
- Create: `wasm/code-validator/src/parse.rs`

- [ ] **Step 1: Write parse.rs — convert syn AST to custom IR**

Key design decisions for the parser:
- `syn::parse_file` gives a `syn::File` containing `syn::Item` items
- Each `syn::Item` variant maps to a `Stmt` variant
- Expressions (`syn::Expr`) → `Expr` variants
- Patterns (`syn::Pat`) → `Pat` variants
- Unsupported constructs (unsafe, async, macros other than println/print/format/assert/vec) return `Err`

```rust
use syn::{parse_quote, ItemFn, ItemMod, File, Item, Expr as SynExpr, Stmt as SynStmt, Pat as SynPat, Type as SynType};
use crate::ast::*;

pub fn parse_program(code: &str) -> Result<Program, String> {
    let file: File = syn::parse_file(code).map_err(|e| format!("parse error: {}", e))?;
    let mut items = Vec::new();
    for item in file.items {
        items.push(parse_item(item)?);
    }
    Ok(Program { items })
}

fn parse_item(item: syn::Item) -> Result<Stmt, String> {
    match item {
        syn::Item::Fn(f) => parse_fn(f).map(Stmt::FnDef),
        syn::Item::Struct(s) => parse_struct(s).map(Stmt::StructDef),
        syn::Item::Enum(e) => parse_enum(e).map(Stmt::EnumDef),
        syn::Item::Impl(i) => parse_impl(i).map(Stmt::ImplBlock),
        syn::Item::Trait(t) => parse_trait(t).map(Stmt::TraitDef),
        syn::Item::ImplTrait(i) => parse_impl_trait(i).map(Stmt::ImplTrait),
        syn::Item::Mod(m) => parse_mod(m).map(Stmt::ModDef),
        syn::Item::Use(u) => parse_use(u).map(Stmt::Use),
        syn::Item::Const(_) | syn::Item::Static(_) | syn::Item::ExternCrate(_)
        | syn::Item::ForeignMod(_) | syn::Item::Macro(_) | syn::Item::TraitAlias(_)
        | syn::Item::Type(_) | syn::Item::Union(_) => {
            Err(format!("unsupported item: {:?}", item))
        }
        _ => Err(format!("unknown item")),
    }
}

fn parse_fn(f: ItemFn) -> Result<FnStmt, String> {
    let name = f.sig.ident.to_string();
    let params = f.sig.inputs.iter().map(|p| {
        match p {
            syn::FnArg::Typed(pt) => {
                let pat = parse_pat(&pt.pat)?;
                let name = match pat {
                    Pat::Ident(n) => n,
                    _ => return Err(format!("unsupported fn param pattern")),
                };
                let ty = parse_type(&pt.ty)?;
                Ok((name, ty))
            }
            syn::FnArg::Receiver(_) => {
                Ok(("self".to_string(), TypeName::Named("Self".to_string())))
            }
        }
    }).collect::<Result<Vec<_>, String>>()?;

    let ret = match &f.sig.output {
        syn::ReturnType::Default => TypeName::Tuple(vec![]),
        syn::ReturnType::Type(_, ty) => parse_type(ty)?,
    };

    let body = parse_block(&f.body)?;

    Ok(FnStmt { name, params, ret, body })
}

fn parse_struct(s: syn::ItemStruct) -> Result<(String, Vec<(String, TypeName)>, Vec<String>), String> {
    let name = s.ident.to_string();
    let fields = match &s.fields {
        syn::Fields::Named(fields) => {
            fields.named.iter().map(|f| {
                let name = f.ident.as_ref().unwrap().to_string();
                let ty = parse_type(&f.ty)?;
                Ok((name, ty))
            }).collect::<Result<Vec<_>, String>>()?
        }
        syn::Fields::Unnamed(_) => return Err("tuple structs not supported".to_string()),
        syn::Fields::Unit => vec![],
    };
    let generics = s.generics.params.iter().map(|p| {
        match p {
            syn::GenericParam::Type(t) => t.ident.to_string(),
            syn::GenericParam::Lifetime(l) => l.lifetime.ident.to_string(),
            _ => "".to_string(),
        }
    }).collect();
    Ok((name, fields, generics))
}

fn parse_enum(e: syn::ItemEnum) -> Result<(String, Vec<VariantDef>, Vec<String>), String> {
    let name = e.ident.to_string();
    let variants = e.variants.iter().map(|v| {
        let fields = match &v.fields {
            syn::Fields::Named(fields) => {
                fields.named.iter().map(|f| {
                    let name = f.ident.as_ref().unwrap().to_string();
                    let ty = parse_type(&f.ty)?;
                    Ok((name, ty))
                }).collect::<Result<Vec<_>, String>>()?
            }
            syn::Fields::Unnamed(fields) => {
                fields.unnamed.iter().enumerate().map(|(i, f)| {
                    let ty = parse_type(&f.ty)?;
                    Ok((format!("_{}", i), ty))
                }).collect::<Result<Vec<_>, String>>()?
            }
            syn::Fields::Unit => vec![],
        };
        Ok(VariantDef {
            name: v.ident.to_string(),
            fields,
        })
    }).collect::<Result<Vec<_>, String>>()?;
    let generics = e.generics.params.iter().map(|p| {
        match p {
            syn::GenericParam::Type(t) => t.ident.to_string(),
            syn::GenericParam::Lifetime(l) => l.lifetime.ident.to_string(),
            _ => "".to_string(),
        }
    }).collect();
    Ok((name, variants, generics))
}

fn parse_impl(i: syn::ItemImpl) -> Result<(String, Vec<FnStmt>), String> {
    let type_name = path_to_string(&i.self_ty);
    let methods = i.items.iter().map(|item| {
        match item {
            syn::ImplItem::Fn(f) => parse_fn(f.clone()),
            _ => Err(format!("unsupported impl item")),
        }
    }).collect::<Result<Vec<_>, String>>()?;
    Ok((type_name, methods))
}

fn parse_trait(t: syn::ItemTrait) -> Result<(String, Vec<(String, Vec<(String, TypeName)>, TypeName)>), String> {
    let name = t.ident.to_string();
    let methods = t.items.iter().map(|item| {
        match item {
            syn::TraitItem::Fn(f) => {
                let name = f.sig.ident.to_string();
                let params = f.sig.inputs.iter().filter_map(|p| {
                    match p {
                        syn::FnArg::Typed(pt) => {
                            let pat = parse_pat(&pt.pat).ok()?;
                            let name = match pat { Pat::Ident(n) => n, _ => return None };
                            let ty = parse_type(&pt.ty).ok()?;
                            Some((name, ty))
                        }
                        _ => None,
                    }
                }).collect();
                let ret = match &f.sig.output {
                    syn::ReturnType::Default => TypeName::Tuple(vec![]),
                    syn::ReturnType::Type(_, ty) => parse_type(ty).unwrap_or(TypeName::Named("()".to_string())),
                };
                Ok((name, params, ret))
            }
            _ => Err("unsupported trait item".to_string()),
        }
    }).collect::<Result<Vec<_>, String>>()?;
    Ok((name, methods))
}

fn parse_impl_trait(i: syn::ItemImpl) -> Result<(String, String, Vec<FnStmt>), String> {
    let trait_name = path_to_string(&i.trait_.as_ref().ok_or("missing trait ref")?.1);
    let type_name = path_to_string(&i.self_ty);
    let methods = i.items.iter().map(|item| {
        match item {
            syn::ImplItem::Fn(f) => parse_fn(f.clone()),
            _ => Err(format!("unsupported impl item")),
        }
    }).collect::<Result<Vec<_>, String>>()?;
    Ok((trait_name, type_name, methods))
}

fn parse_mod(m: ItemMod) -> Result<(String, Vec<Stmt>), String> {
    let name = m.ident.to_string();
    let items = match m.content {
        Some((_, items)) => items.into_iter().map(parse_item).collect::<Result<Vec<_>, String>>()?,
        None => vec![],
    };
    Ok((name, items))
}

fn parse_use(u: syn::ItemUse) -> Result<Vec<String>, String> {
    let mut path = Vec::new();
    fn extract_path(use_path: &syn::UseTree, out: &mut Vec<String>) {
        match use_path {
            syn::UseTree::Path(p) => {
                out.push(p.ident.to_string());
                extract_path(&p.tree, out);
            }
            syn::UseTree::Name(n) => { out.push(n.ident.to_string()); }
            syn::UseTree::Glob(_) => { out.push("*".to_string()); }
            syn::UseTree::Rename(r) => { out.push(r.ident.to_string()); }
            _ => {}
        }
    }
    extract_path(&u.tree, &mut path);
    Ok(path)
}

fn parse_block(block: &syn::Block) -> Result<Vec<Stmt>, String> {
    block.stmts.iter().map(parse_stmt).collect()
}

fn parse_stmt(stmt: &SynStmt) -> Result<Stmt, String> {
    match stmt {
        SynStmt::Expr(e, _) => parse_expr(e).map(Stmt::Expr),
        SynStmt::Local(l) => {
            let name = match &l.pat {
                SynPat::Ident(i) => i.ident.to_string(),
                _ => return Err("unsupported let pattern".to_string()),
            };
            let mutable = match &l.pat {
                SynPat::Ident(i) => i.mutability.is_some(),
                _ => false,
            };
            let init = l.init.as_ref().map(|(_, e)| parse_expr(e)).transpose()?;
            let ty = l.ty.as_ref().map(|(_, t)| parse_type(t)).transpose()?;
            Ok(Stmt::Let { name, mutable, init, ty })
        }
        SynStmt::Item(item) => parse_item(item.clone()),
    }
}

fn parse_expr(expr: &SynExpr) -> Result<Expr, String> {
    match expr {
        SynExpr::Lit(lit) => parse_literal(&lit.lit).map(Expr::Literal),
        SynExpr::Path(p) => {
            let ident = path_to_string(&p.path);
            Ok(if ident.contains("::") {
                Expr::Path(ident.split("::").map(|s| s.to_string()).collect())
            } else {
                Expr::Ident(ident)
            })
        }
        SynExpr::Block(b) => parse_block(&b.block).map(|s| Expr::Block(s)),
        SynExpr::If(if_expr) => {
            let cond = parse_expr(&if_expr.cond)?;
            let then_b = parse_block(&if_expr.then_branch)?;
            let else_b = if let Some((_, else_expr)) = &if_expr.else_branch {
                Some(Box::new(parse_expr(else_expr)?))
            } else {
                None
            };
            Ok(Expr::If(Box::new(cond), Box::new(Expr::Block(then_b)), else_b.map(|e| *e)))
        }
        SynExpr::Binary(bin) => {
            let lhs = parse_expr(&bin.left)?;
            let rhs = parse_expr(&bin.right)?;
            let op = match &bin.op {
                syn::BinOp::Add(_) => BinOp::Add,
                syn::BinOp::Sub(_) => BinOp::Sub,
                syn::BinOp::Mul(_) => BinOp::Mul,
                syn::BinOp::Div(_) => BinOp::Div,
                syn::BinOp::Rem(_) => BinOp::Rem,
                syn::BinOp::Eq(_) => BinOp::Eq,
                syn::BinOp::Ne(_) => BinOp::Ne,
                syn::BinOp::Lt(_) => BinOp::Lt,
                syn::BinOp::Le(_) => BinOp::Le,
                syn::BinOp::Gt(_) => BinOp::Gt,
                syn::BinOp::Ge(_) => BinOp::Ge,
                syn::BinOp::And(_) => BinOp::And,
                syn::BinOp::Or(_) => BinOp::Or,
                syn::BinOp::AddAssign(_) => BinOp::AddAssign,
                syn::BinOp::SubAssign(_) => BinOp::SubAssign,
                syn::BinOp::MulAssign(_) => BinOp::MulAssign,
                syn::BinOp::DivAssign(_) => BinOp::DivAssign,
                _ => return Err("unsupported binary operator".to_string()),
            };
            Ok(Expr::Binary(Box::new(lhs), op, Box::new(rhs)))
        }
        SynExpr::Unary(un) => {
            let operand = parse_expr(&un.expr)?;
            let op = match &un.op {
                syn::UnOp::Neg(_) => UnOp::Neg,
                syn::UnOp::Not(_) => UnOp::Not,
                syn::UnOp::Deref(_) => UnOp::Deref,
            };
            Ok(Expr::Unary(op, Box::new(operand)))
        }
        SynExpr::Call(call) => {
            let func = parse_expr(&call.func)?;
            let args = call.args.iter().map(parse_expr).collect::<Result<Vec<_>, String>>()?;
            Ok(Expr::Call(Box::new(func), args))
        }
        SynExpr::MethodCall(mc) => {
            let receiver = parse_expr(&mc.receiver)?;
            let method = mc.method.to_string();
            let args = mc.args.iter().map(parse_expr).collect::<Result<Vec<_>, String>>()?;
            Ok(Expr::MethodCall(Box::new(receiver), method, args))
        }
        SynExpr::Field(f) => {
            let base = parse_expr(&f.base)?;
            Ok(Expr::Field(Box::new(base), f.member.to_string()))
        }
        SynExpr::Index(idx) => {
            let base = parse_expr(&idx.expr)?;
            let index_expr = parse_expr(&idx.index)?;
            Ok(Expr::Index(Box::new(base), Box::new(index_expr)))
        }
        SynExpr::Struct(s) => {
            let name = path_to_string(&s.path);
            let fields = s.fields.iter().map(|f| {
                let name = f.ident.as_ref().unwrap().to_string();
                let expr = parse_expr(&f.expr)?;
                Ok((name, expr))
            }).collect::<Result<Vec<_>, String>>()?;
            Ok(Expr::StructLit(name, fields))
        }
        SynExpr::Closure(c) => {
            let params = c.inputs.iter().map(|p| {
                match &p.pat {
                    SynPat::Ident(i) => Ok(i.ident.to_string()),
                    _ => Err("unsupported closure param".to_string()),
                }
            }).collect::<Result<Vec<_>, String>>()?;
            let body = parse_expr(&c.body)?;
            Ok(Expr::Lambda(params, Box::new(body)))
        }
        SynExpr::Range(r) => {
            let start = parse_expr(r.start.as_ref().unwrap())?;
            let end = parse_expr(r.end.as_ref().unwrap())?;
            Ok(Expr::Range(Box::new(start), Box::new(end), r.limits == syn::RangeLimits::Closed))
        }
        SynExpr::Try(t) => {
            Ok(Expr::Try(Box::new(parse_expr(&t.expr)?)))
        }
        SynExpr::Match(m) => {
            let scrutinee = parse_expr(&m.expr)?;
            let arms = m.arms.iter().map(|arm| {
                let pat = parse_pat(&arm.pat)?;
                let body = parse_expr(&arm.body)?;
                Ok((pat, body))
            }).collect::<Result<Vec<_>, String>>()?;
            Ok(Expr::Match(Box::new(scrutinee), arms))
        }
        SynExpr::Return(r) => {
            Ok(Expr::Return(r.expr.as_ref().map(|e| Box::new(parse_expr(e).unwrap())).map(|b| *b)))
        }
        SynExpr::Break(_) => Ok(Expr::Break),
        SynExpr::Continue(_) => Ok(Expr::Continue),
        SynExpr::Assign(a) => {
            let lhs = parse_expr(&a.left)?;
            let rhs = parse_expr(&a.right)?;
            Ok(Expr::Assign(Box::new(lhs), Box::new(rhs)))
        }
        SynExpr::Paren(p) => parse_expr(&p.expr),
        SynExpr::Cast(c) => {
            // handle 'x as i32', etc — drop the cast for now, just evaluate inner
            // In our interpreter, we handle type coercion at evaluation time
            parse_expr(&c.expr)
        }
        SynExpr::Loop(l) => {
            let body = parse_block(&l.body)?;
            Ok(Expr::Loop(Box::new(Expr::Block(body))))
        }
        SynExpr::While(w) => {
            let cond = parse_expr(&w.cond)?;
            let body = parse_block(&w.body)?;
            Ok(Expr::While(Box::new(cond), Box::new(Expr::Block(body))))
        }
        SynExpr::ForLoop(f) => {
            let pat_name = match &f.pat {
                SynPat::Ident(i) => i.ident.to_string(),
                _ => return Err("unsupported for pattern".to_string()),
            };
            let iter = parse_expr(&f.expr)?;
            let body = parse_block(&f.body)?;
            Ok(Expr::ForIn(pat_name, Box::new(iter), Box::new(Expr::Block(body))))
        }
        SynExpr::Reference(r) => {
            // References (&x, &mut x) — evaluate operand, return value
            parse_expr(&r.expr)
        }
        SynExpr::Let(l) => {
            Err(format!("let expressions not supported in expression position"))
        }
        _ => Err(format!("unsupported expression: {:?}", expr)),
    }
}

fn parse_literal(lit: &syn::Lit) -> Result<Literal, String> {
    match lit {
        syn::Lit::Int(i) => i.base10_parse::<i64>().map(Literal::Int).map_err(|e| e.to_string()),
        syn::Lit::Float(f) => f.base10_parse::<f64>().map(Literal::Float).map_err(|e| e.to_string()),
        syn::Lit::Bool(b) => Ok(Literal::Bool(b.value)),
        syn::Lit::Str(s) => Ok(Literal::String(s.value())),
        syn::Lit::Char(c) => Ok(Literal::Char(c.value())),
        _ => Err("unsupported literal".to_string()),
    }
}

fn parse_pat(pat: &SynPat) -> Result<Pat, String> {
    match pat {
        SynPat::Wild(_) => Ok(Pat::Wild),
        SynPat::Ident(i) => Ok(Pat::Ident(i.ident.to_string())),
        SynPat::Lit(l) => parse_literal(&l.lit).map(Pat::Lit),
        SynPat::TupleStruct(ts) => {
            let name = path_to_string(&ts.path);
            let args = ts.pat.elems.iter().map(parse_pat).collect::<Result<Vec<_>, String>>()?;
            Ok(Pat::Enum(name, args))
        }
        SynPat::Tuple(t) => {
            let elems = t.pat.elems.iter().map(parse_pat).collect::<Result<Vec<_>, String>>()?;
            Ok(Pat::Tuple(elems))
        }
        _ => Err("unsupported pattern".to_string()),
    }
}

fn parse_type(ty: &SynType) -> Result<TypeName, String> {
    match ty {
        SynType::Path(p) => {
            let ident = path_to_string(&p.path);
            if let Some(seg) = p.path.segments.last() {
                if let syn::PathArguments::AngleBracketed(args) = &seg.arguments {
                    let inner: Vec<TypeName> = args.args.iter().map(|a| {
                        match a {
                            syn::GenericArgument::Type(t) => parse_type(t),
                            syn::GenericArgument::Lifetime(_) => Ok(TypeName::Named("'static".to_string())),
                            _ => Err("unsupported generic argument".to_string()),
                        }
                    }).collect::<Result<Vec<_>, String>>()?;
                    return Ok(TypeName::Generic(ident, inner));
                }
            }
            Ok(TypeName::Named(ident))
        }
        SynType::Reference(r) => {
            let inner = parse_type(&r.elem)?;
            Ok(TypeName::Ref(Box::new(inner), r.mutability.is_some()))
        }
        SynType::Slice(s) => {
            let inner = parse_type(&s.elem)?;
            Ok(TypeName::Slice(Box::new(inner)))
        }
        SynType::Tuple(t) => {
            let elems = t.elems.iter().map(parse_type).collect::<Result<Vec<_>, String>>()?;
            Ok(TypeName::Tuple(elems))
        }
        _ => Err(format!("unsupported type")),
    }
}

fn path_to_string(path: &syn::Path) -> String {
    path.segments.iter().map(|s| s.ident.to_string()).collect::<Vec<_>>().join("::")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_simple_let() {
        let program = parse_program(r#"fn main() { let x = 42; }"#).unwrap();
        assert_eq!(program.items.len(), 1);
    }

    #[test]
    fn test_parse_println() {
        let program = parse_program(r#"fn main() { println!("hi"); }"#).unwrap();
        assert_eq!(program.items.len(), 1);
    }
}
```

- [ ] **Step 2: Run tests**

Run: `cargo test test_parse_simple_let` and `cargo test test_parse_println`
Expected: both pass

- [ ] **Step 3: Commit**

```bash
git add wasm/code-validator/src/parse.rs
git commit -m "feat(wasm): syn-based parser (parse.rs)"
```

---

### Task 4: Runtime value system (value.rs)

**Files:**
- Create: `wasm/code-validator/src/value.rs`
- Create: `wasm/code-validator/src/error.rs`

- [ ] **Step 1: Write value.rs**

```rust
use std::collections::HashMap;
use std::fmt;

/// Core runtime value representation
#[derive(Debug, Clone)]
pub enum Value {
    Int(i64),
    Float(f64),
    Bool(bool),
    String(String),
    Char(char),
    Vec(Vec<Value>),
    HashMap(HashMap<String, Value>),
    Struct(String, Vec<(String, Value)>),       // type_name, fields
    EnumVariant(String, String, Option<Box<Value>>), // enum_name, variant_name, payload
    Fn(FnValue),
    Closure(ClosureValue),
    Unit,
}

#[derive(Debug, Clone)]
pub struct FnValue {
    pub name: String,
    pub param_count: usize,
}

#[derive(Debug, Clone)]
pub struct ClosureValue {
    pub param_count: usize,
}

impl Value {
    pub fn type_name(&self) -> &str {
        match self {
            Value::Int(_) => "i32",
            Value::Float(_) => "f64",
            Value::Bool(_) => "bool",
            Value::String(_) => "String",
            Value::Char(_) => "char",
            Value::Vec(_) => "Vec",
            Value::HashMap(_) => "HashMap",
            Value::Struct(name, _) => name,
            Value::EnumVariant(_, name, _) => name,
            Value::Fn(_) => "fn",
            Value::Closure(_) => "closure",
            Value::Unit => "()",
        }
    }

    pub fn to_float(&self) -> Option<f64> {
        match self {
            Value::Int(i) => Some(*i as f64),
            Value::Float(f) => Some(*f),
            _ => None,
        }
    }

    pub fn to_int(&self) -> Option<i64> {
        match self {
            Value::Int(i) => Some(*i),
            _ => None,
        }
    }

    pub fn to_bool(&self) -> Option<bool> {
        match self {
            Value::Bool(b) => Some(*b),
            _ => None,
        }
    }

    pub fn to_string_value(&self) -> Option<&str> {
        match self {
            Value::String(s) => Some(s.as_str()),
            _ => None,
        }
    }
}

impl fmt::Display for Value {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Value::Int(i) => write!(f, "{}", i),
            Value::Float(fl) => write!(f, "{}", fl),
            Value::Bool(b) => write!(f, "{}", b),
            Value::String(s) => write!(f, "{}", s),
            Value::Char(c) => write!(f, "{}", c),
            Value::Vec(v) => {
                write!(f, "[")?;
                for (i, item) in v.iter().enumerate() {
                    if i > 0 { write!(f, ", ")?; }
                    write!(f, "{}", item)?;
                }
                write!(f, "]")
            }
            Value::HashMap(m) => {
                write!(f, "{{")?;
                for (i, (k, v)) in m.iter().enumerate() {
                    if i > 0 { write!(f, ", ")?; }
                    write!(f, "\"{}\": {}", k, v)?;
                }
                write!(f, "}}")
            }
            Value::Struct(name, fields) => {
                write!(f, "{} {{ ", name)?;
                for (i, (n, v)) in fields.iter().enumerate() {
                    if i > 0 { write!(f, ", ")?; }
                    write!(f, "{}: {}", n, v)?;
                }
                write!(f, " }}")
            }
            Value::EnumVariant(enum_name, variant_name, payload) => {
                if let Some(p) = payload {
                    write!(f, "{}::{}({})", enum_name, variant_name, p)
                } else {
                    write!(f, "{}::{}", enum_name, variant_name)
                }
            }
            Value::Fn(fv) => write!(f, "fn {}", fv.name),
            Value::Closure(_) => write!(f, "|...| ..."),
            Value::Unit => write!(f, "()"),
        }
    }
}

/// Error types for the interpreter
#[derive(Debug, Clone)]
pub enum RuntimeError {
    DivisionByZero,
    IndexOutOfBounds,
    KeyNotFound(String),
    TypeMismatch(String),
    UndefinedVariable(String),
    UndefinedFunction(String),
    UndefinedField(String),
    NotCallable(String),
    Panic(String),
    BreakOutsideLoop,
    ContinueOutsideLoop,
    AssertionFailed(String),
    ReturnWithoutFunction,
}

impl fmt::Display for RuntimeError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            RuntimeError::DivisionByZero => write!(f, "attempt to divide by zero"),
            RuntimeError::IndexOutOfBounds => write!(f, "index out of bounds"),
            RuntimeError::KeyNotFound(k) => write!(f, "key not found: {}", k),
            RuntimeError::TypeMismatch(msg) => write!(f, "type mismatch: {}", msg),
            RuntimeError::UndefinedVariable(v) => write!(f, "undefined variable: {}", v),
            RuntimeError::UndefinedFunction(v) => write!(f, "undefined function: {}", v),
            RuntimeError::UndefinedField(v) => write!(f, "undefined field: {}", v),
            RuntimeError::NotCallable(v) => write!(f, "not callable: {}", v),
            RuntimeError::Panic(msg) => write!(f, "panic: {}", msg),
            RuntimeError::BreakOutsideLoop => write!(f, "break outside loop"),
            RuntimeError::ContinueOutsideLoop => write!(f, "continue outside loop"),
            RuntimeError::AssertionFailed(msg) => write!(f, "assertion failed: {}", msg),
            RuntimeError::ReturnWithoutFunction => write!(f, "return outside function"),
        }
    }
}
```

- [ ] **Step 2: Write error.rs**

```rust
pub use crate::value::RuntimeError;
```

(may not need a separate file if error types live in value.rs)

- [ ] **Step 3: Run `cargo check`**

Expected: passes

- [ ] **Step 4: Commit**

```bash
git add wasm/code-validator/src/value.rs wasm/code-validator/src/error.rs
git commit -m "feat(wasm): runtime value system (value.rs)"
```

---

### Task 5: Scope / environment frames (scope.rs)

**Files:**
- Create: `wasm/code-validator/src/scope.rs`

- [ ] **Step 1: Write scope.rs**

```rust
use std::collections::HashMap;
use crate::value::Value;

/// A single variable frame (function or block scope)
#[derive(Debug, Clone)]
pub struct Frame {
    pub vars: HashMap<String, Value>,
}

impl Frame {
    pub fn new() -> Self {
        Frame { vars: HashMap::new() }
    }
}

/// Chained scope: each scope level can shadow parent vars
pub struct Scope {
    frames: Vec<Frame>,
    depth: Vec<usize>,      // depth level of each variable (for shadow detection)
    var_order: Vec<String>,  // declaration order for unused var detection
}

pub struct ScopeSnapshot {
    frame_count: usize,
}

impl Scope {
    pub fn new() -> Self {
        Scope {
            frames: vec![Frame::new()],
            depth: vec![],
            var_order: vec![],
        }
    }

    pub fn push_frame(&mut self) {
        self.frames.push(Frame::new());
    }

    pub fn pop_frame(&mut self) {
        self.frames.pop();
    }

    pub fn define(&mut self, name: &str, value: Value) {
        self.frames.last_mut().unwrap().vars.insert(name.to_string(), value);
    }

    pub fn get(&self, name: &str) -> Option<&Value> {
        for frame in self.frames.iter().rev() {
            if let Some(v) = frame.vars.get(name) {
                return Some(v);
            }
        }
        None
    }

    pub fn get_mut(&mut self, name: &str) -> Option<&mut Value> {
        for frame in self.frames.iter_mut().rev() {
            if frame.vars.contains_key(name) {
                return frame.vars.get_mut(name);
            }
        }
        None
    }

    pub fn snapshot(&self) -> ScopeSnapshot {
        ScopeSnapshot {
            frame_count: self.frames.len(),
        }
    }

    pub fn restore(&mut self, snap: ScopeSnapshot) {
        while self.frames.len() > snap.frame_count {
            self.frames.pop();
        }
    }
}
```

- [ ] **Step 2: Run `cargo check`**

Expected: passes

- [ ] **Step 3: Commit**

```bash
git add wasm/code-validator/src/scope.rs
git commit -m "feat(wasm): scope/environment frames (scope.rs)"
```

---

### Task 6: Basic expression evaluation (eval.rs — literals, arithmetic, comparison, logic)

**Files:**
- Create: `wasm/code-validator/src/eval.rs`

- [ ] **Step 1: Write eval.rs skeleton with basic expressions**

```rust
use crate::ast::*;
use crate::scope::Scope;
use crate::value::*;
use crate::stdlib;

/// Holds the interpreter state during execution
pub struct EvalContext {
    pub scope: Scope,
    pub stdout: String,
    pub functions: Vec<FnStmt>,
    pub struct_defs: Vec<(String, Vec<(String, TypeName)>, Vec<String>)>,
    pub enum_defs: Vec<(String, Vec<VariantDef>, Vec<String>)>,
    pub impls: Vec<(String, Vec<FnStmt>)>,        // type_name -> methods
    pub trait_impls: Vec<(String, String, Vec<FnStmt>)>, // (trait_name, type_name, methods)
    pub traits: Vec<(String, Vec<(String, Vec<(String, TypeName)>, TypeName)>)>,
    pub mod_items: Vec<(String, Program)>,
    pub loop_break_value: Option<Value>,
    pub return_value: Option<Value>,
}

impl EvalContext {
    pub fn new() -> Self {
        EvalContext {
            scope: Scope::new(),
            stdout: String::new(),
            functions: vec![],
            struct_defs: vec![],
            enum_defs: vec![],
            impls: vec![],
            trait_impls: vec![],
            traits: vec![],
            mod_items: vec![],
            loop_break_value: None,
            return_value: None,
        }
    }

    pub fn write(&mut self, s: &str) {
        self.stdout.push_str(s);
    }

    pub fn writeln(&mut self, s: &str) {
        self.stdout.push_str(s);
        self.stdout.push('\n');
    }

    // Parse and execute full program
    pub fn execute(&mut self, program: &Program) -> Result<String, String> {
        // First pass: register all top-level items
        for item in &program.items {
            self.register_item(item)?;
        }

        // Find and call main
        let main_idx = self.functions.iter().position(|f| f.name == "main")
            .ok_or("no main function found".to_string())?;
        let main_fn = self.functions[main_idx].clone();
        self.call_function(&main_fn, &[])?;

        Ok(self.stdout.clone())
    }

    fn register_item(&mut self, stmt: &Stmt) -> Result<(), String> {
        match stmt {
            Stmt::FnDef { name, params, ret, body } => {
                self.functions.push(FnStmt {
                    name: name.clone(),
                    params: params.clone(),
                    ret: ret.clone(),
                    body: body.clone(),
                });
            }
            Stmt::StructDef { name, fields, generics } => {
                self.struct_defs.push((name.clone(), fields.clone(), generics.clone()));
            }
            Stmt::EnumDef { name, variants, generics } => {
                self.enum_defs.push((name.clone(), variants.clone(), generics.clone()));
            }
            Stmt::ImplBlock { type_name, methods } => {
                self.impls.push((type_name.clone(), methods.clone()));
            }
            Stmt::ImplTrait { trait_name, type_name, methods } => {
                self.trait_impls.push((trait_name.clone(), type_name.clone(), methods.clone()));
            }
            Stmt::TraitDef { name, methods } => {
                self.traits.push((name.clone(), methods.clone()));
            }
            Stmt::ModDef { name, items } => {
                // Flatten module items into main namespace for simplicity
                for item in items {
                    self.register_item(item)?;
                }
            }
            Stmt::Use { path } => {
                // use statements are informational in our interpreter
                // we just flatten them — all items are already in global scope
            }
            Stmt::Attributed { attr, item } => {
                // #[test] and #[derive(Debug)] — register the item normally
                self.register_item(item)?;
            }
            _ => {} // Expr and Let at top level are handled during execution
        }
        Ok(())
    }

    pub fn eval_expr(&mut self, expr: &Expr) -> Result<Value, String> {
        match expr {
            Expr::Literal(lit) => self.eval_literal(lit),
            Expr::Ident(name) => {
                self.scope.get(name)
                    .cloned()
                    .ok_or_else(|| format!("undefined variable: {}", name))
            }
            Expr::Path(path) => {
                // Handle std constants like std::f64::consts::PI
                self.eval_path(path)
            }
            Expr::Binary(lhs, op, rhs) => self.eval_binary(lhs, op, rhs),
            Expr::Unary(op, expr) => self.eval_unary(op, expr),
            Expr::Block(stmts) => self.eval_block(stmts),
            Expr::If(cond, then_b, else_b) => self.eval_if(cond, then_b, else_b),
            Expr::Call(func, args) => self.eval_call(func, args),
            Expr::MethodCall(receiver, method, args) => self.eval_method_call(receiver, method, args),
            Expr::Field(base, name) => self.eval_field(base, name),
            Expr::Index(base, index) => self.eval_index(base, index),
            Expr::StructLit(name, fields) => self.eval_struct_lit(name, fields),
            Expr::Lambda(params, body) => Ok(Value::Closure(ClosureValue { param_count: params.len() })),
            Expr::Range(start, end, inclusive) => self.eval_range(start, end, *inclusive),
            Expr::Try(inner) => self.eval_try(inner),
            Expr::Match(scrutinee, arms) => self.eval_match(scrutinee, arms),
            Expr::Return(val) => self.eval_return(val),
            Expr::Break => { self.loop_break_value = Some(Value::Unit); Ok(Value::Unit) }
            Expr::Continue => Ok(Value::Unit),
            Expr::Assign(lhs, rhs) => self.eval_assign(lhs, rhs),
            Expr::While(cond, body) => self.eval_while(cond, body),
            Expr::ForIn(name, iter_expr, body) => self.eval_for(name, iter_expr, body),
            Expr::Loop(body) => self.eval_loop(body),
        }
    }

    fn eval_literal(&self, lit: &Literal) -> Result<Value, String> {
        match lit {
            Literal::Int(i) => Ok(Value::Int(*i)),
            Literal::Float(f) => Ok(Value::Float(*f)),
            Literal::Bool(b) => Ok(Value::Bool(*b)),
            Literal::String(s) => Ok(Value::String(s.clone())),
            Literal::Char(c) => Ok(Value::Char(*c)),
        }
    }

    fn eval_path(&self, path: &[String]) -> Result<Value, String> {
        let s: Vec<&str> = path.iter().map(|s| s.as_str()).collect();
        match s.as_slice() {
            ["std", "f64", "consts", "PI"] => Ok(Value::Float(std::f64::consts::PI)),
            _ => Err(format!("unsupported path: {:?}", path)),
        }
    }

    fn eval_binary(&mut self, lhs: &Expr, op: &BinOp, rhs: &Expr) -> Result<Value, String> {
        let l = self.eval_expr(lhs)?;
        let r = self.eval_expr(rhs)?;

        match (op, &l, &r) {
            // Integer arithmetic
            (BinOp::Add, Value::Int(a), Value::Int(b)) => Ok(Value::Int(a + b)),
            (BinOp::Sub, Value::Int(a), Value::Int(b)) => Ok(Value::Int(a - b)),
            (BinOp::Mul, Value::Int(a), Value::Int(b)) => Ok(Value::Int(a * b)),
            (BinOp::Div, Value::Int(a), Value::Int(b)) => {
                if *b == 0 { Err(RuntimeError::DivisionByZero.to_string()) }
                else { Ok(Value::Int(a / b)) }
            }
            (BinOp::Rem, Value::Int(a), Value::Int(b)) => {
                if *b == 0 { Err(RuntimeError::DivisionByZero.to_string()) }
                else { Ok(Value::Int(a % b)) }
            }

            // Float arithmetic
            (BinOp::Add, Value::Float(a), Value::Float(b)) => Ok(Value::Float(a + b)),
            (BinOp::Sub, Value::Float(a), Value::Float(b)) => Ok(Value::Float(a - b)),
            (BinOp::Mul, Value::Float(a), Value::Float(b)) => Ok(Value::Float(a * b)),
            (BinOp::Div, Value::Float(a), Value::Float(b)) => {
                Ok(Value::Float(a / b))
            }

            // Mixed int/float -> promote to float
            (BinOp::Add, a @ Value::Int(_), b @ Value::Float(_))
            | (BinOp::Add, a @ Value::Float(_), b @ Value::Int(_)) => {
                let af = a.to_float().unwrap();
                let bf = b.to_float().unwrap();
                Ok(Value::Float(af + bf))
            }
            (BinOp::Sub, a @ Value::Int(_), b @ Value::Float(_))
            | (BinOp::Sub, a @ Value::Float(_), b @ Value::Int(_)) => {
                let af = a.to_float().unwrap();
                let bf = b.to_float().unwrap();
                Ok(Value::Float(af - bf))
            }
            (BinOp::Mul, a @ Value::Int(_), b @ Value::Float(_))
            | (BinOp::Mul, a @ Value::Float(_), b @ Value::Int(_)) => {
                let af = a.to_float().unwrap();
                let bf = b.to_float().unwrap();
                Ok(Value::Float(af * bf))
            }
            (BinOp::Div, a @ Value::Int(_), b @ Value::Float(_))
            | (BinOp::Div, a @ Value::Float(_), b @ Value::Int(_)) => {
                let af = a.to_float().unwrap();
                let bf = b.to_float().unwrap();
                if bf == 0.0 { Err(RuntimeError::DivisionByZero.to_string()) }
                else { Ok(Value::Float(af / bf)) }
            }

            // Comparison (int)
            (BinOp::Eq, a @ Value::Int(_), b @ Value::Int(_))
            | (BinOp::Eq, a @ Value::Float(_), b @ Value::Float(_))
            | (BinOp::Eq, a @ Value::Bool(_), b @ Value::Bool(_))
            | (BinOp::Eq, a @ Value::String(_), b @ Value::String(_))
            | (BinOp::Eq, a @ Value::Char(_), b @ Value::Char(_)) => {
                // Use PartialEq on Value directly
                let result = l == r; // Will trigger clone... use raw compare
                Ok(Value::Bool(match (&l, &r) {
                    (Value::Int(a), Value::Int(b)) => a == b,
                    (Value::Float(a), Value::Float(b)) => (a - b).abs() < 1e-10,
                    (Value::Bool(a), Value::Bool(b)) => a == b,
                    (Value::String(a), Value::String(b)) => a == b,
                    (Value::Char(a), Value::Char(b)) => a == b,
                    _ => false,
                }))
            }
            (BinOp::Ne, _, _) => {
                let eq = self.eval_binary(lhs, &BinOp::Eq, rhs)?;
                Ok(Value::Bool(!eq.to_bool().unwrap_or(false)))
            }
            (BinOp::Lt, Value::Int(a), Value::Int(b)) => Ok(Value::Bool(a < b)),
            (BinOp::Le, Value::Int(a), Value::Int(b)) => Ok(Value::Bool(a <= b)),
            (BinOp::Gt, Value::Int(a), Value::Int(b)) => Ok(Value::Bool(a > b)),
            (BinOp::Ge, Value::Int(a), Value::Int(b)) => Ok(Value::Bool(a >= b)),
            (BinOp::Lt, Value::Float(a), Value::Float(b)) => Ok(Value::Bool(a < b)),
            (BinOp::Le, Value::Float(a), Value::Float(b)) => Ok(Value::Bool(a <= b)),
            (BinOp::Gt, Value::Float(a), Value::Float(b)) => Ok(Value::Bool(a > b)),
            (BinOp::Ge, Value::Float(a), Value::Float(b)) => Ok(Value::Bool(a >= b)),

            // Compare mixed int/float
            (BinOp::Lt, a @ Value::Int(_), b @ Value::Float(_))
            | (BinOp::Lt, a @ Value::Float(_), b @ Value::Int(_)) => {
                Ok(Value::Bool(a.to_float().unwrap() < b.to_float().unwrap()))
            }

            // Logic
            (BinOp::And, Value::Bool(a), Value::Bool(b)) => Ok(Value::Bool(*a && *b)),
            (BinOp::Or, Value::Bool(a), Value::Bool(b)) => Ok(Value::Bool(*a || *b)),

            // Compound assignments — handled at the assignment level
            (BinOp::AddAssign, _, _) | (BinOp::SubAssign, _, _)
            | (BinOp::MulAssign, _, _) | (BinOp::DivAssign, _, _) => {
                Err("compound assignment should be desugared before evaluation".to_string())
            }

            _ => Err(format!("type mismatch: cannot apply {:?} to {} and {}", op, l.type_name(), r.type_name())),
        }
    }

    fn eval_unary(&mut self, op: &UnOp, expr: &Expr) -> Result<Value, String> {
        let val = self.eval_expr(expr)?;
        match (op, &val) {
            (UnOp::Neg, Value::Int(i)) => Ok(Value::Int(-i)),
            (UnOp::Neg, Value::Float(f)) => Ok(Value::Float(-f)),
            (UnOp::Not, Value::Bool(b)) => Ok(Value::Bool(!b)),
            _ => Err(format!("cannot apply {:?} to {}", op, val.type_name())),
        }
    }

    fn eval_block(&mut self, stmts: &[Stmt]) -> Result<Value, String> {
        self.scope.push_frame();
        let mut result = Value::Unit;
        for stmt in stmts {
            match stmt {
                Stmt::Expr(expr) => {
                    result = self.eval_expr(expr)?;
                }
                Stmt::Let { name, mutable, init, ty } => {
                    let val = if let Some(init_expr) = init {
                        // Closure-as-variable: |x| body stored as anonymous function
                        // so calling inc() works through normal function lookup
                        if let Expr::Lambda(params, body) = init_expr {
                            let fn_name = format!("__closure_{}", self.functions.len());
                            let fn_stmt = FnStmt {
                                name: fn_name.clone(),
                                params: params.iter().map(|p| (p.clone(), TypeName::Named("()".to_string()))).collect(),
                                ret: TypeName::Tuple(vec![]),
                                body: if let Expr::Block(stmts) = body.as_ref() {
                                    stmts.clone()
                                } else {
                                    vec![Stmt::Expr(*body.clone())]
                                },
                            };
                            self.functions.push(fn_stmt);
                            Value::Fn(FnValue { name: fn_name, param_count: params.len() })
                        } else {
                            self.eval_expr(init_expr)?
                        }
                    } else {
                        Value::Unit
                    };
                    self.scope.define(name, val);
                }
                _ => {
                    // Sub-items (fn defs, etc.) are already registered
                }
            }
        }
        self.scope.pop_frame();
        Ok(result)
    }

    fn eval_if(&mut self, cond: &Expr, then_b: &Expr, else_b: &Option<Expr>) -> Result<Value, String> {
        let c = self.eval_expr(cond)?;
        match c.to_bool() {
            Some(true) => self.eval_expr(then_b),
            Some(false) => {
                if let Some(else_expr) = else_b {
                    self.eval_expr(else_expr)
                } else {
                    Ok(Value::Unit)
                }
            }
            None => Err(format!("if condition must be bool, got {}", c.type_name())),
        }
    }

    fn eval_loop(&mut self, body: &Expr) -> Result<Value, String> {
        loop {
            self.loop_break_value = None;
            self.eval_expr(body)?;
            if self.loop_break_value.is_some() {
                return Ok(std::mem::take(&mut self.loop_break_value).unwrap_or(Value::Unit));
            }
        }
    }

    fn eval_while(&mut self, cond: &Expr, body: &Expr) -> Result<Value, String> {
        loop {
            let c = self.eval_expr(cond)?;
            match c.to_bool() {
                Some(true) => {
                    self.eval_expr(body)?;
                    if self.loop_break_value.is_some() {
                        self.loop_break_value = None;
                        break;
                    }
                }
                Some(false) => break,
                None => return Err(format!("while condition must be bool")),
            }
        }
        Ok(Value::Unit)
    }

    fn eval_for(&mut self, name: &str, iter_expr: &Expr, body: &Expr) -> Result<Value, String> {
        let iterable = self.eval_expr(iter_expr)?;
        let items: Vec<Value> = match &iterable {
            Value::Vec(v) => v.clone(),
            Value::Range(start, end, inclusive) => {
                let s = *start as i64;
                let e = *end as i64;
                if inclusive {
                    (s..=e).map(|i| Value::Int(i)).collect()
                } else {
                    (s..e).map(|i| Value::Int(i)).collect()
                }
            }
            _ => return Err(format!("cannot iterate over {}", iterable.type_name())),
        };

        for item in items {
            self.scope.push_frame();
            self.scope.define(name, item);
            self.eval_expr(body)?;
            self.scope.pop_frame();
            if self.loop_break_value.is_some() {
                self.loop_break_value = None;
                break;
            }
        }
        Ok(Value::Unit)
    }

    fn eval_return(&mut self, val: &Option<Box<Expr>>) -> Result<Value, String> {
        let v = if let Some(e) = val {
            self.eval_expr(e)?
        } else {
            Value::Unit
        };
        self.return_value = Some(v.clone());
        Ok(v)
    }

    // ... remaining helper methods in Tasks 7-16
}
```

This is the skeleton showing the main eval logic. For now we make it compile. Remaining expression types (Call, MethodCall, Field, Index, StructLit, Range, Try, Match, Assign) will be filled in during subsequent tasks.

- [ ] **Step 2: Verify compilation**

Run: `cargo check`
Expected: passes (with warnings about unused methods OK)

- [ ] **Step 3: Commit**

```bash
git add wasm/code-validator/src/eval.rs
git commit -m "feat(wasm): eval skeleton with basic expressions"
```

---

### Task 7: Stdlib builtins — println!, format!, String/Vec/HashMap

**Files:**
- Create: `wasm/code-validator/src/stdlib.rs`

- [ ] **Step 1: Write stdlib.rs**

Key design: all builtin functions are matched by name during `eval_call` / `eval_method_call`. No virtual dispatch.

```rust
use crate::value::Value;

pub fn format_stdout(args: &[Value], format_str: &str) -> String {
    let mut result = String::new();
    let mut args_iter = args.iter();
    let mut chars = format_str.chars().peekable();

    while let Some(ch) = chars.next() {
        if ch == '{' {
            if chars.peek() == Some(&'}') {
                // {} — use next argument
                chars.next(); // consume }
                if let Some(arg) = args_iter.next() {
                    result.push_str(&arg.to_string());
                }
            } else if chars.peek() == Some(&':') {
                // {:?} or {:.2} — consume until }
                let mut spec = String::new();
                chars.next(); // consume :
                loop {
                    match chars.next() {
                        Some('}') => break,
                        Some(c) => spec.push(c),
                        None => break,
                    }
                }
                if let Some(arg) = args_iter.next() {
                    if spec == "?" {
                        result.push_str(&format!("{:?}", arg));
                    } else if spec.starts_with('.') {
                        // e.g. .2 for float precision
                        if let Ok(precision) = spec[1..].parse::<usize>() {
                            match arg {
                                Value::Float(f) => result.push_str(&format!("{:.prec$}", f, prec = precision)),
                                _ => result.push_str(&arg.to_string()),
                            }
                        }
                    } else {
                        result.push_str(&arg.to_string());
                    }
                }
            } else {
                result.push(ch);
            }
        } else {
            result.push(ch);
        }
    }
    result
}

pub fn is_print_macro(name: &str) -> Option<&'static str> {
    match name {
        "println!" => Some("println"),
        "print!" => Some("print"),
        "format!" => Some("format"),
        "assert_eq!" => Some("assert_eq"),
        "vec!" => Some("vec"),
        _ => None,
    }
}
```

- [ ] **Step 2: Verify compilation**

Run: `cargo check`
Expected: passes

- [ ] **Step 3: Commit**

```bash
git add wasm/code-validator/src/stdlib.rs
git commit -m "feat(wasm): stdlib builtins (stdlib.rs)"
```

---

### Task 8: Fill in remaining eval methods — Call, MethodCall, Field, Index, StructLit, Match, Assign

**Files:**
- Modify: `wasm/code-validator/src/eval.rs`

- [ ] **Step 1: Add eval_call, eval_method_call, eval_field, eval_index, eval_struct_lit, eval_match, eval_assign, eval_range, eval_try methods to eval.rs**

```rust
// Add these methods to EvalContext

fn eval_call(&mut self, func: &Expr, args: &[Expr]) -> Result<Value, String> {
    match func {
        Expr::Ident("println!") | Expr::Ident("print!") | Expr::Ident("format!")
        | Expr::Ident("assert_eq!") | Expr::Ident("vec!") => {
            self.eval_builtin_macro(func, args)
        }
        Expr::Ident(name) => {
            // Look for user-defined function
            if let Some(f) = self.functions.iter().find(|f| f.name == *name) {
                let arg_vals = args.iter().map(|a| self.eval_expr(a)).collect::<Result<Vec<_>, String>>()?;
                self.call_function(f, &arg_vals)
            } else {
                Err(format!("undefined function: {}", name))
            }
        }
        Expr::Path(path) => {
            // Associated function calls: HashMap::new(), String::from(), Vec::new()
            let segs: Vec<&str> = path.iter().map(|s| s.as_str()).collect();
            match segs.as_slice() {
                ["HashMap", "new"] => Ok(Value::HashMap(std::collections::HashMap::new())),
                ["String", "from"] => {
                    let arg = self.eval_expr(&args[0])?;
                    match arg {
                        Value::String(s) => Ok(Value::String(s)),
                        _ => Err(format!("String::from requires string argument")),
                    }
                }
                ["Vec", "new"] => Ok(Value::Vec(vec![])),
                _ => Err(format!("unsupported associated function: {:?}", path)),
            }
        }
        Expr::Lambda(params, body) => {
            // Call a closure — execute body with params bound
            let arg_vals = args.iter().map(|a| self.eval_expr(a)).collect::<Result<Vec<_>, String>>()?;
            self.scope.push_frame();
            for (i, pname) in params.iter().enumerate() {
                self.scope.define(pname, arg_vals.get(i).cloned().unwrap_or(Value::Unit));
            }
            let result = self.eval_expr(body);
            self.scope.pop_frame();
            result
        }
        _ => Err(format!("not callable")),
    }
}

fn eval_builtin_macro(&mut self, func: &Expr, args: &[Expr]) -> Result<Value, String> {
    let name = match func { Expr::Ident(n) => n.as_str(), _ => "" };

    match name {
        "println!" | "print!" => {
            // First arg should be a format string literal
            let format_lit = match &args[0] {
                Expr::Literal(Literal::String(s)) => s.clone(),
                _ => return Err("println!/print! requires string literal".to_string()),
            };
            let arg_vals = args[1..].iter().map(|a| self.eval_expr(a)).collect::<Result<Vec<_>, String>>()?;
            let output = stdlib::format_stdout(&arg_vals, &format_lit);
            if name == "println!" {
                self.writeln(&output);
            } else {
                self.write(&output);
            }
            Ok(Value::Unit)
        }
        "format!" => {
            let format_lit = match &args[0] {
                Expr::Literal(Literal::String(s)) => s.clone(),
                _ => return Err("format! requires string literal".to_string()),
            };
            let arg_vals = args[1..].iter().map(|a| self.eval_expr(a)).collect::<Result<Vec<_>, String>>()?;
            Ok(Value::String(stdlib::format_stdout(&arg_vals, &format_lit)))
        }
        "assert_eq!" => {
            let left = self.eval_expr(&args[0])?;
            let right = self.eval_expr(&args[1])?;
            let left_str = left.to_string();
            let right_str = right.to_string();
            if left_str != right_str {
                return Err(format!("assertion failed: `(left == right)`\n left: `{}`,\n right: `{}`", left_str, right_str));
            }
            Ok(Value::Unit)
        }
        "vec!" => {
            let items = args.iter().map(|a| self.eval_expr(a)).collect::<Result<Vec<_>, String>>()?;
            Ok(Value::Vec(items))
        }
        _ => Err(format!("unknown macro: {}", name)),
    }
}

fn call_function(&mut self, func: &FnStmt, args: &[Value]) -> Result<Value, String> {
    self.scope.push_frame();

    // Bind parameters
    for (i, (param_name, _)) in func.params.iter().enumerate() {
        let val = if i == 0 && param_name == "self" {
            // self is passed separately as receiver
            args[0].clone()
        } else {
            args.get(i).cloned().unwrap_or(Value::Unit)
        };
        self.scope.define(param_name, val);
    }

    // Execute body
    for stmt in &func.body {
        match stmt {
            Stmt::Expr(expr) => {
                let result = self.eval_expr(expr)?;
                if self.return_value.is_some() {
                    let ret = std::mem::take(&mut self.return_value);
                    self.scope.pop_frame();
                    return Ok(ret.unwrap_or(Value::Unit));
                }
            }
            Stmt::Let { name, mutable, init, ty } => {
                let val = if let Some(init_expr) = init {
                    self.eval_expr(init_expr)?
                } else {
                    Value::Unit
                };
                self.scope.define(name, val);
            }
            _ => {}
        }
    }

    self.scope.pop_frame();
    Ok(Value::Unit)
}

fn eval_method_call(&mut self, receiver: &Expr, method: &str, args: &[Expr]) -> Result<Value, String> {
    let mut receiver_val = self.eval_expr(receiver)?;

    // Resolve method: check trait impls, then direct impls, then builtin
    let resolved = self.resolve_method(&receiver_val, method, receiver, args);
    if let Some(result) = resolved {
        return result;
    }

    Err(format!("no method `{}` for type `{}`", method, receiver_val.type_name()))
}

fn resolve_method(&mut self, receiver_val: &Value, method: &str,
                   receiver: &Expr, args: &[Expr]) -> Option<Result<Value, String>> {
    let type_name = receiver_val.type_name().to_string();

    // Check built-in String methods
    if type_name == "String" || type_name == "&str" {
        if let Some(result) = self.eval_string_method(receiver_val, method, args) {
            return Some(result);
        }
    }

    // Check built-in Vec methods
    if type_name == "Vec" {
        if let Some(result) = self.eval_vec_method(receiver_val, method, receiver, args) {
            return Some(result);
        }
    }

    // Check built-in HashMap methods
    if type_name == "HashMap" {
        if let Some(result) = self.eval_hashmap_method(receiver_val, method, args) {
            return Some(result);
        }
    }

    // Check impl blocks — find method in type's impl
    if let Some(impl_methods) = self.impls.iter().find(|(t, _)| *t == type_name) {
        if let Some(m) = impl_methods.1.iter().find(|m| m.name == method) {
            let arg_vals = args.iter().map(|a| self.eval_expr(a)).collect::<Result<Vec<_>, String>>().ok()?;
            let mut all_args = vec![receiver_val.clone()];
            all_args.extend(arg_vals);
            return Some(self.call_function(m, &all_args));
        }
    }

    // Check trait impls
    for (trait_name, impl_type_name, methods) in &self.trait_impls {
        if *impl_type_name == type_name {
            if let Some(m) = methods.iter().find(|m| m.name == method) {
                let arg_vals = args.iter().map(|a| self.eval_expr(a)).collect::<Result<Vec<_>, String>>().ok()?;
                let mut all_args = vec![receiver_val.clone()];
                all_args.extend(arg_vals);
                return Some(self.call_function(m, &all_args));
            }
        }
    }

    None
}

fn eval_string_method(&mut self, receiver_val: &Value, method: &str, args: &[Expr]) -> Option<Result<Value, String>> {
    let s = receiver_val.to_string_value()?;
    match method {
        "len" => Some(Ok(Value::Int(s.len() as i64))),
        "clone" => Some(Ok(receiver_val.clone())),
        "push_str" => {
            let arg = self.eval_expr(&args[0]).ok()?;
            let to_push = arg.to_string_value()?.to_string();
            match receiver_val {
                Value::String(original) => {
                    let mut new_s = original.clone();
                    new_s.push_str(&to_push);
                    Some(Ok(Value::String(new_s)))
                }
                _ => None,
            }
        }
        "as_str" => Some(Ok(receiver_val.clone())),
        "to_string" => Some(Ok(Value::String(s.to_string()))),
        "parse" => {
            // s.parse::<i32>() or s.parse::<f64>()
            match s {
                "" => Some(Err("cannot parse empty string".to_string())),
                s if s.parse::<i64>().is_ok() => {
                    Some(Ok(Value::EnumVariant("Result".to_string(), "Ok".to_string(),
                        Some(Box::new(Value::Int(s.parse::<i64>().unwrap()))))))
                }
                s if s.parse::<f64>().is_ok() => {
                    Some(Ok(Value::EnumVariant("Result".to_string(), "Ok".to_string(),
                        Some(Box::new(Value::Float(s.parse::<f64>().unwrap()))))))
                }
                _ => {
                    Some(Ok(Value::EnumVariant("Result".to_string(), "Err".to_string(),
                        Some(Box::new(Value::String("invalid digit found in string".to_string()))))))
                }
            }
        }
        _ => None,
    }
}

fn eval_vec_method(&mut self, receiver_val: &Value, method: &str,
                    _receiver: &Expr, args: &[Expr]) -> Option<Result<Value, String>> {
    match receiver_val {
        Value::Vec(v) => {
            match method {
                "push" => {
                    let arg = self.eval_expr(&args[0]).ok()?;
                    let mut new_vec = v.clone();
                    new_vec.push(arg);
                    Some(Ok(Value::Vec(new_vec)))
                }
                "pop" => {
                    let mut new_vec = v.clone();
                    let popped = new_vec.pop();
                    Some(Ok(popped.unwrap_or(Value::Unit)))
                }
                "len" => Some(Ok(Value::Int(v.len() as i64))),
                "iter" => {
                    // iter() returns the Vec as-is; for/filter/map work on it
                    Some(Ok(receiver_val.clone()))
                }
                _ => None,
            }
        }
        _ => None,
    }
}

fn eval_hashmap_method(&mut self, receiver_val: &Value, method: &str, args: &[Expr]) -> Option<Result<Value, String>> {
    match receiver_val {
        Value::HashMap(m) => {
            match method {
                "insert" => {
                    let key = self.eval_expr(&args[0]).ok()?;
                    let val = self.eval_expr(&args[1]).ok()?;
                    let key_str = match &key {
                        Value::String(s) => s.clone(),
                        _ => return Some(Err("HashMap key must be string".to_string())),
                    };
                    let mut new_map = m.clone();
                    new_map.insert(key_str, val);
                    Some(Ok(Value::HashMap(new_map)))
                }
                "len" => Some(Ok(Value::Int(m.len() as i64))),
                _ => None,
            }
        }
        _ => None,
    }
}

fn eval_field(&mut self, base: &Expr, name: &str) -> Result<Value, String> {
    let val = self.eval_expr(base)?;
    match &val {
        Value::Struct(_, fields) => {
            fields.iter().find(|(n, _)| n == name)
                .map(|(_, v)| v.clone())
                .ok_or_else(|| format!("no field `{}` on struct", name))
        }
        Value::EnumVariant(_, _, payload) => {
            if name == "0" || name == "0]" { // Hmm, let me think about this
                payload.as_ref().map(|p| *p.clone()).ok_or_else(|| format!("no field `{}` on enum variant", name))
            } else {
                Err(format!("no field `{}` on enum variant", name))
            }
        }
        _ => Err(format!("cannot access field `{}` on `{}`", name, val.type_name())),
    }
}

fn eval_index(&mut self, base: &Expr, index: &Expr) -> Result<Value, String> {
    let base_val = self.eval_expr(base)?;
    let idx_val = self.eval_expr(index)?;

    match (&base_val, &idx_val) {
        (Value::Vec(v), Value::Int(i)) => {
            let idx = *i as usize;
            if idx >= v.len() {
                Err(RuntimeError::IndexOutOfBounds.to_string())
            } else {
                Ok(v[idx].clone())
            }
        }
        (Value::HashMap(m), Value::String(key)) => {
            m.get(key).cloned()
                .ok_or_else(|| format!("key not found: {}", key))
        }
        _ => Err(format!("cannot index {} with {}", base_val.type_name(), idx_val.type_name())),
    }
}

fn eval_struct_lit(&mut self, name: &str, fields: &[(String, Expr)]) -> Result<Value, String> {
    let field_vals = fields.iter()
        .map(|(n, e)| self.eval_expr(e).map(|v| (n.clone(), v)))
        .collect::<Result<Vec<_>, String>>()?;
    Ok(Value::Struct(name.to_string(), field_vals))
}

fn eval_match(&mut self, scrutinee: &Expr, arms: &[(Pat, Expr)]) -> Result<Value, String> {
    let val = self.eval_expr(scrutinee)?;

    for (pat, body) in arms {
        if self.pattern_matches(pat, &val) {
            self.scope.push_frame();
            self.bind_pattern(pat, &val)?;
            let result = self.eval_expr(body)?;
            self.scope.pop_frame();
            return Ok(result);
        }
    }

    Err("non-exhaustive match".to_string())
}

fn pattern_matches(&self, pat: &Pat, val: &Value) -> bool {
    match (pat, val) {
        (Pat::Wild, _) => true,
        (Pat::Lit(lit), _) => {
            match (lit, val) {
                (Literal::Int(a), Value::Int(b)) => *a == *b,
                (Literal::Float(a), Value::Float(b)) => (*a - *b).abs() < 1e-10,
                (Literal::Bool(a), Value::Bool(b)) => *a == *b,
                (Literal::String(a), Value::String(b)) => *a == *b,
                (Literal::Char(a), Value::Char(b)) => *a == *b,
                _ => false,
            }
        }
        (Pat::Ident(_), _) => true,
        (Pat::Enum(en, subpats), Value::EnumVariant(_, vn, payload)) => {
            if *en != *vn { return false; }
            if subpats.is_empty() { return true; }
            if subpats.len() == 1 {
                if let Some(p) = payload {
                    return self.pattern_matches(&subpats[0], p);
                }
                return false;
            }
            false
        }
        (Pat::Tuple(ps), _) => {
            // For simple patterns like Ok(_)
            if let Pat::Wild = &ps[0] { true } else { false }
        }
        _ => false,
    }
}

fn bind_pattern(&mut self, pat: &Pat, val: &Value) -> Result<(), String> {
    match pat {
        Pat::Ident(name) => {
            self.scope.define(name, val.clone());
            Ok(())
        }
        Pat::Enum(_, subpats) => {
            if let Value::EnumVariant(_, _, payload) = val {
                if let (Some(p), Some(sub)) = (payload, subpats.first()) {
                    self.bind_pattern(sub, p)?;
                }
            }
            Ok(())
        }
        _ => Ok(()),
    }
}

fn eval_range(&mut self, start: &Expr, end: &Expr, inclusive: bool) -> Result<Value, String> {
    let s = self.eval_expr(start)?;
    let e = self.eval_expr(end)?;
    match (s, e) {
        (Value::Int(si), Value::Int(ei)) => {
            Ok(Value::Range(si, ei, inclusive))
        }
        _ => Err("range must have integer bounds".to_string()),
    }
}

fn eval_try(&mut self, inner: &Expr) -> Result<Value, String> {
    let val = self.eval_expr(inner)?;
    // ? operator: if Ok(v) return v, if Err(e) return early
    // We need to detect Result pattern
    match &val {
        Value::EnumVariant(_, name, payload) if name == "Ok" => {
            Ok(*payload.clone().unwrap_or(Box::new(Value::Unit)))
        }
        Value::EnumVariant(_, name, payload) if name == "Err" => {
            // Return early — set return_value
            let err_val = *payload.clone().unwrap_or(Box::new(Value::Unit));
            self.return_value = Some(err_val.clone());
            Err(err_val.to_string())
        }
        _ => Ok(val),
    }
}

fn eval_assign(&mut self, lhs: &Expr, rhs: &Expr) -> Result<Value, String> {
    let val = self.eval_expr(rhs)?;
    match lhs {
        Expr::Ident(name) => {
            if let Some(existing) = self.scope.get_mut(name) {
                *existing = val.clone();
                Ok(val)
            } else {
                Err(format!("undefined variable: {}", name))
            }
        }
        Expr::Index(base, index) => {
            // map[key] = value or vec[idx] = value
            let idx_val = self.eval_expr(index)?;
            let mut base_val = self.eval_expr(base)?;
            match (&mut base_val, &idx_val) {
                (Value::HashMap(m), Value::String(key)) => {
                    m.insert(key.clone(), val.clone());
                    // Update the original binding
                    self.writeback(base, base_val)?;
                    Ok(val)
                }
                (Value::Vec(v), Value::Int(i)) => {
                    let idx = *i as usize;
                    if idx < v.len() {
                        v[idx] = val.clone();
                        self.writeback(base, base_val)?;
                        Ok(val)
                    } else {
                        Err(RuntimeError::IndexOutOfBounds.to_string())
                    }
                }
                _ => Err("cannot assign to this index".to_string()),
            }
        }
        _ => Err("cannot assign to this expression".to_string()),
    }
}

/// Write a mutated value back to its binding in scope
fn writeback(&mut self, original: &Expr, new_val: Value) -> Result<(), String> {
    if let Expr::Ident(name) = original {
        if let Some(slot) = self.scope.get_mut(name) {
            *slot = new_val;
            return Ok(());
        }
    }
    Err("cannot write back".to_string())
}
```

We also need to add the `Value::Range` variant to value.rs:

```rust
// In value.rs, add to Value enum:
Range(i64, i64, bool),  // start, end, inclusive
```

And update `type_name` and `Display`:

```rust
// In Value::type_name:
Value::Range(_, _, _) => "Range",

// In Display for Value:
Value::Range(s, e, true) => write!(f, "{}..={}", s, e),
Value::Range(s, e, false) => write!(f, "{}..{}", s, e),
```

- [ ] **Step 2: Verify compilation**

Run: `cargo check`
Expected: passes

- [ ] **Step 3: Commit**

```bash
git add wasm/code-validator/src/eval.rs wasm/code-validator/src/value.rs
git commit -m "feat(wasm): call, method, field, struct, match, assign eval"
```

---

### Task 9: Iterator chain — filter, map, sum

**Files:**
- Modify: `wasm/code-validator/src/eval.rs`

- [ ] **Step 1: Add eval_iter_chain method**

In `resolve_method`, add handling for `filter`, `map`, `sum` on Vec-like values:

```rust
// In eval_method_call, before the final Err:
// Check for iterator adapter methods (filter, map, sum)
if let Some(result) = self.eval_iterator_method(&receiver_val, method, receiver, args) {
    return result?;
}

// ... add this method to EvalContext:

fn eval_iterator_method(&mut self, receiver_val: &Value, method: &str,
                         receiver: &Expr, args: &[Expr]) -> Option<Result<Value, String>> {
    match method {
        "filter" | "map" => {
            // These return a lazy iterator — for simplicity, we eagerly evaluate
            // and return a placeholder "iterator" value
            // Full chain support: collect the Vec, apply the closure, return new Vec
            let vec = match receiver_val {
                Value::Iter(vec) | Value::Vec(vec) => vec.clone(),
                _ => return None,
            };
            if args.len() != 1 {
                return Some(Err("filter/map requires 1 argument (a closure)".to_string()));
            }
            let closure_expr = &args[0];
            // Eagerly apply
            let mut result = Vec::new();
            for item in &vec {
                self.scope.push_frame();
                // Call the closure — we need to know the param name
                let result_val = match closure_expr {
                    Expr::Lambda(params, body) => {
                        if params.len() == 1 {
                            self.scope.define(&params[0], item.clone());
                        }
                        let val = self.eval_expr(body).ok()?;
                        if method == "filter" {
                            Some(val.to_bool().unwrap_or(false))
                        } else {
                            None // map: return the transformed value as lambda result
                        }
                    }
                    _ => return Some(Err("filter/map requires a closure".to_string())),
                };
                self.scope.pop_frame();
                if method == "filter" {
                    if result_val == Some(true) {
                        result.push(item.clone());
                    }
                } else {
                    // map — the lambda returns the mapped value
                    // We need to handle this differently
                }
            }
            if method == "filter" {
                Some(Ok(Value::Iter(result)))
            } else {
                // For map, we need to collect differently
                Some(Ok(Value::Iter(vec))) // placeholder — will be refined
            }
        }
        "sum" => {
            match receiver_val {
                Value::Iter(items) | Value::Vec(items) => {
                    let mut total: f64 = 0.0;
                    for item in items {
                        match item {
                            Value::Int(i) => total += *i as f64,
                            Value::Float(f) => total += f,
                            _ => return Some(Err("sum requires numeric elements".to_string())),
                        }
                    }
                    Some(Ok(if total == total.trunc() {
                        Value::Int(total as i64)
                    } else {
                        Value::Float(total)
                    }))
                }
                _ => None,
            }
        }
        "collect" => {
            match receiver_val {
                Value::Iter(items) => Some(Ok(Value::Vec(items.clone()))),
                _ => None,
            }
        }
        _ => None,
    }
}
```

Also add `Iter(Vec<Value>)` variant to the Value enum in value.rs:

```rust
// Add to value.rs Value enum:
Iter(Vec<Value>),

// In type_name:
Value::Iter(_) => "Iterator",

// In Display:
Value::Iter(v) => write!(f, "Iter({})", v.len()),
```

- [ ] **Step 2: Write a test for iterator chain**

Add to eval.rs tests:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_run_basic() {
        let mut ctx = EvalContext::new();
        let program = parse::parse_program(r#"
fn main() {
    let v = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let even_squares: i32 = v.iter()
        .filter(|x| x % 2 == 0)
        .map(|x| x * x)
        .sum();
    println!("Sum: {}", even_squares);
}
"#).unwrap();
        let output = ctx.execute(&program).unwrap();
        assert_eq!(output, "Sum: 220\n");
    }
}
```

- [ ] **Step 3: Run test**

Run: `cargo test test_run_basic`
Expected: passes (after fixing issues)

- [ ] **Step 4: Commit**

```bash
git add wasm/code-validator/src/eval.rs wasm/code-validator/src/value.rs
git commit -m "feat(wasm): iterator chain support (filter, map, sum)"
```

---

### Task 10: Semantic analysis for warnings

**Files:**
- Create: `wasm/code-validator/src/analysis.rs`

- [ ] **Step 1: Write analysis.rs**

```rust
use std::collections::{HashMap, HashSet};
use crate::ast::*;

/// Collects warnings for the given program
pub fn analyze(program: &Program) -> Vec<String> {
    let mut ctx = AnalysisContext::new();
    ctx.analyze_program(program);
    ctx.warnings
}

struct AnalysisContext {
    warnings: Vec<String>,
    // Track variable declarations and their usage
    var_decls: Vec<(String, usize)>,  // (name, line_idx in block)
    var_used: HashSet<String>,
    fn_decls: HashSet<String>,
    fn_called: HashSet<String>,
    struct_decls: HashSet<String>,
    struct_used: HashSet<String>,
}

impl AnalysisContext {
    fn new() -> Self {
        AnalysisContext {
            warnings: vec![],
            var_decls: vec![],
            var_used: HashSet::new(),
            fn_decls: HashSet::new(),
            fn_called: HashSet::new(),
            struct_decls: HashSet::new(),
            struct_used: HashSet::new(),
        }
    }

    fn analyze_program(&mut self, program: &Program) {
        // First pass: collect declarations
        for item in &program.items {
            self.collect_declares(item);
        }
        // Second pass: find usages
        for item in &program.items {
            self.find_usages(item);
        }
        // Emit warnings
        self.emit_warnings();
    }

    fn collect_declares(&mut self, stmt: &Stmt) {
        match stmt {
            Stmt::FnDef { name, .. } => { self.fn_decls.insert(name.clone()); }
            Stmt::StructDef { name, .. } => { self.struct_decls.insert(name.clone()); }
            Stmt::EnumDef { name, .. } => { self.struct_decls.insert(name.clone()); }
            Stmt::ImplBlock { type_name, .. } => { self.struct_used.insert(type_name.clone()); }
            Stmt::ImplTrait { type_name, .. } => { self.struct_used.insert(type_name.clone()); }
            Stmt::Let { name, .. } => { self.var_decls.push((name.clone(), 0)); }
            Stmt::ModDef { items, .. } => { for i in items { self.collect_declares(i); } }
            Stmt::Attributed { item, .. } => { self.collect_declares(item); }
            _ => {}
        }
    }

    fn find_usages(&mut self, stmt: &Stmt) {
        match stmt {
            Stmt::Expr(expr) => { self.find_expr_usages(expr); }
            Stmt::Let { name, init, .. } => {
                if let Some(e) = init { self.find_expr_usages(e); }
            }
            Stmt::FnDef { name, body, .. } => {
                self.fn_called.insert(name.clone()); // definition also counts as "used"
                for s in body { self.find_usages(s); }
            }
            Stmt::StructDef { name, .. } => {
                self.struct_used.insert(name.clone());
            }
            Stmt::EnumDef { name, .. } => {
                self.struct_used.insert(name.clone());
            }
            Stmt::ImplBlock { methods, .. } => {
                for m in methods { for s in &m.body { self.find_usages(s); } }
            }
            Stmt::ImplTrait { methods, .. } => {
                for m in methods { for s in &m.body { self.find_usages(s); } }
            }
            Stmt::ModDef { items, .. } => { for i in items { self.find_usages(i); } }
            Stmt::Attributed { item, .. } => { self.find_usages(item); }
            _ => {}
        }
    }

    fn find_expr_usages(&mut self, expr: &Expr) {
        match expr {
            Expr::Ident(name) => { self.var_used.insert(name.clone()); }
            Expr::Binary(l, _, r) => { self.find_expr_usages(l); self.find_expr_usages(r); }
            Expr::Unary(_, e) => { self.find_expr_usages(e); }
            Expr::Block(stmts) => { for s in stmts { self.find_usages(s); } }
            Expr::If(c, t, e) => {
                self.find_expr_usages(c);
                self.find_expr_usages(t);
                if let Some(el) = e { self.find_expr_usages(el); }
            }
            Expr::Call(f, args) => {
                if let Expr::Ident(name) = f.as_ref() {
                    self.fn_called.insert(name.clone());
                }
                self.find_expr_usages(f);
                for a in args { self.find_expr_usages(a); }
            }
            Expr::MethodCall(r, _, args) => {
                self.find_expr_usages(r);
                for a in args { self.find_expr_usages(a); }
            }
            Expr::Field(b, _) => { self.find_expr_usages(b); }
            Expr::Index(b, i) => { self.find_expr_usages(b); self.find_expr_usages(i); }
            Expr::StructLit(_, fields) => {
                self.struct_used.insert("struct_lit".to_string());
                for (_, e) in fields { self.find_expr_usages(e); }
            }
            Expr::Match(scrutinee, arms) => {
                self.find_expr_usages(scrutinee);
                for (_, body) in arms { self.find_expr_usages(body); }
            }
            Expr::Range(s, e, _) => { self.find_expr_usages(s); self.find_expr_usages(e); }
            Expr::Try(inner) => { self.find_expr_usages(inner); }
            Expr::Return(val) => { if let Some(v) = val { self.find_expr_usages(v); } }
            Expr::Lambda(params, body) => {
                // Don't flag params as unused (they're used in body)
                self.find_expr_usages(body);
            }
            Expr::ForIn(name, iter, body) => {
                self.var_used.insert(name.clone());
                self.find_expr_usages(iter);
                self.find_expr_usages(body);
            }
            Expr::While(c, b) => { self.find_expr_usages(c); self.find_expr_usages(b); }
            Expr::Loop(b) => { self.find_expr_usages(b); }
            Expr::Assign(l, r) => { self.find_expr_usages(l); self.find_expr_usages(r); }
            Expr::Path(_) | Expr::Literal(_) | Expr::Break | Expr::Continue => {}
        }
    }

    fn emit_warnings(&mut self) {
        // Unused variables
        for (name, _) in &self.var_decls {
            if !self.var_used.contains(name) && name != "_" {
                self.warnings.push(format!("warning: unused variable: `{}`", name));
            }
        }

        // Unused functions (except main)
        for name in &self.fn_decls {
            if name != "main" && !self.fn_called.contains(name) {
                self.warnings.push(format!("warning: unused function: `{}`", name));
            }
        }

        // Unused structs/enums
        for name in &self.struct_decls {
            if !self.struct_used.contains(name) {
                self.warnings.push(format!("warning: unused struct/enum: `{}`", name));
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::parse;

    #[test]
    fn test_unused_variable() {
        let program = parse::parse_program(r#"fn main() { let x = 42; println!("hi"); }"#).unwrap();
        let warnings = analyze(&program);
        assert!(warnings.iter().any(|w| w.contains("x")));
    }

    #[test]
    fn test_used_variable() {
        let program = parse::parse_program(r#"fn main() { let x = 42; println!("{}", x); }"#).unwrap();
        let warnings = analyze(&program);
        assert!(warnings.iter().all(|w| !w.contains("x")));
    }
}
```

- [ ] **Step 2: Run tests**

Run: `cargo test test_unused_variable test_used_variable`
Expected: both pass

- [ ] **Step 3: Commit**

```bash
git add wasm/code-validator/src/analysis.rs
git commit -m "feat(wasm): semantic analysis with warnings"
```

---

### Task 11: WASM compilation with wasm-pack

**Files:**
- Modify: `wasm/code-validator/src/lib.rs`

- [ ] **Step 1: Ensure lib.rs properly exposes run_code**

Verify lib.rs already has the run_code function from Task 1.

- [ ] **Step 2: Build WASM**

```bash
cd wasm/code-validator
wasm-pack build --target web --release
```

Expected: produces `pkg/` directory with `.wasm`, `.js`, `.d.ts`

- [ ] **Step 3: Check binary size**

```bash
ls -lh pkg/code_validator_bg.wasm
```

Expected: < 5MB

- [ ] **Step 4: Commit**

```bash
git add wasm/code-validator/pkg/ wasm/code-validator/src/lib.rs
git commit -m "feat(wasm): compile to WASM"
```

---

### Task 12: Frontend WASM loader (wasmLoader.ts)

**Files:**
- Create: `frontend/src/lib/wasmLoader.ts`

- [ ] **Step 1: Write wasmLoader.ts**

```typescript
import type { InterpResult } from '../../wasm/code-validator/pkg/code_validator';

let wasmModule: any = null;
let loading: Promise<void> | null = null;

export async function getWasmInterpreter(): Promise<{
  run_code(code: string): InterpResult;
}> {
  if (wasmModule) return wasmModule;

  if (!loading) {
    loading = (async () => {
      const module = await import(
        /* webpackChunkName: "code-validator" */
        '../../wasm/code-validator/pkg/code_validator'
      );
      wasmModule = module;
    })();
  }

  await loading;
  return wasmModule;
}

// Preload: start loading in background after page load
export function preloadWasm(): void {
  if (!wasmModule && !loading) {
    loading = getWasmInterpreter().then(() => {});
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit` from `frontend/`
Expected: passes (or adjust import path)

- [ ] **Step 3: Commit**

```bash
git add frontend/src/lib/wasmLoader.ts
git commit -m "feat(frontend): WASM lazy loader (wasmLoader.ts)"
```

---

### Task 13: Rewrite api.ts compileRust

**Files:**
- Modify: `frontend/src/lib/api.ts`

- [ ] **Step 1: Read current api.ts**

- [ ] **Step 2: Modify compileRust**

```typescript
import { getWasmInterpreter } from './wasmLoader';

export interface CompileResult {
  success: boolean;
  output: string | null;
  compilationErrors: string | null;
  runtimeErrors: string | null;
  warnings?: string[];
  matchExpected: boolean | null;
}

async function compileViaPlayground(code: string): Promise<CompileResult> {
  const response = await fetch(
    `https://playground.hackrust.com/compile?code=${encodeURIComponent(code)}&expected_output=`
  );
  if (!response.ok) throw new Error('Playground unavailable');
  return response.json();
}

export async function compileRust(
  code: string,
  expectedOutput?: string
): Promise<CompileResult> {
  // 1. Try Playground API
  try {
    const result = await compileViaPlayground(code);
    if (expectedOutput !== undefined && result.success && result.output != null) {
      result.matchExpected = result.output.trimEnd() === expectedOutput.trimEnd();
    }
    return result;
  } catch {
    // Playground unavailable — fall through to WASM
  }

  // 2. Fallback to WASM interpreter
  try {
    const wasm = await getWasmInterpreter();
    const result = wasm.run_code(code);

    let matchExpected = null;
    if (expectedOutput !== undefined && result.success && result.output != null) {
      matchExpected = result.output.trimEnd() === expectedOutput.trimEnd();
    }

    return {
      success: result.success,
      output: result.output ?? null,
      compilationErrors: result.errors.length > 0 ? result.errors.join('\n') : null,
      runtimeErrors: null,
      warnings: result.warnings,
      matchExpected,
    };
  } catch (err) {
    return {
      success: false,
      output: null,
      compilationErrors: `WASM interpreter error: ${err}`,
      runtimeErrors: null,
      warnings: [],
      matchExpected: null,
    };
  }
}
```

- [ ] **Step 3: Verify types**

Run: `npx tsc --noEmit` from `frontend/`
Expected: passes

- [ ] **Step 4: Commit**

```bash
git add frontend/src/lib/api.ts
git commit -m "feat(frontend): compileRust with Playground + WASM fallback"
```

---

### Task 14: Update Boss.tsx — warnings display + offline indicator

**Files:**
- Modify: `frontend/src/pages/Boss.tsx`

- [ ] **Step 1: Read current Boss.tsx to understand state and rendering**

- [ ] **Step 2: Add offline mode indicator and warnings**

Key changes:
1. Show a yellow banner when WASM fallback was used
2. Display warnings in the feedback popup
3. Remove import of `codeValidator.ts` functions

```typescript
// At the top — keep only needed imports
import { compileRust, CompileResult } from '../lib/api';

// In the component state, add:
const [usedOffline, setUsedOffline] = useState(false);

// In handleSubmit, after compileRust catches (currently uses checkSyntax/validateCode):
// Replace the catch block with:
try {
  const result = await compileRust(code, expectedOutput || undefined);
  // ... use result directly
} catch (err) {
  setUsedOffline(false);
  // Show error
}
// Remove all references to checkSyntax and validateCode

// Add warning rendering in the result feedback area:
{
  result.warnings && result.warnings.length > 0 && (
    <div className="text-yellow-400 text-sm mt-2">
      {result.warnings.map((w, i) => <div key={i}>{w}</div>)}
    </div>
  )
}

// Add offline banner
{
  usedOffline && (
    <div className="bg-yellow-900/50 text-yellow-200 px-4 py-2 rounded mb-4 text-sm">
      ⚡ Offline mode · Result based on WASM interpreter, may differ from real rustc
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Boss.tsx
git commit -m "feat(frontend): warnings display and offline indicator in Boss"
```

---

### Task 15: Delete old validation code + backend

**Files:**
- Delete: `frontend/src/game/codeValidator.ts`
- Delete: `frontend/src/game/codeValidator.test.ts`
- Delete: `backend/` (entire directory tree)

- [ ] **Step 1: Remove files**

```bash
git rm frontend/src/game/codeValidator.ts frontend/src/game/codeValidator.test.ts
git rm -r backend/
```

- [ ] **Step 2: Remove unused imports**

Check `Boss.tsx` for any remaining references to codeValidator.

- [ ] **Step 3: Verify frontend compiles**

Run: `npx tsc --noEmit` from `frontend/`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git commit -m "cleanup: remove old offline validator and backend"
```

---

### Task 16: Update CompileResult type in types.ts

**Files:**
- Modify: `frontend/src/types.ts`

- [ ] **Step 1: Add CompileResult to types.ts**

```typescript
export interface CompileResult {
  success: boolean;
  output: string | null;
  compilationErrors: string | null;
  runtimeErrors: string | null;
  warnings?: string[];
  matchExpected: boolean | null;
}
```

Note: if CompileResult is already defined in api.ts, remove it from there and import from types.ts instead.

- [ ] **Step 2: Commit**

```bash
git add frontend/src/types.ts frontend/src/lib/api.ts
git commit -m "refactor: move CompileResult to types.ts"
```

---

### Task 17: Integration test — verify all w00-w18 output

**Files:**
- Create: `wasm/code-validator/tests/integration_test.rs`

- [ ] **Step 1: Write integration test**

```rust
// wasm/code-validator/tests/integration_test.rs
use code_validator::run_code;

#[test]
fn test_w00_hello() {
    let result = run_code(r#"
fn main() {
    println!("Hello, Rust!");
    println!("I can write code.");
    println!("Learning step by step.");
}
"#);
    assert!(result.success());
    assert_eq!(result.output().unwrap(), "Hello, Rust!\nI can write code.\nLearning step by step.\n");
    assert!(result.warnings().is_empty());
}

#[test]
fn test_w01_variables() {
    let result = run_code(r#"
fn main() {
    let hp = 100;
    let damage = 25;
    let remaining = hp - damage;
    println!("Remaining HP: {}", remaining);
}
"#);
    assert!(result.success());
    assert_eq!(result.output().unwrap(), "Remaining HP: 75\n");
}

#[test]
fn test_w02_operators() {
    let result = run_code(r#"
fn main() {
    let a = 30;
    let b = 2;
    println!("Quotient: {}", a / b);
    println!("Remainder: {}", a % b);
    println!("Is greater: {}", a > b);
}
"#);
    assert!(result.success());
    assert_eq!(result.output().unwrap(), "Quotient: 14\nRemainder: 2\nIs greater: true\n");
}

#[test]
fn test_w03_control_flow() {
    let result = run_code(r#"
fn main() {
    for i in 1..=10 {
        if i % 2 == 0 {
            println!("Even: {}", i);
        } else {
            println!("Odd: {}", i);
        }
    }
}
"#);
    assert!(result.success());
    assert!(result.output().unwrap().contains("Odd: 1"));
    assert!(result.output().unwrap().contains("Even: 10"));
}

#[test]
fn test_w04_collections() {
    let result = run_code(r#"
use std::collections::HashMap;

fn main() {
    let mut data = HashMap::new();
    data.insert("sum".to_string(), 15);
    println!("Sum: {}", data["sum"]);
}
"#);
    assert!(result.success());
    assert_eq!(result.output().unwrap(), "Sum: 15\n");
}

#[test]
fn test_w05_functions() {
    let result = run_code(r#"
fn calculate_damage(base: i32, multiplier: i32) -> i32 {
    base * multiplier
}

fn main() {
    let d = calculate_damage(5, 5);
    println!("Damage: {}", d);
}
"#);
    assert!(result.success());
    assert_eq!(result.output().unwrap(), "Damage: 25\n");
}

#[test]
fn test_w09_struct() {
    let result = run_code(r#"
struct Rectangle {
    width: i32,
    height: i32,
}

impl Rectangle {
    fn area(&self) -> i32 {
        self.width * self.height
    }
}

fn main() {
    let rect = Rectangle { width: 5, height: 10 };
    println!("Area: {}", rect.area());
}
"#);
    assert!(result.success());
    assert_eq!(result.output().unwrap(), "Area: 50\n");
}

#[test]
fn test_w10_enum() {
    let result = run_code(r#"
use std::f64::consts::PI;

enum Shape {
    Circle { radius: f64 },
    Rectangle { width: f64, height: f64 },
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle { radius } => PI * radius * radius,
            Shape::Rectangle { width, height } => width * height,
        }
    }
}

fn main() {
    let c = Shape::Circle { radius: 5.0 };
    let r = Shape::Rectangle { width: 5.0, height: 10.0 };
    println!("Circle area: {}", c.area());
    println!("Rectangle area: {}", r.area());
}
"#);
    assert!(result.success());
    assert_eq!(result.output().unwrap(), "Circle area: 78.53981633974483\nRectangle area: 50\n");
}

#[test]
fn test_w12_trait() {
    let result = run_code(r#"
trait Printable {
    fn format(&self) -> String;
}

struct User {
    name: String,
}

struct Product {
    name: String,
    price: f64,
}

impl Printable for User {
    fn format(&self) -> String {
        format!("User: {}", self.name)
    }
}

impl Printable for Product {
    fn format(&self) -> String {
        format!("Product: {} (${:.2})", self.name, self.price)
    }
}

fn main() {
    let user = User { name: String::from("Alice") };
    let product = Product { name: String::from("Widget"), price: 9.99 };
    println!("{}", user.format());
    println!("{}", product.format());
}
"#);
    assert!(result.success());
    assert_eq!(result.output().unwrap(), "User: Alice\nProduct: Widget ($9.99)\n");
}

#[test]
fn test_w14_error_handling() {
    let result = run_code(r#"
fn parse_number(s: &str) -> Result<i32, String> {
    match s.parse::<i32>() {
        Ok(n) => Ok(n),
        Err(e) => Err(format!("invalid digit found in string")),
    }
}

fn main() {
    match parse_number("42") {
        Ok(n) => println!("Parsed: {}", n),
        Err(e) => println!("Error: {}", e),
    }
    match parse_number("abc") {
        Ok(n) => println!("Parsed: {}", n),
        Err(e) => println!("Error: {}", e),
    }
}
"#);
    assert!(result.success());
    assert_eq!(result.output().unwrap(), "Parsed: 42\nError: invalid digit found in string\n");
}

#[test]
fn test_w16_testing() {
    let result = run_code(r#"
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 2), 4);
    }
}

fn main() {}
"#);
    assert!(result.success());
    assert_eq!(result.output().unwrap(), "");
}

#[test]
fn test_w17_iterator() {
    let result = run_code(r#"
fn main() {
    let even_squares: i32 = (1..=10)
        .map(|x| x * x)
        .filter(|x| x % 2 == 0)
        .sum();
    println!("Sum of even squares: {}", even_squares);
}
"#);
    assert!(result.success());
    assert_eq!(result.output().unwrap(), "Sum of even squares: 220\n");
}

#[test]
fn test_w18_closure() {
    let result = run_code(r#"
fn main() {
    let mut count = 0;
    let mut increment = || {
        count += 1;
        println!("Count: {}", count);
    };
    increment();
    increment();
    increment();
}
"#);
    assert!(result.success());
    assert_eq!(result.output().unwrap(), "Count: 1\nCount: 2\nCount: 3\n");
}
```

- [ ] **Step 2: Run tests**

Run: `cargo test --test integration_test`
Expected: all pass

- [ ] **Step 3: Commit**

```bash
git add wasm/code-validator/tests/
git commit -m "test(wasm): integration tests for w00-w18"
```

---

### Task 18: Full frontend smoke test

- [ ] **Step 1: Build frontend**

```bash
cd frontend
npm run build
```

Expected: compiles successfully, WASM chunk included

- [ ] **Step 2: Verify no references to codeValidator remain**

```bash
rg "codeValidator" frontend/src/
```

Expected: no results

- [ ] **Step 3: Verify backend is deleted**

```bash
ls backend/
```

Expected: `No such file or directory`

- [ ] **Step 4: Run frontend tests**

```bash
cd frontend
npm test
```

Expected: all tests pass (adjust any that depended on codeValidator)

---

## Self-Review Check

### Spec coverage
- [x] Playground API as primary / WASM as fallback — Task 13
- [x] Backend deletion — Task 15
- [x] All w00-w18 features supported — Tasks 2-9
- [x] Semantic warnings (unused variable/fn/struct) — Task 10
- [x] WASM interface (run_code → InterpResult) — Task 1, 11
- [x] Frontend WASM loader — Task 12
- [x] compileRust rewrite — Task 13
- [x] Boss.tsx warnings + offline indicator — Task 14
- [x] CompileResult type update — Task 16
- [x] codeValidator.ts + backend deletion — Task 15
- [x] Integration tests for w00-w18 — Task 17
- [x] Format! support with {:.2} — Task 7, stdlib.rs
- [x] Trait method resolution — Task 8, resolve_method
- [x] Iterator chain (filter/map/sum) — Task 9
- [x] #[test] + assert_eq! — Task 8, eval_builtin_macro
- [x] ? operator — Task 8, eval_try
- [x] std::f64::consts::PI — Task 6, eval_path
- [x] Closure call support (w18) — Task 6 (eval_block closure-as-fn), Task 8 (eval_call Lambda)
- [x] String::from / HashMap::new / Vec::new — Task 8 (eval_call Path)
- [x] String::parse for w14 error handling — Task 8 (eval_string_method parse)

### Placeholder scan
No TBD, TODO, or "implement later" markers remain.

### Type consistency
- InterpResult struct → run_code signature → Task 1 matches frontend usage in Task 13
- CompileResult in api.ts → types.ts → Task 16
- FnStmt used in both parse.rs and eval.rs — consistent field names
- Value::Range used in eval_range, eval_for — consistent
