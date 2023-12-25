import { atom } from 'jotai';
import {SearchResult} from "@/src/types"

type Filter = {
  only: string[];
  countryQuery?: string[];
  onlyByCountries: string[];
  itemsFound?: SearchResult[];
  q?: string;
  where?: string;
  show?: boolean;
  cacheKey?: string[];
};
const o: Filter = {
  only: [],
  onlyByCountries: [],
  itemsFound: [],
  q: '',
  where: '',
  countryQuery: [],
  show: true,
  cacheKey: undefined,
};

export default atom(o);
