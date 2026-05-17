-- Employee Verification Tables Migration

CREATE TABLE IF NOT EXISTS "CandidateVerification" (
    "Id"                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "CandidateId"           INT NOT NULL,
    "VerificationType"      VARCHAR(30) NOT NULL,
    "Status"                VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "Vendor"                VARCHAR(30) NOT NULL,
    "VendorReferenceId"     VARCHAR(100),
    "ExtractedDataJson"     TEXT,
    "RawVendorResponseJson" TEXT,
    "ErrorMessage"          TEXT,
    "RetryCount"            INT NOT NULL DEFAULT 0,
    "CreatedAt"             TIMESTAMP DEFAULT NOW(),
    "UpdatedAt"             TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_candidate_verification_candidate_id ON "CandidateVerification"("CandidateId");
CREATE INDEX IF NOT EXISTS idx_candidate_verification_type ON "CandidateVerification"("VerificationType");

CREATE TABLE IF NOT EXISTS "VerificationAudit" (
    "Id"                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "CandidateVerificationId"   UUID NOT NULL,
    "Action"                    VARCHAR(100),
    "OldStatus"                 VARCHAR(30),
    "NewStatus"                 VARCHAR(30),
    "Actor"                     VARCHAR(100),
    "ActorType"                 VARCHAR(30),
    "CreatedAt"                 TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_audit_verification_id ON "VerificationAudit"("CandidateVerificationId");
