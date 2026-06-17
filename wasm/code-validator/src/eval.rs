use crate::ast::*;
use crate::scope::Scope;
use crate::value::*;

/// Holds the interpreter state during execution
pub struct EvalContext {
    pub scope: Scope,
    pub stdout: String,
    pub functions: Vec<FnStmt>,
    pub struct_defs: Vec<(String, Vec<(String, TypeName)>, Vec<String>)>,
    pub enum_defs: Vec<(String, Vec<VariantDef>, Vec<String>)>,
    pub impls: Vec<(String, Vec<FnStmt>)>,
    pub trait_impls: Vec<(String, String, Vec<FnStmt>)>,
    pub traits: Vec<(String, Vec<(String, Vec<(String, TypeName)>, TypeName)>)>,
    pub use_imports: Vec<(String, Vec<String>)>,  // short name → full path
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
            use_imports: vec![],
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

    /// Parse and execute full program
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
            Stmt::FnDef(f) => {
                self.functions.push(f.clone());
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
            Stmt::ModDef { name: _, items } => {
                // Flatten module items into main namespace
                for item in items {
                    self.register_item(item)?;
                }
            }
            Stmt::Use { path } => {
                // Track imports: last segment → full path for Ident resolution
                if let Some(last) = path.last() {
                    self.use_imports.push((last.clone(), path.clone()));
                }
            }
            Stmt::Attributed { attr: _, item } => {
                // #[test] and #[derive(Debug)] — register the item normally
                self.register_item(item)?;
            }
            _ => {} // Expr and Let at top level handled during execution
        }
        Ok(())
    }

    pub fn eval_expr(&mut self, expr: &Expr) -> Result<Value, String> {
        match expr {
            Expr::Literal(lit) => self.eval_literal(lit),
            Expr::Ident(name) => {
                // Check scope first
                if let Some(val) = self.scope.get(name).cloned() {
                    return Ok(val);
                }
                // Check imported names via use statements
                if let Some(path) = self.resolve_import(name) {
                    return self.eval_path(&path);
                }
                Err(format!("undefined variable: {}", name))
            }
            Expr::Path(path) => self.eval_path(path),
            Expr::Binary(lhs, op, rhs) => self.eval_binary(lhs, op, rhs),
            Expr::Unary(op, expr) => self.eval_unary(op, expr),
            Expr::Block(stmts) => self.eval_block(stmts),
            Expr::If(cond, then_b, else_b) => self.eval_if(cond, then_b, else_b),
            Expr::Call(func, args) => self.eval_call(func, args),
            Expr::MethodCall(receiver, method, args) => self.eval_method_call(receiver, method, args),
            Expr::Field(base, name) => self.eval_field(base, name),
            Expr::Index(base, index) => self.eval_index(base, index),
            Expr::StructLit(name, fields) => self.eval_struct_lit(name, fields),
            Expr::Lambda(params, _body) => Ok(Value::Closure(ClosureValue { param_count: params.len() })),
            Expr::Range(start, end, inclusive) => self.eval_range(start, end, *inclusive),
            Expr::Try(inner) => self.eval_try(inner),
            Expr::Match(scrutinee, arms) => self.eval_match(scrutinee, arms),
            Expr::Return(val) => self.eval_return(val),
            Expr::Break => { self.loop_break_value = Some(Value::Unit); Ok(Value::Unit) }
            Expr::Continue => Ok(Value::Unit),
            Expr::Assign(lhs, rhs) => self.eval_assign(lhs, rhs),
            Expr::Loop(body) => self.eval_loop(body),
            Expr::While(cond, body) => self.eval_while(cond, body),
            Expr::ForIn(name, iter_expr, body) => self.eval_for(name, iter_expr, body),
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

        // Handle compound assignment operators (+=, -=, *=, /=)
        let base_op = match op {
            BinOp::AddAssign => Some(BinOp::Add),
            BinOp::SubAssign => Some(BinOp::Sub),
            BinOp::MulAssign => Some(BinOp::Mul),
            BinOp::DivAssign => Some(BinOp::Div),
            _ => None,
        };
        if let Some(bop) = base_op {
            let result = self.eval_binary_inner(&l, &bop, &r)?;
            if let Expr::Ident(name) = lhs {
                if let Some(slot) = self.scope.get_mut(name) {
                    *slot = result.clone();
                }
            }
            return Ok(result);
        }

        self.eval_binary_inner(&l, op, &r)
    }

    fn eval_binary_inner(&mut self, l: &Value, op: &BinOp, r: &Value) -> Result<Value, String> {
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
            (BinOp::Div, Value::Float(a), Value::Float(b)) => Ok(Value::Float(a / b)),

            // Mixed int/float arithmetic — promote to float
            (BinOp::Add, a, b) | (BinOp::Sub, a, b) | (BinOp::Mul, a, b) | (BinOp::Div, a, b)
                if matches!(a, Value::Int(_)) && matches!(b, Value::Float(_))
                || matches!(a, Value::Float(_)) && matches!(b, Value::Int(_)) =>
            {
                let af = a.to_float().unwrap();
                let bf = b.to_float().unwrap();
                match op {
                    BinOp::Add => Ok(Value::Float(af + bf)),
                    BinOp::Sub => Ok(Value::Float(af - bf)),
                    BinOp::Mul => Ok(Value::Float(af * bf)),
                    BinOp::Div => {
                        if bf == 0.0 { Err(RuntimeError::DivisionByZero.to_string()) }
                        else { Ok(Value::Float(af / bf)) }
                    }
                    _ => unreachable!(),
                }
            }

            // Comparison
            (BinOp::Eq, _, _) => {
                let result = match (&l, &r) {
                    (Value::Int(a), Value::Int(b)) => a == b,
                    (Value::Float(a), Value::Float(b)) => (a - b).abs() < 1e-10,
                    (Value::Bool(a), Value::Bool(b)) => a == b,
                    (Value::String(a), Value::String(b)) => a == b,
                    (Value::Char(a), Value::Char(b)) => a == b,
                    _ => false,
                };
                Ok(Value::Bool(result))
            }
            (BinOp::Ne, _, _) => {
                let result = match (&l, &r) {
                    (Value::Int(a), Value::Int(b)) => a != b,
                    (Value::Float(a), Value::Float(b)) => (a - b).abs() >= 1e-10,
                    (Value::Bool(a), Value::Bool(b)) => a != b,
                    (Value::String(a), Value::String(b)) => a != b,
                    (Value::Char(a), Value::Char(b)) => a != b,
                    _ => true,
                };
                Ok(Value::Bool(result))
            }
            (BinOp::Lt, Value::Int(a), Value::Int(b)) => Ok(Value::Bool(a < b)),
            (BinOp::Le, Value::Int(a), Value::Int(b)) => Ok(Value::Bool(a <= b)),
            (BinOp::Gt, Value::Int(a), Value::Int(b)) => Ok(Value::Bool(a > b)),
            (BinOp::Ge, Value::Int(a), Value::Int(b)) => Ok(Value::Bool(a >= b)),
            (BinOp::Lt, Value::Float(a), Value::Float(b)) => Ok(Value::Bool(a < b)),
            (BinOp::Le, Value::Float(a), Value::Float(b)) => Ok(Value::Bool(a <= b)),
            (BinOp::Gt, Value::Float(a), Value::Float(b)) => Ok(Value::Bool(a > b)),
            (BinOp::Ge, Value::Float(a), Value::Float(b)) => Ok(Value::Bool(a >= b)),
            (BinOp::Lt, a, b) | (BinOp::Le, a, b) | (BinOp::Gt, a, b) | (BinOp::Ge, a, b)
                if matches!(a, Value::Int(_)) && matches!(b, Value::Float(_))
                || matches!(a, Value::Float(_)) && matches!(b, Value::Int(_)) =>
            {
                let af = a.to_float().unwrap();
                let bf = b.to_float().unwrap();
                match op {
                    BinOp::Lt => Ok(Value::Bool(af < bf)),
                    BinOp::Le => Ok(Value::Bool(af <= bf)),
                    BinOp::Gt => Ok(Value::Bool(af > bf)),
                    BinOp::Ge => Ok(Value::Bool(af >= bf)),
                    _ => unreachable!(),
                }
            }

            // Logic
            (BinOp::And, Value::Bool(a), Value::Bool(b)) => Ok(Value::Bool(*a && *b)),
            (BinOp::Or, Value::Bool(a), Value::Bool(b)) => Ok(Value::Bool(*a || *b)),

            _ => Err(format!("cannot apply {:?} to {} and {}", op, l.type_name(), r.type_name())),
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
                Stmt::Let { name, mutable: _, init, ty: _ } => {
                    let val = if let Some(init_expr) = init {
                        self.eval_let_init(name, init_expr)?
                    } else {
                        Value::Unit
                    };
                    self.scope.define(name, val);
                }
                _ => {} // Sub-items already registered
            }
        }
        self.scope.pop_frame();
        Ok(result)
    }

    fn eval_if(&mut self, cond: &Expr, then_b: &Expr, else_b: &Option<Box<Expr>>) -> Result<Value, String> {
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
                let val = self.loop_break_value.take().unwrap_or(Value::Unit);
                return Ok(val);
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
                None => return Err("while condition must be bool".to_string()),
            }
        }
        Ok(Value::Unit)
    }

    fn eval_for(&mut self, name: &str, iter_expr: &Expr, body: &Expr) -> Result<Value, String> {
        let iterable = self.eval_expr(iter_expr)?;
        let items: Vec<Value> = match &iterable {
            Value::Vec(v) => v.clone(),
            Value::Range(s, e, true) => (*s..=*e).map(|i| Value::Int(i)).collect(),
            Value::Range(s, e, false) => (*s..*e).map(|i| Value::Int(i)).collect(),
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

    fn eval_call(&mut self, func: &Expr, args: &[Expr]) -> Result<Value, String> {
        match func {
            Expr::Ident(name) if crate::stdlib::is_print_macro(name).is_some() => {
                self.eval_builtin_macro(func, args)
            }
            Expr::Ident(name) => {
                if let Some(f) = self.functions.iter().find(|f| f.name == *name).cloned() {
                    let arg_vals: Result<Vec<Value>, String> = args.iter().map(|a| self.eval_expr(a)).collect();
                    self.call_function(&f, &arg_vals?)
                } else if let Some(val) = self.scope.get(name) {
                    match val {
                        Value::Fn(fv) => {
                            if let Some(f) = self.functions.iter().find(|f| f.name == fv.name).cloned() {
                                let arg_vals: Result<Vec<Value>, String> = args.iter().map(|a| self.eval_expr(a)).collect();
                                self.call_function(&f, &arg_vals?)
                            } else {
                                Err(format!("function not found: {}", name))
                            }
                        }
                        Value::Closure(_) => {
                            Err(format!("closure {} requires inline call", name))
                        }
                        _ => Err(format!("`{}` is not callable", name)),
                    }
                } else if let Some(val) = self.try_enum_variant(name, args)? {
                    Ok(val)
                } else {
                    Err(format!("undefined function: {}", name))
                }
            }
            Expr::Path(path) => {
                let segs: Vec<&str> = path.iter().map(|s| s.as_str()).collect();
                match segs.as_slice() {
                    ["HashMap", "new"] => Ok(Value::HashMap(std::collections::HashMap::new())),
                    ["String", "from"] => {
                        let arg = self.eval_expr(&args[0])?;
                        match arg {
                            Value::String(s) => Ok(Value::String(s)),
                            _ => Err("String::from requires string argument".to_string()),
                        }
                    }
                    ["Vec", "new"] => Ok(Value::Vec(vec![])),
                    _ => Err(format!("unsupported associated function: {:?}", path)),
                }
            }
            Expr::Lambda(params, body) => {
                let arg_vals: Result<Vec<Value>, String> = args.iter().map(|a| self.eval_expr(a)).collect();
                let arg_vals = arg_vals?;
                self.scope.push_frame();
                for (i, pname) in params.iter().enumerate() {
                    self.scope.define(pname, arg_vals.get(i).cloned().unwrap_or(Value::Unit));
                }
                let result = self.eval_expr(body);
                self.scope.pop_frame();
                result
            }
            _ => Err("not callable".to_string()),
        }
    }

    fn eval_builtin_macro(&mut self, func: &Expr, args: &[Expr]) -> Result<Value, String> {
        let name = match func { Expr::Ident(n) => n.trim_end_matches('!'), _ => "" };

        match name {
            "println" | "print" => {
                let format_lit = match &args[0] {
                    Expr::Literal(Literal::String(s)) => s.clone(),
                    _ => return Err("println!/print! requires string literal as first argument".to_string()),
                };
                let arg_vals: Result<Vec<Value>, String> = args[1..].iter().map(|a| self.eval_expr(a)).collect();
                let arg_vals = arg_vals?;
                let output = crate::stdlib::format_stdout(&arg_vals, &format_lit);
                if name == "println" {
                    self.writeln(&output);
                } else {
                    self.write(&output);
                }
                Ok(Value::Unit)
            }
            "format" => {
                let format_lit = match &args[0] {
                    Expr::Literal(Literal::String(s)) => s.clone(),
                    _ => return Err("format! requires string literal as first argument".to_string()),
                };
                let arg_vals: Result<Vec<Value>, String> = args[1..].iter().map(|a| self.eval_expr(a)).collect();
                let arg_vals = arg_vals?;
                Ok(Value::String(crate::stdlib::format_stdout(&arg_vals, &format_lit)))
            }
            "assert_eq" => {
                let left = self.eval_expr(&args[0])?;
                let right = self.eval_expr(&args[1])?;
                let left_str = left.to_string();
                let right_str = right.to_string();
                if left_str != right_str {
                    return Err(format!("assertion failed: `(left == right)`\n left: `{}`,\n right: `{}`", left_str, right_str));
                }
                Ok(Value::Unit)
            }
            "vec" => {
                let items: Result<Vec<Value>, String> = args.iter().map(|a| self.eval_expr(a)).collect();
                Ok(Value::Vec(items?))
            }
            _ => Err(format!("unknown macro: {}", name)),
        }
    }

    fn eval_method_call(&mut self, receiver: &Expr, method: &str, args: &[Expr]) -> Result<Value, String> {
        let receiver_val = self.eval_expr(receiver)?;
        let type_name = receiver_val.type_name().to_string();

        let result = self.resolve_builtin_method(&receiver_val, method, receiver, args)
            .or_else(|| self.eval_iterator_method(&receiver_val, method, receiver, args))
            .or_else(|| self.resolve_user_method(&receiver_val, method, receiver, args))
            .ok_or_else(|| format!("no method `{}` for type `{}`", method, type_name))??;

        // Write back the result for mutating methods (HashMap::insert etc.)
        // when the receiver is a simple variable
        if let Expr::Ident(name) = receiver {
            if std::mem::discriminant(&receiver_val) == std::mem::discriminant(&result) {
                if let Some(slot) = self.scope.get_mut(name) {
                    *slot = result.clone();
                }
            }
        }

        Ok(result)
    }

    fn resolve_builtin_method(&mut self, receiver_val: &Value, method: &str,
                               _receiver: &Expr, args: &[Expr]) -> Option<Result<Value, String>> {
        let type_name = receiver_val.type_name();

        match type_name {
            "String" | "&str" => self.eval_string_method(receiver_val, method, args),
            "Vec" | "Iterator" => self.eval_vec_method(receiver_val, method, _receiver, args),
            "HashMap" => self.eval_hashmap_method(receiver_val, method, args),
            _ => None,
        }
    }

    fn resolve_user_method(&mut self, receiver_val: &Value, method: &str,
                            _receiver: &Expr, args: &[Expr]) -> Option<Result<Value, String>> {
        let type_name = receiver_val.type_name().to_string();

        let found = self.impls.iter()
            .find(|(t, _)| *t == type_name)
            .and_then(|(_, methods)| methods.iter().find(|m| m.name == method))
            .cloned();

        if let Some(m) = found {
            let arg_vals: Result<Vec<Value>, String> = args.iter().map(|a| self.eval_expr(a)).collect();
            let arg_vals = arg_vals.ok()?;
            let mut all_args = vec![receiver_val.clone()];
            all_args.extend(arg_vals);
            return Some(self.call_function(&m, &all_args));
        }

        let found = self.trait_impls.iter()
            .find(|(_, impl_type_name, _)| *impl_type_name == type_name)
            .and_then(|(_, _, methods)| methods.iter().find(|m| m.name == method))
            .cloned();

        if let Some(m) = found {
            let arg_vals: Result<Vec<Value>, String> = args.iter().map(|a| self.eval_expr(a)).collect();
            let arg_vals = arg_vals.ok()?;
            let mut all_args = vec![receiver_val.clone()];
            all_args.extend(arg_vals);
            return Some(self.call_function(&m, &all_args));
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
                        _receiver: &Expr, _args: &[Expr]) -> Option<Result<Value, String>> {
        match receiver_val {
            Value::Vec(v) => {
                match method {
                    "push" => None,
                    "pop" => {
                        if v.is_empty() {
                            Some(Ok(Value::Unit))
                        } else {
                            Some(Ok(v.last().unwrap().clone()))
                        }
                    }
                    "len" => Some(Ok(Value::Int(v.len() as i64))),
                    "iter" => Some(Ok(Value::Iter(v.clone()))),
                    _ => None,
                }
            }
            Value::Iter(v) => {
                match method {
                    "len" => Some(Ok(Value::Int(v.len() as i64))),
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
                        // Return the new map so writeback can update the variable
                        Some(Ok(Value::HashMap(new_map)))
                    }
                    "len" => Some(Ok(Value::Int(m.len() as i64))),
                    _ => None,
                }
            }
            _ => None,
        }
    }

    fn eval_iterator_method(&mut self, receiver_val: &Value, method: &str,
                             _receiver: &Expr, args: &[Expr]) -> Option<Result<Value, String>> {
        let items = match receiver_val {
            Value::Vec(v) => v.clone(),
            Value::Iter(v) => v.clone(),
            Value::Range(s, e, true) => (*s..=*e).map(Value::Int).collect(),
            Value::Range(s, e, false) => (*s..*e).map(Value::Int).collect(),
            _ => return None,
        };

        match method {
            "filter" => {
                if args.len() != 1 {
                    return Some(Err("filter requires 1 argument (a closure)".to_string()));
                }
                let closure = &args[0];
                let mut result = Vec::new();
                for item in &items {
                    let keep = self.eval_closure_predicate(closure, item)?;
                    if keep {
                        result.push(item.clone());
                    }
                }
                Some(Ok(Value::Iter(result)))
            }
            "map" => {
                if args.len() != 1 {
                    return Some(Err("map requires 1 argument (a closure)".to_string()));
                }
                let closure = &args[0];
                let mut result = Vec::new();
                for item in &items {
                    let mapped = self.eval_closure_map(closure, item)?;
                    result.push(mapped);
                }
                Some(Ok(Value::Iter(result)))
            }
            "sum" => {
                let mut total_float: Option<f64> = None;
                let mut total_int: Option<i64> = Some(0);
                for item in &items {
                    match item {
                        Value::Int(i) => {
                            total_int = Some(total_int.unwrap_or(0) + i);
                        }
                        Value::Float(f) => {
                            let val = total_float.unwrap_or_else(|| total_int.unwrap_or(0) as f64) + f;
                            total_float = Some(val);
                            total_int = None;
                        }
                        _ => return Some(Err("sum requires numeric elements".to_string())),
                    }
                }
                if let Some(f) = total_float {
                    Some(Ok(Value::Float(f)))
                } else {
                    Some(Ok(Value::Int(total_int.unwrap_or(0))))
                }
            }
            "collect" => {
                Some(Ok(Value::Vec(items)))
            }
            _ => None,
        }
    }

    fn eval_closure_predicate(&mut self, closure: &Expr, item: &Value) -> Option<bool> {
        match closure {
            Expr::Lambda(params, body) => {
                self.scope.push_frame();
                if let Some(param) = params.first() {
                    self.scope.define(param, item.clone());
                }
                let result = self.eval_expr(body).ok()?;
                self.scope.pop_frame();
                result.to_bool()
            }
            _ => None,
        }
    }

    fn eval_closure_map(&mut self, closure: &Expr, item: &Value) -> Option<Value> {
        match closure {
            Expr::Lambda(params, body) => {
                self.scope.push_frame();
                if let Some(param) = params.first() {
                    self.scope.define(param, item.clone());
                }
                let result = self.eval_expr(body).ok()?;
                self.scope.pop_frame();
                Some(result)
            }
            _ => None,
        }
    }

    fn eval_field(&mut self, base: &Expr, name: &str) -> Result<Value, String> {
        let val = self.eval_expr(base)?;
        match &val {
            Value::Struct(_, fields) => {
                fields.iter()
                    .find(|(n, _)| n == name)
                    .map(|(_, v)| v.clone())
                    .ok_or_else(|| format!("no field `{}` on struct", name))
            }
            Value::EnumVariant(_, _, payload) => {
                if name == "0" {
                    payload.as_ref()
                        .map(|p| *p.clone())
                        .ok_or_else(|| format!("no field `{}` on enum variant", name))
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
        // Check if this is an enum variant (name = "EnumName::VariantName")
        if let Some(delim) = name.find("::") {
            let enum_name = &name[..delim];
            let variant_name = &name[delim + 2..];
            let is_enum = self.enum_defs.iter().any(|(en, variants, _)| {
                en == enum_name && variants.iter().any(|v| v.name == variant_name)
            });
            if is_enum {
                let field_vals: Result<Vec<(String, Value)>, String> = fields.iter()
                    .map(|(n, e)| self.eval_expr(e).map(|v| (n.clone(), v)))
                    .collect();
                let field_vals = field_vals?;
                // Flatten named fields into a struct-like payload
                let payload = Value::Struct(variant_name.to_string(), field_vals);
                return Ok(Value::EnumVariant(enum_name.to_string(), variant_name.to_string(), Some(Box::new(payload))));
            }
        }
        let field_vals: Result<Vec<(String, Value)>, String> = fields.iter()
            .map(|(n, e)| self.eval_expr(e).map(|v| (n.clone(), v)))
            .collect();
        Ok(Value::Struct(name.to_string(), field_vals?))
    }

    fn eval_range(&mut self, start: &Expr, end: &Expr, inclusive: bool) -> Result<Value, String> {
        let s = self.eval_expr(start)?;
        let e = self.eval_expr(end)?;
        match (s, e) {
            (Value::Int(si), Value::Int(ei)) => Ok(Value::Range(si, ei, inclusive)),
            _ => Err("range must have integer bounds".to_string()),
        }
    }

    fn eval_try(&mut self, inner: &Expr) -> Result<Value, String> {
        let val = self.eval_expr(inner)?;
        match &val {
            Value::EnumVariant(_, name, payload) if name == "Ok" => {
                Ok(*payload.clone().unwrap_or(Box::new(Value::Unit)))
            }
            Value::EnumVariant(_, name, payload) if name == "Err" => {
                let err_val = *payload.clone().unwrap_or(Box::new(Value::Unit));
                self.return_value = Some(err_val.clone());
                Err(err_val.to_string())
            }
            _ => Ok(val),
        }
    }

    fn eval_match(&mut self, scrutinee: &Expr, arms: &[(Pat, Expr)]) -> Result<Value, String> {
        let val = self.eval_expr(scrutinee)?;

        for (pat, body) in arms {
            if self.pattern_matches(pat, &val) {
                self.scope.push_frame();
                if let Err(e) = self.bind_pattern(pat, &val) {
                    self.scope.pop_frame();
                    return Err(e);
                }
                let result = self.eval_expr(body)?;
                self.scope.pop_frame();
                return Ok(result);
            }
        }

        Err("non-exhaustive match: no pattern matched the value".to_string())
    }

    fn eval_assign(&mut self, lhs: &Expr, rhs: &Expr) -> Result<Value, String> {
        let val = self.eval_expr(rhs)?;

        match lhs {
            Expr::Ident(name) => {
                if self.scope.get_mut(name).is_some() {
                    if let Some(slot) = self.scope.get_mut(name) {
                        *slot = val.clone();
                    }
                    Ok(val)
                } else {
                    Err(format!("undefined variable: {}", name))
                }
            }
            Expr::Index(base, index) => {
                let idx_val = self.eval_expr(index)?;
                let mut base_val = self.eval_expr(base)?;
                match (&mut base_val, &idx_val) {
                    (Value::HashMap(m), Value::String(key)) => {
                        m.insert(key.clone(), val.clone());
                        self.writeback(base, base_val)?;
                        Ok(val)
                    }
                    _ => Err("cannot assign to this index".to_string()),
                }
            }
            _ => Err("cannot assign to this expression".to_string()),
        }
    }

    /// Resolve a use-imported name to its full path (e.g. "PI" → ["std", "f64", "consts", "PI"])
    fn resolve_import(&self, name: &str) -> Option<Vec<String>> {
        self.use_imports.iter()
            .find(|(short, _)| short == name)
            .map(|(_, path)| path.clone())
    }

    /// Try to construct an enum variant via function-call syntax (e.g. Ok(n), None, Some(5))
    fn try_enum_variant(&mut self, name: &str, args: &[Expr]) -> Result<Option<Value>, String> {
        // Check built-in enum variants first
        let builtin = match name {
            "Some" => Some(("Option", "Some", args.len() == 1)),
            "None" => Some(("Option", "None", true)),
            "Ok" => Some(("Result", "Ok", args.len() == 1)),
            "Err" => Some(("Result", "Err", args.len() == 1)),
            _ => None,
        };
        if let Some((enum_name, variant_name, has_payload)) = builtin {
            if has_payload {
                let val = self.eval_expr(&args[0])?;
                return Ok(Some(Value::EnumVariant(enum_name.to_string(), variant_name.to_string(), Some(Box::new(val)))));
            } else {
                return Ok(Some(Value::EnumVariant(enum_name.to_string(), variant_name.to_string(), None)));
            }
        }
        // Check user-defined enum variants
        if let Some((enum_name, variant_name)) = self.enum_defs.iter().find_map(|(enum_name, variants, _)| {
            variants.iter().find(|v| v.name == name).map(|v| (enum_name.clone(), v.name.clone()))
        }) {
            let payload = if args.is_empty() {
                None
            } else {
                let val = self.eval_expr(&args[0])?;
                Some(Box::new(val))
            };
            return Ok(Some(Value::EnumVariant(enum_name, variant_name, payload)));
        }
        Ok(None)
    }

    fn eval_let_init(&mut self, name: &str, init_expr: &Expr) -> Result<Value, String> {
        // Check for closure-as-variable: |x| body
        if let Expr::Lambda(params, body) = init_expr {
            let fn_name = format!("__closure_{}", self.functions.len());
            let fn_stmt = FnStmt {
                name: fn_name.clone(),
                params: params.iter().map(|p| (p.clone(), TypeName::Named("()".to_string()))).collect(),
                ret: TypeName::Tuple(vec![]),
                body: vec![Stmt::Expr(*body.clone())],
            };
            self.functions.push(fn_stmt);
            Ok(Value::Fn(FnValue { name: fn_name, param_count: params.len() }))
        } else {
            self.eval_expr(init_expr)
        }
    }

    fn call_function(&mut self, func: &FnStmt, args: &[Value]) -> Result<Value, String> {
        self.scope.push_frame();
        for (i, (param_name, _)) in func.params.iter().enumerate() {
            let val = if i == 0 && param_name == "self" {
                args[0].clone()
            } else {
                args.get(i).cloned().unwrap_or(Value::Unit)
            };
            self.scope.define(param_name, val);
        }
        let mut last_value = Value::Unit;
        for stmt in &func.body {
            match stmt {
                Stmt::Expr(expr) => {
                    last_value = self.eval_expr(expr)?;
                    if self.return_value.is_some() {
                        let ret = self.return_value.take();
                        self.scope.pop_frame();
                        return Ok(ret.unwrap_or(Value::Unit));
                    }
                }
                Stmt::Let { name, mutable: _, init, ty: _ } => {
                    let val = if let Some(init_expr) = init {
                        self.eval_let_init(name, init_expr)?
                    } else {
                        Value::Unit
                    };
                    self.scope.define(name, val);
                }
                _ => {}
            }
        }
        self.scope.pop_frame();
        Ok(last_value)
    }

    fn writeback(&mut self, original: &Expr, new_val: Value) -> Result<(), String> {
        if let Expr::Ident(name) = original {
            if let Some(slot) = self.scope.get_mut(name) {
                *slot = new_val;
                return Ok(());
            }
        }
        Err("cannot write back value".to_string())
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
                // Pattern "Shape::Circle" should match variant "Circle"
                let variant_matches = *en == *vn || en.ends_with(&format!("::{}", vn));
                if !variant_matches { return false; }
                if subpats.is_empty() { return true; }
                if let (Some(p), Some(sub)) = (payload, subpats.first()) {
                    self.pattern_matches(sub, p.as_ref())
                } else {
                    subpats.is_empty()
                }
            }
            (Pat::Tuple(ps), _) => {
                ps.iter().all(|p| matches!(p, Pat::Wild))
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
                    if let Some(p) = payload {
                        // If the payload is a struct with named fields, destructure by field name
                        if let Value::Struct(_, fields) = p.as_ref() {
                            for subpat in subpats {
                                if let Pat::Ident(name) = subpat {
                                    if let Some((_, field_val)) = fields.iter().find(|(n, _)| n == name) {
                                        self.scope.define(name, field_val.clone());
                                    } else {
                                        self.scope.define(name, p.as_ref().clone());
                                    }
                                } else {
                                    self.bind_pattern(subpat, p.as_ref())?;
                                }
                            }
                        } else {
                            // Single-payload variant: bind first sub-pattern
                            if let Some(sub) = subpats.first() {
                                self.bind_pattern(sub, p.as_ref())?;
                            }
                        }
                    }
                }
                Ok(())
            }
            Pat::Tuple(ps) => {
                let _ = ps;
                Ok(())
            }
            _ => Ok(()),
        }
    }
}
