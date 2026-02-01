import { PrimaryGeneratedColumn } from "typeorm/decorator/columns/PrimaryGeneratedColumn";
import { Entity } from "typeorm/decorator/entity/Entity";
import { JoinColumn } from "typeorm/decorator/relations/JoinColumn";
import { ManyToOne } from "typeorm/decorator/relations/ManyToOne";
import { EOnboardingDocuments } from "./e-onboarding-documents.entity";
import { CandidateDetails } from "./candidate-details.entity";
import { Column } from "typeorm/decorator/columns/Column";

@Entity('QcVerification')
export class QcVerification {

  @PrimaryGeneratedColumn({ name: 'QcVerificationId', type: 'int' })
  qcVerificationId: number;

  @ManyToOne(() => CandidateDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'CandidateId' })
  candidate: CandidateDetails;

  @ManyToOne(() => EOnboardingDocuments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'DocumentId' })
  document: EOnboardingDocuments;

  @Column({ name: 'DocType', type: 'nvarchar', length: 50 })
  docType: string;

  @Column({ name: 'QcStatus', type: 'nvarchar', length: 20, default: 'PENDING' })
  qcStatus: string;

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
}