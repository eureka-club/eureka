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
import { useInfiniteQuery, useQuery } from 'react-query';
import { FunctionComponent, ChangeEvent, useState, useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import router from 'next/router';
import globalSearchEngineAtom from '../atoms/searchEngine';
import { MosaicItem, isCycleMosaicItem, isWorkMosaicItem, isPostMosaicItem } from '../types';
import MosaicItemCycle from './cycle/MosaicItem';
import MosaicItemPost from './post/MosaicItem';
import MosaicItemWork from './work/MosaicItem';
import styles from './Carousel.module.css';
// import { setCookie } from 'nookies';
// import { Work, Cycle, PrismaPromise } from '@prisma/client';
import { WorkMosaicItem, WorkWithImages } from '../types/work';
import { CycleMosaicItem, CycleWithImages } from '../types/cycle';

type Props = {
  // page: number;
  // setPage: (page: number) => void;
  // items: (WorkWithImages | CycleWithImages)[];
  topic: string;
  topicLabel?: string;
};

const renderMosaicItem = (item: MosaicItem, postsParent: Cycle | Work | undefined) => {
  if (isCycleMosaicItem(item)) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <MosaicItemCycle key={`cycle-${item.id}`} {...item} />;
  }
  if (isPostMosaicItem(item)) {
    return <MosaicItemPost key={`post-${item.id}`} post={item} postParent={postsParent} />;
  }
  if (isWorkMosaicItem(item)) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <MosaicItemWork key={`work-${item.id}`} {...item} />;
  }

  return '';
};

interface ItemType {
  data: [];
  nextCursor: number;
  prevCursor: number;
  status: string;
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

  const [extraCyclesRequired, setExtraCyclesRequired] = useState(null);
  const [extraWorksRequired, setExtraWorksRequired] = useState(null);
  const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);

  const fetchItems = async (pageParam: number) => {
    const q = await fetch(`/api/getAllBy?topic=${topic}&cursor=${pageParam}
    ${extraCyclesRequired && `&extraCyclesRequired=${extraCyclesRequired}`}
    ${extraWorksRequired && `&extraWorksRequired=${extraWorksRequired}`}
    `);
    const res = await q.json();
    // debugger;
    return res;
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

  const { isLoading, isError, error, data, isFetching, isPreviousData } = useQuery(
    ['items', `${topic}${page}`],
    () => fetchItems(page),
    { keepPreviousData: true },
  );

  useEffect(() => {
    // debugger;
    console.log(data);
    if (data) {
      setItems(data);
      if (data.extraCyclesRequired) setExtraCyclesRequired(data.extraCyclesRequired);
      if (data.extraWorksRequired) setExtraWorksRequired(data.extraWorksRequired);
    }
  }, [data, page]);

  const build = () => {
    const result: JSX.Element[] = [];
    if (items) {
      // debugger;
      // data.pages.forEach((page, idx) => {
      const mosaics = items.data.map((i: (CycleMosaicItem & { type: string }) | WorkMosaicItem) =>
        renderMosaicItem(i, undefined),
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

  const onItemsFound = async () => {
    const where = encodeURIComponent(
      JSON.stringify({
        ...(topic !== 'uncategorized' && { topics: { contains: topic } }),
        ...(topic === 'uncategorized' && {
          OR: [{ topics: { equals: null } }, { topics: { equals: '' } }],
        }),
      }),
    );
    setGlobalSearchEngineState({ ...globalSearchEngineState, where, q: topic });
    router.push('/search');
  };

  return (
    (items && items.data && items.data.length && (
      <>
        {items && items.data && items.data.length && (
          <div className={styles.mainContainer}>
            <Row>
              <Col>
                <h5>
                  # {` `} {topicLabel || t(`${topic}`)}
                </h5>
              </Col>
              <Col className={styles.right}>
                <Link href="/search">
                  <Button onClick={onItemsFound}>{t('common:See all')}</Button>
                </Link>
              </Col>
            </Row>
            <div>
              {build()}
              <Button
                className={styles.leftButton}
                onClick={() => {
                  setPage((old) => Math.max(old - 1, 0));
                  setExtraCyclesRequired(null);
                  setExtraWorksRequired(null);
                }}
                disabled={page === 0}
              >{`<`}</Button>
              <Button
                className={styles.rightButton}
                onClick={(ev) => {
                  if (!isPreviousData && data.hasMore) {
                    setPage((old) => old + 1);
                  }
                }}
                disabled={isPreviousData || !data?.hasMore}
              >{`>`}</Button>
            </div>
          </div>
        )}
      </>
    )) || <>&nbsp;</>
  );
};

export default Carousel;
