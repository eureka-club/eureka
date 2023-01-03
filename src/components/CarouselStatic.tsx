import { useAtom } from 'jotai';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent /* , ChangeEvent */, useState, useEffect } from 'react';
import { Button, Row, Col, Spinner,CardGroup } from 'react-bootstrap';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import globalSearchEngineAtom from '../atoms/searchEngine';
import { MosaicItem, isCycleMosaicItem, isWorkMosaicItem, isPostMosaicItem, isUserMosaicItem } from '../types';
import MosaicItemCycle from './cycle/NewMosaicItem';
import MosaicItemPost from './post/NewMosaicItem';
import MosaicItemWork from './work/MosaicItem';
import MosaicUserItem from './user/MosaicItem';

import styles from './Carousel.module.css';
import { WorkMosaicItem /* , WorkWithImages */ } from '../types/work';
import { CycleMosaicItem /* , CycleWithImages */ } from '../types/cycle';
import { PostMosaicItem } from '../types/post';
import { UserMosaicItem } from '../types/user';
import { CycleContext } from '../useCycleContext';

type Item = CycleMosaicItem | WorkMosaicItem | PostMosaicItem | UserMosaicItem;
type Props = {
  title?: string | JSX.Element;
  iconBefore?: JSX.Element;
  iconAfter?: JSX.Element;
  onSeeAll?: () => void;
  seeAll?:boolean;
  data: Item[]; // ((CycleMosaicItem & { type: string }) | WorkMosaicItem)[];
  showSocialInteraction?: boolean;
  customMosaicStyle?: { [key: string]: string };
  className?: string;
  mosaicBoxClassName?:string;
  size?: string,
  cacheKey:[string,string];
  userMosaicDetailed?: boolean
};

const renderMosaicItem = (
  item: MosaicItem,
  postsParent: CycleMosaicItem | WorkMosaicItem | undefined,
  showSocialInteraction = true,
  cacheKey:[string,string],
  customMosaicStyle?: { [key: string]: string },
  size?: string,
  className?:string,
  userMosaicDetailed?:boolean
) => {
  if (isCycleMosaicItem(item)) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (
      <CycleContext.Provider key={`cycle-${item.id}`} value={{ cycle: item as CycleMosaicItem }}>
        <MosaicItemCycle detailed cycleId={item.id} showSocialInteraction={showSocialInteraction} showButtonLabels={false} size={size}
/>
      </CycleContext.Provider>
    );
  }
  if (isPostMosaicItem(item) || (item && item.type === 'post')) {
    const it: PostMosaicItem = item as PostMosaicItem;
    // let pp:WorkMosaicItem | CycleMosaicItem | undefined = undefined;
    // if (it.works && it.works.length > 0) pp = it.works[0] as WorkMosaicItem;
    // else if (it.cycles && it.cycles.length > 0) pp = it.cycles[0] as CycleMosaicItem;

    return <MosaicItemPost cacheKey={cacheKey} key={`post-${it.id}`} postId={it.id} size={size} />;
  }
  if (isWorkMosaicItem(item)) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (
      <MosaicItemWork
        showSocialInteraction={showSocialInteraction}
        showButtonLabels={false}
        workId={item.id}
        style={customMosaicStyle}
        size={size}
      />
    );
  }
  if (isUserMosaicItem(item)) {
    return <MosaicUserItem user={item} key={`user-${item.id}`} showSocialInteraction={false} MosaicDetailed={userMosaicDetailed} />;
  }

  return '';
};

