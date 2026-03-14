import { ValidatorFn } from '@angular/forms';

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'date'
  | 'file'
  | 'select'
  | 'radio'
  | 'checkbox';

export interface FieldOption {
  label: string;
  value: any;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  disabled?: boolean;
  step?: number;
  row?: number;
  column?: number;
  placeholder?: string;
  value?: any;
  options?: FieldOption[];
  min?: number;
  max?: number;
  inputStep?: number;
  accept?: string;
  multiple?: boolean;
  validators?: ValidatorFn[];
}
