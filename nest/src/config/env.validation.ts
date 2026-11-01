/**
 * Memeriksa environment variable saat aplikasi start.
 * Kalau ada yang salah, aplikasi langsung berhenti dengan pesan jelas
 * (fail fast), bukan error aneh di tengah jalan.
 */
export function validateEnv(config: Record<string, unknown>) {
  const errors: string[] = [];

  const appToday = String(config.APP_TODAY ?? '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(appToday) || Number.isNaN(Date.parse(appToday))) {
    errors.push('APP_TODAY harus berformat YYYY-MM-DD yang valid (contoh: 2026-05-15)');
  }

  const secret = String(config.JWT_SECRET ?? '');
  if (secret.length < 16) {
    errors.push('JWT_SECRET wajib diisi dan minimal 16 karakter');
  }

  if (errors.length > 0) {
    throw new Error(`Konfigurasi environment tidak valid:\n- ${errors.join('\n- ')}`);
  }

  return config;
}
