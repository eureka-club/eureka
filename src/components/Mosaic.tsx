import classNames from 'classnames';
import { FunctionComponent } from 'react';
import Masonry from 'react-masonry-css';

import { MosaicItem, isMosaicWork } from '../types';
import MosaicItemWork from './work/MosaicItem';
import styles from './Mosaic.module.css';

interface Props {
  stack: MosaicItem[];
}

const renderMosaicItem = (item: MosaicItem) => {
  if (isMosaicWork(item)) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <MosaicItemWork key={`work-${item.id}`} {...item} />;
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
