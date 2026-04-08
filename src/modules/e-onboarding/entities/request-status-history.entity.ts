import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EOnboardingRequest } from './e-onboarding-request.entity';

@Entity('RequestStatusHistory')
export class RequestStatusHistory {
  @PrimaryGeneratedColumn({ name: 'HistoryId' })
  historyId: number;

  @Column({ name: 'RequestId' })
  requestId: number;

  @Column({ name: 'OldStatus', type: 'varchar', length: 50, nullable: true })
  oldStatus: string;

  @Column({ name: 'NewStatus', type: 'varchar', length: 50, nullable: true })
  newStatus: string;

  @Column({ name: 'ChangedAt', type: 'timestamp', default: () => 'NOW()' })
  changedAt: Date;

  // @ManyToOne(() => EOnboardingRequest, request => request.statusHistory)
  // @JoinColumn({ name: 'RequestId' })
  // request: EOnboardingRequest;
}