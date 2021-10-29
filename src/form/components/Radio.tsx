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
    <div role="group" id={id}>
      {values.map(v => (
        <label key={v.id}>
            <span>
              {v.label}
            </span>
          <Field type="radio" id={v.id} name={name} value={v.value}/>
        </label>
      ))}
    </div>
  )
}
