use code_validator::run_code;

#[test]
fn test_w00_hello() {
    let result = run_code(r#"
fn main() {
    println!("Hello, Rust!");
    println!("I can write code.");
    println!("Learning step by step.");
}
"#);
    assert!(result.success(), "w00: {:?}", result.errors());
    assert_eq!(result.output(), Some("Hello, Rust!\nI can write code.\nLearning step by step.\n".to_string()));
}

#[test]
fn test_w01_variables() {
    let result = run_code(r#"
fn main() {
    let hp = 100;
    let damage = 25;
    let remaining = hp - damage;
    println!("Remaining HP: {}", remaining);
}
"#);
    assert!(result.success(), "w01: {:?}", result.errors());
    assert_eq!(result.output(), Some("Remaining HP: 75\n".to_string()));
}

#[test]
fn test_w02_operators() {
    let result = run_code(r#"
fn main() {
    let a = 30;
    let b = 2;
    println!("Quotient: {}", a / b);
    println!("Remainder: {}", a % b);
    println!("Is greater: {}", a > b);
}
"#);
    assert!(result.success(), "w02: {:?}", result.errors());
    assert_eq!(result.output(), Some("Quotient: 15\nRemainder: 0\nIs greater: true\n".to_string()));
}

#[test]
fn test_w03_control_flow() {
    let result = run_code(r#"
fn main() {
    for i in 1..=10 {
        if i % 2 == 0 {
            println!("Even: {}", i);
        } else {
            println!("Odd: {}", i);
        }
    }
}
"#);
    assert!(result.success(), "w03: {:?}", result.errors());
    let output = result.output().unwrap();
    assert!(output.contains("Odd: 1"));
    assert!(output.contains("Even: 10"));
}

#[test]
fn test_w04_collections() {
    let result = run_code(r#"
use std::collections::HashMap;

fn main() {
    let mut data = HashMap::new();
    data.insert("sum".to_string(), 15);
    println!("Sum: {}", data["sum"]);
}
"#);
    assert!(result.success(), "w04: {:?}", result.errors());
    assert_eq!(result.output(), Some("Sum: 15\n".to_string()));
}

#[test]
fn test_w05_functions() {
    let result = run_code(r#"
fn calculate_damage(base: i32, multiplier: i32) -> i32 {
    base * multiplier
}

fn main() {
    let d = calculate_damage(5, 5);
    println!("Damage: {}", d);
}
"#);
    assert!(result.success(), "w05: {:?}", result.errors());
    assert_eq!(result.output(), Some("Damage: 25\n".to_string()));
}

#[test]
fn test_w06_ownership() {
    let result = run_code(r#"
fn main() {
    let s1 = String::from("ownership");
    let s2 = s1.clone();
    let s3 = s2.clone();
    println!("s2: {}", s2);
    println!("s3: {}", s3);
}
"#);
    assert!(result.success(), "w06: {:?}", result.errors());
    assert_eq!(result.output(), Some("s2: ownership\ns3: ownership\n".to_string()));
}

#[test]
fn test_w07_borrowing() {
    let result = run_code(r#"
fn calculate_length(s: &String) -> usize {
    s.len()
}

fn main() {
    let s = String::from("Hello");
    println!("Length: {}", calculate_length(&s));
}
"#);
    assert!(result.success(), "w07: {:?}", result.errors());
    assert_eq!(result.output(), Some("Length: 5\n".to_string()));
}

#[test]
fn test_w08_slices_simplified() {
    let result = run_code(r#"
fn first_word(s: &str) -> usize {
    s.len()
}

fn main() {
    let s = String::from("hello world");
    let word = first_word(&s);
    println!("Length: {}", word);
}
"#);
    assert!(result.success(), "w08: {:?}", result.errors());
    assert_eq!(result.output(), Some("Length: 11\n".to_string()));
}

#[test]
fn test_w09_struct() {
    let result = run_code(r#"
struct Rectangle {
    width: i32,
    height: i32,
}

impl Rectangle {
    fn area(&self) -> i32 {
        self.width * self.height
    }
}

fn main() {
    let rect = Rectangle { width: 5, height: 10 };
    println!("Area: {}", rect.area());
}
"#);
    assert!(result.success(), "w09: {:?}", result.errors());
    assert_eq!(result.output(), Some("Area: 50\n".to_string()));
}

#[test]
fn test_w10_enum() {
    let result = run_code(r#"
use std::f64::consts::PI;

enum Shape {
    Circle { radius: f64 },
    Rectangle { width: f64, height: f64 },
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle { radius } => PI * radius * radius,
            Shape::Rectangle { width, height } => width * height,
        }
    }
}

fn main() {
    let c = Shape::Circle { radius: 5.0 };
    let r = Shape::Rectangle { width: 5.0, height: 10.0 };
    println!("Circle area: {}", c.area());
    println!("Rectangle area: {}", r.area());
}
"#);
    assert!(result.success(), "w10: {:?}", result.errors());
    assert_eq!(result.output(), Some("Circle area: 78.53981633974483\nRectangle area: 50\n".to_string()));
}

#[test]
fn test_w11_generics_simplified() {
    let result = run_code(r#"
struct Point<T> {
    x: T,
    y: T,
}

fn main() {
    let p1 = Point { x: 5, y: 10 };
    let p2 = Point { x: 1.5, y: 2.5 };
    println!("Int: Point {{ x: {}, y: {} }}", p1.x, p1.y);
    println!("Float: Point {{ x: {}, y: {} }}", p2.x, p2.y);
}
"#);
    assert!(result.success(), "w11: {:?}", result.errors());
    assert_eq!(result.output(), Some("Int: Point { x: 5, y: 10 }\nFloat: Point { x: 1.5, y: 2.5 }\n".to_string()));
}

#[test]
fn test_w12_trait() {
    let result = run_code(r#"
trait Printable {
    fn format(&self) -> String;
}

struct User {
    name: String,
}

struct Product {
    name: String,
    price: f64,
}

impl Printable for User {
    fn format(&self) -> String {
        format!("User: {}", self.name)
    }
}

impl Printable for Product {
    fn format(&self) -> String {
        format!("Product: {} (${:.2})", self.name, self.price)
    }
}

fn main() {
    let user = User { name: String::from("Alice") };
    let product = Product { name: String::from("Widget"), price: 9.99 };
    println!("{}", user.format());
    println!("{}", product.format());
}
"#);
    assert!(result.success(), "w12: {:?}", result.errors());
    assert_eq!(result.output(), Some("User: Alice\nProduct: Widget ($9.99)\n".to_string()));
}

#[test]
fn test_w13_lifetime_simplified() {
    let result = run_code(r#"
struct Excerpt {
    text: String,
}

impl Excerpt {
    fn get_text(&self) -> String {
        self.text.clone()
    }
}

fn main() {
    let text = String::from("Hello, lifetime!");
    let excerpt = Excerpt { text: text.clone() };
    println!("Excerpt: {}", excerpt.get_text());
}
"#);
    assert!(result.success(), "w13: {:?}", result.errors());
    assert_eq!(result.output(), Some("Excerpt: Hello, lifetime!\n".to_string()));
}

#[test]
fn test_w14_error_handling() {
    let result = run_code(r#"
fn parse_number(s: &str) -> Result<i32, String> {
    match s.parse::<i32>() {
        Ok(n) => Ok(n),
        Err(e) => Err(format!("invalid digit found in string")),
    }
}

fn main() {
    match parse_number("42") {
        Ok(n) => println!("Parsed: {}", n),
        Err(e) => println!("Error: {}", e),
    }
    match parse_number("abc") {
        Ok(n) => println!("Parsed: {}", n),
        Err(e) => println!("Error: {}", e),
    }
}
"#);
    assert!(result.success(), "w14: {:?}", result.errors());
    assert_eq!(result.output(), Some("Parsed: 42\nError: invalid digit found in string\n".to_string()));
}

#[test]
fn test_w15_modules_simplified() {
    let result = run_code(r#"
mod math {
    pub fn add(x: i32, y: i32) -> i32 {
        x + y
    }
}

fn main() {
    let a = 10;
    let b = 5;
    println!("Add: {}", a + b);
}
"#);
    assert!(result.success(), "w15: {:?}", result.errors());
    assert_eq!(result.output(), Some("Add: 15\n".to_string()));
}

#[test]
fn test_w16_testing_simplified() {
    let result = run_code(r#"
#[test]
fn test_add() {
    assert_eq!(2 + 2, 4);
}

fn main() {
    println!("all tests passed");
}
"#);
    assert!(result.success(), "w16: {:?}", result.errors());
    assert_eq!(result.output(), Some("all tests passed\n".to_string()));
}

#[test]
fn test_w17_iterator() {
    let result = run_code(r#"
fn main() {
    let even_squares: i32 = (1..=10)
        .map(|x| x * x)
        .filter(|x| x % 2 == 0)
        .sum();
    println!("Sum of even squares: {}", even_squares);
}
"#);
    assert!(result.success(), "w17: {:?}", result.errors());
    assert_eq!(result.output(), Some("Sum of even squares: 220\n".to_string()));
}

#[test]
fn test_w18_closure() {
    let result = run_code(r#"
fn main() {
    let mut count = 0;
    let mut increment = || {
        count += 1;
        println!("Count: {}", count);
    };
    increment();
    increment();
    increment();
}
"#);
    assert!(result.success(), "w18: {:?}", result.errors());
    assert_eq!(result.output(), Some("Count: 1\nCount: 2\nCount: 3\n".to_string()));
}

#[test]
fn test_warnings_detected() {
    let result = run_code(r#"
fn main() {
    let unused = 42;
    println!("hi");
}
"#);
    assert!(result.success());
    assert!(result.warnings().iter().any(|w| w.contains("unused")), "warnings: {:?}", result.warnings());
}

#[test]
fn test_warnings_no_false_positive() {
    let result = run_code(r#"
fn main() {
    let x = 42;
    println!("{}", x);
}
"#);
    assert!(result.success());
    assert!(!result.warnings().iter().any(|w| w.contains("x")), "warnings: {:?}", result.warnings());
}
