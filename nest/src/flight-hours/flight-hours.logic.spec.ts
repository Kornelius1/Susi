import { loadJson } from '../common/utils/load-json';
import {
  buildCards,
  buildDaily,
  buildSummary,
  toTenthsByDate,
  validateDailyRange,
} from './flight-hours.logic';
import { FlightHoursFile } from './flight-hours.types';

// ---- Data ASLI dari mock-flight-hours.json, hari ini = 15 Mei 2026 ----
const file = loadJson<FlightHoursFile>('mock-flight-hours.json');
const data = toTenthsByDate(file.flightHours);
const config = { limits: file.limits, chartBounds: file.chartBounds };
const TODAY = '2026-05-15';

describe('buildSummary (data asli)', () => {
  const s = buildSummary(data, config, '1w', TODAY);
  const byDate = Object.fromEntries(s.points.map((p) => [p.date, p]));

  it('15 titik: 7 hari sebelum, hari ini di tengah, 7 hari sesudah', () => {
    expect(s.points).toHaveLength(15);
    expect(s.points[0].date).toBe('2026-05-08');
    expect(s.points[7].date).toBe('2026-05-15');
    expect(s.points[7].isToday).toBe(true);
    expect(s.points[14].date).toBe('2026-05-22');
    expect(s.points.filter((p) => p.isToday)).toHaveLength(1);
    expect(s.points.filter((p) => p.isFuture)).toHaveLength(7);
  });

  it('rolling 7 hari: nilai hari ini dan puncak di atas limit 40', () => {
    expect(byDate['2026-05-15'].rollingSum).toBe(25.2);
    expect(byDate['2026-05-20'].rollingSum).toBe(44.7); // puncak
    expect(byDate['2026-05-17'].overLimit).toBe(false); // 36.4
    expect(byDate['2026-05-18'].overLimit).toBe(true); // 42.8
    expect(byDate['2026-05-21'].overLimit).toBe(true); // 42.7
    expect(byDate['2026-05-22'].overLimit).toBe(false); // 36.3
  });

  it('tanggal masa depan memakai data apa adanya (proyeksi), bukan 0', () => {
    expect(byDate['2026-05-16'].hours).toBe(6.2);
    expect(byDate['2026-05-16'].isFuture).toBe(true);
  });

  it('limit, windowDays, dan yMax mengikuti konfigurasi tiap range', () => {
    const cases = [
      ['1w', 7, 40, 45],
      ['1m', 30, 100, 125],
      ['3m', 90, 300, 325],
      ['6m', 180, 600, 625],
      ['1y', 365, 1050, 1200],
    ] as const;
    for (const [range, windowDays, limit, yMax] of cases) {
      const r = buildSummary(data, config, range, TODAY);
      expect([r.windowDays, r.limit, r.yMax]).toEqual([windowDays, limit, yMax]);
    }
  });

  it('1m: titik di atas limit 100 hanya pada 8 Mei dan 21 Mei', () => {
    const over = buildSummary(data, config, '1m', TODAY)
      .points.filter((p) => p.overLimit)
      .map((p) => p.date);
    expect(over).toEqual(['2026-05-08', '2026-05-21']);
  });

  it('3m, 6m, 1y tidak melewati limit pada rentang ini', () => {
    for (const r of ['3m', '6m', '1y'] as const) {
      expect(buildSummary(data, config, r, TODAY).points.some((p) => p.overLimit)).toBe(false);
    }
  });

  it('tidak ada noise desimal (maksimal 1 angka di belakang koma)', () => {
    for (const p of buildSummary(data, config, '1y', TODAY).points) {
      expect(Math.round(p.rollingSum * 10) / 10).toBe(p.rollingSum);
    }
  });
});

