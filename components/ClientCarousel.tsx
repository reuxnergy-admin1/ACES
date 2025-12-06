'use client';
import clsx from 'clsx';

const clients = [
  { name: 'Lanseria Flight Centre', url: 'https://flylfc.co.za' },
  { name: 'Absolute Aircraft Parts', url: 'https://absoluteaircraftparts.com' },
  { name: 'Aviation Rebuilders', url: 'https://aviationrebuilders.co.za' },
  { name: 'Skytrim', url: 'https://skytrim.co.za' },
  { name: 'NAC', url: 'https://nac.co.za' },
  { name: 'Alton Aero Engineering', url: 'https://altonaero.co.za' },
  { name: 'Wingman Aircraft Maintenance', url: 'https://wingman.co.za' },
  { name: 'Pablo Clark', url: 'https://pabloclark.com' },
  { name: 'WCT Engineering', url: 'https://wctengineering.co.za' },
  { name: '208 Aviation', url: 'https://208aviation.com' },
  { name: 'Acher Aviation', url: 'https://archeraviation.co.za' },
  { name: 'Skyhawk Aviation', url: 'https://skyhawkaviation.co.za' },
  { name: 'Orion Aircraft', url: 'https://orioncub.com' },
  { name: 'Emperor Aviation', url: 'https://emperoraviation.co.za' },
];

function ClientBlock({ name, url }: Readonly<{ name: string; url: string }>) {
  const words = name.toUpperCase().split(' ');
  const midpoint = Math.ceil(words.length / 2);
  const line1 = words.slice(0, midpoint).join(' ');
  const line2 = words.slice(midpoint).join(' ');
  const isTwoLines = words.length > 2;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block hover:opacity-100 transition-opacity"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        className="h-32 md:h-36 w-auto text-white"
        viewBox="0 0 380 130"
        fill="none"
      >
        <rect x="1" y="1" width="378" height="128" rx="14" stroke="currentColor" strokeOpacity="0.85" strokeWidth="2" />
        {isTwoLines ? (
          <>
            <text
              x="50%"
              y="38%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize="18"
              fill="currentColor"
              fillOpacity="1"
              style={{ letterSpacing: '0.06em' }}
            >
              {line1}
            </text>
            <text
              x="50%"
              y="62%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize="18"
              fill="currentColor"
              fillOpacity="1"
              style={{ letterSpacing: '0.06em' }}
            >
              {line2}
            </text>
          </>
        ) : (
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="18"
            fill="currentColor"
            fillOpacity="1"
            style={{ letterSpacing: '0.06em' }}
          >
            {name.toUpperCase()}
          </text>
        )}
      </svg>
    </a>
  );
}

export default function ClientCarousel({ className, reveal = false }: Readonly<{ className?: string; reveal?: boolean }>) {
  const looped = [
    ...clients.map((c) => ({ ...c, id: `${c.name}-a` })),
    ...clients.map((c) => ({ ...c, id: `${c.name}-b` })),
  ];
  const trackStyle: React.CSSProperties & { ['--marquee-duration']?: string } = {
    ['--marquee-duration']: '60s',
  };
  return (
    <section aria-label="Trusted clients" className={clsx('container-row w-full', className)} {...(reveal ? { 'data-reveal': true } : {})}>
      <div className="overflow-hidden py-3 md:py-4">
        <div className="marquee" aria-hidden="true">
          <ul className="marquee-track" style={trackStyle}>
            {looped.map((c) => (
              <li key={c.id} className="marquee-item">
                <ClientBlock name={c.name} url={c.url} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ul className="sr-only">
        {clients.map((c) => (
          <li key={c.name}>{c.name}</li>
        ))}
      </ul>
    </section>
  );
}
