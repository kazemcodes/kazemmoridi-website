export function getTodayPersianDate(): string {
  try {
    const parts = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());
    return parts;
  } catch {
    return '۱۴۰۴/۰۶/۲۲';
  }
}

export function generateInvoiceNumber(type: 'invoice' | 'proforma' = 'invoice'): string {
  const prefix = type === 'invoice' ? 'INV' : 'PRO';
  const year = '1404';
  const random = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${year}-${random}`;
}

export function generateLetterNumber(): string {
  const year = '1404';
  const random = Math.floor(100 + Math.random() * 900);
  return `KM-${year}/${random}`;
}
