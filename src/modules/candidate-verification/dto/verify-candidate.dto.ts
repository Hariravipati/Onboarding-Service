import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class VerifyCandidateDto {
  @IsNotEmpty()
  @IsNumber()
  candidateId: number;

  // PAN
  @IsOptional()
  @IsString()
  panNumber?: string;

  @IsOptional()
  panImageBase64?: string;

  // Aadhaar
  @IsOptional()
  @IsString()
  aadhaarNumber?: string;

  @IsOptional()
  aadhaarFrontBase64?: string;

  @IsOptional()
  aadhaarBackBase64?: string;

  // Bank
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  ifsc?: string;

  @IsOptional()
  @IsString()
  accountHolderName?: string;
}
