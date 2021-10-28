import React from 'react';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import {FormField, FormValues, Types} from '../../types';
import {Select} from './Select';
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css';
import {Radio} from './Radio';
import {Search} from './Search';
import {createFormValidation, createFormValues} from '../helpers';

const FormContent: React.FC<{
  fields: FormField[],
  handleSubmit: (p: FormValues) => void,
}> = ({
  fields,
  handleSubmit,
  children
}) => {
  const fieldMeta = (f: FormField) => {
    return (
      <>
        {f.description && <div>{f.description}</div>}
        <ErrorMessage name={f.name} />
      </>
    )
  }

  return (
    <Formik
      initialValues={createFormValues(fields)}
      validationSchema={createFormValidation(fields)}
      onSubmit={(values: FormValues) => {
        handleSubmit(values)
      }}
    >
      {formik => (
        <Form onSubmit={formik.handleSubmit}>
          <>
            {fields.map(f => {
              const key = [f.id, f.name, f.label].join('');

              switch (f.type) {
                case Types.textInput:
                case Types.serialNumber:
                case Types.email: {
                  return (
                    <div key={key}>
                      <span>{f.label}</span>
                      <Field name={f.name}/>
                      {fieldMeta(f)}
                    </div>
                  )
                }
                case Types.file: {
                  return (
                    <div key={key}>
                      <label>
                        {f.label}
                      </label>
                      <div>
                        <input
                          accept={f.accept}
                          type={f.type}
                          name={f.name}
                          onChange={(event) => {
                            formik.setFieldValue(f.name, event?.target?.files?.[0]);
                          }}
                        />
                      </div>
                      {fieldMeta(f)}
                    </div>
                  )
                }
                case Types.checkboxes: {
                  const {options: values, ...restProps} = f;

                  return (
                    <div key={key}>
                      <Radio
                        {...restProps}
                        values={values}/>
                      {fieldMeta(f)}
                    </div>
                  )
                }
                case Types.dropdown: {
                  const {options: values, ...restProps} = f;

                  return (
                    <div key={key}>
                      <Select
                        {...restProps}
                        values={values}
                      />
                      {fieldMeta(f)}
                    </div>
                  )
                }
                case Types.date: {
                  const value = formik.values[f.name];

                  return (
                    <div key={key}>
                      <DatePicker
                        selected={value ? new Date(value as string) : null}
                        dateFormat="MMMM d, yyyy"
                        className="form-control"
                        name="startDate"
                        onChange={date => {
                          if (date) {
                            formik.setFieldValue(f.name, date.toString())
                          }
                        }}
                      />
                      {fieldMeta(f)}
                    </div>
                  )
                }
                case Types.product: {
                  return (
                    <div key={key}>
                      <Field {...f} component={Search} />
                      {fieldMeta(f)}
                    </div>
                  )
                }
                default:
                  return <div key={key}>Not implemented field {f.type}</div>
              }
            })}
          </>
          {children}
        </Form>
      )}
    </Formik>
  )

}

export default FormContent;
