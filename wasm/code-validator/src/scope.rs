use std::collections::HashMap;
use crate::value::Value;

#[derive(Debug, Clone)]
pub struct Frame {
    pub vars: HashMap<String, Value>,
}

impl Frame {
    pub fn new() -> Self {
        Frame { vars: HashMap::new() }
    }
}

/// Scope chain: stack of frames, each able to shadow parent vars
pub struct Scope {
    frames: Vec<Frame>,
}

impl Scope {
    pub fn new() -> Self {
        Scope {
            frames: vec![Frame::new()],
        }
    }

    pub fn push_frame(&mut self) {
        self.frames.push(Frame::new());
    }

    pub fn pop_frame(&mut self) {
        // Keep at least the global frame
        if self.frames.len() > 1 {
            self.frames.pop();
        }
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

    /// Returns true if the variable is defined in any frame
    pub fn is_defined(&self, name: &str) -> bool {
        self.get(name).is_some()
    }

    /// Number of active frames
    pub fn depth(&self) -> usize {
        self.frames.len()
    }
}
