import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString, IsUUID } from 'class-validator';

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

  @IsUUID() 
  @IsOptional()
  assigneeId?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}