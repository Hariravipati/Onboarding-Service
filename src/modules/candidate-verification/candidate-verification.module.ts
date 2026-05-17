import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateVerification } from './entities/candidate-verification.entity';
import { VerificationAudit } from './entities/verification-audit.entity';
import { EqualClient } from './providers/equal/equal.client';
import { EqualProvider } from './providers/equal/equal.provider';
import { MockProvider } from './providers/mock/mock.provider';
import { HyperVergeProvider } from './providers/hyperverge/hyperverge.provider';
import { VerificationProviderFactory } from './factories/verification-provider.factory';
import { VerificationAuditService } from './services/verification-audit.service';
import { VerificationOrchestratorService } from './services/verification-orchestrator.service';
import { CandidateVerificationController } from './controllers/candidate-verification.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CandidateVerification, VerificationAudit]),
  ],
  providers: [
    EqualClient,
    EqualProvider,
    MockProvider,
    HyperVergeProvider,
    VerificationProviderFactory,
    VerificationAuditService,
    VerificationOrchestratorService,
  ],
  controllers: [CandidateVerificationController],
  exports: [VerificationOrchestratorService, VerificationAuditService],
})
export class CandidateVerificationModule {}
