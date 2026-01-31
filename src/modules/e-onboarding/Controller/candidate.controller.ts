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
import { CreateCandidateDto } from '../dto/candidate-details.dto';

import { UploadDocumentsDto } from '../dto/upload-documents.dto';
import { CandidateService } from '../services/candidate.service';
import { OrgId } from '../../../common/interceptors/org-id.decorator';
import { OrgIdInterceptor } from '../../../common/interceptors/org-id.interceptor';
 
@Controller('candidates')
@UseInterceptors(OrgIdInterceptor)
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  /* =========================
     GET Storage Info
     ========================= */
  @Get('storage-info')
  getStorageInfo(@OrgId() orgId: number): any {
    const provider = process.env.STORAGE_PROVIDER || 'LOCAL';
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
    @OrgId() orgId: number,
    @Body() dto: CreateCandidateDto,
  ): Promise<any> {
    try{
     
    return this.candidateService.createCandidate(dto, orgId);
    }catch(err){
      console.log("error in controller",err);
      throw err;
    }
  }

  /* =========================
     UPDATE Candidate
     ========================= */
  @Put(':candidateId')
  async updateCandidate(
    @OrgId() orgId: number,
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Body() dto: any,
  ): Promise<any> {
    return this.candidateService.updateCandidate(candidateId, dto, orgId);
  }

  /* =========================
     GET Candidate by ID
     ========================= */
  @Get(':candidateId')
  async getCandidateById(
    @OrgId() orgId: number,
    @Param('candidateId', ParseIntPipe) candidateId: number,
  ): Promise<any> {
    return this.candidateService.getCandidateById(candidateId, orgId);
  }

  /* =========================
     GET Documents Preview
     ========================= */
  @Get(':candidateId/documents/preview')
  async getDocumentsPreview(
    @OrgId() orgId: number,
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Query('docType') docType?: string,
  ): Promise<any> {
    return this.candidateService.getDocumentsPreview(candidateId, docType, orgId);
  }

  /* =========================
     UPLOAD Documents
     ========================= */ 
  @Post(':candidateId/documents')
  async uploadDocuments(
    @OrgId() orgId: number,
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Body() dto: UploadDocumentsDto,
  ): Promise<any> {
    return this.candidateService.uploadDocuments(candidateId, dto.documents, orgId);
  }

  /* =========================
     GET Candidate for Preview/Approval
     ========================= */
  @Get(':candidateId/preview')
  async getCandidateForPreview(
    @OrgId() orgId: number,
    @Param('candidateId', ParseIntPipe) candidateId: number,
  ): Promise<any> {
    return this.candidateService.getCandidateForPreview(candidateId, orgId);
  }

  /* =========================
     APPROVE Candidate
     ========================= */
  @Post(':candidateId/approve')
  async approveCandidate(
    @OrgId() orgId: number,
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Body() approvalData: { remarks?: string },
  ): Promise<any> {
    return this.candidateService.approveCandidate(candidateId, orgId, approvalData.remarks);
  }

  /* =========================
     CREATE QC Verification Entry
     ========================= */
  @Post(':candidateId/qc-verification')
  async createQcVerification(
    @OrgId() orgId: number,
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Body() qcData: { docType: string; status: string; remarks?: string },
  ): Promise<any> {
    return this.candidateService.createQcVerification(candidateId, orgId, qcData);
  }

  /* =========================
     GET QC Verification Status
     ========================= */
  @Get(':candidateId/qc-verification')
  async getQcVerificationStatus(
    @OrgId() orgId: number,
    @Param('candidateId', ParseIntPipe) candidateId: number,
  ): Promise<any> {
    return this.candidateService.getQcVerificationStatus(candidateId, orgId);
  }

  /* =========================
     SUBMIT Candidate
     ========================= */ 
  @Post(':candidateId/submit')
  async submitCandidate(
    @OrgId() orgId: number,
    @Param('candidateId', ParseIntPipe) candidateId: number,
  ): Promise<any> {
    try {
      return this.candidateService.submitCandidate(candidateId, orgId);
    } catch (err) {
      console.log('error in controller', err);
      throw err;
    }
  }
}
