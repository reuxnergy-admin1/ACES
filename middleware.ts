import { NextResponse, type NextRequest } from 'next/server';

function genNonce(bytes = 16) {
  // crypto.getRandomValues is available in edge runtime
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  // Convert to base64url for header friendliness without padding
  let str = '';
  for (const n of arr) str += String.fromCharCode(n);
  const b64 = btoa(str);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function middleware(_: NextRequest) {
  const res = NextResponse.next();
  const nonce = genNonce(16);
  const isProd = process.env.NODE_ENV === 'production';

  // Expose nonce to the app (can be read in server components via headers())
  res.headers.set('x-nonce', nonce);

  // Build a CSP that supports Next.js scripts with nonces and strict-dynamic
  // Note: Avoid 'unsafe-inline' for scripts; styles may still need it due to SSR/style tags.
  const directives: string[] = [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    // Allow images from self, data, blob
    "img-src 'self' data: blob:",
    // Fonts and styles from Adobe Typekit and self; allow inline styles for Next's style tags
    "font-src 'self' https://use.typekit.net https://p.typekit.net",
    "style-src 'self' 'unsafe-inline' https://use.typekit.net",
    // Script policy: nonce + strict-dynamic so Next's injected scripts are allowed without whitelisting origins
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isProd ? '' : "'unsafe-eval'"} https: http:`.trim(),
    // Network connections
    isProd ? "connect-src 'self'" : "connect-src 'self' ws: wss:",
    // Upgrade insecure if needed (optional)
    // 'upgrade-insecure-requests'
  ];
  const csp = directives.join('; ');

  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
