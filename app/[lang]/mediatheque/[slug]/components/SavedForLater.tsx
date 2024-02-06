import CarouselStatic from '@/src/components/CarouselStatic';
import { CycleDetail } from "@/src/types/cycle";
import { PostDetail } from "@/src/types/post";
import { WorkDetail } from "@/src/types/work";
import { BsBookmark } from 'react-icons/bs';
import { useDictContext } from '@/src/hooks/useDictContext';
import dayjs from 'dayjs';
import { FC } from 'react';
import { useParams } from 'next/navigation';
import getUserIdFromSlug from '@/src/getUserIdFromSlug';
import useFavCycles from '@/src/hooks/useFavCycles';
import useFavPosts from '@/src/hooks/useFavPosts';
import useFavWorks from '@/src/hooks/useFavWorks';

interface Props{
    goTo:(path:string)=>void;
}
const SavedForLater:FC<Props> = ({goTo}) => {
  const {slug,lang}=useParams<{slug:string,lang:string}>()!;
  const id = +getUserIdFromSlug(slug);

  const {data:favPosts} = useFavPosts(id!);
  const {data:favCycles} = useFavCycles(id!);
  const {data:favWorks} = useFavWorks(id!);

  const { t, dict } = useDictContext();

  const items = [...favPosts??[],...favCycles??[],...favWorks??[]] as PostDetail[]|CycleDetail[]|WorkDetail[];
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