import useFavCycles from './hooks/useFavCycles';
import useFavPosts from './hooks/useFavPosts';
import useFavWorks from './hooks/useFavWorks';
import { CycleDetail } from './types/cycle';
import { PostDetail } from './types/post';
import { WorkDetail } from './types/work';
import useUser from './useUser';

type Item = CycleDetail | WorkDetail | PostDetail;

const useMySaved = (id:number) => {
  const{data:favCycles}=useFavCycles(id);
  const{data:favPosts}=useFavPosts(id);
  const{data:favWorks}=useFavWorks(id);

  const SFL={
    favCycles:favCycles?.map((c) => ({ ...c, type: 'cycle' })),
    favPosts:favPosts?.map((p) => ({ ...p, type: 'post' })),
    favWorks:favWorks
  };
  return SFL;
};

export default useMySaved;
