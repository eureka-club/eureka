import { atom } from 'jotai';
import { SearchResult } from '../types';
import { CycleMosaicItem } from '../types/cycle';
import { PostMosaicItem } from '../types/post';
import { WorkMosaicItem } from '../types/work';

type Item = (CycleMosaicItem & { type: string }) | WorkMosaicItem | (PostMosaicItem & { type: string });
type Filter = {
  only: string[];
  countryQuery?: string[];
  onlyByCountries: string[];
  itemsFound?: Item[];
  q?: string;
  where?: string;
  // searchMosaicData?: ((CycleMosaicItem & { type: string }) | WorkMosaicItem)[];
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
