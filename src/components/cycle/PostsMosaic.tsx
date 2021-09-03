import { Cycle } from '@prisma/client';
import { FunctionComponent } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useQuery } from 'react-query';

import { CycleMosaicItem } from '../../types/cycle';
import { PostMosaicItem } from '../../types/post';
import Mosaic from '../Mosaic';

interface Props {
  cycle: CycleMosaicItem;
  display?: 'horizontally' | 'vertically';
  showComments?: boolean;
  cacheKey: [string, string];
}

const PostsMosaic: FunctionComponent<Props> = ({ cycle, display, showComments, cacheKey }) => {
  // const { isLoading, isSuccess, data } = useQuery<PostMosaicItem[]>(
  //   ['posts.mosaic.cycle', cycle.id],
  //   async ({ queryKey: [, cycleId] }) => {
  //     const whereQP = encodeURIComponent(JSON.stringify({ cycles: { some: { id: cycleId } } }));
  //     const includeQP = encodeURIComponent(JSON.stringify({ creator: true, localImages: true, works: true }));
  //     const res = await fetch(`/api/search/posts?where=${whereQP}&include=${includeQP}`);

  //     return res.json();
  //   },
  // );

  return (
    <>
      {/* {isLoading && (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )} */}
      {(cycle.posts && (
        <Mosaic
          display={display}
          stack={cycle.posts as PostMosaicItem[]}
          postsLinksTo={cycle}
          showComments={showComments}
          cacheKey={cacheKey}
        />
      )) ||
        null}
    </>
  );
};

export default PostsMosaic;
