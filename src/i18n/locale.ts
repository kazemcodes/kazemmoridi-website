import { useParams } from "@tanstack/react-router";

export const LOCALES = ["fa", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fa";

/** A value provided in every supported locale. */
export type Localized<T> = Record<Locale, T>;

export function isLocaleParam(value: string | undefined): boolean {
  return value === undefined || value === "en";
}

export function toLocale(param: string | undefined): Locale {
  return param === "en" ? "en" : "fa";
}

/** Value for the optional `{-$lang}` route param. */
export function langParam(locale: Locale): string | undefined {
  return locale === DEFAULT_LOCALE ? undefined : locale;
}

export function dirOf(locale: Locale): "rtl" | "ltr" {
  return locale === "fa" ? "rtl" : "ltr";
}

export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fa";
}

export function useLocale(): Locale {
  const params = useParams({ strict: false }) as { lang?: string };
  return toLocale(params.lang);
}

const faDigits = "۰۱۲۳۴۵۶۷۸۹";
export function toFaDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => faDigits[Number(d)] ?? d);
}

export function formatNumber(n: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
    maximumFractionDigits: 1,
  }).format(n);
}
