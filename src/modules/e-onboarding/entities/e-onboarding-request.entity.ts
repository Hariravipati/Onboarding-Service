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

  @Column({ name: 'TenantId' })
  tenantId: number

  @Column({ name: 'FormId' })
  formId: number

  @Column({ name: 'Email', type: 'varchar', length: 200 })
  email: string;

  @Column({ name: 'MobileNo', type: 'varchar', length: 20, nullable: true })
  mobileNo: string;

  @Column({ name: 'ExpiryDate', type: 'timestamp' })
  expiryDate: Date;

 @Column({
  name: 'Status',
  type: 'varchar',
  length: 1,
  default: EOnboardingStatus.PENDING
})
status: EOnboardingStatus;
  @Column({ name: 'AccessToken', type: 'varchar', length: 500 , nullable: true})
  accessToken: string;

  @Column({ name: 'IsLinkUsed', type: 'boolean', default: false })
  isLinkUsed: boolean;

  @Column({ name: 'Remarks', type: 'varchar', length: 500, nullable: true })
  remarks?: string;

  @Column({ name: 'CreatedDate', type: 'timestamp', default: () => 'NOW()' })
  createdDate: Date;

  @Column({ name: 'UpdatedDate', type: 'timestamp', nullable: true })
  updatedDate?: Date;
}