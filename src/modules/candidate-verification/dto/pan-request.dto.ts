import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PanRequestDto {
  @IsNotEmpty()
  @IsString()
  panNumber: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  candidateVerificationId?: string;
}

export class AadhaarRequestDto {
  @IsNotEmpty()
  @IsString()
  aadhaarNumber: string;

  @IsOptional()
  candidateVerificationId?: string;
}

export class BankRequestDto {
  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @IsNotEmpty()
  @IsString()
  ifsc: string;

  @IsNotEmpty()
  @IsString()
  accountHolderName: string;

  @IsOptional()
  candidateVerificationId?: string;
}
