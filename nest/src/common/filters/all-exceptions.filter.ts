import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

/** Bentuk error yang SAMA untuk semua endpoint. */
export interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  details: string[];
  path: string;
  timestamp: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message = 'Terjadi kesalahan pada server';
    let details: string[] = [];

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const body = exception.getResponse();

      if (typeof body === 'string') {
        message = body;
      } else {
        const b = body as { message?: string | string[]; error?: string };
        error = b.error ?? exception.name;
        if (Array.isArray(b.message)) {
          // Error validasi dari ValidationPipe: daftar pesan per field.
          message = 'Validation failed';
          details = b.message;
        } else if (b.message) {
          message = b.message;
        }
      }
    } else {
      // Error tak terduga: catat detailnya di log, jangan bocorkan ke klien.
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const payload: ErrorResponse = {
      statusCode,
      error,
      message,
      details,
      path: req.url,
      timestamp: new Date().toISOString(),
    };
    res.status(statusCode).json(payload);
  }
}
