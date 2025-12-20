import { Injectable } from '@nestjs/common';
import { EobVerificationRepository } from '../repository/eob.verification.repository';
import * as crypto from 'crypto';
import { OtpException, RateLimitException } from '../../../common/exceptions/custom.exceptions';

@Injectable()
export class EobVerificaitonRequestService {
  constructor(
    private readonly eobVerificationRepository: EobVerificationRepository,
  ) {

  }
  async getOTP(mobileNo: string) {
    const mobile = mobileNo.toString();

    // Rate limit
    const allowed = await this.eobVerificationRepository.canSendOTP(mobile);
    if (!allowed) {
      throw new RateLimitException('Too many OTP requests. Try again later.');
    }

    const otp = this.generateOTP(6);
    const otpHash = this.hashOTP(otp);
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 5);
    await this.eobVerificationRepository.saveOTP(mobile, otpHash, expiry);
    await this.sendSMS(
      mobile,
      `Your OTP is ${otp}. Valid for 5 minutes.`
    );

    return {
      message: 'OTP sent successfully',
      success: true,
      status: 200,
    };
  }


private generateOTP(length: number = 6): string {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * Math.pow(10, length - 1)
  ).toString();
}

async sendSMS(mobileNo: string, message: string): Promise<void> {
  // Integrate: Twilio / AWS SNS / Textlocal / MSG91
  console.log(`SMS sent to ${mobileNo}: ${message}`);
}



  async verifyOTP(mobileNo: string, otp: string) {
    const mobile = mobileNo.toString();
    const result = await this.eobVerificationRepository.getOTPDetails(mobile, this.hashOTP(otp));

    if (
      result &&
      result.length > 0 &&
      new Date(result[0].expiryDate) >= new Date()
    ) {
      return {
        message: 'OTP verified successfully',
        success: true,
        status: 200,
      };
    }

    throw new OtpException('Invalid or expired OTP');
  }

hashOTP(otp: string): string {
  return crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');
}

}