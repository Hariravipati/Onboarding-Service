import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EOnboardingStatus } from '../../../common/enums/global_enums';

@Entity('EOnboardingRequest')
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

 @Column({
  name: 'Status',
  type: 'nvarchar',
  length: 1,
  default: EOnboardingStatus.PENDING
})
status: EOnboardingStatus;
  @Column({ name: 'AccessToken', type: 'nvarchar', length: 500 , nullable: true})
  accessToken: string;

  @Column({ name: 'IsLinkUsed', type: 'bit', default: false })
  isLinkUsed: boolean;

  @Column({ name: 'Remarks', type: 'nvarchar', length: 500, nullable: true })
  remarks?: string;

  @Column({ name: 'CreatedDate', type: 'datetime2', default: () => 'SYSDATETIME()' })
  createdDate: Date;

  @Column({ name: 'UpdatedDate', type: 'datetime2', nullable: true })
  updatedDate?: Date;
}