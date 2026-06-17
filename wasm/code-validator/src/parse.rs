use crate::ast::*;
use syn::ItemMod;
use syn::parse::{ParseStream, Parser};

pub fn parse_program(code: &str) -> Result<Program, String> {
    let file: syn::File = syn::parse_file(code).map_err(|e| format!("parse error: {}", e))?;
    let mut items = Vec::new();
    for item in file.items {
        items.push(parse_item(item)?);
    }
    Ok(Program { items })
}

fn parse_item(item: syn::Item) -> Result<Stmt, String> {
    match item {
        syn::Item::Fn(f) => parse_fn(f).map(Stmt::FnDef),
        syn::Item::Struct(s) => {
            parse_struct(s).map(|(n, f, g)| Stmt::StructDef { name: n, fields: f, generics: g })
        }
        syn::Item::Enum(e) => {
            parse_enum(e).map(|(n, v, g)| Stmt::EnumDef { name: n, variants: v, generics: g })
        }
        syn::Item::Impl(i) => {
            if let Some((_, trait_path, _)) = &i.trait_ {
                let trait_name = path_to_string(trait_path);
                let type_name = syn_type_to_string(&i.self_ty);
                let methods = i
                    .items
                    .iter()
                    .map(|item| match item {
                        syn::ImplItem::Fn(f) => parse_impl_fn(f),
                        _ => Err("unsupported impl item".to_string()),
                    })
                    .collect::<Result<Vec<_>, String>>()?;
                Ok(Stmt::ImplTrait {
                    trait_name,
                    type_name,
                    methods,
                })
            } else {
                let type_name = syn_type_to_string(&i.self_ty);
                let methods = i
                    .items
                    .iter()
                    .map(|item| match item {
                        syn::ImplItem::Fn(f) => parse_impl_fn(f),
                        _ => Err("unsupported impl item".to_string()),
                    })
                    .collect::<Result<Vec<_>, String>>()?;
                Ok(Stmt::ImplBlock {
                    type_name,
                    methods,
                })
            }
        }
        syn::Item::Trait(t) => parse_trait(t).map(|(n, m)| Stmt::TraitDef { name: n, methods: m }),
        syn::Item::Mod(m) => parse_mod(m).map(|(n, i)| Stmt::ModDef { name: n, items: i }),
        syn::Item::Use(u) => parse_use(u).map(|p| Stmt::Use { path: p }),
        syn::Item::Const(_)
        | syn::Item::Static(_)
        | syn::Item::ExternCrate(_)
        | syn::Item::ForeignMod(_)
        | syn::Item::Macro(_)
        | syn::Item::TraitAlias(_)
        | syn::Item::Type(_)
        | syn::Item::Union(_) => Err("unsupported item type".to_string()),
        _ => Err("unknown item".to_string()),
    }
}

fn parse_fn_sig_body(sig: &syn::Signature, block: &syn::Block) -> Result<FnStmt, String> {
    let name = sig.ident.to_string();
    let mut params = Vec::new();
    for p in &sig.inputs {
        match p {
            syn::FnArg::Typed(pt) => {
                let pat_name = match &*pt.pat {
                    syn::Pat::Ident(i) => i.ident.to_string(),
                    _ => return Err("unsupported fn param pattern".to_string()),
                };
                let ty = parse_type(&pt.ty)?;
                params.push((pat_name, ty));
            }
            syn::FnArg::Receiver(_) => {
                params.push(("self".to_string(), TypeName::Named("Self".to_string())));
            }
        }
    }
    let ret = match &sig.output {
        syn::ReturnType::Default => TypeName::Tuple(vec![]),
        syn::ReturnType::Type(_, ty) => parse_type(ty)?,
    };
    let body = parse_block(block)?;
    Ok(FnStmt { name, params, ret, body })
}

fn parse_fn(f: syn::ItemFn) -> Result<FnStmt, String> {
    parse_fn_sig_body(&f.sig, &f.block)
}

fn parse_impl_fn(f: &syn::ImplItemFn) -> Result<FnStmt, String> {
    parse_fn_sig_body(&f.sig, &f.block)
}

