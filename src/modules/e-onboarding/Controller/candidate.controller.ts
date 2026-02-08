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
import { CreateCandidateDto } from '../dto/candidate-details.dto';

import { UploadDocumentsDto } from '../dto/upload-documents.dto';
import { CandidateService } from '../services/candidate.service';
import { OrgIdInterceptor } from '../../../common/interceptors/org-id.interceptor';
 
@Controller('candidates')
@UseInterceptors(OrgIdInterceptor)
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  /* =========================
     GET Storage Info
     ========================= */
  @Get('storage-info')
  getStorageInfo(@Req() req: any): any {
    const orgId = req.orgId;
    const provider = 'S3';
    return {
      orgId,
      currentProvider: provider,
      availableProviders: ['LOCAL', 'S3', 'AZURE'],
      configuration: {
        LOCAL: {
          uploadPath: process.env.LOCAL_UPLOAD_PATH,
          baseUrl: process.env.BASE_URL
        },
        S3: {
          bucket: process.env.S3_BUCKET_NAME,
          region: process.env.AWS_REGION
        },
        AZURE: {
          account: process.env.AZURE_STORAGE_ACCOUNT,
          container: process.env.AZURE_CONTAINER_NAME
        }
      }
    };
  }

  /* =========================
     CREATE Candidate
     ========================= */
  @Post()
  async createCandidate(
    @Req() req: any,
    @Body() dto: CreateCandidateDto,
  ): Promise<any> {
    try {
      const orgId = req.orgId;
      return this.candidateService.createCandidate(dto, orgId);
    } catch (err) {
      console.log("error in controller", err);
      throw err;
    }
  }

  /* =========================
     UPDATE Candidate
     ========================= */
  @Put(':candidateId')
  async updateCandidate(
    @Req() req: any,
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Body() dto: any,
  ): Promise<any> {
    const orgId = req.orgId;
    return this.candidateService.updateCandidate(candidateId, dto, orgId);
  }

  /* =========================
     GET Candidate by ID
     ========================= */
  @Get(':candidateId')
  async getCandidateById(
    @Req() req: any,
    @Param('candidateId', ParseIntPipe) candidateId: number,
  ): Promise<any> {
    const orgId = req.orgId;
    return this.candidateService.getCandidateById(candidateId, orgId);
  }

  /* =========================
     GET Documents Preview
     ========================= */
  @Get(':candidateId/documents/preview')
  async getDocumentsPreview(
    @Req() req: any,
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Query('docType') docType?: string,
  ): Promise<any> {
    const orgId = req.orgId;
    return this.candidateService.getDocumentsPreview(candidateId, docType, orgId);
  }

  /* =========================
     UPLOAD Documents
     ========================= */ 
  @Post(':candidateId/documents')
  async uploadDocuments(
    @Req() req: any,
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Body() dto: UploadDocumentsDto,
  ): Promise<any> {
    const orgId = req.orgId;
    return this.candidateService.uploadDocuments(candidateId, dto.documents, orgId);
  }

  /* =========================
     GET Candidate for Preview/Approval
     ========================= */
  @Get(':candidateId/preview')
  async getCandidateForPreview(
    @Req() req: any,
    @Param('candidateId', ParseIntPipe) candidateId: number,
  ): Promise<any> {
    const orgId = req.orgId;
    return this.candidateService.getCandidateForPreview(candidateId, orgId);
  }

  /* =========================
     APPROVE Candidate
     ========================= */
  @Post(':candidateId/approve')
  async approveCandidate(
    @Req() req: any,
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Body() approvalData: { remarks?: string },
  ): Promise<any> {
    const orgId = req.orgId;
    return this.candidateService.approveCandidate(candidateId, orgId, approvalData.remarks);
  }



  /* =========================
     GET QC Verification Status
     ========================= */
  @Get(':candidateId/qc-verification')
  async getQcVerificationStatus(
    @Req() req: any,
    @Param('candidateId', ParseIntPipe) candidateId: number,
  ): Promise<any> {
    const orgId = req.orgId;
    return this.candidateService.getQcVerificationStatus(candidateId, orgId);
  }

  /* =========================
     SUBMIT Candidate
     ========================= */ 
  @Post(':candidateId/submit')
  async submitCandidate(
    @Req() req: any,
    @Param('candidateId', ParseIntPipe) candidateId: number,
  ): Promise<any> {
    try {
      console.log("Submit");
      const orgId = req.orgId;
      return this.candidateService.submitCandidate(candidateId, orgId);
    } catch (err) {
      console.log('error in controller', err);
      throw err;
    }
  }
}