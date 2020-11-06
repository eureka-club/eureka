import classNames from 'classnames';
import { FunctionComponent } from 'react';
import Masonry from 'react-masonry-css';

import styles from './Mosaic.module.css';

const Mosaic: FunctionComponent = () => {
  return (
    <Masonry breakpointCols={4} className={classNames('d-flex', styles.masonry)} columnClassName={styles.masonryColumn}>
      <div />
    </Masonry>
  );
};

export default Mosaic;
