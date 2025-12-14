import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnboardingController } from './e-onboarding.controller';
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
    ]),
  ],
  providers: [EOnboardingService,EOnboardingRepository,EOnboardingRequestService],
  controllers: [OnboardingController],
  exports: [EOnboardingService,EOnboardingRepository,EOnboardingRequestService],
})
export class EOnboardingModule {}