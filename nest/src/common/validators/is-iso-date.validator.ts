import { registerDecorator, ValidationOptions } from 'class-validator';
import { isValidIsoDate } from '../utils/date.util';

/** Validator kustom: string harus tanggal YYYY-MM-DD yang benar-benar ada. */
export function IsIsoDate(options?: ValidationOptions) {
  return (object: object, propertyName: string) =>
    registerDecorator({
      name: 'isIsoDate',
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} harus berformat YYYY-MM-DD dengan tanggal yang valid`,
        ...options,
      },
      validator: {
        validate: (value: unknown) => typeof value === 'string' && isValidIsoDate(value),
      },
    });
}
