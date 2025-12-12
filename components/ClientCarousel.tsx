"use client";
import clsx from "clsx";

type Client = {
  name: string;
  url: string;
};

const clients: Client[] = [
  { name: "Aero Parts Africa", url: "https://aeropartsafrica.com/" },
  { name: "Lanseria Flight Centre", url: "https://www.flylfc.com" },
  { name: "Absolute Aircraft Parts", url: "https://absoluteaviation.co.za" },
  {
    name: "Aviation Rebuilders",
    url: "https://focusedmedia.my.canva.site/aviationrebuilders",
  },
  { name: "Skytrim", url: "https://skytrim.co.za" },
  { name: "National Airways Corporation", url: "https://www.nac.co.za" },
  { name: "Alton Aero Engineering", url: "http://www.altonair.co.za" },
  { name: "Wingman Aircraft Maintenance", url: "https://wingmansa.co.za" },
  { name: "Pablo Clark", url: "https://www.pabloclark.com" },
  { name: "WCT Engineering", url: "https://www.wct.engineering" },
  { name: "208 Aviation", url: "https://www.208aviation.com" },
  { name: "Acher Aviation Helicopters", url: "https://www.acheraviation.com" },
  { name: "Skyhawk Aviation", url: "https://skyhawk.co.za" },
  { name: "Orion Aircraft", url: "https://orioncub.com" },
  { name: "Emperor Aviation", url: "https://emperoraviation.co.za" },
];

function ClientBlock({ name, url }: Readonly<{ name: string; url: string }>) {
  const words = name.toUpperCase().split(" ");
  const midpoint = Math.ceil(words.length / 2);
  const line1 = words.slice(0, midpoint).join(" ");
  const line2 = words.slice(midpoint).join(" ");
  const isTwoLines = words.length > 2;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center px-4 py-1.5 md:px-6 md:py-3 border-2 border-white/85 rounded-lg hover:border-white transition-colors min-w-[130px] md:min-w-[180px] h-[42px] md:h-[56px]"
    >
      <span className="text-white text-[10px] md:text-xs font-medium text-center leading-tight tracking-wider whitespace-nowrap">
        {isTwoLines ? (
          <>
            {line1}
            <br />
            {line2}
          </>
        ) : (
          name.toUpperCase()
        )}
      </span>
    </a>
  );
}

function MarqueeContent() {
  return (
    <div className="marquee-content">
      {clients.map((c) => (
        <div key={c.name} className="marquee-item">
          <ClientBlock name={c.name} url={c.url} />
        </div>
      ))}
    </div>
  );
}

export default function ClientCarousel({
  className,
  reveal = false,
}: Readonly<{ className?: string; reveal?: boolean }>) {
  return (
    <section
      aria-label="Our clients and partners"
      className={clsx("w-full", className)}
      {...(reveal ? { "data-reveal": true } : {})}
    >
      <div className="py-12">
        <div className="marquee" aria-hidden="true">
          <div className="marquee-inner">
            <MarqueeContent />
            <MarqueeContent />
          </div>
        </div>
      </div>

      <ul className="sr-only">
        {clients.map((c) => (
          <li key={c.name}>
            <a href={c.url} target="_blank" rel="noopener noreferrer">
              {c.name}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
