import { UserDetail } from './types/user';
import useUser from './useUser';

type Item = UserDetail

const useMyReadOrWatched = (id: number) => {
  const { data: user } = useUser(id || 0, { enabled: !!id });
  if (!user) return {
    userName: null,
    image:null,
    photos:null,
    readOrWatchedWorks: [],
  }
  const row = {
    userName: user.name,
    image: user.image,
    photos: user.photos,
    readOrWatchedWorks: user.readOrWatchedWorks,
  };
  return row;
};

export default useMyReadOrWatched;
