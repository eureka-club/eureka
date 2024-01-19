import { getUsers } from '../actions/user/getUsers';
import useUsers from './useUsers';
import useBackOffice from '@/src/hooks/useBackOffice';

const featuredUsersWhere = (ids:number[]) => ({
  where:{
    id: { in: ids },
  }
}) 

export const getFeaturedUsers = async (ids:number[],take:number=8)=>{
  return getUsers({...featuredUsersWhere(ids),take});
}

const useFeaturedUsers = () => {
  const {data:bo} = useBackOffice();
  let usersIds:number[] = [];
  if(bo && bo.FeaturedUsers)
    bo.FeaturedUsers.split(',').forEach(x=> usersIds.push(parseInt(x)));
      
  return useUsers(featuredUsersWhere(usersIds),
    {enabled:!!usersIds}
  )
};

export default useFeaturedUsers;
