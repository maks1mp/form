import React from 'react';
import {FieldsGroup, FormValues, Sections} from 'types';
import FormContent from '../form/components';

const FlowSingle: React.FC<{
  formData: FieldsGroup[],
  onSubmit: (wholeData: FormValues) => void
}> = ({
  formData,
  onSubmit,
}) => {
  return (
    <>
      <FormContent
        fields={formData.find(f => f.name === Sections.all)!.fields}
        handleSubmit={onSubmit}
      >
          <button type="submit">
            Register
          </button>
      </FormContent>
    </>
  )
}

export default FlowSingle;