describe('buildCards (data asli, jendela berakhir hari ini)', () => {
  const cards = Object.fromEntries(buildCards(data, file.limits, TODAY).map((c) => [c.key, c]));

  it('jam tiap jendela', () => {
    expect(cards.daily.hours).toBe(6.4);
    expect(cards.weekly.hours).toBe(25.2);
    expect(cards.monthly.hours).toBe(87.2);
    expect(cards.annual.hours).toBe(1013.8);
  });

  it('limit sesuai brief: 8 / 40 / 100 / 1050', () => {
    expect([cards.daily.limit, cards.weekly.limit, cards.monthly.limit, cards.annual.limit]).toEqual([
      8, 40, 100, 1050,
    ]);
  });

  it('status: tepat 80% sudah warning; di bawahnya safe', () => {
    expect(cards.daily.percent).toBe(80);
    expect(cards.daily.status).toBe('warning'); // 6.4 / 8 = tepat 80%
    expect(cards.weekly.status).toBe('safe'); // 63%
    expect(cards.monthly.status).toBe('warning'); // 87.2%
    expect(cards.annual.status).toBe('warning'); // 96.6%
  });

  it('sisa jam dihitung dari limit', () => {
    expect(cards.daily.remaining).toBe(1.6);
    expect(cards.annual.remaining).toBe(36.2);
  });
});

describe('buildDaily (data asli)', () => {
  it('jam harian dan total dalam rentang', () => {
    const r = buildDaily(data, '2026-05-14', '2026-05-16');
    expect(r.items.map((i) => i.hours)).toEqual([6.7, 6.4, 6.2]);
    expect(r.totalHours).toBe(19.3);
  });

  it('tanggal sebelum data dimulai diisi 0, bukan dilewati', () => {
    expect(buildDaily(data, '2024-12-25', '2024-12-27').items).toEqual([
      { date: '2024-12-25', hours: 0 },
      { date: '2024-12-26', hours: 0 },
      { date: '2024-12-27', hours: 5.7 },
    ]);
  });

  it('total seluruh dataset = totalFlightHours di file', () => {
    const r = buildDaily(data, '2024-12-27', '2026-05-31');
    expect(r.items).toHaveLength(521);
    expect(r.totalHours).toBe(file.pilot.totalFlightHours);
  });
});

describe('validateDailyRange', () => {
  it('menerima rentang yang benar, termasuk satu hari', () => {
    expect(validateDailyRange('2026-05-14', '2026-05-16')).toBeNull();
    expect(validateDailyRange('2026-05-14', '2026-05-14')).toBeNull();
  });
  it('menolak from setelah to', () => {
    expect(validateDailyRange('2026-05-16', '2026-05-14')).toBe('from tidak boleh setelah to');
  });
  it('batas 731 hari: 731 boleh, 732 ditolak', () => {
    expect(validateDailyRange('2024-01-01', '2025-12-31')).toBeNull(); // 731 hari
    expect(validateDailyRange('2024-01-01', '2026-01-01')).toContain('Rentang maksimal');
  });
});

describe('data buatan (kasus ekstrem)', () => {
  /** Setiap hari 10 jam di Mei 2026: rolling 7 hari = 70, jauh di atas limit. */
  const rows = Array.from({ length: 31 }, (_, i) => ({
    date: `2026-05-${String(i + 1).padStart(2, '0')}`,
    hours: 10,
  }));
  const heavy = toTenthsByDate(rows);
  const cfg = {
    limits: { daily: 8, weekly: 40, monthly: 100, annual: 1050 },
    chartBounds: { '1w': { limit: 40, max: 45, windowDays: 7, displayRangeDays: 7 } },
  } as unknown as Parameters<typeof buildSummary>[1];

  it('yMax melebar otomatis agar grafik tidak terpotong, kelipatan 5', () => {
    const s = buildSummary(heavy, cfg, '1w', TODAY);
    const peak = Math.max(...s.points.map((p) => p.rollingSum));
    expect(peak).toBe(70);
    expect(s.yMax).toBe(80); // ceil(70 * 1.1 / 5) * 5
    expect(s.yMax).toBeGreaterThanOrEqual(peak);
  });

  it('kartu berstatus over saat melewati limit', () => {
    const cards = buildCards(heavy, cfg.limits, TODAY);
    expect(cards.find((c) => c.key === 'daily')?.status).toBe('over'); // 10 > 8
    expect(cards.find((c) => c.key === 'weekly')?.status).toBe('over'); // 70 > 40
    expect(cards.find((c) => c.key === 'daily')?.remaining).toBe(0);
  });

  it('data kosong: semua 0 dan tidak error', () => {
    const s = buildSummary(new Map(), cfg, '1w', TODAY);
    expect(s.points.every((p) => p.rollingSum === 0)).toBe(true);
    expect(s.yMax).toBe(45);
  });
});
