import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { CreateCandidateDto } from '../dto/candidate-details.dto';
import { CandidateRepository } from '../repository/candidate.repository';
import { CandidateDetailsResponseDto } from '../dto/candidate-response.dto';
import { FILE_STORAGE_SERVICE } from 'src/common/file-storage/file-storage.factory';
import { IFileStorageService } from 'src/common/file-storage/file-storage.interface';
import { QcVerificationService } from './qc-verification.service';
import { EOnboardingRequestService } from './e-onboardingRequest.service';


@Injectable()
export class CandidateService {
  private readonly logger = new Logger(CandidateService.name);
  constructor(
    private readonly candidateRepository: CandidateRepository,
    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorageService: IFileStorageService,
    private readonly qcVerificationService: QcVerificationService,
    
    private readonly eobOoardingRequestService : EOnboardingRequestService

  ) {}

  async createCandidate(
    dto: CreateCandidateDto,
    orgId: number,
  ): Promise<CandidateDetailsResponseDto> {
    try {
      this.logger.log('Creating candidate', { email: dto.email, mobileNo: dto.mobileNo });
      
      await this.checkDuplicateMobileAadhar(
        dto.mobileNo,
        dto.aadharNo,
      );

      const candidateData = {
        aadharNo: dto.aadharNo,
        mobileNo: dto.mobileNo,
        panNo: dto.panNo,
        fullName: dto.fullName,
        otherDetailsJson: dto.otherDetailsJson
          ? JSON.stringify(dto.otherDetailsJson)
          : null,
        passportNo: dto.passportNo,
        uanNo: dto.uanNo,
        email: dto.email,
        customFieldsJson: dto.customFieldsJson
          ? JSON.stringify(dto.customFieldsJson)
          : null,
      };
      
      const savedCandidate = await this.candidateRepository.createCandidate(candidateData);
      this.logger.log('Candidate saved', { candidateId: savedCandidate.candidateId });
      
      if (dto.documents) {
        const documentsWithUrls = await this.processDocumentUploads(dto.documents);
        await this.candidateRepository.saveDocuments(savedCandidate, documentsWithUrls);
        // QC verification entries will be created during final submit
        this.logger.log('Documents saved', { candidateId: savedCandidate.candidateId, docCount: dto.documents.length });
      }
      
      const result = await this.getCandidateById(savedCandidate.candidateId,orgId);
      this.logger.log('Candidate created successfully', { candidateId: savedCandidate.candidateId });
      return result;
    } catch (error) {
      this.logger.error('Failed to create candidate', error.stack, { dto });
      throw error;
    }
  }

  async updateCandidate(
    candidateId: number,
    dto: CreateCandidateDto,
    orgId: number,
  ): Promise<CandidateDetailsResponseDto> {
    const candidate = await this.candidateRepository.findCandidateById(candidateId);

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    await this.checkDuplicateMobileAadhar(
      dto.mobileNo,
      dto.aadharNo,
      candidateId,
    );

    const updateData = {
      fullName: dto.fullName ?? candidate.fullName,
      email: dto.email ?? candidate.email,
      mobileNo: dto.mobileNo ?? candidate.mobileNo,
      aadharNo: dto.aadharNo ?? candidate.aadharNo,
      panNo: dto.panNo ?? candidate.panNo,
      passportNo: dto.passportNo ?? candidate.passportNo,
      uanNo: dto.uanNo ?? candidate.uanNo,
      customFieldsJson: dto.customFieldsJson
        ? JSON.stringify(dto.customFieldsJson)
        : candidate.customFieldsJson,
      otherDetailsJson: dto.otherDetailsJson
        ? JSON.stringify(dto.otherDetailsJson)
        : candidate.otherDetailsJson,
      updatedDate: new Date(),
    };

    await this.candidateRepository.updateCandidate(candidateId, updateData);

    if (dto.documents?.length) {
      const candidateEntity = await this.candidateRepository.getCandidateEntity(candidateId);
      const docTypes = dto.documents.map(doc => doc.docType);
      await this.candidateRepository.archiveDocumentsByTypes(candidateEntity, docTypes);
      const documentsWithUrls = await this.processDocumentUploads(dto.documents);
      const savedDocuments = await this.candidateRepository.saveDocuments(candidateEntity, documentsWithUrls);
      // QC verification entries will be created during final submit
    }

    return this.getCandidateById(candidateId, orgId);
  }

