import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationAudit } from '../entities/verification-audit.entity';
import { CandidateVerification } from '../entities/candidate-verification.entity';
import { VerificationStatus } from '../enums/verification-status.enum';
import { VerificationType } from '../enums/verification-type.enum';
import { VendorType } from '../enums/vendor-type.enum';
import { VerificationResponseDto } from '../dto/verification-response.dto';

@Injectable()
export class VerificationAuditService {
  private readonly logger = new Logger(VerificationAuditService.name);

  constructor(
    @InjectRepository(CandidateVerification)
    private readonly verificationRepo: Repository<CandidateVerification>,
    @InjectRepository(VerificationAudit)
    private readonly auditRepo: Repository<VerificationAudit>,
  ) {}

  async saveVerificationResult(
    candidateId: number,
    tenantId: number,
    vendor: VendorType,
    result: VerificationResponseDto,
    actor = 'SYSTEM',
  ): Promise<CandidateVerification> {
    const existing = await this.verificationRepo.findOne({
      where: { candidateId, tenantId, verificationType: result.verificationType },
    });

    const oldStatus = existing?.status;

    const record = this.verificationRepo.create({
      ...(existing ?? {}),
      candidateId,
      tenantId,
      vendor,
      verificationType: result.verificationType,
      status: result.status,
      vendorReferenceId: result.vendorReferenceId,
      extractedDataJson: result.extractedData ? JSON.stringify(result.extractedData) : null,
      rawVendorResponseJson: result.rawVendorResponse ? JSON.stringify(result.rawVendorResponse) : null,
      errorMessage: result.errorMessage,
      retryCount: existing ? (existing.retryCount + 1) : 0,
    });

    const saved = await this.verificationRepo.save(record);

    await this.auditRepo.save(
      this.auditRepo.create({
        candidateVerificationId: saved.id,
        tenantId,
        action: existing ? 'RETRY' : 'INITIATE',
        oldStatus,
        newStatus: result.status,
        actor,
        actorType: 'SYSTEM',
      }),
    );

    this.logger.log(`Saved verification [${result.verificationType}] for candidate ${candidateId} → ${result.status}`);
    return saved;
  }

  async getVerificationResults(candidateId: number, tenantId: number): Promise<CandidateVerification[]> {
    return this.verificationRepo.find({ where: { candidateId, tenantId } });
  }

  async overrideVerification(
    verificationId: string,
    tenantId: number,
    newStatus: VerificationStatus,
    actor: string,
    remarks?: string,
  ): Promise<CandidateVerification> {
    const record = await this.verificationRepo.findOneOrFail({ where: { id: verificationId, tenantId } });
    const oldStatus = record.status;
    record.status = newStatus;
    record.errorMessage = remarks;
    const saved = await this.verificationRepo.save(record);

    await this.auditRepo.save(
      this.auditRepo.create({
        candidateVerificationId: verificationId,
        tenantId,
        action: 'MANUAL_OVERRIDE',
        oldStatus,
        newStatus,
        actor,
        actorType: 'HR',
      }),
    );

    return saved;
  }

  async getAuditTrail(candidateVerificationId: string): Promise<VerificationAudit[]> {
    return this.auditRepo.find({ where: { candidateVerificationId } });
  }
}
