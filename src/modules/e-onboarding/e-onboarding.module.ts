import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EOnboardingService } from './e-onboarding.service';
import { OnboardingController } from './e-onboarding.controller';
import { Organization } from './entities/organization.entity';
import { Forms } from './entities/forms.entity';
import { FormVersion } from './entities/form-version.entity';
import { OrgFormMapping } from './entities/org-form-mapping.entity';
import { EOnboardingRequest } from './entities/e-onboarding-request.entity';
import { EOnboardingResponse } from './entities/e-onboarding-response.entity';
import { RequestStatusHistory } from './entities/request-status-history.entity';

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
  providers: [EOnboardingService],
  controllers: [OnboardingController],
  exports: [EOnboardingService],
})
export class EOnboardingModule {}