# Operations and Security

This project can run as a static export or on a server/edge runtime. Pick one model and apply headers accordingly.

## Option A — Static export (current)

- `next.config.js` sets `output: 'export'` in production. This disables middleware at runtime, so HTTP headers from `middleware.ts` will not be applied by the server. You must configure them at your CDN.
- Apply the following headers at the CDN:

```
Content-Security-Policy: default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; img-src 'self' data: blob:; font-src 'self' https://use.typekit.net https://p.typekit.net; style-src 'self' 'unsafe-inline' https://use.typekit.net; script-src 'self' 'strict-dynamic' https: http:; connect-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

Notes:
- We cannot use per-request nonces on a static CDN. The `script-src` therefore omits nonces and relies on `strict-dynamic`.
- If you need stricter policies later, move to Option B.

## Option B — Server/Edge runtime

- Remove `output: 'export'` in `next.config.js`. The Edge middleware will then run and inject per-request nonces plus the CSP in `middleware.ts`.
- This enables a stronger policy: `script-src 'self' 'nonce-...' 'strict-dynamic'` (no `unsafe-inline`).

## Fonts

- Today we load Adobe Typekit in `<head>`. If you switch to self-hosted fonts, use `next/font/local` and set `font-display: swap`. Preload woff2 weights in `<head>`.

## Images

- With static export we use `images.unoptimized: true`. On a server/edge deploy you can enable the Next image optimizer or use a CDN-based transformer.

## A11y and QA

- Enable the grid overlay by adding `#debug-grid` to the URL or `localStorage.setItem('gridDebug','1')`.
- A11y collector runs in Playwright via axe-core and logs violations without failing CI. Upgrade to fail-on-violation once content stabilizes.

