import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCandidateDocumentDto } from './candidate-documents.dto';
 

export class CreateCandidateDto {

  @IsNumber()
  eobRequestId: number;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  mobileNo?: string;

  @IsOptional()
  @IsString()
  aadharNo?: string;

  @IsOptional()
  @IsString()
  panNo?: string;

  @IsOptional()
  @IsString()
  passportNo?: string;

  @IsOptional()
  @IsString()
  uanNo?: string;

  // Custom JSON fields
  @IsOptional()
  customFieldsJson?: any;

  @IsOptional()
  otherDetailsJson?: any;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCandidateDocumentDto)
  documents?: CreateCandidateDocumentDto[];
}
