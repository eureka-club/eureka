import { CycleMosaicItem } from './types/cycle';
import { PostMosaicItem } from './types/post';
import { WorkMosaicItem } from './types/work';
import useUser from './useUser';

type Item = CycleMosaicItem | WorkMosaicItem | PostMosaicItem;

const useMySaved = (id:number) => {
  const {data:user} = useUser(id||0,{enabled:!!id});
  if(!user)return {
    favCycles:[],
    favPosts:[],
    favWorks:[]
  }
  const SFL={
    favCycles:user.favCycles.map((c) => ({ ...c, type: 'cycle' })),
    favPosts:user.favPosts.map((p) => ({ ...p, type: 'post' })),
    favWorks:user.favWorks
  };

  
  
  return SFL;
};

export default useMySaved;
