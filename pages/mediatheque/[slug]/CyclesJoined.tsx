import { CycleSumary } from "@/src/types/cycle";
import CarouselStatic from '@/src/components/CarouselStatic';
import { FC } from "react";
import useTranslation from "next-translate/useTranslation";

interface Props{
    cycles:CycleSumary[];
    goTo:(path:string)=>void;
    id:string;
    showSeeAll?:boolean
}

const CyclesJoined:FC<Props> = ({cycles,id,goTo,showSeeAll=true}) => {
  const { t } = useTranslation('mediatheque');

    return (cycles && cycles.length) 
    ?<div data-cy="cycles-created-or-joined">
      <CarouselStatic
        cacheKey={['MY-CYCLES',id.toString()]}
        onSeeAll={()=>goTo('my-cycles')}
        seeAll={showSeeAll}
        title={t('common:myCycles')}
        data={cycles}
      />
    </div> 
    : <></>;
  };

export default CyclesJoined;