import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Forms } from './forms.entity';
import { OrgFormMapping } from './org-form-mapping.entity';
import { EOnboardingRequest } from './e-onboarding-request.entity';

@Entity('FormVersion')
export class FormVersion {
  @PrimaryGeneratedColumn({ name: 'FormVersionId' })
  formVersionId: number;

  @Column({ name: 'FormId' })
  formId: number;

  @Column({ name: 'VersionNo' })
  versionNo: number;

  @Column({ name: 'FormJson', type: 'nvarchar' })
  formJson: string;

  @Column({ name: 'IsActive', type: 'bit', default: true })
  isActive: boolean;

  @Column({ name: 'CreatedDate', type: 'datetime2', default: () => 'SYSDATETIME()' })
  createdDate: Date;

  @Column({ name: 'UpdatedDate', type: 'datetime2', nullable: true })
  updatedDate: Date;

  @ManyToOne(() => Forms, form => form.versions)
  @JoinColumn({ name: 'FormId' })
  form: Forms;

  @OneToMany(() => OrgFormMapping, mapping => mapping.formVersion)
  orgMappings: OrgFormMapping[];

  @OneToMany(() => EOnboardingRequest, request => request.formVersion)
  onboardingRequests: EOnboardingRequest[];
}