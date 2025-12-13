import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { EOnboardingRequest } from './e-onboarding-request.entity';

@Entity('RequestStatusHistory')
@Index('IX_RequestHistory_RequestId', ['requestId'])
export class RequestStatusHistory {
  @PrimaryGeneratedColumn({ name: 'HistoryId' })
  historyId: number;

  @Column({ name: 'RequestId' })
  requestId: number;

  @Column({ name: 'OldStatus', type: 'nvarchar', length: 50, nullable: true })
  oldStatus: string;

  @Column({ name: 'NewStatus', type: 'nvarchar', length: 50, nullable: true })
  newStatus: string;

  @Column({ name: 'ChangedAt', type: 'datetime2', default: () => 'SYSDATETIME()' })
  changedAt: Date;

  @ManyToOne(() => EOnboardingRequest, request => request.statusHistory)
  @JoinColumn({ name: 'RequestId' })
  request: EOnboardingRequest;
}