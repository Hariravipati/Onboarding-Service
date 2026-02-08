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
  ) { }

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
        qcStatus: 'PENDING'
      }));

      try {
        const entities = this.qcVerificationRepo.create(qcEntries as any);
        await this.qcVerificationRepo.save(entities);
        return;
      } catch (repoErr) {
        this.logger.warn('Repository save failed, falling back to raw SQL', repoErr as any);
      }

      for (const entry of qcEntries) {
        const sql = `INSERT INTO QcVerification (CandidateId, DocumentId, QcStatus, CreatedDate) VALUES (${this.escapeValue(entry.candidateId)}, ${this.escapeValue(entry.documentId)}, ${this.escapeValue(entry.qcStatus)}, GETDATE())`;
        await this.dataSource.query(sql);
      }
    } catch (err) {
      this.logger.error('createQcVerificationEntries failed', err as any);
      throw err;
    }
  }

  async updateQcVerification(candidateId: number, documentId: number, qcData: { status: string; remarks?: string; verifiedBy?: string }): Promise<void> {
    try {
      try {
        await this.qcVerificationRepo.update(
          { candidateId, documentId },
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

      const sql = `UPDATE QcVerification SET QcStatus = ${this.escapeValue(qcData.status)}, QcRemarks = ${this.escapeValue(qcData.remarks)}, VerifiedBy = ${this.escapeValue(qcData.verifiedBy)}, UpdatedDate = GETDATE() WHERE CandidateId = ${this.escapeValue(candidateId)} AND DocumentId = ${this.escapeValue(documentId)}`;
      await this.dataSource.query(sql);
    } catch (err) {
      this.logger.error('updateQcVerification failed', err as any);
      throw err;
    }
  }

  async getQcVerificationStatus(candidateId: number): Promise<QcVerification[]> {
    try {
      const qcData = await this.dataSource.query(
        `SELECT * FROM QcVerification
         WHERE CandidateId = $1`,
        [candidateId]
      );

      return qcData as QcVerification[];
    } catch (err) {
      this.logger.error('getQcVerificationStatus failed', err as any);
      throw err;
    }
  }

  async getQcVerificationByDocumentId(
    candidateId: number,
    documentId: number,
  ): Promise<QcVerification | null> {
    try {
      return await this.qcVerificationRepo.findOne({
        where: {
          candidateId: candidateId,
          documentId: documentId,
        },
      });
    } catch (err) {
      this.logger.error('getQcVerificationByDocumentId failed', err as any);
      throw err;
    }
  }
  async getAllPendingQcVerifications(
    candidateId: number,
  ): Promise<QcVerification[]> {
    try {
      return await this.qcVerificationRepo.find({
        where: {
          candidateId: candidateId,
          qcStatus: 'PENDING',
        },
        select: {
          qcVerificationId: true,
          documentId: true,
          qcStatus: true,
        },
      });
    } catch (err) {
      this.logger.error('getAllPendingQcVerifications failed', err as any);
      throw err;
    }
  }
}