import React, {memo} from 'react';
import AsyncSelect from 'react-select/async';
import {FieldProps} from 'formik';

let cachedCountries:Record<string, string> | null = null;

const Country:React.FC<FieldProps & {disabled: boolean}> = ({
  field,
  form,
  disabled
}) => {
  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      name={field.name}
      defaultValue={field.value}
      isDisabled={disabled}
      onChange={(option) => {
        form.setFieldValue('state', '');
        form.setFieldValue(field.name, (option as any).value);
      }}
      loadOptions={async (inputValue: string) => {
        let data: Record<string, string> | null

        if (!cachedCountries) {
          const response = await fetch(`countries.json`, {
            cache: 'force-cache',
          });

          cachedCountries = await response.json();
          data = cachedCountries;
        } else {
          data = cachedCountries;
        }

        return Object.entries(data!)
          .filter(([key, value]) => value.toLowerCase().includes(inputValue.toLowerCase()))
          .map(([key, value]) => ({
            value: key, label: value
          }))
      }}
    />
  )
}

export default memo(Country);
