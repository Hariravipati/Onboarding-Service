"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractAction = exports.ContractStatus = void 0;
var ContractStatus;
(function (ContractStatus) {
    ContractStatus["PENDING"] = "P";
    ContractStatus["APPROVED"] = "A";
    ContractStatus["REJECTED"] = "R";
    ContractStatus["CANCELLED"] = "C";
    ContractStatus["AUTO_APPROVED"] = "AUTO_APPROVED";
})(ContractStatus || (exports.ContractStatus = ContractStatus = {}));
var ContractAction;
(function (ContractAction) {
    ContractAction["APPROVE"] = "Approve";
    ContractAction["REJECT"] = "Reject";
    ContractAction["CANCEL"] = "Cancel";
})(ContractAction || (exports.ContractAction = ContractAction = {}));
//# sourceMappingURL=contract-status.enum.js.map