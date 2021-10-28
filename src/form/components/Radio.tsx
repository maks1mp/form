import React, {InputHTMLAttributes} from 'react';
import {Field} from 'formik'

export const Radio: React.FC<InputHTMLAttributes<HTMLInputElement> & {
  values: {
    id: string;
    label: string;
    value: string;
  }[]
}> = ({
  name,
  values,
  id,
      }) => {
  return (
    <div id={id}>
      <div>Picked</div>
      <div role="group">
        {values.map(v => (
          <label key={v.id}>
            <span>
              {v.label}
            </span>
            <Field type="radio" id={v.id} name={name} value={v.value} />
          </label>
        ))}
      </div>
    </div>
  )
}
