// import classNames from 'classnames';
// import { useAtom } from 'jotai';
// import { useQuery } from 'react-query';
// import { useSession } from 'next-auth/client';
import Link from 'next/link';
// import { useRouter } from 'next/router';
import { v4 } from 'uuid';
import { useAtom } from 'jotai';
// import Masonry from 'react-masonry-css';
// import classNames from 'classnames';
import { Cycle, Work } from '@prisma/client';
import useTranslation from 'next-translate/useTranslation';
import { /* useInfiniteQuery, */ useQuery } from 'react-query';
import { FunctionComponent /* , ChangeEvent */, useState, useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import router from 'next/router';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { BsHash } from 'react-icons/bs';
import globalSearchEngineAtom from '../atoms/searchEngine';
import { MosaicItem, isCycleMosaicItem, isWorkMosaicItem, isPostMosaicItem } from '../types';
import MosaicItemCycle from './cycle/MosaicItem';
import MosaicItemPost from './post/MosaicItem';
import MosaicItemWork from './work/MosaicItem';
import styles from './Carousel.module.css';
// import { setCookie } from 'nookies';
// import { Work, Cycle, PrismaPromise } from '@prisma/client';
import { WorkMosaicItem /* , WorkWithImages */ } from '../types/work';
import { CycleMosaicItem /* , CycleWithImages */ } from '../types/cycle';
import { PostMosaicItem /* , CycleWithImages */ } from '../types/post';
import { CycleContext } from '../useCycleContext';

type Props = {
  // page: number;
  // setPage: (page: number) => void;
  // items: (WorkWithImages | CycleWithImages)[];
  topic: string;
  topicLabel?: string;
  className?: string;
  
};

const renderMosaicItem = (
  item: MosaicItem,
  
  postsParent?: CycleMosaicItem | WorkMosaicItem,
  topic = '',
  page = '',
  showSocialInteraction = true,
) => {
  if (isCycleMosaicItem(item)) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (
      <CycleContext.Provider key={`cycle-${v4()}`} value={{ cycle: item as CycleMosaicItem }}>
        <MosaicItemCycle
          detailed
          showShare={false}
          showButtonLabels={false}
          cacheKey={topic && page ? ['ITEMS', `${topic}${page}`] : undefined}
          showSocialInteraction={showSocialInteraction}
        />
      </CycleContext.Provider>
    );
  }
  if (isPostMosaicItem(item) || item.type === 'post') {
    return <MosaicItemPost cacheKey={['ITEMS', `${topic}${page}`]} key={`post-${v4()}`} post={item as PostMosaicItem} />;
  }
  if (isWorkMosaicItem(item)) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (
      <MosaicItemWork
        showSocialInteraction
        showShare={false}
        showButtonLabels={false}
        key={`work-${v4()}`}
        work={item}
        cacheKey={topic && page ? ['ITEMS', `${topic}${page}`] : undefined}
      />
    );
  }

  return '';
};

interface ItemType {
  data: [];
  nextCursor: number;
  prevCursor: number;
  status: string;
  delay?: number;
}

