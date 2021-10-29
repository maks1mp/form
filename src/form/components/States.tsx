import {useEffect, useState} from 'react';
import Select from 'react-select';
import {FieldProps} from 'formik';

export const States: React.FC<FieldProps & { country: string; disabled?: boolean }> = ({
  country,
  field,
  form,
  disabled
}) => {
  const [states, setStates] = useState<{value: string; label: string;}[]>([]);

  async function fetchStates(country: string) {
    const response = await fetch(`states.json`, {
      cache: 'force-cache',
    });
    const data: Record<string, Record<string, string>> = await response.json();

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
    fetchStates(country)
  }, [country])

  return (
    <Select
      options={states}
      name={field.name}
      defaultValue={field.value}
      onChange={(option) => form.setFieldValue(field.name, (option as any).value)}
      isDisabled={Boolean(disabled)}
    />
  )
}
