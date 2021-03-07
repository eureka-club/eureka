import { Cycle, Work } from '@prisma/client';
import classNames from 'classnames';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';
// import { AiOutlineHeart } from 'react-icons/ai';
// import { BsBookmark } from 'react-icons/bs';

import { PostMosaicItem } from '../../types/post';
import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';
import { isCycle, isWork } from '../../types';

interface Props {
  post: PostMosaicItem;
  postParent?: Cycle | Work;
}

const MosaicItem: FunctionComponent<Props> = ({ post, postParent }) => {
  const postLinkHref = ((): string | null => {
    if (postParent == null) {
      return `/post/${post.id}`;
    }
    if (isCycle(postParent)) {
      return `/cycle/${postParent.id}/post/${post.id}`;
    }
    if (isWork(postParent)) {
      return `/work/${postParent.id}/post/${post.id}`;
    }

    return null;
  })();
  const { t } = useTranslation('common');

  return (
    <article className={styles.post}>
      <div className={styles.imageContainer}>
        <div className={styles.cycleCreator}>
          <img
            src={post.creator.image || '/img/default-avatar.png'}
            alt="creator avatar"
            className={classNames(styles.cycleCreatorAvatar, 'mr-2')}
          />
          {post.creator.name}
        </div>
        {postLinkHref != null ? (
          <Link href={postLinkHref}>
            <a>
              <LocalImageComponent
                className={styles.postImage}
                filePath={post.localImages[0]?.storedFile}
                alt={post.title}
              />
              <div className={styles.gradient} />
            </a>
          </Link>
        ) : (
          <>
            <LocalImageComponent
              className={styles.postImage}
              filePath={post.localImages[0]?.storedFile}
              alt={post.title}
            />
            <div className={styles.gradient} />
          </>
        )}

        <span className={styles.type}>{t('post')}</span>
        {/*
        <div className={styles.actions}>
          <BsBookmark className={styles.actionBookmark} />
          <AiOutlineHeart className={styles.actionLike} />
        </div>
        */}
      </div>
      <h3 className={styles.title}>
        {postLinkHref != null ? (
          <Link href={postLinkHref}>
            <a>{post.title}</a>
          </Link>
        ) : (
          post.title
        )}
      </h3>
      <h5 className={styles.work}>{post.works[0]?.title}</h5>
    </article>
  );
};

export default MosaicItem;
