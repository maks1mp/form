import {useCallback, useEffect, useState} from 'react';
import {FieldsGroup} from 'types';

export function useForm() {
  const [formData, setFormData] = useState<FieldsGroup[] | null>();
  const [error, setError] = useState<Error | null>()
  const [loading, setLoading] = useState<boolean>(false)
  const searchParams = new URLSearchParams(document.location.search.substring(1));
  const formFile = `form${searchParams.get('step') ?? 2}.json`;

  const fetchFormData = useCallback(async () => {
    setLoading(true)

    try {
      const response = await fetch(formFile);

      const data = await response.json();

      setFormData(data);
      setError(null);
    } catch (e) {
      setFormData(null);
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [formFile])

  useEffect(() => {
    fetchFormData()
  }, [fetchFormData])

  return {
    formData,
    error,
    loading,
  }
}
