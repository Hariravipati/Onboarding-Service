import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { EOnboardingRequest } from './entities/e-onboarding-request.entity';
import { EOnboardingResponse } from './entities/e-onboarding-response.entity';

@Injectable()
export class EOnboardingService {
  constructor(
    @InjectRepository(Organization)
    private orgRepository: Repository<Organization>,
    @InjectRepository(EOnboardingRequest)
    private requestRepository: Repository<EOnboardingRequest>,
    @InjectRepository(EOnboardingResponse)
    private responseRepository: Repository<EOnboardingResponse>,
  ) {}

  findAllOrganizations(): Promise<Organization[]> {
    return this.orgRepository.find({ where: { isActive: true } });
  }

  findRequestsByOrg(orgId: number): Promise<EOnboardingRequest[]> {
    return this.requestRepository.find({
      where: { orgId },
      relations: ['organization', 'formVersion', 'response']
    });
  }

  createRequest(requestData: Partial<EOnboardingRequest>): Promise<EOnboardingRequest> {
    return this.requestRepository.save(requestData);
  }

  updateResponse(requestId: number, responseData: Partial<EOnboardingResponse>): Promise<EOnboardingResponse> {
    return this.responseRepository.save({ requestId, ...responseData });
  }
}