import { useAtom } from 'jotai';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useState, useEffect, useMemo } from 'react';
import { Col, Spinner, CardGroup } from 'react-bootstrap';
import globalSearchEngineAtom from '../../atoms/searchEngine';

import styles from './index.module.css';
import { WorkDetail /* , WorkWithImages */ } from '../../types/work';
import { CycleMosaicItem /* , CycleWithImages */ } from '../../types/cycle';
import { PostMosaicItem } from '../../types/post';
import { UserMosaicItem } from '../../types/user';
import Mosaics from './Mosaics';

type Item = CycleMosaicItem | WorkDetail | PostMosaicItem | UserMosaicItem;
type Props = {
  title?: string | JSX.Element;
  iconBefore?: JSX.Element;
  iconAfter?: JSX.Element;
  onSeeAll?: () => void;
  seeAll?: boolean;
  data: Item[]; // ((CycleMosaicItem & { type: string }) | WorkDetail)[];
  showSocialInteraction?: boolean;
  customMosaicStyle?: { [key: string]: string };
  className?: string;
  mosaicBoxClassName?: string;
  size?: string;
  cacheKey: string[];
  userMosaicDetailed?: boolean;
};

const CarouselStatic: FunctionComponent<Props> = ({
  title,
  data,
  iconBefore,
  iconAfter,
  onSeeAll,
  seeAll = true,
  showSocialInteraction = true,
  customMosaicStyle = undefined,
  mosaicBoxClassName,
  size,
  cacheKey,
  userMosaicDetailed = false,
}) => {
  const { t } = useTranslation('topics');
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
      } else {
        setDataFiltered(() => []);
      }
    }
  }, [data, globalSEState]);

  const handlerSeeAll = () => {
    setIsRedirecting(true);
    if (onSeeAll) onSeeAll();
    setIsRedirecting(false);
  };

  return useMemo(
    () => (
      <>
        {dataFiltered && !!dataFiltered.length && (
          <CardGroup className="mb-3">
            <section className="d-flex flex-row  justify-content-between w-100">
              <Col xs={9}>
                <h2 className="text-secondary fw-bold">
                  {iconBefore ? <span className={styles.iconBefore}>{iconBefore}</span> : ''}
                  {` `} {title}
                  {iconAfter ? <span className={styles.iconAfter}>{iconAfter}</span> : ''}
                </h2>
              </Col>
              <Col xs={3} className="d-flex justify-content-end">
                {seeAll && !!dataFiltered.length && (
                  <>
                    {!isRedirecting ? (
                      <span
                        className={`cursor-pointer text-primary ${styles.seeAllButton}`}
                        role="presentation"
                        onClick={handlerSeeAll}
                      >
                        {t('common:See all')}
                      </span>
                    ) : (
                      <Spinner animation="grow" />
                    )}
                  </>
                )}
              </Col>
            </section>
            <div className="carousel d-flex justify-content-center">
              <Mosaics
                data={dataFiltered}
                cacheKey={cacheKey}
                userMosaicDetailed={userMosaicDetailed}
                showSocialInteraction={showSocialInteraction}
                customMosaicStyle={customMosaicStyle}
                mosaicBoxClassName={mosaicBoxClassName}
                size={size}
              />
            </div>
          </CardGroup>
        )}
      </>
    ),
    [dataFiltered],
  );
};

export default CarouselStatic;
