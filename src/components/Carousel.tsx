// import classNames from 'classnames';
// import { useAtom } from 'jotai';
// import { useQuery } from 'react-query';
// import { useSession } from 'next-auth/client';
import Link from 'next/link';
// import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import Masonry from 'react-masonry-css';
import classNames from 'classnames';
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

type Props = {
  // page: number;
  // setPage: (page: number) => void;
  // items: (WorkWithImages | CycleWithImages)[];
  topic: string;
  topicLabel?: string;
};

const renderMosaicItem = (
  item: MosaicItem,
  postsParent: Cycle | Work | undefined,
  topic = '',
  page = '',
  showSocialInteraction = true,
) => {
  if (isCycleMosaicItem(item)) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (
      <MosaicItemCycle
        detailed
        showShare={false}
        showButtonLabels={false}
        key={`cycle-${item.id}`}
        cycle={item as CycleMosaicItem}
        cacheKey={topic && page ? ['ITEMS', `${topic}${page}`] : undefined}
        showSocialInteraction={showSocialInteraction}
      />
    );
  }
  if (isPostMosaicItem(item) || item.type === 'post') {
    return <MosaicItemPost key={`post-${item.id}`} post={item as PostMosaicItem} postParent={postsParent} />;
  }
  if (isWorkMosaicItem(item)) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (
      <MosaicItemWork
        showSocialInteraction
        showShare={false}
        showButtonLabels={false}
        key={`work-${item.id}`}
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

const Carousel: FunctionComponent<Props> = ({ topic, topicLabel }) => {
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
    // debugger;
    // console.log(data);
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
      const mosaics = items.data.map((i: CycleMosaicItem | WorkMosaicItem) =>
        renderMosaicItem(i, undefined, topic, page.toString()),
      );
      const res = (
        <Masonry
          // key={`${topic}${item.id}`}
          key={`${topic}${page}`}
          breakpointCols={{
            default: 4,
            1199: 3,
            768: 2,
            576: 1,
          }}
          className={classNames('d-flex', styles.masonry)}
          columnClassName={styles.masonryColumn}
        >
          {mosaics}
        </Masonry>
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

  const onItemsFound = async () => {
    const where = encodeURIComponent(
      JSON.stringify({
        ...(topic !== 'uncategorized' && { topics: { contains: topic } }),
        ...(topic === 'uncategorized' && {
          OR: [{ topics: { equals: null } }, { topics: { equals: '' } }],
        }),
      }),
    );
    setGlobalSearchEngineState({
      ...globalSearchEngineState,
      where,
      q: topic,
      show: true,
      itemsFound: [],
      cacheKey: ['ITEMS', `${topic}`],
    });
    router.push('/search');
  };

  return (
    (!isLoading && items && items.data && items.data.length && (
      <>
        {items && items.data && items.data.length && (
          <div className={styles.mainContainer}>
            <Row>
              <Col>
                <h5 className={styles.carouselTitle}>
                  <span className={styles.iconBefore}>
                    <BsHash />
                  </span>
                  {` `} {topicLabel || t(`${topic}`)}
                </h5>
              </Col>
              <Col className={styles.right}>
                {/* {data.hasMore && ( */}
                <Link href="/search">
                  <Button className={styles.seeAllButton} onClick={onItemsFound}>
                    {t('common:See all')}
                  </Button>
                </Link>
                {/* )} */}
              </Col>
            </Row>
            <div>
              {buildMosaics()}
              {page !== 0 && (
                <Button
                  className={styles.leftButton}
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
              {data.hasMore && (
                <Button
                  className={styles.rightButton}
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
          </div>
        )}
      </>
    )) ||
    null
  );
};

export default Carousel;
