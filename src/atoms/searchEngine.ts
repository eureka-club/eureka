import { atom } from 'jotai';
// import { SearchResult } from '../types';
import { CycleDetail } from '../types/cycle';
import { PostDetail } from '../types/post';
import { WorkDetail } from '../types/work';
import { UserDetail } from '../types/user';
import {SearchResult} from "@/src/types"
/* 
type Item =
  | (CycleDetail & { type: string })
  | WorkDetail
  | (PostDetail & { type: string })
  | UserDetail; */
type Filter = {
  only: string[];
  countryQuery?: string[];
  onlyByCountries: string[];
  itemsFound?: SearchResult[];
  q?: string;
  where?: string;
  show?: boolean;
  cacheKey?: string[];
  // searchMosaicData?: ((CycleDetail & { type: string }) | WorkDetail)[];
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
