import { IsOptional, IsString, MinLength } from 'class-validator';


export class CreateHospitalDto {

  @MinLength(4)
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  img?: string;

}

