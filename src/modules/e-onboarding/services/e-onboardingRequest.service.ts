import { BadRequestException, Injectable } from '@nestjs/common';
import { EOnboardingRepository } from '../repository/e-onboarding.repository';
import { CreateEOnboardingRequestDto } from '../dto/e-onboarding-request.dto';
import { EOnboardingRequest } from '../entities/e-onboarding-request.entity';


@Injectable()
export class EOnboardingRequestService {
  constructor(
    private readonly eOnboardingRepository: EOnboardingRepository,
  ) {

  }
  
  async saveRequest(
    request: CreateEOnboardingRequestDto,
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
      orgId: request.orgId,
      formId: request.formVersionId,
    };

    return await this.eOnboardingRepository.saveRequest(requestEntity);
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