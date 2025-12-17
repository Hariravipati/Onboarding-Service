const { parentPort } = require('worker_threads');

// Convert Excel serial number to date string format
function convertExcelDateToString(excelSerial, format = 'DD-MMM-YYYY') {
  if (typeof excelSerial !== 'number') {
    return excelSerial;
  }
  
  const date = new Date((excelSerial - 25569) * 86400 * 1000);
  
  if (isNaN(date.getTime())) {
    return excelSerial;
  }
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  if (format === 'MMM-yyyy') {
    return `${month}-${year}`;
  }
  
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
}

function validateRows(rows, schema) {
  const validRows = [];
  const invalidRows = [];
   
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].row;
    const rowIndex = rows[i].rowIndex;
    const errors = [];

    for (const field of schema.schema) {
      let value = row[field.name];
      const isEmpty = value === null || value === undefined || value === '';

      if (field.required && isEmpty) {
        errors.push(`Field '${field.name}' is required.`);
        continue;
      }

      if (!isEmpty) {
        // Convert Excel date serial numbers to string format
        if (field.type === 'date' && typeof value === 'number') {
          value = convertExcelDateToString(value);
          rows[i].row[field.name] = value;
        }
        else if (field.type === 'string' && typeof value === 'number' && field.format === 'MMM-yyyy') {
          value = convertExcelDateToString(value, 'MMM-yyyy');
          rows[i].row[field.name] = value;
        }
        else if (field.name === '*Current Month' && typeof value === 'number') {
          value = convertExcelDateToString(value, 'MMM-yyyy');
          rows[i].row[field.name] = value;
        }

        const stringValue = String(value);

        switch (field.type) {
          case 'string':
            const checkValue = String(value);
            if (field.maxLength && checkValue.length > field.maxLength) {
              errors.push(`Field '${field.name}' exceeds maximum length of ${field.maxLength}.`);
            }
            if (field.minLength && checkValue.length < field.minLength) {
              errors.push(`Field '${field.name}' is shorter than minimum length ${field.minLength}.`);
            }
            if (field.pattern) {
              const regex = new RegExp(field.pattern);
              if (!regex.test(checkValue)) {
                errors.push(`Field '${field.name}' does not match required pattern ${field.format}.`);
              }
            }
            break;
          case 'number':
            if (isNaN(Number(value))) {
              errors.push(`Field '${field.name}' must be a valid number.`);
            }
            break;
          case 'date':
            // Check pattern first if defined
            if (field.pattern) {
              const regex = new RegExp(field.pattern);
              if (!regex.test(stringValue)) {
                errors.push(`Field '${field.name}' does not match required pattern ${field.format}.`);
                break;
              }
            }
            // Then validate as date
            if (isNaN(Date.parse(stringValue))) {
              errors.push(`Field '${field.name}' must be a valid date.`);
            }
            break;
          case 'boolean':
            if (stringValue.toLowerCase() !== 'true' && stringValue.toLowerCase() !== 'false') {
              errors.push(`Field '${field.name}' must be a boolean (true/false).`);
            }
            break;
          case 'enum':
            if (!field.allowedValues.includes(stringValue)) {
              errors.push(`Field '${field.name}' must be one of: ${field.allowedValues.join(', ')}.`);
            }  
            break;
          default:
            errors.push(`Unknown type '${field.type}' for field '${field.name}'.`);
        }
      }
    }

    if (errors.length === 0) {
      validRows.push({ rowIndex: i, row,key:row[schema.key]} );
    } else {
      invalidRows.push({ rowIndex: i, row, errors,key:row[schema.unique_columns?.[0]] });
    }
  }
  return { validRows, invalidRows };
}

parentPort.on('message', ({ rows, schema }) => {
  const result = validateRows(rows, schema);
  parentPort.postMessage(result);
});