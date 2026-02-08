# Database SQL Scripts

Complete SQL scripts for the Onboarding Service database schema.

## 📋 Files Description

### 1. **create_all_tables.sql** ⭐ START HERE
Complete database schema creation with all tables, indexes, and constraints.
- **Use when**: Setting up a new database from scratch
- **Execution time**: ~30 seconds
- **Tables created**: 11
- **Contains**: All CREATE TABLE statements in proper dependency order

**Steps to run:**
```sql
-- In SQL Server Management Studio
-- 1. Open create_all_tables.sql
-- 2. Select all (Ctrl+A)
-- 3. Execute (F5)
-- 4. Check the Messages tab for confirmation
```

---

### 2. **drop_all_tables.sql** 🗑️
Safely drops all tables in the correct order.
- **Use when**: You need to reset the database schema
- **⚠️ WARNING**: This deletes ALL data permanently
- **Tables dropped**: 11

**Steps to run:**
```sql
-- BACKUP YOUR DATA FIRST!
-- Then execute this script
```

---

### 3. **insert_sample_data.sql** 📊
Populates all tables with realistic sample data.
- **Use when**: You need test data for development/testing
- **Prerequisites**: Must run `create_all_tables.sql` first
- **Records inserted**: ~100+ test records across all tables
- **Includes**: 
  - 5 Organizations
  - 5 Forms with versions
  - 8 Onboarding requests
  - 8 Candidates with documents
  - Complete workflow examples

**Steps to run:**
```sql
-- 1. First: Run create_all_tables.sql
-- 2. Then: Run insert_sample_data.sql
-- 3. Verify with the summary queries at the end
```

---

### 4. **individual_table_scripts.sql** 🧩
Separate CREATE TABLE statements for individual tables.
- **Use when**: Creating tables one at a time or testing specific tables
- **Tables**: All 11 tables with individual drop/create logic
- **Dependency info**: Comments show which tables are required

**Steps to run:**
```sql
-- Copy the script for the table you want
-- Execute it in SQL Server Management Studio
-- Each table is self-contained with DROP IF EXISTS logic
```

---

### 5. **SCHEMA_REFERENCE.sql** 📖
Comprehensive documentation of all tables, columns, relationships, and business logic.
- **Use when**: Understanding the database structure
- **Contains**:
  - Detailed table documentation
  - Column descriptions and types
  - All relationships and constraints
  - Index information
  - Business logic explanations
  - Relationship diagram
  - Maintenance procedures

**This is NOT executable - it's for reference only**

---

## 🚀 Quick Start Guide

### New Database Setup (Recommended)
```bash
# Step 1: Execute create_all_tables.sql
# Step 2: Execute insert_sample_data.sql
# Done! You have a fully populated development database
```

### Individual Table Creation
```bash
# If you want to create specific tables only:
# 1. Open individual_table_scripts.sql
# 2. Find your table section
# 3. Copy and execute just that section
```

### Database Reset
```bash
# If you need to start over:
# 1. Execute drop_all_tables.sql (⚠️ CAREFUL!)
# 2. Execute create_all_tables.sql
# 3. Execute insert_sample_data.sql (optional)
```

---

## 📊 Database Statistics

### Tables (11 total)
| Table Name | Type | Purpose |
|---|---|---|
| Organization | Master | Organization data |
| Forms | Master | Form templates |
| FormVersion | Master | Form versions with schemas |
| OrgFormMapping | Mapping | Org to Form mapping |
| EOnboardingRequest | Transaction | Onboarding requests |
| CandidateDetails | Transaction | Candidate information |
| EOnboardingResponse | Transaction | Form responses |
| EOnboardingDocuments | Transaction | Uploaded documents |
| QcVerification | Transaction | QC verification status |
| RequestStatusHistory | Audit | Status change history |
| MobileOTP | Temporary | OTP management |

### Relationships
- **Total FK Constraints**: 8
- **Cascade Delete**: 8 relationships
- **Unique Constraints**: 5
- **Indexes**: 30+

