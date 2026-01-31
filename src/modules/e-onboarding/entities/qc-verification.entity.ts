import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CandidateDetails } from './candidate-details.entity';
import { EOnboardingDocuments } from './e-onboarding-documents.entity';

@Entity('QcVerification')
export class QcVerification {

  @PrimaryGeneratedColumn({ name: 'QcVerificationId', type: 'int' })
  qcVerificationId: number;

  @Column({ name: 'CandidateId', type: 'int' })
  candidateId: number;

  @Column({ name: 'DocumentId', type: 'int' })
  documentId: number;

  @Column({ name: 'DocType', type: 'nvarchar', length: 50 })
  docType: string;

  @Column({ name: 'QcStatus', type: 'nvarchar', length: 20, default: 'PENDING' })
  qcStatus: string; // PENDING, APPROVED, REJECTED

  @Column({ name: 'QcRemarks', type: 'nvarchar', length: 500, nullable: true })
  qcRemarks?: string;

  @Column({ name: 'VerifiedBy', type: 'nvarchar', length: 100, nullable: true })
  verifiedBy?: string;

  @Column({
    name: 'CreatedDate',
    type: 'datetime2',
    default: () => 'SYSDATETIME()',
  })
  createdDate: Date;

  @Column({ name: 'UpdatedDate', type: 'datetime2', nullable: true })
  updatedDate?: Date;

  @ManyToOne(() => CandidateDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'CandidateId' })
  candidate: CandidateDetails;

  @ManyToOne(() => EOnboardingDocuments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'DocumentId' })
  document: EOnboardingDocuments;
}