const fa = "۰۱۲۳۴۵۶۷۸۹";

export const toFa = (v: string | number) => String(v).replace(/\d/g, (d) => fa[Number(d)] ?? d);

export const toEnDigits = (v: string) => v.replace(/[۰-۹]/g, (d) => String(fa.indexOf(d)));

export function formatToman(n: number): string {
  return toFa(new Intl.NumberFormat("en-US").format(Math.round(n)));
}

/** Today's date in the Jalali calendar, e.g. ۱۴۰۵/۰۷/۱۵ */
export function todayJalali(): string {
  const parts = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}/${get("month")}/${get("day")}`;
}

const ones = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
const teens = ["ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده"];
const tens = ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
const hundreds = ["", "صد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];
const scales = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];

function threeDigits(n: number): string {
  const parts: string[] = [];
  const h = Math.floor(n / 100);
  const r = n % 100;
  if (h) parts.push(hundreds[h] ?? "");
  if (r >= 10 && r < 20) parts.push(teens[r - 10] ?? "");
  else {
    if (Math.floor(r / 10)) parts.push(tens[Math.floor(r / 10)] ?? "");
    if (r % 10) parts.push(ones[r % 10] ?? "");
  }
  return parts.join(" و ");
}

/** Converts an integer to Persian words, e.g. 1250 → "یک هزار و دویست و پنجاه" */
export function numberToWords(num: number): string {
  let n = Math.floor(Math.abs(num));
  if (n === 0) return "صفر";
  const groups: string[] = [];
  let i = 0;
  while (n > 0) {
    const g = n % 1000;
    if (g) groups.unshift(`${threeDigits(g)}${scales[i] ? " " + scales[i] : ""}`);
    n = Math.floor(n / 1000);
    i++;
  }
  return groups.join(" و ");
}
