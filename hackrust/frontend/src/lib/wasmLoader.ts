import type { InterpResult } from '../../../../wasm/code-validator/pkg/code_validator';

let wasmModule: { run_code(code: string): InterpResult } | null = null;
let loading: Promise<void> | null = null;

export async function getWasmInterpreter(): Promise<{ run_code(code: string): InterpResult }> {
  if (wasmModule) return wasmModule;

  if (!loading) {
    loading = (async () => {
      const module = await import(
        /* webpackChunkName: "code-validator" */
        '../../../../wasm/code-validator/pkg/code_validator'
      );
      wasmModule = module;
    })().catch((err) => {
      // A failed chunk load must not be cached: let the next call retry.
      loading = null;
      throw err;
    });
  }

  await loading;
  return wasmModule!;
}

export function preloadWasm(): void {
  if (!wasmModule && !loading) {
    // getWasmInterpreter() owns `loading`; warm-up failures are retried on demand.
    void getWasmInterpreter().catch(() => {});
  }
}
