import React, {InputHTMLAttributes} from 'react';
import {Field} from 'formik'

export const Select: React.FC<InputHTMLAttributes<HTMLInputElement> & {
  values: {
    id: string;
    label: string;
    value: string;
  }[]
}> = ({
        name,
        id,
        values
      }) => {
  return (
    <div>
      <div>Picked</div>
      <Field as="select" name={name} id={id}>
        <option />
        {values.map(v => (
          <option key={v.id} value={v.value} label={v.label}>{v.label}</option>
        ))}
      </Field>
    </div>
  )
}
