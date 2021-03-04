import dayjs from 'dayjs';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';
import { AiOutlineHeart } from 'react-icons/ai';
import { BsBookmark } from 'react-icons/bs';
import ActionButton from '../common/ActionButton';

import { DATE_FORMAT_SHORT } from '../../constants';
import { CycleWithImages } from '../../types/cycle';
import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';

const MosaicItem: FunctionComponent<CycleWithImages> = ({
  id,
  title,
  localImages,
  startDate,
  endDate
}) => {
  const { t } = useTranslation('common');

  return (
    <article className={styles.cycle}>
      <Link href={`/cycle/${id}`}>
        <a className="d-inline-block">
          <LocalImageComponent filePath={localImages[0].storedFile} alt={title} />

          <div className={styles.gradient} />
          <div className={styles.embeddedInfo}>
            <h3 className={styles.title}>{title}</h3>
            <span className={styles.date}>
              {dayjs(startDate).format(DATE_FORMAT_SHORT)}
              &mdash; {dayjs(endDate).format(DATE_FORMAT_SHORT)}
            </span>
          </div>
          <span className={styles.type}>{t('cycle')}</span>
        </a>
      </Link>
    </article>
  );
};

export default MosaicItem;
