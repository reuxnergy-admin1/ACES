"use client";
import Reveal from "./Reveal";

export default function SplitText({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <div className="inline-block">
      {words.map((w, i) => (
        <Reveal key={i} dir="up" distance={12} duration="xs" delay={i * 0.025}>
          <span className="inline-block">{w}&nbsp;</span>
        </Reveal>
      ))}
    </div>
  );
}