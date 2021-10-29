import {useCallback, useEffect, useState} from 'react';
import {FieldsGroup} from 'types';

export function useForm() {
  const [formData, setFormData] = useState<FieldsGroup[] | null>();
  const [error, setError] = useState<Error | null>()
  const [loading, setLoading] = useState<boolean>(false)

  const fetchFormData = useCallback(async () => {
    setLoading(true)

    try {
      const response = await fetch('form.json');

      const data = await response.json();

      setFormData(data);
      setError(null);
    } catch (e) {
      setFormData(null);
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    fetchFormData()
  }, [fetchFormData])

  return {
    formData,
    error,
    loading,
  }
}
