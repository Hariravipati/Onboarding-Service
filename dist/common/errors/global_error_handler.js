"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const app_error_1 = require("./app_error");
const global_enums_1 = require("../enums/global_enums");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = global_enums_1.ERROR.SOMETHING_WENT_WRONG;
        let tag = 'SERVER_ERROR';
        if (exception instanceof app_error_1.AppError) {
            console.log(' AppError details:', exception.message);
            status = exception.getStatus();
            message = exception.message;
            tag = exception.tag ?? 'SERVER_ERROR';
        }
        else if (exception instanceof common_1.NotFoundException) {
            console.log(' NotFoundException details:', exception.message);
            status = common_1.HttpStatus.NOT_FOUND;
            tag = 'NOT_FOUND';
            message = 'Resource not found';
        }
        else if (exception instanceof Error && exception.name === 'ValidationError') {
            console.log('ValidationError details:', exception.message);
            status = common_1.HttpStatus.BAD_REQUEST;
            const res = exception.message;
            message = res;
            tag = 'BAD_REQUEST';
        }
        else if (exception instanceof common_1.HttpException) {
            console.log(' HttpException details:', exception.message);
            status = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === 'string') {
                message = res;
            }
            else if (typeof res === 'object' && res !== null) {
                if (Array.isArray(res['message'])) {
                    message = res['message'].join(', ');
                }
                else if (typeof res['message'] === 'string') {
                    message = res['message'];
                }
                else {
                    message = exception.message || global_enums_1.ERROR.SOMETHING_WENT_WRONG;
                }
            }
            else {
                message = exception.message || global_enums_1.ERROR.SOMETHING_WENT_WRONG;
            }
            tag = 'HTTP_EXCEPTION';
        }
        response.status(status).json({
            status,
            success: false,
            tag,
            msg: message,
            data: null,
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global_error_handler.js.map