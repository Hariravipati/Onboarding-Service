import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OfferLetterRepository } from '../repository/offer-letter.repository';
import { QcVerificationService } from '../../e-onboarding/services/qc-verification.service';

@Injectable()
export class OfferLetterService {
  private readonly logger = new Logger(OfferLetterService.name);

  constructor(
    private readonly offerLetterRepository: OfferLetterRepository,
    private readonly qcVerificationService: QcVerificationService,
  ) {}

  async getSubmittedCandidates(
    orgId: number,
    status?: string,
    qcStatus?: string,
  ): Promise<any> {
    try {
      this.logger.log('Getting submitted candidates', { orgId, status, qcStatus });
      
      const candidates = await this.offerLetterRepository.getSubmittedCandidates(orgId, status);
      
      // Enrich with QC verification status
      const candidatesWithQc = await Promise.all(
        candidates.map(async (candidate) => {
          const qcVerifications = await this.qcVerificationService.getQcVerificationStatus(candidate.candidateId, orgId);
          const qcSummary = await this.qcVerificationService.getQcSummary(candidate.candidateId);
          
          return {
            ...candidate,
            qcVerificationStatus: qcVerifications,
            qcSummary,
            overallQcStatus: this.determineOverallQcStatus(qcVerifications)
          };
        })
      );

      // Filter by QC status if provided
      const filteredCandidates = qcStatus 
        ? candidatesWithQc.filter(candidate => candidate.overallQcStatus === qcStatus.toUpperCase())
        : candidatesWithQc;

      this.logger.log('Submitted candidates retrieved', { 
        orgId, 
        totalCount: candidates.length,
        filteredCount: filteredCandidates.length 
      });
      
      return {
        candidates: filteredCandidates,
        summary: {
          total: filteredCandidates.length,
          byQcStatus: this.getQcStatusSummary(candidatesWithQc),
          byStatus: this.getStatusSummary(filteredCandidates)
        }
      };
    } catch (error) {
      this.logger.error('Failed to get submitted candidates', error.stack, { orgId });
      throw error;
    }
  }

  async getCandidateForOfferLetter(candidateId: number, orgId: number): Promise<any> {
    try {
      this.logger.log('Getting candidate for offer letter', { candidateId, orgId });
      
      const candidate = await this.offerLetterRepository.getCandidateDetails(candidateId);
      
      if (!candidate) {
        throw new NotFoundException('Candidate not found');
      }

      const qcVerifications = await this.qcVerificationService.getQcVerificationStatus(candidateId, orgId);
      const qcSummary = await this.qcVerificationService.getQcSummary(candidateId);
      
      const result = {
        ...candidate,
        qcVerificationDetails: qcVerifications,
        qcSummary,
        overallQcStatus: this.determineOverallQcStatus(qcVerifications),
        eligibleForOfferLetter: qcSummary.readyForSubmission && candidate.status === 'COMPLETED'
      };

      this.logger.log('Candidate details retrieved for offer letter', { candidateId });
      return result;
    } catch (error) {
      this.logger.error('Failed to get candidate for offer letter', error.stack, { candidateId });
      throw error;
    }
  }

  async getCandidatesByQcStatus(orgId: number, qcStatus: string): Promise<any> {
    try {
      this.logger.log('Getting candidates by QC status', { orgId, qcStatus });
      
      const candidates = await this.offerLetterRepository.getSubmittedCandidates(orgId);
      
      const candidatesWithQc = await Promise.all(
        candidates.map(async (candidate) => {
          const qcVerifications = await this.qcVerificationService.getQcVerificationStatus(candidate.candidateId, orgId);
          const overallQcStatus = this.determineOverallQcStatus(qcVerifications);
          
          return {
            ...candidate,
            qcVerificationStatus: qcVerifications,
            overallQcStatus
          };
        })
      );

      const filteredCandidates = candidatesWithQc.filter(
        candidate => candidate.overallQcStatus === qcStatus.toUpperCase()
      );

      this.logger.log('Candidates filtered by QC status', { 
        orgId, 
        qcStatus, 
        count: filteredCandidates.length 
      });
      
      return filteredCandidates;
    } catch (error) {
      this.logger.error('Failed to get candidates by QC status', error.stack, { orgId, qcStatus });
      throw error;
    }
  }

  private determineOverallQcStatus(qcVerifications: any[]): string {
    if (qcVerifications.length === 0) return 'NO_QC';
    
    const hasRejected = qcVerifications.some(qc => qc.status === 'REJECTED');
    const hasPending = qcVerifications.some(qc => qc.status === 'PENDING');
    const allApproved = qcVerifications.every(qc => qc.status === 'APPROVED');
    
    if (hasRejected) return 'REJECTED';
    if (hasPending) return 'PENDING';
    if (allApproved) return 'APPROVED';
    
    return 'PARTIAL';
  }

  private getQcStatusSummary(candidates: any[]): any {
    return candidates.reduce((summary, candidate) => {
      const status = candidate.overallQcStatus;
      summary[status] = (summary[status] || 0) + 1;
      return summary;
    }, {});
  }

  private getStatusSummary(candidates: any[]): any {
    return candidates.reduce((summary, candidate) => {
      const status = candidate.status || 'UNKNOWN';
      summary[status] = (summary[status] || 0) + 1;
      return summary;
    }, {});
  }
}