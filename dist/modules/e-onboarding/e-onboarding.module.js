"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EOnboardingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const e_onboarding_service_1 = require("./e-onboarding.service");
const e_onboarding_controller_1 = require("./e-onboarding.controller");
const organization_entity_1 = require("./entities/organization.entity");
const forms_entity_1 = require("./entities/forms.entity");
const form_version_entity_1 = require("./entities/form-version.entity");
const org_form_mapping_entity_1 = require("./entities/org-form-mapping.entity");
const e_onboarding_request_entity_1 = require("./entities/e-onboarding-request.entity");
const e_onboarding_response_entity_1 = require("./entities/e-onboarding-response.entity");
const request_status_history_entity_1 = require("./entities/request-status-history.entity");
let EOnboardingModule = class EOnboardingModule {
};
exports.EOnboardingModule = EOnboardingModule;
exports.EOnboardingModule = EOnboardingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                organization_entity_1.Organization,
                forms_entity_1.Forms,
                form_version_entity_1.FormVersion,
                org_form_mapping_entity_1.OrgFormMapping,
                e_onboarding_request_entity_1.EOnboardingRequest,
                e_onboarding_response_entity_1.EOnboardingResponse,
                request_status_history_entity_1.RequestStatusHistory,
            ]),
        ],
        providers: [e_onboarding_service_1.EOnboardingService],
        controllers: [e_onboarding_controller_1.OnboardingController],
        exports: [e_onboarding_service_1.EOnboardingService],
    })
], EOnboardingModule);
//# sourceMappingURL=e-onboarding.module.js.map