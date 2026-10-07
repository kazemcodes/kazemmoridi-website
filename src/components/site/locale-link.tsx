import { Link, type LinkComponentProps } from "@tanstack/react-router";
import { langParam, useLocale, type Locale } from "@/i18n/locale";

export type SitePath =
  | "/{-$lang}"
  | "/{-$lang}/services"
  | "/{-$lang}/work"
  | "/{-$lang}/work/$slug"
  | "/{-$lang}/process"
  | "/{-$lang}/pricing"
  | "/{-$lang}/about"
  | "/{-$lang}/contact";

type Props = Omit<LinkComponentProps<"a">, "to" | "params"> & { to: SitePath; slug?: string };

/** Link that keeps the active locale prefix (/ for fa, /en for en). */
export function LocaleLink({ to, slug, ...rest }: Props) {
  const locale = useLocale();
  return <Link {...rest} to={to} params={{ lang: langParam(locale), slug } as never} />;
}

/** Same page, other language. */
export function LocaleSwitch({ target, className }: { target: Locale; className?: string }) {
  return (
    <Link
      to="."
      params={((prev: Record<string, string | undefined>) => ({ ...prev, lang: langParam(target) })) as never}
      className={className}
      hrefLang={target}
    >
      {target === "en" ? "EN" : "فا"}
    </Link>
  );
}
