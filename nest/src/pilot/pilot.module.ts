import { Module } from '@nestjs/common';
import { FlightHoursModule } from '../flight-hours/flight-hours.module';
import { PilotController } from './pilot.controller';
import { PilotService } from './pilot.service';

@Module({
  imports: [FlightHoursModule],
  controllers: [PilotController],
  providers: [PilotService],
})
export class PilotModule {}
