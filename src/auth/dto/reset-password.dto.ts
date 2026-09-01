import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'token is required' })
  token!: string;

  @IsString()
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'password is required' })
  password!: string;
}