fn parse_struct(
    s: syn::ItemStruct,
) -> Result<(String, Vec<(String, TypeName)>, Vec<String>), String> {
    let name = s.ident.to_string();
    let fields = match &s.fields {
        syn::Fields::Named(fields) => fields
            .named
            .iter()
            .map(|f| {
                let fname = f.ident.as_ref().expect("named field should have ident").to_string();
                let ty = parse_type(&f.ty)?;
                Ok((fname, ty))
            })
            .collect::<Result<Vec<_>, String>>()?,
        syn::Fields::Unit => vec![],
        syn::Fields::Unnamed(_) => return Err("tuple structs not supported".to_string()),
    };
    let generics = s
        .generics
        .params
        .iter()
        .map(|p| match p {
            syn::GenericParam::Type(t) => t.ident.to_string(),
            syn::GenericParam::Lifetime(l) => l.lifetime.ident.to_string(),
            _ => "".to_string(),
        })
        .collect();
    Ok((name, fields, generics))
}

fn parse_enum(
    e: syn::ItemEnum,
) -> Result<(String, Vec<VariantDef>, Vec<String>), String> {
    let name = e.ident.to_string();
    let variants = e
        .variants
        .iter()
        .map(|v| {
            let fields = match &v.fields {
                syn::Fields::Named(fields) => fields
                    .named
                    .iter()
                    .map(|f| {
                        let fname = f.ident.as_ref().expect("named field should have ident").to_string();
                        let ty = parse_type(&f.ty)?;
                        Ok((fname, ty))
                    })
                    .collect::<Result<Vec<_>, String>>()?,
                syn::Fields::Unnamed(fields) => fields
                    .unnamed
                    .iter()
                    .enumerate()
                    .map(|(i, f)| {
                        let ty = parse_type(&f.ty)?;
                        Ok((format!("_{}", i), ty))
                    })
                    .collect::<Result<Vec<_>, String>>()?,
                syn::Fields::Unit => vec![],
            };
            Ok(VariantDef {
                name: v.ident.to_string(),
                fields,
            })
        })
        .collect::<Result<Vec<_>, String>>()?;
    let generics = e
        .generics
        .params
        .iter()
        .map(|p| match p {
            syn::GenericParam::Type(t) => t.ident.to_string(),
            syn::GenericParam::Lifetime(l) => l.lifetime.ident.to_string(),
            _ => "".to_string(),
        })
        .collect();
    Ok((name, variants, generics))
}

fn parse_trait(
    t: syn::ItemTrait,
) -> Result<(String, Vec<(String, Vec<(String, TypeName)>, TypeName)>), String> {
    let name = t.ident.to_string();
    let methods = t
        .items
        .iter()
        .map(|item| match item {
            syn::TraitItem::Fn(f) => {
                let name = f.sig.ident.to_string();
                let mut params = Vec::new();
                for p in &f.sig.inputs {
                    match p {
                        syn::FnArg::Typed(pt) => {
                            let pat_name = match &*pt.pat {
                                syn::Pat::Ident(i) => i.ident.to_string(),
                                _ => return Err("unsupported trait param pattern".to_string()),
                            };
                            let ty = parse_type(&pt.ty)?;
                            params.push((pat_name, ty));
                        }
                        syn::FnArg::Receiver(_) => {
                            params.push((
                                "self".to_string(),
                                TypeName::Named("Self".to_string()),
                            ));
                        }
                    }
                }
                let ret = match &f.sig.output {
                    syn::ReturnType::Default => TypeName::Tuple(vec![]),
                    syn::ReturnType::Type(_, ty) => {
                        parse_type(ty)?
                    }
                };
                Ok((name, params, ret))
            }
            _ => Err("unsupported trait item".to_string()),
        })
        .collect::<Result<Vec<_>, String>>()?;
    Ok((name, methods))
}

fn parse_mod(m: ItemMod) -> Result<(String, Vec<Stmt>), String> {
    let name = m.ident.to_string();
    let items = match m.content {
        Some((_, items)) => items
            .into_iter()
            .map(parse_item)
            .collect::<Result<Vec<_>, String>>()?,
        None => vec![],
    };
    Ok((name, items))
}

fn parse_use(u: syn::ItemUse) -> Result<Vec<String>, String> {
    fn extract_path(use_path: &syn::UseTree, out: &mut Vec<String>) {
        match use_path {
            syn::UseTree::Path(p) => {
                out.push(p.ident.to_string());
                extract_path(&p.tree, out);
            }
            syn::UseTree::Name(n) => {
                out.push(n.ident.to_string());
            }
            syn::UseTree::Glob(_) => {
                out.push("*".to_string());
            }
            syn::UseTree::Rename(r) => {
                out.push(r.ident.to_string());
            }
            _ => {}
        }
    }
    let mut path = Vec::new();
    extract_path(&u.tree, &mut path);
    Ok(path)
}

fn parse_block(block: &syn::Block) -> Result<Vec<Stmt>, String> {
    block.stmts.iter().map(parse_stmt).collect()
}

