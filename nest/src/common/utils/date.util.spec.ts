import { addDays, diffDays, isValidIsoDate } from './date.util';

describe('date.util', () => {
  describe('isValidIsoDate', () => {
    it('menerima tanggal yang benar', () => {
      expect(isValidIsoDate('2026-05-15')).toBe(true);
      expect(isValidIsoDate('2024-02-29')).toBe(true); // tahun kabisat
    });

    it('menolak tanggal yang tidak ada di kalender', () => {
      expect(isValidIsoDate('2026-02-31')).toBe(false);
      expect(isValidIsoDate('2025-02-29')).toBe(false); // bukan tahun kabisat
      expect(isValidIsoDate('2026-13-01')).toBe(false);
    });

    it('menolak format selain YYYY-MM-DD', () => {
      expect(isValidIsoDate('15-05-2026')).toBe(false);
      expect(isValidIsoDate('2026-5-15')).toBe(false);
      expect(isValidIsoDate('2026-05-15T00:00:00Z')).toBe(false);
      expect(isValidIsoDate('')).toBe(false);
    });
  });

  describe('addDays', () => {
    it('menggeser maju dan mundur, lintas bulan dan tahun', () => {
      expect(addDays('2026-05-15', 7)).toBe('2026-05-22');
      expect(addDays('2026-05-15', -15)).toBe('2026-04-30');
      expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
      expect(addDays('2024-02-28', 1)).toBe('2024-02-29');
    });
  });

  describe('diffDays', () => {
    it('menghitung selisih a - b', () => {
      expect(diffDays('2026-05-29', '2026-05-15')).toBe(14);
      expect(diffDays('2026-05-01', '2026-05-15')).toBe(-14);
      expect(diffDays('2026-05-15', '2026-05-15')).toBe(0);
    });
  });
});
