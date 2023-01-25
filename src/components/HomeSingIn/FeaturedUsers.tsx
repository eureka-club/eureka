
import useFeaturedUsers from '@/src/useFeaturedUsers';
import CarouselStatic from "../CarouselStatic";
import useTranslation from 'next-translate/useTranslation';

const FeaturedUsers = () => {
  const {data:users} = useFeaturedUsers()
  const { t } = useTranslation('common');

    return (users && users.length) 
    ? <div>      
       <CarouselStatic
        cacheKey={['USERS','FEATURED']}
        //onSeeAll={()=>router.push('/featured-users')}
        seeAll={false}
        data={users}
        title={t('Featured users')}
        userMosaicDetailed = {true}
      />
      </div>
    : <></>;
  };
  export default FeaturedUsers;