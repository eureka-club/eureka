import classNames from 'classnames';
import { FunctionComponent } from 'react';
import Masonry from 'react-masonry-css';

import { MosaicItem, isCycle, isWork } from '../types';
import MosaicItemWork from './work/MosaicItem';
import styles from './Mosaic.module.css';

interface Props {
  stack: MosaicItem[];
}

const renderMosaicItem = (item: MosaicItem) => {
  if (isWork(item)) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <MosaicItemWork key={`work-${item.id}`} {...item} />;
  }
  if (isCycle(item)) {
    return '';
  }

  return '';
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
