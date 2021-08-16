import { Cycle, Work } from '@prisma/client';
import classNames from 'classnames';
import { FunctionComponent } from 'react';
import Masonry from 'react-masonry-css';

import { MosaicItem, isCycleMosaicItem, isWorkMosaicItem, isPostMosaicItem, isUserMosaicItem } from '../types';
import MosaicItemCycle from './cycle/MosaicItem';
import MosaicItemPost from './post/MosaicItem';
import MosaicItemWork from './work/MosaicItem';
import MosaicItemUser from './user/MosaicItem';
import styles from './Mosaic.module.css';

interface Props {
  postsLinksTo?: Cycle | Work;
  stack: MosaicItem[];
  showButtonLabels?: boolean;
}

const renderMosaicItem = (item: MosaicItem, postsParent: Cycle | Work | undefined, showButtonLabels: boolean) => {
  if (isCycleMosaicItem(item)) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <MosaicItemCycle key={`cycle-${item.id}`} cycle={item} detailed />;
  }
  if (isPostMosaicItem(item)) {
    return <MosaicItemPost key={`post-${item.id}`} post={item} postParent={postsParent} />;
  }
  if (isWorkMosaicItem(item)) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <MosaicItemWork showShare={false} showButtonLabels={showButtonLabels} key={`work-${item.id}`} work={item} />;
  }
  if (isUserMosaicItem(item)) {
    return <MosaicItemUser key={`user-${item.id}`} user={item} />;
  }

  return '';
};

const Mosaic: FunctionComponent<Props> = ({ postsLinksTo, stack, showButtonLabels = true }) => {
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
      {stack.map((item: MosaicItem) => renderMosaicItem(item, postsLinksTo, showButtonLabels))}
    </Masonry>
  );
};

export default Mosaic;
