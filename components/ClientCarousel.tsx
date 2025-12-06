'use client';
import clsx from 'clsx';

type Client = {
  name: string;
  url: string;
};

const clients: Client[] = [
  { name: 'Lanseria Flight Centre', url: 'https://www.flylfc.com' },
  { name: 'Absolute Aircraft Parts', url: 'https://absoluteaviation.co.za' },
  { name: 'Aviation Rebuilders', url: 'https://aviation-rebuilders-cc.business.site' },
  { name: 'Skytrim', url: 'https://skytrim.co.za' },
  { name: 'National Airways Corporation', url: 'https://www.nac.co.za' },
  { name: 'Alton Aero Engineering', url: 'https://www.altonaero.co.za' },
  { name: 'Wingman Aircraft Maintenance', url: 'https://wingmansa.co.za' },
  { name: 'Pablo Clark', url: 'https://www.pabloclark.com' },
  { name: 'WCT Engineering', url: 'https://www.wct.engineering' },
  { name: '208 Aviation', url: 'https://www.208aviation.com' },
  { name: 'Acher Aviation Helicopters', url: 'https://www.acheraviation.com' },
  { name: 'Skyhawk Aviation', url: 'https://skyhawk.co.za' },
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
        className="h-48 md:h-56 w-auto text-white"
        viewBox="0 0 672 212"
        fill="none"
      >
        <rect x="1" y="1" width="668" height="208" rx="28" stroke="currentColor" strokeOpacity="0.85" strokeWidth="4" />
        {isTwoLines ? (
          <>
            <text
              x="50%"
              y="38%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize="30"
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
              fontSize="30"
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
            fontSize="15"
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
    <section aria-label="Our clients and partners" className={clsx('w-full', className)} {...(reveal ? { 'data-reveal': true } : {})}>
      <div className="overflow-hidden py-4 md:py-6">
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
          <li key={c.name}>
            <a href={c.url} target="_blank" rel="noopener noreferrer">{c.name}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
