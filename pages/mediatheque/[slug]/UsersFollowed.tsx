import CarouselStatic from '@/src/components/CarouselStatic';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { UserMosaicItem, UserSumary } from "@/src/types/user";
import { FC } from 'react';

interface Props{
    user:UserMosaicItem;
    goTo:(path:string)=>void;
    t:(val:string)=>string;
}
const UsersFollowed:FC<Props> = ({user,goTo,t}) => {
    if (user && user.following && user.following.length) {
      return (
        <div data-cy="my-users-followed">
          <CarouselStatic
            cacheKey={['MEDIATHEQUE-FOLLOWING',`USER-${user.id}`]}
            onSeeAll={()=>goTo('my-users-followed')}
            title={`${t('common:myUsersFollowed')}  `}
            data={user!.following as UserSumary[]}
            iconBefore={<HiOutlineUserGroup />}
          />

        </div>
      );
    }
    return <></>;
  };
  export default UsersFollowed;