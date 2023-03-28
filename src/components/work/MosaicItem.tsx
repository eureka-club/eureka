import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useEffect, useState } from 'react';
import { Card, Badge, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { CgMediaLive } from 'react-icons/cg';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';
import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';
import SocialInteraction from '../common/SocialInteraction';
import { useCycleContext } from '../../useCycleContext';
import { DATE_FORMAT_SHORT } from '../../constants';
import useWork from '@/src/useWork';
import { WorkMosaicItem } from '@/src/types/work';

dayjs.extend(isBetween);
dayjs.extend(utc);
interface Props {
  work?: WorkMosaicItem;
  workId: number;
  showButtonLabels?: boolean;
  showShare?: boolean;
  showSocialInteraction?: boolean;
  showCreateEureka?: boolean;
  showSaveForLater?: boolean;
  style?: { [k: string]: string };
  cacheKey?: [string, string];
  showTrash?: boolean;
  linkToWork?: boolean;
  size?: string;
  className?: string;
}
const MosaicItem: FunctionComponent<Props> = ({
  work: workItem,
  workId,
  showButtonLabels = false,
  showSocialInteraction = true,
  showCreateEureka,
  showSaveForLater,
  style = undefined,
  cacheKey = undefined,
  showTrash = false,
  linkToWork = true,
  size,
  className = '',
}) => {
  const { t } = useTranslation('common');
  const { cycle } = useCycleContext();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [work, setWork] = useState(workItem);

  const { data } = useWork(workId, {
    enabled: !!workId && !workItem,
  });
  useEffect(() => {
    if (data && !workItem) setWork(data);
  }, [data]);

  if (!work) return <></>;
  const { id, title, localImages, type } = work;

  const isActive = () => {
    if (cycle && cycle.cycleWorksDates) {
      if (cycle.cycleWorksDates.length) {
        const idx = cycle.cycleWorksDates.findIndex((cw) => cw.workId === work.id);
        if (idx > -1) {
          const cw = cycle.cycleWorksDates[idx];
          if (cw.startDate && cw.endDate)
            return dayjs().utc().isBetween(dayjs(cw.startDate), dayjs(cw.endDate), 'day', '[]');
          if (cw.endDate) return dayjs().isBefore(cw.endDate);
        }
      }
    }
    return false;
  };

  const renderOngoinOrUpcomingDate = () => {
    if (cycle && cycle.cycleWorksDates) {
      if (cycle.cycleWorksDates.length) {
        const idx = cycle.cycleWorksDates.findIndex((cw) => cw.workId === work.id);
        if (idx > -1) {
          const cw = cycle.cycleWorksDates[idx];
          if (cw.endDate) {
            const sd = cw.startDate ? dayjs(cw.startDate).utc().format(DATE_FORMAT_SHORT) : '-';
            const ed = dayjs(cw.endDate).utc().format(DATE_FORMAT_SHORT);
            const isPast = dayjs().isAfter(cw.endDate);
            const res = () => {
              const dateOut = (
                <span>
                  <em style={{ fontSize: '.8em' }}>{`${sd} - ${ed}`}</em>
                </span>
              );
              const labelOut = (label: string) => <span className="d-block">{`${t(label)}`}</span>;
              if (isActive())
                return (
                  <>
                    {labelOut('Ongoing')}
                    {dateOut}
                  </>
                );
              if (!isPast)
                return (
                  <>
                    {labelOut('Upcoming')}
                    {dateOut}
                  </>
                );
              return (
                <>
                  {labelOut('Past')}
                  {dateOut}
                </>
              );
            };
            return (
              <h6 className="d-block w-100 text-center mt-2 text-gray-dark position-absolute" style={{ top: '100%' }}>
                {res()}
              </h6>
            );
          }
        }
      }
    }
    return <></>;
  };

  const canNavigate = () => {
    return !loading;
  };
  const onImgClick = () => {
    if (canNavigate()) router.push(`/work/${id}`);
    setLoading(true);
  };
  const renderLocalImageComponent = () => {
    const img = localImages ? (
      <LocalImageComponent filePath={localImages[0].storedFile} title={title} alt={title} />
    ) : undefined;
    if (linkToWork) {
      return (
        <div
          className={`${styles.imageContainer} ${!loading ? 'cursor-pointer' : ''}`}
          onClick={onImgClick}
          role="presentation"
          style={style}
        >
          {!canNavigate() && (
            <Spinner className="position-absolute top-50 start-50" size="sm" animation="grow" variant="info" />
          )}
          {img}
        </div>
      );
    }
    return img;
  };
  return (
    <Card
      className={`${size?.length ? `mosaic-${size}` : 'mosaic'} ${isActive() ? 'my-1 isActive' : ''} ${className}`}
      data-cy={`mosaic-item-work-${id}`}
    >
      <div className={`${styles.imageContainer}`}>
        {renderLocalImageComponent()}
        {isActive() && <CgMediaLive className={`${styles.isActiveCircle}`} />}
        <Badge bg="orange" className={`fw-normal fs-6 text-black px-2 rounded-pill ${styles.type}`}>
          {type ? t(type) : '...'}
        </Badge>
      </div>
      {renderOngoinOrUpcomingDate()}
      {showSocialInteraction && work && (
        <Card.Footer className={`${styles.footer}  d-flex justify-content-end `}>
          <SocialInteraction
            cacheKey={cacheKey || ['WORK', work.id.toString()]}
            showButtonLabels={showButtonLabels}
            showRating={false}
            showCounts
            entity={work}
            showTrash={showTrash}
            showSaveForLater={showSaveForLater}
            showCreateEureka={showCreateEureka}
            className="w-100"
          />
        </Card.Footer>
      )}
    </Card>
  );
};

export default MosaicItem;
