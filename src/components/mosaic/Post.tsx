import classNames from 'classnames';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import { AiOutlineHeart } from 'react-icons/ai';
import { BsBookmark } from 'react-icons/bs';

import { ASSETS_BASE_URL } from '../../constants';
import { PostDetail } from '../../types';
import styles from './Post.module.css';

const Post: FunctionComponent<PostDetail> = ({
  'post.id': postId,
  'local_image.stored_file': imagePath,
  'work.author': workAuthor,
  'work.title': workTitle,
}) => {
  return (
    <article className={styles.post}>
      <div className={styles.imageContainer}>
        <Link href={`/?id=${postId}`} as={`/post/${postId}`}>
          <a className="d-inline-block">
            <img src={`${ASSETS_BASE_URL}/${imagePath}`} alt={workTitle} />
          </a>
        </Link>
        <div className={classNames('d-flex', styles.placer)}>
          <div className={styles.actions}>
            <BsBookmark className={styles.actionBookmark} />
            <AiOutlineHeart className={styles.actionLike} />
          </div>
        </div>
      </div>
      <Link href={`/?id=${postId}`} as={`/post/${postId}`}>
        <a>
          <h3 className={styles.title}>{workTitle}</h3>
        </a>
      </Link>
      <span className={styles.author}>{workAuthor}</span>
    </article>
  );
};

export default Post;
