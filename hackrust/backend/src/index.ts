import express from 'express';
import cors from 'cors';
import { compileAndRun } from './compile.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

/**
 * POST /api/compile
 * 
 * Compiles and runs Rust code, returning the output.
 * 
 * Request body: { code: string, expectedOutput?: string }
 * Response: {
 *   success: boolean,
 *   output: string | null,
 *   compilationErrors: string | null,
 *   runtimeErrors: string | null,
 *   matchExpected: boolean | null
 * }
 */
app.post('/api/compile', async (req, res) => {
  const { code, expectedOutput } = req.body;

  if (!code || typeof code !== 'string') {
    res.status(400).json({
      success: false,
      output: null,
      compilationErrors: '代码不能为空',
      runtimeErrors: null,
      matchExpected: null,
    });
    return;
  }

  try {
    const result = await compileAndRun(code, expectedOutput);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      output: null,
      compilationErrors: null,
      runtimeErrors: `服务器错误: ${error instanceof Error ? error.message : '未知错误'}`,
      matchExpected: null,
    });
  }
});

app.listen(PORT, () => {
  console.log(`HackRust backend running on http://localhost:${PORT}`);
});
