use crate::ast::Program;

pub struct EvalContext;

impl EvalContext {
    pub fn new() -> Self {
        EvalContext
    }

    pub fn execute(&mut self, _program: &Program) -> Result<String, String> {
        Ok(String::new())
    }
}
