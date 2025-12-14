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

  @PrimaryGeneratedColumn({ name: 'CandidateDocumentId' })
  candidateDocumentId: number;

  @Column({ name: 'DocId', type: 'int' })
  docId: number;

  @Column({ name: 'DocType', type: 'nvarchar', length: 50 })
  docType: string;

  @Column({ name: 'DocUrl', type: 'nvarchar', length: 200 })
  docUrl: string;

  @Column({ name: 'CreatedDate', type: 'datetime2', default: () => 'SYSDATETIME()' })
  createdDate: Date;

  @Column({ name: 'UpdatedDate', type: 'datetime2', nullable: true })
  updatedDate: Date;

  /* =========================
     Relations
     ========================= */

  @ManyToOne(() => CandidateDetails, candidate => candidate.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'CandidateId' })
  candidate: CandidateDetails;
}
