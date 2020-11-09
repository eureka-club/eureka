import classNames from 'classnames';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import { Badge } from 'react-bootstrap';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

import { IMG_URI_PREFIX } from '../../constants';
import styles from './Cycle.module.css';

interface Props {
  id: string;
  bookmarked?: boolean;
  image: string;
  liked?: boolean;
  startDate: string;
  endDate: string;
  title: string;
}

const Cycle: FunctionComponent<Props> = ({ id, bookmarked, image, liked, startDate, endDate, title }) => {
  return (
    <article className={styles.cycle}>
      <div className={styles.imageContainer}>
        <Link href={`/?id=${id}`} as={`/cycle/${id}`}>
          <a>
            <img src={`${IMG_URI_PREFIX}/${image}`} alt={title} />
          </a>
        </Link>

        <div className={styles.placer}>
          <Link href={`/?id=${id}`} as={`/cycle/${id}`}>
            <a>
              <h3 className={styles.title}>{title}</h3>
            </a>
          </Link>
          <span className={styles.dateRange}>
            {startDate}&#8209;{endDate}
          </span>

          <div className={classNames('d-flex', styles.actionsWrapper)}>
            <div>
              <Badge pill variant="primary">
                Cycle
              </Badge>
            </div>
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
      </div>
    </article>
  );
};

export default Cycle;
