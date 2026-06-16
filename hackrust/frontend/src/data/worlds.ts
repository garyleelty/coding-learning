import type { World } from '../types';

export const worlds: World[] = [
  {
    id: 'w00',
    name: '从零开始：让程序说话',
    phase: 0,
    description: '认识程序、main 函数和 println! 输出',
    levels: [
      {
        id: 'w00-l01',
        title: '程序是在做什么',
        type: 'choice',
        lesson: '你可以把程序想成一张“步骤清单”。我们写代码，就是把步骤清楚地告诉计算机。',
        hint: '关键词是“告诉计算机做什么”。',
        question: '编程的本质是什么？',
        options: [
          { id: 'a', text: '用计算机语言告诉计算机做什么', isCorrect: true },
          { id: 'b', text: '修理电脑硬件', isCorrect: false },
          { id: 'c', text: '上网浏览网页', isCorrect: false },
          { id: 'd', text: '安装软件', isCorrect: false },
        ],
        solution: 'a',
        explanation: '编程就是写出清楚的指令，让计算机按步骤完成任务。',
      },
      {
        id: 'w00-l02',
        title: 'Rust 是一种语言',
        type: 'choice',
        lesson: '计算机语言有很多种，比如 JavaScript、Python、Rust。Rust 常用于写可靠、速度快的程序。',
        hint: 'Rust 的常见特点是安全和高性能。',
        question: '下面哪句话更适合描述 Rust？',
        options: [
          { id: 'a', text: '一种常用于可靠和高性能程序的编程语言', isCorrect: true },
          { id: 'b', text: '一种图片格式', isCorrect: false },
          { id: 'c', text: '只能用来玩游戏', isCorrect: false },
          { id: 'd', text: '电脑硬件的名字', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'Rust 是一门编程语言，它重视安全、速度和可靠性。',
      },
      {
        id: 'w00-l03',
        title: '输出一句话',
        type: 'fill',
        lesson: 'println! 可以把文字显示到屏幕上。文字需要放在英文双引号里。',
        hint: '选择带英文双引号的完整文字。',
        question: '补全代码，让程序输出 "Hello, Hacker!"',
        code: 'fn main() {\n    println!("{}", ___);\n}',
        blanks: ['"Hello, Hacker!"', '"Goodbye"', '42', 'true'],
        blanksCount: 1,
        solution: '"Hello, Hacker!"',
        explanation: 'println! 是 Rust 的宏，用 {} 作为占位符，后面的参数会替换它。',
      },
      {
        id: 'w00-l04',
        title: 'main 是入口',
        type: 'order',
        lesson: 'Rust 程序通常从 fn main() 开始运行。花括号 { } 里面放要执行的代码。',
        hint: '先写注释，再写 fn main()，然后写函数体里的输出，最后用 } 结束。',
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
        title: '读懂一个小程序',
        type: 'judge',
        lesson: 'let x = 5; 表示创建一个叫 x 的值。println!("{}", x) 会把 x 的值显示出来。',
        hint: 'x 已经被创建，然后被打印，所以这段代码可以运行。',
        question: '这段代码能正常运行吗？',
        code: 'fn main() {\n    let x = 5;\n    println!("{}", x);\n}',
        judgeAnswer: true,
        solution: 'true',
        explanation: '这段代码完全正确！let 声明变量 x 为 5，然后用 println! 打印它。',
      },
    ],
    boss: {
      title: '第一次输出任务',
      description: '照着目标输出三行文字。你只需要在 main 函数里写 3 行 println!：\n1. "Hello, Rust!"\n2. "I can write code."\n3. "Learning step by step."',
      template: `fn main() {\n    println!("Hello, Rust!");\n    // 再写两行 println!\n}`,
      validation: {
        required: ['fn main', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 'Hello, Rust!\nI can write code.\nLearning step by step.', description: '输出三行入门文字' },
        ],
      },
    },
  },
  {
    id: 'w01',
    name: '变量：给数据起名字',
    phase: 1,
    description: 'let、mut、类型和简单计算',
    levels: [
      {
        id: 'w01-l01',
        title: '变量声明',
        type: 'choice',
        lesson: '变量就是给一个值起名字。Rust 里最常见的写法是 let 名字 = 值;',
        hint: 'Rust 创建变量通常从 let 开始。',
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
        lesson: 'Rust 默认变量不能改。如果你希望之后修改它，需要加 mut。',
        hint: 'mut 是 mutable 的缩写，表示“可以改变”。',
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
        lesson: '常量用 const 声明，通常用于不会变化的固定值。Rust 要求常量写出类型。',
        hint: '这段代码有 const、名字、类型和值。',
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
        lesson: '类型说明一个值是什么种类。i32 表示 32 位整数，适合表示 100 这样的数字。',
        hint: '100 是整数，不是文字、真假值或小数。',
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
        lesson: 'Rust 允许再次使用 let 创建同名变量。新变量会“遮住”旧变量，这叫 shadowing。',
        hint: '先是 5，再用旧的 x + 1 得到新的 x。',
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
        lesson: '很多时候 Rust 能从右边的值猜出类型。let x = 42; 通常会被推断成整数。',
        hint: 'Rust 不总是要求你手写类型。',
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
        lesson: '元组可以把几个值放在一起。访问元组元素时，从 .0 开始数。第二个元素是 .1。',
        hint: '编程里很多编号从 0 开始。',
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
        lesson: '数组是一组同类数据。先创建数组，再用 arr[0] 访问第一个元素。',
        hint: '先有数组，才能打印数组里的内容。',
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
      title: '变量练习任务',
      description: '跟着模板完成变量练习：\n1. 创建 hp = 100\n2. 创建 damage = 25\n3. 创建 remaining = hp - damage\n4. 输出 "Remaining HP: 75"',
      template: `fn main() {\n    let hp = 100;\n    let damage = 25;\n    // 创建 remaining\n    \n    println!("Remaining HP: 75");\n}`,
      validation: {
        required: ['let', 'hp', 'damage', 'remaining', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 'Remaining HP: 75', description: '正确计算并打印' },
        ],
      },
    },
  },
  {
    id: 'w02',
    name: '运算符：指令解码',
    phase: 1,
    description: '算术运算、比较、布尔逻辑、位运算、类型转换',
    levels: [
      {
        id: 'w02-l01',
        title: '算术运算',
        type: 'choice',
        lesson: 'Rust 支持 +、-、*、/、%（取余）五种算术运算。两个整数相除会丢弃小数部分。',
        hint: '10 / 3 的结果是整数，不是小数。',
        question: '以下代码的输出是什么？\nlet result = 10 / 3;\nprintln!("{}", result);',
        code: 'let result = 10 / 3;\nprintln!("{}", result);',
        options: [
          { id: 'a', text: '3', isCorrect: true },
          { id: 'b', text: '3.33', isCorrect: false },
          { id: 'c', text: '4', isCorrect: false },
          { id: 'd', text: '编译错误', isCorrect: false },
        ],
        solution: 'a',
        explanation: '整数相除会向下取整，10 / 3 = 3。',
      },
      {
        id: 'w02-l02',
        title: '取余运算',
        type: 'fill',
        lesson: '% 是取余运算符，计算除法后的余数。10 % 3 等于 1。',
        hint: '10 除以 3 商 3 余 1。',
        question: '补全代码，计算 10 除以 3 的余数',
        code: 'let remainder = 10 ___ 3;\nprintln!("{}", remainder);',
        blanks: ['%', '/', 'mod', 'rem'],
        blanksCount: 1,
        solution: '%',
        explanation: '% 是取余运算符，10 % 3 = 1。',
      },
      {
        id: 'w02-l03',
        title: '比较运算',
        type: 'choice',
        lesson: '比较运算符（==、!=、<、>、<=、>=）返回布尔值 true 或 false。',
        hint: '== 是比较，= 是赋值。',
        question: '以下代码的输出是什么？\nlet x = 5;\nprintln!("{}", x > 3);',
        code: 'let x = 5;\nprintln!("{}", x > 3);',
        options: [
          { id: 'a', text: 'true', isCorrect: true },
          { id: 'b', text: 'false', isCorrect: false },
          { id: 'c', text: '5', isCorrect: false },
          { id: 'd', text: '编译错误', isCorrect: false },
        ],
        solution: 'a',
        explanation: '5 > 3 为真，所以输出 true。',
      },
      {
        id: 'w02-l04',
        title: '布尔逻辑',
        type: 'judge',
        lesson: '&&（与）、||（或）、!（非）是布尔运算符。&& 两个都为真才为真，|| 一个为真就为真。',
        hint: 'true && false 的结果是什么？',
        question: '这段代码的输出是 true 还是 false？\nlet a = true;\nlet b = false;\nprintln!("{}", a && b);',
        code: 'let a = true;\nlet b = false;\nprintln!("{}", a && b);',
        judgeAnswer: false,
        solution: 'false',
        explanation: 'true && false = false。&& 要求两边都为真。',
      },
      {
        id: 'w02-l05',
        title: '复合赋值',
        type: 'order',
        lesson: '+=、-=、*=、/= 是复合赋值运算符。x += 1 等价于 x = x + 1。',
        hint: '先声明变量，再用 += 修改，最后打印。',
        question: '排列代码行，使用 += 将 x 从 10 增加到 15：',
        shuffledLines: [
          'println!("{}", x);',
          'let mut x = 10;',
          'x += 5;',
        ],
        solution: ['let mut x = 10;', 'x += 5;', 'println!("{}", x);'],
        explanation: 'x 从 10 开始，+= 5 后变成 15。',
      },
      {
        id: 'w02-l06',
        title: '类型转换',
        type: 'fill',
        lesson: 'as 关键字可以进行类型转换。let y = x as f64; 把整数转成浮点数。',
        hint: 'Rust 用一个关键字做类型转换。',
        question: '补全代码，将整数转换为浮点数',
        code: 'let x: i32 = 42;\nlet y: f64 = x ___ f64;',
        blanks: ['as', 'to', 'into', 'convert'],
        blanksCount: 1,
        solution: 'as',
        explanation: 'as 是 Rust 的类型转换关键字。',
      },
      {
        id: 'w02-l07',
        title: '溢出处理',
        type: 'choice',
        lesson: 'Rust 在 debug 模式下会检查整数溢出并 panic。在 release 模式下会回绕。',
        hint: '想想 255 + 1 在 u8 类型下会怎样。',
        question: 'u8 类型的最大值是多少？',
        options: [
          { id: 'a', text: '255', isCorrect: true },
          { id: 'b', text: '256', isCorrect: false },
          { id: 'c', text: '127', isCorrect: false },
          { id: 'd', text: '1000', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'u8 是无符号 8 位整数，范围是 0-255。',
      },
      {
        id: 'w02-l08',
        title: '位运算',
        type: 'judge',
        lesson: '位运算符（&、|、^、!、<<、>>）直接操作二进制位。常用于底层编程。',
        hint: '5 的二进制是 101，3 的二进制是 011。',
        question: '5 & 3 的结果是什么？（& 是按位与）',
        code: 'let result = 5 & 3;\nprintln!("{}", result);',
        judgeAnswer: true,
        solution: 'true',
        explanation: '5 = 101, 3 = 011, 按位与得到 001 = 1。代码能正常运行。',
      },
    ],
    boss: {
      title: '运算符练习任务',
      description: '完成以下计算任务：\n1. 计算 100 / 7 的商\n2. 计算 100 % 7 的余数\n3. 判断 100 是否大于 50\n4. 输出三个结果',
      template: `fn main() {\n    let quotient = 100 / 7;\n    let remainder = 100 % 7;\n    let is_greater = 100 > 50;\n    \n    println!("Quotient: {}", quotient);\n    println!("Remainder: {}", remainder);\n    println!("Is greater: {}", is_greater);\n}`,
      validation: {
        required: ['/', '%', '>', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 'Quotient: 14\nRemainder: 2\nIs greater: true', description: '计算并输出三个结果' },
        ],
      },
    },
  },
  {
    id: 'w03',
    name: '流程控制：中枢系统',
    phase: 1,
    description: 'if/else、loop、while、for、break/continue、match 入门',
    levels: [
      {
        id: 'w03-l01',
        title: 'if 表达式',
        type: 'choice',
        lesson: 'if 用来做条件判断。条件为 true 时执行花括号里的代码。',
        hint: '注意条件后面没有分号。',
        question: '以下代码的输出是什么？\nlet x = 10;\nif x > 5 {\n    println!("big");\n}',
        code: 'let x = 10;\nif x > 5 {\n    println!("big");\n}',
        options: [
          { id: 'a', text: 'big', isCorrect: true },
          { id: 'b', text: '无输出', isCorrect: false },
          { id: 'c', text: '编译错误', isCorrect: false },
          { id: 'd', text: '运行时错误', isCorrect: false },
        ],
        solution: 'a',
        explanation: '10 > 5 为真，所以执行 println! 输出 "big"。',
      },
      {
        id: 'w03-l02',
        title: 'if-else',
        type: 'fill',
        lesson: 'if-else 提供两个分支：条件为真执行 if 块，否则执行 else 块。',
        hint: 'else 关键字跟在 if 块的花括号后面。',
        question: '补全代码，使用 if-else 判断奇偶',
        code: 'let x = 7;\nif x % 2 == 0 {\n    println!("even");\n} ___ {\n    println!("odd");\n}',
        blanks: ['else', 'elif', 'otherwise', 'default'],
        blanksCount: 1,
        solution: 'else',
        explanation: 'else 是 if 的"否则"分支。',
      },
      {
        id: 'w03-l03',
        title: 'else if',
        type: 'order',
        lesson: '多个条件可以用 else if 链接。Rust 会从上到下检查，执行第一个为真的分支。',
        hint: '先检查最高分，再检查中等，最后是低分。',
        question: '排列代码行，用 else if 判断分数等级：',
        shuffledLines: [
          '    println!("C");',
          '} else if score >= 80 {',
          'if score >= 90 {',
          '    println!("A");',
          '} else {',
          '    println!("B");',
          '}',
        ],
        solution: [
          'if score >= 90 {',
          '    println!("A");',
          '} else if score >= 80 {',
          '    println!("B");',
          '} else {',
          '    println!("C");',
          '}',
        ],
        explanation: '条件从高到低排列，else 处理剩余情况。',
      },
      {
        id: 'w03-l04',
        title: 'loop 循环',
        type: 'choice',
        lesson: 'loop 创建无限循环，必须用 break 跳出。',
        hint: 'loop 会一直执行，直到遇到 break。',
        question: '以下代码输出什么？\nlet mut x = 0;\nloop {\n    x += 1;\n    if x == 3 { break; }\n}\nprintln!("{}", x);',
        code: 'let mut x = 0;\nloop {\n    x += 1;\n    if x == 3 { break; }\n}\nprintln!("{}", x);',
        options: [
          { id: 'a', text: '3', isCorrect: true },
          { id: 'b', text: '2', isCorrect: false },
          { id: 'c', text: '无限循环', isCorrect: false },
          { id: 'd', text: '0', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'x 从 0 开始，每次 +1，当 x == 3 时 break 跳出循环。',
      },
      {
        id: 'w03-l05',
        title: 'while 循环',
        type: 'judge',
        lesson: 'while 在条件为真时重复执行。比 loop + if 更简洁。',
        hint: 'while 条件为 false 时停止。',
        question: '这段代码能正常运行吗？\nlet mut x = 5;\nwhile x > 0 {\n    println!("{}", x);\n    x -= 1;\n}',
        code: 'let mut x = 5;\nwhile x > 0 {\n    println!("{}", x);\n    x -= 1;\n}',
        judgeAnswer: true,
        solution: 'true',
        explanation: 'while 循环在 x > 0 时执行，每次 x 减 1，直到 x 为 0。',
      },
      {
        id: 'w03-l06',
        title: 'for 循环',
        type: 'fill',
        lesson: 'for 循环遍历一个范围或集合。0..5 表示从 0 到 4（不含 5）。',
        hint: '.. 创建范围，..= 包含结束值。',
        question: '补全代码，遍历 0 到 4',
        code: 'for i ___ 5 {\n    println!("{}", i);\n}',
        blanks: ['in 0..', 'in 0..=', 'from 0..', 'of 0..'],
        blanksCount: 1,
        solution: 'in 0..',
        explanation: 'for i in 0..5 遍历 0, 1, 2, 3, 4。',
      },
      {
        id: 'w03-l07',
        title: 'break 和 continue',
        type: 'choice',
        lesson: 'break 立即跳出循环，continue 跳过本次迭代进入下一次。',
        hint: 'continue 跳过当前，继续下一轮。',
        question: '以下代码输出什么？\nfor i in 0..5 {\n    if i == 2 { continue; }\n    println!("{}", i);\n}',
        code: 'for i in 0..5 {\n    if i == 2 { continue; }\n    println!("{}", i);\n}',
        options: [
          { id: 'a', text: '0 1 3 4', isCorrect: true },
          { id: 'b', text: '0 1 2 3 4', isCorrect: false },
          { id: 'c', text: '0 1', isCorrect: false },
          { id: 'd', text: '0 1 2', isCorrect: false },
        ],
        solution: 'a',
        explanation: '当 i == 2 时 continue 跳过，所以不打印 2。',
      },
      {
        id: 'w03-l08',
        title: 'match 表达式',
        type: 'order',
        lesson: 'match 类似 switch，匹配值并执行对应分支。_ 是通配符，匹配剩余情况。',
        hint: 'match 后面跟值，每个分支用 => 连接。',
        question: '排列代码行，用 match 判断数字：',
        shuffledLines: [
          '    _ => println!("other"),',
          '}',
          'match x {',
          '    1 => println!("one"),',
          '    2 => println!("two"),',
        ],
        solution: [
          'match x {',
          '    1 => println!("one"),',
          '    2 => println!("two"),',
          '    _ => println!("other"),',
          '}',
        ],
        explanation: 'match 每个分支用逗号分隔，_ 匹配所有其他情况。',
      },
    ],
    boss: {
      title: '流程控制挑战',
      description: '编写一个程序：\n1. 用 for 循环遍历 1 到 10\n2. 用 if 判断：如果是偶数，输出 "Even: X"\n3. 如果是奇数，输出 "Odd: X"',
      template: `fn main() {\n    for i in 1..=10 {\n        // 在这里写 if-else 判断\n        \n    }\n}`,
      validation: {
        required: ['for', 'if', 'else', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          {
            input: '',
            expected: 'Odd: 1\nEven: 2\nOdd: 3\nEven: 4\nOdd: 5\nEven: 6\nOdd: 7\nEven: 8\nOdd: 9\nEven: 10',
            description: '输出 1-10 的奇偶判断',
          },
        ],
      },
    },
  },
  {
    id: 'w04',
    name: '集合类型：数据仓库',
    phase: 1,
    description: '元组、数组、Vec、HashMap、String',
    levels: [
      {
        id: 'w04-l01',
        title: '元组回顾',
        type: 'choice',
        lesson: '元组可以包含不同类型的值。用 .0 .1 .2 访问元素。',
        hint: '元组用圆括号定义。',
        question: '如何访问元组 let t = (1, "hello", true); 的第二个元素？',
        options: [
          { id: 'a', text: 't.1', isCorrect: true },
          { id: 'b', text: 't[1]', isCorrect: false },
          { id: 'c', text: 't.2', isCorrect: false },
          { id: 'd', text: 't(1)', isCorrect: false },
        ],
        solution: 'a',
        explanation: '元组用 .0 .1 .2 访问，索引从 0 开始。',
      },
      {
        id: 'w04-l02',
        title: '数组固定长度',
        type: 'judge',
        lesson: '数组长度固定，所有元素类型相同。[i32; 5] 表示 5 个 i32 的数组。',
        hint: '数组长度在编译时确定。',
        question: '这段代码正确吗？\nlet arr: [i32; 3] = [1, 2, 3];',
        code: 'let arr: [i32; 3] = [1, 2, 3];',
        judgeAnswer: true,
        solution: 'true',
        explanation: '数组类型是 [元素类型; 长度]，这里定义了 3 个 i32。',
      },
      {
        id: 'w04-l03',
        title: 'Vec 动态数组',
        type: 'fill',
        lesson: 'Vec 是动态数组，可以增长。用 vec! 宏或 Vec::new() 创建。',
        hint: 'vec! 宏可以快速创建 Vec。',
        question: '补全代码，创建一个包含 1, 2, 3 的 Vec',
        code: 'let v = ___![1, 2, 3];',
        blanks: ['vec', 'Vec', 'array', 'list'],
        blanksCount: 1,
        solution: 'vec',
        explanation: 'vec! 宏创建 Vec，类似 println! 是宏。',
      },
      {
        id: 'w04-l04',
        title: 'Vec 操作',
        type: 'order',
        lesson: 'Vec 用 push() 添加元素，pop() 移除最后一个，len() 获取长度。',
        hint: '先创建 Vec，再添加元素，最后打印长度。',
        question: '排列代码行，创建 Vec 并添加元素：',
        shuffledLines: [
          'v.push(30);',
          'println!("Length: {}", v.len());',
          'let mut v = vec![10, 20];',
        ],
        solution: ['let mut v = vec![10, 20];', 'v.push(30);', 'println!("Length: {}", v.len());'],
        explanation: 'Vec 用 push 添加元素，len 获取长度。',
      },
      {
        id: 'w04-l05',
        title: 'HashMap',
        type: 'fill',
        lesson: 'HashMap 存储键值对。用 HashMap::new() 创建，insert() 添加。',
        hint: '需要先 use std::collections::HashMap;',
        question: '补全代码，创建 HashMap',
        code: 'use std::collections::HashMap;\n\nlet mut scores = ___::new();\nscores.insert("Alice", 100);',
        blanks: ['HashMap', 'Map', 'Vec', 'Array'],
        blanksCount: 1,
        solution: 'HashMap',
        explanation: 'HashMap::new() 创建新的哈希映射。',
      },
      {
        id: 'w04-l06',
        title: 'String 类型',
        type: 'choice',
        lesson: 'Rust 有两种字符串：String（可增长）和 &str（字符串切片）。',
        hint: 'String::from() 从 &str 创建 String。',
        question: '以下哪种方式可以创建 String？',
        options: [
          { id: 'a', text: 'String::from("hello")', isCorrect: true },
          { id: 'b', text: 'String("hello")', isCorrect: false },
          { id: 'c', text: 'new String("hello")', isCorrect: false },
          { id: 'd', text: 'string("hello")', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'String::from("hello") 从字符串字面量创建 String。',
      },
      {
        id: 'w04-l07',
        title: '字符串拼接',
        type: 'judge',
        lesson: 'String 可以用 push_str() 追加，也可以用 + 运算符拼接。',
        hint: '+ 运算符左边是 String，右边是 &str。',
        question: '这段代码能运行吗？\nlet mut s = String::from("Hello");\ns.push_str(", world!");',
        code: 'let mut s = String::from("Hello");\ns.push_str(", world!");',
        judgeAnswer: true,
        solution: 'true',
        explanation: 'push_str() 追加字符串切片到 String 末尾。',
      },
      {
        id: 'w04-l08',
        title: '遍历集合',
        type: 'order',
        lesson: 'for 循环可以遍历 Vec、数组等集合。&v 表示借用，不获取所有权。',
        hint: 'for item in &collection {} 遍历集合。',
        question: '排列代码行，遍历并打印 Vec：',
        shuffledLines: [
          '}',
          'for num in &v {',
          'let v = vec![1, 2, 3];',
          '    println!("{}", num);',
        ],
        solution: ['let v = vec![1, 2, 3];', 'for num in &v {', '    println!("{}", num);', '}'],
        explanation: 'for num in &v 借用 Vec 的每个元素。',
      },
    ],
    boss: {
      title: '集合类型挑战',
      description: '编写一个程序：\n1. 创建一个 Vec，包含数字 1 到 5\n2. 创建一个 HashMap，存储 "sum" -> Vec 元素的和\n3. 输出 "Sum: 15"',
      template: `use std::collections::HashMap;

fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    
    // 计算总和
    let mut sum = 0;
    for num in &numbers {
        sum += num;
    }
    
    // 创建 HashMap
    let mut data = HashMap::new();
    data.insert("sum", sum);
    
    println!("Sum: {}", data["sum"]);
}`,
      validation: {
        required: ['vec!', 'HashMap', 'for', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 'Sum: 15', description: '计算并输出总和' },
        ],
      },
    },
  },
  {
    id: 'w05',
    name: '函数：武器指令集',
    phase: 1,
    description: '函数定义、参数、返回值、表达式 vs 语句',
    levels: [
      {
        id: 'w05-l01',
        title: '函数定义',
        type: 'order',
        lesson: '用 fn 定义函数。函数名用蛇形命名法（snake_case）。',
        hint: '先写 fn，再写函数名和参数，最后写函数体。',
        question: '排列代码行，定义一个打招呼函数：',
        shuffledLines: [
          '}',
          'fn greet(name: &str) {',
          '    println!("Hello, {}!", name);',
        ],
        solution: ['fn greet(name: &str) {', '    println!("Hello, {}!", name);', '}'],
        explanation: '函数用 fn 定义，参数用 name: type 的形式。',
      },
      {
        id: 'w05-l02',
        title: '函数调用',
        type: 'fill',
        lesson: '调用函数时，写出函数名和参数。Rust 不要求函数在调用前定义。',
        hint: '函数名后面跟括号和参数。',
        question: '补全代码，调用 greet 函数',
        code: 'fn greet(name: &str) {\n    println!("Hello, {}!", name);\n}\n\nfn main() {\n    ___("Hacker");\n}',
        blanks: ['greet', 'call greet', 'run greet', 'greet()'],
        blanksCount: 1,
        solution: 'greet',
        explanation: '直接写函数名和参数即可调用。',
      },
      {
        id: 'w05-l03',
        title: '返回值',
        type: 'choice',
        lesson: '函数用 -> 指定返回类型，最后一个表达式（无分号）就是返回值。',
        hint: '-> 箭头后面是返回类型。',
        question: '以下函数返回什么？\nfn add(a: i32, b: i32) -> i32 {\n    a + b\n}',
        code: 'fn add(a: i32, b: i32) -> i32 {\n    a + b\n}',
        options: [
          { id: 'a', text: '返回 a + b 的值', isCorrect: true },
          { id: 'b', text: '返回 ()（无值）', isCorrect: false },
          { id: 'c', text: '编译错误', isCorrect: false },
          { id: 'd', text: '返回字符串', isCorrect: false },
        ],
        solution: 'a',
        explanation: '最后一个表达式 a + b 没有分号，就是返回值。',
      },
      {
        id: 'w05-l04',
        title: '表达式 vs 语句',
        type: 'judge',
        lesson: '表达式返回值，语句不返回。a + b 是表达式，let x = 5; 是语句。',
        hint: '分号把表达式变成语句。',
        question: '这段代码能编译吗？\nfn five() -> i32 {\n    5\n}',
        code: 'fn five() -> i32 {\n    5\n}',
        judgeAnswer: true,
        solution: 'true',
        explanation: '5 是表达式，作为函数的返回值。',
      },
      {
        id: 'w05-l05',
        title: '多参数函数',
        type: 'fill',
        lesson: '函数可以有多个参数，每个参数都需要类型标注。',
        hint: '参数用逗号分隔。',
        question: '补全函数签名，接受两个 i32 参数',
        code: 'fn multiply(a: i32, ___: i32) -> i32 {\n    a * b\n}',
        blanks: ['b', 'y', 'num', 'second'],
        blanksCount: 1,
        solution: 'b',
        explanation: '第二个参数命名为 b，类型为 i32。',
      },
      {
        id: 'w05-l06',
        title: '提前返回',
        type: 'choice',
        lesson: '用 return 关键字可以提前返回值。通常用于条件判断后提前退出。',
        hint: 'return 后面跟要返回的值。',
        question: '以下代码返回什么？\nfn check(x: i32) -> bool {\n    if x > 0 { return true; }\n    false\n}',
        code: 'fn check(x: i32) -> bool {\n    if x > 0 { return true; }\n    false\n}',
        options: [
          { id: 'a', text: '如果 x > 0 返回 true，否则返回 false', isCorrect: true },
          { id: 'b', text: '总是返回 false', isCorrect: false },
          { id: 'c', text: '编译错误', isCorrect: false },
          { id: 'd', text: '总是返回 true', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'return 提前返回，否则执行到函数末尾的 false。',
      },
      {
        id: 'w05-l07',
        title: '嵌套调用',
        type: 'judge',
        lesson: '函数可以调用其他函数。这是代码复用的基础。',
        hint: '函数内部可以调用其他函数。',
        question: '这段代码能运行吗？\nfn double(x: i32) -> i32 { x * 2 }\nfn main() { println!("{}", double(5)); }',
        code: 'fn double(x: i32) -> i32 { x * 2 }\nfn main() { println!("{}", double(5)); }',
        judgeAnswer: true,
        solution: 'true',
        explanation: 'main 调用 double(5) 返回 10，然后打印。',
      },
      {
        id: 'w05-l08',
        title: '函数作为抽象',
        type: 'order',
        lesson: '函数是代码抽象的基本单位。把重复逻辑提取成函数，让代码更清晰。',
        hint: '先定义函数，再在 main 中调用。',
        question: '排列代码行，定义并调用计算面积函数：',
        shuffledLines: [
          '    println!("Area: {}", area(5, 3));',
          '}',
          'fn area(w: i32, h: i32) -> i32 {',
          'fn main() {',
          '    w * h',
          '}',
        ],
        solution: [
          'fn area(w: i32, h: i32) -> i32 {',
          '    w * h',
          '}',
          'fn main() {',
          '    println!("Area: {}", area(5, 3));',
          '}',
        ],
        explanation: '先定义函数，再调用。函数内部用表达式返回结果。',
      },
    ],
    boss: {
      title: '函数挑战',
      description: '编写程序：\n1. 定义函数 calculate_damage(base: i32, multiplier: f64) -> i32\n2. 计算 base * multiplier 并转为 i32\n3. 调用函数，输出 "Damage: 25"',
      template: `fn calculate_damage(base: i32, multiplier: f64) -> i32 {
    // 在这里实现
    (base as f64 * multiplier) as i32
}

fn main() {
    let damage = calculate_damage(10, 2.5);
    println!("Damage: {}", damage);
}`,
      validation: {
        required: ['fn', 'calculate_damage', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 'Damage: 25', description: '计算并输出伤害' },
        ],
      },
    },
  },
  {
    id: 'w06',
    name: '所有权：资源主权',
    phase: 2,
    description: '栈 vs 堆、所有权规则、移动语义、Clone/Copy',
    levels: [
      {
        id: 'w06-l01',
        title: '所有权概念',
        type: 'choice',
        lesson: 'Rust 的核心特性是所有权。每个值都有一个"所有者"，同一时间只能有一个所有者。',
        hint: '所有权是 Rust 独有的内存管理方式。',
        question: '关于 Rust 的所有权，以下哪项是正确的？',
        options: [
          { id: 'a', text: '每个值只能有一个所有者', isCorrect: true },
          { id: 'b', text: '一个值可以有多个所有者', isCorrect: false },
          { id: 'c', text: '所有者可以是多个变量', isCorrect: false },
          { id: 'd', text: '所有权不影响编译', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'Rust 的所有权规则：每个值只能有一个所有者。',
      },
      {
        id: 'w06-l02',
        title: '移动语义',
        type: 'judge',
        lesson: '当把一个变量赋值给另一个变量时，所有权会"移动"。原变量不能再使用。',
        hint: 'String 类型会移动，i32 不会。',
        question: '这段代码能编译吗？\nlet s1 = String::from("hello");\nlet s2 = s1;\nprintln!("{}", s1);',
        code: 'let s1 = String::from("hello");\nlet s2 = s1;\nprintln!("{}", s1);',
        judgeAnswer: false,
        solution: 'false',
        explanation: 's1 的所有权移动到 s2 后，s1 不能再使用。',
      },
      {
        id: 'w06-l03',
        title: 'Copy trait',
        type: 'choice',
        lesson: '简单类型（如 i32、f64、bool）实现了 Copy trait，赋值时会复制而不是移动。',
        hint: '整数、浮点数、布尔值都是 Copy 类型。',
        question: '以下哪种类型会移动而不是复制？',
        options: [
          { id: 'a', text: 'String', isCorrect: true },
          { id: 'b', text: 'i32', isCorrect: false },
          { id: 'c', text: 'f64', isCorrect: false },
          { id: 'd', text: 'bool', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'String 存储在堆上，赋值时移动。i32 等简单类型存储在栈上，会复制。',
      },
      {
        id: 'w06-l04',
        title: '克隆',
        type: 'fill',
        lesson: '如果想深度复制堆上的数据，可以使用 clone() 方法。',
        hint: 'clone() 方法会创建数据的完整副本。',
        question: '补全代码，深拷贝 String',
        code: 'let s1 = String::from("hello");\nlet s2 = s1.___();',
        blanks: ['clone', 'copy', 'dup', 'deep'],
        blanksCount: 1,
        solution: 'clone',
        explanation: 'clone() 创建数据的深拷贝，两个变量都有效。',
      },
      {
        id: 'w06-l05',
        title: '函数与所有权',
        type: 'order',
        lesson: '把值传给函数时，和赋值一样会发生移动或复制。',
        hint: '先创建 String，传给函数，再尝试使用。',
        question: '排列代码行，展示函数获取所有权：',
        shuffledLines: [
          '}',
          'fn take(s: String) {',
          'let s = String::from("hello");',
          '    println!("{}", s);',
          'take(s);',
        ],
        solution: ['let s = String::from("hello");', 'fn take(s: String) {', '    println!("{}", s);', '}', 'take(s);'],
        explanation: 'String 传入函数后，所有权转移给函数参数。',
      },
      {
        id: 'w06-l06',
        title: '返回值与所有权',
        type: 'judge',
        lesson: '函数可以通过返回值把所有权转移回调用者。',
        hint: '函数返回值也会转移所有权。',
        question: '这段代码能编译吗？\nfn create() -> String {\n    String::from("hello")\n}\nlet s = create();',
        code: 'fn create() -> String {\n    String::from("hello")\n}\nlet s = create();',
        judgeAnswer: true,
        solution: 'true',
        explanation: '函数返回 String 时，所有权转移给变量 s。',
      },
      {
        id: 'w06-l07',
        title: '栈与堆',
        type: 'choice',
        lesson: '栈存储固定大小的数据（如 i32），堆存储动态大小的数据（如 String）。栈更快，堆更灵活。',
        hint: 'i32 大小固定，String 长度可变。',
        question: '以下哪种数据存储在堆上？',
        options: [
          { id: 'a', text: 'String', isCorrect: true },
          { id: 'b', text: 'i32', isCorrect: false },
          { id: 'c', text: 'f64', isCorrect: false },
          { id: 'd', text: 'bool', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'String 的数据存储在堆上，指针存储在栈上。',
      },
      {
        id: 'w06-l08',
        title: '所有权与内存安全',
        type: 'fill',
        lesson: '所有权系统在编译时检查内存使用，防止悬垂指针和数据竞争。',
        hint: '所有权让 Rust 不需要垃圾回收。',
        question: '所有权系统防止了哪类内存问题？',
        code: 'fn main() {\n    // 所有权防止了 ___ 指针\n}',
        blanks: ['悬垂', '空', '野', '无效'],
        blanksCount: 1,
        solution: '悬垂',
        explanation: '所有权系统防止悬垂指针（dangling pointer）。',
      },
    ],
    boss: {
      title: '所有权挑战',
      description: '编写程序：\n1. 创建 String s1\n2. 把 s1 移动给 s2\n3. 克隆 s2 给 s3\n4. 输出所有变量',
      template: `fn main() {
    let s1 = String::from("ownership");
    let s2 = s1;  // 移动
    let s3 = s2.clone();  // 克隆
    
    // 输出 s2 和 s3
    println!("s2: {}", s2);
    println!("s3: {}", s3);
}`,
      validation: {
        required: ['String::from', 'clone', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 's2: ownership\ns3: ownership', description: '输出克隆的字符串' },
        ],
      },
    },
  },
  {
    id: 'w07',
    name: '借用：引用访问',
    phase: 2,
    description: '不可变引用、可变引用、借用规则、悬垂引用',
    levels: [
      {
        id: 'w07-l01',
        title: '引用概念',
        type: 'choice',
        lesson: '引用（&）允许你借用值而不获取所有权。用 & 创建引用，用 * 解引用。',
        hint: '& 表示"借用"。',
        question: '如何创建一个引用？',
        options: [
          { id: 'a', text: '&variable', isCorrect: true },
          { id: 'b', text: '*variable', isCorrect: false },
          { id: 'c', text: 'ref variable', isCorrect: false },
          { id: 'd', text: 'borrow variable', isCorrect: false },
        ],
        solution: 'a',
        explanation: '& 创建引用，表示借用而不是获取所有权。',
      },
      {
        id: 'w07-l02',
        title: '不可变引用',
        type: 'judge',
        lesson: '默认引用是不可变的，不能修改借用的值。可以同时有多个不可变引用。',
        hint: '& 表示不可变引用。',
        question: '这段代码能编译吗？\nlet s = String::from("hello");\nlet r = &s;\nprintln!("{}", r);',
        code: 'let s = String::from("hello");\nlet r = &s;\nprintln!("{}", r);',
        judgeAnswer: true,
        solution: 'true',
        explanation: '不可变引用可以正常借用和打印。',
      },
      {
        id: 'w07-l03',
        title: '可变引用',
        type: 'fill',
        lesson: '用 &mut 创建可变引用，可以修改借用的值。同一时间只能有一个可变引用。',
        hint: 'mut 表示可变。',
        question: '补全代码，创建可变引用',
        code: 'let mut s = String::from("hello");\nlet r = ___ s;\nr.push_str(" world");',
        blanks: ['&mut', '&', 'mut', 'ref'],
        blanksCount: 1,
        solution: '&mut',
        explanation: '&mut 创建可变引用，允许修改借用的值。',
      },
      {
        id: 'w07-l04',
        title: '借用规则',
        type: 'choice',
        lesson: '借用规则：要么有多个不可变引用，要么只有一个可变引用，不能同时存在。',
        hint: '不可变和可变引用不能同时存在。',
        question: '以下哪种情况是允许的？',
        options: [
          { id: 'a', text: '多个不可变引用', isCorrect: true },
          { id: 'b', text: '多个可变引用', isCorrect: false },
          { id: 'c', text: '同时有可变和不可变引用', isCorrect: false },
          { id: 'd', text: '以上都不允许', isCorrect: false },
        ],
        solution: 'a',
        explanation: '可以有多个不可变引用，但只能有一个可变引用。',
      },
      {
        id: 'w07-l05',
        title: '悬垂引用',
        type: 'judge',
        lesson: 'Rust 编译器防止悬垂引用——引用指向的数据已经被释放。',
        hint: '函数返回局部变量的引用会怎样？',
        question: '这段代码能编译吗？\nfn dangle() -> &String {\n    let s = String::from("hello");\n    &s\n}',
        code: 'fn dangle() -> &String {\n    let s = String::from("hello");\n    &s\n}',
        judgeAnswer: false,
        solution: 'false',
        explanation: 's 在函数结束时被释放，返回它的引用是悬垂引用。',
      },
      {
        id: 'w07-l06',
        title: '引用作用域',
        type: 'order',
        lesson: '引用的作用域从创建开始，到最后一次使用结束。这叫"非词法作用域生命周期"。',
        hint: '引用在最后一次使用后就不再借用。',
        question: '排列代码行，展示引用作用域：',
        shuffledLines: [
          'let r = &s;',
          'println!("{}", r);',
          'let mut s = String::from("hello");',
          's.push_str(" world");',
        ],
        solution: ['let mut s = String::from("hello");', 'let r = &s;', 'println!("{}", r);', 's.push_str(" world");'],
        explanation: 'r 在 println! 后不再使用，所以 s 可以再被修改。',
      },
      {
        id: 'w07-l07',
        title: '函数参数引用',
        type: 'fill',
        lesson: '函数参数用引用可以借用值而不获取所有权，这样调用者还能继续使用。',
        hint: '& 在参数类型中表示借用。',
        question: '补全函数签名，借用 String',
        code: 'fn calculate_length(s: &String) -> usize {\n    s.len()\n}',
        blanks: ['&', '&mut', '*', 'ref'],
        blanksCount: 1,
        solution: '&',
        explanation: '&String 表示借用 String，不获取所有权。',
      },
      {
        id: 'w07-l08',
        title: '可变引用限制',
        type: 'judge',
        lesson: '在同一个作用域内，不能同时有可变引用和不可变引用。',
        hint: '先有不可变引用，再创建可变引用会怎样？',
        question: '这段代码能编译吗？\nlet mut s = String::from("hello");\nlet r1 = &s;\nlet r2 = &mut s;',
        code: 'let mut s = String::from("hello");\nlet r1 = &s;\nlet r2 = &mut s;',
        judgeAnswer: false,
        solution: 'false',
        explanation: 'r1（不可变引用）和 r2（可变引用）不能同时存在。',
      },
    ],
    boss: {
      title: '借用挑战',
      description: '编写程序：\n1. 创建可变 String\n2. 用不可变引用获取长度\n3. 用可变引用追加内容\n4. 输出最终结果',
      template: `fn main() {
    let mut s = String::from("Hello");
    
    // 获取长度
    let len = calculate_length(&s);
    println!("Length: {}", len);
    
    // 追加内容
    append_world(&mut s);
    println!("Result: {}", s);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}

fn append_world(s: &mut String) {
    s.push_str(" World");
}`,
      validation: {
        required: ['&', '&mut', 'calculate_length', 'append_world', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 'Length: 5\nResult: Hello World', description: '计算长度并追加内容' },
        ],
      },
    },
  },
  {
    id: 'w08',
    name: '切片：数据快照',
    phase: 2,
    description: '字符串切片、数组切片、&str',
    levels: [
      {
        id: 'w08-l01',
        title: '字符串切片',
        type: 'choice',
        lesson: '字符串切片 &str 是对 String 的一部分引用。用 &s[start..end] 创建。',
        hint: '.. 表示范围。',
        question: '如何获取字符串的前3个字符？',
        options: [
          { id: 'a', text: '&s[0..3]', isCorrect: true },
          { id: 'b', text: 's[0..3]', isCorrect: false },
          { id: 'c', text: 's.get(3)', isCorrect: false },
          { id: 'd', text: '&s(3)', isCorrect: false },
        ],
        solution: 'a',
        explanation: '&s[0..3] 创建从索引 0 到 2 的切片。',
      },
      {
        id: 'w08-l02',
        title: '切片语法',
        type: 'fill',
        lesson: '切片范围语法：&s[..end] 从开头，&s[start..] 到结尾，&s[..] 整个字符串。',
        hint: '省略 start 表示从开头。',
        question: '补全代码，获取整个字符串的切片',
        code: 'let s = String::from("hello");\nlet slice = &s[___];',
        blanks: ['..', '0..', '..len', '0..len'],
        blanksCount: 1,
        solution: '..',
        explanation: '&s[..] 获取整个字符串的切片。',
      },
      {
        id: 'w08-l03',
        title: '字符串字面量',
        type: 'judge',
        lesson: '字符串字面量 "hello" 本身就是切片类型 &str，指向程序的只读数据。',
        hint: '类型标注是什么？',
        question: '这段代码正确吗？\nlet s: &str = "hello";',
        code: 'let s: &str = "hello";',
        judgeAnswer: true,
        solution: 'true',
        explanation: '"hello" 是 &str 类型，指向只读内存。',
      },
      {
        id: 'w08-l04',
        title: '数组切片',
        type: 'order',
        lesson: '数组也可以用切片。&arr[1..3] 获取索引 1 到 2 的元素。',
        hint: '和字符串切片语法一样。',
        question: '排列代码行，创建数组切片：',
        shuffledLines: [
          'println!("{:?}", slice);',
          'let slice = &arr[1..3];',
          'let arr = [1, 2, 3, 4, 5];',
        ],
        solution: ['let arr = [1, 2, 3, 4, 5];', 'let slice = &arr[1..3];', 'println!("{:?}", slice);'],
        explanation: 'arr[1..3] 包含索引 1 和 2 的元素：[2, 3]。',
      },
      {
        id: 'w08-l05',
        title: '切片参数',
        type: 'fill',
        lesson: '函数参数用 &str 比用 &String 更灵活，可以接受 String 和 &str。',
        hint: '推荐用 &str 作为字符串参数。',
        question: '补全函数签名，接受字符串切片',
        code: 'fn first_word(s: &str) -> &str {\n    // ...',
        blanks: ['&str', '&String', 'String', 'str'],
        blanksCount: 1,
        solution: '&str',
        explanation: '&str 是通用的字符串切片类型。',
      },
      {
        id: 'w08-l06',
        title: 'UTF-8 与切片',
        type: 'judge',
        lesson: 'Rust 字符串是 UTF-8 编码。中文字符占 3 个字节，切片必须在字符边界上。',
        hint: '中文字符不是 1 个字节。',
        question: '这段代码会怎样？\nlet s = String::from("你好");\nlet slice = &s[0..1];',
        code: 'let s = String::from("你好");\nlet slice = &s[0..1];',
        judgeAnswer: false,
        solution: 'false',
        explanation: '中文字符占 3 字节，[0..1] 不在字符边界上，运行时会 panic。',
      },
    ],
    boss: {
      title: '切片挑战',
      description: '编写程序：\n1. 定义函数 first_word，返回第一个单词\n2. 用切片实现\n3. 测试并输出结果',
      template: `fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    &s[..]
}

fn main() {
    let s = String::from("hello world");
    let word = first_word(&s);
    println!("First word: {}", word);
}`,
      validation: {
        required: ['fn first_word', '&str', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 'First word: hello', description: '提取第一个单词' },
        ],
      },
    },
  },
  {
    id: 'w09',
    name: 'struct：数据结构体',
    phase: 2,
    description: 'struct 定义、impl、tuple struct',
    levels: [
      {
        id: 'w09-l01',
        title: '定义 struct',
        type: 'order',
        lesson: 'struct 用关键字 struct 定义，包含命名字段。类似其他语言的 class 或 record。',
        hint: 'struct 后面是名字和字段。',
        question: '排列代码行，定义 User struct：',
        shuffledLines: [
          '    email: String,',
          '}',
          'struct User {',
          '    username: String,',
          '    active: bool,',
        ],
        solution: ['struct User {', '    username: String,', '    email: String,', '    active: bool,', '}'],
        explanation: 'struct 定义用花括号包围字段，每个字段有名字和类型。',
      },
      {
        id: 'w09-l02',
        title: '创建实例',
        type: 'fill',
        lesson: '创建 struct 实例时，需要为每个字段提供值。用 结构名 { 字段: 值 } 的形式。',
        hint: '字段名和值用冒号分隔。',
        question: '补全代码，创建 User 实例',
        code: 'let user = User {\n    username: String::from("hacker"),\n    email: String::from("h@ck.er"),\n    active: true,\n};',
        blanks: ['User', 'new User', 'User::new', 'create User'],
        blanksCount: 1,
        solution: 'User',
        explanation: '直接用结构名 { 字段: 值 } 创建实例。',
      },
      {
        id: 'w09-l03',
        title: '访问字段',
        type: 'choice',
        lesson: '用点号（.）访问 struct 的字段。',
        hint: '实例名.字段名',
        question: '如何访问 user 的 username？',
        options: [
          { id: 'a', text: 'user.username', isCorrect: true },
          { id: 'b', text: 'user->username', isCorrect: false },
          { id: 'c', text: 'user[username]', isCorrect: false },
          { id: 'd', text: 'user::username', isCorrect: false },
        ],
        solution: 'a',
        explanation: '用点号访问 struct 字段。',
      },
      {
        id: 'w09-l04',
        title: '方法',
        type: 'fill',
        lesson: '用 impl 块为 struct 定义方法。方法第一个参数是 &self、&mut self 或 self。',
        hint: 'impl 是 implementation 的缩写。',
        question: '补全代码，定义方法',
        code: 'impl User {\n    fn greet(&self) {\n        println!("Hi, {}!", self.username);\n    }\n}',
        blanks: ['impl', 'struct', 'fn', 'type'],
        blanksCount: 1,
        solution: 'impl',
        explanation: 'impl 块为 struct 定义方法。',
      },
      {
        id: 'w09-l05',
        title: '关联函数',
        type: 'judge',
        lesson: 'impl 块中没有 self 参数的函数叫关联函数，用 :: 调用。常见于构造函数 new()。',
        hint: ':: 调用关联函数。',
        question: '这段代码正确吗？\nimpl User {\n    fn new(name: String) -> User {\n        User { username: name, email: String::new(), active: true }\n    }\n}',
        code: 'impl User {\n    fn new(name: String) -> User {\n        User { username: name, email: String::new(), active: true }\n    }\n}',
        judgeAnswer: true,
        solution: 'true',
        explanation: '关联函数用 :: 调用，如 User::new(...)。',
      },
      {
        id: 'w09-l06',
        title: 'Tuple struct',
        type: 'choice',
        lesson: 'Tuple struct 有名字但字段没有名字，用 (type) 定义。',
        hint: '类似元组但有自己的类型名。',
        question: '如何定义一个 tuple struct？',
        options: [
          { id: 'a', text: 'struct Color(i32, i32, i32);', isCorrect: true },
          { id: 'b', text: 'struct Color { i32, i32, i32 }', isCorrect: false },
          { id: 'c', text: 'Color = (i32, i32, i32)', isCorrect: false },
          { id: 'd', text: 'type Color = [i32; 3]', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'Tuple struct 用圆括号定义：struct Name(type1, type2);',
      },
      {
        id: 'w09-l07',
        title: 'struct 更新语法',
        type: 'fill',
        lesson: '用 ..other 可以从另一个实例创建新实例，只修改部分字段。',
        hint: '.. 表示"其他字段相同"。',
        question: '补全代码，用更新语法创建新实例',
        code: 'let user2 = User {\n    email: String::from("new@email.com"),\n    ..user1\n};',
        blanks: ['..user1', '...user1', 'from user1', 'copy user1'],
        blanksCount: 1,
        solution: '..user1',
        explanation: '..user1 表示其他字段从 user1 复制。',
      },
      {
        id: 'w09-l08',
        title: '打印 struct',
        type: 'judge',
        lesson: '要打印 struct，需要添加 #[derive(Debug)] 属性，然后用 {:?} 或 {:#?} 格式化。',
        hint: 'Debug 派生允许打印。',
        question: '这段代码能打印 struct 吗？\n#[derive(Debug)]\nstruct Point { x: i32, y: i32 }\nlet p = Point { x: 1, y: 2 };\nprintln!("{:?}", p);',
        code: '#[derive(Debug)]\nstruct Point { x: i32, y: i32 }\nlet p = Point { x: 1, y: 2 };\nprintln!("{:?}", p);',
        judgeAnswer: true,
        solution: 'true',
        explanation: '#[derive(Debug)] 让 struct 可以用 {:?} 打印。',
      },
    ],
    boss: {
      title: 'struct 挑战',
      description: '编写程序：\n1. 定义 Rectangle struct（width, height）\n2. 实现 area 方法\n3. 创建实例并输出面积',
      template: `#[derive(Debug)]
struct Rectangle {
    width: f64,
    height: f64,
}

impl Rectangle {
    fn area(&self) -> f64 {
        self.width * self.height
    }
}

fn main() {
    let rect = Rectangle { width: 10.0, height: 5.0 };
    println!("Area: {}", rect.area());
}`,
      validation: {
        required: ['struct Rectangle', 'impl', 'fn area', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 'Area: 50', description: '计算矩形面积' },
        ],
      },
    },
  },
  {
    id: 'w10',
    name: '枚举：状态路由',
    phase: 2,
    description: 'enum、match、Option、if let',
    levels: [
      {
        id: 'w10-l01',
        title: '定义 enum',
        type: 'order',
        lesson: 'enum 定义一组可能的变体。每个变体可以有数据，也可以没有。',
        hint: 'enum 后面是名字和变体。',
        question: '排列代码行，定义 IP 地址类型：',
        shuffledLines: [
          '    V6(String),',
          '}',
          'enum IpAddr {',
          '    V4(String),',
        ],
        solution: ['enum IpAddr {', '    V4(String),', '    V6(String),', '}'],
        explanation: 'enum 用逗号分隔变体，每个变体可以有数据。',
      },
      {
        id: 'w10-l02',
        title: '创建变体',
        type: 'fill',
        lesson: '用枚举名::变体名 创建枚举值。',
        hint: ':: 分隔枚举名和变体名。',
        question: '补全代码，创建枚举值',
        code: 'let home = IpAddr::V4(String::from("127.0.0.1"));',
        blanks: ['IpAddr::V4', 'IpAddr.V4', 'new V4', 'V4()'],
        blanksCount: 1,
        solution: 'IpAddr::V4',
        explanation: '用 :: 访问枚举变体。',
      },
      {
        id: 'w10-l03',
        title: 'match 表达式',
        type: 'choice',
        lesson: 'match 匹配枚举的所有变体，必须覆盖所有情况。类似 switch 但更强大。',
        hint: 'match 必须穷尽所有变体。',
        question: 'match 表达式必须怎样？',
        options: [
          { id: 'a', text: '覆盖所有可能的变体', isCorrect: true },
          { id: 'b', text: '至少有一个分支', isCorrect: false },
          { id: 'c', text: '使用 _ 通配符', isCorrect: false },
          { id: 'd', text: '返回相同类型', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'match 必须穷尽所有可能的值。',
      },
      {
        id: 'w10-l04',
        title: 'Option 类型',
        type: 'judge',
        lesson: 'Option<T> 表示可能有值（Some(T)）或没有值（None）。Rust 没有 null。',
        hint: 'Option 用于可能缺失的值。',
        question: 'Option 有哪些变体？',
        code: 'enum Option<T> {\n    Some(T),\n    None,\n}',
        judgeAnswer: true,
        solution: 'true',
        explanation: 'Option 有 Some（有值）和 None（无值）两个变体。',
      },
      {
        id: 'w10-l05',
        title: '使用 Option',
        type: 'fill',
        lesson: '用 match 处理 Option，Some 获取值，None 处理缺失情况。',
        hint: 'match 可以解构 Option。',
        question: '补全代码，处理 Option',
        code: 'let x: Option<i32> = Some(5);\nmatch x {\n    Some(value) => println!("{}", value),\n    ___ => println!("None"),\n}',
        blanks: ['None', 'None()', 'null', '_'],
        blanksCount: 1,
        solution: 'None',
        explanation: 'None 匹配没有值的情况。',
      },
      {
        id: 'w10-l06',
        title: 'if let',
        type: 'choice',
        lesson: 'if let 是 match 的简写，只关心一个变体时更简洁。',
        hint: 'if let 只匹配一个模式。',
        question: '以下代码等价于什么？\nif let Some(value) = x {\n    println!("{}", value);\n}',
        options: [
          { id: 'a', text: 'match x { Some(value) => println!("{}", value), _ => {} }', isCorrect: true },
          { id: 'b', text: 'if x == Some(value) { println!("{}", value); }', isCorrect: false },
          { id: 'c', text: 'let value = x.unwrap(); println!("{}", value);', isCorrect: false },
          { id: 'd', text: 'println!("{}", x);', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'if let 只匹配一个模式，忽略其他情况。',
      },
      {
        id: 'w10-l07',
        title: '枚举方法',
        type: 'fill',
        lesson: '枚举也可以用 impl 定义方法，和 struct 一样。',
        hint: 'impl 枚举名 { ... }',
        question: '补全代码，为枚举定义方法',
        code: 'impl IpAddr {\n    fn is_loopback(&self) -> bool {\n        match self {\n            IpAddr::V4(addr) => addr == "127.0.0.1",\n            IpAddr::V6(addr) => addr == "::1",\n        }\n    }\n}',
        blanks: ['impl', 'enum', 'fn', 'struct'],
        blanksCount: 1,
        solution: 'impl',
        explanation: 'impl 块可以为枚举定义方法。',
      },
    ],
    boss: {
      title: '枚举挑战',
      description: '编写程序：\n1. 定义 Shape 枚举（Circle(f64), Rectangle(f64, f64)）\n2. 实现 area 方法\n3. 计算并输出两种形状的面积',
      template: `enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle(r) => std::f64::consts::PI * r * r,
            Shape::Rectangle(w, h) => w * h,
        }
    }
}

fn main() {
    let circle = Shape::Circle(5.0);
    let rect = Shape::Rectangle(10.0, 5.0);
    println!("Circle area: {}", circle.area());
    println!("Rectangle area: {}", rect.area());
}`,
      validation: {
        required: ['enum Shape', 'impl', 'fn area', 'match', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 'Circle area: 78.53981633974483\nRectangle area: 50', description: '计算两种形状的面积' },
        ],
      },
    },
  },
  {
    id: 'w11',
    name: '泛型：通用代码',
    phase: 3,
    description: '泛型函数/struct/enum、泛型约束',
    levels: [
      {
        id: 'w11-l01',
        title: '泛型函数',
        type: 'choice',
        lesson: '泛型允许你写一次代码，适用于多种类型。用 <T> 声明类型参数。',
        hint: 'T 是 type 的缩写，表示任意类型。',
        question: '如何声明一个泛型函数？',
        options: [
          { id: 'a', text: 'fn largest<T>(list: &[T]) -> &T', isCorrect: true },
          { id: 'b', text: 'fn largest(list: &[T]) -> &T', isCorrect: false },
          { id: 'c', text: 'fn largest(T)(list: &[T]) -> &T', isCorrect: false },
          { id: 'd', text: 'fn largest{<T>}(list: &[T]) -> &T', isCorrect: false },
        ],
        solution: 'a',
        explanation: '泛型参数 <T> 放在函数名后面，用尖括号包围。',
      },
      {
        id: 'w11-l02',
        title: '泛型 struct',
        type: 'fill',
        lesson: 'struct 也可以用泛型，让一个结构体能存储任意类型的值。',
        hint: 'struct Point<T> 表示 T 类型的点。',
        question: '补全代码，定义泛型 Point',
        code: 'struct Point<___> {\n    x: T,\n    y: T,\n}',
        blanks: ['T', 'Type', 'Generic', 'Any'],
        blanksCount: 1,
        solution: 'T',
        explanation: 'struct 名字后面加 <T> 声明泛型参数。',
      },
      {
        id: 'w11-l03',
        title: '泛型 enum',
        type: 'judge',
        lesson: 'Option<T> 和 Result<T, E> 就是泛型枚举的例子。',
        hint: '枚举也可以有泛型参数。',
        question: '这段代码正确吗？\nenum Message<T> {\n    Text(T),\n    Quit,\n}',
        code: 'enum Message<T> {\n    Text(T),\n    Quit,\n}',
        judgeAnswer: true,
        solution: 'true',
        explanation: '枚举可以用泛型参数，变体中包含不同类型的数据。',
      },
      {
        id: 'w11-l04',
        title: '多个泛型参数',
        type: 'order',
        lesson: '可以用多个泛型参数，如 <T, U>。每个参数用逗号分隔。',
        hint: 'T 和 U 可以是不同类型。',
        question: '排列代码行，定义多泛型 Point：',
        shuffledLines: [
          '}',
          'struct Point<T, U> {',
          '    y: U,',
          '    x: T,',
        ],
        solution: ['struct Point<T, U> {', '    x: T,', '    y: U,', '}'],
        explanation: 'T 和 U 可以是不同类型，如 Point<i32, f64>。',
      },
      {
        id: 'w11-l05',
        title: '泛型方法',
        type: 'fill',
        lesson: 'impl 块中也可以用泛型。impl<T> Struct<T> { ... }',
        hint: 'impl 后面也要加泛型参数。',
        question: '补全代码，为泛型 struct 实现方法',
        code: 'impl<T> Point<T> {\n    fn x(&self) -> &T {\n        &self.x\n    }\n}',
        blanks: ['<T>', '(T)', '{T}', 'T'],
        blanksCount: 1,
        solution: '<T>',
        explanation: 'impl 后面加 <T> 表示这是一个泛型实现。',
      },
      {
        id: 'w11-l06',
        title: '泛型约束',
        type: 'choice',
        lesson: '用 trait bound 限制泛型必须实现某个 trait。如 T: Display 表示 T 必须能打印。',
        hint: ': 后面是 trait 名。',
        question: '如何限制泛型 T 必须实现 PartialOrd trait？',
        options: [
          { id: 'a', text: 'T: PartialOrd', isCorrect: true },
          { id: 'b', text: 'T < PartialOrd', isCorrect: false },
          { id: 'c', text: 'T implements PartialOrd', isCorrect: false },
          { id: 'd', text: 'T extends PartialOrd', isCorrect: false },
        ],
        solution: 'a',
        explanation: '用冒号加 trait 名表示约束：T: TraitName。',
      },
      {
        id: 'w11-l07',
        title: 'where 子句',
        type: 'fill',
        lesson: '约束很长时可以用 where 子句，让代码更清晰。',
        hint: 'where 在函数签名中间。',
        question: '补全代码，用 where 子句',
        code: 'fn largest<T>(list: &[T]) -> &T\nwhere T: PartialOrd\n{\n    // ...',
        blanks: ['where', 'with', 'when', 'if'],
        blanksCount: 1,
        solution: 'where',
        explanation: 'where 子句把约束移到函数签名后面。',
      },
      {
        id: 'w11-l08',
        title: '泛型与性能',
        type: 'judge',
        lesson: 'Rust 在编译时把泛型展开成具体类型（单态化），运行时没有性能损失。',
        hint: '单态化（monomorphization）。',
        question: '泛型会导致运行时性能下降吗？',
        code: '// Rust 泛型在编译时展开，运行时无额外开销',
        judgeAnswer: false,
        solution: 'false',
        explanation: 'Rust 的泛型在编译时单态化，运行时和手写具体类型一样快。',
      },
    ],
    boss: {
      title: '泛型挑战',
      description: '编写程序：\n1. 定义泛型 Point<T>\n2. 实现 new 方法\n3. 创建 i32 和 f64 的 Point 并输出',
      template: `#[derive(Debug)]
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn new(x: T, y: T) -> Self {
        Point { x, y }
    }
}

fn main() {
    let int_point = Point::new(5, 10);
    let float_point = Point::new(1.5, 2.5);
    println!("Int: {:?}", int_point);
    println!("Float: {:?}", float_point);
}`,
      validation: {
        required: ['struct Point', '<T>', 'impl', 'fn new', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 'Int: Point { x: 5, y: 10 }\nFloat: Point { x: 1.5, y: 2.5 }', description: '创建泛型 Point' },
        ],
      },
    },
  },
  {
    id: 'w12',
    name: 'Trait：协议接口',
    phase: 3,
    description: 'trait 定义、默认方法、trait bound、impl Trait',
    levels: [
      {
        id: 'w12-l01',
        title: '定义 trait',
        type: 'order',
        lesson: 'trait 定义一组方法签名。类型实现 trait 后，就拥有了这些方法。',
        hint: 'trait 类似接口。',
        question: '排列代码行，定义 Summary trait：',
        shuffledLines: [
          '    fn summarize(&self) -> String;',
          '}',
          'trait Summary {',
        ],
        solution: ['trait Summary {', '    fn summarize(&self) -> String;', '}'],
        explanation: 'trait 定义方法签名，实现者必须提供具体实现。',
      },
      {
        id: 'w12-l02',
        title: '实现 trait',
        type: 'fill',
        lesson: '用 impl Trait for Type 为类型实现 trait。',
        hint: 'impl ... for ...',
        question: '补全代码，为 Article 实现 Summary',
        code: 'impl Summary for Article {\n    fn summarize(&self) -> String {\n        format!("{}: {}", self.title, self.content)\n    }\n}',
        blanks: ['Summary for Article', 'Article for Summary', 'Summary of Article', 'Article Summary'],
        blanksCount: 1,
        solution: 'Summary for Article',
        explanation: 'impl Trait for Type 语法实现 trait。',
      },
      {
        id: 'w12-l03',
        title: '默认方法',
        type: 'judge',
        lesson: 'trait 可以有默认实现。实现者可以选择覆盖或使用默认方法。',
        hint: 'trait 中有方法体就是默认实现。',
        question: '这段代码正确吗？\ntrait Summary {\n    fn summarize(&self) -> String {\n        String::from("Read more...")\n    }\n}',
        code: 'trait Summary {\n    fn summarize(&self) -> String {\n        String::from("Read more...")\n    }\n}',
        judgeAnswer: true,
        solution: 'true',
        explanation: 'trait 可以有默认实现，实现者可以选择使用或覆盖。',
      },
      {
        id: 'w12-l04',
        title: 'trait 作为参数',
        type: 'choice',
        lesson: '用 impl Trait 语法可以让函数接受任何实现了该 trait 的类型。',
        hint: 'impl Trait 在参数位置。',
        question: '如何让函数接受任何 Summary 类型？',
        options: [
          { id: 'a', text: 'fn notify(item: &impl Summary)', isCorrect: true },
          { id: 'b', text: 'fn notify(item: &Summary)', isCorrect: false },
          { id: 'c', text: 'fn notify(item: Summary)', isCorrect: false },
          { id: 'd', text: 'fn notify<T>(item: T)', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'impl Trait 语法接受任何实现了该 trait 的类型。',
      },
      {
        id: 'w12-l05',
        title: 'trait bound',
        type: 'fill',
        lesson: 'trait bound 用 <T: Trait> 语法，更灵活，可以有多个约束。',
        hint: '泛型参数加约束。',
        question: '补全函数签名，用 trait bound',
        code: 'fn notify<T: Summary>(item: &T) {\n    println!("Breaking: {}", item.summarize());\n}',
        blanks: ['T: Summary', 'T impl Summary', 'T as Summary', 'Summary T'],
        blanksCount: 1,
        solution: 'T: Summary',
        explanation: 'T: Summary 是 trait bound 语法。',
      },
      {
        id: 'w12-l06',
        title: '多重约束',
        type: 'order',
        lesson: '用 + 可以要求类型实现多个 trait。如 T: Display + Clone。',
        hint: '+ 连接多个 trait。',
        question: '排列代码行，使用多重约束：',
        shuffledLines: [
          '    println!("{}", item);',
          '}',
          'fn print_and_clone<T: Display + Clone>(item: &T) {',
        ],
        solution: ['fn print_and_clone<T: Display + Clone>(item: &T) {', '    println!("{}", item);', '}'],
        explanation: 'T: Display + Clone 要求 T 同时实现两个 trait。',
      },
      {
        id: 'w12-l07',
        title: '返回 impl Trait',
        type: 'fill',
        lesson: '函数也可以返回 impl Trait，表示返回某个实现了该 trait 的类型。',
        hint: '返回位置也可以用 impl Trait。',
        question: '补全函数签名，返回 Summary 类型',
        code: 'fn create_summary() -> impl Summary {\n    // ...',
        blanks: ['impl Summary', 'Summary', 'dyn Summary', '&Summary'],
        blanksCount: 1,
        solution: 'impl Summary',
        explanation: '返回 impl Trait 表示返回某个实现了该 trait 的类型。',
      },
      {
        id: 'w12-l08',
        title: '常用标准库 trait',
        type: 'choice',
        lesson: '常见 trait：Display（打印）、Debug（调试）、Clone（克隆）、Copy（复制）、PartialEq（比较）。',
        hint: '#[derive(...)] 可以自动实现。',
        question: '哪个 trait 让类型可以用 {} 打印？',
        options: [
          { id: 'a', text: 'Display', isCorrect: true },
          { id: 'b', text: 'Debug', isCorrect: false },
          { id: 'c', text: 'Print', isCorrect: false },
          { id: 'd', text: 'Show', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'Display trait 用 {} 打印，Debug 用 {:?} 打印。',
      },
    ],
    boss: {
      title: 'Trait 挑战',
      description: '编写程序：\n1. 定义 Printable trait\n2. 为 User 和 Product 实现它\n3. 用 impl Trait 参数打印两者',
      template: `trait Printable {
    fn format(&self) -> String;
}

struct User { name: String }
struct Product { name: String, price: f64 }

impl Printable for User {
    fn format(&self) -> String {
        format!("User: {}", self.name)
    }
}

impl Printable for Product {
    fn format(&self) -> String {
        format!("Product: {} (\${:.2})", self.name, self.price)
    }
}

fn print_item(item: &impl Printable) {
    println!("{}", item.format());
}

fn main() {
    let user = User { name: String::from("Alice") };
    let product = Product { name: String::from("Widget"), price: 9.99 };
    print_item(&user);
    print_item(&product);
}`,
      validation: {
        required: ['trait Printable', 'impl Printable for', 'fn format', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 'User: Alice\nProduct: Widget ($9.99)', description: '打印两种类型' },
        ],
      },
    },
  },
  {
    id: 'w13',
    name: '生命周期：借用时效',
    phase: 3,
    description: '生命周期注解、省略规则、\'static',
    levels: [
      {
        id: 'w13-l01',
        title: '生命周期概念',
        type: 'choice',
        lesson: '生命周期确保引用在使用期间有效。Rust 编译器大多数时候能自动推断。',
        hint: '生命周期防止悬垂引用。',
        question: '生命周期的主要作用是什么？',
        options: [
          { id: 'a', text: '确保引用在使用期间有效', isCorrect: true },
          { id: 'b', text: '管理内存分配', isCorrect: false },
          { id: 'c', text: '控制变量作用域', isCorrect: false },
          { id: 'd', text: '优化程序性能', isCorrect: false },
        ],
        solution: 'a',
        explanation: '生命周期确保引用不会悬垂。',
      },
      {
        id: 'w13-l02',
        title: '生命周期注解',
        type: 'fill',
        lesson: '生命周期用 \'a 表示，放在 & 后面。如 &\'a str 表示生命周期为 a 的引用。',
        hint: '撇号 + 小写字母。',
        question: '补全代码，添加生命周期注解',
        code: 'fn longest<\'a>(x: &\'a str, y: &\'a str) -> &\'a str {\n    if x.len() > y.len() { x } else { y }\n}',
        blanks: ["'a", "'b", "'lifetime", "'ref"],
        blanksCount: 1,
        solution: "'a",
        explanation: "'a 是生命周期参数，表示返回值的生命周期与参数相同。",
      },
      {
        id: 'w13-l03',
        title: '生命周期省略',
        type: 'judge',
        lesson: 'Rust 有三条省略规则，大多数情况不需要手写生命周期。',
        hint: '编译器能自动推断。',
        question: '以下函数需要手写生命周期吗？\nfn first_word(s: &str) -> &str { ... }',
        code: 'fn first_word(s: &str) -> &str { ... }',
        judgeAnswer: false,
        solution: 'false',
        explanation: '只有一个输入引用，编译器能自动推断，不需要手写。',
      },
      {
        id: 'w13-l04',
        title: '结构体中的生命周期',
        type: 'fill',
        lesson: '如果 struct 存储引用，必须标注生命周期。',
        hint: 'struct 后面加生命周期参数。',
        question: '补全代码，定义存储引用的 struct',
        code: 'struct Excerpt<\'a> {\n    text: &\'a str,\n}',
        blanks: ["'a", "'b", "'ref", "'lifetime"],
        blanksCount: 1,
        solution: "'a",
        explanation: 'struct 存储引用时必须声明生命周期参数。',
      },
      {
        id: 'w13-l05',
        title: "'static 生命周期",
        type: 'choice',
        lesson: "'static 表示整个程序运行期间都有效。字符串字面量就是 'static。",
        hint: '字符串字面量是 \'static。',
        question: '哪种引用的生命周期是 \'static？',
        options: [
          { id: 'a', text: '字符串字面量 "hello"', isCorrect: true },
          { id: 'b', text: '局部变量的引用', isCorrect: false },
          { id: 'c', text: '函数参数的引用', isCorrect: false },
          { id: 'd', text: '临时值的引用', isCorrect: false },
        ],
        solution: 'a',
        explanation: '字符串字面量在编译时嵌入程序，生命周期是 \'static。',
      },
      {
        id: 'w13-l06',
        title: '生命周期与泛型',
        type: 'order',
        lesson: '生命周期和泛型可以一起使用。泛型参数在前，生命周期在后。',
        hint: '<T, \'a> 的顺序。',
        question: '排列代码行，结合泛型和生命周期：',
        shuffledLines: [
          '    // ...',
          '}',
          'fn longest_with_announcement<T: Display>(x: &str, y: &str, ann: T) -> &str {',
        ],
        solution: ['fn longest_with_announcement<T: Display>(x: &str, y: &str, ann: T) -> &str {', '    // ...', '}'],
        explanation: '泛型参数在前，生命周期可以省略（自动推断）。',
      },
    ],
    boss: {
      title: '生命周期挑战',
      description: '编写程序：\n1. 定义带生命周期的 Excerpt struct\n2. 实现方法\n3. 创建实例并输出',
      template: `#[derive(Debug)]
struct Excerpt<'a> {
    text: &'a str,
}

impl<'a> Excerpt<'a> {
    fn new(text: &'a str) -> Self {
        Excerpt { text }
    }
    
    fn get_text(&self) -> &str {
        self.text
    }
}

fn main() {
    let text = String::from("Hello, lifetime!");
    let excerpt = Excerpt::new(&text);
    println!("Excerpt: {}", excerpt.get_text());
}`,
      validation: {
        required: ["struct Excerpt", "'a", "impl", "fn get_text", "println!"],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 'Excerpt: Hello, lifetime!', description: '使用生命周期' },
        ],
      },
    },
  },
  {
    id: 'w14',
    name: '错误处理：故障恢复',
    phase: 3,
    description: 'panic、Result、? 运算符、自定义错误',
    levels: [
      {
        id: 'w14-l01',
        title: 'panic 与不可恢复错误',
        type: 'choice',
        lesson: 'panic! 宏让程序崩溃。用于不可恢复的错误。',
        hint: 'panic! 会终止程序。',
        question: 'panic! 会发生什么？',
        options: [
          { id: 'a', text: '程序崩溃并显示错误信息', isCorrect: true },
          { id: 'b', text: '忽略错误继续执行', isCorrect: false },
          { id: 'c', text: '返回错误码', isCorrect: false },
          { id: 'd', text: '跳过当前函数', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'panic! 让程序立即崩溃，用于不可恢复的错误。',
      },
      {
        id: 'w14-l02',
        title: 'Result 枚举',
        type: 'judge',
        lesson: 'Result<T, E> 表示可能成功（Ok(T)）或失败（Err(E)）。用于可恢复错误。',
        hint: 'Result 有两个变体。',
        question: 'Result 有哪些变体？',
        code: 'enum Result<T, E> {\n    Ok(T),\n    Err(E),\n}',
        judgeAnswer: true,
        solution: 'true',
        explanation: 'Ok 包含成功值，Err 包含错误信息。',
      },
      {
        id: 'w14-l03',
        title: '处理 Result',
        type: 'fill',
        lesson: '用 match 或 unwrap() 处理 Result。match 更安全，unwrap 会 panic。',
        hint: 'match 可以分别处理 Ok 和 Err。',
        question: '补全代码，用 match 处理 Result',
        code: 'match file_result {\n    Ok(file) => println!("Opened"),\n    Err(e) => println!("Error: {}", e),\n}',
        blanks: ['Ok', 'Some', 'Success', 'Result'],
        blanksCount: 1,
        solution: 'Ok',
        explanation: 'Ok 匹配成功情况，Err 匹配错误情况。',
      },
      {
        id: 'w14-l04',
        title: '? 运算符',
        type: 'choice',
        lesson: '? 运算符是 match 的简写。成功则继续，失败则提前返回错误。',
        hint: '? 在 Result 后面。',
        question: '? 运算符的作用是什么？',
        options: [
          { id: 'a', text: '成功继续，失败返回错误', isCorrect: true },
          { id: 'b', text: '忽略错误', isCorrect: false },
          { id: 'c', text: '转换错误类型', isCorrect: false },
          { id: 'd', text: '重试操作', isCorrect: false },
        ],
        solution: 'a',
        explanation: '? 运算符简化错误传播，失败时提前返回。',
      },
      {
        id: 'w14-l05',
        title: '使用 ? 运算符',
        type: 'order',
        lesson: '? 可以链式调用，让错误处理代码更简洁。',
        hint: '每个可能失败的操作后加 ?。',
        question: '排列代码行，用 ? 运算符：',
        shuffledLines: [
          '}',
          'fn read_file() -> Result<String, io::Error> {',
          '    let content = fs::read_to_string("file.txt")?;',
          '    Ok(content)',
        ],
        solution: ['fn read_file() -> Result<String, io::Error> {', '    let content = fs::read_to_string("file.txt")?;', '    Ok(content)', '}'],
        explanation: '? 自动传播错误，成功时继续执行。',
      },
      {
        id: 'w14-l06',
        title: '自定义错误',
        type: 'fill',
        lesson: '可以定义自己的错误类型，通常实现 Display 和 Error trait。',
        hint: 'struct 或 enum 都可以作为错误类型。',
        question: '补全代码，定义自定义错误',
        code: 'enum AppError {\n    NotFound,\n    PermissionDenied,\n}',
        blanks: ['AppError', 'Error', 'CustomError', 'MyError'],
        blanksCount: 1,
        solution: 'AppError',
        explanation: '用枚举定义不同类型的错误。',
      },
      {
        id: 'w14-l07',
        title: 'unwrap 和 expect',
        type: 'judge',
        lesson: 'unwrap() 和 expect() 会 panic。expect 可以自定义错误信息。生产代码应该用 match 或 ?。',
        hint: 'unwrap 在错误时会 panic。',
        question: '这段代码在文件不存在时会怎样？\nlet content = fs::read_to_string("file.txt").unwrap();',
        code: 'let content = fs::read_to_string("file.txt").unwrap();',
        judgeAnswer: false,
        solution: 'false',
        explanation: 'unwrap() 在错误时会 panic，程序崩溃。',
      },
      {
        id: 'w14-l08',
        title: '何时用 panic',
        type: 'choice',
        lesson: 'panic 用于：原型开发、测试、不可恢复错误。Result 用于：可恢复的运行时错误。',
        hint: '大多数情况下用 Result。',
        question: '以下哪种情况应该用 Result 而不是 panic？',
        options: [
          { id: 'a', text: '用户输入文件名不存在', isCorrect: true },
          { id: 'b', text: '数组越界访问', isCorrect: false },
          { id: 'c', text: '程序逻辑不可能发生', isCorrect: false },
          { id: 'd', text: '测试断言失败', isCorrect: false },
        ],
        solution: 'a',
        explanation: '用户输入错误是可恢复的，应该用 Result。',
      },
    ],
    boss: {
      title: '错误处理挑战',
      description: '编写程序：\n1. 定义 parse_number 函数，返回 Result\n2. 用 ? 运算符处理错误\n3. 成功输出数字，失败输出错误',
      template: `use std::num::ParseIntError;

fn parse_number(s: &str) -> Result<i32, ParseIntError> {
    let n = s.parse::<i32>()?;
    Ok(n)
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
}`,
      validation: {
        required: ['fn parse_number', 'Result', '?', 'match', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 'Parsed: 42\nError: invalid digit found in string', description: '处理成功和失败' },
        ],
      },
    },
  },
  {
    id: 'w15',
    name: '模块系统：代码组织',
    phase: 4,
    description: 'mod、pub、use、模块树、文件分层',
    levels: [
      {
        id: 'w15-l01',
        title: '定义模块',
        type: 'choice',
        lesson: 'mod 关键字定义模块，用花括号包围模块内容。模块可以嵌套。',
        hint: 'mod 后面是模块名。',
        question: '如何定义一个模块？',
        options: [
          { id: 'a', text: 'mod my_module { ... }', isCorrect: true },
          { id: 'b', text: 'module my_module { ... }', isCorrect: false },
          { id: 'c', text: 'package my_module { ... }', isCorrect: false },
          { id: 'd', text: 'namespace my_module { ... }', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'mod 关键字定义模块。',
      },
      {
        id: 'w15-l02',
        title: '可见性',
        type: 'fill',
        lesson: '默认模块内的项是私有的。用 pub 关键字使其公开。',
        hint: 'pub 是 public 的缩写。',
        question: '补全代码，使函数公开',
        code: 'mod my_module {\n    ___ fn greet() {\n        println!("Hello!");\n    }\n}',
        blanks: ['pub', 'public', 'open', 'export'],
        blanksCount: 1,
        solution: 'pub',
        explanation: 'pub 使函数对外部可见。',
      },
      {
        id: 'w15-l03',
        title: 'use 关键字',
        type: 'order',
        lesson: 'use 可以把模块中的项引入当前作用域，避免写完整路径。',
        hint: 'use 路径::到::项;',
        question: '排列代码行，使用 use 引入模块：',
        shuffledLines: [
          'use my_module::greet;',
          'mod my_module {',
          '    pub fn greet() { println!("Hi"); }',
          '}',
          'fn main() { greet(); }',
        ],
        solution: ['mod my_module {', '    pub fn greet() { println!("Hi"); }', '}', 'use my_module::greet;', 'fn main() { greet(); }'],
        explanation: 'use 引入模块中的项，然后可以直接使用。',
      },
      {
        id: 'w15-l04',
        title: '文件模块',
        type: 'judge',
        lesson: 'mod 可以从文件加载模块。mod my_module; 会查找 my_module.rs 或 my_module/mod.rs。',
        hint: '分号表示从文件加载。',
        question: '这行代码会怎样？\nmod utils;',
        code: 'mod utils;',
        judgeAnswer: true,
        solution: 'true',
        explanation: 'mod utils; 从 utils.rs 或 utils/mod.rs 加载模块。',
      },
      {
        id: 'w15-l05',
        title: '模块路径',
        type: 'fill',
        lesson: '绝对路径从 crate:: 开始，相对路径从 self:: 或 super:: 开始。',
        hint: 'crate 表示当前 crate 的根。',
        question: '补全路径，使用绝对路径',
        code: 'use crate::my_module::my_function;',
        blanks: ['crate', 'self', 'super', 'root'],
        blanksCount: 1,
        solution: 'crate',
        explanation: 'crate:: 是绝对路径的起点。',
      },
      {
        id: 'w15-l06',
        title: '结构体可见性',
        type: 'choice',
        lesson: '结构体用 pub 可以公开，但字段默认还是私有的。需要单独 pub 字段。',
        hint: 'pub struct 和 pub field 是分开的。',
        question: 'pub struct 的字段默认是？',
        options: [
          { id: 'a', text: '私有的', isCorrect: true },
          { id: 'b', text: '公开的', isCorrect: false },
          { id: 'c', text: '受保护的', isCorrect: false },
          { id: 'd', text: '只读的', isCorrect: false },
        ],
        solution: 'a',
        explanation: '结构体公开不代表字段公开，需要单独标记 pub。',
      },
    ],
    boss: {
      title: '模块挑战',
      description: '编写程序：\n1. 创建 math 模块\n2. 公开 add 和 subtract 函数\n3. 在 main 中使用它们',
      template: `mod math {
    pub fn add(a: i32, b: i32) -> i32 {
        a + b
    }
    
    pub fn subtract(a: i32, b: i32) -> i32 {
        a - b
    }
}

use math::{add, subtract};

fn main() {
    println!("Add: {}", add(10, 5));
    println!("Subtract: {}", subtract(10, 5));
}`,
      validation: {
        required: ['mod math', 'pub fn', 'use math', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 'Add: 15\nSubtract: 5', description: '使用模块函数' },
        ],
      },
    },
  },
  {
    id: 'w16',
    name: '测试：质量保障',
    phase: 4,
    description: '#[test]、assert、单元测试、集成测试',
    levels: [
      {
        id: 'w16-l01',
        title: '测试函数',
        type: 'fill',
        lesson: '#[test] 属性标记一个函数为测试函数。cargo test 运行所有测试。',
        hint: '#[test] 在函数上面。',
        question: '补全代码，定义测试函数',
        code: '___\nfn test_addition() {\n    assert_eq!(2 + 2, 4);\n}',
        blanks: ['#[test]', '#[test]', '@test', 'test'],
        blanksCount: 1,
        solution: '#[test]',
        explanation: '#[test] 标记函数为测试。',
      },
      {
        id: 'w16-l02',
        title: 'assert 宏',
        type: 'choice',
        lesson: 'assert!(condition) 断言条件为真。assert_eq!(a, b) 断言相等。assert_ne!(a, b) 断言不等。',
        hint: 'assert_eq 比较两个值。',
        question: '哪个宏断言两个值相等？',
        options: [
          { id: 'a', text: 'assert_eq!', isCorrect: true },
          { id: 'b', text: 'assert!', isCorrect: false },
          { id: 'c', text: 'assert_ne!', isCorrect: false },
          { id: 'd', text: 'equals!', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'assert_eq!(a, b) 断言 a == b。',
      },
      {
        id: 'w16-l03',
        title: '测试失败',
        type: 'judge',
        lesson: '测试函数 panic 时测试失败。should_panic 属性测试函数是否会 panic。',
        hint: '#[should_panic] 测试预期的 panic。',
        question: '这段测试会通过吗？\n#[test]\nfn test_panic() {\n    panic!("expected");\n}',
        code: '#[test]\nfn test_panic() {\n    panic!("expected");\n}',
        judgeAnswer: false,
        solution: 'false',
        explanation: 'panic 会导致测试失败，除非标记 #[should_panic]。',
      },
      {
        id: 'w16-l04',
        title: 'Result 测试',
        type: 'fill',
        lesson: '测试函数可以返回 Result<(), E>，用 ? 运算符传播错误。',
        hint: '返回 Result 的测试更简洁。',
        question: '补全测试函数签名',
        code: '#[test]\nfn test_parse() -> Result<(), Box<dyn Error>> {\n    let _n: i32 = "42".parse()?;\n    Ok(())\n}',
        blanks: ['Result<(), Box<dyn Error>>', 'Result', 'Option', 'bool'],
        blanksCount: 1,
        solution: 'Result<(), Box<dyn Error>>',
        explanation: '返回 Result 的测试用 ? 传播错误。',
      },
      {
        id: 'w16-l05',
        title: '测试模块',
        type: 'order',
        lesson: '测试通常放在 #[cfg(test)] 模块中，这样测试代码不会编译到发布版本。',
        hint: '#[cfg(test)] 只在测试时编译。',
        question: '排列代码行，创建测试模块：',
        shuffledLines: [
          '    #[test]',
          '#[cfg(test)]',
          '    fn it_works() { assert_eq!(2 + 2, 4); }',
          'mod tests {',
          '}',
        ],
        solution: ['#[cfg(test)]', 'mod tests {', '    #[test]', '    fn it_works() { assert_eq!(2 + 2, 4); }', '}'],
        explanation: '#[cfg(test)] 模块只在测试时编译。',
      },
    ],
    boss: {
      title: '测试挑战',
      description: '编写程序：\n1. 实现 add 函数\n2. 编写 3 个测试用例\n3. 所有测试通过',
      template: `fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_positive() {
        assert_eq!(add(2, 3), 5);
    }
    
    #[test]
    fn test_negative() {
        assert_eq!(add(-1, 1), 0);
    }
    
    #[test]
    fn test_zero() {
        assert_eq!(add(0, 0), 0);
    }
}`,
      validation: {
        required: ['fn add', '#[test]', 'assert_eq!', 'mod tests'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: '', description: '测试通过' },
        ],
      },
    },
  },
  {
    id: 'w17',
    name: '迭代器：数据流管道',
    phase: 4,
    description: 'Iterator、map/filter/fold、闭包入门',
    levels: [
      {
        id: 'w17-l01',
        title: '创建迭代器',
        type: 'choice',
        lesson: 'iter() 创建不可变引用迭代器，into_iter() 获取所有权，iter_mut() 创建可变引用。',
        hint: 'iter() 是最常用的。',
        question: '如何创建 Vec 的迭代器？',
        options: [
          { id: 'a', text: 'v.iter()', isCorrect: true },
          { id: 'b', text: 'v.iterator()', isCorrect: false },
          { id: 'c', text: 'v.each()', isCorrect: false },
          { id: 'd', text: 'v.loop()', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'iter() 创建迭代器。',
      },
      {
        id: 'w17-l02',
        title: 'for 循环与迭代器',
        type: 'judge',
        lesson: 'for 循环内部使用迭代器。for x in &v 等价于 for x in v.iter()。',
        hint: 'for 自动调用 into_iter()。',
        question: '这两段代码等价吗？\nfor x in &v { }\nvs\nfor x in v.iter() { }',
        code: 'for x in &v { }\nfor x in v.iter() { }',
        judgeAnswer: true,
        solution: 'true',
        explanation: 'for x in &v 和 for x in v.iter() 是等价的。',
      },
      {
        id: 'w17-l03',
        title: 'map 方法',
        type: 'fill',
        lesson: 'map() 对每个元素应用一个闭包，返回新的迭代器。',
        hint: 'map 转换每个元素。',
        question: '补全代码，将数字翻倍',
        code: 'let v = vec![1, 2, 3];\nlet doubled: Vec<i32> = v.iter().___(|x| x * 2).collect();',
        blanks: ['map', 'transform', 'apply', 'each'],
        blanksCount: 1,
        solution: 'map',
        explanation: 'map() 转换每个元素。',
      },
      {
        id: 'w17-l04',
        title: 'filter 方法',
        type: 'order',
        lesson: 'filter() 保留满足条件的元素。闭包返回 true 保留，false 过滤掉。',
        hint: 'filter 过滤元素。',
        question: '排列代码行，过滤偶数：',
        shuffledLines: [
          'let even: Vec<&i32> = v.iter().filter(|&&x| x % 2 == 0).collect();',
          'let v = vec![1, 2, 3, 4, 5];',
        ],
        solution: ['let v = vec![1, 2, 3, 4, 5];', 'let even: Vec<&i32> = v.iter().filter(|&&x| x % 2 == 0).collect();'],
        explanation: 'filter 保留满足条件的元素。',
      },
      {
        id: 'w17-l05',
        title: 'fold 方法',
        type: 'fill',
        lesson: 'fold() 把迭代器归约为单个值。fold(初始值, |累加器, 元素| ...)。',
        hint: 'fold 类似 reduce。',
        question: '补全代码，计算总和',
        code: 'let v = vec![1, 2, 3, 4, 5];\nlet sum = v.iter().___(0, |acc, x| acc + x);',
        blanks: ['fold', 'reduce', 'sum', 'aggregate'],
        blanksCount: 1,
        solution: 'fold',
        explanation: 'fold(0, |acc, x| acc + x) 计算总和。',
      },
      {
        id: 'w17-l06',
        title: '链式调用',
        type: 'judge',
        lesson: '迭代器方法可以链式调用，形成数据处理管道。',
        hint: '每个方法返回新的迭代器。',
        question: '这段代码能编译吗？\nlet result: Vec<i32> = v.iter().filter(|&&x| x > 2).map(|&x| x * 2).collect();',
        code: 'let result: Vec<i32> = v.iter().filter(|&&x| x > 2).map(|&x| x * 2).collect();',
        judgeAnswer: true,
        solution: 'true',
        explanation: '迭代器方法可以链式调用。',
      },
    ],
    boss: {
      title: '迭代器挑战',
      description: '编写程序：\n1. 创建 Vec 包含 1-10\n2. 用迭代器过滤偶数\n3. 计算偶数的平方和',
      template: `fn main() {
    let v = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    let sum: i32 = v.iter()
        .filter(|&&x| x % 2 == 0)
        .map(|&x| x * x)
        .sum();
    
    println!("Sum of even squares: {}", sum);
}`,
      validation: {
        required: ['iter()', 'filter', 'map', 'sum()', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 'Sum of even squares: 220', description: '计算偶数平方和' },
        ],
      },
    },
  },
  {
    id: 'w18',
    name: '闭包：匿名函数',
    phase: 4,
    description: '闭包语法、Fn/FnMut/FnOnce、move',
    levels: [
      {
        id: 'w18-l01',
        title: '闭包语法',
        type: 'choice',
        lesson: '闭包用 |参数| 表达式 定义。可以捕获环境中的变量。',
        hint: '| 类似 def 或 lambda。',
        question: '如何定义一个闭包？',
        options: [
          { id: 'a', text: '|x| x + 1', isCorrect: true },
          { id: 'b', text: '(x) => x + 1', isCorrect: false },
          { id: 'c', text: 'lambda x: x + 1', isCorrect: false },
          { id: 'd', text: 'def x: x + 1', isCorrect: false },
        ],
        solution: 'a',
        explanation: '|x| x + 1 是 Rust 闭包语法。',
      },
      {
        id: 'w18-l02',
        title: '类型推断',
        type: 'judge',
        lesson: '闭包通常可以推断参数和返回类型，不需要标注。',
        hint: '编译器能推断类型。',
        question: '这段代码能编译吗？\nlet add = |a, b| a + b;\nlet result = add(1, 2);',
        code: 'let add = |a, b| a + b;\nlet result = add(1, 2);',
        judgeAnswer: true,
        solution: 'true',
        explanation: '闭包可以自动推断类型。',
      },
      {
        id: 'w18-l03',
        title: '捕获环境',
        type: 'fill',
        lesson: '闭包可以捕获定义时环境中的变量。默认借用（不可变或可变）。',
        hint: '闭包可以使用外部变量。',
        question: '补全代码，捕获外部变量',
        code: 'let x = 5;\nlet print_x = || println!("{}", x);\nprint_x();',
        blanks: ['||', '|x|', 'fn()', 'closure'],
        blanksCount: 1,
        solution: '||',
        explanation: '|| 表示没有参数的闭包，捕获了 x。',
      },
      {
        id: 'w18-l04',
        title: 'Fn trait',
        type: 'choice',
        lesson: '闭包实现 Fn（借用不变）、FnMut（借用可变）、FnOnce（获取所有权）三种 trait。',
        hint: 'Fn 最常见。',
        question: '哪种 trait 表示闭包获取所有权（只能调用一次）？',
        options: [
          { id: 'a', text: 'FnOnce', isCorrect: true },
          { id: 'b', text: 'Fn', isCorrect: false },
          { id: 'c', text: 'FnMut', isCorrect: false },
          { id: 'd', text: 'FnOnceMut', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'FnOnce 表示闭包获取所有权，只能调用一次。',
      },
      {
        id: 'w18-l05',
        title: 'move 关键字',
        type: 'fill',
        lesson: 'move 强制闭包获取所有权，即使闭包本来只需要借用。',
        hint: 'move 在 | 前面。',
        question: '补全代码，强制获取所有权',
        code: 'let name = String::from("Alice");\nlet greet = ___ move || println!("Hello, {}", name);',
        blanks: ['', 'fn', 'let', 'mut'],
        blanksCount: 1,
        solution: '',
        explanation: 'move || 强制闭包获取 name 的所有权。',
      },
      {
        id: 'w18-l06',
        title: '闭包作为参数',
        type: 'order',
        lesson: '函数参数用 impl Fn 或泛型 <F: Fn()> 接受闭包。',
        hint: 'Fn() 表示无参数无返回值的闭包。',
        question: '排列代码行，定义接受闭包的函数：',
        shuffledLines: [
          '    f();',
          '}',
          'fn call_twice<F: Fn()>(f: F) {',
          '    f();',
        ],
        solution: ['fn call_twice<F: Fn()>(f: F) {', '    f();', '    f();', '}'],
        explanation: '泛型 F: Fn() 接受任何无参数闭包。',
      },
    ],
    boss: {
      title: '闭包挑战',
      description: '编写程序：\n1. 创建一个计数器闭包\n2. 用 FnMut 允许修改\n3. 多次调用并输出结果',
      template: `fn main() {
    let mut count = 0;
    let mut increment = || {
        count += 1;
        count
    };
    
    println!("Count: {}", increment());
    println!("Count: {}", increment());
    println!("Count: {}", increment());
}`,
      validation: {
        required: ['||', 'FnMut', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 'Count: 1\nCount: 2\nCount: 3', description: '计数器递增' },
        ],
      },
    },
  },
  {
    id: 'w19',
    name: '智能指针：内存装备',
    phase: 4,
    description: 'Box、Deref、Drop、Rc、RefCell',
    levels: [
      {
        id: 'w19-l01',
        title: 'Box<T>',
        type: 'choice',
        lesson: 'Box<T> 在堆上分配数据。用于递归类型、大数据转移、trait 对象。',
        hint: 'Box 是最简单的智能指针。',
        question: 'Box<T> 把数据存储在哪里？',
        options: [
          { id: 'a', text: '堆上', isCorrect: true },
          { id: 'b', text: '栈上', isCorrect: false },
          { id: 'c', text: '静态内存', isCorrect: false },
          { id: 'd', text: '寄存器', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'Box 在堆上分配数据。',
      },
      {
        id: 'w19-l02',
        title: '递归类型',
        type: 'fill',
        lesson: '递归类型（如链表）需要用 Box 包装，否则编译器无法确定大小。',
        hint: 'Box 有固定大小（指针）。',
        question: '补全代码，定义递归类型',
        code: 'enum List {\n    Cons(i32, Box<List>),\n    Nil,\n}',
        blanks: ['Box', 'Vec', 'Rc', 'Arc'],
        blanksCount: 1,
        solution: 'Box',
        explanation: 'Box 让递归类型有固定大小。',
      },
      {
        id: 'w19-l03',
        title: 'Deref trait',
        type: 'judge',
        lesson: 'Deref trait 让智能指针像引用一样使用。* 运算符会调用 deref()。',
        hint: 'Deref 实现解引用行为。',
        question: 'Box<i32> 可以像 &i32 一样使用吗？',
        code: 'let x = Box::new(5);\nprintln!("{}", *x);',
        judgeAnswer: true,
        solution: 'true',
        explanation: 'Box 实现了 Deref，可以像引用一样解引用。',
      },
      {
        id: 'w19-l04',
        title: 'Drop trait',
        type: 'fill',
        lesson: 'Drop trait 定义值离开作用域时的行为。用 drop() 提前释放。',
        hint: 'Drop 类似析构函数。',
        question: '补全代码，实现 Drop',
        code: 'impl Drop for MyType {\n    fn drop(&mut self) {\n        println!("Dropping!");\n    }\n}',
        blanks: ['Drop', 'Drop', 'Drop', 'Drop'],
        blanksCount: 1,
        solution: 'Drop',
        explanation: 'impl Drop 实现清理逻辑。',
      },
      {
        id: 'w19-l05',
        title: 'Rc<T>',
        type: 'choice',
        lesson: 'Rc<T>（引用计数）允许多个所有者。当引用计数为 0 时释放。',
        hint: 'Rc 用于共享所有权。',
        question: 'Rc<T> 的主要用途是什么？',
        options: [
          { id: 'a', text: '多个所有者共享数据', isCorrect: true },
          { id: 'b', text: '线程安全', isCorrect: false },
          { id: 'c', text: '可变性', isCorrect: false },
          { id: 'd', text: '性能优化', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'Rc 允许多个所有者共享同一数据。',
      },
      {
        id: 'w19-l06',
        title: 'RefCell<T>',
        type: 'judge',
        lesson: 'RefCell<T> 在运行时检查借用规则，允许内部可变性。',
        hint: 'RefCell 绕过编译时检查。',
        question: 'RefCell<T> 可以在不可变引用下修改内部数据吗？',
        code: 'use std::cell::RefCell;\nlet x = RefCell::new(5);\n*x.borrow_mut() = 10;',
        judgeAnswer: true,
        solution: 'true',
        explanation: 'RefCell 提供内部可变性，运行时检查借用。',
      },
    ],
    boss: {
      title: '智能指针挑战',
      description: '编写程序：\n1. 用 Box 创建递归链表\n2. 用 Rc 共享数据\n3. 输出结果',
      template: `use std::rc::Rc;

enum List {
    Cons(i32, Rc<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    let a = Rc::new(Cons(5, Rc::new(Cons(10, Rc::new(Nil)))));
    let b = Cons(3, Rc::clone(&a));
    let c = Cons(4, Rc::clone(&a));
    
    println!("a refcount: {}", Rc::strong_count(&a));
}`,
      validation: {
        required: ['Box', 'Rc', 'enum List', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 'a refcount: 3', description: '引用计数' },
        ],
      },
    },
  },
  {
    id: 'w20',
    name: '并发：多线程攻防',
    phase: 5,
    description: 'thread、mpsc、Mutex/Arc、Send/Sync',
    levels: [
      {
        id: 'w20-l01',
        title: '创建线程',
        type: 'fill',
        lesson: 'std::thread::spawn 创建新线程。join() 等待线程完成。',
        hint: 'spawn 生成线程。',
        question: '补全代码，创建线程',
        code: 'use std::thread;\n\nlet handle = thread::spawn(|| {\n    println!("Hello from thread!");\n});\n\nhandle.join().unwrap();',
        blanks: ['thread::spawn', 'thread::new', 'thread::create', 'thread::start'],
        blanksCount: 1,
        solution: 'thread::spawn',
        explanation: 'thread::spawn 创建新线程。',
      },
      {
        id: 'w20-l02',
        title: 'move 与线程',
        type: 'judge',
        lesson: '线程闭包通常需要 move 获取数据所有权，因为线程可能比创建者活得更久。',
        hint: 'move 转移所有权给线程。',
        question: '这段代码能编译吗？\nlet data = vec![1, 2, 3];\nthread::spawn(|| println!("{:?}", data));',
        code: 'let data = vec![1, 2, 3];\nthread::spawn(|| println!("{:?}", data));',
        judgeAnswer: false,
        solution: 'false',
        explanation: '需要 move 获取 data 的所有权。',
      },
      {
        id: 'w20-l03',
        title: '消息传递',
        type: 'fill',
        lesson: 'mpsc::channel 创建通道。tx 发送，rx 接收。多生产者，单消费者。',
        hint: 'channel 是消息传递的基础。',
        question: '补全代码，创建通道',
        code: 'use std::sync::mpsc;\n\nlet (tx, rx) = mpsc::channel();',
        blanks: ['mpsc::channel', 'channel::new', 'mpsc::new', 'Channel::create'],
        blanksCount: 1,
        solution: 'mpsc::channel',
        explanation: 'mpsc::channel() 创建发送和接收端。',
      },
      {
        id: 'w20-l04',
        title: 'Mutex<T>',
        type: 'choice',
        lesson: 'Mutex<T> 保护共享数据，同一时间只有一个线程可以访问。',
        hint: 'Mutex 是互斥锁。',
        question: 'Mutex<T> 的主要作用是什么？',
        options: [
          { id: 'a', text: '保护共享数据，防止数据竞争', isCorrect: true },
          { id: 'b', text: '提高性能', isCorrect: false },
          { id: 'c', text: '内存管理', isCorrect: false },
          { id: 'd', text: '错误处理', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'Mutex 通过锁保护共享数据。',
      },
      {
        id: 'w20-l05',
        title: 'Arc<T>',
        type: 'order',
        lesson: 'Arc<T>（原子引用计数）是线程安全的 Rc<T>。用 Arc<Mutex<T>> 共享可变数据。',
        hint: 'Arc 用于线程间共享。',
        question: '排列代码行，共享可变数据：',
        shuffledLines: [
          'let data = Arc::new(Mutex::new(0));',
          'let data_clone = Arc::clone(&data);',
          'let handle = thread::spawn(move || {',
          '    *data_clone.lock().unwrap() = 42;',
          '});',
        ],
        solution: ['let data = Arc::new(Mutex::new(0));', 'let data_clone = Arc::clone(&data);', 'let handle = thread::spawn(move || {', '    *data_clone.lock().unwrap() = 42;', '});'],
        explanation: 'Arc<Mutex<T>> 是线程间共享可变数据的标准模式。',
      },
      {
        id: 'w20-l06',
        title: 'Send 和 Sync',
        type: 'judge',
        lesson: 'Send 表示可以在线程间转移所有权。Sync 表示可以在线程间共享引用。',
        hint: '大多数类型自动实现 Send 和 Sync。',
        question: 'Rc<T> 实现了 Send trait 吗？',
        code: '// Rc<T> 不是线程安全的，没有实现 Send',
        judgeAnswer: false,
        solution: 'false',
        explanation: 'Rc<T> 不是线程安全的，应该用 Arc<T>。',
      },
    ],
    boss: {
      title: '并发挑战',
      description: '编写程序：\n1. 创建多个线程\n2. 用 Arc<Mutex<i32>> 共享计数器\n3. 每个线程增加计数器\n4. 输出最终结果',
      template: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..5 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}`,
      validation: {
        required: ['Arc', 'Mutex', 'thread::spawn', 'lock()', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 'Result: 5', description: '多线程计数' },
        ],
      },
    },
  },
  {
    id: 'w21',
    name: '异步编程：异步突袭',
    phase: 5,
    description: 'async/await、Future、tokio',
    levels: [
      {
        id: 'w21-l01',
        title: 'async 函数',
        type: 'fill',
        lesson: 'async fn 定义异步函数，返回 Future。await 等待 Future 完成。',
        hint: 'async 在 fn 前面。',
        question: '补全代码，定义异步函数',
        code: '___ fn fetch_data() -> String {\n    // async work\n    String::from("data")\n}',
        blanks: ['async', 'await', 'future', 'promise'],
        blanksCount: 1,
        solution: 'async',
        explanation: 'async fn 定义异步函数。',
      },
      {
        id: 'w21-l02',
        title: 'await 关键字',
        type: 'choice',
        lesson: '.await 暂停当前任务，等待 Future 完成。不会阻塞线程。',
        hint: 'await 在 Future 后面。',
        question: '.await 的作用是什么？',
        options: [
          { id: 'a', text: '暂停当前任务，等待异步操作完成', isCorrect: true },
          { id: 'b', text: '阻塞当前线程', isCorrect: false },
          { id: 'c', text: '创建新线程', isCorrect: false },
          { id: 'd', text: '取消操作', isCorrect: false },
        ],
        solution: 'a',
        explanation: '.await 暂停任务但不阻塞线程。',
      },
      {
        id: 'w21-l03',
        title: 'Future trait',
        type: 'judge',
        lesson: 'Future trait 表示一个异步计算。poll() 方法驱动 Future 执行。',
        hint: 'Future 是异步的核心抽象。',
        question: 'Future 的 poll 方法返回什么？',
        code: 'enum Poll<T> {\n    Ready(T),\n    Pending,\n}',
        judgeAnswer: true,
        solution: 'true',
        explanation: 'Poll::Ready 表示完成，Poll::Pending 表示还需等待。',
      },
      {
        id: 'w21-l04',
        title: '异步运行时',
        type: 'fill',
        lesson: 'Rust 没有内置异步运行时。tokio 是最流行的第三方运行时。',
        hint: '需要第三方库。',
        question: '补全代码，使用 tokio 运行时',
        code: '#[tokio::main]\nasync fn main() {\n    // async code\n}',
        blanks: ['tokio::main', 'async_runtime', 'runtime::main', 'async::main'],
        blanksCount: 1,
        solution: 'tokio::main',
        explanation: '#[tokio::main] 宏设置异步运行时。',
      },
      {
        id: 'w21-l05',
        title: '并发 Future',
        type: 'order',
        lesson: 'tokio::join! 可以同时运行多个 Future。tokio::spawn 创建独立任务。',
        hint: 'join! 并发执行。',
        question: '排列代码行，同时执行两个异步操作：',
        shuffledLines: [
          'let (a, b) = tokio::join!(async_op1(), async_op2());',
        ],
        solution: ['let (a, b) = tokio::join!(async_op1(), async_op2());'],
        explanation: 'tokio::join! 并发执行多个 Future。',
      },
    ],
    boss: {
      title: '异步挑战',
      description: '编写程序：\n1. 使用 tokio 运行时\n2. 创建异步函数\n3. 并发执行多个任务\n4. 输出结果',
      template: `async fn fetch_user() -> String {
    // 模拟异步操作
    String::from("Alice")
}

async fn fetch_score() -> i32 {
    // 模拟异步操作
    100
}

#[tokio::main]
async fn main() {
    let (user, score) = tokio::join!(fetch_user(), fetch_score());
    println!("User: {}, Score: {}", user, score);
}`,
      validation: {
        required: ['async fn', 'tokio::main', 'tokio::join!', 'println!'],
        forbidden: ['unsafe'],
        testCases: [
          { input: '', expected: 'User: Alice, Score: 100', description: '异步获取数据' },
        ],
      },
    },
  },
  {
    id: 'w22',
    name: '不安全 Rust：底层操作',
    phase: 5,
    description: 'unsafe、裸指针、FFI',
    levels: [
      {
        id: 'w22-l01',
        title: 'unsafe 关键字',
        type: 'choice',
        lesson: 'unsafe 块允许五种操作：解引用裸指针、调用不安全函数、访问可变静态变量、实现不安全 trait。',
        hint: 'unsafe 解除编译器的部分检查。',
        question: 'unsafe 允许以下哪种操作？',
        options: [
          { id: 'a', text: '解引用裸指针', isCorrect: true },
          { id: 'b', text: '跳过借用检查', isCorrect: false },
          { id: 'c', text: '禁用类型检查', isCorrect: false },
          { id: 'd', text: '忽略所有错误', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'unsafe 允许解引用裸指针等底层操作。',
      },
      {
        id: 'w22-l02',
        title: '裸指针',
        type: 'fill',
        lesson: '裸指针 *const T 和 *mut T 可以绕过借用规则。创建安全，解引用需要 unsafe。',
        hint: '*const 不可变，*mut 可变。',
        question: '补全代码，创建裸指针',
        code: 'let mut x = 5;\nlet r = &mut x as *mut i32;',
        blanks: ['*mut i32', '*const i32', 'mut i32', 'raw i32'],
        blanksCount: 1,
        solution: '*mut i32',
        explanation: 'as *mut i32 创建可变裸指针。',
      },
      {
        id: 'w22-l03',
        title: '不安全函数',
        type: 'judge',
        lesson: 'unsafe fn 标记函数为不安全，调用时需要 unsafe 块。',
        hint: '调用不安全函数需要 unsafe。',
        question: '这段代码能编译吗？\nunsafe fn dangerous() { }\ndangerous();',
        code: 'unsafe fn dangerous() { }\ndangerous();',
        judgeAnswer: false,
        solution: 'false',
        explanation: '调用 unsafe fn 需要在 unsafe 块中。',
      },
      {
        id: 'w22-l04',
        title: 'extern 与 FFI',
        type: 'fill',
        lesson: 'extern 声明外部函数（如 C 函数）。需要 unsafe 块调用。',
        hint: 'extern "C" 声明 C 函数。',
        question: '补全代码，声明外部函数',
        code: 'extern "C" {\n    fn abs(input: i32) -> i32;\n}',
        blanks: ['extern', 'extern', 'foreign', 'import'],
        blanksCount: 1,
        solution: 'extern',
        explanation: 'extern "C" 声明 C ABI 函数。',
      },
      {
        id: 'w22-l05',
        title: '安全抽象',
        type: 'order',
        lesson: '最佳实践：用安全 API 包装 unsafe 代码，对外暴露安全接口。',
        hint: 'unsafe 代码应该被安全封装。',
        question: '排列代码行，创建安全抽象：',
        shuffledLines: [
          '}',
          'fn safe_add(a: *const i32, b: *const i32) -> i32 {',
          '    unsafe { *a + *b }',
        ],
        solution: ['fn safe_add(a: *const i32, b: *const i32) -> i32 {', '    unsafe { *a + *b }', '}'],
        explanation: '安全函数包装 unsafe 操作。',
      },
    ],
    boss: {
      title: 'unsafe 挑战',
      description: '编写程序：\n1. 创建裸指针\n2. 在 unsafe 块中解引用\n3. 调用 extern 函数\n4. 输出结果',
      template: `extern "C" {
    fn abs(input: i32) -> i32;
}

fn main() {
    let mut x = 42;
    let r = &mut x as *mut i32;
    
    unsafe {
        println!("Value: {}", *r);
        println!("Abs: {}", abs(-5));
    }
}`,
      validation: {
        required: ['unsafe', '*mut', '*const', 'extern', 'println!'],
        forbidden: [],
        testCases: [
          { input: '', expected: 'Value: 42\nAbs: 5', description: 'unsafe 操作' },
        ],
      },
    },
  },
  {
    id: 'w23',
    name: '综合实战：赛博渗透',
    phase: 6,
    description: '完整 CLI 渗透测试工具构建',
    levels: [
      {
        id: 'w23-l01',
        title: '项目结构',
        type: 'order',
        lesson: '大型项目用 Cargo 管理。src/main.rs 是入口，lib.rs 是库代码。',
        hint: 'cargo new 创建项目。',
        question: '排列代码行，创建项目结构：',
        shuffledLines: [
          'src/',
          '├── main.rs',
          '├── lib.rs',
          '└── modules/',
          'my_project/',
          'Cargo.toml',
        ],
        solution: ['my_project/', 'Cargo.toml', 'src/', '├── main.rs', '├── lib.rs', '└── modules/'],
        explanation: 'Cargo 项目标准结构。',
      },
      {
        id: 'w23-l02',
        title: '错误处理模式',
        type: 'fill',
        lesson: '大型项目通常定义自己的错误类型，用 Result<T, E> 传播错误。',
        hint: 'thiserror crate 简化错误定义。',
        question: '补全代码，定义错误类型',
        code: '#[derive(Debug)]\nenum AppError {\n    IoError(std::io::Error),\n    ParseError(String),\n}',
        blanks: ['AppError', 'Error', 'MyError', 'CustomError'],
        blanksCount: 1,
        solution: 'AppError',
        explanation: '自定义错误类型包含各种错误变体。',
      },
      {
        id: 'w23-l03',
        title: 'CLI 参数',
        type: 'judge',
        lesson: 'clap crate 是 Rust 最流行的 CLI 参数解析库。',
        hint: 'clap 提供 derive API。',
        question: 'clap 是 Rust 标准库的一部分吗？',
        code: '// clap 是第三方 crate，不是标准库',
        judgeAnswer: false,
        solution: 'false',
        explanation: 'clap 是第三方 crate，需要添加依赖。',
      },
      {
        id: 'w23-l04',
        title: '文件操作',
        type: 'fill',
        lesson: 'std::fs 提供文件操作。读取用 read_to_string，写入用 write。',
        hint: 'fs 模块在标准库中。',
        question: '补全代码，读取文件',
        code: 'use std::fs;\n\nlet content = fs::read_to_string("data.txt")?;',
        blanks: ['fs::read_to_string', 'fs::read', 'File::read', 'io::read'],
        blanksCount: 1,
        solution: 'fs::read_to_string',
        explanation: 'fs::read_to_string 读取整个文件为字符串。',
      },
      {
        id: 'w23-l05',
        title: '序列化',
        type: 'choice',
        lesson: 'serde 是 Rust 最流行的序列化框架。serde_json 处理 JSON。',
        hint: 'serde 支持多种格式。',
        question: 'serde 的主要作用是什么？',
        options: [
          { id: 'a', text: '数据序列化和反序列化', isCorrect: true },
          { id: 'b', text: '网络请求', isCorrect: false },
          { id: 'c', text: '数据库操作', isCorrect: false },
          { id: 'd', text: '日志记录', isCorrect: false },
        ],
        solution: 'a',
        explanation: 'serde 用于序列化（结构体→JSON）和反序列化（JSON→结构体）。',
      },
      {
        id: 'w23-l06',
        title: '完整程序',
        type: 'order',
        lesson: '一个完整的 Rust 程序包含：错误处理、CLI 解析、核心逻辑、输出格式化。',
        hint: 'main 函数通常调用 run 函数。',
        question: '排列代码行，创建完整程序：',
        shuffledLines: [
          'fn main() {',
          '    if let Err(e) = run() {',
          '        eprintln!("Error: {}", e);',
          '        std::process::exit(1);',
          '    }',
          '}',
        ],
        solution: ['fn main() {', '    if let Err(e) = run() {', '        eprintln!("Error: {}", e);', '        std::process::exit(1);', '    }', '}'],
        explanation: 'main 调用 run，处理错误。',
      },
    ],
    boss: {
      title: '最终挑战',
      description: '构建一个完整的 CLI 工具：\n1. 解析命令行参数\n2. 读取文件\n3. 处理数据\n4. 输出结果\n5. 正确的错误处理',
      template: `use std::fs;

#[derive(Debug)]
enum AppError {
    IoError(std::io::Error),
    ParseError(String),
}

impl From<std::io::Error> for AppError {
    fn from(e: std::io::Error) -> Self {
        AppError::IoError(e)
    }
}

fn run() -> Result<(), AppError> {
    let content = fs::read_to_string("data.txt")
        .unwrap_or_else(|_| String::from("No file found"));
    
    let lines: Vec<&str> = content.lines().collect();
    println!("Lines: {}", lines.len());
    
    for (i, line) in lines.iter().enumerate() {
        println!("{}: {}", i + 1, line);
    }
    
    Ok(())
}

fn main() {
    if let Err(e) = run() {
        eprintln!("Error: {:?}", e);
        std::process::exit(1);
    }
}`,
      validation: {
        required: ['enum AppError', 'fn run', 'fn main', 'Result', 'println!'],
        forbidden: [],
        testCases: [
          { input: '', expected: 'Lines: 0\n', description: 'CLI 工具' },
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
