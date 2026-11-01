import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

// Akun pilot di-hardcode sesuai brief.
const PILOT_ACCOUNT = {
  id: 'pilot-1',
  username: 'johndoe',
  password: 'susiairtest',
};

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  async login({ username, password }: LoginDto) {
    if (username !== PILOT_ACCOUNT.username || password !== PILOT_ACCOUNT.password) {
      // Pesan sengaja sama untuk username salah maupun password salah.
      throw new UnauthorizedException('Invalid username or password');
    }

    const accessToken = await this.jwt.signAsync({
      sub: PILOT_ACCOUNT.id,
      username: PILOT_ACCOUNT.username,
    });
    return { accessToken, tokenType: 'Bearer' as const };
  }
}
