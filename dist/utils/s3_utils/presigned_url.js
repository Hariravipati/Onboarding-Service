"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3PresignedUrlRequests = void 0;
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require("fs");
class S3PresignedUrlRequests {
    static async generateFileUploadPresignedUrl(query) {
        const params = {
            Bucket: query.bucket_name,
            Key: query.object_key,
            Expires: query.expires_in_second ? query.expires_in_second : 600,
            ContentType: query.content_type
                ? query.content_type
                : 'application/octet-stream',
        };
        return s3.getSignedUrlPromise('putObject', params);
    }
    static async readFileUploadPresignedUrl(query) {
        const params = {
            Bucket: query.bucket_name,
            Key: query.object_key,
            Expires: query.expires_in_second ? query.expires_in_second : 600,
            ResponseContentType: query.content_type
                ? query.content_type
                : 'application/octet-stream',
        };
        return s3.getSignedUrlPromise('getObject', params);
    }
    static async uploadFileToS3(bucketName, objectKey, filePathOrBuffer, contentType) {
        const params = {
            Bucket: bucketName,
            Key: objectKey,
            Body: typeof filePathOrBuffer === 'string'
                ? fs.createReadStream(filePathOrBuffer)
                : filePathOrBuffer,
            ContentType: contentType,
        };
        return s3.upload(params).promise();
    }
    static async deleteFile(fileName) {
        const folderName = 'Mol_Bulk_edit';
        const fileKey = `${folderName}/${fileName}`;
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileKey,
        };
        await s3.deleteObject(params).promise();
        return true;
    }
}
exports.S3PresignedUrlRequests = S3PresignedUrlRequests;
//# sourceMappingURL=presigned_url.js.map