  async getCandidateById(
    candidateId: number,
    orgId: number,
  ): Promise<CandidateDetailsResponseDto> {
    const candidate = await this.candidateRepository.findCandidateById(candidateId);

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    return candidate;
  }

  private async checkDuplicateMobileAadhar(
    mobileNo?: string,
    aadharNo?: string,
    excludeCandidateId?: number,
  ) {
    if (!mobileNo && !aadharNo) return;

    const exists = await this.candidateRepository.findCandidateByMobileOrAadhar(
      mobileNo,
      aadharNo,
      excludeCandidateId,
    );

    if (exists) {
      throw new BadRequestException(
        'Mobile number or Aadhar number already exists',
      );
    }
  }

  async uploadDocuments(
    candidateId: number,
    documents: any[],
    orgId: number,
  ): Promise<CandidateDetailsResponseDto> {
    const candidate = await this.candidateRepository.findCandidateById(candidateId);

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    const candidateEntity = await this.candidateRepository.getCandidateEntity(candidateId);
    const docTypes = documents.map(doc => doc.docType);
    await this.candidateRepository.archiveDocumentsByTypes(candidateEntity, docTypes);
    
    const documentsWithUrls = await this.processDocumentUploads(documents);
    const savedDocuments = await this.candidateRepository.saveDocuments(candidateEntity, documentsWithUrls);
    // await this.qcVerificationService.createQcVerificationEntries(candidateId, savedDocuments);

    return this.getCandidateById(candidateId,orgId);
  }

  async submitCandidate(candidateId: number, orgId: number): Promise<{ message: string }> {
    try {
      this.logger.log('Submitting candidate', { candidateId, orgId });
      const candidate = await this.candidateRepository.findCandidateById(candidateId);
      this.logger.log('Found candidate for submission', { candidateId, fullName: candidate.fullName } );

      if (!candidate) {
        throw new NotFoundException('Candidate not found');
      }

      // Ensure QC verification entries exist for current documents (create on submit)
      const documents = await this.candidateRepository.getDocumentsByType(candidateId);
      this.logger.log('Found documents for QC creation', { candidateId, docCount: documents.length });
      if (documents?.length) {
        const existingQc = await this.qcVerificationService.getQcVerificationStatus(candidateId, orgId);
        this.logger.log('Existing QC verification entries', { candidateId, count: existingQc.length });
        const existingDocTypes = existingQc.map(q => q.docType);
        this.logger.log('Comparing doc types for QC creation', { existing: existingDocTypes, incoming: existingDocTypes });
        const docsToCreate = documents.filter(doc => !existingDocTypes.includes(doc.docType));
        if (docsToCreate.length) {
          await this.qcVerificationService.createQcVerificationEntries(candidateId, docsToCreate);
          this.logger.log('QC verification entries created on submit', { candidateId, createdCount: docsToCreate.length });
        }
      }
      await this.candidateRepository.submitCandidate(candidateId);
      await this.eobOoardingRequestService.submitEobRequest(candidate.eobRequestId, orgId);
      this.logger.log('Candidate submitted successfully', { candidateId, orgId });
      
      return { message: 'Candidate submitted successfully' };
    } catch (error) {
      this.logger.error('Failed to submit candidate', error.stack, { candidateId });
      throw error;
    }
  }

