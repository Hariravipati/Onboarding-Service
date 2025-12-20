import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MobileOTP } from '../entities/mobile-otp.entity';


@Injectable()
export class EobVerificationRepository {
    private readonly logger = new Logger(EobVerificationRepository.name);

    constructor(
        @InjectRepository(MobileOTP)
        private readonly mobileOtp: Repository<MobileOTP>,
    ) { }
    // Request Otp
    async saveOTP(mobile: string, otpHash: string, expiry: Date) {
        return this.mobileOtp.query(
            ` INSERT INTO MobileOTP (MobileNo, OTPHash, ExpiryDate)  VALUES (@0, @1, @2) `,
            [mobile, otpHash, expiry]
        );
    }
    //Validate Otp
    async getValidOTP(mobile: string, otpHash: string) {
        return this.mobileOtp.query(
            `
    SELECT TOP 1 *
    FROM MobileOTP
    WHERE MobileNo = @0
      AND OTPHash = @1
      AND IsUsed = 0
      AND ExpiryDate >= GETDATE()
    ORDER BY CreatedAt DESC
    `,
            [mobile, otpHash]
        );
    }
    
    // Mark Otp Used
    async markOTPUsed(id: number) {
        return this.mobileOtp.query(
            `UPDATE MobileOTP SET IsUsed = 1 WHERE Id = @0`,
            [id]
        );
    }

    // Rate Limitting
    async canSendOTP(mobile: string): Promise<boolean> {
        const result = await this.mobileOtp.query(
            `
            SELECT COUNT(*) AS count
            FROM MobileOTP
            WHERE MobileNo = @0
            AND CreatedAt >= DATEADD(MINUTE, -10, GETDATE())
            `,
            [mobile]
        );

        return result[0].count < 3;
        }
    
    async getOTPDetails(mobile: string, otp: string) {
        return this.mobileOtp.query(
            `SELECT * FROM MobileOTP WHERE MobileNo = @0 AND OTPHash = @1 AND IsUsed = 0 AND ExpiryDate >= GETDATE()`,
            [mobile, otp]
        );
    }   
    
    
    
}