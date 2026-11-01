import { SchedulesFile } from './schedules.types';

/**
 * Entri satu bulan. Field asli dari JSON dipertahankan, ditambah dua field
 * turunan supaya frontend tidak menghitung sendiri:
 *   is_complete     -> tampilkan centang (semua tugas sudah tercatat)
 *   count_remaining -> angka yang ditampilkan jika belum selesai
 * Bulan tanpa data menghasilkan entries kosong (bukan error).
 */
export function buildMonth(file: SchedulesFile, year: number, month: number, today: string) {
  const prefix = `${year}-${String(month).padStart(2, '0')}-`;

  const entries = file.schedules
    .filter((s) => s.duty_date.startsWith(prefix))
    .sort((a, b) => a.duty_date.localeCompare(b.duty_date))
    .map((s) => ({
      ...s,
      is_complete: s.count_schedules > 0 && s.count_logbooks === s.count_schedules,
      count_remaining: Math.max(0, s.count_schedules - s.count_logbooks),
    }));

  return { today, year, month, legend: file.legend, entries };
}