  private async processDocumentUploads(documents: any[]): Promise<any[]> {
    const documentsWithUrls = [];

    for (const doc of documents) {
      let docUrl = doc.docUrl;

      if (doc.docBuffer && doc.fileName) {
        docUrl = await this.fileStorageService.uploadFile(
          doc.docBuffer,
          doc.fileName,
          doc.contentType,
        );
      }

      documentsWithUrls.push({
        ...doc,
        docUrl,
      });
    }

    return documentsWithUrls;
  }

  async getDocumentsPreview(
    candidateId: number,
    docType?: string,
    orgId?: number,
  ): Promise<any[]> {
    try {
      this.logger.log('Getting documents preview', { candidateId, docType });
      
      const documents = await this.candidateRepository.getDocumentsByType(candidateId, docType);
      
      const documentsWithBase64 = [];
      
      for (const doc of documents) {
        try {
          const base64Content = await this.fileStorageService.getFileAsBase64(doc.docUrl);
          documentsWithBase64.push({
            candidateDocumentId: doc.candidateDocumentId,
            docId: doc.docId,
            docType: doc.docType,
            docUrl: doc.docUrl,
            storageSource: doc.storageSource,
            base64Content,
            createdDate: doc.createdDate,
          });
        } catch (error) {
          this.logger.warn(`Failed to get base64 for document ${doc.candidateDocumentId}`, error.message);
          documentsWithBase64.push({
            candidateDocumentId: doc.candidateDocumentId,
            docId: doc.docId,
            docType: doc.docType,
            docUrl: doc.docUrl,
            storageSource: doc.storageSource,
            base64Content: null,
            error: 'Failed to load document content',
            createdDate: doc.createdDate,
          });
        }
      }
      
      this.logger.log('Documents preview retrieved', { candidateId, count: documentsWithBase64.length });
      return documentsWithBase64;
    } catch (error) {
      this.logger.error('Failed to get documents preview', error.stack, { candidateId, docType });
      throw error;
    }
  }

  async getCandidateForPreview(
    candidateId: number,
    orgId: number,
  ): Promise<any> {
    try {
      const candidate = await this.getCandidateById(candidateId, orgId);
      const documents = await this.getDocumentsPreview(candidateId, undefined, orgId);
      // const qcStatus = await this.qcVerificationService.getQcVerificationStatus(candidateId, orgId);
      // const qcSummary = await this.qcVerificationService.getQcSummary(candidateId);
      
      return {
        ...candidate,
        documentsWithPreview: documents,
        // qcVerificationStatus: qcStatus,
        // qcSummary,
        // readyForApproval: qcSummary.readyForSubmission
      };
    } catch (error) {
      this.logger.error('Failed to get candidate for preview', error.stack, { candidateId });
      throw error;
    }
  }

  async approveCandidate(
    candidateId: number,
    orgId: number,
    remarks?: string,
  ): Promise<{ message: string }> {
    try {
      const candidate = await this.candidateRepository.findCandidateById(candidateId);
      if (!candidate) {
        throw new NotFoundException('Candidate not found');
      }

      await this.candidateRepository.approveCandidate(candidateId, remarks);
      this.logger.log('Candidate approved', { candidateId, orgId });
      
      return { message: 'Candidate approved successfully' };
    } catch (error) {
      this.logger.error('Failed to approve candidate', error.stack, { candidateId });
      throw error;
    }
  }

  async getQcVerificationStatus(
    candidateId: number,
    orgId: number,
  ): Promise<any[]> {
    const result =   await this.qcVerificationService.getQcVerificationStatus(candidateId, orgId);
     return [];
  }


   async getPendingVerfifcationRequests(
    candidateId: number,
    orgId: number,
  ): Promise<any[]> {
    const result =   await this.qcVerificationService.getQcVerificationStatus(candidateId, orgId);
    const filteredResult = result.filter(item => item.qcStatus === 'PENDING');
    return filteredResult;
  }
}