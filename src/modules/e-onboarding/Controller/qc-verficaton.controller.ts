import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseInterceptors,
    Req,
} from '@nestjs/common';
import { OrgIdInterceptor } from '../../../common/interceptors/org-id.interceptor';
import { CandidateService } from '../Services/candidate.service';
import { QcVerificationService } from '../services/qc-verification.service';    

@Controller('qc-verification')
@UseInterceptors(OrgIdInterceptor)
export class QcVerificationController {
     constructor(
        private readonly candidateService: CandidateService,
        private readonly qcVerificationService: QcVerificationService 
    
    ) {}

 @Get('pending-qc-Verification')
 async getPendingQcVerification(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    const orgId = req.orgId;
     return this.qc.getPendindQc();
  }
  
  @Get(':candidateId/qcPreview')
  async getCandidateDetails(
    @Req() req: any,
    @Param('candidateId', ParseIntPipe) candidateId: number,
  ): Promise<any> {
    const orgId = req.orgId;
    return this.qcVerificationService.
  }

  @Post('qc-approve-by-Documnet')
  async approveByDocument(
    @Req() req: any,
    @Body() dto: any,
  ): Promise<any> {
    const orgId = req.orgId;
    return this.candidateService.approveByDocument(dto);
  }


}
