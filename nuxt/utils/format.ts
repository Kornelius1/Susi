// Semua tanggal diproses sebagai tanggal UTC murni (YYYY-MM-DD) agar hasilnya
// sama di zona waktu mana pun.
const utc = (iso: string) => new Date(`${iso}T00:00:00Z`)

export function formatHours(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

/** "20 May" */
export function formatDayMonth(iso: string): string {
  return utc(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
}

/** "Wed, 20 May 2026" */
export function formatLongDate(iso: string): string {
  return utc(iso).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** "May 2026" */
export function formatMonthYear(year: number, month: number): string {
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** "John Doe" -> "JD" */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('')
}

export const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value))
