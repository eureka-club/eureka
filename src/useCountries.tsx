import { useQuery } from 'react-query';
import { buildUrl } from 'build-url-ts';

const getCountries = async (q?: string[]):Promise<string[]> => {
  const url = buildUrl(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/api`, {
    path: 'taxonomy/countries',
    queryParams: {
      q,
    }
  });
  
  const res = await fetch(url);
  const { result = [] } = await res.json();
  const codes = result.map((i: { code: string }) => i.code);
  return codes;
};

const useCountries = (countryQuery?:string[]) => {
  const q = countryQuery ? countryQuery : undefined;
  return useQuery<string[]>(['COUNTRIES', JSON.stringify(q)], () => getCountries(q), {
    staleTime: 1000 * 60 * 60,
  });
};

export default useCountries;
