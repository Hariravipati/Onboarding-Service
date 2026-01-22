import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { MobileOTP } from './modules/e-onboarding/entities/mobile-otp.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mssql',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
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
          MobileOTP,
        ],
        synchronize: false,
        options: {
          encrypt: config.get('DB_ENCRYPT') === 'true',
          trustServerCertificate: config.get('DB_TRUST_SERVER_CERTIFICATE') === 'true',
        },
      }),
    }),
    EOnboardingModule,
  ],
})
export class AppModule { }