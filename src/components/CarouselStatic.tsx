// import classNames from 'classnames';
// import { useAtom } from 'jotai';
// import { useQuery } from 'react-query';
// import { useSession } from 'next-auth/client';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import Masonry from 'react-masonry-css';
import classNames from 'classnames';
import { Cycle, Work } from '@prisma/client';
import useTranslation from 'next-translate/useTranslation';
// import { /* useInfiniteQuery, */ useQuery } from 'react-query';
import { FunctionComponent /* , ChangeEvent */, useState, useEffect, Fragment } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
// import router from 'next/router';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
// import { BsHash } from 'react-icons/bs';
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
import { PostMosaicItem } from '../types/post';

type Item = (CycleMosaicItem & { type: string }) | WorkMosaicItem | (PostMosaicItem & { type: string });
type Props = {
  // page: number;
  // setPage: (page: number) => void;
  // items: (WorkWithImages | CycleWithImages)[];
  // topic: string;
  // topicLabel?: string;
  title: string;
  iconBefore?: JSX.Element;
  iconAfter?: JSX.Element;
  onSeeAll: () => Promise<void>;
  data: Item[]; // ((CycleMosaicItem & { type: string }) | WorkMosaicItem)[];
};

const renderMosaicItem = (item: MosaicItem, postsParent: Cycle | Work | undefined) => {
  if (isCycleMosaicItem(item)) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <MosaicItemCycle key={`cycle-${item.id}`} {...item} />;
  }
  if (isPostMosaicItem(item) || item.type === 'post') {
    return <MosaicItemPost key={`post-${item.id}`} post={item as PostMosaicItem} postParent={postsParent} />;
  }
  if (isWorkMosaicItem(item)) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <MosaicItemWork key={`work-${item.id}`} work={item} />;
  }

  return '';
};

const Carousel: FunctionComponent<Props> = ({ title, data, iconBefore, iconAfter, onSeeAll }) => {
  const { t } = useTranslation('topics');
  const [current, setCurrent] = useState<Item[]>([]);
  const [show, setShow] = useState<Item[]>([]);
  const [hide, setHide] = useState<Item[]>([]);
  const [dataFiltered, setDataFiltered] = useState<Item[]>([]);

  const [globalSEState] = useAtom(globalSearchEngineAtom);
  useEffect(() => {
    if (data && data.length) {
      const d = [...data];
      setDataFiltered((res) => [...res, ...d]);
      const s = d.slice(0, 4);
      setCurrent(() => [...s]);
      setShow(() => [...d.slice(4, d.length)]);
    }
  }, [data]);

  /* const fetchItems = async (pageParam: number) => {
    const url = `/api/getAllBy?topic=${topic}&cursor=${pageParam}
    &extraCyclesRequired=${extraCyclesRequired || 0}
    &extraWorksRequired=${extraWorksRequired || 0}
    &totalWorks=${totalWorks}`;
    const q = await fetch(url);
    // debugger;
    const res = await q.json();
    // debugger;
    return res;
  }; */
  /* const { isLoading, isError, error, data, isFetching, isPreviousData } = useQuery(
    ['items', `${topic}${page}`],
    () => fetchItems(page),
    { keepPreviousData: true },
  );
 */

  useEffect(() => {
    let df: Item[] = [];
    if (globalSEState.only.length) {
      df = data.filter((i) => globalSEState.only.includes(i.type));
    } else df = [...data];
    setDataFiltered(df);
    setCurrent(() => [...df.slice(0, 4)]);
    setShow(() => [...df.slice(4, df.length)]);
    setHide([]);
  }, [globalSEState]);

  const buildMosaics = () => {
    const result: JSX.Element[] = [];
    if (current) {
      const mosaics = current.map((i) => renderMosaicItem(i, undefined));
      const res = (
        <Masonry
          // key={`${topic}${item.id}`}
          key={`${title}`}
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

  // const onItemsFound = async () => {
  //   const where = encodeURIComponent(
  //     JSON.stringify({
  //       ...(topic !== 'uncategorized' && { topics: { contains: topic } }),
  //       ...(topic === 'uncategorized' && {
  //         OR: [{ topics: { equals: null } }, { topics: { equals: '' } }],
  //       }),
  //     }),
  //   );
  //   setGlobalSearchEngineState({ ...globalSearchEngineState, where, q: topic });
  //   router.push('/search');
  // };

  return (
    (
      <>
        {(dataFiltered && dataFiltered.length && (
          <div className={styles.mainContainer}>
            <Row>
              <Col>
                <h5 className={styles.carouselTitle}>
                  {iconBefore ? <span className={styles.iconBefore}>{iconBefore}</span> : ''}
                  {` `} {title} {`(${dataFiltered.length})`}
                  {iconAfter ? <span className={styles.iconAfter}>{iconAfter}</span> : ''}
                </h5>
              </Col>
              <Col className={styles.right}>
                {dataFiltered.length && (
                  <Button className={styles.seeAllButton} onClick={onSeeAll}>
                    {t('common:See all')}
                  </Button>
                )}
              </Col>
            </Row>
            <div>
              {buildMosaics()}
              {/* {hide.length && ( */}
              <Button
                className={styles.leftButton}
                onClick={() => {
                  const s = current.slice(0, 4);
                  setShow((p) => [...s, ...p]);
                  const h = hide.slice(-4);
                  setCurrent(h);
                  setHide(hide.slice(0, -4));
                }}
                disabled={!hide.length}
              >
                <RiArrowLeftSLine />
              </Button>
              {/* )} */}
              {/* {dataFiltered.length && ( */}
              <Button
                className={styles.rightButton}
                onClick={() => {
                  const c = current.splice(0, 4);
                  setHide((p) => [...p, ...c]);
                  setCurrent(show.splice(0, 4));
                  setShow(() => show);
                }}
                disabled={!show.length}
              >
                <RiArrowRightSLine />
              </Button>
              {/* )} */}
            </div>
          </div>
        )) ||
          ''}
      </>
    ) || ''
  );
};

export default Carousel;
