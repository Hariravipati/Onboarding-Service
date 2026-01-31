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

  @ValidateIf(o => !o.docBuffer)
  @IsString()
  @IsOptional()
  docUrl?: string;

  @ValidateIf(o => !o.docUrl)
  @IsOptional()
  docBuffer?: Buffer;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  contentType?: string;
}
