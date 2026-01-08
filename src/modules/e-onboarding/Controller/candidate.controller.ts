import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateCandidateDto } from '../dto/candidate-details.dto';
import { CandidateService } from '../services/candidate.service';
 
@Controller('candidates')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  /* =========================
     CREATE Candidate
     ========================= */
  @Post()
  async createCandidate(
    @Body() dto: CreateCandidateDto,
  ): Promise<any> {
    return this.candidateService.createCandidate(dto);
  }

  /* =========================
     UPDATE Candidate
     ========================= */
  @Put(':candidateId')
  async updateCandidate(
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Body() dto: CreateCandidateDto,
  ): Promise<any> {
    return this.candidateService.updateCandidate(candidateId, dto);
  }

  /* =========================
     GET Candidate by ID
     ========================= */
  @Get(':candidateId')
  async getCandidateById(
    @Param('candidateId', ParseIntPipe) candidateId: number,
  ): Promise<any> {
    return this.candidateService.getCandidateById(candidateId);
  }
}
