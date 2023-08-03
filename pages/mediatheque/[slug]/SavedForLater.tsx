import CarouselStatic from '@/src/components/CarouselStatic';
import { CycleMosaicItem } from "@/src/types/cycle";
import { PostMosaicItem } from "@/src/types/post";
import { UserMosaicItem } from '@/src/types/user';
import { WorkMosaicItem } from "@/src/types/work";
import { BsBookmark } from 'react-icons/bs';
import useMySaved from '@/src/useMySaved';

import dayjs from 'dayjs';
import { FC } from 'react';
import { useSession } from 'next-auth/react';

interface Props{
    id:number;
    user:UserMosaicItem;
    goTo:(path:string)=>void;
    t:(val:string)=>string;
    
}
const SavedForLater:FC<Props> = ({user,id,goTo,t}) => {
  const SFL = useMySaved(id)

  const {data:session} = useSession();

    if (SFL){
      const items = [...SFL.favPosts,...SFL.favCycles,...SFL.favWorks] as PostMosaicItem[]|CycleMosaicItem[]|WorkMosaicItem[];
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