import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}