import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { QcVerification } from '../entities/qc-verification.entity';
import { EOnboardingDocuments } from '../entities/e-onboarding-documents.entity';

@Injectable()
export class QcVerificationRepository {
  private readonly logger = new Logger(QcVerificationRepository.name);

  constructor(
    @InjectRepository(QcVerification)
    private readonly qcVerificationRepo: Repository<QcVerification>,
    private readonly dataSource: DataSource,
  ) {}

  private escapeValue(value: any): string {
    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'number') return value.toString();
    return `N'${value.toString().replace(/'/g, "''")}'`;
  }

  async createQcVerificationEntries(candidateId: number, documents: EOnboardingDocuments[]): Promise<void> {
    try {
      const qcEntries = documents.map(doc => ({
        candidateId,
        documentId: doc.candidateDocumentId,
        docType: doc.docType,
        qcStatus: 'PENDING'
      }));

      // Try repository save, fallback to raw query if metadata missing
      try {
        const entities = this.qcVerificationRepo.create(qcEntries as any);
        await this.qcVerificationRepo.save(entities);
        return;
      } catch (repoErr) {
        this.logger.warn('Repository save failed, falling back to raw SQL', repoErr as any);
      }

      // Raw insert for MSSQL
      for (const entry of qcEntries) {
        const sql = `INSERT INTO QcVerification (CandidateId, DocumentId, DocType, QcStatus, CreatedDate) VALUES (${this.escapeValue(entry.candidateId)}, ${this.escapeValue(entry.documentId)}, ${this.escapeValue(entry.docType)}, ${this.escapeValue(entry.qcStatus)}, GETDATE())`;
        await this.dataSource.query(sql);
      }
    } catch (err) {
      this.logger.error('createQcVerificationEntries failed', err as any);
      throw err;
    }
  }

  async updateQcVerification(candidateId: number, qcData: { docType: string; status: string; remarks?: string; verifiedBy?: string }): Promise<void> {
    try {
      // Try repo update first
      try {
        await this.qcVerificationRepo.update(
          {  docType: qcData.docType },
          {
            qcStatus: qcData.status,
            qcRemarks: qcData.remarks,
            verifiedBy: qcData.verifiedBy,
            updatedDate: new Date()
          }
        );
        return;
      } catch (repoErr) {
        this.logger.warn('Repository update failed, falling back to raw SQL', repoErr as any);
      }

      // Raw update
      const sql = `UPDATE QcVerification SET QcStatus = ${this.escapeValue(qcData.status)}, QcRemarks = ${this.escapeValue(qcData.remarks)}, VerifiedBy = ${this.escapeValue(qcData.verifiedBy)}, UpdatedDate = GETDATE() WHERE CandidateId = ${this.escapeValue(candidateId)} AND DocType = ${this.escapeValue(qcData.docType)}`;
      await this.dataSource.query(sql);
    } catch (err) {
      this.logger.error('updateQcVerification failed', err as any);
      throw err;
    }
  }

 async getQcVerificationStatus(candidateId: number): Promise<QcVerification[]> {
  try {
    return await this.qcVerificationRepo.find({
      where: {
        candidate: {
          candidateId: candidateId,
        },
      },
      select: {
        qcVerificationId: true,
        docType: true,
        qcStatus: true,
        qcRemarks: true,
        verifiedBy: true,
        createdDate: true,
        updatedDate: true,
      },
    });
  } catch (err) {
    this.logger.error('getQcVerificationStatus failed', err as any);
    throw err;
  }
}

  async getQcVerificationByDocType(
  candidateId: number,
  docType: string,
): Promise<QcVerification | null> {
  try {
    return await this.qcVerificationRepo.findOne({
      where: {
        candidate: {
          candidateId: candidateId,
        },
        docType: docType,
      },
    });
  } catch (err) {
    this.logger.error('getQcVerificationByDocType failed', err as any);
    throw err;
  }
}
async getAllPendingQcVerifications(
  candidateId: number,
): Promise<QcVerification[]> {
  try {
    return await this.qcVerificationRepo.find({
      where: {
        candidate: {
          candidateId: candidateId,
        },
        qcStatus: 'PENDING',
      },
      select: {
        qcVerificationId: true,
        docType: true,
        qcStatus: true,
      },
    });
  } catch (err) {
    this.logger.error('getAllPendingQcVerifications failed', err as any);
    throw err;
  }
}
}