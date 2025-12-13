import { Organization } from './organization.entity';
import { FormVersion } from './form-version.entity';
import { EOnboardingResponse } from './e-onboarding-response.entity';
import { RequestStatusHistory } from './request-status-history.entity';
export declare class EOnboardingRequest {
    requestId: number;
    orgId: number;
    formVersionId: number;
    email: string;
    mobileNo: string;
    expiryDate: Date;
    status: string;
    createdDate: Date;
    updatedDate: Date;
    organization: Organization;
    formVersion: FormVersion;
    response: EOnboardingResponse;
    statusHistory: RequestStatusHistory[];
}
