import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class UpdateColumnDto {
  @IsOptional() @IsString() @IsNotEmpty() title?: string;
  @IsOptional() @IsInt() @Min(0) position?: number;
}