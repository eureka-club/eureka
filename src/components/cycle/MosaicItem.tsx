import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import classNames from 'classnames';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';

import { Card, Button } from 'react-bootstrap';
import { useSession } from 'next-auth/client';
import { CgMediaLive } from 'react-icons/cg';
import { DATE_FORMAT_SHORT } from '../../constants';
import { CycleMosaicItem } from '../../types/cycle';
import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';

import { Session } from '../../types';
import SocialInteraction from '../common/SocialInteraction';

dayjs.extend(utc);
dayjs.extend(timezone);
interface Props {
  // workWithImages: WorkWithImages;
  cycle: CycleMosaicItem;
  showButtonLabels?: boolean;
  showShare?: boolean;
  detailed?: boolean;
}
const MosaicItem: FunctionComponent<Props> = ({ cycle, showButtonLabels, showShare, detailed = false }) => {
  const { id, title, localImages, startDate, endDate } = cycle;
  const { t } = useTranslation('common');
  const sd = dayjs(startDate).add(1, 'day').tz(dayjs.tz.guess());
  const ed = dayjs(endDate).add(1, 'day').tz(dayjs.tz.guess());
  const isActive = dayjs().isBefore(ed);
  const [session] = useSession() as [Session | null | undefined, boolean];
  return (
    <Card className={classNames(styles.container, isActive ? 'isActive' : '')} border={isActive ? 'success' : ''}>
      <div className={`${styles.imageContainer} ${detailed && styles.detailedImageContainer}`}>
        <Link href={`/cycle/${id}`}>
          <a>
            <LocalImageComponent filePath={localImages[0].storedFile} alt={title} />
          </a>
        </Link>

        {isActive && <CgMediaLive className={styles.isActiveCircle} />}
        <span className={styles.type}>{t('cycle')}</span>
      </div>
      {detailed && (
        <div className={styles.detailedInfo}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.date}>
            {sd.format(DATE_FORMAT_SHORT)}
            &mdash; {ed.format(DATE_FORMAT_SHORT)}
          </div>

          <div className={styles.joinButtonContainer}>
            <Button variant="primary" size="sm">
              {t('Join')}
            </Button>
          </div>
          <div className={styles.participantsInfo}>{`${cycle.participants.length} ${t('participants')}`}</div>
        </div>
      )}
      {session && (
        <Card.Footer className={styles.footer}>
          {cycle && (
            <SocialInteraction showButtonLabels={showButtonLabels} showCounts showShare={showShare} entity={cycle} />
          )}
        </Card.Footer>
      )}
    </Card>
  );
  // <article className={styles.cycle}>
  //   <Link href={`/cycle/${id}`}>
  //     <a className="d-inline-block">
  //       <LocalImageComponent filePath={localImages[0].storedFile} alt={title} />

  //       <div className={styles.gradient} />
  //       <div className={styles.embeddedInfo}>
  //         <h3 className={styles.title}>{title}</h3>
  //         <span className={styles.date}>
  //           {sd.format(DATE_FORMAT_SHORT)}
  //           &mdash; {ed.format(DATE_FORMAT_SHORT)}
  //         </span>
  //       </div>
  //       <span className={styles.type}>{t('cycle')}</span>
  //     </a>
  //   </Link>
  // </article>
};

export default MosaicItem;
