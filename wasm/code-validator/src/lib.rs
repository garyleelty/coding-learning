#![forbid(unsafe_code)]

use wasm_bindgen::prelude::*;

mod ast;
mod error;
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
    let program = match parse::parse_program(code) {
        Ok(p) => p,
        Err(e) => return InterpResult {
            success: false,
            output: None,
            warnings: vec![],
            errors: vec![e],
        },
    };

    let warnings = analysis::analyze(&program);

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
