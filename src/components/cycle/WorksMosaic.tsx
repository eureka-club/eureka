import { Cycle } from '@prisma/client';
import { FunctionComponent } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useQuery } from 'react-query';

import { WorkMosaicItem } from '../../types/work';
import Mosaic from '../Mosaic';
import { CycleDetail } from '../../types/cycle';
// import { MosaicItem } from '../types/work';

interface Props {
  cycle: CycleDetail;
}

const WorksMosaic: FunctionComponent<Props> = ({ cycle }) => {
  // const { isLoading, isSuccess, data } = useQuery<WorkMosaicItem[]>(
  //   ['works.mosaic.cycle', cycle.id],
  //   async ({ queryKey: [, cycleId] }) => {
  //     const whereQP = encodeURIComponent(JSON.stringify({ cycles: { some: { id: cycleId } } }));
  //     const includeQP = encodeURIComponent(JSON.stringify({ localImages: true }));
  //     const res = await fetch(`/api/search/works?where=${whereQP}&include=${includeQP}`);

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
      {/* isSuccess && */ cycle.works != null && <Mosaic stack={cycle.works as WorkMosaicItem[]} />}
    </>
  );
};

export default WorksMosaic;
