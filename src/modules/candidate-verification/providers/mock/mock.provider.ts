import { Injectable } from '@nestjs/common';
import { IVerificationProvider } from '../../interfaces/verification-provider.interface';
import { AadhaarRequestDto, BankRequestDto, PanRequestDto } from '../../dto/pan-request.dto';
import { VerificationResponseDto } from '../../dto/verification-response.dto';
import { VerificationStatus } from '../../enums/verification-status.enum';
import { VerificationType } from '../../enums/verification-type.enum';

@Injectable()
export class MockProvider implements IVerificationProvider {
  private mockSuccess(type: VerificationType, data: Record<string, any>): VerificationResponseDto {
    return {
      verificationType: type,
      status: VerificationStatus.SUCCESS,
      vendorReferenceId: `mock-${Date.now()}`,
      extractedData: data,
      rawVendorResponse: { mock: true, ...data },
    };
  }

  async extractPan(_file: Buffer): Promise<VerificationResponseDto> {
    return this.mockSuccess(VerificationType.PAN_OCR, {
      pan_number: 'ABCDE1234F',
      name: 'MOCK USER',
      dob: '01/01/1990',
    });
  }

  async verifyPan(dto: PanRequestDto): Promise<VerificationResponseDto> {
    return this.mockSuccess(VerificationType.PAN_VERIFY, {
      pan_number: dto.panNumber,
      name_match: true,
      valid: true,
    });
  }

  async extractAadhaar(_front: Buffer, _back: Buffer): Promise<VerificationResponseDto> {
    return this.mockSuccess(VerificationType.AADHAAR_OCR, {
      aadhaar_number: 'XXXX-XXXX-1234',
      name: 'MOCK USER',
      dob: '01/01/1990',
      address: 'Mock Address, India',
    });
  }

  async verifyAadhaar(dto: AadhaarRequestDto): Promise<VerificationResponseDto> {
    return this.mockSuccess(VerificationType.AADHAAR_VERIFY, {
      aadhaar_number: dto.aadhaarNumber,
      valid: true,
    });
  }

  async verifyBank(dto: BankRequestDto): Promise<VerificationResponseDto> {
    return this.mockSuccess(VerificationType.BANK_VERIFY, {
      account_number: dto.accountNumber,
      ifsc: dto.ifsc,
      name_match: true,
      account_valid: true,
    });
  }
}
