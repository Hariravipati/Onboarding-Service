import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QcVerification } from '../entities/qc-verification.entity';
import { EOnboardingDocuments } from '../entities/e-onboarding-documents.entity';

@Injectable()
export class QcVerificationRepository {
  private readonly logger = new Logger(QcVerificationRepository.name);

  constructor(
    @InjectRepository(QcVerification)
    private readonly qcVerificationRepo: Repository<QcVerification>,
  ) {}

  async createQcVerificationEntries(candidateId: number, documents: EOnboardingDocuments[]): Promise<void> {
    try {
      const qcEntries = documents.map(doc => ({
        candidateId,
        documentId: doc.candidateDocumentId,
        docType: doc.docType,
        qcStatus: 'PENDING'
      }));
      
      const entities = this.qcVerificationRepo.create(qcEntries);
      await this.qcVerificationRepo.save(entities);
    } catch (err) {
      this.logger.error('createQcVerificationEntries failed', err as any);
      throw err;
    }
  }

  async updateQcVerification(candidateId: number, qcData: { docType: string; status: string; remarks?: string; verifiedBy?: string }): Promise<void> {
    try {
      await this.qcVerificationRepo.update(
        { candidateId, docType: qcData.docType },
        { 
          qcStatus: qcData.status,
          qcRemarks: qcData.remarks,
          verifiedBy: qcData.verifiedBy,
          updatedDate: new Date()
        }
      );
    } catch (err) {
      this.logger.error('updateQcVerification failed', err as any);
      throw err;
    }
  }

  async getQcVerificationStatus(candidateId: number): Promise<QcVerification[]> {
    try {
      return await this.qcVerificationRepo.find({
        where: { candidateId },
        select: ['qcVerificationId', 'docType', 'qcStatus', 'qcRemarks', 'verifiedBy', 'createdDate', 'updatedDate']
      });
    } catch (err) {
      this.logger.error('getQcVerificationStatus failed', err as any);
      throw err;
    }
  }

  async getQcVerificationByDocType(candidateId: number, docType: string): Promise<QcVerification | null> {
    try {
      return await this.qcVerificationRepo.findOne({
        where: { candidateId, docType }
      });
    } catch (err) {
      this.logger.error('getQcVerificationByDocType failed', err as any);
      throw err;
    }
  }

  async getAllPendingQcVerifications(candidateId: number): Promise<QcVerification[]> {
    try {
      return await this.qcVerificationRepo.find({
        where: { candidateId, qcStatus: 'PENDING' }
      });
    } catch (err) {
      this.logger.error('getAllPendingQcVerifications failed', err as any);
      throw err;
    }
  }
}