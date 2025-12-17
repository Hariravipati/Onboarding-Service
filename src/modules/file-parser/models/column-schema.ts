
export interface columnschema {
  name: string;
  label: string;
  type: 'string' | 'number' | 'date';
  required?: boolean;
  unique?: boolean;
  format?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  allowNumeric?: boolean;
}

export interface feature_schema {
  feature_id: number;
  feature_name: string;
  headers: string[];
  unique_columns: string[];
  schema: columnschema[];
}
 
