import { Module } from '@nestjs/common';
import { FlightHoursController } from './flight-hours.controller';
import { FlightHoursRepository } from './flight-hours.repository';
import { FlightHoursService } from './flight-hours.service';

@Module({
  controllers: [FlightHoursController],
  providers: [FlightHoursRepository, FlightHoursService],
  exports: [FlightHoursRepository], // dipakai modul pilot
})
export class FlightHoursModule {}
