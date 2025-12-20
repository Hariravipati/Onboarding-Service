import { Body, Controller, Post } from "@nestjs/common";
import { EobVerificaitonRequestService } from "../services/eob-verificaiton.service";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendOtpDto, VerifyOtpDto } from '../dto/otp.dto';

@ApiTags('OTP Verification')
@Controller('onboarding')
export class EobVerificationController {

    constructor(private readonly eobEobVerificaitonRequestService: EobVerificaitonRequestService) {
    }

    @Post('send-otp')
    @ApiOperation({ summary: 'Send OTP to mobile number' })
    @ApiBody({ type: SendOtpDto })
    @ApiResponse({ status: 200, description: 'OTP sent successfully' })
    async sendOTP(@Body() body: SendOtpDto) {
        return this.eobEobVerificaitonRequestService.getOTP(body.mobileNo.toString());
    }

    @Post('verify-otp')
    @ApiOperation({ summary: 'Verify OTP' })
    @ApiBody({ type: VerifyOtpDto })
    @ApiResponse({ status: 200, description: 'OTP verified successfully' })
    verifyOTP(@Body() body: VerifyOtpDto) {
        return this.eobEobVerificaitonRequestService.verifyOTP(body.mobileNo.toString(), body.otp);
    }

}
