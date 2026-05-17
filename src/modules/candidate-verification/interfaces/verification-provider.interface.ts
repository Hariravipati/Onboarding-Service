import { AadhaarRequestDto, BankRequestDto, PanRequestDto } from '../dto/pan-request.dto';
import { VerificationResponseDto } from '../dto/verification-response.dto';

export interface IVerificationProvider {
  extractPan(file: Buffer): Promise<VerificationResponseDto>;
  verifyPan(request: PanRequestDto): Promise<VerificationResponseDto>;
  extractAadhaar(front: Buffer, back: Buffer): Promise<VerificationResponseDto>;
  verifyAadhaar(request: AadhaarRequestDto): Promise<VerificationResponseDto>;
  verifyBank(request: BankRequestDto): Promise<VerificationResponseDto>;
}
