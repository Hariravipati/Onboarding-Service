import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateCandidateDocumentDto {

  @IsNumber()
  docId: number;

  @IsString()
  @IsNotEmpty()
  docType: string;

  // Use when document is already uploaded
  @ValidateIf(o => !o.docBase64)
  @IsString()
  @IsOptional()
  docUrl?: string;

  // Use when uploading a new document
  @ValidateIf(o => !o.docUrl)
  @IsString()
  @IsOptional()
  docBase64?: string;

  @IsOptional()
  @IsString()
  fileName?: string;
}
