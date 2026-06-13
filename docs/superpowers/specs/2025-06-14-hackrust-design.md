# HackRust — 赛博黑客 Rust 学习游戏

> 一个面向编程小白的 Rust 语言学习网站，采用 RPG 赛博黑客主题的游戏化教学模式。

## 1. 概述

### 1.1 产品定位
- **目标用户：** 零编程基础的中文用户，想通过有趣的方式学习 Rust
- **核心价值：** 把 Rust 学习变成 RPG 游戏，让编程入门不再枯燥
- **实现方式：** 纯前端 SPA，无后端依赖，Rust 代码编译到 WASM 运行

### 1.2 核心理念
用户真正在意的只有三件事：
1. **"下一步该做什么？"** — 清晰的路径指引，永不困惑
2. **"我做对了吗？"** — 即时、明确、有解释的反馈
3. **"我进步了吗？"** — 持续的进步感驱动学习

## 2. 世界观与主题

### 2.1 赛博黑客世界
- 用户扮演一名赛博空间的黑客，用 Rust 编程语言逐步解锁更强的网络渗透能力
- 视觉风格：暗黑赛博（Dark Cyber），深蓝 `#16213e` / 红色 `#e94560` / 深蓝紫 `#0f3460` 配色
- UI 语言：终端感 + 霓虹光效，代码编辑器即战斗画面

### 2.2 RPG 元素
- **经验值 (XP)：** 完成关卡获得，积累升级
- **等级：** 每升一级解锁新的世界/能力
- **HP：** Boss 战中的生命值，答错扣血，归零则 Boss 战失败
- **连击 (Combo)：** 连续答对获得额外 XP 加成
- **连胜 (Streak)：** 每日连续学习记录

## 3. 课程体系

### 3.1 课程结构

| Phase | 主题 | 世界数 | 关卡数 | Boss 战 |
|-------|------|--------|--------|---------|
| Phase 0 | 登入赛博世界 | 1 | 5 关 | 首个程序 |
| Phase 1 | 基础协议 | 5 | ~42 关 | 5 场 |
| Phase 2 | 内存权限 | 5 | ~40 关 | 5 场 |
| Phase 3 | 抽象武器 | 4 | ~34 关 | 4 场 |
| Phase 4 | 高级装备 | 5 | ~36 关 | 5 场 |
| Phase 5 | 网络渗透 | 3 | ~26 关 | 3 场 |
| Phase 6 | 终极任务 | 1 | ~8 关 | 最终 Boss 战 |

**总计：24 个世界 · ~190 小关卡 · 24 场 Boss 战**

### 3.2 完整世界列表

**Phase 0 — 登入赛博世界**
- W00: 终端连接 — 编程是什么、计算机基础、Rust 简介

**Phase 1 — 基础协议**
- W01: 变量·数据工厂 — 变量、可变性、常量、基本类型、shadowing
- W02: 运算符·指令解码 — 算术运算、比较、布尔逻辑、位运算、类型转换
- W03: 流程控制·中枢系统 — if/else、loop、while、for、break/continue、match 入门
- W04: 集合类型·数据仓库 — 元组、数组、slice、Vec、HashMap、String
- W05: 函数·武器指令集 — 函数定义、参数、返回值、表达式 vs 语句

**Phase 2 — 内存权限**
- W06: 所有权·资源主权 — 栈 vs 堆、所有权规则、移动语义、Clone/Copy
- W07: 借用·引用访问 — 不可变引用、可变引用、借用规则、悬垂引用
- W08: 切片·数据快照 — 字符串切片、数组切片、&str
- W09: struct·数据结构体 — struct 定义、impl、tuple struct
- W10: 枚举·状态路由 — enum、match、Option、if let

**Phase 3 — 抽象武器**
- W11: 泛型·通用代码 — 泛型函数/struct/enum、泛型约束
- W12: Trait·协议接口 — trait 定义、默认方法、trait bound、impl Trait
- W13: 生命周期·借用时效 — 生命周期注解、省略规则、'static
- W14: 错误处理·故障恢复 — panic、Result、? 运算符、自定义错误

