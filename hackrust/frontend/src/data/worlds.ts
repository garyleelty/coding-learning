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
        lesson: '你可以把程序想成一张”步骤清单”。我们写代码，就是把步骤清楚地告诉计算机。',
        hint: '关键词是”告诉计算机做什么”。',
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
        title: '第一个程序',
        type: 'code',
        lesson: 'println! 可以把文字显示到屏幕上。文字需要放在英文双引号里。每个 Rust 程序都从 fn main() 开始。',
        question: '写一个程序，输出 “Hello, Hacker!”',
        codeTask: '在 main 函数中，用 println! 输出 “Hello, Hacker!”',
        codeTemplate: 'fn main() {\n    // 在这里写你的代码\n}',
        exampleCode: 'fn main() {\n    println!(“Hello, Rust!”);\n}',
        exampleOutput: 'Hello, Rust!',
        codeTestCases: [
          { input: '', expected: 'Hello, Hacker!', description: '输出 Hello, Hacker!' },
        ],
        codeHints: [
          'println! 的用法：println!(“你要输出的文字”);',
          'println!(“Hello, Hacker!”);',
        ],
        solution: 'Hello, Hacker!',
        explanation: 'println! 是 Rust 的输出宏，用英文双引号包围要输出的文字。',
      },
      {
        id: 'w00-l03',
        title: '输出多行',
        type: 'code',
        lesson: '每写一个 println! 就会输出一行。多个 println! 会按顺序输出多行。',
        question: '写一个程序，输出两行文字',
        codeTask: '输出两行：\n第一行: “System online”\n第二行: “Ready to hack”',
        codeTemplate: 'fn main() {\n    // 写两个 println!\n}',
        exampleCode: 'fn main() {\n    println!(“Line 1”);\n    println!(“Line 2”);\n    println!(“Line 3”);\n}',
        exampleOutput: 'Line 1\nLine 2\nLine 3',
        codeTestCases: [
          { input: '', expected: 'System online\nReady to hack', description: '输出两行' },
        ],
        codeHints: [
          '每行一个 println!(“...”);',
          'println!(“System online”);\nprintln!(“Ready to hack”);',
        ],
        solution: 'System online\nReady to hack',
        explanation: '每个 println! 输出一行，多个 println! 按顺序输出多行。',
      },
      {
        id: 'w00-l04',
        title: '用变量存储数据',
        type: 'code',
        lesson: 'let x = 5; 创建一个叫 x 的变量，值为 5。println!(“{}”, x) 中的 {} 会被 x 的值替换。',
        question: '创建变量并输出它的值',
        codeTask: '1. 用 let 创建变量 x，值为 42\n2. 用 println!(“{}”, x) 输出 x 的值',
        codeTemplate: 'fn main() {\n    // 创建变量 x\n    \n    // 输出 x\n}',
        exampleCode: 'fn main() {\n    let x = 5;\n    println!(“x = {}”, x);\n}',
        exampleOutput: 'x = 5',
        codeTestCases: [
          { input: '', expected: '42', description: '输出变量的值' },
        ],
        codeHints: [
          'let x = 5; 创建变量，println!(“{}”, x); 输出变量',
          'let x = 42;\nprintln!(“{}”, x);',
        ],
        solution: '42',
        explanation: 'let 声明变量，{} 是 println! 的占位符，会被后面的变量值替换。',
      },
      {
        id: 'w00-l05',
        title: '运行一个完整程序',
        type: 'code',
        lesson: 'let 可以用来创建变量并计算。let result = 10 + 32; 会把 42 存入 result。',
        question: '写一个完整的程序：计算并输出',
        codeTask: '1. 创建变量 a = 10, b = 32\n2. 创建变量 result = a + b\n3. 输出 “Result: 42”',
        codeTemplate: 'fn main() {\n    // TODO: 创建变量 a 和 b\n    // TODO: 计算 a + b 存入 result\n    // TODO: 输出 “Result: 42”\n}',
        codeTestCases: [
          { input: '', expected: 'Result: 42', description: '计算并输出' },
        ],
        codeHints: [
          'let a = 10; let b = 32; let result = a + b;',
          'println!(“Result: {}”, result); — 用 {} 做占位符',
          'let a = 10;\nlet b = 32;\nlet result = a + b;\nprintln!(“Result: {}”, result);',
        ],
        solution: 'Result: 42',
        explanation: 'let 可以创建变量并计算，println! 中 {} 会被变量值替换。',
      },
    ],
    boss: {
      title: '第一次输出任务',
      description: '在 main 函数中输出三行文字，完成你的第一个 Rust 程序。',
      template: `fn main() {\n    // TODO: 输出以下三行文字（每行一个 println!）\n    // 第一行: "Hello, Rust!"\n    // 第二行: "I can write code."\n    // 第三行: "Learning step by step."\n}`,
      steps: [
        '用 println!("文字") 输出第一行',
        '用同样的方式输出第二行和第三行',
        '运行代码，确认输出三行文字',
      ],
      hints: [
        'println! 是 Rust 的输出宏，用法：println!("你要输出的文字");',
        '每一行写一个 println!("..."); 注意文字用英文双引号包围',
        'println!("Hello, Rust!");\nprintln!("I can write code.");\nprintln!("Learning step by step.");',
      ],
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
        title: '可变变量',
        type: 'code',
        lesson: 'Rust 默认变量不能改。加 mut 关键字可以让变量可变，之后可以用 = 修改它的值。',
        question: '创建一个可变变量并修改它',
        codeTask: '1. 用 let mut 创建变量 x = 10\n2. 用 x = 20 修改它\n3. 输出 x 的值（应为 20）',
        codeTemplate: 'fn main() {\n    // 创建可变变量 x\n    \n    // 修改 x\n    \n    // 输出 x\n}',
        exampleCode: 'fn main() {\n    let mut x = 10;\n    println!("before: {}", x);\n    x = 20;\n    println!("after: {}", x);\n}',
        exampleOutput: 'before: 10\nafter: 20',
        codeTestCases: [
          { input: '', expected: '20', description: '输出修改后的值' },
        ],
        codeHints: [
          'let mut x = 10; — mut 让变量可变',
          'x = 20; 修改变量，println!(“{}”, x); 输出',
          'let mut x = 10;\nx = 20;\nprintln!(“{}”, x);',
        ],
        solution: '20',
        explanation: 'let mut 声明可变变量，之后可以用 = 修改值。',
      },
      {
        id: 'w01-l03',
        title: '变量计算',
        type: 'code',
        lesson: '变量可以参与计算。let sum = a + b; 把 a 和 b 的和存入 sum。',
        question: '用变量完成计算',
        codeTask: '1. 创建 hp = 100, damage = 25\n2. 计算 remaining = hp - damage\n3. 输出 “Remaining: 75”',
        codeTemplate: 'fn main() {\n    let hp = 100;\n    let damage = 25;\n    // 计算 remaining\n    \n    // 输出\n}',
        codeTestCases: [
          { input: '', expected: 'Remaining: 75', description: '计算并输出' },
        ],
        codeHints: [
          'let remaining = hp - damage; — 用 let 存储计算结果',
          'println!(“Remaining: {}”, remaining);',
          'let remaining = hp - damage;\nprintln!(“Remaining: {}”, remaining);',
        ],
        solution: 'Remaining: 75',
        explanation: 'let 可以创建变量并计算，变量名可以是任意合法标识符。',
      },
      {
        id: 'w01-l04',
        title: 'Shadowing',
        type: 'code',
        lesson: 'Rust 允许再次使用 let 创建同名变量。新变量会”遮住”旧变量，这叫 shadowing。',
        question: '用 shadowing 修改变量的值',
        codeTask: '1. 创建 x = 5\n2. 用 let x = x + 10 重新声明 x\n3. 输出 x（应为 15）',
        codeTemplate: 'fn main() {\n    let x = 5;\n    // 用 shadowing 把 x 改成 15\n    \n    // 输出 x\n}',
        codeTestCases: [
          { input: '', expected: '15', description: '输出 shadowing 后的值' },
        ],
        codeHints: [
          'let x = x + 10; — 用 let 重新声明同名变量',
          'println!(“{}”, x);',
          'let x = x + 10;\nprintln!(“{}”, x);',
        ],
        solution: '15',
        explanation: 'Shadowing 允许重新声明同名变量，新变量覆盖旧变量。',
      },
      {
        id: 'w01-l05',
        title: '元组',
        type: 'code',
        lesson: '元组可以把几个值放在一起，用圆括号定义。访问元组元素时用 .0 .1 .2。',
        question: '创建元组并访问元素',
        codeTask: '1. 创建元组 point = (10, 20)\n2. 用 point.0 和 point.1 访问元素\n3. 输出 “x: 10, y: 20”',
        codeTemplate: 'fn main() {\n    let point = (10, 20);\n    // 访问 point.0 和 point.1\n    \n}',
        codeTestCases: [
          { input: '', expected: 'x: 10, y: 20', description: '输出元组元素' },
        ],
        codeHints: [
          'point.0 是第一个元素，point.1 是第二个',
          'println!(“x: {}, y: {}”, point.0, point.1);',
        ],
        solution: 'x: 10, y: 20',
        explanation: '元组用 .0 .1 .2 访问元素，索引从 0 开始。',
      },
      {
        id: 'w01-l06',
        title: '数组',
        type: 'code',
        lesson: '数组是一组同类数据，用方括号定义。用 arr[0] 访问第一个元素。',
        question: '创建数组并访问元素',
        codeTask: '1. 创建数组 arr = [10, 20, 30]\n2. 输出第一个元素 arr[0]（应为 10）',
        codeTemplate: 'fn main() {\n    // 创建数组\n    \n    // 输出第一个元素\n}',
        codeTestCases: [
          { input: '', expected: '10', description: '输出数组第一个元素' },
        ],
        codeHints: [
          'let arr = [10, 20, 30]; — 方括号定义数组',
          'println!(“{}”, arr[0]); — 索引从 0 开始',
          'let arr = [10, 20, 30];\nprintln!(“{}”, arr[0]);',
        ],
        solution: '10',
        explanation: '数组用方括号定义，用索引访问元素，索引从 0 开始。',
      },
    ],
    boss: {
      title: '变量练习任务',
      description: '用变量完成一次 HP 计算：创建变量存储生命值和伤害，计算剩余血量并输出。',
      template: `fn main() {\n    // TODO: 创建 hp 变量，值为 100\n    \n    // TODO: 创建 damage 变量，值为 25\n    \n    // TODO: 创建 remaining 变量，值为 hp - damage\n    \n    // TODO: 输出 "Remaining HP: 75"（用 println! 和 {} 占位符）\n    \n}`,
      steps: [
        '用 let 声明 hp = 100 和 damage = 25',
        '用 let 声明 remaining = hp - damage',
        '用 println!("Remaining HP: {}", remaining) 输出结果',
      ],
      hints: [
        'let 关键字声明变量：let 变量名 = 值;',
        'println! 中 {} 是占位符，后面的变量会替换它',
        'let hp = 100;\nlet damage = 25;\nlet remaining = hp - damage;\nprintln!("Remaining HP: {}", remaining);',
      ],
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
        type: 'code',
        lesson: 'Rust 支持 +、-、*、/、%（取余）五种算术运算。整数相除会丢弃小数部分（10 / 3 = 3）。',
        question: '用算术运算符完成计算',
        codeTask: '计算以下三个值并输出：\n1. 10 + 3 = ?\n2. 10 - 3 = ?\n3. 10 * 3 = ?\n输出格式: "13, 7, 30"',
        codeTemplate: 'fn main() {\n    let a = 10 + 3;\n    let b = 10 - 3;\n    let c = 10 * 3;\n    // 输出: "13, 7, 30"\n}',
        exampleCode: 'fn main() {\n    let sum = 10 + 3;\n    let diff = 10 - 3;\n    let product = 10 * 3;\n    println!("sum={}, diff={}, product={}", sum, diff, product);\n}',
        exampleOutput: 'sum=13, diff=7, product=30',
        codeTestCases: [{ input: '', expected: '13, 7, 30', description: '三个算术结果' }],
        codeHints: ['println!("{}, {}, {}", a, b, c); — 用多个 {} 占位符'],
        solution: '13, 7, 30',
        explanation: '+ 加、- 减、* 乘，整数运算结果还是整数。',
      },
      {
        id: 'w02-l02',
        title: '除法和取余',
        type: 'code',
        lesson: '/ 是除法（整数相除取整），% 是取余。10 / 3 = 3，10 % 3 = 1。',
        question: '计算商和余数',
        codeTask: '计算 100 / 7 的商和 100 % 7 的余数\n输出: "Quotient: 14, Remainder: 2"',
        codeTemplate: 'fn main() {\n    let quotient = 100 / 7;\n    let remainder = 100 % 7;\n    // 输出\n}',
        codeTestCases: [{ input: '', expected: 'Quotient: 14, Remainder: 2', description: '商和余数' }],
        codeHints: ['println!("Quotient: {}, Remainder: {}", quotient, remainder);'],
        solution: 'Quotient: 14, Remainder: 2',
        explanation: '/ 取整数商，% 取余数。',
      },
      {
        id: 'w02-l03',
        title: '比较运算',
        type: 'code',
        lesson: '比较运算符（==、!=、<、>、<=、>=）返回布尔值 true 或 false。',
        question: '用比较运算符判断大小',
        codeTask: '判断 100 是否大于 50，结果存入变量 is_greater\n输出: "100 > 50: true"',
        codeTemplate: 'fn main() {\n    // 用 > 比较\n    \n}',
        codeTestCases: [{ input: '', expected: '100 > 50: true', description: '比较结果' }],
        codeHints: ['let is_greater = 100 > 50; — 比较返回 bool', 'println!("100 > 50: {}", is_greater);'],
        solution: '100 > 50: true',
        explanation: '比较运算符返回布尔值，> 判断左边是否大于右边。',
      },
      {
        id: 'w02-l04',
        title: '布尔逻辑',
        type: 'code',
        lesson: '&&（与）两个都为真才为真，||（或）一个为真就为真，!（非）取反。',
        question: '用布尔运算符组合条件',
        codeTask: '计算 (true && false) 和 (true || false) 的结果\n输出两行:\n"AND: false"\n"OR: true"',
        codeTemplate: 'fn main() {\n    let a = true;\n    let b = false;\n    // 计算 a && b 和 a || b\n    \n}',
        codeTestCases: [{ input: '', expected: 'AND: false\nOR: true', description: '布尔运算结果' }],
        codeHints: ['let and_result = a && b; let or_result = a || b;', 'println!("AND: {}", and_result);'],
        solution: 'AND: false\nOR: true',
        explanation: '&& 要求两边都为真，|| 只要一边为真。',
      },
      {
        id: 'w02-l05',
        title: '复合赋值',
        type: 'code',
        lesson: '+=、-=、*=、/= 是复合赋值运算符。x += 1 等价于 x = x + 1。',
        question: '用复合赋值修改变量',
        codeTask: '1. 创建 x = 100\n2. x -= 25（减去 25）\n3. x /= 3（除以 3）\n4. 输出 x（应为 25）',
        codeTemplate: 'fn main() {\n    let mut x = 100;\n    // 用 -= 和 /= 修改 x\n    \n    println!("{}", x);\n}',
        codeTestCases: [{ input: '', expected: '25', description: '复合赋值结果' }],
        codeHints: ['x -= 25; 然后 x /= 3;', 'let mut x = 100;\nx -= 25;\nx /= 3;\nprintln!("{}", x);'],
        solution: '25',
        explanation: '+= -= *= /= 是简写的赋值运算符。',
      },
      {
        id: 'w02-l06',
        title: '类型转换',
        type: 'code',
        lesson: 'as 关键字可以进行类型转换。let y = x as f64; 把整数转成浮点数。',
        question: '用 as 转换类型',
        codeTask: '1. 创建整数 x: i32 = 10\n2. 创建整数 y: i32 = 3\n3. 用 as f64 转换后做浮点除法\n4. 输出 "Result: 3.3333333333333335"',
        codeTemplate: 'fn main() {\n    let x: i32 = 10;\n    let y: i32 = 3;\n    // 转为 f64 后相除\n    \n}',
        codeTestCases: [{ input: '', expected: 'Result: 3.3333333333333335', description: '浮点除法' }],
        codeHints: ['let result = x as f64 / y as f64;', 'println!("Result: {}", result);'],
        solution: 'Result: 3.3333333333333335',
        explanation: 'as 做类型转换，整数转浮点才能得到小数结果。',
      },
      {
        id: 'w02-l07',
        title: '多运算符组合',
        type: 'code',
        lesson: '运算符可以组合使用。先乘除后加减，括号改变优先级。',
        question: '组合多种运算',
        codeTask: '计算并输出以下表达式的结果：\n(10 + 5) * 2 = 30\n10 + 5 * 2 = 20\n输出两行',
        codeTemplate: 'fn main() {\n    // 用括号控制运算顺序\n    \n}',
        codeTestCases: [{ input: '', expected: '30\n20', description: '运算优先级' }],
        codeHints: ['括号改变优先级：(10 + 5) * 2 = 30，没有括号先算乘法', 'println!("{}", (10 + 5) * 2);'],
        solution: '30\n20',
        explanation: '括号改变运算优先级，先乘除后加减。',
      },
      {
        id: 'w02-l08',
        title: '综合练习',
        type: 'code',
        lesson: '把学过的运算符综合运用。',
        question: '完成一个完整的计算程序',
        codeTask: '计算圆的面积：radius = 5\n公式: PI * radius * radius\n输出 "Area: 78.53981633974483"\n提示: PI 可以用 3.141592653589793',
        codeTemplate: 'fn main() {\n    let radius = 5.0;\n    let pi = 3.141592653589793;\n    // 计算面积\n    \n}',
        codeTestCases: [{ input: '', expected: 'Area: 78.53981633974483', description: '圆面积' }],
        codeHints: ['let area = pi * radius * radius;', 'println!("Area: {}", area);'],
        solution: 'Area: 78.53981633974483',
        explanation: '浮点数运算用 f64 类型，精度更高。',
      },
    ],
    boss: {
      title: '运算符练习任务',
      description: '完成三个计算任务：求商、求余、比较大小，然后输出结果。',
      template: `fn main() {\n    // TODO: 用 / 计算 100 / 7 的商，存入 quotient\n    \n    // TODO: 用 % 计算 100 % 7 的余数，存入 remainder\n    \n    // TODO: 用 > 判断 100 是否大于 50，存入 is_greater\n    \n    // TODO: 输出三行结果\n    // println!("Quotient: {}", quotient);\n    // println!("Remainder: {}", remainder);\n    // println!("Is greater: {}", is_greater);\n}`,
      steps: [
        '用 / 运算符计算 100 除以 7 的商',
        '用 % 运算符计算 100 除以 7 的余数',
        '用 > 运算符判断 100 是否大于 50',
        '用 println! 输出三个结果',
      ],
      hints: [
        '/ 是除法（取整），% 是取余，> 是比较（返回 true/false）',
        'let quotient = 100 / 7;  — 用 let 存储计算结果',
        'let quotient = 100 / 7;\nlet remainder = 100 % 7;\nlet is_greater = 100 > 50;\nprintln!("Quotient: {}", quotient);\nprintln!("Remainder: {}", remainder);\nprintln!("Is greater: {}", is_greater);',
      ],
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
        title: 'if 条件判断',
        type: 'code',
        lesson: 'if 用来做条件判断。条件为 true 时执行花括号里的代码。',
        question: '用 if 判断一个数',
        codeTask: '1. 创建 x = 10\n2. 用 if 判断：如果 x > 5，输出 "big"\n3. 用 else 输出 "small"',
        codeTemplate: 'fn main() {\n    let x = 10;\n    // 在这里写 if-else\n    \n}',
        exampleCode: 'fn main() {\n    let x = 10;\n    if x > 5 {\n        println!("big");\n    } else {\n        println!("small");\n    }\n}',
        exampleOutput: 'big',
        codeTestCases: [{ input: '', expected: 'big', description: '判断大小' }],
        codeHints: ['if x > 5 { println!("big"); } else { println!("small"); }'],
        solution: 'big',
        explanation: 'if 条件为真执行 if 块，否则执行 else 块。',
      },
      {
        id: 'w03-l02',
        title: 'if-else 分支',
        type: 'code',
        lesson: 'if-else 提供两个分支。可以用 % 2 == 0 判断奇偶。',
        question: '判断奇偶数',
        codeTask: '1. 创建 x = 7\n2. 用 if-else 判断 x 是偶数还是奇数\n3. 偶数输出 "even"，奇数输出 "odd"',
        codeTemplate: 'fn main() {\n    let x = 7;\n    // if x % 2 == 0 → even, else → odd\n    \n}',
        codeTestCases: [{ input: '', expected: 'odd', description: '判断奇偶' }],
        codeHints: ['if x % 2 == 0 { println!("even"); } else { println!("odd"); }'],
        solution: 'odd',
        explanation: '% 2 == 0 判断是否为偶数。',
      },
      {
        id: 'w03-l03',
        title: 'else if 多分支',
        type: 'code',
        lesson: '多个条件可以用 else if 链接。从上到下检查，执行第一个为真的分支。',
        question: '用 else if 判断分数等级',
        codeTask: '创建 score = 85\n判断等级：\n>= 90 → "A"\n>= 80 → "B"\n其他 → "C"\n输出 "Grade: B"',
        codeTemplate: 'fn main() {\n    let score = 85;\n    // 用 if / else if / else 判断等级\n    \n}',
        codeTestCases: [{ input: '', expected: 'Grade: B', description: '分数等级' }],
        codeHints: ['if score >= 90 { ... } else if score >= 80 { ... } else { ... }', 'println!("Grade: {}", grade); — 先存入变量再输出'],
        solution: 'Grade: B',
        explanation: 'else if 链从上到下检查，执行第一个为真的分支。',
      },
      {
        id: 'w03-l04',
        title: 'for 循环',
        type: 'code',
        lesson: 'for 循环遍历一个范围。0..5 表示从 0 到 4（不含 5），0..=5 包含 5。',
        question: '用 for 循环遍历数字',
        codeTask: '用 for 循环遍历 1 到 5（包含 5）\n每行输出一个数字\n输出:\n1\n2\n3\n4\n5',
        codeTemplate: 'fn main() {\n    // for i in 1..=5 { println!("{}", i); }\n    \n}',
        exampleCode: 'fn main() {\n    for i in 0..5 {\n        println!("{}", i);\n    }\n}',
        exampleOutput: '0\n1\n2\n3\n4',
        codeTestCases: [{ input: '', expected: '1\n2\n3\n4\n5', description: '遍历 1-5' }],
        codeHints: ['for i in 1..=5 { println!("{}", i); } — ..= 包含结束值'],
        solution: '1\n2\n3\n4\n5',
        explanation: 'for i in 范围 遍历每个值，..= 包含结束值。',
      },
      {
        id: 'w03-l05',
        title: 'while 循环',
        type: 'code',
        lesson: 'while 在条件为真时重复执行。比 loop + if 更简洁。',
        question: '用 while 循环倒计时',
        codeTask: '从 5 倒数到 1，每行输出一个数字\n用 while x > 0 循环\n输出:\n5\n4\n3\n2\n1',
        codeTemplate: 'fn main() {\n    let mut x = 5;\n    // while 循环倒计时\n    \n}',
        codeTestCases: [{ input: '', expected: '5\n4\n3\n2\n1', description: '倒计时' }],
        codeHints: ['while x > 0 { println!("{}", x); x -= 1; }'],
        solution: '5\n4\n3\n2\n1',
        explanation: 'while 条件为真时执行循环体，每次 x 减 1。',
      },
      {
        id: 'w03-l06',
        title: 'break 跳出循环',
        type: 'code',
        lesson: 'break 立即跳出循环。loop 创建无限循环，必须用 break 跳出。',
        question: '用 loop + break 实现循环',
        codeTask: '从 0 开始，每次 +1，当 x == 3 时 break\n输出 x 的最终值\n输出: "3"',
        codeTemplate: 'fn main() {\n    let mut x = 0;\n    // loop { x += 1; if x == 3 { break; } }\n    \n    println!("{}", x);\n}',
        codeTestCases: [{ input: '', expected: '3', description: 'break 跳出' }],
        codeHints: ['loop { x += 1; if x == 3 { break; } }'],
        solution: '3',
        explanation: 'loop 无限循环，break 跳出。',
      },
      {
        id: 'w03-l07',
        title: 'continue 跳过',
        type: 'code',
        lesson: 'continue 跳过本次迭代，进入下一次循环。',
        question: '用 continue 跳过特定值',
        codeTask: '遍历 0 到 4，跳过数字 2\n输出:\n0\n1\n3\n4',
        codeTemplate: 'fn main() {\n    for i in 0..5 {\n        // 如果 i == 2，跳过\n        \n        println!("{}", i);\n    }\n}',
        codeTestCases: [{ input: '', expected: '0\n1\n3\n4', description: '跳过 2' }],
        codeHints: ['if i == 2 { continue; } — continue 跳过本次迭代'],
        solution: '0\n1\n3\n4',
        explanation: 'continue 跳过当前迭代，继续下一次。',
      },
      {
        id: 'w03-l08',
        title: 'match 匹配',
        type: 'code',
        lesson: 'match 类似 switch，匹配值并执行对应分支。_ 是通配符，匹配剩余情况。',
        question: '用 match 匹配值',
        codeTask: '创建 x = 2\n用 match 匹配：\n1 → "one"\n2 → "two"\n_ → "other"\n输出: "two"',
        codeTemplate: 'fn main() {\n    let x = 2;\n    // match x { 1 => ..., 2 => ..., _ => ... }\n    \n}',
        codeTestCases: [{ input: '', expected: 'two', description: 'match 匹配' }],
        codeHints: ['match x { 1 => println!("one"), 2 => println!("two"), _ => println!("other") }'],
        solution: 'two',
        explanation: 'match 匹配值，_ 匹配所有其他情况。',
      },
    ],
    boss: {
      title: '流程控制挑战',
      description: '用 for 循环遍历 1 到 10，用 if-else 判断每个数字是奇数还是偶数并输出。',
      template: `fn main() {\n    // TODO: 用 for 循环遍历 1 到 10\n    // for i in 1..=10 {\n    //     TODO: 用 if-else 判断奇偶\n    //     偶数输出 "Even: X"\n    //     奇数输出 "Odd: X"\n    // }\n}`,
      steps: [
        '写 for i in 1..=10 { } 循环',
        '在循环内用 if i % 2 == 0 判断偶数',
        '偶数用 println!("Even: {}", i) 输出',
        'else 分支用 println!("Odd: {}", i) 输出奇数',
      ],
      hints: [
        'for i in 1..=10 遍历 1 到 10（包含 10）',
        'if i % 2 == 0 { 偶数 } else { 奇数 }',
        'for i in 1..=10 {\n    if i % 2 == 0 {\n        println!("Even: {}", i);\n    } else {\n        println!("Odd: {}", i);\n    }\n}',
      ],
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
        title: '创建 Vec',
        type: 'code',
        lesson: 'Vec 是动态数组，用 vec! 宏创建。push() 添加元素，len() 获取长度。',
        question: '创建 Vec 并添加元素',
        codeTask: '1. 用 vec![10, 20] 创建 Vec\n2. 用 push(30) 添加一个元素\n3. 输出长度 "Length: 3"',
        codeTemplate: 'fn main() {\n    let mut v = vec![10, 20];\n    // 添加元素\n    \n    // 输出长度\n}',
        codeTestCases: [{ input: '', expected: 'Length: 3', description: 'Vec 长度' }],
        codeHints: ['v.push(30); 然后 println!("Length: {}", v.len());'],
        solution: 'Length: 3',
        explanation: 'vec! 创建 Vec，push 添加元素，len 获取长度。',
      },
      {
        id: 'w04-l02',
        title: '遍历 Vec',
        type: 'code',
        lesson: 'for 循环可以遍历 Vec。for item in &v 借用每个元素。',
        question: '遍历并求和',
        codeTask: '1. 创建 vec![1, 2, 3, 4, 5]\n2. 用 for 循环求和\n3. 输出 "Sum: 15"',
        codeTemplate: 'fn main() {\n    let v = vec![1, 2, 3, 4, 5];\n    let mut sum = 0;\n    // for num in &v { sum += num; }\n    \n    println!("Sum: {}", sum);\n}',
        codeTestCases: [{ input: '', expected: 'Sum: 15', description: '求和' }],
        codeHints: ['for num in &v { sum += num; }'],
        solution: 'Sum: 15',
        explanation: 'for num in &v 遍历 Vec 的每个元素。',
      },
      {
        id: 'w04-l03',
        title: 'HashMap',
        type: 'code',
        lesson: 'HashMap 存储键值对。用 HashMap::new() 创建，insert() 添加。',
        question: '创建和使用 HashMap',
        codeTask: '1. 创建 HashMap\n2. 插入 "score" -> 100\n3. 输出 "Score: 100"',
        codeTemplate: 'use std::collections::HashMap;\n\nfn main() {\n    let mut data = HashMap::new();\n    // 插入键值对\n    \n    // 输出\n}',
        codeTestCases: [{ input: '', expected: 'Score: 100', description: 'HashMap' }],
        codeHints: ['data.insert("score", 100); 然后 data["score"] 访问值', 'println!("Score: {}", data["score"]);'],
        solution: 'Score: 100',
        explanation: 'HashMap::new() 创建映射，insert 添加键值对，[] 访问值。',
      },
      {
        id: 'w04-l04',
        title: 'String 操作',
        type: 'code',
        lesson: 'String 用 String::from() 创建，push_str() 追加内容。',
        question: '创建和拼接字符串',
        codeTask: '1. 创建 String::from("Hello")\n2. 用 push_str(", world!") 追加\n3. 输出 "Hello, world!"',
        codeTemplate: 'fn main() {\n    let mut s = String::from("Hello");\n    // 追加内容\n    \n    println!("{}", s);\n}',
        codeTestCases: [{ input: '', expected: 'Hello, world!', description: '字符串拼接' }],
        codeHints: ['s.push_str(", world!");'],
        solution: 'Hello, world!',
        explanation: 'String::from 创建字符串，push_str 追加内容。',
      },
      {
        id: 'w04-l05',
        title: 'format! 宏',
        type: 'code',
        lesson: 'format! 宏类似 println!，但返回 String 而不是输出。',
        question: '用 format! 拼接字符串',
        codeTask: '1. 创建 name = "Alice", age = 25\n2. 用 format! 创建 "Alice is 25 years old"\n3. 输出该字符串',
        codeTemplate: 'fn main() {\n    let name = "Alice";\n    let age = 25;\n    // let info = format!(...);\n    \n}',
        codeTestCases: [{ input: '', expected: 'Alice is 25 years old', description: 'format!' }],
        codeHints: ['let info = format!("{} is {} years old", name, age);', 'println!("{}", info);'],
        solution: 'Alice is 25 years old',
        explanation: 'format! 用法和 println! 一样，但返回 String。',
      },
      {
        id: 'w04-l06',
        title: '元组和结构',
        type: 'code',
        lesson: '元组用 () 创建，用 .0 .1 访问元素。可以包含不同类型。',
        question: '使用元组存储数据',
        codeTask: '1. 创建元组 player = ("Alice", 100, true)\n2. 输出 name: Alice, hp: 100\n用 player.0 和 player.1',
        codeTemplate: 'fn main() {\n    let player = ("Alice", 100, true);\n    // 输出 name 和 hp\n    \n}',
        codeTestCases: [{ input: '', expected: 'name: Alice, hp: 100', description: '元组访问' }],
        codeHints: ['println!("name: {}, hp: {}", player.0, player.1);'],
        solution: 'name: Alice, hp: 100',
        explanation: '元组用 .0 .1 .2 访问元素。',
      },
      {
        id: 'w04-l07',
        title: '综合练习',
        type: 'code',
        lesson: '把集合类型综合运用。',
        question: '完成数据统计',
        codeTask: '1. 创建 Vec 存储 [85, 92, 78, 95, 88]\n2. 求平均分\n3. 输出 "Average: 87"',
        codeTemplate: 'fn main() {\n    let scores = vec![85, 92, 78, 95, 88];\n    let mut sum = 0;\n    // 求和\n    \n    // 计算平均分（整数除法）\n    let avg = sum / scores.len() as i32;\n    println!("Average: {}", avg);\n}',
        codeTestCases: [{ input: '', expected: 'Average: 87', description: '平均分' }],
        codeHints: ['for s in &scores { sum += s; }', 'sum / scores.len() as i32 — len() 返回 usize，需要 as i32 转换'],
        solution: 'Average: 87',
        explanation: '综合使用 Vec、for 循环和类型转换。',
      },
      {
        id: 'w04-l08',
        title: 'Vec 与迭代',
        type: 'code',
        lesson: 'Vec 可以用 iter() 创建迭代器，配合 sum() 直接求和。',
        question: '用迭代器求和',
        codeTask: '1. 创建 vec![10, 20, 30, 40]\n2. 用 iter().sum() 求和\n3. 输出 "Total: 100"',
        codeTemplate: 'fn main() {\n    let v = vec![10, 20, 30, 40];\n    // let total: i32 = v.iter().sum();\n    \n}',
        codeTestCases: [{ input: '', expected: 'Total: 100', description: '迭代器求和' }],
        codeHints: ['let total: i32 = v.iter().sum(); — 需要标注类型', 'println!("Total: {}", total);'],
        solution: 'Total: 100',
        explanation: 'iter().sum() 是迭代器的便捷求和方法。',
      },
    ],
    boss: {
      title: '集合类型挑战',
      description: '用 Vec 和 HashMap 完成数据统计：创建数字列表，求和，存入 HashMap 并输出。',
      template: `use std::collections::HashMap;

fn main() {
    // TODO: 创建 Vec，包含数字 1, 2, 3, 4, 5
    let numbers = vec![]; // ← 补全

    // TODO: 用 for 循环计算 numbers 的总和
    let mut sum = 0;
    // for num in &numbers { ... }

    // TODO: 创建 HashMap，插入 "sum" -> sum
    let mut data = HashMap::new();
    // data.insert(..., ...);

    // 输出结果
    println!("Sum: {}", data["sum"]);
}`,
      steps: [
        '在 vec![] 中填入 [1, 2, 3, 4, 5]',
        '写 for 循环遍历 &numbers，累加到 sum',
        '用 data.insert("sum", sum) 插入数据',
        '确认输出 "Sum: 15"',
      ],
      hints: [
        'vec![1, 2, 3, 4, 5] 创建包含这些数字的 Vec',
        'for num in &numbers { sum += num; } — 用 += 累加',
        'let numbers = vec![1, 2, 3, 4, 5];\nlet mut sum = 0;\nfor num in &numbers {\n    sum += num;\n}\nlet mut data = HashMap::new();\ndata.insert("sum", sum);\nprintln!("Sum: {}", data["sum"]);',
      ],
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
        title: '定义函数',
        type: 'code',
        lesson: '用 fn 定义函数。参数用 name: type 的形式，-> 指定返回类型。',
        question: '定义一个加法函数',
        codeTask: '1. 定义函数 add(a: i32, b: i32) -> i32，返回 a + b\n2. 在 main 中调用 add(3, 7) 并输出 "10"',
        codeTemplate: '// 在这里定义 add 函数\n\nfn main() {\n    // 调用 add 并输出\n}',
        codeTestCases: [{ input: '', expected: '10', description: '加法函数' }],
        codeHints: ['fn add(a: i32, b: i32) -> i32 { a + b }', 'println!("{}", add(3, 7));'],
        solution: '10',
        explanation: 'fn 定义函数，最后一个表达式（无分号）是返回值。',
      },
      {
        id: 'w05-l02',
        title: '函数参数和返回值',
        type: 'code',
        lesson: '函数可以有多个参数，每个都需要类型标注。-> 指定返回类型。',
        question: '写一个计算矩形面积的函数',
        codeTask: '1. 定义 area(w: i32, h: i32) -> i32\n2. 返回 w * h\n3. 调用 area(10, 5) 输出 "Area: 50"',
        codeTemplate: '// 定义 area 函数\n\nfn main() {\n    println!("Area: {}", area(10, 5));\n}',
        codeTestCases: [{ input: '', expected: 'Area: 50', description: '面积函数' }],
        codeHints: ['fn area(w: i32, h: i32) -> i32 { w * h }'],
        solution: 'Area: 50',
        explanation: '函数用 fn 定义，参数和返回值都需要类型标注。',
      },
      {
        id: 'w05-l03',
        title: '条件返回',
        type: 'code',
        lesson: '函数可以用 return 提前返回，或用 if-else 作为表达式返回。',
        question: '写一个判断正负的函数',
        codeTask: '1. 定义 sign(x: i32) -> &str\n2. x > 0 返回 "positive"\n3. x < 0 返回 "negative"\n4. 其他返回 "zero"\n5. 输出 sign(-5) → "negative"',
        codeTemplate: '// 定义 sign 函数\n\nfn main() {\n    println!("{}", sign(-5));\n}',
        codeTestCases: [{ input: '', expected: 'negative', description: '判断正负' }],
        codeHints: ['fn sign(x: i32) -> &str { if x > 0 { "positive" } else if x < 0 { "negative" } else { "zero" } }'],
        solution: 'negative',
        explanation: 'if-else 可以作为表达式，每个分支的值就是返回值。',
      },
      {
        id: 'w05-l04',
        title: '函数调用函数',
        type: 'code',
        lesson: '函数可以调用其他函数。这是代码复用的基础。',
        question: '组合多个函数',
        codeTask: '1. 定义 double(x: i32) -> i32，返回 x * 2\n2. 定义 triple(x: i32) -> i32，返回 x * 3\n3. 在 main 中输出 double(5) + triple(3) = 19',
        codeTemplate: '// 定义 double 和 triple 函数\n\nfn main() {\n    let result = double(5) + triple(3);\n    println!("{}", result);\n}',
        codeTestCases: [{ input: '', expected: '19', description: '函数组合' }],
        codeHints: ['fn double(x: i32) -> i32 { x * 2 }', 'fn triple(x: i32) -> i32 { x * 3 }'],
        solution: '19',
        explanation: '函数可以互相调用，构建更复杂的逻辑。',
      },
      {
        id: 'w05-l05',
        title: '字符串参数',
        type: 'code',
        lesson: '函数接受字符串用 &str 参数。format! 可以拼接字符串。',
        question: '写一个格式化函数',
        codeTask: '1. 定义 greet(name: &str) -> String\n2. 返回 format!("Hello, {}!", name)\n3. 输出 greet("Hacker")',
        codeTemplate: '// 定义 greet 函数\n\nfn main() {\n    println!("{}", greet("Hacker"));\n}',
        codeTestCases: [{ input: '', expected: 'Hello, Hacker!', description: '格式化函数' }],
        codeHints: ['fn greet(name: &str) -> String { format!("Hello, {}!", name) }'],
        solution: 'Hello, Hacker!',
        explanation: '&str 是字符串切片类型，format! 返回 String。',
      },
      {
        id: 'w05-l06',
        title: '提前返回',
        type: 'code',
        lesson: 'return 关键字可以提前返回值。常用于错误检查。',
        question: '用 return 提前返回',
        codeTask: '1. 定义 safe_divide(a: i32, b: i32) -> i32\n2. 如果 b == 0，return 0\n3. 否则返回 a / b\n4. 输出 safe_divide(10, 3) → "3"',
        codeTemplate: '// 定义 safe_divide 函数\n\nfn main() {\n    println!("{}", safe_divide(10, 3));\n}',
        codeTestCases: [{ input: '', expected: '3', description: '安全除法' }],
        codeHints: ['if b == 0 { return 0; } a / b'],
        solution: '3',
        explanation: 'return 提前返回，避免除以零错误。',
      },
      {
        id: 'w05-l07',
        title: '综合练习',
        type: 'code',
        lesson: '把函数综合运用。',
        question: '完成一个计算程序',
        codeTask: '1. 定义 calc_damage(base: i32, multiplier: f64) -> i32\n2. 计算 base * multiplier，转为 i32\n3. 输出 "Damage: 25"',
        codeTemplate: '// 定义 calc_damage\n// 提示: (base as f64 * multiplier) as i32\n\nfn main() {\n    println!("Damage: {}", calc_damage(10, 2.5));\n}',
        codeTestCases: [{ input: '', expected: 'Damage: 25', description: '伤害计算' }],
        codeHints: ['fn calc_damage(base: i32, multiplier: f64) -> i32 { (base as f64 * multiplier) as i32 }'],
        solution: 'Damage: 25',
        explanation: 'as 做类型转换，i32 和 f64 之间需要显式转换。',
      },
      {
        id: 'w05-l08',
        title: '函数组合',
        type: 'code',
        lesson: '函数是代码抽象的基本单位。把重复逻辑提取成函数。',
        question: '提取重复逻辑为函数',
        codeTask: '1. 定义 max(a: i32, b: i32) -> i32\n2. 返回较大的值\n3. 用 max 函数找出 3 个数中的最大值\n4. 输出 "Max: 30"',
        codeTemplate: '// 定义 max 函数\n\nfn main() {\n    let a = 10;\n    let b = 30;\n    let c = 20;\n    // 用 max 函数找最大值\n    \n}',
        codeTestCases: [{ input: '', expected: 'Max: 30', description: '找最大值' }],
        codeHints: ['fn max(a: i32, b: i32) -> i32 { if a > b { a } else { b } }', 'let m = max(max(a, b), c);'],
        solution: 'Max: 30',
        explanation: '函数可以嵌套调用，构建更复杂的逻辑。',
      },
    ],
    boss: {
      title: '函数挑战',
      description: '定义一个计算伤害的函数，接收基础值和倍率，返回整数结果。',
      template: `// TODO: 定义函数 calculate_damage
// 参数: base: i32, multiplier: f64
// 返回值: i32
// 计算: base * multiplier，转为 i32 返回
// 提示: 用 as f64 和 as i32 做类型转换

fn main() {
    let damage = calculate_damage(10, 2.5);
    println!("Damage: {}", damage);
}`,
      steps: [
        '写 fn calculate_damage(base: i32, multiplier: f64) -> i32',
        '函数体：先用 base as f64 转浮点，乘以 multiplier',
        '结果用 as i32 转回整数并返回',
        'main 中已写好调用代码，确认输出 "Damage: 25"',
      ],
      hints: [
        '函数定义：fn 函数名(参数: 类型) -> 返回类型 { 函数体 }',
        '类型转换用 as：base as f64 把 i32 转成 f64',
        'fn calculate_damage(base: i32, multiplier: f64) -> i32 {\n    (base as f64 * multiplier) as i32\n}',
      ],
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
        title: '所有权移动',
        type: 'code',
        lesson: 'String 赋值会移动所有权，原变量不能再使用。i32 等简单类型会复制。',
        question: '体验所有权移动',
        codeTask: '1. 创建 s1 = String::from("hello")\n2. 把 s1 赋值给 s2（所有权移动）\n3. 输出 s2（不要输出 s1，它已失效）',
        codeTemplate: 'fn main() {\n    let s1 = String::from("hello");\n    // 移动所有权给 s2\n    \n    // 输出 s2\n}',
        codeTestCases: [{ input: '', expected: 'hello', description: '所有权移动' }],
        codeHints: ['let s2 = s1; — 移动后 s1 不能再用', 'println!("{}", s2);'],
        solution: 'hello',
        explanation: 'String 赋值移动所有权，原变量失效。',
      },
      {
        id: 'w06-l02',
        title: '克隆',
        type: 'code',
        lesson: 'clone() 创建深拷贝，两个变量都有效。',
        question: '用克隆保留两个副本',
        codeTask: '1. 创建 s1 = String::from("data")\n2. 克隆 s1 给 s2\n3. 输出两个变量: "s1: data, s2: data"',
        codeTemplate: 'fn main() {\n    let s1 = String::from("data");\n    // 克隆\n    \n    // 输出\n}',
        codeTestCases: [{ input: '', expected: 's1: data, s2: data', description: '克隆' }],
        codeHints: ['let s2 = s1.clone(); — 深拷贝', 'println!("s1: {}, s2: {}", s1, s2);'],
        solution: 's1: data, s2: data',
        explanation: 'clone() 创建深拷贝，两个变量独立。',
      },
      {
        id: 'w06-l03',
        title: 'Copy 类型',
        type: 'code',
        lesson: 'i32 等简单类型实现了 Copy trait，赋值时复制而不是移动。',
        question: '整数的复制行为',
        codeTask: '1. 创建 x = 42\n2. 赋值 y = x\n3. 两个都能用，输出 "x: 42, y: 42"',
        codeTemplate: 'fn main() {\n    let x = 42;\n    let y = x;\n    // i32 是 Copy 类型，两个都能用\n    \n}',
        codeTestCases: [{ input: '', expected: 'x: 42, y: 42', description: 'Copy 类型' }],
        codeHints: ['println!("x: {}, y: {}", x, y); — i32 自动复制'],
        solution: 'x: 42, y: 42',
        explanation: 'i32 实现了 Copy trait，赋值时自动复制。',
      },
      {
        id: 'w06-l04',
        title: '函数与所有权',
        type: 'code',
        lesson: '把值传给函数时，和赋值一样会发生移动或复制。',
        question: '函数获取所有权',
        codeTask: '1. 定义 print_string(s: String) 函数\n2. 创建 String 传给函数\n3. 函数内输出字符串',
        codeTemplate: '// 定义 print_string 函数\n\nfn main() {\n    let msg = String::from("owned!");\n    print_string(msg);\n    // msg 的所有权已转移，不能再用\n}',
        codeTestCases: [{ input: '', expected: 'owned!', description: '函数所有权' }],
        codeHints: ['fn print_string(s: String) { println!("{}", s); }'],
        solution: 'owned!',
        explanation: 'String 传入函数后，所有权转移给函数参数。',
      },
      {
        id: 'w06-l05',
        title: '返回所有权',
        type: 'code',
        lesson: '函数可以通过返回值把所有权转移回调用者。',
        question: '函数返回所有权',
        codeTask: '1. 定义 create_greeting(name: &str) -> String\n2. 返回 format!("Hello, {}!", name)\n3. 输出结果',
        codeTemplate: '// 定义 create_greeting 函数\n\nfn main() {\n    let greeting = create_greeting("Rust");\n    println!("{}", greeting);\n}',
        codeTestCases: [{ input: '', expected: 'Hello, Rust!', description: '返回所有权' }],
        codeHints: ['fn create_greeting(name: &str) -> String { format!("Hello, {}!", name) }'],
        solution: 'Hello, Rust!',
        explanation: '函数返回 String 时，所有权转移给调用者。',
      },
      {
        id: 'w06-l06',
        title: '所有权综合',
        type: 'code',
        lesson: '综合运用所有权、移动和克隆。',
        question: '管理数据所有权',
        codeTask: '1. 创建 s1 = String::from("original")\n2. 移动给 s2\n3. 克隆 s2 给 s3\n4. 输出 "s2: original, s3: original"',
        codeTemplate: 'fn main() {\n    let s1 = String::from("original");\n    // 移动给 s2\n    \n    // 克隆 s2 给 s3\n    \n    // 输出 s2 和 s3\n}',
        codeTestCases: [{ input: '', expected: 's2: original, s3: original', description: '所有权管理' }],
        codeHints: ['let s2 = s1; 然后 let s3 = s2.clone();', 'println!("s2: {}, s3: {}", s2, s3);'],
        solution: 's2: original, s3: original',
        explanation: '移动转移所有权，克隆创建独立副本。',
      },
      {
        id: 'w06-l07',
        title: '函数参数类型',
        type: 'code',
        lesson: '函数参数用 &str 比 String 更灵活，不会获取所有权。',
        question: '用引用避免所有权转移',
        codeTask: '1. 定义 print_twice(s: &str) 函数，输出两次\n2. 创建 String，用 &s 传引用\n3. 传引用后 s 还能用',
        codeTemplate: '// 定义 print_twice 函数\n\nfn main() {\n    let s = String::from("repeat");\n    print_twice(&s);\n    // s 还能用\n    println!("still: {}", s);\n}',
        codeTestCases: [{ input: '', expected: 'repeat\nrepeat\nstill: repeat', description: '引用传参' }],
        codeHints: ['fn print_twice(s: &str) { println!("{}", s); println!("{}", s); }', '&s 传引用，不转移所有权'],
        solution: 'repeat\nrepeat\nstill: repeat',
        explanation: '&str 引用不获取所有权，原变量还能用。',
      },
      {
        id: 'w06-l08',
        title: '所有权实战',
        type: 'code',
        lesson: '综合运用所有权概念。',
        question: '完成数据处理',
        codeTask: '1. 创建 name = String::from("Alice")\n2. 用 greet(&name) 输出 "Hello, Alice!"\n3. 用 name.len() 输出长度 "Length: 5"\n4. name 在 greet 后还能用',
        codeTemplate: 'fn greet(name: &str) {\n    println!("Hello, {}!", name);\n}\n\nfn main() {\n    let name = String::from("Alice");\n    greet(&name);\n    // name 还能用\n    \n}',
        codeTestCases: [{ input: '', expected: 'Hello, Alice!\nLength: 5', description: '所有权实战' }],
        codeHints: ['println!("Length: {}", name.len());'],
        solution: 'Hello, Alice!\nLength: 5',
        explanation: '引用让函数借用数据而不获取所有权。',
      },
    ],
    boss: {
      title: '所有权挑战',
      description: '演示 Rust 的所有权转移和克隆：创建 String，移动给另一个变量，再克隆一份。',
      template: `fn main() {
    // TODO: 创建 String s1，值为 "ownership"
    let s1 = String::from("ownership");

    // TODO: 把 s1 移动给 s2（直接赋值即可）
    let s2 = s1; // 移动后 s1 不能再用

    // TODO: 克隆 s2 给 s3
    let s3 = s2.clone();

    // 输出 s2 和 s3（不要输出 s1，它已经被移动了）
    println!("s2: {}", s2);
    println!("s3: {}", s3);
}`,
      steps: [
        '用 String::from("ownership") 创建 s1',
        '把 s1 赋值给 s2（所有权移动）',
        '用 s2.clone() 克隆给 s3',
        '输出 s2 和 s3',
      ],
      hints: [
        'String 赋值会移动所有权，原变量不能再用',
        '.clone() 创建深拷贝，两个变量都能用',
        'let s1 = String::from("ownership");\nlet s2 = s1;\nlet s3 = s2.clone();\nprintln!("s2: {}", s2);\nprintln!("s3: {}", s3);',
      ],
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
        title: '不可变引用',
        type: 'code',
        lesson: '& 创建不可变引用，可以读取但不能修改。可以同时有多个不可变引用。',
        question: '用引用读取数据',
        codeTask: '1. 创建 s = String::from("hello")\n2. 用 &s 创建引用 r\n3. 输出 r 的值和长度',
        codeTemplate: 'fn main() {\n    let s = String::from("hello");\n    let r = &s;\n    // 输出值和长度\n    \n}',
        codeTestCases: [{ input: '', expected: 'hello (len: 5)', description: '引用读取' }],
        codeHints: ['println!("{} (len: {})", r, r.len());'],
        solution: 'hello (len: 5)',
        explanation: '& 创建不可变引用，可以读取但不能修改。',
      },
      {
        id: 'w07-l02',
        title: '可变引用',
        type: 'code',
        lesson: '&mut 创建可变引用，可以修改借用的值。同一时间只能有一个可变引用。',
        question: '用可变引用修改数据',
        codeTask: '1. 创建 mut s = String::from("Hello")\n2. 用 &mut s 创建可变引用\n3. 用 push_str(", world!") 追加\n4. 输出 "Hello, world!"',
        codeTemplate: 'fn main() {\n    let mut s = String::from("Hello");\n    // 用可变引用修改\n    \n    println!("{}", s);\n}',
        codeTestCases: [{ input: '', expected: 'Hello, world!', description: '可变引用' }],
        codeHints: ['s.push_str(", world!"); — 直接修改也行', '或者 let r = &mut s; r.push_str(", world!");'],
        solution: 'Hello, world!',
        explanation: '&mut 创建可变引用，允许修改借用的值。',
      },
      {
        id: 'w07-l03',
        title: '引用与函数',
        type: 'code',
        lesson: '函数参数用引用可以借用值而不获取所有权。',
        question: '用引用传参',
        codeTask: '1. 定义 get_length(s: &str) -> usize，返回 s.len()\n2. 创建 String，用引用调用函数\n3. 函数调用后原变量还能用',
        codeTemplate: '// 定义 get_length 函数\n\nfn main() {\n    let s = String::from("hello");\n    let len = get_length(&s);\n    println!("len: {}", len);\n    println!("still: {}", s);\n}',
        codeTestCases: [{ input: '', expected: 'len: 5\nstill: hello', description: '引用传参' }],
        codeHints: ['fn get_length(s: &str) -> usize { s.len() }'],
        solution: 'len: 5\nstill: hello',
        explanation: '引用不获取所有权，原变量还能用。',
      },
      {
        id: 'w07-l04',
        title: '可变引用修改',
        type: 'code',
        lesson: '函数可以用 &mut 参数修改外部数据。',
        question: '用可变引用修改数据',
        codeTask: '1. 定义 add_world(s: &mut String) 函数\n2. 在函数内 push_str(" World")\n3. 调用后输出 "Hello World"',
        codeTemplate: '// 定义 add_world 函数\n\nfn main() {\n    let mut s = String::from("Hello");\n    add_world(&mut s);\n    println!("{}", s);\n}',
        codeTestCases: [{ input: '', expected: 'Hello World', description: '可变引用修改' }],
        codeHints: ['fn add_world(s: &mut String) { s.push_str(" World"); }'],
        solution: 'Hello World',
        explanation: '&mut 参数让函数能修改外部数据。',
      },
      {
        id: 'w07-l05',
        title: '计算长度',
        type: 'code',
        lesson: '引用常用于"借用但不获取所有权"的场景。',
        question: '计算字符串长度',
        codeTask: '1. 定义 calculate_length(s: &String) -> usize\n2. 创建 String，用引用获取长度\n3. 输出 "Length: 5" 后还能用原变量',
        codeTemplate: '// 定义 calculate_length 函数\n\nfn main() {\n    let mut s = String::from("Hello");\n    let len = calculate_length(&s);\n    println!("Length: {}", len);\n    s.push_str("!");\n    println!("After: {}", s);\n}',
        codeTestCases: [{ input: '', expected: 'Length: 5\nAfter: Hello!', description: '借用计算' }],
        codeHints: ['fn calculate_length(s: &String) -> usize { s.len() }'],
        solution: 'Length: 5\nAfter: Hello!',
        explanation: '引用借用数据，不获取所有权，原变量还能修改。',
      },
      {
        id: 'w07-l06',
        title: '引用综合作用域',
        type: 'code',
        lesson: '引用的作用域从创建到最后一次使用。之后原变量可以再修改。',
        question: '理解引用作用域',
        codeTask: '1. 创建 mut s = String::from("hello")\n2. 创建引用 r = &s，用完后不再使用\n3. 然后可以修改 s.push_str(" world")\n4. 输出 "hello world"',
        codeTemplate: 'fn main() {\n    let mut s = String::from("hello");\n    let r = &s;\n    println!("{}", r);\n    // r 不再使用，所以 s 可以修改\n    s.push_str(" world");\n    println!("{}", s);\n}',
        codeTestCases: [{ input: '', expected: 'hello\nhello world', description: '引用作用域' }],
        codeHints: ['代码已写好，直接运行验证'],
        solution: 'hello\nhello world',
        explanation: '引用在最后一次使用后结束，之后原变量可以修改。',
      },
      {
        id: 'w07-l07',
        title: '多个引用',
        type: 'code',
        lesson: '可以同时有多个不可变引用，但只能有一个可变引用。',
        question: '多个不可变引用',
        codeTask: '1. 创建 s = String::from("data")\n2. 创建两个不可变引用 r1 和 r2\n3. 输出两个引用的值',
        codeTemplate: 'fn main() {\n    let s = String::from("data");\n    let r1 = &s;\n    let r2 = &s;\n    // 输出两个引用\n    \n}',
        codeTestCases: [{ input: '', expected: 'r1: data, r2: data', description: '多个引用' }],
        codeHints: ['println!("r1: {}, r2: {}", r1, r2);'],
        solution: 'r1: data, r2: data',
        explanation: '多个不可变引用可以同时存在。',
      },
      {
        id: 'w07-l08',
        title: '引用实战',
        type: 'code',
        lesson: '综合运用引用的各种场景。',
        question: '引用综合练习',
        codeTask: '1. 定义 greet(s: &str) 输出 "Hi, {s}!"\n2. 定义 append(s: &mut String) 追加 "!!!" \n3. 创建 String，先 greet 再 append',
        codeTemplate: '// 定义 greet 和 append 函数\n\nfn main() {\n    let mut name = String::from("Rust");\n    greet(&name);\n    append(&mut name);\n    println!("{}", name);\n}',
        codeTestCases: [{ input: '', expected: 'Hi, Rust!\nRust!!!', description: '引用实战' }],
        codeHints: ['fn greet(s: &str) { println!("Hi, {}!", s); }', 'fn append(s: &mut String) { s.push_str("!!!"); }'],
        solution: 'Hi, Rust!\nRust!!!',
        explanation: '不可变引用读取，可变引用修改。',
      },
    ],
    boss: {
      title: '借用挑战',
      description: '演示不可变引用和可变引用：用引用获取字符串长度，用可变引用修改字符串。',
      template: `// TODO: 定义 calculate_length 函数
// 参数: s: &String（不可变引用）
// 返回值: usize（字符串长度）
// 函数体: s.len()

// TODO: 定义 append_world 函数
// 参数: s: &mut String（可变引用）
// 函数体: s.push_str(" World")

fn main() {
    let mut s = String::from("Hello");

    let len = calculate_length(&s);
    println!("Length: {}", len);

    append_world(&mut s);
    println!("Result: {}", s);
}`,
      steps: [
        '定义 calculate_length(s: &String) -> usize，返回 s.len()',
        '定义 append_world(s: &mut String)，调用 s.push_str(" World")',
        '确认 main 中的调用代码正确',
        '输出应为 "Length: 5" 和 "Result: Hello World"',
      ],
      hints: [
        '&String 是不可变引用，可以读取但不能修改',
        '&mut String 是可变引用，可以修改原始数据',
        'fn calculate_length(s: &String) -> usize {\n    s.len()\n}\nfn append_world(s: &mut String) {\n    s.push_str(" World");\n}',
      ],
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
        type: 'code',
        lesson: '&s[start..end] 创建字符串切片。&s[..end] 从开头，&s[start..] 到结尾。',
        question: '使用字符串切片',
        codeTask: '1. 创建 s = "hello world"\n2. 获取前5个字符的切片 &s[0..5]\n3. 输出 "First: hello"',
        codeTemplate: 'fn main() {\n    let s = String::from("hello world");\n    let first = &s[0..5];\n    // 输出\n}',
        codeTestCases: [{ input: '', expected: 'First: hello', description: '字符串切片' }],
        codeHints: ['println!("First: {}", first);'],
        solution: 'First: hello',
        explanation: '&s[0..5] 获取索引 0 到 4 的切片。',
      },
      {
        id: 'w08-l02',
        title: '查找第一个单词',
        type: 'code',
        lesson: '遍历字节找空格位置，用切片提取单词。',
        question: '实现 first_word 函数',
        codeTask: '1. 定义 first_word(s: &str) -> &str\n2. 找到第一个空格，返回之前的切片\n3. 没有空格返回整个字符串',
        codeTemplate: '// 实现 first_word 函数\n// 提示: s.as_bytes() 获取字节，b\' \' 是空格\n\nfn main() {\n    let s = String::from("hello world");\n    println!("{}", first_word(&s));\n}',
        codeTestCases: [{ input: '', expected: 'hello', description: '第一个单词' }],
        codeHints: ['遍历字节找空格：for (i, &item) in s.as_bytes().iter().enumerate()', '找到空格返回 &s[0..i]，没找到返回 &s[..]'],
        solution: 'hello',
        explanation: '切片是对字符串部分数据的引用。',
      },
      {
        id: 'w08-l03',
        title: '数组切片',
        type: 'code',
        lesson: '数组也可以用切片，语法和字符串一样。',
        question: '使用数组切片',
        codeTask: '1. 创建 arr = [10, 20, 30, 40, 50]\n2. 获取中间3个元素的切片 &arr[1..4]\n3. 输出 "Slice: [20, 30, 40]"',
        codeTemplate: 'fn main() {\n    let arr = [10, 20, 30, 40, 50];\n    let slice = &arr[1..4];\n    // 输出\n}',
        codeTestCases: [{ input: '', expected: 'Slice: [20, 30, 40]', description: '数组切片' }],
        codeHints: ['println!("Slice: {:?}", slice); — {:?} 打印数组'],
        solution: 'Slice: [20, 30, 40]',
        explanation: '&arr[1..4] 获取索引 1 到 3 的元素。',
      },
      {
        id: 'w08-l04',
        title: '切片作为参数',
        type: 'code',
        lesson: '函数参数用 &str 比 &String 更灵活，可以接受两种类型。',
        question: '用切片参数写函数',
        codeTask: '1. 定义 greet(name: &str) 函数\n2. 输出 "Hello, {name}!"\n3. 分别用 &str 和 &String 调用',
        codeTemplate: '// 定义 greet 函数\n\nfn main() {\n    let s1 = "world";\n    let s2 = String::from("Rust");\n    greet(s1);\n    greet(&s2);\n}',
        codeTestCases: [{ input: '', expected: 'Hello, world!\nHello, Rust!', description: '切片参数' }],
        codeHints: ['fn greet(name: &str) { println!("Hello, {}!", name); }'],
        solution: 'Hello, world!\nHello, Rust!',
        explanation: '&str 参数同时接受 &str 和 &String。',
      },
      {
        id: 'w08-l05',
        title: '切片实战',
        type: 'code',
        lesson: '综合运用切片操作。',
        question: '处理字符串数据',
        codeTask: '1. 创建 s = "2024-06-18"\n2. 提取年份 &s[0..4]\n3. 提取月份 &s[5..7]\n4. 输出 "Year: 2024, Month: 06"',
        codeTemplate: 'fn main() {\n    let s = String::from("2024-06-18");\n    let year = &s[0..4];\n    let month = &s[5..7];\n    // 输出\n}',
        codeTestCases: [{ input: '', expected: 'Year: 2024, Month: 06', description: '字符串解析' }],
        codeHints: ['println!("Year: {}, Month: {}", year, month);'],
        solution: 'Year: 2024, Month: 06',
        explanation: '切片常用于解析固定格式的字符串。',
      },
      {
        id: 'w08-l06',
        title: '切片与函数',
        type: 'code',
        lesson: '函数返回切片可以让调用者获取字符串的一部分。',
        question: '返回切片的函数',
        codeTask: '1. 定义 last_word(s: &str) -> &str\n2. 找到最后一个空格，返回之后的部分\n3. "hello world" → "world"',
        codeTemplate: '// 实现 last_word 函数\n// 提示: rfind(\' \') 找最后一个空格\n\nfn main() {\n    let s = String::from("hello world");\n    println!("{}", last_word(&s));\n}',
        codeTestCases: [{ input: '', expected: 'world', description: '最后一个单词' }],
        codeHints: ['if let Some(pos) = s.rfind(\' \') { &s[pos+1..] } else { s }'],
        solution: 'world',
        explanation: 'rfind 查找最后一个匹配位置。',
      },
    ],
    boss: {
      title: '切片挑战',
      description: '实现 first_word 函数：接收字符串切片，返回第一个单词（到空格为止）。',
      template: `// TODO: 实现 first_word 函数
// 参数: s: &str（字符串切片）
// 返回值: &str（第一个单词的切片）
// 思路: 遍历字节，找到空格位置，返回 &s[0..i]

fn main() {
    let s = String::from("hello world");
    let word = first_word(&s);
    println!("First word: {}", word);
}`,
      steps: [
        '定义 fn first_word(s: &str) -> &str',
        '用 s.as_bytes() 获取字节数组',
        '用 for 循环遍历，找到空格 b\' \'',
        '找到空格返回 &s[0..i]，没找到返回 &s[..]',
      ],
      hints: [
        'as_bytes() 把字符串转为字节数组，可以用 for 遍历',
        'b\' \' 是空格的字节值，&s[0..i] 是从开头到 i 的切片',
        'fn first_word(s: &str) -> &str {\n    let bytes = s.as_bytes();\n    for (i, &item) in bytes.iter().enumerate() {\n        if item == b\' \' {\n            return &s[0..i];\n        }\n    }\n    &s[..]\n}',
      ],
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
        type: 'code',
        lesson: 'struct 用关键字定义，包含命名字段。用 impl 块定义方法。',
        question: '定义一个简单的 struct',
        codeTask: '1. 定义 Player struct（name: String, hp: i32）\n2. 创建实例 player = Player { name: "Alice", hp: 100 }\n3. 输出 "Alice has 100 HP"',
        codeTemplate: '// 定义 Player struct\n\nfn main() {\n    // 创建实例\n    \n    // 输出\n}',
        codeTestCases: [{ input: '', expected: 'Alice has 100 HP', description: 'struct 基础' }],
        codeHints: ['struct Player { name: String, hp: i32 }', 'let p = Player { name: String::from("Alice"), hp: 100 };', 'println!("{} has {} HP", p.name, p.hp);'],
        solution: 'Alice has 100 HP',
        explanation: 'struct 定义用花括号包围字段，用点号访问字段。',
      },
      {
        id: 'w09-l02',
        title: 'struct 方法',
        type: 'code',
        lesson: '用 impl 块为 struct 定义方法。&self 表示借用自身。',
        question: '为 struct 添加方法',
        codeTask: '1. 定义 Rectangle { width: f64, height: f64 }\n2. 实现 area(&self) -> f64 方法\n3. 创建实例并输出面积 "Area: 50"',
        codeTemplate: '// 定义 Rectangle 和 area 方法\n\nfn main() {\n    let rect = Rectangle { width: 10.0, height: 5.0 };\n    println!("Area: {}", rect.area());\n}',
        codeTestCases: [{ input: '', expected: 'Area: 50', description: 'struct 方法' }],
        codeHints: ['impl Rectangle { fn area(&self) -> f64 { self.width * self.height } }'],
        solution: 'Area: 50',
        explanation: 'impl 块为 struct 定义方法，&self 借用自身。',
      },
      {
        id: 'w09-l03',
        title: '关联函数 new',
        type: 'code',
        lesson: '没有 self 参数的函数叫关联函数，用 :: 调用。常见于构造函数 new()。',
        question: '实现 new 构造函数',
        codeTask: '1. 为 Rectangle 实现 new(w: f64, h: f64) -> Self\n2. 用 Rectangle::new(10.0, 5.0) 创建实例\n3. 输出面积',
        codeTemplate: '// 为 Rectangle 实现 new 和 area\n\nfn main() {\n    let rect = Rectangle::new(10.0, 5.0);\n    println!("Area: {}", rect.area());\n}',
        codeTestCases: [{ input: '', expected: 'Area: 50', description: 'new 函数' }],
        codeHints: ['impl Rectangle { fn new(w: f64, h: f64) -> Self { Rectangle { width: w, height: h } } }'],
        solution: 'Area: 50',
        explanation: '关联函数用 :: 调用，Self 指代当前类型。',
      },
      {
        id: 'w09-l04',
        title: 'Debug 打印',
        type: 'code',
        lesson: '#[derive(Debug)] 让 struct 可以用 {:?} 打印。',
        question: '让 struct 可打印',
        codeTask: '1. 给 Point 加 #[derive(Debug)]\n2. 创建 Point { x: 3, y: 7 }\n3. 用 {:?} 输出 "Point { x: 3, y: 7 }"',
        codeTemplate: '// 给 Point 加 Debug\nstruct Point {\n    x: i32,\n    y: i32,\n}\n\nfn main() {\n    let p = Point { x: 3, y: 7 };\n    // 用 {:?} 打印\n}',
        codeTestCases: [{ input: '', expected: 'Point { x: 3, y: 7 }', description: 'Debug 打印' }],
        codeHints: ['#[derive(Debug)] 加在 struct 上面', 'println!("{:?}", p);'],
        solution: 'Point { x: 3, y: 7 }',
        explanation: '#[derive(Debug)] 自动实现 Debug trait。',
      },
      {
        id: 'w09-l05',
        title: '方法链',
        type: 'code',
        lesson: '方法可以返回 self 或新值，实现链式调用。',
        question: '实现方法链',
        codeTask: '1. 定义 Counter { value: i32 }\n2. 实现 increment(&mut self) 方法，value += 1\n3. 实现 get(&self) -> i32\n4. 调用 3 次 increment，输出 "Count: 3"',
        codeTemplate: '// 定义 Counter\n\nfn main() {\n    let mut c = Counter { value: 0 };\n    c.increment();\n    c.increment();\n    c.increment();\n    println!("Count: {}", c.get());\n}',
        codeTestCases: [{ input: '', expected: 'Count: 3', description: '方法调用' }],
        codeHints: ['impl Counter { fn increment(&mut self) { self.value += 1; } fn get(&self) -> i32 { self.value } }'],
        solution: 'Count: 3',
        explanation: '&mut self 修改自身，&self 只读。',
      },
      {
        id: 'w09-l06',
        title: 'struct 综合',
        type: 'code',
        lesson: '综合运用 struct、方法、关联函数。',
        question: '构建完整数据结构',
        codeTask: '1. 定义 Character { name: String, hp: i32, attack: i32 }\n2. 实现 new 和 describe 方法\n3. 输出 "Alice (HP: 100, ATK: 25)"',
        codeTemplate: '// 定义 Character\n\nfn main() {\n    let hero = Character::new(String::from("Alice"), 100, 25);\n    hero.describe();\n}',
        codeTestCases: [{ input: '', expected: 'Alice (HP: 100, ATK: 25)', description: 'struct 综合' }],
        codeHints: ['fn describe(&self) { println!("{} (HP: {}, ATK: {})", self.name, self.hp, self.attack); }'],
        solution: 'Alice (HP: 100, ATK: 25)',
        explanation: 'struct + impl + 方法是 Rust 的基本数据抽象。',
      },
      {
        id: 'w09-l07',
        title: '元组 struct',
        type: 'code',
        lesson: '元组 struct 有名字但字段没有名字，用圆括号定义。',
        question: '使用元组 struct',
        codeTask: '1. 定义 Color(u8, u8, u8) 元组 struct\n2. 创建 red = Color(255, 0, 0)\n3. 输出 "Red: 255, Green: 0, Blue: 0"',
        codeTemplate: '// 定义 Color 元组 struct\n\nfn main() {\n    let red = Color(255, 0, 0);\n    // 用 .0 .1 .2 访问\n}',
        codeTestCases: [{ input: '', expected: 'Red: 255, Green: 0, Blue: 0', description: '元组 struct' }],
        codeHints: ['struct Color(u8, u8, u8);', 'println!("Red: {}, Green: {}, Blue: {}", red.0, red.1, red.2);'],
        solution: 'Red: 255, Green: 0, Blue: 0',
        explanation: '元组 struct 用 .0 .1 .2 访问字段。',
      },
      {
        id: 'w09-l08',
        title: 'struct 实战',
        type: 'code',
        lesson: '综合运用所有 struct 知识。',
        question: '构建游戏角色系统',
        codeTask: '1. 定义 Enemy { name: String, hp: i32 }\n2. 实现 take_damage(&mut self, dmg: i32)\n3. 创建 hp=50 的敌人，受到 20 伤害\n4. 输出 "Goblin: 30 HP remaining"',
        codeTemplate: '// 定义 Enemy\n\nfn main() {\n    let mut enemy = Enemy { name: String::from("Goblin"), hp: 50 };\n    enemy.take_damage(20);\n    println!("{}: {} HP remaining", enemy.name, enemy.hp);\n}',
        codeTestCases: [{ input: '', expected: 'Goblin: 30 HP remaining', description: 'struct 实战' }],
        codeHints: ['fn take_damage(&mut self, dmg: i32) { self.hp -= dmg; }'],
        solution: 'Goblin: 30 HP remaining',
        explanation: '&mut self 方法可以修改 struct 内部状态。',
      },
    ],
    boss: {
      title: 'struct 挑战',
      description: '定义 Rectangle 结构体，实现 area 方法计算面积。',
      template: `// TODO: 定义 Rectangle struct
// 字段: width: f64, height: f64

// TODO: 为 Rectangle 实现 area 方法
// fn area(&self) -> f64 — 返回 width * height

fn main() {
    let rect = Rectangle { width: 10.0, height: 5.0 };
    println!("Area: {}", rect.area());
}`,
      steps: [
        '定义 struct Rectangle { width: f64, height: f64 }',
        '写 impl Rectangle { fn area(&self) -> f64 { ... } }',
        'area 方法返回 self.width * self.height',
        '确认输出 "Area: 50"',
      ],
      hints: [
        'struct 定义：struct 名字 { 字段: 类型, ... }',
        'impl 块为 struct 定义方法，&self 表示借用自身',
        'struct Rectangle { width: f64, height: f64 }\nimpl Rectangle {\n    fn area(&self) -> f64 { self.width * self.height }\n}',
      ],
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
        title: '定义枚举',
        type: 'code',
        lesson: 'enum 定义一组可能的变体。每个变体可以有数据，也可以没有。',
        question: '定义和使用枚举',
        codeTask: '1. 定义 Direction 枚举（Up, Down, Left, Right）\n2. 创建 dir = Direction::Up\n3. 用 match 匹配输出 "Going up"',
        codeTemplate: '// 定义 Direction 枚举\n\nfn main() {\n    let dir = Direction::Up;\n    // match dir { ... }\n}',
        codeTestCases: [{ input: '', expected: 'Going up', description: '枚举基础' }],
        codeHints: ['enum Direction { Up, Down, Left, Right }', 'match dir { Direction::Up => println!("Going up"), ... }'],
        solution: 'Going up',
        explanation: 'enum 定义变体，match 匹配处理。',
      },
      {
        id: 'w10-l02',
        title: '带数据的枚举',
        type: 'code',
        lesson: '枚举变体可以携带数据，类似联合类型。',
        question: '枚举携带数据',
        codeTask: '1. 定义 Message 枚举（Quit, Text(String)）\n2. 创建 msg = Message::Text("hello")\n3. match 输出 "Message: hello"',
        codeTemplate: '// 定义 Message 枚举\n\nfn main() {\n    let msg = Message::Text(String::from("hello"));\n    // match msg { ... }\n}',
        codeTestCases: [{ input: '', expected: 'Message: hello', description: '枚举数据' }],
        codeHints: ['enum Message { Quit, Text(String) }', 'Message::Text(s) => println!("Message: {}", s)'],
        solution: 'Message: hello',
        explanation: '枚举变体可以携带不同类型的数据。',
      },
      {
        id: 'w10-l03',
        title: 'Option 类型',
        type: 'code',
        lesson: 'Option<T> 表示可能有值（Some(T)）或没有值（None）。Rust 没有 null。',
        question: '使用 Option',
        codeTask: '1. 创建 x: Option<i32> = Some(42)\n2. 用 match 处理：Some 输出值，None 输出 "no value"\n3. 输出 "42"',
        codeTemplate: 'fn main() {\n    let x: Option<i32> = Some(42);\n    // match x { Some(v) => ..., None => ... }\n}',
        codeTestCases: [{ input: '', expected: '42', description: 'Option' }],
        codeHints: ['match x { Some(v) => println!("{}", v), None => println!("no value") }'],
        solution: '42',
        explanation: 'Option 用 Some 和 None 表示有值或无值。',
      },
      {
        id: 'w10-l04',
        title: 'if let 简写',
        type: 'code',
        lesson: 'if let 是 match 的简写，只关心一个变体时更简洁。',
        question: '用 if let 处理 Option',
        codeTask: '1. 创建 x: Option<i32> = Some(10)\n2. 用 if let Some(v) = x 提取值\n3. 输出 "Value: 10"',
        codeTemplate: 'fn main() {\n    let x: Option<i32> = Some(10);\n    // if let Some(v) = x { ... }\n}',
        codeTestCases: [{ input: '', expected: 'Value: 10', description: 'if let' }],
        codeHints: ['if let Some(v) = x { println!("Value: {}", v); }'],
        solution: 'Value: 10',
        explanation: 'if let 只匹配一个模式，忽略其他情况。',
      },
      {
        id: 'w10-l05',
        title: '枚举方法',
        type: 'code',
        lesson: '枚举也可以用 impl 定义方法，和 struct 一样。',
        question: '为枚举实现方法',
        codeTask: '1. 定义 TrafficLight（Red, Yellow, Green）\n2. 实现 duration(&self) -> i32 方法\n3. Red=60, Yellow=10, Green=45\n4. 输出 "Red light: 60s"',
        codeTemplate: '// 定义 TrafficLight 和 duration 方法\n\nfn main() {\n    let light = TrafficLight::Red;\n    println!("Red light: {}s", light.duration());\n}',
        codeTestCases: [{ input: '', expected: 'Red light: 60s', description: '枚举方法' }],
        codeHints: ['match self { TrafficLight::Red => 60, TrafficLight::Yellow => 10, TrafficLight::Green => 45 }'],
        solution: 'Red light: 60s',
        explanation: 'impl 块可以为枚举定义方法。',
      },
      {
        id: 'w10-l06',
        title: '枚举实战',
        type: 'code',
        lesson: '综合运用枚举、match、Option。',
        question: '构建计算器',
        codeTask: '1. 定义 Operation 枚举（Add(f64,f64), Sub(f64,f64), Mul(f64,f64)）\n2. 实现 calculate(&self) -> f64\n3. 计算 Add(10.0, 5.0) 输出 "Result: 15"',
        codeTemplate: '// 定义 Operation 枚举和 calculate 方法\n\nfn main() {\n    let op = Operation::Add(10.0, 5.0);\n    println!("Result: {}", op.calculate());\n}',
        codeTestCases: [{ input: '', expected: 'Result: 15', description: '枚举实战' }],
        codeHints: ['match self { Operation::Add(a, b) => a + b, Operation::Sub(a, b) => a - b, Operation::Mul(a, b) => a * b }'],
        solution: 'Result: 15',
        explanation: '枚举 + match 是 Rust 的核心模式。',
      },
    ],
    boss: {
      title: '枚举挑战',
      description: '定义 Shape 枚举，用 match 实现 area 方法计算不同形状的面积。',
      template: `// TODO: 定义 Shape 枚举
// 变体: Circle(f64) — 圆的半径
// 变体: Rectangle(f64, f64) — 矩形的宽和高

// TODO: 为 Shape 实现 area 方法
// fn area(&self) -> f64
// Circle: PI * r * r
// Rectangle: width * height
// 提示: 用 match self { ... } 匹配变体

fn main() {
    let circle = Shape::Circle(5.0);
    let rect = Shape::Rectangle(10.0, 5.0);
    println!("Circle area: {}", circle.area());
    println!("Rectangle area: {}", rect.area());
}`,
      steps: [
        '定义 enum Shape { Circle(f64), Rectangle(f64, f64) }',
        '写 impl Shape { fn area(&self) -> f64 { ... } }',
        '用 match 匹配 Circle(r) 和 Rectangle(w, h)',
        '圆面积: PI * r * r，矩形面积: w * h',
      ],
      hints: [
        'enum 定义：enum 名字 { 变体(类型), ... }',
        'match self { Shape::Circle(r) => ..., Shape::Rectangle(w, h) => ... }',
        'enum Shape {\n    Circle(f64),\n    Rectangle(f64, f64),\n}\nimpl Shape {\n    fn area(&self) -> f64 {\n        match self {\n            Shape::Circle(r) => std::f64::consts::PI * r * r,\n            Shape::Rectangle(w, h) => w * h,\n        }\n    }\n}',
      ],
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
        type: 'code',
        lesson: '泛型用 <T> 声明，让函数适用于多种类型。',
        question: '写一个泛型函数',
        codeTask: '1. 定义泛型函数 largest<T: PartialOrd>(list: &[T]) -> &T\n2. 返回切片中最大的元素\n3. 测试 [1,5,3] 输出 "Max: 5"',
        codeTemplate: '// 定义泛型 largest 函数\n\nfn main() {\n    let nums = [1, 5, 3];\n    println!("Max: {}", largest(&nums));\n}',
        codeTestCases: [{ input: '', expected: 'Max: 5', description: '泛型函数' }],
        codeHints: ['fn largest<T: PartialOrd>(list: &[T]) -> &T { let mut max = &list[0]; for item in list { if item > max { max = item; } } max }'],
        solution: 'Max: 5',
        explanation: '<T> 声明类型参数，T: PartialOrd 约束可比较。',
      },
      {
        id: 'w11-l02',
        title: '泛型 struct',
        type: 'code',
        lesson: 'struct 也可以用泛型，存储任意类型的值。',
        question: '定义泛型 struct',
        codeTask: '1. 定义 Point<T> { x: T, y: T }\n2. 实现 new(x: T, y: T) -> Self\n3. 创建 Point(3, 7) 输出 "Point(3, 7)"',
        codeTemplate: '// 定义泛型 Point\n\nfn main() {\n    let p = Point::new(3, 7);\n    println!("Point({}, {})", p.x, p.y);\n}',
        codeTestCases: [{ input: '', expected: 'Point(3, 7)', description: '泛型 struct' }],
        codeHints: ['struct Point<T> { x: T, y: T }', 'impl<T> Point<T> { fn new(x: T, y: T) -> Self { Point { x, y } } }'],
        solution: 'Point(3, 7)',
        explanation: 'struct Point<T> 声明泛型 struct。',
      },
      {
        id: 'w11-l03',
        title: '泛型方法',
        type: 'code',
        lesson: 'impl<T> 为泛型 struct 实现方法。',
        question: '为泛型 struct 添加方法',
        codeTask: '1. 定义 Wrapper<T> { value: T }\n2. 实现 get(&self) -> &T\n3. 创建 Wrapper(42) 输出 "Value: 42"',
        codeTemplate: '// 定义 Wrapper 和 get 方法\n\nfn main() {\n    let w = Wrapper { value: 42 };\n    println!("Value: {}", w.get());\n}',
        codeTestCases: [{ input: '', expected: 'Value: 42', description: '泛型方法' }],
        codeHints: ['impl<T> Wrapper<T> { fn get(&self) -> &T { &self.value } }'],
        solution: 'Value: 42',
        explanation: 'impl<T> 为泛型类型实现方法。',
      },
      {
        id: 'w11-l04',
        title: '多个泛型参数',
        type: 'code',
        lesson: '可以用多个泛型参数 <T, U>，每个参数可以是不同类型。',
        question: '使用多个泛型参数',
        codeTask: '1. 定义 Pair<A, B> { first: A, second: B }\n2. 创建 Pair(42, "hello")\n3. 输出 "42 and hello"',
        codeTemplate: '// 定义 Pair<A, B>\n\nfn main() {\n    let p = Pair { first: 42, second: "hello" };\n    println!("{} and {}", p.first, p.second);\n}',
        codeTestCases: [{ input: '', expected: '42 and hello', description: '多泛型' }],
        codeHints: ['struct Pair<A, B> { first: A, second: B }'],
        solution: '42 and hello',
        explanation: '<A, B> 允许两个不同类型参数。',
      },
      {
        id: 'w11-l05',
        title: '泛型约束',
        type: 'code',
        lesson: '用 T: Trait 约束泛型必须实现某个 trait。',
        question: '添加泛型约束',
        codeTask: '1. 定义 print_it<T: std::fmt::Display>(item: T)\n2. 输出 "{}"\n3. 分别传入 42 和 "hello"',
        codeTemplate: '// 定义泛型 print_it 函数\n\nfn main() {\n    print_it(42);\n    print_it("hello");\n}',
        codeTestCases: [{ input: '', expected: '42\nhello', description: '泛型约束' }],
        codeHints: ['fn print_it<T: std::fmt::Display>(item: T) { println!("{}", item); }'],
        solution: '42\nhello',
        explanation: 'T: Display 约束 T 必须能用 {} 打印。',
      },
      {
        id: 'w11-l06',
        title: '泛型实战',
        type: 'code',
        lesson: '综合运用泛型。',
        question: '泛型综合练习',
        codeTask: '1. 定义 Stack<T> { items: Vec<T> }\n2. 实现 push 和 pop 方法\n3. 创建 Stack，push 3 个值，pop 一个，输出 "Popped: 30"',
        codeTemplate: '// 定义 Stack<T>\n\nfn main() {\n    let mut s = Stack { items: vec![] };\n    s.push(10);\n    s.push(20);\n    s.push(30);\n    println!("Popped: {}", s.pop());\n}',
        codeTestCases: [{ input: '', expected: 'Popped: 30', description: '泛型实战' }],
        codeHints: ['impl<T> Stack<T> { fn push(&mut self, item: T) { self.items.push(item); } fn pop(&mut self) -> T { self.items.pop().unwrap() } }'],
        solution: 'Popped: 30',
        explanation: '泛型 struct + 方法实现通用数据结构。',
      },
    ],
    boss: {
      title: '泛型挑战',
      description: '定义泛型 Point<T> 结构体，实现 new 方法，创建不同类型实例。',
      template: `// TODO: 定义泛型 Point<T> struct
// 字段: x: T, y: T
// 加上 #[derive(Debug)]

// TODO: 为 Point<T> 实现 new 方法
// impl<T> Point<T> { fn new(x: T, y: T) -> Self { ... } }

fn main() {
    let int_point = Point::new(5, 10);
    let float_point = Point::new(1.5, 2.5);
    println!("Int: {:?}", int_point);
    println!("Float: {:?}", float_point);
}`,
      steps: [
        '定义 #[derive(Debug)] struct Point<T> { x: T, y: T }',
        '写 impl<T> Point<T> { fn new(x: T, y: T) -> Self { ... } }',
        'new 返回 Point { x, y }',
        '确认输出 "Int: Point { x: 5, y: 10 }" 等',
      ],
      hints: [
        '泛型 struct：struct Point<T> { x: T, y: T }',
        'impl 后面也要加 <T>：impl<T> Point<T> { ... }',
        '#[derive(Debug)]\nstruct Point<T> { x: T, y: T }\nimpl<T> Point<T> {\n    fn new(x: T, y: T) -> Self { Point { x, y } }\n}',
      ],
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
        type: 'code',
        lesson: 'trait 定义一组方法签名。用 impl Trait for Type 实现。',
        question: '定义和实现 trait',
        codeTask: '1. 定义 Greet trait（fn greet(&self) -> String）\n2. 为 User struct 实现 Greet\n3. 输出 "Hello, Alice!"',
        codeTemplate: '// 定义 Greet trait\n// 定义 User struct\n// 为 User 实现 Greet\n\nfn main() {\n    let user = User { name: String::from("Alice") };\n    println!("{}", user.greet());\n}',
        codeTestCases: [{ input: '', expected: 'Hello, Alice!', description: 'trait 基础' }],
        codeHints: ['trait Greet { fn greet(&self) -> String; }', 'impl Greet for User { fn greet(&self) -> format!("Hello, {}!", self.name) }'],
        solution: 'Hello, Alice!',
        explanation: 'trait 定义接口，impl for 实现接口。',
      },
      {
        id: 'w12-l02',
        title: 'trait 作为参数',
        type: 'code',
        lesson: '用 impl Trait 或 T: Trait 让函数接受任何实现了该 trait 的类型。',
        question: '用 trait 作为参数',
        codeTask: '1. 定义 Printable trait（fn format(&self) -> String）\n2. 为 User 和 Product 实现它\n3. 定义 print_item(item: &impl Printable)\n4. 打印两个对象',
        codeTemplate: '// 定义 Printable trait\n// 定义 User 和 Product\n// 为两者实现 Printable\n\nfn print_item(item: &impl Printable) {\n    println!("{}", item.format());\n}\n\nfn main() {\n    let user = User { name: String::from("Alice") };\n    let product = Product { name: String::from("Widget"), price: 9.99 };\n    print_item(&user);\n    print_item(&product);\n}',
        codeTestCases: [{ input: '', expected: 'User: Alice\nProduct: Widget ($9.99)', description: 'trait 参数' }],
        codeHints: ['impl Printable for User { fn format(&self) -> format!("User: {}", self.name) }'],
        solution: 'User: Alice\nProduct: Widget ($9.99)',
        explanation: 'impl Trait 参数接受任何实现了该 trait 的类型。',
      },
      {
        id: 'w12-l03',
        title: '默认方法',
        type: 'code',
        lesson: 'trait 可以有默认实现，实现者可以选择覆盖或使用默认方法。',
        question: '使用 trait 默认方法',
        codeTask: '1. 定义 Summary trait，默认 summarize 返回 "Read more..."\n2. 为 Article 实现（覆盖 summarize）\n3. 为 ShortPost 实现（使用默认）\n4. 输出两行',
        codeTemplate: '// 定义 Summary trait（有默认方法）\n// Article 覆盖，ShortPost 使用默认\n\nfn main() {\n    let a = Article { title: String::from("Rust") };\n    let s = ShortPost {};\n    println!("{}", a.summarize());\n    println!("{}", s.summarize());\n}',
        codeTestCases: [{ input: '', expected: 'Article: Rust\nRead more...', description: '默认方法' }],
        codeHints: ['trait Summary { fn summarize(&self) -> String { String::from("Read more...") } }'],
        solution: 'Article: Rust\nRead more...',
        explanation: 'trait 默认方法可以被覆盖或直接使用。',
      },
      {
        id: 'w12-l04',
        title: 'derive 自动实现',
        type: 'code',
        lesson: '#[derive(Debug, Clone, PartialEq)] 自动实现常用 trait。',
        question: '用 derive 自动实现 trait',
        codeTask: '1. 给 Point 加 #[derive(Debug, Clone, PartialEq)]\n2. 创建 p1 = Point(1, 2)，克隆给 p2\n3. 比较 p1 == p2 输出 "Equal: true"',
        codeTemplate: '// 给 Point 加 derive\nstruct Point(i32, i32);\n\nfn main() {\n    let p1 = Point(1, 2);\n    let p2 = p1.clone();\n    println!("Equal: {}", p1 == p2);\n}',
        codeTestCases: [{ input: '', expected: 'Equal: true', description: 'derive' }],
        codeHints: ['#[derive(Debug, Clone, PartialEq)] 加在 struct 上面'],
        solution: 'Equal: true',
        explanation: '#[derive(...)] 自动实现常用 trait。',
      },
      {
        id: 'w12-l05',
        title: 'trait 综合',
        type: 'code',
        lesson: '综合运用 trait 定义、实现、约束。',
        question: 'trait 综合练习',
        codeTask: '1. 定义 Drawable trait（fn draw(&self) -> String）\n2. 为 Circle 和 Square 实现\n3. 用 draw_all(items: &[&dyn Drawable]) 批量绘制\n4. 输出每个形状',
        codeTemplate: '// 定义 Drawable trait\n// 为 Circle 和 Square 实现\n\nfn main() {\n    let shapes: Vec<&dyn Drawable> = vec![\n        &Circle { radius: 5.0 },\n        &Square { side: 3.0 },\n    ];\n    for s in &shapes {\n        println!("{}", s.draw());\n    }\n}',
        codeTestCases: [{ input: '', expected: 'Circle(r=5)\nSquare(s=3)', description: 'trait 对象' }],
        codeHints: ['dyn Drawable 是 trait 对象，允许存储不同类型'],
        solution: 'Circle(r=5)\nSquare(s=3)',
        explanation: 'trait 对象允许动态分发不同类型。',
      },
    ],
    boss: {
      title: 'Trait 挑战',
      description: '定义 Printable trait，为 User 和 Product 实现它，用泛型参数打印。',
      template: `// TODO: 定义 Printable trait
// 方法: fn format(&self) -> String

// TODO: 定义 User struct（字段: name: String）
// TODO: 定义 Product struct（字段: name: String, price: f64）

// TODO: 为 User 实现 Printable
// format 返回 "User: {name}"

// TODO: 为 Product 实现 Printable
// format 返回 "Product: {name} ($9.99)"

// 打印函数（已写好）
fn print_item(item: &impl Printable) {
    println!("{}", item.format());
}

fn main() {
    let user = User { name: String::from("Alice") };
    let product = Product { name: String::from("Widget"), price: 9.99 };
    print_item(&user);
    print_item(&product);
}`,
      steps: [
        '定义 trait Printable { fn format(&self) -> String; }',
        '定义 User 和 Product struct',
        '为 User 实现 Printable：format!("User: {}", self.name)',
        '为 Product 实现 Printable：format!("Product: {} (${:.2})", self.name, self.price)',
      ],
      hints: [
        'trait 定义：trait 名字 { fn 方法名(&self) -> 返回类型; }',
        'impl Trait for Type { fn 方法名(&self) -> ... { ... } }',
        'trait Printable { fn format(&self) -> String; }\nstruct User { name: String }\nstruct Product { name: String, price: f64 }\nimpl Printable for User {\n    fn format(&self) -> String { format!("User: {}", self.name) }\n}\nimpl Printable for Product {\n    fn format(&self) -> String { format!("Product: {} (${:.2})", self.name, self.price) }\n}',
      ],
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
        title: '生命周期注解',
        type: 'code',
        lesson: '生命周期 \'a 确保引用在使用期间有效。大多数情况编译器自动推断。',
        question: '使用生命周期注解',
        codeTask: '1. 定义 longest 函数，返回较长的字符串\n2. 用生命周期注解 \'a 标注参数和返回值\n3. 测试 longest("hello", "world!") 输出 "world!"',
        codeTemplate: '// 定义 longest 函数\n// fn longest(x: &str, y: &str) -> &str\n\nfn main() {\n    let result = longest("hello", "world!");\n    println!("{}", result);\n}',
        codeTestCases: [{ input: '', expected: 'world!', description: '生命周期' }],
        codeHints: ['if x.len() > y.len() { x } else { y }'],
        solution: 'world!',
        explanation: '\'a 表示返回值的生命周期与参数相同。',
      },
      {
        id: 'w13-l02',
        title: 'struct 中的生命周期',
        type: 'code',
        lesson: 'struct 存储引用时必须标注生命周期。',
        question: '定义带生命周期的 struct',
        codeTask: '1. 定义 Excerpt<\'a> { text: &\'a str }\n2. 实现 new 和 get_text 方法\n3. 输出 "Excerpt: Hello"',
        codeTemplate: '// 定义 Excerpt struct（需要生命周期参数）\n\nfn main() {\n    let text = String::from("Hello");\n    let excerpt = Excerpt::new(&text);\n    println!("Excerpt: {}", excerpt.get_text());\n}',
        codeTestCases: [{ input: '', expected: 'Excerpt: Hello', description: 'struct 生命周期' }],
        codeHints: ['struct Excerpt<\'a> { text: &\'a str }', 'impl<\'a> Excerpt<\'a> { fn new(text: &\'a str) -> Self { Excerpt { text } } }'],
        solution: 'Excerpt: Hello',
        explanation: 'struct 存储引用时，生命周期参数确保引用有效。',
      },
      {
        id: 'w13-l03',
        title: '生命周期省略',
        type: 'code',
        lesson: '大多数情况编译器自动推断生命周期，不需要手写。',
        question: '省略生命周期',
        codeTask: '1. 定义 first_word(s: &str) -> &str\n2. 返回第一个单词\n3. 不需要手写生命周期（编译器自动推断）',
        codeTemplate: '// 定义 first_word（不用手写生命周期）\n\nfn main() {\n    let s = String::from("hello world");\n    println!("{}", first_word(&s));\n}',
        codeTestCases: [{ input: '', expected: 'hello', description: '省略规则' }],
        codeHints: ['fn first_word(s: &str) -> &str — 编译器自动推断生命周期'],
        solution: 'hello',
        explanation: '只有一个输入引用时，编译器自动推断生命周期。',
      },
      {
        id: 'w13-l04',
        title: '生命周期实战',
        type: 'code',
        lesson: '综合运用生命周期。',
        question: '生命周期综合练习',
        codeTask: '1. 定义 Book<\'a> { title: &\'a str, author: &\'a str }\n2. 实现 describe 方法返回 "title by author"\n3. 输出 "Rust by Steve"',
        codeTemplate: '// 定义 Book struct（需要生命周期参数）\n\nfn main() {\n    let title = String::from("Rust");\n    let author = String::from("Steve");\n    let book = Book { title: &title, author: &author };\n    println!("{}", book.describe());\n}',
        codeTestCases: [{ input: '', expected: 'Rust by Steve', description: '生命周期实战' }],
        codeHints: ['fn describe(&self) -> String { format!("{} by {}", self.title, self.author) }'],
        solution: 'Rust by Steve',
        explanation: '生命周期确保 struct 中的引用有效。',
      },
    ],
    boss: {
      title: '生命周期挑战',
      description: '定义带生命周期注解的 Excerpt struct，存储字符串引用并实现方法。',
      template: `// TODO: 定义 Excerpt<'a> struct
// 字段: text: &'a str
// 加上 #[derive(Debug)]

// TODO: 为 Excerpt<'a> 实现方法
// new(text: &'a str) -> Self — 创建实例
// get_text(&self) -> &str — 返回 text

fn main() {
    let text = String::from("Hello, lifetime!");
    let excerpt = Excerpt::new(&text);
    println!("Excerpt: {}", excerpt.get_text());
}`,
      steps: [
        '定义 struct Excerpt<\'a> { text: &\'a str }',
        'impl<\'a> Excerpt<\'a> { fn new(text: &\'a str) -> Self { ... } }',
        '实现 get_text(&self) -> &str 返回 self.text',
        '确认输出 "Excerpt: Hello, lifetime!"',
      ],
      hints: [
        '生命周期 \'a 放在 struct 名字后面：struct Excerpt<\'a> { text: &\'a str }',
        'impl 后面也要加 <\'a>：impl<\'a> Excerpt<\'a> { ... }',
        '#[derive(Debug)]\nstruct Excerpt<\'a> { text: &\'a str }\nimpl<\'a> Excerpt<\'a> {\n    fn new(text: &\'a str) -> Self { Excerpt { text } }\n    fn get_text(&self) -> &str { self.text }\n}',
      ],
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
        title: '使用 Result',
        type: 'code',
        lesson: 'Result<T, E> 表示可能成功(Ok)或失败(Err)。用 match 处理。',
        question: '处理 Result',
        codeTask: '1. 定义 parse_number(s: &str) -> Result<i32, String>\n2. 用 s.parse::<i32>() 解析，成功返回 Ok(n)\n3. 失败返回 Err("invalid")\n4. 测试 "42" 和 "abc"',
        codeTemplate: '// 定义 parse_number 函数\n\nfn main() {\n    match parse_number("42") {\n        Ok(n) => println!("Ok: {}", n),\n        Err(e) => println!("Err: {}", e),\n    }\n    match parse_number("abc") {\n        Ok(n) => println!("Ok: {}", n),\n        Err(e) => println!("Err: {}", e),\n    }\n}',
        codeTestCases: [{ input: '', expected: 'Ok: 42\nErr: invalid', description: 'Result 处理' }],
        codeHints: ['fn parse_number(s: &str) -> Result<i32, String> { s.parse::<i32>().map_err(|_| String::from("invalid")) }'],
        solution: 'Ok: 42\nErr: invalid',
        explanation: 'Result 用 Ok 表示成功，Err 表示失败。',
      },
      {
        id: 'w14-l02',
        title: '? 运算符',
        type: 'code',
        lesson: '? 运算符简化错误传播：成功继续，失败提前返回错误。',
        question: '用 ? 运算符',
        codeTask: '1. 定义 parse_and_double(s: &str) -> Result<i32, String>\n2. 用 s.parse::<i32>()? 解析\n3. 返回 Ok(n * 2)\n4. 测试 "21" 输出 "42"',
        codeTemplate: '// 定义 parse_and_double 函数\n// 用 ? 运算符传播错误\n\nfn main() {\n    match parse_and_double("21") {\n        Ok(n) => println!("{}", n),\n        Err(e) => println!("Error: {}", e),\n    }\n}',
        codeTestCases: [{ input: '', expected: '42', description: '? 运算符' }],
        codeHints: ['fn parse_and_double(s: &str) -> Result<i32, String> { let n = s.parse::<i32>().map_err(|_| String::from("invalid"))?; Ok(n * 2) }'],
        solution: '42',
        explanation: '? 自动传播错误，成功时继续执行。',
      },
      {
        id: 'w14-l03',
        title: '自定义错误',
        type: 'code',
        lesson: '可以定义自己的错误类型，用 enum 表示不同错误。',
        question: '定义自定义错误',
        codeTask: '1. 定义 AppError 枚举（NotFound, Invalid）\n2. 定义 find_user(id: i32) -> Result<String, AppError>\n3. id == 1 返回 Ok("Alice")，否则 Err(NotFound)\n4. 输出结果',
        codeTemplate: '// 定义 AppError 枚举\n// 定义 find_user 函数\n\nfn main() {\n    match find_user(1) {\n        Ok(name) => println!("Found: {}", name),\n        Err(_) => println!("Not found"),\n    }\n    match find_user(99) {\n        Ok(name) => println!("Found: {}", name),\n        Err(_) => println!("Not found"),\n    }\n}',
        codeTestCases: [{ input: '', expected: 'Found: Alice\nNot found', description: '自定义错误' }],
        codeHints: ['enum AppError { NotFound, Invalid }', 'fn find_user(id: i32) -> Result<String, AppError> { if id == 1 { Ok(String::from("Alice")) } else { Err(AppError::NotFound) } }'],
        solution: 'Found: Alice\nNot found',
        explanation: 'enum 定义错误类型，Result 传播错误。',
      },
      {
        id: 'w14-l04',
        title: '错误链',
        type: 'code',
        lesson: '? 可以链式调用，多步操作中自动传播错误。',
        question: '链式错误处理',
        codeTask: '1. 定义 process(s: &str) -> Result<i32, String>\n2. 解析为 i32，乘以 2，加 10\n3. 任何步骤失败返回 Err\n4. "16" → "42"',
        codeTemplate: '// 定义 process 函数\n\nfn main() {\n    match process("16") {\n        Ok(n) => println!("{}", n),\n        Err(e) => println!("Error: {}", e),\n    }\n}',
        codeTestCases: [{ input: '', expected: '42', description: '错误链' }],
        codeHints: ['let n = s.parse::<i32>().map_err(|_| String::from("invalid"))?;', 'Ok(n * 2 + 10)'],
        solution: '42',
        explanation: '? 在链式调用中自动传播错误。',
      },
      {
        id: 'w14-l05',
        title: '错误处理实战',
        type: 'code',
        lesson: '综合运用 Result、?、自定义错误。',
        question: '错误处理综合',
        codeTask: '1. 定义 divide(a: f64, b: f64) -> Result<f64, String>\n2. b == 0 返回 Err("division by zero")\n3. 否则返回 Ok(a / b)\n4. 测试 10/3 和 10/0',
        codeTemplate: '// 定义 divide 函数\n\nfn main() {\n    match divide(10.0, 3.0) {\n        Ok(r) => println!("Result: {}", r),\n        Err(e) => println!("Error: {}", e),\n    }\n    match divide(10.0, 0.0) {\n        Ok(r) => println!("Result: {}", r),\n        Err(e) => println!("Error: {}", e),\n    }\n}',
        codeTestCases: [{ input: '', expected: 'Result: 3.3333333333333335\nError: division by zero', description: '错误处理实战' }],
        codeHints: ['fn divide(a: f64, b: f64) -> Result<f64, String> { if b == 0.0 { Err(String::from("division by zero")) } else { Ok(a / b) } }'],
        solution: 'Result: 3.3333333333333335\nError: division by zero',
        explanation: 'Result + match 是 Rust 错误处理的标准模式。',
      },
    ],
    boss: {
      title: '错误处理挑战',
      description: '实现 parse_number 函数，用 Result 和 ? 运算符处理字符串转数字的错误。',
      template: `use std::num::ParseIntError;

// TODO: 实现 parse_number 函数
// 参数: s: &str
// 返回: Result<i32, ParseIntError>
// 函数体: 用 s.parse::<i32>()? 解析，成功返回 Ok(n)

// main 已写好，测试两种情况
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
      steps: [
        '定义 fn parse_number(s: &str) -> Result<i32, ParseIntError>',
        '函数体: let n = s.parse::<i32>()?; Ok(n)',
        '? 运算符自动传播错误',
        '确认输出 "Parsed: 42" 和 "Error: invalid digit found in string"',
      ],
      hints: [
        'Result<T, E> 表示可能成功(Ok)或失败(Err)',
        '? 运算符：成功继续，失败提前返回错误',
        'fn parse_number(s: &str) -> Result<i32, ParseIntError> {\n    let n = s.parse::<i32>()?;\n    Ok(n)\n}',
      ],
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
        type: 'code',
        lesson: 'mod 关键字定义模块，pub 使函数公开，use 引入模块。',
        question: '创建和使用模块',
        codeTask: '1. 定义 math 模块，包含 pub fn add(a: i32, b: i32) -> i32\n2. 用 use math::add 引入\n3. 输出 "Sum: 15"',
        codeTemplate: '// 定义 math 模块\n\nuse math::add;\n\nfn main() {\n    println!("Sum: {}", add(10, 5));\n}',
        codeTestCases: [{ input: '', expected: 'Sum: 15', description: '模块基础' }],
        codeHints: ['mod math { pub fn add(a: i32, b: i32) -> i32 { a + b } }'],
        solution: 'Sum: 15',
        explanation: 'mod 定义模块，pub 公开函数，use 引入使用。',
      },
      {
        id: 'w15-l02',
        title: '模块可见性',
        type: 'code',
        lesson: '默认模块内项是私有的，用 pub 公开。',
        question: '控制模块可见性',
        codeTask: '1. 定义 utils 模块，pub fn greet(name: &str) 输出 "Hello, {name}!"\n2. 私有 fn internal() 返回 42（不直接调用）\n3. pub fn get_value() 调用 internal 并返回\n4. 输出 greet 和 get_value',
        codeTemplate: 'mod utils {\n    fn internal() -> i32 { 42 }\n    // pub fn greet ...\n    // pub fn get_value ...\n}\n\nuse utils::{greet, get_value};\n\nfn main() {\n    greet("Rust");\n    println!("Value: {}", get_value());\n}',
        codeTestCases: [{ input: '', expected: 'Hello, Rust!\nValue: 42', description: '可见性' }],
        codeHints: ['pub fn greet(name: &str) { println!("Hello, {}!", name); }', 'pub fn get_value() -> i32 { internal() }'],
        solution: 'Hello, Rust!\nValue: 42',
        explanation: 'pub 公开函数，私有函数只能在模块内调用。',
      },
      {
        id: 'w15-l03',
        title: '模块实战',
        type: 'code',
        lesson: '综合运用模块、可见性、use。',
        question: '模块综合练习',
        codeTask: '1. 定义 shapes 模块，包含 pub fn circle_area(r: f64) -> f64 和 pub fn rect_area(w: f64, h: f64) -> f64\n2. 用 use 引入两个函数\n3. 输出两个面积',
        codeTemplate: '// 定义 shapes 模块\n\nuse shapes::{circle_area, rect_area};\n\nfn main() {\n    println!("Circle: {}", circle_area(5.0));\n    println!("Rect: {}", rect_area(10.0, 5.0));\n}',
        codeTestCases: [{ input: '', expected: 'Circle: 78.53981633974483\nRect: 50', description: '模块实战' }],
        codeHints: ['mod shapes { pub fn circle_area(r: f64) -> f64 { std::f64::consts::PI * r * r } pub fn rect_area(w: f64, h: f64) -> f64 { w * h } }'],
        solution: 'Circle: 78.53981633974483\nRect: 50',
        explanation: '模块组织代码，pub 控制可见性。',
      },
    ],
    boss: {
      title: '模块挑战',
      description: '创建 math 模块，包含公开的 add 和 subtract 函数，在 main 中使用。',
      template: `// TODO: 定义 math 模块
// mod math {
//     TODO: pub fn add(a: i32, b: i32) -> i32 — 返回 a + b
//     TODO: pub fn subtract(a: i32, b: i32) -> i32 — 返回 a - b
// }

// TODO: 用 use 引入 math 模块的函数

fn main() {
    println!("Add: {}", add(10, 5));
    println!("Subtract: {}", subtract(10, 5));
}`,
      steps: [
        '写 mod math { ... } 模块',
        '在模块内定义 pub fn add 和 pub fn subtract',
        '用 use math::{add, subtract}; 引入',
        '确认输出 "Add: 15" 和 "Subtract: 5"',
      ],
      hints: [
        'mod 模块名 { ... } 定义模块，pub fn 使函数公开',
        'use 路径::{项1, 项2}; 引入模块中的项',
        'mod math {\n    pub fn add(a: i32, b: i32) -> i32 { a + b }\n    pub fn subtract(a: i32, b: i32) -> i32 { a - b }\n}\nuse math::{add, subtract};',
      ],
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
        title: '编写测试',
        type: 'code',
        lesson: '#[test] 标记测试函数，assert_eq! 断言相等。#[cfg(test)] 模块只在测试时编译。',
        question: '编写单元测试',
        codeTask: '1. 实现 add(a: i32, b: i32) -> i32\n2. 写 #[cfg(test)] mod tests 模块\n3. 写 3 个 #[test] 函数验证 add\n4. 所有测试通过（输出为空）',
        codeTemplate: '// 实现 add 函数\n\n// 编写测试模块\n// #[cfg(test)]\n// mod tests {\n//     use super::*;\n//     #[test] fn test1() { assert_eq!(add(2, 3), 5); }\n//     #[test] fn test2() { assert_eq!(add(-1, 1), 0); }\n//     #[test] fn test3() { assert_eq!(add(0, 0), 0); }\n// }',
        codeTestCases: [{ input: '', expected: '', description: '测试通过' }],
        codeHints: ['fn add(a: i32, b: i32) -> i32 { a + b }', '#[cfg(test)] mod tests { use super::*; #[test] fn test1() { assert_eq!(add(2, 3), 5); } }'],
        solution: '',
        explanation: '#[test] 标记测试，assert_eq! 断言相等。',
      },
      {
        id: 'w16-l02',
        title: '测试实战',
        type: 'code',
        lesson: '综合运用测试。',
        question: '测试函数',
        codeTask: '1. 实现 is_even(n: i32) -> bool\n2. 写 3 个测试：is_even(2)=true, is_even(3)=false, is_even(0)=true\n3. 所有测试通过',
        codeTemplate: '// 实现 is_even 函数\n\n// 编写测试',
        codeTestCases: [{ input: '', expected: '', description: '测试通过' }],
        codeHints: ['fn is_even(n: i32) -> bool { n % 2 == 0 }', '#[test] fn test_even() { assert!(is_even(2)); }'],
        solution: '',
        explanation: '测试验证函数行为是否正确。',
      },
    ],
    boss: {
      title: '测试挑战',
      description: '实现 add 函数并编写单元测试，所有测试必须通过。',
      template: `// TODO: 实现 add 函数
// fn add(a: i32, b: i32) -> i32
// 返回 a + b

// TODO: 编写测试模块
// #[cfg(test)]
// mod tests {
//     use super::*;
//     TODO: 3 个 #[test] 函数，用 assert_eq! 验证 add
// }

fn main() {
    println!("Run: cargo test");
}`,
      steps: [
        '实现 fn add(a: i32, b: i32) -> i32 { a + b }',
        '写 #[cfg(test)] mod tests { use super::*; ... }',
        '在 tests 模块中写 3 个 #[test] 函数',
        '每个测试用 assert_eq!(add(参数), 期望值)',
      ],
      hints: [
        '#[test] 标记测试函数，assert_eq!(实际, 期望) 断言相等',
        '#[cfg(test)] 模块只在测试时编译',
        'fn add(a: i32, b: i32) -> i32 { a + b }\n#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn test_positive() { assert_eq!(add(2, 3), 5); }\n    #[test]\n    fn test_negative() { assert_eq!(add(-1, 1), 0); }\n    #[test]\n    fn test_zero() { assert_eq!(add(0, 0), 0); }\n}',
      ],
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
        title: '迭代器基础',
        type: 'code',
        lesson: 'iter() 创建迭代器，map 转换元素，filter 过滤，sum 求和。',
        question: '使用迭代器',
        codeTask: '1. 创建 vec![1, 2, 3, 4, 5]\n2. 用 iter().sum() 求和\n3. 输出 "Sum: 15"',
        codeTemplate: 'fn main() {\n    let v = vec![1, 2, 3, 4, 5];\n    // 用 iter().sum() 求和\n    \n}',
        codeTestCases: [{ input: '', expected: 'Sum: 15', description: '迭代器求和' }],
        codeHints: ['let total: i32 = v.iter().sum();', 'println!("Sum: {}", total);'],
        solution: 'Sum: 15',
        explanation: 'iter().sum() 是便捷的求和方法。',
      },
      {
        id: 'w17-l02',
        title: 'map 转换',
        type: 'code',
        lesson: 'map() 对每个元素应用闭包，返回新迭代器。',
        question: '用 map 转换元素',
        codeTask: '1. 创建 vec![1, 2, 3]\n2. 用 map(|x| x * 2) 翻倍\n3. collect 收集为 Vec\n4. 输出 "[2, 4, 6]"',
        codeTemplate: 'fn main() {\n    let v = vec![1, 2, 3];\n    // 用 map 翻倍\n    \n}',
        codeTestCases: [{ input: '', expected: '[2, 4, 6]', description: 'map 转换' }],
        codeHints: ['let doubled: Vec<i32> = v.iter().map(|x| x * 2).collect();', 'println!("{:?}", doubled);'],
        solution: '[2, 4, 6]',
        explanation: 'map 转换每个元素，collect 收集结果。',
      },
      {
        id: 'w17-l03',
        title: 'filter 过滤',
        type: 'code',
        lesson: 'filter() 保留满足条件的元素。',
        question: '用 filter 过滤',
        codeTask: '1. 创建 vec![1, 2, 3, 4, 5, 6]\n2. 用 filter 过滤偶数\n3. 输出 "[2, 4, 6]"',
        codeTemplate: 'fn main() {\n    let v = vec![1, 2, 3, 4, 5, 6];\n    // 过滤偶数\n    \n}',
        codeTestCases: [{ input: '', expected: '[2, 4, 6]', description: 'filter 过滤' }],
        codeHints: ['let even: Vec<&i32> = v.iter().filter(|&&x| x % 2 == 0).collect();', 'println!("{:?}", even);'],
        solution: '[2, 4, 6]',
        explanation: 'filter 保留满足条件的元素。',
      },
      {
        id: 'w17-l04',
        title: '迭代器链',
        type: 'code',
        lesson: '迭代器方法可以链式调用，形成数据处理管道。',
        question: '链式调用',
        codeTask: '1. 创建 vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n2. 过滤偶数 → 平方 → 求和\n3. 输出 "220"',
        codeTemplate: 'fn main() {\n    let v = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n    // 迭代器链: filter → map → sum\n    \n}',
        codeTestCases: [{ input: '', expected: '220', description: '迭代器链' }],
        codeHints: ['v.iter().filter(|&&x| x % 2 == 0).map(|&x| x * x).sum()'],
        solution: '220',
        explanation: '迭代器链式调用，一行完成复杂数据处理。',
      },
      {
        id: 'w17-l05',
        title: '迭代器实战',
        type: 'code',
        lesson: '综合运用迭代器。',
        question: '迭代器综合',
        codeTask: '1. 创建 names = vec!["Alice", "Bob", "Charlie"]\n2. 用 filter 过滤长度 > 3 的名字\n3. 用 map 转为大写\n4. 输出 "["ALICE", "CHARLIE"]"',
        codeTemplate: 'fn main() {\n    let names = vec!["Alice", "Bob", "Charlie"];\n    // 过滤长度 > 3，转大写\n    \n}',
        codeTestCases: [{ input: '', expected: '["ALICE", "CHARLIE"]', description: '迭代器实战' }],
        codeHints: ['names.iter().filter(|n| n.len() > 3).map(|n| n.to_uppercase()).collect()'],
        solution: '["ALICE", "CHARLIE"]',
        explanation: '迭代器链处理字符串数据。',
      },
    ],
    boss: {
      title: '迭代器挑战',
      description: '用迭代器链过滤偶数、计算平方、求和。',
      template: `fn main() {
    let v = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // TODO: 用迭代器链计算偶数的平方和
    // v.iter() → filter 偶数 → map 平方 → sum 求和
    let sum: i32 = 0; // ← 替换为迭代器链

    println!("Sum of even squares: {}", sum);
}`,
      steps: [
        'v.iter() 创建迭代器',
        '.filter(|&&x| x % 2 == 0) 过滤偶数',
        '.map(|&x| x * x) 计算平方',
        '.sum() 求和',
      ],
      hints: [
        '迭代器链：v.iter().filter(条件).map(转换).sum()',
        'filter 闭包：|&&x| x % 2 == 0，map 闭包：|&x| x * x',
        'v.iter().filter(|&&x| x % 2 == 0).map(|&x| x * x).sum()',
      ],
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
        title: '闭包基础',
        type: 'code',
        lesson: '闭包用 |参数| 表达式 定义，可以捕获环境变量。',
        question: '使用闭包',
        codeTask: '1. 定义闭包 double = |x| x * 2\n2. 调用 double(5) 输出 "10"\n3. 定义闭包 add = |a, b| a + b\n4. 调用 add(3, 4) 输出 "7"',
        codeTemplate: 'fn main() {\n    // 定义闭包\n    \n    // 调用\n}',
        codeTestCases: [{ input: '', expected: '10\n7', description: '闭包基础' }],
        codeHints: ['let double = |x| x * 2;', 'println!("{}", double(5));'],
        solution: '10\n7',
        explanation: '|x| x * 2 是闭包，类似匿名函数。',
      },
      {
        id: 'w18-l02',
        title: '捕获环境',
        type: 'code',
        lesson: '闭包可以捕获定义时环境中的变量。',
        question: '闭包捕获变量',
        codeTask: '1. 创建 x = 10\n2. 定义闭包 add_x = |y| x + y\n3. 调用 add_x(5) 输出 "15"',
        codeTemplate: 'fn main() {\n    let x = 10;\n    // 闭包捕获 x\n    \n}',
        codeTestCases: [{ input: '', expected: '15', description: '捕获环境' }],
        codeHints: ['let add_x = |y| x + y;', 'println!("{}", add_x(5));'],
        solution: '15',
        explanation: '闭包自动捕获外部变量。',
      },
      {
        id: 'w18-l03',
        title: '闭包与迭代器',
        type: 'code',
        lesson: '闭包常与迭代器配合使用。',
        question: '闭包 + 迭代器',
        codeTask: '1. 创建 vec![1, 2, 3, 4, 5]\n2. 用闭包 filter 偶数，map 翻倍\n3. 输出 "[4, 8]"',
        codeTemplate: 'fn main() {\n    let v = vec![1, 2, 3, 4, 5];\n    // 闭包 + 迭代器\n    \n}',
        codeTestCases: [{ input: '', expected: '[4, 8]', description: '闭包迭代器' }],
        codeHints: ['v.iter().filter(|&&x| x % 2 == 0).map(|&x| x * 2).collect()'],
        solution: '[4, 8]',
        explanation: '闭包是迭代器的常用搭配。',
      },
      {
        id: 'w18-l04',
        title: '闭包实战',
        type: 'code',
        lesson: '综合运用闭包。',
        question: '闭包综合',
        codeTask: '1. 定义 apply<F: Fn(i32) -> i32>(f: F, x: i32) -> i32\n2. 用 apply(double, 5) 输出 "10"\n3. 用 apply(triple, 5) 输出 "15"',
        codeTemplate: '// 定义 apply 函数\n\nfn main() {\n    let double = |x| x * 2;\n    let triple = |x| x * 3;\n    println!("{}", apply(double, 5));\n    println!("{}", apply(triple, 5));\n}',
        codeTestCases: [{ input: '', expected: '10\n15', description: '闭包实战' }],
        codeHints: ['fn apply<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 { f(x) }'],
        solution: '10\n15',
        explanation: '泛型 F: Fn 接受闭包参数。',
      },
    ],
    boss: {
      title: '闭包挑战',
      description: '用闭包实现一个计数器，每次调用递增并返回当前值。',
      template: `fn main() {
    let mut count = 0;

    // TODO: 创建闭包 increment
    // 用 || { ... } 语法，捕获 count
    // 每次调用: count += 1，返回 count
    // 需要 let mut 声明闭包

    // println!("Count: {}", increment());
    // println!("Count: {}", increment());
    // println!("Count: {}", increment());
}`,
      steps: [
        '声明 let mut count = 0',
        '写 let mut increment = || { count += 1; count };',
        '取消注释三个 println! 调用',
        '确认输出 Count: 1, 2, 3',
      ],
      hints: [
        '闭包用 |参数| { 函数体 } 定义，|| 表示无参数',
        '闭包可以捕获外部变量，修改需要 let mut',
        'let mut increment = || { count += 1; count };\nprintln!("Count: {}", increment());\nprintln!("Count: {}", increment());\nprintln!("Count: {}", increment());',
      ],
      validation: {
        required: ['||', 'println!'],
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
        title: 'Box 智能指针',
        type: 'code',
        lesson: 'Box<T> 在堆上分配数据。用于递归类型和大数据。',
        question: '使用 Box',
        codeTask: '1. 创建 Box::new(42)\n2. 解引用 *x 获取值\n3. 输出 "Value: 42"',
        codeTemplate: 'fn main() {\n    let x = Box::new(42);\n    // 解引用\n    \n}',
        codeTestCases: [{ input: '', expected: 'Value: 42', description: 'Box 基础' }],
        codeHints: ['println!("Value: {}", *x); — * 解引用'],
        solution: 'Value: 42',
        explanation: 'Box 在堆上分配，* 解引用获取值。',
      },
      {
        id: 'w19-l02',
        title: 'Rc 共享所有权',
        type: 'code',
        lesson: 'Rc<T> 允许多个所有者共享数据。',
        question: '使用 Rc',
        codeTask: '1. 创建 Rc::new(5)\n2. 克隆两次 Rc::clone\n3. 输出引用计数 "Count: 3"',
        codeTemplate: 'use std::rc::Rc;\n\nfn main() {\n    let a = Rc::new(5);\n    let b = Rc::clone(&a);\n    let c = Rc::clone(&a);\n    // 输出引用计数\n    \n}',
        codeTestCases: [{ input: '', expected: 'Count: 3', description: 'Rc 引用计数' }],
        codeHints: ['println!("Count: {}", Rc::strong_count(&a));'],
        solution: 'Count: 3',
        explanation: 'Rc::clone 增加引用计数，strong_count 查看计数。',
      },
      {
        id: 'w19-l03',
        title: '智能指针实战',
        type: 'code',
        lesson: '综合运用 Box 和 Rc。',
        question: '智能指针综合',
        codeTask: '1. 用 Box 创建递归链表 List::Cons(1, Box::new(List::Cons(2, Box::new(List::Nil))))\n2. 遍历链表求和\n3. 输出 "Sum: 3"',
        codeTemplate: '// 定义 List 枚举\n\nfn main() {\n    let list = List::Cons(1, Box::new(List::Cons(2, Box::new(List::Nil))));\n    println!("Sum: {}", sum_list(&list));\n}',
        codeTestCases: [{ input: '', expected: 'Sum: 3', description: '链表求和' }],
        codeHints: ['enum List { Cons(i32, Box<List>), Nil }', 'fn sum_list(list: &List) -> i32 { match list { List::Cons(v, next) => v + sum_list(next), List::Nil => 0 } }'],
        solution: 'Sum: 3',
        explanation: 'Box 递归类型，match 遍历链表。',
      },
    ],
    boss: {
      title: '智能指针挑战',
      description: '用 Rc 实现共享所有权的链表，验证引用计数。',
      template: `use std::rc::Rc;

// TODO: 定义 List 枚举
// Cons(i32, Rc<List>) — 带值和共享的下一个节点
// Nil — 空节点

// use List::{Cons, Nil};

fn main() {
    // TODO: 创建链表 a = Cons(5, Cons(10, Nil))
    // 用 Rc::new 包装

    // TODO: 用 Rc::clone 创建 b 和 c，共享 a
    // let b = Cons(3, Rc::clone(&a));
    // let c = Cons(4, Rc::clone(&a));

    // 输出引用计数（应为 3）
    // println!("a refcount: {}", Rc::strong_count(&a));
}`,
      steps: [
        '定义 enum List { Cons(i32, Rc<List>), Nil }',
        'use List::{Cons, Nil};',
        '创建 a = Rc::new(Cons(5, Rc::new(Cons(10, Rc::new(Nil)))))',
        '用 Rc::clone 创建 b 和 c，输出引用计数',
      ],
      hints: [
        'Rc::new() 创建引用计数智能指针，Rc::clone() 共享所有权',
        'Rc::strong_count(&a) 返回当前引用数量',
        'enum List { Cons(i32, Rc<List>), Nil }\nuse List::{Cons, Nil};\nlet a = Rc::new(Cons(5, Rc::new(Cons(10, Rc::new(Nil)))));\nlet b = Cons(3, Rc::clone(&a));\nlet c = Cons(4, Rc::clone(&a));\nprintln!("a refcount: {}", Rc::strong_count(&a));',
      ],
      validation: {
        required: ['Rc', 'enum List', 'println!'],
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
        title: '多线程基础',
        type: 'code',
        lesson: 'thread::spawn 创建线程，join 等待完成。Arc<Mutex<T>> 共享可变数据。',
        question: '使用多线程',
        codeTask: '1. 创建 Arc::new(Mutex::new(0)) 计数器\n2. spawn 3 个线程，每个 +1\n3. join 所有线程\n4. 输出 "Result: 3"',
        codeTemplate: 'use std::sync::{Arc, Mutex};\nuse std::thread;\n\nfn main() {\n    let counter = Arc::new(Mutex::new(0));\n    let mut handles = vec![];\n    // 创建 3 个线程\n    \n    // join 所有线程\n    \n    // 输出结果\n}',
        codeTestCases: [{ input: '', expected: 'Result: 3', description: '多线程计数' }],
        codeHints: ['for _ in 0..3 { let c = Arc::clone(&counter); handles.push(thread::spawn(move || { *c.lock().unwrap() += 1; })); }'],
        solution: 'Result: 3',
        explanation: 'Arc<Mutex<T>> 是线程间共享可变数据的标准模式。',
      },
      {
        id: 'w20-l02',
        title: '线程实战',
        type: 'code',
        lesson: '综合运用多线程。',
        question: '线程综合',
        codeTask: '1. 创建 5 个线程，每个计算 i*i\n2. 收集结果到 Vec\n3. 输出 "Squares: [0, 1, 4, 9, 16]"',
        codeTemplate: 'use std::thread;\n\nfn main() {\n    let mut handles = vec![];\n    // 创建 5 个线程\n    \n    // 收集结果\n    \n}',
        codeTestCases: [{ input: '', expected: 'Squares: [0, 1, 4, 9, 16]', description: '线程实战' }],
        codeHints: ['for i in 0..5 { handles.push(thread::spawn(move || i * i)); }', 'let results: Vec<i32> = handles.into_iter().map(|h| h.join().unwrap()).collect();'],
        solution: 'Squares: [0, 1, 4, 9, 16]',
        explanation: '线程返回值通过 join 获取。',
      },
    ],
    boss: {
      title: '并发挑战',
      description: '用多线程共享可变计数器：5 个线程各加 1，输出最终结果。',
      template: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    // TODO: 创建 Arc<Mutex<i32>> 计数器，初始值 0
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    // TODO: 循环 5 次，每次:
    // 1. Arc::clone 克隆计数器
    // 2. thread::spawn 创建线程
    // 3. 在线程中 lock() 获取锁，*num += 1

    // TODO: 等待所有线程完成 (join)

    // TODO: 输出最终计数值
    // println!("Result: {}", *counter.lock().unwrap());
}`,
      steps: [
        '创建 Arc::new(Mutex::new(0)) 共享计数器',
        'for 循环 5 次，每次 Arc::clone + thread::spawn',
        '线程内: counter.lock().unwrap() 获取锁，*num += 1',
        '遍历 handles 调用 join()，输出 *counter.lock().unwrap()',
      ],
      hints: [
        'Arc<Mutex<T>> 是线程间共享可变数据的标准模式',
        'lock() 获取 Mutex 锁，返回 MutexGuard，用 * 解引用修改值',
        'let counter = Arc::new(Mutex::new(0));\nlet mut handles = vec![];\nfor _ in 0..5 {\n    let counter = Arc::clone(&counter);\n    let handle = thread::spawn(move || {\n        let mut num = counter.lock().unwrap();\n        *num += 1;\n    });\n    handles.push(handle);\n}\nfor handle in handles { handle.join().unwrap(); }\nprintln!("Result: {}", *counter.lock().unwrap());',
      ],
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
        title: 'async/await',
        type: 'code',
        lesson: 'async fn 定义异步函数，.await 等待结果，tokio::join! 并发执行。',
        question: '使用 async/await',
        codeTask: '1. 定义 async fn fetch_data() -> String 返回 "data"\n2. 用 tokio::join! 并发执行两个异步任务\n3. 输出 "Data1: data, Data2: data"',
        codeTemplate: '// 定义 async fn\n\n#[tokio::main]\nasync fn main() {\n    // 并发执行\n    \n}',
        codeTestCases: [{ input: '', expected: 'Data1: data, Data2: data', description: 'async/await' }],
        codeHints: ['async fn fetch_data() -> String { String::from("data") }', 'let (a, b) = tokio::join!(fetch_data(), fetch_data());'],
        solution: 'Data1: data, Data2: data',
        explanation: 'async/await 是 Rust 异步编程的核心。',
      },
      {
        id: 'w21-l02',
        title: '异步实战',
        type: 'code',
        lesson: '综合运用 async/await。',
        question: '异步综合',
        codeTask: '1. 定义 async fn fetch_user() -> String 和 async fn fetch_score() -> i32\n2. 并发执行\n3. 输出 "User: Alice, Score: 100"',
        codeTemplate: '// 定义两个 async fn\n\n#[tokio::main]\nasync fn main() {\n    // 并发执行\n    \n}',
        codeTestCases: [{ input: '', expected: 'User: Alice, Score: 100', description: '异步实战' }],
        codeHints: ['async fn fetch_user() -> String { String::from("Alice") }', 'async fn fetch_score() -> i32 { 100 }'],
        solution: 'User: Alice, Score: 100',
        explanation: 'tokio::join! 并发执行多个异步任务。',
      },
    ],
    boss: {
      title: '异步挑战',
      description: '用 async/await 和 tokio 并发执行两个异步任务。',
      template: `// TODO: 定义 async fn fetch_user() -> String
// 返回 String::from("Alice")

// TODO: 定义 async fn fetch_score() -> i32
// 返回 100

// TODO: 用 #[tokio::main] 标记 main
// async fn main() {
//     用 tokio::join! 并发执行两个函数
//     输出 "User: Alice, Score: 100"
// }`,
      steps: [
        '定义 async fn fetch_user() -> String { String::from("Alice") }',
        '定义 async fn fetch_score() -> i32 { 100 }',
        '#[tokio::main] async fn main() { ... }',
        '用 tokio::join!(fetch_user(), fetch_score()) 并发执行',
      ],
      hints: [
        'async fn 定义异步函数，#[tokio::main] 启动运行时',
        'tokio::join!(f1, f2) 并发执行多个 Future',
        'async fn fetch_user() -> String { String::from("Alice") }\nasync fn fetch_score() -> i32 { 100 }\n#[tokio::main]\nasync fn main() {\n    let (user, score) = tokio::join!(fetch_user(), fetch_score());\n    println!("User: {}, Score: {}", user, score);\n}',
      ],
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
        title: 'unsafe 基础',
        type: 'code',
        lesson: 'unsafe 块允许解引用裸指针、调用 unsafe fn 等底层操作。',
        question: '使用 unsafe',
        codeTask: '1. 创建裸指针 r = &mut x as *mut i32\n2. 在 unsafe 块中解引用 *r\n3. 输出 "Value: 42"',
        codeTemplate: 'fn main() {\n    let mut x = 42;\n    let r = &mut x as *mut i32;\n    // unsafe 解引用\n    \n}',
        codeTestCases: [{ input: '', expected: 'Value: 42', description: 'unsafe 基础' }],
        codeHints: ['unsafe { println!("Value: {}", *r); }'],
        solution: 'Value: 42',
        explanation: 'unsafe 块允许解引用裸指针。',
      },
      {
        id: 'w22-l02',
        title: 'unsafe 实战',
        type: 'code',
        lesson: '综合运用 unsafe。',
        question: 'unsafe 综合',
        codeTask: '1. 创建裸指针，解引用获取值\n2. 用 unsafe 调用 extern "C" fn abs(-5)\n3. 输出 "Value: 42, Abs: 5"',
        codeTemplate: 'extern "C" { fn abs(input: i32) -> i32; }\n\nfn main() {\n    let mut x = 42;\n    let r = &mut x as *mut i32;\n    // unsafe 解引用和调用 extern\n    \n}',
        codeTestCases: [{ input: '', expected: 'Value: 42, Abs: 5', description: 'unsafe 实战' }],
        codeHints: ['unsafe { println!("Value: {}, Abs: {}", *r, abs(-5)); }'],
        solution: 'Value: 42, Abs: 5',
        explanation: 'unsafe 用于底层操作，应尽量封装在安全 API 中。',
      },
    ],
    boss: {
      title: 'unsafe 挑战',
      description: '使用裸指针和 extern 函数，体验 unsafe Rust 的底层操作。',
      template: `// TODO: 声明 extern C 函数 abs(input: i32) -> i32
// extern "C" { fn abs(input: i32) -> i32; }

fn main() {
    let mut x = 42;

    // TODO: 创建可变裸指针 r = &mut x as *mut i32

    // TODO: 在 unsafe 块中:
    // 解引用 r 打印值
    // 调用 abs(-5) 打印绝对值
}`,
      steps: [
        '写 extern "C" { fn abs(input: i32) -> i32; }',
        'let r = &mut x as *mut i32 创建裸指针',
        'unsafe { println!("Value: {}", *r); } 解引用',
        'unsafe { println!("Abs: {}", abs(-5)); } 调用 extern 函数',
      ],
      hints: [
        'extern "C" 声明 C 函数，需要 unsafe 块调用',
        'as *mut i32 创建可变裸指针，*r 解引用',
        'extern "C" { fn abs(input: i32) -> i32; }\nlet mut x = 42;\nlet r = &mut x as *mut i32;\nunsafe {\n    println!("Value: {}", *r);\n    println!("Abs: {}", abs(-5));\n}',
      ],
      validation: {
        required: ['unsafe', '*mut', 'extern', 'println!'],
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
        title: '综合实战',
        type: 'code',
        lesson: '综合运用所有学过的知识。',
        question: '构建完整程序',
        codeTask: '1. 定义 AppError 枚举（IoError, ParseError）\n2. 实现 run 函数，读取数据、处理、输出\n3. main 中用 if let Err 处理错误\n4. 输出 "Lines: 3\n1: hello\n2: world\n3: rust"',
        codeTemplate: '// 定义 AppError\n// 实现 run 函数\n\nfn main() {\n    if let Err(e) = run() {\n        eprintln!("Error: {:?}", e);\n        std::process::exit(1);\n    }\n}',
        codeTestCases: [{ input: '', expected: 'Lines: 3\n1: hello\n2: world\n3: rust', description: '综合实战' }],
        codeHints: ['run 函数内用 lines.collect() 处理数据', 'enum AppError { IoError(String), ParseError(String) }'],
        solution: 'Lines: 3\n1: hello\n2: world\n3: rust',
        explanation: '综合运用错误处理、数据处理、输出格式化。',
      },
    ],
    boss: {
      title: '最终挑战',
      description: '构建一个完整的 CLI 工具：自定义错误类型、run 函数、错误处理。',
      template: `use std::fs;

// TODO: 定义 AppError 枚举
// 变体: IoError(std::io::Error)
// 变体: ParseError(String)

// TODO: 为 AppError 实现 From<std::io::Error>
// impl From<std::io::Error> for AppError { ... }

// TODO: 实现 run 函数
// fn run() -> Result<(), AppError>
// 读取 "data.txt"（不存在则用默认文本）
// 统计行数并逐行输出

fn main() {
    if let Err(e) = run() {
        eprintln!("Error: {:?}", e);
        std::process::exit(1);
    }
}`,
      steps: [
        '定义 enum AppError { IoError(std::io::Error), ParseError(String) }',
        'impl From<std::io::Error> for AppError',
        '实现 fn run() -> Result<(), AppError> — 读文件、统计行数、输出',
        'main 中用 if let Err(e) = run() 处理错误',
      ],
      hints: [
        'From trait 实现类型转换：impl From<源类型> for 目标类型',
        'fs::read_to_string 读文件，.unwrap_or_else 处理不存在',
        'enum AppError {\n    IoError(std::io::Error),\n    ParseError(String),\n}\nimpl From<std::io::Error> for AppError {\n    fn from(e: std::io::Error) -> Self { AppError::IoError(e) }\n}\nfn run() -> Result<(), AppError> {\n    let content = fs::read_to_string("data.txt")\n        .unwrap_or_else(|_| String::from("No file found"));\n    let lines: Vec<&str> = content.lines().collect();\n    println!("Lines: {}", lines.len());\n    for (i, line) in lines.iter().enumerate() {\n        println!("{}: {}", i + 1, line);\n    }\n    Ok(())\n}',
      ],
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
