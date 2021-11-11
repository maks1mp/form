import React, {memo, useEffect, useState} from 'react';
import Select from 'react-select';
import {FieldProps} from 'formik';

let cachedStates:Record<string, Record<string, string>> | null = null;

const States: React.FC<FieldProps & { country: string; disabled?: boolean }> = ({
  country,
  field,
  form,
  disabled
}) => {
  const [states, setStates] = useState<{value: string; label: string;}[]>([]);

  async function fetchStates(country: string) {
    let data: Record<string, Record<string, string>>

    if (!cachedStates) {
      cachedStates = {};

      const response = await fetch(`states.json`, {
        cache: 'force-cache',
      });
      data = await response.json();

      cachedStates = data;
    } else {
      data = cachedStates;
    }

    if (country && country in data) {
      setStates(
        Object.entries(data[country] as Record<string, string>)
        .map(([key, value]) => ({
          value: key, label: value
        }))
      )
    }

    return [];
  }

  useEffect(() => {
    fetchStates(country);
  }, [form, field, country])

  return (
    <Select
      options={states}
      name={field.name}
      value={field.value}
      onChange={(option) => {
        form.setFieldValue(field.name, option)
      }}
      isDisabled={Boolean(disabled)}
    />
  )
}

export default memo(States)
