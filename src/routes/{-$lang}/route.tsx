import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { isLocaleParam } from "@/i18n/locale";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { SmoothScroll } from "@/components/motion/smooth-scroll";

export const Route = createFileRoute("/{-$lang}")({
  beforeLoad: ({ params }) => {
    if (!isLocaleParam(params.lang)) throw notFound();
  },
  component: SiteLayout,
});

function SiteLayout() {
  return (
    <>
      <SmoothScroll />
      
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
