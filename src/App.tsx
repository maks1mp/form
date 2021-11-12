import React, {useCallback, useEffect, useState} from 'react';
import {useForm} from 'form/hooks/useForm';
import {FormValues, Sections} from './types';
import FlowMultiple from 'modules/FlowMultiple';
import FlowSingle from 'modules/FlowSingle';
import ReactModal from 'react-modal';

async function onSubmit(data: FormValues, products?: FormValues[]): Promise<{
  success: true;
  registeredBefore: true;
  redirect: false;
  error?: string;
}> {
  const payload: Record<string, any> = {
    customer: {},
    sendEmails: true,
    items: [],
  };

  function getBase64(file: File) {
    return new Promise((resolve, reject) => {

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        reject(error)
      };
    })
  }

  const mapProduct = async ({
      productName: product,
      serialNumber: serialNumbers,
      state,
      ...restProps
    }: Record<string, any>) => {
    const {image, ...restProduct} = product;

    const fileKeys = Object.keys(restProps).filter(p => !!restProps[p] && !!restProps[p].name);
    const files = await Promise.all(fileKeys.map(k => getBase64(restProps[k])));

    return {
      ...restProps,
      product: {
        imageUrl: image?.src,
        ...restProduct,
      },
      serialNumbers,
      purchaseDate: new Date().toISOString(),
      ...fileKeys.reduce((acc, next, index) => {
        acc[next] = files[index]
        return acc;
      }, {} as Record<string, any>)
    }
  }

  const mapUserData = ({state, ...restData}: Record<string, any>) => {
    return {
      ...restData,
      state: typeof state === 'object' ? state.label : state,
    }
  }

  if (!products) {
    const userData = [
      'name', 'firstName', 'surname', 'dob', 'email', 'address1', 'address2',
      'city', 'country', 'state', 'postCode', 'phone'
    ].reduce((acc: Record<string, any>, key) => {
      acc[key] = data[key]

      delete data[key];

      return acc;
    }, {})

    payload.customer = mapUserData(userData)
    payload.items = [await mapProduct(data)]
  } else {
    payload.customer = mapUserData(data);
    payload.items = await Promise.all(products.map(mapProduct))
  }

  return fetch('https://ensdmrncariaqkb.m.pipedream.net', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
}

const App: React.FC = () => {
  const {formData, loading, error} = useForm();
  const [modal, setModal] = useState(false);
  const [redirect, setRedirect] = useState<string | null>(null)
  const [postError, setPostError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (redirect) {
      setTimeout(() => {
        window.location.href = redirect
      }, 5000)
    }
  }, [redirect])

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [modal]);

  const submit = useCallback(async (data: FormValues, products?: FormValues[]) => {
    setSubmitting(true)

    try {
      const response = await onSubmit(data, products)

      if (response.success) {
        setModal(true)

        if (response.redirect) {
          setRedirect(response.redirect)
        }

        return;
      }

      if (response.error) {
        setPostError(response.error)
      }
    } catch (e) {
      console.log(e)
      setModal(true)
    } finally {
      setSubmitting(false)
    }
  }, [])

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

  const content = formData ? (
    formData.some(v => v.name === Sections.all)
      ? <FlowSingle formData={formData} onSubmit={submit}/>
      : <FlowMultiple formData={formData} onSubmit={submit}/>
  ) : null;

  return (
    <>
      {content}
      {postError && <h3 style={{color: 'red'}}>{postError}</h3>}
      {submitting && <h3>Loading...</h3>}
      <ReactModal
        isOpen={modal}
      >
        <h1>Thanks, registration finished!</h1>
        <button onClick={() => {
          if (redirect) {
            window.location.href = redirect
          } else {
            setModal(false)
          }
        }}>Ok
        </button>
      </ReactModal>
    </>
  )
}

export default App;
