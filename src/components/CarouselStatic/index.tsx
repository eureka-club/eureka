import { useAtom } from 'jotai';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useState, useEffect, useMemo } from 'react';
import globalSearchEngineAtom from '../../atoms/searchEngine';
import Spinner from '@/components/common/Spinner';
import styles from './index.module.css';
import Mosaics from './Mosaics';
import { MosaicItem, Size } from '@/src/types';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';

type Props = {
  title?: string | JSX.Element;
  iconBefore?: JSX.Element;
  iconAfter?: JSX.Element;
  onSeeAll?: () => void;
  seeAll?: boolean;
  data: MosaicItem[]; // ((CycleDetail & { type: string }) | WorkDetail)[];
  showSocialInteraction?: boolean;
  customMosaicStyle?: { [key: string]: string };
  className?: string;
  mosaicBoxClassName?: string;
  size?: Size;
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
  const [dataFiltered, setDataFiltered] = useState<MosaicItem[]>([]);
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
          <>
          <Stack gap={.25}>
            <Stack direction={'row'} alignItems={'baseline'} justifyContent={'space-between'}>
              <Typography variant='h6' color={'secondary'}>
                  {iconBefore ? <span className={styles.iconBefore}>{iconBefore}</span> : ''}
                  {` `} {title}
                  {iconAfter ? <span className={styles.iconAfter}>{iconAfter}</span> : ''}
              </Typography>
              {seeAll && !!dataFiltered.length && (
                    <Box>
                      {!isRedirecting ? (
                        <span
                          className={`cursor-pointer text-primary ${styles.seeAllButton}`}
                          role="presentation"
                          onClick={handlerSeeAll}
                        >
                          {t('common:See all')}
                        </span>
                      ) : (
                        <Spinner/>
                      )}
                    </Box>
              )}
            </Stack>
            <Box className="carousel" justifyContent={'center'}>
              <Mosaics
                data={dataFiltered}
                cacheKey={cacheKey}
                userMosaicDetailed={userMosaicDetailed}
                showSocialInteraction={showSocialInteraction}
                customMosaicStyle={customMosaicStyle}
                mosaicBoxClassName={mosaicBoxClassName}
                size={size}
              />
            </Box>
          </Stack>
          {/* <CardGroup className="mb-3">
            <section className="d-flex flex-row  justify-content-between w-100">
              <Col xs={9}>
                <Typography variant='h6' color={'secondary'}>
                    {iconBefore ? <span className={styles.iconBefore}>{iconBefore}</span> : ''}
                    {` `} {title}
                    {iconAfter ? <span className={styles.iconAfter}>{iconAfter}</span> : ''}
                </Typography>
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
                      <Spinner/>
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
          </CardGroup> */}
          </>
        )}
      </>
    ),
    [dataFiltered],
  );
};

export default CarouselStatic;
