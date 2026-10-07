import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import type Lenis from "lenis";

/** Inertial smooth scrolling (Lenis). Resets to top on navigation. */
export function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let disposed = false;
    import("lenis").then(({ default: LenisCtor }) => {
      if (disposed) return;
      const instance = new LenisCtor({ lerp: 0.1 });
      lenis.current = instance;
      const loop = (t: number) => {
        instance.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      lenis.current?.destroy();
      lenis.current = null;
    };
  }, []);

  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
