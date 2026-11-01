import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FlightHoursRepository } from '../flight-hours/flight-hours.repository';

@Injectable()
export class PilotService {
  constructor(
    private readonly repo: FlightHoursRepository,
    private readonly config: ConfigService,
  ) {}

  getProfile() {
    const { name, totalFlightHours } = this.repo.pilot;
    // Data JSON tidak punya avatar, jadi URL dibuat dari nama pilot.
    // Bisa diganti lewat env PILOT_AVATAR_URL.
    const avatarUrl =
      this.config.get<string>('PILOT_AVATAR_URL') ??
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0E2138&color=ffffff&size=128&bold=true`;
    return { name, totalFlightHours, avatarUrl };
  }
}
