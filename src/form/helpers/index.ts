import * as yup from 'yup';
import {FormField, FormValues} from '../../types';

export function createFormValues(fields: FormField[]): FormValues {
  return fields.reduce((acc, next) => ({
    ...acc,
    [next.name]: next.default || '',
  }), {} as FormValues)
}

export function createFormValidation(fields: FormField[]) {
  const fieldsValidation = fields.reduce((acc, next) => {
    const f = yup.lazy(v => {
      if (next.required) {
        return yup.string().required(`${next.label} is a required field`)
      }

      return yup.mixed()
    })

    return {
      ...acc,
      [next.name]: f,
    };
  }, {});

  return yup.object().shape(fieldsValidation)
}
