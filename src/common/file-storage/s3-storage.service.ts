import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { IFileStorageService } from './file-storage.interface';

@Injectable()
export class S3StorageService implements IFileStorageService {
  private readonly logger = new Logger(S3StorageService.name);
  private readonly s3: S3;
  private readonly bucketName = process.env.AWS_S3_BUCKET_NAME || process.env.S3_BUCKET_NAME || 'onboarding-documents';

  constructor() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    
    this.s3 = new S3({
      region: 'ap-south-1',
      accessKeyId: 'AKIA2U46AP7UXR5AA5RY',
      secretAccessKey: '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',
      httpOptions: {
        agent: new (require('https').Agent)({
          rejectUnauthorized: false
        })
      }
    });
  }

  async uploadFile(
    buffer: Buffer,
    fileName: string,
    contentType: string = 'application/octet-stream',
  ): Promise<string> {
    try {
      const key = `documents/${Date.now()}_${fileName}`;
      
      const uploadResult = await this.s3.upload({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }).promise();

      this.logger.log(`Document uploaded successfully: ${uploadResult.Location}`);
      return uploadResult.Location;
    } catch (error) {
      this.logger.error('Failed to upload document to S3', error);
      throw error;
    }
  }

  async getFileAsBase64(fileUrl: string): Promise<string> {
    try {
      const key = fileUrl.split('/').slice(-2).join('/');
      
      const result = await this.s3.getObject({
        Bucket: this.bucketName,
        Key: key,
      }).promise();
      
      return (result.Body as Buffer).toString('base64');
    } catch (error) {
      this.logger.error('Failed to get file from S3 as base64', error);
      throw error;
    }
  }
}