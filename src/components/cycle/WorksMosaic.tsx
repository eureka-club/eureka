import { CycleWork } from '@prisma/client';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { FunctionComponent } from 'react';
// import Spinner from 'react-bootstrap/Spinner';
// import { useQuery } from 'react-query';

import { WorkMosaicItem } from '../../types/work';
import Mosaic from '../Mosaic';
import { CycleMosaicItem } from '../../types/cycle';
import { Work } from '.prisma/client';
// import { MosaicItem } from '../types/work';

interface Props {
  cycle: CycleMosaicItem;
  className?: string;
}
dayjs.extend(isBetween);
const WorksMosaic: FunctionComponent<Props> = ({ cycle, className }) => {
  // const { isLoading, isSuccess, data } = useQuery<WorkMosaicItem[]>(
  //   ['works.mosaic.cycle', cycle.id],
  //   async ({ queryKey: [, cycleId] }) => {
  //     const whereQP = encodeURIComponent(JSON.stringify({ cycles: { some: { id: cycleId } } }));
  //     const includeQP = encodeURIComponent(JSON.stringify({ localImages: true }));
  //     const res = await fetch(`/api/search/works?where=${whereQP}&include=${includeQP}`);

  //     return res.json();
  //   },
  // );
  const getWorksSorted = () => {
    const res: Work[] = [];
    cycle.cycleWorksDates
      .sort((f, s) => {
        const fCD = dayjs(f.startDate!);
        const sCD = dayjs(s.startDate!);
        const isActive = (w: CycleWork) => {
          if (w.startDate && w.endDate) return dayjs().isBetween(w.startDate!, w.endDate);
          if (w.startDate && !w.endDate) return dayjs().isAfter(w.startDate);
          return false;
        };

        if (isActive(f) && !isActive(s)) return -1;
        if (!isActive(f) && isActive(s)) return 1;
        if (fCD.isAfter(sCD)) return 1;
        if (fCD.isSame(sCD)) return 0;
        return -1;
      })
      .forEach((cw) => {
        const idx = cycle.works.findIndex((w) => w.id === cw.workId);
        res.push(cycle.works[idx]);
      });

    if (cycle.cycleWorksDates.length) return res;
    return cycle.works;
  };
  return (
    <>
      {/* {isLoading && (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )} */}
      {
        /* isSuccess && */ cycle.works != null && (
          <Mosaic className={className} showButtonLabels={false} stack={getWorksSorted() as WorkMosaicItem[]} />
        )
      }
    </>
  );
};

export default WorksMosaic;
