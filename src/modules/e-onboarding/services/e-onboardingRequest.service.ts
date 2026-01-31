import { BadRequestException, Injectable } from '@nestjs/common';
import { EOnboardingRepository } from '../repository/e-onboarding.repository';
import { CreateEOnboardingRequestDto } from '../dto/e-onboarding-request.dto';
import { EobRequestStatusQueryDto, EobRequestStatusResponseDto } from '../dto/eob-request-status.dto';
import { EOnboardingRequest } from '../entities/e-onboarding-request.entity';


@Injectable()
export class EOnboardingRequestService {
  constructor(
    private readonly eOnboardingRepository: EOnboardingRepository,
  ) {

  }
  
  async saveRequest(
    request: CreateEOnboardingRequestDto,orgId:number
  ): Promise<any> {
    await this.validateDuplicateRequest(request.email, request.mobileNo);

    const requestEntity: EOnboardingRequest = {
      requestId: null,
      email: request.email,
      mobileNo: request.mobileNo ?? null,
      expiryDate: request.expiryDate,
      createdDate: new Date(),
      status: 'P',
      updatedDate: null,
      orgId: orgId,
      formId: request.formVersionId,
    };

    return await this.eOnboardingRepository.saveRequest(requestEntity);
  }

  async getEobRequestsStatus(
    query: EobRequestStatusQueryDto,
  ): Promise<{ data: EobRequestStatusResponseDto[]; total: number; page: number; limit: number }> {
    return await this.eOnboardingRepository.getEobRequestsStatus(query);
  }

  async approveEobRequest(
    requestId: number,
    orgId: string,
    remarks?: string,
  ): Promise<{ message: string }> {
    try {
      await this.eOnboardingRepository.approveEobRequest(requestId, remarks);
      return { message: 'EOB request approved successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to approve EOB request');
    }
  }

  async rejectEobRequest(
    requestId: number,
    orgId: string,
    remarks?: string,
  ): Promise<{ message: string }> {
    try {
      await this.eOnboardingRepository.rejectEobRequest(requestId, remarks);
      return { message: 'EOB request rejected successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to reject EOB request');
    }
  }

  async submitEobRequest(
    requestId: number,
    orgId: number,
  ): Promise<{ message: string }> {
    try {
      await this.eOnboardingRepository.submitEobRequest(requestId, orgId);
      return { message: 'EOB request submitted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to submit EOB request');
    }
  }

  private getStatusFullName(status: string): string {
    const statusMap = {
      'P': 'Pending',
      'D': 'Draft',
      'C': 'Completed',
      'E': 'Expired'
    };
    return statusMap[status] || status;
  }

  private async validateDuplicateRequest(email: string, mobileNo?: string): Promise<void> {
    const existing = await this.eOnboardingRepository.findPendingRequest(email, mobileNo);

    if (existing) {
      throw new BadRequestException(
        existing.email === email
          ? 'Email already has a Eob pending request'
          : 'Mobile number already has a Eob pending request'
      );
    }
  }
}