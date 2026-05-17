import { PrimaryGeneratedColumn } from "typeorm/decorator/columns/PrimaryGeneratedColumn";
import { Entity } from "typeorm/decorator/entity/Entity";
import { Column } from "typeorm/decorator/columns/Column";

@Entity('QcVerification')
export class QcVerification {

  @PrimaryGeneratedColumn({ name: 'QcVerificationId', type: 'int' })
  qcVerificationId: number;

  @Column({ name: 'CandidateId', type: 'int' })
  candidateId: number;

  @Column({ name: 'DocumentId', type: 'int', nullable: true })
  documentId: number;

  @Column({ name: 'DocType', type: 'varchar', length: 50 })
  docType: string;

  @Column({ name: 'QcStatus', type: 'varchar', length: 20, default: 'PENDING' })
  qcStatus: string;

  @Column({ name: 'QcRemarks', type: 'varchar', length: 500, nullable: true })
  qcRemarks?: string;

  @Column({ name: 'VerifiedBy', type: 'varchar', length: 100, nullable: true })
  verifiedBy?: string;

  @Column({
    name: 'CreatedDate',
    type: 'timestamp',
    default: () => 'NOW()',
  })
  createdDate: Date;

  @Column({ name: 'UpdatedDate', type: 'timestamp', nullable: true })
  updatedDate?: Date;
}