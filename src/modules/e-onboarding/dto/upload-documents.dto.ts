import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCandidateDocumentDto } from './candidate-documents.dto';

export class UploadDocumentsDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateCandidateDocumentDto)
  documents: CreateCandidateDocumentDto[];
}