import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { EOnboardingService } from './e-onboarding.service';
import { EOnboardingRequest } from './entities/e-onboarding-request.entity';
import { EOnboardingResponse } from './entities/e-onboarding-response.entity';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: EOnboardingService) {}

  @Get('organizations')
  getOrganizations() {
    return this.onboardingService.findAllOrganizations();
  }

  @Get('requests/:orgId')
  getRequestsByOrg(@Param('orgId') orgId: string) {
    return this.onboardingService.findRequestsByOrg(+orgId);
  }

  @Post('requests')
  createRequest(@Body() requestData: Partial<EOnboardingRequest>) {
    return this.onboardingService.createRequest(requestData);
  }

  @Put('responses/:requestId')
  updateResponse(
    @Param('requestId') requestId: string,
    @Body() responseData: Partial<EOnboardingResponse>
  ) {
    return this.onboardingService.updateResponse(+requestId, responseData);
  }
}