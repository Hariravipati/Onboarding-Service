// dto/create-e-onboarding-request.dto.ts
import {
  IsEmail,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  MaxLength,
} from 'class-validator';

export class CreateEOnboardingRequestDto {
  @IsEmail()
  @MaxLength(200)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  mobileNo?: string;

  @IsDateString()
  expiryDate: Date;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string; // default handled in entity

  @IsNumber()
  formVersionId: number;
}
