import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Organization } from './organization.entity';
import { FormVersion } from './form-version.entity';

@Entity('OrgFormMapping')
@Index('IX_OrgFormMapping_OrgId', ['orgId'])
@Index('IX_OrgFormMapping_FormVersionId', ['formVersionId'])
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

  @ManyToOne(() => Organization, org => org.formMappings)
  @JoinColumn({ name: 'OrgId' })
  organization: Organization;

  @ManyToOne(() => FormVersion, version => version.orgMappings)
  @JoinColumn({ name: 'FormVersionId' })
  formVersion: FormVersion;
}