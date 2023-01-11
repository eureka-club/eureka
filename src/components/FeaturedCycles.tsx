import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { FC } from "react";
import { CycleMosaicItem } from "../types/cycle";
import CarouselStatic from "./CarouselStatic";

interface DataFeaturedCycles {
    cycles: CycleMosaicItem[];
    fetched: number;
    total: number;
  }
  
const FeaturedCycles:FC<{featuredCycles:CycleMosaicItem[]|undefined,dataFeaturedCycles:DataFeaturedCycles|undefined}> = ({featuredCycles,dataFeaturedCycles}) => {
    const router = useRouter()
    const { t } = useTranslation('common');

    return (featuredCycles && featuredCycles.length && dataFeaturedCycles) 
    ? <div>      
       <CarouselStatic
        cacheKey={['CYCLES','INTERESTED']}
        onSeeAll={()=>router.push('/featured-cycles')}
        data={featuredCycles}
        title={t('Interest cycles')}
        //seeAll={cycles.length<dataCycles?.total}
      />
      </div>
    : <></>;
  };

  export default FeaturedCycles