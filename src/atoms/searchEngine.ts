import { atom } from 'jotai';
// import { SearchResult } from '../types';
import { CycleMosaicItem } from '../types/cycle';
import { PostMosaicItem } from '../types/post';
import { WorkDetail } from '../types/work';
import { UserMosaicItem } from '../types/user';
import {SearchResult} from "@/src/types"
/* 
type Item =
  | (CycleMosaicItem & { type: string })
  | WorkDetail
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
  // searchMosaicData?: ((CycleMosaicItem & { type: string }) | WorkDetail)[];
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
