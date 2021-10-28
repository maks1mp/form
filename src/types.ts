export enum Types {
  product = 'product',
  serialNumber = 'serialNumber',
  date = 'date',
  file = 'file',
  textInput = 'textInput',
  email = 'email',
  country = 'country',
  state = 'state',
  phone = 'phone',
  dropdown = 'dropdown',
  checkboxes = 'checkboxes',
}

export enum Sections {
  product = 'product',
  customer = 'customer',
}

export type FieldType = keyof typeof Types;

export type SectionType = keyof typeof Sections;

export type UniqueId = string;

export interface FormFieldOption {
  id: UniqueId;
  label: string;
  value: string;
}

export interface FormFieldBasic {
  label: string;
  name: string;
  placeholder?: string;
  default?: string;
  value: string;
  description: string;
  required: boolean;
  accept?: string;
  id: UniqueId;
}

export interface FormFieldMultiple extends FormFieldBasic {
  type: Extract<FieldType, 'dropdown' | 'checkboxes'>;
  options: FormFieldOption[];
}

export interface FormSingleField extends FormFieldBasic {
  type: Exclude<FieldType, 'dropdown' | 'checkboxes'>
}

export type FormField = FormSingleField | FormFieldMultiple

export interface FieldsGroup {
  name: SectionType;
  fields: Array<FormField>;
}

export type FormValues = Record<string, string | number | File>

