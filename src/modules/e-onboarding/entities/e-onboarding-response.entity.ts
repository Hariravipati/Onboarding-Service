import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CandidateDetails } from './candidate-details.entity';

@Entity('EOnboardingResponse')
export class EOnboardingResponse {

  @PrimaryGeneratedColumn({ name: 'ResponseId' })
  responseId: number;

  @Column({ name: 'CandidateId', type: 'int' })
  candidateId: number;

  @Column({ name: 'IsSaved', type: 'boolean', default: false })
  isSaved: boolean;

  @Column({ name: 'IsCompleted', type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ name: 'Status', type: 'varchar', length: 20, nullable: true })
  status?: string;

  @Column({ name: 'Remarks', type: 'varchar', length: 500, nullable: true })
  remarks?: string;

  @Column({ name: 'UpdatedDate', type: 'timestamp', default: () => 'NOW()' })
  updatedDate: Date;

  @OneToOne(() => CandidateDetails, candidate => candidate.response)
  @JoinColumn({ name: 'CandidateId' })
  candidate: CandidateDetails;
}
