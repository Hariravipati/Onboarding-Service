import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EOnboardingRequest } from '../entities/e-onboarding-request.entity';
import { EOnboardingResponse } from '../entities/e-onboarding-response.entity';
import { Organization } from '../entities/organization.entity';
import { OrgFormMapping } from '../entities/org-form-mapping.entity';
import { FormVersion } from '../entities/form-version.entity';
import { FormDetailsDto } from '../dto/form-details.dto';
import { EobRequestStatusQueryDto, EobRequestStatusResponseDto } from '../dto/eob-request-status.dto';
import { EOnboardingStatus } from '../../../common/enums/global_enums';

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

  async findByTokenAndEobRequestId(token: string, eobRequestId: number): Promise<EOnboardingRequest | null> {
    return this.requestRepository.findOne({
      where: {
        accessToken: token,
        requestId: eobRequestId // or candidateId if you have a separate column
      }
    });
  }

  async findPendingRequest(email: string, mobileNo?: string): Promise<EOnboardingRequest | null> {
    return await this.requestRepository.findOne({
      where: [
        { email, status: EOnboardingStatus.PENDING },
        ...(mobileNo ? [{ mobileNo, status: EOnboardingStatus.PENDING }] : []),
      ],
    });
  }


  async getByStatus(status: EOnboardingStatus ,  orgId: number, UserId:string): Promise<EOnboardingRequest[]> {
    return this.requestRepository.find({
      where: { status, orgId },
      order: { createdDate: 'DESC' }, // optional but useful
    });
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

  async getEobRequestsStatus(
    query: EobRequestStatusQueryDto,
  ): Promise<{ data: EobRequestStatusResponseDto[]; total: number; page: number; limit: number }> {
    try {
      const { page = 1, limit = 10, mobileNo, aadharNo, status } = query;
      const offset = (page - 1) * limit;

      const qb = this.requestRepository.createQueryBuilder('r')
        .select([
          'r.requestId',
          'r.email',
          'r.mobileNo',
          'r.status',
          'r.createdDate',
          'r.updatedDate'
        ])
        .where('1=1');

      if (mobileNo) {
        qb.andWhere('r.mobileNo = :mobileNo', { mobileNo });
      }

      if (status) {
        qb.andWhere('r.status = :status', { status });
      }

      const [requests, total] = await qb
        .orderBy('r.createdDate', 'DESC')
        .skip(offset)
        .take(limit)
        .getManyAndCount();

      const data = requests.map(req => ({
        requestId: req.requestId,
        fullName: req.email.split('@')[0],
        email: req.email,
        mobileNo: req.mobileNo || '',
        aadharNo: aadharNo || '',
        status: req.status,
        statusFullName: this.getStatusFullName(req.status),
        createdDate: req.createdDate,
        updatedDate: req.updatedDate
      }));

      return { data, total, page, limit };
    } catch (err) {
      this.logger.error('getEobRequestsStatus failed', err as any);
      throw err;
    }
  }

  private getStatusFullName(status: string): string {
    const statusMap = {
      'P': 'Pending',
      'D': 'Draft',
      'C': 'Completed',
      'E': 'Expired',
      'QA': 'QC Approved',
      'QR': 'QC Rejected'
    };
    return statusMap[status] || status;
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

  async approveEobRequest(requestId: number, remarks?: string): Promise<void> {
    try {
      await this.requestRepository.update(requestId, {
        status:  EOnboardingStatus.APPROVED,
        updatedDate: new Date(),
        ...(remarks && { remarks })
      });
    } catch (err) {
      this.logger.error('approveEobRequest failed', err as any);
      throw err;
    }
  }

  async rejectEobRequest(requestId: number, remarks?: string): Promise<void> {
    try {
      await this.requestRepository.update(requestId, {
        status: EOnboardingStatus.REJECTED,
        updatedDate: new Date(),
        ...(remarks && { remarks })
      });
    } catch (err) {
      this.logger.error('rejectEobRequest failed', err as any);
      throw err;
    }
  }

  async submitEobRequest(requestId: number): Promise<void> {
    try {
      await this.requestRepository.update(requestId, {
         status: EOnboardingStatus.COMPLETED,
        updatedDate: new Date()
      });
    } catch (err) {
      this.logger.error('submitEobRequest failed', err as any);
      throw err;
    }
  }
}
