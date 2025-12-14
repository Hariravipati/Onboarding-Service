import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './modules/e-onboarding/entities/organization.entity';
import { EOnboardingRequest } from './modules/e-onboarding/entities/e-onboarding-request.entity';
import { EOnboardingResponse } from './modules/e-onboarding/entities/e-onboarding-response.entity';
import { FormVersion } from './modules/e-onboarding/entities/form-version.entity';
import { Forms } from './modules/e-onboarding/entities/forms.entity';
import { OrgFormMapping } from './modules/e-onboarding/entities/org-form-mapping.entity';
import { RequestStatusHistory } from './modules/e-onboarding/entities/request-status-history.entity';
import { CandidateDetails } from './modules/e-onboarding/entities/candidate-details.entity';
import { EOnboardingDocuments } from './modules/e-onboarding/entities/e-onboarding-documents.entity';
import { EOnboardingModule } from './modules/e-onboarding/e-onboarding.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: '122.166.174.83',
      port: 1433,
      username: 'sa',
      password: 'Sqlserver123$',
      database: 'onboarding_db',
      entities: [
        Organization,
        EOnboardingRequest,
        EOnboardingResponse,
        FormVersion,
        Forms,
        OrgFormMapping,
        RequestStatusHistory,
        CandidateDetails,
        EOnboardingDocuments,
      ],
      synchronize: true,
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    }),
    EOnboardingModule,
  ],
})
export class AppModule {}