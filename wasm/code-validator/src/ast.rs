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
    Loop(Box<Expr>),
    While(Box<Expr>, Box<Expr>),    // cond, body
    ForIn(String, Box<Expr>, Box<Expr>), // pat, iter, body
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
    FnDef(FnStmt),
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
