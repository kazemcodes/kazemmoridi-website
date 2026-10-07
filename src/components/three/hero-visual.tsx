import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

const HeroScene = lazy(() => import("./hero-scene"));

/** Static fallback used during SSR, while loading and for reduced motion. */
function StaticOrb() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
      <div className="h-[46vmin] w-[46vmin] rounded-full bg-ember opacity-80 blur-[2px] shadow-ember" />
    </div>
  );
}

function SceneGate() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = document.createElement("canvas");
    const webgl = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    setOk(!reduce && webgl);
  }, []);
  if (!ok) return <StaticOrb />;
  return (
    <Suspense fallback={<StaticOrb />}>
      <HeroScene />
    </Suspense>
  );
}

export function HeroVisual() {
  return (
    <div className="absolute inset-0">
      <ClientOnly fallback={<StaticOrb />}>
        <SceneGate />
      </ClientOnly>
    </div>
  );
}
