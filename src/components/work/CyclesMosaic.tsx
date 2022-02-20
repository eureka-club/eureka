import { Work } from '@prisma/client';
import { FunctionComponent } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useQuery } from 'react-query';

import { CycleMosaicItem } from '../../types/cycle';
import Mosaic from '../Mosaic';

interface Props {
  work: Work;
}

const CyclesMosaic: FunctionComponent<Props> = ({ work }) => {
  const { isLoading, isSuccess, data } = useQuery<CycleMosaicItem[]>(
    ['work.mosaic.cycles', work.id],
    async ({ queryKey: [, workId] }) => {
      const whereQP = encodeURIComponent(JSON.stringify({ works: { some: { id: workId } } }));
      const includeQP = encodeURIComponent(JSON.stringify({ localImages: true }));
      const res = await fetch(`/api/search/cycles?where=${whereQP}&include=${includeQP}`);

      return res.json();
    },
  );

  return (
    <>
      {isLoading && (
        <Spinner animation="grow" role="status"/>        
      )}
      {isSuccess && data != null && <Mosaic cacheKey={['WORK',work.id.toString()]} className='d-flex justify-content-center justify-content-md-start' stack={data} />}
    </>
  );
};

export default CyclesMosaic;
