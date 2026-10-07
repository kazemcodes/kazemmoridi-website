import { toLocale, type Localized } from "@/i18n/locale";

/** Builds localized head() metadata for a public page. */
export function pageHead(lang: string | undefined, title: Localized<string>, description: Localized<string>) {
  const l = toLocale(lang);
  const t = `${title[l]} — KM Studio`;
  return {
    meta: [
      { title: t },
      { name: "description", content: description[l] },
      { property: "og:title", content: t },
      { property: "og:description", content: description[l] },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: l === "fa" ? "fa_IR" : "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
