import { BadRequestException, ConflictException, GoneException, Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EOnboardingRepository } from '../repository/e-onboarding.repository';
import { CreateEOnboardingRequestDto } from '../dto/e-onboarding-request.dto';
import { EobRequestStatusQueryDto, EobRequestStatusResponseDto } from '../dto/eob-request-status.dto';
import { EOnboardingRequest } from '../entities/e-onboarding-request.entity';
import { EOnboardingStatus } from '../../../common/enums/global_enums';

@Injectable()
export class EOnboardingRequestService {
  private readonly logger = new Logger(EOnboardingRequestService.name);
  constructor(
    private readonly eOnboardingRepository: EOnboardingRepository,
  ) {

  }

  async saveRequest(
    request: CreateEOnboardingRequestDto, orgId: number
  ): Promise<any> {
    await this.validateDuplicateRequest(request.email, request.mobileNo);

    const requestEntity: EOnboardingRequest = {
      requestId: null,
      email: request.email,
      mobileNo: request.mobileNo ?? null,
      expiryDate: request.expiryDate,
      createdDate: new Date(),
      status: EOnboardingStatus.PENDING,
      updatedDate: null,
      orgId: orgId,
      formId: request.formVersionId,
      accessToken: this.generateAccessToken(),
      isLinkUsed: false,
      remarks: null
    };
    await this.eOnboardingRepository.saveRequest(requestEntity);
    const onboardingUrl =
      `https://onboard.thehrpay.com/eob/${requestEntity.requestId}?token=${requestEntity.accessToken}&orgId=${orgId}&formVersionId=${request.formVersionId}`;
    return { message: 'EOB request created successfully', onboardingUrl };
  }


   async verifyTokenAndRequestId(token: string, eboRequestId: number) {
    this.logger.debug(`Verifying token: ${token} for eboRequestId: ${eboRequestId}`);

    if (!token) {
      throw new BadRequestException('Token is required');
    }

    if (!eboRequestId) {
      throw new BadRequestException('EOB Request ID is required');
    }

    const request = await this.eOnboardingRepository.findByTokenAndEobRequestId(token, eboRequestId);

    if (!request) {
      throw new BadRequestException('Invalid token or candidate');
    }

    // Expiry check
    if (request.expiryDate < new Date()) {
      throw new GoneException('Onboarding link has expired');
    }

    // Status check
    if (![EOnboardingStatus.PENDING, EOnboardingStatus.DRAFT].includes(request.status)) {
      throw new ConflictException('Onboarding already completed');
    }

    // One-time link check
    if (request.isLinkUsed) {
      throw new ConflictException('Onboarding link already used');
    }

    return {
      valid: true,
      requestId: request.requestId,
      candidateId: request.requestId, // replace with real candidateId if separate
      email: request.email,
      mobileNo: request.mobileNo,
      expiryDate: request.expiryDate,
      status: request.status,
      token: request.accessToken
    };
  }

  async getEobRequestsStatus(
    query: EobRequestStatusQueryDto,
  ): Promise<{ data: EobRequestStatusResponseDto[]; total: number; page: number; limit: number }> {
    return await this.eOnboardingRepository.getEobRequestsStatus(query);
  }

  async getEOBrequestByStaus(status: EOnboardingStatus ,  orgId: number, UserId:string): Promise<EOnboardingRequest[]> {
    return await this.eOnboardingRepository.getByStatus(status,orgId,UserId);
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
      await this.eOnboardingRepository.submitEobRequest(requestId);
      return { message: 'EOB request submitted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to submit EOB request');
    }
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


  generateAccessToken(): string {
    return uuidv4();
  }
}