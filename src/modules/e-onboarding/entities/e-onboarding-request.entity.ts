import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

@Entity('EOnboardingRequest')
@Index('IX_EOnboardingRequest_Status', ['status'])
export class EOnboardingRequest {

  @PrimaryGeneratedColumn({ name: 'RequestId' })
  requestId: number;

  @Column({ name: 'OrgId' })
  orgId: number

  @Column({ name: 'FormId' })
  formId: number

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

  /* =========================
     Relations
     ========================= */

  // @ManyToOne(() => Organization, org => org.onboardingRequests, {
  //   onDelete: 'CASCADE',
  // })
  // // @JoinColumn({ name: 'OrgId' })
  // // @Index('IX_EOnboardingRequest_OrgId')
  // // organization: Organization;

  // // @ManyToOne(() => FormVersion, version => version.onboardingRequests, {
  // //   onDelete: 'NO ACTION',
  // // })
  // // @JoinColumn({ name: 'FormVersionId' })
  // // @Index('IX_EOnboardingRequest_FormVersionId')
  // // formVersion: FormVersion;



  // @OneToOne(() => EOnboardingResponse, response => response.request)
  // response: EOnboardingResponse;

  // @OneToMany(() => RequestStatusHistory, history => history.request, {
  //   cascade: true,
  // })
  // statusHistory: RequestStatusHistory[];
}
