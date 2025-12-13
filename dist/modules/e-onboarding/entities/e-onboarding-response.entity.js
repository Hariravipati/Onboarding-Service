"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EOnboardingResponse = void 0;
const typeorm_1 = require("typeorm");
const e_onboarding_request_entity_1 = require("./e-onboarding-request.entity");
let EOnboardingResponse = class EOnboardingResponse {
};
exports.EOnboardingResponse = EOnboardingResponse;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ResponseId' }),
    __metadata("design:type", Number)
], EOnboardingResponse.prototype, "responseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'RequestId', unique: true }),
    __metadata("design:type", Number)
], EOnboardingResponse.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsSaved', type: 'bit', default: false }),
    __metadata("design:type", Boolean)
], EOnboardingResponse.prototype, "isSaved", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsCompleted', type: 'bit', default: false }),
    __metadata("design:type", Boolean)
], EOnboardingResponse.prototype, "isCompleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ResponseJson', type: 'nvarchar', nullable: true }),
    __metadata("design:type", String)
], EOnboardingResponse.prototype, "responseJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'UpdatedDate', type: 'datetime2', default: () => 'SYSDATETIME()' }),
    __metadata("design:type", Date)
], EOnboardingResponse.prototype, "updatedDate", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => e_onboarding_request_entity_1.EOnboardingRequest, request => request.response),
    (0, typeorm_1.JoinColumn)({ name: 'RequestId' }),
    __metadata("design:type", e_onboarding_request_entity_1.EOnboardingRequest)
], EOnboardingResponse.prototype, "request", void 0);
exports.EOnboardingResponse = EOnboardingResponse = __decorate([
    (0, typeorm_1.Entity)('EOnboardingResponse')
], EOnboardingResponse);
//# sourceMappingURL=e-onboarding-response.entity.js.map