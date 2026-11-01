import { IsIsoDate } from '../../common/validators/is-iso-date.validator';

export class DateRangeQueryDto {
  @IsIsoDate()
  from!: string;

  @IsIsoDate()
  to!: string;
}
