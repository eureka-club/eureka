import CarouselStatic from '@/src/components/CarouselStatic';
import { CycleMosaicItem } from "@/src/types/cycle";
import { PostMosaicItem } from "@/src/types/post";
import { UserMosaicItem } from '@/src/types/user';
import { WorkMosaicItem } from "@/src/types/work";
import { BsBookmark } from 'react-icons/bs';
import { useDictContext } from '@/src/hooks/useDictContext';
import { t } from '@/src/get-dictionary';
import dayjs from 'dayjs';
import { FC } from 'react';
import useFavPosts from '../hooks/useFavPosts';
import { useParams } from 'next/navigation';
import getUserIdFromSlug from '@/src/getUserIdFromSlug';
import useFavCycles from '../hooks/useFavCycles';
import useFavWorks from '../hooks/useFavWorks';

interface Props{
    goTo:(path:string)=>void;
}
const SavedForLater:FC<Props> = ({goTo}) => {
  const {slug,lang}=useParams<{slug:string,lang:string}>();
  const id = +getUserIdFromSlug(slug);

  const {data:favPosts} = useFavPosts(id!);
  const {data:favCycles} = useFavCycles(id!);
  const {data:favWorks} = useFavWorks(id!);
debugger;
  const { dict } = useDictContext();

  const items = [...favPosts??[],...favCycles??[],...favWorks??[]] as PostMosaicItem[]|CycleMosaicItem[]|WorkMosaicItem[];
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
        cacheKey={['MEDIATHEQUE-SAVED',`USER-${id}`]}
        onSeeAll={()=>goTo('my-saved')}
        title={t(dict,'mySaved')}
        data={items.slice(0,6)}
        iconBefore={<BsBookmark />}
        // iconAfter={<BsCircleFill className={styles.infoCircle} />}
      />
    </div>
  );
};

export default SavedForLater