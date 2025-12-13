import { EOnboardingRequest } from './e-onboarding-request.entity';
export declare class RequestStatusHistory {
    historyId: number;
    requestId: number;
    oldStatus: string;
    newStatus: string;
    changedAt: Date;
    request: EOnboardingRequest;
}
