import { NextResponse, type NextRequest } from 'next/server';

function genNonce(bytes = 16) {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const arr = new Uint8Array(bytes);
      crypto.getRandomValues(arr);
      let hex = '';
      for (const v of arr) {
        hex += v.toString(16).padStart(2, '0');
      }
      return hex;
    }
  } catch { /* fall through */ }
  // Dev fallback (non-cryptographic) to avoid 500s if web crypto is unavailable in local runtime
  if (process.env.NODE_ENV !== 'production') {
    let hex = '';
    for (let i = 0; i < bytes; i++) {
      hex += Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    }
    return hex;
  }
  throw new Error('Secure random unavailable');
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const nonce = genNonce(16);
  const isProd = process.env.NODE_ENV === 'production';

  // Feature flag cookie for Chronicle UI controlled via ?ui=chronicle|default
  const ui = req.nextUrl.searchParams.get('ui');
  if (ui === 'chronicle') {
    res.cookies.set('feature-chronicle-ui', '1', { path: '/', httpOnly: false, sameSite: 'lax' });
  } else if (ui === 'default') {
    res.cookies.delete('feature-chronicle-ui');
  }

  if (!isProd) {
    // In development, skip CSP to avoid interfering with Next.js dev server, HMR and source maps.
    // Keep a few useful security headers but omit CSP.
    // Allow framing in development for Replit preview
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    return res;
  }

  // Expose nonce to the app (can be read in server components via headers())
  res.headers.set('x-nonce', nonce);

  const directives: string[] = [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' https://use.typekit.net https://p.typekit.net https://fonts.gstatic.com https://fonts.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://use.typekit.net https://p.typekit.net https://fonts.googleapis.com",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https:`.trim(),
    isProd ? "connect-src 'self' https:" : "connect-src 'self' ws: wss: https:",
    "upgrade-insecure-requests",
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
