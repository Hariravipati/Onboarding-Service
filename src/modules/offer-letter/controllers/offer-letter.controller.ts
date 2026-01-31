import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { OfferLetterService } from '../services/offer-letter.service';
import { OrgId } from '../../../common/interceptors/org-id.decorator';
import { OrgIdInterceptor } from '../../../common/interceptors/org-id.interceptor';

@Controller('offer-letter')
@UseInterceptors(OrgIdInterceptor)
export class OfferLetterController {
  constructor(private readonly offerLetterService: OfferLetterService) {}

  /* =========================
     GET Submitted Candidates
     ========================= */
  @Get('candidates')
  async getSubmittedCandidates(
    @OrgId() orgId: number,
    @Query('status') status?: string,
    @Query('qcStatus') qcStatus?: string,
  ): Promise<any> {
    return this.offerLetterService.getSubmittedCandidates(orgId, status, qcStatus);
  }

  /* =========================
     GET Candidate Details for Offer Letter
     ========================= */
  @Get('candidates/:candidateId')
  async getCandidateForOfferLetter(
    @OrgId() orgId: number,
    @Param('candidateId', ParseIntPipe) candidateId: number,
  ): Promise<any> {
    return this.offerLetterService.getCandidateForOfferLetter(candidateId, orgId);
  }

  /* =========================
     GET Candidates by QC Status
     ========================= */
  @Get('candidates/qc-status/:qcStatus')
  async getCandidatesByQcStatus(
    @OrgId() orgId: number,
    @Param('qcStatus') qcStatus: string,
  ): Promise<any> {
    return this.offerLetterService.getCandidatesByQcStatus(orgId, qcStatus);
  }
}