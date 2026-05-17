import { VerificationResponseDto } from '../../dto/verification-response.dto';
import { VerificationStatus } from '../../enums/verification-status.enum';
import { VerificationType } from '../../enums/verification-type.enum';

export class EqualMapper {
  static mapResponse(
    raw: any,
    verificationType: VerificationType,
  ): VerificationResponseDto {
    const isSuccess =
      raw?.status === 'success' ||
      raw?.result?.status === 'success' ||
      raw?.data?.status === 'success';

    return {
      verificationType,
      status: isSuccess ? VerificationStatus.SUCCESS : VerificationStatus.FAILED,
      vendorReferenceId: raw?.transaction_id || raw?.id,
      extractedData: raw?.result?.data || raw?.data || null,
      rawVendorResponse: raw,
      errorMessage: isSuccess ? undefined : raw?.message || raw?.error || 'Verification failed',
    };
  }
}
