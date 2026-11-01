import { addDays } from '../common/utils/date.util';

/**
 * Jam terbang per tanggal, disimpan dalam PERSEPULUH jam (integer).
 * Contoh: 5.7 jam disimpan sebagai 57. Dengan integer, penjumlahan tidak
 * menghasilkan noise desimal seperti 25.200000000000003.
 */
export type TenthsByDate = ReadonlyMap<string, number>;

/**
 * Rolling sum: jumlah jam terbang pada `windowDays` hari yang BERAKHIR di
 * `endDate` (termasuk endDate). Contoh windowDays=7, endDate=15 Mei
 * menjumlahkan 9 sampai 15 Mei.
 *
 * Tanggal tanpa catatan (termasuk sebelum data dimulai) dihitung 0 jam,
 * dan tanggal setelah "hari ini" memakai data apa adanya (proyeksi).
 */
export function sumWindow(data: TenthsByDate, endDate: string, windowDays: number): number {
  let total = 0;
  for (let i = 0; i < windowDays; i++) {
    total += data.get(addDays(endDate, -i)) ?? 0;
  }
  return total;
}

export const toHours = (tenths: number): number => tenths / 10;
export const toTenths = (hours: number): number => Math.round(hours * 10);