**Phase 4 — 高级装备**
- W15: 模块系统·代码组织 — mod、pub、use、模块树、文件分层
- W16: 测试·质量保障 — #[test]、assert、单元测试、集成测试
- W17: 迭代器·数据流管道 — Iterator、map/filter/fold、闭包入门
- W18: 闭包·匿名函数 — 闭包语法、Fn/FnMut/FnOnce、move
- W19: 智能指针·内存装备 — Box、Deref、Drop、Rc、RefCell

**Phase 5 — 网络渗透**
- W20: 并发·多线程攻防 — thread、mpsc、Mutex/Arc、Send/Sync
- W21: 异步编程·异步突袭 — async/await、Future、tokio
- W22: 不安全 Rust·底层操作 — unsafe、裸指针、FFI

**Phase 6 — 终极任务**
- W23: 综合实战·赛博渗透 — 完整 CLI 渗透测试工具构建

## 4. 游戏机制与玩法

### 4.1 两种关卡类型

**小关卡（引导式 · 占 70%）**
- **选择题：** 选出正确的 Rust 代码/概念
- **填空题：** 从选项拖拽补全代码
- **排序题：** 将打乱的代码行排成正确顺序
- **判断题：** 判断代码是否正确

**Boss 战（自由编码 · 占 30%）**
- 进入编码战场：分屏布局（左：任务描述 | 右：代码编辑器）
- Boss 给出编程任务，用户在编辑器中写真正的 Rust 代码
- 代码通过 `syn` WASM 解析验证即击杀 Boss
- HP 机制：多次尝试允许，每次错误提交 Boss 回击扣血

### 4.2 战斗系统

**小关卡战斗：**
- 答对：获得 XP + 金币，连击计数 +1
- 答错：连击中断，显示解释，不扣 HP
- 连续答对 3/5/10 题触发 Combo 加成

**Boss 战流程：**
1. Boss 登场（带 HP 条和攻击动画）
2. Boss 释放"攻击"（展示编程任务）
3. 用户编写代码并提交
4. syn WASM 验证：
   - ✅ 通过 → 对 Boss 造成伤害
   - ❌ 失败 → Boss 反击，用户扣 HP
5. 重复直到 Boss HP 归零 或 用户 HP 归零
6. 胜利：获得大量 XP 和成就徽章

**Boss 战数值设计：**
- 用户初始 HP：100（所有 Boss 战统一）
- 每次错误提交扣血：10 HP（即允许 10 次失误）
- Boss HP：随难度递增（W01 Boss: 30 HP，W05 Boss: 80 HP）
- 每次正确提交对 Boss 造成固定 10 点伤害
- 无回血机制，但提供"撤退"选项（放弃本次 Boss 战，不扣连胜）
- Combo 加成：连续正确提交 3/5 次，伤害提升至 15/20

### 4.3 学习辅助机制
- 每个新概念先展示带逐行注释的示例代码
- 答错后自动显示简短解释（< 2 句话）
- 连续答错 2 次 → 给出提示；连续答错 3 次 → 显示答案并自动解锁（标记"需复习"）
- 知识手册可随时查阅已学内容

**"需复习"标记机制：**
- 被标记的关卡在世界地图上显示特殊图标（如 🔁）
- 知识手册中对应知识点显示"薄弱"标签
- 用户可在黑客档案页查看所有"需复习"关卡列表
- 复习后重新答对 2 次 → 清除标记
- 不强制复习，但通过图标提示引导用户主动回顾

## 5. 功能优先级

### P0 — 必需（核心循环必须完整）
- 关卡答题核心循环（选题 → 答题 → 反馈 → 下一题）
- Boss 编码战场（编辑器 + syn WASM 验证）
- 即时正误反馈 + 简短解释
- 进度持久化（localStorage）

### P1 — 重要（提升留存与体验）
- 世界地图/关卡树
- 连击/连胜 (Streak)
- 经验值/等级系统
- 知识手册
- Boss 战动画（HP 条、攻击/胜利/失败反馈）

### P2 — 加分（后续迭代）
- 黑客档案页
- 成就/徽章系统
- 音效 (Web Audio API)
- 排行榜
- 每日挑战任务
- 首页动画

