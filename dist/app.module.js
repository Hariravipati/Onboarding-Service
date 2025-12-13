"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const organization_entity_1 = require("./modules/e-onboarding/entities/organization.entity");
const e_onboarding_request_entity_1 = require("./modules/e-onboarding/entities/e-onboarding-request.entity");
const e_onboarding_response_entity_1 = require("./modules/e-onboarding/entities/e-onboarding-response.entity");
const form_version_entity_1 = require("./modules/e-onboarding/entities/form-version.entity");
const forms_entity_1 = require("./modules/e-onboarding/entities/forms.entity");
const org_form_mapping_entity_1 = require("./modules/e-onboarding/entities/org-form-mapping.entity");
const request_status_history_entity_1 = require("./modules/e-onboarding/entities/request-status-history.entity");
const e_onboarding_module_1 = require("./modules/e-onboarding/e-onboarding.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mssql',
                host: '122.166.174.83',
                port: 1433,
                username: 'sa',
                password: 'Sqlserver123$',
                database: 'onboarding_db',
                entities: [
                    organization_entity_1.Organization,
                    forms_entity_1.Forms,
                    form_version_entity_1.FormVersion,
                    org_form_mapping_entity_1.OrgFormMapping,
                    e_onboarding_request_entity_1.EOnboardingRequest,
                    e_onboarding_response_entity_1.EOnboardingResponse,
                    request_status_history_entity_1.RequestStatusHistory,
                ],
                synchronize: true,
                options: {
                    encrypt: false,
                    trustServerCertificate: true,
                },
            }),
            e_onboarding_module_1.EOnboardingModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map