import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CandidateDetails } from './candidate-details.entity';

@Entity('EOnboardingDocuments')
export class EOnboardingDocuments {

  @PrimaryGeneratedColumn({ name: 'CandidateDocumentId', type: 'int' })
  candidateDocumentId: number;

  // 👇 EXPLICIT FK COLUMN (CRITICAL)
  @Column({ name: 'CandidateId', type: 'int' })
  candidateId: number;

  @Column({ name: 'DocId', type: 'int' })
  docId: number;

  @Column({ name: 'DocType', type: 'nvarchar', length: 50 })
  docType: string;

  @Column({ name: 'DocUrl', type: 'nvarchar', length: 200 })
  docUrl: string;

  @Column({ name: 'StorageSource', type: 'nvarchar', length: 20, default: 'LOCAL' })
  storageSource: string;

  @Column({ name: 'IsLatest', type: 'bit', default: true })
  isLatest: boolean;

  @Column({
    name: 'CreatedDate',
    type: 'datetime2',
    default: () => 'SYSDATETIME()',
  })
  createdDate: Date;

  @Column({ name: 'UpdatedDate', type: 'datetime2', nullable: true })
  updatedDate?: Date;

  @ManyToOne(() => CandidateDetails, candidate => candidate.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'CandidateId' })
  candidate: CandidateDetails;
}