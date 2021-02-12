import classNames from 'classnames';
import { FunctionComponent } from 'react';
import { AiOutlineHeart } from 'react-icons/ai';
import { BsBookmark } from 'react-icons/bs';

import { PostMosaicItem } from '../../types/post';
import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';

const MosaicItem: FunctionComponent<PostMosaicItem> = ({ creator, title, localImages, works }) => {
  return (
    <article className={styles.post}>
      <div className={styles.imageContainer}>
        <div className={styles.cycleCreator}>
          <img
            src={creator.image || '/img/default-avatar.png'}
            alt="creator avatar"
            className={classNames(styles.cycleCreatorAvatar, 'mr-2')}
          />
          {creator.name}
        </div>
        <LocalImageComponent className={styles.postImage} filePath={localImages[0]?.storedFile} alt={title} />
        <span className={styles.type}>Post</span>
        <div className={styles.actions}>
          <BsBookmark className={styles.actionBookmark} />
          <AiOutlineHeart className={styles.actionLike} />
        </div>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <h5 className={styles.work}>{works[0]?.title}</h5>
    </article>
  );
};

export default MosaicItem;
