import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferLetterController } from './controllers/offer-letter.controller';
import { OfferLetterService } from './services/offer-letter.service';
import { OfferLetterRepository } from './repository/offer-letter.repository';
import { CandidateDetails } from '../e-onboarding/entities/candidate-details.entity';
import { EOnboardingResponse } from '../e-onboarding/entities/e-onboarding-response.entity';
import { QcVerification } from '../e-onboarding/entities/qc-verification.entity';
// import { QcVerificationService } from '../e-onboarding/services/qc-verification.service';
// import { QcVerificationRepository } from '../e-onboarding/repository/qc-verification.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CandidateDetails,
      EOnboardingResponse,
      QcVerification,
    ]),
  ],
  controllers: [OfferLetterController],
  providers: [
    OfferLetterService,
    OfferLetterRepository,
    // QcVerificationService,
    // QcVerificationRepository,
  ],
  exports: [OfferLetterService],
})
export class OfferLetterModule {}