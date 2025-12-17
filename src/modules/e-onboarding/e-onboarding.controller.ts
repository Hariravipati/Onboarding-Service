import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Res, UseInterceptors } from '@nestjs/common';
import { EOnboardingService } from './services/e-onboarding.service';
import { CreateEOnboardingRequestDto } from './dto/e-onboarding-request.dto';
import { EOnboardingRequestService } from './services/e-onboardingRequest.service';
import { ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('onboarding')
export class OnboardingController {
  constructor(
    private readonly onboardingService: EOnboardingService,
    private readonly eOnboardingRequestService: EOnboardingRequestService

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

    console.log("Log:", CreateEOnboardingRequestDto)
    return await this.eOnboardingRequestService.saveRequest(dto);
  }

  @Get('eob-requests-by-orgId/:orgId')
  async getByOrg(
    @Param('orgId', ParseIntPipe) orgId: number,
  ) {
    return this.onboardingService.getEobRequestsByOrgId(orgId);
  }


  @Get('download-eob-template')
  async downloadEobTemplate(@Query('format') format: string = 'csv', @Res() res) {
    const result = await this.onboardingService.getEobRequestTemplate(format);
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.data);
  }

  @Post('bulk-S3-upload-async')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBulkFileAsync( @Body() body: Record<string, any> ) {
    try {
      const { file } = body;
      const result = await this.eOnboardingRequestService.bulkEobRequests(file);
      return result;
    } catch (error: any) {
    }
  }

}





