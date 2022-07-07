import dayjs from 'dayjs';
import { CycleMosaicItem } from './types/cycle';
import { PostMosaicItem } from './types/post';
import { WorkMosaicItem } from './types/work';
import useUser from './useUser';

type Item = CycleMosaicItem | WorkMosaicItem | PostMosaicItem;

const useMySaved = (id:number) => {
  const {data:user} = useUser(id||0,{enabled:!!id});
  if(!user)return []
  const SFL: Item[] = [];
  if (user && user.favWorks && user.favWorks.length) {
    const w1 = user.favWorks as Item[];
    SFL.push(...w1);
  }
  if (user && user.favCycles && user.favCycles.length) {
    const c1 = user.favCycles.map((c) => ({ ...c, type: 'cycle' })) as Item[];
    SFL.push(...c1);
  }
  if (user && user.favPosts && user.favPosts.length) {
    const p1 = user.favPosts.map((p) => ({ ...p, type: 'post' })) as Item[];
    SFL.push(...p1);
  }
  SFL.sort((f: Item, s: Item) => {
    const fCD = dayjs(f.createdAt);
    const sCD = dayjs(s.createdAt);
    if (fCD.isAfter(sCD)) return -1;
    if (fCD.isSame(sCD)) return 0;
    return 1;
  });
  return SFL;
};

export default useMySaved;
