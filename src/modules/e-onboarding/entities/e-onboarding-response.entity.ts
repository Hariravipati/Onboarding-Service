import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { EOnboardingRequest } from './e-onboarding-request.entity';

@Entity('EOnboardingResponse')
export class EOnboardingResponse {
  @PrimaryGeneratedColumn({ name: 'ResponseId' })
  responseId: number;

  @Column({ name: 'RequestId', unique: true })
  requestId: number;

  @Column({ name: 'IsSaved', type: 'bit', default: false })
  isSaved: boolean;

  @Column({ name: 'IsCompleted', type: 'bit', default: false })
  isCompleted: boolean;

  @Column({ name: 'ResponseJson', type: 'nvarchar', nullable: true })
  responseJson: string;

  @Column({ name: 'UpdatedDate', type: 'datetime2', default: () => 'SYSDATETIME()' })
  updatedDate: Date;

  @OneToOne(() => EOnboardingRequest, request => request.response)
  @JoinColumn({ name: 'RequestId' })
  request: EOnboardingRequest;
}