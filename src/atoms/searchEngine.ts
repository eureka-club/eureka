import { atom } from 'jotai';

// workBook: false,
// workFilm: false,
// cycle: false,
// post: false,
type Filter = {
  only: string[];
};
const o: Filter = {
  only: [],
};
export default atom(o);
