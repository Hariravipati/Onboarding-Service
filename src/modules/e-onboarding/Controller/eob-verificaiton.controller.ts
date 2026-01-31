import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { EobVerificaitonRequestService } from "../services/eob-verificaiton.service";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendOtpDto, VerifyOtpDto } from '../dto/otp.dto';
import { OrgId } from '../../../common/interceptors/org-id.decorator';
import { OrgIdInterceptor } from '../../../common/interceptors/org-id.interceptor';

@ApiTags('OTP Verification')
@Controller('onboarding')
@UseInterceptors(OrgIdInterceptor)
export class EobVerificationController {

    constructor(private readonly eobEobVerificaitonRequestService: EobVerificaitonRequestService) {
    }

    @Post('send-otp')
    @ApiOperation({ summary: 'Send OTP to mobile number' })
    @ApiBody({ type: SendOtpDto })
    @ApiResponse({ status: 200, description: 'OTP sent successfully' })
    async sendOTP(
        @OrgId() orgId: number,
        @Body() body: SendOtpDto
    ) {
        return this.eobEobVerificaitonRequestService.getOTP(body.mobileNo.toString(), orgId);
    }

    @Post('verify-otp')
    @ApiOperation({ summary: 'Verify OTP' })
    @ApiBody({ type: VerifyOtpDto })
    @ApiResponse({ status: 200, description: 'OTP verified successfully' })
    verifyOTP(
        @OrgId() orgId: string,
        @Body() body: VerifyOtpDto
    ) {
        return this.eobEobVerificaitonRequestService.verifyOTP(body.mobileNo.toString(), body.otp );
    }

}
