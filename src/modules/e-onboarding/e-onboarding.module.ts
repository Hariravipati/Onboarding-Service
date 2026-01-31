import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Forms } from './entities/forms.entity';
import { FormVersion } from './entities/form-version.entity';
import { OrgFormMapping } from './entities/org-form-mapping.entity';
import { EOnboardingRequest } from './entities/e-onboarding-request.entity';
import { EOnboardingResponse } from './entities/e-onboarding-response.entity';
import { RequestStatusHistory } from './entities/request-status-history.entity';
import { EOnboardingService } from './services/e-onboarding.service';
import { EOnboardingRepository } from './repository/e-onboarding.repository';
import { EOnboardingRequestService } from './services/e-onboardingRequest.service';
import { EobVerificationController } from './Controller/eob-verificaiton.controller';
import { EobVerificaitonRequestService } from './services/eob-verificaiton.service';
import { MobileOTP } from './entities/mobile-otp.entity';
import { EobVerificationRepository } from './repository/eob.verification.repository';
import { EobRequestController } from './Controller/eob-request.controller';
import { CandidateController } from './Controller/candidate.controller';
import { HealthController } from './Controller/health.controller';
import { CandidateService } from './services/candidate.service';
import { CandidateDetails } from './entities/candidate-details.entity';
import { EOnboardingDocuments } from './entities/e-onboarding-documents.entity';
import { QcVerification } from './entities/qc-verification.entity';
import { CandidateRepository } from './repository/candidate.repository';
import { QcVerificationService } from './services/qc-verification.service';
import { QcVerificationRepository } from './repository/qc-verification.repository';
import { S3StorageService } from '../../common/file-storage/s3-storage.service';
import { AzureStorageService } from '../../common/file-storage/azure-storage.service';
import { LocalStorageService } from '../../common/file-storage/local-storage.service';
import { FileStorageFactory, FILE_STORAGE_SERVICE } from '../../common/file-storage/file-storage.factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      Forms,
      FormVersion,
      OrgFormMapping,
      EOnboardingRequest,
      EOnboardingResponse,
      RequestStatusHistory,
      MobileOTP,
      CandidateDetails,
      EOnboardingDocuments,
      QcVerification
    ]),
  ],
  providers: [
    EOnboardingService,
    EOnboardingRepository,
    EOnboardingRequestService,
    EobVerificaitonRequestService,
    EobVerificationRepository,
    // QcVerificationRepository,
    // QcVerificationService,
    CandidateRepository,
    CandidateService,
    S3StorageService,
    AzureStorageService,
    LocalStorageService,
    {
      provide: FILE_STORAGE_SERVICE,
      useFactory: () => FileStorageFactory.createFileStorageService(),
    },
  ],
  controllers: [EobRequestController,EobVerificationController,CandidateController,HealthController],
  exports: [EOnboardingService,EOnboardingRepository,EOnboardingRequestService,EobVerificaitonRequestService,EobVerificationRepository,CandidateService,CandidateRepository,FILE_STORAGE_SERVICE],
})
export class EOnboardingModule {}