---

## 🔗 Relationships Summary

```
Organization (1) ──── (N) OrgFormMapping ──── (N) FormVersion ──── (1) Forms
                                                      |
                                              EOnboardingRequest
                                                      |
                                      ┌───────────────┼───────────────┐
                                      |               |               |
                                CandidateDetails  RequestStatusHistory
                                (candidate info)     (audit trail)
                                      |
                        ┌─────────────┼─────────────┐
                        |             |             |
                EOnboardingResponse  EOnboardingDocuments
                (form response)        (uploaded docs)
                                            |
                                       QcVerification
                                      (verification)

MobileOTP (standalone for OTP verification)
```

---

## ⚙️ Execution Requirements

### Windows (SQL Server Management Studio)
```
1. Open SQL Server Management Studio
2. Connect to your SQL Server instance
3. Open the .sql file
4. Click "Execute" or press F5
```

### Command Line (sqlcmd)
```bash
sqlcmd -S SERVER_NAME -d DATABASE_NAME -i create_all_tables.sql
sqlcmd -S SERVER_NAME -d DATABASE_NAME -i insert_sample_data.sql
```

### .NET Code (Entity Framework/TypeORM)
```typescript
// The TypeORM application will auto-sync using these entities
// If synchronize: false, run SQL scripts manually first
import { AppModule } from './app.module';
```

---

## 📝 Sample Data Overview

When you run `insert_sample_data.sql`, you get:

### Organizations
- Tech Solutions Inc
- Global Finance Corp
- Healthcare Plus
- EduTech Academy
- Retail Masters

### Form Types
- Employee Onboarding
- Vendor Registration
- Customer KYC
- Contractor Agreement
- Partner Registration

### Test Candidates
- 8 different candidates with realistic data
- Various document types (Aadhar, PAN, Passport, etc.)
- QC verification status for each document
- Complete request status history

---

## 🔍 Verification Queries

After running the scripts, verify with these queries:

```sql
-- Count records in each table
SELECT 'Organizations' AS TableName, COUNT(*) AS RecordCount FROM Organization
UNION ALL SELECT 'Forms', COUNT(*) FROM Forms
UNION ALL SELECT 'FormVersions', COUNT(*) FROM FormVersion
... (etc)

-- List all tables
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'dbo' ORDER BY TABLE_NAME;

-- View all foreign keys
SELECT 
    OBJECT_NAME(CONSTRAINT_OBJECT_ID) AS ConstraintName,
    OBJECT_NAME(parent_object_id) AS TableName
FROM sys.foreign_keys;

-- Check specific table structure
EXEC sp_help 'EOnboardingRequest';
```

---

## 🛡️ Backup Recommendations

**Before running drop_all_tables.sql**, backup your database:

```sql
-- SQL Server Backup
BACKUP DATABASE [YourDatabaseName] 
TO DISK = 'C:\backup\YourDatabase.bak'
WITH FORMAT, INIT, NAME = 'Full Backup';

-- Or use SQL Server Management Studio menu:
-- Right-click Database > Tasks > Back Up...
```

---

## ❓ Common Issues & Solutions

### Issue: "Cannot insert explicit value for identity column"
**Solution**: Remove IDENTITY specification when executing INSERT statements with explicit IDs

### Issue: "Foreign key constraint fails"
**Solution**: Ensure tables are created in order (run create_all_tables.sql in full)

### Issue: "Table already exists"
**Solution**: Run drop_all_tables.sql first, then create_all_tables.sql

### Issue: "Column name is invalid"
**Solution**: Verify you're using the exact column names shown in SCHEMA_REFERENCE.sql

---

## 📞 Support

For schema documentation, see: **SCHEMA_REFERENCE.sql**

For TypeORM entity definitions, see: **src/modules/e-onboarding/entities/**

---

**Last Updated**: February 7, 2026  
**TypeORM Version**: Compatible with NestJS TypeORM module  
**Database**: MS SQL Server 2019+
