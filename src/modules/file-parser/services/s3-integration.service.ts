import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as XLSX from 'xlsx';
import { Express } from 'express';
 
@Injectable()
export class S3IntegrationService {
  private readonly logger = new Logger(S3IntegrationService.name);
  private readonly s3: S3;

  constructor( ) {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });
  }
  
  // Example method to get the file from S3
  async getFile(bucketName: string, key: string): Promise<any> {
    const params = {
      Bucket: bucketName,
      Key: key
    };

    try {
      const data = await this.s3.getObject(params).promise();
      return data.Body;
    } catch (error) {
      this.logger.error(`Error fetching file from S3: ${error.message}`);
      throw error;
    }
  }

  async processUploadedFile(file: Express.Multer.File): Promise<any[][]> {
    try {
      this.logger.log(`Processing uploaded file: ${file.originalname}`);
      const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'csv') {
        return this.parseCSV(file.buffer);
      } else if (['xlsx', 'xls'].includes(fileExtension)) {
        return this.parseExcel(file.buffer);
      } else {
        throw new Error(`Unsupported file format: ${fileExtension}`);
      }
    } catch (error) {
      this.logger.error(`Error processing uploaded file: ${error.message}`);
      throw error;
    }
  }

  private parseCSV(buffer: Buffer): any[][] {
    const csvContent = buffer.toString('utf8');
    const rows = csvContent.split('\n').filter(row => row.trim());
    return rows.map(row => {
      const cells = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          cells.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      cells.push(current.trim());
      return cells;
    });
  }

  private parseExcel(buffer: Buffer): any[][] {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  }


}