import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString({ message: 'project name must be a string' })
  @IsNotEmpty({ message: 'project name is required' })
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}