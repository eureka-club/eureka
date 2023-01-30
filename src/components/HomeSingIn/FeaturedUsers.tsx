import useFeaturedUsers from '@/src/useFeaturedUsers';
import { UserMosaicItem } from '../../types/user';
import MosaicItemUser from '@/components/user/MosaicItem';
import CarouselStatic from '../CarouselStatic';
import useTranslation from 'next-translate/useTranslation';

const FeaturedUsers = () => {
  const { data: users } = useFeaturedUsers();
  const { t } = useTranslation('common');

  if (users && users.length) {
    return (
      <section className="d-flex flex-column justify-content-center align-items-center">
        <h2 className="text-secondary fw-bold">{t('Featured users')}</h2>
        {users.map((user) => (
          <div key={user.id}>
            <MosaicItemUser user={user} />
          </div>
        ))}
      </section>
    );
  } else return <></>;

  /*return (users && users.length) 
    ? <div>      
       {<CarouselStatic
        cacheKey={['USERS','FEATURED']}
        //onSeeAll={()=>router.push('/featured-users')}
        seeAll={false}
        data={users}
        title={t('Featured users')}
        userMosaicDetailed = {true}
      />}
      </div>
    : <></>;*/
};
export default FeaturedUsers;
