import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Res, UseInterceptors } from '@nestjs/common';
import { EOnboardingService } from '../services/e-onboarding.service';
import { CreateEOnboardingRequestDto } from '../dto/e-onboarding-request.dto';
import { EobRequestStatusQueryDto } from '../dto/eob-request-status.dto';
import { EOnboardingRequestService } from '../services/e-onboardingRequest.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrgId } from '../../../common/interceptors/org-id.decorator';
import { OrgIdInterceptor } from '../../../common/interceptors/org-id.interceptor';

@ApiTags('Onboarding')
@Controller('onboarding')
@UseInterceptors(OrgIdInterceptor)
export class EobRequestController {
  constructor(
    private readonly onboardingService: EOnboardingService,
    private readonly eOnboardingRequestService: EOnboardingRequestService

  ) { }

  @Get('organizations')
  getOrganizations(@OrgId() orgId: string) {
    return this.onboardingService.findAllOrganizations(orgId);
  }

  @Get('org-formDetails')
  async getFormDetails(
    @OrgId() orgId: string,
    @Query('orgId') queryOrgId: number,
    @Query('formMappingId') formMappingId: number
  ) {
    return await this.onboardingService.getFormDetails(queryOrgId, formMappingId, orgId)
  }

  @Get('org-forms-list')
  async getFormlist(
    @Query('orgId') queryOrgId: number,
  ) {
    return await this.onboardingService.getOrgFormList(queryOrgId)
  }


  @Post('eob-request')
  @ApiOperation({ summary: 'Create EOB request' })
  @ApiBody({ type: CreateEOnboardingRequestDto })
  @ApiResponse({ status: 201, description: 'Request created successfully' })
  async EobRequest(
    @OrgId() orgId: number,
    @Body() dto: CreateEOnboardingRequestDto
  ) {
    return await this.eOnboardingRequestService.saveRequest(dto, orgId);
  }


  @Get('validate-link')
  async validateLink(
    @Query('token') token: string,
    @Query('candidateId') eboRequestId: number
  ) {
    this
    return this.eOnboardingRequestService.verifyTokenAndRequestId(token, eboRequestId);
  }

  @Get('eob-requests-by-orgId/:orgId')
  async getByOrg(
    @OrgId() orgId: number,
  ) {
    return this.onboardingService.getEobRequestsByOrgId(orgId);
  }

  @Get('eob-requests-status')
  async getEobRequestsStatus(
    @Query() query: EobRequestStatusQueryDto,
  ) {
    return this.eOnboardingRequestService.getEobRequestsStatus(query);
  }

  @Get('download-eob-template')
  async downloadEobTemplate(
    @OrgId() orgId: string,
    @Query('format') format: string = 'csv',
    @Res() res
  ) {
    const result = await this.onboardingService.getEobRequestTemplate(format, orgId);
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.data);
  }

  /* =========================
     APPROVE EOB Request
     ========================= */
  @Post('eob-request/:requestId/approve')
  async approveEobRequest(
    @OrgId() orgId: string,
    @Param('requestId', ParseIntPipe) requestId: number,
    @Body() approvalData: { remarks?: string },
  ) {
    return await this.eOnboardingRequestService.approveEobRequest(requestId, orgId, approvalData.remarks);
  }


  /* =========================
    @Get EOB Request Status
    ========================= */
 
    @Get('get-eob-request-by-status')
    async getEOBrequestByStaus(
      @OrgId() orgId: number,
      @Query('status') status: string,
      @Query('UserId') UserId: string
    ) {
      return await this.eOnboardingRequestService.getEOBrequestByStaus(status as any, orgId, UserId);   
    }

}





