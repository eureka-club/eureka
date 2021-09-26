// import classNames from 'classnames';
// import { useAtom } from 'jotai';
// import { useQuery } from 'react-query';
// import { useSession } from 'next-auth/client';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import Masonry from 'react-masonry-css';
import classNames from 'classnames';
// import { Cycle, Work } from '@prisma/client';
import useTranslation from 'next-translate/useTranslation';
// import { /* useInfiniteQuery, */ useQuery } from 'react-query';
import { FunctionComponent /* , ChangeEvent */, useState, useEffect, Fragment } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
// import router from 'next/router';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
// import { BsHash } from 'react-icons/bs';
import globalSearchEngineAtom from '../atoms/searchEngine';
import { MosaicItem, isCycleMosaicItem, isWorkMosaicItem, isPostMosaicItem, isUserMosaicItem } from '../types';
import MosaicItemCycle from './cycle/MosaicItem';
import MosaicItemPost from './post/MosaicItem';
import MosaicItemWork from './work/MosaicItem';
import MosaicUserItem from './user/MosaicItem';

import styles from './Carousel.module.css';
// import { setCookie } from 'nookies';
// import { Work, Cycle, PrismaPromise } from '@prisma/client';
import { WorkMosaicItem /* , WorkWithImages */ } from '../types/work';
import { CycleMosaicItem /* , CycleWithImages */ } from '../types/cycle';
import { PostMosaicItem } from '../types/post';
import { UserMosaicItem } from '../types/user';

type Item = CycleMosaicItem | WorkMosaicItem | PostMosaicItem | UserMosaicItem;
type Props = {
  title: string;
  iconBefore?: JSX.Element;
  iconAfter?: JSX.Element;
  onSeeAll?: () => Promise<void>;
  data: Item[]; // ((CycleMosaicItem & { type: string }) | WorkMosaicItem)[];
  showSocialInteraction?: boolean;
  customMosaicStyle?: { [key: string]: string };
};

const renderMosaicItem = (
  item: MosaicItem,
  postsParent: CycleMosaicItem | WorkMosaicItem | undefined,
  showSocialInteraction = true,
  customMosaicStyle?: { [key: string]: string },
) => {
  if (isCycleMosaicItem(item)) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (
      <MosaicItemCycle
        detailed
        showSocialInteraction={showSocialInteraction}
        showButtonLabels={false}
        key={`cycle-${item.id}`}
        cycle={item}
      />
    );
  }
  if (isPostMosaicItem(item) || item.type === 'post') {
    let pp;
    const it: PostMosaicItem = item as PostMosaicItem;
    if (it.works && it.works.length > 0) [pp] = it.works;
    else if (it.cycles && it.cycles.length > 0) [pp] = it.cycles;

    return <MosaicItemPost key={`post-${item.id}`} post={item as PostMosaicItem} postParent={pp} />;
  }
  if (isWorkMosaicItem(item)) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (
      <MosaicItemWork
        showSocialInteraction={showSocialInteraction}
        showButtonLabels={false}
        key={`work-${item.id}`}
        work={item}
        style={customMosaicStyle}
      />
    );
  }
  if (isUserMosaicItem(item)) {
    return <MosaicUserItem user={item} key={`user-${item.id}`} showSocialInteraction={false} />;
  }

  return '';
};

const CarouselStatic: FunctionComponent<Props> = ({
  title,
  data,
  iconBefore,
  iconAfter,
  onSeeAll,
  showSocialInteraction = true,
  customMosaicStyle = undefined,
}) => {
  const { t } = useTranslation('topics');
  const [current, setCurrent] = useState<Item[]>([]);
  const [show, setShow] = useState<Item[]>([]);
  const [hide, setHide] = useState<Item[]>([]);
  const [dataFiltered, setDataFiltered] = useState<Item[]>([]);

  const [globalSEState] = useAtom(globalSearchEngineAtom);
  useEffect(() => {
    if (data) {
      if (data.length) {
        let d = [...data];
        if (globalSEState.only.length) {
          d = data.filter((i) => globalSEState.only.includes(i.type || ''));
        }
        setDataFiltered(() => d);
        const s = d.slice(0, 4);
        setCurrent(() => [...s]);
        setShow(() => [...d.slice(4, d.length)]);
      } else {
        setDataFiltered(() => []);
        setCurrent(() => []);
        setShow(() => []);
      }
    }
  }, [data, globalSEState]);

  const buildMosaics = () => {
    const result: JSX.Element[] = [];
    if (current) {
      const mosaics = current.map((i) => renderMosaicItem(i, undefined, showSocialInteraction, customMosaicStyle));
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

  return (
    (
      <>
        {(dataFiltered && dataFiltered.length && (
          <div className={styles.mainContainer}>
            <Row>
              <Col>
                <h5 className={styles.carouselTitle}>
                  {iconBefore ? <span className={styles.iconBefore}>{iconBefore}</span> : ''}
                  {` `} {title} {/* {`(${dataFiltered.length})`} */}
                  {iconAfter ? <span className={styles.iconAfter}>{iconAfter}</span> : ''}
                </h5>
              </Col>
              <Col className={styles.right}>
                {dataFiltered.length && (
                  <Button className={`mb-3 ${styles.seeAllButton}`} onClick={onSeeAll}>
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

export default CarouselStatic;