fn parse_stmt(stmt: &syn::Stmt) -> Result<Stmt, String> {
    match stmt {
        syn::Stmt::Expr(e, _) => parse_expr(e).map(Stmt::Expr),
        syn::Stmt::Local(l) => {
            let (name, mutable, explicit_type) = match &l.pat {
                syn::Pat::Type(pt) => {
                    let inner_name = match &*pt.pat {
                        syn::Pat::Ident(i) => i.ident.to_string(),
                        _ => return Err("unsupported type-ascribed pattern".to_string()),
                    };
                    let inner_mut = match &*pt.pat {
                        syn::Pat::Ident(i) => i.mutability.is_some(),
                        _ => false,
                    };
                    (inner_name, inner_mut, Some(parse_type(&pt.ty)?))
                }
                syn::Pat::Ident(i) => (i.ident.to_string(), i.mutability.is_some(), None),
                _ => return Err("unsupported let pattern".to_string()),
            };
            let init = l.init.as_ref().map(|init| parse_expr(&init.expr)).transpose()?;
            Ok(Stmt::Let {
                name,
                mutable,
                init,
                ty: explicit_type,
            })
        }
        syn::Stmt::Item(item) => parse_item(item.clone()),
        syn::Stmt::Macro(m) => {
            let macro_name = path_to_string(&m.mac.path);
            let args = parse_macro_args(&m.mac.tokens)?;
            Ok(Stmt::Expr(Expr::Call(Box::new(Expr::Ident(macro_name)), args)))
        }
    }
}

