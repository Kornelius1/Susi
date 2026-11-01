import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Satu-satunya sumber "hari ini" di seluruh aplikasi.
 * Brief melarang memakai new Date() untuk hari ini, jadi semua service
 * wajib bertanya ke sini. Nilainya dari env APP_TODAY (default 2026-05-15).
 */
@Injectable()
export class ClockService {
  private readonly todayIso: string;

  constructor(config: ConfigService) {
    this.todayIso = config.get<string>('APP_TODAY', '2026-05-15');
  }

  /** Tanggal hari ini dalam format YYYY-MM-DD. */
  today(): string {
    return this.todayIso;
  }
}
