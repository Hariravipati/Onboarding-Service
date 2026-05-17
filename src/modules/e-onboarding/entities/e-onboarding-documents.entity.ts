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

  @Column({ name: 'DocType', type: 'varchar', length: 50 })
  docType: string;

  @Column({ name: 'DocUrl', type: 'varchar', length: 200 })
  docUrl: string;

  @Column({ name: 'StorageSource', type: 'varchar', length: 20, default: 'LOCAL' })
  storageSource: string;

  @Column({ name: 'IsLatest', type: 'boolean', default: true })
  isLatest: boolean;

  @Column({
    name: 'CreatedDate',
    type: 'timestamp',
    default: () => 'NOW()',
  })
  createdDate: Date;

  @Column({ name: 'UpdatedDate', type: 'timestamp', nullable: true })
  updatedDate?: Date;

  @ManyToOne(() => CandidateDetails, candidate => candidate.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'CandidateId' })
  candidate: CandidateDetails;
}