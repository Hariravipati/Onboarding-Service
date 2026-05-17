import { HttpException, HttpStatus } from '@nestjs/common';

export class VendorApiException extends HttpException {
  constructor(vendor: string, message: string, cause?: any) {
    super(
      { message: `Vendor [${vendor}] API error: ${message}`, vendor, cause },
      HttpStatus.BAD_GATEWAY,
    );
  }
}

export class VerificationFailedException extends HttpException {
  constructor(verificationType: string, reason: string) {
    super(
      { message: `Verification failed for [${verificationType}]: ${reason}`, verificationType },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
