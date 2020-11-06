import classNames from 'classnames';
import { FunctionComponent } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';

import styles from './Post.module.css';

interface Props {
  author: string;
  bookmarked?: boolean;
  image: string;
  liked?: boolean;
  title: string;
}

const IMG_URI_PREFIX = '/app-assets';

const Post: FunctionComponent<Props> = ({ author, bookmarked, image, liked, title }) => {
  return (
    <article className={styles.post}>
      <div className={styles.imageContainer}>
        <a href="#test">
          <img src={`${IMG_URI_PREFIX}/${image}`} alt={title} />
        </a>
        <div className={classNames('d-flex', styles.placer)}>
          <div className={styles.actions}>
            {bookmarked ? (
              <BsBookmarkFill className={styles.actionBookmark} />
            ) : (
              <BsBookmark className={styles.actionBookmark} />
            )}
            {liked ? <AiFillHeart className={styles.actionLike} /> : <AiOutlineHeart className={styles.actionLike} />}
          </div>
        </div>
      </div>
      <a href="#test">
        <h3 className={styles.title}>{title}</h3>
      </a>
      <a href="#test">
        <span className={styles.author}>{author}</span>
      </a>
    </article>
  );
};

export default Post;
