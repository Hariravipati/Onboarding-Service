export declare class ResponseDto<T> {
    data: T;
    status: number;
    msg?: string;
    success: boolean;
    tag?: string;
}