## 6. 页面结构

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 可直接进入地图（跳过介绍） |
| `/worlds` | 世界列表 | Phase 分组展示所有世界 |
| `/worlds/:id` | 世界地图 | 左侧世界列表 + 右侧关卡节点树 |
| `/worlds/:id/level/:n` | 小关卡 | 答题页面 |
| `/worlds/:id/boss` | Boss 战场 | 分屏编码挑战 |
| `/reference` | 知识手册 | 知识点索引与查阅 |
| `/profile` | 黑客档案 | 等级、成就、统计 |

**用户核心行为流：**
```
启动 → 世界地图 → 下一关 → 答题 → 反馈 → 下一题/下一关
Boss 关 → 读题 → 写代码 → 验证 → 看结果
```

## 7. 技术架构

### 7.1 技术栈
- **前端框架：** Vite + React + TypeScript
- **样式：** Tailwind CSS
- **动画：** CSS Animations + Framer Motion
- **持久化：** localStorage
- **状态管理：** Zustand（轻量、TypeScript 友好）
- **WASM crate 1 — game-engine（~500KB，可选）：** XP 等级公式、Boss 战伤害计算；MVP 阶段可用纯 JS 实现，后续按需迁移至 WASM
- **WASM crate 2 — code-validator（~4-5MB，核心）：** 代码语法验证、AST 模式匹配，必须用 Rust + syn 实现

### 7.2 选型理由
- **Vite + React：** 纯前端 SPA 不需要 SSR，Vite 原生 WASM ESM 支持好，启动/HMR 速度最快。React 生态最适合交互式 UI，TypeScript 保证代码质量。
- **不选 Next.js：** 项目无后端需求，Next.js 的服务端/SSR 能力完全用不到，增加包体积和复杂度。
- **不选 Svelte：** 虽然包更小，但 WASM 工具链集成验证不如 React 成熟，生态相对小，不适合 MVP 阶段冒险。
- **两个 WASM crate 分离：** 减少首次加载体积，按需加载 code-validator（仅 Boss 战），可独立迭代。

### 7.3 syn WASM 验证原理

`code-validator` crate 依赖 `syn`（Rust 官方语法解析库）和 `proc-macro2`。编译到 WASM 的流程：

1. 用户提交 Rust 代码（字符串）
2. WASM 调用 `syn::parse_file(&code)` 解析为 AST
3. 遍历 AST 查找预期的模式节点：
   - 检查函数签名（参数类型、返回类型）
   - 检查特定表达式（如 `+`, `match` 等）
   - 检查语句类型（`let` 声明、`loop` 等）
   - 检查禁止模式是否出现（如 `unsafe` 在早期关卡）
4. 返回验证结果（通过/失败 + 具体反馈）

**错误处理策略（MVP 两层验证）：**
- **第一层：语法验证（syn AST）** — 检查代码是否可解析为合法 Rust AST，失败则返回"语法错误"提示
- **第二层：模式匹配** — 检查 AST 是否符合题目要求的模式，失败则返回具体差异（如"缺少 `let` 声明"、"使用了禁止的 `unsafe`"）
- **编译错误不在 WASM 中处理** — 类型检查、借用检查等语义验证需要完整的 rustc，MVP 阶段不实现，通过精心设计的题目和骨架代码规避
- **后续迭代**：可引入 `rustc` 的 WASM 编译版本或 `rust-analyzer` 做更深层验证

**大小控制：** `syn` 默认包含所有语法特性，可通过 Cargo features 裁剪不需要的部分（仅保留解析功能，去掉代码生成和格式化），将 WASM 体积控制在 4-5MB。

**技术风险与应对：**
- `proc-macro2` 在 WASM 环境下存在兼容性问题，需在 `Cargo.toml` 中设置 `default-features = false` 并启用 `wasm` feature
- 推荐 Cargo.toml 配置：
  ```toml
  [dependencies]
  syn = { version = "2", default-features = false, features = ["parsing", "full"] }
  proc-macro2 = { version = "1", default-features = false, features = ["wasm"] }
  ```
- 备选方案：如 syn 体积过大，可替换为 `tree-sitter-rust`（更小但需额外 WASM 绑定）或手写递归下降解析器

