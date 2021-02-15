import Link from 'next/link';
import { FunctionComponent } from 'react';
import { AiOutlineHeart } from 'react-icons/ai';
import { BsBookmark } from 'react-icons/bs';

import { CycleWithImages } from '../../types/cycle';
import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';

const MosaicItem: FunctionComponent<CycleWithImages> = ({ id, title, localImages }) => {
  return (
    <article className={styles.cycle}>
      <div className={styles.imageContainer}>
        <Link href={`/cycle/${id}`}>
          <a className="d-inline-block">
            <LocalImageComponent filePath={localImages[0].storedFile} alt={title} />
          </a>
        </Link>
        <span className={styles.type}>Cycle</span>
        <div className={styles.actions}>
          <BsBookmark className={styles.actionBookmark} />
          <AiOutlineHeart className={styles.actionLike} />
        </div>
      </div>
      <Link href={`/cycle/${id}`}>
        <a className={styles.title}>{title}</a>
      </Link>
    </article>
  );
};

export default MosaicItem;
