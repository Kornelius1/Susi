import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // buang field yang tidak ada di DTO
      forbidNonWhitelisted: true, // tolak request yang membawa field asing
      transform: true, // ubah query string ke tipe di DTO
      stopAtFirstError: true, // satu pesan per field, bukan semua aturan yang gagal
    }),
  );

  // CORS_ORIGIN boleh berisi beberapa origin, dipisah koma.
  const origins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());
  app.enableCors({ origin: origins });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
