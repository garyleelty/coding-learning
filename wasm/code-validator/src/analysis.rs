use std::collections::HashSet;
use crate::ast::*;

pub fn analyze(program: &Program) -> Vec<String> {
    let mut ctx = AnalysisContext::new();
    ctx.collect_declarations(&program.items);
    ctx.collect_usages(&program.items);
    ctx.emit_warnings()
}

struct AnalysisContext {
    var_decls: Vec<(String, usize)>,
    var_used: HashSet<String>,
    fn_decls: HashSet<String>,
    fn_called: HashSet<String>,
    struct_decls: HashSet<String>,
    struct_used: HashSet<String>,
}

impl AnalysisContext {
    fn new() -> Self {
        AnalysisContext {
            var_decls: vec![],
            var_used: HashSet::new(),
            fn_decls: HashSet::new(),
            fn_called: HashSet::new(),
            struct_decls: HashSet::new(),
            struct_used: HashSet::new(),
        }
    }

    fn collect_declarations(&mut self, items: &[Stmt]) {
        for item in items {
            self.collect_declare_stmt(item);
        }
    }

    fn collect_declare_stmt(&mut self, stmt: &Stmt) {
        match stmt {
            Stmt::FnDef(f) => {
                self.fn_decls.insert(f.name.clone());
                for s in &f.body { self.collect_declare_stmt(s); }
            }
            Stmt::StructDef { name, .. } => { self.struct_decls.insert(name.clone()); }
            Stmt::EnumDef { name, .. } => { self.struct_decls.insert(name.clone()); }
            Stmt::ImplBlock { type_name, methods, .. } => {
                self.struct_used.insert(type_name.clone());
                for m in methods { for s in &m.body { self.collect_declare_stmt(s); } }
            }
            Stmt::ImplTrait { type_name, methods, .. } => {
                self.struct_used.insert(type_name.clone());
                for m in methods { for s in &m.body { self.collect_declare_stmt(s); } }
            }
            Stmt::Let { name, .. } => { self.var_decls.push((name.clone(), 0)); }
            Stmt::ModDef { items, .. } => { for i in items { self.collect_declare_stmt(i); } }
            Stmt::Attributed { item, .. } => { self.collect_declare_stmt(item); }
            _ => {}
        }
    }

    fn collect_usages(&mut self, items: &[Stmt]) {
        for item in items {
            self.collect_usage_stmt(item);
        }
    }

    fn collect_usage_stmt(&mut self, stmt: &Stmt) {
        match stmt {
            Stmt::Expr(expr) => { self.collect_usage_expr(expr); }
            Stmt::Let { init, .. } => {
                if let Some(e) = init { self.collect_usage_expr(e); }
            }
            Stmt::FnDef(f) => {
                self.fn_called.insert(f.name.clone()); // definition counts as "used" for self-reference
                for s in &f.body { self.collect_usage_stmt(s); }
            }
            Stmt::StructDef { name, .. } => {
                self.struct_used.insert(name.clone());
            }
            Stmt::EnumDef { name, .. } => {
                self.struct_used.insert(name.clone());
            }
            Stmt::ImplBlock { methods, .. } => {
                for m in methods { for s in &m.body { self.collect_usage_stmt(s); } }
            }
            Stmt::ImplTrait { methods, .. } => {
                for m in methods { for s in &m.body { self.collect_usage_stmt(s); } }
            }
            Stmt::ModDef { items, .. } => { for i in items { self.collect_usage_stmt(i); } }
            Stmt::Attributed { item, .. } => { self.collect_usage_stmt(item); }
            _ => {}
        }
    }

    fn collect_usage_expr(&mut self, expr: &Expr) {
        match expr {
            Expr::Ident(name) => { self.var_used.insert(name.clone()); }
            Expr::Literal(_) | Expr::Break | Expr::Continue => {}
            Expr::Path(_) => {}
            Expr::Binary(l, _, r) => { self.collect_usage_expr(l); self.collect_usage_expr(r); }
            Expr::Unary(_, e) => { self.collect_usage_expr(e); }
            Expr::Block(stmts) => { for s in stmts { self.collect_usage_stmt(s); } }
            Expr::If(c, t, e) => {
                self.collect_usage_expr(c);
                self.collect_usage_expr(t);
                if let Some(el) = e { self.collect_usage_expr(el); }
            }
            Expr::Call(f, args) => {
                if let Expr::Ident(name) = f.as_ref() {
                    self.fn_called.insert(name.clone());
                }
                self.collect_usage_expr(f);
                for a in args { self.collect_usage_expr(a); }
            }
            Expr::MethodCall(r, _, args) => {
                self.collect_usage_expr(r);
                for a in args { self.collect_usage_expr(a); }
            }
            Expr::Field(b, _) => { self.collect_usage_expr(b); }
            Expr::Index(b, i) => { self.collect_usage_expr(b); self.collect_usage_expr(i); }
            Expr::StructLit(_, fields) => {
                for (_, e) in fields { self.collect_usage_expr(e); }
            }
            Expr::Match(scrutinee, arms) => {
                self.collect_usage_expr(scrutinee);
                for (_, body) in arms { self.collect_usage_expr(body); }
            }
            Expr::Range(s, e, _) => { self.collect_usage_expr(s); self.collect_usage_expr(e); }
            Expr::Try(inner) => { self.collect_usage_expr(inner); }
            Expr::Return(val) => { if let Some(v) = val { self.collect_usage_expr(v); } }
            Expr::Lambda(params, body) => {
                for p in params { self.var_used.insert(p.clone()); }
                self.collect_usage_expr(body);
            }
            Expr::ForIn(name, iter, body) => {
                self.var_used.insert(name.clone());
                self.collect_usage_expr(iter);
                self.collect_usage_expr(body);
            }
            Expr::While(c, b) => { self.collect_usage_expr(c); self.collect_usage_expr(b); }
            Expr::Loop(b) => { self.collect_usage_expr(b); }
            Expr::Assign(l, r) => { self.collect_usage_expr(l); self.collect_usage_expr(r); }
        }
    }

    fn emit_warnings(&mut self) -> Vec<String> {
        let mut warnings = Vec::new();

        for (name, _) in &self.var_decls {
            if !self.var_used.contains(name) && name != "_" && name != "self" {
                warnings.push(format!("warning: unused variable: `{}`", name));
            }
        }

        for name in &self.fn_decls {
            if name != "main" && !name.starts_with("__closure_") && !self.fn_called.contains(name) {
                warnings.push(format!("warning: unused function: `{}`", name));
            }
        }

        for name in &self.struct_decls {
            if !self.struct_used.contains(name) {
                warnings.push(format!("warning: unused struct/enum: `{}`", name));
            }
        }

        warnings
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
        let program = parse::parse_program(r#"fn main() { let x = 42; x; }"#).unwrap();
        let warnings = analyze(&program);
        assert!(!warnings.iter().any(|w| w.contains("x")));
    }
}
