import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';

import { DATE_FORMAT_SHORT } from '../../constants';
import { CycleWithImages } from '../../types/cycle';
import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';

dayjs.extend(utc);
dayjs.extend(timezone);

const MosaicItem: FunctionComponent<CycleWithImages> = ({ id, title, localImages, startDate, endDate }) => {
  const { t } = useTranslation('common');
  const sd = dayjs(startDate).add(1, 'day').tz(dayjs.tz.guess());
  const ed = dayjs(endDate).add(1, 'day').tz(dayjs.tz.guess());

  return (
    <article className={styles.cycle}>
      <Link href={`/cycle/${id}`}>
        <a className="d-inline-block">
          <LocalImageComponent filePath={localImages[0].storedFile} alt={title} />

          <div className={styles.gradient} />
          <div className={styles.embeddedInfo}>
            <h3 className={styles.title}>{title}</h3>
            <span className={styles.date}>
              {sd.format(DATE_FORMAT_SHORT)}
              &mdash; {ed.format(DATE_FORMAT_SHORT)}
            </span>
          </div>
          <span className={styles.type}>{t('cycle')}</span>
        </a>
      </Link>
    </article>
  );
};

export default MosaicItem;
