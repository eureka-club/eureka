import { CycleDetail } from "@/src/types/cycle";
import CarouselStatic from '@/src/components/CarouselStatic';
import { FC } from "react";
import { useSession } from "next-auth/react";
import { useDictContext } from '@/src/hooks/useDictContext';

import getUserIdFromSlug from "@/src/getUserIdFromSlug";
import { useParams } from "next/navigation";
import useCyclesJoined from "../hooks/useCyclesJoined";

interface Props{
    goTo:(path:string)=>void;
}

const CyclesJoined:FC<Props> = ({goTo}) => {
  const {data:session} = useSession();
  const {slug,lang}=useParams<{slug:string,lang:string}>()!;
  const id = getUserIdFromSlug(slug);
  
  const { t, dict } = useDictContext();
  const {data:cycles} = useCyclesJoined(id,lang);

  return (cycles && cycles.length) 
    ?<div data-cy="cycles-created-or-joined">
      <CarouselStatic
        cacheKey={['USER',id.toString(),'CYCLES-JOINED']}
        onSeeAll={()=>goTo('my-cycles')}
        seeAll={!!session}
        title={t(dict,'myCycles')}
        data={cycles}
      />
    </div> 
    : <></>;
  };

export default CyclesJoined;