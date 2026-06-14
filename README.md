# adapter-recharts

The **Recharts** rendering engine, packaged for **MyBI**.

Recharts is a React chart library, so its UMD (`Recharts.js`) is built **React-external** — it
reads `window.React`, `window.ReactDOM` and `window.ReactIs` so it shares MyBI's single React
instance (no dual-React). MyBI's in-app adapter renders charts through it; this repo hosts the
unmodified UMD so MyBI can **download it on demand** instead of bundling it. MyBI's registry
(`My-BI/plugin-registry → charts/registry.json`) links the `recharts` engine here; the app
verifies the download against the published SHA-256.

- **Library:** [Recharts](https://recharts.org) v3.8.1 — **unmodified upstream**.
- **Licence:** MIT (see `LICENSE`).
- **Asset:** `Recharts.js` (React-external UMD) — SHA-256 `3c3b29e02a7f46a1d847a05294d7e3f1d9ef2c9244d342147417dfff8504a4a0`. Host must expose
  `window.React` / `window.ReactDOM` / `window.ReactIs` before loading.

Fixes for how MyBI *uses* Recharts live in the in-app adapter, never in this bundle.
