import { CycleSumary } from "@/src/types/cycle";
import CarouselStatic from '@/src/components/CarouselStatic';
import { FC } from "react";
import useTranslation from "next-translate/useTranslation";
import { Box, BoxProps } from "@mui/material";

interface Props extends BoxProps{
    cycles:CycleSumary[];
    goTo:(path:string)=>void;
    id:string;
    showSeeAll?:boolean
}

const CyclesJoined:FC<Props> = ({cycles,id,goTo,showSeeAll=true,...others}) => {
  const { t } = useTranslation('mediatheque');

    return (cycles && cycles.length) 
    ?<Box data-cy="cycles-created-or-joined" id="cycles-created-or-joined" {...others}>
      <CarouselStatic
        cacheKey={['MY-CYCLES',id.toString()]}
        onSeeAll={()=>goTo('my-cycles')}
        seeAll={showSeeAll}
        title={t('common:myCycles')}
        data={cycles}
      />
    </Box> 
    : <></>;
  };

export default CyclesJoined;