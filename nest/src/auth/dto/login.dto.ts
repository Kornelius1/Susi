import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'username harus berupa teks' })
  @IsNotEmpty({ message: 'username wajib diisi' })
  username!: string;

  @IsString({ message: 'password harus berupa teks' })
  @IsNotEmpty({ message: 'password wajib diisi' })
  password!: string;
}
