import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'the current password is required' })
  oldPassword!: string;

  @IsString()
  @MinLength(6, { message: 'the new password must be at least 6 characters long' })
  newPassword!: string;
}