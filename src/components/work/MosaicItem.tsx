import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent /*  useEffect, useState */, useEffect, useState, useContext } from 'react';
import { Card /* Button */ } from 'react-bootstrap';
// import { MySocialInfo } from '@/src/types';
// import { PostDetail } from '../../types/post';
// import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { CgMediaLive } from 'react-icons/cg';
import dayjs from 'dayjs';
import { CycleMosaicItem } from '../../types/cycle';
import { /* WorkWithImages, */ WorkMosaicItem } from '../../types/work';
import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';
import SocialInteraction from '../common/SocialInteraction';
import { Session } from '../../types';
import { useCycleContext } from '../../useCycleContext';

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
  showShare = false,
  showSocialInteraction = true,
  style = undefined,
  cacheKey = undefined,
  showTrash = false,
  // isOnDiscussion = false,
}) => {
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
          if (cw.endDate) return dayjs().isBefore(new Date(cw.endDate));
        }
      }
    }
    return false;
  };

  const { t } = useTranslation('common');
  const { id, /* author, */ title, localImages, type } = work;
  const [session] = useSession() as [Session | null | undefined, boolean];
  const router = useRouter();

  // const [work, setWork] = useState<WorkDetail>();
  // const s
  // const { data: workData } = useQuery(['WORKS', id]);
  // useEffect(() => {
  //   if (workData) {
  //     setWork(workData as WorkDetail);
  //   }
  // }, [workData]);

  return (
    <Card className={`${styles.container} ${isActive() ? styles.isActive : ''}`}>
      <div className={styles.imageContainer} style={style}>
        <Link href={`/work/${id}`}>
          <a>
            <LocalImageComponent filePath={localImages[0].storedFile} alt={title} />
          </a>
        </Link>
        {isActive() && <CgMediaLive className={styles.isActiveCircle} />}
        <span className={styles.type}>{t(type)}</span>
      </div>
      {showSocialInteraction && work && (
        <Card.Footer className={styles.footer}>
          <SocialInteraction
            cacheKey={cacheKey || undefined}
            showButtonLabels={showButtonLabels}
            showCounts
            showShare={showShare}
            entity={work}
            showTrash={showTrash}
          />
        </Card.Footer>
      )}
    </Card>
  );
};

export default MosaicItem;
