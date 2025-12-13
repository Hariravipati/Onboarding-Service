"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
const common_1 = require("@nestjs/common");
const global_enums_1 = require("../enums/global_enums");
class AppError extends common_1.HttpException {
    constructor(message, statusCode, tag) {
        super(message, statusCode);
        this.tag = tag || global_enums_1.FAILURE.FAILED;
    }
}
exports.AppError = AppError;
//# sourceMappingURL=app_error.js.map