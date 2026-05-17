-- ============================================================================
-- SQL FIX SCRIPT - Add Missing Columns to Match Entities
-- Run this to sync database schema with TypeORM entities
-- ============================================================================

-- Add UpdatedDate to CandidateDetails
IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = 'CandidateDetails' AND COLUMN_NAME = 'UpdatedDate'
)
BEGIN
  ALTER TABLE CandidateDetails
  ADD UpdatedDate DATETIME2 NULL;
  PRINT 'Added UpdatedDate to CandidateDetails';
END

-- Add UpdatedDate to QcVerification
IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = 'QcVerification' AND COLUMN_NAME = 'UpdatedDate'
)
BEGIN
  ALTER TABLE QcVerification
  ADD UpdatedDate DATETIME2 NULL;
  PRINT 'Added UpdatedDate to QcVerification';
END

-- Add DocId and StorageSource to EOnboardingDocuments
IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = 'EOnboardingDocuments' AND COLUMN_NAME = 'DocId'
)
BEGIN
  ALTER TABLE EOnboardingDocuments
  ADD DocId INT NULL;
  PRINT 'Added DocId to EOnboardingDocuments';
END

IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = 'EOnboardingDocuments' AND COLUMN_NAME = 'StorageSource'
)
BEGIN
  ALTER TABLE EOnboardingDocuments
  ADD StorageSource NVARCHAR(20) DEFAULT 'LOCAL';
  PRINT 'Added StorageSource to EOnboardingDocuments';
END

-- Add UpdatedDate to EOnboardingDocuments
IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = 'EOnboardingDocuments' AND COLUMN_NAME = 'UpdatedDate'
)
BEGIN
  ALTER TABLE EOnboardingDocuments
  ADD UpdatedDate DATETIME2 NULL;
  PRINT 'Added UpdatedDate to EOnboardingDocuments';
END

-- Add UpdatedDate to EOnboardingResponse
IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = 'EOnboardingResponse' AND COLUMN_NAME = 'UpdatedDate'
)
BEGIN
  ALTER TABLE EOnboardingResponse
  ADD UpdatedDate DATETIME2 NULL;
  PRINT 'Added UpdatedDate to EOnboardingResponse';
END

-- Add UpdatedDate to EOnboardingRequest
IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = 'EOnboardingRequest' AND COLUMN_NAME = 'UpdatedDate'
)
BEGIN
  ALTER TABLE EOnboardingRequest
  ADD UpdatedDate DATETIME2 NULL;
  PRINT 'Added UpdatedDate to EOnboardingRequest';
END

-- Add UpdatedDate to Forms
IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = 'Forms' AND COLUMN_NAME = 'UpdatedDate'
)
BEGIN
  ALTER TABLE Forms
  ADD UpdatedDate DATETIME2 NULL;
  PRINT 'Added UpdatedDate to Forms';
END

-- Add UpdatedDate to FormVersion
IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = 'FormVersion' AND COLUMN_NAME = 'UpdatedDate'
)
BEGIN
  ALTER TABLE FormVersion
  ADD UpdatedDate DATETIME2 NULL;
  PRINT 'Added UpdatedDate to FormVersion';
END

-- Add UpdatedDate to Organization
IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = 'Organization' AND COLUMN_NAME = 'UpdatedDate'
)
BEGIN
  ALTER TABLE Organization
  ADD UpdatedDate DATETIME2 NULL;
  PRINT 'Added UpdatedDate to Organization';
END

-- Add UpdatedDate to OrgFormMapping
IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = 'OrgFormMapping' AND COLUMN_NAME = 'UpdatedDate'
)
BEGIN
  ALTER TABLE OrgFormMapping
  ADD UpdatedDate DATETIME2 NULL;
  PRINT 'Added UpdatedDate to OrgFormMapping';
END

-- Add CandidateId to QcVerification (explicit FK column)
IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = 'QcVerification' AND COLUMN_NAME = 'CandidateId'
)
BEGIN
  ALTER TABLE QcVerification
  ADD CandidateId INT NULL;
  PRINT 'Added CandidateId to QcVerification';
END

-- Add DocType to QcVerification
IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = 'QcVerification' AND COLUMN_NAME = 'DocType'
)
BEGIN
  ALTER TABLE QcVerification
  ADD DocType NVARCHAR(50) NULL;
  PRINT 'Added DocType to QcVerification';
END

-- ============================================================================
-- Verify all columns
-- ============================================================================

PRINT '';
PRINT '════════════════════════════════════════════════════════';
PRINT '  Schema Update Complete - All missing columns added';
PRINT '════════════════════════════════════════════════════════';
PRINT '';

-- Show column list for verification
SELECT 
    TABLE_NAME, 
    COLUMN_NAME, 
    DATA_TYPE,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME IN (
    'CandidateDetails', 'QcVerification', 'EOnboardingDocuments',
    'EOnboardingResponse', 'EOnboardingRequest', 'Forms', 'FormVersion',
    'Organization', 'OrgFormMapping'
)
AND COLUMN_NAME LIKE '%Date'
ORDER BY TABLE_NAME, COLUMN_NAME;
