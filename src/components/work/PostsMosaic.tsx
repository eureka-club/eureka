import { Prisma, Work } from '@prisma/client';
import { FunctionComponent } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useQuery } from 'react-query';

import Mosaic from '../Mosaic';

interface Props {
  work: Work;
}

const PostsMosaic: FunctionComponent<Props> = ({ work }) => {
  const { isLoading, isSuccess, data } = useQuery<
    Prisma.PostGetPayload<{
      include: {
        creator: true;
        localImages: true;
        works: true;
      };
    }>[]
  >(['work.mosaic.posts', work.id], async ({ queryKey: [, workId] }) => {
    const whereQP = encodeURIComponent(JSON.stringify({ works: { some: { id: workId } } }));
    const includeQP = encodeURIComponent(JSON.stringify({ creator: true, localImages: true, works: true }));
    const res = await fetch(`/api/search/posts?where=${whereQP}&include=${includeQP}`);

    return res.json();
  });

  return (
    <>
      {isLoading && (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}
      {isSuccess && data != null && <Mosaic stack={data} />}
    </>
  );
};

export default PostsMosaic;
