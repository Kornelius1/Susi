import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClockService } from '../common/clock/clock.service';
import { loadJson } from '../common/utils/load-json';
import { buildMonth } from './schedules.logic';
import { SchedulesFile } from './schedules.types';

@Injectable()
export class SchedulesService implements OnModuleInit {
  private file!: SchedulesFile;

  constructor(private readonly clock: ClockService) {}

  onModuleInit() {
    this.file = loadJson<SchedulesFile>('mock-schedules.json');
  }

  getMonth(year: number, month: number) {
    return buildMonth(this.file, year, month, this.clock.today());
  }
}
