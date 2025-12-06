'use client';
import { useEffect } from 'react';

export default function BuildStamp() {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[ACES Build] Client bundle loaded:', new Date().toISOString());
  }, []);
  return null;
}
