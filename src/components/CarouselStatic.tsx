// import classNames from 'classnames';
// import { useAtom } from 'jotai';
// import { useQuery } from 'react-query';
// import { useSession } from 'next-auth/react';
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
import { v4 } from 'uuid';
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
import { CycleContext } from '../useCycleContext';
import { Cycle } from '@prisma/client';

type Item = CycleMosaicItem | WorkMosaicItem | PostMosaicItem | UserMosaicItem;
type Props = {
  title: string | JSX.Element;
  iconBefore?: JSX.Element;
  iconAfter?: JSX.Element;
  onSeeAll?: () => Promise<void>;
  data: Item[]; // ((CycleMosaicItem & { type: string }) | WorkMosaicItem)[];
  showSocialInteraction?: boolean;
  customMosaicStyle?: { [key: string]: string };
  className?: string;
  mosaicBoxClassName?:string;
  tiny?: boolean;
  cacheKey:[string,string];
};

const renderMosaicItem = (
  item: MosaicItem,
  postsParent: CycleMosaicItem | WorkMosaicItem | undefined,
  showSocialInteraction = true,
  cacheKey:[string,string],
  customMosaicStyle?: { [key: string]: string },
  tiny?: boolean,
  className?:string,
) => {
  if (isCycleMosaicItem(item)) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (
      <CycleContext.Provider key={`cycle-${v4()}`} value={{ cycle: item as CycleMosaicItem }}>
        <MosaicItemCycle detailed cycleId={item.id} showSocialInteraction={showSocialInteraction} showButtonLabels={false} />
      </CycleContext.Provider>
    );
  }
  if (isPostMosaicItem(item) || (item && item.type === 'post')) {
    const it: PostMosaicItem = item as PostMosaicItem;
    // let pp:WorkMosaicItem | CycleMosaicItem | undefined = undefined;
    // if (it.works && it.works.length > 0) pp = it.works[0] as WorkMosaicItem;
    // else if (it.cycles && it.cycles.length > 0) pp = it.cycles[0] as CycleMosaicItem;

    return <MosaicItemPost cacheKey={cacheKey} key={`post-${v4()}`} postId={it.id} />;
  }
  if (isWorkMosaicItem(item)) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (
      <MosaicItemWork
        showSocialInteraction={showSocialInteraction}
        showButtonLabels={false}
        workId={item.id}
        style={customMosaicStyle}
        tiny={tiny}
      />
    );
  }
  if (isUserMosaicItem(item)) {
    return <MosaicUserItem user={item} key={`user-${v4()}`} showSocialInteraction={false} />;
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
  className,
  mosaicBoxClassName,
  tiny = false,
  cacheKey
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
        const s = d.slice(0, 6);
        setCurrent(() => [...s]);
        setShow(() => [...d.slice(6, d.length)]);
      } else {
        setDataFiltered(() => []);
        setCurrent(() => []);
        setShow(() => []);
      }
      console.log(dataFiltered)
    }
  }, [data, globalSEState]);

  const buildMosaics = () => {
    const result: JSX.Element[] = [];
    if (current) {
      const mosaics = current.map((i, idx: number) => (
        <div key={`${idx * 1}${v4()}`} className={`${mosaicBoxClassName} mx-2`}/*className="pb-5 mx-2"*/>
          {renderMosaicItem(i, undefined, showSocialInteraction,cacheKey, customMosaicStyle, tiny)}
        </div>
      ));
      const res = (
        // <Masonry
        //   // key={`${topic}${item.id}`}
        //   key={`${title}`}
        //   breakpointCols={{
        //     default: 4,
        //     1199: 3,
        //     768: 2,
        //     576: 1,
        //   }}
        //   className={classNames('d-flex', styles.masonry)}
        //   columnClassName={styles.masonryColumn}
        // >
        //   {mosaics}
        // </Masonry>
        <div key={v4()} className="d-flex flex-nowrap w-100 justify-content-xl-left">
          {hide.length && <Button
            className={`text-white rounded-circle align-self-center ${styles.leftButton}`}
            onClick={() => {
              const s = current.slice(0, 6);
              setShow((p) => [...s, ...p]);
              const h = hide.slice(-6);
              setCurrent(h);
              setHide(hide.slice(0, -6));
            }}
            disabled={!hide.length}
          >
            <RiArrowLeftSLine />
          </Button> || ''}
          {mosaics}
          {/* )} */}
          {/* {dataFiltered.length && ( */}
          {show.length && <Button
            className={`text-center text-white rounded-circle align-self-center ${styles.rightButton}`}
            onClick={() => {
              const c = current.splice(0, 6);
              setHide((p) => [...p, ...c]);
              setCurrent(show.splice(0, 6));
              setShow(() => show);
            }}
            disabled={!show.length}
          >
            <RiArrowRightSLine />
          </Button> || ''}
        </div>
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
          <div className={`mb-5 position-relative ${className}`}>
            <Row>
              <Col xs={9}>
                <h5 className="text-gray-dark mb-2">
                  {iconBefore ? <span className={styles.iconBefore}>{iconBefore}</span> : ''}
                  {` `} {title} {/* {`(${dataFiltered.length})`} */}
                  {iconAfter ? <span className={styles.iconAfter}>{iconAfter}</span> : ''}
                </h5>
              </Col>
              <Col xs={3} className="d-flex justify-content-end">
                {dataFiltered.length && (
                  // <Button className={`${styles.seeAllButton}`} onClick={onSeeAll}>
                  //   {t('common:See all')}
                  // </Button>
                  <span
                    className={`cursor-pointer text-primary ${styles.seeAllButton}`}
                    role="presentation"
                    onClick={onSeeAll}
                  >
                    {t('common:See all')}
                  </span>
                )}
              </Col>
            </Row>
            <div className="carousel d-flex justify-content-center">{buildMosaics()}</div>
          </div>
        )) ||
          ''}
      </>
    ) || ''
  );
};

export default CarouselStatic;
