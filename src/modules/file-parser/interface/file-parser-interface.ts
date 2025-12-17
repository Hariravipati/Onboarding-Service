
export interface CommonHeaders {
    requestId: string;
    fileType: string;
    fileSize: number;
    fileName: string;
    isValid: string;
    featureId: string;
    serviceName: string;
    status?: string;
    userId:string;
}

export interface ProcessingResult {
    totalRows: number;
    successCount: number;
    failedCount: number;
    errors: Array<{ row: number; errors: string }>;
    validRows: Record<string, unknown>[];
}

export interface ParseFileParams {
    s3Location: { bucket: string; key: string };
    requestId: string;
    fileType: string;
    fileName: string;
    userId: string;
    feature_id: number;
    service_name: string;
    is_worker_enabled:boolean,
    batch_size?: number;
}

export interface RequestBody {
    body:Record<string, any>;
    fileType: string;
    fileName: string;
    is_worker_enabled:boolean,
    batch_size?: number;
    s3Location: { bucket: string; key: string };
    requestId: string;
    userId: string;
    feature_id: number;
    service_name: string;
    fileSize:number,
    isTemplateValid?:boolean;
}
 