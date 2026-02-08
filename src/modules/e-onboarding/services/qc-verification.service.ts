import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { QcVerificationRepository } from '../repository/qc-verification.repository';
import { EOnboardingDocuments } from '../entities/e-onboarding-documents.entity';
import { QcVerification } from '../entities/qc-verification.entity';
import { CandidateRepository } from '../repository/candidate.repository';

@Injectable()
export class QcVerificationService {
  private readonly logger = new Logger(QcVerificationService.name);

  constructor(
    private readonly qcVerificationRepository: QcVerificationRepository,
    private readonly candidateRepository: CandidateRepository
  ) { }

  async createQcVerificationEntries(candidateId: number, documents: EOnboardingDocuments[]): Promise<void> {
    try {
      await this.qcVerificationRepository.createQcVerificationEntries(candidateId, documents);
      this.logger.log('QC verification entries created', { candidateId, documentCount: documents.length });
    } catch (error) {
      this.logger.error('Failed to create QC verification entries', error.stack, { candidateId });
      throw error;
    }
  }

  async updateQcVerification(
    candidateId: number,
    documentId: number,
    qcData: { docType: string; status: string; remarks?: string; verifiedBy?: string }
  ): Promise<{ message: string }> {
    try {
      // Validate QC status
      if (!['PENDING', 'APPROVED', 'REJECTED'].includes(qcData.status)) {
        throw new BadRequestException('Invalid QC status. Must be PENDING, APPROVED, or REJECTED');
      }

      // Check if QC verification exists
      const existingQc = await this.qcVerificationRepository.getQcVerificationStatus(candidateId)
      if (!existingQc) {
        throw new NotFoundException(`QC verification not found for document type: ${qcData.docType}`);
      }

      await this.qcVerificationRepository.updateQcVerification(candidateId, documentId, qcData)
      this.logger.log('QC verification updated', { candidateId, docType: qcData.docType, status: qcData.status });

      return { message: 'QC verification updated successfully' };
    } catch (error) {
      this.logger.error('Failed to update QC verification', error.stack, { candidateId, qcData });
      throw error;
    }
  }

  async getQcVerificationStatus(candidateId: number, orgId: number): Promise<QcVerification[]> {
    try {
      const qcVerifications = await this.qcVerificationRepository.getQcVerificationStatus(candidateId);
      this.logger.log('QC verification status retrieved', { candidateId, count: qcVerifications.length });
      return qcVerifications;
    } catch (error) {
      this.logger.error('Failed to get QC verification status', error.stack, { candidateId });
      throw error;
    }
  }

  async validateAllQcApproved(candidateId: number): Promise<{ isAllApproved: boolean; pendingDocTypes: string[] }> {
    try {
      const pendingQc = await this.qcVerificationRepository.getAllPendingQcVerifications(candidateId);
      const rejectedQc = await this.qcVerificationRepository.getQcVerificationStatus(candidateId);
      const rejected = rejectedQc.filter(qc => qc.qcStatus === 'REJECTED');

      const allPendingOrRejected = [...pendingQc, ...rejected];

      return {
        isAllApproved: allPendingOrRejected.length === 0,
        pendingDocTypes: allPendingOrRejected.map(qc => `${qc.docType} (${qc.qcStatus})`)
      };
    } catch (error) {
      this.logger.error('Failed to validate QC approval status', error.stack, { candidateId });
      throw error;
    }
  }

  async getQcSummary(candidateId: number): Promise<any> {
    try {
      const qcVerifications = await this.qcVerificationRepository.getQcVerificationStatus(candidateId);

      const summary = {
        total: qcVerifications.length,
        approved: qcVerifications.filter(qc => qc.qcStatus === 'APPROVED').length,
        pending: qcVerifications.filter(qc => qc.qcStatus === 'PENDING').length,
        rejected: qcVerifications.filter(qc => qc.qcStatus === 'REJECTED').length,
        readyForSubmission: qcVerifications.every(qc => qc.qcStatus === 'APPROVED')
      };

      return summary;
    } catch (error) {
      this.logger.error('Failed to get QC summary', error.stack, { candidateId });
      throw error;
    }
  }

  async getPendindQc(candidateId[]: number): Promise<any> {
    try {
      const pendingQc = await this.qcVerificationRepository.getAllPendingQcVerifications(candidateId);
      const filteredQc = pendingQc.filter(qc => qc.qcStatus === 'PENDING');
      const candidateDetails = await this.candidateRepository.findCandidateById(candidateId)

      return {
        candidateId: candidateId,
        name: candidateDetails.fullName,
        mobile: candidateDetails.mobileNo,
        aadhar: candidateDetails.aadharNo,
        email: candidateDetails.email,
      }

    } catch (error) {
      this.logger.error('Failed to get pending QC verifications', error.stack, { candidateId });
      throw error;
    }
  }
}