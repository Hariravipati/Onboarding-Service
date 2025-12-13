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
exports.FormVersion = void 0;
const typeorm_1 = require("typeorm");
const forms_entity_1 = require("./forms.entity");
const org_form_mapping_entity_1 = require("./org-form-mapping.entity");
const e_onboarding_request_entity_1 = require("./e-onboarding-request.entity");
let FormVersion = class FormVersion {
};
exports.FormVersion = FormVersion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'FormVersionId' }),
    __metadata("design:type", Number)
], FormVersion.prototype, "formVersionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FormId' }),
    __metadata("design:type", Number)
], FormVersion.prototype, "formId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'VersionNo' }),
    __metadata("design:type", Number)
], FormVersion.prototype, "versionNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FormJson', type: 'nvarchar' }),
    __metadata("design:type", String)
], FormVersion.prototype, "formJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsActive', type: 'bit', default: true }),
    __metadata("design:type", Boolean)
], FormVersion.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'CreatedDate', type: 'datetime2', default: () => 'SYSDATETIME()' }),
    __metadata("design:type", Date)
], FormVersion.prototype, "createdDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'UpdatedDate', type: 'datetime2', nullable: true }),
    __metadata("design:type", Date)
], FormVersion.prototype, "updatedDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => forms_entity_1.Forms, form => form.versions),
    (0, typeorm_1.JoinColumn)({ name: 'FormId' }),
    __metadata("design:type", forms_entity_1.Forms)
], FormVersion.prototype, "form", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => org_form_mapping_entity_1.OrgFormMapping, mapping => mapping.formVersion),
    __metadata("design:type", Array)
], FormVersion.prototype, "orgMappings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => e_onboarding_request_entity_1.EOnboardingRequest, request => request.formVersion),
    __metadata("design:type", Array)
], FormVersion.prototype, "onboardingRequests", void 0);
exports.FormVersion = FormVersion = __decorate([
    (0, typeorm_1.Entity)('FormVersion')
], FormVersion);
//# sourceMappingURL=form-version.entity.js.map