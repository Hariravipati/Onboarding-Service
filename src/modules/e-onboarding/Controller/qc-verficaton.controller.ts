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
} from '@nestjs/common';
import { OrgIdInterceptor } from '../../../common/interceptors/org-id.interceptor';
import { CandidateService } from '../services/candidate.service';
import { QcVerificationService } from '../services/qc-verification.service';
import { TenantId } from '../../../common/interceptors/tenant-id.decorator';    

@Controller('qc-verification')
@UseInterceptors(OrgIdInterceptor)
export class QcVerificationController {
     constructor(
        private readonly candidateService: CandidateService,
        private readonly qcVerificationService: QcVerificationService 
    
    ) {}

 @Get('pending-qc-Verification')
 async getPendingQcVerification(
    @TenantId() orgId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    return this.qcVerificationService.getPendindQc([]);
  }
  
  @Get(':candidateId/qcPreview')
  async getCandidateDetails(
    @TenantId() orgId: number,
    @Param('candidateId', ParseIntPipe) candidateId: number,
  ): Promise<any> {
    return this.qcVerificationService.getQcVerificationStatus(candidateId, orgId);
  }

  @Post('qc-approve-by-Documnet')
  async approveByDocument(
    @TenantId() orgId: number,
    @Body() dto: any,
  ): Promise<any> {
    return this.qcVerificationService.updateQcVerification(dto.candidateId, dto.documentId, dto);
  }


}
