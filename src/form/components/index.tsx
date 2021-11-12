import React from 'react';
import DatePicker from 'react-datepicker'
import {ErrorMessage, Field, FieldProps, Form, Formik} from 'formik';
import {FormField, FormValues, Types} from 'types';
import {Select} from 'form/components/Select';

import {Radio} from 'form/components/Radio';
import {Serial} from 'form/components/Serial';
import States from 'form/components/States';
import Country from 'form/components/Country';
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
      onSubmit={async (values: FormValues, { resetForm }) => {
        try {
          await handleSubmit(values)
        } finally {
          resetForm(values)
        }
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
                          <Field name={f.name} disabled={formik.isSubmitting} />
                        </label>
                      </div>
                      {fieldMeta(f)}
                    </div>
                  )
                }
                case Types.serialNumber: {
                  return (
                    <div key={key}>
                      <Field
                        render={(props: FieldProps) => (
                          <Serial
                            {...props}
                            {...f}
                            disabled={formik.isSubmitting}
                          />
                        )}
                        {...f}
                      />
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
                          disabled={formik.isSubmitting}
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
                          disabled={formik.isSubmitting}
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
                          disabled={formik.isSubmitting}
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
                      <label htmlFor={f.id}>
                        <span>{f.label}</span>
                      </label>
                      <DatePicker
                        id={f.id}
                        disabled={formik.isSubmitting}
                        required={f.required}
                        selected={value ? new Date(value as string) : null}
                        dateFormat="MMMM d, yyyy"
                        onBlur={formik.handleBlur}
                        name={f.name}
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
                      <label>
                        <span>{f.label}</span>
                        <Field
                          disabled={formik.isSubmitting}
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
                                isDisabled={formik.isSubmitting}
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
                          disabled={formik.isSubmitting}
                          render={(props: FieldProps) => {
                            return (
                              <Country {...props} disabled={formik.isSubmitting} />
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
                            return <States country={country} {...props} disabled={!Boolean(country) || formik.isSubmitting} />
                          }}
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
          {formik.isSubmitting && <h3>Loading...</h3>}
          {children}
        </Form>
      )}
    </Formik>
  )

}

export default FormContent;
