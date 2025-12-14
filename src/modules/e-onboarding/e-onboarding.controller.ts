import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { EOnboardingService } from './services/e-onboarding.service';
import { CreateEOnboardingRequestDto } from './dto/e-onboarding-request.dto';
import { EOnboardingRequestService } from './services/e-onboardingRequest.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('onboarding')
export class OnboardingController {
  constructor(
    private readonly onboardingService: EOnboardingService,
    private readonly   eOnboardingRequestService:EOnboardingRequestService
  
  ) { }

  @Get('organizations')
  getOrganizations() {
    return this.onboardingService.findAllOrganizations();
  }

  @Get('org-formDetails')
  async getFormDetails(
    @Query('orgId') orgId: number,
    @Query('formMappingId') formMappingId: number
  ) {
    return await this.onboardingService.getFormDetails(orgId, formMappingId)
  }

  @Get('org-forms-list')
  async getFormlist(
    @Query('orgId') orgId: number,
  ) {
    return await this.onboardingService.getOrgFormList(orgId)
  }


  @Post('eob-request')
  @ApiBody({ type: CreateEOnboardingRequestDto })
  async EobRequest(@Body() dto: CreateEOnboardingRequestDto) {

    console.log("Log:" , CreateEOnboardingRequestDto )
    return await this.eOnboardingRequestService.saveRequest(dto);
  }
  
  @Get('eob-requests-by-orgId/:orgId')
  async getByOrg(
    @Param('orgId', ParseIntPipe) orgId: number,
  ) {
    return this.onboardingService.getEobRequestsByOrgId(orgId);
  }

}



 

