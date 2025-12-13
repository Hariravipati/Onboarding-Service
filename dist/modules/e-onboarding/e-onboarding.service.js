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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EOnboardingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organization_entity_1 = require("./entities/organization.entity");
const e_onboarding_request_entity_1 = require("./entities/e-onboarding-request.entity");
const e_onboarding_response_entity_1 = require("./entities/e-onboarding-response.entity");
let EOnboardingService = class EOnboardingService {
    constructor(orgRepository, requestRepository, responseRepository) {
        this.orgRepository = orgRepository;
        this.requestRepository = requestRepository;
        this.responseRepository = responseRepository;
    }
    findAllOrganizations() {
        return this.orgRepository.find({ where: { isActive: true } });
    }
    findRequestsByOrg(orgId) {
        return this.requestRepository.find({
            where: { orgId },
            relations: ['organization', 'formVersion', 'response']
        });
    }
    createRequest(requestData) {
        return this.requestRepository.save(requestData);
    }
    updateResponse(requestId, responseData) {
        return this.responseRepository.save({ requestId, ...responseData });
    }
};
exports.EOnboardingService = EOnboardingService;
exports.EOnboardingService = EOnboardingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __param(1, (0, typeorm_1.InjectRepository)(e_onboarding_request_entity_1.EOnboardingRequest)),
    __param(2, (0, typeorm_1.InjectRepository)(e_onboarding_response_entity_1.EOnboardingResponse)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EOnboardingService);
//# sourceMappingURL=e-onboarding.service.js.map