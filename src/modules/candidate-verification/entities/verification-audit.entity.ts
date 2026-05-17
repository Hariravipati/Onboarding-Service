import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('VerificationAudit')
export class VerificationAudit {
  @PrimaryGeneratedColumn('uuid', { name: 'Id' })
  id: string;

  @Column({ name: 'CandidateVerificationId', type: 'uuid' })
  candidateVerificationId: string;

  @Column({ name: 'TenantId', type: 'int' })
  tenantId: number;

  @Column({ name: 'Action', type: 'varchar', length: 100, nullable: true })
  action?: string;

  @Column({ name: 'OldStatus', type: 'varchar', length: 30, nullable: true })
  oldStatus?: string;

  @Column({ name: 'NewStatus', type: 'varchar', length: 30, nullable: true })
  newStatus?: string;

  @Column({ name: 'Actor', type: 'varchar', length: 100, nullable: true })
  actor?: string;

  @Column({ name: 'ActorType', type: 'varchar', length: 30, nullable: true })
  actorType?: string;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;
}
