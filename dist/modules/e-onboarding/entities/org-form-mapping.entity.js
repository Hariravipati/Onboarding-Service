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
exports.OrgFormMapping = void 0;
const typeorm_1 = require("typeorm");
const organization_entity_1 = require("./organization.entity");
const form_version_entity_1 = require("./form-version.entity");
let OrgFormMapping = class OrgFormMapping {
};
exports.OrgFormMapping = OrgFormMapping;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'OrgFormMappingId' }),
    __metadata("design:type", Number)
], OrgFormMapping.prototype, "orgFormMappingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'OrgId' }),
    __metadata("design:type", Number)
], OrgFormMapping.prototype, "orgId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FormVersionId' }),
    __metadata("design:type", Number)
], OrgFormMapping.prototype, "formVersionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsActive', type: 'bit', default: true }),
    __metadata("design:type", Boolean)
], OrgFormMapping.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'CreatedDate', type: 'datetime2', default: () => 'SYSDATETIME()' }),
    __metadata("design:type", Date)
], OrgFormMapping.prototype, "createdDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organization_entity_1.Organization, org => org.formMappings),
    (0, typeorm_1.JoinColumn)({ name: 'OrgId' }),
    __metadata("design:type", organization_entity_1.Organization)
], OrgFormMapping.prototype, "organization", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => form_version_entity_1.FormVersion, version => version.orgMappings),
    (0, typeorm_1.JoinColumn)({ name: 'FormVersionId' }),
    __metadata("design:type", form_version_entity_1.FormVersion)
], OrgFormMapping.prototype, "formVersion", void 0);
exports.OrgFormMapping = OrgFormMapping = __decorate([
    (0, typeorm_1.Entity)('OrgFormMapping'),
    (0, typeorm_1.Index)('IX_OrgFormMapping_OrgId', ['orgId']),
    (0, typeorm_1.Index)('IX_OrgFormMapping_FormVersionId', ['formVersionId'])
], OrgFormMapping);
//# sourceMappingURL=org-form-mapping.entity.js.map