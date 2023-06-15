import { IsMongoId, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMedicoDto {

  @MinLength(4)
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  img?: string;

  @IsMongoId()
  hospital: string;
}
