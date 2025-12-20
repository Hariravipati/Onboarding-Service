import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EOnboardingRequest } from '../entities/e-onboarding-request.entity';
import { EOnboardingResponse } from '../entities/e-onboarding-response.entity';
import { Organization } from '../entities/organization.entity';
import { OrgFormMapping } from '../entities/org-form-mapping.entity';
import { FormVersion } from '../entities/form-version.entity';
import { FormDetailsDto } from '../dto/form-details.dto';

@Injectable()
export class EOnboardingRepository {
  private readonly logger = new Logger(EOnboardingRepository.name);
  constructor(
    @InjectRepository(EOnboardingRequest)
    private readonly requestRepository: Repository<EOnboardingRequest>,

    @InjectRepository(EOnboardingResponse)
    private readonly responseRepository: Repository<EOnboardingResponse>,

    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,

    @InjectRepository(OrgFormMapping)
    private readonly orgFormMappingRepository: Repository<OrgFormMapping>,

    @InjectRepository(FormVersion)
    private readonly formVersionRepository: Repository<FormVersion>,
  ) { }

  /* -------------------- Organization -------------------- */

  async getOrganizationList(): Promise<Organization[]> {
    try {
      return await this.orgRepository.find({ where: { isActive: true } });
    } catch (err) {
      this.logger.error('getOrganizationList failed', err as any);
      throw err;
    }
  }

  /* -------------------- Org ↔ Form Mapping -------------------- */

  async getOrgFormMapping(orgId: number): Promise<any[]> {
    try {
      return await this.orgFormMappingRepository
        .createQueryBuilder('mapping')
        .leftJoin('mapping.formVersion', 'version')
        .leftJoin('version.form', 'form')
        .select([
          'mapping.orgFormMappingId AS orgFormMappingId',
          'form.formName AS formName',
          'form.formUrl AS formUrl',
          'form.logoUrl AS logoUrl',
          'version.formJson AS formJson',
          'version.versionNo AS versionNo',
        ])
        .where('mapping.orgId = :orgId', { orgId })
        .andWhere('mapping.isActive = :isActive', { isActive: true })
        .getRawMany();
    } catch (err) {
      this.logger.error(`getOrgFormMapping failed for orgId=${orgId}`, err as any);
      throw err;
    }
  }

  async getFormDetails(
    orgId: number,
    formMappingId: number,
  ): Promise<FormDetailsDto | null> {
    try {
      const result = await this.orgFormMappingRepository
        .createQueryBuilder('mapping')
        .leftJoin('mapping.formVersion', 'version')
        .leftJoin('version.form', 'form')
        .select([
          'form.formName AS formName',
          'form.formUrl AS formUrl',
          'form.logoUrl AS logoUrl',
          'version.formJson AS formJson',
          'version.versionNo AS versionNo',
        ])
        .where('mapping.orgId = :orgId', { orgId })
        .andWhere('mapping.orgFormMappingId = :formMappingId', {
          formMappingId,
        })
        .andWhere('mapping.isActive = :isActive', { isActive: true })
        .getRawOne();

      if (!result) {
        return null;
      }

      return {
        formName: result.formName,
        formUrl: result.formUrl,
        logoUrl: result.logoUrl,
        formJson: result.formJson,
        versionNo: result.versionNo,
      };
    } catch (err) {
      this.logger.error(
        `getFormDetails failed for orgId=${orgId} formMappingId=${formMappingId}`,
        err as any,
      );
      throw err;
    }
  }




  /* -------------------- Requests & Responses -------------------- */

  async saveRequest(
    request: EOnboardingRequest,
  ): Promise<EOnboardingRequest> {
    try {
      return await this.requestRepository.save(request);
    } catch (err) {
      this.logger.error('saveRequest failed', err as any);
      throw err;
    }
  }

  async saveResponse(
    response: EOnboardingResponse,
  ): Promise<EOnboardingResponse> {
    try {
      return await this.responseRepository.save(response);
    } catch (err) {
      this.logger.error('saveResponse failed', err as any);
      throw err;
    }
  }

  async getEobRequestsByOrgId(orgId: number): Promise<EOnboardingRequest[]> {
    try {
       this.logger.log("getEobRequestsByOrgId")
      const data= this.requestRepository.find({
        where: {
          orgId: orgId,
        },
        order: { createdDate: 'DESC' },
      });
      this.logger.log("data :", JSON.stringify(data));
      return data;
    } catch (err) {
      this.logger.error('saveRequest failed', err as any);
      throw err;
    }
  }

  async VerifyMobileNo(mobileNo: string): Promise<EOnboardingRequest[]> {
    try {
      return await this.requestRepository.find({
        where: {
          mobileNo: mobileNo
        },
      });
    } catch (err) {
      this.logger.error('saveRequest failed', err as any);
      throw err;
    }
  }

  

}