const Carousel: FunctionComponent<Props> = ({ topic, topicLabel, className }) => {
  const { t } = useTranslation('topics');
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<ItemType>();
  // const [items, setItems] = useState<((CycleMosaicItem & { type: string }) | WorkMosaicItem)[]>([]);
  // const [i, setI] = useState<((CycleMosaicItem & { type: string }) | WorkMosaicItem)[]>([]);

  // const handleSelect = (selectedIndex: number, e: Record<string, unknown> | null) => {
  //   setPage(selectedIndex);
  // };

  const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  const [extraCyclesRequired, setExtraCyclesRequired] = useState(0);
  const [extraWorksRequired, setExtraWorksRequired] = useState(0);
  const [totalWorks, setTotalWorks] = useState(-1);

  const fetchItems = async (pageParam: number) => {
    const url = `/api/getAllBy?topic=${topic}&cursor=${pageParam}
    &extraCyclesRequired=${extraCyclesRequired || 0}
    &extraWorksRequired=${extraWorksRequired || 0}
    &totalWorks=${totalWorks}`;
    const q = await fetch(url);
    // debugger;
    const res = await q.json();
    // debugger;
    return res;
  };
  const { isLoading /* , isError, error, isFetching */, data, isPreviousData } = useQuery(
    ['ITEMS', `${topic}${page}`],
    () => fetchItems(page),
    { keepPreviousData: true },
  );

  useEffect(() => {
    if (data) {
      setGlobalSearchEngineState({
        ...globalSearchEngineState,
        cacheKey: undefined,
      });

      setItems(data);
      if (data.extraCyclesRequired) setExtraCyclesRequired(data.extraCyclesRequired);
      if (data.extraWorksRequired) setExtraWorksRequired(data.extraWorksRequired);
      setTotalWorks(data.totalWorks);
    }
  }, [data, page]);

  const buildMosaics = () => {
    const result: JSX.Element[] = [];
    if (items) {
      // debugger;
      // data.pages.forEach((page, idx) => {
      const mosaics = items.data.map((i: CycleMosaicItem | WorkMosaicItem) => (
        <div key={`${v4()}`} className="mx-2">
          {renderMosaicItem(i,undefined, topic, page.toString())}
        </div>
      ));
      const res = (
        // <Masonry
        //   // key={`${topic}${item.id}`}
        //   key={`${topic}${page}`}
        //   breakpointCols={{
        //     default: 4,
        //     1199: 3,
        //     768: 2,
        //     576: 1,
        //   }}
        //   className={classNames('d-flex', styles.masonry)}
        //   columnClassName={styles.masonryColumn}
        // >
        // <> {mosaics}</>
        <div key={v4()} className="d-flex flex-nowrap w-100 justify-content-xl-left">
          {page !== 0 && (
            <Button
              className={` text-white rounded-circle align-self-center ${styles.leftButton}`}
              onClick={() => {
                setPage((old) => Math.max(old - 1, 0));
                setExtraCyclesRequired(0);
                setExtraWorksRequired(0);
              }}
              disabled={page === 0}
            >
              <RiArrowLeftSLine />
            </Button>
          )}

          {mosaics}
          
          {data.hasMore && (
            <Button
              className={` text-center text-white rounded-circle align-self-center ${styles.rightButton}`}
              onClick={() => {
                if (!isPreviousData && data.hasMore) {
                  setPage((old) => old + 1);
                }
              }}
              disabled={isPreviousData || !data?.hasMore}
            >
              <RiArrowRightSLine />
            </Button>
          )}
        </div>
        // </Masonry>
      );
      result.push(res);
      // });
    }
    return result;
  };

  // const {
  //   status,
  //   data,
  //   isFetching,
  //   isFetchingNextPage,
  //   isFetchingPreviousPage,
  //   fetchNextPage,
  //   fetchPreviousPage,
  //   hasNextPage,
  //   hasPreviousPage,
  // } = useInfiniteQuery(
  //   'projects',
  //   fetchItems,
  //   {
  //     getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  //     getPreviousPageParam: (firstPage, pages) => firstPage.prevCursor,
  //   },
  //   // {initialData:projects}
  // );
  const getWhere = () => {
    const where = encodeURIComponent(
      JSON.stringify({
        ...(topic !== 'uncategorized' && { topics: { contains: topic } }),
        ...(topic === 'uncategorized' && {
          OR: [{ topics: { equals: null } }, { topics: { equals: '' } }],
        }),
      }),
    );
    return where;
  };

  const onItemsFound = async () => {
    /* const where = getWhere();
    setGlobalSearchEngineState({
      ...globalSearchEngineState,
      where,
      q: topic,
      show: true,
      itemsFound: [],
      cacheKey: ['ITEMS', `${topic}`],
    });
    router.push('/search'); */
    setGlobalSearchEngineState((res) => ({...res, itemsFound:[]}));
    router.push(`/search?q=${topic}&fields=topics`);
  };

  return (
    (!isLoading && items && items.data && items.data.length && (
      <section className={`${className}`}>
        {items && items.data && items.data.length && (
          <div className="position-relative">
            <Row>
              <Col xs={8} md={9}>
                <h5>
                <Link href={`/search?q=${topic}&fields=topics`}>
                  <a className="text-dark cursor-pointer">
                  <span className={styles.iconBefore}>
                    <BsHash className="rounded-circle border border-1 border-gray" />
                  </span>
                  {topicLabel || t(`${topic}`)}
          </a>
                </Link>
                </h5>
              </Col>
              <Col xs={4} md={3} className="d-flex justify-content-end">
                {/* {data.hasMore && ( */}
                {/* <Link href={`/search?q=${topic}&fields=topics`}>
                  <a className="cursor-pointer">
                    <span
                      className={`cursor-pointer text-primary ${styles.seeAllButton}`}
                    >
                      {t('common:See all')}
                    </span>

                  </a>
                </Link>  
 */}<Button variant="link" className="text-decoration-none" onClick={onItemsFound}>
   <span
                      className={`cursor-pointer text-primary ${styles.seeAllButton}`}
                    >
                      {t('common:See all')}
                    </span>

 </Button>
                
              </Col>
            </Row>
            <div className="d-flex overflow-auto justify-content-center">{buildMosaics()}</div>
          </div>
        )}
      </section>
    )) ||
    null
  );
};

export default Carousel;
