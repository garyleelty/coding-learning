use std::collections::HashMap;
use std::fmt;

#[derive(Debug, Clone)]
pub enum Value {
    Int(i64),
    Float(f64),
    Bool(bool),
    String(String),
    Char(char),
    Vec(Vec<Value>),
    HashMap(HashMap<String, Value>),
    Struct(String, Vec<(String, Value)>),
    EnumVariant(String, String, Option<Box<Value>>),
    Fn(FnValue),
    Closure(ClosureValue),
    Range(i64, i64, bool),
    Iter(Vec<Value>),
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
            Value::Range(_, _, _) => "Range",
            Value::Iter(_) => "Iterator",
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

    /// Check if this value is "truthy" for if/while conditions
    pub fn is_truthy(&self) -> bool {
        self.to_bool().unwrap_or(false)
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
                    if i > 0 {
                        write!(f, ", ")?;
                    }
                    write!(f, "{}", item)?;
                }
                write!(f, "]")
            }
            Value::HashMap(m) => {
                write!(f, "{{")?;
                for (i, (k, v)) in m.iter().enumerate() {
                    if i > 0 {
                        write!(f, ", ")?;
                    }
                    write!(f, "\"{}\": {}", k, v)?;
                }
                write!(f, "}}")
            }
            Value::Struct(name, fields) => {
                write!(f, "{} {{ ", name)?;
                for (i, (n, v)) in fields.iter().enumerate() {
                    if i > 0 {
                        write!(f, ", ")?;
                    }
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
            Value::Range(s, e, true) => write!(f, "{}..={}", s, e),
            Value::Range(s, e, false) => write!(f, "{}..{}", s, e),
            Value::Iter(v) => write!(f, "Iter({})", v.len()),
            Value::Unit => write!(f, "()"),
        }
    }
}

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
            RuntimeError::UndefinedField(v) => write!(f, "no field `{}` on struct", v),
            RuntimeError::NotCallable(v) => write!(f, "not callable: {}", v),
            RuntimeError::Panic(msg) => write!(f, "panic: {}", msg),
            RuntimeError::BreakOutsideLoop => write!(f, "break outside loop"),
            RuntimeError::ContinueOutsideLoop => write!(f, "continue outside loop"),
            RuntimeError::AssertionFailed(msg) => write!(f, "assertion failed: {}", msg),
            RuntimeError::ReturnWithoutFunction => write!(f, "return outside function"),
        }
    }
}

impl std::error::Error for RuntimeError {}
