"use client";
import { useMotionToggle, setMotionEnabled } from "@/app/motion-provider";

export default function MotionToggle() {
  const { motionEnabled } = useMotionToggle();
  
  return (
    <button 
      onClick={() => setMotionEnabled(!motionEnabled)}
      className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
      title={`${motionEnabled ? 'Disable' : 'Enable'} animations`}
    >
      {motionEnabled ? '🎭' : '🚫'} Motion
    </button>
  );
}