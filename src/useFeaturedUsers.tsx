import useTranslation from 'next-translate/useTranslation';
import useUsers,{getUsers} from './useUsers';
import useBackOffice from '@/src/useBackOffice';

const featuredUsersWhere = (ids:number[]) => ({
  where:{
    id: { in: ids },
  }
}) 

export const getFeaturedUsers = async (ids:number[],take:number=8)=>{
  return getUsers({...featuredUsersWhere(ids),take});
}

const useFeaturedUsers = () => {
  const{lang}=useTranslation();
  const {data:bo} = useBackOffice(undefined,lang);
  let usersIds:number[] = [];
  if(bo && bo.FeaturedUsers)
    bo.FeaturedUsers.split(',').forEach(x=> usersIds.push(parseInt(x)));
      
  return useUsers(featuredUsersWhere(usersIds),
    {enabled:!!usersIds,cacheKey:['featured-users']}
  )
};

export default useFeaturedUsers;
