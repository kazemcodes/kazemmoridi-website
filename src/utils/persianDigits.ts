export function toPersianDigits(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d, 10)]);
}
