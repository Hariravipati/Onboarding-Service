import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class EobRequestStatusQueryDto {
  @IsOptional()
  @IsString()
  mobileNo?: string;

  @IsOptional()
  @IsString()
  aadharNo?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}

export class EobRequestStatusResponseDto {
  requestId: number;
  fullName: string;
  email: string;
  mobileNo: string;
  aadharNo: string;
  status: string;
  statusFullName: string;
  createdDate: Date;
  updatedDate: Date;
}