import { HttpException } from '@nestjs/common';
export declare class AppError extends HttpException {
    tag?: string;
    constructor(message: string, statusCode: number, tag?: string);
}
