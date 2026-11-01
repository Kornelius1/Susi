import { Injectable, OnModuleInit } from '@nestjs/common';
import { loadJson } from '../common/utils/load-json';
import { toTenthsByDate } from './flight-hours.logic';
import { FlightHoursFile } from './flight-hours.types';
import { TenthsByDate } from './rolling-sum';

/** Memuat mock-flight-hours.json sekali saat start, lalu melayani dari memori. */
@Injectable()
export class FlightHoursRepository implements OnModuleInit {
  private file!: FlightHoursFile;
  private byDate: TenthsByDate = new Map();

  onModuleInit() {
    this.file = loadJson<FlightHoursFile>('mock-flight-hours.json');
    this.byDate = toTenthsByDate(this.file.flightHours);
  }

  get pilot() {
    return this.file.pilot;
  }
  get limits() {
    return this.file.limits;
  }
  get chartBounds() {
    return this.file.chartBounds;
  }
  get tenthsByDate(): TenthsByDate {
    return this.byDate;
  }
}
