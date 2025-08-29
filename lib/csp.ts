import { headers } from 'next/headers';

export async function getRequestNonce() {
  try {
    const h = await headers();
    return h.get('x-nonce') ?? undefined;
  } catch {
    return undefined;
  }
}

