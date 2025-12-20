import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('MobileOTP')
@Index('IX_MobileOTP_MobileNo', ['mobileNo'])
export class MobileOTP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'MobileNo', type: 'varchar', length: 15 })
  mobileNo: string;

  @Column({ name: 'OTPHash', type: 'varchar', length: 256 })
  otpHash: string;

  @Column({ name: 'ExpiryDate', type: 'datetime' })
  expiryDate: Date;

  @Column({ name: 'IsUsed', type: 'bit', default: false })
  isUsed: boolean;

  @Column({ name: 'AttemptCount', type: 'int', default: 0 })
  attemptCount: number;

  @CreateDateColumn({ name: 'CreatedAt', type: 'datetime' })
  createdAt: Date;
}