import { S3GenerateFileUploadPresignedUrlInterface } from './interface';
export declare class S3PresignedUrlRequests {
    static generateFileUploadPresignedUrl(query: S3GenerateFileUploadPresignedUrlInterface): Promise<any>;
    static readFileUploadPresignedUrl(query: S3GenerateFileUploadPresignedUrlInterface): Promise<string>;
    static uploadFileToS3(bucketName: string, objectKey: string, filePathOrBuffer: string | Buffer, contentType: string): Promise<any>;
    static deleteFile(fileName: string): Promise<boolean>;
}
