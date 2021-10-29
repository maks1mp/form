import React, {useCallback, useState} from 'react';
import {FieldProps} from 'formik';

export const Serial: React.FC<FieldProps & {id: string; label: string}> = ({
  id,
  label,
  field,
  form
}) => {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = useCallback(async (): Promise<{ valid: boolean }> => {
    return new Promise((resolve, reject) => {
      console.log('Fake api call...');

      setTimeout(() => {
        if (Math.random() < 0.5) {
          resolve({ valid: true });
        } else {
          resolve({ valid: false });
        }
      }, 2000)
    })
  }, [])

  const submitIfValid = useCallback(async () => {
    setSubmitted(value);
    setValue('');
    setLoading(true);

    const { valid } = await validate();

    form.setFieldValue(field.name, valid ? value : '');
    setCheck(valid);
    setLoading(false);
  }, [value, field.name, form, validate])

  return (
    <div>
      {submitted && <div>
        <b>{submitted}</b> <span>{loading ? 'Checking...' : (check ? 'OK' : 'FAILURE')}</span>
        {' '}
        <button onClick={() => {
          setSubmitted('')
          form.setFieldValue(field.name, '');
        }}>
            Clear
        </button>
      </div>}
      <label>
        <span>{label}</span>
        <input
          disabled={Boolean(submitted)}
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
