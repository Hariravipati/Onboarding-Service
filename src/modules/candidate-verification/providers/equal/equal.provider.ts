import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IVerificationProvider } from '../../interfaces/verification-provider.interface';
import { AadhaarRequestDto, BankRequestDto, PanRequestDto } from '../../dto/pan-request.dto';
import { VerificationResponseDto } from '../../dto/verification-response.dto';
import { VerificationType } from '../../enums/verification-type.enum';
import { EqualClient } from './equal.client';
import { EqualMapper } from './equal.mapper';

@Injectable()
export class EqualProvider implements IVerificationProvider {
  constructor(
    private readonly equalClient: EqualClient,
    private readonly configService: ConfigService,
  ) {}

  async extractPan(file: Buffer): Promise<VerificationResponseDto> {
    const raw = await this.equalClient.executeJourney({
      journey_id: this.configService.get('EQUAL_PAN_OCR_JOURNEY_ID'),
      data: { pan_image_base64: file.toString('base64') },
    });
    return EqualMapper.mapResponse(raw, VerificationType.PAN_OCR);
  }

  async verifyPan(dto: PanRequestDto): Promise<VerificationResponseDto> {
    const raw = await this.equalClient.executeJourney({
      journey_id: this.configService.get('EQUAL_PAN_VERIFY_JOURNEY_ID'),
      data: { pan_number: dto.panNumber, name: dto.name },
    });
    return EqualMapper.mapResponse(raw, VerificationType.PAN_VERIFY);
  }

  async extractAadhaar(front: Buffer, back: Buffer): Promise<VerificationResponseDto> {
    const raw = await this.equalClient.executeJourney({
      journey_id: this.configService.get('EQUAL_AADHAAR_OCR_JOURNEY_ID'),
      data: {
        front_base64: front.toString('base64'),
        back_base64: back.toString('base64'),
      },
    });
    return EqualMapper.mapResponse(raw, VerificationType.AADHAAR_OCR);
  }

  async verifyAadhaar(dto: AadhaarRequestDto): Promise<VerificationResponseDto> {
    const raw = await this.equalClient.executeJourney({
      journey_id: this.configService.get('EQUAL_AADHAAR_VERIFY_JOURNEY_ID'),
      data: { aadhaar_number: dto.aadhaarNumber },
    });
    return EqualMapper.mapResponse(raw, VerificationType.AADHAAR_VERIFY);
  }

  async verifyBank(dto: BankRequestDto): Promise<VerificationResponseDto> {
    const raw = await this.equalClient.executeJourney({
      journey_id: this.configService.get('EQUAL_BANK_VERIFY_JOURNEY_ID'),
      data: {
        account_number: dto.accountNumber,
        ifsc: dto.ifsc,
        name: dto.accountHolderName,
      },
    });
    return EqualMapper.mapResponse(raw, VerificationType.BANK_VERIFY);
  }
}
