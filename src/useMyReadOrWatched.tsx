import useReadOrWatchedWorks from '@/src/hooks/useReadOrWatchedWorks';
import { UserMosaicItem } from './types/user';
import useUser from './useUser';

type Item = UserMosaicItem

const useMyReadOrWatched = (id: number) => {
  const { data: user } = useUser(id || 0, { enabled: !!id });
  if (!user) return {
    userName: null,
    image:null,
    photos:null,
    readOrWatchedWorks: [],
  }
  const{data:readOrWatchedWorks}=useReadOrWatchedWorks(user?.id!)
  const row = {
    userName: user.name,
    image: user.image,
    photos: user.photos,
    readOrWatchedWorks,
  };
  return row;
};

export default useMyReadOrWatched;
