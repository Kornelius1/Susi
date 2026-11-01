/**
 * Logika perhitungan jam terbang sebagai fungsi murni (tanpa NestJS).
 * Service hanya membungkus fungsi-fungsi ini, sehingga mudah diuji.
 */
import { addDays, diffDays } from '../common/utils/date.util';
import { sumWindow, toHours, toTenths, TenthsByDate } from './rolling-sum';
import {
  CardStatus,
  FlightHoursFile,
  LimitCard,
  RangeKey,
  SummaryPoint,
  SummaryResponse,
} from './flight-hours.types';

/** Kartu mulai berstatus "warning" saat sudah mencapai 80% dari limit. */
export const WARNING_PERCENT = 80;
/** Batas panjang rentang /flight-hours agar respons tidak membengkak. */
export const MAX_SPAN_DAYS = 731;

const CARD_DEFS = [
  { key: 'daily', label: 'Daily', windowDays: 1 },
  { key: 'weekly', label: 'Weekly', windowDays: 7 },
  { key: 'monthly', label: 'Monthly', windowDays: 30 },
  { key: 'annual', label: 'Annual', windowDays: 365 },
] as const;

type Config = Pick<FlightHoursFile, 'limits' | 'chartBounds'>;

/** Ubah daftar { date, hours } menjadi peta tanggal -> persepuluh jam. */
export function toTenthsByDate(rows: { date: string; hours: number }[]): TenthsByDate {
  return new Map(rows.map((r) => [r.date, toTenths(r.hours)]));
}

/** Mengembalikan pesan error, atau null jika rentang valid. */
export function validateDailyRange(from: string, to: string): string | null {
  const span = diffDays(to, from);
  if (span < 0) return 'from tidak boleh setelah to';
  if (span + 1 > MAX_SPAN_DAYS) return `Rentang maksimal ${MAX_SPAN_DAYS} hari`;
  return null;
}

/** Jam terbang harian dalam rentang; tanggal tanpa catatan diisi 0. */
export function buildDaily(data: TenthsByDate, from: string, to: string) {
  const span = diffDays(to, from);
  const items: { date: string; hours: number }[] = [];
  let totalTenths = 0;
  for (let i = 0; i <= span; i++) {
    const date = addDays(from, i);
    const tenths = data.get(date) ?? 0;
    totalTenths += tenths;
    items.push({ date, hours: toHours(tenths) });
  }
  return { from, to, totalHours: toHours(totalTenths), items };
}

/** Empat kartu memakai jendela yang berakhir HARI INI (tanpa data masa depan). */
export function buildCards(data: TenthsByDate, limits: Config['limits'], today: string): LimitCard[] {
  return CARD_DEFS.map((def) => {
    const limit = limits[def.key];
    const limitTenths = limit * 10;
    const tenths = sumWindow(data, today, def.windowDays);

    // Dibandingkan sebagai integer (persepuluh jam) agar batas persis 80%
    // tidak salah akibat pembulatan desimal.
    const status: CardStatus =
      tenths > limitTenths
        ? 'over'
        : tenths * 100 >= limitTenths * WARNING_PERCENT
          ? 'warning'
          : 'safe';

    return {
      key: def.key,
      label: def.label,
      windowDays: def.windowDays,
      limit,
      hours: toHours(tenths),
      remaining: toHours(Math.max(0, limitTenths - tenths)),
      percent: Math.round((tenths / limitTenths) * 1000) / 10,
      status,
    };
  });
}

/** Kartu limit + deret rolling sum untuk grafik. */
export function buildSummary(
  data: TenthsByDate,
  config: Config,
  range: RangeKey,
  today: string,
): SummaryResponse {
  const bounds = config.chartBounds[range];
  const limitTenths = bounds.limit * 10;

  // Satu titik per hari: displayRangeDays sebelum hari ini sampai sesudahnya.
  const points: SummaryPoint[] = [];
  for (let offset = -bounds.displayRangeDays; offset <= bounds.displayRangeDays; offset++) {
    const date = addDays(today, offset);
    const rolling = sumWindow(data, date, bounds.windowDays);
    points.push({
      date,
      hours: toHours(data.get(date) ?? 0),
      rollingSum: toHours(rolling),
      isToday: offset === 0,
      isFuture: offset > 0,
      overLimit: rolling > limitTenths,
    });
  }

  // Sumbu Y: pakai max dari konfigurasi, tapi melebar jika ada nilai yang
  // melewatinya supaya grafik tidak terpotong.
  const peak = Math.max(...points.map((p) => p.rollingSum));
  const yMax = peak <= bounds.max ? bounds.max : Math.ceil((peak * 1.1) / 5) * 5;

  return {
    range,
    asOf: today,
    windowDays: bounds.windowDays,
    limit: bounds.limit,
    yMax,
    points,
    cards: buildCards(data, config.limits, today),
  };
}
