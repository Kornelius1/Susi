import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Endpoint bertanda @Public() dilewati.
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // 2. Selain itu wajib ada header "Authorization: Bearer <token>".
    const req = context.switchToHttp().getRequest<Request>();
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Missing or malformed Authorization header');
    }

    // 3. Token harus valid dan belum kedaluwarsa.
    try {
      const payload = await this.jwt.verifyAsync(token);
      (req as Request & { user?: unknown }).user = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return true;
  }
}
