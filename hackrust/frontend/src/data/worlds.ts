import type { World } from '../types';

export const worlds: World[] = [
  {
    id: 'w00',
    name: '终端连接',
    phase: 0,
    description: '编程是什么、计算机基础、Rust 简介',
    levels: [
      {
        id: 'w00-l01',
        title: '什么是编程',
        type: 'choice',
        question: '编程的本质是什么？',
        options: [
          { id: 'a', text: '用计算机语言告诉计算机做什么', isCorrect: true },
          { id: 'b', text: '修理电脑硬件', isCorrect: false },
          { id: 'c', text: '上网浏览网页', isCorrect: false },
          { id: 'd', text: '安装软件', isCorrect: false },
        ],
        solution: 'a',
        explanation: '编程就是用特定的语言（编程语言）编写指令，告诉计算机要执行什么操作。',
      },
      {
        id: 'w00-l02',
        title: '为什么学 Rust',
        type: 'choice',
        question: 'Rust 语言的最大特点是什么？',
        options: [
          { id: 'a', text: '运行速度最快', isCorrect: false },
          { id: 'b', text: '内存安全且无垃圾回收', isCorrect: true },
          { id: 'c', text: '语法最简单', isCorrect: false },
          { id: 'd', text: '只能开发操作系统', isCorrect: false },
        ],
        solution: 'b',
        explanation: 'Rust 通过所有权系统在编译时保证内存安全，无需垃圾回收器，这在系统编程语言中是独一无二的。',
      },
      {
        id: 'w00-l03',
        title: '第一个程序',
        type: 'fill',
        question: '补全代码，让程序输出 "Hello, Hacker!"',
        code: 'fn main() {\n    println!("{}", ___);\n}',
        blanks: ['"Hello, Hacker!"', '"Goodbye"', '42', 'true'],
        blanksCount: 1,
        solution: '"Hello, Hacker!"',
        explanation: 'println! 是 Rust 的宏，用 {} 作为占位符，后面的参数会替换它。',
      },
      {
        id: 'w00-l04',
        title: '代码结构',
        type: 'order',
        question: '将以下代码行排列成正确的顺序：',
        shuffledLines: [
          '    println!("System online");',
          '}',
          'fn main() {',
          '// 启动黑客终端',
        ],
        solution: ['// 启动黑客终端', 'fn main() {', '    println!("System online");', '}'],
        explanation: 'Rust 程序从 main 函数开始执行。注释在函数之前，函数体用花括号包围。',
      },
      {
        id: 'w00-l05',
        title: '代码判断',
        type: 'judge',
        question: '这段代码能正常运行吗？',
        code: 'fn main() {\n    let x = 5;\n    println!("{}", x);\n}',
        judgeAnswer: true,
        solution: 'true',
        explanation: '这段代码完全正确！let 声明变量 x 为 5，然后用 println! 打印它。',
      },
    ],
    boss: {
      title: '终端启动器',
      description: '编写一个 main 函数，使用 println! 宏输出三行信息：\n1. "=== HACKRUST TERMINAL ==="\n2. "System: Online"\n3. "Ready to hack"',
      template: `fn main() {\n    // 在这里编写你的代码\n    \n}`,
      validation: {
        required: ['fn main', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: '=== HACKRUST TERMINAL ===\nSystem: Online\nReady to hack', description: '输出三行信息' },
        ],
      },
    },
  },
  {
    id: 'w01',
    name: '变量·数据工厂',
    phase: 1,
    description: '变量、可变性、常量、基本类型、shadowing',
    levels: [
      {
        id: 'w01-l01',
        title: '变量声明',
        type: 'choice',
        question: '在 Rust 中，如何声明一个不可变变量 x 等于 5？',
        options: [
          { id: 'a', text: 'let x = 5;', isCorrect: true },
          { id: 'b', text: 'var x = 5;', isCorrect: false },
          { id: 'c', text: 'int x = 5;', isCorrect: false },
          { id: 'd', text: 'x := 5;', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'Rust 使用 let 关键字声明变量，默认是不可变的。',
      },
      {
        id: 'w01-l02',
        title: '可变性',
        type: 'choice',
        question: '如何让变量 x 可以被修改？',
        options: [
          { id: 'a', text: 'let mut x = 5;', isCorrect: true },
          { id: 'b', text: 'let var x = 5;', isCorrect: false },
          { id: 'c', text: 'let change x = 5;', isCorrect: false },
          { id: 'd', text: 'let x mut = 5;', isCorrect: false },
        ],
        solution: 'a',
        explanation: '使用 mut 关键字让变量可变：let mut x = 5;',
      },
      {
        id: 'w01-l03',
        title: '常量',
        type: 'judge',
        question: '这段代码正确吗？\nconst MAX_LEVEL: u32 = 100;',
        code: 'const MAX_LEVEL: u32 = 100;',
        judgeAnswer: true,
        solution: 'true',
        explanation: '常量用 const 声明，必须标注类型，值在编译时确定。',
      },
      {
        id: 'w01-l04',
        title: '数据类型',
        type: 'fill',
        question: '补全代码，声明一个 32 位整数',
        code: 'let health: ___ = 100;',
        blanks: ['i32', 'f64', 'String', 'bool'],
        blanksCount: 1,
        solution: 'i32',
        explanation: 'i32 表示 32 位有符号整数，范围约 ±21 亿。',
      },
      {
        id: 'w01-l05',
        title: 'Shadowing',
        type: 'choice',
        question: '以下代码的输出是什么？\nlet x = 5;\nlet x = x + 1;\nprintln!("{}", x);',
        code: 'let x = 5;\nlet x = x + 1;\nprintln!("{}", x);',
        options: [
          { id: 'a', text: '5', isCorrect: false },
          { id: 'b', text: '6', isCorrect: true },
          { id: 'c', text: '编译错误', isCorrect: false },
          { id: 'd', text: '运行时错误', isCorrect: false },
        ],
        solution: 'b',
        explanation: 'Shadowing 允许重新声明同名变量，新变量覆盖旧变量。x 从 5 变成 6。',
      },
      {
        id: 'w01-l06',
        title: '类型推断',
        type: 'judge',
        question: 'Rust 可以自动推断变量类型吗？',
        code: 'let x = 42;  // Rust 自动推断为 i32',
        judgeAnswer: true,
        solution: 'true',
        explanation: 'Rust 有强大的类型推断能力，大多数情况下不需要显式标注类型。',
      },
      {
        id: 'w01-l07',
        title: '元组',
        type: 'fill',
        question: '补全代码，访问元组的第二个元素',
        code: 'let point = (10, 20);\nlet y = point.___;',
        blanks: ['.1', '.2', '[1]', '.second'],
        blanksCount: 1,
        solution: '.1',
        explanation: '元组用 .0 .1 .2 访问元素，索引从 0 开始。',
      },
      {
        id: 'w01-l08',
        title: '数组',
        type: 'order',
        question: '排列代码行，创建并打印数组：',
        shuffledLines: [
          'println!("{}", arr[0]);',
          'let arr = [1, 2, 3];',
          '// 创建数组',
        ],
        solution: ['// 创建数组', 'let arr = [1, 2, 3];', 'println!("{}", arr[0]);'],
        explanation: '数组用方括号定义，用索引访问元素。',
      },
    ],
    boss: {
      title: '数据计算器',
      description: '编写程序完成以下任务：\n1. 声明变量 hp = 100，类型为 i32\n2. 声明变量 damage = 25，类型为 i32\n3. 计算剩余生命值 remaining = hp - damage\n4. 打印 "Remaining HP: {remaining}"',
      template: `fn main() {\n    // 声明变量\n    \n    // 计算剩余生命值\n    \n    // 打印结果\n    \n}`,
      validation: {
        required: ['let', 'hp', 'damage', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 'Remaining HP: 75', description: '正确计算并打印' },
        ],
      },
    },
  },
];

export function getWorld(id: string): World | undefined {
  return worlds.find((w) => w.id === id);
}

export function getWorldsByPhase(phase: number): World[] {
  return worlds.filter((w) => w.phase === phase);
}
