import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CandidateDetails } from './candidate-details.entity';
import { EOnboardingRequest } from './e-onboarding-request.entity';

@Entity('EOnboardingResponse')
export class EOnboardingResponse {

  @PrimaryGeneratedColumn({ name: 'ResponseId' })
  responseId: number;

  @Column({ name: 'IsSaved', type: 'bit', default: false })
  isSaved: boolean;

  @Column({ name: 'IsCompleted', type: 'bit', default: false })
  isCompleted: boolean;

  @Column({ name: 'UpdatedDate', type: 'datetime2', default: () => 'SYSDATETIME()' })
  updatedDate: Date;

  /* =========================
     Relations
     ========================= */

  // Owns RequestId FK
  // @OneToOne(() => EOnboardingRequest, request => request.response)
  // @JoinColumn({ name: 'RequestId' })
  // request: EOnboardingRequest;

  @OneToOne(() => CandidateDetails, candidate => candidate.response)
  candidateDetails: CandidateDetails;
}
