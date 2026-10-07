import type { ReactNode } from "react";

/** Infinite horizontal ticker. Direction is forced LTR so the loop is seamless in RTL too. */
export function Marquee({ items, separator = "✦" }: { items: ReactNode[]; separator?: ReactNode }) {
  const row = (
    <div className="flex shrink-0 items-center gap-10 pe-10">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-10">
          <span>{it}</span>
          <span className="text-ember">{separator}</span>
        </span>
      ))}
    </div>
  );
  return (
    <div dir="ltr" className="overflow-hidden">
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {row}
        {row}
      </div>
    </div>
  );
}
