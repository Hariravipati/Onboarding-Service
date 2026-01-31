import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CandidateDetails } from '../entities/candidate-details.entity';
import { EOnboardingDocuments } from '../entities/e-onboarding-documents.entity';
import { EOnboardingResponse } from '../entities/e-onboarding-response.entity';
import { CandidateDetailsResponseDto } from '../dto/candidate-response.dto';

@Injectable()
export class CandidateRepository {
  private readonly logger = new Logger(CandidateRepository.name);

  constructor(
    @InjectRepository(CandidateDetails)
    private readonly candidateRepo: Repository<CandidateDetails>,

    @InjectRepository(EOnboardingDocuments)
    private readonly documentRepo: Repository<EOnboardingDocuments>,

    @InjectRepository(EOnboardingResponse)
    private readonly responseRepo: Repository<EOnboardingResponse>,
  ) {}

  async createCandidate(candidateData: Partial<CandidateDetails>): Promise<CandidateDetails> {
    try {
      const candidate = this.candidateRepo.create(candidateData);
      const savedCandidate = await this.candidateRepo.save(candidate);
      
      // Create response record with isSaved = true
      await this.createOrUpdateResponse(savedCandidate.candidateId, true, false);
      
      return savedCandidate;
    } catch (err) {
      this.logger.error('createCandidate failed', err as any);
      throw err;
    }
  }

  async updateCandidate(candidateId: number, candidateData: Partial<CandidateDetails>): Promise<CandidateDetailsResponseDto> {
    try {
      await this.candidateRepo.update(candidateId, candidateData);
      
      // Update response record with isSaved = true
      await this.createOrUpdateResponse(candidateId, true, false);
      
      return await this.findCandidateById(candidateId);
    } catch (err) {
      this.logger.error('updateCandidate failed', err as any);
      throw err;
    }
  }

  async findCandidateById(candidateId: number): Promise<CandidateDetailsResponseDto | null> {
    try {
      const candidate = await this.candidateRepo.findOne({
        where: { candidateId },
        relations: ['documents'],
      });

      if (!candidate) return null;

      // Filter only latest documents
      candidate.documents = candidate.documents?.filter(doc => doc.isLatest) || [];

      return this.mapToResponseDto(candidate);
    } catch (err) {
      this.logger.error('findCandidateById failed', err as any);
      throw err;
    }
  }

  async findCandidateByMobileOrAadhar(
    mobileNo?: string,
    aadharNo?: string,
    excludeCandidateId?: number,
  ): Promise<CandidateDetails | null> {
    try {
      const qb = this.candidateRepo.createQueryBuilder('c').where('1=1');

      if (mobileNo) {
        qb.andWhere('c.mobileNo = :mobileNo', { mobileNo });
      }

      if (aadharNo) {
        qb.andWhere('c.aadharNo = :aadharNo', { aadharNo });
      }

      if (excludeCandidateId) {
        qb.andWhere('c.candidateId != :id', { id: excludeCandidateId });
      }

      return await qb.getOne();
    } catch (err) {
      this.logger.error('findCandidateByMobileOrAadhar failed', err as any);
      throw err;
    }
  }

  async saveDocuments(
    candidate: CandidateDetails,
    documents: any[],
  ): Promise<EOnboardingDocuments[]> {
    try {
      const currentStorageProvider = process.env.STORAGE_PROVIDER || 'LOCAL';
      
      const entities = documents.map(doc => ({
        candidateId: candidate.candidateId,
        docId: doc.docId,
        docType: doc.docType,
        docUrl: doc.docUrl,
        storageSource: currentStorageProvider,
        isLatest: true,
        candidate,
      }));

      const createdEntities = this.documentRepo.create(entities);
      return await this.documentRepo.save(createdEntities);
    } catch (err) {
      this.logger.error('saveDocuments failed', err as any);
      throw err;
    }
  }

  async archiveDocumentsByTypes(candidate: CandidateDetails, docTypes: string[]): Promise<void> {
    try {
      await this.documentRepo.update(
        { candidateId: candidate.candidateId, docType: In(docTypes), isLatest: true },
        { isLatest: false, updatedDate: new Date() }
      );
    } catch (err) {
      this.logger.error('archiveDocumentsByTypes failed', err as any);
      throw err;
    }
  }

  async getCandidateEntity(candidateId: number): Promise<CandidateDetails> {
    try {
      return await this.candidateRepo.findOne({ where: { candidateId } });
    } catch (err) {
      this.logger.error('getCandidateEntity failed', err as any);
      throw err;
    }
  }

  async createOrUpdateResponse(candidateId: number, isSaved: boolean, isCompleted: boolean, status?: string, remarks?: string): Promise<void> {
    try {
      const existingResponse = await this.responseRepo.findOne({ where: { candidateId } });
      
      const updateData = { 
        isSaved, 
        isCompleted, 
        updatedDate: new Date(),
        ...(status && { status }),
        ...(remarks && { remarks })
      };
      
      if (existingResponse) {
        await this.responseRepo.update(candidateId, updateData);
      } else {
        const response = this.responseRepo.create({ candidateId, ...updateData });
        await this.responseRepo.save(response);
      }
    } catch (err) {
      this.logger.error('createOrUpdateResponse failed', err as any);
      throw err;
    }
  }

  async submitCandidate(candidateId: number): Promise<void> {
    try {
      await this.createOrUpdateResponse(candidateId, true, true);
    } catch (err) {
      this.logger.error('submitCandidate failed', err as any);
      throw err;
    }
  }

  async getDocumentsByType(candidateId: number, docType?: string): Promise<EOnboardingDocuments[]> {
    try {
      const query = this.documentRepo.createQueryBuilder('doc')
        .where('doc.candidateId = :candidateId', { candidateId })
        .andWhere('doc.isLatest = :isLatest', { isLatest: true });

      if (docType) {
        query.andWhere('doc.docType = :docType', { docType });
      }

      return await query.getMany();
    } catch (err) {
      this.logger.error('getDocumentsByType failed', err as any);
      throw err;
    }
  }

  async approveCandidate(candidateId: number, remarks?: string): Promise<void> {
    try {
      await this.createOrUpdateResponse(candidateId, true, true, 'APPROVED', remarks);
    } catch (err) {
      this.logger.error('approveCandidate failed', err as any);
      throw err;
    }
  }

  private mapToResponseDto(candidate: CandidateDetails): CandidateDetailsResponseDto {
    return {
      candidateId: candidate.candidateId,
      fullName: candidate.fullName,
      email: candidate.email,
      mobileNo: candidate.mobileNo,
      aadharNo: candidate.aadharNo,
      panNo: candidate.panNo,
      passportNo: candidate.passportNo,
      uanNo: candidate.uanNo,
      customFieldsJson: candidate.customFieldsJson
        ? JSON.parse(candidate.customFieldsJson)
        : null,
      otherDetailsJson: candidate.otherDetailsJson
        ? JSON.parse(candidate.otherDetailsJson)
        : null,
      documents: candidate.documents?.map(doc => ({
        candidateDocumentId: doc.candidateDocumentId,
        docId: doc.docId,
        docType: doc.docType,
        docUrl: doc.docUrl,
        storageSource: doc.storageSource,
      })),
    };
  }
}