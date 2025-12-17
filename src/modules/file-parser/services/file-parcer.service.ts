// import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
// import { feature_schema } from '../models/column-schema';
// import { S3FileProcessor } from './s3-file-processor';
// import { KafaEventRegistory } from '../models/kafa-event-registory';
// import { UPLOAD_STATUS } from '../../../common/enums/global_enums';
// import { ProcessingResult, RequestBody } from '../interface/file-parser-interface';


 
// @Injectable()
// export class FileParserService {
//   private readonly logger: Logger;
//   constructor(
//     private readonly s3FileProcessor: S3FileProcessor
//   ){
//       this.logger = new Logger(FileParserService.name);
     
//   }

//   async parseFile(
//     Parms: RequestBody
//   ): Promise<any> {
//     this.logger.log(`Starting file parsing for requestId: ${Parms.requestId}`, Parms.requestId);
//     try {
      
  
    
//       this.logger.log(`Upload STARTED event sent for requestId: ${Parms.requestId}`);
//       this.logger.log(`filepath:  ${Parms.s3Location} req`)
//       // Step 5: Process file
//       try {
//          Parms.isTemplateValid=true;
//       const result = await this.processS3File(Parms.s3Location,schema,Parms.requestId,Parms.is_worker_enabled,Parms.batch_size,Parms);
//       const isComplete = result.failedCount === 0;
//       } catch (error) {
//         Parms.isTemplateValid=false;
//         this.logger.error(`Error in parseFile 2 : ${error.message}`, error.stack);
//         throw new HttpException(error.message || 'File parsing failed', HttpStatus.BAD_REQUEST);
//       }
//       // Step 6: Handle completion or partial failure
     

//       this.logger.log(`File parsing ${UPLOAD_STATUS.COMPLETED } for requestId: ${Parms.requestId}`);
       
//     } catch (error) {
//       this.logger.error(`Error in parseFile 1 : ${error.message}`, error.stack);
//       throw new HttpException(error.message || 'File parsing failed', HttpStatus.BAD_REQUEST);
//     }
//   }

//   async processS3File(
//     featureSchema: feature_schema,
//     eventRegistry: KafaEventRegistory,
//     requestId: string,
//     is_worker_enabled:boolean,
//     batch_size?: number,
//     requestBody ?:RequestBody 
//   ): Promise<ProcessingResult> {
//     // Decode URL-encoded S3 key
   
//     const result: ProcessingResult = {
//       totalRows: 0,
//       successCount: 0,
//       failedCount: 0,
//       validRows: [],
//       errors: [],
//     };

//     let rowIndex = 0;

//     try {
//       await this.s3FileProcessor.processS3FileStream(
//         this.s3FileProcessor['s3'],
//         featureSchema.headers,
//         async (batch) => {
//         this.logger.log(`Processing batch of ${batch.length} rows, starting from row ${rowIndex + 1}`, requestId);
//         const currentRow = ++rowIndex;
//         result.totalRows++;
//         try {
//           const data = is_worker_enabled==false?await this.fileParserValidationService.validateRows(batch, featureSchema)
//                                                          :await this.fileParserValidationService.validateRowsWorker(batch,featureSchema);
//           this.logger.log("eventRegistry : ",featureSchema.feature_id);
//         } catch (err) {
          
//           const msg = (err as Error).message;
//           result.failedCount++;
//           result.errors.push({ row: currentRow, errors: `Processing error: ${msg}` });
//           this.logger.error(`Error processing row ${currentRow}: ${msg}`, requestId);
//         }
      
//       },
//       batch_size // batch size
//     );
//     } catch (error) {
//       this.logger.error(`S3 processing error - Bucket: ${s3Location.bucket}, Key: ${decodedKey}`, error);
//       if (error.code === 'NoSuchKey') {
//         throw new Error(`File not found in S3: s3://${s3Location.bucket}/${decodedKey}`);
//       }
//       throw error;
//     }
//     this.logger.log(`S3 file processing completed: ${result.successCount} succeeded, ${result.failedCount} failed`);
//     return result;
//   }
 

 

// }



