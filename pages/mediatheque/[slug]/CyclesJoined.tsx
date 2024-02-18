import { CycleDetail, CycleSumary } from "@/src/types/cycle";
import CarouselStatic from '@/src/components/CarouselStatic';
import { FC } from "react";
import { useSession } from "next-auth/react";

interface Props{
    cycles:CycleSumary[];
    goTo:(path:string)=>void;
    t:(val:string)=>string;
    id:string;
}

const CyclesJoined:FC<Props> = ({cycles,id,goTo,t}) => {
  const {data:session} = useSession();

    return (cycles && cycles.length) 
    ?<div data-cy="cycles-created-or-joined">
      <CarouselStatic
        cacheKey={['MY-CYCLES',id.toString()]}
        onSeeAll={()=>goTo('my-cycles')}
        seeAll={!!session}
        title={t('common:myCycles')}
        data={cycles}
      />
    </div> 
    : <></>;
  };

export default CyclesJoined;