const CarouselStatic: FunctionComponent<Props> = ({
  title,
  data,
  iconBefore,
  iconAfter,
  onSeeAll,
  seeAll=true,
  showSocialInteraction = true,
  customMosaicStyle = undefined,
  className,
  mosaicBoxClassName,
  size,
  cacheKey,
  userMosaicDetailed = false 
}) => {
  const { t } = useTranslation('topics');
  const [current, setCurrent] = useState<Item[]>([]);
  const [show, setShow] = useState<Item[]>([]);
  const [hide, setHide] = useState<Item[]>([]);
  const [dataFiltered, setDataFiltered] = useState<Item[]>([]);
  const [isRedirecting, setIsRedirecting] = useState(false);


  const [globalSEState] = useAtom(globalSearchEngineAtom);
  useEffect(() => {
    if (data) {
      if (data.length) {
        let d = [...data];
        if (globalSEState.only.length) {
          d = data.filter((i) => globalSEState.only.includes((i && i.type) || ''));
        }
        setDataFiltered(() => d);
        //const s = d.slice(0, 6);
        setCurrent(() => [...d]);
        setShow(() => [...d]);
        //setCurrent(() => [...s]);
        //setShow(() => [...d.slice(6, d.length)]);
      } else {
        setDataFiltered(() => []);
        setCurrent(() => []);
        setShow(() => []);
      }
    }
  }, [data, globalSEState]);

  const buildMosaics = () => {
    let result: JSX.Element = <></>;
    
    if (current) {
      const mosaics = current.map((i, idx: number) => (
        <div key={`mosaic-${i.type}-${i.id}`} className={`${mosaicBoxClassName} mx-2`}/*className="pb-5 mx-2"*/>
          {renderMosaicItem(i, undefined, showSocialInteraction,cacheKey, customMosaicStyle, size,undefined,userMosaicDetailed)}
        </div>
      ));
      result = (
        <div className="d-flex flex-nowrap w-100 justify-content-xl-left">
         {/* {!!(hide.length) && <Button
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
          </Button> || ''}*/}
          {mosaics}
          {/*  {!!(show.length) && <Button
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
          </Button> || ''}*/}
        </div>
      );
    }
    return result;
  };

  const handlerSeeAll = ()=>{
    setIsRedirecting(true)
    if(onSeeAll)
      onSeeAll()
  }

  return (
     <>
        {(dataFiltered && !!(dataFiltered.length) && ( 
          <CardGroup className='mb-3'>  
              <section className="d-flex flex-row  justify-content-between w-100">
                              <Col xs={9}>

                <h2 className="text-secondary fw-bold">
                  {iconBefore ? <span className={styles.iconBefore}>{iconBefore}</span> : ''}
                  {` `} {title} 
                  {iconAfter ? <span className={styles.iconAfter}>{iconAfter}</span> : ''}
                </h2>
                </Col>
                <Col xs={3} className="d-flex justify-content-end">
                {seeAll && !!(dataFiltered.length) && <>
                  {!isRedirecting ? <span
                    className={`cursor-pointer text-primary ${styles.seeAllButton}`}
                    role="presentation"
                    onClick={handlerSeeAll}
                  >
                    {t('common:See all')}
                  </span> : <Spinner animation='grow' />}
                  </>}
                  </Col>
            </section>
             <div className="carousel d-flex justify-content-center">{buildMosaics()}</div>
          </CardGroup>  
       ))} 
     </>
        
  );
};

export default CarouselStatic;
  {/*
   <>
  {(dataFiltered && dataFiltered.length && (
          <div className={`mb-5 position-relative ${className}`}>
            <Row>
              <Col xs={9}>
                <h1 className="text-secondary fw-bold fs-3">
                  {iconBefore ? <span className={styles.iconBefore}>{iconBefore}</span> : ''}
                  {` `} {title} 
                  {iconAfter ? <span className={styles.iconAfter}>{iconAfter}</span> : ''}
                </h1>
              </Col>
              <Col xs={3} className="d-flex justify-content-end">
                {seeAll && dataFiltered.length && <>
                  {!isRedirecting ? <span
                    className={`cursor-pointer text-primary ${styles.seeAllButton}`}
                    role="presentation"
                    onClick={handlerSeeAll}
                  >
                    {t('common:See all')}
                  </span> : <Spinner animation='grow' />}
                  </>}
              </Col>
            </Row>


            <div className="carousel d-flex justify-content-center">{buildMosaics()}</div>


          </div>
        )) ||
          ''}
      </>
    ) || ''
  */}