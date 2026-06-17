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
            Stmt::Use { path: _ } => {
                // use statements are informational — items are global
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
                self.scope.get(name)
                    .cloned()
                    .ok_or_else(|| format!("undefined variable: {}", name))
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
                            Value::Fn(FnValue { name: fn_name, param_count: params.len() })
                        } else {
                            self.eval_expr(init_expr)?
                        }
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

    fn eval_call(&mut self, _func: &Expr, _args: &[Expr]) -> Result<Value, String> {
        Err("eval_call not yet implemented".to_string())
    }

    fn eval_method_call(&mut self, _receiver: &Expr, _method: &str, _args: &[Expr]) -> Result<Value, String> {
        Err("eval_method_call not yet implemented".to_string())
    }

    fn eval_field(&mut self, _base: &Expr, _name: &str) -> Result<Value, String> {
        Err("eval_field not yet implemented".to_string())
    }

    fn eval_index(&mut self, _base: &Expr, _index: &Expr) -> Result<Value, String> {
        Err("eval_index not yet implemented".to_string())
    }

    fn eval_struct_lit(&mut self, _name: &str, _fields: &[(String, Expr)]) -> Result<Value, String> {
        Err("eval_struct_lit not yet implemented".to_string())
    }

    fn eval_range(&mut self, start: &Expr, end: &Expr, inclusive: bool) -> Result<Value, String> {
        let s = self.eval_expr(start)?;
        let e = self.eval_expr(end)?;
        match (s, e) {
            (Value::Int(si), Value::Int(ei)) => Ok(Value::Range(si, ei, inclusive)),
            _ => Err("range must have integer bounds".to_string()),
        }
    }

    fn eval_try(&mut self, _inner: &Expr) -> Result<Value, String> {
        Err("eval_try not yet implemented".to_string())
    }

    fn eval_match(&mut self, _scrutinee: &Expr, _arms: &[(Pat, Expr)]) -> Result<Value, String> {
        Err("eval_match not yet implemented".to_string())
    }

    fn eval_assign(&mut self, _lhs: &Expr, _rhs: &Expr) -> Result<Value, String> {
        Err("eval_assign not yet implemented".to_string())
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
        for stmt in &func.body {
            match stmt {
                Stmt::Expr(expr) => {
                    self.eval_expr(expr)?;
                    if self.return_value.is_some() {
                        let ret = self.return_value.take();
                        self.scope.pop_frame();
                        return Ok(ret.unwrap_or(Value::Unit));
                    }
                }
                Stmt::Let { name, mutable: _, init, ty: _ } => {
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

    // Placeholders for reference cells and comparison
    fn writeback(&mut self, _original: &Expr, _new_val: Value) -> Result<(), String> {
        Err("writeback not yet implemented".to_string())
    }

    fn pattern_matches(&self, _pat: &Pat, _val: &Value) -> bool {
        false
    }

    fn bind_pattern(&mut self, _pat: &Pat, _val: &Value) -> Result<(), String> {
        Err("bind_pattern not yet implemented".to_string())
    }
}
