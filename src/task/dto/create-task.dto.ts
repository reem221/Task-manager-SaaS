import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'the title must be a string' })
  @IsNotEmpty({ message: 'the title is required' })
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'the column ID must be a number' })
  @IsNotEmpty({ message: 'the column ID is required' })
  columnId!: number;

  @IsNumber()
  @IsOptional()
  assigneeId?: number;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}