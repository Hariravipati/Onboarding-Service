import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { EOnboardingDocuments } from './e-onboarding-documents.entity';
import { EOnboardingResponse } from './e-onboarding-response.entity';

@Entity('CandidateDetails')
export class CandidateDetails {

  @PrimaryGeneratedColumn({ name: 'CandidateId', type: 'int' })
  candidateId: number;

  @Column({ name: 'EobRequestId', type: 'int', nullable: true })
  eobRequestId?: number;

  @Column({ name: 'FullName', type: 'varchar', length: 100 })
  fullName: string;

  @Column({ name: 'Email', type: 'varchar', length: 200 })
  email: string;

  @Column({ name: 'MobileNo', type: 'varchar', length: 20, nullable: true })
  mobileNo?: string;

  @Column({ name: 'AadharNo', type: 'varchar', length: 20, nullable: true })
  aadharNo?: string;

  @Column({ name: 'PanNo', type: 'varchar', length: 20, nullable: true })
  panNo?: string;

  @Column({ name: 'PassportNo', type: 'varchar', length: 20, nullable: true })
  passportNo?: string;

  @Column({ name: 'UanNo', type: 'varchar', length: 20, nullable: true })
  uanNo?: string;

  @Column({ name: 'CustomFieldsJson', type: 'text', nullable: true })
  customFieldsJson?: string;

  @Column({ name: 'OtherDetailsJson', type: 'text', nullable: true })
  otherDetailsJson?: string;

  @Column({
    name: 'CreatedDate',
    type: 'timestamp',
    default: () => 'NOW()',
  })
  createdDate: Date;

  @Column({ name: 'UpdatedDate', type: 'timestamp', nullable: true })
  updatedDate?: Date;

  @OneToMany(() => EOnboardingDocuments, doc => doc.candidate)
  documents: EOnboardingDocuments[];

  @OneToOne(() => EOnboardingResponse, response => response.candidate)
  response: EOnboardingResponse;
}



export function mapCandidateToDto(
  entity: CandidateDetails,
): any {
  return {
    candidateId: entity.candidateId,
    fullName: entity.fullName,
    email: entity.email,
    mobileNo: entity.mobileNo,
    aadharNo: entity.aadharNo,
    panNo: entity.panNo,
    passportNo: entity.passportNo,
    uanNo: entity.uanNo,

    customFieldsJson: entity.customFieldsJson
      ? JSON.parse(entity.customFieldsJson)
      : null,

    otherDetailsJson: entity.otherDetailsJson
      ? JSON.parse(entity.otherDetailsJson)
      : null,

    documents: entity.documents?.map(doc => ({
      candidateDocumentId: doc.candidateDocumentId,
      docType: doc.docType,
      docUrl: doc.docUrl,
    })),
  };
}
