import useFeaturedUsers from '@/src/hooks/useFeaturedUsers';
import { useState } from 'react';
import MosaicItemUser from '@/components/user/MosaicItem';
//import CarouselStatic from '../CarouselStatic';
import { BsChevronUp, BsChevronDown } from 'react-icons/bs';
import { useDictContext } from '@/src/hooks/useDictContext';
import { t } from '@/src/get-dictionary';

const FeaturedUsers = () => {
  //const { t } = useTranslation('common');
  const { dict} = useDictContext();

  const {data:users} =   useFeaturedUsers();

  const [showUsersSection, setShowUsersSection] = useState<boolean>(true)

  if (users && users.length) {
    return (
      <section className="d-flex flex-column ">
        <h2 className="d-flex flex-row align-items-center text-secondary  fw-bold">
          <span>{t(dict,'Featured users')}{' '}</span>
          {!showUsersSection && (
            <span
              className={`cursor-pointer d-flex d-lg-none ms-2`}
              role="presentation"
              onClick={() => setShowUsersSection(true)}
            >
              <BsChevronDown style={{ color: 'var(--color-secondary)' }} />
            </span>
          )}
          {showUsersSection && (
            <span
              className={`cursor-pointer d-flex d-lg-none ms-2`}
              role="presentation"
              onClick={() => setShowUsersSection(false)}
            >
              <BsChevronUp style={{ color: 'var(--color-secondary)' }} />
            </span>
          )}
        </h2>

        {showUsersSection && (
          <div className='d-flex d-lg-none flex-column'>
            {users.map((user) => (
              <div key={user.id} className="d-flex justify-content-center justify-content-lg-start">
                <MosaicItemUser user={user} />
              </div>
            ))}
          </div>
        )}
        <div className='d-none d-lg-flex flex-column'>
          {users.map((user) => (
            <div key={user.id} className="d-flex justify-content-center justify-content-lg-start">
              <MosaicItemUser user={user} />
            </div>
          ))}
        </div>



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
