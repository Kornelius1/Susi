import { Controller, Get } from '@nestjs/common';
import { PilotService } from './pilot.service';

@Controller('pilot')
export class PilotController {
  constructor(private readonly service: PilotService) {}

  @Get('me')
  getMe() {
    return this.service.getProfile();
  }
}
