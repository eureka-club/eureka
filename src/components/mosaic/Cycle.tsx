import Link from 'next/link';
import { FunctionComponent } from 'react';
import { Badge } from 'react-bootstrap';
import { BsBookmark } from 'react-icons/bs';
import { AiOutlineHeart } from 'react-icons/ai';

import { DATE_FORMAT_HUMANIC_ADVANCED } from '../../constants';
import { advancedDayjs } from '../../lib/utils';
import LocalImage from '../LocalImage';
import { MosaicItem } from '../../types';
import styles from './Cycle.module.css';

const Cycle: FunctionComponent<MosaicItem> = ({
  'local_image.stored_file': imagePath,
  'cycle.id': cycleId,
  'cycle.title': cycleTitle,
  'cycle.start_date': cycleStartDate,
  'cycle.end_date': cycleEndDate,
  'work.title': workTitle,
}) => {
  return (
    <article className={styles.cycle}>
      <div className={styles.imageContainer}>
        <Link href={`/cycle/${cycleId}`}>
          <a>
            <LocalImage filePath={imagePath} alt={workTitle} />
          </a>
        </Link>
        <Link href={`/?id=${cycleId}`} as={`/cycle/${cycleId}`}>
          <a>
            <h3 className={styles.title}>{cycleTitle}</h3>
          </a>
        </Link>
        <span className={styles.dateRange}>
          {advancedDayjs(cycleStartDate).format(DATE_FORMAT_HUMANIC_ADVANCED)}&nbsp;&#8209;&nbsp;
          {advancedDayjs(cycleEndDate).format(DATE_FORMAT_HUMANIC_ADVANCED)}
        </span>

        <Badge pill variant="primary" className={styles.badge}>
          Cycle
        </Badge>
        <div className={styles.actions}>
          <BsBookmark className={styles.actionBookmark} />
          <AiOutlineHeart className={styles.actionLike} />
        </div>
      </div>
    </article>
  );
};

export default Cycle;
