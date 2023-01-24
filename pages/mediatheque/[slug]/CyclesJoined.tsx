import { CycleMosaicItem } from "@/src/types/cycle";
import CarouselStatic from '@/src/components/CarouselStatic';
import { FC } from "react";

interface Props{
    cycles:CycleMosaicItem[];
    goTo:(path:string)=>void;
    t:(val:string)=>string;
    id:string;
}

const CyclesJoined:FC<Props> = ({cycles,id,goTo,t}) => {
    return (cycles && cycles.length) 
    ?<div data-cy="cycles-created-or-joined">
      <CarouselStatic
        cacheKey={['MY-CYCLES',id.toString()]}
        onSeeAll={()=>goTo('my-cycles')}
        title={t('common:myCycles')}
        data={cycles}
      />
    </div> 
    : <></>;
  };

export default CyclesJoined;