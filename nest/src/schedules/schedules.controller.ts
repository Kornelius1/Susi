import { Controller, Get, Query } from '@nestjs/common';
import { SchedulesQueryDto } from './dto/schedules.query.dto';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Get()
  getMonth(@Query() query: SchedulesQueryDto) {
    return this.service.getMonth(query.year, query.month);
  }
}
