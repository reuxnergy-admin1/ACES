"use client";
import Reveal from "./Reveal";

export default function SplitText({ text }: { text: string }) {
  const words = text.split(" ");
  let uid = 0;
  return (
    <span className="inline-block">
      {words.map((w) => {
        const key = `${w}-${uid++}-${text.length}`;
        const i = uid - 1;
        return (
        <Reveal key={key} dir="up" distance={12} duration="xs" delay={i * 0.025}>
          <span className="inline-block">{w}&nbsp;</span>
        </Reveal>
      );})}
    </span>
  );
}
