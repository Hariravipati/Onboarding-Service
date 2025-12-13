import { OrgFormMapping } from './org-form-mapping.entity';
import { EOnboardingRequest } from './e-onboarding-request.entity';
export declare class Organization {
    orgId: number;
    orgName: string;
    orgCode: string;
    description: string;
    isActive: boolean;
    createdDate: Date;
    updatedDate: Date;
    formMappings: OrgFormMapping[];
    onboardingRequests: EOnboardingRequest[];
}
