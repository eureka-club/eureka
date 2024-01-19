import { atom } from 'jotai';
// import { SearchResult } from '../types';
import { CycleDetail } from '../types/cycle';
import { PostMosaicItem } from '../types/post';
import { WorkMosaicItem } from '../types/work';
import { UserMosaicItem } from '../types/user';
import {SearchResult} from "@/src/types"
/* 
type Item =
  | (CycleDetail & { type: string })
  | WorkMosaicItem
  | (PostMosaicItem & { type: string })
  | UserMosaicItem; */
type Filter = {
  only: string[];
  countryQuery?: string[];
  onlyByCountries: string[];
  itemsFound?: SearchResult[];
  q?: string;
  where?: string;
  show?: boolean;
  cacheKey?: string[];
  // searchMosaicData?: ((CycleDetail & { type: string }) | WorkMosaicItem)[];
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
