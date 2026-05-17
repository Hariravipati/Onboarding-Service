import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { VerificationOrchestratorService } from '../services/verification-orchestrator.service';
import { VerificationAuditService } from '../services/verification-audit.service';
import { VerifyCandidateDto } from '../dto/verify-candidate.dto';
import { VerificationStatus } from '../enums/verification-status.enum';
import { OrgIdInterceptor } from '../../../common/interceptors/org-id.interceptor';
import { TenantId } from '../../../common/interceptors/tenant-id.decorator';

@Controller('candidate-verification')
@UseInterceptors(OrgIdInterceptor)
export class CandidateVerificationController {
  constructor(
    private readonly orchestrator: VerificationOrchestratorService,
    private readonly auditService: VerificationAuditService,
  ) {}

  /**
   * Candidate: Submit documents for verification
   * POST /candidate-verification/verify
   */
  @Post('verify')
  async verifyCandidate(
    @TenantId() tenantId: number,
    @Body() dto: VerifyCandidateDto,
  ) {
    return this.orchestrator.verifyCandidateDocuments(dto, tenantId);
  }

  /**
   * HR: Get all verification results for a candidate
   * GET /candidate-verification/candidates/:candidateId/results
   */
  @Get('candidates/:candidateId/results')
  async getResults(
    @TenantId() tenantId: number,
    @Param('candidateId') candidateId: number,
  ) {
    return this.auditService.getVerificationResults(+candidateId, tenantId);
  }

  /**
   * HR: Get audit trail for a specific verification record
   * GET /candidate-verification/:verificationId/audit
   */
  @Get(':verificationId/audit')
  async getAuditTrail(@Param('verificationId') verificationId: string) {
    return this.auditService.getAuditTrail(verificationId);
  }

  /**
   * HR: Retry a failed verification
   * POST /candidate-verification/:verificationId/retry
   */
  @Post(':verificationId/retry')
  async retryVerification(
    @TenantId() tenantId: number,
    @Param('verificationId') verificationId: string,
    @Body('candidateId') candidateId: number,
  ) {
    return this.orchestrator.retryVerification(verificationId, +candidateId, tenantId);
  }

  /**
   * HR: Manually override a verification status
   * PUT /candidate-verification/:verificationId/override
   */
  @Put(':verificationId/override')
  async overrideVerification(
    @TenantId() tenantId: number,
    @Req() req: any,
    @Param('verificationId') verificationId: string,
    @Body() body: { status: VerificationStatus; remarks?: string },
  ) {
    const actor = req.user?.email || req.headers['x-user-id'] || 'HR';
    return this.auditService.overrideVerification(verificationId, tenantId, body.status, actor, body.remarks);
  }
}
