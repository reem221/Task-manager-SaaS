import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString({ message: 'the name must be a string' })
  @IsNotEmpty({ message: 'the name is required' })
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}