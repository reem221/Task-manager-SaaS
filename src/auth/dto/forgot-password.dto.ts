import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'please enter a valid email address' })
  @IsNotEmpty({ message: 'email is required' })
  email!: string;
}