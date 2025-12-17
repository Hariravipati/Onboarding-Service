const { parentPort } = require('worker_threads');

function validateRow(row, schema) {
  const errors = [];

  for (const field of schema.schema) {
    const value = row[field.name];
    const isEmpty = value === null || value === undefined || value === '';

    // Required check
    if (field.required && isEmpty) {
      errors.push(`Field '${field.name}' is required.`);
      continue;
    }

    // Type validation
    if (!isEmpty) {
      switch (field.type) {
        case 'string':
          if (typeof value !== 'string') {
            errors.push(`Field '${field.name}' must be a string.`);
          } else {
            if (field.maxLength && value.length > field.maxLength) {
              errors.push(`Field '${field.name}' exceeds maximum length of ${field.maxLength}.`);
            }
            if (field.minLength && value.length < field.minLength) {
              errors.push(`Field '${field.name}' is shorter than minimum length ${field.minLength}.`);
            }
            if (field.pattern) {
              const regex = new RegExp(field.pattern);
              if (!regex.test(value)) {
                errors.push(`Field '${field.name}' does not match required pattern.`);
              }
            }
          }
          break;

        case 'number':
          if (isNaN(Number(value))) {
            errors.push(`Field '${field.name}' must be a valid number.`);
          }
          break;

        case 'date':
          if (isNaN(Date.parse(value))) {
            errors.push(`Field '${field.name}' must be a valid date.`);
          }
          break;

        default:
          errors.push(`Unknown type '${field.type}' for field '${field.name}'.`);
      }
    }
  }

  return errors;
}

parentPort.on('message', ({ row, schema }) => {
  const errors = validateRow(row, schema);
  parentPort.postMessage(errors);
});