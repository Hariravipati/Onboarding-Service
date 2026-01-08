import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateCandidateDocumentDto } from './candidate-documents.dto';
 

export class CreateCandidateDto {

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
  documents?: CreateCandidateDocumentDto[];
}