**加载策略：** 应用启动时不加载。进入 Boss 战前，通过 `React.lazy` + `IntersectionObserver` 预加载 WASM 模块，确保用户进入编辑器时已准备就绪。

### 7.4 项目结构
```
hackrust/
├── frontend/              # Vite + React + TypeScript
│   ├── src/
│   │   ├── pages/         # 页面组件
│   │   ├── components/    # 通用 UI 组件
│   │   ├── game/          # WASM 桥接层
│   │   ├── data/          # 课程内容 JSON
│   │   ├── store/         # 状态管理（Zustand）
│   │   └── lib/           # 工具函数
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── wasm/
│   ├── game-engine/       # 游戏引擎 crate（可选，MVP 阶段用 JS 替代）
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   ├── player.rs  # 玩家属性计算（XP→等级公式、伤害公式）
│   │   │   ├── combat.rs  # Boss 战数值逻辑
│   │   │   └── progress.rs # 进度序列化/反序列化
│   │   └── Cargo.toml
│   │
│   └── code-validator/    # 代码验证器 crate（核心，必须 Rust）
│       ├── src/
│       │   ├── lib.rs
│       │   ├── syntax.rs  # syn AST 解析
│       │   └── patterns.rs # 模式匹配逻辑
│       └── Cargo.toml
│
└── README.md
```

### 7.5 数据流
```
用户操作 → React 组件
  ├── (需要游戏逻辑?) → JS/Zustand（MVP）或 WASM game-engine（后续）
  ├── (需要代码验证?) → WASM code-validator
  └── 更新 React state → localStorage 持久化

关卡数据 → JSON 文件 → 静态导入 → React 组件渲染
游戏状态 → Zustand store → localStorage → 启动时恢复
```

## 8. MVP 范围

### 8.1 第一阶段（MVP）
- 3 个页面：世界地图、小关卡答题、Boss 编码战场
- 3 个系统：localStorage 持久化、即时反馈+解释、XP/等级/连胜
- 2 个世界内容：W00（终端连接）+ W01（变量工厂）
- 目标：验证核心学习循环，收集用户反馈

### 8.2 第二阶段
- 完成 Phase 1-2 所有世界内容
- 知识手册
- 连击/连胜机制完善
- Boss 动画优化

### 8.3 第三阶段
- 剩余世界内容
- 黑客档案
- 成就系统
- 音效

## 9. 编程小白行为设计要点
- 新概念必须附带逐行注释的示例代码
- 编辑器初始提供骨架代码，用户只需填关键部分
- 连续答错 2 次 → 提示；3 次 → 显示答案并标记"需复习"
- 错误反馈必须简短（< 2 句话）、具体、可操作
- 选择题干扰项必须合理，防止"猜答案"通过全部课程
- Boss 战做真编码验证，避免纯猜测通过

## 10. 课程内容数据格式

```typescript
// 世界定义
interface World {
  id: string;           // "w01"
  name: string;         // "变量·数据工厂"
  phase: number;        // 1
  description: string;
  levels: Level[];
  boss: BossChallenge;
}

// 小关卡
interface Level {
  id: string;           // "w01-l03"
  title: string;        // "可变性"
  type: "choice" | "fill" | "order" | "judge";
  question: string;
  code?: string;        // 展示代码块
  solution: string | string[];
  explanation: string;  // 解释
  // 选择题
  options?: Option[];
  // 填空题：拖拽选项 + 填空位置标记
  blanks?: string[];    // 可选拖拽项
  blanksCount?: number; // 填空数量
  // 排序题：正确顺序的代码行
  shuffledLines?: string[]; // 打乱后的代码行
  // 判断题：正确答案
  judgeAnswer?: boolean;
}

// Boss 战
interface BossChallenge {
  title: string;        // "数据计算器"
  description: string;  // 任务描述
  template: string;     // 编辑器初始代码
  validation: {
    required: string[];      // 必须出现的 AST 模式
    forbidden?: string[];    // 禁止出现的模式
    testCases?: TestCase[];  // 测试用例（可选）
  };
}

// 选项（选择题）
interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

// 测试用例（Boss 战）
interface TestCase {
  input: string;        // 输入值
  expected: string;     // 期望输出
  description?: string; // 测试说明
}
```
