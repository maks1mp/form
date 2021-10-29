import React from 'react';
import {FieldProps} from 'formik';
import AsyncSelect from 'react-select/async';

export const Search: React.FC<FieldProps & {
  promiseOptions: (input: string) => Promise<any>,
  disabled?: boolean,
}> = ({
  form,
  field,
  promiseOptions,
  disabled,
}) => {
  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      name={field.name}
      defaultValue={field.value}
      onChange={(option) => form.setFieldValue(field.name, (option as any).value)}
      isDisabled={Boolean(disabled)}
      loadOptions={promiseOptions}
    />
  )
}
