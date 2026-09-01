import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  name!: string;

  @IsEmail({}, { message: 'please enter a valid email address' })
  @IsNotEmpty({ message: 'email is required' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'password is required' })
  password!: string;

  @IsString()
  @IsOptional() 
  country?: string;
}