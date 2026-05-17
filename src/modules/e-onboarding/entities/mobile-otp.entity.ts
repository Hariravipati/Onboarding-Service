import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('MobileOTP')
export class MobileOTP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'MobileNo', type: 'varchar', length: 15 })
  mobileNo: string;

  @Column({ name: 'OTPHash', type: 'varchar', length: 256 })
  otpHash: string;

  @Column({ name: 'ExpiryDate', type: 'timestamp' })
  expiryDate: Date;

  @Column({ name: 'IsUsed', type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ name: 'AttemptCount', type: 'int', default: 0 })
  attemptCount: number;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamp' })
  createdAt: Date;
}