import { useRouter } from "next/navigation";
import { FC } from "react";
import CarouselStatic from "../CarouselStatic";
import useInterestedCycles from '@/src/useInterestedCycles';
import { useDictContext } from "@/src/hooks/useDictContext";

interface Props {
}

const FeaturedCycles:FC<Props> = ({}) => {
    const router = useRouter()
    const { t, dict } = useDictContext();
    const {data} = useInterestedCycles()

    return (data?.cycles && data?.cycles.length) 
    ? <div>      
       <CarouselStatic
        cacheKey={['CYCLES','INTERESTED']}
        onSeeAll={()=>router.push('/featured-cycles')}
        data={data?.cycles}
        title={t(dict,'Interest cycles')}
        //seeAll={cycles.length<dataCycles?.total}
      />
      </div>
    : <></>;
  };

  export default FeaturedCycles