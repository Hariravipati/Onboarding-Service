import { Injectable } from '@nestjs/common';
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
    try {
      const requestEntity: EOnboardingRequest = {
        requestId: null,
        email: request.email,
        mobileNo: request.mobileNo ?? null,
        expiryDate: request.expiryDate,
        createdDate: new Date(),
        status: 'P',
        updatedDate: null,
        // Foreign keys / relations
        orgId: request.orgId,
        formId: request.formVersionId,
      };
      this.eOnboardingRepository.saveRequest(requestEntity)

    } catch (err) {

    }
  }
  async saveResponse(
    response: any,
  ): Promise<any> {
    try {
    } catch (err) {
      throw err;
    }
  }
  async bulkEobRequests(file:any){
    

  }

}