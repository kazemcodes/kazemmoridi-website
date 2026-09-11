/**
 * Converts numbers into Persian words (تبدیل عدد به حروف)
 * Used in official Iranian invoices and receipts.
 */

const yekan = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
const dahgan1 = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
const dahgan = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
const sadgan = ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
const scales = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];

function chunkThreeDigits(num: number): string {
  const result: string[] = [];
  const sad = Math.floor(num / 100);
  const dah = Math.floor((num % 100) / 10);
  const yek = num % 10;

  if (sad > 0) result.push(sadgan[sad]);

  if (dah === 1) {
    result.push(dahgan1[yek]);
  } else {
    if (dah > 1) result.push(dahgan[dah]);
    if (yek > 0) result.push(yekan[yek]);
  }

  return result.join(' و ');
}

export function numberToPersianWords(amount: number | string): string {
  const n = typeof amount === 'string' ? parseInt(amount.replace(/[^0-9]/g, ''), 10) : Math.floor(amount);
  if (isNaN(n) || n === 0) return 'صفر تومان';

  const parts: string[] = [];
  let temp = n;
  let scaleIndex = 0;

  while (temp > 0) {
    const chunk = temp % 1000;
    if (chunk > 0) {
      const chunkStr = chunkThreeDigits(chunk);
      const scaleStr = scales[scaleIndex];
      parts.unshift(scaleStr ? `${chunkStr} ${scaleStr}` : chunkStr);
    }
    temp = Math.floor(temp / 1000);
    scaleIndex++;
  }

  return parts.join(' و ') + ' تومان';
}

export function formatPrice(amount: number | string): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(n)) return '۰';
  return n.toLocaleString('fa-IR');
}
