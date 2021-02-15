import { Work } from '@prisma/client';
import { flatten, zip } from 'lodash';
import { FunctionComponent, useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useQuery } from 'react-query';

import Mosaic from '../Mosaic';
import { MosaicItem } from '../../types';
import { CycleMosaicItem } from '../../types/cycle';
import { PostMosaicItem } from '../../types/post';

interface Props {
  work: Work;
}

const CombinedMosaic: FunctionComponent<Props> = ({ work }) => {
  const { isLoading: isCyclesLoading, isSuccess: isCyclesSuccess, data: cyclesData } = useQuery<CycleMosaicItem[]>(
    ['work.mosaic.cycles', work.id],
    async ({ queryKey: [, workId] }) => {
      const whereQP = encodeURIComponent(JSON.stringify({ works: { some: { id: workId } } }));
      const includeQP = encodeURIComponent(JSON.stringify({ localImages: true }));
      const res = await fetch(`/api/search/cycles?where=${whereQP}&include=${includeQP}`);

      return res.json();
    },
  );
  const { isLoading: isPostsLoading, isSuccess: isPostsSuccess, data: postsData } = useQuery<PostMosaicItem[]>(
    ['work.mosaic.posts', work.id],
    async ({ queryKey: [, workId] }) => {
      const whereQP = encodeURIComponent(JSON.stringify({ works: { some: { id: workId } } }));
      const includeQP = encodeURIComponent(JSON.stringify({ creator: true, localImages: true, works: true }));
      const res = await fetch(`/api/search/posts?where=${whereQP}&include=${includeQP}`);

      return res.json();
    },
  );
  const [mosaicData, setMosaicData] = useState<MosaicItem[]>([]);

  useEffect(() => {
    if (isCyclesSuccess && cyclesData != null && isPostsSuccess && postsData != null) {
      const interleavedMosaicItems = flatten(zip(cyclesData, postsData)).filter((i) => i != null) as MosaicItem[];
      setMosaicData(interleavedMosaicItems);
    }
  }, [isCyclesSuccess, cyclesData, isPostsSuccess, postsData]);

  return (
    <>
      {(isCyclesLoading || isPostsLoading) && (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}
      {mosaicData.length && <Mosaic stack={mosaicData} postsLinksTo={work} />}
    </>
  );
};

export default CombinedMosaic;
