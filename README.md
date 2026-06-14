# adapter-recharts

The MyBI **Recharts chart adapter** — the per-library draw that renders a MyBI `ChartSpec`
with [Recharts](https://recharts.org), built against the MyBI chart host SDK.

It is distributed as a signed `.mybiadapter` (a zip of `manifest.json` + `bundle.js` +
`signature.json`), downloaded on demand by MyBI and verified (Ed25519) before it runs. The
draw reads React, Recharts and the host from globals the app injects — it bundles none of them.

## Releases

The `recharts.mybiadapter` asset on each release is the signed adapter. Releases are published
by CI (`github-actions[bot]`) only after the signature verifies against the MyBI public key.

## Verify

```sh
node scripts/verify-adapter.mjs recharts.mybiadapter
```

MIT.
