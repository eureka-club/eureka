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
import { CycleMosaicItem } from '../types/cycle';
import { WorkMosaicItem } from '../types/work';

interface Props {
  postsLinksTo?: CycleMosaicItem | WorkMosaicItem;
  stack: MosaicItem[];
  showButtonLabels?: boolean;
  display?: 'horizontally' | 'vertically';
  showComments?: boolean;
  cacheKey?: string[];
}

const renderMosaicItem = (
  item: MosaicItem,
  postsParent: CycleMosaicItem | WorkMosaicItem | undefined,
  showButtonLabels: boolean,
  display: 'horizontally' | 'vertically',
  showComments: boolean,
  cacheKey?: string[],
) => {
  if (isCycleMosaicItem(item)) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <MosaicItemCycle key={`cycle-${item.id}`} cycle={item} detailed />;
  }
  if (isPostMosaicItem(item)) {
    return (
      <MosaicItemPost
        key={`post-${item.id}`}
        showComments={showComments}
        post={item}
        postParent={postsParent}
        display={display}
        cacheKey={cacheKey}
      />
    );
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

const Mosaic: FunctionComponent<Props> = ({
  postsLinksTo,
  stack,
  showButtonLabels = true,
  display = 'vertically',
  showComments = false,
  cacheKey,
}) => {
  return (
    <Masonry
      breakpointCols={{
        default: display === 'vertically' ? 4 : 1,
        1199: display === 'vertically' ? 3 : 1,
        768: display === 'vertically' ? 2 : 1,
        576: 1,
      }}
      className={classNames('d-flex', styles.masonry)}
      columnClassName={styles.masonryColumn}
    >
      {stack.map((item: MosaicItem) =>
        renderMosaicItem(item, postsLinksTo, showButtonLabels, display, showComments, cacheKey),
      )}
    </Masonry>
  );
};

export default Mosaic;
