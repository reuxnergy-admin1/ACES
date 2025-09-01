'use client';
import { useEffect } from 'react';

const BUILD_STAMP = new Date().toISOString();

export default function BuildStamp() {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[ACES Build] Client bundle loaded:', BUILD_STAMP);
  }, []);
  return null;
}
