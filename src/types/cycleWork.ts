import { Prisma } from '@prisma/client';
import { WorkSumarySpec } from './work';

export const CycleWorkSpec = {
  select:{
    id:true,
    // cycle:{select:CycleSumarySpec.select},
    cycle:{select:{id:true}},
    work:{select:WorkSumarySpec.select},
    cycleId:true,
    workId:true,
    startDate:true,
    endDate:true,
  }
}
export type CycleWork = Prisma.CycleGetPayload<typeof CycleWorkSpec> & {
 
};
