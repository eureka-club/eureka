import classNames from 'classnames';
import { FunctionComponent } from 'react';
import { Badge } from 'react-bootstrap';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

import { IMG_URI_PREFIX } from '../../constants';
import styles from './Cycle.module.css';

interface Props {
  bookmarked?: boolean;
  image: string;
  liked?: boolean;
  startDate: string;
  endDate: string;
  title: string;
}

const Cycle: FunctionComponent<Props> = ({ bookmarked, image, liked, startDate, endDate, title }) => {
  return (
    <article className={styles.cycle}>
      <div className={styles.imageContainer}>
        <a href="#test">
          <img src={`${IMG_URI_PREFIX}/${image}`} alt={title} />
        </a>

        <div className={styles.placer}>
          <a href="#test">
            <h3 className={styles.title}>{title}</h3>
          </a>
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
