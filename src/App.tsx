import React, {useState} from 'react';
import {useForm} from 'form/hooks/useForm';
import {FormValues, Sections} from './types';
import FormContent from 'form/components';

const App: React.FC = () => {
  const {formData, loading, error} = useForm();
  const [fulfilledOrder, setFulfilledOrder] = useState<FormValues[] | null>();
  const [visibleEdit, setVisibleEdit] = useState(false);

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  if (error) {
    return (
      <div>Error...</div>
    )
  }

  return formData ? (
    <>
      {fulfilledOrder && Array.isArray(fulfilledOrder) && (
        <>
          <table style={{border: 'solid', borderCollapse: 'collapse', marginBottom: 20}} width="100%">
            <thead>
            <tr>
              {formData.find(d => d.name === Sections.product)?.fields!.map(f => (
                <th key={f.id} style={{border: 'solid'}}>{f.label}</th>))}
            </tr>
            </thead>
            <tbody>
            {fulfilledOrder.map((order, index) => {
              return (
                <tr key={index}>
                  {Object.values(order).map((v, i) => (
                    <td style={{border: 'solid'}} key={i}>{typeof v === 'object' ? ('name' in v ? v.name : (
                      <div style={{ textAlign: 'center' }}>
                        <img width={32} src={v.image.src} alt=""/>
                        <div>
                          {v.title}
                        </div>
                      </div>
                    )) : v}</td>))}
                </tr>
              )
            })}
            </tbody>
          </table>

          {visibleEdit && <button onClick={() => {
            setVisibleEdit(false)
          }}>ADD NEW PRODUCT
          </button>}

          {!visibleEdit && <button onClick={() => {
            setVisibleEdit(true)
          }}>CANCEL
          </button>}
        </>
      )}


      {!visibleEdit && <FormContent
          fields={formData.find(d => d.name === Sections.product)?.fields!}
          handleSubmit={productPayload => {
            setFulfilledOrder(prevState => (prevState && Array.isArray(prevState))
              ? [...prevState, productPayload]
              : [productPayload]
            )
            setVisibleEdit(true)
          }}
      >
          <button type="submit">
              Register
          </button>
      </FormContent>}

      {visibleEdit && fulfilledOrder && Array.isArray(fulfilledOrder) && (
        <FormContent
            fields={formData.find(d => d.name === Sections.customer)?.fields!}
            handleSubmit={values => {
              console.log(fulfilledOrder, values)
            }}
        >
            <button type="submit">
                Register
            </button>
        </FormContent>
      )}
    </>
  ) : null;
}

export default App;
