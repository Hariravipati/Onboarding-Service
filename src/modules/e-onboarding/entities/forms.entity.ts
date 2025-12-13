import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { FormVersion } from './form-version.entity';

@Entity('Forms')
export class Forms {
  @PrimaryGeneratedColumn({ name: 'FormId' })
  formId: number;

  @Column({ name: 'FormName', type: 'nvarchar', length: 200 })
  formName: string;

  @Column({ name: 'CreatedDate', type: 'datetime2', default: () => 'SYSDATETIME()' })
  createdDate: Date;

  @Column({ name: 'UpdatedDate', type: 'datetime2', nullable: true })
  updatedDate: Date;

  @OneToMany(() => FormVersion, version => version.form)
  versions: FormVersion[];
}