import type { ValidationResult, TestCase } from '../types';

/**
 * Validation rule set for checking Rust code against required/forbidden patterns.
 */
export interface ValidationRule {
  /** Patterns that MUST appear in the code (case-sensitive) */
  required: string[];
  /** Patterns that MUST NOT appear in the code */
  forbidden?: string[];
  /** Test cases to validate output format (MVP: checks println!/print! presence) */
  testCases?: TestCase[];
}

/**
 * Validates Rust code against a set of rules.
 *
 * Validation steps:
 * 1. Empty code check → fail with "代码不能为空"
 * 2. fn main() presence (if listed in required patterns)
 * 3. Each required pattern must exist (case-sensitive)
 * 4. Each forbidden pattern must NOT exist
 * 5. Test cases: MVP check for println!/print! output macros
 */
export function validateCode(code: string, rules: ValidationRule): ValidationResult {
  // 1. Empty check
  if (!code || code.trim().length === 0) {
    return {
      success: false,
      message: '代码不能为空',
      details: ['请编写 Rust 代码'],
    };
  }

  const details: string[] = [];

  // 2-3. Required patterns
  for (const pattern of rules.required) {
    if (!code.includes(pattern)) {
      return {
        success: false,
        message: `缺少必要内容`,
        details: [`代码中未找到匹配: "${pattern}"`],
      };
    }
    details.push(`✓ 已匹配: ${pattern}`);
  }

  // 4. Forbidden patterns
  if (rules.forbidden) {
    for (const pattern of rules.forbidden) {
      if (code.includes(pattern)) {
        return {
          success: false,
          message: `包含不允许的内容`,
          details: [`代码中不应出现: "${pattern}"`],
        };
      }
      details.push(`✓ 未出现禁止内容: ${pattern}`);
    }
  }

  // 5. Test cases – MVP: verify println!/print! output macros exist
  if (rules.testCases && rules.testCases.length > 0) {
    const hasPrint = code.includes('println!') || code.includes('print!');
    if (!hasPrint) {
      return {
        success: false,
        message: '缺少输出语句',
        details: ['测试用例需要 println! 或 print! 宏来输出结果'],
      };
    }

    // Verify at least one macro has a non-empty argument
    const printMatches = code.match(/print(?:ln)?!\s*\([^)]*\)/g);
    if (!printMatches || printMatches.length === 0) {
      return {
        success: false,
        message: '输出宏格式不正确',
        details: ['println!/print! 宏应包含有效的输出内容'],
      };
    }

    details.push(`✓ 输出格式检查通过 (${printMatches.length} 处输出)`);

    // Check each test case has a description or is referenced
    for (let i = 0; i < rules.testCases.length; i++) {
      const tc = rules.testCases[i];
      if (tc.description) {
        details.push(`  ✓ 测试用例 ${i + 1}: ${tc.description}`);
      }
    }
  }

  return {
    success: true,
    message: '验证通过',
    details: details.length > 0 ? details : undefined,
  };
}

/**
 * Performs basic Rust syntax checks.
 *
 * Checks performed:
 * - Balanced curly braces {}
 * - Balanced parentheses ()
 * - Non-empty fn main() body
 * - Presence of fn keyword
 */
export function checkSyntax(code: string): ValidationResult {
  if (!code || code.trim().length === 0) {
    return {
      success: false,
      message: '代码不能为空',
      details: ['请编写 Rust 代码'],
    };
  }

  const details: string[] = [];
  let hasError = false;

  // --- Balanced curly braces ---
  let braceCount = 0;
  for (const ch of code) {
    if (ch === '{') braceCount++;
    if (ch === '}') braceCount--;
    if (braceCount < 0) break;
  }
  if (braceCount !== 0) {
    details.push('花括号 {} 不配对');
    hasError = true;
  } else {
    details.push('✓ 花括号配对正确');
  }

  // --- Balanced parentheses ---
  let parenCount = 0;
  for (const ch of code) {
    if (ch === '(') parenCount++;
    if (ch === ')') parenCount--;
    if (parenCount < 0) break;
  }
  if (parenCount !== 0) {
    details.push('圆括号 () 不配对');
    hasError = true;
  } else {
    details.push('✓ 圆括号配对正确');
  }

  // --- fn main() present with non-empty body ---
  const hasMain = /\bfn\s+main\b/.test(code);
  if (!hasMain) {
    details.push('缺少 fn main() 函数定义');
    hasError = true;
  } else {
    // Simple non-nested body check (sufficient for MVP)
    const mainBody = code.match(/fn\s+main\s*\([^)]*\)\s*\{([^}]*)\}/);
    if (mainBody && mainBody[1].trim().length > 0) {
      details.push('✓ main 函数体非空');
    } else {
      details.push('main 函数体不能为空');
      hasError = true;
    }
  }

  // --- Basic Rust shape: fn keyword ---
  if (!/\bfn\b/.test(code)) {
    details.push('缺少 fn 关键字');
    hasError = true;
  } else {
    details.push('✓ 包含 fn 关键字');
  }

  if (!hasError) {
    return {
      success: true,
      message: '语法检查通过',
      details,
    };
  }

  // Return only error entries (skip the ✓ ones) when failing
  const errorDetails = details.filter((d) => !d.startsWith('✓'));
  return {
    success: false,
    message: '语法检查未通过',
    details: errorDetails,
  };
}
