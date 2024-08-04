import Link from 'next/link';
import { useAtom } from 'jotai';
import useTranslation from 'next-translate/useTranslation';
import { useQueryClient } from 'react-query';
import { FunctionComponent, useState, memo } from 'react';
import { Button, Row, Col, Spinner } from 'react-bootstrap';
import router from 'next/router';
import { BsHash } from 'react-icons/bs';
import globalSearchEngineAtom from '../atoms/searchEngine';
import { MosaicItem, isCycleMosaicItem, isWorkMosaicItem, isPostMosaicItem } from '../types';
import MosaicItemCycle from './cycle/MosaicItem';
import MosaicItemPost from './post/Old_MosaicItem';
import MosaicItemWork from './work/MosaicItem';
import styles from './Carousel.module.css';
import { WorkSumary /* , WorkWithImages */ } from '../types/work';
import { CycleSumary /* , CycleWithImages */ } from '../types/cycle';
import { GetAllByResonse } from '@/src/types';

type Props = {
  // page: number;
  // setPage: (page: number) => void;
  // items: (WorkWithImages | CycleWithImages)[];
  topic: string;
  topicLabel?: string;
  className?: string;
  apiResponse: GetAllByResonse;
  
};



interface ItemType {
  data: [];
  nextCursor: number;
  prevCursor: number;
  status: string;
  delay?: number;
}

const Carousel: FunctionComponent<Props> = ({ apiResponse, topic, topicLabel, className }) => {
  const { t } = useTranslation('topics');
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<ItemType>();
  
  const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const queryClient = useQueryClient();


  const RenderCarouselItem = (
    item: MosaicItem,
    postsParent?: CycleSumary | WorkSumary,
    topic = '',
    page = '',
    showSocialInteraction = true,
  ) => {
    if (isCycleMosaicItem(item)) {
      return (
        // <CycleContext.Provider key={`cycle-${item.id}`} value={{ cycle: item as CycleSumary }}>
          <MosaicItemCycle cycleId={item.id}/>
        // </CycleContext.Provider>
      );
    }
    if (isPostMosaicItem(item) || item.type === 'post') {
      return <MosaicItemPost cacheKey={['POST', `${item.id}`]} key={`post-${item.id}`} postId={item.id} />;
    }
    if (isWorkMosaicItem(item)) {
      const item_ = item as WorkSumary;
      // eslint-disable-next-line react/jsx-props-no-spreading
      return (
        <MosaicItemWork key={`work-${item_.id}`} workId={item_.id}/>
      );
    }
  
    return '';
  };
  const buildMosaics = () => {
    let result: JSX.Element = <></>;
    if (apiResponse && apiResponse.data) {
      const mosaics = apiResponse.data.map((i, idx:number) => {
        return <div key={`${i.type}-${i.id}`} className="mx-2">
            {RenderCarouselItem(i,undefined, topic, page.toString())}
          </div>
      });
      result = <div className="d-flex flex-nowrap w-100 justify-content-xl-left">
          {mosaics}
        </div>
    }
    return result;
  };

  const onItemsFound = async () => {
    setIsRedirecting(true)
    setGlobalSearchEngineState((res) => ({...res, itemsFound:[]}));
    router.push(`/search?q=${topic}&fields=topics`);
  };

  return (
    (apiResponse && (
      <section className={`${className}`}>
        {apiResponse && apiResponse.data && (
          <div className="position-relative">
            <Row>
              <Col xs={8} md={9}>
                  <Link href={`/search?q=${topic}&fields=topics`}>
                    <h2 className=" text-secondary fw-bold cursor-pointer">
                      <span className={styles.iconBefore}>
                        <BsHash className="rounded-circle border border-1 border-gray" />
                      </span>
                      {topicLabel || t(`${topic}`)}
                    </h2>
                  </Link>
              </Col>
              <Col xs={4} md={3} className="d-flex justify-content-end">
                {!isRedirecting ? (
                  <Button variant="link" className="text-decoration-none" onClick={onItemsFound}>
                    <span className={`cursor-pointer text-primary ${styles.seeAllButton}`}>{t('common:See all')}</span>
                  </Button>
                ) : (
                  <Spinner animation="grow" />
                )}
              </Col>
            </Row>
            <div className="carousel d-flex justify-content-center">{buildMosaics()}</div>
          </div>
        )}
      </section>
    )) ||
    null
  );
};

export default memo(Carousel);
