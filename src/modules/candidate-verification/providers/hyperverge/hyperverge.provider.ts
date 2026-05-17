import { Injectable } from '@nestjs/common';
import { IVerificationProvider } from '../../interfaces/verification-provider.interface';
import { AadhaarRequestDto, BankRequestDto, PanRequestDto } from '../../dto/pan-request.dto';
import { VerificationResponseDto } from '../../dto/verification-response.dto';

@Injectable()
export class HyperVergeProvider implements IVerificationProvider {
  async extractPan(_file: Buffer): Promise<VerificationResponseDto> {
    throw new Error('HyperVerge provider not yet implemented');
  }

  async verifyPan(_dto: PanRequestDto): Promise<VerificationResponseDto> {
    throw new Error('HyperVerge provider not yet implemented');
  }

  async extractAadhaar(_front: Buffer, _back: Buffer): Promise<VerificationResponseDto> {
    throw new Error('HyperVerge provider not yet implemented');
  }

  async verifyAadhaar(_dto: AadhaarRequestDto): Promise<VerificationResponseDto> {
    throw new Error('HyperVerge provider not yet implemented');
  }

  async verifyBank(_dto: BankRequestDto): Promise<VerificationResponseDto> {
    throw new Error('HyperVerge provider not yet implemented');
  }
}
