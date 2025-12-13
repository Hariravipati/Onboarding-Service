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
exports.EOnboardingRequest = void 0;
const typeorm_1 = require("typeorm");
const organization_entity_1 = require("./organization.entity");
const form_version_entity_1 = require("./form-version.entity");
const e_onboarding_response_entity_1 = require("./e-onboarding-response.entity");
const request_status_history_entity_1 = require("./request-status-history.entity");
let EOnboardingRequest = class EOnboardingRequest {
};
exports.EOnboardingRequest = EOnboardingRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'RequestId' }),
    __metadata("design:type", Number)
], EOnboardingRequest.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'OrgId' }),
    __metadata("design:type", Number)
], EOnboardingRequest.prototype, "orgId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FormVersionId' }),
    __metadata("design:type", Number)
], EOnboardingRequest.prototype, "formVersionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Email', type: 'nvarchar', length: 200 }),
    __metadata("design:type", String)
], EOnboardingRequest.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'MobileNo', type: 'nvarchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], EOnboardingRequest.prototype, "mobileNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ExpiryDate', type: 'datetime2' }),
    __metadata("design:type", Date)
], EOnboardingRequest.prototype, "expiryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Status', type: 'nvarchar', length: 50, default: 'PENDING' }),
    __metadata("design:type", String)
], EOnboardingRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'CreatedDate', type: 'datetime2', default: () => 'SYSDATETIME()' }),
    __metadata("design:type", Date)
], EOnboardingRequest.prototype, "createdDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'UpdatedDate', type: 'datetime2', nullable: true }),
    __metadata("design:type", Date)
], EOnboardingRequest.prototype, "updatedDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organization_entity_1.Organization, org => org.onboardingRequests),
    (0, typeorm_1.JoinColumn)({ name: 'OrgId' }),
    __metadata("design:type", organization_entity_1.Organization)
], EOnboardingRequest.prototype, "organization", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => form_version_entity_1.FormVersion, version => version.onboardingRequests),
    (0, typeorm_1.JoinColumn)({ name: 'FormVersionId' }),
    __metadata("design:type", form_version_entity_1.FormVersion)
], EOnboardingRequest.prototype, "formVersion", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => e_onboarding_response_entity_1.EOnboardingResponse, response => response.request),
    __metadata("design:type", e_onboarding_response_entity_1.EOnboardingResponse)
], EOnboardingRequest.prototype, "response", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => request_status_history_entity_1.RequestStatusHistory, history => history.request),
    __metadata("design:type", Array)
], EOnboardingRequest.prototype, "statusHistory", void 0);
exports.EOnboardingRequest = EOnboardingRequest = __decorate([
    (0, typeorm_1.Entity)('EOnboardingRequest'),
    (0, typeorm_1.Index)('IX_EOnboardingRequest_OrgId', ['orgId']),
    (0, typeorm_1.Index)('IX_EOnboardingRequest_FormVersionId', ['formVersionId']),
    (0, typeorm_1.Index)('IX_EOnboardingRequest_Status', ['status'])
], EOnboardingRequest);
//# sourceMappingURL=e-onboarding-request.entity.js.map