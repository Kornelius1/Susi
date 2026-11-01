import { IsIn, IsOptional } from 'class-validator';
import { RANGE_KEYS, type RangeKey } from '../flight-hours.types';

export class SummaryQueryDto {
  /** Opsional; default 1w sesuai brief. */
  @IsOptional()
  @IsIn(RANGE_KEYS, { message: `range harus salah satu dari: ${RANGE_KEYS.join(', ')}` })
  range: RangeKey = '1w';
}
