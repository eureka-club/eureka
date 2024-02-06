import { useQuery } from 'react-query';
import { buildUrl } from 'build-url-ts';
import { Country } from './types';


const getCountries = async (q?: string[]):Promise<Country[]> => {
  const url = buildUrl(`/api`, {
    path: 'taxonomy/countries',
    queryParams: {
      q,
    }
  });
  
  const res = await fetch(url!);
  const { result = [] } = await res.json();
  return result
  // const codes = result.map((i: { code: string }) => i.code);
  // return codes;
};

const useCountries = (countryQuery?:string[]) => {
  const q = countryQuery ? countryQuery : undefined;
  return useQuery<Country[]>(['COUNTRIES', JSON.stringify(q)], () => getCountries(q), {
    staleTime: 1000 * 60 * 60,
  });
};

export default useCountries;
