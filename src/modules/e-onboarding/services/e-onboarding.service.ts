import { Injectable, Logger } from '@nestjs/common';
import { EOnboardingRepository } from '../repository/e-onboarding.repository';
import { Organization } from '../entities/organization.entity';
import { FormDetailsDto } from '../dto/form-details.dto';


@Injectable()
export class EOnboardingService {
  private readonly logger = new Logger(EOnboardingService.name);
  constructor(
    private readonly eOnboardingRepository: EOnboardingRepository,
  ) { }

  /* -------------------- Organizations -------------------- */

  async findAllOrganizations(): Promise<ApiResponse<Organization[]>> {
    const data = await this.eOnboardingRepository.getOrganizationList();

    return this.buildResponse(
      data,
      'Organizations fetched successfully',
      'No organizations found',
    );
  }

  /* -------------------- Forms -------------------- */

  async getOrgFormList(orgId: number): Promise<ApiResponse<any[]>> {
    const data = await this.eOnboardingRepository.getOrgFormMapping(orgId);
    return this.buildResponse(
      data,
      'Form list fetched successfully',
      'No forms found for organization',
    );
  }

  async getEobRequestsByOrgId(orgId: number): Promise<ApiResponse<any[]>> {

    const data = await this.eOnboardingRepository.getEobRequestsByOrgId(orgId);
    return this.buildResponse(
      data,
      'Form list fetched successfully',
      'No forms found for organization',
    );
  }

  async getFormDetails(
    orgId: number,
    formMappingId: number,
  ): Promise<ApiResponse<FormDetailsDto | null>> {
    const data = await this.eOnboardingRepository.getFormDetails(
      orgId,
      formMappingId,
    );

    return this.buildResponseSingle(
      data,
      'Form details fetched successfully',
      'Form details not found',
    );
  }

  /* -------------------- Helpers -------------------- */

  private buildResponse<T>(
    data: T[] | null,
    successMessage: string,
    emptyMessage: string,
  ): ApiResponse<T[]> {
    const isEmptyArray = Array.isArray(data) && data.length === 0;
    const isEmpty = data === null || isEmptyArray;

    return {
      message: isEmpty ? emptyMessage : successMessage,
      data: data || [],
      success: true,
      status: 200,
    };
  }

  private buildResponseSingle<T>(
    data: T | null,
    successMessage: string,
    emptyMessage: string,
  ): ApiResponse<T | null> {
    const isEmpty = data === null;

    return {
      message: isEmpty ? emptyMessage : successMessage,
      data: data || null,
      success: true,
      status: 200,
    };
  }
}
