import React from 'react';
import DatePicker from 'react-datepicker'
import {ErrorMessage, Field, FieldProps, Form, Formik} from 'formik';
import {FormField, FormValues, Types} from '../../types';
import {Select} from './Select';

import {Radio} from './Radio';
import {Search} from './Search';
import {Serial} from './Serial';
import {createFormValidation, createFormValues} from '../helpers';

import 'react-datepicker/dist/react-datepicker.css';
import {States} from './States';

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
        <ErrorMessage name={f.name}/>
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
        <Form style={{ marginBottom: 30, marginTop: 30 }} onSubmit={formik.handleSubmit}>
          <>
            {fields.map(f => {
              const key = [f.id, f.name, f.label].join('');

              switch (f.type) {
                case Types.textInput:
                case Types.phone:
                case Types.email: {
                  return (
                    <div key={key}>
                      <span>{f.label}</span>
                      <Field name={f.name}/>
                      {fieldMeta(f)}
                    </div>
                  )
                }
                case Types.serialNumber: {
                  return (
                    <div key={key}>
                      <Field component={Serial} {...f} />
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
                      <label>
                        <span>{f.label}</span>
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
                      </label>
                      {fieldMeta(f)}
                    </div>
                  )
                }
                case Types.product: {
                  return (
                    <div key={key}>
                      <Field
                        {...f}
                        component={Search}
                        promiseOptions={async (inputValue: string) => {
                          const response = await fetch(`search.json?q=${inputValue}`);
                          const data = await response.json();

                          return data.map((d: FormValues) => ({
                            value: d.id, label: d.title
                          }))
                        }}/>
                      {fieldMeta(f)}
                    </div>
                  )
                }
                case Types.country: {
                  return (
                    <div key={key}>
                      <label>
                        <span>
                          {f.label}
                        </span>
                        <Field
                          {...f}
                          component={Search}
                          promiseOptions={async (inputValue: string) => {
                            const response = await fetch(`countries.json`, {
                              cache: 'force-cache',
                            });
                            const data: Record<string, string> = await response.json();

                            return Object.entries(data)
                              .filter(([key, value]) => value.toLowerCase().includes(inputValue.toLowerCase()))
                              .map(([key, value]) => ({
                                value: key, label: value
                              }))
                          }}/>
                      </label>
                      {fieldMeta(f)}
                    </div>
                  )
                }

                case Types.state: {
                  const country = (formik.values?.country ?? '') as string;


                  return (
                    <div key={key}>
                      <label>
                        <span>
                          {f.label}
                        </span>
                        <Field
                          {...f}
                          country={country}
                          render={(props: FieldProps) => {
                            return <States country={country} {...props} />
                          }}
                          disabled={!Boolean(country)}
                        />
                      </label>
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
