import * as yup from 'yup';
import {FormField, FormValues, Types} from 'types';

export function createFormValues(fields: FormField[]): FormValues {
  return fields.reduce((acc, next) => ({
    ...acc,
    [next.name]: next.default || '',
  }), {} as FormValues)
}

export function createFormValidation(fields: FormField[]) {
  const fieldsValidation = fields.reduce((acc, next) => {
    const f = yup.lazy(v => {
      if (next.type === Types.product && next.required) {
        return yup.object().required(`${next.label} is a required field`).nullable()
      }

      if (next.type === Types.email && next.required) {
        return yup.string().email(`Invalid email`).required(`${next.label} is a required field`)
      }

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
