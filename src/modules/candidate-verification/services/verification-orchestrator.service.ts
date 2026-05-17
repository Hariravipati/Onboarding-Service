import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VerificationProviderFactory } from '../factories/verification-provider.factory';
import { VerificationAuditService } from './verification-audit.service';
import { VerifyCandidateDto } from '../dto/verify-candidate.dto';
import { VendorType } from '../enums/vendor-type.enum';
import { VerificationStatus } from '../enums/verification-status.enum';
import { CandidateVerification } from '../entities/candidate-verification.entity';

@Injectable()
export class VerificationOrchestratorService {
  private readonly logger = new Logger(VerificationOrchestratorService.name);

  constructor(
    private readonly providerFactory: VerificationProviderFactory,
    private readonly auditService: VerificationAuditService,
    private readonly configService: ConfigService,
  ) {}

  private getVendor(): VendorType {
    return (this.configService.get<string>('VERIFICATION_VENDOR') || VendorType.MOCK) as VendorType;
  }

  async verifyCandidateDocuments(dto: VerifyCandidateDto, tenantId: number): Promise<{
    candidateId: number;
    results: CandidateVerification[];
    overallStatus: VerificationStatus;
  }> {
    const vendor = this.getVendor();
    const provider = this.providerFactory.getProvider(vendor);
    const saved: CandidateVerification[] = [];

    this.logger.log(`Starting verification for candidate ${dto.candidateId} via vendor [${vendor}]`);

    // 1. PAN OCR
    if (dto.panImageBase64) {
      const panBuffer = Buffer.from(dto.panImageBase64, 'base64');
      const panOcrResult = await provider.extractPan(panBuffer);
      saved.push(await this.auditService.saveVerificationResult(dto.candidateId, tenantId, vendor, panOcrResult));
    }

    // 2. PAN Verify
    if (dto.panNumber) {
      const panVerifyResult = await provider.verifyPan({
        panNumber: dto.panNumber,
        name: dto.accountHolderName || '',
      });
      saved.push(await this.auditService.saveVerificationResult(dto.candidateId, tenantId, vendor, panVerifyResult));
    }

    // 3. Aadhaar OCR
    if (dto.aadhaarFrontBase64 && dto.aadhaarBackBase64) {
      const front = Buffer.from(dto.aadhaarFrontBase64, 'base64');
      const back = Buffer.from(dto.aadhaarBackBase64, 'base64');
      const aadhaarOcrResult = await provider.extractAadhaar(front, back);
      saved.push(await this.auditService.saveVerificationResult(dto.candidateId, tenantId, vendor, aadhaarOcrResult));
    }

    // 4. Aadhaar Verify
    if (dto.aadhaarNumber) {
      const aadhaarVerifyResult = await provider.verifyAadhaar({ aadhaarNumber: dto.aadhaarNumber });
      saved.push(await this.auditService.saveVerificationResult(dto.candidateId, tenantId, vendor, aadhaarVerifyResult));
    }

    // 5. Bank Verify
    if (dto.accountNumber && dto.ifsc) {
      const bankResult = await provider.verifyBank({
        accountNumber: dto.accountNumber,
        ifsc: dto.ifsc,
        accountHolderName: dto.accountHolderName || '',
      });
      saved.push(await this.auditService.saveVerificationResult(dto.candidateId, tenantId, vendor, bankResult));
    }

    const overallStatus = saved.every(r => r.status === VerificationStatus.SUCCESS)
      ? VerificationStatus.SUCCESS
      : saved.some(r => r.status === VerificationStatus.FAILED)
      ? VerificationStatus.FAILED
      : VerificationStatus.PENDING;

    this.logger.log(`Verification complete for candidate ${dto.candidateId} → ${overallStatus}`);

    return { candidateId: dto.candidateId, results: saved, overallStatus };
  }

  async retryVerification(verificationId: string, candidateId: number, tenantId: number): Promise<CandidateVerification[]> {
    const existing = await this.auditService.getVerificationResults(candidateId, tenantId);
    const target = existing.find(r => r.id === verificationId);
    if (!target) throw new Error(`Verification record ${verificationId} not found`);

    const vendor = this.getVendor();
    const provider = this.providerFactory.getProvider(vendor);
    const saved: CandidateVerification[] = [];

    this.logger.log(`Retrying [${target.verificationType}] for candidate ${candidateId}`);

    const extractedData = target.extractedDataJson ? JSON.parse(target.extractedDataJson) : {};

    switch (target.verificationType) {
      case 'PAN_VERIFY':
        if (extractedData.pan_number) {
          const r = await provider.verifyPan({ panNumber: extractedData.pan_number, name: extractedData.name || '' });
          saved.push(await this.auditService.saveVerificationResult(candidateId, tenantId, vendor, r));
        }
        break;
      case 'AADHAAR_VERIFY':
        if (extractedData.aadhaar_number) {
          const r = await provider.verifyAadhaar({ aadhaarNumber: extractedData.aadhaar_number });
          saved.push(await this.auditService.saveVerificationResult(candidateId, tenantId, vendor, r));
        }
        break;
      case 'BANK_VERIFY':
        if (extractedData.account_number) {
          const r = await provider.verifyBank({
            accountNumber: extractedData.account_number,
            ifsc: extractedData.ifsc,
            accountHolderName: extractedData.name || '',
          });
          saved.push(await this.auditService.saveVerificationResult(candidateId, tenantId, vendor, r));
        }
        break;
    }

    return saved;
  }
}
