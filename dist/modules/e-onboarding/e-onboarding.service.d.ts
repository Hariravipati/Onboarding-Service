import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { EOnboardingRequest } from './entities/e-onboarding-request.entity';
import { EOnboardingResponse } from './entities/e-onboarding-response.entity';
export declare class EOnboardingService {
    private orgRepository;
    private requestRepository;
    private responseRepository;
    constructor(orgRepository: Repository<Organization>, requestRepository: Repository<EOnboardingRequest>, responseRepository: Repository<EOnboardingResponse>);
    findAllOrganizations(): Promise<Organization[]>;
    findRequestsByOrg(orgId: number): Promise<EOnboardingRequest[]>;
    createRequest(requestData: Partial<EOnboardingRequest>): Promise<EOnboardingRequest>;
    updateResponse(requestId: number, responseData: Partial<EOnboardingResponse>): Promise<EOnboardingResponse>;
}
