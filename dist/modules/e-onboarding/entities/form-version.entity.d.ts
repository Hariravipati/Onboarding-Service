import { Forms } from './forms.entity';
import { OrgFormMapping } from './org-form-mapping.entity';
import { EOnboardingRequest } from './e-onboarding-request.entity';
export declare class FormVersion {
    formVersionId: number;
    formId: number;
    versionNo: number;
    formJson: string;
    isActive: boolean;
    createdDate: Date;
    updatedDate: Date;
    form: Forms;
    orgMappings: OrgFormMapping[];
    onboardingRequests: EOnboardingRequest[];
}
