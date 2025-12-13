import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm';
import { OrgFormMapping } from './org-form-mapping.entity';
import { EOnboardingRequest } from './e-onboarding-request.entity';

@Entity('Organization')
export class Organization {
  @PrimaryGeneratedColumn({ name: 'OrgId' })
  orgId: number;

  @Column({ name: 'OrgName', type: 'nvarchar', length: 200 })
  orgName: string;

  @Column({ name: 'OrgCode', type: 'nvarchar', length: 100, unique: true })
  orgCode: string;

  @Column({ name: 'Description', type: 'nvarchar', nullable: true })
  description: string;

  @Column({ name: 'IsActive', type: 'bit', default: true })
  isActive: boolean;

  @Column({ name: 'CreatedDate', type: 'datetime2', default: () => 'SYSDATETIME()' })
  createdDate: Date;

  @Column({ name: 'UpdatedDate', type: 'datetime2', nullable: true })
  updatedDate: Date;

  @OneToMany(() => OrgFormMapping, mapping => mapping.organization)
  formMappings: OrgFormMapping[];

  @OneToMany(() => EOnboardingRequest, request => request.organization)
  onboardingRequests: EOnboardingRequest[];
}