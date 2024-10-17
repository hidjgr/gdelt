import { useState, useEffect } from 'react';
import { getSource } from './sources';
import { CAMEOCode } from './GDELTTypes';

const source = getSource('scalatra');

const useCodes = (cameoType: string[]) => {
    const [codes, setCodes] = useState<{ [key: string]: { [key: string]: string } }>({});
    const [loadingCodes, setLoadingCodes] = useState(true);
    const [errorCodes, setErrorCodes] = useState<unknown>(null);

    useEffect(() => {
        const loadCodes = async () => {
            try {
                setLoadingCodes(true);

                const newCodeObj: { [key: string]: { [key: string]: string } } = {};

                await Promise.all(
                    cameoType.map(async (type: string) => {
                        const codeData: CAMEOCode[] = await source.fetchCodes(type);
                        newCodeObj[type] = codeData.reduce((accumulator, current) => {
                            accumulator[current.code] = current.label;
                            return accumulator;
                        }, {} as { [key: string]: string }); // Specify the type for the accumulator
                    })
                );

                setCodes(newCodeObj);

            } catch (e) {
                setErrorCodes(e);
            } finally {
                setLoadingCodes(false);
            }
        };

        loadCodes();
    }, [cameoType]);

    return { codes, loadingCodes, errorCodes };
};



export default useCodes;
