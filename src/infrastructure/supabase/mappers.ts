type Row = Record<string, unknown>;

const camel = (s: string) => s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
const snake = (s: string) => s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);

/** Flat row → domain object (snake_case → camelCase, null → undefined). */
export function fromRow<T>(row: Row): T {
  const out: Row = {};
  for (const [k, v] of Object.entries(row)) out[camel(k)] = v === null ? undefined : v;
  return out as T;
}

/** Domain object → flat row, dropping the given keys and undefined values. */
export function toRow(obj: object, omit: string[] = []): Row {
  const out: Row = {};
  for (const [k, v] of Object.entries(obj)) {
    if (omit.includes(k) || v === undefined) continue;
    out[snake(k)] = v;
  }
  return out;
}

export function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}
