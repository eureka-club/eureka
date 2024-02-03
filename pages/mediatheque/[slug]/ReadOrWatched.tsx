import CarouselStatic from '@/src/components/CarouselStatic';
import { UserMosaicItem } from "@/src/types/user";
import { WorkDetail } from "@/src/types/work";
import { BsEye } from 'react-icons/bs';
import { FC } from "react";

interface Props{
    user:UserMosaicItem;
    id:string;
    goTo:(path:string)=>void;
    t:(val:string)=>string;
}
const ReadOrWatched:FC<Props> = ({user,id,goTo,t}) => {
    if (user && user.ratingWorks && user.ratingWorks.length) {
      const RW = user.ratingWorks.filter(rw=>rw.work).map((w) => w.work as WorkDetail).reverse().slice(0,6);
      /*RW.sort((f, s) => {
          const fCD = dayjs(f.createdAt);
          const sCD = dayjs(s.createdAt);
          if (fCD.isAfter(sCD)) return -1;
          if (fCD.isSame(sCD)) return 0;
          return -1;
        });*/
     
      return (
        <div data-cy="my-books-movies">
          <CarouselStatic
            cacheKey={['MEDIATHEQUE-WATCHED',`USER-${user.id}`]}
            onSeeAll={()=>goTo('my-books-movies')}
            title={t(`common:myBooksMovies`)}
            data={RW}
            iconBefore={<BsEye />}
            // iconAfter={<BsCircleFill className={styles.infoCircle} />}
          />
        </div>
      );
    }
    return <></>;
  };
  export default ReadOrWatched;