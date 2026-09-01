import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message:'the content must be a string' })
  @IsNotEmpty({ message: 'the content is required' })
  content!: string;
}