'use client';
export default function ContoursSVG() {
  return (
  <svg className="w-full h-full pointer-events-none"
         viewBox="0 0 1600 900" aria-hidden="true">
  <g stroke="white" strokeOpacity="0.15" fill="none" strokeWidth="1.2">
        {Array.from({ length: 28 }).map((_, i) => {
          const y = 30 + i * 30;
          return <path key={`contour-line-${y}`} d={`M-200 ${y} L 1800 ${y}`} />;
        })}
      </g>
    </svg>
  );
}
