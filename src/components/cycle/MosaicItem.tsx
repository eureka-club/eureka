import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';
import { AiOutlineHeart } from 'react-icons/ai';
import { BsBookmark } from 'react-icons/bs';

import { DATE_FORMAT_HUMANIC_SHORT_ADVANCED } from '../../constants';
import { CycleWithImages } from '../../types/cycle';
import LocalImageComponent from '../LocalImage';
import { advancedDayjs } from '../../lib/utils';
import styles from './MosaicItem.module.css';

const MosaicItem: FunctionComponent<CycleWithImages> = ({ id, title, localImages, startDate, endDate }) => {
  const { t } = useTranslation('common');

  return (
    <article className={styles.cycle}>
      <div className={styles.imageContainer}>
        <Link href={`/cycle/${id}`}>
          <a className="d-inline-block">
            <LocalImageComponent filePath={localImages[0].storedFile} alt={title} />
          </a>
        </Link>
        <div className={styles.embeddedInfo}>
          <h3 className={styles.title}>
            <Link href={`/cycle/${id}`}>
              <a>
                {title}
                <span className={styles.date}>
                  {advancedDayjs(startDate).format(DATE_FORMAT_HUMANIC_SHORT_ADVANCED)}
                  &mdash;
                  {advancedDayjs(endDate).format(DATE_FORMAT_HUMANIC_SHORT_ADVANCED)}
                </span>
              </a>
            </Link>
          </h3>
        </div>
        <span className={styles.type}>{t('cycle')}</span>
        <div className={styles.actions}>
          <BsBookmark className={styles.actionBookmark} />
          <AiOutlineHeart className={styles.actionLike} />
        </div>
      </div>
    </article>
  );
};

export default MosaicItem;
