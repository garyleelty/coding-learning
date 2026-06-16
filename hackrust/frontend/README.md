# HackRust Frontend

HackRust 是一个新手友好的 Rust 学习游戏。玩家先看简短解释，再做选择、填空、排序、判断题，最后在每个世界末尾通过 Boss 战把知识点组合成一个小程序。

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Zustand 持久化存档

## 本地开发

```bash
npm install
npm run dev
```

## 验证与构建

```bash
npm run lint
npm run build
```

## 项目结构

```txt
src/
  components/   通用 UI 组件，如 HPBar、Feedback、CodeBlock
  data/         世界、关卡、Boss 数据
  game/         XP、伤害、代码校验等纯逻辑
  pages/        Home、WorldMap、Level、Boss 页面
  store/        Zustand 游戏存档与动作
  types.ts      核心类型定义
```

## 游戏机制

- 小关卡支持四种题型：选择、填空、排序、判断。
- 每个小关卡可以包含 `lesson` 教学说明和 `hint` 答错提示。
- 正确答题获得 XP，并提升 combo。
- 错误答题会重置 combo。
- 完成一个世界的全部小关卡后解锁 Boss 战。
- Boss 战会对用户输入的 Rust 代码做基础语法检查、规则检查和静态输出模拟。
- 玩家获得 XP 时会维护连续学习天数 streak。

## 新手友好原则

- 少用术语，先用人话解释概念。
- 每关只讲一个小点。
- 先看例子，再做题。
- Boss 战保留模板，避免一开始就要求完整手写程序。
- 答错时给“原因 + 提示”，鼓励继续尝试。

## Boss 校验说明

当前 Boss 校验是前端 MVP 版本：

1. 检查代码是否为空。
2. 检查花括号、圆括号和 `fn main` 的基本结构。
3. 检查 required / forbidden 字符串规则。
4. 提取简单的 `print!("...")` / `println!("...")` 字符串字面量，模拟 stdout。
5. 将模拟输出与测试用例的 expected 输出进行比较。

限制：暂不执行真实 Rust，也不支持变量、格式化参数或复杂表达式输出。后续可以升级为后端 Rust sandbox。

## 后续方向

- 为 `game/` 纯逻辑增加单元测试。
- 将世界数据按文件拆分，避免 `worlds.ts` 过大。
- 接入真实 Rust 执行沙箱，支持更完整的代码验证。
- 增加复习队列、错题本和学习 streak 奖励。
