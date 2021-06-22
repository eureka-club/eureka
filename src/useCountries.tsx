import { useQuery } from 'react-query';
import { useAtom } from 'jotai';

// import { CycleMosaicItem } from './types/cycle';
// import { WorkMosaicItem } from './types/work';
// import { PostMosaicItem } from './types/post';
import globalSearchEngineAtom from './atoms/searchEngine';

const fetchCountries = async (q?: string[]) => {
  if (!q!.length) return null;
  const res = await fetch(`/api/taxonomy/countries${q ? `?q=${q.join()}` : ''}`);
  const { result = [] } = await res.json();
  const codes = result.map((i: { code: string }) => i.code);
  return codes;
};

const useCountries = () => {
  const [globalSearchEngineState] = useAtom(globalSearchEngineAtom);
  const q = globalSearchEngineState.countryQuery;
  return useQuery(['COUNTRIES', q!.join()], () => fetchCountries(q), {
    staleTime: 1000 * 60 * 60,
  });
};

export default useCountries;
