import { useState, useEffect } from 'react';
import { getSource } from './sources';
import { CAMEOCode } from './GDELTTypes';

const source = getSource('scalatra');

const useCodes = (cameoType: string) => {
  const [codes, setCodes] = useState<CAMEOCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const loadCodes = async () => {
      try {
        setLoading(true);
        const codeData = await source.fetchCodes(cameoType);
        setCodes(codeData);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    loadCodes();
  }, [cameoType]);

  return { codes, loading, error };
};

export default useCodes;
