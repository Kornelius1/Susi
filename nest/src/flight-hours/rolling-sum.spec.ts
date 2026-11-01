import { sumWindow, toHours, toTenths } from './rolling-sum';

// Data kecil buatan sendiri supaya hasilnya mudah dihitung manual.
const data = new Map<string, number>([
  ['2026-05-10', 10], // 1.0 jam
  ['2026-05-11', 20], // 2.0 jam
  ['2026-05-12', 30], // 3.0 jam
  ['2026-05-14', 40], // 4.0 jam  (13 Mei sengaja tidak ada)
]);

describe('sumWindow', () => {
  it('menjumlahkan jendela yang BERAKHIR di endDate (endDate ikut dihitung)', () => {
    // 3 hari berakhir 12 Mei = 10, 11, 12 Mei
    expect(sumWindow(data, '2026-05-12', 3)).toBe(60);
  });

  it('jendela 1 hari hanya hari itu sendiri', () => {
    expect(sumWindow(data, '2026-05-11', 1)).toBe(20);
  });

  it('tanggal tanpa catatan dihitung 0, tidak dilewati', () => {
    // 13 Mei tidak ada; jendela 2 hari berakhir 13 Mei = 12 Mei (30) + 13 Mei (0)
    expect(sumWindow(data, '2026-05-13', 2)).toBe(30);
  });

  it('jendela yang melewati awal data tetap aman (sebelum data = 0)', () => {
    // 7 hari berakhir 11 Mei menjangkau jauh sebelum 10 Mei
    expect(sumWindow(data, '2026-05-11', 7)).toBe(30);
    expect(sumWindow(data, '2020-01-01', 365)).toBe(0);
  });

  it('tanggal setelah data terakhir tetap menghasilkan nilai', () => {
    // jendela 3 hari berakhir 16 Mei = 14 (40) + 15 (0) + 16 (0)
    expect(sumWindow(data, '2026-05-16', 3)).toBe(40);
  });

  it('jendela yang menyeberang bulan dan tahun benar', () => {
    const d = new Map([['2025-12-31', 10], ['2026-01-01', 20]]);
    expect(sumWindow(d, '2026-01-02', 3)).toBe(30);
  });
});

describe('konversi persepuluh jam', () => {
  it('toTenths membulatkan ke integer', () => {
    expect(toTenths(5.7)).toBe(57);
    expect(toTenths(0.1 + 0.2)).toBe(3); // 0.30000000000000004 -> 3
  });

  it('penjumlahan integer tidak menghasilkan noise desimal', () => {
    // Dengan float biasa: 5.7 + 6.4 + 7.1 = 19.200000000000003
    const total = toTenths(5.7) + toTenths(6.4) + toTenths(7.1);
    expect(toHours(total)).toBe(19.2);
  });
});
