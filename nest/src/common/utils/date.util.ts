/**
 * Semua perhitungan tanggal memakai string "YYYY-MM-DD" yang dibaca sebagai UTC.
 * Sengaja tidak memakai tanggal lokal supaya hasilnya sama di server mana pun
 * (misalnya server di UTC vs laptop di WIB tidak akan beda satu hari).
 */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MS_PER_DAY = 86_400_000;

const toMs = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

/** True hanya untuk tanggal yang benar-benar ada (2026-02-31 ditolak). */
export function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const ms = toMs(value);
  if (Number.isNaN(ms)) return false;
  return new Date(ms).toISOString().slice(0, 10) === value;
}

/** Geser tanggal sebanyak n hari (boleh negatif). */
export function addDays(iso: string, n: number): string {
  return new Date(toMs(iso) + n * MS_PER_DAY).toISOString().slice(0, 10);
}

/** Selisih hari a - b. Positif jika a lebih baru dari b. */
export function diffDays(a: string, b: string): number {
  return Math.round((toMs(a) - toMs(b)) / MS_PER_DAY);
}
