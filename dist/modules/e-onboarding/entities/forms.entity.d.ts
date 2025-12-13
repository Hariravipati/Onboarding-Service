import { FormVersion } from './form-version.entity';
export declare class Forms {
    formId: number;
    formName: string;
    createdDate: Date;
    updatedDate: Date;
    versions: FormVersion[];
}
