import { Organization } from './organization.entity';
import { FormVersion } from './form-version.entity';
export declare class OrgFormMapping {
    orgFormMappingId: number;
    orgId: number;
    formVersionId: number;
    isActive: boolean;
    createdDate: Date;
    organization: Organization;
    formVersion: FormVersion;
}
