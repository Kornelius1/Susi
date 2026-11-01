import { loadJson } from '../common/utils/load-json';
import { buildMonth } from './schedules.logic';
import { SchedulesFile } from './schedules.types';

const file = loadJson<SchedulesFile>('mock-schedules.json');
const month = (y: number, m: number) => buildMonth(file, y, m, '2026-05-15');

describe('buildMonth (data asli)', () => {
  it('hanya entri bulan yang diminta, terurut tanggal', () => {
    const r = month(2026, 5);
    expect(r.entries).toHaveLength(21);
    expect(r.entries.every((e) => e.duty_date.startsWith('2026-05-'))).toBe(true);
    const dates = r.entries.map((e) => e.duty_date);
    expect(dates).toEqual([...dates].sort());
  });

  it('jumlah entri April, Mei, Juni sesuai data', () => {
    expect(month(2026, 4).entries).toHaveLength(17);
    expect(month(2026, 5).entries).toHaveLength(21);
    expect(month(2026, 6).entries).toHaveLength(16);
  });

  it('menyertakan legenda 10 tipe tugas dan hari ini', () => {
    const r = month(2026, 4);
    expect(r.legend).toHaveLength(10);
    expect(r.today).toBe('2026-05-15');
  });

  it('bulan tanpa data -> entries kosong, bukan error', () => {
    expect(month(2026, 12).entries).toEqual([]);
    expect(month(2026, 3).entries).toEqual([]);
  });

  it('semua tugas tercatat -> is_complete (centang)', () => {
    const e = month(2026, 5).entries.find((x) => x.id === '97027')!; // 6 dari 6
    expect(e.is_complete).toBe(true);
    expect(e.count_remaining).toBe(0);
  });

  it('belum semua tercatat -> tampilkan sisa tugas', () => {
    const a = month(2026, 4).entries.find((x) => x.id === '97005')!; // 4 jadwal, 2 tercatat
    expect(a.is_complete).toBe(false);
    expect(a.count_remaining).toBe(2);

    const b = month(2026, 5).entries.find((x) => x.id === '97028')!; // 2 jadwal, 0 tercatat
    expect(b.is_complete).toBe(false);
    expect(b.count_remaining).toBe(2);
  });

  it('mempertahankan field asli seperti base_color', () => {
    const e = month(2026, 4).entries.find((x) => x.id === '97013')!; // TRX
    expect(e.base_color).toBe('#F59E0B');
    expect(e.duty_type).toBe('TRX');
  });

  it('jadwal 0/0 tidak dianggap selesai', () => {
    const f: SchedulesFile = {
      legend: [],
      schedules: [
        {
          id: 'x', duty_date: '2026-05-01', status: 1, base_name: 'CJN',
          base_color: '#000', duty_type: 'DTY', count_schedules: 0, count_logbooks: 0,
        },
      ],
    };
    expect(buildMonth(f, 2026, 5, '2026-05-15').entries[0].is_complete).toBe(false);
  });
});
