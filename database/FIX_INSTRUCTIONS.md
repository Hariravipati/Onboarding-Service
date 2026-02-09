# 🔧 Database Schema Fix Instructions

## Problem
Entities have `UpdatedDate` columns defined, but the database tables don't have these columns, causing "Invalid column name 'UpdatedDate'" errors.

## Solution
Run the `fix_missing_columns.sql` script to add all missing columns to the database.

---

## How to Run

### Option 1: SQL Server Management Studio (SSMS) ✅ RECOMMENDED
1. Open **SQL Server Management Studio**
2. Connect to your database server
3. Open a **New Query** window
4. Copy and paste the entire contents of `fix_missing_columns.sql`
5. Press **F5** or click **Execute**
6. Check the **Messages** tab for confirmation

### Option 2: Command Line (sqlcmd)
```bash
sqlcmd -S YOUR_SERVER -d YOUR_DATABASE -i fix_missing_columns.sql
```

Replace:
- `YOUR_SERVER`: Your SQL Server instance (e.g., `localhost` or `DESKTOP-ABC`)
- `YOUR_DATABASE`: Your database name (e.g., `OnboardingService`)

### Option 3: PowerShell
```powershell
cd "d:\Learning\Type script\Onboarding-Service\database"
sqlcmd -S localhost -d OnboardingService -i fix_missing_columns.sql
```

---

## Verification

After running the script, verify the columns were added:

```sql
-- Check CandidateDetails table
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'CandidateDetails'
ORDER BY COLUMN_NAME;

-- Check QcVerification table
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'QcVerification'
ORDER BY COLUMN_NAME;
```

You should see:
- ✓ `CandidateDetails.UpdatedDate` (datetime2, NULL)
- ✓ `QcVerification.UpdatedDate` (datetime2, NULL)
- ✓ And similar columns in other tables

---

## After Running the Script

### 1. Restart Your Application
```bash
# Stop the running server (Ctrl+C)
# Then restart:
npm start
# or
npm run dev
```

### 2. Test the Endpoint
```bash
# Test the updateCandidate endpoint
curl -X PUT http://localhost:3000/candidates/1 \
  -H "Content-Type: application/json" \
  -d '{"fullName": "John Updated", "email": "john@example.com"}'
```

---

## What This Script Does

- ✅ Adds `UpdatedDate` column to 9 tables
- ✅ Sets everything to nullable to avoid breaking existing data
- ✅ Only adds columns if they don't already exist (safe to run multiple times)
- ✅ Prints confirmation messages for each column added
- ✅ Verifies the changes at the end

---

## If You Still Get Errors

1. **Check column exists:**
```sql
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'CandidateDetails' AND COLUMN_NAME = 'UpdatedDate';
```

2. **Check all columns in a table:**
```sql
EXEC sp_help 'CandidateDetails';
```

3. **If still failing**, run the DROP and recreate:
```sql
-- Drop all tables (backup first!)
EXEC drop_all_tables.sql

-- Recreate with complete schema
EXEC create_all_tables.sql
```

---

**Script Location:** `database/fix_missing_columns.sql`
