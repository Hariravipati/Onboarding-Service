import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { FormVersion } from './form-version.entity';

@Entity('Forms')
export class Forms {
  @PrimaryGeneratedColumn({ name: 'FormId' })
  formId: number;

  @Column({ name: 'FormName', type: 'varchar', length: 200 })
  formName: string;

  @Column({ name: 'FormUrl', type: 'varchar', length: 500, nullable: true })
  formUrl: string;

  @Column({ name: 'LogoUrl', type: 'varchar', length: 500, nullable: true })
  logoUrl: string;

  @Column({ name: 'CreatedDate', type: 'timestamp', default: () => 'NOW()' })
  createdDate: Date;

  @Column({ name: 'UpdatedDate', type: 'timestamp', nullable: true })
  updatedDate: Date;

  @OneToMany(() => FormVersion, version => version.form)
  versions: FormVersion[];
}