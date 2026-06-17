use crate::value::Value;

/// Format a string with {} and {:?} and {:.prec} placeholders
/// This handles the format string processing that println!/print!/format! use.
pub fn format_stdout(args: &[Value], format_str: &str) -> String {
    let mut result = String::new();
    let mut args_iter = args.iter();
    let mut chars = format_str.chars().peekable();

    while let Some(ch) = chars.next() {
        if ch == '{' {
            match chars.peek() {
                Some('{') => {
                    // Escaped brace {{ → {
                    chars.next();
                    result.push('{');
                }
                Some('}') => {
                    // {} — use next argument with Display
                    chars.next();
                    if let Some(arg) = args_iter.next() {
                        result.push_str(&arg.to_string());
                    }
                }
                Some(':') => {
                    // {:?} or {:.2} or {:.prec}
                    chars.next(); // consume ':'
                    let mut spec = String::new();
                    loop {
                        match chars.next() {
                            Some('}') => break,
                            Some(c) => spec.push(c),
                            None => break,
                        }
                    }
                    if let Some(arg) = args_iter.next() {
                        if spec == "?" {
                            // Debug formatting — use Display for now
                            result.push_str(&arg.to_string());
                        } else if spec.starts_with('.') {
                            // Precision formatting: {:.2}
                            if let Ok(precision) = spec[1..].parse::<usize>() {
                                match arg {
                                    Value::Float(f) => {
                                        result.push_str(&format!("{:.prec$}", f, prec = precision));
                                    }
                                    _ => {
                                        result.push_str(&arg.to_string());
                                    }
                                }
                            } else {
                                result.push_str(&arg.to_string());
                            }
                        } else {
                            result.push_str(&arg.to_string());
                        }
                    }
                }
                _ => {
                    result.push(ch);
                }
            }
        } else if ch == '}' {
            if matches!(chars.peek(), Some('}')) {
                chars.next();
                result.push('}');
            } else {
                result.push(ch);
            }
        } else {
            result.push(ch);
        }
    }
    result
}

/// Check if a function name is a built-in macro and return its short name
/// Macros appear as both "println" (from syn::Stmt::Macro path) and "println!" (from ! expr)
pub fn is_print_macro(name: &str) -> Option<&'static str> {
    match name.trim_end_matches('!') {
        "println" => Some("println"),
        "print" => Some("print"),
        "format" => Some("format"),
        "assert_eq" => Some("assert_eq"),
        "vec" => Some("vec"),
        _ => None,
    }
}
