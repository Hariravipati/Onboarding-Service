import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrgFormMapping } from './org-form-mapping.entity';

@Entity('Organization')
export class Organization {
  @PrimaryGeneratedColumn({ name: 'OrgId' })
  orgId: number;

  @Column({ name: 'OrgName', type: 'varchar', length: 200 })
  orgName: string;

  @Column({ name: 'OrgCode', type: 'varchar', length: 100 })
  orgCode: string;

  @Column({ name: 'Description', type: 'varchar', nullable: true })
  description: string;

@Column({
  name: 'IsActive',
  type: 'boolean'
})
isActive: boolean;

  @Column({ name: 'CreatedDate', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'UpdatedDate', type: 'timestamp', nullable: true })
  updatedDate: Date;

  // @OneToMany(() => OrgFormMapping, mapping => mapping.organization)
  // formMappings: OrgFormMapping[];

  // @OneToMany(() => EOnboardingRequest, request => request.organization)
  // onboardingRequests: EOnboardingRequest[];
}