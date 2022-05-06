// import { Cycle } from '@prisma/client';
import { FunctionComponent } from 'react';
// import Spinner from 'react-bootstrap/Spinner';
// import { useQuery } from 'react-query';

import { CommentMosaicItem } from '../../types/comment';
import Mosaic from '../Mosaic'; 

interface Props {
  comments: CommentMosaicItem[];

  display?: 'h' | 'v';
  cacheKey: [string, string];
}

const PostsMosaic: FunctionComponent<Props> = ({ comments, display, cacheKey }) => {
  return (
    <>
      {(comments && (
        <Mosaic
          // display={display}
          stack={comments.sort((p, c) => (p.id > c.id && -1) || 1) as CommentMosaicItem[]}
          // postsLinksTo={cycle}
          cacheKey={cacheKey}
          className="mt-3"
        />
      )) ||
        null}
    </>
  );
};

export default PostsMosaic;
