import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { FormVersion } from './form-version.entity';

@Entity('OrgFormMapping')
export class OrgFormMapping {
  @PrimaryGeneratedColumn({ name: 'OrgFormMappingId' })
  orgFormMappingId: number;

  @Column({ name: 'OrgId' })
  orgId: number;

  @Column({ name: 'FormVersionId' })
  formVersionId: number;

  @Column({ name: 'IsActive', type: 'bit', default: true })
  isActive: boolean;

  @Column({ name: 'CreatedDate', type: 'datetime2', default: () => 'SYSDATETIME()' })
  createdDate: Date;

  @ManyToOne(() => FormVersion)
  @JoinColumn({ name: 'FormVersionId' })
  formVersion: FormVersion;
}