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
    })();
  }

  await loading;
  return wasmModule!;
}

export function preloadWasm(): void {
  if (!wasmModule && !loading) {
    loading = getWasmInterpreter().then(() => {});
  }
}
