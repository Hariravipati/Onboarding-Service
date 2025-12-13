import { EOnboardingService } from './e-onboarding.service';
import { EOnboardingRequest } from './entities/e-onboarding-request.entity';
import { EOnboardingResponse } from './entities/e-onboarding-response.entity';
export declare class OnboardingController {
    private readonly onboardingService;
    constructor(onboardingService: EOnboardingService);
    getOrganizations(): Promise<import("./entities/organization.entity").Organization[]>;
    getRequestsByOrg(orgId: string): Promise<EOnboardingRequest[]>;
    createRequest(requestData: Partial<EOnboardingRequest>): Promise<EOnboardingRequest>;
    updateResponse(requestId: string, responseData: Partial<EOnboardingResponse>): Promise<EOnboardingResponse>;
}
