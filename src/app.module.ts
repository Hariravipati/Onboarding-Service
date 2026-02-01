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
import { QcVerification } from './modules/e-onboarding/entities/qc-verification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mssql',
        host: process.env.DB_HOST,
        port:parseInt(process.env.DB_PORT) || 1433,
        username:  process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: false,
        dropSchema: false,
        logging: ['error', 'schema'],
        entities: [
          // Organization,
          EOnboardingRequest,
          EOnboardingResponse,
          FormVersion,
          Forms,
          OrgFormMapping,
          RequestStatusHistory,
          CandidateDetails,
          EOnboardingDocuments,
          MobileOTP,
          QcVerification,
        ],
        extra: {
          trustServerCertificate: config.get('DB_TRUST_SERVER_CERTIFICATE') === 'true',
          encrypt: config.get('DB_ENCRYPT') === 'true',
          enableArithAbort: true,
        },
      }),
    }),
    EOnboardingModule,
  ],
})
export class AppModule { }