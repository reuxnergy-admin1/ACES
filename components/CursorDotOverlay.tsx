"use client";
import { useEffect } from 'react';

// Simplified cursor dot that always stays white.
// Previously had invert-on-hover behavior which made cursor appear black on interactive elements.
// Per client request: cursor should always stay white.
export default function CursorDotOverlay() {
  useEffect(() => {
    // No DOM elements needed - the white cursor is handled by CursorTrailOverlay canvas
    // This component is kept for potential future enhancements but does nothing for now
    return () => {};
  }, []);
  return null;
}
