import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent /*  useEffect, useState */, useEffect, useState } from 'react';
import { Card /* Button */ } from 'react-bootstrap';
// import { MySocialInfo } from '@/src/types';
// import { PostDetail } from '../../types/post';
// import { useQuery } from 'react-query';
// import { useRouter } from 'next/router';
// import { useSession } from 'next-auth/client';
import { CgMediaLive } from 'react-icons/cg';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';
import { CycleMosaicItem } from '../../types/cycle';
import { /* WorkWithImages, */ WorkMosaicItem } from '../../types/work';
import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';
import SocialInteraction from '../common/SocialInteraction';
// import { Session } from '../../types';
import { useCycleContext } from '../../useCycleContext';
import { DATE_FORMAT_SHORT } from '../../constants';

dayjs.extend(isBetween);
dayjs.extend(utc);
interface Props {
  // workWithImages: WorkWithImages;
  work: WorkMosaicItem;
  showButtonLabels?: boolean;
  showShare?: boolean;
  showSocialInteraction?: boolean;
  style?: { [k: string]: string };
  cacheKey?: string[];
  showTrash?: boolean;
  // isOnDiscussion?: boolean;
}
const MosaicItem: FunctionComponent<Props> = ({
  work,
  showButtonLabels = false,
  // showShare = false,
  showSocialInteraction = true,
  style = undefined,
  cacheKey = undefined,
  showTrash = false,
  // isOnDiscussion = false,
}) => {
  const { t } = useTranslation('common');
  const cycleContext = useCycleContext();
  const [cycle, setCycle] = useState<CycleMosaicItem | null>();
  useEffect(() => {
    if (cycleContext) setCycle(cycleContext.cycle);
  }, [cycleContext]);

  const isActive = () => {
    if (cycle) {
      if (cycle.cycleWorksDates.length) {
        const idx = cycle.cycleWorksDates.findIndex((cw) => cw.workId === work.id);
        if (idx > -1) {
          const cw = cycle.cycleWorksDates[idx];
          if (cw.startDate && cw.endDate) return dayjs().isBetween(cw.startDate, cw.endDate);
          if (cw.endDate) return dayjs().isBefore(cw.endDate);
        }
      }
    }
    return false;
  };

  const renderOngoinOrUpcomingDate = () => {
    if (cycle) {
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
    return null;
  };

  const { id, /* author, */ title, localImages, type } = work;
  // const [session] = useSession() as [Session | null | undefined, boolean];
  // const router = useRouter();

  // const [work, setWork] = useState<WorkDetail>();
  // const s
  // const { data: workData } = useQuery(['WORKS', id]);
  // useEffect(() => {
  //   if (workData) {
  //     setWork(workData as WorkDetail);
  //   }
  // }, [workData]);

  return (
    <Card className={`${styles.container} ${isActive() ? 'isActive' : ''}`}>
      <div className={styles.imageContainer} style={style}>
        <Link href={`/work/${id}`}>
          <a>
            <LocalImageComponent filePath={localImages[0].storedFile} alt={title} />
          </a>
        </Link>
        {isActive() && <CgMediaLive className={`${styles.isActiveCircle}`} />}
        <span className={styles.type}>{t(type)}</span>
      </div>
      {renderOngoinOrUpcomingDate()}
      {showSocialInteraction && work && (
        <Card.Footer className={styles.footer}>
          <SocialInteraction
            cacheKey={cacheKey || undefined}
            showButtonLabels={showButtonLabels}
            showCounts
            entity={work}
            showTrash={showTrash}
          />
        </Card.Footer>
      )}
    </Card>
  );
};

export default MosaicItem;