fn parse_expr(expr: &syn::Expr) -> Result<Expr, String> {
    match expr {
        syn::Expr::Lit(lit) => parse_literal(&lit.lit).map(Expr::Literal),
        syn::Expr::Path(p) => {
            let ident = path_to_string(&p.path);
            if ident.contains("::") {
                Ok(Expr::Path(
                    ident.split("::").map(|s| s.to_string()).collect(),
                ))
            } else {
                Ok(Expr::Ident(ident))
            }
        }
        syn::Expr::Block(b) => parse_block(&b.block).map(Expr::Block),
        syn::Expr::If(if_expr) => {
            let cond = parse_expr(&if_expr.cond)?;
            let then_b = parse_block(&if_expr.then_branch)?;
            let else_b = if let Some((_, else_expr)) = &if_expr.else_branch {
                Some(Box::new(parse_expr(else_expr)?))
            } else {
                None
            };
            Ok(Expr::If(Box::new(cond), Box::new(Expr::Block(then_b)), else_b))
        }
        syn::Expr::Binary(bin) => {
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
        syn::Expr::Unary(un) => {
            let op = match &un.op {
                syn::UnOp::Neg(_) => UnOp::Neg,
                syn::UnOp::Not(_) => UnOp::Not,
                syn::UnOp::Deref(_) => UnOp::Deref,
                _ => return Err("unsupported unary operator".to_string()),
            };
            let operand = parse_expr(&un.expr)?;
            Ok(Expr::Unary(op, Box::new(operand)))
        }
        syn::Expr::Call(call) => {
            let func = parse_expr(&call.func)?;
            let args = call
                .args
                .iter()
                .map(parse_expr)
                .collect::<Result<Vec<_>, String>>()?;
            Ok(Expr::Call(Box::new(func), args))
        }
        syn::Expr::MethodCall(mc) => {
            let receiver = parse_expr(&mc.receiver)?;
            let method = mc.method.to_string();
            let args = mc
                .args
                .iter()
                .map(parse_expr)
                .collect::<Result<Vec<_>, String>>()?;
            Ok(Expr::MethodCall(Box::new(receiver), method, args))
        }
        syn::Expr::Field(f) => {
            let base = parse_expr(&f.base)?;
            Ok(Expr::Field(Box::new(base), member_to_string(&f.member)))
        }
        syn::Expr::Index(idx) => {
            let base = parse_expr(&idx.expr)?;
            let index_expr = parse_expr(&idx.index)?;
            Ok(Expr::Index(Box::new(base), Box::new(index_expr)))
        }
        syn::Expr::Struct(s) => {
            let name = path_to_string(&s.path);
            let fields = s
                .fields
                .iter()
                .map(|f| {
                    let fname = member_to_string(&f.member);
                    let expr = parse_expr(&f.expr)?;
                    Ok((fname, expr))
                })
                .collect::<Result<Vec<_>, String>>()?;
            Ok(Expr::StructLit(name, fields))
        }
        syn::Expr::Closure(c) => {
            let params = c
                .inputs
                .iter()
                .map(|pat| match pat {
                    syn::Pat::Ident(i) => Ok(i.ident.to_string()),
                    _ => Err("unsupported closure param".to_string()),
                })
                .collect::<Result<Vec<_>, String>>()?;
            let body = parse_expr(&c.body)?;
            Ok(Expr::Lambda(params, Box::new(body)))
        }
        syn::Expr::Range(r) => {
            let start = parse_expr(r.start.as_ref().expect("range should have start"))?;
            let end = parse_expr(r.end.as_ref().expect("range should have end"))?;
            Ok(Expr::Range(
                Box::new(start),
                Box::new(end),
                matches!(r.limits, syn::RangeLimits::Closed(_)),
            ))
        }
        syn::Expr::Try(t) => Ok(Expr::Try(Box::new(parse_expr(&t.expr)?))),
        syn::Expr::Match(m) => {
            let scrutinee = parse_expr(&m.expr)?;
            let arms = m
                .arms
                .iter()
                .map(|arm| {
                    let pat = parse_pat(&arm.pat)?;
                    let body = parse_expr(&arm.body)?;
                    Ok((pat, body))
                })
                .collect::<Result<Vec<_>, String>>()?;
            Ok(Expr::Match(Box::new(scrutinee), arms))
        }
        syn::Expr::Return(r) => {
            let val = r.expr.as_ref().map(|e| parse_expr(e)).transpose()?;
            Ok(Expr::Return(val.map(Box::new)))
        }
        syn::Expr::Break(_) => Ok(Expr::Break),
        syn::Expr::Continue(_) => Ok(Expr::Continue),
        syn::Expr::Assign(a) => {
            let lhs = parse_expr(&a.left)?;
            let rhs = parse_expr(&a.right)?;
            Ok(Expr::Assign(Box::new(lhs), Box::new(rhs)))
        }
        syn::Expr::Paren(p) => parse_expr(&p.expr),
        syn::Expr::Cast(c) => parse_expr(&c.expr),
        syn::Expr::Loop(l) => {
            let body = parse_block(&l.body)?;
            Ok(Expr::Loop(Box::new(Expr::Block(body))))
        }
        syn::Expr::While(w) => {
            let cond = parse_expr(&w.cond)?;
            let body = parse_block(&w.body)?;
            Ok(Expr::While(Box::new(cond), Box::new(Expr::Block(body))))
        }
        syn::Expr::ForLoop(f) => {
            let pat_name = match &*f.pat {
                syn::Pat::Ident(i) => i.ident.to_string(),
                _ => return Err("unsupported for pattern".to_string()),
            };
            let iter = parse_expr(&f.expr)?;
            let body = parse_block(&f.body)?;
            Ok(Expr::ForIn(
                pat_name,
                Box::new(iter),
                Box::new(Expr::Block(body)),
            ))
        }
        syn::Expr::Reference(r) => parse_expr(&r.expr),
        syn::Expr::Macro(m) => {
            let macro_name = path_to_string(&m.mac.path);
            let args = parse_macro_args(&m.mac.tokens)?;
            Ok(Expr::Call(Box::new(Expr::Ident(macro_name)), args))
        }
        _ => Err("unsupported expression".to_string()),
    }
}

/// Parse macro tokens as a comma-separated list of expressions.
/// Macros like println!("{}", x) have tokens `"{}", x` — a comma-separated sequence.
fn parse_macro_args(tokens: &proc_macro2::TokenStream) -> Result<Vec<Expr>, String> {
    if tokens.is_empty() {
        return Ok(vec![]);
    }
    // Try parsing as comma-separated list of expressions
    let parser = |input: ParseStream| {
        syn::punctuated::Punctuated::<syn::Expr, syn::Token![,]>::parse_separated_nonempty(input)
    };
    if let Ok(exprs) = parser.parse2(tokens.clone()) {
        let mut result = Vec::new();
        for expr in exprs {
            result.push(parse_expr(&expr)?);
        }
        return Ok(result);
    }
    // Try as single expression (e.g., vec![1, 2, 3] has tokens inside [...] which form one expr)
    if let Ok(expr) = syn::parse2::<syn::Expr>(tokens.clone()) {
        return Ok(vec![parse_expr(&expr)?]);
    }
    // Last resort: try as a single block expression (for macro_rules style calls)
    if let Ok(block) = syn::parse2::<syn::ExprBlock>(tokens.clone()) {
        return parse_block(&block.block).map(|stmts| {
            stmts.into_iter().map(|s| match s {
                Stmt::Expr(e) => e,
                other => Expr::Block(vec![other]),
            }).collect()
        });
    }
    Ok(vec![])
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

fn parse_pat(pat: &syn::Pat) -> Result<Pat, String> {
    match pat {
        syn::Pat::Wild(_) => Ok(Pat::Wild),
        syn::Pat::Ident(i) => Ok(Pat::Ident(i.ident.to_string())),
        syn::Pat::Lit(l) => parse_literal(&l.lit).map(Pat::Lit),
        syn::Pat::Struct(ps) => {
            let name = path_to_string(&ps.path);
            let args = ps
                .fields
                .iter()
                .map(|f| parse_pat(&f.pat))
                .collect::<Result<Vec<_>, String>>()?;
            Ok(Pat::Enum(name, args))
        }
        syn::Pat::TupleStruct(ts) => {
            let name = path_to_string(&ts.path);
            let args = ts
                .elems
                .iter()
                .map(parse_pat)
                .collect::<Result<Vec<_>, String>>()?;
            Ok(Pat::Enum(name, args))
        }
        syn::Pat::Tuple(t) => {
            let elems = t
                .elems
                .iter()
                .map(parse_pat)
                .collect::<Result<Vec<_>, String>>()?;
            Ok(Pat::Tuple(elems))
        }
        _ => Err("unsupported pattern".to_string()),
    }
}

fn parse_type(ty: &syn::Type) -> Result<TypeName, String> {
    match ty {
        syn::Type::Path(p) => {
            let ident = path_to_string(&p.path);
            if let Some(seg) = p.path.segments.last() {
                if let syn::PathArguments::AngleBracketed(args) = &seg.arguments {
                    let inner = args
                        .args
                        .iter()
                        .map(|a| match a {
                            syn::GenericArgument::Type(t) => parse_type(t),
                            syn::GenericArgument::Lifetime(_) => {
                                Ok(TypeName::Named("'static".to_string()))
                            }
                            _ => Err("unsupported generic argument".to_string()),
                        })
                        .collect::<Result<Vec<_>, String>>()?;
                    return Ok(TypeName::Generic(ident, inner));
                }
            }
            Ok(TypeName::Named(ident))
        }
        syn::Type::Reference(r) => {
            let inner = parse_type(&r.elem)?;
            Ok(TypeName::Ref(Box::new(inner), r.mutability.is_some()))
        }
        syn::Type::Slice(s) => {
            let inner = parse_type(&s.elem)?;
            Ok(TypeName::Slice(Box::new(inner)))
        }
        syn::Type::Tuple(t) => {
            let elems = t
                .elems
                .iter()
                .map(parse_type)
                .collect::<Result<Vec<_>, String>>()?;
            Ok(TypeName::Tuple(elems))
        }
        _ => Err("unsupported type".to_string()),
    }
}

fn path_to_string(path: &syn::Path) -> String {
    path.segments
        .iter()
        .map(|s| s.ident.to_string())
        .collect::<Vec<_>>()
        .join("::")
}

fn syn_type_to_string(ty: &syn::Type) -> String {
    match ty {
        syn::Type::Path(p) => {
            let base = path_to_string(&p.path);
            if let Some(seg) = p.path.segments.last() {
                if let syn::PathArguments::AngleBracketed(args) = &seg.arguments {
                    let inner: Vec<String> = args
                        .args
                        .iter()
                        .map(|a| match a {
                            syn::GenericArgument::Type(t) => syn_type_to_string(t),
                            syn::GenericArgument::Lifetime(lt) => format!("'{}", lt.ident),
                            _ => String::new(),
                        })
                        .collect();
                    return format!("{}<{}>", base, inner.join(", "));
                }
            }
            base
        }
        syn::Type::Reference(r) => {
            let mut s = String::from("&");
            if r.mutability.is_some() {
                s.push_str("mut ");
            }
            s.push_str(&syn_type_to_string(&r.elem));
            s
        }
        syn::Type::Slice(sl) => format!("[{}]", syn_type_to_string(&sl.elem)),
        syn::Type::Tuple(t) => {
            if t.elems.is_empty() {
                return "()".to_string();
            }
            let inner: Vec<String> = t.elems.iter().map(syn_type_to_string).collect();
            format!("({})", inner.join(", "))
        }
        _ => quote::quote!(#ty).to_string(),
    }
}

fn member_to_string(member: &syn::Member) -> String {
    match member {
        syn::Member::Named(ident) => ident.to_string(),
        syn::Member::Unnamed(index) => index.index.to_string(),
    }
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
