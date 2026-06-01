// Builds a DOWNLOADED chart-adapter UMD from the in-app draw source (single source of
// truth — no copies). The draw's host + library seams are aliased to window-reading shims,
// and React / Recharts stay EXTERNAL (the host injects window.React / window.Recharts), so
// the bundle is just the draw. Output: dist-adapters/<lib>/bundle.js → zip into .mbia.
//
//   ADAPTER=recharts pnpm exec vite build --config vite.adapter.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const ADAPTER = process.env.ADAPTER || "recharts";

const ENTRIES: Record<string, string> = {
  recharts: "src/blocks/charts/adapters/build/recharts.adapter.tsx",
  echarts: "src/blocks/charts/adapters/build/echarts.adapter.tsx",
};

export default defineConfig({
  // Classic JSX → React.createElement (resolves to the EXTERNAL window.React), so no
  // react/jsx-runtime dependency leaks into the bundle.
  plugins: [react({ jsxRuntime: "classic" })],
  define: { "process.env.NODE_ENV": '"production"' },
  resolve: {
    // Point the draw's seams at the window-reading shims (host + library + maps come from
    // window). Match the trailing module name so it works whether the importer wrote
    // "./mapAssets", "../hostImpl", etc. — but never the *.umd shims themselves.
    alias: [
      { find: /.*\/adapters\/hostImpl(\.ts)?$/, replacement: resolve(__dirname, "src/blocks/charts/adapters/build/host.umd.ts") },
      { find: /.*\/rechartsLib(\.ts)?$/, replacement: resolve(__dirname, "src/blocks/charts/adapters/build/rechartsLib.umd.ts") },
      { find: /.*\/echartsLib(\.ts)?$/, replacement: resolve(__dirname, "src/blocks/charts/adapters/build/echartsLib.umd.ts") },
      { find: /.*\/mapAssets(\.ts)?$/, replacement: resolve(__dirname, "src/blocks/charts/adapters/build/mapAssets.umd.ts") },
    ],
  },
  build: {
    outDir: resolve(__dirname, `dist-adapters/${ADAPTER}`),
    emptyOutDir: true,
    minify: true,
    lib: {
      entry: resolve(__dirname, ENTRIES[ADAPTER]),
      formats: ["umd"],
      name: `MyBIAdapter_${ADAPTER}`, // wrapper global (harmless — the entry assigns MyBIChartAdapter)
      fileName: () => "bundle.js",
    },
    rollupOptions: {
      // echarts-gl is BUNDLED into the echarts adapter (NOT external) so 3D charts work
      // download-only AND its fragility is isolated to this adapter — it can't break the
      // host app the way a bundled-in-app echarts-gl did. echarts itself stays external
      // (the adapter registers GL into the host's window.echarts).
      external: ["react", "react-dom", "recharts", "react-is", "echarts"],
      output: {
        globals: { react: "React", "react-dom": "ReactDOM", recharts: "Recharts", "react-is": "ReactIs", echarts: "echarts" },
        // Keep it a single self-contained file.
        inlineDynamicImports: true,
      },
    },
  },
});
