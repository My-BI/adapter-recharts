// Entry for the DOWNLOADED Recharts adapter UMD.
// ----------------------------------------------------------------------------
// Built by vite.adapter.config.ts into a single UMD that reads window.React +
// window.Recharts + window.MyBIChartHost (all injected by adapter-link BEFORE eval) and
// assigns the ChartAdapterModule to globalThis.MyBIChartAdapter (the host harvests it).
//
// The draw is the SAME RechartsInner the app ships bundled — here its ./adapters/hostImpl
// and ./rechartsLib seams are aliased to the window-reading shims, so this UMD contains
// only the draw (React, Recharts and the host stay external).
import RechartsInner from "../../RechartsInner";
import { chartHost } from "../hostImpl"; // aliased → host.umd (window.MyBIChartHost)
import type { ChartSpec, ChartKind } from "../../chartSpec";
import type { QueryResult } from "../../../../types";
import type { ChartAdapterModule } from "../host";

// Kinds Recharts renders (matches engineKinds("recharts")).
const SUPPORTED: ChartKind[] = [
  "column", "bar", "stackedColumn", "stackedBar", "line", "area", "stackedArea",
  "pie", "donut", "scatter", "radar", "funnel", "treemap", "radialBar", "composed",
  "sunburst", "sankey",
];

function Renderer({ spec, result }: { spec: ChartSpec; result: QueryResult }) {
  const { data, measureKeys, catKey } = chartHost.data.shape(spec, result);
  return <RechartsInner spec={spec} data={data} measureKeys={measureKeys} catKey={catKey} />;
}

const adapter: ChartAdapterModule = {
  apiVersion: 1,
  id: "recharts",
  name: "Recharts",
  framework: "react",
  supportedKinds: SUPPORTED,
  // FULL library support for every kind it renders; the chart-TYPE capability template
  // (in the host/core) intersects this per kind, so this matches the bundled adapter.
  capabilities: () => ({
    marks: true, axes: true, legend: true, dataLabels: true,
    data: true, crossFilter: true, highlight: true,
  }),
  Renderer,
};

(globalThis as unknown as { MyBIChartAdapter: ChartAdapterModule }).MyBIChartAdapter = adapter;
