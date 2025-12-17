import { Injectable, Logger } from '@nestjs/common';
import { EOnboardingRepository } from '../repository/e-onboarding.repository';
import { Organization } from '../entities/organization.entity';
import { FormDetailsDto } from '../dto/form-details.dto';
import * as XLSX from 'xlsx';

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

  async getEobRequestTemplate(format: string = 'csv'): Promise<{ data: Buffer, contentType: string, filename: string }> {
    try {
      const headers = ['*Slno', 'Email', 'MobileNo', 'ExpiryDate'];
      const templateData = [headers];
      return this.generateTemplateFile(templateData, format, 'Confirm DOJ');
    } catch (error: any) {
      throw error;
    }
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

  private generateTemplateFile(templateData: any[][], format: string, sheetName: string): { data: Buffer, contentType: string, filename: string } {
    if (format.toLowerCase() === 'excel') {
      const ws = XLSX.utils.aoa_to_sheet(templateData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

      return {
        data: buffer,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        filename: 'confirm-doj-template.xlsx'
      };
    } else {
      let csvContent = '';
      templateData.forEach(row => {
        const csvRow = row.map(cell => typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell);
        csvContent += csvRow.join(',') + '\n';
      });

      return {
        data: Buffer.from(csvContent, 'utf8'),
        contentType: 'text/csv',
        filename: 'confirm-doj-template.csv'
      };
    }
  }
}
