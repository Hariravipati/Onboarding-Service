import { VerificationStatus } from '../enums/verification-status.enum';
import { VerificationType } from '../enums/verification-type.enum';

export class VerificationResponseDto {
  verificationType: VerificationType;
  status: VerificationStatus;
  vendorReferenceId?: string;
  extractedData?: Record<string, any>;
  rawVendorResponse?: Record<string, any>;
  errorMessage?: string;
}
