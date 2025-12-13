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
exports.Organization = void 0;
const typeorm_1 = require("typeorm");
const org_form_mapping_entity_1 = require("./org-form-mapping.entity");
const e_onboarding_request_entity_1 = require("./e-onboarding-request.entity");
let Organization = class Organization {
};
exports.Organization = Organization;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'OrgId' }),
    __metadata("design:type", Number)
], Organization.prototype, "orgId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'OrgName', type: 'nvarchar', length: 200 }),
    __metadata("design:type", String)
], Organization.prototype, "orgName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'OrgCode', type: 'nvarchar', length: 100, unique: true }),
    __metadata("design:type", String)
], Organization.prototype, "orgCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Description', type: 'nvarchar', nullable: true }),
    __metadata("design:type", String)
], Organization.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsActive', type: 'bit', default: true }),
    __metadata("design:type", Boolean)
], Organization.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'CreatedDate', type: 'datetime2', default: () => 'SYSDATETIME()' }),
    __metadata("design:type", Date)
], Organization.prototype, "createdDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'UpdatedDate', type: 'datetime2', nullable: true }),
    __metadata("design:type", Date)
], Organization.prototype, "updatedDate", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => org_form_mapping_entity_1.OrgFormMapping, mapping => mapping.organization),
    __metadata("design:type", Array)
], Organization.prototype, "formMappings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => e_onboarding_request_entity_1.EOnboardingRequest, request => request.organization),
    __metadata("design:type", Array)
], Organization.prototype, "onboardingRequests", void 0);
exports.Organization = Organization = __decorate([
    (0, typeorm_1.Entity)('Organization')
], Organization);
//# sourceMappingURL=organization.entity.js.map