// UMD-build shim. The downloaded adapter gets Recharts from window.Recharts (the bundled
// library the host exposes before eval) — NOT the in-app engine loader. The adapter Vite
// build ALIASES ./rechartsLib to this file. Same exported names as rechartsLib.ts.
import type { ChartSpec } from "../../chartSpec";

export type RechartsModule = typeof import("recharts");

export function useRecharts(): RechartsModule {
  const r = (globalThis as unknown as { Recharts?: RechartsModule }).Recharts;
  if (!r) throw new Error("MyBI recharts adapter: window.Recharts is not available");
  return r;
}

export type RechartsInnerProps = {
  spec: ChartSpec;
  data: Record<string, string | number>[];
  measureKeys: string[];
  catKey: string;
};
