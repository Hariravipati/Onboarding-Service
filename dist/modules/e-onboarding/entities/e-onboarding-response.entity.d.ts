import { EOnboardingRequest } from './e-onboarding-request.entity';
export declare class EOnboardingResponse {
    responseId: number;
    requestId: number;
    isSaved: boolean;
    isCompleted: boolean;
    responseJson: string;
    updatedDate: Date;
    request: EOnboardingRequest;
}
