import React, {useCallback, useEffect, useState} from 'react';
import {FieldProps} from 'formik';

interface SerialInstance {
  value: string;
  valid: boolean;
  validating: boolean;
}

export const Serial: React.FC<FieldProps & {id: string; label: string; disabled: boolean;}> = ({
  id,
  label,
  field,
  form,
  disabled
}) => {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState<SerialInstance[]>([]);

  const validate = useCallback(async (value: SerialInstance): Promise<SerialInstance> => {
    return new Promise((resolve, reject) => {
      console.log('Fake api call...');

      setTimeout(() => {
        if (Math.random() < 0.5) {
          resolve({ ...value, valid: true, validating: false });
        } else {
          resolve({ ...value, valid: false, validating: false });
        }
      }, 2000)
    })
  }, [])

  const submitIfValid = useCallback(async () => {
    if (!value || submitted.some(v => v.value === value)) {
      return
    }

    const newItem = {
      value,
      valid: false,
      validating: true,
    };
    setSubmitted(v => [...v, newItem]);
    setValue('');

    const result = await validate(newItem)

    setSubmitted(v => v.map(i => {
      if (i.value === result.value) {
        return result;
      }

      return i;
    }))
  }, [value, submitted, validate])

  useEffect(() => {
    const validInstance = submitted.filter(v => v.valid && !v.validating);

    form.setFieldValue(field.name, validInstance.length > 0 ? validInstance.map(v => v.value) : []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.name, submitted])

  return (
    <div>
      {submitted.length > 0 && <ul>
        {submitted.map(s => (
          <li key={s.value}>
            {s.value}
            {' '}
            {s.validating ? 'Checking...' : (s.valid ? 'OK' : 'FAILURE')}
            {' '}
            <button onClick={() => {
              setSubmitted(v => v.filter(v => v.value !== s.value))
            }}>
              Remove
            </button>
          </li>
        ))}
      </ul>}
      <label>
        <span>{label}</span>
        <input
          disabled={disabled || submitted.some(s => s.validating)}
          type="text"
          onKeyDown={e => {
            if (e && e.key === 'Enter') {
              submitIfValid()
            }
          }}
          onBlur={submitIfValid}
          onChange={e => setValue(e.target.value)}
          value={value}
          id={id}
        />
      </label>
    </div>
  )
}
