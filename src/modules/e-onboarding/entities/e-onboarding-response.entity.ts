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

  @Column({ name: 'IsSaved', type: 'bit', default: false })
  isSaved: boolean;

  @Column({ name: 'IsCompleted', type: 'bit', default: false })
  isCompleted: boolean;

  @Column({ name: 'Status', type: 'nvarchar', length: 20, nullable: true })
  status?: string;

  @Column({ name: 'Remarks', type: 'nvarchar', length: 500, nullable: true })
  remarks?: string;

  @Column({ name: 'UpdatedDate', type: 'datetime2', default: () => 'SYSDATETIME()' })
  updatedDate: Date;

  @OneToOne(() => CandidateDetails, candidate => candidate.response)
  @JoinColumn({ name: 'CandidateId' })
  candidate: CandidateDetails;
}
