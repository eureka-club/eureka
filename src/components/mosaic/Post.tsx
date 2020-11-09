import classNames from 'classnames';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';

import { IMG_URI_PREFIX } from '../../constants';
import styles from './Post.module.css';

interface Props {
  id: string;
  author: string;
  bookmarked?: boolean;
  image: string;
  liked?: boolean;
  title: string;
}

const Post: FunctionComponent<Props> = ({ id, author, bookmarked, image, liked, title }) => {
  return (
    <article className={styles.post}>
      <div className={styles.imageContainer}>
        <Link href={`/post/[id]?id=${id}`}>
          <a>
            <img src={`${IMG_URI_PREFIX}/${image}`} alt={title} />
          </a>
        </Link>
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
      <Link href={`/post/[id]?id=${id}`}>
        <a>
          <h3 className={styles.title}>{title}</h3>
        </a>
      </Link>
      <a href="#test">
        <span className={styles.author}>{author}</span>
      </a>
    </article>
  );
};

export default Post;
