import { BadRequestException, Injectable } from '@nestjs/common';
import { ClockService } from '../common/clock/clock.service';
import { buildDaily, buildSummary, validateDailyRange } from './flight-hours.logic';
import { FlightHoursRepository } from './flight-hours.repository';
import { RangeKey } from './flight-hours.types';

/** Pembungkus tipis: validasi -> panggil logika murni -> kembalikan hasil. */
@Injectable()
export class FlightHoursService {
  constructor(
    private readonly repo: FlightHoursRepository,
    private readonly clock: ClockService,
  ) {}

  /** GET /flight-hours */
  getDaily(from: string, to: string) {
    const error = validateDailyRange(from, to);
    if (error) throw new BadRequestException(error);
    return buildDaily(this.repo.tenthsByDate, from, to);
  }

  /** GET /flight-hours/summary */
  getSummary(range: RangeKey) {
    const config = { limits: this.repo.limits, chartBounds: this.repo.chartBounds };
    return buildSummary(this.repo.tenthsByDate, config, range, this.clock.today());
  }
}
