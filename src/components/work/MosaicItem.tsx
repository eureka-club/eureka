import Link from 'next/link';
import { FunctionComponent } from 'react';
import { AiOutlineHeart } from 'react-icons/ai';
import { BsBookmark } from 'react-icons/bs';

import { WorkWithImage } from '../../types/work';
import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';

const MosaicItem: FunctionComponent<WorkWithImage> = ({ id, author, title, localImages, type }) => {
  return (
    <article className={styles.post}>
      <div className={styles.imageContainer}>
        <Link href={`/work/${id}`}>
          <a className="d-inline-block">
            <LocalImageComponent filePath={localImages[0].storedFile} alt={title} />
          </a>
        </Link>
        <span className={styles.type}>{type}</span>
        <div className={styles.actions}>
          <BsBookmark className={styles.actionBookmark} />
          <AiOutlineHeart className={styles.actionLike} />
        </div>
      </div>
      <Link href={`/work/${id}`}>
        <a className={styles.title}>{title}</a>
      </Link>
      <span className={styles.author}>{author}</span>
    </article>
  );
};

export default MosaicItem;
