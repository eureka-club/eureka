import classNames from 'classnames';
import { FunctionComponent } from 'react';
import Masonry from 'react-masonry-css';

import { MosaicItem, isCycleObject } from '../types';
import Cycle from './mosaic/Cycle';
import Post from './mosaic/Post';
import styles from './Mosaic.module.css';

interface Props {
  stack: MosaicItem[];
}

const renderMosaicItem = (item: MosaicItem) => {
  if (isCycleObject(item)) {
    return <Cycle key={item['cycle.id']} {...item} />; // eslint-disable-line react/jsx-props-no-spreading
  }

  return <Post key={item['post.id']} {...item} />; // eslint-disable-line react/jsx-props-no-spreading
};

const Mosaic: FunctionComponent<Props> = ({ stack }) => {
  return (
    <Masonry
      breakpointCols={{
        default: 4,
        1199: 3,
        768: 2,
        576: 1,
      }}
      className={classNames('d-flex', styles.masonry)}
      columnClassName={styles.masonryColumn}
    >
      {stack.map((item: MosaicItem) => renderMosaicItem(item))}
    </Masonry>
  );
};

export default Mosaic;
