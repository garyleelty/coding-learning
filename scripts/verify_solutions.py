#!/usr/bin/env python3
"""
verify_solutions.py — 校验 worlds.ts 里每个 code 关卡的 solutionCode。

每个 code 关卡必须满足：
  1. solutionCode 存在、非空；
  2. 能通过 `rustc --edition 2021` 编译（证明是真能跑的 Rust，不是伪代码）；
  3. 运行后的 stdout 与 codeTestCases[0].expected 完全一致（trimEnd 后比较）；
  4. solutionCode 里不含中文弯引号 “ ”（那是本仓库踩过的坑）。

用法:
    python3 scripts/verify_solutions.py            # 全量校验
    python3 scripts/verify_solutions.py w05 w06    # 只校验指定 world

退出码非 0 表示有失败项，可以直接接到 CI 上。
"""

import json
import os
import re
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
WORLDS_TS = os.path.join(HERE, '..', 'hackrust', 'frontend', 'src', 'data', 'worlds.ts')

# 需要外部 crate 的关卡：本地 rustc 无法单文件编译，
# 但仍要求 solutionCode 存在且不含弯引号。
NEEDS_TOKIO = {'w21-l01', 'w21-l02'}


def unescape_ts(s):
    out = []
    i = 0
    mp = {'n': '\n', 't': '\t', 'r': '\r', "'": "'", '"': '"', '\\': '\\'}
    while i < len(s):
        c = s[i]
        if c == '\\' and i + 1 < len(s):
            n = s[i + 1]
            if n in mp:
                out.append(mp[n])
                i += 2
                continue
            if n == 'u':
                out.append(chr(int(s[i + 2:i + 6], 16)))
                i += 6
                continue
        out.append(c)
        i += 1
    return ''.join(out)


def read_string_field(block, name):
    """读取 `name: '...'` 单引号字符串字段，处理转义。"""
    m = re.search(rf"^        {name}: '", block, re.M)
    if not m:
        return None
    i = m.end()
    buf = []
    while i < len(block):
        c = block[i]
        if c == '\\':
            buf.append(block[i:i + 2])
            i += 2
            continue
        if c == "'":
            break
        buf.append(c)
        i += 1
    return unescape_ts(''.join(buf))


def read_expected(block):
    """读取 codeTestCases[0].expected。

    注意不能先用 `\\{[^}]*\\}` 去切测试用例对象 —— 期望输出本身可能含
    `}`（例如 `Point { x: 3, y: 7 }`），那样会把对象切碎。直接在
    codeTestCases 块里找第一个 expected 字段即可。
    """
    m = re.search(r"^        codeTestCases: \[(.*?)\],\n", block, re.M | re.S)
    if not m:
        return None
    mm = re.search(r"expected: '((?:[^'\\]|\\.)*)'", m.group(1))
    return unescape_ts(mm.group(1)) if mm else None


def parse_levels(path):
    src = open(path, encoding='utf-8').read()
    starts = [m.start() for m in re.finditer(r"^        id: '(w\d+-l\d+)',", src, re.M)]
    starts.append(len(src))
    levels = []
    for i in range(len(starts) - 1):
        block = src[starts[i]:starts[i + 1]]
        lid = re.match(r"^        id: '([^']+)',", block).group(1)
        typ = re.search(r"^        type: '(\w+)',", block, re.M)
        levels.append({
            'id': lid,
            'type': typ.group(1) if typ else '?',
            'title': read_string_field(block, 'title'),
            'solutionCode': read_string_field(block, 'solutionCode'),
            'expected': read_expected(block),
        })
    return levels


def check_one(level):
    """返回 (ok, reason)。"""
    lid = level['id']
    code = level['solutionCode']

    if not code or not code.strip():
        return False, '缺少 solutionCode'

    if '\u201c' in code or '\u201d' in code:
        return False, 'solutionCode 含中文弯引号 “ ”（rustc 会报 unknown start of token）'

    expected = (level['expected'] or '').rstrip('\n')

    if lid == 'w16-l01' or lid == 'w16-l02':
        # 测试关卡：expected 为空，solutionCode 是 #[cfg(test)] 模块，
        # 没有 main —— 用 `rustc --test` 编译验证。
        with tempfile.TemporaryDirectory() as d:
            p = os.path.join(d, 't.rs')
            open(p, 'w', encoding='utf-8').write(code)
            r = subprocess.run(
                ['rustc', '--edition', '2021', '--test', '-o', os.path.join(d, 't'), p],
                capture_output=True, text=True, timeout=120)
            if r.returncode != 0:
                first = next((l for l in r.stderr.splitlines() if l.startswith('error')), r.stderr[:200])
                return False, f'rustc --test 编译失败: {first}'
            run = subprocess.run([os.path.join(d, 't')], capture_output=True, text=True, timeout=120)
            if 'test result: ok' not in run.stdout:
                return False, f'测试未全部通过: {run.stdout.strip()[:200]}'
        return True, 'ok'

    if lid in NEEDS_TOKIO:
        # tokio 不在本地单文件编译范围内：只做静态检查，
        # 由前端 Playground（有 tokio 依赖）负责真正执行。
        if '#[tokio::main]' not in code:
            return False, 'async 关卡应包含 #[tokio::main]'
        return True, 'ok (tokio: 仅静态检查)'

    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, 'main.rs')
        open(p, 'w', encoding='utf-8').write(code)
        b = os.path.join(d, 'a.out')
        c = subprocess.run(['rustc', '--edition', '2021', '-o', b, p],
                           capture_output=True, text=True, timeout=180)
        if c.returncode != 0:
            first = next((l for l in c.stderr.splitlines() if l.startswith('error')), c.stderr[:200])
            return False, f'编译失败: {first.strip()}'

        try:
            run = subprocess.run([b], capture_output=True, text=True, timeout=30)
        except subprocess.TimeoutExpired:
            return False, '运行超时（可能有死循环）'
        if run.returncode != 0:
            return False, f'运行时退出码 {run.returncode}: {run.stderr.strip()[:200]}'

        got = run.stdout.rstrip('\n')
        if got != expected:
            return False, f'输出不符\n      expected: {expected!r}\n      got     : {got!r}'

    return True, 'ok'


def main():
    filters = [a for a in sys.argv[1:] if not a.startswith('-')]

    if not os.path.exists(WORLDS_TS):
        print(f'找不到 {WORLDS_TS}')
        return 2

    levels = [l for l in parse_levels(WORLDS_TS) if l['type'] == 'code']
    if filters:
        levels = [l for l in levels if any(l['id'].startswith(f) for f in filters)]

    failures = []
    ok_count = 0
    for level in levels:
        ok, reason = check_one(level)
        if ok:
            ok_count += 1
            print(f"  ✓ {level['id']:10s} {level['title']}")
        else:
            failures.append((level['id'], level['title'], reason))
            print(f"  ✗ {level['id']:10s} {level['title']}\n      → {reason}")

    print()
    print(f'通过 {ok_count}/{len(levels)}')
    if failures:
        print(f'失败 {len(failures)} 项:')
        for lid, title, reason in failures:
            print(f'  {lid} ({title}): {reason.splitlines()[0]}')
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
