import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    description: 'Mobile number to send OTP',
    example: '9876543210',
    minLength: 10,
    maxLength: 15
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 15)
  mobileNo: number;
}

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Mobile number',
    example: '9876543210',
    minLength: 10,
    maxLength: 15
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 15)
  mobileNo: number;

  @ApiProperty({
    description: 'OTP code',
    example: '123456',
    minLength: 4,
    maxLength: 8
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 8)
  otp: string;
}