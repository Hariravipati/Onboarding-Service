import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateDetails } from '../entities/candidate-details.entity';
import { EOnboardingDocuments } from '../entities/e-onboarding-documents.entity';
import { CreateCandidateDto } from '../dto/candidate-details.dto';


@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(CandidateDetails)
    private readonly candidateRepo: Repository<CandidateDetails>,

    @InjectRepository(EOnboardingDocuments)
    private readonly documentRepo: Repository<EOnboardingDocuments>,
  ) { }

  // =========================
  // Create Candidate
  // =========================
  async createCandidate(
    dto: CreateCandidateDto,
  ): Promise<any> {

    await this.checkDuplicateMobileAadhar(
      dto.mobileNo,
      dto.aadharNo,
    );

    const candidate = this.candidateRepo.create({
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
    });
    const savedCandidate = await this.candidateRepo.save(candidate);
    if (dto.documents) {
      await this.saveDocuments(savedCandidate, dto.documents);
    }
    const result = await this.getCandidateById(savedCandidate.candidateId);
    return result;
  }

  // =========================
  // Update Candidate
  // =========================
  async updateCandidate(
    candidateId: number,
    dto: CreateCandidateDto,
  ): Promise<any> {

    const candidate = await this.candidateRepo.findOne({
      where: { candidateId },
    });

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    await this.checkDuplicateMobileAadhar(
      dto.mobileNo,
      dto.aadharNo,
      candidateId,
    );

    Object.assign(candidate, {
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
    });

    await this.candidateRepo.save(candidate);

    if (dto.documents?.length) {
      await this.documentRepo.delete({ candidate });
      await this.saveDocuments(candidate, dto.documents);
    }

    return this.getCandidateById(candidateId);
  }

  // =========================
  // Get Candidate By ID
  // =========================
  async getCandidateById(
    candidateId: number,
  ): Promise<any> {

    const candidate = await this.candidateRepo.findOne({
      where: { candidateId },
      relations: ['documents'],
    });

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    return mapCandidateEntityToDto(candidate);
  }

  // =========================
  // Duplicate Check
  // =========================
  private async checkDuplicateMobileAadhar(
    mobileNo?: string,
    aadharNo?: string,
    excludeCandidateId?: number,
  ) {
    if (!mobileNo && !aadharNo) return;

    const qb = this.candidateRepo
      .createQueryBuilder('c')
      .where('1=1');

    if (mobileNo) {
      qb.andWhere('c.mobileNo = :mobileNo', { mobileNo });
    }

    if (aadharNo) {
      qb.andWhere('c.aadharNo = :aadharNo', { aadharNo });
    }

    if (excludeCandidateId) {
      qb.andWhere('c.candidateId != :id', {
        id: excludeCandidateId,
      });
    }

    const exists = await qb.getOne();

    if (exists) {
      throw new BadRequestException(
        'Mobile number or Aadhar number already exists',
      );
    }
  }

  // =========================
  // Save Documents
  // =========================
  private async saveDocuments(
    candidate: CandidateDetails,
    documents: any[],
  ) {
    const entities: EOnboardingDocuments[] = [];

    for (const doc of documents) {
      let docUrl = doc.docUrl;

      if (doc.docBase64) {
        const buffer = Buffer.from(doc.docBase64, 'base64');

        // TODO: Replace with actual upload logic
        docUrl = `https://cdn.fake/${Date.now()}_${doc.fileName}`;
      }

      entities.push(
        this.documentRepo.create({
          docId: doc.docId,
          docType: doc.docType,
          docUrl,
          candidate,
        }),
      );
    }

    await this.documentRepo.save(entities);
  }
}

function mapCandidateEntityToDto(candidate: CandidateDetails): any {
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
    })),
  };
}