import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Membaca file JSON dari folder src/data (di build: dist/data).
 * Dipanggil sekali saat aplikasi start, lalu datanya dilayani dari memori.
 */
export function loadJson<T>(fileName: string): T {
  const path = join(__dirname, '..', '..', 'data', fileName);
  return JSON.parse(readFileSync(path, 'utf-8')) as T;
}
