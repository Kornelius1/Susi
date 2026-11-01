import { Controller, Get, Query } from '@nestjs/common';
import { DateRangeQueryDto } from './dto/date-range.query.dto';
import { SummaryQueryDto } from './dto/summary.query.dto';
import { FlightHoursService } from './flight-hours.service';

@Controller('flight-hours')
export class FlightHoursController {
  constructor(private readonly service: FlightHoursService) {}

  @Get()
  getDaily(@Query() query: DateRangeQueryDto) {
    return this.service.getDaily(query.from, query.to);
  }

  @Get('summary')
  getSummary(@Query() query: SummaryQueryDto) {
    return this.service.getSummary(query.range);
  }
}
