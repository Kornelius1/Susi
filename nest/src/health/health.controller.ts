import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

/**
 * Endpoint publik untuk mengecek server hidup (dipakai health check hosting
 * dan untuk "membangunkan" server gratis yang tertidur). Tidak membuka data apa pun.
 */
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  check() {
    return { status: 'ok' };
  }
}
