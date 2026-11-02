const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Grid satu bulan, minggu dimulai hari Senin.
 * Elemen null = sel kosong (sebelum tanggal 1 / setelah akhir bulan).
 * Memakai UTC murni, tidak ada new Date() untuk "sekarang".
 */
export function buildMonthGrid(year: number, month: number): (string | null)[] {
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay() // 0 = Minggu
  const offset = (firstWeekday + 6) % 7 // geser agar Senin = 0
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()

  const cells: (string | null)[] = Array(offset).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${year}-${pad(month)}-${pad(d)}`)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

/** Bulan sebelum/sesudah, dengan pergantian tahun. */
export function shiftMonth(year: number, month: number, delta: number) {
  const index = year * 12 + (month - 1) + delta
  return { year: Math.floor(index / 12), month: (index % 12) + 1 }
}
