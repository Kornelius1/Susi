import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class SchedulesQueryDto {
  @Max(2100, { message: 'year maksimal 2100' })
  @Min(2000, { message: 'year minimal 2000' })
  @IsInt({ message: 'year wajib diisi berupa bilangan bulat' })
  @Type(() => Number)
  year!: number;

  @Max(12, { message: 'month harus antara 1 dan 12' })
  @Min(1, { message: 'month harus antara 1 dan 12' })
  @IsInt({ message: 'month wajib diisi berupa bilangan bulat' })
  @Type(() => Number)
  month!: number;
}
