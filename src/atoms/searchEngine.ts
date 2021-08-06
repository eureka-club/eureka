import { atom } from 'jotai';
import { SearchResult } from '../types';
import { CycleMosaicItem } from '../types/cycle';
import { PostMosaicItem } from '../types/post';
import { WorkMosaicItem } from '../types/work';
import { UserMosaicItem } from '../types/user';

type Item =
  | (CycleMosaicItem & { type: string })
  | WorkMosaicItem
  | (PostMosaicItem & { type: string })
  | UserMosaicItem;
type Filter = {
  only: string[];
  countryQuery?: string[];
  onlyByCountries: string[];
  itemsFound?: Item[];
  q?: string;
  where?: string;
  show?: boolean;
  // searchMosaicData?: ((CycleMosaicItem & { type: string }) | WorkMosaicItem)[];
};
const o: Filter = {
  only: [],
  onlyByCountries: [],
  itemsFound: [],
  q: '',
  where: '',
  countryQuery: [],
  show: true,
};

export default atom(o);
