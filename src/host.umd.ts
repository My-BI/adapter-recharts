// UMD-build shim. The downloaded adapter reads the host off window.MyBIChartHost (injected
// by adapter-link BEFORE the bundle is eval'd) — NOT the app's hostImpl (which pulls in the
// store / eventBus / etc.). The adapter Vite build ALIASES ./adapters/hostImpl to this file,
// so the SAME draw source (RechartsInner) compiles against the injected host.
import type { MyBIChartHost } from "../host";

export const chartHost: MyBIChartHost =
  (globalThis as unknown as { MyBIChartHost: MyBIChartHost }).MyBIChartHost;
