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
exports.RequestStatusHistory = void 0;
const typeorm_1 = require("typeorm");
const e_onboarding_request_entity_1 = require("./e-onboarding-request.entity");
let RequestStatusHistory = class RequestStatusHistory {
};
exports.RequestStatusHistory = RequestStatusHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'HistoryId' }),
    __metadata("design:type", Number)
], RequestStatusHistory.prototype, "historyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'RequestId' }),
    __metadata("design:type", Number)
], RequestStatusHistory.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'OldStatus', type: 'nvarchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], RequestStatusHistory.prototype, "oldStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'NewStatus', type: 'nvarchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], RequestStatusHistory.prototype, "newStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ChangedAt', type: 'datetime2', default: () => 'SYSDATETIME()' }),
    __metadata("design:type", Date)
], RequestStatusHistory.prototype, "changedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => e_onboarding_request_entity_1.EOnboardingRequest, request => request.statusHistory),
    (0, typeorm_1.JoinColumn)({ name: 'RequestId' }),
    __metadata("design:type", e_onboarding_request_entity_1.EOnboardingRequest)
], RequestStatusHistory.prototype, "request", void 0);
exports.RequestStatusHistory = RequestStatusHistory = __decorate([
    (0, typeorm_1.Entity)('RequestStatusHistory'),
    (0, typeorm_1.Index)('IX_RequestHistory_RequestId', ['requestId'])
], RequestStatusHistory);
//# sourceMappingURL=request-status-history.entity.js.map