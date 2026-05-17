import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { VerificationStatus } from '../enums/verification-status.enum';
import { VerificationType } from '../enums/verification-type.enum';
import { VendorType } from '../enums/vendor-type.enum';

@Entity('CandidateVerification')
export class CandidateVerification {
  @PrimaryGeneratedColumn('uuid', { name: 'Id' })
  id: string;

  @Column({ name: 'TenantId', type: 'int' })
  tenantId: number;

  @Column({ name: 'CandidateId', type: 'int' })
  candidateId: number;

  @Column({ name: 'VerificationType', type: 'varchar', length: 30 })
  verificationType: VerificationType;

  @Column({ name: 'Status', type: 'varchar', length: 30, default: VerificationStatus.PENDING })
  status: VerificationStatus;

  @Column({ name: 'Vendor', type: 'varchar', length: 30 })
  vendor: VendorType;

  @Column({ name: 'VendorReferenceId', type: 'varchar', length: 100, nullable: true })
  vendorReferenceId?: string;

  @Column({ name: 'ExtractedDataJson', type: 'text', nullable: true })
  extractedDataJson?: string;

  @Column({ name: 'RawVendorResponseJson', type: 'text', nullable: true })
  rawVendorResponseJson?: string;

  @Column({ name: 'ErrorMessage', type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ name: 'RetryCount', type: 'int', default: 0 })
  retryCount: number;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt: Date;
}
