'use client';
import clsx from 'clsx';

type Logo = {
  name: string;
};

const logos: Logo[] = [
  { name: 'Airbus' },
  { name: 'Denel' },
  { name: 'CSIR' },
  { name: 'Safair' },
  { name: 'SAA' },
  { name: 'Paramount' },
  { name: 'NAC' },
  { name: 'Cessna' },
];

function PlaceholderLogo({ label }: Readonly<{ label: string }>) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="h-8 md:h-10 w-auto text-white/60"
      viewBox="0 0 160 40"
      fill="none"
    >
      <rect x="0.5" y="0.5" width="159" height="39" rx="8" stroke="currentColor" strokeOpacity="0.18" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="14"
        fill="currentColor"
        fillOpacity="0.7"
        style={{ letterSpacing: '0.08em' }}
      >
        {label.toUpperCase()}
      </text>
    </svg>
  );
}

export default function ClientCarousel({ className, reveal = false }: Readonly<{ className?: string; reveal?: boolean }>) {
  // Duplicate with stable ids for seamless looping without index keys
  const looped = [
    ...logos.map((l) => ({ ...l, id: `${l.name}-a` })),
    ...logos.map((l) => ({ ...l, id: `${l.name}-b` })),
  ];
  const trackStyle: React.CSSProperties & { ['--marquee-duration']?: string } = {
    ['--marquee-duration']: '36s',
  };
  return (
    <section aria-label="Client partnerships" className={clsx('container-wide w-full', className)} {...(reveal ? { 'data-reveal': true } : {})}>
      {/* Animated marquee with no backdrop; floats over site background */}
      <div className="overflow-hidden py-3 md:py-4">
        <div className="marquee marquee--faded" aria-hidden="true">
          <ul className="marquee-track" style={trackStyle}>
            {looped.map((l) => (
              <li key={l.id} className="marquee-item">
                <PlaceholderLogo label={l.name} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Static, accessible list for screen readers */}
      <ul className="sr-only">
        {logos.map((l) => (
          <li key={l.name}>{l.name}</li>
        ))}
      </ul>
    </section>
  );
}
