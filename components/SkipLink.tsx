"use client";

export default function SkipLink({ targetId }: Readonly<{ targetId: string }>) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-overlay focus:bg-white focus:text-black focus:px-3 focus:py-2 focus:rounded"
      onClick={(e) => {
        const el = document.getElementById(targetId);
        if (el) {
          e.preventDefault();
          const hadTab = el.hasAttribute("tabindex");
          if (!hadTab) el.setAttribute("tabindex", "-1");
          el.focus();
          setTimeout(() => {
            if (!hadTab) el.removeAttribute("tabindex");
          }, 0);
        }
      }}
    >
      Skip to content
    </a>
  );
}
