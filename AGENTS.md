# AGENTS.md

- UI and routes depend only on `src/domain/ports.ts` interfaces; the backend is wired once in `src/infrastructure/index.ts` — keeps the data provider swappable.
- Supabase implementation lives in `src/infrastructure/supabase/`; never import the Supabase client from components or routes.
- Public site uses the optional `{-$lang}` route segment (no prefix = fa/RTL, `/en` = English) — one route file per page serves both locales.
- All public copy is `Localized<T>` in `src/content/*` and `src/i18n/dictionary.ts`; components never hardcode user-facing strings.
- Reusable building blocks: `components/primitives` (layout, buttons), `components/motion` (reveal, magnetic, cursor, smooth scroll), `components/three` (lazy R3F scenes behind ClientOnly with static fallback), `components/sections` (page sections), `components/admin` (admin fields, print sheet).
- Three.js scenes must be lazy-loaded and fall back to a static visual for SSR, no-WebGL and reduced motion.
- Admin (`/admin`, ssr:false) authorizes via Supabase Auth + `is_admin()` RPC; RLS in `supabase/km-studio-security.sql` is the real security boundary.
- Pure business logic (invoice math, price estimate, Persian number words) lives outside components so it is testable.
- R3F scenes in components/three use createElement (not JSX) for three.js/drei elements — the dev source inspector injects data-tsd-source into JSX, which crashes R3F.
