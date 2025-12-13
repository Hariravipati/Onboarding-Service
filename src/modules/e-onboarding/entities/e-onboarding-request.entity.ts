import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { Organization } from './organization.entity';
import { FormVersion } from './form-version.entity';
import { EOnboardingResponse } from './e-onboarding-response.entity';
import { RequestStatusHistory } from './request-status-history.entity';

@Entity('EOnboardingRequest')
@Index('IX_EOnboardingRequest_OrgId', ['orgId'])
@Index('IX_EOnboardingRequest_FormVersionId', ['formVersionId'])
@Index('IX_EOnboardingRequest_Status', ['status'])
export class EOnboardingRequest {
  @PrimaryGeneratedColumn({ name: 'RequestId' })
  requestId: number;

  @Column({ name: 'OrgId' })
  orgId: number;

  @Column({ name: 'FormVersionId' })
  formVersionId: number;

  @Column({ name: 'Email', type: 'nvarchar', length: 200 })
  email: string;

  @Column({ name: 'MobileNo', type: 'nvarchar', length: 20, nullable: true })
  mobileNo: string;

  @Column({ name: 'ExpiryDate', type: 'datetime2' })
  expiryDate: Date;

  @Column({ name: 'Status', type: 'nvarchar', length: 50, default: 'PENDING' })
  status: string;

  @Column({ name: 'CreatedDate', type: 'datetime2', default: () => 'SYSDATETIME()' })
  createdDate: Date;

  @Column({ name: 'UpdatedDate', type: 'datetime2', nullable: true })
  updatedDate: Date;

  @ManyToOne(() => Organization, org => org.onboardingRequests)
  @JoinColumn({ name: 'OrgId' })
  organization: Organization;

  @ManyToOne(() => FormVersion, version => version.onboardingRequests)
  @JoinColumn({ name: 'FormVersionId' })
  formVersion: FormVersion;

  @OneToOne(() => EOnboardingResponse, response => response.request)
  response: EOnboardingResponse;

  @OneToMany(() => RequestStatusHistory, history => history.request)
  statusHistory: RequestStatusHistory[];
}