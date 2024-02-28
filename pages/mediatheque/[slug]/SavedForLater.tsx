import CarouselStatic from '@/src/components/CarouselStatic';
import { CycleDetail } from "@/src/types/cycle";
import { PostDetail } from "@/src/types/post";
import { UserDetail } from '@/src/types/user';
import { WorkDetail } from "@/src/types/work";
import { BsBookmark } from 'react-icons/bs';
import useMySaved from '@/src/useMySaved';

import dayjs from 'dayjs';
import { FC } from 'react';
import { useSession } from 'next-auth/react';
import { MosaicItem } from '@/src/types';

interface Props{
    id:number;
    user:UserDetail;
    goTo:(path:string)=>void;
    t:(val:string)=>string;
    
}
const SavedForLater:FC<Props> = ({user,id,goTo,t}) => {
  const SFL = useMySaved(id)

  const {data:session} = useSession();

    if (SFL){
      const items = [...SFL.favPosts,...SFL.favCycles,...SFL.favWorks] as MosaicItem[];
      items.sort((f, s) => {
        const fCD = dayjs(f.createdAt);
        const sCD = dayjs(s.createdAt);
        if (fCD.isAfter(sCD)) return -1;
        if (fCD.isSame(sCD)) return 0;
        return 1;
      });
      return (
        <div data-cy="my-saved">
          <CarouselStatic
            cacheKey={['MEDIATHEQUE-SAVED',`USER-${user!.id}`]}
            onSeeAll={()=>goTo('my-saved')}
            title={t('common:mySaved')}
            seeAll={items.length>=6}
            data={items.slice(0,6)}
            iconBefore={<BsBookmark />}
            // iconAfter={<BsCircleFill className={styles.infoCircle} />}
          />
        </div>
      );
    }
    return <></>;
  };

  export default SavedForLater