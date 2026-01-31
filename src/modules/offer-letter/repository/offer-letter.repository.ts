import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateDetails } from '../../e-onboarding/entities/candidate-details.entity';
import { EOnboardingResponse } from '../../e-onboarding/entities/e-onboarding-response.entity';

@Injectable()
export class OfferLetterRepository {
  private readonly logger = new Logger(OfferLetterRepository.name);

  constructor(
    @InjectRepository(CandidateDetails)
    private readonly candidateRepo: Repository<CandidateDetails>,

    @InjectRepository(EOnboardingResponse)
    private readonly responseRepo: Repository<EOnboardingResponse>,
  ) {}

  async getSubmittedCandidates(orgId: number, status?: string): Promise<any[]> {
    try {
      const query = this.candidateRepo
        .createQueryBuilder('candidate')
        .leftJoinAndSelect('candidate.response', 'response')
        .leftJoinAndSelect('candidate.documents', 'documents', 'documents.isLatest = :isLatest', { isLatest: true })
        .where('response.isCompleted = :isCompleted', { isCompleted: true });

      if (status) {
        query.andWhere('response.status = :status', { status: status.toUpperCase() });
      }

      const candidates = await query.getMany();

      return candidates.map(candidate => ({
        candidateId: candidate.candidateId,
        fullName: candidate.fullName,
        email: candidate.email,
        mobileNo: candidate.mobileNo,
        aadharNo: candidate.aadharNo,
        panNo: candidate.panNo,
        status: candidate.response?.status || 'SUBMITTED',
        submittedDate: candidate.response?.updatedDate,
        documentsCount: candidate.documents?.length || 0,
        customFieldsJson: candidate.customFieldsJson ? JSON.parse(candidate.customFieldsJson) : null,
        otherDetailsJson: candidate.otherDetailsJson ? JSON.parse(candidate.otherDetailsJson) : null,
      }));
    } catch (err) {
      this.logger.error('getSubmittedCandidates failed', err as any);
      throw err;
    }
  }

  async getCandidateDetails(candidateId: number): Promise<any | null> {
    try {
      const candidate = await this.candidateRepo
        .createQueryBuilder('candidate')
        .leftJoinAndSelect('candidate.response', 'response')
        .leftJoinAndSelect('candidate.documents', 'documents', 'documents.isLatest = :isLatest', { isLatest: true })
        .where('candidate.candidateId = :candidateId', { candidateId })
        .getOne();

      if (!candidate) return null;

      return {
        candidateId: candidate.candidateId,
        fullName: candidate.fullName,
        email: candidate.email,
        mobileNo: candidate.mobileNo,
        aadharNo: candidate.aadharNo,
        panNo: candidate.panNo,
        passportNo: candidate.passportNo,
        uanNo: candidate.uanNo,
        status: candidate.response?.status || 'SUBMITTED',
        isCompleted: candidate.response?.isCompleted || false,
        submittedDate: candidate.response?.updatedDate,
        createdDate: candidate.createdDate,
        updatedDate: candidate.updatedDate,
        customFieldsJson: candidate.customFieldsJson ? JSON.parse(candidate.customFieldsJson) : null,
        otherDetailsJson: candidate.otherDetailsJson ? JSON.parse(candidate.otherDetailsJson) : null,
        documents: candidate.documents?.map(doc => ({
          candidateDocumentId: doc.candidateDocumentId,
          docId: doc.docId,
          docType: doc.docType,
          docUrl: doc.docUrl,
          storageSource: doc.storageSource,
          createdDate: doc.createdDate,
        })) || [],
      };
    } catch (err) {
      this.logger.error('getCandidateDetails failed', err as any);
      throw err;
    }
  }

  async getCandidatesByStatus(orgId: number, status: string): Promise<any[]> {
    try {
      const candidates = await this.candidateRepo
        .createQueryBuilder('candidate')
        .leftJoinAndSelect('candidate.response', 'response')
        .where('response.status = :status', { status: status.toUpperCase() })
        .andWhere('response.isCompleted = :isCompleted', { isCompleted: true })
        .getMany();

      return candidates.map(candidate => ({
        candidateId: candidate.candidateId,
        fullName: candidate.fullName,
        email: candidate.email,
        mobileNo: candidate.mobileNo,
        status: candidate.response?.status,
        submittedDate: candidate.response?.updatedDate,
      }));
    } catch (err) {
      this.logger.error('getCandidatesByStatus failed', err as any);
      throw err;
    }
  }
}