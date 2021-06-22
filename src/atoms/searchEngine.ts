import { atom } from 'jotai';
import { SearchResult } from '../types';

type Filter = {
  only: string[];
  countryQuery?: string[];
  onlyByCountries: string[];
  itemsFound: SearchResult[];
  q?: string;
  where?: string;
};
const o: Filter = {
  only: [],
  onlyByCountries: [],
  itemsFound: [],
  q: '',
  where: '',
  countryQuery: [],
};

export default atom(o);
