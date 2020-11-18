import dayjs from 'dayjs';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import { Badge } from 'react-bootstrap';
import { BsBookmark } from 'react-icons/bs';
import { AiOutlineHeart } from 'react-icons/ai';

import LocalImage from '../LocalImage';
import { PostDetail } from '../../types';
import styles from './Cycle.module.css';

const Cycle: FunctionComponent<PostDetail> = ({
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
        <Link href={`/?id=${cycleId}`} as={`/cycle/${cycleId}`}>
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
          {dayjs(cycleStartDate).format('MMM D YYYY')}&nbsp;&#8209;&nbsp;{dayjs(cycleEndDate).format('MMM D YYYY')}
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
