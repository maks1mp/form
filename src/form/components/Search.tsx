import React from 'react';
import {FieldProps} from 'formik';
import AsyncSelect from 'react-select/async';
import {FormValues} from '../../types';

export const Search: React.FC<FieldProps> = ({
  form,
  field,
}) => {
  const promiseOptions = async (inputValue: string) => {
    const response = await fetch(`search.json?q=${inputValue}`);
    const data = await response.json();

    return data.map((d: FormValues) => ({
      value: d.id, label: d.title
    }))
  }

  return (
    <AsyncSelect
      name={field.name}
      cacheOptions
      defaultOptions
      loadOptions={promiseOptions}
      onChange={(option) => form.setFieldValue(field.name, (option as any).value)}
    />
  )
}
