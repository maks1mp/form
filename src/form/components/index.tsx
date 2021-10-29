import React from 'react';
import DatePicker from 'react-datepicker'
import {ErrorMessage, Field, FieldProps, Form, Formik} from 'formik';
import {FormField, FormValues, Types} from 'types';
import {Select} from 'form/components/Select';

import {Radio} from 'form/components/Radio';
import {Serial} from 'form/components/Serial';
import {States} from 'form/components/States';
import {createFormValidation, createFormValues} from 'form/helpers';

import 'react-datepicker/dist/react-datepicker.css';
import AsyncSelect from 'react-select/async';

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
        <Form style={{marginBottom: 30, marginTop: 30}} onSubmit={formik.handleSubmit}>
          <>
            {fields.map(f => {
              const key = [f.id, f.name, f.label].join('');

              switch (f.type) {
                case Types.textInput:
                case Types.phone:
                case Types.email: {
                  return (
                    <div key={key}>
                      <div>
                        <label>
                          <span>{f.label}</span>
                          <Field name={f.name}/>
                        </label>
                      </div>
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
                      <div>
                        <div>{f.label}</div>
                        <Radio
                          {...restProps}
                          values={values}/>
                      </div>
                      {fieldMeta(f)}
                    </div>
                  )
                }
                case Types.dropdown: {
                  const {options: values, ...restProps} = f;

                  return (
                    <div key={key}>
                      <label>
                        <span>{f.label}</span>
                        <Select
                          {...restProps}
                          values={values}
                        />
                      </label>
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
                      <label>
                        <span>{f.label}</span>
                        <Field
                          {...f}
                          render={({field, form}: FieldProps) => {
                            return (
                              <AsyncSelect
                                cacheOptions
                                formatOptionLabel={(props: Record<string, any>) => {
                                  return (
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                      <img width={32} src={props?.image?.src} alt=""/>
                                      <span>
                                        {props?.title}
                                      </span>
                                    </div>
                                  )
                                }}
                                isClearable
                                defaultOptions
                                name={field.name}
                                value={field.value || ''}
                                isOptionSelected={(option, selectValue) => {
                                  return selectValue.some(v => v.variantId === option.variantId)
                                }}
                                onChange={(option) => form.setFieldValue(field.name, option)}
                                loadOptions={async (inputValue: string) => {
                                  const response = await fetch(`search.json?q=${inputValue}`);

                                  return await response.json();
                                }}
                              />
                            )
                          }}
                        />
                      </label>
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
                          render={({form, field}: FieldProps) => {
                            return (
                              <AsyncSelect
                                cacheOptions
                                defaultOptions
                                name={field.name}
                                defaultValue={field.value}
                                onChange={(option) => {
                                  form.setFieldValue('state', '');
                                  form.setFieldValue(field.name, (option as any).value);
                                }}
                                loadOptions={async (inputValue: string) => {
                                  const response = await fetch(`countries.json`, {
                                    cache: 'force-cache',
                                  });
                                  const data: Record<string, string> = await response.json();

                                  return Object.entries(data)
                                    .filter(([key, value]) => value.toLowerCase().includes(inputValue.toLowerCase()))
                                    .map(([key, value]) => ({
                                      value: key, label: value
                                    }))
                                }}
                              />
                            )
                          }}
                          />
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
