import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreatePipelineDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsArray()
  stages?: any[];
}