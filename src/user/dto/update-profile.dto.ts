import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString({ message: 'the name must be a string' })
  @IsOptional()
  name?: string;

  @IsEmail({}, { message: 'the email is not valid' })
  @IsOptional()
  email?: string;
}